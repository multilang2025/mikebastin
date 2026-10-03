"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * The two motion helpers the site needs, without the motion/react library
 * (CWV audit, 3 Oct 2026: its 39 kB chunk ran 240 ms long tasks on phones
 * for a count-up, a fade and a parallax). Both are plain browser APIs.
 */

/** True once the element has entered the viewport (with `margin`), then stays true. */
export function useInView(ref: RefObject<Element | null>, margin = "0px"): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen]);
  return seen;
}

/** The visitor's reduced-motion setting, live. False on the server. */
export function useReducedMotion(): boolean {
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(mq.matches);
    const on = () => setStill(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return still;
}
