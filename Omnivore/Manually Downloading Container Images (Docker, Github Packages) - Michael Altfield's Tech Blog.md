---
id: f0cd229b-14e7-4df3-9f2d-44a36a29394a
title: Manually Downloading Container Images (Docker, Github Packages) - Michael Altfield's Tech Blog
tags:
  - RSS
date_published: 2024-09-03 00:01:37
---

# Manually Downloading Container Images (Docker, Github Packages) - Michael Altfield's Tech Blog
#Omnivore

[Read on Omnivore](https://omnivore.app/me/manually-downloading-container-images-docker-github-packages-mic-191b93bace0)
[Read Original](https://tech.michaelaltfield.net/2024/09/03/container-download-curl-wget/)



This article will describe how to download an image from a (docker) container registry.

[![Manual Download of Container Images with wget and curl](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1200x628,sTAINQP4kiBAnCgHotd0j-BBdHyg4S0GMiCi5DppFBnk&#x2F;https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;xcontainer-download-curl-wget_featuredImage1.jpg.pagespeed.ic.a2V6BtJ0d1.jpg)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;container-download-curl-wget%5FfeaturedImage1.jpg)

## Intro

Remember the good &#39;ol days when you could just download software by visiting a website and click &quot;download&quot;?

Even &#x60;apt&#x60; and &#x60;yum&#x60; repositories were just simple HTTP servers that you could just &#x60;curl&#x60; (or &#x60;wget&#x60;) from. Using the package manager was, of course, more secure and convenient -- but you could always just download packages manually, if you wanted.

But **have you ever tried to &#x60;curl&#x60; an image from a container registry**, such as docker? Well friends, I have tried. And I have the [scars](https:&#x2F;&#x2F;github.com&#x2F;BusKill&#x2F;buskill-app&#x2F;issues&#x2F;78#issuecomment-1987374445) to prove it.

It was a remarkably complex process that took me weeks to figure-out. Lucky you, this article will break it down.

## Examples

Specifically, we&#39;ll look at how to download files from two OCI registries.

1. [Docker Hub](#docker-hub)
2. [GitHub Packages](#github-packages)

## Terms

First, here&#39;s some terminology used by OCI

1. OCI - [Open Container Initiative](#what-oci)
2. blob - A &quot;blob&quot; in the OCI spec just means a file
3. manifest - A &quot;manifest&quot; in the OCI spec means a list of files

## Prerequisites

This guide was written in 2024, and it uses the following software and versions:

1. debian 12 (bookworm)
2. curl 7.88.1
3. OCI Distribution Spec v1.1.0 (which, unintuitively, uses the &#39;[&#x2F;v2&#x2F;](https:&#x2F;&#x2F;github.com&#x2F;distribution&#x2F;distribution&#x2F;blob&#x2F;5e75227fb213162564bab74b146300ffed9f0bbd&#x2F;docs&#x2F;content&#x2F;spec&#x2F;api.md)&#39; endpoint)

Of course, you&#39;ll need &#39;&#x60;curl&#x60;&#39; installed. And, to parse json, &#39;&#x60;jq&#x60;&#39; too.

&#x60;sudo&#x60; &#x60;apt-get &#x60; &#x60;install&#x60; &#x60;curl jq&#x60;

## What is OCI?

OCI stands for Open Container Initiative.

OCI was [originally formed](https:&#x2F;&#x2F;opencontainers.org&#x2F;about&#x2F;overview&#x2F;) in June 2015 for Docker and CoreOS. Today it&#39;s a wider, general-purpose (and annoyingly complex) way that many projects host files (that are extremely non-trivial to download).

One does not simply download a file from an OCI-complianet container registry. You must:

1. Generate an authentication token for the API
2. Make an API call to the registry, requesting to download a JSON &quot;Manifest&quot;
3. Parse the JSON Manifest to figure out the hash of the file that you want
4. Determine the download URL from the hash
5. Download the file (which might actually be many distinct file &quot;layers&quot;)

[![One does not simply download from a container registry](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1452x708,sHRm7fkeEcNpTqdeS57Peykg10AQtqYXUU_TDeGduwsA&#x2F;https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;xcontainer-download-curl-wget_one-does-not-simply1.jpg.pagespeed.ic.dqHglfs-oy.jpg)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;container-download-curl-wget%5Fone-does-not-simply1.jpg)

In order to figure out how to make an API call to the registry, you must first read (and understand) the OCI specs [here](https:&#x2F;&#x2F;opencontainers.org&#x2F;release-notices&#x2F;overview&#x2F;).

* &lt;https:&#x2F;&#x2F;opencontainers.org&#x2F;release-notices&#x2F;overview&#x2F;&gt;

## OCI APIs

OCI maintains three distinct specifications:

1. image spec
2. runtime spec
3. distribution spec

### OCI &quot;Distribution Spec&quot; API

To figure out how to download a file from a container registry, we&#39;re interested in the &quot;distribution spec&quot;. At the time of writing, the latest &quot;distribution spec&quot; can be downloaded [here](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec&#x2F;releases&#x2F;download&#x2F;v1.1.0&#x2F;oci-distribution-spec-v1.1.0.pdf):

* &lt;https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec&#x2F;releases&#x2F;tag&#x2F;v1.1.0&gt;
* &lt;https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec&#x2F;releases&#x2F;download&#x2F;v1.1.0&#x2F;oci-distribution-spec-v1.1.0.pdf&gt;

The above PDF file defines a set of API endpoints that we can use to query, parse, and then figure out how to download a file from a container registry. The table from the above PDF is copied below:

| ID      | Method     | API Endpoint                                                 | Success | Failure     |
| ------- | ---------- | ------------------------------------------------------------ | ------- | ----------- |
| end-1   | GET        | &#x2F;v2&#x2F;                                                         | 200     | 404&#x2F;401     |
| end-2   | GET &#x2F; HEAD | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;&lt;digest&gt;                                    | 200     | 404         |
| end-3   | GET &#x2F; HEAD | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;manifests&#x2F;&lt;reference&gt;                             | 200     | 404         |
| end-4a  | POST       | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;uploads&#x2F;                                    | 202     | 404         |
| end-4b  | POST       | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;uploads&#x2F;?digest&#x3D;&lt;digest&gt;                    | 201&#x2F;202 | 404&#x2F;400     |
| end-5   | PATCH      | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;uploads&#x2F;&lt;reference&gt;                         | 202     | 404&#x2F;416     |
| end-6   | PUT        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;uploads&#x2F;&lt;reference&gt;?digest&#x3D;&lt;digest&gt;         | 201     | 404&#x2F;400     |
| end-7   | PUT        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;manifests&#x2F;&lt;reference&gt;                             | 201     | 404         |
| end-8a  | GET        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;tags&#x2F;list                                         | 200     | 404         |
| end-8b  | GET        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;tags&#x2F;list?n&#x3D;&lt;integer&gt;&amp;last\&#x3D;&lt;integer&gt;             | 200     | 404         |
| end-9   | DELETE     | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;manifests&#x2F;&lt;reference&gt;                             | 202     | 404&#x2F;400&#x2F;405 |
| end-10  | DELETE     | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;&lt;digest&gt;                                    | 202     | 404&#x2F;405     |
| end-11  | POST       | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;uploads&#x2F;?mount&#x3D;&lt;digest&gt;&amp;from\&#x3D;&lt;other\_name&gt; | 201     | 404         |
| end-12a | GET        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;referrers&#x2F;&lt;digest&gt;                                | 200     | 404&#x2F;400     |
| end-12b | GET        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;referrers&#x2F;&lt;digest&gt;?artifactType&#x3D;&lt;artifactType&gt;    | 200     | 404&#x2F;400     |
| end-13  | GET        | &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;uploads&#x2F;&lt;reference&gt;                         | 204     | 404         |

In OCI, files are (cryptically) called &quot;&#x60;blobs&#x60;&quot;. In order to figure out the file that we want to download, we must first reference the list of files (called a &quot;&#x60;manifest&#x60;&quot;).

The above table shows us how we can download a list of files (manifest) and then download the actual file (blob).

## Examples

Let&#39;s look at how to download files from a couple different OCI registries:

1. [Docker Hub](#docker-hub)
2. [GitHub Packages](#github-packages)

## Docker Hub

Probably the most well-known OCI registry is [Docker Hub](https:&#x2F;&#x2F;hub.docker.com&#x2F;). Indeed, as stated above, Docker was one of the original founding members of OCI, and they contributed the original specifications and implementations of the OCI runtime and image specifications.

In this example, we&#39;ll manually download the official docker image for [hitch](https:&#x2F;&#x2F;github.com&#x2F;varnish&#x2F;docker-hitch&#x2F;), and then we&#39;ll manually import it into docker.

### Determine Package Name

The easiest way to figure out a given docker image&#39;s namespace is to use the WUI: [hub.docker.com](https:&#x2F;&#x2F;hub.docker.com&#x2F;).

After loading the above page, just type the package name (in our case &#39;&#x60;hitch&#x60;&#39;) into the search bar.

It might be difficult to determine which is the official author of the docker image that you want to download, as many third party providers may provide an image of similar or identical name.

If the official project documentation doesn&#39;t explicitly link to the official listing on Docker Hub, it may be a good idea to contact the developer to confirm which account is publishing their official docker releases (and then open a ticket or PR to update the docs with this info). In any case, you should never expect the files downloaded from Docker Hub to be authentic, even if you confirmed the namespace to be correct -- because [Docker infamously lacks authentication](#3tofu) of everything that it downloads by default.

The namespace of the repository for a given package in Docker Hub is typically &#39;&#x60;library&#x2F;&lt;package_name&gt;&#x60;&#39;. So, for &#39;&#x60;hitch&#x60;&#39;, **our namespace is going to be &#39;&#x60;library&#x2F;hitch&#x60;&#39;**.

### Determine Package Tag

Click on the &quot;Tags&quot; tab to view all of the tags available for the image.

 Click on the “Tags” tab to see all of the tags for images for the listing

 In this example, we’ll be using the most-recent stable version of hitch, which is “1.8.0-1” (at the time of writing)

  
In our case, **we&#39;ll use the latest version at the time of writing, which is &#39;&#x60;1.8.0-1&#x60;&#39;**

### Get an Auth Token

Execute the following command to get an [authentication token](https:&#x2F;&#x2F;distribution.github.io&#x2F;distribution&#x2F;spec&#x2F;auth&#x2F;oauth&#x2F;) from Docker Hub within the scope of the &#39;&#x60;hitch&#x60;&#39; package&#39;s namespace.

&gt; ⓘ INFO: If you&#39;re like me and wondering where the heck is the OCI spec that defines this \&#x60; &#x60;&#x2F;token&#x60;\&#x60; endpoint for authentication, know that [it doesn&#39;t exist](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec&#x2F;issues&#x2F;240) ![🤦](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s8plKCHO725n4UUd7_FOhZ3YCj11YdR6PYFVRYBwGkj0&#x2F;https:&#x2F;&#x2F;s.w.org&#x2F;images&#x2F;core&#x2F;emoji&#x2F;14.0.0&#x2F;svg&#x2F;1f926.svg)
&gt; 
&gt; To learn more about the syntax of this URL and &#39;&#x60;scope&#x60;&#39; GET variable, see docker&#39;s [Token Scope Documentation](https:&#x2F;&#x2F;distribution.github.io&#x2F;distribution&#x2F;spec&#x2F;auth&#x2F;scope&#x2F;).

The above commands will get a free&#x2F;temporary token that you can use in subsequent API calls. If all went well, there will be no output from these commands. Here&#39;s an example execution

### List the Tags

We can list all of the available tags for the &#39;&#x60;hitch&#x60;&#39; package with the &#39;&#x60;GET &#x2F;v2&#x2F;&lt;name&gt;&#x2F;tags&#x2F;list&#x60;&#39; API endpoint, as shown in the [table](#table) above

&#x60;curl -i -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;registry-1&#x60; &#x60;.docker.io&#x60; &#x60;&#x2F;v2&#x2F;library&#x2F;&#x60; &#x60;&lt;package_name&gt;&#x60; &#x60;&#x2F;tags&#x2F;list&#x60;

Here&#39;s an example execution. Note that it affirms the existence of the &#39;&#x60;1.8.0-1&#x60;&#39; tag that we found above.

&#x60;user@disp7456:~$ curl -i -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;registry-1&#x60; &#x60;.docker.io&#x60; &#x60;&#x2F;v2&#x2F;library&#x2F;hitch&#x2F;tags&#x2F;list&#x60;

&#x60;HTTP&#x60; &#x60;&#x2F;1&#x60; &#x60;.1 200 OK&#x60;

&#x60;content-&#x60; &#x60;type&#x60; &#x60;: application&#x60; &#x60;&#x2F;json&#x60;

&#x60;docker-distribution-api-version: registry&#x60; &#x60;&#x2F;2&#x60; &#x60;.0&#x60;

&#x60;date&#x60; &#x60;: Tue, 04 Jun 2024 21:11:33 GMT&#x60;

&#x60;content-length: 131&#x60;

&#x60;strict-transport-security: max-age&#x3D;31536000&#x60;

&#x60;{&#x60; &#x60;&quot;name&quot;&#x60; &#x60;:&#x60; &#x60;&quot;library&#x2F;hitch&quot;&#x60; &#x60;,&#x60; &#x60;&quot;tags&quot;&#x60; &#x60;:[&#x60; &#x60;&quot;1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7.0&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7.0-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7.2&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7.2-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7.3&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.7.3-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.8&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.8.0&quot;&#x60; &#x60;,&#x60; &#x60;&quot;1.8.0-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;latest&quot;&#x60; &#x60;]}&#x60;

&#x60;user@disp7456:~$ &#x60;

### Download the Manifest

We can download the manifest for the &#39;&#x60;1.8.0-1&#x60;&#39; tag of the &#39;&#x60;hitch&#x60;&#39; package with the &#39;&#x60;GET &#x2F;v2&#x2F;&lt;name&gt;&#x2F;manifests&#x2F;&lt;reference&gt;&#x60;&#39; API endpoint, as shown in the [table](#table) above

&#x60;curl -o manifest.json -s -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;registry-1&#x60; &#x60;.docker.io&#x60; &#x60;&#x2F;v2&#x2F;library&#x2F;&#x60; &#x60;&lt;package_name&gt;&#x60; &#x60;&#x2F;manifests&#x2F;&#x60; &#x60;&lt;tag&gt;&#x60;

And here&#39;s an example execution that downloads the manifest for the &#39;&#x60;1.8.0-1&#x60;&#39; tag of the &#39;&#x60;hitch&#x60;&#39; package

&#x60;user@disp7456:~$ curl -o manifest.json -s -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;registry-1&#x60; &#x60;.docker.io&#x60; &#x60;&#x2F;v2&#x2F;library&#x2F;hitch&#x2F;manifests&#x2F;1&#x60; &#x60;.8.0-1&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;ls&#x60;

&#x60;manifest.json&#x60;

&#x60;user@disp7456:~$ &#x60;

### Parse the Manifest

The previous step downloaded a file named &#39;&#x60;manifest.json&#x60;&#39;. This &#39;&#x60;manifest.json&#x60;&#39; file lists all of the &quot;layers&quot; that make up the image of the &#39;&#x60;hitch&#x60;&#39; package.

Each &quot;layer&quot; consists of a tarball and some metadata about the layer in json format. The information that we need to download the layer&#39;s tar file is located in the &#39;&#x60;manifest.json&#x60;&#39; file. And the metadata about each layer is also in the &#39;&#x60;manifest.json&#x60;&#39; file.

The format of the &#39;&#x60;manifest.json&#x60;&#39; file is &#39;&#x60;vnd.docker.distribution.manifest.v1+json&#x60;&#39;, which is defined in [Image Manifest Version 2, Schema 1](https:&#x2F;&#x2F;github.com&#x2F;distribution&#x2F;distribution&#x2F;blob&#x2F;bf9f80eaffb0eabc768762bc4ff03ded277ea594&#x2F;docs&#x2F;spec&#x2F;manifest-v2-1.md).

Most importantly, the &#39;&#x60;manifest.json&#x60;&#39; file contains two [parallel arrays](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Parallel%5Farray) of the same length:

1. fsLayers\[\]
2. history\[\]

Consider this truncated snippet of the manifest for the &#39;&#x60;hitch&#x60;&#39; package&#39;s &#39;&#x60;1.8.0-1&#x60;&#39; tag:

&#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;schemaVersion&quot;&#x60; &#x60;: 1,&#x60;

&#x60;&#x60; &#x60;&quot;name&quot;&#x60; &#x60;: &#x60; &#x60;&quot;library&#x2F;hitch&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;tag&quot;&#x60; &#x60;: &#x60; &#x60;&quot;1.8.0-1&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;architecture&quot;&#x60; &#x60;: &#x60; &#x60;&quot;amd64&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;fsLayers&quot;&#x60; &#x60;: [&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:3148f4af0a813bcff0a3ed2562aabfb1b596b52ef36eb5eb4d82ce836350b73a&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a0e9543db8c1238572466cf00b55436bc7b7e849f7cb305128f391a94b75c2fc&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;blobSum&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:728328ac3bde9b85225b1f0d60f5c149f5635a191f5d8eaeeb00e095d36ef9fd&quot;&#x60;

&#x60;&#x60; &#x60;}&#x60;

&#x60;&#x60; &#x60;],&#x60;

&#x60;&#x60; &#x60;&quot;history&quot;&#x60; &#x60;: [&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;architecture\&quot;:\&quot;amd64\&quot;,\&quot;config\&quot;:{\&quot;Hostname\&quot;:\&quot;\&quot;,\&quot;Domainname\&quot;:\&quot;\&quot;,\&quot;User\&quot;:\&quot;\&quot;,\&quot;AttachStdin\&quot;:false,\&quot;AttachStdout\&quot;:false,\&quot;AttachStderr\&quot;:false,\&quot;ExposedPorts\&quot;:{\&quot;443&#x2F;tcp\&quot;:{}},\&quot;Tty\&quot;:false,\&quot;OpenStdin\&quot;:false,\&quot;StdinOnce\&quot;:false,\&quot;Env\&quot;:[\&quot;PATH&#x3D;&#x2F;usr&#x2F;local&#x2F;sbin:&#x2F;usr&#x2F;local&#x2F;bin:&#x2F;usr&#x2F;sbin:&#x2F;usr&#x2F;bin:&#x2F;sbin:&#x2F;bin\&quot;],\&quot;Cmd\&quot;:[],\&quot;Image\&quot;:\&quot;sha256:996009c7d7eb032c9ea750e5decc1f8aedbf4530b892cf4ebc7716e1458f36d9\&quot;,\&quot;Volumes\&quot;:null,\&quot;WorkingDir\&quot;:\&quot;&#x2F;etc&#x2F;hitch\&quot;,\&quot;Entrypoint\&quot;:[\&quot;docker-hitch-entrypoint\&quot;],\&quot;OnBuild\&quot;:null,\&quot;Labels\&quot;:null},\&quot;container\&quot;:\&quot;0ff54ee96c4bbfe77da3b2124720ef95c6154d3bc1d3e40a168920dd818367c4\&quot;,\&quot;container_config\&quot;:{\&quot;Hostname\&quot;:\&quot;0ff54ee96c4b\&quot;,\&quot;Domainname\&quot;:\&quot;\&quot;,\&quot;User\&quot;:\&quot;\&quot;,\&quot;AttachStdin\&quot;:false,\&quot;AttachStdout\&quot;:false,\&quot;AttachStderr\&quot;:false,\&quot;ExposedPorts\&quot;:{\&quot;443&#x2F;tcp\&quot;:{}},\&quot;Tty\&quot;:false,\&quot;OpenStdin\&quot;:false,\&quot;StdinOnce\&quot;:false,\&quot;Env\&quot;:[\&quot;PATH&#x3D;&#x2F;usr&#x2F;local&#x2F;sbin:&#x2F;usr&#x2F;local&#x2F;bin:&#x2F;usr&#x2F;sbin:&#x2F;usr&#x2F;bin:&#x2F;sbin:&#x2F;bin\&quot;],\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh\&quot;,\&quot;-c\&quot;,\&quot;#(nop) \&quot;,\&quot;CMD []\&quot;],\&quot;Image\&quot;:\&quot;sha256:996009c7d7eb032c9ea750e5decc1f8aedbf4530b892cf4ebc7716e1458f36d9\&quot;,\&quot;Volumes\&quot;:null,\&quot;WorkingDir\&quot;:\&quot;&#x2F;etc&#x2F;hitch\&quot;,\&quot;Entrypoint\&quot;:[\&quot;docker-hitch-entrypoint\&quot;],\&quot;OnBuild\&quot;:null,\&quot;Labels\&quot;:{}},\&quot;created\&quot;:\&quot;2024-05-14T05:23:11.666992342Z\&quot;,\&quot;docker_version\&quot;:\&quot;20.10.23\&quot;,\&quot;id\&quot;:\&quot;6703605aae83084affcafb4abcc7c556f0e436c4992ae224f1f58e88242328cb\&quot;,\&quot;os\&quot;:\&quot;linux\&quot;,\&quot;parent\&quot;:\&quot;c48ca3d95161bbcdfcaa2e016a675965d55f4f06147ef4445c69347c5965f188\&quot;,\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;c48ca3d95161bbcdfcaa2e016a675965d55f4f06147ef4445c69347c5965f188\&quot;,\&quot;parent\&quot;:\&quot;1d2af5a156bbc461d98824c2f6bfe295327d4419105c0b7f88f14cb28d0bb240\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:23:11.581588417Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) EXPOSE 443\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;1d2af5a156bbc461d98824c2f6bfe295327d4419105c0b7f88f14cb28d0bb240\&quot;,\&quot;parent\&quot;:\&quot;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:23:11.489285564Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ENTRYPOINT [\\\&quot;docker-hitch-entrypoint\\\&quot;]\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad\&quot;,\&quot;parent\&quot;:\&quot;a8d8314458142ee2a4ebccb19f48b6f9c696100103c3d49cbbe7ecd2575120e5\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:23:11.403178706Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) COPY file:1abf3c94dce5dc9f6617dc8d36a6fe6f4f7236189d4819f16cefb54288e80e0d in &#x2F;usr&#x2F;local&#x2F;bin&#x2F; \&quot;]}}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;a8d8314458142ee2a4ebccb19f48b6f9c696100103c3d49cbbe7ecd2575120e5\&quot;,\&quot;parent\&quot;:\&quot;5a78b0e89bbae2390b83e60174ae1efc583f766eff7dffaffa747ccb67472d0f\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:23:11.304477182Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) WORKDIR &#x2F;etc&#x2F;hitch\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;5a78b0e89bbae2390b83e60174ae1efc583f766eff7dffaffa747ccb67472d0f\&quot;,\&quot;parent\&quot;:\&quot;5a12a2c67ff9b5bfad288a4ede18d08c259c301efb85403d08a40ea2ad0eb1f8\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:23:11.160227264Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;|5 DISTVER&#x3D;bullseye PKGCOMMIT&#x3D;f12ab7958bc4885f3f00311cbca5103d9e6ba794 PKGVER&#x3D;1 SHASUM&#x3D;62b3554d668c9d17382415db10898bf661ee76343e4ee364f904457efda6cb1eeee7cb81d7a3897734024812b64b1c0e2dc305605706d81a0c1f6030508bf7e2 SRCVER&#x3D;1.8.0 &#x2F;bin&#x2F;sh -c set -ex; BASE_PKGS&#x3D;\\\&quot;apt-utils curl dirmngr dpkg-dev debhelper devscripts equivs fakeroot git gnupg pkg-config\\\&quot;; export DEBIAN_FRONTEND&#x3D;noninteractive; export DEBCONF_NONINTERACTIVE_SEEN&#x3D;true; tmpdir&#x3D;\\\&quot;$(mktemp -d)\\\&quot;; cd \\\&quot;$tmpdir\\\&quot;; apt-get update; apt-get install -y --no-install-recommends $BASE_PKGS; git clone https:&#x2F;&#x2F;github.com&#x2F;varnish&#x2F;pkg-hitch.git; cd pkg-hitch; git checkout ${PKGCOMMIT}; rm -rf .git; curl -Lf https:&#x2F;&#x2F;hitch-tls.org&#x2F;source&#x2F;hitch-${SRCVER}.tar.gz -o $tmpdir&#x2F;orig.tgz; echo \\\&quot;${SHASUM} $tmpdir&#x2F;orig.tgz\\\&quot; | sha512sum -c -; tar xavf $tmpdir&#x2F;orig.tgz --strip 1; sed -i -e \\\&quot;s&#x2F;@SRCVER@&#x2F;${SRCVER}&#x2F;g\\\&quot; -e \\\&quot;s&#x2F;@PKGVER@&#x2F;${PKGVER:-1}&#x2F;g\\\&quot; -e \\\&quot;s&#x2F;@DISTVER@&#x2F;$DISTVER&#x2F;g\\\&quot; debian&#x2F;changelog; mk-build-deps --install --tool&#x3D;\\\&quot;apt-get -o Debug::pkgProblemResolver&#x3D;yes --yes\\\&quot; debian&#x2F;control; sed -i &#39;&#39; debian&#x2F;hitch*; dpkg-buildpackage -us -uc -j\\\&quot;$(nproc)\\\&quot;; apt-get -y purge --auto-remove hitch-build-deps $BASE_PKGS; apt-get -y --no-install-recommends install ..&#x2F;*.deb; sed -i &#39;s&#x2F;daemon &#x3D; on&#x2F;daemon &#x3D; off&#x2F;&#39; &#x2F;etc&#x2F;hitch&#x2F;hitch.conf; rm -rf &#x2F;var&#x2F;lib&#x2F;apt&#x2F;lists&#x2F;* \\\&quot;$tmpdir\\\&quot;\&quot;]}}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;5a12a2c67ff9b5bfad288a4ede18d08c259c301efb85403d08a40ea2ad0eb1f8\&quot;,\&quot;parent\&quot;:\&quot;c03ad9230005f64133de4501e14a882ef25f03443da4da55ca002d5619f998be\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:21:33.061082853Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ARG SHASUM&#x3D;62b3554d668c9d17382415db10898bf661ee76343e4ee364f904457efda6cb1eeee7cb81d7a3897734024812b64b1c0e2dc305605706d81a0c1f6030508bf7e2\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;c03ad9230005f64133de4501e14a882ef25f03443da4da55ca002d5619f998be\&quot;,\&quot;parent\&quot;:\&quot;24e7aee556d6a38bfa2e13430db8a998c023a2920017eabc0b3bf0dd7661bf7d\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:21:32.967727298Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ARG PKGCOMMIT&#x3D;f12ab7958bc4885f3f00311cbca5103d9e6ba794\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;24e7aee556d6a38bfa2e13430db8a998c023a2920017eabc0b3bf0dd7661bf7d\&quot;,\&quot;parent\&quot;:\&quot;f0d07a99d7d1f0b849a4cbe8fc4552d374f4448c2e7f8bfd908aa43132c4ec34\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:21:32.875807605Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ARG DISTVER&#x3D;bullseye\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;f0d07a99d7d1f0b849a4cbe8fc4552d374f4448c2e7f8bfd908aa43132c4ec34\&quot;,\&quot;parent\&quot;:\&quot;65c7b6d17437bf7a3216e2fea283071e9b5c0d71c6b97472baa8807a30b5d9d8\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:21:32.781941821Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ARG PKGVER&#x3D;1\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;65c7b6d17437bf7a3216e2fea283071e9b5c0d71c6b97472baa8807a30b5d9d8\&quot;,\&quot;parent\&quot;:\&quot;863a608d086b1bcf7f9b30ccf57260e6cb5d3d793b4e1131aa8f6041b07a7270\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T05:21:32.682503634Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ARG SRCVER&#x3D;1.8.0\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;863a608d086b1bcf7f9b30ccf57260e6cb5d3d793b4e1131aa8f6041b07a7270\&quot;,\&quot;parent\&quot;:\&quot;e00e363f3a25341591a5a5e724e20ae3e70f0396be8483a07c0b39d25d33fecd\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T01:28:27.043980081Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) CMD [\\\&quot;bash\\\&quot;]\&quot;]},\&quot;throwaway\&quot;:true}&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;v1Compatibility&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;id\&quot;:\&quot;e00e363f3a25341591a5a5e724e20ae3e70f0396be8483a07c0b39d25d33fecd\&quot;,\&quot;created\&quot;:\&quot;2024-05-14T01:28:26.699066026Z\&quot;,\&quot;container_config\&quot;:{\&quot;Cmd\&quot;:[\&quot;&#x2F;bin&#x2F;sh -c #(nop) ADD file:9b38b383dd93169a663eed88edf3f2285b837257ead69dc40ab5ed1fb3f52c35 in &#x2F; \&quot;]}}&quot;&#x60;

&#x60;&#x60; &#x60;}&#x60;

&#x60;&#x60; &#x60;],&#x60;

&#x60;&#x60; &#x60;...&#x60;

&#x60;&#x60; &#x60;]&#x60;

&#x60;}&#x60;

The sha256sum used to download the blob of the **first layer** is found at the first element of the &#x60;fsLayers[]&#x60; array (&#x60;fsLayers[0]&#x60;). The metadata about this first layer is found at the first element of the &#x60;history[]&#x60; array (&#x60;history[0]&#x60;).

The sha256sum used to download the blob of the **second layer** is found at second element of the &#x60;fsLayers[]&#x60; array (&#x60;fsLayers[1]&#x60;). The metadata about this second layer is found at the second element of the &#x60;history[]&#x60; array (&#x60;history[1]&#x60;).

Et cetera...

### Download the Layers

So how do we download each of these layers separately, yet organize them such that we can later import them as a single image into docker? The answer to that lies in the [Docker Image Specification v1.0.0](https:&#x2F;&#x2F;github.com&#x2F;moby&#x2F;moby&#x2F;blob&#x2F;79910625f0a7aa76590e4362817dda22f28343aa&#x2F;image&#x2F;spec&#x2F;v1.md).

The above spec provides an example tree of the files:

&gt; For example, here&#39;s what the full archive of &#x60;library&#x2F;busybox&#x60; is (displayed in &#x60;tree&#x60; format):
&gt; 
&gt; &#x60;. ├── 5785b62b697b99a5af6cd5d0aabc804d5748abbb6d3d07da5d1d3795f2dcc83e │ ├── VERSION│ ├── json│ └── layer.tar ├── a7b8b41220991bfc754d7ad445ad27b7f272ab8b4a2c175b9512b97471d02a8a │ ├── VERSION│ ├── json│ └── layer.tar ├── a936027c5ca8bf8f517923169a233e391cbb38469a75de8383b5228dc2d26ceb │ ├── VERSION│ ├── json│ └── layer.tar ├── f60c56784b832dd990022afc120b8136ab3da9528094752ae13fe63a2d28dc8c │ ├── VERSION│ ├── json│ └── layer.tar └── repositories&#x60;
&gt; 
&gt; There are one or more directories named with the ID for each layer in a full image. Each of these directories contains 3 files:
&gt; 
&gt; * \&#x60;VERSION\&#x60; - The schema version of the \&#x60;json\&#x60; file
&gt; * \&#x60;json\&#x60; - The JSON metadata for an image layer
&gt; * \&#x60;layer.tar\&#x60; - The Tar archive of the filesystem changeset for an image  
&gt; layer.
&gt; 
&gt; The content of the &#x60;VERSION&#x60; files is simply the semantic version of the JSON metadata schema:  
&gt; &#x60;1.0 &#x60;
&gt; 
&gt; And the &#x60;repositories&#x60; file is another JSON file which describes names&#x2F;tags:
&gt; 
&gt; {  
&gt;    &quot;busybox&quot;:{  
&gt;        &quot;latest&quot;:&quot;5785b62b697b99a5af6cd5d0aabc804d5748abbb6d3d07da5d1d3795f2dcc83e&quot;
&gt;    }
&gt; }
&gt; 
&gt; Every key in this object is the name of a repository, and maps to a collection of tag suffixes. Each tag maps to the ID of the image represented by that tag.

So, as shown in the quote from the spec above, what we need to do is to create a set of directories -- one for each layer -- named after the layer&#39;s ID. Each of these layer-specific directories must contain 3 files:

1. The actual tarball of the layer (named &#39;&#x60;layer.tar&#x60;&#39;),
2. The metadata of the layer (in a file literally named &#39;&#x60;json&#x60;&#39; -- with no file extension)
3. A file named &#39;&#x60;VERSION&#x60;&#39; whose contents is literally just &#39;&#x60;1.0&#x60;&#39;

All of the information that we need is in the &#39;&#x60;manifest.json&#x60;&#39; file that we already downloaded. Let&#39;s just loop through each layer that it defines, download the &#x60;layer.tar&#x60; tarball, create the &#39;&#x60;json&#x60;&#39; metadata file, and hard-code the &#39;&#x60;VERSION&#x60;&#39; file with the following BASH snippet

&#x60;num_layers&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.history | length&quot;&#x60; &#x60;)&#x60;

&#x60;for&#x60; &#x60;((i &#x3D; 0 ; i &lt; $num_layers ; i++)); &#x60; &#x60;do&#x60;

&#x60;&#x60; &#x60;layer_blobSum&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.fsLayers[$i].blobSum&quot;&#x60; &#x60;)&#x60;

&#x60;&#x60; &#x60;layer_metadata&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.history[$i].v1Compatibility&quot;&#x60; &#x60;)&#x60;

&#x60;&#x60; &#x60;layer_id&#x3D;$(&#x60; &#x60;echo&#x60; &#x60;$layer_metadata | jq -r &#x60; &#x60;&quot;.id&quot;&#x60; &#x60;)&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;$layer_id&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;$layer_blobSum&#x60;

&#x60;&#x60; &#x60;mkdir&#x60; &#x60;-p &#x60; &#x60;&quot;layers&#x2F;$layer_id&quot;&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;&quot;1.0&quot;&#x60; &#x60;&gt; &#x60; &#x60;&quot;layers&#x2F;$layer_id&#x2F;VERSION&quot;&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;$layer_metadata &gt; &#x60; &#x60;&quot;layers&#x2F;$layer_id&#x2F;json&quot;&#x60;

&#x60;&#x60; &#x60;curl -o &#x60; &#x60;&quot;layers&#x2F;$layer_id&#x2F;layer.tar&quot;&#x60; &#x60;-&#x60;

&#x60;done&#x60;

And here&#39;s an example execution that executes the above snippet to download all of the layers onto disk in a set of directories as defined by the [Docker Image Specification v1.0.0](https:&#x2F;&#x2F;github.com&#x2F;moby&#x2F;moby&#x2F;blob&#x2F;79910625f0a7aa76590e4362817dda22f28343aa&#x2F;image&#x2F;spec&#x2F;v1.md).

&#x60;user@disp7456:~$ num_layers&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.history | length&quot;&#x60; &#x60;)&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;for&#x60; &#x60;((i &#x3D; 0 ; i &lt; $num_layers ; i++)); &#x60; &#x60;do&#x60;

&#x60;&#x60; &#x60;layer_blobSum&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.fsLayers[$i].blobSum&quot;&#x60; &#x60;)&#x60;

&#x60;&#x60; &#x60;layer_metadata&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.history[$i].v1Compatibility&quot;&#x60; &#x60;)&#x60;

&#x60;&#x60; &#x60;layer_id&#x3D;$(&#x60; &#x60;echo&#x60; &#x60;$layer_metadata | jq -r &#x60; &#x60;&quot;.id&quot;&#x60; &#x60;)&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;$layer_id&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;$layer_blobSum&#x60;

&#x60;&#x60; &#x60;mkdir&#x60; &#x60;-p &#x60; &#x60;&quot;layers&#x2F;$layer_id&quot;&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;&quot;1.0&quot;&#x60; &#x60;&gt; &#x60; &#x60;&quot;layers&#x2F;$layer_id&#x2F;VERSION&quot;&#x60;

&#x60;&#x60; &#x60;echo&#x60; &#x60;$layer_metadata &gt; &#x60; &#x60;&quot;layers&#x2F;$layer_id&#x2F;json&quot;&#x60;

&#x60;&#x60; &#x60;curl -o &#x60; &#x60;&quot;layers&#x2F;$layer_id&#x2F;layer.tar&quot;&#x60; &#x60;-&#x60;

&#x60;done&#x60;

&#x60;6703605aae83084affcafb4abcc7c556f0e436c4992ae224f1f58e88242328cb&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;c48ca3d95161bbcdfcaa2e016a675965d55f4f06147ef4445c69347c5965f188&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;1d2af5a156bbc461d98824c2f6bfe295327d4419105c0b7f88f14cb28d0bb240&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x60;

&#x60;sha256:3148f4af0a813bcff0a3ed2562aabfb1b596b52ef36eb5eb4d82ce836350b73a&#x60;

&#x60;a8d8314458142ee2a4ebccb19f48b6f9c696100103c3d49cbbe7ecd2575120e5&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;5a78b0e89bbae2390b83e60174ae1efc583f766eff7dffaffa747ccb67472d0f&#x60;

&#x60;sha256:a0e9543db8c1238572466cf00b55436bc7b7e849f7cb305128f391a94b75c2fc&#x60;

&#x60;5a12a2c67ff9b5bfad288a4ede18d08c259c301efb85403d08a40ea2ad0eb1f8&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;c03ad9230005f64133de4501e14a882ef25f03443da4da55ca002d5619f998be&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;24e7aee556d6a38bfa2e13430db8a998c023a2920017eabc0b3bf0dd7661bf7d&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;f0d07a99d7d1f0b849a4cbe8fc4552d374f4448c2e7f8bfd908aa43132c4ec34&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;65c7b6d17437bf7a3216e2fea283071e9b5c0d71c6b97472baa8807a30b5d9d8&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;863a608d086b1bcf7f9b30ccf57260e6cb5d3d793b4e1131aa8f6041b07a7270&#x60;

&#x60;sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4&#x60;

&#x60;e00e363f3a25341591a5a5e724e20ae3e70f0396be8483a07c0b39d25d33fecd&#x60;

&#x60;sha256:728328ac3bde9b85225b1f0d60f5c149f5635a191f5d8eaeeb00e095d36ef9fd&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ tree layers&#x2F;&#x60;

&#x60;layers&#x2F;&#x60;

&#x60;├── 1d2af5a156bbc461d98824c2f6bfe295327d4419105c0b7f88f14cb28d0bb240&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 24e7aee556d6a38bfa2e13430db8a998c023a2920017eabc0b3bf0dd7661bf7d&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 5a12a2c67ff9b5bfad288a4ede18d08c259c301efb85403d08a40ea2ad0eb1f8&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 5a78b0e89bbae2390b83e60174ae1efc583f766eff7dffaffa747ccb67472d0f&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 65c7b6d17437bf7a3216e2fea283071e9b5c0d71c6b97472baa8807a30b5d9d8&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 6703605aae83084affcafb4abcc7c556f0e436c4992ae224f1f58e88242328cb&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 863a608d086b1bcf7f9b30ccf57260e6cb5d3d793b4e1131aa8f6041b07a7270&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── 8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── a8d8314458142ee2a4ebccb19f48b6f9c696100103c3d49cbbe7ecd2575120e5&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── c03ad9230005f64133de4501e14a882ef25f03443da4da55ca002d5619f998be&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── c48ca3d95161bbcdfcaa2e016a675965d55f4f06147ef4445c69347c5965f188&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;├── e00e363f3a25341591a5a5e724e20ae3e70f0396be8483a07c0b39d25d33fecd&#x60;

&#x60;│ ├── json&#x60;

&#x60;│ ├── layer.&#x60; &#x60;tar&#x60;

&#x60;│ └── VERSION&#x60;

&#x60;└── f0d07a99d7d1f0b849a4cbe8fc4552d374f4448c2e7f8bfd908aa43132c4ec34&#x60;

&#x60;&#x60; &#x60;├── json&#x60;

&#x60;&#x60; &#x60;├── layer.&#x60; &#x60;tar&#x60;

&#x60;&#x60; &#x60;└── VERSION&#x60;

&#x60;14 directories, 39 files&#x60;

&#x60;user@disp7456:~$ &#x60;

Finally, besides these layer-specific dirs, we need one additional file (named simply &#39;&#x60;repository&#x60;&#39;, with no file extension) at the same height as these dirs. As defined by the [Docker Image Specification v1.0.0](https:&#x2F;&#x2F;github.com&#x2F;moby&#x2F;moby&#x2F;blob&#x2F;79910625f0a7aa76590e4362817dda22f28343aa&#x2F;image&#x2F;spec&#x2F;v1.md), this file should state the name &amp; tag of the image, and it points to the first layer of the image.

Note the &#x60;0th&#x60; item in the &#x60;history[]&#x60; array is the first layer of the image, so we can create this file with the following command

&#x60;start_image&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.history[0].v1Compatibility&quot;&#x60; &#x60;)&#x60;

&#x60;start_image_id&#x3D;$(&#x60; &#x60;echo&#x60; &#x60;$start_image | jq -r &#x60; &#x60;&quot;.id&quot;&#x60; &#x60;)&#x60;

&#x60;cat&#x60; &#x60;&gt; layers&#x60; &#x60;&#x2F;repositories&#x60; &#x60;&lt;&lt;EOF&#x60;

&#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;&lt;image_name&gt;&quot;&#x60; &#x60;: { &#x60; &#x60;&quot;stable&quot;&#x60; &#x60;: &#x60; &#x60;&quot;$start_image_id&quot;&#x60; &#x60;}&#x60;

&#x60;}&#x60;

&#x60;EOF&#x60;

And here&#39;s an example execution to create our &#39;&#x60;repository&#x60;&#39; file for the &#39;&#x60;hitch&#x60;&#39; package.

&#x60;user@disp7456:~$ start_image&#x3D;$(&#x60; &#x60;cat&#x60; &#x60;manifest.json | jq -r &#x60; &#x60;&quot;.history[0].v1Compatibility&quot;&#x60; &#x60;)&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ start_image_id&#x3D;$(&#x60; &#x60;echo&#x60; &#x60;$start_image | jq -r &#x60; &#x60;&quot;.id&quot;&#x60; &#x60;)&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;cat&#x60; &#x60;&gt; layers&#x60; &#x60;&#x2F;repositories&#x60; &#x60;&lt;&lt;EOF&#x60;

&#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;hitch&quot;&#x60; &#x60;: { &#x60; &#x60;&quot;stable&quot;&#x60; &#x60;: &#x60; &#x60;&quot;$start_image_id&quot;&#x60; &#x60;}&#x60;

&#x60;}&#x60;

&#x60;EOF&#x60;

&#x60;user@disp7456:~$&#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;ls&#x60; &#x60;layers&#x60;

&#x60;1d2af5a156bbc461d98824c2f6bfe295327d4419105c0b7f88f14cb28d0bb240&#x60;

&#x60;24e7aee556d6a38bfa2e13430db8a998c023a2920017eabc0b3bf0dd7661bf7d&#x60;

&#x60;5a12a2c67ff9b5bfad288a4ede18d08c259c301efb85403d08a40ea2ad0eb1f8&#x60;

&#x60;5a78b0e89bbae2390b83e60174ae1efc583f766eff7dffaffa747ccb67472d0f&#x60;

&#x60;65c7b6d17437bf7a3216e2fea283071e9b5c0d71c6b97472baa8807a30b5d9d8&#x60;

&#x60;6703605aae83084affcafb4abcc7c556f0e436c4992ae224f1f58e88242328cb&#x60;

&#x60;863a608d086b1bcf7f9b30ccf57260e6cb5d3d793b4e1131aa8f6041b07a7270&#x60;

&#x60;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x60;

&#x60;a8d8314458142ee2a4ebccb19f48b6f9c696100103c3d49cbbe7ecd2575120e5&#x60;

&#x60;c03ad9230005f64133de4501e14a882ef25f03443da4da55ca002d5619f998be&#x60;

&#x60;c48ca3d95161bbcdfcaa2e016a675965d55f4f06147ef4445c69347c5965f188&#x60;

&#x60;e00e363f3a25341591a5a5e724e20ae3e70f0396be8483a07c0b39d25d33fecd&#x60;

&#x60;f0d07a99d7d1f0b849a4cbe8fc4552d374f4448c2e7f8bfd908aa43132c4ec34&#x60;

&#x60;repositories&#x60;

&#x60;user@disp7456:~$&#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;cat&#x60; &#x60;layers&#x60; &#x60;&#x2F;repositories&#x60;

&#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;hitch&quot;&#x60; &#x60;: { &#x60; &#x60;&quot;stable&quot;&#x60; &#x60;: &#x60; &#x60;&quot;6703605aae83084affcafb4abcc7c556f0e436c4992ae224f1f58e88242328cb&quot;&#x60; &#x60;}&#x60;

&#x60;}&#x60;

&#x60;user@disp7456:~$ &#x60;

Your &#39;&#x60;layers&#x2F;&#x60;&#39; directory should now be prepared-to-spec for importing the entire image into docker.

For reference, here&#39;s the contents of just one of the layers:

&#x60;user@disp7456:~$ &#x60; &#x60;ls&#x60; &#x60;layers&#x60; &#x60;&#x2F;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x2F;&#x60;

&#x60;json layer.&#x60; &#x60;tar&#x60; &#x60;VERSION&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;cat&#x60; &#x60;layers&#x60; &#x60;&#x2F;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x2F;VERSION&#x60;

&#x60;1.0&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;cat&#x60; &#x60;layers&#x60; &#x60;&#x2F;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x2F;json&#x60;

&#x60;{&#x60; &#x60;&quot;id&quot;&#x60; &#x60;:&#x60; &#x60;&quot;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&quot;&#x60; &#x60;,&#x60; &#x60;&quot;parent&quot;&#x60; &#x60;:&#x60; &#x60;&quot;a8d8314458142ee2a4ebccb19f48b6f9c696100103c3d49cbbe7ecd2575120e5&quot;&#x60; &#x60;,&#x60; &#x60;&quot;created&quot;&#x60; &#x60;:&#x60; &#x60;,&#x60; &#x60;&quot;container_config&quot;&#x60; &#x60;:{&#x60; &#x60;&quot;Cmd&quot;&#x60; &#x60;:[&#x60; &#x60;&quot;&#x2F;bin&#x2F;sh -c #(nop) COPY file:1abf3c94dce5dc9f6617dc8d36a6fe6f4f7236189d4819f16cefb54288e80e0d in &#x2F;usr&#x2F;local&#x2F;bin&#x2F; &quot;&#x60; &#x60;]}}&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ sha256sum layers&#x60; &#x60;&#x2F;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x2F;layer&#x60; &#x60;.&#x60; &#x60;tar&#x60;

&#x60;3148f4af0a813bcff0a3ed2562aabfb1b596b52ef36eb5eb4d82ce836350b73a layers&#x60; &#x60;&#x2F;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x2F;layer&#x60; &#x60;.&#x60; &#x60;tar&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;tar&#x60; &#x60;-tvf layers&#x60; &#x60;&#x2F;8f914c821cbe154cc6677bceb043669e4295ad5cfb6409efa9c2ec1beba75fad&#x2F;layer&#x60; &#x60;.&#x60; &#x60;tar&#x60;

&#x60;drwxr-xr-x 0&#x60; &#x60;&#x2F;0&#x60; 

&#x60;drwxr-xr-x 0&#x60; &#x60;&#x2F;0&#x60; &#x60;&#x2F;local&#x2F;&#x60;

&#x60;drwxr-xr-x 0&#x60; &#x60;&#x2F;0&#x60; &#x60;&#x2F;local&#x2F;bin&#x2F;&#x60;

&#x60;-rwxrwxr-x 0&#x60; &#x60;&#x2F;0&#x60; &#x60;&#x2F;local&#x2F;bin&#x2F;docker-hitch-entrypoint&#x60;

&#x60;user@disp7456:~$ &#x60;

### Load the Image

Finally, you can load the layers as one image into docker with &#x60;docker image load&#x60;

&#x60;tar&#x60; &#x60;-cC layers . | docker image load&#x60;

Here&#39;s an example execution

&#x60;user@disp7456:~$ docker image &#x60; &#x60;ls&#x60;

&#x60;REPOSITORY TAG IMAGE ID CREATED SIZE&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;tar&#x60; &#x60;-cC layers . | docker load&#x60;

&#x60;e00e363f3a25: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 31.43MB&#x60; &#x60;&#x2F;31&#x60; &#x60;.43MB&#x60;

&#x60;863a608d086b: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;65c7b6d17437: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;f0d07a99d7d1: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;24e7aee556d6: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;c03ad9230005: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;5a12a2c67ff9: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;5a78b0e89bba: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 1.573MB&#x60; &#x60;&#x2F;1&#x60; &#x60;.573MB&#x60;

&#x60;a8d831445814: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;8f914c821cbe: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 415B&#x60; &#x60;&#x2F;415B&#x60;

&#x60;1d2af5a156bb: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;c48ca3d95161: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;6703605aae83: Loading layer [&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&#x3D;&gt;] 32B&#x60; &#x60;&#x2F;32B&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ docker image &#x60; &#x60;ls&#x60;

&#x60;REPOSITORY TAG IMAGE ID CREATED SIZE&#x60;

&#x60;hitch stable f07eadb841be 3 weeks ago 85.1MB&#x60;

&#x60;user@disp7456:~$ &#x60;

The image is now available in &#x60;docker&#x60;.

[![Screenshot of the GitHub WUI in firefox, browsing the &quot;Homebrew&quot; org&#39;s page. The &quot;Packages&quot; tab link is highlighted in red.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;767x620,sEDf5bgj0HhzfxNvLBA49RcV5v7azf3srcIimYbqD8TA&#x2F;https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;xcontainer-download-curl-wget_github-packages-homebrew-org1.jpg.pagespeed.ic.f2IglFP69q.jpg)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;container-download-curl-wget%5Fgithub-packages-homebrew-org1.jpg)

From the GitHub org&#39;s main page, click on &quot;Packages&quot; to browse its files uploaded to its GitHub Packages registry

## GitHub Packages

GitHub Packages was [launched](https:&#x2F;&#x2F;github.blog&#x2F;2019-05-10-introducing-github-package-registry&#x2F;) as a Beta in May 2019\. It allowed users to publish packages in many formats, including images uploaded to a GitHub Docker Registry. In September 2020, GitHub added a generic [Container Registry](https:&#x2F;&#x2F;github.blog&#x2F;2020-09-01-introducing-github-container-registry&#x2F;) as a Beta to GitHub Packages. In June 2021, GitHub [migrated all images](https:&#x2F;&#x2F;github.blog&#x2F;2021-06-21-github-packages-container-registry-generally-available&#x2F;) uploaded to GitHub Packages&#39; Docker Registry (at the domain &#39;&#x60;docker.pkg.github.com&#x60;&#39;) to their Container Registry (at the domain &#39;&#x60;ghcr.io&#x60;&#39;).

This [GitHub Packages Container Registry](https:&#x2F;&#x2F;docs.github.com&#x2F;en&#x2F;packages&#x2F;working-with-a-github-packages-registry&#x2F;working-with-the-container-registry) lets users (like Brew) upload (and download) images [in accordance with](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;image-spec) the Open Container Initiative (OCI) Specifications (described above).

### Determine Package Name

In this example, let&#39;s say that we want to download the &#39;&#x60;vim&#x60;&#39; package from the Homebrew project, which is hosted on GitHub Packages.

To start, go the [org&#39;s page](https:&#x2F;&#x2F;github.com&#x2F;Homebrew) on GitHub

&lt;https:&#x2F;&#x2F;github.com&#x2F;Homebrew&gt; 

Click on &quot;[Packages](https:&#x2F;&#x2F;github.com&#x2F;orgs&#x2F;Homebrew&#x2F;packages)&quot;

Type the name of the package that you want to download

This will tell you the name of the package, which you may want to cross-check with [formulae.brew.sh](https:&#x2F;&#x2F;formulae.brew.sh&#x2F;)

### Determine Package Version

To figure out which version (tag) we want to download from GitHub Packages, we need to check the Brew &quot;recipe&quot;. All the brew recipes are found in the [Homebrew&#x2F;homebrew-core repo](https:&#x2F;&#x2F;github.com&#x2F;Homebrew&#x2F;homebrew-core).

Click the &quot;Formulas&quot; directory, and then click the &quot;v&quot; directory (which holds all the brew formula files for packages that start with the letter &#39;v&#39;).

 To view the formulas for all brew packages, go to the ‘homebrew-core’ repo, and open the “Formula&#x2F;” directory.

 Click the ‘v’ directory to view all the formulas for packages that start with the letter ‘v’

  
[![Screenshot of the GitHub WUI in firefox, browsing the &quot;Formula&#x2F;v&#x2F;&quot; directory of the &#39;Homebrew&#x2F;homebrew-core&#39; repo. A file titled &quot;vim.rb&quot; is highlighted in red.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;243x1024,s_8mky-HZ7ygzkXyid5mDKdReZxXD9wcML_2rM8lfsHo&#x2F;https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;xcontainer-download-curl-wget_github-packages-homebrew-core-formula-v1-243x1024.jpg.pagespeed.ic.zrEZc3-oES.jpg)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;container-download-curl-wget%5Fgithub-packages-homebrew-core-formula-v1-scaled.jpg)

Click on the &#39;vim.rb&#39; file to view the formula for the &#39;vim&#39; brew package

Finally, click the &#39;&#x60;vim.rb&#x60;&#39; file.

You may just want to download the latest version of vim, but let&#39;s say that we&#39;re using an old machine that can&#39;t be updated beyond MacOS 11.7.10 (Big Sur). If you check the latest recipe, you see entries for sonoma (macOS 12), ventura (macOS 13), and monterey (macOS 14). But big\_sur is absent because it isn&#39;t supported.

The easiest way that I&#39;m aware-of to determine what is the latest brew package&#39;s version that supports your OS (without having to fight with the API) is to view the history of the recipe file.

After clicking-through all the previous versions, we can see that big\_sur was removed (and not replaced) in a commit on Sep 28, 2023 in [commit a153795](https:&#x2F;&#x2F;github.com&#x2F;Homebrew&#x2F;homebrew-core&#x2F;commit&#x2F;a153795af9c53680065e63556bda6cedf936055b%22), which has a commit message &quot;vim: update 9.0.1900\_1 bottle&quot;. Therefore, it looks like &quot;big\_sur&quot; was no longer supported the vim package version &#39;9.0.1900\_1&#39;. The version immediately before that is &#39;9.0.1900&#39;, and it looks like [it _does_ have a package](https:&#x2F;&#x2F;github.com&#x2F;Homebrew&#x2F;homebrew-core&#x2F;blob&#x2F;2f36c53c74e366322e68429eb63eb55ec9294261&#x2F;Formula&#x2F;v&#x2F;vim.rb) for &quot;big\_sur&quot;

 The diff shows most of the hashes being updated, but the “big\_sur” line was removed (and not replaced)

 The most-recent version that supports ‘big\_sur’ is the most-recent version of the ‘vim.rb’ file that contains a sha256sum for “big\_sur”

  
Now that we know that we want to download &#39;9.0.1900&#39; version of the &#39;vim&#39; package, we can go back to the [GitHub Packages page](https:&#x2F;&#x2F;github.com&#x2F;Homebrew&#x2F;homebrew-core&#x2F;pkgs&#x2F;container&#x2F;core%2Fvim) and find the tag for this version.

Click on &quot;View all tagged versions&quot; and then scroll-down to the tag that corresponds to the version we want (9.0.1900).

 To view a list of all of the versions for the package, click “View all tagged versions”

 Scroll down to find the tag for the version that you want. In our case, it’s “9.0.1900”

  
### Get an Auth Token

Execute the following command to get an [authentication token](https:&#x2F;&#x2F;distribution.github.io&#x2F;distribution&#x2F;spec&#x2F;auth&#x2F;oauth&#x2F;) from GitHub Packages.

The above commands will get a free&#x2F;temporary token that you can use in subsequent API calls. If all went well, there will be no output from these commands. Here&#39;s an example execution

### List the Tags

We can list all of the available tags for the &#39;&#x60;vim&#x60;&#39; package with the &#39;&#x60;GET &#x2F;v2&#x2F;&lt;name&gt;&#x2F;tags&#x2F;list&#x60;&#39; API endpoint, as shown in the [table](#table) above

&#x60;curl -i -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;ghcr&#x60; &#x60;.io&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;&#x60; &#x60;&lt;package_name&gt;&#x60; &#x60;&#x2F;tags&#x2F;list&#x60;

Here&#39;s an example execution. Note that it affirms the existence of the &#39;&#x60;9.0.1900&#x60;&#39; tag that we found above.

&#x60;user@disp7456:~$ curl -i -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;ghcr&#x60; &#x60;.io&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;vim&#x2F;tags&#x2F;list&#x60;

&#x60;HTTP&#x60; &#x60;&#x2F;2&#x60; &#x60;200 &#x60;

&#x60;content-&#x60; &#x60;type&#x60; &#x60;: application&#x60; &#x60;&#x2F;json&#x60;

&#x60;docker-distribution-api-version: registry&#x60; &#x60;&#x2F;2&#x60; &#x60;.0&#x60;

&#x60;link: &lt;&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;vim&#x2F;tags&#x2F;list&#x60; &#x60;?last&#x3D;9.0.1500&amp;n&#x3D;0&gt;; rel&#x3D;&#x60; &#x60;&quot;next&quot;&#x60;

&#x60;date&#x60; &#x60;: Mon, 06 May 2024 01:06:25 GMT&#x60;

&#x60;content-length: 1164&#x60;

&#x60;x-github-request-&#x60; &#x60;id&#x60; &#x60;: CD4E:29D249:57F4C1F:5A244F1:66382D11&#x60;

&#x60;{&#x60; &#x60;&quot;name&quot;&#x60; &#x60;:&#x60; &#x60;&quot;homebrew&#x2F;core&#x2F;vim&quot;&#x60; &#x60;,&#x60; &#x60;&quot;tags&quot;&#x60; &#x60;:[&#x60; &#x60;&quot;8.2.2725_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2750&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2775&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2800&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2825&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2850&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2875&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2875_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2900&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2925&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2950&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.2975&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3000&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3025&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3050&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3075&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3100&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3125&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3150&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3175&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3200&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3225&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3250&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3275&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3300&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3325&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3350&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3400&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3450&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3500&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3550&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3600&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3650&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3700&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3750&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3750_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3800&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3850&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3900&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.3950&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4000&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4050&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4100&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4150&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4200&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4250&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4300&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4300_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4350&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4400&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4450&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4500&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4550&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4600&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4650&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4700&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4750&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4800&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4800_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4850&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4850-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4900&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.4950&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.5000&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.5050&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.5100&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.5150&quot;&#x60; &#x60;,&#x60; &#x60;&quot;8.2.5150_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0000&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0050&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0100&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0150&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0150_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0200&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0250&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0300&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0350&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0350_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0350_2&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0650&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0700&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0750&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0800&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0850&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0900&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.0950&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1000&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1050&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1050-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1100&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1100_1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1150&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1200&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1250&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1300&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1350&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1400&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1400-1&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1450&quot;&#x60; &#x60;,&#x60; &#x60;&quot;9.0.1500&quot;&#x60; &#x60;]}&#x60;

&#x60;user@disp7456:~$ &#x60;

### Download the Manifest

We can download the manifest for the &#39;&#x60;9.0.1900&#x60;&#39; tag of the &#39;&#x60;vim&#x60;&#39; package with the &#39;&#x60;GET &#x2F;v2&#x2F;&lt;name&gt;&#x2F;manifests&#x2F;&lt;reference&gt;&#x60;&#39; API endpoint, as shown in the [table](#table) above

&#x60;curl -o manifest.json -s -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;-H &#x60; &#x60;&#39;Accept: application&#x2F;vnd.oci.image.index.v1+json&#39;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;ghcr&#x60; &#x60;.io&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;&#x60; &#x60;&lt;package_name&gt;&#x60; &#x60;&#x2F;manifests&#x2F;&#x60; &#x60;&lt;tag&gt;&#x60;

And here&#39;s an example execution that downloads the manifest for the &#39;&#x60;9.0.1900&#x60;&#39; tag of the &#39;&#x60;vim&#x60;&#39; package

&#x60;user@disp7456:~$ curl -o manifest.json -s -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;-H &#x60; &#x60;&#39;Accept: application&#x2F;vnd.oci.image.index.v1+json&#39;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;ghcr&#x60; &#x60;.io&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;vim&#x2F;manifests&#x2F;9&#x60; &#x60;.0.1900&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;ls&#x60;

&#x60;manifest.json&#x60;

&#x60;user@disp7456:~$ &#x60;

&gt; ![⚠](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sRaT0hPNHArXcToU1KPTndiJXtnwvc3nHYqgRAszUNWY&#x2F;https:&#x2F;&#x2F;s.w.org&#x2F;images&#x2F;core&#x2F;emoji&#x2F;14.0.0&#x2F;svg&#x2F;26a0.svg) Note that we MUST specify the [Accept](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;HTTP&#x2F;Headers&#x2F;Accept) header here. If we don&#39;t, then the registry will respond with the following error message
&gt; 
&gt; &#x60;{&quot;errors&quot;:[{&quot;code&quot;:&quot;MANIFEST_UNKNOWN&quot;,&quot;message&quot;:&quot;OCI index found, but Accept header does not support OCI indexes&quot;}]}&#x60;
&gt; 
&gt; For more information on the OCI media types and their MIME types, see the list of [OCI Image Media Types](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;image-spec&#x2F;blob&#x2F;main&#x2F;media-types.md).

### Parse the Manifest

The previous step downloaded a file named &#39;&#x60;manifest.json&#x60;&#39;. This &#39;&#x60;manifest.json&#x60;&#39; file lists all of the many files available for the &#39;&#x60;9.0.1900&#x60;&#39; version of the &#39;&#x60;vim&#x60;&#39; package -- spanning many OS versions and processor architectures.

In order to proceed and download our actual brew bottle file, we need to extract the &#39;&#x60;sh.brew.bottle.digest&#x60;&#39; for our target system, which is a sha256sum hash that we&#39;ll use in the &#39;GET &#x60;&#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;&#x60;&#39; API call to actually download the file from the container registry.

There&#39;s only one dictionary in the &#39;&#x60;manifests&#x60;&#39; array that has a &#39;&#x60;platform&#x60;&#39; dict with the following keys:

1. &#x60;&quot;architecture&quot;: &quot;amd64&quot;&#x60;, and
2. &#x60;&quot;os.version&quot;: &quot;macOS 11.7&quot;&#x60;

...And that&#39;s the one we want:

&#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;schemaVersion&quot;&#x60; &#x60;: 2,&#x60;

&#x60;&#x60; &#x60;&quot;manifests&quot;&#x60; &#x60;: [&#x60;

&#x60;&#x60; &#x60;...&#x60;

&#x60;&#x60; &#x60;{&#x60;

&#x60;&#x60; &#x60;&quot;mediaType&quot;&#x60; &#x60;: &#x60; &#x60;&quot;application&#x2F;vnd.oci.image.manifest.v1+json&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;digest&quot;&#x60; &#x60;: &#x60; &#x60;&quot;sha256:5b538ff92ab00c3658b152dee240e30f9ffa65d817540b6a461460b02b93ceda&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;size&quot;&#x60; &#x60;: 5357,&#x60;

&#x60;&#x60; &#x60;&quot;platform&quot;&#x60; &#x60;: {&#x60;

&#x60;&#x60; &#x60;&quot;architecture&quot;&#x60; &#x60;: &#x60; &#x60;&quot;amd64&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;os&quot;&#x60; &#x60;: &#x60; &#x60;&quot;darwin&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;os.version&quot;&#x60; &#x60;: &#x60; &#x60;&quot;macOS 11.7&quot;&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;&quot;annotations&quot;&#x60; &#x60;: {&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.ref.name&quot;&#x60; &#x60;: &#x60; &#x60;&quot;9.0.1900.big_sur&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;sh.brew.bottle.digest&quot;&#x60; &#x60;: &#x60; &#x60;&quot;6cbad503034158806227128743d2acc08773c90890cea12efee25c4a53399d02&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;sh.brew.bottle.size&quot;&#x60; &#x60;: &#x60; &#x60;&quot;13598246&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;sh.brew.tab&quot;&#x60; &#x60;: &#x60; &#x60;&quot;{\&quot;homebrew_version\&quot;:\&quot;4.1.11-36-g184efd9\&quot;,\&quot;changed_files\&quot;:[\&quot;share&#x2F;vim&#x2F;vim90&#x2F;doc&#x2F;vim2html.pl\&quot;,\&quot;share&#x2F;vim&#x2F;vim90&#x2F;tools&#x2F;efm_filter.pl\&quot;,\&quot;share&#x2F;vim&#x2F;vim90&#x2F;tools&#x2F;efm_perl.pl\&quot;,\&quot;share&#x2F;vim&#x2F;vim90&#x2F;tools&#x2F;pltags.pl\&quot;,\&quot;share&#x2F;vim&#x2F;vim90&#x2F;tools&#x2F;shtags.pl\&quot;,\&quot;share&#x2F;man&#x2F;da&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;da&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;da.ISO8859-1&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;da.ISO8859-1&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;da.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;da.UTF-8&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;de&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;de.ISO8859-1&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;de.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;fr.ISO8859-1&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr.ISO8859-1&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr.ISO8859-1&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;fr.UTF-8&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;fr.UTF-8&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;it&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;it&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;it&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;it.ISO8859-1&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;it.ISO8859-1&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;it.ISO8859-1&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;it.UTF-8&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;it.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;it.UTF-8&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;ja&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;ja&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;ja&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;pl&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;pl&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;pl&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;pl.ISO8859-2&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;pl.ISO8859-2&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;pl.ISO8859-2&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;pl.UTF-8&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;pl.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;pl.UTF-8&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;ru.KOI8-R&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;ru.KOI8-R&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;ru.KOI8-R&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;ru.UTF-8&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;ru.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;ru.UTF-8&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;tr&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;tr&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;tr&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;tr.ISO8859-9&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;tr.ISO8859-9&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;tr.ISO8859-9&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;man&#x2F;tr.UTF-8&#x2F;man1&#x2F;evim.1\&quot;,\&quot;share&#x2F;man&#x2F;tr.UTF-8&#x2F;man1&#x2F;vim.1\&quot;,\&quot;share&#x2F;man&#x2F;tr.UTF-8&#x2F;man1&#x2F;vimtutor.1\&quot;,\&quot;share&#x2F;vim&#x2F;vim90&#x2F;filetype.vim\&quot;],\&quot;source_modified_time\&quot;:1694864306,\&quot;compiler\&quot;:\&quot;clang\&quot;,\&quot;runtime_dependencies\&quot;:[{\&quot;full_name\&quot;:\&quot;gettext\&quot;,\&quot;version\&quot;:\&quot;0.21.1\&quot;,\&quot;declared_directly\&quot;:true},{\&quot;full_name\&quot;:\&quot;libsodium\&quot;,\&quot;version\&quot;:\&quot;1.0.18\&quot;,\&quot;declared_directly\&quot;:true},{\&quot;full_name\&quot;:\&quot;lua\&quot;,\&quot;version\&quot;:\&quot;5.4.6\&quot;,\&quot;declared_directly\&quot;:true},{\&quot;full_name\&quot;:\&quot;ncurses\&quot;,\&quot;version\&quot;:\&quot;6.4\&quot;,\&quot;declared_directly\&quot;:true},{\&quot;full_name\&quot;:\&quot;ca-certificates\&quot;,\&quot;version\&quot;:\&quot;2023-08-22\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;openssl@3\&quot;,\&quot;version\&quot;:\&quot;3.1.2\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;berkeley-db\&quot;,\&quot;version\&quot;:\&quot;18.1.40\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;gdbm\&quot;,\&quot;version\&quot;:\&quot;1.23\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;perl\&quot;,\&quot;version\&quot;:\&quot;5.36.1\&quot;,\&quot;declared_directly\&quot;:true},{\&quot;full_name\&quot;:\&quot;mpdecimal\&quot;,\&quot;version\&quot;:\&quot;2.5.1\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;readline\&quot;,\&quot;version\&quot;:\&quot;8.2.1\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;sqlite\&quot;,\&quot;version\&quot;:\&quot;3.43.1\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;xz\&quot;,\&quot;version\&quot;:\&quot;5.4.4\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;python@3.11\&quot;,\&quot;version\&quot;:\&quot;3.11.5\&quot;,\&quot;declared_directly\&quot;:true},{\&quot;full_name\&quot;:\&quot;libyaml\&quot;,\&quot;version\&quot;:\&quot;0.2.5\&quot;,\&quot;declared_directly\&quot;:false},{\&quot;full_name\&quot;:\&quot;ruby\&quot;,\&quot;version\&quot;:\&quot;3.2.2\&quot;,\&quot;declared_directly\&quot;:true}],\&quot;arch\&quot;:\&quot;x86_64\&quot;,\&quot;built_on\&quot;:{\&quot;os\&quot;:\&quot;Macintosh\&quot;,\&quot;os_version\&quot;:\&quot;macOS 11.7\&quot;,\&quot;cpu_family\&quot;:\&quot;penryn\&quot;,\&quot;xcode\&quot;:\&quot;13.2.1\&quot;,\&quot;clt\&quot;:\&quot;13.2.0.0.1.1638488800\&quot;,\&quot;preferred_perl\&quot;:\&quot;5.30\&quot;}}&quot;&#x60;

&#x60;&#x60; &#x60;}&#x60;

&#x60;&#x60; &#x60;},&#x60;

&#x60;&#x60; &#x60;...&#x60;

&#x60;&#x60; &#x60;],&#x60;

&#x60;&#x60; &#x60;&quot;annotations&quot;&#x60; &#x60;: {&#x60;

&#x60;&#x60; &#x60;&quot;com.github.package.type&quot;&#x60; &#x60;: &#x60; &#x60;&quot;homebrew_bottle&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.description&quot;&#x60; &#x60;: &#x60; &#x60;&quot;Vi &#39;workalike&#39; with many additional features&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.license&quot;&#x60; &#x60;: &#x60; &#x60;&quot;Vim&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.ref.name&quot;&#x60; &#x60;: &#x60; &#x60;&quot;9.0.1900&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.revision&quot;&#x60; &#x60;: &#x60; &#x60;&quot;a78712b62dd7fba03243de22c20e4858d0fd1802&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.title&quot;&#x60; &#x60;: &#x60; &#x60;&quot;vim&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.vendor&quot;&#x60; &#x60;: &#x60; &#x60;&quot;homebrew&quot;&#x60; &#x60;,&#x60;

&#x60;&#x60; &#x60;&quot;org.opencontainers.image.version&quot;&#x60; &#x60;: &#x60; &#x60;&quot;9.0.1900&quot;&#x60;

&#x60;&#x60; &#x60;}&#x60;

&#x60;}&#x60;

And, voilà, the block above shows us the &#39;&#x60;sh.brew.bottle.digest&#x60;&#39; that we need in the next step

You can either pick through the file in your fav editor of-choice, but I found (when downloading many files from GitHub Packages) it was much easier to use &#39;&#x60;jq&#x60;&#39;

&#x60;cat&#x60; &#x60;manifest.json | jq &#x60; &#x60;&#39;.manifests[] | select(.platform.&quot;os.version&quot; | startswith(&quot;macOS &lt;version_num&gt;&quot;)) | select(.platform.architecture&#x3D;&#x3D;&quot;&lt;arch&gt;&quot;)&#39;&#x60; &#x60;| jq -r &#x60; &#x60;&#39;.annotations.&quot;sh.brew.bottle.digest&quot;&#39;&#x60;

For example, here&#39;s an execution that uses &#39;&#x60;jq&#x60;&#39; to extract the bottle digest hash for the blob for macOS 11 on a system with an amd64 processor.

&#x60;user@disp7456:~$ &#x60; &#x60;cat&#x60; &#x60;manifest.json | jq &#x60; &#x60;&#39;.manifests[] | select(.platform.&quot;os.version&quot; | startswith(&quot;macOS 11&quot;)) | select(.platform.architecture&#x3D;&#x3D;&quot;amd64&quot;)&#39;&#x60; &#x60;| jq -r &#x60; &#x60;&#39;.annotations.&quot;sh.brew.bottle.digest&quot;&#39;&#x60;

&#x60;6cbad503034158806227128743d2acc08773c90890cea12efee25c4a53399d02&#x60;

&#x60;user@disp7456:~$ &#x60;

### Download the file

Now, we can finally download our file if we just pass the &#39;&#x60;sh.brew.bottle.digest&#x60;&#39; hash found above into the &#x60;GET &#x2F;v2&#x2F;&lt;name&gt;&#x2F;blobs&#x2F;&#x60;&#39; API endpoint, as shown in the [table](#table) above

&#x60;curl -Lo &lt;package_name&gt;-&lt;package_version&gt;.bottle.&#x60; &#x60;tar&#x60; &#x60;.gz -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;-H &#x60; &#x60;&#39;Accept: application&#x2F;vnd.oci.image.layer.v1.tar+gzip&#39;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;ghcr&#x60; &#x60;.io&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;&#x60; &#x60;&lt;package_name&gt;&#x60; &#x60;&#x2F;blobs&#x2F;sha256&#x60; &#x60;:&lt;sh.brew.bottle.digest&gt;&#x60;

For example, the following command downloads &#39;&#x60;vim-9.0.1900.bottle.tar.gz&#x60;&#39;

&#x60;user@disp7456:~$ curl -Lo vim-9.0.1900.bottle.&#x60; &#x60;tar&#x60; &#x60;.gz -H &#x60; &#x60;&quot;Authorization: Bearer ${token}&quot;&#x60; &#x60;-H &#x60; &#x60;&#39;Accept: application&#x2F;vnd.oci.image.layer.v1.tar+gzip&#39;&#x60; &#x60;https:&#x60; &#x60;&#x2F;&#x2F;ghcr&#x60; &#x60;.io&#x60; &#x60;&#x2F;v2&#x2F;homebrew&#x2F;core&#x2F;vim&#x2F;blobs&#x2F;sha256&#x60; &#x60;:6cbad503034158806227128743d2acc08773c90890cea12efee25c4a53399d02&#x60;

&#x60;&#x60; &#x60;% Total % Received % Xferd Average Speed Time Time Time Current&#x60;

&#x60;&#x60; &#x60;Dload Upload Total Spent Left Speed&#x60;

&#x60;&#x60; &#x60;0 0 0 0 0 0 0 0 --:--:-- --:--:-- --:--:-- 0&#x60;

&#x60;100 12.9M 100 12.9M 0 0 1450k 0 0:00:09 0:00:09 --:--:-- 2798k&#x60;

&#x60;user@disp7456:~$ &#x60;

&#x60;user@disp7456:~$ &#x60; &#x60;ls&#x60;

&#x60;&#x60; &#x60;vim-9.0.1900.bottle.&#x60; &#x60;tar&#x60; &#x60;.gz&#x60;

&#x60;user@disp7456:~$ &#x60;

### Install the file

Finally, you can now transfer the file &#39;&#x60;vim-9.0.1900.bottle.tar.gz&#x60;&#39; to your macOS system and install it with brew.

&#x60;brew reinstall --verbose --debug path&#x60; &#x60;&#x2F;to&#x2F;&#x60; &#x60;&lt;package_name&gt;-&lt;package_version&gt;.&#x60; &#x60;tar&#x60; &#x60;.gz&#x60;

Here&#39;s an example execution

&#x60;user@host ~ % &#x60; &#x60;&#x2F;usr&#x2F;local&#x2F;bin&#x2F;brew&#x60; &#x60;reinstall --debug --verbose build&#x60; &#x60;&#x2F;deps&#x2F;vim-9&#x60; &#x60;.0.1900.bottle.&#x60; &#x60;tar&#x60; &#x60;.gz&#x60;

&#x60;&#x2F;usr&#x2F;local&#x2F;Homebrew&#x2F;Library&#x2F;Homebrew&#x2F;brew&#x60; &#x60;.rb (Formulary::FromNameLoader): loading vim&#x60;

&#x60;&#x2F;usr&#x2F;local&#x2F;Homebrew&#x2F;Library&#x2F;Homebrew&#x2F;brew&#x60; &#x60;.rb (Formulary::FromBottleLoader): loading build&#x60; &#x60;&#x2F;deps&#x2F;vim-9&#x60; &#x60;.0.1900.bottle.&#x60; &#x60;tar&#x60; &#x60;.gz&#x60;

&#x60;...&#x60;

&#x60;␛[34m&#x3D;&#x3D;&gt;␛[0m ␛[1mSummary␛[0m&#x60;

&#x60;...&#x60;

&#x60;user@host ~ % &#x60;

The package &#39;&#x60;vim&#x60;&#39; is now installed.

## Why?

I wrote this article because many, many folks have inquired about how to manually download files from OCI registries on the Internet, but their simple queries are usually returned with a barrage of useless counter-questions: why the heck would you want to do that!?!

The answer is varied.

Some people need to get files onto a restricted environment. Either their org doesn&#39;t grant them permission to install software on the machine, or the system has firewall-restricted internet access -- or doesn&#39;t have internet access at all.

## 3TOFU

Personally, the reason that I wanted to be able to download files from an OCI registry was for [3TOFU](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;08&#x2F;04&#x2F;3tofu&#x2F;).

[![Verifying Unsigned Releases with 3TOFU](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1200x628,sk1FfoShapkhUB7jGxz52xfYjvZPrJobo2zjkB-hg744&#x2F;https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;x3tofu_featuredImage.jpg.pagespeed.ic.St6s51_dPp.jpg)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;08&#x2F;04&#x2F;3tofu&#x2F;)

Unfortunaetly, most apps using OCI registries are _extremely_ insecure. Docker, for example, will happily download malicious images. By default, [it doesn&#39;t do _any_ authenticity verifications](https:&#x2F;&#x2F;security.stackexchange.com&#x2F;questions&#x2F;238916&#x2F;how-to-pin-public-root-key-when-downloading-an-image-with-docker-pull-docker-co?noredirect&#x3D;1&amp;lq&#x3D;1) on the payloads it downloaded. Even if you manually enable DCT, there&#39;s loads of [pending issues](https:&#x2F;&#x2F;github.com&#x2F;docker&#x2F;cli&#x2F;issues&#x2F;2752) with it.

Likewise, the macOS package manager [brew](https:&#x2F;&#x2F;brew.sh&#x2F;) has this same problem: it will happily download and install malicious code, because it doesn&#39;t use cryptography to verify the authenticity of anything that it downloads. This introduces [watering hole vulnerabilities](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Watering%5Fhole%5Fattack) when developers use brew to install dependencies in their CI pipelines.

My solution to this? [3TOFU](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;08&#x2F;04&#x2F;3tofu&#x2F;). And that requires me to be able to download the file (for verification) on three distinct linux VMs using curl or wget.

&gt; ![⚠](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sRaT0hPNHArXcToU1KPTndiJXtnwvc3nHYqgRAszUNWY&#x2F;https:&#x2F;&#x2F;s.w.org&#x2F;images&#x2F;core&#x2F;emoji&#x2F;14.0.0&#x2F;svg&#x2F;26a0.svg) NOTE: 3TOFU is an approach to harm reduction.
&gt; 
&gt; It is not wise to download and run binaries or code whose authenticity you cannot verify using a cryptographic signature from a key stored offline. However, sometimes we cannot avoid it. If you&#39;re going to proceed with running untrusted code, then following a [3TOFU procedure](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;08&#x2F;04&#x2F;3tofu&#x2F;) may reduce your risk, but it&#39;s better to avoid running unauthenticated code if at all possible.

## Registry (ab)use

Container registries were created in 2013 to provide a clever &amp; complex solution to a problem: how to package and serve multiple versions of simplified sources to various consumers spanning multiple operating systems and architectures -- while also packaging them into small, discrete &quot;layers&quot;.

However, if your project is just serving simple files, then the only thing gained by uploading them to a complex system like a container registry is headaches. Why do developers do this?

In the case of brew, their free hosing provider (JFrog&#39;s Bintray) [shutdown in 2021](https:&#x2F;&#x2F;jfrog.com&#x2F;blog&#x2F;into-the-sunset-bintray-jcenter-gocenter-and-chartcenter&#x2F;). Brew was already hosting their code on GitHub, so I guess someone looked at &quot;GitHub Packages&quot; and [figured it was](https:&#x2F;&#x2F;github.com&#x2F;orgs&#x2F;Homebrew&#x2F;discussions&#x2F;691) a good (read: free) replacement.

Many developers using Container Registries don&#39;t need the complexity, but -- well -- they&#39;re just using it as a free place for their FOSS project to store some files, man.

## Further Reading

1. [OCI Distribution Spec v1.1.0](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec&#x2F;releases&#x2F;download&#x2F;v1.1.0&#x2F;oci-distribution-spec-v1.1.0.pdf)
2. [Docker Registry HTTP API V2 Protocol Specification](https:&#x2F;&#x2F;github.com&#x2F;distribution&#x2F;distribution&#x2F;blob&#x2F;5cb406d511b7b9163bff9b6439072e4892e5ae3b&#x2F;docs&#x2F;spec&#x2F;api.md)
3. [Docker Image Specification v1.0.0](https:&#x2F;&#x2F;github.com&#x2F;moby&#x2F;moby&#x2F;blob&#x2F;79910625f0a7aa76590e4362817dda22f28343aa&#x2F;image&#x2F;spec&#x2F;v1.md)
4. List of [OCI Media Types](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;image-spec&#x2F;blob&#x2F;main&#x2F;media-types.md)
5. [Docker Registry (Documentation)](https:&#x2F;&#x2F;docs.docker.com&#x2F;registry&#x2F;)
6. [GitHub Packages (Documentation)](https:&#x2F;&#x2F;docs.github.com&#x2F;en&#x2F;packages&#x2F;learn-github-packages)
7. [CNCF Distribution Specification (GitHub)](https:&#x2F;&#x2F;github.com&#x2F;distribution&#x2F;distribution&#x2F;)
8. [OCI Distribution Specification (GitHub)](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec)
9. Request to add the not-yet-existing [OCI Auth Specification (GitHub)](https:&#x2F;&#x2F;github.com&#x2F;opencontainers&#x2F;distribution-spec&#x2F;issues&#x2F;240)
10. [Moby Project (GitHub)](https:&#x2F;&#x2F;github.com&#x2F;moby&#x2F;moby)
11. My [GitHub Ticket](https:&#x2F;&#x2F;github.com&#x2F;BusKill&#x2F;buskill-app&#x2F;issues&#x2F;78#issuecomment-2015962034) learning how to manually download brew package dependencies from GitHub Packages for 3TOFU with BusKill
12. More info about the Docker Image Spec (V1 and V2) - &lt;https:&#x2F;&#x2F;matrix.ai&#x2F;blog&#x2F;docker-image-specification-v1-vs-v2&#x2F;&gt;
13. Cool tool that serves as a proxy for downloading docker images for you - [DockerImageSave](https:&#x2F;&#x2F;github.com&#x2F;jadolg&#x2F;DockerImageSave)
14. Script for downloading &quot;frozen&quot; images from docker - [download-frozen-image-v2.sh](https:&#x2F;&#x2F;github.com&#x2F;moby&#x2F;moby&#x2F;blob&#x2F;master&#x2F;contrib&#x2F;download-frozen-image-v2.sh)
15. Python tool to download docker images - [docker-drag](https:&#x2F;&#x2F;github.com&#x2F;NotGlop&#x2F;docker-drag&#x2F;)
16. My article on [3TOFU](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;08&#x2F;04&#x2F;3tofu&#x2F;)

### Related Posts

![headshot of Michael Altfield](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;100x100,s3nzaMY9fCF54J13hE5dJFAHZPdaKUawcocuCLZZ8_Dk&#x2F;https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;sites&#x2F;5&#x2F;2019&#x2F;04&#x2F;100x100xavatar_square_150.jpg.pagespeed.ic.lvLST4AWRQ.jpg)

Hi, I’m Michael Altfield. I write articles about opsec, privacy, and devops [![➡](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5R0_PoJj9TOXIK30KQG7s9GN-YbfQ5PN8evxdp9WgXk&#x2F;https:&#x2F;&#x2F;s.w.org&#x2F;images&#x2F;core&#x2F;emoji&#x2F;14.0.0&#x2F;svg&#x2F;27a1.svg)](https:&#x2F;&#x2F;michaelaltfield.net&#x2F;biography&#x2F;)

[About Michael](https:&#x2F;&#x2F;michaelaltfield.net&#x2F;biography&#x2F;)

### Michael Altfield

Hi, I&#39;m Michael Altfield. I write articles about opsec, privacy, and devops [![➡](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5R0_PoJj9TOXIK30KQG7s9GN-YbfQ5PN8evxdp9WgXk&#x2F;https:&#x2F;&#x2F;s.w.org&#x2F;images&#x2F;core&#x2F;emoji&#x2F;14.0.0&#x2F;svg&#x2F;27a1.svg)](https:&#x2F;&#x2F;michaelaltfield.net&#x2F;biography&#x2F;)

[![Portrait of Michael Altfield](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;173x0,su8iQ32_E_Sz1s0574SMBo8Bw2DXUnFfsBpmMSR53x2A&#x2F;https:&#x2F;&#x2F;michaelaltfield.net&#x2F;wp-content&#x2F;uploads&#x2F;2022&#x2F;11&#x2F;berlin.jpg)](https:&#x2F;&#x2F;michaelaltfield.net&#x2F;biography&#x2F;)

[About Michael](https:&#x2F;&#x2F;michaelaltfield.net&#x2F;biography&#x2F;)

### Follow me

### Donate

**BTC**  
1DXyJpmu2KQMw2v4QJVzzjZo6f87BBndu6

**XMR**  
4B5ra5N1SN4d7BqDtkxAE5G5kGNz5mA5oCob41RzzoduM1uPAcr7QmNLzXtci5HvtkNXC7SowkxMjUUCXF2hm57MMS4jwkx

### .onion address

### Feautred Articles

### Recent Posts

* [Manually Downloading Container Images (Docker, Github Packages)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;09&#x2F;03&#x2F;container-download-curl-wget&#x2F;)
* [3TOFU: Verifying Unsigned Releases](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;08&#x2F;04&#x2F;3tofu&#x2F;)
* [Nightmare on Lemmy Street (A Fediverse GDPR Horror Story)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2024&#x2F;03&#x2F;04&#x2F;lemmy-fediverse-gdpr&#x2F;)
* [Guide to Finding Lemmy Communities (Subreddits)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2023&#x2F;06&#x2F;11&#x2F;lemmy-migration-find-subreddits-communities&#x2F;)
* [Trusted Boot (Anti-Evil-Maid, Heads, and PureBoot)](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;2023&#x2F;02&#x2F;16&#x2F;evil-maid-heads-pureboot&#x2F;)

### Related Posts

 Copyright © 2024 [Michael Altfield&#39;s Tech Blog](https:&#x2F;&#x2F;tech.michaelaltfield.net&#x2F;) \- All Rights Reserved  
Powered by [WordPress](http:&#x2F;&#x2F;wordpress.org&#x2F;) &amp; [Atahualpa](http:&#x2F;&#x2F;forum.bytesforall.com&#x2F;) 