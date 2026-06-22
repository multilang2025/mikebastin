#!/usr/bin/env node
/**
 * WordPress MCP server.
 *
 * Exposes a single self-hosted WordPress site to MCP clients (Claude Code,
 * Claude Desktop, etc.) by wrapping the standard WordPress REST API. Auth is a
 * WordPress Application Password sent as HTTP Basic auth — no plugin required on
 * the site, and usage is metered by whatever Claude client connects, with no
 * per-day caps.
 *
 * Configuration (environment variables):
 *   WP_URL           Base site URL, e.g. https://example.com
 *   WP_USERNAME      WordPress username
 *   WP_APP_PASSWORD  An Application Password (Users -> Profile -> Application
 *                    Passwords). Spaces are allowed.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { pathToFileURL } from "node:url";
import { z } from "zod";

const WP_URL = (process.env.WP_URL || "").replace(/\/+$/, "");
const WP_USERNAME = process.env.WP_USERNAME || "";
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || "";

const AUTH =
  "Basic " + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64");

/** Map a post type to its REST base ('post' -> 'posts', 'page' -> 'pages'). */
function restBase(postType) {
  if (!postType || postType === "post") return "posts";
  if (postType === "page") return "pages";
  return postType; // custom type: caller passes its rest_base
}

/**
 * Call the WordPress REST API and return the parsed JSON.
 * Throws an Error with a useful message on a non-2xx response.
 */
