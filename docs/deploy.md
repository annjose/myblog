# Deploy Guide

## Current Deployment Model
- Hugo generates static output in `public/`.
- `public/` is a git submodule mapped to the publish repo (`annjose.github.io`).
- Deploy means committing and pushing changes from inside `public/`.

## Standard Deploy Command
```bash
./deploy.sh
```

## What `deploy.sh` Does
1. Runs `hugo`.
2. Enters `public/`.
3. Runs `git add -A`.
4. Commits with a timestamped message (or custom message argument).
5. Pushes to remote.

## Manual Deploy (Equivalent)
```bash
hugo
cd public
git add -A
git commit -m "Rebuilt site"
git push origin master
cd ..
```

## Safety Checks Before Deploy
1. Run `./scripts/check-content.sh`.
2. Confirm local preview looks correct for changed pages.
3. Confirm no accidental draft publish.
4. Confirm taxonomy names are canonical.

## Troubleshooting
- If no files changed in `public/`, commit can fail because there is nothing to commit.
- If submodule branch differs from `master`, push target in deploy script may need adjustment.
- If Hugo build fails, fix source issues before re-running deploy.

## Rollback
- Revert the bad commit in the `public/` submodule and push.
- If source content is wrong, revert source commit in this repo, rebuild, and redeploy.

