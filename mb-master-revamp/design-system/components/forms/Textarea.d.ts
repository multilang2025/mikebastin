import * as React from "react";

/** Multi-line control, vertically resizable. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Default 6. */
  rows?: number;
}

export declare function Textarea(props: TextareaProps): JSX.Element;
