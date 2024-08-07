---
id: 2c4a3a54-15fe-11ef-9816-cba2a5a4595e
title: gefs-future
tags:
  - RSS
date_published: 2024-05-19 12:01:31
---

# gefs-future
#Omnivore

[Read on Omnivore](https://omnivore.app/me/gefs-future-18f91b7b9af)
[Read Original](https://orib.dev/gefs-future.html)



[Gefs](https:&#x2F;&#x2F;orib.dev&#x2F;gefs.html) was recently committed to 9front. Because it hasn&#39;t had many miles put on it yet, I still consider it very experimental.

It is available as a hidden option in the installer. You can get a GEFS based system by manually typing&#x60;gefs&#x60;at the prompt where it asks you to select between&#x60;cwfs64x&#x60;and&#x60;hjfs&#x60;.

While gefs is in tree, it&#39;s far from done. This is an incomplete list of future work that I would like to complete:

* Repair tools; right now, we can check for corruption, but more would be welcome. there&#39;s also nothing to fix corruption if it&#39;s detected.
* Storing small files inline; there&#39;s no need to create a new block if the file is smaller than the maximum size of a value in the Bε tree.
* Merging&#x2F;annihilating messages early; right now, all messages flush all the way down to the leaf before being applied, but they could be merged early; eg, a delete could eliminate an insert, or a chain of mtime changes could be merged into one.
* Modifying the root block buffer in-place; right now, the root block is copied for every upsertion. With some care, an upsert can modify the in-memory copy of the root block, which only needs to be serialized and flushed on sync or when it is full.
* Custom snapshot timing; right now, snaps are either taken automatically on a hard-coded schedule, or not taken at all.
* Microoptimization; right now, performance is ok, but could be faster; measure and optimize.
* Doing more eager space reclaim; getting back space from deleted files is delayed, and we could do some work in the sweeper to reclaim the space early.
* Raid and Autorepair; it would be useful to have the filesystem able to support raid. It would also be and to use the corruption detection it has to build in to repair corrupt reads. The split between devfs and the file system in this situation isn&#39;t clear.  
All of these seem like they should be easy to implement without any breaks to compatibility. The locations for feature flags are all in place.  
I plan to hack on these as time permits, but at a fairly low priority. Patches are welcome.