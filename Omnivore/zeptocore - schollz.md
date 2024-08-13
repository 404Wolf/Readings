---
id: dd61852e-0968-11ef-9a99-fbbc6baee0b0
title: zeptocore | schollz
tags:
  - RSS
date_published: 2024-05-03 12:03:54
---

# zeptocore | schollz
#Omnivore

[Read on Omnivore](https://omnivore.app/me/zeptocore-schollz-18f3f408f3d)
[Read Original](https://infinitedigits.co/tinker/zeptocore/)



## Zack Scholl

zack.scholl@gmail.com

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sf4Z7Chq9Po8u4VV0a-m_3UxwGUozAk4JUEo36g9WTLg&#x2F;https:&#x2F;&#x2F;infinitedigits.co&#x2F;img&#x2F;zepto3.png) 

 &#x2F; [#hardware](https:&#x2F;&#x2F;infinitedigits.co&#x2F;tags&#x2F;hardware) 

creating a sample player machine from scratch.

the zeptocore is a portable music device created by infinite digits (myself), released on May 3rd, 2024, which is available to buy on my website [zeptocore.com](https:&#x2F;&#x2F;zeptocore.com&#x2F;).

the zeptocore is a handmade, handheld sample player. It is supposed to be a fun device, where you can easily create new and interesting sounds out of a bank of samples by smashing buttons.

### the beginnings

I’ve been interested in mangling samples for a long time. I created a number of programs for the [norns sound computer](https:&#x2F;&#x2F;monome.org&#x2F;docs&#x2F;norns&#x2F;) using [SuperCollider](https:&#x2F;&#x2F;sccode.org&#x2F;) that allow you to mangle samples in interesting ways. here is a selection:

* [amen](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;amen) \- sample mangler and looper
* [amenbreak](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;amenbreak) \- dedicated amen break script
* [makebreakbeat](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;makebreakbeat) \- make breakbeats from scamples
* [dnb.lua](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;dnb.lua&#x2F;) \- using aubio and sox to generate breakbeats
* [sampswap](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;sampswap) \- copies and pastes samples together
* [glitchlets](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;glitchlets) \- glitch audio

After a few years of making software, I decided it would be fun and rewarding to make a physical device.

### the breadboard

I started working on this device about a year ago using off-the-shelf components wired into a breadboard. I got the very first prototype working in July, on a long plane trip from Seattle to Berlin. (Strangely no TSA agent ever asked me about the breadboard with wires sticking out of it!)

Here is the first video of the first ever version:

This version is basically just some off the shelf components (a PMC5102, SD card, and Raspberry Pi Pico) but it worked and was fun. I actually still support this version which I call “[zeptoboard](https:&#x2F;&#x2F;zeptocore.com&#x2F;#zeptoboard)”.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sxhcz883k0fSP64jDPEtr4JQXILIryrQvpNzmQlzDE8g&#x2F;https:&#x2F;&#x2F;infinitedigits.co&#x2F;img&#x2F;zeptoboard.png) 

You can build this today and it still works great, especially with the MIDI interface on a Chrome browser:

## the hardware

Once I got the basic concept working I started on the hardware. The basic hardware is not too complicated - it needed to support SD card SDIO interfaces, 20 buttons, and 20 lights, 3 knobs. I am using the Raspberry Pi Pico as the CPU which didn’t have enough GPIOs for all of this, so I added a PCA9552 as a light controller and did a keyboard matrix for the GPIOs. Instead of off-the-shelf SD card and audio DAC I also integrated them into the board.

All in all it took me about 28 tries to get the board right. There were about 15 versions that just _didn’t work_ and it turned out to be something really silly like a bad soldering pad for the sd card.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sLThLjaK47B9j9sxWzTYcYUfclO2CMff5gppcJ5M21SI&#x2F;https:&#x2F;&#x2F;infinitedigits.co&#x2F;img&#x2F;zeptocorehard.png) 

In the end I was able to get matching colors for the Raspberry Pi Pico and the board which I also liked. (There was a separate incident where a large box of Raspberry Pi Picos got lost on its way to me and everything was delayed weeks :( ).

## the firmware

I spent almost a year writing the firmware which I call “[\_core](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;%5Fcore)” as it is somewhat hardware agnostic. I’m still writing the firmware.

[ ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sqyoIuIsCAnNVWvR5lI4HRoMTg17JJLAU_ReALBHxwP0&#x2F;https:&#x2F;&#x2F;infinitedigits.co&#x2F;img&#x2F;zeptocontributions.png) ](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;%5Fcore) 

One very fun part of doing the firmware was writing my own effects. I’m especially proud of the saturation and fuzz effects. The fuzz, for example, is a very simple transfer function:

[ ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sYfLBRletfH7LsTGTQBCXJuHLz6SyYrgkKTB1_Y_4V-Y&#x2F;https:&#x2F;&#x2F;infinitedigits.co&#x2F;img&#x2F;fuzz-removebg-preview.png) ](https:&#x2F;&#x2F;github.com&#x2F;schollz&#x2F;%5Fcore) 

Which has a really cool effect on sound (you can hear it halfway through the following clip):

The most frusturating part of the firmware was the SD card latency. I am streaming samples from the SD card which has the benefit of no memory limits but the downside of latency. I wrote a [blog post about SD card latency](https:&#x2F;&#x2F;infinitedigits.co&#x2F;tinker&#x2F;sdcard) and found that not all the SD cards are the same. I managed to find some SD card that will work, though.

## the release

After two dozen revisions, and months and months of firmware, I am so happy to finally “release” the zeptocore into the wild. Its certainly a fun device - I would spent hours playing with it when I was supposed to be programming it.

I hope that others can find joy in it too.

For more info or to purchase, see [zeptocore.com](https:&#x2F;&#x2F;zeptocore.com&#x2F;)