# Blog Redesign Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate annjose.com from Hugo + Blackburn to Astro 6 + Tailwind CSS (Astro Paper base), with full blog features and an About page, deployed on Cloudflare Pages.

**Architecture:** In-place repo migration — Hugo artifacts are removed, Astro Paper is scaffolded into the same repo root, content is migrated via a one-off Node.js script, and Cloudflare Pages replaces GitHub Pages as the deployment platform.

**Tech Stack:** Astro 6, Tailwind CSS, Astro Paper template, Shiki (syntax highlighting), Vitest (unit tests), Node.js (migration script), Cloudflare Pages.

---

## Chunk 1: Project Bootstrap

### Task 1: Tag the Hugo baseline and clean up Hugo artifacts

**Files:**
- Remove: `themes/` (entire directory)
- Remove: `config.toml`
- Remove: `deploy.sh`
- Remove: `resources/` (entire directory, already gitignored but may exist locally)
- Remove: `public/` git submodule

- [ ] **Step 1.1: Tag the current Hugo state**

```bash
git tag hugo-final
git push origin hugo-final
```

Expected: tag created and pushed.

- [ ] **Step 1.2: Remove the public/ git submodule**

```bash
git submodule deinit -f public
git rm -f public
rm -rf .git/modules/public
```

Expected: `public/` directory and submodule config gone.

- [ ] **Step 1.3: Remove Hugo-specific files**

```bash
git rm -r themes/ config.toml deploy.sh
rm -rf resources/
```

Expected: Hugo theme, config, and deploy script removed from repo. `resources/` removed from disk.

- [ ] **Step 1.4: Commit the cleanup**

The `git rm` commands in Steps 1.2 and 1.3 already staged their changes. Commit them now:

```bash
git commit -m "chore: remove Hugo artifacts before Astro migration"
```

Expected: clean commit, only `content/`, `static/`, `docs/`, `AGENTS.md`, `README.md`, `scripts/`, `.gitignore`, `.gitmodules` (now empty) remain.

---

### Task 2: Scaffold Astro Paper into the repo root

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.cjs`, `tsconfig.json`
- Create: `src/` directory with Astro Paper's starter structure
- Create: `.gitignore` additions for `node_modules/`, `dist/`, `.astro/`

- [ ] **Step 2.1: Scaffold Astro Paper**

Run from the repo root:

```bash
npm create astro@latest . -- --template satnaing/astro-paper --no-install --no-git
```

When prompted about existing files, choose to merge/keep existing files (do not overwrite `docs/`, `AGENTS.md`, `README.md`, `.gitignore`, `scripts/`).

Expected: `src/`, `public/`, `package.json`, `astro.config.mjs`, `tailwind.config.cjs`, `tsconfig.json` are created.

- [ ] **Step 2.2: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no install errors.

- [ ] **Step 2.3: Add Astro-specific entries to .gitignore**

Open `.gitignore` and append:

```
# Astro
node_modules/
dist/
.astro/
```

- [ ] **Step 2.4: Note on Cloudflare Pages adapter**

Cloudflare Pages can deploy a fully static Astro build without a server adapter. Since this blog has no server-side rendering requirements, **do not install `@astrojs/cloudflare`**. The static output (`dist/`) is deployed directly to Cloudflare Pages.

Verify `astro.config.mjs` has no `output` set (defaults to `"static"`) and no adapter import.

- [ ] **Step 2.5: Verify the scaffolded site builds**

```bash
npm run build
```

Expected: `dist/` created, build exits with 0. Astro Paper's demo content builds successfully.

- [ ] **Step 2.6: Verify dev server starts**

```bash
npm run dev
```

Expected: dev server starts on `http://localhost:4321`. Open in browser — Astro Paper default site is visible. Ctrl+C to stop.

- [ ] **Step 2.7: Commit the Astro scaffold**

```bash
git add package.json package-lock.json astro.config.mjs tailwind.config.cjs tsconfig.json src/ .gitignore
git commit -m "chore: scaffold Astro Paper"
```

---

### Task 3: Configure Astro Paper site settings

**Files:**
- Modify: `src/config.ts` — site title, description, author, social links
- Modify: `astro.config.mjs` — site URL, output mode

- [ ] **Step 3.1: Update src/config.ts**

Astro Paper stores site-wide config in `src/config.ts`. Replace the default values:

```typescript
import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://annjose.com/",
  author: "Ann Catherine Jose",
  desc: "Reflections by Ann — writing on AI, tech, and personal growth.",
  title: "Reflections",
  ogImage: "og-default.png",
  lightAndDarkMode: true,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en",
  langTag: ["en-EN"],
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: false,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/annjose",
    linkTitle: `${SITE.author} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/annjose",
    linkTitle: `${SITE.author} on LinkedIn`,
    active: true,
  },
  {
    name: "BlueSky",
    href: "https://bsky.app/profile/annjose.com",
    linkTitle: `${SITE.author} on BlueSky`,
    active: true,
  },
  {
    name: "HackerNews",
    href: "https://news.ycombinator.com/user?id=annjose",
    linkTitle: `${SITE.author} on Hacker News`,
    active: true,
  },
];
```

Note: If Astro Paper's `src/config.ts` structure differs from above (it evolves between versions), adapt field names to match what the template generated. Keep the values the same.

- [ ] **Step 3.2: Update astro.config.mjs site URL**

Ensure `site` is set to the production URL. Do not add an adapter — static output is Astro's default and Cloudflare Pages deploys it directly:

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://annjose.com",
  integrations: [tailwind()],
  // No adapter needed: Cloudflare Pages deploys the static dist/ output directly
});
```

- [ ] **Step 3.3: Verify build still passes**

```bash
npm run build
```

Expected: build passes with 0 errors.

- [ ] **Step 3.4: Commit**

```bash
git add src/config.ts astro.config.mjs
git commit -m "chore: configure Astro Paper site settings and social links"
```

---

## Chunk 2: Content Migration

### Task 4: Define content collection schemas

**Files:**
- Create: `src/content.config.ts` (or modify `src/content/config.ts` if Astro Paper created it) — Zod schemas for `blog` and `pages` collections

- [ ] **Step 4.1: Check where Astro Paper put its content config**

```bash
ls src/content/
```

If `config.ts` exists there (Astro 4-style), use it. If not, create `src/content.config.ts` at repo root (Astro 5+ style). The template will determine which pattern to use.

- [ ] **Step 4.2: Define the blog collection schema**

