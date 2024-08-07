---
id: b24b047d-1427-4559-a31e-f99cc3612d7e
title: "TypeScript 5.5: A Blockbuster Release"
tags:
  - RSS
date_published: 2024-07-02 14:05:56
---

# TypeScript 5.5: A Blockbuster Release
#Omnivore

[Read on Omnivore](https://omnivore.app/me/type-script-5-5-a-blockbuster-release-1907531e85a)
[Read Original](https://effectivetypescript.com/2024/07/02/ts-55/)



We TypeScript developers are a lucky bunch. While some languages ([Python](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;History%5Fof%5FPython), [JavaScript](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;ECMAScript%5Fversion%5Fhistory)) are released annually, every three years ([C++](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;C%2B%2B#Standardization)) or even less, we get _four_ new versions of TypeScript every year. TypeScript 5.5 was [released](https:&#x2F;&#x2F;devblogs.microsoft.com&#x2F;typescript&#x2F;announcing-typescript-5-5&#x2F;) on June 20th, 2024, and it was a real blockbuster. Let&#39;s take a look.

TypeScript&#39;s [motto](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;) is &quot;JavaScript with syntax for types.&quot; New versions of TypeScript don&#39;t add new runtime features (that&#39;s JavaScript&#39;s responsibility). Rather, they make changes within the type system. These tend to take a few forms:

1. New ways of expressing and relating types (e.g., [template literal types](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2020&#x2F;11&#x2F;05&#x2F;template-literal-types&#x2F;) in TypeScript 4.1)
2. Increased precision in type checking and inference
3. Improvements to language services (e.g., a new quick fix)
4. Support for new ECMAScript standards
5. Performance improvements.

TypeScript 5.5 doesn&#39;t introduce any new type syntax, but it does include all the other kinds of changes. The [official release notes](https:&#x2F;&#x2F;devblogs.microsoft.com&#x2F;typescript&#x2F;announcing-typescript-5-5&#x2F;) have complete explanations and examples. What follows is my quick take on each of the major changes. After that we&#39;ll look at new errors and test some of the performance wins.

## [](#New-Features &quot;New Features&quot;)New Features

### [](#Inferred-Type-Predicates &quot;Inferred Type Predicates&quot;)Inferred Type Predicates

This was my contribution to TypeScript, and I&#39;m very happy that it&#39;s made it into an official release! I&#39;ve written about it extensively on this blog before, so I won&#39;t go into too much more detail here:

* [The Making of a TypeScript Feature: Inferring Type Predicates](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;04&#x2F;16&#x2F;inferring-a-type-predicate&#x2F;)
* [Flow Nodes: How Type Inference Is Implemented](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;03&#x2F;24&#x2F;flownodes&#x2F;)
* [The Hidden Side of Type Predicates](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;02&#x2F;27&#x2F;type-guards&#x2F;)

Dimitri from [Michigan TypeScript](https:&#x2F;&#x2F;mobile.x.com&#x2F;MiTypeScript&#x2F;status&#x2F;1806674859201540568) even recorded a [video](https:&#x2F;&#x2F;youtu.be&#x2F;LTuzl2r2HjA) of me explaining the story of the feature to him and [Josh Goldberg](https:&#x2F;&#x2F;www.joshuakgoldberg.com&#x2F;).

TypeScript will infer type predicates for any function where it&#39;s appropriate, but I think this will be most useful for arrow functions, the [original motivator](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;16069) for this change:

&#x60;&#x60;&#x60;yaml
const nums &#x3D; [1, 2, 3, null];
&#x2F;&#x2F;    ^? const nums: (number | null)[]
const onlyNums &#x3D; nums.filter(n &#x3D;&gt; n !&#x3D;&#x3D; null);
&#x2F;&#x2F;    ^? const onlyNums: number[]
&#x2F;&#x2F;    Was (number | null)[] before TS 5.5!

&#x60;&#x60;&#x60;

I have two follow-on PRs to expand this feature to functions with [multiple return statements](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;58154) and to [infer assertion predicates](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;58495) (e.g., &#x60;(x: string): asserts x is string&#x60;). I think these would both be nice wins, but it&#39;s unclear whether they have a future since the pain points they address are much less common.

### [](#Control-Flow-Narrowing-for-Constant-Indexed-Accesses &quot;Control Flow Narrowing for Constant Indexed Accesses&quot;)Control Flow Narrowing for Constant Indexed Accesses

This is a nice example of improved precision in type checking. Here&#39;s the [motivating example](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;16069):

&#x60;&#x60;&#x60;less
function f1(obj: Record&lt;string, unknown&gt;, key: string) {
  if (typeof obj[key] &#x3D;&#x3D;&#x3D; &quot;string&quot;) {
    &#x2F;&#x2F; Now okay, previously was error
    obj[key].toUpperCase();
  }
}

&#x60;&#x60;&#x60;

Previously this would only work for constant property accesses like &#x60;obj.prop&#x60;. It&#39;s undeniable that this is a win in terms of precision in type checking, but I think I&#39;ll keep using the standard workaround: factoring out a variable.

&#x60;&#x60;&#x60;reasonml
function f1(obj: Record&lt;string, unknown&gt;, key: string) {
  const val &#x3D; obj[key];
  if (typeof val &#x3D;&#x3D;&#x3D; &quot;string&quot;) {
    val.toUpperCase();  &#x2F;&#x2F; this has always worked!
  }
}

&#x60;&#x60;&#x60;

This reduces duplication in the code and avoids a double lookup at runtime. It also gives you an opportunity to give the variable a meaningful name, which will make your code easier to read.

Where I _can_ see myself appreciating this is in single expression arrow functions, where you can&#39;t introduce a variable:

&#x60;&#x60;&#x60;javascript
keys.map(k &#x3D;&gt; typeof obj[k] &#x3D;&#x3D;&#x3D; &#39;string&#39; ? Number(obj[k]) : obj[k])

&#x60;&#x60;&#x60;

### [](#Regular-Expression-Syntax-Checking &quot;Regular Expression Syntax Checking&quot;)Regular Expression Syntax Checking

[Regular Expressions](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Regular%5Fexpression) may be the most common [domain-specific language](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Domain-specific%5Flanguage) in computing. Previous versions of TypeScript ignored everything inside a &#x60;&#x2F;regex&#x2F;&#x60; literal, but now they&#39;ll be checked for a few types of errors:

* syntax errors
* invalid backreferences to invalid named and numbered captures
* Using features that aren&#39;t available in your target ECMAScript version.

Regexes are [notoriously cryptic](https:&#x2F;&#x2F;stackoverflow.com&#x2F;questions&#x2F;1732348&#x2F;regex-match-open-tags-except-xhtml-self-contained-tags&#x2F;1732454#1732454) and hard to debug (this [online playground](https:&#x2F;&#x2F;regex101.com&#x2F;) is handy), so anything TypeScript can do to improve the experience of writing them is appreciated.

Since the regular expressions in existing code bases have presumably been tested, you&#39;re most likely to run into the third error when you upgrade to TS 5.5\. ES2018 added a [bunch of new regex features](https:&#x2F;&#x2F;exploringjs.com&#x2F;js&#x2F;book&#x2F;ch%5Fnew-javascript-features.html#new-in-es2018) like the &#x60;&#x2F;s&#x60; modifier. If you&#39;re using them, but don&#39;t have your target set to ES2018 or later, you&#39;ll get an error. The fix is most likely to [increase your target](https:&#x2F;&#x2F;www.learningtypescript.com&#x2F;articles&#x2F;why-increase-your-tsconfig-target). The &#x60;&#x2F;s&#x60; ([dotAll](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;RegExp&#x2F;dotAll)) flag, in particular, is [widely supported in browsers](https:&#x2F;&#x2F;caniuse.com&#x2F;?search&#x3D;dotall) and has been [available since Node.js](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;RegExp&#x2F;dotAll) since version 8 (2018). The general rule here is to create an accurate model of your environment, as described in [Item 76](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;effective-typescript&#x2F;blob&#x2F;main&#x2F;samples&#x2F;ch-write-run&#x2F;model-env.md) of [Effective TypeScript](https:&#x2F;&#x2F;amzn.to&#x2F;3UjPrsK).

Regex type checking is a welcome new frontier for TypeScript. I&#39;m intrigued by the possibility that is a small step towards accurately typing the callback form of [String.prototype.replace](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;String&#x2F;replace#specifying%5Fa%5Ffunction%5Fas%5Fa%5Fparameter), JavaScript&#39;s most [notoriously](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;String&#x2F;replace#specifying%5Fa%5Ffunction%5Fas%5Fa%5Fparameter) un-type friendly function:

&#x60;&#x60;&#x60;coffeescript
&quot;str&quot;.replace(&#x2F;foo(bar)baz&#x2F;, (match, capture) &#x3D;&gt; capture);
&#x2F;&#x2F;                                   ^?  (parameter) capture: any

&#x60;&#x60;&#x60;

### [](#Support-for-New-ECMAScript-Set-Methods &quot;Support for New ECMAScript Set Methods&quot;)Support for New ECMAScript Set Methods

When you have two sets, it&#39;s pretty natural to want to find the intersection, union and difference between them. It&#39;s always been surprising to me that JavaScript &#x60;Set&#x60;s didn&#39;t have this ability built in. [Now they do!](https:&#x2F;&#x2F;github.com&#x2F;tc39&#x2F;ecma262&#x2F;pull&#x2F;3306)

While these new methods are stage 4, they haven&#39;t been included in any official ECMAScript release yet. (They&#39;ll probably be in ES2025.) That means that, to use them in TypeScript, you&#39;ll either need to set your target or lib to ESNext. Support for these methods is at [around 80%](https:&#x2F;&#x2F;caniuse.com&#x2F;mdn-javascript%5Fbuiltins%5Fset%5Funion) in browsers at the moment, and [requires Node.js 22](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;Set&#x2F;union) on the server, so use with caution or include a polyfill.

### [](#Isolated-Declarations &quot;Isolated Declarations&quot;)Isolated Declarations

The &#x60;isolatedDeclarations&#x60; setting opens a new front in the [should you annotate your return types?](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2020&#x2F;04&#x2F;28&#x2F;avoid-inferable&#x2F;) debate. The primary motivator here is build speed for very large TypeScript projects. Adopting this feature _won&#39;t_ give you a faster build, at least not yet. But it&#39;s a foundation for more things to come. If you&#39;d like to understand this feature, I&#39;d highly recommend watching Titian&#39;s TS Congress 2023 talk: [Faster TypeScript builds with --isolatedDeclarations](https:&#x2F;&#x2F;portal.gitnation.org&#x2F;contents&#x2F;faster-typescript-builds-with-isolateddeclarations).

Should you enable this feature? Probably not, at least not yet. An exception might be if you use the [explicit-function-return-type](https:&#x2F;&#x2F;typescript-eslint.io&#x2F;rules&#x2F;explicit-function-return-type&#x2F;) rule from typescript-eslint. In that case, switching to &#x60;isolatedDeclarations&#x60; will require explicit return type annotations only for your public API, where it&#39;s a clearer win.

I expect there will be lots more development around this feature in subsequent versions of TypeScript. I&#39;ll also just note that isolatedDeclarations had a [funny merge conflict](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;58958) with inferred type predicates. All these new feature are developed independently, which makes it hard to anticipate the ways they&#39;ll interact together.

### [](#Performance-and-Size-Optimizations &quot;Performance and Size Optimizations&quot;)Performance and Size Optimizations

I [sometimes like to ask](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2023&#x2F;06&#x2F;27&#x2F;ts-51&#x2F;): would you rather have a new feature or a performance win? In this case we get both!

Inferring type predicates _does_ incur a performance hit. In some [extreme cases](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1974921974) it can be a significant one, but it&#39;s typically a [1-2% slowdown](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;57465#issuecomment-1965552516). The TypeScript team decided that this was a price they were willing to pay for the feature.

TypeScript 5.5 also includes a whole host of other performance improvements, though, so the net effect is a positive one. You get your feature and your performance, too.

[Monomorphization](https:&#x2F;&#x2F;mrale.ph&#x2F;blog&#x2F;2015&#x2F;01&#x2F;11&#x2F;whats-up-with-monomorphism.html) has been an ongoing saga in TypeScript. This is a &quot;death by a thousand cuts&quot; sort of performance problem, which is hard to diagnose because it doesn&#39;t show up clearly in profiles. Monomorphization makes all property accesses on objects faster. Because there are so many of these, the net effect can be large.

One of the things we like about objects in JavaScript and TypeScript is that they don&#39;t have to fit into neat hierarchies like in Java or C#. But monomorphization is a push towards exactly these sorts of strict hierarchies. It&#39;s interesting to see this motivated by performance, rather than design considerations. If anyone tries to [translate tsc](https:&#x2F;&#x2F;twitter.com&#x2F;danvdk&#x2F;status&#x2F;1801252274947158175) to the JVM, say, this will help.

I was particularly happy with [control flow graph simplifications](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;pull&#x2F;58013), since the PR included a screenshot of the [TS AST Viewer graph](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;03&#x2F;24&#x2F;flownodes&#x2F;) that I built!

These optimizations affect build times, the language service, and TypeScript API consumers. The TS team uses a [set of benchmarks](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;typescript-benchmarking&#x2F;) based on real projects, including TypeScript itself, to measure performance. I compared TypeScript 5.4 and 5.5 on a few of my own projects in a less scientifically rigorous way:

* Verifying the 934 code samples in the second edition of [Effective TypeScript](https:&#x2F;&#x2F;amzn.to&#x2F;3UjPrsK) using [literate-ts](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2020&#x2F;06&#x2F;30&#x2F;literate-ts&#x2F;), which uses the TypeScript API, went from 347→352s. So minimal change, or maybe a slight degradation.
* Type checking times (&#x60;tsc --noEmit&#x60;) were unaffected across all the projects I checked.
* The time to run &#x60;webpack&#x60; on a project that uses ts-loader went from \~43→42s, which is a \~2% speedup.

So no dramatic changes for my projects, but your mileage may vary. If you&#39;re seeing big improvements (or regressions), let me know! (If you&#39;re seeing regressions, you should probably file a bug against TypeScript.)

### [](#Miscellaneous &quot;Miscellaneous&quot;)Miscellaneous

* Editor and Watch-Mode Reliability Improvements: These are grungy quality of life improvements, and we should be grateful that the TypeScript team pays attention to them.
* Easier API Consumption from ECMAScript Modules: I&#39;d always wondered why you couldn&#39;t &#x60;import &quot;typescript&quot;&#x60; like other modules. Now you can!
* Simplified Reference Directive Declaration Emit: A weird, dusty corner that no longer exists. Yay!

## [](#New-Errors &quot;New Errors&quot;)New Errors

Most of my TypeScript projects had no new errors after I updated to TS 5.5\. The only exception was needing to update my target to ES2018 to get the &#x60;&#x2F;s&#x60; regular expression flag, as described above.

Both [Bloomberg](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;58587) and [Google](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;58685) have posted GitHub issues describing the new errors they ran into while upgrading to TS 5.5\. Neither of them ran into major issues.

## [](#Conclusions &quot;Conclusions&quot;)Conclusions

Every new release of TypeScript is exciting, but the combination of new forms of type inference, &#x60;isolatedDeclarations&#x60;, and potential performance wins make this a particularly good one.

It&#39;s [sometimes said](https:&#x2F;&#x2F;matklad.github.io&#x2F;2024&#x2F;03&#x2F;22&#x2F;basic-things.html#Releases) that software dependencies obey a &quot;reverse [triangle inequality](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Triangle%5Finequality):&quot; it&#39;s easier to go from v1→v2→v3 than it is to go from v1→v3 directly. The idea is that you can fix a smaller set of issues at a time. There&#39;s not much reason to hold off on adopting TypeScript 5.5\. Doing so now will make upgrading to 5.6 easier in a few months.

[ ![Effective TypeScript Book Cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sm9xE88tj5xjDBByuPXdlK1ylp7ox_Z5Dra4yK783VRc&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;cover-2e.jpg) ](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6)

**_Effective TypeScript_** shows you not just _how_ to use TypeScript but how to use it _well_. Now in its second edition, the book&#39;s 83 items help you build mental models of how TypeScript and its ecosystem work, make you aware of pitfalls and traps to avoid, and guide you toward using TypeScript’s many capabilities in the most effective ways possible. Regardless of your level of TypeScript experience, you can learn something from this book.

After reading _Effective TypeScript_, your relationship with the type system will be the most productive it&#39;s ever been! [Learn more »](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;)