import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { HoverScale } from "@/components/animations/hover-scale";

const gallery = [
  { src: "/images/pool/piscina2.png", alt: "Vista laterale della piscina" },
  { src: "/images/pool/piescina3.png", alt: "Lettini a bordo piscina" },
  { src: "/images/pool/piscina4.png", alt: "Dettaglio della piscina al tramonto" },
];

/**
 * Pool photo gallery — a direct visual continuation of `OutdoorExperience`
 * (the full-bleed video band right above it), not a separate "Piscina"
 * section with its own kicker/heading/video. Originally had both: its own
 * intro copy *and* a second `BackgroundVideo` playing the same `pool.mp4`
 * already shown above. Merged deliberately — the video story is told once,
 * by `OutdoorExperience`; this is just the supporting still gallery,
 * `pt-0` so it reads as one continuous "outdoor" moment instead of two
 * back-to-back sections repeating themselves.
 */
export function PoolShowcase() {
  return (
    <Section className="bg-secondary/30 pt-0">
      <Container>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg lg:aspect-[16/11]">
              <Image
                src="/images/pool/hero.png"
                alt="Piscina panoramica di Donna Maria Suite & Relax"
                fill
                quality={90}
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Stagger
            className="grid grid-cols-2 gap-4 lg:grid-cols-1"
            staggerChildren={0.08}
          >
            {gallery.map((image) => (
              <StaggerItem key={image.src} className="last:col-span-2 lg:last:col-span-1">
                <HoverScale scale={1.03} className="h-full">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:aspect-auto lg:h-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
