# Design Specification — Elite Fitness Club ("Boutique Precision")

> Archived from Claude's plan-mode working file into permanent project storage as part of the Design Specification milestone. See `AI-Starter.Pack/handoffs/003-design-specification.md` for the session handoff and `AI-Starter.Pack/memory/decision.md` for the decision trail that led here. This document itself is unchanged from the version reviewed and approved by the user.

## Preamble — tooling/process transparency

Per instruction, every unavailable tool/skill is reported rather than silently skipped:
- **"Ponytail"**: confirmed unavailable a fourth time across sessions (name search, semantic search, and a live `DesignSync.list_projects` call returning zero linked claude.ai design-system projects for this account). Not used. No further checks will be run for it going forward unless something changes — it has been diligently ruled out. *(Resolved after this document was written: "Ponytail" is the name of Phase 3 in this starter pack's own `AI-Starter.Pack/CLAUDE.md` workflow — "reuse before creating" — not a tool. See the handoff's Notes.)*
- **`ui-ux-pro-max` skill's structured database** (`search.py`): still not materialized on disk in this environment (confirmed in an earlier session). Not used again this round.
- **Playwright**: not re-invoked. No code has changed since the last extensive screenshot pass earlier in this project, so that visual knowledge remains current; re-screenshotting an unchanged site would add no new information. Will be used as originally intended once implementation actually begins (visual verification of the new spec against the live build).
- **Used this round**: the `design-system` skill (three-layer token architecture — Primitive → Semantic → Component — applied directly to Section 5 below, and it matches the layering already implicit in `styles.css`'s `:root` + `@theme inline` structure, so this is a formalization, not a new pattern); Context7 against `/pmndrs/react-three-fiber` (verified `frameloop="demand"` + manual `invalidate()` as the current, correct way to make the one remaining 3D element interaction-driven rather than continuously rendering — this directly shaped Section 7's performance rule and is a concrete improvement over the always-on render loop the existing `Hero3D`/`WeightRoom3D` scenes use today).
- Project memory: checked, still empty (nothing was saved from prior sessions' offer). Will propose saving durable facts from this whole effort once implementation starts, not before.

This document assumes **Concept C — "Boutique Precision"** (previous session) as fixed. It is not re-litigated here. Where this deeper pass surfaced a genuine inconsistency in that earlier roadmap, it is corrected explicitly below (see Section 7's Hero decision) rather than silently carried forward — per the instruction to keep iterating rather than accept the first version.

---

# 1. Design Philosophy

**Design principles**
1. Real material leads; invented material is rare and earns its place. Every photo/video is real; 3D is reduced to exactly one signature moment.
2. One idea per screen (Apple). No section carries two competing messages.
3. Precision over decoration. Every visual effect must map to a real material property (reflection, brushed metal, engineered surface) — nothing ornamental for its own sake.
4. The red accent is a scalpel, not a bucket. Never a fill, never a background, always a single deliberate mark per screen (Nothing/Porsche discipline).
5. Whitespace is a feature, not empty space (Aesop/Apple) — the light background is not "default," it's load-bearing.
6. Motion explains, it doesn't perform. Every animation reveals hierarchy, state, or causality (CLAUDE.md's existing rule, carried forward unchanged).

**Emotional goal**: "This gym was designed, not decorated" — aspirational precision, earned through visible engineering (real Technogym/Lacertosus credibility) rather than claimed through mood lighting.

**Brand personality**: Quiet engineered luxury. Confidence through precision, not aggression — distinct from the bull-mark's raw aggression, which is present (real logo, kept as-is) but not amplified stylistically.

**Visual keywords**: engineered · daylight · reflective · condensed · disciplined red · brushed metal · negative space · configurator · documentary-honest · Mediterranean light · precise · unhurried.

**UX principles**: real material over invented abstraction; disclosure through interaction (hover/tap/focus reveal), not upfront clutter; accessible by default (light backgrounds make contrast easier, not an afterthought); motion as meaning.

---

# 2. Information Architecture

**Sitemap** — remains a single route (`/`, `src/routes/index.tsx`) per CLAUDE.md's explicit "stays one-page landing until told otherwise." Anchor sections, in final order:

`#top` (Hero) → `#sala` (Sala Pesi) → `#attrezzature` (reframed: **Spec Sheet** — equipment credibility) → `#sedi` (Locations) → `#staff` (Trainers) → `#nutrizionista` → Reviews (no id, decorative/social-proof, doesn't need nav entry) → `#contatti` (Contact) → Footer.

Previously-tracked future routes (dedicated per-location pages, legal pages for GDPR) remain **out of scope for this spec** — they are separate route additions, not part of this single-page redesign, and don't block it.

**Navigation hierarchy**: `Sala Pesi / Attrezzature / Sedi / Staff / Nutrizionista / Contatti` — unchanged set of links, just retinted. The known mobile-nav gap (no hamburger, CTA hidden below `sm`) is **still open and still not part of this visual spec** — flagged again so it isn't lost, not silently re-scoped in.

**User flows**:
- Primary: Hero CTA → `#contatti` → form (still not wired to a backend — separate, already-tracked item).
- Secondary: Nutrizionista CTA → `#contatti` (shares the same form; the existing "Interesse" field already routes intent).
- Tertiary (not yet built): phone tap (`tel:` link, already present), WhatsApp (still absent, tracked separately).

**Scroll narrative** (this is the concept-C-specific decision, replacing Concept A's "continuous documentary scrub" which this document does not use): a sequence of discrete, pinned, one-idea-per-screen reveals — Hero (brand statement) → Sala Pesi (space credibility, real photo) → Spec Sheet (equipment credibility, the one 3D moment) → Sedi → Staff → Nutrizionista → Reviews → Contact. No section attempts to carry the literal camera path of the tour video; the video is used once, deliberately, not as connective tissue between every section.

**CTA strategy**: one primary CTA repeated verbatim ("Prenota una prova gratuita"), never duplicated within the same screen (existing CLAUDE.md rule, unchanged). Micro-CTAs (call, "Richiedi una consulenza") are visually subordinate — smaller, unfilled, never competing for the same visual weight as the primary.

---

# 3. Wireframe Blueprint

Consistent sub-structure per section. Only deltas from the current implementation are described in detail; unchanged structural facts (already correct) are stated briefly.

### Nav
- **Purpose**: orientation + persistent primary CTA. **Hierarchy**: logo > links > CTA. **Layout**: unchanged fixed header, backdrop-blur. **Interaction goal**: real logo replaces the invented "E" mark.
- **Desktop**: unchanged layout, retinted (light bg, near-black text, red-on-hover underline instead of green).
- **Mobile**: **unresolved gap, unchanged by this spec** — links and CTA remain hidden below `md`/`sm` respectively until the separately-tracked hamburger-menu work happens. This wireframe does not silently fix it, but does not need to duplicate that already-open item either.

### Hero (`#top`)
- **Purpose**: brand statement — first, most important "one idea." **Hierarchy**: kicker → headline → one line of support copy → single CTA → trust metrics.
- **Layout**: full-bleed real photo (recommend the branded-wall frame, product-graded — see Section 11) replaces the current 3D barbell canvas entirely (see Section 7 for why). Text sits over a controlled-contrast scrim, not a dark cinematic gradient.
- **Spacing/alignment**: unchanged grid (content anchored left, `max-w-7xl`), same vertical rhythm.
- **Responsive**: same letterbox-reveal choreography (already built, GSAP), recolored — bars go near-black instead of matching `--background`'s prior near-black-on-black (now near-black bars over a light scene, higher contrast, more dramatic than before, not less).
- **Interaction goals**: mask-line text reveal (kept, retinted), magnetic CTA (kept as-is, retinted), mouse-parallax on the photo layer (kept — parallax works on a photo exactly as it did on the 3D canvas, no loss of the effect already built).
- **Mobile**: photo crops to portrait-safe framing (needs an explicit mobile crop, not just `object-cover` on the same frame — flagged in Section 11). Letterbox bars scale down proportionally as they already do.

### Sala Pesi (`#sala`)
- **Purpose**: space credibility — "the real place is better than expected." **Hierarchy**: headline+copy (kept) → real photo (kept, `weightRoom` asset stays) → stat strip (kept, `Counter` unchanged).
- **Layout delta**: the 3D showcase card ("Allenati in 3D") is **removed** — its abstract figure contradicts Concept C's "3D is rare, one signature moment" rule (that moment now lives in Spec Sheet instead). Replace the removed card's slot with a second real photo (e.g. `sala-02` or a cropped frame from the tour video at the branded-wall/rack moment) in the same aspect-ratio card frame already built — same layout shape, real content instead of a canvas.
- **Responsive**: identical breakpoint behavior to today (two-column desktop, stacked mobile) — only the middle card's content changes, not its structure.
- **Interaction goals**: `whileInView` reveal (kept), GSAP counter-pulse (kept).

### Spec Sheet (`#attrezzature`, reframed from "Attrezzature")
- **Purpose**: equipment credibility as verifiable fact, not marketing adjective — "Technogym, Lacertosus," not "macchinari di ultima generazione." **Hierarchy**: headline → the one 3D signature moment (bull-mark badge) as the section's visual anchor → a configurator-style spec list (real brand names, hover/tap reveal detail) replacing the current photo-tile grid's generic tags.
- **Layout**: existing 4-card `TiltCard` grid is retired as the primary device (see Section 4) — replaced by a two-part layout: a left/centered 3D badge stage, and a right/below list of real equipment credibility rows (Technogym machines, Lacertosus rig/plates/flooring), each row revealing a macro real-photo crop on hover/focus.
- **Spacing/alignment**: more generous than today's dense 4-up grid — Concept C's "whitespace is load-bearing" principle applies most visibly here, since this section currently is the most cramped in the live site.
- **Interaction goals**: hover **and** focus (keyboard-operable, not hover-only — a genuine accessibility fix, see Section 8) reveals the macro credibility photo; the badge responds to scroll position with a precise, non-autonomous rotation (see Section 7).
- **Mobile**: badge stage becomes a fixed-frame (no scroll-tied rotation cost on small screens — see Section 7's mobile fallback), spec rows stack, hover-reveal becomes tap-reveal.

### Sedi (`#sedi`)
- **Purpose/layout/responsive**: unchanged — the two-card location layout with expandable hours is already good and already accessible (click-to-expand). Only retinted.

### Staff (`#staff`)
- **Purpose/layout**: unchanged structurally. Cards keep the grayscale→color hover treatment (works identically on a light background). Retinted only.

### Nutrizionista (`#nutrizionista`)
- **Purpose/layout**: unchanged — the honest placeholder-frame pattern built last session is exactly right for Concept C's "real material, no invented substitute" principle and needs no redesign, only retinting (dashed border, camera icon, caption — all read fine on a light background, arguably better, since a dashed border reads more clearly against light than dark).

### Reviews
- **Purpose/layout**: unchanged marquee — retinted only. No structural change.

### Contact (`#contatti`)
- **Purpose/layout**: unchanged two-column form — retinted only. The "Interesse" field added last session stays. Not wired to a real backend yet — still a separate, already-tracked item, not part of this visual spec.

### Footer
- **Purpose/layout**: unchanged, retinted. The `P.IVA — da inserire` placeholder remains a known, separately-tracked gap.

---

# 4. Component Inventory

| Component | File | Verdict | Why |
|---|---|---|---|
| `Nav`, `Metric`, `MaskLine` | `index.tsx` | Reusable | Structure is sound; only color tokens change. |
| `MagneticButton` | `components/MagneticButton.tsx` | Reusable | Already extracted/shared last session; GSAP `quickTo` logic is palette-agnostic. |
| `Counter` | `components/Counter.tsx` | Reusable | Pure logic component, no color coupling. |
| `Hero3D` | `components/Hero3D.tsx` | **Remove** | Concept C moves the Hero background to a real photo; keeping a full ambient 3D scene here directly contradicts "3D is rare, one signature moment" (see Section 7). |
| `WeightRoom3D` | `components/WeightRoom3D.tsx` | **Remove** | Same reasoning — the abstract silhouette was always a stand-in for real content that now exists; its job is superseded by the real photo swap in Sala Pesi. |
| *(new)* `SpecBadge3D` | `components/SpecBadge3D.tsx` | **Create new** | The one signature 3D moment (Section 7) — a small, `frameloop="demand"`-driven bull-mark badge render, not a scene. |
| `TiltCard` | `index.tsx` | **Needs redesign** | The mouse-tilt mechanic itself is fine and stays; its role changes from "generic photo tile" to "credibility row with hover/focus-reveal macro shot" (Section 3). |
| `WeightRoom`, `Equipment`, `Nutrizionista`, `Trainers`, `Locations`, `Contact`, `Footer`, `ContactLine`, `SocialPill`, `FormField` | `index.tsx` | Reusable (retint only) | Structurally sound per Section 3; no redesign needed beyond tokens. |
| `useReducedMotion` | `hooks/use-reduced-motion.ts` | Reusable | Palette-agnostic, extends naturally to `SpecBadge3D`. |
| shadcn `ui/*` (accordion, dialog, carousel, chart, etc.) | `components/ui/*` | **No change** (still unused) | Confirmed in the original site analysis: none of these are wired into the page. Nothing in this spec requires adding one — no justification to introduce new UI primitives where the existing hand-built sections already work. |

---

# 5. Design System

Applying the `design-system` skill's three-layer architecture — this **formalizes**, not replaces, the layering `styles.css` already has (`:root` primitives → `@theme inline` semantic aliases).

**Color system**

| Layer | Token | Value source | Note |
|---|---|---|---|
| Primitive | `--color-ink-950` | sampled near-black from real photos/logo bg | replaces current `oklch(0.14 0.01 240)` |
| Primitive | `--color-paper-50` | warm engineering off-white | the concept's biggest single change — background flips from dark to light |
| Primitive | `--color-brand-red-600` | **sampled directly from `assets/logo/logo.jpg`** — not invented, not any of the photo's incidental reds (poster/window-frame/building) | canonical brand accent |
| Primitive | `--color-steel-*` | greys sampled from chrome/rubber photos | for borders, secondary text |
| Semantic | `--background`, `--foreground`, `--surface`, `--border` | alias primitives | mirrors existing `--color-background` etc. naming already in `styles.css` |
| Semantic | `--accent` (was `--elite`) | `--color-brand-red-600` | rename reflects the new brand truth — `--elite` as a name can stay if churn should be minimized, but its *value* must change |
| Component | `--button-cta-bg`, `--button-cta-hover`, `--badge-glow` | derived from semantic accent | scoped, not raw hex, per the skill's "never hardcode" rule |

**Typography scale**: keep `font-display` (Bebas Neue — already licensed/loaded, bold condensed, exactly what a Porsche/Technogym-style spec sheet wants; no new font needed, consistent with CLAUDE.md's "don't add libraries without cause") and `font-sans` (Inter, body). Formalize the scale already implicit in the code (`text-5xl`/`text-7xl` display, `text-lg` body, `text-xs` kicker) as named steps: `display-xl` (hero), `display-lg` (section headline), `body-lg`, `body`, `caption`.

**Spacing scale**: Tailwind's default scale, formalized section rhythm at `py-32` (kept) with **increased internal card/row spacing** in the new Spec Sheet section specifically (Section 3's whitespace correction) — the one place spacing actually needs to grow, not just be renamed.

**Border radius**: keep existing `rounded-lg` (cards) / `rounded-full` (pills/CTAs) — no change, already consistent.

**Shadows/elevation**: today's shadows are glow-based, tuned for a black canvas (`--elite-glow` as a light-emission effect). On a light background this **must be redefined**, not merely recolored: soft neutral drop-shadows for elevation (cards lifting off white), with the red glow reserved *only* for the primary CTA's hover state — never ambient.

**Iconography**: `lucide-react` stays (already in use, zero new dependency). Icon-to-section mapping from last session (Dumbbell/Layers/Activity/Zap for equipment, Utensils/ClipboardList/TrendingUp for nutrition) carries over unchanged — icons are palette-agnostic via `currentColor`.

**Grids/containers**: `max-w-7xl` container, 12-column grids (Hero, Sala Pesi, Nutrizionista) — unchanged, already consistent, reused for the new Spec Sheet layout too.

**Breakpoints**: Tailwind defaults (`sm/md/lg/xl`) — unchanged, no new breakpoint needed.

---

# 6. Motion System

| Motion type | Where | Treatment |
|---|---|---|
| Page-load / Hero intro | `Hero()` in `index.tsx` | Keep the existing GSAP timeline architecture (letterbox reveal, mask-line stagger, kicker/CTA/metric stagger) — retint only, timing unchanged. |
| Section transitions | every section | Keep existing Framer Motion `whileInView` pattern (already consistent across the codebase) — no new mechanism introduced. |
| Hover behaviours | `MagneticButton`, `TiltCard`→Spec rows, Trainers cards | Keep magnetic-pull and tilt mechanics; **add** a focus-equivalent for the new Spec Sheet hover-reveal (Section 8 — accessibility, not decoration). |
| Loading states | Contact form submit | Still blocked on the separately-tracked "wire the form to a real backend" item — out of scope here, but the *visual* loading/success state (already partially built: "✓ Ti richiamiamo entro 24h") should be restyled to the new palette when that work happens, not before. |
| Reveal animations | `MaskLine`, section headlines | Unchanged mechanism, retinted. |
| Scroll animations | Hero parallax, ScrollTrigger | Keep GSAP ScrollTrigger scrub for the Hero's photo-layer parallax (works identically on a photo layer as it did on the 3D canvas — same code path, different content). |
| GSAP usage | Hero timeline, ScrollTrigger parallax, Counter pulse | Unchanged architecture; only the removed `Hero3D`/`WeightRoom3D` mouse-parallax `quickTo` calls (which targeted the canvas layer) are deleted along with those components. |
| Framer Motion usage | all `whileInView` reveals | Unchanged. |
| Three.js usage | **only** `SpecBadge3D` | New, minimal, `frameloop="demand"` (Section 7) — the only Three.js code path that survives/is created in this spec. |

---

# 7. 3D Strategy

**Correction from the previous roadmap document**: that document listed "recalibrate the existing Hero3D/WeightRoom3D lighting" as a Phase 2 step. Having now built the full wireframe/motion spec, that instruction is inconsistent with Concept C's own stated principle ("3D is small and precise... one signature moment") — keeping two recolored 3D scenes *plus* a new badge would be three 3D presences, not one. **This document corrects that**: both existing 3D scenes are retired outright (Section 4), and the one signature 3D moment is the new `SpecBadge3D`, placed in the Spec Sheet section only.

**Where 3D should exist**: exactly one place — the Spec Sheet (`#attrezzature`) section, as a small rotating brushed-metal/anodized render of the bull-mark badge.

**Where it should not exist**: Hero (real photo/video carries the brand statement), Sala Pesi (real photo replaces the abstract figure), Nutrizionista/Trainers/Reviews/Contact (no 3D anywhere near these — they're honest-placeholder or real-photo sections by design).

**Interaction rules**: the badge rotates in response to scroll progress through its section and to pointer position — not autonomously. This is a deliberate personality choice (configurator-precise, not ambient-decorative) *and* the performance-correct choice: per the verified current React Three Fiber API, `<Canvas frameloop="demand">` renders only when `invalidate()` is called, so a scroll/pointer-driven (not auto-spinning) badge can sit idle at zero render cost between interactions — a genuine improvement over the existing `Hero3D`/`WeightRoom3D` scenes, which use the default `frameloop="always"` and render every frame forever once mounted (a cost this spec explicitly removes, not just relocates).

**Performance budget**: target parity with `WeightRoom3D`'s measured real footprint from last session (~3.4 KB raw JS for the component itself, sharing the existing `@react-three/drei`+`three` chunk already loaded for other purposes if any 3D remains elsewhere — though per this spec, `SpecBadge3D` is the *only* 3D on the page, so that shared chunk is now loaded for exactly one small purpose, which should be weighed honestly in Section 9 rather than assumed free).

**Graceful degradation**: static rendered image of the same badge (or the real logo mark itself) when `prefers-reduced-motion` is set or before the section scrolls into view — identical fallback discipline to the existing `Hero3D`/`WeightRoom3D` pattern, reused, not reinvented.

**Mobile fallback**: interactive by default (it's a single small scene, not the whole-viewport background scene Hero3D was) — but performance-test on a representative low-end Android device before committing; if GPU cost is measurable, fall back to the same static image used for reduced-motion, gated by a simple device-capability or viewport-size check rather than assuming mobile always needs a lesser experience.

---

# 8. Accessibility

- **Color contrast**: light theme is a net accessibility *improvement* over today's dark theme (near-black text on off-white clears WCAG AA more easily than white-on-near-black with a glow effect). Explicit targets: body text ≥ 4.5:1, large/display text ≥ 3:1. The red accent must be contrast-checked against **both** the paper background and any dark surfaces it appears on (cards, badges) — not assumed safe just because it's "the brand color."
- **Keyboard navigation**: every interactive element (nav links, both CTAs, form fields, Sedi's expand/collapse, and — new in this spec — the Spec Sheet's hover-reveal rows) must be reachable and operable via keyboard. The Spec Sheet reveal is the one **new** interaction pattern in this document, so it is the one place accessibility must be designed in from the start, not retrofitted: hover reveal needs a `:focus-visible` equivalent, not hover-only.
- **Reduced motion**: existing `useReducedMotion` hook and global CSS kill-switch (`styles.css`) extend automatically to everything in this spec, including `SpecBadge3D` — no new mechanism needed, just correct usage at each new call site.
- **Semantic structure**: single `h1` (Hero), `h2` per major section (already mostly followed — verify during implementation, not assumed), landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`) should be audited — current markup should be checked for a `<main>` wrapper around the section stack, which is easy to miss and currently unverified. A skip-to-content link is currently absent and should be added — small, high-value, previously unflagged gap.
- **Screen readers**: the Hero's real photo/video needs a meaningful `alt`/`aria-label` (not "hero background"); the `SpecBadge3D` canvas needs an `aria-label` describing it as decorative-but-branded, with `aria-hidden` reserved for genuinely decorative-only elements (consistent with how `hero-grain`/`hero-vignette` are already marked `pointer-events-none` today, though those specific dark-theme-only decorative layers themselves are retired along with the dark theme).
- **Focus management**: today's focus styling relies mostly on browser defaults. This spec requires an explicit `:focus-visible` treatment using the new red accent (a legitimate, disciplined use of red — a focus ring is exactly the kind of single, momentary, purposeful mark the "red as scalpel" principle describes) rather than continuing to rely on unstyled defaults.

---

# 9. Performance Strategy

- **Bundle impact**: removing two 3D scenes and adding one small one is close to a wash on JS weight, but the *number of concurrently mounted WebGL contexts* drops from "up to 2" (Hero3D + WeightRoom3D, per last session's own viewport-gating work) to "at most 1" (SpecBadge3D only) — a real runtime cost reduction, not just a code-size one.
- **Lazy loading**: `SpecBadge3D` follows the exact `lazy()` + `Suspense` + viewport-gated mount pattern already proven in `WeightRoom3D` — reused, not reinvented.
- **Image optimization**: the 6 real photos are currently raw PNGs (confirmed in the research phase) — convert to responsive WebP/AVIF with explicit `width`/`height` (avoids CLS) before they carry as much visual weight as this spec asks them to. This is a bigger deal in Concept C than it would have been in the darker, 3D-heavier alternatives, because photography now carries more of the page's total weight.
- **Video optimization**: `tour-01.mp4` is ~3.9 MB for 12.8s at portrait resolution — reasonable for a single deliberate moment (Section 3's Hero/branded-wall use), but should ship with `preload="metadata"` and a static poster frame, not autoplay-preload the full file if it's not the very first thing painted.
- **Three.js optimization**: `frameloop="demand"` + `invalidate()` on scroll/pointer events only (Section 7) — this is the single highest-leverage performance decision in this document, verified against current react-three-fiber docs, not assumed.
- **Animation optimization**: unchanged discipline from prior sessions — transform/opacity only, no layout-triggering properties, `will-change` used sparingly and only on actively-animating elements.

---

# 10. SEO Strategy

- **Page hierarchy**: single page for now (Section 2) — heading hierarchy still matters for both accessibility and on-page SEO even without multiple routes.
- **Structured data**: `schema.org` `LocalBusiness`/`Gym`/`Review` markup — already an open item from the original site analysis, still not implemented, restated here as formally in scope of "what a complete spec should account for," not duplicated as new discovery.
- **Metadata**: `__root.tsx`'s existing meta/OG tags are structurally fine; copy should be revisited once Concept C's positioning ("engineered precision," real Technogym/Lacertosus credibility) is reflected in on-page copy, so meta description stays consistent with what the page actually says.
- **Headings**: audit needed during implementation — confirm exactly one `h1`, consistent `h2` per section, `h3` for sub-items (equipment/trainer names) — not assumed correct without checking.
- **Local SEO**: reusing the same real photography on the site and the Google Business Profile (already noted in the research document) remains the concrete opportunity; unlocked by this spec's photo replacement work, not a separate effort.

---

# 11. Technical Mapping

| Design decision | File(s) | Action | Complexity |
|---|---|---|---|
| Token re-theme (dark→light, red accent) | `src/styles.css` | Modify | Medium — single file, but every section depends on it, so regression surface is wide even though the diff itself is small. |
| Hero background: 3D→real photo | `src/routes/index.tsx` (`Hero()`), `src/components/Hero3D.tsx` | Modify `Hero()`, **remove** `Hero3D.tsx` | Medium — GSAP timeline/parallax logic is reused, only the background layer's content changes. |
| Sala Pesi 3D showcase→real photo | `src/routes/index.tsx` (`WeightRoom()`), `src/components/WeightRoom3D.tsx` | Modify `WeightRoom()`, **remove** `WeightRoom3D.tsx` | Low — same card frame, swap content. |
| New Spec Sheet 3D badge | `src/components/SpecBadge3D.tsx` (new), `src/routes/index.tsx` (`Equipment()`/`TiltCard`) | **Create** + modify | Medium-high — new geometry, new `frameloop="demand"` interaction pattern, new section layout. |
| Magnetic CTA | `src/components/MagneticButton.tsx` | Modify (retint only) | Low. |
| Nutrizionista placeholder | `src/routes/index.tsx` (`Nutrizionista()`) | Modify (retint only) | Low. |
| Real logo swap | `src/routes/index.tsx` (`Nav`, `Footer`), `public/favicon.ico` | Modify | Low. |
| Focus-visible / skip link / `<main>` audit | `src/routes/__root.tsx`, `src/routes/index.tsx` | Modify | Low-medium — small changes, needs a careful accessibility pass, not just a color swap. |
| CLAUDE.md stale references (Aesop, green) | `CLAUDE.md` | Modify | Trivial, but must happen so future sessions don't get contradictory guardrails. |
| Contact form backend, GDPR/legal, mobile nav | — | **Not in this spec** | Already tracked separately; explicitly not duplicated or re-scoped into this visual work. |

---

# 12. Implementation Phases

| Phase | Objective | Dependencies | Risks | Effort | Visual impact |
|---|---|---|---|---|---|
| 0 — Tokens | Re-theme `styles.css` (colors only, no layout changes) | Canonical red sampled from `logo.jpg` first | Every section shifts at once; must be visually swept in full, not spot-checked | Low | Highest-leverage single change in the whole spec — the entire site reads differently from one file |
| 1 — Real assets in, invented assets out | Swap logo, swap stock photos for real ones, delete `Hero3D`/`WeightRoom3D` | Phase 0 (so replacements land in the right palette) | Photo aspect ratios may not match existing card crops exactly — needs per-image crop decisions, not blind drop-in | Low-medium | Second-highest — removes every remaining "this looks fake" signal |
| 2 — Spec Sheet rebuild | New layout + `SpecBadge3D` + hover/focus-reveal credibility rows | Phases 0–1 | The one genuinely new UI pattern in this document — highest design risk of the three phases | Medium-high | The concept's signature new moment |
| 3 — Accessibility pass | Focus-visible, skip link, `<main>`/heading audit, keyboard parity for Spec Sheet reveal | Phase 2 done | Easy to under-scope as "just add focus rings" when it also requires the keyboard-equivalent interaction pattern | Low-medium | Not visually dramatic, but closes real gaps this spec introduces (Section 8) |
| — (parallel, untouched) | Contact backend, GDPR/legal, mobile nav | None of the above | Already tracked | Unchanged | Unchanged |

Quick wins are explicitly Phases 0 and 1 — largest visible transformation for the least design risk, because they're subtraction/recoloring, not new invention. Phase 2 is where genuine new design risk is concentrated and should be built and reviewed on its own, not bundled with 0–1.

---

# 13. Final Review (self-critique pass)

Checked for the specific failure modes named in the brief:

- **Inconsistency found and fixed**: the prior roadmap document said "recalibrate Hero3D/WeightRoom3D lighting"; this deeper pass shows that contradicts Concept C's own "one signature 3D moment" principle. Resolved by retiring both and concentrating 3D into `SpecBadge3D` alone (Section 7) — carried consistently through Sections 3, 4, 6, 9, 11 rather than left as a loose end in one section only.
- **Unnecessary complexity checked**: considered whether the Spec Sheet's hover/focus-reveal pattern is gratuitous — rejected that concern because it directly serves the concept's core differentiator (equipment credibility as verifiable fact), and it reuses `TiltCard`'s existing mechanic rather than inventing a new one.
- **Repeated patterns checked**: confirmed no section introduces a second motion system alongside GSAP/Framer Motion — everything routes through the two systems already in place, per CLAUDE.md's "don't add libraries already solvable with what's installed."
- **UX issue caught**: the original brief for this phase didn't ask about focus-only accessibility for hover effects — added it anyway (Section 8) because Phase 2 introduces the first hover-only interaction pattern in the codebase that gates *information* (not just decoration), which is a real, foreseeable WCAG failure if shipped hover-only.
- **Accessibility risk caught**: red-on-light and red-on-dark-surface contrast is called out explicitly (Section 8) rather than assumed safe because "it's the brand color" — brand color and accessible color are not automatically the same thing.
- **Performance risk caught**: the badge's interaction model (`frameloop="demand"`, scroll/pointer-driven, not auto-spinning) was chosen specifically because it was verified against current library behavior (Context7), not assumed from memory — and it's flagged as strictly better than the existing always-on 3D scenes it replaces, not just "equally fine."

This document is the single source of truth for implementation of Concept C. No code has been written or modified. Next step, when authorized: Phase 0.
