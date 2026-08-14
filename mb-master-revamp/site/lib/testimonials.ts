/**
 * Google Business Profile reviews, transcribed verbatim 2026-08-14.
 *
 * DISPLAY ONLY. These carry no Review or AggregateRating schema, deliberately.
 * Google excludes reviews collected from another site, and excludes
 * self-serving ratings about the entity hosting them. Marking these up would
 * risk a structured-data manual action. The value here is conversion and
 * trust; the ranking signal already lives on the GBP itself, which is linked
 * from `source` below and carried in Person.sameAs.
 *
 * `quote` is the reviewer's own words and must never be edited, including
 * where a reviewer writes "Michael" rather than the "Mike Bastin" site brand.
 * copy-editor must exempt this field.
 */

export type Testimonial = {
  name: string;
  /** BCP-47 of the language the review was actually written in */
  lang: "nl" | "es" | "en" | "fr";
  langLabel: string;
  quote: string;
  /** English rendering, shown as secondary. Null when already English. */
  english: string | null;
  when: string;
  /** what the review is actually about, used for filtering and honesty */
  theme: "training" | "delivery" | "expertise";
  localGuide?: boolean;
};

export const GBP_URL = "https://www.google.com/maps?cid=5084624758674071823";

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alicia Boronat",
    lang: "en",
    langLabel: "English",
    quote:
      "I needed some help with my website, and thank God I found Mike and his team! They identified what was missing and started working on it from day one. Their improvements showed results and still do! That's why I continue to work with them. If you feel lost with your website, SEO and marketing in general, contact them, they'll make your life easier. Thanks guys!",
    english: null,
    when: "One month ago",
    theme: "delivery",
    localGuide: true,
  },
  {
    name: "Travis March",
    lang: "nl",
    langLabel: "Nederlands",
    quote:
      "Sinds de nieuwe opmaak is doorgevoerd, is het aantal bezoekers merkbaar toegenomen. Deze combinatie van design en resultaat maakt de vernieuwing zeer geslaagd. Dank aan Michael en zijn team!",
    english:
      "Since the new design went live, visitor numbers have noticeably increased. That combination of design and results makes the redesign a real success. Thanks to Michael and his team!",
    when: "Ten months ago",
    theme: "delivery",
  },
  {
    name: "stéphane lamborelle",
    lang: "fr",
    langLabel: "Français",
    quote:
      "Michael m'a formé aux bases du référencement international avec beaucoup de pédagogie et de clarté. Sa méthode m'a permis de comprendre rapidement les enjeux du SEO à l'échelle mondiale et d'appliquer les bonnes pratiques à mon propre projet. Je recommande vivement ses formations pour toute personne souhaitant s'initier au référencement international.",
    english:
      "Michael trained me in the fundamentals of international SEO with real teaching skill and clarity. His method let me grasp the stakes of SEO at a global scale quickly, and apply good practice to my own project. I recommend his training warmly to anyone wanting to get started in international search.",
    when: "One year ago",
    theme: "training",
  },
  {
    name: "Nicolás Cevallos",
    lang: "es",
    langLabel: "Español",
    quote:
      "Mike es un excelente mentor y gran profesional. Gracias a su forma clara de enseñar, aprendí muchísimo sobre SEO y marketing digital. Explica conceptos complejos de manera sencilla y práctica, lo que me permitió aplicar lo aprendido rápidamente. Muy recomendable para cualquiera que quiera crecer en este campo.",
    english:
      "Mike is an excellent mentor and a fine professional. Thanks to his clear way of teaching, I learned a great deal about SEO and digital marketing. He explains complex concepts simply and practically, which let me apply what I had learned quickly. Highly recommended for anyone wanting to grow in this field.",
    when: "Ten months ago",
    theme: "training",
  },
  {
    name: "bas wiertz",
    lang: "nl",
    langLabel: "Nederlands",
    quote:
      "Ik heb fijn samengewerkt met Mike. Hij heeft veel kennis van AI en SEO en denkt goed mee. Hij heeft me goed geholpen en de samenwerking verliep prettig. Ik heb er veel van geleerd.",
    english:
      "Working with Mike was a pleasure. He knows a great deal about AI and SEO and thinks with you rather than at you. He helped me properly, the collaboration ran smoothly, and I learned a lot from it.",
    when: "Six months ago",
    theme: "training",
  },
  {
    name: "maja w",
    lang: "en",
    langLabel: "English",
    quote:
      "Mike is a highly skilled professional in SEO and digital marketing and I've learned a great deal from his practical, results-focused approach. He's reliable, detail-oriented, and consistently ensures client needs are met. Highly recommend!!",
    english: null,
    when: "One year ago",
    theme: "training",
  },
  {
    name: "Robert Bouchez",
    lang: "nl",
    langLabel: "Nederlands",
    quote:
      "Ik werk al samen met Mike al meer dan 1 jaar nu. Hij zorgt voor mijn website, vertalingen enz. Ik kan hem ten zeerste aanbevelen. Fantastisch team, top werk van hoog niveau! Bedankt Mike",
    english:
      "I have been working with Mike for more than a year now. He looks after my website, translations and so on. I can recommend him most warmly. Fantastic team, top work of a high standard. Thanks Mike.",
    when: "One year ago",
    theme: "delivery",
    localGuide: true,
  },
  {
    name: "Rhona Kappler",
    lang: "en",
    langLabel: "English",
    quote:
      "I have worked with Mike and his team on a variety of projects over the years. He is always friendly, quick to respond and offers valuable expertise in digital marketing and SEO.",
    english: null,
    when: "One year ago",
    theme: "delivery",
  },
  {
    name: "Amaury Guenant",
    lang: "fr",
    langLabel: "Français",
    quote:
      "Michael maitrise parfaitement les différentes stratégies SEO. Il a une très longue et riche expérience en la matière. Je n'ai aucun doute sur la qualité de ses conseils. Il peut également mettre en place tout le contenu et plugins qui vous permettront d'optimiser rapidement votre site sur les moteurs de recherche. Comme moi, c'est un \"Boomer\" (presque!), qui a su prendre le tournant de l'IA et qui l'utilise à bon escient. Et pour tout ce qui concerne la mise en place et le suivi des conversions, il pourra sans aucun doute vous aiguiller vers le bon partenaire.",
    english:
      "Michael has a complete command of the different SEO strategies. He has very long and rich experience in the field. I have no doubt about the quality of his advice. He can also put in place all the content and plugins that let you optimise your site for search engines quickly. Like me he is almost a Boomer, one who took the AI turn and uses it sensibly. And for anything to do with setting up and tracking conversions, he can point you to the right partner without hesitation.",
    when: "One year ago",
    theme: "expertise",
  },
  {
    name: "Sammy Cooil",
    lang: "en",
    langLabel: "English",
    quote:
      "Mike is very driven and extremely professional in every aspect of his work. He takes a great deal of care with each task and always puts his client first, ensuring their needs are met during each stage of the process. Mike's professionalism and vast experience makes him a reliable choice and one you can count on time and time again.",
    english: null,
    when: "One year ago",
    theme: "expertise",
  },
];
