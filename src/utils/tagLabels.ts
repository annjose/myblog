/** Custom display labels for tag slugs.
 *  If a tag isn't listed here, it gets auto-title-cased. */
const TAG_LABELS: Record<string, string> = {
  ai: "AI",
  llm: "LLM",
  rag: "RAG",
  tdd: "TDD",
  ios: "iOS",
  "c++": "C++",
  graphql: "GraphQL",
  chatgpt: "ChatGPT",
  "next-js": "Next.js",
  "how-to": "How-To",
  "edge-ai": "Edge AI",
  "on-device-ai": "On-Device AI",
  "agentic-coding": "Agentic Coding",
};

/** Convert a slug like "personal-growth" to "Personal Growth" */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Get the display label for a tag slug. */
export function getTagLabel(slug: string): string {
  return TAG_LABELS[slug] ?? titleCase(slug);
}
