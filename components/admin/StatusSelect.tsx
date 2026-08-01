"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions/leads";
import type { LeadStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "sampled", "won", "lost"];

export interface StatusSelectProps {
  leadId: string;
  status: LeadStatus;
  disabled?: boolean;
}

export function StatusSelect({ leadId, status, disabled }: StatusSelectProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<LeadStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onChange = (next: LeadStatus) => {
    const previous = optimisticStatus;
    setOptimisticStatus(next);
    setError(null);

    startTransition(async () => {
      const result = await updateLeadStatus(leadId, next);
      if (!result.success) {
        setOptimisticStatus(previous); // rollback
        setError(result.error ?? "Update failed.");
      }
    });
  };

  return (
    <div>
      <select
        value={optimisticStatus}
        disabled={disabled || isPending}
        onChange={(event) => onChange(event.target.value as LeadStatus)}
        className={cn(
          "border border-rule bg-surface-raised px-2 py-1 font-mono text-small uppercase tracking-mono-label text-ink",
          isPending && "opacity-60",
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[11px] text-ink">{error}</p>}
    </div>
  );
}
