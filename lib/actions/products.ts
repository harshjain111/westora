"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { productSchema, type ProductFormValues } from "@/lib/schemas/product";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

function revalidateProducts() {
  revalidateTag("products");
  revalidatePath("/");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin/products");
}

function toRow(values: ProductFormValues) {
  return {
    slug: values.slug,
    name: values.name,
    category: values.category,
    origin: values.origin,
    origin_district: values.originDistrict || null,
    botanical: values.botanical || "",
    has_gi: values.hasGI,
    gi_number: values.giNumber || null,
    hero_line: values.heroLine,
    description: values.description,
    specs: values.specs,
    forms: values.forms,
    packaging: values.packaging,
    provenance: values.provenance,
    images: values.images,
    featured: values.featured,
    custom_fields: values.customFields,
  };
}

/**
 * Uses the signed-in admin's own session (not a service-role client) so
 * RLS (supabase/migrations/0008_products_rls.sql) is the actual gate — a
 * viewer-role session gets denied at the database layer even if it
 * somehow reaches this action.
 */
export async function createProduct(input: ProductFormValues): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  const values = parsed.data;
  const supabase = await createClient();

  const { data: maxRow } = await supabase
    .from("products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();
  const sortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("products").insert({ ...toRow(values), sort_order: sortOrder });

  if (error) {
    console.error("[products] create failed:", error.message);
    if (error.code === "23505") {
      return { success: false, error: "That slug is already in use — choose a different one." };
    }
    return { success: false, error: "Couldn't create the product. Please try again." };
  }

  revalidateProducts();
  return { success: true };
}

export async function updateProduct(
  originalSlug: string,
  input: ProductFormValues,
): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("products").update(toRow(values)).eq("slug", originalSlug);

  if (error) {
    console.error("[products] update failed:", error.message);
    if (error.code === "23505") {
      return { success: false, error: "That slug is already in use — choose a different one." };
    }
    return { success: false, error: "Couldn't save changes. Please try again." };
  }

  revalidateProducts();
  return { success: true };
}

export async function deleteProduct(slug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("slug", slug);

  if (error) {
    console.error("[products] delete failed:", error.message);
    return { success: false, error: "Couldn't delete the product. Please try again." };
  }

  revalidateProducts();
  return { success: true };
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

/**
 * Storage writes go through a service-role client rather than the admin's
 * own session — Supabase Storage uploads via the anon/authenticated key
 * need the bucket's RLS policies to match exactly, and a slipped policy
 * would silently break uploads for a page that otherwise looks fine.
 * The admin-only check below is what actually gates this, same intent as
 * the RLS policy in 0008_products_rls.sql, just enforced in code instead
 * of the database for this one path.
 */
export async function uploadProductImage(formData: FormData): Promise<UploadImageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in to upload images." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return { success: false, error: "Only admins can upload product images." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file received." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { success: false, error: "Use a JPEG, PNG, WebP or AVIF image." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "Keep images under 8MB." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { success: false, error: "Image storage isn't configured yet." };
  }
  const serviceClient = createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await serviceClient.storage
    .from("product-images")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[products] image upload failed:", uploadError.message);
    return { success: false, error: "Couldn't upload the image. Please try again." };
  }

  const { data } = serviceClient.storage.from("product-images").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
