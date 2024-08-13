---
id: 54e4ca31-f2e5-41de-abcd-4feb07fd42b2
title: "Checking train times with Shortcuts :: ryan.isaac.g"
tags:
  - RSS
date_published: 2024-07-24 00:00:00
---

# Checking train times with Shortcuts :: ryan.isaac.g
#Omnivore

[Read on Omnivore](https://omnivore.app/me/checking-train-times-with-shortcuts-ryan-isaac-g-190e6a904cb)
[Read Original](https://ryanisaacg.com/posts/path-times/)



I live in Jersey City and rely on the [PATH](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;PATH%5F%28rail%5Fsystem%29) to get into the city. During commute windows, headways are conveniently every 5 minutes. Outside of those windows, the Newark↔World Trade Center line plummets to every 20 minutes. There’s no use leaving my apartment whenever I’m ready; I _have_ to plan around the train schedule. The PATH’s app does not make this easy. Real-time station information can be pinned to the app’s homepage, but it takes an seconds or minutes to load. The non-real-time schedule requires multiple taps, each with their own little loading segments to access. If I’m getting ready to go, it’s pretty annoying to figure out what train I should be shooting for.

While I’m at the Recurse Center, I figured I should embrace the hacker spirit and solve this problem with some software. My first thought was an SMS-based solution. NJ Transit allows you to text them with a bus or light rail stop number in exchange for arrival times; I think the MTA has something similar. I planned to build a shortcut which would send the correct text and report the result, so I could trigger the workflow at the press of a button. Unfortunately… the PATH has no such texting-based option. Clearly I’d have to some programming, so I began to search for what sort of API the PATH exposed.

Fool that I am, expecting answers to be so simple. There is no public-facing PATH API, at least not one that’s immediately apparent. Fortunately, someone else has already [reverse-engineered the PATH app and published their findings.](https:&#x2F;&#x2F;medium.com&#x2F;@mrazza&#x2F;programmatic-path-real-time-arrival-data-5d0884ae1ad6) The reason real-time data takes so long to load in the app is that it’s subscribed to the next _update_, not retrieving the information directly. It seems there’s no official PATH endpoint to retrieve the most recent train data at all! Thankfully for me, the aforementioned reverse engineer has a cache to store each update and make it available over an HTTP API. Phew.

With an HTTP API in hand, I began to think about how best to use it. Bookmark the URL and read the JSON myself? No, the train times are in UTC and mentally converting them to Eastern would be too much work. Create a tiny webpage that displays the information? Maybe, but it doesn’t seem that convenient to access at a moment’s notice. Write an app? That seemed too heavyweight for my goals. I happened to be on the train while thinking of my next step, and reached for a tool available on my phone: [iOS Shortcuts](https:&#x2F;&#x2F;support.apple.com&#x2F;guide&#x2F;shortcuts&#x2F;welcome&#x2F;ios).

Shortcuts is a drag-and-drop programming language Apple makes available for system automation. It comes with a few built-in tools, and third-party apps can make actions available if they’re installed. I was delighted to discover one of the built-in tools could send an HTTP request and another could convert the JSON result into a Shortcuts Dictionary. Some fiddling with loops and variables ensued, and I was left with a script that retrieves the HTTP data and creates simple textual output as a result. You can check out [the finished product](https:&#x2F;&#x2F;www.icloud.com&#x2F;shortcuts&#x2F;25814ae385ce46a593d6d2ea602a6b65) if you have an Apple device of some kind.

Siri integration with Shortcuts is out-of-the-box, so my solution ended up more convenient than I expected. Now I can long-press my watch crown button and say ask for the path times, and after a second or two my watch will read off the upcoming departures from my local station. This is exactly what I wanted: no-fuss train information that doesn’t break my flow as I get ready.