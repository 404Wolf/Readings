---
id: 24aa3fbb-97c9-45c7-8cb0-8f7c0c1e017d
title: "Exploring Nix Flakes: Build LaTeX Documents Reproducibly"
date_published: 2021-11-16 19:00:00
---

# Exploring Nix Flakes: Build LaTeX Documents Reproducibly
#Omnivore

[Read on Omnivore](https://omnivore.app/me/exploring-nix-flakes-build-la-te-x-documents-reproducibly-190ad6f5730)
[Read Original](https://flyx.org/nix-flakes-latex/)



This article shows how to use [Nix Flakes](https:&#x2F;&#x2F;nixos.wiki&#x2F;wiki&#x2F;Flakes) to build LaTeX documents. It is not particularly beginner-friendly to keep it at manageable size.

If you don’t know much about Nix and are in a hurry, I recommend [_this article_](https:&#x2F;&#x2F;serokell.io&#x2F;blog&#x2F;practical-nix-flakes) for a quick overview of the language and Flakes. A proper way to learn about Nix is the [_Nix Pills_](https:&#x2F;&#x2F;nixos.org&#x2F;guides&#x2F;nix-pills&#x2F;) series, and [_this series_](https:&#x2F;&#x2F;www.tweag.io&#x2F;blog&#x2F;2020-05-25-flakes&#x2F;) about Nix Flakes.

The proper way to learn LaTeX is to take any vaguely math-related academic course and be peer-pressured into trying it out until it works. Jokes aside, this probably isn’t an interesting read for people who are not already familiar with LaTeX; while I will explain the things I’m doing with Nix, the LaTeX code I will just throw at you assuming you can read it.

**Metered connection users:** Be aware that the instructions in this article download quite a bit of data from the internet.

## Getting Started

In an empty directory, let’s start a &#x60;document.tex&#x60; file like this:

&#x60;&#x60;&#x60;tex
\documentclass[a4paper]{article}

\begin{document}
  Hello, World!
\end{document}
&#x60;&#x60;&#x60;

Now we want to tell Nix how to build this document. To do this, create a file &#x60;flake.nix&#x60; with the following content:

&#x60;&#x60;&#x60;nix
{
  description &#x3D; &quot;LaTeX Document Demo&quot;;
  inputs &#x3D; {
    nixpkgs.url &#x3D; github:NixOS&#x2F;nixpkgs&#x2F;nixos-21.05;
    flake-utils.url &#x3D; github:numtide&#x2F;flake-utils;
  };
  outputs &#x3D; { self, nixpkgs, flake-utils }:
    with flake-utils.lib; eachSystem allSystems (system:
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
          inherit (pkgs.texlive) scheme-minimal latex-bin latexmk;
      };
    in rec {
      packages &#x3D; {
        document &#x3D; pkgs.stdenvNoCC.mkDerivation rec {
          name &#x3D; &quot;latex-demo-document&quot;;
          src &#x3D; self;
          buildInputs &#x3D; [ pkgs.coreutils tex ];
          phases &#x3D; [&quot;unpackPhase&quot; &quot;buildPhase&quot; &quot;installPhase&quot;];
          buildPhase &#x3D; &#39;&#39;
            export PATH&#x3D;&quot;${pkgs.lib.makeBinPath buildInputs}&quot;;
            mkdir -p .cache&#x2F;texmf-var
            env TEXMFHOME&#x3D;.cache TEXMFVAR&#x3D;.cache&#x2F;texmf-var \
              latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
              document.tex
          &#39;&#39;;
          installPhase &#x3D; &#39;&#39;
            mkdir -p $out
            cp document.pdf $out&#x2F;
          &#39;&#39;;
        };
      };
      defaultPackage &#x3D; packages.document;
    });
}
&#x60;&#x60;&#x60;

Our inputs are &#x60;nixpkgs&#x60;, the main Nix package repository, from which we primarily need _TeX Live_, and &#x60;flake-utils&#x60;, a library that provides some convenience functions.

For defining our outputs, we use &#x60;eachSystem&#x60; (from &#x60;flake-utils&#x60;) to define an output package for each system in &#x60;allSystems&#x60; – we do want users on any system to be able to compile our document.

