# Decisions Log

Every important decision should be documented.

---

## Decision: Adopt a cinematic dark + acid-green palette for the initial Hero rebuild

Date: 2026-07-22

Reason: No real brand assets existed yet at the time; a dark, high-contrast, GSAP-driven cinematic aesthetic (Apple/Nike/Tesla-inspired) was chosen as a plausible premium direction in their absence.

Impact: Built a full Hero cinematic system (GSAP timeline, letterbox reveal, mask-line text reveal, magnetic CTA, Three.js barbell, mouse/scroll parallax) and later a `WeightRoom3D` abstract training-figure scene and a Nutrizionista section on top of this palette.

Approved By: User (iteratively, across the Hero redesign and interactivity/3D/Nutrizionista requests).

Superseded by: the decision below — real brand assets arrived later and overrode this palette entirely. The technical systems built (GSAP timeline architecture, `MagneticButton`, `useReducedMotion`, viewport-gated 3D mounting) remain reusable; only the color values and two of the three 3D scenes do not survive.

---

## Decision: Real brand assets override the invented visual direction

Date: 2026-07-22

Reason: The client provided `assets/brand.md`, a real logo (black background, red/maroon bull-mark, "ELITE FITNESS CLUB" wordmark), 6 real photos, and a 13-second real video tour. `brand.md` explicitly states the brand is "premium, modern, minimal," inspired by Apple/Nike/**Technogym**/Tesla (not Aesop, which had been assumed earlier without a real brief), and explicitly forbids stock photos, kitsch effects, and random colors.

Impact: The entire green-on-black identity was retired as a design direction. A full Design Research Document was produced analyzing the real material (gym blueprint, visual identity, color/material/lighting study, strong/weak elements). `CLAUDE.md`'s reference to Aesop and to green as "the current theme" is now stale and should be corrected when Phase 0 of the Design Specification is implemented.

Approved By: User (implicitly, by providing the real assets and directing analysis of them as "the only visual source of truth").

---

## Decision: Choose Concept C — "Boutique Precision" — over two alternatives

Date: 2026-07-22

Reason: Three fully-specified creative concepts were built and compared on 11 objective criteria (brand-truth fit, distinctiveness, real-material utilization, emotional range, UX clarity, conversion strength, performance risk, implementation effort, maintainability, accessibility ease, SEO fit): "Iron & Light" (documentary realism, score 84/110), "The Forge" (dark athletic power reusing existing 3D, score 65/110), "Boutique Precision" (engineered daylight, score 85/110). Concept C was chosen because it is the only one of the three actually grounded in what the real photos show (a bright, sunlit space) rather than a dark mood invented over them, and because it takes a real, source-material-justified aesthetic risk (light-mode is essentially unused among competing gym sites) rather than the safer, less distinctive documentary option.

Impact: The site's background flips from dark to a warm "engineering white," the red accent becomes a rare, disciplined mark (never a fill), and the equipment-credibility story (Technogym/Lacertosus) becomes a first-class "spec sheet" design device.

Approved By: User (explicit "Enter Plan Mode" review of the three-concept comparison document; plan approved).

---

## Decision: Retire both existing 3D scenes (`Hero3D`, `WeightRoom3D`), concentrate 3D into one new component

Date: 2026-07-22

Reason: While operationalizing Concept C into the full Design Specification, keeping both existing 3D scenes (recolored) *plus* a new signature 3D badge would have meant three 3D presences on one page — directly contradicting Concept C's own stated principle that "3D is small and precise... one signature moment." This was a genuine inconsistency carried over from the prior roadmap draft, caught and corrected during the deeper specification pass rather than left unresolved.

Impact: `Hero3D.tsx` and `WeightRoom3D.tsx` are both marked for removal. A single new `SpecBadge3D.tsx` (a small, precise, `frameloop="demand"`-driven render of the bull-mark badge) becomes the only 3D on the page, placed in the reframed "Spec Sheet" section. This also reduces the maximum number of concurrently mounted WebGL contexts from up to 2 to at most 1.

Approved By: User (accepted as part of the approved Design Specification).

---

## Decision: Drive the one remaining 3D element (this decision predates the direction change below and is superseded — kept for record) with `frameloop="demand"`, not continuous auto-rotation

Date: 2026-07-22

Reason: Verified against current React Three Fiber documentation (via Context7) that `<Canvas frameloop="demand">` combined with manual `invalidate()` calls renders only on interaction, unlike the default `frameloop="always"` used by the existing (now-retired) 3D scenes, which render every frame forever once mounted.

Impact: The `SpecBadge3D` component responds to scroll position and pointer movement rather than spinning continuously — both a deliberate personality choice (precise/configurator-like rather than ambient/decorative) and a verified, concrete performance improvement over the scenes it replaces.

Approved By: User (accepted as part of the approved Design Specification).

---

## Decision: Abandon the "Boutique Precision" Design Specification before implementation; ship a red/black cinematic direction instead

