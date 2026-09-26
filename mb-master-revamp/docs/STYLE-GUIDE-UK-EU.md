# Editorial & Technical Style Guide — UK & International Europe

> Supplied by the owner on 21 September 2026 and adopted here.
>
> **Note on provenance.** The preamble as received described adapting a
> codebase whose default is US English, referring to a root
> `STYLE-GUIDE.md`. Neither applies to mikebastin.com: UK English is
> already a non-negotiable in `CLAUDE.md` and enforced by
> `site/scripts/copy-lint-code.mjs`, and no such root file exists here.
> So sections 1 and 2 largely restate rules this project already had, and
> the value of the guide for us is in sections 3 to 8, which cover
> ground the Master Content Protocol does not: sourcing statistics,
> preserving external links, date/currency/unit conventions, per-market
> number formatting, and European legal terminology.
>
> Agents cite this file rather than copying it. Where a rule here is
> already enforced somewhere else, the agent that owns it says so instead
> of restating it.

---

## 1. Language and Spelling

Default to **British English**, not US English, across all copy, UI strings, and error messages.

| US (current site default) | UK / International Europe |
|---|---|
| organize, optimize, localize | organise, optimise, localise |
| color, favor, behavior | colour, favour, behaviour |
| center, meter | centre, metre |
| program (software is fine either way) | programme (for a scheme/plan; "program" only for software) |
| traveled, canceled | travelled, cancelled |
| license (noun and verb) | **licence** (noun) / **license** (verb) — same split for **practice** (noun) / **practise** (verb) |
| math | maths |
| gotten | got |

Avoid US idioms and cultural references ("touch base," "circle back," "home run," Imperial-unit analogies). Keep register plain, professional, and locale-neutral so it reads naturally in Dublin, Berlin, or Warsaw, not just London.

## 2. Headings

**Sentence case**, not Chicago/US Title Case: *"How to build a brand localisation strategy"*, not *"How to Build a Brand Localization Strategy."* This is the standard UK/EU web-content convention and also matches how the codebase already treats French, German, and Italian headings — apply the same logic to the English-UK variant rather than inheriting the US-only Title Case rule.

## 3. Formatting Rules (carry over unchanged — these are not US-specific)

- **No em dashes (—) or en dashes (–) anywhere in copy.** Use a comma, colon, or full stop instead.
- **No walls of text.** Paragraphs run 2–3 sentences of varied length; split anything longer.
- **Two hard returns between paragraphs** in Markdown/plain-text source.
- Internal-link anchor text is a **2–4 term expression**, never a single word, in the grammatically correct inflected form for the locale, and varied across pages rather than reused verbatim.
- A statistic **carries its source inline, in a blockquote**, directly beneath the figure — not as a link buried somewhere else in the paragraph:

  ```markdown
  > 76% of online shoppers prefer to buy products with information in their
  > native language.
  > Source: [CSA Research, "Can't Read, Won't Buy," 2020](https://example.com/...)
  ```

  This lets a reviewer check the claim against its citation side by side. Check the **period and the cohort**, not just the number — a figure that's real but from the wrong year, or about "respondents" rather than "B2B leaders," is the same drift as an invented stat.

## 4. Numbers, Dates, Currency and Units

- **Dates**: day–month–year, spelled out in prose — *21 September 2026*, not *September 21, 2026* or the US numeric *9/21/2026*. Use ISO 8601 (`2026-09-21`) only in code, data, and frontmatter, never in reader-facing copy.
- **Currency**: lead with **£** for UK-specific content and **€** for pan-European content; never default to **$**. If a price applies across multiple currencies, show them explicitly (£X / €Y) rather than assuming one audience.
- **Units**: metric only (kilometres, kilograms, Celsius). Do not mix in miles, pounds (weight), or Fahrenheit.
- **Time**: 24-hour clock (14:00, not 2:00 PM) for anything operational (support hours, event times); 12-hour is acceptable only in very informal copy.
- **Decimal and thousands separators**: UK/Ireland use `1,000.50` (comma thousands, point decimal), same as the US. Most of Continental Europe (France, Germany, Spain, Italy, the Netherlands) uses `1.000,50` (point thousands, comma decimal). If a page or dataset targets a specific Continental market, use that market's convention rather than the UK default — do not silently reuse UK/US formatting in French, German, Spanish, Italian, or Dutch copy.

## 5. Legal, Regulatory and Compliance Terminology

