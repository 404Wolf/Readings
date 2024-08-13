---
id: 3b61b703-6e6f-4696-b283-088ab3e1fc10
title: Binary Tree Inversion
tags:
  - RSS
date_published: 2024-07-28 00:04:14
---

# Binary Tree Inversion
#Omnivore

[Read on Omnivore](https://omnivore.app/me/binary-tree-inversion-190f78c6c74)
[Read Original](https://elijer.github.io/garden/Dev-Notes/LeetCode-Journal/Binary-Tree-Inversion)



## Pseudocode

&#x60;&#x60;&#x60;1c

&#x2F;&#x2F; Pseudocode
&#x2F;&#x2F; let tree &#x3D; []
&#x2F;&#x2F; if (!tree[0]) tree[0] &#x3D; []
&#x2F;&#x2F; tree[0].push(2)
&#x2F;&#x2F; console.log(tree)
&#x2F;&#x2F; -&gt; OUtput of 2, 3, 1
&#x2F;&#x2F; So the identification of parts of the list is like,
&#x2F;&#x2F; i&#x3D;0 is the root.
&#x2F;&#x2F; i[1, 2] is layer one
&#x2F;&#x2F; i[3, 4, 5, 6] is layer two
&#x2F;&#x2F; i[7, 8, 9, 10, 11, 12, 13, 14] is layer three
&#x2F;&#x2F;             0
&#x2F;&#x2F;           1, 2
&#x2F;&#x2F;        3, 4, 5, 6
&#x2F;&#x2F; 7, 8, 9, 10, 11, 12, 13, 14

&#x2F;&#x2F; So the pattern of layer lengths is 1, 2, 4, 8, 16, 32, etc.
&#x2F;&#x2F; The max layers we can have, by the way, is 7, where the 7th layer isn&#39;t totally full

&#x2F;&#x2F; I feel like all I need to do is create a tree where we have each layer organized
&#x2F;&#x2F; as an array in an array of layers
&#x2F;&#x2F; And then for each one after the 1st one, we flip it
&#x2F;&#x2F; Yeah?
&#x2F;&#x2F; Okay, at 7:33 I&#39;m gonna go for it

&#x2F;&#x2F; So my challenge is, at each index, I need to figure out which layer it is a part of.
&#x2F;&#x2F; I COULD do this by just generating a list of layer lengths,
&#x2F;&#x2F; which sure, let&#39;s do that, and just cap it out

&#x60;&#x60;&#x60;

## Implementation

&#x60;&#x2F;**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val &#x3D; (val&#x3D;&#x3D;&#x3D;undefined ? 0 : val)
 *     this.left &#x3D; (left&#x3D;&#x3D;&#x3D;undefined ? null : left)
 *     this.right &#x3D; (right&#x3D;&#x3D;&#x3D;undefined ? null : right)
 * }
 *&#x2F;
&#x2F;**
 * @param {TreeNode} root
 * @return {TreeNode}
 *&#x2F;
var invertTree &#x3D; function(root) {
 
 
  let tree &#x3D; []
  let layerLengths &#x3D; [1, 2, 4, 8, 16, 32, 64, 128]
  layer &#x3D; 0
 
  for (let i &#x3D; 0; i &lt; root.length; i++){
    if (!tree[layer]) tree[layer] &#x3D; []
    tree[layer].push(root[i])
    &#x2F;&#x2F; So we push the current layer, and then we check and see...
    &#x2F;&#x2F; Is the current layer now the max length it should be according to layer lengths?
    &#x2F;&#x2F; if so, we just add another layer
    &#x2F;&#x2F; Which we will now push to.
    if (tree[layer].length &#x3D;&#x3D;&#x3D; layerLengths[layer]){
      layer++
    }
  }
 
  &#x2F;&#x2F; Handle case where last layer is not full
  &#x2F;&#x2F; But only do so if last layer is VALID, since we layer++ to a layer that may not exist
  &#x2F;&#x2F; in cases where a layer is perfectly full
  if (tree[layer]){
    let valenceLength &#x3D; tree[layer].length
    let diff &#x3D; layerLengths[layer] - valenceLength
    let compensation &#x3D; new Array(diff)
    tree[layer].concat(compensation)
  }
 
  for (layer of tree){
    layer.reverse()
  }
 
  return tree
 
    
};
 
console.log(invertTree([4,2,7,1,3,6,9]))
 &#x60;

I’ve never worked with binary trees before, and so mistake made involved missing the fundamental domain of the question of itself and no actually working with a binary tree data structure at all. I ended up returning an array instead.

While I am proud that the array I returned is, I believe, in the right order to implement the binary tree this exercise asks for, it’s not a binary tree. At least not by the definition of the question.

I think that a class could be written that would be able to content with this similarly to how a binary tree would function while still maintaining that single array as the source of truth for the data structure.

What I’m not sure about is which is more performant - this abstract binary tree I created that refers to indexes in a single list, or true binary tree.

To move forward, I see two paths

* Stubbornly stick to my weirdly unique idea of what a binary tree is and just construct one out of the reversal I’ve created myself
* Create the binary tree from the data, and then just reverse the &#x60;left&#x60; and &#x60;right&#x60; values

These approaches are that different - they mostly just involve learning how to construct a binary tree out of a list using javascript.

What…it would right?

&#x60;&#x60;&#x60;angelscript
    1
   4, 5
6, 7, 4, 2

&#x60;&#x60;&#x60;

If I swapped right and left values of the above tree, I’d get:

&#x60;&#x60;&#x60;angelscript
   1
  5, 4
