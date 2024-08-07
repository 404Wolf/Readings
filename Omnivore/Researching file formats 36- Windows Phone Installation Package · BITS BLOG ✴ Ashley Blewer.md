---
id: d838783c-0968-11ef-9826-5b26dddc133d
title: "Researching file formats 36: Windows Phone Installation Package · BITS BLOG ✴ Ashley Blewer"
tags:
  - RSS
date_published: 2024-05-03 10:06:27
---

# Researching file formats 36: Windows Phone Installation Package · BITS BLOG ✴ Ashley Blewer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/researching-file-formats-36-windows-phone-installation-package-b-18f3f406d7a)
[Read Original](https://bits.ashleyblewer.com/blog/2024/05/03/researching-file-formats-36-windows-phone-installation-package/)



## Researching file formats 36: Windows Phone Installation Package

This blog post is part of a series on file formats research. See [this introduction post](https:&#x2F;&#x2F;bits.ashleyblewer.com&#x2F;blog&#x2F;2023&#x2F;08&#x2F;04&#x2F;researching-file-formats-library-of-congress-sustainability-of-digital-formats&#x2F;) for more information.

Update: The official format definition is now online here: [Silverlight Application Package](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;digital&#x2F;formats&#x2F;fdd&#x2F;fdd000595.shtml). [Comments welcome](https:&#x2F;&#x2F;www.loc.gov&#x2F;preservation&#x2F;digital&#x2F;formats&#x2F;contact%5Fformat.shtml) directly to the Library of Congress.

Okay, this was a fun one! If you remember using Netflix in the early-to-mid 2010s, you might remember having to download this extra thing called Silverlight in order to stream video. For reasons that I would love to have a full-length book on, that same package application, Silverlight, is also the same as the short-lived Windows Phone installation package, or XAP ([pronounced “zap”](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;archive&#x2F;blogs&#x2F;katriend&#x2F;silverlight-2-structure-of-the-new-xap-file-silverlight-packaged-application)).

In addition to the confusion around the two use cases (phones and Silverlight), XAP is also the extension for XACT Audio Projects, which is also now called Microsoft XNA Game Studio.

Both Windows Phones and Silverlight are discontinued products.

* Windows phones ran from [October 21, 2010 to June 2, 2015](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Windows%5FPhone)
* Silverlight existed from [September 5, 2007 to January 15, 2019](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Microsoft%5FSilverlight)

Like the two previous package formats, XAP files are also essentially just ZIP files structured in a specific way. These have two manifest files and some DLLs (containing the compiled version of the application).

Documentation is sparse, all around.

XAP format was replaced by APPX format, although not for long since Windows Phones had a less-than-5-year lifespan.