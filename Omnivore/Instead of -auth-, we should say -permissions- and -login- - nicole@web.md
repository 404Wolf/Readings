---
id: 2d4f8961-3c54-4e61-a3d9-a8f6ab04cd2e
title: Instead of "auth", we should say "permissions" and "login" | nicole@web
tags:
  - RSS
date_published: 2024-05-27 00:00:00
---

# Instead of "auth", we should say "permissions" and "login" | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/instead-of-auth-we-should-say-permissions-and-login-nicole-web-18fbada49a4)
[Read Original](https://ntietz.com/blog/lets-say-instead-of-auth/)



Most computer systems we interact with have an auth system of some kind. The problem is, that sentence is at best unclear and at worst nonsense. &quot;Auth&quot; can mean at least two things: authentication or authorization[1](#or-verb-forms). Which do we mean for an &quot;auth system&quot;? It&#39;s never perfectly clear and, unfortunately, we often mean _both_.

This is a widespread problem, and it&#39;s well known. One common solution, using the terms &quot;authn&quot; and &quot;authz&quot;, doesn&#39;t solve the problem. And this isn&#39;t just confusing, it leads to bad abstractions and general failures!

![Comic about an ambiguity in the term &quot;log in.&quot;](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7dRLeOy7YJH8eEnv4YCCk_ZlP8gwvD9Zfr6IeGEypyQ&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;comics&#x2F;logging-in.png &quot;Tech support thought they had seen it all, but they hadn&#39;t met Sam yet&quot;)

## The current terms fall short

Calling things just &quot;auth&quot; is common. It&#39;s used in library names ([django-allauth](https:&#x2F;&#x2F;docs.allauth.org&#x2F;en&#x2F;latest&#x2F;) is for authentication, and [go-auth](https:&#x2F;&#x2F;github.com&#x2F;go-pkgz&#x2F;auth) is also authentication), package names (&#x60;django.contrib.auth&#x60;, which does both authentication and authorization), and even [company names](https:&#x2F;&#x2F;auth0.com&#x2F;).

Since &quot;auth&quot; can mean two things, this naming leads to ambiguities. When you see a new auth library or product, you don&#39;t know right away what it&#39;s able to handle. And when you talk about it, it&#39;s also not clear what you&#39;re referring to.

The canonical solution is to call these &quot;authn&quot; and &quot;authz&quot;, the n and z evoking the longer words. Thes are just not satisfactory, though. They&#39;re clunky and hard to understand: they&#39;re not universal enough to be able to skip explanation; they&#39;re easy to mishear and are close together; and what verb forms would we even use?

It&#39;s not just about bad communication, though. This terminology implies that the two concepts, authentication and authorization, are more closely related than they are. It encourages bad abstractions to combine them, because we have one word, so we feel like they _should_ belong together. But they are two pretty fundamentally distinct problems: checking who you are[2](#other-assertions), and specifying access rights.

There are some links between auth and auth[3](#sorry), because what you can do is tied to who you are. But they&#39;re also very different, and deserve to be treated that way. At the very least, recognizing that they&#39;re different leads to recognition that solving one does _not_ solve the other.

## Intead, use &quot;permissions&quot; and &quot;login&quot;

We should always use the most clear terms we have. Sometimes there&#39;s not a great option, but here, we have _wonderfully_ clear terms. Those are &quot;login&quot; for authentication and &quot;permissions&quot; for authorization. Both are terms that will make sense with little explanation (in contrast to &quot;authn&quot; and &quot;authz&quot;, which are confusing on first encounter) since almost everyone has logged into a system and has run into permissions issues.

There are two ways to use &quot;login&quot; here: the noun and the verb form. The noun form is &quot;login&quot;, which refers to the information you enter to gain access to the system. And the verb form is &quot;log in&quot;, which refers to the _action_ of entering your login to use the system.

&quot;Permissions&quot; is just the noun form. To use a verb, you would use &quot;check permissions.&quot; While this is long, it&#39;s also just... fine? It hasn&#39;t been an issue in my experience.

Both of these are abundantly clear even to our peers in disciplines outside software engineering. This to me makes it worth using them from a clarity perspective alone. But then we have the big benefit to abstractions, as well.

When we call both by the same word, there&#39;s often an urge to combine them into a single module just by dint of the terminology. This isn&#39;t necessarily wrong—there is certainly some merit to put them together, since permissions typically require a login. But it&#39;s not necessary, either, and our designs will be stronger if we don&#39;t make that assumption and instead make a reasoned choice.

---

1

Or their associated verb forms, of course. Respectively, these would be &quot;authenticate&quot; or &quot;authorize.&quot;

[↩](#or-verb-forms%5Fref)

2

Authentication is more precisely proving an assertion. It&#39;s just most often used to show that you&#39;re the user you say you are. But you can authenticate plenty of other things, too.

[↩](#other-assertions%5Fref)

3

Sorry, had to make a point here.

[↩](#sorry%5Fref)

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).