"use client";

import { openConsent } from "@/lib/consent";

/** The footer link that reopens the consent panel, so withdrawing is as easy as agreeing. */
export default function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" onClick={openConsent} className="ulink cursor-pointer bg-transparent p-0 text-inherit">
      {label}
    </button>
  );
}
