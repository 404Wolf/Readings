---
id: 50c7447c-fc0d-11ee-9fbc-ebfb24da77ff
title: Some useful types for database-using Rust web apps - Andreas Fuchs’ Journal
tags:
  - RSS
date_published: 2024-04-16 00:47:11
---

# Some useful types for database-using Rust web apps - Andreas Fuchs’ Journal
#Omnivore

[Read on Omnivore](https://omnivore.app/me/some-useful-types-for-database-using-rust-web-apps-andreas-fuchs-18ee7b6303b)
[Read Original](https://boinkor.net/2024/04/some-useful-types-for-database-using-rust-web-apps/)



I’ve been writing a little web app in rust lately, and in it I decided to try to do it without an ORM. Instead, I modeled data access in a way that resembles the [Data Access Layer](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Data%5Faccess%5Flayer) pattern: You make a set of abstractions that maps the “business logic” to how the data is stored in the data store. Here are some types that I found useful in this journey so far.

## The &#x60;IdType&#x60; trait

The first item is a very subtle little thing that I wasn’t sure would work. But it does, and it’s really pleasing! Introducing &#x60;IdType&#x60;, a trait that marks a type used for database identifiers. Say you have a struct &#x60;Bookmark&#x60; in sqlite that is has a &#x60;u64&#x60; as a primary key. What prevents you from passing accidentally just about any &#x60;u64&#x60; (say, a user ID) into a struct and reading any bookmark in the database? Right, that’s why we make newtypes.

So you make a newtype that wraps &#x60;u64&#x60; and define your bookmark struct like so[1](#fn:1):

&#x60;&#x60;&#x60;rust
struct BookmarkId(u64);

pub struct Bookmark {
    pub id: BookmarkId,
    pub url: Url,
}

&#x60;&#x60;&#x60;

Sweet, but how do you create a new bookmark? Your database is what assigns these IDs, so do you make a second struct &#x60;BookmarkForInsertion&#x60; and sync struct fields? Or do you extract the ID fields and make a struct two layers deep? Pass all bookmark fields to an &#x60;add&#x60; function? All of these seemed unpleasant to me. Here’s what I do instead:

&#x60;&#x60;&#x60;rust
pub trait IdType&lt;T&gt;: Copy + fmt::Display {
    type Id;

    &#x2F;&#x2F;&#x2F; Returns the inner ID.
    fn id(self) -&gt; Self::Id;
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Hash, Debug, Clone, Copy, sqlx::Type)]
#[sqlx(transparent)]
#[serde(transparent)]
pub struct BookmarkId(i64);

impl IdType&lt;BookmarkId&gt; for BookmarkId {
    type Id &#x3D; i64;

    fn id(self) -&gt; Self::Id {
        self.0
    }
}

&#x60;&#x60;&#x60;

OK, so that’s more complicated. What does that allow us to do? Let’s update our Bookmark struct to use it:

&#x60;&#x60;&#x60;rust
pub struct Bookmark&lt;ID: IdType&lt;BookmarkId&gt;&gt; {
    pub id: ID,
    pub url: Url,
    &#x2F;&#x2F; ...
}

&#x60;&#x60;&#x60;

So what this does is, now you can handle “existing” bookmarks like before, but also you can specify that a bookmark doesn’t have an ID yet:

&#x60;&#x60;&#x60;armasm
pub fn update_bookmark(bm: Bookmark&lt;BookmarkId&gt;) { ... }
&#x2F;&#x2F; and
pub fn create_bookmark(bm: Bookmark&lt;NoId&gt;) -&gt; Bookmark&lt;BookmarkId&gt; { ... }

&#x60;&#x60;&#x60;

What’s more, the &#x60;IdTrait&lt;T&gt;&#x60; takes a type parameter that tells us what the expected ID type would be. That comes into play with the &#x60;NoId&#x60; type above: It’s a little empty type that just says “I’m not an ID yet”:

&#x60;&#x60;&#x60;rust
#[derive(PartialEq, Eq, Clone, Copy, Default, Serialize, Debug)]
pub struct NoId;

impl&lt;T&gt; IdType&lt;T&gt; for NoId {
    type Id &#x3D; std::convert::Infallible;

    fn id(self) -&gt; Self::Id {
        unreachable!(&quot;You mustn&#39;t try to access non-IDs.&quot;);
    }
}

&#x60;&#x60;&#x60;

Some neat things in this: One, &#x60;NoId&#x60; is a generic placeholder for all ID types - meaning a function signature can always take a struct representation of a database object that doesn’t exist in the database yet. Neat thing two, the “inner” Id can not be retrieved from it. (It doesn’t exist, after all!) It’s [convert::Infallible](https:&#x2F;&#x2F;doc.rust-lang.org&#x2F;std&#x2F;convert&#x2F;enum.Infallible.html), the “never” type, meaning any attempt at retrieving that ID will fail at compile time. The compiler won’t let us look at the IDs of objects that haven’t gotten any yet! One day, when the [never type](https:&#x2F;&#x2F;doc.rust-lang.org&#x2F;std&#x2F;primitive.never.html) is stabilized, we can use that. In the meantime, this is equivalent enough!

What’s more, the NoId type tells serde to not expect an &#x60;id&#x60; field whenever you deserialize a Bookmark, say from JSON input on an API route:

&#x60;&#x60;&#x60;rust
&#x2F;&#x2F;&#x2F; NoId can be deserialized from any source, even if the field is not
&#x2F;&#x2F;&#x2F; present.
impl&lt;&#39;de&gt; Deserialize&lt;&#39;de&gt; for NoId {
    fn deserialize&lt;D&gt;(_deserializer: D) -&gt; Result&lt;Self, D::Error&gt;
    where
        D: Deserializer&lt;&#39;de&gt;,
    {
        Ok(NoId)
    }
}

&#x60;&#x60;&#x60;

I didn’t expect this pattern to work so well, but it’s been extremely helpful in this CRUD app to not have to write multiple structs with the same (and then out-of-sync) fields in them; and it feels even better to do that with structures that feel like the business logic needs to feel - rather than how the database layout requires them to be.

But how do we use those structs? I thought we weren’t making an ORM?

## The read-only&#x2F;read-write transaction pattern

My app is a really reasonably “normal” one where a logged-in user makes a request, and that triggers one or multiple database operations, and if everything went right, commits any changes. That’s a transaction! And what is a transaction other than a collection of business logic that gets applied to a data store?

Hence, the &#x60;Transaction&#x60; type. It wraps a lower-level (sqlite, in my case) Transaction handle that can’t be retrieved (so code can’t play with the database directly), and exposes methods that allow code to perform operations on the database:

&#x60;&#x60;&#x60;rust
struct Transaction {
    txn: sqlx::Transaction&lt;&#39;static, sqlx::sqlite::Sqlite&gt;,
}

impl Transaction {
    &#x2F;&#x2F;&#x2F; Commit any changes made in the transaction.
    pub async fn commit(&amp;mut self) { self.txn.commit().await; }

    &#x2F;&#x2F;&#x2F; Add a new bookmark and return its ID.
    pub async fn add_bookmark(
        &amp;mut self,
        bm: Bookmark&lt;NoId&gt;,
    ) -&gt; Result&lt;BookmarkId, sqlx::Error&gt; {
        &#x2F;&#x2F; ...
    }

    &#x2F;&#x2F;&#x2F; Retrieve the bookmarks that belong to the current user.
    pub async fn list_bookmarks(
        &amp;mut self
    ) -&gt; Result&lt;Vec&lt;Bookmark&lt;BookmarkId&gt;&gt;&gt; {
        &#x2F;&#x2F; ...
    }
}

&#x60;&#x60;&#x60;

So that’s neat! But we can get something even neater. You may have seen this [article about running sqlite on a server](https:&#x2F;&#x2F;kerkour.com&#x2F;sqlite-for-servers), and it recommends having two connection pools: One for read-only ops and one for read-write ops. Let’s make a read-only and a read-write transaction that gets created from each of these two pools:

&#x60;&#x60;&#x60;rust
pub trait TransactionMode {}

pub struct ReadOnly {}
impl TransactionMode for ReadOnly {}

pub struct ReadWrite {}
impl TransactionMode for ReadWrite {}

pub struct Transaction&lt;M: TransactionMode &#x3D; ReadWrite&gt; {
    txn: sqlx::Transaction&lt;&#39;static, sqlx::sqlite::Sqlite&gt;,
    marker: PhantomData&lt;M&gt;,
}

impl Connection {
    pub async fn begin_for_user(
        &amp;self,
        user: User&lt;UserId&gt;,
    ) -&gt; Result&lt;Transaction&lt;ReadWrite&gt;, sqlx::Error&gt; {
        &#x2F;&#x2F; ...
    }

    pub async fn begin_ro_for_user(
        &amp;self,
        user: User&lt;UserId&gt;,
    ) -&gt; Result&lt;Transaction&lt;ReadOnly&gt;, RoTransactionError&gt; {
        &#x2F;&#x2F; ...
    }
}

&#x60;&#x60;&#x60;

So that gives us two methods - &#x60;Connection::begin&#x60; and &#x60;Connection::begin_ro&#x60;. And now, it’s pretty easy to split that Transaction implementation into two blocks, one for the read-only operation and one for the read-write one:

&#x60;&#x60;&#x60;rust
impl Transaction&lt;ReadWrite&gt; {
    &#x2F;&#x2F;&#x2F; Commit any changes made in the transaction.
    pub async fn commit(&amp;mut self) { self.txn.commit().await; }

    &#x2F;&#x2F;&#x2F; Add a new bookmark and return its ID.
    pub async fn add_bookmark(
        &amp;mut self,
        bm: Bookmark&lt;NoId&gt;,
    ) -&gt; Result&lt;BookmarkId, sqlx::Error&gt; {
        &#x2F;&#x2F; ...
    }
}

impl&lt;M: TransactionMode&gt; Transaction&lt;M&gt; {
    &#x2F;&#x2F;&#x2F; Retrieve the bookmarks that belong to the current user.
    pub async fn list_bookmarks(
        &amp;mut self,
        user_id: UserId,
    ) -&gt; Result&lt;Vec&lt;Bookmark&lt;BookmarkId&gt;&gt;&gt; {
        &#x2F;&#x2F; ...
    }
}

&#x60;&#x60;&#x60;

So the ReadWrite impl block looks reasonable, but why is the read-only block generic? That’s because the method is available in both - &#x60;ReadWrite&#x60; _and_ &#x60;ReadOnly&#x60; modes. You could also define methods that _aren’t_ available in read-write modes - say, if they’re heavyweight enough that blocking your single write-capable connection with them would be wasteful. Then you write a &#x60;impl Transaction&lt;ReadOnly&gt;&#x60; block and the compiler will take care of the rest - any method defined on the “wrong” transaction type is definitely not callable - the compiler won’t even be able to find it.

…but the compiler will tell you that you got the wrong mode. Here’s how an error looks like if I accidentally call &#x60;.commit()&#x60; on a read-only transaction:

&#x60;&#x60;&#x60;oxygene
error[E0599]: no method named &#x60;commit&#x60; found for struct &#x60;DbTransaction&#x60; in the current scope
  --&gt; src&#x2F;lz-web&#x2F;src&#x2F;ui.rs:51:9
   |
51 |     txn.commit();
   |         ^^^^^^ method not found in &#x60;DbTransaction&#x60;
   |
  ::: src&#x2F;lz-web&#x2F;src&#x2F;db.rs:45:1
   |
45 | pub struct DbTransaction&lt;M: lz_db::TransactionMode &#x3D; lz_db::ReadOnly&gt; {
   | --------------------------------------------------------------------- method &#x60;commit&#x60; not found for this struct
   |
   &#x3D; note: the method was found for
           - &#x60;DbTransaction&lt;ReadWrite&gt;&#x60;

&#x60;&#x60;&#x60;

Every operation is made by a logged-in user, and so the transaction can encode _who_ is making the request (since the authentication is checked as part of an [axum extractor](https:&#x2F;&#x2F;docs.rs&#x2F;axum&#x2F;latest&#x2F;axum&#x2F;extract&#x2F;index.html)). That gives us the opportunity to _always_ know on whose behalf something is happening, and our data access methods can add restrictions to the query that ensures even faulty&#x2F;manipulated input data doesn’t touch another user’s data!

&#x60;&#x60;&#x60;dts
pub struct Transaction&lt;M: TransactionMode &#x3D; ReadWrite&gt; {
    txn: sqlx::Transaction&lt;&#39;static, sqlx::sqlite::Sqlite&gt;,
    user: User&lt;UserId&gt;,  &#x2F;&#x2F; &lt;- this is new!
    marker: PhantomData&lt;M&gt;,
}

&#x60;&#x60;&#x60;

and… rework the methods that begin a transaction such that they require a username, and you can do stuff like this:

&#x60;&#x60;&#x60;rust
impl&lt;M: TransactionMode&gt; Transaction&lt;M&gt; {
    &#x2F;&#x2F;&#x2F; Retrieve the bookmarks that belong to the current user.
    pub async fn list_bookmarks(
        &amp;mut self
    ) -&gt; Result&lt;Vec&lt;Bookmark&lt;BookmarkId&gt;&gt;&gt; {
        &#x2F;&#x2F; ...
        query_builder.push(&quot;WHERE user_id &#x3D; &quot;);
        query_builder.push_bind(self.user.id);
        &#x2F;&#x2F; ...
    }
}

&#x60;&#x60;&#x60;

All that, together, feels pretty neat (and honestly, not allllll that “clever”)! I have no doubt a sufficiently powerful ORM could have let me do these things too, with plugins and various other generics. But doing them this way feels somewhat more right - defining these structs and the logic operating on them allows for a lot of flexibility in coming up with efficient data representations &amp; queries, while the various niceties that the language gives us (automatic json representation&#x2F;parsing with serde! Transaction rollback on early-return!) make it feel really easy to write and maintain. I’ve been through a bunch of refactors of this app already, and the basic structure has held up pretty nicely.

---

1. Please note that approximately none of the code listed here will compile out of the box. Very sorry - this post is meant to provide a basis for a dialog with the rust compiler, not to be an entirely copy&#x2F;pasteable framework; that would require a bit more boilerplate and wouldn’t add much to the quality of the content. You are smart! You got this! [↩︎](#fnref:1)