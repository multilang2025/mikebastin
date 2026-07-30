# Multi-Site Persistent Connection Hub for the AISA MCP Bridge

**Status:** Approved implementation plan, not yet built. No files listed below have been modified — this document describes the intended change only.

## Context

Today, connecting Claude to a WordPress site through the AISA bridge (`php-mcp-bridge/`, hosted at betranslated.us) is a **single-site-per-connection** model: at OAuth authorize time, `authorize.php` shows a one-time radio-button picker of every registered site, the human clicks one, and that choice is baked permanently into the issued OAuth token (`oauth_tokens.site_token`). Switching to a different site requires disconnecting and reconnecting the connector in Claude.ai — there is no way to reach a second site from the same chat.

This mirrors how WPVibe used to work before it added persistent multi-site support with natural-language switching ("connect to my other site," "switch to example.com"). The goal here is the same UX: one Claude connection, many WordPress sites reachable concurrently, switchable by name mid-conversation — without spinning up new infrastructure, without touching the WordPress plugin side at all, and reusing the exact "loosely-specified string resolved against a known list" pattern already proven out by `AISA_Gsc_Client::resolve_property()` / `AISA_Ga_Client::resolve_property()` for Google properties.

**Hard constraints:** same server (betranslated.us, same `bridge.sqlite`, no new infrastructure), same argument shape/format as the existing `site` parameter on `gsc_top_pages`/`ga_traffic_overview`/etc.

All of the following was verified by direct inspection of the real files on `claude/sharp-mendel-e2p23s` — `mcp-router.php`, `token.php`, `mcp.php`, `db.php` were read in full before this plan was written.

## What registering a new site still looks like (unchanged)

This plan doesn't touch how a WordPress site joins the bridge. That's still the existing one-time step: on the new site, **AISA Connector → MCP Connector** runs its connect flow, which calls `register.php` (POSTs `wp_url`/`wp_username`/`wp_app_password`), upserting one row into `sites`. What changes is that once registered, a site becomes reachable from **every existing** Claude.ai connector session immediately — no reconnect required — instead of only showing up the next time someone happens to disconnect and reconnect.

The very first time a Claude.ai connector is authorized against this bridge, `authorize.php`'s picker still shows once, to choose a starting default site. Nothing after that first connection ever requires going back to that screen again.

## Why extend the current design instead of a fuller redesign

