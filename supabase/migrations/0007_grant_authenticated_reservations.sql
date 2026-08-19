-- RLS policies (0005, 0006) only filter WHICH rows a role can see/touch —
-- they don't grant the underlying table access. Without this, Postgres
-- denies `authenticated` before the policies are even evaluated, which is
-- why "guests can view/cancel their own reservations" never actually
-- worked despite being correctly defined: every signed-in guest's request
-- failed with "permission denied for table reservations".
grant select, update on reservations to authenticated;
