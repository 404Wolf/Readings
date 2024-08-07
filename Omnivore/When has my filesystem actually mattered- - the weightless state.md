---
id: 44311078-e86e-492c-ace6-e5d8d1d839fb
title: When has my filesystem actually mattered? | the weightless state
tags:
  - RSS
date_published: 2024-07-24 19:04:37
---

# When has my filesystem actually mattered? | the weightless state
#Omnivore

[Read on Omnivore](https://omnivore.app/me/when-has-my-filesystem-actually-mattered-the-weightless-state-190e81b5465)
[Read Original](https://metavee.github.io/blog/technical/2024/07/24/when-has-my-filesystem-actually-mattered.html)



Computers (famously) have files and folders. These files live on storage hardware, such as a solid state drive or USB drive. The drive has some capacity in bytes, and files have sizes that take up this capacity. If you run out of space on the drive, you delete some files you don’t need, and get those bytes back. Nice.

From the drive’s perspective though, there are no files and folders; there’s just a big set of bytes (or blocks of bytes). So where do files and folders actually live?

There is a thing called a filesystem, which is a scheme for figuring out which bytes belong to which file, what folder a file is in, and so on. Usually the operating system implements the filesystem, so users and apps can do their work without needing any awareness of the details. Drives can be divided up into multiple partitions, that each have a fully independent filesystem. For simplicity, I’ll mostly talk about drives with one partition that occupies the entire capacity.

A concrete analogy 

The notion of a filesystem might still feel a bit abstract. Unfortunately, there is a surprising amount of detail even in relatively simple filesystems like [FAT](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Design%5Fof%5Fthe%5FFAT%5Ffile%5Fsystem), so it&#39;s difficult to get into here. If you&#39;re feeling lost, this analogy may clarify things:

Instead of a disk, imagine a book with some fixed number of pages. A file might be like a chapter occupying certain pages. Then the filesystem&#39;s job is to maintain the table of contents, showing the names of the chapters and where they start and end.

Over time, &quot;chapters&quot; are created and deleted, and change in length as they are edited. Whatever happens, the table of contents needs to be kept intact and up to date, or else it gets hard to know where anything is.

Notice that the table of contents, just like the chapters, also occupies some number of pages in the book. It too has to safely grow and shrink to accommodate its contents. How do we find where the table of contents is located? Given its important role, it should be kept in a predictable location, like right at the front or back.

For sanity, the table of contents might impose certain limits. For example, chapters may be prohibited from having names that are thousands of letters long, or containing slashes. The design choices of the table of contents would also depend heavily on whether the book is a thousand page tome or a stack of sticky notes.

Anyway, we could keep adding more layers to the analogy (like folders and subfolders!), but hopefully this illustrates the concept. Doing this bookkeeping in a flexible, fast and reliable way is the purpose of the filesystem. And there are many approaches which make different tradeoffs, provide different sets of advanced features, and are optimized for specific hardware or usage patterns.

## Some filesystems that you may have used

Historically, different OSes have developed their own filesystems, often in a proprietary way. There are several major lineages of filesystems, made messy by business partnerships forming and breaking, and the inevitable spread of technological ideas between companies. Here are a few filesystems you might encounter today.

For Windows, NTFS has been the predominant filesystem since the 2000s, but the simpler FAT family of filesystems (FAT12, FAT16, FAT32, ExFAT) which were used in earlier Windows and DOS systems still appear on USB sticks and SD cards today due to their wide interoperability.

For Mac OS and other Apple devices, APFS was introduced in 2017 and is still the main filesystem in use. It replaces HFS+, which had been in use since 1998 (predating OS X) and was itself preceded by HFS.

For Linux systems, it’s possible to run the OS on top of many different filesystems, but ext4 is a common default at the time of writing and was designed primarily to support Linux. As you might guess from the name, it comes after ext, ext2, and ext3\. Btrfs is a Linux filesystem with a more modern design than ext4, but today it is only the default in certain Linux distributions like Fedora.

Many different filesystem formats have been invented across time and space. Look at how long this [list of _default_ filesystems](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;List%5Fof%5Fdefault%5Ffile%5Fsystems) is, let alone [this more complete list](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;List%5Fof%5Ffile%5Fsystems). There are so many!

Clearly some people have been hard at work in this corner of the universe. Yet the normal experience of using a computer is that there are files and folders, and you can’t really tell which filesystem you’re using without checking (or knowing OS trivia).

## The 0.01% of times in life when I _had_ to care about filesystems

To be honest, sometimes I think about filesystems even when I’m not being forced to. I just think they’re neat!

![Marge Simpson holding a filesystem](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,spl_X29H5gvQHxvuBoeb_ueuPoSFaJAqbVbp-hkOE-9Q&#x2F;https:&#x2F;&#x2F;metavee.github.io&#x2F;blog&#x2F;images&#x2F;filesystems&#x2F;marge-meme-defrag.webp)

But there have been times in my life when it _was_ externally justifiable, so let’s look at those times together:

## The era of Windows XP

When Windows XP first came out, our family computer was running Windows 98, and we wanted to do an in-place upgrade to Windows XP. Windows 98 used a FAT32 filesystem by default, but Windows XP used NTFS by default. XP could use FAT32, but a number of new features such as transparent compression and encryption required it.

From what I recall, we had the option to do an in-place filesystem upgrade to get access to the new features. This was risky, since any sort of failure or crash (or power outage) might have left the drive in a corrupted state (although the [docs](https:&#x2F;&#x2F;web.archive.org&#x2F;web&#x2F;20240722221148&#x2F;https:&#x2F;&#x2F;www.betaarchive.com&#x2F;wiki&#x2F;index.php?title&#x3D;Microsoft%5FKB%5FArchive&#x2F;156560) detail a few ways that the upgrade tool tried to minimize that risk). And we didn’t have the capacity to back up very much data, except for a handful of 1.44 MB floppies. There must have been some unlucky folks who lost a lot of data with that upgrade.

## When USB sticks got big

I think the first USB stick&#x2F;flash drive I ever used had a capacity of 128 MB. This was incredible in the mid 2000s, since the main alternatives were 1.44 MB floppies and 700 MB CD-RWs (which were slow and unpleasant and not writeable without a CD burner).

Every year, newer and bigger USB sticks were being sold. These were generally formatted with FAT32 for broad compatibility with different devices. As they got bigger, people started using them to transfer larger and larger files. But FAT32, being designed in the 90s, only allowed a maximum file size of 4 GB. So once the drives got larger than this, it became possible to encounter this filesystem error in normal usage.

I hit the error on occasion, usually because I was doing something like backing up all my files in a &#x60;.zip&#x60; file. The point of the &#x60;.zip&#x60; file was to save space, but having everything in one file pushed up against those filesystem limitations. Thankfully there were some workarounds that you could use if you were savvy. Compression software like [7-zip](https:&#x2F;&#x2F;www.7-zip.org&#x2F;) allowed splitting files into smaller pieces and reassembling them on the destination computer.

## Compatibility across operating systems

The first time I used Linux in 2007, I set it up to dual boot with Windows XP. I had to shrink down the Windows NTFS partition and allocate some space on the drive for my Linux partition, which was using the ext3 filesystem.

Inevitably there were times when I was booted into one OS but wanted to access files from the other. Sadly, I could only find a read-only NTFS driver for Linux at the time, so I had to create an additional FAT32 partition to pass files back and forth between the two OSes. Similarly, I can recall using some program I downloaded from the internet to access my Linux files from Windows, but it was also limited to read-only access at the time.

## Recovering deleted or corrupted files

This is sort of an anti-example since it’s more about specifically ignoring the filesystem.

When you delete a file, the contents of the file are usually still floating around on the disk. In essence, the filesystem is not erasing the data, it is erasing the record of _where the data was located_. This tends to be much faster than thoroughly wiping the data and saves wear and tear on the drive. Over time as new files are created and edited, parts of the “deleted” file will be overwritten with new things and eventually there will be no trace left.

But if you just recently deleted something important by accident and emptied the recycle bin, you might be able to look for those bytes on the disk and get the file back. This usually requires some knowledge of the original file type and might work better for some file formats (JPEGs) than others (executables). I’ve used [PhotoRec](https:&#x2F;&#x2F;www.cgsecurity.org&#x2F;wiki&#x2F;PhotoRec) in the past to recover accidentally-deleted vacation photos for family members, with moderate success.

It also applies if the drive gets into a corrupted state (perhaps the USB stick got yanked out while things were still being written) and the OS won’t open it. Even though some important metadata about the filesystem might be corrupted, you can scan every byte on the drive and make some educated guesses about where files begin and end.

## Other mentions

* Linux and other Unix-like OSes create a number of virtual files representing currently running processes, hardware attached to the computer and more. They aren’t actually stored on the disk and don’t count toward the used space, but to the user they look like regular files. This lets you do a lot in the terminal, like archiving a CD image with &#x60;cat &#x2F;dev&#x2F;cdrom &gt; my-cd-image.iso&#x60;. It gets a bit circular; the drive that contains the files also (appears) to contain itself.
* Dropbox, databases and other programs that place a high importance on data integrity care a lot about what filesystem you are using and what advanced options are being used (via [Dan Luu](https:&#x2F;&#x2F;danluu.com&#x2F;deconstruct-files&#x2F;))
* some filesystems like [ZFS](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;ZFS#Snapshots%5Fand%5Fclones) or [Btrfs](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Btrfs) allow you to take snapshots of files or the entire partition, allowing you to browse or restore old versions of files. This is interesting to me as it is (almost) like the filesystem is doing a job that is currently done by an app like git or a backup utility
* If you are using [RAID](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;RAID) or [LVM](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Logical%5FVolume%5FManager%5F%28Linux%29) to combine multiple disks into one virtual disk, your choice of filesystem might have a bigger-than-usual effect on performance and reliability
* file ownership and permissions are usually implemented at the filesystem level. This can get weird when sharing a drive across OSes, which might have conflicting ideas about what the usernames are, who has admin rights, etc.
* Docker and other container engines do a number of filesystem tricks to avoid taking up lots of space with many copies of the same files. In practice, the way they achieve this depends on the OS they’re running on and what filesystem is being used there (via [Julia Evans](https:&#x2F;&#x2F;jvns.ca&#x2F;blog&#x2F;2019&#x2F;11&#x2F;18&#x2F;how-containers-work--overlayfs&#x2F;))
* virtual filesystems can be shared across the network ([NFS](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Network%5FFile%5FSystem), [sshfs](https:&#x2F;&#x2F;github.com&#x2F;libfuse&#x2F;sshfs)). You can even take a cloud storage system like S3 and mount it as if it were a local filesystem ([s3fs](https:&#x2F;&#x2F;github.com&#x2F;s3fs-fuse&#x2F;s3fs-fuse)). These can get very janky when apps treat them like local disks and make wrong assumptions about what operations are fast&#x2F;slow&#x2F;literally cost money

## Will it ever matter again?

Looking at these examples, the common themes are mixing different operating systems (or versions of them), and crossing size thresholds that were previously beyond the scope of older filesystems.

So, are these examples a relic of the past? We are definitely in an era where interoperability is much better than it was in the past (aided by incessant software updates). Linux now ships with support for reading and writing NTFS. Windows also can add support for various Linux filesystems [via WSL2](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;windows&#x2F;wsl&#x2F;wsl2-mount-disk). Mac OS is admittedly not as good, lacking full support for NTFS and ext4 without third-party software. Even from the other side, reading HFS+ or especially APFS (let alone writing) is a challenge on other platforms.

As for size thresholds, filesystems in use today have limits in the petabytes and exabytes that are unlikely to be crossed for many years to come, at least by the typical home user. And many computers these days are mobile devices, which are strangely stingy with local storage (which is to say that they’re far from hitting the limits). On simpler portable devices, exFAT has emerged as a filesystem which is well supported by all major OSes while pushing the size limits into the petabytes - surely far enough for a while.

The data corruption&#x2F;recovery case is an interesting exception, although for the average home user, their data may be backed up or even live entirely in the cloud; if the local copy is corrupted, it’s probably better to just re-download it than attempt to recover it from the disk.

Still, cloud-based apps and services don’t live forever, and devices _can_ have long useful lives now. As the decades pass, your ability to access your old photos and data may come down to the humble disk where they originally lived, and whether or not you can still read the filesystem.

&gt; This post was written during my batch at the [Recurse Center](https:&#x2F;&#x2F;www.recurse.com&#x2F;). Thanks to many community members for giving feedback on earlier versions!