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

### Handoff for Víctoria: the 7 October deploy, and what to double check

Written by Claude for Mike, 7 Oct 2026. There are two deploys to preview.mikebastin.com
today. **Deploy 1** (commit `351a69c`, finished green) carries everything under "What
shipped". **Deploy 2** follows the same day and carries the changes under "Second
deploy". Check each "Deploy preview" run is green in the GitHub Actions tab before you
start; a half-uploaded preview shows a mix of old and new pages, and an upload takes
about 20 minutes. A new push to `main` cancels a deploy still running, so the second
one restarts the clock.

**What shipped**
- **Your PRs.** #134 (English homepage), #137 (services page) and #135 (Spanish
  homepage) are all merged. #135 needed its shared files reconciled with `main`;
  your translated review quotes with the "view original" toggle are kept and now
  also use the review length cut-off.
- **French and Spanish homepages follow the English design and wording.** Both now
  have the hero with the reviews link, evidence, "what we do" with the three steps,
  the bespoke markets section, the bespoke five-step list ("Comment nous
  travaillons" and "Cómo trabajamos", restored in Spanish), "Why it works" with the
  market diagram, reviews, BASTIN and the credibility strip. The shared FR and ES
  sections are `components/HomeWhy.tsx` and `components/HomeBastin.tsx`.
- **Services page.** Seventeen service ledes rewritten to sell (none opens on "You"
  or "Your"), the Search intro and the four other group intros as paragraphs, the
  "Our core service" badge, your FAQ with the timeline said as "in our experience".
- **English homepage.** Strip now reads 10 "BeTranslated country sites"; the reviews
  line is "Reviews in Dutch, Spanish, French and English."
- **Every page heading** has a thin blinking text caret before its first letter
  (Mike's option A). It stills under reduced motion. It is one rule in `globals.css`
  (`main h1::before`).
- **Reviews** over 200 characters are cut at a word and the ellipsis shows the rest
  as a tooltip on hover, focus or touch (`components/ReviewText.tsx`).
- **No client's own figures anywhere.** `npm run lint:figures` fails the build if
  a page prints one. Totals only.

**Please double check (in this order)**
1. **French homepage, all of it.** Every new French line is Claude's draft: the
   hero reviews link, the three steps, "Pourquoi cela fonctionne" and its three
   points, BASTIN, the credibility labels, the diagram labels. Read it as a
   French-speaking exporter would. Check the formal register (vous), the spaces
   before `: ; ? !`, and that nothing reads as translated.
2. **Spanish homepage, the parts you did not write.** The restored "Cómo
   trabajamos", "Por qué funciona", BASTIN, the credibility labels ("Sitios
   nacionales de BeTranslated") and the diagram labels are Claude's. Check the
   "tú" register and naturalness.
3. **Every page in light and dark, on a phone width (360px) and a laptop.** Look for
   two bands of the same colour touching, a caret that jumps or overlaps the first
   letter, the BASTIN arrow (its text column is narrow at 360px), the hero portrait
   bubble, and the diagram.
4. **Reviews.** Hover and tap the pink "…". On the Spanish page, check it still
   works together with your translation toggle.
5. **Services page.** Read the 17 new ledes and the five group intros for tone, and
   check each against the service page it sits on: the card text is also the first
   line of that page, so a claim that does not match the page below it is a bug.
6. **Facts.** "Nearly fifteen years" with TX International Freight (Mike's words),
   ten BeTranslated domains, and "Projects in the line-up: 8", which Mike has not
   yet answered.

**Second deploy (Mike's later instructions, same day)**
- **Every journal post opens on an H2** (Mike's hard rule). Claude added one opening H2
  to 145 posts: 32 English, 56 French, 57 Spanish. A new check, `npm run lint:h2`, fails
  the build for any post that opens on a paragraph, list, table or H3 (a picture the post
  opens on does not count). A new post must be written with its H2 first.
- **Bullets and numbers show again** in posts and on service pages. They had been hidden by
  the style reset.
- **A table's first column keeps its word whole** ("Switzerland" was breaking into
  "Switzerl / and").
- **Compact hero on every page**: less space above and below, and on desktop a post's
  title sits on the left with its picture on the right, so more is visible before scrolling.
- **No star-review link in the homepage heroes** (EN, FR, ES): reviews sit further down.

**Please double check for the second deploy**
1. **The 145 new headings, in French and Spanish especially.** They were drafted by agents
   from each post's opening, not by a native writer. Skim the first heading of every post
   on `/fr/blog/` and `/es/blog/`: does it read naturally, say what the opening covers, and
   keep the formal "vous" or the "tú"? Rewrite any that are clumsy; keep the H2 first.
2. **English headings** the same way: specific, sentence case, not repeating the title.
3. **One post that is off topic** and flagged before: `visa-nomade-numerique-espagne` (French).
   Mike has not decided whether it moves to valenciamove.com.
4. **Look at a few posts on a laptop and a phone**: the title and picture side by side on
   desktop, a table with a long first word, a list with bullets, and a post that opens on
   its own picture (the heading comes after it).
5. **A few other pages' heroes** (services, contact, results, a service page) for crowding.
   The padding is now the same on 36 pages and may be tight on some.

**Not checked by Claude**
- The French and Spanish pages were built and linted, not looked at in a browser.
- Core Web Vitals were not re-measured after the new sections (the BASTIN arrow
  listens to scroll). Worth a quick mobile run.
- Reduced-motion behaviour of the caret and the diagram.

**Still open for you**
- **PR #140 (French SEO page)** conflicts with `main`. Merge `main` into your branch,
  apply Mike's six answers (in Slack and in `OPEN-ITEMS.md` Q33), and check your text
  against the new service ledes.
- **Interview Mike** for Q21, Q27 and the backlog (Q5, Q7, Q9, Q10, Q12, Q15 to Q18),
  and write his answers into `OPEN-ITEMS.md`.
- English stays open (Q20). French and Spanish lead generation keep the old structure
  until it is approved.

**How to preview before you push.** `git pull`, then in `mb-master-revamp/site`:
`npm ci`, `npm run build`, serve the `out/` folder (for example
`python -m http.server 4173` from inside it). Run `npm run verify` before every push;
it is the gate. If a French or Spanish string fails `lint:code`, words like "même",
"deuxième" and "utilise" are the usual cause (English first-person and forbidden-word
checks); reword them.

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

### To discuss
1. **PR #140, French SEO page: six questions from Víctoria** (opened 7 Oct 2026; **answered by Mike, 7 Oct**: 30 minutes, no French-specific review, leave out the 21,421 impressions, the Matosurf line is accurate, name Canada, the Dutch and German line is ours to word). Consultation length (20 or 30 minutes), a French-specific review or client result, quoting the page's 21,421 impressions over 450 days, whether the Matosurf line is still accurate, whether to name Canada, and the wording of the Dutch and German visitor line. Full text in the PR description; tracked as Q33 in `OPEN-ITEMS.md`.
2. **From 6 October:** the "own budget" sentence on the lead generation page is being reworded into a checkable claim (Mike, 7 Oct). Still open: the satisfaction bar for a signed-off service page (item 7).
3. **Mike's interview.** Mike asked Víctoria to interview him for the open assets and older decisions (Q21, Q27, Q5, Q7, Q9, Q10, Q12, Q15 to Q18 in `OPEN-ITEMS.md`) and to write his answers into that log.

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
