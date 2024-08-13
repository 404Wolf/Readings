---
id: f1e47355-727a-46c2-81de-4f4cafdb47ee
title: 9 Ways to optimize a Node Webapp
tags:
  - RSS
date_published: 2024-07-25 14:03:23
---

# 9 Ways to optimize a Node Webapp
#Omnivore

[Read on Omnivore](https://omnivore.app/me/9-ways-to-optimize-a-node-webapp-190eb897047)
[Read Original](https://elijer.github.io/garden/Dev-Notes/Javascript/9-Ways-to-optimize-a-Node-Webapp)



![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sOhUl_kmXQmNcaHnxysMnklraXrJ_IlcdyMnb9tNNtIk&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;3f89be910009459066e2e7f874ede5ec.jpeg)

_Lessons I’ve learned on optimizing the performance of web applications while building a multiplayer game with websockets_

## 1) Browser Profiling

The browser has a wealth of tools that allow us to peek into our application. I’ll be focusing on the Network and Performance tabs of Google Chrome, but I suspect this is just the tip of the iceburg.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,swI5yoA9NxbRmDgxtWpYV6A3LTAo8fdnwi7pV4H_i3MM&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;b4d14ef00dc64ab4ec6395c14dc5d286.png)

## A) The Network Tab

I was familiar with this tab before this project but hadn’t drilled down to the sizes, compression, and load time of each individual request. In fact, I hadn’t totally comprehended how this list of requests encapsulates a truer representation of my project than the IDE does, because here I can see the order of execution of not only my code, but all of the dependencies my project relies on to function. For example, I can see how Vite is bundling my JavaScript, HML and CSS files, and then chunking it. I can also see every google font I am requesting, and every npm package.

For example, we can see the entirety of the Socket.io library being installed from NPM here:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sv_OZwTZVHrjZhNKMWE1NqjOBpNP_3BCe4PuQIaI7cwU&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;1ca5de826ab04e931dc1916c65fe3fb4.png)

We can see the browser requesting every part of the THREE.JS library it needs _here_:![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sejPGHrwO0O87dJ1kYwHdqbAXnIbmGsEyvHzo3BIPMzo&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;5962702e1635baeb476980e3bc17a50f.png)

Next on our tour is the timing window, where we can see how long each step of a script takes:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sdi-gVyxLQcuoMGjXQgG9Ou7-EEF34deaQYgmujcgMQY&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;9c935991ed7945d34c4fa28184cfba19.png)

&gt; This is ThreeJS again ^

Chrome also provides a helpful visualization of all messages sent over websockets, which can be zeroed in on by clicking the websocket filter![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sGsZ-EQSj4VYHEHcrQMlJKH0LEKi3gwkJmw8qTRJrBqc&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;58ae12bbd5f5d279031510329a7690c1.png)

And allow us to see a play-by-play of the messages sent on a particular WS channel:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sdLoFidXOy9-d3IliPlyW6P-ug5TYfhn2w8yoo3gRoMw&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;dc74072f6907ee2a6b6a3e0d269fb8e9.png)

## B) The Performance Tab

As powerful as the network tab is, the performance tab is like a spaceship. When I first opened this, I was so overwhelmed it didn’t even seem like it contained any useful information. As I’ve used it more, I’ve learned that it’s a swiss-army knife that can be used in a variety of ways.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,siqMIYApB9UMkTtWlB7rEKDnZCX9TCbKbQQR4-OsCo_E&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;de4a8c4372d8b855644c773ab15fed40.png)

When zoomed in, it shows every process run on a website.![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,ssadWU1SYc0rwJnD1Iw_RnOniFKqk2G2FUdphYjOgj3k&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;d7ad0a484da94b5b0b5af38148f7cce8.png)Those processes can be cross-referenced with still taken from renders of the website displayed in parallel, above them:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sY0Bla7sWImf08G1rdMuPLRW0wBqt0cQDzDfKHzWVLt0&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;5ff73eaa143ac9e7a4e267eb9be560a8.png)

And each process can be clicked on in order to understand the exact sub-processes that it triggers and is dependent on and has relationships with, how long each one took, how much memory, how much CPU.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sZfNBauq2DwDzTQxQWXgKTjC4eUdKaqnNXNXXcw5Bp6I&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;752df6d741558332f634b40a6fd0f1e0.png)

It’s great for:

* Zooming in on a particular event in an application
* Investigating what order functions are called in the event loop
* Discovering memory leaks using the graph of memory and other performance metrics
* Seeing when garbage collection takes place (or doesn’t)

## 2) Serverside Profiling

