"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useCookieConsent } from "@/lib/context/CookieConsentContext";

const EXIT_DURATION_MS = 250;

/**
 * Shown once per browser until answered. Allow/Disallow are deliberately
 * equal-weight buttons, not a big "Accept" next to a tiny "reject" link —
 * EU regulators (CNIL, EDPB) treat that imbalance, and any banner that
 * blocks the page behind a cookie choice, as non-compliant "consent".
 * The site's own content and every page keep working identically either
 * way; this only gates whether the analytics tracker (lib/analytics)
 * is allowed to send anything.
 */
export function CookieConsentBanner() {
  const { consent, hasCheckedStorage, setConsent } = useCookieConsent();
  const prefersReducedMotion = useReducedMotion();
  const shouldShow = hasCheckedStorage && consent === null;

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const unmountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldShow) {
      if (unmountTimeoutRef.current) {
        clearTimeout(unmountTimeoutRef.current);
        unmountTimeoutRef.current = null;
      }
      setIsMounted(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    if (isMounted) {
      setIsVisible(false);
      unmountTimeoutRef.current = setTimeout(() => setIsMounted(false), EXIT_DURATION_MS);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]);

  useEffect(
    () => () => {
      if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    },
    [],
  );

  if (!isMounted) return null;

  return (
    <motion.div
      role="region"
      aria-label="Cookie notice"
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-rule bg-surface-raised"
    >
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p className="max-w-[64ch] text-small text-ink-muted">
          We use cookies to remember your visit and understand how people use this site — which
          pages, roughly how long, and which areas get read. Nothing personal is collected or
          sold. See our{" "}
          <a href="/privacy" className="text-accent underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="md" onClick={() => setConsent("denied")}>
            Disallow
          </Button>
          <Button variant="primary" size="md" onClick={() => setConsent("allowed")}>
            Allow
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
