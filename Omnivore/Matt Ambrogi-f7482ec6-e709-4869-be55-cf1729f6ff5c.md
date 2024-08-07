---
id: f7482ec6-e709-4869-be55-cf1729f6ff5c
title: Matt Ambrogi
tags:
  - RSS
date_published: 2024-06-06 11:07:42
---

# Matt Ambrogi
#Omnivore

[Read on Omnivore](https://omnivore.app/me/matt-ambrogi-18fee6ee4b1)
[Read Original](https://www.mattambrogi.com/posts/gpt-newspaper-explained/)



[mattambrogi](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;) 

* [Posts](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;posts&#x2F;)
* [Projects](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;projects)
* [Notes](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;notes&#x2F;)
* [Twitter](https:&#x2F;&#x2F;twitter.com&#x2F;matt%5Fambrogi)

## Agents Aren&#39;t so Hard: GPT Newspaper Explained

GPT Newspaper is a project that came out earlier this year which uses agents to build customized newspapers. Building an agent which autonomously completes a task like this sounds daunting. I want to go through the code and show why its not.

The content below is adapted from a thread I posted on X.

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,spExxiuBoKOrd9QFJTbUzz75kvc5IXTlFBwRZIvVV7Kk&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2P0nNXgAA3ln0?format&#x3D;jpg&amp;name&#x3D;small)

From the repo, which is open source, we can see exactly what the agent is doing:

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sVr3xvy4Sn57Nkg5UIksjm0FdfNL9mwGBYmN2GJebRqA&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2QnpMWsAEAO_R?format&#x3D;jpg&amp;name&#x3D;small)

The authors refer to each one of these steps as an Agent. But we can really just think about each as a thing that performs a specific tasks, often using an LLM call.

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sOcem703oJXT0SP2inPq2O2diWEwHwlBgKwS_OmuK8Hk&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2Q5rqWcAAxhNx?format&#x3D;jpg&amp;name&#x3D;small)

Let&#39;s look at the first step, search. It&#39;s just a simple python class with a method which uses an API to get some search results.

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s-nbheZibaEheNblgtwtOguhWKZ2melQ4f1J-9aZagZ0&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2RYkjX0AMYUqh?format&#x3D;jpg&amp;name&#x3D;small)

While the subsequent agents start utilizing the language model, they&#39;re not much more complex. All are just python classes with one or two methods. Curator just asks the model to filter down the results to the top 5 most relevant and return their urls.

Writer, for example, basically just asks the model to write an article given the text of a few sources from the search step.

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sKhwy9os9NBNy7Scnp23YmZtWv_bVJN3l3mTy3xvkFHI&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2SYAXWYAAn-RI?format&#x3D;jpg&amp;name&#x3D;small)

You can dive into each of the steps, or agents, in the repo. For the most part, they all perform simple tasks. There is one part that is slightly more complicated: a loop between Writer and Critique. This is the type of thing that really makes agents interesting and which enables things like agents which can write code for entire features. But how does it work? 

GPT Writer uses a tool from LangChain called LangGraph to do this. LangGraph allows us to define the order of execution for these steps. 

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sXoRN_PLaod09XTntCVSHUWjzWeft-e7i2oA2uLUIu18&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2Tw1GW8AAGdyP?format&#x3D;jpg&amp;name&#x3D;small)

Critically, it allows the developer to define conditional edges. This allows gpt-newspaper to refine the article with Writer if Critique does not pass.

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sGjMV4TUdZBen3OHiplPRCtGcNPLfRwluqph3k6dfVdI&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2UMtEWIAAXTNK?format&#x3D;jpg&amp;name&#x3D;small)

Lastly, we just kick off the graph run and now you have an agent which can go off an autonomously complete a multistep task. In this case, it builds a customized newspaper.

![Image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s2AiqFmQs10R6pUF-DnBpMlH-NfGnpCmvINcTvGAYmD4&#x2F;https:&#x2F;&#x2F;pbs.twimg.com&#x2F;media&#x2F;GO2UeoiWEAEka-t?format&#x3D;jpg&amp;name&#x3D;small)

The key point is that really all we&#39;re doing here is defining a flow of steps and maybe some conditional loops. And each step generally consists of pretty simple LLM calls. But by putting all these simple things together we can build something really cool.

There are so many use cases for basic agent workflows like this. For example: I could modify this to build a tool to turn this twitter thread into a blog post. Or to run a diligence report on a startup. Or to research a given person.

[Agent AI](https:&#x2F;&#x2F;agent.ai&#x2F;) is building an platform and &quot;professional network&quot; for agents just like this. Following this pattern you can build the exact types of tools that are on there. Platforms like [Lindy AI](https:&#x2F;&#x2F;www.lindy.ai&#x2F;) are allowing consumers to build their own more advanced versions of workflows like this. Two things are true: these tools are magic, but they&#39;re also just well orchestrated LLM calls.

Here&#39;s the repo for GPT Newspaper by Rotem Weiss:

[ttps:&#x2F;&#x2F;github.com&#x2F;rotemweiss57&#x2F;gpt-newspaper&#x2F;tree&#x2F;master](https:&#x2F;&#x2F;t.co&#x2F;EfRhwSXMb9)