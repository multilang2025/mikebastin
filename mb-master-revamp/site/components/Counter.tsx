"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A number that counts up when it scrolls into view.
 *
 * The final value is the initial state, which is the whole point of the
 * 21 September 2026 rewrite. Starting at zero meant the static export
 * shipped `0 Years in search` in the HTML, and the real 25 only ever
 * existed after React hydrated and the strip scrolled into view. Anything
 * reading the page without running JS, which includes some crawlers, some
 * previews and any reader with scripts blocked, met a consultancy
 * advertising no experience at all, directly beside "3+1 languages
 * spoken". The build is `output: "export"`, so that HTML is what ships.
 *
 * The zero is therefore introduced by the client, and only while the
 * counter is safely off screen where nobody can watch it drop. A counter
 * already visible at hydration keeps its number instead of jumping
 * backwards to animate: the reader has already read it, and re-running it
 * as a flourish would just look like a glitch.
 */
export default function Counter({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const still = useReducedMotion();
  const [n, setN] = useState(to);

  // idle -> armed happens off screen; armed -> done runs the animation.
  // Reduced motion never leaves idle, so the number simply stays put.
  const phase = useRef<"idle" | "armed" | "done">("idle");

  useEffect(() => {
    if (phase.current !== "idle" || still) return;
    if (inView) {
      phase.current = "done";
      return;
    }
    phase.current = "armed";
    setN(0);
  }, [inView, still]);

  useEffect(() => {
    if (!inView || phase.current !== "armed") return;
    phase.current = "done";

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo, settles rather than stops
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {n.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}
