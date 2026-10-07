import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";

// Where public/contact.php sends a French visitor when the send fails.
export const metadata: Metadata = {
  ...pageMeta({
    title: "Envoyez-nous un e-mail, Mike Bastin",
    description: "Le formulaire a rencontré un souci. Un e-mail arrive exactement au même endroit.",
    path: "/fr/nous-contacter/probleme/",
    fallbackImage: true,
    ogLocale: "fr_FR",
  }),
  robots: { index: false, follow: true },
};

export default function FrenchProblemPage() {
  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Le souci vient de chez nous</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Écrivez-nous directement
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Un champ obligatoire est arrivé vide, ou le serveur d&apos;envoi a refusé le message. Le plus simple est de nous écrire à{" "}
              <a href="mailto:hello@mikebastin.com" className="ulink">
                hello@mikebastin.com
              </a>
              {" "}: votre e-mail arrive exactement au même endroit.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ButtonLink href="/fr/nous-contacter/" variant="secondary">
              Réessayer le formulaire
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <SiteFooter locale="fr" />
    </main>
  );
}
