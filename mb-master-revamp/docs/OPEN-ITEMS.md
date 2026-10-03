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
| Q2 | Houston freight: the "doubled" claim. Quote Request form entries on txintlfreight.com (Formidable, read 2 Oct 2026): 405 in 2021, 662 in 2022, 847 in 2023, 1,029 in 2024, 1,023 in 2025, 1,058 to 1 Oct 2026. Raw submissions, spam not separated. Owner to give the engagement start date and say whether a figure may be published | `lib/projects.ts` `tx-international-freight` |
| Q29 | Leads on `/results/` (owner, 3 Oct 2026: "the number of leads is more important"). Shown from form records, May to July 2026, spam left out: TX 341 quote requests, Delaguía 168 enquiries, Bemelman 6. C21 Perdomo (headless front end, no form record on the WordPress side; GA4 counts 184 conversions July to September, 67 of them from Paid Video on 139 sessions, which looks inflated) is blank. ValenciaMove shows 25 enquiries in July, from its own dashboard (`consultations`, which starts 1 July 2026; 119 form enquiries July to September, spam left out). Owner to say: estimate C21, connect its lead tracking, or leave it blank | `lib/projects.ts` `leads` |
| Q5 | Dropped client figures: restore any (BeTranslated 68 %, Delaguía 42/27/34 %, Smartown 19/28 %, the 1,25 % to 11 % outreach test, two Business Profile cases)? | Spanish posts (dropped 30 Sep 2026) |

### Positioning and copy

| ID | Item |
|---|---|
| Q7 | One positioning claim per service page that a competitor could not also make |
| Q9 | GEO blog post and GEO service page target the same term |
| Q10 | Posts over 2,000 words (search intent, technical audit, future of SEO, SEO in Belgium, in FR and ES): trim? |
| Q12 | Globaprom data-privacy and MT-compliance article (backlog since 6 Sep) |

### French and Spanish

| ID | Item |
|---|---|
| Q15 | Confirm the two Globaprom pages redirect to the homepage in FR and ES |
| Q16 | Review order for the FR and ES drafts (every page is a draft) |
| Q17 | Sign off the FR and ES motto lines |
| Q27 | Declaudify P2: names and roles of the specialists to show on the homepage, and which two testimonials (with source links) |
| Q28 | Re-measure the Valencia terms (country `es`) when Ahrefs units reset; Ahrefs and Semrush were both out on 3 Oct 2026 |
| Q18 | Which further EN posts get a FR or ES adaptation (8 French and 5 Spanish more were built on 30 Sep 2026 without waiting: the Spain market posts, local, AI and measurement; the French journal is at 28 posts, the Spanish at 32) |

### Site and launch

| ID | Item |
|---|---|
| Q20 | Approve and lock EN (the gate for treating English edits as costly) |
| Q21 | X handle confirmed as x.com/mikebastin (owner, 2 Oct 2026); still needed: the three featured post URLs for the Dispatches section |
| Q22 | Credibility strip: languages answered (owner, 2 Oct 2026: 5+3, see CLAUDE.md); still to confirm "12 domains run" against the six BeTranslated domains in `lib/projects.ts` |

## Mine to do (no owner decision needed)

| ID | Item | Note |
|---|---|---|
| E1 | `audit:sources` flags two English posts that are false positives (a number in a table, the directory name 11880.com) | Tune the audit |
| E4 | Heading-shape lint reports FR and ES without failing | By design, word counts do not translate |
| E5 | FR and ES topic pages have no hreflang | By design, each locale groups its own posts |
| E6 | `design/dl-art/geo/make-variants.mjs` needs `d3-geo`, `topojson-client`, `topojson-simplify`, `world-atlas` in a scratch folder | Documented in `docs/DL-ART.md` |
| E7 | Preview is `noindex` site-wide until launch (30 Oct 2026) | `npm run check:launch` says whether the site can go |
| E9 | The consent banner gates nothing yet, since no analytics or embeds exist; wire any added script through `lib/consent.ts` | `docs/CONSENT.md` |
| E8 | `content/nl` (Belgium, Netherlands) is planned after the three locales | Do not build early |

