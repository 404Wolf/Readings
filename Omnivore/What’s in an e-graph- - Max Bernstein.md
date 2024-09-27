---
id: bef5f7fe-4895-4d22-8a30-3f52973ff685
title: What’s in an e-graph? | Max Bernstein
tags:
  - RSS
date_published: 2024-09-11 00:00:00
---

# What’s in an e-graph? | Max Bernstein
#Omnivore

[Read on Omnivore](https://omnivore.app/me/what-s-in-an-e-graph-max-bernstein-191e0b48c5b)
[Read Original](https://bernsteinbear.com/blog/whats-in-an-egraph/)



_This post follows from several conversations with [CF Bolz-Tereick](https:&#x2F;&#x2F;cfbolz.de&#x2F;), [Philip Zucker](https:&#x2F;&#x2F;www.philipzucker.com&#x2F;), [Chris Fallin](https:&#x2F;&#x2F;cfallin.org&#x2F;), and [Max Willsey](https:&#x2F;&#x2F;www.mwillsey.com&#x2F;)._

Compilers are all about program representations. They take in a program in one language, transform some number of ways through some different internal languages, and output the program in another language[1](#fn:languages).

Part of the value in the inter-language transformations is optimizing the program. This can mean making it faster, smaller, or something else. Optimizing requires making changes to the program. For example, consider the following piece of code in a made-up IR:

&#x60;&#x60;&#x60;ini
v0 &#x3D; ...
v1 &#x3D; Const 8
v2 &#x3D; v0 * v1

&#x60;&#x60;&#x60;

If the compiler wants to optimize the instruction for &#x60;v2&#x60;, it has to go through and logically replace all uses of &#x60;v2&#x60; with the replacement instruction. This is a rewrite.

Many compilers will go through and iterate through every instruction and check if that instruction &#x60;op&#x60; uses the original instruction &#x60;v2&#x60;. If it does, it will swap all of its uses of &#x60;v2&#x60; with the replacement instruction.

&#x60;&#x60;&#x60;livescript
void very_specific_optimization(Instr* instr) {
  if (instr-&gt;IsMul() &amp;&amp; instr-&gt;Operand(1)-&gt;IsConst() &amp;&amp;
      instr-&gt;Operand(1)-&gt;AsConst()-&gt;Value() &#x3D;&#x3D; 8) {
    Instr* replacement &#x3D; new LeftShift(instr-&gt;Operand(0), new Const(3));
    for (auto op : block.ops) {
      if (op-&gt;uses(instr)) {
        op-&gt;replace_use(instr, replacement);
      }
    }
  }
}

&#x60;&#x60;&#x60;

This is fine. It’s very traditional. Depending on the size and complexity of your programs, this can work. It’s how the [Cinder JIT](https:&#x2F;&#x2F;github.com&#x2F;facebookincubator&#x2F;cinder&#x2F;) works for its two IRs. It’s very far from causing any performance problems in the compiler. But there are other compilers with other constraints and therefore other approaches to doing these rewrites.

In this post, I’m going to take you on a bit of a meandering walk. We’ll start from an alternative to find-and-replace called _union-find_ and then incrementally add features until we accidentally have built another data strucutre called an _e-graph_. Hopefully it removes some of the mystery.

## Union-find

I love union-find. It enables fast, easy, in-place IR rewrites for compiler authors. Its API has two main functions: &#x60;union&#x60; and &#x60;find&#x60;. The minimal implementation is about 15 lines of code and is embeddable directly in your IR.

Instead of iterating through every operation in the basic block and swapping pointers, we instead mark our IR node as “pointing to” another node. The below snippet replaces the entire loop in the previous example:

&#x60;&#x60;&#x60;lisp
instr-&gt;make_equal_to(new LeftShift(instr-&gt;Operand(0), new Const(3)));

&#x60;&#x60;&#x60;

This notion of a forwarding pointer can be either embedded in the IR node itself or in an auxiliary table. Each node maintains its source of truth, and each rewrite takes only one pointer swap (yes, there’s some pointer chasing, but it’s _very little_ pointer chasing[2](#fn:advanced-features)). It’s a classic time-space trade-off, though. You have to store \~1 additional pointer of space for each IR node.

See below an adaptation of CF’s implementation from the toy optimizer series[3](#fn:also-phil):

&#x60;&#x60;&#x60;python
from __future__ import annotations
from dataclasses import dataclass
from typing import Optional

@dataclass
class Expr:
    forwarded: Optional[Expr] &#x3D; dataclasses.field(
        default&#x3D;None,
        init&#x3D;False,
        compare&#x3D;False,
        hash&#x3D;False,
    )

    def find(self) -&gt; Expr:
        &quot;&quot;&quot;Return the representative of the set containing &#x60;self&#x60;.&quot;&quot;&quot;
        expr &#x3D; self
        while expr is not None:
            next &#x3D; expr.forwarded
            if next is None:
                return expr
            expr &#x3D; next
        return expr

    def make_equal_to(self, other) -&gt; None:
        &quot;&quot;&quot;Union the set containing &#x60;self&#x60; with the set containing &#x60;other&#x60;.&quot;&quot;&quot;
        found &#x3D; self.find()
        if found is not other:
            found.forwarded &#x3D; other

&#x60;&#x60;&#x60;

Union-find can be so fast because it is limited in its expressiveness:

* There’s no built-in way to enumerate the elements of a set
* Each set has a single representative element
* We only care about the representative of a set

(If you want to read more about it, check out the first half of my other post,[Vectorizing ML models for fun](https:&#x2F;&#x2F;bernsteinbear.com&#x2F;blog&#x2F;vectorizing-ml-models&#x2F;), the [toy optimizer](https:&#x2F;&#x2F;pypy.org&#x2F;posts&#x2F;2022&#x2F;07&#x2F;toy-optimizer.html), [allocation removal in the toy optimizer](https:&#x2F;&#x2F;pypy.org&#x2F;posts&#x2F;2022&#x2F;10&#x2F;toy-optimizer-allocation-removal.html), and [abstract interpretation in the toy optimizer](https:&#x2F;&#x2F;bernsteinbear.com&#x2F;blog&#x2F;toy-abstract-interpretation&#x2F;).)

This is really great for some compiler optimizations, like the strength reduction we did above. Here is the IR snippet again:

&#x60;&#x60;&#x60;ini
v0 &#x3D; ...
v1 &#x3D; Const 8
v2 &#x3D; v0 * v1

&#x60;&#x60;&#x60;

A strength reduction pass might rewrite &#x60;v2&#x60; as a left shift instead of a multiplication (&#x60;v2.make_equal_to(LeftShift(v0, Const(3)))&#x60;) because left shifts are often faster than multiplications. That’s great; we got a small speedup.

But seemingly obvious local rewrites can have less-local consequences. Consider the expression &#x60;(a * 2) &#x2F; 2&#x60;, which is the example from the [e-graphs good](https:&#x2F;&#x2F;egraphs-good.github.io&#x2F;) website and paper. If our strength reduction pass eagerly rewrites &#x60;a * 2&#x60; to &#x60;a &lt;&lt; 1&#x60;, we’ve lost some information.

This rewrite stops another hypothetical pass from recognizing that expressions of the form &#x60;(a * b) &#x2F; b&#x60; are equivalent to &#x60;a * (b &#x2F; b)&#x60; and therefore equivalent to &#x60;a&#x60;. This is because rewrites that use union-find are destructive; we’ve gotten rid of the multiplication. How might we find it again?

## Enumerating the equivalence classes

Let’s make this more concrete and conjure a little math IR. We’ll base it on the &#x60;Expr&#x60; base class because it’s rewritable using union-find.

&#x60;&#x60;&#x60;less
@dataclass
class Const(Expr):
    value: int

@dataclass
class Var(Expr):
    name: str

@dataclass
class BinaryOp(Expr):
    left: Expr
    right: Expr

@dataclass
class Add(BinaryOp):
    pass

@dataclass
class Mul(BinaryOp):
    pass

@dataclass
class Div(BinaryOp):
    pass

@dataclass
class LeftShift(BinaryOp):
    pass

&#x60;&#x60;&#x60;

It’s just constants and variables and binary operations but it’ll do for our demo.

Let’s also write a little optimization pass that can do limited constant folding, simplification, and strength reduction. We have a function&#x60;optimize_one&#x60; that looks at an individual operation and tries to simplify it and a function &#x60;optimize&#x60; that applies &#x60;optimize_one&#x60; to a list of operations—a basic block, if you will.

&#x60;&#x60;&#x60;reasonml
def is_const(op: Expr, value: int) -&gt; bool:
    return isinstance(op, Const) and op.value &#x3D;&#x3D; value

def optimize_one(op: Expr) -&gt; None:
    if isinstance(op, BinaryOp):
        left &#x3D; op.left.find()
        right &#x3D; op.right.find()
        if isinstance(op, Add):
            if isinstance(left, Const) and isinstance(right, Const):
                op.make_equal_to(Const(left.value + right.value))
            elif is_const(left, 0):
                op.make_equal_to(right)
            elif is_const(right, 0):
                op.make_equal_to(left)
        elif isinstance(op, Mul):
            if is_const(left, 1):
                op.make_equal_to(right)
            elif is_const(right, 1):
                op.make_equal_to(left)
            elif is_const(right, 2):
                op.make_equal_to(Add(left, left))
                op.make_equal_to(LeftShift(left, Const(1)))

def optimize(ops: list[Expr]):
    for op in ops:
        optimize_one(op.find())

&#x60;&#x60;&#x60;

Let’s give it a go and see what it does to our initial smaller IR snippet that added two constants[4](#fn:printing-niceties):

&#x60;&#x60;&#x60;routeros
ops &#x3D; [
    a :&#x3D; Const(1),
    b :&#x3D; Const(2),
    c :&#x3D; Add(a, b),
]
print(&quot;BEFORE:&quot;)
for op in ops:
    print(f&quot;v{op.id} &#x3D;&quot;, op.find())
optimize(ops)
print(&quot;AFTER:&quot;)
for op in ops:
    print(f&quot;v{op.id} &#x3D;&quot;, op.find())
# BEFORE:
# v0 &#x3D; Const&lt;1&gt;
# v1 &#x3D; Const&lt;2&gt;
# v2 &#x3D; Add v0 v1
# AFTER:
# v0 &#x3D; Const&lt;1&gt;
# v1 &#x3D; Const&lt;2&gt;
# v2 &#x3D; Const&lt;3&gt;

&#x60;&#x60;&#x60;

Alright, it works. We can fold &#x60;1+2&#x60; to &#x60;3&#x60;. Hurrah. But the point of this section of the post is to discover the equivalence classes implicitly constructed by the union-find structure. Let’s write a function to do that.

To build such a function, we’ll need to iterate over all operations created. I chose to explicitly keep track of every operation in a list, but you could also write a function to walk the &#x60;forwarded&#x60; chains of all reachable operations.

&#x60;&#x60;&#x60;python
every_op &#x3D; []

@dataclass
class Expr:
    # ...
    def __post_init__(self) -&gt; None:
        every_op.append(self)

# ...

def discover_eclasses(ops: list[Expr]) -&gt; dict[Expr, set[Expr]]:
    eclasses: dict[Expr, set[Expr]] &#x3D; {}
    for op in ops:
        found &#x3D; op.find()
        if found not in eclasses:
            # Key by the representative
            eclasses[found] &#x3D; set()
        eclasses[found].add(op)
        if op is not found:
            # Alias the entries so that looking up non-representatives also
            # finds equivalent operations
            eclasses[op] &#x3D; eclasses[found]
    return eclasses

# ...
print(&quot;ECLASSES:&quot;)
eclasses &#x3D; discover_eclasses(every_op.copy())
for op in ops:
    print(f&quot;v{op.id} &#x3D;&quot;, eclasses[op])
# BEFORE:
# v0 &#x3D; Const&lt;1&gt;
# v1 &#x3D; Const&lt;2&gt;
# v2 &#x3D; Add v0 v1
# AFTER:
# v0 &#x3D; Const&lt;1&gt;
# v1 &#x3D; Const&lt;2&gt;
# v2 &#x3D; Const&lt;3&gt;
# ECLASSES:
# v0 &#x3D; {Const&lt;1&gt;}
# v1 &#x3D; {Const&lt;2&gt;}
# v2 &#x3D; {Const&lt;3&gt;, Add v0 v1}

&#x60;&#x60;&#x60;

Let’s go back to our more complicated IR example from the egg website, this time expressed in our little IR:

&#x60;&#x60;&#x60;mipsasm
ops &#x3D; [
    a :&#x3D; Var(&quot;a&quot;),
    b :&#x3D; Const(2),
    c :&#x3D; Mul(a, b),
    d :&#x3D; Div(c, b),
]

&#x60;&#x60;&#x60;

If we run our optimizer on it right now, we’ll eagerly rewrite the multiplication into a left-shift, but then rediscover the multiply in the equivalence classes (now I’ve added little &#x60;*&#x60; to indicate the union-find representatives of each equivalence class):

&#x60;&#x60;&#x60;smali
BEFORE:
v0 &#x3D; Var&lt;a&gt;
v1 &#x3D; Const&lt;2&gt;
v2 &#x3D; Mul v0 v1
v3 &#x3D; Div v2 v1
AFTER:
v0 &#x3D; Var&lt;a&gt;
v1 &#x3D; Const&lt;2&gt;
v2 &#x3D; LeftShift v0 v5
v3 &#x3D; Div v6 v1
ECLASSES:
v0 &#x3D; * {Var&lt;a&gt;}
v1 &#x3D; * {Const&lt;2&gt;}
v2 &#x3D;   {LeftShift v0 v5, Add v0 v0, Mul v0 v1}
v3 &#x3D; * {Div v6 v1}
v4 &#x3D;   {LeftShift v0 v5, Add v0 v0, Mul v0 v1}
v5 &#x3D; * {Const&lt;1&gt;}
v6 &#x3D; * {LeftShift v0 v5, Add v0 v0, Mul v0 v1}

&#x60;&#x60;&#x60;

That solves one problem: at any point, we can enumerate the equivalence classes stored in the union-find structure. But, like all data structures, the union-find representation we’ve chosen has a trade-off: fast to rewrite, slow to enumerate. We’ll accept that for now.

This enumeration feature on its own does not comprise one of the APIs of an e-graph. To graft on e-matching to union-find, we’ll need to do one more step: a search. Some would call it &#x60;match&#x60;.

## Matching

So we can rediscover the multiplication even after reducing it to a left shift. That’s nice. But how can we do pattern matching on this data representation?

Let’s return to &#x60;(a * b) &#x2F; b&#x60;. This corresponds to the IR-land Python expression of &#x60;Div(Mul(a, b), b)&#x60; for any expressions &#x60;a&#x60; and &#x60;b&#x60; (and keeping the &#x60;b&#x60;s equal, which is not the default in a Python &#x60;match&#x60; pattern).

For a given operation, we can see if there is a &#x60;Div&#x60; in its equivalence class by looping over the entire equivalence class:

&#x60;&#x60;&#x60;ruby
def optimize_match(op: Expr, eclasses: dict[Expr, set[Expr]]):
    # Find cases of the form a &#x2F; b
    for e0 in eclasses[op]:
        if isinstance(e0, Div):
            # ...

&#x60;&#x60;&#x60;

That’s all well and good, but how do we find if it’s a &#x60;Div&#x60; of a &#x60;Mul&#x60;? We loop again!

&#x60;&#x60;&#x60;properties
def optimize_match(op: Expr, eclasses: dict[Expr, set[Expr]]):
    # Find cases of the form (a * b) &#x2F; c
    for e0 in eclasses[op]:
        if isinstance(e0, Div):
            div_left &#x3D; e0.left
            div_right &#x3D; e0.right
            for e1 in eclasses[div_left]:
                if isinstance(e1, Mul):
                    # ...

&#x60;&#x60;&#x60;

Note how we don’t need to call &#x60;.find()&#x60; on anything because we’ve already aliased the set in the equivalence classes dictionary for convenience.

And how do we hold the &#x60;b&#x60;s equal? Well, we can check if they match:

&#x60;&#x60;&#x60;mipsasm
def optimize_match(op: Expr, eclasses: dict[Expr, set[Expr]]):
    # Find cases of the form (a * b) &#x2F; b
    for e0 in eclasses[op]:
        if isinstance(e0, Div):
            div_left &#x3D; e0.left
            div_right &#x3D; e0.right
            for e1 in eclasses[div_left]:
                if isinstance(e1, Mul):
                    mul_left &#x3D; e1.left
                    mul_right &#x3D; e1.right
                    if mul_right &#x3D;&#x3D; div_right:
                        # ...

&#x60;&#x60;&#x60;

And then we can rewrite the &#x60;Div&#x60; to the &#x60;Mul&#x60;’s left child:

&#x60;&#x60;&#x60;mipsasm
def optimize_match(op: Expr, eclasses: dict[Expr, set[Expr]]):
    # Find cases of the form (a * b) &#x2F; b and rewrite to a
    for e0 in eclasses[op]:
        if isinstance(e0, Div):
            div_left &#x3D; e0.left
            div_right &#x3D; e0.right
            for e1 in eclasses[div_left]:
                if isinstance(e1, Mul):
                    mul_left &#x3D; e1.left
                    mul_right &#x3D; e1.right
                    if mul_right &#x3D;&#x3D; div_right:
                        op.make_equal_to(mul_left)
                        return

&#x60;&#x60;&#x60;

If we run this optimization function for every node in our basic block, we end up with:

&#x60;&#x60;&#x60;makefile
AFTER:
v0 &#x3D; Var&lt;a&gt;
v1 &#x3D; Const&lt;2&gt;
v2 &#x3D; LeftShift v0 v5
v3 &#x3D; Var&lt;a&gt;

&#x60;&#x60;&#x60;

where &#x60;v3&#x60; corresponds to our original big expression. Congratulations, you’ve successfully implemented a time-traveling compiler pass!

Unfortunately, it’s very specific: our match conditions are hard-coded into the loop structure and the loop structure (how many levels of nesting) is hard-coded into the function. This is the sort of thing that our programming giants invented SQL to solve[5](#fn:egg-relational).

We don’t have time or brainpower to implement a full query language[6](#fn:nerd-snipe) and I ran out of ideas for making a small embedded matching DSL, so you will have to take my word for it that it’s tractable.

One thing to note: after every write with &#x60;make_equal_to&#x60;, we need to rediscover the eclasses if we want to read from them again. I think this is what the egg people call a “rebuild” and part of what made their paper interesting was finding a way to do this less often or faster.

Another thing we need to do, I think, is iterate until convergence. It’s not guaranteed that we will always reach the so-called “congruence closure” with one pass over all of the operations, matching and rewriting. In some cases (which?), the graph may not even converge at all!

Now what we have is a bunch of parallel worlds for our basic block where each operation is actually a set of equivalent operations. But which element of the set should we pick? One approach, the one we were taking before, is to just pick the representative as the desired final form of each operation. This is a very union-find style approach. It’s straightforward, it’s fast, and it works well in a situation where we only ever do strength reduction type rewrites.

But e-graphs popped into the world because people wanted to explore a bigger state space. It’s possible that the representative of an equivalence class is locally optimal but not globally optimal. If our optimality function—our cost function—considers the entire program, we have to find a way to broaden our search.

The final piece of the e-graph API is an &#x60;extract&#x60; function. This function finds the “lowest cost” or “most optimal” version of the program in the e-graph.

The simplest extraction function is to iterate through the cartesian product of all of the equivalence classes for each IR node and find the one that minimizes the whole-program cost.

&#x60;&#x60;&#x60;fortran
import itertools
def extract(program: list[Expr], eclasses: dict[Expr, set[Expr]]) -&gt; list[Expr]:
    best_cost &#x3D; float(&quot;inf&quot;)
    best_program &#x3D; program
    for trial_program in itertools.product(*[eclasses[op] for op in program]):
        cost &#x3D; whole_program_cost(trial_program)
        if cost &lt; best_cost:
            best_cost &#x3D; cost
            best_program &#x3D; trial_program.copy()
    return best_program

&#x60;&#x60;&#x60;

Unfortunately, this is slow. As the number of nodes grows, your base grows and as the number of rewrites grows, your exponent grows. It’s bad news bears. There are a bunch of different approaches that don’t involve exhaustive search, but they do not always produce the globally optimal program. It’s an active area of research.

Another thing to note is that the cost function isn’t normally built-in to e-graph implementations; usually they allow library users to provide at least their own cost functions, if not the entirety of _extract_.

## Wrapping up

This brings us to a complete e-graph implementation. We started with a simple union-find, and by incrementally adding &#x60;match&#x60; and &#x60;extract&#x60;, we ended with a full e-graph.

A bit of a subtle note here is that unlike our more procedural&#x2F;functional pattern matching situation with a manual &#x60;make_equal_to&#x60;, many (most?) e-graph implementations tend to suggest that the library user provides a set of declarative syntactic rewrite rules.[egglog](https:&#x2F;&#x2F;github.com&#x2F;egraphs-good&#x2F;egglog) uses a custom Datalog-like DSL;[Cranelift](https:&#x2F;&#x2F;cranelift.dev&#x2F;)uses a DSL called ISLE; [Ego](https:&#x2F;&#x2F;ocaml.org&#x2F;p&#x2F;ego&#x2F;0.0.6&#x2F;doc&#x2F;index.html)uses an embedded DSL.

&#x60;&#x60;&#x60;lisp
;; This is a Datalog-like pair of rules from an egglog example
(rewrite (If T t f) t)
(rewrite (If F t f) f)

&#x60;&#x60;&#x60;

This requires embedding your compiler’s notion of the program into the library’s domain, then extracting back out from the library’s domain into your own IR.

Part of the motivation for this blog post was to provide a kind of e-graph that can be embedded directly into your compiler project without mapping back and forth.

## Further reading

Cranelift uses a modified form of e-graph called an [aegraph](https:&#x2F;&#x2F;github.com&#x2F;bytecodealliance&#x2F;rfcs&#x2F;blob&#x2F;main&#x2F;accepted&#x2F;cranelift-egraph.md). It’s different in that the entire e-graph can be topo sorted and equality arrows can only point to earlier nodes. There are probably some very interesting trade-offs here but I am not an expert and you should probably read Chris Fallin’s [excellent post](https:&#x2F;&#x2F;github.com&#x2F;bytecodealliance&#x2F;rfcs&#x2F;blob&#x2F;main&#x2F;accepted&#x2F;cranelift-egraph.md).

In a [Zulip thread](https:&#x2F;&#x2F;egraphs.zulipchat.com&#x2F;#narrow&#x2F;stream&#x2F;375765-egg.2Fegglog&#x2F;topic&#x2F;incrementally.20.22discovering.22.20e-graphs.20from.20union-find), Chris writes:

&gt; aegraphs are really about three key things:
&gt; 
&gt; * a persistent immutable data structure that encodes eclasses directly – via the use of “union nodes” that refer to two other nodes. This lets us refer to a “snapshot in time” of an eclass, before we union more things into it, which turns out to be important for acyclicity
&gt; * a rewrite strategy that is eager (“bottom-up”): as soon as we create a node, we apply rewrite rules just to that node. That was actually kind of my entrypoint to doing something “different” than egg: I was wondering how to apply rules in a more efficient way than “iterate over all nodes and apply all rules” and, well, doing rewrites just once is about as good as one can do
&gt; * acyclicity: in a classical egraph one can get cycles when merging nodes even when no cycles exist in the input. Consider &#x60;x + 0&#x60;, and a rule that rewrites that to &#x60;x&#x60;. Then we have one eclass that refers to itself – in essence it’s encoding the equivalence in _both_ directions, so it could also be &#x60;x + (x + (x + 0))&#x60; or longer to infinity; that’s what the cycle denotes. To avoid that we have to refer to a _snapshot_ of the eclass as we know it in the args, and never re-intern a value node with new (union’d) arg eclasses. That enables the persistent immutable data structure; and requires the eager rewrite to work.
&gt; 
&gt; (in my [talk about this](https:&#x2F;&#x2F;cfallin.org&#x2F;pubs&#x2F;egraphs2023%5Faegraphs%5Fslides.pdf) I have this wonky three-sided figure where each of these concepts mutually reinforces the other…)
&gt; 
&gt; One of the things that surprised me is that the single-pass eager rewrite _does_ actually work – it works if one’s rules are structured in a certain way. The case one wants to avoid is where A rewrites to B, C rewrites to B, and then a better version of A is actually C (but no direct rewrite exists) – that’s where later unification in a full egraph would have grouped A and C together and that equivalence would be visible, but eager rewrites with snapshotted eclasses does not. It turns out the way we write rules in Cranelift at least is “directional” enough that we don’t have this in practice (it would require C to be better than B, even though we have a B-&gt;C rewrite).
&gt; 
&gt; There’s a whole other side to Cranelift’s use of aegraphs having to do with control flow, “elaboration”, the way we do GVN (without partial redundancy) and LICM, keep side effects in the right place, and getting the reconstructed&#x2F;reserialized sequence of computations correct with respect to dominance (extraction needs to worry about the domtree!).

PyPy has “union find” in its optimizer but it’s smarter than normal union-find. It also has smart constructors and some other features that make its optimizer more e-graph like than union-find like. Perhaps CF will write a blog post about this some day.

And of course check out egg and egglog, the main e-graph libraries around. And Metatheory.jl, too.

Please let me know what thoughts you have! This is a very new subject for me.

1. This is not to say that the languages have to be distinct; the compiler can, say, take in a program in C and emit a program in C. And sometimes the term “language” gets fuzzy, since (for example) C23 is_technically_ a different language than C99 but they are both recognizable as C. But there’s value in a C23 to C99 compiler because not all compilers can take in C23 input in the front-end yet. And also sometimes the term compiler comes with an implication that the input language is in some way “higher level” than the output language, and this vibe ended up producing the term “transpiler”, but eh. Compiler take program in and compiler emit program out. [↩](#fnref:languages)
2. The naive implementations shown in this post are not the optimal ones that everyone oohs and ahhs about. Those have things like path compression. The nice thing is that the path compression is an add-on feature that doesn’t change the API at all. Then if you get hamstrung by the inverse Ackermann function, you have other problems with the size of your IR graph. [↩](#fnref:advanced-features)
3. See also this tidy little union-find implementation by Phil from[his blog post](https:&#x2F;&#x2F;www.philipzucker.com&#x2F;compile%5Fconstraints&#x2F;):  
&#x60;&#x60;&#x60;gml  
uf &#x3D; {}  
def find(x):  
  while x in uf:  
    x &#x3D; uf[x]  
  return x  
def union(x,y):  
  x &#x3D; find(x)  
  y &#x3D; find(y)  
  if x !&#x3D; y:  
    uf[x] &#x3D; y  
  return y  
&#x60;&#x60;&#x60;  
I really enjoy that it reads like a margin note. The only downside, IMO, is that it requires the IR operations to be both hashable and comparable (&#x60;__hash__&#x60; and &#x60;__eq__&#x60;). [↩](#fnref:also-phil)
4. I sneakily added some printing niceties to the &#x60;Expr&#x60;class that I didn’t show here. They’re not important for the point I’m making and appear in the full code listing. [↩](#fnref:printing-niceties)
5. This is a bit of a head-nod to the good folks working on egg and egglog, a team comprised of compilers people and database people. They have realized that the e-graph and the relational database are very similar and are building tools that do a neat domain crossover. Read [the paper](https:&#x2F;&#x2F;dl.acm.org&#x2F;doi&#x2F;10.1145&#x2F;3591239) (open access) if you are interested in learning more!  
Yihong Zhang has implemented[egraph-sqlite](https:&#x2F;&#x2F;github.com&#x2F;yihozhang&#x2F;egraph-sqlite), which is delightfully small, in Racket. I would love to see it ported to other langauges for fun and learning! [↩](#fnref:egg-relational)
6. As soon as I wrote this I thought “how hard could it be?” and went off to learn more and find the smallest SQL-like implementation. I eventually found [SQLToy](https:&#x2F;&#x2F;github.com&#x2F;weinberg&#x2F;SQLToy) (\~500LOC JS) and [ported it to Python](https:&#x2F;&#x2F;github.com&#x2F;tekknolagi&#x2F;db.py&#x2F;) (\~200 LOC). I don’t know that having this embedded in the post or a minimal e-graph library would help, exactly, but it was a fun learning experience. [↩](#fnref:nerd-snipe)