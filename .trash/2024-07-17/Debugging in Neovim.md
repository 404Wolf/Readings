---
id: b3dbf984-3ff0-4afa-980c-c26afeb6e542
---

# Debugging in Neovim
#Omnivore

[Read on Omnivore](https://omnivore.app/me/debugging-in-neovim-190c34fa46e)
[Read Original](https://harrisoncramer.me/debugging-in-neovim/)


Debugging in Neovim 

Debug your applications directly within Neovim using the Debug Adapter Protocol, or DAP.

![Debugging client in Neovim.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;900x506,s2He7fXv5px6XonOUM0qSR-gUzyH3NTMPBYoVWecbu5E&#x2F;https:&#x2F;&#x2F;harrisoncramer.me&#x2F;_astro&#x2F;bug.a17114a4_ZzxkUz.avif) 

You’ll probably spend more time debugging your next application than physically typing out the code required to run it. For a little while, the premier tool in the software industry for text manipulation, Neovim, was woefully behind IDEs like VSCode in it’s debugger implementation. That’s no longer the case.

The [Debug Adapter Protocol (DAP)](https:&#x2F;&#x2F;microsoft.github.io&#x2F;debug-adapter-protocol&#x2F;specification) lets Neovim serve as a fully-featured debugger client, letting you attach to a running instance of your code, set breakpoints, inspect variables, examine call stacks, among other helpful debugging techniques.

This post is meant to serve as a basic guide for setting up a debugger in Neovim. Although it applies specifically to Golang, the principles are the same for debuggers for other languages, so long as they implement the Debug Adapter Protocol.

## What is DAP?

The Debug Adapter Protocol, or DAP, is a set of rules for how a debugger communicates with a client (usually an editor). Microsoft’s [summary](https:&#x2F;&#x2F;microsoft.github.io&#x2F;debug-adapter-protocol&#x2F;) puts it succinctly:

“The idea behind the Debug Adapter Protocol (DAP) is to abstract the way how the debugging support of development tools communicates with debuggers or runtimes into a protocol .. The Debug Adapter Protocol makes it possible to implement a generic debugger for a development tool that can communicate with different debuggers via Debug Adapters. And Debug Adapters can be re-used across multiple development tools which significantly reduces the effort to support a new debugger in different tools.”

Translating this to a specific language like Golang, we need the following pieces:

1. Our editor (Neovim)
2. The DAP “client” (the &#x60;nvim-dap&#x60; plugin)
3. The debugger-specific implementations, which we will write
4. The debugger (&#x60;delve&#x60;)
5. The program to run (go code)

## Installing the Debugger

In order to debug a program you need a debugger. This is the tool, typically but not always a binary executable, that runs completely outside of Neovim and attaches to the running process you are trying to debug. To debug the application, I’m going to use the [Delve](https:&#x2F;&#x2F;github.com&#x2F;go-delve&#x2F;delve) debugger.

The program that I’m going to “debug” is a simple TCP server implemented in Golang. You can get the same source code [from my Github, here,](https:&#x2F;&#x2F;github.com&#x2F;harrisoncramer&#x2F;go-connect-tcp.git) or you can use your own program.

You can compile and run the TCP server by navigating to the root directory, and running:

The equivalent command with Delve, which compiles the program with the correct debugger flags, and then starts that binary and attaches, is the following:

With delve attached, you can then step through the code in a REPL-like environment.

You can install the Delve and other debuggers outside of Neovim, but I prefer to keep my debugger installations baked into my Neovim configuration with [Mason](https:&#x2F;&#x2F;github.com&#x2F;williamboman&#x2F;mason.nvim), and optionally, [mason-nvim-dap](https:&#x2F;&#x2F;github.com&#x2F;jay-babu&#x2F;mason-nvim-dap.nvim). This lets me automatically install them in a consistent path, even if my machine changes. Mason is the defacto Neovim standard for debugger installations, LSP installations, linters, and formatters.

After adding Mason to your Neovim configuration (I’m using Packer to manage my plugins), open up Mason’s UI with the &#x60;:Mason&#x60; command, and navigate to the DAP page:

![Mason](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,spqkRAA71rp6clDCxPGl-ie6XO5vS0VqPPpUNIATRAYg&#x2F;https:&#x2F;&#x2F;harrisoncramer.me&#x2F;inline_images&#x2F;mason-dap.png)

Install the delve debugger by pressing the &#x60;i&#x60; key to install it. Once the debugger is installed, you should be able to see the binary in Mason’s standard binary path at &#x60;~&#x2F;.local&#x2F;share&#x2F;nvim&#x2F;mason&#x2F;bin&#x60;. In a terminal window, run the following command to prove it’s been installed:

&#x60;&#x60;&#x60;groovy
$  ~&#x2F;.local&#x2F;share&#x2F;nvim&#x2F;mason&#x2F;bin&#x2F;dlv version
Delve Debugger
Version: 1.20.1
Build: $Id: 96e65b6c615845d42e0e31d903f6475b0e4ece6e
&#x60;&#x60;&#x60;

Great! We know now that &#x60;delve&#x60; is installed on our machine at the specified path.

&gt; This next part is optional. Skip it if you’d like.

This is all fine and good, but we can actually use another plugin _for mason_ to specify the debuggers we want installed automatically, called [mason-nvim-dap](https:&#x2F;&#x2F;github.com&#x2F;jay-babu&#x2F;mason-nvim-dap.nvim). Install this and add the following line to your Neovim configuration file:

&#x60;&#x60;&#x60;stylus
require(&quot;mason-nvim-dap&quot;).setup({
    ensure_installed &#x3D; { &quot;delve&quot; }
})
&#x60;&#x60;&#x60;

Next, uninstall the delve debugger through Mason’s UI (the same way you installed it, but by pressing &#x60;X&#x60; when hovering over it). Close and reopen Neovim, and you should see that the debugger is automatically installed for you in the same path. Check the messages with &#x60;:messages&#x60; and you should see the following:

&#x60;&#x60;&#x60;cs
[mason-nvim-dap] installing delve
[mason-nvim-dap] delve was installed

&#x60;&#x60;&#x60;

This is great, because it allows us to specify the automatic installation of debuggers directly within our Neovim configuration. Not all debuggers available by Mason are included in this extra extension, so just be aware of that.

## Installing Nvim-DAP

Next, we need to install [nvim-dap](https:&#x2F;&#x2F;github.com&#x2F;mfussenegger&#x2F;nvim-dap), the plugin that will actually allow Neovim to communicate with Delve.

Once you have it installed, let’s see nvim-dap “breaking” before we understand how to get it working. Install nvim-dap, and open up the &#x60;main.go&#x60; file in your project and run the following ex command: &#x60;:lua require(&quot;dap&quot;).continue()&#x60;

You should see the following message:

&#x60;&#x60;&#x60;pgsql
No configuration found for &#x60;go&#x60;. You need to add configs to &#x60;dap.configurations.go&#x60; (See &#x60;:h dap-configuration&#x60;)

&#x60;&#x60;&#x60;

What’s going on here? We’ve installed the debugger, and the debugger adapter for Neovim, but we haven’t told nvim-dap what do to for Golang files yet. As the documentation states: “Neovim needs to instruct the debug adapter .. how to launch and connect to the debugee. The debugee is the application you want to debug.”

Add the following to your configuration:

&#x60;&#x60;&#x60;routeros
local dap_ok, dap &#x3D; pcall(require, &quot;dap&quot;)
if not (dap_ok) then
  print(&quot;nvim-dap not installed!&quot;)
  return
end
 
require(&#39;dap&#39;).set_log_level(&#39;INFO&#39;) -- Helps when configuring DAP, see logs with :DapShowLog
 
dap.configurations &#x3D; {
    go &#x3D; {
      {
        type &#x3D; &quot;go&quot;, -- Which adapter to use
        name &#x3D; &quot;Debug&quot;, -- Human readable name
        request &#x3D; &quot;launch&quot;, -- Whether to &quot;launch&quot; or &quot;attach&quot; to program
        program &#x3D; &quot;${file}&quot;, -- The buffer you are focused on when running nvim-dap
      },
    }
}
&#x60;&#x60;&#x60;

Now, run the same command. You should see a different error message:

&#x60;&#x60;&#x60;maxima
The selected configuration references adapter &#x60;go&#x60;, but dap.adapters.go is undefined

&#x60;&#x60;&#x60;

We now need to specify a debug adapter that will run for this configuration. Add this to your configuration:

&#x60;&#x60;&#x60;routeros
dap.adapters.go &#x3D; {
  type &#x3D; &quot;server&quot;,
  port &#x3D; &quot;${port}&quot;,
  executable &#x3D; {
    command &#x3D; vim.fn.stdpath(&quot;data&quot;) .. &#39;&#x2F;mason&#x2F;bin&#x2F;dlv&#39;,
    args &#x3D; { &quot;dap&quot;, &quot;-l&quot;, &quot;127.0.0.1:${port}&quot; },
  },
}
&#x60;&#x60;&#x60;

We should finally be set up and ready to run the debugger for real. Hover over a line in the &#x60;main.go&#x60; file and set a breakpoint with &#x60;:lua require(&quot;dap&quot;).toggle_breakpoint()&#x60; then re-run the above command to start the debugger.

After a moment, you should see the debugger pause on the line you set. You shouldn’t see any errors, and if you grep for a running delve process, you should see it:

&#x60;&#x60;&#x60;angelscript
$ top | grep dlv
96326  dlv              0.0  00:00.09 16     0   37     17M    0B    0B    96326 96166 sleeping *0[1]      0.00000 0.00000    501 2160     443   40        15        6086       112       2575       0       11       0.0   0         0         harrisoncramer         N&#x2F;A    N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A
96326  dlv              0.0  00:00.09 16     0   37     17M    0B    0B    96326 96166 sleeping *0[1]      0.00000 0.00000    501 2160     443   40        15        6086       112       2575       0       11       0.0   0         0         harrisoncramer         N&#x2F;A    N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A
96326  dlv              0.0  00:00.09 16     0   37     17M    0B    0B    96326 96166 sleeping *0[1]      0.00000 0.00000    501 2160     443   40        15        6086       112       2575       0       11       0.0   0         0         harrisoncramer         N&#x2F;A    N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A
96326  dlv              0.0  00:00.09 16     0   37     17M    0B    0B    96326 96166 sleeping *0[1]      0.00000 0.00000    501 2160     443   40        15        6102+      112       2585+      0       12+      0.0   146088    455607    harrisoncramer         N&#x2F;A    N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A
96326  dlv              0.0  00:00.09 16     0   37     17M    0B    0B    96326 96166 sleeping *0[1]      0.00000 0.00000    501 2160     443   40        15        6102       112       2585       0       12       0.0   0         0         harrisoncramer         N&#x2F;A    N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A   N&#x2F;A

&#x60;&#x60;&#x60;

Nice! This shows that we’ve successfully set up delve to launch via Neovim. This is the first step! Finally, close and terminate the debugger with &#x60;:lua require(&quot;dap&quot;).terminate()&#x60; which will close the delve process and terminate the connection.

## Configuring Dap-UI

The default experience with DAP is pretty rough without a better interface, and keybindings to start and stop the debugger, set breakpoints in the code, and so forth. Luckily, this is very easy to configure with [nvim-dap-ui](https:&#x2F;&#x2F;github.com&#x2F;rcarriga&#x2F;nvim-dap-ui). This is the configuration that I like.

&#x60;&#x60;&#x60;nix
local dap_ui_ok, ui &#x3D; pcall(require, &quot;dapui&quot;)
if not (dap_ok and dap_ui_ok) then
  require(&quot;notify&quot;)(&quot;dap-ui not installed!&quot;, &quot;warning&quot;)
  return
end
 
ui.setup({
  icons &#x3D; { expanded &#x3D; &quot;▾&quot;, collapsed &#x3D; &quot;▸&quot; },
  mappings &#x3D; {
    open &#x3D; &quot;o&quot;,
    remove &#x3D; &quot;d&quot;,
    edit &#x3D; &quot;e&quot;,
    repl &#x3D; &quot;r&quot;,
    toggle &#x3D; &quot;t&quot;,
  },
  expand_lines &#x3D; vim.fn.has(&quot;nvim-0.7&quot;),
  layouts &#x3D; {
    {
      elements &#x3D; {
        &quot;scopes&quot;,
      },
      size &#x3D; 0.3,
      position &#x3D; &quot;right&quot;
    },
    {
      elements &#x3D; {
        &quot;repl&quot;,
        &quot;breakpoints&quot;
      },
      size &#x3D; 0.3,
      position &#x3D; &quot;bottom&quot;,
    },
  },
  floating &#x3D; {
    max_height &#x3D; nil,
    max_width &#x3D; nil,
    border &#x3D; &quot;single&quot;,
    mappings &#x3D; {
      close &#x3D; { &quot;q&quot;, &quot;&lt;Esc&gt;&quot; },
    },
  },
  windows &#x3D; { indent &#x3D; 1 },
  render &#x3D; {
    max_type_length &#x3D; nil,
  },
})
&#x60;&#x60;&#x60;

I also have the following keybindings set up to call functions in both plugins:

&#x60;&#x60;&#x60;lua
local dap_ok, dap &#x3D; pcall(require, &quot;dap&quot;)
local dap_ui_ok, ui &#x3D; pcall(require, &quot;dapui&quot;)
 
if not (dap_ok and dap_ui_ok) then
  require(&quot;notify&quot;)(&quot;nvim-dap or dap-ui not installed!&quot;, &quot;warning&quot;) -- nvim-notify is a separate plugin, I recommend it too!
  return
end
 
vim.fn.sign_define(&#39;DapBreakpoint&#39;, { text &#x3D; &#39;🐞&#39; })
 
-- Start debugging session
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;ds&quot;, function()
  dap.continue()
  ui.toggle({})
  vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(&quot;&lt;C-w&gt;&#x3D;&quot;, false, true, true), &quot;n&quot;, false) -- Spaces buffers evenly
end)
 
-- Set breakpoints, get variable values, step into&#x2F;out of functions, etc.
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;dl&quot;, require(&quot;dap.ui.widgets&quot;).hover)
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;dc&quot;, dap.continue)
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;db&quot;, dap.toggle_breakpoint)
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;dn&quot;, dap.step_over)
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;di&quot;, dap.step_into)
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;do&quot;, dap.step_out)
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;dC&quot;, function()
  dap.clear_breakpoints()
  require(&quot;notify&quot;)(&quot;Breakpoints cleared&quot;, &quot;warn&quot;)