In whichever config file Astro Paper uses, replace/add the blog collection schema:

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Use glob loader for Astro 5+ content layer, or type: 'content' for legacy
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().optional().default(false),
      tags: z.array(z.string()).optional().default([]),
      ogImage: z.string().optional(),
      canonicalURL: z.string().optional(),
    }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    photo: z.string(),
    interests: z.array(z.string()),
    currently: z.string(),
    social: z.object({
      bluesky: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
  }),
});

export const collections = { blog, pages };
```

Note: Astro Paper may already define a `blog` collection. If so, merge/replace its schema with the one above.

- [ ] **Step 4.3: Verify TypeScript compiles**

```bash
npx astro check
```

Expected: 0 type errors related to the content config. (Ignore errors in demo content that will be replaced.)

- [ ] **Step 4.4: Commit**

```bash
git add src/content/config.ts  # or src/content.config.ts
git commit -m "feat: define content collection schemas for blog and pages"
```

---

### Task 5: Write and test the Hugo-to-Astro migration script

**Files:**
- Create: `scripts/migrate-hugo-to-astro.js` — converts Hugo post files to Astro-compatible format
- Create: `scripts/migrate-hugo-to-astro.test.js` — Vitest unit tests

The script must:
1. Find all `.md` files under `content/post/`
2. Parse TOML frontmatter (`+++`) into a JS object
3. Remap fields: `images[0]` → `ogImage`, drop `topics`
4. Convert date to ISO string
5. Output YAML frontmatter (`---`)
6. Write to `src/content/blog/` (preserving directory structure and filenames)
7. Copy colocated image files alongside

- [ ] **Step 5.1: Install dependencies for the script**

```bash
npm install --save-dev @iarna/toml js-yaml vitest
```

Expected: packages added to `devDependencies`.

- [ ] **Step 5.2: Add Vitest config to package.json**

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 5.3: Write the failing tests first**

Create `scripts/migrate-hugo-to-astro.test.js`:

```javascript
import { describe, it, expect } from "vitest";
import { parseHugoFrontmatter, convertFrontmatter } from "./migrate-hugo-to-astro.js";

describe("parseHugoFrontmatter", () => {
  it("parses TOML frontmatter delimited by +++", () => {
    const input = `+++
title = "Hello World"
date = "2024-01-15T10:00:00Z"
tags = ["ai", "llm"]
draft = false
+++

Post body here.`;

    const { frontmatter, body } = parseHugoFrontmatter(input);
    expect(frontmatter.title).toBe("Hello World");
    expect(frontmatter.tags).toEqual(["ai", "llm"]);
    expect(body.trim()).toBe("Post body here.");
  });

  it("handles posts with no frontmatter gracefully", () => {
    const input = "Just body text.";
    expect(() => parseHugoFrontmatter(input)).toThrow("No TOML frontmatter");
  });
});

describe("convertFrontmatter", () => {
  it("maps images[0] to ogImage", () => {
    const hugo = { title: "T", description: "D", date: "2024-01-01", tags: [], images: ["hero.png"] };
    const astro = convertFrontmatter(hugo);
    expect(astro.ogImage).toBe("hero.png");
    expect(astro.images).toBeUndefined();
  });

  it("drops the topics field", () => {
    const hugo = { title: "T", description: "D", date: "2024-01-01", tags: [], topics: ["tech"] };
    const astro = convertFrontmatter(hugo);
    expect(astro.topics).toBeUndefined();
  });

  it("preserves draft status", () => {
    const hugo = { title: "T", description: "D", date: "2024-01-01", tags: [], draft: true };
    const astro = convertFrontmatter(hugo);
    expect(astro.draft).toBe(true);
  });

  it("coerces date to ISO string", () => {
    const hugo = { title: "T", description: "D", date: "2024-01-15T10:00:00-07:00", tags: [] };
    const astro = convertFrontmatter(hugo);
    expect(astro.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it("omits ogImage when images is absent", () => {
    const hugo = { title: "T", description: "D", date: "2024-01-01", tags: [] };
    const astro = convertFrontmatter(hugo);
    expect(astro.ogImage).toBeUndefined();
  });
});
```

- [ ] **Step 5.4: Run tests — expect failures**

```bash
npm test
```

Expected: all tests fail with "Cannot find module" or similar — the implementation doesn't exist yet.

- [ ] **Step 5.5: Implement the migration script**

Create `scripts/migrate-hugo-to-astro.js`:

```javascript
#!/usr/bin/env node
/**
 * Migrates Hugo posts (TOML frontmatter) to Astro content collections (YAML frontmatter).
 *
 * Usage: node scripts/migrate-hugo-to-astro.js
 *
 * Source: content/post/ (Hugo)
 * Destination: src/content/blog/ (Astro)
 */

import fs from "fs";
import path from "path";
import TOML from "@iarna/toml";
import yaml from "js-yaml";

const SOURCE_DIR = path.resolve("content/post");
const DEST_DIR = path.resolve("src/content/blog");

/**
 * Parses a Hugo markdown file with TOML frontmatter.
 * Returns { frontmatter: object, body: string }.
 * Throws if no TOML frontmatter block is found.
 */
export function parseHugoFrontmatter(fileContent) {
  const match = fileContent.match(/^\+\+\+([\s\S]*?)\+\+\+([\s\S]*)$/);
  if (!match) {
    throw new Error("No TOML frontmatter found (expected +++ delimiters)");
  }
  const frontmatter = TOML.parse(match[1]);
  const body = match[2];
  return { frontmatter, body };
}

/**
 * Converts a Hugo frontmatter object to an Astro-compatible object.
 * - Maps images[0] → ogImage
 * - Drops topics field
 * - Normalizes date to ISO string
 */
export function convertFrontmatter(hugo) {
  const astro = {
    title: hugo.title,
    description: hugo.description || "",
    date: new Date(hugo.date).toISOString().slice(0, 10),
    tags: hugo.tags || [],
  };

  if (hugo.draft === true) astro.draft = true;

  if (Array.isArray(hugo.images) && hugo.images.length > 0) {
    astro.ogImage = hugo.images[0];
  }

  // topics, images explicitly dropped
  return astro;
}

/**
 * Converts a single Hugo markdown file to Astro YAML frontmatter format.
 */
function convertFile(content) {
  const { frontmatter, body } = parseHugoFrontmatter(content);
  const astroFrontmatter = convertFrontmatter(frontmatter);
  const yamlStr = yaml.dump(astroFrontmatter, { lineWidth: -1 }).trim();
  return `---\n${yamlStr}\n---\n${body}`;
}

/**
 * Recursively processes all .md files in sourceDir, writing converted
 * output to the matching path under destDir. Non-.md files are copied as-is.
 */
function migrateDirectory(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    process.exit(1);
  }
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const srcPath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      migrateDirectory(srcPath, destPath);
    } else if (entry.name.endsWith(".md")) {
      const content = fs.readFileSync(srcPath, "utf-8");
      let converted;
      try {
        converted = convertFile(content);
      } catch (err) {
        console.warn(`  SKIP ${srcPath}: ${err.message}`);
        continue;
      }
      fs.writeFileSync(destPath, converted, "utf-8");
      console.log(`  OK   ${path.relative(process.cwd(), destPath)}`);
    } else {
      // Copy non-markdown files (images, etc.) as-is
      fs.copyFileSync(srcPath, destPath);
      console.log(`  COPY ${path.relative(process.cwd(), destPath)}`);
    }
  }
}

