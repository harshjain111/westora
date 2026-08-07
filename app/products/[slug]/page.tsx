import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Chip } from "@/components/ui/Chip";
import { ProductSpecTable } from "@/components/product/ProductSpecTable";
import { ProvenanceLine } from "@/components/product/ProvenanceLine";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { EnquiryFormLazy as EnquiryForm } from "@/components/form/EnquiryFormLazy";
import { CatalogueFilterProvider } from "@/lib/context/CatalogueFilterContext";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/seo/jsonld";
import { getBySlug, getProducts } from "@/data/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

const CATEGORY_LABELS: Record<string, string> = {
  spices: "Spices",
  chillies: "Chillies",
  tea: "Tea",
  rice: "Rice",
  other: "Other",
};

// Priority queries from PRD §10, mapped to the product each one targets.
// Products without a listed target query fall back to a title built
// from name + origin, which is unique per page since heroLine is.
const TARGET_QUERY: Record<string, string> = {
  "lakadong-turmeric": "Lakadong turmeric supplier",
  "king-chilli-bhut-jolokia": "Bhut Jolokia exporter",
  "assam-tea": "Assam orthodox tea wholesale UK",
  "black-rice": "Chak-Hao black rice supplier",
  "birds-eye-chilli": "Bird's eye chilli exporter India",
  "joha-rice": "Joha rice export",
  "large-cardamom": "Large cardamom supplier UK",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getBySlug(slug);
  if (!product) return {};

  const targetQuery = TARGET_QUERY[slug];
  const title = targetQuery
    ? `${product.name} — ${targetQuery}`
    : `${product.name} from ${product.origin}`;
  const description = product.heroLine;
  const image = `/products/${slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Catalogue", href: "/#catalogue" },
    { label: CATEGORY_LABELS[product.category] ?? product.category, href: "/#catalogue" },
    { label: product.name, href: `/products/${product.slug}` },
  ];
  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <CatalogueFilterProvider>
      <Nav />
      <main className="bg-surface pt-32">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Catalogue", href: "/#catalogue" },
              { label: CATEGORY_LABELS[product.category] ?? product.category, href: "/#catalogue" },
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square w-full">
              {product.images[0] && (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>

            <div>
              <h1 className="font-display text-h2 text-ink">{product.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-small tracking-mono-label text-ink-muted">
                <span>
                  {product.origin}
                  {product.botanical ? ` · ${product.botanical}` : ""}
                </span>
                {product.hasGI && <Chip variant="accent">GI</Chip>}
              </p>

              <p className="mt-6 text-lead text-ink">{product.heroLine}</p>
              <p className="mt-4 text-body text-ink-muted">{product.description}</p>

              <div className="mt-8">
                <ProductSpecTable specs={product.specs} />
              </div>

              {product.forms.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                    Forms available
                  </p>
                  <p className="mt-2 text-body text-ink">{product.forms.join(" · ")}</p>
                </div>
              )}

              {product.packaging.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                    Packaging
                  </p>
                  <p className="mt-2 text-body text-ink">{product.packaging.join(" · ")}</p>
                </div>
              )}

              <div className="mt-10">
                <ProvenanceLine nodes={product.provenance} size="inline" className="text-ink" />
              </div>
            </div>
          </div>

          <div className="mt-20 max-w-[640px]">
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Request a sample or quote
            </p>
            <div className="mt-6">
              <EnquiryForm variant="full" lockedProduct={product.slug} sourceSection="product_page" />
            </div>
          </div>

          <div className="mt-20 border-t border-rule pt-16">
            <RelatedProducts current={product} />
          </div>
        </Container>
      </main>
      <div className="mt-24">
        <Footer />
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </CatalogueFilterProvider>
  );
}
