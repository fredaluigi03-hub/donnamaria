# Prompt: B&B Site with Booking-Style Reservation Flow

Use this prompt (in this repo, on top of the starter kit) to build the
actual client site — an immersive, animated B&B website with a
reservation experience structured like Booking.com: search by dates/
guests, browse rooms, see live availability, book, confirm.

---

Build a full B&B website on top of this starter kit. Reuse everything
that already exists (`components/ui`, `components/animations`,
`<Section>`/`<Container>`, `buildMetadata()`, the Supabase clients) rather
than reinventing it — this prompt only describes what's net-new.

## 1. Brand pass first

Before writing any page, fill in `docs/Brand.md` for this specific B&B
(name, story, tone, location, target guest) and re-tune the tokens in
`app/globals.css` (`--primary`, `--secondary`, `--accent`, `--font-display`)
toward a warm, boutique-hospitality palette — the kit ships with a
neutral SaaS-like default that should not be the final B&B look. Do not
touch component code to achieve this; tokens only.

## 2. Data model (Supabase)

Design and create these tables (with RLS — guests should only read
published rooms/availability, never write bookings directly without
going through validation):

- `rooms`: id, slug, name, description, max_guests, base_price_per_night,
  amenities (jsonb or join table), sort_order, published boolean.
- `room_images`: room_id, url, alt, sort_order.
- `bookings`: id, room_id, guest_name, guest_email, check_in, check_out,
  guests_count, total_price, status (`pending` | `confirmed` |
  `cancelled`), created_at.
- `blackout_dates` (optional): room_id, date, reason — for maintenance or
  owner-blocked dates outside normal bookings.

Generate real types into `types/supabase.ts` via the Supabase CLI once
the schema exists (`npx supabase gen types typescript ...`) — don't hand
-write them.

Write the availability-check logic as a single reusable function (e.g.
`lib/bookings/check-availability.ts`): given a room id and a date range,
query `bookings` (status != cancelled) and `blackout_dates` for overlap,
return `{ available: boolean, conflictingDates?: ... }`. Every place that
needs to check availability (search results, room detail page, the
booking step itself) calls this one function — do not duplicate the
overlap logic.

## 3. Pages

- `/` — Immersive hero (full-bleed video or large photo with parallax via
  `Parallax`/`Reveal`), the sticky/prominent search widget (see §4),
  a curated rooms preview grid, an amenities/experience section, guest
  reviews, location/map, footer.
- `/rooms` — Full room listing. Reuses the same search widget from the
  homepage (extract it into one shared component — do not duplicate the
  date/guest picker markup between `/` and `/rooms`), filterable by dates
  and guest count, results show live availability and price for the
  selected dates.
- `/rooms/[slug]` — Room detail: image gallery (lightbox), full
  description, amenities, a booking panel that stays visible while
  scrolling (sticky on desktop, docked bottom sheet on mobile), calendar
  showing unavailable dates greyed out.
- `/book/[slug]` (or a multi-step section on the room page — pick one
  approach and be consistent): guest details form (React Hook Form + Zod,
  same pattern as `components/forms/contact-form.tsx`) → review & total
  price → confirmation. Persist the booking as `pending`, show a
  confirmation screen with a reference number. Do not fabricate payment
  processing — either integrate a real provider (Stripe) if credentials
  are available, or clearly mark the flow as "request to book, pay on
  arrival" if not.
- `/about`, `/contact` — replace the existing placeholder pages with real
  content once `docs/Brand.md` is filled in; keep using `<PageHeading>`
  and existing sections where they fit.

## 4. The search/availability widget (the "Booking-style" part)

Build one reusable component (e.g. `components/booking/search-widget.tsx`)
with: a date-range picker (check-in/check-out), a guest-count stepper,
and a search/check-availability button. This is the single most-reused
piece of UI on the site — homepage hero, `/rooms`, and ideally a
persistent compact version in the header on scroll. Build it once, reuse
it everywhere; do not let each page grow its own copy.

Behavior: selecting dates + guests either (a) navigates to `/rooms` with
the selection as query params and filters results by availability, or
(b) on the room detail page, checks that specific room's availability
inline. Keep the date-range logic in one hook
(e.g. `hooks/use-date-range.ts`) shared by both entry points.

## 5. Animations (use what's already built, extend only if needed)

- Hero: `Parallax` or `Reveal` on the main image/video, `TextReveal` on
  the headline.
- Room grid: `Stagger`/`StaggerItem` for the card entrance,
  `HoverScale` on each room card.
- Image galleries: a lightbox/carousel — check if this needs a new small
  animation primitive (e.g. `components/animations/` gallery transition)
  before reaching for a third-party carousel library; prefer Motion's
  `AnimatePresence` for slide transitions if so.
- Booking flow steps: animate step transitions with `PageTransition`'s
  pattern (or a local variant of it) so moving from dates → guest info →
  confirmation feels like one continuous flow, not a page reload.
- Sticky booking panel on room detail: animate its docking
  (desktop sidebar ⇄ mobile bottom sheet) using Motion's layout
  animations (`layout` prop / `AnimatePresence`), respecting
  `useReducedMotion` like every other primitive in this kit.

## 6. Non-negotiables (carried over from `CLAUDE.md`)

No `any`. No duplicated primitives — check `components/ui/` and
`components/animations/` before adding new ones. No hardcoded brand
values in components. Every route gets real metadata via
`buildMetadata()`. Respect `prefers-reduced-motion`. Server Components by
default; `"use client"` only where interactivity requires it. Accessible
forms and date pickers (keyboard-operable, labeled, announced state
changes). Add structured data (`LodgingBusiness` / `Product` with
`Offer`/availability) for SEO on the homepage and room pages — see
`docs/SEO.md`. Run `npm run validate` before considering any page done.

## 7. Definition of done

A visitor can: land on the homepage, pick dates and guest count, see
which rooms are available and at what price, open a room's gallery and
details, complete a booking with their information, and land on a
confirmation screen with a reference number — end to end, with no dead
links, no broken image references, and no console errors.
