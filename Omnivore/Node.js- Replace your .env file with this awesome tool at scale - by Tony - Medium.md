---
id: e4b6ad60-4c1a-44e8-806d-e4bfc8be2942
title: "Node.js: Replace your .env file with this awesome tool at scale | by Tony | Medium"
date_published: 2023-05-02 07:45:58
---

# Node.js: Replace your .env file with this awesome tool at scale | by Tony | Medium
#Omnivore

[Read on Omnivore](https://omnivore.app/me/node-js-replace-your-env-file-with-this-awesome-tool-at-scale-by-18a1db57d18)
[Read Original](https://medium.com/@tony.infisical/node-js-replace-your-env-file-with-this-awesome-tool-ac94960d2c4f)



![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;501x501,stQo5o40DkwSM0OF0TvCgKHMtdz9G_jQbVbUiEM5eh3g&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:752&#x2F;1*X42dXN3MwwgCV2HXtCbdcQ.png)

When developing applications, handling sensitive information like API keys, database credentials, and configuration settings is crucial. Ensuring these environment variables are managed securely, efficiently, and in sync across the development lifecycle is a common challenge and let’s face it, &#x60;.env&#x60; files don’t cut it anymore, well, [for many reasons](https:&#x2F;&#x2F;medium.com&#x2F;@tony.infisical&#x2F;why-you-should-stop-using-env-files-in-node-js-f62fffecf5a3).

In this article, I discuss the optimal way to manage environment variables for your Node application with [Infisical](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical) at scale.

## What is Infisical?

[Infisical](https:&#x2F;&#x2F;infisical.com&#x2F;), an open-source, end-to-end encrypted secret management platform that you can store environment variables with. It’s fully self-hostable on your own infrastructure, [well-documented](https:&#x2F;&#x2F;infisical.com&#x2F;docs&#x2F;documentation&#x2F;getting-started&#x2F;introduction), and insanely beautiful.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x436,s3Z9dk0rU-eZ8vxPiaQ02QrxNuekyIwqiPQa2v6Q4urA&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1050&#x2F;1*9-Em5HxRmd--2ORMyC_7KQ.png)

Infisical

Its [Node SDK](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical-node) lets you fetch back environment variables at runtime whether it be in local development or production.

## Getting started

Before we can fetch environment variables back into your Node application, you need to add them to a project in [Infisical Cloud](https:&#x2F;&#x2F;app.infisical.com&#x2F;) or in a [self-hosted instance of Infisical](https:&#x2F;&#x2F;infisical.com&#x2F;docs&#x2F;self-hosting&#x2F;overview).

Okay, let’s get started.

First, install the &#x60;infisical-node&#x60; package in your project:

$ npm install infisical-node --save

Next, import the SDK and create a client instance with your [Infisical Token](https:&#x2F;&#x2F;infisical.com&#x2F;docs&#x2F;documentation&#x2F;platform&#x2F;token):

import InfisicalClient from &quot;infisical-node&quot;;

const client &#x3D; new InfisicalClient({  
  token: &quot;your_infisical_token&quot;  
});

To ensure optimal performance, I’d recommend creating a single instance of the Infisical client and exporting it to be used across your entire app. The reason is because the [Node SDK](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical-node) caches every secret and updates it periodically, reducing excessive calls; this built-in caching makes syncing environment variables seamless at scale.

I’d also recommend storing the Infisical Token in a &#x60;.env&#x60; file in local development or as the only environment variable in production. This way, you don’t have to hardcode it into your application and can use it to fetch the rest of your environment variables.

Now you can use the client to fetch secrets for your application on demand:

app.get(&quot;&#x2F;&quot;, async (req, res) &#x3D;&gt; {  
  const name &#x3D; await client.getSecret(&quot;NAME&quot;);  
  res.send(&#x60;Hello! My name is: ${name.secretValue}&#x60;);  
});

That’s it!

Now whenever your application needs an environment variable, it can request it from [Infisical](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical) on demand. You’re now able to view all the environment variables for your Node application from one central place and avoid any missing environment variables.

I’d recommend reading into the [documentation](https:&#x2F;&#x2F;infisical.com&#x2F;docs&#x2F;documentation&#x2F;getting-started&#x2F;introduction) more to learn more about how to manage environment variables effectively.

## But, you’re still using a .env file…

One question came up when I first posted this article being: “If the Infisical Token used to fetch other environment variables is stored in a &#x60;.env&#x60; file, then doesn’t that defeat the purpose of the tool?”

The answer is **no**.

As mentioned, a big point of using the recommended approach is to keep your environment variables in sync across your team. Oftentimes, new environment variables get introduced to a codebase and &#x60;.env&#x60; files don’t get updated across the team; as a result, applications crash. The issue compounds when your infrastructure gets big and a problem known as “secret sprawl” emerges. As such, [Infisical](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical) provides you the ability to centralize your environment variables so you can update them in one place and have them delivered back to your team and infrastructure from development to production. This is different from what a lot of people do which is directly store dozens of environment variables in &#x60;.env&#x60; files.

Lastly, from a security perspective, leaking a revokable token is much better than leaking a dozen set of raw environment variables; you avoid leaving any direct traces in source control.

## Conclusion

Infisical is an awesome platform to streamline environment variables for you and your team. Its [open-source](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical) and has a handy [Node SDK](https:&#x2F;&#x2F;github.com&#x2F;Infisical&#x2F;infisical-node) that can be used to fetch environment variables back to your Node applications on demand.