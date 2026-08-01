import localFont from "next/font/local";

export const instrumentSerif = localFont({
  src: "./fonts/instrument-serif-400.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const interTight = localFont({
  src: [
    { path: "./fonts/inter-tight-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-tight-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-tight-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter-tight",
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
