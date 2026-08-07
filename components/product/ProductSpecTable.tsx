import { cn } from "@/lib/utils/cn";
import type { ProductSpec } from "@/data/products";

export interface ProductSpecTableProps {
  specs: ProductSpec[];
  className?: string;
}

export function ProductSpecTable({ specs, className }: ProductSpecTableProps) {
  const isDev = process.env.NODE_ENV === "development";
  const visible = specs.filter((spec) => !spec.unverified || isDev);

  if (visible.length === 0) return null;

  return (
    <table className={cn("w-full border-collapse font-mono text-small", className)}>
      <tbody>
        {visible.map((spec) => (
          <tr key={spec.label} className="border-t border-rule first:border-t-0">
            <td className="py-2 pr-4 align-top text-ink-muted">{spec.label}</td>
            <td className="py-2 align-top text-ink">
              {spec.value}
              {spec.unverified && (
                <span className="ml-2 border border-dev-warning px-1 py-0.5 text-[10px] uppercase tracking-mono-label text-dev-warning">
                  Unverified — dev only
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
