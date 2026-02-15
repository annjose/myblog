# Maintenance Baseline

Date captured: `2026-02-15`

## Environment Snapshot
- Hugo: `v0.155.0+extended+withdeploy`
- Active theme: `blackburn` (from `config.toml`)
- Deploy script: `deploy.sh`

## Source Snapshot
- Primary source of truth:
  - `content/`
  - `config.toml`
  - `themes/blackburn` active overrides
- Generated artifacts:
  - `public/`
  - `resources/_gen/`

## Baseline Build Output (`hugo`)
```text
Pages: 170
Paginator pages: 5
Non-page files: 79
Static files: 16
Processed images: 110
Aliases: 1
Cleaned: 0
```

Build result: successful (no fatal errors).

## Baseline Content Summary (`./scripts/check-content.sh`)
- Post markdown files: `58`
- Bundle posts (`index.md`): `28`
- Legacy single-file posts: `30`
- Draft files: `5`
- Unique tags: `35`
- Unique topics: `17`

Taxonomy collision warnings:
- Tags:
  - canonical `next-js` has variants: `next-js`, `next.js`
  - canonical `llm` has variants: `LLM`, `llm`
- Topics: none detected

## Current Deploy Flow
1. Run `hugo`.
2. Enter `public/` submodule.
3. `git add -A`.
4. `git commit -m "<message>"`.
5. `git push origin master`.

## Publish Validation Checklist
Use this after build and before/after deploy verification.

1. Home page renders and pagination links work.
2. Latest posts list is correct and includes expected recent updates.
3. Tag archive pages load and show expected post groupings.
4. Topic archive pages load and show expected post groupings.
5. About page renders correctly.
6. RSS feed is generated and accessible.
7. `CNAME` is present in generated output (`public/CNAME`).
8. No unintended drafts are published.
