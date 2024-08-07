---
id: b001ffa0-7edb-4679-96fa-58ef53fcbe72
title: Reasons to use your shell's job control
tags:
  - RSS
date_published: 2024-07-03 08:00:20
---

# Reasons to use your shell's job control
#Omnivore

[Read on Omnivore](https://omnivore.app/me/reasons-to-use-your-shell-s-job-control-190797cb8c6)
[Read Original](https://jvns.ca/blog/2024/07/03/reasons-to-use-job-control/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

Hello! Today someone on Mastodon asked about job control (&#x60;fg&#x60;, &#x60;bg&#x60;, &#x60;Ctrl+z&#x60;,&#x60;wait&#x60;, etc). It made me think about how I don’t use my shell’s job control interactively very often: usually I prefer to just open a new terminal tab if I want to run multiple terminal programs, or use tmux if it’s over ssh. But I was curious about whether other people used job control more often than me.

So I [asked on Mastodon](https:&#x2F;&#x2F;social.jvns.ca&#x2F;@b0rk&#x2F;112716835387523648) for reasons people use job control. There were a lot of great responses, and it even made me want to consider using job control a little more!

In this post I’m only going to talk about using job control interactively (not in scripts) – the post is already long enough just talking about interactive use.

### what’s job control?

First: what’s job control? Well – in a terminal, your processes can be in one of 3 states:

1. in the **foreground**. This is the normal state when you start a process.
2. in the **background**. This is what happens when you run &#x60;some_process &amp;&#x60;: the process is still running, but you can’t interact with it anymore unless you bring it back to the foreground.
3. **stopped**. This is what happens when you start a process and then press &#x60;Ctrl+Z&#x60;. This pauses the process: it won’t keep using the CPU, but you can restart it if you want.

“Job control” is a set of commands for seeing which processes are running in a terminal and moving processes between these 3 states

### how to use job control

* &#x60;fg&#x60; brings a process to the foreground. It works on both stopped processes and background processes. For example, if you start a background process with &#x60;cat &lt; &#x2F;dev&#x2F;zero &amp;&#x60;, you can bring it back to the foreground by running &#x60;fg&#x60;
* &#x60;bg&#x60; restarts a stopped process and puts it in the background.
* Pressing &#x60;Ctrl+z&#x60; stops the current foreground process.
* &#x60;jobs&#x60; lists all processes that are active in your terminal
* &#x60;kill&#x60; sends a signal (like &#x60;SIGKILL&#x60;) to a job (this is the shell builtin &#x60;kill&#x60;, not &#x60;&#x2F;bin&#x2F;kill&#x60;)
* &#x60;disown&#x60; removes the job from the list of running jobs, so that it doesn’t get killed when you close the terminal
* &#x60;wait&#x60; waits for all background processes to complete. I only use this in scripts though.

I might have forgotten some other job control commands but I think those are all the ones I’ve ever used.

You can also give &#x60;fg&#x60; or &#x60;bg&#x60; a specific job to foreground&#x2F;background. For example if I see this in the output of &#x60;jobs&#x60;:

&#x60;&#x60;&#x60;routeros
$ jobs
Job Group State   Command
1   3161  running cat &lt; &#x2F;dev&#x2F;zero &amp;
2   3264  stopped nvim -w ~&#x2F;.vimkeys $argv

&#x60;&#x60;&#x60;

then I can foreground &#x60;nvim&#x60; with &#x60;fg %2&#x60;. You can also kill it with &#x60;kill -9 %2&#x60;, or just &#x60;kill %2&#x60; if you want to be more gentle.

### how is &#x60;kill %2&#x60; implemented?

I was curious about how &#x60;kill %2&#x60; works – does &#x60;%2&#x60; just get replaced with the PID of the relevant process when you run the command, the way environment variables are? Some quick experimentation shows that it isn’t:

&#x60;&#x60;&#x60;routeros
$ echo kill %2
kill %2
$ type kill
kill is a function with definition
# Defined in &#x2F;nix&#x2F;store&#x2F;vicfrai6lhnl8xw6azq5dzaizx56gw4m-fish-3.7.0&#x2F;share&#x2F;fish&#x2F;config.fish

&#x60;&#x60;&#x60;

So &#x60;kill&#x60; is a fish builtin that knows how to interpret &#x60;%2&#x60;. Looking at the source code (which is very easy in fish!), it uses &#x60;jobs -p %2&#x60; to expand &#x60;%2&#x60;into a PID, and then runs the regular &#x60;kill&#x60; command.

### on differences between shells

Job control is implemented by your shell. I use fish, but my sense is that the basics of job control work pretty similarly in bash, fish, and zsh.

There are definitely some shells which don’t have job control at all, but I’ve only used bash&#x2F;fish&#x2F;zsh so I don’t know much about that.

Now let’s get into a few reasons people use job control!

### reason 1: kill a command that’s not responding to Ctrl+C

I run into processes that don’t respond to &#x60;Ctrl+C&#x60; pretty regularly, and it’s always a little annoying – I usually switch terminal tabs to find and kill and the process. A bunch of people pointed out that you can do this in a faster way using job control!

How to do this: Press &#x60;Ctrl+Z&#x60;, then &#x60;kill %1&#x60; (or the appropriate job number if there’s more than one stopped&#x2F;background job, which you can get from&#x60;jobs&#x60;). You can also &#x60;kill -9&#x60; if it’s really not responding.

### reason 2: background a GUI app so it’s not using up a terminal tab

Sometimes I start a GUI program from the command line (for example with&#x60;wireshark some_file.pcap&#x60;), forget to start it in the background, and don’t want it eating up my terminal tab.

How to do this:

* move the GUI program to the background by pressing &#x60;Ctrl+Z&#x60; and then running &#x60;bg&#x60;.
* you can also run &#x60;disown&#x60; to remove it from the list of jobs, to make sure that the GUI program won’t get closed when you close your terminal tab.

Personally I try to avoid starting GUI programs from the terminal if possible because I don’t like how their stdout pollutes my terminal (on a Mac I use&#x60;open -a Wireshark&#x60; instead because I find it works better but sometimes you don’t have another choice.

### reason 2.5: accidentally started a long-running job without &#x60;tmux&#x60;

This is basically the same as the GUI app thing – you can move the job to the background and disown it.

I was also curious about if there are ways to redirect a process’s output to a file after it’s already started. A quick search turned up [this Linux-only tool](https:&#x2F;&#x2F;github.com&#x2F;jerome-pouiller&#x2F;reredirect&#x2F;) which is based on[nelhage](https:&#x2F;&#x2F;blog.nelhage.com&#x2F;)’s [reptyr](https:&#x2F;&#x2F;github.com&#x2F;nelhage&#x2F;reptyr) (which lets you for example move a process that you started outside of tmux to tmux) but I haven’t tried either of those.

### reason 3: running a command while using &#x60;vim&#x60;

A lot of people mentioned that if they want to quickly test something while editing code in &#x60;vim&#x60; or another terminal editor, they like to use &#x60;Ctrl+Z&#x60;to stop vim, run the command, and then run &#x60;fg&#x60; to go back to their editor.

You can also use this to check the output of a command that you ran before starting &#x60;vim&#x60;.

I’ve never gotten in the habit of this, probably because I mostly use a GUI version of vim, but it seems like a nice workflow.

### reason 4: preferring interleaved output

A few people said that they prefer to the output of all of their commands being interleaved in the terminal. This really surprised me because I usually think of having the output of lots of different commands interleaved as being a _bad_thing, but one person said that they like to do this with tcpdump specifically and I think that actually sounds extremely useful. Here’s what it looks like:

&#x60;&#x60;&#x60;routeros
# start tcpdump
$ sudo tcpdump -ni any port 1234 &amp;
tcpdump: data link type PKTAP
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on any, link-type PKTAP (Apple DLT_PKTAP), snapshot length 524288 bytes

# run curl
$ curl google.com:1234
13:13:29.881018 IP 192.168.1.173.49626 &gt; 142.251.41.78.1234: Flags [S], seq 613574185, win 65535, options [mss 1460,nop,wscale 6,nop,nop,TS val 2730440518 ecr 0,sackOK,eol], length 0
13:13:30.881963 IP 192.168.1.173.49626 &gt; 142.251.41.78.1234: Flags [S], seq 613574185, win 65535, options [mss 1460,nop,wscale 6,nop,nop,TS val 2730441519 ecr 0,sackOK,eol], length 0
13:13:31.882587 IP 192.168.1.173.49626 &gt; 142.251.41.78.1234: Flags [S], seq 613574185, win 65535, options [mss 1460,nop,wscale 6,nop,nop,TS val 2730442520 ecr 0,sackOK,eol], length 0
 
# when you&#39;re done, kill the tcpdump in the background
$ kill %1 

&#x60;&#x60;&#x60;

I think it’s really nice here that you can see the output of tcpdump inline in your terminal – when I’m using tcpdump I’m always switching back and forth and I always get confused trying to match up the timestamps, so keeping everything in one terminal seems like it might be a lot clearer. I’m going to try it.

### reason 5: suspend a CPU-hungry program

One person said that sometimes they’re running a very CPU-intensive program, for example converting a video with &#x60;ffmpeg&#x60;, and they need to use the CPU for something else, but don’t want to lose the work that ffmpeg already did.

You can do this by pressing &#x60;Ctrl+Z&#x60; to pause the process, and then run &#x60;fg&#x60;when you want to start it again.

### reason 6: you accidentally ran Ctrl+Z

Many people replied that they didn’t use job control _intentionally_, but that they sometimes accidentally ran Ctrl+Z, which stopped whatever program was running, so they needed to learn how to use &#x60;fg&#x60; to bring it back to the foreground.

The were also some mentions of accidentally running &#x60;Ctrl+S&#x60; too (which stops your terminal and I think can be undone with &#x60;Ctrl+Q&#x60;). My terminal totally ignores &#x60;Ctrl+S&#x60; so I guess I’m safe from that one though.

### reason 7: already set up a bunch of environment variables

Some folks mentioned that they already set up a bunch of environment variables that they need to run various commands, so it’s easier to use job control to run multiple commands in the same terminal than to redo that work in another tab.

### reason 8: it’s your only option

Probably the most obvious reason to use job control to manage multiple processes is “because you have to” – maybe you’re in single-user mode, or on a very restricted computer, or SSH’d into a machine that doesn’t have tmux or screen and you don’t want to create multiple SSH sessions.

### reason 9: some people just like it better

Some people also said that they just don’t like using terminal tabs: for instance a few folks mentioned that they prefer to be able to see all of their terminals on the screen at the same time, so they’d rather have 4 terminals on the screen and then use job control if they need to run more than 4 programs.

### I learned a few new tricks!

I think my two main takeaways from thos post is I’ll probably try out job control a little more for:

1. killing processes that don’t respond to Ctrl+C
2. running &#x60;tcpdump&#x60; in the background with whatever network command I’m running, so I can see both of their output in the same place