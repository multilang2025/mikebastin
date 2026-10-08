import Reveal from "@/components/Reveal";

/**
 * The three engagement cards of the homepage "what we do" section, with an
 * icon, a theme line, a title and a body each. The English homepage carries
 * its own copy in app/page.tsx (PR #144, 8 Oct 2026); this component renders
 * the same design for the French and Spanish homepages (owner, 8 Oct 2026:
 * "Update FR and ES based on EN changes").
 */
export type HowCard = { theme: string; icon: "search" | "target" | "chart"; title: string; body: string };

export default function HomeHowCards({ items }: { items: HowCard[] }) {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {items.map((step, i) => (
        <Reveal key={step.title} i={i}>
          <li
            className="relative h-full overflow-hidden rounded-lg border p-6 sm:p-7"
            style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
          >
            <div
              className="mb-8 grid h-14 w-14 place-items-center rounded-full"
              style={{ color: "var(--berry)", background: "var(--berry-soft)" }}
            >
              <svg
                viewBox="0 0 32 32"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {step.icon === "search" && (
                  <>
                    <circle cx="14" cy="14" r="8" />
                    <path d="m20 20 6 6M10 14h8M14 10v8" />
                  </>
                )}
                {step.icon === "target" && (
                  <>
                    <circle cx="16" cy="16" r="11" />
                    <circle cx="16" cy="16" r="6" />
                    <circle cx="16" cy="16" r="1.5" />
                    <path d="m21 11 6-6M22 5h5v5" />
                  </>
                )}
                {step.icon === "chart" && (
                  <>
                    <path d="M5 26V7M5 26h23" />
                    <path d="m9 20 6-6 4 3 8-9" />
                    <path d="M22 8h5v5" />
                  </>
                )}
              </svg>
            </div>
            <p className="eyebrow mb-2 text-[.72rem]">{step.theme}</p>
            <h3 className="display mb-3 text-[1.25rem] font-semibold leading-[1.25]">{step.title}</h3>
            <p className="text-[.92rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              {step.body}
            </p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
