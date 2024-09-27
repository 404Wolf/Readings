---
id: 24157f9b-a698-4256-aad0-c48cf9b9795d
title: "Recurse Center: Week 8"
tags:
  - RSS
date_published: 2024-08-28 18:05:11
---

# Recurse Center: Week 8
#Omnivore

[Read on Omnivore](https://omnivore.app/me/recurse-center-week-8-1919bedb5ca)
[Read Original](https://ryanisaacg.com/posts/recurse-week-8.html)



Personal life got in the way for 2 of the 5 days of Week 8, which is unfortunate but happens. I only had time to focus on one project this week, but it was a chunky one: I wrote a linker for [Brick](https:&#x2F;&#x2F;github.com&#x2F;ryanisaacg&#x2F;brick)’s toolchain.

This isn’t my extremely cursed [wasmtime-dl project](https:&#x2F;&#x2F;ryanisaacg.com&#x2F;posts&#x2F;wasmtime-dl). It’s a crate that takes multiple WASM modules, resolves any exports that match imports, smooshes them all together, and outputs a single standalone module. This is crucial for Brick’s compilation process, because I need to combine the user’s compiled program with the runtime I wrote in Rust. I rolled my own linker for three reasons:

1. I thought it would be fun (it was)
2. I wanted to avoid taking a massive C++ dependency
3. If I write the code, I know it’s doing exactly what I need and nothing else

There are two major alternatives I considered, [wasm-merge](https:&#x2F;&#x2F;github.com&#x2F;WebAssembly&#x2F;binaryen?tab&#x3D;readme-ov-file#tools) or [wasm-ld](https:&#x2F;&#x2F;lld.llvm.org&#x2F;WebAssembly.html). The first is part of the [binaryen](https:&#x2F;&#x2F;github.com&#x2F;WebAssembly&#x2F;binaryen) project, which is a WASM toolkit; the second is a port of [lld](https:&#x2F;&#x2F;lld.llvm.org&#x2F;). Taking dependencies on either of these major projects would conflict with goal #2 and #3 above. Keeping my dependency tree purely Rust makes building and running the compiler simpler, especially if I want to build the compiler itself to WASM and embed it in a webpage.

Avoiding large dependencies decreases the overall complexity of the project; currently the only dependencies I’m taking are Rust ecosystem mainstays (&#x60;rayon&#x60;, &#x60;anyhow&#x60;, &#x60;thiserror&#x60;, &#x60;serde&#x60;) or protocol-specific crates that I _could_ rewrite myself if necessary (&#x60;wasm-encoder&#x60;, &#x60;wasmparser&#x60;, &#x60;lsp-server&#x60;, &#x60;lsp-types&#x60;)[\[1\]](#fn1). If a newcomer wanted to understand the project end-to-end, they would be confronted with around 20,000 lines of Rust. That sounds like a lot, but Binaryen is hundreds of thousands of lines of C++ and LLVM is in the _millions_.

Also, this is probably minor in the scheme of things for performance, but &#x60;wasm-merge&#x60; and &#x60;wasm-ld&#x60; both work with objects on disk. I wanted to do the linking in-memory before I write out the final binary, for convenience and speed.

Over the weekend between Weeks 8 and 9 I also hacked on an Obsidian plugin. It was a pretty fun experience, and my web background made it very straightforward. I now have a plugin which allows me to review my diary notes from the past week, which I like to do as part of my journaling practice. You can [check it out on Github](https:&#x2F;&#x2F;github.com&#x2F;ryanisaacg&#x2F;obsidian-diary-review), but it’s not documented or configurable in the slightest. I might come back and clean it up at some point, but no promises - it’s already doing everything I need.

---

1. Technically I also depend on wasmtime, but I could swap it out for another wasm runtime without too much trouble. I’m mostly using it as a test runner; it’s a very convenient way to run some wasm from Rust code. Nothing about the compiler toolchain requires wasmtime specifically. [↩︎](#fnref1)