import { describe, it, expect } from "vitest";
import {
  parseTomlFrontmatter,
  convertFrontmatter,
  convertPureTable,
  convertFluidImgs,
  convertVideo,
  convertShortcodes,
  generateDescription,
} from "./migrate-content.js";

// ─── TOML Frontmatter Parsing ────────────────────────────────────────────────

describe("parseTomlFrontmatter", () => {
  it("parses TOML frontmatter delimited by +++", () => {
    const input = `+++
title = "My Post"
date = "2023-01-15T10:00:00-08:00"
draft = false
tags = ["ai", "coding"]
+++

Body content here.`;

    const result = parseTomlFrontmatter(input);
    expect(result.frontmatter.title).toBe("My Post");
    expect(result.frontmatter.date).toBe("2023-01-15T10:00:00-08:00");
    expect(result.frontmatter.draft).toBe(false);
    expect(result.frontmatter.tags).toEqual(["ai", "coding"]);
    expect(result.body).toBe("\nBody content here.");
  });

  it("throws on posts with no frontmatter", () => {
    const input = "Just some content without frontmatter.";
    expect(() => parseTomlFrontmatter(input)).toThrow();
  });

  it("throws on posts with incomplete frontmatter delimiters", () => {
    const input = `+++
title = "Broken"
No closing delimiter`;
    expect(() => parseTomlFrontmatter(input)).toThrow();
  });
});

// ─── Front Matter Field Mapping ──────────────────────────────────────────────

describe("convertFrontmatter", () => {
  it("maps basic fields correctly", () => {
    const toml = {
      title: "My Post",
      description: "A description",
      date: "2023-02-12T21:59:18-08:00",
      draft: false,
      tags: ["ai", "coding"],
    };

    const result = convertFrontmatter(toml, "my-post");
    expect(result.title).toBe("My Post");
    expect(result.description).toBe("A description");
    expect(result.pubDatetime).toBe("2023-02-12T21:59:18-08:00");
    expect(result.draft).toBe(false);
    expect(result.tags).toEqual(["ai", "coding"]);
    expect(result.author).toBe("Ann Catherine Jose");
    expect(result.disqusSlug).toBe("my-post");
  });

  it("maps images[0] to ogImage", () => {
    const toml = {
      title: "Post With Image",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: [],
      images: ["hero.png"],
    };

    const result = convertFrontmatter(toml, "post-with-image");
    expect(result.ogImage).toBe("hero.png");
  });

  it("omits ogImage when images is absent", () => {
    const toml = {
      title: "No Image Post",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: [],
    };

    const result = convertFrontmatter(toml, "no-image-post");
    expect(result.ogImage).toBeUndefined();
  });

  it("omits ogImage when images is empty array", () => {
    const toml = {
      title: "Empty Images",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: [],
      images: [],
    };

    const result = convertFrontmatter(toml, "empty-images");
    expect(result.ogImage).toBeUndefined();
  });

  it("merges topics into tags and deduplicates", () => {
    const toml = {
      title: "Post",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: ["ai", "coding"],
      topics: ["tech-explorations", "ai"],
    };

    const result = convertFrontmatter(toml, "post");
    expect(result.tags).toEqual(["ai", "coding", "tech-explorations"]);
  });

  it("handles topics when tags is empty", () => {
    const toml = {
      title: "Post",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: [],
      topics: ["hugo", "machine-learning"],
    };

    const result = convertFrontmatter(toml, "post");
    expect(result.tags).toEqual(["hugo", "machine-learning"]);
  });

  it("handles empty topics array", () => {
    const toml = {
      title: "Post",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: ["ai"],
      topics: [],
    };

    const result = convertFrontmatter(toml, "post");
    expect(result.tags).toEqual(["ai"]);
  });

  it("preserves draft status", () => {
    const toml = {
      title: "Draft Post",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      draft: true,
      tags: [],
    };

    const result = convertFrontmatter(toml, "draft-post");
    expect(result.draft).toBe(true);
  });

  it("sets disqusSlug from the slug parameter", () => {
    const toml = {
      title: "Post",
      description: "desc",
      date: "2023-01-01T00:00:00-08:00",
      tags: [],
    };

    const result = convertFrontmatter(toml, "my-cool-post");
    expect(result.disqusSlug).toBe("my-cool-post");
  });
});

