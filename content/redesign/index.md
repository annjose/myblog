+++
date = "2026-03-11T12:13:21-07:00"
draft = false
title = "Rebuilding this site, with AI agents"
description = "The real process of rebuilding this site, documented as it happens"
tags = ["ai", "coding-assistants", "agentic-systems", "web-development"]
topics = ["tech-explorations"]
+++

**Started:** March 11, 2026 | **Status:** In progress

I'm redesigning this blog from Hugo to Astro, using AI coding agents (Claude Code, Claude Desktop, Codex) as my primary collaborators. This page documents the real process — the prompts I write, the questions agents ask, the plans they produce, and the decisions I make. If you're curious about what agentic coding looks like in practice, follow along.

**The migration:** Hugo + Blackburn → Astro 5, Tailwind CSS, AstroPaper theme, Cloudflare Pages

{{< figure src="current-hugo-homepage.png" caption="The current site — Reflections on Hugo + Blackburn" width="600" >}}

**How to read this:** Each part below is a chapter of the redesign. Newest entries are at the top.

--- 

## Running Notes - Lessons learned (WIP)
1. Ask what am I missing when reviewing any spec or plan? This puts the agent in exploratory mode and it can go broad and surface important insights
2. Ask what could go wrong and incorporate a plan to mitigate or handle such errors
3. If you are working with newer frameworks or critical components, give the link to specific pages in the the framework's documentation to the agent and ask it to read the page and confirm that the plan takes it into account and follows the recommendations from the framework. Example, when I use InstantDB, I give the instand db's auth documenations. Or Astro collections https://docs.astro.build/en/guides/content-collections/

---
## Part 2: Refine the Spec — Mar 13, 2026

**Goal:** Reconcile two competing specs into one unified spec ready for implementation.

