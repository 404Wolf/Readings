---
id: 128c5095-565c-47a0-af41-9c59a65c6d87
title: ryleealanza.org
tags:
  - RSS
date_published: 2024-05-21 11:00:36
---

# ryleealanza.org
#Omnivore

[Read on Omnivore](https://omnivore.app/me/-18f9bfddb88)
[Read Original](https://ryleealanza.org/posts/hither/)



“Forth” is the name of a stack-based programming language. I’ve been curious about what goes into writing a programming language for a while now, and after a little prompting from a friend, I decided to give writing one a try. The purpose of this post is to talk a little about what the language I wrote, which I’m calling “hither”, is like. In a future post I’d like to talk about some interesting things I learned along the way.

## The name

I chose the name “hither” because just like one can “go forth”, one can “come hither”. Naming things is fun, I definitely encourage people to engage their whimsy a little when they do.

## A little demo

You can find the code for &#x60;hither&#x60; on [GitHub](https:&#x2F;&#x2F;github.com&#x2F;ryleelyman&#x2F;hither). To run it yourself, you’ll need a copy of [Zig](https:&#x2F;&#x2F;ziglang.org&#x2F;) version 0.12\. I believe that in its current state, as of today (May 21, 2024)&#x60;hither&#x60; will also run on the development version of Zig 0.13, but I make no promises.

Anyway, now that you’re all squared away, you can build and run &#x60;hither&#x60; from the repository root by executing &#x60;zig build run&#x60;.

(By the way, if you’re reading this and want to give &#x60;hither&#x60; a try but the above isn’t sufficient instructions for you to fill in the blanks, shoot me an email! I’d be tickled pink to walk you through it.)

Anyway, the Zig compiler will do its thing for a bit and then hit you with

so now you’re looking at the &#x60;hither&#x60; REPL! you can type some stuff and hit enter, and the REPL will think about it and tell you what it computed. for example:

(By the way, apologies if you’re a command line super Amadeus, in which case the REPL interaction might feel a bit constrained, since familiar keyboard interaction patterns from interacting with your shell simply won’t work and will dump strange escape codes instead. I might find the motivation to clean this up, but I also might not.)

Anyway, from this we can learn a few things. First of all, like [Forth](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;FORTH), hither uses what is sometimes called “reverse Polish notation”, a funky way of operating I first learned by playing with my dad’s fancy calculator in the 90s. Basically rather than “infix” notation, which we’re used to for addition like &#x60;2 + 2&#x60;, we put the _arguments_ to the operation _before_ the operand. This has the advantage of making parsing essentially trivial: by the time our parser hits the &#x60;+&#x60;, everything is all set up for it to just perform the addition. Programming languages that operate in this way, by sort of building up longer and longer streams of operations, are sometimes called [concatenative](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Concatenative%5Fprogramming%5Flanguage).

So &#x60;2 2 +&#x60; operates like this: hither has a little “stack”, a “first in, first out” data structure common to many programming languages. the &#x60;hither&#x60; interpreter takes in a line of text, parses it into little chunks I’ll call “words”, and then pushes each word onto the stack. Here we have three words, &#x60;2&#x60;, &#x60;2&#x60; and &#x60;+&#x60;. When &#x60;2&#x60; is pushed onto the stack, nothing happens—it’s just the number 2\. But when &#x60;+&#x60; is pushed, it pops two words from the stack, checks that they’re numbers, and then pushes their sum onto the stack. Since that’s the end of the line, the &#x60;hither&#x60; interpreter checks that there isn’t anything hanging out waiting to be finished on the stack (secretly it does this by checking the state of a _return_ stack that it also manages). If everything looks good, the interpreter prints out the contents of the stack, so &#x60;4&#x60; in this case, and then writes &#x60;ok&#x60; to tell you that the previous operation completed successfully.

### Strings and variables

From a user’s perspective, &#x60;hither&#x60; supports four basic data types:_integers_ which we’ve seen, floating point _numbers,_ like &#x60;1.5&#x60;,_strings_ which you enter surrounded by quotation marks as in &#x60;&quot;this is a string&quot;&#x60;, and _words_ which are whitespace-delimited symbols which don’t parse as strings, integers or numbers:&#x60;+&#x60; is a word, but so is something like &#x60;this_is_4-word&#x60;. There are several words predefined for you. At the time of this writing, they are:&#x60;+&#x60;, &#x60;-&#x60;, &#x60;*&#x60;, &#x60;&#x2F;&#x60;, &#x60;%&#x60;, &#x60;&gt;&#x60;, &#x60;&gt;&#x3D;&#x60;, &#x60;&lt;&#x60;, &#x60;&lt;&#x3D;&#x60;, &#x60;&#x3D;&#x3D;&#x60;, &#x60;dupe&#x60;, &#x60;swap&#x60;, &#x60;height&#x60;, &#x60;top&#x60;, &#x60;drop&#x60;,&#x60;and&#x60;, &#x60;or&#x60;, &#x60;not&#x60;, &#x60;print&#x60;, &#x60;++&#x60;, &#x60;:&#x3D;&#x60;, &#x60;@&#x60;, &#x60;while&#x60;, &#x60;_&#x60;, &#x60;&#39;&#x60;, &#x60;{&#x60;, &#x60;}&#x60;, &#x60;if&#x60;, &#x60;else&#x60;, &#x60;then&#x60;,&#x60;exit&#x60;, &#x60;dump&#x60;, &#x60;inspect&#x60; and &#x60;abort&#x60;. I’ll explain some of them, but leave the rest to you to play around with—or to ask me directly! To define a new word, you can use &#x60;:&#x3D;&#x60; in combination with either a string or the &#x60;&#39;&#x60; operator, as in

&#x60;&#x60;&#x60;tap
&gt; 1 &#39; x :&#x3D;
ok
&gt; x
1
ok
&gt; 2 &quot;x&quot; :&#x3D;
ok
&gt; x
2
ok
&#x60;&#x60;&#x60;

These are completely identical. Unfortunately, directly writing &#x60;1 x :&#x3D;&#x60; won’t work: the reason is that the interpreter doesn’t _know_ that the &#x60;:&#x3D;&#x60; operator is coming, so it attempts to interpret &#x60;x&#x60; as a word. If &#x60;x&#x60; has been defined already, this succeeds, but puts the _value_ of &#x60;x&#x60; onto the stack, which doesn’t make sense to assign with &#x60;:&#x3D;&#x60;. If &#x60;x&#x60; hasn’t been defined, then we get an error. That’s why we need to use the &#x60;&#39;&#x60; operator—it effectively tells the interpreter to push the next token onto the stack _without_calling it or even attempting to resolve whether it’s been defined.

### Lambdas

To define a word that actually executes some code, we can use the &#x60;{&#x60; and &#x60;}&#x60; pair. These start and end a _lambda,_ programmer jargon for an “anonymous function”. You should think of the curly braces as sort putting what ever comes between them “in quotes”. Just as doing that in English is different from saying those words directly, so too in &#x60;hither&#x60; does this “quotation” put a different spin on things. Rather than executing directly, the &#x60;hither&#x60; interpreter collects everything inside and packages it up:

&#x60;&#x60;&#x60;yaml
&gt; { 1 2 + }
slice: address: 0xfff80, length: 3, type: definition
ok
&#x60;&#x60;&#x60;

(On your machine, the actual address you see printed might differ, but the length and type should be the same.) What this is telling us is that there _is_ something on the stack, but that thing is a _definition,_ rather than anything else we’ve seen previously. There are effectively two things you can do with definitions: call them now or assign them to words to call later. To call a definition now, you use &#x60;@&#x60;:

To assign a definition to a word, you use the same syntax we did for variables:

&#x60;&#x60;&#x60;tap
&gt; { 1 2 + } &#39; three :&#x3D;
ok
&gt; three
3
ok
&#x60;&#x60;&#x60;

## FizzBuzz in &#x60;hither&#x60;

Here’s what is apparently an old chestnut in programming interviews:

&gt; Print out the numbers from 1 to 100, except when the number is divisible by 3, print “Fizz” instead. When the number is divisible by 5, print “Buzz” instead of the number. When the number is divisible by both 3 and 5, print “FizzBuzz” instead.

There are likely many ways to solve this in &#x60;hither&#x60;even with such a limited palette of options, but here’s the one I came up with. I’ll explain how it works after the code.

&#x60;&#x60;&#x60;tap
&gt; { dupe 3 % 0 &#x3D;&#x3D; if &quot;Fizz&quot; swap then } &#39; fizz :&#x3D;
ok
&gt; { dupe 5 % 0 &#x3D;&#x3D; if &quot;Buzz&quot; swap then } &#39; buzz :&#x3D;
ok
&gt; { height 3 &#x3D;&#x3D; if 2 top ++ else 1 top then print } &#39; output :&#x3D;
ok
&gt; 0 &#39; x :&#x3D;
ok
&gt; { x fizz buzz output } { x 100 &lt; dupe if x 1 + &#39; x :&#x3D; then } while
1
2
Fizz
4
Buzz
...
FizzBuzz
91
92
Fizz
94
Buzz
Fizz
97
98
Fizz
Buzz
ok
&#x60;&#x60;&#x60;

So there are three main definitions, two of which are nearly identical.&#x60;fizz&#x60; first duplicates the value on top of the stack with &#x60;dupe&#x60;, then checks whether it is divisible by 3 with &#x60;3 % 0 &#x3D;&#x3D;&#x60;, and then &#x60;if &quot;Fizz&quot; swap then&#x60; checks whether the value on the stack is “truthy” (in &#x60;hither&#x60; all values except 0 are “truthy”) and if so pushes the string &#x60;Fizz&#x60; onto the stack and swaps the top two values of the stack.

So for example &#x60;9 fizz&#x60; operates as follows, with &#x60;--&#x60; separating the stack from the program:

1. &#x60;-- 9 fizz&#x60;
2. &#x60;9 -- dupe 3 % 0 &#x3D;&#x3D; if &quot;Fizz&quot; swap then&#x60;
3. &#x60;9 9 -- 3 % 0 &#x3D;&#x3D; if &quot;Fizz&quot; swap then&#x60;
4. &#x60;9 9 3 -- % 0 &#x3D;&#x3D; if &quot;Fizz&quot; swap then&#x60;
5. &#x60;9 0 -- 0 &#x3D;&#x3D; if &quot;Fizz&quot; swap then&#x60;
6. &#x60;9 0 0 -- &#x3D;&#x3D; if &quot;Fizz&quot; swap then&#x60;
7. &#x60;9 1 -- if &quot;Fizz&quot; swap then&#x60;
8. &#x60;9 -- &quot;Fizz&quot; swap&#x60;
9. &#x60;9 &quot;Fizz&quot; -- swap&#x60;
10. &#x60;&quot;Fizz&quot; 9 --&#x60;

&#x60;output&#x60; introduces a couple new words:&#x60;height&#x60; pushes the current height of the stack onto the stack. So from an empty stack, we have &#x60;-- height&#x60; becomes &#x60;0 --&#x60;. If the height is equal to three, e.g. when executing &#x60;15 fizz buzz&#x60;, the stack ends up as &#x60;&quot;Fizz&quot; &quot;Buzz&quot; 15&#x60;, the statement &#x60;2 top&#x60; sets the height of the stack to 2, effectively dropping &#x60;15&#x60;, and then &#x60;++&#x60; joins the two strings on top of the stack. If the height is not three, as in &#x60;9 fizz buzz&#x60; yielding &#x60;&quot;Fizz&quot; 9&#x60; or &#x60;1 fizz buzz&#x60; yielding &#x60;1&#x60;, we set the height to 1\. In either case we print out the result (which has the side effect of clearing the stack).

Next we give ourselves a variable &#x60;x&#x60;. Finally, we have the &#x60;while&#x60; statement. This executes a loop in &#x60;hither&#x60;. It&#39;s like this &#x60;&lt;func&gt; &lt;cond&gt; while&#x60;it takes in two values off of the stack, &#x60;&lt;func&gt;&#x60; and &#x60;&lt;cond&gt;&#x60;. These need not be lambdas, but in practice probably ought to be. First &#x60;while&#x60; pushes &#x60;cond&#x60; onto the stack (this will _call_ it if it&#39;s a lambda), then checks whether the value at the top of the stack is truthy. If so, it pushes &#x60;func&#x60; onto the stack, and then repeats.

The first lambda is pretty straightforward. The second one is a little sneaky: first it checks whether &#x60;x&#x60; is less than &#x60;100&#x60;, and then _if so,_ adds one to &#x60;x&#x60;. Since this is executed _before_ our &#x60;&lt;func&gt;&#x60; lambda, that&#39;s why you see the numbers from 1 to 100, even though &#x60;x&#x60; starts at &#x60;0&#x60;.