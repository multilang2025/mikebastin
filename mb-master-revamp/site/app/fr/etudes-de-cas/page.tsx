import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { frLanguages } from "@/lib/fr-pages";
import ResultsView, { resultsFigures } from "@/components/ResultsView";

// Études de cas et résultats, paired with /projects/ (owner, 15 Oct 2026).
const PATH = "/fr/etudes-de-cas/";
const { leads, clicks } = resultsFigures("fr");

export const metadata: Metadata = {
  ...pageMeta({
    title: "Études de cas et résultats clients, Mike Bastin",
    description: `${leads} demandes par mois et ${clicks} clics Google en trois mois sur les sites clients que nous référençons, chacun avec son étude de cas.`,
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

export default function EtudesDeCasPage() {
  return <ResultsView locale="fr" path={PATH} />;
}
