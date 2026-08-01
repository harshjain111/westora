export type LeadStatus = "new" | "contacted" | "quoted" | "sampled" | "won" | "lost";

export interface Lead {
  id: string;
  reference: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  volume: string | null;
  destination_port: string | null;
  message: string | null;
  source_section: string;
  source_product: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  consent_given: boolean;
  ip_country: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  actor: string | null;
  action: "status_change" | "note" | "assigned";
  detail: string | null;
  created_at: string;
}

export type ProfileRole = "admin" | "viewer";

export interface Profile {
  id: string;
  email: string;
  role: ProfileRole;
}
