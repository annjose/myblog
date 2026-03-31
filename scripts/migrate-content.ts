import * as TOML from "@iarna/toml";
import * as yaml from "js-yaml";
import * as fs from "node:fs";
import * as path from "node:path";

// ─── Types ───────────────────────────────────────────────────────────────────

interface HugoFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  draft?: boolean;
  tags?: string[];
  topics?: string[];
  images?: string[];
  [key: string]: unknown;
}

interface AstroFrontmatter {
  title: string;
  description: string;
  pubDatetime: string;
  draft: boolean;
  tags: string[];
  author: string;
  disqusSlug: string;
  ogImage?: string;
}

// ─── Exported Functions ──────────────────────────────────────────────────────

/**
 * Parse TOML frontmatter delimited by +++ from a Hugo markdown file.
 * Returns the parsed frontmatter object and the remaining body.
 */
export function parseTomlFrontmatter(content: string): {
  frontmatter: HugoFrontmatter;
  body: string;
} {
  const match = content.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(
      "No valid TOML frontmatter found (expected +++ delimiters)"
    );
  }

  const tomlStr = match[1];
  const body = match[2];

  const frontmatter = TOML.parse(tomlStr) as unknown as HugoFrontmatter;
  return { frontmatter, body };
}

/**
 * Convert Hugo frontmatter fields to Astro blog collection schema.
 */
export function convertFrontmatter(
  toml: HugoFrontmatter,
  slug: string
): AstroFrontmatter {
  // Merge tags and topics, deduplicate
  const tags = [...(toml.tags || [])];
  if (toml.topics && toml.topics.length > 0) {
    for (const topic of toml.topics) {
      if (!tags.includes(topic)) {
        tags.push(topic);
      }
    }
  }

  const result: AstroFrontmatter = {
    title: toml.title || "",
    description: toml.description || "",
    pubDatetime: toml.date || "",
    draft: toml.draft ?? false,
    tags,
    author: "Ann Catherine Jose",
    disqusSlug: slug,
  };

  // Map images[0] to ogImage
  if (toml.images && toml.images.length > 0) {
    result.ogImage = toml.images[0];
  }

  return result;
}

/**
 * Generate a description from the first 160 characters of the body text.
 * Strips markdown formatting and skips heading lines.
 */
