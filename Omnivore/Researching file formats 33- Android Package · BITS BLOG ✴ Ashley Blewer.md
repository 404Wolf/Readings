---
id: 3fa468f0-f8e8-11ee-863c-d35be587ca27
title: "Researching file formats 33: Android Package · BITS BLOG ✴ Ashley Blewer"
tags:
  - RSS
date_published: 2024-04-12 10:06:25
---

# Researching file formats 33: Android Package · BITS BLOG ✴ Ashley Blewer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/researching-file-formats-33-android-package-bits-blog-ashley-ble-18ed31a1d79)
[Read Original](https://bits.ashleyblewer.com/blog/2024/04/12/researching-file-formats-33-android-package/)



## Researching file formats 33: Android Package

This blog post is part of a series on file formats research. See [this introduction post](https:&#x2F;&#x2F;bits.ashleyblewer.com&#x2F;blog&#x2F;2023&#x2F;08&#x2F;04&#x2F;researching-file-formats-library-of-congress-sustainability-of-digital-formats&#x2F;) for more information.

Update: The official format definition is now online here: [APK](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;digital&#x2F;formats&#x2F;fdd&#x2F;fdd000592.shtml). [Comments welcome](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;digital&#x2F;formats&#x2F;contact%5Fformat.shtml) directly to the Library of Congress.

First off, this work was made incredibly easier thanks to the work of Johan van der Knijff, particularly the blog series around working with mobile apps, the latest being [“Towards a preservation workflow for mobile apps”](https:&#x2F;&#x2F;www.bitsgalore.org&#x2F;2021&#x2F;02&#x2F;24&#x2F;towards-a-preservation-workflow-for-mobile-apps) from 2021, but the older posts on Android specifically hold up well and have been very helpful, too.

This format was somewhat easy because it’s secretly a ZIP archive file. Even more, it’s very similar to being a Java JAR file. There are just specific structures that make it an APK file instead, because that’s what systems that read APK files will expect. Some folders, some XML files, and that’s about it.

If you unzip it, you’ll see:

* META-INF&#x2F;: Directory that contains the manifest file, signature, and a list of resources in the archive
* lib&#x2F;: Directory containing compiled code related to specific platforms
* res&#x2F;: Directory containing non-compiled resources (e.g. images)
* assets&#x2F;: Directory containing applications assets
* androidManifest.xml: name, versioning information and contents of the APK file
* classes.dex: Compiled Java classes that can be run on Dalvik virtual machine and by the Android Runtime
* resources.arsc: Compiled resources file such as strings

Even though the format is “easy”, there’s still issues given that there’s no real official specification, there’s just some [guidance from Google](https:&#x2F;&#x2F;developer.android.com&#x2F;guide&#x2F;components&#x2F;fundamentals) and digging around in the code itself, making it easy enough to understand but a little harder to solidly prove (an endless battle with this project!).

The licensing stuff between Google and the Android open source project is a little hairy to explain succinctly, too. There’s also some stuff to consider around “technical protection considerations” and encryption &#x2F; privacy &#x2F; DRM, making things “safe”, everything on that topic can be challenging. There’s application signing, authentication, and regular encryption in addition to other under-the-surface complications with the “Google Play Store.” Next week I’ll cover a format that knows even more about that stuff, the iOS App Store Package.