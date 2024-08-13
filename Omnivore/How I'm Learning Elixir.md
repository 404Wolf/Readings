---
id: 7fb08e90-b304-4fbb-a6e0-274e8c0fd7af
title: How I'm Learning Elixir
tags:
  - RSS
date_published: 2024-06-19 17:26:53
---

# How I'm Learning Elixir
#Omnivore

[Read on Omnivore](https://omnivore.app/me/how-i-m-learning-elixir-19033fae41a)
[Read Original](https://blog.aos.sh/2024/06/19/how-im-learning-elixir/)



[Elixir](https:&#x2F;&#x2F;elixir-lang.org&#x2F;) is a functional language that runs on the Erlang VM. I’ve always been curious about it as I have a soft spot for functional languages. The primary motivating driver is to learn to use the[Phoenix web framework](https:&#x2F;&#x2F;phoenixframework.org&#x2F;). I enjoy building web apps, and have done so in Node.js, Ruby&#x2F;Rails, Python, Go, and most recently, Rust. However, none of these languages has felt enjoyable for building web applications.

I had an idea to build another app and wanted to test out Elixir&#x2F;Phoenix. In typical fashion, and as I was on a timeline, I dove headfirst, built a very simple prototype, and… I really enjoyed that experience. So now I’m on a mission to learn it properly, and this post catalogs my experience and the resources I’ve been using.

### Books

1. [**Elixir in Action**](https:&#x2F;&#x2F;www.manning.com&#x2F;books&#x2F;elixir-in-action) \- I started here as this is the most recommended book, but I wanted something that is more adjacent with what I’ll be using Elixir for initially: to build web apps using Phoenix. I’ll come back to this book at some point as I really enjoy the author’s style of writing. He’s also given my [favorite Elixir talk](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;JvBT4XBdoUE).
2. [**Programming Phoenix LiveView**](https:&#x2F;&#x2F;pragprog.com&#x2F;titles&#x2F;liveview&#x2F;programming-phoenix-liveview&#x2F;) \- This book really hit the spot for me. It’s a good mix of practical instructions and distilled best practices. It suffers from a bunch of errata, but that’s to be expected of a book still in beta. I found it a good exercise to fix the issues that come up myself.

### Courses

1. [**Elixir &amp; OTP**](https:&#x2F;&#x2F;pragmaticstudio.com&#x2F;courses&#x2F;elixir) \- I followed along this course and found it well done. It went through at a high level all the features of Elixir, while building a project. I enjoyed learning and building on top of GenServers and Supervisors.
2. [**Phoenix LiveView**](https:&#x2F;&#x2F;pragmaticstudio.com&#x2F;courses&#x2F;phoenix-liveview) \- This is another great course by Pragmatic Studio. To be honest, I should have waited to take this course. I dove pretty hastily into it after finishing Elixir &amp; OTP and I don’t think I crystallized the material in it, so when I finished it, I was still a bit lost when starting up a new project. I _should have_ started a new project, then slowly worked through this, bouncing back and forth.
3. [**Build an MVP with Elixir**](https:&#x2F;&#x2F;indiecourses.com&#x2F;catalog&#x2F;build-an-mvp-with-elixir-6i4V9yOqLL54GuG0HkV9HR) \- This course was more “practical”, incorporating the business domain of building a product, such as payment handling and deployment. I enjoyed these parts of the course. I appreciate the author’s recommendations on preferred libraries to use and was a good starting point for me when thinking about my next application.

Honestly - the documentation for Elixir and its libraries is probably some of the best I’ve seen. It is well thought out, provides numerous examples, and is available offline&#x2F;locally (eg. just fire up the REPL, type &#x60;h Enum.into&#x2F;3&#x60;). Last but not least, it has a lot of _guides_ and best practices on when to use certain features of the language, for example: [the documentation on state management](https:&#x2F;&#x2F;hexdocs.pm&#x2F;elixir&#x2F;1.17.1&#x2F;agents.html).

The community over at [Elixir Forum](https:&#x2F;&#x2F;elixirforum.com&#x2F;) is kind, welcoming and very helpful. I’ve found most of my questions answered here vs. something like Stack Overflow. That was mildly surprising! I would frequently search these forums first for an answer to my question.

### Open-source applications

This is an area I wish there was more of. I wanted to browse open-source applications so I can see how some particular problems were solved when I ran into them. The two I know of currently:

1. [**live\_beats**](https:&#x2F;&#x2F;github.com&#x2F;fly-apps&#x2F;live%5Fbeats) by the creator of Phoenix
2. [**Plausible Analytics**](https:&#x2F;&#x2F;github.com&#x2F;plausible&#x2F;analytics)

I’m sure there’s more, but that’s the best I’ve found so far.

### Building things

This section is the shortest, but it goes without saying that learning a language and not building things with it is probably a waste of time. As I’ve gone through some of the learning material above, I’ve started to generate a bunch of ideas on how to use the features of the language to build projects (both big and small). Some of things I’ve built or currently building:

* A simple Gen AI project that utilizes GenServers to make expensive calls to external APIs in the background and cache them
* An app that hooks into my smart plug to automate activation of a cat feeder using [Nerves](https:&#x2F;&#x2F;github.com&#x2F;nerves-project&#x2F;nerves)
* A bookmarking web app to play around with Phoenix&#x2F;LiveView
* [Advent of Code](https:&#x2F;&#x2F;adventofcode.com&#x2F;) at some point?
* I also want to play around with [Bumblebee](https:&#x2F;&#x2F;github.com&#x2F;elixir-nx&#x2F;bumblebee)&#x2F;[Livebook](https:&#x2F;&#x2F;livebook.dev&#x2F;)

### Setup of development environment

The guide for installing Elixir&#x2F;Phoenix locally is relatively simple, but I didn’t want to have a bunch of packages and installs all over my home directory. And because I use NixOS (it would be remiss of me if I didn’t shill Nix at some point), I spent the initial part of the install&#x2F;setup process figuring out how to get it all into a [flake template here](https:&#x2F;&#x2F;github.com&#x2F;aos&#x2F;flake-templates&#x2F;blob&#x2F;master&#x2F;elixir-phx&#x2F;flake.nix). This proved to be a fruitful exercise as I am now able to spin up dev environments on the fly for any project quickly.

### Some thoughts

Elixir has been an enjoyable experience to both read and write. I’ve found the ecosystem and resources around it very high quality, and that’s certainly helped in getting me productive quickly. This post should hopefully serve both as an endorsement and guide for those thinking about or have started learning Elixir.