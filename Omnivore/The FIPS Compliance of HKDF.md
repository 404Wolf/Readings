---
id: 3e014b36-92c9-468d-8748-fd456d6858ba
title: The FIPS Compliance of HKDF
tags:
  - RSS
date_published: 2024-09-25 17:04:03
---

# The FIPS Compliance of HKDF
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-fips-compliance-of-hkdf-1922c1cfa5d)
[Read Original](https://words.filippo.io/dispatches/fips-hkdf/)



HKDF is an HMAC-based key-derivation function specified in RFC 5869\. It’s nice and we generally like using it. FIPS (Federal Information Processing Standards) is used generally as a moniker for the set of standards, recommendations, and guidance published by the U.S. National Institute of Standards and Technology, and more specifically for FIPS 140, the standard concerning the validation of cryptographic modules. There are a number of regulatory settings (such as FedRAMP) that require FIPS 140 compliance, and it often doesn’t let us have nice things. As of earlier this year, I decided to finally bite the bullet and [pursue a FIPS 140-3 validation](https:&#x2F;&#x2F;github.com&#x2F;golang&#x2F;go&#x2F;issues&#x2F;69536?ref&#x3D;words.filippo.io) for the Go cryptography standard library, trying to retain as many nice things as possible, so I am diving into the finer details of what’s allowed and what’s not.

The FIPS compliance of HKDF is a somewhat confusing and controversial topic, partially because the normative reference is split over at least four separate documents, but in practice it’s approved for almost any purpose.

[NIST SP 800-133 Rev. 2](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;pubs&#x2F;sp&#x2F;800&#x2F;133&#x2F;r2&#x2F;final?ref&#x3D;words.filippo.io), Recommendation for Cryptographic Key Generation, discusses in Section 6.2 the derivation of symmetric keys, and presents two categories of key-derivation methods:

1. one-step KDFs, defined in SP 800-108 for general purpose use or in SP 800-56C for use on the shared secrets produced by key-agreement schemes;[\[1\]](#fn1)
2. two-step extraction-then-expansion key-derivation procedures, defined in Section 6.3 (extraction) and SP 800-108 (expansion) for general purpose use or again in SP 800-56C for use as part of key-agreement schemes.

Here the path bifurcates, depending on whether HKDF is being used as part of a key-agreement scheme. Key agreement is defined as

&gt; A (pair-wise) key-establishment procedure in which the resultant secret keying material is a function of information contributed by both participants so that neither party can predetermine the value of the secret keying material independently of the contributions of the other party; contrast with key transport.

… essentially Diffie-Hellman.[\[2\]](#fn2) (See also [FIPS 140-3 Implementation Guidance](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;CSRC&#x2F;media&#x2F;Projects&#x2F;cryptographic-module-validation-program&#x2F;documents&#x2F;fips%20140-3&#x2F;FIPS%20140-3%20IG.pdf?ref&#x3D;words.filippo.io) D.F.)

![The dramatic crossroads meme, but both roads lead to light, one is labeled key-agreement, the other symmetric key derivation](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sIPLpe8_pI3EphAOOUXAbc_kEqyIephk43vfGbx5nAmg&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;09&#x2F;94opvv.jpg)

## HKDF as part of key-agreement

Let’s start with the key-agreement case, as it’s somewhat more straightforward.

[NIST SP 800-56C Rev. 2](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;pubs&#x2F;sp&#x2F;800&#x2F;56&#x2F;c&#x2F;r2&#x2F;final?ref&#x3D;words.filippo.io), Recommendation for Key-Derivation Methods in Key-Establishment Schemes, presents a Two-Step Key Derivation in Section 5\. As acknowledged at the bottom of Section 5.1, when instantiated with HMAC, an empty IV, and a Feedback Mode KDF for expansion, this is equivalent to HKDF.

&gt; RFC 5869 specifies a version of the above extraction-then-expansion key-derivation procedure using HMAC for both the extraction and expansion steps.

The salt can be negotiated, a fixed value, or all zeroes, like in HKDF. Using the output of one Extract step for multiple Expand operations is explicitly approved, as long as the same HMAC function is used in both.

The input key material can be concatenated with other values, a common practice with Diffie-Hellman contributions:

&gt; this Recommendation permits the use of a “hybrid” shared secret of the form Z ′ &#x3D; Z || T, a concatenation consisting of a “standard” shared secret Z that was generated during the execution of a key-establishment scheme (as currently specified in \[SP 800-56A\] or \[SP 800-56B\]) followed by an auxiliary shared secret T that has been generated using some other method

HKDF as part of key-agreement can be CAVP-tested stand-alone as “KDA HKDF Sp800-56Cr2” per IG D.F.

Note that the one-step key derivation defined in SP 800-56C is a counter-based KDF (i.e. neither HKDF-Extract nor HKDF-Expand) so it doesn’t seem to be FIPS-compliant to skip either the extract or expand step as part of key-agreement.

## HKDF as a general-purpose KDF

Until recently I was under the impression that HKDF was only allowed as part of key-agreement. That’s not the case!

### HKDF-Expand as a SP 800-108 KDF

HKDF-Expand on its own turns out to be a mode of [NIST SP 800-108 Rev. 1 Upd. 1](https:&#x2F;&#x2F;csrc.nist.gov&#x2F;pubs&#x2F;sp&#x2F;800&#x2F;108&#x2F;r1&#x2F;upd1&#x2F;final?ref&#x3D;words.filippo.io), Recommendation for Key Derivation Using Pseudorandom Functions, which defines approved general-purpose KDFs (and is referenced by SP 800-133 above for one-step KDFs).

I initially thought that not to be the case, because the Feedback Mode KDF is defined in Section 4.2 as computing &#x60;HMAC(K_in, K(i-1) || i || FixedInfo)&#x60; while HKDF-Expand computes &#x60;HMAC(K_in, K(i-1) || info || i)&#x60;. Note the order of counter &#x60;i&#x60; and &#x60;info&#x60;. Everything else in the SP 800-108 Feedback Mode KDF could be tweaked to land at HKDF, but I found nothing in the text that allowed swapping the order.

![The Process from SP 800-108 Section 4.2](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,smoG1fstLUCcyh2OyL8gERMLoAMGrZzvJviMKQ7npxPI&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;09&#x2F;SP800.png)

However, SP 800-56C claims explicitly that HKDF is a profile of its two-step key-derivation method, and describes the expansion step simply by reference to SP 800-108!

&gt; One of the general-purpose, PRF-based key-derivation functions defined in SP 800-108 shall be used for key expansion.

To confirm this, I went looking at the [ACVP tests for SP 800-108](https:&#x2F;&#x2F;pages.nist.gov&#x2F;ACVP&#x2F;draft-celi-acvp-kbkdf.html?ref&#x3D;words.filippo.io#section-7.3.2), and indeed there’s a &#x60;fixedDataOrder&#x60; parameter which “describes where the counter appears in the fixed data” and that can be set to &#x60;&quot;after fixed data&quot;&#x60;. The relevant ACVP test vectors[\[3\]](#fn3) [pass when applied to HKDF-Expand](https:&#x2F;&#x2F;go.dev&#x2F;play&#x2F;p&#x2F;zEmD3VIHtB7?ref&#x3D;words.filippo.io), proving that it’s an approved version of SP 800-108.

Note that in order to use HKDF-Expand in the approved mode of operation for this purpose, the FIPS 140 cryptographic module will need to include the SP 800-108 Feedback KDF in its certificate.

Ok, so HKDF-Expand is a general purpose KDF, but what about HKDF-Extract?

SP 800-133 Rev. 2, published in 2020, added a new method to Section 6.3, Symmetric Keys Produced by Combining (Multiple) Keys and Other Data. The new Method 3, called “a key-extraction process” is simply &#x60;HMAC(salt, K || … || D || …)&#x60; aka HKDF-Extract!

While the other methods require multiple keys, or both a key and other data, Method 3 requires n (the number of keys) ≥ 1 and m (the other data) ≥ 0, so it’s explicitly allowed even with a single key as input. The salt can be a secret or non-secret value. Alternative orderings of keys and data are explicitly permitted.

This is confirmed by IG 2.4.B, which states “the underlying functions performed within the \[n.d.a. HKDF-based\] TLS 1.3 KDF map to NIST approved standards, namely: SP 800-133rev2 (Section 6.3 Option #3), SP 800-56Crev2, and SP 800-108”.

There is no CAVP testing or CAST requirement for SP 800-133 Section 6.3 but IG D.H requires Vendor Affirmation in the module certificate.

&gt; Vendor affirmation to SP 800-133 is required for all methods covered by Sections 4 and 6.3 of this standard; \[…\] The Security Policy shall provide the details of each method. \[…\] There is no specific CAST requirement if vendor affirmation is claimed for SP 800-133, other than the CASTs required for the underlying approved algorithms, per IG 10.3.A.

Additional Comment 4 even goes out of its way to bless Section 6.2(3).

&gt; The method of generating a key by a key-extraction process defined in item 3 of Section 6.3 of SP 800-133rev2 is new to the SP 800-133 series. This method is approved for use in the approved mode upon the publication of this Implementation Guidance.

There’s a wrinkle, though. The same IG says that at least one of the input keys must be generated from a DRBG, so it seems to me that you can’t feed the output of a KDF into HKDF-Extract as a key (unlike with SP 800-108 KDFs per Section 6 and IG D.M).

&gt; (a) At least one of the component keys K1, …, Kn is generated as shown in Section 4 of SP 800-133 with an independence requirement of Section 6.3 met, and (b) None of the component keys K1, …, Kn are generated from a password.

## Summing up

If you’re doing key-agreement you can use HKDF per SP 800-56C Rev. 2\. If you’re not you can use HKDF-Extract to combine a randomly-generated key with other keys and&#x2F;or data per SP 800-133 Rev. 2 (Section 6.3 Option #3), and use HKDF-Expand as a general purpose KDF per SP 800-108.

I should note that this makes sense, because if you have a high-quality key (as opposed to a shared secret, in which case SP 800-56C applies) you can generally skip the Extract step and go straight to the SP 800-108 use. If you want to combine multiple keys, or keys and other data, you’ll want to do Extract, and that’s what SP 800-133 Section 6.3 covers.

Keep in mind that using approved algorithms is only half the battle, since FIPS 140 compliance also requires using a module that was validated for those algorithms. The [planned Go FIPS module](https:&#x2F;&#x2F;github.com&#x2F;golang&#x2F;go&#x2F;issues&#x2F;69536?ref&#x3D;words.filippo.io) will test HKDF as both SP 800-56Crev2 and SP 800-133, and will Vendor Affirm SP 800-133rev2 support, making it usable everywhere possible.

If you’d like to sponsor the effort to validate the Go standard library (and produce these 1500 words articles), [reach out](https:&#x2F;&#x2F;filippo.io&#x2F;?ref&#x3D;words.filippo.io)! If you’d like to follow along as I descend into madness, follow me on Bluesky at [@filippo.abyssdomain.expert](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;filippo.abyssdomain.expert?ref&#x3D;words.filippo.io) or on Mastodon at [@filippo@abyssdomain.expert](https:&#x2F;&#x2F;abyssdomain.expert&#x2F;@filippo?ref&#x3D;words.filippo.io).

## The picture

Some of us don’t go to IKEA for the nordic furniture that comes with an assembling minigame, but for the extremely huggable stuffed BLÅHAJ sharks. There were rumors of them being discontinued a couple years ago, so I acquired a small strategic reserve. Here you can see them discussing their future deployments.

![Five blue and white stuffed sharks, sitting on the back of a white sofa. They are all in slightly different poses and look like they are hanging out.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,stnSOtnubhwzQByPQ04tw56s5hZMSBofnoWTxvavso84&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;06&#x2F;IMG_3761.jpeg)

My maintenance work is funded by the awesome [Geomys](https:&#x2F;&#x2F;geomys.org&#x2F;?ref&#x3D;words.filippo.io) clients: [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io), [Interchain](https:&#x2F;&#x2F;interchain.io&#x2F;?ref&#x3D;words.filippo.io), [Smallstep](https:&#x2F;&#x2F;smallstep.com&#x2F;?ref&#x3D;words.filippo.io), [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), [Teleport](https:&#x2F;&#x2F;goteleport.com&#x2F;?ref&#x3D;words.filippo.io), [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io), [Charm](https:&#x2F;&#x2F;charm.sh&#x2F;?ref&#x3D;words.filippo.io), and [Tailscale](https:&#x2F;&#x2F;tailscale.com&#x2F;?ref&#x3D;words.filippo.io). Through our retainer contracts they ensure the sustainability and reliability of our open source maintenance work and get a direct line to my expertise and that of the other Geomys maintainers. (Learn more in the [Geomys announcement](https:&#x2F;&#x2F;words.filippo.io&#x2F;geomys).)

Here are a few words from some of them!

Latacora — [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io) bootstraps security practices for startups. Instead of wasting your time trying to hire a security person who is good at everything from Android security to AWS IAM strategies to SOC2 and apparently has the time to answer all your security questionnaires plus never gets sick or takes a day off, you hire us. We provide a crack team of professionals prepped with processes and power tools, coupling individual security capabilities with strategic program management and tactical project management.

Teleport — For the past five years, attacks and compromises have been shifting from traditional malware and security breaches to identifying and compromising valid user accounts and credentials with social engineering, credential theft, or phishing. [Teleport Identity Governance &amp; Security](https:&#x2F;&#x2F;goteleport.com&#x2F;identity-governance-security&#x2F;?utm&#x3D;filippo&amp;ref&#x3D;words.filippo.io) is designed to eliminate weak access patterns through access monitoring, minimize attack surface with access requests, and purge unused permissions via mandatory access reviews.

Ava Labs — We at [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), maintainer of [AvalancheGo](https:&#x2F;&#x2F;github.com&#x2F;ava-labs&#x2F;avalanchego?ref&#x3D;words.filippo.io) (the most widely used client for interacting with the [Avalanche Network](https:&#x2F;&#x2F;www.avax.network&#x2F;?ref&#x3D;words.filippo.io)), believe the sustainable maintenance and development of open source cryptographic protocols is critical to the broad adoption of blockchain technology. We are proud to support this necessary and impactful work through our ongoing sponsorship of Filippo and his team.

SandboxAQ — [SandboxAQ](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;?ref&#x3D;words.filippo.io)’s [AQtive Guard](https:&#x2F;&#x2F;www.sandboxaq.com&#x2F;solutions&#x2F;aqtive-guard?ref&#x3D;words.filippo.io) is a unified cryptographic management software platform that helps protect sensitive data and ensures compliance with authorities and customers. It provides a full range of capabilities to achieve cryptographic agility, acting as an essential cryptography inventory and data aggregation platform that applies current and future standardization organizations mandates. AQtive Guard automatically analyzes and reports on your cryptographic security posture and policy management, enabling your team to deploy and enforce new protocols, including quantum-resistant cryptography, without re-writing code or modifying your IT infrastructure.

Charm — If you’re a terminal lover, join the club. [Charm](https:&#x2F;&#x2F;charm.sh&#x2F;?ref&#x3D;words.filippo.io) builds tools and libraries for the command line. Everything from styling terminal apps with [Lip Gloss](https:&#x2F;&#x2F;github.com&#x2F;charmbracelet&#x2F;lipgloss?ref&#x3D;words.filippo.io) to making your shell scripts interactive with [Gum](https:&#x2F;&#x2F;github.com&#x2F;charmbracelet&#x2F;gum?ref&#x3D;words.filippo.io). Charm builds libraries in Go to enhance CLI applications while building with these libraries to deliver CLI and TUI-based apps.

---

1. I’m omitting for simplicity SP 800-135 KDFs which are protocol-specific, and SP 800-132 password-based KDFs. They are not relevant to HKDF. [↩︎](#fnref1)
2. Is a KEM like ML-KEM key-agreement or key-transport? Hard to tell! FIPS 203 says “If further key derivation is needed, the final symmetric keys shall be derived from this 256-bit shared secret key in an approved manner, as specified in SP 800-108 and SP 800-56C.” so it sounds like it’s a secret third thing and you can consider it both? We will probably need to wait for SP 800-227, Recommendations for key-encapsulation mechanisms, to get a final answer. [↩︎](#fnref2)
3. One more mystery, [https:&#x2F;&#x2F;github.com&#x2F;usnistgov&#x2F;ACVP-Server&#x2F;tree&#x2F;master&#x2F;gen-val&#x2F;json-files](https:&#x2F;&#x2F;github.com&#x2F;usnistgov&#x2F;ACVP-Server&#x2F;tree&#x2F;master&#x2F;gen-val&#x2F;json-files?ref&#x3D;words.filippo.io) has both &#x60;KDA-HKDF-Sp800-56Cr1&#x60;&#x2F;&#x60;KDA-HKDF-Sp800-56Cr2&#x60; (for SP 800-56C), &#x60;KDF 1.0&#x60; (for SP 800-108), and &#x60;HKDF-1.0&#x60; (for ???????). No idea what the last one is about. [↩︎](#fnref3)