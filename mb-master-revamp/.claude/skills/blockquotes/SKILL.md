---
name: blockquotes
description: Find tried and tested statistics for a mikebastin.com blog article and add them as inline sourced blockquotes, in EN and in its FR and ES versions. Use when asked to "add stats", "add blockquotes", "back this article with figures", or via /blockquotes <slug | group id | all>. Covers what counts as a citable source, how to verify a figure before it goes in, the exact house format per locale, placement, and the log every added figure is recorded in.
---

# /blockquotes: sourced statistics in blog articles

Owner, 8 Oct 2026: "Find tried and tested stats and add them as inline
blockquotes in articles, create a slash command /blockquotes and save this
as a skill as well."

The house rule already exists (`docs/STYLE-GUIDE-UK-EU.md` §3): **a statistic
carries its source inline, in a blockquote, directly beneath the figure**, so a
reviewer can check the claim against its citation side by side.
`scripts/copy-sources-audit.mjs` (`npm run audit:sources`) counts the figures
that still lack one. This skill adds new, verified figures; it never decorates
an existing unsourced number with a plausible-looking citation. A figure whose
source cannot be found gets cut, not decorated.

## Usage

```
/blockquotes german-seo-content-localisation   one article (EN slug, or a FR/ES slug)
/blockquotes g124                              one translation group (EN + FR + ES)
/blockquotes all                               every published article, in batches
```

Resolve a slug to its group with the `group:` frontmatter field; the FR and ES
versions share it (`site/content/{en,fr,es}/posts/*.md`). Only published posts
matter: a post is published when it is built (`site/out/blog/<slug>/`,
`site/out/fr/<slug>/`, `site/out/es/<slug>/`) or listed in the sitemaps.

## What counts as "tried and tested"

A figure goes in only if all of these hold:

1. **A named, reputable publisher** that produced or directly reports the data:
   national statistics offices (Destatis, INE, INSEE, Statbel, Eurostat, ONS),
   the European Commission, OECD, World Bank, regulators, CSA Research, Common
   Sense Advisory, StatCounter, Similarweb, Ahrefs, Semrush, SparkToro/Datos,
   Google's own published research, Think with Google, Statista only when it
   names the underlying source, peer-reviewed or industry studies with a
   method section. Not: content-farm "stats roundups", AI-generated listicles,
   undated blog posts, a vendor quoting itself without data, Wikipedia as the
   only source when it cites a primary you can reach instead (cite the primary).
2. **You opened the source page yourself** (WebFetch) and the exact number is
   on it, with the same cohort and period. Quote the number as the source
   gives it. Check the **period and the cohort**, not just the number: a real
   figure from the wrong year, or about "respondents" rather than "B2B
   buyers", is the same drift as an invented stat.
3. **Recent enough to be true now**: prefer the last three years; older only
   for a standing reference study (say so in the quote: "in a 2020 survey").
4. **On the article's point**: the figure supports a sentence the paragraph
   above already makes. It adds evidence, never a new claim, and it never
   contradicts the text.
5. **Never a client's figure** (`CLAUDE.md`, lint:figures): no clicks,
   enquiries, positions or rankings of any client or of our own sites.

If any check fails, leave it out. Two solid figures beat four soft ones.

## Format (exact)

EN, after the paragraph it supports, separated by blank lines:

```markdown
> 76% of online shoppers prefer to buy products with information in their native language.
>
> Source: [CSA Research, "Can't Read, Won't Buy", survey of 8,709 consumers in 29 countries, July 2020](https://csa-research.com/...)
```

FR (vouvoiement not needed in a quote; French typography: narrow no-break
space U+202F before `:` `;` `%` `?` `!` and inside « »; decimal comma; thin
space as thousands separator):

```markdown
> 76 % des acheteurs en ligne préfèrent acheter un produit présenté dans leur langue.
>
> Source : [CSA Research, « Can’t Read, Won’t Buy », enquête auprès de 8 709 consommateurs dans 29 pays, juillet 2020](https://...)
```

ES (decimal comma, "Fuente:"):

```markdown
> El 76 % de los compradores en línea prefiere comprar productos con información en su idioma.
>
> Fuente: [CSA Research, «Can’t Read, Won’t Buy», encuesta a 8.709 consumidores de 29 países, julio de 2020](https://...)
```

- The quote is one or two sentences, the figure first, in the article's
  language, faithful to the source (translate the meaning; keep the number,
  unit and period exact).
- The source line names publisher, report or page title (in its original
  language, in quotes), the cohort if it matters, and the date; the link is
  the page where the number appears.
- UK English, no em or en dashes, no first-person singular.

## Placement

- **Two or three blockquotes per article**, each after a paragraph in a middle
  H2 section, never directly under a heading, never inside a list or table,
  never next to another blockquote or a `<figure>` (leave a paragraph between).
- Skip an article that already carries three or more sourced blockquotes.
- Never add, remove or reword headings: inline photos are placed by H2 index
  (`site/lib/post-figures.ts`).
- **Same figures in FR and ES**, in the matching sections, translated. A
  translation may have a different structure: find the section that makes the
  same point. If a locale's article does not make that point, leave it out
  there rather than forcing it.

## Log

Append every added figure to `docs/STATS-LOG.md` (create it with a header if
missing): date checked, group, slugs, the figure as quoted, publisher, URL.
This is what lets the owner or Víctoria re-check a number later, and what
stops the same figure being sourced two different ways on two pages.

## Checks

From `site/`: `node scripts/copy-lint.mjs`, `node scripts/copy-lint-code.mjs`,
`node scripts/post-structure-lint.mjs --errors`, then `npm run verify` (it runs
the French and Spanish lints, `lint:figures` and the source audit). When
several agents share the working tree, only the coordinator runs `verify`.

## Running /blockquotes all

Batch by translation group (about 70 groups: EN posts plus FR/ES-only ones),
three or four groups per agent, agents on disjoint files, then one `verify`,
one commit per batch, a draft PR. Report per group: figures added, sources,
and any figure considered and rejected (with why), so the owner sees the bar.
