---
id: 8403b996-b87b-4e32-997a-0edcc4fdca3a
title: bensch.ac
tags:
  - RSS
date_published: 2024-08-14 05:35:07
---

# bensch.ac
#Omnivore

[Read on Omnivore](https://omnivore.app/me/bensch-ac-19151a807f9)
[Read Original](https://www.bensch.ac/blog/fixing-react-native-universal-fs-node-module)



## Fixing React Native Universal FS Node Module Not Supported Error

## Intro

Documenting for both my future self and anyone else on the world wide web who may run into the same issue.

I bootstrapped my project with [yarn create tamagui](https:&#x2F;&#x2F;tamagui.dev&#x2F;) using the free web + mobile template.

While building my personal site and react-native play ground I ran into this issue when trying to build my expo project

&#x60;The package at &quot;..&#x2F;..&#x2F;node_modules&#x2F;next&#x2F;dist&#x2F;compiled&#x2F;gzip-size&#x2F;index.js&quot; attempted to import the Node standard library module &quot;fs&quot;.&#x60;

The steps I took to debug the issue:

❌ Removed mdx deps

❌ copied tamagui example

❌ hard reset yarn and make deps use v3

❌ commented out places where fs is used

❌ commented out rss

❌ commented out all screens

❌ removed all next references from the project

❌ commend out fs fallback nextjs config

## The Solution

Running the yarn why command in the expo directory

&#x60;y why next
└─ next-app@workspace:apps&#x2F;next
   └─ next@npm:14.2.5 [1e21e] (via npm:^14.2.3 [1e21e])&#x60;

Next was still being imported into the project, directly.

I was still importing @my&#x2F;ui. After looking through the components directory, Layout was importing next&#x2F;router.

After replacing next&#x2F;router with solito&#x2F;router\&#x60; the project built successfully.