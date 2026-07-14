# AISA Connector — Project Context

## Project Summary

Two independent ways to drive a self-hosted WordPress site with Codex, on your own Anthropic key (no daily cap) — alternative to WPVibe.

- **Prong 1** (`ai-site-assistant/`): WordPress plugin with in-wp-admin chat panel. Call Codex server-side with your API key.
- **Prong 2** (`wp-mcp-server/`): Local MCP server for Codex/Desktop, wrapping WordPress REST API + plugin's tool bridge.

**Latest version: v0.7.0** (July 7, 2026). Just shipped the MCP bridge (`POST /aisa/v1/tool`) so the MCP server can reuse the plugin's 15+ tools.

## Current state & what's shipped

| Version | Date | What shipped |
|---------|------|--------------|
| 0.7.0 | 2026-07-07 | MCP bridge: 8 plugin-side tools callable from MCP server. 8 new bridge tools in MCP (generate_seo_image, commit_image, replace_in_post, append_to_post, search_images, fact_check, get_page_html, load_skill). No changes to in-admin chat. |
| 0.6.4 | 2026-07-06 | Client-side retry for transient `invalid_json` on long multi-step chats. |
| 0.6.3 | 2026-07-03 | Every request does at most one network-bound op (Codex call OR tool dispatch, never stacked). |
| 0.6.2 | 2026-07-03 | Working indicator pinned to bottom of chat. |
| 0.6.1 | 2026-07-03 | UI polish: Send/Generate Images stacked, header centered. |
| 0.6.0 | 2026-07-02 | Multi-step fix, Generate Images button, CSV/XLSX file attachment. |
| 0.5.5 | 2026-07-02 | Gemini image generation (Nano Banana Pro). |
| 0.5.2 | 2026-07-02 | Ahrefs SEO intelligence. |

## Architecture

**Request flow (Prong 1 — in-admin chat):**
```
admin/js/app.js → POST /wp-json/aisa/v1/chat
  ↓
AISA_REST::chat (includes/class-aisa-rest.php)
  ↓
AISA_Agent::run (includes/class-aisa-agent.php) — tool-use loop + write gate
  ↓
AISA_Claude_Client::create (includes/class-aisa-Codex-client.php)
  ↓ (Codex tool_use blocks)
AISA_Tools::dispatch (includes/class-aisa-tools.php) — THE SECURITY BOUNDARY
  ↓
WordPress APIs + external clients (Gemini, Ahrefs, Perplexity, Unsplash)
```

**Key design decisions:**
- **One network-op per HTTP request**: each request does either one Codex call OR one tool dispatch, never both stacked. Avoids gateway timeout on long chats.
- **Write gate**: `AISA_Agent` checks if a tool is destructive (in `AISA_Tools::destructive_tools()`); if yes and not yet approved, returns `pending`. UI shows Approve/Cancel.
- **Image handling**: `generate_image` returns only a tiny `image_id` reference to Codex, not raw bytes. Base64 cached 15min in transient. Browser reads transient directly for preview.
- **File attachments**: parsed in `AISA_REST::chat` before agent runs, folded into user message. Neither agent nor tools aware attachments exist.
- **Skills system**: on-demand playbooks (`load_skill`) instead of monolithic system prompt.
- **External API clients**: one per provider (Codex, OpenRouter/Sonar, Unsplash, Ahrefs, Gemini), same shape each time.

## Tech stack

**Plugin (Prong 1):**
- PHP 8.1+, WordPress 6.3+
- REST API, no Composer dependency (ships as self-contained zip)
- Uses `wp_remote_post` instead of official SDK so no vendor/ collision

**MCP Server (Prong 2):**
- Node.js, dotenv for config
- Credentials from env vars only (`.env` is gitignored)
- 14 tools wrapping WordPress REST + 8 new bridge tools

**Frontend (both):**
- Vanilla JS (no frameworks), IIFE pattern, promises
- Minimal CSS, centered layout

**External APIs:**
- Codex Opus 4.8 (default, adaptive thinking)
- Gemini 3 Pro Image (Nano Banana Pro)
- Ahrefs API v3
- Perplexity Sonar (via OpenRouter)
- Unsplash stock photos

## Code style & conventions

**PHP:**
- WordPress Coding Standards (WPCS) enforced by CI
- `phpcbf` auto-fixes most formatting
- `phpcs:ignore` for native extension properties (e.g. `DOMNode::$nodeValue`)
- Sanitize at boundaries: `wp_kses_post`, `sanitize_text_field`, `sanitize_key`
- Capability checks on every read/write: `current_user_can('edit_post', $id)`

**JavaScript:**
- IIFE, no modules
- Promises (no async/await in old codebases)
- Default to no comments; only comment the WHY
- Avoid state in global scope (use closure variables)

**Security model:**
- Allowlists, not blacklists: `AISA_Tools::destructive_tools()`, `AISA_Tools::META_ALLOWLIST`, `AISA_WPCLI::OPTION_ALLOWLIST`
- `AISA_Tools::dispatch()` is the security boundary; every handler does its own checks
- Staleness guard on `update_post`: rejects if `post_modified` changed since read
- Theme files only written to `<slug>-aisa-draft` copies, never live theme
- PHP syntax-checked with `token_get_all(..., TOKEN_PARSE)` before saving

