---
id: 6faf6874-04d2-11ef-a72f-776c4c955bfb
title: What Nix Will Have Been - Andreas Fuchs’ Journal
tags:
  - RSS
date_published: 2024-04-27 13:03:01
---

# What Nix Will Have Been - Andreas Fuchs’ Journal
#Omnivore

[Read on Omnivore](https://omnivore.app/me/what-nix-will-have-been-andreas-fuchs-journal-18f212fd2e8)
[Read Original](https://boinkor.net/2024/04/what-nix-will-have-been/)



With the Nix project currently [undergoing](https:&#x2F;&#x2F;save-nix-together.org&#x2F;) [major](https:&#x2F;&#x2F;github.com&#x2F;NixOS&#x2F;nixpkgs&#x2F;issues?q&#x3D;label:%228.has:+maintainer+removal%22) [turmoil](https:&#x2F;&#x2F;xeiaso.net&#x2F;blog&#x2F;2024&#x2F;much-ado-about-nothing&#x2F;), it’s good to remind ourselves that everything is transient: Every project, no matter how technically sophisticated, will eventually fade away, but its best core ideas can - and should - be identified, documented, and get to live on in other projects. So, if nix went away tomorrow, what made it “it”?

![Joke&#39;s on us, it is well on the way to not being.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;504x478,sm-eCHcSF7UH7IZANjzDKVr6IL7XSCoLRWr65KlQE-gs&#x2F;https:&#x2F;&#x2F;boinkor.net&#x2F;images&#x2F;nix-is-is-not_hu589ae829dd0e9f3d4f4679492985fda0_31097_504x478_resize_q75_h2_box.webp)

That’s it, that’s the core idea. If all else gets lost, this is what I think we should remember, and re-build in another set of tools and a different kind of community (one that cares about governance, shares the power to direct it, and does its best to remain safe for people at risk of getting hurt by bad actors).

Now, what does that idea mean?

## Yak shaving

First, let’s look at the idea of [yak shaving](https:&#x2F;&#x2F;yakshav.es&#x2F;the-patron-saint-of-yakshaves&#x2F;): A low-value activity you must complete in order to get to finish a higher-value activity. Say you have just gotten a new laptop and it’s very nice and shiny - but it’s a different platform from the one you’re used to (say, it’s apple hardware and you exclusively had linux machines before). No problem, you have dotfiles somewhere! But oh no, terminals you run inside tmux doesn’t [support interacting with the system clipboard](https:&#x2F;&#x2F;github.com&#x2F;ChrisJohnsen&#x2F;tmux-MacOSX-pasteboard), but thankfully you only need to install &#x60;reattach-to-user-namespace&#x60;; but you also need to change your tmux configuration; but that tool isn’t compatible with linux, so how about making your configuration into a templated thing; and oh, but what templating system to use, and how do you decide how to identify the different platforms you care about in a way that doesn’t have bootstrapping issues? And suddenly you have approximately 18 browser tabs open, but at the end of the afternoon you have finally gotten the shell configured the way you need it and you can enjoy working with that new machine!

## Speed runs

(It’s a [gaming term](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Speedrunning))

So fixing your issue took an afternoon. Can you do it faster? Sure, with experience and practice you can get good (know your tools), identify the attack patterns of the enemy (keep up with the shifting software landscape), maybe even exploit some unintended consequences of the level map geometry (find [cool interactions](https:&#x2F;&#x2F;boinkor.net&#x2F;2007&#x2F;02&#x2F;unintended-consequences&#x2F;) between tools that weren’t originally intended to interact).

OK, that was a bit contrived. But the analogy is pretty solid, I think: Everyone I know (me, certainly!) wants to complete the yak-shaving part of any task on the computer as fast as possible, so they can get to the rewarding bit.

I think it would be fair to call it an any% yak-shaving speedrun to fix an issue that is in your way of getting other things done - you completed the task with a minimum of effort, and did it as quickly as possible. There might be other issues with your machine still (maybe git isn’t correctly configured to sign your commits), but that’s irrelevant for the task you’re getting to do right now.

So, say you can get your terminal tools’ ability to properly use copy &amp; paste on the mac working in 20 minutes, but what if you get a new machine? Will you even remember to fix that again? Will you stick with the defaults until something breaks, re-research what it took to repair the issue and then do it? Or keep the customization in that aforementioned dotfile repo and then scratch your head over why your tmux panes immediately exit? (Oh, oops, you forgot to hand-build and install the tool!)

## 100% yak-shaving

The thing that I got out of my nix configuration is simply that all the issues I had getting computer stuff done in the past, I solved by writing text files. Those live in git. Then, when I get a new computer I just tell it to apply the configuration in those text files… and after it’s done downloading an unholy amount of data, it sits there and works - all the things I ever needed to fix, fixed. All the software I need, installed.

And if I need to fix a thing on this machine, I can commit that fix, and apply it on all the other machines I ever had. That’s what I mean by “100% speed run”: Not just the issues standing in your way to your current task are fixed, but all that ever stood in your way.

The neat side effect is that you get a historical record of all the things you learned (even if you didn’t want&#x2F;mean to learn them) about computers.

## Tool-assisted speed runs &#x2F; TASbots

Tool-assisted speed run bots are little devices acting as game console peripherals that record your keypad inputs and play them back with perfect timing, so that your runs become reproducible. Bots can often pull off tricks that real humans can’t ([or take _impressively long_ to perfect](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;GuJ5UuknsHU)). They are super fun to watch, but for games it’s much more impressive to see a human beat them while looking like they are a machine.

That’s pretty much not our goal when yak-shaving: [Laziness is the first of the three great virtues of a programmer](https:&#x2F;&#x2F;thethreevirtues.com&#x2F;), after all. When we make dot file repos, or craft ansible system configuration, we tell a bot how we want our problems solved.

And that’s what I mean when I say Nix’s core idea is that it’s tool-assisted 100% yak-shaving speedrun bot. It is also the most accurate and fastest (both in terms of how fast it applies a config as well as how quickly it let me fix an issue forever). Which makes it doubly painful to see its community breaking apart.

## Lessons learned for the thing that comes after

So when nix goes the way of all ephemeral things, what do I hope the next thing will do, besides provide a great way to write speedrun bots for computer-touching?

## Have intentional community governance and a democratic leadership process

These days, I feel it’s beyond embarrassing for any project to have “Benevolent” “Dictators” “For Life”, not only because they rarely are&amp;stay either of these things (and if they are a dictator, then yikes, stay away). It’s not fair to the humans pushed into these roles!

Let folks take a step back when they need to, and let people with more energy take the wheel. You can actually measure the health and longevity of a community by the number of peaceful community-involved (dare I say democratic) leadership changes it has undergone. Monarchies are for suckers.

If it weren’t so sad and threatening, it might be funny: The nix project had an [RFC for establishing a code of conduct](https:&#x2F;&#x2F;github.com&#x2F;nixos&#x2F;rfcs&#x2F;pull&#x2F;98). That RFC was concern-trolled and then closed, so the project has not had a written code of conduct, until the moderation team [realized they were given the power to adopt one 5 months ago](https:&#x2F;&#x2F;discourse.nixos.org&#x2F;t&#x2F;adopting-a-code-of-conduct&#x2F;35136), meaning jerks are now feeling entitled to detailed explanations of why a code of conduct is necessary.

I’m not a person who’s particularly at risk in open source spaces, but you can hopefully see how unattractive it makes the job of moderator (or even the job of being a member of the space) when prominent members of the community rail against how unfair it is that moderators tell people to remove links to “unwoke” screeds[1](#fn:1) from their community posts, based on a non-adopted CoC… which those members ensured would not get adopted the first place.

Just get these basics right from the start, please. Subtle threats against minority community members like that screed should be discouraged and be off-topic in a software forum. It should be embarrassing to do it publicly in anyone’s project - but I guess that’s not how the current nix community is meant to roll. The next one will do better.

Another side-effect (how un-hermetic!) of having a project leader that’s also the project founder and has been for decades is that they have an easier time either accidentally steering the ship (optimistically) or meddling (pessimistically). The open letter to the nix foundation gives [a few examples](https:&#x2F;&#x2F;save-nix-together.org&#x2F;#avoiding-giving-away-authority) here.

Please just rotate out your leaders. Identify and [weed out](https:&#x2F;&#x2F;hackmd.io&#x2F;@XAMPPRocky&#x2F;r1HT-Z6%5Ft) accidental remnants of implicit hierarchy. A structure will exist, so please make it be the one that you’ve documented.

## Sustain the infrastructure without outsize donations &amp; attached strings

Nix-the-CI-infrastructure takes a _lot_ of compute power, storage and bandwidth. It might even pay some of the volunteers taking on roles. Recently, they had to scramble to not be hit with a [huge bill for their cache’s S3 usage](https:&#x2F;&#x2F;discourse.nixos.org&#x2F;t&#x2F;the-nixos-foundations-call-to-action-s3-costs-require-community-support&#x2F;28672)… $9k&#x2F;mo, a year ago. As you can imagine, this only gets more expensive over time.

So, ideally find a way to pay for all this, but do so without attracting single “whale” sponsors who then start meddling in the governance of the project. This is hard! I have no solutions outside a promise to pay for some of that, if I end up working with it. I hope others will, too. And maybe, by that time we’ll have figured out how to properly get large for-profit entities pay for the open-source software that they benefit from, without putting all that burden on individuals.

## Conclusion

Well, this sucks: If the rot of the nix project continues as it does, I’ll get to undo a whole bunch of work on my public repositories to remove dependencies on a project that seems intent on hurting several of my friends.

But, on a hopeful note: The technical bits are just a computer yak-shaving problem, one with a technical solution that’s written down in an accessible historical record. Maybe it can even be improved upon, much like the project’s governance and community definitely can.

---

1. The irony of people who use their brain to work on systems, demanding that things are “too woke” is something to behold: The term “woke,” as originally coined by Black Americans, refers to an alertness to how brutal this violent system of white supremacy that we live in is. Thankfully, understanding complex systems and working with other people isn’t their job or anything! [↩︎](#fnref:1)