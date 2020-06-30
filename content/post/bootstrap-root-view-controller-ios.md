+++
title = "Bootstrapping Root View Controller in iOS Apps"
date = "2018-11-22T15:56:54-08:00"
draft = true
tags = []
topics = []
description = "Learn the different ways in which you can bootstrap the main UI of iOS application"
+++

Over the last few years as an iOS developer, I have come across different ways to bootstrap the main UI (Root View Controller) of the application and it was hard for me to what is the best way to do it in a loosely coupled manner and without causing memory leaks or retain cycles. After reading many articles and tutorials (special thanks to ), I think finally I understand this concept now. Thanks to 

Root view controller provides the content view of the window and is available as the  property `rootViewController` on `UIWindow`. When you set any view controller to this property, iOS will install that view controller's view as the content view of the window such that it will adjust its size as the window wize changes.
This root view controller has special significance when it comes to application startup.

