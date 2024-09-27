---
id: e5119c73-5f39-4bc1-b5e0-8146a0c6d274
title: A keyof puzzle
tags:
  - RSS
date_published: 2024-08-30 10:04:55
---

# A keyof puzzle
#Omnivore

[Read on Omnivore](https://omnivore.app/me/a-keyof-puzzle-191a497c2b6)
[Read Original](https://effectivetypescript.com/2024/08/30/keyof-puzzle/)



_Effective TypeScript_ is nearly 400 pages long, but I&#39;ve received the most feedback by far on just one passage. It comes in [Item 7: Think of Types as Sets of Values](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;effective-typescript&#x2F;blob&#x2F;main&#x2F;samples&#x2F;ch-types&#x2F;types-as-sets.md):

&gt; &#x60;&#x60;&#x60;gcode
&gt; keyof (A&amp;B) &#x3D; (keyof A) | (keyof B)
&gt; keyof (A|B) &#x3D; (keyof A) &amp; (keyof B)
&gt; 
&gt; &#x60;&#x60;&#x60;
&gt; 
&gt; If you can build an intuition for why these equations hold, you&#39;ll have come a long way toward understanding TypeScript&#39;s type system!

I&#39;ll explain these equations in a moment. But before I do, head over to the [TypeScript Playground](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;play&#x2F;?#code&#x2F;JYOwLgpgTgZghgYwgAgHJwLYQCYAUD2oYyA3gFDLIiYQBcyAzmFKAOYDcFyAHvSAK4YARtE6UAnn0EionAL5ki0eEmQEiAZgAipLryrTRXSQeFHKALylnZZBWQT4QTKjWwANAJoAtZAF5dSmosegByVAgAd2RPfCgAa1CAGj16AFoAdg0UiXoAFgAGHOQrZCK7TkdnYhBxBFR6dCw8QnB-V2avb3ZkAHpe5Hx4gEIHJxdahG96dXBtduCcLp7+wZGyMjBxAAcUAGlUdpI5ZAAyZHiIcXwYNDdZsE5VygA9AH5Nnf2NI5Pzy+utwe2ieA1eH0+u2QewAku0ATdkAAKJo4B5nNStMDaACUoMoyHekP2AFV2kiEbdUS0iDjkAAfZGUzGaLQ4sjPQkfIA) and test them out with a few types. See if you can build that intuition for why they hold.

I first saw these equations in Anders Hejlsberg&#39;s [keynote at TSConf 2018](https:&#x2F;&#x2F;youtu.be&#x2F;wpgKd-rwnMw?si&#x3D;szTbEWSFGCF8xp2x&amp;t&#x3D;1576) (&quot;Higher order type equivalences&quot; at 26m15s):

Anders&#39; explanation at the talk was helpful, but I still had to stare at them for a long time before they clicked. But when they did, I felt like I&#39;d had a real insight about how TypeScript types work.

The feedback on these equations in the book is typically that I need to explain them more. Some readers have even claimed they&#39;re wrong. (They&#39;re not!) By presenting them a bit cryptically, I wanted to give readers a chance to think through them and have an insight of their own.

With that out of the way, let&#39;s dig into why these equations hold, and why they&#39;re interesting.

We can start by plugging in concrete types for &#x60;A&#x60; and &#x60;B&#x60;:

&#x60;&#x60;&#x60;css
interface NamedPoint {
  name: string;
  x: number;
  y: number;
}
interface Point3D {
  x: number;
  y: number;
  z: number;
}

&#x60;&#x60;&#x60;

What&#39;s &#x60;NamedPoint &amp; Point3D&#x60;, the intersection of these two types? It&#39;s easy to think that it&#39;s an &#x60;interface&#x60; with just the common fields:

&#x60;&#x60;&#x60;typescript
&#x2F;&#x2F; This is _not_ the same as NamedPoint &amp; Point3D!
interface CommonFields {
  x: number;
  y: number;
}

&#x60;&#x60;&#x60;

That&#39;s not what it is, though. To understand the intersection of these types, we need to think a little more about what values are assignable to each type. A &#x60;NamedPoint&#x60; is an object with three properties, &#x60;name&#x60;, &#x60;x&#x60;, and &#x60;y&#x60;, with the expected types:

&#x60;&#x60;&#x60;yaml
const nyc: NamedPoint &#x3D; {
  name: &#39;New York&#39;,
  x: -73,
  y: 40,
};

&#x60;&#x60;&#x60;

But a &#x60;NamedPoint&#x60; could have other properties, too. In particular it could have a &#x60;z&#x60; property:

&#x60;&#x60;&#x60;yaml
const namedXYZ &#x3D; {
  name: &#39;New York&#39;,
  x: -73,
  y: 40,
  z: 0,
};
const nycN: NamedPoint &#x3D; namedXYZ; &#x2F;&#x2F; ok!

