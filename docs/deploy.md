# Deploy Guide

## Current Deployment Model
- Hugo generates static output in `public/`.
- `public/` is a git submodule mapped to the publish repo (`annjose.github.io`).
- Deploy means committing and pushing changes from inside `public/`.

## Standard Deploy Command
```bash
./deploy.sh
```

Optional custom commit message:
```bash
./deploy.sh "Publish new post"
```

## What `deploy.sh` Does
1. Runs `hugo`.
2. Validates preflight requirements (`hugo`, `git`, and `public/` git worktree).
3. Stages generated output in `public/` with `git add -A`.
4. Detects no-op deploys and exits cleanly if no changes are staged.
5. Commits with a timestamped message (or custom message argument).
6. Pushes to remote branch.

Branch behavior:
- Default push target is the current checked out branch inside `public/`.
- Override explicitly with `DEPLOY_BRANCH`.

Example:
```bash
DEPLOY_BRANCH=master ./deploy.sh
```

## Manual Deploy (Equivalent)
```bash
hugo
cd public
git add -A
git diff --cached --quiet && echo "No changes to deploy" && exit 0
git commit -m "Rebuilt site"
git push origin <branch>
cd ..
```

## Safety Checks Before Deploy
1. Run `./scripts/check-content.sh`.
2. Confirm local preview looks correct for changed pages.
3. Confirm no accidental draft publish.
4. Confirm taxonomy names are canonical.

## Troubleshooting
- If no files changed in `public/`, deploy now exits cleanly with a no-op message.
- If `public/` is detached HEAD, set `DEPLOY_BRANCH` explicitly before running deploy.
- If Hugo build fails, fix source issues before re-running deploy.

## Rollback
- Revert the bad commit in the `public/` submodule and push.
- If source content is wrong, revert source commit in this repo, rebuild, and redeploy.
