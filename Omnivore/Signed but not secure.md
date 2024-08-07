---
id: 6ed815ce-e7c0-11ee-a785-5ffcc57a23e9
title: Signed but not secure
tags:
  - RSS
date_published: 2024-03-21 13:04:02
---

# Signed but not secure
#Omnivore

[Read on Omnivore](https://omnivore.app/me/signed-but-not-secure-18e62abe988)
[Read Original](https://blog.benjojo.co.uk/post/rpki-signed-but-not-secure)



![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sBm7B0X7Zu2-P8k1NVtoCI8dI0eWW0xbqJZ-l16OVEXs&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;JZQOsIkqkb)

At the start of the year a very interesting (and some would say inevitable) event happened involving internet routing security, the first case study of a large-scale victim of misapplication of RPKI occurred.

On January 3rd 2024, a malicious actor used credentials found on the public internet to log into Orange Spain’s RIPE account, [using their access they then created invalid RPKI ROAs that switched large amounts of IP space from RPKI unknown state to RPKI invalid state](https:&#x2F;&#x2F;benjojo.co.uk&#x2F;u&#x2F;benjojo&#x2F;h&#x2F;r1zj333N4L6cF7P1xv) by signing the IP space to an ASN that was not Orange’s.

This resulted in a large connectivity disruption for Orange Spain ([AS12479](https:&#x2F;&#x2F;bgp.tools&#x2F;as&#x2F;12479)), resulting in most of the estimated 9 million+ customers being without connectivity to many websites for 3 to 4 hours.

The following post has been adapted off the talks that I have given on this subject at [Peering Days 2024 in Krakow](https:&#x2F;&#x2F;peeringdays.eu&#x2F;) and the [NETNOD Meeting in Stockholm](https:&#x2F;&#x2F;www.netnod.se&#x2F;netnod-events&#x2F;netnod-meeting-2024), Since PeeringDays does not have public video recordings, and the NETNOD recording will take some time to appear, I feel like this is the best way to present this to more people.

## Timeline of events

* \[???\] Orange Spain employee has a compromised computer, and logs into their RIPE NCC Account with the password of “ripeadmin”
* \[???\] This password is eventually leaked to a publicly searchable engine of compromised credentials
* \[Jan 3 2024\] Malicious actor finds these credentials, and logs into Orange Spain’s RIPE NCC account, there is no 2FA enabled on the account
* \[09:38\] First changes to Orange’s RPKI are seen
* \[13:50\~\] Actor signs ROAs that points more than 2 Million IP’s to a non orange ASN
* \[14:30\] Orange Spain’s traffic is greatly impacted
* ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sB7MnPEiytB6oEoX87BtvgJUEK0JVlLFerLQsBYoQPRU&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;07kUP3ZcNs)
* \[17:30\~\] Malicious ROA is removed
* \[19:00\] Reachability mostly restored

There are some immediate lessons to be learned here,

* RIPE NCC did not enforce 2 Factor Authentication (2FA) for users with assets
* RIPE NCC did not have a way to force all members of an account to use 2FA
* It seems to have taken a long time for RIPE and&#x2F;or Orange to react to this incident
* Their NCC account ideally should not have also been compromised by malware (easier said than done) and certainly shouldn’t have had the password of “ripeadmin”

Using bgp.tools data, during the height of the outage the impacted prefixes were almost completely unreachable, except from a small amount of upstreams or peerings:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sKvh56qWV1_hdUGXuuBKA_lyWLjJm3TyVTmX8o7rXH2g&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;uhjIZq8tF3)

Networks that have direct Orange&#x2F;OpenTransit connectivity (and those who themselves are not doing Route Origin Validation (ROV)) would not have seen any disruption as it appears that AS5511 does not ROV filter their interconnects between their Spanish subsidiary.

In addition, other unimpacted networks include those who are not doing route origin validation such as DTAG (who have since announced they have deployed ROV) and TI Sparkle, who accepted the ROA Invalid route from AS5511.

However, given that the deployment of route origin validation has been greatly accelerating, this still resulted in a large amount of the internet being unable to reach Orange Spain.

This incident also gives us an opportunity to go and observe what large-scale networks would do in the case of a missigning event, so the question we will explore is…

## How fast did networks drop and restore?

Using reconstructed data from bgp.tools ( some BGP feeder sessions are recorded to disk meaning that they can be reconstructed ), we can look at the visibility of an impacted prefix from Orange Spain over time during the incident.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNb8nUNdE2nvCHUmnx_5wBFcqt-Bcc1yTHzFlHxOgkeg&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;9Mg3B4z5jY)

It’s hard to know exactly when the button to create the invalid ROA was pushed, however we can get a roundabout guess of 13:50 using the x509 certificate data and certificate revocation list information.

Here we see that it takes until 14:11 until networks actually start dropping the prefix from their routing tables. We can also see that visitability began to be restored at 17:47, with it taking about an hour for the majority of observing BGP feeds to see the prefix in their routing tables again.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5LDT8kRRZUMXNB7MTVkYlQ48Ka3en7yDkOQxxiVRicw&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;5mN8TyiOrH)

If we zoom into the “Visibility Descent” we can actually see that the drop of visibility was happened in stages, This is likely caused by different networks having different refresh times on the RPKI data source, and since every network resolves the RPKI data source themselves, we see a the drop is done in different stages as more and more networks (and their upstream networks) drop the route.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,srUTLcW93kuCdFZTBlGswP8hM9iFepEuD8GdDf6AFbK0&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;0ACUiZ2fNp)

Even in the middle of the traffic disruption, bgp.tools could still see nearly one third of networks had paths towards Orange Spain. While the data in here is almost definitely bias towards networks with extensive peering policies and multiple upstreams ( since by default bgp tools will only record data from paying customers, and hand selected sessions of interest ) it’s still worth considering how those 100 paths were still valid.

Roughly speaking, networks those 100 paths consisted of:

* Networks without RPKI ROV and Have AS5511 Transit&#x2F;Peering
* Peer with Orange Spain directly
* Have TATA&#x2F;DTAG or Hurricane Electric transit

Additionally as always there were a handful of bgp stuck routes, a long running issue [that I have been trying to](https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;post&#x2F;bgp-stuck-routes-tcp-zero-window) attack.

## A Interesting AWS RPKI ROV Quirk

Something worth observing as well is that during this outage Amazon Web Services (AWS) could still send data between Orange Spain. However it is known already that AWS does implement ROV (I ran an experiment to confirm it still works), so how could this be possible if AWS was correctly implementing RPKI ROV?

The answer that I got from somebody who was familiar with the matter was that Amazon appears to have a special (exclusive?) set of behaviour for not marking a prefix invalid if doing so would result in a large traffic shift. As far as I can understand this is the first time that the system has ever actually activated on their system and it correctly identified that it was not ideal to drop that route.

Would I recommend that systems implement such behaviour? No not really, this kind of behaviour could be extremely complicated and If it does not have continuous testing and maintenance could mean that a hijack could be accepted in a situation where it would be extremely suboptimal to do so.

## Mitigation Tactics if this happens to you

Obviously mistakes happen and if you yourself operate a network and are in the situation where “you” or a customer have a bad ROA there are tools within your RPKI software to fix this called S.L.U.R.M (Simplified Local internet nUmber Resource Management).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sGHgjl5Teb19LYs_gVx0sM913bYMq7jPsImg2XTrcicY&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;O8gmWhCaos)

SLURM allows you to either filter out RPKI data, or inject data in. Do you need more specific routes in your own network but you don’t want them to be accepted outside of your validators? No worries, you can add a better Maximum Prefix Length to your routes only within your network!

## New tooling on bgp.tools

Something I had issues with during this post was the lack of an easy to use historical RPKI search tool. So I made one for bgp.tools.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sfRjpw8Cx6LvzJDyh8Oi3qIV4sQK96HFOGxuYYT5BjTs&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;d2o2lyQQbT)

Using data from the [RIPE RPKI Archive](https:&#x2F;&#x2F;ftp.ripe.net&#x2F;rpki&#x2F;) and [RPKIViews](https:&#x2F;&#x2F;www.rpkiviews.org&#x2F;) I backfilled data from 2015-04 to Today, you can access this feature by either going to a IP Prefix on bgp.tools and looking at the “Validation” tab, and clicking the history link:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sD6Mvh9dmvQ8atJpm8-T0kYN2Sdh6tubT2N3yORAbnwU&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;3sQ4SjLbKZ)

Or you can go to the feature directly: &lt;https:&#x2F;&#x2F;bgp.tools&#x2F;rpki-history?cidr&#x3D;91.198.241.0%2f24&amp;asn&#x3D;206924&gt;

---

If you want to stay up to date with the blog you can use the RSS feed or you can follow me on [Fediverse @benjojo@benjojo.co.uk](https:&#x2F;&#x2F;benjojo.co.uk&#x2F;u&#x2F;benjojo)

Until next time!