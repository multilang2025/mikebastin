# Branded blog images, from the owner's illustrator

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
