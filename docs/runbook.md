# Runbook

## Prerequisites
- Hugo installed and available on `PATH`
- Git configured
- `public/` submodule initialized

## Build Site
```bash
hugo
```

Expected result:
- Site output generated in `public/`
- No fatal build errors

## Run Local Dev Server
```bash
hugo server -D
```

Notes:
- `-D` includes draft content.
- Default local URL is shown by Hugo in terminal output.

## Create a New Post (Preferred: Page Bundle)
1. Create a new post bundle:
```bash
hugo new post/<slug>/index.md
```
2. Update front matter (`title`, `date`, `draft`, `tags`, `topics`).
3. Add media files next to `index.md`.
4. Reference images with relative paths in markdown.
5. Run checks:
```bash
./scripts/check-content.sh
```
6. Switch `draft = false` when ready to publish.

## Update an Existing Post
1. Edit post markdown and/or colocated media.
2. Keep taxonomy values aligned with `docs/taxonomy-conventions.md`.
3. Run:
```bash
./scripts/check-content.sh
```
4. Verify affected pages locally with `hugo server -D`.

## Taxonomy Cleanup Workflow
1. Inventory current usage:
```bash
./scripts/check-content.sh
```
2. Apply canonical tag/topic mapping in front matter.
3. Rebuild site:
```bash
hugo
```
4. Verify expected tag/topic archive pages.

## Deploy Workflow
Current project workflow:
```bash
./deploy.sh
```

Manual equivalent:
1. `hugo`
2. `cd public`
3. `git add -A`
4. `git commit -m "<message>"`
5. `git push`

See `docs/deploy.md` for details and safety notes.

## Pre-Deploy Checklist
1. `./scripts/check-content.sh` passes.
2. New/changed posts render correctly in local preview.
3. No unintended taxonomy changes.
4. Deploy commit message reflects the release intent.

