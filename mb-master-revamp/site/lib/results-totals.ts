import { PROJECTS } from "@/lib/projects";

/**
 * The only results figures the site publishes (owner, 5 Oct 2026: "remove
 * per-client numbers everywhere"): totals across every site we run search
 * for. `search` and `leads` in lib/projects.ts stay as the source data, but
 * no page renders them per client; scripts/client-figures-lint.mjs fails the
 * build if one does, in any language.
 */
const toNumber = (s: string) => Number(s.replace(/,/g, ""));

const WITH_SEARCH = PROJECTS.filter((p) => p.search);
const WITH_LEADS = WITH_SEARCH.filter((p) => p.leads);

export const SITE_COUNT = WITH_SEARCH.length;
export const TOTAL_CLICKS = WITH_SEARCH.reduce((n, p) => n + toNumber(p.search!.clicks), 0);
export const TOTAL_IMPRESSIONS = WITH_SEARCH.reduce((n, p) => n + toNumber(p.search!.impressions), 0);

/** Enquiries a month across the sites, as a range because three sites give one. */
export const [LEADS_LOW, LEADS_HIGH] = WITH_LEADS.reduce(
  ([lo, hi], p) => {
    const [a, b = a] = p.leads!.count.split(" to ").map(toNumber);
    return [lo + a, hi + b];
  },
  [0, 0],
);

export const MILLIONS = TOTAL_IMPRESSIONS / 1_000_000;