## Closed

| ID | Item | Closed |
|---|---|---|
| Q26 | Valencian copy, and meetings in person | Owner, 3 Oct 2026: Valencian is not relevant (removed from all ES copy); meetings at Calle Rugat 12 - 2 are offered |
| Q13 | The Spanish reader | Owner, 3 Oct 2026: "the Spanish version should focus on Valencia + keyword". The reader is a Valencia company (serving Valencia, or selling from it); every commercial ES page leads with its term plus Valencia. Term map in `docs/ES-REBUILD-PLAN.md`; volumes to measure when Ahrefs units reset |
| Q14 | `seo-ingles` stays live | Owner, 2 Oct 2026: yes |
| Q19 | Valencia lifestyle posts still live on the old site | Audited 2 Oct 2026: all 15 French and the one Spanish Valencia URL 301 to valenciamove.com in the new `.htaccess` (every target returns 200); they stay live only until the new site replaces WordPress. Every one of the 99 French and 89 Spanish legacy URLs in `redirects/content-map.json` is either rebuilt at its own URL or 301s, none temporary. The two unbuilt source files (`fr/posts/transport-a-valencia.md`, `es/posts/trabajar-en-remoto-desde-valencia.md`, E2 and E3) are deleted |
| | Overlapping Spanish posts | Owner, 2 Oct 2026, "fix the overlapping pages": `analisis-de-la-competencia-seo` merged into `analisis-competitivo-seo` (507 impressions against 0) and `localizacion-de-contenido-web-multilingue` into `optimizar-contenido-web-multilingue`, both 301 via `gen-es-redirects.mjs`; `seo-multilingue-2026-presencia-total` regrouped to g014 as the Spanish best-practices sibling; the GEO posts, `competidores-seo` and the future-of-SEO pair de-duplicated |
| Q25 | Privacy pages and analytics | Owner, 2 Oct 2026: BeTranslated, NIF B40654865, Calle Doctor Ferran 13, 46021 Valencia; Hostinger for hosting and email; enquiries kept one year; GA4 (G-8TSFDZTWL3), Clarity (r517do2v6j) and Ahrefs, IDs from the legacy site, installed in `components/Analytics.tsx` behind consent and on the production domain only |
| Q24 | Illustrations: the homepage market map and the Spain map on the Spanish SEO page | Owner, 2 Oct 2026: both approved |
| Q1 | Houston freight: English only, or English and Spanish | Owner, 2 Oct 2026: **English only**. The multilingual SEO case and the SEM Spanish-campaign paragraph are gone (the SEO case is now Century 21 Perdomo, from `lib/projects.ts`); the 360 agency post no longer says two languages |
| Q3 | Bemelman Spuiterij: Hillegom or Noordwijkerhout | Owner, 2 Oct 2026: **Noordwijkerhout**, now named in EN, FR and ES |
| Q6 | Unsplash key pasted in chat | Owner, 2 Oct 2026: rotated |
| Q23 | matosurf.com as an eighth portfolio spread | Already yes (HANDOFF.md, spread VIII); live in `lib/projects.ts` |
| Q4 | Valencia law firm: three languages or four | Owner, 2 Oct 2026: **four** (ES, FR, EN, RU). The multilingual SEO and SEM lines that said three are corrected |
| Q8 | "agency" on generative engine optimization | Owner, 2 Oct 2026: "agency is fine". The h2 now opens "A generative engine optimization agency"; the h1 keeps the primary term, "services" |
| Q11 | Portuguese "working level" wording | Owner, 2 Oct 2026: enough Portuguese to manage SEO projects, built on French, Spanish and Italian, plus a native Portuguese speaker on the in-house IT team. EN, FR and ES pages updated |
| | Results page showing this site's own rebuild as the result | Owner, 2 Oct 2026: rebuilt around the client Search Console figures in `lib/projects.ts` |
| | The twelve posts rendering "Uncategorised" | Gone from the journal index (checked 30 Sep 2026) |
| | Dutch SEO "agency" in the title | The h1 already reads "Dutch SEO and GEO agency" |
| | Address "12 - 2" | Owner, 30 Sep 2026 |
| | French formal register, short footer labels, Polylang and the other platforms | Owner, 30 Sep 2026 |
| | Unsourced statistics in the Spanish and French posts | Sourced or dropped, 30 Sep 2026 |
| | Belgium, Switzerland and Luxembourg in the French reader | Owner, 30 Sep 2026 |
| | Recycled illustrations, world and Europe maps, on mobile, Business Profile drawing | Owner, 30 Sep 2026 |
| | Horizontal scroll on the German SEO post at 320 to 360px (a long compound word), and the header overflowing at 768px | Fixed 30 Sep 2026: long words wrap, the desktop menu starts at 1024px |
| | Stale prose on the service pages: the "Measured demand, Ahrefs" block (two SEO figures and an analyst note) and internal asides ("We say so plainly", "Search Console for this page", "the six") | Owner, 30 Sep 2026: removed the block from every service page and rewrote the asides on the German, French, Spanish, Dutch, Italian and Portuguese pages. The data stays in `lib/services.ts` as research |
| 30 Sep 2026 | Fluff audit | Five reviewers read every service page, the hand-built pages and the case studies; about 170 generic, restating, meta or puffed sentences cut from `lib/services.ts`, plus the repeated scope boilerplate on the service template and lead generation page. Hand-built JSX paragraphs flagged but not yet cut are the next pass. |
| | FR and ES QA pass | 3 Oct 2026: all 133 FR and ES pages checked for lang attribute, canonical, title and description length, one h1, hreflang reciprocity, broken and cross-language links, English left in attributes, and overflow at 360px. Fixed: six FR/ES service pairs now pair with their English page (switcher and hreflang), the ES footer no longer links to the English results page, the two Italian pages' tables scroll on phones, five long French descriptions, a duplicate h1 and an English link in two French posts. |
| | The 26 English posts with no FR or ES version | 3 Oct 2026, owner "Fix the 26 posts": 45 adaptations written (23 French, 22 Spanish) and three existing posts paired with their English sibling instead of duplicated (FR business trends, ES competitor analysis, ES localization testing). `best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits` stays English only (owner, 3 Oct 2026). `content-optimisation-for-spanish-users` stays English only on purpose: the French `seo-on-page-espagnol` already covers it (paired with `spanish-on-page-seo`) and the Spanish reader sells from Spain. All are drafts for the owner's review. |
| | Polish, internal links and meta audit of the 45 new posts | 3 Oct 2026: editor pass on all 45 (fluff, native phrasing, CTAs, length 1,000 to 2,200), 4 to 6 contextual links out of each, at least 2 links in from older published pages for 40 of 45 (the rest have one plus links from the other new posts), all filed under FR and ES journal topics (new topics `contenu-et-marketing` and `contenido-y-marketing`). Meta audit across 280 pages: no duplicate titles or descriptions, every title 60 characters or under, every description 160 or under, canonical and Open Graph on every page. Tool prices in the internal-linking posts stay in USD as the vendors list them (owner may prefer to drop them). |
| | Blog design audit (index and single posts) | 3 Oct 2026, owner: "the images are glued to each other". One card component (`components/PostCard.tsx`, `POST_GRID`) with real space between cards and framed, rounded pictures, used on every journal listing in EN, FR and ES (index, topic pages, related posts). FR and ES index grouped by topic like EN; FR and ES posts get the EN layout (`components/LocalePostView.tsx`): breadcrumb, topic eyebrow, outline rail in the page language, related posts from the same topic, and no cover photo when the post opens on its own picture. The phone outline starts collapsed so the article is above the fold. |
