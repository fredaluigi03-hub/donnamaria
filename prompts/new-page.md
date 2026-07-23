# Prompt: New Page

Use this prompt (with Claude Code, Cursor, or any AI coding agent wired
into this repo) when adding a new route.

---

Add a new page at `<ROUTE_PATH>` titled "<PAGE_TITLE>".

Requirements:

1. Create `app/<route>/page.tsx`. Export `metadata` built via
   `buildMetadata()` from `lib/metadata.ts` — pass at minimum a `title`
   and `description` specific to this page.
2. Compose the page from existing components in `components/sections/`
   wherever the content matches an existing pattern (hero, feature grid,
   CTA, etc.) before writing a new section component. Only add a new file
   under `components/sections/` if none of the existing ones fit.
3. Wrap all content in `<Section>` (`components/ui/section.tsx`) and
   `<Container>` (`components/ui/container.tsx`) for consistent vertical
   and horizontal rhythm — do not hand-roll spacing classes.
4. Use existing `components/ui/*` primitives (Button, Card, Badge, Input,
   etc.) for all interactive/visual elements. If a needed primitive
   doesn't exist yet, add it to `components/ui/` following the existing
   `data-slot` + `cva` pattern (see `button.tsx`), not as a one-off inline
   component.
5. Add entrance animation using `components/animations/` primitives
   (`FadeIn` for most content, `Reveal` for hero-scale imagery/headlines,
   `Stagger`/`StaggerItem` for lists and grids) — see `docs/Animations.md`
   for which primitive fits which situation.
6. If the page needs a form, follow the pattern in
   `components/forms/contact-form.tsx`: React Hook Form + Zod schema
   (add to `utils/validation.ts` if reused elsewhere) + shadcn inputs.
7. Add the route to `app/sitemap.ts`'s `routes` array. If it should appear
   in navigation, add it to `mainNav` or `footerNav` in `config/nav.ts`.
8. Confirm accessibility basics: every image has meaningful `alt` text,
   every icon-only button has `aria-label`, heading levels are sequential
   (one `<h1>` per page).
9. Run `npm run validate` (typecheck + lint + format check) and fix
   anything it flags before considering the page done. No `any` types.

Report back which existing components you reused vs. what (if anything)
you had to add net-new, and why.
