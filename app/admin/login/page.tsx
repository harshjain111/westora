import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <Container className="max-w-[420px]">
        <Logo className="text-ink" />
        <Heading level={1} className="mt-8">
          Admin sign in
        </Heading>
        <p className="mt-2 text-body text-ink-muted">Lead management for Westora Global.</p>

        <div className="mt-8">
          <LoginForm next={next} configReason={params.reason} />
        </div>
      </Container>
    </div>
  );
}
