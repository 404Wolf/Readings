---
id: d7fd89f6-efdd-11ee-a2a4-bbe87ef08959
title: Blair Frandeen
tags:
  - RSS
date_published: 2024-03-31 16:28:23
---

# Blair Frandeen
#Omnivore

[Read on Omnivore](https://omnivore.app/me/blair-frandeen-18e97da6e60)
[Read Original](https://datum-b.com/blog/before_starting_something_great)



[ ![Made with LibreOffice](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x75,sq5yoWT5T9cOk2-mynazmdR8nsEOvQAkg9ECalrpVrl4&#x2F;https:&#x2F;&#x2F;datum-b.com&#x2F;static&#x2F;bflogo.png) ](https:&#x2F;&#x2F;datum-b.com&#x2F;index.html)

When considering starting a new technical project, it’s often tempting to aim for high achievement with high stakes. Do that, you’re worth it. Before you do, build yourself a smaller one: low-stakes, low-effort, and not worth putting on your CV. The real thing will be so much easier once you’ve done this.

Building a smaller version of your grand vision gives you the chance to see the end to end process in a short period of time. Seeing the full process allows you to identify key challenges and leverage points to help you plan a bigger iteration. You’ll make mistakes the first time, and if you learn from them, you won’t make them when the stakes are high and the technology and architecture are more deeply entrenched.

This theme of starting small, scrapping, and building bigger has arisen twice for me recently: first in writing a compiler, and then in building a robotic arm.

## Writing a Compiler

I first came across this [excellent three-part tutorial for building a tiny basic compiler](https:&#x2F;&#x2F;austinhenley.com&#x2F;blog&#x2F;teenytinycompiler1.html) just before I came across the even more excellent book on the subject, [Crafting Interpreters](https:&#x2F;&#x2F;craftinginterpreters.com&#x2F;). I made [my implementation](https:&#x2F;&#x2F;github.com&#x2F;blairfrandeen&#x2F;tnybsc) of the former in Rust, which provided me a little more challenge than copying the Python code from the tutorial. In doing so, I learned about the most basic layers of a compiler, how to define and interpret a grammar for a programming language, and how the recursive structure of that grammar can be implemented into a tree-walk interpreter.

Crafting Interpreters gives a much deeper treatment to the subject of interpreting programming languages[1](#fn1). Lox, the language developed for the book, is an object-oriented language, making its implementation significantly more complex than my first exercise.

Knowing this, I looked back on what I’d glossed over with the tiny basic compiler. First, I wanted to give extra attention to error handling. There is nothing more frustrating, when writing a compiler, than trying to figure out if the bug you’re fighting is being caused by an error in the user’s code (in the language you’re implementing) or in your own code. Second, I needed to pay significantly more attention to setting up and running automated test cases. I barely paid attention to this the first time, and I would have had to implement significantly more test cases to be able to safely add new features.

Even with the prior experience and lessons-learned, I am to this day struggling with [my Lox implementation](https:&#x2F;&#x2F;github.com&#x2F;blairfrandeen&#x2F;lurx). It’s been through a few heavy refactors as my understanding of how the language should be implemented has evolved, and working with scoped variables in Rust[2](#fn2) has been challenging.

## Building a Robotic Arm

One of the best ways to write great software while leveraging my mechanical engineering background is by practicing robotics. Having a robotic arm to program seemed like a natural place to start. It’s easy enough to purchase an inexpensive arm, but I passed on this option, as my favorite way to learn a full hardware &amp; software stack is to implement it from the ground up. There are a number of build-it-yourself robotic arms out there, and I did some research into what would be required to build a [Kauda](https:&#x2F;&#x2F;www.diy-tech.it&#x2F;010-kauda), [BCN3D Moveo](https:&#x2F;&#x2F;github.com&#x2F;BCN3D&#x2F;BCN3D-Moveo), or [Arctos](https:&#x2F;&#x2F;arctosrobotics.com&#x2F;) arm, ultimately settling on the [Thor](http:&#x2F;&#x2F;thor.angel-lm.com&#x2F;documentation&#x2F;get-started&#x2F;) arm as being the most capable, best documented, and most likely to succeed. Building a Thor costs at least $400, and 3D printing is estimated to take 200 hours. The FAQ on the Thor website says, “this is a long project, which may take several weeks or months to complete[3](#fn3).” High stakes, high risk.

As I was steeling myself to start purchasing components and melting filament for a Thor, someone sent me a link to the [BrachioGraph](https:&#x2F;&#x2F;www.brachiograph.art&#x2F;en&#x2F;latest&#x2F;), “the world’s cheapest, simplest pen-plotter.” The reference implementation is a hot-glue amalgamation featuring a binder clip, popsicle sticks, and a clothespin. The only things I needed to purchase were some hobbyist servo motors and a Raspberry Pi Zero. It’s claimed that the BrachioGraph can be implemented in under an hour, which may be a fair estimate if your Raspberry Pi is already set up, and you don’t go down the rabbit hole designing and 3D-printing your own parts.

[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sEGBslOqTPaCkRLHAogKFbsh0Dgnp0DLCh7oSpfDG7Iw&#x2F;https:&#x2F;&#x2F;datum-b.com&#x2F;static&#x2F;post_images&#x2F;pen_plotter_plots_pen_plotter_reduced.jpg)](https:&#x2F;&#x2F;datum-b.com&#x2F;static&#x2F;post%5Fimages&#x2F;pen%5Fplotter%5Fplots%5Fpen%5Fplotter.png)

My pen plotter based on the BrachioGraph, plotting… itself, what else! If it can plot itself, is it turing complete? Next up is a humanoid robot featuring AGI!

As of this writing I haven’t reconsidered a real 6-DOF arm, because I’m finding that this pen plotter is already a wealth of knowledge and projects. Can I re-implement the software to run on a Raspberry Pi Pico, an even smaller board, using the PWM-capable GPIO pins? How can I change the software so it draws circles, arcs, and spline curves? Could it be made to interpret an SVG directly rather than requiring its very specific pre-processing steps? How can I tune it to make it more accurate? How can I add a camera and some basic computer vision so that it can play tic-tac-toe or hangman against a human?

## Finishing

On the surface, a compiler for a useless programming language or a plastic robotic arm that can’t draw straight lines look like simple exercises in software or hardware development. They are in fact systems, from which we can learn about the next system. These cheap and rudimentary systems are still complete, and they accomplish a task. The lessons and experience of finishing a system, no matter how small, should not be underrated.

---

1. Arguably, Crafting Interpreters uses the same principle as described in this article, first implementing a tree-walk interpreter to give a broad understanding of the subject matter, and then applying that knowledge to implement a bytecode interpreter from scratch. As of this writing I have only attempted the first half.[↩︎](#fnref1)
2. Crafting Interpreters uses Java for the tree-walk interpreter, and C for the bytebode interpreter. Once again, I chose to use Rust, in part to improve my capabilities in that language, and because using a different language than the textbook forces a deep understanding of the subject matter.[↩︎](#fnref2)
3. I’m an engineer, and all engineers are optimists, especially when it comes to estimating project resources. When I read that a Thor could take several weeks or months, I didn’t think building a Thor could possibly take _me_ that long. Even in the unlikely event that I was right, I’m still glad I took the easier route.[↩︎](#fnref3)

---

[HOME](https:&#x2F;&#x2F;datum-b.com&#x2F;index.html) | [ABOUT](https:&#x2F;&#x2F;datum-b.com&#x2F;about)

[ ](mailto:thoughts@datum-b.com)

© 2022 - 2024 Blair Frandeen. The views expressed here are solely my own and do not reflect those of my employer.