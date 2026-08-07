-- Westora Global — products (moves data/products.ts from a static file to
-- the single source of truth, so the admin CRUD (PRD follow-up) can
-- add/edit/delete SKUs without a redeploy).
--
-- specs / images / custom_fields are jsonb because their shape is a small,
-- ordered list of objects (ProductSpec[] / ProductImage[] / custom
-- label-value pairs) — modelling them as child tables would be correct
-- relationally but is unwarranted complexity for data that is always read
-- and written as a whole array alongside its parent product.

create table products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  category          text not null,        -- 'spices' | 'chillies' | 'tea' | 'rice' | 'other'
  origin            text not null,
  origin_district   text,
  botanical         text not null default '',
  has_gi            boolean not null default false,
  gi_number         text,
  hero_line         text not null,
  description       text not null,
  specs             jsonb not null default '[]',   -- { label, value, unverified? }[]
  forms             text[] not null default '{}',
  packaging         text[] not null default '{}',
  provenance        text[] not null default '{}',
  images            jsonb not null default '[]',   -- { src, alt }[]
  featured          boolean not null default false,
  custom_fields     jsonb not null default '[]',   -- { label, value }[] — admin-defined extra fields
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index products_category_idx    on products (category);
create index products_sort_order_idx  on products (sort_order);

create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();

-- Storage bucket for admin-uploaded product images. Existing product
-- photography stays on disk under public/images/products/ (already
-- optimised, already fast) — this bucket is only for NEW images uploaded
-- through the admin product form, whose products.images[].src then holds
-- the bucket's public URL instead of a local /images/... path. next/image
-- serves either transparently.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
