# Blog Repo Improvement Plan (Phased)

## Goal
Improve maintainability, publishing safety, taxonomy consistency, and content quality of this Hugo blog repo without disrupting current publishing behavior.

## Scope
- In scope: deploy script hardening, taxonomy/tag normalization, repo hygiene, theme cleanup decisions, basic quality checks, lightweight automation.
- Out of scope (for now): full theme redesign, content rewrites for all historical posts, major platform migration.

## Guiding Principles
- Preserve current publishing flow while reducing risk.
- Make incremental, reversible changes.
- Validate each phase before moving to the next.
- Prefer automation for recurring tasks.

## Decision Lock-Ins (2026-02-15)
- Taxonomy normalization: enforce lowercase canonical values for tags/topics; replace uppercase and mixed-case variants with lowercase slugs.
- Generated assets policy: treat `resources/_gen/` as generated output and do not commit it going forward.
- Taxonomy display strategy: keep lowercase taxonomy slugs in front matter/URLs, but render selected acronym labels (for example `llm` -> `LLM`, `ai` -> `AI`) in UI templates.

---

## Phase 0: Baseline and Safety Net

### What
- Capture a baseline of current behavior and content structure.
- Document current deploy flow and expected outputs.

### Why
- Baselines prevent accidental regressions and make rollback easier.

### How
1. Record current local build output summary:
   - Post counts, draft counts, tag/topic counts, build warnings.
2. Snapshot key config and scripts:
   - `config.toml`, `deploy.sh`, custom theme overrides.
3. Create a lightweight checklist for validating published output:
   - Home page pagination, latest posts, tag pages, about page, RSS, CNAME.

### Validation
- `hugo` runs successfully with current setup.
- Baseline checklist is documented and reproducible.

### Deliverables
- `docs/maintenance-baseline.md` (or equivalent notes).

---

## Phase 1: Deployment Hardening (Low Risk, High Value)

### What
- Improve `deploy.sh` for reliability and clearer failure handling.

### Why
- Current script can fail on empty commits and has minimal guardrails.
- Deployment should be safe, idempotent, and explicit.

### How
1. Add shell safety flags (`set -euo pipefail`).
2. Add preflight checks:
   - Ensure `hugo` and `git` are installed.
   - Ensure `public/` exists and is a git repo.
3. Handle no-op deployments:
   - Skip commit/push if no changes in `public/`.
4. Make target branch configurable (default current branch or configurable variable).
5. Improve logging with clear success/failure steps.

### Validation
- Run script with no content changes: should skip commit cleanly.
- Run script with a trivial content change: should build, commit, and push path correctly.

### Deliverables
- Updated `deploy.sh` with safer behavior.
- Short usage notes in `README` or `docs/deploy.md`.

---

## Phase 2: Taxonomy and Tag Normalization

### What
- Normalize inconsistent tags/topics casing and naming variants.

### Why
- Current drift (e.g., `LLM` vs `llm`, `next-js` vs `next.js`, `ai` vs `AI`) fragments archives and weakens navigation/discoverability.

### How
1. Inventory all tags/topics from content front matter.
2. Define canonical taxonomy rules:
   - Casing standard: lowercase slugs only.
   - Separator standard (e.g., hyphen only).
3. Create a mapping table for variants -> canonical values.
4. Apply controlled updates to front matter across posts, including uppercase and mixed-case values to lowercase canonical values.
5. Update taxonomy label rendering so acronym-like terms remain readable in UI while preserving lowercase canonical slugs in URLs.
6. Rebuild and verify that merged tag pages render correctly.
7. Optionally add Hugo aliases/redirects for frequently used legacy URLs where needed.

### Validation
- Reduced duplicate taxonomy buckets.
- Expected tag/topic pages resolve and contain correct posts.
- No missing content from taxonomy index pages.

### Deliverables
- `docs/taxonomy-conventions.md`.
- Front matter updates across affected content files.

---

## Phase 3: Repo Hygiene and Asset Strategy

### What
- Clarify what should be source-controlled vs generated.
- Reduce unnecessary repo churn and noise.

### Why
- Committed generated artifacts can bloat history and complicate review.

### How
1. Confirm required deployment model for `public/` submodule (keep vs change).
2. Apply policy for `resources/_gen/`:
   - Ignore and regenerate (do not commit generated files).
