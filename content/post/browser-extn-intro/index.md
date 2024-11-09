+++
title = "Browser Extensions: Part 1 - Introduction"
description = "An introductory guide to building and troubleshooting browser extensions"
date = "2024-09-04T10:12:32-07:00"
draft = false
tags = ["modern-web-dev", "web-development", "tech-explorations", "how-to", "building"]
topics = ["browser-extensions"]
+++

Imagine a world where every website adapts to your specific needs in real-time, securely and easily, without selling your data to third party companies. It will be cool, right? Yes and it is possible - thanks to **Browser extensions**.

In this post, we will learn about browser extensions - what they are, why you should build them and how to build them. We will conclude by looking at a few issues that come up frequently while building an extension and how to troubleshoot them. For those interested in advanced topics, check out Part 2 of this series - [Browser Extensions: Part 2 - Advanced Concepts](/post/browser-extn-adv/).
          
## The What
Browser extensions are lightweight software components that can be integrated into web browsers to customize and enhance the web browsing experience. It enables you to modify web page content, add UI elements like buttons or sidebars, observe browser events, capture user input and run background scripts.

These extensions are built using standard web technologies: HTML, CSS and JavaScript. You can use TypeScript too, but more on that later.  The extension package includes all the necessary resources (pages, stylesheets, images) as well as the business logic (code and scripts). They have access to many APIs including: 
  - [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) (eg: DOM APIs, fetch, alert etc.)
  - [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference) (eg: chrome.action, chrome.alarms, chrome.scripting etc.)

