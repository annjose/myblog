import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DisqusComment {
  id: string;
  message: string;
  createdAt: string;
  authorName: string;
  authorUsername?: string;
  isAnonymous: boolean;
  threadId: string;
  parentId?: string;
  isDeleted: boolean;
  isSpam: boolean;
}

// ─── XML Parsing ─────────────────────────────────────────────────────────────

function getElementText(parent: string, tagName: string): string {
  // Handle CDATA sections
  const cdataRegex = new RegExp(
    `<${tagName}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tagName}>`,
    "i"
  );
  const cdataMatch = parent.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1];

  // Handle self-closing tags
  const selfClosingRegex = new RegExp(`<${tagName}\\s*/>`, "i");
  if (selfClosingRegex.test(parent)) return "";

  // Handle regular tags
  const regex = new RegExp(`<${tagName}[^>]*>([^<]*)</${tagName}>`, "i");
  const match = parent.match(regex);
  return match ? match[1].trim() : "";
}



export function parseDisqusXml(xmlString: string): {
  threads: Map<string, string>;
  posts: DisqusComment[];
} {
  const threads = new Map<string, string>();

  // Parse threads
  const threadRegex = /<thread\s+dsq:id="([^"]+)">([\s\S]*?)<\/thread>/g;
  let match;
  while ((match = threadRegex.exec(xmlString)) !== null) {
    const threadId = match[1];
    const threadBody = match[2];
    const link = getElementText(threadBody, "link");

    // Extract slug from /post/<slug> pattern
    const slugMatch = link.match(/\/post\/([^/?]+)/);
    if (slugMatch) {
      threads.set(threadId, slugMatch[1]);
    }
  }

  // Parse posts (comments)
  const posts: DisqusComment[] = [];
  const postRegex = /<post\s+dsq:id="([^"]+)">([\s\S]*?)<\/post>/g;
  while ((match = postRegex.exec(xmlString)) !== null) {
    const postId = match[1];
    const postBody = match[2];

    const message = getElementText(postBody, "message");
    const createdAt = getElementText(postBody, "createdAt");
    const isDeleted = getElementText(postBody, "isDeleted") === "true";
    const isSpam = getElementText(postBody, "isSpam") === "true";

    // Author
    const authorBlock = postBody.match(/<author>([\s\S]*?)<\/author>/);
    const authorBody = authorBlock ? authorBlock[1] : "";
    const authorName = getElementText(authorBody, "name");
    const isAnonymous = getElementText(authorBody, "isAnonymous") === "true";
    const authorUsername = isAnonymous
      ? undefined
      : getElementText(authorBody, "username") || undefined;

    // Thread reference
    const threadRef = postBody.match(/<thread\s+dsq:id="([^"]+)"/);
    const threadId = threadRef ? threadRef[1] : "";

    // Parent reference (for replies)
    const parentRef = postBody.match(/<parent\s+dsq:id="([^"]+)"/);
    const parentId = parentRef ? parentRef[1] : undefined;

    posts.push({
      id: postId,
      message,
      createdAt,
      authorName,
      authorUsername,
      isAnonymous,
      threadId,
      parentId,
      isDeleted,
      isSpam,
    });
  }

  return { threads, posts };
}

// ─── Filter and Group ────────────────────────────────────────────────────────

export function filterAndGroupComments(
  threads: Map<string, string>,
  posts: DisqusComment[]
): Map<string, DisqusComment[]> {
  const grouped = new Map<string, DisqusComment[]>();

  for (const post of posts) {
    if (post.isDeleted || post.isSpam) continue;

    const slug = threads.get(post.threadId);
    if (!slug) continue;

    if (!grouped.has(slug)) {
      grouped.set(slug, []);
    }
    grouped.get(slug)!.push(post);
  }

  // Sort each group by date
  for (const [, comments] of grouped) {
    comments.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  return grouped;
}

// ─── Render HTML ─────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderSingleComment(comment: DisqusComment, isReply: boolean): string {
  const classes = isReply
    ? "disqus-comment disqus-reply"
    : "disqus-comment";

  return `<div class="${classes}" id="comment-${comment.id}">
  <div class="comment-header">
    <span class="comment-author">${comment.authorName}</span>
    <time datetime="${comment.createdAt}">${formatDate(comment.createdAt)}</time>
  </div>
  <div class="comment-body">${comment.message}</div>
</div>`;
}

export function renderCommentsHtml(comments: DisqusComment[]): string {
  // Build parent-child map
  const topLevel: DisqusComment[] = [];
  const replies = new Map<string, DisqusComment[]>();

  for (const comment of comments) {
    if (comment.parentId) {
      if (!replies.has(comment.parentId)) {
        replies.set(comment.parentId, []);
      }
      replies.get(comment.parentId)!.push(comment);
    } else {
      topLevel.push(comment);
    }
  }

  // Recursively render a comment and all its replies
  const rendered = new Set<string>();
  function renderWithReplies(comment: DisqusComment, isReply: boolean): string {
    if (rendered.has(comment.id)) return "";
    rendered.add(comment.id);

    const parts = [renderSingleComment(comment, isReply)];
    const childReplies = replies.get(comment.id);
    if (childReplies) {
      for (const reply of childReplies) {
        parts.push(renderWithReplies(reply, true));
      }
    }
    return parts.filter(Boolean).join("\n");
  }

  const parts: string[] = [];
  for (const comment of topLevel) {
    parts.push(renderWithReplies(comment, false));
  }

  // Handle orphaned replies (parent was deleted/spam/missing)
  for (const comment of comments) {
    if (!rendered.has(comment.id)) {
      parts.push(renderWithReplies(comment, true));
    }
  }

  return parts.join("\n");
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const xmlPath = path.resolve("docs/disqus-export/disqus-comments-all-2026-03-14.xml");
  const outputDir = path.resolve("src/content/comments");

  if (!fs.existsSync(xmlPath)) {
    console.error(`XML file not found: ${xmlPath}`);
    process.exit(1);
  }

  const xmlString = fs.readFileSync(xmlPath, "utf-8");
  const { threads, posts } = parseDisqusXml(xmlString);

  console.log(`Parsed ${threads.size} threads, ${posts.length} comments`);

  const grouped = filterAndGroupComments(threads, posts);

  // Count filtered
  const totalKept = Array.from(grouped.values()).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const deleted = posts.filter(p => p.isDeleted).length;
  const spam = posts.filter(p => p.isSpam).length;
  const noThread = posts.filter(
    p => !p.isDeleted && !p.isSpam && !threads.has(p.threadId)
  ).length;

  console.log(
    `Kept: ${totalKept}, Deleted: ${deleted}, Spam: ${spam}, No valid thread: ${noThread}`
  );

  // Generate HTML files
  fs.mkdirSync(outputDir, { recursive: true });

  let filesWritten = 0;
  for (const [slug, comments] of grouped) {
    const html = renderCommentsHtml(comments);
    const filePath = path.join(outputDir, `${slug}.html`);
    fs.writeFileSync(filePath, html, "utf-8");
    console.log(`  ${slug}.html (${comments.length} comments)`);
    filesWritten++;
  }

  console.log(
    `\nDone! Generated ${filesWritten} HTML files in src/content/comments/`
  );
}

// Run if executed directly
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("convert-disqus.ts") ||
    process.argv[1].endsWith("convert-disqus.js"));
if (isDirectRun) {
  main();
}
