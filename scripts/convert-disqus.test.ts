import { describe, it, expect } from "vitest";
import {
  parseDisqusXml,
  filterAndGroupComments,
  renderCommentsHtml,
} from "./convert-disqus.js";
import type { DisqusComment } from "./convert-disqus.js";

// ─── XML Parsing ────────────────────────────────────────────────────────────

const makeThread = (id: string, link: string) =>
  `<thread dsq:id="${id}">
    <id />
    <forum>anncjose</forum>
    <link>${link}</link>
    <title>Test</title>
    <message />
    <createdAt>2023-01-01T00:00:00Z</createdAt>
    <author><name>Ann</name><isAnonymous>false</isAnonymous><username>anncjose</username></author>
    <isClosed>false</isClosed>
    <isDeleted>false</isDeleted>
  </thread>`;

const makePost = (
  id: string,
  threadId: string,
  opts: {
    message?: string;
    author?: string;
    username?: string;
    isAnonymous?: boolean;
    isDeleted?: boolean;
    isSpam?: boolean;
    createdAt?: string;
    parentId?: string;
  } = {}
) => {
  const {
    message = "<p>Test comment</p>",
    author = "Test User",
    username = "testuser",
    isAnonymous = false,
    isDeleted = false,
    isSpam = false,
    createdAt = "2023-06-15T10:00:00Z",
    parentId,
  } = opts;
  return `<post dsq:id="${id}">
    <id />
    <message><![CDATA[${message}]]></message>
    <createdAt>${createdAt}</createdAt>
    <isDeleted>${isDeleted}</isDeleted>
    <isSpam>${isSpam}</isSpam>
    <author>
      <name>${author}</name>
      <isAnonymous>${isAnonymous}</isAnonymous>
      ${!isAnonymous ? `<username>${username}</username>` : ""}
    </author>
    <thread dsq:id="${threadId}" />
    ${parentId ? `<parent dsq:id="${parentId}" />` : ""}
  </post>`;
};

const wrapXml = (content: string) =>
  `<?xml version="1.0" encoding="utf-8"?>
<disqus xmlns="http://disqus.com" xmlns:dsq="http://disqus.com/disqus-internals">
${content}
</disqus>`;

describe("parseDisqusXml", () => {
  it("parses thread elements and extracts slug from URL", () => {
    const xml = wrapXml(
      makeThread("100", "https://annjose.com/post/my-first-post/")
    );
    const result = parseDisqusXml(xml);
    expect(result.threads.get("100")).toBe("my-first-post");
  });

  it("deduplicates threads with same slug across domains", () => {
    const xml = wrapXml(
      makeThread("100", "http://ann.chiramattel.com/post/react-native/") +
        makeThread("200", "https://annjose.com/post/react-native/") +
        makeThread(
          "300",
          "https://annjose-com.translate.goog/post/react-native/?_x_tr_sl=en"
        )
    );
    const result = parseDisqusXml(xml);
    // All three thread IDs should map to the same slug
    expect(result.threads.get("100")).toBe("react-native");
    expect(result.threads.get("200")).toBe("react-native");
    expect(result.threads.get("300")).toBe("react-native");
  });

  it("skips threads with invalid URLs (no /post/ path)", () => {
    const xml = wrapXml(
      makeThread("100", "http://evil.com") +
        makeThread(
          "200",
          "https://games.yahoo.co.jp/news/item?n=20171208-00000021"
        ) +
        makeThread("300", "https://annjose.com/post/valid-post/")
    );
    const result = parseDisqusXml(xml);
    expect(result.threads.has("100")).toBe(false);
    expect(result.threads.has("200")).toBe(false);
    expect(result.threads.get("300")).toBe("valid-post");
  });

  it("parses post elements with all fields", () => {
    const xml = wrapXml(
      makeThread("100", "https://annjose.com/post/my-post/") +
        makePost("500", "100", {
          message: "<p>Hello world</p>",
          author: "Neil Young",
          username: "neilyoung",
          createdAt: "2023-06-15T10:00:00Z",
        })
    );
    const result = parseDisqusXml(xml);
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0]).toMatchObject({
      id: "500",
      message: "<p>Hello world</p>",
      authorName: "Neil Young",
      authorUsername: "neilyoung",
      isAnonymous: false,
      threadId: "100",
      createdAt: "2023-06-15T10:00:00Z",
    });
  });

  it("parses parent references for replies", () => {
    const xml = wrapXml(
      makeThread("100", "https://annjose.com/post/my-post/") +
        makePost("500", "100") +
        makePost("600", "100", { parentId: "500" })
    );
    const result = parseDisqusXml(xml);
    expect(result.posts[0].parentId).toBeUndefined();
    expect(result.posts[1].parentId).toBe("500");
  });

  it("handles anonymous authors", () => {
    const xml = wrapXml(
      makeThread("100", "https://annjose.com/post/my-post/") +
        makePost("500", "100", {
          author: "ACJ",
          isAnonymous: true,
        })
    );
    const result = parseDisqusXml(xml);
    expect(result.posts[0].authorName).toBe("ACJ");
    expect(result.posts[0].isAnonymous).toBe(true);
    expect(result.posts[0].authorUsername).toBeUndefined();
  });
});

