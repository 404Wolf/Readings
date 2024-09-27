---
id: 76c84a05-26e0-4d28-b16e-c1160298c425
title: 4) Merge Two Sorted Linked Lists
tags:
  - RSS
date_published: 2024-08-24 06:04:50
---

# 4) Merge Two Sorted Linked Lists
#Omnivore

[Read on Omnivore](https://omnivore.app/me/4-merge-two-sorted-linked-lists-191845631fb)
[Read Original](https://elijer.github.io/garden/devnotes/LeetCode-Journal/4)-Merge-Two-Sorted-Linked-Lists)



I took up Russell’s generous offer to provide me with a mock interview for [this leetcode problem](https:&#x2F;&#x2F;leetcode.com&#x2F;problems&#x2F;merge-two-sorted-lists&#x2F;). Because Russ had instructed me to just find a problem I hadn’t done before and to not look at it, I didn’t realize that this problem worked with linked lists. I had read about linked lists, but never used one, so I ended up having to figure that out during the interview.

This was what the failing code looked like at that point:

&#x60; 
var mergeTwoLists &#x3D; function(list1, list2) {
    
    if (list1 &#x3D;&#x3D;&#x3D; null) return list2
 
    if (list2 &#x3D;&#x3D;&#x3D; null) return list1
 
    let head
    let current
 
	function iterateNodes(list1Pointer, list2Pointer){
 
	    if (list1Pointer &#x3D;&#x3D;&#x3D; null){
	        return list2
	    }
	
	    if (list2Pointer &#x3D;&#x3D;&#x3D; null){
	        return list1
	    }
	
	    let current
	
	    if (list1Pointer.val &gt;&#x3D; list2Pointer.val){
	        current &#x3D; list2Pointer
	        list2Pointer &#x3D; list2Pointer.next
	    } else if (list1Pointer.val &lt; list2Pointer.val){
	        current &#x3D; list1Pointer
	        list1Pointer &#x3D; list1Pointer.next
	    } else {
	        console.log(&quot;unexpected case&quot;)
	    }
	
	    console.log(current.val)
	    current.next &#x3D; iterateNodes(list1Pointer, list2Pointer)
	    return current
	}
 
    return iterateNodes(list1, list2)
};&#x60;

^ This was after 45 minutes, the allotted time for the interview. Russ invited me to keep going and see this process to it’s end.

Russ was the one to realize my mistake. If you look, you can see that in the base cases\* (a term I learned today) of the iterateNodes function, I am accidentally returning &#x60;list1&#x60; and &#x60;list2&#x60;, not &#x60;list1Pointer&#x60; and &#x60;list2Pointer&#x60;.

I could have avoided this mistake by declaring my recursive function outside of the main function, or even by simply doing everything in one function. I do stand by my call of writing a second function however, as it was easier for me to reason about recursion that way.

&gt; In [7) Depth First Search](https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;devnotes&#x2F;LeetCode-Journal&#x2F;7%29-Depth-First-Search), Benjamin Arnev extolls additional virtues of defining a second function inside of your first in the first. In this article, however, it’s definitely the villain.

After I fixed this mistake, this is what I ended up with:

&#x60;&#x2F;&#x2F; Requirements and constraints
    &#x2F;&#x2F; must remain sorted
    &#x2F;&#x2F; if both lists are empty, return []
    &#x2F;&#x2F; if one list is empty and the other has an element in it, return a list with element 0
    &#x2F;&#x2F; all values comparable, values are unbounded
    &#x2F;&#x2F; lengths of lists: fit in memory
    &#x2F;&#x2F; I will be given the heads of each list - the first nodes of each list
    &#x2F;&#x2F; may be given an empty list
 
&#x2F;&#x2F; To do
    &#x2F;&#x2F; how to test for an empty list
 
&#x2F;&#x2F; ListNode
&#x2F;&#x2F; Each node has a val field -&gt; integer
    &#x2F;&#x2F; They are comparable, val field can have less than greater than
    
 
&#x2F;&#x2F; Example data
    &#x2F;&#x2F; example1:
        &#x2F;&#x2F; list1[1, 2, 4]
        &#x2F;&#x2F; list2[1, 3, 4]
        &#x2F;&#x2F; output: [1, 1, 2, 3, 4, 4]
        &#x2F;&#x2F; Doesn&#39;t matter if two nodes have the same value - they are interchangeable in sorting
        &#x2F;&#x2F; If the value is lower than the other, I have to pick it first
 
&#x2F;&#x2F; Notes
&#x2F;&#x2F; Probably don&#39;t use a map to index the values - they may not be ints
 
&#x2F;**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val &#x3D; (val&#x3D;&#x3D;&#x3D;undefined ? 0 : val)
 *     this.next &#x3D; (next&#x3D;&#x3D;&#x3D;undefined ? null : next)
 * }
 *&#x2F;
&#x2F;**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 *&#x2F;
 
&#x2F;* (list1 head)
    node.val &#x3D; 1
    node.next &#x3D; {node.val &#x3D;&#x3D;&#x3D; 2}
&#x2F;*
 
&#x2F;* (list2 head)
    node.val &#x3D; 1
    node.next &#x3D; {node.val &#x3D;&#x3D; 3}
*&#x2F;
 
function iterateNodes(list1Pointer, list2Pointer){
 
    if (list1Pointer &#x3D;&#x3D;&#x3D; null){
        return list2Pointer
    }
 
    if (list2Pointer &#x3D;&#x3D;&#x3D; null){
        return list1Pointer
    }
 
    let current
 
    if (list1Pointer.val &gt;&#x3D; list2Pointer.val){
        current &#x3D; list2Pointer
        list2Pointer &#x3D; list2Pointer.next
    } else if (list1Pointer.val &lt; list2Pointer.val){
        current &#x3D; list1Pointer
        list1Pointer &#x3D; list1Pointer.next
    } else {
        console.log(&quot;unexpected case&quot;)
    }
 
    console.log(current.val)
    current.next &#x3D; iterateNodes(list1Pointer, list2Pointer)
    return current
}
 
var mergeTwoLists &#x3D; function(list1, list2) {
    
    if (list1 &#x3D;&#x3D;&#x3D; null) return list2
 
    if (list2 &#x3D;&#x3D;&#x3D; null) return list1
 
    let head
    let current
 
    return iterateNodes(list1, list2)
};&#x60;

It took us another 10 minutes to take this function to fruition. Afterwards, I went back over it and cleaned it up to demonstrate to myself that a second function wasn’t necessary:

&#x60;function mergeTwoLists(list1, list2){
 
    if (list1 &#x3D;&#x3D;&#x3D; null) return list2
 
    if (list2 &#x3D;&#x3D;&#x3D; null) return list1
 
    let current
 
    if (list1.val &gt;&#x3D; list2.val){
        current &#x3D; list2 &#x2F;&#x2F; we set current to the head of list2
        list2 &#x3D; list2.next
        &#x2F;&#x2F; now that current is set, we can safely change the list2 head to NEXT node in list2, keeping things moving
    } else if (list1.val &lt; list2.val){
        current &#x3D; list1
        list1 &#x3D; list1.next
    } else {
        console.log(&quot;unexpected case&quot;)
    }
 
    current.next &#x3D; mergeTwoLists(list1, list2)
    return current
}&#x60;

## Positives

* I am proud of how well I was able to figure out how to use linked lists under pressure
* I am satisfied with my process of levelly walking back through my code with actual values when I did run into a bug

## Programming Takeaways

* Don’t declare functions inside other functions. Not only does it allow for variable collisions like the one above - it’s also less performant ~~and readable~~  
   * Alternate take in [7) Depth First Search](https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;devnotes&#x2F;LeetCode-Journal&#x2F;7%29-Depth-First-Search)
* In JavaScript especially, scan for variable name conflicts as a first step when addressing bugs
* Avoid the blanket anxiety that there is something fundamentally wrong with an implementation - even if there is, there is a specific bug that causes it. Look for those, and permit those bugs to be trivial

&gt; The last point continues to track! I just had an interview with Figma and although my general implementation was spot on, there was a single detail in my way from solving my interview problem. As my hail mary in the last three minutes, I decided to modify my implementation, further showing that under pressure I tend to doubt, myself. But once again - the implementation was generally good. I could have benefited more from calmly reviewing my code than by supposing a major anti-pattern.

## Code Interview Takeaways

* If an interview is asking questions during the whiteboard or implementation phase, they are probably trying to tell you something
* Ask for examples to run in your code - they may tell you something about the cases you need to worry about most
* Listen carefully to the interviewer - it is psychologically difficult _not_ to help people when you know the answer, and they may slip up and give you major hints. At the very least, it is easy to slip into a more collaborative mode, and you can certainly use a collaborator
* Don’t panic
* _Do_ ask very basic questions about the problem
* Talk through your process, and if you get lost, start from first principles, not some grand idea of what you “should” do
* Write Psuedocode - it can be turned into real code
* Write real code whenever possible, and if you aren’t sure it’s ready, just comment it - this will save time later

&gt; On the the subject of listener carefully to an interviewer, I had the advantage here of being in the same room as them. However, online, using a multiscreen setup, you may be looking at another screen much of the time instead of the interview. At this time, I believe this is a mistake - there is a lot of information conveyed by their faces, gestures, and mannerisms. I believe that keeing a videocall window next to the IDE as much as possible is valuable.

\* **Base Case**the part of a recursive function that is not recursive. In this example, conditionals that set out “current” linked list

## Things to think about in the future

* handles, symlinks, references, pointers - how are these things different? Relevant to the way &#x60;javascript&#x60; works here in lines &#x60;5&#x60; and &#x60;6&#x60; of the function we defined. We set current to &#x60;list2&#x60;, and then we _change_ list 2\. I had a nightmare moment where I though, _wait_ we’re changing what &#x60;list2&#x60; means and &#x60;current&#x60; references &#x60;list2&#x60;, aren’t we also changing current?? But no, in javascript, setting &#x60;current&#x60; to &#x60;list2&#x60; doesn’t point &#x60;current&#x60; to the reference &#x60;list2&#x60; itself, but the base object that &#x60;list2&#x60; refers to in memory, so we’re safe.

However, I’d still like to understand this better. Are there situations in javascript where we _are_ chaining our references, and if the address one reference points to changes, then the ones downstream do too?

## Review of Value Reference Behavior in Javascript

Okay I’ve gotten around to refreshing how values are referenced in JS, depending on variable type!

In JavaScript, simple values like strings and numbers aren’t _references_. That is to say, if &#x60;var1&#x60; and &#x60;var2&#x60; are both strings and &#x60;var2&#x60; is set to the value of &#x60;var1&#x60;, you can do whatever you want to &#x60;var1&#x60; and &#x60;var2&#x60; will stay the same.

But other data structures in JavaScript, like arrays and Lists, _are_ references rather than the value of those references themselves. So if &#x60;var2&#x60; is set to the value of &#x60;var1&#x60; and these things are arrays or objects, a change to &#x60;var1&#x60; _will_ affect what &#x60;var2&#x60; evaluates to.

Here’s that behavior in simple variables:![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s-mQMy8jZbxknGQuHI80rY1jZa1lH8FnpYbG5cTGRZR0&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;12fde03d48f0c03a8fc666f3c132d05d.png)

But when we are working with _arrays_ and _objects_, that behavior is different.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sDZ4St7TVnlxx0aobpvP3YAL4pxH9QbJVU059h2hU3dQ&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;4ae8cd499f716467039daa41c018d439.png)

If we _don’t_ want this behavior, we can use the spread operator:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sdBVustfFaMLW1PMfOF8GsQjheyjoy8lJjgrPQTA8YqI&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;0671219c1393024f1610ee12e118ea42.png)

If I understand this correct, what we are doing here is getting the value of zuko at that time, similar to what we did with the &#x60;string&#x60; and &#x60;number&#x60; data types, and we are creating a whole new &#x60;array&#x60; or &#x60;object&#x60; with the value we receive. Our data structure is still a reference to a value that can change, but it’s now a new data structure with no relation to the original.

Like prince Zuko himself, you have to understand how you are referencing memory (addresses) of the past in order to evaluate the present.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sBEva8H2A1W2G1nXIaJSyvrwqNzwR4fqpd9jqWmWexUU&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;3090d0e215c73f5fa43a9483ac5d3e23.png)