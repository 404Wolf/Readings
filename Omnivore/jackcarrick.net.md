---
id: f32d4121-df8c-432b-bafd-4d0c0dd9d80c
title: jackcarrick.net
tags:
  - RSS
date_published: 2024-09-24 10:00:00
---

# jackcarrick.net
#Omnivore

[Read on Omnivore](https://omnivore.app/me/jackcarrick-net-19227018e8c)
[Read Original](https://jackcarrick.net/blog/still-processing-forks)



## Still processing forks

## Creating new processes with the &#x60;fork()&#x60; system call

Yesterday, I went through a very simple assembly program that immediately exits with a status code of &#x60;0&#x60;. We accomplished this by invoking a _system call_, which allows us to interact with and request specific resources and services from the kernel. After assembling it into an executable format, we ran it directly via the command line:

&#x60;&#x60;&#x60;elixir
$ .&#x2F;my_program

&#x60;&#x60;&#x60;

Our program ran and terminated. But how does this actually happen? Well, it turns out _everything is a process_. Well, maybe not everything, but all programs currently running on your computer, phone, or smart fridge are processes that began somewhere. Each of these processes came into existence through a mechanism called forking, more specifically a &#x60;fork()&#x60; system call, where a process creates an (almost) exact copy of itself with the same virtual memory, I&#x2F;O devices, sockets, etc. Soon after, the child process (i.e., cloned process) replaces itself with a specific program that differs from the parent. This is kind of weird, though... Let&#39;s look closer at what&#39;s happening under the hood...

### Back to basics

Let&#39;s look back at our interrupt program from yesterday:

&#x60;&#x60;&#x60;x86asm
section .text

global _start

_start:
	MOV eax,1
	MOV ebx,0
	INT 80h

&#x60;&#x60;&#x60;

The value &#x60;eax&#x60; tells the kernel which type of system call we want to perform. We used &#x60;1&#x60; for an &#x60;exit&#x60; call. If we look at this x86 [system call table](https:&#x2F;&#x2F;x86.syscall.sh&#x2F;) we see that right after the &#x60;exit&#x60; call is &#x60;fork&#x60;, which requires us to set &#x60;eax&#x60; to &#x60;2&#x60;. Looks like this call doesn&#39;t have any additional arguments, so we don&#39;t need &#x60;ebx&#x60; set to anything at all. Here&#39;s our new program:

&#x60;&#x60;&#x60;x86asm
section .text

global _start

_start:
	MOV eax,2
	INT 80h

&#x60;&#x60;&#x60;

We want to request a &#x60;fork&#x60; from the kernel, so we use move &#x60;2&#x60; into the &#x60;eax&#x60; register. Let&#39;s assemble and run the program to see what will happen.

&#x60;&#x60;&#x60;elixir
# assemble 
$ nasm -f elf -o fork.o fork.s
$ ld -m elf_i386 -o fork fork.o
# execute
$ .&#x2F;fork

&#x60;&#x60;&#x60;

Uh oh, there&#39;s an error: 

&#x60;&#x60;&#x60;ebnf
Segmentation fault

&#x60;&#x60;&#x60;

On a basic level, [these types of errors](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Segmentation%5Ffault) occur when a user tries to access parts of memory they are not supposed to. Its not yet clear what went wrong in our program, but let&#39;s do some debugging with [GNU Debugger](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;GNU%5FDebugger) or &#x60;gdb&#x60;. 

### Debugging with &#x60;gdb&#x60;

Once we have &#x60;gdb&#x60; installed on our system we can enter the debugger with

&#x60;&#x60;&#x60;elixir
$ gdb fork

&#x60;&#x60;&#x60;

We can set a breakpoint at the beginning of our program and also switch to a better view for assembly debugging:

&#x60;&#x60;&#x60;lisp
(gdb) break _start
(gdb) layout asm

&#x60;&#x60;&#x60;

Let&#39;s start the program with &#x60;run&#x60; and inspect the debugger:

&#x60;&#x60;&#x60;angelscript
B+&gt;0x8049000 &lt;_start&gt;      mov    eax,0x2                      
   0x8049005 &lt;_start+5&gt;    int    0x80                         
...

&#x60;&#x60;&#x60;

We can see the two lines of our &#x60;fork&#x60; program loaded into the memory address at &#x60;0x8049000&#x60;. We can go to the instruction at the first address with &#x60;stepi&#x60;

Ok, we&#39;ve just performed the first instruction, namely to move &#x60;0x2&#x60; into &#x60;eax&#x60;. And now our breakpoint is at . We can even make sure the register is set correctly:

&#x60;&#x60;&#x60;angelscript
(gdb) info registers eax
eax            0x2                 2

&#x60;&#x60;&#x60;

Nice, it&#39;s set to &#x60;2&#x60; as expected. We&#39;re all set for our interrupt. 

&#x60;&#x60;&#x60;angelscript
(gdb) stepi
[Detaching after fork from child process 2142634]
0x08049007 in ?? ()

&#x60;&#x60;&#x60;

Ok, this is weird. Looks like some kind of forking happened, and there was a child process created, but we never exited our program, and now we&#39;re in uncharted territory: memory address ! Let&#39;s see what happens if I go to the next instruction:

&#x60;&#x60;&#x60;fortran
(gdb) stepi
Program received signal SIGSEGV, Segmentation fault.

&#x60;&#x60;&#x60;

Because we are outside of the bounds of the program loaded into memory above, our program fails. This is because our program never called the exit interrupt, so our processes never stop running and keep moving further down the stack. But wait, let&#39;s debug a little more. What if we inspect what&#39;s in the &#x60;eax&#x60; register at this point?

&#x60;&#x60;&#x60;x86asm
(gdb) info registers eax
eax            0x20b208            2142728

&#x60;&#x60;&#x60;

It&#39;s not &#x60;2&#x60; anymore? No, its the process identifier (&#x60;pid&#x60;) of the child process created in our fork above! But we didn&#39;t set that, it was the kernel. 

From the fork man pages (&#x60;man fork&#x60;):

&gt; RETURN VALUE On success, the PID of the child process is returned in the parent, and 0 is returned in the child. On failure, -1 is returned in the parent, no child process is created, and errno is set appropriately.

So, after a successfull fork the &#x60;eax&#x60; register is set to the &#x60;pid&#x60; of the child in the parent program, and &#x60;0&#x60; for the child process. We never saw the &#x60;0&#x60; in the &#x60;eax&#x60; register because &#x60;gdb&#x60; detached from the child process. Our program never exited, so we started going into invalid memory addresses. Let&#39;s adjust our program so it can exit without fail.

### Cleaning things up

Before we write our fixed program we can use a few more tricks in assembly to make our program more straightforward. First, we can add a data section to our program which includes some initialized variables. We&#39;ll just use strings of text for now:

&#x60;&#x60;&#x60;x86asm
section .data
	parent_message db &quot;Parent process exiting&quot;,0xa
	parent_length equ $ - parent_message
	child_message db      &quot;Child process exiting&quot;,0xa
	child_length equ $ - child_message

&#x60;&#x60;&#x60;

We&#39;ll also use the &#x60;cmp&#x60; to compare two values and &#x60;jz&#x60; to jump to a new label if the outcome of the &#x60;cmp&#x60; operation is &#x60;0&#x60;. We&#39;ll also sneak in a new system call, &#x60;SYS_WRITE&#x60;, where we will write a string of text to &#x60;stdout&#x60;. 

Here&#39;s our new program:

&#x60;&#x60;&#x60;x86asm
section .text

global _start

_start:
	mov eax, 2
	int 0x80
	cmp eax, 0 ; check if we are in the child process
	jz child

parent:
	mov edx,parent_length
	mov ecx,parent_message
	call print
	call exit

child:
	mov edx,child_length
	mov ecx,child_message
	call print
	call exit

print:
	mov     ebx,1 ; sets format to stdout
	mov     eax,4 ; SYS_WRITE call
	int     0x80
	ret ; return back to caller (i.e. child or parent)
exit:
	mov ebx,0
	mov eax,1
	int 0x80

section .data
	parent_message db &quot;Parent process exiting&quot;,0xa
	parent_length equ $ - parent_message
	child_message db      &quot;Child process exiting&quot;,0xa
	child_length equ $ - child_message

&#x60;&#x60;&#x60;

We&#39;ve improved the program by checking the exit code of the parent and child process. In both cases, we explicitly call the &#x60;exit&#x60; system call, but only after printing the corresponding string with the system print call. 

Our program runs without error and outputs two strings:

&#x60;&#x60;&#x60;arduino
$ .&#x2F;fixed
Parent process exiting
$ .&#x2F;fixed
Child process exiting

&#x60;&#x60;&#x60;

### Unanswered questions

With the program above, we successfully forked an existing process to create a new one. But the new child process doesn&#39;t do anything other than print and exit. What happens if we want to actually do something entirely different and execute another program in a new process?

It&#39;s still unclear _how_ these programs run relative to each other. How do I tell the OS I want to run one program _first_ before another completes? These are where the &#x60;wait&#x60; and &#x60;exec&#x60; calls come in.