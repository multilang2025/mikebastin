# Architecture

AI Site Assistant is a standalone WordPress plugin that calls the Claude
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
