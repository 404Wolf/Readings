---
id: 72cc0796-5f51-480b-8d65-2e97cf80d415
title: The mysterious Casio VZ-1
tags:
  - RSS
date_published: 2024-08-02 13:04:06
---

# The mysterious Casio VZ-1
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-mysterious-casio-vz-1-19114b930ae)
[Read Original](https://blog.jacobvosmaer.nl/0028-mysterious-vz-1/)



In my last post I mentioned my attempts to make sense of the [Casio VZ-1 keyboard synthesizer](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0027-synth-notes&#x2F;#vz1). The reality of how this machine works disagrees with the manual. In this post I will try to make sense of some of what is going on with this machine.

## Algorithms: theory

In theory, the Casio VZ-1 uses a combination of ring modulation and phase modulation between up to 8 &quot;modules&quot; M1 through M8 which I prefer to call &quot;operators&quot; because that is what they are called in the Yamaha DX7 and that synth is much better known. 

The operators are grouped into &quot;lines&quot;. Operator M1 and M2 form line A, M3 and M4 are line B, etc. In the service manual Casio uses numbers for the lines. Line A is actually line 3, line B is line 2, line C is line 1 and line D is line 0.

The operators can be configured to interact in different ways, analogous to how the DX7 has &quot;[algorithms](https:&#x2F;&#x2F;www.righto.com&#x2F;2021&#x2F;12&#x2F;yamaha-dx7-chip-reverse-engineering.html)&quot;. This diagram from the service manual (which is also in the normal manual) purports to show how it works.

![VZ-1 algorithm diagram](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7OWfZEVfKxWI7X-c7TkCOR4ckLgWa53fcoH4nkncnbc&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;assets&#x2F;vz1-algorithms.png) _Image source: Casio VZ-1 service manual_

Each of the four lines can be configured into &quot;mix&quot;, &quot;ring&quot; or &quot;phase&quot; mode. The output of line A-C (or 3-1) is either fed to the output bus or fed into the next even operator via the &quot;external phase&quot; setting. So line A is either audible on its own, or it becomes a phase modulation input for operator M4\. Line B is either heard or it becomes a phase modulation signal for M6\. Same for line C and M8.

Through the &quot;external phase&quot; switches it is possible to create chains of up to 4 lines cascading into the last even operator.

## Algorithms: practice

The manual mentions this nowhere, but if you create a cascade of lines with external phase modulation, then the operator frequencies of all the even operators are the same, and they can be controlled via the lowest even operator.

For example, if you cascade A into B and B into C, then operators M2, M4 and M6 all share the same frequency, which you can control by changing the settings of M2\. The UI lets you change the frequency of M4 and M6 but nothing happens when you do that.

The operator frequency ratio is one of the fundamental parameters in phase modulation synthesis: it determines the sideband frequencies. (The other fundamental parameter is modulation index which determines the amplitude of the sidebands.) It is a big and surprising limitation if you cannot vary the frequency ratios. This also happens when a line is configured in &quot;phase&quot; mode (also called &quot;internal phase&quot;) on the Casio: the operators get locked to the same frequency. And this also is not documented.

But wait, there is more. Imagine you have a cascade of three lines: A into B into C. Operator M4 in line B acts as a choke point for the signal coming out of line A: if M4 is off or has zero amplitude, the sound generated by M1 and M2 becomes irrelevant. This is what the diagram suggests and it is also what happens with DX7 phase modulation. If I turn off operator 4 in the DX7 algorithm below, then it does not matter what the frequency or amplitude of operators 5 and 6 is: their signal won&#39;t get past operator 4.

![DX7 Algorithm 1](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNlCxR3HgtnPpnXY_zciku4G4YNQFYeQKxNjhHtn6eII&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;assets&#x2F;dx7algo1.png) _Image source: [DX7 user manual](https:&#x2F;&#x2F;uk.yamaha.com&#x2F;files&#x2F;download&#x2F;other%5Fassets&#x2F;9&#x2F;333979&#x2F;DX7E1.pdf)_

In reality, if you do the following on the Casio VZ-1:

1. Start with INIT VOICE
2. Enable &quot;EXTERNAL PHASE&quot; on line B and C
3. Enable operator M1 and M6 and disable the rest

![External phase example](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sCndIkfD--oQhEvaEOuCdp9dyFm_PITs5HR7h6MPudYM&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;assets&#x2F;externalphase.png) _Signal flows from left to right. Operators M1 and M6 are enabled, all others are disabled._

You would expect to only hear M6, because M4 acts as a choke point for the signal from M1 and M4 is disabled. But that is not what you hear: you get a phase modulated sound instead of a pure sinewave, which you can also verify by changing the frequency of M1\. How on earth is the signal from M1 getting past M4?

![External phase modulation spectrum](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sPMm08VrJdnONJT-kJqPHnbrNT-Zx4LaN6RSkPx-HPck&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;assets&#x2F;extphase-spectrum.png) _First I play 4 notes with operator M1 and M6 enabled, then with only M6 enabled. You can hear and see how the sound changes from a phase modulated sound with strong sidebands to almost a pure sinewave (with oddly some 4th harmonic distortion)._

## Casio is lying to us

Is my VZ-1 broken? Have I discovered an implementation quirk that nobody on the internet has ever complained about? No and no. My VZ-1 is not broken and on closer inspection at least 1 person on the internet is aware of this problem, and they figured it out for me! Digital synthesizer expert [acreil](https:&#x2F;&#x2F;www.youtube.com&#x2F;@acreil) got roped into a [Gearspace thread about the VZ-1](https:&#x2F;&#x2F;gearspace.com&#x2F;board&#x2F;electronic-music-instruments-and-electronic-music-production&#x2F;1359494-casio-vz-love-just-scored-complete-box-example.html) back in 2021\. The discussion starts off not being very interesting until acreil shows up, who then repeatedly gets contradicted by someone who loudly says things that are wrong, and then to put that all to rest acreil finds the relevant [Casio patent for the VZ series](https:&#x2F;&#x2F;patents.google.com&#x2F;patent&#x2F;US5040448A&#x2F;en) and [drops the bomb](https:&#x2F;&#x2F;gearspace.com&#x2F;board&#x2F;showpost.php?p&#x3D;15645527&amp;postcount&#x3D;63) that the VZ&#39;s don&#39;t do phase modulation at all. They do wave shaping.

Excuse me what now? Yes, pedantically wave shaping is phase modulation with a carrier frequency of 0Hz, but why would you call that phase modulation?

Here is a picture from the patent that shows what actually happens inside a single &quot;line&quot;.

![Figure 7 from patent US5040448A](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sx1qnq-OxpfDj7nFRat97EOugVyJA_KIzi0Q7mw7u9C8&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;assets&#x2F;patent-fig7.png) _Image source: [US patent 5040448A](https:&#x2F;&#x2F;patents.google.com&#x2F;patent&#x2F;US5040448A&#x2F;en)_ 

Note how &#x60;ω0t&#x60; is the phase of operator 0 and &#x60;ω1t&#x60; is the phase of operator 1\. In &quot;internal phase&quot; mode switch SW1 is up, SW2 is down and SW3 is right. The result is that the phase input of the &quot;SIN ROM&quot; of operator 1 is the output of operator 0\. If this was phase modulation, the phase input would be the output of operator 0 _plus_ &#x60;ω1t&#x60;.

So if I use &quot;internal phase&quot; mode with operators M1 and M2, what really happens is that M2 becomes a wave shaper for M1\. But the user manual and the user interface pretend (!!) that this is phase modulation, and you can for instance turn off M1 and hear the signal of M2\. Which is an oscillator stuck at 0Hz. This is impossible because 0Hz is inaudible. acreil figured out for us what actually happens.

&gt; because the total output would be zero when the modulator output is zero, one modulator is always fixed to a minimum amplitude. That&#39;s M1 when M1 and M2 use phase modulation

So when I turn off M1 in the user interface and turn on M2, I actually hear M1 at a low volume through M2\. Who gets it in their head that lying to the user like this is a good idea? acreil goes on to point out:

&gt; You can hear the waveform, pitch, etc. of that modulator even when it&#39;s muted. 

Indeed. Take the following patch:

1. Start with INIT VOICE
2. Set line A to &quot;PHASE&quot; mode
3. Turn on operator M2 and turn off all other operators
4. Now vary the pitch and waveform of M1

In the recording you first hear me change the M1 waveform and then the M1 frequency. M1 is &quot;exciting&quot; the M2 wave shaper.

Why does this work? If you stay close enough to 0 then &#x60;sin(x)≈x&#x60;. In other words if you don&#39;t drive a sine wave shaper hard enough to leave the linear region then you can&#39;t hear that it&#39;s there.

I think this also explains what happens in the [experiment above](#experiment1). Because M6 is enabled, M2 is secretly enabled to act as an exciter for M6\. The signal from M2 can only reach M6 by passing through M4 so the envelope of M4 is wide open _even though M4 is muted in the user interface_. Now when I enable M1 its output gets added to the excitation signal from M2, and ends up driving both the M4 and M6 wave shapers outside their linear region.

Wow.

Tags:[music](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;music.html) 

Edit history

[Back](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;)