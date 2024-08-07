---
id: c125c30d-d1dd-4ce5-80dc-c7fe2f4b871a
title: CUDA – Two | Organic Donut
tags:
  - RSS
date_published: 2024-06-07 12:08:24
---

# CUDA – Two | Organic Donut
#Omnivore

[Read on Omnivore](https://omnivore.app/me/cuda-two-organic-donut-18ff46bcffb)
[Read Original](https://organicdonut.com/2024/06/cuda-two/)



I have an art sale coming up in three days, so I’m spending most of my focus time finishing up the inventory for that. But in my spare time between holding the baby and helping my older kid sell lemonade, I’ve started exploring a few of the topics I’m interested in from the [previous post](https:&#x2F;&#x2F;organicdonut.com&#x2F;2024&#x2F;06&#x2F;cuda-one&#x2F;).

**Convolutions**

Something I was reading mentioned convolutions, and I had no idea what that meant, so I tried to find out! I read several posts and articles, but the thing that made Convolutions click for me was [a video by 3 Blue 1 Brown](https:&#x2F;&#x2F;youtu.be&#x2F;KuXjwB4LzSA). The video has intuitive visualizations. Cheers to good technology and math communicators.

Sliding a kernel over data feels intuitive to me, and it looks like one of the cool things about this is that you can do this with extreme parallelism. I’m pretty sure this is covered early on in the textbook, so I’m not going to worry about understanding this completely yet.

It seems like convolutions are important for image processing, especially things like blur and edge detection, but also in being able to do feature detection – it allows us to search for a feature across an entire image, and not just in a specific location in an image.

One thing I don’t understand yet is how to build a convolution kernel for complicated feature detection. One of the articles I read mentioned that you could use feature detection convolution for something like eyes, which I assume requires a complicated kernel that’s trained with ML techniques. But I don’t quite understand what that kernel would look like or how you would build it.

**Parallel Processing**

I started reading _Programming Massively Parallel_ _Processors,_ and so far it’s just been the introduction. I did read it out loud to my newborn, so hopefully he’ll be a machine learning expert by the time he’s one.

Topics covered so far have been the idea of massive parallelism, the difference between CPU and GPU, and a formal definition of “speed up“.

I do like that the book is focused on parallel programming and _not_ ML. It allows me to focus on just that one topic without needing to learn several other difficult concepts at the same time. I peeked ahead and saw a chapter on massively parallel radix sort, and the idea intrigues me.

**Differentiation and Gradient Descent**

Again, [3B1B had the best video](https:&#x2F;&#x2F;youtu.be&#x2F;IHZwWFHWa-w) on this topic that I could find. The key new idea here was that you can encode the weights of a neural network as an enormous vector, and then map that vector to a fitness score via a function. Finding the minimum of this function gives us the best neural network for whatever fitness evaluation method we’ve chosen. It hurts my brain a bit to think in that many dimensions, but I just need to get used to that if I’m going to work with ML. I don’t fully understand what differentiation means in this context, but I’m starting to get some of the general concept (we can see a “good direction” to move in).

I haven’t worked with gradients since Calc III in college, which was over a decade ago, but I’ve done it once and I can do it again 💪. It also looks like I need to understand the idea of total derivative versus partial derivative, which feels vaguely familiar.

**Moving Forward**

Once the art sale is over, I’ll hopefully have more focus time for this 🙂 For now, it’ll be bits and pieces here and there. For learning CUDA in particular, it looks like working through the textbook is going to be my best bet, so I’m going to focus some energy there.

From Grand Rapids,  
Erty