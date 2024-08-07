---
id: cf8081a3-850b-487a-9f3f-b4a3b0287f5f
title: 3D Annotation
tags:
  - RSS
date_published: 2024-07-25 14:03:23
---

# 3D Annotation
#Omnivore

[Read on Omnivore](https://omnivore.app/me/3-d-annotation-190eb8972aa)
[Read Original](https://elijer.github.io/garden/Projects/3D-Annotation)



## Building a 3D Multiplayer Annotation Tool with Websockets and ThreeJS

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s4gdROJeAEIfsDf1sHMGlnaLQl2UX42zOxh2wEQXzWnc&#x2F;https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;Projects&#x2F;attachments&#x2F;backpack.png)

&gt; This is a screenshot of this project - you can see a video of it below

I met a backpack designer named David Eisenberg this week. I’m someone who carries a backpack with me whenever I venture farther than a couple of blocks from home, so I had a lot of questions. I am also someone who has sewed together enough bike frame bags (2!) to imagine how much I didn’t know on the subject.

David told me about sending design documents to factories overseas, mostly in Vietnam, and the extensive back-and-forth involved. Following my human urge to insert myself in someone else’s business in any way possible, I asked him, “if you could buy&#x2F;build any technology, what would help the process go more smoothly?”

David related emphatically that if both he and the sample designers he talked to could wear a VR headset, see the other point at things, and annotate parts of a 3D design in front of them, that would save a lot of time - maybe weeks on the month.

As a software engineer, this immediately sounded thrilling. Real-time interaction, 3D models.

But it _also_ sounded like a problem for which tools already existed, so I did a short search. I found something being heavily marketed to me called [Spline](https:&#x2F;&#x2F;spline.design&#x2F;), which looked feature-rich, and _did_ seem to have live collaboration capabilities. After trying it out, it seemed likely that after sitting down with David we might be able to find a way to use it. In any case, the first step was creating a 3D model, so I downloaded [Polycam](https:&#x2F;&#x2F;poly.cam&#x2F;) onto my phone, one of many free Photogrammetry tools out there, and got to work snapping photos.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sc1JaEgYipGPIbsdb3hiAwG3wY4G_vC9mGIVlQnEpsKE&#x2F;https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;Projects&#x2F;attachments&#x2F;spline.png)

&gt; A live view of a photogrammetry-generated model in Spline’s web app

&gt; “**Photogrammetry** is the science and technology of obtaining reliable information about physical objects and the environment through the process of recording, measuring and interpreting photographic images and patterns of electromagnetic radiant imagery and other phenomena” - Wikipedia.

When I refer to photogrammetry, I mean something slightly more specific than the Wikipedia definition above. I am referring to a process in which an object is photographed many times from many angles. The aggregated visual information across these pictures is then used to generate a 3D model with a mesh and textures.

I’m impressed by the lighting in Spline, and the fidelity of the model I created with Polycam in less than five minutes. Because Polycam is a free service, they cap the amount of photos they will analyze (150), and those photos were taken by a humble iPhone SE held by an amateur photogrammetrist. A professional photogrammetry model could be much more detailed.

I was _less_ impressed by Spline’s comment system, which didn’t seem to allow me to make notes that were anchored in space or clearly referring to points on a model.

With the model in front of me, the idea felt much more tangible, so I opened up my IDE and starting writing some code to see if I could at least render some pixels on a screen. I started with a simple file uploader that could take the 3D GLB files that Polycam creates.

---

## The Code

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sQp0OckKcCjPMDaegOWd1G-nCzjc55zsKIqLmVHmnh_0&#x2F;https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;Projects&#x2F;attachments&#x2F;upload_form.png)

It sent off the uploaded files to a middleware package I installed with &#x60;npm&#x60; called &#x60;multer&#x60;, allowing me to serve some file storage directory from the server:

&#x60;app.use(&#39;&#x2F;uploads&#39;, express.static(path.join(__dirname, &#39;uploads&#39;)));
 
 
const storage &#x3D; multer.diskStorage({
	destination: (req, file, cb) &#x3D;&gt; {
		cb(null, &#39;uploads&#x2F;&#39;);
	},
	filename: (req, file, cb) &#x3D;&gt; {
		cb(null, Date.now() + path.extname(file.originalname));
	}
 
});&#x60;

Next, I created a post route that would take an upload and used websockets to broadcast the location of the newly uploaded file to all connected clients.

