---
id: f10d3ef1-13d0-4be8-8fed-d63017f091e8
---

# A beginner's guide to tmux | Enable Sysadmin
#Omnivore

[Read on Omnivore](https://omnivore.app/me/a-beginner-s-guide-to-tmux-enable-sysadmin-18e20360845)
[Read Original](https://www.redhat.com/sysadmin/introduction-tmux-linux)


Tmux is a terminal multiplexer; it allows you to create several &quot;pseudo terminals&quot; from a single terminal. This is very useful for running multiple programs with a single connection, such as when you&#39;re remotely connecting to a machine using [Secure Shell (SSH)](https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;access-remote-systems-ssh).

Tmux also decouples your programs from the main terminal, protecting them from accidentally disconnecting. You can detach tmux from the current terminal, and all your programs will continue to run safely in the background. Later, you can reattach tmux to the same or a different terminal.

In addition to its benefits with remote connections, tmux&#39;s speed and flexibility make it a fantastic tool to manage multiple terminals on your local machine, similar to a window manager. I&#39;ve been using tmux on my laptops for over eight years. Some of tmux&#39;s features that help me and increase my productivity include:

* Fully customizable status bar
* Multiple window management
* Splitting window in several panes
* Automatic layouts
* Panel synchronization
* Scriptability, which allows me to create custom tmux sessions for different purposes

Here&#39;s an example of a customized tmux session:

Image

![tmux custom session](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1232x1244,stZ1yoNrTtsFX5LWzqlDzzpy0FIEwRnmTxj0wFc2pQ64&#x2F;https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;sites&#x2F;default&#x2F;files&#x2F;styles&#x2F;embed_large&#x2F;public&#x2F;2022-09&#x2F;tmux-custom-screen01.png?itok&#x3D;cOrR81Ul)

(Ricardo Gerardi, CC BY-SA 4.0)

Tmux offers some of the same functionality found in [Screen](https:&#x2F;&#x2F;www.gnu.org&#x2F;software&#x2F;screen&#x2F;), which has been deprecated in some Linux distributions. Tmux has a more modern code base than Screen and offers additional customization capabilities.

Now that you know some of tmux&#39;s benefits, I&#39;ll show you how to install and use it.

## Install tmux

Tmux is available in the standard repositories with Fedora and [Red Hat Enterprise Linux (RHEL)](https:&#x2F;&#x2F;www.redhat.com&#x2F;en&#x2F;technologies&#x2F;linux-platforms&#x2F;enterprise-linux?intcmp&#x3D;701f20000012ngPAAQ), starting with RHEL 8\. You can install it using DNF:

&#x60;&#x60;&#x60;cmake
$ sudo dnf -y install tmux
&#x60;&#x60;&#x60;

It&#39;s also available with many other Linux distributions, and you should be able to install it by using your favorite distribution package manager. For other operating systems, consult the [tmux installation guide](https:&#x2F;&#x2F;github.com&#x2F;tmux&#x2F;tmux&#x2F;wiki&#x2F;Installing).

**_\[ Download now: [A sysadmin&#39;s guide to Bash scripting](https:&#x2F;&#x2F;opensource.com&#x2F;downloads&#x2F;bash-scripting-ebook?intcmp&#x3D;701f20000012ngPAAQ). \]_**

## Get started with tmux

To start using tmux, type &#x60;tmux&#x60; on your terminal. This command launches a tmux server, creates a default session (number 0) with a single window, and attaches to it.

&#x60;&#x60;&#x60;elixir
$ tmux
&#x60;&#x60;&#x60;

Image

![default tmux screen](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1232x761,srJe25jTmZQ2XxI5Ye5tm-zTy1Oopff_P0B95VunCWLU&#x2F;https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;sites&#x2F;default&#x2F;files&#x2F;styles&#x2F;embed_large&#x2F;public&#x2F;2022-09&#x2F;tmux-default01.png?itok&#x3D;35OfC1vr)

(Ricardo Gerardi, CC BY-SA 4.0)

Now that you&#39;re connected to tmux, you can run any commands or programs as you normally would. For example, to simulate a long-running process:

&#x60;&#x60;&#x60;shell
$ c&#x3D;1

$ while true; do echo &quot;Hello $c&quot;; let c&#x3D;c+1; sleep 1; done
Hello 1
Hello 2
Hello 3
&#x60;&#x60;&#x60;

You can detach from your tmux session by pressing **Ctrl+B** then **D**. Tmux operates using a series of keybindings (keyboard shortcuts) triggered by pressing the &quot;prefix&quot; combination. By default, the prefix is **Ctrl+B**. After that, press **D** to detach from the current session.

&#x60;&#x60;&#x60;scheme
[detached (from session 0)]
&#x60;&#x60;&#x60;

You&#39;re no longer attached to the session, but your long-running command executes safely in the background. You can list active tmux sessions with &#x60;tmux ls&#x60;:

&#x60;&#x60;&#x60;angelscript
$ tmux ls

0: 1 windows (created Sat Aug 27 20:54:58 2022)
&#x60;&#x60;&#x60;

**_\[ Learn how to [manage your Linux environment for success](https:&#x2F;&#x2F;www.redhat.com&#x2F;en&#x2F;engage&#x2F;linux-management-ebook-s-201912231121?intcmp&#x3D;701f20000012ngPAAQ). \]_**

You can disconnect your SSH connection at this point, and the command will continue to run. When you&#39;re ready, reconnect to the server and reattach to the existing tmux session to resume where you left off:

&#x60;&#x60;&#x60;lsl
$ tmux attach -t 0
Hello 72
Hello 73
Hello 74
Hello 75
Hello 76
^C
&#x60;&#x60;&#x60;

As you can see, the command continued to run and print messages on the screen. You can type **Ctrl+C** to cancel it.

All tmux commands can also be abbreviated, so, for example, you can enter &#x60;tmux a&#x60; , and it will work the same as &#x60;tmux attach&#x60;.

This functionality alone makes tmux a great tool, but it has even more to offer, including its default keybindings.

## Basic tmux keybindings

Tmux provides several keybindings to execute commands quickly in a tmux session. Here are some of the most useful ones.

First, create a new tmux session if you&#39;re not already in one. You can name your session by passing the parameter &#x60;-s {name}&#x60; to the &#x60;tmux new&#x60; command when creating a new session:

&#x60;&#x60;&#x60;haxe
$ tmux new -s Session1
&#x60;&#x60;&#x60;

* **Ctrl+B D** — Detach from the current session.
* **Ctrl+B %** — Split the window into two panes horizontally.
* **Ctrl+B &quot;** — Split the window into two panes vertically.
* **Ctrl+B Arrow Key** (Left, Right, Up, Down) — Move between panes.
* **Ctrl+B X** — Close pane.
* **Ctrl+B C** — Create a new window.
* **Ctrl+B N** or **P** — Move to the next or previous window.
* **Ctrl+B 0 (1,2...)** — Move to a specific window by number.
* **Ctrl+B :** — Enter the command line to type commands. Tab completion is available.
* **Ctrl+B ?** — View all keybindings. Press **Q** to exit.
* **Ctrl+B W** — Open a panel to navigate across windows in multiple sessions.

For additional keybindings, consult the tmux man pages.

**_\[ Download the [tmux cheat sheet](https:&#x2F;&#x2F;opensource.com&#x2F;downloads&#x2F;tmux-cheat-sheet?intcmp&#x3D;701f20000012ngPAAQ) to keep the keybindings at your fingertips. \]_**

## Use the mouse

Tmux is most often used with the keyboard, and it provides many keybindings to make it easier to execute commands, create new panes, and resize them. If you prefer using the mouse, tmux also allows that, although the mouse is disabled by default. To enable it, first enter command mode by typing **Ctrl+B :**, then toggle the mouse on (or off) with the command &#x60;set -g mouse&#x60;.

Now you can use the mouse to switch between panes and windows and resize them. Starting with tmux version 3, you can also right-click with the mouse and open a context menu:

Image

![tmux menu](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1080x1142,sGY_bMQtK8MhUyTtZwbRp_VZJ2oK2_MwNx8LDr3-NIfQ&#x2F;https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;sites&#x2F;default&#x2F;files&#x2F;styles&#x2F;embed_medium&#x2F;public&#x2F;2022-09&#x2F;tmux-mouse-menu01.png?itok&#x3D;vysy0LDb)

(Ricardo Gerardi, CC BY-SA 4.0)

This menu changes according to what&#39;s on the screen under the mouse cursor when clicked.

**_\[ Keep your most commonly used commands handy with the [Linux commands cheat sheet](https:&#x2F;&#x2F;developers.redhat.com&#x2F;cheat-sheets&#x2F;linux-commands-cheat-sheet?intcmp&#x3D;701f20000012ngPAAQ). \]_**

## Configure tmux

You can change the tmux configuration permanently by modifying the tmux configuration file. By default, this file is located at &#x60;$HOME&#x2F;.tmux.conf&#x60;.

For example, the default prefix key combination is **Ctrl+B**, but sometimes this combination is a little awkward to press, and it requires both hands. You can change it to something different by editing the configuration file. I like to set the prefix key to **Ctrl+A**. To do this, create a new configuration file and add these lines to it:

&#x60;&#x60;&#x60;routeros
$ vi $HOME&#x2F;.tmux.conf

# Set the prefix to Ctrl+a
set -g prefix C-a

# Remove the old prefix
unbind C-b

# Send Ctrl+a to applications by pressing it twice
bind C-a send-prefix

:wq
&#x60;&#x60;&#x60;

When you start a tmux session on this machine, you can execute the commands listed above by pressing **Ctrl+A** first. Use the configuration file to change or add other tmux keybindings and commands.

**_\[ Get the guide to [installing applications on Linux](https:&#x2F;&#x2F;opensource.com&#x2F;downloads&#x2F;installing-linux-applications-ebook?intcmp&#x3D;701f20000012ngPAAQ). \]_**

## Customize the status bar

Tmux&#39;s status bar is fully customizable. You can change the colors of each section and what is displayed. There are so many options that it would require another article to cover them, so I&#39;ll start with the basics.

The standard green color for the entire status bar makes it difficult to see the different sections. It&#39;s particularly difficult to see how many windows you have open and which one is active.

Image

![tmux colors status bar](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1232x121,stVcIeqN0i1R83igYqIW71Zi-9hq7iR616pOMkeiU5-4&#x2F;https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;sites&#x2F;default&#x2F;files&#x2F;styles&#x2F;embed_large&#x2F;public&#x2F;2022-09&#x2F;tmux-colors-green01.png?itok&#x3D;o8pU2Gai)

(Ricardo Gerardi, CC BY-SA 4.0)

You can change that by updating the status bar colors. First, enter command mode by typing **Ctrl+B :** (or **Ctrl+A :** if you made the prefix configuration change above). Then change the colors with these commands:

* Change the status bar background color: &#x60;set -g status-bg cyan&#x60;
* Change inactive window color: &#x60;set -g window-status-style bg&#x3D;yellow&#x60;
* Change active window color: &#x60;set -g window-status-current-style bg&#x3D;red,fg&#x3D;white&#x60;

Add these commands to your configuration file for permanent changes.

With this configuration in place, your status bar looks nicer, and it&#39;s much easier to see which window is active:

Image

![tmux colors](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1232x753,sj-EYOZCvPqLDv3S_u5t1zGZklsaEtwMqZ_4Y2ACGLlc&#x2F;https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;sites&#x2F;default&#x2F;files&#x2F;styles&#x2F;embed_large&#x2F;public&#x2F;2022-09&#x2F;tmux-colors01.png?itok&#x3D;OF7o2F5o)

(Ricardo Gerardi, CC BY-SA 4.0)

## What&#39;s next

Tmux is a fantastic tool to safeguard your remote connections and is useful when you spend a long time using the terminal. This article covers only the basic functionality, and there is much more to explore. For additional information about tmux, consult its official [wiki page](https:&#x2F;&#x2F;github.com&#x2F;tmux&#x2F;tmux&#x2F;wiki).

You can also expand tmux&#39;s functionality with extra-official plugins. These plugins add more commands, integrate with applications such as [Vim](https:&#x2F;&#x2F;www.redhat.com&#x2F;sysadmin&#x2F;vim-power-commands), and add new functionality to the status bar. For more information, consult the [tmux plugins project](https:&#x2F;&#x2F;github.com&#x2F;tmux-plugins&#x2F;list).

As a sysadmin, you spend a lot of time on somebody else&#39;s computer. Choose your remote file-editing tools wisely!

Once you&#39;ve committed Vi&#39;s keyboard shortcuts to muscle memory, watch how fast you work.

Consider swapping Linux tools for these alternatives that provide more features and functionality.