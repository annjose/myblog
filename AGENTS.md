# AGENTS.md

This file is the source of truth for AI coding agents working in this repo.

## Project Overview
- Project: personal blog source for `https://annjose.com`
- Engine: Hugo static site generator
- Active theme: `blackburn`
- Content model:
- Legacy posts as single files: `content/post/*.md`
- Newer posts as page bundles: `content/post/<slug>/index.md` (+ colocated images)
- Deploy model: Hugo generates into `public/`, then `public/` (a git submodule) is pushed to site repo.

## Repo Structure
- `config.toml`: site config, menu, taxonomies, analytics, theme selection
- `content/`: all authored content
- `static/`: static assets copied as-is to output
- `themes/blackburn/`: active theme and custom template overrides
- `public/`: generated site output (submodule, deploy target)
- `resources/_gen/`: Hugo-generated processed assets
- `deploy.sh`: deploy helper script
- `docs/`: operational documentation and conventions
- `scripts/`: utility scripts and quality checks
- Detailed structure reference: `docs/repo-structure.md`

## Source of Truth Rules
- Treat `content/`, `config.toml`, and active theme overrides as primary source.
- Treat `public/` and `resources/_gen/` as generated artifacts.
- Do not hand-edit generated files unless explicitly requested.

## Agent Behavior Expectations
- Make focused, minimal changes.
- Preserve current publishing behavior unless asked to change it.
- Do not commit or push code changes in the repo.
- Do not run destructive git commands (no `reset --hard`, no forced checkout/revert).
- Do not remove themes/assets unless dependency is verified and requested.
- If unsure about taxonomy or naming conventions, follow `docs/taxonomy-conventions.md`.
- Start with this file as the single source of truth for project context and editing constraints.
- If ad hoc prompts conflict with repo conventions, prefer repo conventions unless explicitly overridden by the user.
- Use `docs/runbook.md` for workflow steps and `docs/taxonomy-conventions.md` for taxonomy decisions.
- Verify changes with `./scripts/check-content.sh` and summarize what changed and why.

## Commands
- Local build:
```bash
hugo
```
- Local server:
```bash
hugo server -D
```
- Deploy (current workflow):
```bash
./deploy.sh
```
- Repo checks:
```bash
./scripts/check-content.sh
```

## Content Conventions
- Front matter format: TOML (`+++`)
- Required front matter keys for new posts:
- `title`
- `date`
- `draft`
- `tags` (array)
- `topics` (array; can be empty)
- Recommended:
- `description`
- `images` (for social/preview cards on bundle posts)
- Use page bundles for image-heavy/new posts.

## Taxonomy Conventions
- Canonical taxonomy values should be lowercase, hyphenated slugs.
- Avoid variants that split archives (example: `next-js` vs `next.js`, `LLM` vs `llm`).
- See `docs/taxonomy-conventions.md` for rules and migration map.

## Definition of Done (Typical Change)
1. Relevant docs/content/code updated.
2. `./scripts/check-content.sh` passes.
3. Hugo build succeeds.
4. Change impact is summarized clearly (what changed and why).

## Common Workflows
- New post: follow `docs/runbook.md` section "Create a New Post".
- Taxonomy cleanup: follow `docs/runbook.md` + `docs/taxonomy-conventions.md`.
- Deploy: follow `docs/deploy.md`.
