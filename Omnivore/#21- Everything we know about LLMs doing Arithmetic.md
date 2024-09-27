---
id: 76c98f08-fb1a-4e21-bc28-5ebb7b200876
title: "#21: Everything we know about LLMs doing Arithmetic"
tags:
  - RSS
date_published: 2024-09-01 10:03:38
---

# #21: Everything we know about LLMs doing Arithmetic
#Omnivore

[Read on Omnivore](https://omnivore.app/me/21-everything-we-know-about-ll-ms-doing-arithmetic-191aee239d7)
[Read Original](https://loeber.substack.com/p/21-everything-we-know-about-llms)



If you’re interested in large language models, then you should care about their ability to do arithmetic. On the road to AGI, arithmetic problems provide a neat microcosm of more general multi-step reasoning problems. Here’s why:

1. Arithmetic problems are simple examples of reasoning tasks in general.
2. Arithmetic problems can be solved by simple algorithms, rules that must be consistently applied. You can arbitrarily increase the difficulty of these arithmetic problems, i.e. the number of times that a rule must be applied.
3. This means that arithmetic provides good windows into both _single-step_ and _multi-step_ (i.e. chain-of-thought) reasoning tasks. We can evaluate both individual calls to LLMs, as well as compositions of such calls.
4. State-of-the-art LLMs still struggle to do simple arithmetic problems, even while LLMs have scaled up dramatically in size and standard evaluation benchmarks.
5. Solutions are easy to evaluate.

In this article, I try to summarize everything that we know about LLMs doing arithmetic. I’ll point you to all the interesting papers that I’m aware of, and draw some observations of my own.

### 1\. The Problem

The first thing you’ll notice is that LLMs do great on short arithmetic problems, but struggle with long ones. For example, if you ask an LLM to add three two-digit numbers, it’ll do fine, but it will fail for large numbers or long sequences (e.g. adding many small numbers). I shared some experiments on this topic [in a prior blog post](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;16-notes-on-arithmetic-in-gpt-4).

[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1262x768,sao0JFDvWrIbE7aU-O0IsEFDQnaPze7f2X5Py9p3WObo&#x2F;https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff4fa83e0-4b95-465a-af45-c7429f120d83_1262x768.png)](https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff4fa83e0-4b95-465a-af45-c7429f120d83%5F1262x768.png)

These results tend to surprise people: LLMs seem smart and quite capable of abstract reasoning over complex texts. Why do they struggle with basic arithmetic? For example, in my experiments, I found that failures for large-number additions almost always occurred in the same way, with one particular digit being misplaced, usually in the thousands-place of the number. Why?

### 2\. Issues with Tokenization and Position

You have to keep in mind that LLMs do not see text the same way you do. LLMs use two key abstractions for working with text:

* **Tokenization:** input words (or numbers) are converted into _tokens_ that the LLM processes_._ For example, the number “483,647” could be converted:  
   * Into seven tokens &#x60;[“4”, “8”, “3”, “,” “6”, “4”, “7”]&#x60;  
   * Or into two tokens &#x60;[“483,”, “647”]&#x60;  
   * Or into three tokens &#x60;[“483”, “,364” “7”]&#x60;  
   * Or in many other ways.[1](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-1-148000474) Of course, your tokenization scheme impacts how the LLM interprets the inputs.
* **Positional Encodings:** every token is related to the ones that came before and after. This allows the LLM to maintain an understanding of how the textual statements are ordered, and the meaning inherent in their relative positions. These encodings are usually one-dimensional, representing the text like one long line.

Your intuition might suggest that tokenization and positional encoding that works well for _words_ may not work well for _math_. With words, there’s some leniency on precision — you can understand what someone means even when their writing is riddled with typos — but for arithmetic, you need to get every single character right.

Doing that can be harder than it sounds. Consider, as an oversimplified example, adding three numbers, written below in black. If you’re not allowed to rewrite the problem, then it’s tedious: following the grade-school [right-to-left algorithm for addition](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Addition#Carry), you have to figure out that positions[2](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-2-148000474) 8, 17, and 26 all correspond to each other, add those up, then add positions 7, 16, 25, etc. and then add the intermediate results. Relative to the length of the problem, this requires a lot of working memory, and it’s easy to make mistakes.

[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;349x0,sj3wcrPDEf-PTzQqpqhaSoh7cww7wXXtpMPSNZJxrVxk&#x2F;https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F30e54ac0-f1e7-4f88-a564-f4a8ccfa3034_513x615.png)](https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F30e54ac0-f1e7-4f88-a564-f4a8ccfa3034%5F513x615.png)

### 3\. Papers that Attack these Problems

Several researchers have experimented with clever ways to solve these issues. Let’s go through them!

**[Reverse That Number! Decoding Order Matters in Arithmetic Learning](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2403.05845)**

If the problem in adding long numbers is that they cannot be naively added left-to-right the way you read them, but rather have to be _aligned right_ to add the digits column-by-column, then why don’t you teach the LLM to reverse the digits and then add them left-to-right? This technique works well, improving on state-of-the-art accuracy by about 11%.

**[Tokenization Counts: the Impact of Tokenization on Arithmetic in Frontier LLMs](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2402.14903)**

Instead of reversing the numbers, you can also adjust the tokenizer.[3](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-3-148000474) In this paper, the authors enforce commas to tokenize long numbers more reliably, and run the tokenization process from right-to-left rather than left-to-right. This performs much better: by contrast, left-to-right tokenization yielded systematic errors in certain digit positions. The authors improve on state-of-the-art accuracy by about 14%.[4](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-4-148000474) 

**[Positional Description Matters for Transformers Arithmetic](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2311.14737)**

In this paper, the authors find several results:

1. They asked whether transformers _trained on arithmetic tasks in isolation_ could transfer this knowledge to arithmetic embedded in natural language. They found that just training on isolated arithmetic data isn&#39;t enough.
2. They changed how addition tasks were represented, e.g. by adding spaces randomly between digits. They found that this helped models better generalize to adding longer numbers than what it had seen during training.
3. They found that padding all numbers to the same length with leading zeroes, and using a reversed-digit approach (similar to other authors), would improve performance on multiplication tasks.
4. They found that **introducing random noise to the positional encodings**helped the model avoid overfitting to specific positions, and instead encouraged the model to learn more generalizable patterns. To me, this is the key result of the paper, though they don’t specify what percentage improvement this provides over the state-of-the-art.

Combining these techniques, they achieved **100% accuracy** for multiplication tasks of 12-digit numbers, and **99% accuracy** for 15-digit multiplication. This was a dramatic improvement over the baseline, which is roughly 0% after 5-digit multiplication.

**[Transformers Can Do Arithmetic with the Right Embeddings](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2405.17399)**

In this paper, the authors replace the positional encodings altogether. Instead, they attach a _positional embedding_[5](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-5-148000474) to each token, which tells the LLM the position of each digit relative to the start of the number. Using these so-called “**Abacus Embeddings**” delivered another **colossal improvement over the state-of-the-art**: when trained on adding 20-digit numbers and then tested on adding 100-digit numbers, they achieved 97.9% accuracy whereas prior models were in the 20-30% range.

Some additional tweaks — Input Injection[6](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-6-148000474) and Looped Transformer Layers[7](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-7-148000474) — added further improvements, **raising the accuracy up to 99.1%**.

### 4\. Other Useful Work

We’ve seen that architectural tweaks can significant improve LLM performance for addition. There are more texts that can help us understand the underlying dynamics.

**[Teaching Arithmetic to Small Transformers](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2307.03381)** 

This paper stands out to me for two observations:

1. When teaching addition to their their transformer, they observe a “phase transition” from poor performance to nearly perfect performance. Unlike many other cases in machine learning, the model isn’t gradually improving. It accumulates information until it reaches a critical point at which it suddenly understands the underlying rule.  
[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;476x0,sf43TSuaYtqSH8_hiqWC0DCrqlmacVIAFXStGvLSMF9M&#x2F;https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F02978d73-b2a5-4f91-92a9-83d24caa0983_1318x984.png)](https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F02978d73-b2a5-4f91-92a9-83d24caa0983%5F1318x984.png)
2. The authors suggest that the “phase transition” occurs because addition can be represented as low-rank [matrix completion](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Matrix%5Fcompletion). Matrix completion has a similarly sharp threshold, where if you haven’t seen enough examples, it’s very hard to correctly complete such matrices, but once you’ve seen enough, you can complete them almost perfectly. The authors suggest that both addition and matrix completion have a sharp transition in capability after seeing similar amounts of training data. The authors conclude that this must be the same dynamic.

**[Shin Boson’s Twitter Thread](https:&#x2F;&#x2F;x.com&#x2F;shinboson&#x2F;status&#x2F;1792420144511431099)**

This is not a paper, but a Twitter thread where Shin investigates how LLMs multiply, reaching some of the same observations as the other papers above, with some neat illustrations. He makes two additional observations: 

1. The fact that LLMs represent positional encodings one-dimensionally is a limitation, since we usually view mathematical text in two dimensions. Consider the example from earlier, where we added three numbers, and see how much easier it is to run the same operation when we rewrite it in two dimensions:  
[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;357x0,s7T4Jr3PBfAL8kUg8CDIi81Qrqg6Rrh_apWG5FoiXZIo&#x2F;https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F540aa6a9-d264-4826-8e07-e49fa7bac9a5_513x412.png)](https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F540aa6a9-d264-4826-8e07-e49fa7bac9a5%5F513x412.png)  
I suspect there are certain types of math problems where the relevant positions are not just what’s to the left or right of a given token, but also what’s above or below. Linear algebra problems involving matrices seem like a good example. For these problems, I wonder if two-dimensional positional encodings could help. Two-dimensional positional encodings would be much closer to how humans see the world, anyway.
2. He ascribed the failure-states of LLMs to an extremely short working memory, which is worth digging into further. There’s an interesting open question as to whether LLMs suffer from:  
   1. Not having enough working memory to store and transform intermediate results — for example, “carrying” in addition, or adding up intermediate sums for multiplication;[8](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-8-148000474)  
   2. Not being able to apply enough attention to every token in the sequence, thereby losing some information that then causes arithmetic error. (There’s a related paper, _Working Memory Capacity of ChatGPT,_ that’s not hugely informative, but I’ll cover it in the Appendix.)

## 5\. Conclusion

Over the last two years, many people have claimed that LLMs can’t do math. I’ve seen some folks even suggest that this is a limitation of the transformer architecture; that it can’t learn to generalize arithmetic operations. This seems false. 

Run-of-the-mill LLMs appear hobbled in their arithmetic accuracy due to how they implement tokenization and positional encodings. We’ve seen several approaches that adjust those, and then deliver near-perfect accuracy. In particular, Abacus Embeddings seem to generalize well, and I am very curious how far their length generalization goes. An LLM should be able to learn the addition rule with limited data — could we train a model on adding 10-digit numbers and then have it accurately add 10,000-digit numbers?

Going further, the key open question is whether an LLM can learn arithmetic _perfectly_. LLMs deliberately use some randomness: in spite of this, is it possible to train them to execute arithmetic computations deterministically? Going even further, would it be possible to formally prove _correctness_ of such networks in the same way that programs can be [provably correct](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Correctness%5F%28computer%5Fscience%29)?[9](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-9-148000474) Such a bridging between deterministic and non-deterministic behavior would be not only be extremely interesting, but would powerfully extend the capabilities of such neural nets.

I’ll leave you with a few more questions that are on my mind:

1. Are there benefits to using two-dimensional positional encodings? Not just for arithmetic problems, but very generally. Naively, I think two-dimensional positional encodings are more representative of how humans view the world.
2. To what extent is dilution of self-attention a fundamental limitation of transformer architectures, and can it be overcome?[10](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-10-148000474)
3. The examples of length generalization in these papers have been very modest. Nobody’s tried to add numbers with 100,000 digits. Are further architectural changes needed to scale? It’s not clear from the research specifically _how_[11](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-11-148000474)these nets are handlingintermediate computation: e.g. adding numbers requires some “carrying” from one place to the next, multiplying numbers requires adding intermediate computational results. How does this scale? I thought the use of looped layers in the Abacus Embeddings paper was interesting, and wonder if recurrent techniques[12](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-12-148000474) could help scale these nets to arbitrary input lengths.

### Appendix 1: Other Papers

Below are some other papers that I’ve read and that you might consider part of the literature. I haven’t listed them in the sections above because their findings are more tangential to this discussion; most of them are about limitations that now appear at least partially overturned. (They do remain relevant insofar as many questions remain about limitations for larger scales of inputs.)

**[Relating the Seemingly Unrelated: Principled Understanding of Generalization for Generative Models in Arithmetic Reasoning Tasks](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2407.17963)**

The authors assert that other papers have focused too much on architecture (e.g. positional encoding) and not enough on the fundamental difficulties of doing arithmetic. They describe a number of properties that make arithmetic tricky, focusing on multiplication and modular arithmetic. However, at least for multiplication, these difficulties are probably overstated, since architectural solutions in some of the papers above brought multiplication tasks to near-perfect accuracy.

**[Faith and Fate: Limits of Transformers on Compositionality](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2305.18654)**

The authors suggest that LLMs struggle with arithmetic because they memorize simple patterns, rather than truly learning the rules of arithmetic: they claim that transformers _fail to generalize_ these patterns. Errors in reasoning compound as problems become more complex. This may all be true for naive LLM approaches, but the papers above have shown that LLMs can, with architectural tweaks, actually generalize these patterns to a much more significant extent.

**[Transformers Can Achieve Length Generalization But Not Robustly](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2402.09371)**

Similar to the _Faith and Fate_ paper, this one focuses on limitations. They observe a number of issues with getting transformers to generalize learned patterns beyond \~2.5x the input length. However, this paper similarly looks overturned, e.g. Abacus Embeddings were able to generalize well beyond this suggested limitation.

**[What Algorithms can Transformers Learn? A Study in Length Generalization](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2310.16028)**

This paper studies what algorithms transformers can learn and generalize, i.e. perform on inputs longer than what they’re trained on. To that effect, the paper introduces a domain-specific programming language, **RASP-L**, which contains operations designed to mimic those that are natural to transformers, e.g. creating attention matrices and applying them to sequences of tokens. 

The central idea is that if a problem or operation can be expressed as a RASP-L program, then a transformer is more likely to learn and generalize the underlying pattern effectively. However, the authors found it difficult to express arithmetic operations in RASP-L. 

**[Working Memory Capacity of ChatGPT: An Empirical Study](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2305.03731)**

After all, why is it that LLMs are so good at short arithmetic problems and then get confused when the problems get long? Surely the difficulty isn’t just in “carrying the 1s”? This paper runs memory tests ([n-backs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;N-back)) with ChatGPT. The “memory test” is a loose analogy here since ChatGPT doesn’t really have _memory_ but rather the user is supplying longer prompts of historical context on each iteration.

In any event, the experiments found that ChatGPT struggled with tasks beyond n&#x3D;3, similar to humans. The paper posits that LLMs struggle to maintain context over long input sequences, specifically because self-attention is computationally expensive to maintain. As the sequence gets longer, the self-attention is spread thinner across it: each token gets less focused attention on average, effectively causing the model to lose track of certain tokens.

### Appendix 2: Chain-of-Thought Reasoning

If you want LLMs to do arithmetic, then you may consider chain-of-thought reasoning to sidestep the length generalization issues. 

I haven’t yet covered this because I don’t think it’s interesting anymore: the technique is well-understood. Of course you’ll get better performance from an LLM when trying to do arbitarily complex tasks if you break them down into tiny sub-tasks and then solve them one by one. (You could go one step further and just have the LLM call a Python console…) I’m interested in whether an LLM can learn _perfectly_ an arithmetic operation.

Regardless, in the spirit of covering relevant papers, consider reading these:

* [Show your work: scratchpads for intermediate computation with language models](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2112.00114)
* [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2201.11903)
* [An Investigation of Neuron Activation as a Unified Lens to Explain Chain-of-Thought Eliciting Arithmetic Reasoning of LLMs](https:&#x2F;&#x2F;arxiv.org&#x2F;pdf&#x2F;2406.12288)

[1](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-1-148000474)

You may have noticed that the comma was being tokenized: this means that you might expect an LLM to not interpret “483,647” and “483647” the same way. The textual representation is different, and therefore the resulting tokens will also be different.

[2](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-2-148000474)

These positions are indices. Importantly, positional encodings are not indices! I’m oversimplifying here to try to supply some intuition. 

[3](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-3-148000474)

In general, the process of tokenization remains [overlooked](https:&#x2F;&#x2F;x.com&#x2F;karpathy&#x2F;status&#x2F;1789590397749957117) for improving LLMs.

[4](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-4-148000474)

They mention an improvement of _up to 20%_ over the state-of-the-art in other sections of the paper.

[5](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-5-148000474)

What’s the difference? _Positional embeddings_ are learned representations (i.e. inferred as the model runs) that explicitly encode the position of elements in a sequence, while _positional encodings_ are typically fixed patterns added to inputs to help the model understand their order.

[6](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-6-148000474)

Input Injection reintroduces the original input embeddings into each layer of the transformer model, such that positional information about the input is preserved throughout processing. Maintaining this direct connection to the original input means that the model can better handle tasks that require price positional or contextual understanding.

[7](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-7-148000474)

You may be aware that a neural network passes data through “layers” of neurons, transforming the data at each step. Looped Transformer Layers refer to a technique where instead of having multiple unique layers in sequence, a single layer (or a small set of layers) is applied repeatedly with shared parameters. This iterative application can help the model effectively perform multi-step reasoning tasks — it’s similar to applying the same reasoning step several times over.

[8](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-8-148000474)

I’m working on another experiment to answer this question, and may have a blog post coming out if the results are interesting at all.

[9](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-9-148000474)

This is a largely unsolved problem in computer science, and would be hugely ambitious to attempt.

[10](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-10-148000474)

There’s a significant amount of ongoing research on this topic, which is both fascinating and too voluminous to include here.

[11](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-11-148000474)

It would be interesting to inspect the neuron activations!

[12](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;21-everything-we-know-about-llms#footnote-anchor-12-148000474)

Note that looped layers, or recurrent techniques more generally, can conceptually bring models closer to learning deterministic operations. This is because they involve applying the same set of rules or transformations repeatedly, which mirrors the step-by-step process of deterministic algorithms.