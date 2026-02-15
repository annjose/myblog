# Decision Log

Use this file to keep short architecture/process decisions so agents and humans do not re-litigate the same topics repeatedly.

## Entry Template
- Date: `YYYY-MM-DD`
- Decision:
- Context:
- Options considered:
- Chosen approach:
- Consequences:
- Follow-ups:

## Initial Entries

- Date: `2026-02-15`
- Decision: Use `AGENTS.md` as single source of truth for multi-agent collaboration.
- Context: Repo will be managed using Claude Code, Codex, and Gemini.
- Options considered: separate independent instruction files vs one shared contract.
- Chosen approach: one primary `AGENTS.md`, thin tool-specific wrappers.
- Consequences: less instruction drift, easier maintenance.
- Follow-ups: keep docs and scripts aligned with `AGENTS.md`.

- Date: `2026-02-15`
- Decision: Canonicalize taxonomy values to lowercase slugs and handle acronym readability in templates.
- Context: Mixed-case taxonomy values (`LLM`, `AI`, `RAG`) produced split archives and case-sensitive URL breakage.
- Options considered: keep mixed-case taxonomy values vs lowercase-only canonical slugs with UI label mapping.
- Chosen approach: lowercase-only values in front matter/URLs (`llm`, `ai`, `rag`) plus template label mapping (`llm` -> `LLM`, `ai` -> `AI`, `rag` -> `RAG`).
- Consequences: stable canonical archive URLs and merged taxonomy buckets without sacrificing UI readability.
- Follow-ups: complete Phase 2 content normalization and verify legacy uppercase links where needed.

- Date: `2026-02-15`
- Decision: Treat `resources/_gen/` as generated-only and stop tracking it in git.
- Context: `resources/_gen/` introduced large, noisy diffs for content changes and was not part of source-of-truth content/config/theme logic.
- Options considered: keep `resources/_gen/` committed for deterministic artifacts vs ignore and regenerate locally.
- Chosen approach: add `resources/_gen/` to `.gitignore` and remove tracked `_gen` files from git index.
- Consequences: cleaner diffs and lower repo churn; requires regeneration during local builds.
- Follow-ups: verify fresh checkout build and deploy workflow remain stable.

- Date: `2026-02-15`
- Decision: Keep inactive themes (`redlounge`, `hurock`) for now and document active `blackburn` overrides explicitly.
- Context: Phase 4 required auditing non-active themes and reducing maintenance ambiguity without risking template regressions.
- Options considered: remove inactive themes immediately vs keep them and document a clear retention rationale.
- Chosen approach: keep inactive themes for now; add `docs/theme-overrides.md` as source-of-truth for active customizations and audit result.
- Consequences: lower immediate risk and clearer maintenance ownership; inactive theme cleanup remains an optional future repo-hygiene task.
- Follow-ups: if strict repo minimization is needed later, remove inactive themes in a dedicated, tested cleanup change.
