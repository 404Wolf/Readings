---
id: 440ae50e-43c6-4c81-a99a-974157b0735d
title: Zig's New CLI Progress Bar Explained - Andrew Kelley
tags:
  - RSS
date_published: 2024-05-30 00:01:21
---

# Zig's New CLI Progress Bar Explained - Andrew Kelley
#Omnivore

[Read on Omnivore](https://omnivore.app/me/zig-s-new-cli-progress-bar-explained-andrew-kelley-18fc7c350fc)
[Read Original](https://andrewkelley.me/post/zig-new-cli-progress-bar-explained.html)



Sometimes, programming projects are too easy and boring. Sometimes, they&#39;re too hard, never ending or producing subpar results.

This past week I had the pleasure of completing a project that felt like maximum difficulty - only possible because I am at the top of my game, using a programming language designed for making perfect software. This problem threw everything it had at me, but I rose to the challenge and emerged victorious.

What a rush.

In this blog post I&#39;ll dig into the technical implementation as well as provide the[Zig Progress Protocol Specification](#zig-progress-protocol-spec).

## Demo

Before we take a deep dive, let&#39;s look at the final results by building my [music player side project](https:&#x2F;&#x2F;codeberg.org&#x2F;andrewrk&#x2F;player) while recording with Asciinema:

[Old](https:&#x2F;&#x2F;asciinema.org&#x2F;a&#x2F;MfJdqRHlMaHeNY8KJSnHBUP2I) vs[New](https:&#x2F;&#x2F;asciinema.org&#x2F;a&#x2F;661404) 

The usage code looks basically like this:

&#x60;&#x60;&#x60;angelscript
const parent_progress_node &#x3D; std.Progress.start(.{});

&#x2F;&#x2F; ...

const progress_node &#x3D; parent_progress_node.start(&quot;sub-task name&quot;, 10);
defer progress_node.end();

for (0..10) |_| progress_node.completeOne();
&#x60;&#x60;&#x60;

To include a child process&#39;s progress under a particular node, it&#39;s a single assignment before calling &#x60;spawn&#x60;:

&#x60;&#x60;&#x60;ini
child_process.progress_node &#x3D; parent_progress_node;
&#x60;&#x60;&#x60;

For me the most exciting thing about this is its ability to visualize what the Zig Build System is up to after you run &#x60;zig build&#x60;. Before this feature was even merged into master branch, it led to discovery, diagnosis, and[resolution](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;commit&#x2F;389181f6be8810b5cd432e236a962229257a5b59)of a subtle bug that has hidden in Zig&#39;s standard library child process spawning code for years. Not included in this blog post: a rant about how much I hate the fork() API.

## Motivation

The previous implementation was more conservative. It had the design limitation that it could not assume ownership of the terminal. This meant that it had to assume another process or thread could print to stderr at any time, and it was not allowed to register a &#x60;SIGWINCH&#x60; signal handler to learn about when the terminal size changed. It also did not rely on knowledge of the terminal size, or spawn any threads.

This new implementation represents a more modern philosophy: when a CLI application is spawned with stderr being a terminal, then that application owns the terminal and owes its users the best possible user experience, taking advantage of all the terminal features available, working around their limitations. I&#39;m excited for projects such as [Ghostty](https:&#x2F;&#x2F;mitchellh.com&#x2F;ghostty) which are expanding the user interface capabilities of terminals, and lifting those limitations.

With this new set of constraints in mind, it becomes possible to design a much more useful progress bar. We gain a new requirement: since only one process owns the terminal, child processes must therefore report their progress semantically so it can be aggregated and displayed by the terminal owner.

## Implementation

The whole system is designed around the public API, which must be thread-safe, lock-free, and avoid contention as much as possible in order to prevent the progress system itself from harming performance, particularly in a multi-threaded environment.

The key insight I had here is that, since the end result must be displayed on a terminal screen, there is a reasonably small upper bound on how much memory is required, beyond which point the extra memory couldn&#39;t be utilized because it wouldn&#39;t fit on the terminal screen anyway.

By statically pre-allocating 200 nodes, the API is made infallible and non-heap-allocating. Furthermore, it makes it possible to implement a thread-safe, lock-free node allocator based on a free list.

The shared data is split into several arrays:

&#x60;&#x60;&#x60;crmsh
node_parents: [200]Node.Parent,
node_storage: [200]Node.Storage,
node_freelist: [200]Node.OptionalIndex,
&#x60;&#x60;&#x60;

The freelist is used to ensure that two racing &#x60;Node.start()&#x60; calls obtain different indexes to operate on, as well as a mechanism for &#x60;Node.end()&#x60; calls to return nodes back to the system for reuse. Meanwhile, the parents array is used to indicate which nodes are actually allocated, and to which parent node they should be attached to. Finally, the other storage contains the number of completed items, estimated total items, and task name for each node.

Each &#x60;Node.Parent&#x60; is 1 byte exactly. It has 2 special values, which can be represented with type safety in Zig:

&#x60;&#x60;&#x60;dart
const Parent &#x3D; enum(u8) {
    &#x2F;&#x2F;&#x2F; Unallocated storage.
    unused &#x3D; std.math.maxInt(u8) - 1,
    &#x2F;&#x2F;&#x2F; Indicates root node.
    none &#x3D; std.math.maxInt(u8),
    &#x2F;&#x2F;&#x2F; Index into &#x60;node_storage&#x60;.
    _,

    fn unwrap(i: @This()) ?Index {
        return switch (i) {
            .unused, .none &#x3D;&gt; return null,
            else &#x3D;&gt; @enumFromInt(@intFromEnum(i)),
        };
    }
};
&#x60;&#x60;&#x60;

The data mentioned above is mutated in the implementation of the thread-safe public API.

Meanwhile, the update thread is running on a timer. After an initial delay, it wakes up at regular intervals to either draw progress to the terminal, or send progress information to another process through a pipe.

In either case, when the update thread wakes up, the first thing it does is &quot;serialize&quot; the shared data into a separate preallocated location. After carefully copying the shared data using atomic primitives, the copied, serialized data can then be operated on in a single-threaded manner, since it is not shared with any other threads.

The update thread performs this copy by iterating over the full 200 shared parents array, atomically loading each value and checking if it is not the special &quot;unused&quot; value (0xfe). In most programming projects, a linear scan to find allocated objects is undesirable, however in this case 200 bytes for node parent indexes is practically free to iterate over since it&#39;s 4 cache lines total, and the only contention comes from actual updates that must be observed. This full scan in the update thread buys us a cheap, lock-free implementation for &#x60;Node.start()&#x60; and &#x60;Node.end()&#x60; via popping and pushing the freelist, respectively.

Next, IPC nodes are expanded. More on this point later.

Once the serialization process is complete, we are left with a subset of the shared data from earlier, this time with no gaps - only used nodes are present here:

&#x60;&#x60;&#x60;crmsh
serialized_parents: [200]Node.Parent,
serialized_storage: [200]Node.Storage,
serialized_len: usize,
&#x60;&#x60;&#x60;

At this point the behavior diverges depending on whether the current process owns the terminal, or must send progress updates via a pipe. A process that fits neither of these categories would not have spawned an update thread to begin with. Any parent process that wants to track progress from children creates a pipe with &#x60;O_NONBLOCK&#x60; enabled, passing it to the child as if it were a fourth I&#x2F;O stream after stdin, stdout, and stderr. To indicate to the process that the file descriptor is in fact a progress pipe, it sets the &#x60;ZIG_PROGRESS&#x60; environment variable. For example, in the Zig standard library implementation, this ends up being &#x60;ZIG_PROGRESS&#x3D;3&#x60;.

A process that is given a progress pipe sends the serialized data over the pipe, while a process that owns the terminal draws it directly.

For example, this source code:

&#x60;&#x60;&#x60;angelscript
const std &#x3D; @import(&quot;std&quot;);

pub fn main() !void {
    const root_node &#x3D; std.Progress.start(.{
        .root_name &#x3D; &quot;preparing assets&quot;,
    });
    defer root_node.end();

    const sub_node &#x3D; root_node.start(&quot;reticulating splines&quot;, 100);
    defer sub_node.end();

    for (0..50) |_| sub_node.completeOne();
    std.time.sleep(1000 * std.time.ns_per_ms);
    for (0..50) |_| sub_node.completeOne();
}
&#x60;&#x60;&#x60;

