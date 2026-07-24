"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { TextReveal } from "@/components/animations/text-reveal";
import { FadeIn } from "@/components/animations/fade-in";
import { BackgroundVideo } from "@/components/animations/background-video";
import { useMounted } from "@/hooks/use-mounted";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MOTION } from "@/lib/constants";

// Matches the `scroll-mt-*` reserved on the target sections below — kept as
// one number so the JS-driven Lenis scroll and the CSS fallback (no-JS, or
// before Lenis mounts) land at the same offset from the sticky header.
const SCROLL_OFFSET = 112;

/**
 * "Luxury Outdoor Experience" — the emotional continuation of the Hero:
 * same full-bleed video language (see components/animations/background-video.tsx),
 * one beat calmer. Sits directly below the Hero and hands the visitor off to
 * Outdoor Wellness / Suites via the two CTAs, rather than repeating either
 * section's content — see docs/02_CREATIVE_DIRECTION.md's emotional journey
 * (Curiosity → Wonder → Trust → Relaxation → Desire → Booking).
 */
export function OutdoorExperience() {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useMounted();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // Same mounted-gated reasoning as Hero: `shouldReduceMotion`/`isMobile`
  // only resolve after hydration, so gating the video's mount on them
  // directly would make the server and the client's first paint disagree
  // on the DOM tree. `useMounted()` is false on both, so video/Ken-Burns
  // only ever appear in a safe, post-hydration render.
  const showVideo = mounted && !shouldReduceMotion && !isMobile;
  const showKenBurns = mounted && !shouldReduceMotion && isMobile;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const backgroundOpacity = useTransform(scrollYProgress, [0.65, 1], [1, 0.8]);

  function scrollToSection(id: string) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(`#${id}`, { offset: -SCROLL_OFFSET, duration: 1.4 });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    };
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[85dvh] items-end overflow-hidden md:min-h-[92dvh]"
    >
      <motion.div
        className="absolute inset-0"
        style={
          !shouldReduceMotion
            ? { scale: backgroundScale, opacity: backgroundOpacity }
            : undefined
        }
      >
        <motion.div
          className="absolute inset-0"
          initial={showKenBurns ? { scale: 1 } : undefined}
          animate={showKenBurns ? { scale: 1.06 } : undefined}
          transition={
            showKenBurns ? { duration: 20, ease: MOTION.easeEmphatic } : undefined
          }
        >
          <Image
            src="/images/pool-fallback.webp"
            alt="Piscina panoramica di Donna Maria Suite & Relax immersa nel verde delle colline d'Irpinia"
            fill
            quality={92}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {showVideo && (
          <BackgroundVideo src="/videos/pool.mp4" poster="/images/pool-fallback.webp" />
        )}
      </motion.div>

      {/* Cinematic overlay: a light uniform wash so the footage still reads
          through everywhere, plus a bottom-heavy gradient for legible white
          text where the content actually sits — mirrors Hero's overlay
          recipe (docs/03_DESIGN_SYSTEM.md: "extremely soft, never heavy"). */}
      <div className="absolute inset-0 bg-black/[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <Container className="relative z-10 py-20 md:py-28 lg:py-32">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <FadeIn amount={0.6}>
            <Kicker inverted>Vita all&apos;aperto</Kicker>
          </FadeIn>

          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
            <TextReveal text="Relax all'aria aperta" />
          </h2>

          <FadeIn delay={0.1} amount={0.6} className="max-w-lg">
            <p className="text-lg font-light text-white/85 md:text-xl">
              Piscina panoramica, sauna e spazi dedicati al benessere per vivere un
              soggiorno di assoluto relax tra le colline d&apos;Irpinia.
            </p>
          </FadeIn>

          <FadeIn
            delay={0.2}
            amount={0.6}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="h-auto bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 shadow-none hover:bg-white/90"
            >
              <a href="#suites" onClick={scrollToSection("suites")}>
                Scopri le Suite
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-auto border-white/70 bg-transparent px-8 py-3.5 text-sm font-medium text-white shadow-none hover:bg-white/10 hover:text-white"
            >
              <a href="#wellness" onClick={scrollToSection("wellness")}>
                Area Benessere
              </a>
            </Button>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
