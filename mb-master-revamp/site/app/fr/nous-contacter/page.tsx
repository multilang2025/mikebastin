import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select, Checkbox, describedBy } from "@/components/ui/Field";
import { getServicesForLocale } from "@/lib/services-locale";
import { frLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";
import Link from "next/link";

// French contact page at the legacy URL (docs/FR-REBUILD-PLAN.md). Same
// form, fields and endpoint as /contact/; `lang=fr` makes public/contact.php
// send the visitor to the French thank-you and problem pages. Copy is a
// draft for the owner's review (plan decision 5).
const PATH = "/fr/nous-contacter/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Nous contacter, Mike Bastin",
    description:
      "Dites-nous dans quelle langue vous voulez vendre ensuite. Quelques lignes sur votre projet SEO, de localisation ou d’IA suffisent pour recevoir une réponse claire sous un jour ouvré.",
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

const BUDGETS = [
  "Moins de 1 000 par mois",
  "De 1 000 à 2 500 par mois",
  "De 2 500 à 5 000 par mois",
  "Plus de 5 000 par mois",
  "Projet ponctuel",
  "À définir",
];

const HINT_COMPANY = "Une URL est ce qui nous aide le plus.";
const HINT_BUDGET = "Une fourchette réaliste nous permet de bien préparer le premier échange.";
const HINT_MESSAGE = "Quels marchés, quelles langues, et ce que vous avez déjà essayé.";

export default function FrenchContactPage() {
  const services = [...getServicesForLocale("fr")].sort((a, b) => a.title.localeCompare(b.title, "fr"));
  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: `${SITE_URL}/fr/` },
          { name: "Nous contacter", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Un formulaire court, une vraie réponse</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Contacter une agence SEO internationale
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Dites-nous dans quelle langue vous voulez vendre ensuite. Quelques lignes suffisent pour recevoir une réponse claire sous un jour ouvré.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Six champs, tous utiles. Nous lisons chaque message et y répondons nous-mêmes. Si une autre équipe convient mieux à votre projet, nous vous le disons et vous mettons en relation avec elle.
            </p>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="globe-europe" />
        </HeroArtSlot>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell grid gap-[clamp(40px,6vw,88px)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal>
            <form action="/contact.php" method="post" noValidate={false}>
              <input type="hidden" name="lang" value="fr" />
              <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
                <label htmlFor="company-website">Laissez ce champ vide</label>
                <input id="company-website" name="company_website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field id="name" label="Votre nom" required>
                  <Input id="name" name="name" required autoComplete="name" />
                </Field>
                <Field id="email" label="E-mail" required>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </Field>
              </div>

              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field id="company" label="Entreprise ou site" hint={HINT_COMPANY}>
                  <Input id="company" name="company" autoComplete="organization" aria-describedby={describedBy("company", HINT_COMPANY)} />
                </Field>
                <Field id="budget" label="Budget mensuel" hint={HINT_BUDGET}>
                  <Select id="budget" name="budget" defaultValue="" aria-describedby={describedBy("budget", HINT_BUDGET)}>
                    <option value="" disabled>
                      Choisissez une fourchette
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field id="service" label="Votre demande concerne">
                <Select id="service" name="service" defaultValue="">
                  <option value="" disabled>
                    Choisissez un service
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Autre chose">Autre chose</option>
                </Select>
              </Field>

              <Field id="message" label="Ce que vous voulez améliorer" required hint={HINT_MESSAGE}>
                <Textarea id="message" name="message" required rows={7} aria-describedby={describedBy("message", HINT_MESSAGE)} />
              </Field>

              <div className="mb-8">
                <Checkbox
                  name="consent"
                  value="yes"
                  required
                  label={<>Vous acceptez que nous conservions vos coordonnées uniquement pour répondre à cette demande. Plus de détails dans notre page <Link href="/fr/confidentialite/" className="ulink">confidentialité et cookies</Link>.</>}
                />
              </div>

              <Button type="submit" size="lg">
                Envoyer votre demande
              </Button>
            </form>
          </Reveal>

          <Reveal i={2}>
            <aside className="text-[.95rem]" style={{ color: "var(--dim)" }}>
              <h2 className="mb-4 text-[1.08rem] font-semibold" style={{ color: "var(--ink)" }}>
                Vous préférez l’e-mail ou le téléphone ?
              </h2>
              <p className="mb-6">Bien sûr. Le formulaire sert seulement à poser les questions que nous vous aurions posées de toute façon.</p>
              <div className="mb-8 flex flex-col gap-2">
                <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                  hello@mikebastin.com
                </a>
                <a href="tel:+34671175774" className="ulink w-fit">
                  +34 671 17 57 74
                </a>
              </div>
              <h2 className="mb-4 text-[1.08rem] font-semibold" style={{ color: "var(--ink)" }}>
                Où nous trouver
              </h2>
              <p className="mb-2">Valencia, Espagne, depuis 2016.</p>
              <p>Nous travaillons directement en français, en anglais, en espagnol et en néerlandais. L’allemand, l’italien, le portugais et les autres langues sont confiés à des rédacteurs natifs que nous vous présentons.</p>
            </aside>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="fr" />
    </main>
  );
}
