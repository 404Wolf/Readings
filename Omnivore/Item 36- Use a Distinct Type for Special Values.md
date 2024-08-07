---
id: 3ccd32bd-fa64-4b26-b978-ec7affa7ad00
title: "Item 36: Use a Distinct Type for Special Values"
tags:
  - RSS
date_published: 2024-06-13 14:02:54
---

# Item 36: Use a Distinct Type for Special Values
#Omnivore

[Read on Omnivore](https://omnivore.app/me/item-36-use-a-distinct-type-for-special-values-190133d4e43)
[Read Original](https://effectivetypescript.com/2024/06/13/special-values/)



_This is a sample item from Chapter 4 of the second edition of [Effective TypeScript](https:&#x2F;&#x2F;amzn.to&#x2F;3UjPrsK), which was [released](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;2024&#x2F;05&#x2F;21&#x2F;second-edition&#x2F;) in May of 2024\. It discusses a common mistake in TypeScript code: using &#x60;&quot;&quot;&#x60;, &#x60;0&#x60;, or &#x60;-1&#x60; to represent special cases like missing data. By modeling these cases with a distinct type, you help TypeScript guide you towards writing more correct code. If you like what you read, consider [buying a copy](https:&#x2F;&#x2F;amzn.to&#x2F;3UjPrsK) of the book!_

JavaScript&#39;s [string split method](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;JavaScript&#x2F;Reference&#x2F;Global%5FObjects&#x2F;String&#x2F;split) is a handy way to break a string around a delimiter:

&gt; **&#39;abcde&#39;.split(&#39;c&#39;)**
[ &#39;ab&#39;, &#39;de&#39; ] 

Let&#39;s write something like &#x60;split&#x60;, but for arrays. Here&#39;s an attempt:

&#x60;&#x60;&#x60;excel
function splitAround&lt;T&gt;(vals: readonly T[], val: T): [T[], T[]] {
  const index &#x3D; vals.indexOf(val);
  return [vals.slice(0, index), vals.slice(index+1)];
}

&#x60;&#x60;&#x60;

This works as you&#39;d expect:

&gt; **splitAround([1, 2, 3, 4, 5], 3)**
[ [ 1, 2 ], [ 4, 5 ] ]

If you try to &#x60;splitAround&#x60; an element that&#39;s not in the list, however, it does something quite unexpected:

&gt; **splitAround([1, 2, 3, 4, 5], 6)**
[ [ 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5 ] ]

While it&#39;s not entirely clear what the function _should_ do in this case, it&#39;s definitely not that! How did such simple code result in such strange behavior?

The root issue is that &#x60;indexOf&#x60; returns &#x60;-1&#x60; if it can&#39;t find the element in the array. This is a special value: it indicates a failure rather than success. But &#x60;-1&#x60; is just an ordinary &#x60;number&#x60;. You can pass it to the Array &#x60;slice&#x60; method and you can do arithmetic on it. When you pass a negative number to &#x60;slice&#x60;, it interprets it as counting back from the end of the array. And when you add &#x60;1&#x60; to &#x60;-1&#x60;, you get &#x60;0&#x60;. So this evaluates as:

&#x60;&#x60;&#x60;scheme
[vals.slice(0, -1), vals.slice(0)]

&#x60;&#x60;&#x60;

The first &#x60;slice&#x60; returns all but the last element of the array, and the second &#x60;slice&#x60; returns a complete copy of the array.

This behavior is a bug. Moreover, it&#39;s unfortunate that TypeScript wasn&#39;t able to help us find this problem. The root issue was that &#x60;indexOf&#x60; returned &#x60;-1&#x60; when it couldn&#39;t find the element, rather than, say &#x60;null&#x60;. Why is that?

Without hopping in a time machine and visiting the Netscape offices in 1995, it&#39;s hard to know the answer for sure. But we can speculate! JavaScript was heavily influenced by Java, and [its indexOf has this same behavior](https:&#x2F;&#x2F;docs.oracle.com&#x2F;javase&#x2F;8&#x2F;docs&#x2F;api&#x2F;java&#x2F;lang&#x2F;String.html#indexOf-int-). In Java (and C), a function can&#39;t return a primitive _or_ null. Only objects (or pointers) are nullable. So this behavior may derive from a technical limitation in Java that JavaScript does not share.

In JavaScript (and TypeScript), there&#39;s no problem having a function return a &#x60;number&#x60; or &#x60;null&#x60;. So we can wrap &#x60;indexOf&#x60;:

&#x60;&#x60;&#x60;fortran
function safeIndexOf&lt;T&gt;(vals: readonly T[], val: T): number | null {
  const index &#x3D; vals.indexOf(val);
  return index &#x3D;&#x3D;&#x3D; -1 ? null : index;
}

&#x60;&#x60;&#x60;

If we plug that into our original definition of &#x60;splitAround&#x60;, we immediately get two type errors:

&#x60;&#x60;&#x60;pgsql
function splitAround&lt;T&gt;(vals: readonly T[], val: T): [T[], T[]] {
  const index &#x3D; safeIndexOf(vals, val);
  return [vals.slice(0, index), vals.slice(index+1)];
  &#x2F;&#x2F;                    ~~~~~              ~~~~~ &#39;index&#39; is possibly &#39;null&#39;
}

&#x60;&#x60;&#x60;

This is exactly what we want! There are always two cases to consider with &#x60;indexOf&#x60;. With the built-in version, TypeScript can&#39;t distinguish them, but with the wrapped version, it can. And it sees here that we&#39;ve only considered the case where the array contained the value.

The solution is to handle the other case explicitly:

&#x60;&#x60;&#x60;lua
function splitAround&lt;T&gt;(vals: readonly T[], val: T): [T[], T[]] {
  const index &#x3D; safeIndexOf(vals, val);
  if (index &#x3D;&#x3D;&#x3D; null) {
    return [[...vals], []];
  }
  return [vals.slice(0, index), vals.slice(index+1)];  &#x2F;&#x2F; ok
}

&#x60;&#x60;&#x60;

Whether this is the right behavior is debatable, but at least TypeScript has forced us to have that debate!

The root problem with the first implementation was that &#x60;indexOf&#x60; had two distinct cases, but the return value in the special case (&#x60;-1&#x60;) had the same type as the return value in the regular case (&#x60;number&#x60;). This meant that from TypeScript&#39;s perspective there was just a single case, and it wasn&#39;t able to detect that we didn&#39;t check for &#x60;-1&#x60;.

This situation comes up frequently when you&#39;re designing types. Perhaps you have a type for describing merchandise:

&#x60;&#x60;&#x60;css
interface Product {
  title: string;
  priceDollars: number;
}

&#x60;&#x60;&#x60;

Then you realize that some products have an unknown price. Making this field optional or changing it to &#x60;number|null&#x60; might require a migration and lots of code changes, so instead you introduce a special value:

&#x60;&#x60;&#x60;css
interface Product {
  title: string;
  &#x2F;** Price of the product in dollars, or -1 if price is unknown *&#x2F;
  priceDollars: number;
}

&#x60;&#x60;&#x60;

You ship it to production. A week later your boss is irate and wants to know why you&#39;ve been crediting money to customer cards. Your team works to roll back the change and you&#39;re tasked with writing the postmortem. In retrospect, it would have been much easier to deal with those type errors!

Choosing in-domain special values like &#x60;-1&#x60;, &#x60;0&#x60;, or &#x60;&quot;&quot;&#x60; is similar in spirit to turning off &#x60;strictNullChecks&#x60;. When &#x60;strictNullChecks&#x60; is off, you can assign &#x60;null&#x60; or &#x60;undefined&#x60; to any type:

&#x60;&#x60;&#x60;yaml
&#x2F;&#x2F; @strictNullChecks: false
const truck: Product &#x3D; {
  title: &#39;Tesla Cybertruck&#39;,
  priceDollars: null,  &#x2F;&#x2F; ok
};

&#x60;&#x60;&#x60;

This lets a huge class of bugs slip through the type checker because TypeScript doesn&#39;t distinguish between &#x60;number&#x60; and &#x60;number|null&#x60;. &#x60;null&#x60; is a valid value in all types. When you enable &#x60;strictNullChecks&#x60;, TypeScript _does_ distinguish between these types and it&#39;s able to detect a whole host of new problems. When you choose an in-domain special value like &#x60;-1&#x60;, you&#39;re effectively carving out a non-strict niche in your types. Expedient, yes, but ultimately not the best choice.

&#x60;null&#x60; and &#x60;undefined&#x60; may not always be the right way to represent special cases since their exact meaning may be context dependent. If you&#39;re modeling the state of a network request, for example, it would be a bad idea to use &#x60;null&#x60; to mean an error state and &#x60;undefined&#x60; to mean a pending state. Better to use a tagged union to represent these special states more explicitly.

### [](#Things-to-Remember &quot;Things to Remember&quot;)Things to Remember

* Avoid special values that are assignable to regular values in a type. They will reduce TypeScript&#39;s ability to find bugs in your code.
* Prefer &#x60;null&#x60; or &#x60;undefined&#x60; as a special value instead of &#x60;0&#x60;, &#x60;-1&#x60;, or &#x60;&quot;&quot;&#x60;.
* Consider using a tagged union rather than &#x60;null&#x60; or &#x60;undefined&#x60; if the meaning of those values isn&#39;t clear.

[ ![Effective TypeScript Book Cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sm9xE88tj5xjDBByuPXdlK1ylp7ox_Z5Dra4yK783VRc&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;cover-2e.jpg) ](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6)

**_Effective TypeScript_** shows you not just _how_ to use TypeScript but how to use it _well_. Now in its second edition, the book&#39;s 83 items help you build mental models of how TypeScript and its ecosystem work, make you aware of pitfalls and traps to avoid, and guide you toward using TypeScript’s many capabilities in the most effective ways possible. Regardless of your level of TypeScript experience, you can learn something from this book.

After reading _Effective TypeScript_, your relationship with the type system will be the most productive it&#39;s ever been! [Learn more »](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;)