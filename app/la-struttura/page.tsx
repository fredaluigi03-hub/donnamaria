import type { Metadata } from "next";
import Image from "next/image";
import { Coffee, Droplets, Gift, KeyRound, ParkingCircle, Waves } from "lucide-react";

import { Hero } from "@/components/sections/hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Features, type Service } from "@/components/sections/features";
import { FadeIn } from "@/components/animations/fade-in";
import { SlideIn } from "@/components/animations/slide-in";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "La Struttura",
  description:
    "La storia di Donna Maria Suite & Relax: nata da una passione di famiglia a Serino, nel cuore dell'Irpinia.",
});

const structureServices: Service[] = [
  {
    icon: Coffee,
    title: "Colazione",
    description:
      "Colazione dolce e salata con prodotti locali, servita in camera o all'aperto.",
  },
  {
    icon: Droplets,
    title: "Spa privata",
    description:
      "Jacuzzi con illuminazione soffusa e sauna a infrarossi, disponibili su prenotazione.",
  },
  {
    icon: Waves,
    title: "Piscina",
    description: "Piscina all'aperto con lettini, ombrelloni e vista sulle colline.",
  },
  {
    icon: KeyRound,
    title: "Check-in flessibile",
    description: "Ti accogliamo dalle 15:00. Su richiesta anticipiamo o posticipiamo.",
  },
  {
    icon: ParkingCircle,
    title: "Parcheggio",
    description: "Parcheggio interno riservato, gratuito per gli ospiti.",
  },
  {
    icon: Gift,
    title: "Kit di cortesia",
    description: "Accappatoi, ciabattine e prodotti da bagno artigianali in ogni camera.",
  },
];

export default function LaStrutturaPage() {
  return (
    <>
      <Hero
        variant="compact"
        kicker="La Struttura"
        title="Donna Maria: la nostra idea di ospitalità"
        imageSrc="/images/pool/hero.png"
        imageAlt="Piscina e area relax esterna di Donna Maria Suite & Relax"
        videoSrc="/videos/pool-dinamic.mp4"
      />

      <Section>
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:order-2">
            <FadeIn>
              <Kicker>La nostra storia</Kicker>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
                Nata da una passione di famiglia.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1} className="flex max-w-lg flex-col gap-4">
              <p className="text-muted-foreground text-lg font-light text-pretty">
                Donna Maria Suite &amp; Relax è il nostro modo di raccontare
                l&apos;Irpinia: quella dei boschi del Terminio, dei calici di Fiano, delle
                notti stellate. Abbiamo trasformato una casa di famiglia a Serino in un
                piccolo rifugio per chi cerca comfort, silenzio e accoglienza sincera.
              </p>
              <p className="text-muted-foreground text-lg font-light text-pretty">
                Ogni suite è arredata con cura: tessuti scelti uno a uno, luci soffuse,
                dettagli che fanno la differenza. Fuori, la piscina panoramica, la jacuzzi
                al tramonto e la sauna a infrarossi completano l&apos;esperienza.
              </p>
            </FadeIn>
          </div>

          <SlideIn direction="left" className="lg:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
              <Image
                src="/images/wellness/jacuzzi2.png"
                alt="Jacuzzi al tramonto di Donna Maria Suite & Relax"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </SlideIn>
        </Container>
      </Section>

      <Features
        badgeLabel="Servizi"
        title="Tutto ciò che rende speciale un soggiorno."
        services={structureServices}
        className="bg-secondary/30"
      />
    </>
  );
}
