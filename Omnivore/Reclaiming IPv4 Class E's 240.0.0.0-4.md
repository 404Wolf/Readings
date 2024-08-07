---
id: 19fa1396-f3f2-40f7-8231-1cacb5925917
title: Reclaiming IPv4 Class E's 240.0.0.0/4
tags:
  - RSS
date_published: 2024-05-27 11:02:20
---

# Reclaiming IPv4 Class E's 240.0.0.0/4
#Omnivore

[Read on Omnivore](https://omnivore.app/me/reclaiming-i-pv-4-class-e-s-240-0-0-0-4-18fbadb1994)
[Read Original](https://blog.benjojo.co.uk/post/class-e-addresses-in-the-real-world)



![social medai](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,srNppL6H0uc00KfY0BQFTrBBUvb9j_0mdMx7LkuBnek4&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;zwn3aTE6nw)

Ever since the supply of fresh IPv4 address blocks was depleted there has been a number of interesting market changes, mostly around the costs to either acquire or lease IPv4 address blocks. Since the demand for IPv4 addressing has not changed that much, prices have gone up, and more providers like AWS, Hetzner, OVH, etc who were previously pricing in the cost of IPv4, are now charging for it separately.

For some people this has been a bit of a pay day, while if you were to have had a block assigned to you in 2016, you would have gotten 4 &#x2F;24’s (a &#x2F;24 is the minimum you can reasonably route on the BGP backed internet), however if you were setting up shop in the 2000’s you could easily acquire a 256 &#x2F;24’s in a single allocation!

These entities are now selling off (if they can) these blocks at prices 10,000+ USD per &#x2F;24!

But for other networks this development in pricing has been devastating to the costs of business, industries that were used to assigning a single IPv4 address (or more) to every subscriber began to find that this model is unsustainable, and have had no option other than to deploy Carrier Grade NAT.

So what if we technically had another 524288 &#x2F;24’s worth of IPv4 hanging around in standardisation limbo? It turns out, we do! It’s called “Class E space”

## The IPv4 Class E Origin Story

Class E space as defined in [RFC1112](https:&#x2F;&#x2F;www.rfc-editor.org&#x2F;rfc&#x2F;rfc1112.html) lives at the end of IPv4 address space between 240.0.0.0 and 255.255.255.254, Right after the space used for IPv4 multicast. This space in this state has existed since 1989, however it has been mostly ignored as a relic of time until the existing IPv4 unicast space allocations had been mostly assigned.

Class E is not actually the only space that is now being reviewed. During the standardisation of where IPv4 blocks would go, several unnecessarily large allocations were made due to technical limitations at the time. Some obvious ones include 0.0.0.0&#x2F;8 (A block where 0.0.0.0&#x2F;24 would have been sufficient in hindsight), and 127.0.0.0&#x2F;8 (the local loopback block, where 127.0.0.0&#x2F;16 would have been sufficient).

Since the internet was at the start not obviously going to be used, the minimum allocation size for an address block was a &#x2F;8 at the start, later on we got “classful” allocations where a &#x2F;16 would be assigned instead (this is why you often see &#x2F;16s assigned to universities or institutions of similar ages), later on we moved to being able to assign &#x2F;24’s, later on the internet moved to [CIDR](https:&#x2F;&#x2F;datatracker.ietf.org&#x2F;doc&#x2F;html&#x2F;rfc1519)’s to better address various addressing needs. However the older allocations for 0.0.0.0&#x2F;8, 127.0.0.0&#x2F;8, and 240.0.0.0&#x2F;4 were never revisited.

The best I can understand from talking to people. 240.0.0.0&#x2F;4 was assigned for a future where a 3rd (and still mythical) type of routing was invented that was not unicast or multicast.

While there are somewhat ongoing efforts to see 0.0.0.0&#x2F;8, 127.0.0.0&#x2F;8 become routable unicast space, I will focus for the rest of this post on 240.0.0.0&#x2F;4, since it is the largest, and most technically interesting, not to mention that Class E’s reimplementation as unicast space shares almost all of the same issues as the other blocks.

## Realistic expectations

Ultimately the answer to the depletion of IPv4 and its effects on the wider ability for networks to acquire IPv4 space, is to deploy IPv6\. However since IPv6 requires all networks to also implement, networks are likely going to see a need for at least some IPv4 space for a very long time, even if it is relegated to increasingly slower and unreliable CGNAT technologies.

As for Class E space, it is unlikely that we will ever see such space widely accepted into the internet routing table. This is because of known equipment and endpoint incompatibilities that already exist today that would have to be overcome globally, and doing any upgrade action on the internet globally is nearly impossible. Because of this, even if people were offered Class E space it is unclear who would want IP addresses that only work for a subset of users (there is a joke somewhere here that we already have this, it’s called IPv6!)

## Class E as a local unicast space

However global routing is not the only usage for IP addresses, plenty of addresses get consumed today in local networks, or for network infrastructure itself! Since these use cases tend to use [RFC1918](https:&#x2F;&#x2F;www.rfc-editor.org&#x2F;rfc&#x2F;rfc1918.html) (10.0.0.0, 192.168.0.0, etc space), it is unlikely we will see such tech deployed in the home.

However there are a number of places where you can easily “run out” of local addresses. For that, Class E space is a useful addition due to its size and its implicit incompatibilities with the rest of the world. This allows you to build out a large network with these addresses, and save the address space that is usable for interoperation with other networks or customer equipment.

We already see some uses of this today, For example:

* [AWS uses 240.0.0.0&#x2F;4 for some of their network devices](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;0tcR-iQce7s&amp;t&#x3D;1709s)
* [Evidence of Class E space usage in some home&#x2F;SMB has been spotted](https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;post&#x2F;ip-address-squatting)
* [Some non AWS networks are also using Class E space](https:&#x2F;&#x2F;labs.ripe.net&#x2F;author&#x2F;qasim-lone&#x2F;2404-as-seen-by-ripe-atlas&#x2F;)
* [“Fan” networking by Canonical uses Class E space](https:&#x2F;&#x2F;canonical.com&#x2F;blog&#x2F;introducing-the-fan-simpler-container-networking)

In addition, Cloudflare has a option to have [IPv6 addresses hashed into a Class E address](https:&#x2F;&#x2F;developers.cloudflare.com&#x2F;network&#x2F;pseudo-ipv4&#x2F;) as a way to allow systems not capable of handling IPv6 addresses to still be accessed with IPv6, this is ultimately a huge hack, and it’s unclear if anyone seriously uses this feature.

## How is vendor support?

Any deployment discussion is only academic if we do not have equipment that is capable of handling such addresses. At the time of writing, the support for such addresses is quite patchy.

Endpoint (aka, users) software that works:

* Linux distros post 2008
* Android 2009
* MacOS&#x2F;OSX post 2009 (with Apple iOS being included)
* OpenBSD post October 2022

Endpoint stuff that does not work:

* All known Windows versions
* NetBSD&#x2F;FreeBSD

For actual networking equipment, the story is more complicated. To test compatibility I built a virtual network vendor testing lab:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sxVJk4sVFL68RnlAduUZVrSkQjgDhkB4Jks9eeuou858&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;ys4UwXWEYZ)

The goal is to test two questions

1. Can Class E be used for addresses between routers?
2. Can Class E be used with routing protocols like OSPF and BGP?

Some router vendors are able to set Class E addresses out of the box, others need special configuration. For example JunOS needs &#x60;routing-options martians 240&#x2F;4 orlonger allow&#x60; to be set in configuration before such addresses are allowed, similarly Arista EOS needs &#x60;use ipv4 routable 240.0.0.0&#x2F;4&#x60; set before Class E addresses are accepted.

Other vendors flat out refuse to set Class E addresses on their interfaces.

The other question is that if dynamic routing protocols correctly function when Class E CIDRs are used? The answer is, sometimes:

| Vendor             | Static Link IP     | Routed OSPF Works |
| ------------------ | ------------------ | ----------------- |
| Arista EOS 4.29    | Yes (Extra Config) | Unknown           |
| JunOS 22           | Yes (Extra Config) | Yes               |
| RouterOS 7.7       | Yes                | Yes               |
| Cisco IOS XR       | Yes                | Yes               |
| Cisco IOS XE 16.12 | No                 | No                |
| Nokia SR-OS 21.7   | No                 | No                |
| Huawei VRP         | No                 | No                |
| Extreme EXOS 32    | No                 | No                |

However, there are some very sharp edges to using protocols like OSPF&#x2F;IS-IS with such address space that you should be aware of if you are planning to deploy this in your own environment:

## OSPF Surprises

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sWVuPEzQ8R5Gfmvqc6OV9VlEKjtiQQw6q4uVTeVbPVE4&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;52oVWQIdbp)

In the following example, we have two routers, one that supports Class E space being installed into the data (forwarding) plane, and the other (Nokia) that does not. However, because of how OSPF works, the routes will be carried by the Nokia router as if it can route for them, but since it never installs these routes it will drop traffic for it. (or worse, use a default route instead)

If ask the MikroTik to traceroute to a class E address that is behind the Nokia router, it knows to try and send it to the Nokia router, however the traffic is lost, when trying the same with a “regular” unicast address (of 6.6.6.6), then traffic is forwarded:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,svbxFqDlGG0KnpnYZF6jqdQqzXQFT7vI4CGI-9F822Pg&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;mpxz2aXZwO)

This means that if you wish to deploy Class E space in such an environment, you must be sure that all devices in the path (and possible backup paths) can support it, else traffic may be dropped when they get used.

## Surprise real world test

Because of the previously mentioned issues, I would not have thought it was worthwhile to try and test in in the real world, however you can imagine my surprise that a few days afterwards I got this email from a Internet Exchange mailing list

&#x60;&#x60;&#x60;routeros
Dear peering partners,

We started to announce a prefix 242.242.0.0&#x2F;16 from our experimental ASN
8747.  242.242.1.1 should be pingable if such a route passes your
filters and router setup.

Current test results are that IOS XR supports class E routes with no
issues by default. With JunOS, using a command &quot;set routing-options
martians&quot; etc. is necessary.  Your feedback regarding other platforms is
appreciated.


--
S pozdravem&#x2F;Best Regards,

Zbyněk Pospíchal
Quantcom, a.s.

&#x60;&#x60;&#x60;

This was super surprising to see! Quantcom staff had decided to give Class E a go, and since they had real customers with RIPE Atlas probes, we could run “best case” tests to see how real “SOHO” hardware handled class E space:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sxPBcqdOwDkgCC_-ahdNgW4_TjZIjnIQVWZ1JOAmiHUA&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;9RUe9SWzhS)

… and it was about 50%, not terrible, but still far away from the numbers you would want to see. Usefully Quantcom also have BGP downstreams with RIPE Atlas probes, so I tested those too:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,svP1pWQOagObMFcviGPvjFuQwjVTk0adPRP3S8AOlEoI&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;lbTWR7NLeW)

Also 50%! Since most RIPE Atlas hardware is deployed inside homes and small businesses we can predict that if Class E was deployed today, the maximum acceptance on end devices is about 50%

I got in touch with Zbyněk from Quantcom, and he agreed to setup a IPv4 scan of the internet from the announced Class E space. This is helpful because it allows us to determine which of Quantcom’s BGP peers accepted the prefix (Implying a total lack of BGP filtering), and whose infrastructure can actually route class E IP addresses.

The scan concluded that 184,496 IP addresses responded to the ping, using bgp.tools’es [map data](https:&#x2F;&#x2F;map.bgp.tools&#x2F;) we would expect a fully reachable prefix to have 380,286,307 responses, so this puts the full reachability of this test Quantcom prefix at 0.04%.

This low reachability is without a doubt caused by the fact that Quantcom can only give the test prefix to their downstreams and direct BGP peers over internet exchanges, since their transit providers and internet exchange route servers will filter this out automatically preventing other networks from learning the prefix.

Networks that seem to have accepted the prefix directly include:

* AS2686 AT&amp;T EMEA
* AS3216 VEON &#x2F; Beeline &#x2F; VimpelCom
* AS5416 Bahrain Telecommunications Company
* AS6740 InterneXt 2000
* AS8926 Moldtelecom
* AS9050 Orange Romania
* AS13335 Cloudflare (Prague PoP only)
* AS16625 Akamai
* AS19281 Quad9
* AS20485 TransTeleKom (and some of their downstreams)
* AS25424 InterneXt
* AS28725 CETIN

Some of these results surprised me, since they imply that for these networks involved, you could announce almost anything (maybe not RPKI invalids, who knows though) and they would accept and propagate across their network, including their downstreams!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sHjXNDCfsLYTDpnOnEG4Rck8XZFmllRi-1HOtB3bhVNc&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;OwaPhiDY9v)

In the case of AS20485 TransTeleKom, their acceptance of the route allowed the bulk of the 184,496 IP’s to be able to respond. As I have only listed the networks that appear to have directly accepted the route over an IXP.

Maybe we still have a long way to go with BGP filtering in practice! It is also entirely possible that more networks that directly peer with Quantcom would have accepted this route if it was better supported by vendors out of the box.

Closing up, we can now better answer the root question of this entire post…

## Should you use Class E space?

The short version is, Typically no. Unless you have supernatural control of your network vendor decisions, and cannot migrate to IPv6 for all workloads. However Class E could be very useful if you have control over your entire network for the use cases of local&#x2F;private addressing.

As for Class E being globally reachable space, It is clear that there lies ahead major roadblocks for Class E space adoption. Not only does it require changes to user software that has an installation count of at least 1 billion, but it also requires that a policy be created within IANA and the IETF to change the purpose of this space.

Now, Having gone through the IETF recently for something unrelated to this, I can only assume that if such a thing is ever accepted, it would be a considerably long battle. It also opens up a second battle over what regional RIRs get the newly created address space. There are 5 RIRs, but 8 &#x2F;8’s worth of address space up for grabs in Class E. It is not clear how you would split this up.

Finally, changing software is extremely hard, and getting Class E prompts some extremely difficult software deployment challenges. Since the customers&#x2F;members of the RIRs would be reluctant to accept address space that does not work for all users. If we are going to start using address space that might not work for all users, it would be wise to pick the address space that we already have a considerable head start on getting accepted: IPv6.

---

If you want to stay up to date with the blog you can use the [RSS feed](https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;rss.xml) or you can follow me on Fediverse [@benjojo@benjojo.co.uk](https:&#x2F;&#x2F;benjojo.co.uk&#x2F;u&#x2F;benjojo)!

Until next time!