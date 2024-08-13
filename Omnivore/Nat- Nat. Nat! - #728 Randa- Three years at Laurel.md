---
id: 1c429ecc-e718-11ee-8295-c383fb443d76
title: "Nat? Nat. Nat! | #728 Randa: Three years at Laurel"
tags:
  - RSS
date_published: 2024-03-20 15:25:48
---

# Nat? Nat. Nat! | #728 Randa: Three years at Laurel
#Omnivore

[Read on Omnivore](https://omnivore.app/me/nat-nat-nat-728-randa-three-years-at-laurel-18e5e5ccb03)
[Read Original](https://writing.natwelch.com/post/728)



I&#39;ve been at Laurel[1](#user-content-fn-laurel) for a bit over three years[2](#user-content-fn-time). It is a small Series B startup, and it can be stressful. I often blame startup life for my lack of writing. That being said, one thing Laurel does that I really like is guarantee one three day weekend every month. Sometimes that&#39;s a national holiday, but if there isn&#39;t a national holiday, Laurel still declares a day off.

One of these days each year is Randa Day. Randa was the name of our [CEO Ryan](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;ryan-alshak-72815722&#x2F;)&#39;s mom who passed away and inspired the company&#39;s creation. The company asks all employees to take the day off to celebrate her. In the words of one of our founders, [Kourosh](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;kouroshz&#x2F;):

&gt; Randa taught us not to never take time for granted. She pushed us to solve time for the world. Tomorrow isn&#39;t an ordinary long weekend; it is our Randa Day. It’s the day we ask you to intentionally take a moment out of your busy day-to-day to think about your purpose and why you’re working as hard as you are to build Laurel and deliver it to the world.

I have four drafts sitting in my blog (which I will probably delete after I post this) about joining this company. I often wonder if this was the right choice, leaving a stable company like Google in the fall of 2020 to go bet on a company that hadn&#39;t figured out product market fit (and a lot of other things). I think about money left on the table by leaving when I did. I think about the low percentages of startups that succeed, and the even smaller percentages of employees that profit from a startup exit. I debate the pros and cons of being remote. I wonder all sorts of things, doubt is never ending.

Given all of that wondering and doubt, I&#39;m surprised to find that the mission of the company, which is &quot;To return time&quot;, still resonates with me after three years. The idea that time is a truly finite resource is a fact that I think about often. The company&#39;s attempt to help those who sell their time to both accurately define their time, and make sure they are fairly compensated for how they spend that time weirdly hits home to me, which makes little sense as I haven&#39;t done much hourly billing since I graduated college. Lawyers and accountants are our main customers currently, and they are regularly painted as the villains. People think they are out to steal your money, or are a sign of government and legal corruption. I hear commentary at that level at least once a week while out and about, and I always have to pause, because these &quot;villains&quot; are who I spend my day trying to help.

There are probably a few lawyers and accountants out there like that, but most that I have met are just trying to do their job. They work on incredibly tight deadlines with long hours, and help people navigate the complicated worlds of law and finance. Our data shows that many of these folks under-bill their time by up to thirty percent, often because of inaccurate time keeping and the fear of over-billing (which is a crime for lawyers in the United States). We are attempting to empower these folks to be more honest about how they spend their time, and also hopefully make them some more money while doing so (you can&#39;t bill for all of your time, there are laws about that too), which may end with their customers paying a bit more money. People paying more money is always a tough sell, but think about the underlying premise: working 30% more every day than you are compensated for. If you were working the line at a restaurant, that&#39;s often two or more hours of overtime pay.

If you&#39;re a salary worker, you may think, I work more than 40 hours a week all of the time, who cares? My response has become simple: do you understand how you spend that time? I know I don&#39;t. I am terrible at time management. It&#39;s one of the core reasons I failed out of university originally: I wasn&#39;t being honest with myself about how I spend my time. It has been fifteen years since I first honestly had to confront the downsides of poor time management[3](#user-content-fn-disabilities), and I still struggle with it to this day. I have tried so many apps, implemented hundreds of systems, built lots of software around note taking and time tracking, been deep in the productivity culture wars, and still struggle. There is no magic button to press and magically says &quot;oh here, now you understand how you spend your time&quot;. This is such a hard problem, our founders have been working on it since 2015, and we are just now starting to get traction with a product that helps two small[4](#user-content-fn-size) industries understand how they spend their time. We have had to constantly iterate and learn about how different types of people, who all do very similar jobs[5](#user-content-fn-hottake), think about time in very different ways.

So given all of that context, I wanted to talk about how I have spent the three years and change at Laurel. I am going to do that by describing some of the bigger projects I led and worked on.

## Migrating to MongoDB Atlas

When I started there were two pretty obvious problems: monitoring was all over the place and no one understood how our data-store worked. We were running on a platform called [Aptible](https:&#x2F;&#x2F;www.aptible.com&#x2F;). It was ok, but their hosted MongoDB product was not. In particular it was running an older version of MongoDB (4.0), and replicas would just forget about each other all of the time. I worked with MongoDB and Aptible to try and figure out the issues, but eventually it became clear we needed to migrate somewhere else. We chose Atlas for a variety of reasons (cost, auto-scaling, availability and support to name a few), and then began migrating all of our clusters to it. We had a cluster for each customer, so migrating with minimal downtime was pretty easy, but it took a while. We have now been running happily on Atlas for over two years.

## Consolidating observability around Open Telemetry and Sumologic

Probably my most controversial decision at Laurel: choosing Sumologic. When I joined, we were paying for nine different observability tools. I tried asking folks where they looked when there was an outage, and the answer was different for every engineer. On top of that, folks would see different things in different tools which caused all sorts confusion.

So I did a bake off, and threw in some tools that we weren&#39;t using. We evaluated twelve different tools, and the outcome was either Datadog or Sumologic. Sumologic was significantly cheaper, so it won. Since then, they have been great partners in implementing features we have asked for, which has been wonderful. The downside is many engineers struggle with their query language and a few of the integrations we have had to rewrite ourselves.

One part that was not controversial: picking [Open Telemetry](https:&#x2F;&#x2F;opentelemetry.io&#x2F;). Our stack is mostly Typescript and C# (with some Python, Go and Swift for good measure), and it has worked wonderfully. The real star is the [Open Telemetry Collector](https:&#x2F;&#x2F;github.com&#x2F;open-telemetry&#x2F;opentelemetry-collector). For our first six months or so, we just sent telemetry straight from apps to Sumologic using OTLP over HTTP. Then we transitioned to first sending to a collector. This was great because it gave us all sorts of tools like: label adjustments, filtering, sampling, rate-limiting and caching. It adds some cost as it is not a small binary to run, but saves us a bunch of time in the long run.

## Migrating to AWS

As mentioned in the Atlas section above, we were on Aptible and running a copy of our infrastructure for every customer. Aptible didn&#39;t have good Terraform or other automation tooling, so all of our environments were pretty different. This caused outages and bugs... often. Moving to AWS was going to be tricky, and we weren&#39;t sure when or how we wanted to do it.

So we talked to an AWS rep, and got into a program where they would pay a part of our bill for two years, and pick up the bill for paying contractors to migrate us. This did not go great. The contractors needed a lot of help to deliver, and delivered a few months late. Some of the later individual engineers we worked with were great, and the final product delivered worked great, but it definitely was not an experience I want to relive. We ended up saving some money, but lost a decent amount of time.

We also debated moving to GCP at this time. No one knew GCP besides me, so we decided not to. Still not sure how I feel about that decision, but dust in the wind.

## The Full Rewrite

So while the above migration was happening in Summer of 2022, we decided to make a pivot. Calling it a pivot is... not entirely accurate, but it was a significant enough change to the business, there is no other good word for it.

In July and August, the company leadership let go \~25% of the company, including most of Engineering management. Over the next year a few more small layoffs would happen, and we would go from around 70 people to 40\. The context for this was our business was not working. Our product was fine, but it was a desktop application. Our customers often would not pick up the latest version of the software for six months to a year. We would have bug fixes 18 months old that people just wouldn&#39;t adopt to fix their problems. So our solution was to rewrite most things, so there was as little on the desktop as possible, move the rest to the cloud.

My role in all of this was designing the infrastructure that the system would use. This ended up being interesting because I made some demands that drastically affected the system design. The biggest one was a tier system I adopted from my time at Google.

&gt; Tier 1: Global services which have no internal dependencies.
&gt; 
&gt; Tier 2: Regional services
&gt; 
&gt; Tier 3: Client Services, used by customers
&gt; 
&gt; Tier 4: Internal Tools

This plus other production launch requirements required that you could only depend on services with an equal of smaller tier number than yours. So for example: Tier 1 can depend on Tier 1, Tier 2 can depend on Tier 2 and Tier 1, Etc.

We started the rebuild in August of 2022, launched in February of 2023, and had all of our old customers migrated, plus added new ones, by the end of January of 2024\. I am still positive the rewrite was the right move, and I am glad we did it. There&#39;s a ton of stuff I would have done differently in hindsight, but none of the decisions we made I truly regret.

## Conclusion

A friend once told me that the best way to make decisions is to choose the path of least regret. I don&#39;t regret any of my time at Laurel. Sometimes Melissa asks me if I like my job, which I answer yes to. It&#39;s never the easiest, and it causes me a lot of stress and frustration, but trying to solve this problem is fulfilling and I enjoy it.

Will we be successful[6](#user-content-fn-sales)? I have no idea, but I&#39;ve enjoyed it so far, so here&#39;s to many more.

&#x2F;Nat

tags: [#career](https:&#x2F;&#x2F;writing.natwelch.com&#x2F;tag&#x2F;career) [#startups](https:&#x2F;&#x2F;writing.natwelch.com&#x2F;tag&#x2F;startups)

## Footnotes

1. Laurel was formally known as Time By Ping. We [changed our name back in February 2023](https:&#x2F;&#x2F;www.laurel.ai&#x2F;resources-post&#x2F;goodbye-time-by-ping-hello-laurel-the-story-behind-our-new-identity). [↩](#user-content-fnref-laurel)
2. 3 years, 4 months and 11 days ago or 1,227 days total to be precise. [↩](#user-content-fnref-time)
3. And learning disabilities, but that&#39;s a post for another day. [↩](#user-content-fnref-disabilities)
4. Ok not that small: Accounting is like [$630bn annually](https:&#x2F;&#x2F;www.prnewswire.com&#x2F;news-releases&#x2F;accounting-services-market-to-reach--1-5-trillion-globally-by-2032-at-9-2-cagr-allied-market-research-302004559.html) globally and Legal is close to [$400bn annually in the US](https:&#x2F;&#x2F;www.grandviewresearch.com&#x2F;industry-analysis&#x2F;us-legal-services-market-report). [↩](#user-content-fnref-size)
5. This is probably the hottest take in this article. Tell two different groups of lawyers or accountants they do the same job and you&#39;ll probably get stabbed. [↩](#user-content-fnref-hottake)
6. If you know lawyers or accountants at medium to large sized firms that mostly operate in English, please reach out to [ryan@laurel.ai](mailto:ryan@laurel.ai) and tell him Nat sent you ;) [↩](#user-content-fnref-sales)