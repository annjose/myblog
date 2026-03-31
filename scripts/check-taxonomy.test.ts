import { describe, it, expect } from "vitest";
import { readFileSync, globSync } from "node:fs";
import { load } from "js-yaml";
import { resolve } from "node:path";

function getContentFiles(): string[] {
  const pattern = resolve(import.meta.dirname, "../src/content/blog/**/*.md");
  return globSync(pattern);
}

function extractTags(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];
  const frontmatter = load(match[1]) as Record<string, unknown>;
  const tags = frontmatter?.tags;
  return Array.isArray(tags) ? tags.map(String) : [];
}

function canonicalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ ._]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

describe("taxonomy collisions", () => {
  it("should have no tag variants that canonicalize to the same slug", () => {
    const files = getContentFiles();
    expect(files.length).toBeGreaterThan(0);

    const allTags = new Set<string>();
    for (const file of files) {
      for (const tag of extractTags(file)) {
        allTags.add(tag);
      }
    }

    const canonicalMap = new Map<string, string[]>();
    for (const tag of allTags) {
      const key = canonicalize(tag);
      const existing = canonicalMap.get(key) ?? [];
      existing.push(tag);
      canonicalMap.set(key, existing);
    }

    const collisions: string[] = [];
    for (const [canonical, variants] of canonicalMap) {
      if (variants.length > 1) {
        collisions.push(
          `canonical "${canonical}" has variants: ${variants.join(", ")}`
        );
      }
    }

    expect(collisions, "Tag taxonomy collisions found:\n" + collisions.join("\n")).toEqual([]);
  });
});
