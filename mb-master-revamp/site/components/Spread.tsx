"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import type { Project } from "@/lib/projects";

export default function Spread({ d, flip }: { d: Project; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: visual drifts slower than the page, text drifts faster
  const yVisual = useTransform(
    scrollYProgress,
    [0, 1],
    still ? ["0%", "0%"] : ["-7%", "7%"],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    still ? [1, 1, 1] : [1.1, 1.02, 1.1],
  );
  const yText = useTransform(
    scrollYProgress,
    [0, 1],
    still ? ["0%", "0%"] : ["9%", "-9%"],
  );

  return (
    <article
      ref={ref}
      className="border-t py-[clamp(48px,7vw,96px)]"
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
            {d.numeral}.
          </span>
          <span className="eyebrow">{d.angle}</span>
        </div>

        <h3 className="text-[clamp(1.6rem,3.1vw,2.35rem)] font-semibold leading-[1.1]">
          <Link href={`/projects/${d.slug}/`} className="ulink">
            {d.name}
          </Link>
        </h3>
      </div>

      <div className="grid items-center gap-x-14 gap-y-8 lg:grid-cols-2">
        {/* visual */}
        <motion.div
          style={{ y: yVisual }}
          className={`relative aspect-[4/3] overflow-hidden rounded-[3px] lg:aspect-[5/4] ${
            flip ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {d.shot ? (
            <motion.img
              src={d.shot}
              alt={`The ${d.name} homepage`}
              loading="lazy"
              decoding="async"
              style={{ scale }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <>
              <motion.div
                style={{
                  scale,
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
        </motion.div>

        {/* text */}
        <motion.div
          style={{ y: yText }}
          className={flip ? "lg:order-1" : "lg:order-2"}
        >
          <p
            className="mb-6 max-w-[46ch] text-[1.02rem]"
            style={{ color: "var(--dim)" }}
          >
            {d.body}
          </p>

          <ul className="mb-7 flex flex-wrap gap-2">
            {d.services.map((sv) => (
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
            {d.metrics.map((m) => (
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

          <Link
            href={`/projects/${d.slug}/`}
            className="ulink mt-7 inline-block text-[.9rem] font-medium"
            style={{ color: "var(--berry)" }}
          >
            Read the case study
          </Link>
        </motion.div>
      </div>
    </article>
  );
}