- **GDPR**, not any regional US privacy-law framing, is the default reference for data protection across the UK and EU. In the UK specifically, note **UK GDPR** and the **ICO** (Information Commissioner's Office) as the enforcing body, distinct from an EU member state's own data-protection authority (e.g. CNIL in France, the BfDI in Germany).
- **VAT**, not "sales tax." **Postcode**, not "zip code." **Mobile**, not "cell phone."
- Sworn/certified-translation terminology is **not one term across Europe** — use the correct local designation rather than a generic English gloss:
  - France: *Traducteur Assermenté*
  - Spain: *Traductor/a Jurado/a*
  - Germany: *beeidigter/ermächtigter Übersetzer*
  - Netherlands: *beëdigd vertaler*
  - Italy: *traduzione giurata* / *asseverazione*
  
  Do not use "sworn translation" as a catch-all and assume it maps 1:1 onto every country's actual legal mechanism — some countries use notarisation or certification instead of a sworn-translator registry, and the difference matters to a buyer.
- **Never claim a certification, accreditation, or membership the business does not actually hold** (ISO standards, professional-body accreditation, a specific compliance agreement such as a data-processing agreement). If a disclaimer is needed ("we do not currently offer X unless arranged under a custom agreement"), write it without repeating the exact certification/agreement name as if it were being claimed — state the fact plainly instead. If real, third-party equipment or infrastructure genuinely holds a certification (e.g. ISO-rated interpreting booths), that is fine to state — the distinction is between the company and a specific certified asset it uses.
- **Never assert something about the business's own client work or track record** ("we have managed," "our clients typically," "X% of our engagements") without it being grounded in real, verifiable internal data. If no such source exists, flag the claim before publishing rather than writing something plausible-sounding.

## 6. Links

- **Never remove a live external link during a rewrite.** A link stays unless the target has genuinely disappeared (404/410 or the host no longer resolves) or is clearly spam. **A competitor link stays too** (owner, 26 September 2026: "keep the links"), after six were cut in a sourcing pass and had to be restored. A dead link is swapped for its live equivalent where one exists, not dropped. "It reads like an insertion" or "it doesn't add much editorially" are not valid reasons to cut it — some links are paid placements or long-standing partner relationships, and removing one destroys value invisibly. If a rewrite touches a paragraph containing a link, carry the link forward into the new text rather than dropping it.
- When a link's target moves, **repoint it** to the correct new destination rather than deleting it, and verify the redirect actually lands somewhere relevant.
- **Never fabricate a link destination.** Confirm a target page genuinely exists before linking to it.

## 7. Internationalisation and Code Hygiene

- **Zero hard-coded UI strings.** Every visible string — including table headers, one-off notices, and button labels — belongs in the localisation/message files, not inline in markup, even if only one locale exists today. A hard-coded string silently stays in the wrong language when a new locale ships, and nobody notices until a native speaker does.
- Keep locale-specific routing genuinely locale-aware: never let one locale's content silently fall back to a different locale's proxy, template, or default route.
- Match anchor text and internal-linking rules per locale — an English regex-based auto-linker should not run against non-English copy; localised text needs its own review pass, not an assumption that the English rules transfer.

## 8. Technical / SEO Consistency (applies regardless of market)

- Keep trailing-slash usage (or lack of it) consistent across every link to the same route on a page. An inconsistent form causes an avoidable redirect hop on every click.
- Every page's social-share image and its structured-data (`schema.org`) image should point at the **same, real, on-topic image** — never leave either defaulting to a generic brand logo when a genuine hero or section image exists.
- If a page adds a preselect, query-parameter, or deep-link mechanism (e.g. a quote form defaulting to a specific service), wire every entry point that plausibly promises it — a CTA whose label implies a specific outcome should not land somewhere generic.

## 9. Quick Review Checklist

Before publishing or approving UK/EU-facing copy:

- [ ] British spelling throughout (not a mix of US and UK forms)
- [ ] Headings in sentence case
- [ ] No em dashes; paragraphs are 2–3 sentences
- [ ] Dates in DD Month YYYY; currency is £ or € as appropriate; units are metric; times are 24-hour
- [ ] Every statistic has its source in an inline blockquote, and the period/cohort match the source
- [ ] No claimed certification, accreditation, or client-track-record statement that isn't independently grounded
- [ ] No external link removed without a genuine 404 or spam reason (competitor links stay)
- [ ] No hard-coded strings that should be localised
- [ ] Internal link anchors are 2–4 term expressions, varied across pages
- [ ] Links and CTAs actually go where their label promises

---

*Adapted for a UK / International-Europe audience from the recurring editorial and technical standards applied during review on this project. The underlying formatting, sourcing, linking, and compliance-guardrail rules are locale-agnostic; the language, date/currency/unit, and legal-terminology sections above are the parts that change per market.*
