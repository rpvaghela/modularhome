import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
import { getPublicGlobalSettings } from "@/lib/settings";
import { getPublicPages, getMegaMenuCatalog } from "@/lib/publicData";
import { getRobotsMetadata, PRODUCTION_CANONICAL_HOST } from "@/lib/seo";
import LocomotiveScrollProvider from "@/components/LocomotiveScrollProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

export const revalidate = 300;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-next",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-next",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicGlobalSettings();
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_SITE_URL || "modularhome.com";
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
      template: "%s",
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
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://code.tidio.co" />
        <link rel="dns-prefetch" href="https://code.tidio.co" />
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
                <Script
                  src="//code.tidio.co/hnehqsvmi7ef3rcnmbydqpmvafzzhydf.js"
                  strategy="lazyOnload"
                />
                {/* Enable mouse-wheel scrolling inside the Tidio chat iframe */}
                <Script id="tidio-wheel-scroll" strategy="lazyOnload">{`
                  (function() {
                    function enableTidioWheelScroll() {
                      var iframe = document.querySelector('#tidio-chat-iframe');
                      if (!iframe) return;
                      iframe.addEventListener('mouseenter', function() {
                        iframe.style.pointerEvents = 'auto';
                      });
                      // Forward host wheel events into the iframe's scrollable content
                      var container = iframe.parentElement;
                      if (container) {
                        container.style.overflowY = 'auto';
                        container.style.overscrollBehavior = 'contain';
                      }
                    }
                    // Poll until Tidio injects its iframe (usually within 2-3s)
                    var attempts = 0;
                    var poll = setInterval(function() {
                      attempts++;
                      var iframe = document.querySelector('#tidio-chat-iframe');
                      if (iframe) {
                        enableTidioWheelScroll();
                        clearInterval(poll);
                      } else if (attempts > 60) {
                        clearInterval(poll);
                      }
                    }, 500);
                  })();
                `}</Script>
              </LocomotiveScrollProvider>
            </ConfirmDialogProvider>
          </CartProvider>
        </CustomerAuthProvider>
        {/* GA4 — activates when NEXT_PUBLIC_GA_MEASUREMENT_ID env var is set */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}

