---
id: c8e1c96e-eb05-11ee-b541-b711f079e64f
title: Recurse Center, day 1 | CCEckman.com
tags:
  - RSS
date_published: 2024-03-25 18:00:55
---

# Recurse Center, day 1 | CCEckman.com
#Omnivore

[Read on Omnivore](https://omnivore.app/me/recurse-center-day-1-cc-eckman-com-18e781b949c)
[Read Original](https://cceckman.com/writing/recurse-day-1/)



I left my job two weeks ago. Since then, I’ve been spending less time on the computer, more time with the cats.

But not _no_ time on the computer. Stephen and I put together[Fractal Overdrive](https:&#x2F;&#x2F;github.com&#x2F;cceckman&#x2F;fractal-farlands&#x2F;), rendering fractals incorrectly for aesthetic effect, as a[SIGBOVIK](https:&#x2F;&#x2F;sigbovik.org&#x2F;2024&#x2F;) submission; and I made it through the easy half of addressing a bug in [sccache](https:&#x2F;&#x2F;github.com&#x2F;mozilla&#x2F;sccache&#x2F;issues&#x2F;2132).

And now: today was my first day at [the Recurse Center](https:&#x2F;&#x2F;recurse.com&#x2F;).

## Known unknowns

I’ve got some things I know I want to work on.

### You are here

I want to write more. (Yes, that makes this the “sorry this blog has been so quiet” post.)

Along with that, I want to tweak how I build &#x2F; host &#x2F; serve this site. But working on _tools and infrastructure_ is too much fun, so I have to give myself a budget: no more time working on _serving_ than on _writing_. I only get quota once the post goes public– drafts don’t count!

### Lock termination checker

In my last job, we dealt with preemption-disabled code regions and locks. We relied on code review to check that the program would eventually reenable preemtion &#x2F; release the lock – a human check.

I’d like to make something that can verify this property _in situ_– something lighter than “formally specify the whole thing”, more like[LLVM’s thread safety analyzer](https:&#x2F;&#x2F;clang.llvm.org&#x2F;docs&#x2F;ThreadSafetyAnalysis.html).

The comment I’ve received more than once about this: “Isn’t that the halting problem?” Which, almost, it’s related. But think about how the same conversation goes with human reasoning:

&gt; **Alice:** Hey, can you take a look at this code? Will this function terminate?
&gt; 
&gt; **Bob:** _thinks_
&gt; 
&gt; **Alice:** …you’ve been quiet for five minutes. Any luck?
&gt; 
&gt; **Bob:** Well… there is a loop here, and I can’t figure out whether the condition that bounds it will necessarily become true. So I don’t know.

Our checker has the option to say “I don’t know”: “I don’t have enough information”, or “I don’t have enough time”, or “I don’t have an algorithm to solve this”. The feedback here is for humans, who can decide whether “I don’t know” is a problem with the checker or the subject.

I think my first step in this will be going through[llvm-tutor](https:&#x2F;&#x2F;github.com&#x2F;banach-space&#x2F;llvm-tutor); and maybe stepping slightly out of that, to render the control-flow graph in [dot](https:&#x2F;&#x2F;graphviz.org&#x2F;). (Or maybe [something else](https:&#x2F;&#x2F;text-to-diagram.com&#x2F;), per a tip from[my batchmate Zach](https:&#x2F;&#x2F;lippingoff.netlify.app&#x2F;).)

Then the easy version, “always say I don’t know”; the slightly more complex version, “If the basic blocks form a DAG, say ’terminates’”; and then…

### Verification? Symbolic execution? Type systems?

In “watching for that stuff in the background”, I’ve seen some more things I want to learn about.

* Formal methods and verification. It sounds like several of my batchmates have experimence and&#x2F;or interest in this; I’m looking forward to learning from and with them.
* Symbolic execution. I read the [KLEE](https:&#x2F;&#x2F;klee-se.org&#x2F;) paper a while back, but haven’t used it. What can it do?
* Type systems. Random stuff I’ve read indicates what I might be trying to do is create (apply? identify?) a[nondivergence effect](https:&#x2F;&#x2F;blog.yoshuawuyts.com&#x2F;extending-rusts-effect-system&#x2F;), also discussed [here](https:&#x2F;&#x2F;www.fstar-lang.org&#x2F;tutorial&#x2F;book&#x2F;part4&#x2F;part4%5Fdiv.html). Maybe I should play around with an effect-oriented language and see what I learn from it?

### Statup showdown

I’ve started some experiments, trying to determine which languages take the longest to get to “my code”. I have that chart - then the question is,_why_ do they have these different properties?

The other side of this question: what tools can I use to debug performance, especially where the kernel is involved? What knobs do I have to change the performance, especially when most of the system (language runtime) is outside of my control?

## Unknown unknowns

One of the points that’s been reinforced during the RC orientation is being open to opportunities. There’s a lot of interesting projects &#x2F; areas that folks are or are starting to work on… and I know I’ve got a lot to learn about a lot of things.

So…maybe I’ll port Fractal Overdrive to WGPU? Or start something in the Godot engine? Or… just see what else folks need a partner on.