# Taxonomy Conventions

## Goals
- Keep archive pages coherent.
- Avoid duplicate buckets caused by casing or punctuation differences.

## Canonical Rules
- Use lowercase taxonomy values.
- Use hyphens (`-`) as separators.
- Avoid dots and spaces where a slug exists.
- Reuse existing canonical values when possible.
- Keep canonical slugs in front matter and URLs; apply readability formatting in templates instead of mixed-case taxonomy values.

## Current Known Normalization Targets
- `LLM` -> `llm`
- `next.js` -> `next-js`
- `AI` -> `ai`
- `RAG` -> `rag`

UI display labels (template-level) for readability:
- `llm` renders as `LLM`
- `ai` renders as `AI`
- `rag` renders as `RAG`

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
- `tech-explorations`
- `web-development`
- `mobile-tech`
- `personal-growth`
- `how-to`
- `coding-assistants`
- `privacy`

## Change Log Template
Use this section to track taxonomy migrations:
- Date:
- Changed:
- Reason:
- Impacted posts:

## Change Log
- Date: `2026-02-15`
- Changed: canonicalized uppercase/mixed-case taxonomy values to lowercase (`LLM` -> `llm`, `AI` -> `ai`, `RAG` -> `rag`) and aligned menu/tag URL references.
- Reason: avoid split archives and broken case-sensitive URLs while preserving readable acronym labels in UI.
- Impacted posts: all posts containing uppercase/mixed-case `tags` or `topics` values.
