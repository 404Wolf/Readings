---
id: 14b7ae3c-2a52-4fa2-8eae-76d18633aebf
title: SVD for Image Compression and Recommender Systems - SWE to ML Engineer
tags:
  - RSS
date_published: 2024-06-27 18:06:53
---

# SVD for Image Compression and Recommender Systems - SWE to ML Engineer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/svd-for-image-compression-and-recommender-systems-swe-to-ml-engi-1905c48cad4)
[Read Original](https://swe-to-mle.pages.dev/posts/svd-for-image-compression-and-recommender-systems/)



## Contents

* [The Quest](#the-quest)
* [Why SVD?](#why-svd)
* [Singular Value Decomposition (SVD)](#singular-value-decomposition-svd)
* [Image Compression](#image-compression)
* [Recommender Systems](#recommender-systems)  
   * [SVD](#svd)  
   * [Funk SVD](#funk-svd)
* [The code](#the-code)
* [Sources](#sources)

_Beneath the Arcane Academy, the Crucible of the Magi endures—aglow with a roaring fire, this dark iron relic, used to dissect enchanted artifacts into their primal essences, whispers secrets of raw power and hidden truths as it deconstructs, revealing the core components fundamental to spellcraft. Those who wield its power must tread carefully, for the truths it unveils can be as perilous as they are enlightening._

[ ![crucible-of-the-magi.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s3ZcYa6bOENVcZz9vSMUqGUMiJZxoIBODDk3fdyu6B7Q&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;crucible-of-the-magi.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;crucible-of-the-magi.png &quot;crucible-of-the-magi&quot;)

Crucible of the Magi

Harness the power of SVD to compress images and recommend books.

SVD is a mathematical tool to deconstruct a matrix of data into its underlying patterns. It allows us to discover hidden regularities in the data. This can be exploited to get rid of redundancies or low level noise and focus on the stronger signal.

SVD lets us factor a matrix AA into 3 componentsA\&#x3D;UΣVT A &#x3D; U \\Sigma V^{T} AA: (m, n) matrix

UU: (m, m) column matrix

Σ\\Sigma: (m, n) diagonal matrix

VTV^{T}: (n, n) row matrix

The SVD has many mathematical properties, and is computed using dark magic (iterative algorithms). But for our purpose I mostly care about one property: the columns of UU, values of Σ\\Sigma, and rows of VTV^{T} are sorted by variance (aka. the important patterns go first, and the leftover noise goes last).

&#x60;&#x60;&#x60;haskell
# given a cloud of points data, we compute the SVD
u, s, v &#x3D; torch.svd(data)
pca_data &#x3D; data @ v
plot_points(data)
plot_points(data, v)
plot_points(pca_data, v.T @ v)

&#x60;&#x60;&#x60;

[ ![pca.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sx79HDtIrvcxDTuWSPVHLEmHznPvTJuIzYKHQg6NK9bI&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;pca.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;pca.png &quot;pca&quot;)

PCA using SVD

Here the vector &#x60;v[0]&#x60; drawn in black is the principal component as it explains most of the variance of our points (aka. the points are the most spread out in the black diagonal axis). We can use &#x60;v&#x60; to make a basis change and align the cloud of points with the &#x60;x&#x60; axis.

Reusing the same property we can decompose an image into its most important components and discard the leftover to compress it.

&#x60;&#x60;&#x60;makefile
h, w, c &#x3D; img.shape
# reshape the image into a 2d tensor by concatenating the color channel &#x60;c&#x60; with the width &#x60;w&#x60;
reshaped &#x3D; img.reshape(h, w * c)
u, s, v &#x3D; torch.svd(reshaped)
step &#x3D; 10 # how many components we want to keep
reconstructed &#x3D; u[:, :step] @ t.diag(s[:step]) @ v[:, :step].T
reconstructed &#x3D; reconstructed.view(h, w, c)

&#x60;&#x60;&#x60;

[ ![compression.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sUwLtueiz7KZPmhDAhGZeXB3oef53sYCmiCZMOF1g4wc&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;compression.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;compression.png &quot;compression&quot;)

Ratios of Image Compression

At step 130 we achieve a file size of only 12% but cover 80% of the variance, and the image looks close to the original.

![compression.gif](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7YfRRJyZocJS-faWVgxmEnRW_FEX6xNUemhw02RMGfw&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;compression.gif &quot;compression-gif&quot;)

The regularities SVD finds in the data can also be used to make a rudimentary recommender system.

&#x60;&#x60;&#x60;makefile
# given a matrix of (users, books) containing ratings from 1-5 and 0 for non-rated
u, s, v &#x3D; torch.svd(user_book)
r &#x3D; 100
# given a new user rating a few books
ratings &#x3D; t.zeros(user_book.shape[1])
ratings[15] &#x3D; 4
ratings[20] &#x3D; 5
ratings[30] &#x3D; 3
ratings[50] &#x3D; 4
# project the new user into the latent space of v
user_projection &#x3D; ratings @ v[:, :r]
# predict the other ratings based on the projected user
predictions &#x3D; user_projection @ v[:, :r].T

&#x60;&#x60;&#x60;

We compute the similarities between users and books relations, and use them to predict the books a new user would like given the books they already rated. In practice the latent space is not nicely interpretable, but in concept we could imagine that some pattern would emerge around the genres of the book, and the age of the reader, the language of the text…

When presented with a new user we fit it to a reader archetype, if they rated highly fantasy books for young adults in english, when projecting the archetype back into the full list of books, we’ll get high scores for other similar books.

Now say we have a lot more books, and a lot more users. Computing the SVD becomes prohibitively expensive, even building the &#x60;(users, book)&#x60; matrix becomes too expensive. Most of the users haven’t read most of the books. So the matrix is very sparse, and we could instead represent the relations as a list of triplets of &#x60;(user_id, book_id, rating)&#x60;.

Simon Funk came up with a solution to compute an approximation of the SVD by ignoring the unrated elements and focusing on only predicting the triplets.

&#x60;&#x60;&#x60;ruby
class NaiveFunk(nn.Module):
    def __init__(self, users, books, r&#x3D;100):
        super().__init__()
        self.user_factors &#x3D; nn.Parameter(torch.randn(users, r))
        self.book_factors &#x3D; nn.Parameter(torch.randn(books, r))

    def forward(self, user, book):
        user_vec &#x3D; self.user_factors[user]
        book_vec &#x3D; self.book_factors[book]
        ratings &#x3D; torch.sum(user_vec * book_vec, dim&#x3D;-1)
        return ratings
    
    @property
    def u(self): return self.user_factors.data
    @property
    def v(self): return self.book_factors.data

&#x60;&#x60;&#x60;

We train the model only on rated entries:

&#x60;&#x60;&#x60;routeros
def train(model, ds, epochs&#x3D;1000, lr&#x3D;1e-3, opt&#x3D;None, batch_size&#x3D;10000):
    if opt is None: opt &#x3D; optim.AdamW(model.parameters(), lr&#x3D;lr, weight_decay&#x3D;1e-2)
    for epoch in range(epochs):
        for batch_start in range(0, len(ds), batch_size):
            batch &#x3D; ds[batch_start:batch_start+batch_size]
            user_idx &#x3D; torch.tensor(batch[&#39;user_id&#39;].values, dtype&#x3D;torch.int, device&#x3D;device)
            book_idx &#x3D; torch.tensor(batch[&#39;book_id&#39;].values, dtype&#x3D;torch.int, device&#x3D;device)
            ratings &#x3D; torch.tensor(batch[&#39;rating&#39;].values, dtype&#x3D;torch.float32, device&#x3D;device)
            preds &#x3D; model(user_idx, book_idx)
            loss &#x3D; F.mse_loss(preds, ratings)
            opt.zero_grad()
            loss.backward()
            opt.step()

&#x60;&#x60;&#x60;

One way to evaluate the quality of the recommendation is to take a set of test users we haven’t trained on. Mask their top 10 highest rated books and ask the model to predict recommendations based on their other liked books. Use the ratio of overlap between the user favorite-10 and the system top-10 recommendations.

[ ![train.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5UYnJCdtYUR3Q4BDJvUvrCeXhI10_wXzI9Zf3YMZDnQ&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;train.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;svd-for-image-compression-and-recommender-systems&#x2F;train.png &quot;train&quot;)

Loss and Top-10 Ratio over 2500 epochs

You can get the code at &lt;https:&#x2F;&#x2F;github.com&#x2F;peluche&#x2F;SVD&gt;

* Lectures from Steve Brunton: &lt;https:&#x2F;&#x2F;youtu.be&#x2F;gXbThCXjZFM&gt;
* Lectures by Gilbert Strang: &lt;https:&#x2F;&#x2F;youtu.be&#x2F;mBcLRGuAFUk&gt;
* Simon Funk explanation of his algorithm: &lt;https:&#x2F;&#x2F;sifter.org&#x2F;simon&#x2F;journal&#x2F;20061211.html&gt;