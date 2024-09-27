---
id: 471de683-559f-46e9-99bd-3833c610c96d
title: RC Weeknotes 05 | Gianluca.ai
tags:
  - RSS
date_published: 2024-09-16 00:00:00
---

# RC Weeknotes 05 | Gianluca.ai
#Omnivore

[Read on Omnivore](https://omnivore.app/me/rc-weeknotes-05-gianluca-ai-191fb4d2fd0)
[Read Original](https://gianluca.ai/rc-weeknotes-05/)



Move fast and make games.

16 Sep 2024 · 5 min · Gianluca Truda

Table of Contents

* [Jam-packed: a “claustrophobic” game jam](#jam-packed-a-claustrophobic-game-jam)  
   * [Game 1: AImong Us, a reverse Turing Test where the AI detect YOU!](#game-1-aimong-us-a-reverse-turing-test-where-the-ai-detect-you)  
   * [Game 2: Fluid-Sim Sailor (WIP)](#game-2-fluid-sim-sailor-wip)
* [Yanked back into the AI world](#yanked-back-into-the-ai-world)
* [Contributing to open-source](#contributing-to-open-source)
* [This week I learned](#this-week-i-learned)

Since [joining the Recurse Center (RC)](https:&#x2F;&#x2F;gianluca.ai&#x2F;recurse-init), I’ve been posting about the process, my projects, and what I’m learning. See all the [weekly installments](https:&#x2F;&#x2F;gianluca.ai&#x2F;tags&#x2F;weeknotes) or filter for posts with the [Recurse tag](https:&#x2F;&#x2F;gianluca.ai&#x2F;tags&#x2F;recurse).

---

This was not only my most productive week so far, but also my most socially-engaged one.

I had three excellent and energising coffee chats (thanks Evan, Alexa, and Krishna), presented to the whole of Recurse, and had a number of superb group meetups.

## Jam-packed: a “claustrophobic” game jam

The theme for the Fall 1 ‘24 Game Jam was “claustrophobia.” I had two ideas percolate up:

1. A reverse Turing Test game where you’re in some environment with several LLM-driven NPCs that are trying to figure out who’s not an AI. Your job is to try go undetected as they “close in” on you. I’ve been wanting to experiment with this for ages, since I started doing experiments on LLMs interacting (as bots in a Discord server) as part of some Bountyful prototypes. I also saw [this video](https:&#x2F;&#x2F;youtu.be&#x2F;0MmIZLTMHUw) a few months back and was curious if this could be made into fun gameplay.
2. A 2D fluid simulation sailing game where you have to hit just the right angles with your boat and sails in order to navigate the claustrophobic riverways without crashing into the banks or being caught by other boats.

I ended up building the first one early in the week, and polishing it off to present to Recurse for Thursday presentations.

### Game 1: AImong Us, a reverse Turing Test where the AI detect YOU!

* See the code at [github.com&#x2F;gianlucatruda&#x2F;aimong-us](https:&#x2F;&#x2F;github.com&#x2F;gianlucatruda&#x2F;aimong-us).
* Read more about the game at [in this post](https:&#x2F;&#x2F;gianluca.ai&#x2F;aimong-us-game).

I whipped up a quick prototype quite early, but gameplay was far from fun. LLMs can be exhaustingly-dull and generic by default.

After sharing screenshots of the early version, I got some ideas and suggestions from Krishna about coalitions of AI vs human players that have to try and win some kind of majority without giving themselves up. That prompted me to think more about the game theory and competitive dynamics of the game.

I started with a simple [Werewolf](https:&#x2F;&#x2F;www.wikihow.com&#x2F;Play-Werewolf-%28Party-Game%29) mechanic and having the agents all vote to kill one agent every N messages, after which it’s revealed if the agent was human or machine. That way, there’s a _claustrophobic_ constraint as they close in on the player. This instantly made the game both more fun and more difficult.

I also used the opportunity to try out [uv](https:&#x2F;&#x2F;github.com&#x2F;astral-sh&#x2F;uv) and [rich](https:&#x2F;&#x2F;pypi.org&#x2F;project&#x2F;rich&#x2F;), which have both been great so far! But it’s quite weird going back to Python (my “native language”) after so many weeks of focussing on Rust. I think I miss the compiler.

![Screenshot of AImong Us game in the terminal](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,svi-ViXrA2QC5nXChgKv6VnHizXwgzj-VUZwRZD4mTP4&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-05&#x2F;images&#x2F;aimong-us-screenshot.png)

### Game 2: Fluid-Sim Sailor (WIP)

I also made a significant amount of headway on the [second game idea](https:&#x2F;&#x2F;github.com&#x2F;gianlucatruda&#x2F;fluid-sim) when the prompt for Wednesday’s creative coding session was an excerpt from Italo Calvino’s _Invisible Cities_ that contained the following section:

&gt; …the white and red wind-socks flapping, the chimneys belching smoke, he thinks of a ship; he knows it is a city, but he thinks of it as a vessel that will take him away from the desert, a windjammer about to cast off, with the breeze already swelling the sails, not yet unfurled…

I based it on [this example](https:&#x2F;&#x2F;neuroid.co.uk&#x2F;lab&#x2F;fluid&#x2F;) and the broad strokes of their implementation. I believe that makes it some variant of the Lattice-Boltzmann approach, but I ended up just hacking away at it in various ways that probably make it less of a good simulation, but more fun to build and play with.

It’s still not interactive, but it’s fun to watch. The canvas is sized based on the browser window, so it’s interesting how different window sizes or mobile layout affect the stability of the fluid system.

## Yanked back into the AI world

As our study group for [Neural Networks: Zero to Hero](https:&#x2F;&#x2F;karpathy.ai&#x2F;zero-to-hero.html) has progressed, I’ve found myself being lured back into the world of deep learning. Moreover, I’ve been working with a lot of LLM code this past week with AImong Us and some open source code.

But the real vortex opened up when OpenAI finally released “strawberry” just as I was about to sign off on Thursday night. It reminded me of back when I was in the trenches of building Bountyful in 2023, when it felt like there was some seismic shift in the industry every couple of weeks that shook everything to pieces.

I ended up writing so much about this that I spun it out to [it’s own essay](https:&#x2F;&#x2F;gianluca.ai&#x2F;what-o1-means).

## Contributing to open-source

For most of this year, I’ve been using [llm](https:&#x2F;&#x2F;llm.datasette.io&#x2F;en&#x2F;stable&#x2F;index.html) as my primary way to interact with LLMs. I pretty much live on the terminal and I find the ability to pipe standard input &#x2F; output to and from &#x60;llm&#x60; just like any other \*nix CLI tool to be a force multiplier in my whole workflow.

My only gripe has been the lack of rich text formatting in the terminal. But I recently used [rich](https:&#x2F;&#x2F;pypi.org&#x2F;project&#x2F;rich&#x2F;) for a AImong Us and found it excellent, so I was excited to add this to &#x60;llm&#x60;.

I found an old PR relating to this that had gone dormant, so I decided to nudge things along with [my own contribution](https:&#x2F;&#x2F;github.com&#x2F;simonw&#x2F;llm&#x2F;pull&#x2F;571) that:

1. fixes a mysterious bug that was failing some tests and
2. resolves merge conflicts caused by changes since the older PR was proposed.

## This week I learned

(Copy-pasted from my &#x60;#TIL&#x60;\-tagged notes in Obsidian from the past week.)

* Found a nice solution anyone who wants the simplest and quickest way to have a live reload server:&#x60;npx live-server .&#x60; in the directory worked out of the box for me. It’s running [live-server](https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;live-server) but without installing and setting up a project each time by using [npx](https:&#x2F;&#x2F;www.freecodecamp.org&#x2F;news&#x2F;npm-vs-npx-whats-the-difference&#x2F;), which should already be installed if you have &#x60;npm&#x60;.
* &#x60;:set paste&#x60; puts vim into a mode that prepares it for pasting of content, disabling things that might break formatting such as auto-indenting.
* &#x60;Gdiffsplit&#x60; (which is from git-fugitive?) - #TIL allows for a nice side-by-side git diff in neovim. &#x60;]c&#x60; and &#x60;[c&#x60; to move to&#x2F;from hunks.
* Rust has &#x60;todo!()&#x60; macro and also &#x60;unimplemented&#x60;. Also &#x60;&lt;&lt;&#x60; and &#x60;&gt;&gt;&#x60; bit shift operators! Handy!