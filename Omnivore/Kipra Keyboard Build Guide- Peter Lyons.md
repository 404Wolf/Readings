---
id: 9e927912-1533-11ef-b35c-23185171a3d3
title: Kipra Keyboard Build Guide| Peter Lyons
tags:
  - RSS
date_published: 2024-05-18 12:06:01
---

# Kipra Keyboard Build Guide| Peter Lyons
#Omnivore

[Read on Omnivore](https://omnivore.app/me/kipra-keyboard-build-guide-peter-lyons-18f8c884501)
[Read Original](https://peterlyons.com/problog/2024/05/kipra-keyboard-build-guide/)



## [Peter Lyons](https:&#x2F;&#x2F;peterlyons.com&#x2F;)

This guide will walk you through the process of building a kipra keybord.

## Parts List

Caveat: parts availability changes quickly and vendor inventory tends to be come and go. Probably, you&#39;ll be able to get everything from 3 vendors, but some struggle may be involved.

* A pair of kipra v1 PCBs.  
   * I suggest [PCBWay](https:&#x2F;&#x2F;www.pcbway.com&#x2F;) to fabricate boards for you  
   * The exact .zip file I uploaded to them is available [in the focusaurus&#x2F;kipra-keyboard github repo](https:&#x2F;&#x2F;github.com&#x2F;focusaurus&#x2F;kipra-keyboard)  
   * It&#39;s &#x60;kipra-v1.gerber.zip&#x60; in the root of the repo
* a pair of RP2040 MCUs. I bought [these on aliexpress](https:&#x2F;&#x2F;www.aliexpress.us&#x2F;item&#x2F;3256805923036572.html?spm&#x3D;a2g0o.order%5Fdetail.order%5Fdetail%5Fitem.3.24e8f19crLknnv&amp;gatewayAdapt&#x3D;glo2usa#nav-specification) \- the 16M &quot;color&quot;  
   * these will come with pin headers
* 44 kailh choc switches  
   * I strongly endorse the new amazing [Kailh Choc Ambient Nocturnal 20g linear silent switches](https:&#x2F;&#x2F;lowprokb.ca&#x2F;collections&#x2F;switches&#x2F;products&#x2F;ambients-silent-choc-switches?variant&#x3D;44873446391972) from the fantastic lowprokb.ca store.  
   * lowprokb stocks most of the parts you need for this build
* 44 kailh choc hotswap sockets
* 44 keycaps of your choosing
* 44 diodes  
   * I suggest surface mount (SMD), but the board supports through-hole as well (in theory)
* a pair of TRRS connectors
* A TRRS cable. I suggest about 1 meter so it can run behind a laptop and 90-degree connectors make the most sense for that. If you know you want your cable to go straight across between the halves then a straight cable connector is fine.
* soldering iron and solder
* small breadboard
* flush cutters
* masking tape and marker
* high quality precision tweezers
* safety gear if you are using leaded solder  
   * nitrile gloves  
   * fume extractor and&#x2F;or respirator
* bins to hold tiny parts are very helpful
* excellent lighting and&#x2F;or headlamp
* safety glasses

## Study soldering technique and safety

If you are new to soldering, head over to youtube and watch some tutorials for technique and safety.

## Flash the MCU ahead of time

I suggest flashing the MCU as soon as you receive them. Better to get this sorted and out of the way so when you finish assembly, you get the satisfaction of having a working keyboard without any flashing frustrations spoiling the experience.

I have not yet published my QMK and Vial ports. If someone other than me ever actually builds one of these, hopefully I will have figured out how to do that either by merging the keeb into QMK and&#x2F;or Vial or just adding them to the kipra repo on my github or something.

If you flash the bare MCU, you should be able to type letters by shorting through holes from the end of the left column to the end of the right column.

## Build one half at a time

I recommend building only one half start to finish first unless you have a lot of experience building keyboard kits. This way you are more likely to make a mistake on only 1 PCB not both. Each half will work as a keyboard when connected to the computer via USB so you&#39;ll know everything is correct.

## Steady hands

Pro tip: you might want to avoid caffeine on build day. My hands get shakier if I&#39;ve had too much caffeine and these SMD diodes are tiny!

## Label the PCBs halves and sides

Take your PCBs, lay them out so you have a paired left and right, and put a piece of masking tape on them labeling all 4 sides: &quot;left top&quot;, &quot;left bottom&quot;, &quot;right top&quot;, &quot;right bottom&quot;. It&#39;s easy at the beginning of the build to lose track and solder something to the wrong side.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sGeTvomPuVvS_lSihhZBuK4y_0ErTkB-J4lkhBQXsGZQ&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666786956_8bc2cec88f_k_d.jpg) 

label the PCB all 4 sides

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sxQqjOubVpeH6UZyDuy2GgJEuaaXiF046m092uhM-d6Y&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53665919147_6778c5e22f_k_d.jpg) 

labels on the bottom

## Solder the diodes

Set your iron to 350°C (or whatever works best with your solder, but as low as will work). The diodes go on the BOTTOM so make sure you are working on the bottom side. The stripe on the diode needs to align with the direction the arrow points on the PCB silkscreen. This is not symmetric so for the left half the text on the diode will be upside down, and on the right hand the text will be right side up.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s2GHwMBY3lkCdJ03Mjlf4b0duXhZFYCPtaIj5Qr1C328&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53665918742_89f1181c1d_k_d.jpg) 

pinecil soldering iron at 350°C

For surface mount, heat one pad and put the tiniest amount of solder you can onto it. Then get the diode ready in tweezers butting up to that solder blob. Reheat it and slide the diode so the lead is in the solder and it&#39;s properly centered on the footprint. Hold it steady while you remove the iron. For the other lead, heat the pad &amp; lead and solder them as normal.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s1dX4jupixhgZ54TbDh-V2E0RlKGCqZ4Fw53tml616sE&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667003108_38d4ff5c3f_k_d.jpg) 

first dots of solder on diode pads

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,spdx1hipKh_RLhSpDB2J6M727xKID43ULa5OuI2PFGI8&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667250295_f038cd605d_k_d.jpg) 

getting the diode alignment ready

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sh9caviKIjOYZCWcDs9Ca1_VHjz5mXn1HUNDMEeztRS0&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667250080_2eb8e7c0d9_k_d.jpg) 

both pads of a diode soldered

Continue for the rest of the diodes. After each row or column, do a scan to visually confirm they are all facing the same way.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sXbsgtJNjDAp-v2aK3hgBWBM0Ntvpn6zyHsb1fZ83cw4&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667429895_3b2e31ba6b_k_d.jpg) 

diodes done on left side

## Solder the hotswap sockets

Still working on the bottom, install a hotswap socket. Heat one pad by shoving your iron into the metal bit of the hotswap socket and flood it with a decent amount of solder. Being careful not to burn yourself, use the tip of a finger to press the other side of the socket firmly down to be sure it&#39;s evenly seated before retracting the iron from the other side. Use tweezers or a pencil eraser or something if you are worried, but I was able to just use my finger and suitable amount of caution. Solder the other side and repeat for each key.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s0mP5D4jFwiEhthQEuxylvwQgptApIF9d5MZWpjNHK3M&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666960681_07ea0ab7d1_k_d.jpg) 

hotswap sockets going on left bottom

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sB0dWaLUBFuB1_lMjZtw55PM5iwzdd3rntSMTFw5zpDg&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667178308_3bfd642aed_k_d.jpg) 

