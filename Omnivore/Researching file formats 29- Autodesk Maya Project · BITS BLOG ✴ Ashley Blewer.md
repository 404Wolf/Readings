---
id: f1918ae6-e2e7-11ee-b88f-9b773e53c87c
title: "Researching file formats 29: Autodesk Maya Project · BITS BLOG ✴ Ashley Blewer"
tags:
  - RSS
date_published: 2024-03-15 12:05:42
---

# Researching file formats 29: Autodesk Maya Project · BITS BLOG ✴ Ashley Blewer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/researching-file-formats-29-autodesk-maya-project-bits-blog-ashl-18e42ea3dc4)
[Read Original](https://bits.ashleyblewer.com/blog/2024/03/15/researching-file-formats-29-autodesk-maya-project/)



## Researching file formats 29: Autodesk Maya Project

This blog post is part of a series on file formats research. See [this introduction post](https:&#x2F;&#x2F;bits.ashleyblewer.com&#x2F;blog&#x2F;2023&#x2F;08&#x2F;04&#x2F;researching-file-formats-library-of-congress-sustainability-of-digital-formats&#x2F;) for more information.

This format described 3D scenes – geometry, lighting, animation, rendering, other stuff. It’s fairly straightforward, and I felt the [documentation](https:&#x2F;&#x2F;download.autodesk.com&#x2F;us&#x2F;maya&#x2F;2010help&#x2F;index.html?url&#x3D;Maya%5FASCII%5Ffile%5Fformat%5FOrganization%5Fof%5FMaya%5FASCII%5Ffiles.htm,topicNumber&#x3D;d0e678001) was relatively thorough while being succinct.

Preservation issues seem to mostly be around concerns with this file needing to be connected to other files:

Here’s what the specification has to say about this format: “If you want to write a program to translate Maya ASCII files to other file formats, you have a difficult job ahead of you. To do the job properly, you would not only need to be able to read in the files, but also to read in the referenced files. Since MEL references can contain any arbitrary MEL code, you would either have to not support them, or write a full MEL interpreter.”

(MEL is the Autodesk Maya scripting language)

This format really digs into the intricacies that I feel like the folks at the [Software Preservation Network](https:&#x2F;&#x2F;www.softwarepreservationnetwork.org&#x2F;) are tackling, and something [Rhizome](https:&#x2F;&#x2F;rhizome.org&#x2F;) has been thinking about for a very long time, around files that [depend upon](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;The%5FRed%5FWheelbarrow) other files.