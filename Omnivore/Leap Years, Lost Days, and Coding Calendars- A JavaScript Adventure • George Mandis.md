---
id: 5ae7fd34-d935-11ee-95f3-1f4c90b1c5ba
title: "Leap Years, Lost Days, and Coding Calendars: A JavaScript Adventure • George Mandis"
tags:
  - RSS
date_published: 2024-03-03 00:00:00
---

# Leap Years, Lost Days, and Coding Calendars: A JavaScript Adventure • George Mandis
#Omnivore

[Read on Omnivore](https://omnivore.app/me/leap-years-lost-days-and-coding-calendars-a-java-script-adventur-18e035c5900)
[Read Original](https://george.mand.is/2024/03/leap-years-lost-days-and-coding-calendars-a-javascript-adventure/)



 • \~900 words • 4 minute read

Dates are hard and JavaScript is odd. Two universal truths.

In belated honor of 2024 being a leap year, here&#39;s a story about how I learned 2011 was not a leap year, ISO 8601, proleptic Gregorian calendars and forking Node.

To belatedly commemorate the leap year of 2024, here is a story about how I discovered of 2011 wasn&#39;t a leap year, dove into the intricacies of ISO 8601, the concept of proleptic Gregorian calendars, and decided to fork Node on a whim.

* [Understanding the Proleptic Gregorian Calendar](#understanding-the-proleptic-gregorian-calendar)
* [Quirks of JavaScript Date Handling](#quirks-of-javascript-date-handling)
* [11ty and leap years](#11ty-and-leap-years)
* [Apple, NSCalendar and sticklers for reality](#apple-nscalendar-and-sticklers-for-reality)
* [Let&#39;s fork Node!](#lets-fork-node)

---

## Understanding the Proleptic Gregorian Calendar

JavaScript implements (best as I can tell) the [ISO 8601](https:&#x2F;&#x2F;www.iso.org&#x2F;iso-8601-date-and-time-format.html) standard to avoid ambiguous date&#x2F;time expressions. This includes an adherence to something called the [proleptic Gregorian calendar](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Proleptic%5FGregorian%5Fcalendar).

The [Gregorian calendar](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Gregorian%5Fcalendar) is more or less the calendar system we all use today and was established on Friday, October 15th, 1582\. The curious thing about this is that it came immediately after Thursday, October 4th. They had to do this to synchronize with the switch from the Julian calendar. As are a result, those ten days never happened.

The proleptic Gregorian calendar attempts to make this less confusing by basically pretending the Gregorian calendar has _always_ been in use. In this world, when looking back at dates that happened prior to the switch, a date like October 7th, 1582 can exist. This is a modern convention to help with historical consistency.

JavaScript is happy help here:

&#x60;&#x60;&#x60;arcade
new Date(&quot;October 11 1582&quot;)
&#x60;&#x60;&#x60;

## Quirks of JavaScript Date Handling

However, JavaScript has some quirks. It _does_ care about _some_ days that make no sense and could never happen:

&#x60;&#x60;&#x60;arcade
new Date(&quot;October 33 1979&quot;)&#x2F;&#x2F; Invalid Date
&#x60;&#x60;&#x60;

But it doesn&#39;t care about _all_ the days that could never happen:

&#x60;&#x60;&#x60;arcade
new Date(&quot;February 31 2024&quot;)
&#x60;&#x60;&#x60;

It doesn&#39;t throw an &#x60;Invalid Date&#x60; even thought February 31 could never possibly exist. It&#39;s actually returning March 2nd, 2024 in this example!

If you dive in the source you can see it takes a (somewhat lazy) assumption by checking the days first and assuming 1 to 31 can always be valid. It then checks the month to see if it has that many days. Instead of throwing an error if it doesn&#39;t, it just substracts the max number of days from that month and uses the remainder to figure out which day it is in the _next_ month.

## 11ty and leap years

Something funny happened when I [resurrected some old blog posts from 2011](https:&#x2F;&#x2F;george.mand.is&#x2F;2023&#x2F;10&#x2F;obligatory-blog-refresh-post-a-twist-and-a-tiny-homage&#x2F;). The tool I use to build this site ([11ty](https:&#x2F;&#x2F;11ty.io&#x2F;)) started throwing errors. I assumed there was some weird piece of misformatted metadata in one of the posts, but what I found was a lot stranger.

![Invalid Date appearing in the RSS feed](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s_ptnIPF85abdqNFePnfy0KTs6Q6fRAvtFRBMqXA_T1A&#x2F;https:&#x2F;&#x2F;george.mand.is&#x2F;media&#x2F;revamp&#x2F;leap-year-2011-oops-3.jpg)

The offending post was written on February 29th, 2011\. It turns out that day never existed—it&#39;s only a leap year if it is divisible by 4, except for end-of-century years which must be divisible by 400.

![Me asking Google if 2011 was a leap year because I am too lazy to do math](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,skpKMvuwqOQMJMx8TMh6YXdDLTA7oXjoZJ6bxRRpSzKw&#x2F;https:&#x2F;&#x2F;george.mand.is&#x2F;media&#x2F;revamp&#x2F;leap-year-2011-oops-2.jpg)

![Finally finding the culprit—a file from 2011 on a day that did not exist](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sTsLQ9_z7IuMXfH2AEOtQyvwKWRVKNDUaiF6oDJFYrTk&#x2F;https:&#x2F;&#x2F;george.mand.is&#x2F;media&#x2F;revamp&#x2F;leap-year-2011-oops-1.jpg)

While JavaScript itself doesn&#39;t care, some package in the 11ty stack trying to parse and understand dates must care. I&#39;m curious which one it is, though I never went looking.

In a nut-shell, because I&#39;d written this date down wrong over a decade ago, and because something in 11ty is a stickler for real dates, I had to change the date to fix my blog. The funny part is I had no way of knowing, 10+ years later, if I&#39;d actually written it on March 1st or February 28th.

## Apple, NSCalendar and sticklers for reality

It bothers me (irrationally) that JavaScript would try to coerce February 31, 2024 into a real date but lazily stand-buy and be fine with October 7th, 1582\. I am reminded once again that software—like all human constructs—really just boils down to a mishmash of people&#39;s opinions in the moment.

It makes sense to me that the company whose founder gave [so much thought about typography](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;zOlRWg%5FiyWY) in early computing would take the time to put thought into their standard calendar class to account for the Julian to Gregorian transition in a more nuanced and historically-accurate way.

* &lt;https:&#x2F;&#x2F;developer.apple.com&#x2F;library&#x2F;archive&#x2F;documentation&#x2F;Cocoa&#x2F;Conceptual&#x2F;DatesAndTimes&#x2F;Articles&#x2F;dtHist.html&gt;

In &#x60;NSCalendar&#x60;, similar to how JavaScript will move February 31st into the next month, any days that fall between October 4th and 15th in 1582 will automatically get moved forward 10 days.

One of the more fun macOS easter eggs live sin the Calendar app. If you go back to October 1582 you can see Thursday, October 4th immediately followed by Friday, October 15th.

![macOS Calendar app showing October 1582 and how the 10 days are missing](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAZ5VynX05qYVGCPbgBVTUDX-RfzGadtBMIfQ9nORvc0&#x2F;https:&#x2F;&#x2F;george.mand.is&#x2F;media&#x2F;october-1582-macos-calendar.jpg)

## Let&#39;s fork Node!

I like the way NSCalendar handles this situation better. So I did what any sensible person would do: I dusted off my C++ brain and forked Node.

* &lt;https:&#x2F;&#x2F;github.com&#x2F;georgemandis&#x2F;node&gt;

I&#39;d never built Node from scratch, let alone fork an entire language just to make such a silly, opinionated tweak to a standard model. The documentation is clear though, and the project is soundly structured. After some hunting, pecking and reading I found the place to introduce my change:

* https:&#x2F;&#x2F;github.com&#x2F;georgemandis&#x2F;node&#x2F;blob&#x2F;0663467e521627523f3dae908bf9eafe02377beb&#x2F;deps&#x2F;v8&#x2F;src&#x2F;date&#x2F;date.cc#L96

Voila.

![My forked version of Node with different opinions around date handling in 1582](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sM4NEMt4_7TSYZM7GRrd2Z2OcQ_vG80dXxNxdycrRvKo&#x2F;https:&#x2F;&#x2F;george.mand.is&#x2F;media&#x2F;node-better-gregorian.jpg)

If you&#39;ve found any of this nonsense helpful or intriguing—and particularly if you have your own silly explorations to share—please feel free to [reach out](https:&#x2F;&#x2F;george.mand.is&#x2F;contact)! I love a good goofy deep-dive into the inane.