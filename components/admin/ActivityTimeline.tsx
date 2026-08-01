import type { LeadActivity } from "@/types";

export interface ActivityTimelineProps {
  activity: LeadActivity[];
}

const ACTION_LABELS: Record<LeadActivity["action"], string> = {
  status_change: "Status changed to",
  note: "Note",
  assigned: "Assigned to",
};

export function ActivityTimeline({ activity }: ActivityTimelineProps) {
  if (activity.length === 0) {
    return <p className="text-small text-ink-muted">No activity yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {activity.map((entry) => (
        <li key={entry.id} className="border-l-2 border-rule pl-4">
          <p className="text-small text-ink">
            {ACTION_LABELS[entry.action]} {entry.detail}
          </p>
          <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
            {new Date(entry.created_at).toLocaleString("en-GB")}
          </p>
        </li>
      ))}
    </ul>
  );
}
