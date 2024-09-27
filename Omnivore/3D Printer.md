---
id: cb6b2444-b775-4d9b-8c41-24304e5a8b67
title: 3D Printer
tags:
  - RSS
date_published: 2024-08-24 13:04:44
---

# 3D Printer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/3-d-printer-191860ae8e0)
[Read Original](https://elijer.github.io/garden/devnotes/3D-Printer)



## Setting up the 3D printer at Recurse!

Recurse _had_ a 3D printer, but when I arrived it was not functional nor did anyone seem to have much faith it ever would be. [Kaylyn Gibilterra](https:&#x2F;&#x2F;www.google.com&#x2F;search?q&#x3D;kaylyn+gibilterra&amp;oq&#x3D;kaylyn+gibi&amp;gs%5Flcrp&#x3D;EgZjaHJvbWUqBwgAEAAYgAQyBwgAEAAYgAQyBggBEEUYOTINCAIQABiGAxiABBiKBTINCAMQABiGAxiABBiKBTINCAQQABiGAxiABBiKBTIKCAUQABiABBiiBDIKCAYQABiABBiiBDIKCAcQABiiBBiJBTIKCAgQABiABBiiBNIBCDMyMjFqMGo3qAIAsAIA&amp;sourceid&#x3D;chrome&amp;ie&#x3D;UTF-8) showed an incredible amount of initiative and crowdsourced the funds necessary to buy a new one. Throughout the process, it became evident that Kaylyn’s experience working with 3D printing allowed her to choose a much more modern, affordable and feature rich printer model than most people were familiar with.

&gt; Base model: [Bambu A1](https:&#x2F;&#x2F;us.store.bambulab.com&#x2F;products&#x2F;a1?variant&#x3D;41583355199624¤cy&#x3D;USD&amp;utm%5Fmedium&#x3D;product%5Fsync&amp;utm%5Fsource&#x3D;google&amp;utm%5Fcontent&#x3D;sag%5Forganic&amp;utm%5Fcampaign&#x3D;sag%5Forganic&amp;gad%5Fsource&#x3D;1&amp;gclid&#x3D;CjwKCAjwqre1BhAqEiwA7g9Qhk8C2qhjF8lCrGcbq5fL2sigTFIpTrZw6qdd7O0edUzcLrtlroIs1hoCEw4QAvD%5FBwE)nozzle: 0.4mm

&gt; Smaller nozzles print in more detail, but more slowly

When I arrived, [Kelechi](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;kelechi-nwankwoala-44b6a8131&#x2F;)had starting lubricating the slider underneath the plate.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sEIpiKp_gKBI9INpLuAJOfifpnkt9v3JpW25WAppRZhs&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;dea57afc96e5d8300fee5a78539df424.jpeg)

## Notes on Filaments

## Beginner Plastic

**PLA** \- easiest to print with, biodegradeable![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5Yhm8Thg42n0UoTQlTx_Z6k1KdjWDtxoPoh357XU-U4&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;fff587733f4641ac150c4904bbe6ac0f.jpeg)

## Non-biodegradeable plastic

These plastics won’t get warped in the sun, but they also will _literally never degrade_

* **PETG**
* **ABS**

## Softer Plastics

Not sure how degradeable these are, but they are softer, and can be used to make more flexible models:

* **TPU**
* **Nylon**

## Other filament types

* cleaning filament (cleans nozzles)
* wood filament
* transparent

I wonder: are there filaments that are made to be printed more like spaghetti? I know this is traditionally something to be avoided, but I can’t help but think that by relying on the strength of the extrusion itself and a very sparse number of intersections, very lightweight but still relatively strong prints could still be made. The material would have a huge effect on the rigidity of these types of prints. However, softer, more flexible materials like nylon would have an interesting effect as well!

Maybe this is possible using a certain infill setting that prints the sparsest possible result.

## Model Creation Workflow

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,skbauPXqgDfb7M3q9qz2WsQ8Cs4ZIRt34QuVUDvyv6b0&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;9cda86a38c44b6b82e3e3205f9762a0e.jpeg)

### Step One: Model

Use a 3D modeling program like blender to create a model, then export it as an STL or a 3MF

&gt; STL’s are more universal, but 3MF’s allow for the encoding of color data. The A1 has a type of nozzle (or maybe it’s a different kind of attachment?) that allows the printer to switch between up to 4 different colors. As it is now, it is possible to pause the print job and manually switch out colors, which doesn’t require color encoding in the file, but for the automatic color switching, a 3MF is necessary. There are _also_ 3D printers out there that can _mix_ colors, creating gradients, but this one does nont do that.

OR go to a 3D model marketplace and download a free or paid model for use. Kaylyn noted that you can usually drop these into a 3D modeling software and modify them if you would like.

### Step Two: Load model into slicer

Next, open your model in the the Bambu &#x60;slicer&#x60;, a program that takes STL or 3MF files and does a variety of treatments to them to allow them to be printed. I guess it’s called a slicer because the form a 3D model’s data has to be printed in is a series of layers stacked on top of one of each other? Each coordinate it prints in each layer _may_ is then translated into &#x60;GCODE&#x60;, - the actual language that commands are sent to the printer in.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,smCgals39OPQqVjmiQHXPG8ZD1KYbjo9MUo3_CGor31g&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;55389a83d293bf0bf9769a2ae0b0a5b0.png)

Slicer’s have many features to explore:

* **brim** \- an artificially added excess around the base of a model that helps with plate adhesion
* **raft** \- similar to a brim, but not just on the edge
* supports&#x2F;stilts - necessary to add for floating pieces, something to avoid if possible
* **infill** \- the inside of a model is not solid but rather a partial fill of material, in a waffle design, hexagons, or a huge variety of other patterns, in order to both save material and print faster
* **ironing** \- there is a way that a lower-flow or even 0% flow passover of the nozzle can sort of melt the top surface of a model to be smoother

The tool in the slicer that was most useful for me was the &#x60;Cut&#x60; tool, which allowed me to cut the bottom of the model off to get a more even surface like this:

## Step Two Point Five

Check the 3D printer - is there filament threaded into the head? Is there an existing model on the plate? Has the plate been put on correctly? Has the residue from the filament test been cleared from the last test? Are there any errors on the monitor, or any weird business in general? Are there any objects in the way that might get in the way of the movement of the printer, or that could spill? Is any extra filament from messed up prints out of the way?

## Placing and Removing the Plate

The plate can be easy to miss - here’s an instructional video for taking it on and off that may come in handy whether you are prepping or finishing up your print job

## Step Three: Press Print!

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,snt78tpafNugWSB7Tkpe-tZpAuplmmLHM-BwaIV9PADQ&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;629b925ebcfb20471e2464f0dc77ba89.jpeg)

## Step Six: Monitor and wait

This little surfboard I printed took about 15 minutes, the octopus in the video at the top of this article took about an 88 minutes. The A1 has a webcam that shows the progress, so you can leave the premise and monitor it remotely.![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sz7kPCfA5N3BfHCquFd7JiBuurVqgnwYtfolg0vNOFpg&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;4f8759e281cf89ad22cc7f08f4b368a2.jpeg)

## Step Five: Peel the result off the plate

Kaylyn showed me that the best way to get a model off of the plate was to remove the plate itself. The plate on the A1 is connected magnetically, so it can be popped off. Kaylyn instructed me to wave the plate like a fan, cooling it off. Once it was cool, it was pretty easy to peel the model of! And voilé, you just printed your first model.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sUJJpi0rwMjfwyuTFgwjLivvoMzd4ohKBjbvnUjD6m0M&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;2357995ce6022a0e989e7e8074c73712.jpeg)

&gt; This is literally the first 3D model I’ve ever printed. It felt so good.

## Programs for creating 3D models

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sT2sy_m6gFDZxGXYi2QChvww2jQTaUNggK1jibprCNac&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;97d967d4077bae1e45473e4a8499cef7.png)Blender is an incredible open source and free piece of software (maybe the most impressive free software that exists, period), but it is also an absolute _beast_. The collective wisdom seemed to be this; if you have the time, it is worth learning Blender, because it’s free, it’s the standard of multiple industries (game dev 3D models, animation rigging, animation rendering, computer generated images), and there’s nothing it can do that another 3D modeling software can do better.

