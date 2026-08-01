import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { Logo } from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt and braces — middleware already gates every /admin route, but a
  // Server Component render with no session should never happen either.
  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col justify-between border-b border-rule bg-surface-raised p-6 md:w-64 md:border-b-0 md:border-r">
        <div>
          <Logo className="text-ink" />
          <div className="mt-8">
            <AdminNav />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-4">
          <div>
            <p className="text-small text-ink">{profile?.email ?? user.email}</p>
            <p className="font-mono text-eyebrow uppercase tracking-mono-label text-ink-muted">
              {profile?.role ?? "unknown role"}
            </p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 bg-surface p-6 md:p-10">{children}</main>
    </div>
  );
}
