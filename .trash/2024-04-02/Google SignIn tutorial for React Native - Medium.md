---
id: a5bdbec1-3e52-45c2-9251-c04363d3b756
---

# Google SignIn tutorial for React Native | Medium
#Omnivore

[Read on Omnivore](https://omnivore.app/me/google-sign-in-tutorial-for-react-native-medium-18ea1c56185)
[Read Original](https://ibjects.medium.com/google-signin-tutorial-for-react-native-81a57fb67b18)


## A straightforward approach to creating Google Sign In for a React Native app that works for both iOS and Android.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;631x299,sJvvqULrGbLchKMg1KxlAiPn24VW9JsvjknR_f_bgKMY&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1262&#x2F;1*O_I2lbJ8cr16oscd3fh60Q.png)

Update May 12, 2022: In @react-native-google-signin&#x2F;google-signin: 7.2.2\. There is no androidClientId in the configure params. I’ll update the article accordingly, but for now please refer to &lt;https:&#x2F;&#x2F;github.com&#x2F;react-native-google-signin&#x2F;google-signin&gt; if you face any issues.

_UPDATED: Nov 26, 2021, and tested the code still works. Made some updates to the final code as well as I added a possible error fix. The implementation is NOT using_ **_firebase_** _and is implemented in a React Native CLI project and not expo._

Assuming you have already created a React Native project and have the UI in place. We’ll first configure keys that are required and after that, we’ll add the functionality to a button press event in our app.

## Generating the required Keys

Go to &lt;https:&#x2F;&#x2F;console.cloud.google.com&#x2F;&gt; and create a New Project

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x62,se62chJ3a8xRSpfch0afFY2z2ZaiftckZSLSERiymu7k&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*3CBcefA5NAxfSYAl9chwJA.png)

The navigate to APIs &amp; Services → Credentials

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x619,sCXserw6_xZSt-C089_RxA20OpsU0-OM6xmO8Yitj85o&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*usbh1ePF_f3CSx8c0ahhKQ.png)

Click on **CREATE CREDENTIALS → OAuth client ID**

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x152,sE87fnsIvAS48ulLzQT_F9ngsbRpAXpO9nyAJ0NX0u5c&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*Xy2GgvCR55DlatbEAhR6RA.png)

From the Application Type dropdown select iOS

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x524,sO-1MEaaWSZP_tFtatYz1YE8M0ZN1KEm6fMr98cTtnH8&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*3j9hOz9IVpFcXR9_NgXv5Q.png)

Give this key a **Name** (_convention is to have a name without any caps the screenshot below is just shared as an example_)and **Bundle ID** (_same as in your info.plist file of iOS project_) and click **CREATE**.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x565,sm6oEqRqDUaP-iN_RkVFx1NT5GVfU2aVVP7z3FpXVbhs&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*1ydIt5Bh4pWRbA-aKwW5mg.png)

You’ll now see the key in your credentials under OAuth 2.0 Client IDs

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x52,sLrI949pv03IhozhTcZvpOX_NaCqCq4jGca0r-9e6GDI&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*MtM_FsfQAzq21BI6rJmUxw.png)

For iOS we also need to add a URL scheme. Click on the Name of the key you just created., in my case the name is &#x60;DECIDER-RN-iOS-App-client&#x60; and you’ll. be taken to a page like this:

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x265,sHvl3VXyy9IO4H79lnXz9Q9iVau6W2d1Rxob4V9oriLI&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*SQzFCgG25f61iEGuQUF4UQ.png)

Here copy the **iOS URL scheme** given on the right side and open your React Native iOS project in XCode.

Select your app from the **TARGETS** section, then select the **Info** tab, and expand the **URL Types** section. Click on. the + button and paste the copied **iOS URL scheme** here.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x419,sj1VPycMupUP0TVpYEpVjj8g0Ukd9luvaJdTo9MNrHy8&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*FaEBEZz7CWp18kYlVZ9LxQ.png)

That’s it for iOS setup next we’ll create a key for android.

Click on **CREATE CREDENTIALS → OAuth client ID** and this time from **Application type** select **Android**.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x540,s2vUpJbovxatrQP0bRZnG-z7EP4YWvSOk0HzGzvONxls&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*BWOWB6I-JUYaBKEBCdIw1g.png)

Same as before giving it a name and copy the exact **Package name** as per your **AndroidManifest.xml** file.

A new thing here is it’s asking for an SHA-1 certificate fingerprint.

&gt; SHA-1 signing certificate fingerprint restricts usage to your Android apps.   
&gt; [Learn more](https:&#x2F;&#x2F;support.google.com&#x2F;cloud&#x2F;answer&#x2F;6158849#installedapplications&amp;android)

To create an SHA-1 fingerprint Open your React-Native Project and from its terminal first, do &#x60;cd android&#x60; and then run this command:

keytool -keystore app&#x2F;debug.keystore -list -v

&gt; NOTE: The above command will give you a DEV key. To get an SHA-1 key for PROD use the above command but replace &#x60;debug.keystore&#x60; with your &#x60;release.keystore&#x60; and use that SHA-1\. I suggest making two keys one for DEV and one for PROD.

If it asks you for the password, the password is &#x60;android&#x60; press enter and you’ll see

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x403,sxVYlqP-UWRllRnyqDwFJyrRYjT0tpRGuKvjJrUxKA_Q&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*AgvOCpjjAAb-XErE6Oibmg.png)