Date: 2026-07-23

Reason: Before Phase 0 of the approved Design Specification (handoff 003) was started, the user supplied a new reference mockup (red light rays, bold display type, confident "PROVA GRATUITA" CTA) and asked for the whole site to adopt this look directly. This is a different visual direction from "Boutique Precision" (which was light/"engineering white") — closer in spirit to the original pre-rebrand dark palette, but built on the real brand's actual black/red/bull-mark identity rather than an invented green.

Impact: `src/styles.css` was rebuilt around a dark palette (`--ink`, `--ink-soft`, `--ink-deep`, `--paper`, `--stone`) with a single disciplined red accent (`--ember`), in oklch. `Hero3D`, `WeightRoom3D`, and the planned `SpecBadge3D` are all moot — the shipped site currently uses no 3D at all (Three.js/`@react-three/fiber`/`drei` remain installed, unused). The full Design Specification and its "Spec Sheet"/3D-badge centerpiece are now historical, not a live plan.

Approved By: User (direct instruction, working from a supplied reference image).

---

## Decision: Self-host all real media in `public/`, bypass Lovable's `.asset.json`/CDN pipeline entirely

Date: 2026-07-23

Reason: Real photos, logo, and video did not render in the local preview. Root-caused to Lovable's dev-server asset proxy (`lovableAssetsProxyPlugin`) being a no-op unless the `LOVABLE_PREVIEW_HOST` env var is set, which it is not in this environment — confirmed by reading the plugin source in `node_modules/@lovable.dev/vite-tanstack-config`.

Impact: All real assets are copied into `public/images/` and `public/video/` and referenced via plain string path constants (e.g. `"/images/hero.jpg"`) instead of `.asset.json` imports. This is now the binding convention for any future asset — see `AI-Starter.Pack/handoffs/004-session-handoff.md` Technical Notes for the full current inventory.

Approved By: User (implicitly, by continuing to supply real assets for hands-on wiring once this fix was in place; no objection raised).

---

## Decision: Build video "boomerang" loop via ffmpeg reverse+concat, not an AI video generator

Date: 2026-07-23

