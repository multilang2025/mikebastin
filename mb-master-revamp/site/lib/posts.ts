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

type ContentMapGroup = {
  group: string;
  type: string;
  action: string;
  destination: string;
  en: { id: number; slug: string; url: string; content_path: string } | null;
  fr: unknown;
  es: unknown;
};

// process.cwd() is the site/ directory (where `next build` runs), so the
// repo root is one level up. Not `import.meta.url` -- Turbopack tries to
// statically resolve a `new URL(..., import.meta.url)` argument as a
// module import, and a plain relative path is not a module.
const REPO_ROOT = join(process.cwd(), "..");
const CONTENT_MAP_PATH = join(REPO_ROOT, "redirects/content-map.json");

/**
 * Slug this file renders through app/competitor-analysis-traffic-checklist/
 * instead of app/blog/[slug]/. Kept out of generateStaticParams so the
 * static export does not try to emit the same path twice.
 */
export const HAND_BUILT_SLUGS = ["competitor-analysis-traffic-checklist"];

function qualifyingEnGroups(): { group: string; slug: string; contentPath: string }[] {
  const contentMap = JSON.parse(readFileSync(CONTENT_MAP_PATH, "utf8")) as {
    groups: ContentMapGroup[];
  };
  const groups = contentMap.groups;
  return groups
    .filter((g) => g.type === "post" && g.action === "migrate" && g.destination === "mdx" && g.en)
    .map((g) => ({ group: g.group, slug: g.en!.slug, contentPath: g.en!.content_path }));
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
    ],
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
