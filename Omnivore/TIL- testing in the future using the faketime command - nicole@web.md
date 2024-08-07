---
id: ddbc30aa-c913-456d-baa1-545daaab5bad
title: "TIL: testing in the future using the faketime command | nicole@web"
tags:
  - RSS
date_published: 2024-07-22 00:00:00
---

# TIL: testing in the future using the faketime command | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/til-testing-in-the-future-using-the-faketime-command-nicole-web-190dae1e569)
[Read Original](https://ntietz.com/blog/til-testing-future-using-faketime/)



Last week&#39;s blog post accidentally got published a few hours early[1](#this-too). One of the keen-eyed among you even submitted it to the orange site before it was officially up, since it was in my RSS feed briefly and was picked up by various RSS readers. Resolving that issue led me to discover the command &#x60;faketime&#x60; and a wonderful way of validating processes that are time and timezone dependent.

I&#39;m going to first talk about [the bug](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;til-testing-future-using-faketime&#x2F;#bug), then separately about [how I tested a fix](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;til-testing-future-using-faketime&#x2F;#testing-future). Feel free to skip ahead to [the testing](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;til-testing-future-using-faketime&#x2F;#testing-future) part if you want to skip the story.

## The bug that published my post early

Last week&#39;s post went up early because I was testing out a new way of publishing previews of posts, and that process had a bug. Previously, I would publish my entire site with drafts to a separate hosting stack just for blog previews. I didn&#39;t love that this required two separate deployment processes, though, and I kept admiring how [a friend](https:&#x2F;&#x2F;erikarow.land&#x2F;) has unlisted posts on her regular site for previews. So I wanted to do that!

Since my static site generator [doesn&#39;t have hidden pages](https:&#x2F;&#x2F;github.com&#x2F;getzola&#x2F;zola&#x2F;issues&#x2F;2391), I accomplished it by customizing my site templates. One of the comments in that issue thread yields a way to achieve this. Adapting it for all the files I needed, I put something like this inside my templates for &#x60;atom.xml&#x60; and my blog&#x2F;tag pages[2](#tag-bug):

&#x60;&#x60;&#x60;twig
&lt;!-- snippet from templates&#x2F;blog.html --&gt;
{% set ts_now &#x3D; now() | date(format&#x3D;&quot;%Y-%m-%d&quot;) | date(format&#x3D;&quot;%s&quot;) | int %}

{% for page in section.pages %}
  {% set ts_page &#x3D; page.date|default(value&#x3D;0)|date(format&#x3D;&quot;%s&quot;)|int %}
  {% if ts_page &lt;&#x3D; ts_now %}
    &lt;li&gt;{{page.date}}: &lt;a href&#x3D;&quot;{{ page.permalink | safe }}&quot;&gt;{{ page.title }}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
  {%- endif -%}
{% endfor %}

&#x60;&#x60;&#x60;

This worked great, and I was able to get feedback on last week&#39;s post by sending a link to the hidden page! Neat!

The problem came when I published a typo fix before going to bed on Sunday. The post was scheduled for Monday, and when I published a typo fix, it had already become Monday in UTC. I am on the US east coast, and my computer is set to use Eastern Time. So imagine my surprise when, upon publishing a typo fix, this post also became public and appeared in the feeds! My static site generator was using UTC for the post dates.

I quickly made a small change to remove it from the feeds (I set the post a year in the future). But I couldn&#39;t let go of the bug, and I came back to it this week.

I eventually made another tweak to my templates to, effectively, strip out timezone information. It&#39;s hacky, but it works. But how do I make sure of that?

To verify my change, I had to figure out how to check it at a few critical times. Since I want posts to publish on a particular calendar day in my local timezone, I wanted to check if the day before at 11pm filters it out and the next day at 1am includes it.

I stumbled across [faketime](https:&#x2F;&#x2F;github.com&#x2F;wolfcw&#x2F;libfaketime), which I installed from a system package. It&#39;s available on Fedora via &#x60;sudo dnf install libfaketime&#x60;, and similar packages exist on other distributions.

Using it is straightforward. You give it a timestamp and a program to run. Then it runs the program while intercepting system calls to time functions. This lets you very easily test something out at a few different times without any modifications to your program or system clock.

Here&#39;s how I used it for testing this issue:

&#x60;&#x60;&#x60;pgsql
# verify that the post disappears before publication time
faketime &quot;sunday 11pm&quot; zola serve

# verify that the post appears after publication time
faketime &quot;monday 1am&quot; zola serve

&#x60;&#x60;&#x60;

It can do a few other really useful things, too.

* Set a specific time:
* Start at a time, and go 10x faster:
* Advance by an interval (here, 10 seconds) on each call to get the system time: &#x60;faketime -f &quot;@2024-07-21 23:59:00 i10.0&quot; zola serve&#x60;

I just use the simple ones with relative times usually, but it&#39;s very nice being able to speed up time!&#x60;faketime&#x60; is available as a program or a C library, so it can also be integrated into other programs for testing.

---

1

With a deep dose of irony, this post _also_ published early. I spent a couple of hours digging in last night and fixing something, because originally I&#39;d not really fixed the bug! Now it is truly fixed, but wow was that a funny twist.

[↩](#this-too%5Fref)

2

This approach does yield a minor bug: hidden posts are included in the count for tags, but are _not_ displayed in the list. In an ideal world, I&#39;d not include them in the count. But this is not an ideal world.

[↩](#tag-bug%5Fref)

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).