---
id: 2d4af3ee-1a5e-4207-bd69-f62a291e3fbf
title: Binary Search
tags:
  - RSS
date_published: 2024-08-04 12:05:33
---

# Binary Search
#Omnivore

[Read on Omnivore](https://omnivore.app/me/binary-search-1911e2b92f6)
[Read Original](https://elijer.github.io/garden/Dev-Notes/LeetCode-Journal/Binary-Search)



![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sqwKkcLXa-bVwiFQtd_xnfn0q9CF8EQGxX_RCH2NyxCk&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;8fc4c10a34f715ac64db315a6aacf173.png)

Okay this is my first shot:

&#x60;class TreeNode{
  constructor(val, left, right){
    this.val &#x3D; (val &#x3D;&#x3D;&#x3D; undefined ? 0 : val)
    this.left &#x3D; (left &#x3D;&#x3D;&#x3D; undefined ? null : left)
    this.right &#x3D; (right &#x3D;&#x3D;&#x3D; undefined ? null : right)
  }
}
 
function createBinaryTree(source, index){
 
  if (index &gt;&#x3D; source.length || source[index] &#x3D;&#x3D;&#x3D; null) return null
  
    return new TreeNode(
        source[index],
        createBinaryTree(source, index * 2 + 1),
        createBinaryTree(source, index * 2 + 2),
    )
}
 
var search &#x3D; function(nums, target) {
  let index &#x3D; 0
  let tree &#x3D; createBinaryTree(nums, 0)
  let searchOrderedTree &#x3D; function(root, target){
    if (root.val &#x3D;&#x3D;&#x3D; target) return index
    if (root.left.val &gt; target){
      index &#x3D; index * 2 + 1
      return searchOrderedTree(root.left, target)
    }
    
    if (root.right.val &lt; target) {
      index &#x3D; index * 2 + 2
      return searchOrderedTree(root.right, target)
    }
 
    return -1
 
  }
 
  return searchOrderedTree(tree, target)
};
 
search([-1,0,3,5,9,12])&#x60;

I borrowed the binary tree builder from the binary tree inversion that I messed up (because I never needed to build it to begin with) but I think this time it’s useful?

Seems like a lot of code.

Using a binary tree for search is really fun, but I’m not yet sure if it makes any sense and, if anything, stemmed from conflating the terms “binary tree” and “binary search”.

Here is a more traditional, working approach to binary search, where I have commented the gotchas I stumbled over:

&#x60;&#x2F;**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 *&#x2F;
var search &#x3D; function(nums, target, start&#x3D;0) {
    &#x2F;&#x2F; Handle case where there are no, or only one item in array
    if (nums &#x3D;&#x3D;&#x3D; null || nums.length &#x3D;&#x3D;&#x3D; 0) return -1
 
    &#x2F;&#x2F; Handle case where there is only one item in the array
    if (nums.length &#x3D;&#x3D;&#x3D; 1) {
        return nums[0] &#x3D;&#x3D;&#x3D; target ? start : -1; &#x2F;&#x2F; Gotcha - return index start, not index 0!
    }
 
    &#x2F;&#x2F; Okay looks like there are at least two items in array
 
    let middle &#x3D; Math.floor(nums.length&#x2F;2)
    if (nums[middle] &#x3D;&#x3D;&#x3D; target) return middle + start
 
    &#x2F;&#x2F; Search the right half of the array
    if (target &gt; nums[middle]){ &#x2F;&#x2F; Gotcha - compare target with nums[middle], not just with middle
    &#x2F;&#x2F; I.e. don&#39;t get index and target value mixed up
        return search(nums.slice(middle+1), target, start + middle + 1) &#x2F;&#x2F; gotcha - did not RETURN
        &#x2F;&#x2F; Another gotcha - remember to add start to middle
        &#x2F;&#x2F; Nice touch - because we are not cutting off the end, we can pass just one index to slice
 
    &#x2F;&#x2F; Search the left half of the array
    } else {
        return search(nums.slice(0, middle), target, start)
        &#x2F;&#x2F; because the beginning of the array is being maintained here, we can pass JUST start, no middle needed
    }
 
};&#x60;

## Gotchas

**Not returning the recursive cases**This recursive function does not mutate existing variables. Instead, it returns the value from each recursion step. If we forget to &#x60;return&#x60; in the recursive cases, the recursion chain breaks, and the function fails to provide a result - unless a base case is hit directly.

Think of it this way: the function must always return something. It returns a value when it finds the target or exhausts all possibilities. This can happen at any recursion level. If we don’t return a base case, we return the recursive function itself to ensure the base case can eventually be returned.

**Typo: &#x60;slice&#x60;**I had a brain fart and typed &#x60;slice[]&#x60; instead of &#x60;slice()&#x60;.

**Not adding &#x60;+1&#x60; to an index when passing it in the right half search case**By the time we are flowing into the right-half-search-case, we have determined already that the target is

* Not in the left half
* Not at the middle index

Sure, the middle may not be the exact middle of the array if the array is an even number, but that’s irrelevant. What matters is that we checked that index, and the target _isn’t there_. So when we use &#x60;slice&#x60; to pass a subsection of the initial &#x60;nums&#x60; array, we have to remember that the first argument &#x60;slice&#x60; takes is _inclusive_. So rather than include the &#x60;middle&#x60; index we already checked, we should start our subarray at &#x60;middle + 1&#x60;

**Not adding &#x60;start&#x60; to &#x60;middle&#x60; on the right-half-search-case**The whole point of passing &#x60;start&#x60; is to “remember” the index history. It’s interesting to note that this is only relevant to the right-half-search-case. On the left half search case, the start point stays the same in that recursion. If the start point was 0, it stays 0\. If the start point has been moved in some right-half-case-search executed previously, it stays at that index. We don’t have to move the index, because only the _endpoint_ of our starting array is modified. The beginning is in the same place relevant to what that recursion loop started with.

**&#x60;nums&#x2F;2&#x60; instead of &#x60;nums.length&#x2F;2&#x60;**Yes. This is a mistake I made. Results in &#x60;NaN&#x60; in case you are curious.

## Simplified

Chat GPT also showed me this:

&#x60;&#x2F;**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 *&#x2F;
var search &#x3D; function(nums, target, start &#x3D; 0) {
    &#x2F;&#x2F; Empty array base case
    if (nums.length &#x3D;&#x3D;&#x3D; 0) return -1;
 
    &#x2F;&#x2F; Calculate the middle index
    let middle &#x3D; Math.floor(nums.length &#x2F; 2);
 
    &#x2F;&#x2F; Check if the middle element is the target
    if (nums[middle] &#x3D;&#x3D;&#x3D; target) return middle + start;
 
    &#x2F;&#x2F; Search the right half of the array
    if (nums[middle] &lt; target) {
        return search(nums.slice(middle + 1), target, start + middle + 1);
    } else {
        &#x2F;&#x2F; Search the left half of the array
        return search(nums.slice(0, middle), target, start);
    }
};&#x60;

It has an improved base case that I wouldn’t think would work.

Manis and Anisha coding session:

&#x60;&#x2F;**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 *&#x2F;
var searchThing &#x3D; function(nums, target, start, end) { &#x2F;&#x2F; target&#x3D;0
    console.log(&quot;start&quot;, start, &quot;end&quot;, end)
 
    let middle &#x3D; Math.floor((start + end)&#x2F;2) &#x2F;&#x2F; 2&#x2F;2 &#x3D;1 middle value is 1, index is 1
    let middleNum &#x3D; nums[middle]
 
    if (middleNum &#x3D;&#x3D;&#x3D; target) { &#x2F;&#x2F; 2 &#x3D;&#x3D; 4
        return middle
    }
 
    if (middle &#x3D;&#x3D;&#x3D; start || middle &#x3D;&#x3D;&#x3D; end) {
        return -1
    }
 
    if (middleNum &gt; target){ &#x2F;&#x2F; 2 &lt; 4 
        return searchThing(nums, target, start, middle) &#x2F;&#x2F; index &#x2F;&#x2F;start point, &#x2F;&#x2F;endpoint
    }
 
    if (middleNum &lt; target) {
        return searchThing(nums, target, middle, end) &#x2F;&#x2F; nums, 0, 0, 0
    }
 
}
 
var search &#x3D; function(nums, target) {
    return searchThing(nums, target, 0, nums.length)
}&#x60;

AHH. This algorithm has given me so much trouble. I’m in a situation where I know the anatomy of it very well - it has 4 parts:

## 1) Calculating the middle

Usually &#x60;const mid &#x3D; Math.floor((left + right) &#x2F; 2)&#x60;

## 2) Unsuccessful Base Case

Determine that the search window has narrowed to an extent that precludes the presence of the target, i.e.

* &#x60;if (left &gt; right)&#x60;
* &#x60;(middle &#x3D;&#x3D;&#x3D; left || middle &#x3D;&#x3D;&#x3D; right)&#x60;
* or the very tempting &#x60;else&#x60; condition after our two left and right searches

## 3) Successful Base Case

Check if the &#x60;middle&#x60; equals the target, usually just &#x60;if (nums[mid] &#x3D;&#x3D;&#x3D; target&#x60;

## 4) Actual Right Left Search

&#x60;if (nums[mid] &lt; target)&#x60; search right&#x60;if (nums[mid] &gt; target&#x60; search left

Unfortunately, implementing these is easier said than done. All of the indexes, and initial values can be a little finicky to get right. I’m going to go through and try to set it with the following attitude; don’t let anything by. Make sure that every step taken captures all possibilities.

## The code I settled on:

&#x60;var search &#x3D; function(nums, target, left&#x3D;0, right&#x3D;nums.length-1) {
 
    if (left &#x3D;&#x3D;&#x3D; right) return -1
    
    const mid &#x3D; Math.floor((right + left)&#x2F;2)
    if (nums[mid] &#x3D;&#x3D;&#x3D; target) return mid
    
    if (nums[mid] &lt; target)return search(nums, target, mid + 1, right)
    return search(nums, target, left, mid - 1)
};&#x60;

## The trickiest parts about this to me

I think the trickiest line for me here is the &#x60;if (left&#x3D;&#x3D;&#x3D;right) return -1&#x60;, because at first it didn’t really seem clear how this happens.

I still haven’t really followed it down to the atomic level.

In the case of an odd list, we actually end up finding the target organically between it’s two neighbors in a slice of 3.

But because we are using Math.floor, an _even_ numbered list will actually follow the exact same execution pattern. I’ve only followed this execution pattern going left, but in both of these cases, left and right end up being separated by one index value. So theoretically, using &#x60;if (left &#x3D; right -1)&#x60; would execute slightly sooner, and just as cleanly. Let’s try it.

&gt; Nope.

The verdict is, the soonest we can determine target isn’t present seems to be &#x60;if (left&#x3D;&#x3D;&#x3D;right)&#x60;. I am having trouble following this all the way to the end, but that seems to be the closest we can get.

## Things I learned

* Recursion can definitely be tricky to reason about - it may be worth trying iterate approaches
* The JavaScript &#x60;slice&#x60; function can take one or two arguments. If it just takes one, it assumes the end of the returned array is the same. If it takes 2, the second argument determines the one index _after_ the last index returned. In this way, the first index given is _inclusive_ and the second is _exclusive_, like some annoying bookend
* It is possible to set a default value for a parameter in a function that is calculated _as a result of another paremeter_, i.e. &#x60;function binaryearch(nums, target, left &#x3D; 0, right &#x3D; nums.length - 1&#x60;
* &#x60;Math.floor&#x60; can be used as a brief and effective method for collapsing sets of two possible integer conditions into one
* ^ Not related to binary search, but this same method is also used in a binary heap priority queue to find the a single parent from either of two potential indexes

## Reflections on our &#x60;failure&#x60; base case after a few days

Okay so first off I want to say that I found another way to think of the anatomy of this function. It has five parts in this order:

1. failure base case
2. middle declaration and calculation
3. success base case
4. recursive right search commitment
5. recursive left search commitment

And I feel rock solid on all five parts _except_ numero uno, &#x60;failure base case&#x60;. I’ve tried to follow the values through the recursion that causes this to either get fired eventually or _never_ get fired, and I’ve really had trouble doing this because it takes a long time to feel that I’ve covered every potential iteration. For example, left search followed by right, right by left, or left by left, or right by right, etc.

However, after thinking about it for a couple of days, I think I almost understand. What _does_ make sense to me is that, if our &#x60;left&#x60; and &#x60;right&#x60; pointers have collapsed _almost_ into each other - let’s say they are &#x60;24&#x60; and &#x60;25&#x60;\- then we now have a 50% chance of finding out that our middle is our target left.

That is why I am actually unconvinced that &#x60;left &#x3D;&#x3D;&#x3D; right&#x60; is the right condition to check for our base failure case. I am now of the mind - even though leetcode will accept the above condition - that only &#x60;left &gt; right&#x60; would be correct. This is because if &#x60;left &#x3D;&#x3D;&#x3D; right&#x60; is true, I think we still need to do one last check that &#x60;nums[middle] &#x3D;&#x3D;&#x3D; target&#x60;, as we have not yet done this check. Once we’ve done that, left and right will have passed each other and we can now rest easy.

_Or_, I think it would also be acceptable to continue using &#x60;left &#x3D;&#x3D;&#x3D; right&#x60; but to put it _after_ or &#x60;nums[middle] &#x3D;&#x3D;&#x3D; target&#x60; check.

That said, I doubt leetcode is wrong to accept my submission. But that means I am still missing something.

---