left side hotswap sockets done

## Solder the MCU jumper pads

Turn the PCB over so you are looking at the left top side. We are going to connect each pair of jumper pads within the MCU footprint. Heat both pads with your iron tip if possible and get a small dot of solder to cover both pads. Make sure when it cools there&#39;s enough solder so it doesn&#39;t shrink to 2 disconnected dots, but not a huge amount that might spill to a nearby pad or through hole. Note that the silkscreen instructions say &quot;R. Side - Jumper Here&quot; and this is the left side for us. This is OK. We want our MCU mounted face up so the buttons are accessible, but the footprint was designed primarily for folks who like to mount their MCU face down.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sajztJZJaTlOW1-5rIgIQrUzHd5XdDt03mqzldEjfk40&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53713640443_4d06ebf571_b_d.jpg) 

Diagram of orientation for MCUs and jumper pads

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s47ljEXSFxvV-Eb4Sw1Xq5LtmIXzOVo4xBCVPQiQjbFc&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666092497_69f0429d11_k_d.jpg) 

working on the left top MCU footprint jumper pads

Continue until each pair of jumpers is connected.

You can use socket headers if you like, but I&#39;m not very concerned about moving my $4 MCU to another keyboard, so I just use normal pin headers. The MCU has 1 extra through hole compared to our PCB footprint, so you&#39;ll need to snip 1 pin header off the strip to have the right number. 

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNjgCbVNllN_awBsuK7TBhOHHlJjRqqkvWCIcg8c097g&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667317504_477292c8f1_k_d.jpg) 

