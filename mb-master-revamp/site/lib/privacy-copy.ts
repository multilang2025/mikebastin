import type { Locale } from "@/lib/posts";

/**
 * Privacy and cookies page copy, per locale. Owner facts, 2 Oct 2026
 * (docs/OPEN-ITEMS.md Q25): Mike Bastin is a brand of BeTranslated, NIF
 * B40654865, registered at Calle Doctor Ferran, Valencia; hosting is
 * Hostinger; analytics are GA4, Microsoft Clarity and Ahrefs, all held
 * behind the analytics consent category (lib/consent.ts). Still general
 * until the owner supplies them: the street number and postcode of the
 * registered address, the email provider and the retention period.
 */
export type PrivacySection = {
  h: string;
  p?: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][] };
  settings?: boolean;
};

export type PrivacyCopy = {
  path: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  subhead: string;
  intro: string;
  home: string;
  homeHref: string;
  settingsButton: string;
  sections: PrivacySection[];
};

// French: a non-breaking space before : ; ? ! and inside « », as the French lint requires.
const fr = (s: string) => s.replace(/ ([:;?!])/g, " $1").replace(/« /g, "« ").replace(/ »/g, " »");

const EN: PrivacyCopy = {
  path: "/privacy/",
  title: "Privacy and cookies",
  metaDescription: "What this site collects, why, and the choices you have: the contact form, the two items kept in your browser, and your rights under the GDPR.",
  eyebrow: "What we collect and why",
  subhead: "What this site collects, why, and the choices you have.",
  intro: "We keep the data this site handles to a minimum: what you send us in the contact form, a small record of your choices in your browser and, only if you allow it, how pages on the site are used.",
  home: "Home",
  homeHref: "/",
  settingsButton: "Open cookie settings",
  sections: [
    {
      h: "Who we are",
      p: [
        "Mike Bastin is a multilingual SEO practice and a brand of BeTranslated (NIF B40654865), registered at Calle Doctor Ferran, Valencia, Spain. Our Valencia office is at Calle Rugat 12 - 2, 46021 Valencia. You can reach us at hello@mikebastin.com.",
        "We decide how the data described here is used, which makes us the controller under the GDPR.",
      ],
    },
    {
      h: "The contact form",
      p: [
        "When you send the contact form we receive your name, your email address and your message. You may also give a company name, a budget and the service you are interested in.",
        "We use these details to answer your enquiry, and for that purpose alone. The legal basis is your consent, given by ticking the box on the form, and the steps you ask us to take before any agreement.",
        "Our web host, Hostinger, handles the form and passes it to our mailbox. We keep an enquiry for as long as we are in touch with you about it, and for as long after that as we need to deal with it or to meet a legal duty.",
      ],
    },
    {
      h: "Cookies and similar storage",
      p: ["The site keeps two items in your browser. Both stay on your device and exist only to make the site work as you set it."],
      table: {
        head: ["Item", "What it does", "How long"],
        rows: [
          ["mb-theme", "Remembers whether you chose the light or the dark theme", "Until you change it or clear your browser data"],
          ["mb-consent", "Remembers your cookie choices", "Up to six months, then we ask again"],
        ],
      },
    },
    {
      h: "Analytics and embedded content",
      p: ["To see how visitors use the site, we use Google Analytics 4 (Google), Microsoft Clarity (Microsoft), which records how pages are scrolled and clicked, and Ahrefs Web Analytics (Ahrefs). All three stay off until you allow analytics in the cookie settings, and you can withdraw that at any time. We use no advertising cookies. Content embedded from other sites follows the same rule."],
    },
    {
      h: "Other sites",
      p: ["Fonts, images and scripts come from our own server. Links to other sites, such as LinkedIn, lead to services with their own privacy policies."],
    },
    {
      h: "Who handles the data",
      p: ["Our web host (Hostinger) and our email provider process the data on our behalf, so that the site and the mailbox work, and so do Google, Microsoft and Ahrefs when you allow analytics. We use your data to answer you and to improve the site, and we do not sell it or pass it on for marketing."],
    },
    {
      h: "Your rights",
      p: ["Under the GDPR you can:"],
      list: [
        "ask for a copy of your data",
        "have it corrected or erased",
        "restrict or object to its use",
        "receive it in a portable format",
        "withdraw your consent at any time, where we rely on it",
      ],
    },
    {
      h: "Using your rights and complaining",
      p: [
        "Write to hello@mikebastin.com and we will reply within one month.",
        "You can also complain to the Spanish data protection authority, the Agencia Española de Protección de Datos (aepd.es), or to the authority in your own country.",
      ],
    },
    { h: "Change your cookie choices", p: ["Open the cookie settings to allow or withdraw analytics and embedded content whenever you like."], settings: true },
    { h: "Updates", p: ["Last updated 2 October 2026. We change this page when what we collect changes, and the date moves with it."] },
  ],
};

