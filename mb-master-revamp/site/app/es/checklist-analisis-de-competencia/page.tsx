import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { esLanguages } from "@/lib/fr-pages";
import { getPostRecord } from "@/lib/posts";
import { CHECKLIST_COPY } from "@/lib/checklist-copy";
import ChecklistView, { CHECKLIST_PATH, CHECKLIST_SLUG } from "@/components/ChecklistView";

// The checklist in this language, paired with the English one (owner, 12 Oct 2026).
const RECORD = getPostRecord(CHECKLIST_SLUG);
const PATH = CHECKLIST_PATH.es;

export const metadata: Metadata = {
  ...pageMeta({
    title: CHECKLIST_COPY.es.metaTitle,
    description: CHECKLIST_COPY.es.description,
    path: PATH,
    type: "article",
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
    ...(RECORD
      ? {
          publishedTime: new Date(RECORD.date).toISOString(),
          modifiedTime: new Date(RECORD.modified ?? RECORD.date).toISOString(),
        }
      : {}),
  }),
};

export default function ChecklistAnalisisCompetenciaPage() {
  return <ChecklistView locale="es" />;
}
