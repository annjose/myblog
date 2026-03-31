# annjose.com blog source

Source repository for the Astro-powered blog at `https://annjose.com`.

## Stack
- [Astro](https://astro.build/) 5 static site generator
- Tailwind CSS
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)

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

## Full check (test + build)
```bash
pnpm run check
```

## Deploy
Push to `astro` (or `main`) branch — Cloudflare Pages auto-builds and deploys.

## Content
- Blog posts live in `src/content/blog/` as YAML-frontmatter Markdown
- Content sample post at `/blog/content-sample` exercises all formatting features
- See [docs/content-style-guide.md](docs/content-style-guide.md) for frontmatter and writing conventions
- See [docs/taxonomy-conventions.md](docs/taxonomy-conventions.md) for tag naming rules
