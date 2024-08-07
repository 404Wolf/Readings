---
id: 0ed9a10e-0d12-47c4-9e40-bd5ad4001740
title: 404wolf.com
tags:
  - RSS
---

# 404wolf.com
#Omnivore

[Read on Omnivore](https://omnivore.app/me/-1912a8b233a)
[Read Original](https://404wolf.com/posts/blog/hackyCssStuff)



##  Predetermined Text Widths 

## Predetermined Title Background Widths

### The issue

On the main page of [404wolf.com](https:&#x2F;&#x2F;404wolf.com&#x2F;) I have it set up so that various elements&#39; text &#39;types&#39; into their respective boxes. It&#39;s a neat animation that I achieve using the &#x60;typewriter-effect&#x60; package [that can be found here](https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;typewriter-effect). It works great out of the box, but since I have unique title styles that I wanted to keep consistent, I ran into a problem.

For titles on my website that are type-written after loading, I wanted the backgrounds to already exist, and then for the typewriter to type into them. Without any special configuration, the boxes load without a background, and as the typewriter types the boxes expand (since they use fitting width).

To solve this issue, I originally tried to compute the width by using a basic &#x60;document.createElement&#x60; method that I wrote (with some GPT help--I didn&#39;t know about &#x60;.offsetWidth&#x60; before this!).

&#x60;&#x60;&#x60;reasonml
function getDummyAreaWidth(styles: string, classes: string, type: string, text: string) {
    const dummyArea &#x3D; document.createElement(type);
    dummyArea.textContent &#x3D; text;
    dummyArea.setAttribute(&quot;style&quot;, styles);
    dummyArea.className &#x3D; classes;
    document.body.appendChild(dummyArea);
    const width &#x3D; dummyArea.offsetWidth;
    document.body.removeChild(dummyArea);
    return width;
}; 

&#x60;&#x60;&#x60;

Basically, we create an element, set the styles and classes that would cause the width to change, and then yoink it&#39;s width. The idea is that I&#39;d then use this function for the title components to give them fixed predetermined widths. However, since &#x60;typewriter-effect&#x60; uses some wrapper classes and I&#39;m using &#x60;tailwind&#x60;, it wasn&#39;t computing the widths properly. I might have been able to troubleshoot and fix it, but instead I opted for a simpler solution.

## The solution

Instead of using a computed width value, I figured out that it&#39;d be easier to just have the width be computed as if the text were actually there from the start. I realized that if the text were loaded initially without a typewriter, that the width would (expectedly) be correct. So, what I decided to do was make it so that the text did preload into the box, but the text itself was transparent. This would cause the box to fill properly as if there were complex-ly styled variable-width text in it, but appear to be empty while the typewriter were to type into the box. I then made the typewriter text absolute, so that it could type on top of the invisible text that was already in the box.

The actual code for my homepage&#39;s main header was super simple to update with this idea, and worked right away!

&#x60;&#x60;&#x60;xquery
import Typewriter from &quot;typewriter-effect&quot;;

const Greeter &#x3D; () &#x3D;&gt; {
    return (
        &lt;div className&#x3D;&quot;relative&quot;&gt; 
            &lt;span className&#x3D;&quot;text-transparent&quot;&gt; {&quot;Hi! I&#39;m Wolf Mermelstein&quot;} &lt;&#x2F;span&gt;
            &lt;span className&#x3D;&quot;absolute left-0&quot; style&#x3D;{{ whiteSpace: &quot;nowrap&quot; }}&gt;
                &lt;Typewriter
                    onInit&#x3D;{(typewriter) &#x3D;&gt; {
                        typewriter
                            .typeString(&quot;Hi! &quot;)
                            .pauseFor(700)
                            .typeString(&quot;I&#39;m Wolf Mermelstein&quot;)
                            .start();
                    }}
                    options&#x3D;{{ delay: 70, cursor: &quot;&quot;, autoStart: true }}
                &#x2F;&gt;
            &lt;&#x2F;span&gt;
        &lt;&#x2F;div&gt;
    );
};

export default Greeter;

&#x60;&#x60;&#x60;