3. Add/update `.gitignore` and contributor notes accordingly.
4. Remove currently tracked `resources/_gen/` files from git index while keeping local generated files available as needed.
5. Remove obsolete clutter where safe (e.g., redundant local artifacts, accidental files).

### Validation
- Fresh build works from clean checkout.
- Deploy workflow still functions end-to-end.
- Git diff noise is reduced for normal content changes.

### Deliverables
- Updated `.gitignore` and hygiene documentation.
- Cleanup commit removing tracked `resources/_gen/` artifacts from source control.

---

## Phase 4: Theme and Customization Consolidation

### What
- Reduce theme maintenance overhead and preserve only active, intentional customizations.

### Why
- Multiple inactive themes add clutter and can confuse future maintenance.

### How
1. Confirm active theme dependency (`blackburn`) and required overrides.
2. Audit non-active themes (`redlounge`, `hurock`) for any reused assets/partials.
3. If unused, archive/remove inactive themes from repo (or document why retained).
4. Document custom theme overrides and their purpose:
   - Responsive image renderer
   - Social links customization
   - Header/font customizations

### Validation
- Site renders correctly with no missing templates/assets.
- Custom behavior remains intact after cleanup.

### Deliverables
- `docs/theme-overrides.md`.
- Leaner `themes/` layout or clear retention rationale.

---

## Phase 5: Content Quality and Consistency Pass

### What
- Standardize front matter and correct obvious metadata quality issues.

### Why
- Consistency improves SEO quality, feed quality, and long-term maintainability.

### How
1. Define front matter minimum standard:
   - `title`, `date`, `draft`, `tags`, `topics`, optional `description`, `images` for social cards.
2. Add missing key fields in high-impact/newer posts first.
3. Correct typos in taxonomy-like labels (example: accidental variants).
4. Ensure page bundles consistently host related images.
5. Keep historical prose intact unless corrections are explicitly requested.

### Validation
- Hugo build has no new front matter errors.
- Recent posts have consistent metadata shape.

### Deliverables
- Front matter normalization in prioritized content set.
- `docs/content-style-guide.md`.

---

## Phase 6: Lightweight Automation and Quality Gates

### What
- Add automated checks to prevent regression before publish.

### Why
- Repetitive manual checks are error-prone.

### How
1. Add local validation script (e.g., `scripts/check-content.sh`):
   - Hugo build check
   - Draft/content summary report
   - Taxonomy duplication warnings
2. Optional CI (GitHub Actions):
   - Trigger on PR/push
   - Run Hugo build and basic lint checks.
3. Add “pre-deploy checklist” command and document it.

### Validation
- Checks run successfully on current branch.
- Known taxonomy inconsistency cases are detectable automatically.

### Deliverables
- Validation script(s) and CI workflow file.
- Documentation for running checks locally.

---

## Execution Order and Milestones
1. Phase 0 (baseline)
2. Phase 1 (deploy hardening)
3. Phase 2 (taxonomy normalization)
4. Phase 3 (repo hygiene)
5. Phase 4 (theme consolidation)
6. Phase 5 (content consistency)
7. Phase 6 (automation)

Milestone checkpoints:
- M1: Deploy process hardened and tested.
- M2: Taxonomy is canonicalized and stable.
- M3: Repo hygiene policy decided and applied.
- M4: Quality gates in place.

---

## Risk Management
- Risk: taxonomy renames break expected URLs.
  - Mitigation: apply mapping carefully, verify generated pages, add aliases where needed.
- Risk: deploy script change breaks current push target.
  - Mitigation: dry-run behavior and explicit branch checks.
- Risk: removing theme folders breaks hidden dependency.
  - Mitigation: audit and test before deletion.

## Rollback Strategy
- Each phase is committed independently.
- Revert only the affected phase commit if regression occurs.
- Keep baseline checklist to compare behavior before/after.

## Estimated Effort
- Phase 0-1: 0.5-1 day
- Phase 2: 0.5-1 day
- Phase 3-4: 0.5 day
- Phase 5: 1-2 days (depends on depth)
- Phase 6: 0.5 day

Total: ~3-5 days incremental effort.

## Definition of Done
- Deploy flow is robust and predictable.
- Taxonomy is consistent with documented conventions.
- Repo contains clear source-of-truth guidance and less generated noise.
- Basic automated checks prevent obvious publishing regressions.
