# Session 7: Implementation Phase 4 (Part 2) — Floating TOC Sidebar

**Date:** March 20, 2026
**Agent:** Claude Code (Opus 4.6)
**Duration:** ~1.5 hours
**Tasks completed:** Task 14 (post layout with TOC sidebar), Task 15 skipped by decision

---

## Context

Continuation of Phase 4 (Core Layouts). Task 13 (site identity, OG image) was completed earlier the same day in Session 6. This session focused on Task 14 — adding a floating Table of Contents sidebar to blog posts.

---

## Task 14: Post layout with TOC sidebar

### Exploration and planning

Agent explored the existing PostDetails layout, astro.config.ts (which had `remark-toc` + `remark-collapse` generating an inline TOC), and the CSS architecture. Key discovery: Astro's `render()` already returns a `headings` array — no need for DOM parsing to build the TOC.

Plan mode was used. User asked three questions before approving:

1. **Why filter to h2/h3 only, not h1?** — Because h1 is the post title rendered by the layout. Markdown body headings should start at h2 for proper document hierarchy.
2. **Will heading anchor links still work?** — Yes, `addHeadingLinks()` in PostDetails already adds clickable `#` links to every heading. Untouched by this change.
3. **How will mobile TOC work?** — Collapsible `<details><summary>Table of Contents</summary>` dropdown placed above the article body. Always visible and accessible.

### Implementation

**New file: `src/components/TableOfContents.astro`**
- Accepts `headings` prop from Astro's `render()` result
- Filters to h2 and h3 only; renders nothing if < 3 qualifying headings
- Desktop (`hidden lg:block`): sticky sidebar with "ON THIS PAGE" header, left-border indicator, nested h2/h3 list
- Mobile (`lg:hidden`): collapsible `<details>` dropdown with the same heading list
- IntersectionObserver script highlights the active section in accent color with a left border

**Modified: `src/layouts/PostDetails.astro`**
- Extracts `headings` from `await render(post)` (previously only destructured `Content`)
- Two-column flex layout at `lg+`: article (`flex-1`, `max-w-3xl`) + TOC sidebar (`w-64`) inside a `max-w-6xl` container
- Posts with < 3 headings remain single-column at `max-w-3xl`
- Mobile TOC dropdown placed above article body

**Modified: `astro.config.ts`**
- Removed `remark-toc` and `remark-collapse` plugins (replaced by sidebar TOC component)

**Modified: `src/styles/global.css`**
- Increased `:target` scroll-margin from `1rem` to `5rem` for proper heading offset when jumping via TOC links

**Modified: `src/components/BackButton.astro`**
- Removed `app-layout` class from wrapper div (parent handles layout now)

### Alignment bug: three rounds of fixes

The initial implementation split the layout into two separate containers — the title/date in a narrow `app-layout` (max-w-3xl) container, and the article+TOC in a wider max-w-6xl container. This caused the article content to be left-aligned at a different position than the title.

**Round 1 — Content misaligned with title:** User flagged that the article body started at the left edge of the wider container while the title was centered in the narrow container. Fix: moved the title/date inside the same flex container as the article.

**Round 2 — "Go back" still misaligned:** User flagged that the "Go back" link was still in a separate container. Fix: moved `<BackButton />` inside the main flex container.

**Round 3 — "Go back" had double padding:** BackButton.astro had its own `app-layout` class (which adds `px-4`), inside a parent that already had `px-4`. User asked agent to explain the expected behavior before fixing. Agent articulated the principle: all elements in the content column should share one left edge. Fix: removed `app-layout` from BackButton.astro.

### Task 15: Wider content area — Skipped

User asked for agent's opinion on widening from `max-w-3xl` to `max-w-4xl`. Agent recommended skipping:
- 768px is near optimal line length for readability (~65-75 chars)
- Posts with TOC already use `max-w-6xl` — the sidebar fills the extra space
- Widening content would require widening all other pages for consistency

User agreed and removed Task 15 from the wave-1-plan.

---

## User corrections and decisions

| Moment | What happened |
|--------|--------------|
| Content misalignment | User spotted that article body didn't align with title — two separate containers had different left edges. Agent fixed by unifying into one container. |
| "Go back" misalignment | User spotted that "Go back" was still offset. Agent moved it into the unified container. |
| Double padding on BackButton | User asked agent to explain expected behavior before fixing. Agent articulated the single-left-edge principle, then removed redundant `app-layout` from BackButton. |
| Skip Task 15 | User asked whether widening content area was worth it. Agent recommended against it. User agreed and removed from plan. |

---

## Memory saved this session

None — no new persistent learnings beyond what was already captured.

---

## Files modified

| File | Changes |
|------|---------|
| `src/components/TableOfContents.astro` | New file — dual-mode TOC (desktop sticky sidebar + mobile dropdown) with IntersectionObserver |
| `src/layouts/PostDetails.astro` | Two-column flex layout, TOC integration, BackButton moved inside unified container |
| `src/components/BackButton.astro` | Removed `app-layout` class (parent handles layout) |
| `astro.config.ts` | Removed `remark-toc` and `remark-collapse` plugins |
| `src/styles/global.css` | `:target` scroll-margin increased to `5rem` |
| `docs/redesign/wave-1-plan.md` | Task 14 checked off, Task 15 removed |

---

## Status at end of session

- **Task 14:** Complete. Floating TOC sidebar working on desktop and mobile, verified on prod at `annjose.pages.dev`.
- **Task 15:** Skipped (content width stays at `max-w-3xl`, TOC posts use `max-w-6xl` container).
- **Next task:** Task 16 — Prev/next post navigation (already partially exists in AstroPaper, needs verification/enhancement)
