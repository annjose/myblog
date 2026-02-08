+++
title = "Agentic Coding In Practice"
description = "How I build features with AI agents after two years of agentic coding"
date = "2026-02-07T16:23:08-07:00"
draft = false
topics = ["tech-explorations", "AI"]
tags = ["AI", "llm", "coding-assistants"]
images = ["hero.png"]
+++

In the [last post](/post/agentic-coding-basics/), I explained the basic concepts of agentic coding - the terminology, the constructs, when to use what. It was mostly theoretical. This post is the practical follow-up that describes how I actually build features with AI agents day to day.

I hesitate to call these 'best practices' because in this fast moving space, it just means 'what someone discovered last week'. So, think of this as a field report: here's what works for me today, and why.

### How I got here

My coding workflow has evolved over the last two years - from chatting with Claude in a browser window to running agents that write, test and deploy code with minimal hand-holding.

It happened across a series of projects, each one pushing me a little further:

- **[KeepSeek](https://keep-seek.vercel.app/login)** - I wrote most of the code 
  myself. Used Claude in the browser to troubleshoot issues and tweak UI. Mostly 
  manual.
- **[Daily Bits](https://ann-dailybits.netlify.app/)** - Built with Astro using 
  a template. Started doing chat-style coding for some features.
- **BeastMode** - A fitness tracker I built for myself through Copilot AI in VS Code - mostly 'ask' mode, some features in agent mode, but always in the IDE.
- **[Pomodoro Flow](https://my-pomodoro-flow.netlify.app/)** - First fully 
  vibe-coded app that gives a pomodoro timer app. Prompt, accept, iterate.
- **Travelogue** - A private app for 15 friends from a trek in the Himalayas. 
  Low stakes, so I let AI take the driver's seat. I was the coach, not the coder. This was a turning point for me.
- **[HN Companion](https://app.hncompanion.com/)** - Steady-state agentic coding. We learned and applied most of the best practices shared here - planned every big feature, tracked tasks in [Linear](https://linear.app/), steered the AI efficiently, and reviewed the code along the way.

### Lessons along the way

Across these projects, I've made mistakes, over-trusted the AI, under-trusted it, and slowly found a rhythm that balances shipping speed with code quality. Here's how my thinking changed:

{{< pure_table

"I used to... | Now I..."

"Read every line of AI-generated code | Do targeted review of the parts that matter"
"Use the biggest model for everything | Match the model to the task - Opus for features, Sonnet for fixes, I do the trivial stuff myself"
"Give vague instructions like 'build this feature' | State the goal, constraints and what 'done' looks like"
"Let the agent hold the plan in its head | Make it write the plan to a file I can review and resume from"
"Start coding immediately | Start with a spec and plan mode"
"Paste screenshots for UI issues | Give it the HTML instead (cheaper, faster)"
"Work with one agent at a time | Run multiple agents on the same feature and have them review each other"
"End sessions abruptly | Ask the agent to update AGENTS.md before closing"

>}}

### Context, context, context
One thing ties all of these shifts together: in agentic mode, the LLM's context 
window fills up fast. Bigger context means higher cost, slower responses and worse 
output. Most of the workflow below comes back to this - keep the context small, 
the instructions clear, and the tools simple. Here's how I do it.

One more thing: AI agents are a huge productivity boost, but if you give 
them free rein and turn off your brain, they become massive slop machines. 
As Armin Ronacher [puts it](https://lucumr.pocoo.org/2025/7/30/things-that-didnt-work/),

> it encourages mental disengagement - when you stop thinking like an engineer, 
quality drops, time gets wasted and you don't understand and learn.

If you want to understand what's actually happening under the hood - how the agent loop works, 
how context evolves during a session, and why this matters - George Chiramattel 
has an excellent technical breakdown that complements what I'm describing here. 
See [Mental Models for Working with Coding Agents](https://george.chiramattel.com/blog/mental-models-for-working-with-coding-agents).

### Step 1: Start with a solid AGENTS.md

This is the document that tells the agent everything it needs to know about 
your project - tech stack, coding conventions, how to run tests, what to 
avoid. Think of it as the onboarding doc you'd give a new engineer joining 
your team.

Most tools have their own version - CLAUDE.md, CODEX.md. I keep a single 
AGENTS.md and have the tool-specific files reference it. One source of truth.

What goes in mine: project overview and architecture, build/test/run commands, 
coding conventions, pointers to other docs (eg: "For Summary panel UI spec, see docs/summary-panel-spec.md"), and common mistakes the agent has made before.

That last one is key. Every time the agent makes a mistake that's likely to 
recur - say, the rendering of unicode characters in iOS browsers - I ask it to add 
a note to AGENTS.md before closing the session. The file gets smarter over 
time.

A good test: start a fresh session and say "read @AGENTS.md and tell me what 
you understand about this project." If the summary is wrong, your file needs work.

### Step 2: Decide your approach

Not every task needs the same model or the same level of agent involvement. 
Before I open an agent, I think about the task for a minute.

- **New feature with real complexity** - Opus, Codex or a comparable frontier model, 
in plan mode. 

- **Smaller feature or well-defined change** - Sonnet, Gemini, or GPT-4.1 in Copilot. I also tried the open weights model [qwen3-coder-next model](https://ollama.com/library/qwen3-coder-next) through [OpenCode](https://opencode.ai/). It worked well for the first try.

- **Bug fix or trivial edit** - GitHub Copilot in VS Code and autocomplete, or just type it myself. Joy of Coding!

I used to use Opus for everything, including things a lighter model handles 
fine. That burns credits fast without better results. Matching model to task 
is the easiest way to manage cost and context.

For big features or refactors, I sometimes run two agents on the same task 
using git worktrees and have them review each other's output. We used this 
when redesigning the summary panel in HN Companion - it caught things a 
single pass would have missed. But it's tedious, so I save it for work that 
justifies the effort.

### Step 3: Plan with the agent

For anything non-trivial - a big feature, an unfamiliar part of the codebase - I start in plan mode. I tell the agent what I want 
to build and ask it to come up with a plan - not code. This is the most 
important step and the one I skipped for too long.

Agents are bad at keeping track of a multi-step plan in their context. So I 
run the agent in 'plan mode' and at the end of it,
ask it to write the plan to a file **PLAN.md** in the repo. 
Now I can review it, edit it manually, or ask the agent to revise it. As 
implementation progresses, the agent updates the plan. If I hit my credit 
limit mid-session, I can come back later and say "read plan.md and resume 
from the next step." No context lost.

One thing that surprised me: talking to the agent through voice mode produces 
better plans than typing. You naturally share more context about what you 
want when you're speaking - the constraints, the edge cases, the "oh and 
also" details that you'd skip when typing because it feels like too much 
effort.

This is also where context management matters most. Early on, for any UI 
issue, I'd take a screenshot and give it to the agent. That burns through 
tokens fast. I learned from Armin Ronacher's 
[agentic coding recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/) 
that we should optimize for smaller context and avoid screenshots if possible. So I started giving the agent the HTML instead, which is cheaper and maybe more useful in some contexts.

Be specific about what "done" looks like. Instead of "build a settings page," 
say "current state: no user preferences. Desired state: a settings page 
where users can toggle dark mode and set notification frequency. Mobile 
responsive. Use the existing design system components." The clearer the 
success criteria, the better the agent can verify its own work.

### Step 4: Implement

Once the plan looks right, I ask the agent to execute it. Nothing fancy - just "implement step 1 from the plan."

The main discipline is committing code between steps. If step 3 of 5 goes 
sideways, I want to roll back to the end of step 2, not start over. Git is 
your safety net, use it often.

For bigger features, I sometimes run multiple agents in parallel. Two agents 
implement the same feature on separate git worktrees, then I ask each to 
review the other's work. This sounds excessive, but it catches architectural 
differences and edge cases that a single agent misses. We used this approach 
for the HN Companion redesign and it was worth the extra effort. For everyday 
features, a single agent is fine.

### Step 5: Test

This is my weakest area - I'll be honest. I haven't built a full test harness 
into my agentic workflow yet. But here's what I want to try:

**Unit tests** - Ask the agent to write tests for the code it just produced. 
It's decent at this, especially when the success criteria from the plan are 
clear. The thing to watch for: agents will sometimes write tests that pass 
by definition - asserting what the code does rather than what it should do. 
Review the tests, not just whether they pass.

**Visual testing** - For UI work, use the Claude Chrome extension to ask 
questions directly in the browser's developer tools. Take a screenshot, 
paste it in, ask "does this match the design I described?"

**Security review** - Use a subagent with a focused 
role for sensitive code. Something like: "You are a senior security engineer. Review this code 
for injection vulnerabilities, auth flaws, secrets in code, and insecure 
data handling. Give specific line references." Isolating this into a 
subagent keeps it out of the main session's context.

I want to try [Playwright MCP](https://github.com/microsoft/playwright-mcp) 
for browser automation but haven't got there yet. If you've set this up, 
I'd love to hear how it went.


### Step 6: Close the session properly

This is a small habit that pays off over time. Before I end a session, I ask 
the agent to do two things:

1. **Update the plan** - mark what's done, note what's remaining, flag 
   anything that came up during implementation.
2. **Update AGENTS.md** - if we hit a recurring issue or discovered a 
   pattern, add it. For example, when we figured out the fix for unicode 
   rendering on iOS, I had the agent add that to AGENTS.md so neither of 
   us would have to debug it again.

This turns every session into a small investment in the next one. The 
project docs get better with each cycle, and the agent starts with more 
context next time instead of starting from zero.

### What's next

This workflow is a snapshot - it'll probably look different in six months. 
The tools are getting better fast, and I'm still figuring out pieces of it, 
especially around testing and multi-agent orchestration.

The biggest shift for me hasn't been about speed, though that's real. It's 
that I now attempt things I wouldn't have started before because they seemed 
not worth the time. Build it in a couple of hours, see if it resonates, 
move on. That changes what you're willing to try.

While my workflow still centers on steering agents through code, some teams 
are pushing much further. [StrongDM](https://factory.strongdm.ai/)'s AI team built what they call a 
"Software Factory" - non-interactive development where specs and scenarios 
drive agents that write code, run test harnesses, and converge without 
human review.

For a glimpse of where this is heading, look at their 
[Attractor repo](https://github.com/strongdm/attractor) - 2000 lines of 
pure spec, no code, that generates a unified LLM API. Spec is the product, 
code is the byproduct. I'm not there yet, but it's a clear signal of a potential future.

If you're doing agentic coding, I'd love to compare notes - what's working 
for you, what isn't. This space moves fast enough that we all have something 
to teach each other.

### References and further reading

These are the articles that shaped my thinking. All from practitioners, 
all worth your time.

- [Agentic Coding Recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/) 
  - Armin Ronacher. The most practical piece I've read. Covers tool design, 
  language choice, and why stable ecosystems matter for agents.
- [Agentic Coding Things That Didn't Work](https://lucumr.pocoo.org/2025/7/30/things-that-didnt-work/) 
  - Armin Ronacher again. Equally valuable for what to avoid.
- [My LLM Coding Workflow Going Into 2026](https://addyosmani.com/blog/ai-coding-workflow/) 
  - Addy Osmani. Detailed workflow covering iterative development, context 
  management and testing.
- [The 80% Problem in Agentic Coding](https://addyo.substack.com/p/the-80-problem-in-agentic-coding) 
  - Addy Osmani. Honest look at the tradeoffs - more output, but more 
  review overhead too.
- [Claude Code: Best Practices for Agentic Coding](https://www.anthropic.com/engineering/claude-code-best-practices) 
  - Anthropic's official guide. The CLAUDE.md as a living document idea 
  came from here.
- [Mental Models for Working with Coding Agents](https://george.chiramattel.com/blog/mental-models-for-working-with-coding-agents)
   - George Chiramattel. How coding agents work under the hood - the loop, context evolution, and harness design.
- [Spec-Driven Development](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) 
  - Thoughtworks. Good framing of where specs fit in the agentic workflow.
- [How StrongDM's AI Team Builds Software Without Looking at the Code](https://simonwillison.net/2026/Feb/7/software-factory/) 
  - Simon Willison's write-up on the spec-only approach. The extreme end 
  of where this is heading.
- [Agentic Coding from First Principles](https://matsen.fhcrc.org/general/2025/10/30/agentic-coding-principles.html) 
  - Practical advice on CLAUDE.md, subagents, and context management.
- [Agentic Engineering](https://addyosmani.com/blog/agentic-engineering/) 
  - Addy Osmani on why the distinction between vibe coding and disciplined 
  agentic work matters.

---

![](hero.png)