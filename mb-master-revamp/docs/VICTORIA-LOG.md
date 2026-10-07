# Discussion log: Mike and Víctoria

A running log of what Mike and Víctoria need to discuss, what was decided, and
where each service page stands. Newest entries at the top. Anyone working on
the site (Víctoria, Mike or Claude) adds to it; nothing is deleted, settled
items are marked **Decided** with the date and who decided.

How to use it:
- **To discuss** items are open questions. Bring them to the next catch-up.
- When one is settled, move it under **Decided**, with the answer and the date.
- The page tracker at the bottom shows which service pages have been rewritten
  to the "service, not tutorial" standard and who signed them off.

---

## 7 October 2026

### Decided (Mike's answers to the 6 October questions)
1. **BeTranslated runs ten country domains**: .com, .us, .ca, .co.uk, .be,
   .fr, .es, .de, .nl and .it (checked against the betranslated.com footer,
   7 Oct). Neither six nor twelve. Fixed on the case study, the homepage
   cards (EN, FR, ES), lead generation, international SEO and five posts.
   The harvested legacy texts in `content/en/services/`, `content/en/pages/`
   and two unbuilt FR and ES service files still say twelve; they are not
   published.
2. **ValenciaMove brings in over 50 leads a month** (Mike). Shown as 50+, and
   the enquiry total is now 310 to 420 a month. Mike also sent a Search
   Console screenshot: 17,400 clicks and 1.63 million impressions from April to
   October 2026, now on the ValenciaMove case study and the lead generation
   page.
3. **Clients deal with Mike as team leader** (Mike). The lead generation page
   says so.
4. **FR and ES wait for the English to be approved and locked** (Mike).
5. **No "who does the work" band on the template pages for now** (Mike:
   "maybe another bespoke section later").
6. **Bemelman Spuiterij traffic evolution** (Mike sent the 16-month Search
   Console screenshot): 5,320 clicks and 448,000 impressions, daily clicks
   roughly tripled from early 2026. Shown on the Bemelman case study only. An
   exception to the no-per-client-figures rule, for the sites Mike names.

7. **Flags animation for BeTranslated** (Mike asked): the ten domains as flags
   around a .com globe, drawn once when scrolled into view, on the BeTranslated
   case study with a linked list of the sites (`components/CountryFlags.tsx`).
8. **Matosurf traffic** (Mike sent the screenshot): a six-month-old site with
   1,008 Google clicks in its last three months, now on its case study.
9. **Delaguía y Luzón AI citations and Ahrefs overview** (Mike sent both
   screenshots): 309 AI responses from 87 pages (182 AI Overviews, 92 AI Mode,
   14 Perplexity, 6 Gemini, 2 ChatGPT) and 928 organic keywords with 200 in
   the top three, DR 33, on its case study. Idea for Víctoria: the GEO service
   page could link to this case study as its proof.

---

## 6 October 2026

### Context
Mike asked for the lead generation page to be rewritten because it read "like a
boring tutorial". It was rebuilt around Mike, the agency and the real enquiry
totals (PR #138). Three more key pages were then rewritten the same way as
worked examples for Víctoria: international SEO (`multilingual-seo`), French
SEO and translation services. Víctoria takes the method from
[`HANDOFF-VICTORIA.md`](HANDOFF-VICTORIA.md) and carries it through the rest.

### To discuss
1. **BeTranslated: six or twelve domains?** The BeTranslated case study and the
   lead generation page say six regional sites (.com, .be, .fr, .es, .co.uk,
   .nl). The international SEO page, the about page and two legacy service
   texts say twelve country-specific domains. One of them is wrong. Which
   number is right, and which TLDs are the other six?
2. **ValenciaMove "sends us enquiries every month".** True on the evidence (25
   form enquiries in July 2026), but the dashboard only starts on 1 July.
   Happy with "every month"?
3. **"What we recommend to you is what already works with our own budget."**
   Is this a line Mike will stand behind? It is the strongest sentence on the
   lead generation page and nothing in the repo confirms it word for word.
4. **Who talks to the client?** The rewrite deliberately avoids saying "you
   deal with Mike directly", because the reviews say "Mike and his team". Does
   Mike want that promise on the service pages, or not?
5. **French and Spanish lead generation pages.** The English one changed; the
   FR and ES versions still carry the old structure. The standing rule is that
   FR and ES follow once EN is approved and locked (Mike, 22 Sep 2026), so they
   wait unless Mike says otherwise. Confirm.
6. **A "who does the work" band on every service page.** The lead generation
   page has one (portrait, BeTranslated, languages, own sites). The other 19
   service pages are built from a shared template that has no such band and no
   testimonials. Add it to the template (one change, every page gets it)?
7. **Satisfaction bar.** What does "done" look like for Mike on a service
   page? Suggested test in the handoff: read only the h2 and h3 list aloud;
   every line should name something the client gets or something we do.

### Decided
- Service pages describe the service, never teach the discipline (Mike, 4 Oct
  2026). Rule in `docs/STYLE-GUIDE-UK-EU.md` section 10.
- No per-client results figures anywhere; totals only (Mike, 5 Oct 2026).

---

## Page tracker

| Page | Status | Rewritten by | Signed off by Mike |
|---|---|---|---|
| `/services/lead-generation/` | Rewritten, PR #138 | Claude | Pending |
| `/services/multilingual-seo/` | Rewritten, worked example | Claude | Pending |
| `/services/french-seo/` | Rewritten, worked example | Claude | Pending |
| `/services/translation-services/` | Rewritten, worked example | Claude | Pending |
| `/services/german-seo/` | To do, priority 1 | Víctoria | |
| `/services/spanish-seo/` | To do, priority 1 | Víctoria | |
| `/services/dutch-seo/` | To do, priority 1 | Víctoria | |
| `/services/italian-seo/` | To do, priority 2 | Víctoria | |
| `/services/portuguese-seo/` | To do, priority 2 | Víctoria | |
| `/services/multilingual-sem/` | To do, priority 2 | Víctoria | |
| `/services/generative-engine-optimization/` | Check only | Víctoria | |
| `/services/conversion-tracking/` | Check only | Víctoria | |
| `/services/technical-seo/` | Check only (rewritten 4 Oct) | Víctoria | |
| `/services/local-seo/` | Check only | Víctoria | |
| `/services/website-localisation/` | Check only | Víctoria | |
| `/services/app-and-software-localisation/` | Check only | Víctoria | |
| `/services/ai-consulting/` | Check only | Víctoria | |
| `/services/ai-translation-and-post-editing/` | Check only | Víctoria | |
| `/services/content-marketing/` | Check only | Víctoria | |
| `/services/multilingual-content/` | Check only | Víctoria | |
