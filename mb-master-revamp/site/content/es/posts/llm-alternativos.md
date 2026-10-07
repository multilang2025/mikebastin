---
words: 2457
title: "LLM alternativos a ChatGPT: diez modelos que conviene conocer"
metaTitle: "LLM alternativos a ChatGPT: diez modelos a conocer"
slug: "llm-alternativos"
locale: "es"
type: "posts"
group: "g144"
wpId: null
date: "2026-10-03"
modified: "2026-10-03"
sourceUrl: null
excerpt: "Diez LLM alternativos a ChatGPT, para qué sirve cada uno y qué licencia revisar, para pagar el precio justo por tus tareas de IA rutinarias."
---

## Modelos de lenguaje que puedes usar además de ChatGPT

Puede que tu equipo esté pagando tarifas de modelo puntero por trabajo que un modelo más pequeño haría igual de bien. En algunos de tus idiomas, un modelo menos conocido quizá traduzca mejor que el que usas hoy. Si tu empresa vende en Francia, el Benelux, Alemania o el Reino Unido, mirar más allá de ChatGPT, Claude, Gemini y Llama abarata el trabajo rutinario y puede subir la calidad en los mercados que peor atienden los modelos pensados primero para el inglés.

Aquí tienes diez modelos agrupados según su interés, con las condiciones de licencia que debes revisar antes de construir sobre ellos.

## Tres motivos para mirar más allá de ChatGPT

Algunos importan para el SEO multilingüe y la traducción, donde los modelos con buena cobertura de idiomas distintos del inglés pueden superar, en pares de idiomas concretos, a modelos más grandes centrados en el inglés. Otros importan porque son de código abierto de verdad y admiten uso comercial, un listón más alto del que cumplen muchos modelos llamados «abiertos». Y unos cuantos introdujeron ideas que después ha copiado todo el sector.

Cada ficha enlaza a su fuente oficial. Las licencias y las gamas de modelos cambian deprisa, así que los datos de abajo se comprobaron en las páginas de cada proyecto el 26 de septiembre de 2026.

La cabeza de la clasificación pertenece a modelos cerrados de OpenAI, Anthropic y Google. Para tareas que piden menos que un razonamiento de primer nivel, un modelo abierto más pequeño suele encajar mejor y cuesta una fracción.

## Modelos de ciencia abierta e investigación

Estos modelos sirven sobre todo como referencia: explican el comportamiento de los modelos abiertos que podrías desplegar.

### BLOOM

Taller de investigación BigScience, una colaboración internacional de ciencia abierta

**Qué es:** un LLM multilingüe de acceso abierto con 176.000 millones de parámetros, entrenado en 46 lenguas naturales y 13 lenguajes de programación.

