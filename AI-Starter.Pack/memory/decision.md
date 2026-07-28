# Decisions Log

Every important decision should be documented.

---

## Decision: Replace the Hero's looping background video with a scroll-scrubbed frame sequence

Date: 2026-07-25

Reason: The Hero originally used `BackgroundVideo` (two crossfading
`<video>` layers, autoplaying and looping every ~8s). The user found the
loop restart visually jarring even with the crossfade, and objected to
autoplay/looping in general as "restless" if a visitor pauses to read.
Requested instead that the video "take the visitor with it" as they
scroll, and reverse naturally on scroll-up.

Impact: Extracted 60 JPG frames from `hero.mp4` via ffmpeg
(`public/images/hero-frames/frame-001.jpg`…`frame-060.jpg`) and built
`components/animations/scroll-scrub-sequence.tsx` — a `<canvas>`-based
player that draws whichever frame corresponds to a 0–1 scroll-linked
Motion value, with `object-cover` cropping and a `ResizeObserver` to keep
the canvas buffer matched to its displayed size (capped at 2x DPR). No
autoplay, no loop: motion only happens because the visitor is scrolling,
and scrolling up naturally rewinds it since it's driven by the same
scroll-position value in both directions.

Approved By: User (iterative — requested the concept, then tuned it twice:
once to shorten the pin duration "almeno 10 scroll prima", once to hit a
specific "5/6 scroll" target).

---

## Decision: Pin the Hero (`position: sticky`) for an extra scroll track instead of scrubbing over its natural ~100vh height

Date: 2026-07-25

Reason: With the frame sequence driving the Hero's natural (single
viewport-height) scroll-out, the scrub and the hero leaving the viewport
happened simultaneously — the user described this as being "carried
straight into the pool section" rather than experiencing the video first.
Wanted two distinct, sequential moments: scrub while pinned, _then_ release
into normal scroll toward `PoolShowcase`.

Impact: `Hero.tsx` now wraps the fullscreen variant in an outer track
(`<div style={{ height: SCRUB_TRACK_VH + 'vh' }}>`) only when the scrub is
actually active (`isPinned` — desktop, motion allowed, `scrubFrames` set);
the `<section>` itself gets `sticky top-0`. `useScroll`'s target switches
from the section to this outer track so `scrollYProgress` spans the whole
pinned+scrub duration. Frame-scrubbing consumes the first 85% of that
range (`SCRUB_END`); the last 15% is a brief opacity-only exit flourish
right before the pin releases. On mobile / reduced-motion / no
`scrubFrames`, the wrapper is inert (auto height) and every existing
fallback path (Ken Burns, `videoSrc` loop) is visually unchanged from
before this decision.

Approved By: User (explicit request: "che dopo il numero che ti dico
(5/6) si vada nella sezione piscina").

---

## Decision: Tune `SCRUB_TRACK_VH` to 160 and remove the exit-zoom entirely

Date: 2026-07-25

Reason: Two rounds of user feedback: (1) the exit zoom (`1.08`, later
`1.02`) visibly softened/blurred the last held frame right as it handed
off to the pool section — since the frame sequence has no more detail to
reveal at a larger scale, any upscale just looks lower-resolution; (2) the
total pinned scroll distance needed to correspond to roughly 5–6 mouse-
wheel notches, not an arbitrary "long enough to feel cinematic" duration.

Impact: `backgroundScale`'s exit range now maps to `[1, 1]` (no-op — kept
in code rather than deleted, so the mechanism is still there if a _subtle_
zoom is wanted later) and `SCRUB_TRACK_VH = 160`. The math: a pinned
track's _actual_ scroll cost is `(SCRUB_TRACK_VH − 100)vh` (the first
100vh is just reaching the pinned position), so 160vh ≈ 60vh of real
scroll ≈ 5.5 wheel notches at a 100px/notch, ~900px-viewport assumption.
Documented as an assumption in the code comment since wheel step size
isn't standardized across devices — may need revisiting per-device.

