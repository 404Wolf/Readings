---
id: e25ae27a-0277-11ef-bde3-83d44ee5bc32
title: Model UX Research & Design Docs for Command-Line Open Source | Cogito, Ergo Sumana
tags:
  - RSS
date_published: 2024-04-24 12:07:03
---

# Model UX Research & Design Docs for Command-Line Open Source | Cogito, Ergo Sumana
#Omnivore

[Read on Omnivore](https://omnivore.app/me/model-ux-research-design-docs-for-command-line-open-source-cogit-18f11c2f06a)
[Read Original](https://www.harihareswara.net/posts/2024/model-ux-research-design-docs-for-command-line-open-source/)



Blog by **_Sumana Harihareswara_**, Changeset founder

24 Apr 2024, 11:42 a.m. 

Model UX Research &amp; Design Docs for Command-Line Open Source

* [Work](https:&#x2F;&#x2F;www.harihareswara.net&#x2F;posts&#x2F;work)
* [Python](https:&#x2F;&#x2F;www.harihareswara.net&#x2F;posts&#x2F;python)
* [Maintainership book](https:&#x2F;&#x2F;www.harihareswara.net&#x2F;posts&#x2F;maintainership-book)
* [Advice](https:&#x2F;&#x2F;www.harihareswara.net&#x2F;posts&#x2F;advice)
* [maintainers](https:&#x2F;&#x2F;www.harihareswara.net&#x2F;posts&#x2F;maintainers)

If you work on open source software, especially command-line tools, I want you to know about [newly available research reports and design guidance](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;ux-research-design&#x2F;), and [a user research HOWTO](https:&#x2F;&#x2F;sprblm.github.io&#x2F;devs-guide-to&#x2F;user-testing&#x2F;), that you can pick up and reuse.

### The pip work and how you can learn from it

Back in 2020, during [grant-funded work on the next-generation pip resolver](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2020&#x2F;11&#x2F;pip-20-3-new-resolver.html), the consultancy [Superbloom](https:&#x2F;&#x2F;superbloom.design&#x2F;) (previously Simply Secure) did fascinating user experience research and design work. I was the project manager on this work, and can attest that working with UX experts on pip was crucial and valuable. The more we knew about users’ experience, the better decisions we could make.

During that work, they wrote several useful documents that took a while to get merged, but now live in pip’s documentation! Like:

* [how users thought pip should react to dependency conflicts](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;ux-research-design&#x2F;research-results&#x2F;override-conflicting-dependencies&#x2F;)
* [what users used pip search for](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;ux-research-design&#x2F;research-results&#x2F;pip-search&#x2F;)
* [how pip users thought about and dealt with package security](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;ux-research-design&#x2F;research-results&#x2F;users-and-security&#x2F;)
* [how to design a survey for pip](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;ux-research-design&#x2F;guidance&#x2F;#designing-surveys)

Even if your work has nothing to do with pip, consider skimming those. The most exciting thing about them isn&#39;t their literal content, but the fact that _this is possible_. Open source projects -- including command-line tools -- can get help systematically understanding users and improving to meet their needs better.

### Questions you can answer

As I [mentioned last year](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2023&#x2F;user-support-equanimity-potential-cross-project-tools-practices-open-source&#x2F;), I recently talked with David Lord, a Pallets maintainer, who wants to know for his projects:

* He puts effort into consistent **deprecation warnings**. Are they **effective**? Are people seeing those warnings early enough to avoid unpleasant surprises when functionality changes? If not, what could he do to communicate this information to them more effectively?
* **Who’s using** this software? That is: do their **needs cluster** around a few major use cases&#x2F;workflows? If so, what are they?
* Which, if any, of the **new features** from the past few years do they **use**?
* How do they **seek help**? Do they make an effort to start with the official docs, or just search the web and often find old blog posts written by enthusiasts?
* What level of **detail** do they need in an **error message** spouted to the command line, and what would be so long that they’d be more likely to skip reading it?

He&#39;s not alone! So many maintainers would like to know this kind of information, but they fundamentally assume it isn&#39;t possible. (And I could spend a few paragraphs on why they make that assumption, but I&#39;ll skip that today.)

Yet this is the kind of information we got through Superbloom&#39;s work.

Example: [their research findings helped](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;issues&#x2F;8377) us improve the format and content of the &#x60;ResolutionImpossible&#x60; error message, so users could actually work out what went wrong and how to fix it. UX analyses and training have helped massively improve pip’s user experience design, including error messages and docs, as well as the direct ergonomics of invoking the right commands and having them do what users expect. Another example that [hasn&#39;t](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;issues&#x2F;12626) been completely merged in yet: [an analysis of some confusing error messages](https:&#x2F;&#x2F;superbloomdesign.notion.site&#x2F;Dependency-resolver-information-and-error-messages-proposal-f9108b43752a4414a94d3d47d8d519bb) and [a suggested template for clearer error message formats](https:&#x2F;&#x2F;superbloomdesign.notion.site&#x2F;Error-message-format-and-guidelines-7b4ede077ad54c10a8f4182795fb949d).

### Join forces

We didn’t limit ourselves to only researching the UX of pip, because that wouldn’t make sense; pip is an interdependent part of the Python package creation and distribution ecosystem, and we needed to understand how users reasoned about, researched, and learned about packaging broadly. And – I believe – learning these tools and facts has been, and can be, helpful to other packaging tools maintainers beyond pip.

And I see this as a model that we can replicate in other ecologies, especially groups of related command-line tools. Pool funds and invest in UX research for a _suite_ of tools that people often use together, and learn surprising and helpful things that help you all improve your projects’ developer experience and user experience.

### More resources

I hope this work can inspire maintainers elsewhere to do likewise. You can [apply for grants](http:&#x2F;&#x2F;changeset.nyc&#x2F;resources&#x2F;talks-and-interviews&#x2F;apply-for-grants-to-fund-open-source-work&#x2F;) or [recruit sponsors](https:&#x2F;&#x2F;docs.oscollective.org&#x2F;guides&#x2F;recruiting-financial-sponsors) to fund this sort of work. Or, if it&#39;s easier to learn UX research skills than to hire them, you could learn. Last year, [Superbloom published more resources to help you start to do user testing and usability testing in your projects](https:&#x2F;&#x2F;sprblm.github.io&#x2F;devs-guide-to&#x2F;), including:

* a user testing HOWTO, also available as an interactive guide on &#x60;itch.io&#x60;
* a HOWTO for synthesis (“stage of research in which you reorganize information to make sense of what you observed and heard”)

And the pip work now joins [other guidance and case studies in improving command-line UX](https:&#x2F;&#x2F;www.metafilter.com&#x2F;198576&#x2F;to-maximize-its-utility-and-accessibility), such as [Command Line Interface Guidelines](https:&#x2F;&#x2F;clig.dev&#x2F;), and the [Rust compiler error style guide](https:&#x2F;&#x2F;rustc-dev-guide.rust-lang.org&#x2F;diagnostics.html).

Hope this is helpful! I’m Sumana Harihareswara, and I can help you with this sort of thing through my consultancy, [Changeset Consulting](http:&#x2F;&#x2F;changeset.nyc&#x2F;); I do project management, [coaching](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2022&#x2F;some-upcoming-availability-talks-and-coaching&#x2F;), training workshops, and more. Anyone reading this is eligible for a short free 30-minute consultation call; [email me](http:&#x2F;&#x2F;changeset.nyc&#x2F;hire-us&#x2F;).

And [I’m working on a book on managing existing open source projects, so you can learn how to get them unstuck](http:&#x2F;&#x2F;changeset.nyc&#x2F;sampler&#x2F;). You can read three sample chapters by [signing up for my newsletter](https:&#x2F;&#x2F;buttondown.email&#x2F;Changeset).

_(This post is a remix of_ [_my Fediverse thread_](https:&#x2F;&#x2F;social.coop&#x2F;@brainwane&#x2F;112277996781910312) _and_ [_my Python Discourse forum post_](https:&#x2F;&#x2F;discuss.python.org&#x2F;t&#x2F;pip-ux-research-design-docs-useful-to-packaging-broadly&#x2F;51257) _on the same topic, in case you want to comment in one of those places.)_

Comments