---
id: 9dc78be0-e013-43c5-a846-8fa55a44b8e2
title: Exploring Middlewares in Go
tags:
  - RSS
date_published: 2024-05-20 18:40:08
---

# Exploring Middlewares in Go
#Omnivore

[Read on Omnivore](https://omnivore.app/me/exploring-middlewares-in-go-18f9a6ccd7f)
[Read Original](https://vishnubharathi.codes/blog/exploring-middlewares-in-go/)



I came across “Middlewares” for writing HTTP servers originally in the Node.js ecosystem. There is this beautiful library called [express](https:&#x2F;&#x2F;expressjs.com&#x2F;) which sparked the joy of middleware in me. In case you haven’t heard of middleware before, I think you should read [this beautiful page](https:&#x2F;&#x2F;expressjs.com&#x2F;en&#x2F;guide&#x2F;using-middleware.html) from expressjs documentation to get a taste of them. (I genuinely feel that it is the best possible introduction for middleware, hence opening up the post with it)

With enough JavaScript for the day, we will jump into Go now. 😅

My goal for this post is to understand how to {use, write} middlewares in Go HTTP servers. We will also try to search the internet and surface some Go middlewares that we can add to our day-to-day toolkit.

## [](#Problem &quot;Problem&quot;)Problem

Let us take a simple problem and work our way upwards. Here is the problem statement:

Write an HTTP server that contains multiple routes. When a request is made to a route, print a log line at the start and the end of the request. Something like

| 1234 | 2024&#x2F;05&#x2F;21 00:49:32 INFO start method&#x3D;GET path&#x3D;&#x2F;one2024&#x2F;05&#x2F;21 00:49:34 INFO start method&#x3D;GET path&#x3D;&#x2F;two |
| ---- | ------------------------------------------------------------------------------------------------------ |

## [](#Solution &quot;Solution&quot;)Solution

### [](#Without-Middleware &quot;Without Middleware&quot;)Without Middleware

A solution without using middleware would look like

package main  
  
import (  
	&quot;fmt&quot;  
	&quot;log&#x2F;slog&quot;  
	&quot;net&#x2F;http&quot;  
)  
  
func main() {  
	http.HandleFunc(&quot;&#x2F;one&quot;, func(w http.ResponseWriter, r *http.Request) {  
		slog.Info(&quot;start&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)  
		defer slog.Info(&quot;end&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)  
  
		fmt.Fprintln(w, &quot;this is one&quot;)  
	})  
  
	http.HandleFunc(&quot;&#x2F;two&quot;, func(w http.ResponseWriter, r *http.Request) {  
		slog.Info(&quot;start&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)  
		defer slog.Info(&quot;end&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)  
  
		fmt.Fprintln(w, &quot;this is two&quot;)  
	})  
  
	http.ListenAndServe(&quot;:3000&quot;, nil)  
}  

How do we avoid copy-pasting those two lines to every HTTP handler function? Middlewares for the win!

### [](#Basic-Middleware &quot;Basic Middleware&quot;)Basic Middleware

| 12345678910111213141516171819202122232425262728293031 | package mainimport (	&quot;fmt&quot;	&quot;log&#x2F;slog&quot;	&quot;net&#x2F;http&quot;)func logRequest(next func(http.ResponseWriter, \*http.Request)) func(http.ResponseWriter, \*http.Request) {	return func(w http.ResponseWriter, r \*http.Request) {		slog.Info(&quot;start&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)		defer slog.Info(&quot;end&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)		next(w, r)	}}func oneHandler(w http.ResponseWriter, r \*http.Request) {	fmt.Fprintln(w, &quot;this is one&quot;)}func twoHander(w http.ResponseWriter, r \*http.Request) {	fmt.Fprintln(w, &quot;this is two&quot;)}func main() {	http.HandleFunc(&quot;&#x2F;one&quot;, logRequest(oneHandler))	http.HandleFunc(&quot;&#x2F;two&quot;, logRequest(twoHander))	http.ListenAndServe(&quot;:3000&quot;, nil)} |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

### [](#Using-http-HandleFunc &quot;Using http.HandleFunc&quot;)Using http.HandleFunc

We are not done yet! There is still room for improvement. Notice how big the method signature for &#x60;logRequest&#x60; is! we can start from there. I remember a standard library type called &#x60;http.HandlerFunc&#x60; which could be used in the place of &#x60;func(ResponseWriter, *Request)&#x60;. If we start using it, our middleware looks like this.

| 12345678 | func logRequest(next http.HandlerFunc) http.HandlerFunc {	return func(w http.ResponseWriter, r \*http.Request) {		slog.Info(&quot;start&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)		defer slog.Info(&quot;end&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)		next(w, r)	}} |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

While browsing through the Go docs, I noticed that &#x60;http.HandleFunc&#x60; has the below method signature.

| 1 | func HandleFunc(pattern string, handler func(ResponseWriter, \*Request)) |
| - | ------------------------------------------------------------------------ |

That raised a question in me. Why don’t they use &#x60;func HandleFunc(pattern string, handler http.HandlerFunc)&#x60; instead? I thought &#x60;http.HandlerFunc&#x60; is an alias type for &#x60;func(ResponseWriter, *Request)&#x60;. Digging through the standard library source code had the answer. It seems like it is just not a simple alias, but more than that. Copy pasting the implementation of &#x60;http.HanderFunc&#x60; for you straight out of Go source :D

| 12345678910 | type HandlerFunc func(ResponseWriter, \*Request)func (f HandlerFunc) ServeHTTP(w ResponseWriter, r \*Request) {	f(w, r)} |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ |

oh wow, so http.HandleFunc is a &#x60;func(ResponseWriter, *Request)&#x60; which implements the [http.Handler](https:&#x2F;&#x2F;pkg.go.dev&#x2F;net&#x2F;http#Handler) interface.

### [](#Enter-http-Handler &quot;Enter http.Handler&quot;)Enter http.Handler

Why would we need an adapter like &#x60;http.HandlerFunc&#x60; that implements the &#x60;http.Handler&#x60; interface. To understand, let us take a look at the interface definition.

| 123 | type Handler interface {	ServeHTTP(ResponseWriter, \*Request)} |
| --- | -------------------------------------------------------------- |

and also read through the [http.Handler documentation](https:&#x2F;&#x2F;pkg.go.dev&#x2F;net&#x2F;http#Handler). At first, it didn’t solve my doubt, but then I discovered [this beautiful example](https:&#x2F;&#x2F;pkg.go.dev&#x2F;net&#x2F;http#example-Handle) in the docs. Copy pasting the example from the docs here for you to have a quick look.

package main  
  
import (  
	&quot;fmt&quot;  
	&quot;log&quot;  
	&quot;net&#x2F;http&quot;  
	&quot;sync&quot;  
)  
  
type countHandler struct {  
	mu sync.Mutex   
	n  int  
}  
  
func (h *countHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {  
	h.mu.Lock()  
	defer h.mu.Unlock()  
	h.n++  
	fmt.Fprintf(w, &quot;count is %d\n&quot;, h.n)  
}  
  
func main() {  
	http.Handle(&quot;&#x2F;count&quot;, new(countHandler))  
	log.Fatal(http.ListenAndServe(&quot;:8080&quot;, nil))  
}  

wow, did you get it? Sometimes your handler is more than just a &#x60;func(http.ResponseWriter, *http.Request)&#x60;. It could be a struct that contains data that could be used in your request logic. Like in the above case, &#x60;countHandler&#x60; maintains a counter protected by a mutex. Each and every request to &#x60;&#x2F;count&#x60; would increment the counter atomically.

For simple routes, which are just a bunch of instructions we could use &#x60;http.HandleFunc&#x60;. But once your handler gets complex, like having to maintain data that is common to all requests of the handler, then move upward and go for &#x60;http.Handle&#x60;.

woah, this just cleared my long-standing doubt about “when to use &#x60;http.Handle&#x60; and &#x60;http.HandleFunc&#x60;?”

It is getting a bit clearer now on why the &#x60;http.Handler&#x60; interface is needed. With two ways of defining a HTTP handler: one being to write a &#x60;func(http.ResponseWriter, *http.Request)&#x60; and pass it to &#x60;http.HandleFunc&#x60; and another being to write a struct with the necessary logic and pass it down to &#x60;http.Handle&#x60; function, the standard libary needs a common ground in which all its methods can operate on both the types of handlers. Hence an interface.

### [](#http-HandlerFunc-to-http-Handler &quot;http.HandlerFunc to http.Handler&quot;)http.HandlerFunc to http.Handler

Now that it is evident that a Go programmer could choose between using &#x60;http.Handle&#x60; or &#x60;http.HandleFunc&#x60; to serve their handlers, it is necessary that any HTTP middleware should work for both of those use cases. With the current approach to our solution, we will only support middlewares that are input to &#x60;http.HandleFunc&#x60;. Hence moving our middleware to use &#x60;http.Handler&#x60; interface, that way we could accommodate both types of handlers.

| 12345678910111213141516171819202122232425262728293031 | package mainimport (	&quot;fmt&quot;	&quot;log&#x2F;slog&quot;	&quot;net&#x2F;http&quot;)func logRequest(next http.Handler) http.Handler {	return http.HandlerFunc(func(w http.ResponseWriter, r \*http.Request) {		slog.Info(&quot;start&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)		defer slog.Info(&quot;end&quot;, &quot;method&quot;, r.Method, &quot;path&quot;, r.URL.Path)		next.ServeHTTP(w, r)	})}func oneHandler(w http.ResponseWriter, r \*http.Request) {	fmt.Fprintln(w, &quot;this is one&quot;)}func twoHander(w http.ResponseWriter, r \*http.Request) {	fmt.Fprintln(w, &quot;this is two&quot;)}func main() {	http.Handle(&quot;&#x2F;one&quot;, logRequest(http.HandlerFunc(oneHandler)))	http.Handle(&quot;&#x2F;two&quot;, logRequest(http.HandlerFunc(twoHander)))	http.ListenAndServe(&quot;:3000&quot;, nil)} |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## [](#Standard-library-Middlewares &quot;Standard library Middlewares&quot;)Standard library Middlewares

The &#x60;net&#x2F;http&#x60; package in the standard library of Go contains middlewares. If you haven’t realized it yet, don’t worry. That is because they don’t advertise those functions as “middleware” (ctrl+f on docs for middleware leaves you with 0 matches :D)

### [](#AllowQuerySemicolons &quot;AllowQuerySemicolons&quot;)AllowQuerySemicolons

| 1 | func AllowQuerySemicolons(h Handler) Handler |
| - | -------------------------------------------- |

TIL that we could use semicolons instead of ampersands in query strings (though this style is deprecated by W3C). Read more about it here: &lt;https:&#x2F;&#x2F;github.com&#x2F;golang&#x2F;go&#x2F;issues&#x2F;25192&gt;. This middleware is present in the stdlib for solving that problem by replacing the &#x60;;&#x60; with &#x60;&amp;&#x60; under the hood. 

### [](#MaxBytesHandler &quot;MaxBytesHandler&quot;)MaxBytesHandler

| 1 | func MaxBytesHandler(h Handler, n int64) Handler |
| - | ------------------------------------------------ |

This could be used to limit the acceptable request body size. Under the hood, it uses &#x60;MaxBytesReader&#x60;:

&gt; MaxBytesReader prevents clients from accidentally or maliciously sending a large request and wasting server resources. If possible, it tells the ResponseWriter to close the connection after the limit has been reached.

### [](#StripPrefix &quot;StripPrefix&quot;)StripPrefix

| 1 | func StripPrefix(prefix string, h Handler) Handler |
| - | -------------------------------------------------- |

The docs says

&gt; StripPrefix returns a handler that serves HTTP requests by removing the given prefix from the request URL’s Path (and RawPath if set) and invoking the handler h.

My first impression is how could this be useful. Oh, wait for the blast! Here we go once again with a beautiful copy-paste of an stdlib example.

package main  
  
import (  
	&quot;net&#x2F;http&quot;  
)  
  
func main() {  
	  
	  
	http.Handle(&quot;&#x2F;tmpfiles&#x2F;&quot;, http.StripPrefix(&quot;&#x2F;tmpfiles&#x2F;&quot;, http.FileServer(http.Dir(&quot;&#x2F;tmp&quot;))))  
}  

### [](#TimeoutHandler &quot;TimeoutHandler&quot;)TimeoutHandler

| 1 | func TimeoutHandler(h Handler, dt time.Duration, msg string) Handler |
| - | -------------------------------------------------------------------- |

As the name says, it times out the handler if the request is taking more than the given duration.

## [](#Third-party-Middlewares &quot;Third-party Middlewares&quot;)Third-party Middlewares

I came across this beautiful library called &#x60;chi&#x60; which comes loaded up with a bunch of middlewares out of the box: &lt;https:&#x2F;&#x2F;github.com&#x2F;go-chi&#x2F;chi?tab&#x3D;readme-ov-file#middlewares&gt;

I would suggest starting with the default chi recommendation:

| 12345 | r.Use(middleware.RequestID)r.Use(middleware.RealIP)r.Use(middleware.Logger)r.Use(middleware.Recoverer) |
| ----- | ------------------------------------------------------------------------------------------------------ |

and then build up the chain. Go explore and catch ‘em all!

(also let me know your favorite middleware if you have one - because I am trying to discover more third-party middlewares in Go)

## [](#Communicate &quot;Communicate&quot;)Communicate

When writing or using middleware, you may need to pass down a variable that was created by one middleware into another middleware or in the request handler. In the case of JS, we would just mutate the &#x60;request&#x60; object directly since it is dynamically typed :D (lol, good old days). In the case of Go, we can’t do that and we will need a way of passing through variables of any type via the available &#x60;ResponseWriter&#x60; or &#x60;Request&#x60; objects.

I have previously written a whole blog post on the [pitfalls of context.WithValue](https:&#x2F;&#x2F;vishnubharathi.codes&#x2F;blog&#x2F;context-with-value-pitfall) and when not to use them. And well, this is actually the use-case where you can use them!

A context variable is available to you in all the middlewares and the handlers via the &#x60;http.Request&#x60; object. We could use that to store and pass down information. 

  
type RequestKey string  
  
var (  
	RequestIDKey RequestKey &#x3D; &quot;request-id&quot;  
)  
  
func RequestID(next http.Handler) http.Handler {  
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {  
		ctx :&#x3D; context.WithValue(r.Context(), RequestIDKey, uuid.New())  
		next.ServeHTTP(w, r.WithContext(ctx))  
	})  
}  
  
func handlerThatUsesRequestID(w http.ResponseWriter, r *http.Request) {  
	reqID, ok :&#x3D; r.Context().Value(RequestIDKey).(uuid.UUID)  
	if !ok || reqID &#x3D;&#x3D; uuid.Nil {  
		fmt.Fprintln(w, &quot;this a request without requestID&quot;)  
		return  
	}  
	fmt.Fprintf(w, &quot;request id is %s\n&quot;, reqID)  
}  

You still need to be careful while using &#x60;context.WithValue&#x60;. What if you miss calling a middleware, but try to look up the value that it is supposed to set in &#x60;r.Context&#x60;? It changes the trajectory of your request during runtime and in the worst case it will lead to runtime panics in your handler. I am wondering if we could somehow catch this kind of stuff during compile time (like maybe by writing a library or perhaps someone already thought about this before - if so, let me know!)

## [](#Chain &quot;Chain&quot;)Chain

You might soon end up having to call multiple middleware for your handlers. In that case, your code would look like:

| 12345 | http.Handle(&quot;&#x2F;&quot;, Logger(RequestID(homeHandler))))http.Handle(&quot;&#x2F;profile&quot;, Logger(RequestID(BasicAuth(userProfileHandler))))) |
| ----- | --------------------------------------------------------------------------------------------------------------------------- |

We need a way to chain the middleware and store the chain so that we can reuse it between handlers. I recently discovered a library for this, which might help here: &lt;https:&#x2F;&#x2F;github.com&#x2F;justinas&#x2F;alice&gt;

| 12345 | unAuth :&#x3D; alice.New(Logger, RequestID)auth :&#x3D; alice.New(Logger, RequestID, BasicAuth)http.Handle(&quot;&#x2F;&quot;, unAuth.Then(homeHandler))http.Handle(&quot;&#x2F;profile&quot;, auth.Then(userProfileHandler)) |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

You can also use a routing library like &#x60;chi&#x60; where the request middlewares are defined at the router level.

## [](#Closing-Thoughts &quot;Closing Thoughts&quot;)Closing Thoughts

I hope this exploration was useful to you! It definitely made me learn some unexpected things like “when to use http.Handle? when to use http.HandleFunc? ….”. This is also inspiring me to write a small middleware library that I have been thinking about.

\~ \~ \~ \~

In an alternate universe, someone declared &#x60;type Middleware func(Handler) Handler&#x60; in &#x60;net&#x2F;http&#x60; and (use your imagination).