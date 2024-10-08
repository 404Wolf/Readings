---
id: da93ab5c-f472-11ee-b813-137dffd88b6b
title: My Maintenance Policy
tags:
  - RSS
date_published: 2024-04-06 17:07:38
---

# My Maintenance Policy
#Omnivore

[Read on Omnivore](https://omnivore.app/me/my-maintenance-policy-18eb5e1da3e)
[Read Original](https://words.filippo.io/dispatches/maintenance-policy/)



I wrote a short document describing how I maintain open source projects, to link it from my global &#x60;CODE_OF_CONDUCT&#x60;, &#x60;CONTRIBUTING&#x60;, and &#x60;SECURITY&#x60; files. It talks about how I prefer issues to PRs, how I work in batches, and how I&#39;m trigger-happy with bans. It&#39;s all about setting expectations.

It got some unexpected attention, so I&#39;m sharing it with my Maintainer Dispatches subscribers. Feedback welcome! (As a reminder, if you&#39;re only here for the cryptography topics, there&#39;s a one-click Unsubscribe link at the bottom of the email that lets you choose which issues to receive.)

## Filippo&#39;s open source maintenance policy

This policy explains how I work on my open source projects, what you should expect from me as a maintainer, and how to contribute.

You can always find the latest version of this document at [filippo.io&#x2F;maintenance](https:&#x2F;&#x2F;filippo.io&#x2F;maintenance?ref&#x3D;words.filippo.io).

### I work in cycles

I work on a number of codebases, and the way to apportion attention that works best with my brain is to batch up work, focus on a project for one to four weeks, and then move to a different project. This reduces context switching overhead and gives me time to consider overall trends.

This means there might be extended periods during which I am not actively working on a specific project. This does NOT mean the project is unmaintained: I still _read_ every issue filed, and would react promptly to urgent issues, such as security reports or any breakage that makes a project not work anymore for its _current_ users.

If a project is unmaintained, it will be either archived or moved to [FiloSottile&#x2F;mostly-harmless](https:&#x2F;&#x2F;github.com&#x2F;FiloSottile&#x2F;mostly-harmless?ref&#x3D;words.filippo.io).

### Projects have a precise scope

Most of my projects are meant to be simple solutions to a specific problem, and I generally try to resist scope creep.

I understand that might make them not a good fit for you, and that’s ok. Feel free to open a discussion or a feature request, but please understand if we conclude that the issue is out of scope. Forks are welcome!

This is critical both to keep the UX simple, and to keep the maintenance burden manageable.

### Well researched issues are gold

The most useful contributions are detailed issue reports. The more you can tell us about environment and expectations the better. I truly appreciate when users investigate further, or do the work of checking how other implementations behave, or what the relevant specifications say.

Even if you can’t do the extra work, feel free to open an issue. I don’t resent any issue, they’re all gifts (but as gifts they don’t entitle you to a response).

### Experience reports are gems

Even if something might look like it’s working as intended, or if you’re encountering a non-technical issue, I invite you to file an experience report.

It can be as simple as “this error was confusing, even if I figured it out” or as high-level as “getting started was a mess, here are all the things I tried” or as specific as “when I try to use this for this workflow it’s very clunky”.

Focus on your experience, not on the solution. Oftentimes the solution will need to take into account the needs of other stakeholders, or solve multiple issues at once, but having a clear idea of a problem is the first step.

Maybe we will conclude there’s nothing we can do within the project’s scope (see above), but every experience report informs how I think about the project.

If you want to contribute but don’t know where to start, try to use the project from scratch keeping a friction log of all the things that you found confusing or difficult or unclear, and then share that.

### PRs might get reimplemented

Unlike some projects, I _do not_ prefer PRs to issues, for a number of reasons.

* Working in batches (see above) means you might have to wait a while before I review a PR, and you might have moved on to other work by then.
* I don’t have the bandwidth for long review cycles, but I am also very particular about the code I accept into a project, since it will be on me to maintain it.
* Cryptography and security projects require an unusually high degree of code review.
* Contributors naturally focus on their use case and circumstances when writing patches, which might need to be adapted to serve other project users.
* I am generally not trying to build large contributor communities around most of my projects, as they are small scoped tools (see above).

All together, this means that detailed issues are usually more useful to me than PRs, and while you’re welcome to open a PR as a way to demonstrate an issue, **you should expect it to be reimplemented rather than merged**. Please don’t take this personally. I try to use &#x60;Co-authored-by&#x60; lines liberally to share credit where possible.

There are some exceptions, like support for operating systems I am not familiar with, or features I am not well-equipped to implement. We can discuss those cases in the issue tracker. I am also usually happy to merge trivial&#x2F;short changes.

### Funding

I’m a [professional Open Source maintainer](https:&#x2F;&#x2F;words.filippo.io&#x2F;professional-maintainers&#x2F;). If your company might be interested in enabling my work, in the [reciprocal value of a direct line to a maintainer](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;reciprocal&#x2F;), and in unlimited access to my expertise, reach out to discuss a retainer! 📨

_I believe the critical role of open source maintainer can develop into a real profession, commanding compensation in line with that of a senior software engineer, charging companies that rely on open source projects and wish to get access to the maintainer&#39;s unique and extensive expertise._

**I don&#39;t rely on crowdfunding for sustainability, so I generally don&#39;t solicit donations from individuals**. If you wish to express gratitude or encourage my work, send me a postcard! 📮

&gt; Filippo Valsorda  
&gt; 9450 SW Gemini Dr #52960  
&gt; Beaverton, Oregon 97008-7105  
&gt; USA

### Conduct

Most of my projects don’t have a formal code of conduct, but I uphold the values of the [Go Community Code of Conduct](https:&#x2F;&#x2F;go.dev&#x2F;conduct?ref&#x3D;words.filippo.io) and I have a zero-tolerance policy for toxic behavior.

Comments that create an unwelcoming environment will lead to a ban. This is my garden, you can go be a jerk elsewhere.

### Security

Please email me privately at [security@filippo.io](mailto:security@filippo.io) to report a potential security issue. If you’re not sure if something is a security issue, reach out! You should expect a reply within a week, usually much quicker.

I am happy with standard ninety days disclosure timelines, or with embargoes no longer than nine months. I will produce security advisories and file CVEs for any issue I consider a security issue.

I know projects are not entitled to free security research or coordinated disclosure, and I appreciate the contribution of reporters. I do not offer bug bounties at this time.

#### On security scanners

I _do not_ update dependencies just to silence automated reports of unrelated vulnerabilities that don&#39;t affect my project. (Nor do I subscribe to the endless dependabot churn, although my opinions about the benefits of that are more nuanced.)

Using automated tools that fail to do even package-level scoping and then pushing the churn onto every upstream project to reduce noise is unsustainable. My responsibility is making sure my projects are not affected by security vulnerabilities. The responsibility of scanning tools is making sure they don&#39;t disturb their users with false positives.

[govulncheck](https:&#x2F;&#x2F;pkg.go.dev&#x2F;golang.org&#x2F;x&#x2F;vuln&#x2F;cmd&#x2F;govulncheck?ref&#x3D;words.filippo.io) is awesome and even does static analysis to filter vulnerabilities at the symbol level, but simple package-level filtering is something you should demand of your vendors.

## The picture

That&#39;s it for the policy. But if I don&#39;t include a picture I found people complain, which I love to be honest. If you got this far, you might also want to follow me on Bluesky (now open for registration!) at [@filippo.abyssdomain.expert](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;filippo.abyssdomain.expert?ref&#x3D;words.filippo.io) or on Mastodon at [@filippo@abyssdomain.expert](https:&#x2F;&#x2F;abyssdomain.expert&#x2F;@filippo?ref&#x3D;words.filippo.io).

One perk of Milan (which can&#39;t compete with Rome, but still) is that when I&#39;m rushing up a stairwell to catch a train, _this_ is the stairwell.

![A vertical shot of a stairwell from the bottom. Everything is white marble. Golden handrails. At the top of the stairs just the roof is visible: tall arches with glass portions and hanging chandeliers.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,szZ7WIbIzYnh6t42VQkVVZqzqcyOq4yYpePaJ9_i8_58&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;04&#x2F;IMG_7909-1.jpeg)

My awesome clients—[Sigsum](https:&#x2F;&#x2F;www.sigsum.org&#x2F;?ref&#x3D;words.filippo.io), [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io), [Interchain](https:&#x2F;&#x2F;interchain.io&#x2F;?ref&#x3D;words.filippo.io), [Smallstep](https:&#x2F;&#x2F;smallstep.com&#x2F;?ref&#x3D;words.filippo.io), [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), [Teleport](https:&#x2F;&#x2F;goteleport.com&#x2F;?ref&#x3D;words.filippo.io), and [Tailscale](https:&#x2F;&#x2F;tailscale.com&#x2F;?ref&#x3D;words.filippo.io)—are funding all my work for the community and through our retainer contracts they get face time and unlimited access to advice on Go and cryptography.

Here are a few words from some of them!

Latacora — [Latacora](https:&#x2F;&#x2F;www.latacora.com&#x2F;?ref&#x3D;words.filippo.io) bootstraps security practices for startups. Instead of wasting your time trying to hire a security person who is good at everything from Android security to AWS IAM strategies to SOC2 and apparently has the time to answer all your security questionnaires plus never gets sick or takes a day off, you hire us. We provide a crack team of professionals prepped with processes and power tools, coupling individual security capabilities with strategic program management and tactical project management.

Teleport — For the past five years, attacks and compromises have been shifting from traditional malware and security breaches to identifying and compromising valid user accounts and credentials with social engineering, credential theft, or phishing. [Teleport Identity Governance &amp; Security](https:&#x2F;&#x2F;goteleport.com&#x2F;identity-governance-security&#x2F;?utm&#x3D;filippo&amp;ref&#x3D;words.filippo.io) is designed to eliminate weak access patterns through access monitoring, minimize attack surface with access requests, and purge unused permissions via mandatory access reviews.

Ava Labs — We at [Ava Labs](https:&#x2F;&#x2F;www.avalabs.org&#x2F;?ref&#x3D;words.filippo.io), maintainer of [AvalancheGo](https:&#x2F;&#x2F;github.com&#x2F;ava-labs&#x2F;avalanchego?ref&#x3D;words.filippo.io) (the most widely used client for interacting with the [Avalanche Network](https:&#x2F;&#x2F;www.avax.network&#x2F;?ref&#x3D;words.filippo.io)), believe the sustainable maintenance and development of open source cryptographic protocols is critical to the broad adoption of blockchain technology. We are proud to support this necessary and impactful work through our ongoing sponsorship of Filippo and his team.