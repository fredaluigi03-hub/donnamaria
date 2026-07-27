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
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { FadeIn } from "@/components/animations/fade-in";

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
    <Section className={className}>
      <Container>
        <div className="mb-12 flex flex-col items-start gap-4">
          <FadeIn>
            <Kicker>{badgeLabel}</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <SectionTitle>{title}</SectionTitle>
          </FadeIn>
        </div>

        {/* No `HoverScale` wrapper around these cards: `Card` now owns the
            hover lift itself (see components/ui/card.tsx), and stacking a scale
            on top of it gave two competing transforms on the same gesture. */}
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.title} className="group relative h-full">
              {/* Champagne light bleeding from behind the card — the same
                  treatment as the booking rail on the room pages, in gold
                  instead of the per-room accent. Faint at rest so nine of them
                  never turn the section into a light show, and it comes up on
                  hover so the card the visitor is reading is the one that
                  glows. */}
              <div
                aria-hidden="true"
                className="bg-gold pointer-events-none absolute -inset-2 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-(--duration-base) group-hover:opacity-25"
              />
              <Card className="h-full gap-0 overflow-hidden p-0">
                {/* Gold hairline across the top, mirroring the accent bar on the
                    room Dotazioni panel — the detail that ties the two lists
                    together as the same kind of object. */}
                <div
                  aria-hidden="true"
                  className="from-gold/70 via-gold to-gold/70 h-0.5 w-full bg-gradient-to-r"
                />
                <div className="flex flex-col gap-3 p-6">
                  <service.icon
                    className="text-gold size-6 drop-shadow-[0_2px_8px_rgba(184,149,106,0.45)]"
                    aria-hidden="true"
                  />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
