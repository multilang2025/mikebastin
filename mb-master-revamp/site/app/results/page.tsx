import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import { LEADS_PERIOD, PROJECTS } from "@/lib/projects";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

// Owner, 2 Oct 2026: the page used to show this site's own rebuild (its own
// Search Console and its own 43-to-19 service merge) under a heading that
// promised client engagements. It now carries the sites we run search for,
// as totals from the live Search Console figures (lib/projects.ts, May to July
// 2026), with a plain-language result per client and no client's own numbers. Owned
// properties are labelled as ours rather than passed off as clients.
const OWNED = new Set(["valenciamove", "betranslated", "matosurf"]);

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

function toNumber(s: string) {
  return Number(s.replace(/,/g, ""));
}

// Owner, 5 Oct 2026: show the results achieved, not each client's own figures.
// The page keeps the totals across all the sites (they name no one client) and
// gives each row a plain-language result, drawn from the case study's own
// outcome. Per-client numbers stay out of the rows, in the page order of the
// portfolio rather than ranked by clicks, which would leak the same thing.
const WITH_SEARCH = PROJECTS.filter((p) => p.search);

const RESULT: Record<string, string> = {
  "delaguia-y-luzon":
    "Four languages and two jurisdictions held to a legal accuracy bar, with enquiries arriving through the site's own forms.",
  c21perdomo:
    "Four languages kept accurate against inventory that changes every week, with enquiries arriving through the listings site.",
  valenciamove:
    "Five languages live, every page written from first-hand experience of the move, and enquiries counted from the first month.",
  "tx-international-freight":
    "Present in the local pack for industrial freight search in Houston, with quote requests counted from the site's forms.",
  "bemelman-spuiterij":
    "Dutch local search built for a business that had traded on reputation alone for forty-five years, with requests now arriving by form, phone and email.",
};

const TOTAL_CLICKS = WITH_SEARCH.reduce((n, p) => n + toNumber(p.search!.clicks), 0);
const TOTAL_IMPRESSIONS = WITH_SEARCH.reduce((n, p) => n + toNumber(p.search!.impressions), 0);
const CLICKS = TOTAL_CLICKS.toLocaleString("en-GB");
// Enquiries come first, as a monthly average (owner, 3 Oct 2026), counted on
// the sites that keep a form record (lib/projects.ts).
const WITH_LEADS = WITH_SEARCH.filter((p) => p.leads);
const [LEADS_LOW, LEADS_HIGH] = WITH_LEADS.reduce(
  ([lo, hi], p) => {
    const [a, b = a] = p.leads!.count.split(" to ").map(toNumber);
    return [lo + a, hi + b];
  },
  [0, 0],
);
const LEADS =
  LEADS_LOW === LEADS_HIGH
    ? LEADS_LOW.toLocaleString("en-GB")
    : `${LEADS_LOW.toLocaleString("en-GB")} to ${LEADS_HIGH.toLocaleString("en-GB")}`;
const MILLIONS = (TOTAL_IMPRESSIONS / 1_000_000).toFixed(1);
const SITE_COUNT = WORDS[WITH_SEARCH.length] ?? String(WITH_SEARCH.length);

export const metadata: Metadata = {
  ...pageMeta({
    title: "Client results you can count, Mike Bastin",
    description: `${LEADS} enquiries a month and ${CLICKS} Google clicks in three months across the client sites we run search for, each with its case study.`,
    path: "/results/",
  }),
};

export default function ResultsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Results", url: `${SITE_URL}/results/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Results you can count</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Client results and numbers
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-8 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Live search figures from the sites we run, each one linked to the case study that explains the work behind it.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <Link href="/contact/" className="btn btn-primary btn-lg">
              Book a free consultation
            </Link>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="clock" />
        </HeroArtSlot>
        </div>
      </section>

      {/* ============ THE FIGURES ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Monthly enquiries and three months of search</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              {LEADS} enquiries a month and {CLICKS} clicks from Google.
            </h2>
            <p className="mb-4 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Across {SITE_COUNT} sites we run search for, from a Valencia law
              firm working in four languages to a Dutch powder coating
              specialist, with {MILLIONS} million impressions behind the
              clicks. Open any row for the brief, the work and the outcome.
            </p>
            <blockquote className="mb-12 max-w-[56ch] text-[.85rem]" style={{ color: "var(--dim)" }}>
              Sources: enquiries are a monthly average for {LEADS_PERIOD},
              from the sites that keep a record of their contact and quote
              forms, counted from those records. A count is form submissions
              only; where a site’s forms post outside it or its requests also
              arrive by phone and email, the site owner’s own figure or range
              stands instead. Clicks and
              impressions cover the same three months, from Google Search
              Console.
            </blockquote>
          </Reveal>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--rule)" }}>
            {WITH_SEARCH.map((p, i) => (
              <Reveal key={p.slug} i={i}>
                <Link
                  href={`/projects/${p.slug}/`}
                  className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:items-baseline"
                  style={{ borderBottom: "1px solid var(--rule)" }}
                >
                  <span className="flex flex-col gap-1">
                    <span className="display text-[1.15rem] font-semibold transition-colors duration-300 group-hover:text-[var(--berry)]">
                      {p.name}
                    </span>
                    <span className="text-[.88rem]" style={{ color: "var(--dim)" }}>
                      {p.angle}
                      {OWNED.has(p.slug) ? ", our own site" : ""}
                    </span>
                  </span>
                  <span className="text-[1rem] leading-[1.5]">{RESULT[p.slug] ?? p.outcome}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Clients review us in their own language.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Every one is public on the linked Google Business Profile,
              where it can be checked against the source.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter band="b" />
    </main>
  );
}
