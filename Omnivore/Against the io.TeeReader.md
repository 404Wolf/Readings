---
id: ba9318ff-4c12-4d57-8386-f9d845d8b453
title: Against the io.TeeReader
tags:
  - RSS
date_published: 2024-06-28 16:06:56
---

# Against the io.TeeReader
#Omnivore

[Read on Omnivore](https://omnivore.app/me/against-the-io-tee-reader-190616e6f15)
[Read Original](https://vishnubharathi.codes/blog/against-the-io.teereader/)



This is a follow-up blog post to my previous blog post about the &#x60;io.TeeReader&#x60; in Go. Here is the link for it if you haven’t read it yet: &lt;https:&#x2F;&#x2F;vishnubharathi.codes&#x2F;blog&#x2F;a-silly-mistake-that-i-made-with-io.teereader&#x2F;&gt;

## [](#Motivation &quot;Motivation&quot;)Motivation

The motivation for this blog post is [this Reddit comment](https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;golang&#x2F;comments&#x2F;1dpfz28&#x2F;comment&#x2F;lah1uzz&#x2F;). One of the reasons why I write blog posts and share them on the internet is because I almost always learn more from the comments. That comment made me think more about the code I wrote in the previous blog post and realize some things I want to write up here. (A big thanks to the people writing insightful comments on the internet)

## [](#That-weird-new-bytes-Buffer &quot;That weird new(bytes.Buffer)&quot;)That weird &#x60;new(bytes.Buffer)&#x60;

To recap, I had a &#x60;io.Reader&#x60; as input and I was trying to read it twice so that I could upload the same data two times. Here is how the final solution looked like when using an &#x60;io.TeeReader&#x60;:

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

I always felt weird about the &#x60;new(bytes.Buffer)&#x60; that I have allocated in the code.

## [](#The-whole-point &quot;The whole point&quot;)The whole point

The whole point of &#x60;io.TeeReader&#x60; is to take in one source reader and perform reads on it efficiently and make the data available at the other two ends of the “T”.

One of the highlights of that Reddit comment is, if I am allocating a buffer to store the contents of the source reader, why use a TeeReader at all?

&gt; If you’re going to allocate a buffer, then you might read the entire thing into memory first and read it twice.

That would look like

func Upload(r io.Reader) error {  
	contentForUpload, err :&#x3D; io.ReadAll(r)  
	if err !&#x3D; nil {  
		return err  
	}  
  
	if err :&#x3D; firstUpload(bytes.NewReader(contentForUpload)); err !&#x3D; nil {  
		return err  
	}  
  
	if err :&#x3D; secondUpload(bytes.NewReader(contentForUpload)); err !&#x3D; nil {  
		return err  
	}  
  
	return nil  
}  

This is a valid solution if I am okay with reading the entire input in memory and want my uploads to happen synchronously one after another.

## [](#io-TeeReader-io-Pipe &quot;io.TeeReader + io.Pipe&quot;)io.TeeReader + io.Pipe

The comment made me realize that we could use &#x60;io.TeeReader&#x60; and &#x60;io.Pipe&#x60; together to achieve concurrent uploads like my final solution in the previous blog post did.

func Upload(r io.Reader) error {  
	contentForSecondUpload, contentWriter :&#x3D; io.Pipe()  
	contentForFirstUpload :&#x3D; io.TeeReader(r, contentWriter)  
  
	var upload errgroup.Group  
	upload.Go(func() error {  
		return firstUpload(contentForFirstUpload)  
	})  
	upload.Go(func() error {  
		return secondUpload(contentForSecondUpload)  
	})  
	return upload.Wait()  
}  

I am going to take this step by step. The above program would cause a deadlock. The reason: &#x60;contentWriter&#x60; is not closed and the &#x60;secondUpload&#x60; will always be waiting for more content to be available which it will never receive. To fix it, we must close the &#x60;contentWriter&#x60; somewhere, but where?

In the case of the pure &#x60;io.Pipe&#x60; implementation in the previous blog post, it was clear: We close the writers in the go routine where we finish the writing.

In the case of a TeeReader, the writes for &#x60;contentForSecondUpload&#x60; is complete when the read of &#x60;contentForFirstUpload&#x60; is finished. That looks like:

func Upload(r io.Reader) error {  
	contentForSecondUpload, contentWriter :&#x3D; io.Pipe()  
	contentForFirstUpload :&#x3D; io.TeeReader(r, contentWriter)  
  
	var upload errgroup.Group  
	upload.Go(func() error {  
		var err error  
		defer func() {  
			contentWriter.CloseWithError(err)  
		}()  
		err &#x3D; firstUpload(contentForFirstUpload)  
		return err  
	})  
	upload.Go(func() error {  
		return secondUpload(contentForSecondUpload)  
	})  
	return upload.Wait()  
}  

I feel that the above code would be hard to follow. It can easily make one spend time thinking about “why would they close the writer of the second reader after reading the first reader?”.

The pure &#x60;io.Pipe&#x60; implementation feels more natural and human-friendly: we close the writer in the go routine where we are done writing to all the writers. At the same time, it gets the job done.

## [](#Verdict &quot;Verdict&quot;)Verdict

I will avoid using &#x60;io.TeeReader&#x60; at all places and prefer using &#x60;io.Pipe + io.MultiWriter&#x60; instead. (the code from the previous blog post)

That makes the code efficient, concurrent, and easy to read&#x2F;write&#x2F;extend.

\~ \~ \~ \~

Always use the pipe and close it.