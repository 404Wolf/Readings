---
id: 73554a14-4a67-4168-b65e-e526c71aa979
title: jackcarrick.net
tags:
  - RSS
date_published: 2024-09-26 15:00:00
---

# jackcarrick.net
#Omnivore

[Read on Omnivore](https://omnivore.app/me/jackcarrick-net-192308c549e)
[Read Original](https://jackcarrick.net/blog/wait-man-man-wait)



## Wait, man...man wait

## Forking, executing, and waiting on processes in x86 assembly

I spent a lot of yesterday combing through &#x60;man&#x60; pages. &#x60;man fork&#x60;, &#x60;man wait&#x60;, &#x60;man sleep&#x60;... sounds like an axiom of some sort. I was trying to debug a simple program in assembly that did three things:

1. Fork a running process
2. Call &#x60;exec&#x60; from the child process
3. Call &#x60;wait&#x60; from the parent process to resume running until the child process completes.

The first two steps went fine. I&#39;d already performed these separately in different programs, so combining them was straightforward. We start out by immediately performing a &#x60;fork&#x60; system call:

&#x60;&#x60;&#x60;smali
mov eax, 2 ; fork() syscall
int 0x80
cmp eax, 0 ; check if we are in the child process
jz child ; if eax &#x3D;&#x3D; 0, jump to child

&#x60;&#x60;&#x60;

In the child process we request the &#x60;execve&#x60; system call by moving the correct arguments:

&#x60;&#x60;&#x60;x86asm
child:
mov eax, 0x0b ; syscall number 11 for execve
mov ebx, filename
mov ecx, argv
mov edx, envp
int 0x80

&#x60;&#x60;&#x60;

In &#x60;gdb&#x60; we can validate the process is forked and the child loads and executes the new program:

&#x60;&#x60;&#x60;routeros
$ gdb
(gdb) layout asm
(gdb) break child
(gdb) set follow-fork-mode child
(gdb) run

&#x60;&#x60;&#x60;

We can &#x60;stepi&#x60; until we get to the exec call and see the &#x60;.&#x2F;sleep&#x60; program from [yesterday](https:&#x2F;&#x2F;jackcarrick.net&#x2F;blog&#x2F;exec-a-whole-new-program) is loaded.

#### Validating system call arguments

I had trouble with the &#x60;wait&#x60; system call in the parent. After I made the wait call (which is code 7) it seemed like it never got successfully invoked. It turns out I wasn&#39;t paying enough attention to the required system call arguments. Let&#39;s have a closer look with &#x60;man wait&#x60;.

&gt; &#x60;wait&#x60;, &#x60;waitpid&#x60;, &#x60;waitid&#x60; \- wait for process to change state&#x60;pid_t waitpid(pid_t pid, int *wstatus, int options); Our system call requires three arguments that are provided in the &#x60;ebx&#x60;, &#x60;ecx&#x60;, and &#x60;edx\&#x60; respectively:

1. &#x60;pid_it d&#x60;: the &#x60;pid&#x60; of the chid process to wait for. If this is set to 0, the parent process will wait for any child who&#39;s process group ID is equal to that of the calling process. If set to &#x60;-1&#x60; the parent will wait for _any child_ to terminate. We&#39;ll just use &#x60;0&#x60; for now.
2. &#x60;int *wstatus&#x60;: a pointer to an integer where the status information of the child is stored.
3. &#x60;int options&#x60;: controls the behavior of the system call. We can ignore this for now and just use &#x60;0&#x60;.

&#x60;&#x60;&#x60;x86asm
section .bss
   status resd 1 ; reserve space for the status variable
...
_start:
...
mov eax, 7 ; wait() syscall number
mov ebx,0
mov ecx,status ; pointer to status variable (for exit status)
mov edx,0
int 0x80

&#x60;&#x60;&#x60;

When I first wrote the program, I&#39;d neglected to add the uninitialized variable &#x60;status&#x60; in the &#x60;.bss&#x60; section. The system call failed, but I didn&#39;t know why. When I inspected the registers after the call, however, I saw &#x60;-22&#x60; in the &#x60;eax&#x60; register. With &#x60;man errno&#x60; we see the 22nd entry to be &#x60;EINVAL&#x60; , or &#x60;Invalid Argument&#x60;. Aside: why are these entries not numbered in the man pages? I had to actually count down 22 error codes to get to &#x60;EINVAL&#x60; ! :thinking\_face:

These types of rejections are security mechanmisms implemented into the kernel.

_From [OSTEP](https:&#x2F;&#x2F;pages.cs.wisc.edu&#x2F;~remzi&#x2F;OSTEP&#x2F;cpu-mechanisms.pdf)_:

&gt; ...the OS must check what the user passes in and ensure that arguments are properly specified, or otherwise reject the call ... In general, a secure system must treat user inputs with great suspicion. Not doing so will undoubtedly lead to easily hacked software, a despairing sense that the world is an unsafe and scary place, and the loss of job security for the all-too-trusting OS developer. \[6\]

Anyway, after fixing this issue and allocating a memory address in the &#x60;.bss&#x60; section our program runs, forks, executes in the child, and waits in the parent for the child process to terminate. Success!

Here&#39;s the entire program:

&#x60;&#x60;&#x60;x86asm
section .data
	filename db &#39;.&#x2F;sleep&#39;, 0 ; the filename (path to the program)
	arg1 db &#39;.&#x2F;sleep&#39;, 0 ; argv[0] (the program name)
	argv dd arg1, 0 ; argv array: {arg1, NULL}
	envp dd 0 ; envp array: {NULL}
	parent_waiting_message db &quot;Parent process is waiting for child process to complete&quot;,0xa
	parent_waiting_length equ $ - parent_waiting_message
	child_completed_message db &quot;Child process complete&quot;,0xa
	child_completed_message_length equ $ - child_completed_message
	child_message db &quot;Child process created, loading new program&quot;,0xa
	child_length equ $ - child_message
	section .bss
	status resd 1 ; reserve space for the status variable

section .text
	global _start

_start:
	mov eax, 2 ; fork() syscall
	int 0x80
	cmp eax, 0 ; check if we are in the child process
	jz child ; if eax &#x3D;&#x3D; 0, jump to child
  
parent:
	mov ecx, parent_waiting_message
	mov edx, parent_waiting_length
	call print
	mov eax, 7 ; wait() syscall number
	mov ebx,0
	mov ecx,status ; pointer to status variable (for exit status)
	mov edx,0
	int 0x80 ; invoke the system call
	jnz exit_with_error ; check if wait() returned an error
	mov ecx, child_completed_message
	mov edx, child_completed_message_length
	call print
	call exit

child:
	mov ecx, child_message
	mov edx, child_length
	call print
	call exec
  
exec:
	mov eax, 0x0b ; syscall number 11 for execve
	mov ebx, filename ; filename -&gt; ebx
	mov ecx, argv ; argv -&gt; ecx
	mov edx, envp ; envp -&gt; edx
	int 0x80 ; make the system call
	call exit

print:
	mov ebx, 1 ; first argument: file handle (stdout)
	mov eax, 4 ; system call number (SYS_WRITE)
	int 0x80
	ret

exit:
	mov ebx, 0 ; return code
	mov eax, 1 ; syscall number for exit
	int 0x80

exit_with_error:
	mov ebx, eax ; return error code in ebx
	mov eax, 1 ; syscall number for exit
	int 0x80

&#x60;&#x60;&#x60;

I&#39;ve added some system call to print status strings to &#x60;stdout&#x60;, as well as added a label to explicitly exit the program with a status code of 1 if the wait process fails.

#### More questions than answers:

I&#39;m still interested in digging into the fork system call, specifically investigating how memory is locked and freed during _context switching_. Maybe performing some write system calls before exec is called in the child would illuminate some of the inner workings of these safety mechanisms, like &quot;copy on write&#39;&quot;.