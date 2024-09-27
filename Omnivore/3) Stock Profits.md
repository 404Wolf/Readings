---
id: 29468ee1-e3a6-41df-bb4d-5ccd7e67db4e
title: 3) Stock Profits
tags:
  - RSS
date_published: 2024-08-24 06:04:50
---

# 3) Stock Profits
#Omnivore

[Read on Omnivore](https://omnivore.app/me/3-stock-profits-19184563301)
[Read Original](https://elijer.github.io/garden/devnotes/LeetCode-Journal/3)-Stock-Profits)



[Stock profits on leet code](https:&#x2F;&#x2F;leetcode.com&#x2F;problems&#x2F;best-time-to-buy-and-sell-stock&#x2F;)

This one didn’t go very well. This was my solution:

&#x60;&#x2F;**
 * @param {number[]} prices
 * @return {number}
 *&#x2F;
var maxProfit &#x3D; function(prices) {
    profit &#x3D; 0
    let reductionArray &#x3D; [...prices]
 
    for (let i &#x3D; 0; i &lt; prices.length - 1; i++){
      let currentVal &#x3D; prices[i]
      reductionArray.shift()
      let highVal &#x3D; Math.max(...reductionArray)
      let difference &#x3D; highVal - currentVal
      if (difference &gt; profit){
        profit &#x3D; highVal - currentVal
      } else {
      }
    }
    return profit
};
 
console.log(maxProfit([7,1,5,3,6,4]))&#x60;

This is like, at least a 50 minute solution. I DID get a working solution after 30 minutes, but it timed out. I thought I could weasel my way out of O(n^2) complexity with Math.max, but that’s obviously still a for loop. That was sort of wishful thinking.

So my second implementation didn’t fix much.

Claude gave me this incredibly simple solution:

&#x60;var maxProfit &#x3D; function(prices) {
    let minPrice &#x3D; Infinity;
    let maxProfit &#x3D; 0;
    
    for (let price of prices) {
        if (price &lt; minPrice) {
            minPrice &#x3D; price;
        } else if (price - minPrice &gt; maxProfit) {
            maxProfit &#x3D; price - minPrice;
        }
    }
    
    return maxProfit;
};&#x60;

Let me walk through it with comments:

&#x60;var maxProfit &#x3D; function(prices) {
    let minPrice &#x3D; Infinity; &#x2F;&#x2F; oh wow didn&#39;t know that existed
    let maxProfit &#x3D; 0; &#x2F;&#x2F; familiar
    
    for (let price of prices) { &#x2F;&#x2F; nice, just a for of, in order
        if (price &lt; minPrice) { &#x2F;&#x2F; get the lowest price so far
            minPrice &#x3D; price; &#x2F;&#x2F; save it
        } else if (price - minPrice &gt; maxProfit) {
        &#x2F;&#x2F; BUT IF NOT THE LOWEST PRICE, check and see if minPrice
        &#x2F;&#x2F; i.e. LOOKING BACKWARDS at the most attractive starting point
        &#x2F;&#x2F; yields best profit
        &#x2F;&#x2F; The else if here is a really extra but nice optimization
        &#x2F;&#x2F; This could just be two separate conditionals
        &#x2F;&#x2F; But it&#39;s true that they are mutually exclusive
            maxProfit &#x3D; price - minPrice;
        &#x2F;&#x2F; And damn. That&#39;s it.
        }
    }
    
    return maxProfit;
};&#x60;

So looking at Claude’s answer, it’s like I was stuck in this “looking forwards” paradigm. But there was this looking backwards option the whole time and I was too stuck in my O(n2) bullshit to realize it.

The difference has TWO sides - it requires a high number farther up, and a lower number farther down. We’re looking, fundamentally, for the largest range, as long as that range goes low high in the same direction as the array progresses.

---