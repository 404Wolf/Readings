---
id: 3044eae2-a2c3-4e0c-806c-dd3639fb7ea7
title: XAES-256-GCM
tags:
  - RSS
date_published: 2024-06-26 11:06:28
---

# XAES-256-GCM
#Omnivore

[Read on Omnivore](https://omnivore.app/me/xaes-256-gcm-190555bb37e)
[Read Original](https://words.filippo.io/dispatches/xaes-256-gcm/)



About a year ago [I wrote](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;xaes-256-gcm-11&#x2F;) that “I want to use XAES-256-GCM&#x2F;11, which has a number of nice properties and only the annoying defect of not existing.” Well, there is now [an XAES-256-GCM specification](https:&#x2F;&#x2F;c2sp.org&#x2F;XAES-256-GCM?ref&#x3D;words.filippo.io). (Had to give up on the &#x2F;11 part, but that was just a performance optimization.)

XAES-256-GCM is an _authenticated encryption with additional data_ (AEAD) algorithm with 256-bit keys and **192-bit nonces**. It was designed with the following goals:

1. supporting a nonce large enough to be safe to generate randomly for a virtually unlimited number of messages (2⁸⁰ messages with collision risk 2⁻³²);
2. full, straightforward FIPS 140 compliance; and
3. trivial implementation on top of common cryptographic libraries.

The large nonce enables safer and more friendly APIs that automatically read a fresh nonce from the operating system’s CSPRNG for every message, without burdening the user with any [birthday bound](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Birthday%5Fattack?ref&#x3D;words.filippo.io) calculations. Compliance and compatibility make it available anywhere an AEAD might be needed, including in settings where alternative large-nonce AEADs are not an option.

Like XChaCha20Poly1305, XAES-256-GCM is an extended-nonce construction on top of AES-256-GCM. That is, it uses the key and the large nonce to compute a derived key for the underlying AEAD.

It’s simple enough to fit inline in this newsletter. Here we go. _K_ and _N_ are the input key and nonce, _Kₓ_ and _Nₓ_ are the derived AES-256-GCM key and nonce.

1. _L_ \&#x3D; AES-256ₖ(0¹²⁸)
2. If MSB₁(_L_) &#x3D; 0, then _K1_ \&#x3D; _L_ &lt;&lt; 1;  
Else _K1_ \&#x3D; (_L_ &lt;&lt; 1) ⊕ 0¹²⁰10000111
3. _M1_ \&#x3D; 0x00 || 0x01 || &#x60;X&#x60; || 0x00 || _N_\[:12\]
4. _M2_ \&#x3D; 0x00 || 0x02 || &#x60;X&#x60; || 0x00 || _N_\[:12\]
5. _Kₓ_ \&#x3D; AES-256ₖ(_M1_ ⊕ _K1_) || AES-256ₖ(_M2_ ⊕ _K1_)
6. _Nₓ_ \&#x3D; _N_\[12:\]

As you can see, it costs three AES-256ₖ calls per message, although one can be precomputed for a given key, and the other two can reuse its key schedule.

The [Go reference implementation](https:&#x2F;&#x2F;github.com&#x2F;C2SP&#x2F;C2SP&#x2F;blob&#x2F;main&#x2F;XAES-256-GCM&#x2F;go&#x2F;XAES-256-GCM.go?ref&#x3D;words.filippo.io) fits in less than 100 lines of mostly boilerplate, including the precomputation optimization, and only uses the standard library’s crypto&#x2F;cipher and crypto&#x2F;aes.

Importantly, you could also describe XAES-256-GCM entirely in terms of a standard [NIST SP 800-108r1](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;publications&#x2F;detail&#x2F;sp&#x2F;800-108&#x2F;rev-1&#x2F;final?ref&#x3D;words.filippo.io) KDF and the standard NIST AES-256-GCM AEAD ([NIST SP 800-38D](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;pubs&#x2F;sp&#x2F;800&#x2F;38&#x2F;d&#x2F;final?ref&#x3D;words.filippo.io), [FIPS 197](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;pubs&#x2F;fips&#x2F;197&#x2F;final?ref&#x3D;words.filippo.io)).

&gt; Instantiate a counter-based KDF ([NIST SP 800-108r1, Section 4.1](https:&#x2F;&#x2F;nvlpubs.nist.gov&#x2F;nistpubs&#x2F;SpecialPublications&#x2F;NIST.SP.800-108r1.pdf?ref&#x3D;words.filippo.io#%5B%7B%22num%22%3A79%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C70%2C300%2C0%5D)) with CMAC-AES256 ([NIST SP 800-38B](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;publications&#x2F;detail&#x2F;sp&#x2F;800-38b&#x2F;final?ref&#x3D;words.filippo.io)) and the input key as _Kin_, the ASCII letter &#x60;X&#x60; (0x58) as _Label_, the first 96 bits of the input nonce as _Context_ (as recommended by [NIST SP 800-108r1, Section 4](https:&#x2F;&#x2F;nvlpubs.nist.gov&#x2F;nistpubs&#x2F;SpecialPublications&#x2F;NIST.SP.800-108r1.pdf?ref&#x3D;words.filippo.io#%5B%7B%22num%22%3A71%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C70%2C720%2C0%5D), point 4), a counter (_i_) size of 16 bits, and omitting the optional _L_ field, and produce a 256-bit derived key. Use that derived key and the last 96 bits of the input nonce with AES-256-GCM.

Thanks to the choice of parameters, if we peel off the KDF and CMAC abstractions, the result is barely slower and more complex than straightforwardly invoking AES-256 on a counter. In exchange, we get a vetted and compliant solution. The parameters [are supported by the high-level OpenSSL API](https:&#x2F;&#x2F;github.com&#x2F;C2SP&#x2F;C2SP&#x2F;blob&#x2F;main&#x2F;XAES-256-GCM&#x2F;openssl&#x2F;openssl.c?ref&#x3D;words.filippo.io), too.

Why no more “&#x2F;11”? Well, half the point of using AES-GCM is FIPS 140 compliance. (The other half being hardware acceleration.) If we mucked with the rounds number the design wouldn’t be compliant.

Indeed, if compliance is not a goal there are a number of alternatives, from AES-GCM-SIV to modern AEAD constructions based on the AES core. The specification has [an extensive Alternatives section](https:&#x2F;&#x2F;c2sp.org&#x2F;XAES-256-GCM?ref&#x3D;words.filippo.io#alternatives) that compares each of them to XAES-256-GCM.

Also included in the specification are [test vectors](https:&#x2F;&#x2F;c2sp.org&#x2F;XAES-256-GCM?ref&#x3D;words.filippo.io#test-vectors) for the two main code paths (MSB₁(_L_) &#x3D; 0 and 1), and [accumulated test vectors](https:&#x2F;&#x2F;c2sp.org&#x2F;XAES-256-GCM?ref&#x3D;words.filippo.io#accumulated-randomized-tests) that compress 10 000 or 1 000 000 random iterations.

To sum up, XAES-256-GCM is designed to be a safe, boring, compliant, and interoperable AEAD that can fit high-level APIs, the kind we’d like to add to Go. It’s designed to complement XChaCha20Poly1305 and AES-GCM-SIV as implementations of a hypothetical [nonce-less AEAD API](https:&#x2F;&#x2F;github.com&#x2F;golang&#x2F;go&#x2F;issues&#x2F;54364?ref&#x3D;words.filippo.io#issuecomment-1642676993). If other cryptography library maintainers like it (or don’t), I would love to hear about it, because we are not big fans of adding Go-specific constructions to the standard library.

By the way, I have an exciting update about my professional open source maintainer effort coming in less than two weeks! Make sure to subscribe to [Maintainer Dispatches](https:&#x2F;&#x2F;filippo.io&#x2F;newsletter?ref&#x3D;words.filippo.io) or to follow me on Bluesky at [@filippo.abyssdomain.expert](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;filippo.abyssdomain.expert?ref&#x3D;words.filippo.io) or on Mastodon at [@filippo@abyssdomain.expert](https:&#x2F;&#x2F;abyssdomain.expert&#x2F;@filippo?ref&#x3D;words.filippo.io). (Or, see you at [GopherCon](https:&#x2F;&#x2F;www.gophercon.com&#x2F;?ref&#x3D;words.filippo.io) in Chicago!)

## The picture

Earlier this year I ran in the [Centopassi](https:&#x2F;&#x2F;www.centopassi.net&#x2F;?ref&#x3D;words.filippo.io) motorcycle competition. It involves driving more than 1600km on mountain roads, through one hundred GPS coordinates you select in advance from a long list, in three days and a half. It’s been fantastic. It took me to corners of Italy I would have never seen, and I had a lot of fun. This picture is taken at our 100th location, after a couple kilometers of unpaved hairpins on the side of the hill. The finish line was at the lake you can see in the distance. I was ecstatic.

That’s my 2014 KTM Duke 690, a single-cylinder “naked” from before KTM knew how to make larger street bikes. It’s weird and I love it.

![A black motorcycle with saddlebags and a race plate, parked on a dirt road overlooking a vast, scenic valley with green hills, a lake in the distance, and mountains under a bright blue sky with scattered white clouds.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sanacuJ4aSsap1sMxyOWYWS22BbHTSa3HT2QzJYOM3gs&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;06&#x2F;IMG_1921.jpeg)

My awesome clients—[Sigsum](https:&#x2F;&#x2F;www.sigsum.org&#x2F;?ref&#x3D;words.filippo.io), [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io), [Interchain](https:&#x2F;&#x2F;interchain.io&#x2F;?ref&#x3D;words.filippo.io), [Smallstep](https:&#x2F;&#x2F;smallstep.com&#x2F;?ref&#x3D;words.filippo.io), [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), [Teleport](https:&#x2F;&#x2F;goteleport.com&#x2F;?ref&#x3D;words.filippo.io), [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io), [Charm](https:&#x2F;&#x2F;charm.sh&#x2F;?ref&#x3D;words.filippo.io), and [Tailscale](https:&#x2F;&#x2F;tailscale.com&#x2F;?ref&#x3D;words.filippo.io)—are funding all my work for the community and through our retainer contracts they get face time and unlimited access to advice on Go and cryptography.

Here are a few words from some of them!

Latacora — [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io) bootstraps security practices for startups. Instead of wasting your time trying to hire a security person who is good at everything from Android security to AWS IAM strategies to SOC2 and apparently has the time to answer all your security questionnaires plus never gets sick or takes a day off, you hire us. We provide a crack team of professionals prepped with processes and power tools, coupling individual security capabilities with strategic program management and tactical project management.

Teleport — For the past five years, attacks and compromises have been shifting from traditional malware and security breaches to identifying and compromising valid user accounts and credentials with social engineering, credential theft, or phishing. [Teleport Identity Governance &amp; Security](https:&#x2F;&#x2F;goteleport.com&#x2F;identity-governance-security&#x2F;?utm&#x3D;filippo&amp;ref&#x3D;words.filippo.io) is designed to eliminate weak access patterns through access monitoring, minimize attack surface with access requests, and purge unused permissions via mandatory access reviews.

Ava Labs — We at [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), maintainer of [AvalancheGo](https:&#x2F;&#x2F;github.com&#x2F;ava-labs&#x2F;avalanchego?ref&#x3D;words.filippo.io) (the most widely used client for interacting with the [Avalanche Network](https:&#x2F;&#x2F;www.avax.network&#x2F;?ref&#x3D;words.filippo.io)), believe the sustainable maintenance and development of open source cryptographic protocols is critical to the broad adoption of blockchain technology. We are proud to support this necessary and impactful work through our ongoing sponsorship of Filippo and his team.

SandboxAQ — [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io)’s [AQtive Guard](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;solutions&#x2F;aqtive-guard?ref&#x3D;words.filippo.io) is a unified cryptographic management software platform that helps protect sensitive data and ensures compliance with authorities and customers. It provides a full range of capabilities to achieve cryptographic agility, acting as an essential cryptography inventory and data aggregation platform that applies current and future standardization organizations mandates. AQtive Guard automatically analyzes and reports on your cryptographic security posture and policy management, enabling your team to deploy and enforce new protocols, including quantum-resistant cryptography, without re-writing code or modifying your IT infrastructure.