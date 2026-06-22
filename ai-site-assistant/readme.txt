=== AI Site Assistant ===
Contributors: betranslated
Tags: ai, claude, content, assistant
Requires at least: 6.3
Requires PHP: 8.1
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

An AI assistant for WordPress that reads and edits your content using your own
Claude API key. You pay your provider per use — there are no daily limits.

== Description ==

AI Site Assistant adds a chat panel to wp-admin. Ask it to find content, draft
posts, or edit pages; it uses the Claude Messages API with tools to act on your
site. Because it calls Claude with *your* API key, usage is metered by your
provider rather than capped by a SaaS free tier.

Architecture (see the source for detail):

* `class-claude-client.php` — talks to POST /v1/messages via wp_remote_post.
* `class-tools.php`        — tool definitions + the executor (the security boundary).
* `class-agent.php`        — the tool-use loop, with a gate for write actions.
* `class-rest.php`         — the REST endpoint the admin UI calls.
* `class-settings.php`     — settings + chat page.
* `class-audit-log.php`    — records every write to a custom table.

== Installation ==

1. Copy the `ai-site-assistant` folder into `wp-content/plugins/`.
2. Activate the plugin (this creates the audit-log table).
3. Either set your key in **AI Assistant → Settings**, or — recommended —
   add `define( 'AISA_API_KEY', 'sk-ant-...' );` to `wp-config.php` so the key
   never lives in the database.
4. Open **AI Assistant** and start chatting.

== Security notes ==

* Every write action checks WordPress capabilities (`current_user_can`).
* New posts are always created as drafts; publishing is a separate, gated step.
* `update_post` rejects stale edits via a post_modified staleness check.
* Writable meta keys are allowlisted in `class-tools.php`.
* All model output is sanitized (`wp_kses_post`, `sanitize_text_field`) before
  it touches the database.

== Changelog ==

= 0.1.0 =
* Initial scaffold: chat UI, settings, tool-use loop, audit log.
