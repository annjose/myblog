# Link checker (lychee)

We use [lychee](https://github.com/lycheeverse/lychee) to catch broken internal
links in the built site — typo'd slugs, missing colocated assets, malformed
markdown links, and stale anchors.

In CI it runs in **offline mode**: it walks `dist/**/*.html` and validates only
internal/relative links. External URLs are deliberately skipped to avoid flake
from rate limits and transient outages on third-party hosts.

## Run it locally

Lychee is a Rust binary (not an npm package) — there is no npm install. Install it once:

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

- `--offline` — skip all external HTTP requests (those ~1600 external URLs show up as 👻 Excluded, which is expected)
- `--root-dir "$PWD/dist"` — resolves root-relative paths like `/blog/foo` and `/_astro/` against `dist/`. Must be an **absolute path** — `"$PWD/dist"` expands correctly via the shell. Do not use a bare relative path like `dist` and do not copy this command with `\"` escaping from JSON, as lychee will treat the quote characters as part of the path.
- The glob walks every built HTML page

A clean run ends with `🚫 0 Errors`.

### Version pinning

CI pins lychee to a specific version via `lycheeVersion` in `lycheeverse/lychee-action`. Keep your local brew version in sync:

```sh
lychee --version       # check current local version
brew upgrade lychee    # upgrade if behind
```

Version drift between local and CI can cause false passes locally — macOS is case-insensitive, Linux CI is not. A link like `/blog/run-code-llama-70B-locally` will pass on Mac but fail in CI if the actual slug is lowercase. Always run `pnpm run check:links` locally before pushing, but treat a CI failure as authoritative.

### Fragment links

Fragment-only links (`#section`) are already handled correctly by lychee and do not need to be explicitly excluded. Cross-page anchor links like `/blog/post/#heading` are checked at the file level (the page file must exist) but lychee does not validate that the `id` attribute exists inside the target HTML — so a broken in-page anchor won't be caught here.

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

The check runs on every push to `master`/`main` and every PR via
`.github/workflows/content-check.yml`, after `pnpm run build`. A broken
internal link fails the build.

CI uses `--root-dir $GITHUB_WORKSPACE/dist` (absolute path provided by the runner environment) rather than `$PWD/dist`. The lychee version is pinned via `lycheeVersion` in the action config — update it when upgrading brew locally.
