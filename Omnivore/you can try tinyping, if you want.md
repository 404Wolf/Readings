---
id: 65cc2e63-badb-42f1-89d5-67a0b4741641
title: you can try tinyping, if you want
tags:
  - RSS
date_published: 2024-09-23 00:00:00
---

# you can try tinyping, if you want
#Omnivore

[Read on Omnivore](https://omnivore.app/me/you-can-try-tinyping-if-you-want-192200ecc28)
[Read Original](https://bytes.zone/micro/you-can-try-tinyping-if-you-want/)



_Brian Hicks, September 23, 2024_

Despite not talking about it much, I&#39;m continuing to work on tinyping. In the spirit of working with the garage door up, you can try an _extremely early version_ at [app.tinyping.net](https:&#x2F;&#x2F;app.tinyping.net&#x2F;). It mostly works, though! Pings are scheduled and stored appropriately, and you can edit tags for them. It also follows the Automerge project&#39;s advice on how to best structure documents to avoid the main document growing and growing forever (it stores pings in journal documents, one per month.)

If you decide to try that, be aware that it doesn&#39;t gracefully handle schema changes at all, in cases where the data storage format has to change. I&#39;m mostly just calling &#x60;localStorage.clear()&#x60; whenever in the console whenever I need. Don&#39;t put anything valuable in there; it&#39;ll get eaten.

Next step there is to make the UI actually nice. I don&#39;t think that will be awful to do, although the list of pings can feel a little overwhelming if you haven&#39;t filled them in for a while.

Oh, and if you&#39;re reading this and have a better idea for a name, please get in touch. I wanted to get the .com version of the name, but the owners of that domain want &quot;in the 5 figures of GBP&quot; and I&#39;m not gonna do that for a side project.