That said, it is difficult to learn without a teacher. I have experience using Autodesk Maya, Unity, and Sketchup and it’s _stillI_ downright intimidating to me. There are things that transfer, but other things are completely different. I am lucky enough to be surrounded by blender aficionados and wrote up some quickstart notes below from graphics whizkid [Seamus Edson](https:&#x2F;&#x2F;www.seamusedson.net&#x2F;) that were incredibly helpful to me below, in the &#x60;Blender&#x60; section of this article.

There are a gazillion programs that can export STLs and are probably more beginning friendly:

* Openscad
* Sketchup
* TextEdit (jk. I mean technically you could hardcode an STL.)

## Results

The results of my first project are in! I was able to print a mess of surfboard earrings for a friends. I’ve ordered some earring hooks and have some acrylic paint at home to experiment with. It took me several iterations, but I got the model pretty close to what I wanted.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,se1YFuxaH1dxD57pfia4zhyymrGXUXgzY88cJ0Od-7J4&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;6a2997cea894790b0979e79d34aaf23a.jpeg)

I found that although the subdivision modification in blender makes things smooth and organic, it can wreak havoc on smaller details, reducing them to meaningless nubs.

In the future, I’d really like to learn about creating prints that have 3D parts like ball-joint sockets, or snap-fits. It’s an amazingly fun feeling to be able to conjure up these shapes out of their original forms as pixels on screens!