// Only run migration when called directly (not when imported by tests)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log(`Migrating ${SOURCE_DIR} → ${DEST_DIR}`);
  migrateDirectory(SOURCE_DIR, DEST_DIR);
  console.log("Migration complete.");
}
```

- [ ] **Step 5.6: Run tests — expect pass**

```bash
npm test
```

Expected: all 7 tests pass (2 in `parseHugoFrontmatter`, 5 in `convertFrontmatter`).

- [ ] **Step 5.7: Commit script and tests**

```bash
git add scripts/migrate-hugo-to-astro.js scripts/migrate-hugo-to-astro.test.js package.json
git commit -m "feat: add Hugo-to-Astro migration script with tests"
```

---

### Task 6: Run migration and commit migrated content

**Files:**
- Create: `src/content/blog/` — all migrated post files
- Remove: `content/post/` — Hugo source (moved to Astro)

- [ ] **Step 6.1: Run the migration script**

```bash
node scripts/migrate-hugo-to-astro.js
```

Expected: output lists all migrated files. No SKIP lines should appear (all 59 posts should convert cleanly). If any SKIP lines appear, investigate and fix the offending frontmatter before continuing.

- [ ] **Step 6.2: Spot-check three migrated posts**

```bash
# Pick the first simple post file
find src/content/blog -maxdepth 1 -name "*.md" | head -1 | xargs head -20

# Pick the first page bundle
find src/content/blog -mindepth 2 -name "index.md" | head -1 | xargs head -20

# Verify ogImage mapping (find a post that had `images` in Hugo)
grep -rl "ogImage" src/content/blog/ | head -3
```

Expected:
- TOML `+++` is gone, replaced with YAML `---`
- `topics` field is absent
- Any post with `images = ["hero.png"]` in Hugo now has `ogImage: hero.png` in YAML

- [ ] **Step 6.3: Move static/img to public/img and remove static/**

Hugo's `static/img/` maps to Astro's `public/img/`. Move it and remove the now-unused `static/` directory:

```bash
cp -r static/img public/img
git rm -r static/
```

Expected: `static/` removed from the repo. `public/img/` now contains all static images.

- [ ] **Step 6.4: Verify the Astro build picks up migrated content**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds. May show warnings about content that references files not yet set up — that's OK at this stage. The key is no schema validation errors.

- [ ] **Step 6.5: Remove the Hugo content/post directory**

```bash
git rm -r content/post/
```

- [ ] **Step 6.6: Commit migrated content**

All changes (new `src/content/blog/`, new `public/img/`, removed `static/`, removed `content/post/`) are now staged. Commit them together:

```bash
git add src/content/blog/ public/img/
git commit -m "feat: migrate 59 Hugo posts to Astro content collection"
```

Expected: commit includes additions to `src/content/blog/` and `public/img/`, and removals of `content/post/` and `static/`.

---

## Chunk 3: Visual Design

### Task 7: Apply Warm & Earthy color palette

**Files:**
- Modify: `src/styles/base.css` (or wherever Astro Paper defines CSS variables) — override color tokens
- Modify: `tailwind.config.cjs` — extend theme with custom colors

- [ ] **Step 7.1: Locate Astro Paper's color configuration**

```bash
grep -r "color" src/styles/ --include="*.css" -l
grep -r "skin" src/styles/ --include="*.css" | head -5
```

Astro Paper uses CSS variables (often called "skin") for its color scheme. Identify the file (likely `src/styles/base.css` or `src/styles/typography.css`).

- [ ] **Step 7.2: Override CSS color variables**

In the appropriate CSS file (typically at the `:root` and `.dark` selectors), set:

```css
:root,
html[data-theme="light"] {
  --color-fill: 250, 247, 245;       /* #faf7f5 warm white */
  --color-text-base: 28, 25, 23;     /* #1c1917 warm black */
  --color-accent: 194, 65, 12;       /* #c2410c burnt orange */
  --color-card: 240, 237, 235;
  --color-card-muted: 230, 227, 225;
  --color-border: 214, 211, 208;     /* #d6d3d1 */
}

