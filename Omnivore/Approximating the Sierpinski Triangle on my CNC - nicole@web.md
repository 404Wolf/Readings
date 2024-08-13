---
id: c295248f-571d-4e81-94bd-b2ec3a737031
title: Approximating the Sierpinski Triangle on my CNC | nicole@web
tags:
  - RSS
date_published: 2024-07-15 00:00:00
---

# Approximating the Sierpinski Triangle on my CNC | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/approximating-the-sierpinski-triangle-on-my-cnc-nicole-web-190b67ed01f)
[Read Original](https://ntietz.com/blog/approximating-sierpinskis-triangle-on-my-cnc/)



**Monday, July 15, 2024**

One of my big hobbies outside of tech is chess. I like to play it, and I also help run our town&#39;s chess club. As part of that, we like to run rated tournaments to get our members some experience in a low-pressure tournament environment. These are my responsibility to organize and run, and our club&#39;s only certified tournament director.

We hosted our first tournament last winter. The whole thing went off well, except that I was supposed to have a prize medal for the winner. Our vendor fell through, and I had nothing except congratulations for the winner[1](#hi-call-me).

With our second tournament coming in May, I needed a solution. Or rather, I used the &quot;solution&quot; as an excuse to get a new toy. Instead of buying a medal, I&#39;d buy a _tool_ that I could use to make medals for the winners. And then they&#39;re also one-of-a-kind.

I made a simple model of a medal and convinced myself that this would work, I&#39;ve somehow done it and figured it out. I could either make the medal on a 3D printer or I could cut it out of wood with an automated woodworking tool (called a CNC), and since I already have a well-equipped woodshop, I opted for the latter, to complement what I already have.

Before long, my very cheap CNC[2](#real-cheap) arrived in the mail, and I had to get to work. But I didn&#39;t know what I was doing, so first I _played_ to learn how to use it. And my first project was very fun, and accelerated my learning by containing many of the difficult cases I didn&#39;t run into for my real use case.

## What&#39;s a CNC?

&quot;CNC&quot; means &quot;computer numerical control&quot;, and it refers to tools which are automated and controlled by computers. This is in contrast to most tools, which are controlled manually with at _best_ precise digital measurements.

Within the category of CNC, you have a lot of different tools. The most common are routers and mills, but the rest are interesting as well.

* CNC routers have spinny sharp bits on them that can cut slots, holes, fancy shapes, whatever! They move around on an x-y plane, but also have some z-axis depth control, so they work in 3 dimensions. Routers usually cut wood and soft materials.
* CNC mills also use spinny sharp bits, and are similar to routers. The distinction comes in their axes (mills tend to have smaller working areas, but much more depth capacity) and rigidity and torque (mills are much better at cutting harder things). Mills also tend to have more axes, such as 5, by adding rotation to be able to produce more complicated parts. You usually cut metal and hard materials on a mill.
* 3D printers are CNC!
* Laser cutters are CNC!
* You can have a CNC lathe!

The category is gigantic. In my case, I got a CNC _router_, but I often say I&#39;m milling something on it. Now let&#39;s see how we do that.

## How do we CNC something?

See, while I had made a model and bought the CNC, I hadn&#39;t accounted for any of the rest of the process of actually milling something. In my head, the process for making something on the CNC was roughly:

1. Design the part in CAD.
2. Run it on the CNC and get finished part!

This illusion was shattered when one of my friends who does a lot of 3D printing asked me what I was using for my CAM software. &quot;CAM software? Uhhh...&quot;

It turns out, after you make a part in CAD, you then have to convert that into tool paths for the machine. These are the instructions for how it moves around, how fast it spins the motor, and, well, everything it does. The software that does that is called [CAM (computer-aided machining)](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Computer-aided%5Fmanufacturing), and it turns out it&#39;s not trivial. And if you design your part without toolpaths in mind, you&#39;ll likely make a part that you can&#39;t actually mill!

So the _real_ process for making something on my CNC is more like:

1. Design the part in CAD.
2. Put it into CAM and make toolpaths, then go to 1 to fix design mistakes. Repeat a lot.
3. Upload it to my CNC, run it, break a bit, and go to 2 to fix toolpath mistakes.

Fixing bugs in a physical manufacturing process can be a lot slower and more expensive than in software.

Let&#39;s look at what I wanted to make, then see how to do it. Since I&#39;m a Linux user, this process required using some less common tools; the usual ones are Windows&#x2F;Mac only.

## What&#39;s the Sierpinski triangle?

A fractal is basically a shape that&#39;s self-repeating. The most famous fractal is probably the famed [Mandelbrot set](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Mandelbrot%5Fset). This one would be fun to make, but the rapid approach toward infinitely small curves makes it hard to mill.

Instead, I picked the [Sierpinski triangle](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Sierpi%C5%84ski%5Ftriangle), which is another fractal. It starts with an equilateral triangle. Then inside of it, you draw another equilateral triangle, upside down. This partitions it into 3 &quot;up-facing&quot; triangles and 1 &quot;down-facing&quot; triangle. Then you just repeat this process (smaller!) inside each of the up-facing triangles.

![Illustration of Sierpinski triangle, four iterations](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sj2zk9dNzlANWAkYuVRG4wHj7IpgWfYsXZsyrpKGUDwg&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;sierpinski-1.png &quot;Four iterations of the Spierpinski triangle&quot;)

Here we can see four iterations of it. The real fractal goes on infinitely, getting infinitesimally small. This forms a fascinating image. And more important for my purposes, it&#39;s something you can sort of mill! Obviously you can&#39;t go infinitely small in a physical process, but it&#39;s a lot easier to approximate this than it is to approximate a Mandelbrot set on my CNC.

So now we have to turn it into something on the computer, working our way closer to instructions the CNC uses.

## Modeling it with OpenSCAD

The first step for me was modeling it with a CAD program. This is a natural fit for [OpenSCAD](https:&#x2F;&#x2F;openscad.org&#x2F;), which lets you generate models through code[3](#freecad). I&#39;d dabbled before to make a proof-of-concept model of a prize medal, but doing this required me to go deeper into OpenSCAD and start using functions and modules.

The strategy I took for modeling this was to first focus on generating a model of the triangle, with each iteration stacked atop the previous one, and then separately figure out how to remove that from the wood block we&#39;re going to be working with. This turned out to be _very_ helpful for debugging, since I could separate out the layers—if this were subtracted out of our stock, those would be stuck invisibly inside a block! After we have the triangle model, we&#39;ll make a rectangular prism (our block of wood) and subtract our triangle out of it.

My first step was laying out some parameters for the model as constants. This way, if we need to change anything, we can update these.&#x60;INCH&#x60; is included as a constant, since OpenSCAD is unitless, but I&#39;m working with it assuming it is millimeters (which my CNC expects) while my woodworking equipment is in Imperial units (tablesaw and thickness planer in particular). You&#39;ll notice that the layers are very thin, less than 1mm! That&#39;s because, again, my CNC is _cheap and slow_, and any more than that was going to take far too long to produce. But let&#39;s call it an ✨ aesthetic choice ✨.

&#x60;&#x60;&#x60;ini
INCH&#x3D;25.4;
buffer&#x3D;0.5*INCH;
width&#x3D;4*INCH + buffer;
thickness&#x3D;0.25*INCH;
layer_height&#x3D;0.75;

&#x60;&#x60;&#x60;

For this model, I took a very iterative approach, drawing from all my software engineering experience. (I don&#39;t know what the equivalent of a unit test would be in this world, though. If you do, please let me know!) To start out, I made a model of the Sierpinski triangle in OpenSCAD. I did one layer first, to get an equilateral triangle rendering. Here are some of the functions I ended up with[4](#fillet).

&#x60;&#x60;&#x60;lsl
function sq(a) &#x3D; a*a;

function midpoint(a, b) &#x3D; [(b[0]+a[0])&#x2F;2, (b[1]+a[1])&#x2F;2];

function triangle_top(a, b) &#x3D;
    let (length &#x3D; sqrt(sq(a[0]-b[0]) + sq(a[1]-b[1])),
        height &#x3D; length * sqrt(3) &#x2F; 2,
        mp &#x3D; midpoint(a,b),
        xd &#x3D; (b[1]-a[1]) &#x2F; length * height,
        yd &#x3D; (b[0]-a[0]) &#x2F; length * height)
     [mp[0] - xd, mp[1] + yd];

module eq_triangle(a, b) {
    c &#x3D; triangle_top(a, b);
    points &#x3D; [a, b, c];
    offset(1.5, $fn&#x3D;20)offset(delta&#x3D;-3)offset(1.5)polygon(points);
}

&#x60;&#x60;&#x60;

Then I did the iterative step, to work out the math of it. One of my early attempts wound up with this beauty:

![Screenshot of an attempted Sierpinski triangle, with the layers spreading out in the x-y axes instead of stacking atop each other.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sdTgc60vI72T2eqQX0sum8xyKn08iI0pLZCJjbppuLSU&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;sierpinski-2.png &quot;Screenshot of an attempted Sierpinski triangle, with the layers spreading out in the x-y axes instead of stacking atop each other.&quot;)

I do think that I made _art_ here, but it&#39;s really not what I was going for—and it&#39;s not going to be something I can mill! So I fixed my math, and with some struggles I got a working model. Here&#39;s the module for that, along with the render.

&#x60;&#x60;&#x60;angelscript
module sierpinski(layers, width) {
    origin &#x3D; [0,0];
    a &#x3D; origin;
    b &#x3D; [origin[0]+width, origin[1]];
    mp &#x3D; midpoint(a, b);

    &#x2F;&#x2F; to subtract it out of the block instead, use 1*layer_height
    translate([0,0,1*layer_height]) {
        linear_extrude(layer_height+0.1) {
            eq_triangle(a, b);
        }

    if (layers &gt; 0) {
            translate([0,0,0])
            sierpinski(layers-1, width&#x2F;2);

            translate([mp[0],mp[1],0])
            sierpinski(layers-1, width&#x2F;2);

            tt &#x3D; triangle_top(a, mp);
            translate([tt[0],tt[1],0])
            sierpinski(layers-1, width&#x2F;2);
        }
    }
}

&#x60;&#x60;&#x60;

![Screenshot of a Sierpinski triangle going upways.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sM7S2NLNERIyx_Fgf1G1W4Ed1Wl8nM36qpvd24Ef9nRs&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;sierpinski-3.png &quot;Screenshot of a Sierpinski triangle going upways.&quot;)

You&#39;ll notice that this looks sorta like some of those kids&#39; building blocks from a [notoriously litigious toy company](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;The%5FLego%5FGroup#Trademark%5Fand%5Fpatents). Why&#39;s that? Because if you have two straight edges contacting each other, OpenSCAD will happily display it but will then complain about a 2-manifold something-or-another when you try to render it for real[5](#but-not-now). One of my friends explained that this is because the model is assumed to have those properties for optimization purposes (renders can already be slow) so if they&#39;re violated, such as two straight edges contacting each other that have nothing else attached to them, it can&#39;t compute the model! We resolve this by adding a [fillet](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Fillet%5F%28mechanics%29) on the inner corners so they&#39;re rounded, and we get this look!

This is ultimately to our benefit, though, because we _can&#39;t produce sharp inner corners_ on the CNC. We&#39;re using a round bit, spinning in circles. So this better models what will actually happen on the CNC, and we&#39;ll get fewer surprises in the later steps.

Now we have a Sierpinski triangle going upways, but we ultimately want to cut it _out_ of our stock. To do that I adjusted a constant. I could probably actually flip it in the model, but I was tired and picked the first thing that worked. And then we subtract the flipped model out of our stock!

&#x60;&#x60;&#x60;arduino
difference() {
    linear_extrude(thickness) {
        square([width,width*sqrt(3)&#x2F;2]);
    };
    translate([buffer&#x2F;2,buffer&#x2F;2,thickness]) {
        sierpinski(5, width - buffer);
    };
}

&#x60;&#x60;&#x60;

![Screenshot of a render of Sierpinski triangle carved out of a block of wood.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s2K0niC8pOhePvSJlG3IBku7EQ_uajhc6rXG9BUMQyOw&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;sierpinski-4.png &quot;Screenshot of a render of a Sierpinski triangle carved out of a block of wood.&quot;)

Whew, now we have the model! That was the hard part, right? ...Right? Ahhh hahaha, sweet summer child that I was.

## Turning it into commands for the CNC

This is the part where we break out the CAM software. CAM (computer-aided machining) software turns your model into commands that your machine can run. This is often [G-code](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;G-code). You can think of G-code as sort of like assembly code that a CNC runs.

Here&#39;s a snippet from one of my models:

&#x60;&#x60;&#x60;gcode
G21
G90
M3 S1000
G0 X1.4560 Y0.6702 F6000
G0 Z1.0 F300
G1 Z-0.6250 F250
G1 X2.3053 Y0.2921 F500

&#x60;&#x60;&#x60;

Each of these commands either sets a mode on the machine (G21 sets the unit to be millimeters) or performs a command (M3 starts the spindle, G0 and G1 are forms of movement). This would be incredibly tedious to write out by hand, but it&#39;s theoretically doable[6](#i-want).

To get the model into this form, we pop it into our CAM software and do some work. The CAM software I use is [Kiri:moto](https:&#x2F;&#x2F;grid.space&#x2F;kiri&#x2F;). This software is a whole other thing you have to learn.

The crux of it is this: You tell it which operations you want the machine to do, and then it tries to figure out how to do it. Along the way, there are a ton of parameters to tune. Of course you have to tell it the tools you have (in my case, a 1mm endmill bit) and it has to know some information about your CNC. And then for each operation, you need to tell it things like how fast to turn the spindle, how much to move over or down on each pass, if you want to leave excess material (very handy to do rough passes first, then come back and clean it up).

Here&#39;s what it looks like from my most recent run of this model.

![Screenshot of Kiri:moto running in Chromium.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sY72_1K213DxEou4w2tieJHQ0o9yOT-YRXT9JUBkG44Y&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;sierpinski-5.png &quot;Screenshot of Kiri:moto in Chromium with a model.&quot;)

When I first opened this software, I was overwhelmed. What are all these boxes? You don&#39;t have to understand each of them, but understanding them will help you avoid broken bits and repeated trial runs on your CNC.

What&#39;s really handy are the preview and animation tabs, which let you see the paths it&#39;s going to generate and watch it pretend to mill out your part. Really neat, and a good way to validate a design!

After something looks good in your CAM software (which took me as long as modeling the part the first time, but is a lot faster now), then you download the G-code and go to the workshop to run it.

## Making it real

With the G-code in hand, I ran to the workshop and made the part. And it worked! I was happy with it, but also... It had blemishes and it had artifacts from the machining, where my toolpaths were clearly bad. It was rough, and it showed my inexperience. So I did it again, and the _second_ one I made is where I learned a lot of ways to improve (and some more silly mistakes to make).

Here&#39;s the first one, fresh off the machine.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sN6mGXG9Rv1JMm7KgG3Kp12y8tDqHbqiBqXpngDRBrgA&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;sierpinski-finished-1.da0e16487e6be4f8.jpg)

Then the second one in progress.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sYAS7nojxB8q9rUBBcM8u80WSO9hjZhKgzj5-4q6C77c&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;sierpinski-finished-2.590003bea7a8efde.jpg)

And finally, the second one side-by-side with the first one. The second is on the left (I&#39;m a monster, sorry), and if you zoom in on the vertices of the triangles of each, you can _really_ see the artifacts on the first one. It&#39;s so sloppy! The second one is _so_ clean!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,seVub_k6JJUr2Y_iV2t5SxF6qiCatOOhWDqBCsuJuebw&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;sierpinski-finished-3.93c9b0500f4c64ea.jpg)

As a bonus, here&#39;s the oak medal I made for a chess tournament, also fresh off the CNC. I finished in time, with a day or two to spare, and the tournament went off without a hitch!

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,syoFD_cILLZXxX0b5QckZ8jpD0xdUbQx_sgObPdmT6nk&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;sierpinski-finished-4.e698b361a23a5ca0.jpg)

## Broken bits and deep soulful joy

This project taught me a lot of lessons very quickly. I broke a few bits making part and left scars on my machine. Each time it was for something silly, and each one was a lesson. A lesson in setting up parts on the machine. In designing good toolpaths to improve schedules _and_ end results. In how to remove parts from the machine without breaking them or your bits. And in how to design things that can be physically produced.

The lessons are hard-won and each time it usually comes with some physical marker of your failure. Maybe it&#39;s a broken bit that you needed to produce your part, so you&#39;re blocked until new ones arrive. Or maybe it&#39;s a ruined part and a lost day&#39;s work. Or maybe it&#39;s physical scars on your machine, forever commemorating that silly mistake.

These hard-won lessons can wear you down.

The iterations were long, and each time I was sort of wondering, _why is it that I&#39;m doing this?_Fixing bugs in software is usually a lot faster and doesn&#39;t result in wasted material. But when it worked? Then I remembered _exactly_ why I&#39;m doing this.

Because _making physical things is joyous_ and makes my soul sing. There is a joy that I get from holding a small little piece that I made that is so often missing in my work as a software engineer.

It doesn&#39;t matter _what_ it is, making physical things is a joyous and vexing process. Baking a cake, making a fractal, framing a photo. Each of these connects me to reality and grounds me in our physical world in a way that&#39;s often missing from software alone.

Getting to hold a thing you made, and show it to a friend? It makes all the broken bits worth it.

---

Thank you to [Dan Reich](https:&#x2F;&#x2F;limitedcompute.com&#x2F;) for the helpful feedback on a draft of this post!

---

1

If for some reason he&#39;s reading this (or you know him; he&#39;s not from our club), email me! I&#39;d love to hook you up with a retroactive medal.

[↩](#hi-call-me%5Fref)

2

I&#39;m talking $250 cheap. This thing isn&#39;t going to do well on metal, and it won&#39;t win any speed awards, but it can do small jobs in wood.

[↩](#real-cheap%5Fref)

3

I did also try modeling some other things with FreeCAD, not least because you can do CAM inside it as well. I had it crash on me repeatedly, and it doesn&#39;t fit my brain as well as OpenSCAD (since I&#39;m first and foremost a programmer). Maybe I&#39;ll try out another one someday, but so far OpenSCAD is treating me well!

[↩](#freecad%5Fref)

4

The &#x60;offset&#x60; bits are to fillet the corners, which comes back around later. This code is presented in the logical order, but not chronological order that I developed it in. I don&#39;t think anyone needs to see the chaos that is my development process.

[↩](#fillet%5Fref)

5

Now I can get the model to render without this issue and without fillets, I think because all the layers touch and it&#39;s in the stock. But at any rate, this better shows what will actually happen on the CNC.

[↩](#but-not-now%5Fref)

6

For another project that&#39;s going on in the background, but delayed due to health issues, I&#39;m planning to generate G-code directly from another program. Still not doing it by hand, but I&#39;ll have to do a lot of inspection and reading of the G-code.

[↩](#i-want%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6)   
 Want to hire great programmers?[Hire via Recurse Center!](https:&#x2F;&#x2F;recurse.com&#x2F;hire?utm%5Fsource&#x3D;ntietz&amp;utm%5Fmedium&#x3D;blog) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) 