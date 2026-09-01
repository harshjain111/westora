import { z } from "zod";

/**
 * Validates the catalogue-download gate — imported by both the modal
 * form (client) and the Server Action. Client validation is UX; server
 * validation is the actual gate (CLAUDE.md §9).
 */
export const catalogueDownloadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Full name must be 80 characters or fewer."),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a phone or WhatsApp number.")
    .max(20, "Enter a valid phone number.")
    .regex(/^[0-9+()\-\s]+$/, "Use digits only, with an optional + and spaces."),
  email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
  // Honeypot — real visitors never fill this in.
  companyWebsite: z.string().optional(),
});

export type CatalogueDownloadValues = z.infer<typeof catalogueDownloadSchema>;