html[data-theme="dark"] {
  --color-fill: 28, 25, 23;          /* #1c1917 warm black */
  --color-text-base: 250, 247, 245;  /* #faf7f5 warm white */
  --color-accent: 194, 65, 12;       /* #c2410c burnt orange — same in dark */
  --color-card: 41, 37, 36;          /* #292524 */
  --color-card-muted: 68, 64, 60;    /* #44403c */
  --color-border: 87, 83, 78;
}
```

Note: Astro Paper uses RGB triplets (not hex) for its CSS variables because it applies opacity modifiers. Match whatever format the template uses.

- [ ] **Step 7.3: Add Google Fonts**

In `src/layouts/Layout.astro` (or wherever `<head>` is defined by Astro Paper), add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 7.4: Apply fonts via Tailwind config**

In `tailwind.config.cjs`, extend the font families:

```javascript
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // ... existing Astro Paper config ...
  theme: {
    extend: {
      fontFamily: {
        serif: ["Lora", ...defaultTheme.fontFamily.serif],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
```

- [ ] **Step 7.5: Apply serif font to headings in global CSS**

In `src/styles/base.css` (or `typography.css`), add:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: theme("fontFamily.serif");
}
```

- [ ] **Step 7.6: Preview in browser**

```bash
npm run dev
```

Open `http://localhost:4321`. Verify:
- Background is warm white (not pure white)
- Links and accents are burnt orange
- Headings render in Lora serif
- Dark mode toggle works and shows warm black background

- [ ] **Step 7.7: Commit visual design**

```bash
git add src/styles/ tailwind.config.cjs
# Also add the layout file if you modified it for fonts
git commit -m "feat: apply Warm & Earthy color palette and Lora/JetBrains Mono fonts"
```

---

### Task 8: Configure syntax highlighting

**Files:**
- Modify: `astro.config.mjs` — Shiki theme configuration

- [ ] **Step 8.1: Update astro.config.mjs with Shiki themes**

```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://annjose.com",
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dracula",
      },
      wrap: true,
      transformers: [],
    },
  },
});
```

- [ ] **Step 8.2: Add line number CSS**

Shiki outputs line numbers as `<span class="line">` elements when configured. Add the following to `src/styles/base.css` to display them:

```css
/* Shiki line numbers */
code[data-line-numbers] {
  counter-reset: line;
}
code[data-line-numbers] > .line::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 1.5rem;
  margin-right: 1rem;
  text-align: right;
  color: rgb(var(--color-text-base) / 0.3);
  user-select: none;
}
```

Note: Astro's Shiki integration enables line numbers via the `data-line-numbers` attribute on code blocks that have at least one line. If Astro Paper already has code block styling, merge these rules rather than replacing them.

- [ ] **Step 8.3: Verify a post with code renders correctly**

```bash
npm run dev
```

Navigate to a post with a code block (e.g., any technical post). Verify:
- Code block has Dracula colors in dark mode
- Code block has GitHub Light colors in light mode
- No line overflow (wrap: true working)

Note: line numbers are not yet active at this step — they are enabled in Steps 8.4–8.5.

- [ ] **Step 8.4: Install Shiki transformers package**

```bash
npm install --save-dev @shikijs/transformers
```

- [ ] **Step 8.5: Add line number transformer to astro.config.mjs**

```javascript
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { transformerNotationLineNumbers } from "@shikijs/transformers";

export default defineConfig({
  site: "https://annjose.com",
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dracula",
      },
      wrap: true,
      transformers: [transformerNotationLineNumbers()],
    },
  },
});
```

- [ ] **Step 8.6: Verify line numbers render**

```bash
npm run dev
```

Navigate to a technical post with a code block. Verify line numbers appear on the left of each code line.

- [ ] **Step 8.7: Commit**

```bash
git add astro.config.mjs src/styles/base.css package.json package-lock.json
git commit -m "feat: configure Shiki syntax highlighting (dracula/github-light) with line numbers"
```

---

## Chunk 4: Core Layouts

### Task 9: Build BaseLayout.astro

**Files:**
- Modify: `src/layouts/Layout.astro` (Astro Paper's base layout) — add Google Analytics, ensure OG/Twitter meta tags are present
- Note: Astro Paper ships with a layout already. Review it and extend rather than replace.

- [ ] **Step 9.1: Review what Astro Paper's layout already provides**

```bash
cat src/layouts/Layout.astro
```

Astro Paper already handles: `<head>`, dark mode, OG meta tags, Twitter Card meta tags. Identify what's there vs. what needs to be added.

- [ ] **Step 9.2: Add Google Analytics to the layout**

Find the closing `</head>` tag in `src/layouts/Layout.astro` and add the GA snippet before it:

```astro
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2PEL4BVYJE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-2PEL4BVYJE');
</script>
```

- [ ] **Step 9.3: Verify OG and Twitter meta tags are present**

Astro Paper should already generate these from the `ogImage` frontmatter. Check by viewing page source on `http://localhost:4321` and searching for `og:image` and `twitter:card`. If they're missing, add them following Astro Paper's patterns.

- [ ] **Step 9.4: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Google Analytics to BaseLayout"
```

---

### Task 10: Build BlogPostLayout.astro with TOC sidebar

**Files:**
- Modify or create: `src/layouts/PostDetails.astro` (Astro Paper's blog post layout — may already exist) — add TOC sidebar column
- Create: `src/components/TableOfContents.astro` — sticky TOC component

- [ ] **Step 10.1: Inspect Astro Paper's existing post layout**

```bash
cat src/layouts/PostDetails.astro
# or
ls src/layouts/
```

Astro Paper has a post detail layout. Identify its structure before modifying.

- [ ] **Step 10.2: Create TableOfContents.astro**

Create `src/components/TableOfContents.astro`:

```astro
---
/**
 * Table of Contents component.
 * - Desktop: sticky sidebar (rendered via the post layout's right column)
 * - Mobile: inline collapsible <details> dropdown above post content
 * Only renders when the post has 3 or more h2/h3 headings.
 */
export interface Props {
  headings: { depth: number; slug: string; text: string }[];
}

const { headings } = Astro.props;
const filtered = headings.filter(h => h.depth === 2 || h.depth === 3);
---

{filtered.length >= 3 && (
  <>
    {/* Mobile: collapsible dropdown shown below lg breakpoint */}
    <details class="toc-mobile lg:hidden">
      <summary class="toc-mobile-summary">On this page</summary>
      <ol class="toc-list">
        {filtered.map(h => (
          <li class:list={[{ "toc-h3": h.depth === 3 }]}>
            <a href={`#${h.slug}`} class="toc-link" data-heading={h.slug}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </details>

    {/* Desktop: sticky sidebar shown at lg+ breakpoint */}
    <nav id="toc" class="toc-desktop hidden lg:block" aria-label="Table of contents">
      <p class="toc-title">On this page</p>
      <ol class="toc-list">
        {filtered.map(h => (
          <li class:list={[{ "toc-h3": h.depth === 3 }]}>
            <a href={`#${h.slug}`} class="toc-link" data-heading={h.slug}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  </>
)}

<style>
  /* Desktop sticky sidebar */
  .toc-desktop {
    position: sticky;
    top: 5rem;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
  }
  .toc-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
    color: rgb(var(--color-text-base) / 0.5);
  }
  /* Mobile dropdown */
  .toc-mobile {
    margin-bottom: 1.5rem;
    border: 1px solid rgb(var(--color-border));
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
  }
  .toc-mobile-summary {
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    color: rgb(var(--color-accent));
    list-style: none;
  }
  .toc-mobile-summary::after {
    content: " ▾";
  }
  details[open] .toc-mobile-summary::after {
    content: " ▴";
  }
  .toc-mobile .toc-list {
    margin-top: 0.5rem;
  }
  /* Shared list styles */
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .toc-list li {
    margin-bottom: 0.25rem;
  }
  .toc-h3 {
    padding-left: 0.75rem;
  }
  .toc-link {
    font-size: 0.875rem;
    color: rgb(var(--color-text-base) / 0.7);
    text-decoration: none;
    line-height: 1.4;
    display: block;
    padding: 0.125rem 0.5rem;
    border-left: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }
  .toc-link:hover,
  .toc-link.active {
    color: rgb(var(--color-accent));
    border-left-color: rgb(var(--color-accent));
  }
</style>

<script>
  // Highlight active section using IntersectionObserver (desktop sidebar only)
  const links = document.querySelectorAll<HTMLAnchorElement>("#toc .toc-link");
  const headingIds = Array.from(links).map(l => l.dataset.heading!);
  const headingEls = headingIds
    .map(id => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  const observer = new IntersectionObserver(
    entries => {
      const visible = entries.filter(e => e.isIntersecting).map(e => e.target.id);
      if (visible.length === 0) return;
      links.forEach(l => l.classList.remove("active"));
      const activeLink = document.querySelector<HTMLAnchorElement>(
        `#toc .toc-link[data-heading="${visible[0]}"]`
      );
      activeLink?.classList.add("active");
    },
    { rootMargin: "0px 0px -60% 0px", threshold: 0 }
  );

  headingEls.forEach(el => observer.observe(el));
</script>
```

- [ ] **Step 10.3: Add TOC to the post layout**

In `src/layouts/PostDetails.astro`, add the `TableOfContents` component. The mobile dropdown goes above the post body; the desktop sidebar goes in the right grid column.

```astro
---
import TableOfContents from "@components/TableOfContents.astro";
// ... existing imports ...

// Astro provides `headings` as a prop when the layout is used for .md/.mdx content
const { headings } = Astro.props;
---

<!-- Mobile TOC dropdown: rendered inside the article, above body content.
     The component itself hides this at lg+ breakpoint via `lg:hidden`. -->
<TableOfContents headings={headings} />

<!-- Two-column grid wrapping article body + desktop sticky TOC -->
<div class="post-grid">
  <article class="post-content">
    <slot />
  </article>

  <!-- Desktop sticky TOC: the component hides this below lg via `hidden lg:block` -->
  <aside class="toc-sidebar">
    <TableOfContents headings={headings} />
  </aside>
</div>

<style>
  .post-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: start;
  }
  @media (min-width: 1024px) {
    .post-grid {
      grid-template-columns: 65% 25%;
    }
  }
</style>
```

Note: Astro Paper's existing post layout may use a different outer structure. Adapt the slot/grid insertion to fit — the key invariant is that the mobile `<details>` dropdown renders before the article body, and the desktop sidebar is in the right column of a `lg:grid-cols-[65%_25%]` grid.

- [ ] **Step 10.4: Verify TOC renders on a long post**

```bash
npm run dev
```

Navigate to a post with multiple `##` and `###` headings. Verify at **desktop viewport** (≥1024px):
- TOC appears in the right sidebar
- TOC is sticky (stays visible as you scroll)
- Clicking a TOC link scrolls to that heading
- Active section is highlighted as you scroll

Verify at **mobile viewport** (<1024px, use browser DevTools):
- Right sidebar TOC is hidden
- A collapsible "On this page ▾" dropdown appears above the post body
- Clicking the summary expands the heading list
- Clicking a heading link in the dropdown scrolls to the section

Also verify: **tags appear at the top of the post page** (near the title or below the date), each linking to `/tags/[tag]/`. Astro Paper likely includes this already. If not, add a tag list to `PostDetails.astro`:

```astro
<!-- Near the post header, after the date: -->
{post.data.tags.length > 0 && (
  <ul class="post-header-tags">
    {post.data.tags.map(tag => (
      <li><a href={`/tags/${tag}/`}>{getTagLabel(tag)}</a></li>
    ))}
  </ul>
)}
```

- [ ] **Step 10.5: Commit**

```bash
git add src/components/TableOfContents.astro src/layouts/PostDetails.astro
git commit -m "feat: add sticky TOC sidebar to blog post layout"
```

---

## Chunk 5: Blog Components and Pages

### Task 11: Implement PostNav (next/previous post links)

**Files:**
- Create: `src/components/PostNav.astro` — next/previous post navigation
- Modify: `src/layouts/PostDetails.astro` — add PostNav at bottom

- [ ] **Step 11.1: Create PostNav.astro**

Create `src/components/PostNav.astro`:

```astro
---
/**
 * Next/previous post navigation.
 * Receives the adjacent posts sorted by date descending.
 */
export interface Props {
  prev?: { slug: string; data: { title: string } };
  next?: { slug: string; data: { title: string } };
}

const { prev, next } = Astro.props;
---

{(prev || next) && (
  <nav class="post-nav" aria-label="Post navigation">
    <div class="post-nav-inner">
      {prev && (
        <a href={`/post/${prev.slug}/`} class="post-nav-prev" rel="prev">
          <span class="post-nav-label">← Previous</span>
          <span class="post-nav-title">{prev.data.title}</span>
        </a>
      )}
      {next && (
        <a href={`/post/${next.slug}/`} class="post-nav-next" rel="next">
          <span class="post-nav-label">Next →</span>
          <span class="post-nav-title">{next.data.title}</span>
        </a>
      )}
    </div>
  </nav>
)}

<style>
  .post-nav {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgb(var(--color-border));
  }
  .post-nav-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .post-nav-prev,
  .post-nav-next {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-decoration: none;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: rgb(var(--color-card));
    transition: background 0.15s;
  }
  .post-nav-next {
    text-align: right;
    grid-column: 2;
  }
  .post-nav-prev:hover,
  .post-nav-next:hover {
    background: rgb(var(--color-card-muted));
  }
  .post-nav-label {
    font-size: 0.75rem;
    color: rgb(var(--color-accent));
    font-weight: 600;
  }
  .post-nav-title {
    font-size: 0.875rem;
    color: rgb(var(--color-text-base));
    line-height: 1.4;
  }
</style>
```

- [ ] **Step 11.2: Wire PostNav into the post page**

PostNav needs access to sibling posts. This is done in the post page (`src/pages/post/[slug].astro`), not in the layout. The layout receives `prev`/`next` as props.

In `src/pages/post/[slug].astro`, compute prev/next:

```astro
---
import { getCollection } from "astro:content";
import PostNav from "@components/PostNav.astro";

const posts = await getCollection("blog", ({ data }) => !data.draft);
// Sort newest first (same order as listing pages)
const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const currentIndex = sorted.findIndex(p => p.slug === Astro.params.slug);
const prev = sorted[currentIndex + 1]; // older post
const next = sorted[currentIndex - 1]; // newer post
---

<!-- in the template, pass to the layout or render directly -->
<PostNav prev={prev} next={next} />
```

Note: Astro Paper may already have a post page file. Locate it (`src/pages/posts/[slug].astro` or similar) and add this logic. Also ensure the route is `/post/[slug]/` not `/posts/[slug]/` to preserve URLs.

- [ ] **Step 11.3: Verify next/prev links appear**

```bash
npm run dev
```

Navigate to a post that is not the newest or oldest. Verify:
- "← Previous" shows the older post's title
- "Next →" shows the newer post's title
- Clicking navigates correctly

- [ ] **Step 11.4: Commit**

```bash
git add src/components/PostNav.astro src/pages/post/
git commit -m "feat: add next/previous post navigation"
```

---

### Task 12: Implement TagCloud component and tag pages

**Files:**
- Create: `src/data/tagLabels.ts` — slug-to-display-label map
- Create: `src/components/TagCloud.astro` — tag cloud sized by post count
- Modify: `src/pages/tags/index.astro` — tag cloud index page
- Modify: `src/pages/tags/[tag].astro` — posts filtered by tag (may already exist in Astro Paper)

- [ ] **Step 12.1: Write tests for tagLabels lookup**

Create `src/data/tagLabels.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getTagLabel } from "./tagLabels";

describe("getTagLabel", () => {
  it("returns display label for known tags", () => {
    expect(getTagLabel("llm")).toBe("LLM");
    expect(getTagLabel("ai")).toBe("AI");
  });

  it("returns the slug itself for unknown tags (title-cased)", () => {
    expect(getTagLabel("personal-growth")).toBe("personal-growth");
  });

  it("returns label for rag", () => {
    expect(getTagLabel("rag")).toBe("RAG");
  });
});
```

- [ ] **Step 12.2: Run tests — expect failure**

```bash
npm test
```

Expected: fails with "Cannot find module".

- [ ] **Step 12.3: Implement src/data/tagLabels.ts**

```typescript
/**
 * Maps lowercase tag slugs to their display labels.
 * Slugs not in this map display as-is.
 */
export const TAG_LABELS: Record<string, string> = {
  ai: "AI",
  llm: "LLM",
  rag: "RAG",
  ios: "iOS",
  "tech-explorations": "Tech Explorations",
  "personal-growth": "Personal Growth",
  "mobile-tech": "Mobile Tech",
  "web-development": "Web Development",
  "new-beginning": "New Beginning",
  "generative-ai": "Generative AI",
  "machine-learning": "Machine Learning",
  "coding-assistants": "Coding Assistants",
  "modern-web-dev": "Modern Web Dev",
  "how-to": "How To",
  building: "Building",
  career: "Career",
};

/** Returns the display label for a tag slug, or the slug itself if not mapped. */
export function getTagLabel(slug: string): string {
  return TAG_LABELS[slug] ?? slug;
}
```

- [ ] **Step 12.4: Run tests — expect pass**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 12.5: Create TagCloud.astro**

Create `src/components/TagCloud.astro`:

```astro
---
/**
 * Tag cloud where font size reflects post count.
 * Renders all tags as links to their /tags/[tag]/ pages.
 */
export interface Props {
  tagCounts: Record<string, number>;
}

import { getTagLabel } from "@data/tagLabels";

const { tagCounts } = Astro.props;
const entries = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
const counts = entries.map(([, c]) => c);
const max = Math.max(...counts);
const min = Math.min(...counts);

function fontSize(count: number): string {
  if (max === min) return "1rem";
  const scale = (count - min) / (max - min); // 0..1
  const size = 0.8 + scale * 0.8; // 0.8rem..1.6rem
  return `${size.toFixed(2)}rem`;
}
---

<div class="tag-cloud">
  {entries.map(([slug, count]) => (
    <a
      href={`/tags/${slug}/`}
      class="tag-item"
      style={`font-size: ${fontSize(count)}`}
      title={`${count} post${count !== 1 ? "s" : ""}`}
    >
      {getTagLabel(slug)}
    </a>
  ))}
</div>

<style>
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: baseline;
  }
  .tag-item {
    color: rgb(var(--color-accent));
    text-decoration: none;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    background: rgb(var(--color-card));
    border: 1px solid rgb(var(--color-border));
    line-height: 1.4;
    transition: background 0.15s;
  }
  .tag-item:hover {
    background: rgb(var(--color-card-muted));
  }
</style>
```

- [ ] **Step 12.6: Update the tags index page**

Locate or create `src/pages/tags/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import Layout from "@layouts/Layout.astro";
import TagCloud from "@components/TagCloud.astro";

const posts = await getCollection("blog", ({ data }) => !data.draft);

// Count posts per tag
const tagCounts: Record<string, number> = {};
for (const post of posts) {
  for (const tag of post.data.tags) {
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  }
}
---

<Layout title="Tags | Reflections" description="Browse posts by tag">
  <main>
    <h1>All Tags</h1>
    <TagCloud tagCounts={tagCounts} />
  </main>
</Layout>
```

- [ ] **Step 12.7: Verify the tags index page**

```bash
npm run dev
```

Navigate to `http://localhost:4321/tags/`. Verify:
- All tags appear as a cloud
- Tags with more posts render larger
- Display labels are correct (LLM not llm, AI not ai)
- Clicking a tag navigates to `/tags/[tag]/`

Check that `/tags/llm/` shows posts tagged with `llm`.

- [ ] **Step 12.8: Commit**

```bash
git add src/data/tagLabels.ts src/data/tagLabels.test.ts src/components/TagCloud.astro src/pages/tags/
git commit -m "feat: add tag cloud with display label mapping and tag index page"
```

---

### Task 13: Build the homepage

**Files:**
- Modify: `src/pages/index.astro` — homepage with post list

Astro Paper ships with a homepage. Review what it generates and verify it works with migrated content. The key requirements:
- Lists posts in reverse chronological order (10 per page)
- Each post shows: title, date, description, tags
- Tag cloud visible (in sidebar on desktop, below list on mobile)

- [ ] **Step 13.1: Review Astro Paper's existing index.astro and PostCard**

```bash
cat src/pages/index.astro
# Find the post card component
grep -r "PostCard\|post-card\|article" src/components/ --include="*.astro" -l
```

Astro Paper ships with a post card component. Verify it renders: **title**, **date**, **description**, and **tags**. If any of these are missing, add them.

For example, if the card lacks tags, find the card component and add:

```astro
<!-- In the post card component, after description: -->
{post.data.tags.length > 0 && (
  <ul class="post-tags">
    {post.data.tags.map(tag => (
      <li><a href={`/tags/${tag}/`}>{getTagLabel(tag)}</a></li>
    ))}
  </ul>
)}
```

- [ ] **Step 13.2: Ensure post URLs use /post/[slug]/ pattern**

Check what URL pattern Astro Paper uses for posts. If it generates `/posts/[slug]/` but we need `/post/[slug]/`, update the page route structure:

- Rename `src/pages/posts/` to `src/pages/post/` if needed
- Update all `href` references in components from `/posts/` to `/post/`

```bash
grep -r '"/posts/' src/ --include="*.astro"
grep -r "'/posts/" src/ --include="*.astro"
```

Replace all occurrences with `/post/`.

- [ ] **Step 13.3: Add tag cloud sidebar to homepage**

The spec requires the tag cloud in a right sidebar on desktop, below the post list on mobile. In `src/pages/index.astro`, wrap the existing post list in a two-column layout and add the `TagCloud` in the sidebar:

```astro
---
// ... existing imports and getCollection call ...
import TagCloud from "@components/TagCloud.astro";

// Compute tag counts from all published posts
const tagCounts: Record<string, number> = {};
for (const post of posts) {
  for (const tag of post.data.tags) {
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  }
}
---

<!-- Wrap existing post list content in a grid -->
<div class="home-grid">
  <main class="home-posts">
    <!-- existing post list here (Astro Paper's PostCard loop) -->
  </main>

  <aside class="home-sidebar">
    <section>
      <h2 class="sidebar-heading">Browse by tag</h2>
      <TagCloud tagCounts={tagCounts} />
    </section>
  </aside>
</div>

<style>
  .home-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  /* On desktop: posts take ~65%, sidebar ~30% */
  @media (min-width: 1024px) {
    .home-grid {
      grid-template-columns: 65% 1fr;
    }
  }
  .sidebar-heading {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--color-text-base) / 0.5);
    margin-bottom: 0.75rem;
  }
  /* On mobile: sidebar renders below main content (natural DOM order) */
</style>
```

Note: On mobile the sidebar naturally falls below the post list due to `grid-template-columns: 1fr` (single column). No extra ordering CSS is needed.

- [ ] **Step 13.4: Verify homepage shows all posts**

```bash
npm run dev
```

Check `http://localhost:4321/`:
- Posts list in reverse date order
- Pagination works (if more than 10 posts)
- Tag cloud visible
- Click a post card → navigates to `/post/[slug]/`
- Dark mode toggle works

- [ ] **Step 13.5: Commit**

```bash
# Include src/components/ in case the PostCard was modified in Step 13.1
git add src/pages/index.astro src/pages/post/ src/components/
git commit -m "feat: configure homepage with post list and tag cloud sidebar"
```

---

## Chunk 6: About Page

### Task 14: Build the About page

**Files:**
- Create: `src/content/pages/about.md` — About page content
- Create: `src/pages/about.astro` — About page route

- [ ] **Step 14.1: Create about.md**

Create `src/content/pages/about.md`:

```markdown
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
currently: Exploring the intersection of AI tools and software engineering workflows, and writing about what I learn along the way.
social:
  bluesky: annjose.com
  linkedin: annjose
  github: annjose
---

I'm Ann, a software engineer who loves building things and writing about the experience. I've spent my career working across mobile, web, and AI — always drawn to whatever is new and interesting at the edge of what's possible.

This blog, "Reflections," is where I think out loud — about technology, about learning, and about the surprises that come from doing both for a long time.
```

The photo path `/img/ann-profile.jpg` must resolve to a real file. Before continuing, confirm the file exists:

```bash
ls public/img/ann-profile.jpg
```

If it does not exist, either:
- Copy the profile photo to `public/img/ann-profile.jpg`, or
- Temporarily set `photo: ""` in about.md to skip the image (the `about.astro` page conditionally renders it only when `photo` is truthy)

- [ ] **Step 14.2: Create about.astro page**

Create `src/pages/about.astro`:

```astro
---
import { getEntry } from "astro:content";
import Layout from "@layouts/Layout.astro";

const about = await getEntry("pages", "about");
if (!about) throw new Error("about.md not found in pages collection");

const { Content } = await about.render();
const { name, tagline, photo, interests, currently, social } = about.data;
---

<Layout title={`About ${name} | Reflections`} description={tagline}>
  <main class="about-page">
    <!-- Header: photo + name + tagline -->
    <header class="about-header">
      {photo && (
        <img src={photo} alt={name} class="about-photo" width="96" height="96" />
      )}
      <div>
        <h1>{name}</h1>
        <p class="about-tagline">{tagline}</p>
      </div>
    </header>

    <!-- Bio prose -->
    <section class="about-section">
      <div class="about-prose">
        <Content />
      </div>
    </section>

    <!-- What I work on -->
    <section class="about-section">
      <h2 class="about-section-title">What I work on</h2>
      <div class="about-interests">
        {interests.map(interest => (
          <span class="interest-tag">{interest}</span>
        ))}
      </div>
    </section>

    <!-- Currently -->
    <section class="about-section">
      <h2 class="about-section-title">Currently</h2>
      <p>{currently}</p>
    </section>

    <!-- Social links -->
    <section class="about-section about-social">
      {social.bluesky && (
        <a href={`https://bsky.app/profile/${social.bluesky}`} rel="noopener">
          Bluesky
        </a>
      )}
      {social.linkedin && (
        <a href={`https://linkedin.com/in/${social.linkedin}`} rel="noopener">
          LinkedIn
        </a>
      )}
      {social.github && (
        <a href={`https://github.com/${social.github}`} rel="noopener">
          GitHub
        </a>
      )}
    </section>
  </main>
</Layout>

<style>
  .about-page {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  .about-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .about-photo {
    border-radius: 50%;
    width: 96px;
    height: 96px;
    object-fit: cover;
  }
  .about-tagline {
    color: rgb(var(--color-text-base) / 0.7);
    margin-top: 0.25rem;
  }
  .about-section {
    border-left: 3px solid rgb(var(--color-accent));
    padding-left: 1rem;
    margin-bottom: 2rem;
  }
  .about-section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--color-accent));
    margin-bottom: 0.75rem;
  }
  .about-interests {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .interest-tag {
    background: rgb(var(--color-card));
    border: 1px solid rgb(var(--color-border));
    color: rgb(var(--color-accent));
    padding: 0.25rem 0.625rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  .about-social {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    border-left: none;
    padding-left: 0;
  }
  .about-social a {
    color: rgb(var(--color-accent));
    text-decoration: none;
    font-weight: 500;
  }
  .about-social a:hover {
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 14.3: Verify About page renders**

```bash
npm run dev
```

Navigate to `http://localhost:4321/about/`. Verify:
- Photo, name, and tagline display correctly
- Prose bio renders (markdown → HTML)
- Interest tags show with burnt orange accent
- "Currently" section appears with left border
- Social links are clickable

- [ ] **Step 14.4: Add About to navigation**

Astro Paper stores navigation links in `src/config.ts` as a `NAVLINKS` array (or similar — check what the scaffold generated). Add the About entry:

```typescript
// In src/config.ts, find the nav links array (may be called NAVLINKS, NAV, or similar)
export const NAVLINKS = [
  { href: "/posts/", title: "Blog" },     // adjust path to match your actual posts route
  { href: "/tags/", title: "Tags" },
  { href: "/about/", title: "About" },
];
```

If Astro Paper defines navigation directly in a layout component instead of `config.ts`, locate it with:

```bash
grep -r '"/about"' src/ --include="*.astro"
grep -r "About" src/components/ --include="*.astro" | head -5
```

Then add the About link at the appropriate place in the nav markup.

- [ ] **Step 14.5: Commit**

```bash
git add src/content/pages/about.md src/pages/about.astro src/config.ts
git commit -m "feat: add About page with sectioned profile layout and nav link"
```

---

## Chunk 7: Deployment

### Task 15: Finalize build configuration and remove Hugo deployment artifacts

**Files:**
- Modify: `.gitmodules` — remove empty submodule config
- Modify: `docs/deploy.md` — update for Cloudflare Pages

- [ ] **Step 15.1: Clean up .gitmodules**

The `public/` submodule was removed in Task 1. Verify `.gitmodules` is now empty or removed:

```bash
cat .gitmodules
```

If it still contains a `[submodule "public"]` entry, remove it:

```bash
git rm .gitmodules
```

Or edit the file to be empty and commit.

- [ ] **Step 15.2: Run a full production build**

```bash
npm run build
```

Expected: `dist/` directory created, all pages generated, 0 errors, 0 Zod validation errors. Note any warnings — investigate any that relate to missing images or broken links.

- [ ] **Step 15.3: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4321`. Click through:
- Homepage: post list, tag cloud, dark mode toggle
- A technical post: syntax highlighting, TOC sidebar, next/prev links
- Tags index: tag cloud
- A tag page: filtered post list
- About page: all sections
- Verify all internal links work (no 404s)

- [ ] **Step 15.4: Update docs/deploy.md**

Replace the Hugo-based deployment instructions with Cloudflare Pages instructions. Use 4-backtick outer fence to avoid collision with inner code blocks:

````markdown
# Deployment

## Cloudflare Pages (production)

The site deploys automatically via Cloudflare Pages on every push to `master`.

**Build settings (configured in Cloudflare Pages dashboard):**
- Build command: `npm run build`
- Build output directory: `dist/`
- Node.js version: 20
- Environment variable: `ASTRO_TELEMETRY_DISABLED=1`

**To trigger a deploy:** Push to `master`.

**Preview deploys:** Every branch/PR gets a preview URL automatically from Cloudflare Pages.

## DNS Setup (one-time)

1. Log into Cloudflare dashboard → Pages → Connect GitHub repo
2. Use the build settings above
3. After first successful deploy, the site is live at `<project>.pages.dev`
4. Go to Custom Domains → add `annjose.com` and `www.annjose.com`
5. Update nameservers at your domain registrar to Cloudflare's NS records
   (this is a registrar-level change, not just a Cloudflare dashboard step)
6. Cloudflare automatically provisions TLS — no manual cert management

## Local development

```bash
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm test           # Run unit tests
```
````

- [ ] **Step 15.5: Commit final state**

If Step 15.1 removed `.gitmodules` via `git rm`, that deletion is already staged. Include it along with the updated deploy docs:

```bash
git add docs/deploy.md
# git rm output from Step 15.1 is already staged; this commit captures both
git commit -m "docs: update deploy docs for Cloudflare Pages; remove .gitmodules"
```

---

### Task 16: Connect to Cloudflare Pages

This task is performed in the Cloudflare dashboard (not in code). Steps are for the human operator.

- [ ] **Step 16.1: Push the current branch to GitHub**

```bash
git push origin master
```

- [ ] **Step 16.2: Connect repo to Cloudflare Pages**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git
2. Select the `annblog` GitHub repo
3. Configure build:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist/`
   - Environment variable: `NODE_VERSION` = `20`
4. Click "Save and Deploy"

Expected: Cloudflare runs the first build. Monitor the build log. Build should succeed and the site goes live at `<project-name>.pages.dev`.

- [ ] **Step 16.3: Smoke-test the pages.dev deployment**

Open the `*.pages.dev` URL. Verify:
- Homepage loads with correct content
- A blog post renders with syntax highlighting and TOC
- Dark mode toggle works
- About page renders correctly
- No console errors

- [ ] **Step 16.4: Add custom domain**

In Cloudflare Pages dashboard → Custom Domains:
1. Add `annjose.com`
2. Add `www.annjose.com`
3. Follow Cloudflare's DNS setup instructions (update nameservers at your registrar if not already on Cloudflare)

Expected: after DNS propagation (minutes to hours), `https://annjose.com` serves the Astro site with Cloudflare TLS.

- [ ] **Step 16.5: Verify production domain**

Open `https://annjose.com`. Verify:
- HTTPS works (padlock in browser)
- All pages load correctly
- Google Analytics is firing (check Realtime in GA dashboard)

---

## Completion Checklist

Before declaring Phase 1 complete, verify:

- [ ] All 59 posts are accessible at their original `/post/[slug]/` URLs
- [ ] Tags appear at the top of individual post pages, each linking to `/tags/[tag]/`
- [ ] Syntax highlighting works in both light and dark mode
- [ ] TOC appears on posts with 3+ headings and highlights active section
- [ ] Tag cloud on `/tags/` shows all tags with correct sizes and display labels
- [ ] Each tag page (`/tags/[tag]/`) lists correct posts
- [ ] Next/prev links appear on all non-boundary posts
- [ ] OG images / Twitter Card meta tags are present (check with [opengraph.xyz](https://www.opengraph.xyz) or similar)
- [ ] About page at `/about/` renders all sections correctly
- [ ] Light/dark mode toggle works sitewide
- [ ] Google Analytics is active (verify in GA Realtime)
- [ ] Production site at `https://annjose.com` is live on Cloudflare Pages
- [ ] Unit tests pass: `npm test`
- [ ] Production build has 0 errors: `npm run build`