The important bit &#x60;pkgs.texlive.combine&#x60; builds a TeX Live installation containing the TeX Live packages we specify. For building our minimal document, we start with &#x60;scheme-minimal&#x60; and include &#x60;latex-bin&#x60; (to have &#x60;lualatex&#x60;) and &#x60;latexmk&#x60; (our helper script to build the document).

Then, we define our output package _document_. Since building LaTeX document requires no C compiler, we use &#x60;stdenvNoCC&#x60;. We need the phases _unpack_ (to access our source code), _build_ (to typeset the document) and _install_ (to copy the PDF into &#x60;$out&#x60;).

&#x60;latexmk&#x60; is a script that continuously calls our LaTeX processor (in this case, &#x60;lualatex&#x60;) until the document reaches a fixpoint.&#x60;lualatex&#x60; needs writable cache directories, which we create and communicate via environment variables.&#x60;-interaction&#x3D;nonstopmode&#x60; will cause &#x60;lualatex&#x60; to not stop and ask for user input in case an error is encountered, as it would by default. By the way, we use &#x60;lualatex&#x60; instead of &#x60;pdflatex&#x60; simply because it is the more modern alternative, supporting UTF-8, TTF&#x2F;OTF Fonts, etc.

In the _install_ phase, we create the &#x60;$out&#x60; directory and copy the created document into it. We could instead make our document itself be &#x60;$out&#x60; (because it is the only output file of our derivation), but having a PDF file without &#x60;.pdf&#x60; extension felt weird, so I created a containing directory.

Now let’s pin our input flakes to their current versions by doing

&#x60;&#x60;&#x60;cos
nix flake lock
&#x60;&#x60;&#x60;

For those not familiar with Flakes, this will create a file &#x60;flake.lock&#x60; (feel free to explore its contents). From now on, we are working on specific versions of our inputs, which are described in &#x60;flake.lock&#x60;.

One last thing before we can build our document: The variable &#x60;self&#x60; will only contain those files of our source that are checked into version control. So we’ll do

&#x60;&#x60;&#x60;pgsql
git init
git add flake.{nix,lock} document.tex
git commit -m &quot;initial commit&quot;
&#x60;&#x60;&#x60;

When that’s done, we can build our document with

&#x60;&#x60;&#x60;ebnf
nix build
&#x60;&#x60;&#x60;

This will take some time, but will eventually create a directory &#x60;result&#x60; which contains &#x60;document.pdf&#x60;. Actually, &#x60;result&#x60; is a symlink which can be inspected via

&#x60;&#x60;&#x60;applescript
readlink result
&#x60;&#x60;&#x60;

And it points to our &#x60;&#x2F;nix&#x2F;store&#x60;.

As shown by this minimal example, our &#x60;flake.nix&#x60; is not just a build system, but also manages all dependencies that are required to build our document.

To be truly reproducible, the PDF file we create must always be exactly the same. This is currently not the case for two reasons:

* LaTeX likes to put the generation date into the document. This obviously happens when you query it e.g. with &#x60;\today&#x60;, but the date also gets filled into the PDF’s _Creation date_ attribute.
* The resulting PDF has a seemingly random ID value added into the PDF’s xref table.

The fix to the first problem depends a bit on whether you’re using &#x60;\today&#x60;, and if so, what for. For example, when rendering a letter, you _do want_ the date on the letter to be the one from when you generated it (or more precisely, when you sent it, but we cannot do anything about it after the PDF has been created).

The tool we need to solve the problem is the environment variable &#x60;SOURCE_DATE_EPOCH&#x60;. If we set it to a Unix timestamp, LaTeX will use that instead of the current date. We thus modify the call to &#x60;latexmk&#x60; like this:

&#x60;&#x60;&#x60;routeros
env TEXMFHOME&#x3D;.cache TEXMFVAR&#x3D;.cache&#x2F;texmf-var \
   SOURCE_DATE_EPOCH&#x3D;${toString self.lastModified} \
   latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
   document.tex
&#x60;&#x60;&#x60;

