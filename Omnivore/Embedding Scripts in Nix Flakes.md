---
id: 42f3c715-e840-47f7-8528-f684a14d240d
title: Embedding Scripts in Nix Flakes
tags:
  - RSS
date_published: 2024-08-16 12:04:59
---

# Embedding Scripts in Nix Flakes
#Omnivore

[Read on Omnivore](https://omnivore.app/me/embedding-scripts-in-nix-flakes-1915bf4b5ce)
[Read Original](https://blog.aos.sh/2024/08/16/embedding-scripts-in-nix-flakes/)



A somewhat common theme I’ve noticed when working on various projects is the need for “one-off” re-usable scripts, these are typically more than a few lines of code.

For example, in my [Advent of Code](https:&#x2F;&#x2F;adventofcode.com&#x2F;) repository I have a small Python script that pulls the input down given a year and day. But rather than wanting to manage this script explicitly, I wanted to encapsulate it as part of my flake so I can call it directly via nix.

It turns out, Nix has the concept of[writers](https:&#x2F;&#x2F;nixos.wiki&#x2F;wiki&#x2F;Nix-writers). These are functions that allow you to write other languages inline, in nix code.[1](#fn:1) One _other_ nice thing about this: you can add language-specific libraries as dependencies.

[Here’s my Python script now](https:&#x2F;&#x2F;github.com&#x2F;aos&#x2F;advent&#x2F;blob&#x2F;12ec07784457c0b21408cb363f0110872ff96281&#x2F;flake.nix#L10-L23):

&#x60;&#x60;&#x60;processing
pkgs.writers.writePython3Bin &quot;get_input&quot; {
  libraries &#x3D; [ pkgs.python3Packages.requests ];
} &#39;&#39;
  import requests
  import sys

  year, day &#x3D; sys.argv[1], sys.argv[2]
  url &#x3D; &#39;https:&#x2F;&#x2F;adventofcode.com&#x2F;{}&#x2F;day&#x2F;{}&#x2F;input&#39;.format(year, day)
  cookie &#x3D; open(&#39;cookie.txt&#39;).read().strip()

  r &#x3D; requests.get(url, cookies&#x3D;{&#39;session&#39;: cookie})
  print(r.text)
&#39;&#39;;

&#x60;&#x60;&#x60;

Notice I was able to add &#x60;requests&#x60; as a &#x60;library&#x60;. From here, I am able to call this script directly via the command:

&#x60;&#x60;&#x60;angelscript
$ nix run . -- 2022 5

&#x60;&#x60;&#x60;

There are some other ways this can be extended of course:

1. Adding more scripts, effectively making the flake a trivial command runner.
2. If the script becomes too large, you can always split it back out into its own file, then directly reading that file into the flake.
3. Placing the script as a package in a dev shell, so that it’s available via &#x60;nix develop&#x60;.

---

1. Thank you fellow Nix enthusiasts in the Matrix channel for pointing me to these. [↩︎](#fnref:1)