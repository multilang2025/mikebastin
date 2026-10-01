# English and Spanish review: handoff for Victoria

For: Victoria Angell-Sanchez ([viansa247](https://github.com/viansa247)), from
Mike, 1 October 2026.

**Preview:** [preview.mikebastin.com](https://preview.mikebastin.com) (English)
and [preview.mikebastin.com/es/](https://preview.mikebastin.com/es/) (Spanish).
It is hidden from Google until launch. **Launch target: 30 October 2026.**

## Why you're here

I'm rebuilding mikebastin.com, moving it from a Divi/WordPress site to a fast
static site built with Next.js. All the content lives in this repo, so there is
no WordPress and no CMS. A change is a file edit plus a pull request, and
merging it to `main` redeploys the preview automatically.

I'd love your help fine-tuning the **English and Spanish** versions before
launch, covering **design, wording, EEAT and NLP**.

## What I've done so far

- **Rebuild:** the old 43 service pages are now 20, there's a journal of the
  migrated posts plus new ones, and every legacy URL resolves or 301s with no
  redirect chains.
- **Design:** the "Night Swell / Morning Glass" sea palette with a light and
  dark theme, animated SVG heroes, a mobile menu panel and a four-column
  footer. Each post has an "On this page" outline, tables and inline diagrams.
- **Keywords:** an Ahrefs keyword map gives every commercial page one primary
  keyword. Its h1 carries that term, but no heading reads as a bare exact-match
  keyword.
- **Copy:** voice pass ("we", UK English but US spelling for optimization and
  localization), positive framing throughout, about 170 fluff sentences cut,
  Google reviews used as proof on the service pages, and statistics sourced or
  dropped.
- **Technical SEO:** metadata, Open Graph and canonicals on every page, schema
  with images, sitemaps split by locale, and the correct `html lang` per locale.
- **Spanish:** rebuilt from 30 September: homepage `/es/`, services, about,
  contact, pricing (`/es/precios/`), a lead generation hub and a blog of 32
  posts. **Every Spanish page is still a draft that no native speaker has
  reviewed.**
- **Checks:** `npm run verify` runs typecheck, the copy lints (EN, FR, ES), the
  build, and the heading, keyword, redirect and launch checks. GitHub runs the
  same checks on every pull request.

French is also in progress, but it is outside this review.

## What I'd love from you

| Area | What to look at |
|---|---|
| Design | Readability, spacing and hierarchy, mobile from 320 to 1024px, both themes, and how visible the CTAs are. Use only colours from the existing palette. |
| English wording | Does each page sell? Check for a clear value proposition, a buyer-first opening and a CTA on every section that needs one. Flag anything stiff or generic. |
| Spanish wording | Native polish. Register is **tú**. The reader is a Spanish-speaking company selling abroad. It should be an adaptation rather than a literal translation. Includes the Spanish motto line. |
| EEAT | About page and author signals, proof and case studies, sources under every statistic, and client facts that agree across pages (see Q1 to Q5 in [`OPEN-ITEMS.md`](OPEN-ITEMS.md)). |
| NLP | Entity and topic coverage on each page against its keyword in `site/lib/keywords.ts`, related terms the ranking competitors use, and the heading structure. |

**Suggested order:**

1. The English and Spanish homepages.
2. The services index and the main service pages (multilingual SEO, local SEO,
   Spanish SEO and `/es/services/optimizacion-seo/`).
3. About and contact.
4. Journal posts.

**How to hand back:** open pull requests with your edits, or send me a list of
comments. Put any question only I can answer on Slack or in
[`OPEN-ITEMS.md`](OPEN-ITEMS.md).

## House rules (the build checks most of them)

- The brand is **Mike Bastin**, never "Michael", and the voice is **"we"**
  (nosotros in Spanish).
- No em or en dashes and no ampersands ("&").
- Sentence case for every heading and title, and no sentence starts with
  "This" or "That".
- Positive framing: say what the reader gets. Avoid "not X but Y", "rather
  than", and digs at other agencies.
- Forbidden words include comprehensive, tailored, seamless, leverage, elevate,
  crafted, robust, delve, moreover, however and additionally. The Spanish lint
  has its own equivalent list.
- Facts: "over two decades" ("más de dos décadas"), never a number of years or
  a start year. Never invent a client result, testimonial, price or guarantee.
  Keep existing external links.
- Spanish only: **tú** rather than usted, paired ¿ ¡, and « » or “ ” quotes.

Read these before you start: [`../CLAUDE.md`](../CLAUDE.md),
[`STYLE-GUIDE-UK-EU.md`](STYLE-GUIDE-UK-EU.md),
[`../.claude/skills/mb-copy-voice/SKILL.md`](../.claude/skills/mb-copy-voice/SKILL.md)
and [`ES-REBUILD-PLAN.md`](ES-REBUILD-PLAN.md).

## Getting started

### 1. Install (once)

- [Git](https://git-scm.com/downloads)
- [Node.js 22 LTS](https://nodejs.org)
- An editor such as [VS Code](https://code.visualstudio.com). Claude Code also
  works well: the repo comes with agents and skills already set up.
- Accept the GitHub invite to `multilang2025/mikebastin` so you can push
  branches.

### 2. Create the local folder and run the site

Run these in a terminal (Terminal on Mac, PowerShell or Git Bash on Windows):

```bash
cd ~/Documents
git clone https://github.com/multilang2025/mikebastin.git
cd mikebastin/mb-master-revamp/site
npm ci
npm run dev
```

Then open <http://localhost:3000> for English and <http://localhost:3000/es/>
for Spanish. Pages reload as you save.

### 3. Where things live (inside `mb-master-revamp/site/`)

| What | Where |
|---|---|
| Homepage (EN / ES) | `app/page.tsx` / `app/es/page.tsx` |
| Service pages, English copy | `lib/services.ts` |
| Service pages, Spanish copy | `content/es/services/` |
| Spanish pages (about, contact, pricing, blog) | `content/es/pages/` and `lib/es-pages-data.ts` |
| Journal posts | `content/en/posts/` and `content/es/posts/` |
| Keyword map | `lib/keywords.ts` |
| Styles and design tokens | `app/globals.css` (reference design: `../design/concept-v3.html`) |

### 4. For each change

Start a branch from an up-to-date `main`:

```bash
git checkout main
git pull
git checkout -b victoria/es-homepage
```

Make your edits, then check and push them:

```bash
npm run verify
git add -A
git commit -m "ES homepage: tighten the hero and CTA"
git push -u origin victoria/es-homepage
```

Then open a pull request against `main` on GitHub. The checks run
automatically, and once I merge it the preview updates within a few minutes.
To check only the Spanish copy, run `npm run build` and then
`npm run lint:es`.

Thank you!
