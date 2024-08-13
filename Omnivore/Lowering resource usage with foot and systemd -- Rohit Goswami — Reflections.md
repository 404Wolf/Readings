---
id: f69d3df0-9050-4e55-9fc7-d3b95717eb61
title: "Lowering resource usage with foot and systemd :: Rohit Goswami — Reflections"
tags:
  - RSS
date_published: 2024-06-02 12:05:31
---

# Lowering resource usage with foot and systemd :: Rohit Goswami — Reflections
#Omnivore

[Read on Omnivore](https://omnivore.app/me/lowering-resource-usage-with-foot-and-systemd-rohit-goswami-refl-18fd9c1d745)
[Read Original](https://rgoswami.me/posts/lowering-resource-usage-foot-systemd/)



---

---

This post is part of the [Wayland Wayfinders](https:&#x2F;&#x2F;rgoswami.me&#x2F;series&#x2F;wayland-wayfinders&#x2F;) series.

&gt; Melding &#x60;systemd&#x60; and &#x60;foot&#x60; for reduced memory consumption in &#x60;sway&#x60;

## Background

Since I often work in strong sunlight, I often want to reconfigure my terminal to use a light or a dark scheme depending on the time of day. In the process, I decided to fiddle around with custom &#x60;systemd&#x60; targets, since &#x60;sway&#x60; isn’t really good at managing long running processes like my terminal (&#x60;foot&#x60;) server.

## Starting point

Some years ago I ended up with a rather ad-hoc scratchpad configuration, reproduced for clarity ([current config here](https:&#x2F;&#x2F;github.com&#x2F;HaoZeke&#x2F;Dotfiles&#x2F;tree&#x2F;chezmoi&#x2F;dot%5Fconfig&#x2F;sway)):

&#x60;&#x60;&#x60;lsl
 1# The main scratchpad in the upper left
 2for_window [app_id&#x3D;&quot;mS&quot;] {
 3    move scratchpad
 4    move position 0 0
 5    resize set 50 ppt 35 ppt
 6    floating enable
 7    border pixel 1
 8}
 9bindsym F1 [app_id&#x3D;&quot;mS&quot;] scratchpad show; move position 0 0, resize set 50 ppt 35 ppt
10exec_always foot --app-id&#x3D;&quot;mS&quot; -e tmux new -A -s mS
11
12# The secondary scratchpad in the center
13for_window [app_id&#x3D;&quot;subFloat&quot;] {
14    move scratchpad
15    move position center
16    floating enable
17    border pixel 1
18}
19bindsym F5 exec swaymsg [app_id&#x3D;&quot;subFloat&quot;] scratchpad show || exec foot --app-id&#x3D;&quot;subFloat&quot; -e tmux new -A -s subFloat

&#x60;&#x60;&#x60;

Which essentially boils down to:

* Put a scratchpad in the upper left bound to &#x60;F1&#x60; and resize it to a long thin window  
   * Attach or start a &#x60;tmux&#x60; session here called &#x60;mS&#x60;
* Put another scratchpad in the center, bound to &#x60;F5&#x60;  
   * Attach or start a &#x60;tmux&#x60; session called &#x60;subFloat&#x60;

When everything works (e.g. at start-up) it essentially leads to a scratchpad setup like so:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s-HneP5OD65UglQRqGpUGaRneQ4fOwtje-zi6tdomszg&#x2F;https:&#x2F;&#x2F;rgoswami.me&#x2F;ox-hugo&#x2F;2024-06-02_14-10-26_screenshot.png)

Additionally, I also have some additional setp for managing terminals:

&#x60;&#x60;&#x60;cos
1set $term_server foot -s
2set $term footclient
3exec_always $term_server
4bindsym $mod+Return exec $term

&#x60;&#x60;&#x60;

Which ideally starts a &#x60;foot&#x60; server, and subsequently spawns &#x60;footclient&#x60;instances on demand.

## Annoyances

This setup served me quite well, for several years I had no major issues whatsover, though there were minor annoyances, some of which eventually broke the camel’s back.

### Memory consumption

The problem is perhaps immediately evident in the narrowed down specification:

&#x60;&#x60;&#x60;haxe
1exec_always foot --app-id&#x3D;&quot;mS&quot; -e tmux new -A -s mS
2# ...
3exec_always foot --app-id&#x3D;&quot;subFloat&quot; -e tmux new -A -s subFloat

&#x60;&#x60;&#x60;

Right of the bat, it is rather evident that this configuration will spawn two instances of &#x60;foot&#x60;, one for each scratchpad.

![Figure 1: Snapshot of memory consumption (from btop), clients take around 10x less memory](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,soE55BRjJhy7QrN5GpUJ0z6R3lCR5MGY4LLRUn2zoTds&#x2F;https:&#x2F;&#x2F;rgoswami.me&#x2F;ox-hugo&#x2F;2024-06-02_14-15-22_screenshot.png)

Figure 1: Snapshot of memory consumption (from &#x60;btop&#x60;), clients take around 10x less memory

On its own, given that I mostly use relatively high-end machines, this was not really a problem, more an aesthetic annoyance.

### Applying &#x60;foot&#x60; configurations

If the main (&#x60;sway&#x60;) server is restarted to apply a configuration update it will not propagate to the scratchpad unless those are also restarted, and &#x60;sway&#x60;isn’t meant to handle long running processes. Essentially, applying a change of theme via &#x60;foot.ini&#x60; ([crrent config here](https:&#x2F;&#x2F;github.com&#x2F;HaoZeke&#x2F;Dotfiles&#x2F;tree&#x2F;chezmoi&#x2F;dot%5Fconfig&#x2F;foot)):

&#x60;&#x60;&#x60;gradle
1# include &#x3D; ~&#x2F;.config&#x2F;foot&#x2F;foot.d&#x2F;theme-acario-light.ini
2include &#x3D; ~&#x2F;.config&#x2F;foot&#x2F;foot.d&#x2F;theme-solarized-dark-normal-brights.ini

&#x60;&#x60;&#x60;

Would entail a whole &#x60;killall -9 foot&#x60; song and dance which was also rather annoying.

### &#x60;exec_always&#x60; doesn’t prevent process failure

Nor should it, as the [documentation explicitly mentions](https:&#x2F;&#x2F;man.archlinux.org&#x2F;man&#x2F;sway.5.en), it is basically like&#x60;exec&#x60; but it also gets re-executated after a reload. For something like a terminal server service, this isn’t exactly what is required at all. Afterall:

* It is independent of the &#x60;sway&#x60; configuration

Or it really should be. On the other hand, some of the settings for the scratchpads were baked into the configuration. Having to reload the &#x60;sway&#x60;configuration just because changes needed to be propagated is asinine, and finally annoyed me enough to make the switch to a real service manager.

## Using &#x60;systemd&#x60; to offload management

The solution is to abstract the configuration for the main and helper scratchpads out of the configuration and also offload management of the process lifetime to &#x60;systemd&#x60;. User configurations for &#x60;systemd&#x60; live in&#x60;$HOME&#x2F;.config&#x2F;systemd&#x2F;user&#x60; and require some standard commands for interacting with them:

&#x60;&#x60;&#x60;routeros
1# Reload user units, every time files are changed
2systemctl --user daemon-reload
3# Start and enable a service
4systemctl --user --now foot-server.service
5# Reload or restart, also when files are changed
6systemctl --user reload-or-restart foot-server.service
7# Check the status
8systemctl --user status foot-server.service

&#x60;&#x60;&#x60;

There are a few common stanzas which are needed for a minimal service file:

&#x60;&#x60;&#x60;lsl
1[Unit]
2Description&#x3D;
3[Service]
4ExecStart&#x3D;
5Restart&#x3D;on-failure
6[Install]
7WantedBy&#x3D;default.target

&#x60;&#x60;&#x60;

With much more extensive documentation found in the &#x60;man&#x60; pages (or [online, here](https:&#x2F;&#x2F;www.freedesktop.org&#x2F;software&#x2F;systemd&#x2F;man&#x2F;latest&#x2F;systemd.service.html)).

### Server

The ordering of the services are also fairly obvious, both the scratchpads (and indeed, the sway terminals) need one primary &#x60;foot-server&#x60; instance to be running at all times. The easiest approach is to reuse &#x60;XDG_RUNTIME_DIR&#x60; which is typically the same as &#x60;&#x2F;run&#x2F;user&#x2F;$(id -u $USER)&#x2F;&#x60;, so the server runs via:

&#x60;&#x60;&#x60;groovy
1&#x2F;usr&#x2F;bin&#x2F;foot --server&#x3D;&#x2F;run&#x2F;user&#x2F;%U&#x2F;foot-server.sock

&#x60;&#x60;&#x60;

Since &#x60;foot -s&#x60; doesn’t fork itself, the default &#x60;Type&#x3D;simple&#x60; will suffice.

Additionally, we will need to ensure that all the &#x60;footclient&#x60; instances we call use the same server socket (as shown in [Sway Scratchpads and Config](#sway-scratchpads-and-config)).

### Scratchpad clients

The clients themselves are equally simple, except that the &#x60;[UNIT]&#x60; stanza will specify they require &#x60;foot-server.service&#x60; and will be run after&#x60;foot-server.service&#x60;.

&#x60;&#x60;&#x60;groovy
1&#x2F;usr&#x2F;bin&#x2F;footclient --server-socket&#x3D;&#x2F;run&#x2F;user&#x2F;%U&#x2F;foot-server.sock --app-id&#x3D;&quot;mS&quot; -e tmux new -A -s mS

&#x60;&#x60;&#x60;

The full configurations are reproduced in \[\[Complete configurations[1](#fn:1)\]\[the next section\]\].

### False starts

I thought I wanted to use sockets ([online man-page](https:&#x2F;&#x2F;www.freedesktop.org&#x2F;software&#x2F;systemd&#x2F;man&#x2F;latest&#x2F;systemd.socket.html)), but for a constantly running set of terminals there is very little point. On my machine, the &#x60;foot&#x60;server takes around 20MB-31MB while each client instance is below 1.5MB, so having a a socket for either the server or the clients made little to no sense.

## Complete configurations[1](#fn:1)

![Figure 2: Final single server many client view (via btop)](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s-F5DWHADT-aoYIsZC-9JPpIrlnBN4K2IQB4Z8CrtlT8&#x2F;https:&#x2F;&#x2F;rgoswami.me&#x2F;ox-hugo&#x2F;2024-06-02_14-38-48_screenshot.png)

Figure 2: Final single server many client view (via &#x60;btop&#x60;)

### Sway Scratchpads and Config

The final &#x60;sway&#x60; scratchpad setup is essentially:

&#x60;&#x60;&#x60;routeros
 1# Settings
 2set {
 3 $ms_pos border none, move position 0 0, resize set 50 ppt 35 ppt
 4 $sf_pos border pixel 1, move position center
 5 $start_ms systemctl --user start foot-ms.service
 6 $start_sf systemctl --user start foot-subfloat.service
 7}
 8# The main scratchpad in the upper left
 9for_window [app_id&#x3D;&quot;mS&quot;] {
10    move to scratchpad
11    floating enable
12    $ms_pos
13}
14bindsym F1 exec swaymsg [app_id&#x3D;&quot;mS&quot;] scratchpad show || $start_ms, $ms_pos
15
16# The secondary scratchpad in the center
17for_window [app_id&#x3D;&quot;subFloat&quot;] {
18    move to scratchpad
19    floating enable
20    border pixel 1
21}
22bindsym F5 exec swaymsg [app_id&#x3D;&quot;subFloat&quot;] scratchpad show || $start_sf, $sf_pos

&#x60;&#x60;&#x60;

With the bindings changed to point to the same socket as the process:

&#x60;&#x60;&#x60;basic
1# Remove exec_always $term_server, infact get rid of it all together, since systemd handles it now
2set $term footclient --server-socket&#x3D;$XDG_RUNTIME_DIR&#x2F;foot-server.sock

&#x60;&#x60;&#x60;

### Systemd services

&#x60;&#x60;&#x60;routeros
1[Unit]
2Description&#x3D;Foot terminal server
3
4[Service]
5ExecStart&#x3D;&#x2F;usr&#x2F;bin&#x2F;foot --server&#x3D;&#x2F;run&#x2F;user&#x2F;%U&#x2F;foot-server.sock
6Restart&#x3D;on-failure
7
8[Install]
9WantedBy&#x3D;default.target

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;routeros
 1[Unit]
 2Description&#x3D;Foot client for tmux session mS
 3After&#x3D;foot-server.service
 4Requires&#x3D;foot-server.service
 5
 6[Service]
 7ExecStart&#x3D;&#x2F;usr&#x2F;bin&#x2F;footclient --server-socket&#x3D;&#x2F;run&#x2F;user&#x2F;%U&#x2F;foot-server.sock --app-id&#x3D;&quot;mS&quot; -e tmux new -A -s mS
 8Restart&#x3D;on-failure
 9
10[Install]
11WantedBy&#x3D;default.target

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;routeros
 1[Unit]
 2Description&#x3D;Foot client for tmux session subFloat
 3After&#x3D;foot-server.service
 4Requires&#x3D;foot-server.service
 5
 6[Service]
 7ExecStart&#x3D;&#x2F;usr&#x2F;bin&#x2F;footclient --server-socket&#x3D;&#x2F;run&#x2F;user&#x2F;%U&#x2F;foot-server.sock --app-id&#x3D;&quot;subFloat&quot; -e tmux new -A -s subFloat
 8Restart&#x3D;on-failure
 9
10[Install]
11WantedBy&#x3D;default.target

&#x60;&#x60;&#x60;

## Conclusions

Perhaps on modern machines, with many gigabytes of RAM, there is no real benefit to this approach, however, given that I use a lot of terminals and don’t always reach for &#x60;tmux&#x60;, for me this works out very nicely. It also helps handling configuration updates to &#x60;foot&#x60;, since all instances use the same server.

Moreover, this setup greatly facilitates changing themes, a feature that is particularly useful for those who work in varying lighting conditions, like moving between indoor and outdoor environments. For people who consistently work in the same environment, this might not be a significant advantage.

Nevertheless, the minor annoyances have been quelled, and I had never really worked with &#x60;systemd&#x60; services before barring a few backup setups, so this was pretty gratifying.

---

1. for now, updates will probably appear only on [my Dotfiles repo](https:&#x2F;&#x2F;github.com&#x2F;HaoZeke&#x2F;Dotfiles&#x2F;tree&#x2F;chezmoi&#x2F;) [↩︎](#fnref:1) [↩︎](#fnref1:1)

---

## Series info

### Wayland Wayfinders series

1. [Revisiting Wayland for ArchLinux](https:&#x2F;&#x2F;rgoswami.me&#x2F;posts&#x2F;revisiting-wayland-2021-archlinux&#x2F;)
2. **Lowering resource usage with foot and systemd** &lt;-- You are here!

---

[![Written by human, not by AI](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3X9B6N8P4mL_vrtU_BFqKhW67a4M6d8JKitE2AEn368&#x2F;https:&#x2F;&#x2F;rgoswami.me&#x2F;&#x2F;images&#x2F;Written-By-Human-Not-By-AI-Badge-white.svg)](https:&#x2F;&#x2F;notbyai.fyi&#x2F;)