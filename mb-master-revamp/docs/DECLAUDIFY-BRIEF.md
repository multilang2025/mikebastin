# Mike Bastin: website declaudification brief

**Website:** https://preview.mikebastin.com/

**Date:** 3 October 2026

**Agreed positioning:** Mike Bastin leads a multilingual agency. His personal presence provides accountability; the team provides language expertise and delivery capacity.

**Review scope:** Current HTML and CSS from the homepage, Services, Results and Contact. Rendered desktop and mobile layouts could not be verified because the visual browser timed out. Recommendations about appearance should be checked in the rendered site before implementation is signed off.

## Direction

Make the agency recognisable through Mike, its specialists and its actual work. Lead with the offer and client evidence, then explain the delivery model.

Keep the navy, teal and raspberry identity, the real project imagery and the international SEO focus. Reduce the combination of abstract animation, shimmering text, repeated large statements and predictable section alternation.

## Priority changes

| Priority | Area | Action |
|---|---|---|
| P1 | Hero | Replace the animated radar artwork with Mike's existing portrait. State the agency offer clearly and identify Mike as the person leading the work. |
| P1 | Client evidence | Move three selected cases directly below the hero or a short proof strip. Delaguía y Luzón, Century 21 Perdomo and BeTranslated are relevant candidates for the multilingual positioning. Link to the complete portfolio instead of displaying all eight full cases on the homepage. |
| P1 | Decorative effects | Remove looping headline shimmer, the breathing background glow and spinning radar graphics. Reduce repeated blur-and-slide scroll reveals. Keep restrained hover feedback and, if useful, a short entrance animation. |
| P2 | Section rhythm and themes | Use one dominant background. Reserve a contrasting section for a featured case or the closing invitation. In dark mode, use predominantly dark surfaces instead of simply swapping cream and navy bands. |
| P2 | Typography | Limit the visual system to two font families. Keep one distinctive serif for selected prominent headings; use the sans serif for body copy, interface labels and supporting information. Reduce repeated oversized statements and italic emphasis. |
| P2 | Agency voice | Use “we” for the team's services and “I” in Mike's founder story or personal commentary. Explain who leads strategy, who handles native content and how results are reported. Replace repeated market/language/enquiry claims with concrete project examples. |
| P2 | Testimonials and BASTIN | Show two relevant testimonials on the homepage with attribution and a source link. Keep the full collection on Results. Present BASTIN as a compact signature beside the founder story. Explain ambiguous language counts and prioritise client outcomes over activity counts. |
| P2 | Services and contact | Replace broad national buying stereotypes with actual keyword, terminology or localization examples. Change the primary CTA to “Discuss your project” while it leads to a brief form. Use booking language when an actual scheduling flow exists. Remove redundant contact invitations from the Contact page. |

## Portrait to reuse

- **Original:** https://mikebastin.com/wp-content/uploads/2024/09/Mike_home-1.png
- **Companion file:** `mike-bastin-legacy-portrait.png`
- **Verified properties:** 769 × 959 pixels, PNG, transparent background. WordPress media metadata identifies this as the full-size image.
- **Suggested placement:** Right of the hero copy on desktop. After the main value proposition and CTA on mobile.
- **Suggested desktop width:** Approximately 320–380 CSS pixels, preserving proportions.
- **Treatment:** Place the cutout directly on a simple brand background. Keep Mike's face clear and use generous surrounding space. Avoid animated halos, floating badges and heavy decorative shadows.
- **Caption:** “Mike Bastin, agency lead · Valencia.”
- **Alt text:** “Mike Bastin, leader of our multilingual SEO and localization agency.”

This existing portrait makes a new photo shoot unnecessary for the first implementation pass. It shows Mike standing with his hands on his hips, so it should support the agency introduction rather than be presented as a photograph of a client meeting.

## Proposed hero copy

**H1:** International SEO agency, led by Mike Bastin

**Supporting copy:** We help companies attract customers across languages through international SEO, native content and website localization. Mike leads the strategy, with native specialists handling the language and market details. Our reporting separates performance by country and language.

