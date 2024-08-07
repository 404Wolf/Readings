---
id: 59063635-9c70-41fc-ae74-0250f15e3a70
title: Kubernetes whoops
tags:
  - RSS
date_published: 2024-06-10 00:00:00
---

# Kubernetes whoops
#Omnivore

[Read on Omnivore](https://omnivore.app/me/kubernetes-whoops-190021577e6)
[Read Original](https://bytes.zone/micro/kubernetes-whoops/)



_Brian Hicks, June 10, 2024_

Welp, I accidentally deleted my Kubernetes cluster. I was messing around with Hetzner Cloud and Nomad trying to figure out if they&#39;d be a good fit for what I&#39;m doing and ran a &#x60;terraform delete&#x60; thinking it would just affect my Hetzner machines. Turns out there&#39;s a good reason that the &#x60;delete&#x60; subcommand is disabled by default in Terraform Cloud.

It took me a bit to come back, but this blog and all my sites are now running on Nomad. I&#39;m pretty happy with it. May switch back eventually (it&#39;s easy because everything is static and containerized) but not immediately.

As a result, no progress on tinyping these past couple of weeks. 😅