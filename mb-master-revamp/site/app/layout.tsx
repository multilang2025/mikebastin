import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";
import SiteNav from "@/components/SiteNav";

const fraunces = localFont({
  src: "./fonts/fraunces.woff2",
  variable: "--font-fraunces",
  weight: "400 700",
  display: "swap",
  preload: true,
});

const cormorant = localFont({
  src: "./fonts/cormorant.woff2",
  variable: "--font-cormorant",
  weight: "300 400",
  style: "italic",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-inter",
  weight: "300 600",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mikebastin.com"),
  title: "Mike Bastin, multilingual search consultant",
  description:
    "Twenty-five years reading the swell of search, in four languages. Multilingual SEO, localisation and AI consulting from Valencia.",
  // PREVIEW BUILD ONLY. Remove this block before the real launch, or the
  // live site ships noindex and disappears from search.
  robots: { index: false, follow: false, nocache: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Mike Bastin, multilingual search consultant",
    description:
      "Multilingual SEO, localisation and AI consulting. Ranking in EN, converting in FR, localised in ES, indexed in NL.",
    locale: "en_GB",
    type: "website",
  },
};

// Runs before paint. Stops the flash of the wrong theme.
const noFlash = `(function(){try{var s=localStorage.getItem("mb-theme");
var d=window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-theme",s||(d?"dark":"light"));}catch(e){}})();`;

/**
 * Person schema per HANDOFF.md §13. sameAs carries the real profiles
 * recorded in docs/CONTENT-ARCHITECTURE.md §1; the Google Business Profile
 * uses the stable ?cid= form, never a session-bearing search URL.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mike Bastin",
  jobTitle: "International search consultant",
  email: "hello@mikebastin.com",
  telephone: "+34671175774",
  url: "https://mikebastin.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Rugat 12",
    postalCode: "46021",
    addressLocality: "Valencia",
    addressCountry: "ES",
  },
  knowsLanguage: ["en", "fr", "es", "nl"],
  sameAs: [
    "https://x.com/mikebastin",
    "https://www.linkedin.com/in/michaelbastin/",
    "https://www.google.com/maps?cid=5084624758674071823",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${cormorant.variable} ${inter.variable}`}
      >
        <SmoothScroll />
        <ThemeToggle />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