Snipping off the extra pin

Set 2 columns of pin headers into a breadboard, longer section of the pin in the breadboard, shorter section sticking up in the air. Mount the MCU onto the pins with the empty pair of through holes closer to the USB connector. The through holes at the corners furthest from the USB connector should have pins in them. The MCU should be face up with the buttons visible.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,soCGxir-8gVAvYhl9XBU1hhsCR2f5xFhzuaIv23hOCTw&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666092512_e7487e4074_k_d.jpg) 

Pin headers in the breadboard to hold everything properly while soldering

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sd8B4O2Y2itVrsleDpJKH7UfhzWARtDIaU9XWbF3KHNA&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667316384_41a13b6f71_k_d.jpg) 

Take care to align the correct through holes

Solder the pin headers.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,selJL7u-ecOfHg2ufHfCnk6ZHNEvis6azJQeI2_uSsZQ&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666958401_0b66ce019f_k_d.jpg) 

That 4th one is no bueno and needs a reflow

## Solder the MCU to the PCB

Put the MCU into the PCB from the top then turn it upside down to solder from the bottom side.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sGzr-cMu2c05yN6S6vMK45WPd91geNsdyuzqjZFj57-U&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666090347_a3a81d4e78_k_d.jpg) 

placing the MCU onto the PCB top side

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sqlNZDncyiDS6IYFOGNyw-6kn8AtvWtTWlRiw0gx5cAU&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667176033_00bced4778_k_d.jpg) 

flipped over so we can solder the pin headers from the bottom

Solder the pin headers to the through holes.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sHzO8TywPuRecogvuLrpFCL6BSxsktjDUKEebPNSsM94&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667175863_bdb6b4ad30_k_d.jpg) 

pin headers soldered

Next we&#39;ll trim these flush BUT these tend to fly off and really want to poke into your eyeball. Wear safety glasses and&#x2F;or put something on top of the header to hold it in place while you trim it so it doesn&#39;t fly off. I used a little piece of dense packing foam that was lying around.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sWn6YwSp3EOsq51ODiaAM3WbyFGrN77HTjCAjtLTPtOM&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667176008_e152d09daf_k_d.jpg) 

flush cutting the pin headers without eye boo-boos

## Solder the TRRS connector

This mounts to the top side of the PCB and solders on the bottom. I rested the top of the TRRS connector on my breadboard to hold the connector flush against the PCB while soldering.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7Mp3J7AaYIRhrR2mlLJBr6iobVaYgMsyN3ONoMwTfU4&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53668251693_7d5d5b0806_k_d.jpg) 

TRRS connector pins getting soldered from the bottom of the left half

## Install some switches

You can now install switches into the hotswap sockets. Make sure both switch pins are not bent and aligned properly to seat into the socket. I like to support the underside of the socket with my finger and press firmly to get each switch fully seated and flush but not put too much force on the solder joint for the hotswap socket.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sZl0iY1bkeImOw8Sga986yxQiwhalS-KtLMcTC3pJs7g&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667315414_9612836197_k_d.jpg) 

putting in some switches

## Plug it in and see if it types

You can now connect USB (assuming your MCU is already flashed with firmware) and it should type letters. If something doesn&#39;t work, check diode orientation. You may need to reflow some solder joints if anything is not working. Note the USB connector on this MCU is not mechanically very strong, so be gentle when plugging and unplugging it and take care you are moving the plug straight and level.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sXOQld9l95TE4ST9leaNvtIfznrsUD-Wi5l5rSWXCxpY&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666085582_ea356e3258_k_d.jpg) 

