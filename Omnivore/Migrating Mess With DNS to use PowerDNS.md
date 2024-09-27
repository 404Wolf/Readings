---
id: e600e9da-b34d-4383-a514-66112f54f9e0
title: Migrating Mess With DNS to use PowerDNS
tags:
  - RSS
date_published: 2024-08-19 08:15:28
---

# Migrating Mess With DNS to use PowerDNS
#Omnivore

[Read on Omnivore](https://omnivore.app/me/migrating-mess-with-dns-to-use-power-dns-1916d073a57)
[Read Original](https://jvns.ca/blog/2024/08/19/migrating-mess-with-dns-to-use-powerdns/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

About 3 years ago, I announced [Mess With DNS](https:&#x2F;&#x2F;messwithdns.net&#x2F;) in[this blog post](https:&#x2F;&#x2F;jvns.ca&#x2F;blog&#x2F;2021&#x2F;12&#x2F;15&#x2F;mess-with-dns&#x2F;), a playground where you can learn how DNS works by messing around and creating records.

I wasn’t very careful with the DNS implementation though (to quote the release blog post: “following the DNS RFCs? not exactly”), and people started reporting problems that eventually I decided that I wanted to fix.

### the problems

Some of the problems people have reported were:

* domain names with underscores weren’t allowed, even though they should be
* If there was a CNAME record for a domain name, it allowed you to create other records for that domain name, even if it shouldn’t
* you could create 2 different CNAME records for the same domain name, which shouldn’t be allowed
* no support for the SVCB or HTTPS record types, which seemed a little complex to implement
* no support for upgrading from UDP to TCP for big responses

And there are certainly more issues that nobody got around to reporting, for example that if you added an NS record for a subdomain to delegate it, Mess With DNS wouldn’t handle the delegation properly.

### the solution: PowerDNS

I wasn’t sure how to fix these problems for a long time – technically I_could_ have started addressing them individually, but it felt like there were a million edge cases and I’d never get there.

But then one day I was chatting with someone else who was working on a DNS server and they said they were using [PowerDNS](https:&#x2F;&#x2F;github.com&#x2F;PowerDNS&#x2F;pdns&#x2F;): an open source DNS server with an HTTP API!

This seemed like an obvious solution to my problems – I could just swap out my own crappy DNS implementation for PowerDNS.

There were a couple of challenges I ran into when setting up PowerDNS that I’ll talk about here. I really don’t do a lot of web development and I think I’ve never built a website that depends on a relatively complex API before, so it was a bit of a learning experience.

### challenge 1: getting every query made to the DNS server

One of the main things Mess With DNS does is give you a live view of every DNS query it receives for your subdomain, using a websocket. To make this work, it needs to intercept every DNS query before they it gets sent to the PowerDNS DNS server:

There were 2 options I could think of for how to intercept the DNS queries:

1. dnstap: &#x60;dnsdist&#x60; (a DNS load balancer from the PowerDNS project) has support for logging all DNS queries it receives using[dnstap](https:&#x2F;&#x2F;dnstap.info&#x2F;), so I could put dnsdist in front of PowerDNS and then log queries that way
2. Have my Go server listen on port 53 and proxy the queries myself

I originally implemented option #1, but for some reason there was a 1 second delay before every query got logged. I couldn’t figure out why, so I implemented my own [very simple proxy](https:&#x2F;&#x2F;github.com&#x2F;jvns&#x2F;mess-with-dns&#x2F;blob&#x2F;3423c9496dd772f7157a56f9e068fd926e89c331&#x2F;api&#x2F;main.go#L265-L310) instead.

### challenge 2: should the frontend have direct access to the PowerDNS API?

The frontend used to have a lot of DNS logic in it – it converted emoji domain names to ASCII using punycode, had a lookup table to convert numeric DNS query types (like &#x60;1&#x60;) to their human-readable names (like &#x60;A&#x60;), did a little bit of validation, and more.

Originally I considered keeping this pattern and just giving the frontend (more or less) direct access to the PowerDNS API to create and delete, but writing even more complex code in Javascript didn’t feel that appealing to me – I don’t really know how to write tests in Javascript and it seemed like it wouldn’t end well.

So I decided to take all of the DNS logic out of the frontend and write a new DNS API for managing records, shaped something like this:

* &#x60;GET &#x2F;records&#x60;
* &#x60;DELETE &#x2F;records&#x2F;&lt;ID&gt;&#x60;
* &#x60;DELETE &#x2F;records&#x2F;&#x60; (delete all records for a user)
* &#x60;POST &#x2F;records&#x2F;&#x60; (create record)
* &#x60;POST &#x2F;records&#x2F;&lt;ID&gt;&#x60; (update record)

This meant that I could actually write tests for my code, since the backend is in Go and I do know how to write tests in Go.

### what I learned: it’s okay for an API to duplicate information

I had this idea that APIs shouldn’t return duplicate information – for example if I get a DNS record, it should only include a given piece of information once.

But I ran into a problem with that idea when displaying MX records: an MX record has 2 fields, “preference”, and “mail server”. And I needed to display that information in 2 different ways on the frontend:

1. In a form, where “Preference” and “Mail Server” are 2 different form fields (like &#x60;10&#x60; and &#x60;mail.example.com&#x60;)
2. In a summary view, where I wanted to just show the record (&#x60;10 mail.example.com&#x60;)

This is kind of a small problem, but it came up in a few different places.

I talked to my friend Marco Rogers about this, and based on some advice from him I realized that I could return the same information in the API in 2 different ways! Then the frontend just has to display it. So I started just returning duplicate information in the API, something like this:

&#x60;&#x60;&#x60;less
{
  values: {&#39;Preference&#39;: 10, &#39;Server&#39;: &#39;mail.example.com&#39;},
  content: &#39;10 mail.example.com&#39;,
  ...
}

&#x60;&#x60;&#x60;

I ended up using this pattern in a couple of other places where I needed to display the same information in 2 different ways and it was SO much easier.

I think what I learned from this is that if I’m making an API that isn’t intended for external use (there are no users of this API other than the frontend!), I can tailor it very specifically to the frontend’s needs and that’s okay.

### challenge 3: what’s a record’s ID?

In Mess With DNS (and I think in most DNS user interfaces!), you create, add, and delete **records**.

But that’s not how the PowerDNS API works. In PowerDNS, you create a **zone**, which is made of **record sets**. Records don’t have any ID in the API at all.

I ended up solving this by generate a fake ID for each records which is made of:

* its **name**
* its **type**
* and its **content** (base64-encoded)

For example one record’s ID is &#x60;brooch225.messwithdns.com.|NS|bnMxLm1lc3N3aXRoZG5zLmNvbS4&#x3D;&#x60;

Then I can search through the zone and find the appropriate record to update it.

This means that if you update a record then its ID will change which isn’t usually what I want in an ID, but that seems fine.

### challenge 4: making clear error messages

I think the error messages that the PowerDNS API returns aren’t really intended to be shown to end users, for example:

* &#x60;Name &#39;new\032site.island358.messwithdns.com.&#39; contains unsupported characters&#x60; (this error encodes the space as &#x60;\032&#x60;, which is a bit disorienting if you don’t know that the space character is 32 in ASCII)
* &#x60;RRset test.pear5.messwithdns.com. IN CNAME: Conflicts with pre-existing RRset&#x60; (this talks about RRsets, which aren’t a concept that the Mess With DNS UI has at all)
* &#x60;Record orange.beryl5.messwithdns.com.&#x2F;A &#39;1.2.3.4$&#39;: Parsing record content (try &#39;pdnsutil check-zone&#39;): unable to parse IP address, strange character: $&#x60; (mentions “pdnsutil”, a utility which Mess With DNS’s users don’t have access to in this context)

I ended up handling this in two ways:

1. Do some initial basic validation of values that users enter (like IP addresses), so I can just return errors like &#x60;Invalid IPv4 address: &quot;1.2.3.4$&#x60;
2. If that goes well, send the request to PowerDNS and if we get an error back, then do some [hacky translation](https:&#x2F;&#x2F;github.com&#x2F;jvns&#x2F;mess-with-dns&#x2F;blob&#x2F;c02579190e103218b2c8dfc6dceb19f863752f15&#x2F;api&#x2F;records&#x2F;pdns%5Ferrors.go) of those messages to make them clearer.

Sometimes users will still get errors from PowerDNS directly, but I added some logging of all the errors that users see, so hopefully I can review them and add extra translations if there are other common errors that come up.

I think what I learned from this is that if I’m building a user-facing application on top of an API, I need to be pretty thoughtful about how I resurface those errors to users.

### challenge 5: setting up SQLite

Previously Mess With DNS was using a Postgres database. This was problematic because I only gave the Postgres machine 256MB of RAM, which meant that the database got OOM killed almost every single day. I never really worked out exactly why it got OOM killed every day, but that’s how it was.

So for this refactor I decided to use SQLite instead, because the website doesn’t really get that much traffic. There are some choices involved with using SQLite, and I decided to:

1. Run &#x60;db.SetMaxOpenConns(1)&#x60; to make sure that we only open 1 connection to the database at a time, to prevent &#x60;SQLITE_BUSY&#x60; errors from two threads trying to access the database at the same time (just setting WAL mode didn’t work)
2. Use separate databases for each of the 3 tables (users, records, and requests) to reduce contention. This maybe isn’t really necessary, but there was no reason I needed the tables to be in the same database so I figured I’d set up separate databases to be safe.
3. Use the cgo-free [modernc.org&#x2F;sqlite](https:&#x2F;&#x2F;pkg.go.dev&#x2F;modernc.org&#x2F;sqlite?utm%5Fsource&#x3D;godoc), which [translates SQLite’s source code to Go](https:&#x2F;&#x2F;datastation.multiprocess.io&#x2F;blog&#x2F;2022-05-12-sqlite-in-go-with-and-without-cgo.html). I might switch to a more “normal” sqlite implementation instead at some point and use cgo though. I think the main reason I prefer to avoid cgo is that cgo has landed me with [difficult-to-debug errors in the past](https:&#x2F;&#x2F;jvns.ca&#x2F;blog&#x2F;2021&#x2F;11&#x2F;17&#x2F;debugging-a-weird--file-not-found--error&#x2F;).
4. use WAL mode

I still haven’t set up backups, though I don’t think my Postgres database had backups either. I think I’m unlikely to use[litestream](https:&#x2F;&#x2F;litestream.io&#x2F;) for backups – Mess With DNS is very far from a critical application, and I think daily backups that I could recover from in case of a disaster are more than good enough.

### challenge 6: upgrading Vue &amp; managing forms

This has nothing to do with PowerDNS but I decided to upgrade Vue.js from version 2 to 3 as part of this refresh. The main problem with that is that the form validation library I was using (FormKit) completely changed its API between Vue 2 and Vue 3, so I decided to just stop using it instead of learning the new API.

I ended up switching to some form validation tools that are built into the browser like &#x60;required&#x60; and &#x60;oninvalid&#x60; ([here’s the code](https:&#x2F;&#x2F;github.com&#x2F;jvns&#x2F;mess-with-dns&#x2F;blob&#x2F;90f7a2d2982c8151a3ddcab532bc1db07a043f84&#x2F;frontend&#x2F;components&#x2F;NewRecord.html#L5-L8)). I think it could use some of improvement, I still don’t understand forms very well.

### challenge 7: managing state in the frontend

This also has nothing to do with PowerDNS, but when modifying the frontend I realized that my state management in the frontend was a mess – in every place where I made an API request to the backend, I had to try to remember to add a “refresh records” call after that in every place that I’d modified the state and I wasn’t always consistent about it.

With some more advice from Marco, I ended up implementing a single global[state management store](https:&#x2F;&#x2F;github.com&#x2F;jvns&#x2F;mess-with-dns&#x2F;blob&#x2F;90f7a2d2982c8151a3ddcab532bc1db07a043f84&#x2F;frontend&#x2F;store.ts#L32-L44)which stores all the state for the application, and which lets me create&#x2F;update&#x2F;delete records.

Then my components can just call &#x60;store.createRecord(record)&#x60;, and the store will automatically resynchronize all of the state as needed.

### challenge 8: sequencing the project

This project ended up having several steps because I reworked the whole integration between the frontend and the backend. I ended up splitting it into a few different phases:

1. Upgrade Vue from v2 to v3
2. Make the state management store
3. Implement a different backend API, move a lot of DNS logic out of the frontend, and add tests for the backend
4. Integrate PowerDNS

I made sure that the website was (more or less) 100% working and then deployed it in between phases, so that the amount of changes I was managing at a time stayed somewhat under control.

### the new website is up now!

I released the upgraded website a few days ago and it seems to work! The PowerDNS API has been great to work on top of, and I’m relieved that there’s a whole class of problems that I now don’t have to think about at all, other than potentially trying to make the error messages from PowerDNS a little clearer. Using PowerDNS has fixed a lot of the DNS issues that folks have reported in the last few years and it feels great.

If you run into problems with the new Mess With DNS I’d love to [hear about them here](https:&#x2F;&#x2F;github.com&#x2F;jvns&#x2F;mess-with-dns&#x2F;issues&#x2F;).