import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { enLanguages } from "@/lib/fr-pages";
import { getPostRecord } from "@/lib/posts";
import { CHECKLIST_COPY } from "@/lib/checklist-copy";
import ChecklistView, { CHECKLIST_PATH, CHECKLIST_SLUG } from "@/components/ChecklistView";

// The English checklist; the French and Spanish ones render the same view
// (components/ChecklistView.tsx), which holds the page's history.
const RECORD = getPostRecord(CHECKLIST_SLUG);
const PATH = CHECKLIST_PATH.en;

export const metadata: Metadata = {
  ...pageMeta({
    title: CHECKLIST_COPY.en.metaTitle,
    description: CHECKLIST_COPY.en.description,
    path: PATH,
    type: "article",
    languages: enLanguages(PATH),
    ...(RECORD
      ? {
          publishedTime: new Date(RECORD.date).toISOString(),
          modifiedTime: new Date(RECORD.modified ?? RECORD.date).toISOString(),
        }
      : {}),
  }),
};

export default function CompetitorChecklistPage() {
  return <ChecklistView locale="en" />;
}
