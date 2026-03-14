# Wave 1: Implementation Plan

> **Spec reference**: [spec.md](./spec.md) — all architectural decisions and rationale live there.
>
> **Goal**: Migrate annjose.com from Hugo + Blackburn to Astro 5 + Tailwind CSS (AstroPaper base), with full blog features, deployed on Cloudflare Pages. Upgrade to Astro 6 before launch.

---

## Phase 1: Project Bootstrap

### Task 1: Rename repo and create Astro branch

- [x] Rename GitHub repo: `myblog` → `annjose.com` (do this first, before Cloudflare Pages setup)
- [x] Update local remote: `git remote set-url origin git@github.com:annjose/annjose.com.git`
- [x] Create branch: `git checkout -b astro`
- [x] Remove Hugo files: theme, config.toml, deploy.sh, resources/
- [x] Remove git submodules: `public/` (GitHub Pages output) and theme submodules in `.gitmodules`
- [x] Preserve `content/`, `docs/`, `scripts/`, `static/` directories
- [x] Commit cleanup

**Expected**: Clean branch with only content, docs, scripts, and static assets remaining. Hugo `master` branch untouched.

### Task 2: Scaffold AstroPaper

- [x] Scaffold into a temp dir, then move files into repo root: `pnpm create astro@latest --template satnaing/astro-paper`
- [x] Verify Astro 5.x in package.json
- [x] Run `pnpm install`
- [x] Verify `pnpm run build` succeeds (AstroPaper demo content)
- [x] Verify `pnpm run dev` starts at `http://localhost:4321`
- [x] Commit scaffold

**Expected**: Vanilla AstroPaper site builds and runs locally.

### Task 3: Configure site metadata

**Files**: `src/config.ts`, `astro.config.ts`

- [x] Update `src/config.ts`: title "Reflections", author "Ann Catherine Jose", social links (GitHub, LinkedIn, Bluesky, HackerNews — all `annjose`), postPerPage 10, lightAndDarkMode true, dynamicOgImage true
- [x] Update `astro.config.ts`: `site: "https://annjose.com"`, `output: "static"`
- [x] Configure syntax highlighting: dual theme (`night-owl` dark, `github-light` light) with line numbers
- [x] Verify build passes
- [x] Commit

### Task 4: Cloudflare Pages config

**Files**: `wrangler.jsonc`

- [x] Create `wrangler.jsonc`: `pages_build_output_dir: "./dist"`
- [x] Commit

### Task 5: Favicon

- [x] Create favicon from colorized pencil sketch avatar (`src/assets/images/ann-color-sketch-square.png`)
- [x] Generate `public/favicon-32.png` (32×32) and `public/favicon-180.png` (apple-touch-icon)
- [x] Update `Layout.astro` to reference PNG favicons (replaced default SVG)
- [x] Commit

### Task 6: Cloudflare Pages setup & first deploy

- [x] Connect GitHub repo (`annjose/annjose.com`) to Cloudflare Pages
- [x] Configure: production branch = `astro` (temporarily), build command: `pnpm run build`, output: `dist`
- [x] Cloudflare project name: `annjose` → preview URL: `annjose.pages.dev`
- [x] Deploy and verify vanilla AstroPaper renders at `annjose.pages.dev`
- [x] Verify old Hugo site still live at `annjose.com` via GitHub Pages

**Milestone**: Vanilla AstroPaper running locally AND on Cloudflare Pages. From here on, deploy at each phase milestone.

---

## Phase 2: Content Migration (CRITICAL PATH)

### Task 7: Define content collection schemas

**Files**: `src/content.config.ts`

- [x] Check where AstroPaper put its content config → `src/content.config.ts` (Astro 5+ style with glob loader)
- [x] Move blog content from `src/data/blog/` to `src/content/blog/` (align with spec folder structure)
- [x] Extend blog collection schema: add `disqusSlug: z.string().optional()`
- [x] Verify `pnpm astro check` passes (0 errors)
- [x] Commit

### Task 8: Write migration script (TDD)

**Files**: `scripts/migrate-content.ts`, `scripts/migrate-content.test.ts`