end)
 
-- Close debugger and clear breakpoints
vim.keymap.set(&quot;n&quot;, &quot;&lt;localleader&gt;de&quot;, function()
  dap.clear_breakpoints()
  ui.toggle({})
  dap.terminate()
  vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(&quot;&lt;C-w&gt;&#x3D;&quot;, false, true, true), &quot;n&quot;, false)
  require(&quot;notify&quot;)(&quot;Debugger session ended&quot;, &quot;warn&quot;)
end)
&#x60;&#x60;&#x60;

We now have a nice interface that lets us step through the code, view breakpoints, and so forth. Here’s what the full setup looks like on my machine:

![Nvim-DAP](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sd6VupHnsW7hbFLdfpWGYvnNLkTgT03lxoyQ-yX_OJZ8&#x2F;https:&#x2F;&#x2F;harrisoncramer.me&#x2F;inline_images&#x2F;nvim-dap-ui-go.png)

## Multiple Configurations

This works fine if you want to run the equivalent of &#x60;dlv debug .&#x60; locally. But what if you want to have multiple different debug configurations for different scenarios? You can simply add another table to your &#x60;dap.configurations.go&#x60; table! I’ve got separate configurations for:

1. Compiling and running the program with delve right away (what we just configured)
2. Debugging a test file
3. Attaching to a running debugger by picking it’s PID
4. Attaching to an already running debugger running on a specific port

They look like this, and nvim-dap will ask me which of the configurations I’d like to use when I open it on a Golang file:

&#x60;&#x60;&#x60;routeros
local go &#x3D; {
  {
    type &#x3D; &quot;go&quot;,
    name &#x3D; &quot;Debug&quot;,
    request &#x3D; &quot;launch&quot;,
    program &#x3D; &quot;${file}&quot;,
  },
  {
    type &#x3D; &quot;go&quot;,
    name &#x3D; &quot;Debug test (go.mod)&quot;,
    request &#x3D; &quot;launch&quot;,
    mode &#x3D; &quot;test&quot;,
    program &#x3D; &quot;.&#x2F;${relativeFileDirname}&quot;,
  },
  {
    type &#x3D; &quot;go&quot;,
    name &#x3D; &quot;Attach (Pick Process)&quot;,
    mode &#x3D; &quot;local&quot;,
    request &#x3D; &quot;attach&quot;,
    processId &#x3D; require(&#39;dap.utils&#39;).pick_process,
  },
  {
    type &#x3D; &quot;go&quot;,
    name &#x3D; &quot;Attach (127.0.0.1:9080)&quot;,
    mode &#x3D; &quot;remote&quot;,
    request &#x3D; &quot;attach&quot;,
    port &#x3D; &quot;9080&quot;
  },
}
&#x60;&#x60;&#x60;

## Repeating this for NodeJS

The above pattern lets us easily set up debuggers for a variety of different languages and tools. For a full list of the supported configurations you can go [to Nvim-DAP’s documentation on Github](https:&#x2F;&#x2F;github.com&#x2F;mfussenegger&#x2F;nvim-dap&#x2F;wiki&#x2F;Debug-Adapter-installation).

For instance, let’s set up a debugger for Node (server-side Javascript) now.

First, let’s add the debugger to our list of required debuggers (if you skipped this step earlier you can just install it manually with Mason):

&#x60;&#x60;&#x60;stylus
require(&quot;mason-nvim-dap&quot;).setup({
    ensure_installed &#x3D; { &quot;delve&quot;, &quot;node2&quot; }
})
&#x60;&#x60;&#x60;

Next we just need to add a configuration for JS files to our &#x60;dap.configurations&#x60; table:

&#x60;&#x60;&#x60;routeros
dap.configurations &#x3D; {
    go &#x3D; {
      {
        type &#x3D; &quot;go&quot;, -- Which adapter to use
        name &#x3D; &quot;Debug&quot;, -- Human readable name
        request &#x3D; &quot;launch&quot;, -- Whether to &quot;launch&quot; or &quot;attach&quot; to program
        program &#x3D; &quot;${file}&quot;, -- The buffer you are focused on when running nvim-dap
      },
    },
    javascript &#x3D; {
      {
        type &#x3D; &#39;node2&#39;;
        name &#x3D; &#39;Launch&#39;,
        request &#x3D; &#39;launch&#39;;
        program &#x3D; &#39;${file}&#39;;
        cwd &#x3D; vim.fn.getcwd();
        sourceMaps &#x3D; true;
        protocol &#x3D; &#39;inspector&#39;;
        console &#x3D; &#39;integratedTerminal&#39;;
      },
      {
        type &#x3D; &#39;node2&#39;;
        name &#x3D; &#39;Attach&#39;,
        request &#x3D; &#39;attach&#39;;
        program &#x3D; &#39;${file}&#39;;
        cwd &#x3D; vim.fn.getcwd();
        sourceMaps &#x3D; true;
        protocol &#x3D; &#39;inspector&#39;;
        console &#x3D; &#39;integratedTerminal&#39;;
      },
    }
}
&#x60;&#x60;&#x60;

