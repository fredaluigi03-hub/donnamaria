import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Galleria",
  description:
    "Sfoglia la galleria fotografica di Donna Maria Suite & Relax: camere, piscina, wellness ed esterni.",
});

export default function GalleriaPage() {
  return (
    <>
      <Hero
        variant="compact"
        kicker="Galleria"
        title="Ogni angolo, raccontato per immagini"
        imageSrc="/images/pool/hero.png"
        imageAlt="Piscina panoramica di Donna Maria Suite & Relax"
      />

      <Section>
        <Container>
          <GalleryGrid />
        </Container>
      </Section>
    </>
  );
}
