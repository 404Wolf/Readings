---
id: 2c3a4c84-c4fa-4a4a-bdb6-cbbf70ac7139
title: Merge Two Sorted Linked Lists
tags:
  - RSS
date_published: 2024-08-06 01:04:33
---

# Merge Two Sorted Linked Lists
#Omnivore

[Read on Omnivore](https://omnivore.app/me/merge-two-sorted-linked-lists-19126c1240e)
[Read Original](https://elijer.github.io/garden/Dev-Notes/LeetCode-Journal/Merge-Two-Sorted-Linked-Lists)



I took up [Russ Webb](https:&#x2F;&#x2F;github.com&#x2F;Russ741)’s generous offer to provide me with a mock interview for [this leetcode problem](https:&#x2F;&#x2F;leetcode.com&#x2F;problems&#x2F;merge-two-sorted-lists&#x2F;). Because Russ had instructed me to just find a problem I hadn’t done before and to not look at it, I didn’t realize that this problem worked with linked lists. I had read about linked lists, but never used one, so I ended up having to figure that out during the interview.

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

Russ was the one to realize my mistake. If you look, you can see that in the base cases^ (a term I learned today) of the iterateNodes function, I am accidentally returning &#x60;list1&#x60; and &#x60;list2&#x60;, not &#x60;list1Pointer&#x60; and &#x60;list2Pointer&#x60;.

I could have avoided this mistake by declaring my recursive function outside of the main function, or even by simply doing everything in one function. I do stand by my call of writing a second function however, as it was easier for me to reason about recursion that way.

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

* Don’t declare functions inside other functions. Not only does it allow for variable collisions like the one above - it’s also less performant and readable
* In javascript especially, scan for variable name conflicts as a first step when addressing bugs
* Avoid the blanket anxiety that there is something fundamentally wrong with an implementation - even if there is, there is a specific bug that causes it. Look for those, and permit those bugs to be trivial

## Code Interview Takeaways

* If an interview is asking questions during the whiteboard or implementation phase, they are probably trying to tell you something
* Ask for examples to run in your code - they may tell you something about the cases you need to worry about most
* Listen carefully to the interviewer - it is psychologically difficult _not_ to help people when you know the answer, and they may slip up and give you major hints. At the very least, it is easy to slip into a more collaborative mode, and you can certainly use a collaborator
* Don’t panic
* _Do_ ask very basic questions about the problem
* Talk through your process, and if you get lost, start from first principles, not some grand idea of what you “should” do
* Write Psuedocode - it can be turned into real code
* Write real code whenever possible, and if you aren’t sure it’s ready, just comment it - this will save time later

^**Base Case**the part of a recursive function that is not recursive. In this example, conditionals that set out “current” linked list

## Things to think about in the future

* handles, symlinks, references, pointers - how are these things different? Relevant to the way &#x60;javascript&#x60; works here in lines &#x60;5&#x60; and &#x60;6&#x60; of the function we defined. We set current to &#x60;list2&#x60;, and then we _change_ list 2\. I had a nightmare moment where I though, _wait_ we’re changing what &#x60;list2&#x60; means and &#x60;current&#x60; references &#x60;list2&#x60;, aren’t we also changing current?? But no, in javascript, setting &#x60;current&#x60; to &#x60;list2&#x60; doesn’t point &#x60;current&#x60; to the reference &#x60;list2&#x60; itself, but the base object that &#x60;list2&#x60; refers to in memory, so we’re safe.

However, I’d still like to understand this better. Are there situations in javascript where we _are_ chaining our references, and if the address one reference points to changes, then the ones downstream do too?

---