"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TextReveal } from "@/components/animations/text-reveal";
import { FadeIn } from "@/components/animations/fade-in";
import { BackgroundVideo } from "@/components/animations/background-video";
import { useMounted } from "@/hooks/use-mounted";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MOTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional cinematic background video (homepage only) — imageSrc is kept as its poster/fallback. */
  videoSrc?: string;
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
 * The "fullscreen" variant (homepage only) is centered, video-backed
 * (falling back to a static image when no video/`prefers-reduced-motion`),
 * and follows the entrance timeline + restrained motion from
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

  // On mobile, skip the (heavier) video entirely and use a slow Ken Burns
  // on the static poster instead — a deliberate performance trade-off, not
  // an accident. `mounted` still gates it so `isMobile`'s eventual real
  // value never causes a DOM-tree hydration mismatch (see the video gate
  // below for the same reasoning).
  const showVideo =
    isFullscreen && !!videoSrc && mounted && !shouldReduceMotion && !isMobile;
  const showKenBurns =
    isFullscreen && mounted && !shouldReduceMotion && (isMobile || !videoSrc);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  // Subtle "parallax on exit" for the background itself (video or image) —
  // transform-only (scale/opacity), never top/left, so it stays GPU-cheap.
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative -mt-20 flex flex-col overflow-hidden",
        isFullscreen
          ? "min-h-dvh justify-center"
          : "min-h-[65vh] justify-end md:min-h-[75vh]",
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
            those resolve after hydration, so mounting/unmounting the video
            tree based on them directly would make the server and the
            client's first paint disagree on the DOM tree. `useMounted()`
            is false on both, so the video only appears in a safe,
            post-hydration render. */}
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
                <span className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.35em] text-white/85 uppercase">
                  <span className="bg-gold/70 h-px w-8" aria-hidden="true" />
                  {kicker}
                  <span className="bg-gold/70 h-px w-8" aria-hidden="true" />
                </span>
              </FadeIn>
            )}

            <h1 className="font-display max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <TextReveal text={title} delay={0.8} />
            </h1>

            {subtitle && (
              <FadeIn delay={1.2} duration={1} className="max-w-xl">
                <p className="text-lg font-light text-white/85 md:text-xl">{subtitle}</p>
              </FadeIn>
            )}

            {(primaryCta ?? secondaryCta) && (
              <FadeIn
                delay={1.6}
                duration={1}
                className="mt-2 flex flex-wrap items-center justify-center gap-8"
              >
                {primaryCta && (
                  <Button
                    size="lg"
                    asChild
                    className="h-auto bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 shadow-none hover:bg-white/90"
                  >
                    <Link href={primaryCta.href}>
                      {primaryCta.label}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                )}
                {/* A single quiet wayfinding link, not a second competing
                    button — one confident action per hero, per the luxury
                    reference brands (see docs/02_CREATIVE_DIRECTION.md's
                    "Restraint"). */}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                  >
                    <span className="underline-offset-4 group-hover:underline">
                      {secondaryCta.label}
                    </span>
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
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
              <p className="text-lg text-white/85 md:text-xl">{subtitle}</p>
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
    </section>
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
      className="group absolute inset-x-0 bottom-8 z-10 hidden flex-col items-center gap-2.5 md:flex"
    >
      <span className="text-[0.65rem] font-medium tracking-[0.3em] text-white/70 uppercase transition-colors group-hover:text-white">
        Scorri
      </span>
      <span
        className="relative block h-10 w-px overflow-hidden bg-white/25"
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
