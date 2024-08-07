---
id: 0f99deba-fb22-11ee-8803-bf8f87bbae88
title: The origin and virtues of semicolons in programming languages | nicole@web
tags:
  - RSS
date_published: 2024-04-15 00:00:00
---

# The origin and virtues of semicolons in programming languages | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-origin-and-virtues-of-semicolons-in-programming-languages-ni-18ee1b06fd4)
[Read Original](https://ntietz.com/blog/researching-why-we-use-semicolons-as-statement-terminators/)



While working on the grammar for my programming language, Lilac, I was exploring different choices for statement terminators.&#x60;.&#x60; is very appealing, or &#x60;!&#x60;. Ultimately, I might make the &quot;boring&quot; choice of using either &#x60;;&#x60; or significant whitespace.

But that had me asking: why _is_ it that so many languages use semicolons for their statement terminators[1](#or-sep)? I found some [good reading](https:&#x2F;&#x2F;www.werkema.com&#x2F;2022&#x2F;02&#x2F;10&#x2F;we-dont-talk-about-semicolons&#x2F;) about why we have statement terminators at _all_, but little discussion on the specific merits of semicolons over other choices.

To get to the origin of semicolons in our programming languages, I turned to history. There were very few programming languages in the early days, so it&#39;s relatively easy to trace forward and look at _all_ the early languages. If we do this, we find the first language that included semicolons as a statement separator: [ALGOL 58](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;ALGOL%5F58).

Before ALGOL, languages typically used whitespace to mark statements, with each being on its own line (or punch card). ALGOL introduced a statement separator which gave the programmer more flexibility to put multiple statements on one line, or spread one statement across multiple lines. Unfortunately, when we dig into _why_ the semicolon was used, there&#39;s not much of an answer! The original papers about it just describe that _is_ the statement separator but not why.

And where does that leave us? To good old-fashioned speculation!

## Speculation time

There are a few reasons why we would have picked up the semicolon, or why it wound up _somewhere_ in our languages. This is all _speculation_, but the reasoning is sound.

**It&#39;s available.**Early computers had very limited character sets, and the semicolon was often available. Some early input devices were adapted from Remington keyboards, and those (based on the pictures I can find) did include a semicolon and colon. This makes sense, because if you want to enter English text you may run into semicolons occasionally! It&#39;s not the most oft used punctuation, but it&#39;s useful[2](#chemistry). Since it was there, it was bound to wind up _somewhere_ in a language, when we have few characters to choose from.

**It&#39;s convenient.**The semicolon is on the home row without shift on modern keyboards, which I suspect is part of why it continues to be used a lot. (That, and momentum.) Being on the home row makes it super easy to type, so in contrast to something like &#x60;!&#x60;, which requires two keystrokes and a stretch, you can get a &#x60;;&#x60; with just your right pinky. Speaking of which, isn&#39;t it odd that the semicolon is the main one and the more-used colon requires a shift?

**The usage is similar to in English.**One of the jobs of the semicolon in English is to delimit independent clauses; these are parts of a sentence which could stand alone but are closely related. This is very similar to what a statement separator does. More similar would be a &#x60;.&#x60;, as each statement could be thought of as a sentence, but that brings us to another reason to prefer semicolons.

**It&#39;s unlikely to conflict.**If you use a period, the humble &#x60;.&#x60;, you can run into difficulties in parsing if you&#39;re not careful. As my friend put it to me recently, the period is such a _high value_ symbol that you have to be choose wisely what you use it for. In modern languages, we use it for accessing fields and methods, and for defining floating point literals, and it&#39;s in range operators and spread operators. In contrast, the semicolon is... nowhere else, except occasionally when used to start comments.

These are all pretty compelling reasons together to choose a semicolon for a statement separator! What could you choose instead? Running through all the candidates, &#x60;!@#$%^&amp;*,.&#x2F;;:|-_&#x60;, I can&#39;t think of one of these that&#39;s a clearly better choice! My personal preference is probably for &#x60;.&#x60; if you can resolve the parsing issues, and &#x60;!&#x60; can be really fun if you want a very excited language, but the humble &#x60;;&#x60; seems to have stuck around for being a solidly good decision instead of just continuity.

As for what I&#39;m doing in my programming language, Lilac? I&#39;m not entirely sure yet! The semicolon is the safe choice, but other choices (or not having one at all) have aesthetic appeal. I&#39;d love to hear what _you_ would choose in your dream world!

---

Thank you to Mary for the feedback on this post! You said it doesn&#39;t have enough semicolons in it. Here they are: &#x60;;;;;;;;;;;;;;;;;;;;;&#x60;.

---

1

In some languages, like Pascal, these are statement _separators_. I&#39;m just going to say &quot;terminators&quot; here for ease, but this pose applies to both.

[↩](#or-sep%5Fref)

2

On one paper in high school, my chemistry teacher told me I was using too many commas. Truly, I had far too many, averaging maybe five per sentence. Joke was on him, though: I used fewer in the next paper by using semicolons instead (entirely grammatically correctly).

[↩](#chemistry%5Fref)

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).