&#x60;self.lastModified&#x60; is set to the Unix timestamp of the last commit in our repository. This seems to be a reasonable date to set, but in the case of a letter, I would actually advise to explicitly set the date, e.g.

&#x60;&#x60;&#x60;routeros
env TEXMFHOME&#x3D;.cache TEXMFVAR&#x3D;.cache&#x2F;texmf-var \
  SOURCE_DATE_EPOCH&#x3D;$(date -d &quot;2021-11-30&quot; +%s) \
  latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
  document.tex
&#x60;&#x60;&#x60;

This way, you will always know when you sent the letter. I used the &#x60;date&#x60; utility so that the date is readable. You can of course put it into a nix variable in the Flake and interpolate it into the command if you want.

Now that we have fixed the date, we still have the ID. That ID is actually calculated from the system date and time, and the full path of the generated PDF file, and thus we won’t be able to modify it to our needs from the outside. There are however TeX commands we can use:

&#x60;&#x60;&#x60;tex
% LuaTeX
\pdfvariable suppressoptionalinfo 512\relax
% pdfTeX
\pdftrailerid{}
% XeTeX
\special{pdf:trailerid [
    &lt;00112233445566778899aabbccddeeff&gt;
    &lt;00112233445566778899aabbccddeeff&gt;
]}
&#x60;&#x60;&#x60;

XeTeX is the only backend that seems not to be able to omit the ID, so the command is setting it to some literal value. Since we’re using LuaLaTeX, we want the LuaTeX solution. And since this is irrelevant to the document’s content, let’s prepend it to the input via latexmk:

&#x60;&#x60;&#x60;routeros
env TEXMFHOME&#x3D;.cache TEXMFVAR&#x3D;.cache&#x2F;texmf-var \
  SOURCE_DATE_EPOCH&#x3D;$(date -d &quot;2021-11-30&quot; +%s) \
  latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
  -pretex&#x3D;&quot;\pdfvariable suppressoptionalinfo 512\relax&quot; \
  -usepretex document.tex
&#x60;&#x60;&#x60;

With this, we have a truly reproducible PDF output. Now, let’s explore what happens when we use packages in our LaTeX document.

## TeX Live Packages

Let’s say we want to have a nice tabular in our &#x60;document.tex&#x60;:

&#x60;&#x60;&#x60;tex
\documentclass[a4paper]{article}

\usepackage{nicematrix}

\begin{document}
  \begin{NiceTabular}{p{5.5cm}|p{2cm}}
  \CodeBefore
    \rowcolors{2}{white}{gray!30}
  \Body \hline
    droggel &amp; 23 \\ \hline
    jug     &amp; 42 \\ \hline
  \end{NiceTabular}
\end{document}
&#x60;&#x60;&#x60;

However, our current _TeX Live_ configuration does not provide &#x60;nicematrix&#x60;. The packages we provide in &#x60;pkgs.texlive.combine&#x60; are defined by [tlmgr](https:&#x2F;&#x2F;www.tug.org&#x2F;texlive&#x2F;tlmgr.html), TeX Live’s package manager. Usually, the name we give in &#x60;\usepackage&#x60; is the name of the package we need to include, so let’s test that:

