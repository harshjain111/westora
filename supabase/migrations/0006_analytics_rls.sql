-- Westora Global — RLS for the analytics tables (same model as leads,
-- CLAUDE.md §13: no public SELECT, ever). Writes happen only through the
-- service-role client in app/api/analytics/route.ts, which bypasses RLS
-- entirely, so none of these tables gets an insert policy for anon or
-- authenticated roles — if no policy exists, Postgres denies by default
-- once RLS is enabled.

alter table analytics_sessions            enable row level security;
alter table analytics_page_views          enable row level security;
alter table analytics_section_engagement  enable row level security;
alter table analytics_clicks              enable row level security;

create policy "analytics_sessions_select_admin_or_viewer"
  on analytics_sessions for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );

create policy "analytics_page_views_select_admin_or_viewer"
  on analytics_page_views for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );

create policy "analytics_section_engagement_select_admin_or_viewer"
  on analytics_section_engagement for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );

create policy "analytics_clicks_select_admin_or_viewer"
  on analytics_clicks for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'viewer')
    )
  );
