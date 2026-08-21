import * as React from "react";

/** Metadata token: a delivered service, a locale label, a folded-in slug. */
export interface ChipProps {
  tone?: "quiet" | "accent" | "outline" | "struck";
  /** Uppercase, tracked, smaller. Used for language labels and Pillar flags. */
  caps?: boolean;
  children?: React.ReactNode;
}

export declare function Chip(props: ChipProps): JSX.Element;
