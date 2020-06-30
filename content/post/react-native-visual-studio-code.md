+++
date = "2016-04-13T21:22:02-07:00"
draft = false
title = "ReactNative in Visual Studio Code"
tags = ["mobile-tech","tech-explorations"]
topics = ["react-native","visual-studio-code"]
+++

I have been thoroughly enjoying working on [ReactNative](https://facebook.github.io/react-native/) projects, but was disappointed by the lack of a good debugging environment. I had tried multiple solutions like [Nuclide](http://nuclide.io/) (which I found it to be very slow), WebStorm with JSX plugins (which is mainly syntax recognition). So I had to always launch the app from Xcode/Android Studio, then attach Chrome Dev tools and keep switching between all three for debugging. This was frustrating, but there is hope...

[ReactJS conference in February](http://www.reactnative.com/react-native-tools-extension-for-visual-studio-code/) announced the release of [ReactNative extension](https://github.com/Microsoft/vscode-react-native) for [VisualStudio Code](https://code.visualstudio.com/), the lightweight editor by Microsoft. The name 'Visual Studio' may sound heavy, but **VS Code** is a completely new editor built from ground-up based on Electron. It is super fast, flexible, configurable and Open Source too! The ReactNative extension for VS Code supports intellisense, ability to run react-native commands and most importantly, full-fledged debugging experience - yeah yeah breakpoints, call stack and stuff :-)

I tried to code this [ReactNative tutorial by Ray Wenderlich](https://www.raywenderlich.com/126063/react-native-tutorial) in VS Code using this extension and it was absolutely brilliant. The UI is very clean, clutter-free with subtle yet vivid colors. As soon as I opened the starter project, it recognized that it is a ReactNative project and got it ready to go. Then I simply put a breakpoint and hit the Debug Run button and Viola! - my app started and the breakpoint was hit. I can step through code, inspect callstack, local variables, debug console etc. all in one place!

{{< figure src="/img/ReactNativeInVSCode.png" title="ReactNative extension in VS Code" >}}
