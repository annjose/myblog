+++
date = "2026-03-11T12:13:21-07:00"
draft = false
title = "Site Redesign Log"
description = "The end-to-end process of migrating this site from Hugo to Astro with AI coding agents."
tags = ["ai", "coding-assistants", "agentic-systems", "web-development"]
topics = ["tech-explorations"]
+++

**Started:** March 11, 2026 | **Status:** In progress

I'm redesigning this blog from Hugo to Astro, using AI coding agents (Claude Code, Claude Desktop, Codex) as my primary collaborators. This page documents the real process — the prompts I write, the questions agents ask, the plans they produce, and the decisions I make. If you're curious about what agentic coding looks like in practice, follow along.

**The migration:** Hugo + Blackburn → Astro 5, Tailwind CSS, AstroPaper theme, Cloudflare Pages

**How to read this:** Each part below is a chapter of the redesign. Newest entries are at the top.

---

## Part 1: Write the Spec — Mar 11-12, 2026

**Goal:** Go from "I want to redesign my blog" to a spec that an AI agent can execute against.

**Output Artifacts**
* [The Spec](https://github.com/annjose/myblog/blob/main/docs/redesign/spec.md)
* [Agent Session Transcript #1 — Spec Creation](https://github.com/annjose/myblog/blob/main/docs/redesign/sessions/session-01-spec-creation.md)

### Day 1 — Picking a template (Mar 11)

I started by browsing Astro themes on [astro.build/themes](https://astro.build/themes/) and [Vercel's Astro templates](https://vercel.com/templates?framework=astro). I looked at a bunch of them, evaluating for clean design, readability, and that hard-to-name quality of *feeling right*.

The one I kept coming back to was [AstroPaper](https://astro-paper.pages.dev/) — clean layout, good typography, nice page transition animations, and not over-designed. It felt like a solid foundation I could build on rather than fight against.

Then I did something deliberately low-tech: **I wrote the spec by hand, in a notebook.** No AI, no editor. Just thinking through what I actually want from the new site. Here's the digitized version of those notes:

<details>
<summary><strong>The handwritten spec (digitized)</strong></summary>

Redesign my blog and personal website annjose.com. It is currently built with Hugo and an old theme called `blackburn`. Content lives in a GitHub repo; static pages are hosted on GitHub Pages. Here's what I want:

- **Tech stack:** Astro, Tailwind CSS, with a good theme (leaning toward AstroPaper)
- **Design:** Clean UI with enough whitespace but not wasted space. Beautiful colors and fonts. Mobile responsive. Light and dark mode.
- **Custom routes** for pages I want to host on the domain — e.g. /books, /notes, /photos
- **About Me** page
- **Projects page** to showcase what I've worked on (liked the layout at adamfortuna.com/projects as inspiration, but don't want to copy it)
- **Blog features:**
  - Good syntax highlighting (lots of technical content)
  - Floating table of contents on the right that follows scroll and highlights current section
  - Tags, tag management, possibly a tag cloud
  - Next/previous post links with titles
  - OG images for every post
  - A comment system that blocks spam but isn't ad-heavy like Disqus — could I build my own with something like InstantDB and email-based auth?
- **Future (post-launch):** Some authenticated routes accessible only to family. URL-based access with generated GUIDs for sharing private pages.

</details>

### Day 2 — The spec meets Claude (Mar 12)

I opened Claude Desktop and gave it the handwritten spec with one instruction: *"Review these requirements and tell me what you make of it. Ask clarifying questions."*

Claude did something I didn't expect — before asking anything, it **explored the entire codebase and live site on its own**. It spawned two agents in parallel: one crawled the repo structure, the other fetched annjose.com and the AstroPaper demo. Only after building its own understanding did it come back with questions.

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

**What I learned:** Don't start with the AI. Start with your own thinking — even on paper. The handwritten spec forced me to decide what I *actually* want before an agent started suggesting things. The AI's job was to pressure-test it and add structure, not to dream it up from scratch. Also: the agent's first move was to *explore*, not ask. It built context before engaging. That's a good pattern for humans too.

---

*Next up: reviewing the 8-phase plan, adjusting it, and kicking off the migration script.*