We’ve looked at a lot of profiling in the client, but it is also possible to profile the server. In order to start this process, [run your server file with the \--inspect flag:](https:&#x2F;&#x2F;nodejs.org&#x2F;en&#x2F;learn&#x2F;getting-started&#x2F;debugging):

&#x60;node --inspect index.js&#x60;

You should see some output that looks a little something like:

&#x60;Debugger listening on ws:&#x2F;&#x2F;127.0.0.1:9229&#x2F;7825c3f2-d5c0-4c44-b6fe-dbb616650ae7
For help, see: https:&#x2F;&#x2F;nodejs.org&#x2F;en&#x2F;docs&#x2F;inspector&#x60;

&gt; I’m not really sure what this output is about to be honest. When I navigate to the supplied URL, I don’t see anything.

Next, we navigate to chrome:&#x2F;&#x2F;inspect, and press “inspect” on our remote target,

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sUwagxd8BuEHcQ-nTLG1vOmIhk_DMXfiZ8SxHcf80dfI&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;dead2b731075e1026f59c5cb4d1b616d.png)

providing us with a profiler window much like what we have seen on the client:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sGHKD0iTFnwD0UWGIf8yXAV5rcCFZTTSGm0C7AZhhNI4&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;8184e4b31674071968da29460507e3bd.png)We can record activity in the Performance tab just like we’ve been doing in the client as well, and see the slew of events being recorded.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sP_WoGEQkyiJ7ilt2bXWxYjm-73vdEnayUZP1lFcWlrQ&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;10bfbca80c28e46ff98d07ef25c566f9.png)

Which is amazing because I can zoom in to see exactly how long each of my methods take to run in the call tree:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sgNXSjjnnpB-FLmq7pIq2lThHwZ4UHWOlyFTEfoad-iU&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;a4b8bb9e24a825c52149a5023d4bdf82.png)

&gt; Zoomed in view of the event stream

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNBvMsN0DXGyLVo1_2mKnjKfsV2AaIl9_BQ0dw3mAwk8&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;f37e130193a54e2d6202e85c771989d7.png)

&gt; The call tree that makes up my &#x60;getState&#x60; function

## 3) Automated Testing

You might benefit from automated browser testing if you:

* your roommate is out and can’t test your site
* are developing carpal tunnel syndrome from repeatedly typing &#x60;localhost:5163&#x60;

My tool of choice is called Playwright, which I was introduced to by the excellent [James Watters](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;james-watters-tech&#x2F;)when I worked at [Tcare](https:&#x2F;&#x2F;www.linkedin.com&#x2F;feed&#x2F;). Playwright is a well-documented, asynchronous testing framework for the browser performance of Python, Java, Net and Javascript webapps.

It supports all major browsers, it has a wonderful recording featuring that will get you started by generating code based on browser interaction, and it has a nice profiler that allows a test to be “rewinded” and explored later on.

It also allows for tests to be run in parallel, which I have taken full advantage of to stress test my application.

 Your browser does not support the video tag. 

What slowly became apparent was manually testing my application was not empirical enough. By nature of being human, testing my application introduced too many unknowable or unquantifiable independent variables to compare different architectures or configurations with the certainty that I wasn’t in fact comparing some inconsistency I had introduced.

It also became clear that just pressing a few buttons as a single user in this game I’ve created is a narrow inadequate test . Only under heavy load and the strange edge cases that can be created by twelve, or even twenty autonomous agents, can I quickly and reliably discover weaknesses in my code.

For example, I attempted to batch the update events emitted by my server to every client, and quickly found that collapsing the updates of a single entity into the most recent event caused all sorts of issues that weren’t apparent when only one person was playing.

For example, each rendered cube in my game has an ID that links it to an object in the state stored in the memory of the server. If the updates that I batch include something like this:

&#x60;updates &#x3D; [
	&#39;object-09ua9u&#39;: [...],
	&#39;object-08uaus&#39;: [...]
	&#39;object-a89273&#39;: [
		&quot;create&quot;: {x: 2, y: 3},
		&quot;move&quot;: {x: 2, y: 4},
		&quot;delete&quot;: null
	]
]&#x60;

And I remove all but the most recent command, all sorts of bad things are liable to happen, the most obvious of which being that the frontend will try to delete an object that it never was given a command to create to begin with.

In the end, testing with playwright has saved me a lot of time and hassle and provided me with the first real clear performance metrics I had in this process. I wish I had started doing this on the first day.

One challenge I have faced is outputting metrics aggregated from each test instance. My scrappy solution was building a test server than can receive memory usage gathered by each test and print out the average.

&#x60;&#x2F;&#x2F; Start memory usage collection
 
const intervalId &#x3D; setInterval(async () &#x3D;&gt; {
	const memory &#x3D; await page.evaluate(() &#x3D;&gt; {
		const performance &#x3D; window.performance as Performance &amp; { memory?: any };
			if (performance &amp;&amp; performance.memory) {
				return {
					jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
					totalJSHeapSize: performance.memory.totalJSHeapSize,
					usedJSHeapSize: performance.memory.usedJSHeapSize,
				};
 
			}
 
		return null;
 
	});
 
	if (memory) {
		memoryUsageData.push(memory.usedJSHeapSize &#x2F; 1024 &#x2F; 1024); &#x2F;&#x2F; Convert bytes to MB
	}
 
}, 1000); &#x2F;&#x2F; Collect data every second
 
