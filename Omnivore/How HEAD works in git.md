---
id: 1275bdf4-dd89-11ee-8cb7-4fe62eb4b3fa
title: How HEAD works in git
tags:
  - RSS
date_published: 2024-03-08 10:13:27
---

# How HEAD works in git
#Omnivore

[Read on Omnivore](https://omnivore.app/me/how-head-works-in-git-18e1fb7df4e)
[Read Original](https://jvns.ca/blog/2024/03/08/how-head-works-in-git/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

Hello! The other day I ran a Mastodon poll asking people how confident they were that they understood how HEAD works in Git. The results (out of 1700 votes) were a little surprising to me:

* 10% “100%”
* 36% “pretty confident”
* 39% “somewhat confident?”
* 15% “literally no idea”

I was surprised that people were so unconfident about their understanding – I’d been thinking of &#x60;HEAD&#x60; as a pretty straightforward topic.

Usually when people say that a topic is confusing when I think it’s not, the reason is that there’s actually some hidden complexity that I wasn’t considering. And after some follow up conversations, it turned out that &#x60;HEAD&#x60;actually _was_ a bit more complicated than I’d appreciated!

Here’s a quick table of contents:

* [HEAD is actually a few different things](#head-is-actually-a-few-different-things)
* [the file .git&#x2F;HEAD](#the-file-git-head)
* [HEAD as in git show HEAD](#head-as-in-git-show-head)
* [next: all the output formats](#next-all-the-output-formats)  
   * [git status: “on branch main” or “HEAD detached”](#git-status-on-branch-main-or-head-detached)  
   * [detached HEAD state](#detached-head-state)  
   * [git log: (HEAD -&gt; main)](#git-log-head-main)  
   * [merge conflicts: &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD is just confusing](#merge-conflicts-head-is-just-confusing)

### HEAD is actually a few different things

After talking to a bunch of different people about &#x60;HEAD&#x60;, I realized that&#x60;HEAD&#x60; actually has a few different closely related meanings:

1. The file &#x60;.git&#x2F;HEAD&#x60;
2. &#x60;HEAD&#x60; as in &#x60;git show HEAD&#x60; (git calls this a “revision parameter”)
3. All of the ways git uses &#x60;HEAD&#x60; in the output of various commands (&#x60;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;HEAD&#x60;, &#x60;(HEAD -&gt; main)&#x60;, &#x60;detached HEAD state&#x60;, &#x60;On branch main&#x60;, etc)

These are extremely closely related to each other, but I don’t think the relationship is totally obvious to folks who are starting out with git.

### the file &#x60;.git&#x2F;HEAD&#x60;

Git has a very important file called &#x60;.git&#x2F;HEAD&#x60;. The way this file works is that it contains either:

1. The name of a branch (like &#x60;ref: refs&#x2F;heads&#x2F;main&#x60;)
2. A commit ID (like &#x60;96fa6899ea34697257e84865fefc56beb42d6390&#x60;)

This file is what determines what your “current branch” is in Git. For example, when you run &#x60;git status&#x60; and see this:

&#x60;&#x60;&#x60;armasm
$ git status
On branch main

&#x60;&#x60;&#x60;

it means that the file &#x60;.git&#x2F;HEAD&#x60; contains &#x60;ref: refs&#x2F;heads&#x2F;main&#x60;.

If &#x60;.git&#x2F;HEAD&#x60; contains a commit ID instead of a branch, git calls that “detached HEAD state”. We’ll get to that later.

(you _can_ technically make &#x60;.git&#x2F;HEAD&#x60; contain the name of a reference that isn’t a branch with &#x60;git checkout refs&#x2F;tags&#x2F;v0.1&#x60; but I have no idea why you would want to do that instead of just checking out the tag in the “normal” way with &#x60;git checkout v0.1&#x60;. I’d be interested to know though!) 

### &#x60;HEAD&#x60; as in &#x60;git show HEAD&#x60;

It’s very common to use &#x60;HEAD&#x60; in git commands to refer to a commit ID, like:

* &#x60;git diff HEAD&#x60;
* &#x60;git rebase -I HEAD^^^^&#x60;
* &#x60;git diff main..HEAD&#x60;
* &#x60;git reset --hard HEAD@{2}&#x60;

All of these things (&#x60;HEAD&#x60;, &#x60;HEAD^^^&#x60;, &#x60;HEAD@[2}&#x60;) are called “revision parameters”. They’re documented in [man gitrevisions](https:&#x2F;&#x2F;git-scm.com&#x2F;docs&#x2F;gitrevisions), and Git will try to resolve them to a commit ID.

(I’ve honestly never actually heard the term “revision parameter” before, but that’s the term that’ll get you to the documentation for this concept)

HEAD in &#x60;git show HEAD&#x60; has a pretty simple meaning: it resolves to the**current commit** you have checked out! Git resolves &#x60;HEAD&#x60; in one of two ways:

1. if &#x60;.git&#x2F;HEAD&#x60; contains a branch name, it’ll be the latest commit on that branch (for example by reading it from &#x60;.git&#x2F;refs&#x2F;heads&#x2F;main&#x60;)
2. if &#x60;.git&#x2F;HEAD&#x60; contains a commit ID, it’ll be that commit ID

### next: all the output formats

Now we’ve talked about the file &#x60;.git&#x2F;HEAD&#x60;, and the “revision parameter”&#x60;HEAD&#x60;, like in &#x60;git show HEAD&#x60;. We’re left with all of the various ways git uses &#x60;HEAD&#x60; in its output.

### &#x60;git status&#x60;: “on branch main” or “HEAD detached”

When you run &#x60;git status&#x60;, the first line will always look like one of these two:

1. &#x60;on branch main&#x60;. This means that &#x60;.git&#x2F;HEAD&#x60; contains a branch.
2. &#x60;HEAD detached at 90c81c72&#x60;. This means that &#x60;.git&#x2F;HEAD&#x60; contains a commit ID.

I promised earlier I’d explain what “HEAD detached” means, so let’s do that now.

### detached HEAD state

“HEAD is detached” or “detached HEAD state” mean that you have no current branch.

Having no current branch is a little dangerous because if you make new commits, those commits won’t be attached to any branch – they’ll be orphaned! Orphaned commits are a problem for 2 reasons:

1. the commits are more difficult to find (you can’t run &#x60;git log somebranch&#x60; to find them)
2. orphaned commits will eventually be deleted by git’s garbage collection

Personally I’m very careful about avoiding creating commits in detached HEAD state, though some people [prefer to work that way](https:&#x2F;&#x2F;github.com&#x2F;arxanas&#x2F;git-branchless). Getting out of detached HEAD state is pretty easy though, you can either:

1. Go back to a branch (&#x60;git checkout main&#x60;)
2. Create a new branch at that commit (&#x60;git checkout -b newbranch&#x60;)
3. If you’re in detached HEAD state because you’re in the middle of a rebase, finish or abort the rebase (&#x60;git rebase --abort&#x60;)

Okay, back to other git commands which have &#x60;HEAD&#x60; in their output!

### &#x60;git log&#x60;: &#x60;(HEAD -&gt; main)&#x60;

When you run &#x60;git log&#x60; and look at the first line, you might see one of the following 3 things:

* &#x60;commit 96fa6899ea (HEAD -&gt; main)&#x60;
* &#x60;commit 96fa6899ea (HEAD, main)&#x60;
* &#x60;commit 96fa6899ea (HEAD)&#x60;

It’s not totally obvious how to interpret these, so here’s the deal:

* inside the &#x60;(...)&#x60;, git lists every reference that points at that commit, for example &#x60;(HEAD -&gt; main, origin&#x2F;main, origin&#x2F;HEAD)&#x60; means &#x60;HEAD&#x60;, &#x60;main&#x60;, &#x60;origin&#x2F;main&#x60;, and &#x60;origin&#x2F;HEAD&#x60; all point at that commit (either directly or indirectly)
* &#x60;HEAD -&gt; main&#x60; means that your current branch is &#x60;main&#x60;
* If that line says &#x60;HEAD,&#x60; instead of &#x60;HEAD -&gt;&#x60;, it means you’re in detached HEAD state (you have no current branch)

### merge conflicts: &#x60;&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD&#x60; is just confusing

When you’re resolving a merge conflict, you might see something like this:

&#x60;&#x60;&#x60;ruby
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
def parse(input):
    return input.split(&quot;\n&quot;)
&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;
def parse(text):
    return text.split(&quot;\n\n&quot;)
&gt;&gt;&gt;&gt;&gt;&gt;&gt; somebranch

&#x60;&#x60;&#x60;

I find &#x60;HEAD&#x60; in this context extremely confusing and I basically just ignore it. Here’s why.

* When you do a **merge**, &#x60;HEAD&#x60; in the merge conflict is the same as what &#x60;HEAD&#x60; when you ran &#x60;git merge&#x60;. Simple.
* When you do a **rebase**, &#x60;HEAD&#x60; in the merge conflict is something totally different: it’s the **other commit** that you’re rebasing on top of. So it’s totally different from what &#x60;HEAD&#x60; was when you ran &#x60;git rebase&#x60;. It’s like this because rebase works by first checking out the other commit and then repeatedly cherry-picking commits on top of it.

Similarly, the meaning of “ours” and “theirs” are flipped in a merge and rebase.

The fact that the meaning of &#x60;HEAD&#x60; changes depending on whether I’m doing a rebase or merge is really just too confusing for me and I find it much simpler to just ignore &#x60;HEAD&#x60; entirely and use another method to figure out which part of the code is which.

### that’s all!

If I think of other ways &#x60;HEAD&#x60; is used in Git (especially ways HEAD appears in Git’s output), I might add them to this post later.

If you find HEAD confusing, I hope this helps a bit!