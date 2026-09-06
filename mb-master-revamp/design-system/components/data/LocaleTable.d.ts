import * as React from "react";

/**
 * Content counts per locale, with the one mismatch flagged in berry.
 *
 * @startingPoint section="Ledger" subtitle="Per-locale counts, hairline rules" viewport="700x260"
 */
export interface LocaleTableProps {
  rows?: Array<{ type: string; en: number; fr: number; es: number; note: string }>;
  headers?: string[];
  /** Which cell reads as the anomaly. Set to null for none. */
  odd?: { type: string; locale: "en" | "fr" | "es" } | null;
}

export declare function LocaleTable(props: LocaleTableProps): JSX.Element;
