import { MapPin, MessageCircle, Phone, Compass, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { siteConfig } from "@/config/site";

const mapQuery = encodeURIComponent(
  `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city} ${siteConfig.address.province}`,
);

/** "Posizione" — 3D Immersive location stage with Tilt3D interactions and glowing depth layers. */
export function LocationContact() {
  return (
    <Section className="from-secondary/30 via-secondary/60 to-secondary/20 text-foreground relative overflow-hidden bg-gradient-to-b py-24 md:py-32">
      {/* 3D Ambient Glowing Light Sources */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 -z-0 h-[32rem] w-[32rem] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.3) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 -bottom-24 -z-0 h-[36rem] w-[36rem] rounded-full opacity-30 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.2) 0%, transparent 70%)",
        }}
      />

      <Container className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Contact Info 3D Card */}
        <div className="lg:col-span-5">
          <Tilt3D className="w-full">
            <div className="border-border/80 bg-card/90 hover:border-gold/50 flex flex-col items-start gap-6 rounded-3xl border p-8 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-500 md:p-10">
              <FadeIn>
                <div className="border-gold/40 bg-gold/10 text-gold inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[0.7rem] font-medium tracking-[0.25em] uppercase">
                  <Compass className="size-3.5" aria-hidden="true" />
                  40.8542° N · 14.8732° E
                </div>
              </FadeIn>
              <FadeIn delay={0.05}>
                <h2 className="font-display text-foreground text-3xl font-medium tracking-tight md:text-4xl">
                  Nel cuore verde dell&apos;Irpinia.
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-muted-foreground text-base leading-relaxed font-light">
                  Immersi tra le colline di Serino, il punto di partenza ideale per
                  esplorare l&apos;Irpinia e un rifugio pacifico di puro relax.
                </p>
              </FadeIn>

              <FadeIn
                delay={0.15}
                className="border-border/60 flex w-full items-start gap-3.5 border-t pt-4"
              >
                <div className="border-gold/30 bg-gold/15 flex size-10 shrink-0 items-center justify-center rounded-full border shadow-sm">
                  <MapPin className="text-gold size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {siteConfig.address.street}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {siteConfig.address.postalCode} {siteConfig.address.city} (
                    {siteConfig.address.province}), {siteConfig.address.countryName}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2} className="flex w-full flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-gold/15 rounded-full px-6 font-medium shadow-md transition-all hover:shadow-lg"
                >
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin aria-hidden="true" />
                    Apri Mappa 3D
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-border/80 bg-background/80 hover:bg-background rounded-full px-6"
                >
                  <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" />
                    WhatsApp
                  </a>
                </Button>
              </FadeIn>
            </div>
          </Tilt3D>
        </div>

        {/* Map 3D Immersive Frame */}
        <div className="lg:col-span-7">
          <Tilt3D className="w-full">
            <div className="border-border/80 ring-gold/20 relative aspect-[4/3] w-full overflow-hidden rounded-3xl border shadow-2xl ring-1 shadow-black/10">
              <iframe
                src={`https://www.google.com/maps?q=${mapQuery}&t=k&z=17&output=embed`}
                title={`Mappa Satellitare: ${siteConfig.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full contrast-[1.05] saturate-[1.15] filter"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute right-3 bottom-3 left-3 flex flex-col items-start justify-between gap-1 rounded-2xl border border-white/20 bg-black/80 p-3 text-xs text-white shadow-xl backdrop-blur-md sm:right-5 sm:bottom-5 sm:left-5 sm:flex-row sm:items-center sm:p-3.5">
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles className="text-gold size-3.5 shrink-0" />
                  Donna Maria Suite &amp; Relax · Serino (AV)
                </span>
                <span className="text-gold text-[0.65rem] font-semibold tracking-widest uppercase sm:text-[0.7rem]">
                  Vista Satellitare 3D
                </span>
              </div>
            </div>
          </Tilt3D>
        </div>
      </Container>
    </Section>
  );
}