**Primary CTA:** Discuss your project

**Secondary CTA:** See client results

Support this with a short agency introduction naming the specialists involved and their roles. Mike's portrait establishes personal accountability; team information explains how the agency delivers.

## Colour direction

| Role | Current colour | Recommendation |
|---|---|---|
| Main ink | Navy `#0F2837` | Keep. |
| Secondary brand colour | Teal `#1C6580` | Keep for selected details and supporting information. |
| Primary accent | Raspberry `#C42640` | Keep for primary actions and restrained emphasis. |
| Light background | Cream `#F5F0E4` | Test cooler `#F6F7F8` as the main canvas, retaining cream selectively if it adds character. |
| Dark background | Deep navy `#0A1B28` | Keep as the dominant dark canvas, with subtly differentiated surfaces. Check text and button contrast in the rendered theme. |

Treat the cooler background as a design test. Changing the entire palette is unnecessary.

## Homepage sequence

1. Agency proposition, Mike's portrait and one primary CTA.
2. Short, dated client evidence.
3. Three selected cases, each explaining the problem, intervention and documented outcome.
4. Main services and the way the team delivers them.
5. Mike's background, named specialists and the compact BASTIN signature.
6. Two relevant testimonials.
7. Closing invitation to discuss a project.

The Results page already publishes Search Console figures for May–July 2026. Reuse relevant figures with their dates and source. Add enquiry or revenue data where reliable tracking exists, and label each metric accurately.

For a useful interactive feature, consider an annotated comparison of a real client page across languages. A market selector could reveal changes in keywords, terminology, forms and trust information. Use actual examples rather than decorative dashboard graphics.

## First implementation pass

Start with the portrait, agency hero, earlier client evidence and removal of looping decorative effects. Then refine section rhythm, typography and repeated copy.

Before delivery, check the rendered homepage on desktop and mobile in both themes. Confirm readable type, uncropped faces, visible CTAs, working links and useful image sizing. Preserve relevant service links and the international SEO focus.

---

## Implementation status (kept current)

**First pass, 3 Oct 2026 (done):**

- Hero on all three homepages: Mike's portrait (`components/FounderPortrait.tsx`,
  `public/images/mike-bastin-portrait-{400,760}.webp`, from the legacy
  `Mike_home-1.png`, cropped at chest height with a soft bottom fade at the owner's request) replaces the `MarketReach` radar. EN h1 "International SEO
  agency, led by Mike Bastin"; FR "Agence SEO internationale, dirigée par Mike
  Bastin"; ES keeps its Valencia h1 (owner, same day). Primary CTA "Discuss your
  project" / "Parlons de votre projet" / "Hablemos de tu proyecto".
- Client evidence straight after the hero (`components/HomeEvidence.tsx`,
  `lib/home-evidence.ts`): three dated Search Console figures, then three cases
  (Delaguía y Luzón, Century 21 Perdomo, BeTranslated); EN links to `/results/`
  for the rest. The eight-spread section and the EN pull quote are gone.
- No looping motion anywhere: every `infinite` animation in `globals.css` is
  `none`, and `scripts/build-dl-art.mjs` turns the illustrations' loops into a
  single play. Scroll reveals are a short fade with a 10px lift, no blur.

**Footer, 3 Oct 2026 (owner: "the footer is too dull"):** the closing
invitation is a teal panel (`--deep`) with Mike's photo, "Discuss your project"
and the email and phone set large; column links read in ink and turn raspberry
on hover; column headings are serif; the address shows on every footer; a large
static "Mike Bastin" wordmark ends the page.

**Still to do (P2):** one dominant background and dark surfaces, two font
families, "I" in Mike's founder story, named specialists and their roles (needs
the owner's names), two attributed testimonials with source links, BASTIN as a
compact signature, outcome counts instead of activity counts, concrete keyword
examples on service pages, Contact page de-duplication, the cooler `#F6F7F8`
canvas test.