async function wp(path, { method = "GET", query, body } = {}) {
  const url = new URL(`${WP_URL}/wp-json${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: AUTH,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg =
      (data && data.message) || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data;
}

/** Wrap a handler so thrown errors become MCP error results, not crashes. */
function tool(fn) {
  return async (args) => {
    try {
      const result = await fn(args);
      return { content: [{ type: "text", text: result }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  };
}

const server = new McpServer({ name: "wp-mcp-server", version: "0.1.0" });

server.registerTool(
  "search_posts",
  {
    title: "Search posts",
    description:
      "Search posts or pages by keyword, type, and status. Read-only. " +
      "Call this to find content (and its ID) before reading or editing it.",
    inputSchema: {
      query: z.string().optional().describe("Search term"),
      post_type: z
        .string()
        .optional()
        .describe("post, page, or a custom type's REST base (default post)"),
      status: z
        .string()
        .optional()
        .describe("publish, draft, pending, any (default any)"),
      limit: z.number().int().optional().describe("Max results (default 10)"),
    },
  },
  tool(async ({ query, post_type, status, limit }) => {
    const rows = await wp(`/wp/v2/${restBase(post_type)}`, {
      query: {
        search: query,
        status: status || "any",
        per_page: Math.min(limit || 10, 50),
        context: "edit",
        _fields: "id,title,status,type,link",
      },
    });
    const slim = (rows || []).map((p) => ({
      id: p.id,
      title: p.title?.raw ?? p.title?.rendered ?? "",
      status: p.status,
      type: p.type,
      link: p.link,
    }));
    return JSON.stringify(slim, null, 2);
  })
);

server.registerTool(
  "get_post",
  {
    title: "Get post",
    description:
      "Read the full content and metadata of one post or page by ID. " +
      "Call this before update_post so you edit the current version.",
    inputSchema: {
      id: z.number().int().describe("Post ID"),
      post_type: z.string().optional().describe("post or page (default post)"),
    },
  },
  tool(async ({ id, post_type }) => {
    const p = await wp(`/wp/v2/${restBase(post_type)}/${id}`, {
      query: { context: "edit" },
    });
    return JSON.stringify(
      {
        id: p.id,
        title: p.title?.raw ?? p.title?.rendered ?? "",
        content: p.content?.raw ?? "",
        excerpt: p.excerpt?.raw ?? "",
        status: p.status,
        type: p.type,
        link: p.link,
        modified: p.modified_gmt,
      },
      null,
      2
    );
  })
);

server.registerTool(
  "create_post",
  {
    title: "Create post",
    description:
      "Create a new post or page. Defaults to a draft. WRITE ACTION — the " +
      "Claude client should confirm with the user before calling.",
    inputSchema: {
      title: z.string().describe("Post title"),
      content: z.string().describe("HTML or block markup"),
      excerpt: z.string().optional().describe("Optional excerpt"),
      post_type: z.string().optional().describe("post or page (default post)"),
      status: z
        .string()
        .optional()
        .describe("draft or publish (default draft)"),
    },
  },
  tool(async ({ title, content, excerpt, post_type, status }) => {
    const body = { title, content, status: status || "draft" };
    if (excerpt !== undefined) body.excerpt = excerpt;
    const p = await wp(`/wp/v2/${restBase(post_type)}`, {
      method: "POST",
      body,
    });
    return JSON.stringify(
      { id: p.id, status: p.status, link: p.link },
      null,
      2
    );
  })
);

server.registerTool(
  "update_post",
  {
    title: "Update post",
    description:
      "Update an existing post or page. WRITE ACTION — confirm with the user " +
      "first. Read it with get_post beforehand.",
    inputSchema: {
      id: z.number().int().describe("Post ID"),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      post_type: z.string().optional().describe("post or page (default post)"),
    },
  },
  tool(async ({ id, title, content, excerpt, post_type }) => {
    const body = {};
    if (title !== undefined) body.title = title;
    if (content !== undefined) body.content = content;
    if (excerpt !== undefined) body.excerpt = excerpt;
    const p = await wp(`/wp/v2/${restBase(post_type)}/${id}`, {
      method: "POST",
      body,
    });
    return JSON.stringify({ id: p.id, status: p.status, link: p.link }, null, 2);
  })
);

server.registerTool(
  "publish_post",
  {
    title: "Publish post",
    description:
      "Publish a draft or pending post or page (sets status to publish). " +
      "WRITE ACTION — confirm with the user first.",
    inputSchema: {
      id: z.number().int().describe("Post ID"),
      post_type: z.string().optional().describe("post or page (default post)"),
    },
  },
  tool(async ({ id, post_type }) => {
    const p = await wp(`/wp/v2/${restBase(post_type)}/${id}`, {
      method: "POST",
      body: { status: "publish" },
    });
    return JSON.stringify({ id: p.id, status: p.status, link: p.link }, null, 2);
  })
);

server.registerTool(
  "site_info",
  {
    title: "Site info",
    description:
      "Get the site name, URL, and the public post types. Read-only.",
    inputSchema: {},
  },
  tool(async () => {
    const [root, types] = await Promise.all([
      wp("/"),
      wp("/wp/v2/types", { query: { context: "edit" } }),
    ]);
    return JSON.stringify(
      {
        name: root?.name,
        url: root?.url ?? WP_URL,
        description: root?.description,
        post_types: Object.values(types || {}).map((t) => ({
          slug: t.slug,
          rest_base: t.rest_base,
          name: t.name,
        })),
      },
      null,
      2
    );
  })
);

server.registerTool(
  "wp_rest",
  {
    title: "WordPress REST call",
    description:
      "Call any WordPress REST API endpoint — the general-purpose tool for " +
      "anything the dedicated tools don't cover: media, settings, menus, " +
      "categories and tags, users, comments, custom post types, and plugin " +
      "endpoints. `path` is relative to /wp-json (e.g. /wp/v2/media, " +
      "/wp/v2/settings, /wp/v2/categories). Any method other than GET modifies " +
      "the site, so confirm with the user first.",
    inputSchema: {
      method: z
        .enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .optional()
        .describe("HTTP method (default GET)"),
      path: z
        .string()
        .describe(
          "REST path under /wp-json, e.g. /wp/v2/categories or /wp/v2/posts/5"
        ),
      query: z
        .record(z.any())
        .optional()
        .describe("Query parameters as a flat object"),
      body: z
        .record(z.any())
        .optional()
        .describe("JSON body for write methods (POST/PUT/PATCH)"),
    },
  },
  tool(async ({ method, path, query, body }) => {
    let p = path.trim().replace(/^\/?wp-json/, "");
    if (!p.startsWith("/")) p = "/" + p;
    const q = query
      ? Object.fromEntries(
          Object.entries(query).map(([k, v]) => [k, String(v)])
        )
      : undefined;
    const data = await wp(p, { method: method || "GET", query: q, body });
    return JSON.stringify(data, null, 2);
  })
);

server.registerTool(
  "upload_media",
  {
    title: "Upload media from URL",
    description:
      "Download an image from a public URL and add it to the Media Library. " +
      "Optionally set title/alt text and make it a post's featured image. " +
      "WRITE ACTION — confirm with the user first.",
    inputSchema: {
      url: z.string().describe("Public URL of the image to upload"),
      filename: z
        .string()
        .optional()
        .describe("Filename to store as (default derived from the URL)"),
      title: z.string().optional(),
      alt_text: z.string().optional(),
      featured_for_post: z
        .number()
        .int()
        .optional()
        .describe("If set, use the uploaded image as this post's featured image"),
    },
  },
  tool(async ({ url, filename, title, alt_text, featured_for_post }) => {
    const dl = await fetch(url);
    if (!dl.ok) throw new Error(`fetch image: HTTP ${dl.status}`);
    const contentType =
      dl.headers.get("content-type") || "application/octet-stream";
    const buf = Buffer.from(await dl.arrayBuffer());
    const name =
      filename || new URL(url).pathname.split("/").pop() || "upload";

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: AUTH,
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${name}"`,
        Accept: "application/json",
      },
      body: buf,
    });
    const text = await res.text();
    let media;
    try {
      media = JSON.parse(text);
    } catch {
      media = null;
    }
    if (!res.ok) {
      throw new Error((media && media.message) || `HTTP ${res.status}`);
    }

    if (title || alt_text) {
      await wp(`/wp/v2/media/${media.id}`, {
        method: "POST",
        body: {
          ...(title ? { title } : {}),
          ...(alt_text ? { alt_text } : {}),
        },
      });
    }
    if (featured_for_post) {
      await wp(`/wp/v2/posts/${featured_for_post}`, {
        method: "POST",
        body: { featured_media: media.id },
      });
    }
    return JSON.stringify(
      { id: media.id, source_url: media.source_url, link: media.link },
      null,
      2
    );
  })
);