&#x60;&#x60;&#x60;nix
    # […]
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-minimal latex-bin latexmk
        nicematrix;
      };
    in rec {
    # […]
&#x60;&#x60;&#x60;

Don’t forget to commit all changes to git before building (we’ll just amend our initial commit):

&#x60;&#x60;&#x60;sql
git commit -a --amend --no-edit
nix build
&#x60;&#x60;&#x60;

While &#x60;nicematrix&#x60; is indeed the correct package here, we’ll run into an error. It turns out, &#x60;nicematrix&#x60; requires some additional packages to work and we didn’t include them. Can you figure out which ones? I’ll wait.

If you actually tried to tackle this problem, you have probably read the log, which tells you some &#x60;.sty&#x60; files are missing, and then tried to include their names in &#x60;pkgs.texlive.combine&#x60;. That only brings you so far, because _some_ &#x60;.sty&#x60; files are included in packages that carry a different name. The following is the complete list of packages we need:

&#x60;&#x60;&#x60;properties
    # […]
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-minimal latex-bin latexmk
        tools amsmath pgf epstopdf-pkg nicematrix infwarerr grfext
        kvdefinekeys kvsetkeys kvoptions ltxcmds;
      };
    in rec {
    # […]
&#x60;&#x60;&#x60;

For reference, all existing packages are listed in [this file](https:&#x2F;&#x2F;github.com&#x2F;NixOS&#x2F;nixpkgs&#x2F;blob&#x2F;nixos-21.05&#x2F;pkgs&#x2F;tools&#x2F;typesetting&#x2F;tex&#x2F;texlive&#x2F;pkgs.nix), however this list is hardly helpful without meta information about the packages. In a usual TeX Live installation, you could use &#x60;tlmgr search --file &lt;missing&gt;&#x60; to find out which package contains a file, but nixpkgs does not provide this utility. For all I know, that information is not easily queryable on the internet either.

Of course, we only need to run around and collect all these packages because we started with the _minimal_ scheme. Switching to the _basic_ scheme will provide almost all packages we need:

&#x60;&#x60;&#x60;nix
    # […]
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-basic latexmk pgf nicematrix;
      };
    in rec {
    # […]
&#x60;&#x60;&#x60;

This shows that we basically choose how much work we want to put into listing our TeX dependencies. If we start with a larger scheme, it is less work but we will download more packages than necessary. The laziest way would of course be to just include &#x60;scheme-full&#x60;. Nix’ philosophy is instead to only list the dependencies we _actually_ need. I would say that starting with &#x60;scheme-basic&#x60; is generally fine.

Don’t forget to check out the new document we can now create with &#x60;nix build&#x60;!

While TeX Live does provide us with a lot of fonts to choose from, we might eventually want to use a font no available there. Assume we want to use the [Fira Code](https:&#x2F;&#x2F;github.com&#x2F;tonsky&#x2F;FiraCode). This font is packaged in &#x60;nixpkgs.fira-code&#x60;. Let’s have a quick look at what is contained in that package:

&#x60;&#x60;&#x60;bash
nix eval nixpkgs#fira-code.outPath --raw | xargs du -a
&#x60;&#x60;&#x60;

(Output may be nicer with &#x60;tree&#x60; or &#x60;exa -T&#x60; if you have it). This gives us (store path stripped):

&#x60;&#x60;&#x60;jboss-cli
560	[...]&#x2F;share&#x2F;fonts&#x2F;truetype&#x2F;FiraCode-VF.ttf
560	[...]&#x2F;share&#x2F;fonts&#x2F;truetype
560	[...]&#x2F;share&#x2F;fonts
560	[...]&#x2F;share
560	[...]
&#x60;&#x60;&#x60;

Now we need to set the &#x60;OSFONTDIR&#x60; environment variable so that LuaTeX can find it (mind that having the font package as build input does not make the font visible to LuaTeX). We also need to add &#x60;fontspec&#x60; to our &#x60;tex&#x60; package. Let’s update &#x60;flake.nix&#x60;:

&#x60;&#x60;&#x60;routeros
    # […]
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-minimal latex-bin latexmk
        nicematrix fontspec;
      };
    in rec {
      packages &#x3D; {
        document &#x3D; pkgs.stdenvNoCC.mkDerivation rec {
          name &#x3D; &quot;latex-demo-document&quot;;
          src &#x3D; self;
          buildInputs &#x3D; [ pkgs.coreutils pkgs.fira-code tex ];
          phases &#x3D; [&quot;unpackPhase&quot; &quot;buildPhase&quot; &quot;installPhase&quot;];
          buildPhase &#x3D; &#39;&#39;
            export PATH&#x3D;&quot;${pkgs.lib.makeBinPath buildInputs}&quot;;
            mkdir -p .cache&#x2F;texmf-var
            env TEXMFHOME&#x3D;.cache TEXMFVAR&#x3D;.cache&#x2F;texmf-var \
                OSFONTDIR&#x3D;${pkgs.fira-code}&#x2F;share&#x2F;fonts \
              latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
              document.tex
          &#39;&#39;;
          installPhase &#x3D; &#39;&#39;
            mkdir -p $out
            cp document.pdf $out&#x2F;
          &#39;&#39;;
        };
      };
      # […]
&#x60;&#x60;&#x60;

We can now reference the font in our document. However, we might not be completely sure about the name we need to use to refer to the font – is it &#x60;FiraCode&#x60;, &#x60;Fira-Code&#x60; or &#x60;Fira Code&#x60;? Font files tend to be a bit inconsistent about this. So let us check it:

&#x60;&#x60;&#x60;dockerfile
nix eval nixpkgs#fira-code.outPath --raw | \
  xargs -J % nix shell nixpkgs#fontconfig -c \
  fc-scan %&#x2F;share&#x2F;fonts&#x2F;truetype&#x2F;FiraCode-VF.ttf | \
  grep family
&#x60;&#x60;&#x60;

This will give us some lines like

&#x60;&#x60;&#x60;gcode
family: &quot;Fira Code&quot;(s) &quot;Fira Code Light&quot;(s)
&#x60;&#x60;&#x60;

the latter, &#x60;Fira Code Light&#x60;, is the correct one (I am not quite sure why, but the former won’t work). Thus, we update our &#x60;document.tex&#x60;:

&#x60;&#x60;&#x60;tex
\documentclass[a4paper]{article}

\usepackage{fontspec}
\setmonofont{Fira Code Light}

\usepackage{nicematrix}

\begin{document}
  \begin{NiceTabular}{p{5.5cm}|&gt;{\ttfamily}p{2cm}}
  \CodeBefore
    \rowcolors{2}{white}{gray!30}
  \Body \hline
    droggel &amp; 23 \\ \hline
    jug     &amp; 42 \\ \hline
  \end{NiceTabular}
\end{document}
&#x60;&#x60;&#x60;

Save and run &#x60;nix build&#x60;. The second column in the document will now use the _Fira Code_ font. Success!

### Local Font Files

You may want to use fonts that are neither available as TeX Live package, nor in nixpkgs. Maybe you want to use a fancy commercial font. While it is no problem to append the working directory or a &#x60;fonts&#x60; subdirectory to &#x60;OSFONTDIR&#x60;, you can also define a separate derivation for that font:

&#x60;&#x60;&#x60;nix
    # […]
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      my-font &#x3D; pkgs.stdenvNoCC.mkDerivation {
        pname &#x3D; &quot;my-font&quot;;
        version &#x3D; &quot;1.0.0&quot;;
        src &#x3D; self;
        phases &#x3D; [ &quot;unpackPhase&quot; &quot;installPhase&quot; ];
        installPhase &#x3D; &#39;&#39;
          mkdir -p $out&#x2F;share&#x2F;fonts&#x2F;truetype
          cp my-font.ttf $out&#x2F;share&#x2F;fonts&#x2F;truetype
        &#39;&#39;;
      };
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-minimal latex-bin latexmk
        nicematrix fontspec;
      };
    in rec {
      # […]
&#x60;&#x60;&#x60;

Then, you can use the font just like a font from nixpkgs. Actually, you want to have that font package in a separate flake, because if you set &#x60;src &#x3D; self;&#x60; here, this derivation will unnecessarily be rebuilt every time anything in your repository changes. You can refer to local flakes as inputs to your document flake if you don’t want to publish the font flake.

Finally, if a font is available somewhere on the internet, you can either use &#x60;pkgs.fetchurl&#x60; to retrieve it when building, or declare it as input to your Nix Flake.

Having a single document as output is fine for a lot of use-cases. But what if our document has data inputs, for example because we want to generate bulk letters? In this case, our output should not be the document itself, but a script that takes the relevant data as input and generates the document. Let’s try and modify our setup to do that.

The first step towards our goal is to have our package output a script that basically does what our build step currently does: Build the document. For this, we remove the _build_ step from our package and modify the _install_ step:

&#x60;&#x60;&#x60;routeros
{
  description &#x3D; &quot;LaTeX Document Demo&quot;;
  inputs &#x3D; {
    nixpkgs.url &#x3D; github:NixOS&#x2F;nixpkgs&#x2F;nixos-21.05;
    flake-utils.url &#x3D; github:numtide&#x2F;flake-utils;
  };
  
  outputs &#x3D; { self, nixpkgs, flake-utils }:
    with flake-utils.lib; eachSystem allSystems (system:
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-basic latexmk
        pgf nicematrix fontspec;
      };
    in rec {
      packages &#x3D; {
        document &#x3D; pkgs.stdenvNoCC.mkDerivation rec {
          name &#x3D; &quot;latex-demo-document&quot;;
          src &#x3D; self;
          propagatedBuildInputs &#x3D; [ pkgs.coreutils pkgs.fira-code tex ];
          phases &#x3D; [&quot;unpackPhase&quot; &quot;buildPhase&quot; &quot;installPhase&quot;];
          SCRIPT &#x3D; &#39;&#39;
            #!&#x2F;bin&#x2F;bash
            prefix&#x3D;${builtins.placeholder &quot;out&quot;}
            export PATH&#x3D;&quot;${pkgs.lib.makeBinPath propagatedBuildInputs}&quot;;
            DIR&#x3D;$(mktemp -d)
            RES&#x3D;$(pwd)&#x2F;document.pdf
            cd $prefix&#x2F;share
            mkdir -p &quot;$DIR&#x2F;.texcache&#x2F;texmf-var&quot;
            env TEXMFHOME&#x3D;&quot;$DIR&#x2F;.cache&quot; \
                TEXMFVAR&#x3D;&quot;$DIR&#x2F;.cache&#x2F;texmf-var&quot; \
                OSFONTDIR&#x3D;${pkgs.fira-code}&#x2F;share&#x2F;fonts \
              latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
              -output-directory&#x3D;&quot;$DIR&quot; \
              -pretex&#x3D;&quot;\pdfvariable suppressoptionalinfo 512\relax&quot; \
              -usepretex document.tex
            mv &quot;$DIR&#x2F;document.pdf&quot; $RES
            rm -rf &quot;$DIR&quot;
          &#39;&#39;;
          buildPhase &#x3D; &#39;&#39;
            printenv SCRIPT &gt;latex-demo-document
          &#39;&#39;;
          installPhase &#x3D; &#39;&#39;
            mkdir -p $out&#x2F;{bin,share}
            cp document.tex $out&#x2F;share&#x2F;document.tex
            cp latex-demo-document $out&#x2F;bin&#x2F;latex-demo-document
            chmod u+x $out&#x2F;bin&#x2F;latex-demo-document
          &#39;&#39;;
        };
      };
      defaultPackage &#x3D; packages.document;
    });
}
&#x60;&#x60;&#x60;

