+++
title = "Upgrading my blog engine Hugo and content"
date = "2020-06-30T14:09:57-07:00"
draft = false
tags = ["how-to"]
topics = ["hugo"]
description = "Gotchas found while upgrading my Hugo version"
+++

Today I upgraded my [blog engine Hugo](https://gohugo.io) from version 0.30.0 to 0.73.0. It's been a while since I upgraded, so I was not sure how easy or difficult it will be. The upgrade completed quickly, but my entire home page (running locally) went blank right after the upgrade. With a good amount of googling, reading through the documentation and a few tweaks in my folder structure, I was able to bring it back up and running and published it. This post is to share my learnings from the experience hoping that it may be useful to somebody else. *Learn Teach Learn*.

## First things first - upgrade the binary
The first step is to upgrade the Hugo binary to the latest version. The detailed instructions can be found in the [Hugo website](https://gohugo.io/getting-started/installing/), I did it using the HomeBrew on my MacOS and regenerated the site:

{{< highlight sh "linenos=false" >}}
    brew upgrade hugo
    hugo server
{{< / highlight >}}

Soon after I ran that command, Hugo threw a bunch of warnings and my blog home page was blank! Let's fix them one by one.

## Fix the warnings
Hugo warns that some of the shortcodes used in the content are deprecated in the new version. 
![Warning](/img/hugo-upgrade-warning.jpg)

The first warning indicates that the `Page.RSSLink` is deprecated:

{{< highlight text "linenos=false" >}}
  WARN 2020/06/30 11:05:39 Page.RSSLink is deprecated and will be removed in a future release.
{{< / highlight >}}

This can be fixed by replacing the RSSLink as follows:
```html
  // delete the three lines below
  {{ if .RSSLink }}
  <link rel="alternate" type="application/rss+xml" title="{{ .Site.Title }}" href="{{ .RSSLink }}" />
  {{ end }}

  // add the lines below
  {{ if .OutputFormats.Get "RSS" }}
  <link rel="alternate" type="application/rss+xml" title="{{ .Site.Title }}"
    href='{{ with .OutputFormats.Get "RSS" }}{{ .RelPermalink }}{{ end }}' />
  {{ end }}
```
This had to be done in 2 partial layout files - `layouts/partials/head.html`  and `layouts/partials/social.html`.

The second warning was a lot more tricker - it says as follows, but does not give an indication of where the offending code is:
{{< highlight text "linenos=false" >}}
  WARN 2020/06/30 11:11:27 Page.Hugo is deprecated and will be removed in a future release. Use the global hugo function.
{{< / highlight >}}

It turns out that Hugo has removed the usage of `Page.Hugo` in the newer version and hence we need to is to use the `hugo` function [as described here](https://gohugo.io/variables/hugo/). Here is how to modify the file `layouts/partials/head.html`:

{{< highlight sh "linenos=false" >}}
  {{.Hugo.Generator}} // remove this line
  {{hugo.Generator}}  // add this line
{{< / highlight >}}

## Fix the blank home page
The root cause of this issue was that Hugo changed the location of the post index file from `layouts/index/post.html` to `layouts/post/post.html`. When I moved the file from old location to new, viola! my home page was up and running again

## Miscellaneous Issues & Goodness
There were a few more issues most of which were easy to fix:
- All external hyperlinks that were using the href tag in the markdown were broken since Goldmark has a better way to open external links. The concept is called Render Hook Templates which allow you to define templates to render a link, image etc. and add them to the folder `layouts/_default/_markup`. So I added a file named `render-link.html` in the folder with the following content:
{{< highlight html "linenos=false" >}}
<a href="{{ .Destination | safeURL }}"{{ with .Title}} title="{{ . }}"{{ end }}
    {{ if strings.HasPrefix .Destination "http" }} target="_blank" rel="noopener"{{ end }}>
    {{ .Text | safeHTML }}
</a>
{{< / highlight >}}

  With this, I could simply update my content as follows, which will open the link in a new tab:
{{< highlight md "linenos=false" >}}
  [my github repo Book Learnings](https://github.com/annjose/book-learnings)
{{< / highlight >}}

  Go on, click this link and try it out - [open in new tab](https://github.com/annjose/book-learnings).

- The new Hugo version has changed the markdown generator from Blackfriday to [Goldmark](https://gohugo.io/getting-started/configuration-markup#goldmark) which is faster and more flexible option. 
- It uses Chroma syntax highlighter that provides a more flexible support for highlighting code that can be configured in the config.toml as follows:
    ```toml
    [markup]
        [markup.highlight]
            codeFences = true
            lineNos = true
            style = "dracula"
    ```

- After adding this config, I updated all the content to use the correct syntax-highlighting language. The full list of the languages supported are [listed in Hugo docs](https://gohugo.io/content-management/syntax-highlighting/#list-of-chroma-highlighting-languages). You can highlight a block of code by either using the 3 backtock method or using the [built-in `highlight` shortcode](https://gohugo.io/content-management/syntax-highlighting/#highlight-shortcode).

## Wrapping Everything Up
Armed with all the goodness of Goldmark and the new version of Hugo, I updated my entire content to fix broken links, adjust syntax highlighting and applied some styling tweaks like adding the Avenir font and some subtle contrast coloring in the page. Overall, it feels good and I got a deeper understanding of Hugo and my blog under-the-hood. Check it out at [Home](/).