&#x60;&#x60; app.post(&#39;&#x2F;upload-3d-model&#39;, upload.single(&#39;file&#39;), (req, res) &#x3D;&gt; {
 
	if (!req.file)return res.status(400).json({ error: &#39;No file uploaded&#39; });
 
	const fileExtension &#x3D; path.extname(req.file.originalname).toLowerCase();
	
	if (fileExtension !&#x3D;&#x3D; &#39;.gltf&#39; &amp;&amp; fileExtension !&#x3D;&#x3D; &#39;.glb&#39;){
		return res.status(400).json({
			error: &#39;Invalid file type. Only GLTF and GLB files are allowed.&#39;
		});
	}
	
	res.json({
		message: &#39;3D model file uploaded successfully&#39;,
		fileUrl: &#x60;http:&#x2F;&#x2F;localhost:3000&#x2F;uploads&#x2F;${req.file.filename}&#x60;;
	});
 
	io.emit(&#39;modelUploaded&#39;, { fileUrl });
 
}); &#x60;&#x60;

Finally on the client, I used ThreeJS to render the file on the frontend:

&#x60;async function renderGLB(fileUrl) {
	const loader &#x3D; new GLTFLoader();
	loader.load(fileUrl, (gltf) &#x3D;&gt; {
		scene.add(gltf.scene);
		camera.position.set(0.08, 1.2, .7);
 
		&#x2F;&#x2F; Raycaster for detecting cursor position on the model
		const raycaster &#x3D; new THREE.Raycaster();
		const mouse &#x3D; new THREE.Vector2();
 
		let lastEmitTime &#x3D; 0;
		const emitInterval &#x3D; 10
 
		function onMouseMove(event) {
		
			mouse.x &#x3D; (event.clientX &#x2F; window.innerWidth) * 2 - 1;
			mouse.y &#x3D; -(event.clientY &#x2F; window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
		
			const intersects &#x3D; raycaster.intersectObject(gltf.scene, true);
 
			if (intersects.length &gt; 0) {
				const intersect &#x3D; intersects[0];
				const currentTime &#x3D; Date.now();
 
			if (currentTime - lastEmitTime &gt;&#x3D; emitInterval){
				socket.emit(&#39;cursorPosition&#39;, {
					playerId: playerId,
					x: intersect.point.x,
					y: intersect.point.y,
					z: intersect.point.z
				});
 
				lastEmitTime &#x3D; currentTime;
			}
		}
	}
 
 
	window.addEventListener(&#39;mousemove&#39;, onMouseMove, false);
  
 
	const animate &#x3D; function () {
		requestAnimationFrame(animate);
		controls.update(); &#x2F;&#x2F; Update controls
		renderer.render(scene, camera);
	};
	
	animate();
 
}&#x60;

&gt; There is much more code than these three examples, but hopefully these tell most of the story

---

## The Result

It’s miles from the fully realized vision, but for a day’s work I’m happy with this is a prototype!

 Your browser does not support the video tag. 

In the JavaScript above, I calculate the intersection between the user’s mouse and the model. Then I send those coordinates to the server. What isn’t clear from the video above is that on the server, those mouse updates are getting saved to an object of mouse updates associated with players, allowing players, in theory, to see the live cursor location of another user:

&#x60;socket.on(&#39;cursorPosition&#39;, (data) &#x3D;&gt; {
	clients[data.playerId] &#x3D; {...clients[data.playerId], ...data}
	socket.emit(&#39;cursors&#39;, clients)
});&#x60;

This…sort of worked. When I opened up two tabs of the project, it seemed like the javascript execution was paused until that window was active. This made it hard to tell how it would behave if two people opened it on separate machines.

&gt; This behavior isn’t consistent with another [websocket project of mine](https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;Projects&#x2F;Eco-Mog), making me wonder if there’s an issue with my websocket logic.

I went ahead and deployed it so I could try to test this functionality between my computer and my phone.

---

## Deployment

Once I deployed, I realized that for my server’s file server to work, I needed to configure a Docker volume. This should be pretty easy in theory, but I also realized that I was so excited to jump into the project, I hadn’t really thought about the best file storage solution. When I considered this, I discovered some pretty basic questions about what architecture to go with:

* Save the files on the server, or use a file storage platform like S3?
* How should I direct users to various files? Should I start with one global file, since it’s just a prototype? Or create a route for each new file? If so, is it necessary to display a directory of uploaded files, or just let users save the URL somewhere for now?

Much of the Sunday was gone at this point. Like it often does, it seemed twenty minutes past the ideal moment to pause and go on a bike ride, so I closed my laptop and left these questions for a later time.

---

## Reflections

With websockets and careful spatial math, I could build this into a useful object annotation tool. While working on it, I realized that the things I would like to improve are:

* Use routing so that links can be created for multiple 3D objects
* persist those objects in storage
* persist the comments about them, too, in a database
* Route socket activity into distinct “rooms” so that different conversations can happen about different objects simultaneously

**Next.JS** paired with **Firebase Storage** and **Supabase** or **Firestore** would be a good stack to get V2 up and running.

As far as solving the problem I set out to solve, I would like to spend more time with existing tools. But if I find an existing tool that works for David, it will still be tempting to create this because of how fun the challenge of working with multiplayer data is!

I had a conversation with a pair of entrepreneurs the other day, and one of them brought up a good question that’s worth pondering for any project in danger of taking longer than a Sunday:

“Did this exist two years ago? If not, why?”

Thanks for reading!

---