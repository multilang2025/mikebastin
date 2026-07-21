=== AISA Connector ===
Contributors: betranslated
Tags: ai, claude, content, assistant
Requires at least: 6.3
Requires PHP: 8.1
Stable tag: 1.2.2
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
* `class-aisa-approval-log.php`— read-only admin page over the audit log.
* `class-aisa-skills.php`       — on-demand task playbooks, loaded via load_skill.
* `class-aisa-wpcli.php`        — WP-CLI-equivalent site admin, no shell binary.
* `class-aisa-abilities.php`    — bridge to WP core's Abilities API (6.9+).
* `class-aisa-theme-files.php`  — theme file tools + the draft-first sandbox.
* `class-aisa-unsplash-client.php` — stock-photo search for upload_media.
* `class-aisa-ahrefs-client.php` — Ahrefs API v3 client for the SEO-intelligence tools.
* `class-aisa-gemini-client.php` — Gemini (Nano Banana Pro) client for generate_image.
* `class-aisa-file-parser.php` — CSV/XLSX ingestion for the chat's file-attachment feature.

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
* Writable options (`wp_cli_set`) are allowlisted in `AISA_WPCLI::OPTION_ALLOWLIST`
  and deliberately exclude anything that could change who can log in or what
  code runs.
* Theme file writes only ever target a "<slug>-aisa-draft" copy, never the
  live theme; file paths are resolved and checked against the theme root to
  block path traversal, and PHP writes are syntax-checked before saving.
* `run_ability` (WordPress Abilities API) is always treated as a write and
  requires approval, since the API gives no reliable read/write flag to
  gate on more precisely.

== Changelog ==
= 1.2.2 =
* Added WP Fastest Cache to flush_caches' detected caching layers. Found this checking mikebastin.com directly: it's the only cache plugin actually active there, and it wasn't on the original list (WP Rocket, W3 Total Cache, LiteSpeed Cache, WP Super Cache, SiteGround Optimizer, Elementor) -- flush_caches would have silently done nothing useful on this exact site.

