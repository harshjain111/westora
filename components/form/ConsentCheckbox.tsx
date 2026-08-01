import { forwardRef } from "react";

export type ConsentCheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(
  function ConsentCheckbox({ id = "consent", ...props }, ref) {
    return (
      <label htmlFor={id} className="flex items-start gap-3 text-small text-ink">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 accent-accent"
          {...props}
        />
        <span>
          I agree to Westora Global processing my details to respond to this enquiry, in line with
          the{" "}
          <a href="/privacy" className="text-accent underline underline-offset-2">
            privacy policy
          </a>
          .
        </span>
      </label>
    );
  },
);
