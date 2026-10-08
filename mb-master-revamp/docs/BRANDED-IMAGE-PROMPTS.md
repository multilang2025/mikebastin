# Branded blog images

## The current set: Higgsfield, people at work on paper objects (8 Oct 2026)

Owner, 8 Oct 2026: "I need relevant images, with some branding effect on
them so they are in harmony with the website, and between each other",
then "Try to add some human touch (faces, bodies, hands, arms, etc)" and
"do this for all locale". All 74 journal images were replaced in one pass:
the 52 English posts, the competitor-analysis checklist page, and the 21
French and Spanish posts with no English sibling (a translated post shows
its English sibling's picture). A first pass without people (paper objects
alone) was generated and replaced the same day.

**Model:** Higgsfield `gpt_image_2_5`, 16:9, 0.25 credits per image.
**Branding:** `site/scripts/brand-blog-images.mjs` cuts each PNG to
1200x630 and stamps the MB mark (the favicon's berry disc) bottom left,
where every prompt leaves plain backdrop. The job id of each image is the
`higgsfield:` value in `site/lib/blog-images.ts`.

Every prompt is `Editorial still-life photograph with a human touch, wide
16:9. Scene: <scene>.` followed by this style block, unchanged:

> House style: warm cream paper backdrop (#F5F0E4), objects in deep navy
> (#0F2837) and cream with one berry red (#C42640) accent, real people
> photographed naturally with natural skin tones, clothing only in navy,
> cream or white, soft diffused daylight from the upper left, gentle
> shadows, matte textures, calm premium editorial photography. The scene
> fills the centre and right of the frame; keep the bottom-left corner
> plain backdrop. No text, no letters, no numbers, no logos.

For a new post: write one scene (hands, arms or a profile doing something
with navy paper objects that stand for the post, one berry element),
generate, download the PNG as `<slug>.png` into an empty folder, run
`node --experimental-strip-types scripts/brand-blog-images.mjs <folder>`
from `site/`, and add the entry to `lib/blog-images.ts`.

| Post | Scene |
|---|---|
| `15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business` | a woman's hands in a cream knit sleeve fanning out blank cream index cards on a table, lifting one card edged in berry red, a navy pencil nearby |
| `360-marketing-agency` | a person's hand in a navy sleeve turning a large navy paper compass rose lying flat, surrounded by a ring of small cream tiles, one tile berry red |
| `affiliate-marketing-programs` | two hands from opposite sides, one in navy and one in white sleeve, passing a berry red paper coin between them above a chain of linked navy paper rings |
| `ai-powered-marketing` | a man in a white shirt seen from the chest down, holding a small folded-card navy robot figure that raises a berry red paper megaphone |
| `alternatives-to-google-analytics` | a hand in a navy sleeve holding a magnifying glass over three navy paper bar-chart models, the middle one topped in berry red |
| `best-practices-for-multilingual-seo` | a young woman in soft side profile wearing a cream sweater, spinning a navy paper globe on a stand with her fingertip, small speech-bubble cut-outs around it, one berry red |
| `best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits` | hands in a navy sleeve scooping coffee beans from a small navy crate, a cream inspection tag tied with berry red string, a magnifying glass on the table |
| `building-a-global-brand` | a careful hand placing a berry red block on top of a tower of navy paper blocks, a small navy globe at the base |
| `chrome-extensions-for-seo` | fingers clicking a berry red puzzle piece into the top bar of a large navy paper browser-window frame lying on the table |
| `chrome-extensions-for-translators` | two hands holding a navy paper browser-window frame, a berry red puzzle piece in its top bar and two cream speech bubbles resting beside it |
| `common-mistakes-to-avoid-when-localising-your-website` | a person in a navy sweater seen from shoulders down, frowning gesture with one hand on hip, holding up one berry red puzzle piece that does not fit a navy paper website puzzle on the table |
| `competitor-analysis-traffic-checklist` | a hand with a navy pen ticking a cream checklist card, next to two navy cards with rising trend lines, the berry red line climbing higher |
| `content-optimisation-for-spanish-users` | a woman's hand holding a half-open navy hand fan over a table where cream text strips are neatly arranged, one strip berry red |
| `conversational-ai-chatbots-business` | a man in soft profile, cream shirt, smiling at a small folded navy paper robot head on the table, between them two speech bubbles, one berry red |
| `digital-marketing-advisor` | an older man's hand in a navy jacket sleeve placing a navy chess knight on an open cream notebook with a berry red ribbon bookmark |
| `eeat-vs-aeat-typo` | a fingertip nudging a berry red block back into a neat row of navy blocks, a magnifying glass leaning on them |
| `email-marketing-hacks-boosting-open-rates-and-conversions` | two hands opening a cream envelope from which a berry red paper heart rises, navy envelopes stacked behind |
| `english-to-french-translation-services` | a woman in a white blouse seen from the chest down, writing with a navy fountain pen beside two cream speech bubbles joined by a small navy paper bridge, one bubble edged berry red |
| `french-ppc-campaign` | a hand pressing a large berry red paper button on a cream card with one finger, a small navy paper Eiffel tower standing behind |
| `german-seo-best-practices` | hands in rolled-up white sleeves fitting a berry red gear into a set of interlocking navy paper gears, a navy ruler beside |
| `german-seo-content-localisation` | a hand placing a berry red text strip onto a navy paper map of Germany laid with cream text strips, a pencil beside |
| `global-business-trends` | two hands cupping a navy paper globe with a berry red paper arrow curving upward around it |
| `google-analytics-international-marketing-limits` | a person in a navy sweater seen from the waist up, side on, reaching up to plant a small berry red flag on top of a cream paper wall that hides the tallest of several navy paper bars |
| `how-ai-is-revolutionising-seo-strategies` | a hand holding a large navy magnifying glass over a small berry red paper spark on a cream card printed with navy circuit lines |
| `how-ai-is-transforming-translation-and-localisation` | two hands from opposite sides each holding a cream speech bubble, joined by a thin navy circuit line with a berry red node in the middle |
| `how-to-create-a-targeted-content-strategy` | a woman in a navy top seen from behind the shoulder, pinning a berry red paper arrow into the bullseye of a navy and cream target on the wall, content cards on the table below |
| `how-to-promote-your-local-business-on-google-maps` | a shopkeeper's hands in a cream apron placing a large berry red map pin beside a small navy paper shopfront on a folded street map |
| `how-to-use-ai-and-machine-translation-tools` | hands lifting a fountain pen out of an open navy toolbox that also holds a small paper robot hand, a berry red speech bubble on the lid |
| `how-to-write-about-your-professional-background` | a man in a navy sweater seen from the chest down, writing in an open lined cream notebook with a berry red ribbon bookmark, reading glasses on the table |
| `human-creator-economy` | a young creator in a cream t-shirt seen from the shoulders down, holding a navy camera, a navy microphone and a berry red paper heart on the table in front |
| `internal-linking-tools` | fingers stretching a navy thread between cream paper cards pinned in a network on the table, one card berry red at the centre |
| `law-firm-seo-services` | a hand in a navy suit sleeve setting a berry red magnifying glass on one pan of a navy balance scale, documents on the other pan |
| `link-building-in-spain` | two hands pulling a chain of navy paper links taut, one link berry red, a navy hand fan on the table |
| `link-selling-and-link-buying-platforms` | a hand holding a cream price tag on berry red string attached to a navy chain link, a small navy balance scale behind |
| `llms-beyond-giants-hidden-ai-models` | a hand gently setting a small berry red cube in front of a row of tall navy paper monoliths |
| `localisation-testing-tools` | a person's hands holding a navy paper smartphone with cream interface strips, a berry red tick card and a magnifying glass on the table |
| `most-popular-marketing-strategies` | a hand placing a berry red megaphone on the top step of a navy three-step paper podium |
| `optimising-multilingual-website-content` | a woman in soft profile, white shirt, arranging cream text strips into three panels of a navy paper website frame, one panel berry red, a small globe beside |
| `optimising-your-website-for-valencia-based-searches` | a hand placing a navy map pin on a cream paper map of a coastal city, a fresh berry red orange in the other hand |
| `search-everywhere-strategy` | a person seen from the chest down holding a large navy magnifying glass, small cream paper device and app tiles around on the table, one tile berry red |
| `seo-in-belgium` | a hand holding a brass magnifying glass over a cream paper map of Belgium in navy with one region in berry red |
| `spanish-keyword-localisation` | a hand holding up a ring of navy paper keys, one key berry red, a navy hand fan on the table below |
| `spanish-on-page-seo` | hands laying a berry red heading strip at the top of a navy paper web page outline filled with cream content blocks, a pencil beside |
| `spanish-seo-markets` | a hand pushing a berry red pin into a navy paper map of Latin America laid beside a navy paper map of Spain |
| `technical-seo-considerations-for-german-websites` | hands with a small navy screwdriver adjusting navy and berry red paper gears set inside a website-frame outline, a ruler beside |
| `technical-seo-for-multilingual-websites` | a hand connecting a navy wire from three stacked navy paper website frames to a berry red paper gear |
| `technical-seo-for-spanish-search-engines` | a hand holding a berry red wrench across a cream paper web page, a navy magnifying glass beside |
| `user-interface-localisation-can-transform-your-global-reach` | a hand holding a navy paper smartphone with cream interface tiles, one tile berry red, a small navy globe on the table |
| `what-is-search-intent-mapping` | a finger tracing a navy dotted route across a folded cream paper map from a magnifying glass to a berry red pin |
| `optimisation-pour-les-systemes-ia` | a woman in soft profile, navy sweater, leaning close to listen to a small folded navy paper robot head that holds up a cream card with a berry red dot |
| `seo-au-geo` | a hand moving a berry red paper star from a navy magnifying glass toward a cream speech bubble, as if passing it from search to an answer |
| `agence-seo-internationale` | three people's hands around a table, navy, cream and white sleeves, placing cream cards around a navy paper globe, one card berry red |
| `consultant-referencement-international` | a man in a white shirt seen from the chest down, turning the page of a navy wall calendar made of paper, a berry red pin on one month, a small globe on the desk |
| `expert-en-seo-international` | a woman's hand moving small navy paper flag markers on a cream map, one marker berry red placed first |
| `recherche-vocale` | a woman in soft profile, cream sweater, speaking toward a small navy paper speaker cone, a berry red paper sound wave curling out of it |
| `visa-nomade-numerique-espagne` | a traveller's hands holding a navy passport-shaped notebook and a berry red orange, a navy laptop-shaped paper cut-out and a suitcase handle on a sunny cream terrace table |
| `analizar-backlinks-competidores` | a hand following a navy thread with a magnifying glass from one cream paper house to another, the thread ending at a berry red house |
| `analizar-trafico-web-competencia` | a person seen from chest down pouring small navy paper beads through three cream funnels into glass jars, one jar holding berry red beads |
| `competidores-seo` | a hand lifting a cream paper cover to reveal a berry red chess piece among navy chess pieces on a cream board |
| `datos-estructurados-schema-optimizacion-geo` | hands sorting cream cards into a neat navy wooden filing tray, one card tagged berry red |
| `diferencias-culturales-sitios-web-multilingues` | three hands from different sides each holding a cream teacup in a different style toward the centre, one cup berry red |
| `herramientas-gratuitas-analisis-competitivo` | hands opening a navy paper toolbox with free simple tools inside, a magnifying glass, a ruler and one berry red pencil |
| `link-building-local-en-espana` | two people's hands shaking over a cream table with a navy paper newspaper and a berry red paper orange |
| `medir-rendimiento-geo` | a hand holding a navy measuring tape around a cream speech bubble, a small berry red mark on the tape |
| `optimizacion-para-sistemas-de-ia` | a man in soft profile, white shirt, adjusting a berry red dial on a small navy paper machine that prints cream cards |
| `optimizar-para-seo-y-geo` | two hands, one holding a navy magnifying glass and one holding a cream speech bubble, meeting over a single cream page with a berry red heading |
| `optimizar-perfil-de-empresa-de-google` | a shopkeeper in a cream apron seen from chest down, hanging a small navy shop sign beside a large berry red map pin on the counter |
| `rastrear-posiciones-de-keywords-de-competidores` | a hand moving a berry red marker up a navy paper ladder of rungs with cream markers on lower rungs |
| `seo-tecnico-para-sitios-multilingues` | hands plugging navy cables from three paper website frames into a small navy switch box with one berry red port |
| `sistemas-cualificacion-leads-ia` | a hand sorting cream cards into three navy trays, lifting one berry red card to the top tray, a small paper robot figure watching |
| `competitor-analysis` | a person's hand, navy shirt cuff visible, moving a berry red chess pawn one square ahead of three navy pawns on a navy and cream chessboard |
| `future-of-seo` | a woman seen in soft side profile from the shoulders up, wearing a navy sweater, looking up thoughtfully at a berry red paper star hanging on a thread, a navy paper telescope on a tripod beside her |
| `mastering-the-art-of-networking` | two hands from opposite sides of the frame, one in a navy sleeve and one in a cream sleeve, shaking over a table scattered with cream paper speech bubbles, one bubble berry red |
| `technical-seo-audit-checklist` | a man in a white shirt with sleeves rolled up, seen from chest down, ticking a berry red box on a navy clipboard checklist with a navy fountain pen |

---

## Earlier: the September illustrator pass (superseded)

> 23 September 2026. Prompts for the owner's tool at
> `blog-illustrator-29324474740.us-west1.run.app`, written for the sixteen
> journal posts whose hero is generic stock.

## What the tool does, so the prompts fit it

It is a Google AI Studio app. It generates with
`gemini-3.1-flash-image-preview`, and every request it sends has a fixed
branding block appended to the prompt:

1. no text, filenames or labels inside the image
2. a colour palette, taken from a field the user fills in
3. subtle cultural cues for a target country, when one is set
4. the chosen style: **Hyperrealistic** (photorealistic, cinematic,
   natural light) or **Illustration** (professional corporate illustration)

Its own prompt writer also refuses a list of clichés: laptops, people
typing, minimalist desks, antique brass globes, glass office buildings.
Every prompt below respects that list, and so avoids the exact images it
is replacing.

## Settings, as the app actually shows them

Checked against the running app on 23 September 2026, which corrected an
earlier version of this sheet that described a palette field the app
does not have.

- **Output style: HYPERREALISTIC.** One style for all sixteen, so the
  journal reads as a set. It matches the one hero the owner has supplied
  so far, on `alternatives-to-google-analytics`.
- **Aspect ratio: 16:9 LANDSCAPE**, not the `1200x640` preset. The preset
  resizes by drawing the image onto a 1200x640 canvas without keeping its
  proportions, which stretches a 16:9 picture about five per cent wider.
  Take 16:9 and the crop to 1200x630 happens here, without distortion.
- **Resolution: 1K (STANDARD).** Already wider than the 1200px the site
  serves, so a larger size costs more and adds nothing.
- **Branding and protection: off.** In the app's code this switch stamps
  a text watermark into the bottom-right corner, which a hero image should
  not carry.
- **High quality (paid): on**, as the app already shows it. That is what
  selects the Gemini 3.1 Flash Image model.

## The palette goes in the prompt

There is no palette field. The app's branding block asks for "a colour
palette matching" a value it fills from the **Analyze** step, and falls
back to "Professional and modern" when nothing was analysed. So each
prompt below ends with the site's own tokens, which is the one way to get
them into the picture without relying on Analyze reading the palette
correctly off a page:

```
Colour palette: deep navy #0F2837, warm cream #F5F0E4, deep sea teal #1C6580, with berry red #C42640 only as a small accent. Calm, coastal, sea-toned light.
```

Paste the prompt from the table, add that line after it, and generate.
Together they stay inside the app's 1,000-character limit.

## Why these sixteen

They are the posts whose current hero shows the letters SEO glowing over
a laptop, icons floating above a keyboard, or a product logo. Two of them,
`chrome-extensions-for-translators` and `top-instagram-tools`, use a
third-party logo as their hero, and none of the prompts below asks for a
logo, a brand name or legible text.

## The prompts

Each is the subject line. Add the palette line above after it; the app adds its own branding block on top.

| Post | Prompt |
|---|---|
| `technical-seo-audit-checklist` | A structural engineer at dusk inspecting the exposed steel frame of a building under construction, checking each bolted joint in turn with a torch, calm sea visible beyond the site |
| `technical-seo-considerations-for-german-websites` | Close detail of the bolts and welded seams on a precisely engineered steel bridge, a German river valley and forested hills soft in the background |
| `german-seo-best-practices` | A high-speed train gliding into a clean modern German station platform at blue hour, every line of the platform and track exactly aligned |
| `future-of-seo` | An observatory dome opening at dusk onto a clear sky above a quiet coastline, the telescope angled towards the horizon |
| `ai-powered-marketing` | Inside a lighthouse lens room, the great Fresnel lens turning and throwing beams of light across a dark sea at night |
| `how-ai-is-transforming-translation-and-localisation` | A precise robotic arm placing tiles into a large mosaic while a human craftsperson beside it adjusts the colours by hand, working the same piece together |
| `how-to-use-ai-and-machine-translation-tools` | A machine-thrown ceramic bowl on a potter's wheel being finished by hand, fingers smoothing the rim, studio lit by soft window light |
| `best-practices-for-multilingual-seo` | A busy harbour seen from above, a pilot boat guiding ships flying different national colours into their own separate berths |
| `multilingual-keyword-research` | Small fishing boats spread across a coastal bay at dawn, each casting its nets over a different shoal of fish visible beneath the clear water |
| `internal-linking-tools` | An aerial view of a calm bay where old stone bridges connect a chain of small islands, each island reachable from the next |
| `how-to-create-a-targeted-content-strategy` | An archer at full draw aiming at a distant target across a still lake at sunrise, mist lifting off the water |
| `localisation-testing-tools` | A quality inspector in daylight checking rows of identical ceramic plates, each set glazed in a different regional pattern |
| `chrome-extensions-for-seo` | A craftsman's canvas tool roll opened across a workbench, each small precision tool held in its own slot |
| `chrome-extensions-for-translators` | A row of interchangeable camera lenses of different focal lengths laid out on a navy cloth, one camera body beside them |
| `affiliate-marketing-programs` | Two relay runners passing the baton cleanly on a coastal running track at golden hour |
| `top-instagram-tools` | A photographer's kit laid out on a wooden table: a camera body, two lenses, a ring light and a phone gimbal, no logos or labels |

## Target country

Leave it on Global except for the two German posts, where **Germany**
lets the tool add the cultural cues its branding block asks for. Both
prompts already set the scene in Germany, so the field only reinforces it.

## Getting the images onto the site

Send the generated files back and they go through the pipeline built for
the first owner-supplied hero, on 22 September:

- cropped to 1200x630, with the crop anchor chosen by looking at the
  frame, since sharp's `attention` crop cut the subject in half last time
- a 160x84 thumbnail for the footer
- recorded in `site/lib/blog-images.ts` with an `owner:` provenance
  prefix, which `fetch-legacy-images.mjs` skips so `--force` never deletes
  a file that exists nowhere else
- alt text written from the picture itself rather than the post title,
  as every other entry's is