> BLOOM: 176.247.271.424 parámetros, 46 lenguas naturales y 13 lenguajes de programación, publicado con la licencia BigScience RAIL v1.0.
>
> Fuente: [Hugging Face, ficha del modelo bigscience/bloom, 2022](https://huggingface.co/bigscience/bloom)

**Por qué importa:** sus checkpoints, la documentación de sus datos y los detalles del entrenamiento son públicos, lo que lo convierte en una referencia para quienes investigan el comportamiento de los LLM y su cobertura multilingüe. Su licencia RAIL incluye restricciones de uso, por lo que es un modelo de acceso abierto, y de código abierto solo en sentido amplio.

[BLOOM en Hugging Face](https://huggingface.co/bigscience/bloom)

### OpenAssistant

LAION

**Qué es:** un proyecto de IA conversacional impulsado por la comunidad y totalmente de código abierto, acompañado de los conjuntos de datos de instrucciones OASST, recogidos entre miles de voluntarios.

**Por qué importa:** LAION dio el proyecto por terminado el 25 de octubre de 2023, pero el conjunto de datos final oasst2 sigue en Hugging Face y todavía se usa para ajustar y evaluar modelos de chat abiertos.

[OpenAssistant en Hugging Face](https://huggingface.co/OpenAssistant)

### Orca 2

Microsoft Research

**Qué es:** un modelo pequeño (variantes de 7.000 y 13.000 millones de parámetros) entrenado en estrategias de razonamiento a partir de las explicaciones paso a paso de modelos maestros más grandes.

> Orca 2 supera con claridad a modelos de tamaño similar (incluido el modelo Orca original) y alcanza niveles de rendimiento iguales o superiores a los de modelos de 5 a 10 veces su tamaño, en tareas complejas que ponen a prueba capacidades avanzadas de razonamiento sin ejemplos previos.
>
> Fuente: [Microsoft Research blog, «Orca 2: teaching small language models how to reason», 20 de noviembre de 2023](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

**Por qué importa:** Orca popularizó el «explanation tuning», en el que un modelo aprende a razonar paso a paso con demostraciones de un maestro. La misma idea de destilación recorre muchos de los modelos abiertos pequeños que llegaron después.

[Orca 2 en Microsoft Research](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

## Primeros modelos abiertos con uso comercial

Las condiciones de licencia deciden si un piloto prometedor puede pasar a producción. Estas cuatro familias abrieron la puerta al uso comercial de modelos abiertos, y sus licencias mixtas enseñan por qué hay que revisar la variante exacta además de la familia.

### Falcon

Technology Innovation Institute (TII), Abu Dabi

**Qué es:** una familia de LLM que empezó con Falcon-7B, Falcon-40B y Falcon-180B, entrenados con el conjunto de datos RefinedWeb, y que desde entonces ha sumado Falcon 2, Falcon 3, Falcon Mamba y la serie híbrida Falcon-H1.

**Por qué importa:** Falcon-7B y Falcon-40B estuvieron entre los primeros modelos abiertos potentes publicados con Apache 2.0, con uso comercial incluido. Las licencias se han separado desde entonces: Falcon-180B se distribuye con la Falcon-180B TII License y su política de uso aceptable, y las versiones nuevas usan la licencia Falcon propia de TII. Lee las condiciones del modelo exacto que piensas desplegar.

[Web oficial de Falcon LLM](https://falconllm.tii.ae/)

### Modelos MPT

MosaicML, hoy parte de Databricks

**Qué es:** una serie de LLM abiertos (MPT-7B, MPT-30B) diseñados para un entrenamiento eficiente y ventanas de contexto largas. Databricks compró MosaicML en 2023.

**Por qué importa:** MPT mostró pronto cómo la codificación posicional ALiBi permite ajustar un modelo y extrapolarlo a contextos largos; su variante StoryWriter se presentó con 84.000 tokens. Las licencias cambian según la variante:

> MPT-7B Base: Apache-2.0. MPT-7B-StoryWriter-65k+: Apache-2.0. MPT-7B-Instruct: CC-By-SA-3.0. MPT-7B-Chat: CC-By-NC-SA-4.0 (solo uso no comercial).
>
> Fuente: [Databricks, «Introducing MPT-7B», mayo de 2023](https://www.databricks.com/blog/mpt-7b)

[Anuncio de MPT-7B de Databricks](https://www.databricks.com/blog/mpt-7b)

### Dolly 2.0

Databricks

**Qué es:** un modelo de 12.000 millones de parámetros que sigue instrucciones, presentado en su lanzamiento como el primer LLM de código abierto ajustado con instrucciones y con licencia para uso comercial. Se ajustó con databricks-dolly-15k, un conjunto de 15.000 pares de instrucción y respuesta escritos por empleados de Databricks.

**Por qué importa:** hasta entonces, ajustar un modelo con instrucciones exigía conjuntos de datos propietarios. El de Dolly se publicó con una licencia Creative Commons Attribution-ShareAlike que permite el uso comercial, y alimentó toda una ola de modelos abiertos.

[Anuncio de Dolly 2.0 de Databricks](https://www.databricks.com/blog/2023/04/12/dolly-first-open-commercially-viable-instruction-tuned-llm)

### XGen-7B

Salesforce AI Research

**Qué es:** un LLM de 7.000 millones de parámetros pensado para tareas de secuencias largas como resumir documentos y diálogos extensos.

**Por qué importa:** XGen demostró que un modelo pequeño entrenado con más datos, y con un aumento escalonado hacia contextos más largos, podía igualar o superar a los modelos abiertos de su momento como MPT, Falcon y LLaMA en las pruebas de referencia habituales.

> XGen-7B: 7.000 millones de parámetros, 1,5 billones de tokens de entrenamiento, contexto de 8.192 tokens; modelos base publicados en código abierto con Apache-2.0.
>
> Fuente: [Salesforce, «Long sequence modeling with XGen», 2023](https://www.salesforce.com/blog/xgen/)

[XGen en Salesforce AI Research](https://www.salesforce.com/blog/xgen/)

## Las familias de pesos abiertos de hoy

Son los modelos con más opciones de asumir parte del trabajo por el que hoy pagas una API, y dos de ellos rinden bien mucho más allá del inglés.

### Qwen

Alibaba Cloud, equipo Qwen

**Qué es:** la familia de LLM de pesos abiertos de Alibaba. La generación actual, Qwen3.5, abarca ocho modelos de visión y lenguaje, desde menos de 1.000 millones de parámetros hasta un modelo insignia de mezcla de expertos de 397.000 millones.

> Qwen3.5-397B-A17B tiene 397.000 millones de parámetros, 17.000 millones activos por token. Los modelos de pesos abiertos están disponibles con licencia Apache 2.0 y admiten 201 idiomas.
>
> Fuente: [DeepLearning.AI, The Batch, sobre el lanzamiento de Qwen3.5 de Alibaba, 2026](https://www.deeplearning.ai/the-batch/alibabas-latest-flagship-models-are-open-weights-moe-performers-in-sizes-from-less-than-1b-parameters)

**Por qué importa:** Qwen se ha convertido en una de las familias de modelos abiertos más usadas en Hugging Face, con un número enorme de derivados ajustados. Su amplia cobertura de idiomas lo convierte en un candidato serio para el trabajo multilingüe, y la primera prueba obvia para cualquier aplicación dirigida a mercados de habla china.

[Web oficial de Qwen](https://qwenlm.github.io/)

### Mistral 7B, Mixtral y sus sucesores

Mistral AI (París)

**Qué es:** Mistral 7B era un modelo denso de 7.000 millones de parámetros que superaba a Llama 2 13B en su lanzamiento. Después llegó Mixtral 8x7B, un modelo disperso de mezcla de expertos (MoE) con unos 47.000 millones de parámetros en total, pero solo 13.000 millones activos por token.

**Por qué importa:** Mixtral ayudó a llevar la arquitectura MoE al centro de los modelos de pesos abiertos. Si tu empresa pone sistemas en producción en España o en otro país de la UE, Mistral te ofrece un proveedor con sede en la Unión Europea, en París. Su gama actual combina modelos de pesos abiertos (Mistral Large 3, Mistral Small 4 y la serie Ministral 3 con Apache 2.0) con Mistral Medium 3.5, con una licencia MIT modificada.

[Web oficial de Mistral AI](https://mistral.ai/)

### Phi-3 y Phi-4

Microsoft

**Qué es:** una serie de modelos de lenguaje pequeños diseñados para baja latencia y uso en el propio dispositivo. Phi-4 (14.000 millones de parámetros, publicado en diciembre de 2024) compite con modelos mucho mayores en razonamiento y matemáticas gracias a datos de entrenamiento seleccionados y sintéticos. La familia incluye ya Phi-4-mini y Phi-4-multimodal.

**Por qué importa:** Phi demuestra que la calidad de los datos puede pesar más que la cantidad. Las variantes más pequeñas funcionan en un portátil o en un dispositivo periférico, lo que las convierte en buenas candidatas para la IA local, los datos sensibles y el uso sin conexión.

[La familia Phi de Microsoft](https://azure.microsoft.com/en-us/products/phi)

<aside class="post-cta">
<p><strong>El reparto justo entre modelo abierto y API de pago para tu contenido multilingüe.</strong> Nuestra consultoría de inteligencia artificial te dice qué partes de tu flujo de trabajo puede asumir un modelo en cada idioma, y cuáles siguen pidiendo una persona que lea ese idioma. <a href="/es/services/consultoria-de-inteligencia-artificial/">Conoce nuestra consultoría de IA</a> o <a href="/es/contactanos/">reserva la primera llamada</a>.</p>
</aside>

## Las licencias de un vistazo

Revisa la fila de la tabla antes de lanzar la prueba de rendimiento: un modelo cuya licencia cubre tu uso te ahorra reconstruirlo todo más adelante.

| Modelo | Creador | Licencia, según se comprobó | Encaja bien con |
|---|---|---|---|
| BLOOM | BigScience | BigScience RAIL v1.0, con restricciones de uso | Investigación, idiomas con pocos recursos |
| OpenAssistant | LAION | Conjunto de datos oasst2: Apache 2.0 | Entrenar y evaluar modelos de chat |
| Orca 2 | Microsoft Research | Licencia propia de Microsoft | Investigación sobre razonamiento en modelos pequeños |
| Falcon | TII | Apache 2.0 para 7B y 40B; licencias TII para 180B y las versiones nuevas | Revisar modelo a modelo |
| MPT | Databricks | Apache 2.0 para el modelo base; algunas variantes solo para uso no comercial | Pruebas con contexto largo |
| Dolly 2.0 | Databricks | Publicado para uso comercial | Referencia para el ajuste con instrucciones |
| XGen-7B | Salesforce | Apache 2.0 para los modelos base | Resumen de documentos largos |
| Qwen3.5 | Alibaba Cloud | Apache 2.0 | Multilingüe, mercados chinos |
| Modelos abiertos de Mistral | Mistral AI | Apache 2.0 (Large 3, Small 4, Ministral 3) | Despliegue en Europa |
| Phi-4 | Microsoft | MIT | IA en el dispositivo y en local |

> Etiquetas de licencia en Hugging Face, comprobadas el 26 de septiembre de 2026: microsoft/phi-4, MIT; microsoft/Orca-2-13b, other (una licencia propia); conjunto de datos OpenAssistant/oasst2, Apache 2.0.
>
> Fuente: [Hugging Face, microsoft/phi-4](https://huggingface.co/microsoft/phi-4), [microsoft/Orca-2-13b](https://huggingface.co/microsoft/Orca-2-13b) y [OpenAssistant/oasst2](https://huggingface.co/datasets/OpenAssistant/oasst2), 2026

Las demás licencias proceden de las páginas de cada proyecto, enlazadas en su sección más arriba.

## El modelo adecuado para cada tarea

Asignar a cada tarea el modelo adecuado suele costar menos que enviarlo todo al último modelo puntero.

¿Trabajas en SEO multilingüe y traducción? Prueba Qwen y los modelos abiertos de Mistral con tus pares de idiomas, por ejemplo del español al francés, al neerlandés o al alemán, y consulta la documentación de BLOOM para los idiomas con pocos recursos. Nuestra guía de [herramientas de IA y traducción automática](/es/herramientas-ia-traduccion-automatica/) muestra dónde colocar la revisión humana, y nuestro servicio de [posedición de traducción automática](/es/services/posedicion-de-ia/) la pone en manos de revisores nativos. ¿Construyes una función en el dispositivo? Phi-4-mini y los modelos Ministral 3 funcionan en hardware de consumo. ¿Necesitas una licencia apta para uso comercial? Revisa la licencia propia de cada modelo: Falcon-40B, MPT-7B Base, XGen-7B y los modelos de pesos abiertos actuales de Qwen y Mistral usan Apache 2.0, mientras que otras variantes de las mismas familias tienen condiciones distintas.

<figure class="post-fig">
<svg viewBox="0 0 400 140" role="img" aria-label="Tres preguntas que acotan la elección de un modelo de lenguaje: si la licencia permite nuestro uso, si maneja nuestro idioma y si funciona donde lo necesitamos.">
<rect x="10" y="10" width="380" height="34" rx="6" class="fg-box"/>
<rect x="50" y="54" width="300" height="34" rx="6" class="fg-box"/>
<rect x="100" y="98" width="200" height="34" rx="6" class="fg-hot"/>
<text x="200" y="32" text-anchor="middle" class="fg-text">¿La licencia cubre nuestro uso?</text>
<text x="200" y="76" text-anchor="middle" class="fg-text">¿Maneja nuestro idioma?</text>
<text x="200" y="120" text-anchor="middle" class="fg-text">¿Funciona donde toca?</text>
</svg>
<figcaption>Cada pregunta acota mucho la elección y deja una lista corta que vale la pena probar con tu propio contenido.</figcaption>
</figure>

Para elegir un LLM, hazte tres preguntas. ¿La licencia permite lo que de verdad queremos hacer? ¿El modelo maneja bien nuestro idioma de destino? ¿Podemos ejecutarlo donde lo necesitamos, incluido el propio dispositivo?

La elección del modelo también pesa en tu visibilidad: nuestros artículos sobre [cómo la IA renueva las estrategias SEO](/es/ia-y-estrategias-seo/) y sobre [la IA en traducción y localización](/es/ia-traduccion-y-localizacion/) muestran cómo la IA cambia la búsqueda y la producción de contenido.

<aside class="post-cta">
<p><strong>Un modelo adaptado a tus idiomas, una licencia que cubre tu uso y una factura proporcionada.</strong> Ayudamos a las empresas a elegir el LLM adecuado para su contenido multilingüe y a integrarlo en sus flujos de SEO y traducción. <a href="/es/contactanos/">Cuéntanos tu proyecto</a>.</p>
</aside>
