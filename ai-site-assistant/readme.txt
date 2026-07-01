=== AISA Connector ===
Contributors: betranslated
Tags: ai, claude, content, assistant
Requires at least: 6.3
Requires PHP: 8.1
Stable tag: 0.4.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

An AI assistant for WordPress that reads and edits your content using your own
Claude API key. You pay your provider per use — there are no daily limits.

== Description ==

AISA Connector adds a chat panel to wp-admin. Ask it to find content, draft
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
2. Either set your key in **AISA Connector → Settings**, or — recommended —
   add `define( 'AISA_API_KEY', 'sk-ant-...' );` to `wp-config.php` so the key
   never lives in the database.
3. Open **AISA Connector** and start chatting.

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

== Fleet check-in (optional) ==

See which of your sites run the plugin from one dashboard. It is opt-in and uses
no third-party service — one of your own sites acts as the hub.

1. Pick one site as the hub. In its `wp-config.php` add:

       define( 'AISA_CHECKIN_HUB', true );
       define( 'AISA_CHECKIN_TOKEN', 'a-long-random-shared-secret' );

   The hub gets an **AISA Connector → Sites** page listing every check-in.

2. On every site that should report (the hub can report to itself too), add:

       define( 'AISA_CHECKIN_URL', 'https://YOUR-HUB-SITE/wp-json/aisa/v1/checkin' );
       define( 'AISA_CHECKIN_TOKEN', 'a-long-random-shared-secret' );

   Use the SAME token everywhere — it is the shared secret that stops anyone
   else posting to your hub.

Each reporting site checks in once a day (and shortly after you visit wp-admin).
The payload is small: site URL, site name, plugin/WordPress/PHP versions, and
the active SEO engine — no content and no secrets. With none of these constants
defined, the feature is completely inert.

== Usage ==

You drive the assistant from the **AISA Connector** chat page. Your message is the
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

= 0.4.6 =
* Add a "Fact Check" tool powered by Perplexity Sonar via OpenRouter. The
  assistant can now verify a statistic, date, price, quote, or named study
  against the live web before it writes it into your content, and cite the
  sources Sonar returns. Fully opt-in: add an OpenRouter API key on the settings
  page (or the AISA_OPENROUTER_API_KEY constant in wp-config.php) to enable it;
  leave it blank and fact-checking stays off.
* Surface the plugin's main features next to the "AISA Connector" heading on the
  chat page so new users see at a glance what it does.

= 0.4.5 =
* Add an optional, self-hosted "fleet check-in" so you can see which sites run
  the plugin from one dashboard. Each site can report its URL, plugin/WordPress/
  PHP versions, and SEO engine once a day to a hub you control — and the hub is
  just another copy of this plugin (no separate service to host). A new
  "AISA Connector -> Sites" page on the hub lists every site and when it last
  checked in. Entirely opt-in via wp-config.php constants; with none set, nothing
  is sent or collected. See "Fleet check-in" below.

= 0.4.4 =
* Fix the recurring "The response is not a valid JSON response" on multi-step
  tasks (e.g. "improve EEAT"). The agent loop now performs ONE Claude call per
  HTTP request and the browser drives the steps, so a task that searches, reads,
  and edits no longer stacks several blocking API calls into a single request
  that the host/gateway timeout (nginx, php-fpm, Cloudflare) would kill. PHP's
  set_time_limit alone could not raise that gateway limit.
* The chat panel shows a "Working…" indicator while a multi-step task runs and
  caps the number of automatic steps so a tool loop cannot spin without end.

= 0.4.3 =
* Add targeted, fast edit tools so common SEO work no longer times out with
  "The response is not a valid JSON response": replace_in_post (swap one exact
  snippet), append_to_post (add a block at the end), get_seo/set_seo (meta
  tags), get_schema/set_meta (structured data). The assistant now prefers small
  edits over rewriting whole posts.
* Teach the assistant task "skills" via its system prompt: EEAT, NLP/
  readability, internal links, meta tags, and schema each get a concrete
  playbook, plus page-builder awareness (Classic/Gutenberg/Divi edit in
  post_content; Elementor body edits are flagged as unsupported while its SEO
  meta and schema still work).
* The four new write tools (replace_in_post, append_to_post, set_seo, set_meta)
  are gated behind the same Approve / Cancel confirmation as other writes.

= 0.4.2 =
* Fix "tool_use.input: Input should be an object" — a tool called with no
  arguments (empty input) round-tripped through PHP as an array and was rejected
  by the API. tool_use inputs are now always sent as objects.
* Fix "tool_use ids were found without tool_result blocks" — when the user typed
  a new message instead of clicking Approve, the pending tool call was left
  unanswered. The outgoing conversation is now repaired so every tool_use has a
  tool_result.

= 0.4.1 =
* Rename the plugin's display name to "AISA Connector" (folder slug, AISA_
  prefixes, and aisa/v1 REST namespace unchanged) to avoid confusion when
  connecting.
* Force serial tool use so the write-approval gate executes only the action the
  user approved (a turn with multiple write tool calls could previously run all
  of them off a single approval).

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
