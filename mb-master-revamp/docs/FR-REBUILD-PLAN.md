# /fr/ rebuild plan

Owner request, 27 Sep 2026: "Start planning the /fr/ rebuild". This file is
the plan and the decisions behind it. **It is a plan only**: nothing here is
built until the owner approves and locks EN (CLAUDE.md, "FR and ES are
gated on EN", 22 Sep 2026). **Phase 1 is the one exception, released early
by the owner** (27 Sep 2026), because it is redirects rather than copy.

## Owner decisions (27 Sep 2026)

1. **Status: plan only.** EN is not locked yet.
2. **The French reader is a French-speaking company selling abroad**
   (France, Belgium, which is the owner's natural market and more
   international by nature, or Switzerland; owner, 30 Sep 2026) into Spain, Benelux, Germany or the UK. It
   is the reverse of the EN "French SEO" page, which sells to foreign
   companies entering France. **The main French page is
   `/fr/services/seo/`, and it names no language**: it is our SEO service
   for that French reader, not a French-market page.
3. **Scope: the core set** below is enough for now. Full parity with EN is
   not the target (CLAUDE.md, "a locale version is an adaptation").
4. **Services absorbed into an EN page with no French sibling get a French
   page built** (option B), rather than a redirect to English or to the
   nearest French page. This includes technical SEO, confirmed separately.
5. **The owner writes or reviews every French page** before it ships.
6. **The two Globaprom relocations** (`/fr/services/conception-de-site-web/`,
   `/fr/services/marketing-digital/`) 301 to the French homepage `/fr/`.

## Starting position (measured 27 Sep 2026)

`redirects/content-map.json` holds 74 legacy French URLs. Against the
current build and `site/public/.htaccess`:

| State | Count | What |
|---|---|---|
| Built | 19 | 8 posts, 11 services |
| 301 to valenciamove.com/fr/ | 15 | Valencia lifestyle posts |
| **Neither built nor redirected** | **40** | 7 pages, 31 absorbed services, 2 Globaprom services |

The 40 would 404 at launch, which breaks the never-404 rule whether or not
the French rebuild has started. Routes that exist today: `app/fr/[slug]`
(posts only) and `app/fr/services/[slug]`. There is no `/fr/` homepage
route, no services index, no blog index, no contact page.

**Hreflang pairing to break.** Group `g077` pairs `/fr/services/seo/` with
EN `french-seo` and ES `seo-frances`. Under decision 2 they are different
pages for different readers, so the pairing is wrong: `/fr/services/seo/`
gets no EN or ES sibling (an explicit `null`, per the `group` convention),
and EN `french-seo` keeps its ES sibling only.

## Target French site

Legacy URLs are kept wherever a page is built at the same address, so the
build needs as few redirects as possible.

### Pages

| Page | URL | Legacy source | Notes |
|---|---|---|---|
| Homepage | `/fr/` | `page-accueil` | New route |
| Services index | `/fr/services/` | `nos-services` 301s here | New route |
| About | `/fr/notre-equipe/` | same URL | EN sibling `about-us` |
| Contact | `/fr/nous-contacter/` | same URL | Plus FR thanks and problem pages |
| How we work, billing | `/fr/tarifs/` | same URL, `reposition` | EN sibling `how-i-work`; the no-markup line covers media spend only |
| Blog index | `/fr/blog/` | same URL | Lists the 8 French posts |
| `404-2` | 301 to `/fr/` | | Legacy junk page |

### Services (18)

**Already built (12), to adapt to the French reader:**
`seo` (the main page), `referencement-multilingue`, `referencement-local`,
`sem-multilingue`, `localisation-de-site-web`,
`localisation-juridique-reglementaire`, `seo-espagnol`, `seo-allemand`,
`seo-neerlandais`, `seo-anglais`, `seo-italien`, `seo-portugais`. The language pages are
reframed from "entering France" to "a French company entering Spain,
Germany, the Netherlands". Italian and Portuguese stay live with light
edits only (low priority, CLAUDE.md "Key markets").

**To build under decision 4 (6), each at its strongest legacy URL where one fits:**

| EN parent | French page | Absorbed legacy URLs that 301 to it |
|---|---|---|
| translation-services | `/fr/services/traduction-professionnelle/` | traduction-academique, -certifiee-et-assermentee, -commerciale, -financiere, -juridique, -medicale, transcreation |
| app-and-software-localisation | `/fr/services/localisation-applications/` | internationalisation-de-logiciels, localisation-multimedia |
| multilingual-content | `/fr/services/creation-de-contenu-multilingue/` | conseil-culturel, gestion-multilingue-reseaux-sociaux |
| ai-consulting | `/fr/services/conseil-ia/` | none, same URL |
| ai-translation-and-post-editing | `/fr/services/postedition-ia/` | none, same URL |
| technical-seo | `/fr/services/seo-technique/` (new URL) | recherche-mots-cles, netlinking, analyse-et-suivi, seo-on-page |

The sworn translation facts apply to the French translation page as they
do in EN: one to seven days depending on the document and the situation,
and apostille for US and Canadian citizens.

**Absorbed into a French page that already exists (no build):**

| French parent | Absorbed legacy URLs that 301 to it |
|---|---|
| `/fr/services/referencement-multilingue/` | referencement-international, branding-multilingue, internationalisation, solutions-linguistiques |
| `/fr/services/localisation-de-site-web/` | conception-ux-ui-multilingue, cms-multilingue, localisation-contenu, localisation-ecommerce, plugin-de-traduction-wordpress, test-localisation |

**Technical SEO gets its own French page** (owner, 27 Sep 2026, over the
proposal to fold its children into `/fr/services/seo/`). None of the
legacy URLs names the service as a whole, so it takes a new URL,
`/fr/services/seo-technique/`, and four of them 301 to it.

**`seo-anglais` stays alive** as a French language page (owner, 27 Sep
2026): for the French reader it is a market page like `seo-espagnol`, a
French company selling into the UK or Ireland. EN absorbed its sibling
`english-seo` into technical SEO, so the group `g078` carries
`"locale_actions": {"fr": "migrate"}`: FR keeps the page, EN and ES keep
the absorb. It is built from its legacy copy today and gets the same
adaptation pass as the other language pages in phase 4.

### Posts

The 8 built French posts stay. `seo-au-geo` already maps to the GEO
service. They get the house structure pass (TOC, CTA) once the French CTA
targets exist.

## Phases

**0. Gate.** The owner locks EN. Nothing below starts before that, except
phase 1, which the owner released on 27 Sep 2026.

**1. Safety net: redirects only, no copy. Done 27 Sep 2026.**
`site/scripts/gen-fr-redirects.mjs` writes the `fr-safety-net` block of
`public/.htaccess`. Every legacy French URL points at its final French
destination above with a 301. Where that page is not built yet, it points
instead at the closest live French page with a **302**, so no temporary
target gets cached as permanent. Rerun the script whenever a planned page
ships: its rules become 301s, or disappear for a page built at its own
legacy URL. `scripts/redirect-coverage-lint.mjs` now checks all 74 legacy
French URLs from content-map.json alongside the EN sitemap, so a French
404 or chain fails `npm run verify`. At the time of writing: 10 permanent
rules, 30 temporary, 0 French 404s.

Interim targets while a page is unbuilt: the homepage, indexes, about,
contact, tarifs, blog index, the Globaprom URLs, AI consulting and the
technical SEO children go to `/fr/services/seo/`; translation to
`localisation-juridique-reglementaire`; app localization and AI
post-editing to `localisation-de-site-web`; multilingual content to
`referencement-multilingue`.

**2. Research.**
- Search Console, 16 months, for every legacy French URL: which carry
  clicks, which carry backlinks worth keeping at the same address.
- Ahrefs Keywords Explorer, France and Belgium databases: a French primary
  and secondaries per commercial page, recorded like `lib/keywords.ts`
  (probably a `fr` block in it). The terms are what a French exporter
  types, e.g. "agence seo international", "référencement multilingue",
  "traduction site web", not "seo France".

**3. Templates and plumbing. Started 29 Sep 2026** (owner: "continue
building FR", which releases phase 3 ahead of the EN lock; the French copy
it ships is a draft the owner reviews, per decision 5). First slice done:

- `lib/fr-pages-data.ts` and `lib/fr-pages.ts`: one list of the French
  pages and their English siblings, read by the pages, the sitemap, the
  French menu and the reciprocal hreflang on the English pages. A page
  counts as built when its route file exists.
- Built: `/fr/` homepage, `/fr/services/` index, `/fr/blog/` index,
  `/fr/nous-contacter/` with `merci/` and `probleme/`. The form posts to
  the same `public/contact.php` with `lang=fr`, which lands French
  visitors on the French pages.
- French menu, menu button and call to action on every `/fr/` URL; footer
  links to the French contact and services index, and hides the English
  results link on French pages.
- `pageMeta` takes `ogLocale`; French pages carry `fr_FR`.
- `g077` gets `"hreflang_standalone": ["fr"]`, so `/fr/services/seo/`
  and EN `/services/french-seo/` no longer claim each other.
- `gen-fr-redirects.mjs` rerun: 14 permanent rules, 22 temporary; unbuilt
  pages now wait on `/fr/` rather than on the SEO service page.
- `copy-lint-code.mjs` skips `app/fr/` and `app/es/`: its rules are
  English and misfired on French ("même" matched the first-person "me").
- Legacy titles "Localization ..." corrected to "Localisation ...".

Second slice done (29 Sep 2026):

- `/fr/tarifs/` (sibling of `/how-i-work/`, both halves of the billing
  answer kept) and `/fr/notre-equipe/` (French only, `en: null`).
- The six service pages, written from the English parents' facts only:
  `traduction-professionnelle`, `postedition-ia`, `localisation-applications`,
  `creation-de-contenu-multilingue`, `conseil-ia` (these five get
  `locale_actions {"fr":"migrate"}`) and the new `seo-technique` (group
  `g177`, no EN sibling). The legacy "2 à 4 semaines" turnaround on the
  apps page was dropped: no English source for it.
- `/fr/services/` gains a "Contenu, traduction et IA" group; an odd card
  count in two columns widens its last card.
- `gen-fr-redirects.mjs` rerun: 29 rules, all permanent. No legacy French
  URL waits on an interim page any more.

Lead generation hubs (29 Sep 2026, owner: "work on the lead generation
hubs in fr and es"):

- `/fr/services/generation-de-leads/` and `/es/services/generacion-de-leads/`,
  hand-built siblings of `/services/lead-generation/` with the same case
  in the same order, and only facts the English page states. Slugs and
  h1s from Ahrefs (29 Sep): FR "génération de leads" 800 a month,
  "agence génération de leads" 600; ES "generación de leads" 200 plus 200
  unaccented, "generación de leads b2b" 150.
- `lib/lead-gen-hubs.ts` pairs the three (no content-map group, since all
  three are hand-built routes): reciprocal hreflang on all three pages,
  the sitemaps and the language switcher.
- `Testimonials` shows its labels, review ages and source line in the
  page's language, and drops "Read in English" on FR and ES pages.
- Linked from `/fr/services/` (a card above the groups) and the French
  homepage.
- The ES hub is the first rebuilt Spanish page. Spain has no contact page
  yet, so its calls to action go to `/contact/` and say the form can be
  filled in in Spanish. It uses "tú", as all Spanish copy now does (owner,
  29 Sep 2026).

French copy lint (30 Sep 2026, owner: "continue building the fr site"):

- `scripts/fr-copy-lint.mjs` (`npm run lint:fr`, in `verify`) reads the
  built `out/fr/` and fails on: first-person voice (je, mon, mes), "tu",
  a plain or missing space before `: ; ? !`, straight double quotes,
  US spellings (optimiz-, localiz-), "25 ans", Title Case headings, the
  French forbidden words, and untranslated English runs. Blockquotes and
  a query quoted in « » are exempt.
- `scripts/fr-copy-fix.mjs` (`npm run fix:fr`) applies the mechanical half
  to `content/fr/`: non-breaking spaces and French spellings, skipping
  code, links and HTML. First run: 68 files, 391 spacing and 73 spelling
  findings cleared.
- First measurement after the fixer: 179 findings left, 116 of them
  untranslated English. `/fr/services/seo/`, the main French page, carried
  40 English runs; `seo-allemand`, `seo-portugais` and
  `referencement-local` were mostly English.

Phase 4 started the same day on those findings (below).

Legacy French copy to fix in phase 4, noted while
building: several service excerpts say "25 années d'expérience" (the
owner's rule is "over two decades"), and two post titles use
"optimizer" for "optimiser".

The original phase 3 list:
- Routes: `/fr/` homepage, `/fr/services/` index, `/fr/blog/` index,
  `/fr/nous-contacter/` plus thanks and problem, `/fr/notre-equipe/`,
  `/fr/tarifs/`.
- `pageMeta` with `locale: "fr_FR"`, French OG cards (the `opengraph-image`
  routes take the French title), `hreflang` read from content-map as today.
- `SiteFooter`: link the new French indexes, review the French motto.
- Sitemaps: `sitemap-fr-pages.xml` gains the new pages.
- A French copy lint: vouvoiement, a non-breaking space before `: ; ! ?`,
  French quotation marks, sentence-case headings, and the French forbidden
  words, alongside the existing EN lints.

**4. Copy. Started 30 Sep 2026.** Twelve service pages rewritten from
their English entries and the legacy facts, for the French exporter, with
h1s from Ahrefs FR (29 Sep): `seo` ("seo international" 1,100,
"référencement naturel" 1,900; the homepage keeps "agence SEO
internationale"), `referencement-multilingue` ("seo multilingue" 200),
`seo-espagnol` ("seo espagne" 70), `seo-neerlandais`, `seo-allemand`
("seo allemagne" 40), `seo-portugais` ("seo portugal" 90), `seo-italien`,
`seo-anglais` (60), `referencement-local` ("seo local" 2,000,
"référencement local" 1,200), `sem-multilingue`, `localisation-de-site-web`
("traduction site web" 450) and `localisation-juridique-reglementaire`.
The eight live French posts got a voice and cleanup pass ("nous").

Same day, metadata and cards: the FR and ES `[slug]` routes now build
their metadata with `pageMeta()` (canonical, og:url, `fr_FR`/`es_ES`,
the frontmatter `metaTitle`), every French route and the Spanish hub has
its own share card, the 18 French services carry a short `name`, and the
French footer lists the main page and the key markets by those names.
The eight French posts got `metaTitle`s. The 129 legacy FR and ES pages
were harvested (`docs/LEGACY-CONTENT-HARVEST.md`).

Phase 5 QA started the same day: every internal link on the built French
pages checked. Legacy links inside the eight live posts now point at
their final page (no redirect hop), links to relocated Valencia posts go
straight to valenciamove.com, and the French byline links to
`/fr/notre-equipe/`. 91 images the French and Spanish posts still
loaded from the old WordPress `wp-content` folder now ship from
`public/images/legacy/` (6.7 MB); one was already missing on the live
site and belongs to a relocated Valencia post.

Written for the French reader, not translated from EN. Order:
homepage, `seo`, the three key-market language pages (espagnol,
néerlandais, allemand), `referencement-multilingue`,
`localisation-de-site-web`, then the rest. The 21 FR/ES service headings
the heading lint already reports are fixed here. The owner reviews each
page before merge.

**5. QA and launch.**
- Every legacy French URL returns 200 or a single 301, no chains.
- `hreflang` reciprocal on every paired page, `null` where unpaired.
- All lints, `npm run verify`, `check:launch`.

## Status (30 Sep 2026)

| Phase | State |
|---|---|
| 1. Redirects, no legacy URL 404s | Done (29 URLs, all 301) |
| 2. Decisions | Done (owner answers 1 to 6 and the follow-ups) |
| 3. Templates and plumbing | Done: homepage, services and blog indexes, contact, tarifs, notre-equipe, the lead generation hub, share cards, metadata, footer, `<html lang>`, `lint:fr` |
| 4. Copy | Done as a draft: 18 service pages, the 8 live posts, the hub; the owner reviews |
| 5. QA | Links, images, hreflang, redirects and all lints pass; the owner's review is the last gate |

Two EN posts gained a French adaptation on 30 Sep 2026 (`g014`
`bonnes-pratiques-seo-multilingue`, `g166` `seo-technique-site-multilingue`),
written for the French company selling abroad, with FR service links; they
pair with their EN siblings in hreflang and sit under the new French topic
`seo-multilingue`. The French journal now has 10 posts.

## Open for the owner

- Review the French copy in one go (PR #118): every page is a draft.
- Confirm the Portuguese page's "working level" wording against the vague
  German and Italian rule.
- The 8 unrebuilt Spanish-first items in `docs/LEGACY-CONTENT-HARVEST.md`
  wait for the Spanish rebuild, which the EN lock gates (CLAUDE.md).
