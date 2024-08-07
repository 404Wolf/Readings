---
id: c085c334-0ba2-11ef-b6c0-4b78f8c37bc1
title: Stopping thing-a-month
tags:
  - RSS
date_published: 2024-05-06 00:00:00
---

# Stopping thing-a-month
#Omnivore

[Read on Omnivore](https://omnivore.app/me/stopping-thing-a-month-18f4dd75f79)
[Read Original](https://bytes.zone/micro/stopping-thing-a-month/)



_Brian Hicks, May 6, 2024_

I&#39;m going to have to stop doing thing-a-month. I really love it as an idea, but it&#39;s not working out so well for me:

* it turns out I&#39;m pretty good at planning projects like this, but when I have such limited free time it&#39;s way too easy to overcommit.
* trying to figure out how to build a business around a tiny idea in a month is a bit much.
* doing that _and writing about it_ is even more work.

Taken together, it basically means I&#39;m overcommitting, then having to be accountable for it in public. Not a great combination for me mentally; I&#39;m avoiding building things that I want and that I think sound fun to make!

So something&#39;s gotta change.

Instead, I think I&#39;m going to drop the thing-a-month commitment and instead commit to writing weekly updates here. I&#39;ve noticed it&#39;s better for me to be able to commit to steady progress than big epic effort. (That&#39;s probably true of a lot of people, but I think we&#39;re conditioned by storytelling to think that the epic efforts are the better choice.)

Anyway.

Here&#39;s what I&#39;ve been working on:

* I really love the idea of tinyping and I&#39;d like it to exist in some form in the world.  
   * As a reminder, there are a few apps that do this already (see a list at [Beeminder&#39;s page about this](https:&#x2F;&#x2F;doc.beeminder.com&#x2F;tagtime)) but none of them sync the data anywhere, making it harder to get pings during the time when you&#39;re doing what you&#39;re doing. In the interests of making the data entry easier, I&#39;m trying to solve this problem by using [automerge](https:&#x2F;&#x2F;automerge.org&#x2F;) as the storage layer (which also makes it local-first software!)
* Because of some trouble I had keeping types straight between Elm and TypeScript (as well as similar pains I had at work) I started making something I&#39;m calling elm-duet. It accepts an interop schema using [JSON Type Definitions](https:&#x2F;&#x2F;jsontypedef.com&#x2F;) and generates both the Elm and TypeScript code. I spent most of April working on this, and it&#39;s almost ready for release. It has some ergonomic issues in the generated code, but it&#39;s definitely a step up already.

The plan going into this week is to (re)write the README for elm-duet and get that released. It&#39;s not the most polished piece of software yet, but I think it&#39;s worth getting out there as an idea. We&#39;ll see where we end up next Monday!