---
id: 53050fb1-cf5e-49f0-bdf1-d28c61c9a6ac
title: Where is the sandbox in your code base?
tags:
  - RSS
date_published: 2024-07-11 13:01:01
---

# Where is the sandbox in your code base?
#Omnivore

[Read on Omnivore](https://omnivore.app/me/where-is-the-sandbox-in-your-code-base-190a3317ebd)
[Read Original](https://interjectedfuture.com/where-is-the-sandbox-in-your-code-base/)



![Where is the sandbox in your code base?](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3gqKzHIg-k61dwXLLMWV5AJY5EYgrySEFpzIsmgTxtk&#x2F;https:&#x2F;&#x2F;interjectedfuture.com&#x2F;content&#x2F;images&#x2F;size&#x2F;w2000&#x2F;2024&#x2F;07&#x2F;DALL-E-2024-07-07-12.20.10---A-playful--digital-rendering-of-a-sandbox-with-various-toys-and-tools-scattered-around.-The-sandbox-should-look-inviting-and-creative--with-a-mix-of-v.jpeg) 

I was watching Casey Muratori and the Primeagen the other day, and they were talking about the high-level architectural design of the core data inside of Primeagen&#39;s game. What Casey says sounds counter-intuitive for anyone from a traditional OOP software background. He suggests **not** committing to an organization of data of different game entities around different objects (as in OOP objects). The data for rendering game entities shouldn&#39;t be cordoned off from the data for the physics of game entities. 

Crazy talk. But he&#39;s right. I think there&#39;s a bit of nuance that got glossed over in the discussion that makes this the right architectural call. 

A fundamental fact in game dev is that you don&#39;t know what&#39;s fun until you try it. Plenty of prototypical board games seem fun on paper, but it turned out not to be fun when you actively try out the rule set in play. Here&#39;s an exercise: take any game you know well and change one constraint. It could be the countdown timer for the level, the number of lives, or the type of weapons. Whether you get more fun or less fun depends on the constraint, but there exist small constraint changes that can completely alter a game, or even break it completely. \[1\]

What makes games fun is not just the individual entities and the game mechanics. It&#39;s how they all interact to create a system of interlocking parts. They all interact together in different ways to create interesting consequences and effects. Go, Blokkus, Spleunky, and Breath of the Wild are all examples of this on full display: From simple parts and composition comes a host of interesting consequences for solving problems. That means as a game designer you need to continually experiment with the entities and elements of the game until you get a system that has both simple, legible parts, and their compositions yield interesting effects. These two design requirements are often at odds.

If you don&#39;t know what will make a game fun until you play with it, how do you make a fun game? You iterate, trial and error, and hill-climb to fun. \[2\] And to do that, you need to create a conducive environment for experimentation. 

That is what Casey is advocating. Because you don&#39;t yet know the solution or even the shape of the problem, it doesn&#39;t make sense to lock yourself into an ontology before you understand it. If you lock yourself in before understanding, you&#39;re drawing boundaries that must be overcome and worked around, creating more work for yourself. And this inevitably happens because you drew the boundaries wrong. After all, you drew them before understanding the problem space! It&#39;s unlikely you drew it correctly on the first try.

The fundamental assumption of 90&#39;s style OOP (not Smalltalk style OOP) is that if one can model the problem as an ontology, a hierarchy of categories of objects, then it takes you most of the way to solving the problem. I think this is one of the most misguided principles and assumptions in software. It&#39;s led the entire field and industry astray for the last 30 years. Luckily, we&#39;ve slowly moved past it, as almost no one is espousing proper class hierarchies.

When ontologies solve a problem, it works quite well. But empirically, it often does not, because it often is not the right tool for thinking about, framing, understanding the nuances of, and solving a problem. \[3\] Worse, once you pick an ontology, it&#39;s significantly harder to undo as you use it more. And because 90&#39;s style OOP forces you to pick an ontology before you fully understand the problem space, it&#39;s never what you want later on in project development. So we spend more time working around our misguided choices earlier on, and management wonders why we&#39;ve slowed down the pace of shipping features. 

Hence, there needs to be **somewhere** in your codebase right underneath the domain level of your game that lets you experiment quickly with the different combinatorics to yield interesting, yet understandable gameplay. 

So at least in game dev, they&#39;ve moved away from a collection of instantiated objects from a class hierarchy to an entity component system. Entity component systems are a simplified key&#x2F;value store of components–a bin of Lego blocks–you use to compose game entities. You use the components to mix and match the behaviors of entities in the game and the interactions between those entities. So instead of a Monster class, you might put together a position component, a sprite component, an AI component, a health component, and a weapon component to represent a monster. The monster as an entity doesn&#39;t exist or is grouped anywhere in the system, except perhaps, as an alias. This ability to mix and match behaviors allows you to experiment with gameplay possibilities.

For example, if you decided that the camera will always follow the player in your top-down shoot-em-up adventure, that&#39;s a reasonable initial assumption. Every game in this genre you&#39;ve played had such a thing, and you&#39;ve never seen any different.

But games stand out by being differentiated with unique ideas. What if you had the idea that you want to add a remote-controlled missile as a new weapon? Now, the camera needs to follow the missile instead of the player.

If you locked yourself into &quot;only players have the cameras&quot; on them, you&#39;ve just created a lot of work for yourself. Either to break the ontology and recategorize, or never have the ontology in the first place. That&#39;s why people spout &quot;composition over inheritance&quot; after decades of experimentation with 90&#39;s style OOP and realizing that certain aspects just do not work well.

While I&#39;ve focused on games thus far, I think this idea of a sandbox is broadly applicable to software. It&#39;s just that only the games industry has acknowledged it explicitly. As software is more expensive to write than to buy, it gets written if an off-the-shelf solution wouldn&#39;t solve the problem. By definition, we only write software when solving a new problem; when we don&#39;t fully understand the problem.

You want a place you consider a sandbox in your code to explore the consequences of the system you&#39;re trying to model but don&#39;t yet fully understand its nature. Though it seems counter to the idea of a separation of concerns, I think it&#39;s correct to have a single struct that mixes all the states relevant to both game state and rendering state. Until you understand what you&#39;re building, you shouldn&#39;t lock yourself into a structure you might need to undo later.

But it&#39;s not right for that experimental play to spread through all parts of the code base. The nature of the analogy of a sandbox is that what&#39;s inside of the boundary is fair game for play, but outside of it, there needs to be discipline and clarity. And most of the time, we delegate this to the framework and libraries. 

But I don&#39;t think it&#39;s enough. Many application devs think frameworks and libraries will solve all their problems, and if they only draw between the lines, they&#39;ll be fine. Inevitably, they will come across some aspect of their problem not covered by the framework, and if they don&#39;t have practice moving good experimental solutions from inside the sandbox to a place outside of the sandbox, they will suffer. Or more likely, complain on Twitter that they have to fight against the framework. 

When we&#39;ve settled on a particular solution or design, it needs to be shaped up and graduated from the sandbox to life outside of the sandbox with good judgment.\[4\] Without that discipline, the experimental production code remains in a state of arrested development. If your entire codebase is in a sandbox, it&#39;ll become harder to build upon. A sandbox cannot support its own weight, nor anything else on top of it–it&#39;s built out of sand. 

What part of the code base are you working on? Are you inside of the sandbox? Or the outside? When is it time to transition something outside of the sandbox? How do you communicate it to management? There are all good questions to stop and ask yourself as you write code to serve the end-user and your future self.

---

\[1\] If you&#39;re curious about what sort of things can break games, [this Extra Credit episode is a good intro to the concept of Power Creep](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;M3b3hDvRjJA).

\[2\] When you can&#39;t express the problem in a closed form, you&#39;re required to break out numerical methods and iterate like Newton&#39;s Method to the solution.

\[3\] Functional programming isn&#39;t a panacea either. It models problems as data transformations, but the underlying assumption is that the data model is fixed. We know this is not the case given we have schema migrations.

\[4\] As software developers, we appear to be bimodal when it comes to refactoring. Some of us do it too early, hence the blog posts about how you should never make abstractions until you see three examples. Some of us do it too late (or never) hence the blog posts about technical debt. 