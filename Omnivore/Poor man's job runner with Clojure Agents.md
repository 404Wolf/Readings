---
id: 7e163571-5358-447d-ae13-c0bbdc4bf746
title: Poor man's job runner with Clojure Agents
tags:
  - RSS
date_published: 2024-07-14 00:00:00
---

# Poor man's job runner with Clojure Agents
#Omnivore

[Read on Omnivore](https://omnivore.app/me/poor-man-s-job-runner-with-clojure-agents-190b135705e)
[Read Original](https://www.evalapply.org/posts/poor-mans-job-runner-clojure-agents/index.html)



Poor man&#39;s job runner with Clojure Agents

↑ [menu](#site-header) ↓ [discuss](#blog-post-footer) ↓ [toc](#blog-post-toc) 

On (mis)using Clojure&#39;s concurrency features to make an in-memory job runner, because I needed an excuse to use more than atoms for once. Definitely not Rich Hickey&#39;s &quot;Ants&quot; demo.

---

**Contents** 

[Backstory](#backstory) [The hack](#the-hack) [Code sketch &#x2F; Sketchy code (same thing)](#code-sketch-sketchy-code-same-thing) [Pros &#x2F; Cons](#pros-cons) [Obligatory HTMX meme](#obligatory-htmx-meme) [Footnotes](#footnotes) 

---

**Author&#39;s note:** To run real background jobs like a proper Clojure professional, maybe use one of the proper professional libraries out there, like [goose](https:&#x2F;&#x2F;github.com&#x2F;nilenso&#x2F;goose).

## Backstory

Opportunity to use not just atoms made its way to me a decade after I first watched Rich Hickey&#39;s &quot;Ants&quot; demo [1](#fn1). The demo shows off a Java Swing GUI world swarming with ants, driven using all three of Clojure&#39;s built-in concurrency features.

Clojure wants us to be explicit about _**type of concurrency**_ [2](#fn2), depending on how state is to be shared between threads. We must choose a feature accordingly.

| ↓ State Sharing &#x2F; Threads → | Independent | Coordinated         |
| --------------------------- | ----------- | ------------------- |
| Synchronous                 | atom        | ref                 |
| Asynchronous                | agent       | not in our universe |

However, like maybe 99% of all Clojure programmers, I&#39;ve only ever used atoms in practice [3](#fn3). Like maybe some of them, I&#39;ve always wanted to use the others some day. Because that demo is rad!

While working through the (very nice!) [hypermedia.systems](https:&#x2F;&#x2F;hypermedia.systems&#x2F;) book, I reached the section where we must code up a [Dynamic Archive UI](https:&#x2F;&#x2F;hypermedia.systems&#x2F;a-dynamic-archive-ui&#x2F;), complete with a live progress indicator.

The scenario requires an _Archive_ job that runs in the background, with basic job control stuff (run, pause, cancel, reset, status, progress, etc.).

Obviously we must kick jobs off of the main execution thread, to avoid blocking it. Further, if we have many jobs and&#x2F;or many batches per job, we need to queue them all up for asynchronous evaluation. And job state must be observable at all times without blocking job execution.

Of course, we are here because I didn&#39;t want to just get on with life by using a &#x60;Thread&#x2F;sleep&#x60; or some trivial mock; definitely not a library. Because Clojure has features that can help us.

Upon squinting a little, the, ah, job description looked an awful lot like the place in [the table up above](#backstory) where _Asynchronous state update_ meets _Independent threads_.

Aha! Send in our agent!

## The hack

&#x60;&#x60;&#x60;clojure
(agent {:status (atom :waiting) ; the one weird trick
        :total-batches 0
        :progress 0
        :job-file &quot;resources&#x2F;job-log.json&quot;}
       ;; the one weird trick
       :validator (fn [self] 
                    (not&#x3D; :paused @(:status self))))
&#x60;&#x60;&#x60;

I modeled a single job runner as a Clojure agent:

* meant to manage one job at a time,
* where a job has one or more long-running batches,
* where the runner&#39;s current status may be one of &#x60;:waiting&#x60;, &#x60;:running&#x60;, or &#x60;:paused&#x60;,
* and it is always initialised in the &#x60;:waiting&#x60; state.

Additionally, the job state reflects current progress and points to a file that accumulates the work of each batch.

The one weird trick is how to implement out-of-band job control, if we use an agent this way?

Because…

* Our job batches must be executed in order.
* Actions dispatched to an agent occur in the order they were sent.
* Only one action is executed at a time for an agent.
* So I must queue all batches up-front (using &#x60;send-off&#x60;).

_However_…

* The trouble is the agent system has no built-in pause&#x2F;resume facility.
* To ensure the agent system&#39;s sequential execution guarantee, the queue of actions cannot be modified post-hoc.

So!

* I had to hack it by making the agent do some navel-gazing.
* [This StackOverflow answer](https:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;4610972) provided clues key to the solution.

What if I put job &#x60;:status&#x60; in an atom, and observe the atom via a validator?

* Any validator attached to an agent is evaluated for every action sent to the agent. The agent halts if the validator returns &#x60;false&#x60;. [4](#fn4)
* The agent&#39;s state is always observable out-of-band.  
   * Which means I can see the &#x60;:state&#x60; atom from the outside.  
   * Which further means I can update it from the outside too.
* Putting the two together…  
   * If a batch is in progress,  
   * and I set the &#x60;:state&#x60; atom to &#x60;:paused&#x60;,  
   * then the next batch won&#39;t execute,  
   * because the validator will fail the agent _before it runs the next action_,  
   * thus effectively pausing the queue. Phew!

So I gave the agent a validator function that returns &#x60;false&#x60; if the &#x60;:state&#x60; atom is set to &#x60;:paused&#x60;, thus halting the agent.

Upon halting, &#x60;agent-error&#x60; allows us to see the reason for job interruption (an Exception). And &#x60;restart-agent&#x60; lets us resume the job after suitably dealing with the interruption.

The state of atoms and agents is always readable without blocking writers, so one can get away with pretty straightforward lock-free code.

## Code sketch &#x2F; Sketchy code (same thing)

Here&#39;s the basic idea. It works on my computer. I also am pleased to report that I finished the book example and have moved on in life.

&#x60;&#x60;&#x60;clojure
(ns study-htmx.pmjc
  &quot;Poor Man&#39;s Job Control&quot;)

(defn make-initial-job-state
  []
  (agent {:status (atom :waiting)
          :total-batches 0
          :progress 0
          :job-file &quot;resources&#x2F;job-log.json&quot;}
         :validator (fn [job-runner]
                      (not&#x3D; :paused @(:status job-runner)))))

(defonce job-runner
  (make-initial-job-state))

(defn create-job!
  &quot;Queue all the batches for the given job and
  keep the job progress current.&quot;
  [job-runner batches batch-executor]
  ;; Start the job when it is parked in the initial
  ;; :waiting state. Also rotate the job file.
  (when (&#x3D; @(:status @job-runner) :waiting)
    (swap! (:status @job-runner)
           (constantly :running))
    (send job-runner assoc
          :total-batches (count batches))
    (spit (:job-file @job-runner)
          &quot;&quot;))

  ;; As soon as a job is set to run, queue all batches
  ;; and progress updates
  (when (&#x3D; @(:status @job-runner) :running)
    (doseq [batch batches]
      (send job-runner update :progress inc)
      (send-off job-runner batch-executor batch)))

  ;; Queue a final action to mark the job as :done
  (send-off job-runner
            (fn [runner]
              (swap! (:status runner) (constantly :done))
              runner)))

(defn pause-job!
  &quot;Out-of-band job control by reaching into the :status atom.&quot;
  [job-runner]
  (swap! (:status @job-runner)
         (constantly :paused))
  job-runner)

(defn resume-job!
  &quot;Out-of-band job control by reaching into the :status atom.&quot;
  [job-runner]
  (when (&#x3D; :paused @(:status @job-runner))
    (swap! (:status @job-runner) (constantly :running))
    (restart-agent job-runner @job-runner))
  job-runner)

(defn reset-job!
  &quot;Cheaping out by resetting the var because we mean to be
  destructive and consign the agent to garbage collector.
  Wrapping the agent in an atom would be better.&quot;
  [job-runner-var]
  (alter-var-root job-runner-var
                  (constantly (make-initial-job-state))))

(defn cancel-job!
  [job-runner job-runner-var]
  (pause-job! job-runner)
  (reset-job! job-runner-var))

(defn do-batch!
  &quot;Presumably a long-running batch. We must always accept
  and return the job runner as this is an action sent off
  to the job runner agent.&quot;
  [job-runner batch]
  (Thread&#x2F;sleep 5000) ; the batch is running
  (spit (:job-file job-runner)
        (format &quot;Completed batch %s\n&quot; batch)
        :append true)
  job-runner)

(comment
  (create-job! job-runner
               [&quot;ONE&quot; &quot;TWO&quot; &quot;THREE&quot; &quot;FOUR&quot; &quot;FIVE&quot;]
               do-batch!)

  (pause-job! job-runner)
  (resume-job! job-runner)
  (reset-job! (var job-runner))
  (cancel-job! job-runner (var job-runner))

  (agent-error job-runner))
&#x60;&#x60;&#x60;

## Pros &#x2F; Cons

This is proooobably gross misuse of the agent system. _But_ if it is not, I would [like to know](#site-header)!

Pros:

* No need for an external library.
* Straightforward lock-free code.
* Built-in thread safety of Clojure&#39;s concurrency system.
* Built-in error recovery.
* Built-in observability of state and errors.
* Extensible, if you have the iron constitution to live with the consequences.

Cons:

* Obviously, in-memory job control is bound to a single process. If it dies, we lose our jobs.  
   * Mitigation: We can attach a watcher to the agent and write to a log file to track progress and recover from a process restart.  
   * Alternative: Use SQLite to manage job state. When in WAL mode, SQLite is a lot like an agent, allowing for mutually non blocking sequential writes and concurrent reads.
* Easy to write subtle bugs, especially timing and order problems like incrementing progress counter in the wrong order, leading to off-by-one errors if we pause &#x2F; resume the job.  
   * Mitigation: Write side-effecting functions with care. Design for idempotence. Test thoroughly. Be well aware of each feature&#39;s concurrency model and the intended behaviour of operations supported by the the feature.
* Abusing your programming language&#39;s standard library.  
   * Mitigation: ¯\\(ツ)\_&#x2F;¯

## Obligatory HTMX meme

I feel compelled to contribute back to the HTMX community seeing as we began our side quest because of the [hypermedia.systems](https:&#x2F;&#x2F;hypermedia.systems&#x2F;) book.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sFwVrVLc0CrlS_r5jBDyzFWeBpMaqZjaNnriQwNc9IMk&#x2F;https:&#x2F;&#x2F;i.imgflip.com&#x2F;8wy4em.jpg &quot;HTMX is Boring Technology (via imgflip.com)&quot;) 

This _[HTMX is Boring Technology](https:&#x2F;&#x2F;imgflip.com&#x2F;i&#x2F;8wy4em)_ fact is brought to you using [Imgflip](https:&#x2F;&#x2F;imgflip.com&#x2F;memegenerator).

## Footnotes

---

1. Clojure: A Dynamic Programming Language for the JVM. Concurrency Support. [talk video](https:&#x2F;&#x2F;www.youtube.com&#x2F;watch?v&#x3D;nDAfZK8m5%5F8), [code archive](https:&#x2F;&#x2F;github.com&#x2F;juliangamble&#x2F;clojure-ants-simulation), [transcript and slides](https:&#x2F;&#x2F;github.com&#x2F;matthiasn&#x2F;talk-transcripts&#x2F;blob&#x2F;master&#x2F;Hickey%5FRich&#x2F;ClojureConcurrency.md).[↩︎](#fnref1)
2. Cf. [Concurrent Programming reference page at Clojure.org](https:&#x2F;&#x2F;clojure.org&#x2F;about&#x2F;concurrent%5Fprogramming)[↩︎](#fnref2)
3. The opportunity tends not to arise in real life because we end up using futures, or core.async for our asynchronous and&#x2F;or independent operational needs, and RDBMSes for our coordinated and&#x2F;or synchronous transactional needs. Plus, present-day Java has a whole host of options for concurrent programming.[↩︎](#fnref3)
4. Cf. [Agents and Asynchronous Actions](https:&#x2F;&#x2F;clojure.org&#x2F;reference&#x2F;agents)[↩︎](#fnref4)