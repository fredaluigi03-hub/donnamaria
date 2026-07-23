# Architecture

## Folder structure

```
app/                  Next.js App Router — routes, layouts, route metadata files
components/
  ui/                 Low-level, brand-agnostic primitives (Button, Card, Input...)
  layout/             Structural chrome (Header, Footer, ThemeProvider)
  sections/           Page-section building blocks (Hero, Features, Cta)
  animations/         Reusable motion primitives (FadeIn, Reveal, Parallax...)
  forms/              Form patterns (ContactForm) combining ui/ + validation
lib/                  Framework-adjacent utilities (cn, fonts, metadata, Supabase clients)
hooks/                Reusable React hooks (useMediaQuery, useGsap, useScrollProgress)
types/                Shared TypeScript types, generated Supabase types
styles/               Optional supplementary stylesheets (see styles/README.md)
public/               Static assets — images/, videos/, fonts/
config/               Site identity and navigation config (site.ts, nav.ts)
utils/                Pure helper functions (format.ts, validation.ts)
docs/                 This documentation set
prompts/              Reusable prompt templates for AI-assisted workflows
```

## Layering rules

`components/ui` must never import from `components/sections` or
`components/layout` — dependencies only flow one direction, from generic
to specific: `ui` → `layout`/`animations`/`forms` → `sections` → `app`.
This keeps `components/ui` genuinely reusable across client projects
without dragging brand-specific code along with it.

`lib/` and `utils/` hold no React — they're framework/runtime utilities
(`lib`) and pure functions (`utils`) respectively, so both are trivially
unit-testable and safe to import from Server or Client Components alike.

## Rendering model

Server Components by default (see `docs/Performance.md`). Client
Components are the exception, marked explicitly and kept as small/leaf as
possible — wrap only the interactive part of a section in a Client
Component rather than converting the whole page.

## Data layer

Supabase is the default backend. `lib/supabase/client.ts` (browser),
`lib/supabase/server.ts` (Server Components/Actions/Route Handlers), and
`lib/supabase/middleware.ts` (session refresh, wired from root
`middleware.ts`) are kept separate deliberately — mixing a browser and
server client is a common source of stale-session bugs. Generate real
types into `types/supabase.ts` per project with the Supabase CLI rather
than hand-writing them (a placeholder shape ships by default so the repo
type-checks before that's done).

## Configuration over duplication

Anything that changes per client project should live in `config/` or
`.env.local` — site name, URL, nav items, social links — never hardcoded
inside a component. `lib/metadata.ts`, `components/layout/header.tsx`,
and `components/layout/footer.tsx` all read from `config/site.ts` /
`config/nav.ts` for exactly this reason.

## Adding a new page

See `prompts/new-page.md`. In short: create the route under `app/`, pull
metadata through `buildMetadata()`, compose the page from existing
`components/sections` where possible before writing a new section
component, and wrap new sections in `<Section><Container>`.

## Tooling

TypeScript strict mode with `noUncheckedIndexedAccess` and
`noImplicitOverride` on top of `strict`; ESLint flat config
(`eslint.config.mjs`) extending `eslint-config-next`'s
`core-web-vitals` and `typescript` rule sets, with `@typescript-eslint/no-explicit-any`
raised to an error; Prettier with `prettier-plugin-tailwindcss` for class
sorting; Husky + lint-staged running both on every commit. Run
`npm run validate` (typecheck + lint + format check) before opening a PR.