const FR: PrivacyCopy = {
  path: "/fr/confidentialite/",
  title: "Confidentialité et cookies",
  metaDescription: fr("Ce que ce site collecte, pourquoi, et les choix dont vous disposez : le formulaire de contact, les deux éléments conservés dans votre navigateur et vos droits au titre du RGPD."),
  eyebrow: "Ce que nous collectons et pourquoi",
  subhead: fr("Ce que ce site collecte, pourquoi, et les choix dont vous disposez."),
  intro: fr("Nous limitons au strict nécessaire les données que ce site traite : ce que vous nous envoyez par le formulaire de contact, un petit enregistrement de vos choix dans votre navigateur et, seulement si vous l’autorisez, la façon dont les pages du site sont consultées."),
  home: "Accueil",
  homeHref: "/fr/",
  settingsButton: "Ouvrir les réglages des cookies",
  sections: [
    {
      h: "Qui nous sommes",
      p: [
        "Mike Bastin est un cabinet de référencement multilingue et une marque de BeTranslated (NIF B40654865), dont le siège est Calle Doctor Ferran, Valencia, Espagne. Notre bureau de Valencia est situé Calle Rugat 12 - 2, 46021 Valencia. Vous pouvez nous écrire à hello@mikebastin.com.",
        "Nous décidons de l’usage des données décrites ici : nous sommes le responsable de traitement au sens du RGPD.",
      ],
    },
    {
      h: "Le formulaire de contact",
      p: [
        "Lorsque vous envoyez le formulaire de contact, nous recevons votre nom, votre adresse e-mail et votre message. Vous pouvez aussi indiquer le nom de votre entreprise, un budget et le service qui vous intéresse.",
        "Nous utilisons ces informations pour répondre à votre demande, et uniquement pour cela. La base légale est votre consentement, donné en cochant la case du formulaire, ainsi que les démarches que vous nous demandez d’effectuer avant tout contrat.",
        "Notre hébergeur, Hostinger, traite le formulaire et le transmet à notre messagerie. Nous conservons une demande aussi longtemps que nous restons en contact avec vous à son sujet, puis le temps nécessaire pour la traiter ou pour respecter une obligation légale.",
      ],
    },
    {
      h: "Cookies et stockage local",
      p: ["Le site conserve deux éléments dans votre navigateur. Tous deux restent sur votre appareil et servent uniquement à faire fonctionner le site comme vous l’avez réglé."],
      table: {
        head: ["Élément", "Rôle", "Durée"],
        rows: [
          ["mb-theme", "Mémorise votre choix du mode d’affichage clair ou sombre", "Jusqu’à ce que vous le changiez ou effaciez les données du navigateur"],
          ["mb-consent", "Mémorise vos choix sur les cookies", "Six mois au plus, puis nous vous demandons à nouveau"],
        ],
      },
    },
    {
      h: "Mesure d’audience et contenus intégrés",
      p: ["Pour comprendre comment le site est consulté, nous utilisons Google Analytics 4 (Google), Microsoft Clarity (Microsoft), qui enregistre le défilement et les clics sur les pages, et Ahrefs Web Analytics (Ahrefs). Ces trois outils restent désactivés tant que vous n’autorisez pas la mesure d’audience dans les réglages des cookies, et vous pouvez retirer cette autorisation à tout moment. Nous n’utilisons aucun cookie publicitaire. Les contenus intégrés d’autres sites suivent la même règle."],
    },
    {
      h: "Les autres sites",
      p: ["Les polices, les images et les scripts proviennent de notre propre serveur. Les liens vers d’autres sites, comme LinkedIn, mènent à des services qui ont leur propre politique de confidentialité."],
    },
    {
      h: "Qui traite les données",
      p: ["Notre hébergeur (Hostinger) et notre fournisseur de messagerie traitent les données pour notre compte, afin que le site et la boîte de réception fonctionnent, de même que Google, Microsoft et Ahrefs lorsque vous autorisez la mesure d’audience. Nous utilisons vos données pour vous répondre et améliorer le site, et nous ne les vendons ni ne les transmettons à des fins de prospection."],
    },
    {
      h: "Vos droits",
      p: ["Au titre du RGPD, vous pouvez :"],
      list: [
        "demander une copie de vos données",
        "les faire rectifier ou effacer",
        "limiter leur usage ou vous y opposer",
        "les recevoir dans un format portable",
        "retirer votre consentement à tout moment, lorsque nous nous appuyons sur lui",
      ],
    },
    {
      h: "Exercer vos droits et réclamer",
      p: [
        "Écrivez à hello@mikebastin.com : nous vous répondrons dans un délai d’un mois.",
        "Vous pouvez aussi introduire une réclamation auprès de l’autorité espagnole de protection des données, l’Agencia Española de Protección de Datos (aepd.es), ou auprès de l’autorité de votre pays.",
      ],
    },
    { h: "Modifier vos choix de cookies", p: ["Ouvrez les réglages des cookies pour autoriser ou retirer la mesure d’audience et les contenus intégrés à tout moment."], settings: true },
    { h: "Mises à jour", p: ["Dernière mise à jour : 2 octobre 2026. Nous modifions cette page lorsque ce que nous collectons change, et la date évolue avec elle."] },
  ].map((s) => ({
    ...s,
    h: fr(s.h),
    p: s.p?.map(fr),
    list: (s as PrivacySection).list?.map(fr),
    table: (s as PrivacySection).table && {
      head: (s as PrivacySection).table!.head.map(fr),
      rows: (s as PrivacySection).table!.rows.map((r) => r.map(fr)),
    },
  })),
};

