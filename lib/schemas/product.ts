import { z } from "zod";

/**
 * Validates the admin product form — imported by both ProductForm (client)
 * and the Server Actions in lib/actions/products.ts. Client validation is
 * UX; server validation is the actual gate (CLAUDE.md §9).
 */
export const productSpecSchema = z.object({
  label: z.string().trim().min(1, "Enter a label."),
  value: z.string().trim().min(1, "Enter a value."),
  unverified: z.boolean().optional(),
});

export const productImageSchema = z.object({
  src: z.string().trim().min(1, "Missing image."),
  alt: z.string().trim().min(1, "Enter alt text describing the image."),
});

export const productCustomFieldSchema = z.object({
  label: z.string().trim().min(1, "Enter a field name."),
  value: z.string().trim().min(1, "Enter a value."),
});

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Enter a slug.")
    .max(80, "Keep the slug under 80 characters.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  name: z.string().trim().min(2, "Enter a product name.").max(120, "Keep the name under 120 characters."),
  category: z.enum(["spices", "chillies", "tea", "rice", "other"]),
  origin: z.string().trim().min(2, "Enter an origin state."),
  originDistrict: z.string().trim().max(120).optional().or(z.literal("")),
  botanical: z.string().trim().max(120).optional().or(z.literal("")),
  hasGI: z.boolean(),
  giNumber: z.string().trim().max(80).optional().or(z.literal("")),
  heroLine: z.string().trim().min(10, "Enter a one-line summary.").max(280, "Keep this under 280 characters."),
  description: z.string().trim().min(10, "Enter a description.").max(2000, "Keep this under 2000 characters."),
  specs: z.array(productSpecSchema).max(20),
  forms: z.array(z.string().trim().min(1)).max(20),
  packaging: z.array(z.string().trim().min(1)).max(20),
  provenance: z.array(z.string().trim().min(1)).max(10),
  images: z.array(productImageSchema).max(10),
  featured: z.boolean(),
  customFields: z.array(productCustomFieldSchema).max(20),
  hsnCode: z.string().trim().max(20).optional().or(z.literal("")),
  packingSizes: z.array(z.string().trim().min(1)).max(20),
});

export type ProductFormValues = z.infer<typeof productSchema>;
