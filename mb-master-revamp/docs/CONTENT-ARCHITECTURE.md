# Content Architecture: mikebastin.com

Site structure for the rebuild, built with Koray Tuğberk Gübür's semantic
SEO method (source context, central entity, topical border, core vs outer
section, contextual hierarchy). Companion to `HANDOFF.md` (scope and design)
and `ROADMAP.md` (sequencing).

Baseline: 43 service pages, 91 EN posts, 7 core pages, plus FR and ES
layers. About 6 clicks across the whole domain in 90 days. Impressions exist
(18,522 on one page alone) but nothing converts. The diagnosis is topical
dilution: the domain talks about Valencia flats, YouTube money, Instagram
tools, and multilingual SEO with equal weight, so it is an authority on
none of them.

---

## 1. Semantic foundation

| Layer | Value |
|---|---|
| **Central entity** | Mike Bastin, multilingual search consultant |
| **Source context** | Selling multilingual SEO, localisation, and AI consulting to businesses entering non-native language markets |
| **Central search intent** | "Make my business findable and convertible in a language that is not my first" |
| **Core section** | Multilingual and language-market SEO, localisation, translation, AI for search and language |
| **Outer section** | General SEO craft and tooling, kept only where it bridges back to the core |
| **Topical border** | Anything with no path back to multilingual search or AI for language. Valencia lifestyle sits outside it. So does generic social media advice |

The border is the whole point. Every page that survives has to answer "how
does a reader of this page become a multilingual SEO client." Pages that
cannot answer it either move to a network property or get retired.

---

## 2. Locale architecture (EN, FR, ES)

Everything downstream is expressed in EN slugs for readability. The site is
trilingual, and the locale rules below override any reading of sections 3 to
6 as an EN-only exercise.

### Inventory (verified 2026-07-28, `HANDOFF.md` §16)

| Type | EN | FR | ES |
|---|---|---|---|
| posts | 91 | 23 | 20 |
| pages | 7 | 7 | 7 |
| services | 43 | **44** | 43 |

About 285 content objects. FR carries one more service than EN and ES.

### Consolidation happens at the translation group, never per locale

The single most important rule in this document. Slugs are fully localised
with no mirroring, confirmed in `HANDOFF.md` §16:

| EN | FR | ES |
|---|---|---|
| `ai-consulting-services` | `conseil-ia` | `consultoria-de-inteligencia-artificial` |

An FR redirect target can never be derived from the EN slug. Relations
resolve through WPML `trid` groups in `icl_translations`, never by slug
similarity.

The consequence for section 3: the "43 to 13" table describes **13
translation groups**, not 13 EN pages. Merging EN page B into EN page A
obliges the FR and ES siblings of B to merge into the FR and ES siblings of
A. Consolidating each locale independently would orphan locales and break
hreflang structurally, because one translation group is one hreflang
cluster. Groups merge as groups.

Same rule for every disposition in section 5. Those slugs are EN labels for
group records. A group relocates, repositions or retires in every locale it
exists in, or not at all. Relocating an EN post to globaprom.com without
resolving its FR and ES siblings orphans them.

**Redirects stay inside their locale.** An absorbed FR service 301s to the
FR pillar, never to the EN one. Already in the `seo-preservation` spec, and
worth restating because it is the easiest thing to get wrong at scale.

### The FR-only 44th service blocks the merge count

One FR service has no EN or ES sibling: a group record with `"en": null`
and `"es": null`. Until it is identified, the consolidation arithmetic does
not close, because 44 to 13 and 43 to 13 are different merges. Three ways
out, owner's call once it is named: write EN and ES siblings, keep it
FR-only as a legitimate single-locale cluster with x-default EN, or fold it
into an FR pillar.

### FR outperforms EN per page, and that is the lesson

| FR page | 90d impressions |
|---|---|
| `/fr/agence-seo-internationale/` | 1,969 |
| `/fr/consultant-referencement-international/` | 1,316 |
| `/fr/expert-en-seo-international/` | 980 |

Roughly 4,265 impressions from three pages, against 702 for the entire EN
homepage. `/fr/` ranks at position 7.7 on "bastin". FR holds a quarter of
EN's blog volume and beats it per page.

The reason is topical, not linguistic. Those three FR pages cluster tightly
on international-SEO-consultant queries, which is exactly the source context
in section 1. FR is already the focused site that EN is trying to become.
Use the FR query set as a model when rebuilding EN, rather than translating
EN's sprawl into French.

