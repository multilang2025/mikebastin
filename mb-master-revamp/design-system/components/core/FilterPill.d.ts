import * as React from "react";

/** Toggled filter, as used above the testimonial columns. */
export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  on?: boolean;
  children?: React.ReactNode;
}

export declare function FilterPill(props: FilterPillProps): JSX.Element;
