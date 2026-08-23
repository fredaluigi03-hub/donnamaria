"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { AiTag } from "@/components/ui/ai-disclosure";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { FadeIn } from "@/components/animations/fade-in";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface CascadeItem {
  src: string;
  alt: string;
  tag: string;
  title: string;
  description: string;
}

// All real, already-generated assets for the property — the "giardino" and
// "terrazza" entries reuse the same high-impact hero shots as the homepage
// hero (rather than the two ambienti that had no photoshoot yet and only
// ever rendered as broken images).
const items: CascadeItem[] = [
  {
    src: "/images/rooms/suite/lettosuiteorizzontale.jpg",
    alt: "Suite Deluxe di Donna Maria Suite & Relax",
    tag: "Suite",
    title: "Suite Deluxe",
    description: "Un rifugio intimo con sauna privata e vasca idromassaggio.",
  },
  {
    src: "/images/pool/hero.png",
    alt: "Piscina panoramica della struttura",
    tag: "Piscina",
    title: "Piscina panoramica",
    description: "Acqua calma affacciata sui Monti Picentini, all'aperto.",
  },
  {
    src: "/images/rooms/suite/saunasuite.png",
    alt: "Sauna in legno dell'area wellness",
    tag: "Wellness",
    title: "Sauna privata",
    description: "Calore avvolgente in legno naturale, per un rito quotidiano.",
  },
  {
    src: "/images/hero-jacuzzi-poster.webp",
    alt: "Giardino privato con piscina e lettini della struttura",
    tag: "Giardino",
    title: "Giardino & piscina",
    description: "Prato curato, ombra degli ulivi e la piscina a due passi.",
  },
  {
    src: "/images/herohome/hero.png",
    alt: "Terrazza panoramica al tramonto con vasca idromassaggio",
    tag: "Terrazza",
    title: "Terrazza al tramonto",
    description: "Luci soffuse e il sole che cala sui Monti Picentini.",
  },
  {
    src: "/images/wellness/jacuzzi.png",
    alt: "Jacuzzi riscaldata dell'area wellness",
    tag: "Wellness",
    title: "Jacuzzi riscaldata",
    description: "Bolle calde al tramonto, a due passi dalla camera.",
  },
  {
    src: "/images/exterior/hero.png",
    alt: "Vista sui Monti Picentini dalla struttura",
    tag: "Territorio",
    title: "Vista sui Picentini",
    description: "Serino visto da dove l'aria si fa più leggera.",
  },
  {
    src: "/images/rooms/domi/salottinodomi.png",
    alt: "Zona living dell'appartamento Domi",
    tag: "Living",
    title: "Spazi da vivere",
    description: "Comfort di casa, per soggiorni senza orologio.",
  },
];

const AUTOPLAY_MS = 4200;

/** Target transform for a card at `distance` steps from the active one. */
function getCardTarget(distance: number) {
  if (distance === 0) {
    return { y: 0, z: 0, rotateX: 0, scale: 1, opacity: 1, saturate: 1 };
  }
  if (distance > 0) {
    // Upcoming: stacked above as thin slivers, receding into the screen —
    // clipped by the wrapper's `overflow-hidden` so only an edge peeks in.
    const d = Math.min(distance, 3);
    return {
      y: -d * 46,
      z: -d * 90,
      rotateX: 0,
      scale: 1 - d * 0.06,
      opacity: 1 - d * 0.12,
      saturate: 1 - Math.min(d, 1) * 0.5,
    };
  }
  // Already seen: slips down behind/below the active card and out through
  // the bottom of the clipped stack — mostly a drop in Y with just a mild
  // forward tip, matching the reference (the exited card stays large and
  // legible, it's the wrapper's clip that makes it "disappear", not a
  // steep rotation or a fade). A fixed pose regardless of how long ago it
  // was active, since only the most recently-exited one is ever partly
  // visible before the clip fully hides it.
  return { y: 600, z: -20, rotateX: 20, scale: 0.97, opacity: 0.92, saturate: 1 };
}

/**
 * Interactive 3D card deck for the gallery — the visual language of
 * getlayers.ai's "In Freefall" (stacked cards, one tips forward and drops
 * away) driven by clicks/autoplay via Motion (motion/react) instead of
 * scroll-jacking. Scrolling the page is always plain page scroll; the deck
 * advances on its own timer or when a visitor interacts with it, same as
 * the site's other interactive galleries (RoomGalleryCoverflow).
 */
