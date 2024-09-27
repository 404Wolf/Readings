---
id: 7594be4d-8efc-4a9d-a78f-218659a8136d
title: Using search as a primary datastore since the docs said not to | nicole@web
tags:
  - RSS
date_published: 2024-08-26 00:00:00
---

# Using search as a primary datastore since the docs said not to | nicole@web
#Omnivore

[Read on Omnivore](https://omnivore.app/me/using-search-as-a-primary-datastore-since-the-docs-said-not-to-n-1918dcbcb73)
[Read Original](https://ntietz.com/blog/the-docs-said-no-search-primary/)



**Monday, August 26, 2024**

Look, I&#39;m sorry, but if the docs say not to do something that&#39;s like _catnip_. Then I just _have_ to do it. So when I saw that the [Typesense](https:&#x2F;&#x2F;shortclick.link&#x2F;nsx6rt) docs say [not to use it](https:&#x2F;&#x2F;typesense.org&#x2F;docs&#x2F;overview&#x2F;use-cases.html#bad-use-cases) as a primary datastore? Well well well, that&#39;s what we&#39;ll have to do.

I spent a little bit of time figuring out what a bad _but plausible_ use-case would be. The answer is: a chat app. Most chat apps have a search feature, so if you use search for the primary datastore, you get to remove another component!

Note: this is a sponsored post. I was paid by Typesense to write this post. The brief was to use Typesense in a small project and write about it, the good and the bad[1](#brief). They have not reviewed this post before publication.

## What does the chat app look like?

One of life&#39;s hard problems is naming things. This chat app, like all Super Serious Side Projects, needs a fitting name, and so I arrived at: Taut. It&#39;s named such because it is chat, but it sure ain&#39;t _Slack_.

The build-out was pretty straightforward and you can see the [repo on GitHub](https:&#x2F;&#x2F;github.com&#x2F;ntietz&#x2F;taut-chat). It&#39;s licensed under the AGPL, and you should almost certainly _not_ reuse this code—I&#39;m doing what you&#39;re not supposed to! But it&#39;s open-source, so feel free to draw inspiration from it or use it as an example of how to use the Go SDK for Typesense.

Amusingly, the repo stats show that CSS is what I have the most of. The Go backend for this is pretty simple, and the JS is non-existent since I used htmx. Most of that CSS is not hand-written, though, since I used Tailwind.

Here&#39;s what the finished app looks like. We have a login screen, which has no password requirement because this is for trustworthy people only! You enter your handle and then you&#39;re logged in.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s_Rj5V1vYM9U_FMbQvIrNwmjNOJQmSakq9ZsilXA-H2Y&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;login.d37229b7affa7486.png)

Once you&#39;re logged in, you see a chat interface! Here&#39;s a chat between two of our characters, Nicole and Maddie.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,swS5iTCe0bygSk8AWc_2_MHt1zBNoadn2OyHqJBJK1Dw&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;chat-1.4f299b15c9821a5f.png)

And here&#39;s another, between Nicole and Amy, who are apparently coworkers.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s-bHdU83hdIX8QWl4ekvxg-ydWYFb0svGQPI1z2I55-4&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;chat-2.df555dbe83d9dbde.png)

Oops, it looks like Nicole is going to put corporate details into this chat app! I guess we&#39;d better look at how it&#39;s implemented to see if that&#39;s okay.

## Modeling our data

The first thing we need for our web app is a data model. For our chat app, we really need two main things: users and messages. Each user should have a handle, and each message should have who it&#39;s from and to as well as what was said.

I ended up with these models:

&#x60;&#x60;&#x60;routeros
type User struct {
	ID      string &#x60;json:&quot;id&quot;&#x60;
	Handle  string &#x60;json:&quot;handle&quot;&#x60;
	Credits int64  &#x60;json:&quot;credits&quot;&#x60;
}

type Message struct {
	ID string &#x60;json:&quot;id&quot;&#x60;

	Sender    string &#x60;json:&quot;from_id&quot;&#x60;
	Recipient string &#x60;json:&quot;to_id&quot;&#x60;

	Content   string &#x60;json:&quot;content&quot;&#x60;
	Timestamp int64  &#x60;json:&quot;timestamp&quot;&#x60;
}

&#x60;&#x60;&#x60;

(Ignore &quot;Credits&quot;, sssshhh, we&#39;ll come back to that.)

To get records _into_ the datastore, we also have to configure our schema. There are some auto-schema settings available, but I wasn&#39;t sure how that worked and I want to be _certain_ which schema is picked up, so I went with the old trusty to define how my data is laid out. It&#39;s pretty straightforward: you tell it what fields you have and what their types are, and then you&#39;re done. The ID field is created for you automatically, so you can leave that one off.

Here&#39;s an example of creating the users schema.

&#x60;&#x60;&#x60;dts
ctx :&#x3D; context.Background()

userSchema :&#x3D; &amp;api.CollectionSchema{
  Name: &quot;users&quot;,
  Fields: []api.Field{
    {
      Name: &quot;handle&quot;,
      Type: &quot;string&quot;,
    },
    {
      Name: &quot;credits&quot;,
      Type: &quot;int64&quot;,
    },
  },
}

_, err :&#x3D; ts.Collections().Create(ctx, userSchema)
if err !&#x3D; nil {
  return err
}

&#x60;&#x60;&#x60;

You&#39;d do something similar for any other collection. This isn&#39;t too bad, but it&#39;s a bit redundant with what we already defined in the struct. There could be an opportunity for some languages to auto-generate this for you, though the [typesense-go](https:&#x2F;&#x2F;github.com&#x2F;typesense&#x2F;typesense-go) library doesn&#39;t.

Creating records is where we _start_ to see why what we&#39;re doing is probably a bad idea. I only want to create a record if there isn&#39;t a user already. In relational databases (especially with an ORM), this is a succinct operation. Here, it gets a little more verbose.

We retrieve all the existing users by querying by the user&#39;s handle.

&#x60;&#x60;&#x60;stata
ctx :&#x3D; context.Background()
query :&#x3D; api.SearchCollectionParams{
  Q:       pointer.String(handle),
  QueryBy: pointer.String(&quot;handle&quot;),
}

matchingUsers, err :&#x3D; ts.Collection(&quot;users&quot;).Documents().Search(ctx, &amp;query)
if err !&#x3D; nil {
  return err
}

&#x60;&#x60;&#x60;

Then we count how many there are, and if there is not already a user, we create one!

&#x60;&#x60;&#x60;routeros
if (*matchingUsers.Found) &gt; 0 {
  return nil
}

id :&#x3D; handle
user :&#x3D; User{
  ID:      id,
  Handle:  handle,
  Credits: 100,
}
_, err &#x3D; ts.Collection(&quot;users&quot;).Documents().Create(ctx, user)
if err !&#x3D; nil {
  return err
}
return nil

