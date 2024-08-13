---
id: 46896cd9-a9ca-4594-b031-cfdaad93d98e
title: CUDA – One | Organic Donut
tags:
  - RSS
date_published: 2024-06-05 17:00:39
---

# CUDA – One | Organic Donut
#Omnivore

[Read on Omnivore](https://omnivore.app/me/cuda-one-organic-donut-18feaf7f6ab)
[Read Original](https://organicdonut.com/2024/06/cuda-one/)



First, some backstory. I was laid off from Google in January and I’ve taken the last six months off, mostly [working on art glass](https:&#x2F;&#x2F;solidarityglassworks.com&#x2F;) and taking care of my kids (one of whom was just born in April, and is sleeping on my chest as I write this). I’m slowly starting to look for work again, with a target start date of early September 2024\. If you’re hiring or know people who are, [please check out my résumé](https:&#x2F;&#x2F;erty.me&#x2F;resume).

A friend of mine recently let me know about a really interesting job opportunity, which will require working with code written in (with?) CUDA. The job is ML related, so I’ll be focusing my learning in that direction.

I don’t know anything about CUDA. Time to learn! And, why not blog about the process as I go along.

First step: come up with some resources to help me learn. I googled something like “learn cuda” and found [this Reddit post on the &#x2F;r&#x2F;MachineLearning subreddit](https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;MachineLearning&#x2F;comments&#x2F;w52iev&#x2F;d%5Fwhat%5Fare%5Fsome%5Fgood%5Fresources%5Fto%5Flearn%5Fcuda&#x2F;?rdt&#x3D;49400). It looks like I’ll probably be learning a couple of related topics as I go through this journey:

**CUDA**

This is the goal. It looks like CUDA is a language + toolkit for writing massively parallel programs on graphics cards, that aren’t necessarily for graphics. Basically, making the GPU compute whatever we want. If we use this for, say, matrix multiplications, we can accelerate training of ML models.

**Python and C++** 

C++ ? I haven’t written C++ since college a decade ago. I think I remember some of it, but I’ve always been intimidated by the size of the language, the number of “correct” ways to write it, and the amount of magic introduced by macros. I also don’t like the whole .h &#x2F; .cc thing, but I suppose I’ll just have to get used to that.

I’m pretty good at Python, having written several tens of thousands of lines of it at Google, so I’m not super worried about that.

**PyTorch or TensorFlow**

Some folks on the Reddit post linked above recommend a [specific tutorial on the PyTorch website](https:&#x2F;&#x2F;pytorch.org&#x2F;tutorials&#x2F;advanced&#x2F;cpp%5Fextension.html%E2%80%98), which looks interesting. It seems like PyTorch is a ML library written in Python (based on Torch, which was written in Lua).

PyTorch is Meta, now under Linux. TensorFlow is Google. Both use C++, Python, and CUDA.

**Matrix Math**

In college, I was only briefly introduced to matrix math, and most of that exposure was a graphics course that I audited. Based on my brief reading about all of this, it seems like the major advantage of using graphics cards to train ML is that they can do matrix math _really, really fast._ It’s up to me to brush up on this while I explore the other things. I don’t yet have a specific study plan for this.

**Parallelism**

According to redditor surge\_cell in that previously linked thread, “There are three basic concepts – thread synchronization, shared memory and memory coalescing which CUDA coder should know in and out of \[sic\]”. I’ve done some work with threading and parallelism, but not recently. Most of my work at Google was asynchronous, but I didn’t have to manage the threading and coalescing myself (e.g. &#x60;async&#x60; in JS)

## **Resources**

Ok – so, what am I actually going to do?

I browsed some YouTube videos, but the ones that I’ve watched so far have been pretty high level. It looks like NVIDIA has some CUDA training videos … from 12 years ago. I’m sure the language is quite different now. I also want deeper training than free YouTube videos will likely provide, so I need to identify resources to use that will give me a deep knowledge of the architecture, languages, and toolkits.

First, I’ll try to do the [Custom CUDA extensions for PyTorch](https:&#x2F;&#x2F;pytorch.org&#x2F;tutorials&#x2F;advanced&#x2F;cpp%5Fextension.html) tutorial. See how far I can get and make notes of what I get stuck on.

Second, One of the Reddit posts recommended a book called Programming Massively Parallel Processors by Hwu, Kirk, and Hajj, so I picked up a copy of that (4th Ed). I’m going to start working through that. It looks like there are exercises so I’ll be able to actually practice what I’m applying, which will be fun.

Finally, I’ll try implementing my own text prediction model in ML. I know you can do this cheaply by using something like [🤗 (aka HuggingFace)](https:&#x2F;&#x2F;huggingface.co&#x2F;) but the point here is to learn CUDA, and using someone else’s pretrained model is not going to teach me CUDA. I’m optimizing for learning, not for accurate or powerful models.

**Questions**

There’s a lot I don’t know, but here are my immediate questions.

1. I have an NVIDIA card in my windows computer, but I don’t have a toolchain set up to write CUDA code for it. I’m also not used to developing C++ on windows, so I’ll need to figure out how to get that running as well. I have a feeling this won’t be particularly tricky, it’ll just take time.
2. I have a lot of unknown unknowns about CUDA – I’m not even sure what I don’t know about it. I think I’ll have more questions here as I get into the materials and textbooks.
3. It seems like there’s a few parts of ML with various difficulties. If you use a pretrained model, it seems pretty trivial (\~20 lines of python) to make it do text prediction or what have you. But training the models is really, really difficult and involves getting a lot of training data. Or, perhaps not difficult, but expensive and time consuming. Designing the ML pipeline seems moderately difficult, and is probably where I’ll spend most of my time. But I need to understand more about this.

**That’s it for Day One**

If you’re reading this and you see something I’ve done wrong already, or know of a resource that helped you learn the tools that I’m talking about here, please do reach out!

From Grand Rapids,  
Erty