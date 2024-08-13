---
id: 9b1720c2-e521-11ee-8f51-97cec17aded9
title: Procrastinating on my side project by torturing databases | nicole@web
tags:
  - RSS
date_published: 2024-03-18 00:00:00
---

# Procrastinating on my side project by torturing databases | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/procrastinating-on-my-side-project-by-torturing-databases-nicole-18e517f944b)
[Read Original](https://ntietz.com/blog/procrastinating-on-my-side-project-by-torturing-databases/)



One of my most insidious procrastination mechanisms is doing things that _feel like work_ but are just a fun diversion. I ran into that recently for a side project I&#39;m working on. It wasn&#39;t _really_ necessary to test database options semi-rigorously, but here we are.

This project is one that I really want to use myself, and I think other people will want it, too. I&#39;m not ready to talk about the overall project much yet[1](#not-ready), but the constraints here are interesting:

* **Needs to text blobs of &quot;reasonable&quot; size.** These won&#39;t be massive, 10-100 kB seems like the highest I&#39;d reasonably run into. Most will be 1-10 kB. I&#39;ve been bitten by things getting over 8 kB in PostgreSQL and going to slower disk-based storage.
* **Pageloads must be fast.** I&#39;m building this using HTMX and server-side templates, so for interactions to feel really snappy, I&#39;m aiming for p99 load times to be 50ms. (I may relax this to 100ms.)
* **I want to minimize ops work.** While I _can_ do ops work, I really don&#39;t want to, so I&#39;m looking for something that achieves these goals with as little fiddling about as possible.

Together, these rule out one of the common suggestions of using blob storage for the documents. For ease of usage, I want to keep things all in the same database if I can. To make sure I don&#39;t code myself into a corner and have to switch DBs down the road, it looks like we&#39;re going to have a good old database drag race.

## The contenders

Like any good competition, we have a few contenders. The primary contenders were three relational databases[2](#mongodb): SQLite, PostgreSQL, and MariaDB. Here&#39;s why I was looking at these three:

* SQLite is embedded, so seems like the lightest ops budget for me. I can back it up easily, and streaming replication allows read replicas down the road if I need that.
* PostgreSQL is what I&#39;m familiar with and there are good hosted offerings for it. I dunno, it&#39;s the default option for most people it feels like.
* MariaDB is what I hear about in the context of needing better-than-PostgreSQL performance.

And also the fact that the ORM I&#39;m using supports these three, so it was easy to test comparably across these three!

## Torturing the databases

To test the databases, I subjected them to a variety of synthetic workloads and then tortured them by depriving them of RAM while asking them to fetch the data please-and-thank-you. This would force them into showing me what their disk-based performance looked like so that I could get an idea of the worst case performance.

The synthetic workload generated 3 GB of rows using random data sized 1 kB, 8 kB, 64 kB, 512 kB, 4 MB, and 32 MB. This data was generated from a uniform random distribution, so it&#39;s unlikely that compression reduced its size significantly. I loaded this data into the database with sequential ids, then randomly retrieved rows from it, measuring the average time per row retrieval.

To run this, I put CPU and memory limits on the database containers. I gave them 1 GB and 2 cores, simulating fairly the amount of RAM I&#39;d have on a particular DB host. This also requires that not all the data could be held in memory at the same time.

It was around this point that I also gave up on testing MariaDB. In writing the tests, I had to tweak some things to make the migrations work correctly, and it was going to require some tweaking to get the larger rows to insert and retrieve without hitting payload limits. It failed on the &quot;minimize ops work&quot; criterion, so toss it out!

The full code for the experiment [is available](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nicole&#x2F;pique&#x2F;src&#x2F;branch&#x2F;main&#x2F;%5Fexperiments&#x2F;2024-03-02-database-benchmark) for those who want to peek under the hood at how I used [criterion](https:&#x2F;&#x2F;docs.rs&#x2F;criterion&#x2F;latest&#x2F;criterion&#x2F;) and [SeaORM](https:&#x2F;&#x2F;www.sea-ql.org&#x2F;SeaORM&#x2F;docs&#x2F;index&#x2F;) for it.

Once the test worked, I just ran it for a while, then got some charts out of it!

## And the winner is...

SQLite is the database of choice for this project! It outperformed PostgreSQL with about 10x faster queries once data sizes got reasonable. This wasn&#39;t due to network latency, since the DB was on the same host as the test.

Here&#39;s what the data looked like for 64 kB documents. With PostgreSQL and 64 kB documents, we see a mean response time of about 80 ms.

![Chart showing a mean response time of about 80ms for PostgreSQL.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sCWiEqiWYtCOlAzvtFCsE6raoUo2t77QzKQg8cR9m73Q&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;dbs&#x2F;postgres-64kb.svg)

With SQLite and 64 kB documents, we see a mean response time of about 0.95 ms.

![Chart showing a mean response time of about 0.95ms for SQLite.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s2woTQ6Xp_4rakp3pOguA2aEyWGVX-AW6WH6wTWm1O-k&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;dbs&#x2F;sqlite-64kb.svg)

It became pretty clear to me that I&#39;d want to set an upper bound on data sizes, and also that I can be much more generous with that limit in SQLite while still achieving the performance goals I have for this project.

One interesting thing the data showed for SQLite is a bimodal distribution in some of the larger documents. I&#39;m not sure why this is, so if someone has an idea, I&#39;d love to find out!

## Base decisions on real data

While I said I was procrastinating, I was also doing something legitimately useful here: figuring out what could support the performance requirements I have here. Now I have data to support my decision to use SQLite!

This is how you should make decisions about major underlying technologies when you are able to. Don&#39;t just read some docs and read some blog posts: go out and test _your_ workload with the tech, in a realistic environment, and see how it will behave for you! Then you can move forward knowing you&#39;ve found more of the problems at the outset than as surprises down the road.

And now for me? I guess it&#39;s time to go work on the actual features this is supposed to support.

---

1

It&#39;s not open-source but the repo is [public](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nicole&#x2F;pique) because I like working in the open.

[↩](#not-ready%5Fref)

2

I also briefly considered MongoDB, but ruled it out once the relational databases were clearly able to handle the performance requirements here. It&#39;s easier for me to use an RDBMS given familiarity.

[↩](#mongodb%5Fref)

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).