...
 
await fetch(&#39;http:&#x2F;&#x2F;localhost:3088&#x2F;report&#x2F;&#39;, {
	method: &#39;POST&#39;,
	headers: {
	&#39;Content-Type&#39;: &#39;application&#x2F;json&#39;
	}, body: JSON.stringify({ avgMemoryUsage, maxMemoryUsage, minMemoryUsage})
})&#x60;

In the future I would like to check out a load-testing library called [artillery](https:&#x2F;&#x2F;www.artillery.io&#x2F;) and to investigate better ways to log test results.

## 4) User Testing

I happened to be in a room full of people so I walked around and just told them to try out my live demo.

 Your browser does not support the video tag. 

&gt; User testing is the most indispensable performance testing tactic of them all, but it’s an even better _design_ tactic, as it allows you to see what human beings actually respond to about what’s being created.

Playwright is great, and so is automated testing, but it has some weaknesses. If I tell playwright to open up 24 chromium instances on my brave little Macbook Air, I’m not really testing concurrent connections anymore. I’m just overstepping the reasonable memory limitations of my computer, and no longer getting very meaningful results.

This is the perfect example of how tests in at least an exact copy of the production are the only way to truly know the performance of an application. This includes user behavior - users do unexpected things without exception, and I don’t believe it’s possible to forecast the effect user behavior will have on performance, especially in something like a multiplayer game. It’s a far more effective use of time to observe and take notes.

Like Tommy Caldwell on pitch 15, you can build an exact replica of specific, significant performance challenges you see out in the world. You can try to solve them in every possible way in a controlled environment, and see if your results check out.

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sIKNAMiU8AadlbCkCdZ_UFv0ghqrWB-c1SQzvH2ysdfc&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;f13da2561c3c1c516a84c481c970e7ca.png)

&gt; Photo by [Becca Caldwell](https:&#x2F;&#x2F;www.instagram.com&#x2F;beccajcaldwell&#x2F;?hl&#x3D;en)

## 5) Server Logs

It’s a little embarrassing, but until last week I really can’t say I understood how &#x60;logging&#x60; as a concept was distinct from &#x60;console.logging&#x60; in JS or &#x60;print&#x60; in python.

Somewhere in between that first &#x60;Hello World&#x60; and the situation in which I was setting up cloud watch alerts on the log for an EC2 instance at my job, I had an opportunity to ask “What is the fundamental makeup of these pieces of text, and how are they different than one another?” And I never really did that.

During this project, I’ve checked the logs of the running processes of the community server I’m using. Chaotically, these logs are shared by about ten different projects. I have to admit, I like this - it makes visualizing the community server’s activity dead simple. It’s one server, it’s serving a dozen projects, and this is what it brain looks like.

But if you see this long enough, and you start to think, “there must be a better way”. Something along the lines of, I dunno, what if we just concatenated these lines of text into a file, but maybe separate files. That way they’d:

* Persist
* Be separated into meaningful streams of information

Since we could ostensibly format the text ourselves, we could really reform the text to have any timestamp conventions we want, any indentation, etc. Whatever was easiest for us to read, really.

And you start to think, well, if I don’t trust the persistence of the server, I could save it to a database. Or even to another server. Or I could even email things to myself - it’s logging, not a web protocol. The information should be structured and transmitted in the ways that are most valuable for debugging.

So you write something like this to get started:![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,seqafH3XnPeKV-d1mr89BPU_QYbPXCjK0jQoTEdFORtw&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;76320a2bae2bf78e52e8b142d2a4289f.png)

And think, cool, now the next time my server crashes, I’ll know why.

## 6) Unit Testing

Testing individual functions for performance seems like a good idea - one I have not yet done. I would imagine the browser profiling tools may be able to help with some of this, automated testing tools could to, and there may also be tools that allow this to be done inside of an IDE. What I imagine is something that catalogues every method and records how long it takes to run on average over several instances.

## 7) Architecture Audits

Originally, I sent the entire board state of my game both:

* From the server to the client
* From the client to server

It was a lot of network overhead. I changed this architecture to _only_ send updates of individual entities. In the profiling section, I also mention an attempt at batching some of these updates (with less success so far). Both of these changes represent ways that the interplay between client and server could be made more efficient.

It’s important to validate these things before enacting them. I’ll admit, I did this refactor on a hunch. My refactor saved about 14MB of unnecessary data being sent with each request. This is nice, but it took me about a week.

I paired this refactor with re-using rendered geometries and meshes on the frontend rather than tearing down every object in the scene and re-instantiating it.

Even together, the combined performance gains of these refactors are humble.

However, they are definitely a better design, and had I been more experienced at this interplay of a 3D-ish world being synchronized over websockets, I might have designed it from the beginning.

Some other architectural &#x2F; data model changes I’d like to explore:

* Locality: limiting updates to players within a certain range of those updates
* A sparser representation of initial state
* A sparser representation of _all_ state, possibly using raw binary instead of unicode

What I’ve learned from these architectural changes is that architectural refactors are costly in terms of time, and it’s prudent to profile prototypes of these changes. Doing this research up front can make sure that time is being used to solve tangible performance issues.

## 8) Pairing

Sometimes the best way to break down a complex pipeline, application, or interconnected set of any sort of processes is to walk someone else through it. In the process, it seems common to realize new perspectives on what was built. The person we walk through this process almost always can offer some additional novel perspectives as well.

I was lucky enough to pair with [Robin Neufeld](https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;robin-neufeld-2b4847a4&#x2F;?original%5Freferer&#x3D;https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&amp;originalSubdomain&#x3D;ca) on this project. I was straightforward about my optimization goal was:

_allow about 10 people to join and play the game without experiencing noticeable lag_

And that although I could think of many potential performance improvements, I didn’t know which one would be the most productive in achieving my goal. However, after walking her through all the tools I had at my disposal for assessing different techniques, I feel a lot closer to understanding how my goal could be achieved.

&gt; A list of the most promising optimizations I could implement

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,skKPcrfe5fO4VvY_EwaEGiWyqt67R5-CYR_QKCNn7vSE&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;69efc5f5792c38308e28009287830215.jpeg)

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sx_2OYZ6dysSH7hCbZloE41oU4xEjY1HJ6nkLlGp52a8&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;60c018f203303a4425f95de54dde2942.jpeg)

