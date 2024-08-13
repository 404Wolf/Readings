---
id: 9320df76-8cef-481a-99c9-1bd0cff133a2
title: "Simulating an 8-bit 6502 microprocessor chapter 3: running Apple 2 software | by William Seymour | Jun, 2024 | Medium"
tags:
  - RSS
date_published: 2024-06-17 06:05:44
---

# Simulating an 8-bit 6502 microprocessor chapter 3: running Apple 2 software | by William Seymour | Jun, 2024 | Medium
#Omnivore

[Read on Omnivore](https://omnivore.app/me/simulating-an-8-bit-6502-microprocessor-chapter-3-running-apple--1902633d950)
[Read Original](https://medium.com/@www.seymour/simulating-an-8-bit-6502-microprocessor-chapter-3-running-apple-2-software-92b755e6b47a)



Most original software makes use of one of the two video graphics modes: low-res and high-res.

## I: Low-res graphics

As in text mode, the Apple 2’s screen is represented by bytes in a special area of memory. Low-res graphics uses the same address space as text-mode to output blocks in a range of 16 colours in a 40x48 grid. Mercifully, the complex interleaving scheme remains unchanged from text-mode.

The Apple 2 switches video modes using several so-called “soft switches”, or memory addresses that listen for activity. This logic is nice and easy to recreate in our emulator.

The Basic programme below (source: original Apple 2 owner’s manual) renders a dynamic mosaic pattern on the screen. Note the Basic command GR, which initiates low-res graphics mode (combined with text) by reading to $C056, $C053, and then $C050.

100 GR  
105 FOR W&#x3D;3 TO 50  
110 FOR I&#x3D;1 TO 19  
115 FOR J&#x3D;0 TO 19  
120 K&#x3D;I+J  
130 COLOR&#x3D;J*3&#x2F;(I+3)+I*W&#x2F;12  
135 PLOT I,K: PLOT K,I: PLOT 40-I,40-K  
136 PLOT 40-K,40-I: PLOT K,40-I: PLOT 40-I,K: PLOT I,40-K: PLOT 40-K,I  
140 NEXT J,I  
145 NEXT W: GOTO 105  
RUN

The Basic programme ‘Mosaic’ running in low-res graphics mode

## II: high-res graphics

The Apple 2 is capable of rendering 53,760 dots in a 280x192 grid, but this comes with some significant compromises. There are only six colors, and most are unavailable for any given dot. And it requires many times more memory than low-res mode. Lines are again interleaved.

To test this I borrowed a [Basic programme from The Coding Train](https:&#x2F;&#x2F;thecodingtrain.com&#x2F;challenges&#x2F;174-graphics-applesoft-basic) that draws fractal trees. To avoid having to type out programmes by hand, I also wrote a function that effectively types the programme into the computer automatically.

The 1970s IDE

This programme is intended to run on a monochrome monitor, but when run with emulated colour it illustrates how the colour of dots is determined largely by position (more examples showing how that works below).

With that working, I wanted to see what high-res graphics mode is capable of. I found some scans from an old computing journal, and transcribed the programme into my emulator.

Watching these images slowly render was a rewarding confirmation that I had everything working — all three graphics modes were now operational, and, because this programme makes heavy use of floating point maths and subroutines, I could be pretty confident that the cpu was handling its instructions perfectly.

This image renders wholly in red because the programmer has taken care to draw dots only in odd columns.

This image achieves a directional lighting effect by controlling when dots are drawn in odd columns (red) and even columns (blue).

This image demonstrates the alternative two-colour palette, and also how white is produced whenever two pixels touch horizontally.

## IV: Speed

Rendering these images made one thing very clear: this kind of maths is a real stretch for the Apple 2\. Some of these plots took 15 mins to complete. Others took far longer (they contained square roots).

Up until this point, my Python emulator was running roughly as fast as the original, at 1Mhz, and this was largely a coincidence. I began to wonder what the 6502 would be capable of if the clock speed could be increased by an order of magnitude or two.

\&gt;&gt; Next: speeding things up a couple of orders of magnitude