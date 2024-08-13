---
id: 0c1baea1-3222-4ad0-b2c3-e5307f98d743
title: Laurent Direr
tags:
  - RSS
date_published: 2024-06-14 12:07:07
---

# Laurent Direr
#Omnivore

[Read on Omnivore](https://omnivore.app/me/laurent-direr-1901864349b)
[Read Original](https://ldirer.com/blog/posts/pycharm-tips)



Because discussing shortcuts and configuration with coworkers isn&#39;t always the most exciting conversation, I wrote it down instead.

## [Read the &quot;Shortcuts&quot; section](#shortcuts)Shortcuts

### [Read the &quot;Essentials&quot; section](#essentials)Essentials

&#x60;CTRL+SHIFT+A&#x60; is the shortcut I find the most useful.

It opens the &#39;Actions&#39; search modal, an equivalent of the &#39;command palette&#39; in VS Code.

I use it to:

* do something but I don&#39;t know where the button is
* get the keyboard shortcut for something (displayed in search results)
* assign a new shortcut to something (once you found an action, there&#39;s an option to create a shortcut for it at the bottom of the search results)

I also recommend the &#39;Key Promoter X&#39; plugin as a tool to learn new keyboard shortcuts.

### [Read the &quot;What I use&quot; section](#what-i-use)What I use

Your key combination might differ (I&#39;ve customized some). Use the &#39;CTRL+SHIFT+A&#39; shortcut to find your specific bindings.

**Code:**

* &#x60;Ctrl+Space&#x60;: Code completion. To use &#x60;LongClassNameFromThatPackage&#x60; I type &#x60;LongClass&lt;completion shortcut, multiple times&gt;&#x60;, then select the relevant option: the name completes and the import is added if it was missing. Amazing!  
Pressing it multiple times triggers different completions, so I make sure to give it a few presses before accepting that maybe PyCharm does not find what I&#39;m looking for.
* &#x60;Alt+Enter&#x60;: Show intention actions. For example, if &#x60;User&#x60; is underlined in red because it&#39;s not imported, I place the cursor on &#x60;User&#x60; and hit &#x60;alt+enter&#x60;. PyCharm offers to import it. Useful in many situations (not just imports!), whenever a &#39;light bulb&#39; icon appears.
* &#x60;ALT+J&#x60;: Add a cursor on the next occurrence of selected text. I use the IdeaVim plugin but occasionally toggle out of it for multi-cursor text editing.
* &#x60;SHIFT+F6&#x60;: Rename variable&#x2F;file. Part of &#39;refactoring&#39; options.

**Navigate in code:**

* &#x60;CTRL+B&#x60;: Go to declaration. Also doubles as &#39;find usages&#39;.
* &#x60;Alt+left&#x60;: Navigate &gt; Back. Useful after a &#39;go to definition&#39; to get back to the original place. I customized the bindings for this shortcut.
* &#x60;CTRL+SHIFT+ALT+DOWN&#x2F;UP&#x60;: Go to the next&#x2F;previous &#39;version control change&#39;. I changed the bindings to &#x60;ALT+N&#x2F;ALT+B&#x60; due to conflicts with window management in my environment. I use this frequently to navigate to modified lines.

**Navigate between files:**

* &#x60;CTRL+E&#x60;: Recent files. I use this constantly, especially when toggling between two files.
* &#x60;CTRL+SHIFT+N&#x60;: Search for and open a project file.
* &#x60;ALT+F1&#x60; \+ &#x60;Enter&#x60;: Show the current open file in the file tree (&#39;Project view&#39;) without manually clicking through folders.

**Things I use occasionally:**

* &#x60;SHIFT+SHIFT&#x60;: Search everywhere. The specialized variants are also useful.
* &#x60;CTRL+SHIFT+N&#x2F;V&#x60;: Inline&#x2F;extract variable.
* &#x60;CTRL+SHIFT+I&#x60;: Quick info. A preview of where &#39;go to declaration&#39; would go. Convenient to avoid navigating away.
* &#x60;CTRL+P&#x60;: Parameter info. Useful for a quick look at a function signature.
* &#x60;CTRL+SHIFT+P&#x60;: Type info for the thing under cursor.
* &#x60;CTRL+SHIFT+ALT+C&#x60;: Copy the path to the current line. Something like: &#x60;src&#x2F;scripts&#x2F;cli.py:13&#x60;. Useful for sharing specific code locations with coworkers. The command is part of a &#39;Copy Path&#x2F;reference&#39; menu.
* &#x60;CTRL+ALT+Z&#x60;: Version control &#39;revert&#39;. I often use this to view the code before my changes. I revert my changes to see the original code, then &#39;undo&#39; the revert. The gutter color indicates the lines that will be affected.

**Things I don&#39;t really use:**

* Bookmarks: I don&#39;t use them much, though they seem useful when frequently going back to specific locations.
* Auto reformat code: On most projects I favor precommit hooks for consistent formatting. I might still use the shortcut while writing code but I don&#39;t care that it is not the source of truth.
* Navigation between tabs (and more) with the &#39;Switcher&#39; (&#x60;CTRL+TAB&#x60;). I&#39;m happy enough with &#39;recent files&#39; and other shortcuts.

## [Read the &quot;Navigate to data files using &#39;go to source&#39;&quot; section](#navigate-to-data-files-using-go-to-source)Navigate to data files using &#39;go to source&#39;

Sometimes the code loads some data files and I want to view their content (fairly common in tests).

For example:

&#x60;&#x60;&#x60;python
@pytest.fixture
def response_data_ok() -&gt; dict:
    return load_file(&quot;response_data_ok.json&quot;)

&#x60;&#x60;&#x60;

**Goal:** With the cursor on the filename string, &#39;go to declaration&#39; opens the relevant json file.

This works if:

1. The &#x60;load_file&#x60; function uses correct type hints:  
&#x60;&#x60;&#x60;reasonml  
 def load_file(fname: os.PathLike | str):  
     with open(os.path.join(TEST_DATA_DIR, fname), &quot;rb&quot;) as f:  
         return json.load(f)  
&#x60;&#x60;&#x60;
2. In PyCharm, the folder where the json file lives is **marked as Resource root** (right click &gt; mark directory as &gt; Resource root).

My understanding is that PyCharm looks for file names in all resource folders and jumps to the first match (meaning this isn&#39;t perfect and conflicts might occur).

## [Read the &quot;Personal preference: old &#39;local changes&#39; tab&quot; section](#personal-preference-old-local-changes-tab)Personal preference: old &#39;local changes&#39; tab

For a couple of years I have been using an old version of the &#39;local changes&#39; tab. I find it nice to &#x60;git reset HEAD~1&#x60; and have the highlighting of all changes in the commit.  
The new UI was introduced a while ago but the old one can still be restored by unchecking Settings &gt; Version Control &gt; Commit &gt; Use non-modal commit interface.

[Other people sharing my feeling.](https:&#x2F;&#x2F;intellij-support.jetbrains.com&#x2F;hc&#x2F;en-us&#x2F;community&#x2F;posts&#x2F;360008229959-Version-control-local-changes-tab-missing-in-2020-1)

## [Read the &quot;Open issues&quot; section](#open-issues)Open issues

If you have a solution for these issues I&#39;d love to hear them!

* Noisy import suggestions: Sometimes, with many packages installed in a Python virtual environment, PyCharm offers multiple versions of imports. For example, with pytest, it might suggest &#x60;celery.contrib.pytest&#x60; or &#x60;jedi.plugins.pytest&#x60;.  
It adds a tiny bit of friction to the &#39;auto import&#39; feature because I need to pick the right option (typically not the first one).
* The setup that allows to navigate to data files seems to mess up renaming a file (this only relates to non-python files, for instance the json file from the fixture). This is a very marginal issue but if there&#39;s a simple solution I&#39;d take it!