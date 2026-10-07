import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Send your message by email, Mike Bastin",
    description: "The form hit a snag on our side. Email reaches exactly the same place, so your message still gets to us.",
    path: "/contact/problem/",
    fallbackImage: true,
  }),
  robots: { index: false, follow: true },
};

export default function ProblemPage() {
  return (
    <main>
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">The fix is on our side</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Send your message by email
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p
              className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]"
              style={{ color: "var(--dim)" }}
            >
              The form hit a snag: either a required field came through empty
              or the mail relay held it. The quickest route is to email us
              directly at{" "}
              <a href="mailto:hello@mikebastin.com" className="ulink">
                hello@mikebastin.com
              </a>{" "}
              and it reaches exactly the same place.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ButtonLink href="/contact/" variant="secondary">
              Try the form again
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
