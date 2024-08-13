---
id: 54ebc23d-0ff0-40ca-b7a9-0456edcc883a
title: Computer Engineering Resources | cceckman, from the Internet
tags:
  - RSS
date_published: 2024-07-13 09:00:52
---

# Computer Engineering Resources | cceckman, from the Internet
#Omnivore

[Read on Omnivore](https://omnivore.app/me/computer-engineering-resources-cceckman-from-the-internet-190acf3db31)
[Read Original](https://cceckman.com/writing/computer-engineering-resources/)



A [Recurser](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;8238c6d9149cbd0865752e535795d509)  recently asked me about my background with computer engineering, and what resources I’d recommend from learning more.

A lot of what I know about computer engineering and computer architecture comes from my [education and work experience](https:&#x2F;&#x2F;cceckman.com&#x2F;resume&#x2F;), namely: an undergraduate degree, plus several years writing software for custom silicon.[1](#fn:1)

Since not everyone can walk that path, here’s some resources! Some I’ve tried myself; others are what I’d try if I were starting out today. I have received no compensation from any of the parties&#x2F;projects mentioned.

Enjoy!

## Getting started: _From NAND to Tetris_

_&lt;https:&#x2F;&#x2F;www.nand2tetris.org&#x2F;&gt;_

This course starts with Boolean logic and builds up to a full 16-bit computer. And then goes further, into compilers and VMs!

This starting point skips over the more “electrical” side of things, like how to construct logic gates and memories out of transistors.[2](#fn:2)But it’s a great place to start if you’re coming from a programming background.

I haven’t gone through this course; I’ve heard good things from folks who have.

## Playing with logic: Logisim (Evolution)

_&lt;https:&#x2F;&#x2F;github.com&#x2F;logisim-evolution&#x2F;logisim-evolution&gt;_

Logisim provided a visual editor and simulator for digital logic. Drag-and-drop logic gates and wires, watch them toggle on and off. I used it during my first digital logic design course to prepare for all the labs.

The original Logisim has been [retired](http:&#x2F;&#x2F;www.cburch.com&#x2F;logisim&#x2F;retire-note.html)by the author, but there seems to be an actively-maintained fork called [Logisim Evolution](https:&#x2F;&#x2F;github.com&#x2F;logisim-evolution&#x2F;logisim-evolution).

It looks like the [Nand to Tetris](#nand2tetris) course has its own simulation software, so you may not need Logisim if going down that path.

## Historic Hardware: Ken Shirriff’s blog

_&lt;https:&#x2F;&#x2F;www.righto.com&#x2F;&gt;_

Ken takes apart integrated circuits, like an [8088](https:&#x2F;&#x2F;www.righto.com&#x2F;2024&#x2F;04&#x2F;intel-8088-bus-state-machine.html) or [Pentium](https:&#x2F;&#x2F;www.righto.com&#x2F;2024&#x2F;07&#x2F;pentium-standard-cells.html) processor, and reverse-engineers them.

“Normal” computer engineering involves lowering logic constructs to netlists, then to gates, then to transistors with a physical layout. Ken goes the other direction, reasoning from the physical artifact back into logic blocks.

Ken does a lot of explaining along the way. He covers the historical context of the IC, the technical basis of how the components work, and they “why” of doing things one way or another.

## Textbook: _Computer Organization and Design_

_Computer Organization and Design_ by Patterson and Hennessey is a very common college textbook; I’d say it’s good for a second or third course in computer architecture (i.e. after [nand2tetris](#nand2tetris)).

I held on to my copy after university. I think it does a good job of giving real examples, and talking about the engineering tradeoffs of different choices.

As of 2024, I’d recommend one of the “[RISC-V](#risc-v) editions” (2017 or later) – see the next heading.

## Open Standard: RISC-V

_&lt;https:&#x2F;&#x2F;riscv.org&#x2F;&gt;_

Recent editions of [CO&amp;D](#textbook) are based around RISC-V, an [instruction set architecture](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Instruction%5Fset%5Farchitecture) that is

1. freely licensed, and
2. designed for use in teaching computer architecture.[4](#fn:4)

The first volume of the [specification](https:&#x2F;&#x2F;riscv.org&#x2F;technical&#x2F;specifications&#x2F;) is littered with comments about the engineering implications of different choices; I find it a very interesting read.

Since RISC-V is freely licensed, there’s a bunch of implementations that you can read, [use](#fpgas), and learn from. “Implement a RISC-V CPU” is a common project, too, once you have some background (and a little ambition!)

## Getting real

One of the fun things about computer engineering is that you can make a project tangible – after all is done, you can _touch_ it. [5](#fn:5)

You should always start by testing a design with simulation. After that…

### Components and breadboards

For simple designs, you can get a [breadboard](https:&#x2F;&#x2F;learn.sparkfun.com&#x2F;tutorials&#x2F;how-to-use-a-breadboard&#x2F;all), some [7400-series chips](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;7400-series%5Fintegrated%5Fcircuits), and miscellaneous switches and LEDs – and see everything work!

This is exactly what I did in my first computer engineering labs, after simulating the solution in [Logisim](#logisim). It’s very satisfying!

It’s not easy to scale up to larger designs, though. And if you design is dynamic (has a clock), you might need an oscilloscope to debug it.

### Field-programmable gate arrays (FPGAs)

[FPGAs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Field-programmable%5Fgate%5Farray) are reprogrammable hardware, which can host more complicated designs.

In the last 5-10 years, there’s been some nice trends in making FPGAs accessible to hobbyists and unaffiliated students:

* Some generous folks have built open-source toolchains for using FPGAs.[6](#fn:6)I haven’t played much with these tools, but this [index from Yosys](https:&#x2F;&#x2F;github.com&#x2F;YosysHQ&#x2F;oss-cad-suite-build) looks like a good starting point.
* You can buy development platforms at reasonable prices.[Fomu](https:&#x2F;&#x2F;tomu.im&#x2F;fomu.html) is a neat little object: an FPGA that sits in your USB port. For a more complete platform, I’ve heard good things about [ULX3S](https:&#x2F;&#x2F;www.crowdsupply.com&#x2F;radiona&#x2F;ulx3s).
* At least in the hobby universe, there now are [hardware description languages](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Hardware%5Fdescription%5Flanguage)that are easier to understand than the incumbents (Verilog and VHDL).[7](#fn:7)  
I see [Bluespec](https:&#x2F;&#x2F;github.com&#x2F;B-Lang-org&#x2F;bsc), [Migen](https:&#x2F;&#x2F;github.com&#x2F;m-labs&#x2F;migen), and [Amaranth](https:&#x2F;&#x2F;github.com&#x2F;amaranth-lang&#x2F;amaranth) discussed. I don’t have experience with any of them, but it’s probably worth trying one or more before diving into Verilog&#x2F;VHDL.

### Tiny Tapeout

_&lt;https:&#x2F;&#x2F;tinytapeout.com&#x2F;&gt;_

Creating an integrated circuit is a pretty complicated process – expensive if you go to the experts.[8](#fn:8)

Tiny [Tapeout](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Tape-out) looks like a neat project. By putting many small projects into a single integrated circuit, they can amortize the per-IC costs, putting custom silicon into the “reachable for classrooms” price category.[9](#fn:9)

Their site also has articles on digital design, silicon manufacturing, and related topics. I haven’t reviewed those articles, or used the service, so consider this heading “something Charles is curious about” rather than a recommendation.

## Your advice?

I’d love to hear from you:

* If you used one of these resources and it was &#x2F; wasn’t helpful, or
* If there’s a resource you found helpful that I didn’t mention!

You can reach me by:

---

1. My job was writing software, not designing hardware. But if you spend hours each week talking shop with hardware engineers, you pick up some things. [↩︎](#fnref:1)
2. I find “making logic out of electricity” fascinating, which is why [Ken Shirriff’s blog](#righto) is on this list too. [↩︎](#fnref:2)
3. I don’t do any affiliate links, at time of writing. Look this up at your local (or global) bookseller. [↩︎](#fnref:3)
4. This is not a coincidence: Patterson and Hennessey are some of the original [RISC](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Reduced%5Finstruction%5Fset%5Fcomputer)proponents, and Patterson is involved in the RISC-V organization. [↩︎](#fnref:4)
5. I have a dream of using pressure-actuated valves to take [the hydraulic analogy](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Hydraulic%5Fanalogy) way too far. Someday! [↩︎](#fnref:5)
6. By contrast, my university courses required use of a Windows-only toolchain to model, synthesize, etc. [↩︎](#fnref:6)
7. In talking with my collegues at my last job, I got the impression that there was an East-coast &#x2F; West-coast divide in which of these languages are taught and use used. If you’ve used VHDL or Verilog professionally, I’d love to [hear from you](#callout): Where was your school &#x2F; company based? Which did it use? [↩︎](#fnref:7)
8. You _can_ make an IC in your garage, if [you really want to](http:&#x2F;&#x2F;sam.zeloof.xyz&#x2F;second-ic&#x2F;). I don’t want to – I don’t know enough chemistry to handle “something-fluoride” safely, but I know enough to know _I_ shouldn’t touch it. [↩︎](#fnref:8)
9. It’s not clear to me how open Tiny Tapeout is to individual &#x2F; hobbyist submissions. The [Zero to ASIC](https:&#x2F;&#x2F;zerotoasiccourse.com&#x2F;) course, linked Tiny Tapeout, includes a slot on a Tiny Tapeout shuttle. But, y’know, check the price tag and your wallet. [↩︎](#fnref:9)