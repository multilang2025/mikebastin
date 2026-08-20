import Reveal from "@/components/Reveal";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/services/lead-generation/", label: "Services" },
  { href: "/results/", label: "Results" },
];

/**
 * The one shared footer, replacing the identical contact block that used
 * to be copy-pasted into every page.tsx. Every page gets the same
 * navigation and the same way to get in touch, in one place.
 */
export default function SiteFooter({
  credits = false,
  address = false,
}: {
  credits?: boolean;
  address?: boolean;
}) {
  return (
    <footer id="contact" className="band band-a py-[clamp(64px,9vw,120px)]">
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-4">Clean face, no crowd</p>
          <h2 className="mb-8 max-w-[15ch] text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.08]">
            Tell me which language is losing you money.
          </h2>
          <div className="flex flex-col gap-2 text-[1.05rem]">
            <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
              hello@mikebastin.com
            </a>
            <a href="tel:+34671175774" className="ulink w-fit">
              +34 671 17 57 74
            </a>
            {address && (
              <span style={{ color: "var(--dim)" }}>
                Calle Rugat 12 to 2, 46021 Valencia, Spain
              </span>
            )}
          </div>
        </Reveal>

        <Reveal i={1}>
          <nav
            className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t pt-6 text-[.88rem]"
            style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="ulink">
                {l.label}
              </a>
            ))}
          </nav>
        </Reveal>

        {credits && (
          <Reveal i={2}>
            <p
              className="mt-8 border-t pt-6 text-[.82rem]"
              style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
            >
              Mike Bastin. Built with Next.js, Motion and Lenis. Night Swell and
              Morning Glass, set in Fraunces, Cormorant Garamond and Inter.
            </p>
          </Reveal>
        )}
      </div>
    </footer>
  );
}