&#x60;&#x60;&#x60;

A natural question may be, why not use an &#x60;Update&#x60; operation, or &#x60;upsert&#x60; if it&#39;s available? I wanted to do something like this, but this will udpate the document we provide if it already exists! There&#39;s no create-if-not-exists that I could find, and I didn&#39;t want to reset that &#x60;Credits&#x60; field.

We do similar for messages, which is in [models.go](https:&#x2F;&#x2F;github.com&#x2F;ntietz&#x2F;taut-chat&#x2F;blob&#x2F;main&#x2F;pkg&#x2F;web&#x2F;models.go). Now we have our models, and we can create instances of them!

## Building the views

Everything is a single-page app these days and _doesn&#39;t need to be_, so I built this in a traditional client-server way. But since it&#39;s, you know, _chat_, it has to be more interactive. That&#39;s easily addressed with htmx to make things reload! I did polling here for simplicity, but you can also do it over websockets, which would be the better approach.

The login view isn&#39;t too interesting, but the main chat view and search views are where we see the meat. Let&#39;s look at the chat view first.

Since we&#39;re using htmx, we&#39;ll implement _fragments_ of views, which we&#39;ll load to replace specific parts of the page. This led me to write the views in a modular way, and _really_ reminded me how good we have it with other template libraries, and how bare-bones Go&#39;s built-in [html&#x2F;template](https:&#x2F;&#x2F;pkg.go.dev&#x2F;html&#x2F;template) library is.

The main view looks like this. Ignoring the html\_open and html\_close templates, there&#39;s not a lot to it. Just some divs with styles and invoking the templates for our user list and chat window.

&#x60;&#x60;&#x60;handlebars
{{ template &quot;html_open&quot; }}
&lt;main class&#x3D;&quot;w-full h-full&quot;&gt;

&lt;div class&#x3D;&quot;flex flex-col w-full h-full p-4 bg-flagpink&quot;&gt;
{{ template &quot;header&quot; . }}
  &lt;div class&#x3D;&quot;flex flex-row h-full w-full&quot;&gt;
    {{ template &quot;user_list&quot; . }}
    {{ template &quot;chat_window&quot; . }}
  &lt;&#x2F;div&gt;
&lt;&#x2F;div&gt;
&lt;&#x2F;main&gt;
{{ template &quot;html_close&quot; }}

&#x60;&#x60;&#x60;

Each of those is also pretty simple. This is how the user list is populated. Each user has a handle, and clicking on their handle will let you chat with them.

&#x60;&#x60;&#x60;handlebars
{{ define &quot;user_list&quot; }}
&lt;div id&#x3D;&quot;users-list&quot; class&#x3D;&quot;bg-white outline outline-4 outline-black h-full p-2 flex flex-col&quot; hx-get&#x3D;&quot;&#x2F;fragment&#x2F;users&quot; hx-trigger&#x3D;&quot;every 5s&quot; hx-swap&#x3D;&quot;outerHTML&quot;&gt;
  &lt;strong&gt;People&lt;&#x2F;strong&gt;

  {{ range .Handles }}
  &lt;a href&#x3D;&quot;&#x2F;start-chat&#x2F;{{ . }}&quot;&gt;{{ . }}&lt;&#x2F;a&gt;
  {{ end }}

&lt;&#x2F;div&gt;
{{ end }}
{{ template &quot;user_list&quot; . }}

&#x60;&#x60;&#x60;

On the backend, we have to get data _into_ these views, though. To do that, we&#39;re off to query Typesense again! Full details are in [the views.go file](https:&#x2F;&#x2F;github.com&#x2F;ntietz&#x2F;taut-chat&#x2F;blob&#x2F;main&#x2F;pkg&#x2F;web&#x2F;views.go), here are the highlights.

The main thing we need to do is list users. We can make a function to return that list, which will take a Typesense client as an argument (here, it&#39;s called &#x60;h.Ts&#x60; due to either idiomatic or poor naming conventions).

&#x60;&#x60;&#x60;autohotkey
handles, err :&#x3D; ListUserHandles(h.Ts)

&#x60;&#x60;&#x60;

Implementing this is pretty easy. We search for all users, retrieve them, then from each record we extract just the handle.

&#x60;&#x60;&#x60;go
func ListUserHandles(ts *typesense.Client) ([]string, error) {
	ctx :&#x3D; context.Background()

	query :&#x3D; api.SearchCollectionParams{
		Q:       pointer.String(&quot;*&quot;),
		QueryBy: pointer.String(&quot;handle&quot;),
	}

	userRecords, err :&#x3D; ts.Collection(&quot;users&quot;).Documents().Search(ctx, &amp;query)
	if err !&#x3D; nil {
		return nil, err
	}

	handles :&#x3D; make([]string, 0)

	for _, userRecord :&#x3D; range *(*userRecords).Hits {
		handle :&#x3D; (*userRecord.Document)[&quot;handle&quot;].(string)
		handles &#x3D; append(handles, handle)
	}

	return handles, nil
}

