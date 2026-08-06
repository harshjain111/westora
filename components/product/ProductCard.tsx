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
      className={cn(
        "group block w-full rounded-card bg-surface-raised p-6 text-left shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition-all duration-300",
        "hover:-translate-y-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-photo">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.03]"
          />
        )}
        {product.hasGI && (
          <div className="absolute right-2 top-2">
            <Chip variant="accent" className="bg-surface-raised">GI</Chip>
          </div>
        )}
        {product.featured && (
          <div className="absolute bottom-2 left-2">
            <Chip variant="neutral" className="bg-surface-raised">Featured</Chip>
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="font-display text-lead font-medium text-ink">{product.name}</p>
        <p className="mt-2 text-small text-ink-muted">
          <span className="text-ink">Origin:</span> {product.origin}
        </p>
        {product.forms.length > 0 && (
          <p className="mt-1 text-small text-ink-muted">
            <span className="text-ink">Available in:</span> {product.forms.slice(0, 3).join(", ")}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-westora border border-accent px-4 py-1.5 font-mono text-small tracking-mono-label text-accent">
          View details →
        </span>
      </div>
    </button>
  );
}
