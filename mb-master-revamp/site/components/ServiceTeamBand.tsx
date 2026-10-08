import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * "Who does the work" on every templated service page (owner, 8 Oct 2026,
 * yes to item 6 of the 6 October list in docs/VICTORIA-LOG.md): the
 * portrait, Mike's languages, BeTranslated, our own sites and the promise
 * that Mike leads every engagement. The lead generation page carries the
 * long version of this band with the ValenciaMove chart; here it stays
 * short, and figures stay on the case studies (lint:figures).
 *
 * A service with a case study that proves it gets one extra line, linked
 * (owner, 8 Oct 2026: the GEO page points to Delaguía y Luzón).
 */
const COPY = {
  en: {
    eyebrow: "Who does the work",
    heading: "Mike Bastin and his team, working from Valencia in your buyers’ languages",
    bio:
      "Mike has worked in multilingual search for over two decades and founded BeTranslated, the translation agency he has run for twenty years, whose nine country sites each compete in their own market. He works natively in French, fluently in English, Spanish and Dutch, and well enough in German, Italian and Portuguese to run SEO projects in them.",
    ownLead: "We run our own sites the way we run yours. See how we built",
    ownTail: ", our removals site in five languages.",
    leads: "Mike leads the team on every engagement, so you deal with him from the first call to the monthly report.",
    alt: "Mike Bastin, founder, in Valencia",
  },
  fr: {
    eyebrow: "Qui fait le travail",
    heading: "Mike Bastin et son équipe, depuis Valencia, dans les langues de vos acheteurs",
    bio:
      "Mike travaille dans la recherche multilingue depuis plus de deux décennies et a fondé BeTranslated, l’agence de traduction qu’il dirige depuis plus de 20 ans, dont les neuf sites nationaux se battent chacun sur leur propre marché. Il travaille en français, sa langue maternelle, couramment en anglais, en espagnol et en néerlandais, et suffisamment en allemand, en italien et en portugais pour y piloter des projets SEO.",
    ownLead: "Nous gérons nos propres sites comme les vôtres. Voyez comment nous avons construit",
    ownTail: ", notre site de déménagement en cinq langues.",
    leads: "Mike pilote chaque mission et reste votre interlocuteur du premier appel au rapport mensuel.",
    alt: "Mike Bastin, fondateur, à Valencia",
  },
};

const PROOF: Record<string, { href: string; en: string }> = {
  "generative-engine-optimization": {
    href: "/projects/delaguia-y-luzon/",
    en: "See how a Valencia law firm gets cited in Google’s AI Overviews, AI Mode and Perplexity",
  },
};

export default function ServiceTeamBand({
  slug,
  locale,
  band,
}: {
  slug: string;
  locale: "en" | "fr";
  band: "a" | "b";
}) {
  const t = COPY[locale];
  const proof = locale === "en" ? PROOF[slug] : undefined;
  return (
    <section className={`band band-${band} py-[clamp(56px,8vw,110px)]`}>
      <div className="shell grid items-start gap-10 lg:grid-cols-[auto_1fr]">
        <Reveal>
          <img
            src="/images/mike-bastin-portrait-400.webp"
            width={400}
            height={281}
            alt={t.alt}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full max-w-[300px]"
          />
        </Reveal>
        <Reveal i={1}>
          <p className="eyebrow mb-3">{t.eyebrow}</p>
          <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{t.heading}</h2>
          <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
            {t.bio}
          </p>
          <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
            {t.ownLead}{" "}
            <Link href="/projects/valenciamove/" className="ulink">
              ValenciaMove
            </Link>
            {t.ownTail}
          </p>
          <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
            {t.leads}
          </p>
          {proof && (
            <Link href={proof.href} className="ulink mt-6 inline-block text-[1rem]">
              {proof.en}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