Mind how our &#x60;buildInputs&#x60; have moved to &#x60;propagatedBuildInputs&#x60;. This is because these are now runtime dependencies and thus need to be part of the closure of the generated derivation. That is achieved by putting them in the &#x60;propagatedBuildInputs&#x60;.

I put the script we output into a variable &#x60;SCRIPT&#x60;, which will be available as environment variable during our build. Originally, I used &#x60;cat&#x60; with a HEREDOC to write the script, however that was horrible since all &#x60;$&#x60; that should be in the final script would have needed to be escaped. Using &#x60;printenv&#x60; is far cleaner. Note how we use &#x60;builtins.placeholder&#x60; to access the output directory since &#x60;$out&#x60; is a build-time variable and therefore not available in our script, which runs at runtime.&#x60;builtins.placeholder&#x60; outputs the correct path at build time.

I removed &#x60;SOURCE_DATE_EPOCH&#x60; since when our derivation is a generator, we might want to use the actual generation date. Since the PDF itself is not part of the derivation anymore, it is okay to generate different documents depending on the date; and the user can _still_ set the variable when calling the generator to inject a custom date.

Our output directory now contains the generated script in &#x60;bin&#x60;, and &#x60;document.tex&#x60; in &#x60;share&#x60; as we need those files at runtime to build the document. If you use any other local files (fonts, images, etc) in your document, you need to copy those as well.

