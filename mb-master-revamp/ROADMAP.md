# Roadmap

One place that says, in order, what's done and what happens next. The full
history lives in [`docs/HANDOFF.md`](docs/HANDOFF.md) (24 sections, raw
planning transcript); the day-to-day rules live in [`CLAUDE.md`](CLAUDE.md);
Andre's brief lives in [`DEVELOPER-HANDOFF.md`](DEVELOPER-HANDOFF.md). This
file is the sequencing on top of all three.

## 1. Shipped

- Imported the planning handoff (`docs/HANDOFF.md`, `docs/sitemap-MB-EN.txt`,
  `design/concept-v3.html`, `assets/`) into `mb-master-revamp/`.
- Wrote the 12-agent roster in `.claude/agents/`: the six the handoff
  specified (`design-guardian`, `seo-preservation`, `content-migrator`,
  `copy-editor`, `perf-auditor`, `social-repurposer`) plus six added to
  cover gaps (`social-media-manager`, `seo-offpage`, `localization-qa`,
  `accessibility-auditor`, `cto`, `cfo`).
- Wrote `CLAUDE.md` (condensed rules) and `DEVELOPER-HANDOFF.md` (Andre's
  entry point, naming the concrete cleanup needed in the legacy handoff:
  duplicate §23, three superseded palette rounds, overlapping open-decision
  lists across §5/§15/§17/§21).
- Merged to `main` via PR #29.
- Confirmed no `.env`, credentials, or secrets exist anywhere in the bundle;
  `.gitignore` covers future secret/build paths under `mb-master-revamp/`
  before any app code lands.

## 2. Owner decisions still open (blocks P0)

Pulled from `docs/HANDOFF.md` §21 "Decisions OPEN," de-duplicated against
the overlapping §5/§15/§17 lists:

1. Repo org/location for the actual Next.js + Payload app (this monorepo
   directory vs. a dedicated repo)
2. Postgres provider (Supabase recommended, connector already live) + media
   storage (Supabase Storage vs. Vercel Blob)
3. X handle + 3 featured post URLs (`HANDLE_TBD` placeholders still in
   `concept-v3.html`)
4. Tier C prune list sign-off (9 low-value posts, §11)
5. Service consolidation sign-off (43 services → ~12)
6. Valencia STAY-list sign-off (3 pages staying on mikebastin.com, §18)
7. Credibility strip numbers (25 years / languages / countries / domains)
8. FR-only 44th service: promote to EN/ES or keep FR-only

(matosurf.com as an 8th portfolio spread is already closed — yes — and isn't
re-listed here.)

## 3. Andre's first deliverable

Before any application code: produce one clean implementation spec from
`docs/HANDOFF.md`'s 24 sections (can replace it or sit alongside it as
`docs/SPEC.md`). See `DEVELOPER-HANDOFF.md` for the specific issues to
resolve while doing that pass.

## 4. Phase plan (P0-P5)

Condensed from `docs/HANDOFF.md` §9, re-sequenced to reflect the full final
scope (CMS migration + Valencia exodus + social pipeline + 12-agent
roster), not the original pre-§11-24 draft:

- **P0** — Resolve the owner decisions in §2 above. Andre delivers the clean
  spec. Scaffold Next.js 15 + Payload 3 + Postgres on Vercel.
- **P1** — Static build to `concept-v3.html` parity: theme persistence, real
  project visuals, accessibility pass (`accessibility-auditor`), reduced
  motion, contrast in light-mode gold.
- **P2** — Per-project case study pages (problem → work → outcome), pulling
  real numbers from Ahrefs/GSC.
- **P3** — Blog + service-page migration (`content-migrator`,
  `localization-qa`, per the `content-map.json` contract in §16); Valencia
  lifestyle content exodus to valenciamove.com (§18); redirect map built
  against `docs/sitemap-MB-EN.txt`. Runs before WP decommission.
- **P4** — Launch: full crawl, redirect verification (`seo-preservation`),
  schema validation, ranking snapshot (Ahrefs project 6973217 + GSC),
  2-week post-launch coverage watch.
- **P5** — Any trilingual (FR/ES) gaps not shipped at launch (unlikely — all
  three locales are committed at launch per owner directive, but this is the
  catch-all if something slips).

## 5. Agent roster (quick reference)

Full table with responsibilities is in `CLAUDE.md`; one-line pointer here:

| Agent | Runs |
|---|---|
| `design-guardian` | Every PR touching UI/tokens |
| `seo-preservation` | Every PR touching routing/redirects/content-map |
| `content-migrator` | Per migration batch |
| `copy-editor` | Every new/edited copy string |
| `perf-auditor` | Every PR touching hero/embeds/images/fonts |
| `social-repurposer` | On each Tier A article publish |
| `social-media-manager` | Cadence/scheduling, on demand |
| `seo-offpage` | Post-launch, on demand |
| `localization-qa` | After each migration batch |
| `accessibility-auditor` | Every PR touching theme/interactive elements |
| `cto` | On architecture/scope decisions |
| `cfo` | On cost decisions, per-phase sizing |

## 6. Where things live

- [`docs/HANDOFF.md`](docs/HANDOFF.md) — raw planning history, source of
  truth for anything not summarised above
- [`CLAUDE.md`](CLAUDE.md) — day-to-day rules (tokens, voice, SEO
  invariants)
- [`DEVELOPER-HANDOFF.md`](DEVELOPER-HANDOFF.md) — Andre's brief
- `redirects/content-map.json` — migration contract, currently an empty
  skeleton, filled in during P3
- `social/` — drafted X/LinkedIn posts, one folder per article slug; empty
  until `social-repurposer` runs against published content

---
_Generated by [Claude Code](https://claude.ai/code)_
