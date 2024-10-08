---
id: a3daf0d6-8b30-466d-8f4a-89c071c35e49
title: "Proposal: A type-checker for English prose"
tags:
  - RSS
date_published: 2024-05-30 12:02:05
---

# Proposal: A type-checker for English prose
#Omnivore

[Read on Omnivore](https://omnivore.app/me/proposal-a-type-checker-for-english-prose-18fca63331a)
[Read Original](https://iafisher.com/blog/2024/05/proposal-english-typechecker)



I would like to have a command-line tool that checks the _grammatical correctness_ of English-language prose. Such a tool could be run on code documentation as part of a pre-commit pipeline, on blog posts before publication, or anywhere else that the automated checking of English grammar is desirable. What I have in mind has a similar interface to [Vale](https:&#x2F;&#x2F;vale.sh&#x2F;), but while Vale is a _linter_ that catches _stylistic_ errors, I want a _type-checker_ that catches _grammatical_ errors.^\[Vale also catches some grammatical and spelling errors, but fundamentally it is a tool for matching style rules to text, not for comprehensive grammatical analysis.\]

I believe that the best way to write such a tool is using a rule-based approach – meaning that it will have pre-programmed and explicit knowledge of English grammar. Let&#39;s call this a _rules engine_.

The alternative would be a machine-learning model that classifies sentences as grammatical or ungrammatical. In 2024, machine learning is perhaps the more obvious choice, but I think a rules engine is more appropriate, for two reasons:

* _Error rate_: A type-checker must make few mistakes to be useful. If a grammar checker constantly gives spurious errors, I will simply stop using it. This is unlike other machine-learning tasks like speech processing or optical character recognition, where a reasonably low error rate is tolerable. A &quot;rules engine&quot; is really just a regular program, and bugs can be fixed by editing the code; but a machine-learning algorithm is an opaque blob of numeric parameters, and fixing individual errors may be difficult or impossible.
* _Interpretability_: The grammar checker needs to report _why_ it thinks a sentence is incorrect. A rules engine can be programmed to produce helpful error messages, but a machine-learning model&#39;s reasoning is opaque and not easily interpreted.

I&#39;m open to using statistical methods for subsystems of the grammar checker, but I suspect it will be easier to embed them within the rules engine than to retrofit formal rules onto a statistical system.

I am aware that this goes against the [orthodoxy](https:&#x2F;&#x2F;norvig.com&#x2F;chomsky.html), so let me respond preemptively to some possible objections:

_Formal rules don&#39;t work for natural-language processing; experience has shown that statistical methods are always better_. This may well turn out to be the case, but as I&#39;ve outlined above, I have good pragmatic reasons to favor my approach.

_Real natural-language prose is too flexible for a formal grammar._ First, to clarify, I&#39;m proposing to write a program, not a grammar. I&#39;m under no illusions that English can be parsed with a tidy formalism like a context-free grammar. Second, my goal is to check the grammatical correctness of (relatively) formal, written English. Colloquial speech, literary writing, dialogue etc. are out of scope. I think that this constrains the problem enough that it is realistically solvable – but it might turn out that it&#39;s impossible to thread the needle between &quot;it&#39;s too permissive and misses too many mistakes&quot; and &quot;it&#39;s too strict and disallows too many correct sentences.&quot;

_Grammaticality isn&#39;t a binary. Some sentences are &quot;borderline&quot;, or might be grammatical or not depending on context._ This is probably true, but may not be important in practice. I suspect that many borderline sentences are inappropriate in formal writing even if they are technically grammatical.

_Parsing the syntax of a natural language is computationally intractable._ Again, this might be theoretically true, but my wager is that if I approach the problem with an _engineering_ mindset rather than an _academic one_, then theoretical difficulties may prove to be surmountable.

_Full syntactic analysis requires semantic analysis._ For instance, a typo might produce a rare word that is syntactically valid but semantically nonsensical, and the only way to detect such an error would be to understand the meaning of the sentence. Cases like these are good candidates for integrating statistical methods into the rules engine.

It&#39;s possible that some or all of these objections will turn out to be valid. But the only way to know for sure is to try.

At the time of writing (May 2024), I&#39;m doing a coding retreat at [Recurse Center](https:&#x2F;&#x2F;recurse.com&#x2F;). I plan to set aside some time to work on this project, so expect more blog posts in the near future.

If you read this post and you think I&#39;m wrong, please send me an email at \\ @ \\. I&#39;d be happy to hear about it. ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2024-05-proposal-english-typechecker.md).