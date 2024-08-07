---
id: 02e0b819-2b34-4aaf-9110-defd31e323e2
title: "#18: The End of Schematic Businesses? - by John Loeber"
tags:
  - RSS
date_published: 2024-06-04 15:05:20
---

# #18: The End of Schematic Businesses? - by John Loeber
#Omnivore

[Read on Omnivore](https://omnivore.app/me/18-the-end-of-schematic-businesses-by-john-loeber-18fe4fad464)
[Read Original](https://loeber.substack.com/p/18-the-end-of-schematic-businesses)



Many software businesses perform a _schematic_ task: they help a user take some large, unwieldy, ever-evolving set of data, and impose some kind of schema or taxonomy on it, thereby making it manageable and useful. In the past two decades, many such businesses have become extraordinarily successful — adding up to many hundreds of billions of dollars in valuation. They come in many shapes and flavors, for example:

* CRMs take unstructured data like emails and phone calls, and create a schematic interface to them: letting you group, filter, sort, and take actions on your contacts.
* Business intelligence tools take structured data, like your application database or Google Analytics, and give you new, visual interfaces for this combined data.
* Special-purpose OCR tools take raw documents and extract key data from them, exposing them by API, again turning unstructured data into structured data.

This is a very broad category. It basically includes any kind of _data transformation_ task, which is common across all kinds of management systems,[1](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;18-the-end-of-schematic-businesses#footnote-1-145184599) document parsing tools, data visualization software, and so forth. It has been a successful industry because _data transformation_ has (1) historically been tricky and labor-intensive, with many edge cases that you have to guard against and (2) usually been integrated deep in the bowels of a business: once you install Salesforce, you’re not tearing it out again. 

So, here’s a question that might have seemed crazy two years ago: 

Let me take a step back and provide two examples. 

#### Documents and APIs

Historically, many businesses have interacted like this:

[![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;1456x1025,sVJARgjclJ3UOq-2Oe0urtXrJtwDv3tkqSmt_NPjRKe0&#x2F;https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe117df11-5ba0-4240-99e5-4901d380c09f_1938x1364.png)](https:&#x2F;&#x2F;substackcdn.com&#x2F;image&#x2F;fetch&#x2F;f%5Fauto,q%5Fauto:good,fl%5Fprogressive:steep&#x2F;https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe117df11-5ba0-4240-99e5-4901d380c09f%5F1938x1364.png)

And for a long time, the engineers’ answer was: _these businesses need APIs_. Instead of having employees push documents back and forth, the systems should talk to each other directly. Many good companies have been built on this proposition.

But in a world in which OCR is really good, it may not matter much anymore. Suppose someone emails me a document that contains some useful data. I can pass the document to an application that extracts the text, has an LLM extract the relevant data, and prompts it to coerce that data into the schema my database has. It no longer practically matters whether the data comes as an e-mailed document or by API. It winds up in my database either way: effortlessly, and _without the two companies having to spend months agreeing on an API schema and then building out some maintenance-needy interoperability layer_.

#### Salesforce

Suppose you have a small team, ten thousand clients, and a couple hundred thousand emails across all those clients. The conventional solution to keep track of everything is a CRM like Salesforce.

But a couple hundred thousand emails isn’t actually very much data. You can put all those emails into a database, compute the [embeddings](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Word%5Fembedding), and then run [RAG](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Prompt%5Fengineering#Retrieval-augmented%5Fgeneration) across that. None of this is hard, and LLMs then allow you to query your dataset:

* Where is Bryce on the deal with the Fisher Account?
* How are we doing with Van Patten, do we need to follow-up?
* What did I talk about last with McDermott?
* List all the accounts that I spoke to last month, but not this month

That functionality is similar to what Salesforce provides. Adding basic automation that handles prompts such as “Send a follow-up email to any client that I haven’t spoken with in the last 6 months” is easy. Would I rather have this, or spend months building out and maintaining a costly Salesforce implementation? I lean toward the former.

### **The Attack**

There are three components coming together:

1. Large Language Models are _very good_ at data transformation;
2. Continuously improving data store technologies and the falling cost of compute make it feasible to run arbitrary data transformations on-the-fly;
3. _Business data_ is growing, but more slowly: documents, emails, spreadsheets, etc. just aren’t very big.

Not too far out in the future, businesses will gain the option to choose between (1) schematic software that lets them organize their data into a very precise traditional interface, or (2) LLM applications that let them organize and interface with their data on-demand as necessary. In the near future, the schematic software might have a precision advantage over the LLM application, but as time goes on, I’d expect the LLM application to become better and better at making precisely the right transformation based on the user’s demand.

### **The LLM Advantage**

The LLM approach has one big advantage: it’s much more flexible, so it’s not annoying to set up and maintain.

By way of example: most companies are in _Dashboard Hell_. They have a bunch of internal dashboards that provide a gazillion different views into the business data. Most employees are familiar with maybe two of these dashboards, and are otherwise totally lost when trying to get to a data-driven answer. They have to go ask someone on the data team the question, and then the data person will file a ticket and eventually return some kind of view that the employee would’ve never found. Not only does such dashboard software (Looker, Tableau, Sigma, etc.) run you _at minimum_ $10,000 a year, but because they also require people to continuously maintain them[2](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;18-the-end-of-schematic-businesses#footnote-2-145184599) and help regular employees get answers from them, the fully-loaded cost easily and quickly climbs into six figures a year and beyond. 

But the competition is coming! There are now many, many startups trying to attack exactly this problem with LLMs: they enable companies to connect their database and other data sources, and then let the user ask natural-language questions. Behind the scenes, an LLM-enabled application makes sense of the schemas in real time, designs the right queries, and returns the output. That’s accessible and useful in a way that current business intelligence tools just aren’t. 

### **My Perspective**

Many years ago, I once worked for a company that had to handle and reconcile user data from a great many sources, some of which would conflict with one another. My new-engineer instinct was to carefully design precise schemas for everything that we could possibly expect, and then define carefully-thought-out rules for when to prioritize persisting which data.

More senior engineers on the team suggested a different path: they thought it was too hard to predict all the weird data schemas we might encounter, and so they designed one fairly simple, permissive schema that could easily accommodate all such data, and then they put all their effort into a fast _harmonization algorithm_ that would run on the fly and pick out the best pieces of data in response to a query.

I often think about _harmonization._ It was one of those classic don’t-let-perfect-be-the-enemy-of-good techniques that make for practical engineering: instead of building a brittle, special-cased system, build something that’s easy to maintain, works well in the vast majority of cases, and then you can tune performance up over time. You’re not going to have perfect accuracy up-front, but for most applications, you don’t really need perfect accuracy and the trade-off is worth it.

I suspect that there is a large number of software businesses that constitute _useful but brittle, special-cased systems_ for schematizing data_,_ and that they will soon give way to LLM applications simply sitting right on top of the data, harmonizing on the fly. 

[1](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;18-the-end-of-schematic-businesses#footnote-anchor-1-145184599)

Applicant tracking systems, customer relationship management systems, agency management systems, document management systems, etc. Even project management software like Asana or Linear is about data transformation in the sense that it gives me and my team a place to clearly organize, under a well-defined schema, project management items that would otherwise be scrambled across many emails, Discord messages, and Google documents.

[2](https:&#x2F;&#x2F;loeber.substack.com&#x2F;p&#x2F;18-the-end-of-schematic-businesses#footnote-anchor-2-145184599)

For example, due to schema changes in the underlying database.