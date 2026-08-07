import Link from "next/link";
import { notFound } from "next/navigation";
import { Heading } from "@/components/ui/Heading";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { AssignmentSelect } from "@/components/admin/AssignmentSelect";
import { NotesEditor } from "@/components/admin/NotesEditor";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { getBySlug } from "@/data/products";
import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadActivity, Profile, ProfileRole } from "@/types";

export const dynamic = "force-dynamic";

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

function mailtoLink(lead: Lead) {
  const subject = encodeURIComponent(`Re: your enquiry ${lead.reference}`);
  const body = encodeURIComponent(`Hello ${lead.full_name},\n\n`);
  return `mailto:${lead.email}?subject=${subject}&body=${body}`;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: viewerProfile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const role: ProfileRole = (viewerProfile?.role as ProfileRole) ?? "viewer";

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single<Lead>();

  if (error || !lead) {
    notFound();
  }

  const { data: activity } = await supabase
    .from("lead_activity")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .returns<LeadActivity[]>();

  const { data: admins } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "admin")
    .returns<Profile[]>();

  const productNames = await Promise.all(
    lead.products.map(async (slug) => (await getBySlug(slug))?.name ?? slug),
  );

  return (
    <div>
      <Link href="/admin/leads" className="font-mono text-small text-ink-muted hover:text-ink">
        ← Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Heading level={1}>{lead.company_name}</Heading>
          <p className="mt-1 font-mono text-small text-ink-muted">{lead.reference}</p>
        </div>
        <StatusSelect leadId={lead.id} status={lead.status} disabled={role === "viewer"} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["Full name", lead.full_name],
              ["Email", lead.email],
              ["Phone", lead.phone],
              ["Country", lead.country],
              ["Products", productNames.join(", ")],
              ["Estimated volume", lead.volume ?? "—"],
              ["Destination port", lead.destination_port ?? "—"],
              ["Source", lead.source_section],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                  {label}
                </dt>
                <dd className="mt-1 text-body text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          {lead.message && (
            <div className="mt-6">
              <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
                Message
              </p>
              <p className="mt-1 text-body text-ink">{lead.message}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mailtoLink(lead)}
              className="border border-ink px-4 py-2 text-small text-ink hover:border-accent hover:text-accent"
            >
              Reply by email
            </a>
            <a
              href={waLink(lead.phone)}
              className="border border-ink px-4 py-2 text-small text-ink hover:border-accent hover:text-accent"
            >
              Message on WhatsApp
            </a>
          </div>

          <div className="mt-10">
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Assigned to
            </p>
            <div className="mt-2">
              <AssignmentSelect
                leadId={lead.id}
                currentAssigneeId={lead.assigned_to}
                admins={admins ?? []}
                disabled={role === "viewer"}
              />
            </div>
          </div>

          <div className="mt-10">
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              Internal notes
            </p>
            <div className="mt-2">
              <NotesEditor
                leadId={lead.id}
                initialNotes={lead.internal_notes ?? ""}
                disabled={role === "viewer"}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
            Activity
          </p>
          <div className="mt-4">
            <ActivityTimeline activity={activity ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
