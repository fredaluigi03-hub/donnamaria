import { Quote } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { FadeIn } from "@/components/animations/fade-in";
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
    <Section className="bg-secondary/30">
      <Container>
        <div className="mb-12 flex flex-col items-start gap-4">
          <FadeIn>
            <Kicker>Recensioni</Kicker>
          </FadeIn>
          <FadeIn delay={0.05}>
            <SectionTitle>Le parole di chi è stato nostro ospite.</SectionTitle>
          </FadeIn>
        </div>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3" staggerChildren={0.1}>
          {reviews.map((review) => (
            <StaggerItem key={review.author}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 pt-6 pb-6">
                  <div className="flex items-center justify-between">
                    <Quote className="text-gold size-6" aria-hidden="true" />
                    {/* Score in the brand champagne, not neutral grey — a 10/10
                        is the most persuasive pixel on this card and deserves
                        the accent colour. */}
                    <Badge className="bg-gold/15 text-gold border-transparent font-semibold">
                      {review.score}
                    </Badge>
                  </div>
                  <p className="text-foreground grow text-sm text-pretty">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    {review.author} — {review.country}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        {siteConfig.reviewsUrl && (
          <FadeIn delay={0.2} className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" asChild>
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
