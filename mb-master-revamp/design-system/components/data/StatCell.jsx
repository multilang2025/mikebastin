import React from "react";
import { Counter } from "./Counter.jsx";

/** One cell of the credibility strip: big berry figure over a caps label. */
export function StatCell({ to, suffix = "", label, value }) {
  return (
    <div className="band" style={{ background: "var(--bg)", padding: "36px 24px" }}>
      <div className="display" style={{ color: "var(--berry)", fontSize: "clamp(2.1rem,4.4vw,3.1rem)", fontWeight: 600, lineHeight: 1 }}>
        {value !== undefined ? value : <Counter to={to} suffix={suffix} />}
      </div>
      <div className="caps" style={{ marginTop: 12 }}>{label}</div>
    </div>
  );
}
