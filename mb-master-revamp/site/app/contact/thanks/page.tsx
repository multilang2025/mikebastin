import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thanks, Mike Bastin",
  description: "Your message is in. We reply ourselves, usually within a working day.",
  robots: { index: false, follow: true },
};

export default function ThanksPage() {
  return (
    <main>
      <section className="band band-a grain relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(96px,14vw,180px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Sent</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Your message is in
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p
              className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]"
              style={{ color: "var(--dim)" }}
            >
              A person reads it, not a routing rule. Expect a reply within a
              working day, and a straight answer about whether we are the right
              people for it.
            </p>
          </Reveal>
          <Reveal i={3}>
            <ButtonLink href="/" variant="secondary">
              Back to the work
            </ButtonLink>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