When ready to release, the extensions can be submitted to official stores like [Google Chrome Web Store](https://chromewebstore.google.com/) or [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home) where it undergoes a thorough review and approval process. The approved extensions are published to these stores and users can easily install them to their browsers.

An important security feature of browser extensions is that their source code is distributed as part of the package, and no additional code can be downloaded at runtime. This ensures that the extension's behavior is not altered after it was reviewed and approved by the store.

A few examples of browser extensions that I found to be useful are [ublock ad-blocker](https://chromewebstore.google.com/detail/ublock/epcnnfbjfcgphgdmggkamkmgojdagdnn), [Readwise reader](https://chromewebstore.google.com/detail/readwise/egfepjgjabnppmaiadpedbgadkcelcbd), [Readwise highlighter](https://chromewebstore.google.com/detail/readwise-highlighter/jjhefcfhmnkfeepcpnilbbkaadhngkbi) and [React developer tools](https://chromewebstore.google.com/detail/readwise-highlighter/jjhefcfhmnkfeepcpnilbbkaadhngkbi).

## The Why
Browser extensions give you a low-barrier way to customize websites. They are very easy to build, distribute and maintain - in fact, the simplest extension is often easier to create than the simplest website. You don't need your own domain or server to host the extension. No hosting costs. No special infrastructure required. 

They are also a great addition to your product portfolio, alongside other platforms such as websites, desktop apps for macOS and Windows, and mobile apps for iOS and Android. Browser extension helps you meet users wherever they are. Also, extensions built for one browser (eg: Chrome) typically work as-is for others (like MS Edge or Firefox), thereby expanding your reach  with minimal effort.

And here is my favorite reason to build browser extension - the ability to tailor every website to my specific needs, while keeping them private and secure. For instance, you can integrate Perplexity or ChatGPT-like functionality to any website you browse. Instead of constantly copying and pasting content between standalone AI assistants and web pages, the extension brings that functionality into your browsing context - wherever you are. Keeping it in your private session ensures security and privacy. I love it!

## The How
So, how do we build a browser extension. Let's dive in step-by-step in detail.

The source code for the extensions discussed here is available in my GitHub repo [annjose/browser-extensions](https://github.com/annjose/browser-extensions).

#### Step #1: Create a manifest file
Manifest file is a JSON file that defines all the metadata about the extension - **name**, **version**, **author**, the schema version of the manifest itself (**manifest_version**) and other attributes. The file is required to be named as `manifest.json` and located in the root directory of the extension. 

So, if you are creating a **Hello Ext World** extension, create a folder named *hello-world-ext* and create a manifest file as follows:
``` json
{
  "manifest_version": 3,
  "name": "Hello Ext World",
  "description": "A simple extension",
  "version": "0.0.1",
  "action": {
      "default_popup": "hello.html",
      "default_icon": "hello.png"
  }
}
```

You can learn more about the manifest file in the [Chrome docs for manifest](https://developer.chrome.com/docs/extensions/reference/manifest).

#### Step #2: Create the resources that define the extension
The **action** attribute in the manifest file defines the appearance and behavior of the extension's icon in the browser toolbar. So we create the files that make up the extension and specify them inside the action attribute.

First, create the icons that represent the extension. You can create one or more icons to represent the extension as per the following convention:

{{< pure_table
"Icon size | Icon use                                                "
"16 x 16     | Favicon on the extension's pages and context menu     "
"32 x 32     | Windows computers often require this size             "
"48 x 48     | Displays on the Extensions page (chrome://extensions) "
"128 x 128   | Displays on installation and in the Chrome Web Store  "

>}}

At the minimum, you should provide a 48 x 48 icon as the main image of the extension. 

Next, you create an HTML page to define the user interface of the extension. The UI will be displayed when the user clicks on the icon in the toolbar. The HTML page could be as simple as follows:
``` html
<html>
    <body>
        <h3>
            Hello Ext World!
        </h3>
    </body>
</html>
```

Finally, specify the icon and the HTML file in the manifest file under the **action** key as properties **default_icon** for the main image of the extension and **default_popup** for the HTML page. You can also specify a title to displayed when the user hovers over the extension icon. It can also specify the web pages you are allowed to interact with, as URL match patterns. Make sure that all the HTML and image files are in the root folder of the extension. 

``` json
{
    "manifest_version": 3,
    "name": "Hello Ext World",
    "description": "A simple extension",
    "version": "0.0.1",
    "icons": {
      "16": "hello-icon-16.png",
      "32": "hello-icon-32.png",
      "48": "hello-icon-48.png",
      "128": "hello-icon-128.png"
    },
    "action": {
        "default_popup": "hello.html",
        "default_icon": "hello-icon-48.png"
    },
}
```

#### Step #3: Create the content scripts.
Content scripts are the JavaScript (or TypeScript) files that implement the core functionality of the extension. They can also include CSS files. They run in the context of the web pages and can read details of the web pages the browser visits, update their UI and pass information to other files in the extension. These scripts can be included in the extension in three ways:

1. **Declare statically** - specify the names of the script files in the manifest file under the key **content_scripts**. The **js** key specifies the JavaScript files, **css** key specifies the CSS files and the **matches** key specifies the web pages where this content script is injected into. Here is an example (see the full source code at [my GitHub repo browser-extensions](https://github.com/annjose/browser-extensions/tree/main/reading-time-ext)):
``` json
{
  "manifest_version": 3,
  "name": "Reading Time",
  "version": "0.2",
  "description": "Shows reading time of a page",
  "content_scripts": [
    {
      "js": ["scripts/my-content-script.js"],
      "matches": [
        "https://annjose.com/post/*"
      ]
    }
  ]
}
```

2. **Declare dynamically** - register the content scripts with Chrome using a few Scripting APIs in the **chrome.scripting** namespace - *registerContentScripts*, *updateContentScripts* and *unregisterContentScripts* to register, update and unregister the content scripts, and *getRegisteredContentScripts* to get a list of registered scripts.

``` js
chrome.scripting
  .registerContentScripts([{
    id: "my-content-script",
    js: ["hello-script.js"],
    css: ["hello-styles.css"]
    matches: ["https://*.annjose.com/*"],
    persistAcrossSessions: false,
    runAt: "document_start",
  }])
  .then(() => 
    console.log("Register success!")
  )
  .catch((err) => 
    console.warn("Register failed.", err)
  )
```

3. **Inject programmatically** - Inject the content scripts programatically when you want to run some script only based on a condition or in response to specific events. You can do this using another Scripting API - **chrome.scripting.executeScript()**. The sample code this method is lengthy, so I will give it in the follow-up blog post at [Browser Extensions: Part 2 - Advanced Concepts](/post/browser-extn-adv/).

#### Step #4: Load the extension in your browser
As you are developing your extension, you can load them into your local browser to test and verify that everything is working as intended. Follow these steps:
* open the Extensions page in your browser by navigating to the page **chrome://extensions/** in your browser (Chrome or Microsoft Edge). Alternately, you can click the puzzle icon on the browser toolbar and select the option 'Manage Extensions'.
* click the button **Load Unpacked**.
* Select the root folder of the extension, i.e. the folder where the manifest.json file is present.

Now you will see the extension listed in the Extensions page. Make sure that the extension is enabled, if not use the switch button to enable it. Alternately, you can click the puzzle icon on the toolbar, scroll down to your extension and click the eye button to enable the extension.

Now you should see the icon of your extension in the browser toolbar. If not, there may be some errors in loading the extension. Go back to the Extensions page and find the your extension's tile. If the tile shows a button named 'Errors', click on the button, review the loading errors and fix them.

That's it! Your Hello World extension is ready!

#### Step #5: Modify and reload the extension
You can continue to modify the extension by updating the HTML, JS or CSS files. Some of these changes will be updated automatically in the extension's user interface, while others may need an explicit 'reload' step. You can reload an extension from the Extensions page by clicking on the **Reload** button inside your extension's tile. Apply the following neuristics to decide whether to reload the extension or not.

- have you changed the manifest (name, description, any json in it)? - Reload it!
- have you moved the extension files to another folder? - Reload it!
- have you modified the service worker? Reload it!
- have you modified the popup page (eg: hello.html) or options page? - Don't reload, done automatically.
- have you modified any of the other pages in the extension? - Don't reload, done automatically.

### Troubleshooting
Let's look at a few issues that are frequently seen while building extensions and how to resolve them.

#### Debugging the extension
In order to debug an extension, you can right click the extension's icon on the toolbar and click the button **Inspect Pop-up Window**. It will open a developer console in a popup window. This will display any console.log or console.error statements that you have put in your content scripts. It will also display any JS errors from your extension.

Another way to debug the errors is to go to the Extensions page, locate the tile of your extension and look for an 'Error's button. This button is displayed only when there are any errors in loading the extension. Click on the button to see the errors and fix them.

#### File not found error
When you click on the tool bar icon of your extension, it shows 'File not found'. The reason for this error is that the manifest file is not at the root directory of the extension.

#### Extension's icon is not loaded
Sometimes, you may see that the icon shown in the toolbar is different from what you specified in the manifest file. This happens when the manifest file is not correct, for example, the icon is specified in the wrong attribute 'popup_action', it said 'popup_icon'. If the browser cannot find the icon specified in the manifest, it will generate a default icon and use it. Fix the JSON and you will see the correct icon.

## What's Next
Chrome developer documentation has a lot of good tutorials on building extensions, for example:
* [Hello World extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
* [Run scripts on every page](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab)

You can also look at the extensions that are available in my GitHub repo [annjose/browser-extensions](https://github.com/annjose/browser-extensions/).

I have also built an extension to calculate the reading time of a page and is integrated with my website. The source code for this extension is available at [browser-extensions/reading-time-ext](https://github.com/annjose/browser-extensions/tree/main/reading-time-ext).

Next, I want to build a private local extension that can bring the GPT 4o or Perplexity capabilities to every webpage I visit. I also want to write a follow-up of this post to explain the advanced concepts of browser extension. I have an early draft of that and will publich in the next couple of days. Stay tuned!

## References
* [Chrome Documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab)
* all my browser extensions - [annjose/browser-extensions](https://github.com/annjose/browser-extensions/)
* Part 2 of this article - [Browser Extensions: Part 2 - Advanced Concepts](/post/browser-extn-adv/)
