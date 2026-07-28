# MB Master Revamp — Project Memory

## What this is

Full rebuild of mikebastin.com's public front end: from a two-year-old,
near-zero-traffic Divi consultancy site into a graphic, high-personality
portfolio ("vibe-coded") showcasing Michael's real client projects. Brand on
the public site is **"Mike Bastin"** — never "Michael" in site-facing copy.

Single source of truth for scope, design tokens, copy rules, SEO invariants,
and phase plan: [`docs/HANDOFF.md`](docs/HANDOFF.md). Read it before touching
anything in this project. This file only holds the parts an agent needs on
every turn without re-reading the whole handoff.

Design reference (do not treat as production code): [`design/concept-v3.html`](design/concept-v3.html).

URL inventory of record (redirect coverage baseline): [`docs/sitemap-MB-EN.txt`](docs/sitemap-MB-EN.txt).

## Stack (CLOSED, per HANDOFF.md §14/§17)

Next.js 15 (App Router) + Payload CMS 3.x + Postgres, on Vercel. WordPress
retires post-migration; Divi and Imagify go with it. Localisation: Payload
native, locales `en` (default) / `fr` / `es`, one document per content item.

Nothing in this directory contains real credentials. When P0 stands up the
Payload/Postgres instance, secrets go in `.env` (gitignored, see below) —
never in a committed file, never in an agent's output, never in chat/email in
plaintext. Share credentials only via a password manager or a secrets vault
link, and only with people who need them to do the work.

## Non-negotiable rules (apply to every piece of copy and every diff)

- Brand name is **Mike Bastin** everywhere on-site. Flag any "Michael" in
  site-facing strings.
- No ampersands (`&` or `&amp;`) in site copy — write "and"/"et"/"y". HTML
  attribute/query-string ampersands are exempt.
- No em dashes or en dashes anywhere. Commas/full stops; ranges use "to".
- UK English. No sentences starting with "This", "That", or "I". No emojis in
  body content (emojis allowed on social posts only, max 1 per post).
- Forbidden vocabulary (non-exhaustive, whole-word match): comprehensive,
  tailored, seamless, leverage, elevate, crafted, maximise, facilitate,
  landscape, utilise, innovative, robust, delve, transformative,
  implementation, integration, vital, dynamic, ever-evolving, "In
  conclusion", "It's important to note", moreover, however, thus, hence,
  additionally.
- No bolded links.
- Design tokens (colour, type) come only from HANDOFF.md §2/§22/§23 (Night
  Swell / Morning Glass palette — aubergine is retired, do not reintroduce
  it). No hex outside that set. No monospace UI fonts.
- Every legacy URL in `docs/sitemap-MB-EN.txt` resolves 200-same or 301s.
  Never 404 on launch.
- IP boundary: no Marvel/superhero imagery tied to "Silver Surfer" — it is a
  prose-only nickname, visual language is original surf/wave motifs.

## Agent roster

All agents live in `.claude/agents/`. Six were specified in the original
handoff (§6/§12/§16); the rest were added to cover gaps the handoff didn't
staff — token-usage/orchestration discipline, off-site SEO, accessibility,
and locale integrity.

| Agent | Role |
|---|---|
| `design-guardian` | Enforces design tokens + IP boundary + band-alternation system |
| `seo-preservation` | Redirect coverage, meta parity, hreflang — blocks deploys that regress SEO |
| `content-migrator` | WP → Payload migration per the content-map.json contract (§16) |
| `copy-editor` | Master Content Protocol linting (forbidden words, dashes, "Michael", ampersands) |
| `perf-auditor` | Core Web Vitals budgets, Lighthouse CI, X-embed facade pattern |
| `social-repurposer` | Turns a published URL into X thread/posts + LinkedIn post |
| `social-media-manager` | Owns cadence/scheduling across X and LinkedIn, Dispatches curation |
| `seo-offpage` | Digital PR, backlink reclamation, network-linking policy (§19) |
| `localization-qa` | Locale slug integrity, translation-group completeness, WPML→Payload parity |
| `accessibility-auditor` | WCAG contrast (both themes), focus states, reduced-motion, semantic HTML |
| `cto` | Architecture/stack steward; reviews agent orchestration itself for redundant work and token waste |
| `cfo` | Tracks hosting/API/token spend against the migration, flags scope creep against budget |

Run agents from CI on every PR (copy-editor, design-guardian,
seo-preservation, accessibility-auditor, perf-auditor at minimum) or on
demand. `cto` and `cfo` are advisory — invoke them when making a stack,
scope, or spend decision, not on every diff.

## Open decisions

Tracked in `docs/HANDOFF.md` §21 "Decisions OPEN" and §17 addendum. Resolve
with the owner before P1 work depends on them (repo org, Postgres provider,
media storage, X handle/posts, Tier C prune sign-off, service consolidation,
Valencia STAY-list sign-off, credibility strip numbers).