- [x] Install dependencies: `pnpm add -D @iarna/toml js-yaml vitest tsx @types/js-yaml`
- [x] Add Vitest config to package.json (`"test": "vitest run"`, `"test:watch": "vitest"`)
- [x] **Write failing tests first** (23 tests):
  - Parse TOML frontmatter delimited by `+++`
  - Handle posts with no frontmatter (throw)
  - Map `images[0]` → `ogImage`
  - Merge `topics` into `tags` (deduplicate)
  - Preserve `draft` status
  - Coerce date to ISO string
  - Omit `ogImage` when `images` absent
  - Generate description from first 160 chars if missing
  - Set `disqusSlug` from Hugo slug
  - Convert `pure_table`, `fluid_imgs`, `video` shortcodes
- [x] Run tests — expect failures ✓ (module not found)
- [x] **Implement the migration script**:
  - Find all `.md` files under `content/post/`
  - Parse TOML frontmatter → JS object
  - Remap fields per spec's field mapping table
  - Convert shortcodes: `pure_table` → markdown tables, `fluid_imgs` → image-grid divs, `video` → HTML5 video
  - Output YAML frontmatter
  - Write to `src/content/blog/` preserving directory structure
  - Copy colocated image files alongside
- [x] Run tests — expect pass ✓ (23/23 pass)
- [x] Commit script and tests

### Task 9: Run migration and validate

**Files**: `src/content/blog/`, `public/img/`, `scripts/validate-migration.ts`

- [x] Run migration script: `npx tsx scripts/migrate-content.ts`
- [x] Spot-check 3-5 migrated posts (TOML→YAML, ogImage mapping, topics merged)
- [x] Copy images from both `static/img/` and `content/img/` → `public/img/` (handled by migration script)
- [x] **Write validation script** (`scripts/validate-migration.ts`):
  - Confirm 58 posts migrated
  - YAML parses correctly for all posts
  - All image references resolve to actual files
  - No residual `{{<` or `{{%` shortcode syntax
  - All dates parse, all tags are lowercase slugs
- [x] Run validation script — 6/6 checks pass
- [x] Verify Astro build picks up migrated content: `pnpm run build` (119 pages, 55 indexed)
- [x] Fix additional shortcodes discovered during migration: `figure` (3 posts), `highlight` (1 post)
- [x] Fix `fluid_imgs` rendering: dropped `<div>` wrapper (markdown inside HTML blocks not parsed by Astro)
- [x] Fix `pubDatetime` type: output `new Date()` object so js-yaml writes unquoted YAML date for `z.date()`
- [x] Fix double-slug URLs for page bundles in `getPath.ts`
- [x] Back up AstroPaper demo posts to `src/content/_demo/`
- [x] Commit migrated content

**Expected**: All 58 posts in `src/content/blog/`, all images in place, zero validation errors. ✅

### Task 10: Disqus comment export

**Files**: `scripts/convert-disqus.ts`, `src/content/comments/`

- [x] Export XML from Disqus admin (shortname: `anncjose`)
- [x] Write conversion script with TDD (15 tests): parse XML, group by thread URL → post slug
- [x] Generate static HTML fragments at `src/content/comments/<slug>.html`
- [x] Commit

**Results**: 24 comments across 9 posts (2 deleted + 8 spam filtered). Threaded replies supported. ✅

---

## Phase 3: Visual Design

### Task 11: Apply Warm & Earthy color palette

**Files**: `src/styles/base.css` (or wherever AstroPaper defines CSS variables), `tailwind.config.mjs`

- [ ] Locate AstroPaper's color configuration (CSS variables, likely `:root` and `.dark` selectors)
- [ ] Override CSS color variables with Warm & Earthy palette (see spec for hex→RGB values):
  - Light: fill `250,247,245`, text `28,25,23`, accent `194,65,12`
  - Dark: fill `28,25,23`, text `250,247,245`, accent `194,65,12`
  - Card, card-muted, border values for both modes
- [ ] Extend Tailwind config with custom font families:
  - `sans: ["Inter", ...defaultTheme.fontFamily.sans]`
  - `mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono]`
- [ ] Add Google Fonts link to `Layout.astro` `<head>`: Inter + JetBrains Mono
- [ ] Preview in browser — verify warm tones, dark mode toggle
- [ ] Commit

### Task 12: Configure syntax highlighting

**Files**: `astro.config.ts`, `src/styles/base.css`

