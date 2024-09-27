---
id: dd4c085c-a43f-4729-96c5-5e6125923ccd
title: microui+fenster=small gui | Max Bernstein
tags:
  - RSS
date_published: 2024-09-07 00:00:00
---

# microui+fenster=small gui | Max Bernstein
#Omnivore

[Read on Omnivore](https://omnivore.app/me/microui-fenster-small-gui-max-bernstein-191ceb3513c)
[Read Original](https://bernsteinbear.com/blog/fenster-microui/)



Sometimes I just want to put pixels on a screen. I don’t want to think about SDL this or OpenGL that—I just want to draw my pixel buffer and be done.

[fenster](https:&#x2F;&#x2F;github.com&#x2F;zserge&#x2F;fenster), a tiny 2D canvas library by Serge Zaitsev, does just that. It’s a tiny drop-in header-only C&#x2F;C++ file that weighs no more than 400 LOC of pretty readable code. It works with WinAPI, Cocoa, and X11\. And it handles keyboard and mouse input, too!

Sometimes I want to do just a little more than draw pixels—maybe have a menu, some buttons, render text—and I don’t want to completely DIY but I still don’t want to think about SDL.

Fortunately, [microui](https:&#x2F;&#x2F;github.com&#x2F;rxi&#x2F;microui) by rxi exists and handles the translation from GUI elements into a simple retargetable drawing bytecode. It’s similarly a small, drop-in library, weighing only 1500 LOC.

Unfortunately, the demo program uses SDL as a backend for the bytecode. I’d been meaning to see if I could instead use fenster but understanding what a “quad” was or what “glScissor” did seemed intimidating. The project went nowhere.

Then, as usual, [Kartik](https:&#x2F;&#x2F;akkartik.name&#x2F;) and I had a small argument and that resulted in us creating the fenster backend for microui! I sent him a skeleton to show what I wanted to do and he did most of the heavy lifting for the OpenGL-like parts.

The result is a less than 250 LOC file that binds microui to fenster. It’s inspired by the SDL renderer demo, but with a couple of added functions to abstract away keys and mouse buttons. It’s hacky and there’s some stuff we still don’t understand, but it works! And by “works” I mean draws the expected demo windows, handles mouse hover and click, and handles keyboard input.

Things left to figure out:

* How to determine when to render from the texture and when from the provided drawing command’s color
* Mod keys like so that, for example, Shift+1 renders !
* Scrolling

Check it out [here](https:&#x2F;&#x2F;github.com&#x2F;tekknolagi&#x2F;full-beans). It’s designed to all be dropped directly into your project.

![microui+fenster demo window in X11](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s4kDuk4wCIWsBPYm6NJ8L9bi33EoukX_ILmgiBAXjHw4&#x2F;https:&#x2F;&#x2F;bernsteinbear.com&#x2F;assets&#x2F;img&#x2F;fenster-microui.png)