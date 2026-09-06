import * as React from "react";

/** Single-line control. 4px radius, --shade fill, hairline --rule border. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Berry border and aria-invalid. Drive it from the Field's error. */
  invalid?: boolean;
}

export declare function Input(props: InputProps): JSX.Element;
