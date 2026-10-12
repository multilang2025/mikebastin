import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { frLanguages } from "@/lib/fr-pages";
import ResultsView, { resultsFigures } from "@/components/ResultsView";

// The French results page, paired with /results/ (owner, 12 Oct 2026).
const PATH = "/fr/resultats/";
const { leads, clicks } = resultsFigures("fr");

export const metadata: Metadata = {
  ...pageMeta({
    title: "Résultats clients vérifiables, Mike Bastin",
    description: `${leads} demandes par mois et ${clicks} clics Google en trois mois sur les sites clients que nous référençons, chacun avec son étude de cas.`,
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

export default function ResultatsPage() {
  return <ResultsView locale="fr" path={PATH} />;
}
