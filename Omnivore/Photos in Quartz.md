---
id: b6900832-8756-4071-b3ad-6a0e2875d007
title: Photos in Quartz
tags:
  - RSS
date_published: 2024-07-29 19:03:47
---

# Photos in Quartz
#Omnivore

[Read on Omnivore](https://omnivore.app/me/photos-in-quartz-19100fd0753)
[Read Original](https://elijer.github.io/garden/Dev-Notes/Quartz/Media)



## The Goal

I want to find a way to easily link photos without using up my Quartz storage, since I sort of want to sync my quartz notes with my phone at some point. Not there yet though. Here are the options I’ve found so far.

## Google Photos Plugin

I did find \[this guys google photos plugin\] which looks interesting. The setup will take some time I don’t currently have though, so I will return to this.

## Google Drive

Seems like this could be really doable, especially with the desktop app, but it doesn’t seem like I can host images with google drive easily - it’s not like an image hosting service I guess.

## S3

I found that just making a public S3 bucket for videos is working pretty well. This was necessary immediately since github has a 100mb file limit and also…really doesn’t like uploading large media files. If you accidentally manage to get a 100mb file cached in github, it’s a huge pain to remove it. You can use a tool called &#x60;git-filter-repo&#x60; to remove those cached files.

Anyways, once uploading videos to S3 (which is faster than youtube, and at least in quartz, styles much more cleanly right out of the box) you can include those files with these simple video tags:

&#x60;&lt;div class&#x3D;&quot;video-container&quot;&gt;
	&lt;video controls&gt;
	&lt;source src&#x3D;&quot;https:&#x2F;&#x2F;thornberry-garden.s3.us-east-2.amazonaws.com&#x2F;Moss2.mp4&quot; type&#x3D;&quot;video&#x2F;mp4&quot;&gt;
	Your browser does not support the video tag.
	&lt;&#x2F;video&gt;
&lt;&#x2F;div&gt;&#x60;

### Update

I found an Obsidian community plugin that allows me to drag and drop media into obsidian and it will be automatically uploaded to S3!

---