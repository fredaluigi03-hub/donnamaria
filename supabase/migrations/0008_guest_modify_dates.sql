-- Lets a signed-in guest change the check-in/check-out dates of their own
-- pending/confirmed reservation (extend or shorten the stay). Availability
-- for the new dates is guaranteed the same way as a brand-new booking: the
-- `no_overlapping_stays` exclusion constraint (0001_reservations.sql)
-- rejects the update outright if another reservation already holds the
-- room for the requested range — the app layer only translates that
-- Postgres error into a friendly 409, it doesn't re-implement the check.

create policy "guests can modify dates of their own reservation"
  on reservations for update
  to authenticated
  using (
    lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
    and status in ('pending', 'confirmed')
  )
  with check (
    lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
    and status in ('pending', 'confirmed')
  );

-- Same column-tampering guard as reservations_guard_guest_cancel (0006),
-- but for the "keep the same status, just move the dates" path: a guest
-- may only change `stay` and `total_price` this way, never room, contact
-- details, guest counts, or notes.
--
-- Known gap: `total_price` itself isn't re-derived here (room prices live
-- in config/rooms.ts, not in the database), so this trusts whatever price
-- the calling route computed. Acceptable today because every booking is
-- a request a staff member reviews and confirms manually before any
-- payment happens — nothing here auto-charges a card. If that changes,
-- move room prices into the database and recompute total_price in this
-- trigger from `new.stay`, the same way reservations_guard_guest_cancel
-- derives refund_percentage from real dates instead of trusting the client.
create or replace function reservations_guard_guest_edit_dates()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'authenticated' and new.status = old.status then
    if new.customer_name is distinct from old.customer_name
      or new.email is distinct from old.email
      or new.phone is distinct from old.phone
      or new.room_slug is distinct from old.room_slug
      or new.adults is distinct from old.adults
      or new.children is distinct from old.children
      or new.notes is distinct from old.notes
      or new.cancelled_at is distinct from old.cancelled_at
      or new.refund_percentage is distinct from old.refund_percentage
    then
      raise exception 'Un ospite può modificare solo le date del proprio soggiorno.';
    end if;
  end if;
  return new;
end;
$$;

create trigger reservations_guest_edit_dates_guard
  before update on reservations
  for each row
  execute function reservations_guard_guest_edit_dates();
