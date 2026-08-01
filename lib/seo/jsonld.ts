import { company, filterEmpty } from "@/data/company";
import type { Product } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://westoraglobal.com";

export function buildOrganizationJsonLd() {
  const address = filterEmpty(company.address);
  const hasAddress = Object.keys(address).length > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Westora Global",
    url: siteUrl,
    logo: `${siteUrl}/images/logo-full.png`,
    email: company.contact.email,
    telephone: company.contact.phone,
    // Omitted entirely (not rendered as an empty object) until the
    // client confirms a full registered address — empty-means-omit
    // (CLAUDE.md §11).
    ...(hasAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: [address.line1, address.line2].filter(Boolean).join(", ") || undefined,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.pincode,
        addressCountry: address.country,
      },
    }),
  };
}

export function buildProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.heroLine,
    image: product.images.map((image) => `${siteUrl}${image.src}`),
    brand: { "@type": "Brand", name: "Westora Global" },
    url: `${siteUrl}/products/${product.slug}`,
  };
}

export function buildBreadcrumbJsonLd(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteUrl}${item.href}`,
    })),
  };
}
