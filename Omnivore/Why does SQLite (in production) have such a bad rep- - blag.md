---
id: 28629d88-182c-47b1-88a0-51ccf04cdc0f
title: Why does SQLite (in production) have such a bad rep? - blag
tags:
  - RSS
date_published: 2024-06-19 11:05:19
---

# Why does SQLite (in production) have such a bad rep? - blag
#Omnivore

[Read on Omnivore](https://omnivore.app/me/why-does-sq-lite-in-production-have-such-a-bad-rep-blag-19031853131)
[Read Original](https://avi.im/blag/2024/sqlite-bad-rep/)



Why?

* Most people see it from a web workload perspective. Typically, we use Client-Server databases like PostgreSQL. But, SQLite absolutely shines in many other cases like mobile or embedded devices.
* For a long time, SQLite did not allow concurrent writes along with readers. This was changed in the WAL mode, where you could have a writer with multiple readers.
* You still cannot have multiple concurrent writers. That immediately puts off people. Your workload might or might not need this.
* SQLite did not have a good backup and replication story. This was a major issue, but [Ben Johnson](https:&#x2F;&#x2F;x.com&#x2F;benbjohnson) changed the entire scene with [Litestream](https:&#x2F;&#x2F;litestream.io&#x2F;). I would say this was one of the most impactful contributions to SQLite ecosystem.
* Some ORMs &#x2F; libraries come with terrible defaults. For example, not setting &#x60;PRAGMA busy_timeout&#x60;.
* Funny little story: I started learning programming with Django, and the docs straight up said SQLite isn’t suitable for production. I had a wrong impression for a long time. Then I started using it for my own use cases and realized the trade-offs.

SQLite, like any other database, has its pros and cons. For the majority of applications and scales, it is perfect. You always have PostgreSQL for anything else.

TLDR: SQLite slaps. You will be fine.

---

The original question, the title, asked by [Jason Leow](https:&#x2F;&#x2F;x.com&#x2F;jasonleowsg&#x2F;status&#x2F;1803030457166270806) and my [xeet](https:&#x2F;&#x2F;x.com&#x2F;iavins&#x2F;status&#x2F;1803429828768764016).  