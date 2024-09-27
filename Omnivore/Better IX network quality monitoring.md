---
id: 6a002980-4441-4046-a8ed-4e7786389363
title: Better IX network quality monitoring
tags:
  - RSS
date_published: 2024-08-22 07:04:15
---

# Better IX network quality monitoring
#Omnivore

[Read on Omnivore](https://omnivore.app/me/better-ix-network-quality-monitoring-1917a11c0cb)
[Read Original](https://blog.benjojo.co.uk/post/ixp-xping-better-ix-monitoring)



This post is a textual version of a talk I gave at [the first NetUK](https:&#x2F;&#x2F;www.netuk.org&#x2F;). You can watch the talk on YouTube that was recorded by the wonderful AV team below if that’s your preferred medium:

[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sMBnTrMskGp0M--x6wsw5tF00ohAyfWZt62jKuhN5la0&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;ZSLye43NA8)](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;jXOx9qVYKUQ)

---

Large [Internet eXchange](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Internet%5Fexchange%5Fpoint) (IX) LAN’s have long often been more than “just” simple Ethernet broadcast domains, either due to the need to scale up in bits per second, or just the need to make an Ethernet (a non loop tolerant system) domain appear in more than two locations without creating loops (and avoiding Spanning Tree).

So instead a lot of exchanges run behind some kind of overlay network, where packets are first encapsulated in VXLAN,MPLS or similar tech and routed around the network.

This often however means that in order for links to load balance correctly, the equipment servicing the customer facing “Ethernet switched fabric” needs to inspect the actual customer traffic IP Source&#x2F;Destination and TCP&#x2F;UDP Source&#x2F;Destination ports so that it can balance traffic, so while the ethernet IX _should_ only care about source&#x2F;destination MAC addresses, it will actually use far more than that transparently to the customers.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sjAduB_TnwyUSO7kPhqF9hg2ncZK_r0Fu_Or4I34ClLU&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;761xArBlqW)

## “Standard” Monitoring

This complicates (among many other things) monitoring service quality on these exchanges.

If we imagine a internet exchange like my clients, they have many Points Of Presence (PoPs) where customers can connect in, and as far as the customer cares, these are all connected to each other in a magic way that does not functionally concern the customer equipment:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sIxabpdktcatgMGf2t-UqBSZlkhU-bbVm6isIn-ywJlY&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;pl9GyQkbrh)

So if you were to setup basic monitoring for ensuring that all members get to all other members in a timely (in microseconds) and reliable (in lack of packet loss) manner you may consider just doing an ICMP to a device connected to each PoP. This however hides the modern day complexity of IX design, since ICMP packets are not typically included in link hashing implementations, all ICMP traffic follows a single and mostly static path.

This leaves operators with a large blind spot if behind the scenes your exchange looks like this:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s0Q7akomuqfDz2Uunn1uhJXv7Ip7p0HB8NZoqQxnLeas&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;5WBjKq7w6V)

Here each PoP is connected to two different Spine switches, over many 100G (or faster) links.

I did some contracting work for [LONdon Access Point (LONAP)](https:&#x2F;&#x2F;www.lonap.net&#x2F;) to design a system that could detect high latency and more critically packet loss on a per flow basis, and figured it was worth sharing the details on what I came up with and how it works, as while this problem is not a novel one (many IXs have some form of flow aware monitoring), Most solutions are a turn key appliance box. The thing is, this is not actually that hard of a problem, and good and transparent deployment of these metrics can quickly answer for the customer the “Am I broken or is the IX broken?” question, maybe even without the customer sending a support email!

## Existing solutions

I will never claim to have the first flow-aware network quality monitoring system, there is [Automattic’s Pingo](https:&#x2F;&#x2F;github.com&#x2F;Automattic&#x2F;pingo) project that can gather per flow latency&#x2F;loss data. However Pingo requires [Policy Based Routing](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Policy-based%5Frouting) to work correctly. Something that is possible if you have control over the IP layer (in the case of internet carrier transit monitoring), but since a IX customer cannot observe the interlan overlay network directly, this is not a viable option.

There are also some [TWAMP](https:&#x2F;&#x2F;datatracker.ietf.org&#x2F;doc&#x2F;html&#x2F;rfc5357) based solutions for this as well, however TWAMP is a deep topic of various things, and simplicity is preferred here as the task is reasonably simple.

We also want to reduce what physical hardware needs to be bought, installed, and powered on in each PoP, as all of these consume resources of different types. So if we can have some solution that allows us to have a single machine in each PoP monitor all customer facing switches, that would be perfect.

## The hardware

We settled on some cheap refurbished HPE servers of a moderate spec (Intel E5-2630 v4, 64GB of DDR4) with 10&#x2F;40G network cards that I’ve had prior first hand experience to be reliable (Intel X520 for 10G ports, Nvidia CX-3 for 40G ports)

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sbk-mOK0k7rF2RT3Wplq90PUeR5HI3CrRcMJMGjHCcTw&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;160Mx7eZXX)

Each PoP has one of these machines installed, and connected to every switch that a customer may also use, and every port connected to these machines is placed on the production IX LAN to ensure that we are monitoring the same system that the customers are using.

## ixp-xping

ixp-xping is the end product of all of this work. The final code comes in at around \~650 lines of Go and the operation of the program is pretty basic.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,szPEgB0dd0qLcNL0JjGrpTayuyXcIeoSqgTR4RkZJdz4&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;4q2nP5WcVo)

Each PoP monitoring machine allocates a number of UDP ports (By default 16) on each NIC.

A UDP “ping” packet is sent every 250ms that contains the machine’s current time, and the other monitoring box “reflects” back the packet as fast as it can. This allows (combined with timestamps in the packet) the application to calculate the round trip time between two machines, for that exact path&#x2F;flow&#x2F;hash and more importantly the packet loss (based on the success of the last 32 packets per monitored flow).

ixp-xping consciously does not attempt to have any knowledge of the topology of the network overlay other than what an operator sets for the number of flows to use to probe latency&#x2F;loss. This is because even if the application did know, figuring out how each switch&#x2F;router vendor hashes packets is fraught with danger and frustration, so instead a “rule of thumb” is used that the number of ports on each machine should ideally be double the worst case number of paths between any two switches. It is still possible that ixp-xping could miss a possible path, however in practice this is unlikely.

## Alerts and Graphs

The data is exported out on each machine in the form of a prometheus metrics scrape endpoint, as prometheus seems to be at least half of the modern monitoring status quo at the time of writing. This also allows the existing prometheus alerting ecosystem to be used to setup alerting when loss is detected.

Otherwise you can also look at the latency directly using something like Grafana!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s8Q0HN3yJrrcxgJ-weqeH_xApX9OgoyYS2-2z9fhSWU0&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;2tjYtbvhZ6)

