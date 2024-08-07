---
id: 7587f02c-5f86-495e-8c07-b93ab5576fb6
title: CUDA – Three | Organic Donut
tags:
  - RSS
date_published: 2024-06-08 00:06:04
---

# CUDA – Three | Organic Donut
#Omnivore

[Read on Omnivore](https://omnivore.app/me/cuda-three-organic-donut-18ff704667b)
[Read Original](https://organicdonut.com/2024/06/cuda-three/)



I ran a CUDA program 🙂

It was a rough experience 🙃

Honestly, getting started with pretty much any programming language involves a lot of banging your head against the toolchain, and slowly untangling old tutorials that reference things that don’t exist anymore. Honestly, this was easier than some python setups I’ve done before.

I started with a pretty sparse windows installation. I keep my computers relatively clean and wipe them entirely about once a year, so all I had to start was VSCode and … that’s about it. I am lucky that I happen to already have a windows machine (named Maia) that has a GTX 2080, which supports CUDA.

I installed MSVC (the microsoft C++ compiler) and the [NVIDIA toolkit](https:&#x2F;&#x2F;developer.nvidia.com&#x2F;cuda-downloads).

Then I tried writing some C++, not even CUDA in VSCode and I couldn’t get it to compile. I kept getting the error that &#x60;#include &lt;iostream&gt;&#x60;was not valid. As I mentioned, I haven’t written C++ in about 10 years, so I knew that I was likely missing. I putzed around installing and poking various things. Eventually I switched out MSVC for [MINGW](https:&#x2F;&#x2F;code.visualstudio.com&#x2F;docs&#x2F;cpp&#x2F;config-mingw) (G++ for windows) and this allowed me to compile and run my “hello world” C++ code. Hooray!

Now I tried writing a .cu CUDA file. While NVIDIA provides an official extension for .cu files, and I had [everything installed according to the CUDA quick start guide](https:&#x2F;&#x2F;docs.nvidia.com&#x2F;cuda&#x2F;cuda-quick-start-guide&#x2F;), But VSCode just did … nothing when I tried to run the .cu file with the C++ CUDA compiler selected. So I went off searching for other things to do.

Eventually I decided to install Visual Studio, which is basically a heavy version of VSCode and I don’t know why they named them the same thing except that giant corporations love to do that for whatever reason.

I got VS running and also downloaded Git (and then Github Desktop, since my CLI Git wasn’t reading my SSH keys for whatever reason.

Finally, I downloaded the [CUDA-samples](https:&#x2F;&#x2F;github.com&#x2F;NVIDIA&#x2F;cuda-samples) repo from NVIDIA’s Github, and it didn’t run – turns out that the CUDA Toolkit version number is hard-coded in two places in the config files, and it was 12.4 while I had version 12.5\. But that was a quick fix, fortunately.

Finally, I was able to run one on my graphics card! I still haven’t \*written\* any CUDA, but I can at least run it if someone else writes it. My hope for tomorrow is to figure out the differences between my non-running project and their running project to put together a plan for actually writing some CUDA from scratch. Or maybe give up and just clone their project as a template!