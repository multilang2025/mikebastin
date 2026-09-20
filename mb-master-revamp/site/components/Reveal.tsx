import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** stagger index, in steps of 70ms */
  i?: number;
  y?: number;
  x?: number;
  className?: string;
};

/**
 * Scroll reveal, CSS-driven.
 *
 * The hidden state lives behind `html.mb-anim`, a class set by the pre-paint
 * script in app/layout.tsx. Static HTML therefore ships the content visible:
 * if the script never runs, if JS is off, or if a bundle fails, every page
 * still renders its text instead of a blank band. The earlier Framer Motion
 * version baked `opacity:0` into the exported HTML, so the whole site was one
 * failed request away from looking empty.
 */
export default function Reveal({ children, i = 0, y = 26, x = 0, className }: Props) {
  const style = {
    "--rd": `${(i * 0.07).toFixed(2)}s`,
    "--ry": `${y}px`,
    "--rx": `${x}px`,
  } as CSSProperties;

  return (
    <div className={className ? `reveal ${className}` : "reveal"} style={style}>
      {children}
    </div>
  );
}
