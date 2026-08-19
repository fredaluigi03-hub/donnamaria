-- "Automatically expose new tables" being off skipped the default grant
-- for every Data API role, not just anon — service_role needs it too, even
-- though it already bypasses RLS (BYPASSRLS and table-level GRANTs are two
-- separate permission layers; bypassing one doesn't imply the other).
grant select, insert, update, delete on public.reservations to service_role;
