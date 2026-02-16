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

# Front matter and social metadata quality checks for bundle posts.
echo "[check] bundle metadata checks:"

missing_required=0
missing_images_hint=0

for f in $(find content/post -name "index.md" | sort); do
  fm="$(sed -n '/^\+\+\+$/,/^\+\+\+$/p' "$f" | sed '1d;$d')"

  if ! printf "%s\n" "$fm" | rg -q '^title[[:space:]]*='; then
    echo "  - missing required key in $f: title"
    missing_required=$((missing_required + 1))
  fi
  if ! printf "%s\n" "$fm" | rg -q '^date[[:space:]]*='; then
    echo "  - missing required key in $f: date"
    missing_required=$((missing_required + 1))
  fi
  if ! printf "%s\n" "$fm" | rg -q '^draft[[:space:]]*='; then
    echo "  - missing required key in $f: draft"
    missing_required=$((missing_required + 1))
  fi
  if ! printf "%s\n" "$fm" | rg -q '^tags[[:space:]]*='; then
    echo "  - missing required key in $f: tags"
    missing_required=$((missing_required + 1))
  fi
  if ! printf "%s\n" "$fm" | rg -q '^topics[[:space:]]*='; then
    echo "  - missing required key in $f: topics"
    missing_required=$((missing_required + 1))
  fi

  # If a bundle has local images and no front matter images key, raise a warning-style hint.
  if ! printf "%s\n" "$fm" | rg -q '^images[[:space:]]*='; then
    image_count="$(find "$(dirname "$f")" -maxdepth 1 -type f | rg -i '\.(png|jpe?g|webp)$' || true)"
    image_count="$(printf "%s\n" "${image_count}" | sed '/^$/d' | wc -l | tr -d ' ')"
    if [ "${image_count}" -gt 0 ]; then
      echo "  - missing recommended key in $f: images (local images found: ${image_count})"
      missing_images_hint=$((missing_images_hint + 1))
    fi
  fi
done

if [ "${missing_required}" -gt 0 ]; then
  echo "[check] error: missing required bundle front matter keys: ${missing_required}"
  rm -f "${tmp_tags}" "${tmp_topics}"
  exit 1
fi

if [ "${missing_images_hint}" -gt 0 ]; then
  echo "[check] warning: bundle posts missing recommended images key: ${missing_images_hint}"
else
  echo "[check] bundle images metadata: OK"
fi

if ! rg -q '^[[:space:]]*images[[:space:]]*=' config.toml; then
  echo "[check] info: config.toml has no default [params].images fallback for social cards"
else
  echo "[check] default social image fallback in config.toml: OK"
fi

rm -f "${tmp_tags}" "${tmp_topics}"
echo "[check] completed"
