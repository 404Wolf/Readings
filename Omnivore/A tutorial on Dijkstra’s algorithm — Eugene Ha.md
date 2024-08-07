---
id: 2ec561b4-0d57-11ef-bc6b-2bdfd5068c0e
title: A tutorial on Dijkstra’s algorithm — Eugene Ha
tags:
  - RSS
date_published: 2024-05-08 10:05:00
---

# A tutorial on Dijkstra’s algorithm — Eugene Ha
#Omnivore

[Read on Omnivore](https://omnivore.app/me/a-tutorial-on-dijkstra-s-algorithm-eugene-ha-18f59039086)
[Read Original](https://eugeneha.ca/articles/tutorial-on-dijkstras-algorithm/)



This hands-on tutorial presents [Dijkstra’s shortest-path algorithm](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Dijkstra%27s%5Falgorithm) as a natural adaptation of [breadth-first search](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Breadth-first%5Fsearch). Since breadth-first search is the basis of an intuitive “search and rescue” method, this approach to Dijkstra’s algorithm gives a sense of where the algorithm comes from and why it works.

Code examples and exercises are in [Python](https:&#x2F;&#x2F;www.python.org&#x2F;).

## Table of Contents

* [1\. Planning a road trip](#planning-a-road-trip)
* [2\. Warm-up: breadth-first search](#warm-up-breadth-first-search)  
   * [2.1\. Search and rescue](#search-and-rescue)  
   * [2.2\. Breadth-first search](#breadth-first-search)
* [3\. Dijkstra’s algorithm](#dijkstras-algorithm)  
   * [3.1\. Adaptation of breadth-first search](#adaptation-of-breadth-first-search)  
   * [3.2\. Why Dijkstra’s algorithm works](#why-dijkstras-algorithm-works)  
   * [3.3\. Dijkstra’s algorithm from a dynamic-programming perspective](#dijkstras-algorithm-from-a-dynamic-programming-perspective)  
   * [3.4\. Running time of Dijkstra’s algorithm](#running-time-of-dijkstras-algorithm)  
   * [3.5\. Finding the shortest paths from \\(a\\) to \\(b\\)](#finding-the-shortest-paths-from-a-to-b)
* [Addendum: Economical iteration with generator functions](#addendum-economical-iteration-with-generator-functions)
* [References](#references)