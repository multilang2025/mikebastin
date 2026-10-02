# French and Spanish copy pass

Owner request, 2 October 2026: "Do a FR and ES copywriting fix,
naturalness and fact checking". The same method as the English pass
(`docs/COPY-PASS-EN.md`): wording and framing change, facts are checked
against the owner facts in `CLAUDE.md`, `lib/projects.ts` and live
sources, and a figure that cannot be traced to a primary source is cut
rather than given a plausible citation. Every page is still a draft for
the owner's review.

## Scope

- **French**: 18 service pages, the hand-built routes (homepage, services
  index, contact and its status pages, tarifs, notre-equipe, lead
  generation hub, privacy) and 27 of 28 posts.
- **Spanish**: 17 service pages, the hand-built routes and all 32 posts.
- The French and Spanish strings in the nav and footer.

`content/fr/pages/` and `content/es/pages/` were left alone: no route renders
them (the hand-built `app/fr` and `app/es` pages replaced them), and they
still carry legacy prices.

## What changed everywhere

- **One call to action**: "Réserver une consultation gratuite" and
  "Reserva una consulta gratuita", matching the English "Book a free
  consultation", in the nav, footer, hubs, service pages and posts. The
  first process step is the free consultation in both languages.
- **Naturalness**: calques and anglicisms rewritten ("faire vendre une
  langue", "pipeline", "boucler la boucle", "tracción", "hacemos
  escribir"); French typography (espaces insécables, guillemets);
  Spanish number format (38.476).
- **The English fixes carried across**: payment methods no longer claimed
  as a ranking factor; the Italian hero no longer quotes Ahrefs
  difficulty; German, Italian and Portuguese level reads "enough to
  manage SEO projects"; link building framed by what earned links give;
  the law firm in four languages.
- **Contact**: the language line matches English (French, English,
  Spanish and Dutch directly; the rest through named native writers).
  The Spanish lead generation hub sent readers to the English form and
  said the form was in English; it now points at `/es/contactanos/`.
- **"Forty thousand impressions, six clicks"** is this site's own Search
  Console (`components/ImpressionsChart.tsx`), not a client's. The EN, FR
  and ES lead generation pages said "one client"; all three now say it was
  our own site.
- **Valencia** in French, rather than "Valence", which reads as the town in
  the Drôme.

## Facts corrected (with sources in the posts)

Zero-click searches (SparkToro and Datos, 58,5 % US, 59,7 % EU); CSA
Research 2020 (76 % prefer their own language, 40 % never buy in
another); SEO market size by 2031, not 2030 (Mordor Intelligence); the
GEO paper (30 to 40 %); Previsible's AI traffic figure scoped to January
to May 2025 across 19 sites; AI Overview citations from the top ten at 38 %
(Ahrefs, March 2026); click-through figures credited to Seer Interactive,
not BrightEdge; AI referrals up 357 % credited to Similarweb, not Ahrefs;
StatCounter device and search-engine shares updated to September 2026;
Instituto Cervantes speaker figures; .es domain count; tool prices
re-checked on 2 October 2026; Google product dates (FAQ rich results
retired 7 May 2026, Gemini replacing Assistant on Android from
4 September 2026, Alexa+ in France 26 May 2026, all spot-checked); the DES
trade fair is in Málaga, not Madrid; Brazil's population is "over 213
million" (IBGE 2025), not 215 million speakers. Search Console
geotargeting, withdrawn by Google in 2022, is gone from the EN, FR and ES
advice.

## Cut

Figures with no primary source or a source that says otherwise (70 % long
tail, 14,6 %, 62 % mobile, 8,5 billion searches a day, Perplexity 45
million users, several BrightLocal, Similarweb and Semrush figures, the
IBM "100 times" claim, "70 % of searches are non-English"); invented
prices; client outcomes and markets with no record (Caribbean, bakery,
Smartown, "Texas Freight", Maghreb, Latin America, Switzerland, Canada);
two tools that could not be confirmed to exist; an association ("AERR")
that could not be found. Links behind cut figures stay as reading
references, with one exception below.

## For the owner

1. **Overlapping Spanish posts** compete for the same searches:
   `analisis-competitivo-seo` with `analisis-de-la-competencia-seo` (301
   the first into the second); `localizacion-de-contenido-web-multilingue`
   with `optimizar-contenido-web-multilingue` (merge and 301);
   `optimizacion-para-sistemas-de-ia` is thin beside the other GEO posts;
   `futuro-del-seo`, `ia-y-estrategias-seo` and `seo-multilingue-2026`
   all target "SEO in 2026 with AI".
2. **Off-topic posts**: `/fr/visa-nomade-numerique-espagne/` (expat visa
   guide, unverified income thresholds) belongs on valenciamove.com;
   `/fr/nouvelles-tendances-du-secteur-des-affaires/` is generic business
   news; `/es/optimizar-perfil-de-empresa-de-google/` is built around a
   yoga studio.
3. **BeTranslated's domain count**: `lib/projects.ts` says six regional
   sites; `lib/services.ts` and some posts say twelve. Which is right?
4. **Contact email**: `/fr/agence-seo-internationale/` links
   `mike@mikebastin.com`; the site uses `hello@`.
5. **The 87 % ChatGPT and Bing overlap** (Seer, February 2025) is disputed
   by a replication study: keep or cut?
6. **The ibm.com link** was removed with the debunked claim it was cited
   for, the one exception to the keep-every-link rule.
7. **French number format**: the style guide says 1.000,50 for France,
   but French typography writes 38 476 with a space. The pass kept the
   space; the style guide should probably say so.
8. **Bemelman's town** (Q3) is still open; `lib/projects.ts` names
   Noordwijkerhout in its `body`.
