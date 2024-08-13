---
id: 6d215fc2-a764-437e-ba63-f239cc5c2647
title: Quartz
tags:
  - RSS
date_published: 2024-07-29 19:03:47
---

# Quartz
#Omnivore

[Read on Omnivore](https://omnivore.app/me/quartz-19100fd0694)
[Read Original](https://elijer.github.io/garden/Dev-Notes/Quartz/Blogging-with-Quartz)



I was telling my brother about this complicated blogging website I wanted to build from scratch using Firebase and Next.js and he said the sensible thing which was, why not use something that already exists so you can start blogging today instead of like, months in the future if ever?

Actually, he was more specific. He knew I used a note management tool (and really this entire ecosystem) called Obsidian. He wondered if there was an easy way to host an obsidian vault - essentially, take the way I already preferred to take my notes, and just host THAT online rather than creating some entirely new knowledge management system.

## Obsidian

This is what it looks like to create this page in Obsidian:![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3uBi3WfitAzCfySIHFolYsdo5Et0H6ZBw5uCnLmlqvM&#x2F;https:&#x2F;&#x2F;elijer.github.io&#x2F;garden&#x2F;Dev-Notes&#x2F;Quartz&#x2F;attachments&#x2F;obsidian.png)

Turns out this is very doable! There seem to be a few amazing individuals who have created ways to do this. My favorite that I’ve found is Quartz.

I was initially introduced to it by [Brandon Boswell](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;ITiiuBNVue0)s videos. I tried following along, but the video was made in 2022 and it’s currently 2024, and either some of the steps are a little too out of date or his system is simply way more complicated than I need. What I found was that Quartz has excellent documentation and if followed, it basically did everything I needed to do.

I was really impressed by it, especially by:

* Very fast full text search
* Popovers on links
* Even an inclusion of Obsidian’s really cool graph interface of notes as connected “nodes” in a web!
* A bunch of other very thoughtful ways of allowing other people to interact with and explore your notes online

Jackie Zhao (the creator) also included really thorough instructions for how to host it.

[Here is a slide deck I made on this subject](https:&#x2F;&#x2F;docs.google.com&#x2F;presentation&#x2F;d&#x2F;1HjHMMQKTTBXssgJJJ18iAJ-7NLZbyfE57Tye1mL%5FgiM&#x2F;edit?usp&#x3D;sharing)with some pretty sweet midjourney images of various animals astronauts.

## Setup Quartz (Brief)

1. [fork this](https:&#x2F;&#x2F;github.com&#x2F;jackyzha0&#x2F;quartz) and clone it locally with &#x60;git clone &lt;the address of your new forked repo&gt;&#x60;
2. &#x60;cd&#x60; into your new local repo and run &#x60;npm i&#x60;
3. run &#x60;npx quartz create&#x60; if you want help populating your content folder - you can also do this manually in any way you wish, just make sure there is an &#x60;index.md&#x60; file in the directory you end up serving with the…
4. &#x60;npx quartz build --serve&#x60; command, which also takes other flags, like &#x60;--directory&#x60; if you’d like to specifically a subdirectory inside your Obsidian Vault. You should be able to see your quartz site locally at &#x60;localhost:8080&#x60;!
5. Go to the &#x60;quartz.config.ts&#x60; file and change your &#x60;baseUrl&#x60; to whatever the baseUrl is going to be for your hosted site.
6. \[Create a deploy.yaml file as instructed here\](npx quartz build —serve) - make sure to save and commit it.
7. Head to your forked repo &gt; settings &gt; pages &gt; Source and select &#x60;GithubActions&#x60;
8. Make sure you don’t have some OTHER repo using your github page (at &#x60;your_github_username.github.io&#x60;), or this won’t work
9. Run &#x60;npx quartz sync --no-pull&#x60;
10. Head to &#x60;your_github_username.github.io&#x60; and behold, your site!
11. Whenever you want to sync after this, just run &#x60;npx quartz sync&#x60;

## Setup Quartz (Verbose)

1. _Essentially_, follow the [getting started steps here](https:&#x2F;&#x2F;quartz.jzhao.xyz&#x2F;), but I will be enriching them with my own instructions. For example, the instructions don’t recommend forking and instead instruct the user to clone the repo and then change the &#x60;origin&#x60; remote manually, but then neglect to mention that you need to push a tag to your &#x60;origin&#x60;. Whereas if you fork it, none of that is necessary and there are fewer steps. Go to the [quartz repo](https:&#x2F;&#x2F;github.com&#x2F;jackyzha0&#x2F;quartz) and fork it | Note: If you want to _practice_ doing this, keep in mind you can only have one fork per repo per user, so you’ll have to unfork your &#x60;practice&#x60; version when you do the final fork - possibly by cloning or deleting it. You can also clone the repo, but you need to make sure you get the upstream, origin, and tags all right (just make sure you have the v4 tag, which is used later on)
2. Clone your forked version of the repo locally
3. Run &#x60;npm i&#x60; to install all the &#x60;npm&#x60; modules needed
4. If you want any help populating some helpful starter content in your quartz project, copying your files from an existing Obsidian directory, or even symlinking them, run the &#x60;npx quartz create&#x60; utility and you will have an option to choose one of these options. I recommend using this utility and choosing the &#x60;Empty&#x60; option, which actually creates a sort of helpful &#x60;index.md&#x60; which has useful boilerplate, including minimal [frontmatter](https:&#x2F;&#x2F;quartz.jzhao.xyz&#x2F;authoring-content). You can also choose to _not_ use the &#x60;npx quartz create&#x60; utility which is fine - just keep an eye out for a message about creating an &#x60;index.md&#x60; file later on when you are building and serving your quartz repo. Without this index file, the main page of your quartz site will show a &#x60;404&#x60;.
5. We can try serving this thing locally now to make sure we’re on the right track with &#x60;npx quartz build --serve&#x60;. You should see your site at the URL printed out! This could be a good time to tinker with the possibility of modifying the &#x60;quartz build -- serve&#x60; command with the &#x60;--directory&#x60; flag, which I have personally found useful to _only_ build my public quartz blog out of _some_ of my Obsidian vault. Like, it seemed nice to have a public and a private folder in the vault so I could easily drag stuff in and out of the public eye as needed while still allowing private stuff to reference public stuff. I will say that there are other ways to prevent certain vault documents and directories from getting deployed, [which are documented here](https:&#x2F;&#x2F;quartz.jzhao.xyz&#x2F;features&#x2F;private-pages). This can be achieved simply with, say, using &#x60;quartz build --directory content&#x2F;public --serve&#x60;. Note that this is the same command that is eventually referenced inside the &#x60;deploy.yaml&#x60; file used for hosting, so if you add any flags like this to it, you’ll have to change it in the &#x60;deploy.yaml&#x60; file as well to get that configuration on your hosted site. Or you could just add it to your &#x60;package.json&#x60; file as a command and reference that single command in both places to simplify your life.
6. This is a good time to open your &#x60;quartz.config.ts&#x60; file and read about the [configuration options available](https:&#x2F;&#x2F;quartz.jzhao.xyz&#x2F;configuration). Perhaps notably, you’re probably going to need to change your &#x60;baseUrl&#x60; config field to your hosting URL. Otherwise you’re going to have issues with hosting. This field is going to be &#x60;&quot;quartz.jzhao.xyz&quot;,&#x60; by default. Since I am hosting with Github Pages, then I changed mine to &#x60;&quot;elijer.github.io&quot;&#x60; for example. But checking out all your configuration options is probably going to be helpful in some way or another as a preemptive step to creating the quartz site you want.
7. Okay we’re serving this thing locally, we’ve poked around in the config a bit, it’s time to host. Before we do that, we have to make sure our changes are synced with github - this is because ultimately, to host, we’re going to be deploying whenever we push to our github repo, so having that repo set up is the first step. The good news is that if you forked the repo instead of cloned it, you should already have a forked repo, which your local repo should point to as &#x60;origin&#x60;, while also still pointing to the official quartz repo as &#x60;upstream&#x60; so that you can always benefit from updates further down the road. That said, the &#x60;Setting up your GitHub repository&#x60; step on the quartz blog lists some steps you can take to make sure all this is in order. Simply run &#x60;npx quartz sync --no-pull&#x60; to do the initial push of your content to your repository.
8. The Quartz documentation outlines [a few different hosting options](https:&#x2F;&#x2F;quartz.jzhao.xyz&#x2F;hosting) \- after all, it produces a static bundle of HTML, CSS and javascript that be served directly to the browser - but this guide will be focusing on GitHub pages, mostly because it’s free.
9. Create a new file here: &#x60;quartz&#x2F;.github&#x2F;workflows&#x2F;deploy.yml&#x60; with this content, and don’t forget to save and commit this new file, or the action won’t run when you sync!

&#x60;&#x60;&#x60;yaml
name: Deploy Quartz site to GitHub Pages
 
on:
  push:
    branches:
      - v4
 
permissions:
  contents: read
  pages: write
  id-token: write
 
concurrency:
  group: &quot;pages&quot;
  cancel-in-progress: false
 
jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions&#x2F;checkout@v3
        with:
          fetch-depth: 0 # Fetch all history for git info
      - uses: actions&#x2F;setup-node@v3
        with:
          node-version: 18.14
      - name: Install Dependencies
        run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions&#x2F;upload-pages-artifact@v2
        with:
          path: public
 
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions&#x2F;deploy-pages@v2

&#x60;&#x60;&#x60;

1. Go to the settings on your forked repository (not for your account or anything else), head to the &#x60;Pages&#x60; section, and under &#x60;Source&#x60; select &#x60;Github Actions&#x60; instead of the default option, &#x60;Deploy from a Branch&#x60;. This just means that the github workflow in the previous step will be able to deploy to pages. | Note: You can only have one github page at a time, so if you have another active this won’t work until you get rid of that github action. If you suspect this is the case, go to the same section of settings for _that_ repo, and you should be able to see if that’s the case - there will be a message at the top that’ll tell you that github pages is live if, in fact, it is.
2. Now just run &#x60;npx quartz sync&#x60; from within your local repo and this should deploy to your site, making it live at &#x60;&lt;github-username&gt;.github.io&#x2F;&lt;repository-name&gt;&#x60; after a couple moments.
3. If anything isn’t working, look for the linked text that says &#x60;View workflow runs&#x60; \- if any actions were attempted in the deployment of your site, they should show up here. It also might just take a sec, and if you’re impatient like me, you can see a job in progress (it probably will take a max of like 20 seconds)

---