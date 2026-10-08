---
words: 1983
title: "LLMs beyond ChatGPT worth knowing"
slug: "llms-beyond-giants-hidden-ai-models"
locale: "en"
type: "posts"
group: "g144"
wpId: 24855595
date: "2025-12-16T13:46:54"
modified: "2026-09-26T21:30:00"
sourceUrl: "https://mikebastin.com/llms-beyond-giants-hidden-ai-models/"
excerpt: "Paying frontier prices for routine AI work? Ten LLMs beyond ChatGPT worth knowing, what each is good for, and the licence terms to check before you build."
---

## Why look beyond ChatGPT in 2026

Your team may be paying frontier-model prices for work a smaller model could do, and in some of your languages a less famous model may translate better than the one you use now. Looking beyond the four names in the headlines, ChatGPT, Claude, Gemini and Llama, saves money on routine work and can lift quality in the markets English-first models serve least well.

Below: ten models worth knowing, grouped by why they matter, with the licence terms to check before you build on any of them.

Some matter for multilingual SEO and translation work, where models with strong non-English coverage can beat bigger English-first models on specific language pairs. Others matter because they are genuinely open-source and commercially usable, a stricter standard than many “open” models meet. A few simply matter because they pioneered ideas that everyone else has since copied.

Each entry links to its official source. Licences and model line-ups change fast, so the details below were checked against each project’s own pages on 26 September 2026.

**Why this matters in 2026:** the frontier leaderboard belongs to closed models from OpenAI, Anthropic and Google, but dozens of open and specialised models do critical work underneath, in research, multilingual NLP and on-device inference. For tasks below frontier-class reasoning, a smaller open model often fits better and costs a fraction.

## Open-science and research models

These are reference models more than deployment candidates, and they explain why the open models you might deploy behave as they do, and BLOOM’s documentation is still useful for low-resource languages.

### BLOOM

BigScience research workshop, an international open-science collaboration

**What it is:** A 176-billion-parameter open-access multilingual LLM trained on 46 natural languages and 13 programming languages. One of the most ambitious open-science AI projects ever attempted.

