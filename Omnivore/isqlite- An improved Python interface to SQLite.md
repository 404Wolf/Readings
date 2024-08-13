---
id: db98b168-1308-42eb-9101-ccd4d791cd1f
title: "isqlite: An improved Python interface to SQLite"
tags:
  - RSS
date_published: 2024-05-23 18:00:21
---

# isqlite: An improved Python interface to SQLite
#Omnivore

[Read on Omnivore](https://omnivore.app/me/isqlite-an-improved-python-interface-to-sq-lite-18fa805beee)
[Read Original](https://iafisher.com/blog/2021/10/isqlite)



In [last week&#39;s post](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2021&#x2F;10&#x2F;using-sqlite-effectively-in-python), I wrote about how to use SQLite effectively in Python. Since I use SQLite and Python in many of my personal projects, I wrote my own library that wraps Python&#39;s &#x60;sqlite3&#x60; module with a better API, support for schema migrations like in [Django](https:&#x2F;&#x2F;docs.djangoproject.com&#x2F;en&#x2F;3.2&#x2F;topics&#x2F;migrations&#x2F;), and a command-line interface. I call it isqlite.

## Better Python API

Python&#39;s standard &#x60;sqlite3&#x60; module was designed to be compliant with the DB-API 2.0 standard described in [PEP 249](https:&#x2F;&#x2F;www.python.org&#x2F;dev&#x2F;peps&#x2F;pep-0249&#x2F;). DB-API 2.0 is conservative in the operations it requires modules to implement. In particular, the API provides no help in constructing specific SQL statements, instead only exposing &#x60;execute&#x60; and &#x60;executemany&#x60; methods and requiring the library user to write all the SQL themselves.

I find SQL syntax difficult to remember, especially since &#x60;SELECT&#x60;, &#x60;INSERT&#x60;, &#x60;UPDATE&#x60;, and &#x60;DELETE&#x60; queries are all structured differently, so isqlite provides methods for common SQL operations:

&#x60;with Database(&quot;:memory:&quot;) as db:
    # Create a new employee.
    db.insert(&quot;employees&quot;, {&quot;name&quot;: &quot;John Doe&quot;, &quot;title&quot;: &quot;Software Engineer&quot;})

    # Fetch all managers.
    managers &#x3D; db.select(&quot;employees&quot;, where&#x3D;&quot;title &#x3D; &#39;Manager&#39;&quot;)
    # Return value is a list of OrderedDict objects.
    print(managers[0][&quot;name&quot;])

    # Set a holiday bonus for all employees with a certain tenure.
    db.update(
      &quot;employees&quot;,
      {&quot;holiday_bonus&quot;: 500},
      where&#x3D;&quot;tenure &gt;&#x3D; :tenure&quot;,
      values&#x3D;{&quot;tenure&quot;: MINIMUM_TENURE_FOR_BONUS},
    )
&#x60;

Instead of requiring you to call &#x60;fetchone&#x60; or &#x60;fetchall&#x60; to get the results of your queries, isqlite returns the rows directly, as [OrderedDict](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;collections.html#collections.OrderedDict) objects instead of tuples to make them easier to use.

isqlite also has helper methods for common patterns (&#x60;get_by_pk&#x60;, &#x60;insert_and_get&#x60;, &#x60;get_or_insert&#x60;) and can automatically and efficiently fetch related rows using the &#x60;get_related&#x60; parameter:

&#x60;book &#x3D; db.get_by_pk(&quot;books&quot;, 123, get_related&#x3D;[&quot;author&quot;])
# Full author row has been fetched and embedded in the book object.
print(book[&quot;author&quot;][&quot;name&quot;])
&#x60;

If you need to drop into raw SQL, you can easily do so with the &#x60;Database.sql&#x60; method, which is a thin wrapper around &#x60;sqlite3.execute&#x60;.

## Schema migrations

Where isqlite really shines is in its support for schema migrations. isqlite can take a schema written in Python, e.g.

&#x60;from isqlite import Schema, Table, columns

SCHEMA &#x3D; Schema(
  [
    Table(
      &quot;authors&quot;,
      [
        columns.text(&quot;first_name&quot;),
        columns.text(&quot;last_name&quot;),
        columns.text(&quot;country&quot;, required&#x3D;False),
      ],
    ),
    Table(
      &quot;books&quot;,
      [
        columns.text(&quot;title&quot;),
        columns.foreign_key(&quot;author&quot;, foreign_table&#x3D;&quot;authors&quot;),
      ],
    ),
  ]
)
&#x60;

...diff the Python schema against the actual database schema, and run the SQL commands to make the two match. Migrating your database to a new schema is as easy as running &#x60;isqlite migrate path&#x2F;to&#x2F;db path&#x2F;to&#x2F;schema.py&#x60; and confirming the list of changes to be made. isqlite is able to detect renaming of columns and tables and reordering of columns within a table as well as adding and dropping columns.

There are a few reasons to write the schema in Python:

* Schema changes can be tracked by version control.
* An explicit schema ensures that all deployments of the applications are using the same database schema.
* Common patterns can be simplified with Python code, e.g. isqlite provides an &#x60;AutoTable&#x60; class that automatically creates a primary key column called &#x60;id&#x60; and &#x60;created_at&#x60; and &#x60;last_updated_at&#x60; timestamp columns. The &#x60;text_column&#x60; macro enforces that all &#x60;TEXT&#x60; columns must be non-null so that there is only one way to represent the absence of a value (the empty string).

If you prefer, you can manually make schema alterations on the command-line with commands like &#x60;isqlite add-column&#x60; and &#x60;isqlite drop-table&#x60;. This does not require a Python schema.

## Odds and ends

As mentioned in [my previous post on SQLite](https:&#x2F;&#x2F;iafisher.com&#x2F;blog&#x2F;2021&#x2F;10&#x2F;using-sqlite-effectively-in-python), SQLite disables foreign-key constraint enforcement by default. isqlite turns it back on.

isqlite handles SQL transactions in a straightforward manner. If you connect to the database in a &#x60;with&#x60; statement, a transaction is automatically opened and persists for the length of the &#x60;with&#x60; statement. The transaction will be committed at the end or rolled back if an exception occurred.

If you need more finely-grained control of transactions, you can use &#x60;Database.transaction&#x60; as a context manager:

&#x60;with Database(&quot;:memory:&quot;, transaction&#x3D;False) as db:
    with db.transaction():
        ...

    with db.transaction():
        ...
&#x60;

isqlite turns on [converters](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sqlite3.html#converting-sqlite-values-to-custom-python-types) so that SQL values are mapped to corresponding Python values where possible, and registers a few useful converters and adapters of its own for &#x60;datetime.time&#x60; and &#x60;decimal.Decimal&#x60; values.

## Uses

isqlite is designed as a replacement for the built-in &#x60;sqlite3&#x60; module, not for a full-fledged ORM like [SQLAlchemy](https:&#x2F;&#x2F;www.sqlalchemy.org&#x2F;). isqlite does not and will never support any database engine other than SQLite, which makes it less than suitable for, e.g., a realistic web application. However, it is a good fit for applications that [use SQLite as a file format](https:&#x2F;&#x2F;sqlite.org&#x2F;appfileformat.html), for hobby projects that will never need a client-server database engine like Postgres, and for _ad hoc_ database operations on the command-line.

If you&#39;d like to try isqlite out for yourself, you can install it with pip:

Comprehensive documentation is available online at &lt;https:&#x2F;&#x2F;isqlite.readthedocs.io&#x2F;en&#x2F;latest&#x2F;&gt;, and bug reports and feature requests can be filed at &lt;https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;isqlite&#x2F;issues&gt;. ∎

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2021-10-isqlite.md).