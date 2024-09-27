---
id: 91f10a07-7fee-4631-a5e5-60072a935259
title: Reasons to write design docs | nicole@web
tags:
  - RSS
date_published: 2024-09-02 00:00:00
---

# Reasons to write design docs | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/reasons-to-write-design-docs-nicole-web-191b3dbc13f)
[Read Original](https://ntietz.com/blog/reasons-to-write-design-docs/)



**Monday, September 2, 2024**

Sometimes I joke that as a principal engineer, my main programming language is English. It&#39;s half true, though, since my job is as much about people and communciation as it is about technology. Probably more, actually.

Writing is useful at all levels of software engineering. It&#39;s not just something for tech leads, architects, and principal engineers. We write all the time, whether it&#39;s comments in code, descriptions in Jira, messages in Slack, or design documents in a wiki. We don&#39;t do this because it&#39;s fun; most engineers I&#39;ve met don&#39;t _love_ writing[1](#love-writing). We do it because it&#39;s useful.

I&#39;ve generally run into four main ways that writing design docs ends up being useful for me and the teams I&#39;m on. There may be more, and there are also ways they&#39;re _not_ useful. Here they are with pithy summaries of how they&#39;re useful or not, with links to the full sections.

* [Writing a design doc helps you think, leading to better designs.](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;reasons-to-write-design-docs&#x2F;#think-better)
* [Collaborating on a design doc with teammates improves the design.](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;reasons-to-write-design-docs&#x2F;#collab-better)
* [Sharing the design doc with teammates broadens the organization&#39;s understanding of the design.](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;reasons-to-write-design-docs&#x2F;#share-better)
* [Referring back to the design doc tells you why a decision was made.](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;reasons-to-write-design-docs&#x2F;#remember-better)
* [Reading a design doc _will not_ tell you how the system works!](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;reasons-to-write-design-docs&#x2F;#understand-unhelpful)

Let&#39;s see how these shake out! If you have any others, I&#39;d love to hear them!

## Writing design docs helps you think

A popular conception of a really good engineer is that if you tell them a problem, they&#39;ll quickly tell you a solution. With software teams, we sort of expect to tell them a problem and have them go heads down on the keyboard cranking out code. Hands on keyboards, folks!

That&#39;s not how solving problems really works, though. For many things, I can probably give you _a_ solution quickly. But it might be fatally flawed, and it certainly won&#39;t be optimal. There wasn&#39;t time to think through all the details!

This is where writing a design doc really helps with design. There&#39;s a lot written about other techniques for thought, like going for walks and writing by hand. I highly recommend these and they&#39;re where I get most of my best ideas for how to solve problems. But writing a design doc isn&#39;t usually about generating the _ideas_. It&#39;s about expanding them and checking them and being thorough, and finding where your gaps are so you can solve the problems you didn&#39;t see yet.

Putting a design into words and diagrams means that you have to make the design more concrete. Instead of handwaving about it, it goes down onto the page. You can start to see the complexity of the system, so you can start thinking about how to chop out parts of that complexity. Most of all, it lets you see things that just plain don&#39;t make sense. Countless times, I&#39;ve run into things that made sense in my head but as I type it out, I just _know_ it can&#39;t possibly work. It&#39;s much better to find that out before you try to implement it!

## Collaborating on a design doc improves the design

Writing a design doc by yourself is useful, and I use them for a lot of solo projects. But they&#39;re _much_ better with other people to collaborate with.

By yourself, you have blind spots. Have you ever written a sentence where you you had a word repeated twice in a row[2](#repetition), then read past it multiple times while editing? It&#39;s amazing what our brains fail to see. There are some techniques to notice those repeated words in writing, like reading it aloud, but little beats having someone else proofread it.

When someone else reads your design doc, you get similar benefits. They come into it with fresh eyes. They&#39;ll find those double words, and they&#39;ll also spot areas where you&#39;ve missed the mark on your design. Any time a reader has a question about the doc, it&#39;s a signal that the document is unclear, and you should edit or rewrite part of it.

It&#39;s pretty easy to collaborate on these documents in a work setting. It is harder to get reviews for design documents for personal projects, but it is possible! For this, I like to have friends read over the design and give me feedback, and I return the favor for them.

It&#39;s clear to me that _writing_ a design doc is useful in itself, and I would keep doing it even if I just burned the document immediately after writing it. The process of writing helps us! But the benefits go so much further than that in an organization.

Imagine a software engineering org where every team makes its design decisions by talking out loud and scribbling on the whiteboard, then jumps to code without a design doc. You might work at one right now! How do you find out what other teams are working on?

In orgs like this one, a lot of knowledge and news is just passed by word of mouth. You get coffee with your friend from another team, and she tells you that they&#39;re using a new database. Coffee with another friend, and he tells you that they&#39;ve created a new kind of user account. These would have been nice to know for your team! And then you start wondering about why we use the _current_ database, so you ask your tech lead when you return from coffee, and they tell you what their previous tech lead told _them_.

Poems and songs used to be passed down by oral tradition. Many still are, but many have also been lost to time because they were never written down, and others have evolved in unknowable ways over the eons. When we don&#39;t have design docs, then our understanding of the design is itself an oral tradition. We learn it by passing around news and lore. As people come and go from the company, this understanding may be corrupted or may vanish entirely.

When we share design docs after writing them, we reduce these issues. Now it&#39;s easier to see what changes other teams are working on: just read their design docs. Since these docs are shared, everyone can get a common understanding of what changes are happening, and you get better organizational knowledge.

They also help you understand _why_ a previous decision was made.

## Referring to old design docs tells you why a decision was made

There is a famous story about a fence, told by one [Chesterton](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Wikipedia:Chesterton%27s%5Ffence). Someone wanted to remove a fence, and they weren&#39;t allowed to until they could figure out the reason it was put there in the first place. You don&#39;t typically build a fence for no reason, so don&#39;t remove it if you don&#39;t know why it&#39;s there. This comes up a lot in software engineering, because we&#39;ve all seen seemingly unnecessary bits that end up being load bearing fixes for critical bugs or edge cases.

Without design docs, you have to try to piece together an understanding of why something is the way it is. In the best case scenario, you can ask a coworker. As an early employee at multiple companies, I&#39;ve served in this role, which is also why I like design docs—I shouldn&#39;t be a single point of failure and my knowledge shouldn&#39;t all leave with me! If you don&#39;t have anyone to ask, you can scrounge through the code for clues and look at the commit history. However, commit history often gives you an incomplete picture of the &quot;why&quot; behind a change.

It&#39;s much better to refer back to the original design doc associated with a change, if there is one. Then you can see in the author&#39;s own words what changes they were intending to make and _why_ they wanted to do that. In some cases, even the initial implementation and design doc drift apart, and they certainly will after much time has passed. Regardless, the _intention and reasoning_ let you see what problem was being solved. With that knowledge in hand, you can be more confident with your own changes.

To make those changes, though, you still have to understand the system in its current state.

## Reading a design doc will not tell you how the system works now

Unfortunately, design docs cannot tell you how a system works right now. At best, they&#39;re an approximation of how it worked at one point in time. Even if they&#39;re written right now, their correctness relies on one person or a small group of people understanding how the system works. This understanding often has so many holes that it looks like swiss cheese!

Design docs sit as snapshots of changes or of an overall architecture. The doc tells you what the intention and problem were, but not even if it got implemented. Some teams strive to update these docs, but that relies on human discipline to do so. I mean... have you _met_ humans? We&#39;re pretty bad at that followup thing, so relying on updates is fraught.

They&#39;re even worse for overall system architecture. They can give you a view of how someone _thinks_ the system works, but they won&#39;t tell you how the system _actually_ works. For a sufficiently large software system (almost all of it), it&#39;s too big for any one person to fit in their head. We can&#39;t fit the whole design with full correctness and all details into our heads.

It&#39;s not all worthless, though, because even that approximation gives you a _starting point_. It tells you what other people understood about this system and lets you get started. You can go from there to look at the code and see what was actually implemented or how things work now. You start with something to anchor from instead of a complete blank slate.

## You should probably write more

Design docs are one form of writing that is pretty essential for software engineering teams. Without them, you&#39;re just not going to make good decisions, and you&#39;ll end up slower in the long run. Bad decisions compound and slow you down.

They&#39;re just one form of writing that helps us, though. There are many others. Writing can feel unproductive, because it&#39;s not _code_, but it&#39;s essential.

The beauty of writing is that it is communication that lasts. We invented writing for a reason, instead of persisting with only oral traditions. When you write something down, more people can read it and benefit from it for longer.

Most teams I&#39;ve seen don&#39;t have enough writing in place. I totally get it, because I have the same instincts and fall into the same traps, and _my_ starting point is that I _love_ to write. Even with that, I will routinely start on things for my own projects (and even at work, ssshhhh) without a solid design doc. This is a mistake, and we should write more of these!

But not just design docs, we should write more in general. Communication is key to, well, everything in life? Writing is a fantastic way to communicate. If you write some fiction, an essay, or a poem, each of these will ultimately improve your communication. And then hey, maybe you&#39;ve used your love of productivity to hack your brain into letting you do something fun for yourself.

---

Thank you to [Erika Rowland](https:&#x2F;&#x2F;erikarow.land&#x2F;) and [Eugenia Tietz-Sokolskaya](https:&#x2F;&#x2F;sokolskayatranslations.com&#x2F;) for feedback on a draft of this post.

---

1

I do love to write, and one of the projects I did at my internship started with writing a report about different options. Writing has fueled a lot of my career, and I hope to inspire and help others write!

[↩](#love-writing%5Fref)

2

I introduced one of these intentionally in this article, then missed it when copying it from my notes into this post.

[↩](#repetition%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6)   
 Want to hire great programmers?[Hire via Recurse Center!](https:&#x2F;&#x2F;recurse.com&#x2F;hire?utm%5Fsource&#x3D;ntietz&amp;utm%5Fmedium&#x3D;blog) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) 