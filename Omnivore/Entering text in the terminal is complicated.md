---
id: 0221b546-2515-4ce8-b5d4-b82fbafbc0de
title: Entering text in the terminal is complicated
tags:
  - RSS
date_published: 2024-07-08 13:00:15
---

# Entering text in the terminal is complicated
#Omnivore

[Read on Omnivore](https://omnivore.app/me/entering-text-in-the-terminal-is-complicated-19094031f3a)
[Read Original](https://jvns.ca/blog/2024/07/08/readline/)



## [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;)

The other day I asked what folks on Mastodon find confusing about working in the terminal, and one thing that stood out to me was “editing a command you already typed in”.

This really resonated with me: even though entering some text and editing it is a very “basic” task, it took me maybe 15 years of using the terminal every single day to get used to using &#x60;Ctrl+A&#x60; to go to the beginning of the line (or&#x60;Ctrl+E&#x60; for the end).

So let’s talk about why entering text might be hard! I’ll also share a few tips that I wish I’d learned earlier.

### it’s very inconsistent between programs

A big part of what makes entering text in the terminal hard is the inconsistency between how different programs handle entering text. For example:

1. some programs (the &#x60;dash&#x60; shell, &#x60;cat&#x60;, &#x60;nc&#x60;, &#x60;git commit --interactive&#x60;, etc) don’t support using arrow keys at all: if you press arrow keys, you’ll just see &#x60;^[[D^[[D^[[C^[[C^&#x60;
2. many programs (like &#x60;irb&#x60;, &#x60;python3&#x60; on a Linux machine and many many more) use the &#x60;readline&#x60; library, which gives you a lot of basic functionality (history, arrow keys, etc)
3. some programs (like &#x60;&#x2F;usr&#x2F;bin&#x2F;python3&#x60; on my Mac) do support very basic features like arrow keys, but not other features like &#x60;Ctrl+left&#x60; or reverse searching with &#x60;Ctrl+R&#x60;
4. some programs (like the &#x60;fish&#x60; shell or &#x60;ipython3&#x60; or &#x60;micro&#x60; or &#x60;vim&#x60;) have their own fancy system for accepting input which is totally custom

So there’s a lot of variation! Let’s talk about each of those a little more.

### mode 1: the baseline

First, there’s “the baseline” – what happens if a program just accepts text by calling &#x60;fgets()&#x60; or whatever and doing absolutely nothing else to provide a nicer experience. Here’s what using these tools typically looks for me – If I start [dash](https:&#x2F;&#x2F;wiki.archlinux.org&#x2F;title&#x2F;Dash) (a pretty minimal shell) press the left arrow keys, it just prints&#x60;^[[D&#x60; to the terminal.

&#x60;&#x60;&#x60;elixir
$ ls l-^[[D^[[D^[[D

&#x60;&#x60;&#x60;

At first it doesn’t seem like all of these “baseline” tools have much in common, but there are actually a few features that you get for free just from your terminal, without the program needing to do anything special at all.

The things you get for free are:

1. typing in text, obviously
2. backspace
3. &#x60;Ctrl+W&#x60;, to delete the previous word
4. &#x60;Ctrl+U&#x60;, to delete the whole line
5. a few other things unrelated to text editing (like &#x60;Ctrl+C&#x60; to interrupt the process, &#x60;Ctrl+Z&#x60; to suspend, etc)

This is not _great_, but it means that if you want to delete a word you generally can do it with &#x60;Ctrl+W&#x60; instead of pressing backspace 15 times, even if you’re in an environment which is offering you absolutely zero features.

You can get a list of all the ctrl codes that your terminal supports with &#x60;stty -a&#x60;.

### mode 2: tools that use &#x60;readline&#x60;

The next group is tools that use readline! Readline is a GNU library to make entering text more pleasant, and it’s very widely used.

My favourite readline keyboard shortcuts are:

1. &#x60;Ctrl+E&#x60; to go to the end of the line
2. &#x60;Ctrl+A&#x60; to go to the beginning of the line
3. &#x60;Ctrl+left&#x2F;right arrow&#x60; to go back&#x2F;forward 1 word
4. up arrow to go back to the previous command
5. &#x60;Ctrl+R&#x60; to search your history

And you can use &#x60;Ctrl+W&#x60; &#x2F; &#x60;Ctrl+U&#x60; from the “baseline” list, though &#x60;Ctrl+U&#x60;deletes from the cursor to the beginning of the line instead of deleting the whole line. I think &#x60;Ctrl+W&#x60; might also have a slightly different definition of what a “word” is.

There are a lot more ([here’s a full list](https:&#x2F;&#x2F;www.man7.org&#x2F;linux&#x2F;man-pages&#x2F;man3&#x2F;readline.3.html#EDITING%5FCOMMANDS)), but those are the only ones that I personally use.

The &#x60;bash&#x60; shell is probably the most famous readline user (when you use&#x60;Ctrl+R&#x60; to search your history in bash, that feature actually comes from readline), but there are TONS of programs that use it – for example &#x60;psql&#x60;,&#x60;irb&#x60;, &#x60;python3&#x60;, etc.

### tip: you can make ANYTHING use readline with &#x60;rlwrap&#x60;

One of my absolute favourite things is that if you have a program like &#x60;nc&#x60;without readline support, you can just run &#x60;rlwrap nc&#x60; to turn it into a program with readline support!

This is incredible and makes a lot of tools that are borderline unusable MUCH more pleasant to use. You can even apparently set up [rlwrap](https:&#x2F;&#x2F;github.com&#x2F;hanslub42&#x2F;rlwrap) to include your own custom autocompletions, though I’ve never tried that.

### some reasons tools might not use readline

I think reasons tools might not use readline might include:

* the program is very simple (like &#x60;cat&#x60; or &#x60;nc&#x60;) and maybe the maintainers don’t want to bring in a relatively large dependency
* license reasons, if the program’s license is not GPL-compatible – readline is GPL-licensed, not LGPL
* only a very small part of the program is interactive, and maybe readline support isn’t seen as important. For example &#x60;git&#x60; has a few interactive features (like &#x60;git add -p&#x60;), but not very many, and usually you’re just typing a single character like &#x60;y&#x60; or &#x60;n&#x60; – most of the time you need to really type something significant in git, it’ll drop you into a text editor instead.

For example idris2 says [they don’t use readline](https:&#x2F;&#x2F;idris2.readthedocs.io&#x2F;en&#x2F;latest&#x2F;tutorial&#x2F;interactive.html#editing-at-the-repl)to keep dependencies minimal and suggest using &#x60;rlwrap&#x60; to get better interactive features.

### how to know if you’re using readline

The simplest test I can think of is to press &#x60;Ctrl+R&#x60;, and if you see:

&#x60;&#x60;&#x60;scheme
(reverse-i-search)&#x60;&#39;:

&#x60;&#x60;&#x60;

then you’re probably using readline. This obviously isn’t a guarantee (some other library could use the term &#x60;reverse-i-search&#x60; too!), but I don’t know of another system that uses that specific term to refer to searching history.

### the readline keybindings come from Emacs

Because I’m a vim user, It took me a very long time to understand where these keybindings come from (why &#x60;Ctrl+A&#x60; to go to the beginning of a line??? so weird!)

My understanding is these keybindings actually come from Emacs – &#x60;Ctrl+A&#x60; and&#x60;Ctrl+E&#x60; do the same thing in Emacs as they do in Readline and I assume the other keyboard shortcuts mostly do as well, though I tried out &#x60;Ctrl+W&#x60; and&#x60;Ctrl+U&#x60; in Emacs and they don’t do the same thing as they do in the terminal so I guess there are some differences.

There’s some more [history of the Readline project here](https:&#x2F;&#x2F;twobithistory.org&#x2F;2019&#x2F;08&#x2F;22&#x2F;readline.html).

### mode 3: another input library (like &#x60;libedit&#x60;)

On my Mac laptop, &#x60;&#x2F;usr&#x2F;bin&#x2F;python3&#x60; is in a weird middle ground where it supports _some_ readline features (for example the arrow keys), but not the other ones. For example when I press &#x60;Ctrl+left arrow&#x60;, it prints out &#x60;;5D&#x60;, like this:

&#x60;&#x60;&#x60;ruby
$ python3
&gt;&gt;&gt; importt subprocess;5D

&#x60;&#x60;&#x60;

Folks on Mastodon helped me figure out that this is because in the default Python install on Mac OS, the Python &#x60;readline&#x60; module is actually backed by&#x60;libedit&#x60;, which is a similar library which has fewer features, presumably because Readline is [GPL licensed](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;GNU%5FReadline#Choice%5Fof%5Fthe%5FGPL%5Fas%5FGNU%5FReadline&#39;s%5Flicense).

Here’s how I was eventually able to figure out that Python was using libedit on my system:

&#x60;&#x60;&#x60;arduino
$ python3 -c &quot;import readline; print(readline.__doc__)&quot;
Importing this module enables command line editing using libedit readline.

&#x60;&#x60;&#x60;

Generally Python uses readline though if you install it on Linux or through Homebrew. It’s just that the specific version that Apple includes on their systems doesn’t have readline. Also [Python 3.13 is going to remove the readline dependency](https:&#x2F;&#x2F;docs.python.org&#x2F;3.13&#x2F;whatsnew&#x2F;3.13.html#a-better-interactive-interpreter)in favour of a custom library, so “Python uses readline” won’t be true in the future.

I assume that there are more programs on my Mac that use libedit but I haven’t looked into it.

### mode 4: something custom

The last group of programs is programs that have their own custom (and sometimes much fancier!) system for editing text. This includes:

* most terminal text editors (nano, micro, vim, emacs, etc)
* some shells (like fish), for example it seems like fish supports &#x60;Ctrl+Z&#x60; for undo when typing in a command. Zsh’s line editor is called [zle](https:&#x2F;&#x2F;zsh.sourceforge.io&#x2F;Guide&#x2F;zshguide04.html).
* some REPLs (like &#x60;ipython&#x60;), for example IPython uses the [prompt\_toolkit](https:&#x2F;&#x2F;python-prompt-toolkit.readthedocs.io&#x2F;) library instead of readline
* lots of other programs (like &#x60;atuin&#x60;)

Some features you might see are:

* better autocomplete which is more customized to the tool
* nicer history management (for example with syntax highlighting) than the default you get from readline
* more keyboard shortcuts

### custom input systems are often readline-inspired

I went looking at how [Atuin](https:&#x2F;&#x2F;atuin.sh&#x2F;) (a wonderful tool for searching your shell history that I started using recently) handles text input. Looking at [the code](https:&#x2F;&#x2F;github.com&#x2F;atuinsh&#x2F;atuin&#x2F;blob&#x2F;a67cfc82fe0dc907a01f07a0fd625701e062a33b&#x2F;crates&#x2F;atuin&#x2F;src&#x2F;command&#x2F;client&#x2F;search&#x2F;interactive.rs#L382-L430)and some of the discussion around it, their implementation is custom but it’s inspired by readline, which makes sense to me – a lot of users are used to those keybindings, and it’s convenient for them to work even though atuin doesn’t use readline.

[prompt\_toolkit](https:&#x2F;&#x2F;python-prompt-toolkit.readthedocs.io&#x2F;) (the library IPython uses) is similar – it actually supports a lot of options (including vi-like keybindings), but the default is to support the readline-style keybindings.

This is like how you see a lot of programs which support very basic vim keybindings (like &#x60;j&#x60; for down and &#x60;k&#x60; for up). For example Fastmail supports&#x60;j&#x60; and &#x60;k&#x60; even though most of its other keybindings don’t have much relationship to vim.

I assume that most “readline-inspired” custom input systems have various subtle incompatibilities with readline, but this doesn’t really bother me at all personally because I’m extremely ignorant of most of readline’s features. I only use maybe 5 keyboard shortcuts, so as long as they support the 5 basic commands I know (which they always do!) I feel pretty comfortable. And usually these custom systems have much better autocomplete than you’d get from just using readline, so generally I prefer them over readline.

### lots of shells support vi keybindings

Bash, zsh, and fish all have a “vi mode” for entering text. In a[very unscientific poll](https:&#x2F;&#x2F;social.jvns.ca&#x2F;@b0rk&#x2F;112723846172173621) I ran on Mastodon, 12% of people said they use it, so it seems pretty popular.

Readline also has a “vi mode” (which is how Bash’s support for it works), so by extension lots of other programs have it too.

I’ve always thought that vi mode seems really cool, but for some reason even though I’m a vim user I didn’t really like using it when I tried it.

### understanding what situation you’re in really helps

I’ve spent a lot of my life being confused about why a command line application I was using wasn’t behaving the way I wanted, and it feels good to be able to more or less understand what’s going on.

I think this is roughly my mental flowchart when I’m entering text at a command line prompt:

1. Do the arrow keys not work? Probably there’s no input system at all, but at least I can use &#x60;Ctrl+W&#x60; and &#x60;Ctrl+U&#x60;, and I can &#x60;rlwrap&#x60; the tool if I want more features.
2. Does &#x60;Ctrl+R&#x60; print &#x60;reverse-i-search&#x60;? Probably it’s readline, so I can use all of the readline shortcuts I’m used to, and I know I can get some basic history and press up arrow to get the previous command.
3. Does &#x60;Ctrl+R&#x60; do something else? This is probably some custom input library: it’ll probably act more or less like readline, and I can check the documentation if I really want to know how it works.

Being able to diagnose what’s going on like this makes the command line feel a more predictable and less chaotic.

### some things this post left out

There are lots more complications related to entering text that we didn’t talk about at all here, like:

* issues related to ssh &#x2F; tmux &#x2F; etc
* the &#x60;TERM&#x60; environment variable
* how different terminals (gnome terminal, iTerm, xterm, etc) have different kinds of support for copying&#x2F;pasting text
* unicode
* probably a lot more