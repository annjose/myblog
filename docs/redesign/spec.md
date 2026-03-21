# Blog Redesign: Hugo to Astro Migration Spec

> **Companion document**: [Wave 1 Implementation Plan](./wave-1-plan.md) — step-by-step execution checklist for this spec.

## Context

The blog at annjose.com ("Reflections" by Ann Catherine Jose) runs on Hugo with the Blackburn theme, deployed to GitHub Pages. It has 58 posts (28 page bundles + 30 single-file), tags/topics taxonomies, Disqus comments, and custom routes (/ammachi/, /epsilla/). The goal is to modernize with Astro + Tailwind CSS, hosted on Cloudflare Pages, using AstroPaper as the starting template.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Base template** | AstroPaper (as Astro template, not fork) | `pnpm create astro@latest --template satnaing/astro-paper` |
| **Package manager** | pnpm | Faster installs, stricter dependency resolution, disk-efficient; AstroPaper's own repo uses pnpm |
| **Astro version** | Start on Astro 5 (AstroPaper's current base), upgrade to Astro 6 before launch | AstroPaper not yet updated for Astro 6; mechanical upgrade path exists |
| **Hosting** | Cloudflare Pages (static output for Wave 1) | Free, fast CDN, supports SSR later for auth |
| **Comments** | Static embed of old Disqus comments + Giscus for new posts | Preserves history, no Disqus dependency going forward |
| **Migration** | All 58 posts migrated | No content left behind |
| **Topics taxonomy** | Merge into tags (deduplicate) | Simplifies architecture, one taxonomy system |
| **URL scheme** | New posts at `/blog/<slug>/`, 301 redirects from `/post/<slug>/` | Cleaner URLs, old links preserved via Cloudflare redirects |
| **Repo strategy** | Same repo (rename `myblog` → `annjose.com`), new `astro` branch | Preserves full git history; merge to main when ready |
| **Branch name** | Rename `master` → `main` during final merge | Modern convention; done as part of cutover |
| **Coexistence** | Old Hugo site stays live at `annjose.com`; new Astro site tested at Cloudflare Pages preview URL | DNS cutover only when new site is fully validated |
| **Deployment strategy** | Deploy to Cloudflare Pages at end of bootstrap, then continuously at each milestone | Catches integration issues early; no big-bang deploy at the end |
| **Analytics** | Counterscale (existing, self-hosted on Cloudflare Workers) | Privacy-friendly, already set up, no Google Analytics needed |

## Scope: Wave 1 vs Wave 2

**Wave 1 (Initial Launch)**: Core site + blog migration + deployment
- Site scaffolding and configuration
- Content migration: all 58 posts + existing pages (/about, /ammachi, /redesign). Excluded: /bluesky, /image-test (test pages), /epsilla (outdated, no traffic)
- Blog features: TOC, tags, comments, search, prev/next, OG images
- RSS feed migration (preserve existing feed URL for subscribers)
- Design: custom color palette, fonts, wider layout, light/dark mode
- Analytics: Counterscale migrated to Astro
- Automated tests (Playwright e2e + Lighthouse CI)
- Deployment to Cloudflare Pages
- DNS cutover

**Not doing in Wave 1**:
- Reading time — not distinctive enough to justify the remark plugin, schema, and component work
- Epsilla page (`/epsilla/`) — outdated product evaluation with no analytics traffic; Hugo source preserved in git history

**Wave 2 (Enhancements)**: After Wave 1 is stable
- Projects page (side projects & open source, card grid layout)
- Atom feed (`/atom.xml`) — evaluate alongside existing RSS
- Auth for private routes (Cloudflare Access or Workers)
- GUID-based secret URLs
- Additional routes: `/books`, `/notes`, `/photos`
- Newsletter integration
- SSR adapter (if server-rendered routes needed)

---

## Architecture

### Repo Strategy

1. Rename GitHub repo: `myblog` → `annjose.com`
2. Create `astro` branch from `master`
3. All Astro work happens on `astro` branch
4. Hugo `master` branch remains untouched and deployable throughout
5. At launch: merge `astro` into `master`, rename `master` → `main`
6. Safety: if anything goes wrong, `master` with Hugo is always available

### Content Collections

**Blog collection** — extends AstroPaper's existing schema:

```yaml
---
title: string (required)
description: string (required)
pubDatetime: Date (required)
draft: boolean (default: false)
tags: string[] (default: [])
ogImage: string (optional)
author: string (default: "Ann Catherine Jose")
disqusSlug: string (optional)  # links archived comments
---
```

### Taxonomy: Tag Display Labels

Standard approach: lowercase slugs in URLs, display labels in UI.
- URLs/slugs: always lowercase with hyphens (`/tags/llm/`, `/tags/web-development/`)
- Display: acronyms uppercase ("LLM", "AI", "RAG"), phrases title-cased ("Tech Explorations", "Personal Growth")
- Preserves conventions from `docs/taxonomy-conventions.md`
- Implementation: lookup map in `src/utils/tagLabels.ts` — if tag has custom label, use it; otherwise auto-title-case the slug

---

## Visual Design

### Color Palette: Warm & Earthy

| Role | Light mode | Dark mode |
|---|---|---|
| Accent | `#c2410c` (burnt orange) | `#c2410c` |
| Background | `#faf7f5` (warm white) | `#1c1917` (warm black) |
| Text | `#1c1917` | `#faf7f5` |
| Muted text | `#78716c` | `#a8a29e` |
| Tag background | `#fff7ed` | `#292524` |
| Tag border | `#fed7aa` | `#44403c` |

AstroPaper uses RGB triplets for CSS variables (for opacity modifiers). The hex values above are converted to RGB in the implementation.

### Typography

- **Headings & Body**: [Inter](https://rsms.me/inter/) — clean sans-serif, highly readable
- **Code**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — monospace with optional ligatures

### Syntax Highlighting

- Engine: Shiki (Astro built-in, zero client JS)
- Dark theme: `night-owl`
- Light theme: `github-light`
- Line numbers enabled
- Dual theme support (switches with light/dark mode toggle)

### Layout

- **Content area**: Increase AstroPaper's `max-w-3xl` to `max-w-4xl` for main content
- **Blog post page**: Article `max-w-4xl` + TOC sidebar `w-64` within `max-w-6xl` container. ~65% content / ~25% TOC on desktop. Single column on mobile.
- **Homepage**: Post list with tag cloud in sidebar (desktop) or below list (mobile)
- **Whitespace**: Generous line height (1.75), comfortable paragraph spacing

---

## Content Migration

### Front Matter Conversion (TOML `+++` → YAML `---`)

| Hugo field | Astro field | Notes |
|---|---|---|
| `title` | `title` | Direct copy |
| `description` | `description` | Generate from first 160 chars if missing |
| `date` | `pubDatetime` | Parse ISO date to Date object |
| `draft` | `draft` | Direct copy |
| `tags` + `topics` | `tags` | **Merge** topics into tags, deduplicate |
| `images[0]` | `ogImage` | First image, relative path for bundles |
| (new) | `author` | Default: "Ann Catherine Jose" |

### Hugo Shortcode Conversion (found in ~15 posts)

1. `{{< pure_table >}}` (6 posts) → standard markdown tables
2. `{{< fluid_imgs >}}` (5 posts) → plain markdown images (one per line, separated by blank lines). Note: images render vertically stacked; multi-column grid layout deferred to Wave 2 (Task 23).
3. `{{< video >}}` (1 post) → HTML5 `<video>` tag
4. `{{< figure >}}` (3 posts) → standard markdown image `![alt](src)`
5. `{{< highlight >}}` (1 post) → fenced code blocks with language identifier

### File Structure Mapping

| Hugo path | Astro path |
|---|---|
| `content/post/slug/index.md` | `src/content/blog/slug/index.md` (with colocated images) |
| `content/post/slug.md` | `src/content/blog/slug.md` |
| `static/img/*` | `public/img/*` |
| `content/about.md` | `src/pages/about.md` |
| `content/ammachi/index.md` | `src/pages/ammachi.md` |
| `content/redesign/index.md` | `src/pages/redesign.md` |

**Pages to migrate**: `/about`, `/ammachi`, `/redesign`
**Pages dropped**: `/epsilla` (outdated product evaluation, no analytics traffic)
**Pages NOT migrated**: `/bluesky` (test page), `/image-test` (test page)

### Disqus Comment Export

- Export XML from Disqus admin (shortname: `anncjose`)
- Parse XML, group by thread URL → post slug
- Generate static HTML fragments at `src/content/comments/<slug>.html`
- Style as "Archived Comments" section below Giscus

### Migration Validation

Post-migration script checks:
- Confirm 58 posts migrated, YAML parses correctly
- Check all image references resolve to actual files
- Check no residual `{{<` or `{{%` shortcode syntax remains
- Verify all dates parse, all tags are lowercase slugs

---

## URL Routing & Redirects

### URL Scheme

- Blog listing: `/blog/`
- Individual posts: `/blog/<slug>/`
- Rename AstroPaper's `src/pages/posts/` to `src/pages/blog/`
- Update all internal references from `/posts/` to `/blog/`

### Redirect Rules (`public/_redirects`)

Cloudflare Pages native redirect rules:
```
/post/*    /blog/:splat   301
/topics/*  /tags/:splat   301
/index.xml /rss.xml       301
```

- Old `/post/<slug>/` URLs permanently redirect to `/blog/<slug>/`
- Old `/topics/<topic>/` URLs redirect to merged `/tags/<tag>/`
- Existing backlinks, social shares, and search results all preserved

### RSS Feed Continuity

- Hugo serves RSS at `/index.xml` (site-wide) and `/post/index.xml` (posts only)
- Configure Astro RSS at `/rss.xml` (AstroPaper default) + redirect `/index.xml` → `/rss.xml`
- Existing RSS subscribers continue receiving updates without re-subscribing

### Custom Route Pages

- `src/pages/ammachi.md` — family content with video
- `src/pages/redesign.md` — redesign log page (TOC sidebar + collapsible parts)
- Architecture supports future `/books`, `/notes`, `/photos`

---

## Blog Features

### Floating Table of Contents

- Receives `headings` from post render result
- Sticky sidebar on desktop (right of content, `xl:block`, hidden on mobile)
- Uses `IntersectionObserver` to highlight current section as user scrolls
- Collapses to an inline `<details>` dropdown on mobile
- Only shown on posts with 3+ headings

### Tag Cloud

- Weighted font sizes based on post count
- Replaces AstroPaper's flat tag list on `/tags/`
- Display labels for acronyms (llm→LLM, ai→AI)

### Comments

- **GiscusComments component**: script embed, `data-theme="preferred_color_scheme"`, mapped by pathname
- **DisqusComments component**: loads static HTML from `src/content/comments/<slug>.html`
- Both render at bottom of post, archived Disqus above Giscus

### Search (Pagefind)

- AstroPaper uses Pagefind for static search indexing
- Zero JS bundle cost, indexes at build time
- Verify it works with migrated content

### Code Block Enhancements

- Copy-to-clipboard button on all code blocks
- Line highlighting support (e.g., `{1,3-5}` syntax)
- Optional file name label above code blocks (e.g., `astro.config.ts`)
- Dual theme: light theme for light mode, dark theme for dark mode

### Math Rendering (KaTeX)

- Hugo site uses MathJax for math expressions (loaded in footer)
- 2 posts use math: `display-math-expressions-in-hugo.md`, `math-symbols-test.md`
- Migrate to KaTeX via `remark-math` + `rehype-katex` (lighter, faster than MathJax)
- Add to `astro.config.ts` remarkPlugins/rehypePlugins

### Image Optimization

- Use `astro:assets` for post images (available in Astro 5, improved in 6)
- Automatic WebP/AVIF conversion, responsive `srcset` generation
- Lazy loading for below-fold images

### Image Grid CSS (replaces `fluid_imgs` shortcode)

- Migration converts `fluid_imgs` to plain markdown images (vertically stacked)
- Wave 2: Add CSS grid or remark plugin for multi-column image layouts
- Responsive: collapses to 1 column on mobile

### Prev/Next Post Navigation

- Show at bottom of each post
- Show post titles (not just arrows) for context
- Sorted by date descending

### OG Images

- Posts with `ogImage` frontmatter use that image
- Posts without one get AstroPaper's built-in generated OG card
- `<meta>` tags for Open Graph and Twitter Card in base layout

---

## About Page

### Layout: Sectioned Profile

The About page uses a structured frontmatter schema, rendered with a dedicated Astro page.

**Frontmatter schema** (`src/content/pages/about.md`):
```yaml
---
name: Ann Catherine Jose
tagline: Engineer, writer, and perpetual learner
photo: /img/ann-profile.jpg
interests:
  - AI & Large Language Models
  - Web Development
  - iOS & Mobile
  - Leadership & Career Growth
  - Personal Development
currently: Exploring the intersection of AI tools and software engineering workflows
social:
  bluesky: annjose.com
  linkedin: annjose
  github: annjose
---

[Prose bio in markdown body]
```

**Visual structure**:
1. Photo + name + tagline at top
2. Prose bio (markdown body)
3. "What I work on" section — interest tags with burnt orange accent
4. "Currently" section — short blurb
5. Social icon links

Each section has a left accent border in burnt orange. Layout is single-column, centered, max ~700px wide.

---

## Deployment

### Cloudflare Pages Configuration

- `astro.config.ts`: `site: "https://annjose.com"`, `output: "static"`
- `wrangler.jsonc`: `pages_build_output_dir: "./dist"`
- Build command: `pnpm run build`, output: `dist`
- Cloudflare project name: `annjose` → preview URL: `annjose.pages.dev`

### Coexistence Strategy

- Old Hugo site stays live at `annjose.com` via GitHub Pages throughout development
- New Astro site tested at `annjose.pages.dev` preview URL
- DNS cutover only when new site is fully validated
- Safety: `master` branch with Hugo is always available as fallback — point DNS back to GitHub Pages if needed

### DNS Cutover Sequence

1. Final validation on `annjose.pages.dev`
2. Migrate any Hugo posts published during the transition period
3. Verify Google Search Console is set up
4. Merge `astro` branch into `master`
5. Rename `master` → `main`
6. Update GitHub default branch to `main`
7. Update Cloudflare Pages production branch to `main`
8. Update DNS: point `annjose.com` to Cloudflare Pages
9. Wait for DNS propagation (5-30 min with Cloudflare proxy)
10. Verify SSL certificate is active
11. Submit updated sitemap to Google Search Console

### Post-Launch

- Monitor Cloudflare Analytics for 404 errors
- Check Google Search Console for crawl errors
- Remove CNAME from old `public/` submodule to avoid GitHub Pages conflict
- Old Hugo content preserved in git history

### Content Freeze Protocol

During migration, avoid publishing new Hugo posts. If unavoidable, document the post slug and migrate it into the Astro content collection before DNS cutover.

---

## Testing Strategy

### Performance Baseline

Before starting migration, run Lighthouse on the current Hugo site and record scores. This provides a benchmark to compare against the new Astro site.

### Testing Checklist

- [ ] All 58 posts render without errors
- [ ] All images load (colocated and static)
- [ ] Shortcode conversions render correctly (tables, grids, video)
- [ ] `/blog/slug-name/` URLs work correctly
- [ ] `/post/slug-name/` redirects to `/blog/slug-name/` (301)
- [ ] `/ammachi/`, `/redesign/`, `/about/` work
- [ ] Light/dark mode toggle works
- [ ] Mobile responsive (375px, 768px, 1024px, 1440px)
- [ ] TOC sidebar displays correctly, highlights on scroll
- [ ] Search (Pagefind) indexes all posts and returns results
- [ ] Tag cloud shows correct counts with proper display labels
- [ ] OG images generate for all posts
- [ ] Giscus comments load on posts
- [ ] Archived Disqus comments display on migrated posts
- [ ] Prev/next navigation works with post titles
- [ ] Code blocks: syntax highlighting, copy button, line highlighting
- [ ] Sitemap and RSS feed work
- [ ] RSS feed URL matches old Hugo feed URL (via redirect)
- [ ] 404 page renders correctly
- [ ] Image optimization: WebP/AVIF served, responsive sizes
- [ ] Counterscale analytics script loads correctly
- [ ] Math expressions render in posts that use them
- [ ] Lighthouse > 95 all metrics

### Playwright E2E Tests (`tests/e2e/`)

- Pages render: home, blog listing, individual post, about, ammachi, tags, 404
- Navigation: header links, prev/next post, tag links
- Redirects: `/post/<slug>/` → `/blog/<slug>/` (301)
- Dark mode toggle works and persists
- TOC sidebar: visible on desktop, hidden on mobile
- Search: type query, results appear
- Code blocks: copy button functional
- Images load without 404s

### Lighthouse CI (in GitHub Actions)

- Run Lighthouse on key pages (home, blog post, tags)
- Enforce thresholds: performance > 90, accessibility > 95, best practices > 95, SEO > 95
- Fail CI if thresholds not met

### Link Checker (post-build)

- Validate all internal links resolve
- Check for broken anchor links
- Use `lychee` or `broken-link-checker` in CI

### GitHub Actions CI

- Build check on push/PR to catch errors early

---

## Wave 2: Enhancements (after Wave 1 is stable)

- **Projects page**: side projects & open source, card grid layout with `ProjectCard` components, featured section + regular grid, tech stack badges, status badges, live/GitHub links
- **Projects content collection**: title, description, techStack[], liveUrl?, githubUrl?, status, featured, sortOrder, image?
- **Auth for private routes**: Cloudflare Access or Workers + D1
- **GUID-based secret URLs**: unlisted pages with long random URLs
- **Atom feed**: Evaluate adding `/atom.xml` alongside existing RSS for broader feed reader compatibility
- **Additional routes**: `/books`, `/notes`, `/photos`
- **Newsletter integration**
- **SSR adapter**: `@astrojs/cloudflare` if server-rendered routes needed

---

## Reference

### Folder Structure (on `astro` branch)

```
annjose.com/                          # Renamed repo, astro branch
├── public/
│   ├── img/                          # Legacy static images (from Hugo static/img/)
│   ├── fonts/
│   ├── favicon.ico
│   └── _redirects                    # Cloudflare redirect rules (/post/* → /blog/*)
│
├── src/
│   ├── assets/                       # Icons, theme images, site logo
│   │
│   ├── components/
│   │   ├── Header.astro              # MODIFY: update nav items
│   │   ├── Footer.astro              # MODIFY: social links
│   │   ├── Card.astro                # EXISTING: post card in listing
│   │   ├── Tag.astro                 # EXISTING: tag pill
│   │   ├── Breadcrumb.astro          # EXISTING: breadcrumb nav
│   │   ├── Datetime.astro            # EXISTING: date display
│   │   ├── TableOfContents.astro     # NEW: floating sticky TOC sidebar
│   │   ├── TagCloud.astro            # NEW: weighted tag cloud
│   │   ├── GiscusComments.astro      # NEW: Giscus comment widget
│   │   ├── DisqusComments.astro      # NEW: archived Disqus static HTML
│   │   └── ...other existing AstroPaper components
│   │
│   ├── content/
│   │   ├── blog/                     # All 58 migrated posts
│   │   │   ├── agentic-coding-basics/
│   │   │   │   ├── index.md          # Post content (YAML front matter)
│   │   │   │   └── agentic-loop.png  # Colocated image
│   │   │   ├── chatgpt-intro.md      # Single-file post (no images)
│   │   │   └── ...56 more posts
│   │   ├── comments/                 # NEW: archived Disqus comment HTML
│   │   │   ├── agentic-coding-basics.html
│   │   │   └── ...
│   │   └── pages/
│   │       └── about.md              # About page content + frontmatter
│   │
│   ├── layouts/
│   │   ├── Layout.astro              # MODIFY: analytics, fonts
│   │   ├── Main.astro                # MODIFY: wider max-width
│   │   ├── PostDetails.astro         # MODIFY: add TOC sidebar + comments
│   │   ├── Posts.astro               # EXISTING: post listing layout
│   │   └── TagPosts.astro            # EXISTING: tag archive layout
│   │
│   ├── pages/
│   │   ├── index.astro               # Home page
│   │   ├── about.astro               # About page (renders content/pages/about.md)
│   │   ├── search.astro              # Search page (Pagefind)
│   │   ├── 404.astro                 # MODIFY: custom 404 design
│   │   ├── ammachi.md                # NEW: custom route (markdown)
│   │   ├── redesign.md               # NEW: redesign log page (markdown)
│   │   ├── blog/                     # NEW name (was posts/)
│   │   │   ├── [...slug].astro       # Individual post pages
│   │   │   └── [...page].astro       # Paginated blog listing
│   │   ├── tags/
│   │   │   ├── index.astro           # MODIFY: use TagCloud component
│   │   │   └── [tag]/[...page].astro # Tag archive pages
│   │   └── rss.xml.ts                # RSS feed
│   │
│   ├── styles/
│   │   ├── global.css                # MODIFY: image-grid, custom styles
│   │   └── typography.css            # MODIFY: wider prose, code blocks
│   │
│   ├── utils/
│   │   ├── tagLabels.ts              # NEW: tag display label map (llm→LLM)
│   │   └── ...existing AstroPaper utils
│   │
│   ├── config.ts                     # MODIFY: site metadata
│   └── content.config.ts             # MODIFY: add disqusSlug, pages collection
│
├── scripts/                          # Migration scripts (not part of Astro build)
│   ├── migrate-content.ts            # NEW: Hugo → Astro content migration
│   ├── convert-disqus.ts             # NEW: Disqus XML → static HTML
│   └── validate-migration.ts         # NEW: post-migration validation
│
├── tests/                            # NEW: automated tests
│   └── e2e/
│       ├── pages.spec.ts             # NEW: page rendering tests
│       ├── navigation.spec.ts        # NEW: nav, redirects, prev/next
│       ├── features.spec.ts          # NEW: dark mode, TOC, search, copy button
│       └── playwright.config.ts
│
├── astro.config.ts                   # MODIFY: site URL, markdown config
├── tailwind.config.mjs               # MODIFY: custom colors, wider max-width
├── wrangler.jsonc                    # NEW: Cloudflare Pages config
├── package.json
└── tsconfig.json
```

**Legend**: EXISTING = comes with AstroPaper, MODIFY = customize existing, NEW = create from scratch

### Key Files Reference

| File | Purpose |
|---|---|
| `scripts/migrate-content.ts` | Content migration: TOML→YAML, shortcodes, file structure |
| `scripts/convert-disqus.ts` | Disqus XML export → static HTML fragments |
| `scripts/validate-migration.ts` | Post-migration validation checks |
| `src/content.config.ts` | Content collection schema (blog + pages) |
| `src/config.ts` | Site metadata, author, social links |
| `src/components/TableOfContents.astro` | Floating sticky TOC with scroll tracking |
| `src/components/TagCloud.astro` | Weighted tag cloud with display labels |
| `src/components/GiscusComments.astro` | Giscus comment embed |
| `src/components/DisqusComments.astro` | Archived Disqus static comments |
| `src/utils/tagLabels.ts` | Tag slug → display label mapping |
| `src/pages/blog/` | Blog routes (renamed from posts/) |
| `src/pages/ammachi.md` | Custom route: family content |
| `src/pages/redesign.md` | Redesign log page |
| `src/pages/about.astro` | About page with Sectioned Profile layout |
| `src/layouts/PostDetails.astro` | Post layout: TOC sidebar + comments |
| `public/_redirects` | Cloudflare redirect rules |
| `wrangler.jsonc` | Cloudflare Pages deployment config |
| `astro.config.ts` | Astro configuration |
| `tailwind.config.mjs` | Tailwind: custom colors, wider max-width |
| `tests/e2e/*.spec.ts` | Playwright e2e tests |

### Reference Links

- [AstroPaper theme repo](https://github.com/satnaing/astro-paper)
- [Astro: Migrating from Hugo](https://docs.astro.build/en/guides/migrate-to-astro/from-hugo/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Site Redesign Log](https://annjose.com/redesign/) (live on current Hugo site)
