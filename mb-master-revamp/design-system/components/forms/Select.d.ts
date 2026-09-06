import * as React from "react";

/** Native select with the site's field styling and a drawn caret. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  /** Strings, or {value,label} pairs. */
  options?: Array<string | { value: string; label: string }>;
  /** Renders as a leading empty option. */
  placeholder?: string;
}

export declare function Select(props: SelectProps): JSX.Element;