&#x60;&#x60;&#x60;

Not bad, given what we&#39;re doing! It could be shorter, but this is a raw library, so it&#39;s not too tough to wrap that up yourself.

## Displaying messages got... sketchy

You&#39;re going to run into cases like this when you hold something wrong on purpose, but yeah, I really stepped in it with message retrieval. What we wanted was to display all the chat messages between two users, and what we got was definitely that, but then also maybe something spicy. To make it work, I definitely misused the query interface.

When you query Typesense, you get a few parameters.

* &#x60;q&#x60; is the search string. For a recipes app, this might be &#x60;&quot;pizza&quot;&#x60;.
* &#x60;query_by&#x60; says which field to search for &#x60;q&#x60; within. This could be something like &#x60;&quot;description&quot;&#x60;.
* &#x60;filter_by&#x60; lets you provide some criteria to filter out non-matching records. This could be &#x60;num_steps:&lt;5&#x60;, because I want a _simple_ pizza recipe.

Now, here&#39;s what I wound up with to search for messages. Remember that our messages have a sender, recipient, and content. Here we&#39;re just looking at messages from one user to the other, so we&#39;ll just get one side of the conversation.

&#x60;&#x60;&#x60;vbscript
filter :&#x3D; fmt.Sprintf(&quot;from_id:&#x3D;%s&quot;, from)

query :&#x3D; api.SearchCollectionParams{
  Q:        pointer.String(to),
  QueryBy:  pointer.String(&quot;to_id&quot;),
  FilterBy: pointer.String(filter),
  SortBy:   pointer.String(&quot;timestamp:desc&quot;),
}

