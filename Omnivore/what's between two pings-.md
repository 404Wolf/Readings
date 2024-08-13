---
id: 837b1b38-db2d-11ee-ba98-e7560dbba11b
title: what's between two pings?
tags:
  - RSS
date_published: 2024-03-05 14:07:19
---

# what's between two pings?
#Omnivore

[Read on Omnivore](https://omnivore.app/me/what-s-between-two-pings-18e1044648e)
[Read Original](https://bytes.zone/micro/thing-a-month-03-02/)



_Brian Hicks, March 5, 2024_

I got to thinking about how pings work in this system ([last post](https:&#x2F;&#x2F;bytes.zone&#x2F;micro&#x2F;thing-a-month-03-01&#x2F;) and realized an optimization. Right now I&#39;m treating them as though they&#39;re all the same size—that&#39;s safe because of the law of large numbers, remember—but they&#39;re not all the same size! Time varies between pings.

Say you have these pings with these tags:

| Time  | Tag    |
| ----- | ------ |
| 8:00  | work   |
| 9:00  | work   |
| 9:30  | coffee |
| 10:30 | work   |

Assuming we&#39;re comfortable with this small sample as being representative of what you actually did, you can say with confidence that between 8:00 and 9:00 you were working. But sometime (vaguely) between 9:00 and 9:30 you transitioned to making coffee, and sometime (vaguely) between 9:30 and 10:30 you transitioned back to working.

If we treat every ping as equal, assuming λ is 1 hour, this will be reported as 3 hours (± 0.85 hours) working and one hour (± 0.85 hours) getting coffee. That&#39;s pretty good—or at least enough to get a sense of how you&#39;re spending your time.

But what if we take advantage of the fact that pings _aren&#39;t_ exactly hourly? We&#39;d have to take care of the vagueness of when you transitioned. In the absence of other data, we might just take the time halfway between two pings as the transition time. So that means that our times look like this:

| Time  | Tag    | Duration                                          |
| ----- | ------ | ------------------------------------------------- |
| 8:00  | work   | 0:30 (halfway to 9)                               |
| 9:00  | work   | 0:45 (halfway back to 8 plus halfway to 9:30)     |
| 9:30  | coffee | 0:45 (halfway back to 9:30 plus halfway to 10:30) |
| 10:30 | work   | 0:30 (halfway back to 9:30)                       |

This makes it look like we have less time, though: we now have 2.5 hours tracked instead of 4\. This is probably not a problem in real life: we can take pings continuously and tag any that aren&#39;t answered as &quot;afk.&quot; If we really need to, it&#39;s probably safe to double the duration of the first and last ping, giving us a total of 3.5 hours in this sample.

But does it give us better insight into our life? Let&#39;s see. Doing this by hand:

| Tag    | Ping as hour | Ping as halfway between |
| ------ | ------------ | ----------------------- |
| work   | 3h ± 0.85h   | 2.75h ± 0.82h           |
| coffee | 1h ± 0.85h   | 0.75h ± 0.82h           |

It feels weird to me that the error bar goes below zero for coffee now. I definitely didn&#39;t spend _no_ time on it, much less negative time. But let&#39;s pretend that getting coffee took 15 minutes and the remainder of the 4 hours was spent working: both of these systems produce a perfectly acceptable answer to the question of &quot;where did my day go?&quot;

Given that, I think the first version of this system should assume that pings are &#x60;1 hour &#x2F; λ&#x60; or similar instead of trying to get fancy. The transformation is not _that_ hard (I&#39;ll attach a Python script below that can evaluate [the same data I generated in the last post](https:&#x2F;&#x2F;bytes.zone&#x2F;micro&#x2F;thing-a-month-03-01&#x2F;)) so it would hypothetically be feasible to change if it looked like there was a big advantage to doing so. Although I want to be careful to avoid giving precise-but-fuzzy numbers, though: sticking with a rougher-grained unit as a base unit probably makes a ton of sense for setting expectations… you wouldn&#39;t want to bill a client on data from this system, for example!

All this talk of coffee has made me want some. brb.

&#x60;&#x60;&#x60;python
#!&#x2F;usr&#x2F;bin&#x2F;env python3
import argparse
import collections
from datetime import datetime, timedelta
import json
import math
import sys


class Ping:
    def __init__(self, at, tag, duration):
        self.at &#x3D; at
        self.tag &#x3D; tag
        self.duration &#x3D; duration

    @classmethod
    def from_json(cls, obj):
        return cls(datetime.fromisoformat(obj[&#39;at&#39;]), obj[&#39;tag&#39;], timedelta(0))

    def __repr__(self):
        return f&quot;&lt;Ping at&#x3D;{self.at.isoformat()} tag&#x3D;{repr(self.tag)}, duration&#x3D;{str(self.duration)}&gt;&quot;


def main(args):
    pings &#x3D; [Ping.from_json(obj) for obj in json.load(sys.stdin)]

    for (i, ping) in enumerate(pings):
        if i &#x3D;&#x3D; 0:
            continue

        before &#x3D; pings[i-1]

        halfway &#x3D; (ping.at - before.at) &#x2F; 2
        ping.duration +&#x3D; halfway
        before.duration +&#x3D; halfway

    total_seconds &#x3D; sum((ping.duration.total_seconds() for ping in pings))
    print(f&quot;From {timedelta(seconds&#x3D;total_seconds)} hours tracked...\n&quot;)

    total_seconds_by_tag &#x3D; collections.Counter()
    for ping in pings:
        total_seconds_by_tag[ping.tag] +&#x3D; ping.duration.total_seconds()

    for (tag, tag_total) in total_seconds_by_tag.most_common():
        proportion &#x3D; tag_total &#x2F; total_seconds
        other_ping_proportion &#x3D; 1 - proportion
        sem &#x3D; math.sqrt(proportion * other_ping_proportion &#x2F; len(pings))
        plus_minus &#x3D; sem * total_seconds

        print(f&quot;{tag}\t{tag_total&#x2F;60&#x2F;60:.2f} hours\tplus or minus {plus_minus&#x2F;60&#x2F;60:.2f} hours&quot;)


if __name__ &#x3D;&#x3D; &#39;__main__&#39;:
    parser &#x3D; argparse.ArgumentParser()
    parser.add_argument(&#39;-l&#39;, type&#x3D;float, default&#x3D;1)

    main(parser.parse_args())

&#x60;&#x60;&#x60;