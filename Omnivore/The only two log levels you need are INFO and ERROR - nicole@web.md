---
id: 2853c79a-00a4-11ef-8de1-cff797d2bbed
title: The only two log levels you need are INFO and ERROR | nicole@web
tags:
  - RSS
date_published: 2024-04-22 00:00:00
---

# The only two log levels you need are INFO and ERROR | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-only-two-log-levels-you-need-are-info-and-error-nicole-web-18f05c9a567)
[Read Original](https://ntietz.com/blog/the-only-two-log-levels-you-need-are-info-and-error/)



Logging is a critical tool for maintaining any web application, and yet we&#39;re getting it wrong.

With great logs, you can see what your application is doing. And without them? Things can be broken left and right without you ever finding out. Instead, you wonder why your customers don&#39;t come back, and shrug, and blame someone other than engineering.

Unfortunately, it&#39;s common for us to log in ways that are unhelpful. Log levels are inconsistent, and logs are added to fix bugs then removed afterwards. But come on, you saw the title, this is about the log levels, mostly.

## The typical log levels

Most languages and logging libraries have a handful of log levels, at least five. But they vary! Here are three examples:

* Rust&#39;s &#x60;tracing&#x60; has [five log levels](https:&#x2F;&#x2F;docs.rs&#x2F;tracing&#x2F;latest&#x2F;tracing&#x2F;struct.Level.html): ERROR, WARN, INFO, DEBUG, and TRACE.
* Python&#39;s &#x60;logging&#x60; also has [five log levels](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;howto&#x2F;logging.html): CRITICAL, ERROR, WARNING, INFO, and DEBUG.
* The infamous &#x60;log4j&#x60; has [six log levels](https:&#x2F;&#x2F;logging.apache.org&#x2F;log4j&#x2F;1.x&#x2F;apidocs&#x2F;org&#x2F;apache&#x2F;log4j&#x2F;Level.html): FATAL, ERROR, WARN, INFO, DEBUG, and TRACE.

Three examples and three wholly different sets of log levels. They all function in about the same way: you log certain information at different levels, based on your ideas of &quot;severity&quot; and &quot;granularity&quot;, and then as you get toward the fatal&#x2F;error end of the log levels you see only the most critical alerts, and toward the other end you see _everything_ to help you debug your application.

There&#39;s really no typical set of log levels, nor common cross-language guidance on what to log at which level. There can&#39;t be that advice, because the levels vary so much!

## What do we do with logs?

When we add log statements, that&#39;s typically because we think that we will need those logs sometime in the future. We think they&#39;ll help us debug something, or help us audit that it happened, or discover a critical error.

Think about a time when you went to debug a deployed web application (not on your local machine) and used the logs. Typically, we&#39;re doing a few things:

* **Discovering errors to fix.**We want to know when something has gone wrong, so we look for errors in the logs. Typically, you also want to get alerted if something needs to be fixed. And related, you _don&#39;t_ want to be alerted if something happens that doesn&#39;t deserve attention. Alert fatigue is a serious problem.
* **Debugging a problem.**When something does go wrong, whether you were alerted from logs or not, you&#39;ll turn to them to understand what&#39;s up. The logs can tell you what&#39;s happening that&#39;s unexpected. They should include any stack traces, related errors, and conditions leading up to the problem.
* **Understanding usage.**Sometimes logs are good for understanding how things are used! You can see generally which portions of the application are accessed or left untouched. They&#39;re not a substitute for metrics or distributed tracing, though!
* **Understanding how it works.**Logs can also help you understand how a system works! If you have just the code, you&#39;ll see a lot of functions and request handlers and data and where do you start? With the logs, you can generally find an entry point where a request or session starts. From there, you can follow along with those logs through the life cycle of the session and follow the execution!

These can be split into two categories: logs that wake me up, and logs that help me fix things.

For logs that wake me up, I want to know a few things. What&#39;s the problem _precisely_? When did it happen? And where can I find related logs?

And then for logs that help me fix things, I really want to know everything. Well, when debugging, everything relevant, I don&#39;t need to go down a rabbit hole about CNCs right _then_. And you don&#39;t know what&#39;s going to be relevant until you know the answer to your question! You might have a guess, but it&#39;s a guess.

In practice, I tend to find that you only really want two log levels: ERROR and INFO. That&#39;s because we really do only care if something should alert us or not. For all the other uses of logs, we want to see _all_ the context.

Let&#39;s use WARNING as an example. Suppose you _should_ have a WARNING log level, and some of those show up in your logs. What should you do when you see them? There are three choices:

* If the information isn&#39;t useful at _all_, in any scenario, delete them entirely!
* If it helps you make sense of other logs, potentially related to an error, then these are just info logs for debugging! They should be INFO level to reflect that.
* And if it is an error you need to fix, well, it&#39;s not a warning now is it? Make that an ERROR log.

And similar for things like DEBUG or TRACE. Usually you reach for those log levels when you want to see extremely verbose information, but... That&#39;s not practical to enable in production environments, because the volume of logs you produce would be way too high. And if you can&#39;t use it in production, you probably shouldn&#39;t use it elsewhere! That&#39;s what your local debugger is for.

Things like FATAL? Yep, that&#39;s _also_ an ERROR log, because you do want to be alerted on it!

In every situation that I&#39;ve run into in production, a single log line at a given level is never sufficient to debug something, only to know it happened. And even then, what actually happened? Shrug. Let&#39;s look at more log lines.

And so if you separate things out into different log levels, you end up looking at all of them together _anyway_, because to understand your warnings or errors you need all the info logs to see what was going on! You need that broader context to make sense of the overall situation. It&#39;s very slight semantic information, similar to syntax highlighting, but there are better ways to deliver that information.

## Enhance your logs in other ways

There are better ways to increase the usability of your logs than with strict adherence to different log levels. Structured logging is the practice of emitting logs in a machine-readable format. They&#39;re often created from maps, and then output in the logs as JSON or output for humans to see in a more readable format. Using structured logging, you can attach a lot more detail to each log in a way that&#39;s _useful_.

Here are a few practices I like to use:

* **Attach a request&#x2F;trace id.**This goes along with distributed tracing, and helps you filter effectively. Filtering down by log level won&#39;t give you context, but correlating by request id will give you all the logs for a given event!
* **Include timestamps.**All logs should include timestamps, but let&#39;s just make _sure_ we have them and at a useful precision. Having these in a structured format makes it easier to use them for calculations.
* **Add related ids.**When an incoming request relates to a given user, document, or other data, adding that id into the logs is so helpful! Then when you&#39;re debugging, you can see either all the logs for a particular object, or you can see if a particular set of data is related to the issue you&#39;re working on. Without this, you are just guessing &quot;Maybe this is just a BigCo issue,&quot; and with it you know whether other customers see it too.
* **Note information for auditing.**If you log information for audit purposes, how will you find it? By including something in the logs that let you look for the needle in that haystack (and retain the needles when you toss out the haystack because paying the haystack storage company is akin to setting a pile of cash on fire—not to torture the metaphor). This can be as simple as a boolean for if it&#39;s an audit log, or more complicated if you need that.
* **Flags which were set.**Your application probably has feature flags. Which ones were enabled for this request? Let&#39;s put them in the logs so we can tell.
* **Where the log came from.**Including the module or function name that a log came from can be really helpful for looking at surrounding context later. Too often, I&#39;ve not had this, and had to grep for a specific string to find where that log was emitted. Hopefully only in one spot.

You do want to avoid adding too much information, because it can be an overwhelming amount! But if you add in this information tastefully, it&#39;s really helpful.

And don&#39;t add logs in to fix one issue, then remove them later, okay? I&#39;ve seen that done, and what that says is you did not have enough logs in the first place to understand what was going on! You might not have known exactly what you need, but after you do, then make sure the logs you would have needed for _this_ issue are present. Ideally they&#39;re in a more general form, so that other related but different issues can also be debugged in the future.

---

Look.

I know, log levels are useful. I&#39;m not actually terribly dogmatic about this, because there _can_ be situations where you want to tune the amount of detail (especially helpful for libraries to limit their log levels, so you don&#39;t get everything from them on INFO).

I just don&#39;t think it&#39;s useful, most of the time, for the kind of work I do—web applications, mostly—to worry about anything beyond: wake me up, or don&#39;t. If you do it differently, I&#39;d love to hear about your experience.

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).