-- Westora Global — catalogue PDF download gate.
--
-- Deliberately its own table, not a `leads` row: this capture has no
-- company name, country or product selection, and `leads` requires all
-- three. Same no-public-SELECT posture as leads (CLAUDE.md §13) — writes
-- go through the service-role Server Action only.

create table catalogue_download_requests (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null,
  email       text,
  created_at  timestamptz not null default now()
);

create index catalogue_download_requests_created_at_idx
  on catalogue_download_requests (created_at desc);

alter table catalogue_download_requests enable row level security;

create policy "catalogue_download_requests_select_admin_or_viewer"
  on catalogue_download_requests for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );

-- No insert policy for anon/authenticated — the Server Action's
-- service-role client bypasses RLS, same as leads.
