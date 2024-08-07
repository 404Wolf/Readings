---
id: 690e4b18-fc2e-11ee-8a7a-8b4060c00d69
title: "The Making of a TypeScript Feature: Inferring Type Predicates"
tags:
  - RSS
date_published: 2024-04-16 14:00:25
---

# The Making of a TypeScript Feature: Inferring Type Predicates
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-making-of-a-type-script-feature-inferring-type-predicates-18ee88f109a)
[Read Original](https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/)



Over the past few months I became a TypeScript contributor and implemented a new feature, [type predicate inference](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465), that should be one of the headliners for TypeScript 5.5\. This post tells the story of how that happened: why I wanted to contribute to TypeScript, the journey to implementing the feature and getting the PR merged, and what I&#39;ve learned along the way.

This is not a short read, but it will give you a good sense of what it&#39;s like to become a TypeScript contributor and develop a new feature.

## [](#What-is-Type-Predicate-Inference &quot;What is Type Predicate Inference?&quot;)What is Type Predicate Inference?

Before we dive into the backstory, let&#39;s take a quick look at the feature I added. If you write code like this:

&#x60;&#x60;&#x60;actionscript
function isNumber(data: unknown) {
  return typeof data &#x3D;&#x3D;&#x3D; &#39;number&#39;;
}

&#x60;&#x60;&#x60;

