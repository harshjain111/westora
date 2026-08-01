"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types";

export interface ActionResult {
  success: boolean;
  error?: string;
}

async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  leadId: string,
  action: "status_change" | "note" | "assigned",
  detail: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("lead_activity").insert({
    lead_id: leadId,
    actor: user?.id ?? null,
    action,
    detail,
  });
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<ActionResult> {
  const supabase = await createClient();

  // RLS enforces admin-only writes (supabase/migrations/0002_rls.sql) —
  // this update is denied at the database layer for a viewer-role
  // session even though the UI never offers it one.
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);

  if (error) {
    console.error("[leads] status update failed:", error.message);
    return { success: false, error: "Couldn't update status. Please try again." };
  }

  await logActivity(supabase, leadId, "status_change", status);
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

export async function updateLeadNotes(leadId: string, notes: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("leads").update({ internal_notes: notes }).eq("id", leadId);

  if (error) {
    console.error("[leads] notes update failed:", error.message);
    return { success: false, error: "Couldn't save notes. Please try again." };
  }

  await logActivity(supabase, leadId, "note", "Internal notes updated");
  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}

export async function assignLead(leadId: string, assigneeId: string | null): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("leads").update({ assigned_to: assigneeId }).eq("id", leadId);

  if (error) {
    console.error("[leads] assignment update failed:", error.message);
    return { success: false, error: "Couldn't update assignment. Please try again." };
  }

  await logActivity(supabase, leadId, "assigned", assigneeId ?? "Unassigned");
  revalidatePath(`/admin/leads/${leadId}`);
  return { success: true };
}
