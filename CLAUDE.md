## Mandatory Workflow

Before starting any frontend or UI task, Claude MUST:

1. Invoke the UX Skill.
2. Read the relevant project documentation.
3. Review the existing implementation.
4. Plan the solution before editing code.
5. Implement production-quality code.
6. Self-review the result before finishing.

# CLAUDE.md

Instructions for any AI coding agent (Claude Code, Cursor, etc.) working
in this repository. Read this before making changes.

## What this is

A reusable, production-grade Next.js starter kit that serves as the base
for every client web project this agency builds. It is not itself a
client site — no client-specific content, copy, or branding belongs here
unless explicitly told this is a real client build. When in doubt, treat
this repo as the template, not the deliverable.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
(CSS-first config) · shadcn/ui-pattern components · Motion (`motion/react`,
formerly Framer Motion) · GSAP + ScrollTrigger · Lenis (smooth scroll) ·
Lucide Icons · React Hook Form + Zod · Supabase · deployed on Vercel.

## Non-negotiable rules

1. **No `any`.** `@typescript-eslint/no-explicit-any` is set to `error`.
   If a type is genuinely unknown, model it properly or use `unknown` with
   a narrowing check — never silence the type checker.
2. **No duplicated primitives.** Before writing a new button, card, input,
   or animation, check `components/ui/` and `components/animations/` —
   reuse or extend what exists. See `docs/Architecture.md` for the
   layering rule (`ui` never imports from `sections`/`layout`).
3. **No hardcoded brand values in components.** Site name, URL, nav items,
   social links, colors, and fonts all come from `config/site.ts`,
   `config/nav.ts`, and the tokens in `app/globals.css` — never inline a
   hex code, a font family, or "Acme Inc." directly in a component.
4. **Every route needs real metadata**, built via `buildMetadata()` in
   `lib/metadata.ts` — see `docs/SEO.md`.
5. **Respect `prefers-reduced-motion`.** Every animation primitive already
   does this — don't bypass it when adding new motion.
6. **Server Components by default.** Add `"use client"` only where
   interactivity requires it, and keep the client boundary as small as
   possible — see `docs/Performance.md`.
7. **Accessibility is not optional.** Labeled form fields, `aria-label` on
   icon-only buttons, sequential heading levels, visible focus states —
   see `docs/UX.md`.
8. **Run `npm run validate`** (typecheck + lint + format check) before
   considering any change done.

## Where things live

See `docs/Architecture.md` for the full folder-by-folder breakdown. Quick
reference:

| Need to...                           | Go to...                                           |
| ------------------------------------ | -------------------------------------------------- |
| Add/change a button, card, input     | `components/ui/`                                   |
| Add a page section (hero, CTA, etc.) | `components/sections/`                             |
| Add an animation                     | `components/animations/`                           |
| Add/change site name, nav, socials   | `config/site.ts`, `config/nav.ts`                  |
| Change colors, radius, fonts         | `app/globals.css` (`@theme`)                       |
| Add a Supabase query                 | `lib/supabase/{client,server}.ts`                  |
| Add a shared validation schema       | `utils/validation.ts`                              |
| Add a new route                      | `app/<route>/page.tsx` — see `prompts/new-page.md` |

## Reusable prompts

`prompts/` contains ready-to-use task prompts for common workflows:
`new-page.md`, `improve-ui.md`, `improve-ux.md`, `audit.md`, `deploy.md`.
Prefer these over improvising equivalent instructions from scratch.

## Documentation set

`docs/Brand.md` (fill in per client), `docs/Design-System.md`,
`docs/Animations.md`, `docs/UX.md`, `docs/SEO.md`, `docs/Performance.md`,
`docs/Architecture.md`. Update the relevant doc whenever a change alters
a convention it describes — documentation drift defeats the purpose of
this being a reusable kit.

## Starting a new client project from this kit

1. Update `config/site.ts` and `.env.local` (copy from `.env.example`).
2. Fill in `docs/Brand.md` with the client's actual brand.
3. Re-tune `app/globals.css` tokens (colors, radius, fonts) to the
   client's brand — component code should not need to change.
4. Build pages using `prompts/new-page.md` as the workflow.
5. Do not scaffold placeholder/dummy business content beyond what's
   already here unless asked — this kit intentionally stops at the
   reusable foundation.
