import type { Metadata } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIBuildAssistant from "@/components/AIBuildAssistant";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
import { getPublicGlobalSettings } from "@/lib/settings";
import { getPublicPages, getMegaMenuCatalog } from "@/lib/publicData";
import { getRobotsMetadata, PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import LocomotiveScrollProvider from "@/components/LocomotiveScrollProvider";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair-next",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope-next",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, reqHeaders] = await Promise.all([
    getPublicGlobalSettings(),
    headers(),
  ]);
  const host = reqHeaders.get("host") || "";
  const robots = getRobotsMetadata(host);

  const title = settings.defaultSeoTitle || `${settings.companyName || "ModularHome.com"} | Modern Homes. A Smarter Way to Build.`;
  const description = settings.defaultMetaDescription || "Explore modular homes, prefab homes, cabins, ADUs, barndominiums, floor plans and custom home options.";
  const siteUrl = PRODUCTION_CANONICAL_HOST;
  const logoUrl = settings.logoUrl || "/newmodularlogo.png";
  const faviconUrl = settings.faviconUrl || "/favicon.png?v=4";

  return {
    metadataBase: new URL(siteUrl),
    robots,
    title: {
      default: title,
      template: `%s | ${settings.companyName || "ModularHome.com"}`,
    },
    description,
    keywords: [
      settings.companyName || "ModularHome.com",
      "Modular Homes",
      "Prefab Homes",
      "Barndominiums",
      "Cabins",
      "Tiny Homes",
      "ADUs",
      "A-Frame Homes",
      "Floor Plans",
      "Factory Built Homes",
    ],
    icons: {
      icon: [
        { url: faviconUrl, type: "image/png" },
        { url: "/favicon-32x32.png?v=4", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png?v=4", sizes: "16x16", type: "image/png" },
        { url: "/favicon.ico?v=4" },
      ],
      shortcut: faviconUrl,
      apple: [
        { url: faviconUrl, sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: settings.companyName || "ModularHome.com",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: `${settings.companyName || "ModularHome.com"} Logo`,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, pages, megaMenuCatalog] = await Promise.all([
    getPublicGlobalSettings(),
    getPublicPages(),
    getMegaMenuCatalog(),
  ]);

  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" type="image/png" href={settings.faviconUrl || "/favicon.png?v=4"} />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=4" />
        <link rel="shortcut icon" href={settings.faviconUrl || "/favicon.png?v=4"} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4" />
      </head>
      <body className={`min-h-screen flex flex-col bg-white text-[#101114] antialiased selection:bg-[#fcb907] selection:text-[#101114] ${manrope.className}`}>
        <CustomerAuthProvider>
          <CartProvider>
            <ConfirmDialogProvider>
              <LocomotiveScrollProvider>
                <Navbar initialSettings={settings} customPages={pages} megaMenuCatalog={megaMenuCatalog} />
                <main className="flex-1">
                  {children}
                </main>
                <Footer initialSettings={settings} customPages={pages} />
                <CartDrawer />
                <AIBuildAssistant />
              </LocomotiveScrollProvider>
            </ConfirmDialogProvider>
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}

