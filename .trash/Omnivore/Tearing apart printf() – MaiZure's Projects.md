---
id: 3f45e95a-1f69-4550-9034-647fae9968ac
---

# Tearing apart printf() – MaiZure's Projects
#Omnivore

[Read on Omnivore](https://omnivore.app/me/tearing-apart-printf-mai-zure-s-projects-1909e2dc135)
[Read Original](https://www.maizure.org/projects/printf/)


_April 2018_

![layman&#39;s printf()](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;420x180,sUZZfYaQeAghRQAgT-hzwYLDM8ievRt-6smWLieCgEOc&#x2F;https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;fig0.png)

If &#39;Hello World&#39; is the first program for C students, then printf() is probably the first function. I&#39;ve had to answer questions about printf() many times over the years, so I&#39;ve finally set aside time for an informal writeup. The common questions fit roughly in to two forms:

* **Easy:** How does printf mechanically solve the format problem?
* **Complex:** How does printf actually display text on my console?

My usual answer?   
_&quot;Just open up stdio.h and track it down&quot;_

This wild goose chase is not only a great learning experience, but also an interesting test for the dedicated beginner. Will they come back with an answer? If so, how detailed is it? What IS a good answer?

---

## printf() in 30 seconds - TL;DR edition

printf&#39;s execution is tailored to your system and generally goes like this:

![Basic printf execution](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;846x170,s1J-LONoQDkrgkslzgEkXD6klvo7JEouNFk5wjn86xpw&#x2F;https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;Fig1.png)

1. Your application uses printf()
2. Your compiler&#x2F;linker produce a binary. printf is a load-time pointer to your C library
3. Your C runtime fixes up the format and sends the string to the kernel via a generic write
4. Your OS mediates the string&#39;s access to its console representation via a device driver
5. Text appears in your screen

...but you probably already knew all that.

This is the common case for user-space applications running on an off-the-shelf system. (Side-stepping virtual&#x2F;embedded&#x2F;distributed&#x2F;real-mode machines for the moment).

A more complicated answer starts with: It depends -- printf mechanics vary across long list of things: Your compiler toolchain, system architecture to include the operating system, and obviously how you&#39;ve used it in your program. The diagram above is generally correct but precisely useless for any specific situation.

If you&#39;re not impressed, that&#39;s good. Let&#39;s refine it.

---

## printf() in 90 seconds - Interview question edition

![Detailed printf execution](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1280x500,syzacWukEi6ascXjLOV9LDBqt-hACSJoDBRlbN52UDUs&#x2F;https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;Fig1b.png)

1. You include the &lt;stdio.h&gt; header in your application
2. You use printf non-trivially in your app.
3. Your compiler produces object code -- printf is recognized, but unresolved
4. The linker constructs the executable, printf is tagged for run-time resolution
5. You execute your program. Standard library is mapped in the process address space
6. A call to printf() jumps to library code
7. The formatted string is resolved in a temporary buffer
8. Standard library writes to the stdout buffered stream. Eventual kernel write entry
9. Kernel calls a driver write operation for the associated console
10. Console output buffer is updated with the new string
11. Output text appears on your console

Sounds better? There&#39;s still a lot missing, including any mention of system specifics. More things to think about (in no particular order):

* Are we using static or dynamic linkage? Normally printf is run-time linked, but there are exceptions.
* What OS is this? The differences between them are drastic - When&#x2F;how is stdout managed? What is the console and how is it updated? What is the kernel entry&#x2F;syscall procedure...
* Closely related to the OS...what kind of executable is this? If ELF, we need to talk about the GOT &#x2F; PLT. If PE (Windows), then we need an import directory.
* What kind of terminal are you using? Standard laptop&#x2F;desktop? University cluster over ssh? Is this a virtual machine?
* This list could go on forever, and all answers affect what really happens behind the scenes.

---

## Things to know before continuing

The next part is targeted for C beginners who want to explore how functions execute through a complex system. I&#39;m keeping the discussion at a high-level so we can focus on how many parts of the problem contribute to a whole solution. I&#39;ll provide references to source code and technical documents so readers can explore on their own. _**No blog substitutes for authoritative documentation**_.

Now for a more important question:   
 Why do beginners get stuck searching for a detailed answer about basic functions like printf()?

I&#39;ll boil it down to three problems:

**Not understanding the distinct roles of the compiler, standard library, operating system, and hardware.** You can&#39;t look at just one aspect of a system and expect to understand how a function like printf() works. Each component handles a part of the &#39;printf&#39; problem and passes the work to the next using common interfaces along the way. C compilers try to adhere to the ISO C standards. Operating systems may also follow standards such as POSIX&#x2F;SUS. Standardization streamlines interoperability and portability, but with the cost of code complexity. Beginners often struggle following the chain of code, especially when the standard requirements end and the &#39;actual work&#39; begins between the interfaces. The common complaint: Too many seemingly useless function calls between the interface and the work. This is the price of interoperability and there&#39;s no easy + maintainable + scalable way around it!

**Not grasping \[compile&#x2F;link&#x2F;load&#x2F;run\]-time dynamics.** Manual static analysis has limits, and so following any function through the standard library source code inevitably leads to a dead end -- an unresolved jump table, an opaque macro with multiple expansions, or a hard stop at the end: an ambiguous function pointer. In printf&#39;s case, that would be \*write, which the operating system promises will be exist at run-time. Modern compilers and OSs are designed to be multi-platform and thus every possible code path that could exist is visible prior to compilation. Beginners may get lost in a code base where much of the source &#39;compiles away&#39; and functions resolve dynamically at execution. Trivial case: If you call printf() on a basic string without formats, your compiler may emit a call to &#39;puts&#39;, discarding your printf entirely! 

**Not enough exposure to common abstractions used in complex software systems.** Tracing any function through the compiler and OS means working through many disparate ideas in computing. For instance, many I&#x2F;O operations involve the idea of a character stream. Buffering character I&#x2F;O with streams has been part of Unix System V since the early 1980s, thanks in part to Dennis Ritchie, co-author of &#39;The C Programming Language&#39;. Since the 1990s, multiprocessing has become the norm. Tracing printf means stepping around locks, mutexes, semaphores, and other synchronization tools. More recently, i18n has upped the ante for simple console output. All these concepts taken together often distract and overwhelm beginners who are simply trying to understand one core problem.

**_Bottom line:_** Compilers, libraries, operating systems, and hardware are complex; we need to understand how each works together as a system in order to truly understand how printf() works.

---

## printf() in 1000 seconds - TMI edition

_(or &#39;Too-specific-to-apply-to-any-system-except-mine-on-the-day-I-wrote-this edition&#39;)_

The best way to answer these questions is to work through the details on an actual system.

$uname -a
Linux localhost.localdomain 3.10.0-693.el7.x86_64 #1 SMP Tue Aug 22 21:09:27 UTC 2017 x86_64 x86_64 x86_64 GNU&#x2F;Linux

$gcc --version
gcc (GCC) 4.8.5 20150623 (Red Hat 4.8.5-16)
Copyright (C) 2015 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

$ldd --version
ldd (GNU libc) 2.17
Copyright (C) 2012 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
Written by Roland McGrath and Ulrich Drepper.

Key points:

* Linux kernel 3.10 ([source code](https:&#x2F;&#x2F;elixir.bootlin.com&#x2F;linux&#x2F;v3.10&#x2F;source))
* glibc version 2.17 ([source code](https:&#x2F;&#x2F;ftp.gnu.org&#x2F;gnu&#x2F;glibc&#x2F;))
* x86-64 ABI
* GCC version 4.8.5
* CentOS 7

---

### Step 0 - What is printf?

printf() is an idea that the folks at Bell Labs believed in [as early as 1972](http:&#x2F;&#x2F;cm.bell-labs.co&#x2F;who&#x2F;dmr&#x2F;last1120c&#x2F;c11.c): A programmer should be able to produce output using various formats without understanding exactly what&#39;s going on under the hood.

This idea is merely an interface.

The programmer calls printf and the system will handle the rest. That is why you&#39;re presumably reading this article -- hiding implementation details works!

Early compilers supported programmers exclusively through built-in functions. When toolchains became a business in the early 1980s (Manx&#x2F;Aztec C, Lattice C), many provided C and ASM source code for common functions that developers could #include in their projects as needed. This allowed customization of built-ins at the application level -- no more rebuilding your toolchain for each project. However, programmers were still at the mercy of various brands of compilers, each bringing their own vision of how to implement these functions and run-time.

Thankfully, most of this hassel has gone away today. So if you want to use printf...

---

### Step 1 - Include the &lt;stdio.h&gt; header

_Goal:_ Tap into the infinite power of the C standard library

The simple line of code &#x60;#include &lt;stdio.h&gt;&#x60; is possible across the vast majority of computer systems thanks to standards. Specifically, [ISO-9899](http:&#x2F;&#x2F;www.open-std.org&#x2F;jtc1&#x2F;sc22&#x2F;wg14&#x2F;www&#x2F;docs&#x2F;n1570.pdf).

In 1978, Brian Kernighan and Dennis Ritchie [described printf](https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;Fig2.png) in its full variadic form to include nine types of formats:

printf(control, arg1, arg2, ...);    # K&amp;R (1st ed.)

This was as close as the industry would get to a standard for the next decade. Between 1983 and 1989, the ANSI committee worked on the formal standard that eventually brought the printf interface to its [familiar form](https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;Fig3.png):

int printf(const char *format, ...);   # ANSI C (1989)

Here&#39;s an oft-forgotten bit of C trivia: printf returns a value (the actual character output count). The interface from 1978 didn&#39;t mention a return value, but the implied return type is integer under K&amp;R rules. The earliest known compiler (linked above) did not return any value.

The most recent C standard from 2011 shows that the [interface changed](https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;Fig4.png) by only one keyword in the intervening 20 years:

int printf(const char * restrict format, ...);  # Latest ISO C (2011)

&#39;restrict&#39; (a C99 feature) allows the compiler to optimize without concern for pointer aliasing.

Over the past 40 years, the interface for printf is mostly unchanged, thus highly backwards compatible. However, the feature set has grown quite a bit:

| 1972                | 1978                  | 1989                 | 2011                                                                |
| ------------------- | --------------------- | -------------------- | ------------------------------------------------------------------- |
| %d - decimal        | Top 3 from &#39;72        | All from &#39;78 plus... | Too many!                                                           |
| %o - octal          | %x - hexadecimal      | %i - signed int      | Read                                                                |
| %s - string         | %u - unsigned decimal | %p - void pointer    | the                                                                 |
| %p - string ptr     | %c - byte&#x2F;character   | %n - output count    | [manual](http:&#x2F;&#x2F;www.open-std.org&#x2F;jtc1&#x2F;sc22&#x2F;wg14&#x2F;www&#x2F;docs&#x2F;n1570.pdf) |
| %e,f,g - floats&#x2F;dbl | %% - complete form    | pp. 309-315          |                                                                     |

---

### Step 2 - Use printf() with formats

_Goal:_ Make sure your call to printf _actually uses_ printf()

We&#39;ll test out printf() with two small plagarized programs. However, only one of them is truly a candidate to trace printf().

| Trivial printf() - printf0.c                                                                                     | Better printf() - printf1.c                                                                                           |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| $ cat printf0.c #include &lt;stdio.h&gt; int main(int argc, char \*\*argv) {   printf(&quot;Hello World\\n&quot;);   return 0; } | $ cat printf1.c #include &lt;stdio.h&gt; int main(int argc, char \*\*argv) {   printf(&quot;Hello World %d\\n&quot;,1);   return 0; } |

The difference is that printf0.c does not actually contain any formats, thus there is no reason to use printf. Your compiler won&#39;t bother to use it. In fact, you can&#39;t even disable this &#39;optimization&#39; using GCC -O0 because the substitution (fold) happens [during semantic analysis](https:&#x2F;&#x2F;github.com&#x2F;gcc-mirror&#x2F;gcc&#x2F;blob&#x2F;master&#x2F;gcc&#x2F;gimple-fold.c#L3428) (GCC lingo: Gimplification), not during optimization. To see this in action, we must compile!

_Possible trap:_ Some compilers may recognize the &#39;1&#39; literal used in printf1.c, fold it in to the string, and avoid printf() in both cases. If that happens to you, substitute an expression that must be evaluated.

---

### Step 3 - Compiler produces object code 

_Goal:_ Organize the components (symbols) of your application

Compiling programs results in an object file, which contains records of every symbol in the source file. Each .c file compiles to a .o file but none of seen any other files (no linking yet). Let&#39;s look at the symbols in both of the programs from the last step. 

| Trivial printf()                                                                               | More useful printf()                                                                             |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| $ gcc printf0.c -c -o printf0.o $ nm printf0.o 0000000000000000 T main                  U puts | $ gcc printf1.c -c -o printf1.o $ nm printf1.o 0000000000000000 T main                  U printf |

As expected, the trivial printf usage has a symbol to a more simple function, puts. The file that included a format instead as a symbol for printf. In both cases, the symbol is undefined. The compiler doesn&#39;t know where puts() or printf() are defined, but it knows that they exist thanks to stdio.h. It&#39;s up to the linker to resolve the symbols.

---

### Step 4 - Linking brings it all together

_Goal:_ Build a binary that includes all code in one package

Let&#39;s compile and linking both files again, this time both statically and dynamically.

$ gcc printf0.c -o printf0            # Trivial printf dynamic linking
$ gcc printf1.c -o printf1            # Better printf dynamic linking
$ gcc printf0.c -o printf0_s -static  # Trivial printf static linking
$ gcc printf1.c -o printf1_s -static  # Better printf static linking

_Possible trap:_ You need to have the static standard library available to statically link (libc.a). Most systems already have the shared library built-in (libc.so). Windows users will need a libc.lib and maybe a libmsvcrt.lib. I haven&#39;t tested in an MS environment in a while.

Static linking pulls all the standard library object code in to the executable. The benefit for us is that all of the code executed in user space is now self-contained in this single file and we can easily trace to see the standard library functions. In real life, you rarely want to do this. This disadvantages are just too great, especially for maintainability. Here&#39;s an obvious disadvantage:

$ ls -l printf1*
total 1696
-rwxrwxr-x. 1 maiz maiz   8520 Mar 31 13:38 printf1     # Dynamic
-rw-rw-r--. 1 maiz maiz    101 Mar 31 12:57 printf1.c
-rw-rw-r--. 1 maiz maiz   1520 Mar 31 13:37 printf1.o
-rwxrwxr-x. 1 maiz maiz 844000 Mar 31 13:40 printf1_s   # Static

Our test binary blew up from 8kb to 844kb. Let&#39;s take a look at the symbol count in each:

$ nm printf1.o | wc -l
2                      # Object file symbol count (main, printf)
$ nm printf1 | wc -l
34                     # Dynamic-linked binary symbol count
$ nm printf1_s | wc -l
1873                   # Static-linked binary symbol count

Our original, unlinked object file had just the two symbols we already saw (main and printf). The dynamic-linked binary has 34 symbols, most of which correspond to the C runtime, which sets up the environment. Finally, our static-linked binary has nearly 2000 symbols, which include everything that could be used from the standard library.

As you may know, this has a significant impact on load-time and run-time

---

### Step 5 - Loader prepares the run-time

_Goal:_ Set up the execution environment

The dynamic-linked binary has more work to do than its static brother. The static version included 1873 symbols, but the dynamic binary only inluded 34 with the binary. It needs to find the code in shared libraries and memory map it in to the process address space. We can watch this in action by using &#x60;strace&#x60;.

#### Dynamic-linked printf() syscall trace

$ strace .&#x2F;printf1
execve(&quot;.&#x2F;printf1&quot;, [&quot;.&#x2F;printf1&quot;], [&#x2F;* 47 vars *&#x2F;]) &#x3D; 0
brk(NULL) &#x3D; 0x1dde000
mmap(NULL, 4096, ..., -1, 0) &#x3D; 0x7f59bce82000
access(&quot;&#x2F;etc&#x2F;ld.so.preload&quot;, R_OK) &#x3D; -1 ENOENT
open(&quot;&#x2F;etc&#x2F;ld.so.cache&quot;, O_RDONLY|O_CLOEXEC) &#x3D; 3
fstat(3, {st_mode&#x3D;S_IFREG|0644, st_size&#x3D;83694, ...}) &#x3D; 0
mmap(NULL, 83694, PROT_READ, MAP_PRIVATE, 3, 0) &#x3D; 0x7f59bce6d000
close(3) &#x3D; 0
open(&quot;&#x2F;lib64&#x2F;libc.so.6&quot;, O_RDONLY|O_CLOEXEC) &#x3D; 3
read(3, &quot;\177ELF&quot;..., 832) &#x3D; 832
fstat(3, {st_mode&#x3D;S_IFREG|0755, st_size&#x3D;2127336, ...}) &#x3D; 0
mmap(NULL, 3940800, ..., 3, 0) &#x3D; 0x7f59bc89f000
mprotect(0x7f59bca57000, 2097152, PROT_NONE) &#x3D; 0
mmap(0x7f59bcc57000, 24576, ..., 3, 0x1b8000) &#x3D; 0x7f59bcc57000
mmap(0x7f59bcc5d000, 16832, ..., -1, 0) &#x3D; 0x7f59bcc5d000
close(3) &#x3D; 0
mmap(NULL, 4096, ..., -1, 0) &#x3D; 0x7f59bce6c000
mmap(NULL, 8192, ..., -1, 0) &#x3D; 0x7f59bce6a000
arch_prctl(ARCH_SET_FS, 0x7f59bce6a740) &#x3D; 0
mprotect(0x7f59bcc57000, 16384, PROT_READ) &#x3D; 0
mprotect(0x600000, 4096, PROT_READ) &#x3D; 0
mprotect(0x7f59bce83000, 4096, PROT_READ) &#x3D; 0
munmap(0x7f59bce6d000, 83694) &#x3D; 0
fstat(1, {st_mode&#x3D;S_IFCHR|0620, st_rdev&#x3D;makedev(136, 0), ...}) &#x3D; 0
mmap(NULL, 4096, ..., -1, 0) &#x3D; 0x7f59bce81000
write(1, &quot;Hello World 1\n&quot;, 14Hello World 1) &#x3D; 14
exit_group(0) &#x3D; ?
+++ exited with 0 +++

Each line is a syscall. The first is just after bash clones in to printf1\_s, and the write syscall is near the bottom. The 21 syscalls between &#x60;brk&#x60; and the final &#x60;fstat&#x60; are devoted to loading shared libraries. This is the load-time penalty for dynamic-linking. Don&#39;t worry if this seems like a mess, we won&#39;t be using it. If you&#39;re interested in more detail, here is the [full dump with walkthrough](https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;dynamic%5Fstrace%5Fwalkthrough.txt)

Now let&#39;s look at the memory map for the process

#### Dynamic-linked printf() memory map

$ cat &#x2F;proc&#x2F;3177&#x2F;maps
00400000-00401000 r-xp 00000000         .&#x2F;printf1
00600000-00601000 r--p 00000000         .&#x2F;printf1
00601000-00602000 rw-p 00001000         .&#x2F;printf1
7f59bc89f000-7f59bca57000 r-xp 00000000 &#x2F;usr&#x2F;lib64&#x2F;libc-2.17.so
7f59bca57000-7f59bcc57000 ---p 001b8000 &#x2F;usr&#x2F;lib64&#x2F;libc-2.17.so
7f59bcc57000-7f59bcc5b000 r--p 001b8000 &#x2F;usr&#x2F;lib64&#x2F;libc-2.17.so
7f59bcc5b000-7f59bcc5d000 rw-p 001bc000 &#x2F;usr&#x2F;lib64&#x2F;libc-2.17.so
7f59bcc5d000-7f59bcc62000 rw-p 00000000  
7f59bcc62000-7f59bcc83000 r-xp 00000000 &#x2F;usr&#x2F;lib64&#x2F;ld-2.17.so
7f59bce6a000-7f59bce6d000 rw-p 00000000  
7f59bce81000-7f59bce83000 rw-p 00000000  
7f59bce83000-7f59bce84000 r--p 00021000 &#x2F;usr&#x2F;lib64&#x2F;ld-2.17.so
7f59bce84000-7f59bce85000 rw-p 00022000 &#x2F;usr&#x2F;lib64&#x2F;ld-2.17.so
7f59bce85000-7f59bce86000 rw-p 00000000  
7fff89031000-7fff89052000 rw-p 00000000 [stack]
7fff8914e000-7fff89150000 r-xp 00000000 [vdso]
ffffffffff600000-ffffffffff601000 r-xp  [vsyscall]

Our 8kb binary fits in to three 4kb memory pages (top three lines). The standard library has been mapped in to the \~middle of the address space. Code execution begins in the code area at the top, and jumps in to the shared library as needed.

This is the last I&#39;ll mention the dynamic-linked version. We&#39;ll use the static version from now on since it&#39;s easier to trace.

#### Static-linked printf() syscall trace

$ strace .&#x2F;printf1_s
execve(&quot;.&#x2F;printf1_s&quot;, [&quot;.&#x2F;printf1_s&quot;],[&#x2F;*47 vars*&#x2F;]) &#x3D; 0
uname({sysname&#x3D;&quot;Linux&quot;, nodename&#x3D;&quot;...&quot;, ...}) &#x3D; 0
brk(NULL) &#x3D; 0x1d4a000
brk(0x1d4b1c0) &#x3D; 0x1d4b1c0
arch_prctl(ARCH_SET_FS, 0x1d4a880) &#x3D; 0
brk(0x1d6c1c0) &#x3D; 0x1d6c1c0
brk(0x1d6d000) &#x3D; 0x1d6d000
**fstat(1, {st_mode&#x3D;S_IFCHR|0620, st_rdev&#x3D;makedev(136, 0), ...}) &#x3D; 0**
**mmap(NULL, 4096, ..., -1, 0) &#x3D; 0x7faad3151000**
**write(1, &quot;Hello World 1\n&quot;, 14Hello World 1) &#x3D; 14**
exit_group(0) &#x3D; ?
+++ exited with 0 +++

The static-linked binary uses far fewer syscalls. I&#39;ve highlighted three of them near the bottom: &#x60;fstat&#x60;, &#x60;mmap&#x60;, and &#x60;write&#x60;. These occur during printf(). We&#39;ll trace this better in the next step. First, let&#39;s look at the static memory map:

#### Static-linked printf() memory map

$ cat &#x2F;proc&#x2F;3237&#x2F;printf1_s
00400000-004b8000 r-xp 00000000         .&#x2F;printf1_s
006b7000-006ba000 rw-p 000b7000         .&#x2F;printf1_s
006ba000-006df000 rw-p 00000000         [heap]
7ffff7ffc000-7ffff7ffd000 rw-p 00000000 
7ffff7ffd000-7ffff7fff000 r-xp 00000000 [vdso]
7ffffffde000-7ffffffff000 rw-p 00000000 [stack]
ffffffffff600000-ffffffffff601000 r-xp  [vsyscall]

No hint of a shared library. That&#39;s because all the code is now included on the first two lines within the printf1\_s binary. The static binary is using 187 pages of memory, just short of 800kb. This follows what we know about the large binary size.

Now we&#39;ll move on to the more interesting part: execution.

---

### Step 6 - printf call jumps to the standard library

_Goal:_ Follow the standard library call sequence at run-time

The programmer shapes code for the printf interface then the run-time library bridges the standard API and the OS interface.

**Key point:** A compiler&#x2F;library is free to handle logic any way it wants between interfaces. After printf is called, there is no standard defined procedure required, except that the correct output is produced and within certain boundaries. There are many possible paths to the output, and every toolchain handles it differently. In general, this work is done in two parts: A platform-independent side where a call to printf solves the format substitution problem (Step-6, Step 7). The other is a platform-dependent side, which calls in to the OS kernel using the properly-formatted string (Step 8).

The next three steps will focus solely on the static-linked version of printf. It&#39;s less tedious to trace static-linked source, especially through the kernel in the next few steps. Note that the number of instructions executed between both are \~2300 for dynamic and \~1600 for static.

In addition to printf, compliant C compilers also implement:

fprintf() \- A generalized version of printf except the output can go to any file stream, not just the console. fprintf is notable the C standard defines supported format types in its description. fprintf() isn&#39;t used, but it&#39;s good to know about since it&#39;s related to the next function

vfprintf() \- Similar to fprintf except the variadic arguments are reduced to a single pointer to a va\_list. libc does almost all printing work in this function, including format replacement. (f)printf merely calls vfprintf almost immediately. vfprintf then uses the libio interface to write final strings to streams.

These high-level print functions obey [buffering rules](https:&#x2F;&#x2F;www.gnu.org&#x2F;software&#x2F;libc&#x2F;manual&#x2F;html%5Fnode&#x2F;Buffering-Concepts.html) defined on the stream descriptor. The output string is constructed in the buffer using internal GCC (libio) functions. Finally, write is the final step before handing work to the kernel. If you aren&#39;t familiar with how these work, I recommend reading about [the GCC way](https:&#x2F;&#x2F;www.gnu.org&#x2F;software&#x2F;libc&#x2F;manual&#x2F;html%5Fnode&#x2F;I%5F002fO-Overview.html) of managing I&#x2F;O

Bonus: [Some extra reading](http:&#x2F;&#x2F;www.pixelbeat.org&#x2F;programming&#x2F;stdio%5Fbuffering&#x2F;) about buffering with nice diagrams

Let&#39;s trace our path through the standard library

| |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |  |
| printf() execution sequence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |  |
| ...printf execution continued                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |  |
| |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |  |
| $ gdb .&#x2F;printf1_s ... main at printf1.c:5 5  printf(&quot;Hello World %d\n&quot;, 1); 0x400e02 5  printf(&quot;Hello World %d\n&quot;, 1); 0x401d30 in printf () 0x414600 in vfprintf () 0x40c110 in strchrnul () 0x414692 in vfprintf () 0x423c10 in _IO_new_file_xsputn () 0x424ba0 in _IO_new_file_overflow () 0x425ce0 in _IO_doallocbuf () 0x4614f0 in _IO_file_doallocate () 0x4235d0 in _IO_file_stat () 0x40f8b0 in _fxstat ()   **### fstat syscall** 0x461515 in _IO_file_doallocate () 0x410690 in mmap64 ()   **### mmap syscall** 0x46155e in _IO_file_doallocate () 0x425c70 in _IO_setb () 0x461578 in _IO_file_doallocate () 0x425d15 in _IO_doallocbuf () 0x424d38 in _IO_new_file_overflow () 0x4243c0 in _IO_new_do_write () 0x423cc1 in _IO_new_file_xsputn () 0x425dc0 in _IO_default_xsputn ()  ...cut 11 repeats of last 2 functions... 0x425e7c in _IO_default_xsputn () |  |
| 0x423d02 in _IO_new_file_xsputn () 0x41475e in vfprintf () 0x414360 in _itoa_word () 0x4152bb in vfprintf () 0x423c10 in _IO_new_file_xsputn () 0x40b840 in mempcpy () 0x423c6d in _IO_new_file_xsputn () 0x41501f in vfprintf () 0x40c110 in strchrnul () 0x414d1e in vfprintf () 0x423c10 in _IO_new_file_xsputn () 0x40b840 in mempcpy () 0x423c6d in _IO_new_file_xsputn () 0x424ba0 in _IO_new_file_overflow () 0x4243c0 in _IO_new_do_write () 0x4235e0 in _IO_new_file_write () 0x40f9c7 in write () 0x40f9c9 in __write_nocancel ()   **### write syscall happens here** 0x423623 in _IO_new_file_write () 0x42443c in _IO_new_do_write () 0x423cc1 in _IO_new_file_xsputn () 0x414d3b in vfprintf () 0x408450 in free () 0x41478b in vfprintf () 0x408450 in free () 0x414793 in vfprintf () 0x401dc6 in printf () main at printf1.c:6                              |  |


This call trace shows the entire execution for this printf example. If you stare closely at this code trace, we can follow this basic logic:

* printf passes string and formats to vfprintf
* vfprintf starts to parse and attempts its first buffered write
* Oops - buffer needs to be allocated. Let&#39;s find some memory
* vfprintf back to parsing...
* Copy some results to a final location
* We&#39;re done -- call write()
* Clean up this mess

Let&#39;s look at some of the functions:

&#x60;_IO_*&#x60;These functions are part of [GCC&#39;s libio module](https:&#x2F;&#x2F;github.com&#x2F;bminor&#x2F;glibc&#x2F;tree&#x2F;master&#x2F;libio), which manage the internal stream buffer. Just looking at the names, we can guess that there is a lot of writing and memory allocation. The source code for most of these operations is in the files [fileops.c](https:&#x2F;&#x2F;github.com&#x2F;bminor&#x2F;glibc&#x2F;blob&#x2F;master&#x2F;libio&#x2F;fileops.c) and [genops.c](https:&#x2F;&#x2F;github.com&#x2F;bminor&#x2F;glibc&#x2F;blob&#x2F;master&#x2F;libio&#x2F;genops.c).

&#x60;_fxstat&#x60; pulls the state of file descriptors. Since this is system dependent, it&#39;s located at [&#x2F;sysdeps&#x2F;unix&#x2F;sysv&#x2F;linux&#x2F;fxstat64.c](https:&#x2F;&#x2F;github.com&#x2F;bminor&#x2F;glibc&#x2F;blob&#x2F;master&#x2F;sysdeps&#x2F;unix&#x2F;sysv&#x2F;linux&#x2F;fxstat64.c).

The remaining functions are covered in detail in the next two steps.

Let&#39;s dig more!

---

### Step 7 - Format string resolved

_Goal:_ Solve the format problem

Let&#39;s think about our input string, &#x60;Hello World %d\n&#x60;. There are three distinct sections that need to be processed as we scan across is from left to right.

* &#x60;&#39;Hello World &#39;&#x60; \- simple put
* &#x60;%d&#x60; \- substitute the integer literal &#39;1&#39;
* &#x60;\n&#x60; \- simple put

Now referring back to our trace, we can find three code sections that suggest where to look for the formatting work:

0x400e02 5  printf(&quot;Hello World %d\n&quot;, 1);
0x401d30 in printf ()
0x414600 in vfprintf ()
0x40c110 in strchrnul ()           **# string scanning**
0x414692 in vfprintf ()
0x423c10 in _IO_new_file_xsputn () **# buffering &#39;Hello World &#39;**
...
0x41475e in vfprintf ()
0x414360 in _itoa_word ()          **# converting integer**
0x4152bb in vfprintf ()
0x423c10 in _IO_new_file_xsputn () **# buffering &#39;1&#39;**
...
0x41501f in vfprintf ()
0x40c110 in strchrnul ()           **# string scanning**
0x414d1e in vfprintf ()
0x423c10 in _IO_new_file_xsputn () **# buffering &#39;\n&#39;**
...

A few function calls after that final vfprintf() call is the hand off to the kernel. The formatting must have happened in vfprintf between the instructions indicated above. All substitutions handed pointers to the finished string to libio for line buffering. Let&#39;s take a peek at the first round only:

The hand off to xsputn requires vfprintf to identify the start location in the string and a size. The start is already known (current position), but it&#39;s up to strchrnul() to find a pointer to the start of the next &#39;%&#39; or the end of string. We can follow the parsing rules in GCC source code (&#x2F;stdio-common&#x2F;printf-\*).

from glibc&#x2F;stdio-common&#x2F;printf-parse.h:

&#x2F;* Find the next spec in FORMAT, or the end of the string.  Returns
   a pointer into FORMAT, to a &#39;%&#39; or a &#39;\0&#39;.  *&#x2F;
__extern_always_inline const unsigned char *
__find_specmb (const unsigned char *format)
{
  return (const unsigned char *) __strchrnul ((const char *) format, &#39;%&#39;);
}

Or we can look in the compiled binary (my preferred timesink):

in vfprintf:
  0x414668 &lt;+104&gt;: mov    esi,0x25   **# Setting ESI to the &#39;%&#39; symbol**
  0x41466d &lt;+109&gt;: mov    rdi,r12    **# Pointing RDI to the format string**
  ...saving arguments...
  0x41468d &lt;+141&gt;: call   0x40c110 &lt;strchrnul&gt; **# Search for next % or end**

in strchrnul:
  0x40c110 &lt;+0&gt;: movd   xmm1,esi   **# Loading up an SSE register with &#39;%&#39;**
  0x40c114 &lt;+4&gt;: mov    rcx,rdi    **# Moving the format string pointer**
  0x40c117 &lt;+7&gt;: punpcklbw xmm1,xmm1 **# Vector-izing &#39;%&#39; for a fast compare**
  ...eventual return of a pointer to the next token...

Long story short, we&#39;ve located where formats are found and processed.

That&#39;s going to be the limit of peeking at source code for glibc. I don&#39;t want this article to become an ugly mess. In any case, the buffer is ready to go after all three format processing steps.

---

### Step 8 - Final string written to standard output

_Goal:_ Follow events leading up to the kernel syscall

The formatted string, &quot;Hello World 1&quot;, now lives in a buffer as part of the stdout file stream. stdout to a console is [usually line buffered](https:&#x2F;&#x2F;www.gnu.org&#x2F;software&#x2F;libc&#x2F;manual&#x2F;html%5Fnode&#x2F;Buffering-Concepts.html), but exceptions do exist. All cases for console stdout eventually lead to the &#39;write&#39; syscall, which is prototyped for the particular system. UNIX(-like) systems conform to the POSIX standard, if only unofficially. POSIX defines the [write syscall](http:&#x2F;&#x2F;pubs.opengroup.org&#x2F;onlinepubs&#x2F;9699919799&#x2F;functions&#x2F;write.html):

ssize_t write(int fildes, const void *buf, size_t nbyte);

From the trace in step 6, recall that the functions leading up to the syscall are:

0x4235e0 in _IO_new_file_write ()  # libio&#x2F;fileops.c
0x40f9c7 in write ()               # sysdeps&#x2F;unix&#x2F;sysv&#x2F;linux&#x2F;write.c
0x40f9c9 in __write_nocancel ()    # various macros in libc and linux
  **### write syscall happens here**

The link between the compiler and operating system is the ABI, and is architecture dependent. That&#39;s why we see a jump from libc&#39;s libio code to our test case architecture code under (gcc)&#x2F;sysdeps. When your standard library and OS is compiled for your system, these links are resolved and only the applicable ABI remains. The resulting write call is best understood by looking at the object code in our program (printf1\_s).

First, let&#39;s tackle one of the common complaints from beginners reading glibc source code...the 1000 difference ways write() appears. At the binary level, this problem goes away after static-linking. In our case, write() &#x3D;&#x3D; \_\_write() &#x3D;&#x3D; \_\_libc\_write()

$ nm printf1_s | grep write
6b8b20 D _dl_load_write_lock
41f070 W fwrite
400575 t _i18n_number_rewrite
40077f t _i18n_number_rewrite
427020 T _IO_default_write
4243c0 W _IO_do_write
4235e0 W _IO_file_write
41f070 T _IO_fwrite
4243c0 T _IO_new_do_write
4235e0 T _IO_new_file_write
421c30 T _IO_wdo_write
**40f9c0 T __libc_write     ## Real write in symbol table**
43b220 T __libc_writev
**40f9c0 W write            ## Same address -- weak symbol**
**40f9c0 W __write          ## Same address -- weak symbol**
40f9c9 T __write_nocancel
43b220 W writev
43b220 T __writev

So any reference to these symbols actually jumps to the same executable code. For what it&#39;s worth, writev() &#x3D;&#x3D; \_\_writev(), and fwrite() &#x3D;&#x3D; \_IO\_fwrite

And what does \_\_libc\_write look like...?

000000000040f9c0 &lt;__libc_write&gt;:
  40f9c0:  83 3d c5 bb 2a 00 00   cmpl   $0x0,0x2abbc5(%rip)  # 6bb58c &lt;__libc_multiple_threads&gt;
  40f9c7:  75 14                  jne    40f9dd &lt;__write_nocancel+0x14&gt;

000000000040f9c9 &lt;__write_nocancel&gt;:
  40f9c9:	b8 01 00 00 00       	mov    $0x1,%eax
  40f9ce:	0f 05                	syscall 
  ...cut...

Write simply checks the threading state and, assuming all is well, moves the write syscall number (1) in to EAX and enters the kernel.

Some notes:

* x86-64 Linux write syscall is 1, old x86 was 4
* rdi refers to stdout
* rsi points to the string
* rdx is the string size count

---

### Step 9 - Driver writes output string

_Goal:_ Show the execution steps from syscall to driver

Now we&#39;re in the kernel with rdi, rsi, and rdx holding the call parameters. Console behavior in the kernel depends on your current environment. Two opposing cases are if you&#39;re printing to native console&#x2F;CLI or in a desktop pseudoterminal, such as GNOME Terminal.

I tested both types of terminals on my system and I&#39;ll walk through the desktop pseudoterminal case. Counter-intuitively, the desktop environment is easier to explain despite the extra layers of work. The PTY is also much faster -- the process has exclusive use of the pty where as many processes are aware of (and contend for) the native console.

We need to track code execution within the kernel, so let&#39;s give Ftrace a shot. We&#39;ll start by making a short script that activates tracing, runs our program, and deactivates tracing. Although execution only lasts for a few milliseconds, that&#39;s long enough to produce tens or hundreds of thousands of lines of kernel activity.

#!&#x2F;bin&#x2F;sh
echo function_graph &gt; &#x2F;sys&#x2F;kernel&#x2F;debug&#x2F;tracing&#x2F;current_tracer
echo 1 &gt; &#x2F;sys&#x2F;kernel&#x2F;debug&#x2F;tracing&#x2F;tracing_on
.&#x2F;printf1_s
echo 0 &gt; &#x2F;sys&#x2F;kernel&#x2F;debug&#x2F;tracing&#x2F;tracing_on
cat &#x2F;sys&#x2F;kernel&#x2F;debug&#x2F;tracing&#x2F;trace &gt; output

Here is what happens after our static-linked printf executes the write syscall in a GNOME Terminal:

7)           | SyS_write() {
7)           |  vfs_write() {
7)           |   tty_write() {
7) 0.053 us  |    tty_paranoia_check();
7)           |    n_tty_write() {
7) 0.091 us  |     process_echoes();
7)           |     add_wait_queue()
7) 0.026 us  |     tty_hung_up_p();
7)           |     tty_write_room()
7)           |     pty_write() {
7)           |      tty_insert_flip_string_fixed_flag()
7)           |      tty_flip_buffer_push() {
7)           |       queue_work_on()
7)+10.288 us |      } &#x2F;* tty_flip_buffer_push *&#x2F;
7)           |      tty_wakeup() 
7)+14.687 us |     } &#x2F;* pty_write *&#x2F;
7)+57.252 us |    } &#x2F;* n_tty_write *&#x2F;
7)+61.647 us |   } &#x2F;* tty_write *&#x2F;
7)+64.106 us |  } &#x2F;* vfs_write *&#x2F;
7)+64.611 us | } &#x2F;* SyS_write *&#x2F;

 This output has been culled to fit this screen. Over 1000 lines of kernel activity were cut within SyS\_write, most of which were locks and the kernel scheduler. The total time spent in kernel is 65 microseconds. This is in stark contrast to the native terminal, [which took over 6800 microseconds!](https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;consolektrace.txt)

Now is a good time to step back and think about how pseudoterminals are implemented. As I was researching a good way to explain it, I happened upon an [excellent write up](http:&#x2F;&#x2F;www.linusakesson.net&#x2F;programming&#x2F;tty&#x2F;) by Linus Åkesson. He explains far better than I could. [This diagram](http:&#x2F;&#x2F;www.linusakesson.net&#x2F;programming&#x2F;tty&#x2F;case4.png) he drew up fits our case perfectly.

The TL;DR version is that pseudoterminals have a master and a slave side. A TTY driver provides the slave functionality while the master side is controlled by a terminal process.

Let&#39;s demonstrate that on my system. Recall that I&#39;m testing through a gnome-terminal window.

$ .&#x2F;printf1_s
Hello World 1
^Z
[1]+  Stopped                 .&#x2F;printf1_s
$ top -o TTY
![printf tty&#x2F;pts usage](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;896x132,s7ocvdVSSsmraygZ-gjINmxEkTULmjzRUmtnsjcupl2g&#x2F;https:&#x2F;&#x2F;www.maizure.org&#x2F;projects&#x2F;printf&#x2F;printf-top.png)

bash is our terminal parent process using pts&#x2F;0\. The shell forked (cloned) top and printf. Both inherited the bash stdin and stdout.

Let&#39;s take a closer look at the pts&#x2F;0 device the kernel associates with our printf1\_s process.

$ ls -l &#x2F;dev&#x2F;pts&#x2F;0
crw--w----. 1 maizure tty 136, 0 Apr  1 09:55 &#x2F;dev&#x2F;pts&#x2F;0

Notice that the pseudoterminal itself is associated with a regular tty device. It also has a major number 136\. What&#39;s that?

From this linux kernel version [source](https:&#x2F;&#x2F;elixir.bootlin.com&#x2F;linux&#x2F;v3.10&#x2F;source&#x2F;include&#x2F;uapi&#x2F;linux&#x2F;major.h#L144): &#x60;include&#x2F;uapi&#x2F;linux&#x2F;major.h&#x60;

...
#define UNIX98_PTY_MASTER_MAJOR	128
#define UNIX98_PTY_MAJOR_COUNT	8
#define UNIX98_PTY_SLAVE_MAJOR	(UNIX98_PTY_MASTER_MAJOR+UNIX98_PTY_MAJOR_COUNT)
...

Yes, this major number is associated with a pseudoterminal slave (Master &#x3D; 128, Slave &#x3D; 128 + 8 &#x3D; 136). A tty driver is responsible for its operation. If we revisit our write syscall trace, this makes sense:

...cut from earlier
7)           |  pty_write() {
7)           |      tty_insert_flip_string_fixed_flag()
7)           |      tty_flip_buffer_push() {
7)           |          queue_work_on()
7)+10.288 us |      }
7)           |      tty_wakeup() 
7)+14.687 us |  } &#x2F;* pty_write *&#x2F;
...

The [pty\_write() function](https:&#x2F;&#x2F;elixir.bootlin.com&#x2F;linux&#x2F;v3.10&#x2F;source&#x2F;drivers&#x2F;tty&#x2F;pty.c#L117) invokes tty\_\* operations, which we assume moves &#39;Hello World 1&#39; to the console. So where is this console?

---

### Step 10 - Console output buffer is updated

_Goal: Put the string to the console attached to stdout_

The first argument to pty\_write is &#x60;struct tty_struct *tty&#x60;. [This struct](https:&#x2F;&#x2F;elixir.bootlin.com&#x2F;linux&#x2F;v3.10&#x2F;source&#x2F;include&#x2F;linux&#x2F;tty.h#L232) contains the console, which is created with each unique tty process. In this case, the parent terminal created the pts&#x2F;0 console and each child simply points to it.

The tty has many interesting parts to look at: line discipline, driver operations, the tty buffer(s), the tty\_port. In the interest of space, I&#39;m not going to cover tty initialization since it&#39;s not on the direct path for printf -- the process was created, the tty exists, and it wants this &#39;Hello World 1&#39; right now!

The string is copied to the input queue in &#x60;tty_insert_flip_string_fixed_flag()&#x60;. 

memcpy(tb-&gt;char_buf_ptr + tb-&gt;used, chars, space); 
memset(tb-&gt;flag_buf_ptr + tb-&gt;used, flag, space);
tb-&gt;used +&#x3D; space;
copied +&#x3D; space;
chars +&#x3D; space;

This moves the data and flags to the current flip buffer. The console state is updated and the buffer [is pushed](https:&#x2F;&#x2F;elixir.bootlin.com&#x2F;linux&#x2F;v3.10&#x2F;source&#x2F;drivers&#x2F;tty&#x2F;tty%5Fbuffer.c#L510):

if (port-&gt;low_latency)
    flush_to_ldisc(&amp;buf-&gt;work);
else
    schedule_work(&amp;buf-&gt;work);

Then the line discipline [is notified](https:&#x2F;&#x2F;elixir.bootlin.com&#x2F;linux&#x2F;v3.10&#x2F;source&#x2F;drivers&#x2F;tty&#x2F;tty%5Fio.c#L518) to add the new string to the output window in &#x60;tty_wakeup()&#x60;. The typical case involves a kernel work queue, which is necessarily asynchronous. The string is waiting in the buffer with the signal to go. Now it&#39;s up to the PT master to process it.

Our master is the gnome\_temrinal, which manages the window context we see on screen. The buffer will eventually stream to the console on the kernel&#39;s schedule. In a native console (not X server), this would be a segment of raw video memory. Once the pty master processes the new data...

---

### Step 11 - Hello world!

_Goal:_ Rejoice

$ .&#x2F;printf1_s
Hello World 1

$

Success!   
Now you know how it works on **my** system. How about yours?

---

## FAQ

**Why did you put this article together?**  
Recently, I was asked about how some functions are implemented several times over a short period and I couldn&#39;t find a satisfactory resource to point to. Many blog posts focused too much on digging through byzantine compiler source code. I found that approach unhelpful because the compiler and standard library are only one part of the problem. This system-wide approach gives beginners a foundation, a path to follow, and helpful experiments to adapt to their own use.

**What did you leave out?**  
Too much! It&#39;ll have to wait until &#39;printf() in 2500 seconds&#39;. In no particular order:

* Details about how glibc implements buffering
* Details of how the GNOME console manages the terminal context
* Flip buffer mechanics for ttys (similar to video backbuffers)
* More about Linux work queues used in the tty driver
* More discussion of how this process varies among architectures
* Last (and definitely least): Untangling the mess inside vfprintf

**How did you get gdb to print out that trace in step 6?**  
I used a separate file for automating gdb input and captured the output to another file.

$cat gdbcmds
start
stepi
stepi
stepi
stepi
...about 1000 more stepi...

$gdb printf1_s -x gdbcmds &gt; printf1_s_dump