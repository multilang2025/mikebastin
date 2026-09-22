# Keyword research method, and how to optimize the next page

> Written 22 September 2026, after assigning researched keywords to
> seventeen commercial pages and rebuilding `/services/conversion-tracking/`
> against them. Everything below is reproducible: the tool calls are given
> in full, and every number has a date on it.

The point of the file is that you can run the next page yourself, or hand
it to an agent, and get the same shape of answer without re-deriving the
method or re-arguing decisions already settled.

---

## 1. What the site enforces, before any research starts

Two lints run inside `npm run verify` and both read the **built output**
in `site/out/`, never the sources. A source-level pass misses what a
template does to a string, which is how a broken heading shipped once
already.

**`scripts/heading-shape-lint.mjs`** holds the heading rule the owner set
on 21 September:

- The h1 is one line. No `<br>`, no `<span>` splitting it.
- Between 3 and 12 words.
- An h2 follows within 120 characters of stripped text, longer than the
  h1 and set smaller, echoing it rather than repeating it.

**`scripts/keyword-coverage-lint.mjs`** holds the keyword rule:

- The page's primary term appears in the h1, every word of it, word order
  ignored.
- The h1 is **not** exactly the primary term. A heading that is only the
  keyword is a search term with a font size, and it was rejected by name.
- UK and US spellings count as one term, so `optimise` satisfies
  `optimization`. Nothing fails for house spelling.
- Secondary terms are checked against the body and **reported, never
  failed**. Where they land is a writer's call.

Run the coverage lint alone while drafting, which is faster than the whole
chain:

```
cd site && npm run build && node --experimental-strip-types scripts/keyword-coverage-lint.mjs
```

---

## 2. The method, in the order it actually works

### Step 1. Establish the starting position, once

Ahrefs Site Explorer on 21 September showed mikebastin.com ranking for
exactly one keyword worldwide: `michael bastin`, position 11, volume 10.
There is no ranking footing to protect, so no assignment below is a
compromise with a legacy position. Re-check before any future reshuffle:

```
site-explorer-organic-keywords  target=mikebastin.com  country=gb  mode=domain
```

Search Console tells a different and compatible story, tens of thousands
of impressions on the biggest pages. Impressions at low positions on
long-tail queries are largely invisible to the Ahrefs index. Both are
true, and neither is a ranking.

### Step 2. Generate candidates from the page, not from instinct

Read the page first and write down what it actually sells. Then expand
each phrase:

```
keywords-explorer-matching-terms  country=gb  keywords="<seed>"
  select="keyword,global_volume,difficulty,cpc"  limit=50
```

### Step 3. Measure every candidate, in one batch, with controls

```
keywords-explorer-overview  country=gb
  select="keyword,global_volume,difficulty,cpc"
  keywords="term one, term two, term three"
```

**Always include two or three terms of known volume in the same batch.**
A term absent from the response means zero measured volume, and the only
way to tell zero volume from a failed call is a control that comes back.
The habit caught a whole research document on 22 September, covered in
section 5.

CPC is returned in US cents. Divide by 100.

### Step 4. Assign one primary per page, and record why

Write the result into `site/lib/keywords.ts`. One page owns each primary
term. Two pages chasing one term is the cannibalisation the file exists
to prevent, which is why `/services` took `global seo services` while the
pillar below it kept `multilingual seo agency`.

The `note` field carries the judgement the numbers do not explain. A note
saying only what the numbers already say is worth deleting.

### Step 5. Write the h1, then the h2, then the body

The h1 carries the primary term inside a sentence a buyer would say out
loud. `Conversion tracking measured per market` carries
`conversion tracking` without being it.

Secondary terms go in the h2, the meta description and the body. Naming
the mechanism in the words buyers type is usually a small edit, not a
rewrite: see section 4.

### Step 5b. The h1 is not the only heading

Three h2s on every service page are templated, and they take their term
from `inline` in `lib/services.ts`, which is the label's mid-sentence
form. On most pages the label and the researched term are the same word,
so nothing needs doing. On four they had diverged, and the result was
three headings per page quietly arguing with the h1 above them: an h1
reading "International PPC agency" over an h2 reading "How the
multilingual SEM engagement runs".

`headingTerm` on the service overrides those three, defaulting to
`inline`. It is set on the four pages where the subject word differed
(SEM against PPC, AI translation against machine translation
post-editing, multilingual content against multilingual content
marketing, international SEO against multilingual SEO) and deliberately
not set where the primary differs only by a trailing "services" or
"agency". "How the local SEO services engagement runs" is worse English
than the sentence it replaces, and the h1 already carries the word.

