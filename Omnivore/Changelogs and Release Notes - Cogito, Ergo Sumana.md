---
id: ca8259d7-b35f-4ba7-ab1e-1db37f0eb07b
title: Changelogs and Release Notes | Cogito, Ergo Sumana
tags:
  - RSS
date_published: 2024-09-26 10:06:08
---

# Changelogs and Release Notes | Cogito, Ergo Sumana
#Omnivore

[Read on Omnivore](https://omnivore.app/me/changelogs-and-release-notes-cogito-ergo-sumana-1922f86741b)
[Read Original](https://harihareswara.net/posts/2024/changelogs-and-release-notes/)



Blog by **_Sumana Harihareswara_**, Changeset founder

26 Sep 2024, 9:20 a.m. 

Changelogs and Release Notes

* [Advice](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;advice)
* [Open Source and Free Culture](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;open-source-and-free-culture)
* [maintainers](https:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;maintainers)

My friend Ned Batchelder [posted, &quot;A list of commits is not a changelog!&quot;](https:&#x2F;&#x2F;hachyderm.io&#x2F;@nedbat&#x2F;113152493265812268) and spurred this post.

**Summary:** We&#39;d all benefit from restoring the distinction between a detailed changelog and brief release notes, but that&#39;s hard to do if a project relies solely on GitHub as its communication platform.

**Context**: Ned maintains and uses open source software. He was talking to fellow open source maintainers, as am I.

**Wording**: I&#39;m going to assume you know what open source software is, and understand what I mean when I use terms such as &quot;commit&quot; (the noun), &quot;mailing list,&quot; &quot;issue&quot;, &quot;deprecation&quot;, and &quot;beta&quot; in this context.

**Where I&#39;m coming from:** I have a lot of advice for maintainers on how to communicate with their users. I think changelogs suit some of those communication needs and not others. In [my guide &quot;Marketing, Publicity, Roadmaps, and Comms&quot;](https:&#x2F;&#x2F;docs.oscollective.org&#x2F;guides&#x2F;marketing-publicity-roadmaps-and-comms) I discuss

* your audiences and what you need to tell them
* the roles of roadmaps, mailing lists, blogs, mailing lists, in-application notifications, group chats, videos, and more (with links to examples)
* a sample schedule for what to do 1 month before a release, 1 week before, at release, and one month afterwards

So I&#39;m thinking of changelogs in that context. A maintainer can use several announcement and documentation tools to systematically communicate to their users, upstreams, and other interested people about new releases, new features, deprecations, and so on. And one of them is the changelog.

**A word definition**: [Karl Fogel, in _Producing Open Source Software,_ writes that](https:&#x2F;&#x2F;producingoss.com&#x2F;en&#x2F;packaging.html#packaging-name-and-layout):

&gt; There should also be a &#x60;CHANGES&#x60; file (sometimes called &#x60;NEWS&#x60;), explaining what&#39;s new in this release. The &#x60;CHANGES&#x60; file accumulates changelists for all releases, in reverse chronological order, so that the list for this release appears at the top of the file....

The sample &#x60;CHANGES&#x60; file is a list of succinct lines such as &quot;Added regular expression queries (issue #53)&quot; and fixed reindexing bug (issue #945)&quot;. A reader who wants more details can follow up by reading the referenced issues.

&gt; The list can be as long as necessary, but don&#39;t bother to describe every little bugfix and feature enhancement in detail. The point is to give users an overview of what they would gain by upgrading to the new release, and to tell them about any incompatible changes.

Karl wrote that nearly 20 years ago. More recently, [Olivier Lacan has urged developers to &quot;Keep a Changelog&quot;](https:&#x2F;&#x2F;keepachangelog.com&#x2F;), saying that a changelog &quot;contains a curated, chronologically ordered list of notable changes for each version of a project&quot;.

**Change size, categories, and completeness**: We agree that, usually, _a list of commits isn&#39;t suitable_ as a changelog. As my spouse Leonard Richardson puts it, each changelog entry should reflect an _issue resolved_, because that is the unit of someone caring about a change. One issue resolution often happens over multiple commits, so it&#39;s better to summarize it in one log entry. Also, the first line of a commit message often isn&#39;t suitable as a changelog entry -- authors (very reasonably) communicate in jargon, abbreviations, etc. [Aurélien Gâteau&#39;s shared some examples.](https:&#x2F;&#x2F;agateau.com&#x2F;2022&#x2F;your-git-log-is-not-a-changelog&#x2F;) So someone needs to translate and edit and write a changelog targeting end users, and this can happen either iteratively alongside writing and merging contributions ([MediaWiki example](https:&#x2F;&#x2F;gerrit.wikimedia.org&#x2F;r&#x2F;plugins&#x2F;gitiles&#x2F;mediawiki&#x2F;core&#x2F;+&#x2F;refs&#x2F;heads&#x2F;master&#x2F;RELEASE-NOTES-1.43)), or in a batch before each release. The &quot;how&quot; of that is a big enough topic that I won&#39;t address it here.

I&#39;m fine with a project either keeping one giant changelog ([as pip does](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;news&#x2F;)) or moving the previous releases&#39; changelog into a separate file (as MediaWiki does with [HISTORY](https:&#x2F;&#x2F;gerrit.wikimedia.org&#x2F;r&#x2F;plugins&#x2F;gitiles&#x2F;mediawiki&#x2F;core&#x2F;+&#x2F;refs&#x2F;heads&#x2F;master&#x2F;HISTORY)).

When the list of changes carried in a specific release gets long, it&#39;s sensible to bucket them into categories, so different kinds of users can easily find changes that will affect them. For example, [MediaWiki&#39;s changelog for 1.41](https:&#x2F;&#x2F;www.mediawiki.org&#x2F;wiki&#x2F;MediaWiki%5F1.41) has sections for end users, system administrators, API users, translators, and open source contributors (also relevant to downstreams who incorporate the software as a dependency). Or, for tools only used by other developers, you could break the list up [as Zack Weinberg did in the autoconf 2.72 NEWS list](https:&#x2F;&#x2F;lists.gnu.org&#x2F;archive&#x2F;html&#x2F;autoconf&#x2F;2023-12&#x2F;msg00037.html): &quot;Backward incompatibilities&quot; (also known as &quot;breaking changes&quot;), &quot;New features&quot;, &quot;Obsolete features and new warnings&quot;, &quot;Notable bug fixes&quot;, and &quot;Known bugs&quot;.

We agree that a changelog is meant to be _comprehensive_, listing all the changes in the software since the previous release. [David Brownman disagrees](https:&#x2F;&#x2F;xavd.id&#x2F;blog&#x2F;post&#x2F;effective-changelogs&#x2F;#dont-include-everything), opining that, for example, documentation updates and repository configuration changes don&#39;t affect end users of a library, and thus don&#39;t belong. But I disagree, and I&#39;ll get into why in the next section.

(I do make an exception for truly trivial changes, such as whitespace modifications and documentation typo fixes, and I agree with [the approach pip maintainers take in omitting stuff like that from the NEWS file.](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;development&#x2F;contributing&#x2F;#choosing-the-type-of-news-entry))

**How detailed?**: But we disagree on how _detailed_ each entry should be. Karl writes, &quot;don&#39;t bother to describe every little bugfix and feature enhancement in detail.&quot; [Ned writes](https:&#x2F;&#x2F;hachyderm.io&#x2F;@nedbat&#x2F;113152669995837605), &quot;Tell me about the things I need to know. Give me the implications, and links to docs. &#39;Updated dependency xyz to v4.3&#39; is useless.&quot; And some projects do this. Dreamwidth calls it [a &quot;code tour&quot;](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2011&#x2F;discovering-an-origin&#x2F;). Every time Dreamwidth deploys a new update to the site, someone writes explanations for each change, links to the GitHub pull request, and credits the authors. Example entry from ilyena\_sylph&#39;s [June 2023 code tour:](https:&#x2F;&#x2F;dw-dev.dreamwidth.org&#x2F;236795.html)

&gt; [**Issue 3035**](https:&#x2F;&#x2F;github.com&#x2F;dreamwidth&#x2F;dreamwidth&#x2F;issues&#x2F;3035)**:** Update color picker element to something more modern ([pull request](https:&#x2F;&#x2F;github.com&#x2F;dreamwidth&#x2F;dreamwidth&#x2F;pull&#x2F;3122))  
&gt; **Category:** Site Modernization; Prettifying  
&gt; **Patch by:** [**momijizukamori**](http:&#x2F;&#x2F;www.github.com&#x2F;momijizukamori)  
&gt; **Description:** You may or may not know that if you go to customize your style (&lt;https:&#x2F;&#x2F;www.dreamwidth.org&#x2F;customize&#x2F;options?group&#x3D;colors&gt;), if you click on the little color swatches, you get a colorpicker? It opens in a new window, and is 1) ancient, 2) terrible, 3) inaccessible, and 4) apparently difficult for a lot of people to find. It has now been nuked to oblivion and replaced with a nice little library that pops up in the page and which has way better support for screenreaders and keyboard navigation. It also comes in dark mode to match all you Gradation users out there.

That was #16 of 45 changes. If you read it and think, &quot;That&#39;s way too much detail! How was a user supposed to skim this list for what mattered to them?&quot; then I have good news for you: along with the code tour, [Dreamwidth published an announcement that summarized salient changes in 9 bullet points](https:&#x2F;&#x2F;dw-maintenance.dreamwidth.org&#x2F;91556.html). Which is to say: they provided _release notes_.

**Release notes**: We used to have a clear division, in open source software documentation, between _changelogs_ and _release notes_. Release notes are a _prose summary of what&#39;s changed_, which exist in _addition_ to a changelog (the release notes might link to the changelog or include a copy at the bottom), and which focus on changes the user might perceive.

[Zulip&#39;s 9.0 announcement is a good example](https:&#x2F;&#x2F;blog.zulip.com&#x2F;2024&#x2F;07&#x2F;25&#x2F;zulip-9-0-released&#x2F;); scroll to &quot;Release highlights&quot;. Note that the medium (a blog post) gives author Tim Abbott room to give context, share screenshots, connect this release to Zulip&#39;s product roadmap, ask for feedback, and so on. This approach makes sense for consumer-facing projects such as GUI applications. Another example: GNOME, which published separate [user-facing](https:&#x2F;&#x2F;release.gnome.org&#x2F;47&#x2F;) and [developer-facing release notes](https:&#x2F;&#x2F;release.gnome.org&#x2F;47&#x2F;developers&#x2F;index.html) for GNOME 47 (&quot;Denver&quot;) as web pages.

Release notes for libraries and developer-targeted command-line tools often don&#39;t need to include screenshots. [Leonard Richardson&#39;s announcement email for Beautiful Soup 4.13.0 beta 2 is a plain text release notes example.](https:&#x2F;&#x2F;groups.google.com&#x2F;g&#x2F;beautifulsoup&#x2F;c&#x2F;9w%5FPEBCaM6c) He started,

&gt; For the past few months I&#39;ve been working on adding type hints to the Beautiful Soup code base. This process exposed a number of very small inconsistencies which couldn&#39;t be fixed without changing behavior.

and then explained how to test the beta, asked for feedback from people who use a few specific features, pointed out a particular deprecation warning, and set schedule expectations for the next release. Similarly, [my pip 20.2 announcement email](https:&#x2F;&#x2F;mail.python.org&#x2F;archives&#x2F;list&#x2F;pypi-announce@python.org&#x2F;thread&#x2F;AGRJ7UCS6X36BX77H4QWXCQ5LFYEIR2N&#x2F;) linked to [more detailed release notes which I&#39;d published as a python.org blog post](https:&#x2F;&#x2F;blog.python.org&#x2F;2020&#x2F;07&#x2F;upgrade-pip-20-2-changes-20-3.html). This release included a beta version of a disruptive change, so I linked to [a part of our documentation where we&#39;d explained how to test and migrate, setups to test with special attention, our reasons for the change, the deprecation timeline, and so on](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;latest&#x2F;user%5Fguide&#x2F;#changes-to-the-pip-dependency-resolver-in-20-2-2020). And I thanked our funders.

You can use release notes to announce things that don&#39;t quite fit in a changelog, but that your users ought to know. &quot;This is the penultimate release in the 3.x series.&quot; &quot;I just took a full-time job, so the time horizon for the next release is probably months, not weeks.&quot; &quot;Without new funding or volunteer assistance, this will be the last release that integrates with foo.&quot; &quot;We moved our discussion forum to a more usable platform.&quot;

Release notes don&#39;t replace changelogs, but _supplement_ them. They balance each other. If a reader reads release notes and wants more specifics, they can go read the comprehensive changelog. If a changelog is too overwhelming and an end user is left thinking, &quot;but what matters to **me**?&quot; they can go read the release notes.

So that&#39;s why I disagree with David Brownman. Changelogs should be comprehensive. Sharing documentation updates, repository configuration changes, schema migrations, architecture overhauls, new automated tests, etc. in a changelog helps readers appreciate the invisible maintenance work you do, and informs downstreams who are maintaining forks. And excluding these changes from a changelog sends a message about your values and about how you think about open source. It says that you think of your users primarily as consumers rather than as partners and potential contributors. In contrast, when you include &quot;under-the-hood&quot; changes in a changelog, that can tell supporters where their money&#39;s gone, showcase the work of more volunteers, and provide inviting examples for people who had been thinking of getting involved.

And you can do all this safely knowing that users who only want a summary of user-perceptible changes can find that -- in the release notes.

**Skill**: I&#39;ve witnessed some maintainers&#39; apprehension at writing release notes. Anytime someone&#39;s trying to write in a medium or genre they&#39;re not used to, it can take a bit of practice and editing to get the tone right. (And this is something coaching and training can help with - [Heidi Waterhouse](https:&#x2F;&#x2F;heidiwaterhouse.com&#x2F;) is good at that, as am I.)

**Changes in communication mediums**: Most of the examples I&#39;ve used here are projects that predate GitHub. Open source projects used to use a constellation of digital services for different kinds of activities: a code repository, an archive of packaged releases, an issue tracker, a mailing list, and a documentation site might all be separate, not to mention blogs, wikis, and chat.

And we used to assume that open source projects maintained some textual communication platform to officially announce releases -- a Usenet group, a mailing list, a blog, or something like that -- other than GitHub.

**GitHub discourages release notes (compared to changelogs)**: But now, a ton of projects pretty much live on GitHub.\* And GitHub&#39;s interaction design privileges changelogs over release notes.

GitHub hosts and displays the &#x60;CHANGELOG.md&#x60; format just fine. A changelog file in the top level directory of a repository shows up reasonably prominently in a repository&#39;s main page, where a lot of people expect to find it.

You can [create a &quot;Release&quot; on GitHub](https:&#x2F;&#x2F;docs.github.com&#x2F;en&#x2F;repositories&#x2F;releasing-projects-on-github) and add release notes (example: [Hometown v1.1.1](https:&#x2F;&#x2F;github.com&#x2F;hometown-fork&#x2F;hometown&#x2F;releases&#x2F;tag&#x2F;v4.2.10%2Bhometown-1.1.1)). But, as Lacan notes, &quot;The current version of GitHub releases is also arguably not very discoverable by end-users, unlike the typical uppercase files (&#x60;README&#x60;, &#x60;CONTRIBUTING&#x60;, etc.).&quot;

Relatedly, adoption is pretty uneven. I&#39;ve only witnessed projects doing this when they use the GitHub workflow to manage and publish their releases through GitHub, and many don&#39;t. Example: [vim](https:&#x2F;&#x2F;github.com&#x2F;vim&#x2F;vim). If you look in the sidebar, in the &quot;Releases&quot; section, you can click on the &quot;17,469 tags&quot; link, which leads you to a list of Git tags -- and then if you select the &quot;Releases&quot; tab there, you&#39;re told, &quot;There aren’t any releases here.&quot; That&#39;s because vim publishes release notes ([example: 9.1](https:&#x2F;&#x2F;www.vim.org&#x2F;vim-9.1-released.php)), and links to downloads, on the vim website, and GitHub doesn&#39;t offer a way to transclude those from another data source into what GitHub displays, or redirect that &quot;Releases&quot; link to a webpage you control.

GitHub does make it easy to [automatically generate a draft text for your release notes](https:&#x2F;&#x2F;docs.github.com&#x2F;en&#x2F;repositories&#x2F;releasing-projects-on-github&#x2F;automatically-generated-release-notes), which I&#39;m guessing [Ruby 3.3.5 used for theirs](https:&#x2F;&#x2F;github.com&#x2F;ruby&#x2F;ruby&#x2F;releases&#x2F;tag&#x2F;v3%5F3%5F5). It gives you a list-style changelog, and while I&#39;m sure some maintainers edit it into release notes (summarizing, emphasizing the key changes, and adding context), clearly some do not.

Also, [to create a GitHub Release for a particular version of your project, you have to associate that release with a Git tag](https:&#x2F;&#x2F;docs.github.com&#x2F;en&#x2F;repositories&#x2F;releasing-projects-on-github&#x2F;managing-releases-in-a-repository) (which isn&#39;t how some projects manage their Git workflow).

And I get that this would be difficult to solve. I&#39;m sure that product managers at GitHub have scars that ache at the mere memory of dozens of past battles waged over the precious real estate that is a repository&#39;s main page. I fully admit that I&#39;m not offering a solution.

\* (Maybe they also communicate on microblogging platforms -- X, Mastodon, Bluesky -- and on unlinkable Discord servers and Slacks -- but generally, none of those provide a stable, public-web-searchable venue for a textual announcement that might be hundreds of words long.)

**Conclusion**: The difference between a changelog and release notes is the difference between a &quot;reference&quot; and an &quot;explanation&quot; in [Divio&#39;s &quot;four kinds of documentation&quot; framework](https:&#x2F;&#x2F;docs.divio.com&#x2F;documentation-system&#x2F;). A changelog, like an inventory of available API methods, is comprehensive, reliably consistent, and uses section headings and other formatting to be skimmable. A set of release notes, like [a &quot;why we made this controversial architectural choice&quot; blog post](https:&#x2F;&#x2F;signal.org&#x2F;blog&#x2F;the-ecosystem-is-moving&#x2F;), is distilled, often narrative, and uses brevity and focus on the reader&#39;s priorities to be quickly readable. In Heidi Waterhouse&#39;s words, it can be a derivation of the _decision_ log.

They are both useful and both worth making, even if GitHub doesn&#39;t make it easy to publicize the latter. And that&#39;s one of several good reasons to maintain a place you control -- outside of GitHub -- where people can reliably find and subscribe to information updates about your project without having to depend on a totalizing vendor. An email list&#x2F;newsletter or a blog pays excellent dividends, and this is just one of them.

_Hope this is helpful! I’m Sumana Harihareswara, and I can help you with this sort of thing -- including learning how to quickly draft release notes -- through my consultancy,_ [_Changeset Consulting_](http:&#x2F;&#x2F;changeset.nyc&#x2F;)_. I do project management,_ [_coaching_](http:&#x2F;&#x2F;harihareswara.net&#x2F;posts&#x2F;2022&#x2F;some-upcoming-availability-talks-and-coaching&#x2F;)_, training workshops, and more. Anyone reading this is eligible for a short free 30-minute consultation call;_ [_email me_](http:&#x2F;&#x2F;changeset.nyc&#x2F;hire-us&#x2F;)_._

_And_ [_I’m working on a book on managing existing open source projects, so you can learn how to get them unstuck_](http:&#x2F;&#x2F;changeset.nyc&#x2F;sampler&#x2F;)_. You can read three sample chapters by_ [_signing up for my newsletter_](https:&#x2F;&#x2F;buttondown.email&#x2F;Changeset)_._

Comments