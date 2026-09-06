---
description: Recap outstanding work on this project as closed-form decisions, pending routine items, and anything blocking. Run after a work session to hand back control cleanly.
argument-hint: "[--short]"
---

Produce a recap of this project's current state, in exactly this shape:

## A. Decisions needed from the user

Numbered. Each one is something only the user can resolve — a judgement
call, a tradeoff, a fact I can't verify from here. For each, give 2-4
lettered options (a, b, c) covering the real choices, including "defer" or
"skip" where that's genuinely an option. Do not list something here if I
could reasonably just proceed and be corrected later — that belongs in
section C, not A. A good test: if the user says "your call," does the
item disappear because either answer is fine? If yes, it isn't a real
decision — cut it.

Sources to check before writing this section:
- Open TODOs, "OPEN" sections, or "owner decision" markers in this
  project's CLAUDE.md, HANDOFF.md, ROADMAP.md or equivalent planning docs
- Anything flagged in a recent commit message or PR description as
  "needs a fact-check", "hedged", "pending", or similar
- Unresolved judgement calls surfaced earlier in this conversation that
  were never actually answered

## B. Pending items (routine — just need a go-ahead, not a judgement call)

A flat list. Typically: open PRs and their CI/review state (call
list_pull_requests / gh pr list for every repo attached to this session,
not just the current directory), uncommitted changes, branches that exist
but were never merged or deleted, scheduled work waiting on a trigger.
State the actual status (green/red, draft/ready, mergeable or conflicted)
rather than just naming the PR — "ready whenever you say merge" is only
true if it's actually green.

If this session has more than one repo attached, check all of them, not
just the one the command was run from, and say plainly which repos were
checked.

## C. Anything else worth knowing

Confirmations that things ARE done and clean (so the user doesn't have to
ask), plus soft/optional next steps that don't block anything. Keep this
short — it's a relief valve, not a todo list.

---

If $ARGUMENTS contains `--short`, compress to one line per item, no
lettered options, and skip section C entirely unless something in it is
genuinely surprising (e.g. a thing thought to be settled has quietly
regressed).

Ground every item in something checked THIS run — grep the actual files,
call the actual PR list, read the actual CLAUDE.md — never in what an
earlier conversation summary claimed, since that can be stale or already
resolved. If a claim can't be verified in the time available, say so
explicitly rather than presenting it as confirmed.
