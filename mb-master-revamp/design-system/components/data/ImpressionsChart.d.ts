import * as React from "react";

/**
 * Impressions per URL as horizontal bars, with position alongside.
 *
 * @startingPoint section="Ledger" subtitle="Impression bars with position column" viewport="700x420"
 */
export interface ImpressionsChartProps {
  data?: Array<{ label: string; imp: number; pos: number; moves?: boolean }>;
  /** Two entries at most. `tone` is "berry" or "silver". */
  legend?: Array<{ tone: "berry" | "silver"; label: string }>;
  /** Prose under the chart. Say what the shape means. */
  note?: string;
}

export declare function ImpressionsChart(props: ImpressionsChartProps): JSX.Element;
