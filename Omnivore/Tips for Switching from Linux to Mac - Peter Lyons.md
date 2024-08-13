---
id: 5d18008d-1586-45c4-88d7-93dfbd5148a2
title: Tips for Switching from Linux to Mac | Peter Lyons
tags:
  - RSS
date_published: 2024-07-20 12:05:41
---

# Tips for Switching from Linux to Mac | Peter Lyons
#Omnivore

[Read on Omnivore](https://omnivore.app/me/tips-for-switching-from-linux-to-mac-peter-lyons-190d0f7b5ea)
[Read Original](https://peterlyons.com/problog/2024/07/tips-for-switching-from-linux-to-mac/)



## [Peter Lyons](https:&#x2F;&#x2F;peterlyons.com&#x2F;)

I&#39;ve run the full matrix of combinations of linux and macos between my work and personal setups. At this point I&#39;m pretty comfortable switching. Linux will always have my heart but periodically I get fed up and just want a laptop that goes to sleep when you close the lid. I&#39;ve recently seen some posts and since I did my most recent round of switching from an all-linux setup to linux-at-home + mac-at-work, I wanted to share a short list of key apps. These are mostly from my personal toolbelt with a few picked from some online discussions I saw recently.

* terminal  
   * I run [kitty](https:&#x2F;&#x2F;sw.kovidgoyal.net&#x2F;kitty&#x2F;) and really enjoy having the exact same terminal across OSes  
   * The Terminal.app that ships with macos is also a fine choice.  
   * Things are in very good state at the moment with numerous high-quality choices avalible including alacritty, wezterm, etc
* zsh  
   * Just note that for license reasons the default shell on macos is zsh, which is good
* [homebrew](https:&#x2F;&#x2F;brew.sh&#x2F;) is the most common package manager, although I think there are alternatives for the brave  
   * Also [mas](https:&#x2F;&#x2F;github.com&#x2F;mas-cli&#x2F;mas) is a CLI to help with the Mac App Store
* clipboard manager  
   * I use [flycut](https:&#x2F;&#x2F;apps.apple.com&#x2F;us&#x2F;app&#x2F;flycut-clipboard-manager&#x2F;id442160987?mt&#x3D;12)
* keyboard remapping  
   * macos built-in keyboard settings can handle basic layout swapping as well as the common key remaps like caps lock is control  
   * for advanced tricks, [Karabiner Elements](https:&#x2F;&#x2F;karabiner-elements.pqrs.org&#x2F;) is great  
   * [cliclick](https:&#x2F;&#x2F;formulae.brew.sh&#x2F;formula&#x2F;cliclick#default) is a handy tool for scripting simulated keyboard events (similar to xdotool for linux)
* mouse and touchpad tricks  
   * I use [BetterTouchTool](https:&#x2F;&#x2F;folivora.ai&#x2F;) mostly to get &quot;natural scrolling&quot; on the touchpad while keeping a physical mouse wheel working correctly. It has some other good knobs and dials too, and I think even a clipboard manager, but I don&#39;t use most of its features anymore.  
   * [Scroll Reverser](https:&#x2F;&#x2F;pilotmoon.com&#x2F;scrollreverser&#x2F;) can fix this too
* screenshots  
   * [flameshot](https:&#x2F;&#x2F;flameshot.org&#x2F;) works on macos and linux and is great
* If you use dmenu or rofi on linux, you might want [choose](https:&#x2F;&#x2F;github.com&#x2F;chipsenkbeil&#x2F;choose) (&quot;choose-gui&quot; is the homebrew package name)
* Many command line and terminal tools you may use on linux are cross-platform and available on macos as well  
   * bat  
   * direnv  
   * eza  
   * fd  
   * fzf  
   * gitui  
   * htop  
   * jless  
   * jq  
   * lazygit  
   * lf  
   * neovim  
   * pandoc  
   * prettier  
   * ripgrep  
   * sd  
   * shellcheck  
   * shfmt  
   * starship  
   * tokei  
   * etc

## Window Management

Since I run [awesomewm](https:&#x2F;&#x2F;awesomewm.org&#x2F;) on linux, which is configured with lua code, I run [Hammerspoon](http:&#x2F;&#x2F;www.hammerspoon.org&#x2F;) on mac. It&#39;s the same philosophy and approach - use real code to get highly precise customization. The hammerspoon API is way way nicer than awesomewm though. When I joined Mailchimp in 2020 and had to use mac for work, I ended up doing a nearly feature-for-feature port of my awesomewm config to Hammerspoon and surprisingly my basic approach has been so stable that I have been maintaining both of them in parallel for about 4 years now. I know how I want my desktop environment to work and they both can acheive it.

If you just want basic window arrangements there are many good tools available including the ones below. I don&#39;t personally use these since Hammerspoon handles window management for me, but I know many folks like these:

* [rectangle](https:&#x2F;&#x2F;rectangleapp.com&#x2F;)
* [Alt-Tab](https:&#x2F;&#x2F;alt-tab-macos.netlify.app&#x2F;)
* [yabai](https:&#x2F;&#x2F;github.com&#x2F;koekeishiya&#x2F;yabai) if you prefer tiling window managers a la i3  
   * pairs well with [skhd](https:&#x2F;&#x2F;github.com&#x2F;koekeishiya&#x2F;skhd)

## Launchers &amp; Omnibar Thingies

[Raycast](https:&#x2F;&#x2F;www.raycast.com&#x2F;) and [Alfred](https:&#x2F;&#x2F;www.alfredapp.com&#x2F;) are popular. I have a home-grown thing based on scripts and choose-gui which works identically for me on linux and mac so I haven&#39;t looked at this category much.

## GOAT Meeting Reminder App: MeetingBar

Get [MeetingBar](https:&#x2F;&#x2F;meetingbar.app&#x2F;). It&#39;s amazing. Perfect in every way and solves a longstanding problem for me. I barely need to look at my calendar anymore.

## Closing

The differences between linux and mac for developers are as minimal now as they have ever been. We spend so much time in browsers and other cross-platform developer tools that it&#39;s pretty straightforward to have high similarity. It may take a fair amount of tweaking and futzing, but you should be able to get something that feels comfortable.

[ back to blog index](https:&#x2F;&#x2F;peterlyons.com&#x2F;problog&#x2F;) 