import Reveal from "@/components/Reveal";
import MarketFlowGraphic from "@/components/MarketFlowGraphic";
import { HOME_GRAPHICS } from "@/lib/home-graphics";

/**
 * "Why it works", with the market diagram, for the French and Spanish
 * homepages (owner, 7 Oct 2026: replicate the English design and wording on
 * FR and ES). The English page keeps its own copy of the same section in
 * app/page.tsx; the wording here is its adaptation, not a literal rendering.
 */
const T = {
  fr: {
    eyebrow: "Pourquoi cela fonctionne",
    heading: "Une seule personne lit chaque langue de vos acheteurs.",
    items: [
      {
        title: "Un seul stratège pour toutes vos langues",
        body: "La personne qui pilote votre référencement en espagnol lit aussi vos pages en allemand et en néerlandais : chaque marché suit un plan unique, et les résultats se comparent à armes égales.",
      },
      {
        title: "Des textes écrits par des natifs du marché",
        body: "Les pages commerciales de chaque langue sont écrites par un locuteur natif, avec les prix, les signaux de confiance et les habitudes de recherche de ce marché.",
      },
      {
        title: "Des demandes comptées langue par langue",
        body: "Vous voyez quel marché rapporte, et le budget suit les faits.",
      },
    ],
  },
  es: {
    eyebrow: "Por qué funciona",
    heading: "La misma persona lee cada idioma de tus compradores.",
    items: [
      {
        title: "Un solo estratega para todos tus idiomas",
        body: "La persona que planifica tu SEO en francés también lee tus páginas en alemán y neerlandés, así que cada mercado sigue un único plan y los resultados se comparan en igualdad de condiciones.",
      },
      {
        title: "Textos escritos por nativos del mercado",
        body: "Las páginas comerciales de cada idioma las escribe un hablante nativo, con los precios, las señales de confianza y los hábitos de búsqueda de ese mercado.",
      },
      {
        title: "Consultas contadas por idioma",
        body: "Ves qué mercado da resultados, y el presupuesto sigue a las pruebas.",
      },
    ],
  },
} as const;

export default function HomeWhy({ locale, band }: { locale: "fr" | "es"; band: "a" | "b" }) {
  const t = T[locale];
  const withGraphic = HOME_GRAPHICS.marketFlow;
  return (
    <section className={`band band-${band} py-[clamp(64px,9vw,128px)]`}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-3">{t.eyebrow}</p>
          <h2 className="mb-12 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
            {t.heading}
          </h2>
        </Reveal>
        <div className={`grid items-center gap-12${withGraphic ? " lg:grid-cols-[1fr_1fr]" : ""}`}>
          <div className="grid max-w-[56ch] gap-8">
            {t.items.map((w, i) => (
              <Reveal key={w.title} i={i}>
                <p className="display mb-2 text-[1.08rem] font-semibold leading-[1.25]">{w.title}</p>
                <p className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                  {w.body}
                </p>
              </Reveal>
            ))}
          </div>
          {withGraphic && (
            <Reveal i={1}>
              <MarketFlowGraphic locale={locale} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
