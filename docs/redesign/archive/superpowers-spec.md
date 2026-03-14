# Blog Redesign — Phase 1 Design Spec

**Date:** 2026-03-12
**Status:** Approved
**Author:** Ann Catherine Jose (brainstormed with Claude Sonnet 4.6)

---

## Overview

Redesign `annjose.com` from Hugo + Blackburn theme to Astro 6.0 + Tailwind CSS, deployed on Cloudflare Pages. Phase 1 delivers the fully migrated blog, all core blog features, and an About page. Later phases add Projects, a comment system, and authenticated/GUID-based routes.

---

## Scope

### Phase 1 (this spec)
- Astro 6.0 project setup with Tailwind CSS and Astro Paper as base theme
- Full content migration: all 59 posts from Hugo to Astro content collections
- Blog features: syntax highlighting, sticky TOC, tags + tag cloud, next/prev links, OG images
- About page (Sectioned Profile layout)
- Cloudflare Pages deployment (replacing GitHub Pages)

### Out of scope (later phases)
- **Phase 2:** Projects page (timeline list, Markdown + rich content per project)
- **Phase 3:** Comment system (custom, lightweight, no Disqus)
- **Phase 4:** Authenticated routes and GUID-based private page access

---

## Architecture

### Repo Strategy: In-Place Migration

The existing `annblog` repo is transformed in place. Before starting:
1. Tag the current state: `git tag hugo-final`
2. Remove Hugo artifacts: `themes/`, `config.toml`, `deploy.sh`, `resources/`, `public/` submodule
3. Initialize Astro at the repo root
4. Migrate `content/` into Astro's structure

The existing `docs/` directory is retained and updated to reflect the new stack.

### Project Structure

```
annblog/
├── src/
│   ├── content/
│   │   ├── blog/                  ← migrated from content/post/
│   │   │   └── config.ts          ← Zod schema for post frontmatter
│   │   └── pages/
│   │       └── about.md           ← About page content + frontmatter
│   ├── components/
│   │   ├── TableOfContents.astro  ← sticky TOC, IntersectionObserver
│   │   ├── TagCloud.astro         ← tag cloud sized by post count
│   │   ├── PostCard.astro         ← post listing card
│   │   └── PostNav.astro          ← next/prev navigation
│   ├── layouts/
│   │   ├── BaseLayout.astro       ← head, nav, footer, dark mode
│   │   └── BlogPostLayout.astro   ← post content + TOC sidebar
│   ├── pages/
│   │   ├── index.astro            ← homepage with post list
│   │   ├── about.astro            ← About page
│   │   ├── post/
│   │   │   └── [slug].astro       ← individual post pages
│   │   └── tags/
│   │       ├── index.astro        ← tag cloud / all tags page
│   │       └── [tag].astro        ← posts filtered by tag
│   └── styles/
│       └── global.css             ← Tailwind base + custom overrides
├── public/                        ← static assets (replaces static/)
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

### Content Collections

Astro content collections replace Hugo's content system. Each blog post is a collection entry validated by a Zod schema.

**Post frontmatter schema (YAML):**
```yaml
---
title: string (required)
description: string (required)
date: Date (required)
draft: boolean (default: false)
tags: string[] (default: [])
ogImage: string (optional) ← maps from Hugo's `images` field
---
```

Hugo posts use TOML frontmatter (`+++`). Migration converts all to YAML (`---`). The `topics` field (legacy, mostly empty) is dropped.

### URL Preservation

Current posts live at `/post/[slug]/`. Astro serves them at the same paths via `src/pages/post/[slug].astro`. No redirects needed — all existing links remain valid.

---

## Visual Design

### Base Theme

Astro Paper is used as the starting point and customized. It provides: light/dark mode toggle, mobile responsiveness, post listing, tag pages, and OG image generation out of the box.

### Color Palette: Warm & Earthy

| Role | Light mode | Dark mode |
|---|---|---|
| Accent | `#c2410c` (burnt orange) | `#c2410c` |
| Background | `#faf7f5` (warm white) | `#1c1917` (warm black) |
| Text | `#1c1917` | `#faf7f5` |
| Muted text | `#78716c` | `#a8a29e` |
| Tag background | `#fff7ed` | `#292524` |
| Tag border | `#fed7aa` | `#44403c` |

### Typography

