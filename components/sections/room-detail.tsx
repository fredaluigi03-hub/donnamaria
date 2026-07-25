import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/sections/hero";
import { RoomGalleryCoverflow } from "@/components/sections/room-gallery-coverflow";
import { RoomMeta } from "@/components/sections/room-meta";
import { RoomNav } from "@/components/sections/room-nav";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { rooms } from "@/config/rooms";
import type { Room } from "@/types";

/**
 * Shared layout for the three room detail pages — data-driven from
 * config/rooms.ts so each page.tsx stays a one-line composition instead of
 * ~150 lines of near-identical markup. Stays a Server Component: `room`
 * carries lucide-react icon components (amenities), which can only be
 * rendered as JSX here, not passed as a prop into a "use client" component
 * (see RoomNav for the one part of this page that does need the client).
 */
export function RoomDetail({ room }: { room: Room }) {
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
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col items-start gap-5 lg:col-span-2">
            <RoomMeta room={room} />
            <FadeIn>
              <p className="text-muted-foreground text-lg font-light text-pretty">
                {room.description}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-6">
              <p className="font-display text-sm font-semibold tracking-tight">
                Dotazioni
              </p>
              <Stagger className="flex flex-col gap-3" staggerChildren={0.05}>
                {room.amenities.map((amenity) => (
                  <StaggerItem key={amenity.label} className="flex items-center gap-3">
                    <amenity.icon
                      className="text-gold size-4.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm">{amenity.label}</span>
                  </StaggerItem>
                ))}
              </Stagger>
              <Button asChild className="mt-2">
                <Link href={`/contatti?camera=${room.slug}#richiedi-disponibilita`}>
                  Richiedi disponibilità
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="bg-secondary/30 pt-0">
        <Container>
          <FadeIn className="mb-8">
            <h2 className="font-display text-2xl leading-[1.05] font-medium tracking-tight md:text-3xl">
              Galleria fotografica
            </h2>
          </FadeIn>
          <RoomGalleryCoverflow images={room.gallery} />
        </Container>
      </Section>

      <RoomNav otherRooms={otherRooms} />
    </>
  );
}
