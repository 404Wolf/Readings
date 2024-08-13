---
id: f92312d5-842c-470a-b174-87da6d97163e
title: "Simulating an 8-bit microprocessor chapter 1: instructions | by William Seymour | Jun, 2024 | Medium"
tags:
  - RSS
date_published: 2024-06-15 06:02:04
---

# Simulating an 8-bit microprocessor chapter 1: instructions | by William Seymour | Jun, 2024 | Medium
#Omnivore

[Read on Omnivore](https://omnivore.app/me/simulating-an-8-bit-microprocessor-chapter-1-instructions-by-wil-1901bee621f)
[Read Original](https://medium.com/@www.seymour/simulating-an-8-bit-microprocessor-chapter-1-instructions-6ada8921c43f)



## So I fell down a rabbit hole…

This is the **first** chapter in an odyssey that encompasses:

1. Using test-driven development (TDD) to create an instruction-level simulation of the 6502 microprocessor.
2. Reverse engineering the keyboard input and graphics output of an Apple 2 computer (a 1970s computer with the 6502 at its core).
3. Combining the pieces into an emulation of the Apple 2 computer accurate enough to run real 1970s software.
4. Rewriting the simulation in C++ to make it 500x faster than it was in reality.
5. Testing that speed with a ray-tracing graphics engine written in 6502 assembly.

## Part 1: getting to grips with the 6502

The 6502 is an 8-bit microprocessor well known to computer science historians and retro computer enthusiasts. It was launched in 1975, and made its way into iconic systems such as Atari’s consoles, the Nintendo Entertainment System, the BBC Micro, the Commodore 64, and the Apple 2.

I have a history with simulation, and have always wondered what it would take to simulate a cpu, or an entire system. In terms of cost&#x2F;benefit, the 8-bit era of the late 1970s presents something of a sweet spot: mature enough technology to be interesting, but still pretty simple. And, slow enough that a simulation in Python on a modern machine would be in the same performance ballpark.

The real problem, it was clear from the outset, wouldn’t be complexity — it would be _accuracy._ But we’ll come back to that…

## How does the 6502 work?

This isn’t going to be a computer science lesson, but some context will be worthwhile. Here are some facts:

* The 6502 can handle 8-bit values, meaning that it can only natively process integers between 0 and 255.
* The 6502 has a 16-bit address space, meaning that it normally comes with a maximum 64KB of memory, split between ram, rom, and I&#x2F;O. This is less information than a 148 x 148 pixel colour image.
* The 6502 usually ran at 1Mhz, or a million clock cycles per second.
* On each clock cycle, if the 6502 has finished its previous task, it receives the next instruction and starts executing it.

Instructions is the key to things. All computing is comprised of instructions. The 6502 has 56 different instructions, each of which does something small and self-contained, like move information, increment a number, or compare a number to another. Such instructions remain the building blocks of all the amazing things computers can do today.

Each instruction has at least one implementation, and possibly many more. These tell the processor exactly how to do the operation — usually where in memory an additional operand is. As you can see below, each implementation of the instruction has its own syntax for programming, and its own opcode. The opcode is an 8-bit number that the processor can recognise, usually presented in hexadecimal notation (where 0–255 covers $00-$FF).

You can now see that at the lowest level, a computer programme is just a list of numbers, stored physically in binary. To illustrate this, see how the expressions below are equivalent.

&gt; English: Add 5 to 21
&gt; 
&gt; Pseudocode: Put 21 in the accumulator. Add 5 to it.
&gt; 
&gt; Assembly: LDA #$15 ADC #$05
&gt; 
&gt; Machine code (hex): $A9 $15 $69 $05
&gt; 
&gt; Machine code (base-10): 169 21 105 05
&gt; 
&gt; Machine code (8-bit binary): 10101001000101010110100100000101

## Part 2: Simulating Opcodes

So it’s pretty clear that we are going to have to build something that can interpret all 151 opcodes, and do exactly what a real 6502 would do when encountering each of them. When executing an instruction, a 6502 might alter:

* The programme counter (a pointer to the next instruction)
* The stack pointer (a pointer to the current position on the stack)
* The accumulator (used mainly for maths and comparisons)
* The x and y registers (used largely for indexing and incrementing)
* The status register (records things like operation carries and overflows)
* A byte in memory

We can also observe that the 151 opcodes share a small number of addressing modes, and much of the logic is very similar, so with some thought we can greatly reduce the amount of work needed to implement them all.

For example, the opcode $F6, which increments a value by 1, is implemented by combining:

* Incrementing logic shared by 12 opcodes with 3 different targets (INC, INX, INY).
* Addressing logic shared by 16 opcodes.

Here’s how that looks in Python:

class IndexedZeroPage:  
    def __init__(self, cpu, register):  
        self.cpu &#x3D; cpu  
        self.register &#x3D; register

    def __call__(self):  
        address &#x3D; self.cpu.read_byte_from_ram(self.cpu.pc)  
        offset &#x3D; getattr(self.cpu, self.register)  
        offset_address &#x3D; (0 + address + offset) &amp; 0xFF  
        return offset_address

class XIndexedZeroPage(IndexedZeroPage):  
    &quot;&quot;&quot;  
    $nn,X  
    &quot;&quot;&quot;  
    def __init__(self, cpu):  
        super().__init__(cpu, register&#x3D;&#39;x_register&#39;)

    def __call__(self):  
        return super().__call__()

class IN_:  
    def __init__(self, cpu, inc_value, register&#x3D;None):  
        self.cpu &#x3D; cpu  
        self.inc_value &#x3D; inc_value  
        self.register &#x3D; register

    def execute_register(self):  
        value &#x3D; 0 + getattr(self.cpu, self.register)  
        value +&#x3D; self.inc_value  
        value &amp;&#x3D; 0xFF  
        setattr(self.cpu, self.register, value)  
        self(value)

    def execute_address(self, address):  
        value &#x3D; 0 + self.cpu.read_byte_from_ram(address)  
        value +&#x3D; self.inc_value  
        value &amp;&#x3D; 0xFF  
        self.cpu.write_byte_to_ram(address, value)  
        self(value)

    def __call__(self, value):  
        self.cpu.set_register_bit(&#39;N&#39;) if value &amp; 0x80 else self.cpu.clear_register_bit(&#39;N&#39;)  
        self.cpu.set_register_bit(&#39;Z&#39;) if value &#x3D;&#x3D; 0 else self.cpu.clear_register_bit(&#39;Z&#39;)

class INC(IN_):  
    def __init__(self, cpu):  
        super().__init__(cpu, inc_value&#x3D;1)

    def op0xf6(self):  
          &quot;&quot;&quot;  
          Implements INC - $nn,X - X-Indexed Zero Page  
          - 2 byte  
          - 6 cycles  
          &quot;&quot;&quot;  
          address &#x3D; self.addressor.x_indexed_zero_page()  
          self.INC.execute_address(address)  
          self.pc +&#x3D; 1  
          self.cycles_until_free &#x3D; 6  
          self.after_execute()

Why is this helpful? There are two important reasons. One is that it radically reduces the number of things that need to be built, from hundreds, to dozens. The other, much more important, is that it radically reduces the number of things that need to be _tested._

## Part 3: Test, Test, Test

A computer is deterministic, going from one state to the next state in a predictable manner. Everything depends on this fact. With a million operations every second, the smallest error in the simulation will be almost impossible to detect and track down.

We need to avoid that situation, and reach 100.0000% accuracy at the outset. How? I employed a triple test-driven-development (TDD) methodology:

1. Comprehensive unit tests for all discrete logical components so that they can be developed to pass documented behaviour. We have already seen the two logical components (addressing mode and incrementation) that comprise INX and many other instructions.
2. Machine code tests, which replicate a subset of the unit tests, to test that the 6502 is doing what it should when actually executing instructions.
3. Comparison tests against a database of 10,000 cases per opcode recording the before and after states from a real 6502.

The first type of tests helped me develop components that met the spec, and look something like this:

class TestINXInstruction(unittest.TestCase):  
    def setUp(self):  
        self.cpu &#x3D; CPU6502()

    def test_inx_basic_increment(self):  
        &quot;INX with a standard value should increment X and not set Z or N.&quot;  
        self.cpu.x_register &#x3D; 0x10  
        self.cpu.INX.execute_register()  
        self.assertEqual(self.cpu.x_register, 0x11)  
        self.assertFalse(self.cpu.get_register_bit(&#39;Z&#39;))  
        self.assertFalse(self.cpu.get_register_bit(&#39;N&#39;))

The second gave me confidence that the 6502 was doing what it should when running as an actual processor:

class TestProgrammes(unittest.TestCase):  
    def setUp(self):  
        self.cpu &#x3D; CPU6502(mode&#x3D;RUN_ON_MODE)  
        self.ram &#x3D; RAM()  
        self.cpu.set_ram(self.ram)

    def test_inc_c(self):  
        self.ram.reset()

                # This is where we get the 6502 to run actual code!  
        machine_code &#x3D; &quot;&quot;&quot;  
            0200: fe  
            0600: 00 02  
            FFFC: 00 06  
        &quot;&quot;&quot;  
        hex_dump &#x3D; machine_code_to_hex_dump(machine_code)  
        self.ram.hex_dump_to_ram(hex_dump)  
        self.cpu.reset()  
        self.cpu.op0xee()  
        self.assertEqual(0xff, self.ram.read_byte(0x0200))

The third type of test was where things got really interesting. By comparing my simulation against 100s of thousands of real cases of a 6502 executing instructions, I was able to find some strange edge cases, undocumented behaviour, and clear up a few remaining errors.

All this testing may sound tedious, maybe even pedantic. But the idea behind this kind of development is that a bit of work upfront can actually accelerate development, as you test your work’s accuracy automatically rather than manually. And that’s before you take into account the cost of chasing down the errors you would have introduced otherwise.

## Part 4: Running real code

The real measure of the process was whether my simulated 6502 would run actual code. I didn’t yet have a compiler, so I wrote my first programme out in machine code.

This isn’t yet simulating a real-world computer. It is in effect a hypothetical MVP computer with a cpu, some ram, and a basic graphics mode that turns a slice of memory into an image.

import numpy as np  
import pygame

from system import processor, memory, utils

# Screen dimensions  
width, height &#x3D; 512, 512  
screen &#x3D; pygame.display.set_mode((width, height))

# Define the matrix dimensions and scale factor  
matrix_width, matrix_height &#x3D; 16, 16  
scale_factor &#x3D; width &#x2F;&#x2F; matrix_width

print(scale_factor)

machine_code &#x3D; &quot;&quot;&quot;  
    0600: ae ff ff ac ff ff 98 9d 00 02 e8 c8 c8 c8 c8 c8 4c 06 06  
    FFFC: 00 06  
&quot;&quot;&quot;

cpu &#x3D; processor.CPU6502(mode&#x3D;processor.STEP_MODE)  
ram &#x3D; memory.RAM()  
ram.hex_dump_to_ram(utils.machine_code_to_hex_dump(machine_code))  
cpu.set_ram(ram)

def matrix_output(ram, start_address, end_address, shape):  
    return ram.memory[start_address:end_address+1].reshape(shape)

def clock_cycle():  
    # Clock stuff  
    cpu.step_forward()  
    video_output &#x3D; matrix_output(ram, 0x0200, 0x02ff, (16, 16))  
    return video_output

# Main loop flag  
running &#x3D; True

# Main loop  
while running:  
    for event in pygame.event.get():  
        if event.type &#x3D;&#x3D; pygame.QUIT:  
            running &#x3D; False

        video_output &#x3D; clock_cycle()

        # Render the matrix on the screen  
    for y in range(matrix_height):  
        for x in range(matrix_width):  
            intensity &#x3D; video_output[y, x]  
            color &#x3D; (intensity, intensity, intensity)  # Grayscale  
            rect &#x3D; (x * scale_factor, y * scale_factor, scale_factor, scale_factor)  
            pygame.draw.rect(screen, color, rect)

        # Update the display  
    pygame.display.flip()

# Quit Pygame  
pygame.quit()

This programme does two things:

1. Draws a gradient pattern to the screen.
2. Demonstrates that the 6502 is working perfectly (!!!), at least on the subset of instructions used here.

My first 6502-based simulation and programme

I next tried a game of snake someone had made on Github. I think this was designed for the Commodore 64, as it expects a random number generator on one memory address, but that and the graphics mode were easy enough to implement.

To get this running, all we have to do is inject the code directly into the address space and point the programme counter to the first byte.

Snake in 6502 machine code

Snake

At this point I was pretty surprised that the simulated 6502 was actually working, and running actual, real-life code. It was a testament to the test-driven development approach that the processor just _worked_ straight out of the box.

But this was only the first step. We don’t just want to run toy code. We want to run actual 1970s software. And to do that, wewould need to open the pandora’s box that is simulating everything else that comprises an 8-bit computer.