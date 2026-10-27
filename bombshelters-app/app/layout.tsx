import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bombshelters.com"),
  title: "BombShelters.com | Underground Bunkers, Storm Shelters & Fortified Cabins",
  description:
    "America's premier builder of sub-surface bomb shelters, military blast bunkers, ballistic safe rooms, and engineered steel cabins. Built for a safer tomorrow.",
  keywords: [
    "bomb shelters",
    "underground bunkers",
    "storm shelters",
    "safe rooms",
    "luxury bunkers",
    "steel framed homes",
    "off-grid cabins",
    "FEMA storm shelters",
    "disaster preparedness",
  ],
  authors: [{ name: "BombShelters.com Engineering Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bombshelters.com",
    siteName: "BombShelters.com",
    title: "BombShelters.com | Bunkers, Cabins & A Stronger Tomorrow",
    description:
      "Military-grade blast shelters, underground survival bunkers, and heavy-gauge steel homes engineered to endure any catastrophe.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Underground Bomb Shelter Architectural Cutaway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BombShelters.com | Bunkers, Cabins & A Stronger Tomorrow",
    description: "Hardened underground shelters and defense-grade modular living solutions.",
    images: ["https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://bombshelters.com/#organization",
      "name": "BombShelters.com",
      "url": "https://bombshelters.com",
      "logo": "https://bombshelters.com/bomb_logo.png",
      "description": "Provider of residential and commercial blast shelters, underground bunkers, and steel cabins.",
      "telephone": "+1-812-595-4033",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    },
    {
      "@type": "Product",
      "name": "Standard Underground Bomb Shelter",
      "description": "Sub-surface corrugated steel NBC fallout shelter for 4-8 persons.",
      "brand": {
        "@type": "Brand",
        "name": "BombShelters.com"
      },
      "offers": {
        "@type": "Offer",
        "price": "49900",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://bombshelters.com/#featured-models"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#e11d1d] selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
