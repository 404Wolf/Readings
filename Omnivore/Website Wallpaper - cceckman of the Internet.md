---
id: 22e1ddee-098a-11ef-8baa-97ae59b385ac
title: Website Wallpaper | cceckman of the Internet
tags:
  - RSS
date_published: 2024-05-03 13:04:27
---

# Website Wallpaper | cceckman of the Internet
#Omnivore

[Read on Omnivore](https://omnivore.app/me/website-wallpaper-cceckman-of-the-internet-18f401a9944)
[Read Original](https://cceckman.com/writing/wallpaper/)



I spent a little time this morning making this site’s background. You can see the results - well, right here.

## Creative coding at Recurse

One cool activity at [the Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;8238c6d9149cbd0865752e535795d509)is a weekly “Creative Coding” meetup. Just before the session, someone picks a prompt– often a line or phrase from a poem. We get together to discuss ideas, implement them, and share them.

A couple weeks ago, the prompt was “proud-pied”, glossed as “gorgeously variegated”. I put together [this page](https:&#x2F;&#x2F;cceckman.github.io&#x2F;pied&#x2F;), which generates a background by simulating an interleaving of several variegated yarn strands. See more at [the source](https:&#x2F;&#x2F;github.com&#x2F;cceckman&#x2F;pied).

That was a neat exploration into Javascript’s canvas, and I’m happy with how it came out. Especially with the dynamism– refreshing can give very different results.

But (as implemented) it’s relatively resource-intensive on the client, and I don’t want to require a client to run Javascript for it to look good.

## Wallpaper of the mind

When I was quite young, my parents asked me what color I wanted by bedroom painted. I said I wanted it to look like blue jeans. They delivered: growing up, my walls were blue-jean blue, with thin, irregular white lines criss-crossing it.

I realized this would be pretty simple to simulate. Draw blue, add some random vertical and horizontal lines, tweak the randomness curve to make it match my memories.

Moreover, I could tweak the build process for my site to generate a new background on each deploy– giving it some dynamism over time, but not requiring anything dynamic on the user’s side.

## Results

The full background:

![Copy of the background image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sznPSZqgU6MxYXEma4qNSoBvNqJGe0sh3Ucfq8vV816s&#x2F;https:&#x2F;&#x2F;cceckman.com&#x2F;background.png)

## Source code

There’s plenty to tweak- in particular, this mechanism doesn’t necessarily give me the density that I want.

That said, here’s the source code:

| 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 | package main import ( 	&quot;fmt&quot; 	&quot;image&quot; 	&quot;image&#x2F;color&quot; 	&quot;image&#x2F;png&quot; 	&quot;math&#x2F;rand&quot; 	&quot;os&quot; ) const ( 	DIMENSIONS &#x3D; 512 	HALF       &#x3D; DIMENSIONS &#x2F; 2 	QUARTER    &#x3D; HALF &#x2F; 2 ) var ( 	white1 &#x3D; color.RGBA{220, 220, 220, 255} 	white2 &#x3D; color.RGBA{160, 200, 245, 255} 	white3 &#x3D; color.RGBA{215, 229, 247, 255} 	blue   &#x3D; color.RGBA{65, 151, 232, 255} ) &#x2F;&#x2F; We draw the image modulo-half-the-image. &#x2F;&#x2F; Rewrite each coordinate. func mod(coord int) int { 	return coord % HALF } func makeImage() image.Image { 	palette :&#x3D; color.Palette{ 		blue, white1, white2, white3, 	} 	img :&#x3D; image.NewPaletted(image.Rect(0, 0, DIMENSIONS, DIMENSIONS), palette) 	for y :&#x3D; 0; y &lt; img.Bounds().Min.Y; y +&#x3D; 1 { 		for x :&#x3D; 0; x &lt; img.Bounds().Min.X; x +&#x3D; 1 { 			img.Set(x, y, blue) 		} 	} 	&#x2F;&#x2F; First, the columns. 	&#x2F;&#x2F; More spaced out. 	for x :&#x3D; 0; x &lt; img.Bounds().Max.X; x +&#x3D; 12 { 		white :&#x3D; palette\[1:\]\[rand.Intn(3)\] 		&#x2F;&#x2F; Intentionally biased towards thinner lines, slightly. 		width :&#x3D; rand.Int() % 3 		&#x2F;&#x2F; We allow overlapping columns; they may be of different widths. 		start :&#x3D; rand.Intn(DIMENSIONS) 		length :&#x3D; rand.Intn(QUARTER) 		for i :&#x3D; 0; i &lt; length; i +&#x3D; 1 { 			for j :&#x3D; 0; j &lt; width; j++ { 				img.Set(mod(x+j), mod(i+start), white) 				img.Set(mod(x+j)+HALF, mod(i+start), white) 				img.Set(mod(x+j)+HALF, mod(i+start)+HALF, white) 				img.Set(mod(x+j), mod(i+start)+HALF, white) 			} 		} 	} 	&#x2F;&#x2F; Rows 	for y :&#x3D; 0; y &lt; img.Bounds().Max.Y; y +&#x3D; 6 { 		white :&#x3D; palette\[1:\]\[rand.Intn(3)\] 		&#x2F;&#x2F; Just single-width lines. 		&#x2F;&#x2F; Mostly shorter lines. 		start :&#x3D; rand.Intn(DIMENSIONS) 		length :&#x3D; rand.Intn(QUARTER &#x2F; 3) 		for i :&#x3D; 0; i &lt; length; i +&#x3D; 1 { 			img.Set(mod(start+i), mod(y), white) 			img.Set(mod(start+i)+HALF, mod(y), white) 			img.Set(mod(start+i)+HALF, mod(y)+HALF, white) 			img.Set(mod(start+i), mod(y)+HALF, white) 		} 	} 	&#x2F;&#x2F; We generated four tiles, so we only need to actually pick up one quarter. 	return img.SubImage(image.Rect(0, 0, HALF, HALF)) } func make() error { 	return png.Encode(os.Stdout, makeImage()) } func main() { 	if err :&#x3D; make(); err !&#x3D; nil { 		fmt.Fprintf(os.Stderr, &quot;encountered error: %s&quot;, err) 	} } |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |