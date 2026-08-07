"use client";

import Script from "next/script";
import { useCookieConsent } from "@/lib/context/CookieConsentContext";

/**
 * Loads the optional Plausible script only once the visitor has
 * explicitly allowed it — consent === null (undecided) or "denied" both
 * render nothing, matching the fail-closed rule in
 * CookieConsentContext.tsx. Renders nothing at all if the domain isn't
 * configured, same as before.
 */
export function AnalyticsScripts({ plausibleDomain }: { plausibleDomain?: string }) {
  const { consent } = useCookieConsent();

  if (!plausibleDomain || consent !== "allowed") return null;

  return (
    <Script
      defer
      data-domain={plausibleDomain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
