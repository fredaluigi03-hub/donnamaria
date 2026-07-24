# Project

## Overview

Project Name: Elite Fitness Club (repo: `elite-motion`)

Status: **Shipped code** is still built on the dark red/black cinematic direction. **Approved creative direction has changed as of 2026-07-23**: the dark cinematic direction is retired and replaced by a new "Quiet Luxury" direction (see `decision.md`) — not yet implemented in code. The content/UX batch that was mid-flight in handoff 004 (Sedi bar/retail copy, asymmetric Coverflow restyle, About-section removal, new "Prima e Dopo" transformations section) **is now complete**, built deliberately in the current dark cinematic style rather than Quiet Luxury — an explicit, user-confirmed sequencing choice to ship this content now and do a dedicated Quiet Luxury redesign pass afterward (see `decision.md`). See `AI-Starter.Pack/handoffs/005-session-handoff.md` for full detail. Any future *visual/design* work (the Quiet Luxury pass itself) must be evaluated against Quiet Luxury, not the dark cinematic direction described elsewhere in this file as the current shipped state.

Start Date: 2026-07-21

Expected Delivery: not specified by the client.

---

## Stack

Framework: TanStack Start (not Next.js — this project does not use the Next.js/Supabase stack the rest of this starter pack assumes; treat `docs/`, `config/`, `lib/`, `hooks/` in this pack as reference material only, not as this project's actual source).

Language: TypeScript (strict), React 19.

Styling: Tailwind CSS v4 (`@theme inline` / `@utility` syntax), shadcn/ui primitives (installed, mostly unused). Design tokens live in `src/styles.css` — dark palette (`--ink`, `--ink-soft`, `--ink-deep`, `--paper`, `--stone`) with a single red accent (`--ember`), oklch throughout. **This palette reflects the now-retired dark cinematic direction only.** As of 2026-07-23 the approved direction is "Quiet Luxury" (bright, daylight-driven, restrained — see `decision.md`); this dark palette is stale relative to that direction and is expected to be reworked in a future implementation session, not yet started.

Animations: Framer Motion, GSAP, Lenis, `@react-three/fiber` + `@react-three/drei` (Three.js) are all installed, but **the shipped site currently uses none of the 3D libraries** — plain CSS transitions/animations and a custom-built `Coverflow` carousel (no external carousel library, despite `embla-carousel-react` being installed) are what's actually live. This differs from handoff 003's plan, which assumed a signature 3D badge (`SpecBadge3D`) would ship — that plan was abandoned before implementation.

Backend: none. No Supabase. The contact form is local-only (no real submission) — known, tracked gap.

CMS: none. All content is hardcoded in `src/routes/index.tsx` (~1040 lines, the single file containing every section component).

Hosting: Cloudflare (via the Nitro `cloudflare-module` preset in `vite.config.ts`), not Vercel.

Asset pipeline: Lovable's `.asset.json` → CDN-proxy pattern is **not used** for real media (it silently no-ops locally without `LOVABLE_PREVIEW_HOST`). All real photos, the logo, and video are self-hosted in `public/images/` and `public/video/` and referenced by plain string path constants at the top of `index.tsx`. This is the binding convention for any new asset going forward.

---

## Features

- [x] Cinematic Hero — real 2048×1152 hero photo (replacing an earlier, badly-upscaled ~350–630px source), red/black vignette, no floating stat card (removed after it obscured the cardio equipment in-photo).
- [x] Real brand assets fully wired in: real logo (round), real photos (split into `assets/photos/pratola/` and `assets/photos/montemiletto/`), a real video tour looped as a "boomerang" (ffmpeg reverse+concat, not AI-generated) at `public/video/tour-boomerang.mp4`.
- [x] Content consolidation (goldsgym.it-inspired): decorative Marquee removed, 4-card Pillars folded into About (About itself later removed entirely, see below), fake-priced Training grid removed, standalone Gallery/VideoTour folded into an interactive `Sedi` section, Testimonials moved to the very end and minimized, FAQ moved to second-to-last.
- [x] Custom `Coverflow` carousel component (CSS transform-based, circular wraparound) — used in `Sedi` (location photo/video viewer), `Programs` (pricing tier cards), and now `PrimaDopo` (transformation photos). **Restyled from symmetric ±2 offset to an asymmetric "fan to the right" layout** (active card anchored left, others cascade behind it to the right with scale/rotate/translate, `overflow-hidden` clipping the cascade) — done 2026-07-23, applied consistently across all three usages.
- [x] `Sedi` interactive locations section — click a location card to reveal bar/retail copy + Foto/Video toggle + Coverflow. Both Pratola Serra and Montemiletto now have real, separate photo arrays (`hasMedia` placeholder removed entirely); the Foto/Video toggle is now conditionally rendered and restricted to Pratola Serra only (`hasVideo: true`) — Montemiletto has no video tour.
- [x] `Programs` section — Abbonamenti / Personal Training / Nutrizionista as three toggleable categories in one consolidated section, using dictated example prices, explicitly disclaimed on-page as "Prezzi indicativi da confermare."
- [x] Montemiletto bar/café descriptive copy in `Sedi` — done 2026-07-23: Montemiletto described as a full made-to-order bar corner (caffetteria, protein smoothie, panino fit) plus the same retail products; Pratola Serra described as retail products only (proteine, barrette, farina d'avena, snack) plus a coffee vending machine, no made-to-order service.
- [x] `About` section removed entirely (including its "Strumenti costruiti per durare una carriera" copy) — done 2026-07-23; Hero now flows straight into Equipment. `id="sala"` and its Nav ("Sala Pesi") / Footer ("Sala pesi") links are gone; no dangling `#sala` anchors remain (verified via grep).
- [x] New "Prima e Dopo" (before/after transformations) section (`PrimaDopo`, `id="risultati"`) — built 2026-07-23 with the same asymmetric-fan Coverflow pattern, person-switcher UI (Carmine / Emilio tabs). **Carmine and Emilio only, by explicit user decision** — Umberto has real photos already optimized in `public/images/pd-umberto-*.jpg` but no caption/story yet; his constants remain declared-but-unused in `index.tsx` with an explanatory comment, and he must be added once his text arrives. Carmine's caption **omits** the dictated "GARANZIA TOTALE... contratto scritto" money-back-guarantee claim per the standing content-safety decision in `decision.md` — this omission was executed, not just decided, this session; still needs the user's (and ideally the gym owner's) explicit sign-off if that language is ever to go live in any form.
- [x] `Visit` section updated 2026-07-23: background swapped from `sala02` to the main `hero` photo; copy now states the visit is free/no-obligation and mentions an optional free trial day.
- [x] Section order reflows to: `Nav, Hero, Equipment, Sedi, Programs, PrimaDopo, Visit, FAQ, Testimonials, Footer`.
- [x] `tsc --noEmit` and `eslint .` both clean relative to `index.tsx`/`styles.css` changes (pre-existing lint issues in unrelated files — `AI-Starter.Pack/config/rooms.ts`, `src/routes/__root.tsx`, some `src/components/ui/*` fast-refresh warnings — are untouched and out of scope).
- [ ] Mobile navigation menu — status not re-verified this session; flagged as missing in handoff 003, unconfirmed since.
- [ ] GDPR/legal pages (Privacy, Cookie Policy, consent checkbox) — not built.
- [ ] Contact form backend — not built.
- [ ] **Quiet Luxury visual redesign** — approved 2026-07-23 as the new creative direction (see `decision.md`) but deliberately **not started**; today's content batch was shipped in the existing dark cinematic style first, by explicit user choice. This is now the single largest pending body of work: palette rework in `src/styles.css`, Hero/section visual treatment, photography direction, likely revisiting the Coverflow fan's color/shadow treatment once the palette changes.
- [x] Google Maps directions per location — done 2026-07-23: `Sedi`'s data model has a `mapsUrl` per location, each card has an "Indicazioni su Google Maps →" link. Pratola Serra uses its real street address; **Montemiletto uses a city-level search link only** (no exact street address on record anywhere in this project's memory) — replace with the precise address once available.
- [x] Ambient section backgrounds — done 2026-07-23, in response to user feedback that every section besides Hero felt flat/dead. Shared `SectionBackdrop` component (low-opacity real photo, dark scrim, slowly-drifting warm light-glow blob respecting `prefers-reduced-motion`) applied to `Equipment`, `Sedi`, `Programs`, `PrimaDopo`, `FAQ`. `Testimonials` deliberately left untouched (intentionally minimal by design).
- [x] Flooring copy corrected — done 2026-07-23: removed inaccurate "parquet" references (Hero copy, `og:description`), replaced with "pavimento con tappetini sopragommati" (the gyms actually have plain flooring with rubberized mats).

---

## Pages

Single-page site (`/`, `src/routes/index.tsx`), anchor-based sections. Current live order (as of 2026-07-23):
`Nav → Hero → Equipment (#attrezzature) → Sedi (#sedi) → Programs (#programmi) → PrimaDopo (#risultati) → Visit (#contatti) → FAQ → Testimonials → Footer`.

`About` (`#sala`) no longer exists in any form.

Dedicated per-location pages and legal pages remain a deliberately out-of-scope future item.

---

## Integrations

- Supabase: not used.
- Google Maps: not integrated (locations link out to `maps.google.com` search URLs only).
- Analytics: none configured.
- Forms: local React state only, no backend submission.
- Email: none configured.

---

## Performance Goals

- [ ] Lighthouse 95+ — not yet measured.
- [x] Accessibility — `prefers-reduced-motion` respected throughout (`src/styles.css` media query + Lenis/animation gating). Focus-visible/skip-link audit not done.
- [ ] SEO Optimized — meta/OG tags correct (real brand name fixed in `__root.tsx`); `schema.org`, sitemap, robots.txt not added.
- [x] Mobile First — responsive down to ~360px verified repeatedly during earlier sessions; not re-verified against the latest content consolidation.

---

## Notes

- **As of 2026-07-23, the approved creative direction is "Quiet Luxury"** — Apple + Technogym + Aman Resort aesthetic, luxury through restraint rather than visual effects. Key principles: natural daylight is a key selling point and must remain visible, real/premium editorial photography is the hero, architecture before effects, the gym must feel bright/calm/premium, nightclub aesthetics and heavy red overlays are explicitly to be avoided. This **retires the dark red/black cinematic direction** described elsewhere in this file as the current shipped state — that direction is now historical, same as Boutique Precision below. See `decision.md` for the full entry. No code has been changed yet to reflect this; it is a direction-only update pending implementation.
- **Handoff 003's "Boutique Precision" Design Specification was superseded before implementation and is now historical.** The user chose a different, red/black cinematic direction from a supplied reference mockup instead (itself now also retired, per the note above). The plan document (`AI-Starter.Pack/plans/design-specification-boutique-precision.md`) still exists on disk but should not be treated as the current design direction — though note Boutique Precision's bright/daylight/editorial-photography/restraint principles overlap partially with the new Quiet Luxury direction and may be a useful partial reference in a future session (not a substitute for a fresh creative pass, since Aman Resort was never part of that brief).
- Real brand assets (`assets/brand.md`, real logo, real photos, real video) remain the single source of truth for all visual and content decisions — no stock photography, no fabricated testimonials/pricing/claims, per `brand.md`'s explicit "only real material" goal.
- The local project folder has no `.git` — it is not guaranteed to be in sync with any parallel editing happening in Lovable's own web editor. A real divergence has happened once already (resolved by explicit user-directed merge). Re-verify current file state at the start of future sessions.
- Handoff 004's in-flight content/UX batch is now complete — full detail in `AI-Starter.Pack/handoffs/005-session-handoff.md`. Handoff 004 remains useful background but is superseded as the "current state" reference.
