import { ImageResponse } from "next/og";
import { getBySlug, products } from "@/data/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

// No gradients, no decoration beyond wordmark and type — CLAUDE.md §4.
// Locked hex values repeated directly, same constraint as the root OG
// image and the email templates (next/og can't read CSS custom
// properties).
export default async function ProductOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0d3320",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#ca9035" }}>
          WESTORA GLOBAL
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 80, color: "#f4f2eb", fontWeight: 400 }}>
            {product?.name ?? "Westora Global"}
          </div>
          {product && (
            <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "#b9c4bc" }}>
              {product.origin}
              {product.botanical ? ` · ${product.botanical}` : ""}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
