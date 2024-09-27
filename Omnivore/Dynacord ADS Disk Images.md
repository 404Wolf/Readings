---
id: 22b5c241-c51f-4b99-a34b-026a09e99fbf
title: Dynacord ADS Disk Images
tags:
  - RSS
date_published: 2024-09-14 16:05:23
---

# Dynacord ADS Disk Images
#Omnivore

[Read on Omnivore](https://omnivore.app/me/dynacord-ads-disk-images-191f2ac877e)
[Read Original](https://blog.jacobvosmaer.nl/0032-adsimg/)



I reverse-engineered some 1980&#39;s floppy disk images to extract WAV files from them. The code is in [this repo](https:&#x2F;&#x2F;github.com&#x2F;jacobvosmaer&#x2F;adsimg&#x2F;).

## The Dynacord ADS sampler

In the 1980s, German pro audio equipment manufacturer [Dynacord](https:&#x2F;&#x2F;www.muzines.co.uk&#x2F;gear&#x2F;0&#x2F;122&#x2F;0) also made electronic musical instruments. The company still exists but they seem to have gotten out of the musical instrument business.

I got curious about their 1986 [ADD One](https:&#x2F;&#x2F;www.muzines.co.uk&#x2F;articles&#x2F;new-addition&#x2F;1671) digital drum brain and I wanted to find the audio samples used inside that machine. This led me to a [German sequencer.de synthesizer forum thread](https:&#x2F;&#x2F;www.sequencer.de&#x2F;synthesizer&#x2F;threads&#x2F;vintage-soundlibrary-fuer-dynacord-ads-gefunden.149381&#x2F;page-3) where somebody shared disk images of a sound library for the 1990 [Dynacord ADS](https:&#x2F;&#x2F;www.muzines.co.uk&#x2F;articles&#x2F;dynacord-ads-sampler&#x2F;5752). It appears the ADS is a lower-cost successor to the ADD One that uses some of the same samples.

Great, so that meant I could hear and use the samples that are probably also in the ADD One.

## A mystery filesystem

The only problem was that the ADS seems to use a custom filesystem (they are not DOS floppies). People on sequencer.de mentioned you could play back the disk images themselves as raw 16-bit mono [big-endian](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Endianness) [PCM](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Pulse-code%5Fmodulation) audio data but then you hear lots of digital glitches in between the audio: the floppies contain data _and_ audio after all. 

![non-audio data followed by audio](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAH6esUMR93QUOLRDvfNgFzbfXIypQylImX7koWCeMEw&#x2F;https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;0032-adsimg&#x2F;assets&#x2F;112.001.png) _Note how the non-audio data on the left is not centered around the zero line: it has a DC offset. The audio data on the right is centered around 0._

I could edit the digital &quot;audio&quot; by hand to remove the glitches but that seemed silly. Wouldn&#39;t it be a much better use of my time to reverse-engineer enough of the floppy filesystem to allow me to separate the audio from the non-audio data?

(To be honest, I like these sort of challenges way too much, and I did not try very hard to find out if more is known about the filesystem of these floppies. I just threw myself on the puzzle.)

## Hexdumps

After staring at hex dumps for a long time (&#x60;hexdump -C floppy.img | less&#x60;) I finally started to see some patterns.

They all start like this, which is interesting but not helpful.

&#x60;&#x60;&#x60;angelscript

00000000  30 2e 30 30 20 44 79 6e  61 63 6f 72 64 20 41 64  |0.00 Dynacord Ad|
00000010  76 61 6e 63 65 64 20 44  69 67 74 61 6c 20 53 61  |vanced Digtal Sa|
00000020  6d 70 6c 65 72 2e 20 44  69 73 6b 20 6f 70 65 72  |mpler. Disk oper|
00000030  61 74 69 6e 67 20 73 79  73 74 65 6d 20 28 63 29  |ating system (c)|
00000040  20 31 39 38 38 20 46 61  73 74 20 46 6f 72 77 61  | 1988 Fast Forwa|
00000050  72 64 20 44 65 73 69 67  6e 73 20 70 72 6f 67 72  |rd Designs progr|
00000060  61 6d 20 62 79 20 4b 65  6c 76 69 6e 20 4d 63 4b  |am by Kelvin McK|
00000070  69 73 69 63 20 20 20 20  20 20 20 20 20 20 20 20  |isic            |
00000080  20 20 20 20 20 20 20 20  20 20 20 20 20 20 20 20  |                |

&#x60;&#x60;&#x60;

This is &#x60;hexdump -C&#x60; output. Each line shows 16 bytes as hexadecimal, with an ASCII interpratation on the right hand side. The numbers on the left are file offsets in hexadecimal (so &#x60;00000010&#x60; means that that line starts 0x10&#x3D;16 bytes into the file).

A bit further down you see a table of contents:

&#x60;&#x60;&#x60;lsl

000001f0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
00000200  43 48 52 42 45 4c 4c 41  4c 4c 01 00 00 00 01 00  |CHRBELLALL......|
00000210  43 48 52 42 45 4c 4c 50  41 4e 02 00 00 00 01 00  |CHRBELLPAN......|
00000220  42 45 4c 50 41 4e 46 4c  41 4e 03 00 00 00 01 00  |BELPANFLAN......|
00000230  42 45 4c 4c 20 53 49 4e  47 4c 04 00 00 00 01 00  |BELL SINGL......|
00000240  42 4c 41 4e 4b 20 4d 49  58 20 0a 00 00 00 01 00  |BLANK MIX ......|
00000250  20 48 4d 20 32 27 38 39  20 20 2d 00 00 00 01 00  | HM 2&#39;89  -.....|
00000260  54 4f 4e 45 20 53 4f 55  4e 44 00 01 00 00 02 00  |TONE SOUND......|
00000270  43 48 52 42 45 4c 4c 41  4c 44 01 01 00 00 02 00  |CHRBELLALD......|
00000280  42 45 4c 4c 20 4c 4f 57  4e 44 02 01 00 00 02 00  |BELL LOWND......|
00000290  42 45 4c 4c 20 4c 4f 55  4e 44 03 01 00 00 02 00  |BELL LOUND......|
000002a0  42 45 4c 4c 20 4c 4f 4d  4e 44 04 01 00 00 02 00  |BELL LOMND......|
000002b0  42 45 4c 4c 20 4d 49 44  4e 44 05 01 00 00 02 00  |BELL MIDND......|
000002c0  42 45 4c 4c 20 48 49 4d  4e 44 06 01 00 00 02 00  |BELL HIMND......|
000002d0  42 45 4c 4c 20 48 49 47  4e 44 07 01 00 00 02 00  |BELL HIGND......|
000002e0  43 48 52 42 45 4c 50 41  4c 44 08 01 00 00 02 00  |CHRBELPALD......|
000002f0  42 45 4c 4c 20 4c 4f 53  4e 44 09 01 00 00 02 00  |BELL LOSND......|
00000300  c3 48 2e 42 45 4c 4c 20  4c 4f 63 03 00 01 ce 00  |.H.BELL LOc.....|
00000310  c3 48 2e 42 45 4c 4c 20  4c 4d 63 04 00 02 f9 00  |.H.BELL LMc.....|
00000320  c3 48 2e 42 45 4c 4c 20  4d 49 63 05 00 02 f7 00  |.H.BELL MIc.....|
00000330  c3 48 2e 42 45 4c 4c 20  48 4d 63 06 00 02 ee 00  |.H.BELL HMc.....|
00000340  c3 48 2e 42 45 4c 4c 20  48 49 63 07 00 01 a3 00  |.H.BELL HIc.....|
00000350  20 20 20 20 20 20 20 20  20 20 7f ff 00 00 00 00  |          ......|

&#x60;&#x60;&#x60;

Luckily for me, the entries in the table of contents are 16 bytes long and they start at a multiple of 16 bytes into the file so they align perfectly with the &#x60;hexdump -C&#x60; output format. This appears to be a variable length array of 16-byte blocks with a special terminator block (the last line in the example above). Each block starts with 10 ASCII characters which appear to be a filename, followed by 6 bytes of additional data. Of those 6 bytes the third and sixth are always 0x00 so you could say there are only 4 bytes of additional data. This pattern also applied to the other floppy images.

There is something funny going on with the last 5 entries (not counting the terminator). Their first character 0xc3 is not an ASCII symbol. This floppy contains church bell sounds so you&#39;d expect a &#39;C&#39; character which is 0x43\. For whatever reason, the most significant bit is set to 1 resulting in 0xc3\. If we look at the non-name data at the end of each block we also see that these 5 blocks have 0x63 right after the name each time.

When you listen to the entire floppy image then apart from the glitches you can hear 5 different church bell sounds. So it seems likely that these 5 entries with their first name character mangled and 0x63 after the name are the audio samples?

I will spare you the details but I eventually figured out that this is indeed a list of the files on the floppy. The first file is always at address 0x2e00\. The 14th and 15th byte in the table of contents entry are the file size in 512-byte blocks. So in the example above, the file &#x60;CHRBELLALL&#x60; starts at 0x2e00 and is &#x60;1*512&#x3D;512&#x60; bytes long. The second file &#x60;CHRBELLPAN&#x60; starts at &#x60;0x2e00 + 512 &#x3D; 0x3000&#x60; and is also 512 bytes long. The last file &#x60;\xc3H.BELL HI&#x60; starts at 0x15ba00 and is &#x60;0x1a3 * 512 &#x3D; 214528&#x60; bytes long. To get the offset of a file in the table of contents you need to first add up the lengths of all the files that come before it.

## Writing the utilities

As I was figuring out this structure, the first thing I did was write a program that could read and parse the table of contents. I was manually verifying the results by looking in my audio editor and by playing fragments of the image extracted with &#x60;dd&#x60;. For example to play that last sample I would run:

&#x60;&#x60;&#x60;routeros

dd bs&#x3D;0x15ba00 skip&#x3D;1 if&#x3D;floppy.img | play -c1 -B -ts16 -r44100 -

&#x60;&#x60;&#x60;

This uses &#x60;play&#x60; from [SoX](https:&#x2F;&#x2F;sourceforge.net&#x2F;projects&#x2F;sox&#x2F;) to send the raw PCM data to my sound card.

Once this table-of-contents printer called &#x60;toc&#x60; was working well enough it produced output like this:

&#x60;&#x60;&#x60;xml

$ .&#x2F;toc &lt; floppy.img 
mix CHRBELLALL, p[10:15]&#x3D;01 00 00 00 01, offset&#x3D;00002e00, len&#x3D;512
mix CHRBELLPAN, p[10:15]&#x3D;02 00 00 00 01, offset&#x3D;00003000, len&#x3D;512
mix BELPANFLAN, p[10:15]&#x3D;03 00 00 00 01, offset&#x3D;00003200, len&#x3D;512
mix BELL SINGL, p[10:15]&#x3D;04 00 00 00 01, offset&#x3D;00003400, len&#x3D;512
mix BLANK MIX , p[10:15]&#x3D;0a 00 00 00 01, offset&#x3D;00003600, len&#x3D;512
mix  HM 2&#39;89  , p[10:15]&#x3D;2d 00 00 00 01, offset&#x3D;00003800, len&#x3D;512
snd TONE SOUND, p[10:15]&#x3D;00 01 00 00 02, offset&#x3D;00003a00, len&#x3D;1024
snd CHRBELLALD, p[10:15]&#x3D;01 01 00 00 02, offset&#x3D;00003e00, len&#x3D;1024
snd BELL LOWND, p[10:15]&#x3D;02 01 00 00 02, offset&#x3D;00004200, len&#x3D;1024
snd BELL LOUND, p[10:15]&#x3D;03 01 00 00 02, offset&#x3D;00004600, len&#x3D;1024
snd BELL LOMND, p[10:15]&#x3D;04 01 00 00 02, offset&#x3D;00004a00, len&#x3D;1024
snd BELL MIDND, p[10:15]&#x3D;05 01 00 00 02, offset&#x3D;00004e00, len&#x3D;1024
snd BELL HIMND, p[10:15]&#x3D;06 01 00 00 02, offset&#x3D;00005200, len&#x3D;1024
snd BELL HIGND, p[10:15]&#x3D;07 01 00 00 02, offset&#x3D;00005600, len&#x3D;1024
snd CHRBELPALD, p[10:15]&#x3D;08 01 00 00 02, offset&#x3D;00005a00, len&#x3D;1024
snd BELL LOSND, p[10:15]&#x3D;09 01 00 00 02, offset&#x3D;00005e00, len&#x3D;1024
sam CH.BELL LO, p[10:15]&#x3D;63 03 00 01 ce, offset&#x3D;00006200, len&#x3D;236544
sam CH.BELL LM, p[10:15]&#x3D;63 04 00 02 f9, offset&#x3D;0003fe00, len&#x3D;389632
sam CH.BELL MI, p[10:15]&#x3D;63 05 00 02 f7, offset&#x3D;0009f000, len&#x3D;388608
sam CH.BELL HM, p[10:15]&#x3D;63 06 00 02 ee, offset&#x3D;000fde00, len&#x3D;384000
sam CH.BELL HI, p[10:15]&#x3D;63 07 00 01 a3, offset&#x3D;0015ba00, len&#x3D;214528

&#x60;&#x60;&#x60;

At this stage I had figured out that the floppies contain 3 types of file: &quot;mix&quot;, &quot;sound&quot; and &quot;sample&quot;. I still don&#39;t know how to parse the mixes and sounds but I only cared about the samples for now.

The next step was to write a program that could extract the samples. To begin with I split &#x60;toc.c&#x60; into two parts: [adsimg.c](https:&#x2F;&#x2F;github.com&#x2F;jacobvosmaer&#x2F;adsimg&#x2F;blob&#x2F;master&#x2F;adsimg.c) to parse the table of contents and [toc.c](https:&#x2F;&#x2F;github.com&#x2F;jacobvosmaer&#x2F;adsimg&#x2F;blob&#x2F;master&#x2F;toc.c) to print it.

The splitting program is in [split.c](https:&#x2F;&#x2F;github.com&#x2F;jacobvosmaer&#x2F;adsimg&#x2F;blob&#x2F;master&#x2F;split.c). It took me a while to figure out that each sample has 512 bytes of header and trailer data that is not part of the audio. (The header and trailer _look_ like audio most of the time.) Another fun complication was the fact that apparently the ADS can split sample files across multiple floppies. This makes sense because the ADS has more than a floppy&#39;s worth of RAM. I managed to sort this out in &#x60;split.c&#x60; so that it merges samples that cross floppy boundaries back into a single WAV file.

And of course, because I want to do everything myself, I wrote my own [function that turns the raw PCM data into WAV files](https:&#x2F;&#x2F;github.com&#x2F;jacobvosmaer&#x2F;adsimg&#x2F;blob&#x2F;e4c64fa963a3327a646fff548cf62d6b30487f80&#x2F;split.c#L26-L56). This is all part of the learning and the fun for me.

## Conclusion

The floppy image collection from the forum contains 120 images. I did some Bash scripting to run my &#x60;split&#x60; program on each of them. The end result is over 1300 WAV files. As silly as it seems to have spent at least 2 days staring at hexdumps and writing my utilities, it was more fun to do that than to manually select and save 1300 audio file regions in an audio editor!

Tags:[music](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;music.html) 

Edit history

[Back](https:&#x2F;&#x2F;blog.jacobvosmaer.nl&#x2F;)