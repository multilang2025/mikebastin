---
name: mb-copy-voice
description: How copy on mikebastin.com earns an enquiry, as opposed to what it may not say. Use before writing or editing any customer-facing string on the site, including h1s, ledes, section headings, CTAs, meta titles and descriptions. Covers who the buyer is, the order a page has to make its case in, where jargon is allowed and where it is banned, and what counts as proof. The copy-editor agent enforces the prohibitions; this decides whether the copy is any good.
---

# Copy that sells, on mikebastin.com

The Master Content Protocol (HANDOFF.md §4, enforced by the `copy-editor`
agent and `scripts/copy-lint*.mjs`) says what copy may not contain. Every
rule in it is a prohibition. Copy can pass all of them and still be
unsellable, and in September 2026 most of this site was: 19 service pages
carrying 12.1 jargon terms per thousand words against 7.3 benefit terms,
and four of the five biggest pages opening their hero on mechanism.

What follows is the other half. Apply it first, then let the protocol
check the result.

## Who is reading

**A company already selling abroad whose non-English markets are
underperforming** (owner decision, 20 Sep 2026). Not a beginner asking
what SEO is, and not a fellow SEO. Somebody commercially responsible, who
knows their German site is not pulling its weight and does not know why.

Two consequences:

- They do not need the category explained. "International SEO" needs no
  definition, so do not spend the lede defining it.
- They cannot evaluate mechanism. "hreflang and schema configured from
  the brief" means nothing to them, so it persuades nobody. It reads as
  competence to a peer and as noise to a buyer.

## The order a page makes its case in

1. **Their situation**, in the words they would use. Where it hurts, not
   what we do.
2. **The cost of leaving it alone.** A reason to act now rather than next
   quarter.
3. **What we do about it**, still in plain terms.
4. **Proof.** Named client, real number, or a review in their words.
5. **Mechanism**, in as much depth as the subject deserves. Deep in the
   page, where a reader who is still going wants specifics.
6. **One clear next step.**

Mechanism last is the rule people break. The temptation is to open with
the cleverest thing on the page.

## Jargon: banned at the top, welcome further down

`hreflang` is not a banned word. It is a banned **opening**.

- **Hero, lede and first section:** no mechanism vocabulary at all. See
  `scripts/copy-jargon-lint.mjs` for the enforced list (hreflang,
  canonical, indexation, crawlability, schema, WPML, SERP, CMS and the
  rest). CI fails the build on a hit.
- **Below that:** use the precise term. A buyer 800 words in has decided
  we might know what we are doing and now wants evidence, and the term is
  also what the page ranks for. Vagueness there costs both.

Service names are never jargon. "Transcreation" on the translation page
is the product, not plumbing.

## What proof looks like

Not adjectives. One of:

- a named client and what changed (Bemelman Spuiterij, in
  `lib/services.ts`)
- a real number from GSC, Ahrefs or the client's own reporting
- a review, verbatim, from `lib/testimonials.ts`

As of 20 Sep 2026, 18 of the 19 service pages carried **no proof element
at all**, while four Google reviews and a `Testimonials` component sat
unused outside the homepage, `/results/` and `/services/lead-generation/`.
A service page with no proof is asking to be taken on trust by somebody
who has never heard of us.

## Every page needs one decision worth stating

The strongest page on the site is `/services/multilingual-sem/`, at 9.2
jargon terms per thousand against 52 benefit terms. It is strong because
the owner made a decision and someone wrote it down: media budget goes
straight to Google, Microsoft or Meta, so there is no markup on spend and
no reason for our recommendation to be a bigger budget.

A competitor cannot copy that line without changing how they bill. Ask of
every page: what does it say that a competitor could not also claim? If
the answer is nothing, the page is a brochure.

Where no such decision exists yet, ask the owner rather than inventing
one. **Never invent a price, a guarantee, a turnaround time or a client
outcome.** An invented capability on a consultancy site is a lie to a
prospect, and it is the one mistake here that cannot be fixed by editing.

## Source the vocabulary from buyers, not from us

Before rewriting a page, read what it already gets impressions for. The
`gsc-seo-optimizer` skill, the Ahrefs MCP tools and Semrush are all
connected. Buyers search "website not ranking in France", never "hreflang
plumbing". Writing the lede in the language of its own queries fixes tone
and search relevance in the same pass.

## Worked example

From `/services/technical-seo/`, the worst page on the site at 26.4
jargon terms per thousand.

Before, opening on mechanism:

> Crawlability, indexation and the hreflang plumbing that decides whether
> a multilingual site is read as one entity in several languages or
> several sites competing with each other.

After, opening on their situation:

> Your French pages and your German pages can end up competing with each
> other instead of adding up. We find out whether it is happening on your
> site, and fix what is causing it.

Same fact. No mechanism vocabulary above the fold. `hreflang` moves down
the page, where it still earns its search value and now has a reader who
wants it.

## Before shipping

- `npm run lint:jargon` — the zoned rule, on the built output
- `npm run verify` — the full set, including the protocol lints
- Read the hero aloud. If the first sentence describes us rather than
  them, it is not finished.
