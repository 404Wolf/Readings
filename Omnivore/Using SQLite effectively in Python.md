---
id: 955708c9-549d-4ea5-a581-9046d021214c
title: Using SQLite effectively in Python
tags:
  - RSS
date_published: 2024-05-23 18:00:21
---

# Using SQLite effectively in Python
#Omnivore

[Read on Omnivore](https://omnivore.app/me/using-sq-lite-effectively-in-python-18fa805bbb0)
[Read Original](https://iafisher.com/blog/2021/10/using-sqlite-effectively-in-python)



I use [SQLite](https:&#x2F;&#x2F;sqlite.org&#x2F;index.html) as the database for my personal projects in Python. It is [lightweight](https:&#x2F;&#x2F;sqlite.org&#x2F;serverless.html), [reliable](https:&#x2F;&#x2F;sqlite.org&#x2F;hirely.html), [well-documented](https:&#x2F;&#x2F;sqlite.org&#x2F;lang.html), and [better than the filesystem](https:&#x2F;&#x2F;sqlite.org&#x2F;appfileformat.html) for persistent storage. I&#39;d like to share a few lessons I have learned on using SQLite effectively in Python.

The official documentation for Python&#39;s &#x60;sqlite3&#x60; module already has a section on [&quot;Using sqlite3 efficiently&quot;](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sqlite3.html#using-sqlite3-efficiently). It&#39;s worth reading that first, as this post covers different topics.

## Turn on foreign key enforcement

Foreign key constraints are not enforced by default in SQLite. If you want the database to prevent you from inserting invalid foreign keys, then you must run &#x60;PRAGMA foreign_keys &#x3D; 1&#x60; to turn enforcement on. Note that this pragma command must be run **outside of a transaction**; if you run it while a transaction is active, it will [silently do nothing](https:&#x2F;&#x2F;sqlite.org&#x2F;pragma.html#pragma%5Fforeign%5Fkeys).

Since I prefer for my database to detect invalid foreign keys for me, and since (as we&#39;ll see below) the Python&#39;s &#x60;sqlite3&#x60; module will sometimes open transactions implicitly, I run &#x60;PRAGMA foreign_keys &#x3D; 1&#x60; right after I open the connection to the database.

## Manage your transactions explicitly

By default, the underlying SQLite library operates in &#x60;autocommit&#x60; mode, in which changes are committed immediately unless a transaction has been opened with &#x60;BEGIN&#x60; or &#x60;SAVEPOINT&#x60;. You can verify this by opening the same database file with the &#x60;sqlite3&#x60; command-line shell in two different terminals at the same time, and observing that, e.g., a row inserted in one terminal will be returned by a &#x60;SELECT&#x60; statement run in the other. Once you open a transaction with &#x60;BEGIN&#x60;, however, subsequent changes will _not_ be visible to the other terminal until you commit the transaction with &#x60;COMMIT&#x60;.

Python&#39;s &#x60;sqlite3&#x60; module [does not](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sqlite3.html#controlling-transactions) operate in &#x60;autocommit&#x60; mode. Instead, it will start a transaction before data manipulation language (DML) statements[1](#fn:dml) such as &#x60;INSERT&#x60; and &#x60;UPDATE&#x60;, and, until Python 3.6, data definition language (DDL) statements such as &#x60;CREATE TABLE&#x60;.

Opening a transaction in SQLite has several implications:

1. You will not be able to open a transaction in the same process with &#x60;BEGIN&#x60;.
2. You will not be able to open a write transaction in a different process, since by default SQLite only allows [one write transaction at a time](https:&#x2F;&#x2F;sqlite.org&#x2F;lang%5Ftransaction.html).
3. You will not be able to enable or disable foreign key constraint enforcement.

These consequences can come as a surprise when &#x60;sqlite3&#x60; has silently opened a transaction without your knowledge. Even worse, the &#x60;Connection.close&#x60; method [will not commit an open transaction](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sqlite3.html#sqlite3.Connection.close), so you have to manually commit the transaction that &#x60;sqlite3&#x60; automatically opened.

I prefer to manage my transactions explicitly. To do so, pass &#x60;isolation_level&#x3D;None&#x60; as an argument to &#x60;sqlite3.connect&#x60;, which will leave the database in the default &#x60;autocommit&#x60; mode and allow you to issue &#x60;BEGIN&#x60;, &#x60;COMMIT&#x60;, and &#x60;ROLLBACK&#x60; statements yourself.

## Use adapters and converters (with caution)

Python&#39;s &#x60;sqlite3&#x60; module allows you to register **adapters** to convert Python objects to SQLite values, and **converters** to convert SQLite values to Python objects (based on the type of the column). &#x60;sqlite3&#x60; [automatically registers](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sqlite3.html#default-adapters-and-converters) converters for &#x60;DATE&#x60; and &#x60;TIMESTAMP&#x60; columns, and corresponding adapters for Python &#x60;date&#x60; and &#x60;datetime&#x60; objects. Adapters are enabled by default, while converters must be explicitly enabled with the &#x60;detect_types&#x60; parameter to &#x60;sqlite3.connect&#x60;.

In addition to the default converters, I register my own for &#x60;DECIMAL&#x60;, &#x60;BOOLEAN&#x60;, and &#x60;TIME&#x60; columns, to convert them to &#x60;decimal.Decimal&#x60;, &#x60;bool&#x60;, and &#x60;datetime.time&#x60; values, respectively.

Python&#39;s default &#x60;TIMESTAMP&#x60; converter [ignores UTC offsets](https:&#x2F;&#x2F;bugs.python.org&#x2F;issue45335) in the database row and always returns a [naive](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;datetime.html#aware-and-naive-objects) datetime object. If your &#x60;TIMESTAMP&#x60; rows contain UTC offsets, you can register your own converter to return aware datetime objects:[2](#fn:fromisoformat)

&#x60;import datetime
import sqlite3

sqlite3.register_converter(&quot;TIMESTAMP&quot;, datetime.datetime.fromisoformat)
&#x60;

Keep in mind that it is [generally considered](https:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;33465436&#x2F;) better practice to store time zone information as a string identifier from the [IANA time zone database](https:&#x2F;&#x2F;www.iana.org&#x2F;time-zones) in a separate column, rather than use UTC offsets, which change often (e.g., due to daylight saving time).

Adapters and converters are registered globally, not per-database. Be warned that some Python libraries, like Django, [register their own adapters and converters](https:&#x2F;&#x2F;github.com&#x2F;django&#x2F;django&#x2F;blob&#x2F;stable&#x2F;3.2.x&#x2F;django&#x2F;db&#x2F;backends&#x2F;sqlite3&#x2F;base.py#L75-L80) which will apply even if you use the raw &#x60;sqlite3&#x60; interface instead of, e.g., Django&#39;s ORM.

## Beware of column affinity

SQLite lets you declare columns with any type that you want (or none at all). This can work nicely with Python&#39;s converters and adapters; for example, in one of my projects, I had columns of type &#x60;CSV&#x60; and used a converter and an adapter to transparently convert them to Python lists and back.

Although SQLite is flexible with typing, ultimately it must choose a [storage class](https:&#x2F;&#x2F;sqlite.org&#x2F;datatype3.html#storage%5Fclasses%5Fand%5Fdatatypes) for data, either &#x60;TEXT&#x60;, &#x60;NUMERIC&#x60;, &#x60;INTEGER&#x60;, &#x60;REAL&#x60;, or &#x60;BLOB&#x60;. Columns have a &quot;type affinity&quot; which determines the preferred storage class for a column through a [somewhat arbitrary set of rules](https:&#x2F;&#x2F;sqlite.org&#x2F;datatype3.html#determination%5Fof%5Fcolumn%5Faffinity). This ensures that inserting a string into an &#x60;INT&#x60; column will convert the string to an integer, for compatibility with other, rigidly-typed database engines.

A corollary of SQLite&#39;s flexible typing is that [different values in the same column can have different type affinities](https:&#x2F;&#x2F;www.sqlite.org&#x2F;datatype3.html):

&gt; In SQLite, the datatype of a value is associated with the value itself, not with its container.

This can cause problems. I once wanted to copy some rows from one table to another. My rows had &#x60;TIMESTAMP&#x60; columns, and since, as we saw, Python will silently drop UTC offsets, I replaced Python&#39;s &#x60;TIMESTAMP&#x60; converter with one that simply returns the bytes object unchanged:

&#x60;sqlite3.register_converter(&quot;TIMESTAMP&quot;, lambda b: b)
&#x60;

Unfortunately, this converter resulted in the new &#x60;TIMESTAMP&#x60; columns having &#x60;BLOB&#x60; affinity instead of &#x60;TEXT&#x60;. This was a problem, because some SQL operations are sensitive to the affinities of their operands. One of them is &#x60;LIKE&#x60;, which does not work on blob values:

&#x60;sqlite&gt; SELECT &#39;a&#39; LIKE &#39;a&#39;;
1
sqlite&gt; SELECT X&#39;61&#39;;  -- 0x61 is the hexadecimal value of ASCII &#39;a&#39;
a
sqlite&gt; SELECT X&#39;61&#39; LIKE &#39;a&#39;;
0
&#x60;

Consequently, the query &#x60;SELECT * FROM table WHERE date LIKE &#39;2019%&#39;&#x60; did not return any of the inserted rows because they all had &#x60;BLOB&#x60; affinity and the &#x60;LIKE&#x60; comparison always failed. Only when I ran &#x60;SELECT typeof(date) FROM table&#x60; did I discover that some of the values in the same column had different affinities.

The correct procedure would have been to register the converter as &#x60;lambda b: b.decode()&#x60; so that Python would insert string values with &#x60;TEXT&#x60; affinity.[3](#fn:why-converters)

## Conclusion

Because I use SQLite in Python so often, I wrote my own library, [isqlite](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;isqlite), that handles most of these issues for me, and also provides a more convenient Python API and many other useful features. You can read about isqlite in [next week&#39;s blog post](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2021&#x2F;10&#x2F;isqlite). ∎

---

1. The &#x60;sqlite3&#x60; docs [use the term](https:&#x2F;&#x2F;docs.python.org&#x2F;3.8&#x2F;library&#x2F;sqlite3.html#controlling-transactions) &quot;Data Modification Language&quot;, but it appears that &quot;data manipulation language&quot; is the [standard term](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Data%5Fmanipulation%5Flanguage). [↩](#fnref:dml &quot;Jump back to footnote 1 in the text&quot;)
2. &#x60;datetime.fromisoformat&#x60; was added in Python 3.7, so if you are using an older version of Python you will have to write the converter function yourself. You can take a look at how the &#x60;sqlite3&#x60; module implements the [naive datetime converter](https:&#x2F;&#x2F;github.com&#x2F;python&#x2F;cpython&#x2F;blob&#x2F;3.8&#x2F;Lib&#x2F;sqlite3&#x2F;dbapi2.py#L66), and adapt it to also read the UTC offset if present. Or you can copy the implementation of [datetime.fromisoformat](https:&#x2F;&#x2F;github.com&#x2F;python&#x2F;cpython&#x2F;blob&#x2F;3.8&#x2F;Lib&#x2F;datetime.py#L1717). [↩](#fnref:fromisoformat &quot;Jump back to footnote 2 in the text&quot;)
3. You might reasonably wonder why I had enabled converters in the first place if I knew that they were not going to work for my &#x60;TIMESTAMP&#x60; columns. In this case, I was using a library that wrapped &#x60;sqlite3.connect&#x60; and enabled converters for me. [↩](#fnref:why-converters &quot;Jump back to footnote 3 in the text&quot;)

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2021-10-using-sqlite-in-python.md).