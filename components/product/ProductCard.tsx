import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics/track";
import type { Product } from "@/data/products";

export interface ProductCardProps {
  product: Product;
  onOpen: (slug: string) => void;
  priority?: boolean;
}

export function ProductCard({ product, onOpen, priority = false }: ProductCardProps) {
  const image = product.images[0];

  return (
    <button
      type="button"
      onClick={() => {
        track("product_card_click", { slug: product.slug, category: product.category });
        onOpen(product.slug);
      }}
      aria-label={`${product.name} — view specifications and enquire`}
      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden border border-transparent transition-colors duration-[350ms]",
          "group-hover:border-accent/25",
        )}
      >
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.06]"
          />
        )}
        {product.hasGI && (
          <div className="absolute right-3 top-3">
            <Chip variant="accent">GI</Chip>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-2 transition-transform duration-[350ms] group-hover:-translate-y-2">
        <div>
          <p className="font-display text-lead text-ink">{product.name}</p>
          <p className="mt-1 font-mono text-small tracking-mono-label text-ink-muted">
            {product.origin}
            {product.botanical ? ` · ${product.botanical}` : ""}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 whitespace-nowrap font-mono text-small tracking-mono-label text-accent opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100"
        >
          View specs →
        </span>
      </div>
    </button>
  );
}
