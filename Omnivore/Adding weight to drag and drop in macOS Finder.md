---
id: f14334fa-dc38-11ee-9fa2-c7e55d57d44f
title: Adding weight to drag and drop in macOS Finder
tags:
  - RSS
date_published: 2024-03-06 21:00:35
---

# Adding weight to drag and drop in macOS Finder
#Omnivore

[Read on Omnivore](https://omnivore.app/me/adding-weight-to-drag-and-drop-in-mac-os-finder-18e171d03dc)
[Read Original](https://www.pbt.dev/blog/dragula/)



## Adding weight to drag and drop in  
 macOS Finder

 I made **[Dragula](https:&#x2F;&#x2F;github.com&#x2F;pbt&#x2F;dragula)**, a highly experimental extension to macOS that adds weight to one of the oldest user interface interactions ever: The Finder’s drag-and-drop interaction.

In the world of Dragula, when you drag a file (or files), you will find it easier if the files are smaller in size, and harder if they are larger in size. A small GIF is easy to drag; you can likely move one across the screen while barely moving your mouse. But you might find it nigh impossible to move a large file, like a movie or the Xcode IDE. 

Indeed, in the world of Dragula, _every drag-and-drop interaction involving files is weighted_: individual files, folders, and even Finder windows.

You can view the [source code](https:&#x2F;&#x2F;github.com&#x2F;pbt&#x2F;dragula), or read on below to see why I did this and how I did it.

## The unbearable weightlessness of drag-and-drop

Drag-and-drop has been a mainstay of personal computing since [it first showed up in the first Macintosh](https:&#x2F;&#x2F;folklore.org&#x2F;A%5FFloppy%5Fnamed%5Flsadkfjalhkjh.html?sort&#x3D;date?sort&#x3D;date). It’s easy to see why: We drag things around a lot in real life! Direct manipulation is incredibly powerful and intuitive. It’s so intuitive that there’s evidence we [spend more effort to move digital things that represent heavy real-life things](https:&#x2F;&#x2F;dl.acm.org&#x2F;doi&#x2F;10.1145&#x2F;2460625.2460650). Despite our world becoming more virtual, drag-and-drop is arguably the most powerful interaction it has ever been.

And yet, every drag-and-drop interaction is designed to feel the same, no matter what you’re dragging. That made me curious: I wanted to play around with the conventions of drag and drop a little bit and I wanted to see what that would feel like. Differentiating drag and drop based on file size seemed like a great first step.

(plus, I thought it would be silly)

  
![A man, with the icon for macOS Finder superimposed on top,
         is next to a scale. He is surrounded by his friends, attempting to explain why Xcode and the
         file for an emoji feel the same, despite having vastly different file sizes.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sD1TUrV08S6EpC3z97nEFtVtDfaQ9xWNhixXKTIN27-g&#x2F;https:&#x2F;&#x2F;www.pbt.dev&#x2F;blog&#x2F;dragula&#x2F;img&#x2F;weightlessness.png) 

“But Xcode’s heavier than emojis!” [With apologies to Limmy.](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;-fC2oke5MFg) 

## First sketches

From the get-go, my initial idea was to use macOS’ [accessibility APIs.](https:&#x2F;&#x2F;developer.apple.com&#x2F;documentation&#x2F;appkit&#x2F;nsaccessibility) In summary, accessiblity APIs are ways for assistive technologies, such as screen readers or adaptive controllers, to read what’s on the screen, know when the user interacts, and perform actions on behalf of the user. These APIs are key to implementing accessible alternatives to a mouse, keyboard, or display, but they are also used by utilities that augment the macOS user interface. For example, Rectangle uses the accessibility API to implement window “snapping” by reading your mouse position while dragging a window, and then to resize the window itself.

My initial idea followed from my experiences using Rectangle. When the user starts dragging a file, I would draw a fake proxy file on top of the icon. Then I could control the dragging interaction any way I wanted, since I would basically “steal” whatever was on Finder. (In retrospect, this seems a lot like the type of solution a React engineer would immediately reach for, doesn’t it?)

As I was bouncing this idea around the [Recurse Center](https:&#x2F;&#x2F;recurse.com&#x2F;) for a few weeks, we converged on a much simpler idea: Read the file size of whatever I was dragging, and then change the pointer speed as some factor of the file size. Not only was this much simpler, I knew it was workable because I knew of software that did this! Logi Options+ is an example of software that allow you to configure pointer speed via their UI and even remap the behavior of buttons. Once I could fit the pieces into my head, I felt motivated to implement it. My new game plan was as follows:

1. Intercept mouse events for file drag and drop
2. Use the Accessibility APIs to read the selection
3. Change the mouse sensitivity based on your selection

## Starting with dessert: Implementing mouse sensitivity changing

I woke up bright and early (10am, I think) on a Monday, ready to get started. Because I was supposed to learn Rust, I only wanted to spend a week on this, so I set a goal to have a workable prototype that I could demo on the Thursday of the same week. For those of you counting, that’s four days.

There was one hitch: I didn’t really know how to use Swift, the preferred language for interfacing with the foundational APIs of macOS, including the Accessibility API and the input device API I wanted to use. Web searches on Google seemed pretty dire, surfacing only the official API documentation, which was very inaccessible, especially for an accessibility library.

So I changed my search strategy: I looked up “macos open source mouse drivers” and hoped that I would find something. And then I found LinearMouse, a really great mouse driver utility. Best of all, they had wrapped the input device code inside an easy-to-use library that was also easy to move to my project. And it worked for every pointing device, not just one manufacturer’s product. Beautiful!

I found it really useful to start small. Once I had a sample app running with the pointer library, then I just tried changing it programmatically inside the code itself. Then I added the first bits of drag and drop, using code from Rectangle as reference. I also found it strangely useful to tackle things peripheral to the core functionality, such as the prompts to ask the user to enable accessibility permissions. But a day and a half in, and I still had not figured out how to actually read the Finder selection.

## Go off, (Apple)Script

AppleScript is an automation scripting language for macOS. It has been part of the platform for a while, so it’s rather capable. For example, you can do this to get the Finder selection:

&#x60;&#x60;&#x60;applescript
tell application &quot;Finder&quot; to get the selection
&#x60;&#x60;&#x60;

 This returns a list of files that looks like this:

&#x60;
{application file &quot;Xcode.app&quot; of folder &quot;Applications&quot; of startup disk
  of application &quot;Finder&quot;, application file &quot;Visual Studio Code.app&quot; of folder &quot;Applications&quot;
  of startup disk of application &quot;Finder&quot;}
      &#x60;
    
 You know, there was a world where everything looked like AppleScript. I think that world would have been kind of cool. But I didn’t know what to do with this. I was used to standard POSIX paths and C-style imperative programming, and so was everyone else. And documentation was very scant.

 I decided to use AppleScript to get the selection size directly. For those frantically searching, human or computer, here’s the code to do that that will return the selection size in bytes, including zero if there is no selection:

      &#x60;
set theSize to 0

  tell application &quot;Finder&quot;
  set theSelection to the selection as alias list
  repeat with theItem in theSelection
    set theInfo to (info for theItem)
    set theSize to theSize + (size of theInfo)
  end repeat
  end tell
return theSize
      &#x60;
    
_Spoiler alert:_ This is, however, not the code I actually ended up using. More on that later.

 To call AppleScript within my code, I wanted to use &#x60;NSAppleScript&#x60; but couldn’t figure out how to make that work. Instead, I shell out to &#x60;osascript&#x60; and read the output from the command line. _yeah._ 

## Getting ahead of myself

 The code that intercepts pointer actions is called an &#x60;EventTap&#x60;. It is essentially a global event handler. Those interested should mosey on over to the source code, because the full details are a little hairy for a blog post, but basically I could take my script code above, read the result, and then normalize it into a pointer resolution. Here’s the code that normalizes, by the way:

      &#x60;
extension Double {
  func toNormalizedResolutionValue() -&gt; Double {
    let slope &#x3D; (1995.0&#x2F;1242850962)
    return self * slope + 75
  }
}
      &#x60;
    
It’s probably bad practice to attach this functionality to &#x60;Double&#x60; itself, but I thought that was fun.

But, I was running into a curious issue: The AppleScript took the value of the _last_ selection I had, not the current one! So if I selected &#x60;Xcode.app&#x60; and then selected &#x60;Visual Studio Code.app&#x60;, it was taking the size of &#x60;Xcode.app&#x60; when I was dragging &#x60;Visual Studio Code.app.&#x60; 

Remember when I told you that the &#x60;EventTap&#x60; _intercepts_ pointer actions? As it turns out, my event handler ran _before_ the event had propagated to Finder and so it was reading the selection before the selection updated.

I solved this by getting the selection contents directly using the accessibility APIs (by checking for the presence of the &#x60;url&#x60; attribute on the element):

&#x60;&#x60;&#x60;reasonml

if !isMultiSelecting &amp;&amp; element.getValue(.filename) is NSString,
  let url &#x3D; element.getValue(.url) as? URL {
  &#x2F;&#x2F; ...
}
      
&#x60;&#x60;&#x60;

(shoutout to Swift&#39;s if-statements separated by commas and if-let syntax! i think Swift is such a neat language!)

But then I was finding it still too slow, especially for directories, and macOS does not like it when your event taps take too slow, since they block I&#x2F;O. So I learned I had to defer some operations to a background thread using&#x60;DispatchQueue.global&#x60;, and while not particularly thread-safe, this wasn’t really a concern of this code.

## Multi-select

At this point, I was ready to demo Dragula to the Recurse Center. I got a lot of enthusiastic feedback and was ready to work on all of the features that would really put a bow on top of what I got. Unfortunately, at this point, I had really ripped my hair out learning all the vagaries of macOS programming: the inconsistent documentation and Xcode itself. I was ready to drag Xcode straight to the trash.  
![trying to delete Xcode with Dragula enabled; but I can&#39;t drag it far because Xcode is really big.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;256x256,sW9m77kW4OtLboaqxrceeFy9XZw4GlJhs9Mghzyf7bpc&#x2F;https:&#x2F;&#x2F;www.pbt.dev&#x2F;blog&#x2F;dragula&#x2F;img&#x2F;xcode.gif)   

... Oh, right. Well, perhaps throwing things away is a drastic action. Instead I slept on it for a week, and after doing other stuff I dove back into it and implemented multi-select.

Remember when I said I ended up doing things differently? I found that in order to handle multiple selection it was important for me to synchronize the selection from Finder instead of reading it directly each time. That way I could compare selections to see if they had changed (when you drag, you always drag on a file handle, no matter how large the selction, so I had to keep track of whether or not I was dragging just one file or multiple.) Here is the code to retrieve all the paths in the selection, in POSIX format, separated by colons:

&#x60;&#x60;&#x60;applescript

set thePaths to &quot;&quot;

tell application &quot;Finder&quot;
  set theSelection to the selection as alias list
  repeat with theItem in theSelection
    set thePaths to thePaths &amp; POSIX path of theItem &amp; &quot;:&quot;
  end repeat
return thePaths
end tell
      
&#x60;&#x60;&#x60;

 After this followed, I made a cute lil icon, inspired by the namesake [_Drag-U-La_](http:&#x2F;&#x2F;www.munsterkoach.com&#x2F;franklin2.htm), added a UI (in SwiftUI!) to configure Dragula’s behavior, and put it onto GitHub.

## Conclusion: Don’t be a drag, just be a queen

 I had a lot of fun working on this project. It’s been the highlight of the Recurse Center for me so far. I didn’t know any Swift, a lot of the people I paired with didn’t know any Swift, and I was able to get this up and running in less than a week. It was the most [useless](https:&#x2F;&#x2F;ntietz.com&#x2F;blog&#x2F;write-more-useless-software&#x2F;) software I ever wrote.

Sometimes I have Dragula enabled, and drag a small text file, and it flies across the screen. And I haven’t stopped smiling at that.

How is it like to use Dragula? [Install it yourself and find out.](https:&#x2F;&#x2F;github.com&#x2F;pbt&#x2F;dragula) Maybe install it on a friend’s computer to prank them. But my hope is that at least one soul pokes around and learns how they can use the APIs I used to control computers in new, unexpected, fun ways.