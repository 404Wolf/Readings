---
id: 1bf84a21-be59-4344-bb76-12e5194f7cc5
title: One Million Checkboxes | eieio.games
tags:
  - RSS
date_published: 2024-06-25 00:00:00
---

# One Million Checkboxes | eieio.games
#Omnivore

[Read on Omnivore](https://omnivore.app/me/one-million-checkboxes-eieio-games-190555bb384)
[Read Original](https://eieio.games/nonsense/game-14-one-million-checkboxes/)



I made a website. It’s called [One Million Checkboxes](https:&#x2F;&#x2F;onemillioncheckboxes.com&#x2F;). It has one million checkboxes on it. Checking a box checks that box for everyone (and makes some numbers go up).

You can find it at [onemillioncheckboxes.com](https:&#x2F;&#x2F;onemillioncheckboxes.com&#x2F;).

## Why

I don’t really know. The idea came up in a conversation last Friday and I felt compelled to make it.

## How

There are a few fun tricks I used here.

* To efficiently store state I use a bit array. Checking box 0 just flips the first bit in that array.
* I store my state in redis since redis can easily flip individual bits of a value.
* I broadcast individual “toggle” updates via websockets and push out a full state snapshot every 30 seconds or so to make sure clients stay synched.
* I use [react-window](https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;react-window) to avoid rendering checkboxes that aren’t in view.

## Is there anything else you’d like to tell us

Not much! This one was fun and fast. I did run into one bug that was _baffling_ \- I’ll tell you about it really quick.

#### Endianness

When we toggle a checkbox, the server does something like this:

&#x60;&#x60;&#x60;pgsql
def set_bit(index, value):
    state[&#39;bitset&#39;][index] &#x3D; value

&#x60;&#x60;&#x60;

Pretty simple! We convert that state to a big array of bytes and ship it to the client[1](#fn:1). The client looks at the state to figure out which toggles are set. My original implementation looked like this:

&#x60;&#x60;&#x60;angelscript
class BitSet {
    constructor(size) {
        this.size &#x3D; size;
        this.bits &#x3D; new Uint32Array(Math.ceil(size &#x2F; 32));
    }

    get(index) {
        const arrayIndex &#x3D; Math.floor(index &#x2F; 32);
        const bitIndex &#x3D; index % 32;
        return (this.bits[arrayIndex] &amp; (1 &lt;&lt; bitIndex)) !&#x3D;&#x3D; 0;
    }

    set(index) {
        const arrayIndex &#x3D; Math.floor(index &#x2F; 32);
        const bitIndex &#x3D; index % 32;
        const mask &#x3D; 1 &lt;&lt; bitIndex;
        this.bits[arrayIndex] |&#x3D; mask;
  }
}

&#x60;&#x60;&#x60;

Does this work?

No! Look at what we get from each of these implementations when we set the first bit:

&#x60;&#x60;&#x60;pf
def set_bit(index, value):
    state[&#39;bitset&#39;][index] &#x3D; value
state &#x3D; { &quot;bitset&quot;: [0 for _ in range(32)] }
set_bit(0, 1)
print(&quot;&quot;.join(str(x) for x in state[&quot;bitset&quot;]))
# &#39;10000000000000000000000000000000&#39;
int(&quot;&quot;.join(str(x) for x in state[&quot;bitset&quot;]), 2)
# 2147483648

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;arduino
&gt; bitset &#x3D; new BitSet(32)
&gt; bitset.set(0)
&gt; bitset
BitSet { size: 32, bits: Uint32Array(1) [ 1 ] }

&#x60;&#x60;&#x60;

Our python implementation treats bit 0 as the leftmost bit of the leftmost byte. In javascript we’re grabbing the _rightmost_ bit of the leftmost byte!

This isn’t _quite_ an endianness problem - really we’re reversing the order of bits in a byte, instead of reversing the order of bytes in a word. But it certainly _feels_ like an endianness bug.

Fixing this meant deciding whether I wanted to model my data as “one million bits” or “125,000 bytes” - and of course realizing that those were two different things. The bug appeared mid-refactor - my original update code hid the error in my data model until you refreshed the page - and so it took me ages to suspect the bit twiddling. In retrospect this was a mistake. Always suspect the bit twiddling.

## Wrapping Up

This site was fun to make. It got me thinking about a new space of collaborative experiences that I want to explore.

It was also really nice to make and ship something in two days! I’ve got a few ongoing projects that I’ve been working on for too long and this was a welcome break (maybe I should just ship those projects too).

Anyway. I hope you enjoy the site, and I’ll be back soon with some larger webcam-based projects :)

1. I originally RLE encoded this but later decided that just shipping 125kb was fine since it saves my server some work. [↩](#fnref:1)