import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";

export function Cta() {
  return (
    <Section>
      <Container>
        <div className="bg-primary text-primary-foreground flex flex-col items-start gap-6 rounded-2xl px-8 py-14 md:px-14 md:py-20">
          <Reveal>
            <h2 className="font-display max-w-xl text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              Pronti a regalarvi qualche giorno di puro relax?
            </h2>
          </Reveal>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contatti#richiedi-disponibilita">
              Prenota il tuo soggiorno
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