In the above example we can see the 3 different paths (because the flows are grouped by the latency of those 3 paths) between two PoPs!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sPTDFBEuH5BHgX4L0dsmcFZqXXzrQF0lSrcYO-Pw5qfo&#x2F;https:&#x2F;&#x2F;blog.benjojo.co.uk&#x2F;asset&#x2F;SYowka1yHq)

You can also easily see every switch to switch latency graphed out, the most visible thing in the case of LONAP is that there Is a 500 microsecond “gap” between all of the London Docklands PoPs and the PoP in Slough (Slough is often described to be London in terms of network infrastructure, despite not being in London, so “London” datacenters can include Slough)

## Latency Concerns

Go programs have a runtime that also has a garbage collector (GC), every garbage collector does at some point need to “stop the world”, even for a very short amount of time. Ixp-ping is no exception to this.

The parts of code that are measuring network latency are sensitive to GC “stop the world” latency since we are measuring things in the 10’s of microseconds, This is somewhat mitigated because we can have the kernel timestamp stuff for us, so even if we were GC-ing while a packet came in, we can just use the kernel provided timestamp and calculate latency based on that.

This does not work for the transmit path, but jitter in this path is quite rare (It does happen though). While timestamping capabilities for transmitted packets exist in the kernel, as far as I could assess it did appear to be a lot of extra work and seems to require you to make your packets look like Precision Time Protocol so the kernel can automatically “fill in” the timestamps in the packets. Since jitter in this path caused by this is rare, I decided it was not worth the effort vs the extra complexity it would introduce.

In theory this could have been avoided if I wrote the tool in a language that did not require the use of a garbage collector, however I refuse to hand over new C&#x2F;C++ code to a client, and I am not confident enough to supply or support Rust code yet. So I decided to stick with what I have 10+ years of everyday experience in.

## A note on Linux ARP behaviour

Linux has a very liberal default on how it responds to ARP. In the case of this project one physical server (and network namespace) had up to 3 different IXP switches connected to it.

By default, If you have a IP on NIC1, and someone on NIC2 ARPs for NIC1’s IP address, Linux will respond to ARP on NIC2 for NIC1s IPs, _with NIC2’s MAC address_!

This means that all 3 of those IX ports will always be subject to a race condition for what MAC address should be used. MAC address changes are not only bad because we want to ensure that all 3 ports are ingesting traffic for their respective LAN IP addresses, but also that MAC address changes on the fabric are not completely instant, meaning false packet loss shows up when a change happens.

Tweaking linux kernel sysctl’s can fix this, using &#x60;net.ipv4.conf.all.arp_announce&#x3D;2&#x60; and &#x60;net.ipv4.conf.all.arp_ignore&#x3D;2&#x60; you can prevent this behaviour from happening.

## Try it today!

The code is over on LONAP’s github: &lt;https:&#x2F;&#x2F;github.com&#x2F;lonap&#x2F;ixp-xping&gt;, and if you don’t happen to run a IX then worry not, LONAP have their own metrics publicly visible to encourage transparency over at &lt;https:&#x2F;&#x2F;fabric-metrics.lonap.net&#x2F;&gt; for you to look at and explore!

I’d like to thank LONAP for contracting me for this work! It was interesting work and I look forward to seeing if other exchanges are willing to deploy public metrics like this.

If you read this and have ideas for things that I could also help you out with, please do get in touch with me on ixpost@benjojo.co.uk! If you are interested in BGP monitoring services you should check out my small SaaS company [bgp.tools](https:&#x2F;&#x2F;bgp.tools&#x2F;).

Until next time!