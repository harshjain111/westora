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
        "group block w-full rounded-card bg-surface-raised p-2.5 text-left shadow-[0_6px_22px_rgba(0,0,0,0.05)] transition-all duration-300 sm:p-3",
        "hover:-translate-y-[5px] hover:shadow-[0_22px_50px_rgba(43,32,21,0.13)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
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
            sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
          />
        )}
        {/* Warm scrim that washes up on hover — gives the card a sense of
            depth without touching the photograph's own colour at rest. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/45 via-transparent to-transparent opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100"
        />
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

      <div className="mt-3">
        <p className="font-display text-small font-semibold leading-tight text-ink">{product.name}</p>
        <p className="mt-1.5 text-[12px] leading-snug text-ink-muted">{product.origin}</p>
        {/* At half size a bordered pill would dominate the card, so the
            affordance is carried by a colour-and-arrow shift instead. The
            whole card is the button; this is a cue, not a second target. */}
        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] tracking-mono-label uppercase text-ink-muted transition-colors duration-300 group-hover:text-accent">
          Details
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </button>
  );
}
