+++
title = "Tinkering with VS Code, Mac and C++"
date = "2020-06-29T22:32:55-07:00"
draft = false
tags = ["tech-explorations","how-to"]
topics = ["visual-studio-code","c++"]
+++

After a long time, I got some time to tinker with something fun and learn from it, thanks to the week-long break from work. The task at hand is to set up Visual Studio for Mac to compile/run/debug C++ programs. Why, you may wonder - because I wanted to read and learn from the book [Data Structures and Algorithms in C++](https://www.amazon.com/Data-Structures-Algorithms-Adam-Drozdek-dp-1133608426/dp/1133608426) by Adam Drozdek. For the past few months, I was having a craving to learn something new and became curious when I saw this book on my shelf. 

My goal is to configure Visual Studio for Mac for C++. The first step is to install the C/C++ extension for VSCode, which was pretty straight-forward [as described in these instructions](https://code.visualstudio.com/docs/languages/cpp). Note that this extension does not include the compiler and debugger, so we need to install them on our own and configure the extension to use them. Good news is that **Clang** is already available on my machine as part of the Xcode toolchain.

Configuring VS Code to use Clang is [described well in this official documentation](https://code.visualstudio.com/docs/cpp/config-clang-mac), well all except one thing. The article explains how to write a simple C++ program compile and run it from within VS Code using the `tasks.json` config file. It goes on to explain how to debug the code as well, which opened up one of the rabbit holes for me because of a subtle nuance in the description. Basically, the debug configuration is defined in `launch.json` file which includes a `preLaunchTask` whose value should match the name of the task in the `task.json` file. This was not called out in the steps, and I was confused by the compiler error that said that C++ 11 extensions cannot be used, even though I had configured my `tasks.json` to use the C++ 17 compiler. After some digging around, the correlation between the two files became clear to me and viola, everything started working. I was able to debug, put breakpoints, step through/over C++ code, all within Visual Studio Code.

I spent the next couple of hours writing the notes and trying out the exercises in the first chapter of the book. I am writing all the notes and code in [my github repo Book Learnings](https://github.com/annjose/book-learnings). Lookign forward to learning a lot this week and enjoying the happy place!