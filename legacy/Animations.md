# Animations

The kit uses two motion libraries deliberately, for different jobs:

- **Motion** (`motion/react` — the package formerly published as
  `framer-motion`) for declarative, component-scoped animation: entrances,
  hover states, page transitions, viewport-triggered reveals.
- **GSAP** (+ ScrollTrigger) for anything that needs scrubbed/pinned
  scroll timelines or fine-grained sequencing outside React's render
  cycle. Reach for GSAP only when Motion's `useScroll`/`useTransform`
  genuinely isn't enough — most sections never need it.
- **Lenis** provides the smoothed scroll position both of the above sync
  against, mounted once via `<SmoothScroll>` in the root layout.

All primitives live in `components/animations/`. Import each one directly
from its own file (`@/components/animations/fade-in`, etc.), which is
what every call site in this kit does — direct imports keep bundlers'
tree-shaking straightforward and avoid pulling in unrelated animation
code through a shared barrel. `components/animations/index.ts` exists as
a single place to see everything available at a glance; treat it as a
reference/table-of-contents, not an import path.

## The primitives

`FadeIn` — the default choice. Fades (optionally fades-up) an element as
it scrolls into view. Set `distance={0}` for a plain fade.

`SlideIn` — horizontal entrance, `direction="left" | "right"`. Use for
alternating image/text rows.

`Reveal` — a clip-path "curtain" reveal, more editorial than a fade. Use
for hero imagery and large section headlines, not small UI chrome.

`Stagger` / `StaggerItem` — wrap a list or grid in `<Stagger>`, wrap each
child in `<StaggerItem>`. Children animate in sequence rather than all at
once. See `components/sections/features.tsx`.

`Parallax` — scroll-linked vertical translate scoped to the element's own
viewport progress. For simple depth effects; use GSAP ScrollTrigger for
pinned or scrubbed parallax.

`PageTransition` — route-level enter/exit, keyed on pathname. Optional:
mount in the root layout only if the client brief calls for it — page
transitions add perceived latency and should be a deliberate choice, not
a default.

`TextReveal` — word-by-word (default) or char-by-char masked reveal for
headlines. Splitting text breaks screen-reader phrasing, so the component
renders the full string in an `aria-label` on the wrapping element and
marks the animated spans `aria-hidden`.

`HoverScale` — the standard hover/tap micro-interaction for cards and
clickable tiles, in place of ad-hoc `hover:scale-105` Tailwind classes.

`LoadingScreen` — full-viewport splash shown once per session on first
load. Not mounted by default in `app/layout.tsx`; wire it up per project
if the brief wants one, gated on `sessionStorage` so it doesn't replay on
every route change.

`SmoothScroll` — the Lenis provider + GSAP ScrollTrigger sync. Mounted
once, near the root. Don't nest a second instance.

## Motion tokens

Durations and eases are centralized in `lib/animations.ts`
(`transitionStandard`, `transitionEmphatic`) and `lib/constants.ts`
(`MOTION`), mirroring the CSS custom properties in `globals.css`
(`--duration-*`, `--ease-*`). JS-driven animation (Motion, GSAP) can't
read CSS custom properties, so these are kept in sync by hand — if you
change one, change both. Default feel: `durationBase` (0.4s) with
`easeStandard` (`cubic-bezier(0.22, 1, 0.36, 1)`) for most UI motion;
`durationSlow` (0.7s) with `easeEmphatic` for hero-level reveals.

## Reduced motion

Every primitive calls Motion's `useReducedMotion()` and swaps to a plain
opacity fade (or renders statically) when the user has requested reduced
motion at the OS level. `globals.css` also collapses all CSS
animations/transitions to near-zero duration under
`prefers-reduced-motion: reduce` as a backstop for anything animated in
plain CSS. Never bypass this to "make sure an animation is seen" — respect
the preference.

## Adding a new animation

1. Check if an existing primitive covers it with different props first.
2. If genuinely new, add it to `components/animations/`, export it from
   `index.ts`, and add a short entry to this file.
3. Pull duration/easing from `lib/animations.ts` / `lib/constants.ts`
   rather than hardcoding new values, unless the brief specifically calls
   for a different feel — in which case, consider whether the tokens
   themselves should change instead.
