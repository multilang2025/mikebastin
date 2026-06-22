# mikebastin — WordPress + Claude tooling

Two independent ways to put Claude to work on a self-hosted WordPress site, on
**your own Anthropic key with no daily cap** — built as an alternative to
WPVibe's rate-limited flow.

Pick the prong that fits how you want to work. They're separate tools that share
one small piece (see [How they relate](#how-they-relate)); you can use either or
both.

---

## Prong 1 — In-WordPress assistant (the plugin)

**`ai-site-assistant/`** — a WordPress plugin that adds an AI chat panel **inside
wp-admin** (`Tools → AI Site Assistant`). You log into the dashboard and type;
it reads and edits the site through Claude, with every write gated behind an
Approve/Cancel confirmation.

- **Use it when:** you're already working in the WordPress dashboard, or you want
  a non-technical person to drive Claude from inside WP.
- **Your Anthropic key lives:** on the WordPress site (`AISA_API_KEY` in
  `wp-config.php`, or the Settings page).
- **Setup:** [`ai-site-assistant/readme.txt`](ai-site-assistant/readme.txt).

> ⚠️ This prong is **not** a Claude "connector." It lives in your browser inside
> wp-admin. There is no MCP URL to paste into Claude's **Settings → Connectors**,
> and nothing to authorize from the Claude side. (The "authorization link" idea
> belongs to WPVibe, not here.)

## Prong 2 — Claude-side bridge (the MCP server)

**`wp-mcp-server/`** — a local [MCP](https://modelcontextprotocol.io) server that
lets **Claude Desktop / Claude Code** drive the site directly, wrapping the
WordPress REST API and authenticating with a WordPress **Application Password**.
14 tools: posts (search/get/create/update/publish), excerpt, media upload,
search/replace, SEO meta tags, schema/post-meta, and `wp_rest` (any endpoint).

- **Use it when:** you'd rather drive WordPress from a Claude conversation than
  from the WP dashboard. This is the WPVibe replacement.
- **Your Anthropic key lives:** only where Claude runs — **never on the site.**
- **Runs in:** Claude **Desktop** or **Claude Code** (local stdio). Not the
  claude.ai website (that needs a hosted connector).
- **Setup:** [`wp-mcp-server/README.md`](wp-mcp-server/README.md).

---

## How they relate

Core WordPress REST can't expose Rank Math / Yoast SEO meta or schema. So the
**plugin** also publishes a small, keyless REST bridge (`/aisa/v1/meta`,
`/aisa/v1/postmeta`), and the **MCP server's** `get_seo` / `set_seo` /
`get_schema` / `get_meta` / `set_meta` tools call it. Install the plugin on a
site and Prong 2 gains SEO + structured-data editing there; skip it and Prong 2
still does everything else (posts, media, search/replace, `wp_rest`).

```
Prong 1:  You → wp-admin chat panel → Claude API → your site
Prong 2:  You → Claude Desktop/Code → wp-mcp-server → WordPress REST API → your site
                                            └─(SEO/schema)→ plugin's /aisa/v1 endpoints
```

## Which should I use?

| You want to… | Use |
|---|---|
| Drive WordPress from a Claude conversation, no cap | **Prong 2** (MCP server) |
| Click around wp-admin and have an AI helper there | **Prong 1** (plugin) |
| Edit Rank Math SEO / schema from Claude | **Prong 2** + install the plugin |
| Hand a non-technical site admin an in-dashboard helper | **Prong 1** |

## Repo layout

```
ai-site-assistant/   Prong 1 — the WordPress plugin (+ the keyless SEO/schema REST bridge)
wp-mcp-server/       Prong 2 — the MCP server for Claude Desktop / Claude Code
phpcs.xml.dist       WordPress Coding Standards config (CI gates the plugin)
```
