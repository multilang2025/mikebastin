import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

/**
 * The 404, served by `ErrorDocument 404 /404.html` (public/.htaccess).
 *
 * Until now there was no file here at all, so Next's own default rendered:
 * the nav, a bare "page could not be found" line, and nothing else. No
 * footer, no way onward, and an opening word the copy rules forbid, which
 * copy-lint-code duly flagged when that default was quoted here verbatim.
 *
 * A 404 is the one page where a visitor is definitionally lost, so it is
 * the page that most needs the footer's navigation rather than the least.
 *
 * Deliberately not indexed. A soft 404 in the index is worse than none,
 * and every legacy URL that matters already has a 301 in the .htaccess
 * blocks above the ErrorDocument line.
 */
export const metadata: Metadata = {
  title: "Page not found, Mike Bastin",
  robots: { index: false, follow: true },
};

const ELSEWHERE = [
  { href: "/services/", label: "Services", note: "Multilingual SEO, localisation and AI consulting" },
  { href: "/blog/", label: "Journal", note: "Writing by subject, with a landing page per topic" },
  { href: "/results/", label: "Results", note: "What the numbers did" },
  { href: "/contact/", label: "Contact", note: "Tell us which language you want selling next" },
];

export default function NotFound() {
  return (
    <main id="main">
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,90px)] pt-[clamp(88px,13vw,150px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">Error 404</p>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">
              We could not find that page
            </h1>
            <p className="max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              The address may have changed, or the page may have moved. Our
              Valencia writing now lives on valenciamove.com, and those URLs
              redirect on their own, so a link that lands here is more likely
              a typo than a retirement.
            </p>
          </Reveal>

          <Reveal i={1}>
            <ul
              className="mt-10 grid gap-px sm:grid-cols-2"
              style={{ background: "var(--rule)" }}
            >
              {ELSEWHERE.map((l) => (
                <li key={l.href} className="band" style={{ background: "var(--bg)" }}>
                  <Link href={l.href} className="block px-7 py-6">
                    <span className="ulink text-[1.02rem] font-semibold">{l.label}</span>
                    <p className="mt-1 text-[.88rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                      {l.note}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <SiteFooter band="b" />
    </main>
  );
}
