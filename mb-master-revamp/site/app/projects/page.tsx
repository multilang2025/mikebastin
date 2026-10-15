import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { enLanguages } from "@/lib/fr-pages";
import ResultsView, { resultsFigures } from "@/components/ResultsView";

// Work and results in one page (owner, 15 Oct 2026), the parent of every
// /projects/<sector>/ case study; /fr/etudes-de-cas/ and /es/casos-de-exito/
// render the same view (components/ResultsView.tsx), which holds its history.
const PATH = "/projects/";
const { leads, clicks } = resultsFigures("en");

export const metadata: Metadata = {
  ...pageMeta({
    title: "Client work and results, Mike Bastin",
    description: `${leads} enquiries a month and ${clicks} Google clicks in three months across the client sites we run search for, each with its case study.`,
    path: PATH,
    languages: enLanguages(PATH),
  }),
};

export default function ProjectsPage() {
  return <ResultsView locale="en" path={PATH} />;
}
