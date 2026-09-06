import * as React from "react";

/** Wraps a block so it rises, deblurs and fades in once, on first sight. */
export interface RevealProps {
  /** Stagger index. Each step is 70ms. */
  i?: number;
  /** Rise distance in px. Default 26. */
  y?: number;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare function Reveal(props: RevealProps): JSX.Element;
