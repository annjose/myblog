# AGENTS.md

This file is the source of truth for AI coding agents working in this repo.

## Project Overview
- Project: personal blog source for `https://annjose.com`
- Engine: Astro 5 static site generator
- Styling: Tailwind CSS (AstroPaper-based theme)
- Hosting: Cloudflare Pages (auto-deploys on push)
- Content model:
  - Blog posts as page bundles: `src/content/blog/<slug>/index.md` (+ colocated images)
  - Blog posts as single files: `src/content/blog/<name>.md`
  - Content sample post at `/blog/content-sample` exercises all formatting features

## Source of Truth
- Primary source: `src/content/`, `src/pages/`, `src/components/`, `src/layouts/`
- Configuration: `astro.config.ts`, `src/config.ts`
- Generated artifacts: `dist/`, `node_modules/` — do not hand-edit

## Agent Behavior Expectations
- Make focused, minimal changes.
- Preserve current publishing behavior unless asked to change it.
- Do not commit or push code changes in the repo.
- Do not run destructive git commands (no `reset --hard`, no forced checkout/revert).
- If unsure about taxonomy or naming conventions, follow `docs/taxonomy-conventions.md`.
- Start with this file as the single source of truth for project context and editing constraints.
- If ad hoc prompts conflict with repo conventions, prefer repo conventions unless explicitly overridden by the user.
- Verify changes with `pnpm test` and `pnpm run build`, then summarize what changed and why.

## Commands
- Install dependencies:
```bash
pnpm install
```
- Local dev server:
```bash
pnpm run dev
```
- Production build:
```bash
pnpm run build
```
- Run tests:
```bash
pnpm test
```
- Full check (test + build):
```bash
pnpm run check
```

## Content Conventions
- Front matter format: YAML (`---`)
- Required front matter keys for new posts:
  - `title`
  - `pubDatetime`
  - `description`
  - `draft`
  - `tags` (array)
- Optional:
  - `modDatetime`
  - `ogImage`
  - `author`
  - `canonicalURL`
- Use page bundles (`<slug>/index.md`) for posts with colocated images.
- See `docs/content-style-guide.md` for full conventions.

## Taxonomy Conventions
- Canonical taxonomy values should be lowercase, hyphenated slugs.
- Avoid variants that split archives (example: `next-js` vs `next.js`, `LLM` vs `llm`).
- See `docs/taxonomy-conventions.md` for rules and canonical registry.

## Definition of Done (Typical Change)
1. Relevant content/code updated.
2. `pnpm test` passes.
3. `pnpm run build` succeeds.
4. Change impact is summarized clearly (what changed and why).