&#x60;&#x60;&#x60;

If your alarm bells are going off right now, blaring &quot;red alert,&quot; yeah, I hear you. What I did here is a _cardinal sin of web development_, one of the [OWASP Top 10](https:&#x2F;&#x2F;owasp.org&#x2F;www-project-top-ten&#x2F;). I allowed an injection attack. It&#39;s all because of this line:

&#x60;&#x60;&#x60;livecodeserver
filter :&#x3D; fmt.Sprintf(&quot;from_id:&#x3D;%s&quot;, from)

&#x60;&#x60;&#x60;

See, Typesense doesn&#39;t have parameterized queries. Those are standard-issue in SQL and when you use them you&#39;re protected from SQL injection attacks. Here, we don&#39;t have them, sooooo... If we just carefully craft a handle, that can end up doing fun things from inside our filter query.

I logged in with my _totally normal_ handle, &#x60;1||from_id:!&#x3D;1&#x60;, and what do you know...

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNJ3YPlCfZcv6cuDkapWkiM1CtjFuqhysbGoechllRt8&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;injection-1.5b3c62f77cbfd45c.png)

Whoops, now as long as I get my own username into the filter field, I can see anyone else&#39;s chats! With that query above, viewing anyone&#39;s chats _with me_ actually result in showing me _any_ message which was intended for them. Now we can see Nicole messaging Amy about those work secrets, oh no!

