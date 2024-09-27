---
id: 2cd9414a-1b4d-4e84-a555-f4c6a19d85d8
title: "The Universe of Disco : XKCD game theory question"
tags:
  - RSS
date_published: 2024-08-22 11:04:45
---

# The Universe of Disco : XKCD game theory question
#Omnivore

[Read on Omnivore](https://omnivore.app/me/the-universe-of-disco-xkcd-game-theory-question-1917b2fc6c8)
[Read Original](https://blog.plover.com/math/xkcd-game-theory.html)



[XKCD game theory question](https:&#x2F;&#x2F;blog.plover.com&#x2F;math&#x2F;xkcd-game-theory.html)   

![Six-panel cartoon from XKCD.
Each panel gives a one-question mathematics ‘final exam’ from
a different level of education from ‘kindergarten’ to 
‘postgraduate math’.  This article concerns the fifth, which says
“Game Theory Final Exam: Q. Write down 10 more than the average of
the class’s answers.  A. (blank).”](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sTX8-C5SRjHxp_O9egD5S22S4pJVNSeIQhmtq0rRTmss&#x2F;https:&#x2F;&#x2F;pic.blog.plover.com&#x2F;math&#x2F;xkcd-game-theory&#x2F;exam_numbers.png)

(Source: [XKCD “Exam numbers”](https:&#x2F;&#x2F;xkcd.com&#x2F;2966&#x2F;).)

This post is about the bottom center panel, “Game Theory final exam”.

I don&#39;t know much about game theory and I haven&#39;t seen any other discussion of this question. But I have a strategy I think is plausible and I&#39;m somewhat pleased with.

(I assume that answers to the exam question must be real numbers — not !!\\infty!! — and that “average” here is short for &#39;arithmetic mean&#39;.)

First, I believe the other players and I must find a way to agree on what the average will be, or else we are all doomed. We can&#39;t communicate, so we should choose a Schelling point and hope that everyone else chooses the same one. Fortunately, there is only one distinguished choice: zero. So I will try to make the average zero and I will hope that others are trying to do the same.

If we succeed in doing this, any winning entry will therefore be !!10!!. Not all !!n!! players can win because the average must be !!0!!. But !!n-1!! can win, if the one other player writes !!-10(n-1)!!. So my job is to decide whether I will be the loser. I should select a random integer between !!0!! and !!n-1!!. If it is zero, I have drawn a short straw, and will write !!-10(n-1)!!. otherwise I write !!10!!.

(The straw-drawing analogy is perhaps misleading. Normally, exactly one straw is short. Here, any or all of the straws might be short.)

If everyone follows this strategy, then I will win if exactly one person draws a short straw and if that one person isn&#39;t me. The former has a probability that rapidly approaches !!\\frac1e\\approx 36.8\\%!! as !!n!! increases, and the latter is !!\\frac{n-1}n!!. In an !!n!!-person class, the probability of my winning is $$\\left(\\frac{n-1}n\\right)^n$$ which is already better than !!33.3\\%!! when !!n&#x3D; 6!!, and it increases slowly toward !!36.8\\%!! after that.

Some miscellaneous thoughts:

1. The whole thing depends on my idea that everyone will agree on !!0!! as a Schelling point. Is that even how Schelling points work? Maybe I don&#39;t understand Schelling points.
2. I like that the probability !!\\frac1e!! appears. It&#39;s surprising how often this comes up, often when multiple agents try to coordinate without communicating. For example, in[ALOHAnet](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;ALOHAnet%23Slotted%5FALOHA) a number of ground stations independently try to send packets to a single satellite transceiver, but if more than one tries to send a packet at a particular time, the packets are garbled and must be retransmitted. At most !!\\frac1e!! of the available bandwidth can be used, the rest being lost to packet collisions.
3. The first strategy I thought of was plausible but worse: flip a coin, and write down !!10!! if it is heads and !!-10!! if it is tails. With this strategy I win if exactly !!\\frac n2!! of the class flips heads and if I do too. The probability of this happening is only $$\\frac{n\\choose n&#x2F;2}{2^n}\\cdot \\frac12 \\approx \\frac1{\\sqrt{2\\pi n}}.$$ Unlike the other strategy, this decreases to zero as !!n!! increases, and in no case is it better than the first strategy. It also fails badly if the class contains an odd number of people.  
Thanks to Brian Lee for figuring out [the asymptotic value of !!4^{-n}\\binom{2n}{n}!!](https:&#x2F;&#x2F;www.moderndescartes.com&#x2F;essays&#x2F;2n%5Fchoose%5Fn&#x2F;)so I didn&#39;t have to.
4. Just because this was the best strategy I could think of in no way means that it is the best there is. There might have been something much smarter that I did not think of, and if there is then my strategy will sabotage everyone else.  
Game theorists do think of all sorts of weird strategies that you wouldn&#39;t expect could exist.[I wrote an article about one a few years back](https:&#x2F;&#x2F;blog.plover.com&#x2F;math&#x2F;envelope.html).
5. Going in the other direction, even if !!n-1!! of the smartest people all agree on the smartest possible strategy, if the !!n!!th person is Leeroy Jenkins, he is going to ruin it for everyone.
6. If I were grading this exam, I might give full marks to anyone who wrote down either !!10!! or !!-10(n-1)!!, even if the average came out to something else.
7. For a similar and also interesting but less slippery question, see Wikipedia&#39;s article on[Guess ⅔ of the average](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Guess%5F2%2f3%5Fof%5Fthe%5Faverage). Much of the discussion there is directly relevant. For example, “For Nash equilibrium to be played, players would need to assume both that everyone else is rational and that there is common knowledge of rationality. However, this is a strong assumption.” LEEROY JENKINS!!
8. People sometimes suggest that the real Schelling point is for everyone to write !!\\infty!!. (Or perhaps !!-\\infty!!.)  
Feh.
9. If the class knows ahead of time what the question will be, the strategy becomes a great deal more complicated! Say there are six students. At most five of them can win. So they get together and draw straws to see who will make a sacrifice for the common good. Vidkun gets the (unique) short straw, and agrees to write !!-50!!. The others accordingly write !!10!!, but they discover that instead of !!-50!!, Vidkun has written !!22!! and is the only person to have guessed correctly.  
I would be interested to learn if there is a playable Nash equilibrium under these circumstances. It might be that the optimal strategy is for everyone to play as if they _didn&#39;t_ know what the question was beforehand!  
Suppose the players agree to follow the strategy I outlined, each rolling a die and writing !!-50!! if the die comes up !!1!!, and !!10!! otherwise. And suppose that although the others do this, Vidkun skips the die roll and unconditionally writes !!10!!. As before, !!n-1!! players (including Vidkun) win if exactly one of them rolls zero. Vidkun&#39;s chance of winning increases. Intuitively, the other players&#39; chances of winning ought to decrease. But by how much? I think I keep messing up the calculation because I keep getting zero. If this were actually correct, it would be a fascinating paradox!

_\[[Other articles in category &#x2F;math](https:&#x2F;&#x2F;blog.plover.com&#x2F;math)\] [permanent link](https:&#x2F;&#x2F;blog.plover.com&#x2F;math&#x2F;xkcd-game-theory.html)_ 

  