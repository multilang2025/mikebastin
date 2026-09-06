import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The message did not send, Mike Bastin",
  description: "The form did not go through. Email reaches exactly the same place.",
  robots: { index: false, follow: true },
};

export default function ProblemPage() {
  return (
    <main>
      <section className="band band-a grain relative overflow-hidden pb-[clamp(64px,9vw,120px)] pt-[clamp(96px,14vw,180px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Our fault, not yours</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              The message did not send
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p
              className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]"
              style={{ color: "var(--dim)" }}
            >
              Either a required field came through empty or the mail relay
              refused it. Rather than make you guess which, email us directly at{" "}
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