At the sleep() call, would display this to the terminal:

preparing assets
└─ [50&#x2F;100] reticulating splines

But if it were a child process, would send this message over the pipe instead:

0000  02 00 00 00 00 00 00 00  00 70 72 65 70 61 72 69  .........prepari
00a0  6E 67 20 61 73 73 65 74  73 00 00 00 00 00 00 00  ng assets.......
00b0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  ................
00c0  00 32 00 00 00 64 00 00  00 72 65 74 69 63 75 6C  .2...d...reticul
00d0  61 74 69 6E 67 20 73 70  6C 69 6E 65 73 00 00 00  ating splines...
00e0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  ................
00f0  00 FF 00                                          ...

### Drawing to the Terminal

Drawing to the terminal begins with the serialized data copy. This data contains only edges pointing to parents, and therefore cannot be used to walk the tree starting from the root. The first thing done here is compute sibling and children edges into preallocated buffers so that we can then walk the tree top-down.

&#x60;&#x60;&#x60;crmsh
child: [200]Node.OptionalIndex,
sibling: [200]Node.OptionalIndex,
&#x60;&#x60;&#x60;

Next, the draw buffer is computed, but not written to the terminal yet. It looks like this:

1. [Start sync sequence](https:&#x2F;&#x2F;gist.github.com&#x2F;christianparpart&#x2F;d8a62cc1ab659194337d73e399004036). This makes high framerate terminals not blink rapidly.
2. Clear previous update by moving cursor up times the number of newlines outputted last time, and then a clear to end of screen escape sequence.
3. Recursively walk the tree of nodes, which which is now possible since we have computed children and sibling edges, outputting tree-drawing sequences, node names, and counting newlines.
4. End sync sequence.

This draw buffer is only computed - it is not sent to the write() syscall yet. At this point, we try to obtain the stderr lock. If we get it, then we write the buffer to the terminal. Otherwise, this update is dropped.

If any attempt to write to the terminal fails, the update thread exits so that no further attempt is made.

### Inter-Process Communication

Earlier, I said &quot;IPC nodes are expanded&quot; without further explanation. Let&#39;s dig into that a little bit.

As a final step in the serialization process, the update thread iterates the data, looking for special nodes. Special nodes store the progress pipe file descriptor of a child process rather than&#x60;completed_items&#x60; and &#x60;estimated_total_items&#x60;. The update thread reads progress data from this pipe, and then grafts the child&#39;s sub-tree onto the parent&#39;s tree, plugging the root node of the child into the special node of the parent. The main storage data can be directly memcpy&#39;d, but the parents array must be relocated based on the offset within the serialized data arrays.

In case of a big-endian system, the 2 integers within each node storage must be byte-swapped. Not relying on host endianness means that edge cases continue to work, such as the parent process running on an x86\_64 host, with a child process running a mips program in QEMU user mode. This is a real use case when testing the Zig compiler, for example.

The parent process ignores all but the last message from the pipe fd, and references a copy of the data from the last update in case there is no message in the pipe for a particular update.

## Performance

Here are some performance data points I took while working on this.

Building the Zig compiler as a sub-process. This measures the cost of the new API implementations, primarily &#x60;Node.start&#x60;, &#x60;Node.end&#x60;, and the disappearance of &#x60;Node.activate&#x60;. In this case, standard error is not a terminal, and thus an update thread is never spawned:

Benchmark 1 (3 runs): old zig build-exe self-hosted compiler
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          51.8s  ±  138ms    51.6s  … 51.9s           0 ( 0%)        0%
  peak_rss           4.57GB ±  286KB    4.57GB … 4.57GB          0 ( 0%)        0%
  cpu_cycles          273G  ±  360M      273G  …  274G           0 ( 0%)        0%
  instructions        487G  ±  105M      487G  …  487G           0 ( 0%)        0%
  cache_references   19.0G  ± 31.8M     19.0G  … 19.1G           0 ( 0%)        0%
  cache_misses       3.87G  ± 12.0M     3.86G  … 3.88G           0 ( 0%)        0%
  branch_misses      2.22G  ± 3.44M     2.21G  … 2.22G           0 ( 0%)        0%
Benchmark 2 (3 runs): new zig build-exe self-hosted compiler
  measurement          mean ± σ            min … max           outliers         delta
  wall_time          51.5s  ±  115ms    51.4s  … 51.7s           0 ( 0%)          -  0.4% ±  0.6%
  peak_rss           4.58GB ±  190KB    4.58GB … 4.58GB          0 ( 0%)          +  0.1% ±  0.0%
  cpu_cycles          272G  ±  494M      272G  …  273G           0 ( 0%)          -  0.4% ±  0.4%
  instructions        487G  ± 63.5M      487G  …  487G           0 ( 0%)          -  0.1% ±  0.0%
  cache_references   19.1G  ± 16.9M     19.1G  … 19.1G           0 ( 0%)          +  0.3% ±  0.3%
  cache_misses       3.86G  ± 17.1M     3.84G  … 3.88G           0 ( 0%)          -  0.2% ±  0.9%
  branch_misses      2.23G  ± 5.82M     2.22G  … 2.23G           0 ( 0%)          +  0.4% ±  0.5%

Building the Zig compiler, with &#x60;time zig build-exe -fno-emit-bin...&#x60; so that the progress is updating the terminal on a regular interval:

* Old:  
   * 4.115s  
   * 4.216s  
   * 4.221s  
   * 4.227s  
   * 4.234s
* New (1% slower):  
   * 4.231s  
   * 4.240s  
   * 4.271s  
   * 4.339s  
   * 4.340s

Building my music player application with &#x60;zig build&#x60;, with the project-local cache cleared. This displays a lot of progress information to the terminal. This data point accounts for many sub processes sending progress information over a pipe to the parent process for aggregation:

* Old  
   * 65.74s  
   * 66.39s  
   * 71.09s
* New (1% faster)  
   * 65.51s  
   * 65.88s  
   * 66.09s

Conclusion? It appears that I succeeded in making this progress-reporting system have no significant effect on the performance of the software that uses it.

## The Zig Progress Protocol Specification

Any programming language can join the fun! Here is a specification so that any software project can participate in a standard way of sharing progress information between parent and child processes.

When the &#x60;ZIG_PROGRESS&#x3D;X&#x60; environment variable is present, where &#x60;X&#x60; is an unsigned decimal integer in range 0...65535, a process-wide progress reporting channel is available.

The integer is a writable file descriptor opened in non-blocking mode. Subsequent messages to the stream supersede previous ones.

The stream supports exactly one kind of message that looks like this:

1. &#x60;len: u8&#x60; \- number of nodes, limited to 253 max, reserving 0xfe and 0xff for special meaning.
2. 48 bytes for every &#x60;len&#x60;:  
   1. &#x60;completed: u32le&#x60; \- how many items already done  
   2. &#x60;estimated_total: u32le&#x60; \- guessed number of items to be completed, or 0 (unknown)  
   3. &#x60;name: [40]u8&#x60; \- task description; remaining bytes zeroed out
3. 1 byte for every &#x60;len&#x60;:  
   1. &#x60;parent: u8&#x60; \- creates an edge to a parent node in the tree, or 0xff (none)

Future versions of this protocol, if necessary, will use different environment variable names.

## Bonus: Using Zig Standard Library in C Code

Much of the Zig standard library is available to C programs with minimal integration pain. Here&#39;s a full, working example:

### example.c

&#x60;&#x60;&#x60;cpp
#include &quot;zp.h&quot;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;

int main(int argc, char **argv) {
    zp_node root_node &#x3D; zp_init();

    const char *task_name &#x3D; &quot;making orange juice&quot;;
    zp_node sub_node &#x3D; zp_start(root_node, task_name, strlen(task_name), 5);
    for (int i &#x3D; 0; i &lt; 5; i +&#x3D; 1) {
        zp_complete_one(sub_node);
        sleep(1);
    }
    zp_end(sub_node);
    zp_end(root_node);
}
&#x60;&#x60;&#x60;

### zp.h

&#x60;&#x60;&#x60;reasonml
#include &lt;stdint.h&gt;
#include &lt;stddef.h&gt;

typedef uint8_t zp_node;

zp_node zp_init(void);
zp_node zp_start(zp_node parent, const char *name_ptr, size_t name_len, size_t estimated_total);
zp_node zp_end(zp_node node);
zp_node zp_complete_one(zp_node node);
&#x60;&#x60;&#x60;

### zp.zig

&#x60;&#x60;&#x60;crmsh
const std &#x3D; @import(&quot;std&quot;);

export fn zp_init() std.Progress.Node.OptionalIndex {
    return std.Progress.start(.{}).index;
}

export fn zp_start(
    parent: std.Progress.Node.OptionalIndex,
    name_ptr: [*]const u8,
    name_len: usize,
    estimated_total_items: usize,
) std.Progress.Node.OptionalIndex {
    const node: std.Progress.Node &#x3D; .{ .index &#x3D; parent };
    return node.start(name_ptr[0..name_len], estimated_total_items).index;
}

export fn zp_end(node_index: std.Progress.Node.OptionalIndex) void {
    const node: std.Progress.Node &#x3D; .{ .index &#x3D; node_index };
    node.end();
}

export fn zp_complete_one(node_index: std.Progress.Node.OptionalIndex) void {
    const node: std.Progress.Node &#x3D; .{ .index &#x3D; node_index };
    node.completeOne();
}

pub const _start &#x3D; void;
&#x60;&#x60;&#x60;

Compile with &#x60;zig cc -o example example.c zp.zig&#x60;

[Asciinema Demo](https:&#x2F;&#x2F;asciinema.org&#x2F;a&#x2F;dJ8iLKpje6fsJygM8r1qw5e6M) 

This same executable will also work correctly as a child process, reporting progress over the &#x60;ZIG_PROGRESS&#x60; pipe if provided!

## Follow-Up Work

Big thanks to [Ryan Liptack](https:&#x2F;&#x2F;www.ryanliptak.com&#x2F;) for helping me with the Windows console printing code, and [Jacob Young](https:&#x2F;&#x2F;github.com&#x2F;jacobly0&#x2F;) for[working on the Windows IPC logic](https:&#x2F;&#x2F;github.com&#x2F;ziglang&#x2F;zig&#x2F;pull&#x2F;20114), which isn&#39;t done yet.

Thanks for reading my blog post.