checking typing with xev

## Take break

Rest your mind a bit if you intend to do both halves the same day.

## Proceed to the right half

## Right side diodes

**NOTE** the diode orientation will feel different on the right half. Make sure you are soldering them to the right half bottom side. The diode arrows will point left which means the diode label text will likely be right side up on this half of the keyboard.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sEcjmteW7VgqXk1YMKlhLlU-7y68bwpzCrRuyu_W7UMM&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667310024_c8ee0d4f58_k_d.jpg) 

right side bottom showing diode direction

## Right side hotwsap sockets

No surprises here.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sL3dMXUUffHecOYsmptA6WdODelcH1K8-dP6VskhsRYo&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667170943_c371a8bb83_k_d.jpg) 

right side bottom with diodes and hotswap sockets soldered

No surprises here. Buttons face up.

## Right side MCU jumper pads

You will solder the MCU footprint jumper pads on the TOP RIGHT side. This is essentially &quot;the same&quot; as the left side, but it&#39;s tricky so I want to be clear about this.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s4iXv6-sLYGvloAj_JCSTCOyq2aJBLvopRdJAI9TPHc8&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666085247_b0b89e6861_k_d.jpg) 

MCU footprint jumper pads soldered on top right side of the PCB

## Right side MCU to PCB

No surprises here. Buttons face up.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s47uefMG9c1PcMs1apbSf8G8TFqZCS_8d45RPQoQOijU&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666098752_8a5d524a92_k_d.jpg) 

about to solder the MCU pins to the PCB from the right side bottom

No surprises here.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sHHGaCO7ZbCBhrvjcR_r0u3zl5rM2pQ7urEIfm0fZlJw&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53666098762_c2bffba72a_k_d.jpg) 

flush cutting the MCU pin headers on the right half bottom side

## Right side TRRS connector

No surprises here.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s80YaX4OGtnfYoz9fRKxnh4VEODEJWpPjDN7IUNn8WqQ&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53667164452_c790325104_k_d.jpg) 

TRRS pins getting soldered on the right side

## Test the full keyboard

TRRS has an annoyance that the connector shape slides across a short circuit as you put the jack into the plug, so it&#39;s best to only connect&#x2F;disconnect TRRS when USB is already disconnected. I&#39;ve never seen this actually cause problems even after doing this wrong all the time on my ergodox for years, but I think it&#39;s a real thing that could damage your keyboard.

So connect the halves with TRRS, then connect the left half to USB. Both halves should work properly.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,srbWjd7szsh7t5V6u2k4S4_wCx01Zccz3IXCefXqicw4&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53668493145_28c1af6216_k_d.jpg) 

Assembly done. Time to plug in and type.

## Add bottom liners

Perhaps the lowest-profile option for a case is no case. You may want to glue shelf liners to the bottom side for a little electrical shielding and a non-stick, non-scratch material for the desktop.

I cut my liners just a few mm smaller than the PCB shape and used some gorilla glue. I put the tiniest drop I could manage into the center of each hotswap socket, taking care not to get any glue into the actual socket. I spritzed the shelf liner with water which is how this glue says to do it. I left it with a little weight pressing it overnight to cure.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sJHfw_rPQRk-9DcmAY-Sl0T9LEuy-9KzPjZLTe6_emto&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53706726955_67d77c506c_k_d.jpg) 

cutting shelf liner

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7Y1mIqLH-OJ25_BXLu80GC8sbC77hCR0EgFracybOyM&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53707561179_33950c2be8_k_d.jpg) 

I recommend covering the entire bottom of the board unlike I did in this first attempt to keep the contacts shielded

## Done!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sbqKlM06Jt-H2iG07GsHcnCvPel3tBg0FM3q11-puLiI&#x2F;https:&#x2F;&#x2F;live.staticflickr.com&#x2F;65535&#x2F;53715068120_7b864e2188_k_d.jpg) 

Here&#39;s a build in 3D printed case with palm rests clipped on

May your thumbs forever be untucked and your switches be silent!

[ back to blog index](https:&#x2F;&#x2F;peterlyons.com&#x2F;problog&#x2F;) 