&#x60;&#x60;&#x60;

(We have to go through an intermediate object to avoid [excess property checking](https:&#x2F;&#x2F;observablehq.com&#x2F;@koop&#x2F;excess-property-checking-in-typescript) errors here. If you have a copy of [_Effective TypeScript_](https:&#x2F;&#x2F;amzn.to&#x2F;3UjPrsK), check out [Item 11: Distinguish Excess Property Checking from Type Checking](https:&#x2F;&#x2F;github.com&#x2F;danvk&#x2F;effective-typescript&#x2F;blob&#x2F;main&#x2F;samples&#x2F;ch-types&#x2F;excess-property-checking.md).)

There&#39;s nothing special about &#x60;z&#x60;. It could have other properties, too, and still be assignable to &#x60;NamedPoint&#x60;. For this reason, we sometimes say that TypeScript types are &quot;open.&quot;

Of course, &#x60;Point3D&#x60; is open, too. It could also have other fields, including a &#x60;name&#x60; field:

&#x60;&#x60;&#x60;actionscript
const nycZ: Point3D &#x3D; namedXYZ; &#x2F;&#x2F; ok!

&#x60;&#x60;&#x60;

So &#x60;namedXYZ&#x60; is assignable to both &#x60;NamedPoint&#x60; and &#x60;Point3D&#x60;. And that is the very definition of an intersection. Sure enough, &#x60;namedXYZ&#x60; is assignable to the intersection of these types, too:

&#x60;&#x60;&#x60;1c
const nycZ: Point3D &amp; NamedPoint &#x3D; namedXYZ; &#x2F;&#x2F; ok!

&#x60;&#x60;&#x60;

This gives us a hint about what the intersection looks like:

&#x60;&#x60;&#x60;css
interface NamedPoint3D {
  name: string;
  x: number;
  y: number;
  z: number;
}

&#x60;&#x60;&#x60;

This type is _also_ &quot;open:&quot; a &#x60;NamedPoint3D&#x60; might have more than these four fields. But it has to have at least these four.

To _intersect_ these two types, we _unioned_ their properties. We can see this in code using &#x60;keyof&#x60;:

&#x60;&#x60;&#x60;ada
type KN &#x3D; {} &amp; keyof NamedPoint;
&#x2F;&#x2F;   ^? type KN &#x3D; &quot;name&quot; | &quot;x&quot; | &quot;y&quot;
type K3 &#x3D; {} &amp; keyof Point3D;
&#x2F;&#x2F;   ^? type K3 &#x3D; &quot;x&quot; | &quot;y&quot; | &quot;z&quot;
type KI &#x3D; keyof (NamedPoint &amp; Point3D);
&#x2F;&#x2F;   ^? type KI &#x3D; &quot;name&quot; | &quot;x&quot; | &quot;y&quot; | &quot;z&quot;
type KU &#x3D; (keyof NamedPoint) | (keyof Point3D)
&#x2F;&#x2F;   ^? type KU &#x3D; &quot;name&quot; | &quot;x&quot; | &quot;y&quot; | &quot;z&quot;

&#x60;&#x60;&#x60;

So &#x60;keyof (A&amp;B) &#x3D; (keyof A) | (keyof B)&#x60;!

(The weird &#x60;{} &amp;&#x60; forces TypeScript to print out the results of &#x60;keyof&#x60;. I [wish](https:&#x2F;&#x2F;www.effectivetypescript.com&#x2F;2022&#x2F;02&#x2F;25&#x2F;gentips-4-display&#x2F;#Exclude-lt-keyof-T-never-gt) this weren&#39;t necessary.)

What about the other relationship, &#x60;keyof (A|B)&#x60;? &#x60;keyof T&#x60; will only include a property if TypeScript can be sure that it will be present on values assignable to &#x60;T&#x60; (with a caveat, see below).

Again, let&#39;s make this more concrete with some examples:

&#x60;&#x60;&#x60;yaml
const nyc: NamedPoint &#x3D; {
  name: &#39;New York&#39;,
  x: -73,
  y: 40,
};
const pythagoras: Point3D &#x3D; {
  x: 3,
  y: 4,
  z: 5,
};

&#x60;&#x60;&#x60;

To be assignable to &#x60;A|B&#x60;, a value must be assignable to either &#x60;A&#x60; or &#x60;B&#x60; (or both!). So these values are both assignable to &#x60;NamedPoint | Point3D&#x60;:

&#x60;&#x60;&#x60;actionscript
const u1: NamedPoint | Point3D &#x3D; nyc; &#x2F;&#x2F; ok
const u2: NamedPoint | Point3D &#x3D; pythagoras; &#x2F;&#x2F; ok

&#x60;&#x60;&#x60;

Thinking about &#x60;keyof&#x60;, which properties belong to both those objects? It&#39;s just &#x60;&quot;x&quot;&#x60; and &#x60;&quot;y&quot;&#x60;. And that&#39;s &#x60;keyof&#x60; for the union type:

&#x60;&#x60;&#x60;elm
type KU &#x3D; keyof (NamedPoint | Point3D)
&#x2F;&#x2F;   ^? type KU &#x3D; &quot;x&quot; | &quot;y&quot;
type IK &#x3D; (keyof NamedPoint) &amp; (keyof Point3D)
&#x2F;&#x2F;   ^? type IK &#x3D; &quot;x&quot; | &quot;y&quot;

&#x60;&#x60;&#x60;

So &#x60;keyof (A|B) &#x3D; (keyof A) &amp; (keyof B)&#x60; and the equation holds.

Hopefully working through these examples with some concrete types makes the equations clearer. I really like them because they&#39;re concise but still manage to say a lot about how types work in TypeScript.

I mentioned one caveat, and it has to do with optional fields:

&#x60;&#x60;&#x60;ada
interface PartialPoint {
  x: number;
  y?: number;
}
type KP &#x3D; {} &amp; keyof PartialPoint;
&#x2F;&#x2F;   ^? type KP &#x3D; &quot;x&quot; | &quot;y&quot;
const justX: PartialPoint &#x3D; { x: 10 };

&#x60;&#x60;&#x60;

&#x60;justX&#x60; is assignable to &#x60;PartialPoint&#x60;, but it doesn&#39;t have a &#x60;y&#x60; property, which you&#39;d expect given the &#x60;keyof&#x60;.

Optional fields are a little strange when you think about types in a set-theoretic way. On the one hand, it&#39;s surprising that &#x60;keyof PartialPoint&#x60; includes &#x60;&quot;y&quot;&#x60; because values needn&#39;t have that property. On the other hand, it would be incredibly annoying if it didn&#39;t because &#x60;keyof&#x60; is so often used with [mapped types](https:&#x2F;&#x2F;www.typescriptlang.org&#x2F;docs&#x2F;handbook&#x2F;2&#x2F;mapped-types.html), and you&#39;d really like to map over all the fields, not just the required ones.

At the end of the day, what&#39;s the difference between these two types?

&#x60;&#x60;&#x60;routeros
interface JustX {
  x: number;
}
interface XMaybeY {
  x: number;
  y?: unknown;
}

&#x60;&#x60;&#x60;

I&#39;ll cryptically say &quot;not much!&quot; and leave it at that!

[ ![Effective TypeScript Book Cover](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sm9xE88tj5xjDBByuPXdlK1ylp7ox_Z5Dra4yK783VRc&#x2F;https:&#x2F;&#x2F;effectivetypescript.com&#x2F;images&#x2F;cover-2e.jpg) ](https:&#x2F;&#x2F;amzn.to&#x2F;3HIrQN6)

**_Effective TypeScript_** shows you not just _how_ to use TypeScript but how to use it _well_. Now in its second edition, the book&#39;s 83 items help you build mental models of how TypeScript and its ecosystem work, make you aware of pitfalls and traps to avoid, and guide you toward using TypeScript’s many capabilities in the most effective ways possible. Regardless of your level of TypeScript experience, you can learn something from this book.

After reading _Effective TypeScript_, your relationship with the type system will be the most productive it&#39;s ever been! [Learn more »](https:&#x2F;&#x2F;effectivetypescript.com&#x2F;)