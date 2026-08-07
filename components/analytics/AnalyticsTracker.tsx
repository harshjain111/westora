"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/lib/context/CookieConsentContext";
import { getOrCreateSessionId } from "@/lib/analytics/session";

const CLICK_FLUSH_INTERVAL_MS = 15000;
const CLICK_BUFFER_HARD_CAP = 50;
const SECTION_VISIBLE_THRESHOLD = 0.5;

interface OutgoingEvent {
  sessionId: string;
  isNewSession?: boolean;
  entryPath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageViews?: { path: string }[];
  sections?: { path: string; sectionId: string; durationMs: number }[];
  clicks?: { path: string; xPct: number; yPct: number }[];
}

interface SectionState {
  visibleSince: number | null;
  accumulatedMs: number;
}

function send(payload: OutgoingEvent, useBeacon: boolean) {
  const body = JSON.stringify(payload);
  if (useBeacon && "sendBeacon" in navigator) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/analytics", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {
    // Best-effort telemetry — a dropped beacon is never worth surfacing.
  });
}

/**
 * Renders nothing. Only ever active once the visitor has explicitly
 * clicked "Allow" on the cookie banner (CookieConsentBanner.tsx) — every
 * effect below is a no-op while consent is null or "denied", matching the
 * fail-closed contract in CookieConsentContext.tsx. Sends first-party,
 * PII-free events (page views, per-section time-on-screen, click
 * coordinates for the admin heatmap) to /api/analytics.
 */
export function AnalyticsTracker() {
  const { consent } = useCookieConsent();
  const pathname = usePathname();

  const sessionIdRef = useRef<string | null>(null);
  const pathRef = useRef(pathname);
  const sectionStateRef = useRef(new Map<string, SectionState>());
  const clickBufferRef = useRef<{ path: string; xPct: number; yPct: number }[]>([]);

  function drainSections(path: string) {
    const now = performance.now();
    const out: { path: string; sectionId: string; durationMs: number }[] = [];
    for (const [sectionId, state] of sectionStateRef.current) {
      let total = state.accumulatedMs;
      if (state.visibleSince !== null) {
        total += now - state.visibleSince;
        // Keep observing — just bank what's accrued so far and restart
        // the window, rather than dropping the observer's live state.
        state.visibleSince = now;
      }
      state.accumulatedMs = 0;
      if (total > 0) out.push({ path, sectionId, durationMs: Math.round(total) });
    }
    return out;
  }

  function flush(useBeacon: boolean) {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    const sections = drainSections(pathRef.current);
    const clicks = clickBufferRef.current.splice(0, clickBufferRef.current.length);
    if (sections.length === 0 && clicks.length === 0) return;
    send({ sessionId, sections, clicks }, useBeacon);
  }

  // Bootstrap once consent flips to "allowed": session id, click capture,
  // periodic + unload flushing. Torn down completely if consent is ever
  // revoked or the component unmounts.
  useEffect(() => {
    if (consent !== "allowed") return undefined;

    const { sessionId, isNew } = getOrCreateSessionId();
    sessionIdRef.current = sessionId;

    if (isNew) {
      const params = new URLSearchParams(window.location.search);
      send(
        {
          sessionId,
          isNewSession: true,
          entryPath: window.location.pathname,
          referrer: document.referrer || undefined,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
        },
        false,
      );
    }

    const handleClick = (event: MouseEvent) => {
      const doc = document.documentElement;
      const xPct = (event.pageX / doc.scrollWidth) * 100;
      const yPct = (event.pageY / doc.scrollHeight) * 100;
      clickBufferRef.current.push({
        path: pathRef.current,
        xPct: Math.min(100, Math.max(0, xPct)),
        yPct: Math.min(100, Math.max(0, yPct)),
      });
      if (clickBufferRef.current.length >= CLICK_BUFFER_HARD_CAP) flush(false);
    };
    document.addEventListener("click", handleClick, { passive: true });

    const clickInterval = window.setInterval(() => flush(false), CLICK_FLUSH_INTERVAL_MS);

    const handleHide = () => {
      if (document.visibilityState === "hidden") flush(true);
    };
    document.addEventListener("visibilitychange", handleHide);
    window.addEventListener("pagehide", handleHide);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleHide);
      window.removeEventListener("pagehide", handleHide);
      window.clearInterval(clickInterval);
      flush(true);
      sessionIdRef.current = null;
      sectionStateRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent]);

  // Per-route: record the page view and (re)observe this page's
  // <section id> elements for time-on-screen.
  useEffect(() => {
    if (consent !== "allowed" || !sessionIdRef.current) return undefined;

    flush(false); // bank whatever accrued on the previous path first
    pathRef.current = pathname;
    sectionStateRef.current.clear();
    send({ sessionId: sessionIdRef.current, pageViews: [{ path: pathname }] }, false);

    const elements = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const state = sectionStateRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        for (const entry of entries) {
          const id = entry.target.id;
          const existing = state.get(id) ?? { visibleSince: null, accumulatedMs: 0 };
          const isVisibleEnough =
            entry.isIntersecting && entry.intersectionRatio >= SECTION_VISIBLE_THRESHOLD;
          if (isVisibleEnough && existing.visibleSince === null) {
            existing.visibleSince = now;
          } else if (!isVisibleEnough && existing.visibleSince !== null) {
            existing.accumulatedMs += now - existing.visibleSince;
            existing.visibleSince = null;
          }
          state.set(id, existing);
        }
      },
      { threshold: [0, SECTION_VISIBLE_THRESHOLD, 1] },
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, pathname]);

  return null;
}
