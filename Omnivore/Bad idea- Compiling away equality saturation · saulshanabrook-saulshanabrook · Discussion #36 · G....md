---
id: bb2a8ed6-9d02-4a90-a4ac-c9ba7f430444
title: "Bad idea: Compiling away equality saturation · saulshanabrook/saulshanabrook · Discussion #36 · GitHub"
tags:
  - RSS
date_published: 2024-08-27 05:00:00
---

# Bad idea: Compiling away equality saturation · saulshanabrook/saulshanabrook · Discussion #36 · GitHub
#Omnivore

[Read on Omnivore](https://omnivore.app/me/bad-idea-compiling-away-equality-saturation-saulshanabrook-sauls-1919544158b)
[Read Original](https://github.com/saulshanabrook/saulshanabrook/discussions/36)



Let&#39;s say you have a set of e-graph rules as well as an extraction procedure. Basically an egglog program but a hole where the initial program you want to analyze is.

Could you then abstractly interpret the e-graph process to AOT compile direct input -&gt; output compilation pipeline?

I am sure there is lots of related work in the term replacement ecosystem...

Another fun twist would be to try to do this using egglog itself. Like implement an egglog interpreter in egglog, then feed in the rules, and use equality saturation for partial evaluation :)

cc [@tekknolagi](https:&#x2F;&#x2F;github.com&#x2F;tekknolagi)