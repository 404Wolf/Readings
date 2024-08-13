---
id: 483308d3-c862-40d1-ba45-43487cd5c3ec
title: Servers with Node
tags:
  - RSS
date_published: 2024-08-03 12:05:24
---

# Servers with Node
#Omnivore

[Read on Omnivore](https://omnivore.app/me/servers-with-node-1911901bb9e)
[Read Original](https://elijer.github.io/garden/Dev-Notes/Servers/Servers-with-Node)



## Simple HTTP servers with Node and Express-

Two Lines

&#x60;import express from &#39;express&#39;
const app &#x3D; express().get(&#39;&#x2F;&#39;, req &#x3D;&gt; res.send(&quot;Hey world&quot;)).listen(3000, () &#x3D;&gt; console.log(&quot;Listening on port 3000&quot;))&#x60;

Four lines

&#x60;import express from &#39;express&#39;
const app &#x3D; express()
app.get(&#39;&#x2F;&#39;, req &#x3D;&gt; res.send(&quot;Hey world&quot;))
app.listen(3000, () &#x3D;&gt; console.log(&quot;Listening on port 3000&quot;))&#x60;

Don’t forget your packages and package.json:

&#x60;npm init -y
npm install express&#x60;

Modify your package.json so that it has

&#x60;&quot;type&quot;: &quot;module&quot;&#x60;

Otherwise just use the &#x60;require&#x60; syntax to import &#x60;express&#x60;:

&#x60;const express &#x3D; require(&#39;express&#39;)&#x60;

## Node app without express

Express is very nice, but if you didn’t even want to use &#x60;npm&#x60; at all, you can do all of this using just Node.

&#x60;import http from &#39;http&#39;;
 
http.createServer((req, res) &#x3D;&gt; {
  if (req.method &#x3D;&#x3D;&#x3D; &#39;GET&#39; &amp;&amp; req.url &#x3D;&#x3D;&#x3D; &#39;&#x2F;&#39;) {
    res.end(&#39;Hey world&#39;);
  } else {
    res.statusCode &#x3D; 404;
    res.end(&#39;Not Found&#39;);
  }
}).listen(3000, () &#x3D;&gt; console.log(&#39;Listening on port 3000&#39;));
 &#x60;

---