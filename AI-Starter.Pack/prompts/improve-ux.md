# Prompt: Improve UX

Use this prompt for a UX/interaction pass on `<PAGE_OR_FLOW>`, grounded in
`docs/UX.md` rather than generic best-practice advice.

---

Walk through `<PAGE_OR_FLOW>` as a first-time user would, on both desktop
and mobile viewports, and evaluate it against `docs/UX.md`. Specifically
check:

1. **Navigation** — can the user tell where they are and how to get
   anywhere else within one glance? Is the mobile menu exposing every item
   the desktop nav has?
2. **Forms** — does every field have a visible label, inline validation
   tied to the field, and a clear loading/success/error state on submit
   (see `components/forms/contact-form.tsx` for the reference pattern)?
   Is the submit button disabled during submission?
3. **Loading and empty states** — does every async boundary have a
   real `loading.tsx` or skeleton, and does every "no data yet" case have
   deliberate copy rather than a blank container?
4. **Feedback** — are hover/focus/active/disabled states present and
   legible on every interactive element? Is color paired with icon/text
   for any status communication (never color alone)?
5. **Accessibility** — keyboard-only pass (can you reach and operate
   everything with Tab/Enter/Space alone?), screen-reader labels on
   icon-only buttons, sequential heading levels, `prefers-reduced-motion`
   respected.
6. **Friction points** — anywhere the user has to think harder than
   necessary, re-enter information, or guess what happens next.

For each issue: describe the user-facing symptom first (what a real user
would experience), then the fix, then the file(s) to change. Prioritize by
impact — a broken form beats a slightly-off animation delay.

Implement the fixes, then verify with `npm run validate` and a manual
keyboard-only pass through the affected flow.
