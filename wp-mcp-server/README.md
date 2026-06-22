# WordPress MCP server

A small [MCP](https://modelcontextprotocol.io) server that exposes a self-hosted
WordPress site to MCP clients (Claude Code, Claude Desktop, …) by wrapping the
standard WordPress REST API. You drive your site from Claude with **your own**
access — usage is metered by the Claude client you use, with no per-day caps.

No plugin is required on the WordPress side — this talks to the core REST API
and authenticates with a WordPress **Application Password**.

## Tools

| Tool | Action |
|---|---|
| `search_posts` | Find posts/pages by keyword, type, status (read-only) |
| `get_post` | Read one post/page by ID (read-only) |
| `create_post` | Create a post/page (defaults to **draft**) |
| `update_post` | Update a post/page |
| `publish_post` | Set a post/page status to published |
| `site_info` | Site name, URL, and public post types (read-only) |

Writes (`create_post`, `update_post`, `publish_post`) are confirmed by the Claude
client's own tool-approval prompt before they run.

## Prerequisites

- Node.js 18+
- A self-hosted WordPress site with the REST API reachable at
  `https://your-site/wp-json/` (pretty permalinks enabled).
- A WordPress **Application Password**:
  **Users → Profile → Application Passwords** → enter a name → **Add**. Copy the
  generated password (spaces are fine). Application Passwords require HTTPS.

## Install

```bash
cd wp-mcp-server
npm install
```

## Add to Claude Code

Use `claude mcp add` with your site's details (use an absolute path to
`src/index.mjs`):

```bash
claude mcp add wordpress \
  -e WP_URL=https://your-site.com \
  -e WP_USERNAME=your-wp-username \
  -e WP_APP_PASSWORD="abcd efgh ijkl mnop qrst uvwx" \
  -- node /absolute/path/to/wp-mcp-server/src/index.mjs
```

Then in Claude Code: `/mcp` to confirm it connected, and try
*"Use the wordpress tools to list my 5 most recent posts."*

### Multiple sites

Add one server per site with distinct names and env values:

```bash
claude mcp add wp-clientA -e WP_URL=https://a.com -e WP_USERNAME=... -e WP_APP_PASSWORD="..." -- node /abs/path/src/index.mjs
claude mcp add wp-clientB -e WP_URL=https://b.com -e WP_USERNAME=... -e WP_APP_PASSWORD="..." -- node /abs/path/src/index.mjs
```

## Run directly (debugging)

```bash
WP_URL=https://your-site.com WP_USERNAME=you WP_APP_PASSWORD="..." node src/index.mjs
```

It speaks MCP over stdio and logs `connected to <url>` to stderr.

## Notes

- This is separate from the **AI Site Assistant** plugin in this repo. The plugin
  puts an assistant *inside* wp-admin (it calls the Claude API with your key);
  this MCP server lets an external Claude client drive the site. Use either or
  both.
- Custom post types: pass the type's `rest_base` as `post_type` (it must have
  `show_in_rest` enabled).
- Claude Desktop / claude.ai connectors need a remote (HTTPS) MCP server with
  OAuth — not covered here. This server targets local stdio clients like Claude
  Code.
