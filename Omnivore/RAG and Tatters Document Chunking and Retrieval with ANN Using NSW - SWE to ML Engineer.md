---
id: 11e7da8c-983b-4669-a352-2a0caa10508a
title: RAG and Tatters Document Chunking and Retrieval with ANN Using NSW - SWE to ML Engineer
tags:
  - RSS
date_published: 2024-05-28 16:47:52
---

# RAG and Tatters Document Chunking and Retrieval with ANN Using NSW - SWE to ML Engineer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/rag-and-tatters-document-chunking-and-retrieval-with-ann-using-n-18fc1d0648b)
[Read Original](https://swe-to-mle.pages.dev/posts/rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw/)



## Contents

* [The Quest](#the-quest)
* [Why?](#why)
* [Compare Embeddings](#compare-embeddings)
* [Document Chunking](#document-chunking)  
   * [Fixed Size](#fixed-size)  
   * [Recursive Character Split (RCS)](#recursive-character-split-rcs)  
   * [Document Specific Splitting](#document-specific-splitting)  
   * [Semantic Splitting](#semantic-splitting)
* [Document Retrieval](#document-retrieval)  
   * [Exhaustive Search](#exhaustive-search)  
   * [Approximate Nearest Neighbor (ANN)](#approximate-nearest-neighbor-ann)
* [The code](#the-code)

_At first glance, the cloak appears to be nothing more than a collection of rags stitched together haphazardly, frayed edges fluttering like whispers in the wind. Yet, as the old wizard wraps it tightly around his shoulders, the air shimmers with a soft, silvery glow. Each tattered piece of fabric is imbued with arcane runes, barely visible, that hum with ancient magic, shielding him from the piercing cold and prying eyes alike. This patchwork garment, a tapestry of secrets, has safeguarded many a hidden wisdom through the ages._

[ ![cloak.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sD8xseGA1afa-QWqIIp5ixBJK5iNWh9Iz4VHp37Ir9Ec&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw&#x2F;cloak.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw&#x2F;cloak.png &quot;cloak&quot;)

Cloak in tatters

Create a threadbare implementation of the Retrieval-Augmented Generation (RAG) toolkit.

Using RAG lets us search documents by meaning instead of exact keywords. The matching documents are used to supplement the LLM context. This is useful for workflows that require asking questions from local documents on which the model hasn’t been trained. Or isolate a specific paragraph in a book or paper to reduce the cost of long context queries.

I’ll use a random off-the-shelf model to generate embeddings. If you want to read more about how Embeddings are created, take a look at my [Embeddings Necronomicon](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;embeddings-necronomicon&#x2F;).

&#x60;&#x60;&#x60;python
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings &#x3D; HuggingFaceEmbeddings()
def get_embedding(text):
    return torch.tensor(embeddings.embed_query(text))

&#x60;&#x60;&#x60;

Embeddings are N-dimensional vectors, and can be compared using cosine\_similarity (or cosine\_distance) which boils down to a dot product of normalized vectors.

&#x60;&#x60;&#x60;reasonml
def cosine_similarity(embed1, embed2):
    norm_embed1 &#x3D; embed1 &#x2F; embed1.norm()
    norm_embed2 &#x3D; embed2 &#x2F; embed2.norm()
    return norm_embed1 @ norm_embed2.T

def cosine_distance(embed1, embed2):
    return 1 - cosine_similarity(embed1, embed2)

&#x60;&#x60;&#x60;

This gives us a way to compare how similar two blocks of text are:

&#x60;&#x60;&#x60;reasonml
lemon &#x3D; get_embedding(&#39;lemons are yellow&#39;)
lime &#x3D; get_embedding(&#39;limes are green&#39;)
tomato &#x3D; get_embedding(&#39;tomatoes are red&#39;)
rain &#x3D; get_embedding(&#39;today is rainy&#39;)

print(f&#39;distance between &quot;lemon&quot; and &quot;lime&quot; is   {cosine_distance(lemon, lime)}&#39;)
print(f&#39;distance between &quot;lemon&quot; and &quot;tomato&quot; is {cosine_distance(lemon, tomato)}&#39;)
print(f&#39;distance between &quot;lemon&quot; and &quot;rain&quot; is   {cosine_distance(lemon, rain)}&#39;)

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;mipsasm
distance between &quot;lemon&quot; and &quot;lime&quot; is   0.3547552824020386
distance between &quot;lemon&quot; and &quot;tomato&quot; is 0.5043934583663940
distance between &quot;lemon&quot; and &quot;rain&quot; is   0.7150339484214783

&#x60;&#x60;&#x60;

Once we identify the documents matching our query we can add them to the context. This approach has several drawbacks, including scalability issues, because attention is quadratic on the size of the context. The documents might not be relevent in their entirety diluting the focus of the query. For that reason we will look at how we can split the documents into smaller chunks.

For this section, I’ll use the Wikipedia article on wizards as our document.

The simplest strategy is to split the documents into equally sized chunks. Here for simplicity of a fixed string size, but in practice it would be smarter to chunk it into a fixed number of tokens.

&#x60;&#x60;&#x60;matlab
def chunk_fixed_size(text, size):
    return [text[i:i+size] for i in range(0, len(text), size)]

chunks &#x3D; chunk_fixed_size(document, 50)
chunks[:4]

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;clojure
[&#39;Magicians appearing in fantasy fiction\n\nFor other &#39;,
 &#39;uses, see [Magician\n(disambiguation)](&#x2F;wiki&#x2F;Magici&#39;,
 &#39;an_\\(disambiguation\\) &quot;Magician\n\\(disambiguation\\)&#39;,
 &#39;&quot;) and [Magi (disambiguation)](&#x2F;wiki&#x2F;Magi_\\(disamb&#39;]

&#x60;&#x60;&#x60;

Optionally we could also allow for overlaps between chunks.

&#x60;&#x60;&#x60;matlab
def chunk_fixed_size_overlap(text, size, overlap):
    return [text[i:i+size] for i in range(0, len(text), size - overlap)]

chunks &#x3D; chunk_fixed_size_overlap(document, 50, 10)
chunks[:4]

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;clojure
[&#39;Magicians appearing in fantasy fiction\n\nFor other &#39;,
 &#39;For other uses, see [Magician\n(disambiguation)](&#x2F;w&#39;,
 &#39;ation)](&#x2F;wiki&#x2F;Magician_\\(disambiguation\\) &quot;Magicia&#39;,
 &#39;) &quot;Magician\n\\(disambiguation\\)&quot;) and [Magi (disamb&#39;]

&#x60;&#x60;&#x60;

A more useful approach is to split the text based on a hierarchy of specific landmarks (e.g. &#x60;&#39;\n\n&#39;&#x60;, &#x60;&#39;\n&#39;&#x60;, &#x60;&#39; &#39;&#x60;) until we reach the desired size. This is meant to preserve more structure than simple fixed size split.

&#x60;&#x60;&#x60;mel
def chunk_recursive_character_split(text, size, separators&#x3D;[&#39;\n\n&#39;, &#39;\n&#39;, &#39; &#39;]):
    if len(text) &lt;&#x3D; size: return [text]
    for separator in separators + [&#39;&#39;]:
        if (index :&#x3D; text[:size].rfind(separator)) !&#x3D; -1:
            index +&#x3D; len(separator)
            return [text[:index]] + chunk_recursive_character_split(text[index:], size, separators)

chunks &#x3D; chunk_recursive_character_split(document, 50)
chunks[:4]

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;taggerscript
[&#39;Magicians appearing in fantasy fiction\n\n&#39;,
 &#39;For other uses, see [Magician\n&#39;,
 &#39;(disambiguation)](&#x2F;wiki&#x2F;Magician_\\(disambiguation\\&#39;,
 &#39;) &quot;Magician\n&#39;]

&#x60;&#x60;&#x60;

It’s a good default for chunking. In practice we’d use longer than 50 characters chunks depending on the capabilities of the embedding model we are using as well as the context size of our LLM.

Or split based on the document specific grammar (e.g. markdown, HTML, PDF …).

&#x60;&#x60;&#x60;python
def chunk_markdown(text, size, offset&#x3D;0):
    &#39;&#39;&#39; piggyback on recursive character split for the demo but it should use a markdown parser &#39;&#39;&#39;
    separators &#x3D; [
        &#39;\n# &#39;, &#39;\n## &#39;, &#39;\n### &#39;, &#39;\n#### &#39;, &#39;\n##### &#39;, &#39;\n###### &#39;, # headings
        &#39;&#x60;&#x60;&#x60;\n&#39;, &#39;\n\n&#39;, # blocks
        &#39;\n&#39;, &#39;&#x60;&#39;, &#39;[&#39;, &#39;]&#39;, &#39;(&#39;, &#39;)&#39;, &#39;*&#39;, &#39;_&#39;, # inline
        &#39; &#39;, # words
    ]
    if len(text) &lt;&#x3D; size: return [text]
    for separator in separators + [&#39;&#39;]:
        if (index :&#x3D; text[offset:size].rfind(separator)) !&#x3D; -1:
            index +&#x3D; offset
            return [text[:index]] + chunk_markdown(text[index:], size, offset&#x3D;len(separator))

doc &#x3D; &#39;&#39;&#39;
# The Enigmatic Life of Wizard Eldrath

## Introduction
Eldrath the Wise, a wizard of great renown, has fascinated scholars and adventurers alike with his mysterious powers and secretive nature.

## Notable Achievements
Eldrath is known for many great deeds, including the discovery of the lost city of Aranthar and the creation of the spell of eternal light.
&#39;&#39;&#39;
chunks &#x3D; chunk_markdown(doc, 100)
chunks[:6]

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;scheme
[&#39;\n# The Enigmatic Life of Wizard Eldrath\n&#39;,
 &#39;\n## Introduction&#39;,
 &#39;\nEldrath the Wise, a wizard of great renown, has fascinated scholars and adventurers alike with his&#39;,
 &#39; mysterious powers and secretive nature.\n&#39;,
 &#39;\n## Notable Achievements&#39;,
 &#39;\nEldrath is known for many great deeds, including the discovery of the lost city of Aranthar and&#39;,

&#x60;&#x60;&#x60;

A more interesting concept is to use embeddings themselves to determine how to chunk the document by meaning. A naive aproach is to split the document into sentences (here I’ll re-use recursive character split) compute their embeddings. Use the embeddings to find topics boundary in the text and merge the rest together.

&#x60;&#x60;&#x60;sql
def cluster_chunks(chunks, indices, size&#x3D;500):
    &#39;&#39;&#39; cluster chunks such that:
      - each cluster is smaller or equal to size
      - chunks are clustered according to their relative similarities
    &#39;&#39;&#39;
    indices &#x3D; [i + 1 for i in indices] # shift to the right

    def rec(start, end, idx&#x3D;0):
        # shortcircuit if the entire chunk fits
        if sum(len(c) for c in chunks[start:end]) &lt;&#x3D; size:
            return [&#39;&#39;.join(chunks[start:end])]
        for i in range(idx, len(indices)):
            index &#x3D; indices[i]
            if start &lt; index &lt; end:
                return rec(start, index, i + 1) + rec(index, end, i + 1)
    
    return rec(0, len(chunks))

def chunk_semantic(text, size&#x3D;100):
    mini_chunks &#x3D; chunk_recursive_character_split(text, size)
    embeddings &#x3D; [get_embedding(c) for c in mini_chunks]
    similarities &#x3D; t.cosine_similarity(t.stack(embeddings[:-1]), t.stack(embeddings[1:]))
    _, indices &#x3D; t.sort(similarities)
    return cluster_chunks(mini_chunks, indices)

chunks &#x3D; chunk_semantic(document)
chunks[:4]

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;markdown
[&#39;Magicians appearing in fantasy fiction\n\nFor other uses, see [Magician\n(disambiguation)](&#x2F;wiki&#x2F;Magician_\\(disambiguation\\) &quot;Magician\n\\(disambiguation\\)&quot;) and [Magi (disambiguation)](&#x2F;wiki&#x2F;Magi_\\(disambiguation\\)\n&quot;Magi \\(disambiguation\\)&quot;).\n\n&#39;,
 &#39;&quot;Wizard (fantasy)&quot; redirects here. For other uses, see [Wizard\n(disambiguation)](&#x2F;wiki&#x2F;Wizard_\\(disambiguation\\) &quot;Wizard\n\\(disambiguation\\)&quot;).\n\n[![](&#x2F;&#x2F;upload.wikimedia.org&#x2F;wikipedia&#x2F;en&#x2F;thumb&#x2F;9&#x2F;99&#x2F;Question_book-\nnew.svg&#x2F;50px-Question_book-new.svg.png)](&#x2F;wiki&#x2F;File:Question_book-new.svg)|\n&#39;,
 &#39;This article **needs additional citations\n&#39;,
 &#39;for[verification](&#x2F;wiki&#x2F;Wikipedia:Verifiability &quot;Wikipedia:Verifiability&quot;)**.\n&#39;]

&#x60;&#x60;&#x60;

It a tradeoff that yields better quality chunks than RCS but is more computationally expensive to run.

Let’s emulate a vector database in 5 lines of code.

&#x60;&#x60;&#x60;coffeescript
# create a dummy database for our embegginds &#x2F; chunks pairs
def create_db(documents):
    chunks &#x3D; [chunk for document in documents for chunk in chunk_recursive_character_split(document, 100)]
    db &#x3D; t.stack([get_embedding(chunk) for chunk in chunks])
    return chunks, db

chunks, db &#x3D; create_db([document])

&#x60;&#x60;&#x60;

The simplest and exact way to retrieve chunks from the vector database is to perform an exhaustive search.

&#x60;&#x60;&#x60;routeros
def retrieve(query, k&#x3D;3, threshold&#x3D;0.5):
    query_embedding &#x3D; get_embedding(query)
    similarities &#x3D; t.cosine_similarity(db, query_embedding)
    values, indices &#x3D; t.topk(similarities, k&#x3D;k)
    indices &#x3D; indices[values &gt; threshold]
    return [chunks[i] for i in indices]

print(retrieve(&#39;dnd&#39;))
print(retrieve(&#39;banana&#39;))
print(retrieve(&#39;merlin the enchanter&#39;))
print(retrieve(&#39;harry potter&#39;))

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;markdown
[&#39;  * _[Dungeons&amp; Dragons](&#x2F;wiki&#x2F;Dungeons_%26_Dragons &quot;Dungeons &amp; Dragons&quot;)_\n&#39;, &#39;the _[Dungeons&amp; Dragons](&#x2F;wiki&#x2F;Dungeons_%26_Dragons &quot;Dungeons &amp; Dragons&quot;)_\n&#39;]
[]
[&#39;Pyle_The_Enchanter_Merlin.JPG)_The Enchanter Merlin_ , by [Howard\n&#39;, &#39;Pyle_The_Enchanter_Merlin.JPG&#x2F;170px-Arthur-\nPyle_The_Enchanter_Merlin.JPG)](&#x2F;wiki&#x2F;File:Arthur-\n&#39;, &#39;&quot;Mentor&quot;), with [Merlin](&#x2F;wiki&#x2F;Merlin &quot;Merlin&quot;) from the [_King Arthur_\n&#39;]
[&#39;series of books by [J. K. Rowling](&#x2F;wiki&#x2F;J._K._Rowling &quot;J. K. Rowling&quot;).\n\n&#39;, &#39;the Rings_ or [Lord Voldemort](&#x2F;wiki&#x2F;Lord_Voldemort &quot;Lord Voldemort&quot;) from\n&#39;, &#39;Lord of the Rings](&#x2F;wiki&#x2F;The_Lord_of_the_Rings &quot;The Lord of the Rings&quot;)_ and\n&#39;]

&#x60;&#x60;&#x60;

So the wizard wikipage doesn’t mention banana much, but searching for &#x60;harry potter&#x60; surface J.K. Rowling and Voldemort.

Making it scale! Instead of doing exhaustive search &#x60;O(n)&#x60;, we can perform an approximate nearest neighbor search using a greedy approach with navigable small world &#x60;O(log(n))&#x60;.

You might have heard the theory that you could reach anyone with 6 or fewer connections (e.g. you know your mom, she knows the mayor, he knows someone in parliment, which in turn knows Obama. Therefore you are less than 6 connections away from Obama). The “small-world” theory is a probabilistic approach to retrieval. We greedily explore our neighbor nodes that are closest to the target and reach a good approximation in logarithmic time.

Here’s one way to build the NSW graph.

&#x60;&#x60;&#x60;stata
def build_nsw_graph(db, k_near&#x3D;3, k_random&#x3D;3):
    &#39;&#39;&#39;
    build a graph by piggybacking on the KNN search and random nodes for far away connections.
    the way it is implemented early nodes will have more neighbors (this is not ideal but it&#39;ll do for a toy example).
    &#39;&#39;&#39;
    graph &#x3D; []
    # create node and add approximate nearest neighbors
    for idx, embedding in enumerate(db):
        node &#x3D; Node(idx, embedding)
        graph.append(node)
        if not idx: continue
        start_node &#x3D; graph[random.randint(0, idx - 1)]
        nearests &#x3D; greedy_k_nearest_neighbors(graph, start_node, embedding, k&#x3D;k_near)
        for near in nearests:
            node.neighbors.add(near.idx)
            near.neighbors.add(idx)
    # add random connections
    for idx in range(len(db)):
        for _ in range(k_random):
            neighbor &#x3D; random.randint(0, len(db) - 1)
            graph[idx].neighbors.add(neighbor)
            graph[neighbor].neighbors.add(idx)
    return graph

&#x60;&#x60;&#x60;

We insert nodes one at a time. For each node we estimate the closest K nodes and add them as our neighbors as well as K’ random other nodes. It produces a network with high clustering (we have K very closes neighbors) and low average distance (we have K’ long distance jumps).

[ ![build_nsw.gif](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sf-IOUzWamF2MupYaRgBftuDpSi6BurBc-wZc7BGHUAo&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw&#x2F;build_nsw.gif) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw&#x2F;build%5Fnsw.gif &quot;build_nsw&quot;)

Building the NSW graph

In order to find an approximation of the K-Nearest Neighbors we traverse the graph starting from a random node (or ideally a set of random nodes). Greedily traverse toward the closest node to our target until we get stuck in a local minimum and return our result.

&#x60;&#x60;&#x60;crmsh
def greedy_k_nearest_neighbors(graph, node, target, k&#x3D;3, compute_dist&#x3D;compute_dist):
    seen &#x3D; set([node.idx])
    dist &#x3D; compute_dist(node, target)
    nearests &#x3D; [(-dist, node)] # treat as a maxheap with bounded size &#x60;k&#x60;
    q &#x3D; [(dist, node)] # minheap
    
    while q:
        _, node &#x3D; heapq.heappop(q)
        for neighbor_idx in node.neighbors:
            if neighbor_idx in seen: continue
            neighbor &#x3D; graph[neighbor_idx]
            dist &#x3D; compute_dist(neighbor, target)
            if len(nearests) &lt; k:
                heapq.heappush(nearests, (-dist, neighbor))
            elif dist &lt; -nearests[0][0]:
                heapq.heapreplace(nearests, (-dist, neighbor))
            else:
                continue
            seen.add(neighbor_idx)
            heapq.heappush(q, (dist, neighbor))
    return [n[1] for n in nearests]

&#x60;&#x60;&#x60;

In this animation the &#x60;X&#x60; mark the target, nodes with a purple rim are the current best candidate for the KNN and nodes get marked in black once they have been traversed.

[ ![knn.gif](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAawhd8rwUQgtXSOdHkmbMQMjIhfjLg0FfvE3UinMYkc&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw&#x2F;knn.gif) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rag-and-tatters-document-chunking-and-retrieval-with-ann-using-nsw&#x2F;knn.gif &quot;knn&quot;)

K-Nearest Neighbor in NSW

&#x60;&#x60;&#x60;reasonml
def nsw_retrieve(query, k&#x3D;3, threshold&#x3D;0.5):
    query_embedding &#x3D; get_embedding(query)
    start_node &#x3D; graph[random.randint(0, len(graph) - 1)]
    nearests &#x3D; greedy_k_nearest_neighbors(graph, start_node, query_embedding, k&#x3D;k)
    res &#x3D; []
    for near in nearests:
        if compute_dist(near, query_embedding) &gt; threshold: continue
        res.append(chunks[near.idx])
    return res

print(nsw_retrieve(&#39;dnd&#39;))
print(nsw_retrieve(&#39;banana&#39;))
print(nsw_retrieve(&#39;merlin the enchanter&#39;))
print(nsw_retrieve(&#39;harry potter&#39;))

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;markdown
[&#39;  * _[Dungeons&amp; Dragons](&#x2F;wiki&#x2F;Dungeons_%26_Dragons &quot;Dungeons &amp; Dragons&quot;)_\n&#39;, &#39;the _[Dungeons&amp; Dragons](&#x2F;wiki&#x2F;Dungeons_%26_Dragons &quot;Dungeons &amp; Dragons&quot;)_\n&#39;]
[]
[&#39;&quot;Mentor&quot;), with [Merlin](&#x2F;wiki&#x2F;Merlin &quot;Merlin&quot;) from the [_King Arthur_\n&#39;, &#39;Pyle_The_Enchanter_Merlin.JPG)_The Enchanter Merlin_ , by [Howard\n&#39;, &#39;Pyle_The_Enchanter_Merlin.JPG&#x2F;170px-Arthur-\nPyle_The_Enchanter_Merlin.JPG)](&#x2F;wiki&#x2F;File:Arthur-\n&#39;]
[&#39;Rowling](&#x2F;wiki&#x2F;J._K._Rowling &quot;J. K. Rowling&quot;)\&#39;s _Harry Potter_ novels or\n&#39;, &#39;series of books by [J. K. Rowling](&#x2F;wiki&#x2F;J._K._Rowling &quot;J. K. Rowling&quot;).\n\n&#39;, &#39;the Rings_ or [Lord Voldemort](&#x2F;wiki&#x2F;Lord_Voldemort &quot;Lord Voldemort&quot;) from\n&#39;]

&#x60;&#x60;&#x60;

We retain the ability to retrieve most of the same documents as earlier but it is now possible to scale better.

This algorithm can be improved further by using Hierarchical Navigable Small Worlds (HNSW). Which is similar to using a skip-list but applied to a graph. Instead of having one NSW we can traverse. We have multiple layers of NSW starting from very sparse and getting increasingly denser. Each time we reach a local minimum we fall down to the denser layer below. This permits to travel further on initial jumps, reducing the average query time.

You can get the code at &lt;https:&#x2F;&#x2F;github.com&#x2F;peluche&#x2F;RAG-and-tatters&#x2F;blob&#x2F;master&#x2F;RAG-and-tatters.ipynb&gt;