Section headings written per page are worth the same pass, but only where
a rename stays true to what is under it. Three were retargeted on
22 September: "What the localization pass actually covers" became "What
app and software localization services cover", "What the engagement
covers, cluster by cluster" became "What international content marketing
covers, cluster by cluster", and "What actually gets corrected" became
"What machine translation post-editing actually corrects". Each now names
its subject instead of pointing at it. A heading that would need the
section rewritten to be accurate stays as it is.

### Step 6. Verify on the built page

```
cd site && npm run verify
```

---

## 3. How to judge a term

| Signal | What it means here |
|---|---|
| Volume under about 300 | Real, but it will not carry a page on its own. Record it and say so, as `/services/portuguese-seo` does at 350. |
| KD 0 to 10 | Winnable from a domain with no authority. Take it. |
| KD 30 to 50 | A goal, not an entry point. Put it in secondary and let the page grow into it. |
| KD above 60 | Only as a deliberate long game, with the near-term wins named in the note. `/services/translation-services` is the one such page. |
| High CPC, low volume | Often the most valuable term on the page. `international ppc` at 1,000 searches carries a $7.00 CPC. |
| Volume with a qualifier much lower than without | The qualifier is costing traffic. `multilingual lead generation` returns zero while `lead generation services` returns 11,000. |

The recurring finding, now three times over: **buyers do not put
"multilingual" in front of a service name.** They type "international",
or they type the service alone. The brand's own framing is not the search
demand, and the page can use both as long as the h1 uses the one people
search.

---

## 4. Worked example: `/services/conversion-tracking/`

Assignment of 21 September, extended 22 September:

- Primary: `conversion tracking`, 3,300, KD 13
- Secondary: `google ads conversion tracking` 2,200 KD 18,
  `offline conversion tracking` 2,000 KD 6, `consent mode` 3,100 KD 0

The page already covered every one of those ideas and named none of them
in the words buyers type. The CRM paragraph described offline conversion
tracking without the phrase. Google Ads went unmentioned. Consent mode
appeared once, in body text, while sitting at 3,100 searches and KD 0.

Four edits, no restructuring:

1. `consent mode` moved into an expandable heading, where the body already
   earned it.
2. The CRM paragraph split in two, and the second half names offline
   conversion tracking as the mechanism it was already describing.
3. Google Ads conversion tracking named alongside the GA4 event
   definitions it shares.
4. The meta description carries consent mode and CRM data.

The page went from three of four secondary terms absent to none. Nothing
was claimed that the page could not already support, which is the
constraint that shaped all four.

---

## 5. When research arrives from outside, test it before using it

On 22 September a research document proposed twelve keywords for the same
page. **All twelve returned zero Ahrefs volume**, established by putting
three of them in one batch alongside `local seo services` (47,000),
`b2b lead generation agency` (4,400), `conversion tracking` (3,300),
`consent mode` (3,100) and `ga4 conversion tracking` (300). The controls
came back. The three did not.

Its substantive points were already on the page. What it added beyond
them could not ship: named CRM products the site has not claimed, a
version number for consent mode, an unsourced statistic contrasting
opt-out rates between two regions, and deliverable promises covering
meeting length and scope contents. Inventing a price, a guarantee, a
turnaround or a capability is the one rule that overrides any research.

One real find came out of it, and it was not on its list: `consent mode`.

The test to apply to the next document that arrives:

1. Re-measure every keyword it proposes, with controls in the batch.
2. Check whether its substantive points are already on the page.
3. Strike anything asserting a price, guarantee, timescale, client
   outcome, certification or capability that cannot be sourced.
4. Keep what survives, and say plainly what did not.

---

## 6. Current state

Twenty-one pages carry a researched primary, every one of them passes the
h1 rule, and **every secondary term is present in its page body**. The
coverage lint reports nothing outstanding.

Getting there took one sentence per page. The seven gaps recorded on
22 September are closed:

| Page | Term | How it landed |
|---|---|---|
| `/` | `global seo` | A global SEO programme named as the pieces running together |
| `/services` | `global seo company` | Hiring one starts with the job, not with a package |
| `/services/multilingual-seo` | `international seo specialist` | Named against the decisions expensive to undo |
| `/services/local-seo` | `local seo services for small business` | The profile carries more than the website for a one-address business |
| `/services/ai-consulting` | `ai strategy consulting` | An AI strategy says where the tool is not used |
| `/services/german-seo` | `german seo expert` | One expert rarely covers both halves, which is why the work splits |
| `/services/italian-seo` | `italian seo company` | Writing from inside the market is not the same purchase as translating into it |
| `/services/ai-translation-and-post-editing` | `mtpe services` | The trade's own acronym, and what buying it by the word misses |

