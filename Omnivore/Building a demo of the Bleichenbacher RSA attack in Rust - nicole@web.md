---
id: 192478d6-da21-11ee-a8b6-d3d8931a28ef
title: Building a demo of the Bleichenbacher RSA attack in Rust | nicole@web
tags:
  - RSS
date_published: 2024-03-04 00:00:00
---

# Building a demo of the Bleichenbacher RSA attack in Rust | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/building-a-demo-of-the-bleichenbacher-rsa-attack-in-rust-nicole--18e09654e6a)
[Read Original](https://ntietz.com/blog/bleichenbachers-attack-on-rsa/)



**Monday, March 4, 2024**

Recently while reading Real-World Cryptography, I got nerd sniped[1](#nerd-sniped) by the mention of [Bleichenbacher&#39;s attack on RSA](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Padding%5Foracle%5Fattack). This is cool, how does it work? I had to understand, and to understand something, I usually have to build it.

Well, friends, that is what I did. I implemented RSA from scratch, wrote the attack to decrypt a message, and made a web demo of it. Here&#39;s how I did it, from start to finish.

If you&#39;re here for [the demo](https:&#x2F;&#x2F;www.ntietz.com&#x2F;demos&#x2F;bleichenbacher&#x2F;), feel free to peruse it before, during, or after reading this post! It&#39;s a lot of fun. Otherwise, buckle in for a fun ride.

## What even is the Bleichenbacher attack? Wait, what is RSA?

Okay, so let&#39;s take a step back. RSA itself is a cryptosystem that&#39;s, unfortunately, still widely used despite it being a bad idea to use it. That&#39;s covered in my [post about RSA](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;rsa-deceptively-simple&#x2F;), which gives a nice overview. And the Bleichenbacher attack is a famous way to take an RSA-encrypted message[2](#with-pkcs) and find what it means without having the private key.

When I learned about the Bleichenbacher attack, I wanted to know how it worked in _detail_, not just broad strokes. So I went to the source, the [paper he wrote](https:&#x2F;&#x2F;link.springer.com&#x2F;content&#x2F;pdf&#x2F;10.1007&#x2F;BFb0055716.pdf) in 1998\. The paper contains a lot of math, but it&#39;s surprisingly approachable as long as you&#39;re looking to understand how to _implement_ the attack. Why it works, and the math derivations? I dunno. But how it works in practice, algorithmically? Approachable!

After I read the paper, though, I realized I needed to know more—a lot more—about how RSA itself works. So I read the [RSA page on Wikipedia](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;RSA%5F%28cryptosystem%29) a couple of times and worked through some examples by hand with very small numbers. Comfortable that I understood it more or less, I turned back to the paper.

That&#39;s when I remembered that the paper was talking about a particular encoding scheme used with RSA, called [PKCS #1 v1.5](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;PKCS%5F1). So I had to read about that, too. Then I read the paper _again_ in that context, and was ready to dive in.

I came up with a plan of attack, pun intended:

* **Implement RSA.** I wanted to do this myself so I can use very small keys and small messages, which would be faster to attack, so that I would know more quickly if my attack works or not. A lot of existing implementations strongly discourage, or prevent, using the vulnerable stuff, which was kind of the _point_ here.
* **Implement the attack.** Then it would just be code up the paper, right? How hard could it be, right?
* **Make a web demo!** This was always the end goal, so it influenced the design from the beginning. I don&#39;t want to ship Python to the browser, for example.

## Implementing RSA

Writing my own RSA library was definitely a good choice for learning. I _strongly_ recommend people do this for fun and education, and also please license it under something that discourages usage unless you&#39;re actually getting it vetted and checked.

For my library, [cryptoy](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;cryptoy), I used Rust so that I could use that sweet WASM toolchain. This would let me build it for the web and make an interactive demo!

I built it once, then rebuilt it again to make the interfaces better. And then I realized that the bigint library I was using was going to make things difficult for the demo I wanted, so I migrated to a different one. I was originally using [crypto-bigint](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;crypto-bigint), which is probably the one you want for any real cryptography applications in Rust, because it uses constant time operations wherever possible. The challenge was that it requires fixed precision[3](#runtime-precision), and that meant that it would be tough to write something that handles both very small and very large keys.

So, I migrated to use [num-bigint-dig](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;num-bigint-dig). It has bigints with arbitrary precision at runtime, exactly what I want. It library seems reasonable for my purposes, but doesn&#39;t have the vetting that &#x60;crypto-bigint&#x60; does, so I&#39;d be more wary of it in production. It very well could be fine, but it hasn&#39;t been audited and I _don&#39;t know_ if there are problems. But given that the whole _point_ here is to produce something vulnerable to a particular attack? Yeah, I&#39;m okay with that.

The other point in favor of &#x60;num-bigint-dig&#x60; was that it had nice things built in, like generating random primes. These were needed and I didn&#39;t have to go looking for them, so it makes the code nicer and tighter. The ergonomics of the code also feel better, which is subjective.

After I implemented RSA, I started to build a demo of it in a little playground. I got started, but didn&#39;t finish it. It was really fun pairing with a friend on this for a bit, and ultimately I didn&#39;t find the thing that would make it a compelling demo, so it was dropped. But like [Chekov&#39;s gun](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Chekhov%27s%5Fgun), will it return?

## Implementing the attack

The attack itself was pretty easy to get _partially_ working, and then very challenging to flush the bugs out of. It would make progress, make progress, then stall. At some point I figured out that the problem related to rounding (in part by looking at other implementations, and mostly by squinting at the paper a lot). Somewhere, my rounding went wrong. I fixed it, _mostly_. Then I rewrote it again and it worked! I&#39;m still not sure what the difference was and I&#39;m not looking back to figure out.

That part was left with one fatal bug which annoying but I accepted, just to be done with the project: keys over a certain size would just totally fail! Except I couldn&#39;t really let it go, it kept bugging me. Eventually I realized that my iteration counter was an 8-bit int, for reasons that escape me[4](#int). The upshot of that was that every 256th iteration, my code thought it was at iteration 0, and it reset things. Once that was a larger type, bigger keys worked!

Once it was done and I had it output some stats like the number of iterations taken and the number of messages required, I was pretty sure there was a bug: this was converging _too_ fast, yeah? But it turns out, it&#39;s actually fine! There&#39;s [a thesis](https:&#x2F;&#x2F;ethz.ch&#x2F;content&#x2F;dam&#x2F;ethz&#x2F;special-interest&#x2F;infk&#x2F;inst-infsec&#x2F;appliedcrypto&#x2F;education&#x2F;theses&#x2F;Experimenting%20with%20the%20Bleichenbacher%20Attack%20-%20Livia%20Capol.pdf) which shows that my messages required are about in the ballpark when using the kind of oracle[5](#oracle) I have.

The original paper called for an oracle which requires the padding to entirely be valid, but later results use a different oracle which just checks for two bytes at the start, &#x60;0x00 0x02&#x60;. It was shown in [Bock &#39;18](https:&#x2F;&#x2F;www.usenix.org&#x2F;system&#x2F;files&#x2F;conference&#x2F;usenixsecurity18&#x2F;sec18-bock.pdf) that a _lot_ of real-world cases of this attack provide this sort of oracle. So, this is a realistic assumption.

After this was done, I built another version of it as an iterator. I used the original code and encoded the state into an iterator so that, for a demo, I can show the progress and intermediate internal state along the way. Converting it to an iterator was fun, and pretty straightforward! It&#39;s a nice technique for looping algorithms, so that you have pause points between iterations where you can do other work.

## Making the demo: it&#39;s Yew and me

To make the demo, I first procrastinated by looking at all the different Rust single-page app frameworks for an hour or two under the premise of &quot;research&quot;. Then I decided to just use the one I already used on a different project, a framework called [Yew](https:&#x2F;&#x2F;yew.rs&#x2F;).

I sketched out the design and figured out that what I wanted was something where you can see different steps along the way, but more importantly, get a _feel_ for how the attack is progressing. I wanted you to _feel how fast_ it is to decrypt one of these messages.

From there I just worked through it. Most of the code is boilerplate, lots of state hooks and forms passing data back out for later use. The code is [all available](https:&#x2F;&#x2F;git.sr.ht&#x2F;~ntietz&#x2F;cryptoy&#x2F;tree&#x2F;main&#x2F;item&#x2F;playground) if you do want to read it, so if you are curious, take a look! The most interesting part is probably the container for the attack itself. I needed to keep some state in there for where we are in the attack, and also needed to have it run on its own.

That state was kept inside the &#x60;AttackDemo&#x60; struct.

&#x60;&#x60;&#x60;rust
#[derive(Debug)]
pub struct AttackDemo {
    &#x2F;&#x2F;&#x2F; internal state, and the iterator for the attack
    pub attack_state: AttackState,

    &#x2F;&#x2F;&#x2F; stats we want to display
    pub iterations: usize,
    pub oracle_calls: usize,
    pub span: BigUint,

    &#x2F;&#x2F;&#x2F; a ticker which gives us a call every so often
    pub ticker: Option&lt;Interval&gt;,
}

&#x60;&#x60;&#x60;

Then I implement Yew&#39;s &#x60;Component&#x60; trait for it. We start with the associated types: we have &#x60;Msg&#x60; for the different messages we can send upon events, and a properties type for what&#39;s passed into the component.

&#x60;&#x60;&#x60;crystal
impl Component for AttackDemo {
    type Message &#x3D; Msg;
    type Properties &#x3D; AttackProps;

    &#x2F;&#x2F; ...
}

pub enum Msg {
    Step,
    Run,
    Pause,
    Reset,
}

#[derive(Properties, PartialEq)]
pub struct AttackProps {
    pub attack_state: AttackState,
}

&#x60;&#x60;&#x60;

Then we have the methods. The &#x60;create&#x60; and &#x60;view&#x60; functions are boilerplate, just initializing the state and rendering some HTML with buttons for emitting different messages. A stripped down form of &#x60;view&#x60; to just contain one button which sends a message would look like this. The rest of it is similar to add more buttons, and render some data which we get from &#x60;self&#x60;.

&#x60;&#x60;&#x60;stata
    def view(&amp;self, ctx: Context&lt;Self&gt;) -&gt; Html {
        let run &#x3D; ctx.link().callback(|_| Msg::Run);

        html! {
            &lt;div class&#x3D;&quot;attack&quot;&gt;
                &lt;input type&#x3D;&quot;button&quot; value&#x3D;&quot;Run&quot; onclick&#x3D;{run} &#x2F;&gt;
            &lt;&#x2F;div&gt;
        }
    }

&#x60;&#x60;&#x60;

The &#x60;update&#x60; function is where the attack code is invoked! It looks like this. We receive a message, and then pattern match on it. For &#x60;Step&#x60;, we perform one iteration and cancel the ticker if we&#39;ve exhausted the iterator. For &#x60;Run&#x60;, we start a ticker for every 20 milliseconds (faster and you can&#39;t see the attack progress).&#x60;Pause&#x60; does the opposite, and stops the ticker. And &#x60;Reset&#x60; clears all the state so we can start over!

&#x60;&#x60;&#x60;rust
    fn update(&amp;mut self, ctx: &amp;Context&lt;Self&gt;, msg: Self::Message) -&gt; bool {
        match msg {
            Msg::Step(n) &#x3D;&gt; {
                if let Some((_message, state)) &#x3D; self.attack_state.attack_iter.next() {
                    self.set_iteration_state(&amp;state);
                    true
                } else {
                    self.ticker &#x3D; None;
                    false
                }
            }
            Msg::Run &#x3D;&gt; {
                self.ticker &#x3D; {
                    let link &#x3D; ctx.link().clone();
                    Some(Interval::new(20, move || {
                        link.send_message(Msg::Step(1));
                    }))
                };
                true
            }
            Msg::Pause &#x3D;&gt; {
                self.ticker &#x3D; None;
                true
            }
            Msg::Reset &#x3D;&gt; {
                self.ticker &#x3D; None;
                self.reset_state(&amp;ctx.props().attack_state.current);
                self.attack_state &#x3D; ctx.props().attack_state.clone();
                true
            }
        }
    }

