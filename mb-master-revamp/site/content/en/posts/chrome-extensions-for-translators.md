---
words: 1872
title: "Chrome extensions for translators, and what each one saves"
slug: "chrome-extensions-for-translators"
locale: "en"
type: "posts"
group: "g021"
wpId: 37229
date: "2024-09-25T14:57:40"
modified: "2026-09-26T12:00:00"
sourceUrl: "https://mikebastin.com/chrome-extensions-for-translators/"
excerpt: "Boost your translation productivity with these top 10 essential Chrome extensions for translators, enhancing efficiency, accuracy, and workflow."
---

We have been working between English, French, Spanish and Dutch since the mid-2000s, and the browser is where most of that work happens. Not the CAT tool or the Trados memory, but a translation job open in one tab and reference material in five more.

Below is the toolkit we actually keep installed in 2026, after Manifest V3 broke or replaced several old favourites and generative AI rewrote half of what a translation extension is supposed to do. If you still use a list bookmarked in 2022, parts of it are now broken.

## What changed since the last version of this article

Two shifts forced a full audit. First, Chrome retired Manifest V2 during 2024 and 2025. Extensions that did not migrate to Manifest V3 stopped working, and several translation extensions either rebuilt themselves around service workers or quietly left the Chrome Web Store.

The second shift is bigger. Large language models moved into the browser through dedicated extensions and sidebar panels. For everyday lookup, quick rephrasing and post-editing of machine output, one LLM extension now does what three or four translation extensions used to do.

