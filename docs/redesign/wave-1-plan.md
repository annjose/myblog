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

**Files**: `src/styles/global.css`, `src/styles/typography.css`, `astro.config.ts`, `src/layouts/Layout.astro`, `src/layouts/PostDetails.astro`

- [x] Locate AstroPaper's color configuration (CSS variables in `src/styles/global.css`, `:root` and `[data-theme="dark"]` selectors)
- [x] Override CSS color variables with Warm & Earthy palette (hex values per spec):
  - Light: background `#faf7f5`, text `#1c1917`, accent `#c2410c`, muted `#78716c`, border `#fed7aa`
  - Dark: background `#1c1917`, text `#faf7f5`, accent `#c2410c`, muted `#a8a29e`, border `#44403c`
  - Added `--tag-bg` and `--tag-border` variables for both modes
- [x] Configure fonts via Astro experimental fonts API (replaces Tailwind config approach):
  - Inter (400–700, sans-serif) for body/headings
  - JetBrains Mono (400–500, monospace) for code
- [x] Add `<Font>` components to `Layout.astro` for Inter + JetBrains Mono
- [x] Style inline code with warm bg + neutral border, code blocks with neutral gray borders
- [x] Style tables with alternating row colors and distinct header background
- [x] Fix Copy button on code blocks: translucent bg with backdrop blur
- [x] Preview in browser — verified warm tones, dark mode toggle, fonts, code blocks, tables
- [x] Commit

### Task 12: Configure syntax highlighting

**Files**: `astro.config.ts`, `src/styles/typography.css`

- [x] Shiki themes already configured in Task 3: `{ light: "github-light", dark: "night-owl" }`
- [x] Set `wrap: true` (was `false`)
- [x] `@shikijs/transformers` already installed in Task 3 (diff, highlight, word highlight, file name)
- [x] Add CSS counter-based line numbers — only on code blocks with 4+ lines, muted color, non-selectable
- [x] Verify posts with code render correctly in both modes:
  - `/blog/upgrade-hugo/` — short (2-line, no numbers) + long (10-line, with numbers), wrapping
  - `/blog/mobile-on-device-ai-hands-on-gemma/` — Swift code, 11 lines
  - `/blog/xcode-playgrounds-tdd/` — 26-line block in dark mode (night-owl)
- [x] Commit

---

## Phase 4: Core Layouts

### Task 13: Base layout — site identity, OG image, analytics

**Files**: `src/config.ts`, `src/layouts/Layout.astro`, `public/og-default.jpg`

- [x] Review what AstroPaper's layout already provides (head, dark mode, OG meta, Twitter Card)
- [x] Replace default OG image: resize custom banner to 1200x634 JPG (182KB), delete `astropaper-og.jpg`
- [x] Update site config: title → "Ann Catherine Jose", description updated, ogImage → `og-default.jpg`
- [x] Set `theme-color` meta tag to `#faf7f5` (warm light background)
- [x] Verify OG and Twitter meta tags are present and correct
- [x] Commit

### Task 14: Post layout with TOC sidebar

**Files**: `src/layouts/PostDetails.astro`, `src/components/TableOfContents.astro`

- [x] Inspect AstroPaper's existing post layout
- [x] Create `TableOfContents.astro`:
  - Props: `headings: { depth, slug, text }[]`
  - Filter to h2 and h3 headings
  - Desktop: sticky sidebar (`position: sticky; top: 5rem`), `hidden lg:block`
  - Mobile: collapsible `<details>` dropdown, `lg:hidden`
  - Only render when 3+ headings
  - IntersectionObserver script for active section highlighting
- [x] Modify `PostDetails.astro`:
  - Add two-column flex layout: article `~65%` + TOC sidebar `~25%` at lg+
  - Mobile TOC dropdown above post body
  - Import and render `TableOfContents` component
  - Unified container so Go back, title, date, and content share the same left edge
- [x] Remove `remark-toc` and `remark-collapse` from `astro.config.ts` (replaced by sidebar TOC)
- [x] Remove `app-layout` from `BackButton.astro` (parent handles layout now)
- [x] Increase `:target` scroll-margin to `5rem` for proper heading offset when jumping via TOC
- [x] Verify on a long post: sticky sidebar on desktop, dropdown on mobile
- [x] Commit

