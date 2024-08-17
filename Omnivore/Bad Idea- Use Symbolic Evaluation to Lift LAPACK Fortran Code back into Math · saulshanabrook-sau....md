---
id: ec2e8797-4f75-43da-8fa7-05fe49effc3c
title: "Bad Idea: Use Symbolic Evaluation to Lift LAPACK Fortran Code back into Math · saulshanabrook/saulshanabrook · Discussion #33 · GitHub"
tags:
  - RSS
date_published: 2024-08-16 05:00:00
---

# Bad Idea: Use Symbolic Evaluation to Lift LAPACK Fortran Code back into Math · saulshanabrook/saulshanabrook · Discussion #33 · GitHub
#Omnivore

[Read on Omnivore](https://omnivore.app/me/bad-idea-use-symbolic-evaluation-to-lift-lapack-fortran-code-bac-1915bf4c051)
[Read Original](https://github.com/saulshanabrook/saulshanabrook/discussions/33)



Or the same but for CPYthon and LLVM... Like &lt;https:&#x2F;&#x2F;bernsteinbear.com&#x2F;blog&#x2F;weval&#x2F;&gt;, but instead of manually instrumenting, just lift some things into higher level semantics.

For this example, don&#39;t have to implement full LLVM semantics (very hard&#x2F;impossible), but instead if we have pipeline of LLVM -&gt; higher level -&gt; LLVM, we can just choose what bits to lift to higher level before going back down.

Then we can specialize based on source of CPYthon code, or more likely just bytecode so we can avoid whole parsing piece.