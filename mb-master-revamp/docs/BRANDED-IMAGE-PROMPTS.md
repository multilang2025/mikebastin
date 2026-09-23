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

## Enter these once, in the tool

**Palette field.** The site's own tokens, so the images sit in the page
rather than on it:

```
deep navy #0F2837, warm cream #F5F0E4, deep sea teal #1C6580, berry red #C42640 used sparingly as an accent
```

**Size.** `1200x640`, the tool's preset closest to the site's 1200x630.
The last 10px come off in the crop.

**Style.** One of the two, applied to all sixteen so the journal reads as
one set. Hyperrealistic matches the one hero the owner has supplied so
far, on `alternatives-to-google-analytics`.

## Why these sixteen

They are the posts whose current hero shows the letters SEO glowing over
a laptop, icons floating above a keyboard, or a product logo. Two of them,
`chrome-extensions-for-translators` and `top-instagram-tools`, use a
third-party logo as their hero, and none of the prompts below asks for a
logo, a brand name or legible text.

## The prompts

Each is the subject line only. The tool adds the branding block itself.

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
