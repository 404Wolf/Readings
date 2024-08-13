---
id: b0f2fb68-ddbf-4584-9d6b-7c62ac41a5e5
title: "xonsh Excursions :: Rohit Goswami — Reflections"
tags:
  - RSS
date_published: 2024-07-21 21:04:29
---

# xonsh Excursions :: Rohit Goswami — Reflections
#Omnivore

[Read on Omnivore](https://omnivore.app/me/xonsh-excursions-rohit-goswami-reflections-190d8a90df3)
[Read Original](https://rgoswami.me/posts/xonsh-excursion/)



---

---

## Background

Recently I found myself writing a bunch of search and replace one-liners.

&#x60;&#x60;&#x60;routeros
1export FROM&#x3D;&#39;Matrix3d&#39;; export TO&#x3D;&#39;Matrix3S&#39;; ag -l $FROM | xargs -I {} sd $FROM $TO {}

&#x60;&#x60;&#x60;

Which works, especially since both &#x60;ag&#x60; and &#x60;sd&#x60; are rather good, but it is still:

* Slightly non-ergonomic to type
* Difficult to keep track of  
   * Modulo dumping everything in a &#x60;.sh&#x60; file

These reminded me of the rich set of alternate shells[1](#fn:1).

## Reaching for &#x60;xonsh&#x60;

Although &#x60;nushell&#x60;, &#x60;elvish&#x60; and even &#x60;oil&#x60; seemed promising, I settled on the[Python based xonsh](https:&#x2F;&#x2F;xon.sh&#x2F;).

&#x60;&#x60;&#x60;angelscript
1pipx install xonsh[full]
2pipx inject xonsh xcontrib-sh
3echo &#39;xontrib load sh&#39; &gt;&gt; ~&#x2F;.xonshrc

&#x60;&#x60;&#x60;

Where we use the [injection mechanism](https:&#x2F;&#x2F;pipx.pypa.io&#x2F;latest&#x2F;docs&#x2F;#pipx-inject) to add the [xcontrib-sh](https:&#x2F;&#x2F;github.com&#x2F;anki-code&#x2F;xontrib-sh) plugin for running shell commands without using &#x60;xonsh&#x60;, since we might not want to [translate](https:&#x2F;&#x2F;xon.sh&#x2F;bash%5Fto%5Fxsh.html) every command to be compliant with &#x60;xonsh&#x60;.

### Additions

* &#x60;xonsh-mode&#x60; works well with &#x60;emacs&#x60; and is on MELPA
* [xxh](https:&#x2F;&#x2F;github.com&#x2F;xxh&#x2F;xxh) makes it pretty trivial to take into foreign SSH machines

## Scripting substitutions

Directly leveraging &#x60;xonsh&#x60; we can rewrite the earlier &#x60;bash&#x60; script into:

&#x60;&#x60;&#x60;angelscript
 1from pathlib import Path
 2
 3def replace_make_shared():
 4    FROM_MAKE &#x3D; &#39;Matter&#39;
 5    TO_MAKE &#x3D; &#39;Matter&#39;
 6
 7    files &#x3D; $(ag -l @(FROM_MAKE)).splitlines()
 8
 9    for f in files:
10        if Path(f).exists():
11            sd @(FROM_MAKE) @(TO_MAKE) @(f)
12        else:
13            echo &quot;File not found: @(file)&quot;
14
15replace_make_shared()

&#x60;&#x60;&#x60;

### Leveraging Python

It is instructive to recall how this would work in pure &#x60;python&#x60;.

&#x60;&#x60;&#x60;angelscript
 1import subprocess
 2from pathlib import Path
 3
 4def replace_make_shared():
 5    FROM_MAKE &#x3D; &#39;std::shared_ptr&lt;Matter&gt;&#39;
 6    TO_MAKE &#x3D; &#39;Matter*&#39;
 7
 8    result &#x3D; subprocess.run([&#39;ag&#39;, &#39;-l&#39;, FROM_MAKE],
 9                            capture_output&#x3D;True, text&#x3D;True)
10    files &#x3D; result.stdout.splitlines()
11    actionable_files &#x3D; [x for x in files if &#39;migrator&#39; not in x]
12
13    for f in actionable_files:
14        file_path &#x3D; Path(f)
15        if file_path.exists():
16            subprocess.run([&#39;sd&#39;, FROM_MAKE, TO_MAKE,
17                            str(file_path)], check&#x3D;True)
18        else:
19            print(f&quot;File not found: {file_path}&quot;)
20
21replace_make_shared()

&#x60;&#x60;&#x60;

With [sh](https:&#x2F;&#x2F;sh.readthedocs.io&#x2F;en&#x2F;latest&#x2F;index.html), shell calls become more ergonomic, however, it is still easier to interoperate between the shell outputs and Python code (e.g. using &#x60;echo&#x60;) using&#x60;xonsh&#x60;.

## Conclusions

Personally, &#x60;xonsh&#x60; hits the sweet-spot of being slightly less finicky than POSIX shells while being less verbose than the pure &#x60;python&#x60; variant. It isn’t perfect though:

* The &#x60;python&#x60; dependence, even with &#x60;pipx&#x60; can be an issue [2](#fn:2)  
   * Packages which are needed have to be injected into the same environment..  
         * &#x60;nix&#x60; maybe…
* There is no good testing framework  
   * Ugly &#x60;subprocess&#x60; based &#x60;pytest&#x60; tests could be written

For now, though, this is sufficiently advantageous.

---

1. Like those mentioned in [this list](https:&#x2F;&#x2F;itsfoss.com&#x2F;shells-linux&#x2F;) [↩︎](#fnref:1)
2. True of all [python packages](https:&#x2F;&#x2F;chriswarrick.com&#x2F;blog&#x2F;2023&#x2F;01&#x2F;15&#x2F;how-to-improve-python-packaging&#x2F;) [↩︎](#fnref:2)

---

[![Written by human, not by AI](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3X9B6N8P4mL_vrtU_BFqKhW67a4M6d8JKitE2AEn368&#x2F;https:&#x2F;&#x2F;rgoswami.me&#x2F;&#x2F;images&#x2F;Written-By-Human-Not-By-AI-Badge-white.svg)](https:&#x2F;&#x2F;notbyai.fyi&#x2F;)