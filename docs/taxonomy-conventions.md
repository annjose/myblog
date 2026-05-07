# Taxonomy Conventions

## Goals

- Keep archive pages coherent.
- Avoid duplicate buckets caused by casing or punctuation differences.

## Canonical Rules

- Use lowercase tag values.
- Use hyphens (`-`) as separators.
- Avoid dots and spaces where a slug exists.
- Reuse existing canonical values when possible.
- Keep canonical slugs in front matter and URLs; apply readability formatting via tag labels (`src/utils/tagLabels.ts`) instead of mixed-case values.

## Current Known Normalization Targets

- `LLM` -> `llm`
- `next.js` -> `next-js`
- `AI` -> `ai`
- `RAG` -> `rag`
- `web-development` -> `web`
- `mobile-tech` -> `mobile`
- `mobile-development` -> `mobile`
- `coding-assistants` -> `agentic-coding`
- `agentic-systems` -> `agentic-coding`

UI display labels (template-level) for readability:

- `llm` renders as `LLM`
- `ai` renders as `AI`
- `rag` renders as `RAG`
- `agentic-coding` renders as `Agentic Coding`

## Migration Workflow

1. Identify variants from content front matter.
2. Define variant-to-canonical mapping.
3. Update posts in small batches.
4. Rebuild and verify taxonomy archive pages.
5. Record mapping changes in this file.

## Canonical Tag Registry (Working Set)

Start with current major concepts and normalize over time:

- `ai`
- `llm`
- `agentic-coding`
- `machine-learning`
- `web`
- `mobile`
- `ios`
- `browser-extensions`
- `cloudflare`
- `rag`
- `personal-growth`
- `career`
- `new-beginning`
- `how-to`
- `conferences`
- `hugo`
- `next-js`
- `chatgpt`
- `thinking-loud`
- `building`
- `privacy`

## Change Log Template

Use this section to track taxonomy migrations:

- Date:
- Changed:
- Reason:
- Impacted posts:

## Change Log

- Date: `2026-05-07`
- Changed: removed broad/low-signal tags (`tech-explorations`, `technology`), folded mobile/web variants into `mobile` and `web`, folded agent coding variants into `agentic-coding`, folded `generative-ai` into `ai`, and removed one-off implementation/tool tags including `fastlane`, `realm`, `swift`, `unit-testing`, `visual-studio-code`, `ghc-2018`, `gpt`, and `health`.
- Reason: reduce overlapping archive pages and keep tags focused on durable reader navigation.
- Impacted posts: all published posts containing migrated tags.

- Date: `2026-02-15`
- Changed: canonicalized uppercase/mixed-case taxonomy values to lowercase (`LLM` -> `llm`, `AI` -> `ai`, `RAG` -> `rag`) and aligned menu/tag URL references.
- Reason: avoid split archives and broken case-sensitive URLs while preserving readable acronym labels in UI.
- Impacted posts: all posts containing uppercase/mixed-case `tags` values.
