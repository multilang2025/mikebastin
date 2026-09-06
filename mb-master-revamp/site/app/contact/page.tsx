import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select, Checkbox, describedBy } from "@/components/ui/Field";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contact, Mike Bastin",
  description:
    "Tell us which language is losing you money. A short brief gets a straight answer, usually within a working day.",
};

/**
 * The form posts to a PHP endpoint rather than a Server Action, because
 * the site is `output: "export"` and a static export has no server to run
 * one in. Same shape valenciamove.com already uses on the same host: a
 * flat .php file shipped alongside the export, doing its own validation.
 * See public/contact.php.
 */
const ENDPOINT = "/contact.php";

const BUDGETS = [
  "Under 1,000 a month",
  "1,000 to 2,500 a month",
  "2,500 to 5,000 a month",
  "Over 5,000 a month",
  "One-off project",
  "Not sure yet",
];

export default function ContactPage() {
  return (
    <main>
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">No form-filling theatre</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Tell us which language is losing you money
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p
              className="max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]"
              style={{ color: "var(--dim)" }}
            >
              Six fields, none of them optional theatre. We read every one and
              reply ourselves, usually within a working day. If we are the wrong
              people for the job we will say so and point you at who is not.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell grid gap-[clamp(40px,6vw,88px)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal>
            <form action={ENDPOINT} method="post" noValidate={false}>
              {/* Bots fill every field they can see. A honeypot the browser
                  hides and the endpoint rejects catches the cheap ones
                  without putting a puzzle in front of a real person. */}
              <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
                <label htmlFor="company-website">Leave this field empty</label>
                <input id="company-website" name="company_website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field id="name" label="Your name" required>
                  <Input id="name" name="name" required autoComplete="name" />
                </Field>
                <Field id="email" label="Email" required>
                  <Input id="email" name="email" type="email" required autoComplete="email" />
                </Field>
              </div>

              <div className="grid gap-x-6 sm:grid-cols-2">
                <Field id="company" label="Company or site" hint="A URL is the most useful thing here.">
                  <Input
                    id="company"
                    name="company"
                    autoComplete="organization"
                    aria-describedby={describedBy("company", "A URL is the most useful thing here.")}
                  />
                </Field>
                <Field id="budget" label="Monthly budget" hint="An honest range saves us both a call.">
                  <Select
                    id="budget"
                    name="budget"
                    defaultValue=""
                    aria-describedby={describedBy("budget", "An honest range saves us both a call.")}
                  >
                    <option value="" disabled>
                      Choose a range
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field id="service" label="What is this about">
                <Select id="service" name="service" defaultValue="">
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Something else">Something else</option>
                </Select>
              </Field>

              <Field
                id="message"
                label="What is going wrong"
                required
                hint="Which markets, which languages, and what you have already tried."
              >
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  aria-describedby={describedBy(
                    "message",
                    "Which markets, which languages, and what you have already tried.",
                  )}
                />
              </Field>

              <div className="mb-8">
                <Checkbox
                  name="consent"
                  value="yes"
                  required
                  label={
                    <>
                      We can keep your details on file to answer this enquiry.
                      Nothing else, and no list.
                    </>
                  }
                />
              </div>

              <Button type="submit" size="lg">
                Send it
              </Button>
            </form>
          </Reveal>

          <Reveal i={1}>
            <aside className="text-[.95rem]" style={{ color: "var(--dim)" }}>
              <h2 className="mb-4 text-[1.08rem] font-semibold" style={{ color: "var(--ink)" }}>
                Rather just email
              </h2>
              <p className="mb-6">
                Entirely reasonable. The form only exists so we ask the questions
                we would have asked anyway.
              </p>
              <div className="mb-8 flex flex-col gap-2">
                <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                  hello@mikebastin.com
                </a>
                <a href="tel:+34671175774" className="ulink w-fit">
                  +34 671 17 57 74
                </a>
              </div>
              <h2 className="mb-4 text-[1.08rem] font-semibold" style={{ color: "var(--ink)" }}>
                Where we are
              </h2>
              <p className="mb-2">Valencia, Spain, since 2016.</p>
              <p>
                We work in English, French and Spanish, and read Italian.
                Everything else goes through native writers we name.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <SiteFooter address />
    </main>
  );
}
