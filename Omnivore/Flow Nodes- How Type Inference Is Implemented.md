---
id: c58b2506-ea5d-11ee-8ebf-23866a58022f
title: "Flow Nodes: How Type Inference Is Implemented"
tags:
  - RSS
date_published: 2024-03-25 00:03:52
---

# Flow Nodes: How Type Inference Is Implemented
#Omnivore

[Read on Omnivore](https://omnivore.app/me/flow-nodes-how-type-inference-is-implemented-18e73ce7c6d)
[Read Original](https://effectivetypescript.com/2024/03/24/flownodes/)



In most programming languages a variable has a type and that type does not change. But one of the most interesting aspects of TypeScript&#39;s type system is that a symbol has a type _at a location_. Various control flow constructs can change this type:

&#x60;&#x60;&#x60;vim
function refine(x: string | number) {
  &#x2F;&#x2F; type of x is string | number here
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;number&#39;) {
    &#x2F;&#x2F; type of x is number here.
  } else {
    &#x2F;&#x2F; type of x is string here.
  }
}

&#x60;&#x60;&#x60;

![Dall-E&#39;s interpretation of TypeScript&#39;s control flow graph and type inference algorithm.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;256x256,skCIV-RbH9fPTm_CceKxkH4skdTCn6_6gH2NEGVZowII&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;dall-e-control-flow.jpg) _Dall-E&#39;s interpretation of TypeScript&#39;s control flow graph and type inference algorithm._

This is known as &quot;refinement&quot; or &quot;narrowing.&quot; When I look at TypeScript code, I read it from top to bottom and I think about how the type of &#x60;x&#x60; changes as execution moves through each conditional. This works well but, as I learned from my recent work [adding a new form of type inference](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465) in the TypeScript compiler, it&#39;s not at all how type inference is actually implemented!

For users of TypeScript, reading code from top to bottom works just fine. But if you&#39;re working in the TypeScript compiler itself, you&#39;ll need to know how type inference works &quot;under the hood.&quot; The key to this is &quot;Flow Nodes,&quot; which are the nodes in the Control Flow Graph. I had a remarkably hard time finding documentation about FlowNodes online. The official Compiler-Notes repo [just has a &quot;TODO&quot;](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript-Compiler-Notes&#x2F;blob&#x2F;main&#x2F;codebase&#x2F;src&#x2F;compiler&#x2F;binder.md#control-flow) to document them. Basarat&#39;s TypeScript guide makes [no mention](https:&#x2F;&#x2F;basarat.gitbook.io&#x2F;typescript&#x2F;overview&#x2F;checker) of them in the section on the TypeScript Compiler.

I learned a lot about FlowNodes from implementing [#57465](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465) and this post is my attempt to write the &quot;missing manual&quot; on them that I wish I&#39;d had a few months back.

## [](#Confusion &quot;Confusion&quot;)Confusion

My first clue that type inference didn&#39;t work the way I expected came from reading a PR that Anders Hejlsberg wrote in 2021 to [add &quot;aliased conditions&quot; to type inference](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;44730). This let you write something like:

&#x60;&#x60;&#x60;ada
function refine(x: string | number) {
  const isNum &#x3D; typeof x &#x3D;&#x3D;&#x3D; &#39;number&#39;;
  if (isNum) {
    &#x2F;&#x2F; type of x is number here.
  } else {
    &#x2F;&#x2F; type of x is string here.
  }
}

&#x60;&#x60;&#x60;

In my top-to-bottom way of thinking about type inference, it seemed like there must be some kind of &quot;tag&quot; associated with the &#x60;isNum&#x60; variable indicating that it refined the parameter &#x60;x&#x60;. But looking at Anders&#39; PR, this wasn&#39;t at all how it worked. He wasn&#39;t storing any information whatsoever! Instead, all I saw was a bunch of references to flow nodes. So clearly these were important.

When TypeScript parses your code, it forms an [Abstract Syntax Tree](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Abstract%5Fsyntax%5Ftree) (AST). Any node in the TypeScript AST can have an associated &quot;flow node.&quot; The best way to view the TypeScript AST is David Sherret&#39;s [TS AST Viewer](https:&#x2F;&#x2F;ts-ast-viewer.com&#x2F;). When you click on a node, it shows you its FlowNode. This consisted of some flags, a node, and one or more &quot;antecedents.&quot; Curiously &#x60;node.flowNode.node&#x60; was never the same as &#x60;node&#x60;. It was always some other node in the AST.

![A Flow Node and its antecedent in the TS AST Viewer. I didn&#39;t find this view very illuminating.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sSiPQxnusUYto8ZSYpOImPJnNj8835Jmoln35_kik0pQ&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;flownode-tree-view.png) _A Flow Node and its antecedent in the TS AST Viewer. I didn&#39;t find this view very illuminating._

## [](#Graph-Visualization-and-an-Insight &quot;Graph Visualization and an Insight&quot;)Graph Visualization and an Insight

The antecedents were other FlowNodes. These seemed to form some sort of graph structure, so I thought that visualizing them might help. I&#39;d used GraphViz and the dot language to create graph visualizations on a [previous project](https:&#x2F;&#x2F;www.sidewalklabs.com&#x2F;products&#x2F;delve), and this seemed like a natural addition to the TS AST Viewer. I learned later that there was already a [TypeScript playground plugin](https:&#x2F;&#x2F;github.com&#x2F;orta&#x2F;playground-code-show-flow) that did something similar.

Seeing this graph made it much clearer what was going on. This was the control flow graph in reverse! An &#x60;if&#x60; statement came out as a [diamond shape](https:&#x2F;&#x2F;ts-ast-viewer.com&#x2F;#code&#x2F;GYVwdgxgLglg9mABAJwKbBmVAKAHgLkQGcplMBzRAH0TBAFsAjVZASkQG8AoRRCBEohhEAcg0QBeRFACeAB1RxgiXJIlSA5HSYsNAbh5Dl2YWPrtuvXvzBE4AG1QA6e3HLYNphvg0AaFawGvAC+iKj2RKichtYCDs6u7p5EAMqkFD7+uIGGwYY2do4ubh6MAIYQANbScIjg8EiyCho5vGhQIMhIXvQGwUA):

![Control flow graph showing a diamond shape](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,slsUnaC0uM3ujYi7D0S-AIOTw0ouwR_uN9PNkD5mljfo&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;diamond-refine.png) _Full control flow graph showing a diamond shape for branching code._

I showed this to a [batchmate](https:&#x2F;&#x2F;github.com&#x2F;sarahmeyer) at [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;) who had the key insight: a Node&#39;s Flow Node is the previous statement that executed. With branching constructs, there will be more than one possible previous statement.

With loops, the graph [can even have a cyclic](https:&#x2F;&#x2F;ts-ast-viewer.com&#x2F;#code&#x2F;FA1hmCuB2DGAuBLA9tABAG2cgDgCgEo0BvYNTAU3jQA80BeNARgG4y0B3AC0QwrTx0APMwD6ABkkTJRUuXJ0AVIwBMbeWlioAzsj4A6LAHNBBdWgC+7AE5VI19DTYWgA):

![Control flow graph showing a loop](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sW5ke3_kyGFNkS74cn0EqRI3akkN6-EOkS3ycZTRNdgQ&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;loop-graph.png) _Control flow graph showing a cycle for looping code._

I eventually [added this visualization](https:&#x2F;&#x2F;twitter.com&#x2F;danvdk&#x2F;status&#x2F;1762868150800977996) to the TS AST Viewer. You can play around with it yourself to get a sense for how Flow Nodes work.

## [](#Turning-Type-Inference-Upside-Down &quot;Turning Type Inference Upside-Down&quot;)Turning Type Inference Upside-Down

With some intuition about Flow Nodes in place, the code I was seeing in the type checker started to make a lot more sense.

TypeScript greedily constructs the control flow graph in the binder (&#x60;binder.ts&#x60;), then lazily evaluates it as it needs to get types in the checker (&#x60;checker.ts&#x60;) or for display (&#x60;tsserver.ts&#x60;). This is backwards from how we think about narrowing in our heads: rather than narrowing types as you read down your code, TypeScript narrows types by traversing back _up_ the control flow graph from the point where symbols are referenced.

Why does TypeScript do type inference this way? There are two reasons I can think of. The first is performance. In the context of the compiler, a symbol&#39;s type in a location is called its &quot;flow type.&quot; Determining a symbol&#39;s flow type can be an expensive operation. It requires traversing the control flow graph all the way back to the root (usually the start of a function) and potentially computing some relationships between types along the way.

But often the flow type isn&#39;t needed. If you have an &#x60;if&#x60; statement like this:

&#x60;&#x60;&#x60;javascript
function logNum(x: unknown) {
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;number&#39;) {
    console.log(&#39;x is a number&#39;);
  }
}

&#x60;&#x60;&#x60;

Then the type of &#x60;x&#x60; inside the &#x60;if&#x60; statement is &#x60;number&#x60;. But that&#39;s not relevant to the type safety of this code in any way. There&#39;s no reason for TypeScript to determine the flow type of &#x60;x&#x60;. And indeed, it doesn&#39;t. At least not until you write &#x60;x&#x60; in the &#x60;if&#x60; block.

This leads us to a profound realization: until it becomes relevant, TypeScript has no idea what the type of &#x60;x&#x60; is!

If the type of &#x60;x&#x60; becomes relevant for type checking, then TypeScript _will_ determine its flow type:

&#x60;&#x60;&#x60;javascript
function logNum(x: unknown) {
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;number&#39;) {
    &#x2F;&#x2F; x is referenced, so TypeScript needs to know its type.
    console.log(&quot;it&#39;s a number:&quot;, x);
  }
}

&#x60;&#x60;&#x60;

There may be many local variables in scope in your function. By only determining the flow types of the ones that are relevant for type checking, TypeScript potentially saves an enormous amount of work. This results in a more responsive editor and faster compile times. It also reduces TypeScript&#39;s memory usage: only the control flow graph needs to be stored permanently. Flow types can potentially be thrown away after they&#39;re checked.

The other reason that TypeScript does control flow analysis this way is to separate concerns in their code base. The control flow analysis graph is a standalone structure that&#39;s computed once in the binder. (This is the part of the compiler that determines which symbol &#x60;x&#x60; refers to in any location.) This graph can be constructed without any knowledge of what sort of analysis you&#39;d like to do on it.

That analysis happens in the checker, &#x60;checker.ts&#x60;. One part of the compiler constructs the graph greedily, the other runs algorithms on it lazily.

This is what I was seeing in [Anders&#39;s PR](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;44730). He already had all the information he needed in the control flow graph. His PR just made the algorithm that ran over it a little more elaborate. Very few PRs need to change how the control flow is constructed. It&#39;s much more common to change the algorithms that run over it.

## [](#getFlowTypeOfReference &quot;getFlowTypeOfReference&quot;)getFlowTypeOfReference

Speaking of algorithms, let&#39;s take a look at &#x60;getFlowTypeOfReference&#x60;, the workhorse of type inference. This is the function that determines the type of a symbol at a location. It&#39;s a real beast, clocking in at over 1200 lines of code. I&#39;d link to it in [checker.ts](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;blob&#x2F;main&#x2F;src&#x2F;compiler&#x2F;checker.ts), but GitHub won&#39;t even display files this large!

&#x60;getFlowTypeOfReference&#x60; is so large because it follows the usual TypeScript compiler style of defining helper functions as local functions inside a large, top-level function. It quickly calls &#x60;getTypeAtFlowNode&#x60;, which is where the flow node graph traversal happens.

This function consists of a &#x60;while&#x60; loop that looks at the current Flow Node and tries to match it against all the different patterns that can trigger a refinement. If it doesn&#39;t find one, it moves up to the node&#39;s antecedent:

![The code for traversing up the antecedent graph](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sxuST7i7Oqp0ojoAduUyZuKp_iLdfD1B8bcNW8wx_DJY&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;flow-type-recursion.png) _The code for traversing up the antecedent graph in getTypeAtFlowNode_

All the different patterns of refinement that TypeScript supports are represented by helper functions. Here&#39;s a sample:

* narrowTypeByTruthiness
* narrowTypeByBinaryExpression
* narrowTypeByTypeof
* narrowTypeByTypeName
* narrowTypeBySwitchOnDiscriminant
* narrowTypeByInstanceof
* narrowTypeByTypePredicate
* narrowTypeByEquality
* narrowTypeByOptionalChainContainment

It&#39;s interesting to think about what sort of code would trigger each of these. &#x60;narrowTypeByEquality&#x60;, for example, is a special case of &#x60;narrowTypeByBinaryExpression&#x60;. It would trigger on code like this:

&#x60;&#x60;&#x60;typescript
function foo(x: string | null) {
  if (x !&#x3D;&#x3D; null) {
    &#x2F;&#x2F; x is string in here
  }
}

&#x60;&#x60;&#x60;

(There&#39;s an &#x60;assumeTrue&#x60; flag that toggles behavior based on &#x60;&#x3D;&#x3D;&#x3D;&#x60; vs. &#x60;!&#x3D;&#x3D;&#x60;.)

&#x60;narrowTypeByEquality&#x60; is more subtle than you might expect! Take a look at this code:

&#x60;&#x60;&#x60;typescript
function foo(x: string | number, y: number | Date) {
  if (x &#x3D;&#x3D;&#x3D; y) {
    &#x2F;&#x2F; x is number
    &#x2F;&#x2F; y is number
  }
}

&#x60;&#x60;&#x60;

If two values are equal to one another, then their type must be the intersection of their declared types. Very clever, TypeScript!

What about branching constructs? TypeScript traverses up through both branches and unions the result. This should give you a sense for why determining flow types can be expensive! (The code for this is in &#x60;getTypeAtFlowBranchLabel&#x60;.)

## [](#Conclusion &quot;Conclusion&quot;)Conclusion

Hopefully this post has clarified what flow nodes are and how type narrowing is implemented in the TypeScript compiler. While this isn&#39;t important to understand for TypeScript users, I&#39;m still amazed that, after having used TypeScript for eight years, it turned out to work completely backwards from how I thought!

[ ![Effective TypeScript Book Cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sRDtcBqaHyXyjrt3257naLcuWmnNQ4qa1UyO_nDM-TAQ&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;cover.jpg) ](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6)

**_Effective TypeScript_** shows you not just _how_ to use TypeScript but how to use it _well_. The book&#39;s 62 items help you build mental models of how TypeScript and its ecosystem work, make you aware of pitfalls and traps to avoid, and guide you toward using TypeScript’s many capabilities in the most effective ways possible. Regardless of your level of TypeScript experience, you can learn something from this book.

After reading _Effective TypeScript_, your relationship with the type system will be the most productive it&#39;s ever been! [Learn more »](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;)