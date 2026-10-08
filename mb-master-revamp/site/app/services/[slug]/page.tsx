import { pageMeta } from "@/lib/meta";
import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ServicePageView from "@/components/ServicePageView";
import { absorbedProse } from "@/lib/absorbed";
import { SERVICES, getService, CLUSTER_INLINE } from "@/lib/services";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { serviceGroupForEnSlug, serviceHreflang } from "@/lib/services-locale";

// lead-generation has its own hand-built route at app/services/lead-generation/,
// with the testimonial wall this template does not carry. Excluded here so the
// two do not both try to emit the same static path.
export function generateStaticParams() {
  return SERVICES.filter((s) => s.slug !== "lead-generation").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const title = service.metaTitle ?? `${service.name}, Mike Bastin`;
  const description = service.metaDescription ?? service.lede;
  // FR/ES siblings only exist for the 10 of these 21 EN service slugs that
  // have a qualifying `type: "service"` group in content-map.json (see
  // lib/services-locale.ts's file header); the rest are consolidated
  // pages with nothing to link to, so this stays undefined for them.
  const group = serviceGroupForEnSlug(service.slug);
  const languages = group ? serviceHreflang(group) : undefined;
  return pageMeta({
    title,
    description,
    path: `/services/${service.slug}/`,
    languages,
    cardAlt: `${service.cardTitle ?? service.name}. ${ogSubtitle(service.subhead)}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const siblings = SERVICES.filter(
    (s) => s.cluster === service.cluster && s.slug !== service.slug
  );
  const url = `${SITE_URL}/services/${service.slug}/`;

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name,
            description: service.metaDescription ?? service.lede,
            url,
          }),
          breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Services", url: `${SITE_URL}/services/` },
            { name: service.name, url },
          ]),
        ]}
      />
      <ServicePageView
        service={service}
        absorbed={service.absorbs && service.absorbs.length > 0 ? absorbedProse(service.slug) : []}
        siblings={siblings.map((s) => ({ href: `/services/${s.slug}/`, name: s.name }))}
        siblingsEyebrow={`Also in ${CLUSTER_INLINE[service.cluster] ?? service.cluster}`}
      />
    </main>
  );
}
