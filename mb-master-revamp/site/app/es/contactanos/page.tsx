import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select, Checkbox, describedBy } from "@/components/ui/Field";
import { getServicesForLocale } from "@/lib/services-locale";
import { esLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";

// Spanish contact page at the legacy URL (docs/ES-REBUILD-PLAN.md). Same
// form, fields and endpoint as /contact/; `lang=es` makes public/contact.php
// send the visitor to the Spanish thank-you and problem pages. Copy is a
// draft for the owner's review (plan decision 5).
const PATH = "/es/contactanos/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Contáctanos, Mike Bastin",
    description:
      "Cuéntanos en qué idioma quieres vender a continuación. Un breve resumen de tu proyecto de SEO, localización o IA recibe una respuesta clara en un día laborable.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

const BUDGETS = [
  "Menos de 1 000 al mes",
  "De 1 000 a 2 500 al mes",
  "De 2 500 a 5 000 al mes",
  "Más de 5 000 al mes",
  "Proyecto puntual",
  "Por definir",
];

const HINT_COMPANY = "Una URL es lo que más nos ayuda.";
const HINT_BUDGET = "Un rango realista nos ahorra tiempo a los dos.";
const HINT_MESSAGE = "Qué mercados, qué idiomas y qué has probado ya.";

export default function SpanishContactPage() {
  const services = [...getServicesForLocale("es")].sort((a, b) => a.title.localeCompare(b.title, "es"));
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/es/` },
          { name: "Contáctanos", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Un formulario corto, una respuesta de verdad</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Contactar con una agencia SEO internacional
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Cuéntanos en qué idioma quieres vender a continuación y un breve resumen recibe una respuesta clara en un día laborable.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Seis campos, todos útiles. Leemos cada mensaje y lo respondemos nosotros mismos, normalmente en un día laborable. Si otra persona está mejor situada para tu proyecto, te lo decimos y te ponemos en contacto con ella.
            </p>
          </Reveal>
        </div>
        <div className="hidden w-[min(360px,30vw)] lg:mt-24 lg:block">
          <DlArt name="globe" />
        </div>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell grid gap-[clamp(40px,6vw,88px)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal>
            <form action="/contact.php" method="post" noValidate={false}>
              <input type="hidden" name="lang" value="es" />
              <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
                <label htmlFor="company-website">Deja este campo vacío</label>
                <input id="company-website" name="company_website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field id="name" label="Tu nombre" required>
                  <Input id="name" name="name" required autoComplete="name" />
                </Field>
                <Field id="email" label="Correo electrónico" required>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </Field>
              </div>

              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field id="company" label="Empresa o sitio web" hint={HINT_COMPANY}>
                  <Input id="company" name="company" autoComplete="organization" aria-describedby={describedBy("company", HINT_COMPANY)} />
                </Field>
                <Field id="budget" label="Presupuesto mensual" hint={HINT_BUDGET}>
                  <Select id="budget" name="budget" defaultValue="" aria-describedby={describedBy("budget", HINT_BUDGET)}>
                    <option value="" disabled>
                      Elige un rango
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field id="service" label="Tu consulta trata sobre">
                <Select id="service" name="service" defaultValue="">
                  <option value="" disabled>
                    Elige un servicio
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Otra cosa">Otra cosa</option>
                </Select>
              </Field>

              <Field id="message" label="En qué punto estás" required hint={HINT_MESSAGE}>
                <Textarea id="message" name="message" required rows={7} aria-describedby={describedBy("message", HINT_MESSAGE)} />
              </Field>

              <div className="mb-8">
                <Checkbox
                  name="consent"
                  value="yes"
                  required
                  label={<>Aceptas que guardemos tus datos de contacto solo para responder a esta consulta.</>}
                />
              </div>

              <Button type="submit" size="lg">
                Enviar
              </Button>
            </form>
          </Reveal>

          <Reveal i={2}>
            <aside className="text-[.95rem]" style={{ color: "var(--dim)" }}>
              <h2 className="mb-4 text-[1.08rem] font-semibold" style={{ color: "var(--ink)" }}>
                Si prefieres escribirnos directamente
              </h2>
              <p className="mb-6">Por supuesto. El formulario solo sirve para hacerte las preguntas que te habríamos hecho de todos modos.</p>
              <div className="mb-8 flex flex-col gap-2">
                <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                  hello@mikebastin.com
                </a>
                <a href="tel:+34671175774" className="ulink w-fit">
                  +34 671 17 57 74
                </a>
              </div>
              <h2 className="mb-4 text-[1.08rem] font-semibold" style={{ color: "var(--ink)" }}>
                Dónde encontrarnos
              </h2>
              <p className="mb-2">Valencia, España, desde 2016.</p>
              <p>Trabajamos en español, inglés, francés y neerlandés. Para los demás idiomas contamos con redactores nativos que te presentamos.</p>
            </aside>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="es" />
    </main>
  );
}
