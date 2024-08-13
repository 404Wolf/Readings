---
id: 0d8c5eac-fb8c-4ba1-9356-4cfcaa5c5e36
title: Why I am writing a new programming language
tags:
  - RSS
date_published: 2024-05-23 18:00:21
---

# Why I am writing a new programming language
#Omnivore

[Read on Omnivore](https://omnivore.app/me/why-i-am-writing-a-new-programming-language-18fa805b9af)
[Read Original](https://iafisher.com/blog/2021/09/why-i-am-writing-a-new-programming-language)



This summer, I have been working on a new programming language called Venice. Venice is modern, high-level, and statically-typed. It aims to combine the elegance and expressiveness of Python with the static typing and modern language features of Rust. When it is finished, it will look something like this:

&#x60;import map, join from &quot;itertools&quot;

enum Json {
  JsonObject({string: Json}),
  JsonArray([Json]),
  JsonString(string),
  JsonNumber(real),
  JsonBoolean(bool),
  JsonNull,
}

func serialize_json(j: Json) -&gt; string {
  match j {
    case JsonObject(obj) {
      let it &#x3D; (&quot;\(key): \(serialize_json(value))&quot; for key, value in obj)
      return &quot;{&quot; ++ join(it, &quot;, &quot;) ++ &quot;}&quot;
    }
    case JsonArray(values) {
      return &quot;[&quot; ++ join(map(values, serialize_json), &quot;, &quot;) ++ &quot;]&quot;
    }
    case JsonString(s) {
      return s.quoted()
    }
    case JsonNumber(x) {
      return string(x)
    }
    case JsonBoolean(x) {
      return string(x)
    }
    case JsonNull {
      return &quot;null&quot;
    }
  }
}
&#x60;

At a minimum, Venice will include:

* Built-in list, map, and set types
* Structured data types (like structs in C, Rust, and Go)
* Algebraic data types and pattern matching
* Interface types
* A foreign-function interface
* Syntactic sugar like keyword and default function arguments, string interpolation, and list and map comprehensions
* A build system, code formatter, linter, and package manager

Why write a new programming language? For the past five years, Python has been my primary programming language, and in that time I have come to both appreciate its strengths and rue its weaknesses. The language is beginning to show its age: dynamic typing is no longer in vogue; algebraic data types, pattern matching, and non-nullable types, formerly confined to academia, are now mainstream; package managers have become ubiquitous; concurrency is no longer a niche feature. Still, no other language has come as close to my ideal as Python has. In Venice, I hope to take what I love about Python—its readability, expressiveness, and elegance—and combine it with what I love about other languages.

Detailed information about Venice is available in the [official tutorial](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;venice&#x2F;blob&#x2F;master&#x2F;docs&#x2F;tutorial.md) and the [language reference](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;venice&#x2F;blob&#x2F;master&#x2F;docs&#x2F;reference.md).[1](#fn:under-development) If you are interested in Venice, please check out the project on [GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;venice), and feel free to reach out to [ian@iafisher.com](mailto:ian@iafisher.com) with any comments, questions, or suggestions about the language. ∎

---

1. Although note that since Venice is still in early development, not all of the language features described in those documents are available as of September 2021\. [↩](#fnref:under-development &quot;Jump back to footnote 1 in the text&quot;)

---

**Disclaimer:** I occasionally make corrections and changes to posts after I publish them. You can view the full history of this post [on GitHub](https:&#x2F;&#x2F;github.com&#x2F;iafisher&#x2F;blog&#x2F;commits&#x2F;master&#x2F;2021-09-why-venice.md).