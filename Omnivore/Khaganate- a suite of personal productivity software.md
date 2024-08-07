---
id: d59bbd34-4b45-4270-a00a-6950ce9a133f
title: "Khaganate: a suite of personal productivity software"
tags:
  - RSS
date_published: 2024-05-23 18:00:21
---

# Khaganate: a suite of personal productivity software
#Omnivore

[Read on Omnivore](https://omnivore.app/me/khaganate-a-suite-of-personal-productivity-software-18fa805bfd3)
[Read Original](https://iafisher.com/blog/2022/02/khaganate)



In the past two years, I have replaced many of the consumer software programs I use with software that I write and maintain myself. One happy consequence has been that whenever a program lacks a feature I want, I can simply implement it myself. Another is that I have been able to tightly integrate many of the programs I use into a single system. I call this system **Khaganate**.

Khaganate includes:

* a habit tracker
* a task tracker
* a goal tracker
* a personal finance spreadsheet
* a reading and watching log
* a calendar app
* a journal
* a bookmarks manager
* go links
* a metrics dashboard
* a spaced-repetition quiz system
* a file explorer
* a search index
* a travel map

This post describes what Khaganate does and how I use it. In [next week&#39;s post](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2022&#x2F;02&#x2F;building-khaganate), I detail the tools and technologies I used to build Khaganate.

The post is illustrated with many screenshots of Khaganate&#39;s interface. I have redacted some information for the sake of my personal privacy, but otherwise the screenshots show Khaganate exactly as it appears in my daily use. If you have JavaScript enabled, you can expand the images by clicking on them.

## Home page

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,svIHvzV-gwGfOPOEksqt08I_jbtSXVKkm5XJqkjtnBMY&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;home.png)

The first thing I do after I power on my computer in the morning is start the Khaganate server locally and open up Khaganate&#39;s home page in my browser. (I run Khaganate locally because it&#39;s simpler and more secure than hosting it on the internet.)

The home page includes a habits tracker, a task inbox, a calendar, and a goals box, each of which will be covered in their own sections. At bottom left are a few useful links — recording expenses and exercise, and adding events to my calendar — and a list of recently bookmarked links.

## Habits

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,stRR8pW642E-k44Yv8DdXUJFnGs32fq4owaZzR_bLu1k&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;habits.png)

I&#39;d used habit trackers for several years before starting Khaganate, mostly the excellent [Loop Habit Tracker](https:&#x2F;&#x2F;github.com&#x2F;iSoron&#x2F;uhabits) for Android. The first iteration of the Khaganate habit tracker was similar to Loop, with a set cadence for each habit and a grid of daily checkmarks. I switched to a linear view because it takes up less space and allows me to record multiple instances of the same habit in a single day. Each habit carries a certain number of points, and I track the total points from good and bad habits on my metrics dashboard. The individual habits are also useful as their own metrics (e.g. &quot;How many times did I cook this month?&quot;), and for setting goals that can be tracked automatically (for example, &quot;Eat out less than X times a month&quot;).

## Tasks

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,snCa68uFM_zOVD-bdXk2i3bP3zjETH4XmJImbVq_tdSg&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;tasks-1.png)

Also on the home page is my task inbox. The screenshot above shows six tasks in the inbox. The two high-priority tasks are separated from the four lower-priority tasks by a horizontal line. There is an inline form at the bottom to quickly create new tasks, and a button next to each task to mark it as done. I found that it is essential for the experience to be as frictionless as possible, or else I won&#39;t use the task tracker consistently.

The task boxes on the home page are expandable. The screenshot below shows the &quot;Check out Beeware library&quot; task expanded.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3Wtsb_6Eq3MQHsBGnVdF3uKY8bZ4Y16NzY9nS5BfBLY&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;tasks-2.png)

Tasks can have a description (like most free-form text in Khaganate, it is rendered as Markdown) and an unlimited number of comments. Tasks have a status field (open, fixed, won&#39;t fix, obsolete, or duplicate) and a priority from 0 to 4\. They may also have a deadline, which will cause them to show up in the task inbox regardless of their priority if the deadline is impending.

There is a dedicated page which lists all the tasks:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,swo5jwIutrhaRjV0Gy0fIjWt-IXNtCYMQC7h32vdOew8&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;tasks-list.png)