## Update (August 5th)

I ordered some earring fixtures on amazon, dug up my acrylic paint, and got to work. Here’s what I made:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sKGSS2VcnFK3tAjJ8igxY_mB_EqEDaj0sf9lezLH0p7c&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;3d403ccb73e8e10115cc21edb357b0a8.jpeg)

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5jFnwgeF49Faic9DoHq57SeN81zdN3VlkDHV0O0mAY8&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;ccb8e60149a25554cc921ca70927b12e.jpeg)

The mess that came with it:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,so47vkoqbVvXOhqfWgn9HCYen2EsnZfOSDmgkJifKjtw&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;8b72b2cecbf744df3f483e765f8d1f21.jpeg)

At some point I wanted to create something geometrically louder, edgier (too on the nose?) and came up with this:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sJb4M6LTRbgXLtj8pp-flZkwIypCtjRaw81NHXmy4LjU&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;cc840d12e97651f84de91d6edd35e52b.png)

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,shTJTlsXT25zJvd628FNnz_wIbaNHtj66kXP18RDzpLg&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;02c0e16a4a608319c075bd9353b7d2be.jpeg)

There was something about keeping with this basic, boxy geometry that was really fun. It actually inspired me to download a voxel editor &#x60;Goxel&#x60; and mess around a bit. Turns out &#x60;Goxel&#x60; can export &#x60;OBJ&#x60; files, which can be read by a 3D printer in addition to a &#x60;3MF&#x60; or &#x60;STL&#x60;.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAAx363SN7YXhwLltKWXBcRZmITVXqtE47Ea5R3Vpxy8&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;b94614c59da6b2f43d5f1764c0fe2ae7.png)

One advantage to voxel editor’s over a full-blown 3D workspace like Blender is that they are much more beginner friendly.

