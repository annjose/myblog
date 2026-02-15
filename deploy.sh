#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[deploy] %s\n' "$1"
}

fail() {
  printf '[deploy] error: %s\n' "$1" >&2
  exit 1
}

if [ "$#" -gt 1 ]; then
  fail "usage: ./deploy.sh [commit-message]"
fi

log "Started deployment."

for cmd in hugo git; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "required command not found on PATH: $cmd"
  fi
done

if [ ! -d "public" ]; then
  fail "public/ directory not found"
fi

if ! git -C public rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  fail "public/ is not a git working tree"
fi

log "Generating static site into public/..."
hugo

log "Staging generated changes in public/..."
git -C public add -A

if git -C public diff --cached --quiet; then
  log "No changes detected in public/. Skipping commit and push."
  exit 0
fi

current_branch="$(git -C public symbolic-ref --short -q HEAD || true)"
target_branch="${DEPLOY_BRANCH:-$current_branch}"

if [ -z "$target_branch" ]; then
  fail "could not determine target branch in public/. Set DEPLOY_BRANCH explicitly."
fi

msg="Rebuilt site and published on $(date '+%Y-%m-%d %H:%M:%S %Z')"
if [ "$#" -eq 1 ]; then
  msg="$1"
fi

log "Committing changes in public/..."
git -C public commit -m "$msg"

log "Pushing to origin/$target_branch..."
git -C public push origin "$target_branch"

log "Deployment completed successfully."
