-- Lets a signed-in guest read their own reservation rows (matched by the
-- email on the row, since bookings aren't tied to an auth user_id — the
-- booking form has never required login). Previously /account tried to
-- read this via the admin-only API and always got nothing back; this is
-- the real, RLS-enforced version instead of trusting application code to
-- filter correctly.
create policy "guests can view their own reservations"
  on reservations for select
  to authenticated
  using (lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), '')));