---

## Phase 5: Blog Components

### Task 16: Prev/next post navigation

**Files**: `src/components/PostNav.astro` (or modify existing), `src/pages/blog/[...slug].astro`

- [x] Check if AstroPaper already has prev/next; if not, create component — AstroPaper already includes this in `PostDetails.astro` (lines 76-88, 150-180)
- [x] Show post titles (not just arrows) — already shows "Previous/Next Post" label + title in accent color
- [x] Wire into post page: compute prev/next from sorted collection — already wired via `getSortedPosts`
- [x] Verify links appear and navigate correctly — verified visually on dev server
- [x] Commit (no changes needed — already built into AstroPaper)

### Task 17: Tag cloud with display labels (TDD)

**Files**: `src/utils/tagLabels.ts`, `src/utils/tagLabels.test.ts`, `src/components/TagCloud.astro`, `src/pages/tags/index.astro`

- [x] **Write failing tests first** for `getTagLabel()`: 3 test cases (acronyms, auto-title-case, single words)
- [x] Run tests — expect failure ✓
- [x] **Implement** `tagLabels.ts`: lookup map (17 entries) + `getTagLabel()` with auto-title-case fallback
- [x] Run tests — expect pass ✓ (41/41)
- [x] Create `TagCloud.astro`: weighted font sizes (5 tiers), `#` prefix, superscript counts, links to `/tags/<slug>/`
- [x] Update `src/pages/tags/index.astro` to use TagCloud
- [x] Update `getUniqueTags.ts` to use `getTagLabel()` for display names on tag archive pages
- [x] Verify tag cloud renders with correct sizes and display labels (light + dark mode)
- [x] Commit

### Task 18: Comments section

**Files**: `src/components/GiscusComments.astro`, `src/components/ArchivedComments.astro`, `src/layouts/PostDetails.astro`

- [x] Create `GiscusComments.astro`: script embed, `data-theme="preferred_color_scheme"`, placeholder config (Task 30)
- [x] Create `ArchivedComments.astro` (renamed from DisqusComments): loads static HTML from `src/content/comments/<slug>.html` using `disqusSlug` frontmatter
- [x] Add both to `PostDetails.astro`: archived comments above Giscus, only shows archived section when comment file exists
- [x] Commit (Giscus setup in Task 30)

### Task 19: Code block enhancements

**Files**: `src/styles/global.css`, `src/components/` (if needed)

- [x] Add copy-to-clipboard button on all code blocks — already in PostDetails.astro (`attachCopyButtons()`)
- [x] Add line highlighting support (`{1,3-5}` syntax) — `transformerNotationHighlight()` in astro.config.ts
- [x] Add optional file name label above code blocks — `transformerFileName()` in astro.config.ts
- [x] Verify dual theme works (light/dark) — `github-light` / `night-owl` configured
- [x] Commit (no changes needed — already implemented in Tasks 3 and 12)

### Task 20: Search (Pagefind)

- [x] Verify Pagefind works with migrated content — build indexes 55 pages, Pagefind output in `dist/pagefind/`
- [x] Test: search only works in production build (expected — AstroPaper shows dev mode warning)
- [x] No changes needed

### Task 21: Math rendering (rehype-mathjax/svg)

**Files**: `astro.config.ts`, `src/styles/global.css`

- [x] Install `remark-math` + `rehype-mathjax` (using `/svg` subpath — renders as inline SVG, no CSS needed)
- [x] Add to `astro.config.ts` remarkPlugins/rehypePlugins
- [x] Fix inline math line-breaking: add `display: inline` CSS for SVGs inside `mjx-container` (browser defaults SVG to `display: block`)
- [x] Convert Hugo-style `\\(...\\)` math delimiters to standard `$...$` in both math posts
- [x] Make `math-symbols-test.md` non-draft
- [x] Verify math renders in both math posts (inline + display equations, colored text, fractions)
- [x] Commit

### Task 22: Image optimization

**Files**: post markdown files (update image references)

