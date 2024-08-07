---
id: 82910320-f777-11ee-9c4e-b71341b08a2d
title: Notes on git's error messages
tags:
  - RSS
date_published: 2024-04-10 12:43:14
---

# Notes on git's error messages
#Omnivore

[Read on Omnivore](https://omnivore.app/me/notes-on-git-s-error-messages-18ec9a98b15)
[Read Original](https://jvns.ca/blog/2024/04/10/notes-on-git-error-messages/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

While writing about Git, I’ve noticed that a lot of folks struggle with Git’s error messages. I’ve had many years to get used to these error messages so it took me a really long time to understand _why_ folks were confused, but having thought about it much more, I’ve realized that:

1. sometimes I actually _am_ confused by the error messages, I’m just used to being confused
2. I have a bunch of strategies for getting more information when the error message git gives me isn’t very informative

So in this post, I’m going to go through a bunch of Git’s error messages, list a few things that I think are confusing about them for each one, and talk about what I do when I’m confused by the message.

### improving error messages isn’t easy

Before we start, I want to say that trying to think about why these error messages are confusing has given me a lot of respect for how difficult maintaining Git is. I’ve been thinking about Git for months, and for some of these messages I really have no idea how to improve them.

Some things that seem hard to me about improving error messages:

* if you come up with an idea for a new message, it’s hard to tell if it’s actually better!
* work like improving error messages often [isn’t funded](https:&#x2F;&#x2F;lwn.net&#x2F;Articles&#x2F;959768&#x2F;)
* the error messages have to be translated (git’s error messages are translated into [19 languages](https:&#x2F;&#x2F;github.com&#x2F;git&#x2F;git&#x2F;tree&#x2F;master&#x2F;po)!)

That said, if you find these messages confusing, hopefully some of these notes will help clarify them a bit.

## [ error: git push on a diverged branch](#git-push-on-a-diverged-branch) 

$ git push
To github.com:jvns&#x2F;int-exposed
! [rejected]        main -&gt; main (non-fast-forward)
error: failed to push some refs to &#39;github.com:jvns&#x2F;int-exposed&#39;
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: &#39;git pull ...&#39;) before pushing again.
hint: See the &#39;Note about fast-forwards&#39; in &#39;git push --help&#39; for details.

$ git status
On branch main
Your branch and &#39;origin&#x2F;main&#39; have diverged,
and have 2 and 1 different commits each, respectively.

Some things I find confusing about this:

1. You get the exact same error message whether the branch is just **behind**or the branch has **diverged**. There’s no way to tell which it is from this message: you need to run &#x60;git status&#x60; or &#x60;git pull&#x60; to find out.
2. It says &#x60;failed to push some refs&#x60;, but it’s not totally clear _which_ references it failed to push. I believe everything that failed to push is listed with &#x60;! [rejected]&#x60; on the previous line– in this case just the &#x60;main&#x60; branch.

**What I like to do if I’m confused:**

* I’ll run &#x60;git status&#x60; to figure out what the state of my current branch is.
* I think I almost never try to push more than one branch at a time, so I usually totally ignore git’s notes about which specific branch failed to push – I just assume that it’s my current branch

## [ error: git pull on a diverged branch](#git-pull-on-a-diverged-branch) 

$ git pull
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace &quot;git config&quot; with &quot;git config --global&quot; to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.

The main thing I think is confusing here is that git is presenting you with a kind of overwhelming number of options: it’s saying that you can either:

1. configure &#x60;pull.rebase false&#x60;, &#x60;pull.rebase true&#x60;, or &#x60;pull.ff only&#x60; locally
2. or configure them globally
3. or run &#x60;git pull --rebase&#x60; or &#x60;git pull --no-rebase&#x60;

It’s very hard to imagine how a beginner to git could easily use this hint to sort through all these options on their own.

If I were explaining this to a friend, I’d say something like “you can use &#x60;git pull --rebase&#x60;or &#x60;git pull --no-rebase&#x60; to resolve this with a rebase or merge_right now_, and if you want to set a permanent preference, you can do that with &#x60;git config pull.rebase false&#x60; or &#x60;git config pull.rebase true&#x60;.

&#x60;git config pull.ff only&#x60; feels a little redundant to me because that’s git’s default behaviour anyway (though it wasn’t always).

**What I like to do here:**

* run &#x60;git status&#x60; to see the state of my current branch
* maybe run &#x60;git log origin&#x2F;main&#x60; or &#x60;git log&#x60; to see what the diverged commits are
* usually run &#x60;git pull --rebase&#x60; to resolve it
* sometimes I’ll run &#x60;git push --force&#x60; or &#x60;git reset --hard origin&#x2F;main&#x60; if I want to throw away my local work or remote work (for example because I accidentally commited to the wrong branch, or because I ran &#x60;git commit --amend&#x60; on a personal branch that only I’m using and want to force push)

## [ error: git checkout asdf (a branch that doesn&#39;t exist)](#git-checkout-asdf) 

$ git checkout asdf
error: pathspec &#39;asdf&#39; did not match any file(s) known to git

This is a little weird because we my intention was to check out a **branch**, but &#x60;git checkout&#x60; is complaining about a **path** that doesn’t exist.

This is happening because &#x60;git checkout&#x60;’s first argument can be either a branch or a path, and git has no way of knowing which one you intended. This seems tricky to improve, but I might expect something like “No such branch, commit, or path: asdf”.

**What I like to do here:**

* in theory it would be good to use &#x60;git switch&#x60; instead, but I keep using &#x60;git checkout&#x60; anyway
* generally I just remember that I need to decode this as “branch &#x60;asdf&#x60; doesn’t exist”

## [ error: git switch asdf (a branch that doesn&#39;t exist)](#git-switch-asdf) 

$ git switch asdf
fatal: invalid reference: asdf

&#x60;git switch&#x60; only accepts a branch as an argument (unless you pass &#x60;-d&#x60;), so why is it saying &#x60;invalidreference: asdf&#x60; instead of &#x60;invalid branch: asdf&#x60;?

I think the reason is that internally, &#x60;git switch&#x60; is trying to be helpful in its error messages: if you run &#x60;git switch v0.1&#x60; to switch to a tag, it’ll say:

&#x60;&#x60;&#x60;vim
$ git switch v0.1
fatal: a branch is expected, got tag &#39;v0.1&#39;&#x60;

&#x60;&#x60;&#x60;

So what git is trying to communicate with &#x60;fatal: invalid reference: asdf&#x60; is “&#x60;asdf&#x60; isn’t a branch, but it’s not a tag either, or any other reference”. From my various [git polls](https:&#x2F;&#x2F;jvns.ca&#x2F;blog&#x2F;2024&#x2F;03&#x2F;28&#x2F;git-poll-results&#x2F;) my impression is that a lot of git users have literally no idea what a “reference” is in git, so I’m not sure if that’s coming across.

**What I like to do here:**

90% of the time when a git error message says &#x60;reference&#x60; I just mentally replace it with &#x60;branch&#x60; in my head.

##  error: [git checkout HEAD^](#detached-head) 

$ git checkout HEAD^
Note: switching to &#39;HEAD^&#39;.

You are in &#39;detached HEAD&#39; state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c 

Or undo this operation with:

  git switch -

Turn off this advice by setting config variable advice.detachedHead to false

HEAD is now at 182cd3f add &quot;swap byte order&quot; button

This is a tough one. Definitely a lot of people are confused about this message, but obviously there&#39;s been a lot of effort to improve it too. I don&#39;t have anything smart to say about this one. \*\*What I like to do here:\*\* \* my shell prompt tells me if I&#39;m in detached HEAD state, and generally I can remember not to make new commits while in that state \* when I&#39;m done looking at whatever old commits I wanted to look at, I&#39;ll run \&#x60;git checkout main\&#x60; or something to go back to a branch

## [ message: git status when a rebase is in progress](#rebase-in-progress) 

This isn’t an error message, but I still find it a little confusing on its own:

$ git status
interactive rebase in progress; onto c694cf8
Last command done (1 command done):
   pick 0a9964d wip
No commands remaining.
You are currently rebasing branch &#39;main&#39; on &#39;c694cf8&#39;.
  (fix conflicts and then run &quot;git rebase --continue&quot;)
  (use &quot;git rebase --skip&quot; to skip this patch)
  (use &quot;git rebase --abort&quot; to check out the original branch)

Unmerged paths:
  (use &quot;git restore --staged ...&quot; to unstage)
  (use &quot;git add ...&quot; to mark resolution)
  both modified:   index.html

no changes added to commit (use &quot;git add&quot; and&#x2F;or &quot;git commit -a&quot;)

Two things I think could be clearer here:

1. I think it would be nice if &#x60;You are currently rebasing branch &#39;main&#39; on &#39;c694cf8&#39;.&#x60; were on the first line instead of the 5th line – right now the first line doesn’t say which branch you’re rebasing.
2. In this case, &#x60;c694cf8&#x60; is actually &#x60;origin&#x2F;main&#x60;, so I feel like &#x60;You are currently rebasing branch &#39;main&#39; on &#39;origin&#x2F;main&#39;&#x60; might be even clearer.

**What I like to do here:**

My shell prompt includes the branch that I’m currently rebasing, so I rely on that instead of the output of &#x60;git status&#x60;.

## [ error: git rebase when a file has been deleted](#merge-deleted) 

$ git rebase main
CONFLICT (modify&#x2F;delete): index.html deleted in 0ce151e (wip) and modified in HEAD.  Version HEAD of index.html left in tree.
error: could not apply 0ce151e… wip

The thing I still find confusing about this is – &#x60;index.html&#x60; was modified in&#x60;HEAD&#x60;. But what is &#x60;HEAD&#x60;? Is it the commit I was working on when I started the merge&#x2F;rebase, or is it the commit from the other branch? (the answer is “&#x60;HEAD&#x60; is your branch if you’re doing a merge, and it’s the “other branch” if you’re doing a rebase, but I always find that hard to remember)

I think I would personally find it easier to understand if the message listed the branch names if possible, something like this:

&#x60;&#x60;&#x60;pgsql
CONFLICT (modify&#x2F;delete): index.html deleted on &#x60;main&#x60; and modified on &#x60;mybranch&#x60;

&#x60;&#x60;&#x60;

## [ error: git status during a merge or rebase (who is “them”?)](#merge-ours) 

$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run “git commit”)
  (use “git merge –abort” to abort the merge)

Unmerged paths:
  (use “git add&#x2F;rm …” as appropriate to mark resolution)
    deleted by them: the_file


no changes added to commit (use “git add” and&#x2F;or “git commit -a”)

I find this one confusing in exactly the same way as the previous message: it says &#x60;deleted by them:&#x60;, but what “them” refers to depends on whether you did a merge or rebase or cherry-pick.

* for a merge, &#x60;them&#x60; is the other branch you merged in
* for a rebase, &#x60;them&#x60; is the branch that you were on when you ran &#x60;git rebase&#x60;
* for a cherry-pick, I guess it’s the commit you cherry-picked

**What I like to do if I’m confused:**

* try to remember what I did
* run &#x60;git show main --stat&#x60; or something to see what I did on the &#x60;main&#x60; branch if I can’t remember

## [ error: git clean ](#git-clean) 

$ git clean
fatal: clean.requireForce defaults to true and neither -i, -n, nor -f given; refusing to clean

I just find it a bit confusing that you need to look up what &#x60;-i&#x60;, &#x60;-n&#x60; and&#x60;-f&#x60; are to be able to understand this error message. I’m personally way too lazy to do that so even though I’ve probably been using &#x60;git clean&#x60; for 10 years I still had no idea what &#x60;-i&#x60; stood for (&#x60;interactive&#x60;) until I was writing this down.

**What I like to do if I’m confused:**

Usually I just chaotically run &#x60;git clean -f&#x60; to delete all my untracked files and hope for the best, though I might actually switch to &#x60;git clean -i&#x60; now that I know what &#x60;-i&#x60; stands for. Seems a lot safer.

### that’s all!

Hopefully some of this is helpful!