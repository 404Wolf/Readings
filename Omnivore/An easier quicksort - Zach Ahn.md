---
id: d33d9796-e176-11ee-bbb4-9fa6a2d7a9a0
title: An easier quicksort - Zach Ahn
tags:
  - RSS
date_published: 2024-03-13 14:04:39
---

# An easier quicksort - Zach Ahn
#Omnivore

[Read on Omnivore](https://omnivore.app/me/an-easier-quicksort-zach-ahn-18e39772d95)
[Read Original](https://zachahn.com/posts/1710350863)



Embarrassing story—I implemented a bunch of sorting algorithms for an assignment a long time ago, but quicksort ended up being one of the slowest ones I wrote.

I’m redoing that exercise now, and I’m happy to say I have a better understanding of it. But I’m writing this because I think it’s a slightly novel variation. At least, it’s not an implementation I’ve ever seen before. I doubt it’s faster, but I find it easier to reason about. (Spoiler, it’s not faster!)

## The basics

Quicksort is a recursive sorting algorithm. On average, it’s one of the faster sorting algorithms. It’s composed of two main ideas: partitioning the list into two halves, and “quicksorting” each of the two halves. I find that partitioning is the hard part; the recursive aspect is pretty straightforward as long as we remember to define the base case.

I’ll really just be focusing on the &#x60;partition&#x60; function. We input the array of numbers and a range for the function to focus on. We expect it to return the position of a number. We expect everything (_everything_) to the left of that position to be smaller than the number; we expect everything to the right of that position to be larger than that number. The number itself is called the “pivot”. Numbers that are equal to the pivot can be in either half.

Typically, the pivot is the rightmost element of the range. But it can be any number in the range—just swap the number you choose with the rightmost number, then proceed as normal.

Here’s an example where we run &#x60;partition&#x60; once on a full array, just the inputs and result. We’re using zero-based indexes.

&#x60;&#x60;&#x60;asciidoc
Input: Indexes 0 to 6
-----------------------------
[ 6   5   2   7   0   8   4 ]
                    Pivot ↑

Result:
-----------------------------
[ 2   0   4   7   5   8   6 ]
          ↑
Returns &#x60;2&#x60;, the position of the pivot

&#x60;&#x60;&#x60;

The array is not sorted at all, but pivot is in the right place. Once every element has its turn being the pivot element, the array will end up having been sorted.

Here’s another example where we run &#x60;partition&#x60; on a sublist.

&#x60;&#x60;&#x60;asciidoc
Input: Indexes 3 to 6
-----------------------------
  2   0   4 [ 7   5   8   6 ]
                    Pivot ↑

Result:
-----------------------------
  2   0   4 [ 5   6   8   7 ]
                  ↑
Returns &#x60;4&#x60;, the position of the pivot

&#x60;&#x60;&#x60;

## Understanding partitioning

A single round of partitioning has a few phases:

1. Moving all the numbers lesser than the pivot to the left part of the list.
2. Moving all the numbers greater than the pivot to the right part of the list.
3. Moving the pivot in between those parts.
4. Returning the position of the pivot.

I always found it hard to convert those rules into code. We’ll see in a bit, but there are a lot of array indexes to keep track of, and these are weird ones, and even without the weirdness, array indexes are bug prone.

We can use a line to keep track of things. Everything to the right of the line is unprocessed or greater than the pivot. Everything to the right of the line must be lesser than the pivot.

&#x60;&#x60;&#x60;angelscript
| ↓ Current element
| 6   5   2   7   0   8   4
| ← The line        Pivot ↑

&#x60;&#x60;&#x60;

Looking at the example above, the first time we need to put anything to the right of the line is on array index &#x60;2&#x60;.

&#x60;&#x60;&#x60;angelscript
First element smaller than pivot
|         ↓
| 6   5   2   7   0   8   4
| ← The line        Pivot ↑

&#x60;&#x60;&#x60;

In quicksort, we move elements by swapping elements rather than sliding them. We’ll swap the 6 and the 2—and move the line by one step to the right.

&#x60;&#x60;&#x60;yaml
  First: Swap 6 and 2
  ↓ |     ↓
  2 | 5   6   7   0   8   4
 →→ |
Second: Move the line to the right

&#x60;&#x60;&#x60;

We don’t have to re-process the 6 that we just moved. We iterate through the elements until we come across 0, which is lesser than 4\. Again, we swap and move the line.

&#x60;&#x60;&#x60;yaml
      First: Swap 5 and 0
      ↓ |         ↓
  2   0 | 6   7   5   8   4
     →→ | 
Second: Move the line to the right

&#x60;&#x60;&#x60;

The 8 is larger, so we don’t have to do anything. We don’t have to compare the pivot with itself, but we do always need to move the pivot directly to the right of the line.

&#x60;&#x60;&#x60;angelscript
          Swap 6 and 4
        | ↓               ↓
  2   0 | 4   7   5   8   6
        | ↑
Return new position of pivot

&#x60;&#x60;&#x60;

### Small edge case: First element is smaller than pivot

&#x60;&#x60;&#x60;asciidoc
Input: Indexes 0 to 2
-------------
|
| 3   5   8
|

&#x60;&#x60;&#x60;

Since the 3 is directly to the right of the line, we swap the three with itself. Then we move the line. Wasted operations, but nothing too crazy.

This specific scenario is kinda funny since it’s already sorted. The 5 also gets swapped with itself, then the 8 gets swapped with itself.

### Small edge case: Single-element and empty lists

Both single-element and empty lists are always sorted, since there’s nothing to compare.

This isn’t really related to partitioning; this is the base case of our recursion.

## The traditional algorithm

I’m always confused by quicksort because the “line” we talked about starts off out of bounds of the sublist. When we start off, the line is _before_ the first element—array index &#x60;-1&#x60;. We always swap to the right of the line, so we add &#x60;1&#x60;to it, which gets us back within the range. But this, to me, is really confusing.

## My algorithm

I have a much easier time thinking about the size of a list rather than the positions of the list. In other words, instead of subtracting from the left boundary, I realized I can keep track of the number of elements to the left of the line.

&#x60;&#x60;&#x60;ini
# It&#39;s hard to think about indexes
line_position &#x3D; left_index - 1

# It&#39;s easy to count
lesser_length &#x3D; 0

&#x60;&#x60;&#x60;

Here’s the full algorithm with a bunch of comments. It’s in Ruby, but even if you’re unfamiliar with it, I hope it reads close enough to pseudocode for it to be helpful.

&#x60;&#x60;&#x60;properties
class Quick
  ##
  # A convenience method for invoking quicksort.
  #
  # &#x3D;&#x3D; Parameters
  #
  # numbers::   An Array of numbers to be sorted.
  #
  # &#x3D;&#x3D; Returns
  #
  # The array, sorted. Note that the array is sorted in-place.
  def self.sort(numbers)
    quicksort(numbers, 0, numbers.size - 1)
    numbers
  end

  ##
  # Quicksort only sorts subsections of a list.
  #
  # &#x3D;&#x3D; Parameters
  #
  # numbers::      Array&lt;Numeric&gt;. The full array to be sorted.
  # left_index::   Integer. The leftmost boundary to sort.
  # right_index::  Integer. The rightmost boundary to sort.
  #
  # &#x3D;&#x3D; Returns
  #
  # Nothing useful!
  def self.quicksort(numbers, left_index, right_index)
    # Empty lists and single-value lists are sorted by default.
    # Both &#x60;[]&#x60; and &#x60;[1]&#x60; are both fully sorted. This is our base case.
    return if left_index &gt;&#x3D; right_index

    # The item at &#x60;mid_index&#x60; is at the correct position.
    mid_index &#x3D; partition(numbers, left_index, right_index)

    # Separately sort the items that are to the left and right of &#x60;mid_index&#x60;
    quicksort(numbers, left_index, mid_index - 1)
    quicksort(numbers, mid_index + 1, right_index)
  end

  ##
  # The main logic. This differs from a traditional partitioning algorithm
  # since it keeps track of the number of values that are lesser than the
  # pivot rather than keeping track of the position of the &quot;line&quot;.
  #
  # &#x3D;&#x3D; Parameters
  #
  # numbers::      The full array to be sorted.
  # left_index::   The leftmost boundary to consider.
  # right_index::  The rightmost boundary to consider.
  #
  # &#x3D;&#x3D; Returns
  #
  # The position of the pivot. The pivot is correctly sorted, but values to
  # the left and right may not be.
  def self.partition(numbers, left_index, right_index)
    pivot_value &#x3D; numbers[right_index]
    lesser_length &#x3D; 0

    # Iterate through the list, but no need to compare the pivot itself since
    # we always have to move the pivot value.
    current_index &#x3D; left_index
    while current_index &lt; right_index
      current_value &#x3D; numbers[current_index]
      if current_value &lt;&#x3D; pivot_value
        # The current value is lesser than (or equal to) the pivot, so we want
        # to move the current value to the left of the &quot;line&quot;.
        #
        # Another way to think about it is that we swap the first value
        # directly to the right of the line with the current value, then we
        # bump up the length of the list of lesser values to absorb it.
        swap_index &#x3D; left_index + lesser_length
        temp &#x3D; numbers[current_index]
        numbers[current_index] &#x3D; numbers[swap_index]
        numbers[swap_index] &#x3D; temp
        # As mentioned, we have a new lesser value, so increment the length
        lesser_length +&#x3D; 1
      end
      current_index +&#x3D; 1
    end

    # Always swap the pivot to the direct right of the line
    swap_index &#x3D; left_index + lesser_length
    temp &#x3D; numbers[current_index]
    numbers[current_index] &#x3D; numbers[swap_index]
    numbers[swap_index] &#x3D; temp

    # Return the new index of the pivot
    swap_index
  end
end

Quick.sort([6, 5, 2, 7, 0, 8, 4])
# &#x3D;&gt; [0, 2, 4, 5, 6, 7, 8]

&#x60;&#x60;&#x60;

I hope this explanation helps! I’m curious if this variation on partitioning exists elsewhere, please let me know.

In my testing, I found that the method described here is roughly 5% slower than the traditional method. This makes sense to me, since we have to do slightly more addition here to compute the &#x60;swap_index&#x60;—in the traditional, this is cached across iterations.