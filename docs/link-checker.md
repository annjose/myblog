# Link checker (lychee)

We use [lychee](https://github.com/lycheeverse/lychee) to catch broken internal
links in the built site — typo'd slugs, missing colocated assets, malformed
markdown links, and stale anchors.

In CI it runs in **offline mode**: it walks `dist/**/*.html` and validates only
internal/relative links. External URLs are deliberately skipped to avoid flake
from rate limits and transient outages on third-party hosts.

## Run it locally

Lychee is a Rust binary (not an npm package), so install it once:

```sh
brew install lychee
```

Then build the site and run the check:

```sh
pnpm run build
pnpm run check:links
```

The `check:links` script wraps:

```sh
lychee --offline --root-dir "$PWD/dist" --no-progress 'dist/**/*.html'
```

- `--offline` — skip all external HTTP requests
- `--root-dir` — resolve absolute paths like `/blog/foo` against `dist/`
- The glob walks every built HTML page

A clean run ends with `🚫 0 Errors`.

## When something fails

Lychee prints the source HTML file, the line, and the unreachable target. The
fix is almost always in the corresponding markdown under `src/content/blog/`
(or a layout/component for site-chrome links).

## Checking external links manually

Once before launch, run lychee without `--offline` to flag dead external links
in old posts:

```sh
lychee --no-progress --max-retries 2 --timeout 20 'dist/**/*.html'
```

Expect some 403/429 noise from LinkedIn, X, etc. Treat the output as a triage
list, not a CI gate.

## CI

The check runs on every push to `astro`/`main` and every PR via
`.github/workflows/content-check.yml`, after `pnpm run build`. A broken
internal link fails the build.
