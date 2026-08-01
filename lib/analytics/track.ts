/**
 * Every event name and payload shape below is exactly PRD §12 — no
 * additions, no renames. No PII in any payload (product slugs, category
 * keys, section names and counts only — never names, emails or phone
 * numbers).
 *
 * Fires through Plausible's custom events API (window.plausible), which
 * only exists once the Plausible script (below, gated on
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN) has loaded. No-ops otherwise, so every
 * call site works today and starts reporting the moment that env var and
 * script are wired up — nothing else needs to change.
 */

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export interface AnalyticsEvents {
  hero_cta_click: { target: "catalogue" | "quote" };
  product_card_click: { slug: string; category: string };
  product_modal_open: { slug: string; source: "grid" | "map" | "deeplink" };
  catalogue_filter_change: { category: string };
  origin_map_state_click: { state: string };
  faq_open: { question_index: number };
  enquiry_form_start: { source_section: string; source_product?: string };
  enquiry_form_submit: { source_section: string; source_product?: string; product_count: number };
  enquiry_form_error: { field: string };
  catalogue_pdf_download: Record<string, never>;
  whatsapp_click: { location: string };
}

export function track<E extends keyof AnalyticsEvents>(event: E, props?: AnalyticsEvents[E]) {
  if (typeof window === "undefined" || !window.plausible) return;
  window.plausible(event, props ? { props: props as Record<string, string | number> } : undefined);
}
