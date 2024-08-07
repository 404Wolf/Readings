---
id: a0e85db6-2cc2-4c92-ba78-20a115b8a200
title: Building Khaganate
tags:
  - RSS
date_published: 2024-05-23 18:00:21
---

# Building Khaganate
#Omnivore

[Read on Omnivore](https://omnivore.app/me/building-khaganate-18fa805c1e9)
[Read Original](https://iafisher.com/blog/2022/02/building-khaganate)



[Last week&#39;s blog post](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2022&#x2F;02&#x2F;khaganate) described Khaganate, my suite of personal productivity software. This post is a brief follow-up about the tools and technologies I used to build Khaganate.

Khaganate is intended to make me _more_ productive, so it is important that development is as fast as possible. I lean heavily on three frameworks:

* [Django](https:&#x2F;&#x2F;www.djangoproject.com&#x2F;), for the backend
* [Vue](https:&#x2F;&#x2F;vuejs.org&#x2F;), for the frontend
* [Bootstrap Vue](https:&#x2F;&#x2F;bootstrap-vue.org&#x2F;), to extend Vue with a library of high-quality components

Each of them is powerful and easy to use, and (equally as important) has great online documentation.

I&#39;ve supplemented these frameworks with Khaganate-specific code to make development even faster.

I wrote a [set of generic database APIs](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;khaganate-snapshot&#x2F;blob&#x2F;master&#x2F;server&#x2F;api%5Fdatabase.py) like &#x60;&#x2F;api&#x2F;db&#x2F;get&#x2F;&lt;table&gt;&#x60; that the frontend calls to interact directly with the database, saving me the need to write dozens of cookie-cutter CRUD endpoints for all the different database tables. Sometimes I can implement entire new features without having to make any changes to the backend. The database APIs are powered by the [isqlite](https:&#x2F;&#x2F;isqlite.readthedocs.io&#x2F;en&#x2F;latest&#x2F;) library, which I wrote for use by Khaganate.

I often need to call the same code in JavaScript and in Python. I wrote a [decorator](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;khaganate-snapshot&#x2F;blob&#x2F;master&#x2F;server&#x2F;adapter.py#L10) that transforms a Python function into a Django view so that the function can be exposed as a JSON API with minimal extra effort. The decorator handles JSON serialization and deserialization, conversion between snake case and camel case, and POST payloads and URL parameters. It also enforces that the database connection for GET requests is set to read-only.

On the frontend, I wrote a [LoadingBox](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;khaganate-snapshot&#x2F;blob&#x2F;master&#x2F;frontend&#x2F;components&#x2F;LoadingBox.vue) Vue component that fetches data from a backend API, displays a loading icon, and optionally refreshes the page upon request. This makes intricate interactions on the home page simple: when I log a habit, for example, the habit box component emits an event for the root home page component to catch, which then increments a refresh counter that is passed to the goals box component, causing it to refresh its data. As a result, when I log a habit that is tracked by a goal, the goal updates instantly.

A generic [ModalForm](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;khaganate-snapshot&#x2F;blob&#x2F;master&#x2F;frontend&#x2F;components&#x2F;ModalForm.vue) component makes it easy to embed modal forms for any kind of data. It takes a parameter describing the fields of the form, and handles rendering, validation, and submission.

Vue components call backend APIs using the [ApiService](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;khaganate-snapshot&#x2F;blob&#x2F;master&#x2F;frontend&#x2F;services&#x2F;api%5Fservice.js). The &#x60;ApiService&#x60; deserializes the response, handles the cross-site request forgery token, and shows a pop-up error message if the HTTP request fails. It also prints the full response to the browser console, which is very useful for after-the-fact debugging.

It is not specific to Khaganate, but the [precommit](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;precommit) library that I wrote to manage Git pre-commit hooks has proven invaluable in catching errors and enforcing code style. I also have a Git review page within Khaganate, triggered by invoking the script &#x60;kgx review&#x60;, which shows the staged changes as GitHub-style diffs; I use it for self-reviewing my code.

I recognize the humor of writing productivity tools to make the development of my productivity software more productive. But the effort has paid off. Last month I wrote an entire new goals system in less than an hour and 200 lines of code. My life changes, sometimes quickly, and my tools must keep up. ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2022-02-building-khaganate.md).