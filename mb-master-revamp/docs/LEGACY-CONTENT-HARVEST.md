# Legacy FR and ES content harvest

Owner request, 30 Sep 2026: "Curl legacy fr and es for additional relevant
content." This file records what was scanned, what came back to the French
site, what waits for the Spanish rebuild, and which legacy claims need the
owner before anyone uses them.

## What was scanned

- **129 legacy URLs** on mikebastin.com, downloaded 30 Sep 2026: the French
  and Spanish homepages, service pages, posts and utility pages (60 French
  files, 70 Spanish).
- Every text block was compared with the repo. **2,007 blocks** appear
  nowhere in it today (1,160 French, 847 Spanish).
- Most of those were replaced on purpose: prices and packages, turnarounds,
  "25 ans" and "je" copy, unsourced statistics, the repeated cross-sell
  cards ("Améliorez le classement de votre site web en Italie..."), English
  leftovers, and the German B1 and Italian level lines.
- What remained was checked against the live French pages rebuilt on 29 and
  30 Sep 2026. Those pages already carry nearly every useful legacy fact
  (hreflang variants, Impressum, KvK and iDEAL, CIF and RFC, Partita IVA and
  Garante, WPML versus Polylang, text expansion, the audit-to-report
  process, Century 21 Perdomo, Delaguía y Luzón, Bemelman Spuiterij). The
  additions below are the gaps that were left.
- The live French posts were checked too. Their legacy-only blocks were
  first-person, sourced to nothing, or already covered, so no post was
  changed.

## Added to the French site

Each item was written fresh in French for the exporter reader, "nous"
voice, positive framing, and `words:` updated. No h1, excerpt or CTA block
was touched.

| French page | What was added | Legacy source |
|---|---|---|
| `/fr/services/seo-espagnol/` | New `###` "Des liens gagnés en espagnol, région par région": pitch in Spanish, regional press weight, provincial chambers of commerce, sector associations, trade fairs (eShow, FITUR, SIL Barcelone), brand anchors | `/fr/services/seo-espagnol/` (annuaires, presse régionale par communauté autonome); `/es/link-building-local-en-espana/` (tactics) |
| `/fr/services/seo-espagnol/` | "usted" or "tú" chosen per sector and country | `/fr/services/seo-espagnol/` |
| `/fr/services/referencement-multilingue/` | New `###` "Les livrables de la mission": audit report, keyword spreadsheet per market with page mapping, strategy document validated before execution | `/fr/services/referencement-multilingue/` |
| `/fr/services/referencement-multilingue/` | Network copy "relus par un second natif" (reviewer distinct from the writer) | `/fr/services/referencement-multilingue/` |
| `/fr/services/sem-multilingue/` | Keyword research per language variant (ES Spain and Mexico, EN UK and US, FR France, Belgium, Canada) | `/fr/services/sem-multilingue/` |
| `/fr/services/sem-multilingue/` | Three to five ad variants per ad group, tested against each other | `/fr/services/sem-multilingue/` |
| `/fr/services/sem-multilingue/` | Landing pages carry local proof: reviews from the country, local certifications, local currency | `/fr/services/sem-multilingue/` |
| `/fr/services/localisation-applications/` | String files handled in their own format (JSON, .properties) | `/fr/services/localisation-applications/` |
| `/fr/services/localisation-applications/` | Pseudo-localisation as the first test, before translation | `/es/herramientas-pruebas-de-localizacion/` |
| `/fr/services/localisation-applications/` | Each new release ships in every language, strings translated and tested before the store update | `/fr/services/localisation-applications/` |
| `/fr/services/creation-de-contenu-multilingue/` | Existing published content localised and optimized | `/fr/services/creation-de-contenu-multilingue/` |
| `/fr/services/creation-de-contenu-multilingue/` | Monthly report of positions, traffic and enquiries per market | `/fr/services/creation-de-contenu-multilingue/` |
| `/fr/services/creation-de-contenu-multilingue/` | One account per country or one multilingual account, decided with the client | `/fr/services/gestion-multilingue-reseaux-sociaux/` (absorbed) |
| `/fr/services/traduction-professionnelle/` | Financial translators work with IFRS and national accounting standards | `/fr/services/traduction-financiere/` (absorbed) |
| `/fr/services/traduction-professionnelle/` | Large projects (full legal or financial documentation) get the same review as a single document | `/fr/services/traduction-financiere/`, `/fr/services/traduction-juridique/` (absorbed) |
| `/fr/services/seo-technique/` | New `###` "Une refonte qui garde vos positions": 301 map per address and language before a redesign or CMS change, indexation followed in Search Console; audit tools Screaming Frog, Ahrefs, Search Console | `/fr/expert-en-seo-international/`, `/fr/agence-seo-internationale/` |
| `/fr/services/localisation-juridique-reglementaire/` | Subtitles and transcripts where the country's accessibility rules ask for them | `/fr/services/localisation-juridique-reglementaire/` |
| `/fr/services/localisation-de-site-web/` | A glossary per language, so later pages and product sheets keep one vocabulary | `/fr/services/localisation-de-site-web/`; `/es/services/traduccion-de-paginas-web/` |