// ─── Filter and Group ───────────────────────────────────────────────────────

describe("filterAndGroupComments", () => {
  const threads = new Map([
    ["100", "post-a"],
    ["200", "post-b"],
  ]);

  it("filters out deleted comments", () => {
    const posts: DisqusComment[] = [
      {
        id: "1",
        message: "<p>Good</p>",
        createdAt: "2023-01-01T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
      {
        id: "2",
        message: "<p>Deleted</p>",
        createdAt: "2023-01-02T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: true,
        isSpam: false,
      },
    ];
    const grouped = filterAndGroupComments(threads, posts);
    expect(grouped.get("post-a")).toHaveLength(1);
    expect(grouped.get("post-a")![0].id).toBe("1");
  });

  it("filters out spam comments", () => {
    const posts: DisqusComment[] = [
      {
        id: "1",
        message: "<p>Good</p>",
        createdAt: "2023-01-01T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
      {
        id: "2",
        message: "<p>Buy stuff</p>",
        createdAt: "2023-01-02T00:00:00Z",
        authorName: "Spammer",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: true,
      },
    ];
    const grouped = filterAndGroupComments(threads, posts);
    expect(grouped.get("post-a")).toHaveLength(1);
  });

  it("groups comments by slug correctly", () => {
    const posts: DisqusComment[] = [
      {
        id: "1",
        message: "<p>On A</p>",
        createdAt: "2023-01-01T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
      {
        id: "2",
        message: "<p>On B</p>",
        createdAt: "2023-01-02T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "200",
        isDeleted: false,
        isSpam: false,
      },
      {
        id: "3",
        message: "<p>Also on A</p>",
        createdAt: "2023-01-03T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const grouped = filterAndGroupComments(threads, posts);
    expect(grouped.get("post-a")).toHaveLength(2);
    expect(grouped.get("post-b")).toHaveLength(1);
  });

  it("sorts comments by date within each group", () => {
    const posts: DisqusComment[] = [
      {
        id: "2",
        message: "<p>Later</p>",
        createdAt: "2023-06-01T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
      {
        id: "1",
        message: "<p>Earlier</p>",
        createdAt: "2023-01-01T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const grouped = filterAndGroupComments(threads, posts);
    const comments = grouped.get("post-a")!;
    expect(comments[0].id).toBe("1");
    expect(comments[1].id).toBe("2");
  });

  it("skips comments whose thread has no valid slug", () => {
    const posts: DisqusComment[] = [
      {
        id: "1",
        message: "<p>Orphan</p>",
        createdAt: "2023-01-01T00:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "999",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const grouped = filterAndGroupComments(threads, posts);
    expect(grouped.size).toBe(0);
  });
});

// ─── Render HTML ─────────────────────────────────────────────────────────────

describe("renderCommentsHtml", () => {
  it("renders comment HTML with author name and date", () => {
    const comments: DisqusComment[] = [
      {
        id: "500",
        message: "<p>Great post!</p>",
        createdAt: "2023-06-15T10:00:00Z",
        authorName: "Neil Young",
        authorUsername: "neilyoung",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const html = renderCommentsHtml(comments);
    expect(html).toContain('class="disqus-comment"');
    expect(html).toContain('id="comment-500"');
    expect(html).toContain("Neil Young");
    expect(html).toContain('datetime="2023-06-15T10:00:00Z"');
    expect(html).toContain("<p>Great post!</p>");
  });

  it("renders threaded replies with reply class", () => {
    const comments: DisqusComment[] = [
      {
        id: "500",
        message: "<p>Original</p>",
        createdAt: "2023-06-15T10:00:00Z",
        authorName: "User A",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
      {
        id: "600",
        message: "<p>Reply</p>",
        createdAt: "2023-06-16T10:00:00Z",
        authorName: "User B",
        isAnonymous: false,
        threadId: "100",
        parentId: "500",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const html = renderCommentsHtml(comments);
    expect(html).toContain('class="disqus-comment disqus-reply"');
    expect(html).toContain("User B");
  });

  it("handles anonymous authors", () => {
    const comments: DisqusComment[] = [
      {
        id: "500",
        message: "<p>Anonymous comment</p>",
        createdAt: "2023-06-15T10:00:00Z",
        authorName: "ACJ",
        isAnonymous: true,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const html = renderCommentsHtml(comments);
    expect(html).toContain("ACJ");
    expect(html).toContain("<p>Anonymous comment</p>");
  });

  it("formats date in human-readable form", () => {
    const comments: DisqusComment[] = [
      {
        id: "500",
        message: "<p>Test</p>",
        createdAt: "2023-06-15T10:00:00Z",
        authorName: "User",
        isAnonymous: false,
        threadId: "100",
        isDeleted: false,
        isSpam: false,
      },
    ];
    const html = renderCommentsHtml(comments);
    expect(html).toContain("Jun 15, 2023");
  });
});
