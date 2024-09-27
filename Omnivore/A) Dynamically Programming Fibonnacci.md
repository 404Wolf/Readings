---
id: 717dbf8b-9236-482e-a8bb-2ac4fb0da3ed
title: A) Dynamically Programming Fibonnacci
tags:
  - RSS
date_published: 2024-09-06 23:05:07
---

# A) Dynamically Programming Fibonnacci
#Omnivore

[Read on Omnivore](https://omnivore.app/me/a-dynamically-programming-fibonnacci-191cb2c74d7)
[Read Original](https://elijer.github.io/garden/devnotes/LeetCode-Journal/A)-Dynamically-Programming-Fibonnacci)



Here is the dynamic programming definition that can be provided by someone who learned about the concept yesterday:

&gt; Dynamic programming is a recursive pattern in which the return values of a function are saved to be reused by later functions.

Calculating the value of an index in the fibonacci sequence is a perfect application for dynamic programming because each index of the Fibonacci sequence is a function of the two previous items in the sequence.

Implementation I created organically

&#x60;&#x60;&#x60;perl
const fibonacci &#x3D; function(n, seq&#x3D;[1, 1]){

  if (n &lt; 2) return 1

  if (seq.length-1 &lt; n){
    seq.push(seq[seq.length-1] + seq[seq.length-2])
    return fibonacci(n, seq)
  }

  return seq[n]
}

console.log(fibonacci(4))

&#x60;&#x60;&#x60;

Implementation I found online:

&#x60;function fibonacci(n) {
  &#x2F;&#x2F; Declare the memo object once
  const memo &#x3D; {};
 
  &#x2F;&#x2F; Inner recursive function that uses the memo object
  function fib(n) {
    &#x2F;&#x2F; Base cases
    if (n &lt;&#x3D; 1) return n;
 
    &#x2F;&#x2F; Check if the value is already computed
    if (memo[n]) return memo[n];
 
    &#x2F;&#x2F; Compute the value and store it in the memo object
    memo[n] &#x3D; fib(n - 1) + fib(n - 2);
 
    return memo[n];
  }
 
  &#x2F;&#x2F; Call the inner recursive function
  return fib(n);
}
 
&#x2F;&#x2F; Example usage
console.log(fibonacci(10)); &#x2F;&#x2F; Outputs: 55
console.log(fibonacci(50)); &#x2F;&#x2F; Outputs: 12586269025&#x60;

---