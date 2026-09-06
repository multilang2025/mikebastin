import React from "react";

/**
 * Scroll reveal. Fires once, respects prefers-reduced-motion, never blocks
 * paint. The shipped component uses motion/react; this is the same 26px rise,
 * 6px deblur and 70ms stagger with an IntersectionObserver and a transition.
 */
export function Reveal({ children, i = 0, y = 26, as = "div", style, ...rest }) {
  const ref = React.useRef(null);
  const still = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [seen, setSeen] = React.useState(!!still);

  React.useEffect(() => {
    if (still || seen || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: "-12% 0px -8% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [still, seen]);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(" + y + "px)",
        filter: seen ? "blur(0px)" : "blur(6px)",
        transition: still ? "none" :
          "opacity var(--dur-reveal) var(--ease) " + (i * 70) + "ms, transform var(--dur-reveal) var(--ease) " + (i * 70) + "ms, filter var(--dur-reveal) var(--ease) " + (i * 70) + "ms",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
