---
id: dfcbe8b1-9351-40f7-9085-31c46e7abab5
title: When is it okay to cast types with `as`? | Anna Hope
tags:
  - RSS
date_published: 2024-07-11 00:00:00
---

# When is it okay to cast types with `as`? | Anna Hope
#Omnivore

[Read on Omnivore](https://omnivore.app/me/when-is-it-okay-to-cast-types-with-as-anna-hope-190a3316925)
[Read Original](https://annahope.me/blog/when-is-rust-as-okay/)



 3 min read  July 11, 2024  #[rust](https:&#x2F;&#x2F;annahope.me&#x2F;tags&#x2F;rust&#x2F;) #[programming](https:&#x2F;&#x2F;annahope.me&#x2F;tags&#x2F;programming&#x2F;) 

[swan](https:&#x2F;&#x2F;travellingcryptographer.com&#x2F;) asked me this after reading an earlier version of [&quot;Surprises with Rust&#39;s as&quot;](https:&#x2F;&#x2F;annahope.me&#x2F;blog&#x2F;rust-as&#x2F;). I thought that post had already gotten long, so I decided to break this part out. I recommend reading that post first if you want the full context.

This is a complicated question. I don&#39;t think there are absolute answers in software engineering — and we should probably beware people who[try to give them.](https:&#x2F;&#x2F;www.linkedin.com&#x2F;feed&#x2F;update&#x2F;urn:li:activity:7209966198703161344&#x2F;)Almost every engineering decision requires trade-offs, and this is 100% the case with using [TryFrom](https:&#x2F;&#x2F;doc.rust-lang.org&#x2F;std&#x2F;convert&#x2F;trait.TryFrom.html#examples)instead of &#x60;as&#x60;. &#x60;TryFrom&#x60; gives us more certainty that this particular part of our codebase won&#39;t cause us surprises, but we trade away simplicity and convenience.

For me, that trade-off is worth it. When my code — or any code I have to work with — encounters something unexpected that it can&#39;t handle correctly, I prefer it to fail as fast as possible and give me as much relevant context as possible,[1](#1) instead of chugging on and doing strange things (and making me go on a wild chase to find the cause). So, I am clearly biased against &#x60;as&#x60;.

With that said, casting types with &#x60;as&#x60; is _probably_ okay if:

* You are building a toy project or a prototype just to learn or figure something out
* And you just need to get it working and don&#39;t care about handling errors
* And you&#39;re 100% sure that this will always be a toy project or a prototype where you won&#39;t care about handling errors (I&#39;ve made the wrong assumption with this before)
* And if you&#39;re not 100% sure, you leave notes&#x2F;issues&#x2F;tickets&#x2F;&#x60;&#x2F;&#x2F; TODO&#x60; comments to replace &#x60;as&#x60; with &#x60;TryFrom&#x60;for when you start to care about handling errors, _and pinky promise to actually do that_
* Or you&#39;re an experienced Rust programmer doing some low-level type juggling, and you have considered all the possible ranges and types of values your code would ever deal with, and determined that &#x60;as&#x60; is the best option, in which case you probably don&#39;t need my advice on this (but I would welcome your feedback!)

So, in short, something like this:

&#x60;&#x60;&#x60;sql
&#x2F;&#x2F; This should be okay because we&#39;re only ever dealing with ASCII-inputs.
&#x2F;&#x2F; TODO: Use &#x60;TryFrom&#x60;&#x2F;add error handling if we ever have to accept a wider range of inputs!
let byte &#x3D; some_char as u8;

&#x60;&#x60;&#x60;

Otherwise, if in doubt, I don&#39;t think it would be a bad idea to use &#x60;TryFrom&#x60; instead.

I appreciate &#x60;swan&#x60;&#39;s feedback that led to this addendum, and hope that it helps!

---

1

What &quot;fail&quot; means will depend on the context. It could be just &quot;crash with a clear error message&quot;, or, more likely in a complex system, log a clear error message and bail out of whatever procedure we attempted to do with that unexpected input.

[↩](#1%5Fref)

_If you have feedback, I would love to hear from you! Please use one of the links below to get in touch._ 