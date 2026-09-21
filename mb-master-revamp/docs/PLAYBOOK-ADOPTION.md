# House Style Playbook: what we took, what we refused

The owner supplied the "House Style Playbook" document on
21 September 2026, with the instruction to merge it into the orchestration
and **not to override or compromise what is already settled here**.

Record of that pass. The refusals matter more than the adoptions, so they
come first.

## Provenance

The playbook is from **BT Digital / betranslated.com**, a different
property, and says so: "Use it as the starting checklist for a **new,
unrelated** website." It is a greenfield checklist, and greenfield is
exactly what this project is not: eight months into a rebuild with a stack decision closed
in HANDOFF.md §25 and roughly 285 content objects already migrated.

One section is worth reading knowing where it came from. §2B quotes
`preview.mikebastin.com` as a "reference implementation" and lists its
tokens (`--berry: #c42640`, Fraunces, Cormorant, Inter, the `.band-a` /
`.band-b` alternation) as a device "worth stealing". Those are our own
tokens from HANDOFF.md §2/§22/§23, observed from the outside and
recommended back to us. Agreement with the playbook on that section is not
corroboration, so do not cite it as a second source for a decision it
learned from us.

## Refused

### The stack, in four parts

HANDOFF.md §25 is closed. The playbook's §1 proposes a stack this project
deliberately does not run, and adopting any of it would reverse an owner
decision rather than implement one.

| Playbook | Here | Why it stays as it is |
|---|---|---|
| Supabase, schema per concern | No database at all | Payload was removed for being too complicated for an owner who edits his own site. A database brings back the admin UI, the schema and the migration. `cto` is charged with resisting exactly this. |
| next-intl, path-based | Per-locale content directories joined by a frontmatter `group` | Verified: `next-intl` is not a dependency. The `group` model is what `content-map.json` and `localization-qa` are built around. |
| shadcn/ui component primitives | Hand-built components on Tailwind 4 | Verified: no `shadcn`, no `@radix-ui`, no `class-variance-authority` in `package.json`. The design contract in HANDOFF.md §2/§22/§23 is the primitive layer. |
| Per-page message files, zero hard-coded UI strings | UI strings inline, content in MDX | See below. |

**On zero hard-coded UI strings** (§4 and §7), the strongest-sounding rule
in the playbook and the one that most needs refusing here. It is correct
advice for a site with a message-file layer. Introducing that layer is the
CMS decision again in another shape: a second place to edit text, which
the owner removed Payload to avoid. The house pattern is different and
deliberate. Reader-facing prose lives in MDX under `content/<locale>/`,
and the handful of genuinely repeated UI strings live in a small string
table, as `SiteFooter` already does for the motto. A new repeated string
joins that table. A one-off label does not need a framework.

Flagging it as a known, deliberate divergence rather than a gap is the
point: a future agent reading the playbook cold would otherwise file it as
technical debt and try to fix it.

### The button decision table

Playbook §2 defines variants by the surface they sit on: `secondary` on
dark only, `ghost` on light only. Our three variants resolve against
theme tokens (`--ink`, `--rule`, `--dim`, `--berry-soft`) which flip with
light and dark mode, and the band system overrides those tokens locally
per section. So every variant is already correct on every surface, and
`.band-a` / `.band-b` alternation depends on that being true.

Taking the playbook's table would mean a button that breaks when a section
changes band. Keep `globals.css` as it is.

### Heading case per locale

Playbook §6 offers "Title Case for US English, sentence case for most of
Europe". Sentence case is absolute here, in every locale, by owner
decision of 19 September 2026, including on titles carried over from
WordPress. No per-market exception.

## Corrected, because the playbook was right and memory was stale

Playbook §13 says an agent that finds something contradicting the memory
files corrects the memory in the same pass. Applying it to the playbook
itself turned up two:

