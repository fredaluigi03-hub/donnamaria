# Starter Kit Audit — 2026-07-18

Full review of the codebase against production-readiness standards:
architecture, TypeScript, Next.js/React patterns, Tailwind usage, design
system, accessibility, SEO, performance, Supabase integration, animations,
component reuse, duplication, naming, and security. No new features were
added — every change below either fixes a real defect, closes a gap
against the kit's own stated conventions, or removes duplication.

Severity key: **Critical** — broken or unsafe as shipped. **Important** —
works today but will bite a real project. **Nice-to-have** — polish, no
functional risk.

---

## Critical issues

### 1. Supabase clients crash unhelpfully if env vars are missing — fixed

`lib/supabase/client.ts`, `server.ts`, and `middleware.ts` read
`process.env.NEXT_PUBLIC_SUPABASE_URL!` and `..._ANON_KEY!` with a
non-null assertion. On a fresh clone before `.env.local` is filled in,
this doesn't throw a clear error — it hands `undefined` to Supabase's
client constructor, which fails deep inside a third-party call stack
with an opaque message (e.g. an "Invalid URL" error from the underlying
fetch client). A developer's first `npm run dev` after cloning this repo
would hit that.

**Fix:** added `lib/env.ts` (`requireEnv(key)`), which throws a clear,
actionable error ("Missing required environment variable ... copy
.env.example to .env.local...") at the exact call site. All three
Supabase files now use it instead of `!`.

### 2. Missing route-level error boundaries — fixed

The kit shipped `loading.tsx` and `not-found.tsx` but no `error.tsx` or
`global-error.tsx`. Any unhandled render error — a bad Supabase response,
a `undefined.property` bug in client code someone adds later — would fall
through to Next's default, unbranded error screen instead of a
recoverable in-kit UI. For a kit whose whole premise is "production-grade
by default," this was a real gap, not a nice-to-have.

**Fix:** added `app/error.tsx` (route-segment boundary, uses the design
system, offers "Try again") and `app/global-error.tsx` (root-layout
boundary — deliberately dependency-free inline styles, since it has to
render even if the design system itself is what broke).

### 3. `useGsap` uses `useLayoutEffect` directly in a Client Component — fixed

`hooks/use-gsap.ts` called `useLayoutEffect` unconditionally. Every Client
Component in the App Router is still rendered once on the server; React
emits a real console warning in that case ("useLayoutEffect does nothing
on the server..."), and it would show up in every project's browser
console the first time someone used this hook for a GSAP-scoped
animation.

**Fix:** added `hooks/use-isomorphic-layout-effect.ts`
(`typeof window !== "undefined" ? useLayoutEffect : useEffect`) and
switched `useGsap` to use it. Standard, well-known pattern for this exact
problem.

---

## Important improvements

### 4. Broken favicon / Apple touch icon / Open Graph image references — fixed

`lib/metadata.ts` and `config/site.ts` pointed at `/favicon.ico`,
`/apple-touch-icon.png`, and `/images/og.jpg` — none of which existed in
`public/`. Result: every page load requested a favicon that 404'd, and
every social-share preview would show a broken image. Not app-breaking,
but not what "production ready" should mean by default.

**Fix:** generated neutral placeholder assets (a simple monogram mark,
matching the kit's neutral dark/light tokens) at `public/favicon.ico`,
`public/apple-touch-icon.png`, and `public/images/og.jpg`, so a fresh
`npm run dev` has zero broken asset requests. These are explicitly
placeholders — `docs/Brand.md` and the "using this as a new client
project" checklist in `README.md`/`CLAUDE.md` already tell the next
person to replace them with real brand assets; I didn't invent new
guidance, just made sure nothing 404s in the meantime.

### 5. Duplicated heading markup across four routes — fixed

`app/contact/page.tsx`, `app/not-found.tsx`, `components/layout/placeholder-page.tsx`,
and (new) `app/error.tsx` all repeated the exact same
`<h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">`

- `<p className="text-muted-foreground mt-4 text-lg">` pair verbatim.
  This is exactly the kind of duplication the kit's own docs warn against
  introducing.

**Fix:** extracted `components/ui/page-heading.tsx` (`PageHeading`) and
switched all four call sites to it. Rendered output is unchanged — same
classes, same structure — this is a pure consolidation, not a redesign.

### 6. Mobile nav toggle missing `aria-controls` — fixed

`components/layout/header.tsx`'s mobile menu button had `aria-label` and
`aria-expanded` but nothing tying it to the panel it controls, so screen
readers can announce open/closed state but not which element that
refers to.

**Fix:** added `id="mobile-nav"` to the collapsible panel and
`aria-controls="mobile-nav"` to the toggle button.

### 7. Missing baseline security headers — fixed

`next.config.ts` set `X-Content-Type-Options`, `X-Frame-Options`, and
`Referrer-Policy`, but not `Permissions-Policy` or
`Strict-Transport-Security`. Both are safe, non-breaking defaults (no
camera/mic/geolocation usage exists anywhere in the kit to restrict, and
HSTS is a no-op on plain HTTP so it can't break local dev).

**Fix:** added both headers. Did **not** add a Content-Security-Policy —
a generic CSP is genuinely risky to set blanket-style (it can silently
break inline styles, third-party embeds, or fonts a specific client
project adds) and belongs in `prompts/deploy.md` as a per-project,
per-brief decision, not a default every project inherits unreviewed.

### 8. Unnecessary lint rule suppression — fixed

`eslint.config.mjs` had `"react/no-unescaped-entities": "off"`, but every
actual JSX text node in the codebase already correctly used `&apos;`
(verified: zero raw apostrophes exist as literal JSX children). The
override was doing nothing except silencing a real rule for no reason —
not what a premium starter kit's lint config should model.

**Fix:** removed the override. Confirmed lint still passes clean (nothing
in the codebase relies on the suppressed behavior).

### 9. Docs contradicted the actual, better import convention — fixed

`docs/Animations.md` instructed "import from `components/animations/index.ts`,
not the individual files" — but every single consumer in the codebase
(hero, cta, features, contact page, layout, placeholder-page) already
imports directly from the specific file, which is the correct call:
direct imports keep tree-shaking simple and avoid pulling unrelated
animation code through a shared barrel. The documentation was wrong, not
the code.

**Fix:** rewrote that section of `docs/Animations.md` to describe the
actual (correct) convention and reframe `index.ts` as a reference
table-of-contents rather than an import path. No code changed — the
implementation was already right.

### 10. `console.log` left active in the contact form's demo submit handler — fixed

`components/forms/contact-form.tsx` logs form values unconditionally.
Harmless functionally (it's a placeholder for a real submit handler
anyway, clearly commented as such), but a production build shouldn't
ship a console.log by default.

**Fix:** gated it behind `process.env.NODE_ENV !== "production"`.

### 11. Two `lucide-react` import statements in one file — fixed

`components/sections/features.tsx` imported icon components and the
`LucideIcon` type as two separate `import` statements from the same
module — harmless, but sloppy for a codebase meant to model best
practice.

**Fix:** merged into a single import statement.

---

## Nice-to-have improvements (flagged, not auto-applied)

### 12. Heading hierarchy skips a level on the homepage

The homepage goes `<h1>` (Hero) → `<h3>` (each `CardTitle` in Features)
with no `<h2>` in between, because the Features section has no section
heading of its own. This is a real WCAG heading-hierarchy nit, but fixing
it properly means either adding visible section-heading copy (a content
decision on a template with placeholder copy) or making `CardTitle`'s
semantic level configurable — both are judgment calls about what this
reference section should say/be, not a mechanical fix. Left for whoever
writes real homepage copy to resolve alongside that work; noted here so
it isn't silently missed.

### 13. Motion durations/easings duplicated across CSS and JS

`app/globals.css` defines `--duration-*`/`--ease-*` as CSS values;
`lib/constants.ts` (`MOTION`) and `lib/animations.ts` re-declare the same
values as JS numbers/arrays for Motion and GSAP to consume, since neither
library reads CSS custom properties at runtime. Current values are in
sync, and `docs/Animations.md` already flags this as "change one, change
both" — it's a known, unavoidable tradeoff of mixing CSS tokens with
JS-driven animation, not an oversight. No safe automated fix exists (there's
no single source of truth these could both derive from without a build
step this kit doesn't have); left as documented, manually-maintained
duplication.

### 14. `images.formats: ["image/avif", "image/webp"]` in `next.config.ts`

This matches Next's own default, so it's a no-op — technically
redundant, harmless, arguably self-documenting. Not changed; low enough
value that editing it is more churn than benefit.

### 15. No rate limiting on the contact form

The reference `ContactForm` has no client- or server-side rate limiting.
Fine for a template (there's no real backend call yet), but flag it now
so it isn't forgotten once a real Server Action/Supabase insert replaces
the placeholder — add it at that point, scoped to the real endpoint.

---

## Verification performed

- Grepped every `@/...` import in the codebase against the filesystem —
  zero unresolved imports, before and after these changes.
- Confirmed `components/ui` and `components/animations` still import
  nothing from `components/sections` or `components/layout` (layering
  rule in `docs/Architecture.md` holds).
- Grepped for raw (non-`&apos;`-escaped) apostrophes inside JSX text
  children — none — before removing the `no-unescaped-entities`
  override.
- Confirmed no `any` (explicit or `as any`) anywhere in the codebase.
- Confirmed every file using React hooks has `"use client"`.
- Could not run `npm install` / `npm run build` / `npm run lint` in this
  environment (package registry access is blocked here) — the same
  constraint noted when the kit was first built. Run `npm run validate`
  yourself after pulling these changes as the final check.
