---
id: c86b8a38-4685-4163-b247-07f49efeafcb
title: Making a Game for the Playdate
tags:
  - RSS
date_published: 2024-07-26 00:00:00
---

# Making a Game for the Playdate
#Omnivore

[Read on Omnivore](https://omnivore.app/me/making-a-game-for-the-playdate-190f18a814d)
[Read Original](https://www.winstoncooke.com/blog/making-a-game-for-the-playdate)



I spent the past five days building a game for the [Playdate](https:&#x2F;&#x2F;play.date&#x2F;) for a game jam while at [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;). Building the game required learning quite a few new things: lua, the [Playdate SDK](https:&#x2F;&#x2F;sdk.play.date&#x2F;inside-playdate), working with sprites (including animation), music, sound effects, and the general concept of game design.

Working with the Playdate SDK has been wonderful. It’s well documented and provided everything I needed to hit the ground running. It comes with an examples folder, which helped me understand how I should generally structure my project. I had to learn a few concepts more specific to the Playdate such as interacting with its crank. I also found myself seeing how developing for actual hardware changes game design when the computer you’re developing on is quite a bit more powerful. There were many more things I learned, so I’d like to discuss some of my thoughts and findings while building the game.

## The game

[![The title screen for Plight of the Wizard.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,seawKVwq9M7U1dzLcd-lf4Jcr21OGF5muyucBolZYnq4&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;9c04ad8c-d80e-4374-a6da-59da85eff600&#x2F;public &quot;Plight of the Wizard - Title Screen&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;9c04ad8c-d80e-4374-a6da-59da85eff600&#x2F;gallery)

The name of my game is _Plight of the Wizard_. It’s an arena shooter inspired by the 2003 game [Crimsonland](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Crimsonland). The core gameplay is designed around controlling a wizard that casts spells. As the game progresses, increasingly larger hordes of enemies chase after the player. If any enemy makes contact with the player, then it’s game over. The player moves the wizard around the playing area using the directional-pad (d-pad) and rotates the wizard using the crank. Since both hands are occupied while moving the player, I found that automatically firing spells worked well.

I designed the game to have a slight element of horror to it and aimed to give the player a feeling of constant dread about dying while playing. This can be seen when the player starts the game, and the words “Survive” pop up on the screen as well as when the player dies with a blunt “You Died”.

[![The screen when starting the game.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNvsgTuKylj7N8CUs1nDG-vkk2MMO7HB_Jm74M8BUDHw&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;6bcb7393-d53b-4ada-b2ca-edaf9a438000&#x2F;public &quot;Plight of the Wizard - Starting the game&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;6bcb7393-d53b-4ada-b2ca-edaf9a438000&#x2F;gallery)

[![The screen when the player dies.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sgNuY_hmHYjHUY3iH3y2C3kU8v60Fq9bMyLKenVM3F1Y&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;da397623-fb28-4296-5ee4-1edc5169d400&#x2F;public &quot;Plight of the Wizard - Losing the game&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;da397623-fb28-4296-5ee4-1edc5169d400&#x2F;gallery)

As of now, there are two enemy types. The first is the zombie, which requires being hit by two spells before it dies, but it moves slowly and gets caught on obstacles such as trees. The second enemy is the bat. The bat spawns after more time has passed, is faster than the zombie, and can fly over&#x2F;through obstacles to more directly target the player. But the bat only requires one hit before it dies.

## Playtesting

When I built the game, I was naturally accustomed to its design and how to play it. Upon watching others play the game for the first time, I immediately made two observations: how new players interacted with the crank and how they played the game were different than how I played the game.

### The crank

The crank poses an interesting design conundrum. People who don’t own a Playdate don’t have a frame of reference on how to use it and are unsurprisingly slow to catch on to its use. They’re hesitant to give it some serious spins. Yet experienced playdate owners will have used the crank. The Playdate provides new owners with a trickle of 24 games over 12 weeks, which feel like they are released in an order that teaches new owners how to operate the crank.

So what expectations should I expect from my players? Fortunately, my answer to that arose when I observed people actually playing the game.

### Gameplay

I noticed that people playing the game for the first time were overwhelmed. They were flustered by the numerous enemies immediately spawning when they hadn’t had the time to learn the basic controls down. I want the game to feel overwhelming and claustrophobic, but it needs to build up more slowly to that for a first-time player. They shouldn’t be completely frozen and unable to actually play the game.

In order to address this, as well as the potential unfamiliarity with the crank, I came up with an idea. The game should start with enemies spawning at a much slower rate to give the player time to familiarize themselves with the world. I changed the gameplay to give the player a single zombie to kill before more enemies spawn. The zombie spawns in the upper right corner and advances slowly towards the player. This not only lets new players get used to using the controls before the core gameplay loop begins, but it also forces them to use the crank to aim at the zombie coming from above.

[![Starting the game with the tutorial zombie.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,soLPKqzEQh_EhpHwXpoBwjUFAeRT-UpQQb-2EH7iEIKk&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;80a86b44-c797-42d7-297f-9acbd4b43900&#x2F;public &quot;Plight of the Wizard - Tutorial Zombie&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;80a86b44-c797-42d7-297f-9acbd4b43900&#x2F;gallery)

Experienced players can quickly kill the zombie to get the game going. On subsequent playthroughs, the game launches straight into spawning enemies. Now that players hopefully have a grasp of how to play the game, they don’t need to face the “tutorial” zombie again.

## Next steps

I think the core gameplay is pretty fun, but it needs more substance. First, I want to add spell upgrades that drop randomly on the map. A spell that casts a wider spread like a shotgun would be a welcome addition as the number of enemies grows. As more powerful spells are added, more enemies will be required as well. I also want to add some environment hazards such as lightning. I’m imaging this as some sparks on the ground surrounding the player indicating something is about to happen and then a massive lightning strike that temporarily inverts the colors of the black and white display. If it strikes the player then they instantly die, and it’s game over.

The biggest change I want to make is opening up the world. The screen should be a smaller window on a larger map that the player can navigate around. I’ll have to carefully balance that change while keeping the claustrophobic feeling.

There are also a few directions where I could take the gameplay. The first is keeping it as is, with the core focus being on surviving and setting the highest score. This is fine, but I don’t think it’s too exciting. I’m heavily inspired by games like [Dark Souls](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Dark%5FSouls), [Escape from Tarkov](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Escape%5Ffrom%5FTarkov), and [Deep Rock Galactic](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Deep%5FRock%5FGalactic). I love how they provide a system where you can push forward to acquire more loot at the risk of potentially dying and losing it all. That type of gameplay adds a particular anxiety that makes dying really impactful and something the player wants to avoid at all costs compared to games where dying and restarting happen with minimum friction. I think if I implemented some sort of task for the player to accomplish and then gamble pushing forward or cashing out, the gameplay would be much deeper and more enjoyable.

## Closing thoughts

I have so many more ideas I would love to explore in order to make this game a lot more fun, but I’m really happy with my progress after five days. I’ve greatly enjoyed targeting actual hardware that I can hand to other people and learn from how they play the game. I’m excited to see where I can take the game from here.

---