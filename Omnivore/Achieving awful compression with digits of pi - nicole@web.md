---
id: c5dc6a16-e21e-11ee-98f6-6700ecb1ffd6
title: Achieving awful compression with digits of pi | nicole@web
tags:
  - RSS
date_published: 2024-03-14 00:00:00
---

# Achieving awful compression with digits of pi | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/achieving-awful-compression-with-digits-of-pi-nicole-web-18e3dc3d86c)
[Read Original](https://ntietz.com/blog/why-we-cant-compress-messages-with-pi/)



Compression is a _really_ hard problem, and it attracts a lot of interesting ideas. There are some numbers whose digits contain _all sequences_ of digits[1](#normal). People have long hypothesized that pi is one such number; a proof remains elusive.

If we have a number which contains all sequences of digits, could we transmit a message using that? Instead of telling my friend Erika the message, I could send her the offset and length in some number where that message occurs, then she could reconstruct the message!

The problem is that you wind up with a much larger message than if you&#39;d just sent what you wanted to in the first place. Let&#39;s take a look first at how you&#39;d do such a ridiculous thing, then we&#39;ll see why it doesn&#39;t work and compute the compression ratio you might actually achieve.

Happy Pi Day!

## Finding our message in pi

The first thing we need to do is figure out where our message is in pi.

The obvious approach here is to compute digits of pi, scanning through them and checking where our message is. We can do this with a spigot algorithm, which lets us compute digits sequentially from left to right. Traditional approximations would give us a converging number: 3.2, then 3.05, then 3.13, etc. In contrast, a spigot algorithm would give us 3, then 3.1, then 3.14, etc. Using this lets us scan through pi _only_ until we find our message!

The other thing we would like here is the ability to generate individual digits without computing the preceding digits. If we can do this, it makes decoding a lot faster, because you can start calculating from exactly where the message is rather than all the digits that came before. It also means that we only have to store the current digits we&#39;re checking, leading to much lower memory consumption.

The algorithm we&#39;re going to use here is the [Bailey-Borwein-Plouffe formula](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Bailey%E2%80%93Borwein%E2%80%93Plouffe%5Fformula), which was discovered in 1995 and allows us to compute the _hex_ digits of pi. Using base-16 digits means it&#39;s easier to encode our messages, which are natively in 8-bit byte arrays! Each byte corresponds to two nibbles, which are each hex digits. Perfect.

There weren&#39;t any libraries that I wanted to use for this in Rust, so the solution was to port some code from C! One of the authors of the algorithm we&#39;re using, David Bailey, has code listings in C and fortran for computing the algorithm. It&#39;s easier for me to port some code from C to Rust than from the math of a paper to Rust.

The main computation for digits of pi is this function. I don&#39;t understand the details, so don&#39;t ask me why; I just ported it.

&#x60;&#x60;&#x60;rust
pub fn pi_digits(id: usize) -&gt; Vec&lt;u8&gt; {
    let s1 &#x3D; series(1, id as i64);
    let s2 &#x3D; series(4, id as i64);
    let s3 &#x3D; series(5, id as i64);
    let s4 &#x3D; series(6, id as i64);
    let pid &#x3D; 4. * s1 - 2. * s2 - s3 - s4;
    let pid &#x3D; pid - pid.floor() + 1.;

    to_hex(pid)
}

&#x60;&#x60;&#x60;

We also define the function &#x60;series&#x60;, which this uses, but won&#39;t go into the details there. The [code is available](https:&#x2F;&#x2F;git.sr.ht&#x2F;~ntietz&#x2F;pi-compress) if you want to see it.

Now given this function, how can we compress with it?

We could scan until we find our entire message, but that ends up taking almost literally forever, and longer the bigger your message is. Instead, we&#39;re going to limit how many digits of pi we&#39;ll scan, and then find the longest matches within there. Our compressed message then, instead of one &#x60;(offset, length)&#x60; pair, is a list of such pairs.

We do that with two functions and one struct.

The struct tells us where a match is. Our first function finds our longest partial match that&#39;s within our digit limit.

&#x60;&#x60;&#x60;rust
pub struct Location {
    pub offset: usize,
    pub length: usize,
}

pub fn find_pi_match(msg: &amp;[u8], limit: usize) -&gt; Option&lt;Location&gt; {
    let mut best_match: Option&lt;Location&gt; &#x3D; None;
    let mut offset &#x3D; 0;

    &#39;outer: while offset &lt; limit {
        let mut pi_digits &#x3D; PiIterator::from(offset);

        while let Some(b) &#x3D; pi_digits.next()
            &amp;&amp; b !&#x3D; msg[0]
        {
            offset +&#x3D; 1;
            if offset &gt;&#x3D; limit {
                break &#39;outer;
            }
        }

        let length &#x3D; pi_digits
            .zip(msg.iter().skip(1))
            .take_while(|(a, &amp;b)| *a &#x3D;&#x3D; b)
            .count() + 1;

        if length &#x3D;&#x3D; msg.len() {
            return Some(Location { offset, length });
        } else if let Some(m) &#x3D; &amp;best_match {
            if length &gt; m.length {
                best_match &#x3D; Some(Location { offset, length });
            }
        } else {
            best_match &#x3D; Some(Location { offset, length });
        }

        offset +&#x3D; 1;
    }

    best_match
}

