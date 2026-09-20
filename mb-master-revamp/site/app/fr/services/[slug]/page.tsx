import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getServicesForLocale, getServiceForLocale, serviceHreflang } from "@/lib/services-locale";
import { postMetaTitle } from "@/lib/seo";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";

const LOCALE = "fr" as const;

// The 11 FR service pages qualifying for a live page per
// redirects/content-map.json (`type: "service"`, `action: "migrate"`,
// `destination: "mdx"`, an `fr` entry). At /fr/services/<slug>/, matching
// each file's own sourceUrl frontmatter and the pre-existing WordPress
// URL structure.
export function generateStaticParams() {
  return getServicesForLocale(LOCALE).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceForLocale(LOCALE, slug);
  if (!service) return {};
  const languages = serviceHreflang(service.group);
  return {
    title: postMetaTitle(service.title),
    description: service.excerpt,
    ...(languages ? { alternates: { languages } } : {}),
  };
}

export default async function FrenchServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceForLocale(LOCALE, slug);
  if (!service) notFound();

  const url = `${SITE_URL}/fr/services/${service.slug}/`;

  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={[
          serviceSchema({
            name: service.title,
            description: service.excerpt,
            url,
          }),
          breadcrumbSchema([
            { name: "Accueil", url: `${SITE_URL}/` },
            { name: service.title, url },
          ]),
        ]}
      />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,84px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <h1 className="mb-6 max-w-[26ch] text-[clamp(2rem,4.8vw,3.4rem)] font-semibold leading-[1.1]">
              {service.title}
            </h1>
          </Reveal>
          <Reveal i={1}>
            <p className="max-w-[62ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {service.excerpt}
            </p>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6">
              <Link href="/" className="ulink text-[.9rem]" style={{ color: "var(--dim)" }}>
                Mike Bastin
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="band band-b py-[clamp(48px,7vw,90px)]">
        <div className="shell">
          <Reveal>
            <div
              className="post-body max-w-[68ch] text-[1.05rem] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: service.html }}
            />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
