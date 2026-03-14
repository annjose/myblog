import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";

const BLOG_DIR = path.resolve("src/content/blog");
const PUBLIC_IMG_DIR = path.resolve("public/img");

interface ValidationResult {
  pass: number;
  fail: number;
  errors: string[];
}

function findAllMdFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findAllMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function validate(): ValidationResult {
  const result: ValidationResult = { pass: 0, fail: 0, errors: [] };
  const mdFiles = findAllMdFiles(BLOG_DIR);

  // ─── Check 1: Post count ──────────────────────────────────────────
  if (mdFiles.length === 58) {
    result.pass++;
    console.log(`  ✓ Post count: ${mdFiles.length} posts`);
  } else {
    result.fail++;
    result.errors.push(`Expected 58 posts, found ${mdFiles.length}`);
    console.log(`  ✗ Post count: expected 58, found ${mdFiles.length}`);
  }

  // ─── Per-post checks ──────────────────────────────────────────────
  let yamlErrors = 0;
  let dateErrors = 0;
  let tagErrors = 0;
  let shortcodeErrors = 0;
  let imageErrors = 0;

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const rel = path.relative(BLOG_DIR, file);

    // Check 2: YAML parses correctly
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) {
      yamlErrors++;
      result.errors.push(`${rel}: No YAML frontmatter found`);
      continue;
    }

    let fm: Record<string, unknown>;
    try {
      fm = yaml.load(fmMatch[1]) as Record<string, unknown>;
    } catch (err) {
      yamlErrors++;
      result.errors.push(`${rel}: YAML parse error: ${(err as Error).message}`);
      continue;
    }

    // Check 3: Date parses
    const dateStr = fm.pubDatetime as string;
    if (!dateStr || isNaN(new Date(dateStr).getTime())) {
      dateErrors++;
      result.errors.push(`${rel}: Invalid date: ${dateStr}`);
    }

    // Check 4: Tags are lowercase slugs
    const tags = fm.tags as string[];
    if (tags) {
      for (const tag of tags) {
        if (tag !== tag.toLowerCase()) {
          tagErrors++;
          result.errors.push(`${rel}: Tag not lowercase: "${tag}"`);
        }
      }
    }

    // Check 5: No residual shortcode syntax
    if (content.includes("{{<") || content.includes("{{%")) {
      shortcodeErrors++;
      result.errors.push(`${rel}: Residual shortcode syntax found`);
    }

    // Check 6: Image references resolve
    // Check ogImage in frontmatter
    if (fm.ogImage) {
      const ogImg = fm.ogImage as string;
      const postDir = path.dirname(file);
      const imgPath = path.join(postDir, ogImg);
      if (!fs.existsSync(imgPath)) {
        imageErrors++;
        result.errors.push(`${rel}: ogImage not found: ${ogImg}`);
      }
    }

    // Check markdown image references in body
    const body = content.slice(fmMatch[0].length);
    const imgRefs = body.matchAll(/!\[[^\]]*\]\(([^\s")]+)/g);
    for (const imgRef of imgRefs) {
      const imgSrc = imgRef[1];
      // Skip external URLs
      if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
        continue;
      }
      // Check /img/ references (static images)
      if (imgSrc.startsWith("/img/")) {
        const staticPath = path.join(PUBLIC_IMG_DIR, imgSrc.replace("/img/", ""));
        if (!fs.existsSync(staticPath)) {
          imageErrors++;
          result.errors.push(`${rel}: Static image not found: ${imgSrc}`);
        }
      } else if (!imgSrc.startsWith("/")) {
        // Relative image (colocated)
        const postDir = path.dirname(file);
        const imgPath = path.join(postDir, imgSrc);
        if (!fs.existsSync(imgPath)) {
          imageErrors++;
          result.errors.push(`${rel}: Colocated image not found: ${imgSrc}`);
        }
      }
    }
  }

  // Report per-check results
  const checks = [
    { name: "YAML parsing", errors: yamlErrors },
    { name: "Date parsing", errors: dateErrors },
    { name: "Tags lowercase", errors: tagErrors },
    { name: "No residual shortcodes", errors: shortcodeErrors },
    { name: "Image references", errors: imageErrors },
  ];

  for (const check of checks) {
    if (check.errors === 0) {
      result.pass++;
      console.log(`  ✓ ${check.name}: all posts pass`);
    } else {
      result.fail++;
      console.log(`  ✗ ${check.name}: ${check.errors} error(s)`);
    }
  }

  return result;
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("Validating migration...\n");
const result = validate();
console.log(
  `\nValidation complete: ${result.pass} checks passed, ${result.fail} failed.`
);

if (result.errors.length > 0) {
  console.log("\nErrors:");
  for (const err of result.errors) {
    console.log(`  - ${err}`);
  }
  process.exit(1);
}
