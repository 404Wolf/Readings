---
id: b5e30348-fe68-11ee-bbc7-a396b95d8c2a
title: "Researching file formats 34: iOS App Store Package · BITS BLOG ✴ Ashley Blewer"
tags:
  - RSS
date_published: 2024-04-19 10:07:46
---

# Researching file formats 34: iOS App Store Package · BITS BLOG ✴ Ashley Blewer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/researching-file-formats-34-i-os-app-store-package-bits-blog-ash-18ef7289c65)
[Read Original](https://bits.ashleyblewer.com/blog/2024/04/19/researching-file-formats-34-ios-app-store-package/)



## Researching file formats 34: iOS App Store Package

This blog post is part of a series on file formats research. See [this introduction post](https:&#x2F;&#x2F;bits.ashleyblewer.com&#x2F;blog&#x2F;2023&#x2F;08&#x2F;04&#x2F;researching-file-formats-library-of-congress-sustainability-of-digital-formats&#x2F;) for more information.

Update: The official format definition is now online here: [IPA](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;digital&#x2F;formats&#x2F;fdd&#x2F;fdd000593.shtml). [Comments welcome](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;digital&#x2F;formats&#x2F;contact%5Fformat.shtml) directly to the Library of Congress.

Like last week’s post on the Android package, the iOS App Store Package is also… (dun dun dun)… just a ZIP archive file!

It’s also not really well-disclosed, with no official docs from Apple that specify the .ipa file as a format.

Structured like this:

* iTunesArtwork (this is just a png file without the extension)
* iTunesMetadata.plist (metadataaaaa)
* Payload&#x2F; (the app binary)
* META-INF&#x2F; (more metadatatatatata)

According to this [Apple documentation](https:&#x2F;&#x2F;web.archive.org&#x2F;web&#x2F;20181026175002&#x2F;https:&#x2F;&#x2F;developer.apple.com&#x2F;library&#x2F;archive&#x2F;qa&#x2F;qa1795&#x2F;%5Findex.html) initially created at 2014-03-06, there are several types of .ipa files, which I’ll summarize:

* App Store submission .ipa: “a compressed directory containing the app bundle and additional resources needed for App Store services, such as .dSYM files for crash reporting and asset packs for On Demand Resources”
* universal .ipa: “compressed app bundle that contains all of the resources to run the app on any device. Bitcode has been recompiled, and additional resources needed by the App Store, such as .dSYM files and On Demand Resources, are removed. For App Store apps, this .ipa is downloaded to devices running iOS 8 or earlier”
* thinned .ipa: “a compressed app bundle that contains only the resources needed to run the app on a specific device. Bitcode has been recompiled, and additional resources needed by the App Store, such as .dSYM files and On Demand Resources, are removed. For App Store apps, this .ipa is downloaded to devices running iOS 9 or later.”
* universal app bundle: “the decompressed universal .ipa”
* thinned app bundle: “the decompressed thinned .ipa”

LC’s Recommended Format Statement defines this as a [“distribution file”](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;resources&#x2F;rfs&#x2F;software-videogames.html), stating “Distribution file (e.g. ipa \[Mac iOS\], apk \[Android\], exe \[Windows\]): The distribution file is disseminated for public use regardless of the means of dissemination (on physical media or via an online source) and is comprised of one or more files from the gold standard build.

We all know Apple loves the “technical protections considerations” category, so this is a can-o-worms. There’s [FairPlay](https:&#x2F;&#x2F;nicolo.dev&#x2F;en&#x2F;blog&#x2F;fairplay-apple-obfuscation&#x2F;), and the way it works out is a bit interesting, but I’m not going to get into it here – I yawned while typing that, so I guess I’m lying about it being interesting, I was just using a generic word to describe it when I didn’t have anything noteworthy!