server.registerTool(
  "search_replace",
  {
    title: "Search and replace text",
    description:
      "Find an exact text string across posts/pages and replace it. Scans " +
      "matching content and updates each affected post's content (and title " +
      "when include_title is set). Set dry_run true to preview the matches " +
      "without writing. WRITE ACTION when dry_run is false. Scans posts " +
      "directly and matches the exact substring locally (so HTML, URLs, and " +
      "partial words are found). Note: matches content stored in post_content; " +
      "content managed by a page builder may live elsewhere.",
    inputSchema: {
      search: z.string().describe("Exact substring to find"),
      replace: z.string().describe("Replacement text"),
      post_type: z.string().optional().describe("post or page (default post)"),
      include_title: z
        .boolean()
        .optional()
        .describe("Also replace in titles (default false)"),
      dry_run: z
        .boolean()
        .optional()
        .describe("Preview matches without writing (default false)"),
      limit: z
        .number()
        .int()
        .optional()
        .describe("Max posts to scan (default 50)"),
    },
  },
  tool(async ({ search, replace, post_type, include_title, dry_run, limit }) => {
    const base = restBase(post_type);
    // Scan posts directly and page through them. The WP `search` param only
    // matches whole words, so it can't reliably find arbitrary substrings
    // (HTML, URLs, partial words); filtering locally avoids missing real hits.
    const max = limit || 50;
    const perPage = Math.min(max, 100);
    const changed = [];
    let scanned = 0;
    for (let page = 1; scanned < max; page++) {
      let rows;
      try {
        rows = await wp(`/wp/v2/${base}`, {
          query: {
            per_page: perPage,
            page,
            status: "any",
            context: "edit",
            orderby: "id",
            order: "asc",
            _fields: "id,title,content",
          },
        });
      } catch {
        // Paging past the last page returns an error — treat as end of list.
        break;
      }
      if (!Array.isArray(rows) || rows.length === 0) break;
      for (const p of rows) {
        if (scanned >= max) break;
        scanned++;
        const content = p.content?.raw ?? "";
        const titleRaw = p.title?.raw ?? "";
        const hitContent = content.includes(search);
        const hitTitle = include_title && titleRaw.includes(search);
        if (!hitContent && !hitTitle) continue;
        const body = {};
        if (hitContent) body.content = content.split(search).join(replace);
        if (hitTitle) body.title = titleRaw.split(search).join(replace);
        changed.push({ id: p.id, title: titleRaw, fields: Object.keys(body) });
        if (!dry_run) {
          await wp(`/wp/v2/${base}/${p.id}`, { method: "POST", body });
        }
      }
      if (rows.length < perPage) break;
    }
    return JSON.stringify(
      {
        dry_run: Boolean(dry_run),
        scanned,
        matched: changed.length,
        posts: changed,
      },
      null,
      2
    );
  })
);