## Key files

**Plugin core:**
- `ai-site-assistant.php` — main plugin file, version constant
- `includes/class-aisa-rest.php` — REST endpoints (`/aisa/v1/chat`, `/aisa/v1/tool`)
- `includes/class-aisa-agent.php` — tool-use loop, write gate, system prompt
- `includes/class-aisa-tools.php` — tool definitions + executor (the boundary)
- `includes/class-aisa-settings.php` — admin menu, settings page, chat page render
- `includes/class-aisa-file-parser.php` — CSV/XLSX parsing (no Composer)
- `admin/js/app.js` — browser-side chat loop, auto-retry on invalid_json
- `admin/css/admin.css` — minimal styling

**External API clients:**
- `includes/class-aisa-Codex-client.php` — Messages API
- `includes/class-aisa-gemini-client.php` — Gemini image gen
- `includes/class-aisa-ahrefs-client.php` — Ahrefs API v3
- `includes/class-aisa-openrouter-client.php` — Perplexity Sonar
- `includes/class-aisa-unsplash-client.php` — Stock photos

**Specialized tools:**
- `includes/class-aisa-skills.php` — playbooks (load_skill)
- `includes/class-aisa-wpcli.php` — WP-CLI-equivalent admin (no shell)
- `includes/class-aisa-abilities.php` — WP 6.9+ Abilities API bridge
- `includes/class-aisa-theme-files.php` — theme file tools + draft sandbox
- `includes/class-aisa-audit-log.php` — write audit table

**MCP server:**
- `wp-mcp-server/src/index.mjs` — 14 tools + 8 bridge tools, stdio MCP
- `wp-mcp-server/.env.example` — config template
- `wp-mcp-server/package.json` — dependencies (minimal)

## Shipping workflow

1. **Branch**: `git checkout main && git pull && git checkout -b michael/<feature>`
2. **Commit**: atomic, descriptive messages
3. **Push & PR**: `git push -u origin <branch>` → `gh pr create`
4. **CI**: PHPCS + PHP lint 8.1–8.4 on all commits. Must pass before merge.
5. **Merge**: `gh pr merge --merge --delete-branch`
6. **Tag & Release**: 
   - Bump `Version:` header and `AISA_VERSION` constant in `ai-site-assistant.php`
   - Bump `Stable tag:` in `readme.txt`
   - Add changelog entry in `readme.txt` (`== Changelog ==` section)
   - `git tag v<version> && git push origin v<version>`
   - GitHub Actions Release workflow fires, builds zip, publishes GitHub Release
   - WordPress sites auto-detect update via `AISA_Updater` polling Releases

**Important:** Always check for tag collisions (`git tag`) and verify the tag matches the code (`git show <tag>:ai-site-assistant/ai-site-assistant.php | grep AISA_VERSION`).

## Known issues & next TODOs

**Known issues:**
- Orphaned branch `michael/fix-working-indicator` still unmerged (predates recent sessions) — user hasn't given final decision on merge-vs-abandon
- Local WPCS toolchain fragile (Composer vendor issues ~3 times this session) — GitHub Actions CI is authoritative
- Binary `.xls` unsupported; users told to re-save as `.xlsx`/`.csv`

**Next work (discussed, not started):**
- **Add Vibe AI-like dashboard to plugin** — task cards/quick actions (Draft Post, Optimize SEO, Generate Images, etc.) instead of pure freeform chat
  - Add dashboard tabs in `render_chat()` 
  - Quick-action buttons auto-populate chat with templated prompts
  - Guided workflows: pick task → fill form → review → approve → done
  - Purely UI/UX changes, no backend changes needed (reuses existing `AISA_REST::chat` and `AISA_Tools::dispatch()`)
  - Would make plugin even more non-technical-friendly

**Test scenarios not yet completed:**
- Live Ahrefs/Gemini/Unsplash API calls (only mocked via `pre_http_request` so far)
- Private repo auto-updates with `AISA_GITHUB_TOKEN`
- Fleet check-in hub (multi-site dashboard)

## Deployment & update mechanism

- Public repo, no auth needed for Releases
- Private repo: define `AISA_GITHUB_TOKEN` in `wp-config.php` (fine-grained "Contents: Read")
- `AISA_Updater` class polls GitHub Releases daily, shows update on Plugins screen
- Users click "Update" or "Check for updates" (force) on Plugins screen
- If a commit lands on `main` without a tag, **no GitHub Release is created** — WordPress sees nothing to update to. Always tag after merging.

## Repo settings worth noting

- **Default branch on GitHub**: currently set to `Codex/sharp-mendel-e2p23s` (confusing; should be `main`)
- **GitHub Actions**: CI triggers on push to `main` + pull_request events. Release triggers on `v*` tags.
- **CI status checks**: must pass before allowing merge (set in branch protection rules, if any)

---

**Last updated**: 2026-07-07 (v0.7.0 shipped, Vibe AI dashboard UI discussed for next session)
