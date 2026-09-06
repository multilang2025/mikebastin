import * as React from "react";

/**
 * The primary action. Primary is a filled berry pill-less rectangle, secondary
 * is a hairline outline, ghost is type only. All three resolve on .band-a and
 * .band-b without knowing which one they sit on.
 *
 * @startingPoint section="Actions" subtitle="Primary, secondary, ghost, disabled" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Fills the width of its container. Used on the narrow contact column. */
  full?: boolean;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
