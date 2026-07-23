import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { HoverScale } from "@/components/animations/hover-scale";
import { FadeIn } from "@/components/animations/fade-in";
import { RoomMeta } from "@/components/sections/room-meta";
import { rooms } from "@/config/rooms";
import type { Room } from "@/types";
import { cn } from "@/lib/utils";

const accentBadgeClass: Record<Room["accent"], string> = {
  suite: "bg-room-suite text-room-suite-foreground border-transparent",
  domi: "bg-room-domi text-room-domi-foreground border-transparent",
  mery: "bg-room-mery text-room-mery-foreground border-transparent",
};

export interface RoomsShowcaseProps {
  /** Render as a plain grid without the section kicker/heading — used on the /camere hub. */
  bare?: boolean;
}

/**
 * "Le Camere" — one card per room from config/rooms.ts, single source of
 * truth reused by the homepage and the /camere hub page.
 */
export function RoomsShowcase({ bare = false }: RoomsShowcaseProps) {
  const grid = (
    <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3" staggerChildren={0.1}>
      {rooms.map((room) => (
        <StaggerItem key={room.slug}>
          <Link href={`/camere/${room.slug}`} className="block h-full">
            <HoverScale scale={1.015} className="h-full">
              <Card className="h-full overflow-hidden">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={room.coverImage}
                    alt={`${room.name} — ${room.tagline}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span
                    className={cn(
                      "absolute top-4 left-4 h-2.5 w-2.5 rounded-full",
                      accentBadgeClass[room.accent],
                    )}
                    aria-hidden="true"
                  />
                </div>
                <CardHeader className="pt-5">
                  <CardTitle className="font-display text-xl font-medium">
                    {room.name}
                  </CardTitle>
                  <CardDescription>{room.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pb-5">
                  <RoomMeta room={room} className="text-xs" />
                  <span className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                    Scopri la camera
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            </HoverScale>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );

  if (bare) return grid;

  return (
    <Section id="suites" className="scroll-mt-28">
      <Container>
        <div className="mb-12 flex flex-col items-start gap-4">
          <FadeIn>
            <Kicker>Le Camere</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              Tre atmosfere, un&apos;unica cura per il dettaglio.
            </h2>
          </FadeIn>
        </div>
        {grid}
      </Container>
    </Section>
  );
}
