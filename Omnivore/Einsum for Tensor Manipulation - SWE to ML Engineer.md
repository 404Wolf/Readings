---
id: 99a254c8-e49a-11ee-97cc-5f8e93e37de6
title: Einsum for Tensor Manipulation - SWE to ML Engineer
tags:
  - RSS
date_published: 2024-03-17 13:00:18
---

# Einsum for Tensor Manipulation - SWE to ML Engineer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/einsum-for-tensor-manipulation-swe-to-ml-engineer-18e4e0ac945)
[Read Original](https://swe-to-mle.pages.dev/posts/einsum-for-tensor-manipulation/)



_In the ethereal dance of the cosmos, where the arcane whispers intertwine with the silent echoes of unseen dimensions, the Ioun Stone of Mastery emerges as a beacon of unparalleled prowess. This luminescent orb, orbiting its bearer’s head, is a testament to the mastery of both magical and mathematical realms, offering a bridge between the manipulation of arcane energies and the intricate ballet of tensor mathematics. As the stone orbits, it casts a subtle glow, its presence a constant reminder of the dual dominion it grants over the spellbinding complexities of magic and the abstract elegance of multidimensional calculations, making the wielder a maestro of both mystical incantations and the unseen algebra of the universe._

[ ![&#x2F;posts&#x2F;einsum-for-tensor-manipulation&#x2F;ioun-stone.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1024x1024,svRq58zPBObbSB1IaCGUnSnwWrjSeZ07VZ6On0u4xaas&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;einsum-for-tensor-manipulation&#x2F;ioun-stone.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;einsum-for-tensor-manipulation&#x2F;ioun-stone.png &quot;ioun-stone&quot;)

Ioun Stone of Mastery

Study how the Ioun Stone powers work. Understand how Einsum operates over tensors.

Einsum (and einops in general) is a great tool for manipulating tensors. In ML it is often used to implement matrix multiplication or dot products. The simplest case would look like:

&#x60;&#x60;&#x60;ini
x &#x3D; torch.rand((4, 5))
y &#x3D; torch.rand((5, 3))

# the torch way
res &#x3D; x @ y

# einsum way
res &#x3D; einsum(x, y, &#39;a b, b c -&gt; a c&#39;)

&#x60;&#x60;&#x60;

Right now it looks like a verbose way of doing the same thing, but it sometimes presents the following advantages:

* documenting the tensor dimensions for ease of reading
* implicit reordering of dimensions

&#x60;&#x60;&#x60;ini
query &#x3D; torch.rand((100, 20, 32))
key   &#x3D; torch.rand((100, 20, 32))

# the torch way
keyT &#x3D; key.permute((0, 2, 1))
res &#x3D; query @ keyT

# einsum way
res2 &#x3D; dumbsum(query, key, &#39;batch seq_q d_model, batch seq_k d_model -&gt; batch seq_q seq_k&#39;)

&#x60;&#x60;&#x60;

Conceptually it’s possible to think of einsum as bunch of nested loops:

* the first set of nested loops is used to index into the inputs and output.
* the second set of nested loops for summing all the left over dimensions that are getting reduced.

It could be written by hand as:

&#x60;&#x60;&#x60;maxima
result &#x3D; torch.zeros((10, 20, 20))
for batch in range(10):
  for seq_q in range(20):
    for seq_k in range(20):
      tot &#x3D; 0
      for d_model in range(32):
        tot +&#x3D; query[batch, seq_q, d_model] * key[batch, seq_k, d_model]
      result[batch, seq_q, seq_k] &#x3D; tot

&#x60;&#x60;&#x60;

One way to generate these nested loops is to use recursion:

&#x60;&#x60;&#x60;stata
def dumbsum(x, y, shapes):
  &#39;&#39;&#39;
  dumb implem for my own intuition building sake, with absolutely no value for real life use.
  not vectorized, and do not handle splitting &#x2F; merging &#x2F; creating extra dim.
  
  the main idea is to:
  1- generate nested loops for indexing for each dim in the output
  2- generate nexted loops for summing everything else
  e.g. &#39;a b c d e, a c e -&gt; a d b&#39;
  for a in range(x.shape[0]):
    for d in range(x.shape[3]):
      for b in range(x.shape[1]):
        tot &#x3D; 0
        for c in range(x.shape[2]):
          for e in range(x.shape[4]):
            tot +&#x3D; x[a, b, c, d, e] * y[a, c, e]
        res[a, d, b] &#x3D; tot

  in practice I initialize res to a tensor of zero, and update it in place instead of accumulating in a tot
  res[a, d, b] +&#x3D; x[a, b, c, d, e] * y[a, c, e]
  &#39;&#39;&#39;
  def split_shape(shape):
    return [x for x in shape.split(&#39; &#39;) if x]
  def parse(shapes):
    assert shapes.count(&#39;,&#39;) &#x3D;&#x3D; 1
    assert shapes.count(&#39;-&gt;&#39;) &#x3D;&#x3D; 1
    shapes, res_shape &#x3D; shapes.split(&#39;-&gt;&#39;)
    x_shape, y_shape &#x3D; shapes.split(&#39;,&#39;)
    x_shape, y_shape, res_shape &#x3D; (split_shape(s) for s in (x_shape, y_shape, res_shape))
    sum_shape &#x3D; list(set(x_shape + y_shape) - set(res_shape))
    assert set(res_shape).issubset(set(x_shape + y_shape))
    return x_shape, y_shape, res_shape, sum_shape
  def build_dim_lookup(t, t_shape, lookup&#x3D;None):
    if not lookup: lookup &#x3D; {}
    dims &#x3D; t.shape
    for dim, letter in zip(dims, t_shape):
      assert lookup.get(letter, dim) &#x3D;&#x3D; dim
      lookup[letter] &#x3D; dim
    return lookup
  def iterate(shape, sum_shape, fn, lookup, indexes):
    if not shape:
      iterate_sum(sum_shape[:], fn, lookup, indexes)
      return
    dim &#x3D; shape.pop(-1)
    # print(f&#39;iterate over → {dim}&#39;)
    for i in range(lookup[dim]):
      indexes[dim] &#x3D; i
      iterate(shape[:], sum_shape, fn, lookup, indexes)
  def iterate_sum(sum_shape, fn, lookup, indexes):
    if not sum_shape:
      fn(indexes)
      return
    dim &#x3D; sum_shape.pop(-1)
    # print(f&#39;sum over → {dim}&#39;)
    for i in range(lookup[dim]):
      indexes[dim] &#x3D; i
      iterate_sum(sum_shape[:], fn, lookup, indexes)
  def ind(t_shape, indexes):
    return (indexes[dim] for dim in t_shape)
  def close_sum(x, y, res, x_shape, y_shape, res_shape):
    def fn(indexes):
      # print(f&#39;res[{tuple(ind(res_shape, indexes))}] +&#x3D; x[{tuple(ind(x_shape, indexes))}] * y[{tuple(ind(y_shape, indexes))}]&#39;)
      res[*ind(res_shape, indexes)] +&#x3D; x[*ind(x_shape, indexes)] * y[*ind(y_shape, indexes)]
    return fn

  x_shape, y_shape, res_shape, sum_shape &#x3D; parse(shapes)
  assert len(x_shape) &#x3D;&#x3D; x.dim()
  assert len(y_shape) &#x3D;&#x3D; y.dim()
  lookup &#x3D; build_dim_lookup(x, x_shape)
  lookup &#x3D; build_dim_lookup(y, y_shape, lookup&#x3D;lookup)
  res &#x3D; t.zeros(tuple(lookup[s] for s in res_shape))
  fn &#x3D; close_sum(x, y, res, x_shape, y_shape, res_shape)
  iterate(res_shape[:], sum_shape[:], fn, lookup, {})
  return res

&#x60;&#x60;&#x60;

The loop version is great for intuition building, but it is extremely slow. Another way to implement einsum is to compose vectorized torch operations.

By hand it would look something like:

&#x60;&#x60;&#x60;routeros
query &#x3D; query[..., None] # add a seq_k dimension
key &#x3D; key[..., None]     # add a seq_q dimension
query &#x3D; query.permute((0, 1, 3, 2)) # align the dimensions as: batch, seq_q, seq_k, d_model
key &#x3D; key.permute((0, 3, 1, 2))     # align the dimensions as: batch, seq_q, seq_k, d_model 
product &#x3D; query * key # multiply element wise using implicit broadcasting
result &#x3D; product.sum((3)) # reduce the extra dimension out

&#x60;&#x60;&#x60;

Which in code could look a little something like:

&#x60;&#x60;&#x60;stata
def dumbsum_vectorized(x, y, shapes):
  &#39;&#39;&#39;
  vectorize it, still do not handle splitting &#x2F; merging &#x2F; creating extra dim.
  my vectorized also does not handle repeated dim (e.g. &#39;a a b, a a c -&gt; a a&#39;).
  
  the main idea is to:
  1- align the dimensions of x and y, completing the holes with fake &#x60;1&#x60; dimensions
  2- multiply x and y
  3- sum out the extra dims
  e.g. &#39;a c d e, a c e -&gt; a d b&#39;
  # align dims
  x &#x3D; reshape(&#39;a c d e -&gt; a 1 c d e&#39;)
  y &#x3D; reshape(&#39;a c e   -&gt; a 1 c 1 e&#39;)
  # order dims
  x &#x3D; reshape(&#39;a 1 c d e -&gt; a d 1 c e&#39;)
  y &#x3D; reshape(&#39;a 1 c 1 e -&gt; a 1 1 c e&#39;)
  # mult and sum
  res &#x3D; x * y
  res &#x3D; res.sum((3, 4))
  &#39;&#39;&#39;
  def split_shape(shape):
    return [x for x in shape.split(&#39; &#39;) if x]
  def parse(shapes):
    assert shapes.count(&#39;,&#39;) &#x3D;&#x3D; 1
    assert shapes.count(&#39;-&gt;&#39;) &#x3D;&#x3D; 1
    shapes, res_shape &#x3D; shapes.split(&#39;-&gt;&#39;)
    x_shape, y_shape &#x3D; shapes.split(&#39;,&#39;)
    x_shape, y_shape, res_shape &#x3D; (split_shape(s) for s in (x_shape, y_shape, res_shape))
    sum_shape &#x3D; list(set(x_shape + y_shape) - set(res_shape))
    assert set(res_shape).issubset(set(x_shape + y_shape))
    return x_shape, y_shape, res_shape, sum_shape
  def build_dim_pos_lookup(t_shape):
    return {letter: dim for dim, letter in enumerate(t_shape)}
  def expand(t, t_shape, merged):
    lookup &#x3D; build_dim_pos_lookup(t_shape)
    ind &#x3D; len(lookup)
    for dim in merged:
      if dim not in lookup:
        t &#x3D; t.unsqueeze(-1)
        lookup[dim] &#x3D; ind
        ind +&#x3D; 1
    return t, lookup
  def align(t, lookup, res_lookup):
    # rely on dict being ordered (python &gt;&#x3D; 3.7)
    permuted_dims &#x3D; tuple(lookup[dim] for dim in res_lookup)
    return t.permute(permuted_dims)
  def dims_to_sum(res_shape, res_lookup):
    return tuple(range(len(res_shape), len(res_lookup)))

  x_shape, y_shape, res_shape, sum_shape &#x3D; parse(shapes)
  assert len(x_shape) &#x3D;&#x3D; x.dim()
  assert len(y_shape) &#x3D;&#x3D; y.dim()
  merged &#x3D; set(x_shape + y_shape)
  x, x_lookup &#x3D; expand(x, x_shape, merged)
  y, y_lookup &#x3D; expand(y, y_shape, merged)
  _, res_lookup &#x3D; expand(t.zeros((0)), res_shape, merged)
  x &#x3D; align(x, x_lookup, res_lookup)
  y &#x3D; align(y, y_lookup, res_lookup)
  res &#x3D; x * y
  dims &#x3D; dims_to_sum(res_shape, res_lookup)
  if dims: res &#x3D; res.sum(dims)
  return res

&#x60;&#x60;&#x60;

We can verify that both versions are producing the same results as the original einsum:

&#x60;&#x60;&#x60;reasonml
import torch, einops

def einops_test(x, y, pattern):
  a &#x3D; dumbsum(x, y, pattern)
  b &#x3D; dumbsum_vectorized(x, y, pattern)
  c &#x3D; einops.einsum(x, y, pattern)
  assert a.allclose(c)
  assert b.allclose(c)

x &#x3D; torch.rand((10, 5, 2, 3))
y &#x3D; torch.rand((3, 10, 5, 7))
einops_test(x, y, &#39;a b c d, d a b e -&gt; b e c&#39;)
einops_test(x, y, &#39;a b c d, d a b e -&gt; a b c d e&#39;)
einops_test(x, y, &#39;a b c d, d a b e -&gt; e d c b a&#39;)
einops_test(x, y, &#39;a b c d, d a b e -&gt; a&#39;)
einops_test(x, y, &#39;a b c d, d a b e -&gt;&#39;)
einops_test(x, y, &#39;a b c d, d a b e -&gt; a e&#39;)

&#x60;&#x60;&#x60;

Timing the iterative version:

&#x60;&#x60;&#x60;lsl
%%time
query &#x3D; torch.rand((100, 20, 32))
key &#x3D; torch.rand((100, 20, 32))
_ &#x3D; dumbsum(query, key, &#39;batch seq_q d_model, batch seq_k d_model -&gt; batch seq_q seq_k&#39;)

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;yaml
CPU times: total: 9.58 s
Wall time: 31.3 s

&#x60;&#x60;&#x60;

Against the vectorized version:

&#x60;&#x60;&#x60;reasonml
%%time
query &#x3D; torch.rand((100, 20, 32))
key &#x3D; torch.rand((100, 20, 32))
_ &#x3D; dumbsum_vectorized(query, key, &#39;batch seq_q d_model, batch seq_k d_model -&gt; batch seq_q seq_k&#39;)

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;yaml
CPU times: total: 0 ns
Wall time: 975 µs

&#x60;&#x60;&#x60;

Demonstrates the significant speedup brought by using vectorized code.

You can get the code at &lt;https:&#x2F;&#x2F;github.com&#x2F;peluche&#x2F;ml-misc&#x2F;blob&#x2F;master&#x2F;einsum-intuition.ipynb&gt;