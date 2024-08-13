---
id: 175e999e-d7e9-11ee-9fd2-9f3677ec3c2a
title: Snapshot Testing - blag
tags:
  - RSS
date_published: 2024-03-01 11:02:53
---

# Snapshot Testing - blag
#Omnivore

[Read on Omnivore](https://omnivore.app/me/snapshot-testing-blag-18dfadad313)
[Read Original](https://avi.im/blag/2024/snapshot-testing/)



Snapshot testing makes it easy to compare large outputs from a function. Instead of asserting against the raw output directly:

&#x60;&#x60;&#x60;lisp
assert_eq!(my_really_large_6mb_string, my_func());

&#x60;&#x60;&#x60;

you save the expected output in a file and compare against that. But manually saving, loading, and comparing snapshot files is a lot of work! Snapshot testing frameworks make this process easy. In Rust, I have used [insta](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;insta):

&#x60;&#x60;&#x60;lisp
assert_debug_snapshot!(my_func());

&#x60;&#x60;&#x60;

I don’t need to explicitly save or load snapshot files. The framework handles it automatically!

The workflow is:

1. Write a test and include the assert macro.
2. Since this is the first run, there is no snapshot file yet. The framework generates one.
3. \[Optional\] Modify the snapshot file as needed.
4. Run the tests again - now the framework will compare against the saved snapshot and the test will pass.
5. If there is a regression or intentional change to the output, running the tests will generate a new snapshot file. The old one is preserved so you can review the change.

You may check my [pull request](https:&#x2F;&#x2F;github.com&#x2F;tursodatabase&#x2F;libsql&#x2F;pull&#x2F;1117) on libsql-server which adds a bunch of snapshot tests.

Jane Street has a nice blog post on the same - [What if writing tests was a joyful experience?](https:&#x2F;&#x2F;blog.janestreet.com&#x2F;the-joy-of-expect-tests&#x2F;).