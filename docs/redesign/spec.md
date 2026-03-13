# Blog Redesign: Hugo to Astro 6 Migration Plan

## Context

The blog at annjose.com ("Reflections" by Ann Catherine Jose) runs on Hugo with the Blackburn theme, deployed to GitHub Pages. It has 58 posts (28 page bundles + 30 single-file), tags/topics taxonomies, Disqus comments, and custom routes (/ammachi/, /epsilla/). The goal is to modernize with Astro 6 + Tailwind CSS, hosted on Cloudflare Pages, using Astro Paper as the starting template.

## Decisions Made
- **Base**: Fork Astro Paper theme, customize heavily
- **Hosting**: Cloudflare Pages (static output for Phase 1)
- **Comments**: Static embed of old Disqus comments + Giscus for new posts
- **Migration**: All 58 posts migrated
- **Topics taxonomy**: Merge into tags (simplifies architecture)
- **Projects page**: Side projects & open source
- **Auth**: Deferred to Phase 2

---

## Phase 0: Project Scaffolding (Day 1-2)

### 0.1 Create new Astro project
- Create `/Users/ann/dev/myblog-astro` (separate from Hugo repo to keep live site running)
- Scaffold from Astro Paper: `npx degit satnaing/astro-paper . && npm install`
- Verify Astro 6.x in package.json, add `@astrojs/sitemap`, `@astrojs/mdx`

### 0.2 Configure for Cloudflare Pages
- `astro.config.ts`: set `site: "https://annjose.com"`, `output: "static"`
- `wrangler.jsonc`: set `pages_build_output_dir: "./dist"`
- Syntax highlighting: dual theme (light: `min-light`, dark: `night-owl`) with line numbers

### 0.3 Update site metadata in `src/config.ts`
- title: "Reflections", author: "Ann Catherine Jose"
- Social links: GitHub, LinkedIn, Bluesky, HackerNews (all `annjose`)
- postPerPage: 10, lightAndDarkMode: true, dynamicOgImage: true

---

## Phase 1: Content Migration (Day 2-4) -- CRITICAL PATH

### 1.1 Migration script (`scripts/migrate-content.ts`)

**Front matter conversion (TOML `+++` → YAML `---`)**:
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
1. `{{< pure_table >}}` (6 posts) → standard markdown tables
2. `{{< fluid_imgs >}}` (5 posts) → `<div class="image-grid cols-N">` with markdown images
3. `{{< video >}}` (1 post) → HTML5 `<video>` tag

**File structure mapping**:
- Page bundles: `content/post/slug/index.md` → `src/data/blog/slug/index.md` (with colocated images)
- Single-file: `content/post/slug.md` → `src/data/blog/slug.md`
- Static images: `static/img/*` → `public/img/*`
- About page: `content/about.md` → `src/pages/about.md`
- Custom routes: `/ammachi/`, `/epsilla/` → dedicated Astro pages

### 1.2 Disqus comment export (`scripts/convert-disqus.ts`)
- Export XML from Disqus admin (shortname: `anncjose`)
- Parse XML, group by thread URL → post slug
- Generate static HTML fragments at `src/data/comments/<slug>.html`
- Style as "Archived Comments" section below Giscus

### 1.3 Validation script (`scripts/validate-migration.ts`)
- Confirm 58 posts migrated, YAML parses correctly
- Check all image references resolve to actual files
- Check no residual `{{<` or `{{%` shortcode syntax remains
- Verify all dates parse, all tags are lowercase slugs

---

## Phase 2: Content Collections Schema (Day 3-4)

### 2.1 Extend `src/content.config.ts`

**Blog collection** - add to existing Astro Paper schema:
- `disqusSlug: z.string().optional()` — links archived comments

**New Projects collection**:
```
title, description, techStack: string[], liveUrl?, githubUrl?,
status: "active"|"archived"|"completed", featured: boolean,
sortOrder: number, image?, pubDatetime?
```

### 2.2 Taxonomy display labels
Preserve conventions from `docs/taxonomy-conventions.md`:
- `llm` renders as "LLM", `ai` as "AI", `rag` as "RAG"
- Build a display label map in a utility function

---

## Phase 3: URL Routing (Day 4-5)

### 3.1 Keep `/post/` URL structure
- Rename Astro Paper's `src/pages/posts/` to `src/pages/post/` to match Hugo URLs exactly
- This preserves all existing links, SEO, and social shares - no redirects needed

### 3.2 Custom route pages
- `src/pages/ammachi.astro` — renders ammachi content with video
- `src/pages/epsilla.astro` — renders epsilla evaluation
- Architecture supports future `/books`, `/notes`, `/photos` as additional Astro pages or collections

### 3.3 Redirects (`public/_redirects`)
- `/topics/*` → `/tags/:splat` (301) — old topic URLs redirect to merged tags

---

## Phase 4: New Components (Day 5-8)

### 4.1 Floating Table of Contents (`src/components/TableOfContents.astro`)
- Receives `headings` from post render result
- Sticky sidebar on desktop (right of content, `xl:block`, hidden on mobile)
- Uses `IntersectionObserver` to highlight current section as user scrolls
- Layout: article `max-w-4xl` + TOC sidebar `w-64` within `max-w-6xl` container

