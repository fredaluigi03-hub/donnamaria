# Design System

Every visual decision in this kit traces back to one file:
`app/globals.css`. Tailwind v4 is CSS-first, so there is no
`tailwind.config.ts` to hunt through — tokens are declared as CSS custom
properties under `:root` / `.dark`, then mapped to Tailwind utilities
inside `@theme inline`. Change a value once there and every component that
uses the corresponding utility (`bg-primary`, `text-muted-foreground`,
`rounded-lg`, `font-display`) updates automatically.

## Typography

Two typefaces are wired up in `lib/fonts.ts`: `fontSans` (body/UI copy,
mapped to `--font-sans` / the `font-sans` utility) and `fontDisplay`
(headings and hero type, mapped to `--font-display` / `font-display`).
Swap either by changing the `next/font/google` import in that one file —
no component should import a font directly. Use `font-display` only for
headings; body copy, form labels, and UI chrome stay on `font-sans` so the
display face reads as intentional rather than default.

Scale headings with Tailwind's text utilities directly (`text-4xl`,
`md:text-6xl`, etc.) rather than introducing a custom type-scale config —
the reference sections (`components/sections/hero.tsx`) show the pattern
for responsive heading sizes.

## Color

Semantic tokens only — components should never reference a raw color.
The palette: `background` / `foreground` (base surface and text),
`card` / `popover` (elevated surfaces), `primary` / `secondary` / `accent`
(brand and UI emphasis), `muted` (de-emphasized text and surfaces),
`destructive` / `success` / `warning` (state colors), and
`border` / `input` / `ring` (structural lines and focus states). Each has
a `-foreground` pair for guaranteed-readable text on top of it
(`bg-primary text-primary-foreground`). Re-skinning a client brand means
editing the `hsl()` values under `:root` and `.dark` — component code
never changes.

## Spacing, grid, and containers

Two layout primitives carry the entire site's rhythm:

- `<Container>` (`components/ui/container.tsx`) — horizontal rhythm.
  Caps content at `--container-2xl` (1400px) with responsive gutters.
  Every section's content nests inside one; never hand-roll `max-w-*` +
  `px-*` on a one-off basis.
- `<Section>` (`components/ui/section.tsx`) — vertical rhythm. Consistent
  `py-20 md:py-28 lg:py-32` so sections never feel cramped or bloated
  relative to each other.

Compose them as `<Section><Container>...</Container></Section>`. Internal
spacing uses Tailwind's default 4px scale; stick to multiples of 4
(`gap-4`, `gap-6`, `gap-8`) rather than arbitrary values.

## Buttons

`components/ui/button.tsx` defines six variants (`default`, `destructive`,
`outline`, `secondary`, `ghost`, `link`) and four sizes (`default`, `sm`,
`lg`, `icon`) via `class-variance-authority`. Use `asChild` to render a
`<Button>`-styled `<Link>` instead of a nested `<a><button>` — see
`components/sections/hero.tsx` for the pattern. Add new variants to the
`cva` config, not as one-off className overrides on individual buttons.

## Cards, inputs, badges

`components/ui/card.tsx` gives composable primitives
(`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`,
`CardFooter`) — compose them rather than building bespoke bordered `div`s.
`components/ui/input.tsx` and `textarea.tsx` share consistent focus rings,
invalid states (`aria-invalid`), and disabled styling; pair with
`components/ui/label.tsx`. `components/ui/badge.tsx` covers status/tag
use cases with the same semantic color variants as buttons plus
`success` and `warning`.

## Shadows and radius

Radius is token-driven: `--radius` (0.625rem) is the base, with
`--radius-sm/md/lg/xl` derived from it in `@theme inline`. Change the one
`--radius` value to re-tune the entire site's corner rounding. Shadows use
Tailwind's default `shadow-sm` / `shadow-md` utilities directly — kept
deliberately subtle; lean on borders (`border-border`) for structure
before reaching for heavier shadows.

## Dark mode

Class-based (`next-themes`, `attribute="class"`), toggled by
`components/layout/theme-toggle.tsx` and provided by
`components/layout/theme-provider.tsx` in the root layout. Every token has
a `.dark` override in `globals.css` — when adding a new token, add both
the light and dark value in the same edit so dark mode never lags behind.

## Motion principles

See `docs/Animations.md` for the full animation system. The short version:
motion should clarify hierarchy and reward scrolling, never call attention
to itself. Default durations (`--duration-fast/base/slow`) and easings
(`--ease-standard`, `--ease-emphatic`) are tokenized in `globals.css` and
mirrored in `lib/constants.ts` (`MOTION`) for use in JS-driven animation
(Motion/GSAP don't read CSS custom properties directly).
