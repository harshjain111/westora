import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://westoraglobal.com";

// westoraglobal.com is served by a separate build outside this repo; this
// project is a staging environment. Block indexing everywhere except the
// canonical production domain, so this staging URL never competes with the
// real site in search results.
const isProductionDomain = siteUrl === "https://westoraglobal.com";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDomain) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
