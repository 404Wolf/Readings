---
id: c1ec85c2-6a62-4a79-9ce7-1715610c9e5d
title: The Messy Pile
tags:
  - RSS
date_published: 2024-08-01 00:00:00
---

# The Messy Pile
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-messy-pile-1910f8f3bf5)
[Read Original](https://unplannedobsolescence.com/blog/messy-pile-css/)



## [Unplanned Obsolescence](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;)

* [Blog](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;blog)
* [About](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;about)
* [RSS](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;atom.xml)

---

A couple months ago I was sitting next to [Ivy Wong](https:&#x2F;&#x2F;ivywong.dev&#x2F;) and I saw them working on a dropdown menu so cute that I immediately asked how they did it.

It looked something like this:

* Home
* New
* Pages
* Logout

I call this the Messy Pile, and I think it&#39;s brilliant. It has lots of personality without breaking the basic utility and structure of a menu list. Internally, it feels haphazard; externally, it takes up a very normal box shape on the page, which easily fits in both desktop and mobile views.

* Home
* New
* Pages
* Logout

Let&#39;s make it together. We&#39;ll start with just a regular list of items:

&#x60;&#x60;&#x60;xml
&lt;ul class&#x3D;messy-pile&gt;
  &lt;li&gt;Home
  &lt;li&gt;New
  &lt;li&gt;Pages
  &lt;li&gt;Logout
&lt;&#x2F;ul&gt;

&#x60;&#x60;&#x60;

* Home
* New
* Pages
* Logout

And then add some CSS to make them orderly boxes:

&#x60;&#x60;&#x60;xml
&lt;style&gt;
.messy-pile {
  list-style-type: none;
  margin: 0 auto;
  padding: 0;
  width: fit-content;
}

.messy-pile li {
  background-color: bisque;
  border: 2px black solid;
  margin: 5px 0;
  text-align: center;
  width: 200px;
}
&lt;&#x2F;style&gt;

&#x60;&#x60;&#x60;

* Home
* New
* Pages
* Logout

And finally, we rotate the boxes, one degree clockwise for the odd-numbered items, and counterclockwise for the even-numbered ones:

&#x60;&#x60;&#x60;css
.messy-pile li:nth-child(odd) {
  transform: rotate(1deg);
}

.messy-pile li:nth-child(even) {
  transform: rotate(-1deg);
}

&#x60;&#x60;&#x60;

And you get these cute tilted boxes!

* Home
* New
* Pages
* Logout

## [Better CSS Leads to Better HTML](#better-css-leads-to-better-html)

Ivy&#39;s dense yet simple implementation of this pattern highlights something that took me a long time to learn: it&#39;s only possible to write good HTML if you write good CSS.

If you showed someone this design and asked them to implement it, it&#39;s easy to imagine an implementation that looks like this:

&#x60;&#x60;&#x60;xml
&lt;div class&#x3D;messy-pile-container&gt;
  &lt;div class&#x3D;&quot;messy-pile-item left&quot;&gt;Home&lt;&#x2F;div&gt;
  &lt;div class&#x3D;&quot;messy-pile-item right&quot;&gt;New&lt;&#x2F;div&gt;
  &lt;div class&#x3D;&quot;messy-pile-item left&quot;&gt;Pages&lt;&#x2F;div&gt;
  &lt;div class&#x3D;&quot;messy-pile-item right&quot;&gt;Logout&lt;&#x2F;div&gt;
&lt;&#x2F;div&gt;

&lt;!-- the common styling is omitted for brevity --&gt;
&lt;style&gt;
.messy-pile-item.left { transform: rotate(1deg); }
.messy-pile-item.right { transform: rotate(-1deg); }
&lt;&#x2F;style&gt;

&#x60;&#x60;&#x60;

I could definitely have written that depending on when in my career you asked me to do it. So what&#39;s better about this one?

&#x60;&#x60;&#x60;xml
&lt;ul class&#x3D;messy-pile&gt;
  &lt;li&gt;Home
  &lt;li&gt;New
  &lt;li&gt;Pages
  &lt;li&gt;Logout
&lt;&#x2F;ul&gt;

&lt;!-- the common styling is omitted for brevity --&gt;
&lt;style&gt;
.messy-pile li:nth-child(odd) { transform: rotate(1deg); }
.messy-pile li:nth-child(even) { transform: rotate(-1deg); }
&lt;&#x2F;style&gt;

&#x60;&#x60;&#x60;

An obvious reason is that using the CSS [:nth-child()](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;CSS&#x2F;:nth-child) pseudo-class (along with its &#x60;odd&#x60; and &#x60;even&#x60; keyword values) ensures that the pattern will automatically apply to an arbitrary number of items, as opposed to manually switching between &#x60;left&#x60; and &#x60;right&#x60; classes.

Add new items, or move existing ones, and they&#39;ll all stay perfectly arranged, without touching the CSS.

* Home
* New
* Friends
* Pages
* Explore
* Logout

A subtler reason is that writing better CSS lets us move redundant information out of the HTML, dramatically simplifying it. In doing so, we take advantage of both CSS features and HTML semantics.

&#x60;&#x60;&#x60;xml
&lt;ul class&#x3D;messy-pile&gt;
  &lt;li&gt;Home
  &lt;li&gt;New
  &lt;li&gt;Pages
  &lt;li&gt;Logout
&lt;&#x2F;ul&gt;

&#x60;&#x60;&#x60;

This is the only HTML in our example. You&#39;ll notice that it&#39;s just a regular [unordered list](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;HTML&#x2F;Element&#x2F;ul). Its purpose is immediately clear and it&#39;s not visually dense in the slightest. The only concession we&#39;ve made to the styling is a single class, &#x60;messy-pile&#x60;.

The list semantics give us a natural way to style this component, Lists [pretty much](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;HTML&#x2F;Element&#x2F;ul#technical%5Fsummary) only have &#x60;&lt;li&gt;&#x60; children, so we can style the list itself with &#x60;.messy-pile&#x60; and the items with &#x60;.messy-pile li&#x60;. There&#39;s very little we have to add to the HTML to make this work.

HTML semantics are often discussed in the context of making it easier for user agents (browsers, accessibility tech, etc.) to understand what your web page is trying to accomplish—but they also make it easier for _you_ (and future readers of your code) to understand what your web page is trying to accomplish.

Here&#39;s the other sample implementation from before; it does the same thing but with most of the HTML semantics removed.

&#x60;&#x60;&#x60;applescript
&lt;div class&#x3D;messy-pile-container&gt;
  &lt;div class&#x3D;messy-pile-item&gt;Home&lt;&#x2F;div&gt;
  &lt;div class&#x3D;messy-pile-item&gt;New&lt;&#x2F;div&gt;
  &lt;div class&#x3D;messy-pile-item&gt;Pages&lt;&#x2F;div&gt;
  &lt;div class&#x3D;messy-pile-item&gt;Logout&lt;&#x2F;div&gt;
&lt;&#x2F;div&gt;

&#x60;&#x60;&#x60;

This is much worse. We have to add classes to both the container and the list item, since &#x60;&lt;div&gt;&#x60; is a generic element that could contain lots of things, including other &#x60;&lt;div&gt;&#x60;s. The additional visual weight takes more time to read, feels bad to look at, and has none of the same accessibility properties.

This example is trivial—the version with the divs is still very intelligible—but as you start to layer on additional concepts, it gets out of hand quickly. For instance, the items in this example are mean to be a menu bar, so they all have to be links. With a list, that&#39;s still pretty easy to read:

&#x60;&#x60;&#x60;xml
&lt;!-- With a list --&gt;
&lt;ul class&#x3D;messy-pile&gt;
  &lt;li&gt; &lt;a href&#x3D;&#x2F;home&gt;Home&lt;&#x2F;a&gt;
  &lt;li&gt; &lt;a href&#x3D;&#x2F;new&gt;New&lt;&#x2F;a&gt;
  &lt;li&gt; &lt;a href&#x3D;&#x2F;pages&gt;Pages&lt;&#x2F;a&gt;
  &lt;li&gt; &lt;a href&#x3D;&#x2F;logout&gt;Logout&lt;&#x2F;a&gt;
&lt;&#x2F;ul&gt;

&#x60;&#x60;&#x60;

Definitely busier, but still easy to follow. How does it look with divs?

&#x60;&#x60;&#x60;xml
&lt;!-- With divs --&gt;
&lt;div class&#x3D;messy-pile-container&gt;
  &lt;div class&#x3D;messy-pile-item&gt;
    &lt;a href&#x3D;&#x2F;home&gt;Home&lt;&#x2F;a&gt;
  &lt;&#x2F;div&gt;
  &lt;div class&#x3D;messy-pile-item&gt;
    &lt;a href&#x3D;&#x2F;new&gt;New&lt;&#x2F;a&gt;
  &lt;&#x2F;div&gt;
  &lt;div class&#x3D;messy-pile-item&gt;
    &lt;a href&#x3D;&#x2F;new&gt;Pages&lt;&#x2F;a&gt;
  &lt;&#x2F;div&gt;
  &lt;div class&#x3D;messy-pile-item&gt;
    &lt;a href&#x3D;&#x2F;logout&gt;Logout&lt;&#x2F;a&gt;
  &lt;&#x2F;div&gt;
&lt;&#x2F;div&gt;

&#x60;&#x60;&#x60;

Oh. It&#39;s starting to become XML (derogatory).

I&#39;m being a little cheeky here by [omitting the closing tags](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;HTML&#x2F;Element&#x2F;li#technical%5Fsummary) for &#x60;&lt;li&gt;&#x60; elements to keep the &#x60;&lt;a&gt;&#x60; tags on the same line, while not doing the same for the &#x60;&lt;div&gt;&#x60;s. But that&#39;s also my point!&#x60;&lt;li&gt;&#x60; tags can be closed automatically, &#x60;&lt;div&gt;&#x60; tags can&#39;t. Knowing HTML semantics lets you express your ideas more concisely, which in turn gives you more room to layer on new ideas before you start to feel the pressure to refactor.

Meanwhile, the div version looks and feels like a compile target—which is exactly why lots of people treat it as one. When your HTML is lots of divs and classes, then higher level abstractions like [React Components](https:&#x2F;&#x2F;react.dev&#x2F;learn&#x2F;your-first-component) are necessary to make the code you&#39;re writing intelligible again. Many people start from the assumptions that these abstractions are necessary because they&#39;ve only ever seen code that&#39;s painful to write without them.

## [But Does It Scale?](#but-does-it-scale)

The reason we adopt additional abstractions on top of HTML semantics is because eventually the thing we&#39;re trying to describe gets more complicated. It happens even with the most beautifully-written HTML. Reality—or at least the little piece of the reality that we&#39;re trying to make easier with software—is complicated.

So if you&#39;re reading this and thinking, &quot;sure, but what I&#39;m doing could never be done with plain HTML and CSS,&quot; I humbly suggest that you give it a try. You won&#39;t know what HTML and CSS can and can&#39;t accomplish until you actually try to push their limits for your use-case, forcing yourself to find those native features. I, personally, have found that they go a lot farther than I previously thought.

Complex page layouts are going to require compromises—the trick is to use the tools available to you to push those compromises as far out as possible. The better you know your tools, the farther you can get before you have to fashion new ones, and the simpler the abstractions you develop are going to be.

_This blog is about an interaction that Ivy and I had at the [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;044d120abf1c334d0b2a3132634eb025). If you love programming and are interested in expanding your horizons, you should check it out._

## [Notes](#notes)

* If the unclosed &#x60;&lt;li&gt;&#x60; tags bother you, check out Aaron Parks&#39; [Write HTML Right](http:&#x2F;&#x2F;lofi.limo&#x2F;blog&#x2F;write-html-right).You may or may not want to write all your HTML that way, but it will hopefully break you out of the idea that HTML should look like XML. Markdown doesn&#39;t make you close bullets, why should HTML?
* [BEM](https:&#x2F;&#x2F;getbem.com&#x2F;) is one popular methodology (among many) for scaling up CSS. If your project and org chart are operating at a scale that BEM helps with, by all means use it, but I am personally of the opinion that strict conventions tend to age poorly as the language naturally develops internal mechanisms to deal with the problems that the conventions were originally built to solve—that&#39;s basically the argument of this whole blog.
* Also, &#x60;&lt;button class&#x3D;&quot;button&quot;&gt;&#x60; makes me want to die. That simply can&#39;t be the best way to write CSS.
* Speaking of scaling: keep in mind that scaling developers is not a business requirement; scaling your ability to improve the website is. If you make it easier for a couple developers to manage all the frontend tasks, you don&#39;t need to be siloing them so much. This is true both &quot;vertically&quot; ([frontend vs backend](https:&#x2F;&#x2F;htmx.org&#x2F;essays&#x2F;a-real-world-react-to-htmx-port&#x2F;#dev-team-makeup)), and horizontally (different teams working on different parts of the same page).
* On the other end of the spectrum is the [CSS Zen Garden](https:&#x2F;&#x2F;csszengarden.com&#x2F;), which demonstrates how the same HTML can be used to create dramatically different-looking layouts, just by swapping out the stylesheet. You certainly _don&#39;t_ need your website to be ready for arbitrary stylesheets—and I&#39;m not skilled enough with CSS to pull that off anyway—but you should shoot for a website with sufficiently sane HTML structure that it would easy enough to follow if it had _no_ styling.
* I used a modified Messy Pile for the &#x60;&lt;aside&gt;&#x60;s in [my last blog post](https:&#x2F;&#x2F;unplannedobsolescence.com&#x2F;blog&#x2F;hard-page-load&#x2F;) You have to be on desktop with a wide enough window to see it applied.