- [ ] Update `astro.config.ts` with Shiki themes: `{ light: "github-light", dark: "night-owl" }`
- [ ] Set `wrap: true`
- [ ] Install `@shikijs/transformers` and add line number transformer
- [ ] Add line number CSS (counter-based)
- [ ] Verify a post with code renders correctly in both modes
- [ ] Commit

---

## Phase 4: Core Layouts

### Task 13: Base layout — analytics and fonts

**Files**: `src/layouts/Layout.astro`

- [ ] Review what AstroPaper's layout already provides (head, dark mode, OG meta, Twitter Card)
- [ ] Add Counterscale analytics script to `<head>`:
  ```html
  <script id="counterscale-script" data-site-id="annjose-blog"
    src="https://counterscale.annjose.workers.dev/tracker.js" defer></script>
  ```
- [ ] Verify OG and Twitter meta tags are present
- [ ] Commit

### Task 14: Post layout with TOC sidebar

**Files**: `src/layouts/PostDetails.astro`, `src/components/TableOfContents.astro`

- [ ] Inspect AstroPaper's existing post layout
- [ ] Create `TableOfContents.astro`:
  - Props: `headings: { depth, slug, text }[]`
  - Filter to h2 and h3 headings
  - Desktop: sticky sidebar (`position: sticky; top: 5rem`), `hidden lg:block`
  - Mobile: collapsible `<details>` dropdown, `lg:hidden`
  - Only render when 3+ headings
  - IntersectionObserver script for active section highlighting
- [ ] Modify `PostDetails.astro`:
  - Add two-column grid: article `~65%` + TOC sidebar `~25%` at lg+
  - Mobile TOC dropdown above post body
  - Import and render `TableOfContents` component
- [ ] Verify on a long post: sticky sidebar on desktop, dropdown on mobile
- [ ] Commit

### Task 15: Wider content area

**Files**: `src/layouts/Main.astro`, `tailwind.config.mjs`

- [ ] Increase AstroPaper's `max-w-3xl` → `max-w-4xl` for main content
- [ ] Post pages with TOC: `max-w-6xl` total container
- [ ] Commit

---

## Phase 5: Blog Components

### Task 16: Prev/next post navigation

**Files**: `src/components/PostNav.astro` (or modify existing), `src/pages/blog/[...slug].astro`

- [ ] Check if AstroPaper already has prev/next; if not, create component
- [ ] Show post titles (not just arrows)
- [ ] Wire into post page: compute prev/next from sorted collection
- [ ] Verify links appear and navigate correctly
- [ ] Commit

### Task 17: Tag cloud with display labels (TDD)

**Files**: `src/utils/tagLabels.ts`, `src/utils/tagLabels.test.ts`, `src/components/TagCloud.astro`, `src/pages/tags/index.astro`

- [ ] **Write failing tests first** for `getTagLabel()`:
  - Returns "LLM" for "llm", "AI" for "ai", "RAG" for "rag"
  - Returns slug itself for unknown tags
- [ ] Run tests — expect failure
- [ ] **Implement** `tagLabels.ts`: lookup map + `getTagLabel()` function
- [ ] Run tests — expect pass
- [ ] Create `TagCloud.astro`: weighted font sizes, links to `/tags/<slug>/`
- [ ] Update `src/pages/tags/index.astro` to use TagCloud
- [ ] Verify tag cloud renders with correct sizes and display labels
- [ ] Commit

### Task 18: Comments section

**Files**: `src/components/GiscusComments.astro`, `src/components/DisqusComments.astro`, `src/layouts/PostDetails.astro`

- [ ] Create `GiscusComments.astro`: script embed, `data-theme="preferred_color_scheme"`
- [ ] Create `DisqusComments.astro`: loads static HTML from `src/content/comments/<slug>.html`
- [ ] Add both to `PostDetails.astro`: archived Disqus above Giscus
- [ ] Commit (Giscus setup in Task 30)

### Task 19: Code block enhancements

**Files**: `src/styles/global.css`, `src/components/` (if needed)

- [ ] Add copy-to-clipboard button on all code blocks
- [ ] Add line highlighting support (`{1,3-5}` syntax)
- [ ] Add optional file name label above code blocks
- [ ] Verify dual theme works (light/dark)
- [ ] Commit

