---
id: 05731014-2c46-454d-888c-4efe9a3d2306
title: An ideology-induced bug in Mypy | Something Something Programming
tags:
  - RSS
date_published: 2024-09-10 00:00:00
---

# An ideology-induced bug in Mypy | Something Something Programming
#Omnivore

[Read on Omnivore](https://omnivore.app/me/an-ideology-induced-bug-in-mypy-something-something-programming-191de230fd1)
[Read Original](https://nickdrozd.github.io/2024/09/10/mypy-bug.html)



**Mypy** is a typechecker for Python. It’s not the official typechecker for Python. There is no official typechecker. But Mypy seems to be the official-est. I use it, and it’s mostly pretty great.

Mypy has a **bug**. Big deal, lots of software has bugs. But this bug seems to have been deliberately chosen on the basis of some **misguided code ideology**. I think the ideology ought to be discarded and the bug ought to be fixed.

Before describing the bug, I would like to speak about **static typing in Python**. Python is renowned for how [freeing](https:&#x2F;&#x2F;xkcd.com&#x2F;353&#x2F;) it feels. You can write some code and run it, just like that. Static typing, on the other hand, is often associated with the feeling of arbitrary restrictions. _Why does the compiler keep complaining, just let me run my code!_ So it is sometimes thought that **static typechecking runs counter to the spirit of Python**.

But **static typing remains totally optional**. Everyone is free to write Python without declaring types and free to run it without checking anything. Of course, the freedom to run code without typechecking is a lot like the freedom to ride in a car without a seatbelt. _The freedom to encounter runtime type errors, so liberating!_

No, I’m just kidding (somewhat). **Freedom really is a valuable aspect of the Python experience.** Users don’t want to be burdened with doing a bunch of paperwork before they can try something out. At the same time, some users would prefer to know about type errors before runtime, especially in already-existing Python codebases. Optional, incremental typechecking is a great way to balance freedom and correctness in Python.[1](#fn.1)

**Freedom is important in Python, get it?** We’ll come back to this later. Okay, now on to the bug. Consider this code:

&#x60;&#x60;&#x60;python
from __future__ import annotations

from random import randint

class WhatIsIt:
    def __new__(cls) -&gt; int | WhatIsIt:
        if randint(0, 1):
            return object.__new__(cls)
        else:
            return 5

def check(x: WhatIsIt) -&gt; None:
    assert isinstance(x, WhatIsIt)

x &#x3D; WhatIsIt()

check(x)
&#x60;&#x60;&#x60;

What happens when &#x60;check(x)&#x60; is called? The function asserts that its argument is an instance of &#x60;WhatIsIt&#x60;. So if variable &#x60;x&#x60; is _not_ a &#x60;WhatIsIt&#x60;, an &#x60;AssertionError&#x60; will be raised; otherwise, nothing will happen.

That variable &#x60;x&#x60; – what is it? Its value comes from the &#x60;WhatIsIt&#x60; constructor, so it must be a &#x60;WhatIsIt&#x60;, right?

Well, no. That constructor – &#x60;WhatIsIt.__new__&#x60; – usually returns an instance of &#x60;WhatIsIt&#x60;, but occasionally it returns an &#x60;int&#x60;. Notice that this is explicitly annotated in its return type: &#x60;int | WhatIsIt&#x60;.

According to its type annotations, the function &#x60;check&#x60; expects a &#x60;WhatIsIt&#x60; argument. So the call &#x60;check(x)&#x60; is a type error, since &#x60;x&#x60; could be an &#x60;int&#x60;. But Mypy doesn’t say anything about that. Instead, it raises a different warning:

&#x60;&#x60;&#x60;routeros
error: &quot;__new__&quot; must return a class instance (got &quot;int | WhatIsIt&quot;)  [misc]
&#x60;&#x60;&#x60;

It says that the &#x60;__new__&#x60; constructor “must” return a class instance. **[“Must” is a funny word](https:&#x2F;&#x2F;nickdrozd.github.io&#x2F;2020&#x2F;04&#x2F;23&#x2F;idris-interfaces.html)**, straddling the distinction between “is” and “ought”. In this case, the “is” interpretation of “must” is literally false: it just simply is not the case that a constructor must return an instance of its class. As the example here shows, a constructor very much can return something else. **So the “must” here seems to mean “ought”**, as in “&#x60;__new__&#x60; _ought_ to return a class instance”.

This is just an **opinion**. It’s a fine opinion to hold, and if a **linter** warned about this, there would be no problem. But the job of a typechecker is not to give opinions. A typechecker has just one job: analyze the types and warn about inconsistencies.

Okay, I guess Mypy is oddly opinionated about the practice of returning something other than a class instance from a class constructor. Just disable the warning then:

&#x60;&#x60;&#x60;python
class WhatIsIt:
    def __new__(cls) -&gt; int | WhatIsIt:  # type: ignore[misc]
        ...
&#x60;&#x60;&#x60;

After this change, Mypy reports: &#x60;Success: no issues found in 1 source file&#x60;. But this is a **false negative**! There is a type error sitting right there! Apparently Mypy is so committed to its **constructor-instance ideology** that it refuses to do any further typechecking, _even when the constructor is clearly and correctly annotated_. This is a **full-blown type-inference bug**, and it ought to be fixed.

There is an opposing point of view that says: _the obvious thing for a constructor to do is to return an instance, and in fact that is what is actually done in practically all cases, and doing otherwise **violates an overwhelmingly common assumption**_. But this argument itself violates an even more important tenent, namely **Pythonic freedom**.

Here is the reality of the situation: the &#x60;__new__&#x60; constructor can return anything. Regardless of what it [“should”](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;reference&#x2F;datamodel.html#object.%5F%5Fnew%5F%5F) return, Python allows for writing class constructors that can return whatever. **That is the freedom of Python, and it is exactly why the language is so great.** There is no good reason why this freedom should not be accomodated to as great an extant as possible.

## Discussion Questions

1. Have you ever written a &#x60;__new__&#x60; constructor to return something other than a class instance? Did this lead to any confusion?
2. Wait, what is &#x60;__new__&#x60;? Is that the same as &#x60;__init__&#x60;?
3. How do other languages deal with constructors returning objects of different types?
4. Python allows users to write and run code quickly. This often comes at the expense of all sorts of runtime errors. Is this actually a good trade-off?
5. Is static typing in Python a good idea?

## Footnotes

[1](#fnr.1) There is an argument against typechecking in Python that says typing is inappropriate because Python is a “scripting language”. But as far as I can tell, “scripting language” just means a language without static types. So this argument is patently circular and therefore very stupid.