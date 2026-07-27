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
              <SectionTitle>Ogni dettaglio racconta la nostra cura.</SectionTitle>
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

        {/* Was a row of six flat square thumbnails — six small pictures nobody
            looks at. The same six photos in the 3D coverflow give one large
            image to actually look at, something to click, and real depth from
            the rotated neighbours. Same component as the room detail pages, so
            the gallery pattern reads as one language across the site. */}
        <RoomGalleryCoverflow images={preview} />
      </Container>
    </Section>
  );
}
