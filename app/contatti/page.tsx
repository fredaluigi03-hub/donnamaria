import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeading } from "@/components/ui/page-heading";
import { LogoWatermark } from "@/components/ui/logo-watermark";
import { BookingForm } from "@/components/forms/booking-form";
import { FadeIn } from "@/components/animations/fade-in";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Contatti",
  description:
    "Richiedete disponibilità per il vostro soggiorno a Donna Maria Suite & Relax, oppure contattateci direttamente.",
});

export default function ContattiPage() {
  return (
    <Section className="relative pt-32">
      <LogoWatermark />

      <Container className="relative z-10">
        <FadeIn>
          <PageHeading
            title="Raccontaci il tuo soggiorno ideale."
            description="Compila il modulo per richiedere disponibilità, oppure contattaci direttamente: ti risponderemo il prima possibile."
            descriptionClassName="max-w-xl"
          />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <FadeIn
            delay={0.1}
            id="richiedi-disponibilita"
            className="scroll-mt-28 lg:col-span-2"
          >
            <Suspense>
              <BookingForm />
            </Suspense>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="border-border bg-card flex flex-col gap-5 rounded-lg border p-6">
              <p className="font-display text-sm font-semibold tracking-tight">
                Contatto diretto
              </p>

              <a
                href={`tel:${siteConfig.phone}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-3 text-sm transition-colors"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-3 text-sm transition-colors"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                Scrivici su WhatsApp
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-3 text-sm transition-colors"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Via+Tenente+Paolo+de+Vivo+10+83028+Serino+AV"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-start gap-3 text-sm transition-colors"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.postalCode} {siteConfig.address.city} (
                  {siteConfig.address.province})
                </span>
              </a>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
