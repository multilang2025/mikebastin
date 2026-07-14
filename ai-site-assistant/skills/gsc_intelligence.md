# AISA Skill: gsc_intelligence
ID: gsc_intelligence
Name: Google Search Console Performance & Diagnostic Engine
Description: Empowers the agent to query real-time Google Search Console performance data, diagnose underperforming pages, identify "near-miss" search queries, write context-aware content updates, and execute internal linking "boosts" using actual search metrics.

## 1. Tool Specifications

The agent has access to three read-only analytical tools designed to minimize round-trip latency and prevent gateway timeouts.

### Tool A: `gsc_top_pages`
Retrieves a list of pages ordered by performance metrics. Useful for identifying high-exposure or heavily underperforming landing spots on the domain.

*   **Type:** Read-Only
*   **Parameters:**
    *   `order` (string, optional): `"worst"` | `"best"`. Default: `"worst"`.
    *   `metric` (string, optional): `"clicks"` | `"impressions"` | `"ctr"` | `"position"`. Default: `"clicks"`.
    *   `limit` (integer, optional): Maximum number of pages to return. Default: `10`.
    *   `date_range` (string, optional): Date range token. Default: `"last_90_days"`.
*   **Internal API Call:** Queries the Google Search Console API `searchAnalytics.query` with `dimensions: ["page"]`.
*   **Returns:** A collection of objects containing:
    *   `page`: The resolved absolute URL.
    *   `clicks`: Integer value.
    *   `impressions`: Integer value.
    *   `ctr`: Decimal CTR percentage (e.g., `0.023` for 2.3%).
    *   `position`: Average numeric ranking position (e.g., `14.2`).

### Tool B: `gsc_page_queries`
Retrieves all queries for which a specific target page is currently ranking.

*   **Type:** Read-Only
*   **Parameters:**
    *   `page` (string, required): Absolute URL, root-relative path, or local WordPress Post ID.
    *   `date_range` (string, optional): Date range token. Default: `"last_90_days"`.
*   **Internal API Call:** Queries `searchAnalytics.query` with `dimensions: ["query"]`, filtered strictly by `page == [resolved_url]`.
*   **Returns:** A collection of all queries the target page ranks for, mapped to:
    *   `query`: The search phrase.
    *   `clicks`: Clicks driven by this query.
    *   `impressions`: Total search impressions.
    *   `ctr`: Click-Through-Rate.
    *   `position`: Average search position for this specific query.

### Tool C: `gsc_page_report`
The primary "one-shot" diagnostic pipeline. Consolidates multi-step querying into a single database and API sweep to bypass network delays.

*   **Type:** Read-Only / Aggregator
*   **Parameters:**
    *   `page` (string, required): Absolute URL, path, or Post ID.
    *   `date_range` (string, optional): Date range token. Default: `"last_90_days"`.
*   **Internal Execution Loop:**
    1.  Resolves target identifier to an active Post ID.
    2.  Invokes `get_post` internally to retrieve the active content body, metadata, and current title/SEO settings.
    3.  Invokes `gsc_page_queries` to grab performance metrics for individual ranking search terms.
    4.  Runs a single-page rollup query via `gsc_top_pages` to extract overall aggregate performance metrics.
*   **Returns:** A unified payload containing:
    *   `page_meta`: Title, slug, and current content body.
    *   `aggregate_performance`: Clicks, impressions, CTR, and average position for the page as a whole.
    *   `queries`: Arrays of matching search queries with their individual metrics.

---

## 2. Playbook: Diagnostic & Optimization Rules (`gsc_intelligence`)

When interpreting raw GSC performance numbers, you must apply the following structural diagnostics. Do not make vague recommendations. Identify the exact category of underperformance and propose the mapped structural fix.

| Diagnostic Signal | Metric Signature | Root Cause Analysis | Remediation Protocol |
| :--- | :--- | :--- | :--- |
| **CTR Deficiency** | High Impressions + Low CTR | The page is visible in SERPs, but the search snippet (title/description) is not compelling or mismatched to user intent. | **Do not alter body content.** Propose optimizing metadata (Title Tag, Meta Description) via `set_seo` to include high-volume queries. |
| **Near-Miss Opportunity** | High Impressions + Average Position between `8` and `20` | Google considers the page highly relevant, but the content is too thin or missing critical subtopics covered by top competitors. | **Optimize Body Content.** Find those exact query terms. Draft and insert a new targeted section targeting those phrases. |
| **Discovery Deficit** | Low Impressions Overall | The page is targeting terms with no search demand, has technical indexing blocks, or lacks baseline authority. | **Do not rewrite content yet.** Audit technical indexing states or suggest a structural keyword pivot. |
| **Performance Decay** | Declining Clicks Over Time (Comparing two date ranges) | Rank decay due to outdated facts or rising competition, or normal seasonality. | Compare historical metrics. If impressions dropped alongside clicks, update outdated statistics or restructure headings. |
| **Keyword Cannibalization** | Same query appearing as a top query on 2 or more site pages | Multiple pages are competing in the index for the same keyword, confusing search engines. | Identify the stronger target. Merge thin content into the primary post, or rewrite secondary pages to target distinct subtopics. |

