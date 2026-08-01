-- Westora Global — Row Level Security
--
-- Hard rule (CLAUDE.md §13 / PRD §6): no public SELECT on `leads` under any
-- circumstance. Inserts happen only through the Server Action's service-role
-- path, which bypasses RLS entirely — so `leads` and `lead_activity` get NO
-- insert policy for the anon/authenticated roles at all. If a policy for
-- those roles doesn't exist, PostgreSQL denies by default once RLS is
-- enabled; there is no accidental public write or read path.

alter table leads enable row level security;
alter table lead_activity enable row level security;
alter table profiles enable row level security;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------

-- A signed-in user may read their own profile row (needed to resolve
-- their own role client-side after login).
create policy "profiles_select_own"
  on profiles for select
  to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------

create policy "leads_select_admin_or_viewer"
  on leads for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );

create policy "leads_update_admin_only"
  on leads for update
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

-- No insert/delete policy for anon or authenticated: writes go through the
-- Server Action using SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. Public
-- clients cannot insert leads directly, and nobody can delete them via the
-- API surface.

-- ---------------------------------------------------------------------
-- lead_activity
-- ---------------------------------------------------------------------

create policy "lead_activity_select_admin_or_viewer"
  on lead_activity for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );

create policy "lead_activity_insert_admin_only"
  on lead_activity for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