> BLOOM: 176,247,271,424 parameters, 46 natural languages and 13 programming languages, released under the BigScience RAIL License v1.0.
>
> Source: [Hugging Face, bigscience/bloom model card, 2022](https://huggingface.co/bigscience/bloom)

**Why it matters:** BLOOM is a milestone for transparency in AI: its checkpoints, training data documentation and training details are public. It remains a reference point for researchers studying LLM behaviour and multilingual coverage. Note that its RAIL licence carries use restrictions, so it is open-access rather than open-source in the strict sense.

[BLOOM on Hugging Face](https://huggingface.co/bigscience/bloom)

### OpenAssistant

LAION

**What it is:** A community-driven, fully open-source conversational AI project, paired with the OASST instruction datasets collected from thousands of volunteers.

**Why it matters:** OpenAssistant is one of the most genuinely community-built LLM projects. LAION declared it completed on 25 October 2023, but the final oasst2 dataset remains on Hugging Face and is still used to fine-tune and evaluate open chat models. A landmark in democratised AI.

[OpenAssistant on Hugging Face](https://huggingface.co/OpenAssistant)

### Orca 2

Microsoft Research

**What it is:** A small model (7B and 13B variants) taught reasoning strategies by learning from the step-by-step explanations of larger teacher models.

> Orca 2 significantly surpasses models of similar size (including the original Orca model) and attains performance levels similar to or better than models 5-10 times larger, as assessed on complex tasks that test advanced reasoning abilities in zero-shot settings.
>
> Source: [Microsoft Research blog, "Orca 2: teaching small language models how to reason", 20 November 2023](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

**Why it matters:** Orca popularised “explanation tuning”, where a model learns to reason step by step from teacher demonstrations. The same distillation idea runs through many of the small open models that followed.

<figure class="post-fig">
<svg viewBox="0 0 400 120" role="img" aria-label="Orca’s explanation tuning: a large teacher model explains its reasoning step by step, and a small student model learns to reason from those explanations.">
<path d="M125 55 L145 55" class="fg-line"/>
<path d="M255 55 L275 55" class="fg-accent"/>
<rect x="5" y="30" width="120" height="50" rx="6" class="fg-box"/>
<rect x="145" y="30" width="110" height="50" rx="6" class="fg-box"/>
<rect x="275" y="30" width="120" height="50" rx="6" class="fg-hot"/>
<text x="65" y="52" text-anchor="middle" class="fg-text">Teacher</text>
<text x="65" y="70" text-anchor="middle" class="fg-label">large model</text>
<text x="200" y="52" text-anchor="middle" class="fg-text">Explains</text>
<text x="200" y="70" text-anchor="middle" class="fg-label">step by step</text>
<text x="335" y="52" text-anchor="middle" class="fg-strong">Student</text>
<text x="335" y="70" text-anchor="middle" class="fg-label">small model</text>
</svg>
<figcaption>Explanation tuning passes a large model’s step-by-step reasoning to a small one, the distillation idea many later open models share.</figcaption>
</figure>

[Microsoft Research Orca 2](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

## Early commercially usable open models

Licence terms decide whether a promising pilot can go into production. These four made commercial use of open models possible, and their mixed licences show why you check the exact variant as well as the family.

### Falcon

Technology Innovation Institute (TII), Abu Dhabi

**What it is:** A family of LLMs that started with Falcon-7B, Falcon-40B, and Falcon-180B, trained on the RefinedWeb dataset, and has since grown into Falcon 2, Falcon 3, Falcon Mamba, and the hybrid Falcon-H1 series.

**Why it matters:** Falcon-7B and Falcon-40B were among the first strong open models released under Apache 2.0, including commercial use. The licences have since diverged: Falcon-180B ships under the Falcon-180B TII License and acceptable use policy, and the newer releases use TII’s own Falcon licence, so read the terms for the exact model you plan to deploy.

<figure class="post-fig">
<svg viewBox="0 0 400 160" role="img" aria-label="One Falcon family, three sets of licence terms: Apache 2.0 for Falcon-7B and Falcon-40B, the Falcon-180B TII License for 180B, and TII’s own Falcon licence for newer releases.">
<path d="M200 50 L70 102" class="fg-line"/>
<path d="M200 50 L200 102" class="fg-line"/>
<path d="M200 50 L330 102" class="fg-line"/>
<rect x="135" y="10" width="130" height="40" rx="6" class="fg-hot"/>
<rect x="6" y="102" width="128" height="46" rx="6" class="fg-box"/>
<rect x="136" y="102" width="128" height="46" rx="6" class="fg-box"/>
<rect x="266" y="102" width="128" height="46" rx="6" class="fg-box"/>
<text x="200" y="36" text-anchor="middle" class="fg-strong">Falcon</text>
<text x="70" y="122" text-anchor="middle" class="fg-text">7B and 40B</text>
<text x="70" y="140" text-anchor="middle" class="fg-label">Apache 2.0</text>
<text x="200" y="122" text-anchor="middle" class="fg-text">180B</text>
<text x="200" y="140" text-anchor="middle" class="fg-label">180B licence</text>
<text x="330" y="122" text-anchor="middle" class="fg-text">Newer models</text>
<text x="330" y="140" text-anchor="middle" class="fg-label">Falcon licence</text>
</svg>
<figcaption>Read the licence of the exact model you plan to deploy, because terms differ within one family.</figcaption>
</figure>

[Falcon LLM official site](https://falconllm.tii.ae/)

### MPT models

MosaicML, now part of Databricks

**What it is:** A series of open LLMs (MPT-7B, MPT-30B) built for efficient training and long context windows. MosaicML was acquired by Databricks in 2023.

**Why it matters:** MPT showed early how ALiBi positional encoding lets a model fine-tune and extrapolate to long contexts; its StoryWriter variant was demonstrated at 84k tokens. The licences vary by variant, which is a lesson in itself.

> MPT-7B Base: Apache-2.0. MPT-7B-StoryWriter-65k+: Apache-2.0. MPT-7B-Instruct: CC-By-SA-3.0. MPT-7B-Chat: CC-By-NC-SA-4.0 (non-commercial use only).
>
> Source: [Databricks, "Introducing MPT-7B", May 2023](https://www.databricks.com/blog/mpt-7b)

[Databricks MPT-7B announcement](https://www.databricks.com/blog/mpt-7b)

### Dolly 2.0

Databricks

**What it is:** A 12B-parameter instruction-following model, billed at launch as the first open-source instruction-tuned LLM licensed for commercial use, fine-tuned on databricks-dolly-15k, a set of 15,000 human-written instruction and response pairs written by Databricks employees.

**Why it matters:** Dolly 2.0 broke the chicken-and-egg problem of instruction-tuned models requiring proprietary instruction datasets. The dataset was released under a Creative Commons Attribution-ShareAlike licence that permits commercial use, and it fed a wave of open instruction-tuned models that followed.

[Databricks Dolly 2.0 announcement](https://www.databricks.com/blog/2023/04/12/dolly-first-open-commercially-viable-instruction-tuned-llm)

### XGen-7B

Salesforce AI Research

**What it is:** A 7-billion-parameter LLM trained on 1.5 trillion tokens with an 8K context window, built for long-sequence tasks such as summarising long documents and dialogues.

**Why it matters:** XGen showed that a small model trained on more data, with a staged approach to longer contexts, could match or beat open models of its day such as MPT, Falcon and LLaMA on standard benchmarks. The “small model, lots of data” strategy has since gone mainstream.

> XGen-7B: 7 billion parameters, 1.5 trillion training tokens, 8,192-token context; base models open-sourced under Apache-2.0.
>
> Source: [Salesforce, "Long sequence modeling with XGen", 2023](https://www.salesforce.com/blog/xgen/)

[Salesforce AI Research XGen](https://www.salesforce.com/blog/xgen/)

## Today’s open-weight families

These are the models most likely to take over part of a workload you now pay an API for, and two of them are strong well beyond English.

### Qwen

Alibaba Cloud, Qwen team

**What it is:** Alibaba’s open-weight LLM family. The current generation, Qwen3.5, spans eight vision-language models from under 1B parameters up to a 397B mixture-of-experts flagship.

> Qwen3.5-397B-A17B has 397 billion parameters, 17 billion active per token. The open-weights models are available under the Apache 2.0 licence and support 201 languages.
>
> Source: [DeepLearning.AI, The Batch, on Alibaba’s Qwen3.5 release, 2026](https://www.deeplearning.ai/the-batch/alibabas-latest-flagship-models-are-open-weights-moe-performers-in-sizes-from-less-than-1b-parameters)

**Why it matters:** Qwen has become one of the most widely used open model families on Hugging Face, with a huge number of fine-tuned derivatives. Its broad language coverage makes it a serious candidate for multilingual work, and it remains the obvious first test for any application targeting Chinese-speaking markets.

[Qwen LLM official site](https://qwenlm.github.io/)

### Mistral 7B, Mixtral and their successors

Mistral AI (Paris)

**What it is:** Mistral 7B was a dense 7-billion-parameter model that outperformed Llama 2 13B at release. Mixtral 8x7B followed as a sparse mixture-of-experts (MoE) model with about 47B total parameters but only 13B active per token.

<figure class="post-fig">
<svg viewBox="0 0 400 150" role="img" aria-label="In Mixtral’s mixture-of-experts design, each token goes to a small share of active experts while most of the model stays idle for that token.">
<path d="M145 75 L215 35" class="fg-dim" stroke-dasharray="4 4"/>
<path d="M145 75 L215 115" class="fg-accent"/>
<rect x="15" y="55" width="130" height="40" rx="6" class="fg-box"/>
<rect x="215" y="12" width="180" height="46" rx="6" class="fg-box"/>
<rect x="215" y="92" width="180" height="46" rx="6" class="fg-hot"/>
<text x="80" y="81" text-anchor="middle" class="fg-strong">One token</text>
<text x="305" y="32" text-anchor="middle" class="fg-text">Idle experts</text>
<text x="305" y="50" text-anchor="middle" class="fg-label">most of the model</text>
<text x="305" y="112" text-anchor="middle" class="fg-strong">Active experts</text>
<text x="305" y="130" text-anchor="middle" class="fg-label">a small share</text>
</svg>
<figcaption>Mixtral holds many parameters in total and puts only a small share of them to work on each token.</figcaption>
</figure>

**Why it matters:** Mistral changed what European AI looks like, and Mixtral helped bring the MoE architecture into the open-weight mainstream. For anyone building production systems in Europe, Mistral offers an EU-based provider. Its current line-up mixes open-weight models (Mistral Large 3, Mistral Small 4 and the Ministral 3 series under Apache 2.0) with Mistral Medium 3.5 under a modified MIT licence.

[Mistral AI official site](https://mistral.ai/)

### Phi-3 and Phi-4

Microsoft

**What it is:** A series of small language models built for low-latency and on-device use. Phi-4 (14B, released December 2024) competes with much larger models on reasoning and maths thanks to carefully curated and synthetic training data, and the family now includes Phi-4-mini and Phi-4-multimodal.

**Why it matters:** Phi makes the case that data quality can beat data quantity. The smaller variants run on a laptop or an edge device, which makes them strong candidates for local AI applications, privacy-sensitive workloads, and offline use.

[Microsoft Phi family](https://azure.microsoft.com/en-us/products/phi)

<aside class="post-cta">
<p><strong>Weighing an open model against a paid API for your multilingual content?</strong> Our <a href="/services/ai-consulting/">AI consulting</a> says which parts of your workflow a model can take on in each language, and which still need a person who reads it. <a href="/contact/">Book the discovery call</a>.</p>
</aside>

## Licences at a glance

Build on a model whose licence covers your use, and the work lasts. Check the row before you check the benchmark.

| Model | Maker | Licence, as checked | Good fit for |
|---|---|---|---|
| BLOOM | BigScience | BigScience RAIL v1.0, with use restrictions | Research, low-resource languages |
| OpenAssistant | LAION | oasst2 dataset: Apache 2.0 | Training and evaluating chat models |
| Orca 2 | Microsoft Research | Custom Microsoft licence | Research on small-model reasoning |
| Falcon | TII | Apache 2.0 for 7B and 40B; TII licences for 180B and newer | Check per model |
| MPT | Databricks | Apache 2.0 for the base model; some variants non-commercial | Long-context experiments |
| Dolly 2.0 | Databricks | Released for commercial use | Instruction-tuning reference |
| XGen-7B | Salesforce | Apache 2.0 for base models | Long-document summarising |
| Qwen3.5 | Alibaba Cloud | Apache 2.0 | Multilingual, Chinese markets |
| Mistral open models | Mistral AI | Apache 2.0 (Large 3, Small 4, Ministral 3) | European deployment |
| Phi-4 | Microsoft | MIT | On-device and local AI |

> Licence tags on Hugging Face, checked 26 September 2026: microsoft/phi-4, MIT; microsoft/Orca-2-13b, other (a custom licence); OpenAssistant/oasst2 dataset, Apache 2.0.
>
> Source: [Hugging Face, microsoft/phi-4](https://huggingface.co/microsoft/phi-4), [microsoft/Orca-2-13b](https://huggingface.co/microsoft/Orca-2-13b) and [OpenAssistant/oasst2](https://huggingface.co/datasets/OpenAssistant/oasst2), 2026

The other licences come from each project’s own pages, linked in its section above.

## Match each task to the right model

Matching each task to the right model often saves money over sending everything to the latest frontier model. The “best” LLM is the one that fits your use case at a sensible cost.

Doing multilingual SEO and translation? Test Qwen and Mistral’s open models on your language pairs, and look at BLOOM’s documentation for low-resource languages. Building an on-device feature? Phi-4-mini and the Ministral 3 models run on consumer hardware. Need commercial-friendly licensing? Check each model’s own licence: Falcon-40B, MPT-7B Base, XGen-7B and the current Qwen and Mistral open-weight models use Apache 2.0, while other variants in the same families use different terms.

The strategic point is that the LLM space has room for many winners. The household names dominate consumer mindshare, but the underlying infrastructure of AI is being shaped, in real time, by lesser-known models like these. Knowing them gives you options beyond the headlines.

<figure class="post-fig">
<svg viewBox="0 0 400 140" role="img" aria-label="Three questions that narrow the field of language models: does the licence allow our use, does it handle our language, can it run where we need it.">
<rect x="10" y="10" width="380" height="34" rx="6" class="fg-box"/>
<rect x="50" y="54" width="300" height="34" rx="6" class="fg-box"/>
<rect x="100" y="98" width="200" height="34" rx="6" class="fg-hot"/>
<text x="200" y="32" text-anchor="middle" class="fg-text">Licence allows our use?</text>
<text x="200" y="76" text-anchor="middle" class="fg-text">Handles our language?</text>
<text x="200" y="120" text-anchor="middle" class="fg-text">Runs where needed?</text>
</svg>
<figcaption>Each question narrows the field sharply, leaving a short list worth testing on your own content.</figcaption>
</figure>

If you are picking an LLM in 2026, ask three questions. Does the licence allow what we actually want to do? Does the model handle our target language well? Can we run it where we need it to run, including on-device? In our experience of helping clients pick AI stacks, the answers narrow the field to a short list very quickly.

For more on how AI is reshaping search and content work, see our pieces on [how AI is revolutionising SEO](/blog/how-ai-is-revolutionising-seo-strategies/) and [how AI is transforming translation and localization](/blog/how-ai-is-transforming-translation-and-localisation/).

## Pick the right AI stack for your business

The right model choice keeps paying off for months: a licence that covers your use, a bill that stays in proportion as usage grows, and language your customers read as natural. We help businesses get all three, from picking the right LLM for multilingual content to fitting AI into existing SEO and translation workflows, with advice grounded in production reality.

[Talk through your AI stack with us](/contact/)
