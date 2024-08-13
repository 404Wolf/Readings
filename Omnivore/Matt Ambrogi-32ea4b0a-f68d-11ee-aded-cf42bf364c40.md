---
id: 32ea4b0a-f68d-11ee-aded-cf42bf364c40
title: Matt Ambrogi
tags:
  - RSS
date_published: 2024-04-09 10:06:55
---

# Matt Ambrogi
#Omnivore

[Read on Omnivore](https://omnivore.app/me/matt-ambrogi-18ec3a9f7d6)
[Read Original](https://www.mattambrogi.com/posts/opus-and-gpt4-summarization/)



[mattambrogi](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;) 

* [Posts](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;posts&#x2F;)
* [Projects](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;projects)
* [Notes](https:&#x2F;&#x2F;www.mattambrogi.com&#x2F;notes&#x2F;)
* [Twitter](https:&#x2F;&#x2F;twitter.com&#x2F;matt%5Fambrogi)

## Investigating Summary Quality and Evaluator Toughness in GPT-4 and Opus

**Comparing Summary Quality between GPT-4 and Claude Opus**

Which model produces better summaries, OpenAI’s GPT-4 or Claude’s Opus? I’ve seen lots of anecdotal reports one way or the other, but very little evidence. So I wanted to put the question to the test.

I ran 4 experiments on a test set of 20 documents:

* GPT-4 evaluating its own summaries
* Claude evaluating its own summaries
* GPT-4 evaluated by Opus
* Opus evaluated by GPT-4

I found no conclusive evidence that one model or the other produces higher quality summaries. The only conclusive finding was that all summaries were rated better when evaluated by GPT-4.

**Test setup**

I collected a small dataset of 20 bills from the BillSum dataset, which is a collection of US Congressional and California state bills. For each of the summarizer &#x2F; evaluator combinations above, I looped through the test set. For each bill I (1) used the summarizer to generate a summary and (2) used a version of the [G-Eval](https:&#x2F;&#x2F;arxiv.org&#x2F;abs&#x2F;2303.16634) prompt to evaluate the quality of the summary. I used almost exactly the same prompt laid out in this OpenAI cookbook: [Evaluating Summarization Tasks](https:&#x2F;&#x2F;cookbook.openai.com&#x2F;examples&#x2F;evaluation&#x2F;how%5Fto%5Feval%5Fabstractive%5Fsummarization).

I looked at:

Consistency: a measure of how well the summary content aligns with the source document.

Relevance: a measure of how well the summary does at including important and relevant content.

I then assigned a final score by averaging the results of all 20 documents in each run.

Looking at the figure above, we can see that GPT-4 evaluated both it’s own and Opus’s summaries as perfect. Summaries evaluated by Claude received slightly lower scores. Notably The delta of perfect score - actual score was almost identical on a per category basis for both runs evaluated by Claude.

**Analysis**

This suggests that Claude is possibly a more critical evaluator than GPT-4\. However, there are a variety of potential explanations.

1. Opus does a better job of noticing inconsistencies between a summary and a source doc due to perfect recall and therefor correctly assigns lower scores.
2. This prompt was designed for GPT-4 and potentially needs to be re-optimized for usage with Opus.

**Take aways**

For now, I would not confidently suggest one of these two models over the other for summarization tasks. I also looked at measures such as Fluency and Coherence and found similar, none distinguishing results. I have also run this test at different times of day and found that in respect to latency the results were again inconclusive.

Needless to say, these evaluations are far from perfect. I have however found them to be directionally useful. For example, GPT-3.5 will produce noticably worse results than either of the models used here. 

For production use cases I would suggest trying both models, assuming equal performance on Consistency and Relevance, and then evaluating based on latency in your system, adherence to your formatting requirements, and user sentiment. In other experiments I have found Opus to more frequently ignore instructions around output content, which may be a result of GPT-4’s optimization for tool usage. I believe the Claude team is actively working on this and my reports are only anecdotal, however this alone could sway model choice for a production application.

**Further work**

G-Eval uses a chain-of-thought based prompt to elicit a score from the model. The model&#39;s response can be used in two ways: (1) by simply using the number returned by the model as the score, or (2) by utilzing the log\_probs in the model response to created a weighted average. There is reason to believe the latter approach is more robust because it can help mitigate the model&#39;s tendency to consistently return the same score - such as 3 out of 5\. Using the weighted average of the log\_probs of each potential score can provide more granular insights. Unfortunately the Claude API does not support log\_probs at the moment. I tried to mitigate this by increasing the range of the score&#39;s scale from 1-5 to 1-10\. Given that GPT-4 evaluated all instances with a 10&#x2F;10, we can assume this did not work. 

**Notes**

\- Although asking LLM&#39;s to evaluate their own output may feel dubious, G-Eval was found to exceed previous state of the art approaches in alignment with human jugement.

\- Specifically, I used gpt-4-1106-preview and Claude 3 Opus, both via the provider&#39;s API&#39;s in late March 2024.