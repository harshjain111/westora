import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Catalogue } from "@/components/sections/Catalogue";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { CatalogueFilterProvider } from "@/lib/context/CatalogueFilterContext";
import { getProducts } from "@/data/products";

/**
 * The full catalogue.
 *
 * The homepage section shows a preview and links here; this page renders
 * every SKU with no cap. Both use the same <Catalogue> component — the
 * only difference is that this one passes no `limit`, so there is one
 * grid, one filter and one modal implementation to maintain rather than
 * a near-duplicate.
 */

export const metadata: Metadata = {
  title: "Product catalogue — spices, tea, rice and specialty crops from Northeast India",
  description:
    "Every crop Westora Global exports from Northeast India: spices, chillies, tea, rice and specialty crops, traceable to district and tested to spec.",
  alternates: { canonical: "/catalogue" },
};

export default async function CataloguePage() {
  const products = await getProducts();

  return (
    <CatalogueFilterProvider>
      <Nav />
      <main>
        <Container className="pb-4 pt-[148px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Catalogue" }]} />
          <Heading level={1} className="mt-6 max-w-[18ch]">
            The full catalogue
          </Heading>
          <div className="mt-4 h-[3px] w-16 bg-accent" aria-hidden="true" />
          <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">
            {products.length} origin-locked crops from the seven Northeast
            states — filter by category or open any crop for its full
            specification.
          </p>
        </Container>

        <Catalogue showIntro={false} />
      </main>
      <Footer />
    </CatalogueFilterProvider>
  );
}
