---
id: 940751ef-f50e-48b5-99cb-47c592a0f208
title: Analog video is surprisingly squishy | the weightless state
tags:
  - RSS
date_published: 2024-08-15 22:00:47
---

# Analog video is surprisingly squishy | the weightless state
#Omnivore

[Read on Omnivore](https://omnivore.app/me/analog-video-is-surprisingly-squishy-the-weightless-state-191595ed6c4)
[Read Original](https://metavee.github.io/blog/technical/2024/08/16/analog-video.html)



I spent a bit of my time at the [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;) trying to restore one of the old computers in the collection: the [Olivetti M24](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Olivetti%5FM24). The first problem was figuring out how to connect it to a monitor - the port on the back was a 25-pin DSUB connector, which is not traditionally used for video.

Supposedly the original release had a proprietary monochrome monitor, and later versions had a colour display. This made me feel pessimistic about getting it to work with something off-the-shelf.

[![Vintage ATT 6300](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,std361j9EV8gdmVTQxMva05C1Qrovl-Mqsur706E5n7o&#x2F;https:&#x2F;&#x2F;upload.wikimedia.org&#x2F;wikipedia&#x2F;commons&#x2F;4&#x2F;48&#x2F;Vintage_ATT_6300.jpg?20090127233832)](https:&#x2F;&#x2F;commons.wikimedia.org&#x2F;wiki&#x2F;File:Vintage%5FATT%5F6300.jpg &quot;Blake Patterson from Alexandria, VA, USA, CC BY 2.0 &lt;https:&#x2F;&#x2F;creativecommons.org&#x2F;licenses&#x2F;by&#x2F;2.0&gt;, via Wikimedia Commons&quot;)

However, there are pinouts for the Olivetti graphics card online, and some people have taken the trouble of [matching these up with standard VGA pins](http:&#x2F;&#x2F;hadesnet.org&#x2F;olivettim24&#x2F;docs&#x2F;video%5Fconverter.pdf) \- it seemed doable, even if it meant jamming wires into the ports.

Luckily, I found a few “breakout” adapters on Amazon, with one side being a normal VGA adapter, and the other having individual jumpers corresponding to each pin. This still ended up being pretty messy, but not nearly as bad as it might have been.

![Photo of messy wiring](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sjdudWbbH1ak4MTONMV5nGg9Iy2QV1wyiyf18PUjNiew&#x2F;https:&#x2F;&#x2F;metavee.github.io&#x2F;blog&#x2F;images&#x2F;olivetti_vga&#x2F;vga_adapter_wiring.jpg)

After wiring it up I got some help from [Jessie Grosen](https:&#x2F;&#x2F;jessie.grosen.systems&#x2F;) to double check my work, and to test for any unintentional shorts between pins. This was semantically confusing because there was a red _wire_ and also a wire carrying a red _video signal_ and these were not the same wire.

After plugging everything in and turning it on… the first monitor we tried did not like the signal. But the second monitor did! The BIOS POST screen showed the specs of the computer, including the Intel 8086 CPU and 640 kB of RAM.

![Photo of BIOS POST](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sCv0N8Ax632AaOZC88DmrM8IfJu3VMWWdmd_t2ootO4M&#x2F;https:&#x2F;&#x2F;metavee.github.io&#x2F;blog&#x2F;images&#x2F;olivetti_vga&#x2F;bios.jpg)

From there, it booted into gorgeous Italian DOS (“Olivetti Personal Computer DOS Version 3.30”). I was hoping to test out some 3.5” floppy disks, but unfortunately the drive was perpetually _non pronto_, so I had to call it quits there.

![Photo of failed disk formatting](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sdGYZY5V1nnzJ2ewc_bCTb-ywkpOIf5t89H9fDDQT7BU&#x2F;https:&#x2F;&#x2F;metavee.github.io&#x2F;blog&#x2F;images&#x2F;olivetti_vga&#x2F;non_pronto.jpg)

Between the serial&#x2F;parallel ports on the back and the meagre included software, there must be _some_ way to connect this to a modern computer and move data on and off. That could be a fun “escape room” challenge, albeit for another day.

## The thing that surprised me

You don’t need all the pins!

The wiring that I used doesn’t cover [EDID](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Extended%5FDisplay%5FIdentification%5FData)\-related pins, so it relies on the monitor to autodetect the video signal correctly (resolution, refresh rate, etc.). Surprisingly, this worked on most (but not all) monitors that I tried!

There were other, non-EDID pins on the VGA side that were left unconnected, and this was also more or less fine.

In spite of using an unusually large 25-pin connector, most of the pins on the Olivetti side were also either different kinds of ground or else not connected at all (as can be seen from my wiring photo).