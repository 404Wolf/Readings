---
id: 7244ee4e-dc9e-11ee-b1b5-87fb0923eccb
title: Matt Ambrogi
tags:
  - RSS
date_published: 2024-03-07 10:06:18
---

# Matt Ambrogi
#Omnivore

[Read on Omnivore](https://omnivore.app/me/matt-ambrogi-18e19b63d3e)
[Read Original](https://www.mattambrogi.com/posts/fine-tuning/)



[mattambrogi](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;) 

* [Posts](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;posts&#x2F;)
* [Projects](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;projects)
* [Notes](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;notes&#x2F;)
* [Twitter](https:&#x2F;&#x2F;twitter.com&#x2F;matt%5Fambrogi)

## Fine Tuning LLMs

I recently spent some time fine-tuning GPT-3.5 to build [Socratune](https:&#x2F;&#x2F;socratune.up.railway.app&#x2F;). Socratune is an LLM fine tuned on a curated set of wisdom, insights, and philosophy.

I use ChatGPT extensively. But for anything personal, I find it to be too stuffy and generic. I wanted to see if I could fine tune an LLM to learn the types of insights and advice I find helpful. In doing so, I hoped to create a sort of digital mentor that would encompass insights from the stoics to modern self help books and everything in-between.

Overall I’m very bullish on fine-tuning LLMs to give them a certain personality or to bias them towards a certain way of thinking. I think this is an obvious reflection of how we interact with humans. It’s natural and preferable to have different people we go to for different things and each one of their mental model’s is slightly different. We’re already seeing this on a small scale with people preferring Claude over GPT-4 for some cases but not others. This will extend such that people switch not just between foundational models but between a variety of fine-tuned versions of them.

_“I think the unexpected thing about AI... is fine-tuning a model is just as aesthetic an art as making a beautiful landing page for your website.”_ \- Daniel Gross

Below are some notes I took during the fine tuning process:

* Fine-tuning led to a model with higher variance in quality. With ChatGPT I can be farily sure most answers will be ok, few will be outstanding, few will be very bad. With Socratune, I am sometimes shocked by how insightful it is. At other times it will produce nonsensical content.
* One very interesting insight: the model has taken up high-minded opinions on things that were not in my training set at all. This is reflective of a more general phenomena. If a set of related opinions is embedded in the final stages of training, the model will orient itself to the broader set of opinions that are in line with that way of thinking, even if not explicity mentioned. For example, my training set had nothing on productivity, but I&#39;m finding the model to give quite good advice there. We&#39;ve seen something similar with Google&#39;s Gemini 1.5 release recently where it will have funny, yet predicatably liberal opinions, such as [refusing to promote the consumption of meat](https:&#x2F;&#x2F;twitter.com&#x2F;pmarca&#x2F;status&#x2F;1761929296564588890) even to malnourished populations.
* The low quality output reminds me of output from back in the day of using GPT-3 completions as opposed to the newer chat models. This made me wonder if the fine-tuning might have effectively undone some of the instruction-tuning or RLHF. It seems there could be some precedence for this, previous research has found that fine-tuning can undo safety controls from RLHF: &lt;https:&#x2F;&#x2F;arxiv.org&#x2F;abs&#x2F;2311.05553&gt;. This could also be a symptom of overfitting to my training set and consequently not behaving as well on data that doesn’t represent it.
* Going against OpenAI’s advice, I did not include the system prompt I’m using in production in my training set. Interestingly, I found using a good system prompt still makes a huge difference in quality. Without the prompt my fine-tuned model is just ok. With it, the model becomes very good. My theory is that while the fine-tune has shown the model the details of how to form its response, the system prompt is maybe tapping into knowledge embedded in previous layers of the neural net and emphasizing the use of broader world knowledge that the model has. One reason I think this it that I found the problem of non-sensical replies to be much worse without the system prompt.
* It also seems the system prompt can make up, to an extent, for gaps in the training set. In my case I wanted Socratune to act as any good mentor would: share insights and opinions but also ask thought provoking questions when appropriate. Unfortunately, not only did I not have a representative amount of thought provoking questions in my training set, I had none. In theory the model should learn a bias towards always responding with a declarative insight then. I was able to negate this with a good system prompt.
* Like all modeling, getting a good enough version out quickly is the best approach. Now I can use Socratune myself, collect examples of particularly good or bad responses, use them to build out my training set further, and improve the model.
* I didn’t experiment too much with the hyper-parameters OpenAI offers: epochs, learning rate, and batch size. I’ll do another round of training once my training set is larger and at that point I’ll do some exploration here.