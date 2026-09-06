import React from "react";

/** Counts up once, in view, easeOutExpo. Settles rather than stops. */
export function Counter({ to, suffix = "", duration = 1600, locale = "en-GB" }) {
  const ref = React.useRef(null);
  const still = typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = React.useState(still ? to : 0);

  React.useEffect(() => {
    if (still || !ref.current) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setN(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { rootMargin: "-15%" });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration, still]);

  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{n.toLocaleString(locale)}{suffix}</span>;
}
