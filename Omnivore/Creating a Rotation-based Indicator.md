---
id: c59467ae-9c1c-4f34-a840-a078a07f6bc8
title: Creating a Rotation-based Indicator
tags:
  - RSS
date_published: 2024-07-30 00:00:00
---

# Creating a Rotation-based Indicator
#Omnivore

[Read on Omnivore](https://omnivore.app/me/creating-a-rotation-based-indicator-1910702b73f)
[Read Original](https://www.winstoncooke.com/blog/creating-a-rotation-based-indicator)



After [making an arena shooter for the Playdate](https:&#x2F;&#x2F;www.winstoncooke.com&#x2F;blog&#x2F;making-a-game-for-the-playdate) titled _Plight of the Wizard_, there were a few areas that I knew needed some polish. One of those areas was how I handle my character’s rotation. Here was my previous implementation:

[![An older build of Plight of the Wizard that has awkward rotations when playing the game.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sgNuY_hmHYjHUY3iH3y2C3kU8v60Fq9bMyLKenVM3F1Y&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;da397623-fb28-4296-5ee4-1edc5169d400&#x2F;public &quot;Plight of the Wizard - Old rotation system&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;da397623-fb28-4296-5ee4-1edc5169d400&#x2F;gallery)

There were two issues with my approach:

#### 1\. Rotating a sprite in code is not very performant

According the the [Playdate SDK](https:&#x2F;&#x2F;sdk.play.date&#x2F;inside-playdate&#x2F;#m-graphics.sprite.setRotation):

&gt; This function should be used with discretion, as it’s likely to be slow on the hardware. Consider pre-rendering rotated images for your sprites instead.

#### 2\. It looked plain goofy

Having the player’s sprite as the only sprite on the screen that is upside down looks odd. Further, rotating the sprite applies some bizarre distortion at certain angles. Nothing about this approach screams polished or professional.

I decided fix both problems with one solution: an indicator that displays where the player’s spells are aimed. In order to make this work, I had to create a new sprite that maps to the player’s _x_ and _y_ coordinates with a slight offset so that the indicator doesn’t appear on top of the player. I chose to make the offset equal to the distance the spell will travel. I implemented this in the &#x60;Player&#x60; class in the following manner:

lua

&#x60;&#x60;&#x60;gml
-- player.lua
function Player:init(x, y)
    ...
    self.spellIndicator &#x3D; SpellIndicator(self.x, self.y, self.equippedSpellDistance)
    self.spellIndicator:setPlayerInstance(self)
end
&#x60;&#x60;&#x60;

In the new &#x60;SpellIndicator&#x60; class, I initialize its coordinates with the offset like so:

lua

&#x60;&#x60;&#x60;gml
-- spellIndicator.lua
function SpellIndicator:init(x, y, distance)
    self.indicatorDistance &#x3D; distance
    self.angle &#x3D; 0
    ...
    self:moveTo(x + self.indicatorDistance, y)
end
&#x60;&#x60;&#x60;

After initializing the indicator, I initially tried to make it follow the player by spawning a new instance, which resulted in a fun bug.

[![A bug with the indicator that makes a fun drawing on the screen.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,selddDvwinCIGlklE2nbhVGHJkLONy_XvtXNwWDf2uWM&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;4ba8edfb-b05e-4a34-3982-bd4198430300&#x2F;public &quot;Plight of the Wizard - Indicator drawing bug&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;4ba8edfb-b05e-4a34-3982-bd4198430300&#x2F;gallery)

That looks awesome but doesn’t lend itself very well to gameplay.

Instead, I updated the indicator’s coordinates in its update loop to both follow the player as they move around as well as map it to the rotational value of the crank, which can be rotated 360°.

lua

&#x60;&#x60;&#x60;lua
-- spellIndicator.lua
function SpellIndicator:update()
    if playerInstance then
        -- Rotate the indicator around the player when the crank is rotated
        self.angle &#x3D; self.angle + pd.getCrankChange()
        local newX &#x3D; playerInstance.x + self.indicatorDistance * math.cos(math.rad(self.angle))
        local newY &#x3D; playerInstance.y + self.indicatorDistance * math.sin(math.rad(self.angle))
        self:moveTo(newX, newY)
    end
end
&#x60;&#x60;&#x60;

[![A bug where the spell fired does not follow the spell indicator.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sXVo4GBW1CurYwRtvKIG7JCkjhjAQ09WyBDoUyfBqbB4&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;4f621c2b-6ed2-4c20-709f-2bafe82b3200&#x2F;public &quot;Plight of the Wizard - Indicator rotation without spell&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;4f621c2b-6ed2-4c20-709f-2bafe82b3200&#x2F;gallery)

Now I have an indicator that rotates smoothly around the player that maps to the clockwise and counterclockwise rotations of the Playdate’s crank.

But wait! The fireball spell is shooting to the default position to the right rather where the spell indicator is aimed. Well that’s because it’s still set up to follow the rotation of the player’s sprite, which is now no longer being rotated. The fix is simple. When the player casts a fireball, I just need to pass the &#x60;SpellIndicator&#x60;’s angle rather than the player’s.

lua

&#x60;&#x60;&#x60;reasonml
-- player.lua
castFireballSpell(self, self.spellIndicator.angle)
&#x60;&#x60;&#x60;

lua

&#x60;&#x60;&#x60;lua
-- spells.lua
spellSpawnOffset &#x3D; 48

function castFireballSpell(player, angle)
    local spawnOffsetX &#x3D; spellSpawnOffset * math.cos(math.rad(angle))
    local spawnOffsetY &#x3D; spellSpawnOffset * math.sin(math.rad(angle))
    FireballSpell(player.x + spawnOffsetX, player.y + spawnOffsetY, angle)
end
&#x60;&#x60;&#x60;

So, what does this new fancy indicator look like?

[![The new spell indicator, which rotates around the player and spells are fired towards.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,szKgPM28VVZ3YxAj5Yyhqv22wmRQ4mzbFbfwFNuofEWE&#x2F;https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw_eDwg&#x2F;dec78770-6bc5-4f40-8e20-2e7983f0b900&#x2F;public &quot;Plight of the Wizard - Spell attack indicator&quot;)](https:&#x2F;&#x2F;imagedelivery.net&#x2F;ga2MLDZ3d0ln9C7Qw%5FeDwg&#x2F;dec78770-6bc5-4f40-8e20-2e7983f0b900&#x2F;gallery)

It’s not much, but it gets the job done.

The gameplay is starting to feel like a computer game that uses a mouse to rotate, and I’m very happy with that.