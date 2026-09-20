/**
 * The 59 EN blog posts qualifying for a live page, per
 * redirects/content-map.json (the routing source of truth, per
 * CONTENT-ARCHITECTURE.md section 2).
 *
 * A post group qualifies when `type === "post"`, `action === "migrate"`
 * and `destination === "mdx"`. Ninety-three groups meet that bar across
 * all three locales; only 59 carry an `en` entry, and this file reads
 * EN only, matching services.ts's own EN-first scope (FR/ES service
 * pages exist as separate content files read by their own locale routes,
 * not through lib/services.ts). The other 34 en/fr/es-populated groups in
 * content-map.json either relocate to valenciamove.com or retire, and both
 * already have their 301s (site/scripts/gen-redirects.mjs and
 * gen-prune-redirects.mjs); this file must never grow to include them.
 *
 * One qualifying group, competitor-analysis-traffic-checklist (g023), has
 * a hand-built page at the site root (app/competitor-analysis-traffic-checklist/)
 * rather than harvested content -- CONTENT-ARCHITECTURE.md section 4 names
 * it the single highest-value content job on the domain, so it got the
 * bespoke treatment services.ts's own lead-generation page got. It is
 * still read here (so cluster D's pillar link and legacy-URL coverage both
 * see it) but excluded from BLOG_POSTS's file-backed body, and
 * app/blog/[slug]/page.tsx does not generate a route for it -- the route
 * already exists and would collide.
 */
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { SITE_URL } from "@/lib/schema";
import {
  REPO_ROOT,
  LOCALES,
  qualifyingGroupsForLocale,
  type Locale,
  type LocaleSlugs,
} from "@/lib/content-locale";
import { getServiceLocaleManifest } from "@/lib/services-locale";

// Locale/LOCALES/LocaleSlugs/qualifyingGroupsForLocale now live in
// lib/content-locale.ts (shared with lib/services-locale.ts) and are
// re-exported here so every existing `from "@/lib/posts"` import of them
// keeps working unchanged.
export type { Locale, LocaleSlugs };
export { LOCALES };

export type PostFrontmatter = {
  words: number;
  title: string;
  slug: string;
  locale: string;
  type: string;
  group: string;
  wpId: number;
  date: string;
  modified: string;
  sourceUrl: string;
  excerpt: string;
};

export type Post = PostFrontmatter & {
  /** Rendered HTML body. Build time only -- never sent to the client as markdown. */
  html: string;
  /** The cluster this post was placed in, or "uncategorised". */
  cluster: string;
  /** The /services/<slug>/ page this post feeds, when the cluster (or a
   *  per-post override, for the language-market cluster) names one. */
  relatedService?: string;
};

/**
 * Slug this file renders through app/competitor-analysis-traffic-checklist/
 * instead of app/blog/[slug]/. Kept out of generateStaticParams so the
 * static export does not try to emit the same path twice.
 */
export const HAND_BUILT_SLUGS = ["competitor-analysis-traffic-checklist"];

function qualifyingEnGroups(): { group: string; slug: string; contentPath: string }[] {
  return qualifyingGroupsForLocale("en");
}

/**
 * Cluster A-F from CONTENT-ARCHITECTURE.md section 4. Each entry names the
 * post slugs it covers and the /services/<slug>/ page the cluster feeds.
 * `pillar` is the post CONTENT-ARCHITECTURE.md names as the cluster's
 * pillar; cluster D's pillar is the hand-built page in HAND_BUILT_SLUGS.
 * `overrides` gives an individual post a different related-service slug
 * than the cluster default -- needed only for cluster B, which feeds six
 * language-market service pages rather than one.
 */
