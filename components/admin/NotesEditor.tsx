"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateLeadNotes } from "@/lib/actions/leads";

export interface NotesEditorProps {
  leadId: string;
  initialNotes: string;
  disabled?: boolean;
}

export function NotesEditor({ leadId, initialNotes, disabled }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateLeadNotes(leadId, notes);
      if (result.success) {
        setSavedNotes(notes);
      } else {
        setError(result.error ?? "Couldn't save notes.");
      }
    });
  };

  return (
    <div>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        disabled={disabled}
        rows={5}
        className="w-full border border-rule bg-surface-raised px-4 py-3 text-body text-ink focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
      />
      <div className="mt-2 flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onSave}
          loading={isPending}
          disabled={disabled || notes === savedNotes}
        >
          Save notes
        </Button>
        {error && <p className="text-small text-ink">{error}</p>}
      </div>
    </div>
  );
}
