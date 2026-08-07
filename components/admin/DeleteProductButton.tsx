"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!window.confirm(`Delete "${name}"? This removes it from the site immediately.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProduct(slug);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? "Couldn't delete the product.");
      }
    });
  };

  return (
    <div>
      <Button type="button" variant="secondary" onClick={onDelete} loading={isPending} loadingLabel="Deleting…">
        Delete
      </Button>
      {error && <p className="mt-1 text-small text-ink">{error}</p>}
    </div>
  );
}
