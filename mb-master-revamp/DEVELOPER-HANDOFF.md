# Developer Handoff — MB Master Revamp

For: Andre (and Michael, for visibility). Michael is the project owner and
is explicitly not a developer — this document exists so Andre can pick up
implementation without a call, and so Michael has one place that says what's
being taken care of.

Repo: [multilang2025/mikebastin](https://github.com/multilang2025/mikebastin),
branch `claude/mb-master-revamp-setup-qx16hw`
([PR #29](https://github.com/multilang2025/mikebastin/pull/29)). Everything
lives under `mb-master-revamp/` in this repo — Andre, once you have repo
access, you have everything; there is no separate handoff channel, no zip,
no email thread to chase.

## What's already here

- `docs/HANDOFF.md` — the full planning conversation output (v3.0 FINAL,
  24 sections). Treat it as raw material, not a clean spec — see "What needs
  cleaning up" below.
- `CLAUDE.md` — the condensed, de-duplicated version of the same rules
  (design tokens, copy rules, SEO invariants, agent roster). **Read this
  first, not HANDOFF.md.** HANDOFF.md is the audit trail; CLAUDE.md is what
  should actually govern day-to-day work.
- `design/concept-v3.html` — locked design reference, not production code.
- `assets/` — real logos/photos, use as-is, do not regenerate.
- `docs/sitemap-MB-EN.txt` — URL inventory of record for redirect coverage.
- `redirects/content-map.json` — empty skeleton, this is the migration
  contract you'll fill in per HANDOFF.md §16 during content migration.
- `.claude/agents/` — 12 agent definitions (6 from the original planning
  session, 6 added to cover gaps: social-media-manager, seo-offpage,
  localization-qa, accessibility-auditor, cto, cfo). These are meant to run
  in CI and on demand once there's code to check — they're not a
  replacement for you deciding architecture.

No `.env`, credentials, or secrets exist anywhere in this bundle yet — it's
planning artifacts only. When Postgres/Vercel/Payload get provisioned in P0,
put secrets in `.env` (already gitignored at the repo root for this
directory) and share them through a password manager or secrets vault, never
through this repo, chat, or email.

## What Michael actually asked for

Direct from the owner: clean up the mess in the planning logic, and
restructure/orchestrate/implement this the way an actual developer would,
optimising for token usage. He is not going to review architecture
decisions in depth — he needs a working site, not a demonstration of how
many agents ran. Use your judgement over the letter of the handoff doc
where the two conflict.

## What needs cleaning up (the "mess")

`docs/HANDOFF.md` is a preserved chat transcript-turned-doc, not an edited
spec, and it shows:

1. **Two different sections numbered §23**, with contradictory content:
   "ALTERNATING BANDS" and "PALETTE PIVOT: AUBERGINE RETIRED, SEA PALETTE
   IN". The palette pivot is the one that stuck (Night Swell / Morning
   Glass, teal-based) — the aubergine/wine tokens from the earlier §2/§23
   band section are superseded. `CLAUDE.md` already reflects only the final
   palette; treat any remaining aubergine reference in HANDOFF.md as
   historical, not current.
2. **Three rounds of palette revision** (dark techy → editorial
   aubergine/gold → sea/teal) are all still narrated in full. Only the last
   one is real. Don't implement from an early section without checking
   whether a later amendment overrode it.
3. **Repeated open-decisions lists** (§5, §15, §17, §21) that partially
   overlap and partially supersede each other. The actually-current list is
   whatever's left unresolved by the time you reach §21 "Decisions OPEN" —
   use that as the checklist, not the earlier ones.
4. **Scope grew across the conversation** without a corresponding cut: it
   started as "redesign the front end" and picked up a full CMS migration, a
   cross-domain content exodus to valenciamove.com, a social pipeline, and a
   6-then-12-agent roster. None of that is wrong, but it means the phase
   plan (§9) was written before half of §11-24 existed. Re-sequence P0-P5
   against the actual final scope rather than following §9 literally.

Your first real task, before writing application code: produce one clean
implementation spec from this material (can replace `docs/HANDOFF.md` or
sit alongside it as `docs/SPEC.md` — your call) that a second developer
could work from without reading the full 24-section history. That's the
concrete deliverable for "clean the mess."

## Token/orchestration efficiency (Michael's explicit ask)

- Don't run the full agent roster on every trivial change. `copy-editor`,
  `design-guardian`, `seo-preservation`, `accessibility-auditor`, and
  `perf-auditor` belong in CI on every PR that touches relevant files;
  `cto`, `cfo`, `seo-offpage`, and `social-media-manager` are advisory —
  invoke them for decisions, not diffs.
- `content-migrator` and `localization-qa` are batch-oriented — run them
  once per migration batch, not per document.
- If two agents end up checking overlapping ground, consolidate rather than
  keeping both running in parallel forever. `cto` owns catching this; flag
  it there rather than letting redundant checks accumulate.

## Stack (already decided, don't relitigate without a real reason)

Next.js 15 (App Router) + Payload CMS 3.x + Postgres, on Vercel. WordPress
retires post-migration. See `CLAUDE.md` for the short version, HANDOFF.md
§14/§17 for the full reasoning if you need it.

## Open decisions that need Michael, not Andre

Listed in full in `docs/HANDOFF.md` §21 "Decisions OPEN" (repo org under
which the actual app lives if different from this monorepo directory,
Postgres provider, media storage, X handle + 3 post URLs, Tier C prune
sign-off, service consolidation sign-off, Valencia STAY-list sign-off,
credibility strip numbers, FR-only 44th service). Don't guess these —
surface them to Michael in one batch rather than blocking on each
individually.

---
_Generated by [Claude Code](https://claude.ai/code)_
