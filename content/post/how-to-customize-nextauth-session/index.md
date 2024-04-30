+++
title = "How to customize session data in NextAuth"
description = "Discover how to build and customize authentication in your app"
date = "2024-03-22T10:25:12-07:00"
draft = false
tags = ["how-to", "building", "technology", "next-js", "modern-web-dev"]
topics = []
+++

Of late, I have been diving into [Next.js](https://nextjs.org) and absolutely loving it. I wanted to put my learnings to practice, so I started building an app to solve a personal pain point. Along the way, I wanted to add authentication for my app and decided to use [NextAuth](https://next-auth.js.org/), the go-to auth library for Next.js. Overall, it was a great experience, with a few humps along the way, but in the end, it all worked out well. In this post, I'll be sharing those experiences and learnings.

First, setting up NextAuth was a breeze, thanks to the [Next.js sample course](https://nextjs.org/learn/dashboard-app) where you build all the core pieces of a modern web app, including authentication using the NextAuth library. Plus, the documentation of NextAuth, especially the [getting started sample](https://next-auth.js.org/getting-started/example) was simple and straightforward. Within a few minutes of onboarding, I was able to implement sign-in/sign-out using the simple [Credentials Provider](https://next-auth.js.org/configuration/providers/credentials).

Next, I wanted to allow multiple users to sign-in to my app and show the data specific to each user. My database schema has a column `userId` to associate each entity to a specific user. I wanted to make this `userId` available to the components and pages across my app. Essentially, once the user logs in, I want to identify the logged-in user, fetch the user's `userId` from the database and make it available to all parts of the app. 

So, how do I do it? There were a few options at my disposal. 

The question is how to extend the `session` object and add the `userdId` property. 

## The options
One option was to use the `ReactContext` object that allows global sharing of the data. If I can store the sesion in a global context, then that would work. However, this is supported only in client components, not server components. I could circumvent this problem by [wrapping a client component that wraps a server component](https://vercel.com/guides/react-context-state-management-nextjs#rendering-third-party-context-providers-in-server-components). Also, session data has to be handled securely. So this wasn't an ideal solution.

Another option to use session cookies, as described in this video by the Vercel team - [Next.js App Router Authentication](https://www.youtube.com/watch?v=DJvM2lSPn6w). But they were using many low-level APIs and too complicated flow. I was convinced that there must be a simpler out-of-the-box solution within NextAuth itself.

After some digging, a third option presented itself and it turned out to be the best solution. Let's take a look.

NextAuth provides a `session` object containing a few user attributes like `name` and `email`. It also extends an internal object `AdapterUser` that has an `id` property, but this is internal to NextAuth and is different from the `userId` that I store in my database. So I need to add an additional property `userId` to this `session` object. Once the `userId` is there in the session, I can access it using the NextAuth API and get the`userId` anywhere I need. 

The next question is how to incorporate this `userId` property into the `session` object? I got a good starting point with these two artifacts - [this blog post by dt.in.th](https://notes.dt.in.th/NextAuthUserIdInSession)  and [this short YouTube video by Coding in Flow](https://www.youtube.com/watch?v=pEXIId2HTCk). With a bit of head scratching and few rounds of trial and error, I managed to make it work and solved the problem in a clean way! The whole process was not fully straight-forward, so it would help to understand it step by step.

## Step-by-step flow
1. Define the shape of your extended `session` object. Remember, `session` object already has the `user` property that contains `name`, `email`, and the transient `id` from the extension object `AdapterUser`. So you won't be able to add `id` property inside the `session.user` object, but you can add `userId` property at the same level as `user`. Then you can access it as `session.userId` and other properties will be `session.user.name` and `session.user.email`.

2. Incorporate the `userId` property to the `session` schema. Create a file `@types/next-auth.d.ts` with this content:

    ``` ts
    import NextAuth from 'next-auth'

    declare module 'next-auth' {
        interface Session {
            userId: string;
        }
    }
    ```
3. Implement a callback to inject the additional property `userId` into the session. In your authentication configuration file `**auth.config.ts**`, add a callback for session where you assign the userId to the session object. Here, `fetchUser` retrieves the `userId` from the database based on the user's `email`. The extended session with the `userId` property is then returned.

    ``` ts
    export const authConfig = {
        pages: {
            signIn: '/login',
        },
        callbacks: {
            authorized({ auth, request: { nextUrl } }) {
                const isLoggedIn = !!auth?.user;
                const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
                if (isOnDashboard) {
                    if (isLoggedIn) return true;
                    return false; // Redirect unauthenticated users to login page
                } else if (isLoggedIn) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            },
            // Add the userId to the session so that we can fetch data for the current user. 
            //  The extended shape of session is defined in @types/next-auth.d.ts
            async session({ session }) {
                const user: User = await fetchUser(session?.user?.email);
                session.userId = user.id;
                return session
            },
        },
        providers: [], // Add providers with an empty array for now
    } satisfies NextAuthConfig;
    ```

## Results
With these pieces in place, any component, page, or route in your app can access the `userId` as follows:

``` ts
  // items-page.tsx
  import { auth } from '@/auth';

  const session = await auth();
  const userId = session ? session.userId : "";
  csont username = session ? session.user.name : "";
```

When calling the auth() method, NextAuth invokes your callback to inject the userId and return the extended session object, ensuring access to userId in the session object.

That's all there is to it! You can customize the `session` object and add any custom data to your authenticated sessions.

## Conclusion
This experience underscored the significance of adding extension hooks in libraries and frameworks, allowing developers to customize functionality without hacking into the code. Kudos to the NextAuth team for providing an extensible library!