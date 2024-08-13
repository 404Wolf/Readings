---
id: 84b3fce1-dd04-4a04-a280-ed264a7ff656
title: RNN, LSTM, GRU, and Saliency Map - SWE to ML Engineer
tags:
  - RSS
date_published: 2024-06-13 22:05:28
---

# RNN, LSTM, GRU, and Saliency Map - SWE to ML Engineer
#Omnivore

[Read on Omnivore](https://omnivore.app/me/rnn-lstm-gru-and-saliency-map-swe-to-ml-engineer-19014fe8b35)
[Read Original](https://swe-to-mle.pages.dev/posts/rnn-lstm-gru-and-saliency-map/)



## Contents

* [The Quest](#the-quest)
* [Why RNNs?](#why-rnns)
* [Recurrent Neural Network (RNN)](#recurrent-neural-network-rnn)
* [Long short-term memory (LSTM)](#long-short-term-memory-lstm)
* [Gated Recurrent Unit (GRU)](#gated-recurrent-unit-gru)
* [Bonus: Stacked LSTM](#bonus-stacked-lstm)
* [Next Token Prediction: Learn Alice’s Adventures in Wonderland](#next-token-prediction-learn-alices-adventures-in-wonderland)  
   * [How does the model choose the next token](#how-does-the-model-choose-the-next-token)
* [Image Classification and Saliency Map](#image-classification-and-saliency-map)  
   * [Compare Different Models: Accuracy and Saliency Map](#compare-different-models-accuracy-and-saliency-map)
* [The code](#the-code)
* [Sources](#sources)

_Beneath a weathered cloak, three crafty goblins stand stacked, masquerading as an ancient wizard. Each goblin, akin to the layers of a Recurrent Neural Network. Every action built upon the input of others, warping the delicate weave of mana. Though seamless from the outside, this clever orchestration of individual parts works in mischievous harmony, each decision a product of collective cunning._

[ ![three-goblins.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5jFk-Tq_CW-ebDexwlaBGbKNuMvDNrC51XRrQxkCyus&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;three-goblins.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;three-goblins.png &quot;three-goblins&quot;)

Three goblins masquerading as a wizard

Look through the archives for ancient magic, and implement the different flavors of recurrent neural networks whose power once reigned supreme and may rise anew to claim their throne.

RNNs arise from the need to handle sequences with variable lengths. By calling the RNN cell sequentially on each of its elements and passing along a compressed representation of the previous state.

RNNs are the most basic flavor, and give their name to the family of models. We start with a &#x60;memory&#x60; initialized to zeros, compute a simple function and pass it around.

&#x60;&#x60;&#x60;ruby
class RNN(nn.Module):
    def __init__(self, d_in, d_hidden):
        super().__init__()
        self.d_hidden &#x3D; d_hidden
        self.i2h &#x3D; nn.Linear(d_in, d_hidden)
        self.h2h &#x3D; nn.Linear(d_hidden, d_hidden)

    def forward(self, xs, memory&#x3D;None, return_memory&#x3D;False):
        batch, d_context, d_in &#x3D; xs.shape
        outs &#x3D; []
        if memory is None: memory &#x3D; t.zeros(batch, self.d_hidden, device&#x3D;xs.device)
        for i in range(d_context):
            x &#x3D; xs[:, i]
            memory &#x3D; F.tanh(self.i2h(x) + self.h2h(memory))
            outs.append(memory)
        return t.stack(outs, dim&#x3D;1)

&#x60;&#x60;&#x60;

LSTMs try to address the shortcomings of RNNs by adding some kind of residual &#x2F; skip connection to help the gradients flow between stages. We still have to handle the input, the short-term memory &#x60;h_prev&#x60;, but also a long-term memory &#x60;c_prev&#x60;.

&#x60;&#x60;&#x60;reasonml
class LSTMCell(nn.Module):
    def __init__(self, d_in, d_hidden):
        super().__init__()
        self.W_f &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # forget gate
        self.W_i &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # input gate
        self.W_c &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # cell state update
        self.W_o &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # output gate

    def forward(self, x, h_prev, c_prev):
        x &#x3D; t.cat((x, h_prev), dim&#x3D;1)
        # handle long-term memory &#x60;c&#x60;
        f_gate &#x3D; t.sigmoid(self.W_f(x))
        i_gate &#x3D; t.sigmoid(self.W_i(x))
        c_update &#x3D; t.tanh(self.W_c(x))
        c_prev &#x3D; f_gate * c_prev + i_gate * c_update
        # handle short-term memory &#x60;h&#x60;
        o_gate &#x3D; t.sigmoid(self.W_o(x))
        h_prev &#x3D; o_gate * t.tanh(c_prev)
        return h_prev, c_prev

&#x60;&#x60;&#x60;

We orchestrate the LSTMCell in the same way as for RNN.

&#x60;&#x60;&#x60;haskell
class LSTM(nn.Module):
    def __init__(self, d_in, d_hidden):
        super().__init__()
        self.d_hidden &#x3D; d_hidden
        self.lstm_cell &#x3D; LSTMCell(d_in, d_hidden)

    def forward(self, xs, h_prev&#x3D;None, c_prev&#x3D;None):
        batch, d_context, d_in &#x3D; xs.shape
        hs, cs &#x3D; [], []
        if h_prev is None: h_prev &#x3D; t.zeros(batch, self.d_hidden, device&#x3D;xs.device)
        if c_prev is None: c_prev &#x3D; t.zeros(batch, self.d_hidden, device&#x3D;xs.device)
        for i in range(d_context):
            x &#x3D; xs[:, i]
            h_prev, c_prev &#x3D; self.lstm_cell(x, h_prev, c_prev)
            hs.append(h_prev)
            cs.append(c_prev)
        return t.stack(hs, dim&#x3D;1), t.stack(cs, dim&#x3D;1)

&#x60;&#x60;&#x60;

GRUs are a simplification of LSTMs while retaining most of the performance.

&#x60;&#x60;&#x60;reasonml
class GRUCell(nn.Module):
    def __init__(self, d_in, d_hidden):
        super().__init__()
        self.W_r &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # reset gate
        self.W_z &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # update gate
        self.W_h &#x3D; nn.Linear(d_in + d_hidden, d_hidden)  # hidden state update

    def forward(self, x, h_prev):
        cat &#x3D; t.cat((x, h_prev), dim&#x3D;1)
        r_gate &#x3D; t.sigmoid(self.W_r(cat))
        z_gate &#x3D; t.sigmoid(self.W_z(cat))
        h_candidate &#x3D; t.tanh(self.W_h(t.cat((x, r_gate * h_prev), dim&#x3D;1)))
        h_prev &#x3D; (1 - z_gate) * h_prev + z_gate * h_candidate
        return h_prev

&#x60;&#x60;&#x60;

The driving code remains the same.

&#x60;&#x60;&#x60;ruby
class GRU(nn.Module):
    def __init__(self, d_in, d_hidden):
        super().__init__()
        self.d_hidden &#x3D; d_hidden
        self.gru_cell &#x3D; GRUCell(d_in, d_hidden)

    def forward(self, xs, h_prev&#x3D;None):
        batch, d_context, d_in &#x3D; xs.shape
        outs &#x3D; []
        if h_prev is None: h_prev &#x3D; t.zeros(batch, self.d_hidden, device&#x3D;xs.device)
        for i in range(d_context):
            x &#x3D; xs[:, i]
            h_prev &#x3D; self.gru_cell(x, h_prev)
            outs.append(h_prev)
        return t.stack(outs, dim&#x3D;1)

&#x60;&#x60;&#x60;

Now all of the above can be stacked. To put the _deep_ in deep learning. The Cell remains unchanged. Adding more depth to the network will, in principle, let us learn more complex functions.

&#x60;&#x60;&#x60;haskell
class StackedLSTM(nn.Module):
    def __init__(self, d_in, d_hidden, d_layers):
        super().__init__()
        self.d_hidden &#x3D; d_hidden
        self.d_layers &#x3D; d_layers
        self.lstm_cells &#x3D; nn.ModuleList([LSTMCell(d_in if l &#x3D;&#x3D; 0 else d_hidden, d_hidden) for l in range(d_layers)])

    def forward(self, xs, h_prev&#x3D;None, c_prev&#x3D;None):
        batch, d_context, d_in &#x3D; xs.shape
        outs &#x3D; []
        if h_prev is None: h_prev &#x3D; t.zeros(self.d_layers, batch, self.d_hidden, device&#x3D;xs.device)
        if c_prev is None: c_prev &#x3D; t.zeros(self.d_layers, batch, self.d_hidden, device&#x3D;xs.device)
        for i in range(d_context):
            x &#x3D; xs[:, i]
            h_next, c_next &#x3D; [], []
            for lstm_cell, h, c in zip(self.lstm_cells, h_prev, c_prev):
                h, c &#x3D; lstm_cell(x, h, c)
                h_next.append(h)
                c_next.append(c)
                x &#x3D; h
            outs.append(h)
            h_prev &#x3D; t.stack(h_next)
            c_prev &#x3D; t.stack(c_next)
        return t.stack(outs, dim&#x3D;1), h_prev, c_prev

&#x60;&#x60;&#x60;

## [](#next-token-prediction-learn-alices-adventures-in-wonderland)Next Token Prediction: Learn Alice’s Adventures in Wonderland

Let’s train a character level next token predictor on a classic.

&#x60;&#x60;&#x60;reasonml
class AliceStackedLSTM(nn.Module):
    def __init__(self, d_vocab, d_hidden, d_layers):
        super().__init__()
        self.embed &#x3D; nn.Embedding(d_vocab, d_hidden)
        self.stacked_lstm &#x3D; StackedLSTM(d_hidden, d_hidden, d_layers)
        self.unembed &#x3D; nn.Linear(d_hidden, d_vocab)
        self.unembed.weight &#x3D; self.embed.weight

    def forward(self, xs):
        xs &#x3D; self.embed(xs)
        out, _, _ &#x3D; self.stacked_lstm(xs)
        return self.unembed(out)

&#x60;&#x60;&#x60;

Train for a bunch of epochs.

![loss.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,saPZe3ApdsO-RlbxWYTNAwnEijfFpffzoNCxXdO5e_Ug&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;loss.png &quot;loss&quot;)

| Epoch | Sample                                                                   |
| ----- | ------------------------------------------------------------------------ |
| 0     | AMz-((uuqshpggpgppzzSg(zp(gqq(zh((-((ggzq(pz(qgzzS(uh                    |
| 100   | A) asel tho the therad in h the as t icl ooud shand the as tha s         |
| 400   | Alien the the calked a that of the heres all should sayt, and to seen it |
| 3000  | As after her playing again and made all the roof. (she was surprised     |
| 10000 | Alice, and they sawn Alice of the sky-boxed the Queen                    |

I made a small widget inspired by the Anthropic papers to look at how the model chooses the next token.

When hovering, we can see:

* the activations of the last layer
* the top 5 predicted tokens
* the influence of preceding tokens, positive in red, negative in blue

(PS: It looks cuter in light-mode)

I can’t say that the results are very intuitive to me. Looking at the second word, &#x60;l&#x60;, &#x60;o&#x60;, and &#x60;o&#x60; all encourage &#x60;k&#x60;, which goes nicely with my idea, but &#x60;e&#x60; doesn’t get much support even though it’s a 99% favorite to get picked.

## [](#image-classification-and-saliency-map)Image Classification and Saliency Map

RNNs can also be used for classification. First, we tokenize the images; it could be by row, column, in a spiral pattern…

For the demo, I’ll use tiles.

&#x60;&#x60;&#x60;angelscript
def reshape_tile(xs, tile&#x3D;7):
    batch, c, h, w &#x3D; xs.shape
    assert h % tile &#x3D;&#x3D; 0
    assert w % tile &#x3D;&#x3D; 0
    assert c &#x3D;&#x3D; 1
    xs &#x3D; xs.view(batch, h &#x2F;&#x2F; tile, tile, w &#x2F;&#x2F; tile, tile)
    xs &#x3D; xs.permute(0, 1, 3, 2, 4)
    xs &#x3D; xs.contiguous().view(batch, -1, tile * tile)
    return xs

&#x60;&#x60;&#x60;

![tiling.gif](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,stK-jcuw73gnZA_mYQsH-4BiX0JGuhlifeWaqcpadEzQ&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;tiling.gif &quot;tiling&quot;)

### [](#compare-different-models-accuracy-and-saliency-map)Compare Different Models: Accuracy and Saliency Map

Training for a few epochs just to get an idea of how capable the models are. The code for all the models is available on [github](https:&#x2F;&#x2F;github.com&#x2F;peluche&#x2F;RNN-LSTM-GRU&#x2F;blob&#x2F;master&#x2F;rnn-lstm-gru.ipynb).

For each model we’ll compute the accuracy on the test set.

&#x60;&#x60;&#x60;stata
@t.no_grad()
def accuracy(model, dataloader&#x3D;testloader, reshape&#x3D;None):
    model.eval()
    assert reshape is not None
    correct, total &#x3D; 0, 0
    for xs, ys in dataloader:
        xs &#x3D; reshape(xs.to(device))
        out &#x3D; model(xs)
        correct +&#x3D; (out.argmax(-1) &#x3D;&#x3D; ys.to(device)).sum()
        total +&#x3D; len(xs)
    model.train()
    return correct &#x2F; total

&#x60;&#x60;&#x60;

As well as a saliency map.

&#x60;&#x60;&#x60;gml
def saliency(model, x, y, accumulate&#x3D;1, noise&#x3D;None, reshape&#x3D;reshape_default):
    model.eval()
    x, y &#x3D; x.to(device), y.to(device)
    x.requires_grad &#x3D; True
    x.grad &#x3D; None
    xs &#x3D; reshape(x)
    out &#x3D; model(xs)
    loss &#x3D; -out[0, y]
    loss.backward()
    return x.grad

&#x60;&#x60;&#x60;

All the models’ performances are fairly similar.

| Model         | Accuracy |
| ------------- | -------- |
| MLP           | 0.961    |
| CNN           | 0.988    |
| RNN by rows   | 0.964    |
| GRU by rows   | 0.982    |
| LSTM by rows  | 0.987    |
| LSTM by tiles | 0.966    |

What is interesting is how different the saliency maps look across architectures.

[ ![mnist-1.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sHdoe48CwiGRX9wS0nYjO9o6y-4M1St105EIFoQbN1IU&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;mnist-1.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;mnist-1.png &quot;mnist-1&quot;)

[ ![mnist-2.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sryyZRzw0NXnmdfne_nfM6waDrKC6x3nOTTONe02SAdY&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;mnist-2.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;mnist-2.png &quot;mnist-2&quot;)

[ ![mnist-9.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s1Qgpn_E0IcvErgraMToRwEH8W3dn6INHd9rx_6txEF8&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;mnist-9.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;mnist-9.png &quot;mnist-9&quot;)

Based on the images, I would have assumed the CNN would significantly outperform everything else, but the GRU and LSTM by rows have similar accuracies.

Once again, the accuracies are pretty similar.

| Model         | Accuracy |
| ------------- | -------- |
| MLP           | 0.883    |
| CNN           | 0.881    |
| RNN by rows   | 0.850    |
| GRU by rows   | 0.881    |
| LSTM by rows  | 0.869    |
| LSTM by tiles | 0.857    |

[ ![fmnist-shirt.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sl-LOfEKdukZ145O6MmyDqOK_bpYqssoifkb9BdO6tGU&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;fmnist-shirt.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;fmnist-shirt.png &quot;fmnist-shirt&quot;)

[ ![fmnist-shoe.png](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sBk1cBh5V4jrWkXS1tZMjt3Pne9u3MrA4zToWWnEvtG0&#x2F;https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;fmnist-shoe.png) ](https:&#x2F;&#x2F;swe-to-mle.pages.dev&#x2F;posts&#x2F;rnn-lstm-gru-and-saliency-map&#x2F;fmnist-shoe.png &quot;fmnist-shoe&quot;)

This time, I would have put my money on the MLP.

You can get the code at &lt;https:&#x2F;&#x2F;github.com&#x2F;peluche&#x2F;RNN-LSTM-GRU&#x2F;blob&#x2F;master&#x2F;rnn-lstm-gru.ipynb&gt;

For nice visualizations of the different RNNs architectures: &lt;https:&#x2F;&#x2F;colah.github.io&#x2F;posts&#x2F;2015-08-Understanding-LSTMs&#x2F;&gt;