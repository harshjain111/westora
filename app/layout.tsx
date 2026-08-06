import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { cormorantGaramond, inter, jetBrainsMono } from "./fonts";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonld";
import { EnquiryModal } from "@/components/form/EnquiryModal";
import { EnquiryModalProvider } from "@/lib/context/EnquiryModalContext";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://westoraglobal.com";

// Description condensed from the already-approved, locked hero subline
// (PRD FR-2.4) rather than the missing content doc §6 meta description —
// same reasoning as EnquirySection's commitment lines: reuse approved
// copy, don't invent new claims.
const ROOT_DESCRIPTION =
  "Westora Global exports 17 origin-locked spices, teas, rice and chillies from Northeast India to buyers in the UK and US — traceable to district, tested to spec, delivered on schedule.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Westora Global — Spice, Tea & Rice Exporters from Northeast India | UK & US Supply",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = buildOrganizationJsonLd();
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html
      lang="en-GB"
      className={`${cormorantGaramond.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body className="font-body antialiased">
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
        {/* Cookieless — no consent banner needed, keeps the GDPR story
            clean (PRD §7). Renders nothing until NEXT_PUBLIC_PLAUSIBLE_
            DOMAIN is set, so this is inert until that's configured. */}
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
