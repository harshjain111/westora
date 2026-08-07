import { redirect } from "next/navigation";
import { Heading } from "@/components/ui/Heading";
import { ProductForm } from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Add product" };

export default async function AdminNewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  // Belt and braces — RLS is the real gate (0008_products_rls.sql), but a
  // viewer shouldn't land on a write-only form that can only ever fail.
  if (profile?.role !== "admin") {
    redirect("/admin/products");
  }

  return (
    <div>
      <Heading level={1}>Add product</Heading>
      <div className="mt-8 max-w-[820px]">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
