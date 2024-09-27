---
id: 240e977b-ca38-4804-b543-f1a3181e5101
title: Rotation-Based Compression
tags:
  - RSS
date_published: 2024-09-23 00:00:00
---

# Rotation-Based Compression
#Omnivore

[Read on Omnivore](https://omnivore.app/me/rotation-based-compression-192200ecc18)
[Read Original](https://www.winstoncooke.com/blog/rotation-based-compression)



## Background

In the late 19th to mid 20th century, the United States Department of Agriculture hired dozens of artists to paint watercolors of every fruit that grows in the United States. The [collection](https:&#x2F;&#x2F;search.nal.usda.gov&#x2F;discovery&#x2F;collectionDiscovery?vid&#x3D;01NAL%5FINST:MAIN&amp;collectionId&#x3D;81279629860007426) contains 7,497 watercolor paintings, 87 line drawings, and 79 wax models created by approximately 21 artists. I thought this would make a great set of images to choose a random photo every day to use as my desktop wallpaper. The entire collection is 59.06 GB in size because the images are stored in archival quality.

Right off the bat, I noticed that there are a few images that have to be rotated because their orientation is incorrect.

[![A watercolor of strawberries.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3VLPiqK-_W_oMgm6tmJLishcRmmXK9d130Y5k04VO9U&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;3473cbc1-338b-4484-8bef-6e2aa0ba5000&#x2F;public &quot;Fragaria: Strawberries&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;3473cbc1-338b-4484-8bef-6e2aa0ba5000&#x2F;gallery)

One such image that required rotation is [strawberries](https:&#x2F;&#x2F;search.nal.usda.gov&#x2F;permalink&#x2F;01NAL%5FINST&#x2F;178fopj&#x2F;alma9916344285407426), so I went ahead and rotated it.

[![The strawberries image rotated to the correct orientation.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sLJG8NbRLRfJxfDeo2pyrhVrp9Kgd6SpQQwfZ0-apeJ4&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;ce996fa6-af3a-4355-58e7-73bdec629000&#x2F;public &quot;Strawberries - Rotated&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;ce996fa6-af3a-4355-58e7-73bdec629000&#x2F;gallery)

After rotating the image, I noticed something interesting. The original image’s file size was 12.67 MB, but the rotated image’s size was only 5.41 MB. That’s a huge size saving! And even better, I can’t visually tell the difference.

## Image quality

I used ImageMagick to compare the qualities:

bash

&#x60;&#x60;&#x60;perl
identify -format &quot;%Q&quot; POM00000042.jpg
98%
&#x60;&#x60;&#x60;

bash

&#x60;&#x60;&#x60;perl
identify -format &quot;%Q&quot; POM00000042-rotated.jpg
93%
&#x60;&#x60;&#x60;

Clearly there’s a difference that I don’t notice visually. This got me wondering what’s going on when Preview rotates an image. I looked up how Preview rotates images and came across a MacOS tool called &#x60;sips&#x60;.

## sips compression

I next ran the direct sips compression command to reduce the original image quality to 93%:

bash

&#x60;&#x60;&#x60;reasonml
sips -s formatOptions 75 POM00000042.jpg
&#x60;&#x60;&#x60;

[![The strawberries image compressed via sips.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s0jzqUO-jqC09b48q52v317Imhqi1vlOwNoTMxwy50rE&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;6cf763b9-b99e-4163-b9ca-c0c7cc794b00&#x2F;public &quot;Strawberries - sips compression&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;6cf763b9-b99e-4163-b9ca-c0c7cc794b00&#x2F;gallery)

The quality of this image was also 93%, but the size was 6.57 MB, which is larger than the rotated image!

## ImageMagick compression

Next, I wondered what would happen if I used a more mainline tool to compress the image to 93%. Surely ImageMagick will be the most efficient right?

bash

&#x60;&#x60;&#x60;reasonml
magick POM00000042.jpg -quality 93 POM00000042.jpg
&#x60;&#x60;&#x60;

[![The strawberries image compressed via sips.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sYeJa1wjO9EF-0nY55CvqTmbIvTI1WbUDxG65X9NqPPA&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;9c162c6a-8b3f-44f8-9771-4e3f9ddf0300&#x2F;public &quot;Strawberries - sips compression&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;9c162c6a-8b3f-44f8-9771-4e3f9ddf0300&#x2F;gallery)

The size of this image was 7.01 MB, which is even bigger than &#x60;sips&#x60;. Something must be going on when the image is rotated. What would happen if we rotated the image 360 degrees to keep it in the same orientation? Well it turns out using sips to rotate 360 degrees doesn’t do anything, but if you first rotate the file 90 degrees and then rotate it another 270 degrees to return it to its original orientation, the image compresses.

## strawberry compression

I wrote a script called [strawberry](https:&#x2F;&#x2F;github.com&#x2F;winstonrc&#x2F;strawberry) that handles this rotation.

[![The strawberries image compressed via sips.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sWWkQjnw1Dy_7TuqZo9dCRxScH3U_1-P22n0NyoAR8Bs&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;8d89c711-1789-4a78-a880-1f4adf267b00&#x2F;public &quot;Strawberries - sips compression&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;8d89c711-1789-4a78-a880-1f4adf267b00&#x2F;gallery)

After rotating the original image in place, the output size was 4.10 MB, which is the smallest file size yet. That’s a 68% reduction in size, and I still can’t notice the difference!

## GIMP comparison

The next step I took was to compare the compressed image with the original image in GIMP to check for differences. Assuming I correctly made the comparison, GIMP showed that there was no visual difference. Well that’s pretty great for me.

## Rotating too many times

Next I decided to rotate the image 12,500 times for fun.

[![The strawberries image compressed via sips.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sez7zeShJhN-VluFwiGF2CHsVgkhhHHSfJimymmZ7PBk&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;6373de11-f47b-4ea5-9907-95f3d41e8e00&#x2F;public &quot;Strawberries - sips compression&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;6373de11-f47b-4ea5-9907-95f3d41e8e00&#x2F;gallery)

I think this might provide a hint at what’s going on. When I compare the difference between this image and the original in GIMP, it now shows a lot of differences.

## Thoughts

So what’s going on here? I’m not entirely sure, and this is where my ignorance of JPEG works. My understanding is that JPEGs don’t have lossless rotation by default, and that is true for &#x60;sips&#x60; as well. There’s a great [article on JPEG](https:&#x2F;&#x2F;parametric.press&#x2F;issue-01&#x2F;unraveling-the-jpeg&#x2F;?imageSrc&#x3D;https:&#x2F;&#x2F;na-st01.ext.exlibrisgroup.com&#x2F;01NAL%5FINST&#x2F;storage&#x2F;alma&#x2F;EF&#x2F;36&#x2F;0D&#x2F;3F&#x2F;A1&#x2F;B5&#x2F;08&#x2F;B1&#x2F;08&#x2F;07&#x2F;9C&#x2F;02&#x2F;F0&#x2F;BD&#x2F;BC&#x2F;68&#x2F;OBJ.jpeg?Expires&#x3D;1727103492&amp;Signature&#x3D;CJc9HNhbRZ7dRGZKlF9rbxUaeR4YGgofkeU4sWLqD8OSDkTAbhH0wJPOsWYB-NyeOvabkGwxT89o6mnYUiLX-du1Gq7AHBS-90ebH9X7fwoFIHvUT522oS5fP5xLerD0xQ5Wu~7K5NEXV5Nvji8niCbAzA8QMAuSzYA-m-UO4Jxr9bwd8h3lQsepUBscvS6Vmk-9rTZmguW9IvCTi5n7hq8ex4i6sOgQV7iU704U1a6PTJU3zJIasxpTJjBeEihbD6zfxKUDksiK3Al9QbQZB53ngq0SytB6eq0addSamhjDuv4Kq7u5Ur1w8B1Q52oGQjbDz-7yuYCVy7v0S622Yg%5F%5F&amp;Key-Pair-Id&#x3D;APKAJ72OZCZ36VGVASIA), which allowed me to plug in strawberries as an example image. I believe there’s either some minor compression happening related to the Discrete Cosine Transform or a lossless saving from the Huffman Encoding, but I’m not 100% confident on either option. Regardless, it seems doing a single rotation compresses the image to a smaller size than direct compression, and I can’t visually perceive the difference. That’s an absolute win for me. The final thing I noticed is that this method seems particularly effective on the set of images that are stored in a significantly higher quality than most other JPEGs, so that’s worth considering as well.

The original size of the image collection was 59.06 GB. After compressing them, it dropped down to about 17 GB. That’s a roughly 70% size reduction! I wish I could find an answer for what’s going on, but I’m pretty happy with the results.