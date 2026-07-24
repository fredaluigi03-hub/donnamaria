# Project Checklist

## Planning

- [x] Brand Analysis — full Design Research Document produced from real assets (`assets/brand.md`, logo, photos, video tour).
- [ ] Competitor Research — inspiration extracted from premium brands (Apple, Nike, Technogym, Tesla) as design references, plus a direct look at goldsgym.it that drove the content-consolidation pass. No dedicated local-gym competitor audit document exists.
- [x] Wireframe — the shipped, live section structure supersedes the earlier "Boutique Precision" wireframe (see `AI-Starter.Pack/handoffs/005-session-handoff.md` for current order).
- [ ] Content Strategy — no dedicated content/copy document exists; copy decisions have been made inline, session by session (brand-name fixes, real testimonials, pricing disclaimers).

---

## Design

- [x] Hero — real 2048×1152 photo, red/black vignette, floating stat card removed after it obscured the cardio equipment.
- [x] Navigation — `#sala`/"Sala Pesi" link removed; "Risultati" (`#risultati`) added, pointing to the new PrimaDopo section. Mobile hamburger menu status still not re-verified visually this session (no browser/visual tooling available in this environment).
- [x] Sections — live order now: Nav, Hero, Equipment, Sedi, Programs, PrimaDopo, Visit, FAQ, Testimonials, Footer. About removed entirely; PrimaDopo added.
- [x] Footer — "Sala pesi" Club-list entry removed; "Risultati" added. P.IVA placeholder status still unconfirmed (out of scope this session).
- [ ] Mobile Design — code is responsive-by-construction (same Tailwind breakpoint patterns as the rest of the file) but **not visually verified this session** — no browser/screenshot tool was available; only `tsc`/`eslint` were run. Recommend an explicit Playwright/visual pass next session before calling this done.
- [x] Coverflow asymmetric restyle — done 2026-07-23: fan-to-the-right layout (active card anchored left, others cascade right via translateX/Y + scale + rotate, clipped by `overflow-hidden`), applied consistently to Sedi, Programs, and the new PrimaDopo.

---

## Development

- [x] Components — `Coverflow` (custom-built) is now shared across Sedi, Programs, and PrimaDopo, all using the new asymmetric-fan math. `Hero3D`/`WeightRoom3D`/planned `SpecBadge3D` remain obsolete — zero 3D still ships despite the libraries being installed.
- [~] Forms — Contact form UI exists; not wired to any real backend or email service.
- [x] Animations — CSS transitions/Framer Motion in active use; `prefers-reduced-motion` respected via a CSS media query in `src/styles.css`, now also covering the new `.coverflow-card` transition.
- [ ] SEO — meta/OG tags correct (real brand name fixed); `schema.org`, sitemap, robots.txt not added.
- [~] Performance — real photos re-encoded/optimized (JPEG, progressive, ~85% quality) as they're added; a full performance/Lighthouse pass has not been run.
- [~] Accessibility — `prefers-reduced-motion` respected; focus-visible/skip-link/keyboard-parity audit not done.
- [x] Wire the 14 previously-unused image constants — done, except `pdUmberto1/2/3` (3 of the 14), which remain intentionally unused per the user's explicit choice to ship PrimaDopo with only Carmine and Emilio for now.
- [x] Split `Sedi`'s photo array into separate Pratola/Montemiletto sets; `hasMedia: false` placeholder removed entirely (replaced with per-location `hasVideo`/`bar`/`photos` fields); bar/retail copy added per location; video toggle now conditionally rendered and restricted to Pratola Serra only.
- [x] Update `Visit`: background swapped to hero photo; free-visit/free-trial-day copy added.
- [x] Remove `About` (`id="sala"`) and its Nav/Footer references — confirmed via grep, no dangling `#sala` anchors remain.
- [x] Build the new `PrimaDopo` component (Carmine + Emilio; Umberto intentionally deferred) and add its Nav/Footer link ("Risultati").
- [x] Reorder `Index()` per the target order above.

---

## Testing

