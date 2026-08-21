import * as React from "react";

/** Credibility-strip cell. Four of them in a hairline grid reads best. */
export interface StatCellProps {
  /** Counts up to this. Ignored when `value` is set. */
  to?: number;
  suffix?: string;
  /** A figure that is not a plain number, e.g. "1,132" or "Houston". */
  value?: React.ReactNode;
  label: string;
}

export declare function StatCell(props: StatCellProps): JSX.Element;
