import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Glow } from "@/components/ui/glow";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { Hero } from "@/components/sections/hero";
import { RoomGalleryCoverflow } from "@/components/sections/room-gallery-coverflow";
import { RoomNav } from "@/components/sections/room-nav";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { rooms } from "@/config/rooms";
import type { Room } from "@/types";
import { cn } from "@/lib/utils";

// Per-room accent, the same tokens the homepage bands use — the one place a
// touch of the room's own colour shows up on its detail page.
const accentBarClass: Record<Room["accent"], string> = {
  suite: "bg-room-suite",
  domi: "bg-room-domi",
  mery: "bg-room-mery",
};

/**
 * Shared layout for the three room detail pages — data-driven from
 * config/rooms.ts so each page.tsx stays a one-line composition instead of
 * ~150 lines of near-identical markup. Stays a Server Component: `room`
 * carries lucide-react icon components (amenities), which can only be
 * rendered as JSX here, not passed as a prop into a "use client" component
 * (see RoomNav for the one part of this page that does need the client).
 *
 * Speaks the same editorial language as the homepage bands (see
 * rooms-showcase.tsx): oversized clipped numeral, hairline spec sheet,
 * layered warm shadows, per-room accent — so clicking "Scopri la camera"
 * lands on a page that continues the sentence instead of switching template.
 */
import { Tilt3D } from "@/components/animations/tilt-3d";

const roomDetailThemeConfig: Record<
  Room["accent"],
  {
    taglineColor: string;
    numeralColor: string;
    cardBorder: string;
    chipStyle: string;
    buttonStyle: string;
  }
> = {
  suite: {
    taglineColor: "text-[#b8956a]",
    numeralColor: "text-[#b8956a]/25",
    cardBorder: "border-[#b8956a]/40 hover:border-[#b8956a]/80",
    chipStyle: "bg-[#b8956a]/15 text-[#8a683e] border-[#b8956a]/40",
    buttonStyle:
      "bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 border-[#b8956a]/50 hover:shadow-amber-500/30",
  },
  domi: {
    taglineColor: "text-[#1e6edc]",
    numeralColor: "text-[#1e6edc]/25",
    cardBorder: "border-[#1e6edc]/40 hover:border-[#1e6edc]/80",
    chipStyle: "bg-[#1e6edc]/15 text-[#134997] border-[#1e6edc]/40",
    buttonStyle:
      "bg-gradient-to-r from-[#0d1e38] via-[#162e54] to-[#0d1e38] text-blue-100 border-[#1e6edc]/50 hover:shadow-blue-500/30",
  },
  mery: {
    taglineColor: "text-[#e6558b]",
    numeralColor: "text-[#e6558b]/25",
    cardBorder: "border-[#e6558b]/40 hover:border-[#e6558b]/80",
    chipStyle: "bg-[#e6558b]/15 text-[#9e2753] border-[#e6558b]/40",
    buttonStyle:
      "bg-gradient-to-r from-[#331120] via-[#4d1a30] to-[#331120] text-pink-100 border-[#e6558b]/50 hover:shadow-pink-500/30",
  },
};

export function RoomDetail({ room }: { room: Room }) {
  const index = rooms.findIndex((candidate) => candidate.slug === room.slug);
  const otherRooms = rooms
    .filter((candidate) => candidate.slug !== room.slug)
    .map((candidate) => ({ slug: candidate.slug, name: candidate.name }));

  const theme = roomDetailThemeConfig[room.accent];

  return (
    <>
      <Hero
        variant="compact"
        kicker="Le Camere"
        title={room.name}
        subtitle={room.tagline}
        imageSrc={room.heroImage}
        imageAlt={`${room.name} — ${room.tagline}`}
        primaryCta={{
          label: "Richiedi disponibilità",
          href: `/contatti?camera=${room.slug}#richiedi-disponibilita`,
        }}
      />

      <Section>
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="relative flex flex-col items-start gap-7 lg:col-span-2">
            <span
              aria-hidden="true"
              className={cn(
                "font-display pointer-events-none absolute -top-20 -left-4 -z-10 text-[8rem] leading-none font-medium select-none md:text-[11rem]",
                theme.numeralColor,
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <FadeIn>
              <Kicker>{room.tagline}</Kicker>
            </FadeIn>

            <FadeIn delay={0.05}>
              <p
                className={cn(
                  "font-display max-w-2xl text-2xl leading-snug font-medium italic md:text-3xl",
                  theme.taglineColor,
                )}
              >
                {room.shortDescription}
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-foreground/90 max-w-2xl text-base leading-relaxed font-light text-pretty md:text-lg">
                {room.description}
              </p>
            </FadeIn>

            <FadeIn delay={0.15} className="w-full max-w-md">
              <dl className="border-border/80 divide-border/80 divide-y border-t border-b text-sm">
                {[
                  { label: "Ospiti", value: room.guests },
                  { label: "Superficie", value: room.size },
                  { label: "Letto", value: room.bedType },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between py-2.5"
                  >
                    <dt
                      className={cn(
                        "text-xs font-semibold tracking-[0.2em] uppercase",
                        theme.taglineColor,
                      )}
                    >
                      {row.label}
                    </dt>
                    <dd className="text-foreground text-right font-semibold">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>

            <div className="mt-6 flex w-full flex-col items-start gap-4">
              <FadeIn>
                <Kicker>Galleria</Kicker>
              </FadeIn>
              <FadeIn delay={0.05}>
                <SectionTitle as="h2" className="text-[clamp(2rem,3.4vw,3.25rem)]">
                  Ogni angolo, da vicino.
                </SectionTitle>
              </FadeIn>
              <FadeIn delay={0.1} className="w-full">
                <Tilt3D className="w-full">
                  <RoomGalleryCoverflow images={room.gallery} />
                </Tilt3D>
              </FadeIn>
            </div>
          </div>

          <FadeIn delay={0.1}>
            <div className="relative lg:sticky lg:top-28">
              <Tilt3D className="w-full">
                <Glow accentClass={accentBarClass[room.accent]} />
                <Card
                  className={cn(
                    "bg-card/95 gap-0 overflow-hidden rounded-3xl border p-0 shadow-2xl shadow-black/10 transition-all duration-500",
                    theme.cardBorder,
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn("h-1.5 w-full", accentBarClass[room.accent])}
                  />
                  <div className="flex flex-col gap-5 p-7 md:p-8">
                    <p
                      className={cn(
                        "font-display text-xl font-semibold tracking-tight",
                        theme.taglineColor,
                      )}
                    >
                      Dotazioni &amp; Comfort
                    </p>
                    <Stagger className="flex flex-col gap-3.5" staggerChildren={0.05}>
                      {room.amenities.map((amenity) => (
                        <StaggerItem
                          key={amenity.label}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm font-medium shadow-xs transition-all",
                            theme.chipStyle,
                          )}
                        >
                          <amenity.icon className="size-5 shrink-0" aria-hidden="true" />
                          <span>{amenity.label}</span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                    <Button
                      asChild
                      size="lg"
                      className={cn(
                        "mt-3 h-14 rounded-2xl border text-xs font-semibold tracking-widest uppercase shadow-lg transition-all hover:scale-[1.02]",
                        theme.buttonStyle,
                      )}
                    >
                      <Link href={`/contatti?camera=${room.slug}#richiedi-disponibilita`}>
                        Richiedi disponibilità
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </Tilt3D>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <RoomNav otherRooms={otherRooms} />
    </>
  );
}
