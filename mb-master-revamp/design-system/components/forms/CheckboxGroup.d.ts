import * as React from "react";

/**
 * Multiple choice over named options. The /contact/ pain-point question.
 *
 * @startingPoint section="Forms" subtitle="Pick-any-that-apply, two columns" viewport="700x260"
 */
export interface CheckboxGroupProps {
  legend?: string;
  hint?: string;
  options?: Array<string | { value: string; label: string; hint?: string }>;
  value?: string[];
  onChange?: (next: string[]) => void;
  /** Grid columns. Two reads well at shell width, one on narrow. */
  columns?: number;
  error?: string;
}

export declare function CheckboxGroup(props: CheckboxGroupProps): JSX.Element;
