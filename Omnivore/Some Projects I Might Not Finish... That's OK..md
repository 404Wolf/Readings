---
id: b4c282e0-06c9-11ef-ac81-733df2f57343
title: Some Projects I Might Not Finish... That's OK.
tags:
  - RSS
date_published: 2024-04-30 00:00:00
---

# Some Projects I Might Not Finish... That's OK.
#Omnivore

[Read on Omnivore](https://omnivore.app/me/some-projects-i-might-not-finish-that-s-ok-18f2e120dc6)
[Read Original](https://aaronstrick.com/posts/wip-projects)



I&#39;m in awe of those among us who can complete a project, document it, and then put it online. You are amazing. And thank you for your hard work.

I start projects, and I usually don&#39;t them. Somehow, before I get to the end, my enthusiasm wanes. Something in life forces me on a break, I lose momentum, and then before I can get back into it, I&#39;m excited about something new.

The result is that I rarely share my projects online. And I sometimes feel down on myself. Why don&#39;t I finish? Can&#39;t I get it together to put my learnings out there in the world? I&#39;m so thankful for the people who do. Why can&#39;t I get it together to be one of _those_ people.

However, sometimes I feel the opposite. I don&#39;t care that I don&#39;t finish! I only work on things I&#39;m excited about! How fun is that? There&#39;s a ton of learning that happens at the beginning and middle of a project. Who even needs the end? It&#39;s all for me - so what does it matter that it&#39;s not done!

So, I wanted to try something new. Instead of waiting until the end of these projects to document them, here&#39;s a little snapshot of the middle.

## Motor Synth

I&#39;m building a stepper motor based synthesizer.

Currently - it&#39;s a piece tupperware with two stepper motors, a contact microphone, a couple of potentiometers, and a [Teensy 4.1](https:&#x2F;&#x2F;www.pjrc.com&#x2F;store&#x2F;teensy41.html).

#### Video Preview

The video shows the motor synth in action. I&#39;m sending midi out from bitwig to the synth device, and I&#39;m capturing audio from the contact microphone that&#39;s placed on the box.

As I turn the knob, I detune the synths from one another.

Then, as I flip the switch, I put the synth into a mode where the second stepper motor moves up and down in half steps - so it acts as multiple voices together.

#### Inspiration:

I also really enjoy the youtube channel by a creator who makes contact microphones - [Metal Marshmellow](https:&#x2F;&#x2F;www.youtube.com&#x2F;@metalmarshmallowllc) and wanted an excuse to put one of his mics to use.

I&#39;ve seen a professional product based on the same idea, but it costs tons of money.

#### TODO

* I want to shield the contact microphone to reduce noise
* I want to put it in a &quot;real&quot; enclosure
* I want to add a midi port in (instead of just sending midi) over USB
* I want to add a few more pots to effect the sound
* I want to add two more stepper motors
* I want to provide a few more modes for changing how the motor voices relate to another
* Heck - I want to put a spring reverb INSIDE.

## AIS Boat Tracking

I recently moved into an apartment that has a view of the Golden Gate. From my window, I can watch big cargo ships and tankers enter and leave the San Francisco Bay.

I want to put an e-ink screen next to my window that turns it into an art gallery. As boats pass under the bridge, it will display the name of the boat, the destination, and the flag it flies under.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,skdf0UieeXw4wVMQmFn1716j3KtjFeqmzo7ztah4XZqY&#x2F;https:&#x2F;&#x2F;aaronstrick.com&#x2F;posts&#x2F;images&#x2F;posts&#x2F;wip-projects&#x2F;sdr-signal.jpg)

I&#39;m definitely getting... some signal... but not quite right

#### Background

I&#39;m obsessed with checking [vesselfinder.com](https:&#x2F;&#x2F;vesselfinder.com&#x2F;) each time I see a boat pass by. I emailed them, and a few other companies to see if I get could API access for a free or hobby tier.

However, none of them offered this data for cheap, and I got quoted prices like $160USD &#x2F; month - far to much for my silly little project.

But then it hit me!! The boats are BROADCASTING this information. I have perfect line of sight! Why can&#39;t I just... listen for this data myself!

I&#39;ve been around people before who are excited about Software Defined Radios, but I never really understood why, but now I do!

So, I bought an [rtl-sdr](https:&#x2F;&#x2F;www.rtl-sdr.com&#x2F;), and I&#39;m now getting signals!

#### TODO

I have much to do for this project.

* Calibrate my rtl-sdr

(I seem to be getting signals, but not on the frequencies I&#39;d expect, which is causing the [ais decoder](https:&#x2F;&#x2F;github.com&#x2F;dgiardini&#x2F;rtl-ais) to think it&#39;s not getting any messages.

* Save the data onto the server, and create a web endpoint for it
* Buy an e-ink screen, and maybe an ESP32 or something.
* Write the client code
* Make a nice enclosure for that.
* Mount it to my wall

Oh so much to do!

## Jukebox &#x2F; Custom Music Player

I call it my Spotify killer, but it&#39;s a way of distributing my terrible [songs](https:&#x2F;&#x2F;aaronstrick.com&#x2F;music) so that I can play them from my phone.

It&#39;s borked in a number of ways -- but you can definitely listen to my songs on it.

![Look - you can install it on to your phone!](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s49aKM2oY2o_7RlGFjuOWh6CFSNPNHBbxPTq56n1GO2Y&#x2F;https:&#x2F;&#x2F;aaronstrick.com&#x2F;posts&#x2F;images&#x2F;posts&#x2F;wip-projects&#x2F;jukebox.jpg &quot;Look - you can install it on to your phone!&quot;)

Look - you can install it on to your phone!

#### An Exciting Future

A friend of mine, who is a [real musician](https:&#x2F;&#x2F;samreidermusic.com&#x2F;) is releasing a series of compositions that tell the story of [The Golem](https:&#x2F;&#x2F;www.samreidermusic.com&#x2F;news&#x2F;the-golem-and-other-tales). He&#39;s commissioned some beautiful artwork to accompany the music that&#39;s meant to tell the story alongside it.

His hope, is a webpage for listening to the piece that displays the artwork in sync -- something that traditional music distribution services really don&#39;t offer.

So, I&#39;ve done some experiments to adapt my player to suit his need -- and to see if I can embed it directly into a squarespace site.

#### 😬

This is the scariest project to &quot;not finish&quot; - because it&#39;s for someone else.

#### TODO:

* Make it so it&#39;s not... super broken
* Syncronize images to musical timing
* Make it match the professionalism of my friend, rather than the jank that works with my extremely unpolished songs.

### Web Mentions:

This site accepts and displays [webmentions](https:&#x2F;&#x2F;indieweb.org&#x2F;Webmention &quot;Webmentions&quot;) but right now it doesn&#39;t have any...