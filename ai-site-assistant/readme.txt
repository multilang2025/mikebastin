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

Use the packaged `ai-site-assistant.zip` from a GitHub Release (or build one with
`zip -r ai-site-assistant.zip ai-site-assistant`). Do NOT upload GitHub's
"Download ZIP" of the whole repo — that nests the plugin two folders deep and
WordPress reports "No valid plugins were found." The zip's root must be the
`ai-site-assistant/` folder, i.e. `ai-site-assistant/ai-site-assistant.php` at
the top.

1. **Plugins → Add New → Upload Plugin**, choose `ai-site-assistant.zip`, install,
   and activate (activation creates the audit-log table). Or copy the
   `ai-site-assistant` folder into `wp-content/plugins/`.
2. Either set your key in **AI Assistant → Settings**, or — recommended —
   add `define( 'AISA_API_KEY', 'sk-ant-...' );` to `wp-config.php` so the key
   never lives in the database.
3. Open **AI Assistant** and start chatting.

== Updates ==

The plugin checks this repo's GitHub Releases and shows updates on the
**Plugins** screen like any other plugin — click update to install.

To publish a new version:

1. Bump the version in `ai-site-assistant.php` (both the `Version:` header and
   the `AISA_VERSION` constant) and commit.
2. Tag and push: `git tag v0.2.0 && git push origin v0.2.0`.
3. The Release workflow verifies the tag matches the version, builds
   `ai-site-assistant.zip` (correctly structured), and publishes the GitHub
   Release. Sites pick up the update within a day (or via "Check for updates").

Notes:

* Public repo: works with no configuration.
* Private repo: define `AISA_GITHUB_TOKEN` in `wp-config.php` with a token that
  has read access to the repo (fine-grained "Contents: Read", or a classic token
  with the `repo` scope). Detection and one-click install both work — the zip is
  downloaded through GitHub's authenticated asset API. The token is only ever
  sent to `api.github.com` for this repo's release assets.
* The repo is set in `class-aisa-updater.php` (`AISA_Updater::REPO`).

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

= 0.4.0 =
* Add a /aisa/v1/postmeta REST endpoint that reads and writes SEO/schema post
  meta (Rank Math, Yoast, AIO SEO), including Rank Math structured-data
  (schema) entries, so the companion MCP server's get_meta/get_schema/set_meta
  tools can manage structured data. Access is restricted to those SEO prefixes
  and writes are audit-logged.

= 0.3.0 =
* Add a /aisa/v1/meta REST endpoint that exposes a post's SEO meta tags
  (Rank Math or Yoast — title, description, focus keyword, canonical, Open
  Graph, Twitter) and excerpt under stable field names, so the companion MCP
  server's get_seo/set_seo tools can read and write them.

= 0.2.0 =
* Extend the PHP time limit on assistant requests so long edits no longer fail
  with "The response is not a valid JSON response" on hosts with a short
  max_execution_time.
* Fix the write-approval resume so an approved create/update/publish actually
  executes.
* GitHub-release auto-updates (works on public repos; private repos via
  AISA_GITHUB_TOKEN).

= 0.1.0 =
* Initial scaffold: chat UI, settings, tool-use loop, audit log.
* Tools: search_posts, get_post, create_post, update_post, publish_post,
  get_site_context. Writes are gated behind user approval.
