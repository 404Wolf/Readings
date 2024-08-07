---
id: 0d675a7b-7b3e-4f6e-a271-14cfd10202ed
title: "Glome-ing the Gossip, part 1: nebkor-maelstrom"
tags:
  - RSS
date_published: 2024-06-11 00:00:00
---

# Glome-ing the Gossip, part 1: nebkor-maelstrom
#Omnivore

[Read on Omnivore](https://omnivore.app/me/glome-ing-the-gossip-part-1-nebkor-maelstrom-19009df9940)
[Read Original](https://proclamations.nebcorp-hias.com/sundries/glome-ing-pt1/)



## Table of Contents

* [nebkor-maelstrom, a simple crate for writing Maelstrom clients](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#nebkor-maelstrom-a-simple-crate-for-writing-maelstrom-clients)  
   * [Why write a new framework?](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#why-write-a-new-framework)  
      * [minimal boilerplate](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#minimal-boilerplate)  
      * [weak typing&#x2F;not for production](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#weak-typing-not-for-production)  
      * [no async&#x2F;minimal dependencies](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#no-async-minimal-dependencies)  
      * [simple to understand](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#simple-to-understand)  
   * [Wrapping up](https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;#wrapping-up)

## &#x60;nebkor-maelstrom&#x60;, a simple crate for writing Maelstrom clients

![glome-ing the gossip movie poster](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sy01zbETfevzC0Vw71rJk6jO-nvcgBPOBv_KfcRlgckY&#x2F;https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;glome-ing_the_gossip.jpg &quot;glome-ing the gossip movie poster&quot;)

Recently, I started working my way through the [Gossip Glomers](https:&#x2F;&#x2F;fly.io&#x2F;dist-sys&#x2F;)distributed system challenges[1](#glomers), and as usual wanted to use[Rust](https:&#x2F;&#x2F;www.rust-lang.org&#x2F;) to do it. There are a few off-the-shelf crates available for this, but none of them quite hit the spot for me. As a result, I wrote and released a new crate for writing Maelstrom clients, [nebkor-maelstrom](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;nebkor-maelstrom). This post is going to talk about that; there&#39;s a follow-up post coming soon that will go into my solutions using it.

Warning: seriously niche content.

## Why write a new framework?

First off, what exactly is [Maelstrom](https:&#x2F;&#x2F;github.com&#x2F;jepsen-io&#x2F;maelstrom)? From the front page of the Gossip Glomers, it&#39;s a platform that:

&gt; lets you build out a &#39;node&#39; in your distributed system and Maelstrom will handle the routing of messages between the those nodes. This lets Maelstrom inject failures and perform verification checks based on the consistency guarantees required by each challenge.

Maelstrom itself is built on top of [Jepsen](https:&#x2F;&#x2F;jepsen.io&#x2F;)[2](#jepsen), a framework for testing and verifying properties of distributed systems. Concretely, it&#39;s a program that you run, giving it the path to a binary that implements the Maelstrom protocol, along with the name of a &quot;workload&quot; meant to emulate particular distributed systems. It will then spawn a bunch of copies of the node that you wrote and start passing it messages, listening for responses, using &#x60;stdin&#x60; and &#x60;stdout&#x60; as the network medium:

![Maelstrom is the network](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sT_n9jCMo2aq26hz_Oj1_p5KLFHWSAO8-HZLhcNm_OHA&#x2F;https:&#x2F;&#x2F;proclamations.nebcorp-hias.com&#x2F;sundries&#x2F;glome-ing-pt1&#x2F;maelstrom-cloud.png &quot;Maelstrom is the network&quot;)

Each challenge consists of writing a node that implements a single[workload](https:&#x2F;&#x2F;github.com&#x2F;jepsen-io&#x2F;maelstrom&#x2F;blob&#x2F;main&#x2F;doc&#x2F;workloads.md). There are six workloads in the Glomers challenges, though ten are available within Maelstrom.

The front page of the challenge goes on to say, &quot;The documentation for these challenges will be in Go, however, Maelstrom is language agnostic so you can rework these challenges in any programming language.&quot; They provide packages for [several different languages](https:&#x2F;&#x2F;github.com&#x2F;jepsen-io&#x2F;maelstrom&#x2F;tree&#x2F;main&#x2F;demo), including Rust. So, why something new?

I actually started out using the crate they include as a demo,[maelstrom-node](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;maelstrom-node). However, it didn&#39;t take too long before I started chafing at it:

* there was a lot of boilerplate;
* each message type required its own custom data structure;
* it used async, which increased both he boilerplate as well as the compile times.

So after watching [Jon Gjengset work through](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;gboGyccRVXI) the first couple challenges while rolling his own Maelstrom support as he went, I decided to do the same, paying attention to the following characteristics:

### minimal boilerplate

This is subjective, but the framework is not the solution, and should stay as much out of your way as possible, while providing the most support. The &#x60;maelstrom-node&#x60; crate obligated quite a bit of ceremony, as you can see from the difference between my &quot;echo&quot; client using it vs. my own. First off, the client using the off-the-shelf crate:

&#x60;&#x60;&#x60;gauss
#[tokio::main]
async fn main() {
    let handler &#x3D; Arc::new(Handler::default());
    let _ &#x3D; Runtime::new()
        .with_handler(handler)
        .run()
        .await
        .unwrap_or_default();
}

&#x60;&#x60;&#x60;

Now with my crate:

&#x60;&#x60;&#x60;crmsh
fn main() {
    let node &#x3D; Echo;
    let runner &#x3D; Runner::new(node);
    runner.run(None);

&#x60;&#x60;&#x60;

Of course, when the code is that short, it&#39;s hard to appreciate the differences. But the first version pulled in over over 60 dependencies; the second is half that due to not pulling in Tokio. Also, the client is responsible for wrapping their node in an &#x60;Arc&#x60;, instead of letting the runtime&#39;s[runner](https:&#x2F;&#x2F;docs.rs&#x2F;maelstrom-node&#x2F;0.1.6&#x2F;maelstrom&#x2F;struct.Runtime.html#method.with%5Fhandler)take a generic parameter:

&#x60;&#x60;&#x60;rust
pub fn with_handler(self, handler: Arc&lt;dyn Node + Send + Sync&gt;) -&gt; Self

&#x60;&#x60;&#x60;

vs

&#x60;&#x60;&#x60;rust
pub fn new&lt;N: Node + &#39;static&gt;(node: N) -&gt; Self

&#x60;&#x60;&#x60;

Another source of boilerplate was the fact that the trait method for handling messages in the first version has the following signature:

&#x60;&#x60;&#x60;rust
async trait Node {
    async fn process(&amp;self, runtime: Runtime, req: Message) -&gt; Result&lt;()&gt;;
}

&#x60;&#x60;&#x60;

Notably, &#x60;&amp;self&#x60; is immutable, which means that if you need to keep any state in your node, you need to wrap it in like &#x60;Arc&lt;Mutex&lt;Vec&lt;_&gt;&gt;&#x60;, which means your client code is littered with like

&#x60;&#x60;&#x60;reasonml
&#x2F;&#x2F; drop into a temp scope so guard is dropped after
{
   let mut guard &#x3D; self.store.lock().unwrap();
   guard.borrow_mut().entry(key.to_string()).or_insert(val);
}

&#x60;&#x60;&#x60;

My own crate&#39;s [analogous trait method](https:&#x2F;&#x2F;docs.rs&#x2F;nebkor-maelstrom&#x2F;latest&#x2F;nebkor%5Fmaelstrom&#x2F;trait.Node.html#tymethod.handle)receives as &#x60;&amp;mut self&#x60;, so the above just turns into

&#x60;&#x60;&#x60;css
self.store.entry(key.to_string()).or_insert(val);

&#x60;&#x60;&#x60;

which is 75% fewer lines.

My most complex client was the one for the &#x60;kafka&#x60; workload, at 158 lines; the simplest was for the&#x60;echo&#x60; workload, at 21 lines. All in, the whole count for my Gossip Glomers challenges is:

&#x60;&#x60;&#x60;awk
$ wc -l *&#x2F;*&#x2F;*.rs |sort -n
   21 gg-echo&#x2F;src&#x2F;main.rs
   29 gg-uid&#x2F;src&#x2F;main.rs
   59 gg-g_counter&#x2F;src&#x2F;main.rs
  141 gg-txn&#x2F;src&#x2F;main.rs
  142 gg-broadcast&#x2F;src&#x2F;main.rs
  158 gg-kafka&#x2F;src&#x2F;main.rs
  550 total

&#x60;&#x60;&#x60;

### weak typing&#x2F;not for production

The Maelstrom [protocol](https:&#x2F;&#x2F;github.com&#x2F;jepsen-io&#x2F;maelstrom&#x2F;blob&#x2F;main&#x2F;doc&#x2F;protocol.md) is extremely simple. The [physical layer](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;OSI%5Fmodel#Layer%5F1:%5FPhysical%5Flayer) consists of &#x60;stdin&#x60; and&#x60;stdout&#x60; as already mentioned. The wire format is newline-separated JSON objects:

&#x60;&#x60;&#x60;crmsh
{
  &quot;src&quot;:  A string identifying the node this message came from
  &quot;dest&quot;: A string identifying the node this message is to
  &quot;body&quot;: An object: the payload of the message
}

&#x60;&#x60;&#x60;

The &#x60;body&#x60; is where all the real action is, however:

&#x60;&#x60;&#x60;routeros
{
  &quot;type&quot;:        (mandatory) A string identifying the type of message this is
  &quot;msg_id&quot;:      (optional)  A unique integer identifier
  &quot;in_reply_to&quot;: (optional)  For req&#x2F;response, the msg_id of the request
}

&#x60;&#x60;&#x60;

A &#x60;body&#x60; can also contain arbitrary other keys and values, and each workload has a different set of them.

A lot of the crates I saw that offered Maelstrom support exposed types like &#x60;Message&lt;P&gt;&#x60;, where &#x60;P&#x60;is a generic &quot;payload&quot; parameter for a &#x60;Body&lt;P&gt;&#x60;, and would usually be an enum with a specific variant for each possible message type in the workload.

I totally get where they&#39;re coming from; that kind of strict and strong type discipline is very on-brand for Rust, and I&#39;m often grateful for how expressive and supportive Rust&#39;s type system is.

But for this, which is a tinkertoy set for building toy distributed systems, I thought it was a bit much. My types look like this, with no generics[3](#one-generic):

&#x60;&#x60;&#x60;rust
pub struct Message {
    pub src: String,
    pub dest: String,
    pub body: Body,
}

&#x60;&#x60;&#x60;

In general, you don&#39;t worry about constructing a &#x60;Message&#x60; yourself in your handler, you construct a&#x60;Body&#x60; using &#x60;Body::from_type(&amp;str)&#x60; and &#x60;Body::with_payload(self, Payload)&#x60; builder methods, then pass that to a &#x60;send&#x60; or &#x60;reply&#x60; method that adds the &#x60;src&#x60; and &#x60;dest&#x60;.

The &#x60;Body&#x60; is a little more involved, mostly because the [Serde attributes double the line count](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nebkor&#x2F;nebkor-maelstrom&#x2F;src&#x2F;commit&#x2F;e5150af666e0531a3a1615254718b63df117abb9&#x2F;src&#x2F;protocol.rs#L63-L78), but:

&#x60;&#x60;&#x60;rust
pub struct Body {
    pub typ: String,
    pub msg_id: u64,
    pub in_reply_to: u64,
    pub payload: Payload,
    &#x2F;&#x2F; the following are for the case of errors
    pub code: Option&lt;ErrorCode&gt;,
    pub text: Option&lt;String&gt;,
}

&#x60;&#x60;&#x60;

&#x60;Payload&#x60; is a type alias for &#x60;serde_json::Map&lt;String, serde_json::Value&gt;&#x60;; it&#39;s decorated with&#x60;serde(flatten)&#x60;, which means, &quot;when serializing, don&#39;t put a literal &#39;payload&#39; field in the JSON, just put the keys and values from it directly in the body&quot;. When a &#x60;Body&#x60; is being deserialized from JSON, any unknown fields will be put into its &#x60;payload&#x60;.

The type of the &#x60;Body&#x60;, and hence the &#x60;Message&#x60; according to the Maelstrom protocol, is just a string. When writing your clients, you only have a few possible message types to consider, and it&#39;s easy and clear to just use bare strings in the places where they&#39;re needed.

I also deliberately ignore whole classes of errors and liberally &#x60;unwrap()&#x60; things like channel&#x60;send()&#x60;s and mutex &#x60;lock()&#x60;s, because those kinds of errors are out of scope for Maelstrom. If you can&#39;t get a handle to &#x60;stdin&#x60;, there&#39;s nothing you can do, so might as well assume its infallible.

### no async&#x2F;minimal dependencies

I&#39;ve already mentioned this, so no real need to go over it again. Async is nice when you need it, but when you don&#39;t, it&#39;s just more noise. &#x60;nebkor-maelstrom&#x60; has only three external deps (which have their own dependencies, so the full transitive set is 10x this, but still):

&#x60;&#x60;&#x60;ini
[dependencies]
serde_json &#x3D; &quot;1&quot;
serde &#x3D; { version &#x3D; &quot;1&quot;, default-features &#x3D; false, features &#x3D; [&quot;derive&quot;] }
serde_repr &#x3D; &quot;0.1&quot;

&#x60;&#x60;&#x60;

### simple to understand

Finally, I wanted it to be as clean and minimal as possible. The async &#x60;maelstrom-node&#x60;crate[4](#not-picking-on-them), for example, is extremely thorough and featureful, but is well over a thousand lines of fairly complicated code. &#x60;nebkor-maelstrom&#x60;, by contrast, is less than 500 lines of extremely straightforward code:

&#x60;&#x60;&#x60;crystal
$ wc -l src&#x2F;*.rs
   81 src&#x2F;kv.rs
  229 src&#x2F;lib.rs
  167 src&#x2F;protocol.rs
  477 total

&#x60;&#x60;&#x60;

Something that gave me particular trouble was how to handle RPC, that is, sending and receiving messages while already handling a message. I faffed around trying to get something with callbacks working, and then I finally found [this project](https:&#x2F;&#x2F;github.com&#x2F;rafibayer&#x2F;maelbreaker), &quot;Maelbreaker&quot; (note the cool logo!), and copied its [IO system](https:&#x2F;&#x2F;github.com&#x2F;rafibayer&#x2F;maelbreaker&#x2F;blob&#x2F;990a06293ebfbb0f1d5491bcc8a59a3c4d9f9274&#x2F;src&#x2F;runtime.rs#L27-L141), which used multi-producer&#x2F;single-consumer channels to send messages with &#x60;stdin&#x60; and &#x60;stdout&#x60; from separate threads[5](#simplified-io). I also stole their idea to [use MPSC channels](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nebkor&#x2F;nebkor-maelstrom&#x2F;src&#x2F;commit&#x2F;e5150af666e0531a3a1615254718b63df117abb9&#x2F;src&#x2F;lib.rs#L126-L137)as the method for getting values returned to the caller while the caller is handling a message already.

## Wrapping up

And here we are! All in all, I probably spent about twice as much time writing &#x60;nebkor-maelstrom&#x60; as I did solving the Gossip Glomers challenges, though partly that&#39;s due to the chores associated with publishing software that other people might plausibly use, and trying to be reasonably decent about it; things like writing examples and documentation and reviewing it for quality. I also enjoyed writing it in tandem with the exercises; every bit of functionality was directly motivated by acute need.

So, if you&#39;re thinking about tackling the challenges, and want to do them in Rust, I humbly suggest checking &#x60;nebkor-maelstrom&#x60; out; it&#39;s only a &#x60;cargo add&#x60; away!

---

[1 ⬑](#glomers%5Fref)

My partner could never remember the name of them until she came up with &quot;glome-ing the cube&quot;.

[2 ⬑](#jepsen%5Fref)

Jepsen is named after Carly Rae Jepsen (this is real), who sang the song, &quot;Call Me Maybe&quot;, which is obviously about attempting to communicate in the face of network partition.

[3 ⬑](#one-generic%5Fref)

There is one function that takes a generic parameter, [Runner::new&lt;N&gt;(node: N)](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nebkor&#x2F;nebkor-maelstrom&#x2F;src&#x2F;commit&#x2F;e5150af666e0531a3a1615254718b63df117abb9&#x2F;src&#x2F;lib.rs#L39), but there are no generic data structures (&#x60;dyn Node&#x60; is not generic, it&#39;s [dynamic](https:&#x2F;&#x2F;doc.rust-lang.org&#x2F;std&#x2F;keyword.dyn.html)).

[4 ⬑](#not-picking-on-them%5Fref)

I swear I&#39;m not picking on that crate, it&#39;s just a good contrast and I have direct experience using it.

[5 ⬑](#simplified-io%5Fref)

I was able to [simplify the IO](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nebkor&#x2F;nebkor-maelstrom&#x2F;src&#x2F;commit&#x2F;e5150af666e0531a3a1615254718b63df117abb9&#x2F;src&#x2F;lib.rs#L75-L89) [even more](https:&#x2F;&#x2F;git.kittencollective.com&#x2F;nebkor&#x2F;nebkor-maelstrom&#x2F;src&#x2F;commit&#x2F;e5150af666e0531a3a1615254718b63df117abb9&#x2F;src&#x2F;lib.rs#L165-L203), from spawning four separate threads to two, and likewise cutting the number of MPSC channels in half. This is solely because I took the time to revisit the design and consider what could be redundant; I&#39;m incredibly grateful to the Maelbreaker author for sharing their work, and I emailed them to let them know that (and they were glad to hear it!).

---

---