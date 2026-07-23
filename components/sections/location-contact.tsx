import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { Reveal } from "@/components/animations/reveal";
import { siteConfig } from "@/config/site";

const mapQuery = encodeURIComponent(
  `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city} ${siteConfig.address.province}`,
);

/** "Posizione" — address, map embed (no API key needed) and quick contact actions. */
export function LocationContact() {
  return (
    <Section>
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <FadeIn>
            <Kicker>Posizione</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-display max-w-lg text-3xl leading-[1.05] font-medium tracking-tight md:text-4xl">
              Nel cuore verde dell&apos;Irpinia.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="max-w-md">
            <p className="text-muted-foreground text-lg font-light text-pretty">
              Immersi tra le colline di Serino, a pochi passi dai principali punti
              d&apos;interesse della zona — il punto di partenza ideale per esplorare
              l&apos;Irpinia e allo stesso tempo un rifugio tranquillo dove tornare a fine
              giornata.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="flex items-start gap-2.5">
            <MapPin className="text-gold mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="text-foreground text-sm">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.postalCode} {siteConfig.address.city} (
              {siteConfig.address.province}), {siteConfig.address.countryName}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden="true" />
                Apri in Google Maps
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" />
                Scrivici su WhatsApp
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a href={`tel:${siteConfig.phone}`}>
                <Phone aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
            </Button>
          </FadeIn>
        </div>

        <Reveal>
          <div className="border-border aspect-[4/3] w-full overflow-hidden rounded-lg border">
            <iframe
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              title={`Mappa: ${siteConfig.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
