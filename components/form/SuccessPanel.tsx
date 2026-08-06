export interface SuccessPanelProps {
  reference: string;
}

// Copy verbatim per build playbook Prompt 36 / PRD FR-12.6.
export function SuccessPanel({ reference }: SuccessPanelProps) {
  return (
    <div role="status" className="rounded-input border border-rule bg-surface-raised p-8">
      <p className="font-display text-h3 text-ink">Enquiry received.</p>
      <p className="mt-4 text-body text-ink-muted">
        We&apos;ve sent a copy to your email. Someone from our team will reply within one working
        day — usually sooner.
      </p>
      <p className="mt-4 font-mono text-small tracking-mono-label text-ink">
        Reference: {reference}
      </p>
    </div>
  );
}
