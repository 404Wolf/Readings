---
id: 449a24d0-fa9b-11ee-a334-2f0094817b30
title: Earth could be round, Earth could be flat, Earth could have violet sky - Wishful Coding
tags:
  - RSS
date_published: 2024-04-14 00:00:00
---

# Earth could be round, Earth could be flat, Earth could have violet sky - Wishful Coding
#Omnivore

[Read on Omnivore](https://omnivore.app/me/earth-could-be-round-earth-could-be-flat-earth-could-have-violet-18ede3d0ee2)
[Read Original](http://pepijndevos.nl/2024/04/14/earth-could-be-round-earth-could-be-flat.html)



My dad likes to argue with flat earthers on Facebook, so I decided to steel man a consistent flat earth theory. The premise is simple: you just take a 3D azimuthal equidistant projection of the spherical world and rewrite physics in the new coordinate system. This is what it looks like:

This is very similar to a geocentric model of the universe, it’s not fundamentally wrong to choose earth as your reference frame, just very inconvenient for describing orbits around the sun. In the same way it’s not fundamentally wrong to assume the earth is flat, but it warps the rest of the universe in strange ways.

For example, here is a round earth. We observe ships disappearing over the horizon, and we observe day and night.

![a round earth with a sun shining on it and a person looking at a ship on the horizon](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,snq0EUTapsOgor4BSq70GcW56PprYBs4xuWyX6CcntRs&#x2F;http:&#x2F;&#x2F;pepijndevos.nl&#x2F;images&#x2F;flatearth&#x2F;roundearth.png)

Most flat earth models don’t tend to have satisfactory explanations for sunset, things disappearing behind the horizon, and eclipses. The solution is simple: light curves away from the earth. At some point sunlight curves back into space.

![the inverse polar transform of the above image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sdDuEGdUEcWrszXO0GSdsls1SSR7OxPxjDOcL01Rqn_E&#x2F;http:&#x2F;&#x2F;pepijndevos.nl&#x2F;images&#x2F;flatearth&#x2F;flatearth.png)

In this model the sun is still further away than the moon, so a solar eclipse is simply the moon moving in front of the sun as usual. In a lunar eclipse, the light of the sun has to bend so deep that it would touch the earth before it could bend back up to the moon.

A lovely result from this flat earth model is that it clearly answers the questions what is below the earth: the singularity. Even better is that the density of the earth goes down the closer you get to the singularity, meaning the earth is in a sense hollow. Finally a grand unifying theory of hollow earth and flat earth models!

The downside of this model that physics isn’t independent of location and direction. For example the atmosphere is denser in the middle of the disk. A simple equation like F\&#x3D;maF&#x3D;ma becomes hellishly complicated if you want it to work everywhere. There is also a magic Pacman teleportation point on the south pole.

This model is internally consistent and impossible to falsify since it is simply a coordinate transform of conventional physics. You can’t make any observations that would disagree with the model and agree with a spherical model since they are the same universe. It is not possible to measure which way of looking at things is “real” because all your observations and tools are curved in the same way. Therefore, you could interpret the earth to be flat.

With the combined skills in Blender and mathematics of me and my brother, we managed to implement the flat earth coordinate transformation in Blender geometry nodes so that you can make a 3D model and see what it looks like on a flat earth.

![Blender geometry nodes](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sN6Jurk7xBhIpKTdacEkX33c2vVWgaTZJJYHDLKt6Ap4&#x2F;http:&#x2F;&#x2F;pepijndevos.nl&#x2F;images&#x2F;flatearth&#x2F;geometry.png)

We struggled to get lighting to work since Blender would render linear light after the transform, so instead we drew physical light cones with luminescent hemispheres that pass through the transform correctly. Unfortunately this means we can’t render eclipses, but the upside is you can really see the wild curves light makes on a flat earth.

We’ve theorized that it might be possible to bake lighting into the texture as is commonly done for video games, but it’s nice weather outside so we pressed render and left eclipses as an exercise to the reader.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s63lpd7vyK1HCC7XFFrmGP5EcMeRte4tzIBXNeKIBEbA&#x2F;http:&#x2F;&#x2F;pepijndevos.nl&#x2F;style&#x2F;sep.png) 