export function GalleryCascade() {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const deckRef = useRef<HTMLDivElement>(null);
  // goTo() itself is recreated every render (it closes over `active`), but
  // the native listeners below are only attached once — they read the
  // latest goTo via this ref instead of re-subscribing on every index change.
  const goToRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    if (shouldReduceMotion) return;

    autoplayRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActive((current) => (current + 1) % items.length);
    }, AUTOPLAY_MS);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [shouldReduceMotion]);

  function stopAutoplay() {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }

  function goTo(index: number) {
    stopAutoplay();
    setActive(((index % items.length) + items.length) % items.length);
  }

  useEffect(() => {
    goToRef.current = goTo;
  });

  // Wheel and touch are wired natively (not via onWheel/onTouchMove props):
  // both need `preventDefault()` on the actual event, and React attaches
  // these two event types as passive by default for scroll performance —
  // `preventDefault` inside a passive listener is a silent no-op there.
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    let lastStepAt = 0;
    const STEP_COOLDOWN_MS = 550;

    function step(direction: 1 | -1) {
      const now = Date.now();
      if (now - lastStepAt < STEP_COOLDOWN_MS) return;
      lastStepAt = now;
      goToRef.current(activeRefValue() + direction);
    }

    // Read the live index off the DOM's data attribute rather than closing
    // over `active`, so this effect never needs to re-run (and re-bind the
    // listeners) when the index changes.
    function activeRefValue() {
      return Number(deck!.dataset.active ?? 0);
    }

    function onWheel(event: WheelEvent) {
      // Scrolling over the photos drives the deck, not the page — anywhere
      // else on the page, scroll behaves normally.
      event.preventDefault();
      if (Math.abs(event.deltaY) < 2) return;
      step(event.deltaY > 0 ? 1 : -1);
    }

    let touchStartY = 0;
    let touchDragging = false;

    function onTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]!.clientY;
      touchDragging = false;
    }

    function onTouchMove(event: TouchEvent) {
      const dy = event.touches[0]!.clientY - touchStartY;
      // Small deadzone so a tap on a peeking card (handled by onClick)
      // isn't swallowed as an accidental swipe.
      if (!touchDragging && Math.abs(dy) > 10) touchDragging = true;
      if (touchDragging) event.preventDefault();
    }

    function onTouchEnd(event: TouchEvent) {
      if (!touchDragging) return;
      const dy = event.changedTouches[0]!.clientY - touchStartY;
      if (Math.abs(dy) > 40) step(dy < 0 ? 1 : -1);
      touchDragging = false;
    }

    deck.addEventListener("wheel", onWheel, { passive: false });
    deck.addEventListener("touchstart", onTouchStart, { passive: true });
    deck.addEventListener("touchmove", onTouchMove, { passive: false });
    deck.addEventListener("touchend", onTouchEnd);

    return () => {
      deck.removeEventListener("wheel", onWheel);
      deck.removeEventListener("touchstart", onTouchStart);
      deck.removeEventListener("touchmove", onTouchMove);
      deck.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const activeItem = items[active]!;

  return (
    <Section className="bg-[#faf8f5]">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_1fr_9rem] lg:items-center lg:gap-8">
        {/* Intro column */}
        <div className="flex flex-col items-start gap-6">
          <FadeIn>
            <span className="flex items-center gap-3 text-xs font-medium tracking-[0.35em] text-[#181818]/60 uppercase">
              <span className="h-px w-8 bg-[#c08a3e]/70" aria-hidden="true" />
              Galleria · Serino
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-display text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1.05] font-medium text-[#181818]">
              La <span className="font-serif text-[#c08a3e] italic">Suite</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-[32ch] text-base leading-relaxed text-[#181818]/70">
              {items.length} scorci della struttura. Un ambiente alla volta, a portata di
              click.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <Link
              href="/galleria"
              className="group inline-flex items-center gap-2 rounded-full border border-[#c08a3e]/40 bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] px-6 py-3 text-xs font-semibold tracking-widest text-amber-100 uppercase shadow-lg transition-transform hover:scale-105"
            >
              Scopri gli ambienti
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </FadeIn>
        </div>

        {/* Interactive 3D card stack */}
        <FadeIn distance={40} className="flex flex-col items-center gap-5">
          <Tilt3D max={3} className="w-full">
            <div
              ref={deckRef}
              data-active={active}
              // The site runs Lenis (see smooth-scroll.tsx) for global
              // smooth-scroll — Lenis listens for `wheel` on `window` and
              // drives its own virtual scroll from it, entirely separate
              // from this element's own `preventDefault()`-based handling
              // below. Without this attribute Lenis still scrolls the page
              // from every wheel tick over the photos, no matter what the
              // local listener does. `data-lenis-prevent` is Lenis's own
              // documented opt-out: it skips any wheel/touch event whose
              // target is inside an element carrying this attribute.
              data-lenis-prevent
              className="relative h-[24rem] touch-none overflow-hidden overscroll-contain md:h-[28rem]"
              onMouseEnter={() => {
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                pausedRef.current = false;
              }}
            >
              <div className="relative h-full [perspective:1300px]">
                <div
                  className="relative h-full w-full [transform-style:preserve-3d]"
                  role="group"
                  aria-roledescription="carousel"
                  aria-label="Galleria fotografica della struttura"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") goTo(active - 1);
                    if (event.key === "ArrowRight") goTo(active + 1);
                  }}
                >
                  {items.map((item, index) => (
                    <CascadeCard
                      key={item.src}
                      item={item}
                      index={index}
                      active={active}
                      onSelect={() => goTo(index)}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Tilt3D>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Ambiente precedente"
              className="border-border bg-card hover:bg-secondary inline-flex size-10 items-center justify-center rounded-full border transition-colors"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <p className="text-muted-foreground min-w-14 text-center text-sm tabular-nums">
              {active + 1} / {items.length}
            </p>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Ambiente successivo"
              className="border-border bg-card hover:bg-secondary inline-flex size-10 items-center justify-center rounded-full border transition-colors"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </FadeIn>

        {/* Chapter indicator — horizontal text (not `vertical-rl`, which
            rotates digits 90° and makes "07" unreadable), in a wider
            column so a title like "Vista sui Picentini" has room to wrap. */}
        <div className="relative hidden h-full flex-col items-center justify-center gap-6 lg:flex">
          <div className="relative h-56 w-px bg-[#181818]/12">
            <span
              className="absolute -left-[3px] size-[7px] rounded-full bg-[#c08a3e] shadow-[0_0_10px_2px_rgba(192,138,62,0.55)] transition-[top] duration-300 ease-out"
              style={{ top: `${(active / (items.length - 1)) * 100}%` }}
              aria-hidden="true"
            />
          </div>
          <div
            className="flex flex-col items-center gap-1.5 text-center"
            aria-hidden="true"
          >
            <span className="font-display text-3xl font-semibold text-[#181818]">
              {String(active + 1).padStart(2, "0")}
              <span className="text-lg font-normal text-[#c08a3e]">
                /{String(items.length).padStart(2, "0")}
              </span>
            </span>
            <span className="max-w-[9ch] text-xs font-medium tracking-[0.15em] text-[#181818]/60 uppercase">
              {activeItem.title}
            </span>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CascadeCard({
  item,
  index,
  active,
  onSelect,
  shouldReduceMotion,
}: {
  item: CascadeItem;
  index: number;
  active: number;
  onSelect: () => void;
  shouldReduceMotion: boolean;
}) {
  const distance = index - active;
  const target = getCardTarget(distance);
  const isActive = distance === 0;

  return (
    <motion.article
      onClick={isActive ? undefined : onSelect}
      className={cn(
        "absolute inset-0 origin-top overflow-hidden rounded-3xl border border-[#c08a3e]/25 shadow-2xl shadow-black/20",
        isActive ? "cursor-default" : "cursor-pointer",
      )}
      style={{ zIndex: 100 - index }}
      animate={{
        y: target.y,
        z: target.z,
        rotateX: target.rotateX,
        scale: target.scale,
        opacity: target.opacity,
        filter: `saturate(${target.saturate})`,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 170, damping: 24 }
      }
    >
      <div className="absolute inset-x-6 top-5 z-10 flex items-center justify-between text-xs font-semibold tracking-widest text-white/90 uppercase">
        <span className="tabular-nums">
          {String(index + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 backdrop-blur-sm">
          {item.tag}
        </span>
      </div>

      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 40vw, 60vw"
        className="object-cover"
        priority={index === 0}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <AiTag className="right-6 bottom-24" />

      <div className="absolute inset-x-6 bottom-6 z-10 flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-widest text-[#c08a3e] uppercase">
          Ambiente {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-2xl font-medium text-white md:text-3xl">
          {item.title}
        </h3>
        <p className="max-w-[38ch] text-sm text-white/75">{item.description}</p>
      </div>
    </motion.article>
  );
}
