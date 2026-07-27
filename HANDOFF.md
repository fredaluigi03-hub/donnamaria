# Handoff — Donna Maria Suite & Relax

**Correct project path:** `C:\Users\Luisl\Documents\claude\donnamaria` (git repo, remote `origin/main`).

**Do NOT use** `C:\Users\Luisl\Documents\claude\starter-kit` — that's a separate, non-git folder where the previous session accidentally worked. Its content has mostly landed here too, but see "Needs reconciliation" below before trusting it blindly.

Dev server: `.claude/launch.json` config `donna-maria-dev` → `npm run dev` on port 3000.

## What the previous session did (in `starter-kit`, needs verifying against this repo)

1. **Fixed a hydration mismatch** in `components/animations/text-reveal.tsx` — `useReducedMotion()` was branching into two different DOM trees directly; gated it behind the existing `useMounted()` hook instead (same pattern already used in `hero.tsx`).
2. **Replaced the "Un'accoglienza che sa di casa" section** with a new full-bleed video section, `components/sections/outdoor-experience.tsx` ("Relax all'aria aperta" — pool.mp4 background, CTAs smooth-scroll to `#suites`/`#wellness` via `useLenis`). Extracted Hero's video-crossfade logic into a shared `components/animations/background-video.tsx` so both sections use one engine.
3. New homepage section order: Hero → Outdoor Experience → Wellness → Suites → Servizi → Gallery → Testimonials → Location → CTA.
4. **Redesigned the Hero's CTA row and kicker** (Creative Director pass, step 1 of a multi-step plan): secondary CTA "Scopri le Camere" is now a plain text link instead of a bordered button (one confident action, not a button pair); kicker changed from "Boutique Hotel · Irpinia" to "Serino, Irpinia" (dateline-style, not a category tag).

## In-progress plan (Creative Director redesign, was mid-flow when session ended)

User is reviewing the site against Aman / Forestis / Six Senses / Bulgari / Edition / Habitas as the bar. Priority order, one step at a time, **stop for approval after each step**:

1. ~~Hero experience~~ — done above, awaiting approval to continue
2. Header / Navigation — flagged problem: dark/light `ThemeToggle` in the header reads as a dev-tool affordance, not a hotel amenity; likely remove
3. Search Widget — flagged problem: styled like an OTA (Booking.com) widget, clashes with editorial tone
4. Outdoor Experience section — not yet reviewed under this pass
5. Visual rhythm of the first half of the homepage
6. CTA block (`components/sections/cta.tsx`) — flagged problem: solid-color rounded box + button is a generic SaaS/marketing pattern
7. Remaining sections — flagged: `Features`/`RoomsShowcase`/`Testimonials` overuse `<Card>`, which `docs/03_DESIGN_SYSTEM.md` itself says to avoid ("most content should breathe without cards")
8. Footer — flagged: generic 4-column sitemap grid, no personality

Rules given by the user for this pass: no SaaS/trendy patterns, prefer editorial composition/negative space/restrained typography/cinematic storytelling, one section at a time, explain the problem + why it hurts premium perception + implement + stop for approval.

Known unsolvable-via-code issue (mentioned once, don't resolve, just be aware): the real photography (`bagnosuite.png` etc.) is phone-quality, not editorial — caps how premium the site can feel regardless of layout work.

## Needs reconciliation before continuing

`git status` in this repo already shows uncommitted local changes to `hero.tsx`, `outdoor-experience.tsx`, and `assets/videos/video/pool.mp4` / `public/videos/pool.mp4` that predate this handoff — diff this repo's current file contents against what's described above instead of assuming they match. There are also two `pool.mp4` copies (`assets/videos/video/` and `public/videos/`) — check which one is actually served before editing.