- [x] Use `astro:assets` for post images — already active, colocated images served through `_image` endpoint
- [x] Configure automatic WebP/AVIF conversion, responsive `srcset` — `image: { responsiveStyles: true, layout: "constrained" }` in astro.config.ts
- [x] Add lazy loading for below-fold images — Astro adds `loading="lazy"` automatically
- [x] Commit (no changes needed — already configured)

### Task 23: Image grid CSS

**Files**: `src/styles/global.css`

- [x] No `fluid_imgs` shortcodes remain — migration converted them to plain markdown images (vertically stacked)
- [x] Multi-column grid layout deferred to Wave 2 per spec
- [x] No changes needed

### Task 24: Reading time — removed from scope

Not doing in Wave 1. Not distinctive enough to justify the plugin/schema/component work.

---

## Phase 6: About Page

### Task 25: Build the About page

**Files**: `src/pages/about.md`, `src/layouts/AboutLayout.astro`

- [x] Replaced AstroPaper placeholder in `src/pages/about.md` with Ann's real bio, structured frontmatter (name, tagline, interests, currently)
- [x] Used markdown page + layout pattern instead of content collection (per Astro docs, collections are overkill for a few independent pages)
- [x] Enhanced `AboutLayout.astro` with sectioned profile layout:
  - Hero: profile photo (`ann-color-sketch-square.png` via Astro Image) + name + tagline
  - Bio: markdown body rendered via `<slot />` with `app-prose` styling
  - "What I work on": interest tags as styled pills from `frontmatter.interests`
  - "Currently": blurb paragraph from `frontmatter.currently`
  - "Connect": reuses `Socials.astro` component (GitHub, LinkedIn, Bluesky, HN)
- [x] Each section has `border-l-4 border-accent` (burnt orange left accent border)
- [x] Single-column, centered, `max-w-[700px]`
- [x] Navigation already wired in `Header.astro` — no changes needed
- [x] Bio content: Professional Journey, Career Pivot, Technical Expertise (with agentic coding), Current Focus, Projects (7 projects showing progression to agentic coding), Beyond Technology
- [x] Verified: build passes, light/dark mode, mobile responsive
- [x] Commit

---

## Phase 7: Custom Routes & Redirects

### Task 26: Custom route pages

**Files**: `src/pages/ammachi.md`, `src/pages/redesign.md`, `src/layouts/PageLayout.astro`, `src/layouts/RedesignLayout.astro`

- [x] Migrate `content/ammachi/index.md` → `src/pages/ammachi.md` (TOML→YAML, uses `PageLayout.astro`)
- [x] Created `src/layouts/PageLayout.astro` — reusable generic page layout (Header, Breadcrumb, prose content, Footer)
- [x] Created callout block system: Shiki transformer (`src/utils/transformers/callout.js`) + CSS in `typography.css`
  - `` ```text callout `` — accent left border, no box, no line numbers, body font
  - `` ```text callout boxed `` — accent left border + subtle border and background
- [x] ~~Migrate `/epsilla`~~ — dropped (outdated content, no analytics traffic; Hugo source preserved in git history)
- [x] Verified `/ammachi/` renders correctly in light and dark mode
- [x] Migrate `content/redesign/index.md` → `src/pages/redesign.md` with enhanced layout (TOC sidebar + collapsible parts)
- [x] Commit

### Task 27: URL routing — rename posts/ to blog/ *(pulled forward into Task 9)*

**Files**: `src/pages/blog/`, all component `href` references

- [x] Rename AstroPaper's `src/pages/posts/` → `src/pages/blog/`
- [x] Update all internal references from `/posts/` to `/blog/` (`index.astro`, `Header.astro`, `Breadcrumb.astro`, `getPath.ts`)
- [x] Header nav says "Blog", page title/heading says "Reflections", breadcrumb says "Reflections (Page N)"
- [x] Verify blog listing at `/blog/`, individual posts at `/blog/<slug>/`
- [x] Committed as part of Task 9

### Task 28: Redirect rules

**Files**: `public/_redirects`

- [x] Create `public/_redirects`:
  ```
  /post/*    /blog/:splat   301
  /topics/*  /tags/:splat   301
  /index.xml /rss.xml       301
  ```
- [x] Commit

### Task 29: RSS feed continuity

