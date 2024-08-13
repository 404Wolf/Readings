---
id: 7b72db42-db91-11ee-835f-bb938d4ae975
title: Automerge is Beautiful - Zach Ahn
tags:
  - RSS
date_published: 2024-03-05 23:08:27
---

# Automerge is Beautiful - Zach Ahn
#Omnivore

[Read on Omnivore](https://omnivore.app/me/automerge-is-beautiful-zach-ahn-18e12d3896d)
[Read Original](https://zachahn.com/posts/1709695164)



[Automerge](https:&#x2F;&#x2F;automerge.org&#x2F;) is a library provides conflict-free replicated data types—data structures that make it convenient to sync data. The team behind it hopes to enable software that can adhere to [seven ideals](https:&#x2F;&#x2F;www.inkandswitch.com&#x2F;local-first&#x2F;). To paraphrase:

1. You should be able to have instantaneous access to your data.
2. You should be able to work with your data when you’re offline.
3. You should be able to sync data when you’re online.
4. You should be able to collaborate with others.
5. You should be able to work with your data decades from now.
6. You should be able to encrypt your data.
7. You should be able to work with your data however you want.

I’ve never built software like this before, so it’s been really interesting for me to think about the complexities that come up when building apps like this. I’ve found Automerge to be a very well-designed data format that aims to be “conflict-free” on many levels.

In addition to the core Automerge library, they published a separate library, Automerge Repo ([JS](https:&#x2F;&#x2F;github.com&#x2F;automerge&#x2F;automerge-repo), [Rust](https:&#x2F;&#x2F;github.com&#x2F;automerge&#x2F;automerge-repo-rs)) that provides interfaces and implementations for common tasks around storage and syncing. I was particularly struck by their storage implementation when reading through their [documentation on storage](https:&#x2F;&#x2F;automerge.org&#x2F;docs&#x2F;under-the-hood&#x2F;storage&#x2F;)—there were huge implications, but I had no idea how it worked!

Here’s the excerpt of what I was confused about:

&gt; The upshot of all this then is that our model for storage is not a key value store with document IDs as keys and byte arrays as values, but instead a slightly more complex model where the keys are arrays of the form &#x60;[&lt;document ID&gt;, &lt;chunk type&gt;, &lt;chunk identifier&gt;]&#x60; where chunk type is either &#x60;&quot;snapshot&quot;&#x60; or &#x60;&quot;incremental&quot;&#x60; and the chunk ID is either the heads of the document at compaction time or the hash of the change bytes respectively. The storage backend then must implement range queries so the storage system can do things like “load all the chunks for document ID x”.
&gt; 
&gt; In typescript that looks like this:
&gt; 
&gt; &#x60;&#x60;&#x60;typescript
&gt; export type StorageKey &#x3D; string[]
&gt; 
&gt; export abstract class StorageAdapter {
&gt;  abstract load(key: StorageKey): Promise&lt;Uint8Array | undefined&gt;
&gt;  abstract save(key: StorageKey, data: Uint8Array): Promise&lt;void&gt;
&gt;  abstract remove(key: StorageKey): Promise&lt;void&gt;
&gt;  abstract loadRange(keyPrefix: StorageKey): Promise&lt;{key: StorageKey, data: Uint8Array}[]&gt;
&gt;  abstract removeRange(keyPrefix: StorageKey): Promise&lt;void&gt;
&gt; }
&gt; 
&gt; &#x60;&#x60;&#x60;

And here’s what stuck out to me:

1. The storage adapter has only five public methods.
2. The storage adapter knows nothing about Automerge documents, just keys and values.
3. The storage adapter can potentially work with E2E encrypted data because it doesn’t care about the document contents.

But this raised more questions than answers!

1. What should the &#x60;key&#x60;s look like?  
   1. What are “chunk identifiers”?  
   2. What’s the difference between a “snapshot” and an “incremental”?  
   3. What are “range queries”?  
   4. When do we use “load” vs “loadRange”?  
   5. What’s the difference between a “key” and a “keyPrefix”?
2. What should the &#x60;data&#x60; values look like?

To answer my questions, I reimplemented Automerge Repo’s filesystem storage mechanism.

## Understanding the contents of an Automerge document

To be honest, I had a pretty foundational non-understanding of what Automerge documents looked like and kept track of. I spent about a day or two reading documentation (there’s a lot of documentation spread out on their website and the languages&#x2F;bindings they support), but in the end, I found it most helpful to generate a document, to mutate it, and to print out the contents and metadata on each change.

I’m not sure if this summary helps—I definitely recommend experimenting with the library rather than relying on my second-hand information—but here’s it goes!

* **The current heads** are identifiers that point to the current state of your document. Usually, a working copy of a document would have one head, but there can be multiple identifiers when there was a merge conflict.
* **The history** is an ordered list of all previous heads. You can think of this like a list or stack. The last element(s) of the list are always equal to the current head(s).
* **The document contents** kinda feels like a JSON object. Whenever you make a change to the contents, you’re also updating the current head and history, but this largely happens automatically.
* And more. They’re all important, but I’m skipping the ones that aren’t related to storage.

Automerge has two ways of serializing this data into its [binary format](https:&#x2F;&#x2F;automerge.org&#x2F;automerge-binary-format-spec&#x2F;). I think the function names are slightly misnamed since they’re called “save” even though there is no IO. Nitpicking aside, here is what they do:

* &#x60;save()&#x60; returns the full document along with the full history.
* &#x60;save_incremental()&#x60; returns a diff of everything that happened since the last save.

In both cases, the document keeps track of what was last saved so that &#x60;save_incremental&#x60; is always able to return only what changed since the last save.

## Loading documents

Let’s think about a simple example where a document has 4 versions: we start from an empty string and append one character at a time until we end up with &#x60;abcd&#x60;. I’m kinda skipping ahead to some kind of final implementation, but I only understood storage after I saved the raw data from &#x60;save()&#x60; into a file and tried loading it.

| Step | Content | Heads    | History                    | Save                |
| ---- | ------- | -------- | -------------------------- | ------------------- |
| 1    | &quot;&quot;      | \[\]     | \[\]                       |                     |
| 2    | a       | \[3a5c\] | \[3a5c\]                   |                     |
| 3    | ab      | \[2a06\] | \[3a5c, 2a06\]             | save()              |
| 4    | abc     | \[a20f\] | \[3a5c, 2a06, a20f\]       | save\_incremental() |
| 5    | abcd    | \[1d60\] | \[3a5c, 2a06, a20f, 1d60\] | save\_incremental() |
| 6    | abcd    | \[1d60\] | \[3a5c, 2a06, a20f, 1d60\] | save()              |

Since we called “save” four times, we’ll end up with three files. Here they are below. Let’s say that the document ID is &#x60;test&#x60;—the ID here is just a kind of document name. I’ve ordered this alphabetically by filename, but also I took a few liberties to try to explain one of the interesting edge cases I saw, and please note especially that the content column is a complete oversimplification!

| Filename                                         | Content |
| ------------------------------------------------ | ------- |
| &lt;document ID\&gt;.&lt;chunk type\&gt;.&lt;chunk identifier\&gt; |         |
| test.incremental.1d60                            | \_\_\_d |
| test.incremental.a20f                            | \_\_c   |
| test.snapshot.1d60                               | abcd    |
| test.snapshot.2a06                               | ab      |

Now, let’s load these files alphabetically.

| Step | Load file             | Content | Note                        |
| ---- | --------------------- | ------- | --------------------------- |
| 1    | test.incremental.1d60 | &quot;&quot;      | No error but no &quot;d&quot; either  |
| 2    | test.incremental.a20f | &quot;&quot;      | No error but no &quot;cd&quot; either |
| 3    | test.snapshot.1d60    | abcd    |                             |
| 4    | test.snapshot.2a06    | abcd    | No error; no-op             |

It loads pretty smoothly, even when we load the history slightly out of order! I want to take a second to explain my oversimplification; loading incomplete documents doesn’t raise an error, but we can check to see if the document is in an error state by checking if it’s missing any heads. There’s a silent failure, but recoverable as long as we eventually load the missing data.

Two more out-of-order scenarios 

Here’s what happens when we start off with a valid document but make it temporarily invalid by loading some incremental changes out of order:

| Step | Load file             | Content | Note                         |
| ---- | --------------------- | ------- | ---------------------------- |
| 1    | test.snapshot.2a06    | ab      |                              |
| 2    | test.incremental.1d60 | &quot;&quot;      | No error but no &quot;abd&quot; either |
| 3    | test.incremental.a20f | abcd    |                              |
| 4    | test.snapshot.1d60    | abcd    | No error; no-op              |

And lastly, here’s what happens when we’ve already read everything!

| Step | Load file             | Content | Note            |
| ---- | --------------------- | ------- | --------------- |
| 1    | test.snapshot.1d60    | abcd    |                 |
| 2    | test.snapshot.2a06    | abcd    | No error; no-op |
| 3    | test.incremental.a20f | abcd    | No error; no-op |
| 4    | test.incremental.1d60 | abcd    | No error; no-op |

All this to say, Automerge makes it very easy to load data! As long as we have all of the information we need to build a complete history, it doesn’t matter how we store it or how we load it. This greatly simplifies application development since we don’t need to keep a sorted list of changes—note that a sorted list would require something like global state (some kind of centralized database) or an accurate timestamp (which is also a kind of global state).

### Using storage to sync

Automerge’s flexibility around loading data lets multiple applications share a single data store:

* Multiple windows on a single device can edit a single document without conflicts
* Multiple devices can edit a single document saved on Dropbox&#x2F;iCloud Drive without conflicts

A quick example here of what would happen:

| Step | Client | Content     | History        | Note                               |
| ---- | ------ | ----------- | -------------- | ---------------------------------- |
| 1    | A      | &quot;abc&quot;       | \[00\]         | Load                               |
| 2    | B      | &quot;abc&quot;       | \[00\]         | Load                               |
| 3    | B      | &quot;123abc&quot;    | \[00, b1\]     | Edit and save                      |
| 4    | A      | &quot;abcdef&quot;    | \[00, a1\]     | Edit and save                      |
| 5    | A      | &quot;abcdef&quot;    | \[00, a1\]     | Compaction (Delete duplicate data) |
| 6    | C      | &quot;123abcdef&quot; | \[00, b1, a1\] | New client loads everything        |
| 7    | C      | &quot;123abcdef&quot; | \[00, b1, a1\] | Compaction                         |

At the end of Step 4, after all the editing and saving, we’d see the following files:

* &#x60;test.snapshot.00&#x60;
* &#x60;test.incremental.a1&#x60;
* &#x60;test.incremental.b1&#x60;

At the end of Step 5, we’d see these files. It’s important that clients only compact files it’s loaded. Here, Client A never loaded the &#x60;b1&#x60; change, so it left it untouched.

* &#x60;test.snapshot.a1&#x60;
* &#x60;test.incremental.b1&#x60;

And at the end of Step 7, we’d see just one file. Client C compacted the files it knew about. Note that this filename shows that there are two heads as a result of our merge, &#x60;a1&#x60; and &#x60;b1&#x60;.

* &#x60;test.snapshot.b1.a1&#x60;

At any point though, all clients can refresh its data by reading the entire document. Since Automerge filters out duplicate changes, all clients would eventually end up with &#x60;123abcdef&#x60;.

## Rebuilding the storage API

At this point, we know enough of the building blocks to implement a storage API for Automerge. This is just one possibility—note that this doesn’t match the interface in the docs!

&#x60;&#x60;&#x60;typescript
export abstract class MyStorageAdapter {
  &#x2F;&#x2F; We need a way to save a document snapshot
  abstract saveSnapshot(documentId: String, data: Uint8Array): Promise&lt;void&gt;
  &#x2F;&#x2F; We need a way to save an incremental snapshot
  abstract saveIncremental(documentId: String, heads: String[], data: Uint8Array): Promise&lt;void&gt;
  &#x2F;&#x2F; We need a way to load a document
  abstract loadAll(documentId: String): Promise&lt;{key: StorageKey, data: Uint8Array}[]&gt;
  &#x2F;&#x2F; We need a way to compact duplicate data
  abstract removeSnapshot(documentId: String, heads: String[])
  abstract removeIncremental(documentId: String, heads: String[])
}

&#x60;&#x60;&#x60;

## Takeaways

I’m really amazed by Automerge’s deep “conflict-free” nature: its individual data types, its recommended data storage format, and its flexibility towards load order.

## Next steps

I mentioned that I’m working towards building a notes app, so I’m planning on continuing to look into Automerge. I’m still in the design and research phase of this project. I don’t know how far I’ll get, or if I’ll finish, but I’m glad to have had the excuse to look into this so far.