# Content Style Guide

## Front Matter Format

- Use YAML front matter (`---`).
- Keep key order consistent for readability.

Recommended order:

1. `title`
2. `description`
3. `pubDatetime`
4. `draft`
5. `tags`
6. `author` (optional)
7. `ogImage` (optional)
8. `modDatetime` (optional)

## Required Fields for New Posts

- `title`
- `pubDatetime`
- `description`
- `draft`
- `tags`

## Taxonomy Formatting

- Use lowercase, hyphenated values in `tags`.
- Avoid mixed variants for the same concept.
- Keep display formatting concerns (for example `LLM`, `AI`) in tag labels (`src/utils/tagLabels.ts`), not in front matter taxonomy values.

Examples:

- Good: `llm`, `next-js`, `web-development`
- Avoid: `LLM`, `next.js`, `WebDevelopment`

## Post Structure

- Prefer page bundles for new posts:
  - `src/content/blog/<slug>/index.md`
  - Keep images/media in the same bundle folder.
- Single-file posts: `src/content/blog/<name>.md`
- Use descriptive file names for images.

## OG Images

- OG images are auto-generated dynamically (see `src/pages/blog/[...slug]/index.png.ts`).
- To override, set `ogImage` in front matter.

## Writing and Markdown Conventions

- Use concise headings and clear section hierarchy.
- Use fenced code blocks with language identifiers.
- Prefer relative links for internal content references.
- Use meaningful image alt text.

## Rendering Fixture Posts

- `src/content/blog/content-demo-post.md` uses slug `/blog/content-sample` and exercises headings, tables, code blocks, callouts, images, math, and frontmatter handling.
- `src/content/blog/math-latex-test/index.md` stress-tests complex MathJax/LaTeX rendering.
- Keep both fixture posts as `draft: true`.
- Use `pnpm run dev` to inspect draft fixture posts locally; they should remain excluded from production builds.

## Drafts and Publishing

- Set `draft: true` while editing.
- Set `draft: false` only after final review and checks.
- Run `pnpm test` before publishing.

## Backward Compatibility

- Keep historical content mostly intact.
- Prefer metadata/taxonomy consistency updates over broad prose rewrites unless explicitly requested.
