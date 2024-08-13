---
id: a0a883d2-d78d-421a-a7ad-88ddf024efd7
title: A silly mistake that I made with io.TeeReader
tags:
  - RSS
date_published: 2024-06-26 22:01:04
---

# A silly mistake that I made with io.TeeReader
#Omnivore

[Read on Omnivore](https://omnivore.app/me/a-silly-mistake-that-i-made-with-io-tee-reader-19057f9ead2)
[Read Original](https://vishnubharathi.codes/blog/a-silly-mistake-that-i-made-with-io.teereader/)



I recently made a silly mistake while using &#x60;io.TeeReader&#x60; in Go and I am writing this blog post to sum up my learnings from this experience.

## [](#Why-I-used-it-in-the-first-place &quot;Why I used it in the first place&quot;)Why I used it in the first place

Ok, here is why I chose to use it in the first place: I had some content and two functions that needed that content and perform uploads to two different HTTP endpoints. Something like

| 123456789101112131415161718192021222324252627282930313233 | func main() {	Upload(strings.NewReader(&quot;hello world&quot;))}func Upload(r io.Reader) error {	if err :&#x3D; firstUpload(r); err !&#x3D; nil {		return err	}	if err :&#x3D; secondUpload(r); err !&#x3D; nil {		return err	}	return nil}func firstUpload(r io.Reader) error {	content :&#x3D; io.MultiReader(strings.NewReader(&quot;first upload:&quot;), r, strings.NewReader(&quot;\\n&quot;))	if \_, err :&#x3D; io.Copy(os.Stdout, content); err !&#x3D; nil {		return err	}	return nil}func secondUpload(r io.Reader) error {	content :&#x3D; io.MultiReader(strings.NewReader(&quot;second upload:&quot;), r, strings.NewReader(&quot;\\n&quot;))	if \_, err :&#x3D; io.Copy(os.Stdout, content); err !&#x3D; nil {		return err	}	return nil} |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

The output of the above program would be

| 12 | first upload:hello worldsecond upload: |
| -- | -------------------------------------- |

The first upload consumes all the data from the reader and by the time the reader reaches the second upload, there isn’t anything to be read. If this is new to you, I encourage you to take a look at the standard lib docs for &#x60;io.Reader&#x60; to better understand the situation: &lt;https:&#x2F;&#x2F;pkg.go.dev&#x2F;io#Reader&gt;

## [](#Using-TeeReader-but-with-my-mistake &quot;Using TeeReader (but with my mistake)&quot;)Using TeeReader (but with my mistake)

OK, so what do I do now? I google search the problem and discover about Go’s [io.TeeReader](https:&#x2F;&#x2F;pkg.go.dev&#x2F;io#TeeReader). Let us see what the program would look like after I tried to use the TeeReader.

func Upload(r io.Reader) error {  
	contentForFirstUpload :&#x3D; new(bytes.Buffer)  
	contentForSecondUpload :&#x3D; io.TeeReader(r, contentForFirstUpload)  
  
	if err :&#x3D; firstUpload(contentForFirstUpload); err !&#x3D; nil {  
		return err  
	}  
  
	if err :&#x3D; secondUpload(contentForSecondUpload); err !&#x3D; nil {  
		return err  
	}  
  
	return nil  
}  

And the output for this is

| 12 | first upload:second upload:hello world |
| -- | -------------------------------------- |

That is weird. The second upload is succeeding but not the first one?

## [](#Fixing-the-mistake &quot;Fixing the mistake&quot;)Fixing the mistake

This probably is the best place to quote the docs of &#x60;io.TeeReader&#x60;:

| 1 | func TeeReader(r Reader, w Writer) Reader |
| - | ----------------------------------------- |

&gt; TeeReader returns a Reader that writes to w what it reads from r. All reads from r performed through it are matched with corresponding writes to w. There is no internal buffering - the write must complete before the read completes. Any error encountered while writing is reported as a read error.

So we get back a Reader (&#x60;contentForSecondUpload&#x60; in our case) and when that is read, a simultaneous write is happening to the writer (&#x60;contentForFirstUpload&#x60; in our case) that we pass. But what happens in the code is, we try to read from the writer before writes are happening to it.

I am not sure if I did a good job of explaining the fix in plain words above, but here is the code that fixes the problem:

func Upload(r io.Reader) error {  
	contentForSecondUpload :&#x3D; new(bytes.Buffer)  
	contentForFirstUpload :&#x3D; io.TeeReader(r, contentForSecondUpload)  
  
	if err :&#x3D; firstUpload(contentForFirstUpload); err !&#x3D; nil {  
		return err  
	}  
  
	if err :&#x3D; secondUpload(contentForSecondUpload); err !&#x3D; nil {  
		return err  
	}  
  
	return nil  
}  

So rule no.1 here is: always read the reader returned back from &#x60;io.TeeReader&#x60; first. That is the thing that is copying the data and making it available for the other buffer (writer).

That’s it, that is the only rule.

## [](#io-Pipe &quot;io.Pipe&quot;)io.Pipe

Now that we have fixed the problem, I think we can take a short detour to visit one of my favorite Go constructs: &#x60;io.Pipe&#x60; which could also help solve these kinds of problems.

Here is a quick refactor of our code using &#x60;io.Pipe&#x60;.

func Upload(r io.Reader) error {  
	var upload errgroup.Group  
  
	fr, fw :&#x3D; io.Pipe()  
	upload.Go(func() error {  
		return firstUpload(fr)  
	})  
  
	sr, sw :&#x3D; io.Pipe()  
	upload.Go(func() error {  
		return secondUpload(sr)  
	})  
  
	upload.Go(func() error {  
		var err error  
		defer func() {  
			fw.CloseWithError(err)  
			sw.CloseWithError(err)  
		}()  
  
		_, err &#x3D; io.Copy(io.MultiWriter(fw, sw), r)  
		return err  
	})  
  
	return upload.Wait()  
}  

This has some advantages and one of them would have helped me in avoiding my mistake with &#x60;io.TeeReader&#x60;.

* uploads become concurrent naturally unlike TeeReader where it is sequential.
* the order in which we read the readers for the first upload and second upload does not matter anymore.

With that said, I would still be mindful about introducing &#x60;io.Pipe&#x60;. Here is what I have decided.

If I need to write to one or two writers and do not need concurrency, I would stick with &#x60;io.TeeReader&#x60;. I will stick to &#x60;io.Pipe&#x60; for every other case.