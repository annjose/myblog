/**
 * Shiki transformer that styles code blocks marked with "callout" in the
 * meta string — accent left border, no line numbers, body font.
 *
 * Usage in markdown:
 *   ```text callout
 *   Content with accent border, no box
 *   ```
 *
 *   ```text callout boxed
 *   Content with accent border + subtle box
 *   ```
 *
 * Adds data-callout (and optionally data-callout-boxed) attributes to the
 * <pre> element so CSS can target it.
 */
export const transformerCallout = () => ({
  name: "callout",
  pre(node) {
    const raw = this.options.meta?.__raw;
    if (raw && raw.includes("callout")) {
      node.properties["data-callout"] = "";
      if (raw.includes("boxed")) {
        node.properties["data-callout-boxed"] = "";
      }
    }
  },
});
