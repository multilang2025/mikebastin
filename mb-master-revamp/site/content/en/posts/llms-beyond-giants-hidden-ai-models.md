---
words: 1309
title: "LLMs beyond ChatGPT worth knowing"
slug: "llms-beyond-giants-hidden-ai-models"
locale: "en"
type: "posts"
group: "g144"
wpId: 24855595
date: "2025-12-16T13:46:54"
modified: "2026-09-26"
sourceUrl: "https://mikebastin.com/llms-beyond-giants-hidden-ai-models/"
excerpt: "While ChatGPT and Gemini dominate headlines, the LLM field is rich with lesser-known models worth knowing about. We cover 10 impactful LLMs redefining AI beyond the giants."
---

## Why look beyond ChatGPT in 2026

When we talk about large language models, the conversation defaults to ChatGPT, Claude, Gemini, and Llama. Those four dominate headlines, budgets, and the API calls of most production workloads.

The LLM space in 2026 is far more interesting than that headline list suggests. A vibrant ecosystem of specialised, multilingual, open-source, and research-grade models is shaping AI in ways that the household names cannot.

Some matter for multilingual SEO and translation work, where models with strong non-English coverage can beat bigger English-first models on specific language pairs. Others matter because they are genuinely open-source and commercially usable, which many “open” models are not. A few simply matter because they pioneered ideas that everyone else has since copied.

Here are ten LLMs worth knowing in 2026, grouped by why they matter, with links to their official sources so you can dig deeper. Licences and model line-ups change fast, so the details below were checked against each project’s own pages on 26 September 2026.

**Why this matters in 2026:** the frontier leaderboard is dominated by closed models from OpenAI, Anthropic, and Google, and the open-weight world by a handful of large families. Underneath those headlines, dozens of open and specialised models are doing critical work in research, multilingual NLP, and on-device inference. If you are building something that does not need frontier-class reasoning, a smaller open model often fits your use case better and costs a fraction.

## Open-science and research models

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

[Microsoft Research Orca 2](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

## Early commercially usable open models

### Falcon

Technology Innovation Institute (TII), Abu Dhabi

**What it is:** A family of LLMs that started with Falcon-7B, Falcon-40B, and Falcon-180B, trained on the RefinedWeb dataset, and has since grown into Falcon 2, Falcon 3, Falcon Mamba, and the hybrid Falcon-H1 series.

**Why it matters:** Falcon-7B and Falcon-40B were among the first strong open models released under Apache 2.0, including commercial use. The licences have since diverged: Falcon-180B ships under the Falcon-180B TII License and acceptable use policy, and the newer releases use TII’s own Falcon licence, so read the terms for the exact model you plan to deploy.

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

**Why it matters:** Mistral changed what European AI looks like, and Mixtral helped bring the MoE architecture into the open-weight mainstream. For anyone building production systems in Europe, Mistral offers an EU-based provider. Its current line-up mixes open-weight models (Mistral Large 3, Mistral Small 4 and the Ministral 3 series under Apache 2.0) with Mistral Medium 3.5 under a modified MIT licence.

[Mistral AI official site](https://mistral.ai/)

### Phi-3 and Phi-4

Microsoft

**What it is:** A series of small language models built for low-latency and on-device use. Phi-4 (14B, released December 2024) competes with much larger models on reasoning and maths thanks to carefully curated and synthetic training data, and the family now includes Phi-4-mini and Phi-4-multimodal.

**Why it matters:** Phi makes the case that data quality can beat data quantity. The smaller variants run on a laptop or an edge device, which makes them strong candidates for local AI applications, privacy-sensitive workloads, and offline use.

[Microsoft Phi family](https://azure.microsoft.com/en-us/products/phi)

## Licences at a glance

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

## What this list means for your AI strategy

The “best” LLM is the one that fits your specific use case at an economical cost. For many business applications, you do not need the latest frontier model at all.

Doing multilingual SEO and translation? Test Qwen and Mistral’s open models on your language pairs, and look at BLOOM’s documentation for low-resource languages. Building an on-device feature? Phi-4-mini and the Ministral 3 models run on consumer hardware. Need commercial-friendly licensing? Check each model’s licence rather than the family’s: Falcon-40B, MPT-7B Base, XGen-7B and the current Qwen and Mistral open-weight models use Apache 2.0, while other variants in the same families do not.

The strategic point is that the LLM space is not winner-take-all. The household names dominate consumer mindshare, but the underlying infrastructure of AI is being shaped, in real time, by lesser-known models like these. Knowing them gives you options the headlines cannot offer.

<figure class="post-fig">
<svg viewBox="0 0 400 140" role="img" aria-label="Three questions that narrow the field of language models: does the licence allow our use, does it handle our language, can it run where we need it.">
<rect x="10" y="10" width="380" height="34" rx="6" class="fg-box"/>
<rect x="50" y="54" width="300" height="34" rx="6" class="fg-box"/>
<rect x="100" y="98" width="200" height="34" rx="6" class="fg-hot"/>
<text x="200" y="32" text-anchor="middle" class="fg-text">Licence allows our use?</text>
<text x="200" y="76" text-anchor="middle" class="fg-text">Handles our language?</text>
<text x="200" y="120" text-anchor="middle" class="fg-text">Runs where needed?</text>
</svg>
<figcaption>Each question removes a large share of the candidates, so what is left is a short list worth testing on your own content.</figcaption>
</figure>

If you are picking an LLM in 2026, ask three questions. Does the licence allow what we actually want to do? Does the model handle our target language well? Can we run it where we need it to run, including on-device? In our experience of helping clients pick AI stacks, the answers eliminate most of the field very quickly.

For more on how AI is reshaping search and content work, see our pieces on [how AI is revolutionising SEO](/blog/how-ai-is-revolutionising-seo-strategies/) and [how AI is transforming translation and localization](/blog/how-ai-is-transforming-translation-and-localisation/).

## Need help picking the right AI stack for your business?

We help businesses find their way through the AI market, from picking the right LLM for multilingual content to integrating AI into existing SEO and translation workflows. Get advice that is grounded in production reality, not vendor marketing.

[Get in touch](/contact/)
