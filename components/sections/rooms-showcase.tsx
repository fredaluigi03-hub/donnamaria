"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { RoomMeta } from "@/components/sections/room-meta";
import { FadeIn } from "@/components/animations/fade-in";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { rooms } from "@/config/rooms";
import type { Room } from "@/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { MOTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

const accentDotClass: Record<Room["accent"], string> = {
  suite: "bg-room-suite",
  domi: "bg-room-domi",
  mery: "bg-room-mery",
};

const roomThemeConfig: Record<
  Room["accent"],
  {
    glow: string;
    taglineColor: string;
    numeralColor: string;
    cardBorder: string;
    chipStyle: string;
    buttonStyle: string;
  }
> = {
  suite: {
    glow: "radial-gradient(circle, rgba(212, 160, 80, 0.95) 0%, rgba(184, 149, 106, 0.65) 45%, transparent 75%)",
    taglineColor: "text-[#b8956a]",
    numeralColor: "text-[#b8956a]/25",
    cardBorder: "border-[#b8956a]/40 hover:border-[#b8956a]/80",
    chipStyle: "bg-[#b8956a]/15 text-[#8a683e] border-[#b8956a]/40",
    buttonStyle:
      "bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 border-[#b8956a]/50 hover:shadow-amber-500/30",
  },
  domi: {
    glow: "radial-gradient(circle, rgba(30, 110, 240, 0.95) 0%, rgba(20, 90, 200, 0.65) 45%, transparent 75%)",
    taglineColor: "text-[#1e6edc]",
    numeralColor: "text-[#1e6edc]/25",
    cardBorder: "border-[#1e6edc]/40 hover:border-[#1e6edc]/80",
    chipStyle: "bg-[#1e6edc]/15 text-[#134997] border-[#1e6edc]/40",
    buttonStyle:
      "bg-gradient-to-r from-[#0d1e38] via-[#162e54] to-[#0d1e38] text-blue-100 border-[#1e6edc]/50 hover:shadow-blue-500/30",
  },
  mery: {
    glow: "radial-gradient(circle, rgba(250, 100, 160, 0.95) 0%, rgba(225, 75, 135, 0.65) 45%, transparent 75%)",
    taglineColor: "text-[#e6558b]",
    numeralColor: "text-[#e6558b]/25",
    cardBorder: "border-[#e6558b]/40 hover:border-[#e6558b]/80",
    chipStyle: "bg-[#e6558b]/15 text-[#9e2753] border-[#e6558b]/40",
    buttonStyle:
      "bg-gradient-to-r from-[#331120] via-[#4d1a30] to-[#331120] text-pink-100 border-[#e6558b]/50 hover:shadow-pink-500/30",
  },
};

