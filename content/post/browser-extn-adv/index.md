+++
title = "Browser Extensions: Part 2 - Advanced Concepts"
description = "Exploring advanced concepts in browser extension development"
date = "2024-09-05T14:24:13-07:00"
draft = false
tags = ["modern-web-dev", "web-development", "tech-explorations", "how-to", "building"]
topics = ["browser-extensions"]
+++

This is the second part of my blog series on browser extensions. Here, we'll delve into advanced concepts including TypeScript integration, service workers, and programmatic script injection. For a solid foundation, I recommend reading [Browser Extensions: Part 1 - Introduction](/post/browser-extn-intro/) before tackling these more complex topics.

## How to use TypeScript in browser extensions
By default, browser extensions use JavaScript as the programming language in the content scripts. However, TypeScript is more type safe and reliable to write the business logic. You can add TypeScript support to the extension project, but how do you do it? Chrome docs mention this as a one-liner as follows:

> If you are developing using a code editor such as VSCode or Atom, you can use the npm package chrome-types to take advantage of auto-completion for the Chrome API

OK, what exactly does this mean? All we know so far is that browser extensions have a simple structure with manifest file, HTML, CSS and JS files. How do we (in fact, can we) install an npm package in a browser extension? Also, this talks about auto-complete, but we need more than that.

Well, it turns out that it is not that difficult. It requires a few additional steps, but they are the same as adding TypeScript to any web project. Here are the steps to do it:

### 1. Initialize a Node.js project
  * Open your terminal/command prompt
  * Navigate to your extension's root directory
  * Run 'npm init -y' to create package.json

### 2. Install the 'chrome-types' package
  * Run command: npm install --save-dev chrome-types
  * Now you have auto-complete for Chrome APIs
  * If your tsconfig.json is showing the error "Cannot find type definition file for 'chrome-types'", then it means the npm package is not installed correctly. 
    * Run the command 'npm list chrome-types' and verify that the package is listed. 
    * If not, check your tsconfig.json and make sure that the 'compilerOptions' is configured correctly.

### 3. Configure TypeScript
  * Install TypeScript by installing the **typescript** package
  * Run command: npm install --save-dev typescript
  * Create a **tsconfig.json** file in your project root
``` json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "types": ["chrome-types"]
  }
}
```

### 4. Create your TypeScript files
  * create your TypeScript file, for eg: **hello.ts**
  * at the top of your TS file, add a special tag **reference** referring to chrome types
``` ts
/// <reference types="chrome-types" />

chrome.alarms.create('hello');
console.log("this log is from the typescript file");
```

### 5. Update your HTML file to refer to the TypeScript file
  * Make sure your manifest file, HTML files and content scripts point to the TypeScript files
``` html
<!-- hello.html -->
<html>
    <body>
        <h3>
            Hello Ext World!
        </h3>
        <script src="hello.ts"></script>
    </body>
</html>
```

That's it! Now you can do all fancy stuff like this with the full auto complete in your VS Code, Web Storm etc. TypeScript away!

## Service workers
Browser extensions provide a mechanism **service workers** to run scripts in the background. As the main even handler of the extension, these service workers run in the background and handle browser events like _bookmark added_, _tab opened_ etc. An extension service worker is loaded and unloaded as needed.

Service workers don't have access to the DOM, but extensions can utilize a hidden offscreen document for DOM-related tasks using the Chrome Offscreen API.

Let's build an extension 'Colorize' that can change the background of a page to a random set of colors - like a beautiful rainbow!
You can see the source code for this extension at [annjose/browser-extensions/bg-colorizer-ext](https://github.com/annjose/browser-extensions/tree/main/bg-colorizer-ext)

1. Build the manifest file
```json
// manifest.json
{
    "manifest_version": 3,
    "name": "Background colorizer",
    "version": "0.1",
    "permissions": [
        "activeTab",
        "scripting"
    ],
    "background": {
        "service_worker": "color-worker.js"
    },
    "action": {
        "default_title": "Change color",
        "default_popup": "color-popup.html"
    }
}
```

2. Create the popup html - this is straigtforward, so see the file in the git repo

3. Create the popup js
``` js
// Add the event listener to the colorize button
document.getElementById('color-button').addEventListener('click', () => {
  // pick a random color
  const color = '#' + Math.floor(Math.random()*16777215).toString(16);
  chrome.runtime.sendMessage({action: 'colorize', color: color});
});
```

4. Create the service worker file
``` js
console.log('inside color-worker.js');

// Handle the colorize message from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "colorize") {
    colorize(message.color);
  }
});

// Function to colorize the page to change the background color of the active tab

function colorize(color) {
  // find the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (color) => {
          // change the background color to the given color
          document.body.style.backgroundColor = color;
        },
        args: [color],
      });
    }
  });
}
```

5. Load the extension from the Extensions page and enable the extension. 

If everything works well, you will see a button 'Colorize Page' in the extension and when you click on it, the background color of the page in the active tab will change to a random color. As you continue to click on the button, the background color will change to different color. Have fun!

### Troubleshooting

Error: "Error handling response: TypeError: Cannot read properties of undefined (reading 'executeScript') at chrome-extension://befckjdncklbncigineablgcikdjcpfi/color-worker.js:27:24"

This happens when the manifest file does not have the permissions for scripting. 

Solotion: add the following to the manifest.json
``` json
{
    "permissions": [
        "scripting"
    ]
}
```

Error - "Uncaught (in promise) Error: The extensions gallery cannot be scripted."
This occurs when you are running the extension on a sensistiv page like Extension gallery like https://chromewebstore.google.com/ or https://microsoftedge.microsoft.com/addons/.

Solution - open the extension on another page like https://github.com/ and enjoy the color rainbow!

## How to inject content script programatically
In the [previous post](/post/browser-extn-intro/), we looked at three ways of injecting content scripts into an extension - statically declare, dynamically declare and programmatically inject. It covered the first two methods in depth, so now let's look at the third method.

Injecting content scripts programatically is useful when you want to run some script based on a condition or in response to specific events. You can inject the scripts using the Chrome Scripting API **chrome.scripting.executeScript**, which takes an array of script files (as 'files') or a function body (as 'func') and executes the script in the context of the extension.

``` json
// manifest.json
{
  "name": "Hello Ext World",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "Say Hello Blue"
  }
}
```

``` js
// hello-script.js
document.body.style.backgroundColor = "blue";
```

```js
// background.js - script file injected as a file
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["hello-script.js"]
  });
});
```

```js
// background.js - script injected as a function
function changeColor() {
  document.body.style.backgroundColor = "blue";
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : changeColor,
  });
});
```

Note that in order to inject a script programatically, you need to specify the host permisions for the page you are trying to inject the file. Or you can specify active_tab as specified below.

### Other concepts

#### Toolbar action
Executes code when the user clicks on the extension button in the browser toolbar. Use the Chrome API `chrome.action`

#### Side Panel
Hosts content in the browser's side panel alongside the main content of the web page. Use API `chrome.sidePanel`

#### DeclarativeNetRequest
Allows you to intercept, block or modify a network request.

## References
- [Chrome Documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab)
- Part 1 of this article - [Browser Extensions: Part 1 - Introduction](/post/browser-extn-intro/)