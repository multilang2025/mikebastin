import * as React from "react";

/** Fixed top-right control that flips which set .band-a resolves to. */
export interface ThemeToggleProps {
  /** Starting state before the stored choice is read. Default "dark". */
  initial?: "dark" | "light";
}

export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;