Word counts after the pass: seo-espagnol 1,245, referencement-multilingue
1,272, sem-multilingue 1,105, localisation-applications 765,
creation-de-contenu-multilingue 754, traduction-professionnelle 694,
seo-technique 775, localisation-juridique-reglementaire 822,
localisation-de-site-web 1,027.

**Considered and left out on the French side**, so the next pass need not
redo it: app privacy texts under GDPR and CCPA (`/fr/services/localisation-applications/`,
a fourth item on that page); the Dutch Bing share and "Flemish buyers call,
Dutch buyers compare" (unsourced); the Ticino speaker count and Italian
agency rate multiples (figures, prices); US Hispanic market size; the
Performance Max "50 conversions a month" threshold and the 60/40 SEM and SEO
budget split (figures without a source); Search Console geotargeting for
gTLDs (Google retired the setting).

## Spanish candidates, by future Spanish page

For the Spanish rebuild (reader: a Spanish company selling abroad, "tú").
Quotes are short; the legacy URL is the source.

### SEO multilingüe (`/es/services/posicionamiento-multilingue/`)

- Governance per language from day one: "Un redactor publica en francés,
  otro añade español seis meses después sin coordinar slugs, enlaces
  internos, schema ni keywords objetivo." Reframe forwards. `/es/services/posicionamiento-multilingue/`
- Schema per language: "LocalBusiness, Service, Product, Article, FAQ,
  BreadcrumbList por idioma. JSON-LD personalizado cuando los plugins se
  quedan cortos." `/es/services/posicionamiento-multilingue/`
- x-default: "Incluye siempre una etiqueta x-default para los usuarios que
  quedan fuera de tus idiomas o regiones definidos." `/es/seo-multilingue-2026-presencia-total/`
- One model per site: "No mezcles modelos, como usar ccTLD para unos
  idiomas y subdirectorios para otros." Reframe as "one structure for
  every language". `/es/seo-tecnico-para-sitios-multilingues/`
- Competitor analysis once per language: "cuenta con hacer el análisis una
  vez por idioma, no una vez por empresa." `/es/analisis-de-la-competencia-seo/`
- Study the rivals' five to ten URLs that bring traffic. `/es/analisis-de-la-competencia-seo/`

### SEO técnico (future Spanish sibling of `seo-technique`)

- Metadata written natively with local keywords and a localised call to
  action. `/es/seo-multilingue-2026-presencia-total/`
- Hreflang checks: wrong URLs, malformed language codes, missing x-default.
  `/es/seo-tecnico-para-sitios-multilingues/`
- Server location alone is a weak geo signal; combine with hreflang and
  country domains. `/es/seo-tecnico-para-sitios-multilingues/`