const CLUSTERS: {
  name: string;
  service: string;
  pillar?: string;
  posts: string[];
  overrides?: Record<string, string>;
}[] = [
  {
    name: "Multilingual SEO",
    service: "multilingual-seo",
    pillar: "best-practices-for-multilingual-seo",
    posts: [
      "best-practices-for-multilingual-seo",
      "technical-seo-for-multilingual-websites",
      "multilingual-keyword-research",
      "optimising-multilingual-website-content",
      "common-mistakes-to-avoid-when-localising-your-website",
      "building-a-global-brand",
      "user-interface-localisation-can-transform-your-global-reach",
      "localisation-testing-tools",
      "google-analytics-international-marketing-limits",
      "alternatives-to-google-analytics",
    ],
  },
  {
    name: "Language markets",
    service: "multilingual-seo",
    posts: [
      "english-to-french-translation-services",
      "german-seo-best-practices",
      "german-seo-content-localisation",
      "technical-seo-considerations-for-german-websites",
      "spanish-on-page-seo",
      "spanish-keyword-localisation",
      "technical-seo-for-spanish-search-engines",
      "content-optimisation-for-spanish-users",
      "spanish-seo-markets",
      "link-building-in-spain",
      "seo-in-belgium",
    ],
    overrides: {
      "english-to-french-translation-services": "french-seo",
      "german-seo-best-practices": "german-seo",
      "german-seo-content-localisation": "german-seo",
      "technical-seo-considerations-for-german-websites": "german-seo",
      "spanish-on-page-seo": "spanish-seo",
      "spanish-keyword-localisation": "spanish-seo",
      "technical-seo-for-spanish-search-engines": "spanish-seo",
      "content-optimisation-for-spanish-users": "spanish-seo",
      "spanish-seo-markets": "spanish-seo",
      "link-building-in-spain": "spanish-seo",
      // No dedicated Belgium service page exists. CONTENT-ARCHITECTURE.md
      // section 3 places the French-speaking network in Belgium and
      // Switzerland ("the network is, not where the search volume is"),
      // so french-seo is the closest fit until a Belgium page exists.
      "seo-in-belgium": "french-seo",
    },
  },
  {
    name: "AI and the future of search",
    service: "generative-engine-optimization",
    pillar: "generative-engine-optimization",
    posts: [
      "generative-engine-optimization",
      "search-everywhere-strategy",
      "future-of-seo",
      "how-ai-is-revolutionising-seo-strategies",
      "how-ai-is-transforming-translation-and-localisation",
      "how-to-use-ai-and-machine-translation-tools",
      "ai-powered-marketing",
      "conversational-ai-chatbots-business",
      "llms-beyond-giants-hidden-ai-models",
      "prompt-engineers",
      "optimising-your-website-for-voice-search",
    ],
  },
  {
    name: "SEO fundamentals",
    service: "technical-seo",
    pillar: "competitor-analysis-traffic-checklist",
    posts: [
      "competitor-analysis-traffic-checklist",
      "competitor-analysis",
      "technical-seo-audit-checklist",
      "internal-linking-tools",
      "what-is-search-intent-mapping",
      "chrome-extensions-for-seo",
      "link-selling-and-link-buying-platforms",
      "how-to-create-a-targeted-content-strategy",
      "how-to-promote-your-local-business-on-google-maps",
      "law-firm-seo-services",
      "eeat-vs-aeat-typo",
      "optimising-your-website-for-valencia-based-searches",
    ],
    overrides: {
      "optimising-your-website-for-valencia-based-searches": "local-seo",
    },
  },
  {
    name: "Language industry",
    service: "translation-services",
    posts: [
      // language-service-providers and language-data-analysis, the other
      // two posts CONTENT-ARCHITECTURE.md names for this cluster, do not
      // qualify: the first absorbs into /services/, the second retires.
      // Both already have 301s from gen-prune-redirects.mjs.
      "chrome-extensions-for-translators",
    ],
  },
  {
    name: "Multilingual lead generation",
    service: "lead-generation",
    posts: [
      "email-marketing-hacks-boosting-open-rates-and-conversions",
      "most-popular-marketing-strategies",
      "digital-marketing-advisor",
      "french-ppc-campaign",
    ],
  },
  {
    // Twelve posts had no cluster and fell through to UNCATEGORISED, which
    // then rendered as a visible eyebrow on each post, on the blog index and
    // on twelve generated cover cards. Ten of them are genuinely general
    // business and marketing writing rather than multilingual SEO, so they
    // get an honest cluster of their own rather than a placeholder. The
    // other two went to SEO fundamentals, where they always belonged.
    //
    // Nine now: business-registration-in-valencia left for valenciamove.com,
    // which already ranks a page on the same S.L. and autonomo ground.
    name: "Business and marketing",
    service: "lead-generation",
    posts: [
      "360-marketing-agency",
      "affiliate-marketing-programs",
      "best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits",
      "global-business-trends",
      "how-to-write-about-your-professional-background",
      "human-creator-economy",
      "mastering-the-art-of-networking",
      "top-instagram-tools",
      "15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business",
    ],
  },
];

type ClusterAssignment = { cluster: string; service?: string };

function buildClusterIndex(): Map<string, ClusterAssignment> {
  const index = new Map<string, ClusterAssignment>();
  for (const cluster of CLUSTERS) {
    for (const slug of cluster.posts) {
      index.set(slug, {
        cluster: cluster.name,
        service: cluster.overrides?.[slug] ?? cluster.service,
      });
    }
  }
  return index;
}

const CLUSTER_INDEX = buildClusterIndex();

export const UNCATEGORISED = "Uncategorised";

let cache: Post[] | null = null;