- **Headings:** [Lora](https://fonts.google.com/specimen/Lora) via Google Fonts (serif)
- **Body:** System UI sans-serif stack for readability
- **Code:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts (monospace)

### Layout

- **Blog post page:** Main content column (~65% width) with sticky TOC on the right (~25%) on desktop. Single column on mobile.
- **Homepage:** Post list with PostCard components, tag cloud in sidebar (desktop) or below list (mobile).
- **Whitespace:** Generous line height (1.75), comfortable paragraph spacing. Not overcrowded, not excessive empty margins.

---

## Blog Features

### Syntax Highlighting

- Engine: Shiki (Astro built-in, zero client JS)
- Dark mode theme: `dracula` (matches current setup)
- Light mode theme: `github-light`
- Line numbers enabled

### Table of Contents

- Parses `<h2>` and `<h3>` headings from post content
- Renders as a sticky sidebar component on desktop (follows scroll)
- Active section highlighted using `IntersectionObserver`
- Collapses to an inline dropdown on mobile
- Only shown on posts with 3+ headings

### Tags

- Each tag gets a `/tags/[tag]` listing page
- Tag cloud on `/tags/` index page — tag size proportional to post count
- Existing taxonomy slugs preserved exactly (e.g., `tech-explorations`, `llm`)
- Display label lookup map lives in `src/data/tagLabels.ts` — a plain exported object mapping slug → display string. Migrated from the existing Hugo theme overrides (e.g., `llm` → `LLM`, `ai` → `AI`, `rag` → `RAG`).
- Tags shown on post cards and at top of post pages

### Next / Previous Navigation

- At the bottom of each post: links to chronologically adjacent posts
- Shows post title for each link
- Sorted by date descending

### OG Images

- Posts with an `ogImage` frontmatter field use that image
- Posts without one get Astro Paper's built-in generated OG card (post title + site name)
- `<meta>` tags for Open Graph and Twitter Card in `BaseLayout`

---

## About Page

### Layout: Sectioned Profile

The About page content lives at `src/content/pages/about.md` as a formal Astro content collection entry (defined in `src/content/config.ts` with its own Zod schema). The `about.astro` page in `src/pages/` uses `getEntry('pages', 'about')` to load it. Frontmatter provides structured data; the markdown body is the prose bio.

**Frontmatter schema:**
```yaml
---
name: string
tagline: string          ← shown under the name
photo: string            ← path to profile photo
interests: string[]      ← rendered as accent-colored tags
currently: string        ← short "what I'm working on now" blurb
social:
  bluesky: string
  linkedin: string
  github: string
---
```

**Visual structure:**
1. Photo + name + tagline at top
2. Prose bio (markdown body)
3. "What I work on" section — interest tags with burnt orange accent
4. "Currently" section — short blurb
5. Social icon links

Each section has a left accent border in burnt orange. The layout is single-column, centered, max ~700px wide.

---

## Deployment

### Cloudflare Pages

The GitHub repo is connected to Cloudflare Pages. Every push to `master` triggers an automatic build and deploy.

**Build configuration:**
- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist/`
- Node version: 20

**What is removed:**
- `public/` git submodule (old GitHub Pages output repo)
- `deploy.sh` script
- GitHub Pages configuration

### DNS Cutover Sequence

1. Tag current Hugo state: `git tag hugo-final`
2. Set up Astro in the repo; connect to Cloudflare Pages (deploys to `*.pages.dev` while building)
3. Build out all Phase 1 features; test on `*.pages.dev`
4. When ready: move `annjose.com` nameservers to Cloudflare
5. Cloudflare Pages serves the site with automatic TLS

Preview deployments are available automatically for feature branches.

---

## Content Migration Details

### Hugo → Astro Mapping

| Hugo | Astro |
|---|---|
| `content/post/[slug]/index.md` | `src/content/blog/[slug]/index.md` |
| `content/post/[slug].md` | `src/content/blog/[slug].md` |
| `static/img/` | `public/img/` |
| Colocated post images | Stay colocated with post bundle |
| TOML frontmatter (`+++`) | YAML frontmatter (`---`) |
| `images = ["hero.png"]` | `ogImage: "hero.png"` |
| `topics` field | Dropped |
| `draft = true` | `draft: true` |

### Slug Preservation

Post slugs are derived from the file/directory name, matching Hugo's behavior. No URL changes.

### Migration Tooling

Frontmatter conversion (TOML `+++` → YAML `---`, field remapping, dropping `topics`) is done by a one-off Node.js migration script (`scripts/migrate-hugo-to-astro.js`) run locally before committing migrated content. This avoids 59 manual edits and produces consistent output.

### Post Count

59 post files across 29 directories. All migrated in Phase 1.

---

## What Is Not Changing

- Site title: "Reflections"
- Author: Ann Catherine Jose
- Domain: annjose.com
- Tag taxonomy slugs (all lowercase, canonical)
- Tag display label mapping (LLM, AI, RAG, etc.)
- Analytics: Google Analytics (G-2PEL4BVYJE) — GA script tag added to `BaseLayout.astro`
- Social profiles: Bluesky, LinkedIn, GitHub, Hacker News

---

## Future Phases Summary

| Phase | Scope |
|---|---|
| 2 | Projects page — timeline list, Markdown + rich content per project |
| 3 | Comment system — custom, lightweight, spam-resistant, no Disqus |
| 4 | Authenticated routes + GUID-based private page access |
