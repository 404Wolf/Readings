---
id: 7be73593-1693-4e0d-becd-1bf51626f082
title: RC Weeknotes 01 | Gianluca.ai
tags:
  - RSS
date_published: 2024-08-19 21:05:16
---

# RC Weeknotes 01 | Gianluca.ai
#Omnivore

[Read on Omnivore](https://omnivore.app/me/rc-weeknotes-01-gianluca-ai-1916e65bbe4)
[Read Original](https://gianluca.ai/rc-weeknotes-01/)



Notes from my first week of Recurse or: How I learned to stop nerdsniping and love Rust.

19 Aug 2024 · 7 min · Gianluca Truda

Table of Contents

* [What I made](#what-i-made)  
   * [Conway’s Game of Life](#conways-game-of-life)  
   * [Weekly (sub)routine](#weekly-subroutine)  
   * [Leetcode, but do it multilingual](#leetcode-but-do-it-multilingual)  
   * [A lot of lists and notes](#a-lot-of-lists-and-notes)
* [What I learned](#what-i-learned)  
   * [Ableton’s .als files are just gzipped XML](#abletons-als-files-are-just-gzipped-xml)  
   * [Deciding to measure something orients you towards it](#deciding-to-measure-something-orients-you-towards-it)  
   * [The crusty Rustaceans got me! 🦀](#the-crusty-rustaceans-got-me-)
* [Intentions for week 2](#intentions-for-week-2)

I’ve completed my first week since [joining the Recurse Center (RC)](https:&#x2F;&#x2F;gianluca.ai&#x2F;recurse-init).

As I mentioned in that announcement, I’ll be posting about the process and my projects in support of my goal of writing more and RC’s [self-directive](https:&#x2F;&#x2F;www.recurse.com&#x2F;self-directives) to _learn generously_. This is the first [weekly installment](https:&#x2F;&#x2F;gianluca.ai&#x2F;tags&#x2F;weeknotes).

FYI: You can follow all my progress at RC by filtering for posts with the [Recurse tag](https:&#x2F;&#x2F;gianluca.ai&#x2F;tags&#x2F;recurse).

---

Most of our batch came to the same realisation at some point on Wednesday: that the first week of RC is a lot less productive than we’d expected.

![Zulip checkin - Gianluca](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3XtHYafZlrT623kwMZT9pVhSfXvtXS4MSjCppXWlkCo&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-01&#x2F;images&#x2F;zulip-checkin-first.png)

You would assume some onboarding and getting familiar with the tools, and there was. But the tools are really fun and expandable and are projects of their own. And then there’s the rest of the batch — a collection of wonderful and fascinating people from a plethora of backgrounds and with manifold interests.

It’s exceptionally hard to say no to anything or anyone in the first week. And you certainly shouldn’t! I had a half dozen superb “coffee chats” with the faculty and fellow batchmates and joined informal workshops on audio&#x2F;music processing, pair programming, creative coding, game development, and even some non-programming talks on tiramisu and moss. They were all fantastic and gave a great sense of everyone’s styles and interests.

RC batches overlap, so some veterans from Summer 2 ‘24 did presentations this week. I’m used to startup tech pitches and hackathon demos, but this was something different. A bizarre and wonderful and wholesome smorgasbord of delightful hacks, games, and deep-dives.

With all of that hyperstimulus and FOMO, the majority of week 1 was meeting people and unearthing shared interests to form groups around. Towards the end, we worked on refining our goals through some workshops and conversations.

By Friday, it seemed like most folks were getting stuck in to at least one project or course. In that sense, I feel a little bit behind.

## What I made

### Conway’s Game of Life

I don’t have much practice in actual Driver-Navigator pair programming. It’s a technique that’s been quite taboo just about everywhere I’ve ever worked with others. It’s also entirely terrifying and probably worth improving as a skill.

Fortunately, RC is big into pairing and it’s one of the activities the alumni all wish they had done more of.

I was randomly paired with a batchmate and we were given an hour to implement Conway’s famous Game of Life. It went just about as well as you could hope, but it’s a muscle that’s never been worked and will need lots more reps to feel _good_ at. I still struggled to get into my flow once we began coding, but our conversation really helped break down the problem faster and more cleanly.

### Weekly (sub)routine

I spontaneously joined the Creative Coding group on Wednesday. We riffed on the prompt “routine, but all out of whack” for an hour and then did some demos. There was some wild and hilarious stuff on show.

I ran with the dual meaning of “routine” as a sequence of activities and the programming sense of a procedure and made [Weekly (sub)routine](https:&#x2F;&#x2F;editor.p5js.org&#x2F;gianlucatruda&#x2F;sketches&#x2F;wegzz7xVj &quot;https:&#x2F;&#x2F;editor.p5js.org&#x2F;gianlucatruda&#x2F;sketches&#x2F;wegzz7xVj&quot;): a procedurally-generated schedule for your week. It was my first time using [p5.js](https:&#x2F;&#x2F;p5js.org&#x2F;), which proved quite convenient for this sort of creative jam session, but I missed vim motions a lot!

![Screenshot of Weekly subroutine demo](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sDOLp8tgaMWrbWGTht69YjbPR5_vhH3OuUqwfowDsG7E&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-01&#x2F;images&#x2F;weekly-subroutine-demo.png)

### Leetcode, but do it multilingual

One of the often-repeated pieces of advice from the RC faculty is that the most successful Recurses are typically the ones who write the most code. To that end, I decided I should make sure to **write at least _some_ code every single day**.

The Daily Leetcode bot posts a collection of problems in the Zulip chat, so I decided to take on an LC easy each day. Despite getting deeply frustrated with one or two, I was able to boost my confidence later in the week by solving most of them in a few minutes.

That was all in Python. But one of my [goals for RC](https:&#x2F;&#x2F;gianluca.ai&#x2F;recurse-init#what-are-you-planning-to-work-on) is to get decent at some compiled languages. So I made time to translate my Python solutions into C (painful), then Rust (amazing, clean, performant), and Go (similar syntactic complexity, but not as performant and intuitive) with the help of GPT-4\. That’s officially my first Rust and Go programs!

![Screenshot of Rust program in LeetCode](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sTgwo3dfgGMR9AwWeaqYkaJb6f2u-MP0Mp1_kMeZ88G8&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-01&#x2F;images&#x2F;lc-rust.png)

### A lot of lists and notes

My Obsidian Vault didn’t know what hit it this week. I’m just throwing things down as they come to me: things I learn, links to recommended resources, project ideas, etc. I’ve also been using the [Day Planner plugin](https:&#x2F;&#x2F;github.com&#x2F;ivan-lednev&#x2F;obsidian-day-planner) to do timeblocking in my daily notes. This proved really helpful when it came to writing my daily check-in posts on Zulip — a great RC convention — as I could get a good snapshot of my day in a single note.

Towards the end of the week, I collected all the ideas, resources, and notes together and started trying to organise and prioritise them. I’ve been thinking about doing RC for a while and I’m generally the kind of person who keeps a running list of “Someday, maybe” projects, so I brought a _lot_ into this.

![Screenshot of a Kanban board of learning resource links in Obsidian](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,skKl-efGI5MkZ2rkS3H0GQNVUELCEuPgs7e7k1iW8kcw&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-01&#x2F;images&#x2F;kanban-resources.png) ![Screenshot of a Kanban board of project ideas and goals in Obsidian](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s03YX9P1OaqeqrVZVigMGfx15X5P74gR-8x6ixq1hetg&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-01&#x2F;images&#x2F;kanban-ideas.png)

A large part of the reason I haven’t started building a major project yet is that I’ve been overwhelmed with trying to distill all the exciting possibilities down into a clear and coherent plan.

Fortunately, with the help of the [Kanban plugin](https:&#x2F;&#x2F;github.com&#x2F;mgmeyers&#x2F;obsidian-kanban) and a good-old-fashioned notepad, I made great headway over the weekend on understanding what I really want to get out of Recurse and how I can best go about it. (As someone who lives in vim and Obsidian, I’m a bit annoyed at just how effective the pen and paper approach was to unsticking some non-linear gestalts amidst the clutter.)

I have new posts in the pipeline about that process and the resulting plan of action.

## What I learned

### Ableton’s .als files are just gzipped XML

I mean, good luck making sense of it, but GPT-4o can ingest it all and give you a pretty good overview. Still not sure how to make this _useful_, but it’s certainly handy to know. Thanks, Ryan.

For me, on macOS, the following was all I needed:

| 1 | gzip -cd mySong.als &gt; mySong.xml |
| - | -------------------------------- |

### Deciding to measure something orients you towards it

I technically already knew that, but I was reminded of it’s effectiveness when I started scoring myself (out of 10, no 7s allowed) on each of RC’s [self-directives](https:&#x2F;&#x2F;www.recurse.com&#x2F;self-directives), then elaborating.

This trick of score-and-elaborate is something I discovered during my Quantified Self journey a decade ago and fine-tuned during my time in the EF accelerator. It was invaluable in building and growing Bountyful AI.

I applied that to my daily check-ins since Thursday and it has been shaping how I think about tackling each day since — I’m oriented towards the self-directives and constantly have them in mind. I’m glad to see some other Recursers found the idea helpful and are adopting it themselves.

![Screenshot of Gianluca tracking self-directives on Zulip](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sl-1q0f4SeXyRz0SXqOv5ONkFat5IYuVE8m0KeFDzDNM&#x2F;https:&#x2F;&#x2F;gianluca.ai&#x2F;rc-weeknotes-01&#x2F;images&#x2F;zulip-checkin-directives.png)

### The crusty Rustaceans got me! 🦀

I came into RC with Rust on my list of candidate languages (along with Go, Zig, and getting better at C &#x2F; C++). But in the weeks building up to the batch, I had become increasingly convinced that Go was the right one to try first — ubiquitous, simple, useful, performant for my typical use cases, extensive standard library. But it only took a few days of talking to my batchmates and stumbling down a couple rabbit holes to see why Rust is so adored.

I mean, it’s pretty cool that Rust’s type system is effectively a finite state machine with the compiler enforcing all paths.

Recommendation: No Boilerplate’s Rust video that sold me (there are [lots more](https:&#x2F;&#x2F;www.youtube.com&#x2F;playlist?list&#x3D;PLZaoyhMXgBzoM9bfb5pyUOT3zjnaDdSEP)): [Rust for the impatient](https:&#x2F;&#x2F;youtu.be&#x2F;br3GIIQeefY &quot;https:&#x2F;&#x2F;youtu.be&#x2F;br3GIIQeefY&quot;), which is based on the article [A half-hour to learn Rust](https:&#x2F;&#x2F;fasterthanli.me&#x2F;articles&#x2F;a-half-hour-to-learn-rust).

tldr; I’ll probably be writing some Rust at RC.

## Intentions for week 2

I’ve spent a lot of my focussed solo time in week 1 reading wikis, organising resources, and writing notes&#x2F;posts&#x2F;check-ins.

My goal for week 2 is to put all that preparation to use and start shipping code (and blog posts). That begins with clarifying my goals and projects for RC (coming soon) and then actually getting stuck in.