1. **Hosting.** `CLAUDE.md` said "Hosting: Vercel." There is no
   `vercel.json`, no Vercel reference anywhere in the repo, and the only
   deploy pipeline is `.github/workflows/deploy-preview.yml`, which builds
   the static export and pushes it to `preview.mikebastin.com` over FTPS.
   The playbook's §11a description of a GitHub to Hostinger pipeline with
   no Vercel is closer to what this repo actually does than our own memory
   file was. Corrected to state the verified pipeline, with production
   hosting marked as the open decision it is.
2. **Framework version.** `cto.md` said Next.js 15; the installed version
   is 16.3.0, as `CLAUDE.md` already said. Corrected.

## Adopted

Everything below was already compatible, or fills a real gap.

**Into `content-migrator`:**
- **The content-preservation diff gate.** Compare the word stream of the
  source against the word stream of the output and fail on anything past a
  rounding difference. The best idea in the playbook, and this project has
  the exact failure mode it catches: a migration that silently eats a
  paragraph looks finished.
- **Diff the external-URL set before and after a rewrite.** Gives the
  "never remove a live external link" rule a mechanical check instead of
  relying on a reviewer noticing an absence.
- **Carry a statistic verbatim. Never round, never re-derive.** Extends
  the sourcing rule already added from the UK/EU guide.

**Into `copy-editor`:**
- **Narrow regexes over blanket bans**, so a linter does not cry wolf and
  get ignored. Independently confirmed here this week: the US-spelling
  rule threw three false positives on code identifiers and comments and
  had to be narrowed, and the jargon lint had to be zoned to commercial
  routes after failing 41 times on blog posts about the term in the
  headline.
- **A non-blocking advisory queue for sourced-claim debt.** The right
  shape for the 49-posts-with-a-percentage, 14-with-a-source finding:
  track it, do not fail the build on it, never close the gap with a
  plausible-looking citation.

**Into `cto`:** the delegation rule, and the stack refusals above as
standing defences.

**Into `CLAUDE.md`:** the orchestration table and the memory-currency
rule, both below.

## Orchestration (playbook §12, adapted)

| Job | Where it runs |
|---|---|
| Architecture, stack, final merge gate | Main session. Never delegated. |
| Five or more near-identical instances of an established template | Parallel sub-agents. The template carries the judgement. |
| Shared config, design tokens, routing, schema | Main session, one coherent hand. Several independent agents disagree in ways that are expensive to reconcile. |
| Deterministic linting and formatting | Cheapest model that runs it. |
| Fact-checking and stats sourcing | A tool with live search, never a model's own recall. |

The last row has teeth here. `fact_check`, Ahrefs, Semrush and GSC are all
connected, and the rule in `mb-copy-voice` is already that a figure comes
from GSC, Ahrefs or the client's own reporting. Recall is not a source.
Three overclaims were caught this month by checking rather than trusting
("writers who live there", "traffic in four languages", a co-founding
date), so treat the check as routine rather than as suspicion.

The threshold matters as much as the split: below five instances, spinning
up agents costs more in context than it saves in wall-clock.

## Memory currency (playbook §13, adopted as a standing rule)

A decision that only exists in a conversation is one compaction away from
being redone badly. So:

- A locked decision is written down in the turn it is made, not batched.
- A new convention goes into the style guide or the lint when it is
  established, not when it is next needed.
- An agent that finds something contradicting a memory file corrects the
  file in the same pass, not only the code. Fixing the symptom and leaving
  the stale doc guarantees the next session repeats the mistake.

Already the practice here, which is why the focus-keyword rule landed in
`CLAUDE.md` and `mb-copy-voice` the same day it was given. Writing it down
makes it a rule rather than a habit.

## Not adopted, no conflict, simply not applicable yet

Playbook §3's template contract is effectively already in force through
`app/services/[slug]/page.tsx` and the post template, but has never been
written down as a contract. Worth doing, not urgent, and not something to
invent retroactively without reading the templates properly.

Playbook §9's single-source word-count function is a real point:
`scripts/flag-thin.mjs:142` hand-rolls `body.split(/\s+/)`, which is the
ad hoc reimplementation the playbook warns drifts from the render
pipeline. One call site today, so it is a note rather than a defect. It
becomes one the moment a second script counts words.