2, 4, 7, 6

&#x60;&#x60;&#x60;

Yeah that works.

Okay so I tried to create a recursive tree:

&#x60;&#x60;&#x60;javascript
let root &#x3D; [1, 4, 2, 5, 5, 7, 2, 3]

class TreeNode{
  constructor(val, left, right){
    this.val &#x3D; (val&#x3D;&#x3D;&#x3D;undefined ? 0 : val)
    this.left &#x3D; (left&#x3D;&#x3D;&#x3D;undefined ? null : left)
    this.right &#x3D; (right&#x3D;&#x3D;&#x3D;undefined ? null : right)
  }
}

function recursiveTree(source, index){
  if (index &gt;&#x3D; source.length) return &#x2F;&#x2F; don&#39;t try to create a leaf if no values left
  let node &#x3D; new TreeNode(
    source[0 + index],
    index+1 &gt;&#x3D; source.length ? null : recursiveTree(source, index+1),
    index+2 &gt;&#x3D; source.length ? null : recursiveTree(source, index+2)
   )
  if (index &#x3D;&#x3D;&#x3D; 0) return node
}

console.log(recursiveTree(root, 0))

&#x60;&#x60;&#x60;

I made some pretty serious mistakes. Here they are as far as I can tell:

1. Checking against an out of bound index twice (or debatably thrice) - at the beginning of the recurse function AND inside of the new TreeNode. This might even cause an error, since I’m not even checking if the index is null despite checking it explicitly as null
2. 0 + index is a silly thing to do - not a problem, but there’s no reason to add anything to 0
3. Only returning the node when index &#x3D;&#x3D;&#x3D; 0 was a mis-use of a recursive function - each successive recursion _needs to return_; that’s how the tree is built. I’m not editing a tree in place
4. Only adding 1 or adding 2 to the index isn’t enough. It is for the first generation of children, when we add 1 or 2 to 0 to get 1 and 2 as the values for the next generation. But if we add 1 to the first generation value of 1 we get 2, which is _also_ in generation 1\. This will lead us trying to create a generation 2 that has 2 of the same indexes as those in generation 1 - not sure if this leads to infinite recursion, but it _will_ create a janky, redundant binary tree. Rather than each element getting its own node, each element will, I think, get two nodes each, which is not what we want.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sfpD2PTdAaqEzz15PTK4kvVJZMTSlnTR8wIH7pezhrMs&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;31429ae34209dc9c3fc48466746f2fa9.png)

If we fix the code it looks like this:

&#x60;let root &#x3D; [1, 4, 2, 5, 5, 7, 2, 3]
 
class TreeNode{
  constructor(val, left, right){
    this.val &#x3D; (val &#x3D;&#x3D;&#x3D; undefined ? 0 : val)
    this.left &#x3D; (left &#x3D;&#x3D;&#x3D; undefined ? null : left)
    this.right &#x3D; (right &#x3D;&#x3D;&#x3D; undefined ? null : right)
  }
}
 
function recursiveTree(source, index){
  if (index &gt;&#x3D; source.length) return null &#x2F;&#x2F; Return null if no values left
  
  &#x2F;&#x2F; Create the node with its left and right children
  let node &#x3D; new TreeNode(
    source[index],
    recursiveTree(source, 2 * index + 1),
    recursiveTree(source, 2 * index + 2)
  )
  
  return node &#x2F;&#x2F; Always return the node
}
 
console.log(recursiveTree(root, 0))
 &#x60;

And creates this binary tree:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sw0bZPJo7-xVaVJaF8okDJgwhy_uB1FgaSlwI36hubU0&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;e71661367a4b127d8f658c71eb605b98.png)

Except it doesn’t because I still have a few more mistakes.

&#x60;class TreeNode{
  constructor(val, left, right){
    this.val &#x3D; (val &#x3D;&#x3D;&#x3D; undefined ? 0 : val)
    this.left &#x3D; (left &#x3D;&#x3D;&#x3D; undefined ? null : left)
    this.right &#x3D; (right &#x3D;&#x3D;&#x3D; undefined ? null : right)
  }
}
 
function invertTree(source, index){
 
  if (index &gt;&#x3D; source.length || source[index] &#x3D;&#x3D;&#x3D; null) return null
  
  &#x2F;&#x2F; Create the node with its left and right children
  return new TreeNode(
    source[index],
    invertTree(source, index * 2 + 2),
    invertTree(source, index * 2 + 1),
  )
  
}
 
console.log(invertTree([4,2,7,1,3,6,9], 0))&#x60;

I needed to add the &#x60;if (...source[index] &#x3D;&#x3D;&#x3D; null) return null&#x60; condition. The &#x60;index &gt;&#x3D; source.length&#x60; conditions covers issues where we have run out of values, but it is also very possible to NOT have a fully packed final generation, in which case we are…no that’s not it. Because this example has no nulls. So this should work.

&#x60;var invertTree &#x3D; function(root) {
  &#x2F;&#x2F; base case
  if(!root) return null;
  const t3 &#x3D; new TreeNode();
 
  &#x2F;&#x2F;recursive case
  t3.val &#x3D; root.val;
  t3.left &#x3D; invertTree(root.right);
  t3.right &#x3D; invertTree(root.left);
  return t3;
};&#x60;

Turns out I definitely misunderstood a couple things. I am being _given a tree to begin with_. 🤦🏻‍♂️

## Conclusion

* I now know how to create a binary tree
* I didn’t need to create a binary tree for this challenge at all, just interact with existing ones

---