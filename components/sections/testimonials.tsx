import { Quote } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Glow } from "@/components/ui/glow";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { FadeIn } from "@/components/animations/fade-in";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { siteConfig } from "@/config/site";

interface Review {
  author: string;
  country: string;
  score: string;
  quote: string;
}

const reviews: Review[] = [
  {
    author: "Garzone",
    country: "Italia",
    score: "10/10",
    quote:
      "Soggiorno semplicemente perfetto! La signora che ci ha accolto è stata di una gentilezza e disponibilità davvero rare, facendoci sentire come a casa fin dal primo momento. L'ambiente è curato con amore in ogni minimo dettaglio, elegante, accogliente e impeccabilmente pulito. La colazione è stata una vera coccola: ricca, deliziosa e preparata con grande cura. Torneremo sicuramente e lo consigliamo di cuore.",
  },
  {
    author: "Loris",
    country: "Italia",
    score: "10/10",
    quote: "La gentilezza e la professionalità della titolare Giusy.",
  },
  {
    author: "Luigi",
    country: "Italia",
    score: "9/10",
    quote: "Tutto curato nei minimi particolari. Accoglienza gioviale.",
  },
];

/**
 * "Recensioni" — real guest reviews, quoted verbatim. The "Leggi tutte le
 * recensioni" button only renders once `siteConfig.reviewsUrl` is set to a
 * real Google/Booking.com profile — no dead `href="#"` in the meantime.
 */
export function Testimonials() {
  return (
    <Section className="from-secondary/30 via-secondary/60 to-secondary/20 relative overflow-hidden bg-gradient-to-b py-24 md:py-32">
      {/* Soft champagne glow in background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-1/3 -z-10 h-[30rem] w-[30rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(184,149,106,0.25) 0%, transparent 70%)",
        }}
      />

      <Container>
        <div className="mb-14 flex flex-col items-start gap-4">
          <FadeIn>
            <Kicker>Recensioni</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <SectionTitle>Le parole di chi è stato nostro ospite.</SectionTitle>
          </FadeIn>
        </div>

        <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-3" staggerChildren={0.1}>
          {reviews.map((review) => (
            <StaggerItem key={review.author} className="relative h-full">
              <Tilt3D className="h-full w-full">
                <Glow subtle />
                <Card className="border-border/80 bg-card/90 hover:border-gold/50 hover:shadow-gold/15 flex h-full flex-col overflow-hidden rounded-2xl p-0 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                  <div
                    aria-hidden="true"
                    className="from-gold/80 via-gold to-gold/80 h-1 w-full bg-gradient-to-r"
                  />
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-7">
                    <div className="flex items-center justify-between">
                      <div className="bg-gold/10 flex size-10 items-center justify-center rounded-full">
                        <Quote
                          className="text-gold size-5 drop-shadow-[0_2px_8px_rgba(184,149,106,0.4)]"
                          aria-hidden="true"
                        />
                      </div>
                      <Badge className="bg-gold/15 text-gold border-gold/30 px-3 py-1 text-xs font-semibold tracking-wide shadow-sm">
                        Punteggio {review.score}
                      </Badge>
                    </div>
                    <p className="font-display text-foreground text-base leading-relaxed text-pretty italic">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                    <div className="border-border/50 border-t pt-4">
                      <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
                        {review.author}
                      </p>
                      <p className="text-muted-foreground text-xs font-medium">
                        {review.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>

        {siteConfig.reviewsUrl && (
          <FadeIn delay={0.2} className="mt-12 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full shadow-sm transition-all hover:shadow-md"
            >
              <a href={siteConfig.reviewsUrl} target="_blank" rel="noopener noreferrer">
                Leggi tutte le recensioni
              </a>
            </Button>
          </FadeIn>
        )}
      </Container>
    </Section>
  );
}