I made some creatures out of voxels that got me excited, but in order to easily create bodies for them, I felt it would be helpful to have some components that snap together. I haven’t yet looked into this too much, so my plan was simply to print things at a few different scales and see if they would click together &#x2F; how they would interact.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sq1Lam9v5nz2qZLOfjYasLgoLNjaIAsTpYUoyMCVe8Ug&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;445eb43d1a0fdeccb4b93ff7d0d662a1.jpeg)

The only ones that ended up clicking were 130% scale with 95% scale. So a positive piece roughly 2&#x2F;3rds of the volume of a negative cavity will click! Now that I have this IRL observation, I will probably be more proactive and seek out the science and math that explains this, like [Sam Wlody](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;sam-wlody&#x2F;)suggested, rather than waste precious filament.

## Bonus: [Seamus](https:&#x2F;&#x2F;www.seamusedson.net&#x2F;)’s and Boswell’s Excellent Notes on How to Make a Surfboard in Blender

Bozz doesn’t actually have any web presence so I just linked a famous musician with the same name instead since he likes music.

Command + &#x60;,&#x60; to open settings. change keybindings so that &#x60;space&#x60; isn’t &#x60;play&#x60; but instead is &#x60;search&#x60;search set &#x60;curser 3d origin&#x60;

Start with a cube add loop cuts command R is loop cut tool scroll to adjust subdivisions click to lock in (you get a chance to slide, but don’t) There is an arrow at the bottom left to see loop cut options If you want to select your loop agin, hold control and, while in edge mode, click a vertex

Shift A - opens new shape menu You can use this to create a plane instead of a cube, or many other shapes

symmetry - open the modifiers menu - search for &#x60;mirror&#x60;, and select an axis to mirror - You’ll want to delete half of your model that goes over the axis you are mirroring on I think? - turn on &#x60;clipping&#x60; \- once points are ON the axis, you can’t make them leave - turn on &#x60;merge&#x60; if you take a point and move it close, merge it like a finger to a mirror (don’t mirror negative coords on that axis)

Other modifers

* the &#x60;solidy&#x60; modifier allows the plane to have dimensionality without having to work with the complexity of a 3D model
* The &#x60;subdivision&#x60; modifier smooths everything out (but while still allowing a simple base mesh to remain editable)

Object mode vs. edit mode

* use tab to switch between these - object mode is for adding modifers to objects, adding them, deleting them, moving the entire object, etc
* edit mode is more for changing specific properties of an object: for me this mostly means changing the mesh

point &#x2F; vertex &#x2F; face mode

* This is a subset of modes that are part of the edit mode
* By default, I think you can switch between them with the 1, 2, and 3 keys
* But Russwel Boswell changed my configuration to use the virtual numpad, so now I can’t!
* Which is okay, because they also have 3 buttons to switch between them in the UI on the top left

Selection

* w is normal select
* b changes to box select
* c is circle select
* On mac, holding down shift and holding down a right click allows for lasso select

numpad emulation

* mostly nice because you can switch between lots of views using the numbers very easily

deletion

* x
* different in object and edit mode

proportional editing

* really crazy circle button thing in the top-middle right-ish - if clicked, you can make more organic changes in edit mode because things are changed depending on their distance from your change, like a splash effect, rather than truly only editing vertices&#x2F;faces&#x2F;points in isolation

blender scripting API

* Not going to dive into this now but Blender is totally scriptable with python

Ah! My faces detached!

* apparently the key &#x60;v&#x60; “rips” things off of other things. Not great! So these faces won’t be displaced, but when you try to move them, they won’t be attached to their neighbors anymore. To fix this,  
   * Make sure you are edit mode  
   * Select everything on your current continguous model by pressing one part of it then pressing &#x60;L&#x60; \- you could also just try to select everything you thing is relevant about your issue  
   * Press the &#x60;mesh&#x60; dropdown menu, and find &#x60;merge by distance&#x60;. I think you might need to press enter, or apply or something.

---