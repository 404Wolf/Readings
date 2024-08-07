---
id: a2cd9072-f6f0-11ee-b82a-0f9b146e139c
title: How I use LLMs to program | Probably Dance
tags:
  - RSS
date_published: 2024-04-10 00:06:28
---

# How I use LLMs to program | Probably Dance
#Omnivore

[Read on Omnivore](https://omnivore.app/me/how-i-use-ll-ms-to-program-probably-dance-18ec635a351)
[Read Original](https://probablydance.com/2024/04/09/how-i-use-llms-to-program/)



#### by Malte Skarupke

[Studies have shown](https:&#x2F;&#x2F;www.businessinsider.com&#x2F;ai-productivity-boost-job-performance-inequality-economics-2023-11?op&#x3D;1) that LLMs help novice programmers more than experienced programmers. This matches my experience. At work I see that interns or new hires have some LLM window open almost all the time. I use them maybe once a week. But you could say the same thing about Stack Overflow. I used it all the time when I started programming. Now I use it occasionally. While it’s easy to point at their obvious issues, I think they are also clearly a net-positive on average. So how do LLMs help me?

## Big plus: Languages that I don’t use as often

I don’t often write SQL statements. I can obviously write the simple ones, but SQL is a language that has all the features you could ever possibly want, and I don’t know how to use them and don’t know how to google for them. So I ask a LLM. Similarly for javascript&#x2F;css&#x2F;html programming. I used to hate doing web frontend work, now it’s not so bad because LLMs can help me get out of the tricky edge cases.

I have also used LLMs to translate functionality from one language to another. E.g. if I know what a function is called in C++ but I can’t find an equivalent one in the standard library of another language, an LLM will often do a decent first pass of rewriting the C++ function in the other language.

## Small minus: The code is overly generic

LLMs should probably ask for more information more often. At the moment they’re a highly motivated programmer who doesn’t know enough but who can provide you with a piece of code that should work in most contexts. It won’t tell you that though, it’ll pretend that it gave you a good solution.

So for example when I ask it “I have this complicated SQL statement but I need to bring in information from one more table” it’ll give me back a nested select statement. I have to prompt it again and ask “isn’t there a way to do this with a join?” before it tells me that there is a kind of JOIN statement that does exactly what I want. Similarly for javascript it likes to just register global callbacks that listen to every mouseenter event on any element in the page.

This works fine for most languages. It leads to problems in strict languages like Rust. When someone asks me for help in LLM-assisted Rust code, usually we first have to ask “but what is this actually trying to do” a few times to undo the unnecessary genericness (RefCell) of the LLM code.

It also is going to lead to problems in the long term where you have a lot of code that’s overly broad. When you have too many pieces of code that register broad callbacks “just in case” or do nested SQL statements “just in case” you can’t build a mental model of what actually happens in your code base.

## Neutral: It can fix its own mistakes

One thing I keep on forgetting to do is to ask it to fix its own mistakes. After writing the above, I realized I could just ask it how to avoid the global javascript callbacks. It told me about “mutation observers,” which are a kind of global observer that allow me to attach my other observers to only the nodes that I want. Which is better, maybe?

In general I find that you can ask it a few times “this part bothers me, can you do it better?” to get better quality. I wish it just did this on its own, but it is good that it’s happy to rewrite it for you as often as you ask. (though if you ask three times and there is no improvement, that means the LLM just can’t do what you’re asking)

## Big plus: It can help you get unstuck

LLMs are undaunted. You can ask them any tricky question and they’ll provide an answer. Sometimes the answer is not bad and you immediately see how to make progress. Often the answer is pretty bad, but that doesn’t mean it’s useless. It still helps in at least two ways:

* Rubber duck debugging. LLMs are pretty good for this. Often it helps me to just explain the problem, because it forces me to actually clearly state the problem. Also if the LLM comes back with an answer that’s totally unrelated, I have to go back and be even more clear. And then once I can clearly state the problem, the solution sometimes presents itself.
* They provide another perspective. It’s not always a great perspective, but when you’re solving tricky problems you have to look at them from [different angles](https:&#x2F;&#x2F;probablydance.com&#x2F;2017&#x2F;09&#x2F;02&#x2F;collected-advice-for-doing-scientific-research&#x2F;), and LLMs are great at providing more angles. Even if I don’t go with any of the ideas that the LLM provided, it often helps me think of a good approach. I especially appreciate when the LLM provides me with something that’s simpler than what I thought of, which it does surprisingly often.

## Small minus: It does not hold back even when producing garbage

E.g. there is this infamous example:

This is mostly nonsense where they wrote something that is much too complicated and then used AI to do… something with it. Any experienced programmer would have stopped halfway through writing this and thought “no, this is getting too messy, there must be another way.” But an AI will happily write this for you, and then you have to unhappily live with it.

## Big plus: It knows all algorithms and libraries

Even the first early version of ChatGPT, which produced terrible code, was impressive when it came to one area: It understood what you wanted in a way that no search engine could. LLMs have only gotten better there. I love that I can ask “I have a problem that’s shaped like this and it feels like there should be a data structure or algorithm that could help here” and it’ll understand what I want and point me towards relevant algorithms. The first answer is almost never what I want, but I also love that I can have a conversation. It usually goes like this:

&gt; me: I have the following problem: … What algorithm or data structure can help with that?
&gt; 
&gt; LLM: Have you considered X or Y?
&gt; 
&gt; me: Well yes, obviously those are the first things I thought of, but they don’t work because of this part of the problem that I just told you about.
&gt; 
&gt; LLM: Oh I’m so sorry, you’re right. How about Z then?
&gt; 
&gt; me: I had heard about Z before but don’t really know about it. I thought it had the following problem: …?
&gt; 
&gt; LLM: Oh that can be overcome by doing Z\* or with this other approach

And back and forth like that a few times. I love that it just knows this stuff and can point me at all the interesting things that exist. I also love that sometimes the first answer is “no there is no good algorithm here because this is actually really hard and you probably want to just go with this simple, partial solution that’s at least easy to understand.”

## Small minus: It read the experts but it’s not an expert itself

For any algorithm there is the [simple straightforward thing](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Binary%5Fheap) that everyone uses, then there is [slightly more complicated](https:&#x2F;&#x2F;probablydance.com&#x2F;2020&#x2F;08&#x2F;31&#x2F;on-modern-hardware-the-min-max-heap-beats-a-binary-heap&#x2F;) solution that is useful sometimes, and then there are a dozen [really complicated solutions](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Fibonacci%5Fheap) that only exist because someone needed to publish a paper and they found one specialized benchmark where their solution artificially looks good. Nobody actually uses them.

Much of the value of experts is that they can tell you which things you have to pay attention to and which things you can safely ignore. LLMs can not be trusted when it comes to that. They will believe the claims of the paper authors and confidently tell you all the benefits that certain methods have. If you believe the LLM, you’ll have to spend a lot of time, possibly days, rediscovering all the reasons why nobody is using this algorithm in practice.

The LLM makes this mistake in all directions. It will never tell you “I don’t know” or “I’m not confident.” Instead it will tell you confidently that the simple solution is good when you should use something more complicated, and it will also confidently tell you that the complicated solution is good when you should never be using it. You just have to take that into account.

## Big plus: It’s competent for simple tasks

This is obvious but it’s worth pointing out. The output of LLMs is usually high quality. If you ask it to explain, say “how do heat pumps work?” and maybe ask some follow up question, it’ll do a better job than 99% of the population. This is also true of code. Of course most of the population doesn’t program so that 99% number is irrelevant, but for simple problems it does a better job than many professional programmers would. Sure, there will be bugs and you may have to adapt the code (depending on how you asked) but it’ll be competent. LLMs would pass coding interviews.

And while I could usually nitpick and find improvements, there are a lot of places where you have to solve the kinds of simple problems that LLMs are good at solving, and where it’s fine to use code at LLM quality, unmodified.

## Small minus: I have no idea how to use LLMs for maintenance

Unfortunately I don’t spend most of my days writing code. I spend most of my days maintaining code. Meaning debugging and refactoring and adding small features to existing programs. LLMs just don’t fit into that. Maybe that’s just expected because it’s “generative AI” and if I don’t need to generate much code, it can’t help.

It sure would be nice though if I could point it at a directory of files and say “I need to change the following types, which will change some interfaces. Can you update all necessary files and point out any place where I need to pay attention?” But I currently would have no confidence that it would do a good job at that.

## You need to be more of a critic, editor and reviewer

So when you use LLMs to generate new code, you mostly need to be a critic with good taste. You need to know when the quality of the LLM is appropriate. When is it OK to use overly generic code? Can you voice what bothers you and ask it to do better? Usually you have to ask the question “but what do we actually need to do here” a few times.

When you ask for advice on algorithms, the LLM will enthusiastically tell you that something is a great idea, and when you tell it that it’s not, it will enthusiastically tell you that you’re right and that it was a terrible idea. So you can’t rely on it for critical thinking. You can only use it to enumerate options.

When working with junior devs who use LLMs, code review is slightly easier because on average they write better code, but there are new failure modes. They don’t have the necessary experience to know when to accept the output of the LLM and when to doubt it. You need to watch out even more for code that was written without a mental model of how the existing code works.

On average LLMs are a clear positive. They’re not good enough yet where they’ll make you hugely more productive, but they’re already good enough where you’d miss out if you weren’t at least using them occasionally. Use one of the paid options, they’re much better than the free options. I hear Claude Opus is currently best. (I haven’t done comparisons) You just have to get experience with where they’re good and where they’re bad, and I’m hoping that sharing my experience can help you with that.