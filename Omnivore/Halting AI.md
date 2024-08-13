---
id: 88c6e170-e155-11ee-8533-371a234a2517
title: Halting AI
tags:
  - RSS
date_published: 2024-03-13 00:00:00
---

# Halting AI
#Omnivore

[Read on Omnivore](https://omnivore.app/me/halting-ai-18e389d02df)
[Read Original](https://www.evalapply.org/posts/halting-ai/index.html)



Halting AI

↑ [menu](#site-header) ↓ [discuss](#blog-post-footer) 

The current wave of AI tools is incredibly cool. I hope more people get distracted by the incredible coolness and bet on this wave of AI, because I&#39;m betting the other way, on the hot mess of human general intelligence.

---

This riff [1](#fn1) derives from a recent _&quot;AI Programmer&quot;_ story that&#39;s making people in my corner of the nerdiverse sit up and talk, at a time when hot new AI happenings have become mundane.

Recently HackerNews front-paged the announcement of a [Devin AI](https:&#x2F;&#x2F;twitter.com&#x2F;cognition%5Flabs&#x2F;status&#x2F;1767548763134964000). Earlier today m&#39;colleague remarked that he is on the wait list to use the Devin to get a bunch of his side projects done.

It is yet another prompt for me to take the lowkey counterfactual bet against the AI wave, in favour of good old flesh and blood humans, and our chaotic, messy systems. What follows will make no sense to an LLM (because it is not a sense-maker) and it will feel nothing (because it is not a sense-maker). So if it riles _you_ up, congratulations, you are a living, breathing person.

Most line-of-business coding — all that grunt work of coding features, configurations, bug fixes etc. is &quot;side project&quot; sized and shaped. Big tasks are made of many little tasks. The bet is AI Programmers will do this for us, and with sufficient task breakdown, some lightweight supervision and clever prompting do the labour of a hundred men [2](#fn2).

Now, if we assume any programming team can get their hands on shiny new Dev-in tools (haha, see what I did there?) to make that work easy, then all of them ought to be able to level up against each other. If the Invisible Hand does its job, competition will be fierce (like, a prompt engineering arms race?) because only the undifferentiated _have_ to compete. Assuming this happens (as the AI bettors definitely believe), what will set a person or team apart from any other similarly-abled AI tool user? I think it will be, that the infusion of AI grunt work tools will loft and liven the essential role of the wetware in our skulls, and the squishy feelings in our guts. It remains to be seen what kind of history we choose to create.

&gt; “Once men turned their thinking over to machines in the hope that this would set them free. But that only permitted other men with machines to enslave them.”
&gt; 
&gt; — Frank Herbert, Dune

Further (and not to pick on the Devin specifically), the numbers they publish are telling. Their claimed \~14% SWE-benchmark task completion looks much better than the field. But, _one_, it is in the confines of the SWE-benchmark game, and we all know how well mouse models generalise to human models. And, _two_, even if it gets to 95% on that artificial benchmark (which I highly doubt, because, complexity explosion would demand insane amounts of energy and horsepower), it will still not be good enough. An automated software system that is &quot;works 90% of the time according to mouse models&quot; will require humans in the loop at all times to check the work. The more complex the work, the harder it will be to exercise reasonable oversight. If your error margins are forgiving enough, you could remove the humans. Maybe bog standard SaaS products are a juicy target for AI programmers, if the economics and error&#x2F;failure margins stay as big and forgiving as they are (\~90% gross margins are nothing to sneeze at). Will that moat remain, if means of production become far cheaper than human pay cheques, thereby lowering the bar to participate, thereby spreading those juicy margins out thin?

Now I&#39;m no analysis whiz, but aren&#39;t claims about accuracy suspect sans error bars and confidence intervals? As far as I can tell these systems can never provide that information _by construction_. Maybe one can mitigate error probabilities with a form of statistical sampling, e.g. &quot;solve this problem three different ways&quot;. But won&#39;t that only add to the madness, because one will never be able to get the same answer twice for the same input, unless an AI&#39;s model state is frozen during these runs. But then it says nothing about all future states when it is live. One will never know which 10% is bad. Maybe &quot;99% good&quot; is even worse in this kind of setup, because the downside of the 1% &quot;not good&quot; is unbounded. There will always be that gnawing doubt. Can you ever let the AI programmer loose by itself? And if you can&#39;t what&#39;s the cost of supervising and managing the consequences of its work product?

On the lines of 100x-ing the influence of a mere mortal, I read some interesting and plausible-sounding speculation of the AI powered billion dollar _&quot;company of one&quot;_. Maybe that comes to pass at some point. Software _is_ extreme leverage, after all. _However_ leverage works both ways — &quot;up and to the right&quot;, as well as &quot;down and to the negative&quot;. The downside is totally unbounded. It can subtract far more than what is created, because that&#39;s how shit blows up. A billion dollar company of one will be a wildly complex system of systems, and this entity better price in all that risk, which I doubt, because as posited, the risk is unbounded. I think scale demands more participants precisely because risk dislikes being concentrated. Whenever we force big risks into a small box, the variance of outcomes becomes wildly chaotic. This is just my messy intuition, not my scientifically-informed LLM talking.

In any case, whether the little guy gets superseded or becomes the big guy, shovel-makers and energy owners will make all the money, in this new gold rush (insert &quot;always have&quot; meme). The big tech acronyms already are… ASML, NVIDIA, FAANGs etc. Energy companies too. At the core of it, this particular AI game is one of raw energy and silicon, same as crypto.

Also, I am wary about slick demos that all these well-heeled AI players are publishing. Invariably, much behind the scenes production, cherry picking, and air brushing goes into making a demo that &quot;works&quot;. Almost as invariably, slick demos of mouse models fail at delivering the future they promise. This is not for lack of trying, or (maybe) not for lack of genuine intention (e.g. who can tell what OpenAI intends any more). This is just how creativity works.

However sophisticated the output _feels_, a probabilistic next-token predictor is still exploring a search space. One where the question _and_ the search universe are ill specified, barely constrained, and resist introspection beyond the most cursory.

Given all this positing and conjecture, and the fact that problem solving complexity explodes with small increases in ambiguity of a problem space, my gut says general-purpose programming ability is a literal black hole of energy consumption [3](#fn3).

The halting problem will permit only a halting AI [4](#fn4).

---

1. If you&#39;re a human reading this, please be advised you&#39;re by my armchair on the Internet, I failed repeatedly at college math and physics, and I am at best a pedestrian critic. Caveat emptor. Also, I armchair riffed about _[Tools for Thought](https:&#x2F;&#x2F;www.evalapply.org&#x2F;posts&#x2F;tools-for-thought&#x2F;index.html)_ previously, in which today&#39;s crop of AI tools fall into the &quot;memory assistant&quot; category, which is un-flatteringly the most primitive category of three, which of course speaks to my bias. Caveat emptor too.[↩︎](#fnref1)
2. The Devin _must_ be a man, yes? Siri is your secretary and Devin is your programmer.[↩︎](#fnref2)
3. I do believe we will likely have lots of agents that are world beating at very narrow and specialised domains. Sort of in line with Chess or Go AIs that reduce grand masters to tears, or WMD systems that reduce everything to rubble, or weather models, or long-haul autonomous transport drones on earmarked routes. And definitely a few colossal monopolies that can expend small-European-country-scale energy required to make AI as a service function, along with political power to keep out of any serious trouble should their AI going very very wrong in very very consequential ways (a billion dollar fine that you can contest forever is nothing if you fetch a hundred billion for your troubles). Some places will definitely be able to price that sort of risk. I&#39;m not wearing a tin foil hat. I just feel history tells us that there will always be someone with capacity to really push the boundaries far past the norm, and the smarts to figure out how to fly through the gaps between choice of actions and ownership of consequences.[↩︎](#fnref3)
4. Double-doffing my hat to the Halting Problem, and to Charlie Stross who gave us the notion of the [Corporation as a (slow) AI](https:&#x2F;&#x2F;www.antipope.org&#x2F;charlie&#x2F;blog-static&#x2F;2019&#x2F;12&#x2F;artificial-intelligence-threat.html), and who&#39;s novel _Halting State_ I thoroughly enjoyed.[↩︎](#fnref4)