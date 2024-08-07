---
id: d89937a6-712a-477a-a230-073cc695f380
title: Memories of some fantastic internships
tags:
  - RSS
date_published: 2024-07-31 00:00:00
---

# Memories of some fantastic internships
#Omnivore

[Read on Omnivore](https://omnivore.app/me/memories-of-some-fantastic-internships-19108c758ca)
[Read Original](https://dubroy.com/blog/memories-of-some-fantastic-internships/)



During my CS undergrad at [Carleton University](https:&#x2F;&#x2F;carleton.ca&#x2F;), I had the opportunity to do a bunch of internships.[1](#fn:1) Looking back, I can’t help but think how lucky I was! I got to work on some great teams, learned a ton, and had a lot of fun.

## Corel

My first real internship was on the Linux team at [Corel](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Alludo) in the summer of 2000\. I was super excited about this, for a couple of reasons:

* I had grown up using CorelDRAW.
* I was super into Linux and open source at the time. (As in, I read Slashdot religiously and stayed home on Friday nights to recompile my kernel.) So an internship where I got _paid_ to work on open source code was a dream!

I spent the first summer working on [Wine](https:&#x2F;&#x2F;www.winehq.org&#x2F;), which Corel used for the Linux versions of their products (CorelDRAW, WordPerfect, etc). Not only did I learn lots about doing serious development on Linux, but I also learned a ton about the Win32 API.

One of the highlights of the summer was getting to attend the [Ottawa Linux Symposium](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Linux%5FSymposium). For those that don’t know, OLS was a pretty amazing conference. Here’s how [Slashdot described it](https:&#x2F;&#x2F;linux.slashdot.org&#x2F;story&#x2F;00&#x2F;07&#x2F;31&#x2F;1633205&#x2F;ottawa-linux-symposium-2000-tech-rocks):

&gt; If you’ve got some kick-ass new code to add to Enlightenment, go talk to Rasterman. He’s right over there. Want to discuss something you need added to the kernel, and want to show off your source to Alan Cox? He’s sitting down hacking 2.4 while discussing Scooby-Doo. One of the great things about the Linux community is the ability to contact developers first-hand, especially though E-mail. Ottawa Linux Symposium is a testament to the fact that it works just as well in real life, too.

After my internship was over, I stayed on as a part time employee during the school year, working on the [Corel Linux](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Corel%5FLinux) desktop team. I was a full-time intern again the next summer, but things were…different. Most of the Linux team had moved another company ([Xandros](https:&#x2F;&#x2F;web.archive.org&#x2F;web&#x2F;20050205175507&#x2F;https:&#x2F;&#x2F;www.xandros.com&#x2F;news&#x2F;press&#x2F;release1.html)), and those of us that were left ended up working on the FreeBSD port of the .NET CLR.[2](#fn:2)

## Eclipse &amp; SWT

In the fall of 2001, I joined a company called [Object Technology International (OTI)](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Object%5FTechnology%5FInternational) for an internship on the [Eclipse](https:&#x2F;&#x2F;www.eclipse.org&#x2F;) team. OTI was a subsidiary of IBM that was best known for producing VisualAge Smalltalk. They’d also created Eclipse, and at that time, they were just gearing up for the first public release.

Interestingly, many people on the team didn’t have any experience with open source. I remember explaining the basic development process to someone on my team: “So you run &#x60;diff&#x60;, generate a patch, and then send your patch to the mailing list…”

The team I worked on was responsible for [SWT](https:&#x2F;&#x2F;www.eclipse.org&#x2F;swt&#x2F;), the widget toolkit used by Eclipse. This gave me my first exposure to a few different native toolkits: MFC, Motif, and GTK. The main thing I worked on was the CoolBar widget, which earned me the nickname “Coolio” from the team’s TL.

Compared to Corel, the environment at OTI was much more like the stereotypical tech company. While we didn’t have free lunch, we did have a well-stocked kitchen with great breakfast cereals (I was a Corn Pops man), and a pool table and game consoles in the basement. I also remember how at the start of my internship, they apologized that I wouldn’t get my own office — I’d have to share with another intern.

## J9 VM Team

The following summer, I returned to OTI to work on the J9 VM team. This was the same team who’d built the Smalltalk VM for VisualAge Smalltalk, and J9 was (at the time) a Java VM mostly designed for embedded applications.

One of the most memorable parts of this internship was how much Smalltalk code I wrote! Large parts of the VM were written in a kind of portable assembly language, implemented as a Smalltalk DSL. For each each supported platform, there was a “backend” that would translate the portable assembly to native assembly for that platform.

One of the projects I worked on that summer was getting J9 running again on HP-UX (for PowerPC I think, not PA-RISC). The first step was getting the code generation working. As I recall, the HP-UX&#x2F;PPC backend was only partially implemented.

After I got the code generation working, it was a weeks-long process of fixing crash after crash. The first goal was just to get &#x60;j9 -version&#x60; working, and then to run a simple hello world program, and eventually to get a bigger benchmark like SPECjvm running.

Another project I worked on was for PalmOS. As I recall, J9 supported a kind of static linking on PalmOS, where the app bytecode was bundled together with the virtual machine into a native PalmOS app. When done naively, that resulted in some pretty big executables. So my task was to figure out how to make them smaller.

## J9 again: memory management

In winter 2003 I did another internship on the J9 team, this time working on memory management.

As I mentioned, J9 was originally designed for embedded applications, but there was a push to make it work better for server applications. A big thing that needed to change was the garbage collector. So my colleague had taken on the task of writing a brand new memory management framework for J9 and a high-performance, parallel garbage collector. My job was to help him out any way that I could.

At the time, I had zero experience with garbage collection, but I picked things up pretty quickly. One of the first things I learned: since the GC needs to traverse every live object and a good portion of the internal VM data structures, any kind of memory corruption (like a dangling pointer) is likely to manifest as a crash in the GC. As we joked: “Always blame the garbage collector.”

So one of my first big tasks was to work on a heap verifier, aka “GC check”. The idea was to have a command line option (&#x60;-Xcheck:gc&#x60;) that would verify the state of the heap, and other GC-relevant VM structures, before and after every garbage collection. That way, when a crash got sent our way, we could pretty easily tell whether it was something _caused_ by the GC or not. It was basically a perfect starter project.

It was an 8-month placement, but it worked out so well that I ended up spending the next four years there — working part time while I finished my degree, and then accepting a permanent job in 2004\. I stayed there until 2006, when I got the urge to go back to school and do my master’s in human-computer interaction.

I learned an incredible amount of things from my time on the J9 team. Not only about memory management and systems programming, but about good engineering practices. I remember being struck by the size and scale of the build and test lab: 25m² or so, packed with all kinds of different hardware — from beefy rack-mount servers to [Pocket PCs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Pocket%5FPC) and [Palm Pilots](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;PalmPilot). You’d arrive in the morning to find out you’d broken the build on some architecture you’d never heard of until then.

Looking back, I really can’t believe my luck in getting to work on something so technically challenging, but also high impact. Getting to help build a brand-new parallel GC framework from the ground up — as an intern! With one other person![2](#fn:2) Pretty amazing.

One of the things I really miss from this period of my career was how frequently I got thrown into the deep end. I joined teams that I was not at all qualified for, and was handed projects that required expertise that I didn’t (yet) have. And this was totally expected!

---

1. I’m using the term _internship_ here but in Canada we call them “co-op work terms”. [↩](#fnref:1 &quot;Jump back to footnote 1 in the text&quot;)
2. I don’t remember the exact timeline, but the team did eventually grow bigger, I guess once it became clear that the project was going to succeed. [↩](#fnref:2 &quot;Jump back to footnote 2 in the text&quot;)