"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextReveal } from "@/components/animations/text-reveal";
import { FadeIn } from "@/components/animations/fade-in";
import { BackgroundVideo } from "@/components/animations/background-video";
import { ScrollScrubSequence } from "@/components/animations/scroll-scrub-sequence";
import { useMounted } from "@/hooks/use-mounted";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MOTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface HeroCta {
  label: string;
  href: string;
}

// How much extra scroll (in viewport heights) the hero consumes while
// pinned and scrubbing through `scrubFrames` before releasing into normal
// scroll — long enough to read as "the video plays as I scroll", short
// enough not to feel like scroll-jacking.
//
// The pin only "costs" the visitor (SCRUB_TRACK_VH − 100)vh of scrolling —
// the first 100vh is spent just reaching the pinned position, sticky takes
// over from there. 285 gives ~185vh of actual travel, split by SCRUB_END
// below into the scrub itself plus a deliberate hold on the final pool
// frame. Sized so the scrub spends ~17px of scroll per frame — deliberately
// unhurried, so the footage reads as a camera move the visitor is driving
// rather than a flipbook. Raise it to slow the scrub further, lower it to
// speed up; the hold and the copy timing below follow automatically.
export const SCRUB_TRACK_VH = 240;

// `scrollYProgress` only reaches 1 once the track's *bottom* hits the viewport
// top, but the sticky hero unpins a full viewport earlier — so the pin is
// already gone by this fraction. Nothing meant to happen "while held" may be
// scheduled past it.
const PINNED_END = (SCRUB_TRACK_VH - 100) / SCRUB_TRACK_VH;

// Fraction of the pinned stretch spent scrubbing frames; the rest is the hold
// on the final pool frame. Kept as a fraction of PINNED_END so lengthening the
// track slows the scrub without eating into the hold.
const SCRUB_END = PINNED_END * 0.72;

/**
 * Viewport heights of scrolling after which the footage has finished playing.
 *
 * This is the moment the page is "handed back" to the visitor — the copy
 * appears and the Header brings its nav back. Deliberately the end of the
 * *scrub*, not the end of the pin: the hero stays pinned for a while longer
 * holding the last frame, and waiting for that meant the nav reappeared a
 * few hundred pixels after the film had already stopped.
 */
export const HERO_FOOTAGE_END_VH = SCRUB_END * SCRUB_TRACK_VH;

export interface HeroProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional cinematic background video (homepage only) — imageSrc is kept as its poster/fallback. */
  videoSrc?: string;
  /**
   * Optional scroll-scrubbed frame sequence (homepage only), preferred over
   * `videoSrc` when both are set — see ScrollScrubSequence for why: no
   * autoplay/loop restart, motion only happens because the visitor is
   * scrolling, and it naturally reverses on scroll-up. Frames must live at
   * `${basePath}-XXX.${extension}`, 1-indexed and zero-padded to 3 digits.
   */
  scrubFrames?: { basePath: string; count: number; extension?: string };
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** "fullscreen" for the homepage; "compact" for room/gallery page headers. */
  variant?: "fullscreen" | "compact";
}

/**
 * Full-bleed hero. Sits immediately after the sticky <Header> and pulls
 * itself up under it (`-mt-20` cancels the header's h-20) so the
 * transparent navbar overlaps the background instead of pushing it down —
 * see Header's `transparent` state, which only activates on "/".
 *
 * The "fullscreen" variant (homepage only) is centered, backed by a
 * scroll-scrubbed frame sequence when `scrubFrames` is set (falling back to
 * `videoSrc`'s autoplaying loop, then to a static image + Ken Burns when
 * there's no motion source or `prefers-reduced-motion`/mobile applies), and
 * follows the entrance timeline + restrained motion from
 * docs/02_CREATIVE_DIRECTION.md. "compact" (room/gallery/la-struttura
 * headers) is left pixel-identical to before.
 */
