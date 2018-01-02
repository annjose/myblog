+++
title = "Fastlane"
date = "2017-12-23T12:02:23-08:00"
tags = ["iOS", "fastlane"]
topics = []
description = "Fastlane - an intro and sneak peek"
+++

[Fastlane](https://fastlane.tools/) is a suite of simple yet powerful tools to automate building and releasing iOS and Android apps. It takes care of the mundane tasks of mobile application development like generating screenshots, managing provisioning profiles, code signing, beta deployments and releasing the application. It is very popular in the mobile developer community and the best part - it is completely open source.

## The Toolchain
fastlane comes out-of-the-box with a set of very good tools (better known as *actions*) such as:

* **produce** - create new iOS apps on iTunes and Apple Developer portal. The Android equivalent is *supply*.
* **gym** - builds the iOS app using Xcode build tools
* **scan** - runs the tests of iOS / Mac app
* **snapshot** - takes localized screenshots of the iOS app on every device (this is a painstaking task to do manually). The Android equivalent is *screengrab*.
* **deliver** - a single commmand to upload screenshots, metadata and the app to the AppStore
* **pilot** - manages the TestFlight testers and builds (TestFlight is Apple's beta deployment tool)
* **supply** - updates metadata and apps of Android apps

Here is the classic fastlane diagram that shows some of the main built-in actions: 
{{< fluid_imgs
  "pure-u-1-1|/img/fastlane-overview.png|Fastlane"
>}}

In addition to these built-in tools, fastlane provides an extension model that allows anyone to create plugins like *firebase*, *aws_s3*, *mobile_center* etc. See the full list of plugins at https://docs.fastlane.tools/plugins/available-plugins/.

## Getting Started
It is very easy to get started with fastlane. Follow the instructions for [iOS setup](https://docs.fastlane.tools/getting-started/ios/setup/) or [Android setup](https://docs.fastlane.tools/getting-started/android/setup/). As described towards the end of those documents (see section *Use a Gemfile*), it is recommended that you use a Gemfile to define the fastlane version and its dependencies in a versioned manner.

Once the installation is done, you can create a configuration file named *Fastfile* in the root folder of your application and define the *lanes* with a set of actions. In fastlane, lanes are just a collection of actions grouped together so that they can be executed as a single command. It is recommended that all the fastlane configuration files are checked-in to the source repo. Refer this link to set up your *.gitignore* correctly for fastlane - https://docs.fastlane.tools/best-practices/source-control/.

Here is an example of a Fastfile that defines two lanes - one for the **beta** deployment and another for AppStore **release**.
``` ruby
lane :beta do
  increment_build_number    # increment the build number before building the final version
  build_app                 # build the app using gym
  upload_to_testflight      # upload the binaries to TestFlight
end

lane :release do
  capture_screenshots
  build_app
  upload_to_app_store       # Upload the screenshots and the binary to iTunes
  slack                     # Let your team-mates know the new version is live
end
```

Now you can execute each of the lane by running one of the following commands from your terminal:

``` bash
>> fastlane beta

>> fastlane release
```

## Advantages of fastlane
* Easy to get started - just do the one-time setup, add a fastfile and you are done
* Integrates well with existing tools and services like TestFlight, HockeyApp, SonarQube, gradle etc.
* Integrates well with exall major CI systems like Jenkins, CircleCI, Travis
* Supports a wide range of capabilities through 170 actions https://docs.fastlane.tools/actions. There is an action for everything that you can think of - yes of course for clearing derived data too :-)
* Easy to extend and customize actions as needed
* Custom private lanes / actions for custom scripts
* 100% open source under MIT license - https://github.com/fastlane/fastlane

## Advanced Concepts
Fastlane supports some cool features that are very helpful in managing mobile applications.

* Pass parameters to your lane from command line
* Private lanes
* Retrieve the return value of a lane by reading the last line of the lane
* Code blocks that will be called before and/or after any lane is called - **before_each** and **after_each**
* Helper class UI that provides interaction with the user - for example *UI.message*, *UI.error*, *UI.confirm* etc.
* Import fastfile from another fastfile available in a local folder or another git repository.
