import { cn } from "@/lib/utils/cn";

export interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, required, hint, className, children }: FieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      <div
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
      >
        {children}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-small text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-small font-medium text-ink">
          <span aria-hidden="true">—</span>
          {error}
        </p>
      )}
    </div>
  );
}
