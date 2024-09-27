---
id: e50051c7-c43e-4c26-9943-b4fcae03f713
title: What I tell people new to on-call | nicole@web
tags:
  - RSS
date_published: 2024-09-23 00:00:00
---

# What I tell people new to on-call | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/what-i-tell-people-new-to-on-call-nicole-web-192200ecd81)
[Read Original](https://ntietz.com/blog/what-i-tell-people-new-to-oncall/)



**Monday, September 23, 2024**

The first time I went on call as a software engineer, it was exciting—and ultimately traumatic. Since then, I&#39;ve had on-call experiences at multiple other jobs and have grown to really appreciate it as part of the role. As I&#39;ve progressed through my career, I&#39;ve gotten to help establish on-call processes and run some related trainings.

![Comic showing a variety of job titles and joke interpretations of them](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s0Fo7kKMkRRGnLEoPP5EGHfXy0-2Tw9xQPuW930oiF7M&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;comics&#x2F;3-oncology.png &quot;Oncology might not be what it sounds like, but Steve Ballmer did say that Linux is a cancer&quot;)

Here is some of what I wish I&#39;d known when I started my first on-call shift, and what I try to tell each engineer before theirs.

## Heroism isn&#39;t your job, triage is

It&#39;s natural to feel a _lot_ of pressure with on-call responsibilities. You have a production application that _real people_ need to use! When that pager goes off, you want to go in and fix the problem yourself. That&#39;s the job, right?

But it&#39;s not. It&#39;s not your job to fix every issue by yourself. It _is_ your job to see that issues _get addressed_. The difference can be subtle, but important.

When you get that page, your job is to assess what&#39;s going on. A few questions I like to ask are: What systems are affected? How badly are they impacted? Does this affect users?

With answers to those questions, you can figure out what a good course of action is. For simple things, you might just fix it yourself! If it&#39;s a big outage, you&#39;re putting on your incident commander hat and paging other engineers to help out. And if it&#39;s a false alarm, then you&#39;re putting in a fix for the noisy alert! (You&#39;re going to fix it, not just ignore that, right?)

Just remember not to be a hero. You don&#39;t need to fix it alone, you just need to figure out what&#39;s going on and get a plan.

## Call for backup

Related to the previous one, you aren&#39;t going this alone. Your main job in holding the pager is to assess and make sure things get addressed. Sometimes you can do that alone, but often you can&#39;t!

Don&#39;t be afraid to call for backup. People want to be helpful to their teammates, and they want that support available to them, too. And it&#39;s better to be wake me up a little too much than to let me sleep through times when I was truly needed. If people are getting woken up a lot, the issue isn&#39;t calling for backup, it&#39;s that you&#39;re having too many true emergencies.

It&#39;s best to figure out that you need backup early, like 10 minutes in, to limit the damage of the incident. The faster you figure out other people are needed, the faster you can get the situation under control.

## Communicate a lot

In any incident, adrenaline runs and people are stressed out. The key to good incident response is communication in _spite_ of the adrenaline. Communicating under pressure is a skill, and it&#39;s one you can learn.

Here are a few of the times and ways of communicating that I think are critical:

* When you get on and respond to an alert, say that you&#39;re there and that you&#39;re assessing the situation
* Once you&#39;ve assessed it, post an update; if the assessment is taking a while, post updates every 15 minutes while you do so (and call for backup)
* After the situation is being handled, update key stakeholders at least every 30 minutes for the first few hours, and then after that slow down to hourly

You are also going to have to communicate within the response team! There might be a dedicated incident channel or one for each incident. Either way, try to over communicate about what you&#39;re working on and what you&#39;ve learned.

## Keep detailed notes, with timestamps

When you&#39;re debugging weird production stuff at 3am, that&#39;s the time you _really_ need to externalize your memory and thought processes into a notes document. This helps you keep track of what you&#39;re doing, so you know which experiments you&#39;ve run and which things you&#39;ve ruled out as possibilities or determined as contributing factors. It also helps when someone else comes up to speed! That person will be able to use your notes to figure out what has happened, instead of you having to repeat it every time someone gets on. Plus, the notes doc won&#39;t forget things, but you will.

You will also need these notes later to do a post-mortem. What was tried, what was found, and how it was fixed are all crucial for the discussion. Timestamps are critical also for understanding the timeline of the incident and the response!

This document should be in a shared place, since people will use it when they join the response. It doesn&#39;t need to be shared outside of the engineering organization, though, and likely should not be. It may contain details that lead to more questions than they answer; sometimes, normal engineering things can seem really scary to external stakeholders!

## You will learn a lot!

When you&#39;re on call, you get to see things break in weird and unexpected ways. And you get to see how other people handle those things! Both of these are great ways to learn a lot.

You&#39;ll also just get exposure to things you&#39;re not used to seeing. Some of this will be areas that you don&#39;t usually work in, like ops if you&#39;re a developer, or application code if you&#39;re on the ops side. Some more of it will be business side things for the impact of incidents. And some will be about the psychology of humans, as you see the logs of a user clicking a button fifteen hundred times (get that person an esports sponsorship, geez).

My time on call has led to a lot of my professional growth as a software engineer. It has dramatically changed how I worked on systems. I don&#39;t want to wake up at 3am to fix my bad code, and I don&#39;t want it to wake you up, either.

Having to respond to pages and fix things will teach you all the ways they _can_ break, so you&#39;ll write more resilient software that _doesn&#39;t_ break. And it will teach you a lot about the structure of your engineering team, good or bad, in how it&#39;s structured and who&#39;s responding to which things.

## Learn by shadowing

No one is born skilled at handling production alerts. You gain these skills by _doing_, so get out there and do it—but first, watch someone else do it.

No matter how much experience you have writing code (or responding to incidents), you&#39;ll learn a lot by watching a skilled coworker handle incoming issues. Before you&#39;re the primary for an on-call shift, you should shadow someone for theirs. This will let you see how they handle things and what the general vibe is.

This isn&#39;t easy to do! It means that they&#39;ll have to make sure to loop you in even when blood is pumping, so you may have to remind them periodically. You&#39;ll probably miss out on some things, but you&#39;ll see a lot, too.

## Some things can (and should) wait for Monday morning

When we get paged, it usually feels like a crisis. If not to us, it sure does to the person who&#39;s clicking that button in frustration, generating a ton of errors, and somehow causing my pager to go off. But not all alerts are created equal.

If you assess something and figure out that it&#39;s only affecting one or two customers in something that&#39;s not time sensitive, and it&#39;s currently 4am on a Saturday? Let people know your assessment (and how to reach you if you&#39;re wrong, which you could be) and _go back to bed_. Real critical incidents have to be fixed right away, but some things really need to wait.

You want to let them go until later for two reasons. First is just the quality of the fix. You&#39;re going to fix things more completely if you&#39;re rested when you&#39;re doing so! Second, and more important, is your health. It&#39;s _wrong_ to sacrifice your health (by being up at 4am fixing things) for something non-critical.

## Don&#39;t sacrifice your health

Many of us have had bad on-call experiences. I sure have. One regret is that I didn&#39;t quit that on-call experience sooner.

I don&#39;t even necessarily mean quitting the _job_, but pushing back on it. If I&#39;d stood up for myself and said &quot;hey, we have five engineers, it should be more than just me on call,&quot; and held firm, maybe I&#39;d have gotten that! Or maybe I&#39;d have gotten a new job. What I _wouldn&#39;t_ have gotten is the knowledge that you can develop a rash from _being too stressed_.

If you&#39;re in a bad on-call situation, please try to get out of it! And if you can&#39;t get out of it, try to be kind to yourself and protect yourself however you can (you deserve better).

## Be methodical and reproduce before you fix

Along with taking great notes, you should make sure that you test hypotheses. What could be causing this issue? And before that, what even _is_ the problem? And how do we make it happen?

Write down your answers to these! Then go ahead and try to reproduce the issue. After reproducing it, you can try to go through your hypotheses and test them out to see what&#39;s actually contributing to the issue.

This way, you can bisect problem spaces instead of just eliminating one thing at a time. And since you know how to reproduce the issue now, you can be confident that you do have a fix at the end of it all!

## Have fun

Above all, the thing I want people new to on-call to do? Just have _fun_. I know this might sound odd, because being on call is a big job responsibility! But I really do think it can be fun.

There&#39;s a certain kind of joy in going through the on-call response together. And there&#39;s a fun exhilaration to it all. And the joy of fixing things and really being the competent engineer who handled it with grace under pressure.

Try to make some jokes (at an appropriate moment!) and remember that whatever happens, it&#39;s _going to be okay_.

Probably.

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6)   
 Want to hire great programmers?[Hire via Recurse Center!](https:&#x2F;&#x2F;recurse.com&#x2F;hire?utm%5Fsource&#x3D;ntietz&amp;utm%5Fmedium&#x3D;blog) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) 