Approved By: User (two explicit rounds of "meno zoom", "almeno 10 scroll
prima", then "5/6" as the specific target).

---

## Decision: Fix the `useReducedMotion` hydration mismatch with a custom hydration-safe hook, not `suppressHydrationWarning`

Date: 2026-07-25

Reason: `motion/react`'s `useReducedMotion()` resolves synchronously on
the client's very first render (reading `matchMedia` immediately), while
SSR always assumes `false` — for any visitor who genuinely has the OS
"reduce motion" setting on, every component that branches its rendered
output (variants, inline `style`) on this hook produces a real React
hydration mismatch, not a benign one. Confirmed root cause via the user's
own dev console log ("You have Reduced Motion enabled on your device")
appearing alongside the mismatch warning, and by finding 11 files
importing the hook from `motion/react`.

Impact: Added `hooks/use-reduced-motion.ts` — a thin wrapper around the
project's existing `useMediaQuery` hook (`useSyncExternalStore`-backed,
forces `false` on server + first client render, same pattern already used
for `isMobile`) querying `(prefers-reduced-motion: reduce)`. Swapped the
import in all 11 files: `hero.tsx`, `outdoor-experience.tsx`,
`pool-showcase.tsx`, `header.tsx`, `fade-in.tsx`, `hover-scale.tsx`,
`parallax.tsx`, `reveal.tsx`, `slide-in.tsx`, `stagger.tsx`,
`text-reveal.tsx`. `tsc --noEmit` and `eslint` (all 13 touched files)
clean after the change.

Approved By: User (asked to "correggi tutti gli errori... hai piena
libertà di movimento").

---

## Decision: Mount `PoolShowcase` on the homepage and add `pool.mp4` to it, rather than building a new pool section from scratch

Date: 2026-07-24

Reason: Investigating why the user saw static pool photos instead of
video revealed `PoolShowcase` already existed, fully built (kicker, large
photo + 3-photo gallery triptych), but was never imported into any page —
an orphaned component. Per the starter kit's own "reuse before creating"
rule, finishing/wiring the existing component was preferred over building
a new one.

Impact: `PoolShowcase`'s large panoramic image now has `BackgroundVideo`
(`pool.mp4`) layered on top, gated by the same `mounted` /
`!shouldReduceMotion` / `!isMobile` pattern as Hero and
`OutdoorExperience`. `app/page.tsx` now imports and renders
`<PoolShowcase />` directly after `<OutdoorExperience />`.

Approved By: User (implicitly, by continuing to iterate on "la piscina"
once this was in place; no objection raised).

---

## Decision: Push to GitHub via the user's local terminal, not from this session's sandbox

Date: 2026-07-25

Reason: This session's sandbox has no network route to github.com (proxy
returns 403) and could not clone/push directly. Separately, a stale
`.git/index.lock` (confirmed to be the _same physical file_ on the user's
real Windows filesystem, not a sandbox-only artifact) blocked `git`
commands on both sides until the user closed any other git-touching
process and deleted the lock file locally.

Impact: All commits/pushes for this session's work were run by the user
directly, from their own PowerShell terminal, with commands provided
step-by-step. `--no-verify` was used on the commit (`git commit
--no-verify`) to skip the Husky `lint-staged` pre-commit hook, since ESLint
had already been independently verified clean on every touched file in
this session — the hook itself isn't broken, just slow (~1 min cold-start
via `npx`) and the user had already hit it once and cancelled with Ctrl+C.
Commit `9b30839` is now on `origin/main` and deployed to Vercel Production.

Approved By: User (ran every command themselves after being walked
through the diagnosis).

---

## Decision: Treat `AI-Starter.Pack/memory/*`, `decision.md`, `todo.md`, and `handoffs/003–005` as belonging to a different project, not Donna Maria

Date: 2026-07-25

Reason: A full read-through showed this memory content described "Elite
Fitness Club" (`elite-motion`), a gym website built on TanStack Start
(not Next.js) — an entirely different client and stack, left over in this
copy of the reusable starter pack from a prior use. The user confirmed by
asking to "aggiornali con quelli di donnamaria" (update them with Donna
Maria's).

Impact: `project.md`, this file, and `todo.md` were rewritten with Donna
Maria's real state. `handoffs/003–005` were left on disk (not deleted —
file deletion in this environment requires explicit user permission that
wasn't sought for this) but each now has a disclaimer header at the top
identifying them as Elite Fitness Club history, not Donna Maria's. A new
Donna Maria handoff (`006-session-handoff.md`, continuing this pack's own
numbering) was added for this session's work.

Approved By: User (explicit instruction).
