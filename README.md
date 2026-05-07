# annjose.com blog source

Source repository for the Astro-powered blog at `https://annjose.com`.

## Stack
- [Astro 5](https://astro.build/) static site generator
- [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Cloudflare](https://workers.cloudflare.com/)

## Setup
```bash
pnpm install
```

## Development
```bash
pnpm run dev
```

## Build
```bash
pnpm run build
```

## Test
```bash
pnpm test
```

## Deploy
Push to `main` branch — Cloudflare Workers auto-builds and deploys.

## Content
- Blog posts live in `src/content/blog/` as YAML-frontmatter Markdown
- Content sample post at `/blog/content-sample` exercises all formatting features
- See [docs/content-style-guide.md](docs/content-style-guide.md) for frontmatter and writing conventions
- See [docs/taxonomy-conventions.md](docs/taxonomy-conventions.md) for tag naming rules

## Profile assets

The canonical profile image is `src/assets/images/ann-color-sketch-square.png`.
Keep it square and use it as the source for both the site avatar and favicons.

When replacing the profile image, regenerate the PNG favicons with ImageMagick:

```bash
magick src/assets/images/ann-color-sketch-square.png -resize 32x32 public/favicon-32.png
magick src/assets/images/ann-color-sketch-square.png -resize 180x180 public/favicon-180.png
```

The header avatar uses the transparent profile image over the page background,
with the gradient reserved for the outer ring.

## Theme Preview

- Raspberry is the default palette.
- Add `?themePreview=1` to any local URL to show the temporary palette dropdown.
- Preview options: `Raspberry`, `Aubergine`, `Rosewood`, and `Brick`.
- The dropdown is hidden without `themePreview=1`; do not use palette query params for production behavior.
