-- Lets a signed-in guest cancel their OWN pending/confirmed reservation.
-- The refund percentage is computed by the database from the real
-- check-in date and `now()` — never trusted from the request body — so
-- nobody can get a 100% refund by lying about "days until check-in".
-- Policy: >= 7 days before check-in → full refund; otherwise the guest
-- forfeits 30% (refund_percentage = 70).

alter table reservations
  add column cancelled_at timestamptz,
  add column refund_percentage smallint;

create policy "guests can cancel their own reservation"
  on reservations for update
  to authenticated
  using (
    lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
    and status in ('pending', 'confirmed')
  )
  with check (
    lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
    and status = 'cancelled'
  );

-- Only constrains updates coming from a guest's own session
-- (auth.role() = 'authenticated'). Admin writes go through the
-- service-role key — role() = 'service_role' — and pass through
-- untouched, so staff can still edit any field manually.
create or replace function reservations_guard_guest_cancel()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'authenticated'
    and new.status = 'cancelled'
    and old.status != 'cancelled'
  then
    if new.customer_name is distinct from old.customer_name
      or new.email is distinct from old.email
      or new.phone is distinct from old.phone
      or new.room_slug is distinct from old.room_slug
      or new.stay is distinct from old.stay
      or new.adults is distinct from old.adults
      or new.children is distinct from old.children
      or new.total_price is distinct from old.total_price
      or new.notes is distinct from old.notes
    then
      raise exception 'Un ospite può modificare solo lo stato di cancellazione.';
    end if;

    new.cancelled_at := now();
    new.refund_percentage := case
      when (lower(old.stay)::date - current_date) >= 7 then 100
      else 70
    end;
  end if;
  return new;
end;
$$;

create trigger reservations_guest_cancel_guard
  before update on reservations
  for each row
  execute function reservations_guard_guest_cancel();
