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
| `optimise-a-google-business-profile` | 33 | 33 impressions in 450 days, 0 clicks. The local-seo service (already consolidated into technical-seo) covers this. |

**Needs your call, not decided here:** `how-to-make-money-on-youtube` (18 impressions/450d, 0 clicks, position 56-99). Its excerpt is about a creator monetising their own channel (Partner Program, channel memberships), which is a different audience from "digital marketing for businesses" even under the corrected scope -- but it's adjacent enough to the digital-marketing/AI remit that I didn't want to reverse it unilaterally the way I did the other four. Still marked REMOVE in `content-map.json` pending your answer.

**301 target for the confirmed REMOVE list: `/blog/` or `/services/`, whichever the redirect implementation lands on** -- these have no natural single successor, so a hub is the honest destination rather than inventing a false match. Not yet wired into an .htaccess rule; that's a follow-up once you confirm the list.

## MERGE -- retires into a stronger post that already owns the topic

| Post | Impressions/450d | Merges into | Reason |
|---|---:|---|---|
| `boosting-local-seo` | 4 | `/optimise-a-google-business-profile/` | 4 impressions in 450 days. Same cluster as optimise-a-google-business-profile -- one post, not two. |
| `long-tail-keywords` | 0 | `/multilingual-keyword-research/` | 0 impressions in 450 days (GSC: no_matching_rows). multilingual-keyword-research already owns this topic, with 2,852 impressions. |

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

## What was not checked this pass, and why that matters

26 of 91 posts have no GSC figure in this document. The two bulk pulls used (`gsc_top_pages`, best/worst by impressions, 100 rows each) cover the extremes of the distribution, not the middle, and a per-post lookup (`gsc_page_queries`) was run individually only for the posts whose titles read as clear filler or off-strategy -- seven of them, all confirmed near-zero or literally zero. Running the same check on the other 26 is mechanical (`mcp__AISA__gsc_page_queries` per slug) but was not done here to keep this pass to a reviewable size. Until that happens, treat their KEEP status as provisional, not verified.

Posts still needing a real GSC check:

- `competitor-analysis`
- `eeat-vs-aeat-typo`
- `future-of-seo`
- `generative-engine-optimization`
- `google-analytics-international-marketing-limits`
- `how-ai-is-revolutionising-seo-strategies`
- `how-ai-is-transforming-translation-and-localisation`
- `how-to-create-a-targeted-content-strategy`
- `how-to-use-ai-and-machine-translation-tools`
- `how-to-write-about-your-professional-background`
- `human-creator-economy`
- `optimising-multilingual-website-content`
- `optimising-your-website-for-voice-search`
- `prompt-engineers`
- `search-everywhere-strategy`
- `spanish-on-page-seo`
- `technical-seo-audit-checklist`
- `technical-seo-considerations-for-german-websites`
- `technical-seo-for-multilingual-websites`
- `technical-seo-for-spanish-search-engines`
- `what-is-search-intent-mapping`
