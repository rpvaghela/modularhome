"use client";

import Script from "next/script";

/**
 * Google Analytics 4 (GA4) integration.
 *
 * Usage: Set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in your .env.local (and Vercel env).
 * This component is rendered in the root layout; it is a no-op when the env var is unset.
 *
 * The gtag script loads with strategy="afterInteractive" so it does NOT block page hydration.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      {/* Load the gtag.js library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      {/* Initialize GA4 */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "${measurementId}", {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