### 4.2 Tag Cloud (`src/components/TagCloud.astro`)
- Weighted font sizes based on post count
- Replaces Astro Paper's flat tag list on `/tags/`
- Display labels for acronyms (llm→LLM, ai→AI)

### 4.3 Comments section in `PostDetails.astro`
- **GiscusComments component**: script embed, `data-theme="preferred_color_scheme"`, mapped by pathname
- **DisqusComments component**: loads static HTML from `src/data/comments/<slug>.html`
- Both render at bottom of post, archived Disqus above Giscus

### 4.4 Projects page (`src/pages/projects.astro`)
- Grid layout with `ProjectCard` components
- Featured projects (larger cards, 2-col) + other projects (3-col grid)
- Each card: title, description, tech stack badges, status badge, live/GitHub links
- Not a timeline like adamfortuna — a clean card grid that's fast to render

### 4.5 Image grid CSS (replaces `fluid_imgs` shortcode)
- CSS-only: `.image-grid` with `grid-template-columns` for 2/3 col layouts
- Responsive: collapses to 1 column on mobile

### 4.6 Wider content area
- Increase Astro Paper's `max-w-3xl` to `max-w-4xl` for main content
- Post pages with TOC: `max-w-6xl` total, article `max-w-4xl`, TOC `w-64`

### 4.7 Prev/Next post navigation
- Astro Paper may have this; if not, add to `PostDetails.astro`
- Show post titles (not just arrows) for context

---

## Phase 5: Layout & Design Polish (Day 8-10)

### 5.1 Header navigation
- Home, Blog, Projects, About
- Clean horizontal nav (not the Hugo side menu)

### 5.2 Footer with social links
- GitHub, LinkedIn, Bluesky, HackerNews

### 5.3 Custom color scheme & fonts
- Customize Tailwind skin colors for a distinctive look
- Consider system fonts or a clean font pairing (e.g., Inter + JetBrains Mono for code)

### 5.4 Analytics
- Google Analytics GA4 (`G-2PEL4BVYJE`) in `Layout.astro` head
- Optionally add Cloudflare Web Analytics (privacy-friendly, can run alongside)

---

## Phase 6: Deployment (Day 10-11)

### 6.1 Cloudflare Pages setup
- Connect GitHub repo, build command: `npm run build`, output: `dist`
- Test on preview URL (`myblog-astro.pages.dev`) before DNS cutover

### 6.2 Giscus setup
- Enable GitHub Discussions on the new repo
- Configure at giscus.app, get repo ID and category ID

### 6.3 GitHub Actions CI
- Build check on push/PR to catch errors early

---

## Phase 7: Testing & Validation (Day 11-13)

- [ ] All 58 posts render without errors
- [ ] All images load (colocated and static)
- [ ] Shortcode conversions render correctly (tables, grids, video)
- [ ] `/post/slug-name/` URLs match old site exactly
- [ ] `/ammachi/`, `/epsilla/`, `/about/` work
- [ ] Light/dark mode, mobile responsive (375px, 768px, 1024px, 1440px)
- [ ] TOC sidebar displays correctly, highlights on scroll
- [ ] Search indexes all posts
- [ ] Tag cloud shows correct counts
- [ ] OG images generate for all posts
- [ ] Giscus loads, archived Disqus comments display
- [ ] Prev/next navigation works
- [ ] Sitemap and RSS feed work
- [ ] Lighthouse > 95 all metrics

---

## Phase 8: DNS Cutover (Day 13-14)

1. Update DNS: point `annjose.com` to Cloudflare Pages
2. Verify SSL, test live site
3. Submit sitemap to Google Search Console
4. Keep old GitHub Pages repo as backup

---

## Deferred to Phase 2
- Auth for private routes (Cloudflare Access or Workers)
- GUID-based secret URLs
- Additional routes: `/books`, `/notes`, `/photos`
- Newsletter integration
- SSR adapter (only if server-rendered routes needed)

---

## Key Files to Modify/Create

| File | Action |
|---|---|
| `scripts/migrate-content.ts` | Create: content migration script |
| `scripts/convert-disqus.ts` | Create: Disqus → static HTML |
| `src/content.config.ts` | Modify: add projects collection, disqusSlug |
| `src/config.ts` | Modify: site metadata |
| `src/components/TableOfContents.astro` | Create: floating TOC |
| `src/components/TagCloud.astro` | Create: weighted tag cloud |
| `src/components/GiscusComments.astro` | Create: Giscus embed |
| `src/components/DisqusComments.astro` | Create: archived comments |
| `src/components/ProjectCard.astro` | Create: project card |
| `src/pages/projects.astro` | Create: projects page |
| `src/pages/ammachi.astro` | Create: custom route |
| `src/pages/epsilla.astro` | Create: custom route |
| `src/layouts/PostDetails.astro` | Modify: add TOC sidebar + comments |
| `src/pages/post/` (rename from posts/) | Modify: URL structure |
| `astro.config.ts` | Modify: site URL, markdown config |
| `wrangler.jsonc` | Create: Cloudflare config |
| `tailwind.config.mjs` | Modify: custom colors, wider max-width |

## Verification
1. Run migration script, validate with validation script
2. `npm run build` — confirm zero errors
3. `npm run preview` — manually check 5-10 posts, projects page, about, custom routes
4. Test on Cloudflare Pages preview URL before DNS cutover
5. Lighthouse audit on preview URL
