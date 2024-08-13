---
id: cc37ee20-dfc2-11ee-a36a-1719a52d4f57
title: Work on tasks, not stories | nicole@web
tags:
  - RSS
date_published: 2024-03-11 00:00:00
---

# Work on tasks, not stories | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/work-on-tasks-not-stories-nicole-web-18e2e4da2f8)
[Read Original](https://ntietz.com/blog/work-on-tasks-not-stories/)



**Monday, March 11, 2024**

One tenet of big-a Agile[1](#big-a-agile) is that developers should all work on individual user stories as the smallest unit of work[2](#agile-stories). That a ticket should almost always be a story, because that means it&#39;s something that delivers _concrete value_ to the users.

There are some cases in which this leads to absurdity. I&#39;ve written tongue-in-cheek tickets of this type at work before, on a platform team:

* &quot;As a DAYJOB engineering team, I want...&quot;
* &quot;As a configuration file, I want...&quot;

I&#39;ve also seen this done as a serious story, or [Poe&#39;s law](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Poe%27s%5Flaw) struck and it&#39;s impossible to tell if it&#39;s satire.

**This has it all backwards.**User stories are great for tracking what users should be able to do and how to deliver value. But they&#39;re _not_ great for understanding the work to be done.

A story can require a surprisingly large or small amount of work. You don&#39;t know until you break it down by analyzing how to _do the task_ that&#39;s behind the story. We end up doing this and using stories in a way that leads to convoluted ticket titles, which all but tell you what the hidden task actually is.

Instead, tickets should be honest and be a straightforward _task_:

* &quot;Add port option to configuration file&quot;
* &quot;Make checkout button disabled if any fields are invalid&quot;

These tickets can be _related_ to stories, either multiple tickets to a story or one-to-one, but they are a far better mapping to the work done on an engineering team than stories are[3](#division-of-work). It makes it clear what is to be done, and it avoids convoluted stories for things that are just absolutely _not_ user stories.

To be clear: you _must_ still think about what the user needs, and think critically about the implementation at hand. It&#39;s just that writing it as a story _doesn&#39;t_ give you this for free, just as writing a task does not. Writing a story masks the task behind a veneer, but it is still fundamentally a task. So if you have a task and the task does not clearly relate back to something that&#39;s needed for the user (or the org, or some useful purpose), then that&#39;s a _great_ time to clarify _why_ this task needs to be done. Maybe it doesn&#39;t!

But it&#39;s still a task, not a story.

---

1

This is to draw a distinction between the industry that&#39;s sprung up around &quot;Agile&quot;, vs. the principles&#x2F;practices recommended in the [agile manifesto](https:&#x2F;&#x2F;agilemanifesto.org&#x2F;). The former is cargo-culted quite a bit and has some problems, while the latter says to emphasize flexibility over dogma.

[↩](#big-a-agile%5Fref)

3

Splitting it up this way also makes responsibilities clearer: product management is responsible for creating stories, and engineering is responsible for creating the tasks to achieve those. Without this split, it&#39;s ambiguous and varies team-to-team and day-to-day.

[↩](#division-of-work%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6) 