Two FR quick wins sit on page one with no clicks:
`/fr/services/localisation-ecommerce/` at position 9.5, and `/fr/` at 7.7.
Title and meta surgery, same as `french-ppc-campaign` in EN.

### Cluster coverage differs by locale, deliberately

Koray's completeness rule applies per locale. Five clusters spread across 23
FR posts gives five half-covered clusters, which ranks worse than two
complete ones.

- **Services: complete in all three locales.** All 13 groups, every locale.
  Service pages are the money and are template-driven, so depth is
  affordable.
- **Blog: FR and ES ship fewer clusters, fully covered.** For FR the choice
  is already made by the data: the international SEO consulting cluster
  (proven above) plus the language-market cluster. Two clusters, complete,
  beats five thin ones.
- **ES cannot be planned yet.** See below.

### The ES layer has never been measured

`HANDOFF.md` §11 gives a Tier A list for EN and an explicit Tier A-FR list.
There is no ES equivalent anywhere in the record. ES appears only as
"siblings resolved via content-map". So 43 ES services and 20 ES posts exist
and nobody has looked at what they do.

Two things make that worth resolving before P3 rather than after. The owner
is based in Valencia, so an unmeasured Spanish layer is a strange blind
spot. And the strongest Spanish-market content on the domain is Valencia
lifestyle, all of which leaves for valenciamove.com/es/ under section 6,
which could leave the ES layer thin once the exodus completes.

Action: pull GSC for the `/es/` path before choosing the ES cluster set.
`HANDOFF.md` §17 closed "all three locales ship at launch", so if the data
says the ES layer is hollow, that is a decision to reopen consciously rather
than discover at launch. Flagged in section 10, not decided here.

---

## 3. Service consolidation: 43 to 13

Koray's rule is one page, one query network, covered completely. One
consultant cannot cover 43 query networks properly, which is why all 43 are
thin. Consolidate to what can genuinely be covered, keeping every page that
already carries proven demand.

### Core cluster 1: Multilingual search (the money)

| New page | Absorbs (301, same locale) | Note |
|---|---|---|
| `/services/multilingual-seo/` **PILLAR** | global-seo-solutions, internationalisation, language-solutions, multilingual-branding | global-seo-solutions carries 2,825 impressions. Carry its content across, do not discard it |
| `/services/french-seo/` | keep | Working cluster, has data |
| `/services/german-seo/` | keep | Working cluster, has data |
| `/services/spanish-seo/` | keep | |
| `/services/dutch-seo/` | keep | Feeds the Bemelman case study |
| `/services/italian-seo/` | keep | Completes the grid |
| `/services/portuguese-seo/` | keep | Completes the grid |

Six language pages on one template is a scalable set and each owns a clean,
distinct query network. Keep the grid complete rather than trimming it.

### Core cluster 2: Localisation and translation

| New page | Absorbs |
|---|---|
| `/services/website-localisation/` **PILLAR** | content-localisation, localisation-testing, multilingual-cms-integration, wordpress-translation-plugin, localised-e-commerce-integration, multilingual-ux-ui-design |
| `/services/translation-services/` **PILLAR** | business, medical, academic, financial, legal, certified-and-sworn, expert-translation, transcreation |
| `/services/app-and-software-localisation/` | app-localisation, software-internationalisation, multimedia-localisation |

Legal and certified/sworn translation have the strongest independent query
networks of the eight absorbed. Split them back out later if data supports
it, once the pillar ranks.

### Core cluster 3: AI (the differentiator)

| New page | Absorbs |
|---|---|
| `/services/ai-consulting/` **PILLAR** | ai-consulting-services |
| `/services/ai-translation-and-post-editing/` | post-ai-editing |

### Core cluster 4: Supporting capability

| New page | Absorbs |
|---|---|
| `/services/technical-seo/` | on-page-seo, keyword-research, analytics-and-tracking, english-seo, link-building, local-seo |
| `/services/multilingual-content/` | multilingual-seo-copywriting, cultural-consulting, multilingual-sem, multilingual-social-media-management |

### Retired from services

`web-design` and `digital-marketing` belong to Globaprom, not to a search
consultancy. 301 both to `/services/multilingual-seo/` and carry a
contextual network link to globaprom.com per the linking policy in
`HANDOFF.md` §19.

**Result: 43 to 13.** Every absorbed slug 301s to its absorbing page in the
same locale, per the sales-page rule in `HANDOFF.md` §16.

