Continue the Hugo-to-Astro migration for my blog. The source of truth is @docs/redesign/spec.md and the task list is @docs/redesign/wave-1-plan.md.

## What's done
- **Phases 1-3** complete (bootstrap, content migration, visual design)
- **Phase 4** complete:
  - Task 13: Site identity, OG image, theme-color, og:type
  - Task 14: Floating TOC sidebar (desktop sticky + mobile dropdown, IntersectionObserver highlighting)
  - Task 15: Skipped (content width stays at max-w-3xl; posts with TOC use max-w-6xl container)

## What's next
Start with **Task 16: Prev/next post navigation** (Phase 5: Blog Components). Note: AstroPaper already has prev/next in the current PostDetails.astro — check if it meets the spec before building from scratch.

Then continue through Phase 5 tasks: Task 17 (tag cloud), Task 18 (comments), Task 19 (code block enhancements), Task 20 (search/Pagefind), Task 21 (KaTeX math), Task 22 (image optimization), Task 23 (image grid CSS), Task 24 (reading time).

## Workflow for each task
1. Do the work
2. Run `pnpm run build` to verify — do NOT skip this
3. Summarize what you did
4. Explain how I can verify it (dev server, specific pages to check, light/dark mode, mobile)
5. Wait for my confirmation before moving on
6. Update `docs/redesign/wave-1-plan.md` — check off completed items
7. Propose a commit message in this format: `<What was done> (Task N, Phase P: Phase Name)` with bullet details underneath. No co-authored-by line.

## Important context
* The dev server is configured in `.claude/launch.json` as `astro-dev` on port 4321
* The site uses Astro 5 + AstroPaper theme with Tailwind CSS v4
* Dark mode uses `data-theme` attribute, not class-based — see `@custom-variant dark` in CSS
* Fonts load via Astro's experimental fonts API (`<Font>` component in `Layout.astro`)
* Colors are CSS custom properties in `src/styles/global.css`, mapped through `@theme inline`
* `SITE.website` is temporarily set to `https://annjose.pages.dev/` — will be reverted in Task 40
* Counterscale analytics deferred to Task 40 (pre-cutover)
* Task 27 (URL rename `/posts/` → `/blog/`) was already completed in Phase 2
* Task 12 (code block enhancements — line wrapping, line numbers) was completed in Phase 3
* `remark-toc` and `remark-collapse` were removed from `astro.config.ts` in Task 14 (replaced by sidebar TOC component)
* BackButton.astro no longer has `app-layout` class — parent context handles layout
* The TOC only renders on posts with 3+ h2/h3 headings; posts without it stay single-column at `max-w-3xl`
