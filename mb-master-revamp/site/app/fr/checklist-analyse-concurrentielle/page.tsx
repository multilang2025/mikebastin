import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { frLanguages } from "@/lib/fr-pages";
import { getPostRecord } from "@/lib/posts";
import { CHECKLIST_COPY } from "@/lib/checklist-copy";
import ChecklistView, { CHECKLIST_PATH, CHECKLIST_SLUG } from "@/components/ChecklistView";

// The checklist in this language, paired with the English one (owner, 12 Oct 2026).
const RECORD = getPostRecord(CHECKLIST_SLUG);
const PATH = CHECKLIST_PATH.fr;

export const metadata: Metadata = {
  ...pageMeta({
    title: CHECKLIST_COPY.fr.metaTitle,
    description: CHECKLIST_COPY.fr.description,
    path: PATH,
    type: "article",
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
    ...(RECORD
      ? {
          publishedTime: new Date(RECORD.date).toISOString(),
          modifiedTime: new Date(RECORD.modified ?? RECORD.date).toISOString(),
        }
      : {}),
  }),
};

export default function ChecklistAnalyseConcurrentiellePage() {
  return <ChecklistView locale="fr" />;
}
