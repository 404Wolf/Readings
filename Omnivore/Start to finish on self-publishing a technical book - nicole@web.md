---
id: 71855cee-ef79-11ee-aa2a-fb4f41127786
title: Start to finish on self-publishing a technical book | nicole@web
tags:
  - RSS
date_published: 2024-03-31 00:00:00
---

# Start to finish on self-publishing a technical book | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/start-to-finish-on-self-publishing-a-technical-book-nicole-web-18e9548715d)
[Read Original](https://ntietz.com/blog/start-to-finish-on-selfpublishing-a-technical-book/)



**Sunday, March 31, 2024**

I&#39;ve been writing this blog since 2015, and my writing picked up pace in 2022\. That year I wrote 37,000 words, more than the 33,000 I&#39;d written up to that point. It has accelerated since then.

At some point, I realized that I&#39;ve put in a _lot_ of time and effort writing here, and got the idea to bundle it up into a book. The motivation here isn&#39;t to make money, because publishing books is rarely lucrative. Instead, there are two purposes: to give me a physical representation of the work I&#39;ve put in, and to give people a way to buy a token of appreciation of my writing. It&#39;s also a nice way to read the back catalogue; I&#39;ve purchased [similar books](https:&#x2F;&#x2F;leanpub.com&#x2F;computerthings2020&#x2F;) from authors I enjoy as a way to read their work away from the screen.

My book is now available in print! It&#39;s on [the publisher website](https:&#x2F;&#x2F;may11publishing.com&#x2F;), and also through the usual suspects like [Amazon](https:&#x2F;&#x2F;www.amazon.com&#x2F;dp&#x2F;B0CZB86NP1&#x2F;). The direct purchase choice benefits us more, and that gets passed along in donations.

Here&#39;s how I did it, from start to finish[1](#logical-order). And by the way: every dollar I make from this will be donated to benefit trans rights. Happy Trans Day of Visibility!

## The content

The first step is to get the content, or at least a table of contents. Since this is a collection of my blog posts, most of the work is done. I only really had to make the choice of what to include.

Books are typically a certain length, and that&#39;s about how much I&#39;m producing per year right now. That made the choice pretty easy: 2023 would be its own volume, and 2022 and prior years would also be one volume, since they&#39;re the same total word count.

I just copied those posts into a new directory, since they&#39;re all in Markdown already.

## Making the book draft

With the content in one place, I had to convert them into a format I could get printed. I had chosen [IngramSpark](https:&#x2F;&#x2F;www.ingramspark.com&#x2F;) for printing and distribution, so this meant I needed a PDF of the content.

I looked at a few different tools for this part and settled on [Quarto](https:&#x2F;&#x2F;quarto.org&#x2F;). Ultimately, I can&#39;t remember my exact reasons, but the other tools either wouldn&#39;t run for me, didn&#39;t like taking in a pile of separate files, or had formatting I didn&#39;t like without options to change it. It&#39;s a solid choice, and I&#39;ll use it for future volumes. For the other book I&#39;m working on with a friend[2](#other-book), we&#39;ll probably evaluate different tools since we&#39;re not bringing existing content to it.

To get it set up, I updated the config file to point to all my content. Pointing to the content was straightforward, but I wound up with a lot of other customizations I&#39;ll talk through one-by-one. The finished file looks roughly like this:

&#x60;&#x60;&#x60;yaml
project:
  type: book

book:
  title: &quot;Technically a Blog Volume 0&quot;
  author: &quot;Nicole Tietz-Sokolskaya&quot;
  chapters:
    - index.qmd
    - 2022-07-09-running-software-book-reading-group.qmd
    - 2022-09-11-going-to-recurse-center.qmd
    - 2022-09-24-rc-week-1-recap.qmd
    - ...

toc: true
toc-title: &quot;Table of contents&quot;
toc-depth: 1

format:
  html:
    theme: cosmo
  titlepage-pdf:
    titlepage: formal
    titlepage-theme:
      elements: [&quot;\\titleblock&quot;, &quot;\\authorblock&quot;, &quot;\\vfill&quot;, &quot;\\footerblock&quot;]
    titlepage-include-file:
      - includes&#x2F;copyright.tex
      - includes&#x2F;dedication.tex
    coverpage: none
    coverpage-title: &quot;&quot;
    coverpage-bg-image: &quot;img&#x2F;cover.jpg&quot;
    links-as-notes: true
    include-in-header:
      text: |
        \usepackage{fvextra}
        \DefineVerbatimEnvironment{Highlighting}{Verbatim}{breaklines,commandchars&#x3D;\\\{\}}
        \raggedbottom
        \usepackage{emptypage}
    documentclass: scrbook
    fontsize: &quot;9pt&quot;
    mainfont: &quot;DejaVu Sans&quot;
    from: markdown+emoji
    geometry:
      - paperwidth&#x3D;5.5in
      - paperheight&#x3D;8.5in
      - top&#x3D;0.75in
      - bottom&#x3D;0.75in
      - left&#x3D;0.5in
      - right&#x3D;0.5in

&#x60;&#x60;&#x60;

The &#x60;project&#x60; section says what type of project it is, because it&#39;ll use different options and produce a different artifact for books than for other things. Then the &#x60;book&#x60; section is where we put in some metadata like the title and author, and we list all the chapters, each getting its own Markdown file. I did have to adjust some of the markdown, because the heading levels that I use in my blog posts were usually like &#x60;# Heading&#x60; which would become a separate chapter, so all my headings had to go in by one level to be things like &#x60;## Heading&#x60;. This was tedious to adjust in every single file!

The following group of statements is describing the table of contents and gives some light configuration. I limited depth to 1, which means only chapter titles, but it&#39;s neat that you can easily adjust it to have the subheadings in the table of contents also.

The &#x60;format&#x60; section is where I spent the most time and pain. Normally you have a &#x60;pdf&#x60; block in it, but I have &#x60;titlepage-pdf&#x60;, because I used the [titlepage extension](https:&#x2F;&#x2F;nmfs-opensci.github.io&#x2F;quarto%5Ftitlepages&#x2F;) which let me do a titlepage somewhat easily. The theme I picked (&#x60;formal&#x60;) was fairly minimal, but I still had to do some customization. In retrospect, I probably could have achieved everything I wanted _without_ the extension by using the [includes](https:&#x2F;&#x2F;quarto.org&#x2F;docs&#x2F;output-formats&#x2F;pdf-basics.html#latex-includes) that Quarto offers for PDFs.

The two main includes I had here were the copyright page and the dedication page. These are frontmatter, and go before the table of contents. They&#39;re also typically not numbered! Then I added a bit of extra LaTeX in the header, like &#x60;\raggedbottom&#x60; to not perform vertical justification[3](#justified) and &#x60;\usepackage{emptypages}&#x60; to remove headers and page numbers from empty pages.

Which reminds me: page numbers.

Before this project, I didn&#39;t give much thought to where page numbers were or where chapters start in books. It turns out there&#39;s a standard! You start chapters on the right-hand page (traditionally, and for English-language), which is also where you start numbering. But you don&#39;t number the pages of the frontmatter, and the table of contents is numbered in Roman numerals. Those page numbers are typically located on an outer corner of the page. The first proof copy I received had all of this off-by-one so page numbers were on the inside corners, making them all but useless. That was fixed by inserting a blank page, but did cost me a couple of weeks to get the second proof copy!

Emoji also turned out to be a problem, and oh do I ever use them in my writing. I tried to find a font that supported all the emoji I have used, which is how I wound up using DejaVu Sans. But that didn&#39;t work out, as many were still missing in the first proof copy which I&#39;d just not seen. I fixed it by removing them or replacing them with simple character representations, because changing the font at this point would likely also change the page count, which would change the cover template, and... it wasn&#39;t worth the hassle.

So, that&#39;s everything I did for the content PDF. If I knew what I know now it would be pretty fast, but it was a very slow process to figure this out for the first time.

## Commissioning cover art

Another thing I wanted was nice cover art, if I could afford it. I hadn&#39;t worked with an illustrator before, so I didn&#39;t know what rates to expect. Fortunately, a fellow Recurser, [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;), gave me a recommendation for an illustrator she&#39;s worked with before, and he had time to work with a new client!

He was very easy to work with. We established the basic scope of the project in a few emails and talked about a price and timeline. Then he put together a few concept sketches to get feedback. I provided feedback, and we landed on a design that both of us were really happy with! He was super flexible and was great to work with. At the end of the project, he even suggested a duplex cover if it&#39;s within budget—it costs marginally more to print, but looks really nice having an abstract pattern on the inside.

Ultimately we finished within the timeline we talked about, and the budget didn&#39;t change. The book itself was done later than I&#39;d intended, but that slip was entirely on my side from making a few late decisions (in the next section) which pushed it back.

All told, for a modest fee, I got really nice cover art that is also designed as a template I can reuse for future volumes. I can&#39;t wait to work with him again on another project!

## Bureaucracy and tedium

Publishing something does come with some bureaucracy. Self-published books sometimes come with an ISBN[4](#isbn) provided by the printer, whether that&#39;s IngramSpark or Amazon. When you see the publisher listed as Amazon, that&#39;s why.

Instead of using ISBNs provided for free by the printer, I chose to buy my own ISBNs and be my own imprint. This gives the most flexibility. If you use the printer&#39;s ISBN, then it can only be used with them, and each other platform that distributes it may have a different ISBN, so things like reviews can get split apart. ISBNs cannot be reassigned, so once you decide how you do it you&#39;re locked in. If you have your own ISBN, it can be consistent across all the platforms. And it looks that tad bit more professional to have your own imprint.

Which brings me to that. An imprint is the trade name a publisher uses to publish works. One publishing company can have many imprints. I heard some good reasoning to form an LLC to protect myself, so we ended up forming [May 11 Publishing LLC](https:&#x2F;&#x2F;may11publishing.com&#x2F;), &quot;we&quot; being my wife and I. A Pennsylvania LLC has minimal fees and reporting requirements, so it&#39;s not expensive to maintain like Delaware LLCs can be. This set back the project a while to get it set up but it was worth it. We also had to get a business bank account, and ended up using [Novo](https:&#x2F;&#x2F;www.novo.co&#x2F;) because it was really easy to set up entirely online without phone calls.

The ISBNs are officially owned by our publishing company, not by us personally. This also opens the door for us publishing other works with multiple authors or publishing for other people, if anyone were interested in that. I think we&#39;re a pretty dang good writing&#x2F;editing team, and we have another project we&#39;re exploring with a collaborator.

## Printing and distribution

One of the big reasons I picked IngramSpark for printing is because they also handle distribution, so most booksellers will pick up the book automatically, fulfilled by print-on-demand when someone orders it. And they have a _ton_ of options for printing of good quality, so you can get exactly what you want.

I had to pick a size fairly early on so the illustrator could make the cover the right size, so I chose 5.5&quot; by 8.5&quot;, a fairly standard size. The other details: it&#39;s a [perfect bound paperback](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Bookbinding#Thermally%5Factivated%5Fbinding) with matte finish and black-and-white creme pages. It was pretty fun picking out the page sizes.

After you create the book in IngramSpark, it will give you a template you can download for the cover. This is a PDF (other formats are also available I think) and you put the cover art into it by following the instructions[5](#or-illustrator). Then you can upload your content file and the cover file. They do some light validation of it, then it becomes available for you to order proof copies!

I ordered an expedited one so I could get the iterated files uploaded quickly. You have a 60 day window to upload revised proofs, and after that there&#39;s a fee for new revisions. It&#39;s small, but more than I&#39;m charging for this, so I&#39;d like to avoid that extra cost if possible. The second proof copy I didn&#39;t expedite, since I was much more confident it would be the final one. It was!

When it arrived, [my in-house editor](https:&#x2F;&#x2F;sokolskayatranslations.com&#x2F;) and I did a spot check of it, and everything looked good, so I enabled distribution. This meant that it entered IngramSpark&#39;s database of published books and booksellers started to pick it up! It took under a day to be on Amazon from a third-party seller, and about a day or two for Amazon and B&amp;N to officially list it. It&#39;s pretty surreal to me to have _my book_ listed for sale on Amazon!

As an aside: if you _do_ buy it on Amazon, click through to the &quot;Other New&quot; options and buy the one that&#39;s sold by and ships from Amazon.com directly, not from whoever the main listing is. There are third parties that list a bunch of print-on-demand books and say they&#39;re in stock while Amazon is honest and says it&#39;s out of stock. If you order one, they&#39;ll order a copy to send to you; but that&#39;s true for the other seller, too! And it&#39;s cheaper from Amazon directly.

Or, buy it straight [from us](https:&#x2F;&#x2F;may11publishing.com&#x2F;) to give us a bigger cut which we will donate all of. Which brings us to the money.

## The money side

Here&#39;s everything that we spent money on for this project and how much it cost:

* **Cover art:** $200, and it&#39;s reusable across future editions with small modifications, so future ones will be cheaper
* **ISBNs:** $295 for 10\. I used one here, so that&#39;s $29.50 for this project, and the rest are usable for future ones. If you buy just one ISBN, it&#39;s $125, so it&#39;s cheaper to buy in bulk if you need at least three in the long run. They don&#39;t expire.
* **Proof copies:** the first copy was $17.45 because I had it expedited, and the second was $9.35.
* **PA LLC formation:** $125, and we&#39;ll have to file an annual report each year starting in 2025 for a whopping $7 each.

Those were all the costs for the project, so it totalled $521.80\. If you look at amortized costs, though, it&#39;s more like $121.30 (assuming the LLC and cover art are good for five editions, and that all ISBNs are otherwise used; not perfect math). You could get as low as just the cost of proof copies if you&#39;re okay with not owning the ISBNs and you do your own artwork!

Now how do I get money from this? By selling it, of course. You set the price with IngramSpark and then there are two different ways people can buy it with vastly different compensation.

* If they buy it directly from IngramSpark (you can set up an ecommerce page) for $20 plus shipping (about $24 total). If they buy it this way, there&#39;s a $3.50 surcharge for the printing and the print itself costs $5.33, so I get $11.17.
* If they buy it from Amazon or another bookseller for $20 (shipping included or not, up to the seller), there&#39;s a 40% wholesale discount on it (the lowest I could set) and I get $6.77.

Yep, I get about twice as much from a sale if you buy it from IngramSpark directly. And that was with setting a higher price and the lowest wholesale discount allowed in order to maximize that.

Let me just say again, _any_ profits that come from this are getting donated to help advocate for trans rights. We&#39;re not paying back our fees from this: the $521.80 is part of our contribution. So if you buy a copy from our site, that means you **get a book, I get warm fuzzy feelings, and your money helps protect trans rights**.

So here&#39;s how to get it:

* from [our publisher site](https:&#x2F;&#x2F;may11publishing.com&#x2F;) for either $20 (normal, print on demand) or $30 (signed, donates more to trans rights).
* from [Amazon](https:&#x2F;&#x2F;www.amazon.com&#x2F;dp&#x2F;B0CZB86NP1&#x2F;) or [B&amp;N](https:&#x2F;&#x2F;www.barnesandnoble.com&#x2F;w&#x2F;technically-a-blog-volume-0-nicole-tietz-sokolskaya&#x2F;1145198445?ean&#x3D;9798989929900) for $20 (donates less to trans rights)

If you buy the book and want a PDF copy to enjoy on an ereader, email me a selfie with the book and I&#39;ll send the PDF to you.

## Doing it again

I would, and will, do this again! I&#39;m going to put together the 2023 volume in the summer or fall, after a breather. Then I plan to do it every year or so, since I&#39;m writing more than ever on the blog right now.

I&#39;m going to do a few things differently this time around. Notably, I don&#39;t have all the startup costs, and I&#39;m pretty confident the first proof copy will be the only proof copy. Other than that, I&#39;m going to just get rid of any characters that don&#39;t render and call it a day.

---

Thanks for reading to the end! I hope you have a lovely day.

---

1

This is presented as discrete steps, but in reality almost all of these were interleaved. There is a lot you can and should do in parallel! Presenting it in chronological order would be very disjointed, though.

[↩](#logical-order%5Fref)

2

We&#39;re working on a system design interview book!

[↩](#other-book%5Fref)

3

I strongly dislike justified text, personal opinion. It makes reading harder for me, for only a small gain in aesthetics.

[↩](#justified%5Fref)

4

International Standard Book Numbers are the numbers on barcodes on the back of books, and they&#39;re what identify books. Each format of a book has a different one (ebook, paperback, hardcover).

[↩](#isbn%5Fref)

5

Or your illustrator takes care of that for you, knowing more about the process than you do, if you&#39;re me.

[↩](#or-illustrator%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6) 