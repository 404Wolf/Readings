---
id: a7df554e-a56a-4b44-840a-a17a894c1f6d
title: "Simulating an 8-bit 6502 microprocessor chapter 4: from Python to C++ | by William Seymour | Jun, 2024 | Medium"
tags:
  - RSS
date_published: 2024-06-17 06:05:44
---

# Simulating an 8-bit 6502 microprocessor chapter 4: from Python to C++ | by William Seymour | Jun, 2024 | Medium
#Omnivore

[Read on Omnivore](https://omnivore.app/me/simulating-an-8-bit-6502-microprocessor-chapter-4-from-python-to-1902633da33)
[Read Original](https://medium.com/@www.seymour/simulating-an-8-bit-6502-microprocessor-chapter-4-from-python-to-c-1c5503966cac)



## I: More speed please

Peak performance — my 6502 running hundreds of times faster than the original

It is not uncommon to prototype in Python and then rewrite performance-critical components in a much faster language. I have previously enjoyed 500x speed increases when moving from Python to C++, so that’s what I tried again here.

This is where test-driven development really came into its own. I already had a comprehensive set of instruction tests, and I’d already solved the graphics modes, I&#x2F;O, etc. If I wrote my C++ implementation as an importable Python module, then I can just drop the new cpu straight into all my existing code.

## II: Optimisation Strategies

There were a couple of things I was excited to leverage in C++. For one thing, we can natively declare 8-bit and 16-bit variables that will overflow in exactly the way we need them too, something we had to enforce in Python.

uint8_t A &#x3D; 0;  
uint8_t X &#x3D; 0;  
uint8_t Y &#x3D; 0;  
uint16_t PC &#x3D; 0;  
uint8_t SP &#x3D; 0;  
uint8_t P &#x3D; 0;

But when it came to optimisation, there were also many unknowns. The actual operations contained in each instruction are generally extremely simple, and likely cannot be significantly optimised for speed. However, my testing quickly revealed that the way in which instructions are called has a profound effect on the real-world speed of execution. Here are some things I tested comprehensively on a subset of instructions before deciding on the final design pattern for my 6502++:

* First I determined the theoretical speed ceiling by hard-coding a single instruction into the cpu. With processing time under 1ms for 1,000,000 instructions, this suggested that an equivalent speed of 1GHz was the absolute limit.
* I then tried creating an 8-bit array of function pointers so that the function for each instruction lives at the offset corresponding to its opcode. This seemed smart because if the cpu reads the opcode 8, it will execute the instruction that lives at instructions\[8\] without any maths, logic or conditions. However, this was at least an _order of magnitude_ slower than the previous test. For some reason, simply indexing into an array was massively slowing things down.
* A bit of research suggested that at this level, the main objective is cache-availability. Modern cpus are absurdly fast when data is cached, and helping it to predict what to cache will have dramatic effects. My 6502 may fit into cache in its entirety, but obfuscations such as function pointers conceal to the machine how best to do this. Instead, we have to think more naively.
* I next tested a series of if-else statements, and measured great improvements. Again, to me this was surprising, since if-else statements _appear_ to require many more operations — but the name of the game isn’t simplicity, it’s cacheability.
* I saw even better performance with a single switch statement. I was able to improve things still further by “inlining” my functions, which essentially means that they end up copied and pasted in entirety wherever you reference them. From a cacheability perspective, it’s clear why this helps — you remove references, jumps, and fractures from the code. It becomes the kind of code you wrote when you were just starting out.
* I tried some more exotic strategies, but ultimately couldn’t improve on a switch statement. I regularly benchmarked it as the switch grew fatter with instructions, but was pleasantly surprised to see that it scaled fantastically (internet suggests the compiler is very good at optimising this logic into, eg, a binary search, where beneficial). This was far from “clean code”, but it was 10–20x faster than it.

Here’s what an instruction looks like:

inline void op0x36() {  
      &#x2F;*  
      Implements ROL $nn, X - X-Indexed Zero Page addressing mode  
          - 2 bytes  
          - 6 cycles  
      *&#x2F;  
      const uint8_t address &#x3D; readByteFromAddress(++PC) + X;  
      uint8_t value &#x3D; readByteFromAddress(address);  
      const int carry &#x3D; P &amp; 0x01;  
      &#x2F;&#x2F; Set C  
      if (value &amp; 0x80) {  
          P |&#x3D; 0x01;  
      } else {  
          P &amp;&#x3D; 0xfe;  
      }  
      &#x2F;&#x2F; bitshift to the left with carry  
      value &lt;&lt;&#x3D; 1;  
      value |&#x3D; carry;  
      writeByteToAddress(address, value);  
      &#x2F;&#x2F; Set N  
      if (value &amp; 0x80) {  
          P |&#x3D; 0x80;  
      } else {  
          P &amp;&#x3D; 0x7f;  
      }  
      &#x2F;&#x2F; Set Z  
      if (value &#x3D;&#x3D; 0) {  
          P |&#x3D; 0x2;  
      } else {  
          P &amp;&#x3D; 0xfd;  
      }  
      ++PC;  
      cyclesUntilFree &#x3D; 6;  
  }

And here’s what that big switch statement looks like:

inline void executeNext() {

      const uint32_t instructionCode &#x3D; addressSpace[PC];

      &#x2F;*   
        Executing any instruction can be achieved in one line by  
        using an array of function pointers. However, this is   
        waaaaay slower that the switch statement below.

        (this-&gt;*opcodePointers[instructionCode])();  
      *&#x2F;

      &#x2F;&#x2F; Big switch statement with a case for each of the 151 opcodes  
      switch (instructionCode) {  
          &#x2F;* ---------- LDA --------- *&#x2F;  
          case 0xa9:  
              op0xa9();  
              break;  
          case 0xad:  
              op0xad();  
              break;  
          case 0xbd:  
              op0xbd();  
              break;  
          case 0xb9:  
              op0xb9();  
              break;  
          case 0xa5:  
              op0xa5();  
              break;  
          case 0xb5:  
              op0xb5();  
              break;  
          case 0xa1:  
              op0xa1();  
              break;  
          case 0xb1:  
              op0xb1();  
              break;  
          ...

}

I used Pybind to compile my 6502++ into a Python module, exposing a few variables and methods. This makes it more or less a drop-in replacement for my original Python implementation.

#include &lt;pybind11&#x2F;pybind11.h&gt;  
#include &lt;pybind11&#x2F;stl.h&gt;  
#include &lt;pybind11&#x2F;numpy.h&gt;

namespace py &#x3D; pybind11;

#include &quot;src&#x2F;cpu.h&quot;

PYBIND11_MODULE(cpp6502, m) {

  &#x2F;&#x2F; Expose the State struct  
  py::class_&lt;State&gt;(m, &quot;State&quot;)  
      .def(py::init&lt;&gt;())  &#x2F;&#x2F; Constructor  
      .def(py::init&lt;uint8_t, uint8_t, uint8_t, uint16_t, uint8_t,   
               uint8_t, std::vector&lt;uint16_t&gt;, std::vector&lt;uint8_t&gt;&gt;())  
      .def_readwrite(&quot;A&quot;, &amp;State::A)  
      .def_readwrite(&quot;X&quot;, &amp;State::X)  
      .def_readwrite(&quot;Y&quot;, &amp;State::Y)  
      .def_readwrite(&quot;PC&quot;, &amp;State::PC)  
      .def_readwrite(&quot;SP&quot;, &amp;State::SP)  
      .def_readwrite(&quot;P&quot;, &amp;State::P)  
      .def_readwrite(&quot;addresses&quot;, &amp;State::addresses)  
      .def_readwrite(&quot;bytes&quot;, &amp;State::bytes);

  &#x2F;&#x2F; Expose the CPU  
  py::class_&lt;CPU&gt;(m, &quot;CPU&quot;)  
      .def(py::init&lt;int&gt;())  
      .def(&quot;reset&quot;, &amp;CPU::reset)  
      .def(&quot;set_state&quot;, &amp;CPU::setState)  
      .def(&quot;get_state&quot;, &amp;CPU::getState)  
      .def(&quot;set_byte&quot;, &amp;CPU::setAddressSpaceByte)  
      .def(&quot;get_byte&quot;, &amp;CPU::getAddressSpaceByte)  
      .def(&quot;write_byte&quot;, &amp;CPU::writeByteToAddress)  
      .def(&quot;set_address_space&quot;, &amp;CPU::setAddressSpaceBytes)  
      .def(&quot;get_address_space&quot;, &amp;CPU::getAddressSpace)  
      .def(&quot;get_video_memory&quot;, &amp;CPU::getVideoMemory)  
      .def_readwrite(&quot;a&quot;, &amp;CPU::A)  
      .def_readwrite(&quot;x&quot;, &amp;CPU::X)  
      .def_readwrite(&quot;y&quot;, &amp;CPU::Y)  
      .def_readwrite(&quot;p&quot;, &amp;CPU::P)  
      .def_readwrite(&quot;pc&quot;, &amp;CPU::PC)  
      .def_readonly(&quot;graphics_mode&quot;, &amp;CPU::graphics_mode)  
      .def_readonly(&quot;graphics_bank&quot;, &amp;CPU::graphics_bank)  
      .def(&quot;executeN&quot;, &amp;CPU::executeNCycles);  
}

## III: Something isn’t right

My 6502++ passed every test, and booted correctly into Basic. However, when typing in a programme, it sometimes started behaving oddly. This was the nightmare scenario I had feared from the outset, and which had compelled my triple-test-driven approach. The problem was that at some point, in a specific state, perhaps billions of clock cycles since booting, an instruction was being executed incorrectly. How on earth do we diagnose that?

Well, I had one thing up my sleeve — I’d already built a 6502 that did not exhibit this fault. After a bit of thought I realised that I could run the emulator with the good 6502 shadowing the bad one. They would both receive the same inputs, and we could automatically check that they both produced exactly the same outputs. If they no longer agreed, the simulation would end and I would have a report of the exact instruction that caused the divergence, as well as the entire input and output state.

for i in range(1000):  
    instruction_a &#x3D; cpu_a.read_byte_from_ram(cpu_a.pc)  
    instruction_b &#x3D; cpu_b.get_byte(cpu_b.pc)

    cpu_a.step_forward()  
    cpu_b.executeN(1)

        assert get_state_a(cpu_a) &#x3D;&#x3D; get_state_b(cpu_b), (hex(instruction_a), hex(instruction_b))

To my relief, this worked perfectly. The bug was occurring because I’d experimented with using 32-bit variables for the 8-bit registers, and this caused an issue in a very specific instruction case. Very challenging to identify, but trivial to fix.

I was then able to run plotpourri (from last time) a couple of orders of magnitude more quickly. Plots that used to take 15–30mins now render in seconds:

Note that the 6502++ executes instructions on every cycle, making the equivalent MHz figure several times higher than shown. This implementation is also constrained by an inefficient pygame front end, without which it can run much faster.

The final question, for chapter 5 of this series, is what could 8-bit software engineers have done with this kind of speed?

\&gt;&gt; Next: ray-tracing on the Apple 2