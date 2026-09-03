import "../output.css";
import { siteConfig } from "./site";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "ร้านอาหารสยาม เช็กคิวและเทียบความคุ้ม | กินไหนดี",
    template: "%s | กินไหนดี",
  },

  description: siteConfig.description,

  applicationName: "กินไหนดี",
  authors: [{ name: "กินไหนดี" }],
  creator: "กินไหนดี",
  publisher: "กินไหนดี",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  keywords: [
    "ร้านอาหารสยาม",
    "ร้านอาหาร Siam Square",
    "ร้านอาหารสยามสแควร์",
    "ร้านอาหารใกล้ฉัน",
    "เช็กคิวร้านอาหาร",
    "ร้านอาหาร Siam Center",
  ],

  alternates: {
    canonical: "/",
    languages: {
      "th-TH": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: "กินไหนดี",
    title: "ร้านอาหารสยาม เช็กคิวและเทียบความคุ้ม | กินไหนดี",
    description: siteConfig.description,
  },

  twitter: {
    card: "summary_large_image",
    title: "ร้านอาหารสยาม เช็กคิวและเทียบความคุ้ม | กินไหนดี",
    description: siteConfig.description,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "food",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f7f3eb',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "กินไหนดี",
    alternateName: ["กินไหนดี SIAM", "กินไหนดี Siam"],

    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "th-TH",
  };

  return (
    <html lang="th">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
