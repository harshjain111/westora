"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { Resend } from "resend";
import { enquirySchema, type EnquiryFormValues } from "@/lib/schemas/enquiry";
import { normalizeToE164 } from "@/lib/utils/phone";
import { isRateLimited } from "@/lib/utils/rateLimit";
import { verifyTurnstile } from "@/lib/utils/turnstile";
import { NotificationEmail } from "@/emails/NotificationEmail";
import { AutoReplyEmail } from "@/emails/AutoReplyEmail";
import { getBySlug } from "@/data/products";

export interface SubmitEnquiryInput extends EnquiryFormValues {
  sourceSection: "modal" | "main_form" | "product_page";
  sourceProduct?: string;
  turnstileToken?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export type SubmitEnquiryResult =
  | { success: true; reference: string }
  | { success: false; error: string };

const GENERIC_ERROR =
  "Something went wrong sending your enquiry. Please try again in a moment.";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured (missing URL or service role key).");
  }
  // Service-role client, used ONLY here, server-side. It bypasses RLS by
  // design — the leads table has no anon/authenticated insert policy, so
  // this is the sole write path (CLAUDE.md §13).
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function submitEnquiry(input: SubmitEnquiryInput): Promise<SubmitEnquiryResult> {
  // 1. Validate — server validation is the actual gate, client validation
  // is UX only (CLAUDE.md §9).
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields and try again." };
  }
  const values = parsed.data;

  // 2. Honeypot — silently reject, no error surfaced (don't tip off bots).
  if (values.companyWebsite && values.companyWebsite.trim() !== "") {
    console.warn("[enquiry] honeypot triggered — rejecting silently");
    // Return a fake success so a bot's script doesn't learn anything.
    return { success: true, reference: "WG-0000-0000" };
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
    console.error("[enquiry] Supabase not configured:", error);
    return {
      success: false,
      error: "Our enquiry system isn't fully set up yet (missing Supabase credentials).",
    };
  }

  // 3. Turnstile — required in production; skippable in local dev only
  // when no secret key is configured, so the rest of the flow can still
  // be exercised without a live Cloudflare account. Never skippable when
  // NODE_ENV is production, regardless of configuration.
  const turnstileConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY);
  if (process.env.NODE_ENV === "production" || turnstileConfigured) {
    const humanVerified = await verifyTurnstile(input.turnstileToken ?? "", ip);
    if (!humanVerified) {
      return { success: false, error: "We couldn't verify you're human. Please try again." };
    }
  } else {
    console.warn("[enquiry] TURNSTILE_SECRET_KEY not set — skipping verification (dev only)");
  }

  // 4. Rate limit — 5 per IP per hour.
  const limited = await isRateLimited(supabase, ip);
  if (limited) {
    return {
      success: false,
      error: "You've reached the limit of enquiries for now. Please try again in an hour.",
    };
  }

  // 5/6. Insert — reference is generated inside Postgres by a trigger
  // (supabase/migrations/0003_reference_generator.sql), inside this same
  // insert statement, so it can't collide under concurrent submissions.
  const phoneE164 = normalizeToE164(values.phone, values.phoneDialCode);

  const { data: inserted, error: insertError } = await supabase
    .from("leads")
    .insert({
      full_name: values.fullName,
      company_name: values.companyName,
      email: values.email,
      phone: phoneE164,
      country: values.country,
      products: values.products,
      volume: values.volume || null,
      destination_port: values.destinationPort || null,
      message: values.message || null,
      source_section: input.sourceSection,
      source_product: input.sourceProduct ?? null,
      consent_given: values.consent,
      utm_source: input.utmSource ?? null,
      utm_medium: input.utmMedium ?? null,
      utm_campaign: input.utmCampaign ?? null,
      reference: "", // trigger fills this in
    })
    .select("reference")
    .single();

  if (insertError || !inserted) {
    console.error("[enquiry] insert failed:", insertError?.message);
    return { success: false, error: GENERIC_ERROR };
  }

  const reference = inserted.reference as string;

  // 7. Emails — best-effort. A delivery failure here shouldn't undo the
  // successful insert or block the buyer's success state; log and move on.
  await sendEnquiryEmails({ ...values, reference, sourceSection: input.sourceSection, sourceProduct: input.sourceProduct });

  return { success: true, reference };
}

async function sendEnquiryEmails(params: {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  volume?: string;
  destinationPort?: string;
  message?: string;
  reference: string;
  sourceSection: string;
  sourceProduct?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL_TO;
  const from = process.env.NOTIFICATION_EMAIL_FROM;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  if (!apiKey || !to || !from) {
    console.warn("[enquiry] Resend not fully configured — skipping email send");
    return;
  }

  const resend = new Resend(apiKey);
  const productNames = params.products.map((slug) => getBySlug(slug)?.name ?? slug);

  try {
    await resend.emails.send({
      from,
      to,
      subject: `New enquiry — ${productNames.join(", ")} — ${params.companyName} (${params.country})`,
      react: NotificationEmail({
        reference: params.reference,
        fullName: params.fullName,
        companyName: params.companyName,
        email: params.email,
        phone: params.phone,
        country: params.country,
        products: productNames,
        volume: params.volume,
        destinationPort: params.destinationPort,
        message: params.message,
        sourceSection: params.sourceSection,
        sourceProduct: params.sourceProduct,
        adminUrl: `${siteUrl}/admin/leads`,
      }),
    });
  } catch (error) {
    console.error("[enquiry] internal notification email failed:", error);
  }

  try {
    await resend.emails.send({
      from,
      to: params.email,
      subject: `Enquiry received — ${params.reference}`,
      react: AutoReplyEmail({ fullName: params.fullName, reference: params.reference }),
    });
  } catch (error) {
    console.error("[enquiry] auto-reply email failed:", error);
  }
}
