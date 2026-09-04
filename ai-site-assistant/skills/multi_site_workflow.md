MULTI-SITE / MULTI-CHAT WORKFLOW: load this when the user has more than one chat/session open
against different websites at the same time, when they ask to switch which site you're working
on, or when you see unexplained cross-site behavior (a call that should target site A appears to
have run against site B instead).

AS OF BRIDGE v3.4.1: `switch_site` CAN be made session-scoped -- calling it in one chat no longer
has to rebind the default site for every other chat sharing the same connector connection. But
this only works if YOU (the model) actively participate -- it is not automatic on every transport.
Two mechanisms exist, and you cannot tell in advance which one this connection actually gets:
- SSE (Claude Desktop/Code's own local MCP connection): automatic, free, no action needed -- each
  chat's SSE connection already has its own id the bridge uses to isolate it.
- Every other transport, INCLUDING Claude.ai's own hosted connector card (confirmed live
  2026-08-31: it does NOT echo back a session header the spec-compliant way): needs an explicit
  `chat_id` argument from you on every single AISA tool call, every time, for the rest of the
  chat -- see the rule below. Skip it, or use it inconsistently, and this connection silently
  falls back to the old shared-account default, with the exact same cross-talk bug as before
  v3.4.0.

RULE 0 -- ALWAYS PASS chat_id, EVERY CALL, IF THERE IS ANY CHANCE ANOTHER CHAT IS ALSO OPEN ON
THIS CONNECTOR: at the very start of a chat that will touch AISA tools, make up a short random
identifier (e.g. a random word plus a few digits) and reuse that EXACT same value as the `chat_id`
argument on every AISA tool call for the rest of this conversation -- not just switch_site, every
call, since resolving the right default site on ANY call depends on chat_id being present on that
call too. This costs nothing on a connection where you're the only chat (falls back to the normal
persistent default), and is the only thing that makes switch_site actually safe on the transport
this connector most commonly uses in practice. If you skip this and multiple chats turn out to be
active, you're back to Rule 2 below.

RULE 1 -- SINGLE CHAT, SEQUENTIAL MULTI-SITE WORK, NO OTHER CHAT ACTIVE: `switch_site` is fine
without a chat_id too. Call it when the user says "switch to example.com" and continue normally.

RULE 2 -- MULTIPLE CHATS RUNNING AT THE SAME TIME, chat_id NOT CONSISTENTLY USED (e.g. you weren't
following Rule 0 from the start, or you're not confident every call in every open chat used it):
fall back to the always-safe option -- pass the `site:` argument explicitly on every tool call in
each chat instead of relying on the default at all, and never call `switch_site`. The explicit
per-call `site:` override never touches any shared, session, or chat_id-scoped state, so it can
never be clobbered by (or clobber) another chat's work, regardless of chat_id or transport.

RULE 3 -- IF THE USER REPORTS "IT KEEPS SWITCHING TO THE WRONG SITE" OR SIMILAR GLITCHES: check
(a) whether more than one chat is open against this connector, (b) whether the bridge is confirmed
on v3.4.1+ (older bridges don't have chat_id support at all), and (c) whether chat_id was actually
passed on every call in every affected chat, not just some. Any gap in (b) or (c) means this falls
back to the legacy shared-default behavior -- move every call in every open chat to the explicit
`site:` override (Rule 2) until it's confirmed fixed.

TRANSIENT ERRORS -- retry once, don't panic: occasional `403 Forbidden` (`mcp_request_blocked`)
or `permission_error` ("Unable to verify organization membership") responses are a known, benign
side effect of concurrent/sustained load on the shared hosting the bridge runs on. Every occurrence
observed so far has succeeded on an immediate single retry with no data lost and no partial write.
Retry the exact same call once before treating it as a real failure; if it fails a second time in a
row, stop and report the actual error to the user rather than retrying in a loop.

TOOL-SCHEMA CACHING -- known limitation, not something to fix mid-chat: a chat's MCP tool schema
for these tools is cached at first use and does not refresh for the rest of that conversation, even
after `switch_site`, a reconnect, or a brand-new `connect_site` link. If a newly-added tool
parameter (something not in this skill or the tool's own description as you currently see it)
seems to not exist, that's this caching limitation, not a real removal -- it requires a fresh
chat/session to pick up, not troubleshooting within the current one.