### Task 20: Search (Pagefind)

- [ ] Verify Pagefind works with migrated content (AstroPaper includes this)
- [ ] Test: type query, results appear
- [ ] Fix if broken; commit if changes needed

### Task 21: Math rendering (KaTeX)

**Files**: `astro.config.ts`

- [ ] Install `remark-math` + `rehype-katex`
- [ ] Add to `astro.config.ts` remarkPlugins/rehypePlugins
- [ ] Add KaTeX CSS to layout
- [ ] Verify math renders in `display-math-expressions-in-hugo.md` and `math-symbols-test.md`
- [ ] Commit

### Task 22: Image optimization

**Files**: post markdown files (update image references)

- [ ] Use `astro:assets` for post images
- [ ] Configure automatic WebP/AVIF conversion, responsive `srcset`
- [ ] Add lazy loading for below-fold images
- [ ] Commit

### Task 23: Image grid CSS

**Files**: `src/styles/global.css`

- [ ] Add `.image-grid` with `grid-template-columns` for 2/3 col layouts
- [ ] Responsive: collapses to 1 column on mobile
- [ ] Verify posts with converted `fluid_imgs` render correctly
- [ ] Commit

### Task 24: Reading time

- [ ] Verify AstroPaper's existing reading time feature works with migrated content
- [ ] Fix if broken; commit if changes needed

---

## Phase 6: About Page

### Task 25: Build the About page

**Files**: `src/content/pages/about.md`, `src/pages/about.astro`

- [ ] Create `src/content/pages/about.md` with frontmatter schema (name, tagline, photo, interests, currently, social) + prose bio body
- [ ] Verify profile photo exists at `public/img/ann-profile.jpg` (copy from Hugo if needed)
- [ ] Create `src/pages/about.astro`:
  - Load content via `getEntry('pages', 'about')`
  - Render: photo + name + tagline → prose bio → "What I work on" interest tags → "Currently" blurb → social links
  - Left accent border in burnt orange on each section
  - Single-column, centered, max ~700px wide
- [ ] Add About to navigation (in `src/config.ts` or Header component)
- [ ] Verify at `http://localhost:4321/about/`
- [ ] Commit

---

## Phase 7: Custom Routes & Redirects

### Task 26: Custom route pages

**Files**: `src/pages/ammachi.md`, `src/pages/epsilla.md`, `src/pages/redesign.md`

- [ ] Migrate `content/ammachi/index.md` → `src/pages/ammachi.md`
- [ ] Migrate `content/epsilla/index.md` → `src/pages/epsilla.md`
- [ ] Migrate `content/redesign/index.md` → `src/pages/redesign.md`
- [ ] Verify each page renders at its URL
- [ ] Commit

### Task 27: URL routing — rename posts/ to blog/ *(pulled forward into Task 9)*

**Files**: `src/pages/blog/`, all component `href` references

- [x] Rename AstroPaper's `src/pages/posts/` → `src/pages/blog/`
- [x] Update all internal references from `/posts/` to `/blog/` (`index.astro`, `Header.astro`, `Breadcrumb.astro`, `getPath.ts`)
- [x] Header nav says "Blog", page title/heading says "Reflections", breadcrumb says "Reflections (Page N)"
- [x] Verify blog listing at `/blog/`, individual posts at `/blog/<slug>/`
- [x] Committed as part of Task 9

### Task 28: Redirect rules

**Files**: `public/_redirects`

- [ ] Create `public/_redirects`:
  ```
  /post/*    /blog/:splat   301
  /topics/*  /tags/:splat   301
  /index.xml /rss.xml       301
  ```
- [ ] Commit

### Task 29: RSS feed continuity

**Files**: `src/pages/rss.xml.ts`

- [ ] Verify AstroPaper's RSS feed generates at `/rss.xml`
- [ ] Confirm redirect rule covers old `/index.xml` path
- [ ] Commit if changes needed

---

## Phase 8: Testing & Polish

### Task 30: Giscus setup

- [ ] Enable GitHub Discussions on the `annjose.com` repo
- [ ] Configure at giscus.app, get repo ID and category ID
- [ ] Update `GiscusComments.astro` with repo config
- [ ] Verify comments load on a post
- [ ] Commit

