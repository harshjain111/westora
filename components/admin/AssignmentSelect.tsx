"use client";

import { useState, useTransition } from "react";
import { assignLead } from "@/lib/actions/leads";
import type { Profile } from "@/types";

export interface AssignmentSelectProps {
  leadId: string;
  currentAssigneeId: string | null;
  admins: Profile[];
  disabled?: boolean;
}

export function AssignmentSelect({ leadId, currentAssigneeId, admins, disabled }: AssignmentSelectProps) {
  const [value, setValue] = useState(currentAssigneeId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string) => {
    const previous = value;
    setValue(next);
    setError(null);

    startTransition(async () => {
      const result = await assignLead(leadId, next || null);
      if (!result.success) {
        setValue(previous);
        setError(result.error ?? "Couldn't update assignment.");
      }
    });
  };

  return (
    <div>
      <select
        value={value}
        disabled={disabled || isPending}
        onChange={(event) => onChange(event.target.value)}
        className="border border-rule bg-surface-raised px-3 py-2 text-small text-ink"
      >
        <option value="">Unassigned</option>
        {admins.map((admin) => (
          <option key={admin.id} value={admin.id}>
            {admin.email}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[11px] text-ink">{error}</p>}
    </div>
  );
}
