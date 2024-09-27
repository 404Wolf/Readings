---
id: fe52e97c-e0b1-41a1-b684-c0fd927d495b
title: Dev Logs Without the Noise | Peter Lyons
tags:
  - RSS
date_published: 2024-08-24 17:00:58
---

# Dev Logs Without the Noise | Peter Lyons
#Omnivore

[Read on Omnivore](https://omnivore.app/me/dev-logs-without-the-noise-peter-lyons-19186e189c8)
[Read Original](https://peterlyons.com/problog/2024/08/dev-logs-without-the-noise/)



## [Peter Lyons](https:&#x2F;&#x2F;peterlyons.com&#x2F;)

For local development, json logs often have a bunch of fields you might want for production observability, but almost never care about for local development. The script below is a template you can use to filter out fields you know are noise while allowing all other fields to come through unchanged. It&#39;ll also pretty-print for easier reading. The basic approach is using &#x60;jq&#x60; to delete noise fields with some looseness encoded to handle unexpected schema.

The exact filters and selects will need to be tailored for you specific logs, but a project I recently worked on had things roughly as below that were usually noise I wanted to hide.

&#x60;&#x60;&#x60;coq
# Delete the noisy fields we usually don&#39;t care about
# in dev and let jq pretty print and colorize
jq &#39;. |
    del(.request.ip?) |
    del(.duration?) |
    del(.time?) |
    del(.env?) |
    del(.user_id?) |
    del(.msg? | select(. &#x3D;&#x3D; &quot;request served&quot;)) |
    del(.level? | select(. &#x3D;&#x3D; &quot;INFO&quot;)) |
    if .msg? | contains(&quot;[core]&quot;) then empty else . end |
    del(.revision?)&#39;

&#x60;&#x60;&#x60;

To use this, pipe you server&#39;s json log output to this script. You can throw &#x60;tee&#x60; in the pipeline too if you want the full unfiltered log to disk, but the pretty version in your terminal.

[ back to blog index](https:&#x2F;&#x2F;peterlyons.com&#x2F;problog&#x2F;) 