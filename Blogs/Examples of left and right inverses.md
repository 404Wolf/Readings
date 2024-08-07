---
link: https://blog.plover.com/math/inverses.html
author: Mark Dominus
published: 2024-08-05T17:01:30
tags: []
---
# Highlights


---
# Examples of left and right inverses
Like almost everyone except Alexander Grothendieck, I understand things better with examples. For instance, how do you explain that

$$(f\circ g)^{-1} = g^{-1} \circ f^{-1}?$$

Oh, that's easy. Let ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) be putting on your shoes and ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%5e%7b%2d1%7d%24) be taking off your shoes. And let ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24) be putting on your socks and ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%5e%7b%2d1%7d%24) be taking off your socks.

Now ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%5ccirc%20g%24) is putting on your socks and then your shoes. And ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%5e%7b%2d1%7d%20%5ccirc%20f%5e%7b%2d1%7d%24) is taking off your shoes _and then_ your socks. You can't ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%5e%7b%2d1%7d%20%5ccirc%20g%5e%7b%2d1%7d%24), that says to take your socks off before your shoes.

(I see a topologist jumping up and down in the back row, desperate to point out that the socks were never inside the shoes to begin with. Sit down please!)

Sometimes operations commute, but not in general. If you're teaching group theory to high school students and they find nonabelian operations strange, the shoes-and-socks example is an unrebuttable demonstration that not everything is abelian.

(Subtraction is _not_ a good example here, because subtracting ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24a%24) and then ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24b%24) is the same as subtracting ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24b%24) and then ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24a%24). When we say that subtraction isn't commutative, we're talking about something else.)

Anyway this weekend I was thinking about very very elementary category theory (the only kind I know) and about left and right inverses. An arrow ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%20%3a%20A%5cto%20B%24) has a left inverse ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24) if

$$g\circ f = 1_A.$$

Example of this are easy. If ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) is putting on your shoes, then ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24) is taking them off again. ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24A%24) is the state of shoelessness and ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24B%24) is the state of being shod. This ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) has a left inverse and no right inverse. You can't take the shoes off before you put them on.

But I wanted an example of an ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) with right inverse and no left inverse:

$$f\circ h = 1_B$$

and I was pretty pleased when I came up with one involving pouring the cream pitcher into your coffee, which has no left inverse that gets you back to black coffee. But you can ⸢unpour⸣ the cream if you do it _before_ mixing it with the coffee: if you first put the cream back into the carton in the refrigerator, then the pouring does get you to black coffee.

But now I feel silly. There is a trivial theorem that if ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24) is a left inverse of ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24), then ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) is a right inverse of ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24). So the shoe example will do for both. If ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) is putting on your shoes, then ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24) is taking them off again. And just as ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24) has a left inverse and no right inverse, because you can't take your shoes off before putting them on, ![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24g%24) has a right inverse (![](https://chart.apis.google.com/chart?chf=bg,s,00000000&cht=tx&chl=%24f%24)) and no left inverse, because you can't take your shoes off before putting them on.

This reminds me a little of the time I tried to construct an example to show that “is a blood relation of" is not a transitive relation. I had this very strange and elaborate example involving two sets of sisters-in-law. But the right example is that almost everyone is the blood relative of both of their parents, who nevertheless are not (usually) blood relations.

This post was originally published [here](https://blog.plover.com/math/inverses.html) and you are reading it in the [Blaggregator](https://blaggregator.recurse.com/new/) feed. [Join the discussion](https://recurse.zulipchat.com/#narrow/stream/blogging/topic/Examples.20of.20left.20and.20right.20inverses) on Zulip!.