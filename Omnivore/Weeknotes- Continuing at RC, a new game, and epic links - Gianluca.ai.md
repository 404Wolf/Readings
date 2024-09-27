---
id: b36a2df0-0143-4757-8ac5-7ecf848158f0
title: "Weeknotes: Continuing at RC, a new game, and epic links | Gianluca.ai"
tags:
  - RSS
date_published: 2024-09-20 16:00:00
---

# Weeknotes: Continuing at RC, a new game, and epic links | Gianluca.ai
#Omnivore

[Read on Omnivore](https://omnivore.app/me/weeknotes-continuing-at-rc-a-new-game-and-epic-links-gianluca-ai-192126186dd)
[Read Original](https://gianluca.ai/2024-38/)



Week 38 of 2024

20 Sep 2024 · 6 min · Gianluca Truda

I started writing weeknotes as part of [learning generously](https:&#x2F;&#x2F;www.recurse.com&#x2F;self-directives#learn-generously) when I [started at Recurse](https:&#x2F;&#x2F;gianluca.ai&#x2F;recurse-init). But the distinction between Recurse and non-Recurse has increasingly blurred and I’d like to continue making weeknotes after I [never graduate](https:&#x2F;&#x2F;www.recurse.com&#x2F;about#never-graduate). To that end, I’m trying out a new format for my weeknotes. Tell me what you think!

See previous weeknotes via the [weeknotes tag](https:&#x2F;&#x2F;gianluca.ai&#x2F;tags&#x2F;weeknotes).

---

## Updates

* Decided to extend to a 12-week batch at the [Recurse Center](https:&#x2F;&#x2F;gianluca.ai&#x2F;recurse-init). You can continue following my progress by filtering for posts with the [Recurse tag](https:&#x2F;&#x2F;gianluca.ai&#x2F;tags&#x2F;recurse).
* “QS Rubicon”: After 8 years of doing extensive self-tracking and [ML-powered Quantified Self projects](https:&#x2F;&#x2F;gianluca.ai&#x2F;quantified-sleep), I’ve decided to just stop collecting most data. I have plenty to say about the whole experience, so it should probably be its own blog post or talk. But the immediate feeling of being “out of control” is still something I’m trying to reflect on.

## Inputs &#x2F; outputs

* Wrote and published 4 posts  
   * [Make games people play](https:&#x2F;&#x2F;gianluca.ai&#x2F;make-games-people-play): What Paul Graham doesn’t tell you about delighting 7-year-olds.  
   * [AImong Us: a reverse Turing Test game](https:&#x2F;&#x2F;gianluca.ai&#x2F;aimong-us-game): Can you outwit a gang of LLMs?  
   * [What OpenAI’s o1 really means](https:&#x2F;&#x2F;gianluca.ai&#x2F;what-o1-means): The AGI is dead. Long live the AGI.  
   * [RC Weeknotes 05](https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-05): Move fast and make games.
* [AAAHHH!](https:&#x2F;&#x2F;github.com&#x2F;gianlucatruda&#x2F;aaahhh) The Creative Coding prompt at RC this week was “Aaaahhhh!” I whipped up something between a click trainer game and a psychological torture device. It also works on mobile if you like torturing yourself on the go.
* Participated in an intense Rock Paper Scissors tournament at RC. It involved multiple rounds of submitting a Python bot (with no dependencies) that played 200 rounds against some simple bots as well as the other participants’ bots. I managed to finish 3rd using a third-order Markov model with a stop-loss heuristic to switch back to the Game Theory optimal random play style.
* Made massive improvements to [my dotfiles](https:&#x2F;&#x2F;github.com&#x2F;gianlucatruda&#x2F;dotfiles) for better macOS package management with advanced Homebrew wizardry, and better LSP configuration for Python and Markdown in NeoVim.
* Improved [PR](https:&#x2F;&#x2F;github.com&#x2F;simonw&#x2F;llm&#x2F;pull&#x2F;571) to &#x60;llm&#x60; with tests.

Try AAAHHH full screen at [aaahhh.vercel.app](https:&#x2F;&#x2F;aaahhh.vercel.app&#x2F;)

## Ideas

* [Industrial techno](https:&#x2F;&#x2F;open.spotify.com&#x2F;playlist&#x2F;58OzzuOaqlkjseZxl7Qmp2?si&#x3D;2fa1032bd5724833) is more powerful than nootropics for high-octane coding.
* My hunch: The selective pressure of gradient descent optimises the explainability out of the model.  
   * Based on [implications of representational superposition](https:&#x2F;&#x2F;youtu.be&#x2F;9-Jl0dxWQs8?t&#x3D;1025).  
   * LLMs favour almost-orthogonal representations (89º-91º) which makes interpretability harder, but adds a ton more “capacity” to the model. My hunch is gradient descent is such a strong pressure on the network that it’s akin to evolutionary pressure on gene networks. The chaos and difficulty of interpretation comes from aggressively optimising for performance.
* “There are no AI-shaped holes” [via Matt Clifford](https:&#x2F;&#x2F;x.com&#x2F;matthewclifford&#x2F;status&#x2F;1834271090295644477)  
&gt; “There are no AI-shaped holes lying around” -&gt; this is how I reconcile the facts that (a) AI is already powerful and (b) it’s having relatively little impact so far. Making AI work today requires ripping up workflows and rebuilding _for_ AI. This is hard and painful to do…
* Leave something for tomorrow: “One of my favorite things to do: Stop working right in the middle of something and leave the unfinished work for the next day. On the next day, you know exactly where to pick up and can start right away. Hemingway, apparently, had the same habit. Here’s the crucial bit: ‘stop when you are going good and when you know what will happen next.’” [via Thorsten Ball](https:&#x2F;&#x2F;registerspill.thorstenball.com&#x2F;p&#x2F;leave-something-for-tomorrow)

## Links

* Google’s [NotebookLM](https:&#x2F;&#x2F;notebooklm.google.com&#x2F;) turns massive quantities of text into almost-perfect podcast discussions. I tried it on my [MSc Thesis](https:&#x2F;&#x2F;gianluca.ai&#x2F;table-diffusion). It happily gobbled up the entire PDF and produced an accessible and almost entirely correct discussion about it in around 5 minutes. I’m shocked to be saying this, but Google absolutely cooked!
* [macmon](https:&#x2F;&#x2F;github.com&#x2F;vladkens&#x2F;macmon), a sudoless CPU&#x2F;GPU&#x2F;power monitor for Apple Silicon. Vlad pipped me to implementing this before I could learn enough Rust. So good, it killed my leading RC project idea.
* [This interview](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;mTa2d3OLXhg) with DHH (creator of ruby on rails). Deeply cracked and charismatic. This got me pumped!
* [Vale](https:&#x2F;&#x2F;vale.sh&#x2F;) \- A linter for prose (which I’m using while writing this post in neovim)
* An [S3 doc](https:&#x2F;&#x2F;youtu.be&#x2F;2ccPTpDq05A) about 1X Technologies’ robot for the home
* [Glow](https:&#x2F;&#x2F;github.com&#x2F;charmbracelet&#x2F;glow) is a handy command line tool for rendering markdown. It doesn’t support streaming, but is nevertheless handy for viewing README etc.
* Pieter Levels (@levelsio) [on the Lex Fridman podcast](https:&#x2F;&#x2F;overcast.fm&#x2F;+AAeZyCWiX34). The personification of a cracked and scrappy developer doing things simply and rapidly.
* [3Blue1Brown video on LLM interpretation](https:&#x2F;&#x2F;youtu.be&#x2F;9-Jl0dxWQs8). As usual for Grant, it’s an excellent video full of intuition pumps. But the [section on superposition](https:&#x2F;&#x2F;youtu.be&#x2F;9-Jl0dxWQs8?t&#x3D;1025) was both mind-shattering and brilliantly visualised.
* [Dylan Beattie’s video on UTF-16 edge cases](https:&#x2F;&#x2F;youtu.be&#x2F;2LiTewGxvr0), told in the most lovely and brilliant storyteller style.

## This week I learned

(Copy-pasted from my &#x60;#TIL&#x60;\-tagged notes in Obsidian from the past week.)

* From [one of Karpathy’s NN:ZtoH videos](https:&#x2F;&#x2F;youtu.be&#x2F;kCc8FmEb1nY)  
   * &#x60;#TIL&#x60; in transformers, a _decoder_ block masks out future inputs with a lower triangular matrix, but an _encoder_ block does not. Thus an encoder can “see the future.” Via [Let’s build GPT: from scratch, in code, spelled out. - YouTube](https:&#x2F;&#x2F;youtu.be&#x2F;kCc8FmEb1nY?t&#x3D;4794)  
   * &#x60;#TIL&#x60; Karpathy has a nice set of intuitions on why Residual &#x2F; skip connections work well: a “gradient superhighway.” Because addition operation means that backprop distributes the gradients equally across branches, so you maintain a direct input-output pathway throughout training, meaning the complex branches don’t choke the training initially. [Let’s build GPT: from scratch, in code, spelled out. - YouTube](https:&#x2F;&#x2F;youtu.be&#x2F;kCc8FmEb1nY?t&#x3D;5294)  
   * BatchNorm is normalising (u&#x3D;0, s&#x3D;1) activations across batch dimension.  
   * LayerNorm is normalising activations across the layer dimension.
* &#x60;#TIL&#x60; about this trick with &#x60;&#x2F;dev&#x2F;tty&#x60;. My current workaround for streaming LLM response but still rendering rich (with glow) at the end: &#x60;llm &quot;write some markdown&quot; | tee &#x2F;dev&#x2F;tty | glow&#x60;
* &#x60;#TIL&#x60; &#x60;cmd+option+H&#x60; hides others on macOS. I use &#x60;cmd+H&#x60; to hide the focussed app all the time, but being able to hide everything but the current app is super helpful for quickly cleaning up. Via [GitHub - dharmapoudel&#x2F;hammerspoon-config: My configuration files for Hammerspoon.](https:&#x2F;&#x2F;github.com&#x2F;dharmapoudel&#x2F;hammerspoon-config)
* &#x60;#TIL&#x60; you can use &#x60;mas&#x60; and &#x60;cu&#x60; alongside homebrew to manage and automatically update non-homebrew apps that are installed via the Mac App Store. Also, instead of &#x60;brew cask uninstall &lt;caskname&gt;&#x60; you can do &#x60;brew cask zap &lt;caskname&gt;&#x60; which may also do additional removal of preferences, caches, updaters, etc. stored in &#x60;~&#x2F;Library&#x60;. — via [this gist](https:&#x2F;&#x2F;gist.github.com&#x2F;ChristopherA&#x2F;a579274536aab36ea9966f301ff14f3f), notes in \[\[Brew-Bundle-Brewfile-Tips-·-GitHub\]\]
* &#x60;#TIL&#x60; ([via Simon Willison](https:&#x2F;&#x2F;simonwillison.net&#x2F;2024&#x2F;Aug&#x2F;21&#x2F;usrbinenv-uv-run&#x2F;)) that with a &#x60;uv&#x60; shebang and some header material, you can make a great deployable Python script &#x2F; app:&#x60;#!&#x2F;usr&#x2F;bin&#x2F;env -S uv run&#x60;  
| 1 2 3 4 5 6 7 8 | #!&#x2F;usr&#x2F;bin&#x2F;env -S uv run \# &#x2F;&#x2F;&#x2F; script \# requires-python &#x3D; &quot;&gt;&#x3D;3.12&quot; \# dependencies &#x3D; \[ \#     &quot;flask&#x3D;&#x3D;3.\*&quot;, \# \] \# &#x2F;&#x2F;&#x2F; print(&quot;Hello world&quot;) |  
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
* &#x60;#TIL&#x60; if you see line endings that are &#x60;^M&#x60; in a CL tool, it’s how unix-like systems represent the Windows line endings &#x60;\r\n&#x60;. So if you do find-replace on the &#x60;\r&#x60; it gets rid of that. Then use &#x60;:set fileformat&#x3D;unix&#x60; in vim and save.
* &#x60;#TIL&#x60; with [GNU strings](https:&#x2F;&#x2F;manned.org&#x2F;strings) you can quickly print all the strings found in a binary. It didn’t seem to work on Rust binaries, so I presume it’s just C. Handy for reverse engineering stuff.
* &#x60;#TIL&#x60; I can use the following workflow to find misspellings in my text files:  
   * &#x60;cat index.md | aspell --lang&#x3D;en_GB list | sort | uniq&#x60;  
   * &#x60;cat content&#x2F;posts&#x2F;**&#x2F;*index.md | aspell --lang&#x3D;en_GB list | sort | uniq&#x60; gave me an alphabetical wordlist to consider for my &#x60;ignore.txt&#x60; list.
* &#x60;#TIL&#x60; with nvim-lspconfig, &#x60;[d&#x60; and &#x60;]d&#x60; map to &#x60;vim.diagnostic.goto_prev()&#x60; and &#x60;vim.diagnostic.goto_next()&#x60; (respectively). A good way to linearly clear warnings and error in neovim.

---