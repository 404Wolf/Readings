---
id: a1709e6e-dbf6-11ee-a440-9b8c248789b4
title: app architecture
tags:
  - RSS
date_published: 2024-03-06 14:07:03
---

# app architecture
#Omnivore

[Read on Omnivore](https://omnivore.app/me/app-architecture-18e156a7120)
[Read Original](https://bytes.zone/micro/thing-a-month-03-03/)



_Brian Hicks, March 6, 2024_

So, a little news to start: I decided on a name for this project and bought a domain. [tinyping.net](https:&#x2F;&#x2F;tinyping.net&#x2F;) is now receiving traffic (but just linking back to bytes.zone for the moment.) But today I want to write about the ideal architecture!

Part of the thing-a-month project is to pare down my ideas to the minimum that I can actually achieve in a month. I thought that was going to be easy on this project, but then I got to thinking about data governance and privacy balanced with long-term sustainability as a service. Let&#39;s think about how someone might use this app:

1. They sign up, get whatever app installed and authed, whatever.
2. They start answering pings
3. They look at reports on how they&#39;re using their time
4. Repeat, hypothetically forever (but actually who knows how long)

Questions about privacy and sustainability come up before the beginning, and in between each of those steps. For example:

* What does sign up look like? Is it a website, an app, or some combination?
* Where does ping data live? Who gets to read it? How is sensitive data (how people are spending their time) protected?
* Who bears the cost for a constantly (but slowly) growing data set?

Let&#39;s work out a couple scenarios. First, what&#39;s the answer if this is a purely-local app? Say it&#39;s on your phone (just to make it available everywhere, since people keep their phones close.) The answers to these questions would be:

* **What does sign up look like?** Purchasing an app from an app store.
* **Where does ping data live?** Local storage, or perhaps in the OS&#39; persistent storage (e.g. iCloud)
* **Who gets to read ping data?** Only the person who enters it.
* **How is sensitive data protected?** App sandboxes, I guess? Could also be encrypted at rest if that&#39;s something we&#39;re interested in. Only has to be readable when the app is open.
* **Who bears the cost for the storing the data set?** The person who owns the device it&#39;s stored on.

That doesn&#39;t seem so bad, but this is where I hit some scope creep. I&#39;d like this data to sync between my phone and computers somehow. I&#39;m on my work laptop for most of the workday, on my phone in the evenings, and on my personal laptop when I&#39;m doing things like blogging or working on projects like this. I want to track all that time!

One way to do this might be to consider making this a web app instead of a local-only app. Then the answers might look like this:

* **What does sign up look like?** Some SaaS signup tactic. Username&#x2F;password, OAuth, magic email links, passkeys, whatever.
* **Where does ping data live?** In a database that I control.
* **Who gets to read ping data?** The person who enters it, plus hypothetically me the system administrator, plus hypothetically other people due to bugs or misconfigurations.
* **How is sensitive data protected?** &quot;best practices.&quot; I kid, but it&#39;s at least a little earnest… making sure data in the database is encrypted at rest, controlling access, things like that.
* **Who bears the cost for the storing the data set?** I do! And because of that my costs go up and one-time purchases become less sustainable (since I&#39;d have a constant stream of cost paired with an intermittent stream of revenue.)
* **New question: will this work on a plane?** Not without buying wifi!

That seems worse on first read. It does have some clear benefits, though: there aren&#39;t nearly as many gatekeepers for web apps, and I wouldn&#39;t have to pay platform fees on sales (other than, say, Stripe&#39;s normal fees.) But I have a hard time thinking this is the _best_ way forward.

But what about a hybrid approach? Local-first software is looking pretty good these days. What if the client stored its own data and then could sync with a server to get the data everywhere? Seems like that could work alright. Then what if the tags were encrypted somehow and could only be decrypted by the user on their devices? Then…

* **What does sign up look like?** Still a SaaS signup tactic.
* **Where does ping data live?** In a database that I control.
* **Who gets to read ping data?** The person who enters it, plus hypothetically someone in the far future who can break the encryption.
* **How is sensitive data protected?** The data is encrypted everywhere but where the app is actually running.
* **Who bears the cost for the storing the data set?** Joint responsibility. Each client would be responsible for hosting all of its data, plus I&#39;d store a copy too to facilitate syncing.
* **Will this work on a plane?** Sure would!

That makes me think that the way to get started here might be a local-first PWA. That&#39;d allow you to get pings immediately, and then later be able to sync them with a server when that exists. That makes signup a little annoying (since all the data lives on your device anyway) so maybe the first version of this could just be an open thing? Or maybe that&#39;s how I&#39;d make a trial available… use this for a while on your own device, but if you want backups and sync then there&#39;s a fee (seems like this works fine for Obsidian!)