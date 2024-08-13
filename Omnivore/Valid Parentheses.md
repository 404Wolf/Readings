---
id: d35f29cc-0b0d-4d09-955c-98114fd46003
title: Valid Parentheses
tags:
  - RSS
date_published: 2024-08-02 12:04:15
---

# Valid Parentheses
#Omnivore

[Read on Omnivore](https://omnivore.app/me/valid-parentheses-19113e59054)
[Read Original](https://elijer.github.io/garden/Dev-Notes/LeetCode-Journal/Valid-Parentheses)



## First 15 minutes spent creating this Psudocode:

&#x60;&#x2F;&#x2F; identify opening brackets
&#x2F;&#x2F; let opening &#x3D; &#39;[{(&#39;
&#x2F;&#x2F; save them in an ordered list
&#x2F;&#x2F; identify closing brackets
&#x2F;&#x2F; let &#x3D; &#39;)}]&#39;
&#x2F;&#x2F; As closing brackets come up, check if the last item in the opening brackets list matches
&#x2F;&#x2F; if it doesn&#39;t (provided we add opening brackets to list before closing brackets), return false
&#x2F;&#x2F; if it does, remove that opening from the list, we&#39;re good.
&#x2F;&#x2F; so for like, &#39;[[}]&#39;, if we do that process, we 1) add a [ to openings, add another [ to openings, check if } is the last item in openings,
&#x2F;&#x2F; And find it ISN&#39;T, so we exit. Nice.
&#x2F;&#x2F; Let&#39;s try {[]{}}. We add { to the openings array, [ too, then check if ] type bracket is the --
&#x2F;&#x2F; Okay so little detail here, we need a mapping of openings &#39;]&#39;:&#39;[&#39;, etc. We use that to check, I didn&#39;t mention that.
&#x2F;&#x2F; So given that, we check if &#39;]&#39;&#39;s mapping is the last item int he opening list, and we find it is, we can maybe pop it off
&#x2F;&#x2F; For brevity, next character we have &#39;{&#39;, that&#39;s an opening, so we add it to openings, then we have &#39;}&#39;, we check the mapping of &#39;}&#39;, which is &#39;{&#39; against
&#x2F;&#x2F; The last opening,
&#x2F;&#x2F; It&#39;s be 33% of the alloted time, I think we&#39;re good
&#x2F;&#x2F; And we find that they correspond, same shit, we remove that last opening from the list. We should be left with an opening list of just { now, which gets resolved with the last process.
&#x2F;&#x2F; Okay I feel great about that.
&#x2F;&#x2F; I am gonna go back and just reread the problem and see if I have all the requirements correct.
&#x2F;&#x2F; Okay sweet, looks like s consists only of paren characters, no characters etc.
&#x2F;&#x2F; I think I addressed it, but the trickiest rule is that &quot;open brackets must be closed in the correct order&quot;
&#x2F;&#x2F; Yeah, I think that&#39;s working. Let me just spam some edge cases over the next minute before I get started
&#x2F;&#x2F; &quot;[[[[[[[[[]]]]]]]]]&quot;, &quot;}&quot;
&#x2F;&#x2F; Ooh there&#39;s one - what if we START with an open bracket?
&#x2F;&#x2F; So like, yeah, I just need to make sure I handle that -
&#x2F;&#x2F; If I try to check the &quot;openings&quot; and it&#39;s empty, we&#39;re done - I have to return false
&#x2F;&#x2F; Okay that was fruitful. Let me try a few more &#39;]}]&#39; isn&#39;t really different
&#x2F;&#x2F; &#39;{[{[&#39; okay so this has no closings. I ALSO need to make sure THIS returns false,
&#x2F;&#x2F; And I think I truly may have missed this case
&#x2F;&#x2F; I guess it was implied that I have a hanging return true at the end, but what I really have to do is check to make sure that the &quot;openings&quot; array gets completely emptied
&#x2F;&#x2F; And only return true if it does.
&#x2F;&#x2F; Okay crap, 50% done with time. Let&#39;s give this a shot
  &#x2F;&#x2F; One more weird case - what about an empty string? I don&#39;t have to worry about it because the string has at least one character
 
 
&#x2F;&#x2F; oh my godddddd
&#x2F;&#x2F; okay ten minutes to go. I got this.&#x60;

## Used the next 15 minutes to write this

&#x60;function isValid(str){
  if (str.length &lt; 1){
      console.log(&quot;based on my understanding of requirements, this should not have happened: case A&quot;)
     return false
  }
  
  let openChars &#x3D; &#39;[{(&#39;
  let closeChars &#x3D; &#39;]})&#39;
  let openings &#x3D; []
  let key &#x3D; {
    &#39;}&#39;: &#39;{&#39;,
    &#39;]&#39;: &#39;[&#39;,
    &#39;)&#39;: &#39;(&#39;
  }
  
  for (let char of str){
    if (openChars.includes(char) ){
      openings.push(char)
    }
    if (closeChars.includes(char)){
      let lastOpen &#x3D; openings[openings.length - 1]
      if (lastOpen !&#x3D;&#x3D; key[char]) return false
      openings.pop() &#x2F;&#x2F; lastOpen DOES &#x3D;&#x3D;&#x3D; the current char, so we can get rid of that opener and continue
      console.log(openings)
    }
  }
  
  if (openings.length){
      return false
  }
 
  return true
}&#x60;

## Reflections

I finished with 2.5 minutes to go and got a function that worked first try, which I feel really good about! I think that spending 15 minutes to calmly work through edge cases worked really really well. Normally I just start coding as think, and maybe this is more efficient in some ways —

I guess to be fair, I DID code some things as I went, which I think is a good idea.

Something I didn’t do is have a section in my leetcode that was actionable notes, which might have helped with organization.

I also think I did a good job of going with an available working solution instead of an eloquent solution. 30 minutes _really_ isn’t much time.

## Claude

I asked Claude how I could have improved things, and he suggested using Sets instead of strings, and using Maps instead of normal js objects. Those make sense and would be a great way to flex my understanding of these data sets (dishonestly, as I don’t use these too often at the moment), but don’t really seem that important.

What I did like was checking for even or odd numbered inputs for early returns.

He also suggested checking for closing brackets first…dont’ totally understand this approach:

&#x60;for (let char of s){
	if (bracketMap.has(char)){
		if (openings.pop() !&#x3D;&#x3D; bracketMap.get(char)) return false;
	} else {
		openings.push(char);
	}
}&#x60;

This switch statement suggestion is really interesting though:

&#x60;for (let char of s){
	switch(char)
		{ case &#39;(&#39;: case &#39;{&#39;: case &#39;[&#39;:
			openings.push(char);
			break;
		case &#39;)&#39;: case &#39;}&#39;: case &#39;]&#39;:
			if (openings.pop() !&#x3D;&#x3D; bracketMap.get(char)) return false;
			break;
	}
}&#x60;

---