function RoomBand({ room, index }: { room: Room; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.06, 1.14]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [64, -64]);

  const photoFirst = index % 2 === 0;
  const theme = roomThemeConfig[room.accent];

  return (
    <div
      ref={ref}
      className="relative grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20"
    >
      <Tilt3D className={cn("relative z-10", photoFirst ? "md:order-1" : "md:order-2")}>
        {/* Bright high-intensity custom color light glow behind room photo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-14 -z-10 rounded-full opacity-100 blur-3xl transition-all duration-500 md:-inset-20"
          style={{ background: theme.glow }}
        />

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] sm:rounded-3xl">
          <motion.div
            className="absolute inset-x-0 -inset-y-12"
            style={shouldReduceMotion ? undefined : { y: photoY, scale: photoScale }}
          >
            <Image
              src={room.coverImage}
              alt={`${room.name} — ${room.tagline}`}
              fill
              quality={92}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="bg-background absolute inset-0 origin-top"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: shouldReduceMotion ? 0 : MOTION.durationSlow,
              ease: MOTION.easeEmphatic,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <span
            className={cn(
              "absolute top-5 left-5 size-3.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]",
              accentDotClass[room.accent],
            )}
            aria-hidden="true"
          />
        </div>
      </Tilt3D>

      <Tilt3D
        className={cn(
          "bg-card/90 relative flex flex-col items-start gap-5 rounded-3xl border p-8 shadow-xl shadow-black/5 backdrop-blur-md transition-all duration-500 md:p-10",
          theme.cardBorder,
          photoFirst ? "md:order-2" : "md:order-1",
        )}
      >
        <motion.span
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { y: numeralY }}
          className={cn(
            "font-display pointer-events-none absolute -top-14 -right-4 -z-10 text-[7rem] leading-none font-medium select-none md:text-[9rem]",
            theme.numeralColor,
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        <FadeIn>
          <SectionTitle as="h3" className="text-[clamp(2rem,3.4vw,3.25rem)]">
            {room.name}
          </SectionTitle>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p
            className={cn(
              "font-display max-w-md text-xl font-medium italic",
              theme.taglineColor,
            )}
          >
            {room.tagline}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-foreground/90 max-w-md text-sm leading-relaxed font-light text-pretty md:text-base">
            {room.shortDescription}
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="w-full max-w-md">
          <dl className="border-border/80 divide-border/80 divide-y border-t border-b text-sm">
            {[
              { label: "Ospiti", value: room.guests },
              { label: "Superficie", value: room.size },
              { label: "Letto", value: room.bedType },
            ].map((row) => (
              <div key={row.label} className="flex items-baseline justify-between py-2.5">
                <dt
                  className={cn(
                    "text-xs font-semibold tracking-[0.2em] uppercase",
                    theme.taglineColor,
                  )}
                >
                  {row.label}
                </dt>
                <dd className="text-foreground text-right font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        <FadeIn delay={0.2} className="max-w-md">
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {room.amenities.slice(0, 4).map((amenity) => (
              <li
                key={amenity.label}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all",
                  theme.chipStyle,
                )}
              >
                <amenity.icon className="size-3.5" aria-hidden="true" />
                {amenity.label}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.25} className="pt-2">
          <Link
            href={`/camere/${room.slug}`}
            className={cn(
              "group inline-flex items-center gap-2.5 rounded-full border px-7 py-3 text-xs font-semibold tracking-widest uppercase shadow-lg transition-all duration-300 hover:scale-105",
              theme.buttonStyle,
            )}
          >
            <span>Scopri la camera</span>
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </FadeIn>
      </Tilt3D>
    </div>
  );
}

/** Full-bleed rounded card for one room — the mobile scroll-snap fallback
 * below, where a "card" is the expected shape for a swipeable strip. The
 * desktop pinned filmstrip uses `RoomBand`'s two-column layout instead
 * (see `RoomsPinnedScroll`), not this single-panel card. */
function RoomPinnedCard({ room }: { room: Room }) {
  const theme = roomThemeConfig[room.accent];

  return (
    <Tilt3D max={3} className="h-full w-full">
      <div className="border-border/60 relative h-full w-full overflow-hidden rounded-3xl border shadow-2xl shadow-black/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-20 -z-10 opacity-70 blur-3xl"
          style={{ background: theme.glow }}
        />
        <Image
          src={room.coverImage}
          alt={`${room.name} — ${room.tagline}`}
          fill
          quality={92}
          sizes="(min-width: 768px) 85vw, 85vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span
          className={cn(
            "absolute top-6 left-6 size-3.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]",
            accentDotClass[room.accent],
          )}
          aria-hidden="true"
        />

        <div className="absolute inset-x-6 bottom-6 flex flex-col items-start gap-3 md:inset-x-10 md:bottom-10 md:max-w-xl">
          <p
            className={cn("font-display text-lg font-medium italic", theme.taglineColor)}
          >
            {room.tagline}
          </p>
          <h3 className="font-display text-3xl font-medium text-white md:text-5xl">
            {room.name}
          </h3>
          <p className="max-w-md text-sm text-white/80 md:text-base">
            {room.shortDescription}
          </p>
          <RoomMeta room={room} className="text-white/70 [&_svg]:text-white/70" />
          <Link
            href={`/camere/${room.slug}`}
            className={cn(
              "group mt-2 inline-flex items-center gap-2.5 rounded-full border px-6 py-2.5 text-xs font-semibold tracking-widest uppercase shadow-lg transition-all duration-300 hover:scale-105",
              theme.buttonStyle,
            )}
          >
            <span>Scopri la camera</span>
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </Tilt3D>
  );
}

/** Native horizontal scroll — mobile, and the `prefers-reduced-motion`
 * fallback for desktop. No pin, no scroll-jacking, just `overflow-x-auto`
 * with `scroll-snap`, the same pattern the browser already gives touch
 * users for free. Unlike RoomsPinnedScroll this isn't rendered inside the
 * header's `<Section>` (that split was needed for `position: sticky`), so
 * it wraps its own `overflow-x-clip` + `<Container>` — the same pairing
 * `Section` normally provides — so the edge-to-edge `-mx-6` bleed can't
 * turn into a page-level horizontal scrollbar. */
function RoomsHorizontalFallback() {
  return (
    <div className="overflow-x-clip pb-24 md:pb-32">
      <Container>
        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10 [&::-webkit-scrollbar]:hidden">
          {rooms.map((room) => (
            <div
              key={room.slug}
              className="aspect-[3/4] w-[82vw] flex-shrink-0 snap-center sm:w-[60vw] lg:w-[38vw]"
            >
              <RoomPinnedCard room={room} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

/**
 * Pinned filmstrip: a `300vh`-tall wrapper holds a `sticky` viewport, and
 * `scrollYProgress` (0→1 across that wrapper's own scroll runway — not the
 * whole page) drives the track's `translateX`. No wheel/touch capture and
 * no `preventDefault` anywhere — the browser's native scroll is what
 * advances `scrollYProgress`, so scrolling past the last card (or back up
 * past the first) always just continues into the next/previous section on
 * its own; there's nothing to "unlock". This is the same pin+parallax
 * technique `RoomBand` above already uses for its photo, one level up.
 */
function RoomsPinnedScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  // Matches the `isMobile` threshold already used site-wide (Hero, Header,
  // OutdoorExperience) rather than inventing a new breakpoint here.
  const isMobile = useMediaQuery("(max-width: 767px)");
  // Same `mounted`-gated reasoning as Hero/OutdoorExperience: `isMobile`/
  // `shouldReduceMotion` only resolve to their real value after hydration
  // (both default to `false` during SSR and the first client paint), so
  // deciding the layout on them directly would flash the full pinned
  // filmstrip on a phone for one frame before flipping to the fallback.
  // Defaulting to the fallback until mounted keeps first paint boring
  // everywhere and correct nowhere it isn't already.
  const mounted = useMounted();
  const usePinned = mounted && !shouldReduceMotion && !isMobile;
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(rooms.length - 1) * 100}%`],
  );
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      rooms.length - 1,
      Math.max(0, Math.round(value * (rooms.length - 1))),
    );
    setActiveIndex((current) => (current === next ? current : next));
  });

  if (!usePinned) {
    return <RoomsHorizontalFallback />;
  }

  const activeRoom = rooms[activeIndex]!;

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${rooms.length * 100}vh` }}
      className="relative"
    >
      {/* True edge-to-edge: this IS the sticky viewport, full `100vh`/`100vw`,
          no inner max-width/height-capped box. Each slide below is `w-full`
          of THIS element, and since this element's own layout width is the
          full viewport (nothing constrains it), the `trackX` percentages
          computed below resolve to exactly `-{index} * 100vw` — a card
          format was never right here; the room photo itself IS the screen. */}
      <div className="bg-background sticky top-0 h-screen w-full overflow-hidden">
        <motion.div className="flex h-full w-full" style={{ x: trackX }}>
          {rooms.map((room, index) => (
            <div
              key={room.slug}
              className="flex h-full w-full flex-shrink-0 items-center"
            >
              {/* The two-column editorial layout — photo + info panel,
                  numeral watermark included — is `RoomBand` unchanged, the
                  exact same component the /camere hub renders in normal
                  vertical flow. Only how it's *reached* differs here:
                  horizontal slide instead of vertical scroll-past. Extra
                  bottom padding nudges it up within the centered flex row
                  so its own CTA never sits under the progress indicator
                  overlaid at the bottom of the pinned viewport. */}
              <Container className="py-10 pb-28 md:pb-32">
                <RoomBand room={room} index={index} />
              </Container>
            </div>
          ))}
        </motion.div>

        {/* Progress: current room + a thin bar tracking scrollYProgress —
            so scrolling through a 300vh section without visibly moving
            down the page reads as "advancing", not "stuck". */}
        <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 md:bottom-10">
          <p className="text-foreground text-sm font-medium tracking-wide">
            {activeRoom.name}{" "}
            <span className="text-muted-foreground tabular-nums">
              {activeIndex + 1}/{rooms.length}
            </span>
          </p>
          <div className="bg-border/60 h-1 w-40 overflow-hidden rounded-full">
            <motion.div
              className="bg-gold h-full rounded-full"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface RoomsShowcaseProps {
  /** Render the bands without the section kicker/heading — used on the /camere hub. */
  bare?: boolean;
}

/**
 * "Le Camere" — the homepage entry is a pinned horizontal filmstrip
 * (RoomsPinnedScroll); the /camere hub page keeps the original vertical
 * editorial bands (one room fully explorable per scroll-stop) via `bare`,
 * since that page exists specifically for unhurried browsing rather than
 * a homepage attention-grabbing moment.
 */
export function RoomsShowcase({ bare = false }: RoomsShowcaseProps) {
  if (bare) {
    return (
      <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
        {rooms.map((room, index) => (
          <RoomBand key={room.slug} room={room} index={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Header lives in its own `overflow-hidden` section (needed to clip
          the ambient glow) — deliberately separate from RoomsPinnedScroll
          below, since `position: sticky` stops sticking the moment ANY
          ancestor clips overflow on the y-axis. Nothing here used `sticky`
          before this section grew a pinned filmstrip, so this split only
          matters now. */}
      <Section
        id="suites"
        className="relative scroll-mt-28 overflow-hidden pt-24 pb-0 md:pt-32 lg:pt-32"
      >
        {/* Background ambient warm light pool */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184,149,106,0.2) 0%, transparent 70%)",
          }}
        />

        <Container>
          <div className="mb-14 flex flex-col items-start gap-4 md:mb-20">
            <FadeIn>
              <Kicker>Le Camere</Kicker>
            </FadeIn>
            <FadeIn delay={0.05}>
              <SectionTitle>
                Tre atmosfere, un&apos;unica cura per il dettaglio.
              </SectionTitle>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <RoomsPinnedScroll />
    </>
  );
}
