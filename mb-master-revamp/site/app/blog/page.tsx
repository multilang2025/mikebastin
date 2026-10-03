import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { enLanguages } from "@/lib/fr-pages";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import PostCard, { POST_GRID } from "@/components/PostCard";
import SiteFooter from "@/components/SiteFooter";
import { topicSlug, getClusterGroups, UNCATEGORISED } from "@/lib/posts";
import { getService } from "@/lib/services";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Multilingual SEO and AI journal, Mike Bastin",
    description: "Fifty nine posts on multilingual SEO, localization and AI, grouped by subject, with the service behind each group named alongside it.",
    path: "/blog/",
    languages: enLanguages("/blog/"),
  }),
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndex() {
  const groups = getClusterGroups();
  const total = groups.reduce(
    (n, g) => n + g.posts.length + (g.pillar ? 1 : 0),
    0
  );

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Journal", url: `${SITE_URL}/blog/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Sorted by subject, so you can follow a topic</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              The Journal: multilingual SEO and AI consulting articles
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Grouped by topic, with the main guide for each group first
              and the service behind it named alongside, so you can read
              your way straight to the answer.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CLUSTERS ============ */}
      {groups.map((group, gi) => {
        const service = group.service ? getService(group.service) : undefined;
        const isUncategorised = group.name === UNCATEGORISED;
        return (
          <section
            key={group.name}
            className={`band ${gi % 2 === 0 ? "band-b" : "band-a"} py-[clamp(48px,7vw,96px)]`}
          >
            <div className="shell">
              <Reveal>
                <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
                  <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.15]">
                    {isUncategorised ? (
                      group.name
                    ) : (
                      <Link href={`/blog/topics/${topicSlug(group.name)}/`} className="ulink">
                        {group.name}
                      </Link>
                    )}
                  </h2>
                  {service && (
                    <Link href={`/services/${service.slug}/`} className="ulink shrink-0 text-[.86rem]">
                      {service.name}
                    </Link>
                  )}
                </div>
              </Reveal>

              {/* Pillar, given its own row.
                  Image beside the text on a wide screen, so the pillar does
                  not read as an unusually wide card, and above it once the
                  row stacks under 640px.

                  The image comes first in the DOM and is moved right by
                  `sm:order-last`, rather than the other way round. Text-first
                  markup put the pillar's picture directly above the first
                  card's picture on a phone, with nothing between them, so the
                  two read as one image duplicated. Image-first gives the
                  pillar the same shape as the cards below it and puts its
                  excerpt between the two pictures. */}
              {(group.pillar || group.pillarHref) && (
                <Reveal i={1}>
                  <Link
                    href={group.pillarHref ?? `/blog/${group.pillar!.slug}/`}
                    className="mb-8 grid gap-6 border-l-2 pl-6 sm:grid-cols-[1fr_minmax(0,38%)] sm:items-center"
                    style={{ borderColor: "var(--berry)" }}
                  >
                    <span
                      className="block overflow-hidden rounded-[4px] border sm:order-last"
                      style={{ borderColor: "var(--rule)" }}
                    >
                      <PostImage
                        /* A hand-built pillar has no Post, so its slug comes
                           back out of the href lib/posts.ts built from it,
                           rather than being written down a second time. */
                        slug={group.pillar?.slug ?? (group.pillarHref ?? "").replace(/\//g, "")}
                        cluster={group.name}
                        className="aspect-[1200/630] w-full"
                        sizes="(min-width: 640px) 50vw, 100vw"
                      />
                    </span>
                    <div>
                      <span
                        className="mb-2 inline-block rounded-[3px] px-2 py-[3px] text-[.62rem] uppercase tracking-[.1em]"
                        style={{ background: "var(--berry-soft)", color: "var(--berry)" }}
                      >
                        Start here
                      </span>
                      <h3 className="ulink display mb-2 max-w-[36ch] text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-[1.2]">
                        {group.pillar ? group.pillar.title : "The competitor analysis and traffic checklist"}
                      </h3>
                      {group.pillar && (
                        <p className="max-w-[62ch] text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                          {group.pillar.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Real space between the cards, not the hairline-rule trick
                  the service lists use. Here every card opens with a
                  full-bleed photograph, so a 1px gap put one photograph
                  directly against the next and the grid read as a single
                  collage: the rule it was meant to show through was
                  invisible behind the images, and the row below started
                  immediately under the row above's date. Owner, 22 Sep. */}
              {group.posts.length > 0 && (
                <ul className={POST_GRID}>
                  {group.posts.map((post, i) => (
                    <Reveal key={post.slug} i={i}>
                      <li className="h-full">
                        <PostCard
                          href={`/blog/${post.slug}/`}
                          imageSlug={post.slug}
                          cluster={group.name}
                          title={post.title}
                          excerpt={post.excerpt}
                          date={formatDate(post.date)}
                        />
                      </li>
                    </Reveal>
                  ))}
                </ul>
              )}

              {isUncategorised && (
                <Reveal i={2}>
                  <p className="mt-6 max-w-[62ch] text-[.85rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    A few posts range across the topics above, and each one
                    is worth a read.
                  </p>
                </Reveal>
              )}
            </div>
          </section>
        );
      })}

      <SiteFooter />
    </main>
  );
}
