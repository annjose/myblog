import { describe, expect, it } from "vitest";
import { getPath } from "./getPath";

describe("getPath", () => {
  it("uses folder name as default slug for page bundles", () => {
    const path = getPath(
      "math-latex-test",
      "src/content/blog/math-latex-test/index.md",
      false
    );

    expect(path).toBe("/math-latex-test");
  });

  it("uses frontmatter slug override for page bundles", () => {
    const path = getPath(
      "test-math-latex",
      "src/content/blog/math-latex-test/index.md",
      false
    );

    expect(path).toBe("/test-math-latex");
  });

  it("preserves parent directories while overriding final slug segment", () => {
    const path = getPath(
      "short-public-url",
      "src/content/blog/deep/internal-name/index.md",
      false
    );

    expect(path).toBe("/deep/short-public-url");
  });
});