**Files**: `src/pages/rss.xml.ts`

- [x] Verify AstroPaper's RSS feed generates at `/rss.xml` — confirmed in build output
- [x] Confirm redirect rule covers old `/index.xml` path — included in `_redirects`
- [x] No changes needed to RSS feed itself

### Task 30: Giscus setup

- [x] Enable GitHub Discussions on the `annjose.com` repo
- [x] Configure at giscus.app, get repo ID and category ID (category: Announcements)
- [x] Update `GiscusComments.astro` with repo config
- [x] Fix Giscus not loading on View Transitions navigation — dynamically create script on `astro:page-load`
- [x] Move prev/next navigation above comments section
- [x] Verify comments load on a post
- [x] Commit

---

## Phase 8: Testing & Polish

### Task 31: Header navigation

**Files**: `src/components/Header.astro`, `src/config.ts`

- [x] Configure nav items: Home, Blog, About
- [x] Verify clean horizontal nav
- [x] Commit

### Task 32: Footer with social links

**Files**: `src/components/Footer.astro`

- [x] Verify social links: GitHub, LinkedIn, Bluesky, HackerNews
- [x] No changes needed

### Task 33: Custom 404 page

**Files**: `src/pages/404.astro`

- [x] Design 404 page matching site theme
- [x] Add helpful navigation back to home/blog
- [x] No changes needed

### Task 34: Draft preview

- [x] Verify draft posts (`draft: true`) are excluded from production builds
- [x] Verify they're viewable locally with `pnpm run dev`
- [x] Delete the two draft posts that are now obsolete

### Task 34a: Replace Hugo-era local checks with Astro checks ✅

**Files**: `scripts/check-content.sh` → deleted; `scripts/check-taxonomy.test.ts` → added

- [x] Deleted Hugo-era `scripts/check-content.sh`
- [x] Added `scripts/check-taxonomy.test.ts` — vitest test detecting tag taxonomy collisions
- [x] Committed

### Task 34b: Update operator docs from Hugo to Astro ✅

**Rewrote**: `README.md`, `AGENTS.md`, `docs/content-style-guide.md`, `docs/taxonomy-conventions.md`
**Deleted**: `docs/runbook.md`, `docs/deploy.md`, `docs/repo-structure.md`, `docs/maintenance-baseline.md`, `docs/theme-overrides.md`, `docs/image-guidelines.md`

- [x] Rewrote README.md and AGENTS.md for Astro (commands, content model, definition of done)
- [x] Updated content-style-guide.md for YAML frontmatter and Astro conventions
- [x] Updated taxonomy-conventions.md (removed topics references)
- [x] Deleted 6 obsolete Hugo-era docs (thin/obvious content consolidated into README + AGENTS.md)
- [x] Committed

### Task 34c: Modernize CI workflow for Astro ✅

**Files**: `.github/workflows/content-check.yml`, `package.json`, `README.md`, `AGENTS.md`

- [x] Replaced Hugo/ripgrep setup with pnpm + Node 22, removed submodules checkout
- [x] Steps: install → `pnpm test` → `pnpm run build`
- [x] Branch triggers: push on `astro` and `main`, all PRs
- [x] Removed redundant `pnpm run check` script (CI covers test + build separately)
- [x] Committed

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

### Task 38: Fix JSON-LD structured data on non-post pages

- [ ] JSON-LD uses `BlogPosting` on all pages (homepage, about, tags) — should use `WebSite` or `Person` as appropriate
- [ ] Update `Layout.astro` to accept a `schemaType` prop or conditionally set `@type` based on page context

### Task 38b: Full testing checklist

- [ ] Run through the complete testing checklist from the spec
- [ ] Fix any issues found

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

- [ ] Add Counterscale analytics script to `<head>` of `Layout.astro` (deferred from Task 13 to avoid polluting prod analytics with dev traffic)
- [ ] Revert `SITE.website` in `src/config.ts` from `https://annjose.pages.dev/` back to `https://annjose.com/` (temporarily changed for OG image testing)
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
- [ ] Verify OG image preview renders correctly on Bluesky, Signal, Slack after domain cutover to annjose.com
- [ ] Celebrate 🎉
