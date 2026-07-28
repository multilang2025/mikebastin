# MIKEBASTIN.COM PORTFOLIO REBUILD — MASTER ORCHESTRATION & HANDOFF
Version 3.0 FINAL · 2026-07-28 · Conversation closed; continue in Claude Code.

---

## 1. PROJECT INTENT

Full replacement of mikebastin.com's public-facing presentation. Two years live, old domain, no lead traction. The consultancy positioning stays, but the site becomes a graphic, high-personality portfolio ("vibe-coded") showcasing Michael's real client projects rather than a generic services site.

Owner: Michael Bastin. Multilingual SEO + translation + AI consultant, Valencia, Spain. 25 years experience. Fluent EN/FR/ES/NL, B1 DE.

**What this is NOT:** a Divi restyle, a template swap, or a blog redesign. It is a new front end. The existing blog content (141 published EN items + ES/FR layers, heavy SEO investment) must survive intact — see §7.

---

## 2. DESIGN DIRECTION (LOCKED)

Reference file: `mikebastin-portfolio-concept-v3.html` (bundled with this handoff). Treat it as the design source of truth, not production code.

### Evolution across iterations
- v1: dark techy (navy/cobalt/monospace, animated canvas waveform). **Rejected: too austere, too techy, not glamorous enough.**
- v2: editorial luxury (aubergine/gold/Playfair). **Accepted direction.**
- v3: v2 + dark/light theme toggle. **Current reference.**

### Design tokens

DARK (default):
```
--bg:        #1B1030   (deep aubergine-navy)
--ink:       #F7F1E6   (ivory)
--ink-dim:   #C9BFD6
--gold:      #D4AF37
--gold-soft: #E8CD7A
--wine:      #7A1F3D
--rule:      rgba(247,241,230,0.14)
```

LIGHT:
```
--bg:        #F7F1E6   (warm ivory)
--ink:       #241234   (deep aubergine)
--ink-dim:   #6B5E7A
--gold:      #A9791E   (darkened for contrast on light bg)
--gold-soft: #8A5A16
--rule:      rgba(36,18,52,0.14)
```

Both themes share identity (gold + wine + ivory family). Light mode is NOT a plain inversion.

