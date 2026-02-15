# Theme Overrides

## Active Theme
- Active theme: `blackburn` (from `config.toml`)

## Active Custom Overrides (Source of Truth)
These files in `themes/blackburn/` are customized and should be treated as intentional project overrides:

- `themes/blackburn/layouts/_default/_markup/render-image.html`
  - Responsive image rendering for page resources.
- `themes/blackburn/layouts/partials/social.html`
  - Social links customization (includes Bluesky).
- `themes/blackburn/layouts/partials/head.html`
  - Head-level assets, icon kit, and font loading behavior.
- `themes/blackburn/layouts/partials/post_meta.html`
  - Taxonomy metadata display in post header.
- `themes/blackburn/layouts/partials/taxonomy-label.html`
  - Acronym label mapping (`ai` -> `AI`, `llm` -> `LLM`, `rag` -> `RAG`).
- `themes/blackburn/layouts/_default/terms.html`
  - Taxonomy terms list rendering.
- `themes/blackburn/layouts/taxonomy/tag.html`
  - Tag taxonomy page heading rendering.
- `themes/blackburn/layouts/taxonomy/topic.html`
  - Topic taxonomy page heading rendering.

## Inactive Theme Audit
Audited inactive themes:
- `themes/redlounge`
- `themes/hurock`

Audit result:
- No runtime references found in `config.toml`.
- No active references found in current templates/config outside the inactive theme directories.
- Site builds and runs with `blackburn` only.

## Retention Decision (Phase 4)
- Keep `redlounge` and `hurock` in repo for now as historical reference.
- Do not remove inactive themes in this phase to avoid unnecessary churn/risk.
- Revisit deletion only if you want a stricter repo-size cleanup in a dedicated follow-up.
