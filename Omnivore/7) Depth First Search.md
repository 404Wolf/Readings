---
id: 050776cf-0951-460a-b8b7-18a7b0ed5922
title: 7) Depth First Search
tags:
  - RSS
date_published: 2024-09-06 23:05:07
---

# 7) Depth First Search
#Omnivore

[Read on Omnivore](https://omnivore.app/me/7-depth-first-search-191cb2c75c3)
[Read Original](https://elijer.github.io/garden/devnotes/LeetCode-Journal/7)-Depth-First-Search)



![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sOHU1u7BKYAXzEcDmshL45tKkiIe4lVYt-AKKSh6q-bg&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;a34bd0f5ad6b0420c2da8c0a9f551937.png)

&gt; ^ Image of a heron on an old bridge support in Richmond, VA that I made during an MS paint challenge

## Implementing Flood Fill

Today, [Benjamin Arnav](https:&#x2F;&#x2F;benjaminarnav.com&#x2F;)and I tackled a depth-first-search (DFS) leetcode problem called [flood fill](https:&#x2F;&#x2F;leetcode.com&#x2F;problems&#x2F;flood-fill&#x2F;description&#x2F;). Aging myself, I was secretly excited about this problem because it’s the algorithm behind MS paint’s classic “fill” behavior. When I was nine, I got frustrated by this mechanism, which didn’t always “squeeze through” diagonal “gaps” in the pixels like I hoped it would, but it _did_ have a knack for still finding a way through some opening I accidentally left in my outlines. You can’t have it all.

Turns out, this is exactly the behavior leetcode asks us to create - for each pixel that needs to be changed to a new color, check all four of it’s neighbors (not all eight!) to see if they are the same as the original color, and continue changing their colors until hitting the edge or exhausting all same-color neighbors.

Even as a team, we were a bit spooked by the term “depth first search”. We discovered the correct approach during our fifteen minute pseudo-coding exercise, but then looked up answers before attempting to implement it. I believe this was a mistake, as we robbed ourselves of the full opportunity to debug our own implementation.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sI56JNi96k70w-UMl8mTCPIk27Ny-X6_ULfciJEgH0SE&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;9716b4da445a74119786a86130edd206.JPG) ![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,stbBT_KyrUV2ACNYLKHIYXxKzmgOdxPwdkPDcSukg_SQ&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;b016f62201ef5848b6394238359c946e.JPG)

That said, once we verified our approach was a valid one, we were able to implement it within ten minutes. This is what we came up with in python:

&#x60; 
def floodFill(self, image, sr, sc, color):
	original_color &#x3D; image[sr][sc]
	rows, columns &#x3D; len(image), len(image[0])
	if original_color &#x3D;&#x3D; color:
		return image
		
	def dfs(r,c):
		if r &lt; 0 or r &gt;&#x3D; rows or c&lt; 0 or c&gt;&#x3D; columns:
			return
		if image[r][c] !&#x3D; original_color:
			return
		image[r][c] &#x3D; color
		dfs(r+1,c)
		dfs(r-1,c)
		dfs(r,c+1)
		dfs(r,c-1)
		
	dfs(sr,sc)
 
	return image&#x60;

Later I translated it to JavaScript:

&#x60;function floodFill(image, sr, sc, color){
	let originalColor &#x3D; image[sr][sc]
	if (originalColor &#x3D;&#x3D;&#x3D; color) return image
 
	let rows &#x3D; image.length
	let cols &#x3D;  image[0].length
	
	function dfs(sr, sc){
		if (sr &lt; 0 || sr &gt;&#x3D; rows || sc &lt; 0 || sc &gt;&#x3D; cols) return
	    if (image[sr][sc] !&#x3D;&#x3D; originalColor ) return
	    image[sr][sc] &#x3D; color
	    dfs(sr+1, sc)
	    dfs(sr-1, sc)
	    dfs(sr, sc+1)
	    dfs(sr, sc-1)
	    return
	}
 
    dfs(sr, sc)
    return image
}&#x60;

## Gotchas

1. When porting to JavaScript I made the mistake of checking if &#x60;image[sr][sc] &#x3D;&#x3D;&#x3D; color&#x60;, instead of original color like &#x60;image[sr][sc] &#x3D;&#x3D;&#x3D; originalColor&#x60;. The &#x60;color&#x60; is the color we are changing each pixel to, but only if it is the same color as the original color
2. Although in python this doesn’t seem necessary, the &#x60;image[rc][sc]&#x60; does seem to need to be evaluated _after_ all of the boundaries checks, otherwise we run the risk of checking for an index on a row that doesn’t exist, throwing an error.

## DFS vs. BFS

The only real difference with breadth-first-search (BFS) is that instead of following each path all the way to the end before starting the next one, we evaluate each neighbor before moving in. Because BFS can’t really be done recursively, this can be understood best by changing the DFS implementation above into an iterative one and then comparing it with iterative BFS.

## Iterative DFS

&#x60;var floodFill &#x3D; function(image, sr, sc, color) {
    if (image[sr][sc] &#x3D;&#x3D;&#x3D; color) return image;
    
    const originalColor &#x3D; image[sr][sc];
    const rows &#x3D; image.length;
    const cols &#x3D; image[0].length;
    const stack &#x3D; [[sr, sc]];
    
    while (stack.length &gt; 0) {
        const [r, c] &#x3D; stack.pop();
        
        if (r &lt; 0 || r &gt;&#x3D; rows || c &lt; 0 || c &gt;&#x3D; cols || image[r][c] !&#x3D;&#x3D; originalColor) {
            continue;
        }
        
        image[r][c] &#x3D; color;
        
        stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
    
    return image;
};&#x60;

## Iterative BFS

&#x60;var floodFill &#x3D; function(image, sr, sc, color) {
    if (image[sr][sc] &#x3D;&#x3D;&#x3D; color) return image;
    
    const originalColor &#x3D; image[sr][sc];
    const rows &#x3D; image.length;
    const cols &#x3D; image[0].length;
    const queue &#x3D; [[sr, sc]];
    
    while (queue.length &gt; 0) {
        const [r, c] &#x3D; queue.shift();
        
        if (r &lt; 0 || r &gt;&#x3D; rows || c &lt; 0 || c &gt;&#x3D; cols || image[r][c] !&#x3D;&#x3D; originalColor) {
            continue;
        }
        
        image[r][c] &#x3D; color;
        
        queue.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
    }
    
    return image;
};&#x60;

Pretty similar, right? The only different is that we are applying a &#x60;queue.shift()&#x60; on our array (and calling it a queue for that matter) instead of a &#x60;stack.pop()&#x60;. The &#x60;.shift()&#x60; is FIFO - we are making sure to execute our operations in the order they come up, and not, I dunno, starting our side quests as they come up.

&#x60;.pop()&#x60;, meanwhile, gives us LIFO, or a stack, where we keep drilling down into next generations of our search as we discover them, only “back tracking” once we’ve followed a path all the way to the end.

## DFS Diagram

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7EXtKQrbK1k9s-YYij8wlWRruFdgQCj240nTVxuvXyQ&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;e3709d92f19acb5e3aeecc10367c3cce.png)

## BFS Diagram

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sX7aYdlksfm9NZbyuXDbcK5K_Nf8YZ95PB0ggP2-2Dww&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;e8c82d687dbe31bdce9632b48590595b.png)

## Implementation thoughts

* Re:gotcha #2, I wonder if instead of checking for boundaries I could just do a &#x60;try&#x2F;catch&#x60; and let the boundary errors happen:

&#x60;function floodFill(image, sr, sc, color){
	let original_color &#x3D; image[sr][sc]
	if (original_color &#x3D;&#x3D;&#x3D; color) return image
 
	function dfs(sr, sc){
	    try{
	      if (image[sr][sc] !&#x3D;&#x3D; original_color ) return
	      image[sr][sc] &#x3D; color
	      dfs(sr+1, sc)
	      dfs(sr-1, sc)
	      dfs(sr, sc+1)
	      dfs(sr, sc-1)
	      return
	    } catch {
	      return
	    }
	}
 
    dfs(sr, sc)
    return image
}
 
 
let arr &#x3D; [[1,1,1],[1,1,0],[1,0,1]]
console.log(floodFill(arr, 1, 1, 2 ))&#x60;

## Things I learned

### Nested function declarations _can_ be👌🏼

Although declaring a function inside of another function can be dangerous for scope-declaration collision concerns, it can also be really convenient for scope-declaration redundancy avoidance. I’ve been [burned by this in the past](https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;devnotes&#x2F;LeetCode-Journal&#x2F;4%29-Merge-Two-Sorted-Linked-Lists) during a mock interview, so initially I had some resistance when Benjamin wanted to do this, but he changed my mind. A recursive function declared inside of a parent function that can call it allows global variables to be declared once and awkwardly passed through a section time to the recursive function, even though they may not change.

### Default parameter values are OP

That said, one of the coolest things I’ve learned about recursive functions recently is that because by nature each new function is nested inside a previous generation of itself, any variable declared in the first generation (possibly as a default value for a parameter), never needs to be redeclared.

Continuing on that train of thought - if default variables can be useful in this way, can they also be used to remove the recursive-function-parent-function pattern entirely? For example, something like:

&#x60;let someFunc &#x3D; function(someVar, initial &#x3D; false){
	if (initial &#x3D;&#x3D;&#x3D; true){
		let someGlobalVariable &#x3D; 4
	}
}
 &#x60;

Okay so in writing the above I realized no, this isn’t a good way to create global variables, because in this case the “global” variable needs to be wrapped inaccessibly inside of a conditional.

However, what are the limits to the evaluations we can run inside of the parameters?

&#x60;let someRecursiveFunc &#x3D; function(someVar, anotherVar &#x3D; () &#x3D;&gt; {
		let someDeclaredVar &#x3D; 1 + 2 &#x2F; 4 &#x2F;&#x2F; some math
		return someDeclaredVar
		}
	) {
	&#x2F;&#x2F; wow really not sure how to indent
	var doSomethingWithAnotherVar &#x3D; anotherVar++
}&#x60;

^ I don’t see why this isn’t possible. It is a bit confusing though. Never has clear indentation practices been so important or, in this case, so inadequate.

### DFS and BFS have similar forms, but distinct strengths

Another thing I learned was that, at least in this case, depth-first-search (DFS) and breadth-first-search (BFS) are very similar. In fact, the only difference in code seems to be that DFS employs &#x60;pop()&#x60; in order to perform LIFO (last-in-first-out), whereas BFS uses &#x60;shift&#x60; to achieve FIFO (first-in-first-out).

As far as differences in performance, here is a comparison.

#### DFS

* memory usage generally lower than BFS
* Good for finding _a_ path if several exist

#### BFS

* Good for finding THE path if only one exists
* Guaranteed to find shortest path to something while iteration occurs, not after
* Can be slower in cases where the “goal” is deep in the structure

## Conclusions

The flood fill problem is a really nice way to visualize the tree-like behavior recursion of both BFS and DFS. I would like to explore other BFS and DFS use cases to understand them better.

---