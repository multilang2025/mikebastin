import * as React from "react";

/**
 * Shows what folded into what: struck slugs collapsing into pillar pages.
 *
 * @startingPoint section="Ledger" subtitle="Cluster accordion, struck slugs to pillars" viewport="700x380"
 */
export interface ConsolidationDiagramProps {
  clusters?: Array<{
    id: string;
    numeral: string;
    title: string;
    pillars: string[];
    absorbs: string[];
  }>;
  /** Cluster id open on load. Pass null to start closed. */
  initialOpen?: string | null;
}

export declare function ConsolidationDiagram(props: ConsolidationDiagramProps): JSX.Element;