&#x60;&#x60;&#x60;

And then we string together partial matches to cover our entire message. This is our compression function.

&#x60;&#x60;&#x60;rust
pub fn compress(msg: &amp;[u8], limit: usize) -&gt; Vec&lt;Location&gt; {
    let mut locs &#x3D; vec![];

    let mut index &#x3D; 0;
    while index &lt; msg.len() {
        let m &#x3D; find_pi_match(&amp;msg[index..], limit).expect(&quot;should find some match&quot;);
        index +&#x3D; m.length;
        locs.push(m);
    }

    locs
}

&#x60;&#x60;&#x60;

It&#39;s not production ready—if it fails to find a match it just panics—but honestly, _honestly_, is that a worry?

Now we can run this. If we encode the message &#x60;&quot;hello&quot;&#x60; with a max offset of 4196[2](#terminate), then we get the following compressed message:

&#x60;&#x60;&#x60;yaml
[
  Location { offset: 2418, length: 3 },
  Location { offset: 936, length: 3 },
  Location { offset: 60, length: 2 },
  Location { offset: 522, length: 2 },
]

&#x60;&#x60;&#x60;

Neat! Our message is &quot;compressed&quot; using pi! But how well does it do?

## Measuring our compression ratio

An important part of any compression scheme is the data compression ratio. This is computed as &#x60;uncompressed-size &#x2F; compressed-size&#x60;, and you want as high of a number as possible. If your compression ratio is 4, that means that your original message is 4x larger than your compressed ratio, so you&#39;ve saved a ton of storage space or transmission bandwidth!

How well does our compression do here? Let&#39;s take a look at our example above.

We encoded &quot;hello&quot; and got back an array of four locations. Those were defined with &#x60;usize&#x60; for convenience, but each could fit in smaller numbers. Let&#39;s be generous and say that we&#39;re packing each location into a 16-bit int.

That means that our compressed size is 4 \* 16-bits &#x3D; 4 \* 2 bytes &#x3D; 8 bytes! And our original message was... uh oh. Our original message was 5 bytes. Our compression ratio is 5&#x2F;8 &#x3D; 0.6125, a very _bad_ compression ratio!

I ran an experiment for a few message lengths, and the compression ratio stays about the same across them.

![chart showing a consistent compression ratio of around 0.6](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sWOqawbZWKApWYMGWktwwJlJPa-hxUfwr7lyb8uYR5Ho&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;pi&#x2F;compression-ratio.svg)

The ultimate problem here is that, even if you can find your message, you&#39;re going to find it so far out that it won&#39;t be a _reduction_ of what you have to send! Obviously we were limited here in how far we can compute, but computing further isn&#39;t going to solve this problem.

## Using pi compression

Naturally, you might now ask, &quot;But Nicole, this sounds great, how can I use it?&quot; It&#39;s your lucky day, because you can go download it and use it. Just add it with &#x60;cargo add pi-compression&#x60; to get version 3.1.4.

But be careful to abide by the terms of the license. You can pick AGPL, or you can use the [Gay Agenda License](https:&#x2F;&#x2F;git.sr.ht&#x2F;~ntietz&#x2F;pi-compress&#x2F;tree&#x2F;main&#x2F;item&#x2F;LICENSE&#x2F;GAL-1.0) if you prefer.

---

Huge thanks to [Erika](https:&#x2F;&#x2F;erikarow.land&#x2F;) for implementing the pi-based compression with me! It was a blast pairing with you on this. ❤️

---

2

Chosen so that it would terminate in a reasonable amount of time.

[↩](#terminate%5Fref)

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).