Copy the SHA1 (hidden with green) and paste the SHA-1 key in the Google Cloud Console ad click on **CREATE**.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x846,s-A662aEqIfPJIg2krV-kyB8o5hRjhfPAC9lN1bPH6CM&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*J2ELizE7PikoUTz31VdK0g.png)

Great now you have two client IDs one for iOS and one for Android.

## Implementing Google Sign In for React Native App

We’ll need to install the Google SignIn package. So first install this [package](https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;@react-native-google-signin&#x2F;google-signin)

npm i @react-native-google-signin&#x2F;google-signin

Don’t forget to do &#x60;pod install&#x60; after installing the above library.

In the file where you want to show Google Sign In, first import:

import {    GoogleSignin,    statusCodes,} from &#39;@react-native-google-signin&#x2F;google-signin&#39;;

Add the following code which is a button component. When this button is pressed it’ll send a call to Google Sign In

&lt;Button title&#x3D;{&#39;Sign in with Google&#39;} onPress&#x3D;{() &#x3D;&gt;  {    GoogleSignin.configure({        androidClientId: &#39;ADD_YOUR_ANDROID_CLIENT_ID_HERE&#39;,        iosClientId: &#39;ADD_YOUR_iOS_CLIENT_ID_HERE&#39;,    });GoogleSignin.hasPlayServices().then((hasPlayService) &#x3D;&gt; {  
        if (hasPlayService) {  
             GoogleSignin.signIn().then((userInfo) &#x3D;&gt; {  
                       console.log(JSON.stringify(userInfo))             }).catch((e) &#x3D;&gt; {             console.log(&quot;ERROR IS: &quot; + JSON.stringify(e));             })        }}).catch((e) &#x3D;&gt; {    console.log(&quot;ERROR IS: &quot; + JSON.stringify(e));})}} &#x2F;&gt;

On the button press, I’m doing everything. For functionalities like &#x60;getCurrentUser()&#x60; or &#x60;signOut()&#x60; you can check out the package you installed &lt;https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;@react-native-google-signin&#x2F;google-signin&gt; which has those code snippets, main thing was to generate keys which you have already done. Here is the screenshot of my console log where I’m getting the logged-in user info

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x43,s2WPYjiERKngPsskGyBudoBjGh5prUNdQvqpJFR6f_EE&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*WzGTtrxyHz5ggmp2593M8Q.png)

Congrats 🙌 🎉! you have successfully implemented google sign-in for your react native project.

## Possible Errors

You might face some issues, so I’ve shared solutions to some commonly known ones here:

1: One possible error on android is DEVELOPER\_ERROR which will occur if the SHA1 key for android is not implemented correctly. There are many ways you can find on the internet but to generate the key but the one mentioned in this article works and all the others I tried didn’t work.

2: You should be getting &#x60;null&#x60; in &#x60;idToken&#x60; but if you need the &#x60;idToken&#x60; then you need to create a new OAuth client ID credential for the web application and then in the code where we have added iOS and android keys &#x60;GoogleSignin.configure({...&#x60; you need to add these two as well:

...  
offlineAccess: true,webClientId: &#39;YOUR_WEB_APPLICATION_CLIENT_ID_HERE&#39;,  
...

By doing so you’ll start getting &#x60;idToken&#x60; in the userInfo object when the user logs in.

3\. If you get Exception ‘**_Your app is missing support for the following URL schemes:_**’ import the import statement below in the &#x60;AppDelegate.m&#x60;:

#import &lt;GoogleSignIn&#x2F;GIDSignIn.h&gt;

Build the project once in XCode to make sure it builds successfully and then run the project from VSCode. You’ll also need to check if the **iOS URL scheme** part above is correctly implemented.

As always if you find this helpful share and press the 👏🏻 button so that others can find it too. If you see a typo feel free to highlight it or if you’re stuck drop a comment and I’ll try my best to help you.

![](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;700x197,se1X2UNRt3fwfBNB1d8j5teKafLUdUQCZ45dqoKTYjuk&#x2F;https:&#x2F;&#x2F;miro.medium.com&#x2F;v2&#x2F;resize:fit:1400&#x2F;1*ca5H_LEso-0c7GG4bsssBA.png)

&lt;https:&#x2F;&#x2F;www.buymeacoffee.com&#x2F;chaudhrytalha&gt;

All my tutorials are free but if you feel like supporting you can [buymeacoffee.com&#x2F;chaudhrytalha](https:&#x2F;&#x2F;www.buymeacoffee.com&#x2F;chaudhrytalha)

Happy Coding 👨🏻‍💻