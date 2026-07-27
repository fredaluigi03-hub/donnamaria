import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
export function RoomDetail({ room }: { room: Room }) {
  const index = rooms.findIndex((candidate) => candidate.slug === room.slug);
  const otherRooms = rooms
    .filter((candidate) => candidate.slug !== room.slug)
    .map((candidate) => ({ slug: candidate.slug, name: candidate.name }));

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
            {/* Same clipped editorial page-marker as the homepage band for
                this room — ties the two views of the same room together. */}
            <span
              aria-hidden="true"
              className="font-display text-foreground/[0.06] pointer-events-none absolute -top-20 -left-4 -z-10 text-[8rem] leading-none font-medium select-none md:text-[11rem]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <FadeIn>
              <Kicker>{room.tagline}</Kicker>
            </FadeIn>

            {/* The room's one-line promise, in the display italic voice the
                Hero and the band subtitles already use — an editorial lead,
                not a wall of small muted text. */}
            <FadeIn delay={0.05}>
              <p className="font-display max-w-2xl text-2xl leading-snug font-light italic md:text-3xl">
                {room.shortDescription}
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-muted-foreground max-w-2xl text-lg font-light text-pretty">
                {room.description}
              </p>
            </FadeIn>

            {/* Hairline spec sheet — identical treatment to the homepage
                bands, replacing the small icon-chip row this page had. */}
            <FadeIn delay={0.15} className="w-full max-w-md">
              <dl className="border-border/70 divide-border/70 divide-y border-t border-b text-sm">
                {[
                  { label: "Ospiti", value: room.guests },
                  { label: "Superficie", value: room.size },
                  { label: "Letto", value: room.bedType },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between py-2.5"
                  >
                    <dt className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                      {row.label}
                    </dt>
                    <dd className="text-foreground text-right font-medium">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>

            {/* Gallery lives INSIDE the left column, not in its own section
                below: the booking rail on the right is `sticky`, and sticky
                only has travel while its own grid row is taller than it is.
                With the gallery here the left column towers past the rail, so
                "Richiedi disponibilità" genuinely follows the visitor while
                they flip through the photos — which is exactly when they
                decide. A separate full-width gallery section left the rail
                with zero travel (left column ~650px vs rail ~700px). */}
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
                <RoomGalleryCoverflow images={room.gallery} />
              </FadeIn>
            </div>
          </div>

          {/* Booking rail: sticky on desktop so the one action that matters
              keeps itself in reach while the visitor reads and scrolls the
              gallery. `Card` brings the site-wide layered warm shadow and
              hover lift; the accent bar on top is the room's own colour. */}
          <FadeIn delay={0.1}>
            {/* Sticky lives on this wrapper, not on the Card, so the accent
                glow below travels with the rail instead of being left behind
                at the top of the column. */}
            <div className="relative lg:sticky lg:top-28">
              {/* The room's own colour, bleeding out softly from behind the
                  rail — same light-bleed language as the photos, so the one
                  panel that asks for the booking sits in a pool of the room's
                  identity (gold / blue / rose) instead of on bare ground. */}
              <div
                aria-hidden="true"
                className={cn(
                  "absolute -inset-6 -z-10 rounded-[2rem] opacity-45 blur-3xl",
                  accentBarClass[room.accent],
                )}
              />
              {/* A second, tighter champagne halo over the accent one: the
                  colour glow alone reads as a coloured smudge, while a warm
                  light hugging the panel's edge is what actually makes it look
                  lit. Two layers at different radii = glow with a source. */}
              <div
                aria-hidden="true"
                className="bg-gold absolute -inset-2 -z-10 rounded-3xl opacity-30 blur-xl"
              />
              <Card className="gap-0 overflow-hidden p-0">
                <div
                  aria-hidden="true"
                  className={cn("h-1 w-full", accentBarClass[room.accent])}
                />
                <div className="flex flex-col gap-4 p-6">
                  <p className="font-display text-lg font-medium tracking-tight">
                    Dotazioni
                  </p>
                  <Stagger className="flex flex-col gap-3" staggerChildren={0.05}>
                    {room.amenities.map((amenity) => (
                      <StaggerItem
                        key={amenity.label}
                        className="flex items-center gap-3"
                      >
                        <amenity.icon
                          className="text-gold size-4.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm">{amenity.label}</span>
                      </StaggerItem>
                    ))}
                  </Stagger>
                  <Button asChild size="lg" className="mt-2">
                    <Link href={`/contatti?camera=${room.slug}#richiedi-disponibilita`}>
                      Richiedi disponibilità
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <RoomNav otherRooms={otherRooms} />
    </>
  );
}
