import { describe, it, expect } from "vitest";
import { getTagLabel } from "./tagLabels";

describe("getTagLabel", () => {
  it("returns uppercase for known acronyms", () => {
    expect(getTagLabel("llm")).toBe("LLM");
    expect(getTagLabel("ai")).toBe("AI");
    expect(getTagLabel("rag")).toBe("RAG");
    expect(getTagLabel("tdd")).toBe("TDD");
    expect(getTagLabel("ios")).toBe("iOS");
    expect(getTagLabel("c++")).toBe("C++");
    expect(getTagLabel("graphql")).toBe("GraphQL");
    expect(getTagLabel("chatgpt")).toBe("ChatGPT");
    expect(getTagLabel("next-js")).toBe("Next.js");
  });

  it("auto-title-cases unknown slugs", () => {
    expect(getTagLabel("web")).toBe("Web");
    expect(getTagLabel("personal-growth")).toBe("Personal Growth");
    expect(getTagLabel("career")).toBe("Career");
  });

  it("returns title-cased single words for unknown tags", () => {
    expect(getTagLabel("privacy")).toBe("Privacy");
    expect(getTagLabel("mobile")).toBe("Mobile");
  });
});
