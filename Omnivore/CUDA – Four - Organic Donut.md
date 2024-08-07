---
id: 80dd9087-d9b4-4989-9fb7-51b22efb1c5d
title: CUDA – Four | Organic Donut
tags:
  - RSS
date_published: 2024-06-29 08:02:50
---

# CUDA – Four | Organic Donut
#Omnivore

[Read on Omnivore](https://omnivore.app/me/cuda-four-organic-donut-190640b6679)
[Read Original](https://organicdonut.com/2024/06/cuda-four/)



I’ve been busy with other things, but I woke up early and decided to get some CUDA studying in. I did talk with the hiring manager for the position that I’m interested in, who (as I expected) clarified that I didn’t actually need to know CUDA for this position. I’m still interested, though I should focus more on the [Leetcode](https:&#x2F;&#x2F;leetcode.com&#x2F;)\-style exercises that are more likely to come up on the interivew.

That said, I haven’t been entirely ignoring this. I’ve been watching some 3Blue1Brown videos in my spare time, like [this one on convolution](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;IaSGqQa5O-M). My calculus is definitely rusty (I don’t fully remember how to take an integral), but I’m mostly just trying to gain some intuition here so that I know what people are talking about if they say things like, “take a convolution”.

For today, I started by looking through the [source of the sample code](https:&#x2F;&#x2F;github.com&#x2F;NVIDIA&#x2F;cuda-samples&#x2F;blob&#x2F;master&#x2F;Samples&#x2F;0%5FIntroduction&#x2F;asyncAPI&#x2F;asyncAPI.cu) I got running [last time](https:&#x2F;&#x2F;organicdonut.com&#x2F;2024&#x2F;06&#x2F;cuda-three&#x2F;). Thanks to the book I’ve been reading, a lot of the code makes sense and I feel like I can at least skim the code and understand what’s going on at a syntax level, for example:

&#x60;&#x60;&#x60;reasonml
__global__ void increment_kernel(int *g_data, int inc_value) {
  int idx &#x3D; blockIdx.x * blockDim.x + threadIdx.x;
  g_data[idx] &#x3D; g_data[idx] + inc_value;
}
&#x60;&#x60;&#x60;

Writing this mostly for my own understanding: 

The &#x60;__global&#x60; identifier marks this as a _Kernel_ – code that is called from the host but runs on the device. It takes in a pointer to an array &#x60;g_data&#x60; and an int &#x60;inc_value&#x60;. This kernel will be run for each element in the &#x60;g_data&#x60; array and each instance of the kernel will operate on the element calculated in &#x60;idx&#x60;. Each thread block of &#x60;blockDim&#x60; threads will have a unique &#x60;blockIdx&#x60; and each thread in that block will have a unique &#x60;threadIdx&#x60;. Since we are working on 1D data (i.e. a single array, and not a 2D or 3D array), we only care about the &#x60;x&#x60; property of each of these index variables. Then, we increment the value at index &#x60;idx&#x60; by the &#x60;inc_value&#x60;.

Ok, writing this up I think I have one question, which is about the &#x60;.x&#x60; property. The book explains that you can use the &#x60;.x, .y, .z&#x60; properties to easily split up 2D or 3D data, but also talks about ways to turn 2D or 3D data into a 1D representation. So are the &#x60;.y, .z&#x60; properties just “nice” because they allow us to leave 2D data as 2D, or do they actually allow us to do something that re-representing the 2D data as 1D data and just using &#x60;.x&#x60; doesn’t?

Ok, continuing on:

&#x60;&#x60;&#x60;cpp
int main(int argc, char *argv[]) {
  int devID;
  cudaDeviceProp deviceProps;

  printf(&quot;[%s] - Starting...\n&quot;, argv[0]);
&#x60;&#x60;&#x60;

Start the main function and set up some variables, as well as letting the user know that we’re starting.

&#x60;&#x60;&#x60;reasonml

  &#x2F;&#x2F; This will pick the best possible CUDA capable device
  devID &#x3D; findCudaDevice(argc, (const char **)argv);

  &#x2F;&#x2F; get device name
  checkCudaErrors(cudaGetDeviceProperties(&amp;deviceProps, devID));
  printf(&quot;CUDA device [%s]\n&quot;, deviceProps.name);
&#x60;&#x60;&#x60;

Some questions here. What does it mean by “best”? Fortunately, [the source for findCudaDevice is available to us](https:&#x2F;&#x2F;github.com&#x2F;NVIDIA&#x2F;cuda-samples&#x2F;blob&#x2F;master&#x2F;Common&#x2F;helper%5Fcuda.h#L867). First it checks to see if a device is specified by command line flag, and if not, grabs the device “with “with highest Gflops&#x2F;s”.

&#x60;&#x60;&#x60;angelscript
  int n &#x3D; 16 * 1024 * 1024;
  int nbytes &#x3D; n * sizeof(int);
  int value &#x3D; 26;

  &#x2F;&#x2F; allocate host memory
  int *a &#x3D; 0;
  checkCudaErrors(cudaMallocHost((void **)&amp;a, nbytes));
  memset(a, 0, nbytes);
&#x60;&#x60;&#x60;

Setting some variables first, but then we allocate some host memory. I was curious about &#x60;cudaMallocHost&#x60;. In the other examples I’d seen, host memory was usually created by just using &#x60;malloc&#x60; (or simply assumed to already be allocated, in the book). &#x60;cudaMallocHost&#x60; creates “pinned” memory, which is locked into RAM and is not allowed to swap. This allows us to use e.g. &#x60;cudaMemcpy&#x60; without the performance overhead of constantly checking to make sure that the host memory has not been swapped to disk.

I’m still not used to the C convention of handling errors via macros like &#x60;checkCudaErrors&#x60; instead of language constructs like &#x60;try&#x2F;catch&#x60; or &#x60;if (err !&#x3D; nil)&#x60;. It just _feels_ like an obsolete way of doing error handling that’s easy to forget.

That’s all I had time for this morning, but it’s fun to understand more and more about this as I continue to learn!