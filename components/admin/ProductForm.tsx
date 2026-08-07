"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/form/Field";
import { inputClassName } from "@/components/form/inputStyles";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";
import { productSchema, type ProductFormValues } from "@/lib/schemas/product";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { Product } from "@/data/products";

const CATEGORY_OPTIONS = [
  { value: "spices", label: "Spices" },
  { value: "chillies", label: "Chillies" },
  { value: "tea", label: "Tea" },
  { value: "rice", label: "Rice" },
  { value: "other", label: "Other" },
] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

const EMPTY_VALUES: ProductFormValues = {
  slug: "",
  name: "",
  category: "spices",
  origin: "",
  originDistrict: "",
  botanical: "",
  hasGI: false,
  giNumber: "",
  heroLine: "",
  description: "",
  specs: [],
  forms: [],
  packaging: [],
  provenance: [],
  images: [],
  featured: false,
  customFields: [],
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          slug: product.slug,
          name: product.name,
          category: product.category,
          origin: product.origin,
          originDistrict: product.originDistrict ?? "",
          botanical: product.botanical,
          hasGI: product.hasGI,
          giNumber: product.giNumber ?? "",
          heroLine: product.heroLine,
          description: product.description,
          specs: product.specs,
          forms: product.forms,
          packaging: product.packaging,
          provenance: product.provenance,
          images: product.images,
          featured: product.featured ?? false,
          customFields: product.customFields,
        }
      : EMPTY_VALUES,
  });

  const specsArray = useFieldArray({ control, name: "specs" });
  const imagesArray = useFieldArray({ control, name: "images" });
  const customFieldsArray = useFieldArray({ control, name: "customFields" });

  const hasGI = watch("hasGI");

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    register("name").onChange(event);
    if (!slugTouched) {
      setValue("slug", slugify(event.target.value), { shouldValidate: true });
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    const result =
      mode === "create" || !product
        ? await createProduct(values)
        : await updateProduct(product.slug, values);

    if (result.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setServerError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Product name" htmlFor="name" required error={errors.name?.message}>
          <input id="name" className={inputClassName} {...register("name")} onChange={onNameChange} />
        </Field>

        <Field
          label="Slug"
          htmlFor="slug"
          required
          error={errors.slug?.message}
          hint="Used in the product page URL. Lowercase letters, numbers and hyphens only."
        >
          <input
            id="slug"
            className={inputClassName}
            {...register("slug")}
            onChange={(event) => {
              setSlugTouched(true);
              register("slug").onChange(event);
            }}
          />
        </Field>

        <Field label="Category" htmlFor="category" required error={errors.category?.message}>
          <select id="category" className={inputClassName} {...register("category")}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Origin state" htmlFor="origin" required error={errors.origin?.message}>
          <input id="origin" className={inputClassName} {...register("origin")} />
        </Field>

        <Field
          label="Origin district"
          htmlFor="originDistrict"
          error={errors.originDistrict?.message}
          hint="Optional — only if more specific than the state."
        >
          <input id="originDistrict" className={inputClassName} {...register("originDistrict")} />
        </Field>

        <Field
          label="Botanical name"
          htmlFor="botanical"
          error={errors.botanical?.message}
          hint="Leave blank rather than guess — unconfirmed names don't ship (CLAUDE.md §11)."
        >
          <input id="botanical" className={inputClassName} {...register("botanical")} />
        </Field>
      </div>

      <div className="border border-rule bg-surface-raised p-4">
        <label className="flex min-h-11 items-center gap-2 text-body text-ink">
          <input type="checkbox" className="h-5 w-5" {...register("hasGI")} />
          Carries a GI (Geographical Indication) tag
        </label>
        {hasGI && (
          <div className="mt-3 max-w-sm">
            <Field label="GI number" htmlFor="giNumber" error={errors.giNumber?.message}>
              <input id="giNumber" className={inputClassName} {...register("giNumber")} />
            </Field>
          </div>
        )}
      </div>

      <Field
        label="One-line summary"
        htmlFor="heroLine"
        required
        error={errors.heroLine?.message}
        hint="Shown at the top of the product page and modal."
      >
        <textarea id="heroLine" rows={2} className={inputClassName} {...register("heroLine")} />
      </Field>

      <Field label="Description" htmlFor="description" required error={errors.description?.message}>
        <textarea id="description" rows={4} className={inputClassName} {...register("description")} />
      </Field>

      <div>
        <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
          Specifications
        </p>
        <p className="mt-1 text-small text-ink-muted">
          Curcumin %, SHU, moisture limits — verifiable numbers only (CLAUDE.md §11.3).
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {specsArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 border border-rule bg-surface-raised p-4 sm:flex-row sm:items-start">
              <input
                placeholder="Label — e.g. Curcumin content"
                className={inputClassName}
                {...register(`specs.${index}.label` as const)}
              />
              <input
                placeholder="Value — e.g. 7–12%"
                className={inputClassName}
                {...register(`specs.${index}.value` as const)}
              />
              <label className="flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap text-small text-ink-muted">
                <input type="checkbox" className="h-4 w-4" {...register(`specs.${index}.unverified` as const)} />
                Unverified
              </label>
              <Button type="button" variant="secondary" onClick={() => specsArray.remove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => specsArray.append({ label: "", value: "", unverified: false })}
          >
            Add specification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Controller
          control={control}
          name="forms"
          render={({ field }) => (
            <Field label="Forms available" htmlFor="forms" hint="One per line — e.g. Fresh, Dry, Whole.">
              <textarea
                id="forms"
                rows={4}
                className={inputClassName}
                value={field.value.join("\n")}
                onChange={(event) => field.onChange(linesToArray(event.target.value))}
              />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="packaging"
          render={({ field }) => (
            <Field label="Packaging" htmlFor="packaging" hint="One per line.">
              <textarea
                id="packaging"
                rows={4}
                className={inputClassName}
                value={field.value.join("\n")}
                onChange={(event) => field.onChange(linesToArray(event.target.value))}
              />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="provenance"
          render={({ field }) => (
            <Field
              label="Provenance route"
              htmlFor="provenance"
              hint="One stop per line, in order — e.g. Jaintia Hills / Guwahati / Kolkata (INCCU) / Felixstowe / New York."
            >
              <textarea
                id="provenance"
                rows={4}
                className={inputClassName}
                value={field.value.join("\n")}
                onChange={(event) => field.onChange(linesToArray(event.target.value))}
              />
            </Field>
          )}
        />
      </div>

      <div>
        <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">Images</p>
        <div className="mt-3 flex flex-col gap-3">
          {imagesArray.fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`images.${index}`}
              render={({ field: imageField }) => (
                <ProductImageUploader
                  src={imageField.value.src}
                  alt={imageField.value.alt}
                  onChangeSrc={(src) => imageField.onChange({ ...imageField.value, src })}
                  onChangeAlt={(alt) => imageField.onChange({ ...imageField.value, alt })}
                  onRemove={() => imagesArray.remove(index)}
                />
              )}
            />
          ))}
        </div>
        {errors.images?.message && <p className="mt-2 text-small text-ink">{errors.images.message}</p>}
        <div className="mt-3">
          <Button type="button" variant="secondary" onClick={() => imagesArray.append({ src: "", alt: "" })}>
            Add image
          </Button>
        </div>
      </div>

      <div className="border border-rule bg-surface-raised p-4">
        <label className="flex min-h-11 items-center gap-2 text-body text-ink">
          <input type="checkbox" className="h-5 w-5" {...register("featured")} />
          Feature this product (badge shown on the catalogue card)
        </label>
      </div>

      <div>
        <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
          Additional fields
        </p>
        <p className="mt-1 text-small text-ink-muted">
          Anything not covered above — appears on the product page exactly as entered.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {customFieldsArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 border border-rule bg-surface-raised p-4 sm:flex-row">
              <input
                placeholder="Field name — e.g. MOQ"
                className={inputClassName}
                {...register(`customFields.${index}.label` as const)}
              />
              <input
                placeholder="Value — e.g. 500kg"
                className={inputClassName}
                {...register(`customFields.${index}.value` as const)}
              />
              <Button type="button" variant="secondary" onClick={() => customFieldsArray.remove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => customFieldsArray.append({ label: "", value: "" })}
          >
            Add field
          </Button>
        </div>
      </div>

      {serverError && (
        <p role="alert" className="border border-ink px-4 py-3 text-small text-ink">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary" loading={isSubmitting} loadingLabel="Saving…">
          {mode === "create" ? "Create product" : "Save changes"}
        </Button>
        <Button as="a" href="/admin/products" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
