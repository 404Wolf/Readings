---
id: 686c8283-ca61-4318-94f2-11b95537ab58
title: Laurent Direr
tags:
  - RSS
date_published: 2024-05-30 09:35:07
---

# Laurent Direr
#Omnivore

[Read on Omnivore](https://omnivore.app/me/laurent-direr-18fca633a43)
[Read Original](https://ldirer.com/blog/posts/bose-qc35-noise-cancelling-off)



I have had a pair of Bose QC35 headphones since 2017.

One thing annoys me is that when bluetooth is turned on, noise cancellation is automatically set to &#39;high&#39;.  
Newer Bose models have a physical button to disable noise cancellation, but mine does not.

The Bose mobile app seems to be the official solution, but it takes a few seconds to start, enough for me to feel mildly offended and look for an alternate solution.

## [Read the &quot;A Linux solution&quot; section](#a-linux-solution)A Linux solution

Here&#39;s what I wanted: **every time my headphones connect to my computer, noise cancellation is set to &#39;off&#39;**.

To achieve that, we need to:

1. Know that the headphones just connected over bluetooth.
2. Tell them to set noise-cancelling to &#39;off&#39;.

Part 2 is basically &#39;reverse-engineering&#39; the Bose mobile app and build software that works on Linux. Fortunately, [someone already did that](https:&#x2F;&#x2F;github.com&#x2F;Denton-L&#x2F;based-connect) 🙏🙏.

I installed their software and verified that I could disable noise-cancelling by running &#x60;&#x2F;usr&#x2F;local&#x2F;bin&#x2F;based-connect --noise-cancelling&#x3D;off [MAC address of headphones]&#x60;.  
The MAC address can be obtained from &#x60;bluetoothctl info&#x60; when the device is connected.

Now we need to know when the headphones connect, and run the script automatically. This can be done with a combination of udev rules and a systemd service on Linux.

## [Read the &quot;Listening to bluetooth connection events with udev&quot; section](#listening-to-bluetooth-connection-events-with-udev)Listening to bluetooth connection events with udev

udev is a device manager for Linux. From the [man page](https:&#x2F;&#x2F;man7.org&#x2F;linux&#x2F;man-pages&#x2F;man7&#x2F;udev.7.html), I got that it is a layer on top of the kernel, it gives usable names to devices, and lets us subscribe to device events.

Writing the actual udev rule was a bit tricky.  
I got some semblance of a feedback loop using the following workflow (requires a live device):

* Run &#x60;udevadm monitor --property&#x60; in one terminal to see udev events as they occur.
* Test the rule matching with:  
&#x60;&#x60;&#x60;awk  
udevadm test --action&#x3D;add &#x2F;devices&#x2F;virtual&#x2F;input&#x2F;input71  
&#x60;&#x60;&#x60;

The path to the device comes from watching &#x60;udevadm monitor --property&#x60; when the headphones connect.

* A helpful debugging rule (credits to someone on some internet forum).  
&#x60;&#x60;&#x60;dockerfile  
# A lot can go wrong and cause a rule to not match&#x2F;script to silently not run. Starting with something that works is helpful.  
ACTION&#x3D;&#x3D;&quot;add&quot;, SUBSYSTEM&#x3D;&#x3D;&quot;input&quot;, RUN+&#x3D;&quot;&#x2F;bin&#x2F;sh -c &#39;echo &#x3D;&#x3D; &gt;&gt; &#x2F;tmp&#x2F;udev-env.txt; env &gt;&gt; &#x2F;tmp&#x2F;udev-env.txt&#39;&quot;  
&#x60;&#x60;&#x60;

Initially, I tried to make the udev rule run the script setting noise-cancelling with &#x60;RUN+&#x3D;&quot;path-to-my-script&quot;&#x60;. It did not work because, for security reasons that I am not familiar with, udev scripts run inside a sandbox and cannot access the network.  
A workaround is to create a systemd service to run the script. The udev rule triggers the service.

## [Read the &quot;Putting things together&quot; section](#putting-things-together)Putting things together

Here&#39;s the complete setup:

&#x60;&#x2F;etc&#x2F;systemd&#x2F;system&#x2F;custom-bose-noise-canceling-off.service&#x60;

&#x60;&#x60;&#x60;ini
# this is meant to be triggered by a udev rule (on bluetooth connection)
[Unit]
Description&#x3D;Set noise canceling to &#39;off&#39; on Bose QC35

[Service]
Type&#x3D;simple
ExecStart&#x3D;&#x2F;home&#x2F;laurent&#x2F;programming&#x2F;scripts&#x2F;bose&#x2F;nc_off
User&#x3D;laurent

&#x60;&#x60;&#x60;

&#x60;&#x2F;usr&#x2F;lib&#x2F;udev&#x2F;rules.d&#x2F;99-custom-bose-bluetooth.rules&#x60;

&#x60;&#x60;&#x60;dockerfile
ACTION&#x3D;&#x3D;&quot;add&quot;, SUBSYSTEM&#x3D;&#x3D;&quot;input&quot;, ENV{PRODUCT}&#x3D;&#x3D;&quot;1&#x2F;1e&#x2F;111c&#x2F;111&quot;, TAG+&#x3D;&quot;systemd&quot;, ENV{SYSTEMD_WANTS}&#x3D;&quot;custom-bose-noise-canceling-off.service&quot;

&#x60;&#x60;&#x60;

The &#x60;ENV{PRODUCT}&#x60; value can be obtained by looking at the output of &#x60;udevadm monitor --property&#x60;.

&#x60;&#x2F;home&#x2F;laurent&#x2F;programming&#x2F;scripts&#x2F;bose&#x2F;nc_off&#x60;

&#x60;&#x60;&#x60;bash
#!&#x2F;bin&#x2F;bash
# sleeping because bluetooth might not be ready just yet when this runs
# there is probably a better way ! 
# the systemd service could probably be made to wait on some other event. 
sleep 5
&#x2F;usr&#x2F;local&#x2F;bin&#x2F;based-connect --noise-cancelling&#x3D;off &lt;device mac address&gt; 

&#x60;&#x60;&#x60;

Exploring &#x60;udev&#x60; was interesting, and now I don&#39;t have to open the Bose app. Also, it is a small daily reward to hear noise-cancelling turn off automatically 🥳.

## [Read the &quot;On Android&quot; section](#on-android)On Android

If you know of a good solution please let me know!

At the moment I use a third-party &#39;Serial Bluetooth Terminal&#39; app (that I had been using for other purposes) to send to the headphones, turning noise-cancelling off.  
It&#39;s faster than the Bose app but I&#39;m still required to go and click it.

## [Read the &quot;Some resources I used&quot; section](#some-resources-i-used)Some resources I used

* &lt;https:&#x2F;&#x2F;unix.stackexchange.com&#x2F;questions&#x2F;476094&#x2F;run-a-script-when-bluetooth-device-is-connected&gt;
* &lt;https:&#x2F;&#x2F;reactivated.net&#x2F;writing%5Fudev%5Frules.html&gt;. A bit outdated - &#x60;udevadm&#x60; replaced many of the commands listed there - but still useful.
* The bytes required to set noise-cancelling to &quot;off&quot; can be found [in the codebase of the Linux tool](https:&#x2F;&#x2F;github.com&#x2F;Denton-L&#x2F;based-connect&#x2F;blob&#x2F;ef66145bf4739ec96c1a6959f63146d12ba87e4c&#x2F;based.c#L258).