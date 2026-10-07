import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";

// Where public/contact.php sends a Spanish visitor when the send fails.
export const metadata: Metadata = {
  ...pageMeta({
    title: "Escríbenos un correo, Mike Bastin",
    description: "El formulario ha tenido un problema. Un correo electrónico llega exactamente al mismo sitio.",
    path: "/es/contactanos/problema/",
    fallbackImage: true,
    ogLocale: "es_ES",
  }),
  robots: { index: false, follow: true },
};

export default function SpanishProblemPage() {
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">El problema es nuestro</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Escríbenos directamente
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Un campo obligatorio ha llegado vacío, o el servidor de envío ha rechazado el mensaje. Lo más sencillo es escribirnos a{" "}
              <a href="mailto:hello@mikebastin.com" className="ulink">
                hello@mikebastin.com
              </a>
              : tu correo llega exactamente al mismo sitio.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ButtonLink href="/es/contactanos/" variant="secondary">
              Volver a probar el formulario
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <SiteFooter locale="es" />
    </main>
  );
}
