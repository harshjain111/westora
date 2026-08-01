import { products } from "@/data/products";
import { cn } from "@/lib/utils/cn";

export interface ProductMultiSelectProps {
  value: string[];
  onChange: (slugs: string[]) => void;
  id?: string;
}

export function ProductMultiSelect({ value, onChange, id }: ProductMultiSelectProps) {
  const toggle = (slug: string) => {
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);
  };

  return (
    <div id={id} role="group" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {products.map((product) => {
        const checked = value.includes(product.slug);
        return (
          <label
            key={product.slug}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2 border px-3 py-2 text-small text-ink",
              checked ? "border-accent bg-accent/5" : "border-rule",
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(product.slug)}
              className="h-4 w-4 accent-accent"
            />
            {product.name}
          </label>
        );
      })}
    </div>
  );
}
