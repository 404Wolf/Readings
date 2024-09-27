---
id: ada56ff5-0574-43fc-959c-f4de62409cd9
title: Reading Roundup | cceckman's World Wide Web site
tags:
  - RSS
date_published: 2024-09-17 06:19:36
---

# Reading Roundup | cceckman's World Wide Web site
#Omnivore

[Read on Omnivore](https://omnivore.app/me/reading-roundup-cceckman-s-world-wide-web-site-19208fdcba1)
[Read Original](https://cceckman.com/writing/reading-roundup/)



_[Reading List](https:&#x2F;&#x2F;github.com&#x2F;cceckman&#x2F;reading-list) but for real this time_

Long-time readers of this blog\[^thanks\] may note a new entry in the nav bar: [Reading](https:&#x2F;&#x2F;cceckman.com&#x2F;reading&#x2F;), to match [Writing](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;). Reading includes my [blogroll](https:&#x2F;&#x2F;cceckman.com&#x2F;reading&#x2F;blogroll&#x2F;) _plus_ a [roundups](https:&#x2F;&#x2F;cceckman.com&#x2F;reading&#x2F;roundups&#x2F;) section that I’ll be updating with recent articles I’d like to call out.

**If you’re following this site via RSS, you may want to resubscribe!**I’ve used the [Writing feed](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;index.xml) as the default for the whole site, but now there’s a combined [all-site feed](https:&#x2F;&#x2F;cceckman.com&#x2F;index.xml) if you want to see the roundups too. (Or you can follow the round-ups [separately](https:&#x2F;&#x2F;cceckman.com&#x2F;reading&#x2F;index.xml); your call!)

## Tracking reading: failures and successes

I’ve been trying to track my online reading for a while. In the limit, I want a lot of metadata about each article &#x2F; link:

* What is the article?
* Where and when did I find it?
* Have read it yet, or is it TBR? What did I think about it?

I tried to [write my own applet](https:&#x2F;&#x2F;github.com&#x2F;cceckman&#x2F;reading-list). That was a good learning experience about web technologies (app manifest! service workers!) but was ultimately too unwieldy to use. The above data are a lot lot to be presented with on each access, when mostly I’m just trying to make a record to look at later.[1](#fn:1)

I also tried using [Omnivore](https:&#x2F;&#x2F;omnivore.app&#x2F;), a TBR-oriented web app. I found this didn’t reliably “receive” links I sent to it: after sharing a link, I would refresh the page, but the new entry wouldn’t be available until minutes later. I saved about a dozen links in Omnivore before I stopped using it.

The approach I’ve had success with is “just” dropping the link in my[Obsidian](https:&#x2F;&#x2F;obsidian.md&#x2F;) vault, in today’s [daily note](https:&#x2F;&#x2F;help.obsidian.md&#x2F;Plugins&#x2F;Daily+notes), using the &#x60;#reading&#x60; tag. The file name gives me the “date of discovery”; any other metadata is part of the prose, if I chose to include it.

For a while I’ve had Leah Neukirchen’s [Trivium](https:&#x2F;&#x2F;leahneukirchen.org&#x2F;trivium&#x2F;) feed in my [blogroll](https:&#x2F;&#x2F;cceckman.com&#x2F;reading&#x2F;blogroll&#x2F;). Every now-and-again Leah posts a set of links on topics matching (her) interests; sometimes just the titles, usually with attribution, sometimes with a few words of summary.

I really like this format! It’s easy to scan over and peek at the recent articles, “will this be interesting to me too”.

My goal was to produce something like Trivium from my own recent reading.[2](#fn:2)I think my Obsidian notes have been effective at _adding_ to my reading list; so I wanted a tool to:

* Extract links and annotations from my daily notes
* Serve an edditor where I can see the list, create round-ups, and edit annotations
* Download completed roundups for publication on this site, as [Hugo](https:&#x2F;&#x2F;gohugo.io&#x2F;)\-friendly Markdown

## Results

A bit of coding later, and I have [these tools](https:&#x2F;&#x2F;cceckman.com&#x2F;r&#x2F;reading-roundup&#x2F;); may they serve as an inspiration to you!

If you’re just interested in the roundups, follow along [here](https:&#x2F;&#x2F;cceckman.com&#x2F;reading&#x2F;) or in the [combined feed with my blog](https:&#x2F;&#x2F;cceckman.com&#x2F;index.xml).

Thanks for stopping by!

---

1. My choice of using YAML as my database didn’t do me any favors, either. [↩︎](#fnref:1)
2. I almost called the project “Divium”, but opted for the more discriptive name. [↩︎](#fnref:2)