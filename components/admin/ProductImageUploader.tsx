"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadProductImage } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { inputClassName } from "@/components/form/inputStyles";

export interface ProductImageUploaderProps {
  src: string;
  alt: string;
  onChangeSrc: (src: string) => void;
  onChangeAlt: (alt: string) => void;
  onRemove: () => void;
}

/**
 * One row = one image. "Upload" sends the file straight to Supabase
 * Storage (lib/actions/products.ts) and fills src with the resulting
 * public URL — src stays a plain text field too, so existing products
 * keep pointing at their on-disk /images/products/*.jpg paths without
 * anyone needing to re-upload them.
 */
export function ProductImageUploader({
  src,
  alt,
  onChangeSrc,
  onChangeAlt,
  onRemove,
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProductImage(formData);

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (result.success && result.url) {
      onChangeSrc(result.url);
    } else {
      setError(result.error ?? "Upload failed.");
    }
  };

  return (
    <div className="flex flex-col gap-3 border border-rule bg-surface p-4 sm:flex-row">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-rule bg-surface-raised">
        {src && (
          <Image src={src} alt="" fill sizes="96px" className="object-cover" unoptimized={src.startsWith("http")} />
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="text-small text-ink-muted"
          />
          {isUploading && <span className="text-small text-ink-muted">Uploading…</span>}
        </div>
        {error && <p className="mt-1 text-small text-ink">{error}</p>}

        <input
          value={src}
          onChange={(event) => onChangeSrc(event.target.value)}
          placeholder="Image path or URL"
          className={`${inputClassName} mt-2`}
        />
        <input
          value={alt}
          onChange={(event) => onChangeAlt(event.target.value)}
          placeholder="Alt text (describe the image, e.g. 'Dried Lakadong turmeric fingers')"
          className={`${inputClassName} mt-2`}
        />
      </div>

      <Button type="button" variant="secondary" size="md" onClick={onRemove} className="self-start">
        Remove
      </Button>
    </div>
  );
}
