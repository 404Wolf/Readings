---
id: fe0ac3ea-ae5c-4b2f-b864-26e73bac2f15
title: "Talk Supplements for Scientific Computing in Rust 2024 :: Rohit Goswami — Reflections"
tags:
  - RSS
date_published: 2024-07-21 21:04:29
---

# Talk Supplements for Scientific Computing in Rust 2024 :: Rohit Goswami — Reflections
#Omnivore

[Read on Omnivore](https://omnivore.app/me/talk-supplements-for-scientific-computing-in-rust-2024-rohit-gos-190d8a90da3)
[Read Original](https://rgoswami.me/posts/scicomprs-2024-meta/)



---

---

&gt; A meta-post on a presentation at the Scientific Computing in Rust 2024 annual workshop

## Background

### Details

Title

&#x60;bless&#x60; : transparently logging program outputs

&#x60;bless&#x60;

[repo](https:&#x2F;&#x2F;github.com&#x2F;HaoZeke&#x2F;bless) (Github)

Workshop listing

[conference site](https:&#x2F;&#x2F;scientificcomputing.rs&#x2F;2024&#x2F;talks&#x2F;goswami.html)

Blurb:

&gt; We introduce bless, a tool geared towards multiple runs of codes in flux. The key idea is to use Rust’s logging libraries to transparently annotate outputs and additionally use a MongoDB database to store the output and metadata. We find this raises interesting problems while handling the outputs of MPI commands asynchronously. Additionally we provide alternatives to (PROG 2&gt;&amp;1) | tee blah.out, with the ability to use a configuration file and prepare a tar.gz of outputs and inputs. This is invaluable when working with minor changes to multiple codebases, as is typical in the early stages of a scientific project.

## Slides

* A &#x60;pdf&#x60; copy of the slides are embedded below

## Video

---

[![Written by human, not by AI](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3X9B6N8P4mL_vrtU_BFqKhW67a4M6d8JKitE2AEn368&#x2F;https:&#x2F;&#x2F;rgoswami.me&#x2F;&#x2F;images&#x2F;Written-By-Human-Not-By-AI-Badge-white.svg)](https:&#x2F;&#x2F;notbyai.fyi&#x2F;)