### Task 31: Header navigation

**Files**: `src/components/Header.astro`, `src/config.ts`

- [ ] Configure nav items: Home, Blog, About
- [ ] Verify clean horizontal nav
- [ ] Commit

### Task 32: Footer with social links

**Files**: `src/components/Footer.astro`

- [ ] Verify social links: GitHub, LinkedIn, Bluesky, HackerNews
- [ ] Commit if changes needed

### Task 33: Custom 404 page

**Files**: `src/pages/404.astro`

- [ ] Design 404 page matching site theme
- [ ] Add helpful navigation back to home/blog
- [ ] Commit

### Task 34: Draft preview

- [ ] Verify draft posts (`draft: true`) are excluded from production builds
- [ ] Verify they're viewable locally with `pnpm run dev`

### Task 35: Playwright e2e tests

**Files**: `tests/e2e/pages.spec.ts`, `tests/e2e/navigation.spec.ts`, `tests/e2e/features.spec.ts`, `tests/e2e/playwright.config.ts`

- [ ] Install: `pnpm add -D @playwright/test && pnpm exec playwright install`
- [ ] Write tests per spec's Playwright section:
  - Pages render (home, blog listing, post, about, ammachi, tags, 404)
  - Navigation (header links, prev/next, tag links)
  - Redirects (`/post/<slug>/` → `/blog/<slug>/`, 301)
  - Dark mode toggle
  - TOC sidebar (desktop visible, mobile hidden)
  - Search (type query, results appear)
  - Code blocks (copy button)
  - Images load
- [ ] Run tests — expect pass
- [ ] Commit

### Task 36: Lighthouse CI

**Files**: `.github/workflows/ci.yml`

- [ ] Set up GitHub Actions workflow: build + Lighthouse CI
- [ ] Run Lighthouse on home, blog post, tags pages
- [ ] Enforce thresholds: performance > 90, accessibility > 95, best practices > 95, SEO > 95
- [ ] Commit

### Task 37: Link checker

**Files**: `.github/workflows/ci.yml`

- [ ] Add `lychee` or `broken-link-checker` to CI
- [ ] Validate all internal links resolve
- [ ] Check for broken anchor links
- [ ] Commit

### Task 38: Full testing checklist

- [ ] Run through the complete testing checklist from the spec
- [ ] Fix any issues found
- [ ] Deploy to Cloudflare Pages and verify on `annjose.pages.dev`

---

## Phase 9: Astro 6 Upgrade

### Task 39: Upgrade Astro 5 → 6

- [ ] Run `npx @astrojs/upgrade` to upgrade
- [ ] Address breaking changes:
  - Node.js 22+ required
  - Vite 7, Shiki 4, Zod 4 dependency updates
  - Zod imports: `astro/zod` instead of `astro:content`
- [ ] Re-run full test suite (Vitest + Playwright)
- [ ] Verify Cloudflare Pages preview build succeeds
- [ ] Commit

---

## Phase 10: DNS Cutover & Launch

### Task 40: Pre-cutover validation

- [ ] Final validation on `annjose.pages.dev`
- [ ] Migrate any Hugo posts published during the transition period
- [ ] Run Lighthouse on preview URL — compare against pre-migration baseline
- [ ] Verify Google Search Console is set up for new site

### Task 41: Branch merge & rename

- [ ] Merge `astro` branch into `master`
- [ ] Rename `master` → `main`: `git branch -m master main && git push origin main`
- [ ] Update GitHub default branch to `main`
- [ ] Update Cloudflare Pages production branch to `main`

### Task 42: DNS cutover

- [ ] Update DNS: point `annjose.com` to Cloudflare Pages
- [ ] Wait for DNS propagation (5-30 min with Cloudflare proxy)
- [ ] Verify SSL certificate is active
- [ ] Test live site on `annjose.com`
- [ ] Submit updated sitemap to Google Search Console

### Task 43: Post-launch monitoring

- [ ] Monitor Cloudflare Analytics for 404 errors
- [ ] Check Google Search Console for crawl errors
- [ ] Remove CNAME from old `public/` submodule to avoid GitHub Pages conflict
- [ ] Verify Counterscale analytics is receiving data
- [ ] Celebrate 🎉
