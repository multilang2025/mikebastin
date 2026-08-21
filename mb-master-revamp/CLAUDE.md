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

## Stack (CLOSED, per HANDOFF.md §25 — supersedes §14/§17)

Next.js 15 (App Router), content as MDX files in the repo. **No database and
no CMS.** Payload was removed: it proved too complicated for an owner who
edits the site himself, and it brought a database, an admin UI, a schema to
maintain, and a migration into it. Removing it removes all four.

Same model as valenciamove.com, which the owner already runs at larger scale
(1,132 URLs across five locales, no CMS, content in-repo).

- **Editing:** primarily through Claude committing to the repo. Keystatic
  mounts at `/keystatic` as a git-backed browser editor for quick text
  fixes. Keystatic commits files like any other change; it adds no database.
- **Localisation:** one content directory per locale (`content/en`,
  `content/fr`, `content/es`). Localised slugs preserved exactly. Translation
  siblings bound by a `group` field in frontmatter matching
  `redirects/content-map.json`. **A locale version is an adaptation, not a
  rendering** (owner decision, 21 Aug): localise the examples, anecdotes and
  comparisons to the audience reading them, and replace an anecdote that only
  lands for the source audience rather than translating it. **Full parity is
  not the target** - ship a locale version when it has something to say to
  that audience. A missing sibling is not automatically a gap, so `group`
  records a real absence with an explicit null rather than a to-do. A fourth locale, `content/nl` (Belgium and
  the Netherlands), is planned once these three ship — see
  CONTENT-ARCHITECTURE.md §2. Don't build for it early; the directory
  structure already scales to it without rework.
- **Media:** `/public/images/`, optimised by Next/Image at build. No media
  library, no object storage.
- **Redirects:** `next.config.js` `redirects()`, generated from
  `content-map.json`. Never hand-maintained.
- **Hosting:** Vercel. Hostinger is viable too, since valenciamove.com runs
  there, so this is reversible rather than load-bearing.

Nothing in this directory contains real credentials. Secrets go in `.env`
(gitignored, see below), never in a committed file, never in an agent's
output, never in chat or email in plaintext. With no database the secret
surface is small: a Keystatic GitHub App credential and whatever the host
needs.

## Non-negotiable rules (apply to every piece of copy and every diff)

- Brand name is **Mike Bastin** everywhere on-site. Flag any "Michael" in
  site-facing strings.
- No ampersands (`&` or `&amp;`) in site copy — write "and"/"et"/"y". HTML
  attribute/query-string ampersands are exempt.
- No em dashes or en dashes anywhere. Commas/full stops; ranges use "to".
- **Voice is "we", not "I"** (owner decision, 21 Aug). Matches the four
  Google reviews that say "Mike and his team". Use our/us/ours, never
  my/me/mine. Exception: a reviewer's own quote is verbatim and never
  converted, and Roman numeral "I" in the portfolio numbering is not a
  pronoun.
- UK English. No sentences starting with "This" or "That". No emojis in
  body content (emojis allowed on social posts only, max 1 per post).
- Forbidden vocabulary (non-exhaustive, whole-word match): comprehensive,
  tailored, seamless, leverage, elevate, crafted, maximise, facilitate,
  landscape, utilise, innovative, robust, delve, transformative,
  vital, dynamic, ever-evolving, "In conclusion", "It's important to
  note", moreover, however, thus, hence, additionally.
- "implementation" and "integration" are **allowed but not to be overused**
  (owner decision, 21 Aug). They are real technical terms here ("Trusted
  Shops integration") and one is inside a service name, so they are not a
  hard fail. The lint warns above a density threshold instead.
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
| `content-migrator` | WP → MDX migration per the content-map.json contract (§16) |
| `copy-editor` | Master Content Protocol linting (forbidden words, dashes, "Michael", ampersands) |
| `perf-auditor` | Core Web Vitals budgets, Lighthouse CI, X-embed facade pattern |
| `social-repurposer` | Turns a published URL into X thread/posts + LinkedIn post |
| `social-media-manager` | Owns cadence/scheduling across X and LinkedIn, Dispatches curation |
| `seo-offpage` | Digital PR, backlink reclamation, network-linking policy (§19) |
| `localization-qa` | Locale slug integrity, translation-group completeness, WPML→MDX parity |
| `accessibility-auditor` | WCAG contrast (both themes), focus states, reduced-motion, semantic HTML |
| `cto` | Architecture/stack steward; reviews agent orchestration itself for redundant work and token waste |
| `cfo` | Tracks hosting/API/token spend against the migration, flags scope creep against budget |

Run agents from CI on every PR (copy-editor, design-guardian,
seo-preservation, accessibility-auditor, perf-auditor at minimum) or on
demand. `cto` and `cfo` are advisory — invoke them when making a stack,
scope, or spend decision, not on every diff.

## Open decisions

Tracked in `docs/HANDOFF.md` §21 "Decisions OPEN" and §17 addendum. Resolve
with the owner before P1 work depends on them (repo org, X handle/posts, Tier C prune sign-off, service consolidation,
Valencia STAY-list sign-off, credibility strip numbers).
