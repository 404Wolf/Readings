---
id: 4da14721-d44f-4c07-9686-94030a367bd9
---

# Google Readability Practices
#Omnivore

[Read on Omnivore](https://omnivore.app/me/readability-google-s-temple-to-engineering-excellence-189f605ccc6)
[Read Original](https://www.moderndescartes.com/essays/readability)


 Tagged: [software\_engineering](https:&#x2F;&#x2F;www.moderndescartes.com&#x2F;essays&#x2F;tags&#x2F;software%5Fengineering)

_Obligatory disclaimer: all opinions are mine and not of my employer_ 

---

When reflecting on my six years at Google, its readability process stands out as unique within the tech landscape.

As a readability mentor, I’ve reviewed roughly \~100,000 lines of Python code at Google, written by hundreds of different authors. In doing this, I am one of thousands at Google who collectively have shepherded hundreds of thousands of Googlers through the readability process. The sheer scale of this program has shaped the entire tech industry’s conception of “idiomatic Python&#x2F;Java&#x2F;C++&#x2F;Go”.

I want to discuss what readability is, how it affects Googlers (myself and others), its cultural significance within Google, and whether it makes sense to recreate it outside of Google’s walls.

## Readability at Google

At Google, every change is required to have one approval from a maintainer of that corner of the codebase. Most companies do this - nothing strange here. However, uniquely to Google, every change is _also_ required to have one approval from somebody who “has readability”. Having readability means that you know the language’s ins and outs, design patterns, ecosystem of libraries, and idiomatic usage at Google, and are thereby trusted to catch any issues in language usage. The readability requirement is satisfied if either the author or any reviewer has readability. I would estimate that about a third to a half of Googlers have readability in their primary work language.

To get readability, you submit code you’ve written, and a readability mentor is randomly drawn from a pool to review your code. You are encouraged to read and follow the relevant style guides to avoid trivial back-and-forth. After writing enough “good” code in that language, you are granted readability.

You can learn more about Readability in the [SWE Book](https:&#x2F;&#x2F;abseil.io&#x2F;resources&#x2F;swe-book&#x2F;html&#x2F;ch03.html#readability%5Fstandardized%5Fmentorship%5Fthr)

## Readability’s impact on individual Googlers

To many Nooglers, Readability’s enshrinement at the very core of the code submission mechanism seems like unnecessary bureaucracy. To many veteran Googlers, readability _still_ seems like unnecessary bureaucracy. You can choose not to get readability (totally allowed!), but if too few people on your team have readability, then the team’s work can grind to a crawl when those reviewers go on vacation. Googlers undertaking their readability pilgrimage will statistically encounter that one readability reviewer who takes pride in their prowess as a human code linter, or has a vendetta against some language feature. These are just some of the many valid reasons to dislike readability at Google.

Still, for every person who dislikes the readability process, there are many others who have been helped. Many of my coworkers have greatly benefitted from making the readability pilgrimage, and I hope that the hundreds of diffs I’ve reviewed have improved the codebase at Google. Readability’s systematic influence on the Google codebase also leads to a more consistent baseline level of code quality, relative to other companies of a similar size.

### Readability and Me

My own readability pilgrimage was rough. Early on, I made the mistake of submitting a minor improvement to a former intern’s research code for readability progress. The assigned reviewer tore the entire file apart, not just the changes I’d made! That was an unpleasant and major unanticipated scope creep, and from what I learned later as a readability mentor, that negative review probably set me back 5-10 diffs’ of readability progress. Frankly, that early review was a total waste of both our time, and probably cost Google $5,000 in lost productivity if you also account for the additional unnecessary readability reviews I had to undergo.

Later, as a readability mentor, I got to enjoy reading regular rants on the mentor-private mailing list about various language features. My work on AutoGraph’s AST compiler magic got a special callout, which I’m actually quite proud of :trollface: (For the record: I was the one person on the team who tried very hard to product manage the scope of AutoGraph’s magic to the smallest useful set of composable transformations. I am quite aware of the usability dangers of magic language features!) So I definitely got to see all of the ugliness that the readability process was capable of generating.

Still, I thought that readability, done right, was valuable, and signed up to be a mentor. At first, it took me well over an hour per diff reviewed - a glacial pace of one line of code per minute! It is difficult to read a random diff from a codebase you’ve never seen before, whose conventions you are unfamiliar with, from a workstream you’ve never heard of, where the local maintainer has already worked with the author to bring the code to an acceptable bar of quality - and try to contribute something useful to the review.

I could have taken the easy way out by picking at nits that the linter missed. But to me, readability mentorship meant Engineering Excellence, broadly interpreted. Beyond just style and testing, I commented on code architecture, maintainability, library usage, systems design, build-or-buy decisions, and much more. Having experienced the unexpected scope creep review myself, I knew that I should not ask for the author to rewrite their entire codebase. I had a patience budget I was allotted for each review, and I tried to use it as wisely as I could.

Several months into my service as a readability mentor, I found that I could review code 10 times faster than when I first started. I could understand, within minutes, the change’s intent, the context of why the surrounding codebase might look the way it did, and sometimes even the author’s career history. (e.g. “You seem to come from a Java background. This visitor design pattern is more concisely expressed in Python using custom tree iterators.”) I’ve become a measurably 10x engineer, at least in this one specific ability to review code.

## Readability’s cultural significance

Readability is just the tip of the Google culture iceberg. In the early days, Craig Silverstein, employee #1 at Google, would [carefully and thoroughly review](https:&#x2F;&#x2F;abseil.io&#x2F;resources&#x2F;swe-book&#x2F;html&#x2F;ch03.html#readability%5Fstandardized%5Fmentorship%5Fthr:~:text&#x3D;In%20Google%E2%80%99s%20early%20days%2C%20Craig%20Silverstein) every new hire’s first CL for best practices and uniform style. I don’t know if Craig anticipated what readability would become, but it’s safe to say that he and other early Googlers understood the multiplicative returns of consistent code style, engineer fungibility, excellent tooling and centralized systems on programmer productivity.

Today, Google boasts a unified build system, monorepo, bug tracker, containerization system, database systems, big data systems, protobufs, and more. Many secondary systems work their magic, like the ability to [manage refactoring diffs spanning millions of lines of code](https:&#x2F;&#x2F;abseil.io&#x2F;resources&#x2F;swe-book&#x2F;html&#x2F;ch22.html) across many files, and the ability to [detect and automate deletion of dead code](https:&#x2F;&#x2F;testing.googleblog.com&#x2F;2023&#x2F;04&#x2F;sensenmann-code-deletion-at-scale.html).

Google’s core technical thesis is that global conformity’s benefits outweigh local inefficiencies. This engineering-centric culture probably chases away many product-minded, entrepreneurial, and exploratory types, to its detriment. In the Research org, I saw researchers who chafed at readability and only tolerated Google systems to the extent that it got them TPU compute time. On the positive side, Google attracts the world’s best engineers, and it delivers technically superior results, even as management pulls boneheaded product moves.

If you accept Google’s core thesis, readability is merely the scaling mechanism and melting pot by which global conformity is accomplished. I vividly remember one readability review for some thorny AutoGraph-laden TensorFlow 2 code written by an engineer in a random not-researchy part of Google. There were probably only 10 people in the world besides myself who could have properly reviewed this code, and it happened to land in my queue. I’m certain that among the readability mentors, there are many other domain experts who distribute their expertise throughout Google. The only other Google-wide melting pots I can think of are code search and LLM-driven codegen tools, but these don’t have the human touch that readability brings.

## Should your company implement Readability?

The criteria of readability at Google are

1. consensus on a bar for readability
2. a process for mentoring engineers until they qualify for readability.
3. programmatic enforcement that every change should be authored or reviewed by someone with readability.

The first two criteria are uncontroversial. Many companies have style guides, and many companies have a single-language codebase with no room for cultural drift. Many companies also have a tacit expectation that senior engineers will review junior engineers’ code until they can be trusted to review each other’s code.

Criterion (3) is the most difficult to implement, both technically and organizationally. GitHub has a protected branches feature, but it doesn’t have any way to add concepts like “Python readability”, and I don’t think GitHub is in any rush to implement readability. Organizationally, the programmatic enforcement is what causes the most grumbling, and I could easily see a VP undermining readability by declaring their upcoming product launch is more important than enforcing readability.

What benefit would be worth putting a roadblock into the gameplay loop of an engineer’s workflow? A safety-critical project, perhaps? Alternatively, maybe you would like to replicate Google’s engineering culture.

I personally disagree that Google’s global consistency outweighed local inefficiencies. Apple and Amazon have a reputation for having a very distinct working experience depending on where you land within the company, and this is supposed to be bad. Yet, this also means that teams can move quickly and without consulting the rest of the company. Google felt like death by a thousand cuts; the larger Google got, the stronger the pressures to use monolithic products and processes that were not adaptable to every possible use case. I saw one particular story play out repeatedly: “We never launched or demoed our research project because our only deployment option was to go through all the privacy&#x2F;regulatory&#x2F;legal&#x2F;PR&#x2F;Pubapprove signoff processes and spend several months figuring out the TensorFlow serving stack.” Ultimately, I believe it’s better to shard the company into smaller, more agile divisions with distinct subcultures adapted to the needs at hand.

So, my answer is that no, companies should not implement Google’s version of readability. This should be unsurprising; with how many Xooglers are floating around, we would see more readability outside of Google if it actually made sense. Simultaneously, Google’s culture has too much momentum at this point; it should preserve the readability process and embrace the types of products and problems that its engineering-centric culture is best suited to.

### Readability Lite

A [summer math program](https:&#x2F;&#x2F;promys.org&#x2F;) I attended in high school had a phrase: “Prove or disprove and salvage if possible”. Having disproven readability, I would like to salvage it by proposing “Readability Lite”, which consists of:

1. consensus on a bar for readability
2. a process for mentoring engineers until they qualify for readability.
3. a non-blocking mechanism to encourage people to get readability.

This variant salvages the mentorship program while hopefully eliminating most of the grumbling. It differs from informal mentorship because it creates opportunities to learn from engineers across the company, not just within your own team, and it creates an organizational expectation that engineers can and should strive to master their craft.

For (1), I would suggest the bar should include an understanding of the memory model of the language; awareness if not a solid grasp of language solutions to typical tasks (servers&#x2F;clients, serialization&#x2F;deserialization, regex, metaprogramming, arrays, time, I&#x2F;O, logging, performance measurement&#x2F;debugging&#x2F;optimization), understanding of the nuances of dependency management, good testing practices (including how to architect for easy testability), and some understanding of why the company’s technical choices suits the company’s technical&#x2F;product requirements. Not all “typical tasks” will be applicable to every company; pick and choose as appropriate! For (2), you would want to find and incentivize senior&#x2F;staff+ engineers who want to mentor others, possibly through some sort of citizenship expectation in performance evaluations. For (3), I think the simplest solution is to make readability a requirement for promotion to senior engineer. \[cue flamewar on whether my bar is too high or too low for “senior” engineers\]

Implementation-wise, it’s best to start early. It’s difficult to bootstrap readability past, say, 100 engineers, because you’d need to get &gt;20 senior engineers to agree on a bar for readability. If you assume a quarter of the company has readability (1:3 senior:junior ratio), that the company is growing at 20% YoY (+25% new hires -5% attrition), then \~6% of the company’s engineers will need readability every year. Assuming one readability mentor can mentor 3-5 or so people to readability every year, 1-2% of all engineers, or about 5-10% of senior engineers need to be readability mentors.

## Conclusion

I learned a great deal, both on the receiving and giving end of Google’s readability process, and I’m really grateful that Google invested so much in growing its engineering talent. I understand why nobody else would want to implement Google’s readability, but I would love to see more Readability Lite in the world. Please let me know if you try this out at your company and how it turns out.

---