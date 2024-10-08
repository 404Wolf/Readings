---
id: 2ca8dca2-baba-4e98-9758-1e5e16bffc37
title: tinyping's stack
tags:
  - RSS
date_published: 2024-05-28 00:00:00
---

# tinyping's stack
#Omnivore

[Read on Omnivore](https://omnivore.app/me/tinyping-s-stack-18fbf3d906c)
[Read Original](https://bytes.zone/micro/tinypings-stack/)



_Brian Hicks, May 28, 2024_

Hey! It&#39;s been a couple weeks. The big piece of progress is on tinyping: I&#39;ve gotten unstuck by making different technical choices. Instead of using Elm for this, I&#39;m using XState, Automerge, Tailwind CSS, and Svelte. This has forced me to learn some new things, which was a byproduct I wanted! Here are my impressions of each:

* **[XState](https:&#x2F;&#x2F;xstate.js.org&#x2F;):** I&#39;m using version 5, which moved focus from state charts to an actor model. I&#39;m fine with that; I love both of those models. I&#39;ve been having a little trouble pinning down exactly what I want the models to be in XState, but they feel pretty solid once I get there.
* **[Automerge](https:&#x2F;&#x2F;automerge.org&#x2F;):** Works fine. Stores data, syncs data. Only two problems: first, it&#39;s not clear how to do schema migrations. There was some work on that in [Cambria](https:&#x2F;&#x2F;github.com&#x2F;inkandswitch&#x2F;cambria-automerge) but it seems stalled. The bigger problem is that the core logic of the library is distributed as a WASM blob, and it&#39;s 1.8 megabytes. OOF. I love the ideas around this but I might switch to a different library just to get away from enormous bundled assets like that. (To be fair, the Automerge team is aware of this and it&#39;s being worked on.)
* **[Tailwind](https:&#x2F;&#x2F;tailwindcss.com&#x2F;):** I&#39;ve seen people raving about this, and finally decided to give it a try. It&#39;s… weird. I&#39;m having to look up a bunch of new ways to do things I&#39;m used to, and it makes my markup feel very visually noisy. The resulting CSS is reasonably-sized, though. I grabbed [Tailwind UI](https:&#x2F;&#x2F;tailwindui.com&#x2F;) to get access to well-written components to copy in and learn from.
* **[Svelte](https:&#x2F;&#x2F;svelte.dev&#x2F;):** I&#39;m just using Svelte (not SvelteKit) and it&#39;s been… fine, I guess. I&#39;ve hit a number of places where I expected a value to be subscribed and then it wasn&#39;t, so I thought that logic was not working when it was actually the UI just stalled. It seems like the upcoming Svelte 5 might have a better way to do this with [runes](https:&#x2F;&#x2F;svelte.dev&#x2F;blog&#x2F;runes). It might make sense for me to switch to React, though: I don&#39;t need a lot of routing for this app but I&#39;d like to eventually have an app running on phones, which looks like it might be tricky with Svelte.

Anyway, I&#39;ve been enjoying working on this and have also had a few ideas about how to solve the onboarding questions I wrote about a couple weeks ago. I&#39;ll see about fleshing those out in writing as I get there!

As a little nice note: we reached the end of the school year and I&#39;m looking forward to other people being in the house during the day again!