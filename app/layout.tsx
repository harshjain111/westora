import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { cormorantGaramond, inter } from "./fonts";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonld";
import { EnquiryModal } from "@/components/form/EnquiryModal";
import { EnquiryModalProvider } from "@/lib/context/EnquiryModalContext";
import { CookieConsentProvider } from "@/lib/context/CookieConsentContext";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { ProductsProvider } from "@/lib/context/ProductsContext";
import { getProducts } from "@/data/products";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://westoraglobal.com";

// Description condensed from the Hero subline (client feedback round,
// 2026-08 — primary markets expanded from UK/US to nine countries across
// the Middle East, Europe, Asia and North America).
const ROOT_DESCRIPTION =
  "Westora Global exports 17 origin-locked spices, teas, rice and chillies from Northeast India to buyers across the Middle East, Europe, Asia and North America — traceable to district, tested to spec, delivered on schedule.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Westora Global — Spice, Tea & Rice Exporters from Northeast India | Global Supply",
    template: "%s | Westora Global",
  },
  description: ROOT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Westora Global",
    title: "Westora Global — Spice, Tea & Rice Exporters from Northeast India",
    description: ROOT_DESCRIPTION,
    url: siteUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Westora Global — Spice, Tea & Rice Exporters from Northeast India",
    description: ROOT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = buildOrganizationJsonLd();
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const products = await getProducts();

  return (
    <html
      lang="en-GB"
      className={`${cormorantGaramond.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased">
        <ProductsProvider products={products}>
        <CookieConsentProvider>
          <EnquiryModalProvider>
            {children}
            <EnquiryModal />
          </EnquiryModalProvider>
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <Analytics />
          <AnalyticsScripts plausibleDomain={plausibleDomain} />
          {/* Our own first-party visit/section-engagement tracker (see
              lib/analytics/) — gated on cookie consent the same way. */}
          <AnalyticsTracker />
          <CookieConsentBanner />
        </CookieConsentProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
