---
id: 6eb88dff-b9c0-4f14-a323-6f32f9efdf04
title: Discord vs IRC Rough Notes
tags:
  - RSS
date_published: 2024-07-11 19:00:00
---

# Discord vs IRC Rough Notes
#Omnivore

[Read on Omnivore](https://omnivore.app/me/discord-vs-irc-rough-notes-190a88fc9cc)
[Read Original](https://push.cx/discord-vs-irc-notes)



  
 Category:[←](https:&#x2F;&#x2F;push.cx&#x2F;large-refactors) [Code](https:&#x2F;&#x2F;push.cx&#x2F;category&#x2F;code)   
 Tags:[Discord](https:&#x2F;&#x2F;push.cx&#x2F;tags#discord) [←](https:&#x2F;&#x2F;push.cx&#x2F;developer-day-notes) [IRC](https:&#x2F;&#x2F;push.cx&#x2F;tags#irc) [Libera Chat](https:&#x2F;&#x2F;push.cx&#x2F;tags#libera-chat) [Lobsters](https:&#x2F;&#x2F;push.cx&#x2F;tags#lobsters) [Meta](https:&#x2F;&#x2F;push.cx&#x2F;tags#meta) 

Lobsters has had a chat room on [Libera Chat](https:&#x2F;&#x2F;libera.chat&#x2F;)for [9 years today](https:&#x2F;&#x2F;en.wiktionary.org&#x2F;wiki&#x2F;dance%5Fwith%5Fthe%5Fone%5Fthat%5Fbrought%5Fyou). Lobsters itself is [12](https:&#x2F;&#x2F;lobste.rs&#x2F;s&#x2F;slfdci&#x2F;one%5Fdozen%5Flobsters), and I [see Libera Chat as continuous](https:&#x2F;&#x2F;lobste.rs&#x2F;s&#x2F;1z77ly&#x2F;libera%5Fchat#c%5Fvwmpgx) with a rename a few years ago.

There’s a [more thorough description](https:&#x2F;&#x2F;lobste.rs&#x2F;chat) but &#x60;#lobsters&#x60; has three big purposes:

1. share a feed of links and have a lighter, ephemeral discussion on them
2. give potential new users a place to connect to existing ones for invites
3. some off-topic chat and community bonding

So we care a lot about text chat with a bit of custom functionality and a great new user experience. IRC is no longer a good experience for new users and a couple times a year &#x60;#lobsters&#x60; rehashes a discussion on IRC’s features and prospects. I finally realized I should collect my notes&#x2F;logs into something linkable even if it’s only a braindump.

* Most of this is me comparing Discord to IRC because it’s the alternative that’s most-used by current chatters, but the Rebuttal section is pretty universal to any discussion of IRC’s shortcomings.
* **I’m not seriously considering moving Lobsters chat to Discord**, and the possibility is less attractive now that I’ve collected a list of its problems, which has built a compelling case it’s a bad culture fit.
* This is all pretty rough and contains a significant amount of frustrated venting.
* Items are not in priority order.
* Nothing here is urgent.
* We’ll use a chat for decades so any decision is less about current parity and more about trend lines.
* I’m compiling many discussions so we can rehash less in the future, whatever happens.

## Desirable Discord Features

* good new user experience  
   * GUI  
   * familiar signup  
   * if user already has an account, joining server is a link to a one-click join dialog  
   * scrollback on join so the channel doesn’t look dead unless the new user joins in the ten seconds before an existing user hits enter  
   * doesn’t leak IP
* desktop streaming (1080p)  
   * I want to resume streaming Lobsters coding + office hours (esp for [queries](https:&#x2F;&#x2F;lobste.rs&#x2F;about#queries))  
   * My attempts to contact Twitch eng about their login bug failed
* text formatting: links, bold, underline, italic, code blocks
* security - MFA, alert emails, active login list
* message editing
* emoji reactions (and allergic users can hide them)
* mod tools  
   * reasonable banning (+b is garbage; separation of kick is misdesign)  
   * no @ on mod names (https:&#x2F;&#x2F;libera.chat&#x2F;guidelines&#x2F;#channel-operators-are-users-too)  
   * highlight&#x2F;filter on keywords w great default lists  
   * many high-quality 3rd-party tools (eg https:&#x2F;&#x2F;carl.gg&#x2F;)  
   * public modlog (might req carl.gg, I forget)
* mobile app
* good UI for muting channels&#x2F;groups&#x2F;users
* threads for breaking out overlapping&#x2F;side conversations
* good user docs with screenshots
* per-server user profiles w bio, links
* I can pay for it and it improves over time
* can oauth to link account from lobsters profile
* file attachments
* higher discoverability&#x2F;much better new user onboarding  
   * #lobsters gets traffic from being \~25th in libera’s webchat top channel list  
   * but discord is staggeringly popular and has 3p public directories

## Discord Downsides

big stuff, potentially blockers:

* might not be able to disable [donations](https:&#x2F;&#x2F;support.discord.com&#x2F;hc&#x2F;en-us&#x2F;articles&#x2F;360028038352-Server-Boosting-FAQ) ([reasoning](https:&#x2F;&#x2F;lobste.rs&#x2F;s&#x2F;95uler&#x2F;would%5Fthere%5Fbe%5Finterest%5Fpatreon%5Ffor#c%5F9l58ia))
* mobile client sends a notification by default for any activity  
   * painfully user-hostile and inappropriate for [Community Servers](https:&#x2F;&#x2F;support.discord.com&#x2F;hc&#x2F;en-us&#x2F;articles&#x2F;360047132851-Enabling-Your-Community-Server)
* slow even for a desktop GUI  
   * a loading interstitial! takes seconds on a fast connection and powerful desktop  
   * changing servers&#x2F;channels takes x00ms and regularly much more  
   * animated placeholders during delays  
   * mobile app is noticeably slower at everything
* countless distracting animations, mouseover popouts, and [mystery meat](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Mystery%5Fmeat%5Fnavigation)
* broken activity UI  
   * not clear whether a channel is selected or has activity, both use bold  
   * very flaky about marking channels as read (much worse on web than mobile)  
   * messages from blocked users still highlight channel as active
* actively hostile to 3rd party clients&#x2F;general hackery
* a serious culture clash that prompts most of the UI problems  
   * Discord is oriented to mass-appeal to passive consumption of games, gossip, and memes  
   * Lobsters is about creating, learning, sharing experiences&#x2F;expertise

smaller stuff, antifeatures:

* no active ruby bot library  
   * so almost every integration and workaround requires a 3rd-party service  
   * I’m sick of trying to keep a js service running, but maybe I’m just underwhelmed by the IRC library  
   * 355e3b notes [webhooks](https:&#x2F;&#x2F;support.discord.com&#x2F;hc&#x2F;en-us&#x2F;articles&#x2F;228383668-Intro-to-Webhooks) get us \~all current functionality so I demoted this out of blockers
* threads&#x2F;replies are clunky af  
   * feels like they were bolted on the UI and never really integrated; even slack is better
* much more spam
* stickers, inline images, animated emoji, link preview cards (can delete by bot)
* intrusive upsells in clients (these go away on paid servers, right?)
* can’t turn off external link [warnings](https:&#x2F;&#x2F;lobste.rs&#x2F;s&#x2F;eg2erk) even solely for our own site (sharing links is a core activity; we have sophisticated users)
* big company support (vs a libera admin is a lobsters user and active in the channel)  
   * forum is overwhelmed by support requests&#x2F;mental health crises  
   * no chance of reporting bugs or influencing features
* complicated subscription structure with unclear pricing (but probably &lt;$20&#x2F;m)
* users can’t export logs
* no TUI
* can’t disable X integration on profiles
* it’s so slow I have to list it a second time

## IRC Rebuttals

* Fix&#x2F;script your client  
   * This is “baby why do you make me hit you” levels of helpful.  
   * I would rather have one reasonable UI than have every user fail to reinvent the wheel.  
   * Bad out-of-the-box UI is why IRC has rounds-to-100% new user churn
* So the server&#x2F;client split…  
   * I am a user, not an implementer. This is a technical decision that seems to have permanently hamstrung development.  
   * It’s about as interesting and useful as a customer support line that refuses to help because you have the wrong department.
* Nickserv&#x2F;chanserv&#x2F;etc  
   * Bolting on features&#x2F;services via chatbot is powerful but bad UI (even when Discord does it!)  
   * The big difference is that IRC never integrates these into the core product
* IRC is open source&#x2F;open standard.  
   * It’s nice and I’m willing to take a haircut for it, but I’m ready to take off the hair shirt.  
   * But maybe being a protocol instead of a product is why it’s so far behind and not improving.
* IRC is volunteers&#x2F;PRs welcome  
   * IRC is a heroic accomplishment and should not be one  
   * My time is more valuable than my money. For our non-toy usage $50&#x2F;month barely registers as a cost.  
   * Especially compared to the cost of joining a multi-stakeholder consensus-mandatory process about the redesign of legacy software.
* IRCv3  
   * Mostly technical underpinnings with little addressing the feature gap.  
   * IRC is not closing the gap. Discord is very actively widening the gap.
* Discord is a single service run by a VC-funded business  
   * Lots of big, familiar privacy&#x2F;sustainability&#x2F;control risks here  
   * This also prompts [lots of the UI problems](https:&#x2F;&#x2F;nothinghuman.substack.com&#x2F;p&#x2F;the-tyranny-of-the-marginal-user)  
   * VC B2C orients to growth metrics, so quality will nosedive hard when growth plateaus and the established processes can’t adapt to that “failure”

## Underinformed Pontificating

Libera Chat isn’t at fault, incompetent, foolish, or anything else negative. Neither is the broader IRC community (well, aside from that one infamous guy, who is all of those things and more).

Most of IRC’s problems are structural.[Network effects](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Network%5Feffect) make chat valuable. But feature development has stalled beacuse it’s brutally hard to reach consensus. Maybe email and the web managed it because of competitive commercial use. Maybe the protocol isn’t as extensibile because it’s not as forgiving of unsupported features. There’s probably an amazing book waiting to be written about how open protocols and standards thrive or die.

Text-oriented group chat has products like Discord, Slack, Zulip, WhatsApp, Telegram, Messenger, WeChat, iMessage, GChat, Skype, Teams, Kik, Mattermost, Snapchat, Wickr, and then, you know, some small ones that only have tens of millions of active users. Nearly every human with a phone uses at least one. That’s a lot of room for open source and standards, and IRC seems to have attracted and extinguished potential development. Maybe the pressing thing to design is not a revised protocol but a process for sustaining consensus over revisions.

\[Edit: Chat discussion has pointed out to me that Matrix is an open standard. I really only know it from the not-so-pleasant bridge to Libera Chat. I feel pretty good about putting “underinformed” in this section heading.\]