import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { esLanguages } from "@/lib/fr-pages";
import ResultsView, { resultsFigures } from "@/components/ResultsView";

// The Spanish results page, paired with /results/ (owner, 12 Oct 2026).
const PATH = "/es/resultados/";
const { leads, clicks } = resultsFigures("es");

export const metadata: Metadata = {
  ...pageMeta({
    title: "Resultados de clientes comprobables, Mike Bastin",
    description: `${leads} consultas al mes y ${clicks} clics de Google en tres meses en las webs de clientes que posicionamos, cada una con su caso de éxito.`,
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

export default function ResultadosPage() {
  return <ResultsView locale="es" path={PATH} />;
}
