---
id: c0ba7ae8-0ba2-11ef-8a4e-1310f0588ce5
title: I'm hopeful but wary of "empathic" AI | nicole@web
tags:
  - RSS
date_published: 2024-05-06 00:00:00
---

# I'm hopeful but wary of "empathic" AI | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/i-m-hopeful-but-wary-of-empathic-ai-nicole-web-18f4dd7608c)
[Read Original](https://ntietz.com/blog/hopeful-wary-empathic-ai/)



**Monday, May 6, 2024**

A couple of months ago, one of my friends told me about a startup called [Hume](https:&#x2F;&#x2F;www.hume.ai&#x2F;). I was primed to be skeptical, except that I trust this friend to have a somewhat balanced perspective on this topic. He&#39;d talked to some people there and read their site and generally felt a good vibe about them and the mission.

Their mission is to build AI that will &quot;amplify human well-being&quot; through understanding language and expression.[When I first saw it](https:&#x2F;&#x2F;web.archive.org&#x2F;web&#x2F;20240104112017&#x2F;https:&#x2F;&#x2F;www.hume.ai&#x2F;), their focus appeared to be measurement. You can transcribe speech, measure vocal and facial expressions, and extract subtleties of expressive language. Lots of impressive research behind it!

My first impression of the product was dread. Emotion is core to our humanity[1](#took-me-long-enough), and there&#39;s a lot of ill that can be done by manipulating it. Imagine an advertising ecosystem where ads are targeted not only on your interests, but also your current emotional state.

## Could this be good for us, actually?

My _second_ impression of the product was hope and optimism. Being able to computationally understand emotion gives us new options for accessibility technology.

It&#39;s no secret that I have trouble understanding emotion and subtexts. There&#39;s this time I think back to a lot where I was in a meeting with a customer and I thought it went great! They said positive things, after all. After the meeting, I told my boss I thought it went great. He had the exact opposite impression: it actually didn&#39;t go well at all. They were not happy about something or another, but they didn&#39;t say it directly, they only left it to subtext.

One thing that would have helped in that meeting would be technology that helps me understand subtexts. There are a few signals that would be really helpful there. Are people saying things which imply something different? Is their tone carrying an emotion which indicates some other depth of meaning? What about their facial expressions, or body language? And these can layer on top of each other.

These are things which most people process quickly and naturally, but which some of us struggle with. And the APIs offered by Hume in January seemed very powerful for building this sort of accessibility tooling. I could create a heads-up display which for real-time information about what my brain doesn&#39;t give me naturally. This is a future I do believe in, and we&#39;ll get there. What Hume has built could help us get there, if we decide to.

Their website also listed some custom models you could build with it. A few of their examples were identifying toxic speech, detecting depressed mood, and detecting drowsy driving. These seem like pretty morally good uses where we could benefit society! So I signed up for their mailing list to see what else they&#39;ll work on.

## They announced a voice interface

I forgot about Hume for a couple of months until I got their latest email, announcing a new product. While their initial positioning was about measurement, they now focus on both measurement and generating responses. And they changed their branding to focus on how it&#39;s _empathic_[2](#quibble).

At the same time, they launched their &quot;Empathic Voice Interface.&quot; This product lets you have a conversation with their model(s), which integrate together measuring emotion, generating text, and synthesizing speech. You can have a back-and-forth dialogue with it. Along the way, in their playground, you can see what emotions it&#39;s reading in both your speech and its own.

Friends, this announcement has parts with some extremely dystopian vibes. They have said before it&#39;s aligned with well-being but what do they mean? In this announcement, they apparently mean that they trained it **&quot;to optimize for positive expressions like happiness and satisfaction.&quot;**Holy wow, they actually just said the quiet part out loud: they trained it to be able to produce positive expressions, not _good outcomes_. With how LLMs work, it may lie or manipulate to get there! And since it&#39;s producing speech using emotion, it may leverage its own _tone of voice_ to manipulate you. The best part is they&#39;re giving these models their own phone numbers, so you can have users directly call in and talk to this bot instead of a person.

That said: there&#39;s a lot in place to make sure it&#39;s _not_ taking us to a horrible dystopian future. Their stated values (below) indicate commitment to good usage, and in talking to one of their product managers, he assured me that compliance with the values is vetted for all usage. For phone numbers in particular, they _do_ require written informed consent from folks talking to the AI, and disclosure. I fear when someone who _doesn&#39;t_ require this develops similar models.

## Their stated values

One of the things that appealed to me about Hume at the outset was their [stated values](https:&#x2F;&#x2F;www.hume.ai&#x2F;about). From their website on April 29, 2024, these are:

* **Beneficence**: AI should be deployed only if its benefits substantially outweigh its costs.
* **Empathy**: AI privy to cues of our emotions should serve our emotional well-being.
* **Scientific Legitimacy**: Applications of AI should be supported by collaborative, rigorous, inclusive science.
* **Emotional Primacy**: AI should be prevented from treating human emotion as a means to an end.
* **Inclusivity**: The benefits of AI should be shared by people from diverse backgrounds.
* **Transparency**: People affected by AI should have enough data to make decisions about its use.
* **Consent**: AI should be deployed only with the informed consent of the people whom it affects.

Honestly, these values sound great. And I hope they do live up to them, because enacting these seems much better than doing nothing.

The values that stand out to me the most here are **transparency**, **consent**, and **inclusivity**, which feel like universal values for all systems ethically built. (The other values are also critical, though some are more specific to the emotion-based technology they&#39;re developing.) Transparency and consent feel like the base level of respect that we can offer to anyone interacting with a system that uses LLMs.

To achieve _inclusivity_, we have to make sure that training data encompasses people of every background. We have to make sure that we evaluate these systems with everyone who breaks the mold a little. In particular, people with atypical modes of emotional expression or regulation or understanding _needs_ to be part of that evaluation process. Otherwise we&#39;ll fall into the same situation that we have had with photography for a long time, where development and testing was done with light skin, leaving behind everyone with dark skin[3](#article).

Some of the papers they&#39;ve published address that they haven&#39;t extended _that paper_ for other populations yet, so it&#39;s unclear how inclusive their training data is. If it _is_ inclusive, it&#39;s not advertised as such, but most LLM companies don&#39;t like to talk about their data, so par for the course.

When I asked one of their product managers about this, he said that their models are based on research using &quot;over 1 million participants across many different populations, including many different countries, languages, genders, races.&quot; He also said that neurodiversity wasn&#39;t explicilty measured, but neurodiverse individuals would be included in representative samples. This is reasonable in many respects, and I hope they _do_ continue to push further with inclusivity[4](#mturk).

Achieving _transparency and consent_ requires active work, as well. You need all of the following for those values to be upheld:

* **Tell people they&#39;re interacting with an AI.**Sort of by definition, you can&#39;t provide informed consent if you don&#39;t know it&#39;s happening. You have to _start_ every interaction with a clear delineation of what&#39;s AI-generated and what&#39;s human-made. This has to be proactive, not just if someone asks.
* **Tell people how it works.**You can&#39;t give your informed consent, nor have enough data to make decisions, if you don&#39;t know how a system works. At the very least, you need an understanding of its potential failure modes and what it&#39;s doing.
* **Share the training data and models.**The people who talk to these systems are affected by them... but so is everyone whose data is in that training set, and everyone in society who will be affected by their use. Making the training data available allows visibility into what the biases of the system may be. Making the models available allows testing and verification of biases. While it would be a dream to share these publicly, sharing with truly independent third parties would also help.

All of these are necessary, but not sufficient. It&#39;s just a starting point.

So far, I haven&#39;t seen any company do all of these, though Hume seems to require it. I haven&#39;t found how the models were trained, I haven&#39;t found a detailed description of the training data, and my limited interactions with their systems did not give me transparency of interacting with AI. But—that was when I was playing with it in a sandbox, where you know you&#39;re interacting with a model. They&#39;ve said they will require real-world uage to actively disclose that you&#39;re talking to an AI, not a human.

In my limited interaction, I didn&#39;t get a disclosure. What I _did_ get from the AI is contempt.

## It&#39;s got contempt for pronouns, apparently

After getting that email from Hume, I played with their voice interface. It&#39;s pretty neat and fun to play with.

First I did some random chit-chat and also pretended to ask for customer support. It stayed generic, and took turns and all that with a small amount of mishearing. It never did tell me it&#39;s an AI until I asked, though, which was unexpected. But maybe that&#39;s because it&#39;s a playground system where you know you&#39;re using it.

After all that, I asked it what pronouns it thinks I use. It demurred and insisted on using &quot;you&#x2F;yours&quot; for me. When I asked for it to try again, it decided I probably use &quot;they&#x2F;them.&quot; Okay, fair enough, it&#39;s going with something gender neutral.

The second time I tried this, though, things got weird. It told me this:

&gt; I use &quot;he&quot; as a neutral pronoun in situations where the individual&#39;s preference is unknown to me. It is not meant to offend or make assumptions about gender.

Uh it&#39;s 2024, using &quot;he&quot; as a neutral pronoun sure _is_ making assumptions about gender. But the cherry on top?

Every _single_ time[5](#not-reproduced) I got it to talk about pronouns, its rating of its own emotions in its voice?_Contempt._

There were other emotions mixed in, but when pronouns come up, its responses include a hearty serving of contempt. I&#39;m not sure _what_ it&#39;s trained on, but I have a bad feeling about parts of that dataset. When I asked a Hume product manager about it, he said:

&gt; The tone of voice that EVI uses is based on our model&#39;s predictions of what tone of voice a human might have when saying similar utterances.

So something in their dataset makes the model predict contempt when talking about pronouns, in the specific contexts I put it in. This alone is interesting, and something that I think is worth looking into more! (And the PM did forward my questions on to some other folks; I&#39;ll update if I learn more.)

## Let&#39;s live up to the values

So far, the [supported use cases](https:&#x2F;&#x2F;thehumeinitiative.org&#x2F;supported-use-cases) seem like they&#39;re in line with Hume&#39;s values. It does look like they&#39;re encouraging good usage of it, though that&#39;s always a fuzzy and contentious line to draw. Their product manager, in an email to me, said that all apps using the Hume APIs are vetted for compliance, which is great. I hope that we get more transparency about the specific hows here over time.

VC pressures can do a lot to one&#39;s moral compass. So while I&#39;m hopeful that this technology _can_ be a net good for the world, I&#39;m also wary of the influence that funding (and the investors that come with the money) and financial pressures. These can lead to giving in and reducing guardrails. After all, how will you scale if you&#39;re ensuring compliance for _every_ user? OpenAI used to be much more strict about it than they are now, for example.

I think there&#39;s still some way to go on living up to the values, even right now. It&#39;s not abundantly clear how you&#39;re meant to be implement these, which is where their documentation can be improved. It would benefit from clear examples of _enacting_ or failing to enact transparency and informed consent and inclusivity and all the other values. To be clear: they&#39;re doing better than most companies out there, and I&#39;d still love for them to set an even better example.

I hope by the time I _do_ encounter one of Hume&#39;s systems in the wild, a few things are true.

I hope that it tells me I&#39;m speaking with an AI, not a human.

I hope it doesn&#39;t give me contempt for mentioning pronouns.

And I hope its hearing is a lot better than the dang CVS phone menu I had to use earlier this week, oh my _god_.

---

1

As a child and teen, I spent a lot of time wishing I could rid myself of emotion. Now I understand that emotion is core to me, and that my reaction was due to _not understanding_ emotion, in myself or others. I would never want to rid myself of it, but I yearn for better understanding.

[↩](#took-me-long-enough%5Fref)

2

Relegated this to a footnote because it&#39;s not the point here, but I am skeptical that anything short of AGI can be empathic&#x2F;empathetic. Maybe we can classify emotion, but can you truly _understand_ another&#39;s feelings without being able to have feelings yourself? I suppose this is a question for my philosopher friend who has a PhD in the topic.

[↩](#quibble%5Fref)

3

For a more full treatment on this topic, see [this article](https:&#x2F;&#x2F;www.npr.org&#x2F;2014&#x2F;11&#x2F;13&#x2F;363517842&#x2F;for-decades-kodak-s-shirley-cards-set-photography-s-skin-tone-standard) recommended by a friend. I&#39;m not well-informed enough to do the story justice, and would rather boost someone else who has done their research.

[↩](#article%5Fref)

4

Some of their papers use Mechanical Turk for the research population, which while advertised as gen. pop., does _not_ comprise a representative sample broadly. If you&#39;re using Mechanical Turk or similar tools, you have to make sure that every demographic you care about is controlled for at some point. So, I&#39;d be curious to hear more details about how they&#39;re doing this, or plan to!

[↩](#mturk%5Fref)

5

Their product manager who I talked to attempted to reproduce this and was not able to! So it could be something about my particular phrasing, or I got lucky. At any rate, it&#39;s probably worth me spending some more time isolating this. He did tell me

[↩](#not-reproduced%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6) 