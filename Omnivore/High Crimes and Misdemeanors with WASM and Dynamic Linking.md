---
id: 8af2532a-fe93-4f6c-beed-266cdc6cc722
title: High Crimes and Misdemeanors with WASM and Dynamic Linking
tags:
  - RSS
date_published: 2024-08-19 00:00:00
---

# High Crimes and Misdemeanors with WASM and Dynamic Linking
#Omnivore

[Read on Omnivore](https://omnivore.app/me/high-crimes-and-misdemeanors-with-wasm-and-dynamic-linking-1916c6027c0)
[Read Original](https://ryanisaacg.com/posts/wasmtime-dl.html)



In [my programming language](https:&#x2F;&#x2F;ryanisaacg.com&#x2F;posts&#x2F;programming-language-for-fun), currently codenamed Brick, I want to allow developers to pull in platform-native libraries written in other languages. Brick compiles to WebAssembly (wasm), and wasm is totally sandboxed by design. Without functions provided by the environment (“imports” in wasm lingo), a wasm module can have no side effects when run. I want Brick programs to have plenty of side effects, like making web requests or drawing graphics to the screen.

On desktop I’m running Brick programs via [wasmtime](https:&#x2F;&#x2F;github.com&#x2F;bytecodealliance&#x2F;wasmtime), a wasm runtime maintained by the folks behind the wasm spec. It’s written in Rust and exposes a Rust API, which allows us to attach Rust functions as a wasm module’s imports. This is great, because it allows us to include external libraries like &#x60;tokio&#x60; for web requests or &#x60;macroquad&#x60; for graphics. The linking API looks like this:

&#x60;&#x60;&#x60;less
linker.func_wrap(
    &quot;bindings&quot;, &#x2F;&#x2F; the name of the WASM module being imported
    &quot;fill_rect&quot;, &#x2F;&#x2F; the name of the import in that module
    move |x: f32, y: f32, w: f32, h: f32| {
        draw_rectangle(x, y, w, h, Color::WHITE);
    },
)?;
&#x60;&#x60;&#x60;

The only problem is that each of these bindings need to be written by hand in our Rust program. There’s no way to introduce new bindings at runtime, which makes it hard for Brick packages to use any external code I didn’t plan for.

Here’s the goal: link our wasm binary directly with a dynamic library, without needing to hand-write these bindings.

## High Crime: Break down the sandbox

Enter &#x60;wasmtime-dl&#x60;, a very bad idea I had. My goal was to break a hole in the side of the sandbox, and allow Brick packages to link to arbitrary dynamic libraries.

The first design I sketched out was simple: given a set of function definitions, link the dynamic library with wasmtime. I had no idea how to accomplish this, but I’m in batch at the Recurse Center! It was time to work at the edge of my abilities.

A long time ago, I wrote games in C. I remembered trying and failing to set up hot reloading for the games, so I could recompile them without having to relaunch the game. In those explorations I encountered the &#x60;dlopen&#x60; Linux system call, which allows you to load dynamic libraries at runtime. I searched “&#x60;dlopen&#x60; Rust”, which was a good-enough starting point. I found a few crates that all did roughly the same thing: open a dynamic library, and return a function pointer for a given symbol name in that library.

Of the available crates I settled on &#x60;libloading&#x60;; here’s an example of how it works from [the docs](https:&#x2F;&#x2F;docs.rs&#x2F;libloading&#x2F;latest&#x2F;libloading&#x2F;):

&#x60;&#x60;&#x60;rust
unsafe {
    let lib &#x3D; libloading::Library::new(&quot;&#x2F;path&#x2F;to&#x2F;liblibrary.so&quot;)?;
    let func: libloading::Symbol&lt;unsafe extern fn() -&gt; u32&gt; &#x3D; lib.get(b&quot;my_func&quot;)?;
    Ok(func())
}
&#x60;&#x60;&#x60;

So now we can definitely take a dynamic library and starting pulling functions out of it. Great, on to the next step: grabbing these functions dynamically.

## High Crime: 1 million lines of Rust

Here I encountered my first major obstacle. I need to tell Rust what the type of the function pointer is before I can call it. I don’t think this is even a safety concern; how can the compiler emit code if it doesn’t know what values will be sent into the function call? Unfortunately I don’t know the type at compile time; I’ll be reading the types in at runtime.

I decided to solve my problem with a little code generation. By creating a very big match statement, I could dynamically pick the right type based on the runtime information. If the function definition was &#x60;(f32, f64, i32, f32)&#x60; then I would match that tuple, and that match branch would create a function pointer with type &#x60;fn(f32, f64, i32, f32)&#x60;. Type problems solved! I wrote a quick Python program to generate my match statements and hit run.

After it ran for a few seconds I started to get suspicious. “Why is it taking so long?”, I thought. I had tried to generate up to 16 arguments (which seems like a reasonable number of arguments to me), with an optional return value. In wasm, types may be 32 or 64 bit and they may be integers or floats, giving us four types: &#x60;i32&#x60;, &#x60;f32&#x60;, &#x60;i64&#x60;, and &#x60;f64&#x60;. Surely the number of combinations couldn’t be that great! I punched it into Wolfram Alpha just to double check and almost fell out of my chair: 4 parameter types and one optional return type, for every parameter length up to 16, gives over one million combinations.

Numbers! How could you do this to me??? Let alone the time to generate 3 million lines of Rust, imagine the time to compile it. Forget office fencing, you’ll have time to run a whole office LARP!

![XKCD comic strip. two stick figures fence on office rolling chairs while waiting for their code to compile](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sLyjourQ_5B37MdfqDeE_sqGiCU5GGbaNfDg0ONDpVTc&#x2F;https:&#x2F;&#x2F;imgs.xkcd.com&#x2F;comics&#x2F;compiling.png)

I scoped my ambitions way down and generated up to 4 parameters instead, which is still a CPU-crushing 15,700 lines of Rust. Even though it took minutes to compile, I had my first working prototype.

The interface looked like this:

&#x60;&#x60;&#x60;rust
#[derive(Copy, Clone)]
pub enum ValType {
    I32,
    F32,
    I64,
    F64,
}

pub struct WasmFuncImport&lt;&#39;a&gt; {
    pub module: &amp;&#39;a str,
    pub name: &amp;&#39;a str,
    pub params: &amp;&#39;a [ValType],
    pub returns: Option&lt;ValType&gt;,
}

pub unsafe fn link(
    &#x2F;&#x2F; linker provided by wasmtime
    linker: &amp;mut Linker&lt;()&gt;,
    &#x2F;&#x2F; path to the dynamic library
    dynamic_lib: impl AsRef&lt;OsStr&gt;,
    &#x2F;&#x2F; type definitions for the wasm imports
    imports: &amp;[WasmFuncImport&lt;&#39;_&gt;], 
) {
  &#x2F;&#x2F; ...
}
&#x60;&#x60;&#x60;

The generated code in that function is sorta unreadable, but you can [check it out on GitHub](https:&#x2F;&#x2F;github.com&#x2F;ryanisaacg&#x2F;wasmtime-dl&#x2F;blob&#x2F;14c0ce31e9052b8bc83e3506573295e246453471&#x2F;src&#x2F;lib.rs#L33) if you want to see it for yourself.

## Misdemeanor: Why define the bindings?

You shouldn’t have to define the bindings - they’re right there in the binary! I’m not sure if I realized this in the shower, or on the train, or at the gym, but it hit me like a bolt of lightning. A wasm binary defines the types of its imports, including what parameters and return values functions have.

That means we can save some work for &#x60;wasmtime-dl&#x60;’s caller. Instead of asking them for some external definition for each function, we’ll just use the one provided by the wasm binary.

The first experimental version worked! Driving the function bindings by examining the imports of the module itself meant that the user only needed to provide a wasm module and a dynamic library, and &#x60;wasmtime-dl&#x60; could drive the rest. Our interface from before can remove user-provided binding definitions entirely; doesn’t it look so much simpler?

&#x60;&#x60;&#x60;dts
pub unsafe fn link(
    &#x2F;&#x2F; linker provided by wasmtime
    linker: &amp;mut Linker&lt;()&gt;,
    &#x2F;&#x2F; path to the dynamic library
    dynamic_lib: impl AsRef&lt;OsStr&gt;,
    &#x2F;&#x2F; the wasm blob as loaded by wasmtime
    wasm_module: &amp;Module,
) {
  &#x2F;&#x2F; ...
}
&#x60;&#x60;&#x60;

It was only after I had done the work that I realized it was fatally flawed. In wasm, pointers are represented as &#x60;i32&#x60; values. The wasm binary format provides no distinction between a regular integer and one that is used as a pointer, but that distinction matters a lot to our binding program. Before we can pass the pointer to an external library, we need to add the offset where the wasm VM’s memory starts. Within wasm a pointer might look like the value &#x60;12&#x60; (the 12th byte of the VM’s memory), but outside it will look like more like &#x60;0x0ffac12&#x60; (the actual RAM location where the WASM VM’s memory is stored, plus 12).

We _could_ just have annotations for which parameters and return values of imports functions are pointers, but what’s the point[\[3\]](#fn3)? Once we need annotations on some functions, we may as well accept the need for annotations on every function. I added a new variant to &#x60;ValType&#x60; to represents a pointer; it counts as an &#x60;i32&#x60; on the WASM side and a &#x60;u64&#x60; on the host side.

## Misdemeanor: Floats and ints… they’re all just bytes, right?

At this point I had another good? bad? idea. To cut down on the combinatorial explosion, what if I pretended that all float parameters are ints? An &#x60;f32&#x60; or an &#x60;i32&#x60; are both 32-bit chunks of data; the only difference between them is how you interpret those 32 bits. By treating all parameters to the dynamic library functions as &#x60;i32&#x60; or &#x60;i64&#x60; we can drastically cut down on the number of generated match cases.

This required some finagling. First, instead of getting to use the convenient type-safe methods on wasmtime’s &#x60;Linker&#x60;, I had to drop down into the less-convenient, less-safe, and slower “raw” binding mode. Second, I discovered that punning an &#x60;f32&#x60; into an &#x60;i32&#x60; was a little more complicated than I initially expected. After a few iterations where the bindings produced total gibberish, I ended up with a pretty simple use of the [bytemuck](https:&#x2F;&#x2F;crates.io&#x2F;crates&#x2F;bytemuck) crate to transmute the provided f32 bytes into an i32.

By constraining the combinatorial space, I managed to fit in up to eight parameters in the generated code. It still takes minutes to compile though, even on an M1 Mac, so it’s not exactly lightweight.

## A snag: structs

I was excited to have created this horrible beast. To make a little demo I decided to pull in [raylib](https:&#x2F;&#x2F;www.raylib.com&#x2F;index.html), a simple C library for creating games, and call it from some wasm. As I scrolled through the raylib API, it hit me: wasm doesn’t know about structs! Any C function that takes a struct or union will expect it to conform to the C calling ABI; wasm only knows about its core primitive types. As it stands there’s no way to call a function that expects a non-primitive argument.

This problem isn’t technically insurmountable, but it feels that way in a practical sense. I’m sure I could add an elaborate layer to marshal wasm parameters into structs, but that would explode my combination issue even further. Instead I decided to declare victory (or defeat, depending your perspective), and write this blog post instead of productionizing &#x60;wasmtime-dl&#x60;.

## Verdict

My initial goal of binding from wasm imports to dynamic libraries has been achieved (with some criminal mischief along the way). It’s not a practical end product, but I learned a lot about dynamic linking and the limits of code generation! You can check out the [wasmtime-dl repo](https:&#x2F;&#x2F;github.com&#x2F;ryanisaacg&#x2F;wasmtime-dl&#x2F;) to see where I ended up, and you can pull in the crate if you want to be a victim of a compile-time crime.

This auto-binding approach obviously isn’t going to pan out for Brick. Instead I’m going to experiment with an idea I’ve only seen in [Roc](https:&#x2F;&#x2F;www.roc-lang.org&#x2F;): the language requires an external program called a “platform” to run. The core language will remain the same, but the IO primitives and runtime characteristics will be determined by the platform. Considering the sandboxed model of wasm, this seems like a great fit for Brick! Stay tuned for a possible future post on the subject when I implement it.

_Thanks to [Robin Neufeld](https:&#x2F;&#x2F;metavee.github.io&#x2F;) for feedback on a draft of this post._

---

1. It might seem a little odd to write &#x60;extern &quot;C&quot;&#x60; instead of &#x60;extern &quot;WASM&quot;&#x60;. The Rust WASM team [did consider a WASM-specific ABI](https:&#x2F;&#x2F;github.com&#x2F;rustwasm&#x2F;team&#x2F;issues&#x2F;29), but ultimately decided against it. [↩︎](#fnref1)
2. I have no idea how this process works! I’m also not sure how much it varies by operating system. I know that all the major operating systems have their own dynamic library formats (&#x60;dll&#x60; on Windows, &#x60;dylib&#x60; on macOS, and &#x60;so&#x60; on Linux), and that the OS searches various locations for a library when loading a library. [↩︎](#fnref2)
3. Pun intended. [↩︎](#fnref3)