import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { HoverScale } from "@/components/animations/hover-scale";
import { galleryImages } from "@/config/gallery";

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
    <Section>
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col items-start gap-4">
            <FadeIn>
              <Kicker>Galleria</Kicker>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
                Ogni dettaglio racconta la nostra cura.
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.1}>
            <Button variant="outline" asChild>
              <Link href="/galleria">
                Scopri tutta la galleria
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </FadeIn>
        </div>

        <Stagger
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          staggerChildren={0.05}
        >
          {preview.map((image) => (
            <StaggerItem key={image.src}>
              <HoverScale scale={1.04}>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 16vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
