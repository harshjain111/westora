"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useProducts } from "@/lib/context/ProductsContext";
import { inputClassName } from "@/components/form/inputStyles";

const STATUSES = ["new", "contacted", "quoted", "sampled", "won", "lost"];

export function LeadsFilters() {
  const { products } = useProducts();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // any filter change resets pagination
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <input
        placeholder="Search name, company, email"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") updateParam("q", search);
        }}
        onBlur={() => updateParam("q", search)}
        className={inputClassName}
      />

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(event) => updateParam("status", event.target.value)}
        className={inputClassName}
      >
        <option value="">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("country") ?? ""}
        onChange={(event) => updateParam("country", event.target.value)}
        className={inputClassName}
      >
        <option value="">All countries</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="United States">United States</option>
        <option value="other">Other</option>
      </select>

      <select
        defaultValue={searchParams.get("product") ?? ""}
        onChange={(event) => updateParam("product", event.target.value)}
        className={inputClassName}
      >
        <option value="">All products</option>
        {products.map((product) => (
          <option key={product.slug} value={product.slug}>
            {product.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        aria-label="From date"
        defaultValue={searchParams.get("from") ?? ""}
        onChange={(event) => updateParam("from", event.target.value)}
        className={inputClassName}
      />
    </div>
  );
}
