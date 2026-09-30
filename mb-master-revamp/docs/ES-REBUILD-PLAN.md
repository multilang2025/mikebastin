# /es/ rebuild plan

Owner request, 30 Sep 2026: "Start Spanish." This releases the Spanish
rebuild ahead of the EN lock, as "continue building FR" released French on
29 Sep. It follows `docs/FR-REBUILD-PLAN.md` step for step, so read that
file for the reasoning; this one records what differs.

## Decisions carried over, and the assumptions to confirm

The FR decisions were the owner's. For Spanish they are **assumed to
mirror French** until the owner says otherwise. Each is easy to reverse.

1. **The Spanish reader is a Spanish-speaking company selling abroad**
   (Spain, and Latin America where the business does), into France,
   Benelux, Germany or the UK. It is the reverse of the EN "Spanish SEO"
   page, which sells to foreign companies entering Spain. **The main
   Spanish page is `/es/services/optimizacion-seo/`**, our SEO service for
   that reader, naming no language (the twin of `/fr/services/seo/`).
   *Assumed.*
2. **Register: tú** (owner, 29 Sep 2026). "We" is *nosotros* in every
   locale; formal-neutral Spanish for a buyer, no slang, no voseo.
3. **Absorbed services with no Spanish sibling get a Spanish page built**,
   as in French (option B). *Assumed.*
4. **`seo-ingles` stays alive** (group `g078`, `locale_actions` es
   migrate), the twin of French `seo-anglais`: for a Spanish company it is
   a market page, a Spanish exporter selling into the UK or Ireland.
   *Assumed.*
5. **The owner reviews all Spanish copy** before it ships.
6. **The two Globaprom relocations** (`diseno-web`,
   `marketing-digital-valencia`) 301 to the Spanish homepage `/es/`.
   *Assumed.*
7. **Positive framing, formal register of its own kind, the owner facts**
   (`CLAUDE.md`) apply unchanged: over two decades, German and Italian
   level vague, no Madrid law firm, both halves of the billing line.

## Starting position (measured 30 Sep 2026)

`redirects/content-map.json` holds 70 legacy Spanish URLs:

| State | Count | What |
|---|---|---|
| Built | 29 | 19 posts, 10 services |
| 301 to valenciamove.com/es/ | 1 | A Valencia lifestyle post |
| **Neither built nor redirected** | **40** | 6 pages, the pricing page, 31 absorbed services, 2 Globaprom services |

The Spanish legacy homepage is `/es/`, so the "Spanish homepage" is a
page at a URL that 404s today.

## Target Spanish site

Legacy URLs are kept wherever a page is built at the same address.

### Pages (`lib/es-pages-data.ts`)

| Page | URL | Legacy source | Notes |
|---|---|---|---|
| Homepage | `/es/` | `es` | New route |
| Services index | `/es/services/` | `servicios-consultoria-web` 301s here | New route |
| About | `/es/conocenos-agencia-experta-en-seo/` | same URL | Spanish only (`en: null`) |
| Contact | `/es/contactanos/` | same URL | Plus thanks (`gracias/`) and problem (`problema/`); the form posts `lang=es` |
| How we work, billing | `/es/precios/` | same URL, `reposition` | EN sibling `how-i-work`; the media-spend line covers media spend only |
| Blog index | `/es/blog/` | same URL | Lists the 19 Spanish posts |
| Lead generation hub | `/es/services/generacion-de-leads/` | new | Built 29 Sep 2026 |
| `404-2` | 301 to `/es/` | | Legacy junk page |

### Services

**Already built (10, plus `seo-ingles`), to adapt to the Spanish reader:**
`optimizacion-seo` (the main page), `posicionamiento-multilingue`,
`seo-local`, `publicidad-multilingue`, `traduccion-de-paginas-web`,
`seo-frances`, `seo-aleman`, `seo-neerlandes`, `seo-ingles`,
`seo-italiano`, `seo-portugues`. The language pages are reframed from
"entering Spain" to "a Spanish company entering France, Germany, the
Netherlands, the UK". Italian and Portuguese get light edits only (low
priority, `CLAUDE.md` "Key markets").

**To build (6), each at its strongest legacy URL where one fits:**

| EN parent | Spanish page | Absorbed legacy URLs that 301 to it |
|---|---|---|
| translation-services | `/es/services/traduccion-profesional/` | traduccion-academica, -certificada-y-jurada, -comercial, -financiera, -juridica, -medica, transcreacion |
| app-and-software-localisation | `/es/services/localizacion-de-aplicaciones/` | internacionalizacion-de-software, traduccion-audiovisual |
| multilingual-content | `/es/services/redaccion-seo-multilingue/` | consultoria-cultural, gestion-multilingue-de-redes-sociales |
| ai-consulting | `/es/services/consultoria-de-inteligencia-artificial/` | none, same URL |
| ai-translation-and-post-editing | `/es/services/posedicion-de-ia/` | none, same URL |
| technical-seo | `/es/services/seo-tecnico/` (new URL, group `g177`) | busqueda-palabras-clave, link-building, monitorizacion-y-analitica, seo-onpage |