export function generateDescription(body: string): string {
  // Split into lines, skip headings and empty lines
  const lines = body.split("\n").filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith("#");
  });

  let text = lines.join(" ");

  // Strip markdown formatting
  text = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
    .replace(/`([^`]+)`/g, "$1") // `code` → code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** → bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* → italic
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();

  if (text.length <= 160) {
    return text;
  }

  // Truncate at 160 chars, try to break at a word boundary
  let truncated = text.slice(0, 157);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 120) {
    truncated = truncated.slice(0, lastSpace);
  }
  return truncated + "...";
}

// ─── Shortcode Conversions ───────────────────────────────────────────────────

/**
 * Convert a single {{< pure_table >}} shortcode to a markdown table.
 */
export function convertPureTable(shortcode: string): string {
  // Extract quoted rows
  const rows: string[] = [];
  const rowRegex = /"([^"]+)"/g;
  let match;
  while ((match = rowRegex.exec(shortcode)) !== null) {
    rows.push(match[1]);
  }

  if (rows.length === 0) return shortcode;

  const lines: string[] = [];
  rows.forEach((row, i) => {
    const cells = row.split("|").map(c => c.trim());
    lines.push("| " + cells.join(" | ") + " |");
    if (i === 0) {
      // Add separator after header row
      lines.push("| " + cells.map(() => "---").join(" | ") + " |");
    }
  });

  return lines.join("\n");
}

/**
 * Convert a single {{< fluid_imgs >}} shortcode to an image-grid div.
 * Format: "pure-u-1 pure-u-md-1-N|filename.png|Caption"
 */
export function convertFluidImgs(shortcode: string): string {
  const imgRegex = /"([^"]+)"/g;
  const images: { classes: string; src: string; alt: string }[] = [];
  let match;

  while ((match = imgRegex.exec(shortcode)) !== null) {
    const parts = match[1].split("|");
    if (parts.length >= 3) {
      images.push({
        classes: parts[0].trim(),
        src: parts[1].trim(),
        alt: parts[2].trim(),
      });
    }
  }

  const imgMarkdown = images.map(img => `![${img.alt}](${img.src})`).join("\n\n");

  return imgMarkdown;
}

/**
 * Convert a single {{< video >}} shortcode to HTML5 <video> tag.
 */
export function convertVideo(shortcode: string): string {
  const srcMatch = shortcode.match(/src="([^"]+)"/);
  const widthMatch = shortcode.match(/width="([^"]+)"/);
  const heightMatch = shortcode.match(/height="([^"]+)"/);
  const autoplayMatch = shortcode.match(/autoplay="([^"]+)"/);

  const src = srcMatch?.[1] || "";
  const width = widthMatch ? ` width="${widthMatch[1]}"` : "";
  const height = heightMatch ? ` height="${heightMatch[1]}"` : "";
  const autoplay = autoplayMatch?.[1] === "yes" ? " autoplay" : "";

  return `<video src="${src}.mp4"${width}${height}${autoplay} controls>\n  Your browser does not support the video tag.\n</video>`;
}

/**
 * Convert a single {{< figure >}} shortcode to a markdown image.
 */
export function convertFigure(attrs: string): string {
  const srcMatch = attrs.match(/src="([^"]+)"/);
  const altMatch = attrs.match(/alt="([^"]+)"/);
  const titleMatch = attrs.match(/title="([^"]+)"/);

  const src = srcMatch?.[1] || "";
  const alt = altMatch?.[1] || titleMatch?.[1] || "";

  return `![${alt}](${src})`;
}

/**
 * Convert all Hugo shortcodes in the body text.
 */
export function convertShortcodes(body: string): string {
  // Convert pure_table shortcodes
  body = body.replace(
    /\{\{<\s*pure_table\s*\n([\s\S]*?)>\}\}/g,
    (_match, inner) => {
      return convertPureTable(inner);
    }
  );

  // Convert fluid_imgs shortcodes
  body = body.replace(
    /\{\{<\s*fluid_imgs\s*\n([\s\S]*?)>\}\}/g,
    (_match, inner) => {
      return convertFluidImgs(inner);
    }
  );

  // Convert video shortcodes
  body = body.replace(/\{\{<\s*video\s+([^>]*?)>\}\}/g, (match) => {
    return convertVideo(match);
  });

  // Convert figure shortcodes → markdown images
  body = body.replace(
    /\{\{<\s*figure\s+([\s\S]*?)>\}\}/g,
    (_match, attrs: string) => {
      return convertFigure(attrs);
    }
  );

  // Convert highlight shortcodes → fenced code blocks
  body = body.replace(
    /\{\{<\s*highlight\s+(\w+)(?:\s+[^>]*)?\s*>\}\}\n([\s\S]*?)\{\{<\s*\/\s*highlight\s*>\}\}/g,
    (_match, lang: string, code: string) => {
      return "```" + lang + "\n" + code.trimEnd() + "\n```";
    }
  );

  return body;
}

// ─── Main Migration Logic ────────────────────────────────────────────────────

function copyDirRecursive(
  srcDir: string,
  destDir: string,
  exclude: string[] = []
): void {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getSlugFromPath(filePath: string, postDir: string): string {
  const rel = path.relative(postDir, filePath);
  // Page bundle: slug/index.md → slug
  // Single file: slug.md → slug
  if (rel.endsWith("/index.md")) {
    return path.dirname(rel);
  }
  return path.basename(rel, ".md");
}

function findAllPosts(postDir: string): string[] {
  const posts: string[] = [];

  const entries = fs.readdirSync(postDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(postDir, entry.name, "index.md");
      if (fs.existsSync(indexPath)) {
        posts.push(indexPath);
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      posts.push(path.join(postDir, entry.name));
    }
  }

  return posts;
}

function migratePost(
  filePath: string,
  postDir: string,
  outputDir: string
): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const slug = getSlugFromPath(filePath, postDir);
  const { frontmatter, body } = parseTomlFrontmatter(content);

  // Generate description if missing
  if (!frontmatter.description) {
    frontmatter.description = generateDescription(body);
  }

  const astroFm = convertFrontmatter(frontmatter, slug);
  const convertedBody = convertShortcodes(body);

  // Build YAML frontmatter
  // Convert pubDatetime to a Date object so js-yaml outputs it as a YAML date
  // (unquoted), which Astro's z.date() expects
  const yamlObj = {
    ...astroFm,
    pubDatetime: new Date(astroFm.pubDatetime),
  };
  const finalYaml = yaml.dump(yamlObj, {
    quotingType: '"',
    forceQuotes: true,
    lineWidth: -1,
  });

  const output = `---\n${finalYaml}---\n${convertedBody}`;

  // Determine output path
  const rel = path.relative(postDir, filePath);
  const isPageBundle = rel.includes("/index.md");

  let outputPath: string;
  if (isPageBundle) {
    outputPath = path.join(outputDir, rel);
  } else {
    outputPath = path.join(outputDir, path.basename(filePath));
  }

  // Create directory and write
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output, "utf-8");

  // Copy colocated files for page bundles (images, videos, subdirs)
  if (isPageBundle) {
    const srcDir = path.dirname(filePath);
    const destDir = path.dirname(outputPath);
    copyDirRecursive(srcDir, destDir, ["index.md"]);
  }
}

// ─── CLI Entry Point ─────────────────────────────────────────────────────────

function main() {
  const postDir = path.resolve("content/post");
  const outputDir = path.resolve("src/content/blog");

  if (!fs.existsSync(postDir)) {
    console.error(`Source directory not found: ${postDir}`);
    process.exit(1);
  }

  const posts = findAllPosts(postDir);
  console.log(`Found ${posts.length} posts to migrate.`);

  // Clear existing demo content in output dir
  if (fs.existsSync(outputDir)) {
    const existing = fs.readdirSync(outputDir);
    for (const item of existing) {
      const itemPath = path.join(outputDir, item);
      fs.rmSync(itemPath, { recursive: true });
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let migrated = 0;
  let errors = 0;

  for (const post of posts) {
    try {
      migratePost(post, postDir, outputDir);
      migrated++;
      const slug = getSlugFromPath(post, postDir);
      console.log(`  ✓ ${slug}`);
    } catch (err) {
      errors++;
      console.error(`  ✗ ${post}: ${(err as Error).message}`);
    }
  }

  // Copy static images: static/img/ and content/img/ → public/img/
  const publicImgDir = path.resolve("public/img");
  fs.mkdirSync(publicImgDir, { recursive: true });
  for (const imgSource of ["static/img", "content/img"]) {
    const srcImgDir = path.resolve(imgSource);
    if (fs.existsSync(srcImgDir)) {
      copyDirRecursive(srcImgDir, publicImgDir);
    }
  }

  console.log(
    `\nMigration complete: ${migrated} migrated, ${errors} errors, out of ${posts.length} total.`
  );
}

// Run only when executed directly (not imported by tests)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.url.replace("file://", ""))) {
  main();
}
