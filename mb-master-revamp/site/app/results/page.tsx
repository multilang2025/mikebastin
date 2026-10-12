import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { enLanguages } from "@/lib/fr-pages";
import ResultsView, { resultsFigures } from "@/components/ResultsView";

// The English results page; /fr/resultats/ and /es/resultados/ render the
// same view (components/ResultsView.tsx), which holds the page's history.
const PATH = "/results/";
const { leads, clicks } = resultsFigures("en");

export const metadata: Metadata = {
  ...pageMeta({
    title: "Client results you can count, Mike Bastin",
    description: `${leads} enquiries a month and ${clicks} Google clicks in three months across the client sites we run search for, each with its case study.`,
    path: PATH,
    languages: enLanguages(PATH),
  }),
};

export default function ResultsPage() {
  return <ResultsView locale="en" path={PATH} />;
}
