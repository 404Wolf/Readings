---
id: 3cf57bd0-e8cb-11ee-88fb-8f408ca4ecf4
title: "gcc -wtf: Optimizing my Ray Tracer, Part I - Jake's Blog"
tags:
  - RSS
date_published: 2024-03-23 00:01:41
---

# gcc -wtf: Optimizing my Ray Tracer, Part I - Jake's Blog
#Omnivore

[Read on Omnivore](https://omnivore.app/me/gcc-wtf-optimizing-my-ray-tracer-part-i-jake-s-blog-18e69806eaa)
[Read Original](https://www.jakef.science/posts/gcc-wtf/)



Inspired by others at the Recurse Center, I recently built a ray tracer by working through the excellent book _[Ray Tracing in a Weekend](https:&#x2F;&#x2F;raytracing.github.io&#x2F;books&#x2F;RayTracingInOneWeekend.html)_. I’ve been learning C and was attracted to this project because it was complex enough to be interesting but small enough to be time-constrained (my implementation is \~1,000 lines of code); there’s minimal dependencies so I can focus on learning C instead of learning APIs; and the end result is a pretty picture:

![cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,spvnfz8qZgHjm-3z9jCjiI0Ix5y_FF3FCVeQcWzjN8d0&#x2F;https:&#x2F;&#x2F;www.jakef.science&#x2F;posts&#x2F;gcc-wtf&#x2F;cover.png)

_Cover image of Ray Tracing in a Weekend, rendered by my implementation._

I was excited to create this magical, photorealistic image but was completely surprised at how _slow_ my program was. Rendering this image required 3+ hours of wall-clock time on my fancy new MacBook Pro.

I didn’t know what to expect, but that sure felt slow. I wanted to make it faster. I pair programmed with a couple people and they quickly pointed out a very simple solution: I was not passing any optimization level flags to the compiler. We added &#x60;-O2&#x60; to my &#x60;Makefile&#x60;, and my program was suddenly 15x faster.

This **shocked** me! The computer _knew_. It knew its default behavior was slow and shitty and it had a literal “make it go faster” button. What was it _doing_? I had a mental model of how my C code translated into low-level CPU operations, and I did not understand how something as seemingly benign as a compiler flag could make such a huge difference. I wanted to understand. I did some googling, and chatGPT’ing, and found vague answers referring to inlining and loop unrolling but I didn’t have a strong intuition for how much that mattered or how they applied to my program. I found [a list](https:&#x2F;&#x2F;gcc.gnu.org&#x2F;onlinedocs&#x2F;gcc&#x2F;Optimize-Options.html) of the \~50 flags that go into each optimization level, and I iteratively benchmarked my code with each flag turned on or off, but it didn’t replicate the overall speedup (and I [later read](https:&#x2F;&#x2F;stackoverflow.com&#x2F;questions&#x2F;60386091&#x2F;what-exactly-is-the-difference-between-various-optimization-levels-in-gcc-g) that those flags only make up a subset of what &#x60;-O2&#x60; does).

So I took things into my own hands. The first thing I did was look at my program’s disassembly:

&#x60;&#x60;&#x60;1c
objdump -d my_ray_tracer | less
&#x60;&#x60;&#x60;

The optimized version was \~2200 lines of assembly while the unoptimized was \~3500\. 60% less code is significant! But also not 15x. So I opened it up and tried to read what it said.

Unfortunately for me, I had never looked at arm64 assembly before. I felt I had a reasonable grasp of assembly because I’d recently spent 150 hours working through a binary reverse engineering CTF ([microcorruption](https:&#x2F;&#x2F;microcorruption.com&#x2F;), it’s the best), but this was foreign. I tried reading documentation but quickly got bored, so I instead took another cue from microcorruption and began to interact with my program dynamically. I opened it up in &#x60;lldb&#x60;, a &#x60;gdb&#x60;\-like debugger for Mac. Microcorruption’s UI was such an effective learning tool that I wanted to replicate it, and I luckily found [lldbinit](https:&#x2F;&#x2F;github.com&#x2F;gdbinit&#x2F;lldbinit), an &#x60;lldb&#x60; extension that gives you a view of the disassembly, the original source code (if you compile with debugging symbols), and the registers. As you step through instruction-by-instruction, you can see which registers change and how.

![lldbinit](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sfSR-gm4zmIyCEuC6TEYs1iAYYhsYBPsoX3RT5LorU6Q&#x2F;https:&#x2F;&#x2F;www.jakef.science&#x2F;posts&#x2F;gcc-wtf&#x2F;lldbinit.png) _Snapshot of &#x60;lldbinit&#x60;, showing the registers, stack memory, and disassembly._

I first focused on the smallest functions in my program, simple things that multiply or subtract vectors, and stepped through the debugger for both versions. I expected these functions to purely consist of math operations, but the unoptimized version was inundated with load and store instructions. I wasn’t sure if this was widespread, or if these functions were called ten times or a billion times. I needed to collect more data.

Luckily, &#x60;lldb&#x60; is completely scriptable. You can write Python code to plug into a [broad swath of its functionality](https:&#x2F;&#x2F;lldb.llvm.org&#x2F;use&#x2F;python-reference.html). So I googled some more and copied some example code and made a plugin that logged every executed instruction to a file. I set breakpoints around the innermost loop of my ray tracer, propagated a handful of rays in the optimized and unoptimized versions, and made a histogram of the output.

![instruction_count](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sFkEByMCQabfqDFm45jYBNroL9Q46LWgFQpYODfoKED0&#x2F;https:&#x2F;&#x2F;www.jakef.science&#x2F;posts&#x2F;gcc-wtf&#x2F;instruction_count.png) _Y-axis shows instruction, X-axis shows # of executions during 5 iterations of the innermost loop. The unoptimized version is in blue, orange is the same code compiled with &#x60;-O2&#x60;._

It turned out the unoptimized version was _mostly_ doing loads and store operations (&#x60;ldr&#x60;, &#x60;ldur&#x60;, &#x60;str&#x60;, &#x60;stur&#x60;), 10x more frequently than the optimized version. When I looked back at the disassembly, I could see this happening everywhere—at the beginning and end of function calls, in between arithmetic operations, seemingly for no reason. Similarly, instructions associated with function calls (&#x60;b&#x60;, &#x60;bl&#x60;, &#x60;ret&#x60;) were 10x more frequent in the unoptimized version. While I knew “function inlining” was a thing and it made programs faster, I was surprised by the sheer proportion of instructions that were apparently filler.

Some instructions were _more_ common in the optimized version. I’m not sure why the optimized version is doing more floating-point math, but the higher prevalence of &#x60;ldp&#x60; instructions looked like a small win: instead of loading one value at a time, this instruction loads two values into a pair of registers at once.

With this high-level understanding, I could now make more sense of the assembly. At a high-level, my ray tracer has four nested for-loops. The innermost loop, a short math routine to calculate whether a ray hits a sphere, is executed a trillion times and dominates the run time. This is what it looks like in C:

| 1  2  3  4  5  6  7  8  9 10 11 12 | point3\_t center &#x3D; sphere\-&gt;center; double radius &#x3D; sphere\-&gt;radius; vec3\_t a\_c &#x3D; subtract(r-&gt;origin, center); double a &#x3D; length\_squared(&amp;r-&gt;direction); double half\_b &#x3D; dot(r-&gt;direction, a\_c); double c &#x3D; length\_squared(&amp;a\_c) - radius\*radius; double discriminant &#x3D; half\_b\*half\_b - a\*c; if (discriminant &lt; 0) {   return false; } else {    &#x2F;&#x2F; do stuff } |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

Here is the disassembly (arm64, intel syntex) after compiling it with &#x60;-O2&#x60;:

| 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 | ldp     d25, d22, \[x13, #-40\]! ldp     d23, d24, \[x13, #16\] fsub    d19, d1, d25 fsub    d27, d2, d22 fsub    d28, d4, d23 fmul    d26, d27, d6 fmadd   d26, d5, d19, d26 fmadd   d26, d0, d28, d26 fmul    d27, d27, d27 fmadd   d19, d19, d19, d27 fmadd   d19, d28, d28, d19 fmsub   d19, d24, d24, d19 fmul    d19, d19, d16 fmadd   d19, d26, d26, d19 fcmp    d19, #0.0 b.mi    0x1000033c0 &lt;\_ray\_color+0x88\&gt; |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

To get oriented I’ve highlighted the subtract call in both. This assembly is roughly how I imagined my C code was being executed: we load the sphere’s coordinates into registers (&#x60;ldp&#x60;), and we start subtracting and multiplying those registers (&#x60;fsub&#x60;, &#x60;fmul&#x60;). Great.

However, here is a snippet of assembly after compiling the same C code _without_ optimization (the &#x60;subtract()&#x60; function call is again highlighted):

| 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 | sub     sp, sp, #288 stp     x20, x19, \[sp, #256\] stp     x29, x30, \[sp, #272\] add     x29, sp, #272 stur    x0, \[x29, #\-32\] stur    x1, \[x29, #\-40\] stur    x2, \[x29, #\-48\] stur    x3, \[x29, #\-56\] ldur    x8, \[x29, #\-32\] ldr     q0, \[x8\] ldr     x8, \[x8, #16\] stur    x8, \[x29, #\-64\] stur    q0, \[x29, #\-80\] ldur    x8, \[x29, #\-32\] ldr     d0, \[x8, #24\] stur    d0, \[x29, #\-88\] ldur    x8, \[x29, #\-40\] ldr     d2, \[x8, #16\] ldr     d1, \[x8, #8\] ldr     d0, \[x8\] ldur    d5, \[x29, #\-64\] ldur    d4, \[x29, #\-72\] ldur    d3, \[x29, #\-80\] bl      0x1000018dc &lt;\_subtract&gt; stur    d2, \[x29, #\-96\] stur    d1, \[x29, #\-104\] stur    d0, \[x29, #\-112\] ldur    x8, \[x29, #\-40\] add     x0, x8, #24 bl      0x1000017f8 &lt;\_length\_squared&gt; ; ...much more code below here... |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

This is a mess! While the optimized version required 16 instructions for the entire routine, this version takes 24 just to get to the subtract call. Before that we see a function prologue, a series of loads and stores of certain registers. Inlining optimizes all of this away. Then there are more loads and stores until finally the subtract function is called (not inlined, so it will have its _own_ function prologue, etc.). And most interestingly, in between each operation (&#x60;subtract(), &#x60;length\_squared()\&#x60;) it stores the result to memory and loads the next value, which will be slow. When the compiler optimizes, it somehow identifies the most-used variables and keeps them in registers, avoiding unnecessary memory reads&#x2F;writes.

I later learned that &#x60;clang&#x60; is happy to tell you all about the optimizations it does if you pass it the flags &#x60;-Rpass&#x3D;.*&#x60; and &#x60;-fsave-optimization-record&#x3D;yaml&#x60;. But this investigation gave me a much stronger intuition for what these optimizations do and why they work. And it also gave me ideas for more speed-ups: I know SIMD is a thing, but I don’t see it being used here (except perhaps the &#x60;ldp&#x60; instruction to load a pair of values?).

Can we use SIMD to make this go faster?