None of those sentences claims anything the page did not already mean,
which is the constraint that shaped every one of them.

---

## 7. The four pages that had no keyword now have one

Researched 22 September, country GB, controls in the batch. All four are
written into `site/lib/keywords.ts` and enforced.

### `/services/multilingual-sem`, primary `international ppc agency`

| Term | Volume | KD | CPC |
|---|---|---|---|
| `international ppc agency` | 1,300 | 2 | $0.60 |
| `international ppc` | 1,000 | 0 | $7.00 |
| `multilingual ppc` | 600 | 0 | n/a |
| `multilingual ppc agency` | 450 | n/a | n/a |

h1 now reads **International PPC agency running paid search per market**,
where it read "Multilingual SEM services per market". SEM is the
vocabulary of the trade and PPC is the vocabulary of the buyer, 1,300
against nothing. The route slug stays `multilingual-sem`, and the page's
own angle line already said "International PPC" before any of this.

### `/services/app-and-software-localisation`, primary `software localization`

| Term | Volume | KD | CPC |
|---|---|---|---|
| `software localization` | 1,900 | 4 | $3.00 |
| `app localization` | 1,400 | 44 | $2.50 |
| `app localization services` | 1,200 | n/a | n/a |
| `software localization services` | 900 | 0 | $9.00 |

**No h1 change was needed.** "App and software localization services"
already carried the term. Worth checking before drafting a replacement:
the coverage lint ignores word order, so an existing heading often passes
a term nobody assigned it yet. `app localization` at KD 44 is the outlier
here and stays secondary. The $9.00 CPC is the highest measured on the
site.

### `/services/multilingual-content`, primary `multilingual content marketing`

| Term | Volume | KD | CPC |
|---|---|---|---|
| `multilingual content marketing` | 900 | 2 | n/a |
| `international content marketing` | 200 | n/a | n/a |
| `multilingual content agency` | 40 | n/a | n/a |
| `content marketing services` | 26,000 | 0 | $4.50 |

h1 now reads **Multilingual content marketing written per market**, one
word from where it was. `content marketing services` is recorded in the
note and deliberately not taken, for the reason in section 8.

### `/services/ai-translation-and-post-editing`, primary `machine translation post editing`

| Term | Volume | KD | CPC |
|---|---|---|---|
| `machine translation post editing` | 500 | n/a | n/a |
| `ai translation services` | 350 | n/a | $3.50 |
| `mtpe services` | 300 | n/a | n/a |
| `post editing services` | 70 | n/a | n/a |

h1 now reads **Machine translation post-editing after the AI first pass**.
The whole cluster is under 1,000 combined, which is thin in the way the
Portuguese page is thin. Recorded anyway, because 500 searches with no
competition is still the page's best available term, and because naming it
stops the next pass re-researching ground already covered.

### `/results`, not taken

`seo case studies`, 3,000, KD 9, $2.50. Left in `UNRESEARCHED` on purpose,
because taking it is a decision about what the page is for. Section 8.

`/contact` and `/how-i-work` have no commercial head term and are not
meant to.

---

## 8. Open, for the owner

Two questions, both unchanged by the work above, because neither can be
settled by measurement.

1. **`content marketing services`, 26,000 at KD 0.** The largest easy term
   found anywhere on the site, and accurate only for a page that claims
   general content marketing. Taking it on
   `/services/multilingual-content` means the page stops being about
   multilingual content. Leaving it means the term goes unclaimed.
   Currently left, which is the reversible choice.
2. **`/results` as a keyword page.** Proof page as it stands, or a
   landing page for `seo case studies` at 3,000 and KD 9. Taking it costs
   an h1 change and changes what the page is for.

A third item, **one positioning claim per service page**, has been named
repeatedly and still cannot be written here. It is a statement about what
the business does better than the alternative, and inventing one would
break the rule that matters most.

---

## 9. Per-page checklist

- [ ] Read the page and list what it sells, before opening Ahrefs.
- [ ] Expand seeds with `keywords-explorer-matching-terms`.
- [ ] Measure with `keywords-explorer-overview`, controls in the batch.
- [ ] Check no other page already owns the primary term.
- [ ] Add the entry to `site/lib/keywords.ts`, with a note that earns its
      place.
- [ ] Write the h1: primary term inside it, 3 to 12 words, one line, no
      span, not the bare term.
- [ ] Write the h2: longer, smaller, echoing rather than repeating.
- [ ] Put the secondary terms in the body, in the words buyers type.
- [ ] `npm run verify`, then read the built HTML in `site/out/`.
