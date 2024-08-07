---
id: 0cd122b6-325e-4f0d-a477-98b90e22c292
---

# React 19 RC – React
#Omnivore

[Read on Omnivore](https://omnivore.app/me/https-react-dev-blog-2024-04-25-react-19-190f55cfaf1)
[Read Original](https://react.dev/blog/2024/04/25/react-19)


April 25, 2024 by [The React Team](https:&#x2F;&#x2F;react.dev&#x2F;community&#x2F;team)

---

React 19 RC is now available on npm!

In our [React 19 RC Upgrade Guide](https:&#x2F;&#x2F;react.dev&#x2F;blog&#x2F;2024&#x2F;04&#x2F;25&#x2F;react-19-upgrade-guide), we shared step-by-step instructions for upgrading your app to React 19\. In this post, we’ll give an overview of the new features in React 19, and how you can adopt them.

* [What’s new in React 19](#whats-new-in-react-19)
* [Improvements in React 19](#improvements-in-react-19)
* [How to upgrade](#how-to-upgrade)

For a list of breaking changes, see the [Upgrade Guide](https:&#x2F;&#x2F;react.dev&#x2F;blog&#x2F;2024&#x2F;04&#x2F;25&#x2F;react-19-upgrade-guide).

---

## What’s new in React 19 [](#whats-new-in-react-19 &quot;Link for What’s new in React 19 &quot;)

### Actions [](#actions &quot;Link for Actions &quot;)

A common use case in React apps is to perform a data mutation and then update state in response. For example, when a user submits a form to change their name, you will make an API request, and then handle the response. In the past, you would need to handle pending states, errors, optimistic updates, and sequential requests manually.

For example, you could handle the pending and error state in &#x60;useState&#x60;:

&#x60;&#x60;&#x60;javascript

&#x2F;&#x2F; Before Actions


function UpdateName({}) {


const [name, setName] &#x3D; useState(&quot;&quot;);


const [error, setError] &#x3D; useState(null);


const [isPending, setIsPending] &#x3D; useState(false);


const handleSubmit &#x3D; async () &#x3D;&gt; {


setIsPending(true);


const error &#x3D; await updateName(name);


setIsPending(false);


if (error) {


setError(error);


return;


} 


redirect(&quot;&#x2F;path&quot;);


};


return (


&lt;div&gt;


&lt;input value&#x3D;{name} onChange&#x3D;{(event) &#x3D;&gt; setName(event.target.value)} &#x2F;&gt;


&lt;button onClick&#x3D;{handleSubmit} disabled&#x3D;{isPending}&gt;


        Update


&lt;&#x2F;button&gt;


{error &amp;&amp; &lt;p&gt;{error}&lt;&#x2F;p&gt;}


&lt;&#x2F;div&gt;


);


}

&#x60;&#x60;&#x60;

In React 19, we’re adding support for using async functions in transitions to handle pending states, errors, forms, and optimistic updates automatically.

For example, you can use &#x60;useTransition&#x60; to handle the pending state for you:

&#x60;&#x60;&#x60;javascript

&#x2F;&#x2F; Using pending state from Actions


function UpdateName({}) {


const [name, setName] &#x3D; useState(&quot;&quot;);


const [error, setError] &#x3D; useState(null);


const [isPending, startTransition] &#x3D; useTransition();


const handleSubmit &#x3D; () &#x3D;&gt; {


startTransition(async () &#x3D;&gt; {


const error &#x3D; await updateName(name);


if (error) {


setError(error);


return;


} 


redirect(&quot;&#x2F;path&quot;);


})


};


return (


&lt;div&gt;


&lt;input value&#x3D;{name} onChange&#x3D;{(event) &#x3D;&gt; setName(event.target.value)} &#x2F;&gt;


&lt;button onClick&#x3D;{handleSubmit} disabled&#x3D;{isPending}&gt;


        Update


&lt;&#x2F;button&gt;


{error &amp;&amp; &lt;p&gt;{error}&lt;&#x2F;p&gt;}


&lt;&#x2F;div&gt;


);


}

&#x60;&#x60;&#x60;

The async transition will immediately set the &#x60;isPending&#x60; state to true, make the async request(s), and switch &#x60;isPending&#x60; to false after any transitions. This allows you to keep the current UI responsive and interactive while the data is changing.

### Note

#### By convention, functions that use async transitions are called “Actions”. [](#by-convention-functions-that-use-async-transitions-are-called-actions &quot;Link for By convention, functions that use async transitions are called “Actions”. &quot;)

Actions automatically manage submitting data for you:

* **Pending state**: Actions provide a pending state that starts at the beginning of a request and automatically resets when the final state update is committed.
* **Optimistic updates**: Actions support the new [useOptimistic](#new-hook-optimistic-updates) hook so you can show users instant feedback while the requests are submitting.
* **Error handling**: Actions provide error handling so you can display Error Boundaries when a request fails, and revert optimistic updates to their original value automatically.
* **Forms**: &#x60;&lt;form&gt;&#x60; elements now support passing functions to the &#x60;action&#x60; and &#x60;formAction&#x60; props. Passing functions to the &#x60;action&#x60; props use Actions by default and reset the form automatically after submission.

Building on top of Actions, React 19 introduces [useOptimistic](#new-hook-optimistic-updates) to manage optimistic updates, and a new hook [React.useActionState](#new-hook-useactionstate) to handle common cases for Actions. In &#x60;react-dom&#x60; we’re adding [&lt;form&gt; Actions](#form-actions) to manage forms automatically and [useFormStatus](#new-hook-useformstatus) to support the common cases for Actions in forms.

In React 19, the above example can be simplified to:

&#x60;&#x60;&#x60;javascript

&#x2F;&#x2F; Using &lt;form&gt; Actions and useActionState


function ChangeName({ name, setName }) {


const [error, submitAction, isPending] &#x3D; useActionState(


async (previousState, formData) &#x3D;&gt; {


const error &#x3D; await updateName(formData.get(&quot;name&quot;));


if (error) {


return error;


}


redirect(&quot;&#x2F;path&quot;);


return null;


},


null,


);


return (


&lt;form action&#x3D;{submitAction}&gt;


&lt;input type&#x3D;&quot;text&quot; name&#x3D;&quot;name&quot; &#x2F;&gt;


&lt;button type&#x3D;&quot;submit&quot; disabled&#x3D;{isPending}&gt;Update&lt;&#x2F;button&gt;


{error &amp;&amp; &lt;p&gt;{error}&lt;&#x2F;p&gt;}


&lt;&#x2F;form&gt;


);


}

&#x60;&#x60;&#x60;

In the next section, we’ll break down each of the new Action features in React 19.

### New hook: &#x60;useActionState&#x60; [](#new-hook-useactionstate &quot;Link for this heading&quot;)

To make the common cases easier for Actions, we’ve added a new hook called &#x60;useActionState&#x60;:

&#x60;&#x60;&#x60;aspectj

const [error, submitAction, isPending] &#x3D; useActionState(


async (previousState, newName) &#x3D;&gt; {


const error &#x3D; await updateName(newName);


if (error) {


&#x2F;&#x2F; You can return any result of the action.


&#x2F;&#x2F; Here, we return only the error.


return error;


}


&#x2F;&#x2F; handle success


return null;


},


null,


);

&#x60;&#x60;&#x60;

&#x60;useActionState&#x60; accepts a function (the “Action”), and returns a wrapped Action to call. This works because Actions compose. When the wrapped Action is called, &#x60;useActionState&#x60; will return the last result of the Action as &#x60;data&#x60;, and the pending state of the Action as &#x60;pending&#x60;.

### Note

&#x60;React.useActionState&#x60; was previously called &#x60;ReactDOM.useFormState&#x60; in the Canary releases, but we’ve renamed it and deprecated &#x60;useFormState&#x60;.

See [#28491](https:&#x2F;&#x2F;github.com&#x2F;facebook&#x2F;react&#x2F;pull&#x2F;28491) for more info.

For more information, see the docs for [useActionState](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react&#x2F;useActionState).

### React DOM: &#x60;&lt;form&gt;&#x60; Actions [](#form-actions &quot;Link for this heading&quot;)

Actions are also integrated with React 19’s new &#x60;&lt;form&gt;&#x60; features for &#x60;react-dom&#x60;. We’ve added support for passing functions as the &#x60;action&#x60; and &#x60;formAction&#x60; props of &#x60;&lt;form&gt;&#x60;, &#x60;&lt;input&gt;&#x60;, and &#x60;&lt;button&gt;&#x60; elements to automatically submit forms with Actions:

&#x60;&#x60;&#x60;xml

&lt;form action&#x3D;{actionFunction}&gt;

&#x60;&#x60;&#x60;

When a &#x60;&lt;form&gt;&#x60; Action succeeds, React will automatically reset the form for uncontrolled components. If you need to reset the &#x60;&lt;form&gt;&#x60; manually, you can call the new &#x60;requestFormReset&#x60; React DOM API.

For more information, see the &#x60;react-dom&#x60; docs for [&lt;form&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;form), [&lt;input&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;input), and &#x60;&lt;button&gt;&#x60;.

### React DOM: New hook: &#x60;useFormStatus&#x60; [](#new-hook-useformstatus &quot;Link for this heading&quot;)

In design systems, it’s common to write design components that need access to information about the &#x60;&lt;form&gt;&#x60; they’re in, without drilling props down to the component. This can be done via Context, but to make the common case easier, we’ve added a new hook &#x60;useFormStatus&#x60;:

&#x60;&#x60;&#x60;javascript

import {useFormStatus} from &#39;react-dom&#39;;


function DesignButton() {


const {pending} &#x3D; useFormStatus();


return &lt;button type&#x3D;&quot;submit&quot; disabled&#x3D;{pending} &#x2F;&gt;


}

&#x60;&#x60;&#x60;

&#x60;useFormStatus&#x60; reads the status of the parent &#x60;&lt;form&gt;&#x60; as if the form was a Context provider.

For more information, see the &#x60;react-dom&#x60; docs for [useFormStatus](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;hooks&#x2F;useFormStatus).

### New hook: &#x60;useOptimistic&#x60; [](#new-hook-optimistic-updates &quot;Link for this heading&quot;)

Another common UI pattern when performing a data mutation is to show the final state optimistically while the async request is underway. In React 19, we’re adding a new hook called &#x60;useOptimistic&#x60; to make this easier:

&#x60;&#x60;&#x60;javascript

function ChangeName({currentName, onUpdateName}) {


const [optimisticName, setOptimisticName] &#x3D; useOptimistic(currentName);


const submitAction &#x3D; async formData &#x3D;&gt; {


const newName &#x3D; formData.get(&quot;name&quot;);


setOptimisticName(newName);


const updatedName &#x3D; await updateName(newName);


onUpdateName(updatedName);


};


return (


&lt;form action&#x3D;{submitAction}&gt;


&lt;p&gt;Your name is: {optimisticName}&lt;&#x2F;p&gt;


&lt;p&gt;


&lt;label&gt;Change Name:&lt;&#x2F;label&gt;


&lt;input


type&#x3D;&quot;text&quot;


name&#x3D;&quot;name&quot;


disabled&#x3D;{currentName !&#x3D;&#x3D; optimisticName}


&#x2F;&gt;


&lt;&#x2F;p&gt;


&lt;&#x2F;form&gt;


);


}

&#x60;&#x60;&#x60;

The &#x60;useOptimistic&#x60; hook will immediately render the &#x60;optimisticName&#x60; while the &#x60;updateName&#x60; request is in progress. When the update finishes or errors, React will automatically switch back to the &#x60;currentName&#x60; value.

For more information, see the docs for [useOptimistic](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react&#x2F;useOptimistic).

### New API: &#x60;use&#x60; [](#new-feature-use &quot;Link for this heading&quot;)

In React 19 we’re introducing a new API to read resources in render: &#x60;use&#x60;.

For example, you can read a promise with &#x60;use&#x60;, and React will Suspend until the promise resolves:

&#x60;&#x60;&#x60;javascript

import {use} from &#39;react&#39;;


function Comments({commentsPromise}) {


&#x2F;&#x2F; &#x60;use&#x60; will suspend until the promise resolves.


const comments &#x3D; use(commentsPromise);


return comments.map(comment &#x3D;&gt; &lt;p key&#x3D;{comment.id}&gt;{comment}&lt;&#x2F;p&gt;);


}


function Page({commentsPromise}) {


&#x2F;&#x2F; When &#x60;use&#x60; suspends in Comments,


&#x2F;&#x2F; this Suspense boundary will be shown.


return (


&lt;Suspense fallback&#x3D;{&lt;div&gt;Loading...&lt;&#x2F;div&gt;}&gt;


&lt;Comments commentsPromise&#x3D;{commentsPromise} &#x2F;&gt;


&lt;&#x2F;Suspense&gt;


)


}

&#x60;&#x60;&#x60;

### Note

If you try to pass a promise created in render to &#x60;use&#x60;, React will warn:

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

To fix, you need to pass a promise from a suspense powered library or framework that supports caching for promises. In the future we plan to ship features to make it easier to cache promises in render.

You can also read context with &#x60;use&#x60;, allowing you to read Context conditionally such as after early returns:

&#x60;&#x60;&#x60;javascript

import {use} from &#39;react&#39;;


import ThemeContext from &#39;.&#x2F;ThemeContext&#39;


function Heading({children}) {


if (children &#x3D;&#x3D; null) {


return null;


}


&#x2F;&#x2F; This would not work with useContext


&#x2F;&#x2F; because of the early return.


const theme &#x3D; use(ThemeContext);


return (


&lt;h1 style&#x3D;{{color: theme.color}}&gt;


{children}


&lt;&#x2F;h1&gt;


);


}

&#x60;&#x60;&#x60;

The &#x60;use&#x60; API can only be called in render, similar to hooks. Unlike hooks, &#x60;use&#x60; can be called conditionally. In the future we plan to support more ways to consume resources in render with &#x60;use&#x60;.

For more information, see the docs for [use](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react&#x2F;use).

## React Server Components [](#react-server-components &quot;Link for React Server Components &quot;)

### Server Components [](#server-components &quot;Link for Server Components &quot;)

Server Components are a new option that allows rendering components ahead of time, before bundling, in an environment separate from your client application or SSR server. This separate environment is the “server” in React Server Components. Server Components can run once at build time on your CI server, or they can be run for each request using a web server.

React 19 includes all of the React Server Components features included from the Canary channel. This means libraries that ship with Server Components can now target React 19 as a peer dependency with a &#x60;react-server&#x60; [export condition](https:&#x2F;&#x2F;github.com&#x2F;reactjs&#x2F;rfcs&#x2F;blob&#x2F;main&#x2F;text&#x2F;0227-server-module-conventions.md#react-server-conditional-exports) for use in frameworks that support the [Full-stack React Architecture](https:&#x2F;&#x2F;react.dev&#x2F;learn&#x2F;start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).

### Note

#### How do I build support for Server Components? [](#how-do-i-build-support-for-server-components &quot;Link for How do I build support for Server Components? &quot;)

While React Server Components in React 19 are stable and will not break between major versions, the underlying APIs used to implement a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.

To support React Server Components as a bundler or framework, we recommend pinning to a specific React version, or using the Canary release. We will continue working with bundlers and frameworks to stabilize the APIs used to implement React Server Components in the future.

For more, see the docs for [React Server Components](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;rsc&#x2F;server-components).

### Server Actions [](#server-actions &quot;Link for Server Actions &quot;)

Server Actions allow Client Components to call async functions executed on the server.

When a Server Action is defined with the &#x60;&quot;use server&quot;&#x60; directive, your framework will automatically create a reference to the server function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.

### Note

#### There is no directive for Server Components. [](#there-is-no-directive-for-server-components &quot;Link for There is no directive for Server Components. &quot;)

A common misunderstanding is that Server Components are denoted by &#x60;&quot;use server&quot;&#x60;, but there is no directive for Server Components. The &#x60;&quot;use server&quot;&#x60; directive is used for Server Actions.

For more info, see the docs for [Directives](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;rsc&#x2F;directives).

Server Actions can be created in Server Components and passed as props to Client Components, or they can be imported and used in Client Components.

For more, see the docs for [React Server Actions](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;rsc&#x2F;server-actions).

## Improvements in React 19 [](#improvements-in-react-19 &quot;Link for Improvements in React 19 &quot;)

### &#x60;ref&#x60; as a prop [](#ref-as-a-prop &quot;Link for this heading&quot;)

Starting in React 19, you can now access &#x60;ref&#x60; as a prop for function components:

&#x60;&#x60;&#x60;reasonml

function MyInput({placeholder, ref}) {


return &lt;input placeholder&#x3D;{placeholder} ref&#x3D;{ref} &#x2F;&gt;


}


&#x2F;&#x2F;...


&lt;MyInput ref&#x3D;{ref} &#x2F;&gt;

&#x60;&#x60;&#x60;

New function components will no longer need &#x60;forwardRef&#x60;, and we will be publishing a codemod to automatically update your components to use the new &#x60;ref&#x60; prop. In future versions we will deprecate and remove &#x60;forwardRef&#x60;.

### Note

&#x60;refs&#x60; passed to classes are not passed as props since they reference the component instance.

### Diffs for hydration errors [](#diffs-for-hydration-errors &quot;Link for Diffs for hydration errors &quot;)

We also improved error reporting for hydration errors in &#x60;react-dom&#x60;. For example, instead of logging multiple errors in DEV without any information about the mismatch:

Warning: Text content did not match. Server: “Server” Client: “Client”

at span

at App

Warning: An error occurred during hydration. The server HTML was replaced with client content in &lt;div&gt;.

Warning: Text content did not match. Server: “Server” Client: “Client”

at span

at App

Warning: An error occurred during hydration. The server HTML was replaced with client content in &lt;div&gt;.

Uncaught Error: Text content does not match server-rendered HTML.

at checkForUnmatchedText

…

We now log a single message with a diff of the mismatch:

Uncaught Error: Hydration failed because the server rendered HTML didn’t match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:

\- A server&#x2F;client branch &#x60;if (typeof window !&#x3D;&#x3D; &#39;undefined&#39;)&#x60;. - Variable input such as &#x60;Date.now()&#x60; or &#x60;Math.random()&#x60; which changes each time it’s called. - Date formatting in a user’s locale which doesn’t match the server. - External changing data without sending a snapshot of it along with the HTML. - Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

&lt;https:&#x2F;&#x2F;react.dev&#x2F;link&#x2F;hydration-mismatch&gt;

&lt;App&gt;

&lt;span&gt;

\+ 

Client

\- 

Server

at throwOnHydrationMismatch

…

### &#x60;&lt;Context&gt;&#x60; as a provider [](#context-as-a-provider &quot;Link for this heading&quot;)

In React 19, you can render &#x60;&lt;Context&gt;&#x60; as a provider instead of &#x60;&lt;Context.Provider&gt;&#x60;:

&#x60;&#x60;&#x60;javascript

const ThemeContext &#x3D; createContext(&#39;&#39;);


function App({children}) {


return (


&lt;ThemeContext value&#x3D;&quot;dark&quot;&gt;


{children}


&lt;&#x2F;ThemeContext&gt;


);  


}

&#x60;&#x60;&#x60;

New Context providers can use &#x60;&lt;Context&gt;&#x60; and we will be publishing a codemod to convert existing providers. In future versions we will deprecate &#x60;&lt;Context.Provider&gt;&#x60;.

### Cleanup functions for refs [](#cleanup-functions-for-refs &quot;Link for Cleanup functions for refs &quot;)

We now support returning a cleanup function from &#x60;ref&#x60; callbacks:

&#x60;&#x60;&#x60;pgsql

&lt;input


ref&#x3D;{(ref) &#x3D;&gt; {


&#x2F;&#x2F; ref created


&#x2F;&#x2F; NEW: return a cleanup function to reset


&#x2F;&#x2F; the ref when element is removed from DOM.


return () &#x3D;&gt; {


&#x2F;&#x2F; ref cleanup


};


}}


&#x2F;&gt;

&#x60;&#x60;&#x60;

When the component unmounts, React will call the cleanup function returned from the &#x60;ref&#x60; callback. This works for DOM refs, refs to class components, and &#x60;useImperativeHandle&#x60;.

### Note

Previously, React would call &#x60;ref&#x60; functions with &#x60;null&#x60; when unmounting the component. If your &#x60;ref&#x60; returns a cleanup function, React will now skip this step.

In future versions, we will deprecate calling refs with &#x60;null&#x60; when unmounting components.

Due to the introduction of ref cleanup functions, returning anything else from a &#x60;ref&#x60; callback will now be rejected by TypeScript. The fix is usually to stop using implicit returns, for example:

&#x60;&#x60;&#x60;pgsql

- &lt;div ref&#x3D;{current &#x3D;&gt; (instance &#x3D; current)} &#x2F;&gt;


+ &lt;div ref&#x3D;{current &#x3D;&gt; {instance &#x3D; current}} &#x2F;&gt;

&#x60;&#x60;&#x60;

The original code returned the instance of the &#x60;HTMLDivElement&#x60; and TypeScript wouldn’t know if this was _supposed_ to be a cleanup function or if you didn’t want to return a cleanup function.

You can codemod this pattern with [no-implicit\-ref-callback-return](https:&#x2F;&#x2F;github.com&#x2F;eps1lon&#x2F;types-react-codemod&#x2F;#no-implicit-ref-callback-return).

### &#x60;useDeferredValue&#x60; initial value [](#use-deferred-value-initial-value &quot;Link for this heading&quot;)

We’ve added an &#x60;initialValue&#x60; option to &#x60;useDeferredValue&#x60;:

&#x60;&#x60;&#x60;javascript

function Search({deferredValue}) {


&#x2F;&#x2F; On initial render the value is &#39;&#39;.


&#x2F;&#x2F; Then a re-render is scheduled with the deferredValue.


const value &#x3D; useDeferredValue(deferredValue, &#39;&#39;);


return (


&lt;Results query&#x3D;{value} &#x2F;&gt;


);


}

&#x60;&#x60;&#x60;

When initialValue is provided, &#x60;useDeferredValue&#x60; will return it as &#x60;value&#x60; for the initial render of the component, and schedules a re-render in the background with the deferredValue returned.

For more, see [useDeferredValue](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react&#x2F;useDeferredValue).

### Support for Document Metadata [](#support-for-metadata-tags &quot;Link for Support for Document Metadata &quot;)

In HTML, document metadata tags like &#x60;&lt;title&gt;&#x60;, &#x60;&lt;link&gt;&#x60;, and &#x60;&lt;meta&gt;&#x60; are reserved for placement in the &#x60;&lt;head&gt;&#x60; section of the document. In React, the component that decides what metadata is appropriate for the app may be very far from the place where you render the &#x60;&lt;head&gt;&#x60; or React does not render the &#x60;&lt;head&gt;&#x60; at all. In the past, these elements would need to be inserted manually in an effect, or by libraries like [react-helmet](https:&#x2F;&#x2F;github.com&#x2F;nfl&#x2F;react-helmet), and required careful handling when server rendering a React application.

In React 19, we’re adding support for rendering document metadata tags in components natively:

&#x60;&#x60;&#x60;dust

function BlogPost({post}) {


return (


&lt;article&gt;


&lt;h1&gt;{post.title}&lt;&#x2F;h1&gt;


&lt;title&gt;{post.title}&lt;&#x2F;title&gt;


&lt;meta name&#x3D;&quot;author&quot; content&#x3D;&quot;Josh&quot; &#x2F;&gt;


&lt;link rel&#x3D;&quot;author&quot; href&#x3D;&quot;https:&#x2F;&#x2F;twitter.com&#x2F;joshcstory&#x2F;&quot; &#x2F;&gt;


&lt;meta name&#x3D;&quot;keywords&quot; content&#x3D;{post.keywords} &#x2F;&gt;


&lt;p&gt;


        Eee equals em-see-squared...


&lt;&#x2F;p&gt;


&lt;&#x2F;article&gt;


);


}

&#x60;&#x60;&#x60;

When React renders this component, it will see the &#x60;&lt;title&gt;&#x60; &#x60;&lt;link&gt;&#x60; and &#x60;&lt;meta&gt;&#x60; tags, and automatically hoist them to the &#x60;&lt;head&gt;&#x60; section of document. By supporting these metadata tags natively, we’re able to ensure they work with client-only apps, streaming SSR, and Server Components.

### Note

#### You may still want a Metadata library [](#you-may-still-want-a-metadata-library &quot;Link for You may still want a Metadata library &quot;)

For simple use cases, rendering Document Metadata as tags may be suitable, but libraries can offer more powerful features like overriding generic metadata with specific metadata based on the current route. These features make it easier for frameworks and libraries like [react-helmet](https:&#x2F;&#x2F;github.com&#x2F;nfl&#x2F;react-helmet) to support metadata tags, rather than replace them.

For more info, see the docs for [&lt;title&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;title), [&lt;link&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;link), and [&lt;meta&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;meta).

### Support for stylesheets [](#support-for-stylesheets &quot;Link for Support for stylesheets &quot;)

Stylesheets, both externally linked (&#x60;&lt;link rel&#x3D;&quot;stylesheet&quot; href&#x3D;&quot;...&quot;&gt;&#x60;) and inline (&#x60;&lt;style&gt;...&lt;&#x2F;style&gt;&#x60;), require careful positioning in the DOM due to style precedence rules. Building a stylesheet capability that allows for composability within components is hard, so users often end up either loading all of their styles far from the components that may depend on them, or they use a style library which encapsulates this complexity.

In React 19, we’re addressing this complexity and providing even deeper integration into Concurrent Rendering on the Client and Streaming Rendering on the Server with built in support for stylesheets. If you tell React the &#x60;precedence&#x60; of your stylesheet it will manage the insertion order of the stylesheet in the DOM and ensure that the stylesheet (if external) is loaded before revealing content that depends on those style rules.

&#x60;&#x60;&#x60;nimrod

function ComponentOne() {


return (


&lt;Suspense fallback&#x3D;&quot;loading...&quot;&gt;


&lt;link rel&#x3D;&quot;stylesheet&quot; href&#x3D;&quot;foo&quot; precedence&#x3D;&quot;default&quot; &#x2F;&gt;


&lt;link rel&#x3D;&quot;stylesheet&quot; href&#x3D;&quot;bar&quot; precedence&#x3D;&quot;high&quot; &#x2F;&gt;


&lt;article class&#x3D;&quot;foo-class bar-class&quot;&gt;


{...}


&lt;&#x2F;article&gt;


&lt;&#x2F;Suspense&gt;


)


}


function ComponentTwo() {


return (


&lt;div&gt;


&lt;p&gt;{...}&lt;&#x2F;p&gt;


&lt;link rel&#x3D;&quot;stylesheet&quot; href&#x3D;&quot;baz&quot; precedence&#x3D;&quot;default&quot; &#x2F;&gt;  &lt;-- will be inserted between foo &amp; bar


&lt;&#x2F;div&gt;


  )


}

&#x60;&#x60;&#x60;

During Server Side Rendering React will include the stylesheet in the &#x60;&lt;head&gt;&#x60;, which ensures that the browser will not paint until it has loaded. If the stylesheet is discovered late after we’ve already started streaming, React will ensure that the stylesheet is inserted into the &#x60;&lt;head&gt;&#x60; on the client before revealing the content of a Suspense boundary that depends on that stylesheet.

During Client Side Rendering React will wait for newly rendered stylesheets to load before committing the render. If you render this component from multiple places within your application React will only include the stylesheet once in the document:

&#x60;&#x60;&#x60;actionscript

function App() {


return &lt;&gt;


&lt;ComponentOne &#x2F;&gt;


    ...


&lt;ComponentOne &#x2F;&gt; &#x2F;&#x2F; won&#39;t lead to a duplicate stylesheet link in the DOM


&lt;&#x2F;&gt;


}

&#x60;&#x60;&#x60;

For users accustomed to loading stylesheets manually this is an opportunity to locate those stylesheets alongside the components that depend on them allowing for better local reasoning and an easier time ensuring you only load the stylesheets that you actually depend on.

Style libraries and style integrations with bundlers can also adopt this new capability so even if you don’t directly render your own stylesheets, you can still benefit as your tools are upgraded to use this feature.

For more details, read the docs for [&lt;link&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;link) and [&lt;style\&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;style).

### Support for async scripts [](#support-for-async-scripts &quot;Link for Support for async scripts &quot;)

In HTML normal scripts (&#x60;&lt;script src&#x3D;&quot;...&quot;&gt;&#x60;) and deferred scripts (&#x60;&lt;script defer&#x3D;&quot;&quot; src&#x3D;&quot;...&quot;&gt;&#x60;) load in document order which makes rendering these kinds of scripts deep within your component tree challenging. Async scripts (&#x60;&lt;script async&#x3D;&quot;&quot; src&#x3D;&quot;...&quot;&gt;&#x60;) however will load in arbitrary order.

In React 19 we’ve included better support for async scripts by allowing you to render them anywhere in your component tree, inside the components that actually depend on the script, without having to manage relocating and deduplicating script instances.

&#x60;&#x60;&#x60;xquery

function MyComponent() {


return (


&lt;div&gt;


&lt;script async&#x3D;{true} src&#x3D;&quot;...&quot; &#x2F;&gt;


      Hello World


&lt;&#x2F;div&gt;


)


}


function App() {


&lt;html&gt;


&lt;body&gt;


&lt;MyComponent&gt;


      ...


&lt;MyComponent&gt; &#x2F;&#x2F; won&#39;t lead to duplicate script in the DOM


&lt;&#x2F;body&gt;


&lt;&#x2F;html&gt;


}

&#x60;&#x60;&#x60;

In all rendering environments, async scripts will be deduplicated so that React will only load and execute the script once even if it is rendered by multiple different components.

In Server Side Rendering, async scripts will be included in the &#x60;&lt;head&gt;&#x60; and prioritized behind more critical resources that block paint such as stylesheets, fonts, and image preloads.

For more details, read the docs for [&lt;script\&gt;](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;components&#x2F;script).

### Support for preloading resources [](#support-for-preloading-resources &quot;Link for Support for preloading resources &quot;)

During initial document load and on client side updates, telling the Browser about resources that it will likely need to load as early as possible can have a dramatic effect on page performance.

React 19 includes a number of new APIs for loading and preloading Browser resources to make it as easy as possible to build great experiences that aren’t held back by inefficient resource loading.

&#x60;&#x60;&#x60;stylus

import { prefetchDNS, preconnect, preload, preinit } from &#39;react-dom&#39;


function MyComponent() {


preinit(&#39;https:&#x2F;&#x2F;...&#x2F;path&#x2F;to&#x2F;some&#x2F;script.js&#39;, {as: &#39;script&#39; }) &#x2F;&#x2F; loads and executes this script eagerly


preload(&#39;https:&#x2F;&#x2F;...&#x2F;path&#x2F;to&#x2F;font.woff&#39;, { as: &#39;font&#39; }) &#x2F;&#x2F; preloads this font


preload(&#39;https:&#x2F;&#x2F;...&#x2F;path&#x2F;to&#x2F;stylesheet.css&#39;, { as: &#39;style&#39; }) &#x2F;&#x2F; preloads this stylesheet


prefetchDNS(&#39;https:&#x2F;&#x2F;...&#39;) &#x2F;&#x2F; when you may not actually request anything from this host


preconnect(&#39;https:&#x2F;&#x2F;...&#39;) &#x2F;&#x2F; when you will request something but aren&#39;t sure what


}

&#x60;&#x60;&#x60;

&#x60;&#x60;&#x60;xml

&lt;!-- the above would result in the following DOM&#x2F;HTML --&gt;


&lt;html&gt;


&lt;head&gt;


&lt;!-- links&#x2F;scripts are prioritized by their utility to early loading, not call order --&gt;


&lt;link rel&#x3D;&quot;prefetch-dns&quot; href&#x3D;&quot;https:&#x2F;&#x2F;...&quot;&gt;


&lt;link rel&#x3D;&quot;preconnect&quot; href&#x3D;&quot;https:&#x2F;&#x2F;...&quot;&gt;


&lt;link rel&#x3D;&quot;preload&quot; as&#x3D;&quot;font&quot; href&#x3D;&quot;https:&#x2F;&#x2F;...&#x2F;path&#x2F;to&#x2F;font.woff&quot;&gt;


&lt;link rel&#x3D;&quot;preload&quot; as&#x3D;&quot;style&quot; href&#x3D;&quot;https:&#x2F;&#x2F;...&#x2F;path&#x2F;to&#x2F;stylesheet.css&quot;&gt;


&lt;script async&#x3D;&quot;&quot; src&#x3D;&quot;https:&#x2F;&#x2F;...&#x2F;path&#x2F;to&#x2F;some&#x2F;script.js&quot;&gt;&lt;&#x2F;script&gt;


&lt;&#x2F;head&gt;


&lt;body&gt;


    ...


&lt;&#x2F;body&gt;


&lt;&#x2F;html&gt;

&#x60;&#x60;&#x60;

These APIs can be used to optimize initial page loads by moving discovery of additional resources like fonts out of stylesheet loading. They can also make client updates faster by prefetching a list of resources used by an anticipated navigation and then eagerly preloading those resources on click or even on hover.

For more details see [Resource Preloading APIs](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom#resource-preloading-apis).

### Compatibility with third-party scripts and extensions [](#compatibility-with-third-party-scripts-and-extensions &quot;Link for Compatibility with third-party scripts and extensions &quot;)

We’ve improved hydration to account for third-party scripts and browser extensions.

When hydrating, if an element that renders on the client doesn’t match the element found in the HTML from the server, React will force a client re-render to fix up the content. Previously, if an element was inserted by third-party scripts or browser extensions, it would trigger a mismatch error and client render.

In React 19, unexpected tags in the &#x60;&lt;head&gt;&#x60; and &#x60;&lt;body&gt;&#x60; will be skipped over, avoiding the mismatch errors. If React needs to re-render the entire document due to an unrelated hydration mismatch, it will leave in place stylesheets inserted by third-party scripts and browser extensions.

### Better error reporting [](#error-handling &quot;Link for Better error reporting &quot;)

We improved error handling in React 19 to remove duplication and provide options for handling caught and uncaught errors. For example, when there’s an error in render caught by an Error Boundary, previously React would throw the error twice (once for the original error, then again after failing to automatically recover), and then call &#x60;console.error&#x60; with info about where the error occurred.

This resulted in three errors for every caught error:

Uncaught Error: hit

at Throws

at renderWithHooks

…

Uncaught Error: hit &lt;-- Duplicate

at Throws

at renderWithHooks

…

The above error occurred in the Throws component:

at Throws

at ErrorBoundary

at App

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

In React 19, we log a single error with all the error information included:

Error: hit

at Throws

at renderWithHooks

…

The above error occurred in the Throws component:

at Throws

at ErrorBoundary

at App

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

at ErrorBoundary

at App

Additionally, we’ve added two new root options to complement &#x60;onRecoverableError&#x60;:

* &#x60;onCaughtError&#x60;: called when React catches an error in an Error Boundary.
* &#x60;onUncaughtError&#x60;: called when an error is thrown and not caught by an Error Boundary.
* &#x60;onRecoverableError&#x60;: called when an error is thrown and automatically recovered.

For more info and examples, see the docs for [createRoot](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;client&#x2F;createRoot) and [hydrateRoot](https:&#x2F;&#x2F;react.dev&#x2F;reference&#x2F;react-dom&#x2F;client&#x2F;hydrateRoot).

### Support for Custom Elements [](#support-for-custom-elements &quot;Link for Support for Custom Elements &quot;)

React 19 adds full support for custom elements and passes all tests on [Custom Elements Everywhere](https:&#x2F;&#x2F;custom-elements-everywhere.com&#x2F;).

In past versions, using Custom Elements in React has been difficult because React treated unrecognized props as attributes rather than properties. In React 19, we’ve added support for properties that works on the client and during SSR with the following strategy:

* **Server Side Rendering**: props passed to a custom element will render as attributes if their type is a primitive value like &#x60;string&#x60;, &#x60;number&#x60;, or the value is &#x60;true&#x60;. Props with non-primitive types like &#x60;object&#x60;, &#x60;symbol&#x60;, &#x60;function&#x60;, or value &#x60;false&#x60; will be omitted.
* **Client Side Rendering**: props that match a property on the Custom Element instance will be assigned as properties, otherwise they will be assigned as attributes.

Thanks to [Joey Arhar](https:&#x2F;&#x2F;github.com&#x2F;josepharhar) for driving the design and implementation of Custom Element support in React.

#### How to upgrade [](#how-to-upgrade &quot;Link for How to upgrade &quot;)

See the [React 19 Upgrade Guide](https:&#x2F;&#x2F;react.dev&#x2F;blog&#x2F;2024&#x2F;04&#x2F;25&#x2F;react-19-upgrade-guide) for step-by-step instructions and a full list of breaking and notable changes.