- JSON-LD must match visible content ("si dices en el código que un
  producto cuesta 100€, pero en la web pone 90€..."); Organization with
  `sameAs` to LinkedIn and the Google Business Profile.
  `/es/datos-estructurados-schema-optimizacion-geo/`
- Keyword tracking cadence: weekly for e-commerce and tech, monthly with
  alerts for professional services. `/es/rastrear-posiciones-de-keywords-de-competidores/`

### SEM multilingüe (`/es/services/publicidad-multilingue/`)

- Existing accounts first: "I prefer working in your existing accounts
  when they have history (Quality Score, audience signals, conversion
  data)"; a fresh account when the old one carries broken tracking.
  `/es/services/publicidad-multilingue/`
- Process: audit, native research, build, launch, optimise; spending starts
  once the scope is validated. `/es/services/publicidad-multilingue/`

### SEO local (`/es/services/seo-local/`)

- Google Business Profile: precise primary category ("Estudio de pilates",
  "Gimnasio"), only real secondary categories, real photos in the main
  gallery, AI-assisted drafts edited before posting, the Products tab.
  `/es/optimizar-perfil-de-empresa-de-google/`
- NAP written identically on the site and booking platforms (MindBody,
  ClassPass). `/es/optimizar-perfil-de-empresa-de-google/`
- AI engines answer "best X in [city]" with local citations. `/es/services/seo-local/`

### SEO en francés, alemán, neerlandés, inglés (language pages)

- For Spanish companies entering France: domain choice (ccTLD, subfolder,
  subdomain) and a visible language selector in place of IP redirects.
  `/es/services/seo-frances/`
- Spanish link building (useful for a Spanish-market page or post):
  regional media weight, Cámaras de Comercio directories, AECOC and ANETI,
  trade fairs (DES Madrid, eShow, FITUR, SIL Barcelona), anchors rewritten
  to the brand name by Spanish editors. `/es/link-building-local-en-espana/`

### Traducción de páginas web (website localisation)

- Translation management as the site changes: "Gestionamos las
  traducciones de tu sitio web en tiempo real, asegurando consistencia...
  a medida que se agrega o modifica nuevo contenido." `/es/services/traduccion-de-paginas-web/`
- Plugins covered: WPML, Polylang, TranslatePress, GTranslate, Weglot,
  MultilingualPress. `/es/services/plugins-de-traduccion/`
- Localisation testing on WordPress, Joomla and Drupal, with ongoing
  monitoring after launch. `/es/services/pruebas-de-localizacion/`

### Localización de aplicaciones y software

- Testing tools: memoQ, Trados Studio, Transifex, Crowdin, PractiTest,
  Selenium, Applitools, pseudo-localisation. `/es/herramientas-pruebas-de-localizacion/`
- "Casi ningún proyecto falla por la traducción en sí. Falla por un texto
  que se sale del botón, una fecha en el formato equivocado o un acento que
  rompe el orden alfabético." Reframe forwards. `/es/herramientas-pruebas-de-localizacion/`

### Consultoría de IA (`/es/services/consultoria-de-inteligencia-artificial/`)

- LLM visibility as a service: "Analizamos cómo modelos de lenguaje
  interpretan su web, su marca y sus contenidos. Definimos qué contenidos
  permiten a su empresa convertirse en fuente de referencia... Acompañamos
  a su equipo técnico, SEO o marketing." `/es/services/consultoria-de-inteligencia-artificial/`
- Audit what LLMs say about the brand before tracking prompts.
  `/es/optimizacion-para-sistemas-de-ia/`

### Redacción SEO multilingüe and cultural adaptation

- Wordplay rebuilt per language, campaigns kept clear of major religious
  dates, imagery and gestures checked per market. `/es/diferencias-culturales-sitios-web-multilingues/`
- Social media: one account per country or one multilingual account, and
  the trade-off. `/es/services/gestion-multilingue-de-redes-sociales/`

### Generación de leads (hub already built)

- AI lead scoring integrated with the CRM and organic traffic sources.
  `/es/sistemas-cualificacion-leads-ia/` (client names in it need the owner,
  below).

## Legacy claims that need the owner before use

- **Where Mike has lived.** One page lists Belgium, the US, the Dominican
  Republic and Spain; another the Dominican Republic, Costa Rica, Mexico and
  the US; `seo-espagnol` legacy says sixteen years in the Dominican
  Republic. (`/fr/services/localisation-de-site-web/`,
  `/fr/services/referencement-multilingue/`, `/fr/services/seo-espagnol/`)
- **"16 ans aux Caraïbes" with Dutch-speaking clients** (Curaçao, Aruba).
  `/fr/services/seo-neerlandais/`
- **BeTranslated network: "30+ paires de langues"** and "validation
  systématique par un relecteur natif différent du traducteur".
  `/fr/services/referencement-multilingue/`
- **Named team members Cari (Santo Domingo) and Suzy** on the legacy team
  pages. Neither is on the English site, so neither was used.
  `/fr/notre-equipe/`, `/es/conocenos-agencia-experta-en-seo/`
- **"Fondateur de BeTranslated"** in legacy copy; the owner fact is
  co-founder. `/fr/services/referencement-multilingue/`
- **Case facts outside `lib/projects.ts`:** Bemelman Spuiterij ISO 9001 and
  a Google Ads account; ValenciaMove Google Ads in three languages; C21
  Perdomo cited by ChatGPT; BeTranslated .nl cited for "beste
  vertaalbureau"; the Valencia law firm's franchise specialism and ICAV
  links. (`/fr/services/sem-multilingue/`, `/fr/services/seo-espagnol/`,
  `/fr/services/seo-neerlandais/`)
- **Still-open conflicts, repeated in legacy copy:** Houston EN plus ES and
  quote requests doubling over eighteen months; Bemelman in Hillegom; the
  law firm in three languages. None was used.
  (`/fr/services/referencement-multilingue/`, `/fr/services/sem-multilingue/`,
  `/fr/services/seo-neerlandais/`)
- **Smartown / SmartOwn** named as a client in several Spanish posts; it is
  not in `lib/projects.ts`. `/es/sistemas-cualificacion-leads-ia/`,
  `/es/optimizar-para-seo-y-geo/`
- **"Un nombre limité de missions long terme par an."**
  `/fr/services/referencement-multilingue/`
- **The audit report "vous repartez avec ce document même si on ne
  travaille pas ensemble ensuite"** (and the same for the SEM audit). The
  deliverable was added; the promise was left for the owner.
  `/fr/services/referencement-multilingue/`, `/fr/services/sem-multilingue/`
- **Five unnamed testimonials** on the legacy services pages; the site uses
  the four verifiable Google reviews. `/fr/nos-services/`, `/es/servicios-consultoria-web/`
- **Found live in the repo, not only in legacy:** the Spanish post
  `content/es/posts/link-building-local-en-espana.md` still says "un
  despacho de abogados de Madrid" (CLAUDE.md: there is no Madrid law firm),
  and "Llevo más de una década" in first person.
