---
id: 9f6d041b-4730-479f-837c-16c9f4adee76
title: Casio VZ-1 algorithms
tags:
  - RSS
date_published: 2024-08-03 13:04:16
---

# Casio VZ-1 algorithms
#Omnivore

[Read on Omnivore](https://omnivore.app/me/casio-vz-1-algorithms-19119e02a49)
[Read Original](https://blog.jacobvosmaer.nl/0029-vz-1-algorithms/)



Following on to my [last post](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;), where I found out that the official documentation of the Casio VZ-1 keyboard synthesizer from 1988 contains vague and incomplete information about how the machine works, I want to write down what I wish the manual _would_ have said.

## Recap

Casio does a very poor job of explaining the synthesis engine of the VZ-1\. They never actually say that it does phase modulation but they do not clearly explain that it does wave shaping either. On top of that the user interface causes confusion by things like:

* Letting you change the pitch of an operator in the UI that is in reality locked to 0Hz.
* Having hidden &quot;exciter&quot; operators that are disabled according to the UI but that control pitch and wave shape of another (0Hz) operator.
* Having operators show as disabled in the UI when in fact they are acting as wave shapers and hence letting through signals that the UI suggests should get blocked.
* Etc.

I am not alone in interpreting Casio&#39;s information to mean that the VZ-1 uses phase modulation. In an October 1989 [Music Technology review](https:&#x2F;&#x2F;www.muzines.co.uk&#x2F;articles&#x2F;casio-vz8m&#x2F;152) of the related Casio VZ-8M, for example, the reviewer calles the synthesis engine a

&gt; digital synthesis system which, in conceptual terms, could loosely be considered as a user-configurable version of Yamaha&#39;s FM synthesis

Similarly Sound on Sound [wrote](https:&#x2F;&#x2F;www.muzines.co.uk&#x2F;articles&#x2F;casio-vz8m&#x2F;5749) in February 1990:

&gt; the simple two module stacks are like two operator pairs in FM, the parallels are like parallel sets of operators

The 1988 book &quot;POWER PLAY VZ!&quot; by De Furia and Scacciaferro, which is a kind of third party manual for the VZ series, says on page 57:

&gt; The output of M1 phase modulates the DCO in M2

And I could go on. Thanks to [acreil](https:&#x2F;&#x2F;gearspace.com&#x2F;board&#x2F;showpost.php?p&#x3D;15645527&amp;postcount&#x3D;63) we now know there is no phase modulation anywhere in the VZ-1\. So, how do the algorithms really work?

## Single line

The VZ-1 voice has 8 operators (&quot;modules&quot;) grouped in pairs as 4 &quot;lines&quot;. Lines can sound in parallel or they can be cascaded. We start with considering a single line.

![Figure 7 from patent US5040448A](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sx1qnq-OxpfDj7nFRat97EOugVyJA_KIzi0Q7mw7u9C8&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;assets&#x2F;patent-fig7.png) _Image source: [US patent 5040448A](https:&#x2F;&#x2F;patents.google.com&#x2F;patent&#x2F;US5040448A&#x2F;en)_ 

We will consider Line A which consists of operators M1 and M2\. Note that the picture above is 0-indexed so e.g. &#x60;ω0t&#x60; is the phase of operator M1.

### MIX mode

Formula: &#x60;M2 + M1&#x60;.

In the picture this means SW1 down, SW2 down, SW3 left. The signals of M1 and M2 are summed together. M1 and M2 have independent amplitude envelopes, wave shapes and pitches.

### RING mode

Formula: &#x60;M2 * M1&#x60;. Note that the synth UI more correctly states &#x60;M2 + M1 * M2&#x60; but that will get too verbose later on.

This is SW1 down, SW2 up, SW3 right. The product of M1 and M2 is summed with the dry signal of M2\. The product signal amplitude is modulated by envelope 1 and the dry signal of M2 is modulated by envelope 2\. M1 and M2 have independent wave shapes and pitches.

### PHASE mode

Formula: &#x60;M2(M1)&#x60;.

This is SW1 up, SW2 down, SW3 right. **Because SW1 is up, &#x60;ω1t&#x60; (the phase of M2) is ignored.** The output is M1 wave-shaped (distorted) by M2\. Envelope 1 controls the amplitude before the wave shaper and envelope 2 controls the amplitude after the wave shaper (pre- and post-gain). The pitch of M1 determines the overall pitch and the pitch of M2 is ignored. The shape of M1 determines the wave shape of the input signal and the shape of M2 determines the wave shaping curve, i.e. the kind of distortion that is applied to M1.

If you disable M2 there is no sound. If you disable M1 it secretly stays enabled as the exciter of M2\. This is needed because M2 oscillates at 0Hz so without excitation it cannot make sound. All that disabling M1 really does is to override envelope 1 with a constant value (the excitation amplitude).

## Two lines

So what happens if you use an &quot;external phase&quot; cascade of one line into another? Below we assume Line B has external phase on, so Line A cascades into Line B, and Line C has external phase off, so there is no third stage. The image below is again 0-indexed.

![Figure 13 from patent US5040448A](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sh4Rb7nl3ipxP1MYJbOmJXzC2MgR5h8O7WeP9ts258QA&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0029-vz-1-algorithms&#x2F;assets&#x2F;patent-fig13.png) _Image source: [US patent 5040448A](https:&#x2F;&#x2F;patents.google.com&#x2F;patent&#x2F;US5040448A&#x2F;en)_ 

### Line A MIX, Line B MIX: M3 plus the wave-shaped sum of M1 and M2

* Formula: &#x60;M4(M2 + M1) + M3&#x60;
* SW1 is down, SW2 is down, SW3 is left, SW4 is left, SW 5 is down, SW6 is down, SW7 is left, SW8 is right.
* The output is the sum of M3 and M4\. M3 is an independent operator with its own pitch, wave shape and amplitude envelope.
* M4 is a wave shaper with Line A as its input. If M2 is disabled in the UI it secretly remains enabled as the exciter for M4\. Its signal still gets routed through M4 at a fixed volume. Even though M2 is disabled, changing the pitch and wave shape of M2 has an audible effect on the signal coming out of M4.
* If you leave M2 enabled but set its envelope depth to 0 then the same thing happens as when you disable M2: it acts as an exciter for M4.
* If M4 is the only operator that is enabled then envelope 4 controls the amplitude of the resulting sound. The wave shape of M4 determines the wave shaping curve of the resulting sound. The input wave shape and pitch are controlled by M2\. If you set M2 and M4 to a sine wave you will not get a pure sine wave out of M4 because M2 as an exciter drives M4 lightly outside the linear region.

### Line A RING, Line B MIX: M3 plus the wave-shaped ring modulation of M1 and M2

* Formula: &#x60;M4(M2 * M1) + M3&#x60;
* SW1 is down, SW2 is up, SW3 is right, SW4 is left, SW 5 is down, SW6 is down, SW7 is left, SW8 is right.
* The output is the sum of M3 and M4\. M3 is an independent operator with its own pitch, wave shape and amplitude envelope.
* M4 is a wave shaper with Line A as its input. If you disable M2 in the UI it remains active as an exciter for M4 (see above).

### Line A PHASE, Line B MIX: M3 plus doubly wave-shaped M1

* Formula: &#x60;M4(M2(M1)) + M3&#x60;
* SW1 is up, SW2 is down, SW3 is right, SW4 is left, SW 5 is down, SW6 is down, SW7 is left, SW8 is right.
* The output is the sum of M3 and M4\. M3 is an independent operator with its own pitch, wave shape and amplitude envelope.
* M4 is a wave shaper with Line A as its input. Recall that M2 is now also a wave shaper so this time it is not the exciter. Disabling M2 has no effect. M1 is the exciter for M4 and you cannot interrupt the signal flow from M1 through M2 to M4\.
* The only effect of enabling M1 or M2 is that you get to use their respective amplitude envelopes. Because of the series arrangement of M2 and M4, the default envelopes for M1 and M2 result in a lot of wave shaping distortion.

### Remaining two-line combinations

Recall that I have shortened the official notation for ring modulation from &#x60;M2 + M1 * M2&#x60; to &#x60;M2 * M1&#x60;. In other words the dry signal (&#x60;M2&#x60;) in ring modulation is implied.

| Line A | Line B | M4 exciter | Formula            | Description                                                         |
| ------ | ------ | ---------- | ------------------ | ------------------------------------------------------------------- |
| MIX    | RING   | M2         | M4(M2 + M1) \* M3  | M3 ring-modulated with the wave-shaped sum of M1 and M2             |
| RING   | RING   | M2         | M4(M2 \* M1) \* M3 | M3 ring-modulated with the wave-shaped ring modulation of M1 and M2 |
| PHASE  | RING   | M1         | M4(M2(M1)) \* M3   | M3 ring-modulated with the doubly wave-shaped signal of M1          |
| MIX    | PHASE  | M2         | M4(M3 + M2 + M1)   | wave-shaped sum of M1, M2 and M3                                    |
| RING   | PHASE  | M2         | M4(M3 + M2 \* M1)  | wave-shaped sum of M3 and the ring modulation of M1 and M2          |
| PHASE  | PHASE  | M1         | M4(M3 \+ M2(M1))   | wave-shaped sum of M3 and the wave-shaped signal of M1              |

## Three and four line combinations

I won&#39;t spell these out; there are 27 3-line combinations and 81 4-line combinations. I am also doubtful how useful they will be because more and more operators will pass through multiple layers of wave shaping which is a form of distortion.

The exciter operator will be the lowest even operator in the cascade, unless the first line uses PHASE mode in which case the lowest odd operator is the exciter. Three and four-line cascades also introduce another unexpected behavior around excitation. Consider the three-line cascade with all lines set to MIX: &#x60;M6(M4(M2 + M1) + M3) + M5&#x60;. Because M4 acts as a conduit for the exciter M2, M4 can never truly be disabled. This explains the mystery I encountered [previously](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0028-mysterious-vz-1&#x2F;#experiment1). In other words the undocumented &quot;always on&quot; behavior of the exciter also applies to all &quot;exciter conduit&quot; wave-shapers after it, except the last wave shaper in the cascade.

## Conclusion

Casio made such a confusing mess of things with the always-on exciters, the exciter conduits and the wave shapers whose frequencies can be edited in the UI but not in the engine. It is almost a case study in what goes wrong when you lie to the user about what goes on inside the machine. Lying is a harsh word to use but when &quot;disable&quot; does not mean disable then I don&#39;t know what else to call that.

It would have been very hard for the manual to explain all this so pragmatically I understand why it does not tell you what is really going on. The problem is in the design of the synthesis engine, not in the manual.

It looks like Casio came up with some interesting and distinctive synthesis ideas but then failed design this into an understandable system. It [reportedly](https:&#x2F;&#x2F;web.archive.org&#x2F;web&#x2F;20150912075333&#x2F;http:&#x2F;&#x2F;usa.yamaha.com&#x2F;products&#x2F;music-production&#x2F;synthesizers&#x2F;synth%5F40th&#x2F;history&#x2F;chapter02&#x2F;) cost Yamaha 10 years and who knows how much money in R&amp;D to turn their license of phase modulation synthesis (&quot;FM&quot;, license acquired in 1973) into a usable product (the DX7 in 1983). And then there was still more room for improvement and simplification until they released the TX81Z in 1987 which is perhaps the final form of first-generation Yamaha FM. I doubt that Casio was able to spend that much time and money on developing the VZ-1.

I need a break from the VZ-1 now before I return to it to actually make sounds to use in my music, but I had fun learning all this obscure stuff about it.

Tags:[music](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;music.html) [vz-1](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;vz-1.html) 

Edit history

[Back](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;)