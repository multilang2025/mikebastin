# Blog prune audit -- mikebastin.com

Generated 2026-09-06. Covers all 91 harvested English posts.

Grounded in real Google Search Console data pulled this pass (450-day window, `mcp__AISA__gsc_top_pages` and `mcp__AISA__gsc_page_queries`), not in word count or guesswork. 65 of 91 posts have a confirmed impressions figure below; the other 26 were not queried this pass (see the note at the end) and need a spot-check before acting on them, not an assumption either way.

## Summary

| Disposition | Count | Meaning |
|---|---:|---|
| **KEEP** | 59 | Stays as a standalone post on mikebastin.com |
| **RELOCATE** | 22 | Leaves for valenciamove.com (Valencia exodus, `redirects/valencia-exodus.json`) |
| **MERGE** | 2 | Retires, 301s into a stronger post that already owns the topic |
| **REMOVE** | 8 | Retires, 301s to the nearest relevant hub -- no single post owns the topic |

REMOVE and MERGE are both written into `redirects/content-map.json` now (`action: "retire"` / `"absorb"`), so they will not be silently re-migrated by a future pass.

**Correction (owner, 6 Sep):** the first pass judged four of these against SEO alone. mikebastin.com's actual scope is SEO, digital marketing and AI, not SEO on its own, and four REMOVE calls were wrong under the real scope: `mastering-the-art-of-networking` (its own excerpt says "networking powerhouse in digital marketing"), `most-popular-marketing-strategies`, `15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business`, and `email-marketing-hacks-boosting-open-rates-and-conversions`. All four are genuine digital-marketing content, not off-topic filler, and are back to KEEP below. `content-map.json` updated to match (`action: "migrate"`, `destination: "mdx"`).

## REMOVE -- retire, no single post owns the topic

Every one of these was checked individually against live GSC data before being listed here. None were removed for being off-topic for a broader SEO/digital-marketing/AI site -- see the correction above for the four that were and got reversed.

| Post | Impressions/450d | Reason |
|---|---:|---|
| `language-service-providers` | 0 | 0 impressions in 450 days (GSC: no_matching_rows). Reads as a vendor-comparison/competitor-promotion piece, not something this site should host. |
| `affordable-seo-services` | 1 | 1 impression in 450 days. Duplicates ground the consolidated service pages already cover. |
| `seo-mistakes-to-avoid` | 1 | 1 impression in 450 days. Generic listicle, no unique angle. |
| `roi-of-website-localisation` | 2 | 2 impressions in 450 days. The website-localisation service page already makes this case, with an offer behind it. |
| `cultural-differences-in-multilingual-websites` | 26 | 26 impressions in 450 days. Topic is already the multilingual-content service's job. |
| `language-data-analysis` | 27 | 27 impressions in 450 days. Vague premise ("what language data even is"), not tied to AI or marketing despite the slug -- no page it naturally belongs under. |
| `optimise-a-google-business-profile` | 33 | 33 impressions in 450 days, 0 clicks. Covers ground the local-seo service now owns (see correction below). |
| `how-to-make-money-on-youtube` | 18 | 18 impressions in 450 days, 0 clicks, position 56-99. Owner confirmed (6 Sep): no experience in that space, "something I have to work on" -- a decision about the business, not just the traffic. |

**301 target for the confirmed REMOVE list: `/blog/` or `/services/`, whichever the redirect implementation lands on** -- these have no natural single successor, so a hub is the honest destination rather than inventing a false match. Not yet wired into an .htaccess rule; that's a follow-up once you confirm the list.

## MERGE -- retires into a stronger post that already owns the topic

| Post | Impressions/450d | Merges into | Reason |
|---|---:|---|---|
| `boosting-local-seo` | 4 | `/services/local-seo/` | 4 impressions in 450 days. Same cluster as optimise-a-google-business-profile, which is retiring to the same page in this batch -- pointed directly at local-seo rather than chaining through a post about to disappear. |
| `long-tail-keywords` | 0 | `/multilingual-keyword-research/` | 0 impressions in 450 days (GSC: no_matching_rows). multilingual-keyword-research already owns this topic, with 2,852 impressions. |

## Second correction (owner, 6 Sep): local-seo gets its own service page

`optimise-a-google-business-profile` and `boosting-local-seo` were both
pointed at `/services/technical-seo/`, because the original service
consolidation (`CONTENT-ARCHITECTURE.md` section 3) folded `local-seo`
into `technical-seo`'s "Supporting" catch-all. The owner corrected this:
local and off-site visibility work (Google Business Profile, citations,
the map pack) is a different subject from `technical-seo`'s actual remit
(crawlability, indexation, hreflang), and the two should never have shared
a page. `local-seo` now has its own live service page (`lib/services.ts`,
Search cluster), restored from the harvested `content/en/services/local-seo.md`
(and its FR/ES siblings) rather than superseded, and both posts above now
301 there instead. `docs/CONTENT-ARCHITECTURE.md` section 3 updated to
match. The same correction added GEO/AEO as a new AI-cluster pillar
(`generative-engine-optimization`), at the owner's explicit request for a
core service rather than a blog topic with no page of its own -- unrelated
to this audit's REMOVE/MERGE list, noted here only because it landed in
the same pass.

## RELOCATE -- Valencia exodus (already decided, tracked separately)

22 posts. Full reasoning per post lives in `redirects/valencia-exodus.json` and `docs/HANDOFF.md` section 18; not repeated here. Of these, 16 already have a live valenciamove.com target and 301 rule; 6 are still waiting on a valenciamove.com page to exist (per your earlier decision to leave those un-redirected for now).

