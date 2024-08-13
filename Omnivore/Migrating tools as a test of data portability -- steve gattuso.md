---
id: 8b6e9662-7a5a-4958-9a34-dc6136de36bb
title: Migrating tools as a test of data portability // steve gattuso
tags:
  - RSS
date_published: 2024-08-09 22:00:00
---

# Migrating tools as a test of data portability // steve gattuso
#Omnivore

[Read on Omnivore](https://omnivore.app/me/migrating-tools-as-a-test-of-data-portability-steve-gattuso-1913ec14762)
[Read Original](https://www.stevegattuso.me/2024/08/10/maybe-change-tools.html)



 Migrating tools as a test of data portability

 Published on Aug 10th, 2024.

My [last post](https:&#x2F;&#x2F;www.stevegattuso.me&#x2F;2024&#x2F;07&#x2F;30&#x2F;tool-changes-log.html) talked about how I’ve added some process and, by proxy, resistance, to migrating around between tools that I use. I wanted to follow up on this, as there was an implication that spending time migrating between tools was lost time that I think merits more nuance.

The origin of this train of thought came from a migration I’ve been doing from TiddlyWiki to Obsidian as my personal note-taking software. The initial process for migrating was essentially exporting Markdown files from TiddlyWiki to Obsidian, with a touch of transformation along the way to adapt to a slightly different &#x60;[[wikilink]]&#x60; behavior. What struck me about this migration is that it only took me a day or so to get to a point where I was able to pick up where I left off with TiddlyWiki using Obsidian, links and all.

This smooth migration sparked a thought about data longevity: the simplicity and portability of the data format seemed to matter more than the longevity of the tool I was using to take my notes. I’d even go as far as saying that I’m happy I did this migration, if anything because it acted as a test for Markdown’s portability as a note-taking format built for the long-haul.

The only thing that _didn’t_ translate well were dynamically generated pages in my notes, which needed to be written in a very software-specific way that didn’t directly transfer from TiddlyWiki to Obisidian. Specifically, TiddlyWiki widgets&#x2F;filters are incompatible with Obsidian Dataview queries, and the former needed to be re-written in the latter. This wasn’t a huge deal given that I don’t use these dynamically generated pages too frequently, however this migration made me realize that I need to be careful when relying too heavily on features that are specific to one tool.

That’s not to say that these features should _never_ be used, more so that their convenience needs to be properly weighed against their cost (in the form of lock-in). Plugins like Obsidian Dataview are incredibly convenient, but it’s unrealistic to expect it to be around and functional decades from now.[1](#fn:1) At least not at the same level of stability I’d expect Markdown to be.

I’m not saying that you should rush out and scramble your stable tooling for note-keeping or a lifetime’s worth of photos. Rather, if you do happen to be in a position where you’re looking to make a change it could _also_ serve as a way to boost (or hamper) your confidence in your data’s portability and longevity. Think of it like periodically testing your backups.

1. In fairness to TiddlyWiki, its filter&#x2F;widget system has been around and stable for at least a decade now. I have an old yet still perfectly functional TiddlyWiki lying around on my hard drive serving as proof. [↩](#fnref:1)