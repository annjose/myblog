---
title: "Content Sample"
description: "A sample post covering all content patterns used to verify template and rendering changes."
pubDatetime: 2026-03-30T10:00:00.000Z
modDatetime: 2026-03-30T17:00:00.000Z
slug: "content-sample"
featured: false
draft: true
tags:
  - "astro"
  - "markdown"
  - "testing"
author: "Ann Catherine Jose"
ogImage: "../../assets/images/ann-color-sketch-square.png"
canonicalURL: "https://annjose.com/blog/content-sample/"
hideEditPost: false
timezone: "America/Los_Angeles"
---

This post is a sample page for validating template, markdown, and content-pipeline changes.  
Internal file name can change over time, while public URL remains stable via frontmatter `slug`.

## Headings And Text Styles

### Emphasis

Regular text, **bold text**, *italic text*, and inline `code`.

### Links

- Internal link: [/about](/about/)
- Internal blog link: [/blog/math-symbols-test/](/blog/math-symbols-test/)
- External link: [Astro Docs](https://docs.astro.build/)

### Blockquote

> Good fixtures are boring in purpose and excellent in coverage.

## Lists

- Unordered item one
- Unordered item two
  - Nested item A
  - Nested item B

1. Ordered item one
2. Ordered item two
3. Ordered item three

## Table

| Area | Example | Expected |
| --- | --- | --- |
| Markdown | Heading/list/table | Renders with typography styles |
| Math | Inline and block equations | MathJax SVG output |
| Code | TypeScript and diff blocks | Shiki highlighting + copy button |

## Code Blocks

```ts file="src/examples/fixture.ts"
type Theme = "light" | "dark";

export function nextTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}
```

```diff
- const isReady = false;
+ const isReady = true;
```

```ts file="src/examples/shiki-notation-fixture.ts"
const oldTheme = "light"; // [!code --]
const newTheme = "dark"; // [!code ++]
const selectedTheme = "dark"; // [!code highlight]
const uiTheme = selectedTheme; // [!code word:selectedTheme]
```

```text callout
Callout style block: accent border, no line numbers, body-font content.
```

```text callout boxed
Boxed callout style block: accent border with subtle background and border.
```

## Math

Inline math: $a \ne 0$, $e^{i\pi} + 1 = 0$.

Display math:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## Inline HTML

<details>
  <summary>Click to expand test details</summary>
  <p>This verifies inline HTML passthrough in markdown content.</p>
</details>

<figure>
  <img src="/img/jones-trail.jpg" alt="Figure test image from public directory" />
  <figcaption>Figure + figcaption rendering test.</figcaption>
</figure>

<video controls width="100%" preload="metadata">
  <source src="/media/piano-practice-perfect-song.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Image

![Image from src/assets](@/assets/images/ann-color-sketch-square.png)

![Image from public/img](/img/jones-trail.jpg)

## Frontmatter Fixture

This page intentionally includes optional frontmatter keys used in AstroPaper demos:
`modDatetime`, `featured`, `ogImage`, `canonicalURL`, `hideEditPost`, and `timezone`.
Use this to catch regressions in schema parsing and layout metadata handling.

```yaml file="frontmatter-sample.yaml"
title: "Content Sample Example"
description: "Comprehensive markdown content sample."
pubDatetime: 2026-03-30T10:00:00.000Z
modDatetime: 2026-03-30T17:00:00.000Z
slug: "content-sample-example"
featured: false
draft: false
tags: ["astro", "markdown", "testing"]
ogImage: "../../../assets/images/ann-color-sketch-square.png"
canonicalURL: "https://annjose.com/blog/content-sample/"
hideEditPost: false
timezone: "America/Los_Angeles"
```

## Checklist

- [x] Markdown coverage
- [x] Math coverage
- [x] Code and callout coverage
- [x] Media coverage
