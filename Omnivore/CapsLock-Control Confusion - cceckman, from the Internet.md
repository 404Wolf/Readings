---
id: bf00f1ef-e1f0-45ef-bfb7-4a79be731a77
title: CapsLock-Control Confusion | cceckman, from the Internet
tags:
  - RSS
date_published: 2024-06-10 10:05:40
---

# CapsLock-Control Confusion | cceckman, from the Internet
#Omnivore

[Read on Omnivore](https://omnivore.app/me/caps-lock-control-confusion-cceckman-from-the-internet-190030c7c17)
[Read Original](https://cceckman.com/writing/qmk-capslock/)



We had a keyboard running [QMK](https:&#x2F;&#x2F;qmk.fm&#x2F;) firmware, where the [Mod-Tap](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;mod%5Ftap)behavior seemed to be misbehaving: the configuration “tap for CapsLock, hold for Ctrl” only ever registered as Ctrl.

After some experimentation, I found that the&#x60;MAGIC_CAPS_LOCK_AS_CTRL&#x60; [Magic Keycodes](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;keycodes%5Fmagic) bit had been set; toggling that off resolved the issue. I suspect clearing the EEPROM would have done the same.

**Lesson learned:** When starting a “fresh” keyboard layout, clear out the EEPROM explicitly!

## Issue report

Here’s my narrative of what happened; see [below](#analysis) for a deeper understanding.

Note that this isn’t a _bug_ report for QMK. As far as I can tell, everything was working as intended – just not as I naively expected!

### Symptoms

We had a [Ristretto](https:&#x2F;&#x2F;github.com&#x2F;blewis308&#x2F;Ristretto) keyboard sitting on the shelf for a while. Recently, the user pulled it, configured a layout with the[QMK Configurator](https:&#x2F;&#x2F;config.qmk.fm&#x2F;) tool, and programmed it onto the keyboard.

For the most part, the layout worked fine, except for one key. The user had configured that key with &#x60;MT(MOD_LCTL, KC_CAPSLOCK)&#x60;: using the [Mod-Tap](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;mod%5Ftap) feature, a tap (short press) should toggle CapsLock, while a hold (long press) would register as “left Ctrl”.

The actual behavior was that the key always behaved as “left Ctrl” (&#x60;MOD_LCTL&#x60;). This wasn’t an operating-system level rebinding; we saw it on distinct Windows and Linux computers.

### Debugging and suspicions

For debugging, we [set up the QMK command-line environment](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;newbs%5Fgetting%5Fstarted)to get more Ctrl. We exported the &#x60;keymap.json&#x60; file from the [QMK Configurator](https:&#x2F;&#x2F;config.qmk.fm&#x2F;), and used the [qmk json2c command](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;cli%5Fcommands#qmk-json2c) command to get a buildable keymap.

The issue reproduced when using a local build; it wasn’t a configurator problem. We changed a couple of &#x60;#defines&#x60; related to the Mod-Tap feature, but they also didn’t introduce any fix.

I wound up trying &#x60;MT(MOD_LCTL, KC_TAB)&#x60;, which gave our first big clue: that key combo worked fine! This suggested there was something about CapsLock that was behaving specially.

I probably should have guessed that sooner, really. “Replace CapsLock with Ctrl” is a pretty typical keyboard customization, even without running custom firmware – I have configured my laptop to swap them.

I recognized the behavior as being _equivalent to_ “CapsLock acts as Ctrl”: regardless of “hold” or “tap”, the key came up Ctrl.

### Discovery and mitigation

A little searching turned up[this Reddit thread](https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;olkb&#x2F;comments&#x2F;7wtxxa&#x2F;qmk%5Fkc%5Flctl%5Fkc%5Fcaps%5Ffunctionality%5Fswapped&#x2F;); which doesn’t say much, but points at the [Bootmagic](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;features&#x2F;bootmagic) feature.

That page notes that Bootmagic is deprecated in favor of [Magic Keycodes](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;keycodes%5Fmagic)– of which the first several deal with “CapsLock as Ctrl”. Found it!

I configured a key for &#x60;QK_MAGIC_CAPS_LOCK_AS_CONTROL_OFF&#x60;, flashed the keyboard, and pressed the key – and the Mod-Tap key worked as it should. This also persisted after flashing a new layout, moving to a different computer, etc.

## Analysis: Persistent state in QMK

So what happened here? The keyboard had some sort of persistent state that said “treat CapsLock as Control”, that wasn’t surfaced aside from the behavior itself; that persisted even after re-flashing.

QMK can use [EEPROM](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;feature%5Feeprom) to store persistent settings. Looking at the source, we can see this feature is used for the [Magic Keycodes](https:&#x2F;&#x2F;docs.qmk.fm&#x2F;keycodes%5Fmagic): The &#x60;keymap_config&#x60; is [read from eeconfig](https:&#x2F;&#x2F;github.com&#x2F;qmk&#x2F;qmk%5Ffirmware&#x2F;blob&#x2F;8b5cdfabf5d05958a607efa174e64377d36e4b64&#x2F;quantum&#x2F;process%5Fkeycode&#x2F;process%5Fmagic.c#L50), updated, and [written back](https:&#x2F;&#x2F;github.com&#x2F;qmk&#x2F;qmk%5Ffirmware&#x2F;blob&#x2F;8b5cdfabf5d05958a607efa174e64377d36e4b64&#x2F;quantum&#x2F;process%5Fkeycode&#x2F;process%5Fmagic.c#L190).

As far as I can tell from the [datasheet](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;qmk-capslock&#x2F;atmega32u4.pdf), the [atmega32u4](https:&#x2F;&#x2F;www.microchip.com&#x2F;en-us&#x2F;product&#x2F;atmega32u4) controller [used by Ristretto](https:&#x2F;&#x2F;github.com&#x2F;blewis308&#x2F;Ristretto&#x2F;blob&#x2F;ace47eeedc10528ed6059dd57979c17c04300c63&#x2F;firmware&#x2F;QMK&#x2F;rules.mk#L2C7-L2C17) does not have any [ECC](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Error%5Fcorrection%5Fcode) protections. (If you know otherwise, let me know!)

So at some point, either I had set this configuration bit, or that specific bit of EEPROM had been corrupted by noise,[1](#fn:1) or…something. And the configuration stuck in the EEPROM until cleared.

## What I’ve learned

QMK is pretty easy to use, and quite powerful! I’ve mostly been using graphical configurators for my keyboards, but I might switch over to get that lower-level control.

When notionally starting a new layout, explicitly clear the EEPROM to clean out any persistent state.

---

1. As noted, this keyboard had been unplugged for quite a while – probably over a year. The datasheet claims retention for “100 years at 25°C”, but I don’t know if that’s assuming the chip is online or offline. [↩︎](#fnref:1)