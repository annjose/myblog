+++
title = "Next.js - Migrate from Pages to App Router"
description = "A step-by-step guide with lessons and gotchas for a smooth migration"
date = "2024-06-05T12:42:25-07:00"
draft = false
tags = ["tech-explorations", "how-to", "web-development", "next-js"]
topics = []
+++

A few months ago, Next.js introduced **App Router**, a new way to build React applications using the latest features like React Server components and streaming. This was included in Next.js version 13 and is meant to replace the **Pages Router** eventually. I have been using the App Router for all my [builder projects](/post/learning-to-building/) for a while now. In fact, I usually kicked off projects with the standard `create-next-app` script that starts a new app from scratch. 

This worked well, until....

I started a new project to build a photo gallery app that sprouted from the need to manage all the photos taken from my recent Europe trip. Instead of relying on platforms like Google Photos and One Drive, I wanted to build an app to view and share photos hosted on a server of my choice. It is a fun privacy-focused project that could be useful for others too.

Rather than starting with the usual create-next-app tookit, I decided to find a good image gallery template that uses Next.js and Tailwind CSS as a starting point. Luckily, I found a good one in the [Vercel template gallery](https://vercel.com/templates/next.js/image-gallery-starter). The only catch was, it used the traditional Next.js Pages router instead of the newer App router approach. I knew I would tweak the code extensively, so I decided to migrate to the App router right away. 

I managed to migrate the app within a couple of hours of coding, but learned a lot along the way. As always, a good learning experience is worth sharing and hence this post to outline the process and the lessons/gotchas I encountered along the way.

## How to migrate
Let's go through the steps one by one.

### Step 1: Understand the differences between Pages and App router
If you are not familiar with Pages or App router, it is best to read a brief introduction about them so that you have a solid foundation for the migration process. Of course, GitHub Copilot and ChatGPT will help with the migration, but it is important to understand what it does under the hood and you can navigate the changes well.

Here are a few key differences to understand:
1. **Client/server components**: In Pages router, all components are considered to have client-side interactions and hence are client components by default. They are pre-rendered on the server, but React has to perform hydration to attach the event handlers. In App router, there is an explicit distinction of server components (default) client components (explicitly marked with 'use client' directive).
2. **Folder structure**: Pages are stored in pages folder in the root of the application, where each page corresponds to a route in the application (eg: `pages/about.tsx` corresponds to the route `/about`). App pages are in the app/ folder in the root of the application. The file corresponding to the route `/about` is in `app/about/page.tsx`.
3. **Data Fetching**: Pages router had several data fetching methods including `getStaticProps`, `getServerSideProps`, and `getStaticPaths`. In app router, data can be fetched in any server component or in server actions, and the data can be passed as props to the client components.
3. **Custom routing**: App router uses custom routing mechanism that allows more dynamic routing, handling query parameters and nested routes.
4. **Built-in SEO**: App router introduces built-in SEO using regular HTML tags to handle metadata, making the `next/head` component of Pages redundant.

### Step 3: Upgrade to Next.js version 13
App router was introduced in Next.js 13, so you need to upgrade to that version and the corresponsing minimum React version v18.17.
``` sh
npm install next@latest react@latest react-dom@latest
```

### Step 2: Migrate the _app, _document pages to root layout
1. Create a new folder named `app` in the root of the project (same level as the pages folder)
``` sh
project-root/
  |- pages/
  |   |- ...
  |- app/
  |   |- layout.tsx
  |   |- page.tsx
  |- ...
```

2. Migrate /pages/_document.tsx to /app/layout.tsx - define a new function `RootLayout` that takes in a parameter `children` of type `React.ReactNode`.
``` tsx
import "../styles/index.css";

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-black antialiased">{children}</body>
        </html>
    )
}
```

### Step 4: Migrate each page from /pages to /app
1. For each page in the pages folder (eg: pages/foo.tsx), create a corresponding folder in the app folder (eg: app/foo). 
2. Copy the file `foo.tsx` from `pages/` folder to the new `app/foo` folder.
3. Rename the copied file `foo.tsx` to `page.tsx`.
4. Replace usage of `next/head` with the built-in `Metadata` [objects and functions](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
5. Separate out the data fetching logic into a server component
6. Pass the data as props into the client components. 

Repeat this process for all the pages. Note that App router treats all components are server components by default, but you can nest client components inside server components, and thus get the best performance.

### Step 5: Remove old code
Remove any remaining usage of Pages router and related files. Build the app for production using `next build` and make sure everything works fine.

## Gotchas
Here are a few changes that were tricky to migrate:

* `userouter` hook has moved from `next/router` to `next/navigation`. The `pathname` string is replaced by a new hook `usePathname()` and `query` is replaced by `useParams` for dynamic route params and `useSearchParams` for query parameters.

* The signature and behavior of `router.push` method has changed. It now accepts fewer parameters, and the option for shallow rendering has been removed. However, you can achieve similar behavior using the [native window History API](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api). 

## Learnings and pleasant surprises

* Next.js provides a [helpful migration guide]((https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)) that makes it easy to understand the changes.
* Next.js documentation has dedicated sections for Pages router and App router for each of the features. So you can always switch back and forth between the two methods.
* You can migrate your app incrementally rather than a giant one-shot upgrade. The app directory works alongside the pages directory, so it is super easy.
* Upgrading to Next.js 13 does not require using the new app directory. You can continue using pages with new features that work in both directories, such as the updated Image component, Link component, Script component, and Font optimization.
* The Pages Routing system is simple, intuitive and effective. App Routing system is more capable and advanced, albeit with a steeper learning curve.

## References
* The official Next.js guide to migrate from Pages to App router - [App router incremental adoption guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
* A good video by Lee Robinson, the VP of Product at Vercel - [Incrementally adopt the Next.js App Router](https://www.youtube.com/watch?v=YQMSietiFm0)
* Another good migration guide by [Clerk.com](https://clerk.com/blog/migrating-pages-router-to-app-router-an-incremental-guide)