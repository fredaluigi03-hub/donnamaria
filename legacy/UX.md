# UX

Principles and conventions for interaction design across every project
built on this kit — not a substitute for project-specific user research,
but the baseline every page should meet before it ships.

## Navigation

Primary navigation lives in `config/nav.ts` (`mainNav`, `footerNav`) and
renders through `components/layout/header.tsx` / `footer.tsx`. Keep the
primary nav to 5 items or fewer; anything beyond that belongs in a
secondary nav, a mega-menu, or the footer. The mobile menu
(`Header`'s collapsible panel) must expose every primary nav item plus the
theme toggle and primary CTA — never a reduced subset.

## Forms

`components/forms/contact-form.tsx` is the reference pattern: React Hook
Form for state, Zod for validation (schema lives in
`utils/validation.ts`, shared if more than one form needs it), shadcn
inputs for markup. Every field: a visible `<Label>`, inline error text
tied to the field via proximity and `role="alert"`, and `aria-invalid`
set from form state — not just a red border. Submit buttons show a
loading state (`Loader2` spinner) and disable during submission to
prevent double-submits. Success/error feedback uses
`role="status" aria-live="polite"` so screen readers announce it without
requiring focus to move.

## Loading and empty states

Route-level loading uses `app/loading.tsx` (Next's built-in Suspense
boundary) — every route segment that fetches data should have one rather
than showing a blank screen. Empty states (no results, no data yet) need
their own explicit UI, not just a blank container; write the empty-state
copy with the same care as the happy path.

## Feedback and states

Every interactive element needs visible hover, focus-visible, active, and
disabled states — the shadcn-based primitives in `components/ui/` already
handle this; don't strip it with a custom `className` override. Toasts,
inline alerts, and status text should use the semantic color tokens
(`success`, `warning`, `destructive`) so meaning is consistent everywhere
they appear.

## Accessibility baseline

- Every `<Button>`-as-icon needs an `aria-label`.
- Every animated text split (`TextReveal`) must expose the full string via
  `aria-label` on the container, animated spans marked `aria-hidden`.
- Focus rings (`focus-visible:ring-2 ring-ring`) are never removed, only
  restyled.
- Color is never the only signal — pair destructive/success states with
  icon or text, not just a red/green background.
- Respect `prefers-reduced-motion` (see `docs/Animations.md`) and
  `prefers-color-scheme` (dark mode default is `system`, not forced).
- Target WCAG 2.1 AA contrast for all text/background token pairings —
  verify after any palette change in `globals.css`.

## Performance as UX

Slow is a UX bug, not a separate concern — see `docs/Performance.md`.
Layout shift from late-loading fonts, images, or animations reads to
users as "broken," not "loading."
