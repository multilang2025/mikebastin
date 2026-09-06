import * as React from "react";

/** One checkbox with its own label, and an optional second line of detail. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  label?: React.ReactNode;
  /** Second line under the label, in --dim. */
  hint?: string;
  invalid?: boolean;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
