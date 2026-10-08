/**
 * Featured images for the journal.
 *
 * All 53 were generated with Higgsfield (gpt_image_2_5) on 8 Oct 2026,
 * replacing a mix of legacy WordPress stock, Commons photographs, one
 * Unsplash photo and the owner's BlogIllustrator renders. The owner asked
 * for "relevant images, with some branding effect on them so they are in
 * harmony with the website, and between each other". So every one is the
 * same kind of picture: a paper still life of the post's subject on the
 * site's cream, in its navy, with a single berry accent and no lettering,
 * stamped with the MB mark bottom left by scripts/brand-blog-images.mjs.
 * The shared style prompt and each subject line are in
 * docs/BRANDED-IMAGE-PROMPTS.md. `components/PostArt.tsx` stays as the
 * fallback for a post with no entry here.
 *
 * 53 entries: the 52 published posts plus
 * competitor-analysis-traffic-checklist, a hand-built page (HAND_BUILT_SLUGS
 * in lib/posts.ts) that the journal index renders beside them.
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
  "15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business": { width: 1200, height: 630, alt: "A fan of blank cream index cards with one lifted card edged in red, a navy pencil beside them", legacy: "higgsfield:eddef40c-5537-4260-ba6f-76ba133bcb45" },
  "360-marketing-agency": { width: 1200, height: 630, alt: "A navy paper compass rose inside a ring of small cream tiles, one tile red", legacy: "higgsfield:01a4814d-a812-4294-a53f-b299681f1f22" },
  "affiliate-marketing-programs": { width: 1200, height: 630, alt: "Two navy paper hands passing a red coin above a chain of linked navy rings", legacy: "higgsfield:50430a76-5df0-48a0-a49f-01cffc68921d" },
  "ai-powered-marketing": { width: 1200, height: 630, alt: "A small folded-card navy robot holding up a red megaphone", legacy: "higgsfield:563187b3-0d32-495e-86a5-d96121cc12f7" },
  "alternatives-to-google-analytics": { width: 1200, height: 630, alt: "Three navy paper bar charts side by side, one topped in red, a magnifying glass leaning on them", legacy: "higgsfield:36363828-92b3-4f1f-b3cd-def6621f4d7d" },
  "best-practices-for-multilingual-seo": { width: 1200, height: 630, alt: "A navy paper globe on its stand with speech bubbles around it, one red", legacy: "higgsfield:d2413592-4285-4462-b59f-274faaffe00f" },
  "best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits": { width: 1200, height: 630, alt: "A navy crate of coffee beans with a leaf and an inspection tag on red string, a magnifying glass beside it", legacy: "higgsfield:e2339d1a-c211-4630-8a27-96882fa9cd3a" },
  "building-a-global-brand": { width: 1200, height: 630, alt: "A tower of navy paper blocks capped with a red one, a small globe at its base", legacy: "higgsfield:bf8192da-7c29-47a9-ad0c-62256726aedb" },
  "chrome-extensions-for-seo": { width: 1200, height: 630, alt: "A navy paper browser frame with puzzle pieces slotting into its toolbar, one red", legacy: "higgsfield:778454c3-50bb-4790-b827-4da10653a5a0" },
  "chrome-extensions-for-translators": { width: 1200, height: 630, alt: "A navy paper browser frame with a red and a cream puzzle piece in its toolbar, two speech bubbles beside them", legacy: "higgsfield:2b764287-4fc6-42d2-87fa-6b844a708987" },
  "common-mistakes-to-avoid-when-localising-your-website": { width: 1200, height: 630, alt: "A navy paper website made of puzzle pieces with one red-edged piece pulled out and set askew, a pencil beside it", legacy: "higgsfield:1c63a1bf-1818-4464-baa8-213a71e661c9" },
  "competitor-analysis": { width: 1200, height: 630, alt: "Three navy pawns on a chessboard with one red pawn a square ahead of them", legacy: "higgsfield:3ab45cc3-6134-4e59-bce8-021b0562eba3" },
  "competitor-analysis-traffic-checklist": { width: 1200, height: 630, alt: "Two navy cards with rising trend lines, the red one climbing higher, beside a ticked checklist", legacy: "higgsfield:7b4cb432-6142-4801-af6b-eef1d6b6ad0e" },
  "content-optimisation-for-spanish-users": { width: 1200, height: 630, alt: "A half-open navy hand fan beside a row of cream strips with one red strip", legacy: "higgsfield:21e7005e-c1d1-485a-80df-33d6952f8f23" },
  "conversational-ai-chatbots-business": { width: 1200, height: 630, alt: "Two speech bubbles in conversation, one outlined in navy and one in red, a small paper robot head beside them", legacy: "higgsfield:a2123a17-91cf-4bf2-8d2d-b3bd676524d2" },
  "digital-marketing-advisor": { width: 1200, height: 630, alt: "A navy chess knight standing on an open notebook with a red ribbon bookmark and a pen", legacy: "higgsfield:25aaa5ee-0924-4e98-97be-a7a6ed9c7a04" },
  "eeat-vs-aeat-typo": { width: 1200, height: 630, alt: "A row of navy blocks with one red block nudged out of line, a magnifying glass leaning on them", legacy: "higgsfield:025d20c1-32a1-44d9-b908-0d71bf94b87f" },
  "email-marketing-hacks-boosting-open-rates-and-conversions": { width: 1200, height: 630, alt: "A cream envelope opening on a red paper heart, two navy envelopes behind it", legacy: "higgsfield:671cb7a5-8c46-448b-93a8-3f00fb04822f" },
  "english-to-french-translation-services": { width: 1200, height: 630, alt: "Two speech bubbles joined by a navy bridge, one outlined in red, a fountain pen beside them", legacy: "higgsfield:34c2e3ee-a0f9-4579-9ef8-de0502f8c009" },
  "french-ppc-campaign": { width: 1200, height: 630, alt: "A navy cursor arrow pressing a red button, a small paper Eiffel Tower behind it", legacy: "higgsfield:1c4c72f5-3be5-495e-965c-a66239b91626" },
  "future-of-seo": { width: 1200, height: 630, alt: "A navy paper telescope on a tripod pointed at a red star hanging on a thread", legacy: "higgsfield:2c0c6eab-dd4f-4f78-8501-0717246a64a7" },
  "german-seo-best-practices": { width: 1200, height: 630, alt: "Navy paper gears meshing with one red gear, a ruler beside them", legacy: "higgsfield:5a6f92d6-8597-4925-818b-68697f2c039f" },
  "german-seo-content-localisation": { width: 1200, height: 630, alt: "A navy paper map of Germany laid with cream text strips, one red, a pencil beside it", legacy: "higgsfield:e1acceb8-3360-4d58-811d-9c59198a3df6" },
  "global-business-trends": { width: 1200, height: 630, alt: "A navy paper globe circled by a red arrow sweeping upward", legacy: "higgsfield:41e397b8-d637-48a9-95f9-b018fd1ab070" },
  "google-analytics-international-marketing-limits": { width: 1200, height: 630, alt: "Navy paper bars rising to a cream wall that hides the tallest, a red flag planted on top", legacy: "higgsfield:27e3925e-5d44-4cf6-82be-b171cc107119" },
  "how-ai-is-revolutionising-seo-strategies": { width: 1200, height: 630, alt: "A magnifying glass over a red paper spark on a card printed with navy circuit lines", legacy: "higgsfield:b30a84b6-50d7-4776-bd08-8295b1fa458b" },
  "how-ai-is-transforming-translation-and-localisation": { width: 1200, height: 630, alt: "Two cream speech bubbles joined by a navy circuit line through a red node", legacy: "higgsfield:41bd33ab-63be-4f2e-a68b-8034ac5d749a" },
  "how-to-create-a-targeted-content-strategy": { width: 1200, height: 630, alt: "A navy target with a red arrow in the bullseye, blank content cards fanned below it", legacy: "higgsfield:52886330-9c35-4819-8bfa-0e06d03c6b93" },
  "how-to-promote-your-local-business-on-google-maps": { width: 1200, height: 630, alt: "A red map pin on a folded street map beside a small navy shopfront with a striped awning", legacy: "higgsfield:f2296bd3-33f9-4fdd-858f-e0dc5db3b833" },
  "how-to-use-ai-and-machine-translation-tools": { width: 1200, height: 630, alt: "An open navy toolbox holding a fountain pen and a paper robot hand, a red speech bubble on top", legacy: "higgsfield:567d58d4-073a-4097-929b-438561515912" },
  "how-to-write-about-your-professional-background": { width: 1200, height: 630, alt: "An open lined notebook with a red ribbon bookmark, a fountain pen and reading glasses", legacy: "higgsfield:2688a1d0-e4af-4ee7-b4bf-f8bb7d903470" },
  "human-creator-economy": { width: 1200, height: 630, alt: "A navy paper camera and microphone either side of a small easel, a red heart in front", legacy: "higgsfield:b2cedd07-8d4c-43c7-9c76-3651b25362b1" },
  "internal-linking-tools": { width: 1200, height: 630, alt: "Cream cards joined by navy thread into a network around one red card", legacy: "higgsfield:6f002b0d-c6f7-4235-a6fa-6572d5409d5f" },
  "law-firm-seo-services": { width: 1200, height: 630, alt: "A navy balance with a red magnifying glass in one pan and documents in the other", legacy: "higgsfield:9fa64ff6-29ee-4226-b830-e4578206fc36" },
  "link-building-in-spain": { width: 1200, height: 630, alt: "A chain of navy paper links with one red link, a navy hand fan beside it", legacy: "higgsfield:380dc925-3285-4f43-9e46-2f053857d914" },
  "link-selling-and-link-buying-platforms": { width: 1200, height: 630, alt: "A navy chain link on a price tag tied with red string, a small balance behind it", legacy: "higgsfield:bb021a16-a8d8-4770-aec7-3d82d440b0d5" },
  "llms-beyond-giants-hidden-ai-models": { width: 1200, height: 630, alt: "A small red paper cube standing in front of a row of tall navy monoliths", legacy: "higgsfield:29c1e207-2e11-45e2-8a37-04ff85cb009d" },
  "localisation-testing-tools": { width: 1200, height: 630, alt: "A navy paper phone with interface strips, a red tick and a magnifying glass beside it", legacy: "higgsfield:650f8fb8-e59d-4eb9-b5c4-a821686ec594" },
  "mastering-the-art-of-networking": { width: 1200, height: 630, alt: "Small paper figures in a circle joined by navy thread, one figure red", legacy: "higgsfield:3d4817ce-4735-463f-abb5-eb393905f382" },
  "most-popular-marketing-strategies": { width: 1200, height: 630, alt: "A navy three-step podium with a red megaphone on the top step", legacy: "higgsfield:c06c2e25-2325-4b3f-81fe-e0ead206ac7b" },
  "optimising-multilingual-website-content": { width: 1200, height: 630, alt: "A navy paper website split into three language panels, the middle one red, a small globe beside it", legacy: "higgsfield:547bf2d7-bc27-44e7-bd2d-26be2937c020" },
  "optimising-your-website-for-valencia-based-searches": { width: 1200, height: 630, alt: "A navy map pin and a red orange on a paper map of a coastal city", legacy: "higgsfield:8146a7ba-dcba-4b51-9ab3-77bfbadc2b0d" },
  "search-everywhere-strategy": { width: 1200, height: 630, alt: "A navy magnifying glass ringed by paper devices and app tiles, one red", legacy: "higgsfield:801f619e-7229-4041-89b6-6428b5fe3737" },
  "seo-in-belgium": { width: 1200, height: 630, alt: "A paper map of Belgium in navy with one region in red, a brass magnifying glass resting on it", legacy: "higgsfield:29615341-220a-4d85-a1e6-be5d6dcb0cfe" },
  "spanish-keyword-localisation": { width: 1200, height: 630, alt: "A ring of navy paper keys with one red key, a navy hand fan beside it", legacy: "higgsfield:1222c985-e1e9-4be6-b387-ca3e3deb50dd" },
  "spanish-on-page-seo": { width: 1200, height: 630, alt: "A navy paper web page with cream content blocks under a red heading bar, a pencil beside it", legacy: "higgsfield:754a4758-2355-4450-b823-4491c33dc7fb" },
  "spanish-seo-markets": { width: 1200, height: 630, alt: "Navy paper maps of Spain and Latin America with red pins on their cities", legacy: "higgsfield:2af660f2-bc97-4dba-83db-2399b7e035fc" },
  "technical-seo-audit-checklist": { width: 1200, height: 630, alt: "A navy clipboard with a checklist, three boxes ticked in red, a fountain pen across it", legacy: "higgsfield:0d6be997-158d-45a0-9aa4-139cc48d9931" },
  "technical-seo-considerations-for-german-websites": { width: 1200, height: 630, alt: "Navy and red paper gears set inside a website frame, a ruler and screwdriver beside it", legacy: "higgsfield:3b83cd58-ce66-4d3f-9cff-0ce539ba3e29" },
  "technical-seo-for-multilingual-websites": { width: 1200, height: 630, alt: "Three navy paper website frames wired to one red gear", legacy: "higgsfield:cdb447e2-4b8d-4884-8c69-172cbad2a8ee" },
  "technical-seo-for-spanish-search-engines": { width: 1200, height: 630, alt: "A magnifying glass over a paper web page with a red wrench crossing it", legacy: "higgsfield:a9134f33-8066-4365-8beb-7206be1def7f" },
  "user-interface-localisation-can-transform-your-global-reach": { width: 1200, height: 630, alt: "A navy paper phone with interface tiles, one red, a small globe beside it", legacy: "higgsfield:23bef440-3c92-46a5-81bb-3c28e9719057" },
  "what-is-search-intent-mapping": { width: 1200, height: 630, alt: "A folded paper map with a dotted route from a magnifying glass to a red pin", legacy: "higgsfield:48916ac3-6a0e-4f6f-81ec-754d563176de" },
};

export function getBlogImage(slug: string): BlogImage | undefined {
  return BLOG_IMAGES[slug];
}