To protect against this, you have a few options. The best solution is to use [scoped search keys](https:&#x2F;&#x2F;typesense.org&#x2F;docs&#x2F;26.0&#x2F;api&#x2F;api-keys.html#generate-scoped-search-key). These let you essentially pre-filter the dataset with a filter that cannot be modified, so even if someone injects into your filter they can&#39;t gain access to data they otherwise can&#39;t see. This is a bit more work than parameterized queries would be, though, so I&#39;m a _touch_ sad that this is the solution and I hope parameterized queries land someday!

You could also either _ban user input from filter fields_ or _sanitize user input_, but both of these are error prone. It&#39;s very easy to slip up and allow user input through, and it&#39;s really tough to make sure the sanitizer is correct. So it&#39;s best not to rely on these and do it with scoped keys!

## Searching messages was easy

The star of the show here, really, is searching messages. This was delightfully easy. Here&#39;s what it looks like.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,svQ4IHGKli__wrhFiiTV_brNu-4RPHLbaSxfZLdGv1zM&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;search-1.64228f7e2787fa9a.png) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s7siwDkZO08eB2LH0-Uk10SDl1PyYwACY68zMq3iteAQ&#x2F;https:&#x2F;&#x2F;ntietz.com&#x2F;processed_images&#x2F;search-2.bbc4924c749b4938.png)

We can see that in this search, we&#39;re only seeing Nicole&#39;s prviate work chat in her own history! And otherwise, we get the results we&#39;d expect.

Typesense helps highlight where the query was found in the search results! I had a small challenge with it, because it&#39;s different than what I&#39;m used to. In other libraries I&#39;ve used, I will get back the indexes of where highlighted text starts and ends. Typesense gives me a convenience here, specifying the start&#x2F;end tags! The challenge I ran into is how I would make sure that the underlying content is all escaped, to prevent injection attacks, without also escaping these start&#x2F;end tags! I&#39;m sure there&#39;s some way to do that, but I wasn&#39;t clear on how.

As far as Taut goes? I&#39;m just yeeting those messages raw into the finished template, as html. I&#39;m also definitely _not_ putting this on the public internet, because y&#39;all can&#39;t be trusted like that and someone would 100% immediately do a script injection attack here.

This is what our search query looks like:

&#x60;&#x60;&#x60;processing
filter :&#x3D; fmt.Sprintf(&quot;from_id:&#x3D;%s || to_id:&#x3D;%s&quot;, currentUser, currentUser)
qparams :&#x3D; api.SearchCollectionParams{
  Q:                   pointer.String(query),
  QueryBy:             pointer.String(&quot;content&quot;),
  FilterBy:            pointer.String(filter),
  SortBy:              pointer.String(&quot;timestamp:desc&quot;),
  HighlightStartTag:   pointer.String(&quot;&lt;b&gt;&quot;),
  HighlightEndTag:     pointer.String(&quot;&lt;&#x2F;b&gt;&quot;),
  HighlightFullFields: pointer.String(&quot;content&quot;),
}

&#x60;&#x60;&#x60;

This one has the same vulnerability as before, but with a twist: instead of showing messages to the attacker, it will show the attacker&#39;s messages to _you_. This is delightful when you pair with a ~~2012 Cabernet~~ script injection attack. Again, you would mitigate this with scoped search keys, but I didn&#39;t, so we&#39;ve got this little delight.

## Why shouldn&#39;t you use it as a primary datastore?

So, that&#39;s Taut. I said at the outset that the docs told me not to do this and I did it anyway. Why do they say not to do it?

There are a few reasons. Some of them were highlighted above, but some are things you&#39;d run into if you kept going with this.

**Flexibility of queries** is a big one for me. Relational databases have SQL, which is designed for the sort of expressive queries that you do in this sort of app! On the other hand, Typesense is **built for search!**So the queries are optimized for _search scenarios_, which are not the same.

**Lack of parameterized queries** is another one for me. I want my primary datastore to be something that&#39;s hardened and really trusted, from both a reliability and a security perspective. Something which doesn&#39;t have parameterized queries makes me look twice, from a security perspective. Maybe we _shouldn&#39;t_ put user input into filter fields but, okay, someone is _going_ to. We should make that path something that can be reasonably secured. The existing solution of scoped search keys is also a reasonable one, but it&#39;s one that&#39;s not highlighted in the documentation around filters, so again, someone is _going to do this_ in production.

If you kept adding features to this app, you&#39;d run into **lack of transactions**. Again, this makes total sense for document search! But for a primary datastore, you often will have multiple things you want to have happen together or not at all. The &#x60;Credits&#x60; field I&#39;d included? Originally I wanted to implement a feature that&#39;s totally extra, called Extra Chats. If you make a chat &quot;extra&quot;, it would send confetti or something. To do this, you&#39;d have to send the message _and_ deduct from a user&#39;s credits simultaneously.

You can&#39;t insert&#x2F;update records across two collections, though, and you can&#39;t lock rows! There are solutions, like using event sourcing, but... those end up pretty complicated.

And then you also have **data durability**. Typesense stores everything in memory, so unless it&#39;s configured to write to the disk, you can drop data. I was a _little_ annoyed that this is turned on by default, because the wind was taken out of my sails for this point. Turns out, Typesense has worked a lot into making things reliable and durable! Writing data to the disk is enabled by default, and you can enable [clustering for high availability](https:&#x2F;&#x2F;typesense.org&#x2F;docs&#x2F;guide&#x2F;high-availability.html) as well.

Ultimately, though, it&#39;s not _designed_ to be your primary datastore, so you should probably listen to that. There are going to be things that aren&#39;t handled perfectly for durability since that&#39;s not what they&#39;re designing for. So probably don&#39;t do this for real.

## It seems nice, if you hold it right

I came away from this project hoping that I have a use case sometime soon to use Typesense the _right_ way. There are rough edges, of course, because _everthing_ has them. (Seriously, _please_ add parameterized queries, please please, that seems like a big win for happy path security!)

For actually _searching_ across documents? Oh, it seems really nice! I&#39;d love to use it in that way and get to see it in its environment where it shines.

---

1

Amusingly, the brief actually stipulates that I&#39;d use it _as the primary data store_, because I&#39;d pitched that as the idea before the brief was issued and signed. So they did, technically, pay me to use their product wrong!

[↩](#brief%5Fref)

---

 If this post was enjoyable or useful for you, **please share it!** If you have comments, questions, or feedback, you can email [my personal email](mailto:me@ntietz.com). To get new posts and support my work, subscribe to the [newsletter](https:&#x2F;&#x2F;ntietz.com&#x2F;newsletter&#x2F;). There is also an [RSS feed](https:&#x2F;&#x2F;ntietz.com&#x2F;atom.xml).

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) Want to become a better programmer?[Join the Recurse Center!](https:&#x2F;&#x2F;www.recurse.com&#x2F;scout&#x2F;click?t&#x3D;c9a1a9e2e7a2ffefd4af20020b4af1e6)   
 Want to hire great programmers?[Hire via Recurse Center!](https:&#x2F;&#x2F;recurse.com&#x2F;hire?utm%5Fsource&#x3D;ntietz&amp;utm%5Fmedium&#x3D;blog) ![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sAIWQWYUvGZxGMXDWaoMbC2eX1aFB83x9IKHCU_6YdG4&#x2F;data:image&#x2F;svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E) 