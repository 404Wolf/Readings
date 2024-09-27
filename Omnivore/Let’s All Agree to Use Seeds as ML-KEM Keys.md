---
id: ffd8c1fd-4126-4d6c-9aec-bfd4cf1467a6
title: Let’s All Agree to Use Seeds as ML-KEM Keys
tags:
  - RSS
date_published: 2024-08-21 11:05:59
---

# Let’s All Agree to Use Seeds as ML-KEM Keys
#Omnivore

[Read on Omnivore](https://omnivore.app/me/let-s-all-agree-to-use-seeds-as-ml-kem-keys-191769ee00b)
[Read Original](https://words.filippo.io/dispatches/ml-kem-seeds/)



Last week, NIST published the final version of the ML-KEM[\[1\]](#fn1) specification, [FIPS 203](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;pubs&#x2F;fips&#x2F;203&#x2F;final?ref&#x3D;words.filippo.io). One change from the draft is that the final document explicitly allows storing the private decapsulation key as a _seed_. This is a plea to the cryptography engineering community: let’s all agree to only use seeds as the storage format of ML-KEM keys, and forget that a serialized format for expanded decapsulation keys even exists.

Seeds have multiple advantages. The most obvious is size: a seed is 64 bytes, while an expanded decapsulation key is 1 632, 2 400, or 3 168 bytes depending on the ML-KEM parameter set.

More importantly, though, a 64-byte seed is always valid, while an expanded decapsulation key needs to be _validated_. FIPS 203, Section 7.3, requires the following check

&#x60;&#x60;&#x60;angelscript
H(dk[384𝑘 : 768𝑘 + 32])) &#x3D;&#x3D; dk[768𝑘 + 32 : 768𝑘 + 64]

&#x60;&#x60;&#x60;

to ensure two parts of the input key are consistent: the pre-computed hash of the encapsulation key, and the encapsulation key itself.

That’s not all, though. The decapsulation key expanded format is

&#x60;&#x60;&#x60;ruby
ByteEncode₁₂(s) || ByteEncode₁₂(t) || ρ || H(ekPKE) || z

&#x60;&#x60;&#x60;

where _s_ and _t_ are vectors of [NTT elements](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;kyber-math&#x2F;). An NTT element is in turn a vector of field elements, and a field element is a number between zero and 3 329, encoded as a 16-bit integer. What if an encoded field element is higher than 3 329? It’s invalid! What then? Well. If you find one in an _encapsulation key_ you are required to reject it by FIPS 203, Section 7.2\. But what if you find it in the encapsulation key that’s part of a decapsulation key (the _t_ value)? And what if you find it in a different part of a decapsulation key (the _s_ value)? The spec doesn’t say!

This whole can of worms just stays on the shelf with seeds, because it’s the implementation itself that derives _s_, _t_, and _H(ekPKE)_, so it can be certain they are valid.

Ok, so seeds are smaller and simpler, reducing the margin for error, but are they expensive? They are not, to the point that loading the expanded decapsulation key over a Gigabit link is almost as expensive as expanding a seed[\[2\]](#fn2), but most importantly it doesn’t matter!

Keys have implicitly two representations: one on the wire, one in memory. The latter can include precomputed values to enable faster operations and doesn&#39;t need a fixed bytes format. The cost of going from one to the other—the cost of seed expansion—is not important for private keys: either keys are ephemeral, in which case they can go straight into the in-memory representation, or they are reused a lot, in which case the deserialization cost is amortized.

The ML-KEM expanded decapsulation key format is actually not even a good in-memory format, because it doesn’t include the full expanded matrix A but its seed ρ. It’s a weird in-between where some values are expanded (so you need to validate them) but some others are not (so you need to expand them).

Seeds have obvious advantages and are explicitly allowed by the specification, so we’ll definitely see them used in the wild. If we _also_ support the expanded format, we’re going to see interoperability issues, and we’ll have to carry all the complexity of both code paths. Let’s just not.

Speaking of interoperability, FIPS 203 does a great job of specifying everything in terms of byte sequences[\[3\]](#fn3)… _except_ the seed, which is defined as _‌(d, z)_. I think every implementation I’ve seen just stores them by concatenating [\[4\]](#fn4) them as a 64-byte buffer, so hopefully we can all agree on that. If anyone suggests an ASN.1 SEQUENCE of BIT STRINGs or whatever I _will_ quit.

~~To really put this to rest, we’re going to need (sooner rather than later!) a specification like [RFC 8410](https:&#x2F;&#x2F;www.rfc-editor.org&#x2F;info&#x2F;rfc8410?ref&#x3D;words.filippo.io) which specifies the key format and assigns OIDs for use in e.g. PKCS #8\. Interestingly, the OID arc used by RFC 8410 for Ed25519, 1.3.101, is now [managed as an IANA registry](https:&#x2F;&#x2F;www.iana.org&#x2F;assignments&#x2F;smi-numbers&#x2F;smi-numbers.xhtml?ref&#x3D;words.filippo.io#smi-numbers-1.3.101) with policy [Specification Required](https:&#x2F;&#x2F;datatracker.ietf.org&#x2F;doc&#x2F;html&#x2F;rfc8126?ref&#x3D;words.filippo.io#section-4.6), _not_ RFC Required. See [RFC 8411](https:&#x2F;&#x2F;www.rfc-editor.org&#x2F;info&#x2F;rfc8411?ref&#x3D;words.filippo.io). That means that anyone could make e.g. a [C2SP](https:&#x2F;&#x2F;c2sp.org&#x2F;?ref&#x3D;words.filippo.io) document referencing FIPS 203 and request OID assignments for ML-KEM. Unless work is already underway to assign OIDs, this might very well be the fastest path, and the longer we wait the more we risk ecosystem fractures.~~

**EDIT** (minutes after pressing send): Well, scratch all that, I was a day behind on my mailing lists inbox and I just saw that NIST has published [OIDs for all ML-KEM parameters](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;projects&#x2F;computer-security-objects-register&#x2F;algorithm-registration?ref&#x3D;words.filippo.io) and linked to [draft-ietf-lamps-kyber-certificates-03](https:&#x2F;&#x2F;www.ietf.org&#x2F;archive&#x2F;id&#x2F;draft-ietf-lamps-kyber-certificates-03.html?ref&#x3D;words.filippo.io) for the key format specification. The &quot;Private Key Format&quot; section of that draft doesn&#39;t say what the actual private key format is, and hopefully it will land on 64-byte seeds.

Concretely, for implementations, I am suggesting not implementing expanded key parsing and validation at all, or relegating it to an internal function like the [derandomized](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;avoid-the-randomness-from-the-sky&#x2F;) variants, not exposed in the public API. That’s [what I did for filippo.io&#x2F;mlkem768](https:&#x2F;&#x2F;github.com&#x2F;FiloSottile&#x2F;mlkem768&#x2F;compare&#x2F;55afeac9504dbb4df06844821b0a33ad8c301879...859a9b3f2ff665591a5b659d55aaf0b4111dc171?ref&#x3D;words.filippo.io) and probably what we will do for the Go standard library. We will also ensure that the test vectors in [CCTV](https:&#x2F;&#x2F;c2sp.org&#x2F;CCTV&#x2F;ML-KEM?ref&#x3D;words.filippo.io) and [Wycheproof](https:&#x2F;&#x2F;github.com&#x2F;C2SP&#x2F;wycheproof?ref&#x3D;words.filippo.io) don’t require it (i.e. that they provide seeds as inputs). This will make it hard or impossible to test issues that require malformed decapsulation keys _but that’s the point_: if you don’t expose the API you don’t need to test its failure cases. All other vectors should be reproducible by bruteforcing seeds.[\[5\]](#fn5)

If you got this far, you might also want to follow me on Bluesky at [@filippo.abyssdomain.expert](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;filippo.abyssdomain.expert?ref&#x3D;words.filippo.io) or on Mastodon at [@filippo@abyssdomain.expert](https:&#x2F;&#x2F;abyssdomain.expert&#x2F;@filippo?ref&#x3D;words.filippo.io).

## The picture

In Madeira there is this incredible forest, [Fanal](https:&#x2F;&#x2F;visitmadeira.com&#x2F;en&#x2F;what-to-do&#x2F;nature-seekers&#x2F;laurissilva-forest&#x2F;fanal&#x2F;?ref&#x3D;words.filippo.io), full of centenary twisty trees in a mysterious eery atmosphere. One of a few places, along with Barcelona, that are best experienced with the fog. (I grew up in the Padan Plain, and was recently almost ran over by a pack of spooked cows in the thick fog driving a motorcycle up the Matese Apennines, don’t @ me about fog.)

![A group of gnarled, moss-covered trees with thick trunks and twisted branches standing on a foggy, green field, creating a mysterious and enchanting atmosphere.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s1MLNZji70PBqQPLz-VoEZaKp8mPMN3_5TSq33xPGllg&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;06&#x2F;IMG_6590.jpeg)

All this work is funded by the awesome [Geomys](https:&#x2F;&#x2F;geomys.org&#x2F;?ref&#x3D;words.filippo.io) clients: [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io), [Interchain](https:&#x2F;&#x2F;interchain.io&#x2F;?ref&#x3D;words.filippo.io), [Smallstep](https:&#x2F;&#x2F;smallstep.com&#x2F;?ref&#x3D;words.filippo.io), [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), [Teleport](https:&#x2F;&#x2F;goteleport.com&#x2F;?ref&#x3D;words.filippo.io), [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io), [Charm](https:&#x2F;&#x2F;charm.sh&#x2F;?ref&#x3D;words.filippo.io), and [Tailscale](https:&#x2F;&#x2F;tailscale.com&#x2F;?ref&#x3D;words.filippo.io). Through our retainer contracts they ensure the sustainability and reliability of our open source maintenance work and get a direct line to my expertise and that of the other Geomys maintainers. (Learn more in the [Geomys announcement](https:&#x2F;&#x2F;words.filippo.io&#x2F;geomys).)

Here are a few words from some of them!

Latacora — [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io) bootstraps security practices for startups. Instead of wasting your time trying to hire a security person who is good at everything from Android security to AWS IAM strategies to SOC2 and apparently has the time to answer all your security questionnaires plus never gets sick or takes a day off, you hire us. We provide a crack team of professionals prepped with processes and power tools, coupling individual security capabilities with strategic program management and tactical project management.

Teleport — For the past five years, attacks and compromises have been shifting from traditional malware and security breaches to identifying and compromising valid user accounts and credentials with social engineering, credential theft, or phishing. [Teleport Identity Governance &amp; Security](https:&#x2F;&#x2F;goteleport.com&#x2F;identity-governance-security&#x2F;?utm&#x3D;filippo&amp;ref&#x3D;words.filippo.io) is designed to eliminate weak access patterns through access monitoring, minimize attack surface with access requests, and purge unused permissions via mandatory access reviews.

Ava Labs — We at [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), maintainer of [AvalancheGo](https:&#x2F;&#x2F;github.com&#x2F;ava-labs&#x2F;avalanchego?ref&#x3D;words.filippo.io) (the most widely used client for interacting with the [Avalanche Network](https:&#x2F;&#x2F;www.avax.network&#x2F;?ref&#x3D;words.filippo.io)), believe the sustainable maintenance and development of open source cryptographic protocols is critical to the broad adoption of blockchain technology. We are proud to support this necessary and impactful work through our ongoing sponsorship of Filippo and his team.

SandboxAQ — [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io)’s [AQtive Guard](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;solutions&#x2F;aqtive-guard?ref&#x3D;words.filippo.io) is a unified cryptographic management software platform that helps protect sensitive data and ensures compliance with authorities and customers. It provides a full range of capabilities to achieve cryptographic agility, acting as an essential cryptography inventory and data aggregation platform that applies current and future standardization organizations mandates. AQtive Guard automatically analyzes and reports on your cryptographic security posture and policy management, enabling your team to deploy and enforce new protocols, including quantum-resistant cryptography, without re-writing code or modifying your IT infrastructure.

Charm — Have you ever created an image of your code or terminal output from your terminal? This little command line tool makes it easy ❄️ 📸 [https:&#x2F;&#x2F;github.com&#x2F;charmbracelet&#x2F;freeze](https:&#x2F;&#x2F;github.com&#x2F;charmbracelet&#x2F;freeze?ref&#x3D;words.filippo.io)

---

1. ML-KEM, f.k.a. Kyber, is a post-quantum key exchange mechanism, which we can use alongside or in place of Elliptic Curve Diffie-Hellman to protect encrypted data from future quantum computers. [↩︎](#fnref1)
2. Expanding a seed on my M2 takes 40µs, loading 2 400 bytes over Gigabit takes 19µs. This is not a fair comparison, though: after you load the expanded key you still need to check the hash and expand the A matrix, both of which you would have done “for free” as part of expanding the seeds. [↩︎](#fnref2)
3. Unironically, maybe _the_ most important progress of cryptography engineering in the last twenty years has been transitioning to specifying APIs in terms of bytes. Everything starts and ends as bytes, if you write a specification in terms of “integers modulo P” or whatever, it just means implementations will YOLO the deserialization, validation, and serialization parts of the spec. [↩︎](#fnref3)
4. X-Wing [briefly had them reversed](https:&#x2F;&#x2F;github.com&#x2F;dconnolly&#x2F;draft-connolly-cfrg-xwing-kem&#x2F;commit&#x2F;ae7e913857b95976f32879a0f6fd712b44ab0d3c?ref&#x3D;words.filippo.io), highlighting the importance of specifying all the way to bytes. [↩︎](#fnref4)
5. I strongly believe that edge cases should be either so common that they can be easily tested with random inputs (ideally &gt; 2⁻¹⁶ chance, but anything &gt; 2⁻⁴⁰ we’ll bruteforce a vector for) or so unlikely that they can be ignored and replaced with a &#x60;exit(1)&#x60; (&lt; 2⁻¹²⁰ chance). ML-KEM seems to match this ideal. [↩︎](#fnref5)