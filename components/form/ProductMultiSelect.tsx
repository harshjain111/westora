import { useProducts } from "@/lib/context/ProductsContext";
import { inputClassName } from "@/components/form/inputStyles";
import { cn } from "@/lib/utils/cn";

export interface ProductMultiSelectProps {
  value: string[];
  onChange: (slugs: string[]) => void;
  id?: string;
}

export function ProductMultiSelect({ value, onChange, id }: ProductMultiSelectProps) {
  const { products } = useProducts();
  const selected = products.filter((product) => value.includes(product.slug));

  const remove = (slug: string) => onChange(value.filter((s) => s !== slug));

  return (
    <div>
      <select
        id={id}
        multiple
        size={5}
        value={value}
        onChange={(event) =>
          onChange(Array.from(event.target.selectedOptions, (option) => option.value))
        }
        className={cn(inputClassName, "py-2")}
      >
        {products.map((product) => (
          <option key={product.slug} value={product.slug} className="px-2 py-1.5">
            {product.name}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-small text-ink-muted">
        Hold Ctrl (Windows) or Cmd (Mac) to select more than one.
      </p>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((product) => (
            <button
              key={product.slug}
              type="button"
              onClick={() => remove(product.slug)}
              className="flex items-center gap-1.5 rounded-westora border border-accent px-3 py-1 text-small text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {product.name}
              <span aria-hidden="true">×</span>
              <span className="sr-only">Remove {product.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
