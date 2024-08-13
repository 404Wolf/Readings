---
id: 74ccff97-1624-452e-8817-6e411dbf55e3
title: Dark mode basics | cceckman, from the Internet
tags:
  - RSS
date_published: 2024-07-31 14:06:30
---

# Dark mode basics | cceckman, from the Internet
#Omnivore

[Read on Omnivore](https://omnivore.app/me/dark-mode-basics-cceckman-from-the-internet-1910a6b7173)
[Read Original](https://cceckman.com/writing/dark-mode/)



If you use your computer &#x2F; phone &#x2F; browsing device in “dark mode”, you may notice this site doesn’t burn your eyes out any more. Here’s a few notes on how I implemented it.

## Variable colors

The first thing I changed was to shift all the color-related properties into CSS [variables](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;CSS&#x2F;Using%5FCSS%5Fcustom%5Fproperties).

| 1 2 3 4 | body {   color: #000;   background-image: url(&quot;&#x2F;background.png&quot;); } |
| ------- | ------------------------------------------------------------------- |

Before

| 1 2 3 4 5 6 7 8 9 | body {   color: var(--text-color);   background-image: var(--bg-image); } :root {   \--text-color: #000;   \--bg-image: url(&quot;&#x2F;background.png&quot;); } |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |

After

I’m not experienced with professional-grade CSS; if there’s a more idiomatic way to organize this, [let me know](#action)!

My stylesheet replaces those color variables by a CSS [media query](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;CSS&#x2F;CSS%5Fmedia%5Fqueries&#x2F;Using%5Fmedia%5Fqueries). Specifically, my site checks if the user [prefers a dark color scheme](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;CSS&#x2F;@media&#x2F;prefers-color-scheme).

| 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 | body {   color: var(--text-color);   background-image: var(--bg-image); } :root {   \--text-color: #000;   \--bg-image: url(&quot;&#x2F;bg-light.png&quot;); } @media (prefers-color-scheme: dark) {   :root {     \--text-color: #fff;     \--bg-image: url(&quot;&#x2F;bg-dark.png&quot;);   } } |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

I also updated my [wallpaper generator](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;wallpaper&#x2F;)to generate produce “light” and “dark” images, and replace the image accordingly.

## Line drawings

That takes care of most of the site, but there’s one exception: line drawings.

My [mechanical keyboards post](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;mechanical-keyboard-primer&#x2F;) has a lot of images. Most are photos, which don’t change for dark mode; but I’d like the line drawings to match the site’s foreground&#x2F;background colors.[1](#fn:1)

The CSS [filter](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;CSS&#x2F;filter) property applies various transformations to HTML elements, including images. For the line drawings, I use the [invert](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;CSS&#x2F;filter-function&#x2F;invert) filter.[2](#fn:2)

| 1 2 3 4 5 6 | @media (prefers-color-scheme: dark) {   .line-drawing img {     \-webkit-filter: invert(100%);     filter: invert(100%);   } } |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |

## Hope this helps!

I often [switch between light and dark mode](https:&#x2F;&#x2F;github.com&#x2F;cceckman&#x2F;Tilde&#x2F;blob&#x2F;9fe25fe7ecd19f636a34ba614c2d6d1ac86256a6&#x2F;themes&#x2F;retheme#L45), and I appreciate it when sites respect that. Hopefully this article helps you make the web a little easier on the eyes too!

---

1. A few of these are SVGs that I sketched; however, the lead photo is a line drawing from a patent. “Image format” isn’t enough of a selector! [↩︎](#fnref:1)
2. If you’re using Safari, [let me know](#action) if the [keyboard post](https:&#x2F;&#x2F;cceckman.com&#x2F;writing&#x2F;mechanical-keyboard-primer&#x2F;)looks right to you – Mozilla points to [this bug](https:&#x2F;&#x2F;bugs.webkit.org&#x2F;show%5Fbug.cgi?id&#x3D;246106) indicating that &#x60;filter&#x60; may not work for SVGs on Safari. [↩︎](#fnref:2)