server.registerTool(
  "get_seo",
  {
    title: "Get SEO fields",
    description:
      "Read a post's SEO meta tags (title, meta description, focus keyword, " +
      "canonical, Open Graph / Twitter) and excerpt. Requires the AI Site " +
      "Assistant plugin (v0.3.0+) installed on the site to expose these meta " +
      "keys. Read-only.",
    inputSchema: { id: z.number().int().describe("Post ID") },
  },
  tool(async ({ id }) => {
    const data = await wp("/aisa/v1/meta", { query: { id } });
    return JSON.stringify(data, null, 2);
  })
);

server.registerTool(
  "set_seo",
  {
    title: "Set SEO fields",
    description:
      "Update a post's SEO meta tags. Pass any of: meta_title, " +
      "meta_description, focus_keyword, canonical, og_title, og_description, " +
      "twitter_title, twitter_description. Requires the AI Site Assistant " +
      "plugin (v0.3.0+). WRITE ACTION — confirm with the user first.",
    inputSchema: {
      id: z.number().int().describe("Post ID"),
      meta_title: z.string().optional(),
      meta_description: z.string().optional(),
      focus_keyword: z.string().optional(),
      canonical: z.string().optional(),
      og_title: z.string().optional(),
      og_description: z.string().optional(),
      twitter_title: z.string().optional(),
      twitter_description: z.string().optional(),
    },
  },
  tool(async ({ id, ...fields }) => {
    const meta = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) meta[k] = v;
    }
    const data = await wp("/aisa/v1/meta", {
      method: "POST",
      body: { id, meta },
    });
    return JSON.stringify(data, null, 2);
  })
);

server.registerTool(
  "get_meta",
  {
    title: "Get SEO/schema post meta",
    description:
      "Read a post's raw SEO/schema meta (Rank Math, Yoast, AIO SEO keys), " +
      "including structured-data entries. Optionally filter by a key prefix or " +
      "an explicit list of keys. Requires the AI Site Assistant plugin " +
      "(v0.4.0+). Read-only.",
    inputSchema: {
      id: z.number().int().describe("Post ID"),
      prefix: z
        .string()
        .optional()
        .describe("Only return keys starting with this prefix"),
      keys: z
        .string()
        .optional()
        .describe("Comma-separated list of exact meta keys to return"),
    },
  },
  tool(async ({ id, prefix, keys }) => {
    const query = { id };
    if (prefix) query.prefix = prefix;
    if (keys) query.keys = keys;
    const data = await wp("/aisa/v1/postmeta", { query });
    return JSON.stringify(data, null, 2);
  })
);

server.registerTool(
  "get_schema",
  {
    title: "Get structured data (schema)",
    description:
      "Read a post's Rank Math structured-data (schema) entries, decoded. " +
      "Use this to inspect existing schema before editing it with set_meta. " +
      "Requires the AI Site Assistant plugin (v0.4.0+). Read-only.",
    inputSchema: { id: z.number().int().describe("Post ID") },
  },
  tool(async ({ id }) => {
    const data = await wp("/aisa/v1/postmeta", {
      query: { id, prefix: "rank_math_schema" },
    });
    return JSON.stringify(data, null, 2);
  })
);

server.registerTool(
  "set_meta",
  {
    title: "Set SEO/schema post meta",
    description:
      "Write one SEO/schema meta key on a post. `value` may be a string or a " +
      "nested object/array (e.g. a schema entry — read an existing one with " +
      "get_schema first to match the format). Only Rank Math / Yoast / AIO SEO " +
      "keys are allowed. Requires the AI Site Assistant plugin (v0.4.0+). " +
      "WRITE ACTION — confirm with the user first.",
    inputSchema: {
      id: z.number().int().describe("Post ID"),
      key: z
        .string()
        .describe("Meta key, e.g. rank_math_schema_Article or rank_math_robots"),
      value: z
        .any()
        .describe("String, or a nested object/array for structured values"),
    },
  },
  tool(async ({ id, key, value }) => {
    const data = await wp("/aisa/v1/postmeta", {
      method: "POST",
      body: { id, key, value },
    });
    return JSON.stringify(data, null, 2);
  })
);

export { server };

async function main() {
  if (!WP_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
    console.error(
      "wp-mcp-server: set WP_URL, WP_USERNAME and WP_APP_PASSWORD environment variables."
    );
    process.exit(1);
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("wp-mcp-server: connected to", WP_URL);
}

// Run the stdio server only when executed directly (not when imported by tests).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
