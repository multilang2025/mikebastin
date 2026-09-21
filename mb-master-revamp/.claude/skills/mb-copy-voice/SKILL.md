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

## The focus keyword goes in the h1, always

Owner rule, 21 September 2026, stated as an absolute. Whatever else a
headline is doing, the term the page is trying to win appears in the h1.

Writing for punch is exactly when this gets dropped. The homepage h1 was
rewritten to "Your English pages sell. The others only look busy.", which
opens on the reader and carries no keyword at all, and had to be fixed
the same day it shipped.

A noun phrase is fine here. Every service h1 is one, and "grammatical"
in HANDOFF.md §4 means correct English rather than a full sentence.

## The heading shape, a hard rule

Owner, 21 September 2026, given as a hard rule rather than a preference.
`site/scripts/heading-shape-lint.mjs` fails the build on it.

- **The `h1` is three to five words** and carries the term the page is
  trying to win.
- **A longer `h2` sits directly beneath it, set smaller**, echoing the h1
  rather than changing the subject.

The homepage is the worked example:

> # Multilingual SEO agency
> ## Your English pages sell. Multilingual SEO makes your other languages sell too.

The second line is the sentence the owner approved a few hours earlier
with "that's the way forward". It was the h1 then and it is the h2 now,
and nothing about it got worse for moving: a twelve-word h1 was asking one
element to be both the search target and the pitch, and it could only be
good at one.

**Both failure directions are real.** Before the rule, six commercial
pages ran long and most service pages sat at two words. Two words is not
"safely short", it is a label: "Dutch SEO" names a category and stops,
while "Dutch SEO agency" is three words, says what we are, and is the term
with the searches behind it. Reach for the third word rather than trimming
to two.

**What goes in each.** The h1 gets the term and nothing else, because at
three words there is no room. Everything a three-word heading cannot carry
(the qualifier, the market, the secondary term, the reason to care) goes in
the h2. So the h2 is where a page actually sells, and it should be written
with the care the h1 no longer has space for.

Per service, `lib/services.ts` carries `h1` and `subhead`. Both are kept
separate from `name`, which stays the label the nav, footer and cards use:
a label wants to be short and a heading wants the keyword, and making one
string serve both is how "AI consulting" became the h1 of a page targeting
"AI consulting services".

Exempt: utility routes carrying a status message rather than a
proposition, like `/contact/thanks/`. Reported but never failed: blog
posts, whose h1 answers a searched question and would lose the query if cut
to five words, and the FR and ES service pages, because a word count does
not survive translation and those locales are deferred.

## "Agency" is accurate, and it was being left on the table

Owner, 21 September 2026: "I am an agency too." An earlier pass here held
the word back on the assumption it would misdescribe a consultancy. It
does not, and the cost of that assumption was measurable: *generative
engine optimisation agency* draws 1,300 searches globally at **difficulty
1**, the softest target in the whole keyword set, and it was skipped.

The general lesson is not about one word. Before deciding a term is unfair
to use, check whether it is actually untrue, and if the answer depends on
a fact about the business rather than about language, ask rather than
assume. Getting it wrong in the cautious direction still costs the page
its query.

## Source the vocabulary from search data, with the installed skills

These are enabled on this account already and are the right first stop
before writing a heading or a title:

| Skill | Use it for |
|---|---|
| `seo-onpage` | headings, metadata, internal linking, schema on a page |
| `seo-technical` | crawlability, indexation, Core Web Vitals, structured data |
| `seo-offpage` | link building, anchor text, competitor backlink analysis |
| `seo-local-business` | Google Business Profile, citations, map pack |
| `gsc-seo-optimizer` | live Search Console: near-miss positions, low CTR, decay |
| `hreflang-audit` | hreflang across a multilingual estate |

Ahrefs, Semrush and GSC are all connected as tools. Checking before
writing changed the answer twice in one session: the claim that eighteen
of nineteen meta titles missed buyer vocabulary was wrong (eight already
had it), and `/services/lead-generation/` was leading with "multilingual
lead generation", a term with **zero** searches, while "lead generation
services" draws 11,000.

Remember the GSC gotcha in CLAUDE.md: point the AISA bridge at
mikebastin.com with `switch_site` first, or the query resolves against
another site's account and reports this one as inaccessible.

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
