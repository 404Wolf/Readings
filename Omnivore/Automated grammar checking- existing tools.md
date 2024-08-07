---
id: 63e932dc-13e1-4dbd-a8c6-ebfee7a5d73f
title: "Automated grammar checking: existing tools"
tags:
  - RSS
date_published: 2024-06-14 19:07:36
---

# Automated grammar checking: existing tools
#Omnivore

[Read on Omnivore](https://omnivore.app/me/automated-grammar-checking-existing-tools-190193faf9c)
[Read Original](https://iafisher.com/blog/2024/06/grammar-checking-existing-tools)



[My last post](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2024&#x2F;05&#x2F;proposal-english-typechecker) proposed a command-line program to automatically check that a written text is grammatically correct – in software engineering terms, a &quot;type-checker&quot; for English prose. I further proposed that such a program should be _rule-based_ rather than statistical.

Before embarking on writing such a program myself, I tried out the grammar checkers that already exist. These are my findings. The one-sentence summary is that I could not find an existing tool that meets my requirements. For the details, read on.

## Test sentences

I used four ungrammatical sentences to test existing tools:

1. One thing I am enthusiastic about tutoring.  
   * Missing &#39;is&#39; after &#39;about&#39;
2. A one-on-one session is some of the best ways to help.  
   * &#39;some of&#39; should be &#39;one of&#39;
3. Rust has excellent support for co-routines, which we are being actively developing.  
   * &#39;we are being&#39; should be &#39;we are&#39;
4. We chose this particular algorithms since it is both work-conserving and has a special mechanism for low-latency wake-up of a domain when it receives an event.  
   * &#39;algorithms&#39; should be &#39;algorithm&#39;

I either made these typos myself, or spotted them in published text.

#1 is potentially tricky to catch because the substring on its own (&quot;I am enthusiastic about tutoring&quot;) is correct. #2 is an example of more complicated subject–object agreement. #3 and #4 are simpler mistakes (auxiliary verb agreement, &#39;this&#39; vs. &#39;these&#39;) but have some intervening words which could confuse simplistic checkers. #3 is more challenging to correct because the obvious substitution, &#39;developed&#39; for &#39;developing&#39;, is incompatible with the &#39;which&#39; at the beginning of the clause.

This is far from an exhaustive test. But I do think it is enough to get a rough impression of how good a grammar checker is.

## Existing tools

I ran the test sentences through 8 grammar-checking tools.

Detection:

| Tool                       | #1  | #2  | #3  | #4  |
| -------------------------- | --- | --- | --- | --- |
| Grammarly                  | yes | no  | yes | yes |
| ProWritingAid              | yes | no  | no  | no  |
| Ginger                     | no  | no  | yes | yes |
| LanguageTool (online)      | yes | yes | yes | yes |
| LanguageTool (open-source) | no  | no  | no  | no  |
| Google Docs                | no  | no  | yes | yes |
| Microsoft Word             | no  | no  | no  | yes |
| Vale                       | no  | no  | no  | no  |

Correction (left blank if it did not detect the error in the first place):

| Tool                       | #1  | #2  | #3  | #4  |
| -------------------------- | --- | --- | --- | --- |
| Grammarly                  | yes | yes | no  |     |
| ProWritingAid              | yes |     |     |     |
| Ginger                     | no  | yes |     |     |
| LanguageTool (online)      | yes | yes | yes | yes |
| LanguageTool (open-source) |     |     |     |     |
| Google Docs                | yes | yes |     |     |
| Microsoft Word             | yes |     |     |     |
| Vale                       |     |     |     |     |

[Grammarly](https:&#x2F;&#x2F;grammarly.com&#x2F;), [ProWritingAid](https:&#x2F;&#x2F;prowritingaid.com&#x2F;), [Ginger Proofreading](https:&#x2F;&#x2F;www.gingersoftware.com&#x2F;proofreading) and the online version of [LanguageTool](https:&#x2F;&#x2F;languagetool.org&#x2F;) are all proprietary commercial services, so they wouldn&#39;t work for my purposes, but I included them in the comparison anyway. The subset of LanguageTool&#39;s engine that is available as free software is listed separately. It powers [ltex-ls](https:&#x2F;&#x2F;valentjn.github.io&#x2F;ltex&#x2F;index.html) and [Gramma](https:&#x2F;&#x2F;caderek.github.io&#x2F;gramma&#x2F;). Google Docs and Microsoft Word have built-in grammar checkers. [Vale](https:&#x2F;&#x2F;vale.sh&#x2F;) is more of a style checker than a grammar checker, but it&#39;s the closest existing tool to what I envision.

I excluded a couple of JavaScript tools similar to Vale – [TextLint](https:&#x2F;&#x2F;github.com&#x2F;textlint&#x2F;textlint), [rousseau](https:&#x2F;&#x2F;github.com&#x2F;GitbookIO&#x2F;rousseau), [write-good](https:&#x2F;&#x2F;github.com&#x2F;btford&#x2F;write-good) – which were either focused on style or used simplistic regular-expression matching that is inadequate for serious grammar-checking.

Grammarly and LanguageTool&#39;s online version did the best. Unfortunately, neither the open-source version of LanguageTool nor Vale caught any of the errors.

I was a little disappointed that Microsoft Word only caught one, as it is the &quot;only publicly well-documented commercial-grade grammar-based syntax checker&quot; (Dale &amp; Viethen 2021) – that is, the same approach that I am pursuing, based on a full parse of the text rather than pattern-matching against a list of known errors, which is what LanguageTool does (Naber 2003; Mozgovoy 2011).

## Academic research

As my proposed design is a syntactic analyzer, I mainly read about computational grammars of natural languages, i.e. software that can parse sentences of natural language.

There have been several long-running _grammar engineering_ projects that aim to create broad-coverage grammars of natural languages. One of the most complete is the [English Resource Grammar](https:&#x2F;&#x2F;github.com&#x2F;delph-in&#x2F;docs&#x2F;wiki&#x2F;ErgTop) (ERG), which is based on the theoretical formalisms of Head-Driven Phrase Structure Grammar (HPSG) and Minimal Recursion Semantics. It includes a wealth of information about English in machine-readable form: 35,000 lexemes, 980 lexical types, 70 inflectional rules, and 200 syntactic rules (Flickinger 2010). It also has [an online demo](https:&#x2F;&#x2F;delph-in.github.io&#x2F;delphin-viz&#x2F;demo&#x2F;#input&#x3D;hello%20there!&amp;count&#x3D;5&amp;grammar&#x3D;erg2018-uw&amp;mrs&#x3D;true). If you try it out, you&#39;ll quickly find that its analysis is at a level of detail that is probably unnecessary for the purpose of error detection. It is also – either by design or by accident – quite permissive: it produced a result for 3 of my 4 test sentences.

The Parallel Grammar Project (ParGram) is another grammar-engineering effort based on Lexical-Functional Grammar (LFG) rather than HPSG (Butt et al 2002).

On a different note, it would be helpful to have a large set of examples of ungrammatical sentences for testing and evaluation. The [Corpus of Linguistic Acceptability](https:&#x2F;&#x2F;nyu-mll.github.io&#x2F;CoLA&#x2F;) (CoLA) is just such a collection, drawn from published linguistic papers. Many of the ungrammatical sentences are meant to illustrate or test a particular academic theory, though, so they are not very representative of mistakes that people make in real life.

## Summary

There are many existing tools but none that meets my needs. The performance of some of the commercial products, Grammarly and LanguageTool&#39;s online version in particular, was impressive. The open-source tools did not come close.

The academic research into grammar engineering could be helpful. I don&#39;t think I could incorporate the ERG wholesale into my tool, but I might be able to extract and reuse some of the linguistic information inside of it.

I may yet be dissuaded, but for now I&#39;m carrying on with my original plan: to write my own, open-source, rule-based grammar-checking tool.

As before, if you read this post and you think I&#39;m wrong, please send me an email at &#x60;&lt;my first name&gt; @ &lt;this domain name&gt;&#x60;. I&#39;d be happy to hear about it.

## Acknowledgements

Thank you to [Chris Mischaikow](https:&#x2F;&#x2F;github.com&#x2F;mischaikow) and a person who wished to remain anonymous for running my test sentences through Microsoft Word and &#x60;ltex-ls&#x60;, respectively.

## Bibliography

* Butt et al 2002: &quot;The Parallel Grammar Project&quot; by Miriam Butt, Helge Dyvik, Tracy Holloway King, Hiroshi Masuichi, and Christian Rohrer, 2002\. In _COLING-02: Grammar Engineering and Evaluation_. &lt;https:&#x2F;&#x2F;aclanthology.org&#x2F;W02-1503&#x2F;&gt;
* Dale &amp; Viethen 2021: &quot;The automated writing assistance landscape in 2021&quot; by Robert Dale and Jette Viethen, 2021\. In _Natural Language Engineering_ 27, pp. 511–518\. &lt;https:&#x2F;&#x2F;doi.org&#x2F;10.1017&#x2F;S1351324921000164&gt;
* Flickinger 2010: &quot;Accuracy vs. Robustness in Grammar Engineering&quot; by Dan Flickinger, 2010\. In _Readings in Cognitive Science: Papers in Honor of Tom Wasow_ edited by Emily M. Bender and Jennifer Arnold.
* Mozgovoy 2011: &quot;Dependency-Based Rules for Grammar Checking with LanguageTool&quot; by Maxim Mozgovoy, 2011\. In _Proceedings of the Federated Conference on Computer Science and Information Systems_, pp. 209–212\. ISBN 978-83-60810-22-4\. &lt;https:&#x2F;&#x2F;annals-csis.org&#x2F;proceedings&#x2F;2011&#x2F;pliks&#x2F;14.pdf&gt;
* Naber 2003: &quot;A Rule-Based Style and Grammar Checker&quot; by Daniel Naber, 2003\. Dissertation at Universität Bielefeld. &lt;https:&#x2F;&#x2F;www.danielnaber.de&#x2F;languagetool&#x2F;download&#x2F;style%5Fand%5Fgrammar%5Fchecker.pdf&gt;
* Omelianchuk et al 2020: &quot;GECToR -- Grammatical Error Correction: Tag, Not Rewrite&quot; by Kostiantyn Omelianchuk, Vitaliy Atrasevych, Artem Chernodub, and Oleksandr Skurzhanskyi, 2020\. &lt;https:&#x2F;&#x2F;arxiv.org&#x2F;abs&#x2F;2005.12592&gt; ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2024-06-grammar-checking-existing-tools.md).