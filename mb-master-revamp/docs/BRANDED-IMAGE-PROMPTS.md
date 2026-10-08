# Branded blog images

## The current set: Higgsfield paper still lifes (8 Oct 2026)

Owner, 8 Oct 2026: "I need relevant images, with some branding effect on
them so they are in harmony with the website, and between each other."
All 53 journal images were replaced in one pass, so the whole index reads
as one series. Everything below this section describes the September
illustrator pass, which this replaces; it is kept for the history.

**Model:** Higgsfield `gpt_image_2_5`, 16:9, 0.25 credits per image.
**Branding:** `site/scripts/brand-blog-images.mjs` cuts each PNG to
1200x630 and stamps the MB mark (the favicon's berry disc) bottom left,
where every prompt leaves room. The job id of each image is the
`higgsfield:` value in `site/lib/blog-images.ts`.

Every prompt is `Minimal editorial still-life photograph, wide 16:9.
Subject: <subject>.` followed by this style block, unchanged:

> House style: warm cream paper backdrop (#F5F0E4) filling the frame,
> objects only in deep navy (#0F2837), cream and one berry red (#C42640)
> accent, soft diffused daylight from the upper left, gentle long shadows,
> matte paper textures, calm and premium editorial look. The subject is
> large and fills the centre-right two thirds of the frame, with breathing
> room on the left. No text, no letters, no numbers, no logos, no people.

For a new post: write one subject line (a physical metaphor for the post,
navy objects with one berry element), generate, download the PNG as
`<slug>.png` into an empty folder, run
`node --experimental-strip-types scripts/brand-blog-images.mjs <folder>`
from `site/`, and add the entry to `lib/blog-images.ts`.

| Post | Subject |
|---|---|
| `15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business` | a fan of fifteen small blank cream index cards spread in an arc, one card lifted and edged in berry red, with a navy pencil beside them |
| `360-marketing-agency` | a navy paper compass rose lying flat with a full circle of small cream paper tiles around it, one tile berry red |
| `affiliate-marketing-programs` | two navy paper hands-shaped cut-outs passing a small berry red paper coin between them along a chain of linked navy paper rings |
| `ai-powered-marketing` | a small navy geometric robot figurine made of folded card holding a berry red paper megaphone |
| `alternatives-to-google-analytics` | three different navy paper bar-chart sculptures standing side by side, the middle one with a berry red top bar, a navy magnifying glass leaning against them |
| `best-practices-for-multilingual-seo` | a navy paper globe on a stand with three small cream speech-bubble cut-outs floating around it, one bubble berry red |
| `best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits` | a small wooden crate of coffee beans with a navy paper leaf and a cream paper inspection tag tied with berry red string, beside a navy magnifying glass |
| `building-a-global-brand` | a stack of navy paper building blocks rising into a tower, the top block berry red, a small navy paper globe beside the base |
| `chrome-extensions-for-seo` | a navy paper browser window frame with a row of small puzzle-piece cut-outs clicking into its top bar, one puzzle piece berry red |
| `chrome-extensions-for-translators` | a navy paper browser window frame with two puzzle-piece cut-outs on its top bar, one berry red, and two small speech-bubble cut-outs beside it |
| `common-mistakes-to-avoid-when-localising-your-website` | a navy paper website frame with one cream puzzle piece placed upside down and sticking out awkwardly, edged in berry red, a navy pencil eraser nearby |
| `competitor-analysis-traffic-checklist` | two navy paper line-chart cut-outs overlapping, one line berry red rising above the other, beside a cream checklist card with a few navy ticks |
| `content-optimisation-for-spanish-users` | a navy paper hand fan (abanico) half open, with small cream paper text-line strips arranged neatly next to it and one berry red strip |
| `conversational-ai-chatbots-business` | two cream paper speech bubbles in conversation, one navy outlined and one berry red, with a tiny folded navy paper robot head beside them |
| `digital-marketing-advisor` | a navy paper chess knight standing on an open cream notebook with a berry red bookmark ribbon, a navy pen beside it |
| `eeat-vs-aeat-typo` | four navy wooden letter-free blocks in a row with one block swapped for a berry red block slightly out of line, a navy magnifying glass leaning on them |
| `email-marketing-hacks-boosting-open-rates-and-conversions` | a cream paper envelope opening with a berry red paper heart rising out of it, two smaller navy envelopes behind |
| `english-to-french-translation-services` | two cream paper speech bubbles linked by a navy paper bridge, one bubble with a small navy-white-berry striped ribbon, a fountain pen beside them |
| `french-ppc-campaign` | a navy paper cursor arrow clicking a berry red paper button on a cream card, a small navy paper Eiffel-tower silhouette in the background |
| `future-of-seo` | a large rolled navy card telescope on a small tripod pointing up toward a berry red paper star hanging on a thread, filling the right half of the frame |
| `german-seo-best-practices` | a neat stack of precise navy paper gears interlocking on a cream card, one gear berry red, a navy ruler beside them |
| `german-seo-content-localisation` | a navy paper map outline of Germany with small cream text-line strips laid on it, one strip berry red, a navy pencil beside |
| `global-business-trends` | a navy paper globe with a berry red paper arrow curving upward around it like an orbit |
| `google-analytics-international-marketing-limits` | a navy paper bar chart whose tallest bar is cut off by a cream paper wall, a berry red paper flag planted at the wall |
| `how-ai-is-revolutionising-seo-strategies` | a navy paper magnifying glass whose lens holds a small berry red folded paper spark, resting on a cream card with navy line patterns like circuitry |
| `how-ai-is-transforming-translation-and-localisation` | two cream speech bubbles joined by a thin navy circuit-line path with a small berry red node in the middle |
| `how-to-create-a-targeted-content-strategy` | a navy paper archery target with a berry red paper arrow in the bullseye, cream content cards fanned below it |
| `how-to-promote-your-local-business-on-google-maps` | a folded cream paper street map with navy streets and one large berry red paper map pin standing upright on a small shopfront cut-out |
| `how-to-use-ai-and-machine-translation-tools` | a navy paper toolbox open with a fountain pen and a small folded paper robot hand inside, a berry red speech bubble on top |
| `how-to-write-about-your-professional-background` | an open cream notebook with neat navy lines, a navy fountain pen and a small berry red paper ribbon bookmark, a pair of reading glasses beside it |
| `human-creator-economy` | a navy paper camera, a small microphone cut-out and a berry red paper heart arranged around a cream paper easel |
| `internal-linking-tools` | several cream paper cards joined by navy thread in a network, one card berry red at the centre |
| `law-firm-seo-services` | a navy paper balance scale with a berry red paper magnifying glass on one pan and cream documents on the other |
| `link-building-in-spain` | a chain of navy paper links curving across the frame, one link berry red, with a small navy paper Spanish fan beside it |
| `link-selling-and-link-buying-platforms` | a navy paper chain link resting on a small cream price tag tied with berry red string, beside a navy balance scale |
| `llms-beyond-giants-hidden-ai-models` | a row of large navy paper monoliths with one small berry red folded paper cube standing in front of them, lit by a soft beam |
| `localisation-testing-tools` | a navy paper phone outline with cream interface strips, a berry red paper checkmark beside a small navy magnifying glass and a toolbox |
| `mastering-the-art-of-networking` | cream paper figures cut-outs standing in a loose circle connected by navy thread, one figure berry red |
| `most-popular-marketing-strategies` | a navy paper podium with three steps, a berry red paper megaphone on the top step and cream cards on the others |
| `optimising-multilingual-website-content` | a navy paper website frame split into three panels each with cream text strips, one panel accent berry red, a navy paper globe beside |
| `optimising-your-website-for-valencia-based-searches` | a navy paper map pin standing on a cream paper map of a coastal city with a small berry red paper orange beside it |
| `search-everywhere-strategy` | a navy paper magnifying glass at the centre with several small cream paper device and app cut-outs around it, one berry red |
| `seo-in-belgium` | a large folded cream paper map of Belgium with navy regions and one berry red region, a brass magnifying glass resting on it, filling most of the frame |
| `spanish-keyword-localisation` | cream paper key-shaped cut-outs on a navy key ring, one key berry red, beside a small navy paper Spanish fan |
| `spanish-on-page-seo` | a navy paper web page outline with neatly arranged cream content strips and a berry red heading strip, a navy pencil beside it |
| `spanish-seo-markets` | a navy paper map of Spain and Latin America outlines side by side with small berry red paper pins on a few cities |
| `technical-seo-considerations-for-german-websites` | a navy paper gear assembly in the shape of a website frame, one gear berry red, a precise navy ruler and screwdriver beside it |
| `technical-seo-for-multilingual-websites` | three navy paper website frames stacked in perspective connected by navy wires to a berry red paper gear |
| `technical-seo-for-spanish-search-engines` | a navy paper magnifying glass over a cream web page outline with a berry red wrench crossing it |
| `user-interface-localisation-can-transform-your-global-reach` | a navy paper smartphone outline with cream interface tiles, one tile berry red, a small navy paper globe beside it |
| `what-is-search-intent-mapping` | a cream paper map with navy dotted routes from a navy magnifying glass to a berry red destination pin |
| `competitor-analysis` | a chess board corner with three navy chess pawns facing one berry red pawn that stands slightly ahead |
| `technical-seo-audit-checklist` | a clipboard with a blank paper checklist of short navy lines and small empty squares, three squares ticked in berry red, a navy fountain pen lying across it |

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
