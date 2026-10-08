/**
 * The illustrations inside each post, two per article (owner, 8 Oct 2026:
 * "Add 2-3 similar illustrations on each post"), in the house style of the
 * featured images (lib/blog-images.ts, docs/BRANDED-IMAGE-PROMPTS.md):
 * people at work on paper objects, cream, navy and one berry accent, the
 * MB mark bottom left.
 *
 * Keyed by translation group, so every language version of an article
 * shows the same pictures. `after` is the h2 a figure follows, per locale,
 * because a translation does not always keep the English section count;
 * lib/post-figure-insert.ts places them. Files are
 * public/images/posts/<file>.webp (1200x630) and <file>-640.webp, made by
 * scripts/brand-blog-images.mjs <dir> posts. `source` is the Higgsfield
 * job, as in lib/blog-images.ts.
 */
type Loc = "en" | "fr" | "es";

export type PostFigure = {
  file: string;
  after: Partial<Record<Loc, number>>;
  alt: Partial<Record<Loc, string>>;
  source: string;
};

/** Appended to the image URLs; bump it when the set is regenerated. */
export const POST_FIGURE_VERSION = "20261008";

export const POST_FIGURES: Record<string, PostFigure[]> = {
  // 15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business
  g002: [
    { file: "g002-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand slotting a red card into the last empty slot of a navy card rack", fr: "Une main glisse une carte rouge dans la dernière fente libre d’un range-cartes bleu marine", es: "Una mano mete una tarjeta roja en el último hueco libre de un tarjetero azul marino" }, source: "higgsfield:a4f6eb91-d8f2-4af5-91e2-fa8aa0f56dd0" },
    { file: "g002-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "Two cupped hands catching a red envelope as it drops from a navy paper funnel", fr: "Deux mains en coupe recueillent une enveloppe rouge qui tombe d’un entonnoir en papier bleu marine", es: "Dos manos en cuenco recogen un sobre rojo que cae de un embudo de papel azul marino" }, source: "higgsfield:c8db0702-c9ba-4233-a730-d9ce641e21da" },
  ],
  // 360-marketing-agency
  g003: [
    { file: "g003-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "Several hands fitting navy puzzle pieces around one red centre piece", fr: "Plusieurs mains assemblent des pièces de puzzle bleu marine autour d’une pièce centrale rouge", es: "Varias manos encajan piezas de puzle azul marino alrededor de una pieza central roja" }, source: "higgsfield:c9e3bf67-b6cd-49fc-b5b6-1cb25850695d" },
    { file: "g003-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "Fingers tightening navy threads from several cards into a single red knot", fr: "Des doigts serrent en un seul nœud rouge les fils bleu marine venus de plusieurs cartes", es: "Unos dedos aprietan en un solo nudo rojo los hilos azul marino que salen de varias tarjetas" }, source: "higgsfield:d3cccfe8-17b6-400f-9761-075216732a63" },
  ],
  // affiliate-marketing-programs
  g006: [
    { file: "g006-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand picking one red tag from a row of navy tags on a string", fr: "Une main choisit une étiquette rouge parmi des étiquettes bleu marine suspendues à une ficelle", es: "Una mano elige una etiqueta roja entre varias etiquetas azul marino colgadas de un cordel" }, source: "higgsfield:6ff59515-d6a2-40a0-a167-af19ea1b729a" },
    { file: "g006-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "A hand dropping a folded slip into a navy money box with a red-rimmed slot", fr: "Une main glisse un billet plié dans une tirelire bleu marine à la fente bordée de rouge", es: "Una mano mete un papel doblado en una hucha azul marino con la ranura ribeteada de rojo" }, source: "higgsfield:1b9fd243-6d75-47d6-ac6f-0266f84a3386" },
  ],
  // ai-powered-marketing
  g008: [
    { file: "g008-1", after: { en: 3, fr: 4, es: 3 }, alt: { en: "A hand catching freshly pressed cream pages from a navy paper press, the top page edged in red", fr: "Une main recueille des pages crème tout juste sorties d’une presse en papier bleu marine, celle du dessus bordée de rouge", es: "Una mano recoge páginas color crema recién salidas de una prensa de papel azul marino, la de arriba con el borde rojo" }, source: "higgsfield:2f0c2934-3b84-493f-8baf-a8c090ff3b3f" },
    { file: "g008-2", after: { en: 5, fr: 6, es: 5 }, alt: { en: "A woman in profile reaching for a navy desk bell as a red speech bubble rises from it", fr: "Une femme de profil tend la main vers une sonnette bleu marine d’où s’élève une bulle rouge", es: "Una mujer de perfil se acerca a un timbre azul marino del que ya sale un bocadillo rojo" }, source: "higgsfield:aae1634c-5b66-4571-96b4-f00ad43ab597" },
  ],
  // alternatives-to-google-analytics
  g009: [
    { file: "g009-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand swapping a navy lens for a red one above a sheet of grid paper", fr: "Une main remplace une lentille bleu marine par une lentille rouge au-dessus d’une feuille quadrillée", es: "Una mano cambia una lente azul marino por una roja sobre una hoja cuadriculada" }, source: "higgsfield:20017383-ccb6-4695-a97e-d6c6c2b3d1be" },
    { file: "g009-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "Two hands fanning navy swatch cards with one red card pulled forward", fr: "Deux mains déploient des cartes bleu marine en éventail, une carte rouge avancée", es: "Dos manos despliegan en abanico tarjetas azul marino con una roja adelantada" }, source: "higgsfield:9e765d90-3369-4ea7-a7ea-0285563daeaf" },
  ],
  // best-practices-for-multilingual-seo
  g014: [
    { file: "g014-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand testing a navy paper key against three keyholes, one rimmed in red", fr: "Une main présente une clé bleu marine devant trois serrures, l’une cerclée de rouge", es: "Una mano prueba una llave azul marino ante tres cerraduras, una ribeteada de rojo" }, source: "higgsfield:88945f30-ace1-496f-9f93-468bd8b6023a" },
    { file: "g014-2", after: { en: 7, fr: 7, es: 6 }, alt: { en: "An arm tying a red thread between rooftops in a small paper town", fr: "Un bras tend un fil rouge entre les toits d’une petite ville en papier", es: "Un brazo tiende un hilo rojo entre los tejados de un pequeño pueblo de papel" }, source: "higgsfield:a82dba7b-5fc2-483f-8be4-56efddbb339d" },
  ],
  // best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits
  g015: [
    { file: "g015-1", after: { en: 3 }, alt: { en: "A finger tracing a red thread from a paper leaf through a chain of navy parcels" }, source: "higgsfield:2e00d0b6-9651-4194-aa69-efe3290b25f7" },
    { file: "g015-2", after: { en: 5 }, alt: { en: "A person in a navy jacket filing cream folders into a box, a red clip on top" }, source: "higgsfield:1874fdda-d680-4193-b12e-42d8e9499b86" },
  ],
  // building-a-global-brand
  g018: [
    { file: "g018-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand packing a navy paper emblem into a small suitcase with a red tag", fr: "Une main range un emblème en papier bleu marine dans une petite valise à l’étiquette rouge", es: "Una mano guarda un emblema de papel azul marino en una maleta pequeña con etiqueta roja" }, source: "higgsfield:88604a17-3573-4911-b78a-e6e35f02a904" },
    { file: "g018-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "Two hands trimming a navy paper shape with scissors to fit a red outline", fr: "Deux mains retaillent aux ciseaux une forme bleu marine pour l’ajuster à un contour rouge", es: "Dos manos recortan con tijeras una forma azul marino para ajustarla a un contorno rojo" }, source: "higgsfield:ab5e3841-b28a-4839-bfce-a095fa6fa195" },
  ],
  // chrome-extensions-for-seo
  g020: [
    { file: "g020-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand unrolling a navy tool roll with one red-handled tool inside", fr: "Une main déroule une trousse à outils bleu marine où un outil a le manche rouge", es: "Una mano desenrolla un estuche de herramientas azul marino con una herramienta de mango rojo" }, source: "higgsfield:8be7bbed-5506-4abb-8216-178b54a63608" },
    { file: "g020-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A man in profile looking through a navy spyglass at a row of paper shopfronts", fr: "Un homme de profil observe à la longue-vue bleu marine une rangée de devantures en papier", es: "Un hombre de perfil mira con un catalejo azul marino una fila de escaparates de papel" }, source: "higgsfield:d3823763-9ec5-4c2b-8c5f-e8dae3e617f1" },
  ],
  // chrome-extensions-for-translators
  g021: [
    { file: "g021-1", after: { en: 4, fr: 4, es: 4 }, alt: { en: "Hands writing on a cream page under a red jointed desk lamp", fr: "Des mains écrivent sur une page crème sous une lampe articulée rouge", es: "Unas manos escriben en una página color crema bajo un flexo rojo" }, source: "higgsfield:a23642d6-209f-4778-8f15-8aca1ef8ad9c" },
    { file: "g021-2", after: { en: 7, fr: 7, es: 7 }, alt: { en: "A hand lifting a red tile out of a navy tray of cream tiles", fr: "Une main retire une tuile rouge d’un plateau bleu marine rempli de tuiles crème", es: "Una mano saca una ficha roja de una bandeja azul marino llena de fichas color crema" }, source: "higgsfield:7c442147-bd5d-454e-b6c4-2af015a13204" },
  ],
  // common-mistakes-to-avoid-when-localising-your-website
  g022: [
    { file: "g022-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A woman in profile cupping her ear toward a navy paper horn with a red rim", fr: "Une femme de profil tend l’oreille vers un pavillon en papier bleu marine au bord rouge", es: "Una mujer de perfil acerca el oído a una bocina de papel azul marino con el borde rojo" }, source: "higgsfield:4f46530e-dc1f-4167-9be7-3e4ce98701dc" },
    { file: "g022-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand sliding a red card through a navy paper card reader on a counter", fr: "Une main passe une carte rouge dans un terminal de paiement en papier bleu marine", es: "Una mano pasa una tarjeta roja por un datáfono de papel azul marino" }, source: "higgsfield:4eb33b21-6926-490d-902b-f2704202718e" },
  ],
  // competitor-analysis
  g024: [
    { file: "g024-1", after: { en: 3, fr: 3, es: 4 }, alt: { en: "A hand with tweezers laying four paper pieces in a row, the last one red", fr: "Une main armée d’une pince aligne quatre pièces de papier, la dernière rouge", es: "Una mano con pinzas alinea cuatro piezas de papel, la última roja" }, source: "higgsfield:13806fe0-d3ad-41dd-954a-5031f18e5473" },
    { file: "g024-2", after: { en: 6, fr: 6, es: 9 }, alt: { en: "Three hands each planting a navy flag on its own paper island, one flag red", fr: "Trois mains plantent chacune un fanion bleu marine sur sa propre île en papier, l’un rouge", es: "Tres manos clavan cada una un banderín azul marino en su propia isla de papel, uno rojo" }, source: "higgsfield:229794df-b5e7-4f02-8ba8-f1a0c219dee7" },
  ],
  // content-optimisation-for-spanish-users
  g026: [
    { file: "g026-1", after: { en: 4 }, alt: { en: "A hand turning a navy paper dial toward a red marker" }, source: "higgsfield:97a688e6-7750-444c-bd68-9eb78e50be60" },
    { file: "g026-2", after: { en: 7 }, alt: { en: "A man in profile turning the page of a pop-up book with a navy paper village, one window red" }, source: "higgsfield:f9af8555-fcd5-4c00-9d34-22988fc79a1a" },
  ],
  // conversational-ai-chatbots-business
  g027: [
    { file: "g027-1", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand flipping through a navy rotary card file, one card red", fr: "Une main fait défiler un fichier rotatif bleu marine, une fiche rouge", es: "Una mano pasa las fichas de un tarjetero giratorio azul marino, una de ellas roja" }, source: "higgsfield:18eb4ad7-7fbf-4d6c-b544-824371142c2d" },
    { file: "g027-2", after: { en: 8, fr: 8, es: 8 }, alt: { en: "A hand holding a navy stopwatch above a short queue of paper tokens, the first one red", fr: "Une main tient un chronomètre bleu marine au-dessus d’une courte file de jetons, le premier rouge", es: "Una mano sostiene un cronómetro azul marino sobre una breve fila de fichas, la primera roja" }, source: "higgsfield:5a20bc5e-838a-4ba4-abeb-d9ef5beee118" },
  ],
  // digital-marketing-advisor
  g029: [
    { file: "g029-1", after: { en: 5, fr: 5, es: 5 }, alt: { en: "Two open hands weighing a small compass against a full toolbox", fr: "Deux mains ouvertes soupèsent une petite boussole et une boîte à outils pleine", es: "Dos manos abiertas sopesan una pequeña brújula frente a una caja de herramientas llena" }, source: "higgsfield:7d52e6b3-7910-43b7-92ad-9c8b1f15b101" },
    { file: "g029-2", after: { en: 9, fr: 9, es: 9 }, alt: { en: "Two forearms joining halves of a paper bridge at a red keystone", fr: "Deux avant-bras réunissent les deux moitiés d’un pont en papier autour d’une clé de voûte rouge", es: "Dos antebrazos unen las dos mitades de un puente de papel con una clave roja" }, source: "higgsfield:9bad2968-4454-4eff-9014-7a3458763ba1" },
  ],
  // eeat-vs-aeat-typo
  g030: [
    { file: "g030-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand setting a navy paper laurel wreath on a stack of books, tied with red ribbon", fr: "Une main pose une couronne de laurier bleu marine sur une pile de livres, nouée d’un ruban rouge", es: "Una mano coloca una corona de laurel azul marino sobre una pila de libros, atada con cinta roja" }, source: "higgsfield:a5c07911-4605-4d9a-b8e0-97bf150f19ff" },
    { file: "g030-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "A woman in profile holding a navy folder and a red folder on her lap", fr: "Une femme de profil tient sur ses genoux un dossier bleu marine et un dossier rouge", es: "Una mujer de perfil sostiene en el regazo una carpeta azul marino y otra roja" }, source: "higgsfield:ad99fef0-5038-47b3-a796-a1222626ddd2" },
  ],
  // email-marketing-hacks-boosting-open-rates-and-conversions
  g031: [
    { file: "g031-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A finger lifting a navy envelope flap to reveal a red lining", fr: "Un doigt soulève le rabat d’une enveloppe bleu marine sur une doublure rouge", es: "Un dedo levanta la solapa de un sobre azul marino y deja ver un forro rojo" }, source: "higgsfield:e6d67325-ff0d-48b1-9d34-41ce31451e97" },
    { file: "g031-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "Two hands sorting envelopes into three navy trays, one lined in red", fr: "Deux mains trient des enveloppes dans trois bacs bleu marine, l’un tapissé de rouge", es: "Dos manos clasifican sobres en tres bandejas azul marino, una forrada de rojo" }, source: "higgsfield:42238ef8-199f-47f5-b7e0-4d7aaa48bc0a" },
  ],
  // english-to-french-translation-services
  g032: [
    { file: "g032-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand placing small navy figurines on a paper map, one figurine red", fr: "Une main pose de petites figurines bleu marine sur une carte en papier, l’une rouge", es: "Una mano coloca pequeñas figuras azul marino sobre un mapa de papel, una de ellas roja" }, source: "higgsfield:2252d7be-db69-4d05-af92-de6e734cf909" },
    { file: "g032-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "A hand lifting the lid of the middle box in a row of three, its lining red", fr: "Une main soulève le couvercle de la boîte du milieu parmi trois, doublée de rouge", es: "Una mano levanta la tapa de la caja central de tres, forrada de rojo" }, source: "higgsfield:dfcbffe0-75f1-45df-9eaa-5cee5736b1a2" },
  ],
  // analizar-backlinks-competidores
  g035: [
    { file: "g035-1", after: { es: 2 }, alt: { es: "Una mano tira de un hilo rojo entre una maraña de hilos azul marino clavados en un corcho" }, source: "higgsfield:0c2eb95b-1f1e-4aa5-be14-abc983ee4529" },
    { file: "g035-2", after: { es: 5 }, alt: { es: "Unos antebrazos llevan un ladrillo rojo hasta un muro de papel azul marino a medio construir" }, source: "higgsfield:b2b74058-28d5-47eb-84e9-51486c7e8e34" },
  ],
  // analizar-trafico-web-competencia
  g036: [
    { file: "g036-1", after: { es: 3 }, alt: { es: "Una mano ajusta uno de tres indicadores de papel azul marino, el del centro con aguja roja" }, source: "higgsfield:9e3b094b-8cdb-4083-941e-e3835d0ffbf8" },
    { file: "g036-2", after: { es: 6 }, alt: { es: "Una mano coloca piedras de papel sobre un arroyo azul marino, la última roja" }, source: "higgsfield:f48cf5bf-5634-4006-bfaf-de539989e8d7" },
  ],
  // competidores-seo
  g037: [
    { file: "g037-1", after: { es: 3 }, alt: { es: "Un hombre de perfil separa en montones siluetas de papel azul marino, con una roja aparte" }, source: "higgsfield:87008526-cbf5-4a88-8d3e-ceceefd04f8d" },
    { file: "g037-2", after: { es: 5 }, alt: { es: "Una mano apila libros azul marino bajo un podio rojo para elevarlo" }, source: "higgsfield:9857132f-f9ef-4e08-9de2-3e99b66d1fff" },
  ],
  // datos-estructurados-schema-optimizacion-geo
  g038: [
    { file: "g038-1", after: { es: 3 }, alt: { es: "Una mano pega etiquetas azul marino sin texto en los compartimentos de un cajón, la última roja" }, source: "higgsfield:4f060e9b-a870-4359-bc91-f6b7ef1e365f" },
    { file: "g038-2", after: { es: 6 }, alt: { es: "Un brazo monta un andamio de papel azul marino alrededor de un edificio, con una barra roja arriba" }, source: "higgsfield:78025f41-8aaa-4829-b039-687173c77c90" },
  ],
  // diferencias-culturales-sitios-web-multilingues
  g039: [
    { file: "g039-1", after: { es: 2 }, alt: { es: "Una mujer de perfil ofrece con ambas manos una caja azul marino con lazo rojo" }, source: "higgsfield:1224b147-7898-4cc7-9e70-b5022f6c86c5" },
    { file: "g039-2", after: { es: 4 }, alt: { es: "Unas manos ajustan los pliegues de un farol de papel azul marino con luz roja en su interior" }, source: "higgsfield:932b12b5-33e4-48bb-80f5-fb1cdf2bf9db" },
  ],
  // herramientas-gratuitas-analisis-competitivo
  g040: [
    { file: "g040-1", after: { es: 3 }, alt: { es: "Una mano sostiene un periscopio de papel azul marino asomado sobre un muro, con la lente roja" }, source: "higgsfield:303d3078-8307-4e6f-99e7-bf1d581d75f5" },
    { file: "g040-2", after: { es: 6 }, alt: { es: "Una mano avanza una ficha roja por el camino de un tablero de papel azul marino" }, source: "higgsfield:af99decf-c0f6-4d4a-a231-c92239264c85" },
  ],
  // link-building-local-en-espana
  g042: [
    { file: "g042-1", after: { es: 2 }, alt: { es: "Dos manos se estrechan sobre una mesa mientras una entrega un periódico doblado con cinta roja" }, source: "higgsfield:c1b4202f-ecad-4f0a-ad27-6be212cf51d2" },
    { file: "g042-2", after: { es: 4 }, alt: { es: "Una mano riega con una regadera roja una fila de brotes de papel que crecen de uno a otro" }, source: "higgsfield:3608585a-0761-4d16-99c3-79585486fa5c" },
  ],
  // medir-rendimiento-geo
  g044: [
    { file: "g044-1", after: { es: 3 }, alt: { es: "Dos manos comparan una regla azul marino y una cinta métrica roja contra una columna" }, source: "higgsfield:84c9788c-d6fb-40df-8e1f-a41453620bee" },
    { file: "g044-2", after: { es: 6 }, alt: { es: "Una mano reparte cuentas de papel en tres tarros azul marino, el tercero rojo" }, source: "higgsfield:ebe06ad9-bdf3-4378-b866-9ebc59fe6e47" },
  ],
  // optimisation-pour-les-systemes-ia
  g045: [
    { file: "g045-1", after: { fr: 2, es: 2 }, alt: { fr: "Un homme de profil regarde par la fente d’un paravent bleu marine une forme rouge", es: "Un hombre de perfil mira por la rendija de un biombo azul marino una forma roja" }, source: "higgsfield:e7fea586-0393-4a79-a5e7-61f5383964ab" },
    { file: "g045-2", after: { fr: 3, es: 4 }, alt: { fr: "Des mains trient des fiches crème dans deux bacs bleu marine, une fiche retournée sur son dos rouge", es: "Unas manos clasifican fichas color crema en dos bandejas azul marino, una girada por su reverso rojo" }, source: "higgsfield:7a224f89-d5eb-43de-bc25-6a404138e95e" },
  ],
  // seo-au-geo
  g046: [
    { file: "g046-1", after: { fr: 4, es: 3 }, alt: { fr: "Une main pose la dernière pièce rouge d’un puzzle bleu marine", es: "Una mano coloca la última pieza roja de un puzle azul marino" }, source: "higgsfield:1e3045a6-5fd6-4153-87e6-49f95d168605" },
    { file: "g046-2", after: { fr: 7, es: 5 }, alt: { fr: "Un bras épingle une carte rouge sur un grand panneau bleu marine couvert de cartes crème", es: "Un brazo clava una tarjeta roja en un gran tablón azul marino lleno de tarjetas color crema" }, source: "higgsfield:514b61e9-c9ce-4af7-9d75-f08e18645af4" },
  ],
  // optimizar-perfil-de-empresa-de-google
  g047: [
    { file: "g047-1", after: { es: 4 }, alt: { es: "Una mano endereza un rótulo de papel azul marino sin texto colgado de un gancho rojo" }, source: "higgsfield:934cbd74-9f48-4a85-95fe-95859a7b172b" },
    { file: "g047-2", after: { es: 8 }, alt: { es: "Una mano sostiene un antifaz azul marino delante de una tarjeta con una estrella roja" }, source: "higgsfield:ea06cfdb-ab4c-4845-b5d0-1d71a9948696" },
  ],
  // rastrear-posiciones-de-keywords-de-competidores
  g049: [
    { file: "g049-1", after: { es: 3 }, alt: { es: "Una mano coloca etiquetas a tres figuras de corredores de papel, una de ellas roja" }, source: "higgsfield:a9dfd37e-9b44-43fd-897f-e5a29926ccf7" },
    { file: "g049-2", after: { es: 7 }, alt: { es: "Una mano sube un escalón a una figura roja en una escalera de papel azul marino" }, source: "higgsfield:11255ff3-6a17-412f-89ad-bbb5d0afd439" },
  ],
  // seo-tecnico-para-sitios-multilingues
  g051: [
    { file: "g051-1", after: { es: 3 }, alt: { es: "Una mano fija con una chincheta roja una torre de servidor de papel sobre un mapa" }, source: "higgsfield:f436d065-0c39-447a-9881-b8a19335f288" },
    { file: "g051-2", after: { es: 5 }, alt: { es: "Una mano coloca tres casas azul marino en un camino de papel que se ramifica desde un tronco rojo" }, source: "higgsfield:f8bf1c43-137a-4d66-b1ba-78f1b8cc2a3d" },
  ],
  // sistemas-cualificacion-leads-ia
  g096: [
    { file: "g096-1", after: { es: 2 }, alt: { es: "Una mano echa canicas de papel en un clasificador azul marino que separa una canica roja" }, source: "higgsfield:1a11bd33-5fa5-45d6-b31a-050b7fc0b84c" },
    { file: "g096-2", after: { es: 5 }, alt: { es: "Una mujer de perfil apunta con una caña de papel azul marino hacia un estanque con un pez rojo" }, source: "higgsfield:e4c21739-b5f4-4ba5-84ed-e8ad25e17a10" },
  ],
  // agence-seo-internationale
  g100: [
    { file: "g100-1", after: { fr: 3 }, alt: { fr: "Des avant-bras se passent un colis en papier de main en main jusqu’à une porte rouge" }, source: "higgsfield:92d5e926-75c0-4d21-88fc-556d8272fecf" },
    { file: "g100-2", after: { fr: 5 }, alt: { fr: "Une main ouvre les tiroirs d’un petit meuble en papier bleu marine, une poignée rouge" }, source: "higgsfield:ec646cad-7200-4701-9334-793d519d5dbd" },
  ],
  // consultant-referencement-international
  g104: [
    { file: "g104-1", after: { fr: 3 }, alt: { fr: "Une main arrache une feuille d’éphéméride bleu marine sans chiffres et découvre une feuille rouge" }, source: "higgsfield:23cac292-8ec6-479a-bc44-16f4b3ae3fff" },
    { file: "g104-2", after: { fr: 5 }, alt: { fr: "Deux mains posent une poutre bleu marine sur deux piliers, un niveau à bulle rouge dessus" }, source: "higgsfield:554717f5-99b6-4346-bb8b-36a5c9835e3c" },
  ],
  // expert-en-seo-international
  g108: [
    { file: "g108-1", after: { fr: 3 }, alt: { fr: "Une main fait basculer le premier domino rouge d’une rangée de dominos bleu marine" }, source: "higgsfield:7f5fa30b-9c00-4db9-94c7-1a1d02a4349f" },
    { file: "g108-2", after: { fr: 7 }, alt: { fr: "Une femme de profil ajuste une veste en papier bleu marine sur un mannequin, un revers rouge épinglé" }, source: "higgsfield:9c1cc2d5-5625-4545-8450-524e577dd0d5" },
  ],
  // recherche-vocale
  g114: [
    { file: "g114-1", after: { fr: 3 }, alt: { fr: "Un homme de profil parle dans un cornet en papier bleu marine d’où se déroule un ruban rouge" }, source: "higgsfield:7369d5e0-034e-4ff4-98bd-3f61247f7cba" },
    { file: "g114-2", after: { fr: 6 }, alt: { fr: "Une main pose une carte rouge sur la grille d’une enceinte en papier bleu marine" }, source: "higgsfield:f36a45b1-4489-430d-9a91-815682972a64" },
  ],
  // visa-nomade-numerique-espagne
  g119: [
    { file: "g119-1", after: { fr: 3 }, alt: { fr: "Une main glisse un carnet bleu marine sans inscription dans une housse d’ordinateur à tirette rouge" }, source: "higgsfield:7777ecb7-3b6b-49c5-9e79-e8aa6722a566" },
    { file: "g119-2", after: { fr: 6 }, alt: { fr: "Des mains attachent une pile de feuilles crème avec un trombone rouge près d’une chemise bleu marine" }, source: "higgsfield:3a6527d1-1945-420a-8666-c59ec7d73e8d" },
  ],
  // french-ppc-campaign
  g121: [
    { file: "g121-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand fitting dividers into a card file box, one divider red", fr: "Une main place des intercalaires dans un fichier en carton, l’un rouge", es: "Una mano coloca separadores en un fichero de cartón, uno de ellos rojo" }, source: "higgsfield:819eb67d-3510-4965-aa22-b0da385f8c8c" },
    { file: "g121-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "A hand turning a navy paper tap so a measured trickle fills a red cup", fr: "Une main dose le filet d’un robinet en papier bleu marine dans une tasse rouge", es: "Una mano gradúa el chorro de un grifo de papel azul marino sobre una taza roja" }, source: "higgsfield:c018de71-cb90-426e-a4f9-29431baa0933" },
  ],
  // future-of-seo
  g122: [
    { file: "g122-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "Two people seen from the waist down walking in step, one with a red satchel", fr: "Deux personnes vues de la taille aux pieds marchent du même pas, l’une avec une besace rouge", es: "Dos personas vistas de cintura para abajo caminan al mismo paso, una con una cartera roja" }, source: "higgsfield:fd828a25-915c-44e5-8536-83ae91893b18" },
    { file: "g122-2", after: { en: 8, fr: 8, es: 7 }, alt: { en: "A hand with tweezers setting a tiny red door into one building of a paper street", fr: "Une main munie d’une pince pose une minuscule porte rouge sur un immeuble d’une rue en papier", es: "Una mano con pinzas coloca una diminuta puerta roja en un edificio de una calle de papel" }, source: "higgsfield:bdb7492f-ff8e-4c17-8552-0ae6dabb024c" },
  ],
  // german-seo-best-practices
  g123: [
    { file: "g123-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A man in profile reading a blank navy scroll held flat by a red paperweight", fr: "Un homme de profil lit un rouleau bleu marine vierge maintenu par un presse-papiers rouge", es: "Un hombre de perfil lee un rollo azul marino en blanco sujeto por un pisapapeles rojo" }, source: "higgsfield:b8bf0c92-8911-48f3-94c8-f606cf3cb353" },
    { file: "g123-2", after: { en: 7, fr: 7, es: 7 }, alt: { en: "A hand tightening a red bolt with a navy spanner on a paper framework", fr: "Une main serre un boulon rouge avec une clé bleu marine sur une structure en papier", es: "Una mano aprieta un tornillo rojo con una llave azul marino sobre una estructura de papel" }, source: "higgsfield:83315089-a792-48bd-a5bc-f94591ec08ce" },
  ],
  // german-seo-content-localisation
  g124: [
    { file: "g124-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "Two hands holding up a navy bow tie and a cream scarf, a red pin on the tie", fr: "Deux mains présentent un nœud papillon bleu marine et une écharpe crème, une épingle rouge sur le nœud", es: "Dos manos muestran una pajarita azul marino y una bufanda color crema, con un alfiler rojo en la pajarita" }, source: "higgsfield:68f1b6af-63b3-4224-82bf-0d1e67d1a7fc" },
    { file: "g124-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "Hands shaping cream clay on a navy board beside a red cutter", fr: "Des mains façonnent une pâte crème sur une planche bleu marine près d’un emporte-pièce rouge", es: "Unas manos moldean una masa color crema sobre una tabla azul marino junto a un cortapastas rojo" }, source: "higgsfield:883b9a63-23bf-41ad-8516-2deeda8e6994" },
  ],
  // global-business-trends
  g125: [
    { file: "g125-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand winding a navy clockwork figure that walks toward a red box", fr: "Une main remonte une figurine mécanique bleu marine qui avance vers une boîte rouge", es: "Una mano da cuerda a una figura mecánica azul marino que avanza hacia una caja roja" }, source: "higgsfield:f598cb58-39cb-47d9-a704-7ccde507bcbc" },
    { file: "g125-2", after: { en: 6, fr: 10, es: 6 }, alt: { en: "A person holding an open navy ledger and laying a red paper leaf on its page", fr: "Une personne tient un registre bleu marine ouvert et y dépose une feuille d’arbre rouge", es: "Una persona sostiene un libro de cuentas azul marino abierto y deja en él una hoja roja" }, source: "higgsfield:26c74783-09eb-470a-9757-259a3792cdb2" },
  ],
  // google-analytics-international-marketing-limits
  g126: [
    { file: "g126-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand resting on a navy plinth beside a red plumb line hanging straight", fr: "Une main posée sur un socle bleu marine près d’un fil à plomb rouge bien droit", es: "Una mano apoyada en un pedestal azul marino junto a una plomada roja" }, source: "higgsfield:7be83f68-cfd4-4471-b228-7791eea0a479" },
    { file: "g126-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "Two hands lifting navy flowerpots, the plant in the red pot thriving", fr: "Deux mains soulèvent des pots bleu marine, la plante du pot rouge plus vigoureuse", es: "Dos manos levantan macetas azul marino, la planta de la maceta roja más frondosa" }, source: "higgsfield:174c7b59-dcd1-41a3-b557-fce1f31d0a46" },
  ],
  // how-ai-is-revolutionising-seo-strategies
  g127: [
    { file: "g127-1", after: { en: 2, fr: 3, es: 3 }, alt: { en: "A hand arranging navy paper grapes into one cluster, one grape red", fr: "Une main assemble des raisins en papier bleu marine en une grappe, un grain rouge", es: "Una mano reúne uvas de papel azul marino en un racimo, con una uva roja" }, source: "higgsfield:6bed2641-d441-46d4-8620-efc146a4c94c" },
    { file: "g127-2", after: { en: 6, fr: 7, es: 7 }, alt: { en: "A woman in profile holding open a navy book with a red ribbon at the page", fr: "Une femme de profil tient ouvert un livre bleu marine marqué d’un ruban rouge", es: "Una mujer de perfil sostiene abierto un libro azul marino con una cinta roja en la página" }, source: "higgsfield:db75ba79-4c07-4147-ae40-e7729db88e29" },
  ],
  // how-ai-is-transforming-translation-and-localisation
  g128: [
    { file: "g128-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand feeding paper strips into a navy mill wheel, one strip red", fr: "Une main glisse des bandes de papier dans une roue de moulin bleu marine, une bande rouge", es: "Una mano mete tiras de papel en una rueda de molino azul marino, una tira roja" }, source: "higgsfield:fcde1bc0-aafe-4f34-8c0a-dd08d1309600" },
    { file: "g128-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand catching a red ball as it slips through a navy paper net", fr: "Une main rattrape une balle rouge qui glisse à travers un filet bleu marine", es: "Una mano atrapa una bola roja que se cuela por una red azul marino" }, source: "higgsfield:18c169fe-2497-49b6-ae00-93a4337650e0" },
  ],
  // how-to-create-a-targeted-content-strategy
  g129: [
    { file: "g129-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A man in profile studying a row of paper silhouettes, one red", fr: "Un homme de profil observe une rangée de silhouettes en papier, l’une rouge", es: "Un hombre de perfil observa una fila de siluetas de papel, una de ellas roja" }, source: "higgsfield:864034aa-9d83-43a0-9073-43c555cc6071" },
    { file: "g129-2", after: { en: 7, fr: 7, es: 7 }, alt: { en: "A hand folding a cream paper plane with a red nose, navy planes behind", fr: "Une main plie un avion en papier crème au nez rouge, des avions bleu marine derrière", es: "Una mano pliega un avión de papel color crema con el morro rojo, con aviones azul marino detrás" }, source: "higgsfield:28411c22-bd5a-4414-83fe-2b6dc3744dc2" },
  ],
  // how-to-promote-your-local-business-on-google-maps
  g131: [
    { file: "g131-1", after: { en: 3, fr: 3, es: 4 }, alt: { en: "A hand fitting a red tile into the last gap of a navy mosaic", fr: "Une main pose une tesselle rouge dans le dernier vide d’une mosaïque bleu marine", es: "Una mano coloca una tesela roja en el último hueco de un mosaico azul marino" }, source: "higgsfield:1eb5214c-2fa6-4fb4-98b5-aa66fe7fadf6" },
    { file: "g131-2", after: { en: 5, fr: 5, es: 6 }, alt: { en: "A hand dropping a red paper star into a jar of cream stars", fr: "Une main dépose une étoile rouge dans un bocal rempli d’étoiles crème", es: "Una mano deja caer una estrella roja en un tarro lleno de estrellas color crema" }, source: "higgsfield:e0ddd177-bb27-418d-8ec5-ad0bc718cf5e" },
  ],
  // how-to-use-ai-and-machine-translation-tools
  g132: [
    { file: "g132-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand turning a navy paper crank as cream sheets come out in a neat stack", fr: "Une main tourne la manivelle d’une machine en papier bleu marine d’où sortent des feuilles crème", es: "Una mano gira la manivela de una máquina de papel azul marino de la que salen hojas color crema" }, source: "higgsfield:9234d940-fea1-481d-b5c9-a2d17057eb2b" },
    { file: "g132-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "A human hand and a navy paper mechanical hand holding one red pencil together", fr: "Une main humaine et une main mécanique en papier bleu marine tiennent ensemble un crayon rouge", es: "Una mano humana y una mano mecánica de papel azul marino sujetan juntas un lápiz rojo" }, source: "higgsfield:def44d58-e09e-4e5b-9f6a-bcc2d04be8c1" },
  ],
  // how-to-write-about-your-professional-background
  g133: [
    { file: "g133-1", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand straightening a red frame in a row of empty navy frames on a shelf", fr: "Une main redresse un cadre rouge dans une rangée de cadres bleu marine vides", es: "Una mano endereza un marco rojo en una fila de marcos azul marino vacíos" }, source: "higgsfield:71bd5a8a-34bf-4edd-beb3-a068b2a520f0" },
    { file: "g133-2", after: { en: 7, fr: 7, es: 7 }, alt: { en: "A person pinning a red paper rosette to the lapel of a navy jacket", fr: "Une personne épingle une cocarde rouge au revers d’une veste bleu marine", es: "Una persona se prende una escarapela roja en la solapa de una chaqueta azul marino" }, source: "higgsfield:875c1614-ebe9-454d-8b60-e383881e28fb" },
  ],
  // human-creator-economy
  g134: [
    { file: "g134-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand reaching between navy gears to lift out a small red paper figure", fr: "Une main se glisse entre des engrenages bleu marine pour en retirer une petite figurine rouge", es: "Una mano se mete entre engranajes azul marino para sacar una pequeña figura roja" }, source: "higgsfield:593f77a7-edf9-46ee-852a-8d87f90076cd" },
    { file: "g134-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "Many hands holding the rim of a navy paper disc with a red dot at its centre", fr: "De nombreuses mains tiennent le bord d’un disque bleu marine marqué d’un point rouge au centre", es: "Muchas manos sujetan el borde de un disco azul marino con un punto rojo en el centro" }, source: "higgsfield:53d128ed-fc97-4d45-8ee1-c260dfb00c3f" },
  ],
  // internal-linking-tools
  g135: [
    { file: "g135-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand opening a navy door onto a corridor of doors, the last one red", fr: "Une main ouvre une porte bleu marine sur un couloir de portes, la dernière rouge", es: "Una mano abre una puerta azul marino a un pasillo de puertas, la última roja" }, source: "higgsfield:103739f8-795d-48bb-a75b-01d3f7fb2659" },
    { file: "g135-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand picking a red-handled screwdriver from three laid on a cloth", fr: "Une main choisit un tournevis à manche rouge parmi trois posés sur un tissu", es: "Una mano elige un destornillador de mango rojo entre tres sobre un paño" }, source: "higgsfield:83818a80-caa0-49e8-8a3c-7ce759141dcb" },
  ],
  // law-firm-seo-services
  g139: [
    { file: "g139-1", after: { en: 5, fr: 5, es: 5 }, alt: { en: "A man in a navy jacket, seen in profile, watching a red paper boat arrive in a harbour", fr: "Un homme en veste bleu marine, de profil, regarde un bateau en papier rouge entrer au port", es: "Un hombre con chaqueta azul marino, de perfil, mira un barco de papel rojo que llega al puerto" }, source: "higgsfield:c2f7f97e-d640-4593-9273-f8892d169ae4" },
    { file: "g139-2", after: { en: 10, fr: 10, es: 10 }, alt: { en: "Hands sweeping paper scraps from a navy desk into a red dustpan", fr: "Des mains balaient des chutes de papier d’un bureau bleu marine vers une pelle rouge", es: "Unas manos barren recortes de papel de un escritorio azul marino hacia un recogedor rojo" }, source: "higgsfield:a6756a7c-da66-4e93-96f7-1cdcfbdb77ba" },
  ],
  // link-building-in-spain
  g140: [
    { file: "g140-1", after: { en: 2, fr: 2 }, alt: { en: "Two people at a café table, one sliding a navy cup on a red saucer to the other", fr: "Deux personnes attablées, l’une tend à l’autre une tasse bleu marine sur une soucoupe rouge" }, source: "higgsfield:96904fff-0333-43b7-ade1-4a3222af53cd" },
    { file: "g140-2", after: { en: 5, fr: 5 }, alt: { en: "A hand turning over a navy paper hourglass filled with red sand", fr: "Une main retourne un sablier bleu marine rempli de sable rouge" }, source: "higgsfield:4629f1ff-ec9c-40f0-a4a3-748ad33604b1" },
  ],
  // link-selling-and-link-buying-platforms
  g141: [
    { file: "g141-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand browsing a market stall rack and pulling out one red card", fr: "Une main fouille le présentoir d’un étal et en tire une carte rouge", es: "Una mano rebusca en el expositor de un puesto y saca una tarjeta roja" }, source: "higgsfield:c26422ec-d75b-47ec-a5d6-114cb689cf8e" },
    { file: "g141-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "A hand holding a loupe over a navy paper link threaded with red", fr: "Une main examine à la loupe un maillon en papier bleu marine traversé d’un fil rouge", es: "Una mano examina con lupa un eslabón de papel azul marino atravesado por un hilo rojo" }, source: "higgsfield:bd7e8c7d-e900-4542-9b80-12c5dc8e80d5" },
  ],
  // llms-beyond-giants-hidden-ai-models
  g144: [
    { file: "g144-1", after: { en: 2, fr: 3, es: 3 }, alt: { en: "A hand lifting a navy lid to show the gears inside, one red", fr: "Une main soulève le couvercle d’une boîte bleu marine sur ses engrenages, l’un rouge", es: "Una mano levanta la tapa de una caja azul marino y deja ver sus engranajes, uno rojo" }, source: "higgsfield:9e1bfe95-f2d7-4d68-afd8-b18842c1dc9c" },
    { file: "g144-2", after: { en: 5, fr: 6, es: 6 }, alt: { en: "A hand taking a red key from a board of cream keys", fr: "Une main décroche une clé rouge d’un tableau de clés crème", es: "Una mano descuelga una llave roja de un tablero de llaves color crema" }, source: "higgsfield:50860f47-4767-4ad9-8b92-c3945546fb26" },
  ],
  // localisation-testing-tools
  g145: [
    { file: "g145-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand drawing a navy comb through paper strands and catching a red snag", fr: "Une main passe un peigne bleu marine dans des fils de papier et accroche un nœud rouge", es: "Una mano pasa un peine azul marino por hebras de papel y engancha un nudo rojo" }, source: "higgsfield:34173e70-b7f2-4f75-b967-d3645dc7f748" },
    { file: "g145-2", after: { en: 4, fr: 4, es: 5 }, alt: { en: "A hand unfolding a red blade from a navy paper multi-tool", fr: "Une main déplie une lame rouge d’un couteau multifonction bleu marine", es: "Una mano despliega una hoja roja de una navaja multiusos azul marino" }, source: "higgsfield:da7960ab-421b-42c8-b4ac-edd7fa2494a4" },
  ],
  // mastering-the-art-of-networking
  g147: [
    { file: "g147-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A young woman in profile handing a card with a red folded corner to an open hand", fr: "Une jeune femme de profil tend une carte au coin rouge replié à une main ouverte", es: "Una joven de perfil entrega una tarjeta con la esquina roja doblada a una mano abierta" }, source: "higgsfield:ff744879-957f-43dc-abb4-e595bab2e0bd" },
    { file: "g147-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "A hand winding navy thread on a spool, a red bead tied in", fr: "Une main enroule un fil bleu marine sur une bobine où est noué un grain rouge", es: "Una mano enrolla un hilo azul marino en un carrete con una cuenta roja anudada" }, source: "higgsfield:f86bbb5a-1081-4520-bcca-b7ed55c36f07" },
  ],
  // most-popular-marketing-strategies
  g148: [
    { file: "g148-1", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand dipping a navy test strip into a bowl, its tip turning red", fr: "Une main plonge une bandelette bleu marine dans un bol, son extrémité vire au rouge", es: "Una mano sumerge una tira azul marino en un cuenco y su punta se vuelve roja" }, source: "higgsfield:5c3e9488-d5d1-457f-928d-518f55638c0e" },
    { file: "g148-2", after: { en: 9, fr: 9, es: 9 }, alt: { en: "Two hands shaking, a red thread looped around both wrists", fr: "Deux mains se serrent, un fil rouge noué autour des deux poignets", es: "Dos manos se estrechan con un hilo rojo atado a ambas muñecas" }, source: "higgsfield:266a26da-9c28-47ec-b2af-ee027c088eaf" },
  ],
  // optimising-multilingual-website-content
  g153: [
    { file: "g153-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand stamping a leaf motif on three sheets, the last print red", fr: "Une main tamponne un motif de feuille sur trois feuilles, la dernière empreinte rouge", es: "Una mano estampa un motivo de hoja en tres hojas de papel, la última huella roja" }, source: "higgsfield:d6ff7a64-3bdc-4c71-9949-b77827af56cc" },
    { file: "g153-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "A hand holding three navy coin purses, opening the red one", fr: "Une main présente trois porte-monnaie bleu marine et ouvre le rouge", es: "Una mano muestra tres monederos azul marino y abre el rojo" }, source: "higgsfield:c1cc36c8-593b-4ad4-a407-48294961b626" },
  ],
  // optimising-your-website-for-valencia-based-searches
  g154: [
    { file: "g154-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand sifting paper sand through a navy sieve, a red shell left behind", fr: "Une main tamise du sable de papier dans un tamis bleu marine où reste un coquillage rouge", es: "Una mano criba arena de papel en un tamiz azul marino y queda una concha roja" }, source: "higgsfield:69aeb7ef-c9fb-42fe-be9e-39299c490914" },
    { file: "g154-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A person walking down a paper street with a navy phone, a red awning ahead", fr: "Une personne marche dans une rue en papier, téléphone bleu marine en main, un store rouge devant elle", es: "Una persona camina por una calle de papel con un móvil azul marino y un toldo rojo delante" }, source: "higgsfield:fb870dcf-a086-4e1f-98c8-1d00e278758f" },
  ],
  // search-everywhere-strategy
  g157: [
    { file: "g157-1", after: { en: 3, fr: 4, es: 4 }, alt: { en: "A hand slipping a red bookmark into one book on a navy shelf", fr: "Une main glisse un marque-page rouge dans un livre d’une étagère bleu marine", es: "Una mano mete un marcapáginas rojo en un libro de una estantería azul marino" }, source: "higgsfield:46ef27fa-0291-4099-8634-8d5aff6cbf2a" },
    { file: "g157-2", after: { en: 6, fr: 7, es: 7 }, alt: { en: "A hand fitting cream components into a navy board, the last one red", fr: "Une main enfiche des composants crème sur une carte bleu marine, le dernier rouge", es: "Una mano encaja componentes color crema en una placa azul marino, el último rojo" }, source: "higgsfield:4de1ee26-0770-4ca9-9f59-1664627123c7" },
  ],
  // seo-in-belgium
  g158: [
    { file: "g158-1", after: { en: 4, fr: 4, es: 4 }, alt: { en: "Two hands holding either end of a rope with a red knot in the middle", fr: "Deux mains tiennent chacune un bout d’une corde nouée de rouge au milieu", es: "Dos manos sujetan cada una un extremo de una cuerda con un nudo rojo en el centro" }, source: "higgsfield:3bf2acb7-f92f-4227-8cb6-0b07dcda81ec" },
    { file: "g158-2", after: { en: 9, fr: 8, es: 9 }, alt: { en: "A hand holding a navy phone with a red screen above a paper monitor", fr: "Une main tient un téléphone bleu marine à l’écran rouge au-dessus d’un écran en papier", es: "Una mano sostiene un móvil azul marino de pantalla roja sobre un monitor de papel" }, source: "higgsfield:db87ed33-0f7c-470e-821e-13c191dc7ab1" },
  ],
  // spanish-keyword-localisation
  g161: [
    { file: "g161-1", after: { en: 3, fr: 3 }, alt: { en: "A hand sorting paper seeds into navy dishes set across a map, one dish red", fr: "Une main répartit des graines de papier dans des coupelles bleu marine posées sur une carte, l’une rouge" }, source: "higgsfield:1ab4912d-cba8-4bbd-8a98-6baebfa410c1" },
    { file: "g161-2", after: { en: 7, fr: 7 }, alt: { en: "Two hands each holding a navy cup to compare, one with a red rim", fr: "Deux mains tiennent chacune une tasse bleu marine à comparer, l’une au bord rouge" }, source: "higgsfield:69f49891-0bfb-4b57-8e7e-52fbe4dfb6a1" },
  ],
  // spanish-on-page-seo
  g162: [
    { file: "g162-1", after: { en: 4, fr: 4 }, alt: { en: "A hand smoothing a blank red-edged label onto the spine of a navy box file", fr: "Une main lisse une étiquette vierge bordée de rouge sur le dos d’un classeur bleu marine" }, source: "higgsfield:84786842-7e3f-4f89-be8a-6716ee77b0fd" },
    { file: "g162-2", after: { en: 8, fr: 8 }, alt: { en: "A woman in profile reading aloud toward a navy microphone with a red band", fr: "Une femme de profil lit à voix haute face à un micro bleu marine cerclé de rouge" }, source: "higgsfield:8e489372-8d4b-40b6-a513-6ae0b1bfcf76" },
  ],
  // spanish-seo-markets
  g163: [
    { file: "g163-1", after: { en: 3, fr: 3 }, alt: { en: "Several hands holding navy teacups filled from one red teapot", fr: "Plusieurs mains tiennent des tasses bleu marine servies par une même théière rouge" }, source: "higgsfield:a07c4c3a-672a-4a5b-9a1d-0723b302eef6" },
    { file: "g163-2", after: { en: 7, fr: 7 }, alt: { en: "A hand taking the red-handled umbrella from a stand of navy umbrellas", fr: "Une main prend le parapluie à poignée rouge dans un porte-parapluies bleu marine" }, source: "higgsfield:962ee757-9550-43ce-baf0-b94ef3a59c1a" },
  ],
  // technical-seo-audit-checklist
  g164: [
    { file: "g164-1", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A hand holding a red stopwatch beside a navy paper race car", fr: "Une main tient un chronomètre rouge à côté d’une voiture de course en papier bleu marine", es: "Una mano sostiene un cronómetro rojo junto a un coche de carreras de papel azul marino" }, source: "higgsfield:9539619f-051c-47c1-9963-f01fe904c345" },
    { file: "g164-2", after: { en: 9, fr: 9, es: 9 }, alt: { en: "A hand tying blank tags to a row of navy frames, the last tag red", fr: "Une main attache des étiquettes vierges à une rangée de cadres bleu marine, la dernière rouge", es: "Una mano ata etiquetas en blanco a una fila de marcos azul marino, la última roja" }, source: "higgsfield:3b4f94fb-f55d-4633-8994-50a6341a64fb" },
  ],
  // technical-seo-considerations-for-german-websites
  g165: [
    { file: "g165-1", after: { en: 2, fr: 2, es: 2 }, alt: { en: "A hand filing navy folders in order, the last one with a red tab", fr: "Une main classe des chemises bleu marine dans l’ordre, la dernière à onglet rouge", es: "Una mano archiva carpetas azul marino en orden, la última con pestaña roja" }, source: "higgsfield:65c2fdbe-012f-4632-930f-584bff789d3e" },
    { file: "g165-2", after: { en: 4, fr: 4, es: 4 }, alt: { en: "A runner's legs pushing off a paper starting block, one shoelace red", fr: "Les jambes d’un coureur s’élancent d’un starting-block en papier, un lacet rouge", es: "Las piernas de un corredor salen de un taco de papel, con un cordón rojo" }, source: "higgsfield:2e87409e-9bd7-4bd4-9a8f-e63213e18b02" },
  ],
  // technical-seo-for-multilingual-websites
  g166: [
    { file: "g166-1", after: { en: 3, fr: 3 }, alt: { en: "A hand placing a navy paper lighthouse with a red lamp on a coastline", fr: "Une main pose un phare en papier bleu marine à la lanterne rouge sur une côte" }, source: "higgsfield:62a5845f-d711-49a8-a55e-da2c3bfdf3d3" },
    { file: "g166-2", after: { en: 6, fr: 6 }, alt: { en: "A hand arranging navy rooms under one roof, the hallway between them red", fr: "Une main dispose des pièces bleu marine sous un même toit, le couloir rouge" }, source: "higgsfield:4b81f5ad-e20e-4a4f-9d94-8ffc9dbae014" },
  ],
  // technical-seo-for-spanish-search-engines
  g167: [
    { file: "g167-1", after: { en: 4, fr: 4 }, alt: { en: "A person on a paper tram seat holding a navy phone and a red ticket", fr: "Une personne assise dans un tram en papier tient un téléphone bleu marine et un ticket rouge" }, source: "higgsfield:60f82267-96a7-41de-8dbe-94efa6b49aab" },
    { file: "g167-2", after: { en: 8, fr: 8 }, alt: { en: "A hand guiding a navy paper spider across a web toward a red node", fr: "Une main guide une araignée en papier bleu marine sur une toile vers un nœud rouge" }, source: "higgsfield:8c7e2c7c-fd3c-4c6e-9a7d-0fc7818d7ec1" },
  ],
  // user-interface-localisation-can-transform-your-global-reach
  g169: [
    { file: "g169-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand swapping the buttons on a paper jacket, one new button red", fr: "Une main remplace les boutons d’une veste en papier, l’un des nouveaux rouge", es: "Una mano cambia los botones de una chaqueta de papel, uno de los nuevos rojo" }, source: "higgsfield:a66911c6-d940-486d-b02a-a0bdbfd3d970" },
    { file: "g169-2", after: { en: 5, fr: 5, es: 5 }, alt: { en: "A hand stretching a navy panel wider to fit a longer red strip", fr: "Une main élargit un panneau bleu marine pour y loger une bande rouge plus longue", es: "Una mano ensancha un panel azul marino para que quepa una tira roja más larga" }, source: "higgsfield:5618f9a9-804a-4cf1-b2c4-85d9ecb5637e" },
  ],
  // what-is-search-intent-mapping
  g176: [
    { file: "g176-1", after: { en: 3, fr: 3, es: 3 }, alt: { en: "A hand routing paper tubes from one funnel to four cups, one red", fr: "Une main relie un entonnoir à quatre gobelets par des tubes en papier, l’un rouge", es: "Una mano une un embudo con cuatro vasos mediante tubos de papel, uno rojo" }, source: "higgsfield:0ad2c156-81ff-4467-95a2-8c512b394847" },
    { file: "g176-2", after: { en: 6, fr: 6, es: 6 }, alt: { en: "Two people in profile pointing at objects across a table, the one between them red", fr: "Deux personnes de profil, face à face, désignent des objets sur une table, celui du milieu rouge", es: "Dos personas de perfil, frente a frente, señalan objetos sobre una mesa, el del centro rojo" }, source: "higgsfield:6a09ad29-3b4f-40a4-811d-1f249b92e695" },
  ],
};
