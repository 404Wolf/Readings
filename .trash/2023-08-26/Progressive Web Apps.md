---
id: 6111861b-5868-477b-8888-0920505eea0a
---

# Progressive Web Apps
#Omnivore

[Read on Omnivore](https://omnivore.app/me/get-started-with-progressive-web-apps-microsoft-edge-development-18a32ec58e8)
[Read Original](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to)


* Article

Progressive Web Apps (PWAs) are applications that you build by using web technologies, and that can be installed and can run on all devices, from one codebase.

To learn more about what PWAs are and their benefits, see [Overview of Progressive Web Apps (PWAs)](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;).

This guide is targeted at web developers who want to learn to build PWAs. To learn more about installing and running PWAs, see [Installing a PWA](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;ux#installing-a-pwa) in _Use Progressive Web Apps in Microsoft Edge_.

In this guide, you first learn how PWAs work, then create your first simple PWA, which will be a temperature converter app, and then learn more about how to make great PWAs.

You can find the final source code of the app you will be building in this guide on the [PWA getting started demo app repository](https:&#x2F;&#x2F;github.com&#x2F;MicrosoftEdge&#x2F;Demos&#x2F;tree&#x2F;main&#x2F;pwa-getting-started).

## Prerequisites

* Install [Visual Studio Code](https:&#x2F;&#x2F;code.visualstudio.com&#x2F;) to edit your PWA source code.
* Install [Node.js](https:&#x2F;&#x2F;nodejs.org&#x2F;) to use it as your local web server.
* Working knowledge of HTML, CSS, and JavaScript is also a plus.

## The architecture of a PWA

Progressive Web Apps are written using the programming languages of the web: HTML, CSS, and JavaScript, and are distributed to your users by using web servers.

To make your app available to users, you deploy it on a web server that&#39;s accessible via HTTPS. Your server contains:

* **Back-end code**: the endpoints needed by your app, when connected to the internet, to retrieve dynamic content that may be stored in a database on your server.
* **Front-end code**: the resources needed for the app to be installed on the user&#39;s device, such as HTML, CSS, and JavaScript code.

Your back-end code can use the server-side languages of your choice such as ASP.NET, Java, Node.js, or PHP. Note, however, that server-side endpoints may not even be required depending on the app your&#39;re building. The PWA that you create in this tutorial doesn&#39;t have any server-side code, because the app exclusively runs on the device it&#39;s installed on, and doesn&#39;t need any server-side data.

Your front-end code uses HTML, CSS, JavaScript, and a JSON manifest only.

You use HTML to describe the content in your app, such as the text, images, text fields, or buttons that appear in the user interface. You then use CSS to organize the HTML content in a layout, and provide styles to elements. You use JavaScript to add user interactions to your user interface. And finally, you use a JSON manifest file that describes your application to the host operating system.

Note that although your front-end code runs by using the device&#39;s web browser, the browser user interface may not be visible as your app can choose to run in a standalone window.

On top of the user interface code, you also use JavaScript to make your application faster, more reliable, and network-independent by using a service worker file. Finally, your front-end code also contains a JSON manifest file that describes your application to the host operating system.

The following diagram shows the high-level architecture of a PWA. The web server is on one side of the PWA, and the device is on the other side. The device contains the front-end code, including HTML, CSS, JavaScript, the service worker, and the manifest:

![Architecture diagram of a PWA](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sQsH0Wpqh5B_eEi9rawlaFMaQvm-4E0R3re5TfndfGp4&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;pwa-architecture.png)

## Step 1 - Start a web server

PWAs are distributed to users by using web servers. Once your app is ready, deploy it to the web by using a web hosting provider. You can then update your app simply by deploying the new version to your web server again.

To start developing your PWA, you can use a local web server instead. To start a local server:

1. Create a new folder on your computer where the web server will run.  
You can do this by opening a command prompt and typing:  
&#x60;&#x60;&#x60;dos  
cd path&#x2F;to&#x2F;your&#x2F;dev&#x2F;folder  
mkdir MySamplePWA  
cd MySamplePWA  
&#x60;&#x60;&#x60;
2. Start the server by using the &#x60;http-server&#x60; Node.js library:  
&#x60;&#x60;&#x60;axapta  
npx http-server  
&#x60;&#x60;&#x60;

You now have a simple local web server running at &#x60;http:&#x2F;&#x2F;localhost:8080&#x60;.

Key parts of the Progressive Web Apps platform, such as Service Workers, require using HTTPS. When your PWA goes live, you must publish it to an HTTPS URL. Many hosts now offer HTTPS by default, but if your host doesn&#39;t, [Let&#39;s Encrypt](https:&#x2F;&#x2F;letsencrypt.org&#x2F;) offers a free alternative for creating the necessary certificates.

For example, you can create an [Azure free account](https:&#x2F;&#x2F;azure.microsoft.com&#x2F;free). If you host your website on the [Microsoft Azure App Service](https:&#x2F;&#x2F;azure.microsoft.com&#x2F;services&#x2F;app-service&#x2F;web), it&#39;s served over HTTPS by default.

You can also host your website on [GitHub Pages](https:&#x2F;&#x2F;pages.github.com&#x2F;) which supports HTTPS too.

For debugging purposes, Microsoft Edge also permits a &#x60;localhost&#x60; web server to use the PWA APIs without HTTPS.

## Step 2 - Create your app start page

So far, there is no content available on your web server. Start by creating the first page that users will see when they access your temperature converter app.

1. Open Visual Studio Code, select **File** \&gt; **Open Folder** and then select the &#x60;MySamplePWA&#x60; directory you created in the previous step.
2. Create a new file in the project by pressing **Ctrl+N**, add the following content, and save the file as &#x60;index.html&#x60;:  
&#x60;&#x60;&#x60;xml  
&lt;!DOCTYPE html&gt;  
&lt;html lang&#x3D;&quot;en-US&quot; dir&#x3D;&quot;ltr&quot;&gt;  
  &lt;head&gt;  
    &lt;meta charset&#x3D;&quot;UTF-8&quot; &#x2F;&gt;  
    &lt;meta name&#x3D;&quot;viewport&quot; content&#x3D;&quot;width&#x3D;device-width,initial-scale&#x3D;1&quot; &#x2F;&gt;  
    &lt;link rel&#x3D;&quot;shortcut icon&quot; href&#x3D;&quot;https:&#x2F;&#x2F;c.s-microsoft.com&#x2F;favicon.ico?v2&quot; &#x2F;&gt;  
    &lt;title&gt;Temperature converter&lt;&#x2F;title&gt;  
  &lt;&#x2F;head&gt;  
  &lt;body&gt;  
    &lt;h1&gt;Temperature converter&lt;&#x2F;h1&gt;  
  &lt;&#x2F;body&gt;  
&lt;&#x2F;html&gt;  
&#x60;&#x60;&#x60;
3. Go to &#x60;http:&#x2F;&#x2F;localhost:8080&#x60; to view your app:  
![Running your new PWA on localhost](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s5iqMhZ66RrpPoXkgeac6ftLOZbcmV0x5czrSdXnHt8M&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;sample-pwa-app.png)

The app runs in the browser for now, and can&#39;t be installed. To make the app installable, the app needs a web app manifest.

## Step 3 - Create a web app manifest

A [Web App Manifest](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;web-app-manifests) is a JSON file containing metadata about your app, such as its name, description, icons, and the various operating system features it uses.

To add an app manifest to your app:

1. In Visual Studio Code, press **Ctrl+N** to create a new file with the following content, and save the file as &#x60;manifest.json&#x60;.  
&#x60;&#x60;&#x60;json  
{  
    &quot;lang&quot;: &quot;en-us&quot;,  
    &quot;name&quot;: &quot;Temperature converter app&quot;,  
    &quot;short_name&quot;: &quot;Temperature converter&quot;,  
    &quot;description&quot;: &quot;A basic temperature converter application that can convert to and from Celsius, Kelvin, and Fahrenheit&quot;,  
    &quot;start_url&quot;: &quot;&#x2F;&quot;,  
    &quot;background_color&quot;: &quot;#2f3d58&quot;,  
    &quot;theme_color&quot;: &quot;#2f3d58&quot;,  
    &quot;orientation&quot;: &quot;any&quot;,  
    &quot;display&quot;: &quot;standalone&quot;,  
    &quot;icons&quot;: [  
        {  
            &quot;src&quot;: &quot;&#x2F;icon512.png&quot;,  
            &quot;sizes&quot;: &quot;512x512&quot;  
        }  
    ]  
}  
&#x60;&#x60;&#x60;
2. Add a 512x512 pixel app icon image named &#x60;icon512.png&#x60; to your project. You can use the [sample image](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;icon512.png) for testing purposes.
3. In Visual Studio Code, open &#x60;index.html&#x60;, and add the following code inside the &#x60;&lt;head&gt;&#x60; tag.  
&#x60;&#x60;&#x60;routeros  
&lt;link rel&#x3D;&quot;manifest&quot; href&#x3D;&quot;&#x2F;manifest.json&quot;&gt;  
&#x60;&#x60;&#x60;

The above code snippet links the new web app manifest file to your website.

Your VS Code project should now look somewhat like this:

![Screenshot of VS Code showing the sample PWA project, with the index.html, manifest.json, and icon files](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,se7QDkK-ZXV8PpO0DToEKWU1ll6qbmx7OTMlPNA5kpps&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;visual-studio-project-with-manifest.png)

## Step 4 - Continue building the user interface of your app

Now that your app has a web app manifest file, and a start page, it&#39;s time to build out the main app functionality.

In this step of the tutorial, we&#39;ll create a basic temperature unit conversion app.

1. To create the main user interface content, copy the following HTML code and paste it into the &#x60;index.html&#x60; file, replacing the &#x60;&lt;h1&gt;&#x60; HTML tag:  
&#x60;&#x60;&#x60;pgsql  
&lt;form id&#x3D;&quot;converter&quot;&gt;  
  &lt;label for&#x3D;&quot;input-temp&quot;&gt;temperature&lt;&#x2F;label&gt;  
  &lt;input type&#x3D;&quot;text&quot; id&#x3D;&quot;input-temp&quot; name&#x3D;&quot;input-temp&quot; value&#x3D;&quot;20&quot; &#x2F;&gt;  
  &lt;label for&#x3D;&quot;input-unit&quot;&gt;from&lt;&#x2F;label&gt;  
  &lt;select id&#x3D;&quot;input-unit&quot; name&#x3D;&quot;input-unit&quot;&gt;  
    &lt;option value&#x3D;&quot;c&quot; selected&gt;Celsius&lt;&#x2F;option&gt;  
    &lt;option value&#x3D;&quot;f&quot;&gt;Fahrenheit&lt;&#x2F;option&gt;  
    &lt;option value&#x3D;&quot;k&quot;&gt;Kelvin&lt;&#x2F;option&gt;  
  &lt;&#x2F;select&gt;  
  &lt;label for&#x3D;&quot;output-unit&quot;&gt;to&lt;&#x2F;label&gt;  
  &lt;select id&#x3D;&quot;output-unit&quot; name&#x3D;&quot;output-unit&quot;&gt;  
    &lt;option value&#x3D;&quot;c&quot;&gt;Celsius&lt;&#x2F;option&gt;  
    &lt;option value&#x3D;&quot;f&quot; selected&gt;Fahrenheit&lt;&#x2F;option&gt;  
    &lt;option value&#x3D;&quot;k&quot;&gt;Kelvin&lt;&#x2F;option&gt;  
  &lt;&#x2F;select&gt;  
  &lt;output name&#x3D;&quot;output-temp&quot; id&#x3D;&quot;output-temp&quot; for&#x3D;&quot;input-temp input-unit output-unit&quot;&gt;68 F&lt;&#x2F;output&gt;  
&lt;&#x2F;form&gt;  
&#x60;&#x60;&#x60;  
The above HTML code contains a form with multiple input elements that your app will use to convert a temperature value from one unit to another unit.
2. To make the converter work, you use JavaScript code. Create a new file named &#x60;converter.js&#x60; in your project and add the following code to it:  
&#x60;&#x60;&#x60;cs  
const inputField &#x3D; document.getElementById(&#39;input-temp&#39;);  
const fromUnitField &#x3D; document.getElementById(&#39;input-unit&#39;);  
const toUnitField &#x3D; document.getElementById(&#39;output-unit&#39;);  
const outputField &#x3D; document.getElementById(&#39;output-temp&#39;);  
const form &#x3D; document.getElementById(&#39;converter&#39;);  
function convertTemp(value, fromUnit, toUnit) {  
  if (fromUnit &#x3D;&#x3D;&#x3D; &#39;c&#39;) {  
    if (toUnit &#x3D;&#x3D;&#x3D; &#39;f&#39;) {  
      return value * 9 &#x2F; 5 + 32;  
    } else if (toUnit &#x3D;&#x3D;&#x3D; &#39;k&#39;) {  
      return value + 273.15;  
    }  
    return value;  
  }  
  if (fromUnit &#x3D;&#x3D;&#x3D; &#39;f&#39;) {  
    if (toUnit &#x3D;&#x3D;&#x3D; &#39;c&#39;) {  
      return (value - 32) * 5 &#x2F; 9;  
    } else if (toUnit &#x3D;&#x3D;&#x3D; &#39;k&#39;) {  
      return (value + 459.67) * 5 &#x2F; 9;  
    }  
    return value;  
  }  
  if (fromUnit &#x3D;&#x3D;&#x3D; &#39;k&#39;) {  
    if (toUnit &#x3D;&#x3D;&#x3D; &#39;c&#39;) {  
      return value - 273.15;  
    } else if (toUnit &#x3D;&#x3D;&#x3D; &#39;f&#39;) {  
      return value * 9 &#x2F; 5 - 459.67;  
    }  
    return value;  
  }  
  throw new Error(&#39;Invalid unit&#39;);  
}  
form.addEventListener(&#39;input&#39;, () &#x3D;&gt; {  
  const inputTemp &#x3D; parseFloat(inputField.value);  
  const fromUnit &#x3D; fromUnitField.value;  
  const toUnit &#x3D; toUnitField.value;  
  const outputTemp &#x3D; convertTemp(inputTemp, fromUnit, toUnit);  
  outputField.value &#x3D; (Math.round(outputTemp * 100) &#x2F; 100) + &#39; &#39; + toUnit.toUpperCase();  
});  
&#x60;&#x60;&#x60;
3. Open the &#x60;index.html&#x60; file again and add the following code after the closing &#x60;&lt;&#x2F;form&gt;&#x60; tag, to load the JavaScript file:  
&#x60;&#x60;&#x60;xml  
&lt;script src&#x3D;&quot;converter.js&quot;&gt;&lt;&#x2F;script&gt;  
&#x60;&#x60;&#x60;
4. Now add some CSS style to the app, to make it more visually interesting. Create a new file called &#x60;converter.css&#x60; in your project and add the following code to it:  
&#x60;&#x60;&#x60;css  
html {  
  background: rgb(243, 243, 243);  
  font-family: system-ui, -apple-system, BlinkMacSystemFont, &#39;Segoe UI&#39;, Roboto, Oxygen, Ubuntu, Cantarell, &#39;Open Sans&#39;, &#39;Helvetica Neue&#39;, sans-serif;  
  font-size: 15pt;  
}  
html, body {  
  height: 100%;  
  margin: 0;  
}  
body {  
  display: grid;  
  place-items: center;  
}  
#converter {  
  width: 15rem;  
  padding: 2rem;  
  border-radius: .5rem;  
  box-shadow: 0 0 2rem 0 #0001;  
  display: flex;  
  flex-direction: column;  
  align-items: center;  
}  
#converter input, #converter select {  
  font-family: inherit;  
  font-size: inherit;  
  margin-block-end: 1rem;  
  text-align: center;  
  width: 10rem;  
}  
#converter #output-temp {  
  font-size: 2rem;  
  font-weight: bold;  
}  
&#x60;&#x60;&#x60;
5. Open &#x60;index.html&#x60; again and reference the new CSS file in it by adding the following code inside the &#x60;&lt;head&gt;&#x60; tag:  
&#x60;&#x60;&#x60;routeros  
&lt;link rel&#x3D;&quot;stylesheet&quot; href&#x3D;&quot;converter.css&quot;&gt;  
&#x60;&#x60;&#x60;  
Your Visual Studio Code project should now look something like this:  
![The sample PWA project in Visual Studio Code, with the index.html, converter.js, converter.css, and manifest.json files](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sNNLpuNHlM2q4f-GMLc7VLPEJuDpmdRRLO20vE_FsRek&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;visual-studio-project-with-front-end-files.png)
6. Go to &#x60;http:&#x2F;&#x2F;localhost:8080&#x60; to view your app:  
![Running your new PWA, with the frontend code, on localhost](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sIGcJcURuxrYJMWa44BzdegdAMxThaP-ip3EbA418Vgo&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;sample-pwa-app-with-frontend-code.png)

Your app does something useful now, but it can&#39;t be installed yet, because there&#39;s no service worker. You&#39;ll make your app installable in the next step, by creating a service worker.

## Step 5 - Add a service worker

Service workers are a key technology that help make PWAs faster and independent of network conditions.

Service workers are specialized [Web Workers](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;docs&#x2F;Web&#x2F;API&#x2F;Web%5FWorkers%5FAPI) that intercept network requests from your PWA and enable scenarios that were previously limited to native apps, including:

* Offline support.
* Advanced caching.
* Running background tasks such as receiving PUSH messages, adding badges to the app icon, or fetching data from a server.

For Microsoft Edge to be able to install the app, your app must have a service worker file.

A service worker is defined in a JavaScript file that&#39;s loaded by your app. To add a service worker to your project:

1. In Visual Studio Code, create a new file (**Ctrl+N**), add the following content, and save the file as &#x60;sw.js&#x60;:  
&#x60;&#x60;&#x60;typescript  
const CACHE_NAME &#x3D; &#x60;temperature-converter-v1&#x60;;  
&#x2F;&#x2F; Use the install event to pre-cache all initial resources.  
self.addEventListener(&#39;install&#39;, event &#x3D;&gt; {  
  event.waitUntil((async () &#x3D;&gt; {  
    const cache &#x3D; await caches.open(CACHE_NAME);  
    cache.addAll([  
      &#39;&#x2F;&#39;,  
      &#39;&#x2F;converter.js&#39;,  
      &#39;&#x2F;converter.css&#39;  
    ]);  
  })());  
});  
self.addEventListener(&#39;fetch&#39;, event &#x3D;&gt; {  
  event.respondWith((async () &#x3D;&gt; {  
    const cache &#x3D; await caches.open(CACHE_NAME);  
    &#x2F;&#x2F; Get the resource from the cache.  
    const cachedResponse &#x3D; await cache.match(event.request);  
    if (cachedResponse) {  
      return cachedResponse;  
    } else {  
        try {  
          &#x2F;&#x2F; If the resource was not in the cache, try the network.  
          const fetchResponse &#x3D; await fetch(event.request);  
          &#x2F;&#x2F; Save the resource in the cache and return it.  
          cache.put(event.request, fetchResponse.clone());  
          return fetchResponse;  
        } catch (e) {  
          &#x2F;&#x2F; The network failed.  
        }  
    }  
  })());  
});  
&#x60;&#x60;&#x60;  
The &#x60;sw.js&#x60; file will act as your PWA&#39;s service worker. The code above listens to the &#x60;install&#x60; event and uses it to cache all resources the app needs to function: the start HTML page, the converter JavaScript file, and the converter CSS file.  
The code also intercepts &#x60;fetch&#x60; events, which happen every time your app sends a request to the server, and applies a cache-first strategy. The service worker returns cached resources so your app can work offline, and if that fails attempts to download from the server.
2. Open &#x60;index.html&#x60; and add the following code at the end of the &#x60;&lt;body&gt;&#x60; tag to register your service worker:  
&#x60;&#x60;&#x60;xml  
&lt;script&gt;  
if(&#39;serviceWorker&#39; in navigator) {  
  navigator.serviceWorker.register(&#39;&#x2F;sw.js&#39;, { scope: &#39;&#x2F;&#39; });  
}  
&lt;&#x2F;script&gt;  
&#x60;&#x60;&#x60;

To confirm that your service worker is running:

1. In Microsoft Edge, go to &#x60;http:&#x2F;&#x2F;localhost:8080&#x60;.
2. To open DevTools, right-click the webpage, and then select **Inspect**. Or, press **Ctrl+Shift+I** (Windows, Linux) or **Command+Option+I** (macOS). DevTools opens.
3. Open the **Application** tool, then **Service Workers**. If the service worker isn&#39;t displayed, refresh the page.  
![The DevTools Application tool, showing the Service Workers panel, with the new sw.js worker running](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sr9bUoMABEzNGco24IOxofc-tHRu4Ccpmy58QjJmvaV8&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;devtools-sw-overview.png)
4. View the service worker cache by expanding **Cache Storage** and selecting **temperature-converter-v1**. All of the resources cached by the service worker should be displayed. The resources cached by the service worker include the app icon, app manifest, and the initial page.  
![DevTools, showing where to view the cached resources](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sIjs8rpUJqKugXcxgSQdmaGLSG4n39uwHx1PnWUKUhuc&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;devtools-cache.png)
5. Try your PWA as an offline app. In DevTools, open the **Network** tool, and change the **Throttling** value to **Offline**.
6. Refresh your app. It should still appear correctly in the browser, using cached resources served by the service worker.  
![DevTools, showing where to switch the Throttling value to Offline](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sZeUpuwk3Q2VBsFpvwpPXdHtX5wA6Aqty9xrtsiMyjQQ&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;devtools-offline.png)

## Step 6 - Install the app

Now that your app has a web app manifest and a service worker, supporting browsers can install it as a PWA.

In Microsoft Edge, once you refresh your app, the **App available** button appears in the address bar. Clicking the **App available** button prompts you to install the app locally.

![Microsoft Edge, with the sample PWA in a tab. The App available button in the address bar has been clicked and the installation prompt is displayed](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,sjyIXLV0D3GwATMvm7AMHU-xKPw7Y9sVAqNZeARJZ7Xs&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;sample-pwa-app-available-button.png)

Click **Install** to install the app locally. After the installation completes, your app is displayed in its own window, and its own application icon in the Taskbar.

![The sample PWA, installed and running in its own window](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,stMVYd4QiH_TTAQ4sPgOk6-K5j0soR8EYl4A-ajsd0uc&#x2F;https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;index-images&#x2F;sample-pwa-installed.png)

To learn more about installing PWAs, see [Use Progressive Web Apps in Microsoft Edge](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;ux).

## Next steps

The simple temperature converter PWA you built so far only scratches the surface of what PWAs can do. The previous steps are important prerequisites for any PWA, but there are important best practices that will make your PWA feel like a real app when installed.

When users install applications, they have certain expectations of what these applications can do; for example:

* Users expect apps to work offline.
* Users expect apps to integrate within the operating system, such as by handling files.
* Users expect apps to perform non-trivial computing tasks.
* Users expect to find apps in app stores.

To build a great PWA, see [Best practices for PWAs](https:&#x2F;&#x2F;learn.microsoft.com&#x2F;en-us&#x2F;microsoft-edge&#x2F;progressive-web-apps-chromium&#x2F;how-to&#x2F;best-practices).

## See also

* [Getting Started with Progressive Web Apps (Workshop)](https:&#x2F;&#x2F;noti.st&#x2F;aarongustafson&#x2F;co3b5z&#x2F;getting-started-with-progressive-web-apps-workshop).

## Feedback

Submit and view feedback for