&#x60;&#x60;&#x60;

While working on it, I had to remember to use release builds for larger key sizes as I was testing, otherwise my computer got really hot and things never finished. Then again, it was pretty cold outside... so that was sometimes a benefit.

The final step was to create the release build and put it in a page on my blog! This was pretty straightforward, though I have some manual steps. There&#39;s not a good way that I can see to have [Trunk](https:&#x2F;&#x2F;trunkrs.dev&#x2F;) build artifacts you can embed into another page; it wants to build _the_ page, and have other things embed into it. Since I wanted to use my usual blog templates, I snagged out the pieces that I wanted from there, all good.

---

This was a really fun project, end to end! I don&#39;t think I would use Yew in production, because I am just not as productive in it as other things. And I _certainly_ wouldn&#39;t use my own RSA code (or any other RSA) in production! But the point was to learn and have fun, and that was well achieved.

Now if you haven&#39;t gone and played with [the demo](https:&#x2F;&#x2F;www.ntietz.com&#x2F;demos&#x2F;bleichenbacher&#x2F;), please do!

---

1

This term comes from a classic [xkcd comic](https:&#x2F;&#x2F;xkcd.com&#x2F;356&#x2F;). I wish we had a name for it that didn&#39;t evoke any violence, but it&#39;s the most well-known term for the phenomenon that I&#39;m aware of, so I&#39;m using it here for clarity.

[↩](#nerd-sniped%5Fref)

2

It requires that the message be encoded in a particular format, called PKCS #1 v1.5\. There are similar vulnerabilities for other encoding schemes, though not all encoding schemes have these.

[↩](#with-pkcs%5Fref)

3

There&#39;s a &#x60;BoxedUint&#x60; type available which decides precision at runtime, but I ran into problems getting a lot of things to work with these. I don&#39;t remember details and it could have been user error, but it was not the clear blessed path.

[↩](#runtime-precision%5Fref)

4

I _think_ it was because it was originally a &#x60;BigUint&#x60;, which I would declare using &#x60;let iteration: BigUint &#x3D; 0u8.into();&#x60;, with the type specifier being required on the in here since &#x60;i32&#x60; can&#39;t be converted to &#x60;BigUint&#x60;. But then I made it not-a-BigUint since it doesn&#39;t need bigint-worth of iterations so let&#39;s save some cycles—and I didn&#39;t change it from &#x60;0u8&#x60;, leaving me with an 8-bit int.

[↩](#int%5Fref)

5

In this context, an oracle is something which you can ask &quot;is the plaintext for this ciphertext properly formatted in PKCS?&quot; and it will say &quot;yes&quot; or &quot;no&quot;.

[↩](#oracle%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6) 