---

## 4. Blog topical map

Five clusters, each with a pillar and supporting nodes, each linking up to
its matching service page. Nothing sits orphaned.

### Cluster A: Multilingual SEO → `/services/multilingual-seo/`
**Pillar:** best-practices-for-multilingual-seo (1,398 imp)

technical-seo-for-multilingual-websites, multilingual-keyword-research,
optimising-multilingual-website-content,
cultural-differences-in-multilingual-websites,
common-mistakes-to-avoid-when-localising-your-website,
building-a-global-brand, roi-of-website-localisation,
user-interface-localisation-can-transform-your-global-reach,
localisation-testing-tools,
google-analytics-international-marketing-limits,
alternatives-to-google-analytics

### Cluster B: Language markets → the six language service pages
**Quick win:** french-ppc-campaign sits at position 6.9 with no clicks.
Title and meta surgery here pays before any new content does.

english-to-french-translation-services, german-seo-best-practices,
german-seo-content-localisation,
technical-seo-considerations-for-german-websites, spanish-on-page-seo,
spanish-keyword-localisation, technical-seo-for-spanish-search-engines,
content-optimisation-for-spanish-users, spanish-seo-markets,
link-building-in-spain, seo-in-belgium

### Cluster C: AI and the future of search → `/services/ai-consulting/`
**Pillar:** generative-engine-optimization

search-everywhere-strategy, future-of-seo,
how-ai-is-revolutionising-seo-strategies,
how-ai-is-transforming-translation-and-localisation,
how-to-use-ai-and-machine-translation-tools, ai-powered-marketing,
conversational-ai-chatbots-business (2,336 imp),
llms-beyond-giants-hidden-ai-models, prompt-engineers,
optimising-your-website-for-voice-search

The site already picks up AI-query-style impressions. Leaning into GEO here
is the cheapest available advantage.

### Cluster D: SEO craft (outer section) → `/services/technical-seo/`
**Pillar:** competitor-analysis-traffic-checklist (18,522 imp, position 56)

Biggest asset on the domain by a wide margin, and it currently ranks
nowhere useful. Rebuilding it as a genuine flagship guide is the single
highest-value content job in the project.

competitor-analysis, technical-seo-audit-checklist, internal-linking-tools
(1,372), long-tail-keywords, what-is-search-intent-mapping,
seo-mistakes-to-avoid, chrome-extensions-for-seo,
link-selling-and-link-buying-platforms,
how-to-create-a-targeted-content-strategy, affordable-seo-services,
boosting-local-seo, optimise-a-google-business-profile,
how-to-promote-your-local-business-on-google-maps, law-firm-seo-services

law-firm-seo-services is the contextual bridge into the Delaguía y Luzón
case study. Wire it deliberately.

### Cluster E: Language industry → `/services/translation-services/`
language-service-providers, chrome-extensions-for-translators,
language-data-analysis

---

## 5. Recycling: five dispositions, not two

Owner directive: recycle as much as possible, in updated form. Retirement is
the last resort, not the default. Every piece gets one of five dispositions,
and only the fifth destroys work.

| Disposition | What happens | Rough count (EN) |
|---|---|---|
| **Refresh** | Stays in its cluster. Facts, stats and examples updated, meta rewritten | ~50 |
| **Merge** | Folds into a pillar. The content is absorbed, never binned, and the slug 301s | ~14 |
| **Reposition** | Real substance, wrong angle. Rewritten to sit inside the border | ~6 |
| **Relocate** | Belongs to another property in the network. Moves there, 301s across | ~30 |
| **Retire** | Genuinely nothing worth saving | ~6 |

That recycles roughly 93% of the English corpus. The retire list drops from
14 pieces to about 6.

**Important caveat on everything below.** These routings are inferred from
slugs, impression data and cluster fit, not from reading the articles. A
slug can misdescribe its own content, so each candidate needs a read before
it moves. Treat the table as a shortlist to check, not a decision already
made.

### Relocate: which posts feed which property

The network-linking policy in `HANDOFF.md` §19 already says these topics
belong to these domains. Recycling applies the same logic to whole articles
rather than just links.

**→ globaprom.com** (custom AI software, automation, "vibecoding" builds)

