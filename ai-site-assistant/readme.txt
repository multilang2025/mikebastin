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

* `class-aisa-claude-client.php` — talks to POST /v1/messages via wp_remote_post.
* `class-aisa-tools.php`        — tool definitions + the executor (the security boundary).
* `class-aisa-agent.php`        — the tool-use loop, with a gate for write actions.
* `class-aisa-rest.php`         — the REST endpoint the admin UI calls.
* `class-aisa-settings.php`     — settings + chat page.
* `class-aisa-audit-log.php`    — records every write to a custom table.

== Installation ==

1. Copy the `ai-site-assistant` folder into `wp-content/plugins/`.
2. Activate the plugin (this creates the audit-log table).
3. Either set your key in **AI Assistant → Settings**, or — recommended —
   add `define( 'AISA_API_KEY', 'sk-ant-...' );` to `wp-config.php` so the key
   never lives in the database.
4. Open **AI Assistant** and start chatting.

== Usage ==

You drive the assistant from the **AI Assistant** chat page. Your message is the
prompt; Claude reads it and acts through the plugin's tools (search, read,
create, update, publish). Any change to your site pauses for an Approve / Cancel
confirmation before it runs.

Starter prompt — paste this first to confirm the connection and see what it can
do:

  You are connected to my WordPress site through this plugin. First, confirm the
  connection by listing my 5 most recent posts and pages with their ID, title,
  type, and status. Then, in one or two sentences, tell me what you can do here
  (search, read, draft, update, publish) and remind me that any change will pause
  for my approval before it runs. Do not change anything yet.

If that returns your posts, the API key and tools are working. More example
prompts:

* Find content:  "Find all draft posts that mention 'pricing'."
* Read a post:   "Show me the full content of post 42."
* Draft (write): "Draft a 300-word post announcing our new Saturday opening
                  hours and save it as a draft."
* Edit (write):  "Read post 42, then add a closing call-to-action paragraph and
                  update it."
* Publish (write): "Publish post 42." (you'll be asked to approve first)
* Site context:  "What theme and post types is this site using?"

Tips:

* Reads run immediately; writes (create / update / publish) always wait for your
  approval, so it is safe to ask exploratory questions.
* Reference posts by ID when you can — ask the assistant to search first if you
  do not know the ID.

== Security notes ==

* Every write action checks WordPress capabilities (`current_user_can`).
* New posts are always created as drafts; publishing is a separate, gated step.
* `update_post` rejects stale edits via a post_modified staleness check.
* Writable meta keys are allowlisted in `class-aisa-tools.php`.
* All model output is sanitized (`wp_kses_post`, `sanitize_text_field`) before
  it touches the database.

== Changelog ==

= 0.1.0 =
* Initial scaffold: chat UI, settings, tool-use loop, audit log.
* Tools: search_posts, get_post, create_post, update_post, publish_post,
  get_site_context. Writes are gated behind user approval.
