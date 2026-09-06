import * as React from "react";

/**
 * Wrapper that owns a form control's label, hint and error slot.
 *
 * @startingPoint section="Forms" subtitle="Label, hint, control, error" viewport="700x300"
 */
export interface FieldProps {
  label?: string;
  /** Must match the control's id. */
  htmlFor?: string;
  /** Sits under the control. Hidden while an error is showing. */
  hint?: string;
  /** Presence of a string puts the field in its error state. */
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export declare function Field(props: FieldProps): JSX.Element;
