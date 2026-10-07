import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";

// Where public/contact.php sends a Spanish visitor after a successful send.
export const metadata: Metadata = {
  ...pageMeta({
    title: "Gracias, Mike Bastin",
    description: "Tu mensaje ha llegado. Respondemos nosotros mismos, normalmente en un día laborable.",
    path: "/es/contactanos/gracias/",
    fallbackImage: true,
    ogLocale: "es_ES",
  }),
  robots: { index: false, follow: true },
};

export default function SpanishThanksPage() {
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Ahora nos toca a nosotros</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Tu mensaje ha llegado
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Una persona del equipo lo lee. Te respondemos normalmente en un día laborable, con una opinión sincera sobre si somos las personas adecuadas para tu proyecto.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ButtonLink href="/es/" variant="secondary">
              Volver al inicio
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <SiteFooter locale="es" />
    </main>
  );
}
