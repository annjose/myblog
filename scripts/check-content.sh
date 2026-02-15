#!/usr/bin/env bash
set -euo pipefail

echo "[check] starting content checks"

if ! command -v hugo >/dev/null 2>&1; then
  echo "[check] error: hugo is not installed or not on PATH"
  exit 1
fi

if ! command -v rg >/dev/null 2>&1; then
  echo "[check] error: rg is not installed or not on PATH"
  exit 1
fi

if [ ! -d "content" ]; then
  echo "[check] error: content/ directory not found"
  exit 1
fi

echo "[check] running Hugo build"
hugo >/tmp/hugo-check.log 2>&1 || {
  echo "[check] error: hugo build failed. Last output:"
  tail -n 60 /tmp/hugo-check.log || true
  exit 1
}
echo "[check] hugo build: OK"

post_count="$(find content/post -name "*.md" | wc -l | tr -d ' ')"
bundle_count="$(find content/post -name "index.md" | wc -l | tr -d ' ')"
legacy_count="$(find content/post -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')"
draft_count="$(rg -n '^[[:space:]]*draft[[:space:]]*=[[:space:]]*true' content -g '*.md' | wc -l | tr -d ' ')"

echo "[check] post markdown files: ${post_count}"
echo "[check] bundle posts (index.md): ${bundle_count}"
echo "[check] legacy single-file posts: ${legacy_count}"
echo "[check] draft files: ${draft_count}"

tmp_tags="$(mktemp)"
tmp_topics="$(mktemp)"

extract_terms() {
  local key="$1"
  local out_file="$2"

  rg -n "^[[:space:]]*${key}[[:space:]]*=" content -g '*.md' \
    | while IFS= read -r line; do
        echo "${line}" | grep -oE '"[^"]+"' | tr -d '"' || true
      done \
    | sed '/^[[:space:]]*$/d' \
    | sort -u > "${out_file}"
}

extract_terms "tags" "${tmp_tags}"
extract_terms "topics" "${tmp_topics}"

tag_total="$(wc -l < "${tmp_tags}" | tr -d ' ')"
topic_total="$(wc -l < "${tmp_topics}" | tr -d ' ')"

echo "[check] unique tags: ${tag_total}"
echo "[check] unique topics: ${topic_total}"

echo "[check] potential taxonomy collisions (case/punctuation variants):"

detect_collisions() {
  local in_file="$1"
  awk '
  function canon(s) {
    t = tolower(s)
    gsub(/[ ._]+/, "-", t)
    gsub(/-+/, "-", t)
    gsub(/^-|-$/, "", t)
    return t
  }
  {
    c = canon($0)
    raw[c] = raw[c] " | " $0
    cnt[c]++
  }
  END {
    found = 0
    for (k in cnt) {
      split(raw[k], arr, " \\| ")
      delete seen
      variants = 0
      out = ""
      for (i in arr) {
        if (arr[i] == "") continue
        if (!(arr[i] in seen)) {
          seen[arr[i]] = 1
          variants++
          out = out (out ? ", " : "") arr[i]
        }
      }
      if (variants > 1) {
        found = 1
        print "  - canonical: " k " -> variants: " out
      }
    }
    if (!found) {
      print "  none"
    }
  }' "${in_file}"
}

echo "[check] tag collisions:"
detect_collisions "${tmp_tags}"
echo "[check] topic collisions:"
detect_collisions "${tmp_topics}"

rm -f "${tmp_tags}" "${tmp_topics}"
echo "[check] completed"

