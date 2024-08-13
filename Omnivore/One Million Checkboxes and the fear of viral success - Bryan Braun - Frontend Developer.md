---
id: 6baea7ec-f538-4ea3-a9cc-a8875e79138d
title: One Million Checkboxes and the fear of viral success | Bryan Braun - Frontend Developer
tags:
  - RSS
date_published: 2024-08-10 04:00:00
---

# One Million Checkboxes and the fear of viral success | Bryan Braun - Frontend Developer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/one-million-checkboxes-and-the-fear-of-viral-success-bryan-braun-1913f9cd6e3)
[Read Original](https://www.bryanbraun.com/2024/08/10/one-million-checkboxes-and-the-fear-of-viral-success/)



When Nolen Royalty’s [One Million Checkboxes site](https:&#x2F;&#x2F;onemillioncheckboxes.com&#x2F;) went viral, several people sent me links to it.

![A screen-capture of onemillioncheckboxes.com, shortly after it launched.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sArHfpkWkx8IQfmJR0GHK5USe88atywO_3ENzGZ0vko4&#x2F;https:&#x2F;&#x2F;www.bryanbraun.com&#x2F;assets&#x2F;images&#x2F;one-million-checkboxes.gif) 

If you haven&#39;t heard of One Million Checkboxes, see [the Wikipedia article](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;One%5FMillion%5FCheckboxes) for more details.

I loved everything about One Million Checkboxes. It was simple but strangely compelling. You land on the site, start using a single brain cell to check some boxes, and then minutes later you’re [in an existential crisis](https:&#x2F;&#x2F;www.thegamer.com&#x2F;one-million-checkboxes-sent-me-into-an-existential-meltdown&#x2F;). Seeing the project gave me the kind of professional jealousy that I imagine other people feel when a peer gets promoted.

Nolen wrote [a fantastic post](https:&#x2F;&#x2F;eieio.games&#x2F;essays&#x2F;scaling-one-million-checkboxes&#x2F;) full of technical details about how he built and scaled the site. It was very generous of him to write it up. Knowing how to scale a web service feels like magic to someone without much experience at it (read: me) and this post stands as a great case-study.

But more than that, the post really challenged me as a creator on the web. In the past, I’ve been so afraid of this exact situation Nolen was in. You know, building a creative project with a backend component, having it go viral, watching the metered costs go through the roof, and either:

1. leaving users with an unstable and broken experience
2. bankrupting myself
3. being forced to shut it down to avoid bankrupting myself
4. solving the problems perfectly on the fly, but still maybe bankrupting myself\*

[![Any early tweet from Nolen Royalty after One Million Checkboxes went viral](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,ssq5K4YZLYkoPj19LHcpFWsoDC3M8pHySXR0RbleNCN4&#x2F;https:&#x2F;&#x2F;www.bryanbraun.com&#x2F;assets&#x2F;images&#x2F;one-million-checkboxes-tweet-1.png)](https:&#x2F;&#x2F;x.com&#x2F;itseieio&#x2F;status&#x2F;1806025147150745918) [![More tweets from Nolen Royalty after One Million Checkboxes went viral](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,spcoCldUfB7zmxHvBF9HbJ6X6C2pzQly8Kq7NUEe35Uo&#x2F;https:&#x2F;&#x2F;www.bryanbraun.com&#x2F;assets&#x2F;images&#x2F;one-million-checkboxes-tweets.jpg)](https:&#x2F;&#x2F;x.com&#x2F;itseieio&#x2F;status&#x2F;1806217752656351305)Neal Agarwal ran into something similar with the success of his game [Infinite Craft](https:&#x2F;&#x2F;neal.fun&#x2F;infinite-craft&#x2F;).[![Tweets from Neal Agarwal after Infinite Craft went viral](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s1A6uUVU8QYJArI-0w1L5OW4efCF5Do2uXEQL9RHHpgs&#x2F;https:&#x2F;&#x2F;www.bryanbraun.com&#x2F;assets&#x2F;images&#x2F;infinite-craft-tweets.jpg)](https:&#x2F;&#x2F;x.com&#x2F;nealagarwal&#x2F;status&#x2F;1757437669594771780) 

I’ve had little tastes of these experiences and they were stressful. Making these decisions while it feels like everyone is watching and your reputation is on the line is a lot of pressure!

Frankly, this is one reason why I’ve spent so much of my creative energy on projects without a backend component (like [After Dark in CSS](https:&#x2F;&#x2F;www.bryanbraun.com&#x2F;2024&#x2F;08&#x2F;10&#x2F;one-million-checkboxes-and-the-fear-of-viral-success&#x2F;bryanbraun.github.io&#x2F;after-dark-css&#x2F;), [Bouncy Ball](https:&#x2F;&#x2F;sparkbox.github.io&#x2F;bouncy-ball) or [Checkboxland](https:&#x2F;&#x2F;www.bryanbraun.com&#x2F;checkboxland&#x2F;)). Client-side code is easier to scale and I _already know how to do it_. It’s simply less risky.

But that comes at a cost. One Million Checkboxes simply could not have been built as a client-side-only app. If I had come up with the idea for One Million Checkboxes, would I have ruled it out because of it’s backend component? Would I have been too afraid to try it?

You can do a lot, artistically, with client-side only apps. I wanted to believe that client-side only was good enough. But projects like One Million Checkboxes give evidence to the contrary. What if the space of server-enhanced creative projects is significantly under-explored simply because of the additional risk? If I got good at navigating the scaling gauntlet, would I be able to uncover a lot of opportunities?

Scaling backend stuff isn’t magic—Nolen’s post showed that. I can figure out how to write Go, network instances, and rate-limit IPs. Maybe it’s time that I try.

---

\* If I’m being rational, then even a worst-case-scenario probably wouldn’t “bankrupt” me, but fears are seldom rational.