---
id: d3f9adb2-5f4c-4d55-949c-f9840751c24a
title: Geomys, a blueprint for a sustainable open source maintenance firm
tags:
  - RSS
date_published: 2024-07-08 11:05:20
---

# Geomys, a blueprint for a sustainable open source maintenance firm
#Omnivore

[Read on Omnivore](https://omnivore.app/me/geomys-a-blueprint-for-a-sustainable-open-source-maintenance-fir-190933073d1)
[Read Original](https://words.filippo.io/dispatches/geomys/)



In 2022, I left Google in search of a sustainable approach to open source maintenance. A year later, I was a [full-time independent professional open source maintainer](https:&#x2F;&#x2F;words.filippo.io&#x2F;full-time-maintainer&#x2F;). Today I’m announcing the natural progression of that experiment: Geomys,[\[1\]](#fn1) a small firm of professional maintainers with a portfolio of critical Go projects.

I’m joined by **[Nicola Murino](https:&#x2F;&#x2F;github.com&#x2F;drakkan?ref&#x3D;words.filippo.io)**, who&#39;s been maintaining [golang.org&#x2F;x&#x2F;crypto&#x2F;ssh](https:&#x2F;&#x2F;pkg.go.dev&#x2F;golang.org&#x2F;x&#x2F;crypto&#x2F;ssh?ref&#x3D;words.filippo.io) for us since last summer[\[2\]](#fn2), and by **[Dominik Honnef](https:&#x2F;&#x2F;honnef.co&#x2F;?ref&#x3D;words.filippo.io)**, the maintainer of [Staticcheck](https:&#x2F;&#x2F;staticcheck.dev&#x2F;?ref&#x3D;words.filippo.io) and [Gotraceui](https:&#x2F;&#x2F;gotraceui.dev&#x2F;?ref&#x3D;words.filippo.io). They are now Geomys’ first ✨ _Associate Maintainers_. ✨ The team is completed by **Matilde Dal Zilio**, our Administrative Director who&#39;s been helping make this journey possible from the beginning.

![The Geomys logo, an ink outline of a quaint Italian town on the side of a mountain, and below it a narrow paragraph styled like a dictionary entry for Geomys, with two definitions: 1 (Sci.) a genus of mammals often collectively referred to as the eastern pocket gophers; and 2 an organization of open source maintainers.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sqkXWPpS5P60ttXVEI0Jn0y57dp5IL-ax_SO0f6fHsmw&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;07&#x2F;geomys_base_positivo-copy-2.png) 

Geomys launches with a robust portfolio of popular, foundational open-source Go projects:

* the &#x60;crypto&#x2F;...&#x60; and &#x60;golang.org&#x2F;x&#x2F;crypto&#x2F;...&#x60; packages in the Go standard library, co-maintained by me and the Google Go team
* the &#x60;filippo.io&#x2F;...&#x60; crypto packages, including [filippo.io&#x2F;edwards25519](https:&#x2F;&#x2F;filippo.io&#x2F;edwards25519?ref&#x3D;words.filippo.io)
* [x&#x2F;crypto&#x2F;ssh](https:&#x2F;&#x2F;pkg.go.dev&#x2F;golang.org&#x2F;x&#x2F;crypto&#x2F;ssh?ref&#x3D;words.filippo.io), the Go SSH implementation that runs many CI and deployment systems, maintained by Nicola
* [Staticcheck](https:&#x2F;&#x2F;staticcheck.dev&#x2F;?ref&#x3D;words.filippo.io), the high-signal low-noise static analyzer enabled by default in [vscode-go](https:&#x2F;&#x2F;github.com&#x2F;golang&#x2F;vscode-go&#x2F;wiki&#x2F;tools?ref&#x3D;words.filippo.io#staticcheck), maintained by Dominik
* [Gotraceui](https:&#x2F;&#x2F;gotraceui.dev&#x2F;?ref&#x3D;words.filippo.io), a tool for visualizing and analyzing Go execution traces, maintained by Dominik
* [bluemonday](https:&#x2F;&#x2F;github.com&#x2F;microcosm-cc&#x2F;bluemonday?ref&#x3D;words.filippo.io), the popular HTML sanitizer[\[3\]](#fn3)
* [age](https:&#x2F;&#x2F;age-encryption.org&#x2F;?ref&#x3D;words.filippo.io), the file encryption tool, library, and format
* [mkcert](https:&#x2F;&#x2F;mkcert.dev&#x2F;?ref&#x3D;words.filippo.io), a tool to generate local development certificates

Every company that was previously a client of mine is now a Geomys client, paying the same monthly retainer for the professional maintenance of their critical dependencies, and for direct access to the expertise of maintainers. What’s changed is that they are now supporting more projects, and have access to more maintainers.

![The logos of Geomys’ first clients: Latacora, Interchain, Smallstep, Ava Labs, Teleport, SandboxAQ, Tailscale, and Charm](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sSROs4G75ESYGgJMebIzLMF1IZVmpEh69rIJf1gHXjzg&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;07&#x2F;logos-2024-1-.png)

## How we got here

I started with a rather non-consensus hypothesis: companies _want_ to pay for their critical open source dependencies, but most projects are not selling them a legible way to do so. The last year has shown I was definitely onto something: I have signed four more major clients, and lost only one.[\[4\]](#fn4)

The model and pitch also came into clearer focus. Truly, it’s simple: if you’re betting your business on a critical open source technology, you

1. want it to be sustainably and predictably maintained; and
2. need occasional access to expertise that would be blisteringly expensive to acquire and retain.[\[5\]](#fn5)

Getting maintainers on retainer solves both problems for a fraction of the cost of a fully-loaded full-time engineer. From the maintainers’ point of view, it’s steady income to keep doing what they do best, and to join one more Slack Connect channel to answer high-leverage questions. It’s a great deal for both sides.

There were more lessons learned, which can be summarized as “yup, these are enterprise sales, checks out”, and “advisor is a better word than consultant but still not perfect”, and “we sorely need to build standard contract language”. I will write these up soon, but if you’re impatient you can watch [my recent FOSDEM talk](https:&#x2F;&#x2F;fosdem.org&#x2F;2024&#x2F;schedule&#x2F;event&#x2F;fosdem-2024-2000-maintaining-go-as-a-day-job-a-year-later&#x2F;?ref&#x3D;words.filippo.io).

Still, even if the path may look straightforward in hindsight, it’s a new model and materializing it has been a challenge. I am incredibly grateful to my clients for believing in it and for making it work with me.

## What next

Now, where do we go from here? How do I help this grow?

One way is by making it easier to do what I did, so that others can replicate it. Part of the point of doing it myself was clearing a path and making the life of future professional maintainers easier. That’s still part of the plan, but for “open source maintainer” to graduate to a mature profession, it needs to also be accessible to folks who can’t or don’t want to take on that risk, uncertainty, and extra workload.

From the onset, I envisioned small firms of professional maintainers with thematic portfolios, accommodating diverse maintainers and project sizes, just like the specialized firms of other professionals. I am now ready to try and build one.

I can tell you when I made up my mind, actually. It was with this message from a client:

&gt; I noticed that there are two critical Go projects that we (and many others) rely on are not very actively maintained. \[…\] Do you have any interest to become owners&#x2F;co-maintainers of these projects? We&#39;d be interested in sponsoring the maintenance, security audit, and hardening of those projects.

They trust us to maintain open source projects as a reliable team of professionals, and they understand the importance of keeping their critical dependencies healthy, so they want us to get involved in more. That&#39;s what we&#39;ll do.[\[6\]](#fn6)

## Geomys

Alright, so how does Geomys work?

Clients still pay a fixed monthly retainer to ensure the professional maintenance of the whole portfolio, and to get access to the expertise of all of Geomys’ maintainers. It’s a package deal because in my experience it’s nearly impossible to rigorously apportion value to specific projects, and it would slow down the sales process. Also, it risks penalizing smaller projects, and I want every project in the Geomys portfolio to be sustainably funded. Instead, clients just have to decide if the portfolio as a whole is worth the sticker price.

Associate Maintainers get a stable, guaranteed income—significantly higher than what GitHub Sponsors generates—and a cut of future retainer revenue growth. There’s no formula, we negotiate and figure out numbers that make the Associate happy and that are sustainable for Geomys, based on the project and on how much time the maintainer wants to dedicate to them. I expect the percentage value of the revenue share to go down over the years, rewarding those who take the most risk by joining early.

The expectations of Associates are primarily to keep doing what they’re doing: they are already experienced maintainers who know how to keep their projects healthy, now with the freedom and peace of mind of sustainably dedicating proper part-time or full-time attention to them. We want them to work on their schedule, and in their own way. I don’t wish to micromanage anyone, nor would I be particularly good at it. I like to think of Geomys as enabling maintainers to do what they already do well.

We only ask that they join the Geomys Slack Connect channels of interested clients, and ideally that they work with our technical writer to publish the occasional article about what they’re up to. Geomys is not meant to overshadow the Associates’ profiles. Quite the opposite: its brand is as strong as the combination of those of all its maintainers.

Speaking of technical writers, Geomys covers and consolidates the cost of support staff, providing maintainers access to resources that would be hard to justify if working solo. Administration, legal, comms, and importantly, the sales process are all handled as a unit.

No copyright assignment. No locked in term. No GitHub ownership transfer. If we decide it’s not working, we go our own ways. Who knows, maybe one day our associates will spawn their own firms, like it happened with early information security consultancies.

We’ll grow slowly and organically, by recruiting Associate Maintainers when it makes sense (and we can sustainably afford it) and by adopting projects that are a good fit for the portfolio theme. We are taking no investments: this is all financed by my existing cash flow. Don’t get me wrong, I think this is going to make me money in the long term: as we grow we’ll appeal to more and more clients, and the marginal effort required by each client is sub-linear. However, Geomys will probably never be a unicorn, and after cutting in Associates I doubt I’ll get startup-founder rich. That’s ok, that was never the goal.

Speaking of which, Geomys will always focus on Go. It’s not aiming to become _Open Source Maintainers, Inc._, a one-stop shop for maintenance services, just like you largely don’t go to _Lawyers, Inc._ for all your tax, immigration, criminal, and human rights law needs. That ensures our portfolio is highly relevant to our clients, and avoids diluting access too much: having an account manager join your Slack is not the same thing as having the actual maintainers. It also lets us concentrate on what we are all actually experts in. I hope others will set up similar firms in other ecosystems, and I will be here to help them however I can.

We’re just getting started and we’re still learning, so I expect things will change as we get more experience. Whatever final form it will take, I believe this is another step down the road of making “open source maintainer” a mature profession, and I’m really excited to find out where it leads.

You can follow along by [subscribing to Maintainer Dispatches](https:&#x2F;&#x2F;filippo.io&#x2F;newsletter?ref&#x3D;words.filippo.io), which will soon become Geomys Dispatches. You can also follow us [on Bluesky at @geomys.org](https:&#x2F;&#x2F;bsky.app&#x2F;profile&#x2F;geomys.org?ref&#x3D;words.filippo.io) or [on Mastodon at @geomys@abyssdomain.expert](https:&#x2F;&#x2F;abyssdomain.expert&#x2F;@geomys?ref&#x3D;words.filippo.io). If you want to reach out, you can email the hi@ alias of geomys.org.

## The picture

The plan for Geomys came together while I was driving the [Centopassi](https:&#x2F;&#x2F;www.centopassi.net&#x2F;?ref&#x3D;words.filippo.io), the 1600km-in-three-days motorcycle competition [I told you about in the last Cryptography Dispatches issue](https:&#x2F;&#x2F;words.filippo.io&#x2F;dispatches&#x2F;xaes-256-gcm&#x2F;#the-picture). The intercom battery had ran out, so I was alone with my thoughts for a couple hours.[\[7\]](#fn7) This is the view that opened up right after that stretch of mountain roads. (Also, the Geomys logo is inspired by a different town we passed at the beginning of that segment!)

![View of an Italian hillside town overlooking a lake. Clouds and sunlight play across the sky, casting dynamic shadows on green mountains. White and brown buildings cascade down the slope, contrasting with the lush vegetation and blue water below.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,speaO_-47VuluiUjqeobEVymj63Qya3ejfWfi2IoeqnM&#x2F;https:&#x2F;&#x2F;words.filippo.io&#x2F;content&#x2F;images&#x2F;2024&#x2F;06&#x2F;PXL_20240531_162125334.jpeg)

---

1. It’s the scientific name of [a genus of gophers](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Geomys?ref&#x3D;words.filippo.io)! [↩︎](#fnref1)
2. Nicola’s work on x&#x2F;crypto&#x2F;ssh has been a success, both for the project and for the business, even before Geomys was on the radar. We’ll talk about what he’s been up to soon. [↩︎](#fnref2)
3. This is news, too! We inherited it from the original author, who was ready to move on after serving the community for ten years. I volunteered to take over before I ever even thought of Geomys, because of how critical the package is in the Go ecosystem, but it’s a perfect fit for the portfolio. For now I am responsible for it, but we’re working to engage the perfect longer-term maintainer. More on this soon! [↩︎](#fnref3)
4. It didn’t even have anything to do with the services, we worked together very well for as long as practical, and parted on great terms. I would _not_ have bet on such a low churn rate. Since this is a footnote I feel safe enough to say that despite knowing things were working out and clients looked happy, there were days I kinda braced for everyone to cancel at the one-year mark or something. [↩︎](#fnref4)
5. Imagine you want to build specialized expertise in the functioning of an open source project internally. Even assuming you have enough interesting work to recruit and retain the right people, you will need to hire at least two Senior Software Engineers, or you lose all institutional knowledge as soon as one leaves. Really, to avoid refocusing on hiring upon a departure, you need three. You’re looking at north of a million dollars per year, fully loaded. It’s a classic build vs. buy. When you frame it like that, my contracts are _cheap_. [↩︎](#fnref5)
6. We’re not ready to announce our plans for those projects, but we are talking with industry experts to rewrite part of them, to improve security and reduce the maintenance burden, and will reach out to the current owners to figure out next steps. It will make for an excellent case study and hopefully we’ll get to write about it! (That makes it four promised upcoming topics. I know. Don’t worry, the technical writer starts on the 15th.) [↩︎](#fnref6)
7. Or, rather, my teammate Harry decided I needed some time to think, and told me the intercom was still charging. He was spot on. [↩︎](#fnref7)