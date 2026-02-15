# Taxonomy Conventions

## Goals
- Keep archive pages coherent.
- Avoid duplicate buckets caused by casing or punctuation differences.

## Canonical Rules
- Use lowercase taxonomy values.
- Use hyphens (`-`) as separators.
- Avoid dots and spaces where a slug exists.
- Reuse existing canonical values when possible.

## Current Known Normalization Targets
- `LLM` -> `llm`
- `next.js` -> `next-js`
- `AI` -> `ai` (if you decide to enforce full lowercase canonically)

Note:
- This repo currently contains both uppercase and lowercase variants for some tags.
- Decide one canonical standard and migrate incrementally.

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

