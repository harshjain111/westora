import localFont from "next/font/local";

// Canela (the design system's primary display face) has no free
// self-hostable distribution — Cormorant Garamond is the free alternative
// the design system itself names for exactly this case.
export const cormorantGaramond = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const jetBrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