TypeScript will now infer that the function is a [type predicate](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;2&#x2F;narrowing.html#using-type-predicates):

![TypeScript inferring a type predicate](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sRs0a5kQv64a1vJvOAgywqlrt_50QMrGSd1EkOZpOA68&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;inferred-predicate.png)

Previously, TypeScript would have inferred a &#x60;boolean&#x60; return type. This also works for arrow functions, which means code that filters arrays becomes much more ergonomic:

&#x60;&#x60;&#x60;angelscript
const nums &#x3D; [1, 2, null, 3, 4].filter(x &#x3D;&gt; x !&#x3D;&#x3D; null);
&#x2F;&#x2F;    ^? const nums: number[]
console.log(nums[0].toFixed()); &#x2F;&#x2F; ok

&#x60;&#x60;&#x60;

Previously, this type would have been &#x60;(number | null)[]&#x60; and the last line would have been a type error.

## [](#Why-contribute-to-TypeScript &quot;Why contribute to TypeScript?&quot;)Why contribute to TypeScript?

![Soviet-style propaganda poster encouraging you to contribute to TypeScript](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;256x256,soHtZauljTIv0xw9E6bv6mccZGC_M2hUNdQL7JD0bUNw&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;soviet-contribute.png)

I&#39;ve been using TypeScript since 2016\. I&#39;ve been [writing about it](https:&#x2F;&#x2F;danvdk.medium.com&#x2F;a-typed-pluck-exploring-typescript-2-1s-mapped-types-c15f72bf4ca8) [almost as long](https:&#x2F;&#x2F;danvdk.medium.com&#x2F;a-typed-chain-exploring-the-limits-of-typescript-b50153be53d8). But I&#39;d never contributed code to it. This felt like a gap in my understanding of TypeScript and its ecosystem. Like most TS users, I have a [long list](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2022&#x2F;12&#x2F;25&#x2F;christmas&#x2F;) of features I&#39;d like to see added to the language, and I thought learning about compiler internals would help me understand which of those features were feasible and which weren&#39;t.

At the start of this year, I signed up for a 12-week batch at [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;), a &quot;writer&#39;s retreat for programmers.&quot; You apply with a project in mind, and mine was to contribute to TypeScript. RC provided an encouraging structure and the space for me to make this leap.

## [](#Hopes-and-Fears &quot;Hopes and Fears&quot;)Hopes and Fears

I hoped that I&#39;d build a stronger intuition for how TypeScript works internally and maybe have some insights along the way. If I was lucky, maybe I&#39;d be able to say I was a TypeScript contributor and make some improvements to the language.

My biggest fear was that I&#39;d put a lot of work into a PR only to see it stall. There are some [notorious examples](ttps:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;38839#issuecomment-1160929515) of this, most famously the [cake-driven development incident](https:&#x2F;&#x2F;twitter.com&#x2F;JoshuaKGoldberg&#x2F;status&#x2F;1481654056422567944?lang&#x3D;en). I knew the real goal was to learn more about TypeScript. But I did hope to get a change accepted.

## [](#Finding-a-first-issue &quot;Finding a first issue&quot;)Finding a first issue

_Mid- to Late-January 2024_

Before trying to implement something substantial, I thought I&#39;d start by fixing a trivial bug. This would help me get familiar with the compiler and the development process. This is exactly how the TypeScript docs suggest you get started as a contributor.

Finding a &quot;good first issue&quot; proved harder than I&#39;d expected. Most of the small, newly-filed issues get fixed quickly by one or two experienced community members. From a community perspective, this is great: if you file a bug and it&#39;s accepted, it&#39;s likely to get fixed. But for a new contributor this isn&#39;t good: I was unlikely to win any races to fix an issue.

There&#39;s a [good first issue](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;labels&#x2F;Good%20First%20Issue) label, but this proved to be a bit of a joke. My [favorite issue](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;29707) in this category was discussed by three of the top contributors to TypeScript, who decided it was impossible or not worth doing. But it&#39;s still got that &quot;good first issue&quot; label!

Eventually I found [#53182](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;53182), which involved numeric separators (&#x60;1_234&#x60;) not getting preserved in JS emit. This seemed low stakes and, as an added bonus, I&#39;m a fan of the [developer](https:&#x2F;&#x2F;macwright.com&#x2F;) who filed it.

The [fix](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57144) was a one-liner, just like you&#39;d expect, but I learned a lot about how TypeScript works along the way. TypeScript&#39;s code structure defies many best practices. All the code for type checking is in a single file, &#x60;checker.ts&#x60;, that&#39;s over 50,000 lines of code. And these are meaty lines since there&#39;s no set line width and relatively few comments. It also makes extensive use of numeric enums, a feature I discourage in [Effective TypeScript](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6).

That being said, there are some impressive parts of the tooling. Visual debugging (F5) works great in VS Code and is an excellent way to learn what the compiler is doing. There are relatively few unit tests, but there&#39;s an enormous collection of &quot;baselines,&quot; a sort of end-to-end test that snapshots the types and errors for a code sample. There are over 18,000 of these, but TypeScript is able to run all of them on my laptop in just a few minutes.

After a few weeks, my PR was merged and released as part of TypeScript 5.4\. I was officially a TypeScript contributor!

## [](#A-meatier-second-issue &quot;A meatier second issue&quot;)A meatier second issue

Fixing a small bug was a good start, but my bigger goal was to implement a new feature. Of all the issues I&#39;d filed on TypeScript, [#16069](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;16069) stood out with over 500 👍s. This issue requested that TypeScript infer [type predicates](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;advanced-types.html#user-defined-type-guards) for functions like &#x60;x &#x3D;&gt; x !&#x3D;&#x3D; null&#x60;. Clearly I wasn&#39;t the only one who wanted this!

I also had reason to think that this issue might be solvable. In [TypeScript 4.4](https:&#x2F;&#x2F;devblogs.microsoft.com&#x2F;typescript&#x2F;announcing-typescript-4-4&#x2F;) (2021), Anders added support for [aliased conditions and discriminants](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;release-notes&#x2F;typescript-4-4.html#control-flow-analysis-of-aliased-conditions-and-discriminants). This let you write code like this:

&#x60;&#x60;&#x60;typescript
function foo(x: string | null) {
  const ok &#x3D; x !&#x3D;&#x3D; null;
  if (ok) {
    x  &#x2F;&#x2F; type is string
  }
  return ok;
}

&#x60;&#x60;&#x60;

Surely the &#x60;ok&#x60; symbol had to have information stored on it saying that its value was tied to a refinement on &#x60;x&#x60;. If I looked at Anders&#39; PR, I&#39;d find where this was stored. This felt at least adjacent to my issue. And it was a good story: the feature only became feasible after another seemingly-unrelated feature was added. There were even [some comments](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;16069#issuecomment-893914922) suggesting as much.

As it turned out, this was totally wrong! Nothing was stored on the &#x60;ok&#x60; symbol and I totally misunderstood how type inference worked. This was a big insight for me, and I wrote about it in my last blog post, [Flow Nodes: How Type Inference Is Implemented](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;03&#x2F;24&#x2F;flownodes&#x2F;). Head over there to learn all about this epiphany.

As part of my efforts to understand how control-flow analysis worked, I wrote some code to visualize TypeScript&#39;s control flow graph. I [contributed this](https:&#x2F;&#x2F;twitter.com&#x2F;danvdk&#x2F;status&#x2F;1762868150800977996) as a new feature to the [TS AST Viewer](https:&#x2F;&#x2F;ts-ast-viewer.com&#x2F;). This was a nice, concrete win: even if my work on type predicate inference went nowhere, at least I&#39;d contributed something of value to the ecosystem.

## [](#quot-OK-maybe-this-isn’t-hopeless…-quot &quot;&quot;OK, maybe this isn’t hopeless…&quot;&quot;)&quot;OK, maybe this isn’t hopeless…&quot;

_Week of February 2, 2024_

Having built a stronger understanding of how type inference worked, I came back to the original problem. Did this make implementing my feature easier or harder?

Whenever I explained this feature, I&#39;d demo how you could put the return expression in an &#x60;if&#x60; statement to see the narrowed type of the parameter:

&#x60;&#x60;&#x60;typescript
function isNonNull(x: number | null) {
  return x !&#x3D;&#x3D; null;
}
&#x2F;&#x2F; -&gt;

function isNonNullRewrite(x: number | null) {
  if (x !&#x3D;&#x3D; null) {
    x  &#x2F;&#x2F; type is number
  }
}

&#x60;&#x60;&#x60;

The key insight was to realize that I could do the exact same thing with the control flow graph. I&#39;d just have to synthesize a &#x60;FlowCondition&#x60; node, plug it into wherever the &#x60;return&#x60; statement was, and check the type of the parameter in that branch if the condition was &#x60;true&#x60;. If it was different than the declared type, then I had a type predicate!

I could check the type of a parameter at a location using the &#x60;getFlowTypeOfReference&#x60; function. But where to put this check? This was also a challenge, but eventually I found a place in &#x60;getTypePredicateOfSignature&#x60; to slot it in. I added a new function, &#x60;getTypePredicateFromBody&#x60;, that this would call for boolean-returning functions.

This was all a bit of a struggle since it was my first time really working with the type checker. Even simple things felt quite hard. What&#39;s the difference between a &#x60;Declaration&#x60;, a &#x60;Symbol&#x60; and an &#x60;Identifier&#x60;? How should I go from one to the other? Often I found a [very roundabout way](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;TypeScript&#x2F;commit&#x2F;a6a34c1523f3e70cda676cd75879ce53b6bcff51) that let me keep making progress before I later found a more canonical path. For example, if &#x60;param&#x60; is a &#x60;ParameterDeclaration&#x60;, then you can use &#x60;param.name&#x60; to get a &#x60;BindingName&#x60;, and &#x60;isIdentifier(param.name)&#x60; to make sure it&#39;s an &#x60;Identifier&#x60;.

Running the tests was easy, but it took me a bit longer to realize how to test them in an interactive setting. So far as I can tell, building your own version of the TypeScript Playground isn&#39;t possible. But if you run &#x60;hereby local&#x60;, it will build &#x60;tsc.js&#x60;, and you can point any VS Code workspace at that version of TypeScript. You can even do this for the TypeScript repo itself.

While learning my way around the codebase, I found it incredibly helpful to take notes. Which function did what? What questions did I have? What was I struggling with? What did I have left to do? This helped to keep me oriented and also gave me a sense of progress. In particular, it was satisfying to read questions I&#39;d had weeks earlier that I now knew the answer to. Clearly I was learning! By the time my PR was merged, my Notion doc ran to 70+ pages of notes.

Eventually I was able to fit all the pieces together, though, and this let me infer type predicates for the first time, which was hugely encouraging!

## [](#43-failures &quot;43 failures&quot;)43 failures

_Week of February 9, 2024_

This let me run the 18,000+ TypeScript &quot;baselines.&quot; This was an exciting moment: the first time I&#39;d see how my inference algorithm behaved on unfamiliar code! My initial implementation produced 43 test failures. I went through and categorized these:

* 32 were &quot;Maximum call stack size exceeded&quot; errors
* 5 were the identify function on booleans
* 1 involved my mishandling a function with multiple returns
* The other 5 were wins!

This change was pretty funny:

&#x60;&#x60;&#x60;ada
&#x2F;&#x2F; function identity(b: boolean): b is true
function identity(b: boolean) {
  return b;
}

&#x60;&#x60;&#x60;

The identity function on booleans _is_ a type predicate! But that didn&#39;t seem very useful. I added a special case to skip boolean parameters.

The maximum call stack errors turned out to be an infinite loop. I added some code to block this. Then I changed my code to only run on functions with a single &#x60;return&#x60; statement. This left me with just the wins.

One of these wins got me particularly excited:

&#x60;&#x60;&#x60;ada
declare function guard1(x: string|number): x is string;
function guard2(x: string | number) {
  return guard1(x);
}

&#x60;&#x60;&#x60;

I was inferring that &#x60;guard2&#x60; was a type guard because &#x60;guard1&#x60; was. This meant that type predicates could flow! There was another [long-standing issue](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;10734) requesting just this behavior. Anders has said that you never want to fix just a single issue, you always want to fix a whole category of problems. This was an encouraging sign that I was doing just that. I hadn&#39;t set out to make type predicates flow, it just followed naturally from my change and TypeScript&#39;s control flow analysis.

## [](#More-Predicates-in-More-Places &quot;More Predicates in More Places&quot;)More Predicates in More Places

_Week of February 16, 2024_

To keep things simple, I&#39;d only been considering function statements, not function expressions or arrow functions. Now that I&#39;d validated the basic approach, I wanted to support these, too.

Standalone function expressions and arrow functions weren&#39;t difficult to add, but I had a lot of trouble with functions whose parameter types are determined by context. For example:

&#x60;&#x60;&#x60;angelscript
const xs &#x3D; [1, 2, 3, null];
const nums &#x3D; xs.filter(x &#x3D;&gt; x !&#x3D;&#x3D; null);

&#x60;&#x60;&#x60;

The type of &#x60;x&#x60; is &#x60;number | null&#x60;, but TypeScript only determines this from a complex sequence of type inferences. I kept getting &#x60;any&#x60; types.

This problem didn&#39;t turn out to be deep. It just required finding the right function to call. &#x60;getTypeForVariableLikeDeclaration&#x60; did not work, but eventually I discovered &#x60;getNarrowedTypeOfSymbol&#x60;, which did. For the final PR I switched over to &#x60;getSymbolLinks&#x60;.

This was another really exciting moment! My commit message nicely captures my feelings:

![commit message reading OMG IT WORKS](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sTGGv_tJeluORqeS3RdIXMor-ya5Hs2WPMhNYIDNE8kc&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;omg-it-works.png)

Nearly seven years after I&#39;d filed the [original issue](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;16069), I was able to make it pass the type checker:

![code sample passing type checker.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,ssKwwOiqS052D_MRyQeQsfTlRYnwTnFILAHd8PBej4So&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;even-squares.png)

Success would be fleeting for this code sample, though, as I was about to find out.

## [](#Pathological-Cases-and-an-Insight &quot;Pathological Cases and an Insight&quot;)Pathological Cases and an Insight

As I was developing the feature, I started collecting a set of &quot;pathological&quot; functions, ones that I thought might trip up my algorithm. The goal here is to think of everything that could possibly go wrong. That&#39;s impossible, of course, but the more bugs you work out on your own, the better.

This one turned out to be particularly interesting:

&#x60;&#x60;&#x60;reasonml
function flakyIsString(x: string | null) {
  return typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5;
}

&#x60;&#x60;&#x60;

Should this be a type predicate? If it returns &#x60;true&#x60;, then you know that &#x60;x&#x60; is a &#x60;string&#x60;. But what if it returns &#x60;false&#x60;? In that case, &#x60;x&#x60; could be either &#x60;string&#x60; or &#x60;null&#x60;.

TypeScript infers correct types on both sides if we rewrite this as an &#x60;if&#x60; statement:

&#x60;&#x60;&#x60;gml
function flakyIsStringRewrite(x: string | null) {
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5) {
    x; &#x2F;&#x2F; type is string
  } else {
    x; &#x2F;&#x2F; type is string | null
  }
}

&#x60;&#x60;&#x60;

But if you make this a type predicate, that nuance is lost:

&#x60;&#x60;&#x60;reasonml
function flakyIsString(x: string | null): x is string {
  return typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5;
}
declare let sOrN: string | null;
if (flakyIsString(sOrN)) {
  sOrN  &#x2F;&#x2F; type is string
} else {
  sOrN  &#x2F;&#x2F; type is null 😱
}

&#x60;&#x60;&#x60;

In other words, &#x60;flakyIsString&#x60; should _not_ be a type predicate. This forced me to reformulate my criterion for inferring type predicates to consider the &#x60;false&#x60; case. If you rewrite a function that returns &#x60;expr&#x60; like this:

&#x60;&#x60;&#x60;actionscript
function foo(x: InitType) {
  if (expr) {
    x  &#x2F;&#x2F; TrueType
  } else {
    x  &#x2F;&#x2F; FalseType
  }
}

&#x60;&#x60;&#x60;

Then I required that &#x60;FalseType &#x3D; Exclude&lt;InitType, TrueType&gt;&#x60;. This was the criterion I used when I first posted the PR, but it turned out to be subtly incorrect.

I hadn&#39;t realized that type predicates had these &quot;if and only if&quot; semantics before working on this PR. This was a genuine insight, and I wrote about in another post on this blog: [The Hidden Side of Type Predicates](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;02&#x2F;27&#x2F;type-guards&#x2F;).

## [](#Plot-Twist-Truthiness-and-Nullishness &quot;Plot Twist: Truthiness and Nullishness&quot;)Plot Twist: Truthiness and Nullishness

Here&#39;s the example code from the original feature request in 2017:

&#x60;&#x60;&#x60;angelscript
const evenSquares: number[] &#x3D;
    [1, 2, 3, 4]
        .map(x &#x3D;&gt; x % 2 &#x3D;&#x3D;&#x3D; 0 ? x * x : null)
        .filter(x &#x3D;&gt; !!x);  &#x2F;&#x2F; errors, but should not

&#x60;&#x60;&#x60;

With my new criterion came a real [plot twist](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1959570195): I stopped inferring a type guard in this case! The reason is that &quot;truthiness&quot; doesn&#39;t cleanly separate &#x60;number|null&#x60;:

&#x60;&#x60;&#x60;gauss
declare let x: number | null;
if (!!x) {
  x;  &#x2F;&#x2F; number
} else {
  x;  &#x2F;&#x2F; number | null
}

&#x60;&#x60;&#x60;

&#x60;number&#x60; is possible in the &#x60;else&#x60; case because &#x60;0&#x60; is falsy. (A type of &#x60;0|null&#x60; [would be more precise](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;45329)).

I saw this as a mixed bag. While it meant that I didn&#39;t truly &quot;fix&quot; the original issue, I also think it&#39;s a good behavior. Checking for &quot;truthiness&quot; is usually a bad idea with primitive types. You typically want to exclude just &#x60;null&#x60; or &#x60;undefined&#x60;, not &#x60;0&#x60; or &#x60;&quot;&quot;&#x60;. Filtering out &#x60;0&#x60; when you mean to filter out &#x60;null&#x60; is a common source of bugs.

To infer a type predicate for &#x60;x &#x3D;&gt; !!x&#x60;, TypeScript would either need [negated types](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;4196) (so that you could represent &quot;numbers other than 0&quot;) or [one-sided type predicates](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;15048). Both are beyond the scope of my PR.

My change _will_ infer a type predicate from &#x60;x &#x3D;&gt; !!x&#x60; for object types, where there&#39;s no ambiguity.

## [](#Putting-up-the-PR &quot;Putting up the PR&quot;)Putting up the PR

_February 20–21, 2024_

I showed my PR to [Josh Goldberg](https:&#x2F;&#x2F;www.joshuakgoldberg.com&#x2F;) around this time. I was a bit nervous to post the PR—I&#39;d put a lot of work into it at this point!—but he was excited and gave me the pep talk that I needed. So I wrote up a detailed PR description and [posted](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465) my code the next day.

There was a _lot_ of excitement! It was fun and encouraging to see all the positive feedback on Twitter. In particular Brad Zacher [introduced](https:&#x2F;&#x2F;twitter.com&#x2F;bradzacher&#x2F;status&#x2F;1760414631548653729) me to [%checks](https:&#x2F;&#x2F;flow.org&#x2F;en&#x2F;docs&#x2F;types&#x2F;functions&#x2F;#predicate-functions), which was a similar feature in Flow. His experience using this [proved helpful later](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57552#issuecomment-1965983413) in keeping the scope of my PR large.

I&#39;d run all the TypeScript unit tests on my laptop, so I knew that those passed. But there was a new test that failed in a really interesting way…

## [](#A-Scary-Self-Check-Error &quot;A Scary Self-Check Error&quot;)A Scary Self-Check Error

TypeScript is written in… TypeScript! This is a bit of a headscratcher at first, but it&#39;s actually a common practice in programming languages known as [bootstrapping](https:&#x2F;&#x2F;stackoverflow.com&#x2F;questions&#x2F;1254542&#x2F;what-is-bootstrapping). As such, it&#39;s important that TypeScript be able to compile itself with every change.

My PR was unable to compile TypeScript, and for a very interesting reason. It boiled down to whether this function should be a type predicate:

&#x60;&#x60;&#x60;javascript
function flakyIsStringUnknown(x: unknown) {
  return typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5;
}

&#x60;&#x60;&#x60;

This is the same as &#x60;flakyIsString&#x60;, but with a broader parameter type. We can convert this to an &#x60;if&#x60; statement as usual:

&#x60;&#x60;&#x60;gml
function flakyIsStringUnknown(x: unknown) {
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5) {
    x  &#x2F;&#x2F; TrueType: string
  } else {
    x  &#x2F;&#x2F; FalseType: unknown
  }
}

&#x60;&#x60;&#x60;

Since &#x60;Exclude&lt;unknown, string&gt; &#x3D; unknown&#x60;, my PR inferred a type predicate for this function. And that _is_ valid if you call it with a symbol whose type is &#x60;unknown&#x60;. But there&#39;s no reason you have to do that! As with any function in TypeScript, you can call it with a subtype of the declared type. And if we infer a type predicate, that&#39;s trouble:

&#x60;&#x60;&#x60;reasonml
function flakyIsStringUnknown(x: unknown): x is string {
  return typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5;
}
declare const sOrN: string | number;
if (flakyIsStringUnknown(sOrN)) {
  sOrN  &#x2F;&#x2F; type is string
} else {
  sOrN  &#x2F;&#x2F; type is number 😱
}

&#x60;&#x60;&#x60;

The type in the &#x60;else&#x60; case is wrong. It could still be a &#x60;string&#x60;. So something was wrong with my criterion. I [feared](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1957751656) that this might be a fundamental problem with my approach.

I decided to step away from the problem and go for a walk.

## [](#Saving-the-PR-A-New-Criterion &quot;Saving the PR: A New Criterion&quot;)Saving the PR: A New Criterion

Recall that this was the criterion I was using:

&#x60;&#x60;&#x60;ini
FalseType &#x3D; Exclude&lt;InitType, TrueType&gt;

&#x60;&#x60;&#x60;

&#x60;InitType&#x60; is the declared parameter type. Really I needed that relationship to hold not just for &#x60;InitType&#x60; but _for all subtypes_ of &#x60;InitType&#x60;. But how on earth to test that?

Intuitively, it seemed to me like there was just one subtype of &#x60;InitType&#x60; that was worth testing: &#x60;TrueType&#x60;. If I set &#x60;InitType&#x3D;TrueType&#x60;, I could run the same inference algorithm again to get &#x60;TrueSubType&#x60; and &#x60;FalseSubType&#x60;. Then I could check a secondary criterion:

&#x60;&#x60;&#x60;ini
FalseSubType &#x3D; Exclude&lt;TrueType, TrueSubtype&gt;

&#x60;&#x60;&#x60;

Here&#39;s what this would look like for &#x60;flakyIsStringUnknown&#x60;:

&#x60;&#x60;&#x60;gml
function flakyIsStringUnknown(x: unknown) {  &#x2F;&#x2F; InitType: unknown
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5) {
    x  &#x2F;&#x2F; TrueType: string
  } else {
    x  &#x2F;&#x2F; FalseType: unknown
  }
}
&#x2F;&#x2F; ✅ unknown &#x3D; Exclude&lt;unknown, string&gt;
function flakyIsStringUnknownSub(x: string) {  &#x2F;&#x2F; TrueType: string
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39; &amp;&amp; Math.random() &gt; 0.5) {
    x  &#x2F;&#x2F; TrueSubType: string
  } else {
    x  &#x2F;&#x2F; FalseSubType: string
  }
}
&#x2F;&#x2F; ❌ string !&#x3D; Exclude&lt;string, string&gt;

&#x60;&#x60;&#x60;

This seemed to work, at the expense of making four calls to &#x60;getFlowTypeOfReference&#x60; rather than two. But correctness first, performance second. The PR was working again!

## [](#A-Surprising-Circularity-Error &quot;A Surprising Circularity Error&quot;)A Surprising Circularity Error

With the tests passing, I got my first glimpse of the performance impact of my changes, as well as the new errors on TypeScript&#39;s broader test suite of popular repos.

The performance wasn&#39;t great: +5% on one of their standard benchmarks.

There were [six failures](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1960271216). Four were sensible consequences of my change. [This one](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1960328566) from VS Code was particularly interesting:

&#x60;&#x60;&#x60;javascript
const responseItems &#x3D; items.filter(i &#x3D;&gt; isResponseVM(i));

&#x60;&#x60;&#x60;

&#x60;isResponseVM&#x60; is a type guard. The author of this code wrapped it in an arrow function to avoid applying it as a refinement to the &#x60;items&#x60; array. But with my PR TypeScript wasn&#39;t so easily fooled! The type guard flowed through and the type of &#x60;responseItems&#x60; changed.

The only really problematic failure came from [Prisma](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1961723998). This was a new &quot;circular reference&quot; error. I spent quite a while setting up a [minimal reproduction](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;blob&#x2F;main&#x2F;tests&#x2F;cases&#x2F;compiler&#x2F;circularConstructorWithReturn.ts) of this before I realized what was going on: my code was running on constructor functions!

But not just any constructor function. Only constructor functions with exactly one &#x60;return&#x60; statement. Did you know that a constructor function in JS could have a &#x60;return&#x60; statement? I didn&#39;t. [It&#39;s allowed](https:&#x2F;&#x2F;www.mgaudet.ca&#x2F;technical&#x2F;2020&#x2F;7&#x2F;24&#x2F;investigating-the-return-behaviour-of-js-constructors), but exceedingly rare. Regardless, constructors can&#39;t be type predicates, so I excluded them and this fixed the test.

One insight here is that lots of valid TypeScript code is teetering on the edge of triggering a circularity error. Just by checking a type in a different sequence in &#x60;checker.ts&#x60;, you might cause enough of a change to tip some over.

## [](#Performance-and-the-Final-Criterion &quot;Performance and the Final Criterion&quot;)Performance and the Final Criterion

With the changes in the test suite well-characterized, I started to think about performance. Were those four calls to &#x60;getFlowTypeOfReference&#x60; all necessary? The &#x60;TrueSubtype&#x60; was irrelevant. It should just be the same as &#x60;TrueType&#x60;. Maybe I could also ditch &#x60;FalseType&#x60; and go directly to the &#x60;FalseSubtype&#x60; test.

Moreover, if &#x60;TrueType &#x3D;&#x3D; TrueSubtype&#x60;, and

&#x60;&#x60;&#x60;ini
FalseSubType &#x3D; Exclude&lt;TrueType, TrueSubtype&gt;

&#x60;&#x60;&#x60;

then really what I need to test is &#x60;FalseSubtype &#x3D;&#x3D; never&#x60;. This was a nice win because it got me back to two calls to &#x60;getFlowTypeOfReference&#x60; _and_ let me drop potentially-expensive &#x60;Exclude&#x60; calculations.

This wound up being the [final version of the criterion](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1964355842). Let&#39;s walk through how it works for this function:

&#x60;&#x60;&#x60;actionscript
function isStringFromUnknown(x: unknown) {
  return typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39;;
}

&#x60;&#x60;&#x60;

First we rewrite this to an &#x60;if&#x60; statement to get the &#x60;TrueType&#x60;:

&#x60;&#x60;&#x60;actionscript
function isStringFromUnknown(x: unknown) {
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39;) {
    x  &#x2F;&#x2F; TrueType &#x3D; string
  }
}

&#x60;&#x60;&#x60;

Next we pass this through as the parameter type and look at the &#x60;else&#x60; case:

&#x60;&#x60;&#x60;gml
function isStringFromUnknown(x: string) {
  if (typeof x &#x3D;&#x3D;&#x3D; &#39;string&#39;) {
  } else {
    x  &#x2F;&#x2F; type is never
  }
}

&#x60;&#x60;&#x60;

If this type is &#x60;never&#x60; then we have a bulletproof type predicate. Otherwise we don&#39;t. This makes good intuitive sense: if the function returns true for every value in a type, then there should be nothing left in the &#x60;else&#x60; case, where it returns false.

With fewer calls to &#x60;getFlowTypeOfReference&#x60; and a simple &#x60;never&#x60; check, the performance hit dropped from 5% down to 1-2%.

## [](#More-performance &quot;More performance&quot;)More performance

_February 27–March 6, 2024_

At this point my PR started to get [discussed](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;57568) at the [weekly design meetings](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;57599). They were generally supportive but wanted to track down that performance hit.

This set off a flurry of optimizations. Ryan [experimented](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57552) with narrowing the scope of the PR. Anders [reordered](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57612) some of the checks. I profiled my change and [thought I found a big win](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1964355842) that didn&#39;t hold up.

An insight from profiling was that &#x60;getTypePredicateFromBody&#x60; was usually quite fast, but there were a few pathological cases where it could be very slow. This was the worst of the worst:

&#x60;&#x60;&#x60;crmsh
function hasBindableName(node: Declaration) {
    return !hasDynamicName(node) || hasLateBindableName(node);
}

&#x60;&#x60;&#x60;

Both &#x60;hasDynamicName&#x60; and &#x60;hasLateBindableName&#x60; are explicit type predicates. So should this be a type predicate? Here&#39;s how the types come out:

&#x60;&#x60;&#x60;coq
InitType &#x3D; Declaration
TrueType &#x3D; NumericLiteral | StringLiteral | NoSubstitutionTemplateLiteral | Identifier | TypeParameterDeclaration | ... 106 more ... | LateBoundBinaryExpressionDeclaration
FalseSubtype &#x3D; (PropertySignature &amp; DynamicNamedDeclarationBase) | (PropertyDeclaration &amp; DynamicNamedDeclarationBase) | ... 17 more ... | DynamicNamedBinaryExpression

&#x60;&#x60;&#x60;

That&#39;s a big union! Calculating these types, particularly the &#x60;FalseSubtype&#x60;, winds up being very expensive. This one call took 300ms on my laptop and accounted for 80% of the slowdown on one benchmark.

I tried adding a [few more optimizations](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57660) but unfortunately they didn&#39;t change the perf numbers much. So a 1-2% slowdown is where it was going to be.

A highlight here was getting a very positive [code review](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#pullrequestreview-1909849513) from Anders. This is definitely going on my resume!

![Positive Code Review from Anders Hejlsberg](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sgDPW6yVeSvB_HUPyLvomu_cKAi2d7cc8wEmwiX5Sses&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;anders-code-review.png)

## [](#A-productive-prod &quot;A productive prod&quot;)A productive prod

At this point the PR stalled for around a week. I wanted to keep things moving along, but I also didn&#39;t want to be that person posting &quot;any updates?&quot; comments. I&#39;ve been on both sides of this. Those comments are rarely helpful. Presumably everyone wants the PR to make progress, there are just other priorities.

But in this case, there was an opportunity for a more constructive nudge. I had a draft of the [second edition](https:&#x2F;&#x2F;www.amazon.com&#x2F;Effective-Typescript-Specific-Ways-Improve&#x2F;dp&#x2F;1098155068&#x2F;) of _Effective TypeScript_ due on March 15th. One of the new items was &quot;Know how to filter null values from lists.&quot; If my PR went in, that item would be completely unsalvageable, and the best course of action would be to delete it completely.

Ryan Cavanaugh was a reviewer for the book, so I asked him what he thought the odds of my PR being merged were. If they were greater than 50&#x2F;50, I should just delete the item.

Ryan said that Anders was &quot;super stoked&quot; on the PR and he thought it would go in for 5.5\. Wow! Even better, he took the hint and reassigned the PR to Anders, who immediately approved it. Amazing! Ryan said he&#39;d ping the team for a last round of reviews.

## [](#The-final-review &quot;The final review&quot;)The final review

_March 13–15, 2024_

During that final round of reviews, Wes Wigham found [two more issues](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#pullrequestreview-1935559962):

1. I needed to avoid inferring type predicates for [rest parameters](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Functions&#x2F;rest%5Fparameters) (a pathological case I&#39;d missed!)
2. I needed to make sure that inferred type predicates showed up in emitted declaration files (&#x60;.d.ts&#x60;), just like inferred return types do.

Adding &#x60;.d.ts&#x60; emit would have been a daunting change at the start of this process, but by now I was comfortable enough navigating the TypeScript codebase that it didn&#39;t prove too difficult.

The most confusing part here was that the tests all started failing on TypeScript&#39;s CI. I couldn&#39;t reproduce the failures on my laptop. This was quite frustrating until I figured out what was going on: the TypeScript CI does a &#x60;git merge main&#x60; before running your tests. There are differing opinions on whether this is a good idea, and I usually don&#39;t set up my repos to do it. But once I realized what was going on, the fix was easy: I just needed to merge the upstream changes myself.

There was one funny bug that came up here. My generated &#x60;.d.ts&#x60; files initially contained code that looked like this:

&#x60;&#x60;&#x60;1c
export declare function syntaxRequiresTrailingSemicolonOrASI(
  kind: SyntaxKind
): kind is SyntaxKind.PropertyDeclaration |
   SyntaxKind.VariableStatement |
   SyntaxKind.ExpressionStatement |
   SyntaxKind.DoStatement |
   SyntaxKind.ContinueStatement |
   SyntaxKind.BreakStatement |
   SyntaxKind.ReturnStatement |
   ... 7 more ... |
   SyntaxKind.ExportDeclaration;

&#x60;&#x60;&#x60;

That &quot;... 7 more ...&quot; isn&#39;t valid TypeScript syntax! It turns out I needed to set an emit flag to prevent truncation.

Wes requested that I do some minor refactoring and then approved the PR.

After a last round of tests, Ryan merged my PR. This was happening!

## [](#Aftermath &quot;Aftermath&quot;)Aftermath

Once my PR went in, there was [even more excitement](https:&#x2F;&#x2F;twitter.com&#x2F;GabrielVergnaud&#x2F;status&#x2F;1769392854156095565) on TypeScript Twitter. [Andarist](https:&#x2F;&#x2F;twitter.com&#x2F;AndaristRake&#x2F;status&#x2F;1768722035369181466) and [Matt Pocock](https:&#x2F;&#x2F;twitter.com&#x2F;mattpocockuk&#x2F;status&#x2F;1768809254733951424) both tweeted about it, and Matt even wrote a [blog post](https:&#x2F;&#x2F;www.totaltypescript.com&#x2F;type-predicate-inference). Jake Bailey put up a [very satisfying PR](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57830) that removed newly-superfluous type assertions from the TypeScript code base. There was one [bug filed](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;57947) about inferring type predicates for tagged unions, which Andarist [quickly fixed](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57952).

I explored a two followup changes:

1. Lots of the Twitter reaction [asked](https:&#x2F;&#x2F;twitter.com&#x2F;MiTypeScript&#x2F;status&#x2F;1768741478199697806) whether &#x60;filter(Boolean)&#x60; would work now. The answer is no, but I explored how we could make this work (for object types) and found it [harder than expected](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;50387#issuecomment-2037968462).
2. I also looked into supporting type predicate inference for [functions with multiple return statements](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;58154). This isn&#39;t a major change to the existing logic and it has minimal performance impact. But there aren&#39;t many functions like this in the wild, so it may not be worth the effort.

## [](#Conclusions &quot;Conclusions&quot;)Conclusions

Stepping back, creating this PR was a great experience that worked out far better than I had any right to expect. My goal was to get a better sense for how TypeScript worked internally, and I certainly did that! But fixing a seven year-old bug and seeing the wildly positive response was even better.

I filed this issue in 2017 when TypeScript 2.3 was the latest and greatest. I&#39;d initially been drawn to work on it because I thought that an unrelated change in TypeScript 4.4 (2021) might have made it more tractable. That change turned out to be irrelevant. All of the machinery I wound up using to infer type predicates was already in place way back in 2017\. It&#39;s just that no one had thought to put the pieces together in quite this way.

This is a great example of how bringing fresh eyes into an ecosystem can be beneficial. I don&#39;t think there are any other places where the type checker synthesizes a flow node. But I didn&#39;t know that, so I just did it. And it worked great!

TypeScript 5.5 should come out for beta testing in the next few weeks, and a final version should be out in the next few months. It&#39;s exciting to think that my experimental code from January will soon be running on every TypeScript function in the world!

[ ![Effective TypeScript Book Cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sRDtcBqaHyXyjrt3257naLcuWmnNQ4qa1UyO_nDM-TAQ&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;cover.jpg) ](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6)

**_Effective TypeScript_** shows you not just _how_ to use TypeScript but how to use it _well_. The book&#39;s 62 items help you build mental models of how TypeScript and its ecosystem work, make you aware of pitfalls and traps to avoid, and guide you toward using TypeScript’s many capabilities in the most effective ways possible. Regardless of your level of TypeScript experience, you can learn something from this book.

After reading _Effective TypeScript_, your relationship with the type system will be the most productive it&#39;s ever been! [Learn more »](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;)