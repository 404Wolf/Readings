---
id: 81adf131-f035-4466-9336-7bd0e85f3a6b
title: Copy URLs in Safari with a keyboard shortcut
tags:
  - RSS
date_published: 2024-09-25 00:00:00
---

# Copy URLs in Safari with a keyboard shortcut
#Omnivore

[Read on Omnivore](https://omnivore.app/me/copy-ur-ls-in-safari-with-a-keyboard-shortcut-19229a3dab1)
[Read Original](https://blog.jabid.in/2024/09/25/safari.html)



[ ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,su7UuMfeKeM8S7AQc7pBjXEZjIi-UwyVZ9S-Ep1eZhr4&#x2F;https:&#x2F;&#x2F;blog.jabid.in&#x2F;images&#x2F;me.jpg) ](https:&#x2F;&#x2F;blog.jabid.in&#x2F;) 

I really loved the [Arc Browser](https:&#x2F;&#x2F;arc.net&#x2F;), but after last week’s [major security incident](https:&#x2F;&#x2F;arc.net&#x2F;blog&#x2F;CVE-2024-45489-incident-response), I can’t trust them anymore to run my primary browser. They did a hundred little things to make it the most polished web browser I have ever used and I will definitely miss it.

Anyway, I went back to Safari and its many paper cuts. I got used to most of the quirks, but I would end up pressing ⌘ ⇧ C a dozen times daily to copy the URL, only to be presented with a very silly element selection feature in dev tools, which I never need.

I figured it would be easier to fix the browser than retrain my muscle memory, and thankfully, there are enough knobs built into macOS to make this not so painful.

## Step 1: Write some Apple Script.

I found the rough template on [reddit](https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;shortcuts&#x2F;comments&#x2F;17qqwdv&#x2F;how%5Fto%5Fcreate%5Fa%5Fcustom%5Fshortcut%5Fin%5Fsafari%5Fto%5Fcopy&#x2F;), which I didn’t have to tweak much except disabling the conflicting keybinding.

1. Create a new service in Automation.app
2. Select Safari.app, with “workflow receives” set to “no input”.
3. Use the following AppleScript[1](#fn:1) code, and save it with a name like “Copy Safari URL”.

&#x60;&#x60;&#x60;applescript
on run {input, parameters}
    tell application &quot;Safari&quot;
        set theURL to URL of front document
        set the clipboard to theURL
    end tell
end run

&#x60;&#x60;&#x60;

![AppleScript Screenshot](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s48K8shPzi6cDr00YBS7L0rS64fgpHp8xEF5pqSzDub4&#x2F;https:&#x2F;&#x2F;blog.jabid.in&#x2F;images&#x2F;safari&#x2F;applescript.png)

## Step 2: Enable the keybinding in keyboard settings.

Settings &gt; Keyboard &gt; Keyboard Shortcuts &gt; Services &gt; General

![Enable keybinding](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sBLH4fHpCtQYIIYOIsZXUeVqsSkGjLXEbrLBFnetxcm0&#x2F;https:&#x2F;&#x2F;blog.jabid.in&#x2F;images&#x2F;safari&#x2F;enable.png)

## Step 3: Disable the conflicting command

Found the basic idea of disabling inbuilt shortcuts from this[StackOverflow](https:&#x2F;&#x2F;apple.stackexchange.com&#x2F;questions&#x2F;392597&#x2F;in-macos-catalina-10-15-on-safari-how-do-you-disable-command-i-from-composing-a) post. You find the exact name of the command you want to disable (‘Start Element Selection’), and rebind it to something completely different.

Settings &gt; Keyboard &gt; Keyboard Shortcuts &gt; App Shortcuts &gt; Safari

![Disable conflicting keybinding](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sLWGUm1NK3n9BSfzwZIqmpFR3kJwunnSYgSMjA0j8FYQ&#x2F;https:&#x2F;&#x2F;blog.jabid.in&#x2F;images&#x2F;safari&#x2F;disable.png)

🎉 📋 Happy Copy Pasting

1. AppleScript must be the most bizarre and quirky programming language ever invented. I can write code in over a dozen programming languages but AppleScript is the most incomprehensible of them all. [↩](#fnref:1)