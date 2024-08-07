---
id: f733a94a-e867-11ee-b4c7-77e9f7d786bc
title: The "current branch" in git
tags:
  - RSS
date_published: 2024-03-22 08:15:02
---

# The "current branch" in git
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-current-branch-in-git-18e66f5d7c5)
[Read Original](https://jvns.ca/blog/2024/03/22/the-current-branch-in-git/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

Hello! I know I just wrote [a blog post about HEAD in git](https:&#x2F;&#x2F;jvns.ca&#x2F;blog&#x2F;2024&#x2F;03&#x2F;08&#x2F;how-head-works-in-git&#x2F;), but I’ve been thinking more about what the term “current branch” means in git and it’s a little weirder than I thought.

### four possible definitions for “current branch”

1. It’s what’s in the file **&#x60;.git&#x2F;HEAD&#x60;**. This is how the [git glossary](https:&#x2F;&#x2F;git-scm.com&#x2F;docs&#x2F;gitglossary#def%5FHEAD) defines it.
2. It’s what **&#x60;git status&#x60;** says on the first line
3. It’s what you most recently **checked out** with &#x60;git checkout&#x60; or &#x60;git switch&#x60;
4. It’s what’s in your shell’s **git prompt**. I use [fish\_git\_prompt](https:&#x2F;&#x2F;fishshell.com&#x2F;docs&#x2F;current&#x2F;cmds&#x2F;fish%5Fgit%5Fprompt.html) so that’s what I’ll be talking about.

I originally thought that these 4 definitions were all basically exactly the same, but after chatting with some people on Mastodon, I realized that in some scenarios they’re slightly different from each other.

So let’s talk about a few git scenarios and how each of these definitions plays out in each of them.

### scenario 1: right after &#x60;git checkout main&#x60;

Here’s the most normal situation: you check out a branch.

1. &#x60;.git&#x2F;HEAD&#x60; contains &#x60;ref: refs&#x2F;heads&#x2F;main&#x60;
2. &#x60;git status&#x60; says &#x60;On branch main&#x60;
3. The thing I most recently checked out was: &#x60;main&#x60;
4. My shell’s git prompt says: &#x60;(main)&#x60;

In this case the 4 definitions all match up: they’re all &#x60;main&#x60;. Simple enough.

### scenario 2: right after &#x60;git checkout 775b2b399&#x60;

Now let’s imagine I check out a specific commit ID (so that we’re in “detached HEAD state”).

1. &#x60;.git&#x2F;HEAD&#x60; contains &#x60;775b2b399fb8b13ee3341e819f2aaa024a37fa92&#x60;
2. &#x60;git status&#x60; says &#x60;HEAD detached at 775b2b39&#x60;
3. The thing I most recently checked out was &#x60;775b2b399&#x60;
4. My shell’s git prompt says &#x60;((775b2b39))&#x60;

Again, these all basically match up – some of them have truncated the commit ID and some haven’t, but that’s it. Let’s move on.

### scenario 3: right after &#x60;git checkout v1.0.13&#x60;

What if we’ve checked out a tag, instead of a branch or commit ID?

1. &#x60;.git&#x2F;HEAD&#x60; contains &#x60;ca182053c7710a286d72102f4576cf32e0dafcfb&#x60;
2. &#x60;git status&#x60; says &#x60;HEAD detached at v1.0.13&#x60;
3. The thing I most recently checked out was &#x60;v1.0.13&#x60;
4. My shell’s git prompt says &#x60;((v1.0.13))&#x60;

Now things start to get a bit weirder! &#x60;.git&#x2F;HEAD&#x60; disagrees with the other 3 indicators: &#x60;git status&#x60;, the git prompt, and what I checked out are all the same (&#x60;v1.0.13&#x60;), but &#x60;.git&#x2F;HEAD&#x60; contains a commit ID.

The reason for this is that git is trying to help us out: commit IDs are kind of opaque, so if there’s a tag that corresponds to the current commit, &#x60;git status&#x60; will show us that instead.

Some notes about this:

* If we check out the commit by its ID (&#x60;git checkout ca182053c7710a286d72&#x60;) instead of by its tag, what shows up in &#x60;git status&#x60; and in my shell prompt are exactly the same – git doesn’t actually “know” that we checked out a tag.
* it looks like you can find the tags matching &#x60;HEAD&#x60; by running &#x60;git describe HEAD --tags --exact-match&#x60; (here’s the [fish git prompt code](https:&#x2F;&#x2F;github.com&#x2F;fish-shell&#x2F;fish-shell&#x2F;blob&#x2F;a5156e9e0e89bff2bd81ac945a019bad34f14346&#x2F;share&#x2F;functions&#x2F;fish%5Fgit%5Fprompt.fish#L521-L527))
* You can see where &#x60;git-prompt.sh&#x60; added support for describing a commit by a tag in this way in commit [27c578885 in 2008](https:&#x2F;&#x2F;github.com&#x2F;git&#x2F;git&#x2F;commit&#x2F;27c578885a0b8f56430c5a24f558e2b45cf04a38).
* If there are 2 tags with the same commit ID, it gets a little weird. For example, this commit is tagged with both &#x60;v1.0.12&#x60; and &#x60;v1.0.13&#x60;, and you can see here that my git prompt and &#x60;git status&#x60; disagree about which tag to display

&#x60;&#x60;&#x60;angelscript
bork@grapefruit ~&#x2F;w&#x2F;int-exposed ((v1.0.12))&gt; git status
HEAD detached at v1.0.13

&#x60;&#x60;&#x60;

(my prompt shows &#x60;v1.0.12&#x60; and &#x60;git status&#x60; shows &#x60;v1.0.13&#x60;):

### scenario 4: in the middle of a rebase

Now: what if I check out the &#x60;main&#x60; branch, do a rebase, but then there was a merge conflict in the middle of the rebase? Here’s the situation:

1. &#x60;.git&#x2F;HEAD&#x60; contains &#x60;c694cf8aabe2148b2299a988406f3395c0461742&#x60; (the commit ID of the commit that I’m rebasing onto, &#x60;origin&#x2F;main&#x60; in this case)
2. &#x60;git status&#x60; says &#x60;interactive rebase in progress; onto c694cf8&#x60;
3. The thing I most recently checked out was &#x60;main&#x60;
4. My shell’s git prompt says &#x60;(main|REBASE-i 1&#x2F;1)&#x60;

Some notes about this:

* I think that in some sense the “current branch” is &#x60;main&#x60; here – it’s what I most recently checked out, it’s what we’ll go back to after the rebase is done, and it’s where we’d go back to if I run &#x60;git rebase --abort&#x60;
* in another sense, we’re in a detached HEAD state at &#x60;c694cf8aabe2&#x60;
* it looks like during the rebase, the old “current branch” (&#x60;main&#x60;) is stored in &#x60;.git&#x2F;rebase-merge&#x2F;head-name&#x60;. Not totally sure about this though.

### scenario 5: right after &#x60;git init&#x60;

What about when we create an empty repository with &#x60;git init&#x60;?

1. &#x60;.git&#x2F;HEAD&#x60; contains &#x60;ref: refs&#x2F;heads&#x2F;main&#x60;
2. &#x60;git status&#x60; says &#x60;On branch main&#x60; (and “No commits yet”)
3. The thing I most recently checked out was, well, nothing
4. My shell’s git prompt says: &#x60;(main)&#x60;

So here everything mostly lines up, except that we’ve never run &#x60;git checkout&#x60; or &#x60;git switch&#x60;. Basically Git automatically switches to whatever branch was configured in &#x60;init.defaultBranch&#x60;.

### scenario 6: a bare git repository

What if we clone a bare repository with &#x60;git clone --bare https:&#x2F;&#x2F;github.com&#x2F;rbspy&#x2F;rbspy&#x60;?

1. &#x60;HEAD&#x60; contains &#x60;ref: refs&#x2F;heads&#x2F;main&#x60;
2. &#x60;git status&#x60; says &#x60;fatal: this operation must be run in a work tree&#x60;
3. The thing I most recently checked out was, well, nothing, &#x60;git checkout&#x60; doesn’t even work in bare repositories
4. My shell’s git prompt says: &#x60;(BARE:main)&#x60;

So #1 and #4 match (they both agree that the current branch is “main”), but &#x60;git status&#x60; and &#x60;git checkout&#x60; don’t even work.

Some notes about this one:

* I think &#x60;HEAD&#x60; in a bare repository only really affects 1 thing: it’s the branch that gets checked out when you clone the repository
* if you really want to, you can update &#x60;HEAD&#x60; in a bare repository to a different branch with &#x60;git symbolic-ref HEAD refs&#x2F;heads&#x2F;whatever&#x60;. I’ve never needed to do that though and it seems weird because &#x60;git symbolic ref&#x60; doesn’t check if the thing you’re pointing &#x60;HEAD&#x60; at is actually a branch that exists. Not sure if there’s a better way.

### “current branch” doesn’t seem completely well defined

My original instinct when talking about git was to agree with the git glossary and say that &#x60;HEAD&#x60; and the “current branch” mean the exact same thing.

But this doesn’t seem as ironclad as I used to think anymore! Some thoughts:

* &#x60;.git&#x2F;HEAD&#x60; is definitely the one with the most consistent format – it’s always either a branch or a commit ID. The others are all much messier
* I have a lot more sympathy than I used to for the definition “the current branch is whatever you last checked out”. Git does a lot of work to remember which branch you last checked out (even if you’re currently doing a bisect or a merge or something else that temporarily moves HEAD off of that branch) and it feels weird to ignore that.
* &#x60;git status&#x60; gives a lot of helpful context – these 5 status messages say a lot more than just what &#x60;HEAD&#x60; is set to currently  
   1. &#x60;on branch main&#x60;  
   2. &#x60;HEAD detached at 775b2b39&#x60;  
   3. &#x60;HEAD detached at v1.0.13&#x60;  
   4. &#x60;interactive rebase in progress; onto c694cf8&#x60;  
   5. &#x60;on branch main, no commits yet&#x60;

### on orphaned commits

One thing I noticed that wasn’t captured in any of this is whether the current commit is **orphaned** or not – the &#x60;git status&#x60; message (&#x60;HEAD detached from c694cf8&#x60;) is the same whether or not your current commit is orphaned.

Git will warn you if the commit is orphaned (“Warning: you are leaving 1 commit behind, not connected to any of your branches…“) when you switch to a different branch though.

### that’s all!

I don’t have anything particularly smart to say about any of this. The more I think about git the more I can understand why people get confused.