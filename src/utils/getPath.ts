import { slugifyStr } from "./slugify";

const BLOG_PATH = "src/content/blog";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/blog` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  const pathSegments =
    filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)) ?? []; // slugify each segment path

  const basePath = includeBase ? "/blog" : "";

  // Astro content `id` can come from file path (default) or from frontmatter `slug`.
  // Keep folder-name routes as default, but let frontmatter `slug` override final segment.
  const idSegments = id
    .split("/")
    .filter(segment => segment !== "")
    .map(segment => slugifyStr(segment));

  if (idSegments.length < 1) {
    return basePath || "/";
  }

  // If no directory context is available, rely entirely on id segments.
  if (pathSegments.length < 1) {
    return [basePath, ...idSegments].join("/");
  }

  // Nested custom slugs (e.g. "ai/math/test") should be used as-is.
  if (idSegments.length > 1) {
    return [basePath, ...idSegments].join("/");
  }

  const idSlug = idSegments[0];
  const defaultSlug = pathSegments[pathSegments.length - 1];

  // Frontmatter slug override: replace only the final segment, keep parent dirs.
  if (idSlug !== defaultSlug) {
    const parentSegments = pathSegments.slice(0, -1);
    return [basePath, ...parentSegments, idSlug].join("/");
  }

  // Default behavior: keep folder-based route.
  return [basePath, ...pathSegments].join("/");
}
