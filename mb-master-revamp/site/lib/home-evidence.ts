import { PROJECTS } from "@/lib/projects";

/**
 * What the homepages show straight after the hero (declaudify brief, owner,
 * 3 Oct 2026): three dated Search Console figures, then three cases chosen
 * for the multilingual positioning. Figures come from `search` in
 * lib/projects.ts, so they can never drift from the results page.
 */
const EVIDENCE_SLUGS = ["delaguia-y-luzon", "c21perdomo", "valenciamove"];

/** The three full spreads on each homepage; the rest live on /results/. */
export const CASE_SLUGS = ["delaguia-y-luzon", "c21perdomo", "betranslated"];

export const PROJECTS_EVIDENCE = EVIDENCE_SLUGS.flatMap((slug) => {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p?.search) return [];
  return [{ slug, name: p.name, clicks: p.search.clicks, period: p.search.note ?? "May to July 2026" }];
});
