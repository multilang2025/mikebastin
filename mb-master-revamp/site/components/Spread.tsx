"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export type SpreadData = {
  numeral: string;
  name: string;
  domain: string;
  angle: string;
  body: string;
  metrics: { v: string; k: string }[];
};

export default function Spread({ d, flip }: { d: SpreadData; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: visual drifts slower than the page, text drifts faster
  const yVisual = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["-7%", "7%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], still ? [1, 1, 1] : [1.1, 1.02, 1.1]);
  const yText = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["9%", "-9%"]);

  return (
    <article
      ref={ref}
      className="grid items-center gap-x-14 gap-y-8 border-t py-[clamp(48px,7vw,96px)] lg:grid-cols-2"
      style={{ borderColor: "var(--rule)" }}
    >
      {/* visual */}
      <motion.div
        style={{ y: yVisual, order: flip ? 2 : 1 }}
        className="relative aspect-[4/3] overflow-hidden rounded-[3px] lg:aspect-[5/4]"
      >
        <motion.div
          style={{
            scale,
            background: `linear-gradient(135deg,
              color-mix(in oklab, var(--deep) 88%, black) 0%,
              var(--deep) 42%,
              color-mix(in oklab, var(--gold) 34%, var(--deep)) 100%)`,
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
            style={{ color: "#F5EFE2", textShadow: "0 2px 24px rgb(0 0 0 / .4)" }}
          >
            {d.domain}
          </span>
        </div>
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 90px rgb(0 0 0 / .35)" }}
        />
      </motion.div>

      {/* text */}
      <motion.div style={{ y: yText, order: flip ? 1 : 2 }}>
        <div className="mb-3 flex items-baseline gap-4">
          <span className="display text-[1.3rem] font-medium tabular-nums" style={{ color: "var(--gold)" }}>
            {d.numeral}.
          </span>
          <span className="eyebrow">{d.angle}</span>
        </div>

        <h3 className="mb-4 text-[clamp(1.6rem,3.1vw,2.35rem)] font-semibold leading-[1.1]">
          {d.name}
        </h3>

        <p className="mb-6 max-w-[46ch] text-[1.02rem]" style={{ color: "var(--dim)" }}>
          {d.body}
        </p>

        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {d.metrics.map((m) => (
            <div key={m.k}>
              <dt
                className="display text-[1.5rem] font-semibold leading-none tabular-nums"
                style={{ color: "var(--gold)" }}
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
      </motion.div>
    </article>
  );
}
