---
id: d499f976-66c9-4692-9819-4b5836fce21e
title: Is Palindrome
tags:
  - RSS
date_published: 2024-07-25 16:04:08
---

# Is Palindrome
#Omnivore

[Read on Omnivore](https://omnivore.app/me/is-palindrome-190eb896f20)
[Read Original](https://elijer.github.io/garden/Dev-Notes/LeetCode-Journal/Is-Palindrome)



## My First Attempt

&#x60;&#x2F;**
 * @param {string} s
 * @return {boolean}
 *&#x2F;
 
var isPalindrome &#x3D; function(s) {
  let n &#x3D; s.toLowerCase().replace(&#x2F;[^a-z]&#x2F;g, &#39;&#39;);
 
  if (n.length % 2 &#x3D;&#x3D;&#x3D; 0){
    let firstHalf &#x3D; n.slice(0, n.length &#x2F; 2)
    let arr &#x3D; firstHalf.split(&quot;&quot;)
    arr.reverse()
    let arr2 &#x3D; arr.join(&quot;&quot;)
    console.log(arr2)
    if (arr2 &#x3D;&#x3D;&#x3D; n.slice(n.length&#x2F;2, n.length)){
      return true
    }
  } else {
    let firstHalf &#x3D; n.slice(0, (n.length-1) &#x2F; 2)
    let arr &#x3D; firstHalf.split(&quot;&quot;)
    arr.reverse()
    let arr2 &#x3D; arr.join(&quot;&quot;)
    if (arr2 &#x3D;&#x3D;&#x3D; n.slice((n.length - 1)&#x2F;2 + 1, n.length)){
      return true
    }
  }
 
  return false
};&#x60;

Very close! Far from eloquent, but for me, eloquence comes easiest with iteration. I was quick to index in on the problem, which was the the description asks for _alphanumeric_ parsing, and I only did the _alpha_ part of that.

Unfortunately, I made a silly mistake, and hastily replaced my &#x60;a-z&#x60; to &#x60;a-z1-9&#x60;, not even noticing that of course &#x60;0&#x60; is omitted from that range. So…very quickly fixed it, but then wasted 7 minutes in realizing how my fix was inadequate. I THEN preceded to almost rewrite the second half of the entire algorithm, not even thinking about how this is actually an _even_ case anyways.

---