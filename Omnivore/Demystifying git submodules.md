---
id: f65cb798-e6d5-11ee-8339-b334998e39df
title: Demystifying git submodules
tags:
  - RSS
date_published: 2024-03-20 00:00:00
---

# Demystifying git submodules
#Omnivore

[Read on Omnivore](https://omnivore.app/me/demystifying-git-submodules-18e5cab43ee)
[Read Original](https://www.cyberdemon.org/2024/03/20/submodules.html)



Throughout my career, I have found git submodules to be a pain. Because I did not understand them, I kept getting myself into frustrating situations.

So, I finally sat down and learned how git tracks submodules. Turns out, it’s not complex at all. It’s just different from how git tracks regular files. It’s just one more thing you have to learn.

In this article, I’ll explain exactly what I needed to know in order to work with submodules without inflicting self-damage.

(This article doesn’t discuss whether submodules are good&#x2F;bad, or if you should use them or not – a valid discussion, but out of scope.)

## The lay of the land

This article will make more sense if we use concrete examples.

Allow me to describe a toy webapp we’re building. Call this repo &#x60;webapp&#x60;. Here are the contents of the repo.

&#x60;&#x60;&#x60;jboss-cli
$ [&#x2F;webapp] ls

.git&#x2F;
README.md
tests&#x2F;

&#x60;&#x60;&#x60;

Say you want to import some library. It lives in its own repo, &#x60;library&#x60;.

&#x60;&#x60;&#x60;jboss-cli
$ [&#x2F;library] ls

.git&#x2F;
README.md
my_cool_functions.py

&#x60;&#x60;&#x60;

Shortly, I’ll explain how submodules work. But, first, let me dramatically re-enact something that has happened to me multiple times. This is what it looks like to use submodules without understanding them.

## A day in the life of someone who doesn’t understand submodules

Ah, 2012\. What a time to be a “full-stack engineer”! I wonder what contributions await me on the main branch!

(For the sake of readability, in this article, instead of using real commit SHAs, I’m going to use fake descriptive ones.)

Let’s pull to make sure I’m up-to-date with the remote.

&#x60;&#x60;&#x60;angelscript
$ [&#x2F;webapp] git pull

remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3&#x2F;3), done.
remote: Compressing objects: 100% (1&#x2F;1), done.
remote: Total 2 (delta 1), reused 2 (delta 1), pack-reused 0
Unpacking objects: 100% (2&#x2F;2), 237 bytes | 118.00 KiB&#x2F;s, done.
From https:&#x2F;&#x2F;github.com&#x2F;dmazin&#x2F;webapp
   webapp_old_commit_sha..webapp_new_commit_sha  main -&gt; origin&#x2F;main
Updating webapp_old_commit_sha..webapp_new_commit_sha
Fast-forward
 library | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

&#x60;&#x60;&#x60;

After I pull, I like to confirm that my working tree is clean.

&#x60;&#x60;&#x60;shell
$ [&#x2F;webapp] git st

## main...origin&#x2F;main
 M library

&#x60;&#x60;&#x60;

What’s this? I’ve made modifications to &#x60;library&#x60;? I never touch that directory.

It’s weird that I’ve modified a _directory_. Usually git just says I’ve modified a specific _file_.

Well, what does &#x60;git diff&#x60; have to say?

&#x60;&#x60;&#x60;pgsql
$ [&#x2F;webapp] git diff

diff --git a&#x2F;library b&#x2F;library
index library_old_commit_sha..library_new_commit_sha 160000
--- a&#x2F;library
+++ b&#x2F;library
@@ -1 +1 @@
-Subproject commit library_new_commit_sha
+Subproject commit library_old_commit_sha

&#x60;&#x60;&#x60;

Apparently, I deleted &#x60;Subproject commit library_new_commit_sha&#x60; and added &#x60;Subproject commit library_old_commit_sha&#x60;.

Surely I didn’t do that. That’s weird, let me do a hard reset.

&#x60;&#x60;&#x60;sql
$ [&#x2F;webapp] git reset --hard origin&#x2F;main

HEAD is now at webapp_new_commit_sha point submodule to newest commit

&#x60;&#x60;&#x60;

Did it make the git diff go away?

&#x60;&#x60;&#x60;shell
$ [&#x2F;webapp] git st

## main...origin&#x2F;main
 M library

&#x60;&#x60;&#x60;

It did not! I am really confused now!

Well, the usual way I make local modifications go away is &#x60;git reset --hard&#x60;, and that didn’t work. The other way is to commit the changes.

(Sometimes, people don’t even notice the diff above, and accidentally do this.)

**My future self**: _Don’t do it! If you &#x60;git add&#x60; that change, you’ll be rolling back a change someone else made!_

What’s going on, of course, is that &#x60;library&#x60; is a submodule, and you have to do special stuff to deal with them.

Let’s dive into submodules.

## What’s a submodule?

A git submodule is a full repo that’s been nested inside another repo. Any repo can be a submodule of another.

So, &#x60;library&#x60; is a full repo that has been nested inside &#x60;webapp&#x60; as a submodule.

That doesn’t seem so confusing, does it? However, there are two important, and tricky, facts about submodules. These facts are why so many people trip up on submodules.

### 1\. A submodule is always pinned to a specific commit

You know how package managers let you be fuzzy when specifying a package version (“get me any version of &#x60;requests&#x60; so long as it’s 2.x.x”), or to pin an exact version (“use &#x60;requests&#x60; 2.31.0 exactly”)?

Submodules can _only_ be pinned to a specific commit. This is because a submodule isn’t a package; it’s code that you have embedded in another repo, and git wants you to be precise.

We’ll see exactly how this pinning works shortly.

### 2\. git does not automatically download or update submodules

If you clone &#x60;webapp&#x60; afresh, git _will not_ automatically download &#x60;library&#x60; for you (unless you clone using &#x60;git clone --recursive&#x60;)

Similarly, if a collaborator pins &#x60;webapp&#x60; to a new commit of &#x60;library&#x60;, and you &#x60;git pull&#x60; &#x60;webapp&#x60;, git _will not_ automatically update &#x60;library&#x60; for you.

This is actually what’s happening in the dramatic re-enactment above. Let me rewind a little bit to show what happened.

## What happens when someone updates a submodule?

In the beginning, &#x60;webapp&#x60; pointed to &#x60;webapp_old_commit_sha&#x60;, which pinned &#x60;library&#x60; to &#x60;library_old_commit_sha&#x60;.

![Hand-drawn diagram of two git repositories, webapp and library. It shows that the old_sha commit of the webapp repo points to the old_sha commit of the library repo. The old_sha commit of the webapp repo has a purple border around it, saying &#39;HEAD&#39;. The old_sha commit of the library repo also has a purple border around it, saying &#39;HEAD&#39;.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sqLKM95qsKpHApW8TohzFJvKPdZUU5Mq2CRVMAWno0K8&#x2F;https:&#x2F;&#x2F;www.cyberdemon.org&#x2F;assets&#x2F;submodules1.png)

(Think of &#x60;HEAD&#x60; as “current commit”.)

Then, my collaborator made changes to &#x60;library&#x60;. Remember, &#x60;library&#x60; is a full repo, so after they did their work, they did what you always do after you make changes: they committed and pushed the new commit, &#x60;library_new_commit_sha&#x60;.

They weren’t done, though. &#x60;webapp&#x60; must point to a specific commit of &#x60;library&#x60;, so in order to use &#x60;library_new_commit_sha&#x60;, my collaborator then pushed a new commit to &#x60;webpapp&#x60;, &#x60;webapp_new_commit_sha&#x60;, which points to &#x60;library_new_commit_sha&#x60;.

Here’s the thing, though! _git does not automatically update submodules_, so &#x60;library&#x60; still points to &#x60;library_old_commit_sha&#x60;.

![Hand-drawn diagram of two git repositories, webapp and library. It shows that the old_sha commit of the webapp repo points to the old_sha commit of the library repo. The new_sha commit of the webapp repo points to the new_sha of the library repo. The new_sha commit of the webapp repo has a purple border around it, saying &#39;HEAD&#39;. The old_sha commit of the library repo has a purple border around it, saying &#39;HEAD&#39;. A red arrow points to the purple border around old_sha in the library repo. The red arrow is linked to a speech bubble which says, &#39;library still points at old_sha!&#39;](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sZu1cBUUpZhja8VxnimCX0qLJMk_R_IPiDIfNB67p0d4&#x2F;https:&#x2F;&#x2F;www.cyberdemon.org&#x2F;assets&#x2F;submodules2.png)

I think this will be a lot less confusing if we look at exactly how git tracks submodules.

## Commercial interruption

If you’re enjoying yourself, may I ask if you’d like to follow me via [RSS feed](https:&#x2F;&#x2F;www.cyberdemon.org&#x2F;feed.xml), [Mastodon](https:&#x2F;&#x2F;file-explorers.club&#x2F;@dmitry), or [Telegram channel](https:&#x2F;&#x2F;t.me&#x2F;cyberdemon6)? Thanks!

## How git tracks submodules

### How does git pin a submodule to a specific commit?

The latest commit of &#x60;webapp&#x60; is &#x60;webapp_new_commit_sha&#x60;. Let’s inspect that commit.

A commit is just a file on disk. However, it’s optimized&#x2F;compressed, so we use a built-in utility to view it. Here’s what the commit stores.

&#x60;&#x60;&#x60;angelscript
$ [&#x2F;webapp] git cat-file -p &#x60;webapp_new_commit_sha&#x60;

tree 92018fc6ac6e71ea3dfb57e2fab9d3fe23b6fdf4
parent webapp_old_commit_sha
author Dmitry Mazin &lt;dm@cyberdemon.org&gt; 1708717288 +0000
committer Dmitry Mazin &lt;dm@cyberdemon.org&gt; 1708717288 +0000

point submodule to newest commit

&#x60;&#x60;&#x60;

What we care about is &#x60;tree 92018fc6ac6e71ea3dfb57e2fab9d3fe23b6fdf4&#x60;. The _tree_ object represents the directory listing of your repo. When you think trees, think directories.

Let’s inspect the tree object.

&#x60;&#x60;&#x60;angelscript
$ [&#x2F;webapp] git cat-file -p 92018fc6ac6e71ea3dfb57e2fab9d3fe23b6fdf4

100644 blob     6feaf03c7a9c805ff734a90a245a417e6a6c099b    .gitmodules
100644 blob     a72832b303c4d4f1833da79fc8a566e8a0eb37af    README.md
040000 tree     a425c23ded8892f901dee7fbc8d4c5714bdcc40d    tests
160000 commit   library_new_commit_sha                      library

&#x60;&#x60;&#x60;

Note how &#x60;tests&#x60; is a &#x60;tree&#x60; (just like directories can hold directories, trees can point to trees).

But &#x60;library&#x60; is a… commit?!

&#x60;&#x60;&#x60;basic
160000 commit   library_new_commit_sha                      library

&#x60;&#x60;&#x60;

That weirdness, right there, is precisely how git knows &#x60;library&#x60; points to &#x60;library_new_commit_sha&#x60;.

In other words, the way git implements submodules is by doing a weird trick where a tree points to a _commit_.

![Hand-drawn diagram showing the text &#39;webapp_new_commit_sha&#39; connected, via arrow, to &#39;tree a425&#39; which is itself connected, via arrow, to &#39;library_new_commit_sha&#39;](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3s7XnqkjSurwZBocgSOhuId_E2xCKm6guo3FwACdZAc&#x2F;https:&#x2F;&#x2F;www.cyberdemon.org&#x2F;assets&#x2F;submodules3.png)

Let’s use this knowledge to understand the &#x60;git diff&#x60; from earlier.

## Understanding git diff

Here’s the diff again.

&#x60;&#x60;&#x60;pgsql
$ [&#x2F;webapp] git diff

diff --git a&#x2F;library b&#x2F;library
index library_old_commit_sha..library_new_commit_sha 160000
--- a&#x2F;library
+++ b&#x2F;library
@@ -1 +1 @@
-Subproject commit library_new_commit_sha
+Subproject commit library_old_commit_sha

&#x60;&#x60;&#x60;

It’s confusing that it’s saying that **I** modified &#x60;library&#x60;. I didn’t modify it, someone else did!

Usually, I think of &#x60;git diff&#x60; as “here are the changes I have made”. But this isn’t exactly correct.

When you invoke &#x60;git diff&#x60;, you’re asking git to tell you the difference between your working tree (that is, your unstaged, uncommitted local changes) and the most recent commit of your branch (&#x60;webapp_new_commit_sha&#x60;).

When you look at it that way, the above git diff starts to make sense. In &#x60;webapp_new_commit_sha&#x60;, &#x60;library&#x60; points to &#x60;library_new_commit_sha&#x60;, but in our working tree, &#x60;library&#x60; still points to &#x60;library_old_commit_sha&#x60;.

git has no idea which change happened first. It only knows that your working tree is different from the commit. And, so it tells you: &#x60;library_new_commit_sha&#x60; is saying that library should point to &#x60;library_new_commit_sha&#x60;, but it doesn’t.

Understanding the above took the pain out of submodules for me. However, I still haven’t told you how to update a submodule.

## How to update a submodule

We now understand that we need to point &#x60;library&#x60; to &#x60;library_new_commit_sha&#x60;. How?

Because &#x60;library&#x60; is a full repo, I could just &#x60;cd&#x60; into it and literally check out that commit:

&#x60;&#x60;&#x60;maxima
$ [&#x2F;webapp] cd library

$ [&#x2F;library] git checkout library_new_commit_sha

Previous HEAD position was library_old_commit_sha README
HEAD is now at library_new_commit_sha add some cool functions

&#x60;&#x60;&#x60;

If we go back into &#x60;webapp&#x60;, we’ll see that &#x60;git st&#x60;&#x2F;&#x60;git diff&#x60; finally look clean.

&#x60;&#x60;&#x60;shell
$ [&#x2F;webapp] git st

## main...origin&#x2F;main
# (no output)

$ [&#x2F;webapp] git diff

# (no output)

&#x60;&#x60;&#x60;

However, you don’t actually need to do the above.

## How to really update a submodule

From &#x60;webapp&#x60;, we can invoke &#x60;git submodule update&#x60;. This updates _all_ of a repo’s submodules.

People often use certain flags with &#x60;git submodule update&#x60;, so let’s understand them.

### Initialize a submodule: &#x60;git submodule update --init&#x60;

Remember how I said that if you &#x60;git clone webapp&#x60;, git won’t actually download the contents of &#x60;library&#x60;?

What you’re supposed to do is, after cloning webapp:

1. Run &#x60;git submodule init&#x60; to initialize the submodules. This doesn’t actually download them, though 🙃️.
2. Run &#x60;git submodule update&#x60; to actually pull the submodules.

This is kind of a silly dance, so git lets you just do &#x60;git submodule update --init&#x60;. This initializes any submodules and updates them in one step. I _always_ pass &#x60;--init&#x60; because there is no harm in doing so.

You can skip &#x60;--init&#x60; by cloning with &#x60;--recursive&#x60;: that is, you could have done &#x60;git clone webapp --recursive&#x60;. I never remember to do this, though. Plus, you end up having to do &#x60;git update submodule&#x60; anyway.

### Update submodules of submodules: &#x60;git submodule update --recursive&#x60;

Submodules can nest other submodules. Yeah.

So, to take care of updating submodules _all the way down_, pretty much just always pass &#x60;--recursive&#x60; to &#x60;git submodule update&#x60;.

**So, the command I always end up using is &#x60;git submodule update --init --recursive&#x60;.**

### Make git automatically update submodules: &#x60;git config submodule.recurse true&#x60;

&#x60;submodule.recurse true&#x60; makes submodules automatically update when you &#x60;git pull&#x60;, &#x60;git checkout&#x60;, etc. In other words, it makes submodules automatically point to whatever they are supposed to point to. It’s only available in git 2.14 and newer.

That makes running &#x60;git submodule update&#x60; unnecessary.

I don’t use this setting, because I’m not sure if there are drawbacks or not. Plus, I work on submodules enough that I think it could cause conflicts. Let me know if you’re aware of shortcomings, or if you’ve been using this setting forever without issue!

This setting definitely does _not_ apply to &#x60;git clone&#x60;. So you still need to do &#x60;git clone --recursive&#x60; or init&#x2F;update submodules using the commands above.

## Recap

I think I can summarize submodules pretty simply.

It’s possible to embed a repo within another repo. This is called a submodule.

Each commit of the outer repo always specifies an _exact_ commit that submodule. This is done by the &#x60;outer commit -&gt; tree -&gt; submodule commit&#x60; link.

When you check out commits, git doesn’t automatically update submodules for you. You have to do that using &#x60;git submodule update&#x60;.

And there we have it!

## Further topics in submodules

The above is enough to hopefully take the confusion out of submodules. However, there are more common commands and configs that I’d like to explain.

### How to add a submodule: &#x60;git submodule add&#x60;

Let’s say that I start &#x60;webapp&#x60; fresh, and I have not added &#x60;library&#x60; to it yet.

To add &#x60;library&#x60;, I’d do &#x60;git submodule add https:&#x2F;&#x2F;github.com&#x2F;dmazin&#x2F;library.git library&#x60;.

This will add (or update) the &#x60;.gitmodules&#x60; file of &#x60;webapp&#x60;, download &#x60;library&#x60;, and point &#x60;webapp&#x60; at the latest commit of &#x60;library&#x60;.

Remember, this actually modifies &#x60;webapp&#x60;, so you need to commit after that. But you thankfully don’t need to do &#x60;git submodule update&#x60; after doing &#x60;git submodule add&#x60; or anything.

Remember that &#x60;library&#x60; is a full repo, so if you want to make changes to it, you can. Just make changes and commit them to the main branch.

But how do you make &#x60;webapp&#x60; point at the new commit? There are a couple ways.

#### Without a command

You can go into &#x60;webapp&#x60;, then &#x60;cd library&#x60;, and just do &#x60;git pull&#x60; in there. When you &#x60;cd&#x60; back into &#x60;webapp&#x60;, if you &#x60;git diff&#x60; you’ll see that &#x60;webapp&#x60; points to the newest branch of &#x60;library&#x60;. You can commit that.

#### Using &#x60;git submodule update --remote -- library&#x60;

This tells git “make the submodule point to the latest remote commit”. Since you have pushed the latest commit of library to library’s remote, this will make &#x60;webapp&#x60; point to that commit.

But note that &#x60;git submodule update --remote&#x60; will do this to _all_ your submodules. You likely do not want that.

For that reason, you have to do &#x60;git submodule update --remote -- library&#x60; to limit this to library only. (If you’re thrown off by the fact that you have to do &#x60;-- library&#x60; – yeah, it’s kind of weird.)

Because &#x60;--remote&#x60; might accidentally update all the submodules, honestly I usually do the “without a command” method.

### The .gitmodules file

How does git know where to download &#x60;library&#x60; from? git uses a file called &#x60;.gitmodules&#x60; to track the basic facts of a submodule, like the repo URL.

&#x60;&#x60;&#x60;jboss-cli
$ [&#x2F;webapp] cat .gitmodules

[submodule &quot;library&quot;]
        path &#x3D; library
        url &#x3D; https:&#x2F;&#x2F;github.com&#x2F;dmazin&#x2F;library.git

&#x60;&#x60;&#x60;

The nice thing about &#x60;.gitmodules&#x60; is that it’s a regular file, tracked the regular way in git. That makes it not confusing.

(What I don’t understand is, why git didn’t just put the submodule commit right in .gitmodules? The commits of &#x60;webapp&#x60; would _still_ be able to specify exact commits of &#x60;library&#x60; to use. What am I missing?)

### Making submodules use branches other than main

If you want to, you can make &#x60;library&#x60; track whatever branch you want. Otherwise, it defaults to whatever the “main” branch is.

&#x60;&#x60;&#x60;nix
[submodule &quot;library&quot;]
        path &#x3D; library
        url &#x3D; https:&#x2F;&#x2F;github.com&#x2F;dmazin&#x2F;library.git
        branch &#x3D; staging

&#x60;&#x60;&#x60;

Thanks for reading!