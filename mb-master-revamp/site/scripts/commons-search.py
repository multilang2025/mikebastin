#!/usr/bin/env python3
"""Search Wikimedia Commons, keeping only files that need no attribution.

How the replacements in scripts/fetch-commons-images.mjs were found.

Public domain and CC0 only. Most of Commons is CC BY or CC BY-SA, which
requires crediting the photographer wherever the photo appears, and the
owner's decision is that no picture on this site carries a credit line.
Filtering at search time rather than at selection time means a photo that
cannot be used never gets far enough to be liked.

    python3 scripts/commons-search.py "telephone switchboard operators"
"""
import json, sys, time, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
FREE = ("public domain", "cc0", "pd-", "no restrictions")

def get(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "mikebastin-site-build/1.0 (static site image sourcing)"})
    # Commons answers 429 to anything impatient, so back off rather than
    # hammer a free API on someone else's infrastructure.
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4:
                raise
            time.sleep(4 * (attempt + 1))
    raise RuntimeError("unreachable")

def search(term, limit=30):
    d = get({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"filetype:bitmap {term}", "gsrnamespace": "6",
        "gsrlimit": str(limit), "prop": "imageinfo",
        "iiprop": "url|extmetadata|size", "iiurlwidth": "900",
    })
    out = []
    for p in (d.get("query", {}).get("pages") or {}).values():
        ii = (p.get("imageinfo") or [{}])[0]
        em = ii.get("extmetadata", {})
        lic = (em.get("LicenseShortName", {}).get("value") or "").strip()
        terms = (em.get("UsageTerms", {}).get("value") or "").strip()
        blob = (lic + " " + terms).lower()
        if not any(f in blob for f in FREE):
            continue
        if "gfdl" in blob or "share" in blob or "by-sa" in blob or "cc by" in blob:
            continue
        w, h = ii.get("width", 0), ii.get("height", 0)
        if w < 1200 or h < 600:
            continue
        out.append({
            "title": p["title"], "licence": lic, "w": w, "h": h,
            "thumb": ii.get("thumburl"), "file": ii.get("url"),
            "page": ii.get("descriptionurl"),
            "artist": (em.get("Artist", {}).get("value") or "")[:120],
        })
    return out

if __name__ == "__main__":
    for n, term in enumerate(sys.argv[1:]):
        if n:
            time.sleep(4)
        res = search(term)
        print(f"\n=== {term} ({len(res)} free) ===")
        for r in res[:14]:
            print(f"  {r['licence'][:28]:30} {r['w']}x{r['h']:<6} {r['title'][5:90]}")
