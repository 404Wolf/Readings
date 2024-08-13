---
id: d8815e6c-c4be-44e0-addb-a623375217c2
title: LÖVE, Fennel, and the Conjure REPL // steve gattuso
tags:
  - RSS
date_published: 2024-07-18 22:00:00
---

# LÖVE, Fennel, and the Conjure REPL // steve gattuso
#Omnivore

[Read on Omnivore](https://omnivore.app/me/love-fennel-and-the-conjure-repl-steve-gattuso-190cdcc2183)
[Read Original](https://www.stevegattuso.me/2024/07/19/love-fennel.html)



 LÖVE, Fennel, and the Conjure REPL

 Published on Jul 19th, 2024.

I ran a quick experiment tonight that I think had some results worth sharing. Open up [this here repository](https:&#x2F;&#x2F;git.sr.ht&#x2F;~vesto&#x2F;fennel-love2d-conjure-repl&#x2F;tree) and let’s go on a little adventure.

I’ve been curious about playing with [LÖVE](https:&#x2F;&#x2F;love2d.org&#x2F;) for a game idea that’s been sloshing around in my head. While I love lua as a programming language, I can’t seem to shake the bliss of REPL-driven development that I can get from Lisps. Enter [Fennel](https:&#x2F;&#x2F;fennel-lang.org&#x2F;), a small Lisp that compiles down to Lua.

I’m far from the first person who has tried combining LÖVE with Fennel, but [this minimal setup](https:&#x2F;&#x2F;sr.ht&#x2F;~benthor&#x2F;absolutely-minimal-love2d-fennel&#x2F;) for pairing the two up caught my eye. The only issue: the REPL provided is just a barebones CLI. My blissful Lisp REPL setup involves my preferred editor, neovim, and [Conjure](https:&#x2F;&#x2F;github.com&#x2F;Olical&#x2F;conjure), a plugin that provides a powerful REPL integration.

The tools are all here, but I need some glue to get this minimal LÖVE&#x2F;Fennel setup connected to Conjure’s REPL inside Neovim. Conjure supports Fennel out-of-the-box, but by default uses a special Fennel REPL (Aniseed) that doesn’t help us. Thankfully there happens to be [Fennel stdio client](https:&#x2F;&#x2F;github.com&#x2F;Olical&#x2F;conjure&#x2F;wiki&#x2F;Quick-start:-Fennel-%28stdio%29) that looks like it’s _allllmost_ what I want. It can start fennel via the &#x60;fennel&#x60; command, but we really need it to start Fennel using the &#x60;love .&#x60; command. Let’s change that by setting a config var in neovim’s &#x60;init.lua&#x60;

&#x60;&#x60;&#x60;clean
let g:conjure#client#fennel#stdio#command &#x3D; &quot;love .&quot;

&#x60;&#x60;&#x60;

Now if we open &#x60;main.fnl&#x60; we’ll also see our LÖVE game boot up and display a window- nice! The only issue is that executing forms via Conjure doesn’t seem to yield an output. The culprit? The &#x60;fennel-stdio&#x60; client looks for a pattern in the output to determine if the REPL is ready for the next command! This behavior is [hidden away](https:&#x2F;&#x2F;github.com&#x2F;Olical&#x2F;conjure&#x2F;blob&#x2F;master&#x2F;doc&#x2F;conjure-client-fennel-stdio.txt#L75-L80) in the vim help doc for the client. We can patch this up by modifying the code that runs in the thread watching for input:

&#x60;&#x60;&#x60;clojure
(global thread-code
     (.. &quot;require(&#39;love.event&#39;)\n&quot;
         &quot;io.write(&#39;&gt;&gt; &#39;)\n&quot;
         &quot;io.flush()&quot;
         &quot;while 1 do\n&quot;
         &quot;love.event.push(&#39;stdin&#39;, io.read(&#39;*line&#39;))\n&quot;
         &quot;os.execute(&#39;sleep 0.15&#39;)\n&quot;
         &quot;io.write(&#39;&gt;&gt; &#39;)\n&quot;
         &quot;io.flush()&quot;
         &quot;end&quot;))

(fn love.load []
  ;; start a thread listening on stdin
  (: (love.thread.newThread thread-code) :start))

&#x60;&#x60;&#x60;

Now if we open up &#x60;main.fnl&#x60; again we’ll see our game _and_ we can successfully execute forms in the Conjure REPL. We can even update functions like &#x60;love.draw&#x60; on the fly and see the results in the game window. Yeehaw!

There’s still a catch though: our barebones REPL uses a newline as the signal to start evaluating the input. This means that if you try to eval a multi-line form you’ll get a syntax error. Kind of a dealbreaker, but I’m sure there’s a solution to this one.

Unfortunately it’s late at night as I’m writing this and I wanted to get _something_ out before I went to bed, knowing that there is a non-zero chance I won’t be able to come back to this soon. Regardless, this felt like an interesting enough adventure to share even if half-baked. I’ll provide an update if I figure out this last bit, but hopefully this is enough information to help someone else get inspired or unstuck with a similar problem.