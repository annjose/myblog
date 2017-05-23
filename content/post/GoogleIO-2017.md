+++
date = "2017-05-23T03:37:57-07:00"
draft = false
title = "GoogleIO 2017"
categories = [
  "Mobile Development",
  "Android"
]
+++

I had the wonderful opportunity to attend Google I/O last week and absolutely loved it. I learned a lot of things during the three days. Btw, it was tiring too with the continuous sessions and the sunny Sun. 

This post is an attempt to share the main highlights and the announcements that I found interesting. If you attended the event or watched the sessions online, let me know if there were more things that you found interesting.

## Main theme: Mobile First to AI First
Google announced the major shift to AI First, which was quite evident in all the announcements across all products. Every product announced 'smart' capabilities that harness the power of machine learning algorithms that learn on their own and improve over time.
* Google's image recognition success rate has surpassed that of humans
* Voice is becoming an important part of many Google products
* Android running on 2B monthly active devices

## Google Lens
Google Lens is a new set of advanced image recognition capabilities with AI. It understands an image and display relevant content (eg: if you point it to a flower, it can name the flower; point to a restaurant photo and it shows the location, directions, ratings of the restaurant). It is integrated into Google Photos and Google Assistant

## Google Assistant
* Available on iOS (can be downloaded as an app)
* Google Lens is integrated into it
* supports visual translation (point camera to Japanese word and it would translate and take actions)
* answers questions with context and based on previous questions
* SDK available for developers to build 'actions' and integrate their services to Google Assistant
* Out-of-the box support for integration with http://api.ai for NLP
* https://developers.google.com/actions/

## Google Home
* Proactive assistant (provides info proactively based on the context)
* Hands-free calling to all US/Canada numbers
* support multiple users
* Stream visual responses that directs the responses to the right display (Tv / phone)

## Android O
* Android O is in Beta now. The main features include..
* Significant performance improvement in the OS as well as the applications through concurrent compact GC and code locality. All apps run faster and smoother without any modifications.
* Improved notification panel, notification dots, app-specific notification channels
* picture-in-picture (multi-window mode mostly usable for video playback)
* Downloadable Fonts - on-demand download of fonts instead of bundling with APK
* Autofill framework - Apps can provide hints about the input types, mark important fields etc.
* New WebView APIs to enhance security and stability
* New capabilities to reduce APK size – some are out-of-the-box; some needs modifications in the app. 7-minute workout app that participated in the pilot found a reduction of almost 48%.
* https://developer.android.com/preview/index.html
* https://developer.android.com/preview/features/autofill.html

## Kotlin Support
* Android will support Kotlin as first-class language.
* new language (6 years old) widely popular in Java community. Mature and production ready.
* expressive, concise, extensible, powerful, supports modern paradigms like immutability, higher order functions
* open source, 100% interoperable with Java, works side by side with existing Java code, easy migration path
* Good tooling support for migration and refactoring built into Android Studio
https://developer.android.com/kotlin/index.html

## Android Instant Apps
* These are lightweight native apps that run on the phone without installation and are accessible through a deep link URL. When the user taps on a link, they are taken directly to a specific view / activity. Smooth transition without any install friction. Google Authentication and Android Pay work seamlessly in these apps.
* This is a powerful concept that brings the web application's power of Reach to mobile native apps. A great way to acquire new users and build better engagement.
* Developers can upgrade their existing Android app to instant app by modularizing the app into smaller modules. No need to maintain two code bases.
* Short video - Introducing Android Instant Apps - Google I/O 2016
* Details at https://developer.android.com/topic/instant-apps/index.html

## Google Photos
* search photos using words that indicate the context of the photo
* Suggested sharing - suggests whom to send the photo to
* Shared libraries, printed photo books

## Android Go
* version of Android that is optimized for entry-level devices with limited data connections
* Google's new strategy to reach the next billion devices

## Cloud TPU
* new chip designed for machine learning available on Google Cloud platform
* very powerful compute capability that can train and run heavy machine learning models
* poised to attract all AI research to be done on the Google Cloud Computing Platform
* integrated with TensorFlow, Google's machine learning library
https://cloud.google.com/tpu/

## Other
* TensorFlow available for mobile (Android and iOS SDKa available) https://www.tensorflow.org/mobile/
* Standalone VR headset
* Android Architecture Components - a set of libraries that follows best practices of lifecycle management, data persistence https://developer.android.com/topic/libraries/architecture/index.html
* Room – Android’s new object mapping library for SQLite https://developer.android.com/topic/libraries/architecture/room.html

## More Fun Stuff
* QBSE was featured in one of the sessions as the industry leading mileage tracking app https://twitter.com/annjose/status/865693733475368960
* Google Photos presenter took photo with cut-outs of his children and selfie with the audience to demo how Google Photos the shared libraries and the auto-sync works for specific people
* High school student from Chicago built a machine learning app using TensorFlow that detects breast cancer faster and better accuracy
* SlowMo guys did a live YouTube video stream to demo SuperChat (see the mark 1:07:07 in keynote video Google I/O Keynote (Google I/O '17) )
* Codelabs - https://codelabs.developers.google.com/io2017