---

## 3. Operational Workflows & Playbook Execution

### Workflow 1: "Find my worst-performing pages and fix them"
When a user requests a performance sweep, execute this exact execution loop:

              [User Request]
                    │
 ┌───────────┴───────────┐
        ▼                       ▼
gsc_top_pages(order=worst)    Compare historical ranges
│                       │
└───────────┬───────────┘
▼
Select candidates showing high
impressions but low click counts
│
▼
gsc_page_report(page)
│
▼
Run Playbook Diagnostic Matrix
│
┌────────────┴────────────┐
▼                         ▼
[CTR Deficiency]           [Near-Miss Query]
Update Title/Meta          Generate New Section
via set_seo            via append_to_post


1.  **Identify:** Call `gsc_top_pages(order="worst", metric="clicks")`. Look for pages with high impressions but disproportionately low click counts (low CTR).
2.  **Inspect:** Execute `gsc_page_report(page)` on the selected page. This fetches the post content alongside all search queries driving impressions.
3.  **Diagnose:** Apply the diagnostic rules (e.g., identifying queries with position `8–20` as high-opportunity, "near-miss" targets).
4.  **Propose:** Formulate the concrete changes:
    *   *Metadata Fix:* Draft exact titles and descriptions, noting: *"You rank in position X for query 'Y' with Z impressions, but have a low CTR of A%."*
    *   *Content Fix:* Write the exact text of the new section targeting the missing queries.
5.  **Execute:** Once the user clicks "Approve" on the write-gate, invoke the corresponding write tools (`set_seo`, `update_post`, `append_to_post`).

---

### Workflow 2: "Boost Page" (Internal Link Placement Finder)
When a user prompts to "boost" a specific page (e.g., *"Find the most natural place in the blog to add an internal link to boost page X"*):

1.  **Extract Anchor Keywords:** Invoke `gsc_page_queries` on the target page to find its top performing query (the search term with the highest impressions and potential). Use this term as your preferred target anchor text.
2.  **Locate Authoritative Sources:** Call `gsc_top_pages(order="best", metric="clicks")` to find high-traffic, highly authoritative articles already living on the user's site.
3.  **Download Source Content:** Call `get_post` on the highest-ranking source pages identified.
4.  **Analyze and Map:** Scrape the text content of the source article to locate:
    *   Direct exact-matches of your anchor keywords.
    *   Semantically related sentences where the anchor keyword can be inserted naturally without breaking the editorial flow.
5.  **Propose with Previews:** Present the exact sentence modification to the user:
    *   *Original:* "If you are moving to Spain, you must prepare all your immigration paperwork in advance."
    *   *Proposed:* "If you are [moving to Spain](https://valenciamove.com/relocate), you must prepare all your immigration paperwork in advance."
6.  **Execute:** Upon write-gate approval, use `replace_in_post` to modify the source article with the new hyperlink.

---

### Workflow 3: "Expand Page with New Sections"
When prompted to write new sections to expand a page's content based on its context:

1.  **Run Report:** Call `gsc_page_report(page)`.
2.  **Filter Near-Miss Queries:** Isolate queries ranking in positions `8–20` that have significant impressions but are missing from the current page body.
3.  **Draft Context-Aware Copy:** Generate new, high-quality, information-rich paragraphs targeting those specific terms. The style of the writing must strictly match the surrounding page:
    *   Use the same tone of voice, vocabulary patterns, and layout structures.
    *   Respect HTML structures (using correct heading sizes `h2`/`h3` and lists if appropriate).
4.  **Present Draft:** Clearly outline the draft to the user, calling out exactly which GSC queries the new text targets.
5.  **Execute:** Upon approval, use `append_to_post` or `replace_in_post` to merge the new copy into the page.

---

## 4. Operational Guardrails

*   **Reporting Lag:** Be aware that Google Search Console data carries a `2–3 day` reporting lag and holds a limit of `16 months` of historic data. Never request performance data for "yesterday" or "today".
*   **Ahrefs vs. GSC Metrics:** Understand that Ahrefs estimates traffic metrics based on global keyword indices and click-stream models. Google Search Console reflects actual search impressions and clicks logged directly on Google search result pages. Value GSC data as the ground truth for actual domain performance.
*   **Verification Rule:** Always cite exact metrics (clicks, impressions, position, CTR) when presenting a performance dia