In the screenshot, the list is filtered by a search query which matches against the task&#39;s title. It can also be filtered by status, priority, and deadline.

## Goals

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sgC6cSOxaO9V8bwvoZn1Nvx4a_st0FjiBj358i50hKmY&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;goals.png)

I use Khaganate to track monthly, quarterly, and yearly goals. Many of these goals are tracked automatically: for instance, the progress bar for &quot;Read 5 books&quot; is auto-filled from my reading log within Khaganate, and &quot;Set up better infra for personal site&quot; is tied to the status of a task in the task tracker. Other goals, like &quot;Publish 2 blog posts&quot;, have to be updated manually. The gray progress bar at the top of each section shows how much time has elapsed in that month, quarter, or year.

## Finances

One of the first systems I built in Khaganate was a personal finances spreadsheet.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s-N269AIYdv-cWh1K_Htu1cHjpStpjM7C9SiumhUleIE&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;finances-month.png)

The month log page shows my total income and expense, with a pie chart breaking it down by category. I categorize everything in two levels, e.g. &quot;Food &#x2F; Groceries&quot; or &quot;Shopping &#x2F; Technology&quot;; the pie chart only shows the primary categories. Below the chart are two tables listing my credits and debits line-by-line, along with buttons to open a modal form to record new credits and debits.

There is also a yearly summary page:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sWKFH7hIS455UxmFw4eoDjuOHASVWq3LrnoLvL3OPIEk&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;finances-year.png)

It was too hard to partially redact my real data, so I just populated the interface with fake data. In a real year, there would be closer to a dozen categories in the pie chart. I don&#39;t check this page often, but it&#39;s helpful to have the data so I can look back at years of financial information when I need to.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNSsROdijqA2cLSb2uInFGNIJLzRu2aqt_hC1nsOM_L0&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;finances-category.png)

Each category and subcategory has its own page that shows spending in that category over time.

## Books and films

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s_tMVg-M0ousgTSRHVXhSB5y3_ulX_l0espGTiHEc6g4&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;books.png)

I use Khaganate to record the books that I read and the films that I watch. Pictured above is my reading log for the month of February 2022; a similar page exists for films, and there are yearly and lifetime summary pages.

The number of books read is adjusted for both the length of the book and the time during the month. For example, the first book, _Geology: A Self-Teaching Guide_, was mostly read in the previous month, so it only counts as 0.1 books for February.

## Calendar

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,soNQI4ZsLIrk8YgtdtKMf5SAFuF6AVJ8bM6smzZtgthc&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;calendar.png)

I built a simple calendar app inside Khaganate because I was frustrated with Google Calendar. The main benefit is that it appears on Khaganate&#39;s home page, which I check every morning. It isn&#39;t too fancy, but it does support recurring as well as one-off events, and exceptions for recurring events (e.g., no work because of a holiday, or skipping a weekly meeting). Events can have extended descriptions, as well as added time for travel which shows up before and after the event on the calendar. Events can have a location, which will turn the event title into a hyperlink to Google Maps.

## Journal

I keep a regular journal that is stored in Khaganate&#39;s database. The journal page is barebones, so I haven&#39;t included a screenshot, but it does include my calendar for that day, the books I was reading, and any expenses I incurred, as well as the actual text of the journal entry if there is one.

## Bookmarks

I found both Firefox&#39;s and Chrome&#39;s built-in bookmarking tools to be limited, so I wrote my own. It&#39;s a browser extension (triggered by Alt+D in Chrome) with a similar interface to the built-in bookmark form, with a few optional extra fields like author, year, keywords, and topics. I can also add a long-form Markdown annotation (usually a brief summary of the main points).

Then, I can see all bookmarks organized by topic, pictured below. Unlike bookmark folders, a single bookmark can be associated with multiple topics.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,soOK0GyNkFCVBNadRfnRWsmre86GN6osdcGdaXcHzNFY&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;biblio.png)

Bookmarks can be marked as good or excellent quality, which causes them to show up higher in the list above.

## Go links

