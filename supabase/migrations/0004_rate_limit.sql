-- Westora Global — enquiry rate limiting (5 submissions per IP per hour)
--
-- Postgres-backed rather than Vercel KV: this project already has a
-- Supabase connection on every request, so a counter table needs no new
-- service, credential, or env var. The tradeoff is a small write + count
-- query per submission (a KV store would be a single fast increment) —
-- negligible at this traffic volume, and avoided having to provision and
-- manage a second data store for one feature.
--
-- Stores a SHA-256 hash of the submitter's IP, not the raw address —
-- enough to rate-limit without holding the IP itself at rest.

create table rate_limit_events (
  id          uuid primary key default gen_random_uuid(),
  ip_hash     text not null,
  created_at  timestamptz not null default now()
);

create index rate_limit_events_ip_hash_created_at_idx
  on rate_limit_events (ip_hash, created_at desc);

-- Row lifetime is short (rate-limit window is 1 hour); prune anything
-- older than a day so this table never grows unbounded.
create or replace function prune_rate_limit_events()
returns void
language sql
as $$
  delete from rate_limit_events where created_at < now() - interval '1 day';
$$;

alter table rate_limit_events enable row level security;
-- No policies: only the service-role key (used server-side in the
-- enquiry Server Action) touches this table; it bypasses RLS.
