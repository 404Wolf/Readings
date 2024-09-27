---
id: b34ce281-9486-47ea-a16e-d8ff0351c1c1
title: Pebble Graphics Epilogue | Irvin Hwang
tags:
  - RSS
date_published: 2024-08-28 00:00:00
---

# Pebble Graphics Epilogue | Irvin Hwang
#Omnivore

[Read on Omnivore](https://omnivore.app/me/pebble-graphics-epilogue-irvin-hwang-1919b4f8954)
[Read Original](https://irvin.quest/epilogue/)



Hello again. This blog was out of commission after Gatsby Cloud shutdown, but I continued posting updates for Pebble Graphics in this [playlist](https:&#x2F;&#x2F;www.youtube.com&#x2F;playlist?list&#x3D;PLhmEEtPzG7mW4JrBUhwbo3al6HjaJsDp2). I want to start writing about problems I’ve solved where I didn’t find the answers readily available online so it felt like it was time to get the site up and running again. Since my last post I [released](https:&#x2F;&#x2F;www.meta.com&#x2F;experiences&#x2F;pebble-graphics&#x2F;7189958484358658&#x2F;) Pebble Graphics then switched my attention to robotics and deep reinforcement learning. Here are some reflections on that transition.

I [wrote](https:&#x2F;&#x2F;irvin.quest&#x2F;turtles-all-the-way&#x2F;) about the original motivation for Pebble Graphics in February 2022, which was to make the process of programming more enjoyable by making it easier. This in turn would aid me in my actual pursuit of working on the [perfect tool](https:&#x2F;&#x2F;irvin.quest&#x2F;perfect-tool&#x2F;) i.e. artificial intelligence (very yak shave-y, I know). ChatGPT came out in November 2022 and that changed everything. It made programming easier in a completely different way. I still wish I had interactive step by step forward&#x2F;backward evaluation of programs and visualizations of program state and data that I developed in Pebble Graphics, but LLMs removed enough friction in the programming process to make me feel ready to tackle my original goals. I ended up spending a little over another year after ChatGPT came out to finish Pebble Graphics and released it January 2024\. I still wanted to see what it was like to try and sell something I made. I still thought there was potential for it to be a [gateway to programming](https:&#x2F;&#x2F;irvin.quest&#x2F;started-from-the-bottom&#x2F;) for a new generation. Ultimately, I didn’t find enough traction toward these aims to stay with the project. Even if I worked on this problem for the next ten years and succeeded in making a system for writing non-”toy” programs using these concepts, it’s still not clear to me whether it would actually be that useful or accomplish the goal of making programming more enjoyable. I started to feel like if I was going to make a long term commitment to a project I wanted it to be more obviously useful if it succeeded.

In April 2023, DeepMind put out a video of little humanoid robots playing soccer.

I was familiar with the domain since it was the main focus of my undergraduate advisor, but I hadn’t kept up with the field since I graduated in 2005\. I was blown away by the video. It reminded me of the feelings I had when I saw this demo of RiftSketch by Brian Peiris, which led me down the path to making Pebble Graphics.

I went to school in a time when neural networks were very much not in fashion and I was skeptical of deep learning as the path towards artificial general intelligence. I thought focusing on the process of abstraction and [modeling it using lambda calculus-like languages](https:&#x2F;&#x2F;arxiv.org&#x2F;abs&#x2F;1110.5667) was more promising. To some extent I still feel like there is something there to be discovered, but the results of deep learning couldn’t be ignored. Seeing the text-to-image models like DALL-E, was the first time I felt like “Ok, maybe this is it…”. Their ability to compose concepts in a meaningful way into coherent novel images (e.g. an [avocado armchair](https:&#x2F;&#x2F;www.technologyreview.com&#x2F;2021&#x2F;01&#x2F;05&#x2F;1015754&#x2F;avocado-armchair-future-ai-openai-deep-learning-nlp-gpt3-computer-vision-common-sense&#x2F;%5D)) showed a level of understanding and abstraction I hadn’t expected from existing systems. The DeepMind video really convinced me to look into it for myself and see what the technology could do. Robotics met the criteria of being “obviously useful” if it works and it felt like a more direct path towards developing the perfect tool so I made the switch. My first project was to get a simple simulation to reality (Sim2Real) setup going, which I’ll write about in my next post.

---

* [← Data, Stateful Computation, and Abstraction...in 3D](https:&#x2F;&#x2F;irvin.quest&#x2F;show-me-the-data&#x2F;)