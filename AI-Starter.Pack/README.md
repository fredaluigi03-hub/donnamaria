# Premium Website Framework

This project uses:

- Next.js
- Tailwind
- Supabase
- Claude Code

Project workflow:

1. Read CLAUDE.md

2. Read SYSTEM_PROMPT.md

3. Read docs/

4. Build one section at a time

5. Review

6. Improve

---

# Starter Kit Documentation

# Agency Starter Kit

A premium, reusable Next.js foundation for high-end client web projects.
Design system, motion language, tooling, and architecture solved once, so
every new client build starts from a production-grade baseline instead of
a blank repo.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4, shadcn/ui-pattern components
- **Motion:** Motion (`motion/react`, formerly Framer Motion), GSAP + ScrollTrigger, Lenis
- **Icons:** Lucide
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase
- **Hosting:** Vercel
- **Tooling:** ESLint (flat config), Prettier, Husky + lint-staged

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + site values
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script                 | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the dev server                         |
| `npm run build`        | Production build                             |
| `npm run start`        | Serve the production build                   |
| `npm run lint`         | ESLint                                       |
| `npm run lint:fix`     | ESLint with auto-fix                         |
| `npm run format`       | Prettier — write                             |
| `npm run format:check` | Prettier — check only                        |
| `npm run typecheck`    | `tsc --noEmit`                               |
| `npm run validate`     | typecheck + lint + format check, in one shot |

Husky runs `lint-staged` on every commit (ESLint + Prettier on staged
files); run `npm run prepare` once after cloning if hooks aren't active.

## Project structure

See `docs/Architecture.md` for the full breakdown. At a glance:

```
app/            Routes, layouts, metadata files (sitemap, robots)
components/
  ui/           Design-system primitives (Button, Card, Input, Badge...)
  layout/       Header, Footer, ThemeProvider
  sections/     Page sections (Hero, Features, Cta)
  animations/   Motion primitives (FadeIn, Reveal, Parallax, Stagger...)
  forms/        Form patterns (ContactForm)
lib/            cn(), fonts, SEO metadata builder, Supabase clients
hooks/          useMediaQuery, useGsap, useScrollProgress, useMounted
types/          Shared types + Supabase generated types
config/         Site identity (site.ts) and navigation (nav.ts)
utils/          Pure helpers — formatting, shared Zod schemas
docs/           Brand, Design System, Animations, UX, SEO, Performance, Architecture
prompts/        Reusable AI-agent task prompts (new page, audits, deploy...)
```

## Documentation

Start with `CLAUDE.md` if you're an AI agent working in this repo. For
humans:

- `docs/Brand.md` — fill in per client
- `docs/Design-System.md` — typography, color, spacing, components
- `docs/Animations.md` — the motion system and its primitives
- `docs/UX.md` — interaction and accessibility conventions
- `docs/SEO.md` — metadata, sitemap, structured data
- `docs/Performance.md` — budgets and how the kit meets them
- `docs/Architecture.md` — folder structure and layering rules

## Using this as a new client project

1. `config/site.ts` — set the real name, description, URL, social links.
2. `.env.local` — real Supabase credentials and site URL.
3. `app/globals.css` — re-tune the color/radius/font tokens to the
   client's brand.
4. `docs/Brand.md` — fill in voice, positioning, and visual guidelines.
5. Build pages with `prompts/new-page.md` as the workflow, reusing
   `components/sections` and `components/ui` before adding anything new.

## Notes on package versions

Dependency versions in `package.json` reflect what was current as of
mid-2026. A few packages intentionally use `"latest"` where pinning to a
specific patch wasn't meaningful — run `npm install` and commit the
resulting `package-lock.json` on first setup, and periodically re-run
`npm outdated` / `npm update` to stay current.
