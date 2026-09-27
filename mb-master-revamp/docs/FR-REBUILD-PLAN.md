# /fr/ rebuild plan

Owner request, 27 Sep 2026: "Start planning the /fr/ rebuild". This file is
the plan and the decisions behind it. **It is a plan only**: nothing here is
built until the owner approves and locks EN (CLAUDE.md, "FR and ES are
gated on EN", 22 Sep 2026). Phase 1 is the only exception the owner may
choose to release early, because it is redirects rather than copy.

## Owner decisions (27 Sep 2026)

1. **Status: plan only.** EN is not locked yet.
2. **The French reader is a French-speaking company selling abroad**
   (France, Wallonia, Brussels) into Spain, Benelux, Germany or the UK. It
   is the reverse of the EN "French SEO" page, which sells to foreign
   companies entering France. **The main French page is
   `/fr/services/seo/`, and it names no language**: it is our SEO service
   for that French reader, not a French-market page.
3. **Scope: the core set** below is enough for now. Full parity with EN is
   not the target (CLAUDE.md, "a locale version is an adaptation").
4. **Services absorbed into an EN page with no French sibling get a French
   page built** (option B), rather than a redirect to English or to the
   nearest French page.
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

### Services (16)

**Already built (11), to adapt to the French reader:**
`seo` (the main page), `referencement-multilingue`, `referencement-local`,
`sem-multilingue`, `localisation-de-site-web`,
`localisation-juridique-reglementaire`, `seo-espagnol`, `seo-allemand`,
`seo-neerlandais`, `seo-italien`, `seo-portugais`. The language pages are
reframed from "entering France" to "a French company entering Spain,
Germany, the Netherlands". Italian and Portuguese stay live with light
edits only (low priority, CLAUDE.md "Key markets").

**To build under decision 4 (5), each at its strongest legacy URL:**

| EN parent | French page | Absorbed legacy URLs that 301 to it |
|---|---|---|
| translation-services | `/fr/services/traduction-professionnelle/` | traduction-academique, -certifiee-et-assermentee, -commerciale, -financiere, -juridique, -medicale, transcreation |
| app-and-software-localisation | `/fr/services/localisation-applications/` | internationalisation-de-logiciels, localisation-multimedia |
| multilingual-content | `/fr/services/creation-de-contenu-multilingue/` | conseil-culturel, gestion-multilingue-reseaux-sociaux |
| ai-consulting | `/fr/services/conseil-ia/` | none, same URL |
| ai-translation-and-post-editing | `/fr/services/postedition-ia/` | none, same URL |

The sworn translation facts apply to the French translation page as they
do in EN: one to seven days depending on the document and the situation,
and apostille for US and Canadian citizens.

**Absorbed into a French page that already exists (no build):**

| French parent | Absorbed legacy URLs that 301 to it |
|---|---|
| `/fr/services/referencement-multilingue/` | referencement-international, branding-multilingue, internationalisation, solutions-linguistiques |
| `/fr/services/localisation-de-site-web/` | conception-ux-ui-multilingue, cms-multilingue, localisation-contenu, localisation-ecommerce, plugin-de-traduction-wordpress, test-localisation |

**One exception proposed, for the owner to confirm:** the five children of
EN `technical-seo` (recherche-mots-cles, netlinking, analyse-et-suivi,
seo-anglais, seo-on-page) 301 to `/fr/services/seo/` rather than to a new
French technical SEO page. Decision 2 makes `/fr/services/seo/` the main
French SEO page, and these are the parts of it a French buyer is actually
looking for. Building a sixth page instead is the strict reading of
decision 4.

### Posts

The 8 built French posts stay. `seo-au-geo` already maps to the GEO
service. They get the house structure pass (TOC, CTA) once the French CTA
targets exist.

## Phases

**0. Gate.** The owner locks EN. Nothing below starts before that, except
phase 1 if the owner releases it.

**1. Safety net: redirects only, no copy.** Add the 301s above for the 31
absorbed services, `404-2`, `nos-services` and the 2 Globaprom URLs, as a
generated block like the prune redirects. Pages still to be built (the
homepage, contact, about, tarifs, blog index and the 5 new services) point
temporarily at the closest live French page or `/fr/`, and each rule is
removed when its page ships. Result: zero French 404s at launch.

**2. Research.**
- Search Console, 16 months, for every legacy French URL: which carry
  clicks, which carry backlinks worth keeping at the same address.
- Ahrefs Keywords Explorer, France and Belgium databases: a French primary
  and secondaries per commercial page, recorded like `lib/keywords.ts`
  (probably a `fr` block in it). The terms are what a French exporter
  types, e.g. "agence seo international", "référencement multilingue",
  "traduction site web", not "seo France".

**3. Templates and plumbing.**
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

**4. Copy.** Written for the French reader, not translated from EN. Order:
homepage, `seo`, the three key-market language pages (espagnol,
néerlandais, allemand), `referencement-multilingue`,
`localisation-de-site-web`, then the rest. The 21 FR/ES service headings
the heading lint already reports are fixed here. The owner reviews each
page before merge.

**5. QA and launch.**
- Every legacy French URL returns 200 or a single 301, no chains.
- `hreflang` reciprocal on every paired page, `null` where unpaired.
- All lints, `npm run verify`, `check:launch`.

## Open for the owner

- Confirm the `technical-seo` exception above, or build the sixth page.
- Whether phase 1 (redirects only) can start before the EN lock.
