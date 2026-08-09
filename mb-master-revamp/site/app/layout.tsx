import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body
        className={`${fraunces.variable} ${cormorant.variable} ${inter.variable}`}
      >
        <SmoothScroll />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