### Typography
- Display: **Fraunces** (500/600/700, roman + italic, optical sizing on). Italic gold remains the signature emphasis treatment. Fallback candidate if Fraunces ever fails: DM Serif Display.
- **NO AMPERSANDS anywhere in site copy** — owner rejects the glyph itself, in any font. Use "and" (EN), "et" (FR), "y" (ES). The law firm is written "Delaguía y Luzón" (matches the firm's own Spanish branding). Tag-style label lists use commas. copy-editor agent must flag any literal "&" or "&amp;" in content strings (HTML attribute/query-string ampersands exempt).
- Script/eyebrows/pull-quotes: Cormorant Garamond italic.
- Body: Inter 300/400/500.
- Monospace: dropped entirely from v1. Do not reintroduce.

### Signature element
Animated self-drawing gold SVG line in the hero (stroke-dashoffset animation, ~3.2s). Reads as a brushstroke signature. Beneath it: caption row "Ranking in EN · Converting in FR · Localised in ES · Indexed in NL". This is the one memorable element; keep everything else disciplined.

### Layout language
- Editorial magazine spreads, not card grids. Roman numerals (I.–VII.) per project.
- Full-width pull-quote section between hero and work.
- Credibility strip: 4 stats (25 years / 4+1 languages / 6 countries / 12 domains). Owner may revise numbers.
- Generous margins (7vw), hairline rules from --rule only.
- Responsive to mobile; spreads collapse to single column at 820px.

### Theme toggle
- `data-theme` attribute on `<html>`, CSS custom properties per theme.
- Concept file has NO persistence (localStorage unavailable in claude.ai artifacts). **Production must add persistence**: localStorage or cookie + respect `prefers-color-scheme` on first visit. Avoid FOUC with an inline head script.

---

## 3. PORTFOLIO INVENTORY (7 PROJECTS, VERIFIED)

| # | Project | Domain | Angle |
|---|---------|--------|-------|
| I | BeTranslated | betranslated.com (+ .be .fr .es .co.uk .nl) | Founded; multilingual translation agency, 6 regional identities, multi-TLD SEO |
| II | Globaprom | globaprom.com | Custom AI software development |
| III | TX International Freight | txintlfreight.com | Houston industrial freight forwarder; technical SEO + content |
| IV | Century 21 Perdomo | c21perdomo.com | Dominican real estate; EN/FR/ES/DE, headless WP + WPML + WooCommerce |
| V | ValenciaMove | valenciamove.com | Expat relocation content; first-hand local knowledge |
| VI | Bemelman Spuiterij | bemelmanspuiterij.nl | Dutch spraying/powder-coating specialist, Noordwijkerhout, 45 yrs; Divi build + Dutch local SEO |
| VII | Delaguía y Luzón | delaguialuzon.com | Valencia multidisciplinary law firm (legal/labour/immigration/tax), Spain + France, ES/FR/EN/RU; legal SEO + multilingual content |

Copy for each exists in the v3 reference file. Owner has NOT yet confirmed priority order — spreads currently run in the order above.

Possible additions not yet discussed: matosurf.com (French watersports guide). Ask before including.

---

## 4. COPY & VOICE RULES (APPLY TO ALL SITE COPY)

From the MIKEBASTIN MASTER CONTENT PROTOCOL v3.0 (owner's standing spec):

- **Brand name: "Mike Bastin"** in all on-site branding — logo, headings, pull-quote attributions, footer, schema Person name, meta titles. Do not use "Michael" anywhere on the public site. Concept-v3 already reflects this.
- UK English.
- First person, practitioner voice, 25 years of seeing what works and fails.
- No em dashes or en dashes anywhere (use commas/full stops; ranges use "to").
- No sentences starting with "This", "That", or "I".
- No emojis in body content.
- Varied sentence length; conversational; light hedging allowed.
- Forbidden vocabulary (non-exhaustive): comprehensive, tailored, seamless, leverage, elevate, crafted, maximise, facilitate, landscape, utilise, innovative, robust, delve, transformative, implementation, integration, vital, dynamic, ever-evolving, "In conclusion", "It's important to note", moreover, however, thus, hence, additionally.
- No bolded links.
- Existing hero/spread copy in v3 already complies. Any new copy must too.

Business info for footer/contact/schema (name per brand rule above):
```
Mike Bastin
Calle Rugat 12 - 2, 46021 Valencia, Spain
+34 671 17 57 74
LinkedIn: https://www.linkedin.com/in/michaelbastin/
GBP: https://www.google.com/maps/place//data=!4m2!3m1!1s0xd6048f48e63ffff:0x1be84e97abaa5aa1
Logo: https://mikebastin.com/wp-content/uploads/2025/02/logo_white_148x50.png.webp
```

---

## 5. OPEN DECISIONS (RESOLVE EARLY IN CODE SESSION)

1. **Stack.** Fully custom front end (Next.js/Astro static) vs custom WP theme replacing Divi. Owner said "vibe-coded", leaning custom, but has NOT decided. This decision gates everything.
2. **Blog handling.** If going headless/static: WP stays as content backend (REST already battle-tested, see §8) and the new front end renders /blog from the API. If custom WP theme: blog templates need building in-theme.
3. **Repo.** Fresh repo vs existing codebase repo. Owner intends GitHub sync; name/org TBD.
4. **Hosting.** Current host vs Vercel (connector already available in owner's Claude setup). Vercel pairs naturally with a static/Next build.
5. **Credibility strip numbers.** 25 / 4+1 / 6 / 12 — owner asked whether to adjust after adding projects VI–VII; unanswered.
6. **Project order/priority** in the spreads.
7. **Spread visuals.** Currently gradient placeholders with domain wordmarks. Production wants real screenshots or bespoke graphics per project.
8. **Multilingualism of the NEW site.** Current site is EN/FR/ES via WPML. Does the new portfolio front end ship trilingual at launch or EN-first? Big scope difference.

---

## 5b. X (TWITTER) EMBEDS — REQUIRED AT LAUNCH

Owner's primary social platform is X, with an established old account and large following. Embeds ship in v1, not a later phase. Concept-v3 has a "Dispatches from X" section with three embedded posts (placeholders: HANDLE_TBD + status IDs — get real values from owner before build).

Build constraints, decide in P0/P1:

1. **Performance.** widgets.js is heavy and third-party; it will hurt CWV if loaded eagerly. Use a click-to-load facade or IntersectionObserver lazy-load when the section nears viewport. perf-auditor agent should budget for this. Alternative worth evaluating: render static snapshots of the chosen posts at build time (SSG) and link out, keeping zero third-party JS on first paint.
2. **Theme sync.** X embeds take `data-theme="dark|light"` but do NOT live-switch after render. On site theme toggle, embed iframes must be re-rendered (remove + re-run widgets.js createTweet) or accept mismatched embeds until reload. Handle explicitly.
3. **Consent/GDPR.** X embeds set third-party cookies; owner operates from Spain (EU). `data-dnt="true"` is set in the concept; the facade approach also solves this cleanly (no third-party request until interaction). Coordinate with whatever consent tooling ships.
4. **Curation.** Three hand-picked posts beat a live timeline: stable layout, no surprise content, cacheable. Refresh occasionally.
5. **Follow CTA** links the account; footer/schema `sameAs` should include the X profile URL alongside LinkedIn.

Missing from owner: X handle and the 3 post URLs to feature.

---

## 6. PROPOSED REPO STRUCTURE + AGENTS

Owner explicitly wants agents committed to the repo. Suggested layout (adapt to stack decision):

```
mikebastin-portfolio/
├── CLAUDE.md                  ← project memory: tokens, voice rules, SEO invariants
├── .claude/
│   └── agents/
│       ├── design-guardian.md     ← reviews diffs against §2 tokens + §4 voice rules
│       ├── seo-preservation.md    ← §7 checklist enforcement: redirects, meta, schema, hreflang
│       ├── content-migrator.md    ← WP REST extraction, blog rendering parity
│       ├── copy-editor.md         ← Master Content Protocol linting (forbidden words, dashes, sentence starts)
│       └── perf-auditor.md        ← CWV budgets, Lighthouse, image weight
├── design/
│   └── concept-v3.html            ← the reference file, committed as-is
├── src/ ...                       ← stack-dependent
└── docs/
    └── HANDOFF.md                 ← this file
```

Agent notes:
- **design-guardian**: reject any hex not derived from the token set; reject monospace UI fonts; reject em/en dashes in copy strings.
- **seo-preservation**: the highest-stakes agent. Must block any deploy that changes a published URL without a 301, drops a canonical, or loses RankMath-equivalent meta. Feed it `sitemap-MB-EN.txt` (in owner's project files) as the URL inventory of record.
- **copy-editor**: implement forbidden-word matching with whole-word \b regex (owner's established rule — avoids false positives on words like "dominio"). Also flag any occurrence of "Michael" in site-facing strings; brand is "Mike Bastin".

---

## 7. SEO INVARIANTS (NON-NEGOTIABLE)

The domain's age and 141 published EN items (+ ES/FR layers) are the asset. The redesign must not torch them.

- Every URL in `sitemap-MB-EN.txt` either resolves identically or 301s. No 404s post-launch.
- Preserve meta titles/descriptions (currently RankMath). If leaving WP rendering, meta must be re-emitted by the new front end.
- Preserve hreflang across EN/FR/ES (currently WPML-generated). If the new front end is EN-only at launch, hreflang strategy needs an explicit plan, not silence.
- JSON-LD: Person + ProfessionalService schema on the new pages; keep existing article schema on blog content. Note: on current Divi site, schema lives inside [et_pb_code] blocks to dodge wpautop — irrelevant if leaving Divi, but explains what you'll find in extracted content.
- Serve real HTML (SSG/SSR), not client-only rendering, for anything indexable.
- Keep Ahrefs project 6973217 and GSC monitoring as the before/after measurement baseline. Snapshot rankings BEFORE launch.

---

## 8. TECHNICAL CONTEXT FROM PRIOR SESSIONS (HARD-WON, TRUST IT)

WordPress/REST quirks on mikebastin.com that matter if WP stays as backend:

- Always pass explicit `site_url: https://mikebastin.com` context on API tooling; multi-site tooling has drifted requests to sibling installs (betranslated, delaguialuzon) before. Verify `parsed.id === requested_id`.
- Post types: `post`, `page`, `project` (services). REST routes: pages → `/wp/v2/pages/{id}` (plural), project → `/wp/v2/project/{id}` (singular). Wrong form fails silently.
- WPML: append `&lang=es` (or fr) to REST queries; default is EN. Spanish slugs are fully localised under /es/ — no 1:1 slug mapping to EN.
- RankMath meta is NOT in standard REST responses. Read requires DB/WP-CLI; write is `POST /rankmath/v1/updateMeta` with `{"objectID": id, "objectType": "post", "meta": {...}}`.
- Large content payloads: request with `?context=edit` for content.raw, allow 400–500k response length, strip control chars before JSON.parse.
- Pagination: read X-WP-TotalPages before paging; requesting a nonexistent page 2 returns HTTP 400, not [].
- Batch GET+PUT loops: 6–7 items max per execution; 10 times out.
- WP Fastest Cache serves stale HTML after meta changes; re-saving the post (status publish) purges that URL; full programmatic flush is 403-blocked.
- `wp eval` is hard-blocked on this host; shell filter blocks `;`, `|`, `$(`.
- Tooling order of preference: AISA connector (custom MCP bridge) primary; WPVibe as gap-fill only (rate-capped, rolling 24h window over the whole sandbox).
- WP-CLI over SSH is available via the wp-cli-remote skill for anything REST can't do.

---

## 9. SUGGESTED PHASE PLAN

1. **P0 — Decisions.** Resolve §5 items 1–4. Initialise repo, commit this handoff + concept-v3 + CLAUDE.md + agents.
2. **P1 — Static build.** Landing page to production parity with concept-v3: theme persistence, real project visuals, accessibility pass (contrast in light mode gold, focus states, reduced-motion for the signature animation).
3. **P2 — Portfolio depth.** Per-project case study pages (problem → work → outcome). Pull real numbers from Ahrefs/GSC where they help.
4. **P3 — Blog integration.** Wire existing WP content into the new front end (or new theme templates). Redirect map. Meta parity audit against sitemap-MB-EN.txt.
5. **P4 — Launch.** Pre-launch: full crawl, redirect verification, schema validation, ranking snapshot. Post-launch: GSC coverage watch for 2 weeks.
6. **P5 — FR/ES layers** if trilingual launch was deferred.

---

## 10. FILES TO CARRY INTO THE CODE SESSION

- `HANDOFF.md` (this file)
- `mikebastin-portfolio-concept-v3.html` (design reference, dark+light, 7 projects)
- `sitemap-MB-EN.txt` (URL inventory of record — in owner's Claude project files)
- Optionally: `mikebastinmetaaudit.xlsx` (meta audit workbook, same location)

End of handoff.

---

# PART II — MASTER ORCHESTRATION (added after live site scrape + GSC audit)

## 11. LIVE SITE INVENTORY & PERFORMANCE REALITY

Scraped 2026-07-28 via WP REST + GSC (project 6973217, window 2026-04-28 → 2026-07-27):

- 7 core pages, 43 service pages (project CPT), 91 published EN posts, plus live FR and ES layers.
- **Total clicks across the whole domain in 90 days: ~6.** The rebuild is justified by data, not taste.
- Impression equity exists and is concentrated. Rankings sit at positions 12–60: visibility without clickability. Diagnosis: weak titles/pages, thin authority, no brand pull.

### Migration matrix (data-ranked)

**TIER A — KEEP + UPGRADE (carry into new site as first-class pages):**
| URL | 90d impressions | Notes |
|---|---|---|
| /competitor-analysis-traffic-checklist/ | 18,522 | Biggest asset on the domain. Pos 56 avg. Rework into flagship guide, target top-10 |
| /valencia-cost-of-living/ | 10,601 | Pos 12.9 — closest to page 1 at scale. Fact-check flagged in prior sessions; do it during migration |
| /services/global-seo-solutions/ | 2,825 | Top service page. Fold into new services architecture |
| /services/french-seo/ + /services/german-seo/ | ~4,400 combined | Language-SEO service pages are the working cluster |
| /conversational-ai-chatbots-business/ | 2,336 | AI consulting proof content |
| /affiliate-marketing-programs/ | 2,278 | Traffic magnet, low intent — keep in blog |
| /best-practices-for-multilingual-seo/ | 1,398 | Core expertise cluster |
| /valencia-living-expenses/ | 1,340 | Merge candidate with cost-of-living (near-duplicate topic, prior fact-check flag) |
| /internal-linking-tools/ | 1,372 | Tool roundup, keep |
| /move-to-valencia-spain-from-usa/ + /international-schools-in-valencia/ + /valencia-expat/ | ~3,500 combined | Valencia cluster stays |
| / (homepage) | 702 | Top query is the brand name — the new portfolio IS this page's fix |

**TIER A-FR (the FR layer is alive):**
/fr/transport-a-valencia/ (555 imp), /fr/agence-seo-internationale/ (1,969), /fr/consultant-referencement-international/ (1,316), /fr/avocats-a-valencia/ (727), /fr/expert-en-seo-international/ (980), plus FR service pages ~3,000 combined. **SUPERSEDED by owner directive: all three languages (EN/FR/ES) ship at launch. §5.8 closed.**

**QUICK WINS — page 1, zero clicks (title/CTR surgery, do during migration):**
- /french-ppc-campaign/ — pos 6.9
- /fr/services/localisation-ecommerce/ — pos 9.5
- /fr/ — pos 7.7 on "bastin"

**TIER B — KEEP AS BLOG, migrate content untouched, no special design treatment:** everything with data not listed above (~50 posts).

**TIER C — PRUNE/MERGE CANDIDATES (near-zero data, generic, off-brand for a consultant portfolio):**
how-to-use-twitter-for-beginners, how-to-make-money-on-youtube, top-instagram-tools, mastering-the-art-of-networking, email-marketing-hacks, 15-simple-blog-post-ideas, how-to-write-about-your-professional-background, most-popular-marketing-strategies, 360-marketing-agency (438 imp but wrong intent). Owner sign-off required before any deletion; default action is 301 to nearest relevant cluster page, never 404. Some 43 service pages likely consolidate into ~12 real offerings — thin ones 301 to parents.

---

## 12. SOCIAL ORCHESTRATION

**X (primary).** §5b covers embeds. Beyond embeds:
- Every Tier A article gets a repurposing pass: 1 thread + 2 standalone posts per piece, drafted at publish time, owner approves before posting. Add a `social/` directory in the repo holding drafted threads as markdown alongside the content they promote.
- The Dispatches section is the site↔X loop: featured posts link to site content; site content links to the account.
- Schema `sameAs`: X profile + LinkedIn + GBP.

**LinkedIn (secondary).** Owner's profile is the B2B credibility anchor. One repurposed post per Tier A piece, longer-form, no thread format.

**Cadence principle.** Social output is generated from site content, never produced separately. One pipeline, two channels.

**Agent:** add `social-repurposer.md` to `.claude/agents/` — takes a published URL, emits X thread + X posts + LinkedIn post in owner's voice (Master Content Protocol applies: no em dashes, no forbidden vocabulary, UK English; emojis allowed on social only, max 1 per post).

---

## 13. SEO ORCHESTRATION

**On-site (during rebuild):**
1. Title/meta surgery on all Tier A + quick-win pages. Current CTR at position 12.9 with 10k impressions is ~0. Titles must earn the click. RankMath conventions carry over (≤60 chars, focus keyword; drop the emoji rule on the new front end unless owner keeps it).
2. Internal-link silos: Valencia cluster, Multilingual-SEO cluster, AI-consulting cluster, Language-service cluster. Each Tier A page links up to its service page; every service page links to /contact-us/. Prior sessions established the GEO cluster as the style template — reuse.
3. Merge valencia-living-expenses into valencia-cost-of-living (301) after owner sign-off; both were fact-check flagged, resolve facts once, in one page.
4. Portfolio pages are new link targets: each project spread links out (dofollow) to the client site AND internally to the matching service page (Bemelman → dutch-seo + web-design; Delaguía → law-firm-seo; C21 → multilingual-seo; etc). Case studies become the EEAT backbone the blog never had.
5. Person schema sitewide: Mike Bastin, sameAs X/LinkedIn/GBP, worksFor/founder BeTranslated. Every article gets author → Person. That plus first-person case studies is the EEAT play.
6. GEO/AI-search: FAQ blocks on service pages, quotable single-sentence claims, consistent entity naming. The site already ranks in AI-query-style impressions (see GSC queries) — lean in.

**Off-site (post-launch, separate track):** digital PR around the portfolio launch, reclaim/point existing BeTranslated-network links at the new case studies where natural, X account as amplification. Detail lives in the seo-offpage skill; do not improvise here.

**Measurement:** GSC project 6973217 + Ahrefs 6973217. Snapshot both the week before launch. KPI is clicks and leads, not impressions — impressions were never the problem.

---

## 14. TECHNICAL ORCHESTRATION

**Stack (DECIDED — owner directive: Payload in the stack):** Next.js 15 (App Router) + Payload CMS 3.x (installs natively inside the Next app) on Vercel. WordPress retires entirely post-migration — no headless-WP phase. Content migrates WP → Payload once, then WP is archived (kept read-only until post-launch verification completes, then decommissioned). Divi gone with it.

- Database: Postgres. Recommend Supabase (owner already has the connector wired) or Vercel Postgres; owner picks in P0.
- Media: migrate wp-content/uploads worth keeping into Payload media collection backed by S3-compatible storage (Supabase Storage or Vercel Blob). Imagify retires; use Next/Image + build-time optimisation.
- Localisation: Payload native localization, locales `en` (default), `fr`, `es`. One document per content item, localised fields per locale — replaces WPML's separate-post model. Localised slugs preserved per locale (Payload supports localized slug fields).
- Admin: Payload admin at /admin, replaces wp-admin. Owner authors in one panel, all three locales side by side.

- Routing: Next front end owns everything: /, /work/*, /services/*, /about, /contact, /blog/*, mirrored under /fr/ and /es/ with localised slugs (per-locale slug map from the content-map, see §16).
- Redirect map: generated from §11 matrix, committed as `redirects.json`, enforced at edge (Vercel) — never in WP.
- Meta: re-emitted by front end; source of truth migrates from RankMath fields via one-time export (POST/read paths documented §8/Tools).
- Hreflang: EN↔FR↔ES triplets emitted at build time from Payload locale relations (one document = one hreflang cluster, structurally impossible to orphan); x-default = EN.
- Theme system: per §2 tokens; persistence + prefers-color-scheme + no-FOUC inline script; X embeds re-render on toggle (§5b).
- Performance budget: LCP < 2.0s, CLS < 0.05, zero third-party JS on first paint (X facade pattern). perf-auditor enforces in CI.
- CI: every PR runs copy-editor (forbidden words, dashes, "Michael" check), design-guardian (token drift), seo-preservation (redirect coverage vs sitemap-MB-EN.txt, meta presence, hreflang pairs), Lighthouse CI.

**Agents roster (final):** design-guardian, seo-preservation, content-migrator, copy-editor, perf-auditor, social-repurposer. Six agents, all in `.claude/agents/`, all invoked from CI or on demand.

---

## 15. REVISED OPEN DECISIONS (supersedes §5 where overlapping)

Still owner's call:
1. Stack veto or confirm (§14 recommendation: SSG + headless WP on Vercel)
2. Repo name/org
3. Tier C prune list sign-off (301 targets proposed per item at P1)
4. Service consolidation 43 → ~12 sign-off
5. X handle + 3 featured post URLs
6. Credibility strip numbers
7. ES layer at launch or fast-follow (FR is now committed at launch per data)


---

## 16. CONTENT-MIGRATOR AGENT — FULL SPEC (supersedes the one-line note in §6)

Mission: recycle EVERY existing content object across all three languages into Payload, with the sales pages (project CPT = the 43/44/43 service pages) treated as first-class migration targets, not blog leftovers. Nothing gets dropped silently.

### Verified trilingual inventory (scraped 2026-07-28)

| Type | EN | FR | ES |
|---|---|---|---|
| posts | 91 | 23 | 20 |
| pages | 7 | 7 | 7 |
| project (sales pages) | 43 | 44 | 43 |

~285 content objects. FR has one MORE service than EN (44 vs 43) — locate the FR-only service and decide whether it gains EN/ES siblings or stays FR-only. Sample localised slugs confirmed: `conseil-ia` (FR id 24848390), `consultoria-de-inteligencia-artificial` (ES id 24848569) vs `ai-consulting-services` (EN id 24847584). Slugs are fully localised per language; there is NO slug mirroring.

### Step 1 — Build content-map.json (the migration contract)

One record per WPML translation group:
```json
{
  "group": "ai-consulting",
  "type": "project",
  "en": {"id": 24847584, "slug": "ai-consulting-services", "url": "/services/ai-consulting-services/"},
  "fr": {"id": 24848390, "slug": "conseil-ia", "url": "/fr/services/conseil-ia/"},
  "es": {"id": 24848569, "slug": "consultoria-de-inteligencia-artificial", "url": "/es/services/consultoria-de-inteligencia-artificial/"},
  "tier": "A", "action": "migrate", "payload_collection": "services"
}
```
- Translation relations: WPML exposes `translations` on full REST objects in some configs; if absent, resolve via SQL on `icl_translations` (trid groups) through the wp-cli-remote skill. Do NOT guess relations from slug similarity.
- Every one of the ~285 IDs appears in the map exactly once. Records with missing siblings get `"fr": null` etc. — explicit, never omitted.
- Map is committed to the repo. seo-preservation agent validates redirect coverage against it, per locale.

### Step 2 — Extract

- WP REST per §8 quirks: explicit site_url, `&lang=` per locale, `?context=edit` for content.raw, 6–7 items per batch, control-char strip before parse.
- RankMath meta per locale via documented read path → stored alongside each record.
- Strip Divi shortcodes → clean structured content (Payload richText/Lexical). [et_pb_code] blocks containing JSON-LD: extract schema separately, discard wrapper. Flag any page whose Divi layout carries meaning beyond text (tables, pricing grids) for manual review rather than silent flattening.
- Featured images + in-content media: download, dedupe, re-upload to Payload media collection with alt text preserved.

### Step 3 — Load into Payload

Collections: `services` (sales pages), `posts`, `pages`, `projects-portfolio` (the 7 case studies, new), `media`, plus globals for nav/footer/business-info. Localised fields: title, slug, content, excerpt, seo.title, seo.description. One document per translation group; locales en/fr/es filled from the map.

### Step 4 — Verify (blocking, per locale)

- Count parity: documents in Payload per type per locale == inventory table above (minus owner-approved Tier C prunes).
- Redirect coverage: every legacy URL (all 3 locales) resolves 200-same or 301 in `redirects.json`.
- Meta parity: title/description non-empty for every migrated document; diff against extracted RankMath values.
- Hreflang triplets emitted for every group with 2+ locales.
- Spot-render 10 random documents per locale against live WP originals.

Sales-page rule: no service page in any language may 404, lose its meta, or lose its localised slug. If a service is consolidated (§11, 43→~12 proposal), each absorbed slug 301s to its absorbing service IN THE SAME LOCALE.

---

## 17. ADDENDUM TO §15 DECISIONS

- Stack: **CLOSED** — Next.js 15 + Payload 3 + Postgres on Vercel (§14).
- ES at launch: **CLOSED** — all three locales ship at launch (owner directive).
- NEW: Postgres provider (Supabase vs Vercel Postgres) — recommend Supabase, connector already live.
- NEW: media storage (Supabase Storage vs Vercel Blob).
- NEW: FR-only 44th service — promote to EN/ES or keep FR-only.
- Still open: repo name/org, Tier C prune sign-off, service consolidation sign-off, X handle + 3 posts, credibility strip numbers.

---

## 18. VALENCIA CONTENT EXODUS → VALENCIAMOVE.COM (owner directive)

All Valencia lifestyle/expat content leaves mikebastin.com for valenciamove.com. Strategic effect: mikebastin.com sharpens to SEO + translation + AI consulting (topical focus the portfolio needs), ValenciaMove absorbs the equity of the strongest content cluster on the domain, and current self-cannibalisation ends.

### Destination reality (scraped 2026-07-28)

- valenciamove.com is **Next.js** (no WP REST). 1,013 URLs in sitemap. Quadrilingual: EN + /fr/ + /es/ + /nl/ (517 localised URLs).
- Heavy existing topical overlap: neighbourhood pages ×76, expat ×32, schools ×7, digital-nomad ×3, cost-of-living exists.
- **Proven self-cannibalisation:** mikebastin.com/fr/visa-nomade-numerique-espagne/ and valenciamove.com/fr/visa-nomade-numerique-espagne/ coexist with the identical slug. The exodus resolves this class of conflict.

### Migration taxonomy — every Valencia URL gets one action

1. **redirect-to-existing** — VM already covers the topic (majority case, given 1,013 URLs). 301 mikebastin URL → best-matching existing VM URL, same locale. Before redirecting, diff the two articles: if the mikebastin version contains sections/facts VM lacks, merge those into the VM page first, then 301. Equity transfers, duplication dies.
2. **import-as-new** — genuinely novel piece with no VM equivalent. Import into VM's content system (owner knows the storage model; determine in Code session), adapt to VM templates, publish, then 301.
3. **stay** — Valencia content that serves the mikebastin B2B funnel, not expat life.

### Classification (owner sign-off required on the STAY list)

**MOVE (lifestyle/expat — EN, plus FR/ES siblings via content-map):**
valencia-cost-of-living (10,601 imp — crown jewel of the exodus), valencia-living-expenses (merge INTO cost-of-living during the move, one fact-check, one VM page), move-to-valencia-spain-from-usa, american-move-to-valencia-spain, international-schools-in-valencia, valencia-expat, best-neighborhoods-valencia, neighbourhoods-for-professionals-in-valencia, valencia-good-place-to-live, live-in-valencia, valencia-digital-nomads, valencia-remote-working, valencia-public-transportation, valencia-airport-guide, essential-things-to-do-in-cultural-valencia, living-in-a-flat-in-valencia-a-pragmatic-overview, valencia-the-not-so-perfect-mediterranean-paradise, valencia-50-shades-of-noise, work-life-balance-in-valencia, basic-spanish-valencia, shipping-to-valencia-spain, fr/transport-a-valencia (555 imp), fr/cout-de-la-vie-valencia, fr/expatrie-valencia, fr/plages-de-valencia, fr/vivre-en-appartement-a-valencia, fr/travailler-a-valencia-en-tant-quexpatrie, fr/visa-nomade-numerique-espagne (duplicate slug case above), fr/avocats-a-valencia (727 imp — note: links Delaguía y Luzón; VM already has immigration-lawyer-valencia pages per locale → likely redirect-to-existing + merge), plus ES siblings resolved via content-map.

**STAY (B2B funnel, proposed):**
optimising-your-website-for-valencia-based-searches (local SEO service support), b2b-trade-shows-in-valencia (B2B audience; carries known fact-check flags — fix before or during), business-registration-in-valencia (business services angle).

**Bonus unlocked:** VM supports NL. Migrated pieces can gain Dutch versions post-migration — new reach the mikebastin versions never had.

### Mechanics

- content-map.json gains `"destination": "payload" | "valenciamove" | "stay" | "prune"` and, for valenciamove, `"vm_action": "redirect-to-existing" | "import-as-new"` + `"vm_target_url"` per locale.
- Cross-domain 301s live at mikebastin's edge (Vercel redirects), permanent. seo-preservation agent validates every Valencia URL in all locales resolves to a 200 VM page.
- VM sitemap snapshot (/tmp/vm_urls.txt equivalent) is the matching corpus; commit it as `vm-url-inventory.txt` for the mapping exercise.
- The mikebastin portfolio keeps the ValenciaMove case study spread (§3, item V) — this migration IS part of that case study's story.
- Sequencing: exodus executes in P3 alongside blog migration, BEFORE WP decommission (content must be extracted from WP first).
- GSC: submit change-of-address is NOT applicable (partial move); rely on 301s. Monitor VM's GSC property for the absorbed queries; expect the cost-of-living cluster to transfer within 4–8 weeks.

### §11 matrix amendments

- valencia-cost-of-living, valencia-living-expenses, move-to-valencia-spain-from-usa, international-schools-in-valencia, valencia-expat: Tier A **destination changes to valenciamove**.
- Remaining mikebastin Tier A is now purely SEO/consulting/AI content — the topical focus is the point.

### §17 decisions addendum

- NEW: STAY-list sign-off (3 pages proposed above).
- NEW: VM content storage model — where does VM content live (MDX in repo? CMS?) — owner to specify in Code session; determines import-as-new tooling.

---

## 19. NETWORK LINKING POLICY (owner directive — standing rule, all content, all sites)

Whenever content on the new mikebastin.com touches these topics, it links to the owner's own network property. Contextual, in-sentence, never bolded, dofollow. copy-editor and seo-preservation agents enforce presence; one network link per topic mention cluster, not per paragraph.

| Topic | Link target |
|---|---|
| Translation, interpretation, localisation services | betranslated.com (or regional TLD matching the content locale: .fr for FR content, .es for ES) |
| Valencia, moving to Spain, settling in, expat life, visas | valenciamove.com (matching locale path /fr/ /es/ /nl/) |
| Logistics, freight, shipping, customs | txintlfreight.com |
| Legal, tax, immigration law in Spain | delaguialuzon.com |
| Custom AI software, automation builds | globaprom.com |
| Dominican Republic real estate | c21perdomo.com |
| Watersports, kite, windsurf (rare, personal) | matosurf.com |

Reverse direction is part of off-site strategy (§13): where natural, network sites link back to mikebastin.com case studies. Never reciprocal on the same page pair; keep it editorial.

---

## 20. SCRAPED ASSET LIBRARY

See `assets/ASSETS-MANIFEST.md`. Summary: mikebastin brand logos (4 variants), owner photos (3), client logos already hosted in the WP media library (BeTranslated, TX International Freight, Century 21, Delaguía y Luzón), ValenciaMove hero image and brand icons. **Rule: use these real assets; do not generate replacements.** Missing items (Globaprom + Bemelman logos, live site screenshots for spread visuals) are listed in the manifest for Code-session fetch — those domains sit outside this chat's network sandbox.

---

## 21. FINAL STATE — WHAT THE CODE SESSION INHERITS

**This conversation is closed after this handoff. Everything below is the complete transfer.**

### Bundle contents
1. `HANDOFF.md` — this document, v3.0 FINAL. Single source of truth.
2. `design/mikebastin-portfolio-concept-v3.html` — locked design reference: Fraunces display, aubergine/gold two-theme system, animated signature line, 7 project spreads, Dispatches-from-X section, zero ampersands, zero em dashes, Mike Bastin branding.
3. `assets/` — scraped asset library + manifest.
4. From owner's Claude project files: `sitemap-MB-EN.txt` (URL inventory of record), `mikebastinmetaaudit.xlsx` (meta audit).

### Decisions CLOSED in this conversation
- Design direction, palette, type (Fraunces), signature element, dark+light themes at launch
- Brand: "Mike Bastin" everywhere on-site
- No ampersands, no em/en dashes, forbidden-word list, UK English (Master Content Protocol §4)
- Stack: Next.js 15 + Payload 3 + Postgres on Vercel; WP retires post-migration; Divi gone
- Trilingual EN/FR/ES at launch, Payload native localisation, localised slugs preserved
- All ~285 content IDs recycled via content-map.json (§16); sales pages first-class
- Valencia lifestyle content exodus → valenciamove.com with merge-first 301s (§18)
- X embeds at launch with facade/lazy pattern (§5b)
- Network linking policy (§19)
- Six agents: design-guardian, seo-preservation, content-migrator, copy-editor, perf-auditor, social-repurposer

### Decisions OPEN — resolve in Code session P0
1. Repo name/org (owner creates, connects GitHub)
2. Postgres provider (recommend Supabase — connector live) + media storage (Supabase Storage vs Vercel Blob)
3. X handle + 3 featured post URLs (HANDLE_TBD placeholders in concept)
4. Tier C prune sign-off + 43→~12 service consolidation sign-off (§11)
5. Valencia STAY-list sign-off (3 pages, §18)
6. FR-only 44th service: promote or keep (§16)
7. VM content storage model (MDX vs CMS) — determines import tooling (§18)
8. Credibility strip numbers
9. matosurf.com as 8th portfolio spread: yes/no

### P0 first commands (suggested)
```
git init mikebastin-portfolio && cd mikebastin-portfolio
mkdir -p docs design assets .claude/agents social
# drop bundle contents in place, commit as "chore: import chat handoff v3.0"
# scaffold: npx create-payload-app@latest (Next.js + Payload template)
# write the six agent files from §6/§12/§16 specs
# resolve open decisions 1-2 with owner, then P1 per §9
```

End of handoff. v3.0 FINAL.

---

## 22. POST-FINAL AMENDMENT — SURF LAYER + SPREAD VIII (owner directive)

### Portfolio addition
Spread VIII: **Matosurf** (matosurf.com) — French-language surf/kite/windsurf kit guide. §21 open decision 9 CLOSED: yes. Portfolio is now 8 spreads.

### Silver Surfer + surf identity
- "Silver Surfer" is one of the owner's nicknames; it appears in PROSE ONLY (currently in the Matosurf spread: "Friends in the line-up still call me the Silver Surfer").
- **IP boundary (hard rule):** no Marvel character imagery, comic art, chrome-humanoid-on-board visuals, or cosmic-herald references anywhere on the site. The nickname is a personal fact stated in text; the visual language is ORIGINAL wave/surf motifs only. design-guardian enforces.
- Design token added both themes: `--silver` (dark #B9C4CF, light #77828E). Silver is the tertiary accent, used sparingly — currently only the second swell line.
- Signature element upgraded: the hero SVG is now TWO self-drawing swell lines, gold over silver, staggered animation (0.4s / 1.1s delay). Reads as sets rolling in. It ties surf, signature and multilingual rhythm into one motif.
- Surf vocabulary in copy, applied with restraint: hero eyebrow "Reading the swell for twenty-five years, in four languages"; work eyebrow "Picked from the line-up"; Matosurf spread prose. Rule for future copy: surf terms are seasoning, never theme-park — max one per section, and only where the metaphor genuinely carries meaning (swell-reading = market timing, line-up = selected work, clean face = uncluttered page). Forbidden-word and dash rules still apply on top.
- Matosurf joins the network linking policy (§19 already lists it) and the asset gap list: fetch its logo/hero in the Code session (domain outside chat sandbox).

---

## 23. POST-FINAL AMENDMENT 2 — ALTERNATING BANDS (owner directive: "too much purple")

### The system
The page is no longer one continuous surface. Top-level blocks alternate between the two surfaces:

- Band order (top to bottom): hero+nav (A) → quote (B) → work (A) → credibility strip (B) → dispatches (A) → footer (B)
- **Dark mode:** A = dark surface, B = ivory. Reads dark-light-dark-light-dark-light.
- **Light mode:** A = ivory, B = dark surface. Reads light-dark-light-dark-light-dark.
- Theme toggle flips the mapping, not the markup.

### Implementation contract (production must mirror this)
- Two surface token sets, band-scoped: `.band-a` / `.band-b` classes carry local custom properties (--bg, --ink, --ink-dim, --gold, --gold-soft, --silver, --rule, --visual-grad, --btn-text). Components consume the same var names everywhere; the band decides values. No per-component theme overrides allowed.
- Gold shifts per surface: #D4AF37/#E8CD7A on dark surface, #A9791E/#8A5A16 on ivory (contrast-safe). Silver likewise (#B9C4CF / #77828E).
- Radial glow gradients live ONLY on the hero band (.band-hero).
- Body background matches the first band per theme to stop overscroll flash.
- **Dark surface desaturated: #1B1030 → #171126** (near-black plum, noticeably less purple). --ink-dim on dark: #C6C0CF. Ivory #F7F1E6 and ink #241234 unchanged.
- In Payload/Next: bands are a layout concern. Section components accept a band prop or derive it from position; new sections added to a page continue the alternation automatically. design-guardian enforces alternation and forbids two same-surface bands touching.

### Why
Halves the aubergine footprint per viewport (the actual complaint), adds editorial rhythm, and makes each portfolio spread section feel like a page turn. Purple is now punctuation, not wallpaper.

---

## 23. POST-FINAL AMENDMENT 2 — PALETTE PIVOT: AUBERGINE RETIRED, SEA PALETTE IN (owner directive)

Owner verdict: aubergine/navy-purple out; he is a sea-blue person. Brief: blue, navy, dark blue — sea and sky — while avoiding the overused tech-blue trap. Solution: teal-undertoned depths, ivory kept as text (sand, not white), gold reads as brass and low sun on water, silver as spray. The palette now reinforces the surf identity (§22) instead of sitting beside it.

### NIGHT SWELL (dark theme — deep water at dusk)
| Token | Value | Role |
|---|---|---|
| --bg | #0A1B28 | deep sea, teal undertone (NOT Tailwind slate) |
| --ink | #F5EFE2 | ivory text (sand) |
| --ink-dim | #AFC0CC | sea-mist secondary |
| --gold | #D4AF37 | brass, unchanged |
| --gold-soft | #E8CD7A | unchanged |
| --deep | #155268 | petrol accent (replaces --wine everywhere) |
| --silver | #BCC9D3 | spray, second swell line |
| --btn-text | #0A1B28 | on gold buttons |

### MORNING GLASS (light theme — beach day, glassy conditions)
| Token | Value | Role |
|---|---|---|
| --bg | #F5F0E4 | sand |
| --ink | #0F2837 | deep-sea ink |
| --ink-dim | #58707F | wet slate |
| --gold | #A9791E | brass darkened for AA contrast |
| --gold-soft | #8A5A16 | |
| --deep | #1C6580 | petrol accent |
| --silver | #6E8291 | |

Rules: theme names are internal vocabulary (use in code comments and design docs, optionally in the toggle tooltip). Anti-generic guard: never drift --bg toward #0F172A/slate-900 or generic SaaS blue; the teal undertone is the identity. Wine (#7A1F3D) is fully retired; --deep is its successor and stays rare. Everything else in §22 (two swells, silver-as-tertiary, IP boundary) unchanged. design-guardian enforces the exact hex values above.

---

## 24. POST-FINAL AMENDMENT 3 — MATOSURF + GLOBAPROM SCRAPED (via fetch layer)

Both sites were reached through the fetch tool after the sandbox blocked them. Findings:

### Globaprom (spread II)
- **Runs Next.js + Payload CMS already** (media served from /api/media/file/, Payload's route). The chosen stack for mikebastin.com has a working precedent inside the owner's own network. Code session can compare notes with the Globaprom repo if accessible.
- Positioning: AI-assisted "vibecoding", fixed scope, fixed price, delivered in weeks, multilingual-ready from the first commit, grew out of BeTranslated. Case studies on site: TX International Freight shipment-tracking portal (cut ~3 h/day of status-chasing), internal reconciliation platform (~10 h/week saved), C21 Perdomo multilingual site + tracking. Spread II copy in the concept now carries the TX portal number.
- No bitmap logo: the wordmark is styled text "Globaprom." — render it typographically in the spread, do not hunt for a logo file.
- OG/hero images pinned in ASSETS-MANIFEST for fetch.

### Matosurf (spread VIII)
- Real scale: 7 board sports, 48+ French spots, 120+ guides, 4 geographic zones. Spread VIII copy now carries those numbers.
- Site already runs a visible EEAT layer (editorial method page, field-experience blocks) — reference it as proof in the spread and reuse the pattern for mikebastin.com's own EEAT work (§13).
- meta-author on site reads "Michaël Bastin" (diaeresis). Site-facing brand on mikebastin.com stays "Mike Bastin" per §2; do not import the diaeresis.
- OG image (surfer in a Hossegor barrel, 1200x630) + hero webp pinned in ASSETS-MANIFEST — strong spread visuals, on-theme with the surf layer (§22).

Network-linking policy (§19) unchanged; both sites confirmed live and linkable.
