---
id: 2336dbbc-d96a-4ba6-a26b-8a442c376dd1
title: "BIOS bootloaders: when your runway is measured in bytes | the weightless state"
tags:
  - RSS
date_published: 2024-08-05 00:01:34
---

# BIOS bootloaders: when your runway is measured in bytes | the weightless state
#Omnivore

[Read on Omnivore](https://omnivore.app/me/bios-bootloaders-when-your-runway-is-measured-in-bytes-the-weigh-19120c0127b)
[Read Original](https://metavee.github.io/blog/technical/2024/08/05/bios-boot.html)



I’m currently attending the [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;) and I’ve been digging in to how bootloaders work on BIOS-based x86 systems. This is far outside my usual comfort zone of Python, data science and ML ops. It’s been very refreshing to explore this low-level topic!

Bootloaders solve a chicken and egg problem: to start the operating system, you need to find its files, load them into memory and start executing. But when you hit the power button, your computer hardware doesn’t know where the OS is or how to load it. To your hardware, there are no files, just a big pile of bytes. The bootloader’s job is to bridge this gap.

I’m focusing on BIOS systems since these were the computers I grew up with in the 90s: early Windows PCs. These generally boot from the Master Boot Record, the first 512 bytes on disk. This got me curious about what the programming environment is like. With no operating system and so little space for code, how do you do anything useful?

## MBR layout

As it turns out, not all 512 bytes are supposed to be used for executable code. The final 2 bytes are the signature &#x60;0x55AA&#x60; which advertises to the BIOS that this _disk_ is bootable (not to be confused with the “bootable” flag that can be set on one partition). Working from the back of the MBR, the next 64 bytes are devoted to the partition table. So only the first 446 bytes are usable for executable code.

![diagram of the first 512 bytes of disk space](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sQo_gx9BpExvVXBNa7hw_FZ1XqhT-yjA0FKwQ3yB8nYo&#x2F;https:&#x2F;&#x2F;metavee.github.io&#x2F;blog&#x2F;images&#x2F;bios-boot&#x2F;mbr.svg) 

## Programming with BIOS interrupts

The programming environment is very barebones. The main thing the BIOS gives you is a set of [BIOS interrupts](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;BIOS%5Finterrupt%5Fcall) \- built-in routines that abstract access to the keyboard, screen, storage devices, and so on. You can print text as if in a terminal, wait for keyboard presses, and read blocks of bytes from disk into memory via [Cylinder-head-sector address](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Cylinder-head-sector) (whether or not the storage device has anything resembling a cylinder - the interface is quite stable).

As the name suggests, BIOS interrupts are called via CPU [interrupt](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Interrupt). In the bootloader context, they operate similarly to external function calls, but CPU interrupts in general show up in various places in systems programming (e.g. in syscalls and debugger breakpoints).

If you are curious about what it looks like, here is a _bootable_ Hello World in bare-metal x86 assembly, reprinted with permission from Óscar Toledo G. ([nanochess.org](https:&#x2F;&#x2F;nanochess.org&#x2F;)).

&#x60;&#x60;&#x60;x86asm
; boot.asm

    org 0x7c00
start:
    push cs
    pop ds
    mov bx,string           ; bx points to &quot;Hello, world\0&quot;
repeat:
    mov al,[bx]             ; Grab one byte from *bx
    test al,al
    je end                  ; Exit loop if we grabbed a null byte
    push bx
    mov ah,0x0e             ; Set up parameters for interrupt
    mov bx,0x000f
    int 0x10                ; Call interrupt to print byte in al
    pop bx
    inc bx                  ; bx +&#x3D; 1
    jmp repeat              ; loop

end:
    jmp $

string:
    db &quot;Hello, world&quot;,0     ; null-terminated string

    times 510-($-$$) db 0
    db 0x55,0xaa            ; Boot signature


&#x60;&#x60;&#x60;

This can actually be assembled with [NASM](https:&#x2F;&#x2F;www.nasm.us&#x2F;) and the resulting image booted with [QEMU](https:&#x2F;&#x2F;www.qemu.org&#x2F;) or any x86 machine. You can run the commands below to see for yourself:

&#x60;&#x60;&#x60;mipsasm
nasm -f bin -o boot.img boot.asm
qemu-system-i386 -cpu base -m 1M -drive if&#x3D;floppy,file&#x3D;boot.img,format&#x3D;raw

&#x60;&#x60;&#x60;

Most instructions take up 1-3 bytes after assembly. If you omit the padding to 512 bytes, the resulting binary is 38 bytes, about a third of which is just the string “Hello, World”. The program does not know how to shut down the machine or idle the CPU, so the final instruction is just an infinite loop.

## The stages of a bootloader

To write a bootloader in the most minimal sense, you would need to load target code from the disk into memory (which can be done with [BIOS interrupt 0x13](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;INT%5F13H)), and execute it using a jump instruction. If your OS works in 16-bit and fits entirely on one floppy disk (such as early versions of DOS), this is easy to achieve within the space limit.

Modern OSes are many orders of magnitude larger, are stored in a more complex way on the disk and have more complex requirements of the CPU and memory. That makes 446 bytes a pretty miniscule space for bootloader code, even if you write in handcrafted assembly. Therefore bootloaders are generally broken into multiple pieces or _stages_. Each stage builds up some functionality, then finds the next stage of the bootloader and hands over execution to it.

Let’s call the piece in the MBR stage 1\. Stage 2 can then be put in a hardcoded location on the same disk, so that stage 1 knows where it is. This generally can’t be a “file” on a regular partition, since its location on disk would shift over time, and stage 1 doesn’t have the ability to locate files by name. Check out [my previous post on filesystems](https:&#x2F;&#x2F;metavee.github.io&#x2F;blog&#x2F;technical&#x2F;2024&#x2F;07&#x2F;24&#x2F;when-has-my-filesystem-actually-mattered.html) for some intuition on why this is non-trivial.

One common approach is to partition the disk in a way that leaves a small gap in between the MBR and the first partition, conventionally about 1 MB. This space will (hopefully) be left completely alone by the OS and user, but is more than enough to house stage 2\. It’s almost like a dedicated bootloader partition, except that it doesn’t take up one of the four entries that the partition table is limited to.

Stage 2 can then switch to 32 or 64 bit mode and add some filesystem drivers, and from there locate and read any other files it needs, which at the very least would be the OS kernel. Or, it may include a more sophisticated next stage that could read a config file or menu from the disk.

Aside: 16-bit modeThe CPU boots in a 16-bit mode called real mode with no memory protection. This is true even of modern x86-64 processors. Just setting up 32 or 64-bit mode takes substantial boilerplate (via [Thassilo Schulze](https:&#x2F;&#x2F;thasso.xyz&#x2F;2024&#x2F;07&#x2F;13&#x2F;setting-up-an-x86-cpu.html)) that would eat into the 446 bytes, so it doesn&#39;t necessarily happen in the MBR. These other modes also lose access to the BIOS interrupts, so it&#39;s important to take these steps in the right order and not paint yourself into a corner. Of course, real mode has a very limited instruction set and can access at most 1 MB of memory, so you wouldn&#39;t want to stay in real mode for too long either. 

## A real-life example: GRUB2

GRUB is a popular open source bootloader. It supports a very wide range of hardware (far from just x86 on BIOS) and operating systems. It follows a process similar to what is described above, but with enough nuance that the docs specifically avoid talking about numbered stages.

In order to support so many different systems, the installation is highly configurable. For example, in systems with very limited disk space, there may not be a full megabyte to spare for the MBR gap. Therefore you can remove certain pieces of functionality (such as support for filesystems that you may not be using, like ZFS). The [GRUB 2.12 documentation boasts](https:&#x2F;&#x2F;www.gnu.org&#x2F;software&#x2F;grub&#x2F;manual&#x2F;grub&#x2F;grub.html#Images) about how small it can be trimmed down to:

&gt; … Usually, it contains enough modules to access &#x60;&#x2F;boot&#x2F;grub&#x60;, and loads everything else (including menu handling, the ability to load target operating systems, and so on) from the file system at run-time. The modular design allows the core image to be kept small, since the areas of disk where it must be installed are often as small as 32KB.

These customizable modules, some of which are packed into the MBR gap and others which are loaded dynamically from files on disk, give GRUB a lot of different functionality. In fact, GRUB’s config file on disk is not _just_ a menu configuration, but executable code (in GRUB’s own scripting language) that describes what modules to load and in what order.

It’s a little crazy - GRUB2 is just a bootloader, but it is also a tiny OS and programming environment. [Look at all these modules](https:&#x2F;&#x2F;www.linux.org&#x2F;threads&#x2F;understanding-the-various-grub-modules.11142&#x2F;):

* a rescue shell and diagnostic tools (&#x60;minicmd&#x60;, &#x60;pcidump&#x60;, &#x60;probe&#x60;)
* support for specific executable file formats (&#x60;elf&#x60;, &#x60;macho&#x60;)
* disk encryption&#x2F;decryption (&#x60;luks&#x60;, &#x60;truecrypt&#x60;)
* support for loading an OS over the network (&#x60;http&#x60;, &#x60;pxe&#x60;, &#x60;tftp&#x60;)
* additional support for booting specific kernels (&#x60;ntldr&#x60;, &#x60;xnu&#x60;, &#x60;multiboot&#x60;)
* various filesystem and hardware drivers

If you’re running GRUB on your system, you may find it interesting to look through the contents of &#x60;&#x2F;boot&#x2F;grub&#x2F;grub.cfg&#x60; and see for yourself what all gets loaded.

This is pure speculation, but I can’t help but wonder if this level of functionality also contributes to GRUB’s reputation of breaking easily, and being hard to repair. There are so many _things_ in GRUB2, and any of them could get messed up.

## What about UEFI?

UEFI is newer and makes things a lot simpler for the aspiring bootloader author. The firmware itself knows more things about filesystems (at least, FAT32) and how to execute binaries (at least, PE32+ binaries) so this removes the toughest constraints of BIOS boot. Some more details can be found on [AdamW’s article on UEFI boot](https:&#x2F;&#x2F;www.happyassassin.net&#x2F;posts&#x2F;2014&#x2F;01&#x2F;25&#x2F;uefi-boot-how-does-that-actually-work-then&#x2F;).

Because of BIOS’s long reign, UEFI bootloaders are obligated to include some compatibility shims like a [protective MBR](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;GUID%5FPartition%5FTable#PROTECTIVE-MBR), even if it just prints an error message to the user to update their firmware.

There’s even a compatibility mode in most motherboards (CSM) to fully emulate a BIOS boot process in case the user needs to use an old bootloader that doesn’t support UEFI. And so the long chain of legacy support continues, for 4 decades and counting.