import {
  Car,
  ChefHat,
  Coffee,
  Gift,
  ShieldCheck,
  Sparkles,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Glow } from "@/components/ui/glow";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { FadeIn } from "@/components/animations/fade-in";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { cn } from "@/lib/utils";

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const defaultServices: Service[] = [
  {
    icon: Wifi,
    title: "Wi-Fi gratuito",
    description:
      "Connessione veloce in tutta la struttura, per restare connessi quando serve.",
  },
  {
    icon: Coffee,
    title: "Colazione curata",
    description:
      "Ogni mattina una colazione ricca, preparata con cura e ingredienti genuini.",
  },
  {
    icon: Car,
    title: "Parcheggio privato",
    description: "Posto auto riservato agli ospiti, a due passi dall'ingresso.",
  },
  {
    icon: Wind,
    title: "Aria condizionata",
    description: "Clima piacevole in ogni ambiente, in ogni stagione dell'anno.",
  },
  {
    icon: ShieldCheck,
    title: "Pulizia impeccabile",
    description: "Ambienti curati nel minimo dettaglio, per un soggiorno senza pensieri.",
  },
  {
    icon: Waves,
    title: "Piscina panoramica",
    description:
      "Vista sulle colline dell'Irpinia, aperta a tutti gli ospiti della struttura.",
  },
  {
    icon: Sparkles,
    title: "Sauna e vasca idromassaggio privata",
    description:
      "Nella Suite Francy: un angolo di benessere privato, disponibile solo per chi la prenota.",
  },
  {
    icon: ChefHat,
    title: "Cucina attrezzata",
    description:
      "Nell'appartamento Domi: cucina completa e divano letto, per soggiorni più lunghi o in famiglia.",
  },
  {
    icon: Gift,
    title: "Kit di cortesia e biancheria inclusa",
    description:
      "Tutto già pronto all'arrivo: accappatoi, ciabattine e biancheria di qualità.",
  },
];

export interface FeaturesProps {
  badgeLabel?: string;
  title?: string;
  services?: Service[];
  className?: string;
}

/**
 * "Servizi" — amenity/service grid. Takes optional content so the same
 * card-grid layout can be reused with a different service list (see
 * app/la-struttura/page.tsx) instead of duplicating this markup.
 */
export function Features({
  badgeLabel = "Servizi",
  title = "Ogni comfort, pensato per voi.",
  services = defaultServices,
  className,
}: FeaturesProps) {
  return (
    <Section
      className={cn(
        "from-secondary/40 via-secondary/70 to-secondary/30 relative overflow-hidden bg-gradient-to-b py-24 md:py-32",
        className,
      )}
    >
      {/* Background ambient warm light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-10 -z-10 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.25) 0%, transparent 70%)",
        }}
      />

      <Container>
        <div className="mb-14 flex flex-col items-start gap-4">
          <FadeIn>
            <Kicker>{badgeLabel}</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <SectionTitle>{title}</SectionTitle>
          </FadeIn>
        </div>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.title} className="relative h-full">
              <Tilt3D className="h-full w-full">
                <Glow subtle />
                <Card className="border-border/80 bg-card/95 hover:border-gold/50 hover:shadow-gold/15 flex h-full flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-md shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div
                    aria-hidden="true"
                    className="from-gold/70 via-gold to-gold/70 h-1 w-full bg-gradient-to-r"
                  />
                  <div className="flex flex-col gap-3.5 p-7">
                    <div className="bg-gold/10 flex size-11 items-center justify-center rounded-xl">
                      <service.icon
                        className="text-gold size-5.5 drop-shadow-[0_2px_8px_rgba(184,149,106,0.45)]"
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold tracking-tight">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                </Card>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
