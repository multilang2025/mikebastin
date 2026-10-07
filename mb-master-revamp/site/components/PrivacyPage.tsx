import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import { PRIVACY } from "@/lib/privacy-copy";
import type { Locale } from "@/lib/posts";

/** The privacy and cookies page, one per locale (lib/privacy-copy.ts). */
export default function PrivacyPage({ locale }: { locale: Locale }) {
  const c = PRIVACY[locale];
  return (
    <main id="main">
      {locale !== "en" && <LocaleHtmlLang lang={locale} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: c.home, url: `${SITE_URL}${c.homeHref}` },
          { name: c.title, url: `${SITE_URL}${c.path}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">{c.eyebrow}</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">{c.title}</h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              {c.subhead}
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {c.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <div className="max-w-[68ch]">
            {c.sections.map((s) => (
              <div key={s.h} className="mb-10">
                <h2 className="mb-3 text-[1.35rem] font-semibold leading-[1.25]">{s.h}</h2>
                {s.p?.map((p) => (
                  <p key={p} className="mb-3 leading-[1.65]">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mb-3 list-disc pl-5 leading-[1.65]">
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
                {s.table && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-left text-[.92rem]">
                      <thead>
                        <tr>
                          {s.table.head.map((h) => (
                            <th key={h} className="border-b py-2 pr-4 font-semibold" style={{ borderColor: "var(--rule)" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((r) => (
                          <tr key={r[0]}>
                            {r.map((cell, i) => (
                              <td key={cell} className="border-b py-2 pr-4 align-top" style={{ borderColor: "var(--rule)", color: i === 0 ? "var(--ink)" : "var(--dim)" }}>
                                {i === 0 ? <code>{cell}</code> : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {s.settings && (
                  <p className="mt-2">
                    <CookieSettingsLink label={c.settingsButton} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} band="a" />
    </main>
  );
}
