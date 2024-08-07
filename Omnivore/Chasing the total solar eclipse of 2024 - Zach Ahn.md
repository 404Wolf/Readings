---
id: 2d9460de-6c86-4e35-9fcf-e3da6d68dd57
title: Chasing the total solar eclipse of 2024 - Zach Ahn
tags:
  - RSS
date_published: 2024-05-22 19:05:49
---

# Chasing the total solar eclipse of 2024 - Zach Ahn
#Omnivore

[Read on Omnivore](https://omnivore.app/me/chasing-the-total-solar-eclipse-of-2024-zach-ahn-18fa2e68f21)
[Read Original](https://zachahn.com/posts/1716417248)



Long story short—my wife and I decided to rent a car and drive to wherever the skies would be clear enough to see the eclipse. In addition to all the logistical headaches, I had a fortune-telling headache—**where exactly should we go to optimize our chances to see the eclipse?**

I read [Eclipsophile](https:&#x2F;&#x2F;eclipsophile.com&#x2F;2024tse&#x2F;) to get some tips and to get a rough idea of what to expect. A few days before the eclipse, I found an [article](https:&#x2F;&#x2F;www.washingtonpost.com&#x2F;weather&#x2F;2024&#x2F;03&#x2F;29&#x2F;cloud-cover-eclipse-forecast-maps-cities&#x2F;) (or see [archived post](https:&#x2F;&#x2F;archive.is&#x2F;p1a6e)) with a table of possible cloud coverage. I figured that the model would be good enough, and I quickly built a map to determine where we should consider heading.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sp1gt7UedIRThHSZ4ZColkqZzdlKCDbQMhssA6-3EbaI&#x2F;https:&#x2F;&#x2F;zachahn.com&#x2F;files&#x2F;4bd052e6e1f28644f805b099eeb08f01) 

Map of New York State, with several blue circles in different shades denoting the likelihood of clear skies.

It’s a little subtle, but clearer skies are bluer, while cloudier skies are more transparent. You might notice that the blue circles further north are darker than the blue circles towards the south.

## Hacking together the map

I usually write production-ready code, even for my side projects. This started off no different, but I quickly realized that this code would only really be used a handful of times in total. So I had a lot of fun optimizing for development speed, rather than for maintainability.

For example, I copy-pasted the tabular data and saved it as a &#x60;tsv&#x60;. I parsed it using Ruby’s CSV library. Since I have family upstate, I filtered out all non-NY locations. I wrote a separate script to query &#x60;nominatim.openstreetmap.org&#x60; to get approximate latitude&#x2F;longitude coordinates. This was a little more complicated since they have strict usage limits.

Lastly, I used [Leaflet](https:&#x2F;&#x2F;leafletjs.com&#x2F;) to draw the map itself. Normally, I would have pulled it as an NPM package, but it ended up being easier to download pre-built files.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sF-woj2djk3D82WEWGi0IG71xYEeXNNrbHe4nkZa5t3c&#x2F;https:&#x2F;&#x2F;zachahn.com&#x2F;files&#x2F;2131f5d2773555acd155eb56ea5487c5) 

Map of the western area of New York State. The chances of blue skies seemed to be pretty low here!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,seCDPOd6OcKfieUvzIuGfEnjSdihyfej1JtVQtE0THJA&#x2F;https:&#x2F;&#x2F;zachahn.com&#x2F;files&#x2F;709622b32482fb473a1c08ba2fdeef27) 

Map of the northern area of New York State. The chances of blue skies seemed pretty good, especially towards Vermont.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sieCBKcwT2OEbmj3YeEqmhjKohDsLCtRFdKB1L3wcsDc&#x2F;https:&#x2F;&#x2F;zachahn.com&#x2F;files&#x2F;6cba0e9e4345a2a861e32d221451063d) 

Map of Robert G. Wehle State Park, where we ended up watching the eclipse.

So after all this work, how were the skies? Honestly, a bit cloudy, but we were thankfully able to see the eclipse through a thin layer of clouds.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s19Si8eJw6AITCG1W1KoAA3KTLqASjDwi0mp7BNBln0c&#x2F;https:&#x2F;&#x2F;zachahn.com&#x2F;files&#x2F;91d0c53ac2bf6695411aac3fbf944da5) 

A blurry shot of the eclipse through my phone. I don&#39;t know why it looks like this!

I made the decision prior to the eclipse that I would focus on being present rather than focusing too much on taking photos. I kinda wish I had more photos, but honestly, I wouldn’t have been able to take better photos even if I had more time.

It was quite an experience—the cooler weather, the 360° sunset, the ring of light surrounding the moon, the entire crowd excited to experience it. Not sure if I’ll be able to experience this again, but I very much hope to, and I do strongly recommend trying to see 100% totality if you have the chance! There is a **huge** difference between 99% and 100% coverage, and we were really surprised to see how bright the sun remained even as more than 90% of the sun was blocked by the moon.

_(A huge thanks to my aunt and uncle who hosted us, and to my understanding wife who had to bear months of my anxiety around this event.)_