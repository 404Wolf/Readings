---
id: a1f853bf-0bb9-4225-9111-1fc1a26b9c0a
---

# Create PDFs with Tailwind - DEV Community
#Omnivore

[Read on Omnivore](https://omnivore.app/me/create-pd-fs-with-tailwind-dev-community-18e6f201c27)
[Read Original](https://dev.to/onedoc/create-pdfs-with-tailwind-k0)


As a developer, creating PDFs seems like a simple task. We build frontends with modern toolkit in just hours, how could static documents be any harder?

PDF was invented in 1993 by Adobe as a cross-platform document format. The format itself focuses on being portable rather than interactive - an orthogonal approach to HTML and CSS. While the latter defines a box model, the former has an imperative approach. In a nutshell, an HTML rectangle is a set of 4 lines in PDF.

This approach is the strength of PDF and the reason it is so widely used: it always looks the same. HTML on the other hand relies on many factors from screen size to browser version. What if we could bring the layout capacities of HTML to PDF?

## [ ](#create-your-first-pdf-with-react-and-tailwind) Create your first PDF with React and Tailwind

The open-source library [react-print-pdf](https:&#x2F;&#x2F;github.com&#x2F;OnedocLabs&#x2F;react-print-pdf) brings a set of components and wrappers we can use to build beautiful PDFs in minutes.

### [ ](#compile-to-html) Compile to HTML

The challenge with Tailwind is that it is a dynamic CSS framework. It relies on a JavaScript runtime to generate the final CSS. This is a problem for PDF generation, as we require a static file. We will first convert to static HTML, then to PDF.

For this, we will use the &#x60;&lt;Tailwind&gt;&#x60; component from &#x60;react-print-pdf&#x60;. This component will detect all the Tailwind classes and generate the final CSS. We can then use the &#x60;compile&#x60; function to convert the React tree to HTML.  

&#x60;&#x60;&#x60;javascript
import { Tailwind, Footnote, compile } from &quot;@onedoc&#x2F;react-print&quot;;

const getHTML &#x3D; async () &#x3D;&gt; {
  return compile(
    &lt;Tailwind&gt;
      &lt;h1 className&#x3D;&quot;text-4xl font-bold&quot;&gt;
        Invoice #123
        &lt;Footnote&gt;
          &lt;p className&#x3D;&quot;text-sm&quot;&gt;This is a demo invoice&lt;&#x2F;p&gt;
        &lt;&#x2F;Footnote&gt;
      &lt;&#x2F;h1&gt;
    &lt;&#x2F;Tailwind&gt;
  );
};

&#x60;&#x60;&#x60;

When calling &#x60;getHTML&#x60;, we will get the following HTML:  

&#x60;&#x60;&#x60;xml
&lt;!doctype html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;style&gt;
      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }
      .font-bold {
        font-weight: 700;
      }
      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
    &lt;&#x2F;style&gt;
  &lt;&#x2F;head&gt;
  &lt;body&gt;
    &lt;h1 class&#x3D;&quot;text-4xl font-bold&quot;&gt;
      Invoice #123
      &lt;div class&#x3D;&quot;footnote&quot;&gt;
        &lt;p class&#x3D;&quot;text-sm&quot;&gt;This is a demo invoice&lt;&#x2F;p&gt;
      &lt;&#x2F;div&gt;
    &lt;&#x2F;h1&gt;
  &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;

&#x60;&#x60;&#x60;

### [ ](#converting-the-html-to-pdf) Converting the HTML to PDF

There are several ways to convert this HTML to a PDF:

* Use Onedoc as a client-side or server-side API, that will support all features such as headers, footers, and page numbers.
* If on the client side, you can use [react-to\-print](https:&#x2F;&#x2F;github.com&#x2F;MatthewHerbst&#x2F;react-to-print) to use the browser&#39;s print dialog. This is cheap option but will not support advanced features and may introduce a lot of visual bugs.
* Use a server-side headless browser such as [puppeteer](https:&#x2F;&#x2F;pptr.dev&#x2F;api&#x2F;puppeteer.page.pdf) to convert the HTML to PDF. This is the most reliable free option, but requires a server. If you need to use it in production, we recommend you use [Gotenberg](https:&#x2F;&#x2F;github.com&#x2F;gotenberg&#x2F;gotenberg).

Here is an example on how to convert the HTML to PDF using Onedoc:  

&#x60;&#x60;&#x60;javascript
import { Onedoc } from &quot;@onedoc&#x2F;client&quot;;
import { getHTML } from &quot;.&#x2F;getHTML&quot;;
import fs from &quot;fs&quot;;

const onedoc &#x3D; new Onedoc(process.env.ONEDOC_API_KEY);

const { file, error } &#x3D; await onedoc.render({
  html: await getHTML(),
});

if (error) {
  throw new Error(error);
}

fs.writeFileSync(&quot;invoice.pdf&quot;, new Buffer(file));

&#x60;&#x60;&#x60;

That&#39;s it! You now have a beautiful PDF invoice generated from your React app. You can use most of Tailwind features as well as the components from &#x60;react-print-pdf&#x60; to create advanced layouts. [Check out the documentation](https:&#x2F;&#x2F;react.onedoclabs.com&#x2F;introduction) for more information.

## [ ](#under-the-hood-dynamic-styles) Under the hood: dynamic styles

If you have made it this far, you may be wondering how the dynamic styles are converted to static CSS. Tailwind brings a specific set of challenges as it is a utility-first framework. Let&#39;s have a look at the usual Tailwind generation process:

1. Tailwind parses the files specified in your &#x60;tailwind.config.js&#x60; and generates a set of classes.
2. It then uses a PostCSS plugin to replace the classes in your CSS with the actual styles.
3. It then uses a JavaScript runtime to generate the final CSS, deduplicating and minifying it.

This works fine as a build tool, but bringing just-in-time compilation to PDF generation is a challenge. On serverless and browser environments, there is no file system and we need to detect dynamic classes in the React tree.

The approach that the Tailwind component uses is similar to the one in [react-email](https:&#x2F;&#x2F;react.email&#x2F;docs&#x2F;components&#x2F;tailwind). The Tailwind React component parses its children tags and detects the classes. It then uses a browserified version of Tailwind to generate the final CSS. This is then injected in the HTML. Not as easy as it sounds!

This blog post was originally posted on the [Onedoc blog](https:&#x2F;&#x2F;www.onedoclabs.com&#x2F;blog&#x2F;react-tailwind-dynamic-pdf).

## Read next

[ ![ruben_alapont profile image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;100x100,sNZ3rofdgvF3ucId6s5ZyoJl3hleczdg6XjugnTOjzl4&#x2F;https:&#x2F;&#x2F;media.dev.to&#x2F;cdn-cgi&#x2F;image&#x2F;width&#x3D;100,height&#x3D;100,fit&#x3D;cover,gravity&#x3D;auto,format&#x3D;auto&#x2F;https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F795344%2F7a960f9f-dbc8-4de7-929b-95a52ec6d026.jpeg) Stream Your Way: Creating Custom Streams  Rubén Alapont - ](https:&#x2F;&#x2F;dev.to&#x2F;ruben%5Falapont&#x2F;stream-your-way-creating-custom-streams-395o) [ ![ethernmyth profile image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;100x100,s-2n09NShzZinXagHbdVicqcA4GMWnFiYHEEe72pSMgw&#x2F;https:&#x2F;&#x2F;media.dev.to&#x2F;cdn-cgi&#x2F;image&#x2F;width&#x3D;100,height&#x3D;100,fit&#x3D;cover,gravity&#x3D;auto,format&#x3D;auto&#x2F;https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F1281642%2F999c3d03-1398-4080-bcc1-1ae2f2dd8104.png) Local Storage  Ethern Myth - ](https:&#x2F;&#x2F;dev.to&#x2F;ethernmyth&#x2F;local-storage-4j48) [ ![brojenuel profile image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;100x100,sVQlJMAiwXvHZ7LQZ1nAtJPGkEGq-LpKPouXcT0B0mCs&#x2F;https:&#x2F;&#x2F;media.dev.to&#x2F;cdn-cgi&#x2F;image&#x2F;width&#x3D;100,height&#x3D;100,fit&#x3D;cover,gravity&#x3D;auto,format&#x3D;auto&#x2F;https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F298966%2F3f588ac8-7d4a-4030-aebf-398d71273f62.png) JavaScript Libraries That You Should Know  Jenuel Oras Ganawed - ](https:&#x2F;&#x2F;dev.to&#x2F;brojenuel&#x2F;javascript-libraries-that-you-should-know-4lol) [ ![ktrblog profile image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;100x100,s9sDX_KU99sTPXDe-b3C7kosLfveTcltejnyzVculU2g&#x2F;https:&#x2F;&#x2F;media.dev.to&#x2F;cdn-cgi&#x2F;image&#x2F;width&#x3D;100,height&#x3D;100,fit&#x3D;cover,gravity&#x3D;auto,format&#x3D;auto&#x2F;https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fuser%2Fprofile_image%2F1071691%2Fce6726d1-9394-457f-b235-ca1d8cb0ef94.png) \[html js css\] Vanilla JS slider with responsivity, swipe, arrows, dots  ktr92 - ](https:&#x2F;&#x2F;dev.to&#x2F;ktrblog&#x2F;html-js-css-vanilla-js-responsive-slider-5coo) 