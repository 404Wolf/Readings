---
id: 94ff9ba4-63a3-4ca6-9a2b-2375f6fb1549
title: Append-only programming
tags:
  - RSS
date_published: 2024-08-29 09:05:54
---

# Append-only programming
#Omnivore

[Read on Omnivore](https://omnivore.app/me/append-only-programming-1919f8a5d98)
[Read Original](https://iafisher.com/blog/2024/08/append-only-programming)



I have recently adopted a new methodology of software development:

1. Everything goes in a single C file.
2. New code is appended to the end of the file.
3. Existing code cannot be edited.

I call it _append-only programming_.

Append-only programming has many benefits. It forces you to define your interfaces before your implementations. It encourages you to write small functions. And it produces source code that is eminently readable, because the text of the program recapitulates your train of thought – a kind of stream-of-consciousness [literate programming](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Literate%5Fprogramming).

Make no mistake: append-only programming is not the most forgiving paradigm. If a subprocedure is found to be erroneous, a corrected version must be appended, and all of its callers must likewise be corrected. In unfortunate cases, the entire program may need to be retyped. The programmer is thus advised to get it right the first time.

Rather than use a conventional text editor, I prefer to simply &#x60;cat &gt;&gt; main.c&#x60;, which ensures that rules (2) and (3) are strictly observed. In fact, with a couple of aliases, I [never need to leave the shell](https:&#x2F;&#x2F;blog.sanctum.geek.nz&#x2F;series&#x2F;unix-as-ide&#x2F;) at all:

&#x60;alias edit&#x3D;&#39;cat &gt;&gt; main.c&#39;
alias show&#x3D;&#39;less main.c&#39;
alias check&#x3D;&#39;gcc -Wall -c main.c&#39;
alias build&#x3D;&#39;gcc -Wall main.c&#39;
alias checkpoint&#x3D;&#39;git add main.c &amp;&amp; git commit -m &quot;.&quot;&#39;
alias revert&#x3D;&#39;git restore main.c&#39;
&#x60;

---

In all seriousness, append-only programming is just a fun challenge, not a legitimate way of writing software. I wrote a [small Lisp interpreter](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;append-only) in append-only fashion, and it got tedious around the third time I had to re-type &#x60;eval_string&#x60;.

My original idea was that, since C lets you forward-declare types and functions, you could write a program incrementally: start by defining the &#x60;main&#x60; function in terms of high-level helper functions, then write those helper functions in terms of slightly lower-level functions, and so on until the entire program is complete. It&#39;s a sensible approach, and one that I often use in practice.

Of course, real coding rarely proceeds so smoothly, and you often discover, in the middle of writing your low-level functions, that your high-level functions need to be revised, which append-only programming makes difficult. Even more difficult is troubleshooting code that is not working. It is not an especially compelling use of my time to re-type an entire function just to add &#x60;print&#x60; statements.

Append-only programming was a noble experiment, but perhaps not one that it would be fruitful to repeat. If this post does inspire you to try it yourself, I&#39;d recommend a couple of revisions that preserve the spirit while easing some of the monotonous parts:

* Split out a &#x60;main.h&#x60; header file, so that you can append declarations and imports independently of definitions.
* Split your program into one file for every function, and allow yourself to overwrite files.

For those of you feeling even more adventurous, may I suggest append-only blogging? Or is that just Twitter? ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2024-08-append-only-programming.md).