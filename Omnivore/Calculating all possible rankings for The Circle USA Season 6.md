---
id: a7d00dac-0fd2-11ef-adf4-c7b2f9333749
title: Calculating all possible rankings for The Circle USA Season 6
tags:
  - RSS
date_published: 2024-05-11 00:00:00
---

# Calculating all possible rankings for The Circle USA Season 6
#Omnivore

[Read on Omnivore](https://omnivore.app/me/calculating-all-possible-rankings-for-the-circle-usa-season-6-18f69483005)
[Read Original](https://kevingal.com/blog/thecircle.html)



### Figuring out who gave what rank to whom. (And coming out as someone who watches reality TV).

Tags: [pop-culture](https:&#x2F;&#x2F;kevingal.com&#x2F;blog&#x2F;tag&#x2F;pop-culture.html) [programming](https:&#x2F;&#x2F;kevingal.com&#x2F;blog&#x2F;tag&#x2F;programming.html) [python](https:&#x2F;&#x2F;kevingal.com&#x2F;blog&#x2F;tag&#x2F;python.html) 

[&lt;&lt; previous](https:&#x2F;&#x2F;kevingal.com&#x2F;blog&#x2F;chess-ratings.html) 

---

The Circle is a reality competition show where the contestants communicate solely through text. This allows them to come into the show as a &quot;catfish&quot; and assume a new identity, though most people play as themselves. At the end of each round, they rank each other from first to last and the overall top-rated players become &quot;influencers&quot;, which gives them the power to eliminate someone from the game. In the final round, the top-ranked player wins the prize money.

As viewers, we are shown only a subset of the ratings (such as: Player A put Player B in 2nd place) and the final ranking. However, I&#39;m always curious how exactly the players ranked each other. Who were the backstabbers, who were the game-players, who were the do-gooders? This can be figured out with a little bit of programming.

First we need to encode the final results and the known rankings.

**WARNING: SPOILERS AHEAD FOR THE CIRCLE USA SEASON 6**.

&#x60;class P:
    OLIVIA &#x3D; &quot;Olivia&quot;
    KYLE &#x3D; &quot;Kyle&quot;
    QT &#x3D; &quot;QT&quot;
    JORDAN &#x3D; &quot;Jordan&quot;
    LAUREN &#x3D; &quot;Lauren&quot;

real_final_rank &#x3D; [
    P.OLIVIA,
    P.KYLE,
    P.QT,
    P.JORDAN,
    P.LAUREN
]

players &#x3D; set(real_final_rank)

known_rankings &#x3D; {
    P.OLIVIA: {
        P.QT: 1,
        P.KYLE: 2
    },
    [...]
}
&#x60;

Then, for each player, we generate all the rankings they _could_ have chosen. For example, based on what we know about Olivia, either of the following rankings are possible:

* QT, Kyle, Jordan, Lauren.
* QT, Kyle, Lauren, Jordan.

Here&#39;s some code for doing that. It basically makes a &quot;template&quot; of the possible rankings, like &#x60;[&quot;QT&quot;, &quot;Kyle&quot;, None, None]&#x60;. Then, using &#x60;itertools.permutations(...)&#x60;, it fills the &#x60;None&#x60; spots in the template using all possible orderings of the unassigned players.

&#x60;possible_rankings_per_player &#x3D; []
for player in players:
    player_known_rankings &#x3D; known_rankings[player]
    possible_rankings &#x3D; []
    ranking_template &#x3D; [None for _ in range(len(players)-1)]
    for p, rank in player_known_rankings.items():
        ranking_template[rank-1] &#x3D; p
    unassigned_players &#x3D; (players - set([player])) - set(player_known_rankings.keys())

    for perm in itertools.permutations(unassigned_players):
        possible_ranking &#x3D; ranking_template[:]
        i, j &#x3D; 0, 0
        while i &lt; len(possible_ranking) and j &lt; len(perm):
            if possible_ranking[i] is None:
                possible_ranking[i] &#x3D; perm[j]
                j +&#x3D; 1
            i +&#x3D; 1
        possible_rankings.append(possible_ranking)
    possible_rankings_per_player.append(possible_rankings)
&#x60;

Finally, we take all possible _combinations_ of all the possible rankings, and see which combinations result in the final ordering we saw in the show. Those combinations are the candidates for the true rankings.

To make this clearer: we take the 2 possible rankings made by Olivia, and combine them with all the possible rankings by QT, and all the possible rankings by Kyle, and so on. This might seem like it would result in too many possibilities, but actually it doesn&#39;t, because there are only 5 players and quite a lot of information is known.

Here&#39;s the table of rankings we know about.

| Rank | Olivia | Kyle   | QT     | Jordan | Lauren |
| ---- | ------ | ------ | ------ | ------ | ------ |
| 1    | QT     | Olivia | Kyle   | Lauren | Jordan |
| 2    | Kyle   | ?      | ?      | ?      | ?      |
| 3    | ?      | Lauren | Olivia | ?      | ?      |
| 4    | ?      | ?      | ?      | QT     | ?      |

If there are &#x60;N&#x60; unknown spots in someone&#39;s ranking, then there are &#x60;N! &#x3D; N × (N-1) × ... × 1&#x60; ways to fill those spots. That means there are &#x60;(2!)^4 × 3! &#x3D; 96&#x60; possible combinations for Season 6\. Thankfully, &#x60;itertools&#x60; comes to the rescue again and we can generate all the combinations using &#x60;itertools.product(...)&#x60;. For every combination, we calculate the final score of each player, where 1st, 2nd, 3rd and 4th place positions are worth 3, 2, 1 and 0 points, respectively. We then order the players by their scores and check if the final ranking matches the _real_ final ranking - e.g. we have to discard any combinations that don&#39;t result in Olivia being the winner.

&#x60;for rankings in itertools.product(*possible_rankings_per_player):
    scores &#x3D; dict([(player, 0) for player in players])
    for ranking in rankings:
        for i, player in enumerate(ranking):
            scores[player] +&#x3D; len(players)-2-i
    final_rank &#x3D; list(players)
    final_rank.sort(key&#x3D;lambda p: scores[p], reverse&#x3D;True)

    if matches_real_rank(final_rank, scores):
        pass # This is a possible solution, print it out!
&#x60;

The only annoying part is the possibility of ties. A player who tied for 2nd place could be presented on the show as having finished in 2nd place _or_ 3rd place, according to the narrative that the producers wanted to create. The &#x60;matches_real_rank(...)&#x60; function resolves this, basically checking that the players fell within the appropriate range of positions based on who they were tied with.

&#x60;def matches_real_rank(final_rank, scores):
    rank &#x3D; 0
    for score in sorted(set(scores.values()), reverse&#x3D;True):
        ps_with_score &#x3D; [p for p in final_rank if scores[p] &#x3D;&#x3D; score]
        for p in ps_with_score:
            i &#x3D; real_final_rank.index(p)
            if not (rank &lt;&#x3D; i and i &lt; rank+len(ps_with_score)):
                return False
        rank +&#x3D; len(ps_with_score)
    return True
&#x60;

Finally, running the code shows that there are 5 possibilities for the true rankings. Two of them result in a tie for first place between Olivia &amp; Kyle, which I don&#39;t think is what happened, &#39;cause it would then be pretty unfair for Olivia to get all the prize money.

So, here are the 3 remaining possibilities! I&#39;ve highlighted in green the positions we know with certainty, including both the ones that were revealed in the show and the ones that are constant across all the possible rankings.

Scenario 1: Olivia (8), Kyle (6), QT (6), Jordan (6), Lauren (4).

| Rank | Olivia | Kyle   | QT     | Jordan | Lauren |
| ---- | ------ | ------ | ------ | ------ | ------ |
| 1    | QT     | Olivia | Kyle   | Lauren | Jordan |
| 2    | Kyle   | QT     | Jordan | Olivia | Olivia |
| 3    | Jordan | Lauren | Olivia | Kyle   | QT     |
| 4    | Lauren | Jordan | Lauren | QT     | Kyle   |

Scenario 2: Olivia (8), Kyle (6), QT (6), Jordan (5), Lauren (5).

| Rank | Olivia | Kyle   | QT     | Jordan | Lauren |
| ---- | ------ | ------ | ------ | ------ | ------ |
| 1    | QT     | Olivia | Kyle   | Lauren | Jordan |
| 2    | Kyle   | QT     | Jordan | Olivia | Olivia |
| 3    | Lauren | Lauren | Olivia | Kyle   | QT     |
| 4    | Jordan | Jordan | Lauren | QT     | Kyle   |

Scenario 3: Olivia (8), Kyle (7), QT (5), Jordan (5), Lauren (5).

| Rank | Olivia | Kyle   | QT     | Jordan | Lauren |
| ---- | ------ | ------ | ------ | ------ | ------ |
| 1    | QT     | Olivia | Kyle   | Lauren | Jordan |
| 2    | Kyle   | QT     | Jordan | Olivia | Olivia |
| 3    | Lauren | Lauren | Olivia | Kyle   | Kyle   |
| 4    | Jordan | Jordan | Lauren | QT     | QT     |

We&#39;re left with 2 unknowns:

1. Whether Olivia ranked Lauren and Jordan in 3rd or 4th place.
2. Whether Lauren and Jordan ranked QT and Kyle in 3rd or 4th place.

Of course, I&#39;ve made a critical assumption about how the scoring system works. The producers could easily tamper with it to achieve the outcome they want. In any case, even if my assumption is correct and there was no tampering, the producers still had to make a decision on how to break ties. Some interesting possibilities: there could&#39;ve been a 3-way tie for 2nd place, and Lauren could&#39;ve been tied for 3rd place and not have come dead last.

Another interesting thing to look at is to fix the rankings of all but one player, and then see if that player could&#39;ve won by making different choices. As far as I can see, QT couldn&#39;t have won in any scenario. Kyle could&#39;ve won in Scenario 3, at least, by ranking Olivia in 3rd or 4th place. At the end of the day, however, I think the most deserving player won, as Olivia (a.k.a. Brandon) managed to stay on good terms with everyone and played with the right mixture of heart and brains.

Full code is [here](https:&#x2F;&#x2F;gist.github.com&#x2F;Kevinpgalligan&#x2F;9e64c54b55f5f23408a67098bc83e625).

---

[&lt;&lt; previous](https:&#x2F;&#x2F;kevingal.com&#x2F;blog&#x2F;chess-ratings.html) 
* [Back to blog](https:&#x2F;&#x2F;kevingal.com&#x2F;blog.html)
* [RSS feed](https:&#x2F;&#x2F;kevingal.com&#x2F;feed.xml)

I&#39;d be happy to hear from you at _galligankevinp@gmail.com_.