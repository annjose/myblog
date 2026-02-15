# Repository Map

## Purpose
This repo stores source code and content for the Hugo blog published at `https://annjose.com`.

## Top-Level Layout
- `config.toml`: Hugo site configuration (menus, taxonomies, theme, analytics).
- `content/`: authored pages and posts.
- `static/`: static files copied directly to build output.
- `themes/`: themes available in repo; active theme is `themes/blackburn`.
- `public/`: generated site output; git submodule used for publishing.
- `resources/_gen/`: generated assets from Hugo image/resource processing.
- `deploy.sh`: build + commit + push helper for `public/`.
- `scripts/`: project utility scripts.
- `docs/`: runbooks, conventions, and operational docs.

## Content Layout
- `content/about.md`: About page.
- `content/post/*.md`: older single-file posts.
- `content/post/<slug>/index.md`: page bundle posts with colocated images/media.
- `content/drafts.md`: draft listing page using shortcode.

## Active Theme Customizations
- `themes/blackburn/layouts/_default/_markup/render-image.html`: responsive image rendering for page resources.
- `themes/blackburn/layouts/partials/social.html`: social links rendering (includes Bluesky support).
- `themes/blackburn/layouts/partials/head.html`: head assets, fonts, icon kit configuration.

## Generated vs Source Files
- Source of truth:
- `content/`
- `config.toml`
- active custom theme templates
- Generated artifacts:
- `public/`
- `resources/_gen/`

## Publishing Model
1. Run `hugo` in this repo.
2. Hugo generates output to `public/`.
3. Commit/push inside `public/` submodule to publish site updates.

