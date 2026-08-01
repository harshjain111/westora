"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/form/Field";
import { inputClassName } from "@/components/form/inputStyles";
import { createClient } from "@/lib/supabase/client";

export interface LoginFormProps {
  next: string;
  configReason?: string;
}

export function LoginForm({ next, configReason }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    configReason === "not-configured"
      ? "Admin sign-in isn't configured yet (missing Supabase credentials)."
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(
          signInError.message.includes("Invalid login credentials")
            ? "Incorrect email or password."
            : signInError.message,
        );
        setIsSubmitting(false);
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Couldn't reach the sign-in service. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Field label="Email" htmlFor="admin-email" required>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
      </Field>

      <Field label="Password" htmlFor="admin-password" required>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
        />
      </Field>

      {error && (
        <p role="alert" className="border border-ink px-4 py-3 text-small text-ink">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} loadingLabel="Signing in…">
        Sign in
      </Button>
    </form>
  );
}