| Post | 90d imp | Why it fits Globaprom better |
|---|---|---|
| `conversational-ai-chatbots-business` | 2,336 | Buying intent here is "build me a chatbot", which is Globaprom's product and not a search consultant's. The single most valuable relocation on the list |
| `llms-beyond-giants-hidden-ai-models` | no data | Model selection is a build-time engineering decision, not an SEO one |
| `prompt-engineers` | no data | Hiring and working with prompt engineers describes Globaprom's own practice |
| `services/web-design` | no data | Globaprom builds sites. Supersedes the earlier note in section 3 that sent this page to a mikebastin pillar; relocating the content and 301ing the URL is strictly better than discarding it |
| `email-marketing-hacks...` | no data | Reposition as email and follow-up automation, which is a Globaprom capability. Currently on the retire list, and worth more as a rewrite |
| `ai-powered-marketing` | no data | Split candidate: the automation half feeds Globaprom, the campaign half stays in cluster C |
| `language-data-analysis` | no data | Weakest of the set. Data pipelines lean Globaprom, linguistics leans BeTranslated. Read before routing |

Relocating the chatbots piece hands Globaprom a page already earning 2,336
impressions, and removes the strongest off-border commercial signal from
mikebastin.com. Both sides gain.

Note the asymmetry worth exploiting: Globaprom already runs Next.js, so a
relocation is a content move between two similar stacks rather than a port.

**→ txintlfreight.com**

`best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits`.
Supplier scouting and EU Deforestation Regulation audits are supply-chain
compliance, which is exactly what a freight forwarder's clients wrestle
with. Currently marked retire, and completely wasted there.

**→ betranslated.com**

`chrome-extensions-for-translators` and `language-service-providers`. Both
speak to translators and to buyers comparing agencies, which is
BeTranslated's audience rather than a consultant's. Keep
`language-service-providers` on mikebastin instead if the intent turns out
to be buyer-side comparison; read it first.

**→ valenciamove.com**

The Valencia set, per section 6. Around 22 EN pieces plus FR and ES
siblings, the largest single relocation.

**→ matosurf.com (speculative, needs a look)**

`affiliate-marketing-programs` carries 2,278 impressions and no commercial
fit here, and was the judgement call flagged in the earlier draft. Matosurf
is an affiliate-driven gear guide, so the topic is genuinely native there.
Two problems: Matosurf is French and the piece is English, and a generic
affiliate article may not suit a gear site's editorial line. Worth reading
before deciding between relocate, reposition or retire.

### Reposition: keep the substance, change the angle

Currently on the retire list, but the underlying work is reusable if the
frame changes.

| Post | Rewritten as |
|---|---|
| `most-popular-marketing-strategies` | Market-entry strategy for businesses selling in a second language |
| `15-simple-blog-post-ideas...` | Building a multilingual content calendar that does not just translate the English one |
| `how-to-write-about-your-professional-background` | About pages that carry credibility across languages, feeding the copywriting service |
| `global-business-trends` | Which markets are worth localising into next |
| `digital-marketing-advisor` | Folds into the About or How I Work page rather than surviving as a post |
| `eeat-vs-aeat-typo` | Read this one first. AEAT is the Spanish tax agency, so the piece may be a deliberate disambiguation play with real Spanish-market value, or it may be a stray typo page |

### Retire: what is genuinely left

`how-to-use-twitter-for-beginners`, `how-to-make-money-on-youtube`,
`top-instagram-tools`, `mastering-the-art-of-networking`,
`human-creator-economy`, `360-marketing-agency`.

Six pieces, all consumer-social or generic-agency content with no route back
to the core and no network property that wants them. Each 301s to the
nearest cluster pillar. No 404s.

---

## 6. Valencia exodus → valenciamove.com

Per `HANDOFF.md` §18, confirmed by this analysis. Valencia lifestyle content
is the strongest cluster on the domain (valencia-cost-of-living alone holds
10,601 impressions at position 12.9) and also the furthest outside the
topical border. Moving it does two jobs at once: valenciamove.com absorbs
real equity, and mikebastin.com finally reads as a single-subject site.

Mechanics stay as specified: merge first where valenciamove.com already
covers the topic, then 301 cross-domain at the edge, same locale, permanent.
FR and ES siblings resolve through `content-map.json`, never handled
EN-only.

### Per locale

valenciamove.com is quadrilingual (EN, FR, ES, NL) with 517 localised URLs
out of 1,013, so same-locale targets exist for the FR and ES sets rather
than having to be created.

