import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { RoomGalleryCoverflow } from "@/components/sections/room-gallery-coverflow";
import { galleryImages } from "@/config/gallery";

import { Tilt3D } from "@/components/animations/tilt-3d";
import { AiTag } from "@/components/ui/ai-disclosure";

const preview = [
  galleryImages.find((image) => image.category === "Suite Francy")!,
  galleryImages.find((image) => image.category === "Piscina")!,
  galleryImages.find((image) => image.category === "Wellness")!,
  galleryImages.find((image) => image.category === "Domi")!,
  galleryImages.find((image) => image.category === "Mery")!,
  galleryImages.find((image) => image.category === "Esterni")!,
];

/** Compact teaser grid linking through to the full filterable /galleria page. */
export function GalleryPreview() {
  return (
    <Section className="relative overflow-hidden py-24">
      {/* Subtle warm champagne radial light pool */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.22) 0%, transparent 70%)",
        }}
      />

      <Container>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col items-start gap-4">
            <FadeIn>
              <Kicker>Galleria</Kicker>
            </FadeIn>
            <FadeIn delay={0.05}>
              <SectionTitle>Ogni dettaglio racconta la nostra cura.</SectionTitle>
            </FadeIn>
          </div>
          <FadeIn delay={0.1}>
            <Button
              asChild
              className="border-gold/40 hover:shadow-gold/30 rounded-full border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-xs font-semibold tracking-widest text-amber-100 uppercase shadow-lg transition-all hover:scale-105"
            >
              <Link href="/galleria">
                Scopri tutta la galleria
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </FadeIn>
        </div>

        {/* Dynamic Pool Video Feature Card */}
        <FadeIn className="mb-12">
          <Tilt3D className="w-full">
            <div className="border-gold/40 ring-gold/20 relative aspect-[16/9] w-full overflow-hidden rounded-3xl border shadow-2xl ring-1 shadow-black/10 md:aspect-[21/9]">
              <video
                src="/videos/pool-dinamic.mp4"
                poster="/images/pool-fallback.webp"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <AiTag className="top-6 left-6" />
              <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                    Esperienza Panoramica
                  </span>
                  <h3 className="font-display text-xl font-medium text-white md:text-2xl">
                    Piscina &amp; Relax all&apos;aperto
                  </h3>
                </div>
                <span className="hidden items-center gap-2 rounded-full border border-white/30 bg-black/50 px-4 py-1.5 text-xs text-white backdrop-blur-md sm:inline-flex">
                  Video 4K Live
                </span>
              </div>
            </div>
          </Tilt3D>
        </FadeIn>

        <Tilt3D className="w-full">
          <RoomGalleryCoverflow images={preview} />
        </Tilt3D>
      </Container>
    </Section>
  );
}
