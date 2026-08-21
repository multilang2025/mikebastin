import * as React from "react";

/**
 * One public review. Renders no Review or AggregateRating schema, by design.
 *
 * @startingPoint section="Portfolio" subtitle="Review card with optional translation" viewport="700x300"
 */
export interface TestimonialCardProps {
  quote: string;
  /** Full name. Rendered as first name plus last initial; never render it raw. */
  name: string;
  when: string;
  /** Short language label, e.g. "Nederlands". */
  langLabel?: string;
  lang?: string;
  /** English translation, revealed by a link under the quote. */
  english?: string;
  localGuide?: boolean;
}

export declare function TestimonialCard(props: TestimonialCardProps): JSX.Element;
