---
id: 91b3b8b8-df28-4ccd-bea6-5c0184f4a7ca
title: "New zine: How Git Works!"
tags:
  - RSS
date_published: 2024-06-03 09:45:11
---

# New zine: How Git Works!
#Omnivore

[Read on Omnivore](https://omnivore.app/me/new-zine-how-git-works-18fdfbe3374)
[Read Original](https://jvns.ca/blog/2024/04/25/new-zine--how-git-works-/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

Hello! I’ve been writing about git on here nonstop for months, and the git zine is FINALLY done! It came out on Friday!

You can get it for $12 here:&lt;https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git&gt;, or get an [14-pack of all my zines here](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;all-the-zines&#x2F;).

Here’s the cover:

[ ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sDzFd23CHcfJj9T-x8yPe_b7s2M7ALdZtPrsL90ueBbU&#x2F;https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git&#x2F;cover-small.jpg) ](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git) 

### the table of contents

Here’s the table of contents:

[ ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sUX23nCP9STyTP_QOcmWXiK0sam7fjx_KQ9ROezTN6nY&#x2F;https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git&#x2F;toc.png) ](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git&#x2F;toc.png)

### who is this zine for?

I wrote this zine for people who have been using git for years and are still afraid of it. As always – I think it sucks to be afraid of the tools that you use in your work every day! I want folks to feel confident using git.

My goals are:

* To explain how some parts of git that initially seem scary (like “detached HEAD state”) are pretty straightforward to deal with once you understand what’s going on
* To show some parts of git you probably _should_ be careful around. For example, the stash is one of the places in git where it’s easiest to lose your work in a way that’s incredibly annoying to recover form, and I avoid using it heavily because of that.
* To clear up a few common misconceptions about how the core parts of git (like commits, branches, and merging) work

### what’s the difference between this and Oh Shit, Git!

You might be wondering – Julia! You already have a zine about git! What’s going on? [Oh Shit, Git!](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;oh-shit-git) is a set of tricks for fixing git messes. [“How Git Works”](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git&#x2F;)explains how Git **actually** works.

Also, Oh Shit, Git! is the amazing [Katie Sylor Miller](https:&#x2F;&#x2F;sylormiller.com&#x2F;)’s [concept](https:&#x2F;&#x2F;ohshitgit.com&#x2F;): we made it into a zine because I was such a huge fan of her work on it.

I think they go really well together.

### what’s so confusing about git, anyway?

This zine was really hard for me to write because when I started writing it, I’d been using git pretty confidently for 10 years. I had no real memory of what it was _like_ to struggle with git.

But thanks to a huge amount of help from [Marie](https:&#x2F;&#x2F;marieflanagan.com&#x2F;) as well as everyone who talked to me about git on Mastodon, eventually I was able to see that there are a lot of things about git that are counterintuitive, misleading, or just plain confusing. These include:

* [confusing terminology](https:&#x2F;&#x2F;jvns.ca&#x2F;blog&#x2F;2023&#x2F;11&#x2F;01&#x2F;confusing-git-terminology&#x2F;) (for example “fast-forward”, “reference”, or “remote-tracking branch”)
* misleading messages (for example how &#x60;Your branch is up to date with &#39;origin&#x2F;main&#39;&#x60; doesn’t necessary mean that your branch is up to date with the &#x60;main&#x60; branch on the origin)
* uninformative output (for example how I _STILL_ can’t reliably figure out which code comes from which branch when I’m looking at a merge conflict)
* a lack of guidance around handling diverged branches (for example how when you run &#x60;git pull&#x60; and your branch has diverged from the origin, it doesn’t give you great guidance how to handle the situation)
* inconsistent behaviour (for example how git’s reflogs are almost always append-only, EXCEPT for the stash, where git will delete entries when you run &#x60;git stash drop&#x60;)

The more I heard from people how about how confusing they find git, the more it became clear that git really does not make it easy to figure out what its internal logic is just by using it.

### handling git’s weirdnesses becomes pretty routine

The previous section made git sound really bad, like “how can anyone possibly use this thing?“.

But my experience is that after I learned what git actually means by all of its weird error messages, dealing with it became pretty routine! I’ll see an&#x60;error: failed to push some refs to &#39;github.com:jvns&#x2F;wizard-zines-site&#39;&#x60;, realize “oh right, probably a coworker made some changes to &#x60;main&#x60; since I last ran &#x60;git pull&#x60;”, run &#x60;git pull --rebase&#x60; to incorporate their changes, and move on with my day. The whole thing takes about 10 seconds.

Or if I see a &#x60;You are in &#39;detached HEAD&#39; state&#x60; warning, I’ll just make sure to run &#x60;git checkout mybranch&#x60; before continuing to write code. No big deal.

For me (and for a lot of folks I talk to about git!), dealing with git’s weird language can become so normal that you totally forget why anybody would even find it weird.

### a little bit of internals

One of my biggest questions when writing this zine was how much to focus on what’s in the &#x60;.git&#x60; directory. We ended up deciding to include a couple of pages about internals (“inside .git”, pages 14-15), but otherwise focus more on git’s _behaviour_ when you use it and why sometimes git behaves in unexpected ways.

This is partly because there are lots of great guides to git’s internals out there already ([1](https:&#x2F;&#x2F;maryrosecook.com&#x2F;blog&#x2F;post&#x2F;git-from-the-inside-out), [2](https:&#x2F;&#x2F;shop.jcoglan.com&#x2F;building-git&#x2F;)), and partly because I think even if you _have_ read one of these guides to git’s internals, it isn’t totally obvious how to connect that information to what you actually see in git’s user interface.

For example: it’s easy to find documentation about remotes in git – for example [this page](https:&#x2F;&#x2F;git-scm.com&#x2F;book&#x2F;en&#x2F;v2&#x2F;Git-Branching-Remote-Branches) says:

&gt; Remote-tracking branches \[…\] remind you where the branches in your remote repositories were the last time you connected to them.

But even if you’ve read that, you might not realize that the statement &#x60;Your branch is up to date with &#39;origin&#x2F;main&#39;&quot;&#x60; in &#x60;git status&#x60; doesn’t necessarily mean that you’re actually up to date with the remote &#x60;main&#x60; branch.

So in general in the zine we focus on the behaviour you see in Git’s UI, and then explain how that relates to what’s happening internally in Git.

### the cheat sheet

The zine also comes with a free printable cheat sheet: (click to get a PDF version)

[ ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sHk_rctgCS8ZEigCpL9G_CKSUbRv4JdF8_1A7iUcn2f4&#x2F;https:&#x2F;&#x2F;wizardzines.com&#x2F;images&#x2F;cheat-sheet-smaller.png) ](https:&#x2F;&#x2F;wizardzines.com&#x2F;git-cheat-sheet.pdf)

### it comes with an HTML transcript!

The zine also comes with an HTML transcript, to (hopefully) make it easier to read on a screen reader! Our Operations Manager, Lee, transcribed all of the pages and wrote image descriptions. I’d love feedback about the experience of reading the zine on a screen reader if you try it.

### I really do love git

I’ve been pretty critical about git in this post, but I only write zines about technologies I love, and git is no exception.

Some reasons I love git:

* it’s fast!
* it’s backwards compatible! I learned how to use it 10 years ago and everything I learned then is still true
* there’s tons of great free Git hosting available out there (GitHub! Gitlab! a million more!), so I can easily back up all my code
* simple workflows are REALLY simple (if I’m working on a project on my own, I can just run &#x60;git commit -am &#39;whatever&#39;&#x60; and &#x60;git push&#x60; over and over again and it works perfectly)
* Almost every internal file in git is a pretty simple text file (or has a version which is a text file), which makes me feel like I can always understand exactly what’s going on under the hood if I want to.

I hope this zine helps some of you love it too.

### people who helped with this zine

I don’t make these zines by myself!

I worked with [Marie Claire LeBlanc Flanagan](https:&#x2F;&#x2F;marieflanagan.com&#x2F;) every morning for 8 months to write clear explanations of git.

The cover is by Vladimir Kašiković, Gersande La Flèche did copy editing, James Coglan (of the great [Building Git](https:&#x2F;&#x2F;shop.jcoglan.com&#x2F;building-git&#x2F;)) did technical review, our Operations Manager Lee did the transcription as well as a million other things, my partner Kamal read the zine and told me which parts were off (as he always does), and I had a million great conversations with Marco Rogers about git.

And finally, I want to thank all the beta readers! There were 66 this time which is a record! They left hundreds of comments about what was confusing, what they learned, and which of my jokes were funny. It’s always hard to hear from beta readers that a page I thought made sense is actually extremely confusing, and fixing those problems before the final version makes the zine so much better.

### get the zine

Here are some links to get the zine again:

* get [How Git Works](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;git)
* get an [14-pack of all my zines here](https:&#x2F;&#x2F;wizardzines.com&#x2F;zines&#x2F;all-the-zines&#x2F;).

As always, you can get either a PDF version to print at home or a print version shipped to your house. The only caveat is print orders will ship in **July** – I need to wait for orders to come in to get an idea of how many I should print before sending it to the printer.

### thank you

As always: if you’ve bought zines in the past, thank you for all your support over the years. And thanks to all of you (1000+ people!!!) who have already bought the zine in the first 3 days. It’s already set a record for most zines sold in a single day and I’ve been really blown away.