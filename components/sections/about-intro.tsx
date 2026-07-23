import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { FadeIn } from "@/components/animations/fade-in";
import { SlideIn } from "@/components/animations/slide-in";
import { Stagger, StaggerItem } from "@/components/animations/stagger";

const highlights = ["3 suite uniche", "Piscina panoramica", "Jacuzzi & Sauna"];

/**
 * "Chi siamo" split section — photo collage + intro copy. No existing
 * primitive covers an image/text split, so this is a new section (per
 * prompts/new-page.md, only added because nothing else fit).
 */
export function AboutIntro() {
  return (
    <Section>
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SlideIn direction="left" className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
            <Image
              src="/images/exterior/hero.png"
              alt="Ingresso e facciata di Donna Maria Suite & Relax"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="border-background bg-card absolute -right-6 -bottom-8 hidden aspect-[4/3] w-1/2 overflow-hidden rounded-lg border-8 shadow-lg sm:block">
            <Image
              src="/images/exterior/ingresso2.png"
              alt="Dettaglio dell'ingresso della struttura"
              fill
              sizes="20vw"
              className="object-cover"
            />
          </div>
        </SlideIn>

        <div className="flex flex-col items-start gap-6 lg:pl-6">
          <FadeIn>
            <Kicker>Chi siamo</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              Un&apos;accoglienza che sa di casa, con l&apos;eleganza di un rifugio di
              charme.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="max-w-lg">
            <p className="text-muted-foreground text-lg font-light text-pretty">
              Donna Maria Suite &amp; Relax nasce a Serino, tra le colline
              dell&apos;Irpinia, come luogo pensato per chi cerca un&apos;ospitalità
              autentica e la cura del dettaglio. Ogni ambiente è stato arredato con gusto
              per regalare un soggiorno elegante e rilassante, tra spazi luminosi, comfort
              esclusivi e un&apos;atmosfera che invita a rallentare.
            </p>
          </FadeIn>

          <Stagger className="mt-2 flex flex-wrap gap-3" staggerChildren={0.06}>
            {highlights.map((item) => (
              <StaggerItem key={item}>
                <span className="border-border bg-card text-foreground inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
                  {item}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
