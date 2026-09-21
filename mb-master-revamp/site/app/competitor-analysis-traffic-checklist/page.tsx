import type { Metadata } from "next";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { getPostRecord, getRelatedPosts, topicSlug } from "@/lib/posts";
import { SITE_URL, blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { getBlogImage } from "@/lib/blog-images";
import { getPostMetaDescription } from "@/lib/seo";

/**
 * Cluster D's pillar, and the highest-impression page on the domain:
 * 21,414 impressions over the 450 days to 17 September 2026, ahead of
 * every service page.
 *
 * It shipped as a 346-word placeholder whose own copy said the most
 * valuable content job in the project was giving this page something to
 * say. The legacy post it replaces carries 2,799 words of sourced
 * material, so this is a recovery rather than a rewrite: the checklist
 * itself, the accuracy bands on the traffic tools with their sources
 * kept, the four kinds of competitor, what a channel mix discloses, the
 * AI citation audit, and the discipline of cutting eighty findings down
 * to six.
 *
 * Deliberately not carried over: the "25 years", the invented monthly
 * visit figures used as illustration, and Brand Radar's subscription
 * price, which dates faster than anything else on the page.
 */

const DESCRIPTION =
  "Work through a competitor traffic audit the way we run one: the real rival list, what the traffic tools can and cannot tell you, channel mix, AI citations, and six actions rather than eighty.";

export const metadata: Metadata = {
  title: "The competitor analysis and traffic checklist, Mike Bastin",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/competitor-analysis-traffic-checklist/` },
  openGraph: {
    type: "article",
    siteName: "Mike Bastin",
    locale: "en_GB",
    url: `${SITE_URL}/competitor-analysis-traffic-checklist/`,
    title: "The competitor analysis and traffic checklist, Mike Bastin",
    description: DESCRIPTION,
  },
};

/** The artefact people arrive for. Ordered as the audit actually runs. */
const CHECKLIST = [
  "Build the real rival list: direct, indirect, content and AI-citation competitors, not the names on the sales whiteboard.",
  "Establish the margin of error before quoting a single traffic number to anyone.",
  "Map traffic sources rather than totals: organic, paid, direct, referral and geographic mix.",
  "Read what each channel discloses about how their marketing function is actually built.",
  "Read their top pages like an editor: audience, intent and next action on every money page.",
  "Find the terms they rank for that you do not, and the gaps they have left open.",
  "Audit AI citations, not only SERP position.",
  "Check the multilingual setup: hreflang, localized schema, language-specific content.",
  "Cut the findings to six lines: three quick fixes, two content gaps, one structural play.",
];

const RIVALS = [
  {
    name: "Direct rivals",
    body: "Selling the same service to the same audience in the same language. The list the client already has, and usually the shortest of the four.",
  },
  {
    name: "Indirect rivals",
    body: "Solving the same problem with a different model, such as a translation agency losing work to an AI tool rather than to another agency.",
  },
  {
    name: "Content competitors",
    body: "Publishers and blogs outranking you on your own money terms without selling what you sell. They take the click and never take the deal.",
  },
  {
    name: "AI citation rivals",
    body: "The domains an LLM reaches for when someone asks an industry question. Newest of the four, and the one most often missing from the list entirely.",
  },
];

const CHANNELS = [
  ["High direct share", "Real brand equity and a repeat audience, usually with offline or PR spend behind it."],
  ["High organic, low paid", "A mature content programme, often with dedicated search people on staff."],
  ["High paid, low organic", "An acquisition shop, and one exposed the moment ad costs move."],
  ["High referral, low search", "Partnerships, affiliates, or a single viral page holding the number up."],
  ["Concentrated geography", "A local focus, and frequently weak hreflang or no localized content at all."],
];

const AI_PATTERNS = [
  ["Clean data tables", "Tabular content gets lifted intact, which is why a table often outranks the paragraph that says the same thing."],
  ["FAQ schema", "Direct answers to specific questions, marked up so a machine can find the answer without parsing the page."],
  ["Entity linking", "Their brand tied to recognised industry concepts, with outbound references to sources worth citing."],
  ["Visible expertise", "Named authors, real dates, actual citations. The signals Google's own guidelines reward, and the ones LLMs reuse."],
];

const ROADMAP = [
  ["High", "Fix technical errors and schema gaps on the money pages.", "Cleaner crawling and indexing, fewer impressions wasted on pages that cannot convert."],
  ["Medium", "Build or rewrite content where a rival ranks on a weak page.", "Organic capture on competitive queries, over months rather than weeks."],
  ["Low", "Tidy referral sources and link properly from the journal to the service pages.", "Stronger topical authority and broader brand signals."],
];

/** The cluster this page is the pillar of, per CLUSTERS in lib/posts.ts. */
const CLUSTER = "SEO fundamentals";
/** This page's own slug, which is how lib/posts.ts finds its cluster. */
const SLUG = "competitor-analysis-traffic-checklist";

export default function CompetitorChecklistPage() {
  const related = getRelatedPosts(SLUG);

  // The page is a cluster pillar and sits on the journal index beside the
  // posts, but being hand-built it was emitting breadcrumbs and nothing
  // else: no BlogPosting, no author, no dates, no image, while every
  // ordinary post carried all five. Its record in lib/posts.ts has the
  // real dates, so the schema is built from the same source as the posts'.
  // getPost() cannot reach it: getPosts() skips HAND_BUILT_SLUGS by design,
  // so this needs getPostRecord(), which reads the file regardless.
  const post = getPostRecord(SLUG);
  const url = `${SITE_URL}/${SLUG}/`;

  return (
    <main id="main">
      <JsonLd
        data={[
          ...(post
            ? [
                blogPostingSchema({
                  headline: "The competitor analysis and traffic checklist",
                  description: getPostMetaDescription(post),
                  datePublished: post.date,
                  dateModified: post.modified,
                  url,
                  image: getBlogImage(SLUG)
                    ? `${SITE_URL}/images/blog/${SLUG}.webp`
                    : undefined,
                }),
              ]
            : []),
          breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Journal", url: `${SITE_URL}/blog/` },
            { name: "The competitor analysis and traffic checklist", url },
          ]),
        ]}
      />

      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Competitor analysis, the working version</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              The competitor analysis and traffic checklist
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              A competitor audit is not a Semrush export. It is a
              structured way to read another company&rsquo;s playbook and
              decide what is worth copying, what is worth ignoring, and
              what they have not worked out yet. The question underneath
              every one we run is the same: where is their traffic
              actually coming from, and is that source repeatable in your
              language, your market and your budget?
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ THE CHECKLIST ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Save this part</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              The checklist itself
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Nine steps, in the order the audit runs. The sections below
              cover why each one is there and where it goes wrong.
            </p>
          </Reveal>
          <ol className="grid gap-px" style={{ background: "var(--rule)" }}>
            {CHECKLIST.map((item, i) => (
              <Reveal key={item} i={i}>
                <li className="band flex items-baseline gap-5 px-7 py-6" style={{ background: "var(--bg)" }}>
                  <span
                    className="display shrink-0 text-[.9rem] font-semibold tabular-nums"
                    style={{ color: "var(--berry)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1rem] leading-[1.5]">{item}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ TOOL ACCURACY ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Before you quote a number</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              What the traffic tools can and cannot tell you
            </h2>
          </Reveal>
          <Reveal i={1}>
            <div className="max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              <p>
                We have watched consultants read Semrush traffic estimates
                to a client as though they were Analytics data. They are
                not. Published testing puts Semrush within roughly 10 to
                15 percent of real traffic on mid to high traffic sites,
                and at 20 to 40 percent variance once a site is small.
                Similarweb is stronger on large international domains and
                loses accuracy faster on smaller ones, with variance
                reported at 15 to 30 percent for mid-sized sites and above
                50 percent at the low end.
              </p>
              <p>
                A 50 percent margin of error sounds like it makes the data
                worthless. In practice it does not, as long as the numbers
                are read as direction rather than as fact. You can see
                which rival is growing, which is flat, and which mix is
                tilting towards paid. What you cannot do is tell a client
                they are getting 47,000 visits a month when the real figure
                could sit anywhere between 22,000 and 70,000.
              </p>
              <p>
                For an international audit the two tools are better
                together than either alone. Similarweb&rsquo;s panel is
                stronger outside North America, so a rival earning most of
                its traffic in Germany or Spain is read more accurately by
                layering Similarweb estimates over Semrush keyword
                exports.
              </p>
              <p className="text-[.86rem]">
                Accuracy figures from{" "}
                <a
                  className="ulink"
                  href="https://www.traffic-masters.net/blog/website-traffic-checker/"
                  rel="nofollow noopener"
                >
                  Traffic Masters&rsquo; traffic checker comparison
                </a>{" "}
                and{" "}
                <a
                  className="ulink"
                  href="https://brightseotools.com/post/SEMrush-vs-Similarweb-Traffic-Data-Accuracy-Compared"
                  rel="nofollow noopener"
                >
                  Bright SEO Tools on Semrush against Similarweb
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ THE FOUR RIVALS ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Phase one</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Four kinds of competitor, and only one is on the whiteboard
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Every client hands over three or four main competitors at
              kickoff, and in our experience at least one of them does not
              compete online at all.
            </p>
          </Reveal>
          <div className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {RIVALS.map((r, i) => (
              <Reveal key={r.name} i={i}>
                <div className="band h-full px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-2 text-[1.1rem] font-semibold">{r.name}</p>
                  <p className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {r.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal i={4}>
            <p className="mt-8 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Build the real list from an organic competitors report in
              Ahrefs or Semrush, cross-checked against the places your
              buyers actually compare vendors. A pass with a handful of{" "}
              <Link className="ulink" href="/blog/chrome-extensions-for-seo/">
                SEO browser extensions
              </Link>{" "}
              is usually enough to see how each one is built.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CHANNEL MIX ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Phase two</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              What a channel mix discloses
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Total visits are vanity. The mix feeding them describes what
              their marketing function is, and where it breaks.
            </p>
          </Reveal>
          <div className="grid gap-px" style={{ background: "var(--rule)" }}>
            {CHANNELS.map(([signal, meaning], i) => (
              <Reveal key={signal} i={i}>
                <div
                  className="band grid gap-2 px-7 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"
                  style={{ background: "var(--bg)" }}
                >
                  <p className="text-[.95rem] font-semibold leading-[1.4]">{signal}</p>
                  <p className="text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {meaning}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ READ IT LIKE AN EDITOR ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Phase three</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Read their content like an editor
            </h2>
          </Reveal>
          <Reveal i={1}>
            <div className="max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              <p>
                Open their best pages and ask three questions. Who is it
                written for? What does it ask the reader to do next? Does
                it answer the query, or pad around a few keywords?
              </p>
              <p>
                The pattern we meet most often is the everything hub: a few
                hundred articles, a good share of them short and
                machine-written, and traffic that flattens and stays flat.
                It looks like a content engine from the outside. It is a
                liability that costs them ground on every quality update.
              </p>
              <p>
                Look at where their intent coverage stops. A rival that
                owns the how-to queries and has nothing on pricing,
                comparisons or alternatives has left the bottom of the
                funnel open. Three sharp comparison pages, linked properly
                from the pages that already rank, take enquiries they will
                never see leaving.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ AI CITATIONS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Phase four</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Audit the citations, not only the position
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              A growing share of research now happens inside an assistant
              before anyone clicks anything, so a rival can be invisible in
              the ten blue links and quoted in every answer. Tools track
              this now, Ahrefs Brand Radar among them, and their counts are
              worth treating as direction rather than as a tally. Run the
              same prompts yourself once a month and see who gets named.
              Four structural patterns make a page easy to lift:
            </p>
          </Reveal>
          <div className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {AI_PATTERNS.map(([name, body], i) => (
              <Reveal key={name} i={i}>
                <div className="band h-full px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-2 text-[1.1rem] font-semibold">{name}</p>
                  <p className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal i={4}>
            <p className="mt-8 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              On international queries, check how they handle{" "}
              <Link className="ulink" href="/blog/technical-seo-for-multilingual-websites/">
                technical SEO across languages
              </Link>
              . A clean multilingual setup is a moat. A broken one is an
              opening for whoever takes it seriously first.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SIX LINES ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Phase five</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Cut eighty findings down to six
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Where most audits die. The analyst lists eighty issues, the
              client nods, and nothing happens, because eighty issues is
              not a plan. Pick six: three quick technical fixes, two
              content gaps where a rival ranks on a weak page, and one
              structural play worth a quarter or two.
            </p>
          </Reveal>
          <div className="grid gap-px" style={{ background: "var(--rule)" }}>
            {ROADMAP.map(([priority, action, outcome], i) => (
              <Reveal key={priority} i={i}>
                <div
                  className="band grid gap-2 px-7 py-7 sm:grid-cols-[6rem_1fr_1fr] sm:gap-8"
                  style={{ background: "var(--bg)" }}
                >
                  <p className="text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--berry)" }}>
                    {priority}
                  </p>
                  <p className="text-[.95rem] leading-[1.5]">{action}</p>
                  <p className="text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {outcome}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FREE TOOLS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Before you buy anything</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              A first pass costs nothing
            </h2>
          </Reveal>
          <Reveal i={1}>
            <div className="max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              <p>
                Most of the checklist can be worked through on free tiers
                before anyone signs up to a paid stack. Ahrefs Webmaster
                Tools and the free tiers of Semrush and Ubersuggest will
                surface organic competitors. The Similarweb browser
                extension gives a quick directional read on any
                domain&rsquo;s channel mix. Keyword Planner and your own
                Search Console show the queries you already touch, which is
                how you spot what a rival owns and you do not.
              </p>
              <p>
                Upgrade once the exercise has proved it is worth paying
                for, not before. The discipline in the checklist matters
                more than the subscription behind it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="band band-b py-[clamp(48px,7vw,90px)]">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">Keep reading</p>
              <h2 className="mb-10 max-w-[26ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
                More from the journal
              </h2>
            </Reveal>
            <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {related.map((r, i) => (
                <Reveal key={r.slug} i={i}>
                  <li className="band h-full" style={{ background: "var(--bg)" }}>
                    <Link href={`/blog/${r.slug}/`} className="flex h-full flex-col">
                      <PostImage
                        slug={r.slug}
                        cluster={r.cluster}
                        className="aspect-[1200/630] w-full"
                      />
                      <div className="flex flex-1 flex-col px-7 py-6">
                        <span className="ulink mb-2 text-[1.02rem] font-semibold leading-[1.3]">
                          {r.title}
                        </span>
                        <p className="mb-4 line-clamp-3 text-[.88rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                          {r.excerpt}
                        </p>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <Link
                href={`/blog/topics/${topicSlug(CLUSTER)}/`}
                className="ulink mt-8 inline-block text-[.98rem]"
              >
                See everything in {CLUSTER}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <SiteFooter band="a" />
    </main>
  );
}
