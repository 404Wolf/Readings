---
id: 1c488ce6-c8ae-4409-96b5-9e850be848eb
title: LaTeX notes with ACM style | Rob's typesafety net
tags:
  - RSS
date_published: 2024-05-29 00:00:00
---

# LaTeX notes with ACM style | Rob's typesafety net
#Omnivore

[Read on Omnivore](https://omnivore.app/me/la-te-x-notes-with-acm-style-rob-s-typesafety-net-18fc52af506)
[Read Original](https://typesafety.net/rob/blog/acmart-for-notes)



##  29 May 2024 

---

Having recently (albeit unsuccessfully) submitted a paper to an [ACM](https:&#x2F;&#x2F;www.acm.org&#x2F;) conference, I came to really like the [ACM Primary Article Template](https:&#x2F;&#x2F;www.acm.org&#x2F;publications&#x2F;proceedings-template). It feels modern, it’s the right kind of opinionated-with-good-defaults for my brain, and it’s [reasonably well documented](https:&#x2F;&#x2F;mirror.las.iastate.edu&#x2F;tex-archive&#x2F;macros&#x2F;latex&#x2F;contrib&#x2F;acmart&#x2F;acmart.pdf). Developing this kind of stuff is the kind of thing professional societies ought to be doing. Thanks, the ACM!

However, it’s _not_ particularly compatible with the bog-standard article style that is the standard way to start stuff from scratch in LaTeX. And if you want to start a clean document to think in or to share a quick note, the ACM template is adding a lot of visual and cognitive nonsense. (No, ACM, I don’t want to look at an ISBN and DOI right now, and this has neither a conference nor journal name, it’s going in an email.)

So here, for my personal reference as much as anything else, is a LaTeX document that works in Overleaf in 2024 that manipulates the &#x60;acmart&#x60; template in what feels, to me, like a reasonable and minimal way.

&#x60;&#x60;&#x60;tex
\documentclass[acmsmall,screen]{acmart}
%% Extra classes and definitions here

\setcopyright{none}
\acmDOI{}
\acmISBN{}
\acmYear{Not for distribution}
\acmConference{Draft}{Author Name}{\today}
\settopmatter{printacmref&#x3D;false}
\citestyle{acmauthoryear} % Remove for [n]-style cites

\begin{document}
\title{The Title Is Required}
\maketitle

%% Your stuff here

% Uncomment for bibliography
% \bibliographystyle{ACM-Reference-Format}
% \bibliography{main}
\end{document}

&#x60;&#x60;&#x60;

By misusing &#x60;acmConference&#x60; options and not declaring authors, every page ends up with a header saying “Draft, Author Name, Today’s Date.” By misusing the &#x60;\acmYear&#x60; option, a seemingly-mandatory line at the bottom of the front page says something reasonable about the draft status. (Deleting this leaves an awkward period.) Everything else seems like a reasonable and documented use of the ACM package, so it should work for drafting stuff that you eventually want to include in an &#x60;acmart&#x60; document, or pulling stuff out of an &#x60;acmart&#x60; document for review or editing.

[Discuss this post on Mastodon (or whatever)](https:&#x2F;&#x2F;social.wub.site&#x2F;@simrob&#x2F;112525077597597918)