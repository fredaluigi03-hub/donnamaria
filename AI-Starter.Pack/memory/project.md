# Project

## Overview

Project Name: Donna Maria Suite & Relax (repo: `donnamaria`)

Status: **Live**, deployed on Vercel (Production), connected to GitHub
(`fredaluigi03-hub/donnamaria`, branch `main`) with deploy-on-push. Built
from this same Agency Starter Kit — the code, hooks, lib, and docs in
`AI-Starter.Pack/` and in the project root are the same files (verified
byte-identical as of 2026-07-25); nothing in the pack was reinvented.

Start Date: not recorded (project predates this memory file being filled in).

Expected Delivery: not specified by the client.

---

## Stack

Framework: Next.js 16 (App Router), React 19, TypeScript (strict) — this
project _does_ use the stack the rest of the starter pack assumes, unlike
some other projects built from this same pack. Treat `docs/`, `config/`,
`lib/`, `hooks/` at the project root as the live source of truth; the
copies inside `AI-Starter.Pack/` are reference duplicates from the same
kit, not project-specific overrides.

Styling: Tailwind CSS v4 (`@theme` tokens in `app/globals.css`),
shadcn/ui-pattern components.

Motion: Motion (`motion/react`), GSAP + ScrollTrigger, Lenis (`root` mode —
smooths native scroll, doesn't fake it via transform, so `position: sticky`
and scroll-linked Motion values both work correctly on top of it).

Backend: Supabase (client/server helpers present in `lib/supabase/`;
booking form wiring status not audited as part of this update).

Hosting: Vercel, Production environment, custom + `*.vercel.app` domains
assigned.

---

## Features

- [x] Hero (`/`) — full-bleed, centered, "fullscreen" variant. Background
      is a **scroll-scrubbed frame sequence** (60 JPG frames extracted from
      `hero.mp4` via ffmpeg, `public/images/hero-frames/`), not an
      autoplaying/looping `<video>`. The hero pins (`position: sticky`)
      for an extra `SCRUB_TRACK_VH` (160vh) of scroll — tuned for roughly
      5–6 mouse-wheel notches on a typical viewport — during which the
      frame advances/reverses in lockstep with scroll direction, then
      releases into normal scrolling with a brief opacity-only exit fade
      (no zoom — an earlier `1.08`/`1.02` background-scale exit was
      removed because it visibly softened the last held frame). Falls
      back to the static poster + slow Ken Burns zoom on mobile or
      `prefers-reduced-motion`. See `components/sections/hero.tsx` and the
      new `components/animations/scroll-scrub-sequence.tsx`.
- [x] `OutdoorExperience` (homepage, below Hero) — full-bleed section
      using the older `BackgroundVideo` pattern (autoplay/loop, crossfade
      between two `<video>` layers) with `pool.mp4` — left as-is, not
      converted to scroll-scrub (explicit user choice: only the Hero got
      the scrub treatment).
- [x] `PoolShowcase` — existed in the codebase but was **never rendered on
      any page** before this session (an orphaned component). Now: (a) its
      large panoramic photo has `pool.mp4` layered on top via
      `BackgroundVideo` (falls back to the static photo on mobile/reduced
      motion, same as Hero), and (b) it's actually mounted in
      `app/page.tsx`, directly after `OutdoorExperience`.
- [x] Hydration-mismatch fix — `motion/react`'s `useReducedMotion()`
      resolves synchronously on the client's first render but the server
      always assumes `false`; for any visitor with the OS "reduce motion"
      setting on (confirmed to be the case for this project's primary
      tester), this caused a real React hydration warning on every
      animated component site-wide (Hero, FadeIn, SlideIn, Stagger,
      HoverScale, Reveal, TextReveal, Parallax, Header — 11 files). Fixed
      by adding `hooks/use-reduced-motion.ts`, a hydration-safe wrapper
      around `useMediaQuery("(prefers-reduced-motion: reduce)")` (same
      `useSyncExternalStore` pattern already used for `isMobile`
      elsewhere), and swapping every import.
- [ ] Deploy verification loop had real friction this session — see
      `decision.md` and `todo.md`. Current status: pushed and confirmed
      live on Vercel Production (commit `9b30839`), but the user should
      re-confirm the scroll-scrub hero and pool video both render as
      expected on the actual production domain (not just localhost),
      since this hasn't been independently re-verified since the last
      round of tuning (track length, exit-zoom removal).

---

## Pages

`app/page.tsx` (homepage), `app/camere/page.tsx` (+ dynamic room pages),
`app/galleria/page.tsx`, `app/contatti/page.tsx`, `app/la-struttura/page.tsx`.
Homepage section order: `Hero → SearchWidget → OutdoorExperience →
PoolShowcase → WellnessShowcase → RoomsShowcase → Features →
GalleryPreview → Testimonials → LocationContact → Cta`.

---

## Integrations

- Supabase: client/server helpers present; real usage/config not audited
  this session.
- Vercel: connected, deploy-on-push to `main` confirmed working (after
  resolving a stuck `.git/index.lock`, see `decision.md`).
- Analytics: not confirmed either way this session.

---

## Notes

- **`AI-Starter.Pack/memory/*.md`, `decision.md`, `todo.md`, and
  `handoffs/003–005` previously contained an unrelated project's history**
  ("Elite Fitness Club" / `elite-motion`, a TanStack Start gym site) — left
  over from a prior use of this same reusable starter pack. That content
  has been superseded by this file as of 2026-07-25; the old handoffs are
  kept on disk (not deleted) with a disclaimer header, for the record, but
  do not describe this project.
- `docs/01_Brand.md` at the project root is still the unfilled template —
  real facts live in `config/site.ts` instead (name, address, phone,
  description, keywords) but voice/tone/positioning has never been
  formally written down. Worth doing properly in a future session rather
  than inferring it from scattered copy.
- Real site facts (from `config/site.ts`): "Donna Maria Suite & Relax", a
  boutique hotel in Serino (Irpinia, provincia di Avellino), Via Tenente
  Paolo de Vivo 10, 83028 Serino (AV). Amenities per the homepage's JSON-LD:
  piscina panoramica, jacuzzi, sauna, Wi-Fi gratuito, parcheggio privato.
  No confirmed contact email yet (`config/site.ts` deliberately falls back
  to an obviously-placeholder address rather than a plausible-looking fake
  one). No `reviewsUrl` yet — the "Leggi tutte le recensioni" button stays
  unrendered until one is provided.
