# AISA Connector — Handoff

A handoff for anyone taking over this project: what exists today, what's on the
roadmap, and where it still trails WPVibe.

## Background

A WordPress + Claude toolkit built as an **alternative to WPVibe's rate-limited
flow**. The point: run Claude against a self-hosted WordPress site on your **own
Anthropic API key, with no daily cap**. It ships as two independent "prongs"
that share one small piece.

- **Prong 1 — AISA Connector (`ai-site-assistant/`).** An AI chat panel *inside*
  wp-admin. Log in, type, and it reads/edits the site through Claude, every write
  gated behind Approve/Cancel. Built for non-technical people; the API key lives
  on the site (`AISA_API_KEY` in `wp-config.php` or the Settings page).
- **Prong 2 — wp-mcp-server (`wp-mcp-server/`).** A local MCP server that lets
  Claude Desktop / Claude Code drive the site via the WordPress REST API,
  authenticated with a WordPress Application Password. The key lives only where
  Claude runs, never on the site.

**How they relate:** core WP REST can't expose Rank Math / Yoast SEO meta or
schema, so the plugin publishes a small keyless bridge (`/aisa/v1/meta`,
`/aisa/v1/postmeta`) that the MCP server's SEO tools call.

See [`README.md`](README.md) for the fuller two-prong explanation and
[`ai-site-assistant/ARCHITECTURE.md`](ai-site-assistant/ARCHITECTURE.md) for the
plugin's request flow and security boundary.

---

## 1) What exists today

### Plugin (Prong 1) — current version 0.4.6

**Content tools** (chat-driven, all writes gated):

- `search_posts` — find posts/pages by keyword, type, status
- `get_post` — read full content + metadata
- `create_post` — always creates a **draft** (never auto-publishes)
- `update_post` — full update, with a **staleness guard** (rejects edits if the
  post changed since it was read)
- `publish_post` — publish a draft/pending item, capability- and staleness-checked
- `get_site_context` — active theme, post types, active plugins

**Fast targeted edits** (added to avoid host/gateway timeouts on big rewrites):

- `replace_in_post` — swap one exact, unique snippet
- `append_to_post` — add a block at the end (author/EEAT box, sources, FAQ)

**SEO + structured data** (Rank Math / Yoast / AIO SEO):

- `get_seo` / `set_seo` — meta title, description, focus keyword, canonical, OG, Twitter
- `get_schema` / `set_meta` — Rank Math structured-data entries, allowlisted keys only

**Fact-checking** (new in 0.4.6):

- `fact_check` — verifies a statistic, date, price, quote, or named study against
  the **live web** using **Perplexity Sonar via OpenRouter**, returning a verdict
  (True / False / Misleading / Unverifiable) plus cited source URLs. Read-only,
  fully opt-in via an OpenRouter API key (Settings field or
  `AISA_OPENROUTER_API_KEY`; model overridable with `AISA_SONAR_MODEL`, default
  `perplexity/sonar`). Inert when unset. The system prompt instructs the assistant
  to never invent facts — verify first, then cite Sonar's sources.

**Assistant "skills" (system-prompt playbooks):** EEAT, NLP/readability, internal
linking, meta tags, schema, and page-builder awareness (Classic/Gutenberg/Divi
edit in `post_content`; Elementor body edits flagged unsupported, though its SEO
meta/schema still work).

**Platform / safety:**

- Write-approval gate — destructive tools stop and ask for one-tap Approve/Cancel
- Serial tool use so one approval runs exactly one action
- Full audit log of every AI action
- Browser-driven step loop (one Claude call per HTTP request) so multi-step tasks
  don't trip host timeouts
- Runaway guard capping steps per request
- Optional self-hosted **fleet check-in** (0.4.5): each site can report URL +
  plugin/WP/PHP versions to a hub you control (just another copy of the plugin),
  giving one *AISA Connector → Sites* dashboard of which sites run it and when
  they last checked in. Entirely opt-in via wp-config constants; no content or
  secrets sent.
- GitHub-release auto-updates
- 0.4.6: the chat page lists the plugin's main features next to the heading.

### MCP server (Prong 2)

14 tools wrapping WordPress REST: posts (search/get/create/update/publish),
excerpt, media upload, search/replace, SEO meta tags, schema/post-meta, and
`wp_rest` (call any endpoint). Runs locally in Claude Desktop / Claude Code
(stdio). Gains SEO/schema editing when the plugin is installed on the target site.

---

## 2) Future ideas / roadmap

- **Media:** image upload + stock-image search from chat (the plugin has no media
  tools yet; the MCP server has upload only).
- **Page builders:** real Elementor support (body edits currently unsupported),
  plus Gutenberg block-level editing helpers.
- **Bulk / batch ops:** run the same SEO or content change across many posts with
  one approval.
- **Skills library:** loadable, versioned task procedures instead of monolithic
  system-prompt playbooks (WPVibe-style).
- **Scheduling:** recurring tasks (e.g. weekly "fact-check and refresh this
  cornerstone page").
- **Fleet hub:** grow from read-only visibility into light remote actions
  (trigger an update, push a setting) — with strong auth.
- **Secrets:** encrypt the API key at rest; first-class env-var / secrets-manager
  support.
- **Fact-check+:** a whole-article "citations & freshness" pass over an existing
  article.
- **Analytics hooks:** tie edits to ranking movement via the SEO plugins' data.

---

## 3) What WPVibe does that AISA doesn't yet do

WPVibe is **full WordPress management** for any self-hosted site. AISA is
deliberately narrower (content + SEO, your own key, no cap). Main gaps:

| Capability | WPVibe | AISA today |
|---|---|---|
| Theme / full-site build (draft → preview → publish) | Yes | No — content + SEO meta only |
| Page building (e.g. SeedProd) | Yes | No — Elementor flagged unsupported |
| WP-CLI access | Yes | No |
| Media upload + stock image search | Yes | Plugin: none (MCP: upload only) |
| Plugin/theme install/activate/update | Yes | No |
| One-click, credential-free connect | Yes (auth link) | App Password (MCP) / in-admin only (plugin) |
| Multi-site control from one place | Yes | Read-only fleet visibility only |
| On-demand skills marketplace | Yes | Static prompt playbooks |
| Backup-aware safety rails | Yes | Approval gate + audit log, no backup check |

**In short:** WPVibe is a full site operator; AISA is a focused, uncapped
content-and-SEO editor a non-technical admin can use from inside wp-admin on their
own key. The roadmap is mostly about closing the media, page-builder, bulk-ops,
and skills-library gaps without losing that simplicity.

---

## Taking over — practical notes

- **Develop** on a feature branch, commit, push, open a **draft** PR.
- **Releases** are published via the **Release** GitHub Actions workflow; the tag
  is the plugin version (e.g. `v0.4.6`). CI runs PHPCS (WordPress Coding
  Standards) against the plugin — keep `php -l` clean and WPCS green.
- **Config constants** (all in `wp-config.php`): `AISA_API_KEY` (Claude),
  `AISA_OPENROUTER_API_KEY` + optional `AISA_SONAR_MODEL` (fact-checking),
  `AISA_CHECKIN_URL` / `AISA_CHECKIN_TOKEN` / `AISA_CHECKIN_HUB` (fleet check-in),
  `AISA_GITHUB_TOKEN` (private-repo auto-updates).
- **Key files:** `ai-site-assistant/includes/class-aisa-tools.php` is the security
  boundary (tool definitions + executor); `class-aisa-agent.php` is the tool-use
  loop and system prompt; `class-aisa-claude-client.php` /
  `class-aisa-openrouter-client.php` are the two API clients.
