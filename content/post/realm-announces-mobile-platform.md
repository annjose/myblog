+++
date = "2016-09-27T08:22:02-07:00"
draft = false
title = "Realm Mobile Platform"
tags = ["mobile-tech","tech-explorations"]
topics = ["realm"]
+++

[Realm](https://realm.io) is a company that I respect a lot because of their support for mobile developers and the open nature nature of their offerings. Their easy-to-use, blazingly fast [Mobile database](https://realm.io/products/realm-mobile-database/) software supports all mobile platforms - iOS, Android, React Native and Xamarin, in Java, ObjC, Swift and C#. 
That is why I am happy to see that today they announced [Realm Mobile Platform](https://realm.io/news/introducing-realm-mobile-platform/) that combines Realm client side database with server-side technology (Object Server as they call it). This platform provides the base infrastructure for mobile apps to support offline sync, that enables end users to interact with the app even when there is no network connection. 

According to the article, this a highly performant solution because of the following reasons:

* Object Server does not use any ORM, just plain objects
* data objects on the device are always kept in sync with server
* during sync, only the changes in the objects are transmitted

In my understanding, the direct equivalent of the Realm Mobile Platform is the [Offline Sync capability of Azure Mobile Apps](https://azure.microsoft.com/en-us/documentation/articles/app-service-mobile-offline-data-sync/). Both platforms follow the same model and have very comparable features. That is is a good thing, because as developers, we have multiple options to choose from.

The client-server offline sync is an interesting area that we have been exploring for an app that we are working on. It turns out that Realm Mobile Platform and Azure Mobile Apps are two good choices. If you know of more options, please let me know in the comments below.

{{< figure src="/img/RealmAzure.png" title="" >}}

