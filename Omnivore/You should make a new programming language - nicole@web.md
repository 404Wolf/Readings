---
id: fccf9a59-4708-49de-afaa-b1524637e152
title: You should make a new programming language | nicole@web
tags:
  - RSS
date_published: 2024-08-12 00:00:00
---

# You should make a new programming language | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/you-should-make-a-new-programming-language-nicole-web-191467e880b)
[Read Original](https://ntietz.com/blog/you-should-make-a-new-terrible-programming-language/)



Every software engineer uses a programming language, usually multiple. Few of us _make_ programming languages. This makes sense, because the work we need to get done can typically be done just fine in the languages that exist. Those already have people making them better. Let&#39;s focus on the task at hand.

But that means that we&#39;re missing out on some learning opportunities. I stumbled into those when I [made a language](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;introducing-hurl&#x2F;) based on a silly premise: control flow via exceptions and _nothing else_. It was done as a joke, but I accidentally learned things along the way.

Every serious woodworker makes some of their own equipment. Some will make their workbench, maybe sawhorses, perhaps jigs for myriad tools and work setups. These are things a woodworker can make from wood. But we don&#39;t often have access to the machines we&#39;d need for making _all_ the tools we use: You&#39;d need a metalworking shop to make portions of chisels and planes, let alone any power tools we use.

As programmers, we&#39;re in a different position. We have near total control over the machine, and we have the capability, in theory, to build everything from scratch[1](#firmware-sad). Since the tools we use are all software-based, and we write software, we can create all of our own tools, from the operating system on up.

This is a privilege which few fields enjoy. The closest other one I can think of is that machinists can likely produce a lot of their own tools, too. Where we assume that CPUs and RAM exist, they can assume that motors and control boards exist. Then they can build those into the rest of the tool. And so, like machinists, we&#39;re able to get incredibly close to our tools.

## What you learn by making a language

One of the tools we interact with the most is the programming language. We use one to get any programming work done, and they shape how we think through problems as well. You use a programming language as a tool of thought even when you&#39;re away from the keyboard. This makes it ripe for learning. You will learn a _lot_ if you make a new programming language.

**You&#39;ll learn about grammars and language design.**Before you can implement a programming language, you&#39;ll have to decide what you even want it to _be_. Is this an imperative language, or functional, or something else? Is it object oriented? Does it have traditional syntax borrowed from another language, or are you doing something new and weird? These, and many others, are the questions you&#39;ll grapple with in designing a language.

In the process, you&#39;ll learn about _why_ other languages are designed the way they are. If you&#39;re lucky, you&#39;ll learn some of this in the initial design process. For example, while working on my next language, Lilac, I learned why [semicolons are so common](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;researching-why-we-use-semicolons-as-statement-terminators&#x2F;) because I tried picking something else. Discussing it with a friend uncovered a _lot_ of potential drawbacks in other choices! If you&#39;re less lucky, you&#39;ll learn those lessons in the implementation phase, and those lessons will really stick.

**You&#39;ll learn about parsing.**This is one of the first things you&#39;ll run into when you start to implement your language. You can&#39;t do a whole lot else without parsing the language. To start writing the parser, you&#39;ll have to pick what kind of parser to write. Don&#39;t overthink it when you&#39;re just starting out. Although, if you&#39;re really interested in parsers, it can be a wonderful topic to dive deep into.

**You&#39;ll learn about runtime execution.**Running your code means you have to write the runtime (or the compiler) which means thinking deeply about _how_ it will work at run time. When an exception is thrown, how does that actually work? When you reference a variable, how do you know which memory location to find it in? If you run a recursive function, is there a limit to how far you can recurse? Why is that? These are some of the questions you&#39;ll answer.

The list really goes on, and on, and on. You can tailor your language to what you want to learn about. My first language, Hurl, taught me about the basics of making an interpreter, designing a language, and writing a grammar. My second language, Lilac, is going to teach me more about type systems, runtimes, and instrumentation.

As you go make a language, you&#39;ll gain deeper intuitions for and understanding of other languages. When I implemented Hurl and ran into parsing errors, it would spit out raw token names at me. This resembled some of the errors I used to see sometimes in my Neovim Rust LSP integration, and it started to make _those_ errors easier to understand. Each language and implementation decision you make will deepen your understanding of the languages you use, and you&#39;ll be a better user for it.

## It will be a bad language, and that&#39;s okay

The nice thing with writing your own language for learning is that it&#39;s likely to be a bad one. It&#39;s certainly _possible_ to make [new, good languages](https:&#x2F;&#x2F;gleam.run&#x2F;), and that&#39;s wonderful! But in my experience, it&#39;s best to separate out learning how to do something from doing it exceptionally well.

When you go into it knowing that it&#39;s going to be a bad language, it can be very freeing! Bad doesn&#39;t mean that it&#39;s _not useful to you_, because it still can be. Mostly, it means that it will lack the fit and finish of a &quot;real&quot; language and it will be defective in some way that limits widespread use. But you can make something that solves a specific problem for you, lets you do Advent of Code puzzles, or earns you nerd cred with your friends. These are useful things.

Since you aren&#39;t going to make the next Python, you can focus on the things that are interesting, compelling, and fruitful for learning. You can slough off all the things that are tedious but necessary for real-world usage. Your learning can be targeted and you can keep it fun, so you&#39;re more likely to finish the project. And it&#39;s okay to break things arbitrarily, or make wildly ridiculous language choices that just make you smile. Because hey, it&#39;s going to be bad _anyway_, right?

## Getting started making languages

It&#39;s intimidating to sit down in front of a blank editor and &quot;make a new language.&quot; For a long time, I thought—even as Principal Software Engineer—that it was some dark art that is beyond my abilities. That&#39;s a load of crock, and _all of us_ programmers can do it. It gets easier every year to get started, because there are so many resources out there to learn from.

The first thing I&#39;d recommend is implementing someone _else&#39;s_ language in a guided fashion. I followed [Crafting Interpreters](https:&#x2F;&#x2F;craftinginterpreters.com&#x2F;) for this, and it&#39;s _incredible_. I&#39;ve also heard good things about [Writing An Interpreter In Go](https:&#x2F;&#x2F;interpreterbook.com&#x2F;) and [Build Your Own Lisp](https:&#x2F;&#x2F;www.buildyourownlisp.com&#x2F;). Any of these will give you a taste of how languages work and let someone experienced guide you thorough it.

One thing, though: I&#39;ve found it is a good idea to choose a _different_ implementation language from what the book uses. Crafting Interpreters uses Java and C, so I used Rust. By choosing a different language, you&#39;re forced to grapple with the concepts to translate them. You can&#39;t simply retype the code, so you will learn it at a deeper level.

After that, the direction you go is really up to you. I got started with Hurl by just kind of designing it and throwing things at the wall to see what sticks. That worked and let me crystallize a lot of the knowledge I got from Crafting Interpreters. For Lilac, I&#39;ve read [one book](https:&#x2F;&#x2F;www3.nd.edu&#x2F;~dthain&#x2F;compilerbook&#x2F;) so far and have a short list of others to read. When I asked friends for recommendations, these are a few of the books they recommend for this:

* [Introduction to Compilers and Language Design](https:&#x2F;&#x2F;www3.nd.edu&#x2F;~dthain&#x2F;compilerbook&#x2F;), which I&#39;ve read and really enjoyed
* [Engineering a Compiler](https:&#x2F;&#x2F;shop.elsevier.com&#x2F;books&#x2F;engineering-a-compiler&#x2F;cooper&#x2F;978-0-12-815412-0)
* [Programming Languages: Application and Interpretation](https:&#x2F;&#x2F;www.plai.org&#x2F;)
* [Compilers: Principles, Techniques, and Tools](https:&#x2F;&#x2F;suif.stanford.edu&#x2F;dragonbook&#x2F;) aka the Dragon Book

What you read will depend on where you want to go next and what you want to learn.

## Go Forth, make something fun

I think we should all go and make a new language. It&#39;s a great way to learn, and new ideas have to come from somewhere. At the end of the day, it&#39;s a wonderful way to have some fun with your computer.

Oh, and _please_ expand the vocabulary of programming language names. We can say &quot;Go Forth&quot; but it&#39;s hard to put together a whole sentence with just programming languages. Let&#39;s fix that, shall we? And let&#39;s B Swift about it.

---

1

There are some firmware blobs which we _don&#39;t_ control. But there is fully open hardware, and you have to stop going down the stack somewhere. Well, I guess you _could_ go start a mining operation to extract ore from the earth and go truly from scratch...

[↩](#firmware-sad%5Fref)

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).