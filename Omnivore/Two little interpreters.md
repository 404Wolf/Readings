---
id: b5b553e2-eb8c-11ee-9ab4-ffc1f4aed1d9
title: Two little interpreters
tags:
  - RSS
date_published: 2024-03-26 00:00:00
---

# Two little interpreters
#Omnivore

[Read on Omnivore](https://omnivore.app/me/two-little-interpreters-18e7b8fd1e6)
[Read Original](https://dubroy.com/blog/two-little-interpreters/)



Late last year, I read a few blog posts that said something like “everyone knows that bytecode interpreters are faster than tree-walking interpreters”. And then I saw the paper [AST vs. Bytecode: Interpreters in the Age of Meta-Compilation”](https:&#x2F;&#x2F;stefan-marr.de&#x2F;downloads&#x2F;oopsla23-larose-et-al-ast-vs-bytecode-interpreters-in-the-age-of-meta-compilation.pdf) when Stefan Marr [shared a draft on Twitter](https:&#x2F;&#x2F;twitter.com&#x2F;smarr&#x2F;status&#x2F;1691036663764430848).

I realized that although I’d written a number of tree-walking interpreters, I’d never actually built a bytecode interpreter before. So, I thought it would be a fun exercise to build two small interpreters in the same language and compare the performance.

The result is [Pegboard: Two little interpreters](https:&#x2F;&#x2F;github.com&#x2F;pdubroy&#x2F;pegboard). It’s around 600 lines of TypeScript code: \~180 for the tree-walking interpreter, \~370 for the bytecode interpreter, and a bit of shared code.

I won’t bury the lede: the bytecode interpreter is not faster! In fact, the tree-walking interpreter is about 2–3x faster on my benchmarks. Read on for more details.

## The language: parsing expression grammars

Maybe surprising: the “language” I chose to implement isn’t a general-purpose purpose programming language. Instead, I wrote interpreters for [parsing expression grammars](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Parsing%5Fexpression%5Fgrammar), aka PEGs. The language of PEGs is almost like simple a programming language — but one whose expressions implicitly operate on some hidden data structures.

It even has something like function calls: rule applications. For example, in the grammar snippet below[1](#fn:1), there are two rules defined: &#x60;hexDigit&#x60; and &#x60;hexIntegerLiteral&#x60;.

&#x60;&#x60;&#x60;jboss-cli
  hexDigit &#x3D; &quot;0&quot;..&quot;9&quot; | &quot;a&quot;..&quot;f&quot; | &quot;A&quot;..&quot;F&quot;

  hexIntegerLiteral &#x3D; &quot;0x&quot; hexDigit+
                    | &quot;0X&quot; hexDigit+
&#x60;&#x60;&#x60;

The &#x60;hexDigit&#x60; rule is defined on line 1, and used (or _applied_) on lines 3 and 4, in the body of &#x60;hexIntegeralLiteral&#x60;.

Rule applications can be arbitrarily deep, and — like function calls — mutually recursive. So an interpreter for PEGs needs to maintain a rule application stack, which is very much like a call stack.

One more detail: for simplicity, I’m not using a custom syntax (like the one above) to specify the grammars. Instead, I use [parser combinators](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Parser%5Fcombinator). So the rules above are actually defined like this:

&#x60;&#x60;&#x60;clojure
{
  &#x2F;&#x2F; ...
  hexDigit: choice(range(&quot;0&quot;, &quot;9&quot;), range(&quot;a&quot;, &quot;f&quot;), range(&quot;A&quot;, &quot;F&quot;)),
  hexIntegerLiteral: choice(
    seq(_(&quot;0x&quot;), seq(app(&quot;hexDigit&quot;), rep(app(&quot;hexDigit&quot;)))),
    seq(_(&quot;0X&quot;), seq(app(&quot;hexDigit&quot;), rep(app(&quot;hexDigit&quot;)))),
  ),
  &#x2F;&#x2F; ...
};
&#x60;&#x60;&#x60;

## Wait, what?

Okay, I realize this could all be kind of confusing, since we don’t usually talk about interpreting grammars. Here’s another explanation:

1. You can think of a parsing expression grammar as a program, in a very limited programming language, that describes a parser.
2. You could compile that program to another language. Tools that do this are known as _parser generators_.
3. You can also interpret that program. That involves matching the grammar against a particular input string.
4. Compilers and interpreters typically convert a program from a source language to an abstract syntax tree (AST). With parser combinators, you skip that step and construct the AST directly.

## Performance

To measure the performance of my two interpreters, I ported the [ES5 grammar from Ohm](https:&#x2F;&#x2F;ohmjs.org&#x2F;editor&#x2F;#0a9a649c3c630fd0a470ba6cb75393fe) to the parser combinator style. This allowed me to use some real-world examples: using each interpreter to parse the source code for jQuery, React, and Underscore.

My bytecode interpreter turned out to be slower!

As you can see, the tree-walking interpreter (or, “AST interp” here) is a bit more than 2x faster on V8, and more than 3x faster on JSC. Though I wouldn’t suggest drawing any big conclusions from these numbers.

If you’re interested, you can check out [the benchmark source on GitHub](https:&#x2F;&#x2F;github.com&#x2F;pdubroy&#x2F;pegboard&#x2F;blob&#x2F;main&#x2F;scripts&#x2F;bench.ts).

### Node (V8)

&#x60;&#x60;&#x60;http
cpu: Apple M1
runtime: node v21.2.0 (arm64-darwin)

summary for jquery
  AST interp
   2.86x faster than bytecode interp (switch)

summary for react
  AST interp
   2.24x faster than bytecode interp (switch)

summary for underscore
  AST interp
   2.04x faster than bytecode interp (switch)
&#x60;&#x60;&#x60;

### Bun (JSC)

&#x60;&#x60;&#x60;http
cpu: Apple M1
runtime: bun 1.0.26 (arm64-darwin)

summary for jquery
  AST interp
   3.69x faster than bytecode interp (switch)

summary for react
  AST interp
   3.2x faster than bytecode interp (switch)

summary for underscore
  AST interp
   3.17x faster than bytecode interp (switch)
&#x60;&#x60;&#x60;

Again, I wouldn’t suggest drawing any big conclusions from this experiment. My main motivation was to get some experience building a traditional, switch-style bytecode interpreter. The fact that it turned out to be so much slower was an interesting surprise!

Some caveats:

* There’s a big difference between interpreting a PEG, and interpreting a real programming language. And even though it’s a good real-world use case, the “program” here (the ES5 grammar) is less than 500 lines of code.
* I didn’t spend much time trying to optimize the performance of either interpreter. I did use [Deopt Explorer](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;deoptexplorer-vscode) to fix some obvious performance problems, but didn’t go much deeper than that. It would be interesting to dig into _why_ the bytecode interpreter is slower — but that’s a project for another day.

You can find the [full source of both interpreters on GitHub](https:&#x2F;&#x2F;github.com&#x2F;pdubroy&#x2F;pegboard&#x2F;). If you have any suggestions for improvements, or notice anything major that I’ve missed, please let me know!

_Thanks to David Albert for pairing with me to finish up the bytecode interpreter, and to Kevin Lynagh for proofreading this post._

---

1. The example is taken from [Ohm](https:&#x2F;&#x2F;ohmjs.org&#x2F;), the PEG-based parsing toolkit that I co-authored and maintain. Specifically, it’s from the [ES5 grammar](https:&#x2F;&#x2F;github.com&#x2F;ohmjs&#x2F;ohm&#x2F;blob&#x2F;main&#x2F;examples&#x2F;ecmascript&#x2F;src&#x2F;es5.ohm). [↩](#fnref:1 &quot;Jump back to footnote 1 in the text&quot;)