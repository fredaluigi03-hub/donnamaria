"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/animations/fade-in";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { rooms } from "@/config/rooms";
import type { Room } from "@/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MOTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

const accentDotClass: Record<Room["accent"], string> = {
  suite: "bg-room-suite",
  domi: "bg-room-domi",
  mery: "bg-room-mery",
};

/**
 * One room, presented as a full editorial band rather than a card.
 *
 * Three separate planes move at three different rates as the band crosses the
 * viewport — the index numeral fastest, the frame at page rate, the photo
 * inside it slowest — which is what actually produces the sense of depth.
 * Everything is Parallax / Mask / Slow Scale / Hover Lift, the vocabulary
 * docs/03_DESIGN_SYSTEM.md allows; nothing spins, bounces or flashes.
 */
function RoomBand({ room, index }: { room: Room; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Photo drifts against the scroll (slowest plane) and eases out of its own
  // slow zoom — a scroll-driven Ken Burns rather than a timed loop, so the
  // movement only ever happens because the visitor is scrolling.
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.06, 1.14]);
  // Numeral travels furthest, so it reads as the layer nearest the viewer.
  const numeralY = useTransform(scrollYProgress, [0, 1], [64, -64]);

  // Alternate which side the photo sits on, so the eye zig-zags down the page
  // instead of scanning a repeating column.
  const photoFirst = index % 2 === 0;

  return (
    <div ref={ref} className="grid items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
      <Tilt3D className={cn("relative", photoFirst ? "md:order-1" : "md:order-2")}>
        {/* Light bleed: the same photo again, blown up slightly past the frame
            and heavily blurred, sitting *behind* it. Its colours spill out from
            under every edge, so the picture reads as a lit object throwing its
            own glow onto the page rather than a rectangle pasted on top — and
            because the glow is sampled from the photo itself, each room casts
            its own colour (amber suite, blue Domi, rose Mery) with nothing
            hand-tuned per room.

            `sizes="12vw"` is deliberate, not a mistake: the layer is blurred
            into mush anyway, so Next only needs to ship a thumbnail for it.
            Blurring a small bitmap and scaling it up costs a fraction of
            blurring the full-resolution one, and looks identical. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-[1.06] opacity-60 blur-[52px] saturate-150"
        >
          <div className="relative h-full w-full">
            <Image
              src={room.coverImage}
              alt=""
              fill
              quality={40}
              sizes="12vw"
              className="rounded-3xl object-cover"
            />
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] sm:rounded-3xl">
          {/* Overscanned (-inset-y) so the parallax drift never exposes an edge. */}
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

          {/* Curtain mask: retracts upward as the band enters, uncovering a
              photo that's already mid-zoom underneath — the two together read
              as a shot being revealed rather than an image popping in.
              Driven by scaleY (a transform, so it stays on the compositor)
              rather than clip-path, and always mounted with the reveal always
              defined — reduced motion is honored by collapsing the duration to
              zero, the same way the Hero does it, so the curtain can never be
              left stuck over the photo. */}
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

          {/* Grounds the photo against the page and deepens the lower edge. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <span
            className={cn(
              "absolute top-5 left-5 size-2.5 rounded-full",
              accentDotClass[room.accent],
            )}
            aria-hidden="true"
          />
        </div>
      </Tilt3D>

      <div
        className={cn(
          "relative flex flex-col items-start gap-5",
          photoFirst ? "md:order-2" : "md:order-1",
        )}
      >
        {/* Oversized numeral, deliberately behind the copy and clipped by the
            column — an editorial page-marker, not a badge. */}
        <motion.span
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { y: numeralY }}
          className="font-display text-foreground/[0.07] pointer-events-none absolute -top-16 -left-4 -z-10 text-[7rem] leading-none font-medium select-none md:text-[9rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        <FadeIn>
          <SectionTitle as="h3" className="text-[clamp(2rem,3.4vw,3.25rem)]">
            {room.name}
          </SectionTitle>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="font-display text-muted-foreground max-w-md text-xl font-light italic">
            {room.tagline}
          </p>
        </FadeIn>

        {/* The band's copy used to stop here — name, one line, three meta
            items — which left a tall void beside a 4:5 photo and read as
            unfinished rather than airy. `shortDescription` and `amenities`
            were already in config/rooms.ts and simply weren't being shown. */}
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground max-w-md text-pretty">
            {room.shortDescription}
          </p>
        </FadeIn>

        {/* Spec sheet, not a chip row: label left, value right, hairline
            between. Precise and quiet — the detail that reads as considered. */}
        <FadeIn delay={0.15} className="w-full max-w-md">
          <dl className="border-border/70 divide-border/70 divide-y border-t border-b text-sm">
            {[
              { label: "Ospiti", value: room.guests },
              { label: "Superficie", value: room.size },
              { label: "Letto", value: room.bedType },
            ].map((row) => (
              <div key={row.label} className="flex items-baseline justify-between py-2.5">
                <dt className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                  {row.label}
                </dt>
                <dd className="text-foreground text-right font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        <FadeIn delay={0.2} className="max-w-md">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {room.amenities.slice(0, 4).map((amenity) => (
              <li
                key={amenity.label}
                className="text-muted-foreground inline-flex items-center gap-2 text-sm"
              >
                <amenity.icon className="text-gold size-4" aria-hidden="true" />
                {amenity.label}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Link
            href={`/camere/${room.slug}`}
            className="group text-foreground inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="underline-offset-4 group-hover:underline">
              Scopri la camera
            </span>
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}

export interface RoomsShowcaseProps {
  /** Render the bands without the section kicker/heading — used on the /camere hub. */
  bare?: boolean;
}

/**
 * "Le Camere" — one editorial band per room from config/rooms.ts, single
 * source of truth reused by the homepage and the /camere hub page.
 */
export function RoomsShowcase({ bare = false }: RoomsShowcaseProps) {
  const bands = (
    <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
      {rooms.map((room, index) => (
        <RoomBand key={room.slug} room={room} index={index} />
      ))}
    </div>
  );

  if (bare) return bands;

  return (
    <Section id="suites" className="scroll-mt-28">
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
        {bands}
      </Container>
    </Section>
  );
}