The five existing groups carry `"locale_actions": {"es": "migrate"}`, so
Spanish keeps their pages while EN absorbs them; `g177` gains its Spanish
sibling. Sworn translation facts are the EN ones: one to seven days, and
apostille for US and Canadian citizens.

**Absorbed into a Spanish page that already exists (no build):**

| Spanish parent | Absorbed legacy URLs that 301 to it |
|---|---|
| `/es/services/posicionamiento-multilingue/` | agencia-de-seo-global, branding-multilingue, internacionalizacion, soluciones-linguisticas |
| `/es/services/traduccion-de-paginas-web/` | diseno-ux-ui-multilingue, integracion-cms-multilingue, localizacion-de-contenido, localizacion-de-e-commerce, plugins-de-traduccion, pruebas-de-localizacion |

### Posts

The 19 live Spanish posts stay at their URLs. They get the same voice and
cleanup pass as the French ones: *nosotros*, *tú*, English leftovers
translated, legacy links pointed at final pages, `metaTitle` where the
title runs over 60 characters.

## Phases

1. **Redirects** (`scripts/gen-es-redirects.mjs`, block `es-safety-net`):
   35 rules on 30 Sep 2026, 25 permanent and 10 temporary until the
   Spanish homepage, indexes and about, contact and pricing pages ship.
   `lint:redirects` now checks all 70 Spanish legacy URLs.
2. **Templates and plumbing**: `lib/es-pages-data.ts`, generalised
   `lib/fr-pages.ts` (hreflang across en, fr, es), the menu and language
   switcher for hand-built pages, footer, sitemap, `contact.php`
   (`lang=es`), share cards, `pageMeta`.
3. **Pages**: the eight pages above.
4. **Copy**: the 17 service pages and the 19 posts, from their English
   entries and the legacy facts, with `es` search data for the h1s.
5. **QA**: `npm run lint:es` (Spanish copy check), links, images,
   hreflang, `verify`.

## Status (30 Sep 2026)

| Phase | State |
|---|---|
| 1. Redirects, no legacy URL 404s | Done: 29 rules, all 301, every legacy URL resolves |
| 2. Templates and plumbing | Done: page list, hreflang across en, fr and es, menu and language switcher on hand-built pages, footer, sitemap, `contact.php`, share cards, `pageMeta`, `lint:es` |
| 3. Pages | Done: homepage, services and blog indexes, contact (thanks, problem), about, pricing |
| 4. Copy | Done as a draft: 17 service pages and the 19 live posts; the owner reviews |
| 5. QA | Links, images, hreflang, redirects and all lints pass |

The Spanish AI consulting page carries the legacy "visibility in ChatGPT,
Claude and Gemini answers" angle again (owner, 30 Sep 2026: "Recover
legacy angle"): a section on how AI systems read and cite a company's
content, written from the legacy page and the English GEO service. The
French legacy page never had it.

`g069` (EN `spanish-seo`, FR `seo-espagnol`, ES `optimizacion-seo`) is
`hreflang_standalone: ["es"]`: the Spanish main page sells to a Spanish
exporter, the other two to a foreign company entering Spain.

Unsourced figures in the posts were resolved on 30 Sep 2026 ("find
sourced stats"). Gartner (25 % by 2026, press release of 19 Feb 2024, the
old copy said 2028), CSA Research (76 % and 40 %, 2020) and Backlinko with
Pitchbox (32,7 % more replies to a personalised body, 12 million emails)
now cite their real pages. The legacy client figures with no record
(BeTranslated 68 %, Delaguía y Luzón 42, 27 and 34 %, Smartown 19 and 28 %,
the 1,25 % against 11 % test with its 80 proposals, the two Business Profile
percentages), the "más del 30 %" forecast, the Backlinko "73 %" and the
Search Engine Journal "40 %" were dropped or stated without numbers, since
no source could be found. The owner can restore a client figure with its
Search Console evidence.

Eight EN posts gained a Spanish adaptation on 30 Sep 2026 (multilingual
content, localization points to get right, interface localization, search
everywhere, search intent mapping, technical audit checklist, the future of
SEO, SEO in Belgium), written for the Spanish-speaking company selling
abroad. The Spanish journal now has 27 posts, grouped in four topics. Five more followed (AI in translation, AI and machine translation tools, Google Analytics alternatives, AI and SEO strategy, AI-powered marketing): 32 posts, in five topics.

## Open for the owner

- Confirm assumptions 1, 3, 4 and 6 (or reverse them).
- Review the Spanish copy in one go: every page is a draft.
- The `SiteFooter` motto and the Spanish string table are still a first
  pass.
