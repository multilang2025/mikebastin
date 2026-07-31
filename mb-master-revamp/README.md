# MB Master Revamp

Rebuild of mikebastin.com: Divi consultancy site to a Next.js + Payload CMS
portfolio. This directory is the handoff bundle from the planning
conversation, plus the agent roster that governs the build.

**If you're the developer picking this up (Andre), start with
[`DEVELOPER-HANDOFF.md`](DEVELOPER-HANDOFF.md)**, not this file — it names
what to clean up in the planning doc and what's still open.

For the sequencing of what's done and what's next, see
[`ROADMAP.md`](ROADMAP.md).

Otherwise, start here: [`docs/HANDOFF.md`](docs/HANDOFF.md) — the single
source of truth for scope, design tokens, copy rules, SEO invariants, and
the phase plan. [`CLAUDE.md`](CLAUDE.md) is the condensed project memory an
agent should hold in every turn.

## Layout

```
mb-master-revamp/
├── CLAUDE.md              project memory: tokens, voice rules, SEO invariants, agent roster
├── DEVELOPER-HANDOFF.md   start here if you're implementing this (Andre)
├── README.md              this file
├── docs/
│   ├── HANDOFF.md          full planning handoff, v3.0 FINAL — source of truth
│   └── sitemap-MB-EN.txt   URL inventory of record (redirect coverage baseline)
├── design/
│   └── concept-v3.html     locked design reference (not production code)
├── assets/                 scraped brand/client logos + manifest — use as-is, do not regenerate
├── .claude/agents/         12 project agents (see CLAUDE.md for the roster table)
├── redirects/
│   └── content-map.json    migration contract skeleton (docs/HANDOFF.md §16) — fill in during P0/P3
└── social/                 drafted X/LinkedIn posts land here, one folder per article slug
```

## Status

Planning is closed (HANDOFF.md §21). Next step is P0: resolve the open
decisions in `docs/HANDOFF.md` §15/§17/§21 (repo org, Postgres provider,
media storage, X handle, Tier C prune sign-off, service consolidation
sign-off, Valencia STAY-list sign-off, credibility strip numbers), then
scaffold the actual Next.js + Payload app under this directory (or a
dedicated app subdirectory — `cto` agent to confirm layout once scaffolding
starts).

No application code, dependencies, or credentials exist here yet — this
commit is the planning bundle and agent roster only.