= 1.2.1 =
* Added page-builder-aware warnings to replace_in_post, append_to_post, and bulk_replace_in_posts: advisory only, never blocks the edit. On an Elementor page (detected via _elementor_data postmeta), warns that the edit may not appear on the live page since Elementor renders from that JSON structure, not post_content. On a Divi page (detected via [et_pb_ shortcodes in post_content), warns when the touched find/replace/html text looks like it crosses a shortcode-attribute boundary (_builder_version, global_colors_info, or a shortcode tag), so a boundary mistake gets flagged instead of silently corrupting a module.

= 1.2.0 =
* Added bulk_replace_in_posts: apply the same exact text replacement across up to 50 posts/pages in one call, instead of one replace_in_post call per post. Each post is judged independently by the same find-must-match-exactly-once rule as replace_in_post -- a post with no match or an ambiguous multi-match is skipped and reported, not a hard failure for the whole batch.
* Added flush_caches: flush WordPress's object cache plus whichever of Elementor, WP Rocket, W3 Total Cache, LiteSpeed Cache, WP Super Cache, or SiteGround Optimizer are actually active, so a content edit becomes visible immediately instead of waiting for cache expiry. Detects what's present rather than assuming any one is active; never touches content, admin-only.
* Clarified set_meta's description to spell out that it already covers full Rank Math JSON-LD schema writes (e.g. rank_math_schema_Article) -- this worked before but wasn't documented in the tool description, so it was easy to miss.
* Added db_query: a read-only SELECT tool against the site's database, gated to administrators. This is the escape hatch for data no purpose-built tool covers -- a form plugin's entries table (Formidable, Gravity Forms, WPForms...), WooCommerce order meta, or any other plugin's custom table -- without needing a bespoke integration per plugin. Ported the safety model from WPVibe's open-source db-query tool: SELECT/DESCRIBE/SHOW/EXPLAIN SELECT only, every mutating keyword blocklisted (with comment-stripping so a keyword can't hide inside one), executable MySQL comments and multi-statement injection rejected, SELECT INTO/FOR UPDATE blocked, and LIMIT force-enforced (default 100, max 1000) so a query with no LIMIT of its own can't dump an entire table. "{prefix}" is substituted for the real table prefix so the model doesn't have to guess it.

= 1.1.2 =
* Fixed replace_in_post rejecting valid, non-conflicting edits with "Post changed since you read it." The expected_modified timestamp guard could false-positive because WordPress legitimately bumps post_modified without a real content edit (e.g. Heartbeat autosave from an open editor tab, or a persistent object cache serving a slightly different get_post() read across two requests) -- and a full round-trip through update_post carries real risk (a full-content overwrite, no dry-run) that this false-positive was pushing users toward for edits that should've used the safer targeted tool. replace_in_post no longer gates on the timestamp: its own find-must-match-exactly-once check is a strictly stronger safety guarantee for a targeted replace, since the edit only proceeds if the snippet is still present verbatim and unique in the current content. expected_modified is still accepted (unused) for backward compatibility. update_post, publish_post, and append_to_post are unchanged -- they have no equivalent content-based safety net, so they still require the timestamp match.

= 1.1.1 =
* Fixed root pages sometimes producing hallucinated GSC numbers: GSC's "equals" page filter is an exact string match, and root URLs are the ones most likely to be typed without the trailing slash Google actually stores them with -- a mismatch silently returns an empty (not erroring) result, which invited the model to paper over it with a plausible-sounding guess. gsc_page_queries/gsc_page_report now retry the with/without-trailing-slash variant automatically, and explicitly flag "no_matching_rows": true when GSC genuinely has no data for the URL, with tool descriptions telling the model to report that plainly instead of inventing numbers.

= 1.1.0 =
* Google Search Console tools now work across every domain verified in Search Console under the same connected Google account, not just this WordPress site -- one GSC OAuth connection covers all of them, no per-domain redirect URI needed in Google Cloud. Added a new gsc_list_properties tool, and an optional "site" argument on gsc_top_pages/gsc_page_queries/gsc_page_report to target a different domain (page content enrichment is skipped for domains that aren't this WP install, since there's no local post to read).
* The MCP connector now names itself after the actual WordPress site a token is bound to (e.g. "AISA — mikebastin.com") instead of the bridge's own generic hostname, so Claude can no longer mistake the bridge's technical URL for the site it's managing.

= 1.0.7 =
* Fixed load_skill's tool description: it hardcoded a stale, partial skill list (missing theme_editing, images, image_generation, seo_intelligence, gsc_intelligence) and referenced "the system prompt" for the full catalog -- but that catalog is only ever injected into the disabled in-admin chat's system prompt, never seen by Claude.ai/Desktop/Cursor through the connector. The description now embeds the full, live catalog (name + summary) directly, generated from AISA_Skills::CATALOG, so it can never drift out of sync again and is actually visible wherever the tool is used.

= 1.0.6 =
* Fixed the Google Search Console property picker (and Disconnect button) never actually saving. Its small admin-post form was nested inside the page's main options.php settings form, which is invalid HTML -- browsers handle it unpredictably, and the submit was being swallowed by the outer form instead of reaching our handler, so picking a property silently reverted to whatever was selected before. Moved the whole GSC connection section outside the main form.

= 1.0.5 =
* Fixed the Google Search Console connect flow always failing with "invalid_state". The OAuth state was verified with wp_verify_nonce(), which is tied to the logged-in user/session -- but Google's redirect back to our callback is a cross-site top-level navigation, and whether the browser resends the WP auth cookie on it depends on cookie policy that varies by host/security plugin. When it didn't, the callback saw no logged-in user and failed verification even though the admin had done everything right. Replaced with a random, single-use state token stored server-side in a transient, which doesn't depend on any session/cookie context.

= 1.0.4 =
* Removed include_granted_scopes from the Google Search Console connect URL. It caused Google to bundle in any scopes previously granted to the same OAuth Client ID (e.g. Drive/Gmail from an earlier, unrelated use of that client), showing up as unexpected extra permission requests on the consent screen even though this integration only ever requests one read-only Search Console scope.

= 1.0.3 =
* Added Google Search Console integration: connect via OAuth (Settings → Google OAuth Client ID/Secret → Connect), then use gsc_top_pages, gsc_page_queries, and gsc_page_report to diagnose real Google-reported ranking performance for any page, alongside the existing Ahrefs tools.
* Added the new gsc_intelligence skill: a playbook for interpreting GSC metrics (CTR issues vs. thin-content near-misses vs. discovery problems vs. cannibalization) and proposing grounded, numbers-backed edits.
* Added an "Available Skills" panel to the MCP Connector page listing every skill the assistant can load on demand.

= 1.0.2 =
* Fixed AISA's own admin CSS/JS never loading on the Workspace and MCP Connector pages. The page-detection matched a guessed hook-suffix string that WordPress actually derives from sanitize_title() of the menu title text, not the slug -- so on any site with a translation plugin (or anything else filtering admin menu titles), it never matched and no styling was ever applied. Now matches on the page's own query-string slug instead, which never changes.
* Same underlying issue affected the third-party-notice-hiding CSS (it targeted WordPress's computed body class); switched to a fixed class added via admin_body_class instead.

= 1.0.1 =
* MCP Connector step 3 is now a per-client walkthrough (Claude.ai web / Claude Desktop+Code / Cursor tabs) with explicit numbered clicks and a ready-to-paste Cursor mcp.json snippet, instead of a one-line summary.
* New tool: seo_competitor_report — one Ahrefs competitor comparison for a specific page (metrics, top competitor, their best pages, and the page's own content) in a single call instead of chaining four or five separate tool calls.
* Fixed the MCP bridge hanging indefinitely on a slow upstream call (e.g. a chain of Ahrefs lookups): added connect/total timeouts to the bridge's WordPress call and raised its own script time limit so a stall now fails with a clear error instead of leaving the chat stuck "generating."

= 1.0.0 =
* Redesigned the MCP Connector onboarding screen: brand header with a live connection-status pill, a centered "Your AI just learned WordPress." hero with a workspace CTA, and a light-gray multi-step card.
* Copy fields are now real `<input readonly>` elements (was `<code>`) with a more reliable copy handler (clipboard API + execCommand fallback) — fixes copy buttons not working in some browsers.
* Removed the duplicate "Open AISA Connector" button from the Workspace page header (the disabled-chat notice already links to the same MCP Connector page).
* Hide third-party admin notices (other plugins' nags, e.g. mail-delivery warnings) on AISA's own admin pages for a cleaner onboarding screen. This plugin does not use admin_notices itself, so nothing of its own is affected.

= 0.9.9 =
* Multi-tenant MCP bridge: the OAuth "Allow" screen now lets you pick which registered WordPress site to connect, so one bridge can serve many sites over Claude.ai web.
* Expose the full tool set through the connector: add a /aisa/v1/tools catalogue endpoint and widen the remote allowlist so Claude.ai can use every tool the plugin offers (Ahrefs, SEO, WP-CLI, theme, abilities) except the internal get_site_context.

= 0.9.8 =
* Fix OAuth discovery on shared hosting: create physical .well-known/ directory files instead of relying on .htaccess rewrites, which fail on LiteSpeed/Nginx stacks.

= 0.9.7 =
* Fix OAuth redirect separator bug in authorize.php so Claude.ai web callback works correctly.
* Fix redirect_uri comparison in token.php (trim trailing slashes) to prevent false mismatch.

= 0.9.6 =
* Add OAuth dynamic client registration (RFC 7591) so Claude.ai web can register itself and complete the connector sign-in flow.

= 0.9.5 =
* Add OAuth 2.0 support to php-mcp-bridge so Claude.ai web Connectors work (authorize.php, token.php, .well-known discovery, PKCE). MCP Connector page now shows two URLs: OAuth URL for Claude.ai web and token URL for Claude Desktop/Code.

= 0.9.4 =
* Fix MCP Connector: restore original Connect flow broken in 0.9.3; persist connection URL across page reloads without altering the bridge URL input logic or duplicating copy-button handler.

= 0.9.3 =
* MCP Connector: bridge URL is now pre-filled from the site domain so users just click Connect with no typing. Connection URL and state persist across page reloads — returning users see step 3 ready immediately without reconnecting.

= 0.9.2 =
* Fix the MCP Connector checklist showing doubled step numbers (e.g.
  "2. 2", "3. 3") -- wp-admin's own core CSS applied native list markers
  with higher specificity than the plugin's list-style: none, right next
  to the plugin's own numbered/checkmark circles. Switched the checklist
  from an ordered to an unordered list and qualified the reset with .wrap
  so it can't lose that specificity fight again.

= 0.9.1 =
* Shift the plugin's primary interaction model from an in-admin chat box
  to the MCP Connector: drive this site from an external AI client
  (Claude, ChatGPT, Cursor) through your own hosted AISA Bridge instead.
* Disable the in-admin chat workspace (the page stays in the admin menu,
  showing a clear notice and a link to the MCP Connector, so it can be
  re-enabled later without rebuilding it).
* Redesign the MCP Connector page as a clean three-step connect flow
  (install, connect the bridge, add the URL to your AI client) with a
  status pill and per-client setup instructions, instead of the previous
  chat-testing wizard.

= 0.9.0 =
* Add an opt-in "Use Gemini 2.5 Flash for chat instead of Claude" checkbox
  in Settings, for sites that would rather stay on Gemini's free tier than
  pay per token. Reuses the existing Gemini API key. A new
  AISA_Gemini_Chat_Client translates the same conversation/tool format
  AISA_Agent already builds into Gemini's function-calling format and
  back, so nothing else in the plugin needs to know or care which model
  answered. Self-throttled to a few requests per minute and ~200/day --
  deliberately under Google's published free-tier caps -- so it always
  fails with a clear message instead of a raw error once used up, rather
  than risking the underlying Cloud project tipping into metered billing.
  Off by default; Claude remains the default chat model.
* Fix a latent gap in the write-approval gate that would only have
  surfaced with a second LLM provider: Gemini allows several function
  calls in one response by default, unlike Claude's
  disable_parallel_tool_use. The new client only ever surfaces the first
  function call per turn, so the one-write-per-approval guarantee holds
  regardless of which model is answering.

= 0.8.6 =
* Fix distributed-client updates never showing up. The plugin's repo was
  private, and the fallback GitHub token added in 0.8.4 for distributed
  zips was never actually substituted with a real value at build time --
  every client site received the literal placeholder, meaning zero token
  against a private repo's release API, meaning updates silently never
  surfaced. The repo is now public (audited for anything sensitive in its
  history first; nothing was found) so update checks and downloads need no
  token at all, and the fallback-token logic has been removed rather than
  wired up, since baking a shared credential into every distributed zip
  was a real exposure the moment more than one client had a copy.

= 0.8.5 =
* Fix a silent JSON-encoding failure on reads: PHP's json_encode() returns
  false on invalid UTF-8, and every read tool (get_post, search_posts,
  get_page_html, etc.) passed that false straight through as tool_result
  content instead of the real data, which the Claude API then rejected.
  Every wp_json_encode() call site in class-aisa-tools.php now retries once
  through a UTF-8 cleanup pass before giving up.
* Fix get_page_html truncating long pages with a raw byte-offset substr(),
  which can slice a multi-byte UTF-8 character in half (emoji, smart
  quotes, non-Latin text) and produce exactly the invalid-UTF-8 string the
  fix above has to recover from. Switched to mb_strcut(), which truncates
  at the nearest whole character instead.

= 0.8.4 =
* Add fallback GitHub token logic to the native updater, enabling seamless auto-updates for distributed ZIP files.


= 0.8.3 =
* Replaced the Node.js MCP server (`wp-mcp-server`) with a lightweight, standalone PHP Hosted Bridge (`php-mcp-bridge`).
* Added a new WPVibe-style "Connect to Claude Desktop/Web" section in settings to securely generate connection URLs for the bridge.
* The PHP bridge completely eliminates the need to run Node.js on your hosting provider, allowing native operation on shared hosting environments via SQLite and Server-Sent Events (SSE).

= 0.8.1 =
* Redesign the MCP Connector page as a plain-language, four-step wizard
  (download, connect, register, say hello) with copy-to-clipboard command
  snippets, instead of a single block of developer-facing setup docs. No
  jargon like "npm" or ".env" is required reading -- the wizard tells you
  exactly what to paste and where.
* Align the "Open AISA Connector" / "Back to Workspace" button on the
  workspace and wizard headers to the same baseline as the page title,
  instead of sitting in its own row above it.
* Compact the workspace's feature checklist from eleven single-line bullets
  into four grouped ones, cutting the vertical space it takes without
  dropping any of the underlying capabilities.

= 0.8.0 =
* Add an "Open AISA Connector" button to the chat workspace header, linking to
  a new AISA Connector -> MCP Connector page. That page walks through setting
  up the local MCP server (wp-mcp-server) step by step -- npm install, the
  .env values it needs, generating a WordPress Application Password, and
  registering it with an MCP client -- and embeds a second, independent chat
  gateway so you can sanity-check the connection before switching to Claude
  Code or Claude Desktop. It reuses the exact same /aisa/v1/chat endpoint and
  admin/js/app.js as the standalone workspace; no backend or security changes.
* Fix an unresolved git merge-conflict left committed in this readme's
  "Stable tag" line.

= 0.7.0 =
* MCP Bridge v2: the wp-mcp-server (Prong 2) now has full feature parity with
  the in-dashboard chat (Prong 1). Eight new tools are exposed to external AI
  clients (Claude Code, Claude Desktop, Cursor, Windsurf) through a new plugin
  REST endpoint (POST /aisa/v1/tool) that proxies to the existing tool executor
  -- one codebase, one security boundary. API keys for Gemini, Ahrefs, and
  Perplexity stay in WordPress; the MCP server never needs them.
* New MCP tools: generate_seo_image (Nano Banana Pro / Gemini AI image
  generation), commit_image (save a generated image into the Media Library),
  replace_in_post (targeted find/replace without full-content rewrites),
  append_to_post (add FAQ/author/CTA blocks), search_images (Unsplash stock
  photos), fact_check (Perplexity Sonar verification), get_page_html (live
  rendered HTML), and load_skill (skill playbooks).
* Content-intercept: create_post and update_post now scan submitted HTML for
  <h2> sections without images and flag them in the tool response, so the
  agent can suggest using generate_seo_image -- advisory only, the user
  decides.
* Credential infrastructure: the MCP server now loads environment variables
  from a .env file (via dotenv), with a committed .env.example template and
  a .gitignore that excludes the real .env.
* The plugin REST endpoint uses an explicit allowlist so only the 8 bridged
  tools are reachable from MCP; internal-only tools (get_site_context, etc.)
  stay private.
* No changes to the in-dashboard chat (Prong 1) -- it works identically to
  v0.6.4.

= 0.6.4 =
* Fix "The response is not a valid JSON response" still surfacing on long
  multi-step tasks even after the 0.6.3 fix. That fix stopped a tool's own
  latency from stacking on top of a Claude call, but on a long task the
  Claude call itself -- the full conversation is resent every turn -- can
  outlast the site's own front-end gateway/CDN timeout on the inbound
  browser-to-WordPress connection, independent of any tool. The chat UI now
  retries that specific transient failure automatically (briefly, a bounded
  number of times) before giving up, since a failed step never changes the
  conversation state.

= 0.6.3 =
* Fix "The response is not a valid JSON response" reappearing on tasks that
  use a tool which itself calls a slow third-party API -- most visibly
  competitor comparisons (Ahrefs) and image generation (Gemini). A tool call
  was still being dispatched inline, in the same request as the Claude call
  that requested it, so that tool's own latency stacked directly on top of
  Claude's and could exceed a host/gateway timeout even though PHP's own
  execution limit was never reached. Every request now does at most one
  network-bound operation -- either the Claude call, or a single tool
  dispatch -- generalizing the same one-step-at-a-time approach already used
  for write-approval. The per-task step cap is doubled (16 -> 32) to
  preserve the same effective task-complexity ceiling now that a tool call
  costs two requests instead of one.

= 0.6.2 =
* Fix the "Working…" indicator drifting to the top of the chat log during a
  multi-step task (visible on longer chains, e.g. comparing to competitors)
  instead of staying pinned as the last, in-progress line. append() now
  inserts new messages above the indicator while it's showing, rather than
  after it.

= 0.6.1 =
* UI polish: Send and Generate Images are now stacked vertically at the same
  size instead of side by side, and the "AISA Connector" heading with its
  feature checklist is centered to match the chat box below it.

= 0.6.0 =
* Fix a real regression: the assistant answered once and stopped instead of
  continuing a multi-step task. AISA_REST::chat() built its JSON response
  without forwarding the `continue` flag AISA_Agent::run() already computed,
  so the browser's auto-continue loop never fired -- introduced with the
  original v0.4.4 fix landing on a branch that never made it into main.
* Add a "Generate Images" button next to Send: it sends the same message but
  explicitly invokes the image_generation skill/generate_image tool, and
  only appears once a Gemini API key is configured. Send keeps working
  exactly as before for everything else.
* Center the chat log and input row, and add a paperclip "attach file"
  button that lets you attach a .csv or .xlsx file (e.g. keyword/competitor
  exports) to a message. The file is parsed server-side (no Composer
  dependency -- native fgetcsv() for CSV, ZipArchive+DOMDocument for .xlsx)
  and its data is framed as the SOURCE OF TRUTH for any figures the
  assistant uses in its answer. Legacy .xls is not supported; re-save as
  .xlsx or .csv. Malformed, empty, oversized, or wrong-encoding files fail
  with a clear message instead of a wasted API call or a fatal error.

= 0.5.5 =
* Add original AI image generation via Nano Banana Pro (Gemini 3 Pro Image):
  a new generate_image tool creates artwork from a text description instead
  of only searching stock photos. Hyper-realism and a strict no-text-in-image
  constraint are enforced automatically on every generation -- never left to
  the model to remember. A new image_generation skill teaches the assistant
  to fully read the target post/page for context before generating, and to
  deliberately vary composition/palette/mood across multiple images in the
  same task so a set doesn't look repetitive.
* The write-approval dialog now shows a visual thumbnail preview before you
  approve saving a generated image, instead of an unlabeled "Approve?" with
  no context.
* Technical note: generated images are cached briefly server-side and never
  round-tripped through the Claude conversation as raw data -- only a small
  reference id is exchanged, avoiding a multi-hundred-thousand-token cost per
  image. upload_media now accepts that reference alongside its existing URL
  input.
* Fully opt-in: add a Gemini API key on the settings page (or the
  AISA_GEMINI_API_KEY constant in wp-config.php) from Google AI Studio.
  Each generated image is a billed, metered API call. Leave the key blank
  and image generation stays off.

= 0.5.2 =
* Add SEO intelligence via Ahrefs, so the assistant can answer questions the
  WordPress database can't -- e.g. "what are my least-performing articles?"
  and "how do I compare to my competitors, and how can I improve?". Three
  read-only tools: ahrefs_top_pages (rank your pages by estimated organic
  traffic, worst or best first; point it at a competitor to study their best
  content), ahrefs_organic_competitors (rival domains plus the keyword gap
  they rank for that you don't), and ahrefs_domain_metrics (organic traffic,
  keyword counts, and traffic value for head-to-head comparison). A new
  "SEO intelligence" skill teaches the assistant how to chain them.
* Fully opt-in: add an Ahrefs API key on the settings page (or the
  AISA_AHREFS_API_KEY constant in wp-config.php). Requires an Ahrefs plan
  with API access; each request consumes Ahrefs API units. Traffic and
  keyword figures are Ahrefs estimates from its own index, not the site's
  own analytics. Leave the key blank and the tools stay off.

= 0.5.1 =
* Fix the update checker's "Check Again" not showing a newly published
  release for up to 6 hours. AISA_Updater cached the GitHub release lookup
  separately from WordPress's own update-check throttle, and nothing
  cleared that cache when a user asked for a fresh check. It now honors the
  same `?force-check=1` signal WordPress's own "Check Again" button uses,
  and the default cache is shortened from 6 hours to 1 (still comfortably
  under GitHub's unauthenticated rate limit for a single site) so updates
  surface faster even without a manual force-check.

= 0.5.0 =
* Add an on-demand "skills" system: the EEAT/fact-checking/NLP/internal-links/
  meta/schema/page-builder playbooks moved out of the static system prompt
  into a load_skill tool the assistant calls only when a task needs one,
  cutting the baseline token cost of every turn.
* Add WP-CLI-equivalent site administration (wp_cli_get/wp_cli_set): list and
  activate/deactivate plugins, list and activate themes, read/write an
  allowlisted set of options, list users, and read the WordPress/PHP version
  -- all via native PHP, no exec()/shell_exec(), so it works on locked-down
  shared hosting.
* Add a bridge to WordPress core's Abilities API (WP 6.9+): discover_abilities
  lists capabilities other plugins have registered, run_ability executes one.
  Returns a clear message if the site doesn't have the Abilities API yet.
* Add theme file tools (list_theme_files, read_theme_file, search_theme_files)
  and a draft-first sandbox (create_draft_theme, write_theme_file,
  get_theme_preview_url, publish_draft_theme, delete_draft_theme). Edits only
  ever happen in a "<slug>-aisa-draft" copy -- the live theme's files are
  never touched until you explicitly publish. PHP writes are syntax-checked
  before saving.
* Add stock-photo search and upload (search_images, upload_media) via
  Unsplash, with an optional access key on the settings page. Downloads a
  chosen photo straight into the media library and can set it as a post's
  featured image.
* Add get_page_html: fetch a post's actual rendered HTML (no JS) instead of
  just its raw post_content, useful for page-builder pages and checking how
  an edit really looks.
* Add an "Approval Log" admin page listing every write action AISA_Audit_Log
  has recorded -- the table existed since 0.1.0 but had no viewer until now.

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
