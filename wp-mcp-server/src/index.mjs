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
      post_type: z.string().optional().describe("post or page (default post)"),
      status: z
        .string()
        .optional()
        .describe("draft or publish (default draft)"),
    },
  },
  tool(async ({ title, content, post_type, status }) => {
    const p = await wp(`/wp/v2/${restBase(post_type)}`, {
      method: "POST",
      body: { title, content, status: status || "draft" },
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
      post_type: z.string().optional().describe("post or page (default post)"),
    },
  },
  tool(async ({ id, title, content, post_type }) => {
    const body = {};
    if (title !== undefined) body.title = title;
    if (content !== undefined) body.content = content;
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
