---
id: 9b585cf4-e164-4f2d-ad50-27189651f2e3
title: "0048: zest progress, zest ordering, wasm alignment, umbra papers, future of fast code, new internet, books, other stuff"
tags:
  - RSS
date_published: 2024-08-31 00:00:00
---

# 0048: zest progress, zest ordering, wasm alignment, umbra papers, future of fast code, new internet, books, other stuff
#Omnivore

[Read on Omnivore](https://omnivore.app/me/0048-zest-progress-zest-ordering-wasm-alignment-umbra-papers-fut-191abffb3c9)
[Read Original](https://www.scattered-thoughts.net/log/0048/)



## zest progress

I&#39;ve started working on the runtime. Many of the features of zest are going to be implemented by the runtime rather than by the compiler, but the runtime is itself written in zest. I&#39;m slowly unpicking the dependency graph of features to make that work, so the last month saw a lot of tiny changes:

* Added a &#x60;!&#x3D;&#x60; operator. I somehow forgot it earlier.
* Added support for strings and string literals.
* Added support for unions (sum types). I don&#39;t have pattern matching yet, so I added a &#x60;%union-has-key&#x60; intrinsic in the meantime.
* Added a &#x60;%panic&#x60; intrinsic which compiles to wasm&#39;s &#x60;unreachable&#x60;.
* Added unsafe intrinsics for working with raw memory:  
   * &#x60;%memory-size&#x60;, &#x60;%memory-grow&#x60;, &#x60;%memory-copy&#x60;, and &#x60;%memory-fill&#x60; map directly to the corresponding wasm bytecodes.  
   * &#x60;%load&#x60;, &#x60;%store&#x60;, and &#x60;%size-of&#x60; work with structs and unions as well as primitive types, so might map to more complicated bytecode or be optimized away entirely.
* Switched the default number type for literals from i32 to i64\. Added u32 for use in &#x60;%load&#x60; &#x2F; &#x60;%store&#x60; etc. This required refactoring chunks of codegen that previously didn&#39;t distinguish between numbers and addresses.
* Added support for [ufcs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Uniform%5FFunction%5FCall%5FSyntax). The syntax &#x60;a&#x2F;f(b,c)&#x60; is desugared to &#x60;f(a,b,c)&#x60;.
* Added support for first-class types and type-asserts&#x2F;conversions, including in destructuring and function arguments.
* Added some intrinsics needed for the allocator: &#x60;%count-leading-zeroes&#x60;, &#x60;%bit-shift-left&#x60;, &#x60;%remainder&#x60;.
* Wrote a simple allocator based on [WasmAllocator](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;blob&#x2F;master&#x2F;lib&#x2F;std&#x2F;heap&#x2F;WasmAllocator.zig).
* Added the &#x60;only&#x60; type (similar to julia&#39;s [Val](https:&#x2F;&#x2F;docs.julialang.org&#x2F;en&#x2F;v1&#x2F;manual&#x2F;types&#x2F;#%22Value-types%22) or typescripts [literal types](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;2&#x2F;everyday-types.html#literal-types)) and the &#x60;%from-only&#x60; intrinsic which extracts a value from a type. This type plays the same role in zest as [comptime](https:&#x2F;&#x2F;ziglang.org&#x2F;documentation&#x2F;master&#x2F;#comptime) annotations in zig.
* Added &#x60;%repr-of&#x60; and &#x60;%reflect&#x60; intrisincs to support structural metaprogramming.
* Added a &#x60;%print&#x60; intrinsic. This can only print integers and strings - the plan is to write a print function that uses reflection to print other types.
* Improved error messages for tokenizer and parser errors.
* Many many bugfixes.

It&#39;s funny that printing manages to exercise so many language features. Ideally it will look something like:

&#x60;&#x60;&#x60;routeros
print &#x3D; (thing) {
  thing&#x2F;repr-of&#x2F;match(
    (u32) %print(thing),
    (i64) %print(thing),
    (string) {
      %print(&#39;\&#39;&#39;)
      print-escaped(thing&#x2F;bytes)
      %print(&#39;\&#39;&#39;)
    },
    (struct[.._]) print-object(thing),
    (union[.._]) print-object(thing),
  )
}

print-escaped &#x3D; (thing) {
  lo mut &#x3D; 0
  hi mut &#x3D; 0
  while true {
    if {hi &gt;&#x3D; thing&#x2F;count} {
      %print(thing&#x2F;slice(lo, hi))
      break
    } 
    thing&#x2F;get(hi)&#x2F;escaped&#x2F;match(
      ([some: escaped]) {
        %print(thing&#x2F;slice(lo, hi))
        %print(escaped(byte))
        hi@ +&#x3D; 1
        lo@ &#x3D; hi
      }
      ([:none]) {
        hi@ +&#x3D; 1
      }
    }
  }
}

print-object &#x3D; (thing) {
  %print(&#39;[&#39;)
  need-comma mut &#x3D; false
  thing&#x2F;each((k,v) {
    if need-comma %print(&#39;, &#39;) else {}
    need-comma@ &#x3D; true
    print(k)
    %print(&#39;: &#39;)
    print(v)
  })
  %print(&#39;]&#39;)
}

&#x60;&#x60;&#x60;

But I don&#39;t yet have:

* &#x60;each&#x60; over structs&#x2F;unions
* Recursive functions
* Pattern matching (currently only infallible destructuring)
* Repr patterns
* Slice patterns (&#x60;..&#x60;)
* Ignore patterns (&#x60;_&#x60;)
* &#x60;bytes&#x60;, &#x60;get&#x60;, &#x60;count&#x60;
* Slices&#x2F;lists

I started working on &#x60;each&#x60; but it tipped my annoyance with my ir over the fixit threshold. 

All the compiler passes want data in the ir to be on the branch begin tags, so that they can make good decisions about how to handle children. But the interpreter wants data on the branch end tags so it can operate as a pure stack machine.

Type inference is also currently written as a stack machine to avoid the possibility of stack overflows from deep call trees. But this is increasingly difficult to work with eg if I want to do bidirectional tpye inference then I need two more stacks for passing types downwards and sideways. I originally wrote the codegen in this style but after rewriting it in recursive style the code was much more readable and flexible and I immediately spotted several bugs.

So I have two changes planned:

1. Store all ir in post-order (easier to generate and interpret), but convert to pre-order on the fly before the next pass (easier to process recursively). The conversion is extra work that I didn&#39;t need to do before, but it removes the need for the &#x60;indirect&#x60; trick that I was using in some passes and which has a similar cost.
2. Require top-level functions to have type annotations. This means that type-inference doesn&#39;t have to descend recursively from caller to callee, but can instead just use the callee&#39;s type annotation when inferring the caller&#39;s body, and queue the callee&#39;s body for type checking later. Then the size of the inference call stack is bounded by the nesting depth of the source code rather than by the depth of the call-graph, leaving me free to use recursive functions in inference instead of manually converting to a stack machine.

I think that will all fit into september, and probably still leave time to keep chipping away at the feature list for the print function.

## zest ordering

Zest has a split between data notation (numbers, strings, objects) and representation (u32, i64, utf8-string, struct, union, list, map). Objects are collections of key-value pairs. Structs, unions, lists, and maps are specialized representations of those objects. Eg lists can only represent objects where the keys are consecutive integers starting at 0.

One big design question is are objects **ordered** collections of key-value pairs or **unordered** collections of key-value pairs?

If order doesn&#39;t matter then we can choose the internal representation for structs that packs most efficiently. But the programmer can&#39;t control what order struct fields print in (because types are structural we can&#39;t store the field order in the type either, otherwise order would affect equality again).

If order doesn&#39;t matter than &#x60;f([a: 0, b: 1])&#x60; and &#x60;f([b: 1, a: 0])&#x60; generate the same specialization. If order does matter than those need to be two different specializations. But how often are struct types likely to collide like that?

If order does matter then iterating over a struct or map has clearly defined semantics (we can use [compact hashmaps](https:&#x2F;&#x2F;blog.toit.io&#x2F;hash-maps-that-dont-hate-you-1a96150b492a) to preserve insertion order). If order doesn&#39;t matter then we have to choose an order for iteration. Choosing hash order makes programs non-deterministic. Choosing sorted order imposes a big performance cost (we have to sort hashmaps, either on insert or on iteration).

If order does matter then does it affect equality too? If it doesn&#39;t, then we have observable differences between equal values, which is subtly weird. But if it does then &#x60;set[string][&#39;zero&#39;, &#39;one&#39;] !&#x3D; set[string][&#39;one&#39;, &#39;zero&#39;]&#x60;. That would also mean that &#x60;set[set[string]][[&#39;zero&#39;, &#39;one&#39;], [&#39;one&#39;, &#39;zero&#39;]]&#x60; has two elements, which is almost certainly going to be surprising. I don&#39;t plan to make the equality function used by maps&#x2F;sets&#x2F;etc parameterizable, so any code that wants non-ordered equality would have to sort collections before using them as keys.

Similarly, does ordering affect type conversions or pattern matching? Does &#x60;struct[a: i64, b: i64][b: 0, a: 1]&#x60; work? What about &#x60;[:a, :b] &#x3D; [b: 0, a: 1]&#x60;? Ergonomically, probably both conversions and patterns should ignore order, but that does introduce a subtle asymetry to patterns vs constructors. It also means that in &#x60;thing&#x2F;match(([:a, :b]) true, ([:b, :a]) false)&#x60; the second branch is unreachable, even though &#x60;[a: 0, b: 1] !&#x3D; [b: 1, a: 0]&#x60;. 

The decision tree looks something like:

* Order isn&#39;t observable at all.  
   * Iteration order is either non-deterministic or expensive.  
   * Determism can be manually recovered by storing both a map and a list of keys, but at the cost of storing two copies of each key.
* Order is observable.  
   * Order doesn&#39;t affect equality.  
         * Equality is not extensional ie &#x60;a &#x3D;&#x3D; b&#x60; does not imply that &#x60;f(a) &#x3D;&#x3D; f(b)&#x60;.  
         * If &#x60;[a: 0, b: 1] &#x3D;&#x3D; [b: 1, a: 0]&#x60; then we must have &#x60;struct[a: i64, b: i64] &#x3D;&#x3D; struct[b: i64, a: i64]&#x60;, but we still have to remember that the field order is different, which implies that type equality can&#39;t rely on interning and pointer comparison.  
   * Order affects equality.  
         * Sets become surprising &#x2F; less useful.  
         * If I want to add query planning, I can&#39;t promise that &#x60;f(db) &#x3D;&#x3D; optimize-query(f)(db)&#x60;.

## wasm alignment

I found the answer to my alignment questions. The spec says that the alignment given on load&#x2F;store instructions is a hint and the wasm backend is not allowed to trap if the hint is wrong. But if the backend can&#39;t trust the hint, does it have to just always emit fully unaligned loads&#x2F;stores? 

It turns out that the [intent](https:&#x2F;&#x2F;github.com&#x2F;WebAssembly&#x2F;design&#x2F;issues&#x2F;1319#issuecomment-568036111) is that the backend does emit aligned loads&#x2F;stores, but also installs a signal handler to handle incorrect hints by emulating the misaligned load&#x2F;store in software. The idea is that a bad hint still results in the same output on every platform, instead of working on x86 and faulting on arm. But it will potentially be many orders of magnitude slower.

Also wasm&#39;s atomic loads&#x2F;stores don&#39;t have the same behaviour - [they trap on misaligned addresses](https:&#x2F;&#x2F;github.com&#x2F;WebAssembly&#x2F;threads&#x2F;blob&#x2F;main&#x2F;proposals&#x2F;threads&#x2F;Overview.md#alignment).

So I do actually need to care about alignment in zest. Humbug.

## [compile-time analysis of compiler frameworks for query compilation](https:&#x2F;&#x2F;home.in.tum.de&#x2F;%7Eengelke&#x2F;pubs&#x2F;2403-cgo.pdf)

More details on the umbra query compiler and comparisons to other backends.

Their own backend has very impressive compile-time vs runtime tradeoffs. For tcp-h sf&#x3D;10 it&#39;s always faster than any of the other backends, and for tcp-h sf&#x3D;100 it&#39;s still sometimes the best choice.

Cranelift just barely dominates llvm debug builds. I&#39;m surprised that the compile times are so similar.

They see \~20% runtime improvement between llvm debug and release, whereas for zig&#x2F;rust I often see 2-10x difference. That makes me suspect that the ir they are emitting is already pretty good, with few abstractions to boil off, in which case adapting their compilation strategy for zig&#x2F;rust might not see such impressive results. Or alternatively maybe their queries are mostly memory-bound, so suboptimal codegen gets hidden in the stalls?

## [robust join processing wit diamond hardened joins](https:&#x2F;&#x2F;db.in.tum.de&#x2F;%7Ebirler&#x2F;papers&#x2F;diamond.pdf)

The umbra folks have previously noted that their best implementation of worst-case optimal joins is still much slower than a regular binary join in the average case, and it&#39;s also hard to give them a cost function during plannig.

Even Yannakakis algorithm (which is only worst-case optimal for acyclic queries) can vary in performance depending on the join order chosen, which implies that cost-based optimization is still important.

If we go back to classic binary join planning, it&#39;s hard to decide whether it&#39;s better to push a join down the tree (good if it produces less output than input) or hoist it up the tree (good if it produces more output than input). So they split the probe side of a join into two [suboperators](https:&#x2F;&#x2F;www.scattered-thoughts.net&#x2F;log&#x2F;0046#suboperators). &#x60;lookup&#x60; returns the matching bucket in the hashtable (like the way a wcoj will find a range of matching attributes) and &#x60;expand&#x60; returns all the rows in that bucket. When lookup and expand are next to each other this behaves like a regular join, but the optimizer is free to push lookups down and hoist the expands up, because lookups nevr produce more output than input and expands never produce less output than input.

This is already enough flexibility for the query optimizer to produce a Yannakakis-like plan, while still being subject to the full flexibility of cost-based optimization.

Adding a ternary expand operator allows them to do wcoj on three relations at a time, which they prove is sufficient to be worst-case optimal on any cyclic queries with only binary edges (ie most graph queries). 

They additionally cut down duplicate values by eagerly aggregating on the build side of joins.

For outer joins, they make lookup produces the nulls, allowing the expand to be pushed up.

To avoid blowing up the number of possible plans, they limit the optimizer to choosing the lookup tree and then place each expand at the highest branch possible, taking note of equivalence classes of attributes to avoid early expands, and introducing expand3 whenever a lookup closes a cycle in the query graph.

On the build side, they build the hash-tables in order of ascending (predicted) size and then use bloom filters to filter later tables, avoiding building hash tables for rows that can never be emitted anyway.

Weirdly the evaluation also covers their [previous paper](https:&#x2F;&#x2F;dl.acm.org&#x2F;doi&#x2F;pdf&#x2F;10.1145&#x2F;3662010.3663442) on hashtables, and most of the benefits come from that change. So, uh, maybe I&#39;ll read that paper next month. The lookup&#x2F;expand separation reins in some of the gnarlier cyclic queries, while the eager aggregation mostly benefits acyclic queries.

## [the future of fast code](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;vU3ryvZYlkk)

For a given amount of silicon we can make one fast-ish out-of-order core or a bazillion dumb cores. Most consumer computers contain examples of both, but we&#39;ve barely invested any effort in programming models for the latter. For suitable problems the difference in performance can be many orders of magnitude.

When writing eg c the programmer is responsible for safety and the compiler takes a lot of responsibility for optimization. They describe several research projects where they flip those tradeoffs, creating dsls where the programmer can specify optimizations to apply and the compiler checks that those optimizations don&#39;t change the result of the program.

## [the new internet](https:&#x2F;&#x2F;tailscale.com&#x2F;blog&#x2F;new-internet)

&gt; Even a mid-range Macbook can do 10x or 100x more transactions per second on its SSD than a supposedly fast cloud local disk, because cloud providers sell that disk to 10 or 100 people at once while charging you full price. Why would you pay exorbitant fees instead of hosting your mission-critical website on your super fast Macbook?

&gt; You pay exorbitant rents to cloud providers for their computing power because your own computer isn&#39;t in the right place to be a decent server. It&#39;s behind a firewall and a NAT and a dynamic IP address and probably an asymmetric network link that drops out just often enough to make you nervous.

They wanted to make software development in general simpler, and decided that the root problem was centralization caused by us accidentally making it impossible to do p2p connections over the internet. So they made tailscale which handles nat traversal and peer certificates etc.

I don&#39;t think that aws wouldn&#39;t exist if p2p connections were easy. But this does seem very applicable to [barefoot developers](https:&#x2F;&#x2F;maggieappleton.com&#x2F;home-cooked-software) and [situated software](https:&#x2F;&#x2F;gwern.net&#x2F;doc&#x2F;technology&#x2F;2004-03-30-shirky-situatedsoftware.html). Anything that is serving a small and specific community could easily be running on a mac mini in a cupboard, if it was possible to connect to it.

## books

[The age of insecurity](https:&#x2F;&#x2F;www.goodreads.com&#x2F;book&#x2F;show&#x2F;126240590-the-age-of-insecurity). I found it agreeable, but it&#39;s much more of an rallying cry than a detailed thought. A interesting points though:

* Of the universal human rights, shelter is the only one where governments celebrate the cost going up rather than down. Noone would get elected by promising that food prices will go up.
* When covid relief gave people a few months of savings, that was enough margin for many to change jobs or demand better salaries. Governments responded to this &#39;overheated labour market&#39; by inflating away those savings.

[Peak mind](https:&#x2F;&#x2F;www.goodreads.com&#x2F;book&#x2F;show&#x2F;55200359-peak-mind). Could have been a blog post.

[The hard truth](https:&#x2F;&#x2F;www.goodreads.com&#x2F;book&#x2F;show&#x2F;54678196-the-hard-truth). Literally just a series of blog posts, and often contradicts itself to boot.

[Space below my feet](https:&#x2F;&#x2F;www.goodreads.com&#x2F;book&#x2F;show&#x2F;28150991-space-below-my-feet). Mixed feelings. I loved the adventure stories at the start, and I&#39;m blown away by the kinds of climbs they pulled of with just a hemp rope on hip belay. But the latter two thirds of the book is mostly about how miserable mountaineering is. It seems to be all getting lost, benighted, frostbitten, and barely suriving sketchy glissades. I&#39;m sure Gwen loved something about it, but it doesn&#39;t come through at all.

## other stuff

Wasm has a [can I use -style page](https:&#x2F;&#x2F;webassembly.org&#x2F;features&#x2F;). For more detail on upcoming features, I discovered that subscribing to the [meetings repo](https:&#x2F;&#x2F;github.com&#x2F;WebAssembly&#x2F;meetings&#x2F;) is pretty useful. Eg I discovered that [stack-switching](https:&#x2F;&#x2F;github.com&#x2F;WebAssembly&#x2F;stack-switching) is headed for stage 2 now but not likely to hit stage 3 until some time next year. Which means that it likely won&#39;t be widely supported for at least another two years, in the best case.

Spidermonkey has a [neat bytecode encoding](https:&#x2F;&#x2F;webkit.org&#x2F;blog&#x2F;9329&#x2F;a-new-bytecode-format-for-javascriptcore&#x2F;). Rather than making each operand variable-width, they switch between 1 byte operands and 4 byte operands per op. Whenever an op uses 4 byte operands it is preceded by a one-byte &#x60;op_wide&#x60; tag. This occasionally costs more memory but it makes decoding much simpler - for each op, they generate one handler for narrow operands and one handler for wide operands. Much less branchy.

Zig [gained a fuzzer](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;issues&#x2F;20702). I&#39;m not sold on the benefits of writing a fuzzer from scratch, as opposed to providing the same coverage info that llvm provides for libfuzzer&#x2F;honggfuzz. But the surrounding tooling is nice.

Gibbon is a language that operates on mostly-serialized data. It has a [neat trick](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;8Glj9HUgkxo) for dealing with code that is hard to serialize - it emits an indirection tag (similar to what I&#39;m using in zest ir) when necessary, but when the garbage collector copies values it undoes the indirection and produces fully-serialized data.

I finally got around to watching [this classic talk](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;LIb3L4vKZ7U) on composable allocators. It didn&#39;t end up begin useful for writing the zest allocator, but I still enjoyed it.

Google [added pipe syntax](https:&#x2F;&#x2F;research.google&#x2F;pubs&#x2F;sql-has-problems-we-can-fix-them-pipe-syntax-in-sql&#x2F;) to their sql dialect. This is definitely a big improvement. They also claim that it removes the need for subqueries, but I disagree. Queries like &#x60;newest 10 employees per department&#x60; are still awkward in sql-plus-pipes, whereas in prql which has sane subqueries they&#39;re straightforward:

&#x60;&#x60;&#x60;routeros
from employees
group department (
  sort join_date
  take 10
)

&#x60;&#x60;&#x60;