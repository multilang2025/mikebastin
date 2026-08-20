"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** stagger index, in steps of 70ms */
  i?: number;
  y?: number;
  className?: string;
};

/** Scroll reveal. Fires once, respects reduced motion, never blocks paint. */
export default function Reveal({ children, i = 0, y = 26, className }: Props) {
  const still = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{
        duration: 0.85,
        delay: i * 0.07,
        ease: [0.22, 0.7, 0.28, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
