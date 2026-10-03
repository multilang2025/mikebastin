import Link from "next/link";
import type { Project } from "@/lib/projects";
import type { ProjectCopy } from "@/lib/projects-locale";

/**
 * `copy` replaces the English strings on the FR and ES homepages. The case
 * studies exist in English only, so a localized spread links to none.
 */
export default function Spread({ d, flip, copy, numeral }: { d: Project; flip: boolean; copy?: ProjectCopy; numeral?: string }) {
  // The parallax is CSS scroll-driven animation (globals.css .spread-*),
  // so this is a server component with no JavaScript: the previous library
  // version cost a 39 kB chunk and 240 ms long tasks on phones (CWV audit,
  // 3 Oct 2026). Browsers without animation-timeline show it still.
  return (
    <article
      className="spread border-t py-[clamp(48px,7vw,96px)]"
      style={{ borderColor: "var(--rule)" }}
    >
      {/* Name first, then the screenshot directly beneath it. The heading runs
          full width above the two columns rather than sitting inside the prose
          column, so the shot is under the client's name at every width instead
          of merely beside it. */}
      <div className="mb-8">
        <div className="mb-3 flex items-baseline gap-4">
          <span
            className="display text-[1.3rem] font-medium tabular-nums"
            style={{ color: "var(--berry)" }}
          >
            {numeral ?? d.numeral}.
          </span>
          <span className="eyebrow">{copy?.angle ?? d.angle}</span>
        </div>

        <h3 className="text-[clamp(1.6rem,3.1vw,2.35rem)] font-semibold leading-[1.1]">
          {copy ? (
            d.name
          ) : (
            <Link href={`/projects/${d.slug}/`} className="ulink">
              {d.name}
            </Link>
          )}
        </h3>
      </div>

      <div className="grid items-center gap-x-14 gap-y-8 lg:grid-cols-2">
        {/* visual */}
        <div
          className={`spread-visual relative aspect-[5/4] overflow-hidden rounded-[3px] ${
            flip ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {d.shot ? (
            <img
              src={d.shot}
              /* An 800px copy (written next to each file) serves phones and
                 the half-width desktop column; the 1600px original covers
                 high-density screens. */
              srcSet={`${d.shot.replace(".webp", "-800.webp")} 800w, ${d.shot} 1600w`}
              sizes="(min-width: 1024px) 560px, 100vw"
              width={1600}
              height={1280}
              alt={copy?.alt ?? `The ${d.name} website on desktop and mobile`}
              loading="lazy"
              decoding="async"
              data-spread-scale
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <>
              <div
                data-spread-scale
                style={{
                  background: `linear-gradient(135deg,
                  color-mix(in oklab, var(--deep) 88%, black) 0%,
                  var(--deep) 42%,
                  color-mix(in oklab, var(--berry) 40%, var(--deep)) 100%)`,
                }}
                className="absolute inset-0"
              />
              <div
                className="absolute inset-0 opacity-[.18]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg, transparent 0 26px, rgb(255 255 255 / .55) 26px 27px)",
                }}
              />
              <div className="absolute inset-0 grid place-items-center px-6">
                <span
                  className="display text-center text-[clamp(1.15rem,2.2vw,1.75rem)] font-semibold tracking-tight"
                  style={{
                    color: "#F5EFE2",
                    textShadow: "0 2px 24px rgb(0 0 0 / .4)",
                  }}
                >
                  {d.domain}
                </span>
              </div>
            </>
          )}
          <div
            className="absolute inset-0"
            style={{ boxShadow: "inset 0 0 90px rgb(0 0 0 / .35)" }}
          />
        </div>

        {/* text */}
        <div
          data-spread-text
          className={flip ? "lg:order-1" : "lg:order-2"}
        >
          <p
            className="mb-6 max-w-[46ch] text-[1.02rem]"
            style={{ color: "var(--dim)" }}
          >
            {copy?.body ?? d.body}
          </p>

          <ul className="mb-7 flex flex-wrap gap-2">
            {(copy?.services ?? d.services).map((sv) => (
              <li
                key={sv}
                className="rounded-full px-3 py-[5px] text-[.74rem]"
                style={{ background: "var(--chip)", color: "var(--dim)" }}
              >
                {sv}
              </li>
            ))}
          </ul>

          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {(copy?.metrics ?? d.metrics).map((m) => (
              <div key={m.k}>
                <dt
                  className="display text-[1.5rem] font-semibold leading-none tabular-nums"
                  style={{ color: "var(--berry)" }}
                >
                  {m.v}
                </dt>
                <dd
                  className="mt-1.5 text-[.72rem] uppercase tracking-[.11em]"
                  style={{ color: "var(--dim)" }}
                >
                  {m.k}
                </dd>
              </div>
            ))}
          </dl>

          {!copy && (
            <Link
              href={`/projects/${d.slug}/`}
              className="ulink mt-7 inline-block text-[.9rem] font-medium"
              style={{ color: "var(--berry)" }}
            >
              Read the case study
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
