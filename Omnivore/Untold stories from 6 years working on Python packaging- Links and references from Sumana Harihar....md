---
id: ada61c60-161e-11ef-b2d7-4b3bee7e4567
title: "Untold stories from 6 years working on Python packaging: Links and references from Sumana Harihareswara's PyCon US 2024 keynote | Cogito, Ergo Sumana"
tags:
  - RSS
date_published: 2024-05-19 15:06:13
---

# Untold stories from 6 years working on Python packaging: Links and references from Sumana Harihareswara's PyCon US 2024 keynote | Cogito, Ergo Sumana
#Omnivore

[Read on Omnivore](https://omnivore.app/me/untold-stories-from-6-years-working-on-python-packaging-links-an-18f928cb113)
[Read Original](https://harihareswara.net/posts/2024/references-pycon-us-keynote/)



Blog by **_Sumana Harihareswara_**, Changeset founder

19 May 2024, 14:40 p.m. 

Links and References For My PyCon US Keynote

* [Conferences and Performances](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;conferences-and-performances)
* [Deliverables](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;deliverables)
* [PyCon](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;pycon)
* [Python](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;python)
* [Advice](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;advice)
* [maintainers](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;maintainers)

Today I’m giving the [closing keynote address at PyCon US 2024](https:&#x2F;&#x2F;us.pycon.org&#x2F;2024&#x2F;about&#x2F;keynote-speakers&#x2F;), sharing “Untold stories from six years working on Python packaging.”

I aim to post a fuller transcript with slides within the next several weeks. But, in advance, here are a bunch of links and other references so you can follow up.

### Python packaging specifically

[The grant-funded Python packaging projects](https:&#x2F;&#x2F;wiki.python.org&#x2F;psf&#x2F;PackagingWG), most of which I managed or helped obtain funding for. I was the project manager for and&#x2F;or a grant proposal writer for:

* 2017-2018: replacing legacy PyPI with the new Warehouse codebase (thanks, Mozilla Open Source Support program)
* 2019: [security, localization, and accessibility improvements for Warehouse](https:&#x2F;&#x2F;www.opentech.fund&#x2F;projects-we-support&#x2F;supported-projects&#x2F;pypi-improvements&#x2F;) (thanks, Open Tech Fund)
* 2019-2020: further security improvements to PyPI (I didn’t manage this one) ([Thanks, Facebook](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2018&#x2F;12&#x2F;upcoming-pypi-improvements-for-2019.html))
* 2020: overhauling the resolver at the heart of pip, and improving user experience (Thanks, MOSS and Chan Zuckerberg Initiative)
* 2021-2022: [more improvements to packaging security](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2021&#x2F;python-packaging-tools-security-work-and-an-open-position&#x2F;) (not listed on the wiki page) (Thanks, National Science Foundation)

(My keynote goes into more depth on the legacy PyPI replacement project and the pip resolver project, relative to the other projects)

[Dustin Ingram’s 2018 talk “Inside the Cheeseshop”](https:&#x2F;&#x2F;dustingram.com&#x2F;talks&#x2F;2018&#x2F;10&#x2F;23&#x2F;inside-the-cheeseshop&#x2F;) which goes into more detail on the history of PyPI and packaging more broadly

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s9sgv5NqDPcSJAonPlmEhozu8owy_ZuYFvs9xfF3iaqA&#x2F;https:&#x2F;&#x2F;harihareswara.net&#x2F;media&#x2F;images&#x2F;simpler-python-package-distribution-diagram.width-424.png)

 A simplified diagram illustrating some of the important tools in Python packaging and how they relate to each other. On the left, an end user uses pip to download and install cool software on a computer. They draw information from the cloud-based Python Package Index. That in turn draws information from developer packaging tools to the right, which the developer&#39;s cool software feeds into.

[NumPy](https:&#x2F;&#x2F;numpy.org&#x2F;), “The fundamental package for scientific computing with Python”

[The Python packaging platypus mascot](https:&#x2F;&#x2F;monotreme.club&#x2F;)

[Donald Stufft’s 2016 blog post on legacy PyPI&#39;s architecture and the under-resourcing of PyPI](https:&#x2F;&#x2F;caremad.io&#x2F;posts&#x2F;2016&#x2F;05&#x2F;powering-pypi&#x2F;) as further context for the funded work that started in 2017

From the 2017-2018 work overhauling PyPI: [announcing the Mozilla grant and the coming switchover from legacy PyPI to Warehouse](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2017&#x2F;11&#x2F;the-psf-awarded-moss-grant-pypi.html), then [asking for project maintainers to test the new site](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2018&#x2F;02&#x2F;python-package-maintainers-help-test.html), then [announcing the beta](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2018&#x2F;03&#x2F;warehouse-all-new-pypi-is-now-in-beta.html), then [announcing that the old site was shutting down](https:&#x2F;&#x2F;blog.python.org&#x2F;2018&#x2F;04&#x2F;new-pypi-launched-legacy-pypi-shutting.html)

[Current PyPI sponsors](https:&#x2F;&#x2F;pypi.org&#x2F;sponsors&#x2F;)

[Current Python Software Foundation staff](https:&#x2F;&#x2F;www.python.org&#x2F;psf&#x2F;records&#x2F;staff&#x2F;), including multiple staffers who work on packaging infrastructure, and [the announcement that they’re hiring one more](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2024&#x2F;03&#x2F;announcing-pypi-support-specialist.html)

[The original video we made to publicize changes coming to pip in 2020](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;B4GQCBBsuNU); I edited it to improve sound and timing, and to update [Ee Durbin](https:&#x2F;&#x2F;durbin.ee&#x2F;)’s name.

[More on Mel Chua&#39;s digital infrastructure research](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2023&#x2F;a-celebration-of-my-friend-dr-mel-chua&#x2F;) and the encapsulation paradox; [Mel Chua is currently very ill](https:&#x2F;&#x2F;www.caringbridge.org&#x2F;visit&#x2F;melchua), and [financial contributions are welcome](https:&#x2F;&#x2F;www.gofundme.com&#x2F;f&#x2F;melchua)

[From pip documentation: Things to watch out for in the new resolver](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;user%5Fguide&#x2F;#watch-out-for)

[Blog post, March 2020, announcing rollout of the new pip resolver](https:&#x2F;&#x2F;pyfound.blogspot.com&#x2F;2020&#x2F;03&#x2F;new-pip-resolver-to-roll-out-this-year.html)

[Release announcement, November 2020, of pip 20.3 (the new resolver became default)](https:&#x2F;&#x2F;blog.python.org&#x2F;2020&#x2F;11&#x2F;pip-20-3-release-new-resolver.html)

[the pypi-announce mailing list](https:&#x2F;&#x2F;mail.python.org&#x2F;mailman3&#x2F;lists&#x2F;pypi-announce.python.org&#x2F;), a low-traffic list to receive announcements of major changes to PyPI and other major packaging tools

[an example “where do you get your news?” comment](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;issues&#x2F;9187#issuecomment-738961186) and [publicity and outreach work I did for a pip beta release](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;issues&#x2F;7951#issuecomment-617851381)

The [user experience research and design documentation for pip and Python packaging specifically](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;ux-research-design&#x2F;), developed in 2020; [Superbloom later created a HOWTO on user testing](https:&#x2F;&#x2F;superbloom.design&#x2F;learning&#x2F;blog&#x2F;a-devs-guide-to-design-in-open-source-software&#x2F;)

Before-and-after screenshots of pip’s redesigned error messages: pull requests number [10959](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;pull&#x2F;10959), [10795](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;pull&#x2F;10795), and [10703](https:&#x2F;&#x2F;github.com&#x2F;pypa&#x2F;pip&#x2F;pull&#x2F;10703) – thanks to [Pradyun Gedam](https:&#x2F;&#x2F;pradyunsg.me&#x2F;) for pointing to those. (Also: [Pradyun Gedam’s new library “diagnostic”](https:&#x2F;&#x2F;diagnostic.readthedocs.io&#x2F;), further developing [his interest in improving error messages in command-line tools more broadly](https:&#x2F;&#x2F;pradyunsg.me&#x2F;blog&#x2F;2021&#x2F;12&#x2F;12&#x2F;oss-update-14&#x2F;).)

### Additional resources

[Superbloom’s HOWTO on user testing](https:&#x2F;&#x2F;superbloom.design&#x2F;learning&#x2F;blog&#x2F;a-devs-guide-to-design-in-open-source-software&#x2F;)

[My 2020 PyOhio talk (transcript and slides available) on how to apply for grants to fund open source work](http:&#x2F;&#x2F;changeset.nyc&#x2F;resources&#x2F;talks-and-interviews&#x2F;apply-for-grants-to-fund-open-source-work&#x2F;).

[Rebecca Solnit’s book _Hope in the Dark: Untold Histories, Wild Possibilities_](https:&#x2F;&#x2F;www.haymarketbooks.org&#x2F;books&#x2F;791-hope-in-the-dark) which makes the point that _you just don’t know_ what your work will lead to. You don’t. You plant seeds and you may never get to see them sprout. And failures can ready the ground for success.

[_Making Software: What Really Works, And Why We Believe It_ edited by Andy Oram and Greg Wilson](https:&#x2F;&#x2F;www.oreilly.com&#x2F;library&#x2F;view&#x2F;making-software&#x2F;9780596808310&#x2F;) – a compendium of research on software engineering, one of the books I recommend most frequently, and here I’m referring to the “Code Talkers” chapter (what programmers often need to understand about a codebase and can’t gather without asking another person) and the “Novice Professionals” chapter (recommends a practice of “feature interviews” as part of new developer onboarding). I also recommend the followup project [Never Work in Theory](https:&#x2F;&#x2F;neverworkintheory.org&#x2F;about&#x2F;), highlighting useful software engineering research to “be a bridge between researchers and practitioners.”

(Also, you might find that the best way to extract “design rationale” and similar knowledge from someone’s head is to [have them give you a “live tour”](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2022&#x2F;nurturing-volunteers-shortcut-and-event-template&#x2F;).)

[Chelsea Troy’s blog post on the effectiveness of tech conferences](https:&#x2F;&#x2F;chelseatroy.com&#x2F;2023&#x2F;04&#x2F;21&#x2F;whats-the-point-of-tech-conferences&#x2F;). “concentrate the right groups of people into a space to catalyze conversations that lead to Big Things…. Cons become worth it from the conversations that happen between folks who otherwise might not have met, that endure beyond the event itself…. I (and you) have almost certainly benefited from cons we’ve never been to and never heard of.”

The next [Volunteer Responsibility Amnesty Day](https:&#x2F;&#x2F;www.volunteeramnestyday.net&#x2F;) is on the next solstice, June 20th, 2024

[My blog category about automated external defibrillators and my work to open New York City’s data about public access AEDs](https:&#x2F;&#x2F;www.harihareswara.net&#x2F;posts&#x2F;defibrillators-in-nyc&#x2F;)

[My 2017 MetaFilter blog post about AEDs, “Restart a heart near you”](https:&#x2F;&#x2F;www.metafilter.com&#x2F;164970&#x2F;Restart-a-heart-near-you)

[The 2023 press release announcing the passage of The HEART Act](https:&#x2F;&#x2F;council.nyc.gov&#x2F;shekar-krishnan&#x2F;2023&#x2F;07&#x2F;28&#x2F;nyc-council-member-shekar-krishnan-leads-passage-of-heart-act-to-make-aeds-more-accessible-to-new-yorkers&#x2F;)

[An example of the Wellerman sea shanty as shared on social media in late 2020&#x2F;early 2021](https:&#x2F;&#x2F;kyraneko.tumblr.com&#x2F;post&#x2F;638978166752428032&#x2F;here-have-a-soprano-voice-added)

And: [some additional song lyrics](https:&#x2F;&#x2F;archive.iww.org&#x2F;history&#x2F;icons&#x2F;solidarity%5Fforever&#x2F;).

Comments