import Link from "next/link";
import Image from "next/image";
import { getByCategory, type Product } from "@/data/products";

export interface RelatedProductsProps {
  current: Product;
}

export function RelatedProducts({ current }: RelatedProductsProps) {
  const related = getByCategory(current.category).filter((product) => product.slug !== current.slug);

  if (related.length === 0) return null;

  return (
    <div>
      <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
        Related products
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {related.map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden">
              {product.images[0] && (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.06]"
                />
              )}
            </div>
            <p className="mt-2 font-display text-body text-ink">{product.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
