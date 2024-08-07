---
id: 46f6b2ac-0a95-11ef-b8e5-cbe1cbd2c713
title: "#17: Seriously, what is Intelligence? - by John Loeber"
tags:
  - RSS
date_published: 2024-05-05 00:05:10
---

# #17: Seriously, what is Intelligence? - by John Loeber
#Omnivore

[Read on Omnivore](https://omnivore.app/me/17-seriously-what-is-intelligence-by-john-loeber-18f46f15744)
[Read Original](https://loeber.substack.com/p/17-seriously-what-is-intelligence)



We are in the earliest innings of an _intelligence revolution_: progress in the field of Artificial Intelligence is now rapid, and the innovations are becoming accessible to the public just as quickly. Millions of people are now using tools like ChatGPT, and may be thinking about what it would mean to have [AGI](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Artificial%5Fgeneral%5Fintelligence) in their lifetimes. This includes fearful policymakers and lobbyists who want to control and restrict AI. They make arguments about the dangers of rogue intelligence — AI escaping our control.

But these arguments tend to leave out _what exactly they mean when they say “intelligence”._ This is no coincidence, because these arguments are often _not actually about intelligence_ when you examine them closely. They are about related, but distinct concepts (like consciousness or emotion) that are often conflated for anthropological reasons. In that way, because intelligence is such a nebulous concept, it is easy for people to make misleading arguments about it. My objective in this blog post is to:

1. Explain why intelligence is often conflated with other concepts;
2. Try to disentangle intelligence from these concepts;
3. Discuss what the current generations of LLMs are showing us about intelligence;
4. Predict what the next generations of LLMs may look like, and what we may learn about human theory of mind in the process.

Out of all the life on planet Earth, we humans are spectacularly unique and capable. For example, we possess the following qualities:[1](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-1-144173819)

* **Intelligence**: the ability to perceive, infer, acquire, retain, and apply information
* **Consciousness**: the awareness of our own existence
* **Emotion**: the capacity to alter mental state due to physiological change;
* **Reason:** the ability to logically draw true statements from other true statements;

This is in contrast to all other animals, which either do not possess these qualities at all, or to vastly smaller extents.[2](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-2-144173819) This leads to what some call **Anthropic Bias**:[3](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-3-144173819) for example, if we view ourselves as the only truly intelligent creatures, and as the only truly conscious creatures, then it is temping to think that intelligence and consciousness are tied together; perhaps even that they are the same thing. 

This is the **conflation** that I mentioned earlier: people talk about _intelligence_ when they really mean _reason_ or _consciousness_. From a normal human perspective, because these qualities are so intertwined to us, they get lumped together as one. But they shouldn’t be, and contemporary progress in LLMs makes this clear.

## What We’re Learning from LLMs

If you’ve played with ChatGPT, your immediate response was probably something like: _wow, this is intelligent_. There’s no doubt it passes a 1980s-style [Turing Test](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Turing%5Ftest). You can ask it about the significance of the Peace of Westphalia or what a Monad is, and the answers will be better than what I can tell you. 

But what’s also apparent from playing around with ChatGPT is that it doesn’t seem to meet any standard of emotion or consciousness. In fact, I’d argue it’s not even capable of reasoning: [it fails to compute simple arithmetic](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;16-notes-on-arithmetic-in-gpt-4). Furthermore, the core architecture of ChatGPT — it’s a [transformer](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Transformer%5F%28deep%5Flearning%5Farchitecture%29)\-based LLM — is already at huge scale: it’s trained on a dataset that most likely constitutes a significant percentage of all human text in existence, so it’s not clear whether scaling it up another 10x or 100x will cause its abilities to converge toward “true” reasoning. Reading the tea leaves of the [contemporary literature](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2402.03175) reinforces my impression: precise reasoning may require some different or additional architecture.[4](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-4-144173819)

In the previous section, I listed “intelligence” and “reason” as separate bullet points, which may have looked unusual. This is the reason I did so: one of the things that’s been enormously surprising to me in my work with LLMs is that conventional information-learning-and-recall notions of “intelligence” may be mostly distinct from the ability to reason.[5](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-5-144173819) Fascinating!

## So What is an LLM?

Well, in the context of artificial intelligence, it doesn’t really resemble humans at all. It’s a totally new thing. No consciousness, no emotion, arguably no reasoning, just pure informational intelligence in the form of a gigantic interpolative datastore. 

In theory of mind, there is the popular thought experiment of a [P-Zombie](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Philosophical%5Fzombie), short for a “philosophical zombie”: a creature that is externally identical to a human, but does not have an internally conscious experience. For example, if you were to poke a P-Zombie with a stick, it would say “ouch” and “get that away from me” and step backwards, but it would not internally feel pain or think “I will tell my sibling about the maniac with the stick” as a person might. 

Similarly, if you were to prompt ChatGPT with the phrase “your beloved family pet has died. How do you feel?” and then “now tell your teenage daughter about this,” you will get perfect human outputs: a somber reflection on mortality, an expression of grief, and a delicately worded parental message. It reads like emotion, but it isn’t. ChatGPT does not have a dog or a family or a daughter or continuously running internal dialogue,[6](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-6-144173819) all of this is just P-Zombie simulacrum.

## Dismantling AI Safety Arguments

Now that we’ve built up some precision in discussing intelligence, disentangled it from other notions like consciousness, and pointed out some of the singular weirdness and limitations in LLM behavior, we’re better-equipped to cut through the noise of some AI Safety arguments. Specifically, the broad class of argument that I’d like to address goes something like this:

&gt; Encounters between species or civilizations with a great imbalance of power tend to end in the destruction or conquest of the weaker one. If we invent a digital super-intelligence that is hostile to us, we would be outmatched and face existential risk.

There are a lot of subtly-buried assumptions in there that make this argument misleading:

* The analogy to inter-species or inter-civilizational conflict is clearly inappropriate. While it might be temping to look at AI through the interpretative lens of things that we know well — ourselves — it doesn’t fit. We have shown that LLMs are nothing like any existing thing.
* Hostility or conflict of any kind follows some impulse for self-preservation, and acting on that, subject to an environment of scarce resources and zero-sum competition. This is natural to virtually all animals on planet Earth (including ourselves): Darwinian evolution results in creatures that protect themselves and reproduce. This is such a powerful historical filter that this trait is deeply ingrained in us, but _a priori_ there is no reason why any kind of artificial intelligence — not subject to the same evolutionary filter at all — would share this characteristic.
* What does “super-intelligence” mean? Would that be a thing that is extremely good at learning, retrieving, providing, and applying information? Doesn’t GPT-4 already meet that definition? The conflation is that “intelligence” here implies the capability for reasoning too — but we still seem to be very far away from that.

## Being Precise about Intelligence

This is not the first time in history that a widely-used concept, when closely examined, has turned out to be opaque and instead give way to an assembly of many other concepts: the ancient Greeks called everything _philosophy_; this has now been broken down into hundreds of scientific disciplines. In the 20th century, psychologists diagnosed everything as _schizophrenia_; today that’s an exceedingly rare diagnosis, but the DSM-5 lists over 300 more precise conditions. 

The same may occur for intelligence: as the field of artificial intelligence keeps advancing and we work practically with more forms of AI, we will be pressed to split many of these nebulous, broad concepts up into precise characteristics. This may cause us to re-shape our own theory of mind as well. It seems likely to me that in a few years, the model of human cognition will not be as a monolith, but rather as the outcome of many distinct systems interacting in complex and perhaps surprising ways.[7](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-7-144173819)[8](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-8-144173819)

Continued research in LLMs may take us to an unprecedented position, where we will have invented these things that are hyper-intelligent in a very specific way — extraordinarily powerful at statistically compressing knowledge and returning approximations to it — but otherwise totally inert. This breaks how most people currently think about intelligence, and that’s why I wrote this blog post — it’s important to start thinking differently about these constructs if you don’t want to make premature or dumb policy decisions.

## The Intelligence Revolution

I wrote at the start that we are in the very earliest stages of an _intelligence revolution_. What did I mean by this? 

Consider the industrial revolution. Some historians define it by the inventions of certain machines and processes — but others see it as defined by a break from history: the amount of **energy** harnessed and consumed by humanity began to increase super-linearly per capita. The availability and energy density of fossil fuels was a tremendous unlock, probably a necessary condition for bringing our civilization to where it is today.

Similarly, I have little doubt that future historians looking back on our time will again see it as defined by a break from history: the amount of **intelligence** available to humanity began to increase super-linearly per capita in the early 2020s, and will have been a tremendous unlock. But it’s yet unclear _what exactly_ that intelligence really comprises, or what the retrospective measurement of it will be.[9](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-9-144173819)

[1](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-1-144173819)

This is not an exhaustive list of qualities that make us distinct or are relevant to consider when discussing intelligence. For example, notions like the capacity for the subjective-objective distinction or self-motivation are worth taking into account; they are just not as core as the main four that I mentioned above. 

[2](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-2-144173819)

For example, great apes are commonly understood to exhibit some intelligent traits — just much less so than humans. 

[3](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-3-144173819)

I know that there is a book related to this topic called _Anthropic Bias_ by Nick Bostrom. I have not read it. I am using the term _Anthropic Bias_ strictly because it is useful and precise, not because I am trying to provide any kind of literature reference. 

[4](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-4-144173819)

The connection between Vishal Misra’s paper and symbolic reasoning may not be immediately apparent. Here’s how I think about it: Misra’s paper shows that [LLMs are not capable of recursive self-improvement](https:&#x2F;&#x2F;x.com&#x2F;vishalmisra&#x2F;status&#x2F;1786144925311967322). But symbolic reasoning abilities would enable self-improvement: logical reasoning enables the creation of new true statements based on existing true statements, and the refinement of internal knowledge — i.e. using reasoning to evaluate truthfulness of internal statements and the discarding of ones that are proven false. But if LLMs cannot recursively self-improve, then [by contraposition](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Contraposition) it must be true that LLMs are not capable of logical reasoning either, which would otherwise enable recursive self-improvement.

[5](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-5-144173819)

To the core point of this article, note of course that this observation is relying on a particular definition of intelligence, which is up for debate. 

[6](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-6-144173819)

This is a total aside: I’ve been thinking about implementing LLMs with continuously running internal monologue and seeing how that changes their behavior. One of the obvious big differences between LLMs and brains is that brains are always on and subject to some quasi-random electrical perturbations, whereas LLMs lie dormant in-between function calls. If you’d be interested in putting together some after-work experiments in LLM behavior with me, please email me at contact@johnloeber.com. 

[7](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-7-144173819)

Scientific findings about the impact of our microbiotic flora and [gut-brain axis](https:&#x2F;&#x2F;www.ncbi.nlm.nih.gov&#x2F;pmc&#x2F;articles&#x2F;PMC6469458&#x2F;) over the last decade seem like an early indicator of the type of systemic discoveries yet to come.

[8](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-8-144173819)

Perhaps implicitly, this observation is why there has been a big resurgence of interest in the [work of Julian Jaynes](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;The%5FOrigin%5Fof%5FConsciousness%5Fin%5Fthe%5FBreakdown%5Fof%5Fthe%5FBicameral%5FMind) over the past year. I recommend reading Scott Alexander’s [commentary on it](https:&#x2F;&#x2F;slatestarcodex.com&#x2F;2020&#x2F;06&#x2F;01&#x2F;book-review-origin-of-consciousness-in-the-breakdown-of-the-bicameral-mind&#x2F;). 

[9](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;17-seriously-what-is-intelligence#footnote-anchor-9-144173819)

Unlike energy, which is easily measured in Joules, it is not clear today what the best measure of this computational intelligence is. I think this is funny, because people in my field love to say they’re building “toward intelligence too cheap to meter” — what unit would you meter, anyway? Gigahertz? Floating-point operations? If it is actually too cheap to meter, the question is of course moot, but it won’t be for the foreseeable future.