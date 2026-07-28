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
    <Section id="suites" className="relative scroll-mt-28 overflow-hidden py-24 md:py-32">
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
        {bands}
      </Container>
    </Section>
  );
}
