import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { getClusterGroups, UNCATEGORISED } from "@/lib/posts";
import { getService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Journal, Mike Bastin",
  description:
    "Fifty nine posts in six clusters, each one feeding the service page its query network actually belongs to, rather than a river of dated posts nobody browses.",
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
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">{total} posts, six clusters, no river of dates</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Journal
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Grouped by the query network each post actually belongs to,
              with the pillar for that cluster first and its service page
              named alongside it, rather than a feed sorted by publish
              date.
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
                    {group.name}
                  </h2>
                  {service && (
                    <Link href={`/services/${service.slug}/`} className="ulink shrink-0 text-[.86rem]">
                      {service.name}
                    </Link>
                  )}
                </div>
              </Reveal>

              {/* Pillar, given its own row */}
              {(group.pillar || group.pillarHref) && (
                <Reveal i={1}>
                  <Link
                    href={group.pillarHref ?? `/blog/${group.pillar!.slug}/`}
                    className="mb-8 block border-l-2 pl-6"
                    style={{ borderColor: "var(--berry)" }}
                  >
                    <span
                      className="mb-2 inline-block rounded-[3px] px-2 py-[3px] text-[.62rem] uppercase tracking-[.1em]"
                      style={{ background: "var(--berry-soft)", color: "var(--berry)" }}
                    >
                      Pillar
                    </span>
                    <h3 className="ulink display mb-2 max-w-[36ch] text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-[1.2]">
                      {group.pillar ? group.pillar.title : "The competitor analysis and traffic checklist"}
                    </h3>
                    {group.pillar && (
                      <p className="max-w-[62ch] text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                        {group.pillar.excerpt}
                      </p>
                    )}
                  </Link>
                </Reveal>
              )}

              {group.posts.length > 0 && (
                <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
                  {group.posts.map((post, i) => (
                    <Reveal key={post.slug} i={i}>
                      <li className="band h-full" style={{ background: "var(--bg)" }}>
                        <Link href={`/blog/${post.slug}/`} className="flex h-full flex-col px-7 py-8">
                          <span className="ulink mb-2 text-[1.02rem] font-semibold leading-[1.3]">
                            {post.title}
                          </span>
                          <p className="mb-4 line-clamp-3 text-[.88rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                            {post.excerpt}
                          </p>
                          <span className="mt-auto text-[.72rem] uppercase tracking-[.1em]" style={{ color: "var(--dim)" }}>
                            {formatDate(post.date)}
                          </span>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              )}

              {isUncategorised && (
                <Reveal i={2}>
                  <p className="mt-6 max-w-[62ch] text-[.85rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    CONTENT-ARCHITECTURE.md is explicit that its topical map
                    is not exhaustive. These posts do not fit any of the six
                    clusters cleanly and sit here rather than under a
                    service page they only loosely relate to.
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
