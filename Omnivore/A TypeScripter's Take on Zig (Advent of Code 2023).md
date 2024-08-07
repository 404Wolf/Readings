---
id: 68eaf0ba-f713-424f-8b08-99bcc4ac8731
title: A TypeScripter's Take on Zig (Advent of Code 2023)
tags:
  - RSS
date_published: 2024-07-17 16:05:44
---

# A TypeScripter's Take on Zig (Advent of Code 2023)
#Omnivore

[Read on Omnivore](https://omnivore.app/me/a-type-scripter-s-take-on-zig-advent-of-code-2023-190c2c5cbf4)
[Read Original](https://effectivetypescript.com/2024/07/17/advent2023-zig/)



What can Zig learn from TypeScript, and what can TypeScript learn from Zig?

The [Advent of Code](https:&#x2F;&#x2F;adventofcode.com&#x2F;) is a fun annual programming competition with an Elf theme. It consists of 25 two-part problems of increasing difficulty, released every day in December leading up to Christmas.

Every December, I complete it in a new programming language. Every January, I intend to blog about the experience. Usually this slips to March or April, but this year it&#39;s fallen all the way back to July! As excuses, I&#39;ll offer [writing a book](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;05&#x2F;21&#x2F;second-edition&#x2F;), participating in [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;) and implementing a [cool new feature](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;04&#x2F;16&#x2F;inferring-a-type-predicate&#x2F;) in TypeScript 5.5.

Here are the previous installments in this series:

* [2019: Python](https:&#x2F;&#x2F;medium.com&#x2F;@danvdk&#x2F;python-tips-tricks-for-the-advent-of-code-2019-89ec23a595dd)
* [2020: Rust](https:&#x2F;&#x2F;danvdk.medium.com&#x2F;advent-of-code-2020-this-time-in-rust-7904559e24bc)
* [2021: Go](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2022&#x2F;02&#x2F;06&#x2F;advent-of-code-2021-golang&#x2F;)
* [2022: TypeScript &#x2F; Deno](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2023&#x2F;04&#x2F;27&#x2F;aoc2022&#x2F;)

Solving concrete problems is fun, and so is learning new languages. But this is also a good way to break out of the mental bubble of your primary language to see what else is out there. As Alan Perlis [once said](https:&#x2F;&#x2F;www.goodreads.com&#x2F;quotes&#x2F;393595-a-language-that-doesn-t-affect-the-way-you-think-about), &quot;A language that doesn&#39;t affect the way you think about programming is not worth knowing.&quot;

Like many people in the JavaScript world, I learned about Zig because [Bun](https:&#x2F;&#x2F;bun.sh&#x2F;), the new JavaScript runtime, is implemented in it. I [read](https:&#x2F;&#x2F;zig.news&#x2F;gwenzek&#x2F;zig-great-design-for-great-optimizations-638) a [little bit](https:&#x2F;&#x2F;www.avestura.dev&#x2F;blog&#x2F;problems-of-c-and-how-zig-addresses-them) about the language, thought it sounded interesting, and decided to do the 2023 Advent of Code in it.

I didn&#39;t know that much about Zig going in. My mental model was that it was a &quot;modernized C&quot; to complement Rust&#39;s &quot;modernized C++.&quot; Having used Zig for a bit, I wouldn&#39;t say that any more. It can be a fine C++ replacement, too. But first things first. What&#39;s Zig?

1. [A very quick intro to Zig](#A-very-quick-intro-to-Zig)
2. [What can TypeScript learn from Zig?](#What-can-TypeScript-learn-from-Zig)  
   1. [Detectable Illegal Behavior](#Detectable-Illegal-Behavior)  
   2. [comptime](#comptime)
3. [What can Zig learn from TypeScript?](#What-can-Zig-learn-from-TypeScript)  
   1. [Language Server](#Language-Server)  
   2. [Error Message Ergonomics](#Error-Message-Ergonomics)  
   3. [Documentation](#Documentation)  
   4. [Caveats](#Caveats)
4. [General impressions of Zig](#General-impressions-of-Zig)
5. [Thoughts on this year&#39;s Advent of Code](#Thoughts-on-this-year-39-s-Advent-of-Code)
6. [Zig gotchas for JavaScript developers](#Zig-gotchas-for-JavaScript-developers)
7. [Tips for doing the Advent of Code in Zig](#Tips-for-doing-the-Advent-of-Code-in-Zig)
8. [Conclusions](#Conclusions)

## [](#A-very-quick-intro-to-Zig &quot;A very quick intro to Zig&quot;)A very quick intro to Zig

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;200x70,sJNT2NOd5GboB6WmjJRWs2Jz7eaktQXmkhwiqbY-Rf5o&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;zig-logo-dark.svg &quot;Zig Logo&quot;)Zig is a low-level programming language that was [first announced in 2016](https:&#x2F;&#x2F;andrewkelley.me&#x2F;post&#x2F;intro-to-zig.html). It fills a similar niche to [C](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;C%5F%28programming%5Flanguage%29): manual memory management, access to the bits of your data structures, compatible with C APIs, no object orientation.

C is a very old language, and some of its design choices haven&#39;t aged well. While a whole source file might not have fit into memory in 1970, that seems like a safe assumption in the 21st century. And the internet has made the cost of bugs like buffer overflows dramatically higher, since they&#39;re now security holes. Zig has a reasonable module system and it doesn&#39;t allow null pointers.

Zig also takes the opportunity to clean up and modernize lots of C syntax. One small example: in C, dereferencing a pointer is a prefix operation (&#x60;*p&#x60;), unless you&#39;re accessing a property (&#x60;p-&gt;prop&#x60;). In Zig, dereferencing is a postfix operation (&#x60;p.*&#x60;) and you always access properties with a dot (&#x60;p.prop&#x60;).

Zig also embraces best practices that have emerged over the past few decades: option types instead of null pointers, slices instead of null-terminated strings, type inference, built-in testing tools, UTF-8 source code, and a canonical code formatter.

Here&#39;s what [Hello World](https:&#x2F;&#x2F;zig.guide&#x2F;getting-started&#x2F;hello-world) looks like in Zig:

&#x60;&#x60;&#x60;arduino
const std &#x3D; @import(&quot;std&quot;);
pub fn main() void {
    std.debug.print(&quot;Hello, {s}!\n&quot;, .{&quot;World&quot;});
}

&#x60;&#x60;&#x60;

Beyond modernizing C, Zig introduces a few novel constructs of its own. We&#39;ll take a look at two of these and think about what they&#39;d look like in the context of TypeScript.

## [](#What-can-TypeScript-learn-from-Zig &quot;What can TypeScript learn from Zig?&quot;)What can TypeScript learn from Zig?

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;128x128,sTcOOdgCD0mYimMocn5GXC77-oahvq4fKq08d2r7oLNo&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;ts-logo-128.svg &quot;TypeScript Logo&quot;)Programming language designers sometimes talk about their [novelty budget](https:&#x2F;&#x2F;craftinginterpreters.com&#x2F;methods-and-initializers.html#design-note): if you want developers to learn your language, you can only deviate so much from languages they already know. So best to think carefully about what these novelties will be, and make sure that they&#39;re high impact.

Two of Zig&#39;s most novel features are [Detectable Illegal Behavior](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;runtime-safety) and [comptime](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;comptime). These are both fantastic ideas, and it&#39;s interesting think about what they&#39;d look like in TypeScript.

### [](#Detectable-Illegal-Behavior &quot;Detectable Illegal Behavior&quot;)Detectable Illegal Behavior

The earlier we can catch errors, the less damage they cause, and the better off we&#39;ll be. You can imagine a hierarchy of bad behavior:

* Worst: Incorrect runtime behavior, producing a wrong answer, or even data corruption.
* Bad: Throwing an exception or crashing at runtime.
* Better: Failing a test
* Best: Detecting the bug through static analysis (a compiler error)

(You could add more levels to this hierarchy, e.g. unit tests, integration tests and manual QA tests.) Detection through static analysis is best because we detect the bug without ever having to run the broken code, and it can&#39;t do any damage!

Languages like C are notorious for the high consequences of mistakes. Coding errors can often turn into memory corruption or security issues. Zig&#39;s &quot;[detectable illegal behavior](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;runtime-safety)&quot; is an interesting take on how to improve this. To see how it works, consider an [integer overflow](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Integer%5Foverflow) bug:

&#x60;&#x60;&#x60;arduino
pub fn main() void {
    const a: u8 &#x3D; 255 + 1;
    std.debug.print(&quot;255 + 1 &#x3D; {d}!\n&quot;, .{a});
}

&#x60;&#x60;&#x60;

A &#x60;u8&#x60; is an 8-bit unsigned integer. It can only represent values from 0 to 255\. When you compile this, you&#39;ll get an error:

&#x60;&#x60;&#x60;routeros
src&#x2F;main.zig:4:23: error: type &#39;u8&#39; cannot represent integer value &#39;256&#39;
    const a: u8 &#x3D; 255 + 1;
                  ~~~~^~~

&#x60;&#x60;&#x60;

This is the best case scenario. A &#x60;u8&#x60; can&#39;t represent 256 and Zig has detected this error statically.

If you make the error a little more subtle, though, the Zig compiler can&#39;t see it:

&#x60;&#x60;&#x60;arduino
pub fn main() void {
    const a: u8 &#x3D; 255;
    a +&#x3D; 1;
    std.debug.print(&quot;255 + 1 &#x3D; {d}!\n&quot;, .{a});
}

&#x60;&#x60;&#x60;

What happens now is that you get a crash when you _run_ the program:

&#x60;&#x60;&#x60;angelscript
$ zig run src&#x2F;main.zig
thread 12826611 panic: integer overflow
src&#x2F;main.zig:5:7: 0x10031a413 in main (main)
    a +&#x3D; 1;
      ^

&#x60;&#x60;&#x60;

Zig knows that integer addition can cause an overflow, so it inserts a check for this at runtime. If you overflow, you get a panic. Looking at our hierarchy of bad behavior, this is bad but it&#39;s saving us from the worst case scenario: incorrect behavior and chaos at runtime. This comes at a cost, though: because the check happens at runtime, it slows your program down. If this addition is happening in a tight loop, this can be a problem.

Zig lets you take off the safety wheels by changing your release mode:

&#x60;&#x60;&#x60;angelscript
$ zig run -O ReleaseFast src&#x2F;main.zig
255 + 1 &#x3D; 0!

&#x60;&#x60;&#x60;

Now the safety checks are off and the integer overflow is allowed to happen. There are [many more examples](https:&#x2F;&#x2F;ziglang.org&#x2F;documentation&#x2F;0.13.0&#x2F;#Undefined-Behavior) of this sort of detectable illegal behavior in Zig, for example [bounds checking](https:&#x2F;&#x2F;ziglang.org&#x2F;documentation&#x2F;0.13.0&#x2F;#Index-out-of-Bounds) on arrays. (Zig doesn&#39;t guarantee that this code will output &#x60;0&#x60;. This is also known as &quot;undefined behavior,&quot; and this flexibility gives Zig more opportunities for [optimization](https:&#x2F;&#x2F;zig.news&#x2F;gwenzek&#x2F;zig-great-design-for-great-optimizations-638).)

The interesting thing here is that there&#39;s an intermediate between detecting problems statically and not detecting them at all. As a fallback, we can detect a class of problems at runtime in debug builds.

What would this look like in TypeScript? [JavaScript&#39;s approach to numbers](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;Number) means that integer overflows are uncommon. But array out-of-bounds access can certainly happen:

&#x60;&#x60;&#x60;prolog
const letters &#x3D; [&#39;A&#39;, &#39;B&#39;, &#39;C&#39;];
el.textContent &#x3D; letters[3];  &#x2F;&#x2F; no error, displays &quot;undefined&quot; at runtime.

&#x60;&#x60;&#x60;

TypeScript does not modify this code when it compiles to JavaScript. But you could imagine &#x60;tsc&#x60; compiling this to a sort of &quot;debug build&quot; that added bounds-checking:

&#x60;&#x60;&#x60;actionscript
const letters &#x3D; [&#39;A&#39;, &#39;B&#39;, &#39;C&#39;];
el.textContent &#x3D; _checkedAccess(letters, 3);  &#x2F;&#x2F; throws at runtime

&#x60;&#x60;&#x60;

There&#39;s no static error, but at least this moves us one notch up the hierarchy of bad behavior.

It&#39;s instructive to compare Zig&#39;s behavior to TypeScript&#39;s [noUncheckedIndexedAccess](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;tsconfig&#x2F;#noUncheckedIndexedAccess) setting. Zig&#39;s approach is &quot;trust but verify:&quot; during static analysis, it assumes your code is correct and only reports an error if it&#39;s confident that it&#39;s not. But then it inserts checks to verify its assumption at runtime.

By contrast, TypeScript with &#x60;noUncheckedIndexedAccess&#x60; assumes your code is invalid unless it can prove otherwise. There&#39;s a presumption of incorrectness, but no runtime checks are added:

&#x60;&#x60;&#x60;actionscript
const letters &#x3D; [&#39;A&#39;, &#39;B&#39;, &#39;C&#39;];
const c &#x3D; letters[2];  &#x2F;&#x2F; this is a _valid_ access, so the error is spurious
el.textContent &#x3D; c.toUpperCase();
&#x2F;&#x2F;               ~ &#39;c&#39; is possibly &#39;undefined&#39;.

&#x60;&#x60;&#x60;

One of the ways to convince TypeScript that your array access is valid is to add a bounds check yourself:

&#x60;&#x60;&#x60;actionscript
const letters &#x3D; [&#39;A&#39;, &#39;B&#39;, &#39;C&#39;];
const c &#x3D; letters[2];
if (c !&#x3D;&#x3D; undefined) {
  el.textContent &#x3D; c.toUpperCase();  &#x2F;&#x2F; ok for type checking and at runtime
}

&#x60;&#x60;&#x60;

Inserting runtime checks would allow TypeScript to flip over to an &quot;innocent unless proven guilty&quot; model like Zig&#39;s, which would result in fewer false positives and make &#x60;noUncheckedIndexedAccess&#x60; easier to adopt.

This is just one instance of the broader issue of [unsoundness](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2021&#x2F;05&#x2F;06&#x2F;unsoundness&#x2F;). This is when a variable&#39;s TypeScript type doesn&#39;t match its runtime type. There are [many ways](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2021&#x2F;05&#x2F;06&#x2F;unsoundness&#x2F;) this can happen, but a common one is a [type assertion](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;2&#x2F;everyday-types.html#type-assertions) (&quot;as&quot;):

&#x60;&#x60;&#x60;typescript
interface FunFact {
  fact: string;
  funLevel: number;
}
const response &#x3D; await fetch(&#39;&#x2F;api&#x2F;fun-fact&#39;);
const fact &#x3D; await response.json() as FunFact;

&#x60;&#x60;&#x60;

Does this API endpoint actually return a &#x60;FunFact&#x60;? The type assertion assures TypeScript that it does, but there&#39;s no reason this has to be the case at runtime. When this snippet is converted to JavaScript, it looks like this:

&#x60;&#x60;&#x60;aspectj
const response &#x3D; await fetch(&#39;&#x2F;api&#x2F;fun-fact&#39;);
const fact &#x3D; await response.json();

&#x60;&#x60;&#x60;

There are no checks performed on the response. TypeScript is just trusting us. But perhaps the API has changed or we had a miscommunication with the backend team. If the response is actually some other type, then we may get a runtime crash or display unsightly &quot;undefined&quot;s on the page.

There are [various](https:&#x2F;&#x2F;github.com&#x2F;colinhacks&#x2F;zod) [standard](https:&#x2F;&#x2F;github.com&#x2F;YousefED&#x2F;typescript-json-schema) ways to solve this problem in TypeScript. But what if TypeScript were a little more like Zig? What if it had some notion of a debug build that produced JavaScript that looked more like this:

&#x60;&#x60;&#x60;cs
const response &#x3D; await fetch(&#39;&#x2F;api&#x2F;fun-fact&#39;);
const fact &#x3D; debugCheckType(await response.json(), RuntimeVersionOfFunFact);

&#x60;&#x60;&#x60;

This could be pervasive. For example, a function like this:

&#x60;&#x60;&#x60;less
function repeat(message: string, times: number) {
  return Array(times).fill(message).join(&#39;\n&#39;);
}

&#x60;&#x60;&#x60;

might get compiled to this:

&#x60;&#x60;&#x60;typescript
function repeat(message: string, times: number) {
  if (typeof message !&#x3D;&#x3D; &#39;string&#39;) throw new Error();
  if (typeof message !&#x3D;&#x3D; &#39;number&#39;) throw new Error();
  return Array(times).fill(message).join(&#39;\n&#39;);
}

&#x60;&#x60;&#x60;

You can imagine how this would improve type safety, but also slow down your code at runtime.

The [Dart language](https:&#x2F;&#x2F;dart.dev&#x2F;) does [something like this](https:&#x2F;&#x2F;dart.dev&#x2F;language&#x2F;type-system#runtime-checks) to achieve a sound type system. It&#39;s interesting to think about what something similar would look like for TypeScript. I&#39;m sure it would find lots of surprising sources of unsound types!

### [](#comptime &quot;comptime&quot;)comptime

In Zig, you can use the [comptime keyword](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;comptime) to force a block of code to execute at compile time, rather than runtime:

&#x60;&#x60;&#x60;arduino
fn fibonacci(n: u16) u16 {
    if (n &#x3D;&#x3D; 0 or n &#x3D;&#x3D; 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
pub fn main() void {
    const comp &#x3D; comptime fibonacci(40);
    std.debug.print(&quot;comptime: {d}\n&quot;, .{comp});
    const run &#x3D; fibonacci(40);
    std.debug.print(&quot;runtime: {d}\n&quot;, .{run});
}

&#x60;&#x60;&#x60;

If you build this and then run it, you&#39;ll see the first line print instantly, then a noticeable pause before the second line prints the same number. When Zig compiles this code, it becomes something more like this:

In the first line, the _compiler_ has run the Fibonacci function.

&#x60;comptime&#x60; is a particularly powerful, unifying concept in Zig because you can also manipulate _types_ at comptime. This is how Zig implements generic types:

&#x60;&#x60;&#x60;reasonml
&#x2F;&#x2F; Closed interval parameterized on integer type
pub fn Interval(comptime IntType: type) type {
    return struct {
        low: IntType,
        high: IntType,
        pub fn includes(self: @This(), val: IntType) bool {
            return val &gt;&#x3D; self.low and val &lt;&#x3D; self.high;
        }
    }
}

const Int32Range &#x3D; Interval(i32);

&#x60;&#x60;&#x60;

Notice how this is just an ordinary Zig function, written with all the usual syntax and constructs. It&#39;s a function from from one type to another. This is how we _think_ about types in TypeScript ([Item 50](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;effective-typescript&#x2F;blob&#x2F;main&#x2F;samples&#x2F;ch-generics&#x2F;functions-on-types.md) of [_Effective TypeScript_](https:&#x2F;&#x2F;amzn.to&#x2F;3UjPrsK) is called &quot;Think of Generics as Functions Between Types&quot;). But in Zig they really are functions between types. Notice on the last line how &quot;instantiating&quot; a generic type just involves calling the function and assigning the result to a variable.

Compare this to what you&#39;d write in TypeScript:

&#x60;&#x60;&#x60;routeros
interface Interval&lt;T&gt; {
  low: T;
  high: T;
  includes(val: T): boolean;
}
type NumInterval &#x3D; Interval&lt;number&gt;;

&#x60;&#x60;&#x60;

TypeScript has two [Turing-complete](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;issues&#x2F;14833) languages: JavaScript for the runtime, and TypeScript&#39;s type system for type manipulation. The two are quite different, and TypeScript developers have to [learn a new language](https:&#x2F;&#x2F;github.com&#x2F;type-challenges&#x2F;type-challenges) to write complex, type-level code. Moreover, as I argue in [Item 58](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;effective-typescript&#x2F;blob&#x2F;main&#x2F;samples&#x2F;ch-generics&#x2F;codegen-alt.md) of _Effective TypeScript_, it&#39;s not a particularly good language, and you should try to avoid doing too much heavy lifting in it lest you fall into the infamous [Turing Tarpit](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Turing%5Ftarpit).

Zig, by contrast, only has one language: Zig. To manipulate types, you just write Zig code. The only difference is that it has to be &#x60;comptime&#x60;. Manipulating the properties of a type doesn&#39;t require any new concepts like mapped types or conditional types. You just use a &#x60;for&#x60; loop and an &#x60;if&#x60; statement.

In my 2020 post [TypeScript Splits the Atom](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2020&#x2F;11&#x2F;05&#x2F;template-literal-types&#x2F;) and [Item 54](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;effective-typescript&#x2F;blob&#x2F;main&#x2F;samples&#x2F;ch-generics&#x2F;template-dsl.md) of _Effective TypeScript_, I walk through how you can construct a generic type that takes a snake\_cased object (&#x60;{foo_bar: string}&#x60;) and produces the corresponding camelCased object (&#x60;{fooBar: string}&#x60;). This requires a bunch of concepts from TypeScript&#39;s type system: generic types, template literal types, conditional types, mapped types, and &#x60;infer&#x60;. It&#39;s not simple, and it doesn&#39;t look at all like JavaScript.

Here&#39;s what it might look like if TypeScript had something like Zig&#39;s &#x60;comptime&#x60;:

&#x60;&#x60;&#x60;typescript
&#x2F;&#x2F; e.g. &quot;foo_bar&quot; -&gt; &quot;fooBar&quot;
function camelCase(term: string) {
  return term.replace(&#x2F;_([a-z])&#x2F;g, m &#x3D;&gt; m[1].toUpperCase());
}
&#x2F;&#x2F; Not real TypeScript, just imagining!
function ObjectToCamel(comptime type T extends object) type {
  interface Result {}
  for (const [k, v] of Object.entries(T)) {
    Result[camelCase(k)] &#x3D; v;
  }
  return Result;
}

function objectToCamel&lt;T extends object&gt;(obj: T): ObjectToCamel(T) {
  const out: any &#x3D; {};
  for (const [k, v] of Object.entries(obj)) {
    out[camelCase(k)] &#x3D; v;
  }
  return out;
}

&#x60;&#x60;&#x60;

This is just a sketch, but it&#39;s satisfying to see how the code for manipulating the types and the code for manipulating the values are nearly identical. Even better, they both call the same &#x60;camelCase&#x60; function, so you know the type and value transformations will stay in sync and have identical edge case behaviors.

Type-level TypeScript is written in a different language and runs in the type checker. comptime Zig is still Zig, it just runs at a different time.

comptime is useful beyond type manipulation. I was afraid to look at the source code for &#x60;std.fmt.format&#x60; because I assumed it would involve some completely inscrutable metaprogramming. But it&#39;s [actually pretty simple](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;blob&#x2F;4870e002f213d7002ac1941c6a204aff79137d54&#x2F;lib&#x2F;std&#x2F;fmt.zig#L80-L84)! The format string must be &#x60;comptime&#x60; known, and the formatting function just runs a for loop over it.

Using the same language for programming and metaprogramming seems like a great idea (see: [Lisp macros](https:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;267880&#x2F;388951)). Are there any downsides? I can think of two: performance and inference.

* **Performance**: &#x60;comptime&#x60; isn&#39;t free. Your code still has to be run at some point. Zig doesn&#39;t have a very built-out language server (more on that shortly), but TypeScript does. It potentially has to run your type level code on every keystroke as you type in your text editor. To avoid bogging down or hanging, TypeScript sets some strict limits on how deeply recursive your type-level code can be. If your type-level code was written in JavaScript, it would much harder to enforce these limits in any systematic way. Timeouts aren&#39;t really an option in a compiler: you don&#39;t want the validity of code to depend on the developer&#39;s CPU speed.
* **Inference**: When it&#39;s inferring types, there are situations where TypeScript needs to run your type-level code _in reverse_. Type-level operations were built with inference in mind, but inverting an arbitrary snippet of JavaScript code isn&#39;t possible.

Here&#39;s a simple example of how this can happen:

&#x60;&#x60;&#x60;pgsql
type Box&lt;T&gt; &#x3D; { value: T };
declare function unbox&lt;T&gt;(box: Box&lt;T&gt;): T;
const num &#x3D; unbox({value: 12});
&#x2F;&#x2F;    ^? const num: number

&#x60;&#x60;&#x60;

Here &#x60;Box&#x60; maps &#x60;T&#x60; → &#x60;{value: T}&#x60;, but on the last line TypeScript has to go from &#x60;{value: number}&#x60; → &#x60;number&#x60; to infer &#x60;T&#x60;. This even [works with conditional types](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;play&#x2F;?noUncheckedIndexedAccess&#x3D;true&amp;target&#x3D;6#code&#x2F;C4TwDgpgBAQg9gDwDwBUB8UC8UDeUBuAhgDYCuEAXFClAL4DcAUACYQDGxhATtAGakA7NsACWcAVEEAjRKjQAKGQirxk6AJRUUTRm3EBnYFAGkAtlkkCl8nETKUoARgBMtdUwD0HqD6gA9AH4oPQFDYzMqE1MpCC5GeNBIKABhcWZVOQsaCARgCAFmfShDLhEBAHMoILwSrTooKjwBcQBlYC46hhZ2Th4ofiFRcUslEOY5RUQqVIKMjS0dELDgAHcIYnxobGlEMZtmgTaOp1d3Ri9ffyClo1X1zcizGLjdAyMECx2EPZxaqAByBD-Nyeby+QLBN5QZQAoGMIA).

These are both serious issues. In practice I&#39;d hope that caching could mitigate many of the performance concerns. And, to be honest, I&#39;d be fine losing this form of type inference if it meant that we could manipulate types in plain old JavaScript!

To be clear, these would be radical changes to TypeScript and I don&#39;t expect anything like them to happen. But you could imagine building an alternative TypeScript to JavaScript emitter that inserted runtime type checks. (We could call it… [DefinitelyTyped](https:&#x2F;&#x2F;github.com&#x2F;DefinitelyTyped&#x2F;DefinitelyTyped)! 😜) And if an aspiring language designer wants to build the next great flavor of typed JavaScript, including a comptime construct would be a great way to differentiate from TypeScript.

## [](#What-can-Zig-learn-from-TypeScript &quot;What can Zig learn from TypeScript?&quot;)What can Zig learn from TypeScript?

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;190x158,s-2Zauo_eUwSlZUgzu5hikvP82sEtAhU6azFYembFId4&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;ziggy.svg &quot;Ziggy, the Zig mascot&quot;)Flipping the question around, what are some good ideas from TypeScript that Zig might adopt?

My main suggestion would be to focus more on developer experience. To me, this means a few things:

1. Language server
2. Error message ergonomics
3. Documentation

### [](#Language-Server &quot;Language Server&quot;)Language Server

When you install TypeScript in a project, you get two binaries:

1. &#x60;tsc&#x60;, the TypeScript Compiler
2. &#x60;tsserver&#x60;, the TypeScript Language Server

It&#39;s pretty rare to run &#x60;tsserver&#x60; directly, but if you use VS Code or another editor that supports the language service protocol, you&#39;re interacting with it all the time. The TypeScript team treats these binaries as equally important. Every new language feature is supported by the language server on day one. And the release notes for TypeScript versions include things like [new Quick Fixes](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;release-notes&#x2F;typescript-5-4.html#quick-fix-for-adding-missing-parameters), which you might not think of as being core to the language itself.

There _is_ a language server available for Zig, [zls](https:&#x2F;&#x2F;github.com&#x2F;zigtools&#x2F;zls). It&#39;s a third-party tool, though, and while an [enormous amount of work](https:&#x2F;&#x2F;github.com&#x2F;zigtools&#x2F;zls&#x2F;commits&#x2F;master&#x2F;) has gone into it, it has a lot of issues. It provides syntax highlighting and some language service features like go-to-definition. It reports superficial errors like syntax errors and unused variables, but it quickly gets lost with anything much beyond that.

Some of the errors that it fails to report are surprising:

![zls failing to detect a typo in a function name](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,swIF561-MZTzAfNBdxsdykVskPL4dC9MOSdHVP9IiF_w&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;zls-no-error.png)

It should be &#x60;print&#x60;, not &#x60;prin&#x60;.

It&#39;s pretty disorienting to see no errors in your editor, only to have lots of them when you build from the command line. _(See [below](#caveats) for how to improve this.)_ The language server also hangs a lot. It was quite rare for me to solve an Advent of Code problem without having to restart &#x60;zls&#x60;.

Apparently gripes about &#x60;zls&#x60; are [common](https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;Zig&#x2F;comments&#x2F;1d4s9kz&#x2F;zls%5Fdoes%5Fnot%5Fcatch%5Fcompile%5Ftime%5Ferrors%5Fwarnings&#x2F;) in the Zig community, so this may not come as much of a surprise. Andrew Kelley [talks about this a bit](https:&#x2F;&#x2F;youtu.be&#x2F;5eL%5FLcxwwHg?si&#x3D;xLEFQqRwGQ7tPbni&amp;t&#x3D;2260) in the context of the [2024 Zig Roadmap](https:&#x2F;&#x2F;lwn.net&#x2F;Articles&#x2F;959915&#x2F;). He thinks a first-party language server will happen eventually, but it&#39;s not a priority. He also mentions that he uses vim and does not use a language server, so a first-party language server would not benefit him personally.

I think this may be a cultural thing. I used to use vim 15 years go when I worked [primarily in C++](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;performance-boggle), and I also didn&#39;t use a language server. There wasn&#39;t much point. C++ is nearly impossible to parse, let alone analyze. It was only when I started working in TypeScript and switched to VS Code that I saw the light. Language servers are great, and it&#39;s hard to go back once you&#39;re used to them.

A language server changes your relationship with the language. A command-line compiler is all about looking over your code and telling you where you&#39;ve made mistakes. A language server is like a partner that&#39;s right there in your editor with you, helping you to get things right. It&#39;s hard to underestimate how valuable a good language server is when you&#39;re coming up to speed on a new language. It lets you quickly experiment and develop an intuition for how types work and what errors result from your changes. A better zls would have greatly improved my experience with Zig.

Let&#39;s all hope Andrew works on a TypeScript side project someday and has a language server conversion experience. May I suggest the 2024 Advent of Code? 😀

### [](#Error-Message-Ergonomics &quot;Error Message Ergonomics&quot;)Error Message Ergonomics

The user interface of a compiler consists mostly of the errors that it presents to you. So the way those error messages are presented has a huge impact on your experience of using the language. The TypeScript team takes this extremely seriously. There&#39;s an entire [GitHub Issue Label](https:&#x2F;&#x2F;github.com&#x2F;microsoft&#x2F;TypeScript&#x2F;labels&#x2F;Domain%3A%20Error%20Messages) for error messages, and many releases [include improvements](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2023&#x2F;06&#x2F;27&#x2F;ts-51&#x2F;#Improved-Error-Messages) in error reporting.

Even more fundamental than messaging, though, is attribution. I ran into at least three cases during the Advent of Code where an error was correctly reported, but in the wrong place. This makes for an incredibly confusing experience, particularly when you&#39;re learning a new language and aren&#39;t very confident about how you&#39;re using it.

When I [updated to Zig 0.13](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;pull&#x2F;4) for this post, I was happy to see that 2&#x2F;3 of these misattributions had been fixed. The third issue was that calling &#x60;std.debug.print&#x60; with the wrong number of arguments doesn&#39;t include the relevant line number in the error message. I [filed an issue](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;issues&#x2F;18485) about this in January. A fix was [quickly posted](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;pull&#x2F;18349), but it was rejected by Andrew Kelley, Zig&#39;s creator, as [too hacky](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;pull&#x2F;18349#discussion%5Fr1445562741).

I have tremendous respect for Andrew&#39;s willingness to hold out for a better solution. Language designers need to do this to avoid bigger problems down the road. But I do hope this issue gets fixed, because missing locations on error messages is a truly terrible, disorienting user experience.

Here was another sort of error that tripped me up a few times:

&#x60;&#x60;&#x60;angelscript
const values &#x3D; std.AutoHashMap(Point, u32);
defer values.deinit();
try values.put(Point{ .x &#x3D; 0, .y &#x3D; 0 }, 1);
&#x2F;&#x2F;  ~~~~~~^~~~ error: expected 3 argument(s), found 2

&#x60;&#x60;&#x60;

The mistake here isn&#39;t on that line, and it doesn&#39;t have to do with the number of arguments. Rather, it&#39;s that I forgot to call &#x60;.init()&#x60; on the hash map:

&#x60;&#x60;&#x60;maxima
var values &#x3D; std.AutoHashMap(Point, u32).init(allocator);
defer values.deinit();
try values.put(Point{ .x &#x3D; 0, .y &#x3D; 0 }, 1);

&#x60;&#x60;&#x60;

I also found Zig pointer types to be pretty hard to read in error messages.

### [](#Documentation &quot;Documentation&quot;)Documentation

Microsoft publishes an official [TypeScript Handbook](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;intro.html). When it [launched](https:&#x2F;&#x2F;devblogs.microsoft.com&#x2F;typescript&#x2F;announcing-the-new-typescript-handbook&#x2F;) in 2021, it was given as much attention and fanfare as the release of a new version of TypeScript itself.

I primarily used ziglearn.org to come up to speed, which is now [zig.guide](https:&#x2F;&#x2F;zig.guide&#x2F;). There&#39;s a lot of content there, but I found it had quite a few gaps. For example, the documentation on [build.zig](https:&#x2F;&#x2F;zig.guide&#x2F;build-system&#x2F;zig-build) is quite sparse, and it didn&#39;t give me much insight into how to set up a 25-day Advent of Code project (One binary? 25?). _(Update: there&#39;s now an official [docs page](https:&#x2F;&#x2F;ziglang.org&#x2F;learn&#x2F;build-system&#x2F;) and a [community forum](https:&#x2F;&#x2F;ziggit.dev&#x2F;t&#x2F;build-system-tricks&#x2F;3531) post.)_

I was surprised that Zig didn&#39;t have a &#x60;toString()&#x60; convention. Twenty days into the 2023 Advent of Code, I learned that it _did_ (&#x60;pub fn format&#x60;) from reading the standard library source code. As it turns out, this does appear in [one example](https:&#x2F;&#x2F;zig.guide&#x2F;standard-library&#x2F;formatting) in the docs on formatting, but I&#39;d expect this to be given more front-and-center treatment since it&#39;s so useful any time you define a data structure.

### [](#Caveats &quot;Caveats&quot;)Caveats

After sharing a draft of this post, I [learned](https:&#x2F;&#x2F;ziggit.dev&#x2F;t&#x2F;request-for-feedback-on-draft-blog-post-what-zig-and-typescript-can-learn-from-each-other&#x2F;5039&#x2F;3) that&#39;s it&#39;s possible to get &#x60;zls&#x60; to display all compile-time errors using the [buildOnSave](https:&#x2F;&#x2F;kristoff.it&#x2F;blog&#x2F;improving-your-zls-experience&#x2F;) feature. Here&#39;s a [commit](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;commit&#x2F;4dfdfd083839f2c43c90ab06274afe4c209932d3) where I added it to my repo. I wish I&#39;d known about this last December, it would have greatly improved my Zig experience!

And despite my grumblings about some aspects of developer experience, Zig may be making the correct tradeoffs. Why? It&#39;s still an early-stage language whose design is in flux. This is reflected not just in the version number (pre-1.0!) but also in its development: a [recent release](https:&#x2F;&#x2F;ziglang.org&#x2F;news&#x2F;0.11.0-postponed-again&#x2F;) removed an existing async&#x2F;await feature while they think about a better design. It&#39;s hard to imagine TypeScript doing something like that. If you expect the language to make major changes before 1.0, then building out a language server now will create more work down the road.

On the other hand, if the Zig team built out a language server now, they might gain valuable insights about which language features work well with it and which ones don&#39;t. This could inform the future design of the language. There&#39;s an assumption that a high-quality language service _can_ be built after the language design is stabilized, but this might not be the case. It&#39;s a gamble!

Of course, another big difference between TypeScript and Zig is that [Microsoft&#39;s annual revenue](https:&#x2F;&#x2F;www.microsoft.com&#x2F;investor&#x2F;reports&#x2F;ar23&#x2F;) is nearly 500,000 times greater than the [Zig Foundation&#39;s](https:&#x2F;&#x2F;ziglang.org&#x2F;news&#x2F;2024-financials&#x2F;). This means that the Zig team needs to make harder choices about prioritization. Their [top four goals](https:&#x2F;&#x2F;lwn.net&#x2F;Articles&#x2F;959915&#x2F;) are currently performance, language improvements, standard library improvements, and a formal language specification. It&#39;s hard to argue with the focus on build speed (Advent of Code solutions aren&#39;t big enough for this to be an issue), and that will definitely be a boon for developer experience. But I&#39;d love to see other forms of DX move up that list. For what it&#39;s worth, TypeScript&#39;s experience with formal specification is that it&#39;s not worthwhile. A [formal spec](https:&#x2F;&#x2F;javascript.xgqfrms.xyz&#x2F;pdfs&#x2F;TypeScript%20Language%20Specification.pdf) was released in 2014 and has been gathering dust ever since.

_✨ Many thanks to the Zig Forum for [feedback](https:&#x2F;&#x2F;ziggit.dev&#x2F;t&#x2F;request-for-feedback-on-draft-blog-post-what-zig-and-typescript-can-learn-from-each-other&#x2F;5039) on this section._

## [](#General-impressions-of-Zig &quot;General impressions of Zig&quot;)General impressions of Zig

Those issues aside, I wound up really liking Zig! Given a choice, I&#39;d strongly prefer it to C for a new project. I also found it easier to work in [than Rust](https:&#x2F;&#x2F;danvdk.medium.com&#x2F;advent-of-code-2020-this-time-in-rust-7904559e24bc).

Zig [advertises](https:&#x2F;&#x2F;ziglang.org&#x2F;) &quot;No hidden control flow&quot; and &quot;No hidden memory allocations.&quot; I incorrectly read the latter to also mean &quot;no hidden copying,&quot; and this led to a lot of confusion at first. For example:

&#x60;&#x60;&#x60;armasm
const Box &#x3D; struct {
    val: u32,
};
var a: Box &#x3D; .{ .val &#x3D; 1 };
var b &#x3D; a;
b.val &#x3D; 2;
std.debug.print(&quot;a: {} b: {}\n&quot;, .{ a, b });

&#x60;&#x60;&#x60;

In JavaScript, Python, or Java, &#x60;var b &#x3D; a&#x60; would create a new reference to the same underlying object and this would print two 2s.

In Zig (as in C++ and Go), &#x60;var b &#x3D; a&#x60; creates a copy of the struct and you get two different values:

&#x60;&#x60;&#x60;stylus
a: main.Box{ .val &#x3D; 1 } b: main.Box{ .val &#x3D; 2 }

&#x60;&#x60;&#x60;

Zig implicitly copies data all the time. Sometimes this can be subtle. If you return a &#x60;struct&#x60; from a function, it may be copied. A slice is a struct with a len and a ptr, and these are copied when you assign to a slice (the pointer is copied, not the thing it points to). Understanding implicit copying and building a mental model for it was the key insight that made me feel comfortable programming in Zig. I had a [similar insight](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2022&#x2F;02&#x2F;06&#x2F;advent-of-code-2021-golang&#x2F;#Implicit-copies) about Go back in 2021.

As I mentioned above, I really liked &#x60;comptime&#x60;. It&#39;s a clever, unifying idea. I hope more languages adopt something like this in the future.

Just like C, Zig doesn&#39;t have classes or inheritance, but it does have &#x60;struct&#x60;s. Unlike in C, a Zig &#x60;struct&#x60; can have methods defined on it and it can be generic. This feels a lot like [C with Classes](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;C%2B%2B#History). Unless you&#39;re making heavy use of inheritance (and [why would you be?](https:&#x2F;&#x2F;codeburst.io&#x2F;inheritance-is-evil-stop-using-it-6c4f1caf5117)), this means that Zig can also fill many of the same niches as C++. It&#39;s interesting that &#x60;struct&#x60;s can have private functions but not private fields. I guess this makes some sense since you have to be able to copy the bytes of a &#x60;struct&#x60; to use it.

Most Advent of Code problems start with reading a text file (your puzzle input). The standard way to [read a file line-by-line](https:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;68879352&#x2F;388951) is a bit verbose:

&#x60;&#x60;&#x60;reasonml
var file &#x3D; try std.fs.cwd().openFile(&quot;foo.txt&quot;, .{});
defer file.close();
var buf_reader &#x3D; std.io.bufferedReader(file.reader());
var in_stream &#x3D; buf_reader.reader();

var buf: [1024]u8 &#x3D; undefined;
while (try in_stream.readUntilDelimiterOrEof(&amp;buf, &#39;\n&#39;)) |line| {
    &#x2F;&#x2F; do something with line...
}

&#x60;&#x60;&#x60;

I thought it would be an interesting exercise to factor this out into a helper function. This wound up being [dramatically harder](https:&#x2F;&#x2F;stackoverflow.com&#x2F;questions&#x2F;77427514&#x2F;how-can-i-write-a-function-to-iterate-over-the-lines-in-a-file-in-zig) than I expected. With some help from Stack Overflow and the [Zig Forum](https:&#x2F;&#x2F;ziggit.dev&#x2F;t&#x2F;help-debugging-memory-corruption-while-reading-a-file-with-a-buffered-reader-and-iterator&#x2F;2203&#x2F;5), I was eventually able to come up with a [solution](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;main&#x2F;src&#x2F;buf-iter.zig). But the broader point from the forum was that maybe factoring this out isn&#39;t worth the hassle in Zig, because it&#39;s easier to see how all the pieces fit together with the explicit code, and to see what constants you&#39;re assuming (&#x60;1024&#x60; and &#x60;\n&#x60;).

I eventually found another reason to avoid this pattern: if you read the entire input into a single buffer (rather than line by line), then you can assume this memory is available throughout execution and reference slices of it without having to think about ownership. This is particularly nice if you&#39;re putting them in a &#x60;StringHashMap&#x60;, which does not take responsibility for ownership of its keys.

Zig has a distinctive way of [handling errors](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;errors): it introduces special syntax (&#x60;error!type&#x60;) for something that can be either an error or a success value. Typically the error type can be inferred:

&#x60;&#x60;&#x60;rust
fn foo() !u32 {
  const a &#x3D; try otherFunctionThatMightFail();
  return a + 1;
}

&#x60;&#x60;&#x60;

The &#x60;try&#x60; keyword checks if the other call returns an error and passes it on up the call chain. The possible error types that &#x60;foo()&#x60; returns will be the same as the other function. If &#x60;foo()&#x60; had returned &#x60;u32&#x60; instead, then it would have needed to handle the error case itself.

I didn&#39;t wind up having very strong feelings about this feature. I almost always allowed error types to be inferred, so the only difference between this and JavaScript-style exceptions is that there were more &#x60;try&#x60;s. Remember, no hidden control flow. It wasn&#39;t obvious to me why some failure modes (out of memory) are handled with explicit errors, while others (integer overflow) are handled via detectable illegal behavior. _(See [this comment](https:&#x2F;&#x2F;ziggit.dev&#x2F;t&#x2F;request-for-feedback-on-draft-blog-post-what-zig-and-typescript-can-learn-from-each-other&#x2F;5039&#x2F;3) for an explanation.)_

Whether a function can fail affects the way you call it, and this can be seen as an interesting [nudge](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Nudge%5Ftheory#:~:text&#x3D;A%20nudge%20makes%20it%20more,to%20favour%20the%20desired%20outcome.). Error-returning functions must be called with &#x60;try&#x60;, &#x60;catch&#x60;, or some other error-handling construct. Because you&#39;re constantly writing &#x60;try&#x60;, you&#39;re always aware of which type of function you&#39;re working with. This makes you prefer calling functions that can&#39;t fail. Since memory allocation can fail, this pushes you to write functions that don&#39;t allocate memory. Usually this means taking a buffer as an argument, or allocating one internally. And this is generally a more efficient design.

Another interesting choice is to [not allow function closures](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;issues&#x2F;229). Instead, higher-level Zig functions like [std.mem.sort](https:&#x2F;&#x2F;zig.guide&#x2F;standard-library&#x2F;sorting&#x2F;) take a context object that&#39;s passed to the comparison function. I believe this is equivalent in power to closures, it just requires the tedium of defining a context data type and populating it. This makes you aware of the context that you&#39;re capturing, and encourages you to capture as little as possible.

It&#39;s worth remembering that the Advent of Code tends to highlight specific aspects of a language, and these puzzles may not be the sorts of problems that the language is designed to solve. There were large parts of Zig that I never interacted with, for example its SIMD support or its C API. Zig is a great language for targeting WASM, but I never needed to do this.

A few other quick notes:

* An Arena allocator has some similarities to Rust-style lifetime annotations. Rather than tying the lifetimes of two values together, you connect them both to a moment in time during execution.
* Zig recently added [destructuring assignment for tuples](https:&#x2F;&#x2F;ziglang.org&#x2F;download&#x2F;0.12.0&#x2F;release-notes.html#Aggregate-Destructuring). This is great, but I wish it supported a [similar syntax for structs](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Operators&#x2F;Destructuring%5Fassignment#syntax), just like JavaScript, to encourage consistent naming. This would be particularly handy for imports. It&#39;s [unlikely to happen](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;issues&#x2F;3897#issuecomment-738984680), though.
* [Payload capturing](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;payload-captures) is ubiquitous and felt pretty intuitive. I just wish it worked better with the language server.
* [Sentinel termination](https:&#x2F;&#x2F;zig.guide&#x2F;language-basics&#x2F;sentinel-termination) feels like a trivial generalization of null termination. Are there ever situations where you want to terminate a slice with anything other than a &#x60;0&#x60;? (See [discussion](https:&#x2F;&#x2F;ziggit.dev&#x2F;t&#x2F;are-sentinels-only-intended-for-null-terminators&#x2F;2765).)
* Zig does a pretty good job of inferring types where it can. The various integer types make this a harder problem than it is in TypeScript, though.
* I found the many, sight variations on pointer syntax quite hard to read and get comfortable with, particularly in error messages:  
   * &#x60;*T&#x60;: pointer to a single item  
   * &#x60;[*]T&#x60;: pointer to many (unknown number) of items  
   * &#x60;*[N]T&#x60;: pointer to an array of N items  
   * &#x60;[*:x]T&#x60;: pointer to a number of items determined by a sentinel  
   * &#x60;[]T&#x60;: slice, has a pointer of type &#x60;[*]T&#x60; and a &#x60;len&#x60;.

## [](#Thoughts-on-this-year-39-s-Advent-of-Code &quot;Thoughts on this year&#39;s Advent of Code&quot;)Thoughts on this year&#39;s Advent of Code

I completed the 2017 Advent of Code in Zig as a warmup, then did the 2023 Advent of Code as problems came out each day.

This made for quite a contrast. The 2017 Advent of Code was very, very easy (my notes are [here](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;main&#x2F;aoc2017&#x2F;README.md)). The 2023 Advent of Code was quite hard. Even [day 1](https:&#x2F;&#x2F;adventofcode.com&#x2F;2023&#x2F;day&#x2F;1) had potential for trouble. Some of the problem setups were quite convoluted. There&#39;s been speculation that this was an attempt to thwart AI solvers. Whether or not it succeeded, it certainly led to some tedious code.

I learned about a few new things this year:

* [Pick&#39;s Theorem](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Pick%27s%5Ftheorem) relates the area of a polygon with integer vertices to the number of integer points inside the polygon.
* The [Shoelace Formula](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Shoelace%5Fformula) is the standard way to find the area of a simple polygon.
* A [Nonogram](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Nonogram), aka Paint by Numbers, is a type of logic puzzle.
* [sympy](https:&#x2F;&#x2F;www.sympy.org&#x2F;en&#x2F;index.html) is a Python library for symbolic manipulation &#x2F; computer algebra.

Notes on a few specific problems (spoiler alert!):

* [Day 20](https:&#x2F;&#x2F;adventofcode.com&#x2F;2023&#x2F;day&#x2F;20): This one was super frustrating. I had the right idea for part 2, but I used an online [LCM calculator](https:&#x2F;&#x2F;www.calculatorsoup.com&#x2F;calculators&#x2F;math&#x2F;lcm.php) and mistyped a number, leading to the wrong result. I wasted over an hour before realizing the mistake. Note to self: always copy&#x2F;paste numbers, never type them!
* [Day 21](https:&#x2F;&#x2F;adventofcode.com&#x2F;2023&#x2F;day&#x2F;21): I solved this by plugging numbers into a spreadsheet and looking for a pattern, even without fully understanding it. Judging by my finish number (#4624 at 11 AM Eastern), this was the hardest problem of the year.
* [Day 24](https:&#x2F;&#x2F;adventofcode.com&#x2F;2023&#x2F;day&#x2F;24): I completed part 1 before going to a family Christmas. I had part 2 in the back of my head all day, and I was pretty sure I had the solution all figured out. I just needed to code it. When I got home, I realized that the sample input and my puzzle input were very different, and my idea wouldn&#39;t work at all. I wound up spending an enormous amount of time solving the equations, largely by hand. I was a bit disappointed that most people just plugged them into [sympy](https:&#x2F;&#x2F;www.sympy.org&#x2F;en&#x2F;index.html) to get a solution without any understanding. sympy does look cool, though!
* [Day 25](https:&#x2F;&#x2F;adventofcode.com&#x2F;2023&#x2F;day&#x2F;25): My turn to use a Python library without understanding what I&#39;m doing. I gave up on Zig and plugged in NetworkX. The &#x60;k_edge_components&#x60; method solves this problem. I did eventually wind up [porting my solution](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;main&#x2F;src&#x2F;day25.zig) to Zig.

## [](#Zig-gotchas-for-JavaScript-developers &quot;Zig gotchas for JavaScript developers&quot;)Zig gotchas for JavaScript developers

Zig is a much lower-level language than JavaScript. If you haven&#39;t previously worked in a language with manual memory management, pointers, or a non-primitive string type, it&#39;s going to have a steep learning curve.

That being said, Zig has a few keywords that also exist in JavaScript, but mean completely different things. Watch out for these [false friends](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;False%5Ffriend):

* &#x60;var&#x60; and &#x60;const&#x60;: These are _not_ analogous to &#x60;var&#x60;&#x2F;&#x60;let&#x60; and &#x60;const&#x60; in JavaScript. In JavaScript, &#x60;const&#x60; is shallow. It just means that you can&#39;t reassign the variable. [Some people don&#39;t like it](https:&#x2F;&#x2F;www.epicweb.dev&#x2F;talks&#x2F;let-me-be). Zig&#39;s &#x60;const&#x60; is much stronger. If you declare a variable with &#x60;const&#x60;, you can&#39;t mutate it or call any methods that might mutate it. It&#39;s a deep &#x60;const&#x60;. Seeing &#x60;var&#x60; in JS should make you flinch because of its [weird hoisting semantics](https:&#x2F;&#x2F;medium.com&#x2F;@codingsam&#x2F;awesome-javascript-no-more-var-working-title-999428999994). But Zig doesn&#39;t have that historical baggage. &#x60;var&#x60; is a great term for something that varies.
* &#x60;try&#x60; and &#x60;catch&#x60;: In JavaScript (and C++, Java, and many other languages), these are used to construct &#x60;try {} catch (e) {}&#x60; blocks. In Zig, they&#39;re more like operators on expressions. &#x60;try f()&#x60; calls &#x60;f&#x60;, checks if it returns an error, and returns that error if it does. &#x60;catch&#x60; is used to provide fallback values: &#x60;f() catch val&#x60; resolves to &#x60;val&#x60; if &#x60;f&#x60; returns an error.
* &#x60;null&#x60; and &#x60;undefined&#x60;: JavaScript finally has company: another language that has both &#x60;null&#x60; _and_ &#x60;undefined&#x60;! These have pretty specific meanings in Zig, though. &#x60;null&#x60; is used exclusively with optional types. &#x60;undefined&#x60; is special: it&#39;s not a value; instead it means that you don&#39;t want to initialize the value. Generally you want to avoid this since you&#39;ll get garbage at runtime.
* &#x60;for&#x60; and &#x60;while&#x60;: Zig&#39;s &#x60;for&#x60; loop is quite limited. You can iterate over a slice or a range with it, and that&#39;s about it. For everything else, including iterators and C-style &#x60;for(;;)&#x60; loops, you use a &#x60;while&#x60; loop.
* &#x60;||&#x60; and &#x60;or&#x60;: In JavaScript (and C), &#x60;||&#x60; is logical or. Like Python, Zig spells that &#x60;or&#x60; instead. Fair enough. What&#39;s really confusing, though, is that Zig _also_ has a &#x60;||&#x60; operator that does something totally different. It unions two error sets, more akin to TypeScript&#39;s type-level &#x60;|&#x60;. I never used &#x60;||&#x60;.
* Zig has a &#x60;switch&#x60; statement but it works a bit differently than JavaScript&#39;s. It&#39;s more powerful, doesn&#39;t have fall-through, and must be exhaustive.
* Zig uses a different syntax for object literals: &#x60;.{ .x&#x3D;1, .y&#x3D;2 }&#x60; instead of &#x60;{ x: 1, y: 2 }&#x60;. I screwed this up countless times, and so will you.
* Zig also has tagged unions but they&#39;re a little more constrained than TypeScript&#39;s.

Zig is still a relatively niche language and ChatGPT is going to have more trouble helping you write it than it would with JavaScript.

## [](#Tips-for-doing-the-Advent-of-Code-in-Zig &quot;Tips for doing the Advent of Code in Zig&quot;)Tips for doing the Advent of Code in Zig

Various [other blogs](https:&#x2F;&#x2F;cohost.org&#x2F;strangebroadcasts&#x2F;post&#x2F;542139-also-failing-to-lear) have mentioned [struggling](https:&#x2F;&#x2F;www.forrestthewoods.com&#x2F;blog&#x2F;failing-to-learn-zig-via-advent-of-code&#x2F;) to do AoC in Zig. For the most part, I didn&#39;t find it to be too bad. If you decide to try it, good luck! Feel free to use [my repo](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023) as a template and guide.

Here are a few specific tips:

* Zig [doesn&#39;t have a scanf equivalent](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;issues&#x2F;12161) and [regexes are inconvenient](https:&#x2F;&#x2F;www.openmymind.net&#x2F;Regular-Expressions-in-Zig&#x2F;). So for parsing inputs, it&#39;s split, split, split. I wound up factoring out a few [splitIntoBuf](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;6ca7725757f4d2fc347a79d350f6f7da80b8db73&#x2F;src&#x2F;util.zig#L67) and [extractIntsIntoBuf](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;6ca7725757f4d2fc347a79d350f6f7da80b8db73&#x2F;src&#x2F;util.zig#L19) helpers that made short work of reading the input for most of the problems.
* Zig supports all sizes of ints, all the way up to &#x60;u65536&#x60;. If you&#39;re getting overflows, try using a bigger integer type. I used &#x60;u128&#x60; and &#x60;i128&#x60; on a few problems.
* &#x60;std.meta.stringToEnum&#x60; is a [neat trick](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;6ca7725757f4d2fc347a79d350f6f7da80b8db73&#x2F;src&#x2F;day10.zig#L173) for parsing a restricted set of strings or characters.
* As mentioned above, you can define a [format method](https:&#x2F;&#x2F;zig.guide&#x2F;standard-library&#x2F;formatting) on your &#x60;struct&#x60;s to make them print however you like.
* Try to avoid copying strings to use as keys in a &#x60;StringHashMap&#x60;. This feels natural coming from JS, but it&#39;s awkward in Zig because you need to keep track of those strings to free them later. If you can put your keys into a &#x60;struct&#x60; or a tuple, that will work better because they have value semantics. If you need strings, you might be able to use [slices of your puzzle input](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;aoc2023&#x2F;blob&#x2F;6ca7725757f4d2fc347a79d350f6f7da80b8db73&#x2F;src&#x2F;day15.zig), as described above.
* Watch out for off-by-one bugs with numeric ranges. If you want to include &#x60;max&#x60;, it&#39;s &#x60;min..(max+1)&#x60;, not &#x60;min..max&#x60;.
* Your code is going to have a lot of &#x60;@intCast&#x60;. It&#39;s OK.
* I found it odd that Zig has a built-in &#x60;PriorityQueue&#x60; but no built-in &#x60;Queue&#x60;. I wound up [finding one online](https:&#x2F;&#x2F;ziglang.org&#x2F;learn&#x2F;samples&#x2F;#generic-types) that I could paste into my repo. _(Update: use [std.SinglyLinkedList](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;blob&#x2F;9d9b5a11e873cc15e3f1b6e506ecf22c8380c87d&#x2F;lib&#x2F;std&#x2F;linked%5Flist.zig))_
* A lot of the functions you use to work with strings are in &#x60;std.mem&#x60;, e.g. &#x60;std.mem.eql&#x60; and &#x60;std.mem.startsWith&#x60;.
* Use &#x60;std.meta.eql&#x60; to compare structs, not &#x60;&#x3D;&#x3D;&#x60;.
* There&#39;s a trick for slicing by offset and _length_: &#x60;array[start..][0..length]&#x60;.
* It&#39;s often useful to memoize a function in Advent of Code. I have no idea if there&#39;s a general way to do this in Zig. (This led me to a unique solution that I was proud of on [day 12](https:&#x2F;&#x2F;adventofcode.com&#x2F;2023&#x2F;day&#x2F;12).)
* Debug build are considerably slower than optimized builds, sometimes 10x. If you&#39;re within a factor of 10 of getting an answer in a reasonable amount of time, try a different release mode.
* Don&#39;t mutate an &#x60;ArrayList&#x60; as you iterate through it. You might change what &#x60;.items&#x60; refers to, which will lead to chaos.
* You may need to factor out a variable to clarify lifetimes in some situations where JavaScript would let you inline an expression. See [this issue](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;issues&#x2F;12414).

Here are a few other blog posts I found helpful in learning Zig for Advent of Code:

* [Zig Quirks](https:&#x2F;&#x2F;www.openmymind.net&#x2F;Zig-Quirks&#x2F;)
* [Zig&#39;s Curious Multi-Sequence For Loops](https:&#x2F;&#x2F;kristoff.it&#x2F;blog&#x2F;zig-multi-sequence-for-loops&#x2F;)
* [Zig Cookbook](https:&#x2F;&#x2F;cookbook.ziglang.cc&#x2F;)

## [](#Conclusions &quot;Conclusions&quot;)Conclusions

I thoroughly enjoyed doing the Advent of Code and I enjoyed learning Zig in the process. Zig and TypeScript occupy different niches and have different goals, but there are still a few things they can learn from each other.

There&#39;s less than five months until the 2024 Advent of Code starts! Which language will I use this year? After learning a bunch about [programming languages](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;Stanford-CS-242-Programming-Languages) at [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;) this winter, I&#39;m thinking that I should just bite the bullet and use Haskell. We&#39;ll see how I feel about that in December!

---

[ ![Effective TypeScript Book Cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sm9xE88tj5xjDBByuPXdlK1ylp7ox_Z5Dra4yK783VRc&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;cover-2e.jpg) ](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6)

**_Effective TypeScript_** shows you not just _how_ to use TypeScript but how to use it _well_. Now in its second edition, the book&#39;s 83 items help you build mental models of how TypeScript and its ecosystem work, make you aware of pitfalls and traps to avoid, and guide you toward using TypeScript’s many capabilities in the most effective ways possible. Regardless of your level of TypeScript experience, you can learn something from this book.

After reading _Effective TypeScript_, your relationship with the type system will be the most productive it&#39;s ever been! [Learn more »](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;)