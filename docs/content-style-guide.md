# Content Style Guide

## Front Matter Format
- Use TOML front matter (`+++`).
- Keep key order consistent for readability.

Recommended order:
1. `title`
2. `description` (optional but recommended)
3. `date`
4. `draft`
5. `tags`
6. `topics`
7. `images` (optional, especially for page bundles)

## Required Fields for New Posts
- `title`
- `date`
- `draft`
- `tags`
- `topics`

## Taxonomy Formatting
- Use lowercase, hyphenated values in `tags` and `topics`.
- Avoid mixed variants for the same concept.

Examples:
- Good: `llm`, `next-js`, `web-development`
- Avoid: `LLM`, `next.js`, `WebDevelopment`

## Post Structure
- Prefer page bundles for new posts:
- `content/post/<slug>/index.md`
- Keep images/media in the same bundle folder.
- Use descriptive file names for images.

## Writing and Markdown Conventions
- Use concise headings and clear section hierarchy.
- Use fenced code blocks with language identifiers.
- Prefer relative links for internal content references.
- Use meaningful image alt text.

## Drafts and Publishing
- Set `draft = true` while editing.
- Set `draft = false` only after final review and checks.
- Run `./scripts/check-content.sh` before publishing.

## Backward Compatibility
- Keep historical content mostly intact.
- Prefer metadata/taxonomy consistency updates over broad prose rewrites unless explicitly requested.

