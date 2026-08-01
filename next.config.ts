import type { NextConfig } from "next";
import path from "node:path";

// Resolved at build time from env vars so the CSP doesn't hardcode a
// specific Supabase project — falls back to a permissive wildcard only
// when unset, so local dev without credentials still runs.
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://*.supabase.co";

// Prompt 60: CSP permits Supabase, Turnstile and Plausible, nothing else.
// (Resend needs no browser-side allowance — email sending is server-only.)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} https://challenges.cloudflare.com https://plausible.io`,
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
