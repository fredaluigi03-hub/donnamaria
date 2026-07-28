# Project Checklist

## Planning

- [x] Brand facts on record — `config/site.ts` has real name, address,
      phone, description, keywords. `docs/01_Brand.md` is still the
      unfilled template (no voice/tone/positioning written down).
- [ ] Competitor Research — no audit document exists.
- [x] Wireframe / section structure — homepage order confirmed:
      `Hero → SearchWidget → OutdoorExperience → PoolShowcase →
WellnessShowcase → RoomsShowcase → Features → GalleryPreview →
Testimonials → LocationContact → Cta`.
- [ ] Content Strategy — no dedicated content/copy document; copy exists
      inline across sections.

---

## Design

- [x] Hero — scroll-scrubbed frame sequence (60 frames from `hero.mp4`),
      pinned for 160vh of scroll (~5–6 wheel notches), no exit zoom, just
      an opacity fade in the last 15% of the pin. Falls back to static
      poster + Ken Burns on mobile/reduced-motion.
- [x] Pool section — `PoolShowcase` now mounted on the homepage with
      `pool.mp4` layered on its large photo.
- [ ] `OutdoorExperience` (the other pool-video section, higher on the
      page) still uses the old autoplay/loop `BackgroundVideo` — not
      converted to scroll-scrub; explicitly out of scope this round
      (user chose "solo hero iniziale" when asked).
- [ ] Visual/responsive re-verification on the actual production domain
      — the scroll-scrub tuning (track length, zero exit-zoom) was
      confirmed via the user's description of the local dev experience,
      not a fresh screenshot pass on the live Vercel URL.

---

## Development

- [x] `components/animations/scroll-scrub-sequence.tsx` — new, canvas-
      based frame-sequence player.
- [x] `hooks/use-reduced-motion.ts` — new, hydration-safe replacement for
      `motion/react`'s `useReducedMotion()`; swapped into 11 files.
- [x] `public/images/hero-frames/` — 60 extracted JPG frames (ffmpeg,
      `fps=60/8,scale=1280:-1`, ~4.4MB total).
- [x] `tsc --noEmit` — clean, re-verified after every change this session.
- [x] `eslint` — clean on every touched file (verified via direct
      per-file invocation; the repo-wide `npm run lint` / `next build`
      lint pass was never run end-to-end in this session's sandbox due to
      timeouts, but Vercel's own build log — see Deployment below —
      confirms it's clean in the real build too).
- [~] Stray leftover file: `public/images/hero-sequence/frame-001.webp`
  — a broken animated-WebP artifact from a failed first attempt at
  frame extraction (ffmpeg produced one animated file instead of a
  still sequence). Unused, not referenced anywhere. Could not be
  deleted from this session's sandbox (filesystem delete permission
  declined); safe for the user to delete manually
  (`public/images/hero-sequence/` folder, whole thing) whenever
  convenient.

---

## Testing

- [x] TypeScript — clean after every change (`npx tsc --noEmit`).
- [x] ESLint — clean on all files touched this session.
- [ ] Lighthouse / Core Web Vitals — not run.
- [ ] Real cross-device check of the scroll-scrub pin (especially wheel
      step size on the user's actual mouse/trackpad — the 160vh/5–6-notch
      tuning is based on a documented assumption of ~100px/notch on a
      ~900px viewport, not a measured value).

---

## Deployment

- [x] Pushed to `origin/main` (commit `9b30839`) — after resolving a
      stuck `.git/index.lock` that blocked git on the user's local
      machine (see `decision.md`).
- [x] Vercel Production deploy confirmed green ("Ready", 54s build) on
      commit `9b30839`, correct domain (`donnamaria-xi.vercel.app` +
      aliases), Environment: Production.
- [ ] User to do a final hard-refresh check on the live production URL
      (not just localhost) to confirm the scroll-scrub hero and pool
      video both behave as tuned.

---

## Immediate Next Steps

1. User: verify the live production site (hard refresh) shows the tuned
   Hero scroll-scrub and the `PoolShowcase` video correctly.
2. Decide whether to fill in `docs/01_Brand.md` properly (voice, tone,
   positioning) — currently still the blank template despite the project
   being live.
3. Decide whether `OutdoorExperience`'s pool video should also move to
   scroll-scrub for consistency with Hero, or stay as an autoplay loop
   (explicitly deferred, not rejected).
4. Optional cleanup: delete `public/images/hero-sequence/` (leftover,
   unused broken-webp artifact) once the user has filesystem access to
   do so.
5. Consider installing the `frontend-design` skill (verified real,
   official Anthropic repo `anthropics/skills`) via Settings → Capabilities
   — referenced by this pack's own `CLAUDE.md` workflow but not currently
   installed. Other skill names listed there (`ui-ux-pro-max`,
   `ui-styling`, `design`, `design-system`, `brand`, `slides`) were not
   independently verified as real/legitimate this session — treat with
   caution before installing from unverified sources.

---

## Future Improvements (not blocking the above)

- `docs/01_Brand.md` — fill in for real (currently template-only).
- Confirm a real contact email and reviews URL (`config/site.ts` both
  currently use deliberate, obvious placeholders rather than plausible
  fakes, by design — not a bug).
- Re-run the full `npm run validate` (typecheck + lint + format check)
  end-to-end once, in an environment without the timeout issues this
  session's sandbox had.
