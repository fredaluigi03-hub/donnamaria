-- "Automatically expose new tables" was deliberately turned off when the
-- project was created, so `anon` has no base table privilege at all — RLS
-- only restricts rows, it doesn't substitute for the underlying GRANT.
-- Insert only: no select/update/delete for anon, matching the RLS policy
-- in 0001_reservations.sql (which further caps inserts to status='pending').
grant insert on public.reservations to anon;
