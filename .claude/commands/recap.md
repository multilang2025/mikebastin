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

## After producing the recap: sync the project's memory files

Update this project's own markdown memory — CLAUDE.md, HANDOFF.md's
"Open decisions"/"OPEN" sections, and any `.claude/agents/*.md` files whose
scope or roster changed — so they match what this recap just established,
rather than leaving them to drift until someone notices. Concretely:

- A decision in section A that got resolved earlier in this conversation
  (but never written back) gets removed from the doc's open-decisions list
  and, if the resolution changes ongoing behaviour, folded into the
  relevant rules/architecture section.
- A newly-surfaced open decision (raised this session, still unresolved)
  gets added to the doc's open-decisions list, not left to live only in
  chat history.
- A pending item in section B that's now done (merged PR, deleted branch)
  gets its stale reference removed from CLAUDE.md if one exists there.
- An agent's responsibilities changed (new one needed, one's scope
  narrowed or widened by a decision this session made) — update its
  `.claude/agents/<name>.md` frontmatter/description and the roster table
  in CLAUDE.md if one exists.

Edit minimally: touch only what actually changed, don't rewrite whole
sections for style, and don't invent structure the doc doesn't already
have. If nothing changed, don't edit anything — say so instead of making a
no-op commit. List which files (if any) were edited as the last line of
the recap output, e.g. "Updated: CLAUDE.md, .claude/agents/seo-offpage.md".
Do not commit these edits automatically — leave them staged/unstaged for
the user to review alongside everything else, unless the user has told
this project to auto-commit doc-only changes.
