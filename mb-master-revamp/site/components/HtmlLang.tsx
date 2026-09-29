"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps `<html lang>` on the current page's locale during client-side
 * navigation. The exported HTML already carries the right value per page
 * (scripts/set-html-lang.mjs, postbuild); a soft navigation from /fr/ to
 * an English page keeps the same <html> element, so the attribute has to
 * follow the route here.
 */
export default function HtmlLang() {
  const pathname = usePathname() ?? "/";
  useEffect(() => {
    const lang = pathname.startsWith("/fr/") || pathname === "/fr" ? "fr" : pathname.startsWith("/es/") || pathname === "/es" ? "es" : "en";
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
