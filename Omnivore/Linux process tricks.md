---
id: e162eef7-27b0-4551-b2cd-16c14b940afb
title: Linux process tricks
tags:
  - RSS
date_published: 2024-08-13 19:05:11
---

# Linux process tricks
#Omnivore

[Read on Omnivore](https://omnivore.app/me/linux-process-tricks-1914e35ea8c)
[Read Original](https://iafisher.com/blog/2024/08/linux-process-tricks)



_Thank you to [Julian Squires](https:&#x2F;&#x2F;www.cipht.net&#x2F;) for his assistance with this project._

Last week I gave a demo at [Recurse Center](https:&#x2F;&#x2F;recurse.com&#x2F;) of the cool and strange things you can do by abusing the &#x60;ptrace&#x60; system call on Linux. I promised at the time that I&#39;d write a blog post explaining how I did it. So here it is. It was a little more magical to demo this live, but hopefully the screen recordings I&#39;ve included below give you some idea.

## Warm-up: Pausing and resuming a process

Here and throughout, &#x60;p&#x60; is the program I wrote that implements these tricks; &#x60;countforever&#x60; is a [simple C program](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;process-magic&#x2F;blob&#x2F;master&#x2F;examples&#x2F;countforever.c) that I use as an example.

## Rewinding a process

## Taking over a running process

Notice how inside the Python interpreter, &#x60;os.getpid()&#x60; reports the same PID as the original program.

## Freezing and thawing a running process

## Manipulating program output

[ROT13](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;ROT13)\-encrypting a Python interpreter session:

What I typed is &#x60;print(&quot;Hello, world!&quot;)&#x60;. The Python interpreter sees the original input, but the output is ROT13-encrypted before being printed to the screen.

Highlighting error output in red:

## How it works

These tricks use two Linux system interfaces: the [ptrace](https:&#x2F;&#x2F;man7.org&#x2F;linux&#x2F;man-pages&#x2F;man2&#x2F;ptrace.2.html) system call, which lets one process trace and control another, and [procfs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Procfs), a filesystem interface for inspecting the status of running processes. &#x60;ptrace&#x60; is what is used by debuggers like GDB, and &#x60;procfs&#x60; is how the &#x60;ps&#x60; command reads information about the processes on your system.

### Syscall injection

Many of the tricks rely on making syscalls from the traced process. Taking over a running process requires making an &#x60;execve&#x60; syscall, for instance. &#x60;ptrace&#x60; can&#39;t do this directly, so you have to do it manually:

1. Get the current registers with &#x60;PTRACE_GETREGSET&#x60;.
2. Set the appropriate register to the syscall number ([this table](https:&#x2F;&#x2F;gpages.juszkiewicz.com.pl&#x2F;syscalls-table&#x2F;syscalls.html) helps), and place the arguments in registers. If the argument is a pointer (e.g., to a string constant), you&#39;ll need to inject the data somewhere in the process&#39;s memory. The registers to use are architecture-specific; on ARM64, the syscall number goes in &#x60;x8&#x60;, and the arguments go in registers &#x60;x0&#x60;, &#x60;x1&#x60;, and so on.
3. Set the program counter to a syscall instruction, either by finding one already in the binary, or by injecting your own.
4. Single-step the program with &#x60;PTRACE_SINGLESTEP&#x60; to execute the syscall.
5. Get the current registers again, and read the syscall result from the return register (&#x60;x0&#x60; on ARM64).
6. Restore the original registers from step 1.

[Here&#39;s](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;process-magic&#x2F;blob&#x2F;ae72fcaa8d7a3c5a149afd69a1f5eb28706ca729&#x2F;src&#x2F;proctool&#x2F;pcontroller.rs#L122) the code. Steps 1 and 6 are omitted from that function, but can be found [elsewhere](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;process-magic&#x2F;blob&#x2F;ae72fcaa8d7a3c5a149afd69a1f5eb28706ca729&#x2F;src&#x2F;proctool&#x2F;bin&#x2F;daemon.rs#L147-L172).

### Pause and resume a process

Pausing and resuming is as simple as calling &#x60;PTRACE_ATTACH&#x60; and &#x60;PTRACE_DETACH&#x60;. The one wrinkle is that the traced process will be automatically detached and restarted if the tracing process exits. So &#x60;p pause&#x60; and &#x60;p resume&#x60; call out to a long-running daemon process that keeps the &#x60;ptrace&#x60; connection alive.

### Take over a running process

I think this is the trick that people were most impressed by, but in fact it&#39;s quite simple. You just need to inject an [execve](https:&#x2F;&#x2F;man7.org&#x2F;linux&#x2F;man-pages&#x2F;man2&#x2F;execve.2.html) syscall and pass the path to the new program as the first argument, using the procedure I described above.

Since &#x60;execve&#x60; takes a string argument, you have to inject that string constant into the process&#39;s memory, either by overwriting some existing part of memory, or else allocating your own memory with &#x60;mmap&#x60;. I chose [the latter approach](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;process-magic&#x2F;blob&#x2F;ae72fcaa8d7a3c5a149afd69a1f5eb28706ca729&#x2F;src&#x2F;proctool&#x2F;pcontroller.rs#L491).

### Rewind a process

Rewinding a process is the same trick as taking it over, except that the process is taken over _by itself_. This is done by reading the program&#39;s original command line from &#x60;&#x2F;proc&#x2F;&lt;pid&gt;&#x2F;cmdline&#x60; and then passing that as the argument to &#x60;execve&#x60;.

### Freeze a running process and thaw it later

This was the most complicated and open-ended trick. The real way to do it is with [CRIU](https:&#x2F;&#x2F;github.com&#x2F;checkpoint-restore&#x2F;criu), a mature project that handles many more cases. For my simple version, I just read the process&#39;s registers with &#x60;ptrace&#x60;, and its memory via ProcFS: &#x60;&#x2F;proc&#x2F;&lt;pid&gt;&#x2F;maps&#x60; has the list of memory regions, and &#x60;&#x2F;proc&#x2F;&lt;pid&gt;&#x2F;mem&#x60; has the actual memory.

The &#x60;thaw&#x60; command forks a child process and uses &#x60;ptrace&#x60; commands to set the registers, set up the memory maps via syscall injection of &#x60;mmap&#x60;, and [process\_vm\_writev](https:&#x2F;&#x2F;man7.org&#x2F;linux&#x2F;man-pages&#x2F;man2&#x2F;process%5Fvm%5Freadv.2.html) to write memory.

My implementation doesn&#39;t work with programs that allocate heap memory, I think because it doesn&#39;t save and restore the &#x60;brk&#x60; pointer properly. It also doesn&#39;t try to restore file descriptors.

### Manipulate program output

The ROT13 and colorizing standard error tricks used the same technique: intercept &#x60;write&#x60; syscalls using &#x60;PTRACE_SYSCALL&#x60; and tamper with the syscall arguments. For ROT13, this was easy because the transformation doesn&#39;t change the length of the string. Colorizing the output requires inserting [ANSI escape codes](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;ANSI%5Fescape%5Fcode), which makes the string longer, so I had to call &#x60;mmap&#x60; to allocate new memory and copy the string over.

### Not done: Teleport a process to another terminal

Another trick I wanted to demonstrate was &quot;teleporting&quot; a process to an arbitrary terminal. I spent a lot of time on this, mainly following [this blog post](https:&#x2F;&#x2F;blog.nelhage.com&#x2F;2011&#x2F;02&#x2F;changing-ctty&#x2F;) about [reptyr](https:&#x2F;&#x2F;github.com&#x2F;nelhage&#x2F;reptyr), but ultimately couldn&#39;t get it working. &#x60;reptyr&#x60; &quot;pulls&quot; a process from its original terminal to the one that &#x60;reptyr&#x60; is running; what I wanted to do was teleport a process to an arbitrary terminal. I followed the arcane sequence of steps from the blog post to get a process to switch to another controlling terminal, and that worked, but the existing shell process in that terminal didn&#39;t cooperate with its new neighbor. In particular, they seemed to fight over input, with some input characters being read by the shell and some being read by the process.

One trick that is simple and doable is redirecting a process&#39;s output to another terminal. You can do this by closing the &#x60;stdout&#x60; file descriptor and reopening it to point to the desired &#x60;&#x2F;dev&#x2F;pts&#x60; device. But the process will still read input from its original terminal, and the new terminal will still be running the shell as its foreground process.

### Not done: Swap the memory of two processes

I wanted to demo swapping the memory of two running Python interpreters, so that symbols defined in one interpreter would be available in the other and vice versa. If I had done freezing and thawing correctly, this would have been a simple corollary: use the &#x60;freeze&#x60; procedure to grab the memory contents of one process, and use &#x60;thaw&#x60; to inject it into the other process. ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2024-08-linux-process-tricks.md).