Before, our build environment provided a temporary directory to build the document. Now with our script, we don’t have that anymore – the user may call the script from anywhere and that is our working directory then. Therefore, we need to create a temporary directory manually via &#x60;mktemp -d&#x60; so that the current working directory is not cluttered with intermediate LaTeX files – the user only wants the resulting &#x60;.pdf&#x60; file. This also ensures that any files existing in the working directory do not affect our build.

Fun fact: By explicitly depending on &#x60;pkgs.coreutils&#x60;, we circumvent a problem with &#x60;mktemp&#x60; that haunts macOS and BSD users: The BSD &#x60;mktemp&#x60; requires a template as parameter, while the one in GNU coreutils does not. This makes it [difficult to write a script that works with both versions](https:&#x2F;&#x2F;unix.stackexchange.com&#x2F;questions&#x2F;30091&#x2F;fix-or-alternative-for-mktemp-in-os-x), a problem which we nicely circumvent by explicitly using the GNU coreutils everywhere.

Let’s try it out:

&#x60;&#x60;&#x60;sql
git commit -a --amend --no-edit
nix build
result&#x2F;bin&#x2F;latex-demo-document
&#x60;&#x60;&#x60;

This should create the &#x60;document.pdf&#x60; in your working directory. We can replace the last two commands with

