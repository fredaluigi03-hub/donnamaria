import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { RoomsShowcase } from "@/components/sections/rooms-showcase";
import { FadeIn } from "@/components/animations/fade-in";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Le Camere",
  description:
    "Suite Francy, Domi e Mery: tre atmosfere uniche a Donna Maria Suite & Relax, tra romanticismo, comfort e benessere.",
});

export default function CamerePage() {
  return (
    <>
      <Hero
        variant="compact"
        kicker="Le Camere"
        title="Tre atmosfere, una sola cura per il dettaglio"
        subtitle="Ogni camera racconta un'esperienza diversa — scegli quella più adatta al vostro soggiorno."
        imageSrc="/images/rooms/suite/lettosuiteorizzontale.jpg"
        imageAlt="Letto a baldacchino della Suite Francy nella luce calda della sera"
        videoSrc="/videos/pool-dinamic.mp4"
        primaryCta={{
          label: "Richiedi disponibilità",
          href: "/contatti#richiedi-disponibilita",
        }}
      />

      <Section>
        <Container>
          <FadeIn className="mb-4 max-w-2xl">
            <p className="text-muted-foreground text-lg font-light text-pretty">
              Dalla suite romantica con sauna privata all&apos;appartamento pensato per le
              famiglie, fino alla camera dai delicati toni rosa: ogni ambiente è stato
              arredato con la stessa cura, pensato per far sentire ogni ospite a proprio
              agio.
            </p>
          </FadeIn>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <RoomsShowcase bare />
        </Container>
      </Section>
    </>
  );
}
