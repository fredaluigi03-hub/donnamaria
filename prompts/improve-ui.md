# Prompt: Improve UI

Use this prompt to give a targeted visual/UI pass on `<PAGE_OR_COMPONENT>`,
grounded in this repo's actual design system rather than generic taste.

---

Review `<PAGE_OR_COMPONENT>` against `docs/Design-System.md` and propose
concrete UI improvements. For each issue found:

1. Name the specific problem (inconsistent spacing, a raw color instead
   of a semantic token, a button styled ad-hoc instead of using
   `components/ui/button.tsx`'s variants, insufficient contrast, a broken
   responsive breakpoint, etc.) — not a vague "make it feel more premium."
2. Point to the exact file and line.
3. Propose a fix that uses existing tokens/components
   (`app/globals.css` custom properties, `components/ui/*` primitives,
   `<Section>`/`<Container>`) rather than introducing new one-off values.
   Only propose a new token or component if the existing system genuinely
   has no answer for this case — and say so explicitly if that's why.
4. If the fix touches shared tokens or a shared primitive (e.g. changing
   `--radius` or `Card`'s padding), call out every other place in the
   codebase that consumes it, since the change will cascade.

Do not:

- Introduce a new UI library or duplicate what `components/ui/` already
  provides.
- Hardcode colors, spacing, or radii that bypass the token system.
- Change brand-level decisions (palette, typeface) without flagging it as
  a brand question for `docs/Brand.md`, not a pure UI fix.

After the review, implement the fixes, run `npm run lint` and
`npm run typecheck`, and summarize what changed and why in plain
language suitable for a non-technical stakeholder to approve.
