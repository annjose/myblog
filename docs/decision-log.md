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

