-- Per-room availability, callable by anonymous visitors, without ever
-- exposing a single reservation row (guest names, emails, phone numbers)
-- to the public. SECURITY DEFINER runs it as the function owner (bypassing
-- RLS internally), but the function itself returns nothing except a
-- room_slug + boolean — that's the whole point of a narrow RPC instead of
-- widening the anon SELECT grant on the table itself.
create or replace function public.check_room_availability(p_check_in date, p_check_out date)
returns table (room_slug room_slug, is_available boolean)
language sql
security definer
set search_path = public
as $$
  select r.slug, not exists (
    select 1 from reservations res
    where res.room_slug = r.slug
      and res.status != 'cancelled'
      and res.stay && daterange(p_check_in, p_check_out)
  )
  from (select unnest(enum_range(null::room_slug)) as slug) as r
$$;

grant execute on function public.check_room_availability(date, date) to anon;
