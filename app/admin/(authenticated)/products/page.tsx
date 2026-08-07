import Image from "next/image";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getProducts } from "@/data/products";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/types";

export const metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const role: ProfileRole = (profile?.role as ProfileRole) ?? "viewer";
  const canEdit = role === "admin";

  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading level={1}>Products</Heading>
        {canEdit && (
          <Button as="a" href="/admin/products/new" variant="primary">
            Add product
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <p className="mt-8 border border-rule bg-surface-raised p-6 text-body text-ink-muted">
          No products yet.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col gap-4 border border-rule bg-surface-raised p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-rule">
                {product.images[0] && (
                  <Image
                    src={product.images[0].src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized={product.images[0].src.startsWith("http")}
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="font-display text-lead text-ink">{product.name}</p>
                <p className="font-mono text-small text-ink-muted">
                  {product.category} · {product.origin} · /{product.slug}
                  {product.featured ? " · Featured" : ""}
                </p>
              </div>

              <div className="flex shrink-0 gap-3">
                <Button as="a" href={`/products/${product.slug}`} variant="secondary">
                  View
                </Button>
                {canEdit && (
                  <>
                    <Link
                      href={`/admin/products/${product.slug}/edit`}
                      className="inline-flex min-h-[54px] items-center justify-center rounded-button border-[1.5px] border-accent px-[34px] font-body text-[16px] font-semibold text-brand-deep hover:bg-surface"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton slug={product.slug} name={product.name} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