**Output Artifact:**
- Unified spec and Wave 1 plan (in progress)
- [Agent Session Transcript #2 — Spec Refinement (WIP)](https://github.com/annjose/myblog/blob/master/docs/redesign/sessions/session-02-spec-refinement.md)

### Two specs, one project

I now had two specs for the same migration - both generated from the same handwritten prompt. 
The first one I created from Part 1 - I call it the **Collaborative Spec** because it was built through multiple rounds of conversation with Claude Desktop, where I could push back, ask "what am I missing?", and refine as we went. 
The second one is **Superpowers Spec** which came from [Superpowers](https://claude.com/plugins/superpowers), a Claude Code plugin that provides a structured workflow for writing specs, plans, and implementation. Superpowers took the same handwritten prompt I started with and generated both a spec and plan in a single pass using Sonnet 4.6.

- [Collaborative Spec](https://github.com/annjose/myblog/blob/master/docs/redesign/spec.md) (from Part 1)
- [Superpowers Spec](https://github.com/annjose/myblog/blob/master/docs/redesign/superpowers-spec.md)
- [Superpowers Plan](https://github.com/annjose/myblog/blob/master/docs/redesign/superpowers-plan-phase1.md)

### Comparing the two specs

I read through both in detail. They're mostly aligned on the big picture, but diverge in interesting ways:

{{< pure_table
  "Aspect|Collaborative Spec|Superpowers Spec"
  "Document structure|Spec + plan in one document|Separate spec and plan documents"
  "Design specifics (fonts, colors, syntax themes)|Deferred — decide during implementation|✅ Specified upfront (less ambiguity)"
  "Plan detail level|High-level steps|✅ Code snippets, commit messages, bash scripts (more actionable)"
  "Astro version|✅ Start on Astro 5, upgrade to 6 before launch (safe since v6 is brand new)|Astro 6 directly"
  "Repo strategy|✅ Branch-based coexistence (old site stays live) (lower risk)|In-place migration"
  "Testing approach|Added tests during review rounds|✅ Test-first (write failing test, then implement) (more disciplined)"
  "Gap coverage (MathJax, RSS, Counterscale, etc.)|✅ Discovered through conversation (conversation surfaces gaps)|Missing"
  "Process|✅ Multi-round back-and-forth (room for exploration)|One-shot generation"
  "Code generation|Requires a bigger model to fill in the details|✅ Can be implemented using a smaller model like Haiku (faster, cheaper)"
>}}

The pattern is clear: Superpowers is better at *detail and structure*, the Collaborative Spec is better at *coverage and risk management*. The one-shot approach produces a more actionable plan, but misses things you'd only catch through discussion — like MathJax in two posts, RSS feed continuity, or the fact that the site uses Counterscale instead of Google Analytics.

I think there's real value in keeping things open-ended early on so there's room for exploration and discovery, instead of narrowing to a specific path before you've asked enough questions.

### Next: cross-evaluation with multiple agents

I'm going to give both specs to two more agents — Codex CLI and Claude Code — and ask each to evaluate both specs for pros, cons, and what's missing. Even though both specs were in essence made by Claude, the prompts and workflows were different. Will they find differences I didn't? This should help me reconcile the two into a single unified spec.

---

## Part 1: Write the Spec — Mar 11-12, 2026

**Goal:** Go from "I want to redesign my blog" to a spec that an AI agent can execute against.

**Output Artifacts**
* [The Spec](https://github.com/annjose/myblog/blob/master/docs/redesign/spec.md)
* [Agent Session Transcript #1 — Spec Creation](https://github.com/annjose/myblog/blob/master/docs/redesign/sessions/session-01-spec-creation.md)

### Day 1 — Picking a template (Mar 11)

I started by browsing Astro themes on [astro.build/themes](https://astro.build/themes/) and [Vercel's Astro templates](https://vercel.com/templates?framework=astro). I looked at a bunch of them, evaluating for clean design, readability, and that hard-to-name quality of *feeling right*.

The one I kept coming back to was [AstroPaper](https://astro-paper.pages.dev/) — clean layout, good typography, nice page transition animations, and not over-designed. It felt like a solid foundation I could build on rather than fight against.

Then I did something deliberately low-tech: **I wrote the spec by hand, in a notebook.** No AI, no editor. Just thinking through what I actually want from the new site.

{{< figure src="hand-written-spec.jpg" caption="The handwritten spec" width="500" >}}

<details>
<summary>Digitized version of the handwritten spec (click to view)</summary>

**Blog redesign** — https://annjose.com, currently Hugo with an old theme. Change to Astro with a good modern theme.

The things I want:
- Clean UI - sufficient (not a lot of) whitespace on either side
- Light and dark mode with beautiful subtle colors
- Good font
- Blog pages should have next/prev with post title
- Table of contents on the right - highlights as I scroll down
- Tags: easy to manage, displayed in every post
- A tag cloud (either in every page or in a good place)
- Links for headings
- Collections of related posts and show them as easy-to-access links (eg: agentic coding, on-device AI)
- Personal page: About Me
- Projects page - various projects I worked on, links, what I learned, tools used
- Comments: easy to add comments, reactions. Giscus/Bluesky/ATproto? Auto-generated?
- Image for every post - either a specific image in the post or auto-generated
- Mobile responsive

</details>

### Day 2 — The spec meets Claude (Mar 12)

I opened Claude Desktop, modified the handwritten prompt to add a few details on tech stack and gave it as follows:

> Redesign my blog and personal website https://annjose.com. Use Claude Chrome extension to navigate to the site and understand what is there. It is built using Hugo and an old theme named blackburn. The content is in a github repo, the current folder myblog is the local working directory of this repo. The static pages generated by Hugo are hosted on GitHub pages. Here is what I want in the renewed system:
> * Tech stack: Astro 6.0, Tailwind CSS, with a good theme.
> * One of themes I liked is Astro Paper https://vercel.com/templates/blog/astro-paper. See live demo at https://astro-paper.pages.dev/
> * clean UI with enough whitespace, but not a lot of empty space on both sides of the page
> * beautiful colors and fonts
> * mobile responsive. light and dark mode
> * custom routes for any page(s) that i want to host on the domain, eg: https://annjose.com/books, notes, photos etc.
> * About Me page
> * Projects page where I can list all the projects that I have worked on. this is a good example adamfortuna.com/projects, but it is very slow to render. I like the visual layout, but want to be not copy cat.
> * For the blog posts, I want (in addition to the new standard features of blogs):
>    * a good syntax highlighting as many of the content i write is technical posts
>    * table of contents on the right side - as i scroll down the page, the TOC should also float down with the respective sections highlighted.
>    * add tags, manage task, perhaps a tag cloud
>    * each post should have next and previous links with the title of those posts
>    * OG image for every post - either an image from the post itself
>    * a good comment system that restricts spam, but not a ad-heavy vendor like discus. can it be built myself with an instant db like setup with email-based auth?
>    * after the first phase, i also want a few routes to be authenticated and accessible only to a few people (me and my close family). i want some URLs to be accessible with a guid that i can generate and give to people. only those who have that guid-based url can view the page
>
> Review these requirements and tell me what you make of it. ask clarifying questions

Claude did something I didn't expect — before asking anything, it **explored the entire codebase and live site on its own**. It spawned two agents in parallel: one crawled the repo structure, the other fetched annjose.com and the AstroPaper demo. Only after building its own understanding did it come back with questions.

{{< figure src="claude-session-start.png" caption="Claude Desktop — the spec creation session" width="700" >}}

It asked two rounds of clarifying questions — here are the key decisions that came out of that exchange:

{{< pure_table
  "Decision|What I chose"
  "Fork Astro Paper or build from scratch?|Fork and customize"
  "Hosting platform|Cloudflare Pages"
  "Existing Disqus comments|Static HTML embed (export old, Giscus for new)"
  "Migrate all 58 posts?|Yes, all of them"
  "Private routes / auth|Defer to Phase 2"
  "Projects page format|Side projects & open source, card grid layout"
>}}

The result: an **8-phase migration plan spanning ~14 days**. The critical path is a content migration script that converts all 58 posts from Hugo format (TOML front matter, Hugo shortcodes) to Astro format (YAML front matter, MDX). Everything else builds on that.

See the [first version of the spec](https://github.com/annjose/myblog/blob/f27bd1d/docs/redesign/spec.md).

**Reviewing and refining the spec**

The initial spec was solid but needed pressure-testing. I reviewed it and came back with 7 questions covering scope, naming, URLs, deployment strategy, Astro 6 compatibility, and gaps. This kicked off two more rounds of back-and-forth that significantly shaped the final spec.

Key refinements from the review:

- **Scope split**: Moved the Projects page and Auth to "Wave 2" (post-launch enhancements), keeping Wave 1 focused on the core site, blog migration, and deployment. Also renamed "Phase 2" (which was overloaded — used for both implementation phases and deferred features) to "Wave 1" vs "Wave 2" to avoid ambiguity.
- **URL migration strategy**: New posts live at `/blog/<slug>/` instead of Hugo's `/post/<slug>/`. Old URLs preserved via Cloudflare `_redirects` with 301 redirects — no broken links.
- **Coexistence plan**: The old Hugo site stays live at annjose.com while the new Astro site is tested at `annjose.pages.dev`. DNS cutover happens only when the new site is fully validated.
- **Astro version**: AstroPaper hasn't been updated for Astro 6 yet, so we start on Astro 5 and upgrade before launch (Phase 7 in the plan).
- **Repo strategy**: I almost let the agent create a new repo, but caught it — that would lose all git history. Instead, we're using an `astro` branch in the same repo, with a repo rename (`myblog` → `annjose.com`) and branch rename (`master` → `main`) at cutover.

The agent also ran a gap analysis and found several things neither of us had mentioned:

- **MathJax → KaTeX migration** (2 posts use math expressions)
- **Git submodule cleanup** (`public/` and theme submodules need removal on the astro branch)
- **Missing from Wave 1 overview**: RSS feed, page migration (/about, /ammachi, /epsilla, /redesign)
- **Analytics**: The spec mentioned Google Analytics, but the site actually uses Counterscale (self-hosted on Cloudflare Workers). Fixed throughout.
- **Automated tests**: Added Playwright e2e tests, Lighthouse CI, and a link checker — none of which were in the original spec.

{{< figure src="claude-start-missing-gaps.png" caption="Claude finding gaps in the spec" width="700" >}}

The final spec has 10 decisions, 8 implementation phases across ~14 days, a full folder structure reference, and a verification checklist. See the [full diff of the spec refinements](https://github.com/annjose/myblog/commit/7bbc49a57258708accd8022136e5116786e1972b) and the [final version of the spec](https://github.com/annjose/myblog/blob/master/docs/redesign/spec.md).

#### What I learned
Don't start with the AI. Start with your own thinking — even on paper. The handwritten spec forced me to decide what I *actually* want before an agent started suggesting things. The AI's job was to pressure-test it and add structure, not to dream it up from scratch. Also: the agent's first move was to *explore*, not ask. It built context before engaging. That's a good pattern for humans too.

The review rounds taught me something else: **read the spec like a skeptic, not an approver.** The agent produced a thorough plan, but it had a "new repo" default that would have lost git history, wrong analytics (GA instead of Counterscale), and naming collisions I only caught by reading carefully. The AI is good at structure and completeness; the human is good at catching things that *feel wrong*.

---

*Next up: kicking off the migration script and scaffolding the Astro project.*
