import Image from "next/image";
import { Flame, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/fade-in";
import { Reveal } from "@/components/animations/reveal";
import { SlideIn } from "@/components/animations/slide-in";
import { HoverScale } from "@/components/animations/hover-scale";

/** "Wellness" — jacuzzi + sauna as the site's signature amenity, plus a small Fitness tile. */
export function WellnessShowcase() {
  return (
    <Section id="wellness" className="scroll-mt-28">
      <Container>
        <div className="mb-12 flex flex-col items-start gap-4">
          <FadeIn>
            <Badge className="bg-forest text-forest-foreground border-transparent">
              Wellness
            </Badge>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              Jacuzzi &amp; Sauna, il cuore del benessere.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="max-w-xl">
            <p className="text-muted-foreground text-lg font-light text-pretty">
              Un&apos;area interamente dedicata al relax profondo: acqua calda, vapore e
              silenzio, per lasciare fuori dalla porta ogni pensiero.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:aspect-[16/13]">
              <Image
                src="/images/wellness/jacuzzi.png"
                alt="Jacuzzi riscaldata nell'area wellness"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              <div className="from-forest/50 absolute inset-0 bg-gradient-to-t via-transparent to-transparent mix-blend-multiply" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-900 backdrop-blur-sm">
                <Sparkles className="text-gold size-4" aria-hidden="true" />
                Jacuzzi riscaldata
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-1">
            <SlideIn direction="right">
              <HoverScale scale={1.03}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/wellness/jacuzzi2.png"
                    alt="Dettaglio della jacuzzi al tramonto"
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </HoverScale>
            </SlideIn>

            <SlideIn direction="right" delay={0.08}>
              <HoverScale scale={1.03}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/wellness/sauna2.png"
                    alt="Sauna in legno dell'area wellness"
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900 backdrop-blur-sm">
                    <Flame className="text-gold size-3.5" aria-hidden="true" />
                    Sauna
                  </div>
                </div>
              </HoverScale>
            </SlideIn>
          </div>
        </div>

        <FadeIn delay={0.15} className="mt-4">
          <HoverScale scale={1.01}>
            <div className="relative flex h-40 w-full items-end overflow-hidden rounded-lg md:h-48">
              <Image
                src="/images/fitness/hero.png"
                alt="Angolo fitness della struttura"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="relative z-10 flex w-full items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="font-display text-lg font-medium text-white">Fitness</p>
                <p className="max-w-xs text-right text-sm text-white/80">
                  Un piccolo spazio attrezzato per restare in forma anche in vacanza.
                </p>
              </div>
            </div>
          </HoverScale>
        </FadeIn>
      </Container>
    </Section>
  );
}
