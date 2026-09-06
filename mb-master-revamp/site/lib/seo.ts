/**
 * Meta description craft for the 59 live blog posts.
 *
 * The brief for this pass (docs for on-page/EEAT work, September 2026) is
 * explicit: do not fabricate search-volume-driven copy for 59 posts by
 * hand-guessing keywords with no live Ahrefs access, and do not just copy
 * the on-page `excerpt` verbatim into the SERP snippet either -- that field
 * was written for display under the post title, not for a 140-160 character
 * search snippet, so its length is usually wrong for the job.
 *
 * `postMetaDescription` is the middle path: it is grounded entirely in the
 * post's own `excerpt` (real, existing on-page copy, never invented), and
 * applies the on-page-SEO shaping an excerpt does not already have --
 * trimming to a search-snippet length at a clean sentence or word boundary,
 * and closing with a short, cluster-appropriate call to action so the
 * snippet reads as an invitation to click rather than a truncated sentence.
 * `POST_META_OVERRIDES` hand-tunes the two posts that are cluster pillars
 * outside the hand-built checklist page (which already has bespoke
 * metadata of its own), since a pillar page is worth the extra attention a
 * mechanical rule cannot give it.
 */

const CLUSTER_CTA: Record<string, string> = {
  "Multilingual SEO": "See what actually works.",
  "Language markets": "See the market-specific detail.",
  "AI and the future of search": "See where AI actually helps.",
  "SEO fundamentals": "Get the checklist.",
  "Language industry": "Read the full picture.",
  "Multilingual lead generation": "See how it plays out.",
  Uncategorised: "Read the full post.",
};

const DEFAULT_CTA = "Read the full post.";
const MAX_LEN = 160;
const MIN_LEN = 120;

function cleanSentence(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

/** Trims `text` to fit `max` chars at a word boundary, never mid-word. */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.55 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[.,;:\s]+$/, "");
}

/**
 * Builds a 140-160 character (best effort; shorter only when the source
 * excerpt itself is short) meta description from a post's real excerpt,
 * closing with a cluster-appropriate call to action.
 */
export function postMetaDescription(post: { excerpt: string; cluster: string }): string {
  const cta = CLUSTER_CTA[post.cluster] ?? DEFAULT_CTA;
  const base = cleanSentence(post.excerpt);

  const room = MAX_LEN - cta.length - 2; // ". " joins base and cta
  const fitted = truncateAtWord(base, Math.max(room, 40));
  const combined = `${fitted}. ${cta}`;

  if (combined.length <= MAX_LEN && combined.length >= MIN_LEN) return combined;
  // Excerpt was already short: appending the CTA still reads naturally and
  // there is nothing more true to say without inventing content, so a
  // shorter-than-ideal snippet stands rather than padding it with filler.
  return combined.length <= MAX_LEN ? combined : `${truncateAtWord(base, MAX_LEN - 1)}.`;
}

/**
 * Hand-tuned overrides for the two cluster pillars that are ordinary blog
 * posts (the checklist pillar has its own bespoke hand-built page and
 * metadata already). Written from the posts' own bodies, not invented.
 */
export const POST_META_OVERRIDES: Record<string, string> = {
  "best-practices-for-multilingual-seo":
    "Multilingual SEO in 2026 needs hreflang, structured data and GEO working together, not translated keywords alone. See the practices that build presence.",
  "generative-engine-optimization":
    "AI answers now name a handful of sources instead of ranking ten blue links. Here is how Generative Engine Optimisation adapts SEO to be one of them.",
};

export function getPostMetaDescription(post: { slug: string; excerpt: string; cluster: string }): string {
  return POST_META_OVERRIDES[post.slug] ?? postMetaDescription(post);
}

/** Builds a <title> for a blog post: the post's own title, unmodified where
 * it already reads as a search title, with the brand suffix appended only
 * when there is room for it under ~60 characters. Many of these titles are
 * long-form headlines carried over from the old site (already earning
 * impressions in Search Console per docs/CONTENT-ARCHITECTURE.md), so
 * forcing ", Mike Bastin" onto all of them would push genuinely long ones
 * well past a readable SERP title for no benefit. */
export function postMetaTitle(title: string): string {
  const withBrand = `${title}, Mike Bastin`;
  return withBrand.length <= 60 ? withBrand : title;
}
