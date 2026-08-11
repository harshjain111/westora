-- Westora Global — HSN code + packing sizes (client feedback round,
-- 2026-08). Both are per-product trade data the client wants displayed
-- alongside specs, in the same mono/technical treatment.
--
-- Left null/empty for the 17 existing products deliberately — HSN
-- classification can vary by exact processed form (whole vs. powdered,
-- fresh vs. dried) and getting it wrong on a page buyers may use for
-- customs purposes is a real commercial risk, so this is the client's
-- (or their customs broker's) figure to enter via /admin/products, not
-- ours to guess (CLAUDE.md §11 rule 6: unsure → omit and flag).

alter table products add column hsn_code text;
alter table products add column packing_sizes text[] not null default '{}';
