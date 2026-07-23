import { Car, Coffee, ShieldCheck, Wifi, Wind, type LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { HoverScale } from "@/components/animations/hover-scale";
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
            <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              {title}
            </h2>
          </FadeIn>
        </div>

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <HoverScale scale={1.02}>
                <Card className="h-full">
                  <CardHeader>
                    <service.icon className="text-gold mb-2 size-6" aria-hidden="true" />
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
