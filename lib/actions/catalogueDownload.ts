"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { catalogueDownloadSchema, type CatalogueDownloadValues } from "@/lib/schemas/catalogueDownload";
import { isRateLimited } from "@/lib/utils/rateLimit";

export type RequestCatalogueDownloadResult =
  | { success: true }
  | { success: false; error: string };

const GENERIC_ERROR = "Something went wrong. Please try again in a moment.";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured (missing URL or service role key).");
  }
  // Service-role client, used ONLY here, server-side — this table has no
  // anon/authenticated insert policy (0011_catalogue_downloads.sql).
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function requestCatalogueDownload(
  input: CatalogueDownloadValues,
): Promise<RequestCatalogueDownloadResult> {
  const parsed = catalogueDownloadSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  const values = parsed.data;

  // Honeypot — silently pretend success, don't tip off bots.
  if (values.companyWebsite && values.companyWebsite.trim() !== "") {
    console.warn("[catalogueDownload] honeypot triggered — rejecting silently");
    return { success: true };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";

  let supabase;
  try {
    supabase = getServiceClient();
  } catch (error) {
    console.error("[catalogueDownload] Supabase not configured:", error);
    return { success: false, error: GENERIC_ERROR };
  }

  const limited = await isRateLimited(supabase, ip);
  if (limited) {
    return {
      success: false,
      error: "You've reached the limit of requests for now. Please try again in an hour.",
    };
  }

  const { error: insertError } = await supabase.from("catalogue_download_requests").insert({
    full_name: values.fullName,
    phone: values.phone,
    email: values.email || null,
  });

  if (insertError) {
    console.error("[catalogueDownload] insert failed:", insertError.message);
    return { success: false, error: GENERIC_ERROR };
  }

  return { success: true };
}
