/**
 * Featured images for the journal, in all three languages.
 *
 * Generated with Higgsfield (gpt_image_2_5) on 8 Oct 2026, replacing a mix
 * of legacy WordPress stock, Commons photographs, one Unsplash photo and
 * the owner's BlogIllustrator renders. The owner asked for "relevant
 * images, with some branding effect on them so they are in harmony with
 * the website, and between each other", then for "some human touch (faces,
 * bodies, hands, arms)". So every one is the same kind of picture: a
 * person's hands, arms or profile at work on paper objects that stand for
 * the post's subject, on the site's cream, in its navy, with a single
 * berry accent and no lettering, stamped with the MB mark bottom left by
 * scripts/brand-blog-images.mjs. The shared style prompt and each scene
 * are in docs/BRANDED-IMAGE-PROMPTS.md. `components/PostArt.tsx` stays as
 * the fallback for a post with no entry here.
 *
 * 74 entries: the 52 published English posts, the hand-built
 * competitor-analysis-traffic-checklist page that the journal index
 * renders beside them, and the 21 French and Spanish posts that have no
 * English sibling (a translated post shows its English sibling's picture,
 * lib/posts.ts imageSlugFor).
 *
 * Files in public/images/blog/: <slug>.webp at 1200x630, a -640 sibling for
 * srcset, and <slug>-thumb.webp at 160x84 for the footer, where a
 * full-width image would otherwise be shipped on every page to be drawn
 * at 56px wide. The thumbnail carries no mark; at that size it is a dot.
 *
 * `alt` describes the picture rather than repeating the post title, which
 * the heading beside it already carries.
 */

export type BlogImage = {
  width: number;
  height: number;
  alt: string;
  /**
   * Where the file came from, and what rebuilds it.
   *
   * A path under the legacy site's wp-content/uploads/ for the images
   * harvested from WordPress, which scripts/fetch-legacy-images.mjs
   * refetches. A "commons:File:..." title for the public domain
   * photographs, which scripts/fetch-commons-images.mjs rebuilds. An
   * "unsplash:<id>" reference for the one photo from there, which has no
   * script behind it and was downloaded once. An "owner:<file>" reference
   * for a picture the owner supplied directly, which likewise has no
   * script behind it: the committed webp is the only copy, so
   * fetch-legacy-images.mjs skips these the way it skips the other two.
   * A "higgsfield:<job id>" reference for a generated image (the whole
   * set since 8 Oct 2026): the job's PNG is downloaded from Higgsfield
   * and run through scripts/brand-blog-images.mjs, which no fetch script
   * does, so they are skipped as well.
   */
  legacy: string;
  /**
   * Which part of the frame to keep when cropping to 1200x630.
   *
   * Only the `commons:` photographs are cropped rather than scaled, and
   * sharp's `attention` strategy, which keeps whatever it scores as most
   * interesting, decapitated two of them: it preferred a tabulating
   * machine to the woman operating it, and a desk of paperwork to the two
   * men standing over it. "top" keeps heads, which is what an archival
   * photograph of people needs; "attention" is right where the subject is
   * the object.
   */
  cropFocus?: "top" | "centre" | "attention";
  /**
   * Where a photo came from, when it is not from the legacy library.
   *
   * Recorded, not rendered. Nothing on this site carries a credit line,
   * which is the owner's decision and is why every sourced photo here is
   * either public domain, CC0, or under the Unsplash License: all three
   * owe no attribution. A photo that required one would have to be
   * credited on the page, so it does not get used.
   *
   * Recording it anyway means a file can always be traced back to who
   * made it and on what terms, which is the part that matters to whoever
   * inherits this. `licence` is what the source itself states, so a
   * future audit reads this rather than trusting the choice made here.
   */
  credit?: { author: string; source: string; sourceUrl: string; licence: string };
};

/**
 * Appended to every image URL PostImage renders. The files keep their
 * names when replaced, so without it a browser or the CDN goes on serving
 * the old picture. Bump it whenever the set is regenerated.
 */
export const BLOG_IMAGE_VERSION = "20261008";

