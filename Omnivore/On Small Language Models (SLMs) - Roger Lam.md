---
id: a82f81dc-5a2b-45a0-aa9a-21cbec0a5a8b
title: On Small Language Models (SLMs) - Roger Lam
tags:
  - RSS
date_published: 2024-05-24 00:00:00
---

# On Small Language Models (SLMs) - Roger Lam
#Omnivore

[Read on Omnivore](https://omnivore.app/me/on-small-language-models-sl-ms-roger-lam-18fac466825)
[Read Original](https://www.lamroger.com/posts/2024-05-24-on-small-language-models/)



Haven&#39;t posted in a bit but I&#39;m back! Had a wonderful few weeks. My class on Generative AI wrapped up - very happy with the progress the students made. With the field still in its infancy, I encouraged them to continue to experiment and learn on their own since that&#39;s what we&#39;re all doing.

I also came back from Lisbon and had a great time. It&#39;s been a while since I&#39;ve traveled overseas so it was a nice change of scenery. The streets of LA hit a little different now.

&quot;If you are a student interested in building the next generation of AI systems, don&#39;t work on LLMs&quot; - [Yann LeCun](https:&#x2F;&#x2F;twitter.com&#x2F;ylecun&#x2F;status&#x2F;1793326904692428907)

LLMs really are completely inaccessible... Millions of dollars in compute to train. Clusters of compute and data. They&#39;re cool to learn and amazing to see in action but not aligned with the hacker ethos.

I&#39;m still very excited with OpenELM, MLX in Pytorch, and the M-series processors in Macs. While Meta is leading in open sourcing models, it&#39;s looking like Apple is the one leading in hardware. I love remote-ing into my M2 Mac Mini from my Intel Macbook Pro. Together with Tailscale, it&#39;s practically seamless. Very excited to see the benchmarks with the anticipated M4 Mac Mini at WWDC.

I got to play with the OpenELM 270M model. Following their [HF Readme](https:&#x2F;&#x2F;huggingface.co&#x2F;apple&#x2F;OpenELM-270M), I had to request access to the Llama 2 model for the tokenizer but that was a quick approval (1-2 hrs).

The results were not great. Pretty bad TBH - not the fault of the engineers at Apple but the limitations of our techniques today.

Running with this prompt:

&#x60;&#x60;&#x60;dsconfig
python generate_openelm.py --model apple&#x2F;OpenELM-270M --hf_access_token &lt;hf_token&gt; --prompt &#39;Once upon a time there was&#39; --generate_kwargs repetition_penalty&#x3D;1.2

&#x60;&#x60;&#x60;

![Completion on 270M params](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sp2rxHF7t89N7zXUb8TWOxuoXnmWDEnVifjjL8Vrx9KE&#x2F;https:&#x2F;&#x2F;www.lamroger.com&#x2F;images&#x2F;2024-05-24-on-small-language-models&#x2F;completion_270m.png)

&#x60;&#x60;&#x60;dsconfig
python generate_openelm.py --model apple&#x2F;OpenELM-270M-Instruct --hf_access_token &lt;hf_token&gt; --prompt &#39;[INST] What is the capital of California? [&#x2F;INST]&#39; --generate_kwargs repetition_penalty&#x3D;1.2

&#x60;&#x60;&#x60;

![Instruct on 270M params](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sbYJSah-x460vxmpBNX4LijbRnd-GuAYOZGgFTVIyc-A&#x2F;https:&#x2F;&#x2F;www.lamroger.com&#x2F;images&#x2F;2024-05-24-on-small-language-models&#x2F;instruct_270m.png)

Looking forward to debugging a bit more to see if I can massage a valid response out of it. Probably looking at techniques from larger (but still smaller) models like this blog post from [Replicate](https:&#x2F;&#x2F;replicate.com&#x2F;blog&#x2F;how-to-prompt-llama).

I still look forward to training my own small model.

More soon!