**FR set** (from `HANDOFF.md` §18): `transport-a-valencia` (555 imp),
`cout-de-la-vie-valencia`, `expatrie-valencia`, `plages-de-valencia`,
`vivre-en-appartement-a-valencia`,
`travailler-a-valencia-en-tant-quexpatrie`, `visa-nomade-numerique-espagne`,
`avocats-a-valencia` (727 imp).

Two FR cases need handling by name:

- `visa-nomade-numerique-espagne` already exists at the **identical slug**
  on both domains. Cleanest possible redirect, and the clearest single proof
  of the cannibalisation the exodus exists to end.
- `avocats-a-valencia` (727 imp) links Delaguía y Luzón, and
  valenciamove.com already runs immigration-lawyer pages per locale. Treat
  as redirect-to-existing with a merge pass, and keep the Delaguía link
  alive on the receiving page so the network policy in `HANDOFF.md` §19 is
  not quietly dropped in the move.

**ES set:** resolves through `content-map.json` group records. Not
enumerated in the source material, which is the same ES blind spot as
section 2.

**Bonus:** valenciamove.com supports NL. Migrated pieces can gain a Dutch
version they never had on mikebastin.com.

**Stays on mikebastin.com** (B2B funnel, inside the border):
optimising-your-website-for-valencia-based-searches,
b2b-trade-shows-in-valencia, business-registration-in-valencia.

---

## 7. Page architecture

```
/                          portfolio homepage (the 8 spreads)
/work/                     case study index
/work/<client>/            8 case studies, one per portfolio spread
/services/                 services root
/services/<13 pages>/      per section 4
/about/                    was /about-us/
/how-i-work/               was /pricing/, reframed as process
/contact/                  was /contact-us/
/blog/                     blog index
/blog/<slug>/              surviving posts, per section 4
```

Mirrored under `/fr/` and `/es/`, with every segment localised. Route
segments localise too, not just the leaf slug:

```
EN   /services/ai-consulting/
FR   /fr/services/conseil-ia/
ES   /es/servicios/consultoria-de-inteligencia-artificial/
```

Whether the `/services/` segment itself localises to `/servicios/` is a
decision to make once rather than per page, since it changes every service
URL in the locale. Either answer is implementable with per-locale content
directories; picking one late is what hurts.

Leaf slugs come from `content-map.json`, never invented and never derived
from EN. Locales that legitimately lack a sibling emit no hreflang alternate
for that locale rather than a guessed URL.

The case studies are the missing EEAT layer. Every one links out to the
client site and inward to its matching service page, which is what turns a
portfolio into a ranking asset rather than a brochure.

---

## 8. Design notes from bynoju.com

Scraped 2026-07-29. What is worth taking is the structure, not the skin.

### Worth adopting

**The narrative spine.** NOJU runs Start, Problem, Solution, Services, Agent
team, Process, Work, Why, Contact. A problem-to-solution argument, not a
grid of cards. The current concept jumps from hero to work with only a
pull-quote between, so there is room for a problem and solution beat before
the spreads.

**Four blocks, one system.** NOJU's services section is literally titled
"Vier blokken, één samenhangend systeem" (four blocks, one coherent system),
with six to eight capability bullets under each block. Four surfaces, not
forty-three. Direct precedent for the consolidation in section 3, and a
better way to present 13 services than a 13-item menu: group them as four
outcomes with the detail underneath.

**Two-part headlines.** Every section splits its headline in two, with the
second half carrying the turn and the emphasis. Maps cleanly onto the
italic-gold emphasis treatment already locked in the design.

**Eyebrow labels** on every section, and a **generous section rhythm**
(`clamp(72px, 10vw, 140px)`).

**A search plus GEO callout** presented as a sub-block inside services
rather than its own page.

### Not worth adopting

NOJU is near-black (`#06060a`) with a violet accent, Geist and Geist Mono,
an animated network canvas, and a custom cursor. Three of those were already
rejected for this project: monospace was dropped in v1 and marked never to
return, the animated canvas plus dark techy direction was rejected as "too
austere, too techy, not glamorous enough", and purple was retired only
recently in favour of the sea palette.

Recommendation: take NOJU's structure and rhythm, keep the locked Night
Swell and Morning Glass palette with Fraunces. Reopening the palette is the
owner's call, and worth making deliberately rather than by drift. Flagged as
an open question in section 10.

---

## 9. Sequencing

0. **Resolve translation groups before anything else.** Build
   `content-map.json` from `icl_translations` trid groups, so every decision
   below is made on groups rather than on EN pages. Identify the FR-only
   44th service in the same pass, and pull GSC for `/es/`. Nothing here is
   expensive, and every later step depends on it.
