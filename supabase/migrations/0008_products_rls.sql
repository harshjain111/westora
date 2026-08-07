-- Westora Global — RLS for products.
--
-- Unlike leads, product data is public marketing content: every visitor
-- (anon) must be able to read it, so this table gets a public select
-- policy. Writes are restricted to signed-in admins, mirroring
-- leads_update_admin_only in 0002_rls.sql.

alter table products enable row level security;

create policy "products_select_public"
  on products for select
  to anon, authenticated
  using (true);

create policy "products_insert_admin_only"
  on products for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "products_update_admin_only"
  on products for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "products_delete_admin_only"
  on products for delete
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------
-- storage.objects — product-images bucket
-- ---------------------------------------------------------------------

create policy "product_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_insert_admin_only"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "product_images_update_admin_only"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

create policy "product_images_delete_admin_only"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
