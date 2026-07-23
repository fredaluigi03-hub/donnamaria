## Creative Direction

Compare the implementation against:

docs/01_BRAND.md

docs/02_CREATIVE_DIRECTION.md

docs/03_DESIGN_SYSTEM.md

Report where the implementation feels generic.

Identify:

- weak visual hierarchy
- template-looking layouts
- poor use of whitespace
- weak typography
- poor image composition
- inconsistent motion
- missing storytelling

Suggest premium alternatives.

Think like an Awwwards jury.

## UX Emotion

Evaluate the emotional journey.

For every page explain:

What emotion does the page create?

Does the experience feel premium?

Does scrolling feel cinematic?

Would the user remember this experience?

If not,

explain why.

## Self Critique

If you were the Creative Director of this project,

what would you redesign completely?

List the 10 highest impact improvements.

Ignore implementation effort.

Focus only on design quality.

# Prompt: Full Audit

Use this prompt for a comprehensive, pre-launch (or periodic) audit of
the whole project. It's intentionally broader than `improve-ui.md` /
`improve-ux.md` — run this when you need the full picture, not a single
page.

---

Audit this codebase end-to-end and report findings grouped under the
headings below. For every finding: file/line, what's wrong, why it
matters, and a concrete fix — no vague observations.

## Architecture (`docs/Architecture.md`)

Confirm the layering rule holds (`components/ui` never imports from
`sections`/`layout`), no brand-specific values leaked into `components/ui`,
Server/Client Component boundaries are as small as they should be.

## Type safety

Any `any` (explicit or implicit via missing types)? Any
`@ts-ignore`/`@ts-expect-error` without a comment explaining why? Does
`npm run typecheck` pass clean?

## Design system consistency (`docs/Design-System.md`)

Any raw hex/rgb colors outside `globals.css`? Any spacing that bypasses
`<Section>`/`<Container>` or the 4px scale? Any button/card/input styled
ad-hoc instead of via `components/ui/*`?

## Accessibility (`docs/UX.md`)

Missing `alt` text, missing `aria-label` on icon-only controls, heading
hierarchy skips, insufficient contrast, keyboard traps, motion that
ignores `prefers-reduced-motion`.

## SEO (`docs/SEO.md`)

Every route has real `metadata` via `buildMetadata()`? `sitemap.ts` lists
every public route? Images using `next/image` with meaningful `alt`?

## Performance (`docs/Performance.md`)

Run `npm run build` and review the route size table for outliers. Check
for client-only libraries pulled into large shared bundles, missing
`next/dynamic` on heavy below-the-fold widgets, any non-`next/image`
`<img>` tags, any CLS-risk (unset image dimensions, late-loading fonts
without `font-display: swap`, which `next/font` already handles unless
bypassed).

## Dependencies

Anything installed but unused? Anything duplicating functionality already
in the kit (a second animation library, a second form library)?

## Tooling

Does `npm run validate` (typecheck + lint + format check) pass clean? Is
Husky's pre-commit hook actually wired up (`.husky/pre-commit` present
and executable, `lint-staged` config in `package.json` matching real file
patterns)?

---

Summarize as a prioritized punch list (blocking / should-fix / nice-to-have),
not a wall of undifferentiated notes.
