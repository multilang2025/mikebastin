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

function cleanSentence(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

/**
 * Words a sentence cannot end on. Cutting at a word boundary is not the
 * same as cutting at a grammatical one, and the difference shipped to the
 * SERP on thirteen posts: "enhancing efficiency, accuracy, and." and
 * "From multilingual content to." were both live meta descriptions.
 */
const DANGLING =
  /\s+(?:and|or|but|so|to|for|of|in|on|at|by|with|from|into|onto|over|under|as|than|that|which|who|the|a|an|its|their|your|our|his|her|is|are|was|were|be|been|can|could|will|would|may|might|should|not|more|most|less|very|such|when|while|where|how|why|if|because|about|across|through|between|per|via|plus|like)$/i;

/**
 * Trims `text` to fit `max` chars, never mid-word and never mid-clause.
 *
 * Prefers a real sentence boundary inside the budget, since a snippet that
 * ends where the author ended reads as written rather than as cut. Failing
 * that it cuts at a word boundary, then walks back over any trailing
 * function word or comma until the last word can carry a full stop.
 */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;

  // A sentence that ends inside the budget beats any cut we could make.
  const sentenceEnd = [...text.slice(0, max + 1).matchAll(/[.!?](?=\s|$)/g)]
    .map((m) => m.index ?? -1)
    .filter((i) => i >= max * 0.55)
    .pop();
  if (sentenceEnd !== undefined) return text.slice(0, sentenceEnd);

  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  let cut = lastSpace > max * 0.55 ? slice.slice(0, lastSpace) : slice;

  // Walk back off anything a full stop cannot follow. Bounded, because a
  // pathological run of function words should shorten the snippet, not
  // empty it.
  for (let i = 0; i < 6; i++) {
    const trimmed = cut.replace(/[.,;:\s]+$/, "");
    const next = trimmed.replace(DANGLING, "");
    if (next === trimmed) {
      cut = trimmed;
      break;
    }
    cut = next;
  }
  return cut.replace(/[.,;:\s]+$/, "");
}

/**
 * A post's meta description. Since the voice pass of 26 Sep 2026 every
 * `excerpt` is written as a search snippet (problem plus payoff, 120 to
 * 155 characters, docs/BLOG-STRUCTURE.md), so it is used as written. The
 * old rule trimmed it to make room for a cluster call to action, which cut
 * 50 of the 52 new excerpts mid-sentence ("...Brussels, each. See the
 * market-specific detail."). Now an excerpt over 160 characters is trimmed
 * at a clean boundary, and only one too short to fill a snippet gets the
 * cluster line appended.
 */
export function postMetaDescription(post: { excerpt: string; cluster: string }): string {
  const written = post.excerpt.trim().replace(/\s+/g, " ");
  // Keep the author's own closing mark, so a question stays a question.
  const whole = /[.!?]$/.test(written) ? written : `${written}.`;
  if (whole.length > MAX_LEN) return `${truncateAtWord(cleanSentence(written), MAX_LEN - 1)}.`;
  const withCta = `${whole} ${CLUSTER_CTA[post.cluster] ?? DEFAULT_CTA}`;
  return whole.length < 110 && withCta.length <= MAX_LEN ? withCta : whole;
}

/**
 * Hand-tuned overrides, for a post whose excerpt cannot double as its
 * snippet. Empty since the voice pass: the two it used to hold carried
 * pre-rewrite copy and now lose to the rewritten excerpts.
 */
export const POST_META_OVERRIDES: Record<string, string> = {};

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
