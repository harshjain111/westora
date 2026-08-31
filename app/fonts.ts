import localFont from "next/font/local";

// Display face. Was Cormorant Garamond, a serif standing in for the
// design system's Canela — replaced at the client's direction (2026-09)
// with a sans for a more modern register. Manrope is a humanist
// grotesque: geometric enough to read contemporary at 72px, but with
// enough warmth in the curves not to feel like a tech startup, which
// matters for a house selling agricultural provenance.
//
// Shipped as a single variable file covering 200–800, so the whole
// display weight range costs one 24KB request rather than the two
// static cuts the serif needed. Manrope has no italic; headline
// emphasis is carried by weight and colour instead — see Hero.tsx.
//
// font-src in next.config.ts is 'self' data:, so the Google Fonts CDN
// is blocked by CSP and this must stay self-hosted.
export const manrope = localFont({
  src: [{ path: "./fonts/manrope-variable.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
});

// Also serves the --font-mono role (labels, eyebrows, specs, nav) — see
// globals.css. JetBrains Mono read as a coding/technical typeface for
// those spots; reusing Inter here is both the more elegant/corporate
// match for the palette and one fewer font file for the browser to
// fetch, which also helps first-load weight on mobile.
export const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});
