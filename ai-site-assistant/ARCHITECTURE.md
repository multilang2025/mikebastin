# Architecture

This is **Prong 1** of the project (see [`../../README.md`](../../README.md)):
the in-wp-admin AI chat panel, for non-technical people making the occasional
edit from inside WordPress. (Prong 2, the MCP server that drives the site from a
Claude Code / Claude Desktop conversation, lives in `../../wp-mcp-server/`.) The
plugin also publishes the keyless `/aisa/v1` SEO/schema REST endpoints that
Prong 2's SEO tools call.

AISA Connector is a standalone WordPress plugin that calls the Claude
Messages API with the site owner's own API key. Because each site pays its own
provider per use, there are no daily usage caps.

## Request flow

```
Admin chat UI (admin/js/app.js)
        │  POST /wp-json/aisa/v1/chat   (X-WP-Nonce)
        ▼
AISA_REST::chat            includes/class-rest.php   — auth: current_user_can('edit_posts')
        ▼
AISA_Agent::run            includes/class-agent.php  — the tool-use loop + write gate
        │  POST /v1/messages
        ▼
AISA_Claude_Client::create includes/class-claude-client.php  — wp_remote_post, key stays server-side
        ▼ (tool_use blocks)
AISA_Tools::dispatch       includes/class-tools.php  — THE SECURITY BOUNDARY
        ▼
WordPress APIs (WP_Query, wp_insert_post, wp_update_post, …)
```

The `fact_check` tool is one branch that reaches a second provider:
`AISA_Tools::fact_check` calls `AISA_OpenRouter_Client::create`
(`includes/class-openrouter-client.php`), which POSTs to OpenRouter's
OpenAI-compatible chat/completions endpoint for Perplexity Sonar and returns a
verdict plus source URLs. It is read-only (no write gate) and inert until an
OpenRouter key is configured. `search_images` reaches a third provider the
same way, via `AISA_Unsplash_Client`, and the `ahrefs_*` SEO-intelligence
tools reach a fourth via `AISA_Ahrefs_Client` (Ahrefs API v3) — also
read-only and inert until an Ahrefs API key is configured.

Beyond posts and SEO meta, `AISA_Tools::dispatch` fans out to a few dedicated
classes rather than growing one giant file:

- `AISA_WPCLI` (`wp_cli_get`/`wp_cli_set`) — WP-CLI-equivalent site admin
  (plugins, themes, an allowlisted set of options, users) via native PHP
  calls into WordPress core. No `exec()`/`shell_exec()` anywhere.
- `AISA_Abilities` (`discover_abilities`/`run_ability`) — a thin bridge to WP
  core's Abilities API (6.9+), so other plugins' registered capabilities are
  reachable without a bespoke integration per plugin.
- `AISA_Theme_Files` (`list_theme_files`/`read_theme_file`/`search_theme_files`/
  `create_draft_theme`/`write_theme_file`/`get_theme_preview_url`/
  `publish_draft_theme`/`delete_draft_theme`) — theme file access, with writes
  confined to a draft-theme sandbox (see below).
- `AISA_Skills` (`load_skill`) — the on-demand playbook library described
  under "Model configuration".

## The security boundary

Claude never touches the database. It emits `tool_use` blocks; `AISA_Tools`
executes them through WordPress APIs and is the *only* place writes happen.
Each handler enforces:

- **Capability checks** — `current_user_can('edit_post', $id)` on every read/write.
- **Sanitization** — `wp_kses_post()` for content, `sanitize_text_field()` for titles.
- **Staleness guard** — `update_post` rejects edits if `post_modified` changed
  since the model read the post via `get_post`.
- **Meta allowlist** — only keys in `AISA_Tools::META_ALLOWLIST` are writable.
- **Drafts only** — `create_post` always writes `post_status = draft`.
- **Option allowlist** — `wp_cli_set` only writes options in
  `AISA_WPCLI::OPTION_ALLOWLIST`, which deliberately excludes anything that
  could change who can log in or what code runs (`active_plugins`,
  `template`/`stylesheet`, `siteurl`/`home`, etc.).
- **Theme draft sandbox** — `write_theme_file` refuses any stylesheet that
  doesn't end in `-aisa-draft`; the live theme's files are never touched by
  this plugin. Paths are resolved with `realpath()` and checked against the
  theme root to block traversal, and PHP writes are syntax-checked with
  `token_get_all(..., TOKEN_PARSE)` before saving — no shell involved.
- **No reliable read/write flag on Abilities** — the Abilities API doesn't
  expose one, so `run_ability` is unconditionally gated as if every call
  were a write.

## The write gate

`AISA_Agent` classifies tools via `AISA_Tools::destructive_tools()`. When the
model calls one and the request hasn't pre-approved writes, the loop stops and
returns a `pending` action. The UI renders Approve / Cancel; approving re-runs
the turn with `allow_writes = true`, and the agent resumes the pending call.

This keeps reversibility-sensitive actions (publish, bulk edits, deletes) behind
an explicit human confirmation, while read-only tools run freely.

## Why no Composer SDK

The Claude client uses `wp_remote_post` rather than `anthropic-ai/sdk` so the
plugin ships as a self-contained zip — no `vendor/` autoloader to collide with
other plugins that bundle their own copies of shared libraries. The request body
mirrors `POST /v1/messages` exactly, so switching to the official SDK later is a
drop-in replacement inside `AISA_Claude_Client`.

## Model configuration

Default model is `claude-opus-4-8` with adaptive thinking. The stable system
prompt is sent as a cached prefix to reduce cost across the multi-turn loop.