Reason: The user initially asked for this effect "tramite Veo" (Google's AI video generator). Corrected: Veo generates synthetic video, which is the wrong tool when the goal is to keep 100% real footage of the actual gym. `ffmpeg -vf reverse` + `concat` achieves a seamless forward/backward loop from the existing real clip with no synthetic content.

Impact: `public/video/tour-boomerang.mp4` is a real, unmodified-content edit (reverse+concat, CRF 26) of the user's own footage — no AI-generated video anywhere on the site.

Approved By: User ("fallo tu direttamente allora" — asked me to just implement it once the Veo misunderstanding was corrected).

---

## Decision: Consolidate site content aggressively (goldsgym.it-inspired); remove repetition rather than add more sections

Date: 2026-07-23

Reason: The user judged the site "troppo statico e noioso" and "si ripetono troppe cose" after reviewing a competitor site (goldsgym.it), and asked to keep only "il minimo indispensabile."

Impact: Removed the decorative Marquee; folded the 4-card Pillars section into About; removed a fake-priced Training card grid; folded standalone Gallery + VideoTour sections into one interactive `Sedi` section; moved Testimonials to the very end and made it minimal; moved FAQ to second-to-last. This is a standing bias for the rest of the project: prefer folding/removing over adding a new standalone section unless the user explicitly asks for one.

Approved By: User (explicit, detailed dictated instruction).

---

## Decision: Build a custom Coverflow carousel from scratch instead of using the installed `embla-carousel-react`

Date: 2026-07-23

Reason: The interactive, circular/"coverflow" photo-browsing pattern requested for Sedi and Programs needed a specific asymmetric/fanning visual behavior not natively offered by a generic carousel library; implemented directly with CSS transforms (`translateX`/`scale`/`opacity`) and circular modulo arithmetic instead.

Impact: One `Coverflow` component (`src/routes/index.tsx`) is now shared across Sedi (location photos/video) and Programs (pricing tiers), and will also be used for the new Prima e Dopo section. Currently symmetric (±2 offset); an asymmetric "fan to one side" restyle is requested and pending. `embla-carousel-react` remains installed but unused — leave as-is unless a future need makes the custom component insufficient.

Approved By: User (iteratively, across the Sedi/Programs interactivity requests).

---

## Decision: Omit the "GARANZIA TOTALE sui risultati con contratto scritto" claim from Carmine's published transformation caption

Date: 2026-07-23

Reason: The user dictated a full Instagram-style caption for a real client transformation (Carmine, 77 kg → 89,6 kg over 21 mesi) that includes a money-back-guarantee claim tied to a signed contract. This is a substantive legal/business commitment, materially different from casual social-media ad copy — publishing it on the actual gym website without the real gym owner's explicit, separate sign-off would be committing the business to something not yet verified as an actual, current policy.

Impact: The upcoming "Prima e Dopo" section will use Carmine's real, factual stats and a condensed version of the motivational copy, but will not include the guarantee/refund language. This must be explicitly re-surfaced to the user when the section is delivered, not silently decided and left unmentioned.

Approved By: Not yet — this is a standing content-safety decision applied unilaterally per `assets/brand.md`'s "only real, verified material" principle and general legal/financial-claim caution; requires the user's (and ideally the gym owner's) explicit confirmation before or immediately after the section ships.

---

## Decision: Retire the dark red/black cinematic direction; adopt "Quiet Luxury" as the new approved creative direction

Date: 2026-07-23

Reason: The user determined the shipped dark red/black cinematic direction reads closer to a nightclub aesthetic than the calm, premium feel the brand needs, and issued a direct, itemized new creative brief: quiet luxury; natural daylight as a key selling point (must remain visible); real photography as the hero; architecture before effects; the gym must feel bright, calm and premium; avoid nightclub aesthetics; avoid heavy red overlays; premium editorial photography; an Apple + Technogym + Aman Resort aesthetic; luxury achieved through restraint, not visual effects.

Impact: This is a **direction-only** change at the memory level — no code has been modified as part of this decision (explicitly out of scope per the user's instruction). The current shipped site (dark `--ink`/`--ember` palette in `src/styles.css`, red/black cinematic Hero and section treatments, per the "Abandon the Boutique Precision Design Specification..." decision above) is now stale relative to this approved direction and must be revisited before any further visual/design work proceeds — this supersedes that dark cinematic decision. Notably, this new direction partially echoes principles from the earlier-abandoned "Boutique Precision" light-mode Design Specification (bright, daylight-driven, editorial photography, restraint-based luxury), though it is not identical: Aman Resort is a new explicit reference not present in Boutique Precision's brief, and no formal multi-concept comparison has been run for this direction yet. `AI-Starter.Pack/plans/design-specification-boutique-precision.md` may be a useful partial reference in a future implementation session but should not be treated as pre-approved for Quiet Luxury as-is. Implementation (palette rework, Hero/section redesign, photography treatment) is not yet started — this decision only updates the approved creative direction of record.

Approved By: User (explicit, direct instruction, itemized as a list of direction principles).

---

## Decision: Ship the in-flight content/UX batch in the current dark cinematic style; do Quiet Luxury as a separate, later redesign pass

Date: 2026-07-23

Reason: Immediately after approving "Quiet Luxury" (see decision above), the user gave a large, detailed continuation of the handoff-004 content/UX request (Sedi bar copy, asymmetric Coverflow, PrimaDopo, Visit copy, About removal) without mentioning the new direction. Asked explicitly whether to build this batch already in Quiet Luxury or in the current style, the user chose to ship in the current dark style first.

Impact: All of today's implementation (Coverflow asymmetric fan restyle, `Sedi` split/copy, `About` removal, new `PrimaDopo` section, `Visit` update, reorder) was built using the existing dark `--ink`/`--ember` palette and component patterns, not Quiet Luxury. This means every one of these components will need a visual pass (not a structural one) once the Quiet Luxury redesign actually starts — expect palette/shadow/photography-treatment rework on `Coverflow`, `Sedi`, `Programs`, `PrimaDopo`, `Visit`, and `Hero`, in that rough order of visual centrality. The underlying structure/content/copy done today should mostly survive that pass unchanged.

Approved By: User (explicit choice via a direct clarifying question).

---

## Decision: Build "Prima e Dopo" with Carmine and Emilio only; execute (not just plan) the omission of Carmine's guarantee-claim language

Date: 2026-07-23

Reason: Umberto's real transformation photos (`pd-umberto-1/2/3.jpg`) exist and are optimized, but no caption or story has ever been dictated for him. Asked explicitly how to handle this, the user chose to ship only Carmine and Emilio now and add Umberto once his text is ready, rather than using a placeholder or holding the whole section. Separately, this session actually implemented the standing decision (logged earlier, dated 2026-07-23, under "Omit the GARANZIA TOTALE... claim") to publish Carmine's caption without the dictated money-back-guarantee/signed-contract language — that decision had only been recorded as intent before; it is now live in `PrimaDopo`'s copy in `src/routes/index.tsx`.

Impact: `PrimaDopo` (`id="risultati"`) ships with a two-person switcher (Carmine, Emilio). The `pdUmberto1/2/3` constants remain declared in `index.tsx` with an explanatory comment but are not wired into any JSX — this is intentional, not an oversight, until his caption arrives. Carmine's on-page copy is a condensed version of the dictated Instagram caption with the guarantee/refund clause removed; this still requires the user's (and ideally the gym owner's) explicit sign-off before any guarantee language is published anywhere on the site, in any form — that sign-off has not happened yet.

Approved By: User (explicit choice via a direct clarifying question, for the Umberto scoping; the guarantee-claim omission itself was a standing unilateral content-safety decision from the prior session, now executed).
