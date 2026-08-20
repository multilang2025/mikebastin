import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { SERVICES, getService } from "@/lib/services";
import SiteFooter from "@/components/SiteFooter";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name}, Mike Bastin`,
    description: service.lede,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">{service.angle}</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              {service.name}
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[60ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {service.lede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ DEMAND ============ */}
      <section className="band band-b py-[clamp(48px,7vw,90px)]">
        <div className="shell">
          <div
            className="grid gap-px"
            style={{
              background: "var(--rule)",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            {service.demandMetrics.map((m, i) => (
              <div key={m.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
                <Reveal i={i}>
                  <div className="display text-[clamp(2.1rem,4.4vw,3.1rem)] font-semibold leading-none" style={{ color: "var(--berry)" }}>
                    {m.v}
                  </div>
                  <div className="mt-3 text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--dim)" }}>
                    {m.k}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Where the demand actually sits</p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {service.demandNote}
            </p>
          </Reveal>
        </div>
      </section>

      {service.relationshipNote && (
        <section className="band band-b py-[clamp(56px,8vw,110px)]">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">Relationship, not acquisition</p>
              <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {service.relationshipNote}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ CONTACT ============ */}
      <SiteFooter />
    </main>
  );
}
