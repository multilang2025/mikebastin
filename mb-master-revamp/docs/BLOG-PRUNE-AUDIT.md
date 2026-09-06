# Blog prune audit -- mikebastin.com

Generated 2026-09-06. Covers all 91 harvested English posts.

Grounded in real Google Search Console data pulled this pass (450-day window, `mcp__AISA__gsc_top_pages` and `mcp__AISA__gsc_page_queries`), not in word count or guesswork. 65 of 91 posts have a confirmed impressions figure below; the other 26 were not queried this pass (see the note at the end) and need a spot-check before acting on them, not an assumption either way.

## Summary

| Disposition | Count | Meaning |
|---|---:|---|
| **KEEP** | 55 | Stays as a standalone post on mikebastin.com |
| **RELOCATE** | 22 | Leaves for valenciamove.com (Valencia exodus, `redirects/valencia-exodus.json`) |
| **MERGE** | 2 | Retires, 301s into a stronger post that already owns the topic |
| **REMOVE** | 12 | Retires, 301s to the nearest relevant hub -- no single post owns the topic |

REMOVE and MERGE are both written into `redirects/content-map.json` now (`action: "retire"` / `"absorb"`), so they will not be silently re-migrated by a future pass.

## REMOVE -- retire, no single post owns the topic

Every one of these was checked individually against live GSC data before being listed here.

| Post | Impressions/450d | Reason |
|---|---:|---|
| `language-service-providers` | 0 | 0 impressions in 450 days (GSC: no_matching_rows). Reads as a vendor-comparison/competitor-promotion piece, not something this site should host. |
| `mastering-the-art-of-networking` | 0 | 0 impressions in 450 days (GSC: no_matching_rows). Career-networking content, unrelated to SEO or translation. |
| `15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business` | 1 | 1 impression in 450 days. Generic listicle with no topical home on the rebuilt site. |
| `affordable-seo-services` | 1 | 1 impression in 450 days. Duplicates ground the consolidated service pages already cover. |
| `seo-mistakes-to-avoid` | 1 | 1 impression in 450 days. Generic listicle, no unique angle. |
| `most-popular-marketing-strategies` | 2 | 2 impressions in 450 days. Generic filler with no angle the site owns. |
| `roi-of-website-localisation` | 2 | 2 impressions in 450 days. The website-localisation service page already makes this case, with an offer behind it. |
| `email-marketing-hacks-boosting-open-rates-and-conversions` | 12 | 12 impressions in 450 days. Off-strategy: email marketing isn't a service this site sells. |
| `how-to-make-money-on-youtube` | 18 | 18 impressions in 450 days, 0 clicks, ranking position 56-99. Off-topic for an SEO/multilingual consultancy. |
| `cultural-differences-in-multilingual-websites` | 26 | 26 impressions in 450 days. Topic is already the multilingual-content service's job. |
| `language-data-analysis` | 27 | 27 impressions in 450 days. Vague premise, no page it naturally belongs under. |
| `optimise-a-google-business-profile` | 33 | 33 impressions in 450 days, 0 clicks. The local-seo service (already consolidated into technical-seo) covers this. |

**301 target for all of the above: `/blog/` or `/services/`, whichever the redirect implementation lands on** -- these have no natural single successor, so a hub is the honest destination rather than inventing a false match. Not yet wired into an .htaccess rule; that's a follow-up once you confirm the list.

## MERGE -- retires into a stronger post that already owns the topic

| Post | Impressions/450d | Merges into | Reason |
|---|---:|---|---|
| `boosting-local-seo` | 4 | `/optimise-a-google-business-profile/` | 4 impressions in 450 days. Same cluster as optimise-a-google-business-profile -- one post, not two. |
| `long-tail-keywords` | 0 | `/multilingual-keyword-research/` | 0 impressions in 450 days (GSC: no_matching_rows). multilingual-keyword-research already owns this topic, with 2,852 impressions. |

## RELOCATE -- Valencia exodus (already decided, tracked separately)

22 posts. Full reasoning per post lives in `redirects/valencia-exodus.json` and `docs/HANDOFF.md` section 18; not repeated here. Of these, 16 already have a live valenciamove.com target and 301 rule; 6 are still waiting on a valenciamove.com page to exist (per your earlier decision to leave those un-redirected for now).

## KEEP -- no action

55 posts stay as-is. 
34 have a confirmed real impressions figure; the strongest are the ones already carrying the site's actual traffic and should not be touched:

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