// ─── Description Generation ──────────────────────────────────────────────────

describe("generateDescription", () => {
  it("generates description from first 160 chars of body", () => {
    const body = "This is a long body text that goes on and on. ".repeat(10);
    const result = generateDescription(body);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toMatch(/\.\.\.$/);
  });

  it("does not add ellipsis if body is short", () => {
    const body = "Short body text.";
    const result = generateDescription(body);
    expect(result).toBe("Short body text.");
    expect(result).not.toMatch(/\.\.\.$/);
  });

  it("strips markdown formatting from generated description", () => {
    const body =
      "This is **bold** and *italic* and [a link](http://example.com) and `code`.";
    const result = generateDescription(body);
    expect(result).not.toContain("**");
    expect(result).not.toContain("*");
    expect(result).not.toContain("[");
    expect(result).not.toContain("`");
  });

  it("skips heading lines", () => {
    const body = "## My Heading\n\nThe actual content starts here.";
    const result = generateDescription(body);
    expect(result).not.toContain("My Heading");
    expect(result).toContain("The actual content starts here.");
  });
});

// ─── Shortcode Conversions ───────────────────────────────────────────────────

describe("convertPureTable", () => {
  it("converts pure_table shortcode to markdown table", () => {
    const input = `{{< pure_table
"Icon size | Icon use"
"16 x 16 | Favicon"
"32 x 32 | Windows"
>}}`;

    const result = convertPureTable(input);
    expect(result).toContain("| Icon size | Icon use |");
    expect(result).toContain("| --- | --- |");
    expect(result).toContain("| 16 x 16 | Favicon |");
    expect(result).toContain("| 32 x 32 | Windows |");
  });

  it("handles extra whitespace in cells", () => {
    const input = `{{< pure_table
"Col A   |  Col B  "
"val 1    |  val 2  "
>}}`;

    const result = convertPureTable(input);
    expect(result).toContain("| Col A | Col B |");
    expect(result).toContain("| val 1 | val 2 |");
  });
});

describe("convertFluidImgs", () => {
  it("converts fluid_imgs to image-grid div with correct column count", () => {
    const input = `{{< fluid_imgs
  "pure-u-1 pure-u-md-1-3|img1.png|Caption 1"
  "pure-u-1 pure-u-md-1-3|img2.png|Caption 2"
  "pure-u-1 pure-u-md-1-3|img3.png|Caption 3"
>}}`;

    const result = convertFluidImgs(input);
    expect(result).toContain('class="image-grid cols-3"');
    expect(result).toContain("![Caption 1](img1.png)");
    expect(result).toContain("![Caption 2](img2.png)");
    expect(result).toContain("![Caption 3](img3.png)");
  });

  it("handles 2-column layout", () => {
    const input = `{{< fluid_imgs
  "pure-u-1 pure-u-md-1-2|img1.png|Caption 1"
  "pure-u-1 pure-u-md-1-2|img2.png|Caption 2"
>}}`;

    const result = convertFluidImgs(input);
    expect(result).toContain('class="image-grid cols-2"');
  });

  it("handles single full-width image", () => {
    const input = `{{< fluid_imgs
  "pure-u-1-1|img1.png|Caption"
>}}`;

    const result = convertFluidImgs(input);
    expect(result).toContain('class="image-grid cols-1"');
    expect(result).toContain("![Caption](img1.png)");
  });
});

describe("convertVideo", () => {
  it("converts video shortcode to HTML5 video tag", () => {
    const input = `{{< video src="my-video" width="200px" height="300px" autoplay="yes">}}`;

    const result = convertVideo(input);
    expect(result).toContain("<video");
    expect(result).toContain('width="200px"');
    expect(result).toContain('height="300px"');
    expect(result).toContain("autoplay");
    expect(result).toContain("my-video");
  });
});

describe("convertShortcodes", () => {
  it("converts all shortcodes in a body", () => {
    const body = `Some text before.

{{< pure_table
"A | B"
"1 | 2"
>}}

Some text between.

{{< fluid_imgs
  "pure-u-1-1|photo.png|Photo"
>}}

More text.`;

    const result = convertShortcodes(body);
    expect(result).not.toContain("{{<");
    expect(result).not.toContain(">}}");
    expect(result).toContain("| A | B |");
    expect(result).toContain("![Photo](photo.png)");
  });
});
