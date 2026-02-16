# Image and Social Card Guidelines

Use this guide for image-heavy posts and social preview metadata.

## Where to Put Images
- For page bundles (`content/post/<slug>/index.md`), keep images in the same folder as `index.md`.
- For shared/global assets, use `static/img/` and reference as `/img/<file>`.

## Recommended Image Specs
- Inline content images:
  - Preferred format: `webp` or optimized `jpg` (use `png` only when transparency is needed).
  - Practical width target: `1200` to `1800` px.
  - Practical file size target: under `500 KB` where possible.
- OG/social card images:
  - Recommended aspect ratio: `1.91:1`.
  - Recommended dimensions: `1200x630`.
  - Recommended size target: under `600 KB` (important for WhatsApp previews).

## Front Matter for OG Images
- Add `images = ["<image-file>"]` in front matter for posts that should have social card images.
- Use a file path relative to the page bundle for bundle posts.

Example:
```toml
+++
title = "Agentic Coding: The Basic Concepts"
description = "Explaining core concepts of agentic coding and when to use each one"
date = "2026-02-04T10:11:08-07:00"
draft = false
topics = ["tech-explorations", "ai"]
images = ["agentic-loop.png"]
tags = ["ai", "llm", "coding-assistants"]
+++
```

## Inline Image Markdown
- Standard inline image:
```md
![Meaningful alt text](hero.png)
![Meaningful alt text](agentic-loop.png)
```
- Include concise, descriptive alt text. Avoid empty alt text unless decorative.

## Grid Layout for Images
Use the `fluid_imgs` shortcode available in this repo.

Syntax per item:
- `"<pure-grid-class>|<image-src>|<alt-text>"`

Example (3-column on desktop, stacked on mobile):
```md
{{< fluid_imgs
  "pure-u-1 pure-u-md-1-3|image-1.png|First screenshot"
  "pure-u-1 pure-u-md-1-3|image-2.png|Second screenshot"
  "pure-u-1 pure-u-md-1-3|image-3.png|Third screenshot"
>}}
```

## Validate OG/Twitter Meta Tags
1. Run local server:
```bash
hugo server -D
```
2. Check tags with redirect-safe curl:
```bash
curl -s -L http://localhost:1313/post/<slug>/ | rg 'og:image|twitter:image|og:title|twitter:card'
```
3. Optional external validation:
- `https://www.opengraph.xyz/`
- Confirm image URL, dimensions, and preview rendering.

## Notes
- If `images` is missing, social image tags may be absent unless a site-level fallback is configured in `config.toml`.
- Keep image naming descriptive (for example `agentic-loop.png`, `step-1-create-bucket.png`).
