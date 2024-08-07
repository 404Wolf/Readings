---
id: 532e7e0e-e8aa-11ee-8314-c3bee0ee219d
title: Redis Renamed to Redict - Andrew Kelley
tags:
  - RSS
date_published: 2024-03-22 19:03:56
---

# Redis Renamed to Redict - Andrew Kelley
#Omnivore

[Read on Omnivore](https://omnivore.app/me/redis-renamed-to-redict-andrew-kelley-18e68a8bf1a)
[Read Original](https://andrewkelley.me/post/redis-renamed-to-redict.html)



[Redict](https:&#x2F;&#x2F;redict.io&#x2F;) was originally created by Salvatore Sanfilippo under the name &quot;Redis&quot;. Around 2018 he started losing interest in the project to pursue a science fiction career and gave stewardship of the project to [Redis Labs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Redis%5F%28company%29).

I think that was an unfortunate move because their goal is mainly to extract profit from the software project rather than to uphold the ideals of Free and Open Source Software. On March 20, 2024, they[changed the license to be proprietary](https:&#x2F;&#x2F;github.com&#x2F;redis&#x2F;redis&#x2F;pull&#x2F;13157), a widely unpopular action. You know someone is up to no good when they write &quot;Live long and prosper 🖖&quot; directly above a meme of Darth Vader.

![screenshot of the PR merging with many downvotes and darth vader](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,ssGkC-Potl6cmKsNV6doHH3qwI6XpL1yEevYwbBlTf54&#x2F;https:&#x2F;&#x2F;andrewkelley.me&#x2F;img&#x2F;redis-screenshot-light.png) ![screenshot of the PR merging with many downvotes and darth vader](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,si3wZ8npgbEN_C8jBzOZDOUJl1nss5__9Kw6aDzDSgYk&#x2F;https:&#x2F;&#x2F;andrewkelley.me&#x2F;img&#x2F;redis-screenshot-dark.png)

## What are the actual problems with these licenses?

In short summary, the licenses limit the freedoms of what one can do with the software in order for Redis Labs to be solely enriched, while asking for volunteer labor, and having [already benefitted from volunteer labor](https:&#x2F;&#x2F;github.com&#x2F;redis&#x2F;redis&#x2F;pull&#x2F;13157#issuecomment-2014737480), that is and was [generally offered only because it enriches _everybody_](https:&#x2F;&#x2F;news.ycombinator.com&#x2F;item?id&#x3D;39775468).

[SSPL is BAD](https:&#x2F;&#x2F;ssplisbad.com&#x2F;)

## Are they allowed to do this?

All the code before the license change is available under the previous license (BSD-3), however it is perfectly legal to make further changes to the project under a different license.

This means that it is also legal to _fork_ the project from before the license change, and continue maintaining the project without the proprietary license change. The only problem there would be, the project would be missing out on all those juicy future contributions from Redis Labs... wait a minute, isn&#39;t the project already _done_?

## Redict is a Finished Product

Redict already works great. Lots of companies already use it in production and have been doing so for many years.

In [Why We Can&#39;t Have Nice Software](https:&#x2F;&#x2F;andrewkelley.me&#x2F;post&#x2F;why-we-cant-have-nice-software.html), I point out this pattern of needless software churn in the mindless quest for profit. This is a perfect example occurring right now. Redict has already reached its peak; it does not need any more serious software development to occur. It does not need to [pivot to AI](https:&#x2F;&#x2F;redis.com&#x2F;blog&#x2F;the-future-of-redis&#x2F;). It can be maintained for decades to come with minimal effort. It can continue to provide a high amount of value for a low amount of labor. That&#39;s the entire point of software!

**Redict does not have any profit left to offer**. It no longer needs a fund-raising entity behind it anymore. It just needs a good project steward.

## Drew DeVault is a Good Steward

[Drew](https:&#x2F;&#x2F;drewdevault.com&#x2F;) is a controversial person, I think for two reasons.

One, is that he has a record of being rude to many people in the past - including myself. However, in a [similar manner as Linus Torvalds](https:&#x2F;&#x2F;lore.kernel.org&#x2F;lkml&#x2F;CA+55aFy+Hv9O5citAawS+mVZO+ywCKd9NQ2wxUmGsz9ZJzqgJQ@mail.gmail.com&#x2F;), Drew has expressed what I can only interpret as sincere regret for such interactions, as well as a pattern of improved behavior. I was poking through his blog to try to find example posts of what I mean, and it&#39;s difficult to pick them out because he&#39;s such a prolific writer, but perhaps [this one](https:&#x2F;&#x2F;drewdevault.com&#x2F;2022&#x2F;05&#x2F;30&#x2F;bleh.html)or maybe [this one](https:&#x2F;&#x2F;drewdevault.com&#x2F;2023&#x2F;05&#x2F;01&#x2F;2023-05-01-Burnout.html). I&#39;m a strong believer in applying[the best game theory strategy](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Tit%5Ffor%5Ftat)to society: people should have consequences for the harm that they do, but then they should get a chance to start cooperating again. I can certainly think of &quot;cancelable&quot; things I have done in the past, that I am thankful are not public, and I cringe every time I remember them.

Secondly, and I think this is actually the more important point, Drew has been an uncompromising advocate of Free and Open Source Software his entire life, walking the walk more than anyone else I can think of. It&#39;s crystal clear that this is the driving force of his core ideology that determines all of his decision making. He doesn&#39;t budge on any of these principles and it creates conflicts with people who are trying to exploit FOSS for their own gains. For example, when you [call out SourceGraph](https:&#x2F;&#x2F;drewdevault.com&#x2F;2023&#x2F;07&#x2F;04&#x2F;Dont-sign-a-CLA-2.html)you basically piss off everyone who has SourceGraph stock. Do enough of these callouts, and you&#39;ve pissed off enough people that there&#39;s an entire meme subculture around hating you.

Meanwhile, Drew maintains [wlroots](https:&#x2F;&#x2F;gitlab.freedesktop.org&#x2F;wlroots&#x2F;wlroots) and [Sway](https:&#x2F;&#x2F;swaywm.org&#x2F;), and runs [a sustainable business](https:&#x2F;&#x2F;sourcehut.org&#x2F;) on top of[Free and Open Source Software](https:&#x2F;&#x2F;sr.ht&#x2F;~sircmpwn&#x2F;sourcehut&#x2F;). SourceHut has a dependency on Redict, so it naturally follows that Drew wants to keep his supply chain FOSS.

## Redis is the Fork

The only thing Redis has going for it, as a software project, is the brand name. Salvatore is long gone. The active contributors who are working on it are, like I said, pivoting to AI. Seriously, here&#39;s a quote from [The Future of Redis](https:&#x2F;&#x2F;redis.com&#x2F;blog&#x2F;the-future-of-redis&#x2F;):

&gt; Making Redis the Go-To for Generative AI
&gt; 
&gt; we’re staying at the forefront of the GenAI wave

Meanwhile, Redict has an actual Free and Open Source Software movement behind it, spearheaded by Drew DeVault, who has a track record of effective open source project management.

In other words, Redict is the true spiritual successor to what was once Redis. The title of this blog post is not spicy or edgy; it reflects reality.

Thanks for reading my blog post.