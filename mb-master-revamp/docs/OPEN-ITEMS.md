# Open items log

The one list of what is waiting, kept current. **Update it in the turn an
item opens or closes**, then move the line to "Closed" with the date and the
answer. Each owner question has an ID (Q1 to Q24) that matches the answer
sheet published for the owner; answers given there are copied here and acted
on in the next session.

Last updated 30 Sep 2026. Merged to `main` so far: PR #117 (FR phase 3 and
hubs), #118 (French lint, Spanish rebuild), #119 (FR and ES posts, recycled
illustrations). No PR is open.

## Waiting on the owner

### Facts only the owner can settle

| ID | Item | Where it shows |
|---|---|---|
| Q1 | Houston freight: English only (case study) or English and Spanish (multilingual SEO page)? | `lib/projects.ts` `tx-international-freight`, `/services/multilingual-seo/` |
| Q2 | Does "daily quote requests doubled over eighteen months" stay? | `/services/multilingual-seo/` |
| Q3 | Bemelman Spuiterij: Hillegom or Noordwijkerhout? | Case study, `/services/local-seo/`, `/services/dutch-seo/` |
| Q4 | Valencia law firm: three languages or four (Russian)? | `/services/multilingual-seo/`, its case study |
| Q5 | Dropped client figures: restore any (BeTranslated 68 %, Delaguía 42/27/34 %, Smartown 19/28 %, the 1,25 % to 11 % outreach test, two Business Profile cases)? | Spanish posts (dropped 30 Sep 2026) |
| Q6 | Unsplash key pasted in chat: rotated? | Security |

### Positioning and copy

| ID | Item |
|---|---|
| Q7 | One positioning claim per service page that a competitor could not also make |
| Q8 | "agency" in the generative engine optimization h1 ("generative engine optimisation agency" 1,300 a month, KD 1) |
| Q9 | GEO blog post and GEO service page target the same term |
| Q10 | Posts over 2,000 words (search intent, technical audit, future of SEO, SEO in Belgium, in FR and ES): trim? |
| Q11 | Portuguese page "working level" wording against the vague German and Italian rule |
| Q12 | Globaprom data-privacy and MT-compliance article (backlog since 6 Sep) |

### French and Spanish

| ID | Item |
|---|---|
| Q13 | Confirm the Spanish reader: a Spanish-speaking company selling abroad |
| Q14 | Confirm `seo-ingles` stays live (the twin of French `seo-anglais`) |
| Q15 | Confirm the two Globaprom pages redirect to the homepage in FR and ES |
| Q16 | Review order for the FR and ES drafts (every page is a draft) |
| Q17 | Sign off the FR and ES motto lines |
| Q18 | Which further EN posts get a FR or ES adaptation |
| Q19 | The Valencia lifestyle posts still live on the old site (ten French, one Spanish) and `trabajar-en-remoto-desde-valencia` |

### Site and launch

| ID | Item |
|---|---|
| Q20 | Approve and lock EN (the gate for treating English edits as costly) |
| Q21 | X handle and the three featured post URLs |
| Q22 | Credibility strip numbers |
| Q23 | matosurf.com as an eighth portfolio spread |
| Q24 | Illustrations: homepage, and the Spain map on the Spanish SEO page |

## Mine to do (no owner decision needed)

| ID | Item | Note |
|---|---|---|
| E1 | `audit:sources` flags two English posts that are false positives (a number in a table, the directory name 11880.com) | Tune the audit |
| E2 | `content/fr/posts/transport-a-valencia.md` is still an English body | Not built into `/fr/`, so no visitor sees it; translate or delete when Q19 is answered |
| E3 | `content/es/posts/trabajar-en-remoto-desde-valencia.md` is edited but not live | Waits on Q19 |
| E4 | Heading-shape lint reports FR and ES without failing | By design, word counts do not translate |
| E5 | FR and ES topic pages have no hreflang | By design, each locale groups its own posts |
| E6 | `design/dl-art/geo/make-variants.mjs` needs `d3-geo`, `topojson-client`, `topojson-simplify`, `world-atlas` in a scratch folder | Documented in `docs/DL-ART.md` |
| E7 | Preview is `noindex` site-wide until launch (30 Oct 2026) | `npm run check:launch` says whether the site can go |
| E8 | `content/nl` (Belgium, Netherlands) is planned after the three locales | Do not build early |

## Closed

| ID | Item | Closed |
|---|---|---|
| | The twelve posts rendering "Uncategorised" | Gone from the journal index (checked 30 Sep 2026) |
| | Dutch SEO "agency" in the title | The h1 already reads "Dutch SEO and GEO agency" |
| | Address "12 - 2" | Owner, 30 Sep 2026 |
| | French formal register, short footer labels, Polylang and the other platforms | Owner, 30 Sep 2026 |
| | Unsourced statistics in the Spanish and French posts | Sourced or dropped, 30 Sep 2026 |
| | Belgium, Switzerland and Luxembourg in the French reader | Owner, 30 Sep 2026 |
| | Recycled illustrations, world and Europe maps, on mobile, Business Profile drawing | Owner, 30 Sep 2026 |
