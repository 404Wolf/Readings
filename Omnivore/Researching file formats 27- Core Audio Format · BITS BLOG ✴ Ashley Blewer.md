---
id: 089bb456-f368-11ee-a130-831a61daffb3
title: "Researching file formats 27: Core Audio Format · BITS BLOG ✴ Ashley Blewer"
tags:
  - RSS
date_published: 2024-04-05 10:07:30
---

# Researching file formats 27: Core Audio Format · BITS BLOG ✴ Ashley Blewer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/researching-file-formats-27-core-audio-format-bits-blog-ashley-b-18eaf0d3cca)
[Read Original](https://bits.ashleyblewer.com/blog/2024/04/05/researching-file-formats-32-core-audio-format/)



## Researching file formats 27: Core Audio Format

This blog post is part of a series on file formats research. See [this introduction post](https:&#x2F;&#x2F;bits.ashleyblewer.com&#x2F;blog&#x2F;2023&#x2F;08&#x2F;04&#x2F;researching-file-formats-library-of-congress-sustainability-of-digital-formats&#x2F;) for more information.

Core Audio Format (CAF) is a file format for storing and transporting digital audio data. It’s published by Apple. [Fully disclosed](https:&#x2F;&#x2F;developer.apple.com&#x2F;library&#x2F;archive&#x2F;documentation&#x2F;MusicAudio&#x2F;Reference&#x2F;CAFSpec&#x2F;CAF%5Fintro&#x2F;CAF%5Fintro.html), thoroughly, with helpful contextual statements. It was introduced in 2005\. I am a bit surprised, but relieved. Apple is not known for their openness when it comes to their formats, standards, operating systems, et al. I’ve just returned to using macOS after a very long time away, and I’ve been struggling with mixing a work Macbook’s keyboard shortcuts with my personal computer’s Linux shortcuts. I don’get too hung up on optimizing my machine, but even the basics cause me to struggle (like, the shortcut for copy&#x2F;paste are different by default). Anyway, that was a digression, apologies!

The other Apple formats I’ve been working with have not been well disclosed at all, and I went into this one assuming I’d have to do the same ambiguous work. Having something concrete and confident can really make this work so much easier than having to guess around different corners of the internet, working with sources that are of questionable&#x2F;layered authenticity.

This is a container for other formats, but I think there’s too many to list out – because it can be any number of them, and the list would be fairly exhaustive. This also makes it easier to answer some of the preservation questions, because the answer is “it depends on the codec, ask the codec!” (Between writing this and submitting this format for feedback, I did end up writing a good bit out – I will update when that FDD is live on the Library of Congress site!)

Anyway, happy Friday, I’ll leave you with this. My favorite part of the spec was this: Magic Cookie Chunk

“The Magic Cookie chunk contains supplementary (“magic cookie”) data required by certain audio data formats, such as MPEG-4 AAC, for decoding of the audio data. If the audio data format contained in a CAF file requires magic cookie data, the file must have this chunk.” ([source](https:&#x2F;&#x2F;developer.apple.com&#x2F;library&#x2F;archive&#x2F;documentation&#x2F;MusicAudio&#x2F;Reference&#x2F;CAFSpec&#x2F;CAF%5Fspec&#x2F;CAF%5Fspec.html#&#x2F;&#x2F;apple%5Fref&#x2F;doc&#x2F;uid&#x2F;TP40001862-CH210-SW1))