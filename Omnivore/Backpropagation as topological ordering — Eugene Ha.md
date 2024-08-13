---
id: 7063b78e-04d2-11ef-80d3-53cba2907aa4
title: Backpropagation as topological ordering — Eugene Ha
tags:
  - RSS
date_published: 2024-04-27 16:03:45
---

# Backpropagation as topological ordering — Eugene Ha
#Omnivore

[Read on Omnivore](https://omnivore.app/me/backpropagation-as-topological-ordering-eugene-ha-18f212fd7b4)
[Read Original](https://eugeneha.ca/articles/backpropagation-as-topological-ordering/)



\\( \\def\\∂#1&#x2F;∂#2{\\mathchoice {\\frac{\\partial #1}{\\partial #2}} {{\\partial #1}&#x2F;{\\partial #2}} {{\\partial #1}&#x2F;{\\partial #2}} {{\\partial #1}&#x2F;{\\partial #2}}} \\newcommand\\optensor\\otimes \\newcommand\\tensor{{\\mskip2mu}{\\optensor}{\\mskip2mu}} \\newcommand\\ophadamard\\odot \\newcommand\\hadamard{{\\mskip2mu}{\\ophadamard}{\\mskip2mu}} \\newcommand\\vec\[1\]{\\mathbf{#1}} % vectorization \\newcommand\\upsigma{\\unicode{963}} % upright &#39;σ&#39; \\newcommand\\act{\\vec\\upsigma} % activation function \\newcommand\\sact\\sigma % scalar activation \\newcommand\\Dact{\\vec{D\\upsigma}} \\newcommand\\obj\\varphi % objective function \\newcommand\\error\\varepsilon % error (derivative) \\newcommand{\\activate}{A\\rlap{\\strut\_\\lrcorner}} \\newcommand{\\backprop}{\\llap{\\strut\_\\llcorner}B} \\newcommand{\\bw}\[1\]{(b\_{#1},w\_{#1})} \\newcommand{\\awz}\[2\]{(a\_{#1},w\_{#2},z\_{#2})} \\newcommand{\\ade}\[2\]{(a\_{#1},\\delta\_{#2},\\error\_{#2})} \\newcommand{\\dF}\[1\]{\\left(\\∂F&#x2F;∂{b\_{#1}},\\∂F&#x2F;∂{w\_{#1}}\\right)} \\)

In _[Coroutines and backpropagation](https:&#x2F;&#x2F;eugeneha.ca&#x2F;articles&#x2F;coroutines-and-backpropagation&#x2F;)_, we wrote the backpropagation equations (for a feedforward neural network) as a coroutine, and got the backpropagation algorithm as a result. In this article, we revisit the backpropagation equations from the conventional perspective of _computational graphs_. We again show that the backpropagation algorithm comes for free—in the guise of a canonical _topological graph ordering_. The resulting implementation is a nice exercise in functional programming.

## Notes

[1](#fnr.1)

It is evident from the compositional form of [\\(F\\)](#org4d4df13) that the partial derivatives obey a recurrence relation. The particular form of the recurrence is trivially derived from the chain rule, because, apart from the activation function, every constituent function of [\\(F\\)](#org4d4df13) is linear.

[2](#fnr.2)

The notion of an action comes from algebra, where it is ubiquitous. (Important examples include group actions, modules, and linear representations.)

[3](#fnr.3)

By convention, indices of a finite sequence are interpreted _modulo_ sequence length. Thus index \\(-1\\) signifies the last element, index \\(-2\\) signifies the second-last element, and so on.

[4](#fnr.4)

This naming convention is mildly confusing. “Left” refers to the association of terms.