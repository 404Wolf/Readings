---
id: bc462f8c-d64d-4e46-8778-e5243ba1fadf
title: Testing a WebSocket that could hang open for hours | nicole@web
tags:
  - RSS
date_published: 2024-07-01 00:00:00
---

# Testing a WebSocket that could hang open for hours | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/testing-a-web-socket-that-could-hang-open-for-hours-nicole-web-1906e5af2fc)
[Read Original](https://ntietz.com/blog/websocket-hang-hours/)



**Monday, July 1, 2024**

I recently ran into a bug in some Go code that no one had touched in a few years. The code in question was not particularly complicated, and had been reviewed by multiple people. It included a timeout, and is straightforward: allow a Websocket connection to test that the client can open those successfully, and then close it.

The weird thing is that some of these connections were being held open for a long time. There was a timeout of one second, but sometimes these were still open after _twelve hours_. That&#39;s not good!

This bug ended up being instructive in both Go and in how WebSockets work. Let&#39;s dive in and see what was going on, then what it tells us!

![Comic showing a caterpillar and a butterfly, representing the transformation of HTTP requests into WebSockets.](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sLHxkhVT5Us3L9UiTKxdbz6siwMp77JTkeL2erbWWDEI&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;images&#x2F;comics&#x2F;metamorphosis.png &quot;Not all HTTP requests become WebSockets, but all WebSockets were once HTTP requests.&quot;)

## Identifying the bug

The preliminary investigation found that this was happening for users with a particular VPN. Weird, but not particularly helpful.

After the logs turned up little useful info, I turned to inspecting the code. It was pretty easy to see that the code itself had a bug, in a classic new-to-Go fashion. The trickier thing (for later) was how reproduce the bug and verify it in a test.

The bug was something like this:

&#x60;&#x60;&#x60;go
for {
    select {
    case &lt;-ctx.Done():
        &#x2F;&#x2F; we timed out, so probably log it and quit!
        return

    default:
        _, _, err :&#x3D; conn.ReadMessage()

        if err !&#x3D; nil {
            &#x2F;&#x2F; ...
        }
    }
}

&#x60;&#x60;&#x60;

There are two conspiring factors here: first, we&#39;re using a default case in the select, and second, that default case has no read deadline. The default case is run [when no other case is ready](https:&#x2F;&#x2F;go.dev&#x2F;tour&#x2F;concurrency&#x2F;6), which is the case until we time out. The issue is that we won&#39;t _interrupt_ this case when the other one _becomes_ ready. And in that case, &#x60;conn.ReadMessage()&#x60; will wait until it receives something if no read deadline has been set.

The question then becomes, how do we actually run into this case?

## How does this happen?

This is a _weird_ case, because it requires the end client to misbehave. Right before the bugged &#x60;for&#x60; loop, the server sent a WebSocket close frame to the client. If you have such a connection open in your browser, then when it receives the close frame it will send one back. This is part of the [closing handshake](https:&#x2F;&#x2F;datatracker.ietf.org&#x2F;doc&#x2F;html&#x2F;rfc6455#section-1.4) for WebSockets. So if we get nothing back, that means that something went wrong.

Taking a step back, let&#39;s refresh some details about WebSockets. WebSocket connections are bidirectional, much like TCP connections: the client and the server can send messages and these messages can interleave with each other. In contrast, a regular HTTP connection follows a request-response pattern where the client sends a request and then the server sends a single response[1](#usually).

But the cool thing is that WebSockets start out life as a regular HTTP request. When you send a WebSocket request, the body starts as something like this[2](#wikipedia):

&#x60;&#x60;&#x60;routeros
GET &#x2F;websocket&#x2F; HTTP&#x2F;1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw&#x3D;&#x3D;
Sec-WebSocket-Version: 13

&#x60;&#x60;&#x60;

After this request, the server ideally responds saying it&#39;ll switch protocols with something like this response:

&#x60;&#x60;&#x60;routeros
HTTP&#x2F;1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk&#x3D;

&#x60;&#x60;&#x60;

After that&#39;s done, then both ends switch to a different binary protocol that&#39;s not related to HTTP. Pretty neat that it starts life as a regular HTTP request!

Now that we have a WebSocket open, the server and client can each send messages. These are either data messages or control messages. Data messages are what we send and receive in our applications and are what you usually see and handle. Control messages are used to terminate the connection or do other operational things, and are usually hidden from the application.

When the connection ends, you&#39;re supposed to send a particular control message: a close frame. After receiving it, the other side is supposed to respond with a close frame. And then you can both close the underlying network connection and move on with your lives.

But it turns out that sometimes that doesn&#39;t happen! This could be that the client connecting to your server is doing something naughty and didn&#39;t send it to leave you hanging. Or maybe the network was cut and the message didn&#39;t get back to you, or maybe the other end of the connection vanished in a blaze of [thermite](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Thermite).

Whatever the cause, when this happens, if you&#39;re waiting for that close frame you&#39;ll be waiting a _long_ time. So now we have to reproduce it in a test.

## Leaving the server hanging in a test

Reproducing the bug was a bit tricky since I couldn&#39;t use any normal ways of opening a WebSocket. Those implementations all assume you want a _correct_ implementation but oh, no, I want a _bad_ implementation. To do _that_, you have to roll up your sleeves and do the request by hand on top of TCP.

The test relies on opening a TCP connection, sending the upgrade request, and then just... not responding or sending anything. Then you periodically try to read from the connection. If you get back a particular error code on the read, you know the server has closed the TCP connection. If you don&#39;t, then it&#39;s still open!

This is what it looks like, roughly. Here I&#39;ve omitted error checks and closing connections for brevity; this isn&#39;t production code, just an example. First, we open our raw TCP connection.

&#x60;&#x60;&#x60;armasm
addr :&#x3D; server.Addr().String()
conn, err :&#x3D; net.Dial(&quot;tcp&quot;, addr)

&#x60;&#x60;&#x60;

Then we send our HTTP upgrade request. Go has a nice facility for doing this: we can form an HTTP request and put it onto our TCP connection[3](#rwir).

&#x60;&#x60;&#x60;pgsql
req, err :&#x3D; http.NewRequest(&quot;GET&quot;, url, nil)
req.Header.Add(&quot;Upgrade&quot;, &quot;websocket&quot;)
req.Header.Add(&quot;Connection&quot;, &quot;Upgrade&quot;)
req.Header.Add(&quot;Sec-WebSocket-Key&quot;, &quot;9x3JJHMbDL1EzLkh9GBhXDw&#x3D;&#x3D;&quot;)
req.Header.Add(&quot;Sec-WebSocket-Version&quot;, &quot;13&quot;)

err &#x3D; req.Write(conn)

&#x60;&#x60;&#x60;

We know the server is going to send us back an upgrade response, so let&#39;s snag that from the connection. Ideally we&#39;d check that it is an upgrade response but you know, cutting corners for this.

&#x60;&#x60;&#x60;armasm
buf :&#x3D; make([]byte, 1024)
_, err &#x3D; conn.Read(buf)

&#x60;&#x60;&#x60;

And then we get to the good part. Here, what we have to do is we just wait and keep checking if the connection is open! The way we do that is we try to read from the connection with a read deadline. If we get [io.EOF](https:&#x2F;&#x2F;pkg.go.dev&#x2F;io#pkg-variables), then we know that the connection closed. But if we get nothing (or we read data) then we know it&#39;s still open.

You don&#39;t want your test to run forever, so we set a timeout[4](#test-bug) and if we reach that, we say that the test failed: it was held open longer than we expected! But if we get &#x60;io.EOF&#x60; before then, then we know it was closed as we hoped. So we&#39;ll loop and select from two channels, one which ticks every 250 ms, and the other which finishes after 3 seconds.

&#x60;&#x60;&#x60;verilog
ticker :&#x3D; time.NewTicker(250 * time.Millisecond)
timeout :&#x3D; time.After(3 * time.Second)

for {
    select {
        case &lt;-ticker.C:
            conn.SetReadDeadline(time.Now().Add(10 * time.Millisecond))
            buf :&#x3D; make([]byte, 1)
            _, err &#x3D; conn.Read(buf)

            if err &#x3D;&#x3D; io.EOF {
                &#x2F;&#x2F; connection is closed, huzzah! we can return, success
                return
            }

        case &lt;-timeout:
            &#x2F;&#x2F; if we get here, we know that the connection didn&#39;t close.
            &#x2F;&#x2F; we have a bug, how sad!
            assert.Fail(t, &quot;whoops, we timed out!&quot;)
            return
    }
}

&#x60;&#x60;&#x60;

## Resolving the bug

To resolve the bug, you have two options: you can set a read deadline, or you can run the reads in a goroutine which sends a result back when you&#39;re done.

Setting a read deadline is straightforward, as seen above. You can use it and then you&#39;ll be happy, because the connection can&#39;t hang forever on a read! The problem is, in the library we were using, [conn.SetReadDeadline](https:&#x2F;&#x2F;pkg.go.dev&#x2F;github.com&#x2F;gorilla&#x2F;websocket#Conn.SetReadDeadline) sets it for the underlying network connection and if it fails, the whole WebSocket is corrupt and future reads will fail.

So instead, we do it as a concurrent task. This would look something like this:

&#x60;&#x60;&#x60;go
waitClosed :&#x3D; make(chan error)
go func() {
    _, _, err :&#x3D; conn.ReadMessage()
    if err !&#x3D; nil {
        &#x2F;&#x2F; ...
    }

    waitClosed &lt;- err
}()

timeout :&#x3D; time.After(3 * time.Second)

for {
    select {
    case &lt;-timeout:
        &#x2F;&#x2F; we timed out, so close the conection and quit!
        conn.Close()
        return

    case &lt;-waitClosed:
        &#x2F;&#x2F; success! nothing needed here
        return
    }
}

&#x60;&#x60;&#x60;

It looks like it will leak resources, because won&#39;t that goroutine stay open even if the we hit the timeout? The key is that when we hit the timeout we close the underlying network connection. This will cause the read to finish (with an error) and then that goroutine will also terminate.

---

It turns out, there are a lot of places for bugs to hide in WebSockets code and other network code. And with existing code, a bug like this which isn&#39;t causing any obvious problems can lurk for _years_ before someone stumbles across it. That&#39;s doubly true if the code was _trying_ to do the right thing but had a bug that&#39;s easy to miss if you&#39;re not very familiar with Go.

Debugging things like this is a joy, and always leads to learning more about what&#39;s going on. Every bug is an opportunity to learn more.

---

Thanks to [Erika Rowland](https:&#x2F;&#x2F;erikarow.land&#x2F;) and Dan Reich for providing feedback on a draft of this post.

---

1

There are other ways that HTTP requests can work, such as with server-sent events. And a single connection can send multiple resources. But the classic single-request single-response is a good mental model for HTTP most of the time.

[↩](#usually%5Fref)

3

I wanted to do this in Rust (my default choice) but found this part of it much easier in Go. I&#39;d still like to write a tool that checks WebSockets for this behavior (and other naughty things), so I might dig in some more with Rust later.

[↩](#rwir%5Fref)

4

The first time I wrote this test, I had the timeout inline in the &#x60;case&#x60;, which resulted in _never_ timing out, because it was created fresh every loop.

[↩](#test-bug%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6)   
 Want to hire great programmers?[Hire via Recurse Center!](https:&#x2F;&#x2F;recurse.com&#x2F;hire?utm%5Fsource&#x3D;ntietz&amp;utm%5Fmedium&#x3D;blog) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) 