export const BLOG_IMAGES: Record<string, BlogImage> = {
  "15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business": { width: 1200, height: 630, alt: "Hands in a cream jumper fanning out blank index cards and lifting one edged in red", legacy: "higgsfield:72e8946c-9727-485f-9690-6982965b3e1b" },
  "360-marketing-agency": { width: 1200, height: 630, alt: "A hand turning a navy paper compass rose inside a ring of small cream tiles", legacy: "higgsfield:30305071-25f8-46da-9ed0-594288cdc4f5" },
  "affiliate-marketing-programs": { width: 1200, height: 630, alt: "Two hands passing a red paper coin above a chain of navy paper rings", legacy: "higgsfield:280ac7d6-e9bd-4f77-820b-813194100246" },
  "ai-powered-marketing": { width: 1200, height: 630, alt: "A man in a white shirt holding a small navy paper robot that raises a red megaphone", legacy: "higgsfield:e77c6fde-641c-4f4e-944c-2d76e29ab41f" },
  "alternatives-to-google-analytics": { width: 1200, height: 630, alt: "A hand holding a magnifying glass over three navy bar models, the middle one topped in red", legacy: "higgsfield:b6cea86d-5389-43c4-ab9c-0ca9acf09d0e" },
  "best-practices-for-multilingual-seo": { width: 1200, height: 630, alt: "A young woman spinning a navy paper globe with speech bubbles floating around it", legacy: "higgsfield:21cfb2cb-57ba-4f4d-9d29-d01c867f9921" },
  "best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits": { width: 1200, height: 630, alt: "Hands scooping coffee beans from a navy crate with an inspection tag on red string", legacy: "higgsfield:d34ae330-83a6-459f-aaa6-5ebab99f6f8c" },
  "building-a-global-brand": { width: 1200, height: 630, alt: "A woman placing a red block on top of a tower of navy blocks beside a small globe", legacy: "higgsfield:e152de58-9864-44d9-b3d4-5251e5eaf267" },
  "chrome-extensions-for-seo": { width: 1200, height: 630, alt: "A hand clicking a red puzzle piece into the toolbar of a navy paper browser window", legacy: "higgsfield:af320ee3-6d63-42dc-9236-c0fb4749cf68" },
  "chrome-extensions-for-translators": { width: 1200, height: 630, alt: "Two hands holding a navy paper browser window with a red puzzle piece, speech bubbles below", legacy: "higgsfield:6024beef-7bdc-44a6-897b-423dc56c06ce" },
  "common-mistakes-to-avoid-when-localising-your-website": { width: 1200, height: 630, alt: "A person holding a red puzzle piece that does not fit the navy paper web page in front of them", legacy: "higgsfield:d35268a8-30ef-4687-a17f-3fd41d312ff6" },
  "competitor-analysis": { width: 1200, height: 630, alt: "A hand moving a red pawn one square ahead of three navy pawns on a chessboard", legacy: "higgsfield:40a12674-8590-4544-ab0a-b046dcaee927" },
  "competitor-analysis-traffic-checklist": { width: 1200, height: 630, alt: "A hand ticking a checklist beside two cards with rising trend lines, one in red", legacy: "higgsfield:e56244df-90b2-4170-90d4-3cf3767099b4" },
  "content-optimisation-for-spanish-users": { width: 1200, height: 630, alt: "A hand holding a navy fan above cream strips of text, one strip red", legacy: "higgsfield:f7845e72-36a8-4ad7-8dd9-a2c8694e3cf9" },
  "conversational-ai-chatbots-business": { width: 1200, height: 630, alt: "A man smiling at a small navy paper robot, two speech bubbles between them", legacy: "higgsfield:2a0279de-e2d5-400e-b873-5dea37fa2f75" },
  "digital-marketing-advisor": { width: 1200, height: 630, alt: "A hand setting a navy chess knight on an open notebook with a red ribbon", legacy: "higgsfield:ddbe17a4-9eed-473a-8d5b-e47919633a76" },
  "eeat-vs-aeat-typo": { width: 1200, height: 630, alt: "A finger nudging a red block back into a row of navy blocks, a magnifying glass beside", legacy: "higgsfield:b33b00e7-dd03-4f34-8a51-3b8942941d53" },
  "email-marketing-hacks-boosting-open-rates-and-conversions": { width: 1200, height: 630, alt: "Hands opening a cream envelope on a red paper heart, navy envelopes behind", legacy: "higgsfield:98f9c394-a4db-442a-b649-dd2959def80a" },
  "english-to-french-translation-services": { width: 1200, height: 630, alt: "A woman writing with a fountain pen beside two linked speech bubbles, one edged in red", legacy: "higgsfield:ce22d1e7-95ae-4046-a81b-8ef0bcfcb377" },
  "french-ppc-campaign": { width: 1200, height: 630, alt: "A finger pressing a red button on a cream card, a small navy Eiffel Tower behind", legacy: "higgsfield:839b3ad6-566d-49ab-a3ec-eb90c5e56520" },
  "future-of-seo": { width: 1200, height: 630, alt: "A woman looking up at a red paper star beside a navy telescope on a tripod", legacy: "higgsfield:af01413c-0f32-418d-9f5c-0c735e4dfb36" },
  "german-seo-best-practices": { width: 1200, height: 630, alt: "Hands fitting a red gear into a set of navy and cream paper gears", legacy: "higgsfield:0ea298e6-2b45-41c0-96e1-746735e0d045" },
  "german-seo-content-localisation": { width: 1200, height: 630, alt: "A hand laying a red strip on a navy paper map of Germany covered in cream text strips", legacy: "higgsfield:bbf48943-97c8-48af-9ab6-0f04b14a0249" },
  "global-business-trends": { width: 1200, height: 630, alt: "Two hands cupping a navy globe circled by a red arrow sweeping upward", legacy: "higgsfield:1cceb1cd-9070-40f6-8abd-5690cec7fcdf" },
  "google-analytics-international-marketing-limits": { width: 1200, height: 630, alt: "A woman planting a red flag on the tallest of a row of navy bars", legacy: "higgsfield:330edc42-e5bd-4603-86e5-2726566f01fe" },
  "how-ai-is-revolutionising-seo-strategies": { width: 1200, height: 630, alt: "A hand holding a magnifying glass over a red spark on a card of navy circuit lines", legacy: "higgsfield:e3b93d32-54b3-486a-83ef-ddd21237c199" },
  "how-ai-is-transforming-translation-and-localisation": { width: 1200, height: 630, alt: "Two hands holding speech bubbles joined by a navy line through a red node", legacy: "higgsfield:95a83d07-9348-4532-8bb3-20dfe19e0adc" },
  "how-to-create-a-targeted-content-strategy": { width: 1200, height: 630, alt: "A woman pinning a red arrow into the bullseye of a navy target on the wall", legacy: "higgsfield:8cc1e7ce-9595-4695-b79a-baa9e6577e3c" },
  "how-to-promote-your-local-business-on-google-maps": { width: 1200, height: 630, alt: "A shopkeeper in an apron placing a red map pin beside a small navy shopfront on a street map", legacy: "higgsfield:b985a2ee-a919-4b6f-a95b-0d1e40370902" },
  "how-to-use-ai-and-machine-translation-tools": { width: 1200, height: 630, alt: "A hand lifting a fountain pen from a navy toolbox that holds a paper robot hand", legacy: "higgsfield:5034d23c-cd4e-43d7-8a5d-bbeb2aa725e3" },
  "how-to-write-about-your-professional-background": { width: 1200, height: 630, alt: "A man writing in a lined notebook with a red ribbon, reading glasses on the table", legacy: "higgsfield:8b3f2438-a0f8-4ab6-8284-3d113898604c" },
  "human-creator-economy": { width: 1200, height: 630, alt: "A creator holding a navy camera beside a microphone and a red paper heart", legacy: "higgsfield:a14ddc79-3567-4275-917b-e887d82987b1" },
  "internal-linking-tools": { width: 1200, height: 630, alt: "Hands stretching navy thread between cream cards pinned around one red card", legacy: "higgsfield:c1d2f51c-cb01-45de-83a0-09e5c86a6a54" },
  "law-firm-seo-services": { width: 1200, height: 630, alt: "A hand setting a red magnifying glass on one pan of a navy balance, documents on the other", legacy: "higgsfield:3723ce81-8383-4378-8c46-48adb84d1e2a" },
  "link-building-in-spain": { width: 1200, height: 630, alt: "Two hands pulling a chain of navy links taut, one link red, a navy fan below", legacy: "higgsfield:bc53e34e-9549-4dad-b9dd-05b0c8b10bfb" },
  "link-selling-and-link-buying-platforms": { width: 1200, height: 630, alt: "A hand holding a price tag on red string tied to a navy chain, a balance behind", legacy: "higgsfield:b4b3bb10-ebe3-40cf-9014-8c1ff6292fe2" },
  "llms-beyond-giants-hidden-ai-models": { width: 1200, height: 630, alt: "A hand setting a small red cube in front of a row of tall navy monoliths", legacy: "higgsfield:f9c3078d-ebb7-4be8-8eef-fdc69ca087e1" },
  "localisation-testing-tools": { width: 1200, height: 630, alt: "Hands holding a navy paper phone beside a red tick and a magnifying glass", legacy: "higgsfield:0e19ee55-ee09-4a53-b6c6-64892cf005c7" },
  "mastering-the-art-of-networking": { width: 1200, height: 630, alt: "Two people shaking hands over scattered speech bubbles, one red", legacy: "higgsfield:3abe7839-f6c9-434a-a0f6-19f96352239a" },
  "most-popular-marketing-strategies": { width: 1200, height: 630, alt: "A hand setting a red megaphone on the top step of a navy podium", legacy: "higgsfield:b1283084-8194-4fa6-9df6-34cf8aac4cc8" },
  "optimising-multilingual-website-content": { width: 1200, height: 630, alt: "A woman arranging text strips into the three panels of a navy paper web page, one panel red", legacy: "higgsfield:2e46e6d9-e2cb-4a8b-a07f-e62cfe9eb349" },
  "optimising-your-website-for-valencia-based-searches": { width: 1200, height: 630, alt: "A hand pinning a coastal city map, a blood orange in the other hand", legacy: "higgsfield:d5dcb784-0646-4982-8f4a-ae02e6d17767" },
  "search-everywhere-strategy": { width: 1200, height: 630, alt: "A person holding a magnifying glass over paper device and app tiles, one tile red", legacy: "higgsfield:091d4992-3901-482c-afb2-fc2e8a9daa4a" },
  "seo-in-belgium": { width: 1200, height: 630, alt: "A hand holding a brass magnifying glass over a navy map of Belgium with one region in red", legacy: "higgsfield:56d89f3c-745a-4047-a9f7-fcc353542e70" },
  "spanish-keyword-localisation": { width: 1200, height: 630, alt: "A hand holding up a ring of navy keys with one red key, a navy fan below", legacy: "higgsfield:18f92039-4436-4ec5-b519-01aef30e172a" },
  "spanish-on-page-seo": { width: 1200, height: 630, alt: "Hands laying a red heading bar on a navy paper web page outline", legacy: "higgsfield:8a848ead-695e-4b47-8411-e11e0b369173" },
  "spanish-seo-markets": { width: 1200, height: 630, alt: "A hand placing a pin on a navy map of Latin America beside a map of Spain", legacy: "higgsfield:4c9ef760-745f-491c-a810-d083856c61ac" },
  "technical-seo-audit-checklist": { width: 1200, height: 630, alt: "A man ticking boxes on a navy clipboard checklist with a fountain pen", legacy: "higgsfield:71f5e603-e3ca-4dde-ad50-73018c34c1b8" },
  "technical-seo-considerations-for-german-websites": { width: 1200, height: 630, alt: "Hands adjusting navy and red gears inside a paper website frame with a small screwdriver", legacy: "higgsfield:fc2418f3-0a0a-4546-b470-6185b99843ad" },
  "technical-seo-for-multilingual-websites": { width: 1200, height: 630, alt: "A hand wiring three navy paper website frames to one red gear", legacy: "higgsfield:e0d6570b-9c38-4c46-91fb-50e94b005258" },
  "technical-seo-for-spanish-search-engines": { width: 1200, height: 630, alt: "A hand holding a red wrench across a paper web page, a magnifying glass beside", legacy: "higgsfield:1043bd3c-9425-47be-a3ba-d6e13b635843" },
  "user-interface-localisation-can-transform-your-global-reach": { width: 1200, height: 630, alt: "Hands holding a navy paper phone with one red tile, a globe beside it", legacy: "higgsfield:04f54092-8244-4c7b-8dde-8d8c801a3ab6" },
  "what-is-search-intent-mapping": { width: 1200, height: 630, alt: "A finger tracing a dotted route across a map from a magnifying glass to a red pin", legacy: "higgsfield:b8b75943-d503-4591-8f84-2effbfadd774" },
  // French and Spanish posts with no English sibling, each with a picture of
  // its own rather than one borrowed from the nearest English post. The alt
  // is in the post’s language.
  "agence-seo-internationale": { width: 1200, height: 630, alt: "Plusieurs mains disposent des cartes autour d’un globe bleu marine, dont une rouge", legacy: "higgsfield:1917c10a-dfd3-4f06-918d-285853ff4c5c" },
  "analizar-backlinks-competidores": { width: 1200, height: 630, alt: "Una mano sigue con una lupa un hilo azul marino entre casitas de papel hasta una casa roja", legacy: "higgsfield:a0722fee-1956-46b9-b2e2-0ebb93c874b7" },
  "analizar-trafico-web-competencia": { width: 1200, height: 630, alt: "Una persona vierte cuentas de papel por tres embudos en tarros, uno lleno de cuentas rojas", legacy: "higgsfield:505fa9f8-3805-45fb-ac1e-9526419391b5" },
  "competidores-seo": { width: 1200, height: 630, alt: "Una mano levanta un papel y descubre una pieza de ajedrez roja entre piezas azul marino", legacy: "higgsfield:e3867046-e290-444b-b5f8-2cb95a516fdb" },
  "consultant-referencement-international": { width: 1200, height: 630, alt: "Un homme tourne la page d’un calendrier bleu marine marqué d’une épingle rouge", legacy: "higgsfield:9fad47cc-a180-46d0-a1e4-c4b910d7a3f6" },
  "datos-estructurados-schema-optimizacion-geo": { width: 1200, height: 630, alt: "Unas manos ordenan fichas en un archivador azul marino, una marcada en rojo", legacy: "higgsfield:8dabbb1a-5b7c-46bd-8780-764d6dcd1510" },
  "diferencias-culturales-sitios-web-multilingues": { width: 1200, height: 630, alt: "Tres manos acercan tazas de estilos distintos, una de ellas roja", legacy: "higgsfield:3ac17206-19ba-4446-b4a1-d27f7023df69" },
  "expert-en-seo-international": { width: 1200, height: 630, alt: "Une main déplace de petits drapeaux sur une carte, le premier en rouge", legacy: "higgsfield:9ce6c8ab-b557-441f-817b-b60044a9908d" },
  "herramientas-gratuitas-analisis-competitivo": { width: 1200, height: 630, alt: "Unas manos abren una caja de herramientas azul marino con una lupa, una regla y un lápiz rojo", legacy: "higgsfield:6a7d0989-2523-4f47-8580-f5e78d73f581" },
  "link-building-local-en-espana": { width: 1200, height: 630, alt: "Dos personas se dan la mano junto a un periódico azul marino y una naranja roja", legacy: "higgsfield:8476f988-5f3a-4e7a-aaa6-dcdeb950fd36" },
  "medir-rendimiento-geo": { width: 1200, height: 630, alt: "Una mano rodea una burbuja de diálogo con una cinta azul marino que lleva una pinza roja", legacy: "higgsfield:3146ee17-3f0b-4f70-8b26-46cc1b7f2647" },
  "optimisation-pour-les-systemes-ia": { width: 1200, height: 630, alt: "Une femme se penche vers un petit robot en papier bleu marine qui tient une carte au point rouge", legacy: "higgsfield:036c337d-7894-4e1d-bb99-4e09a3bbbfe7" },
  "optimizacion-para-sistemas-de-ia": { width: 1200, height: 630, alt: "Un hombre ajusta el dial rojo de una pequeña máquina azul marino que imprime fichas", legacy: "higgsfield:15673bda-b426-4c98-9bce-257756c7b956" },
  "optimizar-para-seo-y-geo": { width: 1200, height: 630, alt: "Una mano con una lupa y otra con una burbuja de diálogo sobre una página de título rojo", legacy: "higgsfield:fc6649bf-af27-452b-8124-3f56dfcea622" },
  "optimizar-perfil-de-empresa-de-google": { width: 1200, height: 630, alt: "Una comerciante con delantal cuelga un letrero azul marino junto a un gran marcador rojo", legacy: "higgsfield:4a6074e5-527b-4807-a809-78f7f0802a47" },
  "rastrear-posiciones-de-keywords-de-competidores": { width: 1200, height: 630, alt: "Una mano sube un marcador rojo por una escalera de papel azul marino", legacy: "higgsfield:4c5970dc-ffc7-461c-856e-f49ec1e5e918" },
  "recherche-vocale": { width: 1200, height: 630, alt: "Une femme parle dans un cornet en papier d’où sort une onde rouge", legacy: "higgsfield:f440d1b5-9b24-479a-bcac-55d39b5bb6bd" },
  "seo-au-geo": { width: 1200, height: 630, alt: "Une main fait passer une étoile rouge d’une loupe à une bulle de dialogue", legacy: "higgsfield:fb484e36-176f-4c60-80aa-6d6d41d5f347" },
  "seo-tecnico-para-sitios-multilingues": { width: 1200, height: 630, alt: "Unas manos conectan los cables de tres páginas web de papel a una caja con un puerto rojo", legacy: "higgsfield:235cbce2-3944-4e12-9d11-4a476112458e" },
  "sistemas-cualificacion-leads-ia": { width: 1200, height: 630, alt: "Una mano clasifica fichas en tres bandejas azul marino y sube una roja, un robot de papel mira", legacy: "higgsfield:f141fb6b-7517-492c-a1f7-18b9aec02c26" },
  "visa-nomade-numerique-espagne": { width: 1200, height: 630, alt: "Une voyageuse à une table en terrasse, un carnet bleu marine et une orange rouge en main, une valise à côté", legacy: "higgsfield:aed56e4b-7283-4d5d-80dd-4a82701a5408" },
};

export function getBlogImage(slug: string): BlogImage | undefined {
  return BLOG_IMAGES[slug];
}