export function Hero({
  title,
  subtitle,
  kicker,
  imageSrc,
  imageAlt,
  videoSrc,
  scrubFrames,
  primaryCta,
  secondaryCta,
  variant = "fullscreen",
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useMounted();
  // `useMediaQuery` is `useSyncExternalStore`-backed, so — unlike
  // `useReducedMotion()` — it's already hydration-safe: React forces the
  // server snapshot (`false`) on the client's first paint too, and only
  // reconciles the real value in a later, safe re-render.
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isFullscreen = variant === "fullscreen";
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // On mobile, skip the (heavier) video/frame-sequence entirely and use a
  // slow Ken Burns on the static poster instead — a deliberate performance
  // trade-off, not an accident. `mounted` still gates it so `isMobile`'s
  // eventual real value never causes a DOM-tree hydration mismatch (see the
  // gates below for the same reasoning). `scrubFrames` wins over `videoSrc`
  // when both are present.
  const hasMotionBackground = !!scrubFrames || !!videoSrc;
  const showScrub =
    isFullscreen && !!scrubFrames && mounted && !shouldReduceMotion && !isMobile;
  const showVideo =
    isFullscreen &&
    !scrubFrames &&
    !!videoSrc &&
    mounted &&
    !shouldReduceMotion &&
    !isMobile;
  const showKenBurns =
    isFullscreen && mounted && !shouldReduceMotion && (isMobile || !hasMotionBackground);

  // When the frame sequence is actually driving the background, the hero
  // pins in place for an extra stretch of scroll (`SCRUB_TRACK_VH`) instead
  // of scrolling away immediately — so scrubbing the video and leaving the
  // hero become two distinct, sequential moments instead of happening on
  // top of each other. Scroll up and the same track plays it back in
  // reverse before handing control back to normal scrolling.
  const isPinned = showScrub;

  const { scrollYProgress } = useScroll({
    target: isPinned ? pinRef : sectionRef,
    offset: ["start start", "end start"],
  });
  // Drives the frame sequence — finishes scrubbing at `SCRUB_END` so the
  // last stretch of the pin is a clean held frame, not a scrub still
  // trickling in right as the exit flourish starts.
  const frameProgress = useTransform(
    scrollYProgress,
    [0, isPinned ? SCRUB_END : 1],
    [0, 1],
  );
  const exitStart = isPinned ? SCRUB_END : 0;
  // Copy timing, and the whole point of it: the footage plays completely
  // unobstructed. The title/subtitle/CTAs are visible on arrival (they're the
  // landing state), clear out as soon as scrolling starts, and stay at zero
  // for the *entire* scrub — nothing sits over the video while it's moving.
  // They only come back once the scrub has finished and the final pool frame
  // is being held still, appearing over the first quarter of that hold, then
  // staying put until the pin actually releases.
  //
  // Every stop is derived from SCRUB_END/PINNED_END rather than hardcoded, so
  // retiming the track can't accidentally slide the copy back on top of a
  // still-running scrub — which is exactly what an earlier `SCRUB_END * 0.8`
  // stop did: the text faded in over the last fifth of the footage.
  // Just past SCRUB_END — enough of a gap to read as a fade rather than a
  // pop, but no waiting. It used to sit a quarter of the way into the hold,
  // which left the visitor looking at a finished, motionless frame for a few
  // hundred pixels before anything arrived.
  const TEXT_IN = SCRUB_END + (PINNED_END - SCRUB_END) * 0.08;
  // Starts at 0, not 1: while the footage plays, the screen carries only the
  // logo and the scroll cue. The headline, subtitle and CTAs arrive as the
  // reward once the sequence lands on the pool. The non-pinned fallback
  // (mobile, reduced motion, no scrub) still shows them immediately — there
  // is no footage there to earn them, and hiding a hero's copy behind a
  // scroll that never scrubs would just be a blank page.
  const textInputRange = isPinned
    ? [0, 0.1, SCRUB_END, TEXT_IN, PINNED_END, 1]
    : [exitStart, 1];
  // Text remains fully visible throughout the video scrub per user directive
  const textOpacityRange = isPinned ? [1, 1, 1, 1, 1, 0.85] : [1, 0.85];
  const textYRange = isPinned ? [0, 0, 0, 0, 0, 12] : [0, 12];
  const scrollOpacity = useTransform(scrollYProgress, textInputRange, textOpacityRange);
  const scrollY = useTransform(scrollYProgress, textInputRange, textYRange);
  // Subtle "parallax on exit" for the background itself (video or image) —
  // transform-only (scale/opacity), never top/left, so it stays GPU-cheap.
  // No zoom (1, not 1.08/1.02) — the frame sequence is already at its
  // native resolution here, and any upscale on the last held frame
  // visibly softens it right as it hands off to the next section. Just
  // the opacity fade carries the exit now.
  const backgroundScale = useTransform(scrollYProgress, [exitStart, 1], [1, 1]);
  // Stays fully opaque through the hold — the pool is the payoff, so it must
  // not sit there quietly dimming while the visitor looks at it. The softening
  // only happens in the final stretch, as the pin actually releases.
  const backgroundOpacity = useTransform(
    scrollYProgress,
    isPinned ? [exitStart, PINNED_END, 1] : [exitStart, 1],
    isPinned ? [1, 1, 0.85] : [1, 0.85],
  );

  const heroSection = (
    <section
      ref={sectionRef}
      className={cn(
        "relative -mt-20 overflow-hidden",
        isFullscreen
          ? "bg-background sticky top-0 min-h-dvh"
          : "min-h-[65vh] md:min-h-[75vh]",
      )}
    >
      {/* Media frame — true full-bleed (`inset-0`, no radius) in both variants.
          The fullscreen hero used to sit inside a visible margin with rounded
          bottom corners; it now runs edge to edge so the footage fills the
          whole viewport and the scroll-scrubbed sequence reads as cinema
          rather than as a large card on a page. */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col overflow-hidden",
          isFullscreen ? "justify-center" : "justify-end",
        )}
      >
        {/* Background layer — the "parallax on exit" wrapper (scale/opacity
            only, transform-based) is separate from the Ken Burns wrapper
            inside it, so the two motions compose instead of fighting. */}
        <motion.div
          className="absolute inset-0"
          style={
            isFullscreen && !shouldReduceMotion
              ? { scale: backgroundScale, opacity: backgroundOpacity }
              : undefined
          }
        >
          {/* Static image — always present as base/fallback. Gets a slow Ken
              Burns zoom only when the video is skipped (mobile, or no
              videoSrc) and motion is allowed; otherwise fully static, since
              the video itself supplies the motion. */}
          <motion.div
            className="absolute inset-0"
            initial={showKenBurns ? { scale: 1 } : undefined}
            animate={showKenBurns ? { scale: 1.05 } : undefined}
            transition={
              showKenBurns ? { duration: 22, ease: MOTION.easeEmphatic } : undefined
            }
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              quality={92}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Gated on `mounted` (not just `useReducedMotion()`/`isMobile`) —
              those resolve after hydration, so mounting/unmounting the
              video/scrub tree based on them directly would make the server
              and the client's first paint disagree on the DOM tree.
              `useMounted()` is false on both, so this only appears in a
              safe, post-hydration render. */}
          {showScrub && scrubFrames && (
            <ScrollScrubSequence
              basePath={scrubFrames.basePath}
              frameCount={scrubFrames.count}
              extension={scrubFrames.extension}
              progress={frameProgress}
            />
          )}
          {showVideo && videoSrc && <BackgroundVideo src={videoSrc} poster={imageSrc} />}
        </motion.div>

        {/* Overlay — a flat, subtle wash (~12%, well within the 10–15% luxury
            range) so the footage's own color stays dominant, plus a soft
            radial boost centered behind the text for contrast. Never a heavy
            uniform dark wash — the golden-hour/jacuzzi tones must read through. */}
        {isFullscreen ? (
          <>
            <div className="absolute inset-0 bg-black/[0.12]" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 55% at center, rgba(10,8,6,0.36) 0%, rgba(10,8,6,0.08) 60%, rgba(10,8,6,0) 100%)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        )}

        {isFullscreen ? (
          <motion.div
            style={{
              opacity: shouldReduceMotion ? 1 : scrollOpacity,
              y: shouldReduceMotion ? 0 : scrollY,
            }}
            className="relative z-10"
          >
            <Container className="flex flex-col items-center gap-6 py-28 text-center md:py-32">
              {kicker && (
                <FadeIn distance={10} delay={0.6} duration={1}>
                  <span className="text-gold flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.35em] uppercase drop-shadow-[0_2px_10px_rgba(184,149,106,0.6)]">
                    <span className="bg-gold h-px w-10" aria-hidden="true" />
                    {kicker}
                    <span className="bg-gold h-px w-10" aria-hidden="true" />
                  </span>
                </FadeIn>
              )}

              <h1 className="font-display max-w-4xl text-4xl leading-[1.02] font-medium tracking-tight text-white [text-shadow:0_2px_24px_rgba(10,8,6,0.5)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                <TextReveal text={title} delay={0.8} />
              </h1>

              {subtitle && (
                <FadeIn delay={1.2} duration={1} className="max-w-xl">
                  <p className="font-display text-lg font-light text-amber-50/90 italic [text-shadow:0_1px_16px_rgba(10,8,6,0.4)] md:text-xl">
                    {subtitle}
                  </p>
                </FadeIn>
              )}

              {(primaryCta ?? secondaryCta) && (
                <FadeIn
                  delay={1.6}
                  duration={1}
                  className="mt-4 flex flex-wrap items-center justify-center gap-6"
                >
                  {primaryCta && (
                    <Button
                      size="lg"
                      asChild
                      className="border-gold/40 hover:shadow-gold/30 h-auto border bg-gradient-to-r from-white via-[#faf6f0] to-[#f3e7d4] px-8 py-3.5 text-xs font-semibold tracking-widest text-neutral-900 uppercase shadow-[0_10px_30px_-5px_rgba(184,149,106,0.4)] transition-all duration-300 hover:scale-105"
                    >
                      <Link href={primaryCta.href}>
                        {primaryCta.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                  {secondaryCta && (
                    <Link
                      href={secondaryCta.href}
                      className="group border-gold/40 hover:border-gold rounded-full border bg-black/30 px-6 py-3 text-xs font-semibold tracking-widest text-amber-100 uppercase backdrop-blur-md transition-all duration-300 hover:bg-black/50 hover:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        {secondaryCta.label}
                        <ArrowRight
                          className="text-gold size-4 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  )}
                </FadeIn>
              )}
            </Container>
          </motion.div>
        ) : (
          <Container className="relative z-10 flex flex-col items-start gap-6 pt-40 pb-20 md:pb-28">
            {kicker && (
              <FadeIn distance={12}>
                <Badge
                  variant="secondary"
                  className="border-white/25 bg-white/10 text-white backdrop-blur-sm"
                >
                  {kicker}
                </Badge>
              </FadeIn>
            )}

            <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight text-white md:text-6xl lg:text-7xl">
              <TextReveal text={title} />
            </h1>

            {subtitle && (
              <FadeIn delay={0.15} className="max-w-xl">
                <p className="font-display text-lg text-white/85 italic md:text-xl">
                  {subtitle}
                </p>
              </FadeIn>
            )}

            {(primaryCta ?? secondaryCta) && (
              <FadeIn delay={0.25} className="flex flex-wrap gap-3">
                {primaryCta && (
                  <Button size="lg" asChild>
                    <Link href={primaryCta.href}>
                      {primaryCta.label}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                )}
                {secondaryCta && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                )}
              </FadeIn>
            )}
          </Container>
        )}

        {isFullscreen && (
          <FadeIn distance={0} delay={2} duration={1}>
            <ScrollCue reduceMotion={shouldReduceMotion ?? false} />
          </FadeIn>
        )}
      </div>
    </section>
  );

  // Fullscreen only: wrap in a taller track so the section above can pin
  // (`sticky top-0`) for the scrub duration instead of scrolling away
  // immediately. Height is only ever stretched when actually pinning
  // (`isPinned`) — otherwise this wrapper is inert (auto height, sticky
  // behaves like static) and every non-scrub path (mobile, reduced motion,
  // `videoSrc` fallback, no motion source) looks exactly as it did before.
  return isFullscreen ? (
    <div
      ref={pinRef}
      className="relative"
      style={isPinned ? { height: `${SCRUB_TRACK_VH}vh` } : undefined}
    >
      {heroSection}
    </div>
  ) : (
    heroSection
  );
}

function ScrollCue({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: window.innerHeight - 80, behavior: "smooth" });
      }}
      aria-label="Scorri per scoprire di più"
      className="group absolute inset-x-0 bottom-10 z-10 hidden flex-col items-center gap-3.5 md:flex"
    >
      {/* Larger and brighter than a usual scroll hint on purpose: while the
          footage is running this and the logo are the only things on screen,
          so it carries the entire "this page responds to scrolling" message.
          A visitor who doesn't scroll never sees the headline or the CTA. */}
      <span className="text-sm font-medium tracking-[0.3em] text-white/85 uppercase transition-colors [text-shadow:0_1px_12px_rgba(10,8,6,0.5)] group-hover:text-white">
        Scorri
      </span>
      <span
        className="relative block h-16 w-px overflow-hidden bg-white/30"
        aria-hidden="true"
      >
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-white"
          animate={reduceMotion ? { y: "0%" } : { y: ["-100%", "200%"] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </span>
    </button>
  );
}