> The global language services and technology industry generated $49.68 billion in 2023, a 4.5% drop from $52.01 billion in 2022, driven by enterprise adoption of neural machine translation and large language models.
>
> Source: [CSA Research, 2024 Market Sizing Update](https://csa-research.com/Blogs-Events/CSA-in-the-Media/Press-Releases/Language-Services-and-Technology-Industry-Faces-Revenue-Decline-but-Remains-Poised-for-Transformation)

If the per-word price keeps falling while volume holds steady, the only way a translator stays profitable is by being faster, and the browser stack is where that speed comes from.

## Translation engines we still keep on the toolbar

### DeepL for Chrome

Best raw quality for European languages, in our daily experience. We reach for [DeepL](https://www.deepl.com/en/chrome-extension) first when we need a French or German draft that should sound natural rather than literal. Select text on any page, press a shortcut, and read the translation in a popover without bouncing to deepl.com.

The free tier covers most quick lookups; Pro unlocks document mode and glossaries in the main app. DeepL also owns Linguee, so a paid plan ties context examples and engine output together in one workflow.

### ImTranslator

We keep [ImTranslator](https://chromewebstore.google.com/detail/imtranslator-translator-d/noaijdpnepcgjemiklgfkcfbkokogabh) installed for one job: comparing translations from Google, Microsoft Bing and other engines side by side in the same popup. If a client questions a wording choice, a three-way comparison is the fastest evidence to put on the table. The extension is on Manifest V3, sits at around 900,000 users, and was updated as recently as March 2026.

### Mate Translate

The on-page bubble translator we default to for casual reading. Select a word, get the definition and translation, and save it to a phrasebook synced across devices. Pro adds Netflix subtitle translation, useful when checking how a streaming service rendered a colloquial phrase.

Full-page translation quality has slipped since early 2025 going by user reviews, so we treat [Mate](https://chromewebstore.google.com/detail/mate-translate-%E2%80%93-translat/ihmgiclibbndffejedjimfjmfoabpcke) as a word and phrase helper rather than a document translator.

### Google Translate

Not the strongest engine, but the one every client recognises. Clients send us websites and expect us to read them quickly, and the official Google Translate extension is the cleanest way to get the gist of any page in seconds.

## AI assistants that quietly replaced half the old toolkit

### Claude in Chrome and ChatGPT

For complex sentences, idiomatic content, or anything legal or technical, a general-purpose LLM extension now beats most dedicated translation tools. The reason is context.

We can paste a paragraph plus three lines of surrounding context and a one-line instruction such as "translate to formal French for a Belgian law firm audience, keep the second-person plural form". A standalone translation engine cannot take that instruction; an LLM extension can.

We use Claude in Chrome, generally available since 26 August 2026 on paid Claude plans, for client work where tone and register matter, and ChatGPT for quick rewrites and brainstorming. Neither is free of mistakes, so we still proof every output by hand. See our deeper view on [how to use AI and machine translation tools](/blog/how-to-use-ai-and-machine-translation-tools/) for the workflow we run them through.

### DeepL Write

Sits halfway between a translator and a grammar tool, rephrasing your target-language draft for tone, register and natural flow. We run our own French and Spanish drafts through it, then accept or reject each suggestion sentence by sentence. It catches the stiffness that comes from translating word for word in your head.

## Reference helpers we cannot work without

Translation is mostly disambiguation, and these lookup tools earn their place by closing that gap quickly.

### Linguee

A bilingual concordancer with real example sentences mined from EU documents, patents and parallel corpora. When DeepL gives us a translation we do not fully trust, Linguee shows how the term was used in twenty real documents. It is now part of DeepL but still works as a standalone reference.

### Reverso Context

Same idea as Linguee, with different source material: stronger for informal speech, film subtitles and conversational register. Between the two, you have working examples for almost any phrase.

### LanguageTool

A multilingual grammar and style checker for French, Spanish, German, Dutch and more. Grammarly is English-only at the depth we need, so for any non-English work [LanguageTool](https://languagetool.org/chrome) is the better pick.

## Two extras for translators who also handle web content

If your translation work touches WordPress sites or website localization projects, two more belong in the toolbar.

**Wappalyzer** tells you what CMS, plugins and translation setup a site runs before you open the source code. When a prospect asks about translating their WordPress site, we want to know in two seconds whether it runs WPML, Polylang, TranslatePress or a custom system. Our [website localization service](/services/website-localisation/) page explains what each one means in practice.

**Detailed SEO Extension** gives a fast on-page audit of headings, metas, hreflang, canonical tags and schema markup. Before we localize a site into three more languages, we want to see whether the source-language SEO is competent. Our round-up of [Chrome extensions for SEO](/blog/chrome-extensions-for-seo/) covers the wider audit toolkit.

## What we removed from the previous version of this list

**Readlang Web Reader.** Useful for language learners, but rarely fits a working translator's day.

**TransOver.** Engine quality has degraded, and the pop-up trigger conflicts with several modern sites.

**Rememberry.** Flashcard tools belong in Anki, not the browser.

**Grammarly.** Still excellent for English-only writers, but not strong enough for multilingual professionals. LanguageTool replaces it here.

**Lingvanex.** Still works, but DeepL plus an LLM extension covers the same ground with better output.

## Side-by-side comparison

| Extension | Best for | Free tier | Languages | Our usage |
| --- | --- | --- | --- | --- |
| DeepL for Chrome | Natural MT for European languages | Yes (character cap) | 100+ | Daily |
| ImTranslator | Side-by-side engine comparison | Yes | 100+ | Weekly |
| Mate Translate | Word and phrase bubble | Yes (with paywall) | 200+ | Daily |
| Google Translate | Fast page gist | Yes | 130+ | Daily |
| Claude in Chrome | Context-aware translation and rewriting | No, paid Claude plan | All major | Daily |
| DeepL Write | Target-language polish | Yes | 9 | Per project |
| Linguee | Bilingual example sentences | Yes | 25+ | Hourly |
| Reverso Context | Informal register and idiom | Yes | 15+ | Daily |
| LanguageTool | Multilingual grammar QA | Yes | 30+ | Daily |

> DeepL Translator lists more than 100 languages; DeepL Write's text improvement covers nine: Chinese, English, French, German, Italian, Japanese, Korean, Portuguese and Spanish (checked 26 September 2026).
>
> Source: [DeepL API documentation, Languages supported](https://developers.deepl.com/docs/getting-started/supported-languages)

> The biggest change in twenty-five years of multilingual work is not the quality of MT or even the rise of LLMs. It is that the browser became the workbench. Everything we used to do across Trados, a paper dictionary, and three monitors now happens inside one Chrome window with seven extensions. The job is the same. The tools are unrecognisable.
>
> [Mike Bastin](/how-i-work/), multilingual SEO and translation consultant

## How we sequence these in a working translation day

A real example: a Belgian law firm sent us a 1,200-word French contract excerpt to translate into English for an international client meeting.

<figure class="post-fig">
<svg viewBox="0 0 400 222" role="img" aria-label="Five passes in order: DeepL draft, Linguee term check, Claude rewrite, LanguageTool grammar check, then a final read aloud by hand.">
<line x1="40" y1="22" x2="40" y2="198" class="fg-rule"/>
<circle cx="40" cy="22" r="16" class="fg-box"/>
<circle cx="40" cy="66" r="16" class="fg-box"/>
<circle cx="40" cy="110" r="16" class="fg-box"/>
<circle cx="40" cy="154" r="16" class="fg-box"/>
<circle cx="40" cy="198" r="16" class="fg-hot"/>
<text x="40" y="28" text-anchor="middle" class="fg-strong">1</text>
<text x="40" y="72" text-anchor="middle" class="fg-strong">2</text>
<text x="40" y="116" text-anchor="middle" class="fg-strong">3</text>
<text x="40" y="160" text-anchor="middle" class="fg-strong">4</text>
<text x="40" y="204" text-anchor="middle" class="fg-strong">5</text>
<text x="72" y="28" class="fg-text">DeepL</text>
<text x="72" y="72" class="fg-text">Linguee</text>
<text x="72" y="116" class="fg-text">Claude</text>
<text x="72" y="160" class="fg-text">LanguageTool</text>
<text x="72" y="204" class="fg-text">Read aloud</text>
<text x="388" y="28" text-anchor="end" class="fg-label">first draft</text>
<text x="388" y="72" text-anchor="end" class="fg-label">check terms</text>
<text x="388" y="116" text-anchor="end" class="fg-label">fix ambiguity</text>
<text x="388" y="160" text-anchor="end" class="fg-label">grammar check</text>
<text x="388" y="204" text-anchor="end" class="fg-label">by hand</text>
</svg>
<figcaption>Machines do the first four passes quickly; the fifth, a human reading every sentence, is the one the client is paying for.</figcaption>
</figure>

1. Paste the French into DeepL via the extension for a clean draft.
2. Read the draft through, flagging legal terminology and checking each term of art against Linguee.
3. Rewrite the ambiguous sentences with Claude in Chrome, with a one-line prompt about Belgian legal English conventions.
4. Run the English through LanguageTool to catch grammatical drift.
5. Read aloud once, sentence by sentence.

Two hours from raw French to delivered English, and the browser stack made about 60% of that speed possible.

## Where the translator's browser stack is heading

Two predictions for the next twelve to eighteen months. Sidebar LLMs will probably absorb most dedicated translation extensions for word-level lookup, while bilingual corpora such as Linguee and Reverso Context become more important, not less, because LLM output is harder to check without ground-truth examples.

Specialised CAT tool companions will also multiply. Smartcat, Lokalise and Phrase are all racing to embed translator workflow inside Chrome, so if you live in a CAT environment, expect to add one of those soon. For a wider view, see our piece on [how AI is transforming translation and localization](/blog/how-ai-is-transforming-translation-and-localisation/).

The browser stack is only the surface. Underneath is a workflow built around catching MT and LLM mistakes faster than the per-word price drops. If you handle multilingual content across markets and want a second opinion on the production setup behind it, see how our agency approaches [expert translation services](/services/translation-services/) and [post-AI editing](/services/ai-translation-and-post-editing/), or [get in touch](/contact/) and we can walk through your current stack in 20 minutes.

## Frequently asked questions

### Which Chrome extension gives the best translation quality in 2026?

For European-language pairs, DeepL still produces the most natural raw output. For longer or more nuanced content, a general-purpose LLM extension such as Claude in Chrome beats dedicated engines because it can take a tone, register and audience prompt alongside the source text.

### Are these extensions all free?

All except Claude in Chrome have a free tier that covers casual use; Claude in Chrome needs a paid Claude plan. For professional volume, DeepL Pro, Mate Pro and a Claude or ChatGPT subscription unlock the features most working translators end up needing.

### Do we still need a CAT tool if our browser stack is this strong?

Yes, for any project with translation memory, repetition discounts or client-supplied glossaries. The browser stack speeds up research, lookup and review; the CAT tool still owns the segmentation, memory and consistency layer that professional clients expect on multi-file projects.

### Will Manifest V3 cause more translation extensions to disappear?

The big migration wave is largely finished. Around 85% of actively maintained Chrome extensions had moved to Manifest V3 by early 2025 according to Google. The extensions still standing in 2026 are the ones with the resources to keep maintaining them, which is itself a useful filter when you decide what to install.