- [x] TypeScript — `tsc --noEmit` clean, re-verified 2026-07-23 after all changes.
- [x] ESLint — `eslint .` re-run 2026-07-23: clean relative to everything touched this session (`index.tsx`, `styles.css`). Pre-existing issues elsewhere (`AI-Starter.Pack/config/rooms.ts`, `src/routes/__root.tsx` prettier formatting, a few `src/components/ui/*` fast-refresh warnings) are untouched, out of scope, and were not introduced this session.
- [ ] Desktop/Mobile visual verification — **still not re-run**; this session's environment has no browser/screenshot tooling, so all verification was `tsc`/`eslint` plus manual code read-through. Flag this explicitly to the user; a visual pass (ideally Playwright, per past sessions' practice) is recommended before treating this batch as fully "done" per `CLAUDE.md`'s own completion checklist.
- [ ] Lighthouse — not yet run.
- [ ] Production build — cannot be verified in this sandboxed environment (`@rolldown/binding-linux-x64-gnu` native-binding error, environment-only, unrelated to project code).

---

## Deployment

- [ ] Production Build — not verifiable in this environment; relies on `tsc`/`eslint`/visual checks instead.
- [ ] Domain — not configured/verified as part of this work.
- [ ] Analytics — not configured.
- [ ] Monitoring — not configured.

---

## Immediate Next Steps (see handoff 005 for full detail)

The handoff-004 content/UX batch (items 1–9 below) is **done as of 2026-07-23**. What's next:

1. Get Montemiletto's exact street address so its new Google Maps link can be precise instead of a city-level search.
2. Get a real visual/responsive verification pass done (no browser tooling was available this session) — desktop and mobile, all sections, especially the new asymmetric Coverflow fan, the new ambient section backdrops, and PrimaDopo.
3. Get Umberto's caption/story from the user, then add him as a third PrimaDopo tab.
4. Get explicit owner sign-off (yes/no) on any money-back-guarantee language before it goes anywhere near the live site, even softened.
5. **Scope and begin the "Quiet Luxury" visual redesign** (approved 2026-07-23, not started) — this is now the largest single piece of pending work: palette rework in `src/styles.css`, Hero and section visual treatment, photography direction, revisiting Coverflow's shadow/color treatment. Recommend exploring multiple concepts and comparing them per `CLAUDE.md`'s own process before implementing, same as the (abandoned) Boutique Precision spec did.
6. Confirm real Programmi/Membership pricing with the gym owner; remove the "Prezzi indicativi da confermare" disclaimer once confirmed.

Done this session (for reference): wired the 14 image constants (except Umberto's, by choice); restyled Coverflow to the asymmetric fan across all 3 usages; split Sedi's Pratola/Montemiletto photos and copy, restricted video to Pratola; updated Visit's background and copy; removed About and its nav/footer links; built PrimaDopo (Carmine + Emilio); reordered `Index()`; added the Risultati nav/footer link; added per-location Google Maps links; added ambient photo/light backdrops to Equipment/Sedi/Programs/PrimaDopo/FAQ; fixed inaccurate "parquet" flooring copy; ran `tsc`/`eslint` clean throughout.

---

## Future Improvements (not blocking the above)

- Wire the Contact form to a real backend (server function + email/CRM).
- Mobile navigation menu audit (status unconfirmed since handoff 003).
- GDPR/legal: Privacy Policy, Cookie Policy, consent checkbox, real P.IVA in the footer.
- `schema.org` structured data, sitemap.xml, robots.txt, dedicated OG image.
- Analytics + conversion tracking.
- Invoke this project's own installed skills (`frontend-design`, `ui-ux-pro-max`, `ponytail`, `context7`) per `CLAUDE.md`'s workflow — still not available/used across the last three implementation sessions (this one included; they were unavailable in this environment, reported to the user rather than worked around). At minimum, `frontend-design`/`ui-ux-pro-max` should be invoked before the Quiet Luxury redesign starts, if available in a future session.
- Dedicated per-location pages (Pratola Serra / Montemiletto) for local SEO — deliberately out of scope for now.
