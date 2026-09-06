import * as React from "react";

/** A single number that counts up on first sight. */
export interface CounterProps {
  to: number;
  /** Appended raw, e.g. "+1" or " h/day". */
  suffix?: string;
  /** Milliseconds. Default 1600. */
  duration?: number;
  /** Number formatting locale. Default "en-GB". */
  locale?: string;
}

export declare function Counter(props: CounterProps): JSX.Element;
