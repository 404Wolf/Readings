---
id: 43868ff2-fa9b-11ee-ac37-9b526cee2cb5
title: Noam Finkelstein - Identification of world-model parameters from internet-scale text
tags:
  - RSS
date_published: 2024-04-14 04:00:00
---

# Noam Finkelstein - Identification of world-model parameters from internet-scale text
#Omnivore

[Read on Omnivore](https://omnivore.app/me/noam-finkelstein-identification-of-world-model-parameters-from-i-18ede3d07c9)
[Read Original](https://noamf.ink/blog/posts/llm-identification/)



In statistics, and especially in causal inference, we think a lot about _parameter identification_. I’ll briefly describe what this means, and reflect a bit on how it relates to the question of what LLMs can learn from text.

## Parameter Identification[](#parameter-identification)

Causal inference can be described as the task of taking some _observed data_ and a _causal model_ of the world, and using them to infer the value of a _causal parameter_ of some kind. To take a classic example, in a clinical trial, we have observed data on patient outcomes, and a causal model that says the treatment can affect the outcome, and we’d like to infer the _effect_ of the treatment on the outcome. The treatment effect is a causal parameter, in the sense that it’s a parametric representation of some causal relationship.

The question of _identification_ is the question of whether there’s enough information in the observed data and the causal model to reasonably infer the causal parameter. In the idealized clinical trial, the average treatment effect can be taken to be the simple difference between the average outcomes in the treatment and control groups.

But when we stray from that simple ideal – for example, if patients drop out of the trial, or take a treatment other than the one they were randomly assigned to – it may no longer be possible to infer the average treamtment effect given the observed data and the causal model. In this case, we say the parameter is _not identified_.

One way to think about parameter identification is as follows. If there is only one possible value of the causal parameter that could lead to the observed data under the causal model, then the parameter is identified. We know it must take that value.

However, if there are multiple values of the parameter that could lead to the observed data under the causal model, then we don’t know which of those values the causal parameter takes. It is not identified.

I think this is useful background for thinking about what it’s possible for large language models, and large vision models, to learn about the world. There’s been a lot of ink spilled over this question; I’ll point out two views close to either end of the spectrum.

## The skeptical position[](#the-skeptical-position)

The skeptical position is that LLMs are fundamentally unable to learn about the real world in important ways. This view is well expressed in a [great paper](https:&#x2F;&#x2F;aclanthology.org&#x2F;2020.acl-main.463.pdf) by Emily Bender and Alexander Koller, two prominant NLP researchers. [This profile](https:&#x2F;&#x2F;nymag.com&#x2F;intelligencer&#x2F;article&#x2F;ai-artificial-intelligence-chatbots-emily-m-bender.html) of Emily Bender goes through many of the same arguments in a less academic form. I’m hesitant to simplify the argument by summarizing it, so I’d encourage you to read the original paper. That disclaimer aside, I’d characterize the main argument of the paper as follows. There is a fundamental disconnect between text, in the manner an LLM encounters it, and its meaning in the world. Text, as humans encounter it, is always paired with “communicative intent,” relating that text back to the real world. LLMs encounter the text on its own, with no communicative intent – no way to link the text back to the real world. As such it is unable to learn anything beyond statistical linguistic correlations between tokens.

## The optimistic position[](#the-optimistic-position)

The optimistic position is that LLMs are capable of generating “world models” from text alone. In other words, the text itself contains enough information to understand what the world must be like, and how the text relates to the world. There’s [an interesting paper](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2210.13382.pdf) that makes this argument specifically with reference to the game Othello. Using only textual sequences of Othello moves, the paper presents convincing evidence that an LLM develops an internal model of what the game Othello must be like to generate the observed sequences of moves. The LLM has learned the way the world operates, and therefore can understand and produce the communicative intent associated to each Othello move in the sequence. There are other examples of LLMs learning specific things about “how the world works,” as reflected in careful investigation of their computational processes; we’ll take the Othello example as representative.

A more extreme version of this view was articulated by Ilya Sutskever, chief scientist of OpenAI. He [says](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;kZ-e%5FWtxP64):

&gt; It may it may look on the surface that we are just learning statistical correlations in text, but it turns out that to just learn the statistical correlations in text, to compress them really well, what the neural network learns is some representation of the process that produces the text. This text is actually a projection of the world. There is a world out there and it has a projection on this text. And so what the neural network is learning is more and more aspects of the world, of people, of the human condition, their hopes, dreams, and motivations, their interactions and the situations that we are in.

This claim is along the same lines of the kinds of claims made in the Othello paper linked above, and in other settings with well-defined rules. The claim is that using text alone, the LLM is able to infer what the world must be like in substantial ways. It would follow that the LLM can connect text to meaning, grounded in the relationship of text to the world, and would therefore be capable of communicative intent.

That said, there is at the very least clear difference in degree between Sutskever’s claims and what’s been shown in the research literature. As far as I can tell, humans don’t operate according to a set of rules that can be encoded in neuronal activations. There may be a difference of type as well – the space of _possible_ states of the human world is infinite, unlike in the case of Othello.

It’s also not clear how these kinds of claims could be supported. In the case of Othello and similar games, researchers carefully track and alter neuronal activations within the LLMs to show that the LLM has developed a “mental model” of how the world works, can update its understanding appropriately, and responds as expected when researchers alter it’s mental representation of where things stand. It’s possible to find these mental models because games have states that are simple to represent, and therefore simple for researchers to search for. The othello board has a finite number of squares, and each square has only a small number of possible states. It’s therefore possible to search for neuronal activations that represent the status of each square. What would it look like to make an analogous argument that an LLM has a mental model of people’s “hopes, dreams, and motivations”?

## Identification of how the world works from text[](#identification-of-how-the-world-works-from-text)

From the causal perspective, this seems like a question about identification. The question is: what rules about how the world works are identified from text data?

We reviewed the basic idea of causal identification above. To roughly adapt the intuition behind identification to this domain, we can say that rules about how the world works are identified if no other set of rules could lead to the observed text data. I do think it would help to have a more formal notion of identification from text, borrowing ideas about “partial identification” from the causal literature as well, but I do not know what this would look like.

Let’s take another look at the Othello example. The rules of Othello are roughly identified from a large enough set of sequences of valid Othello moves. If the rules of Othello were different we would see different sequences of moves, i.e. no other set of rules could have produced the observed data. The same applies in other cases where LLMs have been shown to learn “world models,” or pieces of world models.

Importantly, in the Othello and related examples, the LLM was only given sequences of valid moves. What would have happened if there were invalid moves interspered with the valid moves? In that case, the identification question depends on factors like how often invalid moves were presented, whether there was a systematic explanation for the invalid moves, etc.

I also want to point out that the available data matters quite a bit. It’s been shown that LLMs trained on internet-scale data fail at basic tasks of logical reasoning. The internet is full of examples of invalid logical moves, for reasons of humor, sarcasm, and illogic. My strong suspicion is that an LLM trained exclusively on text representing valid reasoning would learn the rules of logic. Identification, in this case as in Othello, follows from the presence of all and only valid logical moves.

My strong intuition is that human “hopes, dreams, and motivations” are not identified from internet-level text data, for any reasonable interpretation of that phrase. These are fundamentally different kinds of concepts than those for which I think there are reasonable (or demonstrated) identification arguments. That said, I do think formalizing the identification question and the identification claim would be an interesting and illuminating exercise.

Finally, there’s the question of whether a “mental model,” as characterized by identifiable patterns of neuronal activation that map roughly to states of the world, is sufficient to overcome Bender &amp; Koller’s critique re: the disconnect between the manner it which an LLM encounters text, and the original relationship between that text and the world. One way to approach this question is to point out that there’s a long history in philosophy of questioning the space between the real world and our perception of it. At some level, this space is unbridgable even for humans, and so of course it will remain at least as unbridgable for LLMs. I don’t see any reason to think that it’s impossible for LLMs to develop a link to connect text to (identified parts of) the world from text alone, in the same way that we do the same from text and sense. Of course the nature of that connection might be different.

## On the Chinese Room thought experiment[](#on-the-chinese-room-thought-experiment)

Jonh Searle’s famous [chinese room](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Chinese%5Froom) thought experiment is about the question of whether a computer can be said to understand Chinese. The thought experiment suggests that an algorithm for producing a convincing conversation in Chinese can be executed manually by a person, given enough time. Because the person executing the algorithm would not understand Chinese, the computer executing the exact same algorithm, taking the exact same steps, would also not understand Chinese.

I like this thought experiment, but I don’t think the interpretation is straightforward. A human manually executing the set of instructions that define an LLM would be doing multiplication by hand until the end of time. They would only see the result of each multiplication as it comes up, and not hold it all “in memory” in the same way a machine does.

In some sense, I think the conclusion that the algorithm does not understand Chinese is a stretch, given the premise. A person executing an algorithm by hand is executing it very differently than a machine does, and therefore has a different experience of the execution, to the degree that it’s possible to claim they are not really doing the same thing at all. The experience of execution might matter a lot.

Think about, for example, an experienced mountaineer and a novice following exactly the same path and directions through the mountains. They’ll take all the same steps, to the level of abstraction that the steps are specified, but they’ll have very different subjective experiences of taking those steps, and likewise different understandings of their experiences. In the same way, a machine and a human could have very different subjective experiences of executing an algorithm. To say that the machine can’t have a subjective experience at all is begging the question.

The thought experiment, to me, shows that a human can’t understand Chinese in the way an LLM might understand Chinese. But it doesn’t show that an LLM can’t understand Chinese, for some reasonable definition of understanding. And actually, it doesn’t even show that an LLM can’t understand Chinese in the same way a human does (it just shows the inverse).

## Conclusion[](#conclusion)

I don’t know what it’s possible for a language model to learn. My intuition sits somewhere between the two extremes of the spectrum.

I don’t think the idea that there is a necessary disconnect between text and the true world is any more convincing than the idea that there’s a necessary disconnect between sense and the world. If facts or rules in the true world are identified from text, then an LLM can in theory reconstruct relevant parts of the world, and use that knowledge to interpret text. This seems structurally similar to the way that humans infer facts and rules about the world from our senses, and then use what we’ve inferred to interpret future inputs.

At the same time, it’s clear that grand claims about what LLMs “understand” are being made with little to back them up.

My suggestion is to develop an identification theory of what is even learnable about the world through text, under which assumptions, and so on. Unlike in the case of causal inference, I don’t think this theory would be purely mathematical, but it would have a strong mathematical component. I’ve tried to show above how such a theory might make sense of the evidence we’ve seen so far about where and how LLMs have succeeded in building “world models”. I would hope that establishing such a theory would make it easier to figure out where we should land on the spectrum between the LLM skeptics and the LLM optimists.