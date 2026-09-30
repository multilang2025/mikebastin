"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale, LocaleSlugs } from "@/lib/posts";

/**
 * The language-switch data (which page in another language pairs with this
 * one), provided once by the root layout. The header switcher and the
 * footer language row both read it, so the manifest is sent to the browser
 * once rather than once per consumer.
 */
export type LocaleData = {
  localeManifest: Record<string, LocaleSlugs>;
  pagePairs: Record<string, Partial<Record<Locale, string>>>;
};

const Ctx = createContext<LocaleData>({ localeManifest: {}, pagePairs: {} });

export function LocaleDataProvider({ value, children }: { value: LocaleData; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLocaleData = () => useContext(Ctx);
