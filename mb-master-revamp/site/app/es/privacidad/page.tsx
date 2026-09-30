import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import PrivacyPage from "@/components/PrivacyPage";
import { PRIVACY } from "@/lib/privacy-copy";
import { esLanguages } from "@/lib/fr-pages";

// Privacy and cookies, draft for the owner's review (docs/OPEN-ITEMS.md Q25).
const c = PRIVACY["es"];

export const metadata: Metadata = pageMeta({
  title: c.title,
  description: c.metaDescription,
  path: c.path,
  languages: esLanguages(c.path),
  ogLocale: "es_ES",
});

export default function Page() {
  return <PrivacyPage locale="es" />;
}