`mcp-router.php`'s `execute_tool($site, $name, $args)` / `execute_core_tool($site, ...)` / `wp_fetch($site, $path, ...)` already thread a single `$site` array end-to-end. There's no per-account scoping today (`sites` is a flat global list; `authorize.php`'s picker already lets anyone completing OAuth choose *any* registered site) — so making all sites concurrently reachable via a switch command doesn't cross a new security boundary, it just removes a UI click. A full multi-tenant/accounts redesign would solve a problem that doesn't exist here and would violate the "same server, minimal footprint" constraint. Extending the current design is the right scope.

## Design

### 1. Make `oauth_tokens.site_token` mutable, add `home_site_token` for audit

**`db.php`** — in the migrations block inside `get_db()`:
```sql
ALTER TABLE oauth_tokens ADD COLUMN home_site_token TEXT; -- wrapped in try/catch like the existing refresh_token migration
UPDATE oauth_tokens SET home_site_token = site_token WHERE home_site_token IS NULL;
CREATE TABLE IF NOT EXISTS site_switch_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token_suffix TEXT NOT NULL,   -- last 8 chars only, not the full bearer secret
    from_site_token TEXT,
    to_site_token TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
```
`site_token` keeps its current meaning ("what does this request currently resolve to") but becomes mutable; `home_site_token` is set once at issuance and never touched again — purely for support/debugging ("originally connected to X, currently switched to Y").

**`token.php`**:
- `aisa_issue_tokens($db, $site_token, $home_site_token = null)`: insert both columns (`$home_site_token ?? $site_token` on first issuance).
- Refresh-token path (`grant_type === 'refresh_token'`): currently `SELECT site_token FROM oauth_tokens WHERE refresh_token = ?` then reissues for that same site — this is the exact bug to fix, since it means "the site you switched to" would be silently lost on every 30-day token refresh. Change the `SELECT` to pull both `site_token, home_site_token`, and pass both through to `aisa_issue_tokens()` unchanged, so the *current* switched-to site survives rotation, not just the original.

### 2. Shared `resolve_site()` helper (mirrors `resolve_property()`, but stricter)

New function in `mcp-router.php`:
```php
function resolve_site($needle, $sites) {
    $needle = trim((string) $needle);
    if ($needle === '') throw new Exception('No site specified.');

    foreach ($sites as $s) {
        if ($s['token'] === $needle || normalize_host($s['wp_url']) === normalize_host($needle)) {
            return $s;
        }
    }
    $matches = array_values(array_filter($sites, fn($s) => stripos($s['wp_url'], $needle) !== false));
    if (count($matches) === 1) return $matches[0];
    if (count($matches) > 1) {
        throw new Exception("\"$needle\" matches multiple sites: " . implode(', ', array_column($matches, 'wp_url')) . '. Be more specific, or call list_sites.');
    }
    throw new Exception("\"$needle\" isn't a registered site on this bridge. Call list_sites to see what's available.");
}
```
Note: unlike `AISA_Gsc_Client::resolve_property()` (which silently takes the first substring hit on ambiguity), this **explicitly detects and rejects ambiguous matches** — deliberately stricter, since this switches an entire WordPress site rather than a reporting property. `normalize_host()` is a small local port of the existing WP-side logic (strip scheme/www, lowercase), no WordPress dependency needed.

### 3. New bridge-level tools + per-call `site` override

In `execute_tool($site, $name, $args, $sites)` (gains a `$sites` param — the full `SELECT token, wp_url FROM sites` list, fetched once per `tools/call` in `handle_mcp_request()`):

- **`list_sites`** (no args) — returns every site's `wp_url` + a `current: bool` flag. Local DB read only, no `wp_fetch()`. Never returns raw tokens/credentials.
- **`switch_site`** (`{site: string}`) — resolves via `resolve_site()`, then `UPDATE oauth_tokens SET site_token = ? WHERE access_token = ?` (needs the raw bearer — see mcp.php change below) + one `INSERT INTO site_switch_log`. Returns text that **loudly restates the new target** ("Switched. Every following call now targets: example.com"). On a direct `?token=` connection (no `oauth_tokens` row — confirmed in `mcp.php`, that path never touches `oauth_tokens`), returns a clear "switching isn't available on a direct connection" error instead of attempting the UPDATE.
- **`get_current_site`** (no args) — returns the presently-bound site, plus the `home_site_token`'s site if it differs.
- **Per-call `site` override on every other tool** (mirrors GSC/GA4 exactly): if `$args['site']` is present, resolve it via `resolve_site()` and use it for **this call only** (never persisted), then `unset($args['site'])` before forwarding to `wp_fetch()`/core-tool logic so the bridge-only key never leaks into the WordPress REST payload. Add the `site` property to every tool's `inputSchema.properties` in `get_tools_schema()`, **and** inject it onto whatever `get_remote_tools()` returns from a site's live `/aisa/v1/tools` (inside `normalize_tools_for_mcp()`) — this is what makes the WP-side plugin need zero changes while still gaining the override.

### 4. Solve "serverInfo can't be live-updated"

`initialize`'s `serverInfo.name` (`'AISA — ' . $site['wp_url']`) is sent once and can't be pushed again mid-session. Fix: in `handle_mcp_request()`'s `tools/call` branch, stamp `$response['result']['_site'] = $target_site['wp_url']` on **every** tool response, success or error. This gives the model continuous, unambiguous ground truth regardless of switches or per-call overrides, without needing a protocol feature that doesn't exist here.

### 5. `mcp.php` — thread the raw bearer token through

Bearer parsing (lines ~44-77) already resolves `$site` from `oauth_tokens.access_token`; `switch_site` needs that raw `$bearer` string (not just the resolved site) to know which `oauth_tokens` row to `UPDATE`. Add `$bearer = null;` before the auth branch, set it inside the `Bearer` regex match, and pass it as a new parameter into both existing `handle_mcp_request($site, $payload)` call sites (the POST branch at line 97, and the SSE polling loop at line 152) — both already run through the same bearer-parsing block, so this is symmetric with no special-casing needed per transport.

## Guardrails (the "don't act on the wrong site" requirement)

1. `resolve_site()` **never guesses** on zero or ambiguous matches — always throws (already caught cleanly by the existing `try/catch` in `handle_mcp_request()`'s `tools/call` branch, so no new error-plumbing needed).
2. Every tool response — read or write — carries `_site`, so a wrong-site write is visible immediately in the same turn, not discovered later.
3. `site_switch_log` gives an audit trail of every switch (from/to site, truncated token, timestamp) — same one-row-per-action shape as the WordPress plugin's own `AISA_Audit_Log::record()`, just one layer down in the bridge's own SQLite file.
4. Explicitly **not** fixed here (flag as a separate follow-up, not blocking this work): `sites.wp_username`/`wp_app_password` remain plaintext in `bridge.sqlite`, protected only by `.htaccess`. This refactor doesn't worsen that — today's picker already exposes the full site list to anyone completing OAuth — but it's worth encrypting at rest at some point, separately.

## Files to change

| File | Change |
|---|---|
| `php-mcp-bridge/db.php` | Migration: `home_site_token` column + backfill; new `site_switch_log` table |
| `php-mcp-bridge/token.php` | `aisa_issue_tokens()` signature + refresh-grant path preserve both columns across rotation |
| `php-mcp-bridge/mcp-router.php` | New `resolve_site()`/`normalize_host()`; `handle_mcp_request()` loads `$sites` once per `tools/call`, stamps `_site` on every response; `execute_tool()` gains `$sites` param, three new tool branches, per-call `site` override + strip; `get_tools_schema()` gains the three new tools + `site` property on every existing tool; `get_remote_tools()`/`normalize_tools_for_mcp()` inject `site` onto WP-plugin-sourced tools too |
| `php-mcp-bridge/mcp.php` | Thread raw `$bearer` through both `handle_mcp_request()` call sites (POST + SSE loop) |

**No changes needed:** `authorize.php` (still the correct one-time picker for *first* connection), `register.php`, `revoke.php`, `oauth-metadata.php`, `oauth-register.php`, `oauth-resource.php`, `message.php`, or anything in `ai-site-assistant/` (the WordPress plugin) — the whole refactor is confined to the bridge, on the same server, per the constraint.

## Verification plan (live test against betranslated.us, 2+ real registered sites)

1. Confirm migrations run idempotently against the existing production `bridge.sqlite` before relying on them.
2. In a live Claude.ai chat: `list_sites` → confirm every registered `wp_url` appears with a correct `current` flag.
3. `switch_site` with a substring of a second site's domain → response names the new target; confirm a new `site_switch_log` row.
4. A read tool with **no** `site` arg right after → `_site` in the response matches the newly-switched site, not the original.
5. A write tool (`create_post` as draft) with no `site` arg → confirm via `get_post`/wp-admin that it landed on the switched-to site, not the originally-authorized one.
6. Same write tool with an explicit `site` argument pointing at a *third* site → lands there; a follow-up call with no `site` arg still targets the persistently-switched site (proves the per-call override doesn't leak into the persistent pointer).
7. `switch_site` with an unknown string → clean `isError: true`, no guessing.
8. If 3+ sites share a substring, `switch_site` with that ambiguous string → errors listing all matches.
9. Force/simulate a token refresh → confirm the switched-to site survives rotation (`site_token` preserved), while `get_current_site` still correctly reports `home_site_token`'s site as "originally connected."