And finally an entry to our &#x60;dap.adapters&#x60; table for the debugger that we just installed:

&#x60;&#x60;&#x60;routeros
dap.adapters.node2 &#x3D; {
  type &#x3D; &#39;executable&#39;;
  command &#x3D; &#39;node&#39;,
  args &#x3D; { vim.fn.stdpath(&quot;data&quot;) .. &#39;&#x2F;mason&#x2F;packages&#x2F;node-debug2-adapter&#x2F;out&#x2F;src&#x2F;nodeDebug.js&#39; };
}
&#x60;&#x60;&#x60;

Now we can open up Javascript files and set breakpoints and inspect code the same way we did with Go! You can see now why DAP is a powerful framework that lets us easily abstract away langugage-specific debugger implementations!

## Next Steps

We’ve now walked through the installation of the debugger, the debugger adapter, configuring the debugger, and adding a UI layer. If something goes wrong during your own setup, check Neovim’s messages, and also DAP’s logs with &#x60;:DapShowLog&#x60;.

It’s worth mentioning that you can achieve configuration of the debug adapter for Go specifically with [nvim-dap-go](https:&#x2F;&#x2F;github.com&#x2F;leoluz&#x2F;nvim-dap-go), which will effectively write the &#x60;dap.configurations.go&#x60; and &#x60;dap.adapters.go&#x60; sections of your DAP configuration for you. You’ll still need to install the debugger (delve) in order to use it, and the UI. If you prefer a more out-of-the-box configuration for Golang specifically, this plugin is quite nice.

Finally, you can find my personal dotfiles [on my Github account](https:&#x2F;&#x2F;harrisoncramer.me&#x2F;debugging-in-neovim&#x2F;github.com&#x2F;harrisoncramer&#x2F;nvim) and specifically my [debugger configuration](https:&#x2F;&#x2F;github.com&#x2F;harrisoncramer&#x2F;nvim&#x2F;tree&#x2F;main&#x2F;lua&#x2F;plugins&#x2F;dap).