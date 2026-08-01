-- Westora Global — lead reference generator: WG-{YYYY}-{NNNN}
--
-- Concurrency guarantee: `INSERT ... ON CONFLICT DO UPDATE ... RETURNING`
-- takes a row-level lock on the target row for the duration of the
-- transaction. Two concurrent submissions both calling this function for
-- the same year will serialize on that lock — the second caller blocks
-- until the first commits, then reads the already-incremented value. This
-- makes a collision structurally impossible without needing application-
-- level locking or a retry loop.

create table lead_reference_sequences (
  year        int primary key,
  next_value  int not null default 1
);

create or replace function generate_lead_reference()
returns text
language plpgsql
as $$
declare
  current_year int := extract(year from now());
  seq_value int;
begin
  insert into lead_reference_sequences (year, next_value)
  values (current_year, 2)
  on conflict (year)
  do update set next_value = lead_reference_sequences.next_value + 1
  returning next_value - 1 into seq_value;

  return 'WG-' || current_year::text || '-' || lpad(seq_value::text, 4, '0');
end;
$$;

create or replace function set_lead_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := generate_lead_reference();
  end if;
  return new;
end;
$$;

create trigger leads_set_reference
  before insert on leads
  for each row
  execute function set_lead_reference();
