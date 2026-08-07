import { z } from "zod";

/**
 * Single source of truth for enquiry validation — imported by both
 * EnquiryForm (client, react-hook-form) and the Server Action
 * (lib/actions/enquiry.ts). Client validation is UX; server validation is
 * the actual gate (CLAUDE.md §9).
 *
 * Email accepts every domain, including free webmail — many legitimate
 * small importers use Gmail, and rejecting them would cost real leads
 * (PRD FR-12.2).
 *
 * `products` is validated as non-empty slugs here, not a strict enum —
 * the slug list now lives in Supabase (data/products.ts) and can change
 * without a redeploy, so this schema (loaded into the client bundle)
 * can't hard-code it. The Server Action cross-checks each slug against
 * the live product list before insert.
 */
export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Full name must be 80 characters or fewer."),
  companyName: z
    .string()
    .trim()
    .min(2, "Enter your company name.")
    .max(120, "Company name must be 120 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address."),
  phoneDialCode: z.string().trim().min(1, "Select a dial code."),
  phone: z
    .string()
    .trim()
    .min(4, "Enter a phone or WhatsApp number.")
    .max(20, "Enter a valid phone number.")
    .regex(/^[0-9+()\-\s]+$/, "Use digits only, with an optional + and spaces."),
  country: z.string().trim().min(1, "Select a country."),
  products: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one product you're interested in."),
  volume: z.string().trim().max(80, "Keep this under 80 characters.").optional().or(z.literal("")),
  destinationPort: z
    .string()
    .trim()
    .max(80, "Keep this under 80 characters.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Keep this under 2000 characters.")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    message: "You must agree before we can respond to your enquiry.",
  }),
  // Honeypot: real visitors never fill this in (it's visually hidden).
  // Not surfaced as a field error — checked directly in the Server Action.
  companyWebsite: z.string().optional(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
