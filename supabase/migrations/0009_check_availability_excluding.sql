-- Same per-room availability check as check_room_availability
-- (0004_check_room_availability.sql), but ignores one specific
-- reservation's own row. Needed when a guest is changing the dates of an
-- existing booking: without this, the guest's own current stay always
-- counts as "occupied" and makes even their own unchanged dates look
-- unavailable.
create or replace function public.check_room_availability_excluding(
  p_check_in date,
  p_check_out date,
  p_exclude_reservation_id uuid
)
returns table (room_slug room_slug, is_available boolean)
language sql
security definer
set search_path = public
as $$
  select r.slug, not exists (
    select 1 from reservations res
    where res.room_slug = r.slug
      and res.status != 'cancelled'
      and res.id != p_exclude_reservation_id
      and res.stay && daterange(p_check_in, p_check_out)
  )
  from (select unnest(enum_range(null::room_slug)) as slug) as r
$$;

-- Only the account "modify my reservation's dates" flow needs this, and
-- that flow always requires a signed-in guest.
grant execute on function public.check_room_availability_excluding(date, date, uuid)
  to authenticated;
