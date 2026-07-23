import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { FadeIn } from "@/components/animations/fade-in";
import { Reveal } from "@/components/animations/reveal";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { HoverScale } from "@/components/animations/hover-scale";

const gallery = [
  { src: "/images/pool/piscina2.png", alt: "Vista laterale della piscina" },
  { src: "/images/pool/piescina3.png", alt: "Lettini a bordo piscina" },
  { src: "/images/pool/piscina4.png", alt: "Dettaglio della piscina al tramonto" },
];

/** "Piscina" — large reveal photo + a small triptych of detail shots. */
export function PoolShowcase() {
  return (
    <Section className="bg-secondary/30">
      <Container>
        <div className="mb-12 flex flex-col items-start gap-4">
          <FadeIn>
            <Kicker>Piscina</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              Un tuffo di relax, all&apos;aperto.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="max-w-xl">
            <p className="text-muted-foreground text-lg font-light text-pretty">
              Uno spazio pensato per rigenerarsi, tra il sole dell&apos;Irpinia e la
              quiete delle colline circostanti — ideale per un pomeriggio di puro relax.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg lg:aspect-[16/11]">
              <Image
                src="/images/pool/hero.png"
                alt="Piscina panoramica di Donna Maria Suite & Relax"
                fill
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
