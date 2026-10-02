import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";

// Where public/contact.php sends a French visitor after a successful send.
export const metadata: Metadata = {
  ...pageMeta({
    title: "Merci, Mike Bastin",
    description: "Votre message est bien arrivé. Nous répondons nous-mêmes, en général sous un jour ouvré.",
    path: "/fr/nous-contacter/merci/",
    fallbackImage: true,
    ogLocale: "fr_FR",
  }),
  robots: { index: false, follow: true },
};

export default function FrenchThanksPage() {
  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(96px,14vw,180px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">À nous de jouer</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Votre message est bien arrivé
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Une personne de l’équipe le lit. Vous recevrez une réponse sous un jour ouvré, avec un avis franc pour savoir si nous sommes les bons interlocuteurs pour votre projet.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ButtonLink href="/fr/" variant="secondary">
              Retour à l&apos;accueil
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <SiteFooter locale="fr" />
    </main>
  );
}
