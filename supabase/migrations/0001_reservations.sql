-- Reservations with real anti-overbooking, enforced by Postgres itself —
-- not by application code racing to check-then-insert. Two guests clicking
-- "prenota" on the same room in the same second get one confirmed booking
-- and one rejected insert, guaranteed, because the database refuses the
-- second row rather than trusting the server to have checked first.

create extension if not exists btree_gist;

create type reservation_status as enum ('pending', 'confirmed', 'cancelled', 'blocked');
create type room_slug as enum ('suite-francy', 'domi', 'mery');

create table reservations (
  id uuid primary key default gen_random_uuid(),
  room_slug room_slug not null,
  customer_name text not null,
  email text not null,
  phone text not null,
  -- Half-open range [check_in, check_out): a check-out on day N and a new
  -- check-in on the same day N don't overlap, matching real hotel turnover.
  stay daterange not null,
  adults integer not null default 2,
  children integer not null default 0,
  status reservation_status not null default 'pending',
  total_price integer not null default 0, -- cents, never float, for money
  notes text,
  -- Stripe identifiers, not raw card data — see lib/payments/stripe.ts.
  -- The card itself never reaches this table or any of our own code.
  stripe_customer_id text,
  stripe_payment_method_id text,
  stripe_setup_intent_id text,
  created_at timestamptz not null default now(),

  constraint stay_is_valid check (lower(stay) < upper(stay)),

  -- The actual anti-double-booking guarantee: no two rows for the same
  -- room may have overlapping `stay` ranges, UNLESS one of them is
  -- cancelled — a cancelled booking must free the room back up.
  constraint no_overlapping_stays
    exclude using gist (
      room_slug with =,
      stay with &&
    ) where (status != 'cancelled')
);

create index reservations_room_stay_idx on reservations using gist (room_slug, stay);
create index reservations_email_idx on reservations (email);

alter table reservations enable row level security;

-- Guests can create a pending request (the booking form) but never read,
-- update, or delete any row — that keeps every other guest's name, email,
-- and phone number out of reach for an anonymous visitor. All admin
-- reads/writes go through the service-role key from a server route, which
-- bypasses RLS entirely and is never exposed to the browser.
create policy "anyone can request a booking"
  on reservations for insert
  to anon
  with check (status = 'pending');