/** Every live post, EN only, read from disk once per build. */
export function getPosts(): Post[] {
  if (cache) return cache;

  const posts: Post[] = [];
  for (const { slug, contentPath } of qualifyingEnGroups()) {
    if (HAND_BUILT_SLUGS.includes(slug)) continue;

    const raw = readFileSync(join(REPO_ROOT, contentPath), "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    const assignment = CLUSTER_INDEX.get(slug);

    posts.push({
      ...fm,
      html: marked.parse(content, { async: false }) as string,
      cluster: assignment?.cluster ?? UNCATEGORISED,
      relatedService: assignment?.service,
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export type ClusterGroup = {
  name: string;
  service?: string;
  pillar?: Post;
  /** The hand-built pillar page's own route, when it has one instead of a Post. */
  pillarHref?: string;
  posts: Post[];
};

/**
 * What each cluster is for, in a sentence a reader can act on. Shown on
 * its topic page and used as that page's meta description, so it is
 * written once rather than drifting between the two.
 */
const TOPIC_BLURB: Record<string, string> = {
  "Multilingual SEO":
    "Running one site across several languages without the versions competing with each other. Hreflang, per-market keyword work, and the decisions that get made before anything is written.",
  "Language markets":
    "What search behaves like inside one country rather than across a region. Volume, intent and competition read per market, because France and Belgium are not one audience with one keyword list.",
  "AI and the future of search":
    "How answer engines pick sources, and what that changes about writing for search. Practical reading rather than prediction.",
  "SEO fundamentals":
    "The parts that hold whatever is built on top of them: crawling, indexation, structure and measurement. Worth getting right before a translation budget goes anywhere near them.",
  "Language industry":
    "Translation, localisation and the people who do it. How the work is priced, scoped and quality-checked, from inside it.",
  "Multilingual lead generation":
    "Turning international visibility into enquiries, and knowing which language produced them. Tracking, attribution and the reporting that makes a market's spend defensible.",
  "Business and marketing":
    "Wider marketing and business writing, for the decisions around a site rather than inside it.",
};

/** URL segment for a topic page: the cluster name, lowercased and hyphenated. */
export function topicSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type Topic = ClusterGroup & { slug: string; blurb: string };

/**
 * The clusters that get a topic landing page at /blog/topics/<slug>/.
 *
 * Uncategorised is excluded deliberately: it is a fallback bucket, not a
 * subject, so a landing page for it would be a page about nothing, and
 * the whole point of the clustering pass was to empty it.
 *
 * The route lives under /blog/topics/ rather than /blog/<slug>/ for two
 * reasons. A topic slug and a post slug would otherwise share one
 * namespace and a future post could silently take a topic's URL. And
 * "multilingual-seo" is already a service slug, so /blog/multilingual-seo/
 * would put a topic page in competition with the service page that is
 * meant to rank for it.
 */
export function getTopics(): Topic[] {
  return getClusterGroups()
    .filter((g) => g.name !== UNCATEGORISED)
    .map((g) => ({
      ...g,
      slug: topicSlug(g.name),
      blurb: TOPIC_BLURB[g.name] ?? "",
    }));
}

/**
 * Posts grouped for the Journal index: one entry per cluster in
 * CONTENT-ARCHITECTURE.md's section 4 order, then Uncategorised last for
 * the posts the doc itself says the map is not exhaustive enough to place
 * (12 of the 59, all outside any of the six clusters' listed nodes).
 */
export function getClusterGroups(): ClusterGroup[] {
  const posts = getPosts();
  const groups: ClusterGroup[] = [];

  for (const cluster of CLUSTERS) {
    const members = posts.filter((p) => p.cluster === cluster.name);
    const pillarSlug = cluster.pillar;
    const pillar = pillarSlug ? members.find((p) => p.slug === pillarSlug) : undefined;
    const rest = pillar ? members.filter((p) => p.slug !== pillar.slug) : members;

    groups.push({
      name: cluster.name,
      service: cluster.service,
      pillar,
      pillarHref:
        pillarSlug && HAND_BUILT_SLUGS.includes(pillarSlug)
          ? `/${pillarSlug}/`
          : undefined,
      posts: rest,
    });
  }

  const uncategorised = posts.filter((p) => p.cluster === UNCATEGORISED);
  if (uncategorised.length > 0) {
    groups.push({ name: UNCATEGORISED, posts: uncategorised });
  }

  return groups;
}

/**
 * A post read for FR or ES: the frontmatter plus rendered body, same shape
 * as Post minus the EN-only cluster/relatedService fields (those come from
 * CLUSTERS, an EN-specific editorial grouping with no FR/ES equivalent
 * yet). A Post satisfies this shape too, so getPostsForLocale("en") can
 * return getPosts() unchanged.
 */
export type LocalePost = PostFrontmatter & { html: string };

const localePostCache: Partial<Record<Locale, LocalePost[]>> = {};

/**
 * Every live post for `locale`. EN keeps its existing behaviour exactly
 * (cluster assignment, HAND_BUILT_SLUGS exclusion, the same module-level
 * cache) by delegating to getPosts(). FR and ES read their own content
 * directories, gated by the same content-map.json qualification bar, and
 * cache separately per locale.
 */
export function getPostsForLocale(locale: Locale): LocalePost[] {
  if (locale === "en") return getPosts();

  const cached = localePostCache[locale];
  if (cached) return cached;

  const posts: LocalePost[] = [];
  for (const { contentPath } of qualifyingGroupsForLocale(locale)) {
    const raw = readFileSync(join(REPO_ROOT, contentPath), "utf8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    posts.push({ ...fm, html: marked.parse(content, { async: false }) as string });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localePostCache[locale] = posts;
  return posts;
}

export function getPostForLocale(locale: Locale, slug: string): LocalePost | undefined {
  return getPostsForLocale(locale).find((p) => p.slug === slug);
}

let siblingIndex: Map<string, LocaleSlugs> | null = null;

/**
 * Maps a translation group to the slug each locale published it under.
 * Only locales that cleared qualifyingGroupsForLocale appear here, so a
 * group that relocates to valenciamove.com or retires in one locale never
 * produces a sibling link to a page that was never built -- the class of
 * bug valenciamove.com's getAllTranslatedParams learned to guard against.
 */
function buildSiblingIndex(): Map<string, LocaleSlugs> {
  if (siblingIndex) return siblingIndex;
  const map = new Map<string, LocaleSlugs>();
  for (const locale of LOCALES) {
    for (const post of getPostsForLocale(locale)) {
      const entry = map.get(post.group) ?? {};
      entry[locale] = post.slug;
      map.set(post.group, entry);
    }
  }
  siblingIndex = map;
  return map;
}

/** The published slug per locale for a post's translation group. */
export function getPostSiblings(group: string): LocaleSlugs {
  return buildSiblingIndex().get(group) ?? {};
}

/** Site-relative path for a published post in `locale`. EN stays at
 *  /blog/<slug>/ (unchanged); FR and ES are flat at /fr/<slug>/ and
 *  /es/<slug>/, matching their localised sourceUrl in the frontmatter. */
export function postPath(locale: Locale, slug: string): string {
  return locale === "en" ? `/blog/${slug}/` : `/${locale}/${slug}/`;
}

/**
 * path -> the slug each locale published that translation group under,
 * one entry per published locale variant of every group with 2+ locales.
 * Built for SiteNav's language switcher: a Server Component (the root
 * layout) computes this once at build time and passes it down as a plain
 * serialisable prop, since SiteNav itself is a client component and
 * cannot read the filesystem. Groups with only one published locale are
 * left out entirely, so a page with no sibling gets no manifest entry and
 * the switcher degrades to "nothing to offer" rather than a bogus link.
 *
 * Merged with the equivalent service-page manifest from
 * lib/services-locale.ts, so app/layout.tsx -- which this project is not
 * to touch -- keeps calling this one function unchanged and SiteNav still
 * gets both posts' and services' siblings from a single prop.
 */
export function getLocaleManifest(): Record<string, LocaleSlugs> {
  const manifest: Record<string, LocaleSlugs> = {};
  for (const siblings of buildSiblingIndex().values()) {
    const published = LOCALES.filter((l) => siblings[l]);
    if (published.length < 2) continue;
    for (const locale of published) {
      manifest[postPath(locale, siblings[locale]!)] = siblings;
    }
  }
  return { ...manifest, ...getServiceLocaleManifest() };
}

/**
 * `alternates.languages` for a post's `<head>`, built from the locales its
 * translation group actually published. Returns undefined when the group
 * has no sibling at all, so a page with nothing to link to emits no
 * hreflang block rather than a self-referencing or bogus one. `x-default`
 * points at the EN URL when EN published this group; groups with no EN
 * sibling (most of the ES-only set) omit x-default rather than guess
 * which non-EN locale should stand in for it.
 */
export function postHreflang(group: string): Record<string, string> | undefined {
  const siblings = getPostSiblings(group);
  const published = LOCALES.filter((l) => siblings[l]);
  if (published.length < 2) return undefined;

  const languages: Record<string, string> = {};
  for (const locale of published) {
    languages[locale] = `${SITE_URL}${postPath(locale, siblings[locale]!)}`;
  }
  if (siblings.en) {
    languages["x-default"] = `${SITE_URL}${postPath("en", siblings.en)}`;
  }
  return languages;
}
