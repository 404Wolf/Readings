---
id: 2c7101c4-f49b-40b5-a98a-2a6f59d06fc2
title: What's hidden behind "just implementation details" | nicole@web
tags:
  - RSS
date_published: 2024-06-17 00:00:00
---

# What's hidden behind "just implementation details" | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/what-s-hidden-behind-just-implementation-details-nicole-web-1902633e0a0)
[Read Original](https://ntietz.com/blog/whats-behind-just-implementation/)



**Monday, June 17, 2024**

Something I hear occasionally from some software people[1](#deep-respect) is something along the lines of: &quot;Well, the hard part is figured out, and the rest is just implementation details.&quot; This typically means they&#39;ve created an algorithm to do something, and the rest of it is all the supporting activities to build an application or production system _around_ this algorithm. I hear variations on this also from software engineers who dismiss some web apps as &quot;just CRUD[2](#crud)&quot; and thus trivial.

These statements don&#39;t usually come from malice[3](#malice), but they do still diminish the work of many software engineers. There is so _much_ complexity, difficulty, and beauty in the art of &quot;just getting it to production&quot; or &quot;just CRUD&quot; apps. If these parts _were_ trivial, we wouldn&#39;t need highly skilled software engineers to lead execution of precisely these areas at startups[4](#hi).

So, what _is_ that complexity that underlies moving things toward production? What&#39;s hard about something that&#39;s &quot;just CRUD&quot;? And why do people not notice this?

## The hard things about going to production

When people say the hard part is shown and done, they&#39;re often referring to the part that&#39;s interesting to _them_, academically, and where we&#39;re not necessarily sure if it&#39;s even possible. Beyond the fact that it&#39;s not necessarily harder to show something&#39;s possible than to do it[5](#hash-functions), there&#39;s still quite a bit that&#39;s hard and necessary remaining. These parts are unlikely to succeed if given to an inexperienced engineer. Some of these things _are_ deeply interesting and sometimes we&#39;re not even sure if they&#39;re possible, either, in the real world.

Here is a quick survey of some of the hard-and-maybe-impossible parts of getting things into production that I&#39;ve run into in my own work.

## Getting started

The first hard thing you run into is just _getting started_. It seems almost trivial, but it takes way more time than people expect, even with past experience doing it. This time spent is very important. You could move quickly and cut corners, but the way you set things up at the beginning form the foundation of the project and have a ripple effect on everything you do afterwards.

Getting started well requires that you can make some good predictions about what your software will need. Which foundational technologies should we use? How should we structure the project? What tooling will work well for us? Answering these questions takes a lot of experience and a little magic. You can kick the can down the road on some decisions, but that will cost you because a deferred decision often slows down development. It&#39;s helpful to predict well as early as you can.

## Creating a maintainable design

Writing software itself is also a hard problem. In a research context, the maintainability of code is less critical: the code isn&#39;t being used long-term (usually), it&#39;s more self-contained, and it&#39;s worked on by a narrower set of maintainers. For a production system, you want to make sure that it&#39;s designed soundly in a way that you can evolve and maintain for the life of the product. And this code is long-term: it will be around for many years longer than you expect.

That&#39;s a big challenge, not least because we usually don&#39;t know what the future holds. While we can try to predict it (as we do when getting started), some things are out of our control. We have to make our code flexible enough to be able to add new features, but not so flexible that it starts to impede our ability to work on the product itself.

This is a _huge_ topic, and it&#39;s one that is a really big part of getting things into production.

## Making it robust (and observable)

We also have to make the system robust. In a research context, things can fail or they can be unpredictable, and it&#39;s easier to deal with. In a production setting, that results in bug reports and getting woken up at 2am [each night for two weeks](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;lessons-from-my-first-on-call&#x2F;). If it&#39;s not robust, things will go wrong. I mean, they will anyway—but more often.

So when things _do_ go wrong, you have to have observability in place to be able to figure out what went wrong and why. This is something people can dedicate whole careers to. Figuring out what information is going to be helpful, how to record it, and then later how to use that information is a _big_ field.

## User experience and user interface design

Of course, there&#39;s also the whole question of how are _people_ even going to use this? A proof-of-concept or an algorithm can show you that something is possible if people do the right things. And how are we going to make it so that that&#39;s a reasonable experience for them? If the proof-of-concept requires a lot of data entry, maybe people won&#39;t do that! Or maybe there are clever ways to approach it where it is a better experience, and more appetizing.

I&#39;ve tried my hand at frontend and user interface design enough times to really deeply respect that this is a very wide and deep field. It&#39;s certainly far from trivial, and things that seem like they&#39;re sure to work will run into the pesky problem of &quot;people.&quot; Until the prototype exists in a real-world thing that people can touch and use, including a UI, it&#39;s probably not really a sealed deal as working.

This particular area is incredibly interesting to me[6](#pulling-teeth), because any issues that are discovered require collaboration between researchers, designers, product managers, and software engineers. It&#39;s a multi-disciplinary festival!

## Acceptable performance

We don&#39;t even have to aim for _good_ performance to hit a snag. Even getting to something _acceptable_ is often pretty hard. Prototypes are often slow or assume conditions that don&#39;t exist in the real world.

Maybe your prototype finishes its computations in a minute, but users will bounce off the page in a few seconds if they don&#39;t see something. (We come back to UI&#x2F;UX concerns!) Or maybe it works if you have really powerful hardware, but it doesn&#39;t work on the devices your users will have. Or it just falls down on production data sizes.

Whatever the case may be, this is a project in itself. You have to understand what performance is required for production use, and how the prototype performs, and then do a lot of work to bridge that gap. If you can.

## The hard parts of CRUD

In addition to all the normal concerns of going to production, &quot;just CRUD&quot; apps have some particular concerns that are sometimes missed. An app that&#39;s really just CRUD is also _extremely_ rare today, because they&#39;re typically dealing with complex associations of data or they need some trickier user interactions.

## Designing the database

CRUD apps are heralded as being simple because they expose the database design, so you have fairly standard patterns for the views in your app. That assumes, though, that you have a database schema that&#39;s going to work to show users. If the DB design and views are 1:1, then the DB design _is_ user interface design, and how you design it has big UX implications[7](#designer-database). If they&#39;re _not_ 1:1, then your &quot;just CRUD&quot; app now requires creating views that wrap around the database schema with a lot of business logic, and you bring in a lot of the non-CRUD difficulties again. Oh, and when you change your DB design? Bye bye CRUD benefits!

## Production support and observability

As mentioned above, making things robust enough to withstand a production workload is hard. You have the entire fields of SRE and DevOps because there is so much to consider here. Reliability, observability, logging, alerting, deployment, change management, security. Not to mention supporting users!

## You don&#39;t escape performance here

Being CRUD doesn&#39;t make it so performance is trivial. Your data might grow to be large, or your schema might be hard to scale up. Who knows! From all the other hidden complexity, it&#39;s easy to run into performance problems.

## Background jobs

Many CRUD apps require background work to be done. This might be pre-computing things, sending reminder emails, or processing asynchronous tasks. There are some [standard](https:&#x2F;&#x2F;docs.celeryq.dev&#x2F;en&#x2F;stable&#x2F;) [ways](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Sidekiq) to do these jobs.

And when you set them up, you now get to manage extra servers, a message broker, and a distributed system. Throw in observability and monitoring for the lot, and you&#39;ve really piled on quite a bit.

## User login and permissions

When people want to use the system, you have to check permissions. You also have to validate their credentials at the door to make sure they can actually log in. Both of these are _very_ nuanced, even if you&#39;re using a service provider, and have a lot of depth that you have to grok.

There are standard patterns for user logins. User permissions are more commonly bespoke per application, with some shared patterns but a lot is highly domain specific. Even so, there is a lot of complexity to wind up mired in here, especially once you start getting into SAML and SSO or other more intricate login mechanisms.

## It all adds up

The thing about putting something into production is that each individual piece looks pretty easy when you talk about it in isolation. We _know_ how to make user logins. We _know_ how to design schemas. We _know_ how to profile for performance. We _know_ how to do background jobs.

But the pile of all of these together? Each one of these can interact with the other pieces of the system. They impact the design and implementation of other pieces. And we expect all of them in the application!

It&#39;s a lot of things to know, and each of them is a field in itself. A lot of the complexity is the breadth, and knowing what you need to know. You can&#39;t solve it by hiring an expert in each individual thing, either. You _have_ to have people who can bridge the domains, or you&#39;ll end up with a mishmash of pieces from completely different jigsaw puzzles, none of which are the one you were trying to put together.

## Why do we do this?

I don&#39;t think people set out to miss the complexity in other fields. We don&#39;t wake up in the morning and say &quot;today I&#39;m going to call someone&#39;s work trivial!&quot; (If you _do_ wake up in the morning and say that, please stop.)

It&#39;s more that a lot of complexity is hidden, especially when people do their jobs well. You get to see all the complexity in your own job, because it&#39;s what you wade through every day. It&#39;s harder to see it in work you&#39;re less familiar with, because you don&#39;t have that same closeness. Instead you just see people breeze through it, and you don&#39;t see the rough edges.

We do this a _lot_ though. Backend engineers have a history of belittling frontend engineers (I personally find frontend _much_ harder, and also very _different_). Systems programmers have a history of belittling web developers. And we as a field tend to label other fields as lesser for being &quot;non-technical.&quot;

It&#39;s unfortunate, because there&#39;s such beauty out there! Almost every job has complexity, and all the different roles I&#39;ve seen in tech are interesting and challenging. In each of those jobs, there is the beauty of wrangling complexity into something useful, and making it look easy.

Instead, we should approach things we don&#39;t know about with curiosity. Each time you think &quot;huh, that doesn&#39;t seem like it should take so long&quot; is an opportunity to figure out what complexity you&#39;re not seeing and gain a deeper appreciation. Or, maybe you&#39;ll find out you _can_ build Twitter in a weekend. Who knows?

---

Thank you to [Adam Anthony](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;aanthony1243&#x2F;) and Dan Reich for providing feedback to me on a draft of this post.

---

1

I deeply respect the two who said this to me most recently (face to face). And, of course, I strongly disagree with them.

[↩](#deep-respect%5Fref)

2

CRUD stands for create&#x2F;read&#x2F;update&#x2F;delete and refers to a type of application that follows this basic pattern for different pieces of data. You can create, read, update, or delete records. This typically has a strong tie to the database schema and these views may reflect the DB operations fairly directly. But, this does not _remove_ the complexity.

[↩](#crud%5Fref)

3

As a rule, I don&#39;t want to engage with statements made in bad faith. These sorts of statements _can_ come from a place of bad faith, but we&#39;re not talking about that here.

[↩](#malice%5Fref)

4

I got to my role as Principal Engineer through being exactly this kind of generalist. There are enough real-world problems to solve here that you can make a big impact. It _can_ be hard to _show_ that impact depending on culture (specialists may find promotions easier).

[↩](#hi%5Fref)

5

If you want an intuitive reason that doing something can be harder than showing it&#39;s possible to do it, consider hash collisions. It&#39;s quite easy to show that you _can_ generate hash collisions for a SHA-1 hash, but it&#39;s _much_ harder to actually generate them.

[↩](#hash-functions%5Fref)

6

Working on React code is still like pulling teeth for me, though. Even though this area is interesting to me, I find it more interesting to _observe_ and less to participate in.

[↩](#pulling-teeth%5Fref)

7

I love the designers I&#39;ve worked with, and I also really truly do not want their UI designs to become my database design or vice versa. Thanks, but sorry, no.

[↩](#designer-database%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6)   
 Want to hire great programmers?[Hire via Recurse Center!](https:&#x2F;&#x2F;recurse.com&#x2F;hire?utm%5Fsource&#x3D;ntietz&amp;utm%5Fmedium&#x3D;blog) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) 