import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { getPostForLocale, getPostRecord, getRelatedPosts, imageSlugFor, postPath } from "@/lib/posts";
import { SITE_URL, blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { getBlogImage } from "@/lib/blog-images";
import { getPostMetaDescription } from "@/lib/seo";
import { CHECKLIST_COPY, type Para } from "@/lib/checklist-copy";

/**
 * Cluster D's pillar, and the highest-impression page on the domain:
 * 21,414 impressions over the 450 days to 17 September 2026, ahead of
 * every service page. Rendered in English, French and Spanish (owner,
 * 12 Oct 2026), from lib/checklist-copy.ts.
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
type Locale = "en" | "fr" | "es";

/** The English record's slug: the dates and the photograph come from it in every language. */
export const CHECKLIST_SLUG = "competitor-analysis-traffic-checklist";

export const CHECKLIST_PATH: Record<Locale, string> = {
  en: "/competitor-analysis-traffic-checklist/",
  fr: "/fr/checklist-analyse-concurrentielle/",
  es: "/es/checklist-analisis-de-competencia/",
};

function Rich({ para }: { para: Para }) {
  return (
    <>
      {para.map((seg, i) =>
        typeof seg === "string" ? (
          seg
        ) : seg.external ? (
          <a key={i} className="ulink" href={seg.href} rel="nofollow noopener">
            {seg.text}
          </a>
        ) : (
          <Link key={i} className="ulink" href={seg.href}>
            {seg.text}
          </Link>
        ),
      )}
    </>
  );
}

type Card = { href: string; image: string; cluster?: string; title: string; excerpt: string };

function relatedCards(locale: Locale): Card[] {
  if (locale === "en") {
    return getRelatedPosts(CHECKLIST_SLUG).map((r) => ({
      href: `/blog/${r.slug}/`,
      image: r.slug,
      cluster: r.cluster,
      title: r.title,
      excerpt: r.excerpt,
    }));
  }
  return (CHECKLIST_COPY[locale].related.slugs ?? [])
    .map((slug) => getPostForLocale(locale, slug))
    .filter((p) => p !== undefined)
    .map((p) => ({ href: postPath(locale, p.slug), image: imageSlugFor(locale, p.slug), title: p.title, excerpt: p.excerpt }));
}

export default function ChecklistView({ locale }: { locale: Locale }) {
  const c = CHECKLIST_COPY[locale];
  const related = relatedCards(locale);
  const post = getPostRecord(CHECKLIST_SLUG);
  const url = `${SITE_URL}${CHECKLIST_PATH[locale]}`;

  return (
    <main id="main">
      <JsonLd
        data={[
          ...(post
            ? [
                blogPostingSchema({
                  headline: c.heading,
                  description: locale === "en" ? getPostMetaDescription(post) : c.description,
                  datePublished: post.date,
                  dateModified: post.modified,
                  url,
                  image: getBlogImage(CHECKLIST_SLUG) ? `${SITE_URL}/images/blog/${CHECKLIST_SLUG}.webp` : undefined,
                  inLanguage: locale,
                }),
              ]
            : []),
          breadcrumbSchema([
            { name: c.home.name, url: `${SITE_URL}${c.home.href}` },
            { name: c.journal.name, url: `${SITE_URL}${c.journal.href}` },
            { name: c.heading, url },
          ]),
        ]}
      />

      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">{c.heroEyebrow}</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">{c.heading}</h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {c.lede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ THE CHECKLIST ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">{c.checklist.eyebrow}</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.checklist.heading}</h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {c.checklist.lede}
            </p>
          </Reveal>
          <ol className="grid gap-px" style={{ background: "var(--rule)" }}>
            {c.checklist.items.map((item, i) => (
              <Reveal key={item} i={i}>
                <li className="band flex items-baseline gap-5 px-7 py-6" style={{ background: "var(--bg)" }}>
                  <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
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
            <p className="eyebrow mb-3">{c.tools.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.tools.heading}</h2>
          </Reveal>
          <Reveal i={1}>
            <div className="max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              {c.tools.paras.map((p, i) => (
                <p key={i}>
                  <Rich para={p} />
                </p>
              ))}
              <p className="text-[.86rem]">
                <Rich para={c.tools.sources} />
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ THE FOUR RIVALS ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">{c.rivals.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.rivals.heading}</h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {c.rivals.lede}
            </p>
          </Reveal>
          <div className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {c.rivals.items.map((r, i) => (
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
              <Rich para={c.rivals.after} />
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CHANNEL MIX ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">{c.channels.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.channels.heading}</h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {c.channels.lede}
            </p>
          </Reveal>
          <div className="grid gap-px" style={{ background: "var(--rule)" }}>
            {c.channels.rows.map(([signal, meaning], i) => (
              <Reveal key={signal} i={i}>
                <div className="band grid gap-2 px-7 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8" style={{ background: "var(--bg)" }}>
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
            <p className="eyebrow mb-3">{c.editor.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.editor.heading}</h2>
          </Reveal>
          <Reveal i={1}>
            <div className="max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              {c.editor.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ AI CITATIONS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">{c.ai.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.ai.heading}</h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {c.ai.lede}
            </p>
          </Reveal>
          <div className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {c.ai.items.map(([name, body], i) => (
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
              <Rich para={c.ai.after} />
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SIX LINES ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">{c.roadmap.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.roadmap.heading}</h2>
            <p className="mb-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {c.roadmap.lede}
            </p>
          </Reveal>
          <div className="grid gap-px" style={{ background: "var(--rule)" }}>
            {c.roadmap.rows.map(([priority, action, outcome], i) => (
              <Reveal key={priority} i={i}>
                <div className="band grid gap-2 px-7 py-7 sm:grid-cols-[6rem_1fr_1fr] sm:gap-8" style={{ background: "var(--bg)" }}>
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
            <p className="eyebrow mb-3">{c.free.eyebrow}</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{c.free.heading}</h2>
          </Reveal>
          <Reveal i={1}>
            <div className="max-w-[64ch] space-y-5 text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              {c.free.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="band band-b py-[clamp(48px,7vw,90px)]">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">{c.related.eyebrow}</p>
              <h2 className="mb-10 max-w-[26ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">{c.related.heading}</h2>
            </Reveal>
            <ul className="grid gap-px cells-3 sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {related.map((r, i) => (
                <Reveal key={r.href} i={i}>
                  <li className="band h-full" style={{ background: "var(--bg)" }}>
                    <Link href={r.href} className="flex h-full flex-col">
                      <PostImage
                        slug={r.image}
                        cluster={r.cluster}
                        className="aspect-[1200/630] w-full"
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="flex flex-1 flex-col px-7 py-6">
                        <span className="ulink mb-2 text-[1.02rem] font-semibold leading-[1.3]">{r.title}</span>
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
              <Link href={c.related.topicHref} className="ulink mt-8 inline-block text-[.98rem]">
                {c.related.topicLabel}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <SiteFooter locale={locale} band={related.length > 0 ? "a" : "b"} />
    </main>
  );
}