&#x60;&#x60;&#x60;dockerfile
nix run
&#x60;&#x60;&#x60;

Now that we can do this, let’s make the document fillable with user-provided values.&#x60;latexmk&#x60; provides a nice feature that executes TeX code before the main document. We will set this up in our flake in a moment, for now let’s assume the commands &#x60;\sender&#x60; and &#x60;\receiver&#x60; are available and update our &#x60;document.tex&#x60;:

&#x60;&#x60;&#x60;tex
\documentclass[a4paper]{article}

\usepackage{fontspec}
\setmonofont{Fira Code Light}

\usepackage{nicematrix}

\begin{document}
  \begin{NiceTabular}{p{5.5cm}|&gt;{\ttfamily}p{2cm}}
  \CodeBefore
    \rowcolors{2}{white}{gray!30}
  \Body \hline
    Sender:    &amp; \sender   \\ \hline
    Recipient: &amp; \receiver \\ \hline
  \end{NiceTabular}
\end{document}
&#x60;&#x60;&#x60;

In our &#x60;flake.nix&#x60;, we now update the &#x60;latexmk&#x60; call to define those two commands:

&#x60;&#x60;&#x60;bash
{
  description &#x3D; &quot;LaTeX Document Demo&quot;;
  inputs &#x3D; {
    nixpkgs.url &#x3D; github:NixOS&#x2F;nixpkgs&#x2F;nixos-21.05;
    flake-utils.url &#x3D; github:numtide&#x2F;flake-utils;
  };
  
  outputs &#x3D; { self, nixpkgs, flake-utils }:
    with flake-utils.lib; eachSystem allSystems (system:
    let
      pkgs &#x3D; nixpkgs.legacyPackages.${system};
      tex &#x3D; pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-basic latexmk
        pgf nicematrix fontspec;
      };
      # make variables more visible to defining them here
      vars &#x3D; [ &quot;sender&quot; &quot;receiver&quot; ];
      # expands to definitions like \def\sender{$1}, i.e. each variable
      # will be set to the command line argument at the variable&#39;s position.
      texvars &#x3D; toString
        (pkgs.lib.imap1 (i: n: &#39;&#39;\def\${n}{${&quot;$&quot; + (toString i)}}&#39;&#39;) vars);
    in rec {
      packages &#x3D; {
        document &#x3D; pkgs.stdenvNoCC.mkDerivation rec {
          name &#x3D; &quot;latex-demo-document&quot;;
          src &#x3D; self;
          propagatedBuildInputs &#x3D; [ pkgs.coreutils pkgs.fira-code tex ];
          phases &#x3D; [&quot;unpackPhase&quot; &quot;buildPhase&quot; &quot;installPhase&quot;];
          SCRIPT &#x3D; &#39;&#39;
            #!&#x2F;bin&#x2F;bash
            prefix&#x3D;${builtins.placeholder &quot;out&quot;}
            export PATH&#x3D;&quot;${pkgs.lib.makeBinPath propagatedBuildInputs}&quot;;
            DIR&#x3D;$(mktemp -d)
            RES&#x3D;$(pwd)&#x2F;document.pdf
            cd $prefix&#x2F;share
            mkdir -p &quot;$DIR&#x2F;.texcache&#x2F;texmf-var&quot;
            env TEXMFHOME&#x3D;&quot;$DIR&#x2F;.cache&quot; \
                TEXMFVAR&#x3D;&quot;$DIR&#x2F;.cache&#x2F;texmf-var&quot; \
                OSFONTDIR&#x3D;${pkgs.fira-code}&#x2F;share&#x2F;fonts \
              latexmk -interaction&#x3D;nonstopmode -pdf -lualatex \
              -output-directory&#x3D;&quot;$DIR&quot; \
              -pretex&#x3D;&quot;\pdfvariable suppressoptionalinfo 512\relax${texvars}&quot; \
              -usepretex document.tex
            mv &quot;$DIR&#x2F;document.pdf&quot; $RES
            rm -rf &quot;$DIR&quot;
          &#39;&#39;;
          buildPhase &#x3D; &#39;&#39;
            printenv SCRIPT &gt;latex-demo-document
          &#39;&#39;;
          installPhase &#x3D; &#39;&#39;
            mkdir -p $out&#x2F;{bin,share}
            cp document.tex $out&#x2F;share&#x2F;document.tex
            cp latex-demo-document $out&#x2F;bin&#x2F;latex-demo-document
            chmod u+x $out&#x2F;bin&#x2F;latex-demo-document
          &#39;&#39;;
        };
      };
      defaultPackage &#x3D; packages.document;
    });
}
&#x60;&#x60;&#x60;

