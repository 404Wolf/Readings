---
id: a243caf9-278b-4d3e-bb6d-4c46905096f0
title: Good Python Software
tags:
  - RSS
date_published: 2024-05-28 19:01:36
---

# Good Python Software
#Omnivore

[Read on Omnivore](https://omnivore.app/me/good-python-software-18fc1d05f74)
[Read Original](https://amontalenti.com/2024/05/28/good-python-software)



I’m glad to say that the last few months have been a return to the world of day-to-day coding and software craftsmanship for me.

To give a taste of what I’ve been working on, I’m going to take you on a tour through some _damn good_ Python software I’ve been using day-to-day lately.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sU5649nhxoii41LIgI67RXzunXFYMHOprNJHCQeJjzoE&#x2F;https:&#x2F;&#x2F;amontalenti.com&#x2F;wordpress&#x2F;wp-content&#x2F;uploads&#x2F;2024&#x2F;05&#x2F;good-python-software-packages-e1716929697740.jpg)

## Python 3 and &#x60;subprocess.run()&#x60;

I have a long relationship with Python, and a lot of trust in the Python community. Python 3 continues to impress me with useful ergonomic improvements that come up in real-world day-to-day programming.

One such improvement is in the &#x60;subprocess&#x60; module in Python’s standard library. Sure, this module can can show its age — it was originally written over 20 years ago. But as someone who has been doing a lot of work at the level of UNIX processes lately, I’ve been enjoying how much it can abstract away, especially on Linux systems.

Here’s some code that calls the UNIX command &#x60;exiftool&#x60; to strip away EXIF metadata from an image, while suppressing &#x60;stdout&#x60; and &#x60;stderr&#x60; via redirection to &#x60;&#x2F;dev&#x2F;null&#x60;.

# stripexif.py
import sys
from subprocess import run, DEVNULL, CalledProcessError
 
assert len(sys.argv) &#x3D;&#x3D; 2, &quot;Missing argument&quot;
filename &#x3D; sys.argv[1]
 
print(f&quot;Stripping exif metadata from {filename}...&quot;)
try:
    cmd &#x3D; [&quot;exiftool&quot;, &quot;-all&#x3D;&quot;, &quot;-overwrite_original&quot;, filename]
    run(cmd, stdout&#x3D;DEVNULL, stderr&#x3D;DEVNULL, check&#x3D;True)
except CalledProcessError as ex:
    print(f&quot;exiftool returned error:\n{ex}&quot;)
    print(f&quot;try this command: {&#39; &#39;.join(cmd)}&quot;)
    print(f&quot;to retry w&#x2F; file: {filename}&quot;)
    sys.exit(1)
print(&quot;Done.&quot;)
sys.exit(0)

If you invoke &#x60;python3 stripexif.py myfile.jpg&#x60;, you’ll get exif metadata stripped from that file, so long as &#x60;exiftool&#x60; is installed on your system.

The &#x60;.run()&#x60; function was added in Python 3.5, as a way to more conveniently use &#x60;subprocess.Popen&#x60; for simple command executions like this. Note that due to &#x60;check&#x3D;True&#x60;, if &#x60;exiftool&#x60; returns a non-zero exit code, it will raise a &#x60;CalledProcessError&#x60; exception. That’s why I then catch that exception to offer the user a way to debug or retry the command.

If you want even more detailed usage instructions for &#x60;subprocess&#x60;, skip the official docs and instead jump right to the [Python Module of the Week (PyMOTW) subprocess article](https:&#x2F;&#x2F;pymotw.com&#x2F;3&#x2F;subprocess&#x2F;index.html). It was updated in 2018 (well after Python 3’s improvements) and includes many more detailed examples than the official docs.[1](#fn-4554-1 &quot;Read footnote.&quot;)

## Settling on &#x60;make&#x60; and &#x60;make help&#x60;

I’ve been using a &#x60;Makefile&#x60; to automate the tooling for a couple of Python command-line tools I’ve been working on lately.

First, I add [this little one-liner](https:&#x2F;&#x2F;dwmkerr.com&#x2F;makefile-help-command&#x2F;) to get a &#x60;make help&#x60; subcommand. So, starting with a &#x60;Makefile&#x60; like this:

all: compile lint format # all tools
 
compile: # compile requirements with uv
    uv pip compile requirements.in &gt;requirements.txt
 
PYFILES &#x3D; main.py
lint: # ruff check tool
    ruff check $(PYFILES)
 
format: # ruff format tool
    ruff format $(PYFILES)

We can add the &#x60;help&#x60; target one-liner, and get &#x60;make help&#x60; output like this:

❯ make help
all: all tools
compile: compile requirements with uv
format: ruff format tool
help: show help for each of the Makefile recipes
lint: ruff check tool

I know all about the &#x60;make&#x60; alternatives out there in the open source world, including, for example, &#x60;just&#x60; with its &#x60;justfile&#x60;, and &#x60;task&#x60; with its &#x60;Taskfile&#x60;. But &#x60;make&#x60;, despite its quirks, is everywhere, and it works. It has staying power. Clearly: it has been around (and widely used) for decades. Is it perfect? No. But no software is, really.

With the simple &#x60;make help&#x60; one-liner above, the number one problem I had with &#x60;make&#x60; — that is, there is usually no quick way to see what &#x60;make&#x60; targets are available in a given &#x60;Makefile&#x60; — is solved with a single line of boilerplate.

My &#x60;Makefile&#x60; brings us to some more rather good Python software that entered my world recently: &#x60;uv&#x60;, &#x60;ruff check&#x60; and &#x60;ruff format&#x60;. Let’s talk about each of these in turn.

## Upgrading &#x60;pip&#x60; and &#x60;pip-tools&#x60; to &#x60;uv&#x60;

&#x60;uv&#x60; might just make you love Python packaging again. You can read [more about uv here](https:&#x2F;&#x2F;astral.sh&#x2F;blog&#x2F;uv), but I’m going to discuss the narrow role it has started to play in my projects.

I have a post from a couple years back entitled, [“How Python programmers can uncontroversially approach build, dependency, and packaging tooling”](https:&#x2F;&#x2F;amontalenti.com&#x2F;2022&#x2F;10&#x2F;09&#x2F;python-packaging-and-zig). In that post, I suggest the following “minimalist” Python dependency management tools:

* [pyenv](https:&#x2F;&#x2F;github.com&#x2F;pyenv&#x2F;pyenv#what-pyenv-does)
* [pyenv-virtualenv](https:&#x2F;&#x2F;github.com&#x2F;pyenv&#x2F;pyenv-virtualenv#pyenv-virtualenv)
* [pip](https:&#x2F;&#x2F;pip.pypa.io&#x2F;en&#x2F;stable&#x2F;user%5Fguide&#x2F;)
* [pip-tools](https:&#x2F;&#x2F;pip-tools.readthedocs.io&#x2F;en&#x2F;latest&#x2F;)

I still consider &#x60;pyenv&#x60; and &#x60;pyenv-virtualenv&#x60; to be godsends, and I use them to manage my local Python versions and to create virtualenvs for my various Python projects.

But, I can now heartily recommend replacing &#x60;pip-tools&#x60; with &#x60;uv&#x60; (via invocations like &#x60;uv pip compile&#x60;). What’s more, I also recommend using &#x60;uv&#x60; to build your own “throwaway” virtualenvs for development, using &#x60;uv venv&#x60; and &#x60;uv install&#x60;. For example, here are a couple of &#x60;make&#x60; targets I use to build a local development environment venv, called “devenv,” using some extra requirements. In my case — and I don’t think I’m alone here — local development often involves rather complex requirements like &#x60;jupyter&#x60; for the &#x60;ipython&#x60; REPL and &#x60;jupyter notebook&#x60; browser app.

TEMP_FILE :&#x3D; $(shell mktemp)
compile-dev: requirements.in requirements-dev.in # compile requirements for dev venv
    cat requirements.in requirements-dev.in &gt;$(TEMP_FILE) \
        &amp;&amp; uv pip compile $(TEMP_FILE) &gt;requirements-dev.txt \
        &amp;&amp; sed -i &quot;s,$(TEMP_FILE),requirements-dev.txt,g&quot; requirements-dev.txt
 
.PHONY: devenv
SHELL :&#x3D; &#x2F;bin&#x2F;bash
devenv: compile-dev # make a development environment venv (in .&#x2F;devenv)
    uv venv devenv
    VIRTUAL_ENV&#x3D;&quot;${PWD}&#x2F;devenv&quot; uv pip install -r requirements-dev.txt
    @echo &quot;Done.&quot;
    @echo
    @echo &quot;Activate devenv:&quot;
    @echo &quot;  source devenv&#x2F;bin&#x2F;activate&quot;
    @echo
    @echo &quot;Then, run ipython:&quot;
    @echo &quot;  ipython&quot;

This lets me keep my requirements for my Python project clean even while having access to a “bulkier,” but throwaway, virtualenv folder, which is named &#x60;.&#x2F;devenv&#x60;.

Since &#x60;uv&#x60; is such a fast dependency resolver and has such a clever Python package caching strategy, it can build these throwaway &#x60;virtualenvs&#x60; in mere seconds. And if I want to try out a new dependency, I can throw them in &#x60;requirements-dev.in&#x60;, build a new &#x60;venv&#x60;, try it out, and simply blow the folder away if I decide against the library. (I try out, and then _decide against_, a lot of libraries. See also [“Dependency rejection”](https:&#x2F;&#x2F;amontalenti.com&#x2F;2023&#x2F;11&#x2F;25&#x2F;dependency-rejection).)

I also use &#x60;uv&#x60; as a drop-in replacement for &#x60;pip-compile&#x60; from &#x60;pip-tools&#x60;. Thus this target, which we’ve already seen above:

compile: # compile requirements with uv
    uv pip compile requirements.in &gt;requirements.txt

I’ll commit both &#x60;requirements.in&#x60; and &#x60;requirements.txt&#x60; to source control. In &#x60;requirements.in&#x60; there is just a simple listing of dependencies, with optional version pinning. Whereas in &#x60;requirements.txt&#x60;, there is something akin to a “lockfile” for this project’s dependencies.

You can also speed up the install of &#x60;requirements.txt&#x60; into the &#x60;pyenv-virtualenv&#x60; using the &#x60;uv pip install&#x60; drop-in replacement, that is, via &#x60;uv pip install -r requirements.txt&#x60;. There area also some &#x60;pip-tools&#x60; style conveniences in &#x60;uv&#x60;, such as:

* &#x60;uv pip sync&#x60;, to “sync” a requirements.txt file into your current venv
* &#x60;uv pip list&#x60;, to get a table of dependencies in the current venv
* &#x60;uv pip freeze&#x60;, to get “lockfile-style” or “frozen-dependencies-style” printout, with dependencies pinned to exact version numbers

By the way, you might wonder how to install &#x60;uv&#x60; in your local development environment. It likes to be installed globally, similar to &#x60;pyenv&#x60;, thus I suggest their &#x60;curl&#x60;\-based one-line standalone installer, found in the [uv project README.md](https:&#x2F;&#x2F;github.com&#x2F;astral-sh&#x2F;uv&#x2F;blob&#x2F;main&#x2F;README.md).

## Upgrading &#x60;pyflake8&#x60; to &#x60;ruff check&#x60;

In that [same article on Python tooling](https:&#x2F;&#x2F;amontalenti.com&#x2F;2022&#x2F;10&#x2F;09&#x2F;python-packaging-and-zig), and also in [my style guide on Python](https:&#x2F;&#x2F;github.com&#x2F;amontalenti&#x2F;elements-of-python-style), I mention using &#x60;flake8&#x60;. Well, &#x60;ruff&#x60; is a new linter for Python, written by the same team as &#x60;uv&#x60;, whose goal is not only to be a faster linter than PyLint, but also to bundle linting rules to replace tools like &#x60;flake8&#x60; and &#x60;isort&#x60;. The recent [0.4.0 release blog post](https:&#x2F;&#x2F;astral.sh&#x2F;blog&#x2F;ruff-v0.4.0) discusses how the already-fast &#x60;ruff&#x60; linter became 2x faster. It’s thus too fast (and comprehensive) to ignore, at this point.

Since I have long loved the idea of making a developer’s life easier by coupling great command-line tools with comprehensive web-based and open documentation, &#x60;ruff check&#x60; has one huge advantage over other linters. Each time it finds a problem with your code, you’re given a code with the linting rule your code triggered. Usually the fix is simple enough, but sometimes you’ll question why the rule exists, and whether you should suppress that rule for your project. Thankfully, this is easy to research in one of two ways. First, there are public “ruff rule pages,” [more than 800 and counting](https:&#x2F;&#x2F;docs.astral.sh&#x2F;ruff&#x2F;rules&#x2F;). You can find these via Google or by searching the &#x60;ruff&#x60; docs site. For example, here is [their explainer for line\-too-long (E501)](https:&#x2F;&#x2F;docs.astral.sh&#x2F;ruff&#x2F;rules&#x2F;line-too-long&#x2F;).

But you can also ask &#x60;ruff&#x60; itself for an explanation, e.g. &#x60;ruff rule E501&#x60; will explain that same rule with command-line output. The tl;dr is that it is triggered when you have a line longer than a certain number of characters in your code, and &#x60;ruff&#x60; does some exceptions for convenience and pragmatism. Since this command outputs Markdown text, I like to pipe its output to the [glow terminal Markdown renderer](https:&#x2F;&#x2F;github.com&#x2F;charmbracelet&#x2F;glow) thusly:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5-hYZgorohSd50_9suOB9htraOx4gJ3G5MtJkh3tCns&#x2F;https:&#x2F;&#x2F;amontalenti.com&#x2F;wordpress&#x2F;wp-content&#x2F;uploads&#x2F;2024&#x2F;05&#x2F;ruff-rule-glow.png)

There’s a lot to love about &#x60;ruff check&#x60;, in terms of finding small bugs in your code before runtime, and alerting you to style issues. But when combined with &#x60;ruff format&#x60;, it becomes a real powerhouse.

## Upgrading &#x60;black&#x60; to &#x60;ruff format&#x60;

The Python code formatting tool &#x60;black&#x60; deserves all the credit for settling a lot of pointless debates on Python programmer teams and moving Python teams in the direction of automatic code formatting. Its name is a tongue-in-cheek reference to the aphorism often attributed to Henry Ford, who supposedly said that customers of his then-new Model T car (originally released in 1908!) could have it in whatever color they wanted — “as long as that color is black.” I think the message you’re supposed to take away is this: sometimes too much choice is a bad thing, or, at least, beside the point. And that is certainly true for Python code formatting in the common case.

As the [announcement blog post described it](https:&#x2F;&#x2F;astral.sh&#x2F;blog&#x2F;the-ruff-formatter), the &#x60;ruff format&#x60; command took its inspiration from &#x60;black&#x60;, even though it is a clean house formatter implementation. To quote: “Ruff’s formatter is designed as a drop-in replacement for Black. On Black-formatted Python projects, Ruff achieves &gt;99.9% compatibility with Black, as measured by changed lines.”

There are some nice advantages to having the linter and formatter share a common codebase. The biggest is probably that the &#x60;ruff&#x60; team can expose both [as a single Language Server Protocol (LSP) compatible server](https:&#x2F;&#x2F;github.com&#x2F;astral-sh&#x2F;ruff-lsp). That means it’s possible to use ruff’s linting and formatting rules as a “unified language backend” for code editors like VSCode and Neovim. This is still a bit experimental, although I hear good things about the [ruff plugin for VSCode](https:&#x2F;&#x2F;marketplace.visualstudio.com&#x2F;items?itemName&#x3D;charliermarsh.ruff). Though &#x60;vim&#x60; is my personal #1 editor, VSCode is my #2 editor… and VSCode seems to be every new programmer’s #1 editor, so that level of support is comforting.

## My personal Zen arises from a good UNIX shell and a good Python REPL

I’m not one to bike shed, yak shave, or go on a hero’s journey upgrading my dotfiles. I like to just sit at my laptop and get some work done. But, taking a little time a few weeks back — [during Recurse Center](https:&#x2F;&#x2F;amontalenti.com&#x2F;recurse.com) and its Never Graduate Week (NGW 2024) event, incidentally — to achieve Zen in my Python tooling has paid immediate dividends (in terms of code output, programming ergonomics, and sheer joy) in the weeks afterwards.

My next stop for my current project is &#x60;pytest&#x60; via this rather nice-looking [pytest book](https:&#x2F;&#x2F;pragprog.com&#x2F;titles&#x2F;bopytest2&#x2F;python-testing-with-pytest-second-edition&#x2F;). I already use &#x60;pytest&#x60; and &#x60;pytest-cov&#x60; a little, at the suggestion of a friend, but I can tell that &#x60;pytest&#x60; will unlock another little level of Python productivity for me.

As for a REPL… the best REPL for Python remains the beloved [ipython project](https:&#x2F;&#x2F;ipython.org&#x2F;), as well as its sister project for when you want a full-blown browser-based code notebook environment, [Jupyter](https:&#x2F;&#x2F;jupyter.org&#x2F;). As I mentioned, I use that &#x60;make devenv&#x60; target (which itself uses &#x60;uv&#x60;) to create the &#x60;venv&#x60; for these tools, and then run them out of there.

I’m still not missing autocomplete for Python code in my &#x60;vim&#x60; editor because… what’s the point? When I can run a full Python interpreter or kernel and get not just function and method and docstring introspection, but also direct inspection of my live Python objects at runtime? That’s the good stuff. This is how I’ve been getting my brain into that sweet programming flow-state, [making some jazz](https:&#x2F;&#x2F;amontalenti.com&#x2F;2015&#x2F;12&#x2F;14&#x2F;async-pairing) between my ideas and the standard library functions, Python objects, Linux system calls, and data structure designs that fit my problem domain in just the right way.

## Appendix: More Good Software

There are some other UNIX tools I’m going to mention briefly, just as a way of saying, “these tools kick ass, and I love that they exist, and that they are so well-maintained.” These are:

* [restic](https:&#x2F;&#x2F;restic.net&#x2F;) — encrypt’d, dedupe’d, snapshot’d backups[2](#fn-4554-2 &quot;Read footnote.&quot;)
* [rclone](https:&#x2F;&#x2F;rclone.org&#x2F;) — UNIX-y access to S3, GCS, Backblaze B2
* &#x60;vim&#x60; — the trusty editor, continues [never to fail me](https:&#x2F;&#x2F;github.com&#x2F;amontalenti&#x2F;home&#x2F;?tab&#x3D;readme-ov-file#editor); RIP Bram Moolenaar
* &#x60;tmux&#x60; — as someone recently stated, [tmux is worse is better](https:&#x2F;&#x2F;hiandrewquinn.github.io&#x2F;til-site&#x2F;posts&#x2F;tmux-is-worse-is-better&#x2F;)
* &#x60;zsh&#x60; — together with [powerlevel10k and oh-my\-zsh](https:&#x2F;&#x2F;github.com&#x2F;amontalenti&#x2F;home?tab&#x3D;readme-ov-file#shell), a pure delight

Other things I might discuss in a future blog post:

* why I stick with Ubuntu LTS on my own hardware
* my local baremetal server with a Raspberry Pi &#x60;ssh&#x60; bastion and a ZeroTier mesh network
* why I stick with [DigitalOcean](https:&#x2F;&#x2F;m.do.co&#x2F;c&#x2F;673f0f6d87a8) for WordPress and OpenVPN
* why I _really_ enjoy [Opalstack](https:&#x2F;&#x2F;my.opalstack.com&#x2F;signup?lmref&#x3D;yBG7Lg), the Centos-based shared and managed Linux host, for hobby Django apps and nginx hosting

Are you noticing a common theme? _… whispers “Linux.”_

The way I’ve been bringing joy back to my life is a focus on Linux and [UNIX as the kitchen of my software chef practice](https:&#x2F;&#x2F;amontalenti.com&#x2F;2012&#x2F;06&#x2F;22&#x2F;unix-kitchen). Linux is on my desktop, and on my baremetal server; running in my DigitalOcean VM, and in my Raspberry Pi; in my containers, or in my nix-shell, or in my AWS&#x2F;GCP public cloud nodes.

The truth is, Linux is everywhere in production. It might as well be everywhere in development, too.

Sorry: you’ll only be able to pry Linux from my cold, dead hands!

I hope you find your Zen soon, too, fellow Pythonistas.

## Post navigation