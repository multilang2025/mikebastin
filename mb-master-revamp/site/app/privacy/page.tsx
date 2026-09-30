import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import PrivacyPage from "@/components/PrivacyPage";
import { PRIVACY } from "@/lib/privacy-copy";
import { enLanguages } from "@/lib/fr-pages";

// Privacy and cookies, draft for the owner's review (docs/OPEN-ITEMS.md Q25).
const c = PRIVACY["en"];

export const metadata: Metadata = pageMeta({
  title: c.title,
  description: c.metaDescription,
  path: c.path,
  languages: enLanguages(c.path),
  ogLocale: "en_GB",
});

export default function Page() {
  return <PrivacyPage locale="en" />;
}
