# Blog Redesign: Hugo to Astro Migration Spec

## Context

The blog at annjose.com ("Reflections" by Ann Catherine Jose) runs on Hugo with the Blackburn theme, deployed to GitHub Pages. It has 58 posts (28 page bundles + 30 single-file), tags/topics taxonomies, Disqus comments, and custom routes (/ammachi/, /epsilla/). The goal is to modernize with Astro + Tailwind CSS, hosted on Cloudflare Pages, using AstroPaper as the starting template.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Base template** | AstroPaper (as Astro template, not fork) | `npm create astro@latest --template satnaing/astro-paper` |
| **Astro version** | Start on Astro 5 (AstroPaper's current base), upgrade to Astro 6 before launch | AstroPaper not yet updated for Astro 6; mechanical upgrade path exists |
| **Hosting** | Cloudflare Pages (static output for Wave 1) | Free, fast CDN, supports SSR later for auth |
| **Comments** | Static embed of old Disqus comments + Giscus for new posts | Preserves history, no Disqus dependency going forward |
| **Migration** | All 58 posts migrated | No content left behind |
| **Topics taxonomy** | Merge into tags (deduplicate) | Simplifies architecture, one taxonomy system |
| **URL scheme** | New posts at `/blog/<slug>/`, 301 redirects from `/post/<slug>/` | Cleaner URLs, old links preserved via Cloudflare redirects |
| **Repo strategy** | Same repo (rename `myblog` -> `annjose.com`), new `astro` branch | Preserves full git history; merge to main when ready |
| **Branch name** | Rename `master` -> `main` during final merge | Modern convention; done as part of cutover |
| **Coexistence** | Old Hugo site stays live at `annjose.com`; new Astro site tested at Cloudflare Pages preview URL | DNS cutover only when new site is fully validated |

## Scope: Wave 1 vs Wave 2

**Wave 1 (Initial Launch)**: Core site + blog migration + deployment
- Site scaffolding and configuration
- Content migration: all 58 posts + existing pages (/about, /ammachi, /epsilla, /redesign). /bluesky page excluded (not migrated because it was a test page)
- Blog features: TOC, tags, comments, search, prev/next, OG images, reading time
- RSS feed migration (preserve existing feed URL for subscribers)
- Design: custom colors, fonts, wider layout, light/dark mode
- Analytics: Counterscale (existing) migrated to Astro
- Automated tests (Playwright e2e + Lighthouse CI)
- Deployment to Cloudflare Pages
- DNS cutover

**Wave 2 (Enhancements)**: After Wave 1 is stable
- Projects page (side projects & open source, card grid layout)
- Auth for private routes (Cloudflare Access or Workers)
- GUID-based secret URLs
- Additional routes: `/books`, `/notes`, `/photos`
- Newsletter integration
- SSR adapter (if server-rendered routes needed)

---

# Wave 1: Implementation Phases

## Phase 1: Project Scaffolding (Day 1-2)

### 1.1 Rename repo and create Astro branch
- Rename GitHub repo: `myblog` -> `annjose.com` (do this first, before Cloudflare Pages setup)
- Update local remote: `git remote set-url origin git@github.com:annjose/annjose.com.git`
- Create branch: `git checkout -b astro`
- Remove Hugo files (theme, config.toml, etc.) but keep `content/` and `docs/`
- Remove git submodules: `public/` (GitHub Pages output) and theme submodules in `.gitmodules`
- Scaffold AstroPaper into the repo root: `npm create astro@latest --template satnaing/astro-paper` (into a temp dir, then move files in)
- Verify Astro 5.x in package.json
- Preserve `docs/` directory (operational docs still relevant: taxonomy-conventions, decision-log, etc.)
- The Hugo `master` branch remains untouched and deployable throughout

### 1.2 Configure for Cloudflare Pages
- `astro.config.ts`: `site: "https://annjose.com"`, `output: "static"`
- `wrangler.jsonc`: `pages_build_output_dir: "./dist"`
- Syntax highlighting: dual theme (light: `min-light`, dark: `night-owl`) with line numbers

### 1.3 Update site metadata (`src/config.ts`)
- title: "Reflections", author: "Ann Catherine Jose"
- Social links: GitHub, LinkedIn, Bluesky, HackerNews (all `annjose`)
- postPerPage: 10, lightAndDarkMode: true, dynamicOgImage: true

### 1.4 Favicon
- Carry over existing favicon from Hugo site, or create a new one

---

## Phase 2: Content Migration (Day 2-4) -- CRITICAL PATH

### 2.1 Migration script (`scripts/migrate-content.ts`)

**Front matter conversion (TOML `+++` to YAML `---`)**:

| Hugo field | Astro field | Notes |
|---|---|---|
| `title` | `title` | Direct copy |
| `description` | `description` | Generate from first 160 chars if missing |
| `date` | `pubDatetime` | Parse ISO date to Date object |
| `draft` | `draft` | Direct copy |
| `tags` + `topics` | `tags` | **Merge** topics into tags, deduplicate |
| `images[0]` | `ogImage` | First image, relative path for bundles |
| (new) | `author` | Default: "Ann Catherine Jose" |

**Hugo shortcode conversion** (found in ~12 posts):
1. `{{< pure_table >}}` (6 posts) -> standard markdown tables
2. `{{< fluid_imgs >}}` (5 posts) -> `<div class="image-grid cols-N">` with markdown images
3. `{{< video >}}` (1 post) -> HTML5 `<video>` tag

**File structure mapping**:
- Page bundles: `content/post/slug/index.md` -> `src/data/blog/slug/index.md` (with colocated images)
- Single-file: `content/post/slug.md` -> `src/data/blog/slug.md`
- Static images: `static/img/*` -> `public/img/*`
- About page: `content/about.md` -> `src/pages/about.md`
- Custom routes: `/ammachi/`, `/epsilla/` -> dedicated Astro pages
- Redesign log: `content/redesign/` -> `src/pages/redesign.astro`

### 2.2 Disqus comment export (`scripts/convert-disqus.ts`)
- Export XML from Disqus admin (shortname: `anncjose`)
- Parse XML, group by thread URL -> post slug
- Generate static HTML fragments at `src/data/comments/<slug>.html`
- Style as "Archived Comments" section below Giscus

### 2.3 Validation script (`scripts/validate-migration.ts`)
- Confirm 58 posts migrated, YAML parses correctly
- Check all image references resolve to actual files
- Check no residual `{{<` or `{{%` shortcode syntax remains
- Verify all dates parse, all tags are lowercase slugs

---

## Phase 3: Content Collections & Routing (Day 3-5)

### 3.1 Extend content schema (`src/content.config.ts`)

**Blog collection** - add to existing AstroPaper schema:
- `disqusSlug: z.string().optional()` -- links archived comments

### 3.2 Taxonomy display labels
Standard approach (used by most tech blogs): lowercase slugs in URLs, display labels in UI.
- URLs/slugs: always lowercase with hyphens (`/tags/llm/`, `/tags/web-development/`)
- Display: acronyms uppercase ("LLM", "AI", "RAG"), phrases title-cased ("Tech Explorations", "Personal Growth")
- Preserves conventions from `docs/taxonomy-conventions.md`
- Implementation: lookup map in `src/utils/tagLabels.ts` — if tag has custom label, use it; otherwise auto-title-case the slug

### 3.3 URL routing: `/blog/<slug>/`
- Rename AstroPaper's `src/pages/posts/` to `src/pages/blog/`
- Update all internal references from `/posts/` to `/blog/`
- Blog listing at `/blog/`, individual posts at `/blog/<slug>/`

### 3.4 Redirects (`public/_redirects`)
Cloudflare Pages native redirect rules:
```
/post/*    /blog/:splat   301
/topics/*  /tags/:splat   301
```
- Old `/post/<slug>/` URLs permanently redirect to `/blog/<slug>/`
- Old `/topics/<topic>/` URLs redirect to merged `/tags/<tag>/`
- Existing backlinks, social shares, and search results all preserved

### 3.5 Custom route pages
- `src/pages/ammachi.astro` -- renders ammachi content with video
- `src/pages/epsilla.astro` -- renders epsilla evaluation
- `src/pages/redesign.astro` -- redesign log page (already in Hugo nav)
- Architecture supports future `/books`, `/notes`, `/photos`

### 3.6 RSS feed URL continuity
- Hugo serves RSS at `/index.xml` (site-wide) and `/post/index.xml` (posts only)
- Configure Astro RSS at `/rss.xml` (AstroPaper default) + add redirect: `/index.xml` -> `/rss.xml`
- Existing RSS subscribers continue receiving updates without re-subscribing

---

## Phase 4: New Components (Day 5-8)

### 4.1 Floating Table of Contents (`src/components/TableOfContents.astro`)
- Receives `headings` from post render result
- Sticky sidebar on desktop (right of content, `xl:block`, hidden on mobile)
- Uses `IntersectionObserver` to highlight current section as user scrolls
- Layout: article `max-w-4xl` + TOC sidebar `w-64` within `max-w-6xl` container

### 4.2 Tag Cloud (`src/components/TagCloud.astro`)
- Weighted font sizes based on post count
- Replaces AstroPaper's flat tag list on `/tags/`
- Display labels for acronyms (llm->LLM, ai->AI)

### 4.3 Comments section in `PostDetails.astro`
- **GiscusComments component**: script embed, `data-theme="preferred_color_scheme"`, mapped by pathname
- **DisqusComments component**: loads static HTML from `src/data/comments/<slug>.html`
- Both render at bottom of post, archived Disqus above Giscus

### 4.4 Image grid CSS (replaces `fluid_imgs` shortcode)
- CSS-only: `.image-grid` with `grid-template-columns` for 2/3 col layouts
- Responsive: collapses to 1 column on mobile

### 4.5 Wider content area
- Increase AstroPaper's `max-w-3xl` to `max-w-4xl` for main content
- Post pages with TOC: `max-w-6xl` total, article `max-w-4xl`, TOC `w-64`

### 4.6 Prev/Next post navigation
- AstroPaper may have this; if not, add to `PostDetails.astro`
- Show post titles (not just arrows) for context

### 4.7 Code block enhancements
- Copy-to-clipboard button on all code blocks
- Line highlighting support (e.g., `{1,3-5}` syntax)
- Optional file name label above code blocks (e.g., `astro.config.ts`)
- Dual theme: light theme for light mode, dark theme for dark mode

### 4.8 Image optimization
- Use `astro:assets` for post images (available in Astro 5, improved in 6)
- Automatic WebP/AVIF conversion, responsive `srcset` generation
- Lazy loading for below-fold images

### 4.9 Reading time
- Show estimated reading time on post cards and post detail pages
- AstroPaper may already have this; verify and keep

### 4.10 Search (Pagefind)
- AstroPaper uses Pagefind for static search indexing
- Zero JS bundle cost, indexes at build time
- Verify it works with migrated content

### 4.11 Math rendering (KaTeX)
- Hugo site uses MathJax for math expressions (loaded in footer)
- 2 posts use math: `display-math-expressions-in-hugo.md`, `math-symbols-test.md`
- Migrate to KaTeX via `remark-math` + `rehype-katex` (lighter, faster than MathJax)
- Add to `astro.config.ts` remarkPlugins/rehypePlugins

---

## Phase 5: Layout & Design Polish (Day 8-10)

### 5.1 Header navigation
- Home, Blog, About
- Clean horizontal nav (not the Hugo side menu)

### 5.2 Footer with social links
- GitHub, LinkedIn, Bluesky, HackerNews

### 5.3 Custom color scheme & fonts
- Customize Tailwind skin colors for a distinctive look
- Clean font pairing (e.g., Inter + JetBrains Mono for code)
- Beautiful colors that work in both light and dark mode

### 5.4 Custom 404 page
- Designed 404 page matching the site theme
- Helpful navigation back to home/blog

### 5.5 Analytics: Counterscale
- Migrate existing Counterscale analytics (self-hosted on Cloudflare Workers)
- Add to `Layout.astro` head:
  ```html
  <script id="counterscale-script" data-site-id="annjose-blog"
    src="https://counterscale.annjose.workers.dev/tracker.js" defer></script>
  ```
- No Google Analytics needed (Counterscale is the primary analytics)

### 5.6 Draft preview
- Draft posts (`draft: true`) excluded from production builds
- Viewable locally with `npm run dev` for preview before publishing

---

## Phase 6: Deployment & Testing (Day 10-12)

### 6.1 Cloudflare Pages setup
- Connect GitHub repo (`annjose/annjose.com`) to Cloudflare Pages
- Configure: production branch = `astro` (temporarily), build command: `npm run build`, output: `dist`
- Cloudflare project name: `annjose` -> preview URL: `annjose.pages.dev`
- Old Hugo site stays live at `annjose.com` via GitHub Pages during this entire phase
- After cutover, production branch switches to `main` (after master->main rename + merge)

### 6.2 Giscus setup
- Enable GitHub Discussions on the `annjose.com` repo
- Configure at giscus.app, get repo ID and category ID

### 6.3 GitHub Actions CI
- Build check on push/PR to catch errors early

### 6.4 Testing checklist
- [ ] All 58 posts render without errors
- [ ] All images load (colocated and static)
- [ ] Shortcode conversions render correctly (tables, grids, video)
- [ ] `/blog/slug-name/` URLs work correctly
- [ ] `/post/slug-name/` redirects to `/blog/slug-name/` (301)
- [ ] `/ammachi/`, `/epsilla/`, `/redesign/`, `/about/` work
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
- [ ] Reading time displays on posts
- [ ] Sitemap and RSS feed work
- [ ] RSS feed URL matches old Hugo feed URL
- [ ] 404 page renders correctly
- [ ] Image optimization: WebP/AVIF served, responsive sizes
- [ ] Counterscale analytics script loads correctly
- [ ] Math expressions render in posts that use them
- [ ] Lighthouse > 95 all metrics

### 6.5 Automated tests

**Playwright e2e tests** (`tests/e2e/`):
- Pages render: home, blog listing, individual post, about, ammachi, tags, 404
- Navigation: header links, prev/next post, tag links
- Redirects: `/post/<slug>/` -> `/blog/<slug>/` (301)
- Dark mode toggle works and persists
- TOC sidebar: visible on desktop, hidden on mobile
- Search: type query, results appear
- Code blocks: copy button functional
- Images load without 404s

**Lighthouse CI** (in GitHub Actions):
- Run Lighthouse on key pages (home, blog post, tags)
- Enforce thresholds: performance > 90, accessibility > 95, best practices > 95, SEO > 95
- Fail CI if thresholds not met

**Link checker** (post-build):
- Validate all internal links resolve
- Check for broken anchor links
- Can use `lychee` or `broken-link-checker` in CI

**Setup**: `npm install -D @playwright/test && npx playwright install`

---

## Phase 7: Astro 6 Upgrade (Day 12-13)

### 7.1 Upgrade process
- Run `npx @astrojs/upgrade` to upgrade Astro 5 -> 6
- Address breaking changes:
  - Node.js 22+ required
  - Vite 7, Shiki 4, Zod 4 dependency updates
  - Zod imports: `astro/zod` instead of `astro:content`
- Re-run full test checklist from Phase 6.4
- Verify Cloudflare Pages preview build succeeds

---

## Phase 8: DNS Cutover & Launch (Day 13-14)

### 8.1 Pre-cutover
- Final validation on `annjose.pages.dev`
- Migrate any Hugo posts published during the transition period
- Verify Google Search Console is set up for new site

### 8.2 Branch merge & rename
1. Merge `astro` branch into `master`
2. Rename `master` -> `main`: `git branch -m master main && git push origin main`
3. Update GitHub default branch to `main`
4. Update Cloudflare Pages production branch to `main`

### 8.3 DNS Cutover
1. Update DNS: point `annjose.com` to Cloudflare Pages
2. Wait for DNS propagation (5-30 min with Cloudflare proxy)
3. Verify SSL certificate is active
4. Test live site on `annjose.com`
5. Submit updated sitemap to Google Search Console

### 8.4 Post-launch
- Monitor Cloudflare Analytics for 404 errors
- Check Google Search Console for crawl errors
- Remove CNAME from old `public/` submodule to avoid GitHub Pages conflict
- Old Hugo content preserved in git history (accessible via tags/commits)

---

# Wave 2: Enhancements (after Wave 1 is stable)

- **Projects page**: side projects & open source, card grid layout with `ProjectCard` components, featured section + regular grid, tech stack badges, status badges, live/GitHub links
- **Projects content collection**: title, description, techStack[], liveUrl?, githubUrl?, status, featured, sortOrder, image?
- **Auth for private routes**: Cloudflare Access or Workers + D1
- **GUID-based secret URLs**: unlisted pages with long random URLs
- **Additional routes**: `/books`, `/notes`, `/photos`
- **Newsletter integration**
- **SSR adapter**: `@astrojs/cloudflare` if server-rendered routes needed

---

# Reference

## Folder Structure (on `astro` branch of myblog repo)

```
annjose.com/                          # Renamed repo, astro branch
├── public/
│   ├── img/                          # Legacy static images (from Hugo static/img/)
│   ├── fonts/
│   ├── favicon.ico
│   └── _redirects                    # Cloudflare redirect rules (/post/* -> /blog/*)
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
│   │   ├── Datetime.astro            # EXISTING: date + reading time
│   │   ├── TableOfContents.astro     # NEW: floating sticky TOC sidebar
│   │   ├── TagCloud.astro            # NEW: weighted tag cloud
│   │   ├── GiscusComments.astro      # NEW: Giscus comment widget
│   │   ├── DisqusComments.astro      # NEW: archived Disqus static HTML
│   │   └── ...other existing AstroPaper components
│   │
│   ├── data/
│   │   ├── blog/                     # All 58 migrated posts
│   │   │   ├── agentic-coding-basics/
│   │   │   │   ├── index.md          # Post content (YAML front matter)
│   │   │   │   └── agentic-loop.png  # Colocated image
│   │   │   ├── chatgpt-intro.md      # Single-file post (no images)
│   │   │   └── ...56 more posts
│   │   └── comments/                 # NEW: archived Disqus comment HTML
│   │       ├── agentic-coding-basics.html
│   │       └── ...
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
│   │   ├── about.md                  # About page (migrated from Hugo)
│   │   ├── search.astro              # Search page (Pagefind)
│   │   ├── 404.astro                 # MODIFY: custom 404 design
│   │   ├── ammachi.astro             # NEW: custom route
│   │   ├── epsilla.astro             # NEW: custom route
│   │   ├── redesign.astro            # NEW: redesign log page
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
│   │   ├── tagLabels.ts              # NEW: tag display label map (llm->LLM)
│   │   └── ...existing AstroPaper utils
│   │
│   ├── config.ts                     # MODIFY: site metadata
│   └── content.config.ts             # MODIFY: add disqusSlug field
│
├── scripts/                          # Migration scripts (not part of Astro build)
│   ├── migrate-content.ts            # NEW: Hugo -> Astro content migration
│   ├── convert-disqus.ts             # NEW: Disqus XML -> static HTML
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

## Key Files Reference

| File | Purpose |
|---|---|
| `scripts/migrate-content.ts` | Content migration: TOML->YAML, shortcodes, file structure |
| `scripts/convert-disqus.ts` | Disqus XML export -> static HTML fragments |
| `scripts/validate-migration.ts` | Post-migration validation checks |
| `src/content.config.ts` | Content collection schema (add disqusSlug) |
| `src/config.ts` | Site metadata, author, social links |
| `src/components/TableOfContents.astro` | Floating sticky TOC with scroll tracking |
| `src/components/TagCloud.astro` | Weighted tag cloud with display labels |
| `src/components/GiscusComments.astro` | Giscus comment embed |
| `src/components/DisqusComments.astro` | Archived Disqus static comments |
| `src/utils/tagLabels.ts` | Tag slug -> display label mapping |
| `src/pages/blog/` | Blog routes (renamed from posts/) |
| `src/pages/ammachi.astro` | Custom route: family content |
| `src/pages/epsilla.astro` | Custom route: product evaluation |
| `src/pages/redesign.astro` | Redesign log page |
| `src/layouts/PostDetails.astro` | Post layout: TOC sidebar + comments |
| `public/_redirects` | Cloudflare redirect rules |
| `wrangler.jsonc` | Cloudflare Pages deployment config |
| `astro.config.ts` | Astro configuration |
| `tailwind.config.mjs` | Tailwind: custom colors, wider max-width |
| `tests/e2e/*.spec.ts` | Playwright e2e tests |

---

## Verification Plan
1. Run migration script, then validation script
2. `npm run build` -- zero errors
3. `npm run dev` -- manually check 5-10 posts, about, custom routes, search, tags
4. Deploy to Cloudflare Pages preview URL
5. Test redirect rules: `/post/*` -> `/blog/*`
6. Test on mobile viewports (375px, 768px)
7. Test light/dark mode toggle
8. Lighthouse audit on preview URL (target: >95 all metrics)
9. Upgrade to Astro 6, re-run steps 2-8
10. DNS cutover when all checks pass
