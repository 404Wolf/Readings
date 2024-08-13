---
id: 94747d10-b5c1-4b56-a17a-587ad43fc0f5
title: "Simulating an 8-bit microprocessor chapter 2: the Apple 2 | by William Seymour | Jun, 2024 | Medium"
tags:
  - RSS
date_published: 2024-06-16 10:04:08
---

# Simulating an 8-bit microprocessor chapter 2: the Apple 2 | by William Seymour | Jun, 2024 | Medium
#Omnivore

[Read on Omnivore](https://omnivore.app/me/simulating-an-8-bit-microprocessor-chapter-2-the-apple-2-by-will-19021f06d16)
[Read Original](https://medium.com/@www.seymour/simulating-an-8-bit-microprocessor-chapter-2-the-apple-2-6320783bb21c)



## Graphics modes

This is the **second** chapter in an odyssey that encompasses:

1. [Using test-driven development (TDD) to create an instruction-level simulation of the 6502 microprocessor.](https:&#x2F;&#x2F;medium.com&#x2F;@www.seymour&#x2F;simulating-an-8-bit-microprocessor-chapter-1-instructions-6ada8921c43f)
2. Reverse engineering the keyboard input and video output of an Apple 2 computer (a 1970s computer with the 6502 at its core).
3. Building out the emulation of the Apple 2 computer accurate enough to run real 1970s software.
4. Rewriting the simulation in C++ to make it 500x faster than it was in reality.
5. Testing that speed with a ray-tracing graphics engine written in 6502 assembly.

In [chapter 1](https:&#x2F;&#x2F;medium.com&#x2F;@www.seymour&#x2F;simulating-an-8-bit-microprocessor-chapter-1-instructions-6ada8921c43f), I documented the process of building a simulation of a 6502 microprocessor to a high degree of accuracy. The real test, however, is whether it can be used to simulate an actual computer system.

I gave it very little thought, but ultimately chose to simulate the Apple 2 over, say, the Commodore 64, mainly because it seemed to require fewer additional components. In retrospect, the Apple 2’s graphics modes proved somewhat challenging, while adding components to the simulation is pretty trivial — so I’d likely choose differently a second time around.

## I: Towards the Apple 2

An MVP Apple 2 needs a few things:

* A 6502 processor.
* An address space — in the simulation we can combine ram, rom, expansion slots, etc, into a single entity.
* Some software — a version of the machine code that came with the machine
* A way of getting the software into memory
* A way of inputting keystrokes
* A way of outputting video

We already have the 6502 and the address space from chapter 1\. And we already know that we can put software into memory by… just putting it there.

When it comes to software, Apple 2 ROMs (the original “operating system”) are not hard to find. Some of these are original, and some are reverse engineered. You’ll remember from chapter 1 that this code is in the form of a list of 8-bit integers, and is comically small by modern standards, amounting to little more than 12,000 bytes. I found that several different roms worked, but I settled on Applesoft Basic (the version released with the Apple 2+) going forward, as this has more features than the original, and includes some rudimentary floating point arithmetic routines (which we’ll need in chapter 5).

Keystrokes _should_ be pretty straightforward, but we’ll first need a display so we can see what we’re typing.

## II: Text mode

Text mode is the Apple 2’s default graphics mode. As stated in the manual, it can show 40 columns and 24 lines of fixed-width uppercase-only characters.

Video output is represented in a special section of memory. Programmes can write to this memory, and every so often (fifty times a second, to be precise), this slice of memory is read and turned into characters for display. The manual tells us that we can find this bit of memory between addresses $400 and $7FF.

It goes on to detail how the set of 64 characters is represented in memory.

So, all we have to do is find an 8x8 bitmap for each character, and draw the right one for each value in video memory. When we attempt to boot the simulated Apple 2 into Basic, this is what we get:

This is quite obviously completely wrong. But there are some clues as to why. One problem is that the wrong characters are being displayed —we’ve got T instead of blank space, and some deduction suggests that maybe the characters in the top row should read APPLE \]\[.

Inspecting the values in memory, we can see that we just need to apply an offset to get to the real characters. With that, we get some legible text!

The second problem is now much more obvious — clearly the lines are not stored consecutively in memory, but are offset and, in fact interleaved. I spent many hours reverse engineering this scheme before realising that the manual once again tells us everything we need to know.

And with that, we have everything needed to correctly implement text mode!

At this point, for the first time, we can see that the simulation really is emulating an Apple 2 correctly.

## III: keyboard input

As you can see above, the simulation is correctly accepting and rendering keystrokes. The Apple 2 reads keyboard input by detecting new information written to a single address, $C000\. All we have to do is correctly encode keypresses and write the code to that address. Simple!

At this point, we can relive many millions of people’s first moment programming a computer by putting the Apple 2 into an infinite loop.

Part 3: from text to graphics