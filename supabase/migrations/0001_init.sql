-- Westora Global — initial schema (PRD §6)
-- leads, lead_activity, profiles + supporting indexes.

create extension if not exists "pgcrypto";

create table leads (
  id                uuid primary key default gen_random_uuid(),
  reference         text unique not null,          -- WG-2026-0417
  full_name         text not null,
  company_name      text not null,
  email             text not null,
  phone             text not null,
  country           text not null,
  products          text[] not null default '{}',
  volume            text,
  destination_port  text,
  message           text,
  source_section    text not null,                 -- 'modal' | 'main_form' | 'product_page'
  source_product     text,
  status            text not null default 'new',   -- new|contacted|quoted|sampled|won|lost
  assigned_to       uuid references auth.users(id),
  internal_notes    text,
  consent_given     boolean not null,
  ip_country        text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index leads_created_at_idx on leads (created_at desc);
create index leads_status_idx     on leads (status);
create index leads_country_idx    on leads (country);

create table lead_activity (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  actor       uuid references auth.users(id),
  action      text not null,        -- 'status_change' | 'note' | 'assigned'
  detail      text,
  created_at  timestamptz not null default now()
);

create index lead_activity_lead_id_idx on lead_activity (lead_id);

create table profiles (
  id     uuid primary key references auth.users(id) on delete cascade,
  email  text not null,
  role   text not null default 'viewer'   -- 'admin' | 'viewer'
);

-- keep updated_at current on every leads write
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on leads
  for each row
  execute function set_updated_at();