const ES: PrivacyCopy = {
  path: "/es/privacidad/",
  title: "Privacidad y cookies",
  metaDescription: "Qué recoge este sitio, por qué y qué puedes decidir: el formulario de contacto, los dos elementos que se guardan en tu navegador y tus derechos según el RGPD.",
  eyebrow: "Qué recogemos y por qué",
  subhead: "Qué recoge este sitio, por qué y qué puedes decidir.",
  intro: "Reducimos al mínimo los datos que trata este sitio: lo que nos envías en el formulario de contacto, un pequeño registro de tus decisiones en tu navegador y, solo si lo permites, cómo se usan las páginas del sitio.",
  home: "Inicio",
  homeHref: "/es/",
  settingsButton: "Abrir los ajustes de cookies",
  sections: [
    {
      h: "Quiénes somos",
      p: [
        "Mike Bastin es una consultoría de posicionamiento multilingüe y una marca de BeTranslated (NIF B40654865), con domicilio social en la calle Doctor Ferran, Valencia, España. Nuestra oficina de Valencia está en Calle Rugat 12 - 2, 46021 Valencia. Puedes escribirnos a hello@mikebastin.com.",
        "Decidimos cómo se usan los datos que se describen aquí, por lo que somos el responsable del tratamiento según el RGPD.",
      ],
    },
    {
      h: "El formulario de contacto",
      p: [
        "Cuando envías el formulario de contacto recibimos tu nombre, tu correo electrónico y tu mensaje. También puedes indicar el nombre de tu empresa, un presupuesto y el servicio que te interesa.",
        "Usamos estos datos para responder a tu consulta, y solo para eso. La base legal es tu consentimiento, que das al marcar la casilla del formulario, y las gestiones que nos pides antes de cualquier contrato.",
        "Nuestro proveedor de alojamiento, Hostinger, gestiona el formulario y lo entrega en nuestro buzón. Guardamos una consulta mientras sigamos en contacto contigo por ese motivo, y el tiempo posterior que necesitemos para resolverla o cumplir una obligación legal.",
      ],
    },
    {
      h: "Cookies y almacenamiento local",
      p: ["El sitio guarda dos elementos en tu navegador. Ambos se quedan en tu dispositivo y sirven solo para que el sitio funcione como lo has configurado."],
      table: {
        head: ["Elemento", "Para qué sirve", "Cuánto dura"],
        rows: [
          ["mb-theme", "Recuerda si elegiste el tema claro o el oscuro", "Hasta que lo cambies o borres los datos del navegador"],
          ["mb-consent", "Recuerda tus decisiones sobre las cookies", "Hasta seis meses, y luego te lo volvemos a preguntar"],
        ],
      },
    },
    {
      h: "Analítica y contenido incrustado",
      p: ["Para ver cómo se usa el sitio, utilizamos Google Analytics 4 (Google), Microsoft Clarity (Microsoft), que registra cómo se desplazan y se pulsan las páginas, y Ahrefs Web Analytics (Ahrefs). Las tres herramientas siguen desactivadas hasta que permitas la analítica en los ajustes de cookies, y puedes retirar ese permiso cuando quieras. No usamos cookies publicitarias. El contenido incrustado de otros sitios sigue la misma regla."],
    },
    {
      h: "Otros sitios",
      p: ["Las fuentes, las imágenes y los scripts vienen de nuestro propio servidor. Los enlaces a otros sitios, como LinkedIn, llevan a servicios con su propia política de privacidad."],
    },
    {
      h: "Quién trata los datos",
      p: ["Nuestro proveedor de alojamiento (Hostinger) y nuestro proveedor de correo tratan los datos por cuenta nuestra, para que funcionen el sitio y el buzón, igual que Google, Microsoft y Ahrefs cuando permites la analítica. Usamos tus datos para responderte y mejorar el sitio, y ni los vendemos ni los cedemos con fines de marketing."],
    },
    {
      h: "Tus derechos",
      p: ["Según el RGPD puedes:"],
      list: [
        "pedir una copia de tus datos",
        "rectificarlos o suprimirlos",
        "limitar su uso u oponerte a él",
        "recibirlos en un formato portable",
        "retirar tu consentimiento en cualquier momento, cuando nos basemos en él",
      ],
    },
    {
      h: "Ejercer tus derechos y reclamar",
      p: [
        "Escribe a hello@mikebastin.com y te responderemos en un plazo de un mes.",
        "También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es) o ante la autoridad de tu país.",
      ],
    },
    { h: "Cambiar tus decisiones sobre cookies", p: ["Abre los ajustes de cookies para permitir o retirar la analítica y el contenido incrustado cuando quieras."], settings: true },
    { h: "Actualizaciones", p: ["Última actualización: 2 de octubre de 2026. Cambiamos esta página cuando cambia lo que recogemos, y la fecha cambia con ella."] },
  ],
};

export const PRIVACY: Record<Locale, PrivacyCopy> = { en: EN, fr: FR, es: ES };
