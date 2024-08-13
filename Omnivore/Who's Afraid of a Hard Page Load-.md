---
id: 875f55df-b1ac-49fa-9e99-e0558cde1c5d
title: Who's Afraid of a Hard Page Load?
tags:
  - RSS
date_published: 2024-07-16 00:00:00
---

# Who's Afraid of a Hard Page Load?
#Omnivore

[Read on Omnivore](https://omnivore.app/me/who-s-afraid-of-a-hard-page-load-190be170536)
[Read Original](https://unplannedobsolescence.com/blog/hard-page-load/)



## [Unplanned Obsolescence](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;)

* [Blog](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;blog)
* [About](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;about)
* [RSS](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;atom.xml)

---

While I&#39;m not going to settle the Single-Page Web Application (SPA) debate in a blog post, there is one claim about SPAs that routinely goes unchallenged, and it drives me nuts: that users prefer them because of the &quot;modern,&quot; responsive feel.

SPAs achieve their signature feel using partial page replacement: adding or removing DOM elements instead of loading a new page. Partial page replacement is a very useful feature—I&#39;m [working on an HTML standards proposal](https:&#x2F;&#x2F;github.com&#x2F;alexpetros&#x2F;triptych) for it right now—but SPAs typically use them for _everything_, including page navigation, which causes a lot of problems.

The way this works is that rather than letting the browser load a new page when the user clicks an&#x60;&lt;a&gt;&#x60; tag, SPAs simulate page navigation by fetching with JavaScript, updating the page, and using the History API to edit the browser&#39;s URL bar. [NextJS](https:&#x2F;&#x2F;nextjs.org&#x2F;) and [React Router](https:&#x2F;&#x2F;reactrouter.com&#x2F;) work this way, as does [SvelteKit](https:&#x2F;&#x2F;kit.svelte.dev&#x2F;). Even the hypermedia libraries support this paradigm, with htmx&#39;s[hx-boost](https:&#x2F;&#x2F;htmx.org&#x2F;attributes&#x2F;hx-boost) and Hotwire&#39;s [Turbo Drive](https:&#x2F;&#x2F;turbo.hotwired.dev&#x2F;handbook&#x2F;drive).

In theory, avoiding &quot;hard&quot; page navigations has the following benefits:

* The app can make instant UI changes to reflect the user&#39;s click, and fill in information from the network request when it completes.
* The whole page doesn&#39;t repaint, i.e. the header and navigational links might remain in place while only the middle of the page changes. This avoids the blank screen that users often see while waiting for a new page to load.
* It allows for fancier transitions between pages.

What this does is essentially abstract away the concept of a link, and make the web page feel more like an application on your phone. No longer are you navigating web pages, you&#39;re moving around an app. I have a number of problems with this, but purely from a UX standpoint, it&#39;s a massive disservice to web users.

## [Managing the network](#managing-the-network)

Every day I ride the New York City Subway. For my carrier, most of the stops have cell service, and most of the tunnels between stops do not. When I read web pages while riding, I am _keenly_ aware that if I click a link while I don&#39;t have service, not only will the page fail to load, I will probably also lose access to the one I&#39;m currently reading. Everyone who uses a web browser understands this behavior on some level. So I avoid clicking links until I&#39;m at a stop.

Occasionally though, I&#39;ll mis-time it, and click a link right as the subway is pulling out of a stop: the page fails to load, and now I&#39;m looking at a blank screen. In that situation, I much prefer to be on a traditional website than an SPA. On a website like Wikipedia, one that uses hard links and full page loads, then there&#39;s a decent chance that the browser can save me: the back button will usually load the cached version of the page I was just on.

If it&#39;s an SPA, however, in all likelihood clicking the back button will take me a different, mostly blank page, and now I&#39;m just stuck. When the internet comes back, I&#39;ll refresh the page and hopefully land in the same place, but maybe not. In fact, my whole attitude towards a website changes if feels like an SPA. Subconciously, I know that I have to baby it, and only use it in the most optimal network conditions. The smoothness of a web application is an anti-indicator of its reliability and predictability as a web page.

That anti-indicator holds even in situations without unreliable internet. As a user, I&#39;m always much happier when presented with a form that is entirely on one page, or has a &quot;hard&quot; submit button for each step that takes me to a new page, as opposed to a &quot;seamless&quot; form that exists as a blob of JS state. The former has relatively predictable submit, autocomplete, and back button behavior, while the latter varies widely by implementation.

Maybe you don&#39;t ride the subway. But you&#39;ve probably driven on a highway with spotty service, or had a bad Wi-Fi connection, or gotten on a plane, or been inside a basement with weirdly thick walls. Everyone has had to navigate the web under less-than-ideal network conditions, and you quickly develop an intuition for which websites will be resilient to them.

## [The web has seams, let them show](#the-web-has-seams-let-them-show)

Developers are naturally inclined to make their applications feel more responsive, and when they test their SPA, it feels like a more natural experience than a clunky old web page. But this instinct is usually incorrect, because most websites need to hit the network in response to user actions.

When a user clicks a link, they want whatever information was at that link—which their device will have to make a network trip to discover. When a user submits a form, they need to know whether or not that information was saved to the server, which their device will have to make a network trip to accomplish.

I suppose there&#39;s a version of the web that pre-fetches every possible page for you—and that might feel pretty instantaneous. But there&#39;s no world where that works for user-submitted data, because the only thing I care about as a user is that _the data actually got submitted_. If I submit a form to a website, the website optimistically and instantaneously shows me that the submission succeeded, and I later find out that it didn&#39;t, I am **mad**.

The friction involved with a hard page load doesn&#39;t exist because web developers are too lazy to do performance work—it reflects a real, physical limitation in the system that is beyond the ability of one developer, and possibly humanity, to overcome. SPAs not only fail to remove the need for the network call, they diminish the user&#39;s ability to manage when that network call is made, and [handle failure cases](https:&#x2F;&#x2F;intercoolerjs.org&#x2F;2016&#x2F;05&#x2F;08&#x2F;hatoeas-is-for-humans.html).

Discussions of user agency in software are often very... optimistic about how much users want to exercise that agency. But agency comes in many forms. When I was in 5th grade, I would load up[GameFAQs guides for Final Fantasy III](https:&#x2F;&#x2F;gamefaqs.gamespot.com&#x2F;ds&#x2F;924897-final-fantasy-iii&#x2F;faqs) on my iPod Touch before a road trip, and in the car I&#39;d make sure not navigate away from the page, or I&#39;d lose the guide. When I avoid clicking links between subways stops, I&#39;m building on behavior I learned as a child, not as a software engineer.

## [In the long run, the browser always wins](#in-the-long-run-the-browser-always-wins)

I suspect that the primary impetus for this smoothness is commerce, or something I call &quot;casino-driven development.&quot; As my Papou used to tell me, casinos do not have clocks because clocks remind you that time is passing; the casino would like you to forget that time is passing, because they make more money the longer you remain in the casino. In the ad-based internet attention economy, the website would like to keep you in their casino as long as possible-the less that you&#39;re reminded you&#39;re on the web, where clicks usually require waiting, the better.

Internet folklore has it that, in the 2000s, Amazon and Google research discovered that for eachX additional millisecond of page load latency they lost Y customers and therefore Z dollars. I can&#39;t find any reliable sources for this, but the logic is sound. Some percentage of people will give up the longer it takes to see a result, and at that scale, that percentage translates into a lot of lost money.

Here&#39;s the problem: your team almost certainly doesn&#39;t have what it takes to out-engineer the browser. The browser will continuously improve the experience of plain HTML, at no cost to you, using a rendering engine that is orders of magnitude more efficient than JavaScript. To beat that, you need to be continuously investing significant engineering effort into cutting-edge application work.

Some things you have to consider with SPAs:

* What happens when users refresh the page?
* What happens when users click the back button?
* What happens when users click the back button twice?
* What happens when users click the back button twice, the forward button once, and then the back button again?
* What happens when users try to open a link in a new tab?
* What happens when users users copy the link from the address bar and send it to a friend?
* Where does the page focus go when it navigates?

You can engineer your way out of basically all the problems I&#39;ve described here, but it takes enormous effort. And maintenance on the pile of libraries required to get back basic browser features like &quot;back button navigation&quot; on your SPA [is a new fixed cost, paid for with your time](https:&#x2F;&#x2F;htmx.org&#x2F;essays&#x2F;no-build-step&#x2F;). If you use hard page loads, those things not only work for free, they work forever, and they work in exactly the way the user expects and desires.

At the time of this writing, the [NextJS showcase](https:&#x2F;&#x2F;nextjs.org&#x2F;showcase) lists Nike&#39;s shopping platform as one of their successes. If you are literally Nike, and throwing millions at making your shopping portal slightly more responsive could result in tens of millions of revenue, by all means take a crack at it. I, personally, am dubious that the math typically pencils out, even for Nike, but I concede that it&#39;s at least plausible that you will deliver a networked experience that is a hair quicker than what the default HTML can do, and reap the rewards.

Meanwhile, the browser marches on, improving the UX of every website that uses basic HTML semantics. For instance: browsers often _don&#39;t_ repaint full pages anymore. Try browsing[Wikipedia](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Web%5Fbrowser) (or [my blog](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;)) on a decent internet connection and notice how rarely the common elements flash (I can&#39;t find _any_ documentation for this feature, but it definitely exists). And, if the connection isn&#39;t fast, then the browser shows a loading bar! It&#39;s a win for users, and one of the many ways that sticking with the web primitives rewards developers over time.

So if you&#39;re a bank, or a government, or pretty much anyone with engineering resources short of &quot;limitless,&quot; you will likely be better served by sticking to hard page loads (and the default HTML capabilities) as much as possible. It&#39;s dramatically easier to implement and benefits from browser performance and security improvements over time. For page responsiveness improvements, try tweaking your cache headers, scrutinizing the JavaScript you send to the client, and optimizing your CDN setup. It always pays off in the long run.

## [Bonus: A Good Use of SPAs](#bonus-a-good-use-of-spas)

When I worked at the Washington Post, I worked on the interactive map that they used for live election night coverage. [Watch my former boss, Jeremy Bowers, clicking around it the livestream](https:&#x2F;&#x2F;www.youtube.com&#x2F;live&#x2F;czuu6s0gew4?si&#x3D;Ch%5FLp0YS1iBzyIYN&amp;t&#x3D;5628). Here&#39;s me and[Dylan Friedman](https:&#x2F;&#x2F;dylanfreedman.com&#x2F;), in front of an early version:

![Alex Petros and Dylan Friedman in front of a big screen with a gray map on it,
       at the Washington Post offices](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;500x0,sm1gL0ecVsE6E-yp6djfVZ865wNiP5EaMy1MxQaBhEY0&#x2F;https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;blog&#x2F;hard-page-load&#x2F;alex-dylan-election-map.jpg) 

 I had to leave this project after like 6 weeks and [Brittany](https:&#x2F;&#x2F;www.brmayes.com&#x2F;) took my place. As you can see, it improved dramatically after I left.

That&#39;s a giant SvelteKit app! The map GUI is controlled by a [Svelte store](https:&#x2F;&#x2F;svelte.dev&#x2F;docs&#x2F;svelte-store), and, if I remember correctly, a websocket updates the votes totals in the background. When you click on a US State, it shows a close-up of that state and all the election info that had come in so far.

This is a great use of a reactive UI framework, because the data stored on the client doesn&#39;t update in response to user actions, it updates in response to new election results. The clicking should be instantaneous, and the UI should live entirely on the client, because they can!

And it&#39;s remarkable that you can compete with very expensive interactive map products using nothing but a browser, open source libraries, and a couple months of engineer-time.

I had so much fun learning Svelte for this that I used to as the basis for[AYTA](https:&#x2F;&#x2F;areyoutheasshole.com&#x2F;). If I were doing AYTA again though, I would definitely use htmx.

_Thanks to [Mani Sundararajan](https:&#x2F;&#x2F;www.itsrainingmani.dev&#x2F;) for his feedback on a draft of this post._

## [Notes](#notes)

* When _is_ a good time to do partial page replacements? Either a) to add new information that would be there after a refresh, because it reflects the current state of the resource, e.g. a live-updating baseball score or b) as a result of actions that the user understands are ephemeral, and wouldn&#39;t expect to see after a refresh, like a dialog box.
* I am generously assuming that the SPA psuedo-navigation actually does use &#x60;&lt;a&gt;&#x60; tags. For a while that was not really incentivized by SPA frameworks, and people would just use &#x60;&lt;div&gt;&#x60;s for everything, but this has definitely gotten better lately.
* Ironically, [Triptych](https:&#x2F;&#x2F;github.com&#x2F;alexpetros&#x2F;triptych) has to simulate full-page navigations with partial page replacements and the history API, exactly the same way that hx-boost does, and is subject to the same inherent bugginess and lack of isolation. This is a limitation of the tools available in userland, and a big reason why these proposals should be supported natively, rather than in a library.
* Earlier, I said that actions that do require a round-trip to server should just use one, but the inverse applies as well: ideally, actions that do not required a round-trip to the server wouldn&#39;t use one. A good example of this is form validation. In the htmx world, sometimes [returning a new form with inline validation errors](https:&#x2F;&#x2F;htmx.org&#x2F;examples&#x2F;inline-validation) is &quot;good enough,&quot; (you always have to validate on the server, after all) but that experience can clearly be improved by having the validation occur without a network request. I usually wouldn&#39;t use an SPA just for client-side validation, but we can acknowledge that they are better at it right now.
* Further reading:  
   * [&quot;A Response To &#39;Have Single-Page Apps Ruined the Web?&#39;&quot;](https:&#x2F;&#x2F;htmx.org&#x2F;essays&#x2F;a-response-to-rich-harris&#x2F;), Carson Gross  
   * [&quot;The Market For Lemons&quot;](https:&#x2F;&#x2F;infrequently.org&#x2F;2023&#x2F;02&#x2F;the-market-for-lemons&#x2F;), Alex Russell