-- Westora Global — first-party web analytics (PRD §12 follow-up).
--
-- Self-hosted, cookieless-by-default, consent-gated (only ever written to
-- once a visitor clicks "Allow" on the cookie banner — see
-- lib/context/CookieConsentContext.tsx). No names, emails, phone numbers,
-- or raw IP addresses are ever stored here — session_id is a random client
-- generated UUID, not tied to any lead or identity.

create table analytics_sessions (
  id             uuid primary key,
  first_seen     timestamptz not null default now(),
  last_seen      timestamptz not null default now(),
  entry_path     text not null,
  referrer_host  text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  country        text,
  device_type    text not null default 'desktop'  -- 'mobile' | 'tablet' | 'desktop'
);

create index analytics_sessions_first_seen_idx on analytics_sessions (first_seen desc);

create table analytics_page_views (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references analytics_sessions(id) on delete cascade,
  path        text not null,
  created_at  timestamptz not null default now()
);

create index analytics_page_views_session_id_idx on analytics_page_views (session_id);
create index analytics_page_views_created_at_idx on analytics_page_views (created_at desc);
create index analytics_page_views_path_idx on analytics_page_views (path);

create table analytics_section_engagement (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references analytics_sessions(id) on delete cascade,
  path         text not null,
  section_id   text not null,
  duration_ms  integer not null,
  created_at   timestamptz not null default now()
);

create index analytics_section_engagement_section_idx on analytics_section_engagement (section_id);
create index analytics_section_engagement_path_idx on analytics_section_engagement (path);
create index analytics_section_engagement_created_at_idx on analytics_section_engagement (created_at desc);

-- x_pct/y_pct are the click position as a percentage (0-100) of the full
-- document width/height, not the viewport — that's what lets the admin
-- heatmap render the same overlay at any screen size.
create table analytics_clicks (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references analytics_sessions(id) on delete cascade,
  path        text not null,
  x_pct       numeric(5,2) not null,
  y_pct       numeric(5,2) not null,
  created_at  timestamptz not null default now()
);

create index analytics_clicks_path_idx on analytics_clicks (path);
create index analytics_clicks_created_at_idx on analytics_clicks (created_at desc);
