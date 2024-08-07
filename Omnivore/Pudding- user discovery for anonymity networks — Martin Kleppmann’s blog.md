---
id: 36ac198b-191d-4fe0-acc1-3ab5e028d53a
title: "Pudding: user discovery for anonymity networks — Martin Kleppmann’s blog"
tags:
  - RSS
date_published: 2024-07-05 00:00:00
---

# Pudding: user discovery for anonymity networks — Martin Kleppmann’s blog
#Omnivore

[Read on Omnivore](https://omnivore.app/me/pudding-user-discovery-for-anonymity-networks-martin-kleppmann-s-19082f125ac)
[Read Original](https://martin.kleppmann.com/2024/07/05/pudding-user-discovery-anonymity-networks.html)



---

Published by Martin Kleppmann on 05 Jul 2024.

I’d like to introduce an exciting new research paper I worked on! It’s about a system called [Pudding](https:&#x2F;&#x2F;arxiv.org&#x2F;abs&#x2F;2311.10825), and it was presented by [Ceren](https:&#x2F;&#x2F;twitter.com&#x2F;ckocaogullar1) at the [IEEE Symposium on Security and Privacy](https:&#x2F;&#x2F;sp2024.ieee-security.org&#x2F;), one of the top academic conferences on computer security, in May. [Daniel](https:&#x2F;&#x2F;www.danielhugenroth.com&#x2F;) and [Alastair](https:&#x2F;&#x2F;www.cl.cam.ac.uk&#x2F;~arb33&#x2F;) also worked on this project. Ceren’s presentation [is now available](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;EEUdslTwYZ8):

Let me briefly explain what the paper is about.

Anonymity systems allow internet users to hide who is communicating with whom – for example, think a whistleblower talking to a journalist, or a group of activists organising protests against their repressive regime. [Tor](https:&#x2F;&#x2F;www.torproject.org&#x2F;) is the most popular anonymity network; [Nym](https:&#x2F;&#x2F;nymtech.net&#x2F;) is a more recent design with stronger security (and incidentally, one of the better cryptocurrency applications I’ve seen). Nym is based on a research system called [Loopix](https:&#x2F;&#x2F;www.usenix.org&#x2F;conference&#x2F;usenixsecurity17&#x2F;technical-sessions&#x2F;presentation&#x2F;piotrowska).

The trouble with these anonymity networks is that if you want to contact someone, you need to know their public key, and sometimes a bunch of other information as well. In the case of Tor, this is encoded in a “[onion service](https:&#x2F;&#x2F;community.torproject.org&#x2F;onion-services&#x2F;)” URL, which is an unreadable sequence of random letters and numbers (sometimes service operators use brute force to pick a public key so that the first few letters of the hostname spell out the name of the service, but the rest remains random). In Nym, it’s an [even longer base58 string](https:&#x2F;&#x2F;nymtech.net&#x2F;docs&#x2F;clients&#x2F;addressing-system.html). How are users supposed to find the correct key for the person they’re trying to contact? If they send the key via a non-anonymous channel or query a server, they leak the information of who is talking to who, which defeats the entire purpose of the anonymity network.

Having to manually exchange public keys is a huge step backwards in terms of usability. A big part of why WhatsApp and Signal succeeded in bringing end-to-end encryption to billions of users, while PGP failed, is that today’s secure messaging apps allow you to find your friends using only a phone number or some other friendly username, while PGP encouraged [weird, nerdy, in-person meetings](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Key%5Fsigning%5Fparty) for exchanging keys.

Pudding brings friendly usernames to the Loopix&#x2F;Nym anonymity networks, so that users don’t have to deal with long random strings. We used email addresses rather than phone numbers, for reasons explained in the paper, but the idea is the same. The challenge is providing the username lookup in a way that doesn’t leak who is talking to who. In fact, Pudding even goes further and hides whether a given username is registered to the network or not.

If you’re wondering how this work on anonymity relates to my other work on [CRDTs](https:&#x2F;&#x2F;crdt.tech&#x2F;)&#x2F;[local-first software](https:&#x2F;&#x2F;www.inkandswitch.com&#x2F;local-first&#x2F;): I see anonymity networks as one possible transport layer on top of which we can build decentralised collaboration software. Not all collaboration apps will need the metadata privacy of an anonymity network, but it’s nice to be able to support high-risk users, such as investigative journalists, who do have strong security needs.

If you want to learn more, please [watch the talk](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;EEUdslTwYZ8), [read the paper](https:&#x2F;&#x2F;arxiv.org&#x2F;abs&#x2F;2311.10825), or [check out the source code](https:&#x2F;&#x2F;github.com&#x2F;ckocaogullar&#x2F;pudding-protocol)! Just note that the implementation is a research prototype and not fit for production use. We’re hoping that Nym might officially adopt something like Pudding in the future.

If you found this post useful, please[support me on Patreon](https:&#x2F;&#x2F;www.patreon.com&#x2F;martinkl) so that I can write more like it!

 To get notified when I write something new,[follow me on Bluesky](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;martin.kleppmann.com) or[Mastodon](https:&#x2F;&#x2F;nondeterministic.computer&#x2F;@martin), or enter your email address:

 I won&#39;t give your address to anyone else, won&#39;t send you any spam, and you can unsubscribe at any time.

---