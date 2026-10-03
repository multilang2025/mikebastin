"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { decodeLocaleGroups } from "@/lib/locale-href";

/**
 * The language-switch data (which page in another language pairs with this
 * one), provided once by the root layout as compact translation groups
 * (lib/locale-href.ts) and indexed once in the browser. The header switcher
 * and the footer language row both read it.
 */
const Ctx = createContext<Map<string, string[]>>(new Map());

export function LocaleDataProvider({ groups, children }: { groups: string; children: ReactNode }) {
  const index = useMemo(() => decodeLocaleGroups(groups), [groups]);
  return <Ctx.Provider value={index}>{children}</Ctx.Provider>;
}

export const useLocaleData = () => useContext(Ctx);
