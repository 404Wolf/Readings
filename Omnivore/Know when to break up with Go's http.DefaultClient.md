---
id: bbdd2fc7-6c6d-4a8f-b226-f78ec3372891
title: Know when to break up with Go's http.DefaultClient
tags:
  - RSS
date_published: 2024-07-07 14:01:30
---

# Know when to break up with Go's http.DefaultClient
#Omnivore

[Read on Omnivore](https://omnivore.app/me/know-when-to-break-up-with-go-s-http-default-client-1908eda4bd6)
[Read Original](https://vishnubharathi.codes/blog/know-when-to-break-up-with-go-http-defaultclient/)



These might be the first set of snippets that you see when trying to use Go’s HTTP client. (taken from the “overview” section of [the standard library docs](https:&#x2F;&#x2F;pkg.go.dev&#x2F;net&#x2F;http))

| 1234 | resp, err :&#x3D; http.Get(&quot;http:&#x2F;&#x2F;example.com&#x2F;&quot;)...resp, err :&#x3D; http.Post(&quot;http:&#x2F;&#x2F;example.com&#x2F;upload&quot;, &quot;image&#x2F;jpeg&quot;, &amp;buf)... |
| ---- | ------------------------------------------------------------------------------------------------------------------------- |

The same set of snippets has the potential to cause your first production outage. It is perfectly good code (up to a certain point). Things will start to get dirty when you introduce the following things into the mix:

* when your program is starting to make a lot of HTTP calls.
* when your program is making HTTP calls to more than one service (host names).

The reason behind it is this little variable declared in the &#x60;net&#x2F;http&#x60; package.

| 1 | var DefaultClient &#x3D; &amp;Client{} |
| - | ----------------------------- |

## [](#Meet-the-DefaultClient &quot;Meet the DefaultClient&quot;)Meet the DefaultClient

&#x60;DefaultClient&#x60; is of type &#x60;*http.Client&#x60; and &#x60;http.Client&#x60; is the struct that has all the code to perform HTTP calls. &#x60;DefaultClient&#x60; is a HTTP client with all the underlying settings pointing to the default values.

When you try calling those package-level HTTP methods like &#x60;http.Get&#x60;, &#x60;http.Post&#x60;, &#x60;http.Do&#x60; etc., the HTTP call is made using the &#x60;DefaultClient&#x60; variable. Two fields in the &#x60;http.Client&#x60; struct could translate the “default” and “shared” behavior of &#x60;http.DefaultClient&#x60; into potential problems:

type Client struct {  
	  
	  
	Transport RoundTripper  
	  
	  
	Timeout time.Duration  
}  

The default value for &#x60;Timeout&#x60; is zero, so the &#x60;http.DefaultClient&#x60; does not timeout by default and will try to hold on to a local port&#x2F;socket as long as the connection is live. What if there are too many requests? Combine this with an HTTP server which doesn’t timeout. Bingo! You got a production outage. You will run out of ports and there won’t be newer ports available for making further HTTP calls.

Next up is the &#x60;Transport&#x60; field in the &#x60;http.Client&#x60;. By default, the following &#x60;DefaultTransport&#x60; would be used in &#x60;DefaultClient&#x60;.

var DefaultTransport RoundTripper &#x3D; &amp;Transport{  
	Proxy: ProxyFromEnvironment,  
	DialContext: defaultTransportDialContext(&amp;net.Dialer{  
		Timeout:   30 * time.Second,  
		KeepAlive: 30 * time.Second,  
	}),  
	ForceAttemptHTTP2:     true,  
	MaxIdleConns:          100,  
	IdleConnTimeout:       90 * time.Second,  
	TLSHandshakeTimeout:   10 * time.Second,  
	ExpectContinueTimeout: 1 * time.Second,  
}  

(a lot of things in there, but turn your attention to &#x60;MaxIdleConns&#x60;)

Here is the doc on what it does:

| 123 | MaxIdleConns int |
| --- | ---------------- |

Since the &#x60;DefaultClient&#x60; is shared, you might end up making calls to more than one service (host names) from it. In that case, there might be an unfair distribution of the &#x60;MaxIdleConns&#x60; maintained by the default client for the given set of hosts.

## [](#A-small-example &quot;A small example&quot;)A small example

Let us take an example here:

type LoanAPIClient struct {}  
  
func (l *LoanAPIClient) List() ([]Loan, error) {  
	  
	err :&#x3D; http.Get(&quot;https:&#x2F;&#x2F;loan.api.example.com&#x2F;v1&#x2F;loans&quot;)  
	  
}  
  
type PaymentAPIClient struct {}  
  
func (p *PaymentAPIClient) Pay(amount int) (error) {  
	  
	err :&#x3D; http.Post(&quot;https:&#x2F;&#x2F;payment.api.example.com&#x2F;v1&#x2F;card&quot;, &quot;application&#x2F;json&quot;, &amp;req)  
	  
}  

Both &#x60;LoanAPIClient&#x60; and &#x60;PaymentAPIClient&#x60; use the &#x60;http.DefaultClient&#x60; by calling into &#x60;http.Get&#x60; and &#x60;http.Post&#x60;. Let us say our program makes 80 calls from &#x60;LoanAPIClient&#x60; initially and then makes 200 calls from &#x60;PaymentAPIClient&#x60;. By default &#x60;DefaultClient&#x60; only maintains 100 maximum idle connections. So, &#x60;LoadAPIClient&#x60; will capture 80 spots in those 100 spots, and &#x60;PaymentAPIClient&#x60; will only get 20 remanining spots. This means that for the rest of 60 calls from &#x60;PaymentAPIClient&#x60;, a new connection needs to be opened and closed. This will cause unnecessary pressure on the payments API server. The allocation of these MaxIdleConns will soon get out of your hands! (trust me 😅)

## [](#How-do-we-fix-this &quot;How do we fix this?&quot;)How do we fix this?

Increase the &#x60;MaxIdleConns&#x60;? Yes, you can but if the client is still shared between &#x60;LoanAPIClient&#x60; and &#x60;PaymentAPIClient&#x60; then that too shall get out of hand at some scale.

I discovered the sibling of &#x60;MaxIdleConns&#x60; and that is &#x60;MaxIdleConnsPerHost&#x60;.

| 1234 | MaxIdleConnsPerHost int |
| ---- | ----------------------- |

This could help in maintaining a predictable number of idle connections for each endpoint (host name).

## [](#OK-how-do-I-really-fix-this &quot;OK, how do I really fix this?&quot;)OK, how do I really fix this?

If your program is calling into more than one HTTP service, then you might most probably want to tweak other settings of the Client too. So, it might be beneficial to have a separate &#x60;http.Client&#x60; for these services. That way we can fine-tune them if needed in the future.

| 1234567 | type LoanAPIClient struct {	client \*http.Client}type PaymentAPIClient struct {	client \*http.Client} |
| ------- | ----------------------------------------------------------------------------------------------------- |

## [](#It-is-fine &quot;It is fine&quot;)It is fine

The conclusion would be this: It is okay to use &#x60;http.DefaultClient&#x60; to start with. But if you think you will have more clients and will make more API calls, avoid it.

Bonus: If you are authoring a library that has an API client, do a favor for your users: provide a way to customize the &#x60;http.Client&#x60; that you are using to make API calls. That way, your users have full control of what they would like to achieve while using your client.

\~ \~ \~ \~

HTTP Clients inside an HTTP Server talking to another HTTP Server that has HTTP Clients, all authored by you. That will be your cue.