---
id: 1aa6ec86-4e90-4462-8460-d880bc943e2c
title: Proud-Pied -- RC Creative Coding | cceckman, from the Internet
tags:
  - RSS
date_published: 2024-06-21 00:00:00
---

# Proud-Pied -- RC Creative Coding | cceckman, from the Internet
#Omnivore

[Read on Omnivore](https://omnivore.app/me/proud-pied-rc-creative-coding-cceckman-from-the-internet-1903d58ba0a)
[Read Original](https://cceckman.com/writing/proud-pied/)



Full-page: [with controls](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;proud-pied&#x2F;controls.html), [without controls](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;proud-pied&#x2F;fullpage.html).

## What’s all this then?

At [RC](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;8238c6d9149cbd0865752e535795d509), there’s a weekly “Creative Coding” event. At the start of the block, someone provides a prompt – often a line from a poem, song, or book. After a couple

The 2024-04-17 session quoted Shakespeare’s [Sonnet 98](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Sonnet%5F98), with the prompt “proud-pied”:

&gt; From you have I been absent in the spring,  
&gt; When **proud-pied** April, dressed in all his trim,  
&gt; Hath put a spirit of youth in every thing,  
&gt; That heavy Saturn laughed and leapt with him.
&gt; 
&gt; Yet nor the lays of birds, nor the sweet smell  
&gt; Of different flowers in odour and in hue,  
&gt; Could make me any summer’s story tell,  
&gt; Or from their proud lap pluck them where they grew:
&gt; 
&gt; Nor did I wonder at the lily’s white,  
&gt; Nor praise the deep vermilion in the rose;  
&gt; They were but sweet, but figures of delight,  
&gt; Drawn after you, you pattern of all those.
&gt; 
&gt; Yet seemed it winter still, and you away, As with your shadow I with these did play.

I didn’t know what “proud-pied” meant, but the prompter glossed it as “gorgeously variegated”.

_Variagated_ is a term familiar [to me](https:&#x2F;&#x2F;www.ravelry.com&#x2F;projects&#x2F;cceckman&#x2F;comet); it was used around my house a lot [growing up](https:&#x2F;&#x2F;edieeckman.com&#x2F;). So my take was to simulate variegated yarn… poorly, as it turns out, but pleasingly.

### Multi-threaded simulation

When the page loads (or the settings are changed), the code simulates several _threads_ of variegated yarn. Each thread has a random starting hue, value, and saturation; a random _speed_ that determines how quickly it varies; and a property to vary (either hue or value).

The rendering code draws column-by-column. It generates a gradient for each thread, and alternates between threads on a per-“stitch” basis.

### This has bugs…

The code isn’t very fast; I haven’t done any work to make it efficient.

The gradients don’t quite work as intended, particularly the hue gradient. I had meant for hues to smoothly cycle around the color wheel, but I realized after implementing this that I hadn’t put in enough control points to make that happen. I suspect the value gradient has a similar issue.

### …and that’s okay

I’ve really enjoyed the creative coding sessions at RC. It’s nice to not have to have a plan going in, and to have no committment to maintain &#x2F; present &#x2F; complete going out – code as a transient artifact.

This was my first experiment with HTML canvas, and I’m pretty pleased with the result. Mistakes and all, I learned from making it.