## KEEP -- no action

59 posts stay as-is (55 originally, plus the 4 reinstated in the correction above). 
38 have a confirmed real impressions figure; the strongest are the ones already carrying the site's actual traffic and should not be touched:

| Post | Impressions/450d |
|---|---:|
| `competitor-analysis-traffic-checklist` | 20944 |
| `affiliate-marketing-programs` | 15633 |
| `german-seo-best-practices` | 11166 |
| `chrome-extensions-for-seo` | 9745 |
| `chrome-extensions-for-translators` | 9668 |
| `internal-linking-tools` | 8197 |
| `french-ppc-campaign` | 5465 |
| `360-marketing-agency` | 4566 |
| `conversational-ai-chatbots-business` | 3327 |
| `link-building-in-spain` | 2927 |
| `multilingual-keyword-research` | 2852 |
| `spanish-keyword-localisation` | 2474 |
| `link-selling-and-link-buying-platforms` | 2415 |
| `top-instagram-tools` | 2249 |
| `building-a-global-brand` | 2240 |

The remaining 21 KEEP posts were not queried against GSC this pass (see the note below) -- kept by default because nothing found so far argues for removing them, not because their traffic was confirmed.

## The 21 provisional KEEPs, now checked (20 Sep 2026)

**Owner decision, 20 Sep: all 21 stay KEEP.** The Tier C sign-off is closed.
No further prune work is pending.

The check that was outstanding has now been run. The earlier pass could not
complete it because mikebastin.com was not the active site on the AISA
bridge, so `gsc_list_properties` resolved against a different Google account
and reported the property as inaccessible. It is there, as `siteOwner`, once
the bridge is pointed at the right site.

Figures below are real GSC, 450 days to 17 Sep 2026, one `gsc_page_queries`
call per post.

| Post | Impressions | Clicks | What it ranks for |
|---|---:|---:|---|
| `future-of-seo` | 310 | 0 | "future of seo", on topic, positions 50 to 97 |
| `competitor-analysis` | 255 | 0 | "seo competitors", on topic, positions 40 to 90 |
| `technical-seo-considerations-for-german-websites` | 168 | 0 | "german website seo" (138 of them) |
| `what-is-search-intent-mapping` | 165 | 0 | "keyword intent mapping", on topic |
| `technical-seo-audit-checklist` | 163 | 0 | "website technical audit checklist" |
| `technical-seo-for-spanish-search-engines` | 129 | 0 | "spanish search engine optimization" |
| `search-everywhere-strategy` | 75 | 0 | "search everywhere optimization" |
| `eeat-vs-aeat-typo` | 61 | 0 | **AEAT, the Spanish tax agency.** Nothing about E-E-A-T |
| `how-to-write-about-your-professional-background` | 52 | 0 | "what is your professional background" |
| `how-to-create-a-targeted-content-strategy` | 51 | 0 | "create targeted content" |
| `human-creator-economy` | 49 | 1 | **"jean marie cordaro", a person's name.** Not the topic |
| `technical-seo-for-multilingual-websites` | 11 | 0 | two long-tail queries |
| `google-analytics-international-marketing-limits` | 8 | 0 | five queries, all single-figure |
| `prompt-engineers` | 5 | 0 | **all five are `site:mikebastin.com`.** No real demand |
| `spanish-on-page-seo` | 5 | 0 | "seo spanish language" |
| `optimising-multilingual-website-content` | 4 | 0 | one query |
| `optimising-your-website-for-voice-search` | 4 | 0 | three queries |
| `how-ai-is-revolutionising-seo-strategies` | **0** | 0 | GSC: `no_matching_rows` |
| `how-ai-is-transforming-translation-and-localisation` | **0** | 0 | GSC: `no_matching_rows` |
| `how-to-use-ai-and-machine-translation-tools` | **0** | 0 | GSC: `no_matching_rows` |

**One click between them in 450 days**, and it was for a person's name.

### Six the data argues against, kept anyway

Recorded so the decision is visible rather than implied. KEEP still stands;
the owner has the figures.

- **Three at literally zero impressions**: `how-ai-is-revolutionising-seo-strategies`,
  `how-ai-is-transforming-translation-and-localisation`,
  `how-to-use-ai-and-machine-translation-tools`. Zero is the same bar that
  retired `language-service-providers` and `long-tail-keywords` in the
  REMOVE and MERGE lists above.
- **Two ranking for the wrong thing**: `eeat-vs-aeat-typo` draws queries for
  the Spanish tax agency AEAT rather than for E-E-A-T, and
  `human-creator-economy` draws a person's name. Neither impression count
  represents interest in the post's subject.
- **One with no real demand**: `prompt-engineers`, whose five impressions are
  all `site:` searches, which is someone inspecting the site.

The case for keeping them regardless is reasonable: all six are on-topic for
an SEO, digital marketing and AI practice, the clusters and topic pages now
give them somewhere to belong, and these figures describe a Divi site that
is being replaced. A re-audit once the new site has its own Search Console
history will be worth more than acting on this one.

### Two corrections to the previous version of this document

- It said 26 posts were unchecked and then listed 21. The list was right.
- It listed `generative-engine-optimization` among them. That post was
  absorbed into `/services/generative-engine-optimization/` on 20 Sep, so
  its KEEP question was already closed. 20 posts were actually outstanding.
