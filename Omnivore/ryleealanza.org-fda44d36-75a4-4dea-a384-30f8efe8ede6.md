---
id: fda44d36-75a4-4dea-a384-30f8efe8ede6
title: ryleealanza.org
tags:
  - RSS
date_published: 2024-06-13 22:00:40
---

# ryleealanza.org
#Omnivore

[Read on Omnivore](https://omnivore.app/me/-19014fe8bfb)
[Read Original](https://ryleealanza.org/posts/weeknote-240613/)



A “weeknote”, I am told is not like a blog post, and yet here I am putting this first one on my blog. I am sovereign of my domain name, I shall do as I see fit. Expect: bullet-journal style reflections. Also I think these are usually supposed to be a Friday sort of thing, but here I am writing one on a Thursday. It’s a really Friday-feeling Thursday, in my defense.

* Somehow I signed myself up for a bit more than usual this week.
* Today I gave a little 5-minute talk on my _seamstress_ program for the first time.
* More about it later, but the preparation for it somehow managed to be a bit of a Hail Mary moment
* On Saturday, I’m performing a set of live-coded music at Wonderville, here in NYC.
* Don’t tell anyone (lol) but I really need to buckle down and rehearse.
* Somehow I decided that I wanted to add unit tests to seamstress over the weekend.
* They’ve been really helpful so far!
* Seamstress is kind of annoying to test from Zig:
* All the “real action” (by design) happens in the Lua layer, and calling into Lua from Zig gets mind-bendy and verbose quite quickly.
* Additionally, (again, by design) there isn’t a ton of heavy business logic happening in Zig?
* Like, I ran into some endian-ness surprises when parsing hex numbers as RGB colors, but that’s about it
* But from Lua’s perspective, since the Zig event loop and Lua VM are all set up, there’s _plenty_ to test
* Anyway, all of this is to say I’m using Busted, a Lua testing framework
* But I quickly discovered that Busted tests have no builtin support for asynchronicity
* This is an issue for testing the actual operation of seamstress 2, because idiomatic (lol) seamstress code makes use of several provided callbacks
* So what’s a Rylee to do?
* I ended up hand-rolling a &#x60;Promise&#x60; type and &#x60;async&#x60; &#x2F; &#x60;await&#x60; functionality heavily inspired by JavaScript.
* Here it is in action

&#x60;&#x60;&#x60;lua
  -- calling Promise creates a Promise type
  p &#x3D; seamstress.async.Promise(function()
    print(&#39;hello from the promise&#39;)
  end)
  print(p)
  -- output:
  -- seamstress.tui.Promise 0x[some address]
  -- &#39;hello from the promise&#39;

  -- calling async creates a function which returns a Promise
  f &#x3D; seamstress.async(function(x, y)
    return x + y
  end)

  -- we can either chain the Promise with &#x60;anon&#x60;
  -- (&#x60;then&#x60; is a reserved word in Lua)
  -- or when in an async context, we may &#x60;await&#x60; it
  f(5, 4):anon(function(x) print(&#39;we got &#39; .. x .. &#39; folks!&#39;) end)
  -- output:
  -- we got 9 folks!

  g &#x3D; seamstress.async.Promise(function()
    local z &#x3D; f(13 ,3):await()
    print(&#39;we got &#39; .. z .. &#39; this time folks!&#39;)
  end)
  -- output:
  -- we got 16 this time folks!
&#x60;&#x60;&#x60;

* the implementation was truly brain-breaking and yet ultimately very simple code to write:
* under the hood, a &#x60;Promise&#x60; executing Lua code puts a short timer onto the Zig event loop. This timer resumes execution of the Lua function until it’s finished.
* Awaiting a &#x60;Promise&#x60; is as simple as yielding until that &#x60;Promise&#x60; is resolved, and then reaching into its stack and grabbing the values.
* Many thanks to Jeremy Kaplan and Kyle Edwards for talking me through the gnarly bits.
* Anyway, getting that right somehow ate most of the early part of my week.
* Glad it did, but I might have been less stressed today if I had, y’know, not wanted so badly to get that working.
* Oh I made a little minesweeper demo game in seamstress 2.
* It runs in the terminal; the whole code for the game is 236 lines of code, which feels like a reasonable, small number.