&gt; A scrappy list of why I might experience performance issues in certain situations

Robin took a very stress free dive into profiling tools and just sort of opened up my ability to interface with these tools. I was very driven and specific in how I wanted to use them, but Robin was not, and consequently seemed to play around with them a lot more, discovering a lot of the features about these browser profiling tools I have documented above.

Most importantly, Robin kept me on track, not allowing me to dive into rabbitholes that weren’t yet validated as worthwhile.

## 9) Comparisons of Environment

Some examples

* Different Deployments
* Different Machines
* Different Browsers
* Different Node Versions

The bottom line is, consider the assumptions you are making about the universality of the environment you are running your code in and explore how it behaves in as many other environments as possible.

The local &#x2F; remote comparison is one of the most important. I’ve become a very big believer in deploying early, since a deployed environment and the considerations that come with it are often dramatically different than a local environment. Learning lessons in this early in a project’s lifecycle can sometimes change the architecture of a project in ways that will be difficult to implement later on.

I am a full-stack web developer with no formal CS training. I started with frontend javascript web frameworks for the most part, moved on to server-side development mostly in the very abstract languages of Javascript and Python, and then eventually began to engage in Devops almost exclusively with highly abstracted cloud service products. Only recently have I begun learning about the low-level components that power these things, like distributed computing, memory-safe languages, virtual memory, web protocols, and a slew of technologies closer to the actual hardware powering the abstractions I’ve grown so familiar with.

From this perspective, it’s a bit easier to ignore the differences of different server setups. But I’m coming to realize that understanding the base hardware, or at least the architecture of the distributed or server-less service being used, is crucial to understanding what my performance expectations should be.![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sDFjYFU6L8VKPvEXcKFnVjmXq2yHM6It8iJyQLFL-rYU&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;2b817e57449169bff96c9bdf0c9aafd1.png) ![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sEO2iunAJoViJHjfLv00aqZhFJCNuIqbzP57DuGWFQBY&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;25b15f7299eaaf14a1870f5431c8c0a4.png)

All deployment examples you’ve seen so far are run off of a raspberry pi in the next room that is serving about fourteen other fun projects:

![image](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sCjBZ5IlL430Lp7wSYDBJJqdNJRQZZ5IzVOgCQtY9FZ8&#x2F;https:&#x2F;&#x2F;thornberry-obsidian-general.s3.us-east-2.amazonaws.com&#x2F;attachments&#x2F;ccc5d1d3d97deee0289c571427268598.png)

It’s a great solution because these projects are mostly pretty small in scale, and don’t usually deal with simultaneous traffic, as they are generally demo’d and tested at different times.

However, it’s obviously not the most robust server solution! So even after all this optimization work, my expectations can only be so high.

In the future, I really look forward to using these tools to understanding the performance tradeoffs of many other types of deployment solutions, memories, data structures, and architectures. I set out to make a fun game, never knowing that the performance hurtles I discovered would teach me far more about programming than the game logic or network protocols ever would.

---