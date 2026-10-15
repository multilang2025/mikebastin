import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { esLanguages } from "@/lib/fr-pages";
import ResultsView, { resultsFigures } from "@/components/ResultsView";

// Casos de éxito y resultados, paired with /projects/ (owner, 15 Oct 2026).
const PATH = "/es/casos-de-exito/";
const { leads, clicks } = resultsFigures("es");

export const metadata: Metadata = {
  ...pageMeta({
    title: "Casos de éxito y resultados de clientes, Mike Bastin",
    description: `${leads} consultas al mes y ${clicks} clics de Google en tres meses en las webs de clientes que posicionamos, cada una con su caso de éxito.`,
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

export default function CasosDeExitoPage() {
  return <ResultsView locale="es" path={PATH} />;
}