Now we can do:

&#x60;&#x60;&#x60;routeros
git commit -a --amend --no-edit
nix run . Alice Bob
&#x60;&#x60;&#x60;

&#x60;nix run&#x60; expects as first argument the Flake to run, so if we provide parameters, we must put &#x60;.&#x60; first to reference the flake in our working directory. This should give us a &#x60;document.pdf&#x60; containing the two given names.

By the way, if we ever push this repository to GitHub, e.g. at &#x60;example&#x2F;nix-flakes-latex&#x60;, we can then run it anywhere via

&#x60;&#x60;&#x60;dockerfile
nix run github:example&#x2F;nix-flakes-latex Alice Bob
&#x60;&#x60;&#x60;

## Conclusion

Nix Flakes allow us not just to precisely specify _TeX Live_ packages we need to build our document, but also to include external resources as additional dependencies. By pinning the versions of our inputs in &#x60;flake.lock&#x60;, it guarantees us that the document can be reproducibly built anywhere.

Now you might wonder, what do we really _need_ all this for? Are LaTeX documents not like „write once, typeset, never touch the source again“? Well, I’ll have you know that I regularly build my pen &amp; paper character sheets with LaTeX, they _are_ fillable with values and _do_ depend on external artwork. The sources for that [are available on GitHub](https:&#x2F;&#x2F;github.com&#x2F;flyx&#x2F;DSA-4.1-Heldendokument) if you want to have a look, but be warned that everything is German.

Apart from that, I stumbled upon LaTeX code that just didn’t want to compile with modern TeX Live more than once. Using Nix Flakes also makes me feel safe enough to _not_ commit the PDF file to the repository (just in case the source doesn’t compile at some point in the future).

## Changelog

* Simplified commands to not use subshells.
* Rewrote the section about fonts. Originally it described how to download a font from the internet and use it, but the more likely use-case would be to fetch fonts from nixpkgs. Therefore, the article now shows how to do that, and just mentions that you can also fetch one from some URL.
* Also, use &#x60;OSFONTDIR&#x60; to tell LuaTeX where to find the font instead, which is more versatile than explicitly referencing a local path in the TeX source.
* Instead of using &#x60;cat&#x60; and a HEREDOC to output a script, the code now uses an env variable which removes the need for crazy &#x60;$&#x60; escaping everywhere.
* Added section describing how to produce identical documents.