I wrote about go links in an [earlier blog post](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2020&#x2F;10&#x2F;golinks). The example code in the blog post uses a Flask server; on my own computer, the go links server is part of Khaganate. Besides a database of hard-coded go links like &#x60;go&#x2F;weather&#x60;, there are also parameterized links like &#x60;go&#x2F;python&#x2F;XYZ&#x60;, which takes me to the documentation for the &#x60;XYZ&#x60; module in Python&#39;s standard library, and other short links like &#x60;w&#x2F;XYZ&#x60;, which takes me to the article &quot;XYZ&quot; on Wikipedia.

As explained in the blog post, a browser extension is required to redirect short links to the Khaganate server.

## Metrics

Khaganate includes a metrics dashboard that pulls data from various other components:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s_gh1C4XPBtTvsGZTrOnLINOjLi4MGYbjDDu3Q6hdHBs&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;metrics.png)

Each metric has its own detail page with a graph of its value over time.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s6R-JT5stoBXDq-fx1eAofOxyAY9Nzz9qESs-j7ZPW5Q&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;metrics-graph.png)

## Drill

I earlier wrote [a command-line tool](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;drill) to take spaced-repetition quizzes. I ported this to Khaganate to unlock new possibilities, mainly the ability to display images in quizzes (although I haven&#39;t implemented this yet).

## Files

Most of my important files live in a &#x60;files&#x2F;&#x60; directory in my home folder. It is tracked by git, and a cron job running once an hour automatically commits any unstaged changes. The cron job also pushes the changes to a remote repository, which serves as an auxiliary data back-up.

Khaganate contains a file browser that allows me to view and edit files and examine their revision history. I tend to still use the shell and vim for file management, but the file browser does allow me to link directly to files elsewhere in Khaganate. For example, I can take notes on a book and then link to the notes file from the reading log.

## Search

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sXMDmxjbywnmhZ9o6QoSS0Psn-LCTlO7P0C4trc5HjLI&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;search.png)

Almost everything in Khaganate is searchable: bookmarks, files, tasks, journal entries, financial transactions, and more.

## Travel

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5Z2rM6-X_vSOHNDUoUcZP0hdzn8KFrBeJvCkCqlCksQ&#x2F;https:&#x2F;&#x2F;iafisher.com&#x2F;static&#x2F;blog&#x2F;uploads&#x2F;khaganate&#x2F;travel.png)

I previously kept an SVG map of U.S. counties that I had visited, which I had to manually edit every time I visited a new county. With the advent of Khaganate, I was able to turn the travel map into a web app. Now I can click on a county on the map to open a form to record a visit there, instead of having to open up an SVG editor.

The screenshot above is for 2016, when I went on a road trip to Maine. Green counties are those where I spent the night; yellow where I visited; and orange where I only traveled through. (I wasn&#39;t recording county visits at the time — I reconstructed the route years after the fact, which is why parts of the map are disconnected.)

The travel map is mostly independent of the rest of Khaganate, but it&#39;s neat to look at.

## Conclusion

Sometimes while working on Khaganate I think of the [xkcd comic](https:&#x2F;&#x2F;xkcd.com&#x2F;1205&#x2F;) about whether or not it is worth it to make routine tasks more efficient. I&#39;ve certainly spent a lot of time on Khaganate — the git repository has more than 2,300 commits since November 2019\. Has it been worth it?

I think it has. If I hadn&#39;t built Khaganate, then tracking my tasks and goals would be much harder. I wouldn&#39;t be able to remember what I had read and watched. I would know little about my spending habits. (Khaganate was essential in helping me analyze why I spent much more money in 2021 than in 2020.) My bookmarks would be less organized. I&#39;d be more beholden to external services like Google Calendar.

I don&#39;t expect that Khaganate would be useful to or desirable for everyone, and I don&#39;t intend to maintain it as an open-source project. However, to accompany this blog post I have published a one-time scrubbed snapshot of the code, in case anyone wants to use it as a starting point or inspiration for their own project. You can find it at &lt;https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;khaganate-snapshot&gt;. It is released under the MIT license, so you are welcome to do with it whatever you wish. ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2022-02-khaganate.md).