1. **Sign-offs.** The retire list, the 43-to-13 consolidation, and the
   Valencia stay-list all need owner approval before anything is built. Each
   sign-off covers a group, in all locales that group exists in.
2. **Redirect map.** Every decision above becomes a line in
   `redirects.json` and a record in `content-map.json`, per locale. No page
   moves before its same-locale redirect exists.
3. **Quick wins.** french-ppc-campaign (EN, position 6.9),
   /fr/services/localisation-ecommerce/ (9.5), and /fr/ (7.7) are all on
   page one with no clicks. Title and meta surgery costs hours and pays
   before the rebuild ships.
4. **Core section before outer.** Koray's momentum rule. Build all 13
   service pages and the language grid completely before touching outer blog
   content.
5. **Flagship rebuild.** competitor-analysis-traffic-checklist, then the
   Cluster A and C pillars.
6. **Valencia exodus** with the blog migration, before WordPress retires.

---

## 10. Open questions for the owner

1. **Palette.** bynoju.com is dark violet with monospace, which is close to
   the rejected v1 direction. Keep Night Swell and Morning Glass with
   Fraunces, or reopen?
2. **affiliate-marketing-programs.** Retire it and lose 2,278 impressions,
   or keep it outside the border?
3. **Four-outcome grouping.** Present the 13 services as four outcome blocks
   in NOJU's style, or as a flat list of 13?
4. **/pricing/.** Reframe as /how-i-work/, or keep public pricing?
5. **Legal and sworn translation.** Fold into the translation pillar now and
   split back out later, or keep separate from the start?
6. **The FR-only 44th service.** Needs identifying first, then a call:
   promote to EN and ES, keep FR-only, or fold into an FR pillar. Blocks the
   consolidation arithmetic either way.
7. **The ES layer.** Pull GSC for `/es/` before P3. If the layer is hollow
   once Valencia content leaves, does ES still ship at launch as
   `HANDOFF.md` §17 closed, or become a fast-follow?
8. **Localised route segments.** Does `/services/` become `/servicios/` and
   `/fr/services/`, or do route segments stay English with only leaf slugs
   localised? One decision, every service URL in two locales.

---

## 11. Inventory gap found while building this map

`sitemap-MB-EN.txt` is named as "the URL inventory of record" for redirect
coverage in `HANDOFF.md` §6, and the `seo-preservation` agent is told to
validate against it. Checking this map's slugs against that file turned up
two problems, both blocking.

**It is missing URLs that carry real traffic.** The file holds 138 URLs
(43 services, 95 everything else). Two pages named in the §11 migration
matrix do not appear in it at all:

| Missing URL | 90d impressions |
|---|---|
| `/competitor-analysis-traffic-checklist/` | 18,522 |
| `/conversational-ai-chatbots-business/` | 2,336 |

The first is the single biggest asset on the domain. Validating redirect
coverage against this file as it stands would pass a launch that 404s it.
Note that `/competitor-analysis/` is present and is a different page, so a
loose slug match hides the gap rather than catching it.

**It covers EN only.** Zero `/fr/` or `/es/` URLs, against an inventory of
23 FR posts, 20 ES posts, 44 FR services, and 43 ES services in §16. Roughly
130 live URLs have no redirect baseline whatsoever, including
`/fr/agence-seo-internationale/` at 1,969 impressions.

**Fix before P3.** Rebuild the inventory from the live WordPress database
per locale rather than from the exported sitemap, commit it as
`sitemap-MB-EN.txt` plus FR and ES equivalents, and point
`seo-preservation` at all three. Cross-check the rebuilt inventory against
GSC's page list so anything with impressions but no sitemap entry surfaces
instead of hiding. Until that lands, treat any redirect-coverage pass as
incomplete regardless of what it reports.

---

## 12. Content scraping

Extraction runs through the `content-migrator` agent against the documented
WordPress REST path, not by ad hoc scraping. The quirks in `HANDOFF.md` §8
(explicit site_url, `&lang=` per locale, `?context=edit` for raw content,
six to seven items per batch, control-character stripping) are hard-won and
still apply.

Order of work: build `content-map.json` from the decisions above so every
record carries its tier, action, destination, and per-locale slugs. Extract
only what survives. Nothing gets scraped twice, and nothing gets scraped
before its fate is decided.
